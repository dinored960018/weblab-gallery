// 고른바퀴 경정비 — HTML 조각 (브라우저 · build.mjs 공용)
(function (g) {
  'use strict';
  var D = g.GB, C = g.GBCALC;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var GN = { oem: '정품', alt: '호환', re: '재생' };
  var ST = { over: '지남', soon: '곧', ok: '여유' };
  var COUNT = ['없습니다', '한 가지', '두 가지', '세 가지', '네 가지', '다섯 가지', '여섯 가지', '일곱 가지', '여덟 가지', '아홉 가지', '열 가지', '열한 가지', '열두 가지'];
  var SCALE = 0.04; // px / km — 1,000 km = 40 px
  var MAX = 200000;

  function carLabel(s) { return C.cls(s.c).name + ' ' + C.fuel(s.f).name; }

  function summary(s, dg) {
    var n = dg.over.length;
    var head = carLabel(s) + ' ' + C.km(s.km) + ' 기준으로 지금 교환할 품목은 ' + (n ? COUNT[n] + '입니다.' : '없습니다.');
    var soon = dg.soon.length ? ' 곧 교환할 품목은 ' + COUNT[dg.soon.length] + '입니다.' : '';
    return head + soon;
  }

  function row(r, i, s, rel) {
    var ref = rel + 'schedule/index.html?c=' + s.c + '&f=' + s.f + '#sc-' + r.id;
    return '<li class="row st-' + r.st + '" style="--i:' + i + ';--fill:' + r.fill.toFixed(3) + '">' +
      '<p class="r-name">' + esc(r.name) + '</p>' +
      '<p class="r-rem">' + C.remText(r) + '</p>' +
      '<span class="r-bar" aria-hidden="true"><i></i></span>' +
      '<p class="r-eta">' + C.etaText(r) + '</p>' +
      '<p class="r-meta">주기 ' + C.km(r.iv) + ' · ' + (r.assumed ? '기록 없음, 주기대로 교환한 것으로 계산' : '마지막 교환 ' + C.km(r.last)) + ' · 다음 ' + C.km(r.next) + ' <a class="ref" href="' + ref + '">근거: 주기표 ' + esc(r.short) + ' 줄</a></p>' +
      '</li>';
  }

  function results(s, dg, rel) {
    var groups = [['over', '지금 교환'], ['soon', '곧 교환'], ['ok', '여유']];
    var idx = 0;
    var works = dg.over.concat(dg.soon).map(function (r) { return r.work; });
    return groups.map(function (gp) {
      var rows = dg.rows.filter(function (r) { return r.st === gp[0]; });
      return '<section class="grp grp-' + gp[0] + '" aria-labelledby="g-' + gp[0] + '">' +
        '<h3 id="g-' + gp[0] + '"><span class="g-n">' + rows.length + '</span> ' + gp[1] + '</h3>' +
        (rows.length ? '<ol class="rows">' + rows.map(function (r) { return row(r, idx++, s, rel); }).join('') + '</ol>' : '<p class="none">해당 품목 없음</p>') +
        '</section>';
    }).join('') +
      '<p class="res-foot">연 평균 ' + C.km(dg.perYear) + ' 운행 기준 예상 시기 · 차량 설명서의 주기가 우선입니다.</p>' +
      (works.length ? '<p class="res-go"><button type="button" class="btn btn-yel" id="mk-est">견적 초안 만들기</button><button type="button" class="btn btn-line" id="mk-book">예약 초안 만들기</button></p>' : '');
  }

  // 주행거리 띠 — 눈금 · 품목 표시
  function bandTrack(dg) {
    var labels = '';
    for (var k = 0; k <= MAX; k += 10000) labels += '<span class="tk-l" style="left:' + (k * SCALE) + 'px">' + (k ? C.num(k / 1000) + ',000' : '0') + '</span>';
    var ms = dg.rows.filter(function (r) { return r.next <= MAX; }).slice().sort(function (a, b) { return a.next - b.next; });
    var lv = [-1e9, -1e9, -1e9, -1e9];
    var marks = ms.map(function (r) {
      var x = r.next * SCALE;
      var l = 0;
      while (l < 3 && x - lv[l] < 120) l++;
      lv[l] = x;
      return '<span class="mk st-' + r.st + '" style="left:' + x + 'px;--lv:' + l + '">' + esc(r.short) + '</span>';
    }).join('');
    var ticks = '';
    for (var t = 0; t <= MAX; t += 1000) ticks += '<i' + (t % 10000 ? '' : ' class="mj"') + ' style="left:' + (t * SCALE) + 'px"></i>';
    return '<div class="tk" style="width:' + (MAX * SCALE) + 'px">' + ticks + '</div>' + labels + marks;
  }

  // 교환 주기표
  function schedule(c, f) {
    var axis = [0, 50000, 100000, 150000, 200000].map(function (k) {
      return '<span style="left:' + (k / MAX * 100) + '%">' + (k ? C.num(k / 1000) + ',000' : '0') + '</span>';
    }).join('');
    var rows = D.ITEMS.map(function (it) {
      var iv = C.interval(it, c, f);
      var dots = '';
      if (iv) for (var k = iv; k <= MAX; k += iv) dots += '<i style="left:' + (k / MAX * 100) + '%"></i>';
      return '<li class="sc-row' + (iv ? '' : ' na') + '" id="sc-' + it.id + '" tabindex="-1">' +
        '<p class="sc-name">' + esc(it.name) + '</p>' +
        '<p class="sc-iv">' + (iv ? C.km(iv) : '해당 없음') + (iv && it.mo ? ' · ' + it.mo + '개월' : '') + '</p>' +
        '<span class="sc-track" aria-hidden="true">' + dots + '</span>' +
        '</li>';
    }).join('');
    return '<div class="sc-axis" aria-hidden="true">' + axis + '</div><ol class="sc-rows">' + rows + '</ol>';
  }
  function scheduleTable(c, f) {
    return '<table class="tbl"><caption>' + esc(C.cls(c).name + ' ' + C.fuel(f).name) + ' 교환 주기 · 먼저 오는 쪽 기준</caption>' +
      '<thead><tr><th scope="col">품목</th><th scope="col">km</th><th scope="col">기간</th><th scope="col">200,000 km까지 교환 횟수</th></tr></thead><tbody>' +
      D.ITEMS.map(function (it) {
        var iv = C.interval(it, c, f);
        return '<tr id="st-' + it.id + '" tabindex="-1"><th scope="row">' + esc(it.name) + '</th><td data-l="km">' + (iv ? C.km(iv) : '해당 없음') + '</td><td data-l="기간">' + (it.mo ? it.mo + '개월' : '없음') + '</td><td data-l="교환 횟수">' + (iv ? Math.floor(MAX / iv) + '번' : '없음') + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  // 작업값표
  function priceTable(c) {
    var k = C.cls(c);
    return '<table class="tbl tbl-price"><caption>' + esc(k.name) + ' 기준 · 부가세 별도 · 타이어 ' + k.size + '</caption>' +
      '<thead><tr><th scope="col">작업</th><th scope="col">공임</th><th scope="col">정품 부품</th><th scope="col">호환 부품</th><th scope="col">재생 부품</th><th scope="col">작업 시간</th></tr></thead><tbody>' +
      D.WORKS.map(function (w) {
        var p = C.price(w, c);
        var cell = function (v) { return v ? C.won(v) : '없음'; };
        return '<tr id="pr-' + w.id + '" tabindex="-1"><th scope="row">' + esc(w.name) + '</th><td data-l="공임">' + (p.labor ? C.won(p.labor) : '없음') + '</td><td data-l="정품">' + cell(p.oem) + '</td><td data-l="호환">' + cell(p.alt) + '</td><td data-l="재생">' + cell(p.re) + '</td><td data-l="시간">' + w.min + '분</td></tr>';
      }).join('') + '</tbody></table>';
  }

  // 견적 합계
  function estimateSum(e) {
    if (!e.lines.length) return '<p class="est-empty">작업을 하나 이상 고르세요.</p>';
    return '<ol class="est-lines">' + e.lines.map(function (l) {
      return '<li><span>' + esc(l.name) + (l.g ? ' · ' + GN[l.g] : '') + (l.combo ? ' · 공임 없음 (엔진오일과 같이)' : '') + '</span><span>' + C.won(l.labor + l.part) + '</span></li>';
    }).join('') + '</ol>' +
      '<dl class="est-dl"><div><dt>공임</dt><dd>' + C.won(e.labor) + '</dd></div><div><dt>부품</dt><dd>' + C.won(e.part) + '</dd></div><div><dt>부가세 10 %</dt><dd>' + C.won(e.vat) + '</dd></div></dl>' +
      '<p class="est-total"><span>합계</span> <strong>' + C.won(e.total) + '</strong></p>' +
      '<p class="est-time">예상 작업 시간 ' + e.min + '분 · 리프트 ' + e.slots + '칸 (30분 단위)</p>';
  }

  // 리프트 시간표
  function grid(iso, dur, mine, sel) {
    var times = C.slotTimes(iso);
    var head = '<tr><th scope="col">시각</th>' + D.LIFTS.map(function (l) { return '<th scope="col">' + l.name + '</th>'; }).join('') + '</tr>';
    var body = times.map(function (t) {
      return '<tr><th scope="row">' + C.hm(t) + '</th>' + D.LIFTS.map(function (l) {
        var st = C.slotState(iso, l.id, t, mine);
        var ok = st === 'open' && C.fits(iso, l.id, t, dur, mine);
        var inSel = sel && sel.lift === l.id && t >= sel.t && t < sel.t + dur;
        var word = st === 'past' ? '지남' : st === 'full' ? '예약 참' : st === 'mine' ? '내 예약' : ok ? '비어 있음' : '시간 부족';
        var label = l.name + ' ' + C.hm(t) + ' ' + (word === '시간 부족' ? dur + '분이 이어서 비어 있지 않음' : word);
        return '<td><button type="button" class="slot s-' + (st === 'open' && !ok ? 'short' : st) + (inSel ? ' is-sel' : '') + '" data-lift="' + l.id + '" data-t="' + t + '"' + (ok ? '' : ' disabled') + ' aria-pressed="' + (sel && sel.lift === l.id && sel.t === t ? 'true' : 'false') + '" aria-label="' + label + '">' + word + '</button></td>';
      }).join('') + '</tr>';
    }).join('');
    return '<table class="grid"><caption>' + C.dayInfo(iso).label + ' · ' + dur + '분 작업 기준</caption><thead>' + head + '</thead><tbody>' + body + '</tbody></table>';
  }

  // 정비 이력
  function historyTable(h) {
    var s = { c: h.c, f: h.f, y: h.y, km: h.rows[0][1] };
    return '<p class="hi-car">' + esc(carLabel(s)) + ' · ' + h.y + '년식 · 마지막 방문 주행거리 ' + C.km(s.km) + '</p>' +
      '<table class="tbl"><caption>정비 이력 ' + h.rows.length + '건 · 최근 순</caption><thead><tr><th scope="col">날짜</th><th scope="col">주행거리</th><th scope="col">작업</th><th scope="col">금액 (부가세 포함)</th><th scope="col">리프트</th></tr></thead><tbody>' +
      h.rows.map(function (r) {
        var p = r[0].split('-');
        var di = C.dayInfo(r[0]);
        return '<tr><th scope="row">' + p[0] + '년 ' + di.label + '</th><td data-l="주행거리">' + C.km(r[1]) + '</td><td data-l="작업">' + esc(r[2]) + '</td><td data-l="금액">' + C.won(r[3]) + '</td><td data-l="리프트">' + r[4] + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  g.GBVIEW = { esc: esc, GN: GN, ST: ST, SCALE: SCALE, MAX: MAX, summary: summary, results: results, bandTrack: bandTrack, schedule: schedule, scheduleTable: scheduleTable, priceTable: priceTable, estimateSum: estimateSum, grid: grid, historyTable: historyTable, carLabel: carLabel };
})(typeof window !== 'undefined' ? window : globalThis);
