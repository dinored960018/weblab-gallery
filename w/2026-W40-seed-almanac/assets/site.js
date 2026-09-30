/* The Seed Almanac — menu, basket, catalogue filter, sowing calendar, borrow form. */
(function () {
  'use strict';
  var DATA = window.SA_VARIETIES || {};
  var LIMIT = window.SA_LIMIT || 5;
  var KEY = 'seedAlmanac.basket.v1';
  var MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var root = document.documentElement;
  var script = document.currentScript || document.querySelector('script[src$="assets/site.js"]');
  var BASE = script ? script.src.replace(/assets\/site\.js.*$/, '') : '';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  // ---------- toast ----------
  var toastEl = $('[data-toast]'), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.textContent = ''; }, 3200);
  }

  // ---------- mobile menu ----------
  var toggle = $('.nav-toggle'), list = $('#nav-list');
  function setMenu(open, focusBack) {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    list.classList.toggle('open', open);
    root.classList.toggle('menu-open', open);
    toggle.textContent = open ? 'Close' : 'Sections';
    if (open) { var a = $('a', list); if (a) a.focus(); }
    else if (focusBack) toggle.focus();
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    $$('a', list).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860 && list.classList.contains('open')) setMenu(false); });
  }

  // ---------- basket ----------
  var memory = [];
  function load() {
    var a = memory;
    try { var raw = localStorage.getItem(KEY); if (raw) a = JSON.parse(raw); } catch (e) { /* storage blocked */ }
    if (!Array.isArray(a)) a = [];
    return a.filter(function (s, i) { return DATA[s] && DATA[s].stock > 0 && a.indexOf(s) === i; }).slice(0, LIMIT);
  }
  function save(a) {
    memory = a.slice();
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) { /* storage blocked */ }
    render();
  }
  function label(s) { var d = DATA[s]; return d.name + ' ‘' + d.variety + '’'; }
  function item(s, withLink) {
    var d = DATA[s];
    var li = document.createElement('li');
    var sw = document.createElement('span'); sw.className = 'swatch pk-' + d.pk; sw.setAttribute('aria-hidden', 'true');
    var box = document.createElement('div');
    var name = document.createElement(withLink ? 'a' : 'span'); name.className = 'name'; name.textContent = label(s);
    if (withLink) name.href = BASE + 'varieties/' + s + '/index.html';
    var meta = document.createElement('span'); meta.className = 'meta'; meta.textContent = 'No. ' + d.no + ' · sow ' + d.sow;
    box.appendChild(name); box.appendChild(meta);
    var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'btn btn-quiet'; rm.textContent = 'Remove';
    rm.setAttribute('aria-label', 'Remove ' + label(s));
    rm.addEventListener('click', function () {
      var parent = li.parentNode;
      var idx = Array.prototype.indexOf.call(parent.children, li);
      save(load().filter(function (x) { return x !== s; }));
      toast('Removed ' + label(s) + '. ' + load().length + ' of ' + LIMIT + '.');
      // keep focus on the row that took this one's place, or the container
      var btns = $$('button', parent);
      if (btns.length) btns[Math.min(btns.length - 1, idx)].focus();
      else { var d = parent.closest('dialog'); var f = d ? $('[data-close]', d) : $('#f-name'); if (f) f.focus(); }
    });
    li.appendChild(sw); li.appendChild(box); li.appendChild(rm);
    return li;
  }
  function render() {
    var a = load();
    $$('[data-basket-count]').forEach(function (el) { el.textContent = a.length; });
    $$('.basket-btn').forEach(function (b) { b.setAttribute('aria-label', 'Basket, ' + a.length + ' of ' + LIMIT + ' packets'); });
    $$('[data-add]').forEach(function (b) { b.setAttribute('aria-pressed', String(a.indexOf(b.getAttribute('data-add')) > -1)); });
    [['[data-basket-list]', '[data-basket-empty]', true], ['[data-borrow-list]', '[data-borrow-empty]', true]].forEach(function (p) {
      var ul = $(p[0]); if (!ul) return;
      ul.innerHTML = '';
      a.forEach(function (s) { ul.appendChild(item(s, p[2])); });
      var empty = $(p[1]); if (empty) empty.hidden = a.length > 0;
    });
    var go = $('[data-basket-go]'); if (go) go.hidden = a.length === 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-add]');
    if (!b) return;
    var s = b.getAttribute('data-add'), a = load(), i = a.indexOf(s);
    if (i > -1) { a.splice(i, 1); save(a); toast('Removed ' + label(s) + '. ' + a.length + ' of ' + LIMIT + '.'); return; }
    if (a.length >= LIMIT) { toast('Basket full: ' + LIMIT + ' of ' + LIMIT + ' packets. Remove one to add another.'); return; }
    a.push(s); save(a); toast('Added ' + label(s) + '. ' + a.length + ' of ' + LIMIT + '.');
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY) render(); });

  // drawer
  var drawer = $('#basket'), opener = null;
  $$('.basket-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!drawer || !drawer.showModal) return;
      opener = b; render();
      drawer.showModal(); root.classList.add('drawer-open');
      var f = $('[data-close]', drawer); if (f) f.focus();
    });
  });
  if (drawer) {
    drawer.addEventListener('close', function () { root.classList.remove('drawer-open'); if (opener) opener.focus(); });
    drawer.addEventListener('click', function (e) { if (e.target === drawer) drawer.close(); });
    $('[data-close]', drawer).addEventListener('click', function () { drawer.close(); });
  }
  render();

  // ---------- catalogue filter ----------
  var filters = $('[data-filters]');
  if (filters) {
    var entries = $$('.entry');
    var chips = $$('.chip', filters);
    var state = { month: null, sun: null, save: null };
    var countEl = $('[data-count]'), emptyEl = $('[data-empty]');
    var match = function (el, st) {
      if (st.month && (' ' + el.getAttribute('data-sow') + ' ').indexOf(' ' + st.month + ' ') < 0) return false;
      if (st.sun && el.getAttribute('data-sun') !== st.sun) return false;
      if (st.save && el.getAttribute('data-save') !== st.save) return false;
      return true;
    };
    var apply = function (push) {
      var shown = 0;
      entries.forEach(function (el) { var ok = match(el, state); el.hidden = !ok; if (ok) shown++; });
      chips.forEach(function (c) {
        var f = c.getAttribute('data-f'), v = c.getAttribute('data-v');
        var st = { month: state.month, sun: state.sun, save: state.save }; st[f] = v;
        var n = entries.filter(function (el) { return match(el, st); }).length;
        c.querySelector('[data-n]').textContent = n;
        c.setAttribute('aria-pressed', String(state[f] === v));
      });
      var parts = [];
      if (state.month) parts.push('sow in ' + MONTH[state.month - 1]);
      if (state.sun) parts.push($('.chip[data-f="sun"][data-v="' + state.sun + '"]').firstChild.textContent.trim().toLowerCase());
      if (state.save) parts.push(state.save + ' to save');
      countEl.textContent = 'Showing ' + shown + ' of ' + entries.length + (parts.length ? ' · ' + parts.join(' · ') : '');
      emptyEl.hidden = shown > 0;
      if (push) {
        var q = [];
        ['month', 'sun', 'save'].forEach(function (k) { if (state[k]) q.push(k + '=' + state[k]); });
        try { history.replaceState(null, '', location.pathname + (q.length ? '?' + q.join('&') : '')); } catch (e) { /* file:// */ }
      }
    };
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-f'), v = c.getAttribute('data-v');
        state[f] = state[f] === v ? null : v;
        apply(true);
      });
    });
    $$('[data-clear]').forEach(function (b) {
      b.addEventListener('click', function () { state = { month: null, sun: null, save: null }; apply(true); chips[0].focus(); });
    });
    try {
      var p = new URLSearchParams(location.search);
      if (/^(1[0-2]|[1-9])$/.test(p.get('month') || '')) state.month = p.get('month');
      if (['full', 'part', 'shade'].indexOf(p.get('sun')) > -1) state.sun = p.get('sun');
      if (['easy', 'moderate', 'hard'].indexOf(p.get('save')) > -1) state.save = p.get('save');
    } catch (e) { /* old browser */ }
    apply(false);
  }

  // ---------- sowing calendar ----------
  var cal = $('[data-cal]');
  if (cal) {
    var mbtns = $$('.mbtn'), sum = $('[data-cal-sum]');
    var rows = $$('tbody tr[data-sow]', cal);
    var choose = function (m) {
      $$('.is-sel', cal).forEach(function (el) { el.classList.remove('is-sel'); el.style.removeProperty('--d'); });
      mbtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-month') === String(m))); });
      if (!m) { sum.textContent = 'No month chosen.'; return; }
      var hits = rows.filter(function (r) { return (' ' + r.getAttribute('data-sow') + ' ').indexOf(' ' + m + ' ') > -1; });
      var step = hits.length ? Math.min(32, 1100 / hits.length) : 0;
      var ind = 0, out = 0, both = 0;
      cal.querySelector('thead th[data-m="' + m + '"]').classList.add('is-sel');
      // force a frame so the fill restarts from zero when switching months
      void cal.offsetWidth;
      rows.forEach(function (r) {
        var td = r.querySelector('td[data-m="' + m + '"]');
        var k = hits.indexOf(r);
        if (k > -1) {
          td.style.setProperty('--d', Math.round(k * step) + 'ms');
          var s = td.querySelector('.cal-s');
          if (s.classList.contains('cal-io')) both++;
          else if (s.classList.contains('cal-i')) ind++;
          else out++;
        }
        td.classList.add('is-sel');
      });
      sum.textContent = hits.length
        ? MONTH[m - 1] + ': ' + hits.length + ' to sow — ' + [ind && ind + ' under cover', out && out + ' outdoors', both && both + ' either way'].filter(Boolean).join(', ') + '.'
        : MONTH[m - 1] + ': nothing to sow. Order seed and clean pots.';
    };
    mbtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var m = b.getAttribute('data-month');
        choose(b.getAttribute('aria-pressed') === 'true' ? null : m);
      });
    });
  }

  // ---------- borrow form ----------
  var form = $('[data-borrow]');
  if (form) {
    var errBox = $('[data-errors]'), errList = $('[data-err-list]'), errN = $('[data-err-n]'), status = $('[data-status]');
    var addrWrap = $('[data-address]'), newMember = $('[data-new-member]');
    var setErr = function (id, input, msg) {
      var p = document.getElementById('e-' + id);
      if (p) p.textContent = msg || '';
      if (input) { if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
    };
    var collectChange = function () {
      var c = form.querySelector('input[name="collect"]:checked');
      addrWrap.hidden = !(c && c.value === 'post');
    };
    $$('input[name="collect"]', form).forEach(function (r) { r.addEventListener('change', collectChange); });
    newMember.addEventListener('change', function () {
      var m = $('#f-member'); m.disabled = newMember.checked; if (newMember.checked) { m.value = ''; setErr('member', m, ''); }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      var errs = [];
      var name = $('#f-name'), email = $('#f-email'), member = $('#f-member'), agree = $('#f-agree'), addr = $('#f-address');
      var check = function (id, input, bad, msg, target) {
        setErr(id, input, bad ? msg : '');
        if (bad) errs.push([msg, target || (input && input.id)]);
      };
      check('name', name, !name.value.trim(), 'Enter your name.');
      var ev = email.value.trim();
      check('email', email, !ev ? true : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(ev), !ev ? 'Enter an email address.' : 'Email needs a name, @ and a domain, like ada@example.org.');
      var mv = member.value.trim().toUpperCase();
      if (!newMember.checked) check('member', member, !/^BW-\d{4}$/.test(mv), mv ? 'Member number is BW- and four digits, like BW-0412.' : 'Enter your member number, or tick “Not a member yet”.');
      else setErr('member', member, '');
      var c = form.querySelector('input[name="collect"]:checked');
      var firstRadio = form.querySelector('input[name="collect"]');
      setErr('collect', null, c ? '' : 'Choose a collection day or post.');
      if (!c) errs.push(['Choose a collection day or post.', firstRadio.id || (firstRadio.id = 'f-collect-0')]);
      if (c && c.value === 'post') check('address', addr, addr.value.trim().length < 10, 'Enter a full postal address.');
      else setErr('address', addr, '');
      check('agree', agree, !agree.checked, 'Tick the return agreement.');
      var n = load().length;
      setErr('basket', null, n ? '' : 'Basket is empty. Add at least one packet.');
      if (!n) errs.push(['Basket is empty. Add at least one packet.', null]);

      errList.innerHTML = '';
      if (errs.length) {
        errs.forEach(function (x) {
          var li = document.createElement('li');
          if (x[1]) { var a = document.createElement('a'); a.href = '#' + x[1]; a.textContent = x[0]; a.addEventListener('click', function (ev2) { ev2.preventDefault(); var t = document.getElementById(x[1]); if (t) t.focus(); }); li.appendChild(a); }
          else { var a2 = document.createElement('a'); a2.href = BASE + 'catalogue/index.html'; a2.textContent = x[0] + ' Open the catalogue.'; li.appendChild(a2); }
          errList.appendChild(li);
        });
        errN.textContent = errs.length === 1 ? '1 item' : errs.length + ' items';
        errBox.hidden = false;
        errBox.focus();
        return;
      }
      errBox.hidden = true;
      status.textContent = 'Request not sent. Demo site — no lending system is connected, nothing was stored. ' + n + (n === 1 ? ' packet' : ' packets') + ' still in your basket.';
    });
  }
})();
