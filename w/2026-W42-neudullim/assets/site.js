// 늦울림음악당 — 화면 동작. 데이터 window.NU, 계산 window.NUCALC
(function () {
  var D = window.NU, C = window.NUCALC;
  var page = document.body.dataset.page, rel = document.body.dataset.rel || '';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(location.search);
  function setParams(obj) {
    var p = new URLSearchParams(location.search);
    Object.keys(obj).forEach(function (k) { var v = obj[k]; if (v === '' || v == null) p.delete(k); else p.set(k, v); });
    var s = p.toString();
    try { history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash); } catch (e) { /* file:// 에서 막히면 주소만 그대로 */ }
  }
  var CON = {}; D.CONCERTS.forEach(function (c) { CON[c.id] = c; });
  var GEN = {}; D.GENRES.forEach(function (g) { GEN[g[0]] = g[1]; });
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function axisHtml(rows) { return rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join(''); }
  function link(id, q) { return rel + (id === 'home' ? 'index.html' : id + '/index.html') + (q || ''); }
  function priceLine(c) { return c.price.length === 1 ? '전석 ' + C.won(c.price[0]) : 'R ' + C.won(c.price[0]) + ' · S ' + C.won(c.price[1]) + ' · A ' + C.won(c.price[2]); }

  // ── 모바일 메뉴 ──
  var mb = $('.menu-btn'), nav = $('#nav');
  if (mb) {
    var closeMenu = function (focus) { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); document.body.classList.remove('lock'); if (focus) mb.focus(); };
    mb.addEventListener('click', function () {
      var open = mb.getAttribute('aria-expanded') !== 'true';
      if (!open) return closeMenu(false);
      nav.classList.add('open'); mb.setAttribute('aria-expanded', 'true'); document.body.classList.add('lock');
      var a = $('a', nav); if (a) a.focus();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu(true); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100 && nav.classList.contains('open')) closeMenu(false); });
  }

  // ── 대화상자 공통 ──
  function dialog(dlg, closers) {
    var opener = null;
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    closers.forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
    dlg.addEventListener('close', function () { if (opener && document.contains(opener)) opener.focus(); if (dlg.onclosed) dlg.onclosed(); });
    return { open: function (from) { opener = from || document.activeElement; if (!dlg.open) dlg.showModal(); } };
  }

  // ── 공연 ──
  if (page === 'concerts') {
    var state = { genre: [], month: [], sort: 'date' };
    (params.get('genre') || '').split(',').filter(Boolean).forEach(function (g) { if (GEN[g]) state.genre.push(g); });
    (params.get('month') || '').split(',').filter(Boolean).forEach(function (m) { if (['10', '11', '12'].indexOf(m) > -1) state.month.push(m); });
    if (['date', 'price', 'price-d', 'left'].indexOf(params.get('sort')) > -1) state.sort = params.get('sort');
    var list = $('#list'), items = $$('.prog', list), sortSel = $('#sort');
    sortSel.value = state.sort;
    function apply(write) {
      $$('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(state[b.dataset.f].indexOf(b.dataset.v) > -1)); });
      var shown = items.filter(function (li) {
        var ok = (!state.genre.length || state.genre.indexOf(li.dataset.genre) > -1) && (!state.month.length || state.month.indexOf(li.dataset.month) > -1);
        li.hidden = !ok; return ok;
      });
      var key = { date: function (li) { return li.dataset.date; }, price: function (li) { return +li.dataset.price; }, 'price-d': function (li) { return -li.dataset.price; }, left: function (li) { return CON[li.dataset.id].sold; } }[state.sort];
      items.slice().sort(function (a, b) { var x = key(a), y = key(b); return x < y ? -1 : x > y ? 1 : (a.dataset.date < b.dataset.date ? -1 : 1); }).forEach(function (li) { list.appendChild(li); });
      $('#count').textContent = shown.length;
      $('#empty').hidden = shown.length > 0;
      if (write) setParams({ genre: state.genre.join(','), month: state.month.join(','), sort: state.sort === 'date' ? '' : state.sort });
    }
    $$('.chip').forEach(function (b) {
      b.addEventListener('click', function () {
        var arr = state[b.dataset.f], i = arr.indexOf(b.dataset.v);
        if (i > -1) arr.splice(i, 1); else arr.push(b.dataset.v);
        apply(true);
      });
    });
    sortSel.addEventListener('change', function () { state.sort = sortSel.value; apply(true); });
    $('#clear').addEventListener('click', function () { state.genre = []; state.month = []; apply(true); $$('.chip')[0].focus(); });
    apply(false);

    var dlg = $('#dlg'), cur = null;
    var dd = dialog(dlg, [$('#dlg-close')]);
    dlg.onclosed = function () { setParams({ c: '' }); };
    function visibleIds() { return $$('.prog', list).filter(function (li) { return !li.hidden; }).map(function (li) { return li.dataset.id; }); }
    function fill(id) {
      var c = CON[id]; cur = id;
      $('#dlg-when').textContent = C.md(c.date) + ' ' + c.time + ' · ' + GEN[c.genre];
      $('#dlg-title').textContent = c.title;
      $('#dlg-who').innerHTML = axisHtml(c.who.map(function (w) { return [esc(w[0]), esc(w[1])]; }));
      $('#dlg-works').innerHTML = c.works.map(function (w) { return '<li><b>' + esc(w[0]) + '</b>' + esc(w[1]) + '</li>'; }).join('');
      $('#dlg-facts').innerHTML = axisHtml([['공연 시간', '약 ' + c.min + '분'], ['값', priceLine(c)], ['남은 자리', Math.round((1 - c.sold) * 100) + ' %']].concat(c.note ? [['입장', esc(c.note)]] : []));
      $('#dlg-seat').href = link('seats', '?c=' + id);
      $('#dlg-book').href = link('book', '?c=' + id);
      var ids = visibleIds(), i = ids.indexOf(id);
      $('#dlg-prev').disabled = i <= 0; $('#dlg-next').disabled = i < 0 || i >= ids.length - 1;
      setParams({ c: id });
    }
    function step(d) { var ids = visibleIds(), i = ids.indexOf(cur); if (i + d >= 0 && i + d < ids.length) fill(ids[i + d]); }
    $('#dlg-prev').addEventListener('click', function () { step(-1); });
    $('#dlg-next').addEventListener('click', function () { step(1); });
    dlg.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target === dlg) {
        if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      }
    });
    list.addEventListener('click', function (e) { var b = e.target.closest('[data-open]'); if (!b) return; fill(b.dataset.open); dd.open(b); });
    if (CON[params.get('c')]) { var opener = $('[data-open="' + params.get('c') + '"]'); fill(params.get('c')); dd.open(opener); }
  }

  // ── 좌석 ──
  if (page === 'seats') {
    var S = C.seats(), byId = {}, rows = {};
    S.forEach(function (s) { byId[s.id] = s; (rows[s.ri] = rows[s.ri] || []).push(s); });
    var sel = $('#concert'), svg = $('.seatmap'), sight = $('.sight', svg);
    var rects = {}; $$('.seat', svg).forEach(function (r) { rects[r.dataset.seat] = r; });
    var cid = CON[params.get('c')] ? params.get('c') : D.CONCERTS.filter(function (c) { return c.date > C.TODAY; })[0].id;
    sel.value = cid;
    var sold = {}, picked = null, focusId = null;
    function render() {
      var c = CON[cid]; sold = C.soldSet(c);
      var left = { R: 0, S: 0, A: 0 };
      S.forEach(function (s) {
        var r = rects[s.id], isSold = !!sold[s.id];
        if (isSold) r.setAttribute('aria-disabled', 'true'); else { r.removeAttribute('aria-disabled'); left[s.zone]++; }
        r.setAttribute('aria-label', s.floor + '층 ' + s.row + '열 ' + s.n + '번, ' + s.zone + '석 ' + C.won(C.priceOf(c, s.zone)) + (isSold ? ', 팔림' : ', 무대까지 ' + s.dist.toFixed(1) + ' m'));
      });
      $$('[data-zone-left]').forEach(function (el) { var z = el.dataset.zoneLeft; el.textContent = C.won(C.priceOf(c, z)) + ' · 남은 자리 ' + left[z]; });
      if (picked && sold[picked]) pick(null);
      else if (picked) pick(picked, true);
    }
    function setFocus(id, move) {
      if (focusId && rects[focusId]) rects[focusId].setAttribute('tabindex', '-1');
      focusId = id; rects[id].setAttribute('tabindex', '0'); if (move) rects[id].focus();
    }
    function pick(id, quiet) {
      if (picked && rects[picked]) rects[picked].setAttribute('aria-pressed', 'false');
      picked = id;
      if (!id) { $('#pick-info').hidden = true; $('#pick-none').hidden = false; sight.classList.remove('on'); setParams({ seat: '' }); return; }
      var s = byId[id], c = CON[cid];
      rects[id].setAttribute('aria-pressed', 'true');
      $('#pick-none').hidden = true; $('#pick-info').hidden = false;
      $('#pick-name').textContent = s.floor + '층 ' + s.row + '열 ' + s.n + '번';
      $('#pick-axis').innerHTML = axisHtml([
        ['구역', s.zone + '석'], ['값', C.won(C.priceOf(c, s.zone))], ['무대까지 거리', s.dist.toFixed(1) + ' m'],
        ['시선 각도', Math.round(s.ang) + '°'], ['공연', C.md(c.date) + ' ' + c.time],
      ]);
      $('#pick-book').href = link('book', '?c=' + cid + '&seat=' + encodeURIComponent(id));
      if (!quiet) $('#pick-live').textContent = s.row + '열 ' + s.n + '번, ' + s.zone + '석, 무대까지 ' + s.dist.toFixed(1) + ' m';
      // 시선선
      var len = Math.sqrt(s.x * s.x + s.y * s.y);
      sight.classList.remove('on');
      sight.setAttribute('x2', s.x.toFixed(2)); sight.setAttribute('y2', s.y.toFixed(2));
      sight.style.setProperty('--len', len.toFixed(2));
      void sight.getBoundingClientRect();
      sight.classList.add('on');
      setParams({ c: cid, seat: id });
    }
    svg.addEventListener('click', function (e) {
      var r = e.target.closest('.seat'); if (!r) return;
      var id = r.dataset.seat; setFocus(id, false);
      if (sold[id]) { $('#pick-live').textContent = '이미 팔린 자리입니다.'; return; }
      pick(id);
    });
    function nearestIn(ri, x) {
      var row = rows[ri]; if (!row) return null;
      var best = null, bd = 1e9;
      row.forEach(function (s) { if (sold[s.id]) return; var d = Math.abs(s.x - x); if (d < bd) { bd = d; best = s; } });
      return best;
    }
    svg.addEventListener('keydown', function (e) {
      var r = e.target.closest('.seat'); if (!r) return;
      var s = byId[r.dataset.seat], row = rows[s.ri], next = null, i;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var d = e.key === 'ArrowRight' ? 1 : -1;
        for (i = s.n - 1 + d; i >= 0 && i < row.length; i += d) { if (!sold[row[i].id]) { next = row[i]; break; } }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        var dr = e.key === 'ArrowDown' ? 1 : -1;
        for (i = s.ri + dr; i >= 0 && i < D.ROWS.length && !next; i += dr) next = nearestIn(i, s.x);
      } else if (e.key === 'Home') { next = row.filter(function (x) { return !sold[x.id]; })[0]; }
      else if (e.key === 'End') { var av = row.filter(function (x) { return !sold[x.id]; }); next = av[av.length - 1]; }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!sold[s.id]) pick(s.id); return; }
      else return;
      e.preventDefault();
      if (next) setFocus(next.id, true);
    });
    sel.addEventListener('change', function () { cid = sel.value; setParams({ c: cid }); render(); });
    render();
    var want = params.get('seat');
    if (want && byId[want] && !sold[want]) { pick(want, true); setFocus(want, false); }
    else { var first = nearestIn(4, 0) || S.filter(function (s) { return !sold[s.id]; })[0]; setFocus(first.id, false); }
  }

  // ── 표: 환불 ──
  if (page === 'tickets') {
    var rc = $('#r-c'), rz = $('#r-z'), rq = $('#r-q'), rd = $('#r-d');
    var nextC = D.CONCERTS.filter(function (c) { return c.date > C.TODAY; })[0];
    rc.value = CON[params.get('c')] ? params.get('c') : nextC.id;
    function calc() {
      var c = CON[rc.value], q = +rq.value, z = rz.value;
      rz.disabled = c.price.length === 1;
      var err = '';
      if (!(q >= 1 && q <= 8) || q !== Math.floor(q)) err = '매수는 1~8 사이 정수로 입력하세요.';
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(rd.value)) err = '취소일을 고르세요.';
      var r = err ? null : C.refund(c, rd.value, q, z);
      if (r && r.error) err = r.error;
      rq.setAttribute('aria-invalid', String(/매수/.test(err)));
      rd.setAttribute('aria-invalid', String(!!err && !/매수/.test(err)));
      $('#r-err').hidden = !err; $('#r-err').textContent = err ? '확인 필요 — ' + err : '';
      $('#r-out').hidden = !!err;
      if (err) return;
      $('#r-back').textContent = '환불액 ' + C.won(r.back);
      $('#r-axis').innerHTML = axisHtml([['관람일까지', r.days + '일'], ['기준', r.label], ['표 값', C.won(r.total)], ['수수료', r.rate + ' % · ' + C.won(r.fee)]]);
    }
    [rc, rz, rq, rd].forEach(function (el) { el.addEventListener('input', calc); el.addEventListener('change', calc); });
    calc();
  }

  // ── 음향 ──
  if (page === 'acoustics') {
    var occ = $('#occ'), out = $('#occ-out'), form = $('#rtform');
    var q = params.get('occ'); if (q !== null && +q >= 0 && +q <= 100) occ.value = Math.round(+q / 5) * 5;
    if (params.get('curtain') === '1') form.curtain.value = '1';
    if (params.get('shell') === '0') form.shell.value = '0';
    var line = $('.rtline'), dots = $$('.rtdot'), vals = $$('.rtval');
    var W = 600, H = 300, P = 44, MAX = 2.6;
    function pts(arr) { return arr.map(function (v, i) { return [P + i * (W - 2 * P) / 5, H - P - v / MAX * (H - 2 * P)]; }); }
    var shown = null, raf = 0;
    function draw(arr) {
      var p = pts(arr);
      line.setAttribute('d', 'M' + p.map(function (x) { return x[0].toFixed(1) + ' ' + x[1].toFixed(1); }).join(' L'));
      p.forEach(function (x, i) { dots[i].setAttribute('cy', x[1].toFixed(1)); vals[i].setAttribute('y', (x[1] - 14).toFixed(1)); });
    }
    function run(write) {
      var o = +occ.value / 100, cu = form.curtain.value === '1', sh = form.shell.value === '1';
      var arr = C.rt(o, cu, sh);
      out.textContent = occ.value + ' %';
      $('#rt-mid').textContent = C.midRt(arr).toFixed(2);
      $$('#rt-bands dd').forEach(function (dd, i) { dd.textContent = arr[i].toFixed(2) + '초'; });
      vals.forEach(function (t, i) { t.textContent = arr[i].toFixed(2); });
      cancelAnimationFrame(raf);
      var from = shown || arr; shown = arr;
      if (reduce || from === arr) draw(arr);
      else {
        var t0 = performance.now();
        var tick = function (t) {
          var k = Math.min(1, (t - t0) / 320), e = 1 - Math.pow(1 - k, 3);
          draw(from.map(function (v, i) { return v + (arr[i] - v) * e; }));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }
      if (write) setParams({ occ: occ.value === '80' ? '' : occ.value, curtain: cu ? '1' : '', shell: sh ? '' : '0' });
    }
    occ.addEventListener('input', function () { run(true); });
    form.addEventListener('change', function () { run(true); });
    run(false);
  }

  // ── 무대 탭 ──
  if (page === 'stage') {
    var tabs = $$('[role="tab"]');
    function select(t, focus, write) {
      tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
      if (focus) t.focus();
      if (write) setParams({ set: t.id === 'tab-solo' ? '' : t.id.slice(4) });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false, true); });
      t.addEventListener('keydown', function (e) {
        var j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (j === undefined) return;
        e.preventDefault(); select(tabs[(j + tabs.length) % tabs.length], true, true);
      });
    });
    var want = $('#tab-' + params.get('set')); if (want) select(want, false, false);
  }

  // ── 대관 ──
  if (page === 'rental') {
    var form = $('#rent'), cal = $('#cal'), date = null;
    var months = [[2026, 10], [2026, 11], [2026, 12]];
    cal.innerHTML = months.map(function (ym) {
      var y = ym[0], m = ym[1], first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(), days = new Date(Date.UTC(y, m, 0)).getUTCDate();
      var cells = C.DOW.map(function (d) { return '<span class="dow" aria-hidden="true">' + d + '</span>'; }).join('');
      for (var i = 0; i < first; i++) cells += '<span></span>';
      for (var d = 1; d <= days; d++) {
        var s = y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0'), st = C.dayState(s);
        var label = C.md(s) + ', ' + { open: '빈 시간 있음', full: '마감', closed: '휴관', out: '고를 수 없음' }[st];
        cells += '<button type="button" data-date="' + s + '" class="' + st + '" aria-pressed="false" aria-label="' + label + '"' + (st === 'open' ? '' : ' disabled') + '>' + d + '</button>';
      }
      return '<div class="cal-month"><h3>' + m + '월</h3><div class="cal-grid">' + cells + '</div></div>';
    }).join('');
    function chosen(name) { return $$('input[name="' + name + '"]:checked', form).map(function (i) { return i.value; }); }
    function setDate(s) {
      date = s;
      $$('button[data-date]', cal).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.date === s)); });
      $('#rent-date').textContent = C.md(s) + (C.concertOn(s) ? ' · 저녁 공연 있음' : '');
      var booked = C.bookedBlocks(s);
      $$('input[name="block"]', form).forEach(function (i) {
        var off = booked.indexOf(i.value) > -1; i.disabled = off; if (off) i.checked = false;
        i.parentNode.classList.toggle('off', off);
        i.parentNode.title = off ? '예약된 시간' : '';
      });
      calc(true);
    }
    cal.addEventListener('click', function (e) { var b = e.target.closest('button[data-date]'); if (b && !b.disabled) setDate(b.dataset.date); });
    function calc(write) {
      var blocks = chosen('block'), err = '';
      if (!date) err = '달력에서 날짜를 고르세요.';
      else if (!blocks.length) err = '시간대를 하나 이상 고르세요.';
      var ex = +$('#extra').value;
      if (!err && (!(ex >= 0 && ex <= 6) || ex !== Math.floor(ex))) err = '추가 리허설은 0~6시간 사이 정수로 입력하세요.';
      $('#extra').setAttribute('aria-invalid', String(/리허설/.test(err)));
      $('#rent-err').textContent = err;
      $('#rent-out').hidden = !!err;
      var kind = form.kind.value, inst = chosen('inst'), rec = $('#rec').checked, np = $('#np').checked;
      if (write) setParams({ kind: kind === 'concert' ? '' : kind, date: date || '', blocks: blocks.join(','), extra: ex > 0 ? ex : '', inst: inst.join(','), rec: rec ? '1' : '', np: np ? '1' : '' });
      if (err) return;
      var r = C.rental({ kind: kind, date: date, blocks: blocks, extra: ex, inst: inst, rec: rec, np: np });
      $('#rent-total').textContent = '합계 ' + C.won(r.total);
      $('#rent-lines').innerHTML = axisHtml(r.lines.map(function (l) { return [esc(l[0]), C.won(l[1])]; }).concat([['공급가', C.won(r.supply)], ['부가세 10 %', C.won(r.vat)]]));
      var kn = D.RENT_KINDS.filter(function (k) { return k[0] === kind; })[0][1];
      var bn = blocks.map(function (b) { return D.BLOCKS.filter(function (x) { return x[0] === b; })[0][1]; }).join('·');
      $('#rent-book').href = link('book', '?type=rent&rent=' + encodeURIComponent(kn + ' · ' + C.md(date) + ' ' + bn + ' · ' + C.won(r.total)));
    }
    form.addEventListener('change', function () { calc(true); });
    $('#extra').addEventListener('input', function () { calc(true); });
    // 주소 복원
    var k = params.get('kind'); if (k && D.RENT_KINDS.some(function (x) { return x[0] === k; })) form.kind.value = k;
    var ins = (params.get('inst') || '').split(','); $$('input[name="inst"]', form).forEach(function (i) { i.checked = ins.indexOf(i.value) > -1; });
    $('#rec').checked = params.get('rec') === '1'; $('#np').checked = params.get('np') === '1';
    if (params.get('extra')) $('#extra').value = params.get('extra');
    var pd = params.get('date');
    if (pd && C.dayState(pd) === 'open') {
      var bl = (params.get('blocks') || '').split(',');
      setDate(pd);
      $$('input[name="block"]', form).forEach(function (i) { if (!i.disabled) i.checked = bl.indexOf(i.value) > -1; });
      calc(false);
    } else calc(false);
  }

  // ── 신청 ──
  if (page === 'book') {
    var form = $('#book'), sum = $('#errsum'), done = $('#done');
    var fT = $('#f-ticket'), fR = $('#f-rent');
    function typeSync() { var t = form.type.value; fT.hidden = t !== 'ticket'; fR.hidden = t !== 'rent'; }
    if (params.get('type') === 'rent') form.type.value = 'rent';
    if (CON[params.get('c')]) $('#b-c').value = params.get('c');
    if (params.get('seat')) $('#b-seat').value = params.get('seat');
    if (params.get('rent')) $('#b-rent').textContent = params.get('rent');
    var seatLink = function () { $('#b-seat-link').href = link('seats', '?c=' + $('#b-c').value); };
    $('#b-c').addEventListener('change', seatLink); seatLink();
    form.addEventListener('change', function (e) { if (e.target.name === 'type') typeSync(); });
    typeSync();
    function fieldErr(el, msg) {
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      var p = el.closest('.field'), old = $('.ferr', p); if (old) old.remove();
      if (msg) { var s = document.createElement('span'); s.className = 'ferr'; s.id = el.id + '-err'; s.textContent = msg; p.appendChild(s); el.setAttribute('aria-describedby', s.id); }
      else if (el.id === 'b-seat') el.setAttribute('aria-describedby', 'b-seat-h'); else el.removeAttribute('aria-describedby');
    }
    function validate() {
      var errs = [], t = form.type.value;
      var name = $('#b-name'), tel = $('#b-tel'), agree = $('#b-agree');
      var checks = [[name, name.value.trim().length < 2 ? '이름을 두 글자 이상 입력하세요.' : '']];
      checks.push([tel, !/^01[016789]-?\d{3,4}-?\d{4}$/.test(tel.value.trim()) ? '휴대전화 번호를 010-0000-0000 형식으로 입력하세요.' : '']);
      if (t === 'ticket') {
        var q = $('#b-q'), seat = $('#b-seat');
        checks.push([q, !(+q.value >= 1 && +q.value <= 8 && +q.value === Math.floor(+q.value)) ? '매수는 1~8 사이 정수로 입력하세요.' : '']);
        var sv = seat.value.trim(), sm = '';
        if (sv) {
          var st = C.seats().filter(function (s) { return s.id === sv.toUpperCase() || s.id === sv; })[0];
          if (!st) sm = '배치도에 없는 좌석입니다.';
          else if (C.soldSet(CON[$('#b-c').value])[st.id]) sm = '이미 팔린 좌석입니다.';
        }
        checks.push([seat, sm]);
      } else {
        var org = $('#b-org');
        checks.push([org, org.value.trim().length < 2 ? '단체 이름을 입력하세요.' : '']);
      }
      checks.push([agree, !agree.checked ? '수집에 동의해야 접수할 수 있습니다.' : '']);
      checks.forEach(function (c) { fieldErr(c[0], c[1]); if (c[1]) errs.push(c); });
      return errs;
    }
    var cf = $('#confirm'), cd = dialog(cf, [$('#c-close'), $('#c-back')]);
    function summary() {
      var t = form.type.value, rows = [['종류', t === 'ticket' ? '공연 예매' : '대관']];
      if (t === 'ticket') {
        var c = CON[$('#b-c').value], q = +$('#b-q').value, seat = $('#b-seat').value.trim().toUpperCase();
        var st = seat ? C.seats().filter(function (s) { return s.id === seat || s.id === $('#b-seat').value.trim(); })[0] : null;
        var each = C.priceOf(c, st ? st.zone : 'R'), disc = +$('#b-d').value || 0;
        rows.push(['공연', C.md(c.date) + ' ' + esc(c.title)], ['좌석', st ? st.floor + '층 ' + st.row + '열 ' + st.n + '번 · ' + st.zone + '석' : '매표소 배정(R석 값 기준)'], ['매수', q + '매'], ['값', C.won(each * q * (100 - disc) / 100) + (disc ? ' · 할인 ' + disc + ' %' : '')]);
      } else {
        rows.push(['단체', esc($('#b-org').value.trim())], ['대관 내용', esc($('#b-rent').textContent)]);
      }
      rows.push(['이름', esc($('#b-name').value.trim())], ['휴대전화', esc($('#b-tel').value.trim())]);
      return rows;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errs = validate();
      if (errs.length) {
        sum.hidden = false; $('#errn').textContent = errs.length;
        $('#errlist').innerHTML = errs.map(function (c) { return '<li><a href="#' + c[0].id + '">' + c[1] + '</a></li>'; }).join('');
        sum.focus(); return;
      }
      sum.hidden = true;
      $('#c-axis').innerHTML = axisHtml(summary());
      cd.open(e.submitter || $('button[type="submit"]', form));
    });
    $('#errlist').addEventListener('click', function (e) { var a = e.target.closest('a'); if (!a) return; e.preventDefault(); var el = $(a.getAttribute('href')); el.focus(); });
    $('#c-ok').addEventListener('click', function () {
      var rows = summary();
      cf.close();
      form.closest('.panel').hidden = true; done.hidden = false;
      var no = 'NU-' + (1012 * 7 + $('#b-name').value.trim().length * 131 + $('#b-tel').value.replace(/\D/g, '').slice(-4) * 1);
      $('#done-no').textContent = '접수 번호 ' + no;
      $('#done-axis').innerHTML = axisHtml(rows);
      done.focus();
    });
    $('#again').addEventListener('click', function () { done.hidden = true; form.closest('.panel').hidden = false; $('#b-name').focus(); });
  }

  // ── 자주 묻는 것 ──
  if (page === 'faq') {
    var chips = $$('.chip'), qs = $$('.faq details');
    function cat(v, write) {
      chips.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.cat === v)); });
      qs.forEach(function (d) { d.hidden = !!v && d.dataset.cat !== v; });
      if (write) setParams({ cat: v });
    }
    chips.forEach(function (b) { b.addEventListener('click', function () { cat(b.dataset.cat, true); }); });
    qs.forEach(function (d) { d.addEventListener('toggle', function () { var open = qs.filter(function (x) { return x.open; }).map(function (x) { return x.id.slice(1); }); setParams({ open: open.join(',') }); }); });
    var pc = params.get('cat'); if (pc && D.FAQ_CATS.some(function (c) { return c[0] === pc; })) cat(pc, false);
    (params.get('open') || '').split(',').forEach(function (n) { var d = $('#q' + n); if (d) d.open = true; });
  }
})();
