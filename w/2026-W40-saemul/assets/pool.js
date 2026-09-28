/* 새물 수영장 — 데이터와 계산. 가상 시설이다. 반·정원·인원 전부 지어낸 값.
   브라우저에서는 <script> 로, build.mjs 에서는 import() 로 같은 파일을 읽는다.
   그래서 모듈 문법(import/export)을 쓰지 않고 globalThis 에 붙인다. */
(function (g) {
  'use strict';

  var DAY = ['일', '월', '화', '수', '목', '금', '토'];

  // 요일별 운영 — 첫 부 시작 시각, 마지막 부가 끝나는 시각
  var OPEN = {
    0: [9, 17], 1: [6, 22], 2: [6, 22], 3: [6, 22], 4: [6, 22], 5: [6, 22], 6: [7, 18],
  };
  // 평일 13시 부는 수질 점검
  var CHECK = { 1: [13], 2: [13], 3: [13], 4: [13], 5: [13], 6: [], 0: [] };

  // 자유수영 레인 구분
  var FREE = { 1: '걷기', 2: '초보', 3: '초보', 4: '중급', 5: '중급', 6: '중급', 7: '상급', 8: '상급' };
  var FREE_CAP = { 걷기: 10, 초보: 8, 중급: 8, 상급: 8 };

  // 레인 로프 — World Aquatics 10레인 배색을 8레인에 옮김
  var ROPE = { 1: 'green', 2: 'blue', 3: 'blue', 4: 'yellow', 5: 'yellow', 6: 'blue', 7: 'blue', 8: 'green' };

  // 25m 한 번 가는 데 걸리는 시간(초). 레인 점 속도가 여기서 나온다
  var PACE = { 걷기: 13, 초보: 9, 중급: 6.5, 상급: 5, 기초: 11, 초급: 8.5 };

  var LEVELS = [
    { slug: 'basic', name: '기초', lanes: [1, 2], cap: 14 },
    { slug: 'beginner', name: '초급', lanes: [3, 4], cap: 16 },
    { slug: 'intermediate', name: '중급', lanes: [5, 6], cap: 18 },
    { slug: 'advanced', name: '상급', lanes: [7, 8], cap: 18 },
  ];

  // 반 — id, 수준, 요일 묶음, 시작 시각, 등록 인원
  var CLASSES = [
    ['b-mwf-06', '기초', '월수금', 6, 14],
    ['n-mwf-06', '초급', '월수금', 6, 12],
    ['i-tt-06', '중급', '화목', 6, 13],
    ['i-mwf-07', '중급', '월수금', 7, 18],
    ['a-mwf-07', '상급', '월수금', 7, 11],
    ['b-tt-07', '기초', '화목', 7, 9],
    ['n-tt-07', '초급', '화목', 7, 16],
    ['b-mwf-10', '기초', '월수금', 10, 6],
    ['n-tt-10', '초급', '화목', 10, 10],
    ['i-mwf-11', '중급', '월수금', 11, 15],
    ['b-tt-19', '기초', '화목', 19, 14],
    ['n-mwf-19', '초급', '월수금', 19, 13],
    ['a-tt-19', '상급', '화목', 19, 9],
    ['i-tt-20', '중급', '화목', 20, 17],
    ['a-mwf-20', '상급', '월수금', 20, 18],
    ['b-sat-09', '기초', '토', 9, 8],
    ['n-sat-10', '초급', '토', 10, 12],
  ].map(function (r) {
    var lv = LEVELS.filter(function (l) { return l.name === r[1]; })[0];
    return {
      id: r[0], level: r[1], slug: lv.slug, days: r[2], hour: r[3],
      lanes: lv.lanes, cap: lv.cap, enrolled: r[4],
    };
  });

  var DAYSET = { 월수금: [1, 3, 5], 화목: [2, 4], 토: [6] };

  function band(h) {
    if (h < 9) return '새벽';
    if (h < 12) return '오전';
    return '저녁';
  }
  CLASSES.forEach(function (c) { c.band = band(c.hour); });

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hm(h, m) { return pad(h) + ':' + pad(m || 0); }

  // ── 휴관일 ────────────────────────────────────────────────
  // 매월 둘째 월요일 + 1월 1일 + 설·추석 연휴
  var HOLIDAYS = {
    '2026-09-24': '추석 연휴', '2026-09-25': '추석', '2026-09-26': '추석 연휴',
    '2027-01-01': '1월 1일',
    '2027-02-06': '설 연휴', '2027-02-07': '설', '2027-02-08': '설 연휴',
  };
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function closedReason(d) {
    var k = ymd(d);
    if (HOLIDAYS[k]) return HOLIDAYS[k];
    if (d.getDay() === 1 && d.getDate() >= 8 && d.getDate() <= 14) return '정기 휴관';
    return '';
  }

  // ── 시간표 ───────────────────────────────────────────────
  // 한 부 = 50분 수영 + 10분 휴식. 부 시작 시각(정시)으로 레인 8개의 용도를 낸다
  function slot(day, h) {
    var o = OPEN[day];
    if (h < o[0] || h >= o[1]) return null;
    if (CHECK[day].indexOf(h) >= 0) return { check: true, lanes: [] };
    var lanes = [];
    for (var n = 1; n <= 8; n++) lanes.push({ n: n, kind: '자유', label: FREE[n] });
    CLASSES.forEach(function (c) {
      if (c.hour !== h || DAYSET[c.days].indexOf(day) < 0) return;
      c.lanes.forEach(function (n) { lanes[n - 1] = { n: n, kind: '강습', label: c.level, cls: c.id }; });
    });
    return { check: false, lanes: lanes };
  }

  function daySlots(day) {
    var out = [];
    for (var h = OPEN[day][0]; h < OPEN[day][1]; h++) out.push({ h: h, s: slot(day, h) });
    return out;
  }

  // 자유 레인 수가 같은 부를 이어 붙인 목록
  function freeRuns(day) {
    var runs = [];
    daySlots(day).forEach(function (x) {
      var free = x.s.check ? 0 : x.s.lanes.filter(function (l) { return l.kind === '자유'; }).length;
      var last = runs[runs.length - 1];
      if (last && last.free === free && last.end === x.h) last.end = x.h + 1;
      else runs.push({ start: x.h, end: x.h + 1, free: free, check: x.s.check });
    });
    return runs;
  }

  // ── 인원 추정 ───────────────────────────────────────────
  var CROWD = { 6: .9, 7: .95, 8: .6, 9: .5, 10: .45, 11: .45, 12: .7, 13: .4, 14: .35, 15: .4,
                16: .5, 17: .6, 18: .85, 19: .9, 20: .8, 21: .5 };
  function rnd(seed) {
    var s = 0;
    for (var i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
    s = (s * 1664525 + 1013904223) >>> 0;
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  }
  function headcount(d, lane) {
    if (lane.kind === '강습') {
      var c = CLASSES.filter(function (x) { return x.id === lane.cls; })[0];
      return lane.n === c.lanes[0] ? Math.ceil(c.enrolled / 2) : Math.floor(c.enrolled / 2);
    }
    var cap = FREE_CAP[lane.label];
    var base = CROWD[d.getHours()] || .4;
    if (d.getDay() === 0 || d.getDay() === 6) base = .6;
    var r = rnd(ymd(d) + ':' + d.getHours() + ':' + lane.n);
    return Math.max(0, Math.min(cap, Math.round(cap * base * (.6 + .6 * r))));
  }

  // ── 지금 ─────────────────────────────────────────────────
  // 지금 시각의 상태. state: swim | rest | check | before | after | closed
  function now(d) {
    var day = d.getDay(), h = d.getHours(), m = d.getMinutes();
    var o = OPEN[day];
    var why = closedReason(d);
    if (why) return { state: 'closed', why: why, lanes: idle() };
    if (h < o[0]) return { state: 'before', next: hm(o[0]), lanes: idle() };
    if (h >= o[1]) return { state: 'after', lanes: idle() };
    var s = slot(day, h);
    if (s.check) return { state: 'check', from: hm(h), to: hm(h + 1), lanes: idle() };
    if (m >= 50) return { state: 'rest', from: hm(h, 50), to: hm(h + 1), lanes: idle() };
    return {
      state: 'swim', from: hm(h), to: hm(h, 50),
      lanes: s.lanes.map(function (l) {
        return { n: l.n, kind: l.kind, label: l.label, count: headcount(d, l), pace: PACE[l.label] };
      }),
    };
  }
  function idle() {
    var a = [];
    for (var n = 1; n <= 8; n++) a.push({ n: n, kind: '', label: '', count: 0, pace: 0 });
    return a;
  }

  g.SAEMUL = {
    DAY: DAY, OPEN: OPEN, FREE: FREE, ROPE: ROPE, PACE: PACE, LEVELS: LEVELS, CLASSES: CLASSES,
    DAYSET: DAYSET, HOLIDAYS: HOLIDAYS,
    hm: hm, pad: pad, ymd: ymd, slot: slot, daySlots: daySlots, freeRuns: freeRuns,
    closedReason: closedReason, now: now,
  };
})(typeof window !== 'undefined' ? window : globalThis);
