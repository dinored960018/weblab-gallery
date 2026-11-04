// 감침세탁수선 — 계산 · 해석 (브라우저와 build.mjs 공용). window.GC(데이터) → window.GCC
(function (g) {
  'use strict';
  const D = g.GC;
  const DOW = '일월화수목금토';
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const won = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
  const pad = (n) => String(n).padStart(2, '0');

  // 날짜 — 'YYYY-MM-DD' 문자열, UTC 로 계산해 시간대 영향 없음
  const toD = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const toIso = (dt) => `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
  const add = (iso, n) => { const d = toD(iso); d.setUTCDate(d.getUTCDate() + n); return toIso(d); };
  const dow = (iso) => toD(iso).getUTCDay();
  const diff = (a, b) => Math.round((toD(b) - toD(a)) / 864e5); // b - a 일
  const md = (iso) => { const d = toD(iso); return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 (${DOW[d.getUTCDay()]})`; };
  const ymd = (iso) => `${toD(iso).getUTCFullYear()}년 ${md(iso)}`;
  const today = D.NOW.date;
  const nowMin = D.NOW.h * 60 + D.NOW.m;
  const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

  const isOpen = (iso) => dow(iso) !== 0 && !D.CLOSED[iso];
  const hoursOf = (iso) => (D.CLOSED[iso] ? null : D.SHORT[iso] || D.HOURS[dow(iso)]);
  const nextOpen = (iso) => { let d = add(iso, 1); while (!isOpen(d)) d = add(d, 1); return d; };
  // 접수일: 영업일 마감 전이면 그날, 아니면 다음 영업일
  function startDay(iso, time) {
    if (isOpen(iso) && mins(time) < mins(D.RULES.cutoff)) return iso;
    return nextOpen(iso);
  }
  // 접수일부터 영업일 n일 뒤
  function afterOpen(start, n) { let d = start; for (let i = 0; i < n; i++) d = nextOpen(d); return d; }
  // 접수일과 찾는 날 사이 임시 휴무
  function closedBetween(a, b) { return Object.keys(D.CLOSED).filter((c) => c > a && c < b && dow(c) !== 0); }

  const L = Object.fromEntries(D.LAUNDRY.map((x) => [x.id, x]));
  const R = Object.fromEntries(D.REPAIR.map((x) => [x.id, x]));
  const catName = (list, id) => (list.find((c) => c[0] === id) || [, id])[1];
  const round500 = (n) => Math.ceil(n / 500) * 500;

  // 견적. st = { items:{id:qty}, repairs:{id:qty}, express, how:'shop'|'pickup', zone, want }
  function estimate(st) {
    const lines = [];
    let lDays = 0, rDays = 0;
    for (const [id, q] of Object.entries(st.items || {})) {
      const it = L[id]; if (!it || !(q > 0)) continue;
      const ex = !!st.express && it.express;
      const unit = ex ? round500(it.price * D.RULES.expressRate) : it.price;
      const days = ex ? Math.max(1, it.days - D.RULES.expressCut) : it.days;
      lDays = Math.max(lDays, days);
      lines.push({ kind: 'l', id, name: it.name, qty: q, unit: it.unit, each: unit, sum: unit * q, days, ex, method: D.METHODS[it.method] });
    }
    for (const [id, q] of Object.entries(st.repairs || {})) {
      const it = R[id]; if (!it || !(q > 0)) continue;
      rDays = Math.max(rDays, it.days);
      lines.push({ kind: 'r', id, name: it.name, qty: q, unit: it.unit, each: it.price, sum: it.price * q, days: it.days, ex: false, method: '수선' });
    }
    const both = lDays > 0 && rDays > 0;
    const days = Math.max(lDays, rDays) + (both ? D.RULES.bothExtra : 0);
    const sub = lines.reduce((s, l) => s + l.sum, 0);
    let recv, start, ready, deliver = null, fee = 0, visits = 2;
    if (st.how === 'pickup') {
      const z = D.ZONES.find((x) => x.id === st.zone) || D.ZONES[0];
      recv = zoneDay(z, add(today, 1));
      start = nextOpen(recv);
      ready = days ? afterOpen(start, days - 1) : null;
      deliver = ready ? zoneDay(z, add(ready, 1)) : null;
      fee = sub && sub < D.RULES.minPickup ? D.RULES.pickupFee : 0;
      visits = 0;
    } else {
      recv = today;
      start = startDay(today, `${pad(D.NOW.h)}:${pad(D.NOW.m)}`);
      ready = days ? afterOpen(start, days) : null;
    }
    return { lines, sub, fee, total: sub + fee, days, both, recv, start, ready, deliver, visits, how: st.how || 'shop', zone: st.zone, express: !!st.express };
  }
  // 구역 수거일 — from 이후(포함) 첫 구역 요일 · 영업일
  function zoneDay(z, from) { let d = from; for (let i = 0; i < 30; i++) { if (z.days.includes(dow(d)) && isOpen(d)) return d; d = add(d, 1); } return from; }

  // 세 가지 안
  function options3(st) {
    const base = estimate({ ...st, express: false, how: 'shop' });
    const fast = estimate({ ...st, express: true, how: 'shop' });
    const pick = estimate({ ...st, express: false, how: 'pickup', zone: st.zone || 'solbat' });
    const exCount = base.lines.filter((l) => l.kind === 'l' && L[l.id].express).length;
    return [
      { id: 'base', name: '기본', est: base, why: '가게에 맡기고 찾음 · 추가 요금 없음' },
      { id: 'fast', name: '급행', est: fast, why: exCount ? `급행 되는 품목 ${exCount}가지만 하루 당김 · 그 품목 값 1.5배` : '급행 되는 품목이 없어 기본과 같음' },
      { id: 'pick', name: '수거 · 배달', est: pick, why: `${(D.ZONES.find((z) => z.id === (st.zone || 'solbat')) || D.ZONES[0]).name} 수거일에 가져가고 배달 · 가게에 오지 않음` },
    ];
  }

  // 이상 알림
  function warnings(st, e) {
    const w = [];
    if (!e.lines.length) return w;
    if (st.want && e.ready && e.ready > st.want) {
      const f = estimate({ ...st, express: true });
      const ok = f.ready && f.ready <= st.want;
      w.push({ id: 'late:' + st.want, t: '원하는 날까지 못 맞춤', why: `찾는 날 ${md(e.ready)} · 원하는 날 ${md(st.want)}`, fix: ok && !st.express ? '급행이면 ' + md(f.ready) + '에 찾을 수 있습니다.' : '사장님 상담으로 일부 품목만 먼저 찾을 수 있는지 물어보세요.', act: ok && !st.express ? ['express', '급행으로 바꾸기'] : ['handoff', '상담 요청'] });
    }
    const cb = e.ready ? closedBetween(e.start, e.ready) : [];
    if (cb.length) w.push({ id: 'closed:' + cb[0], t: '중간에 임시 휴무', why: cb.map((c) => `${md(c)} ${D.CLOSED[c]}`).join(' · '), fix: '찾는 날이 그만큼 늦어졌습니다.', act: null });
    const nonEx = e.lines.filter((l) => l.kind === 'l' && st.express && !L[l.id].express);
    if (nonEx.length) w.push({ id: 'nonex', t: '급행이 안 되는 품목', why: nonEx.map((l) => l.name).join(' · '), fix: '이 품목은 원래 소요일로 계산했습니다.', act: null });
    const silk = e.lines.find((l) => l.id === 'silk');
    if (silk) w.push({ id: 'silk', t: '실크 · 손세탁 품목', why: '물 얼룩 · 색 빠짐이 생길 수 있음', fix: '맡길 때 얼룩 자리를 알려 주세요.', act: ['care', '소재 주의 보기'] });
    const lea = e.lines.filter((l) => l.kind === 'l' && L[l.id].cat === 'leather');
    if (lea.length) w.push({ id: 'leather', t: '외부 위탁 품목', why: `${lea.map((l) => l.name).join(' · ')} · ${Math.max(...lea.map((l) => l.days))}일 이상`, fix: '가죽은 색 차이가 생길 수 있어 맡길 때 같이 확인합니다.', act: ['care', '소재 주의 보기'] });
    if (e.how === 'pickup' && e.fee) w.push({ id: 'minfee', t: '수거 최소 금액 미만', why: `세탁 · 수선 ${won(e.sub)} · 최소 ${won(D.RULES.minPickup)}`, fix: `수거비 ${won(D.RULES.pickupFee)}이 붙습니다. 가게에 맡기면 없습니다.`, act: ['shop', '가게 접수로 바꾸기'] });
    return w;
  }

  // 문장 해석 ------------------------------------------------------------
  const KNUM = { 한: 1, 하나: 1, 두: 2, 둘: 2, 세: 3, 셋: 3, 네: 4, 넷: 4, 다섯: 5, 여섯: 6, 일곱: 7, 여덟: 8, 아홉: 9, 열: 10 };
  const UNITS = '장|벌|개|채|켤레|폭|군데|칸|점';
  const QTY_AFTER = new RegExp(`^\\s*(?:[가-힣]{1,3}\\s*)?(?:x|×|X)?\\s*(\\d+(?!\\d)(?!\\s*(?:cm|센티|mm|원|kg|일|월|시|/|\\.|,\\d))|(?:한|두|세|네|다섯|여섯|일곱|여덟|아홉|열)(?=\\s*(?:${UNITS})|\\s|$|[^가-힣]))\\s*(?:${UNITS})?`);
  const WORDS = [];
  D.REPAIR.forEach((x) => x.words.forEach((w) => WORDS.push({ w, kind: 'r', id: x.id })));
  D.LAUNDRY.forEach((x) => x.words.forEach((w) => WORDS.push({ w, kind: 'l', id: x.id })));
  WORDS.sort((a, b) => b.w.length - a.w.length || (a.kind === 'r' ? -1 : 1));
  const TAIL = /(이에요|예요|입니다|이랑|하고|까지|으로|에서|이요|요|은|는|이|가|을|를|도|랑|에|로)$/;
  const STOP = /^(맡[기겨길긴].*|싶.*|주세요|부탁.*|해|해서|해주.*|해요|할.*|하려.*|하고|그리고|좀|정도|세탁|빨래|드라이|수선|있어요|있는데|거|것|저|제|이번|다음|주|및|각|개|벌|장|줄이기|줄여|늘리기|늘려|교체|바꾸기|달기|박기|고치기|고쳐|갈기|해주실|가능|되나|될까|얼마|언제|찾|찾을|찾아|안녕.*)$/;
  function unreadOf(left) {
    return left.split(' ').filter((tok) => !STOP.test(tok)).map((tok) => tok.replace(TAIL, '')).filter((tok) => /[가-힣]{2,}/.test(tok) && !STOP.test(tok));
  }

  function parseDate(text) {
    let m;
    if ((m = text.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/))) {
      let y = Number(today.slice(0, 4));
      const iso = `${y}-${pad(m[1])}-${pad(m[2])}`;
      return { iso: iso < today ? `${y + 1}-${pad(m[1])}-${pad(m[2])}` : iso, raw: m[0] };
    }
    if ((m = text.match(/(\d{1,2})\/(\d{1,2})\s*까지/))) { const iso = `${today.slice(0, 4)}-${pad(m[1])}-${pad(m[2])}`; return { iso, raw: m[0].replace(/\s*까지/, '') }; }
    if ((m = text.match(/모레/))) return { iso: add(today, 2), raw: m[0] };
    if ((m = text.match(/내일/))) return { iso: add(today, 1), raw: m[0] };
    if ((m = text.match(/(이번\s*주|다음\s*주|담주)?\s*([월화수목금토일])요일/))) {
      const t = '일월화수목금토'.indexOf(m[2]);
      let d = add(today, 1);
      while (dow(d) !== t) d = add(d, 1);
      if (m[1] && /다음|담/.test(m[1]) && diff(today, d) < 7 && dow(d) > dow(today)) d = add(d, 7);
      return { iso: d, raw: m[0].trim() };
    }
    return null;
  }

  function parseSeg(seg, out) {
    let s = ' ' + seg + ' ';
    for (const W of WORDS) {
      let i;
      while ((i = s.indexOf(W.w)) >= 0) {
        const after = s.slice(i + W.w.length);
        const q = after.match(QTY_AFTER);
        let qty = 1, eat = 0;
        if (q) { qty = /\d/.test(q[1]) ? Number(q[1]) : KNUM[q[1]] || 1; eat = q[0].length; }
        const bucket = W.kind === 'r' ? out.repairs : out.items;
        bucket[W.id] = (bucket[W.id] || 0) + qty;
        out.hits.push({ kind: W.kind, id: W.id, qty });
        s = s.slice(0, i) + ' '.repeat(W.w.length + eat) + s.slice(i + W.w.length + eat);
      }
    }
    return s;
  }

  function parseText(text) {
    const out = { items: {}, repairs: {}, want: null, express: false, how: null, zone: null, unread: [], hits: [] };
    let t = String(text || '').replace(/\s+/g, ' ');
    const d = parseDate(t);
    if (d) { out.want = d.iso; t = t.replace(d.raw, ' ').replace(/^\s*까지|\s까지/, ' '); }
    if (/급행|빨리|급해/.test(t)) { out.express = true; t = t.replace(/급행으?로?|빨리|급해요?/g, ' '); }
    for (const z of D.ZONES) if (t.includes(z.name)) { out.zone = z.id; out.how = 'pickup'; t = t.replace(z.name, ' '); }
    if (/수거|배달|가지러/.test(t)) { out.how = 'pickup'; t = t.replace(/수거\s*(신청)?|배달|가지러\s*와\s*주세요/g, ' '); }
    for (const seg of t.split(/[,，.\n]|\s그리고\s/)) {
      const left = parseSeg(seg, out).replace(/\d+|[()\-~x×:?!]/g, ' ').replace(/\s+/g, ' ').trim();
      const u = unreadOf(left);
      if (u.length) out.unread.push(u.join(' '));
    }
    return out;
  }

  // 붙여넣기: 줄마다 읽은 줄 · 못 읽은 줄
  function parsePaste(text) {
    const rows = [], bad = [];
    String(text || '').split(/\n/).forEach((raw, n) => {
      const line = raw.trim(); if (!line) return;
      const clean = line.replace(/^[-*•·]\s*/, '').replace(/^\d{1,2}[./-]\d{1,2}\s*/, '').replace(/[\d,]+\s*원/g, ' ');
      const o = { items: {}, repairs: {}, hits: [] };
      parseSeg(clean, o);
      if (!o.hits.length) { bad.push({ n: n + 1, line, why: '품목을 못 읽음' }); return; }
      o.hits.forEach((h) => rows.push({ n: n + 1, line, kind: h.kind, id: h.id, qty: h.qty }));
    });
    return { rows, bad };
  }

  // 조회
  function lookup(no, phone) {
    const r = D.RECEIPTS.find((x) => x.no === String(no || '').trim().toUpperCase() && x.phone === String(phone || '').trim());
    if (!r) return null;
    const days = diff(r.ready, today);
    const over = Math.max(0, days - D.RULES.freeDays);
    const fee = Math.min(D.RULES.feeCap, over * D.RULES.feePerDay);
    const allReady = r.items.every((i) => i[2] === 5);
    return { ...r, days, over, fee, allReady, freeUntil: add(r.ready, D.RULES.freeDays) };
  }
  function storageFee(days) { const over = Math.max(0, days - D.RULES.freeDays); return { over, fee: Math.min(D.RULES.feeCap, over * D.RULES.feePerDay) }; }

  // 찾는 날 계산 (찾는 날 면)
  function pickupCalc(iso, time, ids, repairIds) {
    const items = {}; (ids || []).forEach((i) => (items[i] = 1));
    const repairs = {}; (repairIds || []).forEach((i) => (repairs[i] = 1));
    const e = estimate({ items, repairs });
    const start = startDay(iso, time);
    return { start, days: e.days, ready: e.days ? afterOpen(start, e.days) : null, late: start !== iso, closed: e.days ? closedBetween(start, afterOpen(start, e.days)) : [] };
  }

  // 얼룩 · 소재 찾기
  const findBy = (list, text) => list.filter((x) => x.words.some((w) => new RegExp('(^|[^가-힣])' + w).test(text)));

  // 수선 사진 견적 초안
  function photoDraft(garment, parts) {
    const map = D.PHOTO_EST.map[garment] || {};
    const lines = [], miss = [];
    (parts || []).forEach((p) => { const id = map[p]; if (id) lines.push(R[id]); else miss.push(p); });
    const lo = lines.reduce((s, r) => s + r.price, 0);
    return { lines, miss, lo, hi: Math.round(lo * 1.3 / 1000) * 1000, days: lines.length ? Math.max(...lines.map((r) => r.days)) : 0 };
  }

  g.GCC = { esc, won, pad, add, dow, diff, md, ymd, today, nowMin, mins, isOpen, hoursOf, nextOpen, startDay, afterOpen, closedBetween, L, R, catName, estimate, options3, warnings, zoneDay, parseText, parsePaste, parseDate, lookup, storageFee, pickupCalc, findBy, photoDraft, DOW };
})(typeof window !== 'undefined' ? window : globalThis);
