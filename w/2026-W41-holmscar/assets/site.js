/* Holmscar Harbour — menu, tide curve, sill windows, berth finder, booking price and checks, notice filter. */
(function () {
  'use strict';
  var D = window.HOLM, TD = window.HolmTide;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(location.search);
  var SVGNS = 'http://www.w3.org/2000/svg';
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function dShort(iso) { var d = new Date(iso + 'T12:00:00Z'); return DAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()]; }
  function m2(n) { return n.toFixed(2) + ' m'; }
  function gbp(n) { return '£' + n.toFixed(2); }
  function setURL(obj) {
    var p = new URLSearchParams();
    Object.keys(obj).forEach(function (k) { if (obj[k] !== '' && obj[k] !== null && obj[k] !== undefined && obj[k] !== false) p.set(k, obj[k]); });
    var q = p.toString();
    try { history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch (e) { /* file:// in some browsers */ }
  }
  function num(v) { if (v === '' || v === null || v === undefined) return NaN; return parseFloat(String(v).replace(',', '.')); }

  // ---------- menu ----------
  var menuBtn = $('.menu-btn'), nav = $('#nav');
  function closeMenu(focusBtn) {
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'Menu';
    document.documentElement.classList.remove('menu-open');
    if (focusBtn) menuBtn.focus();
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      if (nav.classList.contains('open')) { closeMenu(false); return; }
      var top = $('.top-in').getBoundingClientRect().bottom;
      document.documentElement.style.setProperty('--menu-top', Math.round(top) + 'px');
      nav.classList.add('open'); menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.textContent = 'Close';
      document.documentElement.classList.add('menu-open');
      var first = nav.querySelector('a'); if (first) first.focus();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(true); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1040) closeMenu(false); });
  }

  // ---------- tide curve ----------
  function el(tag, attrs, text) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function Tide(box) {
    this.box = box;
    this.readout = box.closest('.frame').querySelector('[data-readout]');
    this.day = box.getAttribute('data-day');
    this.now = box.hasAttribute('data-now') ? +box.getAttribute('data-now') : null;
    this.draught = num(box.getAttribute('data-draught')) || 1.5;
    this.cursor = this.now !== null ? this.now : null;
    this.drawn = false;
    var self = this;
    this.render();
    if (window.ResizeObserver) {
      var lastW = box.clientWidth;
      new ResizeObserver(function () { if (Math.abs(box.clientWidth - lastW) > 2) { lastW = box.clientWidth; self.render(); } }).observe(box);
    }
  }
  Tide.prototype.set = function (o) {
    if (o.day !== undefined) { this.day = o.day; this.now = o.day === D.TODAY ? D.NOW_MIN : null; this.cursor = this.now; }
    if (o.draught !== undefined) this.draught = o.draught;
    this.render();
  };
  Tide.prototype.render = function () {
    var box = this.box, W = box.clientWidth, H = box.clientHeight, self = this;
    if (!W || !H) return;
    var narrow = W < 520;
    var L = narrow ? 30 : 40, R = 12, Tp = 34, B = 54;
    var pw = W - L - R, ph = H - Tp - B, start = TD.dayStart(this.day);
    var X = function (min) { return L + (min / 1440) * pw; };
    var Y = function (h) { return Tp + ph - (h / 6) * ph; };
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, tabindex: '0', role: 'slider', 'aria-label': 'Tide curve for ' + dShort(this.day) + '. Arrow keys move ten minutes, Page Up and Page Down one hour.', 'aria-valuemin': '0', 'aria-valuemax': '1435' });
    // grid
    for (var h = 0; h <= 6; h++) {
      svg.appendChild(el('line', { x1: L, x2: W - R, y1: Y(h), y2: Y(h), 'class': h === 0 ? 'tc-axis' : 'tc-grid' }));
      svg.appendChild(el('text', { x: L - 8, y: Y(h) + 4, 'text-anchor': 'end', 'class': 'tc-lab' }, h + (h === 6 && !narrow ? ' m' : '')));
    }
    for (var t = 0; t <= 1440; t += narrow ? 360 : 180) {
      svg.appendChild(el('line', { x1: X(t), x2: X(t), y1: Tp, y2: Tp + ph, 'class': 'tc-grid' }));
      var lab = String(t / 60).padStart(2, '0') + (narrow ? '' : ':00');
      svg.appendChild(el('text', { x: X(t), y: Tp + ph + 17, 'text-anchor': t === 0 ? 'start' : t === 1440 ? 'end' : 'middle', 'class': 'tc-lab' }, lab));
    }
    // curve
    var pts = [];
    for (var m = 0; m <= 1440; m += 5) pts.push(X(m).toFixed(1) + ' ' + Y(TD.height(start + m * 60000)).toFixed(1));
    svg.appendChild(el('path', { d: 'M' + X(0) + ' ' + Y(0) + ' L' + pts.join(' L') + ' L' + X(1440) + ' ' + Y(0) + ' Z', 'class': 'tc-area' }));
    var line = el('path', { d: 'M' + pts.join(' L'), 'class': 'tc-line' });
    svg.appendChild(line);
    // sill
    svg.appendChild(el('line', { x1: L, x2: W - R, y1: Y(TD.SILL), y2: Y(TD.SILL), 'class': 'tc-sill' }));
    svg.appendChild(el('text', { x: W - R - 4, y: Y(TD.SILL) - 6, 'text-anchor': 'end', 'class': 'tc-sill-t' }, 'Sill ' + TD.SILL + ' m'));
    // sill windows bar
    var by = Tp + ph + 26;
    svg.appendChild(el('rect', { x: L, y: by, width: pw, height: 8, 'class': 'tc-win-off' }));
    TD.windows(start, start + 86400000, this.draught).forEach(function (w) {
      var a = (w[0] - start) / 60000, b = (w[1] - start) / 60000;
      svg.appendChild(el('rect', { x: X(a), y: by, width: Math.max(1, X(b) - X(a)), height: 8, 'class': 'tc-win' }));
    });
    svg.appendChild(el('text', { x: L, y: by + 21, 'class': 'tc-win-t' }, 'Over the sill with ' + this.draught.toFixed(1) + ' m draught'));
    // turns
    TD.turns(start, start + 86400000 - 1).forEach(function (x) {
      var min = (x.t - start) / 60000, cx = X(min), cy = Y(x.h), up = x.type === 'HW';
      var anchor = cx < L + 40 ? 'start' : cx > W - R - 40 ? 'end' : 'middle';
      svg.appendChild(el('circle', { cx: cx, cy: cy, r: 4.5, 'class': 'tc-turn' }));
      svg.appendChild(el('text', { x: cx, y: up ? cy - 24 : cy + 20, 'text-anchor': anchor, 'class': 'tc-turn-t' }, x.type + ' ' + TD.clock(x.t)));
      svg.appendChild(el('text', { x: cx, y: up ? cy - 10 : cy + 34, 'text-anchor': anchor, 'class': 'tc-turn-h' }, m2(x.h)));
    });
    // now
    if (this.now !== null) {
      svg.appendChild(el('line', { x1: X(this.now), x2: X(this.now), y1: Tp - 8, y2: Tp + ph, 'class': 'tc-now' }));
      svg.appendChild(el('text', { x: X(this.now) + 5, y: Tp - 12, 'class': 'tc-now-t' }, 'Now ' + TD.clock(start + this.now * 60000)));
    }
    // pointer hairline
    var hair = el('line', { y1: Tp, y2: Tp + ph, 'class': 'tc-hair', visibility: 'hidden' });
    var dot = el('circle', { r: 5, 'class': 'tc-dot', visibility: 'hidden' });
    svg.appendChild(hair); svg.appendChild(dot);
    box.innerHTML = ''; box.appendChild(svg);

    function show(min, visible) {
      min = Math.max(0, Math.min(1435, Math.round(min / 5) * 5));
      self.cursor = min;
      var ms = start + min * 60000, hh = TD.height(ms), rising = TD.height(ms + 300000) > hh, over = hh - TD.SILL;
      var text = TD.clock(ms) + ', ' + m2(hh) + ', ' + (rising ? 'rising' : 'falling') + '. ' + (over > 0 ? m2(over) + ' over the sill.' : 'Sill dry.');
      svg.setAttribute('aria-valuenow', min); svg.setAttribute('aria-valuetext', text);
      if (self.readout) self.readout.innerHTML = '<b>' + TD.clock(ms) + '</b> &nbsp;' + m2(hh) + ', ' + (rising ? 'rising' : 'falling') + ' · ' + (over > 0 ? m2(over) + ' over the sill' : 'sill dry');
      if (visible) {
        hair.setAttribute('x1', X(min)); hair.setAttribute('x2', X(min)); dot.setAttribute('cx', X(min)); dot.setAttribute('cy', Y(hh));
        hair.setAttribute('visibility', 'visible'); dot.setAttribute('visibility', 'visible');
      }
    }
    function hide() {
      hair.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden');
      if (self.now !== null) show(self.now, false);
      else if (self.readout) self.readout.textContent = 'Move along the curve to read the time and height.';
    }
    svg.addEventListener('pointermove', function (e) {
      var r = svg.getBoundingClientRect(), x = e.clientX - r.left;
      if (x < L || x > W - R) return;
      show(((x - L) / pw) * 1440, true);
    });
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('focus', function () { show(self.cursor !== null ? self.cursor : 720, true); });
    svg.addEventListener('blur', hide);
    svg.addEventListener('keydown', function (e) {
      var c = self.cursor !== null ? self.cursor : 720, step = { ArrowRight: 10, ArrowUp: 10, ArrowLeft: -10, ArrowDown: -10, PageUp: 60, PageDown: -60 }[e.key];
      if (e.key === 'Home') { show(0, true); e.preventDefault(); return; }
      if (e.key === 'End') { show(1435, true); e.preventDefault(); return; }
      if (step) { show(c + step, true); e.preventDefault(); }
    });
    if (this.now !== null) show(this.now, false); else hide();

    if (!this.drawn && !reduce && line.getTotalLength) {
      var len = line.getTotalLength();
      line.style.strokeDasharray = len; line.style.strokeDashoffset = len;
      line.getBoundingClientRect();
      requestAnimationFrame(function () { box.classList.add('draw'); line.style.strokeDashoffset = 0; });
    }
    this.drawn = true;
  };
  var charts = $$('[data-tide]').map(function (b) { return new Tide(b); });

  // ---------- tides page ----------
  var dayBtns = $$('[data-day-btn]');
  if (dayBtns.length && charts[0]) {
    var chart = charts[0], dIn = $('#draught'), dErr = $('[data-draught-err]'), winOut = $('[data-windows]');
    var state = { day: D.WEEK.indexOf(params.get('day')) > -1 ? params.get('day') : D.TODAY, draught: 1.5 };
    var pd = num(params.get('draught'));
    if (pd >= 0.5 && pd <= 3) { state.draught = Math.round(pd * 10) / 10; dIn.value = state.draught; }
    function windowsText() {
      var s = TD.dayStart(state.day), w = TD.windows(s, s + 86400000, state.draught);
      var need = (TD.SILL + state.draught + TD.CLEARANCE).toFixed(1);
      winOut.textContent = (w.length ? w.map(function (x) { return TD.clock(x[0]) + '–' + (x[1] - s >= 86400000 ? '24:00' : TD.clock(x[1])); }).join(', ') : 'Not passable this day') + '. Needs ' + need + ' m of tide for ' + state.draught.toFixed(1) + ' m draught.';
    }
    function applyDay() {
      dayBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-day-btn') === state.day ? 'true' : 'false'); });
      $$('[data-day-list]').forEach(function (l) { l.hidden = l.getAttribute('data-day-list') !== state.day; });
      var cap = chart.box.closest('figure').querySelector('figcaption');
      cap.firstChild.nodeValue = cap.firstChild.nodeValue.replace(/datum, [^.]+\./, 'datum, ' + longDay(state.day) + '.');
      chart.set({ day: state.day, draught: state.draught });
      windowsText();
      setURL({ day: state.day === D.TODAY ? '' : state.day, draught: state.draught === 1.5 ? '' : state.draught });
    }
    function longDay(iso) { var d = new Date(iso + 'T12:00:00Z'); return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getUTCDay()] + ' ' + d.getUTCDate() + ' October'; }
    dayBtns.forEach(function (b) { b.addEventListener('click', function () { state.day = b.getAttribute('data-day-btn'); applyDay(); }); });
    dIn.addEventListener('input', function () {
      var v = num(dIn.value);
      if (!(v >= 0.5 && v <= 3)) { dErr.textContent = 'Enter a draught from 0.5 to 3.0 m.'; dErr.hidden = false; dIn.setAttribute('aria-invalid', 'true'); return; }
      dErr.hidden = true; dIn.removeAttribute('aria-invalid');
      state.draught = Math.round(v * 10) / 10; applyDay();
    });
    applyDay();
  }

  // ---------- berths ----------
  var AREA_RATE = { V: 'pontoon', C: 'marina', W: 'wall', M: 'mooring' };
  var byId = {}; D.BERTHS.forEach(function (b) { byId[b.id] = b; });
  function season(iso) { var m = +iso.slice(5, 7); return m >= 4 && m <= 9 ? 'summer' : 'winter'; }
  function chargeLen(loa) { return Math.max(D.FEE_RULES.minLength, Math.ceil(loa / D.FEE_RULES.round - 1e-9) * D.FEE_RULES.round); }
  function fits(b, s) {
    var a = D.AREAS[b.area];
    if (!isNaN(s.loa) && s.loa > b.loa) return false;
    if (!isNaN(s.beam) && s.beam > b.beam) return false;
    if (!a.afloat) return !!s.ground;
    if (!isNaN(s.draught) && s.draught + TD.CLEARANCE > a.depth) return false;
    return true;
  }
  var fitForm = $('[data-fit]');
  if (fitForm) {
    var fLoa = $('#f-loa'), fBeam = $('#f-beam'), fDr = $('#f-draught'), fGr = $('#f-ground');
    var fCount = $('[data-fit-count]'), fErr = $('[data-fit-err]'), detail = $('[data-berth-detail]'), empty = $('[data-fit-empty]');
    var gs = $$('.berth.is-free'), rows = $$('[data-row]');
    var sel = null;
    ['loa', 'beam', 'draught'].forEach(function (k) { var v = params.get(k); if (v) $('#f-' + k).value = v; });
    if (params.get('ground') === '1') fGr.checked = true;
    if (params.get('berth') && byId[params.get('berth')] && byId[params.get('berth')].free) sel = params.get('berth');

    function read() { return { loa: num(fLoa.value), beam: num(fBeam.value), draught: num(fDr.value), ground: fGr.checked }; }
    function check(s) {
      var bad = [];
      [[fLoa, s.loa, 4, 24, 'Length 4 to 24 m'], [fBeam, s.beam, 1.5, 8, 'Beam 1.5 to 8 m'], [fDr, s.draught, 0.3, 3.5, 'Draught 0.3 to 3.5 m']].forEach(function (c) {
        var off = c[0].value !== '' && (isNaN(c[1]) || c[1] < c[2] || c[1] > c[3]);
        if (off) { bad.push(c[4]); c[0].setAttribute('aria-invalid', 'true'); } else c[0].removeAttribute('aria-invalid');
      });
      fErr.hidden = !bad.length; fErr.textContent = bad.length ? 'Check the sizes: ' + bad.join('. ') + '.' : '';
      return !bad.length;
    }
    function update() {
      var s = read(), ok = check(s), active = ok && (!isNaN(s.loa) || !isNaN(s.beam) || !isNaN(s.draught) || s.ground);
      if (!ok) { s = { loa: NaN, beam: NaN, draught: NaN, ground: false }; }
      var n = 0;
      gs.forEach(function (g) {
        var b = byId[g.getAttribute('data-berth')], f = fits(b, s);
        if (!active && !D.AREAS[b.area].afloat) f = true;
        g.classList.toggle('is-fit', active && f); g.classList.toggle('is-dim', active && !f);
        g.classList.toggle('is-sel', b.id === sel); g.setAttribute('aria-pressed', b.id === sel ? 'true' : 'false');
        g.setAttribute('aria-label', b.id + ', ' + D.AREAS[b.area].short.toLowerCase() + ', up to ' + b.loa + ' m by ' + b.beam + ' m, free tonight' + (active ? (f ? ', fits your boat' : ', does not fit') : '') + (b.id === sel ? ', chosen' : ''));
        if (f) n++;
      });
      rows.forEach(function (r) {
        var b = byId[r.getAttribute('data-row')], f = !active || fits(b, s);
        r.hidden = !f;
        r.querySelector('button').setAttribute('aria-pressed', b.id === sel ? 'true' : 'false');
      });
      empty.hidden = n > 0;
      var total = gs.length;
      fCount.textContent = active ? n + ' of ' + total + ' free berths fit' + (!isNaN(s.loa) ? ' a ' + s.loa + ' m boat' : ' these sizes') + '.' : total + ' free berths. Enter a length to see which fit.';
      showDetail(s, active);
      setURL({ loa: fLoa.value, beam: fBeam.value, draught: fDr.value, ground: fGr.checked ? '1' : '', berth: sel || '' });
    }
    function showDetail(s, active) {
      if (!sel) { detail.innerHTML = '<p class="muted-p">Choose a free berth on the plan or in the list.</p>'; return; }
      var b = byId[sel], a = D.AREAS[b.area], rate = D.RATES[AREA_RATE[b.area]], f = fits(b, s);
      var price = rate.flat ? gbp(rate.winter) + ' a night' : (!isNaN(s.loa) ? gbp(chargeLen(s.loa) * rate.winter) + ' a night for ' + chargeLen(s.loa).toFixed(1) + ' m' : gbp(rate.winter) + ' per metre a night');
      var q = new URLSearchParams({ berth: b.id, type: AREA_RATE[b.area] });
      if (!isNaN(s.loa)) q.set('loa', s.loa); if (!isNaN(s.beam)) q.set('beam', s.beam); if (!isNaN(s.draught)) q.set('draught', s.draught);
      detail.innerHTML = '<h3>' + b.id + '</h3><p>' + a.name + '</p>' +
        '<dl class="facts"><div><dt>Longest boat</dt><dd>' + b.loa + ' m</dd></div><div><dt>Widest beam</dt><dd>' + b.beam + ' m</dd></div>' +
        '<div><dt>Depth</dt><dd>' + (a.afloat ? a.depth + ' m at datum' : 'Dries ' + Math.abs(a.depth) + ' m') + '</dd></div>' +
        '<div><dt>Shore power</dt><dd>' + (b.power ? 'Yes' : 'No') + '</dd></div><div><dt>Price, winter</dt><dd>' + price + '</dd></div></dl>' +
        (active && !f ? '<p class="error">This berth does not fit the sizes you entered.</p>' : '') +
        '<p><a class="btn" href="../book/index.html?' + q.toString() + '">Request ' + b.id + '</a></p>';
    }
    function pick(id) { sel = sel === id ? null : id; update(); }
    gs.forEach(function (g) {
      g.addEventListener('click', function () { pick(g.getAttribute('data-berth')); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(g.getAttribute('data-berth')); } });
    });
    rows.forEach(function (r) { r.querySelector('button').addEventListener('click', function () { pick(r.getAttribute('data-row')); }); });
    [fLoa, fBeam, fDr].forEach(function (i) { i.addEventListener('input', update); });
    fGr.addEventListener('change', update);
    $('[data-fit-clear]').addEventListener('click', function () { fLoa.value = fBeam.value = fDr.value = ''; fGr.checked = false; sel = null; update(); fLoa.focus(); });
    update();
  }

  // ---------- booking ----------
  var form = $('[data-book]');
  if (form) {
    var F = function (n) { return form.elements[n]; };
    var total = $('[data-q-total]'), lines = $('[data-q-lines]');
    var nightsIn = $('#b-nights'), powerIn = $('#b-power'), powerWrap = $('[data-power-wrap]');
    // prefill from the berths page or fees page
    var pt = params.get('type');
    if (pt && D.RATES[pt]) form.querySelector('input[name="type"][value="' + pt + '"]').checked = true;
    ['berth', 'loa', 'beam', 'draught', 'nights'].forEach(function (k) { var v = params.get(k); if (v) F(k).value = v; });
    var pa = params.get('arrive'); if (pa && /^\d{4}-\d\d-\d\d$/.test(pa)) F('arrive').value = pa;

    function typeVal() { return form.querySelector('input[name="type"]:checked').value; }
    function addDays(iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
    function quote() {
      var type = typeVal(), r = D.RATES[type], loa = num(F('loa').value), n = parseInt(nightsIn.value, 10), arrive = F('arrive').value;
      var powerOK = type === 'pontoon' || type === 'marina';
      powerIn.disabled = !powerOK; if (!powerOK) powerIn.checked = false;
      powerWrap.classList.toggle('is-off', !powerOK);
      $('[data-step="-1"]').disabled = !(n > 1); $('[data-step="1"]').disabled = !(n < 14);
      if (!(loa >= 4 && loa <= 24) || !(n >= 1 && n <= 14) || !arrive) {
        total.textContent = '—';
        lines.innerHTML = '<li>' + (!(loa >= 4 && loa <= 24) ? 'Enter a length from 4 to 24 m to see the price.' : 'Enter an arrival date and 1 to 14 nights.') + '</li>';
        return null;
      }
      var len = chargeLen(loa), multi = F('multi').checked && !r.flat ? D.FEE_RULES.multihull : 1;
      var by = { winter: { n: 0, sum: 0 }, summer: { n: 0, sum: 0 } }, free = 0, sum = 0;
      for (var i = 0; i < n; i++) {
        var s = season(addDays(arrive, i)), c = (r.flat ? r[s] : len * r[s]) * multi;
        by[s].n++; by[s].sum += c; sum += c;
        if ((i + 1) % D.FEE_RULES.freeNight === 0) { free += c; sum -= c; }
      }
      var out = [];
      ['winter', 'summer'].forEach(function (s) {
        if (!by[s].n) return;
        var what = r.flat ? by[s].n + ' × ' + gbp(r[s]) : len.toFixed(1) + ' m × ' + gbp(r[s]) + (multi > 1 ? ' × ' + multi : '') + ' × ' + by[s].n;
        out.push(['<span>' + what + ' <span class="small">' + s + '</span></span>', gbp(by[s].sum)]);
      });
      if (free) out.push(['<span>Every 7th night free</span>', '−' + gbp(free)]);
      if (powerIn.checked) { var p = n * D.FEE_RULES.power; sum += p; out.push(['<span>Shore power, ' + n + ' × ' + gbp(D.FEE_RULES.power) + '</span>', gbp(p)]); }
      var warn = '';
      if (type === 'mooring' && loa > 13) warn = 'Visitor moorings take boats up to 13 m.';
      total.textContent = gbp(sum);
      lines.innerHTML = out.map(function (l) { return '<li>' + l[0] + '<span>' + l[1] + '</span></li>'; }).join('') + (warn ? '<li class="q-warn">' + warn + '</li>' : '') +
        '<li><span>' + dShort(arrive) + ' to ' + dShort(addDays(arrive, n)) + ', ' + n + (n === 1 ? ' night' : ' nights') + '</span></li>';
      return { sum: sum, n: n, arrive: arrive, type: type };
    }
    $$('[data-step]', form).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = parseInt(nightsIn.value, 10) || 1; v = Math.max(1, Math.min(14, v + +b.getAttribute('data-step')));
        nightsIn.value = v; quote(); if (fieldErr.nights) validate(['nights']);
      });
    });
    var maxDraught = { pontoon: D.AREAS.V.depth - TD.CLEARANCE, marina: D.AREAS.C.depth - TD.CLEARANCE, mooring: D.AREAS.M.depth - TD.CLEARANCE };
    var fieldErr = {};
    var LABEL = { berth: 'Berth number', loa: 'Length overall', beam: 'Beam', draught: 'Draught', boat: 'Boat name', arrive: 'Arrival', nights: 'Nights', name: 'Name', phone: 'Mobile', email: 'Email', rules: 'Notices' };
    function rules() {
      var type = typeVal(), v = {};
      var loa = num(F('loa').value), beam = num(F('beam').value), dr = num(F('draught').value);
      var berth = F('berth').value.trim().toUpperCase();
      if (berth) {
        var b = byId[berth];
        if (!/^[VCWM]\d{1,2}$/.test(berth) || !b) v.berth = 'No visitor berth ' + berth + '. Use a number from the berths plan, for example V07.';
        else if (!b.free) v.berth = berth + ' is taken tonight. Choose another or leave it blank.';
        else if (AREA_RATE[b.area] !== type) v.berth = berth + ' is a ' + D.AREAS[b.area].short.toLowerCase() + ' berth. Change the berth type or the number.';
        else if (loa > b.loa) v.berth = berth + ' takes boats up to ' + b.loa + ' m.';
        else if (beam > b.beam) v.berth = berth + ' takes a beam up to ' + b.beam + ' m.';
      }
      if (F('loa').value === '') v.loa = 'Enter the length overall.';
      else if (!(loa >= 4 && loa <= 24)) v.loa = 'Length must be 4 to 24 m.';
      else if (type === 'mooring' && loa > 13) v.loa = 'Visitor moorings take boats up to 13 m.';
      if (F('beam').value === '') v.beam = 'Enter the beam.';
      else if (!(beam >= 1.5 && beam <= 8)) v.beam = 'Beam must be 1.5 to 8 m.';
      if (F('draught').value === '') v.draught = 'Enter the draught.';
      else if (!(dr >= 0.3 && dr <= 3.5)) v.draught = 'Draught must be 0.3 to 3.5 m.';
      else if (maxDraught[type] !== undefined && dr > maxDraught[type] + 1e-9) v.draught = 'Too deep for this berth type. Up to ' + maxDraught[type].toFixed(1) + ' m.';
      if (!F('boat').value.trim()) v.boat = 'Enter the boat name.';
      var a = F('arrive').value;
      if (!a) v.arrive = 'Enter an arrival date.';
      else if (a < D.TODAY || a > '2027-09-30') v.arrive = 'Arrival must be from 5 October 2026 to 30 September 2027.';
      var n = num(nightsIn.value);
      if (!(n >= 1 && n <= 14 && Math.floor(n) === n)) v.nights = 'Nights must be a whole number from 1 to 14.';
      if (!F('name').value.trim()) v.name = 'Enter your name.';
      var ph = F('phone').value.replace(/[\s()-]/g, '');
      if (!ph) v.phone = 'Enter a mobile number.';
      else if (!/^\+?\d{10,14}$/.test(ph)) v.phone = 'Enter a mobile number with 10 to 14 digits.';
      var em = F('email').value.trim();
      if (!em) v.email = 'Enter an email address.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) v.email = 'Enter an email address like name@example.com.';
      if (!F('rules').checked) v.rules = 'Confirm you have read the notices in force.';
      return v;
    }
    var ID = { berth: 'b-berth', loa: 'b-loa', beam: 'b-beam', draught: 'b-draught', boat: 'b-boat', arrive: 'b-arrive', nights: 'b-nights', name: 'b-name', phone: 'b-phone', email: 'b-email', rules: 'b-rules' };
    function validate(only) {
      var v = rules();
      Object.keys(ID).forEach(function (k) {
        if (only && only.indexOf(k) < 0) return;
        var inp = $('#' + ID[k]), err = $('#e-' + k), msg = v[k];
        fieldErr[k] = !!msg;
        if (msg) { inp.setAttribute('aria-invalid', 'true'); err.textContent = msg; err.hidden = false; inp.setAttribute('aria-errormessage', 'e-' + k); }
        else { inp.removeAttribute('aria-invalid'); err.hidden = true; err.textContent = ''; inp.removeAttribute('aria-errormessage'); }
      });
      return v;
    }
    form.addEventListener('input', function (e) {
      quote();
      var k = Object.keys(ID).filter(function (x) { return e.target.id === ID[x]; })[0];
      if (k && fieldErr[k]) validate([k]);
      if (e.target.name === 'type' || e.target.name === 'loa') { if (fieldErr.berth) validate(['berth']); if (fieldErr.draught) validate(['draught']); }
    });
    form.addEventListener('change', function () { quote(); });
    var sumBox = $('[data-err-summary]'), done = $('[data-done]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = validate(), keys = Object.keys(ID).filter(function (k) { return v[k]; });
      done.hidden = true;
      if (keys.length) {
        $('[data-err-title]').textContent = keys.length === 1 ? '1 thing to fix' : keys.length + ' things to fix';
        $('[data-err-list]').innerHTML = keys.map(function (k) { return '<li><a href="#' + ID[k] + '">' + LABEL[k] + ': ' + v[k] + '</a></li>'; }).join('');
        sumBox.hidden = false; sumBox.focus();
        return;
      }
      sumBox.hidden = true;
      var q = quote(), berth = F('berth').value.trim().toUpperCase();
      done.innerHTML = '<h2>Request not sent</h2><p>Practice site. Nothing was stored, sent or charged.</p><p>You asked for ' + (berth || D.RATES[q.type].label.toLowerCase()) + ', ' + q.n + (q.n === 1 ? ' night' : ' nights') + ' from ' + dShort(q.arrive) + ', ' + gbp(q.sum) + '.</p>';
      done.hidden = false; done.focus();
    });
    $('[data-err-list]').addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      e.preventDefault(); var t = $(a.getAttribute('href')); t.focus(); t.scrollIntoView({ block: 'center' });
    });
    if (params.get('berth')) validate(['berth']);
    quote();
  }

  // ---------- notices ----------
  var list = $('[data-notices]');
  if (list) {
    var items = $$('.notice', list), chips = $$('.chip'), qIn = $('#q'), countOut = $('[data-f-count]'), nEmpty = $('[data-n-empty]');
    var st = { type: (params.get('type') || '').split(',').filter(Boolean), status: (params.get('status') || '').split(',').filter(Boolean) };
    qIn.value = params.get('q') || '';
    function match(it, skip) {
      var t = it.getAttribute('data-type'), s = it.getAttribute('data-status'), q = qIn.value.trim().toLowerCase();
      if (skip !== 'type' && st.type.length && st.type.indexOf(t) < 0) return false;
      if (skip !== 'status' && st.status.length && st.status.indexOf(s) < 0) return false;
      if (q && it.getAttribute('data-text').indexOf(q) < 0) return false;
      return true;
    }
    function apply() {
      var n = 0;
      items.forEach(function (it) { var m = match(it); it.hidden = !m; if (m) n++; });
      chips.forEach(function (c) {
        var f = c.getAttribute('data-f'), v = c.getAttribute('data-v');
        c.setAttribute('aria-pressed', st[f].indexOf(v) > -1 ? 'true' : 'false');
        c.querySelector('.c-n').textContent = items.filter(function (it) { return match(it, f) && it.getAttribute('data-' + f) === v; }).length;
      });
      countOut.textContent = 'Showing ' + n + ' of ' + items.length + ' notices';
      nEmpty.hidden = n > 0;
      setURL({ type: st.type.join(','), status: st.status.join(','), q: qIn.value.trim() });
      var q = qIn.value.trim();
      if (/^\d{2}\/\d{4}$/.test(q)) items.forEach(function (it) { if (!it.hidden) it.querySelector('details').open = true; });
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-f'), v = c.getAttribute('data-v'), i = st[f].indexOf(v);
        if (i > -1) st[f].splice(i, 1); else st[f].push(v);
        apply();
      });
    });
    qIn.addEventListener('input', apply);
    $$('[data-f-clear]').forEach(function (b) { b.addEventListener('click', function () { st.type = []; st.status = []; qIn.value = ''; apply(); chips[0].focus(); }); });
    apply();
  }
})();
