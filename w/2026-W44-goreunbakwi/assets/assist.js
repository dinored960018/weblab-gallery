// 고른바퀴 경정비 — 도우미 규칙 (브라우저 · 테스트 공용). 외부 API 없음, 이 사이트의 표와 규칙으로만 답한다
(function (g) {
  'use strict';
  var D = g.GB, C = g.GBCALC;

  var ITEM_WORDS = [
    ['padf', /앞\s*(브레이크\s*)?패드|브레이크\s*패드\s*\(?앞|패드/],
    ['padr', /뒤\s*(브레이크\s*)?패드|브레이크\s*패드\s*\(?뒤/],
    ['bfl', /브레이크\s*(오일|액)/],
    ['acf', /에어컨\s*필터|실내\s*필터/],
    ['air', /에어\s*클리너|공기\s*필터/],
    ['fuel', /연료\s*필터/],
    ['oil', /엔진\s*오일|오일(?!\s*필터)|엔진유/],
    ['tire', /타이어/],
    ['bat', /배터리|밧데리/],
    ['plug', /점화\s*플러그|플러그/],
    ['atf', /변속기|미션\s*오일|미션/],
    ['cool', /냉각수|부동액/],
  ];
  // 앞 패드보다 뒤 패드가 먼저 걸리게
  function findItems(q) {
    var out = [];
    if (/뒤\s*(브레이크\s*)?패드|브레이크\s*패드\s*\(?뒤/.test(q)) out.push('padr');
    ITEM_WORDS.forEach(function (w) {
      if (w[0] === 'padr') return;
      if (w[0] === 'padf' && out.indexOf('padr') > -1 && !/앞/.test(q)) return;
      if (w[1].test(q) && out.indexOf(w[0]) < 0) out.push(w[0]);
    });
    return out;
  }

  // "8만 4천 km" · "84,000km" · "8.4만" · "84000 킬로"
  function parseKm(s) {
    var m = s.match(/(\d+(?:\.\d+)?)\s*만(?:\s*(\d+)\s*천)?(?:\s*(\d+))?\s*(?:km|킬로|키로)?/i);
    if (m) return Math.round(parseFloat(m[1]) * 10000 + (m[2] ? +m[2] * 1000 : 0) + (m[3] ? +m[3] : 0));
    m = s.match(/(\d{1,3}(?:,\d{3})+|\d{3,6})\s*(?:km|킬로|키로)/i);
    if (m) return +m[1].replace(/,/g, '');
    m = s.match(/(\d+)\s*천\s*(?:km|킬로|키로)/i);
    if (m) return +m[1] * 1000;
    return null;
  }
  // 날짜 표현 → 지금으로부터 몇 개월 전
  function parseAgo(s) {
    var now = D.NOW, m;
    if ((m = s.match(/(\d+)\s*개월\s*전/))) return +m[1];
    if ((m = s.match(/(\d+)\s*년\s*전/))) return +m[1] * 12;
    if ((m = s.match(/(작년|지난해|재작년|올해|올\s|(20\d\d)\s*년)\s*(\d{1,2})\s*월/))) {
      var y = m[2] ? +m[2] : /재작년/.test(m[1]) ? now.y - 2 : /작년|지난해/.test(m[1]) ? now.y - 1 : now.y;
      return (now.y - y) * 12 + now.m - +m[3];
    }
    if ((m = s.match(/(작년|지난해)/))) return 12;
    return null;
  }

  // 문장 → 칸 값. 조각마다 읽은 것 · 못 읽은 것을 남긴다
  function parseCar(text, base) {
    var s0 = base || {};
    var car = { c: s0.c, f: s0.f, y: s0.y, km: s0.km, last: Object.assign({}, s0.last || {}) };
    var chips = [], miss = [];
    var parts = [];
    String(text).split(/,(?!\d{3})|[，·\n]|그리고|이고|이며/).forEach(function (x) {
      // 품목 낱말 앞에서 한 번 더 자른다: "63,200km 앞 패드 47,000km" → 두 조각
      var cuts = [0], re = /(앞|뒤)?\s*(브레이크\s*패드|패드|엔진\s*오일|오일|에어컨\s*필터|에어\s*클리너|공기\s*필터|브레이크\s*(오일|액)|연료\s*필터|타이어|배터리|점화\s*플러그|플러그|변속기|미션|냉각수|부동액)/g, m;
      while ((m = re.exec(x))) if (m.index > 0) cuts.push(m.index);
      cuts.push(x.length);
      for (var i = 0; i < cuts.length - 1; i++) { var seg = x.slice(cuts[i], cuts[i + 1]).trim(); if (seg) parts.push(seg); }
    });
    // 차급 · 연료 · 연식 · 주행거리는 문장 전체에서 먼저
    parts.forEach(function (p) {
      var got = false, m;
      var cls = /준중형/.test(p) ? 'jun' : /중형/.test(p) && !/준중형/.test(p) ? 'mid' : /경차|경형/.test(p) ? 'kei' : /대형/.test(p) ? 'big' : /suv|에스유브이/i.test(p) ? 'suv' : null;
      if (cls) { car.c = cls; chips.push({ k: 'c', label: '차급', v: C.cls(cls).name }); got = true; }
      var fu = /가솔린|휘발유/.test(p) ? 'g' : /디젤|경유/.test(p) ? 'd' : /lpg|엘피지|가스차/i.test(p) ? 'l' : null;
      if (fu) { car.f = fu; chips.push({ k: 'f', label: '연료', v: C.fuel(fu).name }); got = true; }
      if ((m = p.match(/(20\d\d|\d\d)\s*년\s*식/))) { var y = +m[1]; if (y < 100) y += 2000; car.y = y; chips.push({ k: 'y', label: '연식', v: y + '년' }); got = true; }
      var items = findItems(p);
      var k = parseKm(p);
      if (items.length) {
        var ago = parseAgo(p);
        items.forEach(function (id) {
          var it = C.byId(D.ITEMS, id);
          if (k != null) { car.last[id] = k; chips.push({ k: 'l-' + id, label: it.short + ' 마지막 교환', v: C.km(k) }); got = true; }
          else if (ago != null) { car.last[id] = { ago: ago }; chips.push({ k: 'l-' + id, label: it.short + ' 마지막 교환', v: ago + '개월 전', est: true }); got = true; }
          else miss.push(p);
        });
      } else if (k != null) { car.km = k; chips.push({ k: 'km', label: '주행거리', v: C.km(k) }); got = true; }
      if (!got && miss.indexOf(p) < 0) miss.push(p);
    });
    // 날짜로 받은 교환 시점은 연 평균 운행으로 km 를 추정한다
    if (car.km != null) {
      var perMonth = car.y ? car.km / C.ageMonths(car.y) : D.AVG_MONTH;
      Object.keys(car.last).forEach(function (id) {
        var v = car.last[id];
        if (v && typeof v === 'object') {
          var est = Math.max(0, Math.round((car.km - perMonth * v.ago) / 100) * 100);
          car.last[id] = est;
          chips.forEach(function (ch) { if (ch.k === 'l-' + id) ch.v = '약 ' + C.km(est) + ' (' + v.ago + '개월 전, 월 ' + (car.y ? '평균 ' : '') + C.km(Math.round(perMonth / 10) * 10) + (car.y ? '로 추정)' : '로 잡아 추정)'); });
        }
      });
    } else {
      Object.keys(car.last).forEach(function (id) { if (car.last[id] && typeof car.last[id] === 'object') { delete car.last[id]; } });
      chips = chips.filter(function (ch) { if (ch.est) { miss.push(ch.label + ' — 주행거리가 있어야 km로 바꿀 수 있음'); return false; } return true; });
    }
    return { car: car, chips: chips, miss: miss };
  }

  function sampleOr(car) { return car && car.km != null ? car : D.SAMPLE; }
  function rel() { return g.GB_REL || ''; }

  // 질문 → 답. steps 가 있으면 단계를 보인다
  function answer(q, ctx) {
    q = String(q || '').trim();
    var car = sampleOr(ctx.car);
    var isSample = !(ctx.car && ctx.car.km != null);
    var who = V().carLabel(car) + ' ' + C.km(car.km) + (isSample ? ' (예시 차)' : '');
    var R = rel();
    if (!q) return { text: '질문을 입력하세요.' };

    if (/사람|정비사|상담|전화|직원/.test(q)) return { text: '상담 요청서를 만듭니다. 대화와 차 정보를 요약해 채웠습니다. 고친 뒤 확인하세요.', act: [{ id: 'hand', label: '상담 요청서 열기' }] };

    var parsed = parseCar(q, ctx.car || {});
    var carish = parsed.chips.some(function (c) { return c.k === 'c' || c.k === 'km' || c.k === 'f' || c.k.indexOf('l-') === 0 && /\d/.test(c.v) && !/얼마|언제|남/.test(q); });
    if (carish && !/언제|얼마|남았|남은|\?/.test(q)) {
      return { text: '문장에서 읽은 값입니다. 필요 없는 값은 빼고 넣으세요. 넣은 뒤 칸에서 고칠 수 있습니다.', parse: parsed, act: [{ id: 'apply', label: '칸에 넣기' }] };
    }

    var items = findItems(q);
    if (items.length && /얼마|값|공임|비용|가격|원/.test(q)) {
      var lines = [], refs = [];
      items.forEach(function (id) {
        var it = C.byId(D.ITEMS, id); var w = C.byId(D.WORKS, it.work); var p = C.price(w, car.c);
        lines.push(w.name + ': 공임 ' + C.won(p.labor) + ' · 정품 ' + (p.oem ? C.won(p.oem) : '없음') + ' · 호환 ' + (p.alt ? C.won(p.alt) : '없음') + (p.re ? ' · 재생 ' + C.won(p.re) : '') + ' · ' + w.min + '분');
        refs.push({ label: '값표 ' + it.short + ' 줄', href: R + 'price/index.html?c=' + car.c + '#pr-' + w.id });
      });
      return { text: C.cls(car.c).name + ' 기준 · 부가세 별도', lines: lines, refs: refs, steps: ['차급 확인', '값표 대조'], act: [{ id: 'est', label: '견적 초안', works: items.map(function (id) { return C.byId(D.ITEMS, id).work; }) }] };
    }
    if (items.length) {
      var dg = C.diagnose(car);
      var ls = [], rf = [];
      items.forEach(function (id) {
        var r = dg.rows.filter(function (x) { return x.id === id; })[0];
        var it = C.byId(D.ITEMS, id);
        if (!r) { ls.push(it.short + ': ' + C.fuel(car.f).name + ' 차에는 해당 없음'); return; }
        ls.push(it.short + ': ' + C.remText(r) + ' · ' + C.etaText(r) + ' · 다음 ' + C.km(r.next) + (r.assumed ? ' · 기록 없음, 주기대로 교환한 것으로 계산' : ''));
        rf.push({ label: '주기표 ' + it.short + ' 줄', href: R + 'schedule/index.html?c=' + car.c + '&f=' + car.f + '#sc-' + id });
      });
      return { text: who + ' 기준', lines: ls, refs: rf, steps: ['차 정보 확인', '주기표 대조', '남은 거리 계산'] };
    }
    if (/진단|뭐.*갈|교환할|갈아야|점검/.test(q)) {
      var d2 = C.diagnose(car);
      var due = d2.over.concat(d2.soon);
      var e = C.estimate(car.c, due.map(function (r) { return { id: r.work, g: 'oem' }; }));
      return {
        text: who + ' 기준 · 지금 교환 ' + d2.over.length + ' · 곧 교환 ' + d2.soon.length,
        lines: due.map(function (r) { return r.short + ': ' + C.remText(r); }).concat(due.length ? ['정품 기준 견적 ' + C.won(e.total) + ' · ' + e.min + '분'] : []),
        refs: due.slice(0, 3).map(function (r) { return { label: '주기표 ' + r.short + ' 줄', href: R + 'schedule/index.html?c=' + car.c + '&f=' + car.f + '#sc-' + r.id }; }),
        steps: ['차 정보 확인', '주기표 대조', '견적 계산'],
        act: due.length ? [{ id: 'est', label: '견적 초안', works: due.map(function (r) { return r.work; }) }, { id: 'book', label: '예약 초안', min: e.book }] : [],
      };
    }
    if (/예약|비어|빈\s*칸|리프트|자리|언제\s*가/.test(q)) {
      var found = [];
      D.BOOK_DAYS.forEach(function (iso) {
        D.LIFTS.forEach(function (l) { C.slotTimes(iso).forEach(function (t) { if (found.length < 3 && C.fits(iso, l.id, t, 60, ctx.mine || {}) && !found.some(function (x) { return x.iso === iso && x.t === t; })) found.push({ iso: iso, lift: l.id, t: t }); }); });
      });
      found.sort(function (a, b) { return a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : a.t - b.t; });
      return { text: '60분 작업 기준 가장 이른 빈칸입니다.', lines: found.map(function (x) { return C.dayInfo(x.iso).label + ' · 리프트 ' + x.lift + ' · ' + C.hm(x.t); }), refs: [{ label: '리프트 시간표', href: R + 'booking/index.html' }], steps: ['시간표 확인', '이어서 빈칸 찾기'], act: [{ id: 'book', label: '예약 초안', min: 60 }] };
    }
    if (/영업|몇\s*시|문\s*(을|여|닫)|휴무|쉬는|토요일|일요일/.test(q)) {
      return { text: '영업시간입니다.', lines: D.HOURS.map(function (h) { return h[0] + ': ' + h[1] + (h[2] ? ' · ' + h[2] : ''); }), refs: [{ label: '오시는 길 영업시간', href: R + 'visit/index.html#hr-h' }] };
    }
    if (/견적/.test(q)) {
      return { text: '진단 결과의 지금 · 곧 교환 품목으로 견적 초안을 만듭니다.', act: [{ id: 'est', label: '견적 초안', works: C.diagnose(car).over.concat(C.diagnose(car).soon).map(function (r) { return r.work; }) }] };
    }
    return { text: '이 질문은 이 사이트의 표와 규칙으로 답할 수 없습니다. 아래 질문을 고르거나 정비사에게 넘기세요.', miss: true, act: [{ id: 'hand', label: '정비사에게 넘기기' }] };
  }
  function V() { return g.GBVIEW; }

  // 영수증 붙여넣기 — 한 줄에 날짜 · 작업 · km · 금액
  function parseReceipt(text) {
    var rows = [], bad = [];
    String(text).split(/\n/).forEach(function (line) {
      var l = line.trim(); if (!l) return;
      var dm = l.match(/(20\d\d)\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})/);
      var items = findItems(l);
      var kmm = l.match(/(\d{1,3}(?:,\d{3})+|\d{3,6})\s*(?:km|킬로)/i);
      var wm = l.match(/(\d{1,3}(?:,\d{3})+|\d{4,7})\s*원/);
      if (!dm || !items.length || !kmm) { bad.push({ line: l, why: !dm ? '날짜 없음' : !items.length ? '품목 못 읽음' : '주행거리 없음' }); return; }
      rows.push({ date: dm[1] + '-' + C.pad(+dm[2]) + '-' + C.pad(+dm[3]), items: items, km: +kmm[1].replace(/,/g, ''), won: wm ? +wm[1].replace(/,/g, '') : null, src: l });
    });
    return { rows: rows, bad: bad };
  }

  g.GBASSIST = { parseCar: parseCar, parseKm: parseKm, parseAgo: parseAgo, findItems: findItems, answer: answer, parseReceipt: parseReceipt };
})(typeof window !== 'undefined' ? window : globalThis);
