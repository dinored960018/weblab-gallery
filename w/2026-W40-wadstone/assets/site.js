// Wadstone Pottery — 메뉴 · 장바구니 · 유약 고르기 · 배치 계산 · 가마 달력 · 좌석 예약 · 물레
(function () {
  'use strict';
  var WS = window.WS || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var gbp = function (n) { return '£' + (Math.round(n * 100) % 100 ? n.toFixed(2) : String(Math.round(n))); };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var dt = function (iso) { return new Date(iso + 'T12:00:00Z'); };
  var dShort = function (iso) { var d = dt(iso); return DAYS[d.getUTCDay()].slice(0, 3) + ' ' + d.getUTCDate() + ' ' + MON[d.getUTCMonth()].slice(0, 3); };
  var dLong = function (iso) { var d = dt(iso); return DAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; };
  var announce = function (msg) { var el = $('[data-announce]'); if (!el) return; el.textContent = ''; setTimeout(function () { el.textContent = msg; }, 30); };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- 저장 (막히면 메모리) ----------
  var memory = {};
  var store = {
    get: function (k) { try { var v = window.localStorage.getItem(k); return v ? JSON.parse(v) : memory[k] || null; } catch (e) { return memory[k] || null; } },
    set: function (k, v) { memory[k] = v; try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 메모리만 */ } },
  };

  // ---------- 모바일 메뉴 ----------
  var menuBtn = $('.menu-btn'), nav = $('#nav');
  function closeMenu(focusBtn) {
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'Menu';
    document.documentElement.classList.remove('lock');
    if (focusBtn) menuBtn.focus();
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      if (nav.classList.contains('open')) { closeMenu(false); return; }
      document.documentElement.style.setProperty('--top-h', $('.top').getBoundingClientRect().bottom + 'px');
      nav.classList.add('open'); menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.textContent = 'Close';
      document.documentElement.classList.add('lock');
      var first = nav.querySelector('a'); if (first) first.focus();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(true); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 980) closeMenu(false); });
  }

  // ---------- 장바구니 ----------
  var CART = 'wadstone-cart';
  var cart = store.get(CART) || { items: [], ship: 'collect' };
  var drawer = $('#cart-drawer');
  var lastOpener = null;
  function itemInfo(it) {
    var p = WS.products[it.p]; if (!p) return null;
    var g = WS.glazes[it.g] || WS.sets[it.g];
    return { name: p.name, size: p.size, price: p.price, glaze: g ? g.name : it.g, color: g ? g.c : '#ccc' };
  }
  function saveCart() { store.set(CART, cart); renderCart(); }
  function cartCount() { return cart.items.reduce(function (s, i) { return s + i.q; }, 0); }
  function renderCart() {
    $$('[data-cart-count]').forEach(function (el) { el.textContent = cartCount(); });
    if (!drawer) return;
    var list = $('[data-drawer-list]', drawer);
    var html = '';
    var sub = 0;
    cart.items.forEach(function (it, i) {
      var info = itemInfo(it); if (!info) return;
      sub += info.price * it.q;
      html += '<li data-i="' + i + '"><span class="sw-tile" style="background:' + info.color + '" aria-hidden="true"></span>' +
        '<div><span class="dl-name">' + info.name + '</span><br><span class="dl-sub">' + info.glaze + ' · ' + info.size + '</span></div>' +
        '<span class="dl-price">' + gbp(info.price * it.q) + '</span>' +
        '<div class="dl-ctl"><button type="button" data-q="-1" aria-label="One fewer ' + info.name + ', ' + info.glaze + '">−</button>' +
        '<output aria-label="Quantity">' + it.q + '</output>' +
        '<button type="button" data-q="1" aria-label="One more ' + info.name + ', ' + info.glaze + '">+</button>' +
        '<button type="button" data-remove aria-label="Remove ' + info.name + ', ' + info.glaze + '">Remove</button></div></li>';
    });
    list.innerHTML = html;
    var empty = !cart.items.length;
    $('[data-drawer-empty]', drawer).hidden = !empty;
    $('[data-drawer-foot]', drawer).hidden = empty;
    var ship = cart.items.length ? (WS.shipping[cart.ship] || 0) : 0;
    $('[data-drawer-total]', drawer).textContent = gbp(sub + ship);
    $$('input[name="ship"]', drawer).forEach(function (r) { r.checked = r.value === cart.ship; });
  }
  function openDrawer(opener) {
    if (!drawer) return;
    lastOpener = opener || document.activeElement;
    $('[data-checkout-note]', drawer).textContent = '';
    if (typeof drawer.showModal === 'function') drawer.showModal(); else drawer.setAttribute('open', '');
    document.documentElement.classList.add('lock');
  }
  function closeDrawer() { if (drawer.open) drawer.close(); }
  if (drawer) {
    drawer.addEventListener('close', function () {
      document.documentElement.classList.remove('lock');
      if (lastOpener && document.contains(lastOpener)) lastOpener.focus();
    });
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) { closeDrawer(); return; }
      if (e.target.closest('[data-drawer-close]')) { closeDrawer(); return; }
      var li = e.target.closest('li[data-i]');
      if (li) {
        var i = Number(li.getAttribute('data-i'));
        var q = e.target.closest('[data-q]');
        if (q) {
          var it = cart.items[i];
          it.q = Math.max(1, Math.min(9, it.q + Number(q.getAttribute('data-q'))));
          saveCart();
          var again = $('li[data-i="' + i + '"] [data-q="' + q.getAttribute('data-q') + '"]', drawer); if (again) again.focus();
          return;
        }
        if (e.target.closest('[data-remove]')) {
          var name = itemInfo(cart.items[i]).name;
          cart.items.splice(i, 1); saveCart();
          var nextRm = $$('[data-remove]', drawer)[Math.min(i, cart.items.length - 1)];
          if (nextRm) nextRm.focus(); else $('[data-drawer-close]', drawer).focus();
          announce(name + ' removed from the cart.');
          return;
        }
      }
      if (e.target.closest('[data-checkout]')) {
        $('[data-checkout-note]', drawer).textContent = 'Checkout is not connected. Practice site: nothing is sold, nothing was stored or charged.';
      }
    });
    drawer.addEventListener('change', function (e) { if (e.target.name === 'ship') { cart.ship = e.target.value; saveCart(); } });
  }
  $$('[data-cart-open]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(b); }); });

  // 상점: 유약 고르면 그림이 바뀜 · 담기
  $$('.prod').forEach(function (prod) {
    prod.addEventListener('change', function (e) {
      if (!e.target.matches('input[type="radio"]')) return;
      $$('[data-art-for]', prod).forEach(function (a) { a.hidden = a.getAttribute('data-art-for') !== e.target.value; });
    });
    var add = $('[data-add]', prod);
    add.addEventListener('click', function () {
      var p = add.getAttribute('data-add');
      var g = $('input[type="radio"]:checked', prod).value;
      var found = cart.items.filter(function (x) { return x.p === p && x.g === g; })[0];
      if (found) found.q = Math.min(9, found.q + 1); else cart.items.push({ p: p, g: g, q: 1 });
      saveCart();
      var info = itemInfo({ p: p, g: g });
      announce(info.name + ' in ' + info.glaze + ' added. ' + cartCount() + ' in the cart.');
      openDrawer(add);
    });
  });
  if (location.hash) { var target = document.getElementById(location.hash.slice(1)); if (target && target.classList.contains('prod')) target.querySelector('input').focus({ preventScroll: true }); }
  renderCart();

  // ---------- 유약 고르기 ----------
  var filters = $('[data-filters]');
  if (filters) {
    var tiles = $$('[data-wall] .tile');
    var state = { family: [], finish: [], cone: [], food: [] };
    var groups = Object.keys(state);
    var chips = $$('.chip', filters);
    var match = function (t, skip) {
      return groups.every(function (k) {
        if (k === skip || !state[k].length) return true;
        return state[k].indexOf(t.getAttribute('data-' + k)) > -1;
      });
    };
    var apply = function (fromUser) {
      var shown = 0;
      tiles.forEach(function (t) { var ok = match(t); t.hidden = !ok; if (ok) shown++; });
      chips.forEach(function (c) {
        var k = c.getAttribute('data-f'), v = c.getAttribute('data-v');
        c.setAttribute('aria-pressed', state[k].indexOf(v) > -1 ? 'true' : 'false');
        var n = tiles.filter(function (t) { return t.getAttribute('data-' + k) === v && match(t, k); }).length;
        c.querySelector('[data-n]').textContent = n;
      });
      $('[data-result]').textContent = 'Showing ' + shown + ' of ' + tiles.length + ' glazes';
      $('[data-empty]').hidden = shown > 0;
      $('[data-wall]').hidden = shown === 0;
      if (fromUser) {
        var q = new URLSearchParams();
        groups.forEach(function (k) { if (state[k].length) q.set(k, state[k].join(',')); });
        var s = q.toString();
        history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
      }
    };
    var params = new URLSearchParams(location.search);
    groups.forEach(function (k) {
      var v = params.get(k); if (!v) return;
      var valid = chips.filter(function (c) { return c.getAttribute('data-f') === k; }).map(function (c) { return c.getAttribute('data-v'); });
      state[k] = v.split(',').filter(function (x) { return valid.indexOf(x) > -1; });
    });
    filters.addEventListener('click', function (e) {
      var c = e.target.closest('.chip'); if (!c) return;
      var k = c.getAttribute('data-f'), v = c.getAttribute('data-v');
      var i = state[k].indexOf(v);
      if (i > -1) state[k].splice(i, 1); else state[k].push(v);
      apply(true);
    });
    $$('[data-clear]').forEach(function (b) {
      b.addEventListener('click', function () {
        groups.forEach(function (k) { state[k] = []; });
        apply(true);
        chips[0].focus();
      });
    });
    apply(false);
  }

  // ---------- 배치 계산 ----------
  var batch = $('[data-batch]');
  if (batch) {
    var recipe = $('[data-recipe]');
    var calc = function () {
      var g = Number(batch.value);
      var msg = $('[data-batch-msg]');
      if (!(g >= 100 && g <= 20000)) { msg.textContent = 'Enter 100 to 20,000 grams.'; batch.setAttribute('aria-invalid', 'true'); return; }
      msg.textContent = ''; batch.removeAttribute('aria-invalid');
      var total = 0;
      $$('[data-g]', recipe).forEach(function (td) { var v = Number(td.getAttribute('data-g')) * g / 100; total += v; td.textContent = v.toFixed(1); });
      $('[data-total]', recipe).textContent = total.toFixed(1);
    };
    batch.addEventListener('input', calc);
  }

  // ---------- 가마 달력 ----------
  var cal = $('[data-cal]');
  if (cal) {
    var months = $$('.month', cal);
    var cur = 0;
    var prevB = $('[data-cal-prev]', cal), nextB = $('[data-cal-next]', cal);
    var hidden = {};
    var showMonth = function (i) {
      cur = i;
      months.forEach(function (m, j) { m.hidden = j !== i; });
      prevB.disabled = i === 0; nextB.disabled = i === months.length - 1;
    };
    prevB.addEventListener('click', function () { showMonth(Math.max(0, cur - 1)); (prevB.disabled ? nextB : prevB).focus(); });
    nextB.addEventListener('click', function () { showMonth(Math.min(months.length - 1, cur + 1)); (nextB.disabled ? prevB : nextB).focus(); });
    var refreshEmpty = function () {
      $$('.day', cal).forEach(function (d) {
        if (d.classList.contains('pad')) return;
        var evs = $$('.ev[data-type]', d);
        var visible = evs.filter(function (e) { return !hidden[e.getAttribute('data-type')]; }).length;
        var closed = d.classList.contains('closed');
        d.classList.toggle('empty', !visible && !closed);
        $('.day-btn', d).setAttribute('tabindex', visible || closed ? '0' : '-1');
      });
    };
    $$('[data-kiln]', cal).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-kiln');
        hidden[k] = !hidden[k];
        b.setAttribute('aria-pressed', hidden[k] ? 'false' : 'true');
        cal.classList.toggle('hide-' + k, hidden[k]);
        refreshEmpty();
        var sel = $('.day.sel', cal); if (sel) detail(sel.getAttribute('data-date'));
      });
    });
    var detailBox = $('[data-cal-detail]', cal);
    var verbs = { load: 'Load', fire: 'Fires', collect: 'Collect' };
    var detail = function (iso) {
      var rows = [];
      WS.firings.forEach(function (f) {
        if (hidden[f.type]) return;
        ['load', 'fire', 'collect'].forEach(function (kind) { if (f[kind] === iso) rows.push({ kind: kind, f: f }); });
      });
      var closed = iso >= WS.closed.from && iso <= WS.closed.to;
      $('[data-cal-dh]', detailBox).textContent = dLong(iso) + (iso === WS.today ? ', today' : '');
      var html = '';
      rows.forEach(function (r) {
        var k = WS.kilns[r.f.type];
        var lead = r.kind === 'load' ? 'Load day: shelf closes at 17:00' : r.kind === 'fire' ? 'Firing day: kiln closed' : 'Collection day: from 14:00';
        html += '<div class="cd-ev"><h3><span class="sw sw-' + k.color + '" aria-hidden="true"></span>' + k.label + ' ' + r.f.id + '</h3>' +
          '<p>' + lead + '</p><dl class="facts">' +
          '<div><dt>Kiln</dt><dd>' + k.kiln + ', ' + k.cone + '</dd></div>' +
          '<div><dt>Load by</dt><dd>' + dShort(r.f.load) + ', 17:00</dd></div>' +
          '<div><dt>Fires</dt><dd>' + dShort(r.f.fire) + '</dd></div>' +
          '<div><dt>Collect from</dt><dd>' + dShort(r.f.collect) + ', 14:00</dd></div>' +
          '<div><dt>Shelf space</dt><dd>' + r.f.shelf + '</dd></div></dl></div>';
      });
      if (closed) html += '<p>' + WS.closed.note + '</p>';
      if (!rows.length && !closed) html = '<p>No firing on this day' + (Object.keys(hidden).some(function (k) { return hidden[k]; }) ? ' among the kilns shown.' : '.') + '</p>';
      $('[data-cal-body]', detailBox).innerHTML = html;
    };
    cal.addEventListener('click', function (e) {
      var btn = e.target.closest('.day-btn'); if (!btn) return;
      var day = btn.closest('.day');
      if (day.classList.contains('empty')) return;
      $$('.day.sel', cal).forEach(function (d) { d.classList.remove('sel'); $('.day-btn', d).setAttribute('aria-pressed', 'false'); });
      day.classList.add('sel'); btn.setAttribute('aria-pressed', 'true');
      detail(day.getAttribute('data-date'));
      if (window.innerWidth <= 1180) detailBox.focus({ preventScroll: false });
    });
    showMonth(0);
  }

  // ---------- 좌석 예약 ----------
  var form = $('[data-book]');
  if (form) {
    var cls = WS.classes[form.getAttribute('data-book')];
    var seats = $('#seats', form);
    var msgEl = $('[data-seatmsg]', form);
    var submit = $('[data-submit]', form);
    var chosen = function () {
      var r = $('input[name="date"]:checked', form); if (!r) return null;
      return cls.dates.filter(function (d) { return d.id === r.value; })[0];
    };
    var mode = function () {
      var d = chosen(); var n = Number(seats.value) || 1;
      if (!d) return { kind: 'none', n: n };
      var left = cls.seats - d.booked;
      if (left <= 0) return { kind: 'wait', n: n, d: d, left: 0, pos: d.wait + 1 };
      if (n > left) return { kind: 'over', n: n, d: d, left: left, pos: d.wait + 1 };
      return { kind: 'book', n: n, d: d, left: left };
    };
    var update = function () {
      var n = Math.max(1, Math.min(4, Math.round(Number(seats.value) || 1)));
      if (String(n) !== seats.value) seats.value = n;
      var m = mode();
      msgEl.classList.toggle('warn', m.kind === 'wait' || m.kind === 'over');
      var s = function (x) { return x + ' seat' + (x > 1 ? 's' : ''); };
      if (m.kind === 'none') { msgEl.textContent = 'Choose a date first.'; submit.textContent = 'Book ' + s(m.n); }
      else if (m.kind === 'book') { msgEl.textContent = s(m.n) + ' × ' + gbp(cls.price) + ' = ' + gbp(m.n * cls.price) + '. ' + (m.left - m.n) + ' left after this booking.'; submit.textContent = 'Book ' + s(m.n) + ', ' + gbp(m.n * cls.price); }
      else if (m.kind === 'over') { msgEl.textContent = 'Only ' + s(m.left) + ' left on this date. Choose ' + m.left + ' or fewer to book, or join the waiting list for ' + s(m.n) + ' as number ' + m.pos + '.'; submit.textContent = 'Join the waiting list'; }
      else { msgEl.textContent = 'This date is full. You would be number ' + m.pos + ' on the waiting list for ' + s(m.n) + '. Nothing is charged until a seat opens.'; submit.textContent = 'Join the waiting list'; }
    };
    $$('[data-step]', form).forEach(function (b) {
      b.addEventListener('click', function () { seats.value = Math.max(1, Math.min(4, (Number(seats.value) || 1) + Number(b.getAttribute('data-step')))); update(); });
    });
    seats.addEventListener('change', update);
    form.addEventListener('change', function (e) { if (e.target.name === 'date') { clearErr('date'); update(); } });
    var pre = new URLSearchParams(location.search).get('date');
    if (pre) { var r0 = $('input[name="date"][value="' + pre + '"]', form); if (r0) r0.checked = true; }
    update();

    var errSum = $('[data-errsum]', form), done = $('[data-done]', form);
    var setErr = function (k, msg) {
      var p = $('#e-' + k, form); p.textContent = msg; p.hidden = false;
      var input = k === 'date' ? null : form.elements[k];
      if (input) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', 'e-' + k); }
    };
    var clearErr = function (k) {
      var p = $('#e-' + k, form); if (p) { p.hidden = true; p.textContent = ''; }
      var input = k === 'date' ? null : form.elements[k];
      if (input) { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
    };
    ['name', 'email', 'phone', 'level', 'terms'].forEach(function (k) { form.elements[k].addEventListener('input', function () { clearErr(k); }); form.elements[k].addEventListener('change', function () { clearErr(k); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      done.hidden = true;
      var errs = [];
      ['date', 'name', 'email', 'phone', 'level', 'terms'].forEach(clearErr);
      var el = form.elements;
      if (!chosen()) errs.push(['date', 'Choose a date.', 'input[name="date"]']);
      if (!el.name.value.trim()) errs.push(['name', 'Enter your name.', '#name']);
      if (!el.email.value.trim()) errs.push(['email', 'Enter your email address.', '#email']);
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.email.value.trim())) errs.push(['email', 'Enter an email address like name@example.com.', '#email']);
      if (el.phone.value.trim() && el.phone.value.replace(/\D/g, '').length < 10) errs.push(['phone', 'Enter a phone number with at least 10 digits, or leave it empty.', '#phone']);
      if (!el.level.value) errs.push(['level', 'Choose your clay experience.', '#level']);
      if (!el.terms.checked) errs.push(['terms', 'Tick the box to confirm you have read the cancellation terms.', 'input[name="terms"]']);
      if (errs.length) {
        errs.forEach(function (x) { setErr(x[0], x[1]); });
        errSum.innerHTML = '<h3>' + errs.length + (errs.length > 1 ? ' things' : ' thing') + ' to fix</h3><ul>' + errs.map(function (x) { return '<li><a href="#e-' + x[0] + '" data-go="' + x[2] + '">' + x[1] + '</a></li>'; }).join('') + '</ul>';
        errSum.hidden = false; errSum.focus();
        return;
      }
      errSum.hidden = true;
      var m = mode();
      var what = m.kind === 'book'
        ? m.n + ' seat' + (m.n > 1 ? 's' : '') + ' on ' + cls.name + ', starting ' + dLong(m.d.start) + '. Total ' + gbp(m.n * cls.price) + '.'
        : 'Waiting list for ' + m.n + ' seat' + (m.n > 1 ? 's' : '') + ' on ' + cls.name + ', starting ' + dLong(m.d.start) + '. You would be number ' + m.pos + '.';
      done.innerHTML = '<h3>' + (m.kind === 'book' ? 'Booking not sent' : 'Waiting list request not sent') + '</h3><p>' + what + '</p><p>Practice site. No booking system is connected; nothing was stored, sent or charged.</p>';
      done.hidden = false; done.focus();
    });
    errSum.addEventListener('click', function (e) {
      var a = e.target.closest('[data-go]'); if (!a) return;
      e.preventDefault();
      var t = $(a.getAttribute('data-go'), form); if (t) t.focus();
    });
  }

  // ---------- 물레 ----------
  var wheel = $('[data-wheel]'), wbtn = $('[data-wheel-toggle]');
  if (wheel && wbtn) {
    if (reduced) { wbtn.hidden = true; }
    wbtn.addEventListener('click', function () {
      var paused = wheel.classList.toggle('paused');
      wbtn.textContent = paused ? 'Start the wheel' : 'Stop the wheel';
    });
  }
})();
