/* Haugmere Sauna — behaviour. No libraries. */
(function () {
  'use strict';
  var HM = window.HM;
  var root = document.documentElement;
  var page = document.body.getAttribute('data-page');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- background follows the photo field in the middle of the screen ---------- */
  var bands = $$('main [data-field]');
  if ('IntersectionObserver' in window && bands.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) root.setAttribute('data-field', e.target.getAttribute('data-field')); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    bands.forEach(function (b) { io.observe(b); });
  }

  /* ---------- mobile menu ---------- */
  var btn = $('.menu-btn'), nav = $('#nav');
  function closeMenu(focusBtn) {
    nav.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Menu'; root.classList.remove('menu-open');
    if (focusBtn) btn.focus();
  }
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') !== 'true';
    if (!open) return closeMenu(false);
    nav.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); btn.textContent = 'Close'; root.classList.add('menu-open');
    var first = nav.querySelector('a'); if (first) first.focus();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') closeMenu(true); });
  window.addEventListener('resize', function () { if (window.innerWidth > 980 && nav.classList.contains('is-open')) closeMenu(false); });

  /* ---------- steppers ---------- */
  $$('.step-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var input = document.getElementById(b.getAttribute('data-for'));
      var v = (parseInt(input.value, 10) || 0) + Number(b.getAttribute('data-d'));
      v = Math.max(Number(input.min), Math.min(Number(input.max), v));
      input.value = v; input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  /* ---------- places booked in this browser ---------- */
  function readBooked() { try { return JSON.parse(localStorage.getItem('hm-booked') || '{}'); } catch (e) { return {}; } }
  function writeBooked(o) { try { localStorage.setItem('hm-booked', JSON.stringify(o)); } catch (e) { /* storage blocked: places just do not drop */ } }
  var booked = readBooked();
  HM.sessions.forEach(function (s) { if (booked[s.id]) s.left = Math.max(0, s.left - booked[s.id]); });
  var byId = {}; HM.sessions.forEach(function (s) { byId[s.id] = s; });
  $$('.row[data-id]').forEach(function (row) {
    var s = byId[row.getAttribute('data-id')]; if (!s || s.past || !booked[s.id]) return;
    row.setAttribute('data-left', s.left);
    row.querySelector('[data-left-label]').textContent = s.left ? s.left + ' of ' + s.cap + ' places' : 'Full';
    if (!s.left) { row.classList.add('is-full'); var a = row.querySelector('a.row-act'); if (a) { var sp = document.createElement('span'); sp.className = 'row-act is-off'; sp.textContent = 'Full'; a.replaceWith(sp); } }
  });

  var params = new URLSearchParams(location.search);
  function setParams(obj) {
    var p = new URLSearchParams();
    Object.keys(obj).forEach(function (k) { if (obj[k] !== '' && obj[k] != null) p.set(k, obj[k]); });
    var q = p.toString();
    try { history.replaceState(null, '', location.pathname + (q ? '?' + q : '')); } catch (e) { /* file:// in some browsers */ }
  }

  /* ---------- sessions filter ---------- */
  if (page === 'sessions') {
    var rows = $$('#s-rows .row'), chips = $$('.days .chip');
    var fType = $('#f-type'), fPart = $('#f-part'), fOpen = $('#f-open'), count = $('#f-count'), empty = $('#s-empty');
    var state = { day: HM.today, type: 'all', part: 'all', open: false };
    if (params.get('day') && (HM.days[params.get('day')] || params.get('day') === 'all')) state.day = params.get('day');
    if (params.get('type') && HM.types[params.get('type')]) state.type = params.get('type');
    if (['morning', 'afternoon', 'evening'].indexOf(params.get('part')) > -1) state.part = params.get('part');
    state.open = params.get('open') === '1';
    var partOf = function (t) { return t < '12:00' ? 'morning' : t < '17:00' ? 'afternoon' : 'evening'; };
    function render(push) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-day') === state.day)); });
      fType.value = state.type; fPart.value = state.part; fOpen.checked = state.open;
      var n = 0, bookable = 0;
      rows.forEach(function (r) {
        var ok = (state.day === 'all' || r.getAttribute('data-day') === state.day) &&
          (state.type === 'all' || r.getAttribute('data-type') === state.type) &&
          (state.part === 'all' || partOf(r.getAttribute('data-time')) === state.part) &&
          (!state.open || Number(r.getAttribute('data-left')) > 0);
        r.hidden = !ok; if (ok) { n++; if (Number(r.getAttribute('data-left')) > 0) bookable++; }
      });
      count.textContent = n ? n + (n === 1 ? ' session' : ' sessions') + ', ' + bookable + ' with places' + (state.day === 'all' ? ' this week' : ' on ' + HM.days[state.day]) : '';
      empty.hidden = n > 0;
      if (push) setParams({ day: state.day === HM.today ? '' : state.day, type: state.type === 'all' ? '' : state.type, part: state.part === 'all' ? '' : state.part, open: state.open ? '1' : '' });
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { state.day = c.getAttribute('data-day'); render(true); }); });
    fType.addEventListener('change', function () { state.type = fType.value; render(true); });
    fPart.addEventListener('change', function () { state.part = fPart.value; render(true); });
    fOpen.addEventListener('change', function () { state.open = fOpen.checked; render(true); });
    $('#s-clear').addEventListener('click', function () { state = { day: 'all', type: 'all', part: 'all', open: false }; render(true); chips[chips.length - 1].focus(); });
    $('#filters').addEventListener('submit', function (e) { e.preventDefault(); });
    render(false);
  }

  /* ---------- booking ---------- */
  if (page === 'book') {
    var form = $('#book'), sel = $('#b-session'), info = $('#b-session-info'), sumBody = $('#sum-body'), errSum = $('#err-sum'), done = $('#done');
    var F = { adults: $('#b-adults'), conc: $('#b-conc'), young: $('#b-young'), towel: $('#b-towel'), robe: $('#b-robe'), name: $('#b-name'), email: $('#b-email'), phone: $('#b-phone'), rules: $('#b-rules') };
    var tried = false;
    var pre = params.get('session');
    if (pre && byId[pre] && !byId[pre].past && byId[pre].left > 0) sel.value = pre;
    else if (pre) info.textContent = byId[pre] ? 'That session is no longer bookable. Choose another.' : '';
    var num = function (el) { var v = parseInt(el.value, 10); return isNaN(v) ? 0 : v; };
    var gbp = function (n) { return '£' + n.toFixed(n % 1 ? 2 : 0); };
    function current() { return byId[sel.value]; }
    function update() {
      var s = current();
      if (!s) { info.textContent = info.textContent && pre ? info.textContent : ''; sumBody.innerHTML = '<p class="dim">Choose a session.</p>'; return; }
      var t = HM.types[s.type], peak = s.peak ? 1 : 0;
      info.textContent = HM.days[s.day] + ', ' + s.time + '. ' + t.rooms + (t.rooms.slice(-1) === '.' ? ' ' : '. ') + s.left + ' of ' + s.cap + ' places left. ' + (t.price[0] === t.price[1] ? 'One price all week.' : peak ? 'Peak price.' : 'Off-peak price.');
      var a = num(F.adults), c = num(F.conc), tw = num(F.towel), rb = num(F.robe);
      var lines = [];
      if (a) lines.push([a + ' × adult, ' + gbp(t.price[peak]), a * t.price[peak]]);
      if (c) lines.push([c + ' × concession, ' + gbp(t.conc[peak]), c * t.conc[peak]]);
      if (tw) lines.push([tw + ' × towel, £3', tw * 3]);
      if (rb) lines.push([rb + ' × robe, £5', rb * 5]);
      var total = lines.reduce(function (n, l) { return n + l[1]; }, 0);
      sumBody.innerHTML = (lines.length ? '<ul class="sum-lines" role="list">' + lines.map(function (l) { return '<li><span>' + l[0] + '</span><span>' + gbp(l[1]) + '</span></li>'; }).join('') + '</ul>' : '<p class="dim">Add at least one person.</p>') +
        '<p class="sum-total">' + gbp(total) + '</p><p class="dim">' + t.name + ', ' + HM.days[s.day] + ' ' + s.time + '. Pay on arrival.</p>';
      return total;
    }
    function setErr(el, msg) {
      var id = el.id + '-err', old = document.getElementById(id);
      var desc = (el.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== id; });
      if (old) old.remove();
      if (msg) {
        var sp = document.createElement('span'); sp.className = 'err'; sp.id = id; sp.textContent = msg;
        var host = el.closest('.f-field, .f-check') || el.parentNode; host.appendChild(sp);
        desc.push(id); el.setAttribute('aria-invalid', 'true');
      } else el.removeAttribute('aria-invalid');
      if (desc.length) el.setAttribute('aria-describedby', desc.join(' ')); else el.removeAttribute('aria-describedby');
    }
    function validate() {
      var s = current(), errs = [];
      var add = function (el, msg) { errs.push([el, msg]); };
      var people = num(F.adults) + num(F.conc);
      if (!s) add(sel, 'Choose a session');
      if (people < 1) add(F.adults, 'Add at least one person');
      else if (s && people > s.left) add(F.adults, 'Only ' + s.left + ' places left in this session');
      var y = F.young.value.trim();
      if (people >= 1) {
        if (y === '') add(F.young, 'Enter the age of the youngest person');
        else {
          var yn = Number(y);
          if (!Number.isInteger(yn) || yn < 0 || yn > 120) add(F.young, 'Enter an age in whole years');
          else if (yn < 12) add(F.young, 'No one under 12');
          else if (s && yn < HM.types[s.type].min) add(F.young, HM.types[s.type].name + ' is for ages ' + HM.types[s.type].min + ' and over');
          else if (yn < 16 && num(F.adults) < 1) add(F.young, 'Someone under 16 needs an adult in this booking');
        }
      }
      if (num(F.towel) > people) add(F.towel, 'More towels than people');
      if (num(F.robe) > people) add(F.robe, 'More robes than people');
      if (!F.name.value.trim()) add(F.name, 'Enter your name');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(F.email.value.trim())) add(F.email, F.email.value.trim() ? 'Enter an email address like name@example.com' : 'Enter your email address');
      var ph = F.phone.value.replace(/[\s()-]/g, '');
      if (!/^(?:\+44|0)7\d{9}$/.test(ph)) add(F.phone, ph ? 'Enter a UK mobile number, like 07700 900 123' : 'Enter your mobile number');
      if (!F.rules.checked) add(F.rules, 'Confirm you have read the rules');
      [sel].concat(Object.keys(F).map(function (k) { return F[k]; })).forEach(function (el) {
        var hit = errs.filter(function (e) { return e[0] === el; })[0]; setErr(el, hit ? hit[1] : '');
      });
      return errs;
    }
    function showSummary(errs) {
      if (!errs.length) { errSum.hidden = true; errSum.innerHTML = ''; return; }
      errSum.innerHTML = '<h2>' + errs.length + (errs.length === 1 ? ' thing' : ' things') + ' to fix</h2><ul>' + errs.map(function (e) { return '<li><a href="#' + e[0].id + '">' + e[1] + '</a></li>'; }).join('') + '</ul>';
      errSum.hidden = false;
    }
    errSum.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return; e.preventDefault();
      var el = document.getElementById(a.getAttribute('href').slice(1)); el.focus();
    });
    form.addEventListener('input', function () { update(); if (tried) showSummary(validate()); });
    form.addEventListener('change', function () { update(); if (tried) showSummary(validate()); });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); tried = true;
      var errs = validate(); showSummary(errs);
      if (errs.length) { errSum.focus(); return; }
      var s = current(), total = update(), people = num(F.adults) + num(F.conc);
      booked[s.id] = (booked[s.id] || 0) + people; writeBooked(booked);
      s.left -= people;
      form.hidden = true; $('.sum').hidden = true;
      done.innerHTML = '<h2>Not booked — nothing was sent</h2><p>' + HM.types[s.type].name + ', ' + HM.days[s.day] + ' ' + s.time + '. ' + people + (people === 1 ? ' person' : ' people') + ', £' + total + ' to pay on arrival.</p>' +
        '<p>In a real booking you would get an email now. Here, the session drops to ' + s.left + ' of ' + s.cap + ' places in this browser only.</p>' +
        '<p><a class="more" href="../plan/index.html?start=' + s.time + (s.type === 'smoke' ? '&len=120' : '') + '">Plan your rounds for ' + s.time + '</a><a class="more" href="../sessions/index.html?day=' + s.day + '">Sessions on ' + HM.days[s.day] + '</a></p>';
      done.hidden = false; done.focus();
    });
    update();
  }

  /* ---------- round planner ---------- */
  if (page === 'plan') {
    var P = { start: $('#p-start'), len: $('#p-len'), rounds: $('#p-rounds'), heat: $('#p-heat'), dip: $('#p-dip'), rest: $('#p-rest') };
    var list = $('#p-list'), sum = $('#p-sum');
    var hm = function (m) { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
    var mins = function (t) { var p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); };
    var clamp = function (el) { var v = parseInt(el.value, 10); if (isNaN(v)) v = Number(el.min); return Math.max(Number(el.min), Math.min(Number(el.max), v)); };
    var st = params.get('start');
    if (st && /^\d{2}:\d{2}$/.test(st)) {
      if (!$$('option', P.start).some(function (o) { return o.value === st; })) { var o = document.createElement('option'); o.value = st; o.textContent = st; P.start.appendChild(o); }
      P.start.value = st;
    }
    if (params.get('len') === '120') P.len.value = '120';
    ['rounds', 'heat', 'dip', 'rest'].forEach(function (k) { if (params.get(k)) P[k].value = params.get(k); });
    function plan(push) {
      var r = clamp(P.rounds), h = clamp(P.heat), d = clamp(P.dip), re = clamp(P.rest), L = Number(P.len.value);
      var t = mins(P.start.value), end = t + L, items = [];
      items.push([t, 'Arrive, shower, change', '10 min']); t += 10;
      for (var i = 1; i <= r; i++) {
        items.push([t, 'Heat, round ' + i, h + ' min. Start on the bottom bench']); t += h;
        items.push([t, 'Lake', d + ' min. In by the ladder']); t += d;
        if (i < r) { items.push([t, 'Rest', re + ' min on the jetty or in the steam room']); t += re; }
      }
      items.push([t, 'Shower and change', '10 min']); t += 10;
      items.push([t, 'Out', '']);
      var spare = end - t;
      list.innerHTML = items.map(function (it) { return '<li><span class="pt">' + hm(it[0]) + '</span><span class="pw"><b>' + it[1] + '</b>' + (it[2] ? '<br><span class="dim">' + it[2] + '</span>' : '') + '</span></li>'; }).join('');
      sum.classList.toggle('is-over', spare < 0);
      sum.textContent = spare < 0 ? 'Your plan runs ' + (-spare) + (spare === -1 ? ' minute' : ' minutes') + ' over the session, which ends at ' + hm(end) + '. Drop a round or rest less.'
        : spare === 0 ? 'Fits exactly. The session ends at ' + hm(end) + '.'
          : 'Fits, with ' + spare + (spare === 1 ? ' minute' : ' minutes') + ' to spare. The session ends at ' + hm(end) + '.';
      if (push) setParams({ start: P.start.value, len: L === 90 ? '' : L, rounds: r, heat: h, dip: d, rest: re });
    }
    $('#plan').addEventListener('input', function () { plan(true); });
    $('#plan').addEventListener('change', function (e) { if (e.target.type === 'number') e.target.value = clamp(e.target); plan(true); });
    $('#plan').addEventListener('submit', function (e) { e.preventDefault(); });
    plan(false);
  }

  /* ---------- dip guide ---------- */
  if (page === 'lake') {
    var range = $('#dip-range'), numIn = $('#dip-num'), out = $('#dip-out');
    function dip(v, from) {
      v = Math.max(2, Math.min(22, Number(v)));
      if (isNaN(v)) return;
      if (from !== range) range.value = v;
      if (from !== numIn) numIn.value = v.toFixed(1);
      range.setAttribute('aria-valuetext', v.toFixed(1) + ' °C');
      var b = HM.dip.filter(function (x) { return v < x.max; })[0] || HM.dip[HM.dip.length - 1];
      out.innerHTML = '<span class="dip-mins">' + b.mins + '</span>At ' + v.toFixed(1) + ' °C. ' + b.note;
    }
    range.addEventListener('input', function () { dip(range.value, range); });
    numIn.addEventListener('input', function () { if (numIn.value !== '') dip(numIn.value, numIn); });
    numIn.addEventListener('change', function () { dip(numIn.value === '' ? HM.lake : numIn.value, null); });
    $('#dip-today').addEventListener('click', function () { dip(HM.lake, null); });
    dip(range.value, null);
  }

  /* ---------- lightbox ---------- */
  var dlg = $('#lb');
  var galleries = $$('.gal');
  if (dlg && galleries.length && typeof dlg.showModal === 'function') {
    var lbImg = document.createElement('img'); lbImg.className = 'lb-img'; $('.lb-fig', dlg).prepend(lbImg); var cap = $('.lb-cap', dlg), cnt = $('.lb-count', dlg), set = [], idx = 0, opener = null;
    function show(i) {
      idx = (i + set.length) % set.length; var b = set[idx];
      lbImg.src = b.getAttribute('data-src'); lbImg.alt = b.getAttribute('data-alt'); cap.textContent = b.getAttribute('data-alt');
      cnt.textContent = (idx + 1) + ' of ' + set.length;
    }
    galleries.forEach(function (g) {
      var btns = $$('.gal-btn', g);
      btns.forEach(function (b, i) {
        b.addEventListener('click', function () {
          set = btns; opener = b; show(i);
          var thumb = b.querySelector('img');
          if (document.startViewTransition && !reduced) {
            thumb.style.viewTransitionName = 'lb';
            var vt = document.startViewTransition(function () { thumb.style.viewTransitionName = ''; lbImg.style.viewTransitionName = 'lb'; dlg.showModal(); $('.lb-close', dlg).focus(); });
            vt.finished.then(function () { lbImg.style.viewTransitionName = ''; });
          } else { dlg.showModal(); $('.lb-close', dlg).focus(); }
        });
      });
    });
    $('.lb-prev', dlg).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next', dlg).addEventListener('click', function () { show(idx + 1); });
    $('.lb-close', dlg).addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lb-fig')) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
    });
    dlg.addEventListener('close', function () { lbImg.removeAttribute('src'); if (opener) opener.focus(); });
  }
})();
