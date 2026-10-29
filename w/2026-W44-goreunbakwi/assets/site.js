// 고른바퀴 경정비 — 화면 동작
(function () {
  'use strict';
  var D = window.GB, C = window.GBCALC, V = window.GBVIEW, A = window.GBASSIST;
  var REL = document.body.getAttribute('data-rel') || '';
  window.GB_REL = REL;
  var PAGE = (document.body.className.match(/p-(\w+)/) || [])[1];
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = V.esc;
  var ss = {
    get: function (k, d) { try { var v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 불가 — 화면만 */ } },
  };
  var Q = new URLSearchParams(location.search);
  var clock = function () { var d = new Date(); return C.pad(d.getHours()) + ':' + C.pad(d.getMinutes()); };
  var toNum = function (v) { v = String(v == null ? '' : v).replace(/[,\s]|km/gi, ''); return /^\d+$/.test(v) ? +v : NaN; };
  function setErr(id, msg) {
    var el = document.getElementById(id), er = document.getElementById(id + '-err');
    if (el) { if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
    if (er) { er.textContent = msg || ''; er.hidden = !msg; }
  }
  function go(url) { location.href = url; }

  // ── 메뉴 ───────────────────────────────────────────────────
  var menuBtn = $('.menu-btn'), nav = $('#nav');
  function menu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    document.body.classList.toggle('lock', open);
    if (open) { var a = $('a', nav); if (a) a.focus(); } else menuBtn.focus();
  }
  menuBtn.addEventListener('click', function () { menu(menuBtn.getAttribute('aria-expanded') !== 'true'); });

  // ── 탭 (화살표 키) ─────────────────────────────────────────
  function tabs(root, onSel) {
    var ts = $$('[role="tab"]', root);
    function sel(t, focus) {
      ts.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
      if (focus) t.focus();
      onSel(t.getAttribute('data-v') || t.id, t);
    }
    ts.forEach(function (t, i) {
      t.addEventListener('click', function () { sel(t, false); });
      t.addEventListener('keydown', function (e) {
        var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? ts.length - 1 : null;
        if (j == null) return;
        e.preventDefault();
        sel(ts[(j + ts.length) % ts.length], true);
      });
    });
    return { sel: function (v) { var t = ts.filter(function (x) { return x.getAttribute('data-v') === v; })[0]; if (t) sel(t, false); } };
  }

  // ── 내 차 · 작업 기록 ───────────────────────────────────────
  function getCar() { return ss.get('gb-car', null); }
  function carOrSample() { return getCar() || JSON.parse(JSON.stringify(D.SAMPLE)); }
  function putCar(car) { ss.set('gb-car', car); ctxLine(); }
  function ctxLine() {
    var c = getCar(), el = $('#ax-ctx');
    if (el) el.textContent = c ? '내 차: ' + V.carLabel(c) + ' ' + C.km(c.km) + ' · ' + c.y + '년식' : '내 차: 예시 차 (준중형 가솔린 84,000 km)';
  }
  function logs() { return ss.get('gb-log', []); }
  function addLog(kind, what, det, before, after) {
    var l = logs();
    l.unshift({ id: Date.now() + '' + l.length, t: clock(), kind: kind, what: what, det: det, before: before, after: after, page: PAGE });
    ss.set('gb-log', l.slice(0, 40));
    renderLogs();
  }
  function undo(id) {
    var l = logs(), e = l.filter(function (x) { return x.id === id; })[0];
    if (!e || e.undone) return;
    if (e.kind === 'car') { if (e.before) ss.set('gb-car', e.before); else { try { sessionStorage.removeItem('gb-car'); } catch (x) { /* 없음 */ } } ctxLine(); if (PAGE === 'home') homeFromCar(); }
    if (e.kind === 'est') { if (e.before) ss.set('gb-est', e.before); else { try { sessionStorage.removeItem('gb-est'); } catch (x) { /* 없음 */ } } if (PAGE === 'estimate') estFromState(ss.get('gb-est', null) || DEF_EST); }
    if (e.kind === 'book' && PAGE === 'booking') bookUndo(e.before);
    e.undone = true;
    ss.set('gb-log', l);
    renderLogs();
    say('되돌렸습니다: ' + e.what);
  }

  // ── 도우미 판 ──────────────────────────────────────────────
  var sheet = $('#ax-sheet'), openBtn = $('#ax-open');
  var liveNote = document.createElement('p');
  liveNote.className = 'visually-hidden'; liveNote.setAttribute('aria-live', 'polite');
  document.body.appendChild(liveNote);
  function say(t) { liveNote.textContent = ''; setTimeout(function () { liveNote.textContent = t; }, 30); }
  function axOpen(tab) {
    if (sheet.hidden) {
      sheet.hidden = false;
      if (!RM) { sheet.classList.add('is-opening'); void sheet.offsetHeight; sheet.classList.remove('is-opening'); }
      openBtn.setAttribute('aria-expanded', 'true');
    }
    axTab(tab || 'chat');
    var f = tab === 'hand' ? $('#hd-sym') : $('#ax-q');
    if (f) f.focus();
  }
  function axClose() {
    if (sheet.hidden) return;
    openBtn.setAttribute('aria-expanded', 'false');
    var done = function () { sheet.hidden = true; sheet.classList.remove('is-closing'); };
    if (RM) done(); else { sheet.classList.add('is-closing'); setTimeout(done, 200); }
    openBtn.focus();
  }
  openBtn.addEventListener('click', function () { if (sheet.hidden) axOpen(); else axClose(); });
  $('#ax-close').addEventListener('click', axClose);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (nav.classList.contains('open')) { menu(false); return; }
    if (!sheet.hidden) axClose();
  });
  var axTabsEl = $('.ax-tabs');
  function axTab(name) {
    $$('[role="tab"]', axTabsEl).forEach(function (t) { var on = t.id === 'axt-' + name; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    ['chat', 'log', 'hand'].forEach(function (n) { $('#axp-' + n).hidden = n !== name; });
    if (name === 'hand') handFill(false);
  }
  tabs(axTabsEl, function (id) { axTab(id.replace('axt-', '')); });

  // 단계 표시 — 짧은 상태 변화. 줄인 모션이면 바로 완료
  function steps(names, cb) {
    var ol = $('#ax-steps');
    ol.hidden = false;
    ol.innerHTML = names.map(function (n) { return '<li>' + esc(n) + ' <span class="st">대기</span></li>'; }).join('');
    var lis = $$('li', ol), i = 0, dt = RM ? 0 : 160;
    function next() {
      if (i > 0) { lis[i - 1].className = 'is-done'; $('.st', lis[i - 1]).textContent = '완료'; }
      if (i >= lis.length) { cb(); return; }
      lis[i].className = 'is-run'; $('.st', lis[i]).textContent = '진행 중';
      i++;
      if (dt) setTimeout(next, dt); else next();
    }
    next();
  }

  var CHIPS = {
    home: ['지금 교환할 품목', '브레이크 패드 교환 시기', '준중형 휘발유 8만 4천 km, 오일 작년 3월', '정비사 상담'],
    schedule: ['타이어 교환 시기', '점화 플러그 교환 시기', '지금 교환할 품목'],
    price: ['엔진오일 값', '배터리 값', '브레이크 패드 값'],
    estimate: ['지금 교환할 품목', '타이어 값', '예약 빈칸'],
    booking: ['예약 빈칸', '토요일 영업시간', '정비사 상담'],
    history: ['지금 교환할 품목', '엔진오일 교환 시기'],
    _: ['지금 교환할 품목', '엔진오일 값', '예약 빈칸', '토요일 영업시간', '정비사 상담'],
  };
  $('#ax-chips').innerHTML = (CHIPS[PAGE] || CHIPS._).map(function (c) { return '<button type="button">' + esc(c) + '</button>'; }).join('');
  $('#ax-chips').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) ask(b.textContent); });
  $('#ax-ask').addEventListener('submit', function (e) { e.preventDefault(); var q = $('#ax-q'); if (q.value.trim()) { ask(q.value); q.value = ''; } });

  function chat() { return ss.get('gb-chat', []); }
  function ask(q) {
    var msgs = chat();
    msgs.push({ me: q });
    ss.set('gb-chat', msgs);
    renderChat();
    var a = A.answer(q, { car: getCar(), mine: ss.get('gb-book', {}) });
    var fin = function () {
      var m = chat(); m.push({ ai: a }); ss.set('gb-chat', m.slice(-30));
      renderChat();
      if (a.act && a.act.length === 1 && a.act[0].id === 'hand') { /* 질문 문장이 상담 요청이면 바로 연다 */ if (/사람|정비사|상담|전화|직원/.test(q)) axTab('hand'); }
    };
    if (a.steps) steps(a.steps, fin); else { $('#ax-steps').hidden = true; fin(); }
  }
  function chipsHTML(parse, mi) {
    return '<div class="chips">' + parse.chips.map(function (c, i) {
      return '<span class="chip">' + esc(c.label) + ' <b>' + esc(c.v) + '</b><button type="button" data-rm="' + mi + ':' + i + '" aria-label="' + esc(c.label) + ' 빼기">빼기</button></span>';
    }).join('') + '</div>' + (parse.miss.length ? '<p class="miss">못 읽은 부분: ' + parse.miss.map(esc).join(' · ') + '</p>' : '');
  }
  function renderChat() {
    var msgs = chat(), ol = $('#ax-msgs');
    ol.innerHTML = msgs.map(function (m, mi) {
      if (m.me) return '<li class="msg msg-me">' + esc(m.me) + '</li>';
      var a = m.ai;
      return '<li class="msg msg-ai"><p class="who">도우미 · 규칙 기반</p><p>' + esc(a.text) + '</p>' +
        (a.lines ? '<ul>' + a.lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' : '') +
        (a.parse ? chipsHTML(a.parse, mi) : '') +
        (a.refs ? '<p class="msg-refs">' + a.refs.map(function (r) { return '<a href="' + r.href + '">근거: ' + esc(r.label) + '</a>'; }).join('') + '</p>' : '') +
        (a.act && a.act.length ? '<p class="msg-act">' + a.act.map(function (x, ai) { return '<button type="button" data-act="' + mi + ':' + ai + '"' + (m.applied && x.id === 'apply' ? ' disabled' : '') + '>' + esc(m.applied && x.id === 'apply' ? '넣음' : x.label) + '</button>'; }).join('') + '</p>' : '') +
        '</li>';
    }).join('');
    ol.scrollTop = ol.scrollHeight;
  }
  $('#ax-msgs').addEventListener('click', function (e) {
    var rm = e.target.closest('[data-rm]'), act = e.target.closest('[data-act]');
    var msgs = chat();
    if (rm) {
      var p = rm.getAttribute('data-rm').split(':');
      msgs[+p[0]].ai.parse.chips.splice(+p[1], 1);
      ss.set('gb-chat', msgs); renderChat(); say('뺐습니다');
      return;
    }
    if (act) {
      var q = act.getAttribute('data-act').split(':');
      var m = msgs[+q[0]], x = m.ai.act[+q[1]];
      doAct(x, m.ai.parse, function () { m.applied = true; ss.set('gb-chat', msgs); renderChat(); });
    }
  });

  // 읽은 칩만 차에 넣는다
  function mergeChips(base, parse) {
    var car = JSON.parse(JSON.stringify(base));
    car.last = car.last || {};
    parse.chips.forEach(function (c) {
      if (c.k === 'c' || c.k === 'f' || c.k === 'y' || c.k === 'km') car[c.k] = parse.car[c.k];
      if (c.k.indexOf('l-') === 0) { var id = c.k.slice(2); car.last[id] = parse.car.last[id]; }
    });
    return car;
  }
  function applyParse(parse, src) {
    var before = getCar();
    var base = PAGE === 'home' ? formCar(true) : carOrSample();
    var car = mergeChips(base, parse);
    putCar(car);
    addLog('car', src + ' → 칸 ' + parse.chips.length + '개 채움', parse.chips.map(function (c) { return c.label + ' ' + c.v; }).join(' · '), before, car);
    if (PAGE === 'home') homeFromCar(true);
  }
  function doAct(x, parse, done) {
    if (x.id === 'apply') { applyParse(parse, '도우미 대화'); done(); say('칸에 넣었습니다'); return; }
    if (x.id === 'hand') { axTab('hand'); handFill(true); $('#hd-sym').focus(); return; }
    if (x.id === 'est') { makeEstDraft(x.works); return; }
    if (x.id === 'book') { go(REL + 'booking/index.html?draft=1&min=' + (x.min || 60)); }
  }
  function makeEstDraft(works) {
    var car = carOrSample();
    var before = ss.get('gb-est', null);
    var st = { c: car.c, f: car.f, sel: works.filter(function (w, i) { return works.indexOf(w) === i; }).map(function (w) { return { id: w, g: 'oem' }; }), draft: true };
    ss.set('gb-est', st);
    addLog('est', '견적 초안 만듦 · 작업 ' + st.sel.length + '개', st.sel.map(function (s) { return C.byId(D.WORKS, s.id).name; }).join(' · '), before, st);
    go(REL + 'estimate/index.html?from=draft');
  }

  function renderLogs() {
    var l = logs();
    $('#ax-log-n').textContent = String(l.filter(function (x) { return !x.undone; }).length);
    $('#ax-logs').innerHTML = l.length ? l.map(function (x) {
      return '<li class="' + (x.undone ? 'is-undone' : '') + '"><time>' + x.t + '</time><p class="lg-what">' + esc(x.what) + '<span class="lg-det">' + esc(x.det || '') + '</span></p>' +
        (x.undone ? '<span class="lg-u">되돌림</span>' : (x.kind === 'hand' ? '<span></span>' : '<button type="button" data-undo="' + x.id + '">되돌리기</button>')) + '</li>';
    }).join('') : '<li><span></span><p class="lg-what">아직 기록이 없습니다.</p><span></span></li>';
  }
  $('#ax-logs').addEventListener('click', function (e) { var b = e.target.closest('[data-undo]'); if (b) undo(b.getAttribute('data-undo')); });

  // 사람에게 넘기기
  var handSel = $('#hd-day');
  handSel.innerHTML = '<option value="">상관없음</option>' + D.BOOK_DAYS.map(function (d) { return '<option>' + C.dayInfo(d).label + '</option>'; }).join('');
  function handFill(force) {
    var ta = $('#hd-sum');
    if (ta.value && !force) return;
    var car = carOrSample(), dg = C.diagnose(car), est = ss.get('gb-est', null);
    var qs = chat().filter(function (m) { return m.me; }).slice(-3).map(function (m) { return m.me; });
    var lines = ['차: ' + V.carLabel(car) + ' · ' + car.y + '년식 · ' + C.km(car.km) + (getCar() ? '' : ' (예시 차)')];
    lines.push('지금 교환: ' + (dg.over.map(function (r) { return r.short + ' ' + C.remText(r); }).join(', ') || '없음'));
    lines.push('곧 교환: ' + (dg.soon.map(function (r) { return r.short; }).join(', ') || '없음'));
    if (est && est.sel.length) { var e = C.estimate(est.c, est.sel); lines.push('견적: ' + e.lines.map(function (l) { return l.name; }).join(', ') + ' · ' + C.won(e.total)); }
    if (qs.length) lines.push('최근 질문: ' + qs.join(' / '));
    ta.value = lines.join('\n');
  }
  $('#ax-hand').addEventListener('submit', function (e) {
    e.preventDefault();
    var sum = $('#hd-sum').value.trim(), sym = $('#hd-sym').value.trim(), tel = $('#hd-tel').value.trim();
    setErr('hd-sum', sum.length < 10 ? '요약: 10자 이상 남겨 주세요.' : '');
    setErr('hd-sym', sym.length < 2 ? '증상 · 요청: 2자 이상 입력하세요.' : '');
    setErr('hd-tel', !/^01[016789]-?\d{3,4}-?\d{4}$/.test(tel) ? '휴대전화: 010-0000-0000 형식으로 입력하세요.' : '');
    var bad = $('#ax-hand [aria-invalid="true"]');
    var out = $('#hd-done');
    if (bad) { out.hidden = true; bad.focus(); return; }
    out.hidden = false;
    out.innerHTML = '<b>정비사 상담 요청서 · 전송되지 않음</b>' + esc(sum + '\n증상 · 요청: ' + sym + '\n원하는 날짜: ' + (handSel.value || '상관없음') + '\n연락처: ' + tel);
    addLog('hand', '상담 요청서 만듦', sym, null, null);
    out.focus();
  });

  renderChat(); renderLogs(); ctxLine();

  // ── 근거 줄 강조 ───────────────────────────────────────────
  function hit() {
    var id = location.hash.slice(1);
    if (!/^(sc|st|pr)-\w+$/.test(id)) return;
    $$('.is-hit').forEach(function (x) { x.classList.remove('is-hit'); });
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-hit');
    var twin = id.indexOf('sc-') === 0 ? document.getElementById('st-' + id.slice(3)) : null;
    if (twin) twin.classList.add('is-hit');
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'center', behavior: RM ? 'auto' : 'smooth' });
  }
  window.addEventListener('hashchange', hit);

  // 알림 — 이유 · 고칠 방법 · 닫기
  var dismissed = ss.get('gb-dismiss', {});
  function alerts(box, list) {
    list = list.filter(function (a) { return !dismissed[a.key]; });
    box.innerHTML = list.map(function (a, i) {
      return '<div class="alert" data-k="' + a.key + '"><span class="alert-tag' + (a.info ? ' t-info' : '') + '">' + (a.info ? '안내' : '알림') + '</span><div class="alert-body"><b>' + esc(a.title) + '</b><p>' + esc(a.why) + '</p></div><p class="alert-act">' +
        (a.fix ? '<button type="button" data-fix="' + i + '">' + esc(a.fix) + '</button>' : '') + '<button type="button" data-x="' + a.key + '">닫기</button></p></div>';
    }).join('');
    box.onclick = function (e) {
      var x = e.target.closest('[data-x]'), f = e.target.closest('[data-fix]');
      if (x) { dismissed[x.getAttribute('data-x')] = 1; ss.set('gb-dismiss', dismissed); x.closest('.alert').remove(); say('알림을 닫았습니다'); }
      if (f) list[+f.getAttribute('data-fix')].run();
    };
  }

  // ── 홈 ────────────────────────────────────────────────────
  var bandKm = 0;
  function formCar(loose) {
    var car = { c: $('#d-c').value, f: $('#d-f').value, y: toNum($('#d-y').value), km: toNum($('#d-km').value), last: {} };
    if (loose) { if (isNaN(car.y)) car.y = D.SAMPLE.y; if (isNaN(car.km)) car.km = bandKm; }
    D.ITEMS.forEach(function (it) { var v = $('#l-' + it.id).value.trim(); if (v !== '' && !isNaN(toNum(v))) car.last[it.id] = toNum(v); });
    return car;
  }
  function homeFill(car) {
    $('#d-c').value = car.c; $('#d-f').value = car.f; $('#d-y').value = car.y; $('#d-km').value = C.num(car.km);
    D.ITEMS.forEach(function (it) { $('#l-' + it.id).value = car.last && car.last[it.id] != null ? C.num(car.last[it.id]) : ''; });
    lastNa();
  }
  function lastNa() {
    var c = $('#d-c').value, f = $('#d-f').value;
    D.ITEMS.forEach(function (it) {
      var na = !C.interval(it, c, f), inp = $('#l-' + it.id);
      inp.disabled = na; inp.placeholder = na ? '해당 없음' : '모름';
      inp.closest('.lf').classList.toggle('is-na', na);
      if (na) inp.value = '';
    });
  }
  function homeRender(car, anim) {
    var dg = C.diagnose(car);
    $('#res-sum').textContent = V.summary(car, dg);
    var res = $('#res');
    res.classList.remove('anim');
    res.innerHTML = V.results(car, dg, REL);
    if (anim && !RM) { void res.offsetWidth; res.classList.add('anim'); }
    $('#band-track').innerHTML = V.bandTrack(dg);
    bandSet(car.km, false);
    homeAlerts(car, dg);
  }
  function homeAlerts(car, dg) {
    var list = [];
    dg.over.forEach(function (r) {
      list.push({ key: 'over-' + r.id + '-' + car.km, title: r.short + ' · ' + C.remText(r), why: '주기 ' + C.km(r.iv) + '를 넘었습니다. 마지막 교환 ' + C.km(r.last) + '.', fix: '견적에 담기', run: function () { makeEstDraft([r.work]); } });
    });
    var due = dg.over.concat(dg.soon).map(function (r) { return r.work; });
    if (due.indexOf('oil') > -1) D.COMBO.forEach(function (w) {
      var it = D.ITEMS.filter(function (x) { return x.work === w; })[0];
      var row = dg.rows.filter(function (x) { return x.id === it.id; })[0];
      if (!row || row.st === 'ok' && row.rem > 6000) return;
      var p = C.price(C.byId(D.WORKS, w), car.c);
      list.push({ key: 'combo-' + w, info: true, title: '엔진오일과 ' + it.short + '를 같이 하면 공임 ' + C.won(p.labor) + '이 빠집니다', why: it.short + ' ' + C.remText(row) + ' · 따로 오면 공임을 다시 받습니다.', fix: '같이 견적', run: function () { makeEstDraft(due.concat([w])); } });
    });
    if (dg.perYear > 30000) list.push({ key: 'far-' + car.y, info: true, title: '연 평균 ' + C.km(dg.perYear) + ' 운행', why: '많이 타는 차는 개월보다 km 주기에 먼저 닿습니다. 엔진오일은 주기 80 %에서 바꾸기를 권합니다.' });
    if (car.km > 0 && car.km < 1000) list.push({ key: 'new', info: true, title: '주행거리가 1,000 km 아래입니다', why: '새 차는 첫 점검 주기가 따로 있을 수 있습니다. 차량 설명서를 확인하세요.' });
    alerts($('#alerts'), list);
  }
  function homeFromCar(anim) { var car = carOrSample(); homeFill(car); homeRender(car, anim); }
  function homeValidate() {
    var ok = true;
    var y = toNum($('#d-y').value), km = toNum($('#d-km').value);
    if (isNaN(y) || y < 2006 || y > 2026) { setErr('d-y', '연식: 2006~2026 사이 숫자를 입력하세요.'); ok = false; } else setErr('d-y', '');
    if (isNaN(km) || km < 0 || km > 200000) { setErr('d-km', '주행거리: 0~200,000 사이 숫자를 입력하세요.'); ok = false; } else setErr('d-km', '');
    D.ITEMS.forEach(function (it) {
      var inp = $('#l-' + it.id), v = inp.value.trim();
      if (!v || inp.disabled) { setErr('l-' + it.id, ''); return; }
      var n = toNum(v);
      if (isNaN(n)) { setErr('l-' + it.id, '숫자만 입력하세요.'); ok = false; }
      else if (!isNaN(km) && n > km) { setErr('l-' + it.id, '지금 주행거리보다 클 수 없습니다.'); ok = false; }
      else setErr('l-' + it.id, '');
    });
    return ok;
  }
  function urlFromCar(car) {
    var l = Object.keys(car.last || {}).map(function (k) { return k + ':' + car.last[k]; }).join(',');
    history.replaceState(null, '', '?c=' + car.c + '&f=' + car.f + '&y=' + car.y + '&km=' + car.km + (l ? '&l=' + l : '') + location.hash);
  }
  function carFromUrl() {
    if (!Q.get('km')) return null;
    var car = { c: Q.get('c') || 'jun', f: Q.get('f') || 'g', y: +Q.get('y') || D.SAMPLE.y, km: Math.max(0, Math.min(200000, +Q.get('km') || 0)), last: {} };
    (Q.get('l') || '').split(',').forEach(function (p) { var kv = p.split(':'); if (kv[1] && !isNaN(+kv[1])) car.last[kv[0]] = +kv[1]; });
    return car;
  }
  // 주행거리 띠
  function bandSet(km, fromBand) {
    km = Math.max(0, Math.min(V.MAX, Math.round(km)));
    bandKm = km;
    var band = $('#band');
    $('#band-track').style.setProperty('--x', (km * V.SCALE) + 'px');
    $('#odo-n').textContent = C.num(km);
    band.setAttribute('aria-valuenow', String(km));
    if (fromBand) {
      $('#d-km').value = C.num(km); setErr('d-km', '');
      var car = formCar(true); car.km = km;
      var dg = C.diagnose(car);
      $('#res-sum').textContent = V.summary(car, dg);
      $('#res').classList.remove('anim');
      $('#res').innerHTML = V.results(car, dg, REL);
      $('#band-track').innerHTML = V.bandTrack(dg);
      homeAlerts(car, dg);
      var first = dg.over[0] || dg.soon[0];
      band.setAttribute('aria-valuetext', C.km(km) + (first ? ' · ' + first.short + ' ' + C.remText(first) : '') + ' · 지금 교환 ' + dg.over.length);
    } else band.setAttribute('aria-valuetext', C.km(km));
  }
  var bandCommit = function () { var car = formCar(true); car.km = bandKm; if (homeValidate()) { putCar(car); urlFromCar(car); } };
  function homeInit() {
    var car = carFromUrl() || getCar() || JSON.parse(JSON.stringify(D.SAMPLE));
    homeFill(car); homeRender(car, false);
    if (carFromUrl()) putCar(car);
    // 판정 막대 — 결과가 처음 화면에 들어올 때 한 번
    if ('IntersectionObserver' in window && !RM) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { var r = $('#res'); r.classList.remove('anim'); void r.offsetWidth; r.classList.add('anim'); io.disconnect(); } }, { threshold: 0.15 });
      io.observe($('#res'));
    }
    $('#d-c').addEventListener('change', lastNa);
    $('#d-f').addEventListener('change', lastNa);
    $('#diag').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!homeValidate()) { var b = $('#diag [aria-invalid="true"]'); if (b) b.focus(); return; }
      var c = formCar(false);
      putCar(c); urlFromCar(c); homeRender(c, true);
      say(V.summary(c, C.diagnose(c)));
    });
    $('#res').addEventListener('click', function (e) {
      var dg = C.diagnose(formCar(true));
      var due = dg.over.concat(dg.soon);
      if (e.target.closest('#mk-est')) { putCar(formCar(true)); makeEstDraft(due.map(function (r) { return r.work; })); }
      if (e.target.closest('#mk-book')) { putCar(formCar(true)); var est = C.estimate(formCar(true).c, due.map(function (r) { return { id: r.work, g: 'oem' }; })); go(REL + 'booking/index.html?draft=1&min=' + est.book); }
    });
    // 말로 넣기
    var lastParse = null;
    function sayRender() {
      var out = $('#say-out');
      if (!lastParse) { out.innerHTML = ''; return; }
      out.innerHTML = '<p><span class="draft-tag">도우미</span>읽은 값 ' + lastParse.chips.length + '개 · 필요 없는 값은 빼고 넣으세요.</p>' +
        chipsHTML(lastParse, 'say') + (lastParse.chips.length ? '<p class="go"><button type="button" class="btn btn-ink" id="say-apply">칸에 넣기</button></p>' : '');
    }
    $('#say-go').addEventListener('click', function () {
      var t = $('#say-q').value.trim();
      if (!t) { $('#say-out').innerHTML = '<p class="miss">문장을 입력하세요.</p>'; return; }
      lastParse = A.parseCar(t, formCar(true));
      sayRender();
    });
    $('#say-q').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); $('#say-go').click(); } });
    $('#say-out').addEventListener('click', function (e) {
      var rm = e.target.closest('[data-rm]');
      if (rm) { lastParse.chips.splice(+rm.getAttribute('data-rm').split(':')[1], 1); sayRender(); say('뺐습니다'); var nb = $('#say-out [data-rm]') || $('#say-apply'); if (nb) nb.focus(); return; }
      if (e.target.closest('#say-apply')) {
        applyParse(lastParse, '문장 "' + $('#say-q').value.trim() + '"');
        var c = carOrSample(); urlFromCar(c);
        $('#say-out').innerHTML = '<p><span class="draft-tag">도우미</span>칸에 넣고 다시 계산했습니다. 작업 기록에서 되돌릴 수 있습니다.</p>';
        lastParse = null;
        say('칸에 넣었습니다');
      }
    });
    // 띠 끌기 · 키
    var band = $('#band'), drag = null;
    band.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, km: bandKm }; band.setPointerCapture(e.pointerId); band.classList.add('drag'); });
    band.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var km = Math.round((drag.km - (e.clientX - drag.x) / V.SCALE) / 1000) * 1000;
      if (km !== bandKm) bandSet(km, true);
    });
    var end = function () { if (!drag) return; drag = null; band.classList.remove('drag'); bandCommit(); };
    band.addEventListener('pointerup', end); band.addEventListener('pointercancel', end);
    band.addEventListener('keydown', function (e) {
      var k = e.key, d = k === 'ArrowRight' || k === 'ArrowUp' ? 1000 : k === 'ArrowLeft' || k === 'ArrowDown' ? -1000 : k === 'PageUp' ? 10000 : k === 'PageDown' ? -10000 : null;
      if (e.shiftKey && d) d *= 10;
      var to = d != null ? Math.round((bandKm + d) / 1000) * 1000 : k === 'Home' ? 0 : k === 'End' ? V.MAX : null;
      if (to == null) return;
      e.preventDefault(); bandSet(to, true); bandCommit();
    });
  }

  // ── 교환 주기 ──────────────────────────────────────────────
  function scheduleInit() {
    var c = C.cls(Q.get('c') || 'jun').id, f = C.fuel(Q.get('f') || 'g').id;
    function draw() {
      $('#sc').innerHTML = V.schedule(c, f);
      $('#sct').innerHTML = V.scheduleTable(c, f);
      $('#sc-h').textContent = C.cls(c).name + ' ' + C.fuel(f).name;
      $('#panel-cls').setAttribute('aria-labelledby', 'tab-cls-' + c);
      history.replaceState(null, '', '?c=' + c + '&f=' + f + location.hash);
    }
    var t = tabs($('[data-tabs="cls"]'), function (v) { c = v; draw(); });
    $$('#fuel-seg input').forEach(function (r) { r.checked = r.value === f; r.addEventListener('change', function () { f = r.value; draw(); }); });
    t.sel(c);
  }
  // ── 공임 · 부품값 ──────────────────────────────────────────
  function priceInit() {
    var c = C.cls(Q.get('c') || 'jun').id;
    var t = tabs($('[data-tabs="pcls"]'), function (v) {
      c = v; $('#pr').innerHTML = V.priceTable(c); $('#pr-h').textContent = C.cls(c).name + ' 작업값';
      $('#panel-pcls').setAttribute('aria-labelledby', 'tab-pcls-' + c);
      history.replaceState(null, '', '?c=' + c + location.hash);
    });
    t.sel(c);
  }

  // ── 견적 ──────────────────────────────────────────────────
  var DEF_EST = { c: 'jun', f: 'g', sel: [{ id: 'oil', g: 'oem' }, { id: 'acf', g: 'alt' }], draft: false };
  var est = null;
  function estRead() {
    var sel = [];
    $$('.wk').forEach(function (li) {
      var cb = $('input[type="checkbox"]', li);
      if (!cb.checked || cb.disabled) return;
      var g = $('input[type="radio"]:checked', li);
      sel.push({ id: li.getAttribute('data-w'), g: g ? g.value : null });
    });
    return { c: $('#e-c').value, f: $('#e-f').value, sel: sel, draft: est ? est.draft : false, confirmed: est ? est.confirmed : null };
  }
  function estFromState(st) {
    est = JSON.parse(JSON.stringify(st));
    $('#e-c').value = est.c; $('#e-f').value = est.f;
    $$('.wk').forEach(function (li) {
      var id = li.getAttribute('data-w'), s = est.sel.filter(function (x) { return x.id === id; })[0];
      $('input[type="checkbox"]', li).checked = !!s;
      if (s && s.g) { var r = $('input[value="' + s.g + '"]', li); if (r) r.checked = true; }
    });
    estUpdate(false);
  }
  function estUpdate(save) {
    var st = estRead();
    est = st;
    // 차급 · 연료에 따라 값 · 해당 없음 갱신
    $$('.wk').forEach(function (li) {
      var w = C.byId(D.WORKS, li.getAttribute('data-w')), p = C.price(w, st.c);
      var na = (w.fuel && w.fuel !== st.f) || w.nofuel === st.f;
      li.classList.toggle('is-na', na);
      $$('input', li).forEach(function (x) { x.disabled = na; });
      var lb = $('[data-k="labor"]', li); if (lb) lb.textContent = p.labor ? C.won(p.labor) : '없음';
      ['oem', 'alt', 're'].forEach(function (g) { var b = $('[data-k="' + g + '"]', li); if (b) b.textContent = C.won(p[g]); });
      var meta = $('.wk-meta', li), em = $('em', meta);
      if (na && !em) meta.insertAdjacentHTML('beforeend', ' · <em>이 연료에 해당 없음</em>');
      if (!na && em) meta.innerHTML = meta.innerHTML.replace(/ · <em>.*<\/em>/, '');
    });
    st = estRead(); est = st;
    var e = C.estimate(st.c, st.sel);
    $('#est-out').innerHTML = V.estimateSum(e);
    var ws = st.sel.map(function (s) { return s.id; });
    $('#est-book').href = REL + 'booking/index.html?min=' + Math.max(30, e.book) + '&w=' + ws.join(',') + '&c=' + st.c;
    if (save) ss.set('gb-est', st);
    history.replaceState(null, '', '?c=' + st.c + '&f=' + st.f + '&w=' + st.sel.map(function (s) { return s.id + (s.g ? ':' + s.g : ''); }).join(','));
    estPlans(st);
    estAlerts(st, e);
    estDraft(st);
  }
  function estDraft(st) {
    var box = $('#draft');
    if (st.draft) {
      box.hidden = false; box.classList.remove('is-ok');
      box.innerHTML = '<span class="draft-tag">초안</span><span>도우미가 진단 결과로 채운 견적입니다. 작업 · 등급을 고친 뒤 확정하세요.</span><button type="button" class="btn btn-ink" id="draft-ok">견적 확정</button>';
    } else if (st.confirmed) {
      box.hidden = false; box.classList.add('is-ok');
      box.innerHTML = '<span class="draft-tag">확정</span><span>확정한 견적입니다. 작업을 바꾸면 다시 계산합니다.</span>';
    } else box.hidden = true;
  }
  function estPlans(st) {
    var ids = st.sel.map(function (s) { return s.id; });
    var ol = $('#plans');
    if (!ids.length) { ol.innerHTML = '<li><p class="none">작업을 고르면 세 가지 안이 나옵니다.</p></li>'; return; }
    var ps = C.plans(st.c, st.f, ids), base = ps[0].e.total;
    var cur = function (p) { return p.sel.every(function (s, i) { return !s.g || st.sel[i].g === s.g; }); };
    var why = {
      oem: '보증이 가장 깁니다. 브레이크 · 보증 수리 기간 안의 차에 권합니다.',
      alt: '정품보다 ' + C.won(base - ps[1].e.total) + ' 적습니다. 패드 · 필터는 교환 주기가 조금 짧습니다.',
      re: '재생 부품이 있는 배터리 · 발전기만 재생, 나머지는 호환입니다. 정품보다 ' + C.won(base - ps[2].e.total) + ' 적습니다.',
    };
    ol.innerHTML = ps.map(function (p, i) {
      return '<li class="' + (cur(p) ? 'is-cur' : '') + '"><p class="pl-name">' + p.name + '</p><p class="pl-total">' + C.won(p.e.total) + '</p>' +
        '<dl><div><dt>가장 짧은 부품 보증</dt><dd>' + (p.warr ? p.warr + '개월' : '없음') + '</dd></div><div><dt>다음 교환이 가장 이른 품목</dt><dd>' + (p.life ? p.lifeName + ' · ' + C.km(p.life) + ' 뒤' : '없음') + '</dd></div><div><dt>작업 시간</dt><dd>' + p.e.min + '분</dd></div></dl>' +
        '<p class="pl-why">' + why[p.id] + '</p><button type="button" class="btn btn-yel" data-plan="' + i + '"' + (cur(p) ? ' aria-pressed="true"' : ' aria-pressed="false"') + '>이 안으로</button></li>';
    }).join('');
    ol.onclick = function (e) {
      var b = e.target.closest('[data-plan]'); if (!b) return;
      var p = ps[+b.getAttribute('data-plan')], before = JSON.parse(JSON.stringify(est));
      p.sel.forEach(function (s) { if (!s.g) return; var r = $('.wk[data-w="' + s.id + '"] input[value="' + s.g + '"]'); if (r) r.checked = true; });
      estUpdate(true);
      addLog('est', p.name + ' 적용 · ' + C.won(p.e.total), p.sel.map(function (s) { return C.byId(D.WORKS, s.id).name + (s.g ? ' ' + V.GN[s.g] : ''); }).join(' · '), before, est);
      say(p.name + '으로 바꿨습니다. 합계 ' + C.won(p.e.total));
    };
  }
  function estAlerts(st, e) {
    var list = [], car = getCar();
    if (car) {
      var dg = C.diagnose(car), ids = st.sel.map(function (s) { return s.id; });
      dg.over.forEach(function (r) {
        if (ids.indexOf(r.work) > -1) return;
        list.push({ key: 'est-miss-' + r.id, title: '견적에 없는 지남 품목: ' + r.short, why: '내 차 ' + C.km(car.km) + ' 기준 ' + C.remText(r) + '.', fix: '견적에 담기', run: function () { var cb = $('.wk[data-w="' + r.work + '"] input[type="checkbox"]'); cb.checked = true; estUpdate(true); addLog('est', r.short + ' 담음 (알림)', '지남 품목', null, est); } });
      });
    }
    if (e.saved) list.push({ key: 'est-combo-' + e.saved, info: true, title: '엔진오일과 같이 해서 공임 ' + C.won(e.saved) + '이 빠졌습니다', why: '에어컨 필터 · 에어클리너는 엔진오일 교환과 같이 하면 공임을 받지 않습니다.' });
    var ids2 = st.sel.map(function (s) { return s.id; });
    if (ids2.indexOf('tire') > -1 && ids2.indexOf('align') < 0) list.push({ key: 'est-align', title: '타이어를 바꾸면 휠 얼라인먼트를 같이 권합니다', why: '새 타이어가 한쪽만 닳는 것을 막습니다. 공임 ' + C.won(C.price(C.byId(D.WORKS, 'align'), st.c).labor) + ' · 40분.', fix: '얼라인먼트 담기', run: function () { $('.wk[data-w="align"] input[type="checkbox"]').checked = true; estUpdate(true); } });
    if (e.min > 120) list.push({ key: 'est-long', info: true, title: '작업 시간 ' + e.min + '분 · 예약은 120분까지', why: '120분 넘는 작업은 차를 맡기는 것으로 접수합니다. 대차 2대가 있습니다.' });
    alerts($('#est-alerts'), list);
  }
  function estimateInit() {
    var st = null;
    if (Q.get('from') === 'draft') st = ss.get('gb-est', null);
    if (!st && Q.get('w')) st = { c: C.cls(Q.get('c')).id, f: C.fuel(Q.get('f')).id, sel: Q.get('w').split(',').map(function (p) { var kv = p.split(':'); return { id: kv[0], g: kv[1] || 'oem' }; }), draft: false };
    if (!st) st = ss.get('gb-est', null) || DEF_EST;
    var car = getCar();
    if (!Q.get('w') && !ss.get('gb-est', null) && car) { st = JSON.parse(JSON.stringify(st)); st.c = car.c; st.f = car.f; }
    estFromState(st);
    $('#est').addEventListener('change', function () { estUpdate(true); });
    $('#est-clear').addEventListener('click', function () { $$('.wk input[type="checkbox"]').forEach(function (x) { x.checked = false; }); estUpdate(true); say('모두 해제했습니다'); });
    $('#draft').addEventListener('click', function (e) {
      if (!e.target.closest('#draft-ok')) return;
      est.draft = false; est.confirmed = clock(); ss.set('gb-est', est); estDraft(est);
      addLog('est', '견적 확정 · ' + C.won(C.estimate(est.c, est.sel).total), est.sel.length + '개 작업', null, est);
      $('#draft').focus && $('#draft').setAttribute('tabindex', '-1'); $('#draft').focus();
      say('견적을 확정했습니다');
    });
  }

  // ── 예약 ──────────────────────────────────────────────────
  var bk = { iso: D.BOOK_DAYS[1], dur: 60, sel: null };
  function mine() { var m = ss.get('gb-book', {}); var o = {}; Object.keys(m).forEach(function (k) { o[k] = 1; }); return o; }
  function mineCover() {
    // 내 예약이 차지한 칸 전부
    var m = ss.get('gb-book', {}), o = {};
    Object.keys(m).forEach(function (k) { var p = k.split('|'); for (var i = 0; i < m[k].dur / 30; i++) o[p[0] + '|' + p[1] + '|' + (+p[2] + 30 * i)] = 1; });
    return o;
  }
  function bkDraw() {
    $('#panel-day').innerHTML = V.grid(bk.iso, bk.dur, mineCover(), bk.sel && bk.sel.iso === bk.iso ? bk.sel : null);
    $('#panel-day').setAttribute('aria-labelledby', 'tab-day-' + bk.iso);
    var s = bk.sel;
    $('#bk-sel').textContent = s ? '고른 칸: ' + C.dayInfo(s.iso).label + ' · 리프트 ' + s.lift + ' · ' + C.hm(s.t) + '~' + C.hm(s.t + bk.dur) : '고른 칸 없음';
    bkAlerts();
  }
  function bkAlerts() {
    var list = [], e = ss.get('gb-est', null);
    if (e && e.sel.length) {
      var em = C.estimate(e.c, e.sel);
      if (em.min > bk.dur) list.push({ key: 'bk-short-' + bk.dur + '-' + em.min, title: '견적 작업 시간 ' + em.min + '분 · 고른 칸 ' + bk.dur + '분', why: '견적에 담은 작업이 고른 시간보다 깁니다.', fix: Math.min(120, em.book) + '분으로', run: function () { $('#b-min').value = String(Math.min(120, em.book)); $('#b-min').dispatchEvent(new Event('change')); } });
    }
    var di = C.dayInfo(bk.iso);
    if (bk.iso === C.todayIso) list.push({ key: 'bk-today', info: true, title: '오늘 남은 빈칸 ' + C.openCount(bk.iso, mineCover()) + '칸', why: '지금 ' + C.hm(C.nowMin) + ' 기준, 20분 안에 시작하는 칸은 마감했습니다.', fix: '내일 보기', run: function () { dayTabs.sel(D.BOOK_DAYS[1]); } });
    if (di.sat) list.push({ key: 'bk-sat', info: true, title: '토요일은 13:30 접수 마감', why: '14:00에 문을 닫습니다. 90분 넘는 작업은 평일을 고르세요.' });
    alerts($('#bk-alerts'), list);
  }
  var dayTabs;
  function earliest(dur) {
    var mc = mineCover();
    for (var d = 0; d < D.BOOK_DAYS.length; d++) {
      var iso = D.BOOK_DAYS[d], ts = C.slotTimes(iso);
      for (var i = 0; i < ts.length; i++) for (var l = 1; l <= D.LIFTS.length; l++) if (C.fits(iso, l, ts[i], dur, mc)) return { iso: iso, lift: l, t: ts[i] };
    }
    return null;
  }
  function bookUndo(before) {
    if (!before) return;
    $('#b-w').value = before.w || ''; $('#b-c').value = before.c || 'jun';
    bk.sel = null; bkDraw();
    $('#draft').hidden = true;
  }
  function bookingInit() {
    var m = +Q.get('min');
    if (D.DURATIONS.indexOf(m) > -1) bk.dur = m;
    $('#b-min').value = String(bk.dur);
    var car = getCar();
    if (car) $('#b-c').value = car.c;
    if (Q.get('c')) $('#b-c').value = C.cls(Q.get('c')).id;
    if (Q.get('w')) $('#b-w').value = Q.get('w').split(',').map(function (id) { var w = C.byId(D.WORKS, id.split(':')[0]); return w ? w.name.replace(/ \(.*\)$/, '') : ''; }).filter(Boolean).join(' · ').slice(0, 60);
    dayTabs = tabs($('[data-tabs="day"]'), function (v) { bk.iso = v; bkDraw(); });
    if (Q.get('draft')) {
      var before = { w: $('#b-w').value, c: $('#b-c').value };
      var e = ss.get('gb-est', null), names;
      if (e && e.sel.length) names = e.sel.map(function (s) { return C.byId(D.WORKS, s.id).name.replace(/ \(.*\)$/, ''); });
      else { var dg = C.diagnose(carOrSample()); names = dg.over.concat(dg.soon).map(function (r) { return C.byId(D.WORKS, r.work).name.replace(/ \(.*\)$/, ''); }); }
      $('#b-w').value = names.join(' · ').slice(0, 60);
      var first = earliest(bk.dur);
      if (first) { bk.sel = first; bk.iso = first.iso; }
      var dbox = $('#draft');
      dbox.hidden = false;
      dbox.innerHTML = '<span class="draft-tag">초안</span><span>도우미가 가장 이른 빈칸' + (first ? '(' + C.dayInfo(first.iso).label + ' · 리프트 ' + first.lift + ' · ' + C.hm(first.t) + ')' : '') + '과 작업 내용을 채웠습니다. 이름 · 연락처를 넣고 확인 후 접수하세요.</span>';
      addLog('book', '예약 초안 만듦 · ' + bk.dur + '분', $('#b-w').value, before, null);
    }
    dayTabs.sel(bk.iso);
    $('#b-min').addEventListener('change', function () {
      bk.dur = +$('#b-min').value;
      if (bk.sel && !C.fits(bk.sel.iso, bk.sel.lift, bk.sel.t, bk.dur, mineCover())) { bk.sel = null; say(bk.dur + '분이 이어서 비어 있지 않아 고른 칸을 풀었습니다'); }
      bkDraw();
    });
    $('#panel-day').addEventListener('click', function (e) {
      var b = e.target.closest('.slot'); if (!b || b.disabled) return;
      bk.sel = { iso: bk.iso, lift: +b.getAttribute('data-lift'), t: +b.getAttribute('data-t') };
      bkDraw();
      var nb = $('.slot[aria-pressed="true"]'); if (nb) nb.focus();
      setErr('b-slot', '');
    });
    $('#bk').addEventListener('submit', function (e) {
      e.preventDefault();
      var errs = [];
      var chk = function (id, bad, msg) { setErr(id, bad ? msg : ''); if (bad) errs.push([id, msg]); };
      var w = $('#b-w').value.trim(), nm = $('#b-name').value.trim(), tel = $('#b-tel').value.trim(), pl = $('#b-plate').value.trim();
      if (!bk.sel) errs.push(['panel-day', '시간표: 비어 있는 칸을 고르세요.']);
      chk('b-w', w.length < 2 || w.length > 60, '작업 내용: 2~60자로 입력하세요.');
      chk('b-name', nm.length < 2 || nm.length > 20, '이름: 2~20자로 입력하세요.');
      chk('b-tel', !/^01[016789]-?\d{3,4}-?\d{4}$/.test(tel), '휴대전화: 010-0000-0000 형식으로 입력하세요.');
      chk('b-plate', !/^\d{4}$/.test(pl), '차량 번호 뒷자리: 숫자 4개를 입력하세요.');
      chk('b-agree', !$('#b-agree').checked, '안내 확인: 확인란을 고르세요.');
      var sum = $('#bk-errs'), done = $('#bk-done');
      if (errs.length) {
        done.hidden = true;
        sum.hidden = false;
        sum.innerHTML = '<p>입력을 확인하세요 · ' + errs.length + '건</p><ul>' + errs.map(function (x) { return '<li><a href="#' + x[0] + '">' + esc(x[1]) + '</a></li>'; }).join('') + '</ul>';
        sum.focus();
        return;
      }
      sum.hidden = true;
      var s = bk.sel, no = C.bookingNo(s.iso, s.lift, s.t);
      var store = ss.get('gb-book', {}); store[s.iso + '|' + s.lift + '|' + s.t] = { no: no, dur: bk.dur }; ss.set('gb-book', store);
      done.hidden = false;
      done.innerHTML = '<p>예약 번호</p><p class="done-no">' + no + '</p><p>' + C.dayInfo(s.iso).label + ' · 리프트 ' + s.lift + ' · ' + C.hm(s.t) + '~' + C.hm(s.t + bk.dur) + ' · ' + esc(w) + '</p><p class="fine">연습용 예약입니다. 실제로 접수되지 않고, 이 탭을 닫으면 사라집니다.</p>';
      var dbox = $('#draft'); if (!dbox.hidden) { dbox.classList.add('is-ok'); dbox.innerHTML = '<span class="draft-tag">확정</span><span>초안을 확인하고 접수했습니다 · ' + no + '</span>'; }
      bk.sel = null; bkDraw();
      done.focus();
    });
    $('#bk-errs').addEventListener('click', function (e) { var a = e.target.closest('a'); if (!a) return; e.preventDefault(); var t = document.getElementById(a.getAttribute('href').slice(1)); if (t.id === 'panel-day') t = $('.slot:not([disabled])', t) || t; t.focus(); });
  }

  // ── 정비 이력 · 붙여넣기 ───────────────────────────────────
  function carFromRows(base, rows) {
    var car = JSON.parse(JSON.stringify(base));
    car.last = car.last || {};
    rows.forEach(function (r) {
      r.items.forEach(function (id) { if (car.last[id] == null || r.km > car.last[id]) car.last[id] = r.km; });
      if (r.km > car.km) car.km = r.km;
    });
    return car;
  }
  function historyInit() {
    function run(p, t, focus) {
      setErr('h-p', /^\d{4}$/.test(p) ? '' : '차량 번호 뒷자리: 숫자 4개를 입력하세요.');
      setErr('h-t', /^\d{4}$/.test(t) ? '' : '휴대전화 뒷자리: 숫자 4개를 입력하세요.');
      var bad = $('#hi [aria-invalid="true"]');
      if (bad) { bad.focus(); return; }
      var h = C.history(p, t), out = $('#hi-out');
      if (!h) out.innerHTML = '<p class="none">' + p + ' · ' + t + ': 일치하는 이력이 없습니다. 번호를 확인하거나 예시 차량으로 조회하세요.</p>';
      else {
        out.innerHTML = V.historyTable(h) + '<p class="go"><button type="button" class="btn btn-yel" id="hi-car">이 이력으로 진단</button></p>';
        $('#hi-car').onclick = function () {
          var rows = h.rows.map(function (r) { return { items: A.findItems(r[2]), km: r[1] }; });
          var base = { c: h.c, f: h.f, y: h.y, km: h.rows[0][1], last: {} };
          var before = getCar(), car = carFromRows(base, rows);
          putCar(car);
          addLog('car', '정비 이력 ' + p + '으로 내 차 채움', V.carLabel(car) + ' ' + C.km(car.km), before, car);
          go(REL + 'index.html');
        };
      }
      history.replaceState(null, '', '?p=' + p + '&t=' + t);
      if (focus) out.focus();
    }
    $('#hi').addEventListener('submit', function (e) { e.preventDefault(); run($('#h-p').value.trim(), $('#h-t').value.trim(), true); });
    if (Q.get('p')) { $('#h-p').value = Q.get('p'); $('#h-t').value = Q.get('t') || ''; run(Q.get('p'), Q.get('t') || '', false); }
    // 붙여넣기
    var parsed = null;
    var opts = function (sel) { return D.ITEMS.map(function (it) { return '<option value="' + it.id + '"' + (it.id === sel ? ' selected' : '') + '>' + esc(it.short) + '</option>'; }).join(''); };
    function draw() {
      var out = $('#ps-out');
      if (!parsed.rows.length && !parsed.bad.length) { out.innerHTML = '<p class="miss">붙여넣은 글이 없습니다.</p>'; return; }
      out.innerHTML = '<p><span class="draft-tag">도우미</span>읽은 줄 ' + parsed.rows.length + ' · 못 읽은 줄 ' + parsed.bad.length + ' · 표에서 고칠 수 있습니다.</p>' +
        (parsed.rows.length ? '<table class="tbl ps-tbl"><caption>읽은 줄</caption><thead><tr><th scope="col">날짜</th><th scope="col">품목</th><th scope="col">주행거리 (km)</th><th scope="col">금액 (원)</th></tr></thead><tbody>' +
          parsed.rows.map(function (r, i) {
            return '<tr><td data-l="날짜"><input type="text" aria-label="' + (i + 1) + '번째 줄 날짜" data-i="' + i + '" data-k="date" value="' + r.date + '"></td><td data-l="품목"><select aria-label="' + (i + 1) + '번째 줄 품목" data-i="' + i + '" data-k="item">' + opts(r.items[0]) + '</select></td><td data-l="주행거리"><input type="text" inputmode="numeric" aria-label="' + (i + 1) + '번째 줄 주행거리" data-i="' + i + '" data-k="km" value="' + C.num(r.km) + '"></td><td data-l="금액"><input type="text" inputmode="numeric" aria-label="' + (i + 1) + '번째 줄 금액" data-i="' + i + '" data-k="won" value="' + (r.won != null ? C.num(r.won) : '') + '"></td></tr>';
          }).join('') + '</tbody></table>' : '') +
        (parsed.bad.length ? '<ul class="ps-bad" aria-label="못 읽은 줄">' + parsed.bad.map(function (b) { return '<li><b>못 읽음 · ' + esc(b.why) + '</b> — ' + esc(b.line) + '</li>'; }).join('') + '</ul>' : '') +
        (parsed.rows.length ? '<p class="go"><button type="button" class="btn btn-ink" id="ps-apply">마지막 교환 칸에 넣기</button></p>' : '');
    }
    $('#ps-ex').addEventListener('click', function () {
      $('#ps-q').value = '2025.03.14 엔진오일 교환 69,800km 77,000원\n2025-03-14 에어컨 필터 69,800km 12,000원\n2024.12.09 브레이크 패드 앞 교환 50,800 km 101,000원\n와이퍼 교환 18,000원\n2023.09.14 타이어 4개 41,000km';
      $('#ps-q').focus();
    });
    $('#ps-go').addEventListener('click', function () { parsed = A.parseReceipt($('#ps-q').value); draw(); });
    $('#ps-out').addEventListener('change', function (e) {
      var t = e.target, i = +t.getAttribute('data-i'), k = t.getAttribute('data-k'); if (!k) return;
      var r = parsed.rows[i];
      if (k === 'item') r.items = [t.value];
      if (k === 'km') { var n = toNum(t.value); if (!isNaN(n)) r.km = n; }
      if (k === 'won') { var w = toNum(t.value); r.won = isNaN(w) ? null : w; }
      if (k === 'date') r.date = t.value;
    });
    $('#ps-out').addEventListener('click', function (e) {
      if (!e.target.closest('#ps-apply')) return;
      var before = getCar(), car = carFromRows(carOrSample(), parsed.rows);
      putCar(car);
      addLog('car', '영수증 ' + parsed.rows.length + '줄 → 마지막 교환 칸', parsed.rows.map(function (r) { return C.byId(D.ITEMS, r.items[0]).short + ' ' + C.km(r.km); }).join(' · '), before, car);
      $('#ps-out').insertAdjacentHTML('beforeend', '<p class="go"><a class="btn btn-yel" href="' + REL + 'index.html">넣은 값으로 진단 보기</a></p>');
      e.target.closest('#ps-apply').disabled = true;
      say('마지막 교환 칸에 넣었습니다');
    });
  }

  // ── 자주 묻는 것 ──────────────────────────────────────────
  function faqInit() {
    $$('.faq-q button').forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') !== 'true';
        b.setAttribute('aria-expanded', String(open));
        document.getElementById(b.getAttribute('aria-controls')).hidden = !open;
      });
    });
  }

  var INIT = { home: homeInit, schedule: scheduleInit, price: priceInit, estimate: estimateInit, booking: bookingInit, history: historyInit, faq: faqInit };
  if (INIT[PAGE]) INIT[PAGE]();
  hit();
})();
