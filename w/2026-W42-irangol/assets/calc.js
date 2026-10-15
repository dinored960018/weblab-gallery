// 이랑골 청과 공판장 — 계산 (생성기 build.mjs 와 브라우저가 같이 쓴다)
// 시세 · 잔여 · 조회 결과는 날짜와 번호로 만든 시드에서 나온다. 같은 입력이면 늘 같은 값이다.
(function (g) {
  'use strict';
  const D = g.IG;
  const DAY = 86400000;
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];

  // FNV-1a 32비트
  function hash(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  }
  const rand = (s) => hash(s) / 4294967296;

  function parseIso(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    if (!m) return NaN;
    const t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
    const d = new Date(t);
    return d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] ? t : NaN;
  }
  const iso = (t) => new Date(t).toISOString().slice(0, 10);
  const dow = (t) => new Date(t).getUTCDay();
  const label = (t) => { const d = new Date(t); return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 (${DOW[d.getUTCDay()]})`; };
  const short = (t) => { const d = new Date(t); return `${d.getUTCMonth() + 1}. ${d.getUTCDate()}. (${DOW[d.getUTCDay()]})`; };
  const TODAY = parseIso(D.TODAY.iso);

  const won = (n) => Math.round(n).toLocaleString('ko-KR');
  const num1 = (n) => (Math.round(n * 10) / 10).toLocaleString('ko-KR', { maximumFractionDigits: 1 });
  const item = (id) => D.ITEMS.find((x) => x.id === id) || null;
  const grade = (id) => D.GRADES.find((x) => x.id === id) || null;
  const itemName = (it) => `${it.name} (${it.variety})`;

  // ── 경매 시계 ─────────────────────────────────────────────
  function clockSpec(id) {
    const it = item(id);
    if (!it) return null;
    const box = it.base * it.kg;
    const start = Math.ceil(box * D.CLOCK.startRate / 1000) * 1000;
    const floor = Math.floor(box * D.CLOCK.floorRate / 1000) * 1000;
    const step = Math.max(10, Math.round((start - floor) / D.CLOCK.ticks / 10) * 10);
    return { start, floor, step, ticks: Math.ceil((start - floor) / step) };
  }
  // n번째 틱의 가격 (하한가 아래로 내려가지 않는다)
  const clockPrice = (spec, n) => Math.max(spec.floor, spec.start - spec.step * n);

  // ── 시세 ─────────────────────────────────────────────────
  const inSeason = (it, month) => it.season.indexOf(month) > -1;
  function price(id, t) {
    const it = item(id);
    if (!it || isNaN(t)) return null;
    const out = { t, iso: iso(t), label: label(t), short: short(t) };
    if (dow(t) === 0) return Object.assign(out, { open: false, reason: '일요일 휴장' });
    const month = new Date(t).getUTCMonth() + 1;
    if (!inSeason(it, month) && !it.store) return Object.assign(out, { open: false, reason: '출하 철 아님 · 거래 없음' });
    const d = Math.round((t - TODAY) / DAY);
    const phase = rand(it.id) * 6.28;
    const f = 1 + 0.07 * Math.sin(d / 4.3 + phase) + 0.06 * (rand(it.id + iso(t)) - 0.5);
    const top = Math.round(it.base * f / 10) * 10;
    const vol0 = it.vol || 200;
    return Object.assign(out, {
      open: true,
      grades: D.GRADES.map((gr) => ({ id: gr.id, name: gr.name, kg: Math.round(top * gr.rate / 10) * 10 })),
      top,
      vol: Math.round(vol0 * (0.75 + 0.5 * rand('v' + it.id + iso(t))) / 10) * 10,
    });
  }
  function week(id, t) {
    const out = [];
    for (let i = 6; i >= 0; i--) out.push(price(id, t - i * DAY));
    return out;
  }

  // ── 출하 정산 ────────────────────────────────────────────
  function freightOf(kg) {
    for (const [max, fee] of D.FEE.freight) if (kg <= max) return { max, fee };
    return null;
  }
  // 입력은 문자열 그대로 받는다. 오류는 칸 이름: 고치는 법
  function settle(q) {
    const L = D.FEE.limits;
    const errors = {};
    const it = item(q.item);
    const gr = grade(q.g);
    if (!it) errors.item = '품목: 목록에서 품목을 고르세요.';
    if (!gr) errors.g = '등급: 특 · 상 · 보통 중에서 고르세요.';
    const n = Number(String(q.n).trim());
    if (String(q.n).trim() === '' || !Number.isInteger(n) || n < L.n[0] || n > L.n[1]) errors.n = `상자 수: ${L.n[0]}~${L.n[1]} 사이의 정수를 입력하세요.`;
    const kg = Number(String(q.kg).trim());
    if (String(q.kg).trim() === '' || !isFinite(kg) || kg < L.kg[0] || kg > L.kg[1] || Math.round(kg * 10) !== kg * 10) errors.kg = `상자당 중량: ${L.kg[0]}~${L.kg[1]} kg 사이로, 소수점 첫째 자리까지 입력하세요.`;
    const p = Number(String(q.p).trim());
    if (String(q.p).trim() === '' || !Number.isInteger(p) || p < L.p[0] || p > L.p[1]) errors.p = `예상 낙찰가: ${won(L.p[0])}~${won(L.p[1])}원 사이의 정수로 입력하세요.`;
    if (Object.keys(errors).length) return { ok: false, errors };

    const total = Math.floor(n * kg * p);
    const fee = Math.floor(total * D.FEE.rate / 10) * 10;
    const sort = n * gr.sort;
    const fr = freightOf(kg);
    const freight = n * fr.fee;
    const net = total - fee - sort - freight;
    const lines = [
      ['낙찰 총액', `${won(n)}상자 × ${num1(kg)} kg × ${won(p)}원`, total],
      ['상장 수수료', `${won(total)}원 × ${(D.FEE.rate * 100).toFixed(1)} %`, -fee],
      ['선별비', `${won(n)}상자 × ${won(gr.sort)}원 (${gr.name})`, -sort],
      ['운임', `${won(n)}상자 × ${won(fr.fee)}원 (${num1(fr.max)} kg 이하)`, -freight],
    ];
    return { ok: true, it, gr, n, kg, p, total, fee, sort, freight, net, lines };
  }

  // ── 반입 예약 잔여 ───────────────────────────────────────
  const B = D.BOOKING;
  const FROM = parseIso(B.from), TO = parseIso(B.to);
  function dayState(s) {
    const t = parseIso(s);
    if (isNaN(t)) return { closed: true, why: '없는 날짜' };
    if (t <= TODAY) return { closed: true, why: '지남' };
    if (t < FROM || t > TO) return { closed: true, why: '예약 기간 밖' };
    if (dow(t) === 0) return { closed: true, why: '휴장' };
    const full = hash('full' + s) % 7 === 0;
    const slots = B.slots.map((name, i) => ({ name, left: full ? 0 : hash(s + '#' + i) % (B.slotCap + 1) }));
    const left = slots.reduce((a, x) => a + x.left, 0);
    if (!left) return { closed: true, why: '마감', slots };
    return { closed: false, left, slots };
  }

  // ── 반입번호 조회 ────────────────────────────────────────
  const NO_RE = /^IG-(\d{2})(\d{2})(\d{2})-(\d{3})$/;
  function normNo(s) { return String(s || '').trim().toUpperCase(); }
  function lookup(raw) {
    const no = normNo(raw);
    const m = NO_RE.exec(no);
    if (!m) return { ok: false, error: '반입번호: IG-261015-001 형식으로 입력하세요.', no };
    const t = parseIso(`20${m[1]}-${m[2]}-${m[3]}`);
    const seq = +m[4];
    const none = { ok: true, found: false, no };
    if (isNaN(t) || t > TODAY || TODAY - t > 60 * DAY || seq === 0 || dow(t) === 0) return none;
    const h = hash(no);
    if (h % 5 === 0) return none;
    const days = Math.round((TODAY - t) / DAY);
    const stage = days === 0 ? h % 2 : days === 1 ? 2 : 3;
    const it = D.ITEMS.filter((x) => price(x.id, t) && price(x.id, t).open)[h % 7] || D.ITEMS[0];
    const gr = D.GRADES[(h >>> 3) % 3];
    const n = 40 + ((h >>> 5) % 25) * 10;
    const hh = (h >>> 9) % 3, mm = (h >>> 11) % 6;
    const r = { ok: true, found: true, no, t, label: label(t), stage, it, gr, n, kg: it.kg, inTime: `0${hh}:${mm}0`, dock: D.DOCKS.find((d) => d[2].split(' · ').indexOf(it.name) > -1) || D.DOCKS[it.kind === '과일' ? 2 : 5] };
    if (stage >= 2) {
      const pr = price(it.id, t);
      const g = pr.grades.find((x) => x.id === gr.id);
      r.p = g.kg;
      r.box = Math.round(g.kg * it.kg / 10) * 10;
    }
    if (stage >= 3) r.settle = settle({ item: it.id, g: gr.id, n: r.n, kg: it.kg, p: r.p });
    return r;
  }

  g.IGCALC = { DAY, DOW, TODAY, hash, rand, parseIso, iso, dow, label, short, won, num1, item, grade, itemName, clockSpec, clockPrice, inSeason, price, week, freightOf, settle, dayState, lookup, normNo, NO_RE };
})(typeof window !== 'undefined' ? window : globalThis);
