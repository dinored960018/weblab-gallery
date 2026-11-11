// 소릿골 스튜디오 — 계산 규칙. 빌드(node vm)와 브라우저가 같은 파일을 쓴다. window.SG(데이터) → window.SGC
(function (g) {
  'use strict';
  const D = g.SG;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (n) => Number(n).toLocaleString('ko-KR');
  const won = (n) => num(Math.round(n)) + '원';
  const pad = (n) => String(n).padStart(2, '0');
  const R = Object.fromEntries(D.ROOMS.map((x) => [x.id, x]));
  const WD = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜
  const dt = (s) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  const ds = (t) => { const x = new Date(t); return `${x.getUTCFullYear()}-${pad(x.getUTCMonth() + 1)}-${pad(x.getUTCDate())}`; };
  const addDays = (s, n) => ds(dt(s) + n * 86400000);
  const dow = (s) => new Date(dt(s)).getUTCDay();
  const md = (s) => `${Number(s.slice(5, 7))}월 ${Number(s.slice(8, 10))}일 (${WD[dow(s)]})`;
  const today = D.NOW.date;
  const lastDay = addDays(today, D.RULES.bookDays - 1);
  const days = () => Array.from({ length: D.RULES.bookDays }, (_, i) => addDays(today, i));
  const hh = (h) => `${pad(h)}:00`;

  const isWeekend = (date) => [0, 6].includes(dow(date));
  const isPeak = (date, h) => isWeekend(date) || h >= D.PEAK.weekdayFrom;
  const rate = (room, date, h) => (isPeak(date, h) ? R[room].peak : R[room].off);

  // 예약 상태 — 날짜 · 방 · 시각으로 정해지는 값(빌드와 브라우저가 같다)
  function hash(s) { let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return (x >>> 0) % 100; }
  function block(room, date, h) {
    return D.BLOCKS.find((b) => b.date === date && h >= b.from && h < b.to && (b.rooms === 'all' || b.rooms.includes(room)));
  }
  // 'past' 지남 · 'block' 점검 · 'taken' 예약됨 · 'free' 빈 시간
  function slot(room, date, h) {
    if (date < today || date > lastDay || h < D.HOURS.open || h >= D.HOURS.close) return 'out';
    if (date === today && h < D.NOW.h + 2) return 'past';
    if (block(room, date, h)) return 'block';
    const dense = isWeekend(date) ? 58 : h >= D.PEAK.weekdayFrom ? 64 : 28;
    // 두 시간 묶음으로 잡히게 짝수 시각 기준으로 센다
    return hash(`${room}|${date}|${h - (h % 2)}`) < dense ? 'taken' : 'free';
  }
  const isFree = (room, date, start, hours) => Array.from({ length: hours }, (_, i) => slot(room, date, start + i)).every((s) => s === 'free');
  // 그날 빈 시작 시각들(연속 hours 시간)
  function freeStarts(room, date, hours) {
    const out = [];
    for (let h = D.HOURS.open; h + hours <= D.HOURS.close; h++) if (isFree(room, date, h, hours)) out.push(h);
    return out;
  }

  // 요금. o = { room, date, start, hours, engineer, regular }
  function price(o) {
    const lines = [];
    let base = 0, peakH = 0;
    for (let i = 0; i < o.hours; i++) { const h = o.start + i; base += rate(o.room, o.date, h); if (isPeak(o.date, h)) peakH++; }
    lines.push({ k: 'room', name: `${R[o.room].name} ${o.hours}시간`, note: peakH === 0 ? '일반 시간' : peakH === o.hours ? '피크 시간' : `피크 ${peakH}시간 · 일반 ${o.hours - peakH}시간`, amount: base });
    const offRate = Math.max(o.hours >= D.RULES.longHours ? D.RULES.longOff : 0, o.regular ? D.RULES.regularOff : 0);
    const off = Math.round(base * offRate);
    if (off) lines.push({ k: 'off', name: o.regular && D.RULES.regularOff >= offRate ? '정기 예약 15%' : `${D.RULES.longHours}시간 이상 10%`, note: '방 요금에만', amount: -off });
    let eng = 0;
    if (o.engineer && R[o.room].kind === 'rec') { eng = D.RULES.engineer * o.hours; lines.push({ k: 'eng', name: `엔지니어 ${o.hours}시간`, note: `시간당 ${won(D.RULES.engineer)}`, amount: eng }); }
    return { lines, base, off, eng, peakH, total: base - off + eng };
  }

  // 환불 비율: 이용일까지 남은 날
  function refund(date) {
    const left = Math.round((dt(date) - dt(today)) / 86400000);
    const r = D.RULES.refund.find(([d]) => left >= d) || [0, 0];
    return { left, ratio: r[1] };
  }

  // 방 고르기: 종류 · 인원에 맞는 방(작은 순)
  function fitRooms(kind, people) {
    return D.ROOMS.filter((x) => (!kind || x.kind === kind) && x.cap >= (people || 1)).sort((a, b) => a.cap - b.cap || a.off - b.off);
  }

  // 말로 조건 넣기 — "토요일 저녁 5명 밴드 3시간"
  function parseNeed(text) {
    const t = String(text || '');
    const out = { chips: [], miss: [] };
    let m;
    // 날짜
    if ((m = t.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/))) out.date = `${today.slice(0, 4)}-${pad(m[1])}-${pad(m[2])}`;
    else if (/모레/.test(t)) out.date = addDays(today, 2);
    else if (/내일/.test(t)) out.date = addDays(today, 1);
    else if (/오늘/.test(t)) out.date = today;
    else if ((m = t.match(/(다음\s*주\s*)?([일월화수목금토])요일/))) {
      const want = WD.indexOf(m[2]);
      let add = (want - dow(today) + 7) % 7;
      if (m[1]) add += 7; else if (add === 0) add = 7;
      out.date = addDays(today, add);
    } else if (/주말/.test(t)) out.date = addDays(today, (6 - dow(today) + 7) % 7 || 7);
    if (out.date) out.chips.push(['date', md(out.date)]); else out.miss.push('날짜(예: 토요일, 11월 14일)');
    // 시각
    if ((m = t.match(/(\d{1,2})\s*시(?!간)/))) { let h = Number(m[1]); if (/오후|저녁|밤/.test(t) && h < 12) h += 12; if (h < 10 && !/오전|아침/.test(t)) h += 12; out.start = h; }
    else if (/저녁/.test(t)) out.start = 19;
    else if (/밤/.test(t)) out.start = 20;
    else if (/오후/.test(t)) out.start = 14;
    else if (/오전|아침/.test(t)) out.start = 10;
    else if (/점심|낮/.test(t)) out.start = 13;
    if (out.start != null) out.chips.push(['start', `${hh(out.start)} 시작`]);
    // 시간
    if ((m = t.match(/(\d+)\s*시간/))) { out.hours = Number(m[1]); out.chips.push(['hours', `${out.hours}시간`]); }
    // 인원
    if ((m = t.match(/(\d+)\s*(?:명|인)/))) { out.people = Number(m[1]); out.chips.push(['people', `${out.people}명`]); }
    else if (/혼자|개인/.test(t)) { out.people = 1; out.chips.push(['people', '1명']); }
    // 종류
    if (/녹음|보컬\s*부스|내레이션|레코딩/.test(t)) out.kind = 'rec';
    else if (/피아노/.test(t)) { out.kind = 'solo'; out.room = 'p1'; }
    else if (/드럼\s*(?:연습|실)|드럼만/.test(t)) { out.kind = 'solo'; out.room = 'd1'; }
    else if (/밴드|합주|리허설/.test(t)) out.kind = 'band';
    if (out.kind) out.chips.push(['kind', { band: '합주', solo: out.room === 'p1' ? '피아노 연습' : '드럼 연습', rec: '녹음' }[out.kind]]);
    else out.miss.push('무엇을 하는지(합주 · 녹음 · 피아노 · 드럼)');
    if (/엔지니어/.test(t)) { out.engineer = !/엔지니어\s*(?:없|빼)/.test(t); out.chips.push(['engineer', out.engineer ? '엔지니어 포함' : '엔지니어 없음']); }
    if (/정기|매주/.test(t)) { out.regular = true; out.chips.push(['regular', '정기 예약']); }
    return out;
  }

  // 세 가지 안. need = { kind, room, people, date, start, hours, engineer, regular }
  function options(need) {
    const hours = need.hours || 2, people = need.people || (need.kind === 'band' ? 4 : 1);
    const rooms = need.room ? [R[need.room]] : fitRooms(need.kind, people);
    if (!rooms.length || !need.date) return [];
    const date = need.date, want = need.start != null ? need.start : 19;
    const mk = (room, d, start, key, label, why) => {
      const p = price({ room, date: d, start, hours, engineer: need.engineer, regular: need.regular });
      return { key, label, why, room, date: d, start, hours, engineer: !!need.engineer, regular: !!need.regular, total: p.total, peakH: p.peakH };
    };
    const out = [];
    const small = rooms[0];
    // 시간 우선: 원하는 날 · 원하는 시각에 가장 가까운 빈 시간(맞는 방 중 작은 방부터)
    let timeOpt = null;
    for (const rm of rooms) {
      const fs = freeStarts(rm.id, date, hours);
      if (!fs.length) continue;
      const s = fs.slice().sort((a, b) => Math.abs(a - want) - Math.abs(b - want) || a - b)[0];
      if (!timeOpt || Math.abs(s - want) < Math.abs(timeOpt.start - want)) timeOpt = mk(rm.id, date, s, 'time', '시간 우선', s === want ? '원하는 날 원하는 시각 그대로입니다.' : `원하는 시각(${hh(want)})에 가장 가까운 빈 시간입니다.`);
      if (timeOpt.start === want) break;
    }
    // 값 우선: 가장 작은 맞는 방 · 일반 시간대 중 가장 싼 빈 시간(같은 날 먼저, 없으면 3일 안)
    let costOpt = null;
    const pool = [];
    for (let i = 0; i <= 3; i++) {
      const d = addDays(date, i); if (d > lastDay) break;
      freeStarts(small.id, d, hours).forEach((s) => pool.push(mk(small.id, d, s, 'cost', '값 우선', '')));
    }
    if (pool.length) costOpt = pool.sort((a, b) => a.total - b.total || (a.date < b.date ? -1 : a.date > b.date ? 1 : 0) || Math.abs(a.start - want) - Math.abs(b.start - want))[0];
    if (costOpt) costOpt.why = (costOpt.date !== date ? `${md(costOpt.date)}로 옮기면 ` : '') + (costOpt.peakH === 0 ? '일반 시간대(평일 18:00 전)라 가장 쌉니다.' : '빈 시간 가운데 요금이 가장 낮습니다.');
    // 여유 우선: 한 단계 큰 방
    const bigger = need.room ? null : D.ROOMS.filter((x) => x.kind === small.kind && x.cap > small.cap).sort((a, b) => a.cap - b.cap)[0];
    let roomOpt = null;
    if (bigger) {
      const fs = freeStarts(bigger.id, date, hours);
      if (fs.length) { const s = fs.slice().sort((a, b) => Math.abs(a - want) - Math.abs(b - want))[0]; roomOpt = mk(bigger.id, date, s, 'room', '여유 우선', `정원 ${bigger.cap}명 · ${bigger.area}㎡로 한 단계 큰 방입니다.`); }
    }
    [timeOpt, costOpt, roomOpt].forEach((o) => { if (o && !out.some((x) => x.room === o.room && x.date === o.date && x.start === o.start)) out.push(o); });
    return out;
  }

  // 이상 알림. b = { room, date, start, hours, people, engineer, regular }
  function alerts(b) {
    const out = [], rm = R[b.room];
    if (!rm || !b.date) return out;
    if (b.people > rm.cap) { const big = fitRooms(rm.kind, b.people)[0]; out.push({ id: 'cap', lv: 'bad', t: `${b.people}명 · ${rm.name} 정원 ${rm.cap}명`, fix: big ? `${big.name}(정원 ${big.cap}명)으로 바꾸세요.` : '정원을 넘습니다. 상담으로 문의하세요.', ref: `rooms/index.html#room-${rm.id}`, act: big ? ['room', big.id, `${big.name}로 바꾸기`] : null }); }
    if (b.start + b.hours > D.HOURS.close) out.push({ id: 'close', lv: 'bad', t: `${hh(b.start)}부터 ${b.hours}시간 · 영업 종료 ${hh(D.HOURS.close)}`, fix: `${hh(D.HOURS.close - b.hours)} 전에 시작해야 합니다.`, ref: 'guide/index.html#hours', act: ['start', D.HOURS.close - b.hours, `${hh(D.HOURS.close - b.hours)} 시작으로`] });
    else {
      const bad = Array.from({ length: b.hours }, (_, i) => b.start + i).filter((h) => slot(b.room, b.date, h) !== 'free');
      if (bad.length) {
        const bl = block(b.room, b.date, bad[0]);
        const st = slot(b.room, b.date, bad[0]);
        const fs = freeStarts(b.room, b.date, b.hours);
        const near = fs.slice().sort((a, c) => Math.abs(a - b.start) - Math.abs(c - b.start))[0];
        out.push({ id: 'taken', lv: 'bad', t: bl ? `${md(b.date)} ${hh(bl.from)}~${hh(bl.to)} ${bl.why}` : st === 'past' ? `${hh(bad[0])}는 지났거나 시작 2시간 전이 지났습니다` : `${md(b.date)} ${bad.map(hh).join(' · ')} 이미 예약됨`, fix: near != null ? `가장 가까운 빈 시간: ${hh(near)}` : '이 날은 빈 시간이 없습니다. 다른 날을 고르세요.', ref: `booking/index.html#cal`, act: near != null ? ['start', near, `${hh(near)} 시작으로`] : null });
      }
    }
    if (!isWeekend(b.date) && b.start + b.hours > D.PEAK.weekdayFrom && b.start < D.PEAK.weekdayFrom + 3) {
      const early = Math.max(D.HOURS.open, D.PEAK.weekdayFrom - b.hours);
      if (isFree(b.room, b.date, early, b.hours) && early !== b.start) {
        const save = price(b).total - price({ ...b, start: early }).total;
        if (save > 0) out.push({ id: 'peak', lv: 'warn', t: `피크 시간 포함 · ${hh(early)} 시작이면 ${won(save)} 쌉니다`, fix: `평일 ${hh(D.PEAK.weekdayFrom)} 전은 일반 요금입니다.`, ref: 'pricing/index.html#rule-peak', act: ['start', early, `${hh(early)} 시작으로`] });
      }
    }
    if (b.hours === D.RULES.longHours - 1 && !b.regular) {
      const more = price({ ...b, hours: b.hours + 1 });
      if (b.start + b.hours + 1 <= D.HOURS.close && isFree(b.room, b.date, b.start, b.hours + 1)) out.push({ id: 'long', lv: 'warn', t: `한 시간 더 하면 10% 할인 · ${b.hours + 1}시간 ${won(more.total)}`, fix: `지금 ${b.hours}시간 ${won(price(b).total)}`, ref: 'pricing/index.html#rule-long', act: ['hours', b.hours + 1, `${b.hours + 1}시간으로`] });
    }
    const rf = refund(b.date);
    if (rf.ratio < 1) out.push({ id: 'refund', lv: 'warn', t: rf.ratio ? `이용일까지 ${rf.left}일 · 취소하면 50%만 환불` : '당일 예약 · 취소해도 환불되지 않습니다', fix: '이용일 3일 전까지는 전액 환불입니다.', ref: 'guide/index.html#refund' });
    if (rm.kind === 'rec' && !b.engineer) out.push({ id: 'eng', lv: 'warn', t: '엔지니어 없음 · 장비를 직접 다뤄야 합니다', fix: `엔지니어 시간당 ${won(D.RULES.engineer)}`, ref: 'recording/index.html#engineer', act: ['engineer', 1, '엔지니어 넣기'] });
    return out;
  }

  // 붙여넣어 읽기 — 장비 목록
  const GEAR_WORDS = [
    ['piano', /업라이트|피아노/], ['drummic', /드럼\s*마이크/], ['drum', /드럼/], ['gamp', /기타\s*앰프|일렉\s*앰프/], ['bamp', /베이스\s*앰프/],
    ['key', /건반|키보드|신디/], ['vmic', /보컬\s*마이크|마이크/], ['pa', /PA|스피커/i], ['multitrack', /멀티\s*트랙|녹음/], ['stand', /보면대/], ['phones', /헤드폰/],
  ];
  function parseGear(text) {
    return String(text || '').split(/\n|,/).map((s) => s.trim()).filter(Boolean).map((line) => {
      if (/스탠드/.test(line) && !/보면대/.test(line)) return { ok: false, line, why: '비치 장비에 없는 품목' };
      const hit = GEAR_WORDS.find(([, re]) => re.test(line));
      if (!hit) return { ok: false, line, why: '비치 장비에 없는 품목' };
      const n = line.match(/(\d+)/);
      return { ok: true, line, key: hit[0], qty: n ? Number(n[1]) : 1 };
    });
  }
  // 장비 목록을 채우는 방
  function gearMatch(rows) {
    const need = {};
    rows.filter((r) => r.ok).forEach((r) => { need[r.key] = Math.max(need[r.key] || 0, r.qty); });
    return D.ROOMS.map((rm) => {
      const lack = Object.entries(need).filter(([k, q]) => (rm.gear[k] || 0) < q).map(([k, q]) => ({ k, need: q, have: rm.gear[k] || 0 }));
      return { room: rm.id, lack };
    });
  }

  // 녹음 견적: 곡 수 · 종류 → 시간
  function recHours(kind, songs) { const r = D.REC[kind]; return Math.ceil(r.setup + r.perSong * songs); }

  g.SGC = { esc, num, won, pad, R, WD, today, lastDay, days, addDays, dow, md, hh, isWeekend, isPeak, rate, slot, block, isFree, freeStarts, price, refund, fitRooms, parseNeed, options, alerts, parseGear, gearMatch, recHours };
})(typeof window !== 'undefined' ? window : globalThis);
