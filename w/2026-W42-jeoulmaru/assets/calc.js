// 저울마루 — 계산 (브라우저와 build.mjs 공용). 기준값은 assets/data.js 의 JM 에서 읽는다.
(function (g) {
  'use strict';
  const D = () => g.JM;

  // ── 날짜 (UTC 자정 기준, 시간대 영향 없음) ─────────────────
  const DAY = 86400000;
  const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
  function parseIso(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
    if (!m) return null;
    const y = +m[1], mo = +m[2], d = +m[3];
    const t = Date.UTC(y, mo - 1, d);
    const dt = new Date(t);
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
    return t;
  }
  const iso = (t) => new Date(t).toISOString().slice(0, 10);
  const md = (t) => { const d = new Date(t); return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 (${WEEK[d.getUTCDay()]})`; };
  const ymd = (t) => `${new Date(t).getUTCFullYear()}년 ${md(t)}`;
  const dow = (t) => new Date(t).getUTCDay();
  function addMonths(t, n) {
    const d = new Date(t);
    const y = d.getUTCFullYear(), m = d.getUTCMonth() + n, day = d.getUTCDate();
    const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    return Date.UTC(y, m, Math.min(day, last));
  }
  const today = () => parseIso(D().TODAY.iso);

  // ── 숫자 ─────────────────────────────────────────────────
  const won = (n) => `${Math.round(n).toLocaleString('ko-KR')}원`;
  const num = (n, dg = 3) => {
    const r = Math.round(n * 10 ** dg) / 10 ** dg;
    return r.toLocaleString('ko-KR', { maximumFractionDigits: dg });
  };
  const signed = (n) => (n > 0 ? '+' : n < 0 ? '−' : '±') + num(Math.abs(n));

  // ── 시드 (FNV-1a) ────────────────────────────────────────
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  // ── 검정 주기 ────────────────────────────────────────────
  function cycle(typeId, lastStr) {
    const J = D();
    const type = J.TYPES.find((t) => t.id === typeId) || (typeId === 'weight' ? { id: 'weight', name: '분동', cycle: J.WEIGHT_FEE.cycle } : null);
    const errors = {};
    if (!type) errors.type = '저울 종류: 목록에서 고르세요.';
    let last = null;
    if (!String(lastStr || '').trim()) errors.last = '마지막 검정일: 날짜를 입력하세요.';
    else {
      last = parseIso(lastStr);
      if (last === null) errors.last = '마지막 검정일: 2024-10-14 형식으로 입력하세요.';
      else if (last > today()) errors.last = '마지막 검정일: 오늘 이후 날짜는 입력할 수 없습니다.';
      else if (last < Date.UTC(2015, 0, 1)) errors.last = '마지막 검정일: 2015년 이후 날짜만 셈합니다.';
    }
    if (Object.keys(errors).length) return { errors };
    const expiry = addMonths(last, type.cycle);
    const graceEnd = expiry + J.GRACE_DAYS * DAY;
    const left = Math.round((expiry - today()) / DAY);
    const status = left >= 0 ? 'ok' : today() <= graceEnd ? 'grace' : 'expired';
    return { type, last, expiry, graceEnd, left, status };
  }

  // ── 허용오차 판정 ────────────────────────────────────────
  const r6 = (n) => Math.round(n * 1e6) / 1e6;
  function tolerance(capS, eS, rows) {
    const J = D();
    const L = J.TOL_LIMITS;
    const errors = {};
    const cap = Number(capS), e = Number(eS);
    if (String(capS).trim() === '' || !Number.isFinite(cap)) errors.cap = '최대 용량: 숫자를 입력하세요.';
    else if (cap <= 0) errors.cap = '최대 용량: 0보다 큰 값을 입력하세요.';
    if (String(eS).trim() === '' || !Number.isFinite(e)) errors.e = '눈금 간격: 숫자를 입력하세요.';
    else if (e <= 0) errors.e = '눈금 간격: 0보다 큰 값을 입력하세요.';
    if (!errors.cap && !errors.e) {
      const n = r6(cap / e);
      if (n < L.minDiv || n > L.maxDiv) errors.e = `눈금 간격: 눈금 수(최대 용량 ÷ 눈금 간격)가 ${L.minDiv.toLocaleString('ko-KR')}~${L.maxDiv.toLocaleString('ko-KR')} 사이여야 합니다. 지금 ${num(n, 1)}개입니다.`;
    }
    const rowErr = [];
    const pts = [];
    if (!rows.length) errors.rows = '측정 점: 한 줄 이상 입력하세요.';
    rows.forEach(([refS, dispS], i) => {
      const ref = Number(refS), disp = Number(dispS);
      const er = {};
      if (String(refS).trim() === '' || !Number.isFinite(ref)) er.ref = '기준 분동 값: 숫자를 입력하세요.';
      else if (ref <= 0) er.ref = '기준 분동 값: 0보다 큰 값을 입력하세요.';
      else if (!errors.cap && ref > cap) er.ref = '기준 분동 값: 최대 용량을 넘습니다.';
      if (String(dispS).trim() === '' || !Number.isFinite(disp)) er.disp = '표시 값: 숫자를 입력하세요.';
      else if (disp < 0) er.disp = '표시 값: 음수는 입력할 수 없습니다.';
      else if (!errors.cap && disp > cap) er.disp = '표시 값: 최대 용량을 넘습니다.';
      rowErr[i] = er;
      pts.push([ref, disp]);
    });
    if (Object.keys(errors).length || rowErr.some((r) => Object.keys(r).length)) return { errors, rowErr };
    const res = pts.map(([ref, disp]) => {
      const loadE = r6(ref / e);
      const band = J.TOL_TABLE.find((b) => loadE <= b.upTo);
      const allow = r6(band.k * e);
      const dev = r6(disp - ref);
      return { ref, disp, dev, allow, k: band.k, band: band.label, pass: Math.abs(dev) <= allow + 1e-9 };
    });
    const pass = res.every((r) => r.pass);
    // 저울대 기울기: 가장 크게 벗어난 점의 방향
    const worst = res.reduce((w, r) => (Math.abs(r.dev) / r.allow > Math.abs(w.dev) / w.allow ? r : w), res[0]);
    return { cap, e, divs: r6(cap / e), res, pass, failCount: res.filter((r) => !r.pass).length, lean: pass ? 0 : Math.sign(worst.dev) };
  }

  // ── 수수료 ───────────────────────────────────────────────
  function fee(o) {
    const J = D(), R = J.FEE_RULES;
    const errors = {};
    const isWeight = o.type === 'weight';
    const type = J.TYPES.find((t) => t.id === o.type);
    if (!type && !isWeight) errors.type = '종류: 목록에서 고르세요.';
    const count = Number(o.count);
    if (!/^\d+$/.test(String(o.count).trim()) || count < 1 || count > R.maxCount) errors.count = `대수: 1~${R.maxCount} 사이 정수를 입력하세요.`;
    const band = Number(o.band);
    if (type && type.id === 'truck' && band !== 2) errors.band = '용량 구간: 계근대는 300 kg 초과 구간만 받습니다.';
    let km = 0;
    const trip = !!o.trip || (type && type.id === 'truck');
    if (trip) {
      km = Number(o.km);
      if (String(o.km).trim() === '' || !Number.isFinite(km) || km < 0 || km > R.maxKm) errors.km = `거리: 0~${R.maxKm} km 사이로 입력하세요.`;
    }
    if (Object.keys(errors).length) return { errors };
    const unit = isWeight ? J.WEIGHT_FEE.perPiece : type.fee[band];
    const sub = unit * count;
    const group = count >= R.groupFrom ? Math.round(sub * R.groupRate) : 0;
    const kmR = Math.ceil(km);
    const tripFee = trip ? R.tripBase + kmR * R.perKm : 0;
    const total = sub - group + tripFee;
    const unitLabel = isWeight ? '개' : '대';
    const lines = [
      [`${isWeight ? '분동 한 개' : `${type.name} · ${J.BANDS[band]}`} 기준`, won(unit)],
      [`소계 (${won(unit)} × ${count}${unitLabel})`, won(sub)],
    ];
    if (group) lines.push([`단체 감면 (${R.groupFrom}${unitLabel} 이상 · 소계의 ${R.groupRate * 100}%)`, `−${won(group)}`]);
    if (trip) lines.push([`출장비 (기본 ${won(R.tripBase)} + ${kmR} km × ${won(R.perKm)})`, won(tripFee)]);
    return { unit, sub, group, tripFee, total, lines, trip, forcedTrip: !!(type && type.id === 'truck'), isWeight };
  }

  // ── 예약 잔여 (날짜 시드) ─────────────────────────────────
  function dayState(isoStr) {
    const J = D();
    const t = parseIso(isoStr);
    if (t === null) return { closed: true, why: '없는 날짜' };
    if (t < parseIso(J.BOOK_RANGE.from)) return { closed: true, why: '지난 날짜 · 오늘' };
    const w = dow(t);
    if (w === 0 || w === 6) return { closed: true, why: '주말 휴무' };
    if (J.HOLIDAYS[isoStr]) return { closed: true, why: `${J.HOLIDAYS[isoStr]} 휴무` };
    const slots = J.SLOTS.map((s) => {
      const h = hash(isoStr + s) % 7;
      return { time: s, left: h > 4 ? 0 : Math.min(3, h) };
    });
    const left = slots.reduce((a, s) => a + s.left, 0);
    return { closed: left === 0, why: left === 0 ? '마감' : '', slots, left };
  }

  // ── 접수번호 ─────────────────────────────────────────────
  const NO_RE = /^JM-(\d{2})(\d{2})(\d{2})-(\d{3})$/;
  function workdaysBetween(a, b) {
    let n = 0;
    for (let t = a + DAY; t <= b; t += DAY) { const w = dow(t); if (w !== 0 && w !== 6 && !D().HOLIDAYS[iso(t)]) n++; }
    return n;
  }
  function lookup(raw, session) {
    const no = String(raw || '').trim().toUpperCase();
    if (!no) return { error: '접수번호: 번호를 입력하세요.' };
    const m = NO_RE.exec(no);
    if (!m) return { error: '접수번호: JM-261014-001 형식으로 입력하세요.' };
    const own = (session || []).find((b) => b.no === no);
    if (own) return { no, own, stage: 0, date: parseIso(own.date), received: today() };
    const t = parseIso(`20${m[1]}-${m[2]}-${m[3]}`);
    const seq = +m[4];
    if (t === null) return { no, none: true };
    const w = dow(t);
    const tooOld = t < today() - 90 * DAY;
    if (t > today() || tooOld || w === 0 || w === 6 || D().HOLIDAYS[iso(t)] || seq < 1 || seq > 60 || hash(no) % 4 === 0) {
      return { no, none: true, tooOld };
    }
    const wd = workdaysBetween(t, today()) + (hash(no) % 2);
    const stage = wd <= 0 ? 0 : wd <= 2 ? 1 : wd <= 4 ? 2 : 3;
    const types = D().TYPES;
    const type = types[hash(no + 't') % types.length];
    return { no, received: t, stage, type, count: 1 + (hash(no + 'c') % 3) };
  }

  g.JMCALC = { parseIso, iso, md, ymd, dow, addMonths, today, won, num, signed, hash, cycle, tolerance, fee, dayState, lookup, DAY, WEEK };
})(typeof window !== 'undefined' ? window : globalThis);
