// 오얏골동물병원 — 계산 · 해석 규칙. 브라우저와 build.mjs 가 같이 쓴다
(function (G) {
  'use strict';
  var D = G.OY;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var won = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'; };

  // ── 날짜 ───────────────────────────────────────────────────
  function d(s) { var p = String(s).split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function iso(x) { return x.getUTCFullYear() + '-' + pad(x.getUTCMonth() + 1) + '-' + pad(x.getUTCDate()); }
  function add(s, days) { var x = d(s); x.setUTCDate(x.getUTCDate() + days); return iso(x); }
  function addYear(s, y) { var x = d(s); x.setUTCFullYear(x.getUTCFullYear() + y); return iso(x); }
  function diff(a, b) { return Math.round((d(b) - d(a)) / 864e5); }
  function dow(s) { return d(s).getUTCDay(); }
  function md(s) { var x = d(s); return (x.getUTCMonth() + 1) + '월 ' + x.getUTCDate() + '일 (' + D.DOW[x.getUTCDay()] + ')'; }
  function ymd(s) { var x = d(s); return x.getUTCFullYear() + '년 ' + md(s); }
  function okDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s || '') && iso(d(s)) === s; }
  var TODAY = D.NOW.date;
  var mins = function (t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; };
  var hm = function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };

  // ── 진료비 ─────────────────────────────────────────────────
  function bandOf(sp, kg) {
    if (!(kg > 0)) return -1;
    var i = Math.floor(kg / 5);
    return Math.min(i, D.BANDS[sp].length - 1);
  }
  function priceRows(sp) { return D.PRICES.filter(function (p) { return !p.sp || p.sp === sp; }); }
  function price(id, sp, band) {
    var p = D.PRICES.filter(function (x) { return x.id === id; })[0];
    if (!p) return null;
    var base = typeof p.base === 'object' ? p.base[sp] : p.base;
    return base + p.step * Math.max(0, band);
  }
  function priceItem(id) { return D.PRICES.filter(function (x) { return x.id === id; })[0]; }

  // ── 접종 ───────────────────────────────────────────────────
  function vaccine(sp, id) { return (D.VACCINES[sp] || []).filter(function (v) { return v.id === id; })[0]; }
  // 다음 접종 날짜. n = 맞은 횟수, last = 마지막 날짜
  function nextVacc(sp, birth, id, n, last) {
    var v = vaccine(sp, id);
    if (!v || !okDate(birth)) return null;
    n = +n || 0;
    var date, why;
    if (n < v.n) {
      var byAge = add(birth, (v.first + n * v.gap) * 7);
      date = byAge; why = n === 0 ? '첫 접종 생후 ' + v.first + '주' : '기초 ' + (n + 1) + '차 · ' + v.gap + '주 간격';
      if (n > 0 && okDate(last)) { var byGap = add(last, v.gap * 7); if (byGap > date) date = byGap; }
    } else {
      if (!okDate(last)) return { id: id, name: v.name, date: '', state: 'unknown', why: '마지막 날짜 없음' };
      date = addYear(last, 1); why = '기초 ' + v.n + '회 끝 · 해마다 추가';
    }
    var left = diff(TODAY, date);
    var state = left < 0 ? 'over' : left <= D.SOON_DAYS ? 'soon' : 'ok';
    return { id: id, name: v.name, date: date, left: left, state: state, why: why, n: n, total: v.n };
  }
  function vaccPlan(st) {
    return (D.VACCINES[st.sp] || []).map(function (v) {
      var x = (st.v && st.v[v.id]) || { n: 0, last: '' };
      return nextVacc(st.sp, st.birth, v.id, x.n, x.last);
    }).filter(Boolean);
  }
  var STATE = { over: '지남', soon: '2주 안', ok: '예정', unknown: '날짜 필요' };
  function ageText(birth) {
    if (!okDate(birth)) return '';
    var m = Math.floor(diff(birth, TODAY) / 30.44);
    return m < 12 ? m + '개월' : Math.floor(m / 12) + '살';
  }

  // ── 진료일 · 시간 칸 ───────────────────────────────────────
  function closed(s) {
    if (dow(s) === 0) return '일요일 휴진';
    var c = D.CLOSED.filter(function (x) { return x.date === s; })[0];
    return c ? '휴진 · ' + c.why : '';
  }
  function hoursOf(s) { return closed(s) ? null : dow(s) === 6 ? D.HOURS.sat : D.HOURS.week; }
  function times(s) {
    var h = hoursOf(s); if (!h) return [];
    var out = [];
    for (var m = mins(h.open); m < mins(h.last); m += 30) {
      if (h.lunch && m >= mins(h.lunch[0]) && m < mins(h.lunch[1])) continue;
      out.push(hm(m));
    }
    return out;
  }
  function doc(id) { return D.DOCTORS.filter(function (x) { return x.id === id; })[0]; }
  function hash(str) { var h = D.BOOK_SEED; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
  // 칸 상태: free · past · taken · off · block · closed · mine
  function slot(s, t, docId, mine) {
    var c = closed(s); if (c) return { st: 'closed', why: c };
    var dc = doc(docId);
    if (dc.days.indexOf(dow(s)) < 0) return { st: 'off', why: dc.name + ' 쉬는 날' };
    for (var i = 0; i < dc.block.length; i++) {
      var b = dc.block[i];
      if (b.days.indexOf(dow(s)) > -1 && mins(t) >= mins(b.from) && mins(t) < mins(b.to)) return { st: 'block', why: b.why };
    }
    if (s === TODAY && mins(t) <= mins(D.NOW.time)) return { st: 'past', why: '지난 시간' };
    if (mine && mine.some(function (m) { return m.date === s && m.time === t && m.doc === docId; })) return { st: 'mine', why: '내 예약' };
    var h = hash(s + t + docId) % 100;
    var busy = s === TODAY ? 62 : dow(s) === 6 ? 55 : 38;
    if (h < busy) return { st: 'taken', why: '예약 참' };
    return { st: 'free', why: '비어 있음' };
  }
  // 조건에 맞는 빈칸 — 가장 이른 것부터
  function freeSlots(f, mine, limit) {
    f = f || {}; var out = [];
    D.BOOK_DAYS.forEach(function (s) {
      if (f.date && s !== f.date) return;
      if (f.from && s < f.from) return;
      if (f.sat && dow(s) !== 6) return;
      times(s).forEach(function (t) {
        if (f.part === 'am' && mins(t) >= 780) return;
        if (f.part === 'pm' && mins(t) < 780) return;
        D.DOCTORS.forEach(function (dc) {
          if (f.doc && dc.id !== f.doc) return;
          if (f.docs && f.docs.indexOf(dc.id) < 0) return;
          if (slot(s, t, dc.id, mine).st === 'free') out.push({ date: s, time: t, doc: dc.id });
        });
      });
    });
    out.sort(function (a, b) { return (a.date + a.time) < (b.date + b.time) ? -1 : (a.date + a.time) > (b.date + b.time) ? 1 : 0; });
    return limit ? out.slice(0, limit) : out;
  }
  function svc(id) { return D.SERVICES.filter(function (x) { return x.id === id; })[0]; }

  // 세 가지 안 — 가장 빠른 칸 · 지난번 담당 · 주말 칸
  function threeOptions(q, mine) {
    var s = svc(q.svc) || svc('general');
    var docs = s.docs;
    var fast = freeSlots({ docs: docs, part: q.part, from: q.from }, mine, 1)[0] || freeSlots({ docs: docs }, mine, 1)[0];
    var lastDoc = q.lastDoc && docs.indexOf(q.lastDoc) > -1 ? q.lastDoc : '';
    var same = lastDoc ? freeSlots({ doc: lastDoc, part: q.part, from: q.from }, mine, 1)[0] || freeSlots({ doc: lastDoc }, mine, 1)[0] : null;
    var wk = freeSlots({ docs: docs, sat: true }, mine).filter(function (x) { return !closed(x.date); })[0];
    return [
      { id: 'fast', name: '가장 빠른 칸', slot: fast, why: s.name + ' 담당 ' + docs.length + '명 중 가장 먼저 비는 칸입니다.' },
      { id: 'same', name: '지난번 담당 수의사', slot: same, why: lastDoc ? doc(lastDoc).name + ' 수의사가 지난 기록을 이어서 봅니다.' : q.lastDoc ? doc(q.lastDoc).name + ' 수의사는 ' + s.name + ' 담당이 아닙니다.' : '예약 정보에서 지난번 담당 수의사를 고르면 그 수의사의 가장 빠른 칸을 찾습니다.' },
      { id: 'sat', name: '토요일 칸', slot: wk, why: '평일에 오기 어려울 때. 토요일은 14:30에 접수를 마감하고 대기가 깁니다.' },
    ];
  }

  // ── 응급 · 답하지 않을 것 ─────────────────────────────────
  function emergency(text) {
    var t = String(text || '');
    return D.EMERGENCY.filter(function (e) { return e.words.some(function (w) { return t.indexOf(w) > -1; }); });
  }
  function forbidden(text) { var t = String(text || ''); return D.NO_ANSWER.some(function (w) { return t.indexOf(w) > -1; }); }

  // ── 말로 조건 넣기 ─────────────────────────────────────────
  var DOWS = { '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6 };
  var SVC_WORDS = [
    ['vacc', /접종|백신|광견병|켄넬|코로나/], ['checkup', /검진/], ['dental', /스케일링|치석|이빨|치아|치과/],
    ['neuter', /중성화/], ['skin', /피부|귀|가려/], ['imaging', /엑스레이|초음파|영상/], ['surgery', /수술|슬개골|봉합/],
  ];
  function parse(text) {
    var src = String(text || ''), left = src, chips = [];
    function take(re, fn) {
      var m = left.match(re); if (!m) return false;
      var r = fn(m); if (r === false) return false;
      left = left.replace(m[0], ' ');
      if (r) chips.push(r);
      return true;
    }
    // 종 · 품종
    var sp = '', breed = '';
    ['dog', 'cat'].forEach(function (k) {
      if (sp) return;
      D.BREEDS[k].forEach(function (b) { if (!sp && left.indexOf(b) > -1) { sp = k; breed = b; left = left.replace(b, ' '); } });
    });
    if (!sp) take(/(^|\s)(개|고양이|냥이)(?=\s|,|$|가|는|를|이)/, function (m) { sp = m[2] === '개' ? 'dog' : 'cat'; breed = m[2]; return null; });
    if (sp) chips.push({ k: 'sp', v: sp, label: '종', text: (sp === 'dog' ? '개' : '고양이') + (breed && breed !== '개' && breed !== '고양이' ? ' · ' + breed : '') });
    // 나이
    take(/(\d{1,2})\s*(살|세)/, function (m) { return { k: 'age', v: +m[1], label: '나이', text: m[1] + '살' }; }) ||
      take(/(\d{1,2})\s*개월/, function (m) { return { k: 'age', v: Math.round(+m[1] / 12 * 10) / 10, months: +m[1], label: '나이', text: m[1] + '개월' }; });
    // 체중
    take(/(\d{1,2}(?:\.\d)?)\s*(kg|킬로|키로|㎏)/i, function (m) { return { k: 'kg', v: +m[1], label: '체중', text: m[1] + ' kg' }; });
    // 날짜
    var date = '';
    take(/오늘/, function () { date = TODAY; return null; }) ||
      take(/내일/, function () { date = add(TODAY, 1); return null; }) ||
      take(/모레/, function () { date = add(TODAY, 2); return null; }) ||
      take(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/, function (m) { date = '2026-' + pad(+m[1]) + '-' + pad(+m[2]); if (date < TODAY) date = '2027-' + pad(+m[1]) + '-' + pad(+m[2]); return null; }) ||
      take(/(다음 ?주|이번 ?주)?\s*([일월화수목금토])요일/, function (m) {
        var want = DOWS[m[2]], s = add(TODAY, 1);
        if (m[1] && /다음/.test(m[1])) { s = add(TODAY, 7 - dow(TODAY) + 1); }
        for (var i = 0; i < 14 && dow(s) !== want; i++) s = add(s, 1);
        date = s; return null;
      });
    if (date) chips.push({ k: 'date', v: date, label: '날짜', text: md(date) });
    // 시간대
    take(/오전|아침/, function () { return { k: 'part', v: 'am', label: '시간대', text: '오전' }; }) ||
      take(/오후|저녁/, function () { return { k: 'part', v: 'pm', label: '시간대', text: '오후' }; });
    // 진료 과목
    SVC_WORDS.some(function (w) {
      return take(w[1], function () { return { k: 'svc', v: w[0], label: '진료', text: svc(w[0]).name }; });
    });
    // 수의사
    D.DOCTORS.some(function (dc) { return take(new RegExp(dc.name + '|' + dc.name.slice(1)), function () { return { k: 'doc', v: dc.id, label: '수의사', text: dc.name }; }); });
    // 남은 조각
    var rest = left.split(/[,，.·\n]+/).map(function (x) {
      x = x.replace(/(이)?에요|예요|입니다|이고요/g, ' ').replace(/예약\S*|싶\S*|해\s?주\S*|부탁\S*|가능\S*|되나요|있나요|선생님|원장님|수의사님?|진료\S*|보고\s?싶\S*/g, ' ');
      return x.replace(/(으로|에|을|를|이|가|은|는|도|요|쯤|정도|이고|이며|하고|고|예약|해 ?주세요|싶어요|싶습니다|할게요|하려고|부탁|가능|되나요|있나요)(?=\s|$)/g, ' ').replace(/\s+/g, ' ').trim();
    }).filter(function (x) { return x.length > 1 && !/^(그리고|좀|저|우리|애|아이)$/.test(x); });
    return { chips: chips, rest: rest, src: src };
  }

  // ── 접종 수첩 붙여넣기 ─────────────────────────────────────
  function findVacc(sp, line) {
    var low = line.toLowerCase(), list = D.VACCINES[sp] || [];
    for (var i = 0; i < list.length; i++) {
      if (low.indexOf(list[i].name) > -1 || list[i].alias.some(function (a) { return low.indexOf(a) > -1; })) return list[i];
    }
    return null;
  }
  function parsePaste(sp, text) {
    var ok = [], bad = [];
    String(text || '').split(/\n/).forEach(function (raw, i) {
      var line = raw.trim(); if (!line) return;
      var ds = [], re = /(\d{4})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/g, m;
      while ((m = re.exec(line))) { var s = m[1] + '-' + pad(+m[2]) + '-' + pad(+m[3]); if (okDate(s)) ds.push(s); }
      var v = findVacc(sp, line);
      var nth = (line.match(/(\d)\s*차/) || [])[1];
      if (!v) { bad.push({ line: i + 1, raw: line, why: '접종 이름을 못 읽음' }); return; }
      if (!ds.length) { bad.push({ line: i + 1, raw: line, why: '날짜 없음' }); return; }
      var next = ds[1] || '';
      var n = nth ? Math.min(+nth, v.n) : v.n;
      ok.push({ line: i + 1, raw: line, id: v.id, name: v.name, date: ds[0], n: n, next: next });
    });
    return { ok: ok, bad: bad };
  }

  G.OYC = {
    pad: pad, esc: esc, won: won, add: add, diff: diff, dow: dow, md: md, ymd: ymd, okDate: okDate, TODAY: TODAY, mins: mins,
    bandOf: bandOf, priceRows: priceRows, price: price, priceItem: priceItem,
    vaccine: vaccine, nextVacc: nextVacc, vaccPlan: vaccPlan, STATE: STATE, ageText: ageText,
    closed: closed, hoursOf: hoursOf, times: times, doc: doc, slot: slot, freeSlots: freeSlots, svc: svc, threeOptions: threeOptions,
    emergency: emergency, forbidden: forbidden, parse: parse, parsePaste: parsePaste,
  };
})(typeof window !== 'undefined' ? window : globalThis);
