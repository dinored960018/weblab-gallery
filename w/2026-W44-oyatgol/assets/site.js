// 오얏골동물병원 — 화면 동작 · 접수 도우미 판
(function () {
  'use strict';
  var D = window.OY, C = window.OYC, A = window.OYA;
  var REL = document.body.getAttribute('data-rel') || '';
  var PAGE = (document.body.className.match(/p-(\w+)/) || [])[1];
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = C.esc;
  var SPN = { dog: '개', cat: '고양이' };
  var ss = {
    get: function (k, d) { try { var v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 불가 — 화면만 */ } },
  };
  var clone = function (x) { return x == null ? x : JSON.parse(JSON.stringify(x)); };
  var Q = new URLSearchParams(location.search);
  var num = function (v) { v = String(v == null ? '' : v).replace(/\s|kg|살/gi, ''); return /^\d+(\.\d+)?$/.test(v) ? +v : NaN; };
  function setErr(id, msg) {
    var el = document.getElementById(id), er = document.getElementById(id + '-err');
    if (el) { if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
    if (er) { er.textContent = msg || ''; er.hidden = !msg; }
  }
  var HOOK = {}; // 저장 키가 되돌려졌을 때 화면을 다시 그리는 함수

  // ── 메뉴 ───────────────────────────────────────────────────
  var menuBtn = $('.menu-btn'), nav = $('#nav');
  function menu(open, back) {
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    document.body.classList.toggle('lock', open);
    if (open) { var a = $('a', nav); if (a) a.focus(); } else if (back) menuBtn.focus();
  }
  menuBtn.addEventListener('click', function () { menu(menuBtn.getAttribute('aria-expanded') !== 'true', true); });

  // ── 탭 ─────────────────────────────────────────────────────
  function tabs(root, onSel) {
    var ts = $$('[role="tab"]', root);
    function sel(t, focus, silent) {
      ts.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
      var pid = t.getAttribute('aria-controls'), pn = pid && document.getElementById(pid);
      if (pn && pn.getAttribute('role') === 'tabpanel') pn.setAttribute('aria-labelledby', t.id);
      if (focus) t.focus();
      if (!silent) onSel(t.getAttribute('data-v'), t);
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
    return { sel: function (v, silent) { var t = ts.filter(function (x) { return x.getAttribute('data-v') === v; })[0]; if (t) sel(t, false, silent); } };
  }

  // ── 번호 목록 옆 사진 (모션 1) ──────────────────────────────
  $$('[data-ix]').forEach(function (ix) {
    var fig = $('.ix-ph', ix), img = fig && $('img', fig), cur = null;
    if (!img) return;
    function show(row) {
      if (row === cur) return; cur = row;
      $$('.ix-row', ix).forEach(function (r) { r.classList.toggle('on', r === row); });
      var src = row.getAttribute('data-photo');
      if (img.getAttribute('src') === src) return;
      fig.classList.remove('go');
      img.src = src;
      void fig.offsetWidth;
      fig.classList.add('go');
    }
    $$('.ix-row', ix).forEach(function (r) {
      r.addEventListener('mouseenter', function () { show(r); });
      r.addEventListener('focusin', function () { show(r); });
    });
  });
  // 진료 과목 — 줄을 고르면 펼침
  function openRow(btn, open) {
    var body = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(open));
    if (body) body.hidden = !open;
  }
  $$('.ix-row > button.ix-a').forEach(function (b) {
    b.addEventListener('click', function () { openRow(b, b.getAttribute('aria-expanded') !== 'true'); });
  });
  // 자주 묻는 것
  $$('.faq-q button').forEach(function (b) {
    b.addEventListener('click', function () { openRow(b, b.getAttribute('aria-expanded') !== 'true'); });
  });

  // ── 근거 링크 → 그 줄 강조 ─────────────────────────────────
  function highlight() {
    var id = decodeURIComponent(location.hash.slice(1)); if (!id) return;
    if (/^pr-/.test(id) && !/^pr-(dog|cat)-/.test(id)) id = 'pr-' + (PAGE === 'prices' && psp ? psp : 'dog') + '-' + id.slice(3);
    var el = document.getElementById(id); if (!el) return;
    if (PAGE === 'prices' && el.closest('[data-sp]')) { var sp = el.closest('[data-sp]').getAttribute('data-sp'); if (pTabs) pTabs.sel(sp); }
    var btn = el.querySelector && el.querySelector(':scope > button.ix-a');
    if (btn) openRow(btn, true);
    $$('.hl').forEach(function (x) { x.classList.remove('hl'); });
    // 진료비 · 접종표는 같은 id 가 종마다 따로 있다 — 보이는 표의 줄
    el.classList.add('hl');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'center', behavior: RM ? 'auto' : 'smooth' });
  }
  window.addEventListener('hashchange', highlight);

  // ── 반려동물 정보 · 작업 기록 ───────────────────────────────
  function getPet() { return ss.get('oy-pet', {}); }
  function petLine(p) {
    p = p || getPet();
    var a = [];
    if (p.sp) a.push(SPN[p.sp]);
    if (p.age != null && p.age !== '') a.push(p.age + '살');
    if (p.kg) a.push(p.kg + ' kg');
    return a.join(' · ');
  }
  function showPet() { var el = $('#ax-pet'); if (el) el.textContent = '우리 아이: ' + (petLine() || '아직 없음'); }
  HOOK['oy-pet'] = showPet;
  function getLog() { return ss.get('oy-log', []); }
  // keys: [{key, before}] — 바꾸기 전 값
  function log(what, keys) {
    var L = getLog();
    L.push({ n: L.length + 1, what: what, keys: keys.map(function (k) { return { key: k.key, before: clone(k.before) }; }), undone: false });
    ss.set('oy-log', L);
    renderLog();
  }
  function undo(n) {
    var L = getLog(), e = L.filter(function (x) { return x.n === n; })[0];
    if (!e || e.undone) return;
    e.keys.forEach(function (k) { ss.set(k.key, k.before == null ? null : k.before); if (HOOK[k.key]) HOOK[k.key](); });
    e.undone = true; ss.set('oy-log', L); renderLog();
  }
  function renderLog() {
    var ul = $('#ax-loglist'); if (!ul) return;
    var L = getLog();
    $('#ax-log-n').textContent = L.length ? L.length : '';
    ul.innerHTML = L.length ? L.slice().reverse().map(function (e) {
      return '<li class="lg-i' + (e.undone ? ' undone' : '') + '"><span class="lg-n">' + C.pad(e.n) + '</span><span class="lg-w">' + esc(e.what) + (e.undone ? ' · 되돌림' : '') + '</span>' +
        (e.undone ? '' : '<button type="button" class="btn sm ghost" data-undo="' + e.n + '">되돌리기</button>') + '</li>';
    }).join('') : '<li class="lg-empty">아직 기록이 없습니다.</li>';
  }

  // ── 도우미 판 ──────────────────────────────────────────────
  var tab = $('#ax-tab'), panel = $('#ax'), msgs = $('#ax-msgs'), qIn = $('#ax-q');
  var axTabs = tabs($('.ax-tabs'), function (v) {
    ['chat', 'log', 'hand'].forEach(function (k) { $('#ax-' + k).hidden = k !== v; });
    if (v === 'hand') fillHand(false);
  });
  function openAx(open, view) {
    if (open) {
      panel.hidden = false;
      tab.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function () { panel.classList.add('open'); });
      if (view) axTabs.sel(view);
      var f = view === 'hand' ? $('#h-sum') : view === 'log' ? $('#tab-ax-log') : qIn;
      setTimeout(function () { f.focus(); }, RM ? 0 : 30);
    } else {
      panel.classList.remove('open');
      tab.setAttribute('aria-expanded', 'false');
      setTimeout(function () { if (tab.getAttribute('aria-expanded') === 'false') panel.hidden = true; }, RM ? 0 : 210);
      tab.focus();
    }
  }
  tab.addEventListener('click', function () { openAx(tab.getAttribute('aria-expanded') !== 'true'); });
  $('#ax-close').addEventListener('click', function () { openAx(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (tab.getAttribute('aria-expanded') === 'true') { openAx(false); return; }
    if (menuBtn.getAttribute('aria-expanded') === 'true') menu(false, true);
  });
  $$('[data-ask]').forEach(function (b) { b.addEventListener('click', function () { openAx(true, 'chat'); ask(b.getAttribute('data-ask')); }); });

  // 빠른 질문
  $('#ax-chips').innerHTML = (A.CHIPS[PAGE] || []).map(function (c) { return '<button type="button" class="qchip">' + c + '</button>'; }).join('');
  $$('#ax-chips .qchip').forEach(function (b) { b.addEventListener('click', function () { ask(b.textContent); }); });

  function saveChat() { ss.set('oy-chat', msgs.innerHTML); }
  msgs.innerHTML = ss.get('oy-chat', '') || '<li class="m a"><div class="m-body"><p>오늘 진료 · 빈칸 · 진료비 · 접종 날짜를 이 사이트 표에서 찾습니다. 아래 빠른 질문을 누르거나 문장으로 적으십시오.</p></div></li>';
  function ctx() {
    return { rel: REL, page: PAGE, pet: getPet(), vacc: ss.get('oy-vacc', null), mine: ss.get('oy-mine', []), book: ss.get('oy-book', null), board: D.BOARD[ss.get('oy-board', 0)] };
  }
  function say(role, html) {
    var li = document.createElement('li'); li.className = 'm ' + role; li.innerHTML = html; msgs.appendChild(li); msgs.scrollTop = msgs.scrollHeight; return li;
  }
  function reply(res) {
    var steps = res.steps || [];
    var li = say('a', '<ol class="steps" aria-label="작업 단계">' + steps.map(function (s) { return '<li data-s="wait">' + s + ' <span class="st">대기</span></li>'; }).join('') + '</ol><div class="m-body" hidden>' + res.html + '</div>');
    var items = $$('.steps li', li), i = 0;
    function set(el, s) { el.setAttribute('data-s', s); $('.st', el).textContent = s === 'run' ? '진행 중' : s === 'done' ? '완료' : '대기'; }
    function finish() { items.forEach(function (el) { set(el, 'done'); }); $('.m-body', li).hidden = false; msgs.scrollTop = msgs.scrollHeight; saveChat(); }
    if (RM || !items.length) { finish(); return li; }
    (function tick() {
      if (i > 0) set(items[i - 1], 'done');
      if (i >= items.length) { finish(); return; }
      set(items[i], 'run'); i++;
      setTimeout(tick, 160);
    })();
    return li;
  }
  function ask(q, opt) {
    q = String(q || '').trim(); if (!q) return;
    say('u', '<p>' + esc(q) + '</p>');
    var qs = ss.get('oy-q', []); qs.push(q); ss.set('oy-q', qs.slice(-6));
    var c = ctx(); if (opt) for (var k in opt) c[k] = opt[k];
    var res = A.answer(q, c);
    saveChat();
    return reply(res);
  }
  $('#ax-form').addEventListener('submit', function (e) { e.preventDefault(); var q = qIn.value; qIn.value = ''; ask(q); });

  // 판 안의 단추들
  panel.addEventListener('click', function (e) {
    var u = e.target.closest('[data-undo]');
    if (u) { undo(+u.getAttribute('data-undo')); return; }
    var b = e.target.closest('[data-act]'); if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'chip-x') { var li = b.closest('.chip'); var ul = li.parentNode; li.remove(); if (!$$('.chip', ul).length) ul.innerHTML = '<li class="chip-none">넣을 값 없음</li>'; saveChat(); }
    if (a === 'fill') { var ul2 = b.closest('.m-body').querySelector('.chips'); fill(chipsOf(ul2), '대화'); b.textContent = '넣음'; b.disabled = true; saveChat(); }
    if (a === 'hand') { axTabs.sel('hand'); fillHand(true); $('#h-sum').focus(); }
  });
  function chipsOf(ul) {
    if (!ul) return [];
    var all = JSON.parse(ul.getAttribute('data-chips') || '[]');
    return $$('.chip[data-i]', ul).map(function (li) { return all[+li.getAttribute('data-i')]; });
  }

  // 칸에 넣기 — 반려동물 정보 + 예약 칸
  function fill(chips, from) {
    if (!chips.length) return;
    var pet = getPet(), pet0 = clone(pet), book = ss.get('oy-book', null), book0 = clone(book);
    book = book || {};
    var touchedBook = false, what = [];
    chips.forEach(function (c) {
      if (c.k === 'sp') { pet.sp = c.v; book.sp = c.v; }
      if (c.k === 'age') { pet.age = c.v; book.age = c.v; }
      if (c.k === 'kg') { pet.kg = c.v; book.kg = c.v; }
      if (c.k === 'date') { book.date = c.v; book.time = ''; touchedBook = true; }
      if (c.k === 'part') { book.part = c.v; touchedBook = true; }
      if (c.k === 'svc') { book.svc = c.v; touchedBook = true; }
      if (c.k === 'doc') { book.doc = c.v; book.wantDoc = c.v; touchedBook = true; }
      what.push(c.label + ' ' + c.text);
    });
    if (touchedBook) {
      var s0 = C.svc(book.svc || 'general');
      var docs = book.wantDoc ? [book.wantDoc] : s0.docs;
      var hit = C.freeSlots({ docs: docs, date: book.date, part: book.part }, ss.get('oy-mine', []), 1)[0];
      if (hit) { book.date = hit.date; book.time = hit.time; book.doc = hit.doc; }
      book.draft = true;
    }
    ss.set('oy-pet', pet); ss.set('oy-book', book);
    log(from + ' → 칸 채움: ' + what.join(', '), [{ key: 'oy-pet', before: pet0 }, { key: 'oy-book', before: book0 }]);
    showPet(); if (HOOK['oy-book']) HOOK['oy-book']();
    if (touchedBook) {
      var li = say('a', '<div class="m-body"><p>예약 칸에 넣었습니다: ' + (book.time ? C.md(book.date) + ' ' + book.time + ' · ' + C.doc(book.doc).name : '조건에 맞는 빈칸 없음') + '</p>' + (PAGE !== 'booking' ? '<p class="a-acts"><a class="btn sm" href="' + REL + 'booking/index.html?draft=1">예약 초안 열기</a></p>' : '<p>시간표에서 고른 칸이 바뀌었습니다. 「초안」 표시는 접수하면 「확정」이 됩니다.</p>') + '</div>');
      saveChat(); return li;
    }
  }
  panel.addEventListener('keydown', function (e) { if (e.key === 'Tab') { /* 판은 모달이 아니다 — 포커스 가두지 않음 */ } });
  renderLog(); showPet();

  // ── 상담 요청 (사람에게 넘기기) ─────────────────────────────
  function summary() {
    var p = getPet(), out = [];
    out.push('반려동물: ' + (petLine(p) || '정보 없음'));
    var v = ss.get('oy-vacc', null);
    if (v && v.birth) {
      var over = C.vaccPlan(v).filter(function (x) { return x.state === 'over'; });
      out.push('접종: ' + (over.length ? '지난 접종 ' + over.map(function (x) { return x.name; }).join(', ') : '지난 접종 없음'));
    }
    var b = ss.get('oy-book', null);
    if (b && b.time) out.push('예약' + (b.draft ? ' 초안' : '') + ': ' + C.md(b.date) + ' ' + b.time + ' ' + C.doc(b.doc).name + ' · ' + C.svc(b.svc || 'general').name);
    var qs = ss.get('oy-q', []).slice(-3);
    if (qs.length) out.push('최근 질문: ' + qs.join(' / '));
    return out.join('\n');
  }
  function fillHand(force) {
    var h = ss.get('oy-hand', null);
    if (h && !force) { $('#h-sum').value = h.sum; $('#h-sym').value = h.sym; $('#h-when').value = h.when; $('#h-tel').value = h.tel; }
    else { $('#h-sum').value = summary(); if (!$('#h-sym').value) { var b = ss.get('oy-book', null); $('#h-sym').value = (b && b.memo) || ''; } }
    handSos();
  }
  function handState() { return { sum: $('#h-sum').value, sym: $('#h-sym').value, when: $('#h-when').value, tel: $('#h-tel').value }; }
  function handSos() {
    var hits = C.emergency($('#h-sym').value + ' ' + $('#h-sum').value);
    $('#hand-alert').innerHTML = hits.length ? A.sosCard(hits, REL) : '';
  }
  $('#h-sym').addEventListener('input', handSos);
  $('#hand-fill').addEventListener('click', function () { fillHand(true); });
  HOOK['oy-hand'] = function () { fillHand(false); $('#hand-out').innerHTML = ''; };
  $('#hand-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var h = handState(), bad = [];
    setErr('h-sum', h.sum.trim().length < 10 ? '요약을 10자 넘게 적으십시오.' : ''); if (h.sum.trim().length < 10) bad.push('h-sum');
    setErr('h-sym', h.sym.trim().length < 2 ? '증상이나 묻고 싶은 것을 적으십시오.' : ''); if (h.sym.trim().length < 2) bad.push('h-sym');
    var telOk = /^01[016789]-?\d{3,4}-?\d{4}$/.test(h.tel.trim());
    setErr('h-tel', telOk ? '' : '휴대전화를 010-0000-0000 형식으로 적으십시오.'); if (!telOk) bad.push('h-tel');
    if (bad.length) { $('#hand-out').innerHTML = '<p class="err-line" role="alert">고칠 칸 ' + bad.length + '개</p>'; document.getElementById(bad[0]).focus(); return; }
    var prev = ss.get('oy-hand', null);
    ss.set('oy-hand', h);
    log('상담 요청서 확인', [{ key: 'oy-hand', before: prev }]);
    var hits = C.emergency(h.sym + ' ' + h.sum);
    $('#hand-out').innerHTML = (hits.length ? A.sosCard(hits, REL) : '') + '<div class="preview" tabindex="-1"><p class="pv-h">상담 요청서 · 전송되지 않음</p><dl class="kv">' +
      '<div><dt>요약</dt><dd>' + esc(h.sum).replace(/\n/g, '<br>') + '</dd></div><div><dt>증상</dt><dd>' + esc(h.sym) + '</dd></div><div><dt>연락</dt><dd>' + esc(h.when) + ' · ' + esc(h.tel) + '</dd></div></dl>' +
      '<p class="pv-n">가상 병원이라 실제로 보내지 않습니다. 접수대 전화 ' + D.SITE.tel + '</p></div>';
    $('#hand-out .preview').focus();
  });

  // ── 이상 알림 공통 ────────────────────────────────────────
  function alerts(box, list) {
    var dis = ss.get('oy-dis', []);
    list = list.filter(function (a) { return a.sos || dis.indexOf(a.id) < 0; });
    box.innerHTML = list.map(function (a) {
      return '<div class="alert' + (a.sos ? ' sos-a' : '') + '" data-id="' + a.id + '"' + (a.sos ? ' role="alert"' : '') + '><p class="al-t">' + a.t + '</p><p class="al-why">' + a.why + '</p><p class="al-acts">' +
        (a.fix || []).map(function (f, i) { return f.href ? '<a class="btn sm" href="' + f.href + '">' + f.label + '</a>' : '<button type="button" class="btn sm" data-fix="' + i + '">' + f.label + '</button>'; }).join('') +
        (a.sos ? '' : '<button type="button" class="btn sm ghost" data-close>닫기</button>') + '</p></div>';
    }).join('');
    $$('.alert', box).forEach(function (el, i) {
      var a = list[i];
      $$('[data-fix]', el).forEach(function (b) { b.addEventListener('click', function () { a.fix[+b.getAttribute('data-fix')].run(); }); });
      var x = $('[data-close]', el);
      if (x) x.addEventListener('click', function () { var d = ss.get('oy-dis', []); d.push(a.id); ss.set('oy-dis', d); el.remove(); });
    });
  }

  // ── 처음: 오늘 현황 새로 고침 (모션 2) ─────────────────────
  if (PAGE === 'home') {
    var bi = ss.get('oy-board', 0);
    var live = document.createElement('p'); live.className = 'sr'; live.setAttribute('aria-live', 'polite'); $('.board-head').appendChild(live);
    function board(i, anim) {
      var b = D.BOARD[i];
      $('#board-t').textContent = '2026년 10월 30일 (금) ' + b.t;
      $$('.roll').forEach(function (el) {
        var k = el.getAttribute('data-k'), nv = String(b[k]), ov = el.getAttribute('data-v') || el.textContent;
        el.setAttribute('data-v', nv);
        if (!anim || RM || ov === nv) { el.textContent = nv; return; }
        el.innerHTML = '<span class="r-old" aria-hidden="true">' + ov + '</span><span class="r-new">' + nv + '</span>';
        setTimeout(function () { el.textContent = nv; }, 220);
      });
      if (anim) live.textContent = b.t + ' 기준 대기 ' + b.wait + '마리, 예상 ' + b.mins + '분, 입원실 남은 칸 ' + b.rooms;
    }
    board(bi, false);
    $('#board-next').addEventListener('click', function () { bi = (bi + 1) % D.BOARD.length; ss.set('oy-board', bi); board(bi, true); });
  }

  // ── 진료비 ─────────────────────────────────────────────────
  var pTabs = null;
  if (PAGE === 'prices') {
    var psp = Q.get('s') === 'cat' ? 'cat' : 'dog';
    var kgIn = $('#pr-kg');
    function band() {
      var kg = num(kgIn.value), sp = psp;
      $$('[data-b]').forEach(function (x) { x.classList.remove('on'); });
      if (kgIn.value.trim() === '') { setErr('pr-kg', ''); $('#pr-kg-hint').textContent = '넣으면 그 구간 열을 표시합니다.'; return; }
      if (!(kg > 0 && kg < 100)) { setErr('pr-kg', '0.1~99.9 사이 숫자로 넣으십시오.'); return; }
      setErr('pr-kg', '');
      var bd = C.bandOf(sp, kg);
      $$('[data-sp="' + sp + '"] [data-b="' + bd + '"]').forEach(function (x) { x.classList.add('on'); });
      $('#pr-kg-hint').textContent = SPN[sp] + ' ' + kg + ' kg → ' + D.BANDS[sp][bd] + ' 열';
    }
    pTabs = tabs($('[data-tabs="psp"]'), function (v) {
      psp = v; $$('[data-sp]').forEach(function (w) { w.hidden = w.getAttribute('data-sp') !== v; }); band();
    });
    var pet = getPet();
    if (Q.get('kg')) kgIn.value = Q.get('kg'); else if (pet.kg) kgIn.value = pet.kg;
    if (!Q.get('s') && pet.sp) psp = pet.sp;
    pTabs.sel(psp);
    kgIn.addEventListener('input', band);
  }

  // ── 예방접종 ──────────────────────────────────────────────
  if (PAGE === 'vaccines') {
    var vst = ss.get('oy-vacc', null);
    // 주소 복원 ?s=dog&b=2023-09-12&v=combo.5.2025-09-20,…
    if (Q.get('sample')) vst = clone(D.SAMPLE);
    else if (Q.get('b')) {
      vst = { sp: Q.get('s') === 'cat' ? 'cat' : 'dog', birth: Q.get('b'), v: {} };
      (Q.get('v') || '').split(',').forEach(function (x) { var p = x.split('.'); if (p[0]) vst.v[p[0]] = { n: +p[1] || 0, last: p[2] || '' }; });
    }
    vst = vst || { sp: 'dog', birth: '', v: {} };
    var vTabs = tabs($('[data-tabs="vsp"]'), function (v) { var keep = readVacc(); keep.sp = v; vst = keep; drawVaccIn(); $('#paste-sp').textContent = SPN[v]; });
    function drawVaccIn() {
      $('#v-birth').value = vst.birth || '';
      $('#vacc-in tbody').innerHTML = D.VACCINES[vst.sp].map(function (v) {
        var x = (vst.v && vst.v[v.id]) || { n: 0, last: '' };
        var opts = ''; for (var i = 0; i <= v.n; i++) opts += '<option value="' + i + '"' + (i === Math.min(+x.n || 0, v.n) ? ' selected' : '') + '>' + (i === v.n ? i + '회 · 기초 끝' : i + '회') + '</option>';
        return '<tr data-v="' + v.id + '"><th scope="row">' + v.name + '</th><td><label class="sr" for="vn-' + v.id + '">' + v.name + ' 맞은 횟수</label><select id="vn-' + v.id + '">' + opts + '</select></td>' +
          '<td><label class="sr" for="vl-' + v.id + '">' + v.name + ' 마지막 날짜</label><input type="date" id="vl-' + v.id + '" value="' + (x.last || '') + '" max="' + C.TODAY + '" aria-describedby="vl-' + v.id + '-err"><p class="err" id="vl-' + v.id + '-err" hidden></p></td></tr>';
      }).join('');
    }
    function readVacc() {
      var st = { sp: vst.sp, birth: $('#v-birth').value, v: {} };
      D.VACCINES[vst.sp].forEach(function (v) { var n = $('#vn-' + v.id), l = $('#vl-' + v.id); st.v[v.id] = { n: n ? +n.value : 0, last: l ? l.value : '' }; });
      return st;
    }
    function checkVacc(st) {
      var bad = [];
      setErr('v-birth', '');
      if (!C.okDate(st.birth)) { setErr('v-birth', '태어난 날을 넣으십시오.'); bad.push('v-birth'); }
      else if (st.birth > C.TODAY) { setErr('v-birth', '오늘 뒤 날짜입니다.'); bad.push('v-birth'); }
      D.VACCINES[st.sp].forEach(function (v) {
        var x = st.v[v.id]; setErr('vl-' + v.id, '');
        if (x.n > 0 && !C.okDate(x.last)) { setErr('vl-' + v.id, '맞은 횟수가 있으면 마지막 날짜가 필요합니다.'); bad.push('vl-' + v.id); }
        else if (x.last && C.okDate(st.birth) && x.last < st.birth) { setErr('vl-' + v.id, '태어난 날보다 앞입니다.'); bad.push('vl-' + v.id); }
      });
      return bad;
    }
    function urlVacc(st) {
      var v = Object.keys(st.v).map(function (k) { return k + '.' + st.v[k].n + '.' + (st.v[k].last || ''); }).join(',');
      try { history.replaceState(null, '', location.pathname + '?s=' + st.sp + '&b=' + st.birth + '&v=' + v + location.hash); } catch (e) { /* file:// 일부 브라우저 */ }
    }
    function calcVacc(focusErr) {
      var st = readVacc(), bad = checkVacc(st);
      if (bad.length) { $('#vacc-out').innerHTML = '<p class="err-line">고칠 칸 ' + bad.length + '개</p>'; $('#vacc-alerts').innerHTML = ''; if (focusErr) document.getElementById(bad[0]).focus(); return null; }
      vst = st; ss.set('oy-vacc', st); urlVacc(st);
      var plan = C.vaccPlan(st);
      $('#vacc-out').innerHTML = '<table class="tbl vacc-res"><caption>' + SPN[st.sp] + ' · ' + C.ageText(st.birth) + ' · ' + C.md(C.TODAY) + ' 기준</caption><thead><tr><th scope="col">접종</th><th scope="col">다음 날짜</th><th scope="col">남은 날</th><th scope="col">상태</th><th scope="col">근거</th></tr></thead><tbody>' +
        plan.map(function (x) {
          return '<tr class="st-' + x.state + '"><th scope="row">' + x.name + '</th><td>' + (x.date ? C.ymd(x.date) : '') + '</td><td>' + (x.date ? (x.left < 0 ? -x.left + '일 지남' : x.left + '일') : '') + '</td><td><b>' + C.STATE[x.state] + '</b><small>' + x.why + '</small></td>' +
            '<td><a href="#vx-' + st.sp + '-' + x.id + '">주기표 ' + x.name + ' 줄</a></td></tr>';
        }).join('') + '</tbody></table><div class="btns"><button type="button" class="btn" id="vacc-mk">접종 일정 초안</button></div>';
      $('#vacc-mk').addEventListener('click', function () { makeVDraft(plan); });
      var al = [];
      plan.filter(function (x) { return x.state === 'over'; }).forEach(function (x) {
        al.push({ id: 'v-over-' + st.sp + x.id + x.date, t: x.name + ' · ' + (-x.left) + '일 지남', why: '마지막 접종 ' + (st.v[x.id].last ? C.ymd(st.v[x.id].last) : '없음') + '. 다음 날짜 ' + C.ymd(x.date) + '이 지났습니다(' + x.why + '). 처음부터 다시 맞지 않고 가까운 날 이어서 맞습니다.',
          fix: [{ label: '예방접종 예약 초안', href: '../booking/index.html?draft=1&svc=vacc' }] });
      });
      plan.filter(function (x) { return x.state === 'soon'; }).forEach(function (x) {
        al.push({ id: 'v-soon-' + st.sp + x.id + x.date, t: x.name + ' · ' + x.left + '일 남음', why: C.ymd(x.date) + '이 2주 안입니다. 다른 접종과 같은 날 맞을 수 있는지는 진료 때 정합니다.', fix: [] });
      });
      alerts($('#vacc-alerts'), al);
      return plan;
    }
    function nextOpen(s) { for (var i = 0; i < 20; i++) { if (!C.closed(s)) return s; s = C.add(s, 1); } return s; }
    function makeVDraft(plan) {
      var prev = ss.get('oy-vdraft', null);
      var items = plan.filter(function (x) { return x.date; }).map(function (x) {
        var want = x.state === 'over' ? C.add(C.TODAY, 1) : x.date;
        return { id: x.id, name: x.name, date: nextOpen(want), was: x.date, state: x.state };
      });
      var dr = { sp: vst.sp, items: items, done: false };
      ss.set('oy-vdraft', dr);
      log('접종 일정 초안 ' + items.length + '건', [{ key: 'oy-vdraft', before: prev }]);
      drawVDraft();
      $('#vdraft-h').focus();
    }
    function drawVDraft() {
      var dr = ss.get('oy-vdraft', null), box = $('#vacc-draft');
      if (!dr) { box.innerHTML = ''; return; }
      box.innerHTML = '<section class="draft" aria-labelledby="vdraft-h"><h3 class="sub-h" id="vdraft-h" tabindex="-1">접종 일정 <span class="draft-tag">' + (dr.done ? '확정' : '초안') + '</span></h3>' +
        '<p class="sec-p">지난 접종은 내일 이후 첫 진료일로, 나머지는 예정일로 잡았습니다. 휴진일은 다음 진료일로 미뤘습니다. 날짜를 고친 뒤 확정하십시오.</p>' +
        '<ol class="num-list draft-list">' + dr.items.map(function (x, i) {
          return '<li><span class="dl-n">' + x.name + '</span><label class="sr" for="vd-' + i + '">' + x.name + ' 날짜</label><input type="date" id="vd-' + i + '" value="' + x.date + '" min="' + C.TODAY + '"' + (dr.done ? ' disabled' : '') + '><small>' + C.STATE[x.state] + (x.state === 'over' ? ' · 원래 ' + C.md(x.was) : '') + '</small></li>';
        }).join('') + '</ol>' +
        (dr.done ? '<p class="ok-line">확정했습니다. 예약은 예약 페이지에서 칸을 고르십시오.</p><p class="links"><a href="../booking/index.html?draft=1&svc=vacc&date=' + dr.items.map(function (x) { return x.date; }).sort()[0] + '">첫 날짜로 예약 초안</a></p>' : '<div class="btns"><button type="button" class="btn" id="vd-ok">일정 확정</button></div>') + '</section>';
      $$('input[id^="vd-"]', box).forEach(function (inp, i) {
        inp.addEventListener('change', function () { var d = ss.get('oy-vdraft'); d.items[i].date = inp.value; ss.set('oy-vdraft', d); });
      });
      var ok = $('#vd-ok');
      if (ok) ok.addEventListener('click', function () {
        var d = ss.get('oy-vdraft'), prev = clone(d);
        var bad = d.items.some(function (x) { return !C.okDate(x.date) || C.closed(x.date); });
        if (bad) { box.querySelector('.draft').insertAdjacentHTML('beforeend', '<p class="err-line" role="alert">빈 날짜나 휴진일이 있습니다.</p>'); return; }
        d.done = true; ss.set('oy-vdraft', d); log('접종 일정 확정', [{ key: 'oy-vdraft', before: prev }]); drawVDraft(); $('#vdraft-h').focus();
      });
    }
    HOOK['oy-vdraft'] = drawVDraft;
    HOOK['oy-vacc'] = function () { vst = ss.get('oy-vacc', null) || { sp: 'dog', birth: '', v: {} }; vTabs.sel(vst.sp, true); drawVaccIn(); if (vst.birth) calcVacc(); else { $('#vacc-out').innerHTML = ''; $('#vacc-alerts').innerHTML = ''; } };
    vTabs.sel(vst.sp, true); $('#paste-sp').textContent = SPN[vst.sp];
    drawVaccIn();
    $('#vacc-form').addEventListener('submit', function (e) { e.preventDefault(); calcVacc(true); });
    $('#vacc-form').addEventListener('change', function () { if (C.okDate($('#v-birth').value)) calcVacc(false); });
    $('#vacc-sample').addEventListener('click', function () { vst = clone(D.SAMPLE); vTabs.sel('dog', true); drawVaccIn(); calcVacc(false); });
    $('#vacc-clear').addEventListener('click', function () { vst = { sp: vst.sp, birth: '', v: {} }; drawVaccIn(); $('#vacc-out').innerHTML = ''; $('#vacc-alerts').innerHTML = ''; });
    if (vst.birth) { var plan0 = calcVacc(false); if (Q.get('draft') && plan0) makeVDraft(plan0); }
    drawVDraft();
    // 붙여넣기
    var pasted = null;
    $('#paste-sample').addEventListener('click', function () { $('#paste').value = D.PASTE_SAMPLE; });
    $('#paste-read').addEventListener('click', function () {
      var t = $('#paste').value;
      if (!t.trim()) { setErr('paste', '붙여넣을 글이 없습니다.'); $('#paste').focus(); return; }
      setErr('paste', '');
      pasted = C.parsePaste(vst.sp, t);
      drawPaste();
    });
    function drawPaste() {
      var r = pasted, list = D.VACCINES[vst.sp];
      $('#paste-out').innerHTML = '<p class="sum-line">읽은 줄 ' + r.ok.length + ' · 못 읽은 줄 ' + r.bad.length + '</p>' +
        (r.ok.length ? '<table class="tbl paste"><caption>읽은 줄 · 칸마다 고칠 수 있습니다</caption><thead><tr><th scope="col">줄</th><th scope="col">날짜</th><th scope="col">접종</th><th scope="col">차수</th><th scope="col">다음 날짜</th></tr></thead><tbody>' +
          r.ok.map(function (x, i) {
            return '<tr><td>' + x.line + '</td><td><label class="sr" for="pd-' + i + '">' + x.line + '줄 날짜</label><input type="date" id="pd-' + i + '" value="' + x.date + '"></td>' +
              '<td><label class="sr" for="pv-' + i + '">' + x.line + '줄 접종</label><select id="pv-' + i + '">' + list.map(function (v) { return '<option value="' + v.id + '"' + (v.id === x.id ? ' selected' : '') + '>' + v.name + '</option>'; }).join('') + '</select></td>' +
              '<td><label class="sr" for="pn-' + i + '">' + x.line + '줄 차수</label><input id="pn-' + i + '" inputmode="numeric" value="' + x.n + '" size="2"></td><td>' + (x.next ? C.ymd(x.next) : '적혀 있지 않음') + '</td></tr>';
          }).join('') + '</tbody></table>' : '') +
        (r.bad.length ? '<h3 class="sub-h">못 읽은 줄</h3><ul class="bad">' + r.bad.map(function (x) { return '<li><b>' + x.line + '줄</b> <q>' + esc(x.raw) + '</q> · ' + x.why + '</li>'; }).join('') + '</ul>' : '') +
        (r.ok.length ? '<div class="btns"><button type="button" class="btn" id="paste-put">계산 칸에 넣기</button></div>' : '');
      var put = $('#paste-put');
      if (put) put.addEventListener('click', function () {
        var prev = ss.get('oy-vacc', null), st = readVacc();
        r.ok.forEach(function (x, i) {
          var id = $('#pv-' + i).value, d = $('#pd-' + i).value, n = parseInt($('#pn-' + i).value, 10) || 1;
          var v = C.vaccine(vst.sp, id); n = Math.min(n, v.n);
          var cur = st.v[id] || { n: 0, last: '' };
          if (!cur.last || d >= cur.last) st.v[id] = { n: Math.max(n, d >= (cur.last || '') ? n : cur.n), last: d };
        });
        vst = st; drawVaccIn();
        ss.set('oy-vacc', st);
        log('수첩 붙여넣기 ' + r.ok.length + '줄 → 접종 칸', [{ key: 'oy-vacc', before: prev }]);
        if (C.okDate(st.birth)) calcVacc(false); else { setErr('v-birth', '태어난 날을 넣으면 계산합니다.'); $('#v-birth').focus(); }
        put.textContent = '넣음'; put.disabled = true;
      });
    }
  }

  // ── 예약 ───────────────────────────────────────────────────
  if (PAGE === 'booking') {
    var bk = ss.get('oy-book', null) || {};
    if (Q.get('draft') || Q.get('svc') || Q.get('doc')) {
      var bk0 = clone(ss.get('oy-book', null));
      if (Q.get('svc')) bk.svc = Q.get('svc');
      if (Q.get('date')) bk.date = Q.get('date');
      if (Q.get('time')) bk.time = Q.get('time');
      if (Q.get('doc')) { bk.doc = Q.get('doc'); if (!Q.get('time')) bk.wantDoc = Q.get('doc'); }
      if (Q.get('draft')) {
        if (!bk.time) {
          var s0 = C.svc(bk.svc || 'general'), hit = C.freeSlots({ docs: bk.wantDoc ? [bk.wantDoc] : s0.docs, from: bk.date, part: bk.part }, ss.get('oy-mine', []), 1)[0];
          if (hit) { bk.date = hit.date; bk.time = hit.time; bk.doc = hit.doc; }
        }
        bk.draft = true;
        var p0 = getPet(); if (p0.sp && !bk.sp) bk.sp = p0.sp; if (p0.kg && !bk.kg) bk.kg = p0.kg; if (p0.age != null && bk.age == null) bk.age = p0.age;
        ss.set('oy-book', bk);
        log('예약 초안 · ' + C.svc(bk.svc || 'general').name + (bk.time ? ' ' + C.md(bk.date) + ' ' + bk.time : ''), [{ key: 'oy-book', before: bk0 }]);
      }
      try { history.replaceState(null, '', location.pathname); } catch (e) { /* file:// */ }
    }
    bk.svc = bk.svc || 'general';
    bk.date = D.BOOK_DAYS.indexOf(bk.date) > -1 ? bk.date : D.BOOK_DAYS[0];
    var dayTabs = tabs($('[data-tabs="day"]'), function (v) { bk.date = v; saveBk(); drawBook(); });
    function saveBk() { ss.set('oy-book', bk); }
    function formToBk() {
      bk.name = $('#b-name').value; bk.tel = $('#b-tel').value; bk.pet = $('#b-pet').value;
      bk.sp = ($('input[name="b-sp"]:checked') || {}).value; bk.kg = $('#b-kg').value; bk.age = $('#b-age').value;
      bk.last = $('#b-last').value; bk.memo = $('#b-memo').value; bk.svc = $('#b-svc').value;
    }
    function bkToForm() {
      $('#b-name').value = bk.name || ''; $('#b-tel').value = bk.tel || ''; $('#b-pet').value = bk.pet || '';
      $$('input[name="b-sp"]').forEach(function (r) { r.checked = r.value === (bk.sp || 'dog'); });
      $('#b-kg').value = bk.kg == null ? '' : bk.kg; $('#b-age').value = bk.age == null ? '' : bk.age;
      $('#b-last').value = bk.last || ''; $('#b-memo').value = bk.memo || ''; $('#b-svc').value = bk.svc || 'general';
    }
    function drawGrid() {
      var s = bk.date, g = $('#grid'), mine = ss.get('oy-mine', []);
      var cl = C.closed(s);
      if (cl) { g.innerHTML = '<p class="closed-day">' + C.md(s) + ' · ' + cl + '</p>'; return; }
      var docs = C.svc(bk.svc).docs;
      g.innerHTML = '<table class="grid"><caption class="sr">' + C.md(s) + ' 예약 칸</caption><thead><tr><th scope="col">시각</th>' + D.DOCTORS.map(function (d) {
        return '<th scope="col"' + (docs.indexOf(d.id) < 0 ? ' class="dim"' : '') + '>' + d.name + '<small>' + (docs.indexOf(d.id) < 0 ? C.svc(bk.svc).name + ' 담당 아님' : d.field) + '</small></th>';
      }).join('') + '</tr></thead><tbody>' + C.times(s).map(function (t) {
        return '<tr><th scope="row">' + t + '</th>' + D.DOCTORS.map(function (d) {
          var st = C.slot(s, t, d.id, mine), sel = bk.time === t && bk.doc === d.id;
          var lab = C.md(s) + ' ' + t + ' ' + d.name + ' · ' + (sel ? '고른 칸' : st.why);
          var txt = st.st === 'free' ? (sel ? '고름' : '빈칸') : st.st === 'mine' ? '내 예약' : st.st === 'block' ? st.why : st.st === 'off' ? '쉼' : st.st === 'past' ? '지남' : '찬 칸';
          return '<td><button type="button" class="cell c-' + st.st + (sel ? ' sel' : '') + '" data-t="' + t + '" data-d="' + d.id + '" aria-pressed="' + sel + '" aria-label="' + lab + '"' + (st.st === 'free' ? '' : ' disabled') + '>' + txt + '</button></td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
      $$('.cell:not([disabled])', g).forEach(function (b) {
        b.addEventListener('click', function () { bk.time = b.getAttribute('data-t'); bk.doc = b.getAttribute('data-d'); saveBk(); drawBook(); var nb = $('.cell[data-t="' + bk.time + '"][data-d="' + bk.doc + '"]'); if (nb) nb.focus(); });
      });
    }
    function picked() {
      var ok = bk.time && bk.doc && C.slot(bk.date, bk.time, bk.doc, ss.get('oy-mine', [])).st === 'free';
      $('#picked').textContent = ok ? '고른 칸: ' + C.md(bk.date) + ' ' + bk.time + ' · ' + C.doc(bk.doc).name + ' · ' + C.svc(bk.svc).name : '고른 칸 없음';
      return ok;
    }
    function drawAlerts() {
      var al = [], memo = bk.memo || '';
      var hits = C.emergency(memo);
      if (hits.length) al.push({ id: 'sos', sos: true, t: '예약보다 전화가 먼저입니다', why: '적은 증상에 응급 신호 ' + hits.map(function (h) { return '「' + h.t + '」'; }).join(', ') + '가 있습니다. 지금 ' + D.SITE.tel + ' · 19:00 이후 ' + D.SITE.night.name + ' ' + D.SITE.night.tel + ' (가상)', fix: [{ label: '전화 걸기', href: 'tel:' + D.SITE.tel.replace(/-/g, '') }, { label: '응급 신호 보기', href: '../emergency/index.html#em-' + hits[0].id }] });
      if (C.closed(bk.date)) {
        var nx = D.BOOK_DAYS.filter(function (s) { return !C.closed(s) && s > bk.date; })[0], pv = D.BOOK_DAYS.filter(function (s) { return !C.closed(s) && s < bk.date; }).pop();
        var fx = [];
        if (pv) fx.push({ label: C.md(pv) + ' 보기', run: function () { dayTabs.sel(pv); } });
        if (nx) fx.push({ label: C.md(nx) + ' 보기', run: function () { dayTabs.sel(nx); } });
        al.push({ id: 'closed-' + bk.date, t: C.md(bk.date) + '은 휴진일입니다', why: C.closed(bk.date) + '. 이날은 예약 칸이 없습니다.', fix: fx });
      }
      if (bk.time && bk.doc && C.svc(bk.svc).docs.indexOf(bk.doc) < 0) {
        al.push({ id: 'doc-' + bk.svc + bk.doc, t: C.doc(bk.doc).name + ' 수의사는 ' + C.svc(bk.svc).name + ' 담당이 아닙니다', why: '담당: ' + C.svc(bk.svc).docs.map(function (x) { return C.doc(x).name; }).join(' · ') + '. 고른 칸을 풀고 담당 수의사 칸에서 고르십시오.',
          fix: [{ label: '담당 빈칸으로', run: function () { var h = C.freeSlots({ docs: C.svc(bk.svc).docs, from: bk.date }, ss.get('oy-mine', []), 1)[0]; if (h) { bk.date = h.date; bk.time = h.time; bk.doc = h.doc; saveBk(); dayTabs.sel(h.date, true); drawBook(); } } }] });
      }
      if (C.dow(bk.date) === 6 && !C.closed(bk.date)) al.push({ id: 'sat-' + bk.date, t: '토요일은 14:30에 접수를 마감합니다', why: '토요일은 수의사 2명이 진료해 평일보다 대기가 깁니다.', fix: [] });
      var v = ss.get('oy-vacc', null);
      if (v && v.birth && bk.svc !== 'vacc') {
        var over = C.vaccPlan(v).filter(function (x) { return x.state === 'over'; });
        if (over.length) al.push({ id: 'vover-' + bk.svc, t: '지난 접종 ' + over.length + '개', why: over.map(function (x) { return x.name; }).join(' · ') + '. 같은 날 접종할 수 있는지는 진료 때 정합니다.', fix: [{ label: '예방접종으로 바꾸기', run: function () { bk.svc = 'vacc'; $('#b-svc').value = 'vacc'; saveBk(); drawBook(); } }] });
      }
      alerts($('#book-alerts'), al);
    }
    function drawOpts() {
      var o = C.threeOptions({ svc: bk.svc, lastDoc: bk.last, part: bk.part }, ss.get('oy-mine', []));
      $('#opts').innerHTML = '<ol class="opt-list">' + o.map(function (x, i) {
        var s = x.slot, cur = s && bk.time === s.time && bk.date === s.date && bk.doc === s.doc;
        return '<li class="opt' + (cur ? ' cur' : '') + '"><span class="ix-n" aria-hidden="true">' + C.pad(i + 1) + '</span><div><p class="opt-h">' + x.name + (cur ? ' <span class="draft-tag">지금 고른 안</span>' : '') + '</p><p class="opt-s">' + (s ? C.md(s.date) + ' ' + s.time + ' · ' + C.doc(s.doc).name : x.id === 'same' && !bk.last ? '고르지 않음' : '빈칸 없음') + '</p><p class="opt-w">' + x.why + '</p></div>' +
          (s ? '<button type="button" class="btn sm" data-opt="' + i + '"' + (cur ? ' disabled' : '') + '>이 안으로</button>' : '') + '</li>';
      }).join('') + '</ol>';
      $$('[data-opt]').forEach(function (b) {
        b.addEventListener('click', function () {
          var x = o[+b.getAttribute('data-opt')], prev = clone(bk);
          bk.date = x.slot.date; bk.time = x.slot.time; bk.doc = x.slot.doc; saveBk();
          log('세 가지 안 · ' + x.name + ' 적용 (' + C.md(x.slot.date) + ' ' + x.slot.time + ')', [{ key: 'oy-book', before: prev }]);
          dayTabs.sel(bk.date, true); drawBook();
          var nb = $('[data-opt="' + b.getAttribute('data-opt') + '"]'); var row = nb ? nb.closest('.opt') : null; if (row) { row.setAttribute('tabindex', '-1'); row.focus(); }
        });
      });
    }
    function drawBook() {
      $('#book-draft').hidden = !bk.draft;
      drawGrid(); picked(); drawAlerts(); drawOpts();
    }
    HOOK['oy-book'] = function () { bk = ss.get('oy-book', null) || { svc: 'general', date: D.BOOK_DAYS[0] }; bk.svc = bk.svc || 'general'; if (D.BOOK_DAYS.indexOf(bk.date) < 0) bk.date = D.BOOK_DAYS[0]; bkToForm(); dayTabs.sel(bk.date, true); drawBook(); };
    bkToForm(); dayTabs.sel(bk.date, true); drawBook();
    $('#b-svc').addEventListener('change', function () { bk.svc = $('#b-svc').value; saveBk(); drawBook(); });
    $('#book-form').addEventListener('input', function (e) { formToBk(); saveBk(); if (e.target.id === 'b-memo' || e.target.id === 'b-last') { drawAlerts(); if (e.target.id === 'b-last') drawOpts(); } });
    $('#book-form').addEventListener('change', function (e) { if (e.target.id === 'b-last') { formToBk(); saveBk(); drawOpts(); } });
    $('#book-form').addEventListener('submit', function (e) {
      e.preventDefault(); formToBk(); saveBk();
      var errs = [];
      var chk = function (id, bad, msg) { setErr(id, bad ? msg : ''); if (bad) errs.push([id, msg]); };
      var slotOk = picked();
      if (!slotOk) errs.push(['grid', '칸을 고르십시오.']);
      chk('b-name', (bk.name || '').trim().length < 2, '보호자 이름을 2자 넘게 적으십시오.');
      chk('b-tel', !/^01[016789]-?\d{3,4}-?\d{4}$/.test((bk.tel || '').trim()), '휴대전화를 010-0000-0000 형식으로 적으십시오.');
      chk('b-pet', !(bk.pet || '').trim(), '반려동물 이름을 적으십시오.');
      var kg = num(bk.kg); chk('b-kg', bk.kg !== '' && bk.kg != null && !(kg >= 0.1 && kg < 100), '체중은 0.1~99.9 kg 숫자로 적으십시오.');
      var ag = num(bk.age); chk('b-age', bk.age !== '' && bk.age != null && !(ag >= 0 && ag <= 30), '나이는 0~30 숫자로 적으십시오.');
      var sum = $('#err-sum');
      if (errs.length) {
        sum.hidden = false;
        sum.innerHTML = '<p>고칠 곳 ' + errs.length + '개</p><ul>' + errs.map(function (x) { return '<li><a href="#' + (x[0] === 'grid' ? 'h-grid' : x[0]) + '" data-to="' + x[0] + '">' + x[1] + '</a></li>'; }).join('') + '</ul>';
        $$('a[data-to]', sum).forEach(function (a) { a.addEventListener('click', function (ev) { ev.preventDefault(); var id = a.getAttribute('data-to'); var t = id === 'grid' ? ($('.cell:not([disabled])') || $('#tab-day-' + bk.date)) : document.getElementById(id); if (t) t.focus(); }); });
        sum.focus(); return;
      }
      sum.hidden = true;
      var prev = clone(bk), mine = ss.get('oy-mine', []), mine0 = clone(mine);
      var no = 'OY-' + bk.date.slice(5).replace('-', '') + '-' + bk.doc.toUpperCase() + '-' + bk.time.replace(':', '');
      mine.push({ date: bk.date, time: bk.time, doc: bk.doc, no: no, svc: bk.svc });
      ss.set('oy-mine', mine);
      var done = { no: no, date: bk.date, time: bk.time, doc: bk.doc, svc: bk.svc, pet: bk.pet };
      bk.draft = false; bk.time = ''; saveBk();
      log('예약 접수 ' + no, [{ key: 'oy-book', before: prev }, { key: 'oy-mine', before: mine0 }]);
      drawBook();
      $('#book-done').innerHTML = '<div class="done" tabindex="-1"><p class="done-h">접수 번호 <b>' + no + '</b> <span class="draft-tag">확정</span></p><p>' + C.md(done.date) + ' ' + done.time + ' · ' + C.doc(done.doc).name + ' · ' + C.svc(done.svc).name + ' · ' + esc(done.pet) + '</p><p class="pv-n">가상 병원이라 전송하지 않습니다. 이 칸은 시간표에 「내 예약」으로 남습니다.</p></div>';
      $('#book-done .done').focus();
    });
    HOOK['oy-mine'] = function () { $('#book-done').innerHTML = ''; drawBook(); };
    // 문장으로 넣기
    var lastParse = null;
    $('#say-read').addEventListener('click', readSay);
    $('#say').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); readSay(); } });
    function readSay() {
      var t = $('#say').value.trim();
      if (!t) { setErr('say', '문장을 적으십시오.'); $('#say').focus(); return; }
      setErr('say', '');
      var hits = C.emergency(t);
      lastParse = C.parse(t);
      $('#say-out').innerHTML = (hits.length ? A.sosCard(hits, REL) : '') + (lastParse.chips.length ? '<ul class="chips" data-chips=\'' + esc(JSON.stringify(lastParse.chips)) + '\'>' + lastParse.chips.map(function (c, i) {
        return '<li class="chip" data-i="' + i + '"><span>' + c.label + '</span> <b>' + esc(c.text) + '</b> <button type="button" class="chip-x" aria-label="' + c.label + ' ' + esc(c.text) + ' 빼기">빼기</button></li>';
      }).join('') + '</ul>' : '<p>읽은 값이 없습니다.</p>') +
        (lastParse.rest.length ? '<p class="a-miss">못 읽은 부분: ' + lastParse.rest.map(function (r) { return '<mark>' + esc(r) + '</mark>'; }).join(' · ') + '</p>' : '') +
        (lastParse.chips.length ? '<div class="btns"><button type="button" class="btn" id="say-put">칸에 넣기</button></div>' : '');
      $$('#say-out .chip-x').forEach(function (b) { b.addEventListener('click', function () { var li = b.closest('.chip'), ul = li.parentNode; var nx = li.nextElementSibling || li.previousElementSibling; li.remove(); var f = nx && $('.chip-x', nx); if (f) f.focus(); if (!$$('.chip', ul).length) { ul.innerHTML = '<li class="chip-none">넣을 값 없음</li>'; } }); });
      var put = $('#say-put');
      if (put) put.addEventListener('click', function () {
        var ch = chipsOf($('#say-out .chips'));
        if (!ch.length) return;
        fill(ch, '문장');
        bk = ss.get('oy-book', bk); bkToForm(); dayTabs.sel(bk.date, true); drawBook();
        put.textContent = '넣음'; put.disabled = true;
      });
    }
  }

  // ── 입원 준비물 초안 ───────────────────────────────────────
  if (PAGE === 'inpatient') {
    function draftItems(sp, kg, age) {
      var W = D.WARD, list = W.base.slice();
      list = list.concat(W.extra[sp] || []);
      if (sp === 'dog' && kg >= 25) list = list.concat(W.extra.big);
      if (age >= 10) list = list.concat(W.extra.senior);
      return list.map(function (x) { return { t: x.t, on: true }; });
    }
    function drawWard() {
      var w = ss.get('oy-ward', null), box = $('#ward-out');
      if (!w) { box.innerHTML = ''; return; }
      box.innerHTML = '<section class="draft" aria-labelledby="wd-h"><h3 class="sub-h" id="wd-h" tabindex="-1">' + SPN[w.sp] + ' ' + w.kg + ' kg' + (w.age !== '' && w.age != null ? ' · ' + w.age + '살' : '') + ' 준비물 <span class="draft-tag">' + (w.done ? '확정' : '초안') + '</span></h3>' +
        '<ul class="check">' + w.items.map(function (x, i) {
          return '<li><label><input type="checkbox" data-wi="' + i + '"' + (x.on ? ' checked' : '') + (w.done ? ' disabled' : '') + '> ' + esc(x.t) + '</label>' + (w.done ? '' : ' <button type="button" class="btn sm ghost" data-wx="' + i + '" aria-label="' + esc(x.t) + ' 빼기">빼기</button>') + '</li>';
        }).join('') + '</ul>' +
        (w.done ? '<p class="ok-line">확정했습니다. 입원 당일 이 목록을 가져오십시오.</p>' : '<div class="add"><label for="wd-add">더할 것</label><input id="wd-add" aria-describedby="wd-add-err"><button type="button" class="btn sm ghost" id="wd-add-b">더하기</button><p class="err" id="wd-add-err" hidden></p></div><div class="btns"><button type="button" class="btn" id="wd-ok">목록 확정</button></div>') + '</section>';
      $$('[data-wi]', box).forEach(function (c) { c.addEventListener('change', function () { var x = ss.get('oy-ward'); x.items[+c.getAttribute('data-wi')].on = c.checked; ss.set('oy-ward', x); }); });
      $$('[data-wx]', box).forEach(function (b) { b.addEventListener('click', function () { var x = ss.get('oy-ward'), prev = clone(x), it = x.items.splice(+b.getAttribute('data-wx'), 1)[0]; ss.set('oy-ward', x); log('준비물 빼기: ' + it.t, [{ key: 'oy-ward', before: prev }]); drawWard(); $('#wd-h').focus(); }); });
      var ab = $('#wd-add-b');
      if (ab) ab.addEventListener('click', function () {
        var v = $('#wd-add').value.trim();
        if (v.length < 2) { setErr('wd-add', '2자 넘게 적으십시오.'); $('#wd-add').focus(); return; }
        var x = ss.get('oy-ward'), prev = clone(x); x.items.push({ t: v, on: true }); ss.set('oy-ward', x); log('준비물 더하기: ' + v, [{ key: 'oy-ward', before: prev }]); drawWard(); $('#wd-add').focus();
      });
      var ok = $('#wd-ok');
      if (ok) ok.addEventListener('click', function () { var x = ss.get('oy-ward'), prev = clone(x); x.done = true; ss.set('oy-ward', x); log('준비물 목록 확정', [{ key: 'oy-ward', before: prev }]); drawWard(); $('#wd-h').focus(); });
    }
    HOOK['oy-ward'] = drawWard;
    var wp = getPet();
    if (wp.sp) $$('input[name="w-sp"]').forEach(function (r) { r.checked = r.value === wp.sp; });
    if (wp.kg) $('#w-kg').value = wp.kg;
    if (wp.age != null) $('#w-age').value = wp.age;
    function makeWard(focus) {
      var sp = $('input[name="w-sp"]:checked').value, kg = num($('#w-kg').value), ageS = $('#w-age').value.trim(), age = num(ageS), bad = [];
      setErr('w-kg', kg > 0 && kg < 100 ? '' : '체중을 0.1~99.9 kg 숫자로 적으십시오.'); if (!(kg > 0 && kg < 100)) bad.push('w-kg');
      setErr('w-age', ageS === '' || (age >= 0 && age <= 30) ? '' : '나이는 0~30 숫자로 적으십시오.'); if (!(ageS === '' || (age >= 0 && age <= 30))) bad.push('w-age');
      if (bad.length) { if (focus) document.getElementById(bad[0]).focus(); return; }
      var prev = ss.get('oy-ward', null);
      ss.set('oy-ward', { sp: sp, kg: kg, age: ageS === '' ? '' : age, items: draftItems(sp, kg, ageS === '' ? 0 : age), done: false });
      log('입원 준비물 초안 · ' + SPN[sp] + ' ' + kg + ' kg', [{ key: 'oy-ward', before: prev }]);
      drawWard(); $('#wd-h').focus();
    }
    $('#ward-form').addEventListener('submit', function (e) { e.preventDefault(); makeWard(true); });
    if (Q.get('draft') && wp.kg) makeWard(false); else drawWard();
  }

  highlight();
})();
