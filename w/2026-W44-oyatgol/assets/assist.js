// 오얏골동물병원 — 접수 도우미의 답 규칙 (낱말 규칙 + 이 사이트 데이터, 외부 API 없음)
(function (G) {
  'use strict';
  var D = G.OY, C = G.OYC, esc = C.esc;
  var SPN = { dog: '개', cat: '고양이' };

  var PRICE_WORDS = [
    ['vacc-combo', /종합/], ['vacc-rabies', /광견병/], ['vacc-corona', /코로나/], ['vacc-kennel', /켄넬/], ['vacc-flu', /인플루엔자|독감/],
    ['vacc-felv', /백혈병/], ['titer', /항체/], ['hw', /심장사상충/], ['blood', /혈액/], ['xray', /엑스레이|x-?ray/i], ['us', /초음파/],
    ['check-full', /정밀/], ['check-basic', /검진/], ['ear', /귀/], ['nail', /발톱|항문낭/], ['scale', /스케일링|치석/],
    ['neuter-f', /암컷.*중성화|중성화.*암컷/], ['neuter-m', /중성화/], ['ward', /입원/], ['revisit', /재진/], ['first', /초진|진찰|진료비/], ['vacc-combo', /백신|접종/],
  ];

  function tel(t) { return '<a href="tel:' + t.replace(/-/g, '') + '">' + t + '</a>'; }
  function ev(rel, page, hash, label, q) { return '<a class="a-ev" href="' + rel + page + '/index.html' + (q || '') + '#' + hash + '">근거: ' + label + '</a>'; }
  function act(name, label, data, cls) { return '<button type="button" class="btn sm' + (cls ? ' ' + cls : '') + '" data-act="' + name + '"' + (data ? " data-x='" + esc(JSON.stringify(data)) + "'" : '') + '>' + label + '</button>'; }
  function link(rel, page, q, label, cls) { return '<a class="btn sm' + (cls ? ' ' + cls : '') + '" href="' + rel + page + '/index.html' + (q || '') + '">' + label + '</a>'; }
  function slotText(s) { return s ? C.md(s.date) + ' ' + s.time + ' · ' + C.doc(s.doc).name : '이번 예약 기간에 빈칸 없음'; }
  function bookQ(s, svc, extra) { return '?draft=1&svc=' + (svc || 'general') + (s ? '&date=' + s.date + '&time=' + s.time + '&doc=' + s.doc : '') + (extra || ''); }

  function sosCard(hits, rel) {
    return '<div class="a-sos" role="alert"><p class="a-sos-h">예약보다 전화가 먼저입니다</p>' +
      '<p>지금 ' + tel(D.SITE.tel) + ' (진료 시간) · ' + tel(D.SITE.night.tel) + ' ' + D.SITE.night.name + ' (19:00 이후, 가상)</p>' +
      '<p>읽은 신호: ' + hits.map(function (h) { return '<a href="' + rel + 'emergency/index.html#em-' + h.id + '">「' + h.t + '」</a>'; }).join(', ') + '</p></div>';
  }

  // ctx: { rel, page, pet, vacc, mine, book }
  function answer(q, ctx) {
    var rel = ctx.rel, pet = ctx.pet || {}, t = String(q || '').trim();
    if (!t) return null;

    // 1. 응급 낱말 — 언제나 맨 먼저
    var hits = C.emergency(t);
    if (hits.length) {
      return { steps: ['낱말 확인', '응급 신호 목록 대조'], kind: 'sos',
        html: sosCard(hits, rel) + '<p>증상 판단은 수의사가 합니다. 도우미는 예약을 잡지 않습니다.</p>' +
          '<p class="a-evs">' + ev(rel, 'emergency', 'em-' + hits[0].id, '응급 신호 목록 · ' + hits[0].t) + '</p>' };
    }
    // 2. 진단 · 처방 · 약 용량
    if (C.forbidden(t)) {
      return { steps: ['낱말 확인'], kind: 'no',
        html: '<p>진단 · 처방 · 약 용량은 안내하지 않습니다. 증상 판단과 약은 수의사가 정합니다.</p><p class="a-acts">' + act('hand', '수의사 상담 요청서 만들기') + '</p>' };
    }

    // 3. 문장에서 조건 읽기 (칩 둘 이상)
    var p = C.parse(t);
    var asksPrice = /얼마|값|비용|가격/.test(t);
    var hasPet = p.chips.some(function (c) { return c.k === 'sp' || c.k === 'kg' || c.k === 'age'; });
    if (!ctx.noParse && p.chips.length >= 2 && hasPet && !asksPrice) {
      var chips = p.chips.map(function (c, i) {
        return '<li class="chip" data-i="' + i + '"><span>' + c.label + '</span> <b>' + esc(c.text) + '</b> <button type="button" class="chip-x" data-act="chip-x" aria-label="' + c.label + ' ' + esc(c.text) + ' 빼기">빼기</button></li>';
      }).join('');
      return { steps: ['문장 읽기', '칸 맞추기'], kind: 'parse',
        html: '<p>이렇게 읽었습니다. 필요 없는 값은 빼고 넣으십시오.</p><ul class="chips" data-chips=\'' + esc(JSON.stringify(p.chips)) + '\'>' + chips + '</ul>' +
          (p.rest.length ? '<p class="a-miss">못 읽은 부분: ' + p.rest.map(function (r) { return '<mark>' + esc(r) + '</mark>'; }).join(' · ') + '</p>' : '') +
          '<p class="a-acts">' + act('fill', '칸에 넣기') + '</p>' };
    }

    // 4. 값
    if (asksPrice) {
      var pid = '';
      PRICE_WORDS.some(function (w) { if (w[1].test(t)) { pid = w[0]; return true; } return false; });
      if (!pid) pid = 'first';
      var it = C.priceItem(pid);
      var sp = p.chips.filter(function (c) { return c.k === 'sp'; })[0];
      sp = sp ? sp.v : pet.sp || 'dog';
      if (it.sp && it.sp !== sp) sp = it.sp;
      var kgc = p.chips.filter(function (c) { return c.k === 'kg'; })[0];
      var kg = kgc ? kgc.v : pet.kg;
      var band = C.bandOf(sp, kg);
      var bands = D.BANDS[sp];
      var body;
      if (band > -1) {
        body = '<p>' + SPN[sp] + ' ' + kg + ' kg (' + bands[band] + ') · ' + it.name + ': <b>' + C.won(C.price(pid, sp, band)) + '</b></p>';
      } else {
        var lo = C.price(pid, sp, 0), hi = C.price(pid, sp, bands.length - 1);
        body = '<p>' + SPN[sp] + ' · ' + it.name + ': <b>' + (lo === hi ? C.won(lo) : C.won(lo) + '~' + C.won(hi)) + '</b></p>' + (lo === hi ? '' : '<p>체중을 알려 주면 구간 값으로 답합니다. 예: 4.2kg</p>');
      }
      if (pid === 'neuter-m' && !/수컷/.test(t)) body += '<p>암컷은 ' + C.won(C.price('neuter-f', sp, Math.max(0, band))) + (band > -1 ? '' : '부터') + '입니다.</p>';
      return { steps: ['반려동물 정보 확인', '진료비표 대조'], kind: 'price',
        html: body + '<p class="a-evs">' + ev(rel, 'prices', 'pr-' + pid, '진료비표 · ' + it.name + ' 줄', '?s=' + sp + (band > -1 ? '&kg=' + kg : '')) + '</p>' };
    }

    // 5. 접종 날짜
    if (/접종|백신/.test(t) && /언제|다음|날짜|일정|지났|초안/.test(t)) {
      var st = ctx.vacc, sample = false;
      if (!st || !st.birth) { st = D.SAMPLE; sample = true; }
      var plan = C.vaccPlan(st);
      var rows = plan.map(function (x) {
        return '<li><b>' + x.name + '</b> ' + (x.date ? C.ymd(x.date) : '날짜 필요') + ' · ' + C.STATE[x.state] + ' ' + ev(rel, 'vaccines', 'vx-' + st.sp + '-' + x.id, '주기표 ' + x.name + ' 줄') + '</li>';
      }).join('');
      var over = plan.filter(function (x) { return x.state === 'over'; });
      return { steps: ['반려동물 정보 확인', '접종 주기표 대조', '다음 날짜 계산'], kind: 'vacc',
        html: (sample ? '<p>예방접종 페이지에 넣은 값이 없어 예시(3살 개)로 계산했습니다.</p>' : '<p>예방접종 페이지에 넣은 ' + SPN[st.sp] + ' 기준입니다.</p>') +
          '<ul class="a-list">' + rows + '</ul>' +
          (over.length ? '<p class="a-warn">지난 접종 ' + over.length + '개: ' + over.map(function (x) { return x.name; }).join(' · ') + '. 가까운 날에 오십시오.</p>' : '') +
          '<p class="a-acts">' + link(rel, 'vaccines', '?draft=1' + (sample ? '&sample=1' : ''), '접종 일정 초안') + link(rel, 'booking', bookQ(C.freeSlots({ docs: C.svc('vacc').docs }, ctx.mine, 1)[0], 'vacc'), '예약 초안', 'ghost') + '</p>' };
    }

    // 6. 빈칸 · 예약
    if (/빈칸|빈 칸|예약|빠른|비어/.test(t)) {
      var svcId = (p.chips.filter(function (c) { return c.k === 'svc'; })[0] || {}).v || (ctx.book && ctx.book.svc) || 'general';
      if (/접종|백신/.test(t)) svcId = 'vacc';
      var date = (p.chips.filter(function (c) { return c.k === 'date'; })[0] || {}).v;
      var part = (p.chips.filter(function (c) { return c.k === 'part'; })[0] || {}).v;
      var dc = (p.chips.filter(function (c) { return c.k === 'doc'; })[0] || {}).v;
      var sat = /토요일|주말/.test(t);
      if (date && C.closed(date)) {
        return { steps: ['날짜 확인'], kind: 'closed', html: '<p class="a-warn">' + C.md(date) + '은 ' + C.closed(date) + '입니다.</p><p>다른 날 빈칸: ' + slotText(C.freeSlots({ docs: C.svc(svcId).docs, from: date }, ctx.mine, 1)[0]) + '</p>' };
      }
      var f = { docs: C.svc(svcId).docs, date: date, part: part, doc: dc, sat: sat };
      var list = C.freeSlots(f, ctx.mine, 3);
      var opts = C.threeOptions({ svc: svcId, part: part, from: date, lastDoc: (ctx.book && ctx.book.last) || '' }, ctx.mine);
      return { steps: ['반려동물 정보 확인', '시간표 대조', '비어 있는 칸 찾기'], kind: 'slots',
        html: '<p>' + C.svc(svcId).name + (date ? ' · ' + C.md(date) : '') + (part ? (part === 'am' ? ' 오전' : ' 오후') : '') + (sat ? ' · 토요일' : '') + ' 빈칸</p>' +
          (list.length ? '<ul class="a-list">' + list.map(function (s) { return '<li>' + slotText(s) + ' ' + link(rel, 'booking', bookQ(s, svcId), '이 칸으로 초안', 'ghost') + '</li>'; }).join('') + '</ul>' : '<p>조건에 맞는 빈칸이 없습니다.</p>') +
          '<p class="a-sub">세 가지 안</p><ul class="a-list">' + opts.map(function (o) { return '<li><b>' + o.name + '</b> ' + (o.slot ? slotText(o.slot) : o.id === 'same' && !(ctx.book && ctx.book.last) ? '정하지 않음 (예약 페이지에서 고름)' : '빈칸 없음') + '</li>'; }).join('') + '</ul>' +
          '<p class="a-evs">' + ev(rel, 'doctors', 'dr-' + f.docs[0], '수의사 진료 시간표') + '</p>' };
    }

    // 7. 오늘 진료 · 수의사
    if (/수의사|진료하는|누가|원장|선생/.test(t)) {
      var w = /토요일/.test(t) ? 6 : /일요일/.test(t) ? 0 : null;
      if (w != null) {
        var who = D.DOCTORS.filter(function (d) { return d.days.indexOf(w) > -1; });
        return { steps: ['요일 확인', '진료 시간표 대조'], kind: 'docs', html: '<p>' + D.DOW[w] + '요일: ' + (who.length ? who.map(function (d) { return d.name + ' (' + d.field + ')'; }).join(' · ') : '휴진') + '</p><p class="a-evs">' + ev(rel, 'doctors', 'dr-' + (who[0] || D.DOCTORS[0]).id, '요일별 진료 시간표') + '</p>' };
      }
      return { steps: ['오늘 현황 확인'], kind: 'today', html: '<p>' + D.NOW.label + ' 기준</p><ul class="a-list">' + D.TODAY.map(function (x) { return '<li><b>' + C.doc(x.doc).name + '</b> ' + x.state + ' · ' + x.where + '</li>'; }).join('') + '</ul><p class="a-evs">' + ev(rel, 'doctors', 'dr-park', '요일별 진료 시간표 · 금요일 수술') + '</p>' };
    }
    // 8. 대기
    if (/대기|기다/.test(t)) {
      var b = ctx.board || D.BOARD[0];
      return { steps: ['오늘 현황 확인'], kind: 'wait', html: '<p>' + b.t + ' 기준 대기 ' + b.wait + '마리 · 예상 ' + b.mins + '분. 예약 환자를 먼저 봅니다.</p><p class="a-acts">' + link(rel, 'booking', '', '예약 칸 보기', 'ghost') + '</p>' };
    }
    // 9. 입원
    if (/입원|면회|준비물/.test(t)) {
      var free = D.WARD.rooms.reduce(function (a, r) { return a + r.free; }, 0);
      return { steps: ['입원실 현황 확인'], kind: 'ward',
        html: '<p>입원실 남은 칸 ' + free + ' / 6 (' + D.WARD.rooms.map(function (r) { return r.name + ' ' + r.free; }).join(' · ') + ')</p><p>면회: 평일 14:00~15:00 · 18:00~18:30, 토요일 12:00~13:00</p>' +
          '<p class="a-acts">' + link(rel, 'inpatient', '?draft=1', '준비물 초안') + '</p><p class="a-evs">' + ev(rel, 'inpatient', 'ward-fee', '입원 하루 요금') + '</p>' };
    }
    if (/야간|밤|응급/.test(t)) {
      return { steps: ['응급 안내 확인'], kind: 'night', html: '<p>19:00 이후: ' + D.SITE.night.name + ' (가상) ' + tel(D.SITE.night.tel) + ' · ' + D.SITE.night.hours + '</p><p>' + D.SITE.night.way + '</p><p class="a-evs">' + ev(rel, 'emergency', 'h-sig', '응급 신호 목록') + '</p>' };
    }
    if (/휴진|쉬는/.test(t)) {
      return { steps: ['휴진일 확인'], kind: 'closed', html: '<p>일요일 · 공휴일 휴진. 임시 휴진: ' + D.CLOSED.map(function (c) { return C.md(c.date) + ' ' + c.why; }).join(' · ') + '</p>' };
    }
    if (/주차|위치|주소|오시는|영업|몇 시|진료 시간/.test(t)) {
      return { steps: ['오시는 길 확인'], kind: 'visit', html: '<p>' + D.SITE.addr + '</p><p>평일 09:30~19:00 · 토요일 09:30~15:00 · 접수 마감 30분 전. 주차는 건물 뒤 4대, 1시간 무료입니다.</p><p class="a-evs">' + ev(rel, 'visit', 'h-hours', '진료 시간 · 휴진일 표') + '</p>' };
    }
    if (/고양이 전용/.test(t)) {
      return { steps: ['진료 과목 확인'], kind: 'svc', html: '<p>고양이 전용 시간: 화 · 목 09:30~12:00, 이수아 수의사. 2층 대기실을 씁니다.</p><p class="a-evs">' + ev(rel, 'services', 'svc-cat', '진료 과목 · 고양이 진료') + '</p>' };
    }
    if (/목욕/.test(t)) {
      return { steps: ['자주 묻는 것 확인'], kind: 'faq', html: '<p>' + D.FAQ[2].a + '</p>' };
    }
    if (/전화할 때|말할 것/.test(t)) {
      return { steps: ['응급 안내 확인'], kind: 'faq', html: '<p>종 · 나이 · 체중, 언제부터 무엇이 달라졌는지, 먹은 것과 양, 먹고 있는 약, 도착 예상 시각.</p>' };
    }
    if (/상담|사람|직접/.test(t)) {
      return { steps: ['대화 요약'], kind: 'hand', html: '<p>대화와 입력을 요약해 상담 요청서를 채웁니다.</p><p class="a-acts">' + act('hand', '상담 요청서 열기') + '</p>' };
    }
    if (p.chips.length === 1) {
      var c1 = p.chips[0];
      return { steps: ['문장 읽기'], kind: 'parse', html: '<p>' + c1.label + ' ' + esc(c1.text) + '만 읽었습니다.</p><ul class="chips" data-chips=\'' + esc(JSON.stringify(p.chips)) + '\'><li class="chip" data-i="0"><span>' + c1.label + '</span> <b>' + esc(c1.text) + '</b> <button type="button" class="chip-x" data-act="chip-x" aria-label="빼기">빼기</button></li></ul><p class="a-acts">' + act('fill', '칸에 넣기') + '</p>' };
    }
    return { steps: ['낱말 확인'], kind: 'none', html: '<p>이 사이트의 표에 없는 질문이라 답할 수 없습니다. 수의사나 접수대에 넘길 수 있습니다.</p><p class="a-acts">' + act('hand', '상담 요청서 만들기') + '</p>' };
  }

  var CHIPS = {
    home: ['오늘 진료하는 수의사', '지금 대기', '내일 오전 접종 빈칸', '야간 응급'],
    services: ['스케일링 값', '고양이 전용 시간', '중성화 값'],
    vaccines: ['다음 접종 날짜', '광견병 값', '종합백신 값'],
    prices: ['종합백신 값', '중성화 값', '입원 하루 값'],
    doctors: ['토요일 진료 수의사', '오늘 진료하는 수의사', '가장 빠른 빈칸'],
    booking: ['가장 빠른 빈칸', '토요일 빈칸', '휴진일'],
    inpatient: ['입원실 남은 칸', '입원 준비물', '입원 하루 값'],
    emergency: ['야간 응급', '전화할 때 말할 것'],
    visit: ['주차', '진료 시간', '휴진일'],
    faq: ['접종 전 목욕', '수의사 상담'],
  };

  G.OYA = { answer: answer, CHIPS: CHIPS, sosCard: sosCard };
})(window);
