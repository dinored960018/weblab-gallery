/* 여늘시립천문대 — 화면 동작 */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장이 막혀도 화면 안에서는 동작 */ } }
  };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };

  // ── 모바일 메뉴
  var menuBtn = $('.menu-btn'), nav = $('#nav');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    root.classList.toggle('menu-open', open);
    if (open) { var a = $('a', nav); if (a) a.focus(); }
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); }
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080 && root.classList.contains('menu-open')) setMenu(false); });
  }

  // ── 적색 화면
  function syncRed() { var on = root.getAttribute('data-mode') === 'red'; $$('[data-red]').forEach(function (b) { b.setAttribute('aria-pressed', String(on)); }); }
  $$('[data-red]').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = root.getAttribute('data-mode') !== 'red';
      if (!reduce) { root.classList.add('mode-anim'); setTimeout(function () { root.classList.remove('mode-anim'); }, 260); }
      if (on) root.setAttribute('data-mode', 'red'); else root.removeAttribute('data-mode');
      store.set('yeoneul-red', on ? '1' : '0');
      syncRed();
    });
  });
  syncRed();

  var Y = window.YN;
  var KIND = {}; if (Y) Y.kinds.forEach(function (k) { KIND[k[0]] = k[1]; });
  var OBJ = {}; if (Y) Y.objects.forEach(function (o) { OBJ[o.id] = o; });
  var hmOf = function (k) { var m = (18 * 60 + k * 10) % 1440; return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };
  var fmtMag = function (m) { return (m < 0 ? '−' + Math.abs(m).toFixed(1) : m.toFixed(1)); };

  // ── 오늘의 하늘
  var range = $('#t-range');
  if (range && window.Astro && window.SkyChart) {
    var fig = $('#sky-fig'), clock = $('#clock'), list = $('#up-list'), upN = $('#up-n'), selBox = $('#sel-box'), sunLine = $('#clock-sun'), clockDate = $('#clock-date');
    var q = new URLSearchParams(location.search);
    var k = 18, sel = q.get('obj') || '';
    var qt = q.get('t');
    if (qt && /^\d{4}$/.test(qt)) {
      var mins = (+qt.slice(0, 2)) * 60 + (+qt.slice(2));
      var kk = Math.round((((mins - 18 * 60) + 1440) % 1440) / 10);
      if (kk >= 0 && kk <= 66) k = kk;
    }
    if (sel && !OBJ[sel]) sel = '';
    var lastUp = [];
    var draw = function (kf) {
      var ms = Y.t0 + kf * Y.step;
      var r = SkyChart.drawSky(Astro, Y, ms, { sel: sel, title: '10월 ' + (kf >= 36 ? 6 : 5) + '일 ' + hmOf(Math.round(kf)) + ' 하늘' });
      fig.innerHTML = r.svg;
      return r;
    };
    var sunState = function (ms) {
      var s = Astro.sun(ms), a = Astro.altaz(s.ra, s.dec, ms, Y.site.lat, Y.site.lon).alt;
      var st = a > -0.8 ? '해가 떠 있다' : a > -6 ? '시민박명' : a > -12 ? '항해박명' : a > -18 ? '천문박명' : '박명 없음 — 가장 어두운 하늘';
      return '해 고도 ' + (a < 0 ? '−' : '') + Math.abs(Math.round(a)) + '° · ' + st;
    };
    var renderSel = function () {
      if (!sel) { selBox.innerHTML = '<p class="sel-empty">성도나 목록에서 천체를 고르면 고도·방위가 여기 나온다.</p>'; return; }
      var o = OBJ[sel], u = null;
      lastUp.forEach(function (x) { if (x.id === sel) u = x; });
      var h = u ? '<dl class="sel-dl"><div><dt>고도</dt><dd class="num">' + Math.round(u.alt) + '°</dd></div><div><dt>방위</dt><dd class="num">' + Math.round(u.az) + '°</dd></div><div><dt>등급</dt><dd class="num">' + fmtMag(o.mag) + '</dd></div></dl>'
        : '<p class="sel-below">이 시각에는 지평선 아래에 있다.' + (o.rise ? ' 뜨는 시각 <span class="num">' + o.rise + '</span>.' : '') + '</p>';
      selBox.innerHTML = '<p class="sel-kind">' + KIND[o.kind] + ' · ' + esc(o.con) + '</p><h2 class="sel-name">' + esc(o.name) + '</h2>' + h +
        '<p class="sel-links"><a href="../catalog/index.html?obj=' + o.id + '">도감에서 보기</a> <button type="button" class="btn-t" data-unpick>고른 천체 지우기</button></p>';
    };
    var render = function () {
      var r = draw(k);
      lastUp = r.up;
      var t = hmOf(k);
      clock.textContent = t;
      clockDate.textContent = k >= 36 ? '10월 6일' : '10월 5일';
      range.value = String(k);
      range.setAttribute('aria-valuetext', (k >= 36 ? '10월 6일 ' : '10월 5일 ') + t);
      sunLine.textContent = sunState(Y.t0 + k * Y.step);
      upN.textContent = String(r.up.length);
      list.innerHTML = r.up.map(function (u) {
        return '<li><button type="button" data-pick="' + u.id + '"' + (u.id === sel ? ' aria-pressed="true"' : ' aria-pressed="false"') + '><span>' + esc(u.name) + '</span><span class="num">' + Math.round(u.alt) + '° · ' + Math.round(u.az) + '°</span></button></li>';
      }).join('');
      renderSel();
      var p = new URLSearchParams();
      p.set('t', t.replace(':', ''));
      if (sel) p.set('obj', sel);
      history.replaceState(null, '', '?' + p.toString());
    };
    var anim = null;
    var goTo = function (target) {
      if (anim) cancelAnimationFrame(anim);
      if (reduce || target === k) { k = target; render(); return; }
      var from = k, t0 = performance.now(), dur = 600;
      var ease = function (x) { return 1 - Math.pow(1 - x, 3); };
      var step = function (now) {
        var x = Math.min(1, (now - t0) / dur), kf = from + (target - from) * ease(x);
        if (x < 1) { draw(kf); clock.textContent = hmOf(Math.round(kf)); anim = requestAnimationFrame(step); }
        else { anim = null; k = target; render(); }
      };
      anim = requestAnimationFrame(step);
    };
    range.addEventListener('input', function () { if (anim) { cancelAnimationFrame(anim); anim = null; } k = +range.value; render(); });
    $$('[data-goto]').forEach(function (b) { b.addEventListener('click', function () { goTo(+b.getAttribute('data-goto')); }); });
    $$('[data-step]').forEach(function (b) { b.addEventListener('click', function () { goTo(Math.max(0, Math.min(66, k + (+b.getAttribute('data-step'))))); }); });
    document.addEventListener('click', function (e) {
      var pick = e.target.closest('[data-pick]'), g = e.target.closest('.sky-obj'), un = e.target.closest('[data-unpick]');
      if (pick) { sel = pick.getAttribute('data-pick'); render(); var b = $('[data-pick="' + sel + '"]', list); if (b) b.focus(); }
      else if (g) { sel = g.getAttribute('data-obj'); render(); }
      else if (un) { sel = ''; render(); range.focus(); }
    });
    render();
  }

  // ── 고도 곡선 (build.mjs curveSvg 와 같은 그림)
  function curveSvg(curve, label) {
    var w = 560, h = 180, L = 34, Rr = 8, Tp = 10, B = 26, iw = w - L - Rr, ih = h - Tp - B, n = Y.npts;
    var x = function (k) { return L + (k / (n - 1)) * iw; }, y = function (a) { return Tp + ih - (Math.max(-10, a) + 10) / 100 * ih; };
    var kd = (Y.dusk - Y.t0) / Y.step, kn = (Y.dawn - Y.t0) / Y.step, d = '';
    curve.forEach(function (a, k) { d += (k ? 'L' : 'M') + x(k).toFixed(1) + ' ' + y(a).toFixed(1); });
    var g = '';
    [0, 30, 60, 90].forEach(function (a) { g += '<line class="cv-grid' + (a === 0 ? ' zero' : '') + '" x1="' + L + '" x2="' + (L + iw) + '" y1="' + y(a).toFixed(1) + '" y2="' + y(a).toFixed(1) + '"/><text class="cv-a" x="' + (L - 6) + '" y="' + (y(a) + 4).toFixed(1) + '">' + a + '°</text>'; });
    [0, 12, 24, 36, 48, 60].forEach(function (k) { g += '<line class="cv-grid" x1="' + x(k).toFixed(1) + '" x2="' + x(k).toFixed(1) + '" y1="' + Tp + '" y2="' + (Tp + ih) + '"/><text class="cv-t" x="' + x(k).toFixed(1) + '" y="' + (h - 8) + '">' + pad((18 + k / 6) % 24) + '</text>'; });
    return '<svg class="curve" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label) + '"><rect class="cv-dark" x="' + x(kd).toFixed(1) + '" y="' + Tp + '" width="' + (x(kn) - x(kd)).toFixed(1) + '" height="' + ih + '"/>' + g + '<path class="cv-line" d="' + d + '"/></svg>';
  }

  // ── 천체 도감
  var cat = $('#cat');
  if (cat && Y) {
    var tbody = $('tbody', cat), rows = $$('tr', tbody), countEl = $('#cat-n'), emptyEl = $('#cat-empty'), sortSel = $('#sort');
    var drawer = $('#drawer'), dwBody = $('#dw-body'), opener = null;
    var MAGS = {}; Y.mags.forEach(function (m) { MAGS[m[0]] = [m[2], m[3]]; });
    var F = { kind: [], season: [], mag: [], tonight: [] }, sortBy = 'mag', openId = '';
    var q2 = new URLSearchParams(location.search);
    Object.keys(F).forEach(function (g) { var v = q2.get(g); if (v) F[g] = v.split(',').filter(Boolean); });
    if (q2.get('sort')) sortBy = q2.get('sort');
    if (!/^(mag|name|transit|alt)$/.test(sortBy)) sortBy = 'mag';
    openId = q2.get('obj') && OBJ[q2.get('obj')] ? q2.get('obj') : '';
    var tmin = function (t) { var m = +t.slice(0, 2) * 60 + +t.slice(3); return (m - 12 * 60 + 1440) % 1440; };
    var apply = function (push) {
      $$('.chip[data-f]').forEach(function (c) { c.setAttribute('aria-pressed', String(F[c.getAttribute('data-f')].indexOf(c.getAttribute('data-v')) > -1)); });
      sortSel.value = sortBy;
      var n = 0;
      var vis = rows.filter(function (r) {
        var o = OBJ[r.getAttribute('data-id')];
        var ok = (!F.kind.length || F.kind.indexOf(o.kind) > -1)
          && (!F.season.length || o.season === 'all' || F.season.indexOf(o.season) > -1)
          && (!F.mag.length || F.mag.some(function (m) { var b = MAGS[m]; return o.mag >= b[0] && o.mag < b[1]; }))
          && (!F.tonight.length || o.tonight);
        r.hidden = !ok; if (ok) n++;
        return ok;
      });
      var cmp = {
        mag: function (a, b) { return a.mag - b.mag; },
        name: function (a, b) { return a.name.localeCompare(b.name, 'ko'); },
        transit: function (a, b) { return tmin(a.transit) - tmin(b.transit); },
        alt: function (a, b) { return b.maxAlt - a.maxAlt; }
      }[sortBy];
      rows.slice().sort(function (a, b) { return cmp(OBJ[a.getAttribute('data-id')], OBJ[b.getAttribute('data-id')]); }).forEach(function (r) { tbody.appendChild(r); });
      countEl.textContent = String(n);
      emptyEl.hidden = n > 0;
      cat.hidden = n === 0;
      var p = new URLSearchParams();
      Object.keys(F).forEach(function (g) { if (F[g].length) p.set(g, F[g].join(',')); });
      if (sortBy !== 'mag') p.set('sort', sortBy);
      if (openId) p.set('obj', openId);
      var s = p.toString();
      history[push ? 'pushState' : 'replaceState'](null, '', s ? '?' + s : location.pathname);
      return vis;
    };
    $$('.chip[data-f]').forEach(function (c) {
      c.addEventListener('click', function () {
        var g = c.getAttribute('data-f'), v = c.getAttribute('data-v'), i = F[g].indexOf(v);
        if (i > -1) F[g].splice(i, 1); else F[g].push(v);
        apply(false);
      });
    });
    sortSel.addEventListener('change', function () { sortBy = sortSel.value; apply(false); });
    var clear = function () { Object.keys(F).forEach(function (g) { F[g] = []; }); apply(false); };
    $('#f-clear').addEventListener('click', clear);
    $$('[data-clear]').forEach(function (b) { b.addEventListener('click', function () { clear(); $('#f-clear').focus(); }); });

    var descOf = function (id) { var t = $('#obj-desc'); var p = t && t.content.querySelector('[data-desc="' + id + '"]'); return p ? p.textContent : ''; };
    var ra = function (h) { var hh = Math.floor(h), mm = Math.floor((h - hh) * 60); return pad(hh) + 'h ' + pad(mm) + 'm'; };
    var dec = function (d) { var s = d < 0 ? '−' : '+', a = Math.abs(d), dd = Math.floor(a), mm = Math.min(59, Math.round((a - dd) * 60)); return s + pad(dd) + '° ' + pad(mm) + '′'; };
    var openObj = function (id, focusFrom) {
      var o = OBJ[id]; if (!o) return;
      openId = id; opener = focusFrom || opener;
      var kMax = Math.round(((+o.maxAt.slice(0, 2) * 60 + +o.maxAt.slice(3)) - 18 * 60 + 1440) % 1440 / 10);
      if (kMax > 66) kMax = 66;
      dwBody.innerHTML = '<p class="sel-kind">' + KIND[o.kind] + ' · ' + esc(o.con) + '자리</p>'.replace('—자리', '—') +
        '<h2 id="dw-title" tabindex="-1">' + esc(o.name) + '</h2>' +
        '<p class="dw-desc">' + esc(descOf(id)) + '</p>' +
        '<dl class="facts dw-facts">' +
        '<div><dt>겉보기 등급</dt><dd class="num">' + fmtMag(o.mag) + '</dd></div>' +
        '<div><dt>적경 · 적위</dt><dd class="num">' + ra(o.ra) + ' · ' + dec(o.dec) + '</dd></div>' +
        '<div><dt>크기</dt><dd class="num">' + esc(o.size) + '</dd></div>' +
        '<div><dt>거리</dt><dd>' + esc(o.dist) + '</dd></div>' +
        '<div><dt>장비</dt><dd>' + esc(o.equip) + '</dd></div>' +
        '<div><dt>뜨는 시각 · 지는 시각</dt><dd class="num">' + (o.rise ? o.rise + ' · ' + o.set : '지지 않음') + '</dd></div>' +
        '<div><dt>오늘 밤 최고 고도</dt><dd class="num">' + Math.round(o.maxAlt) + '° (' + o.maxAt + ')</dd></div>' +
        '</dl>' +
        '<h3 class="h-s">10월 5일 밤 고도</h3>' + curveSvg(o.curve, o.name + ' 고도 곡선, 18시부터 다음 날 5시까지') +
        '<p class="fine">옅은 띠는 천문박명이 끝난 뒤부터 다시 시작하기 전까지의 어두운 시간이다.</p>' +
        '<p><a class="btn-o" href="../sky/index.html?t=' + hmOf(kMax).replace(':', '') + '&amp;obj=' + id + '">' + hmOf(kMax) + ' 성도에서 보기</a></p>';
      drawer.hidden = false;
      root.classList.add('drawer-open');
      $('#dw-title').focus();
      apply(false);
    };
    var closeObj = function () {
      if (drawer.hidden) return;
      drawer.hidden = true; root.classList.remove('drawer-open'); openId = ''; apply(false);
      if (opener) opener.focus();
    };
    tbody.addEventListener('click', function (e) { var b = e.target.closest('[data-open]'); if (b) openObj(b.getAttribute('data-open'), b); });
    $$('[data-close]', drawer).forEach(function (b) { b.addEventListener('click', closeObj); });
    document.addEventListener('keydown', function (e) {
      if (drawer.hidden) return;
      if (e.key === 'Escape') closeObj();
      if (e.key === 'Tab') {
        var f = $$('a[href], button, [tabindex="-1"]', $('.drawer-panel')).filter(function (x) { return x.offsetParent !== null; });
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    apply(false);
    if (openId) { var ob = $('[data-open="' + openId + '"]'); openObj(openId, ob); }
  }

  // ── 예약
  var form = $('#res');
  if (form && Y) {
    var booked = {}; try { booked = JSON.parse(store.get('yeoneul-booked') || '{}') || {}; } catch (e) { booked = {}; }
    var PROG = {}; Y.programs.forEach(function (p) { PROG[p.id] = p; });
    var AGE = { saturn: 10, photo: 16 };
    var leftOf = function (s) { return Math.max(0, s.left - (booked[s.id] || 0)); };
    var D = {}; Y.dates.forEach(function (d) { D[d.iso] = d; });
    var WD = ['일', '월', '화', '수', '목', '금', '토'];
    var dLabel = function (iso) { var d = D[iso]; return '10월 ' + d.d + '일 (' + WD[d.wd] + ')'; };
    var dateSel = $('#r-date'), slotsEl = $('#r-slots'), peopleEl = $('#r-people'), total = $('#r-total'), detail = $('#r-detail');
    var cur = { p: '', date: '', s: null, n: {} };
    var won = function (n) { return n === 0 ? '0원' : n.toLocaleString('ko-KR') + '원'; };
    var err = function (id, msg, field) {
      var el = $('#e-' + id); el.textContent = msg || ''; el.hidden = !msg;
      if (field) { if (msg) { field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', 'e-' + id); } else { field.removeAttribute('aria-invalid'); } }
    };
    var setProg = function (pid) {
      cur.p = pid; cur.date = ''; cur.s = null; cur.n = {};
      var ages = AGE[pid];
      $('#c-age').hidden = !ages;
      if (ages) $('#c-age').lastChild.textContent = ' 참가자 모두 만 ' + ages + '세 이상이다';
      var dates = [];
      Y.sessions.forEach(function (s) { if (s.p === pid && dates.indexOf(s.date) < 0) dates.push(s.date); });
      dateSel.disabled = false;
      dateSel.innerHTML = '<option value="">날짜 고르기</option>' + dates.map(function (iso) {
        var ss = Y.sessions.filter(function (s) { return s.p === pid && s.date === iso; });
        var left = ss.reduce(function (a, s) { return a + leftOf(s); }, 0);
        return '<option value="' + iso + '"' + (left === 0 ? ' disabled' : '') + '>' + dLabel(iso) + (left === 0 ? ' · 마감' : ' · 잔여 ' + left) + '</option>';
      }).join('');
      slotsEl.innerHTML = '';
      renderPeople(); err('prog', '');
    };
    var setDate = function (iso) {
      cur.date = iso; cur.s = null;
      var ss = Y.sessions.filter(function (s) { return s.p === cur.p && s.date === iso; });
      slotsEl.innerHTML = ss.map(function (s) {
        var l = leftOf(s);
        return '<label class="slot-r' + (l === 0 ? ' full' : '') + '"><input type="radio" name="slot" value="' + s.id + '"' + (l === 0 ? ' disabled' : '') + '><span class="num">' + s.time + '</span><span>' + (l === 0 ? '마감' : '잔여 ' + l + ' / ' + s.cap) + '</span></label>';
      }).join('');
      if (ss.length === 1 && leftOf(ss[0]) > 0) { $('input', slotsEl).checked = true; cur.s = ss[0]; }
      renderPeople();
    };
    var renderPeople = function () {
      if (!cur.s) { peopleEl.innerHTML = '<p class="hint">회차를 고르면 요금 구분이 나온다.</p>'; sum(); return; }
      var p = PROG[cur.p];
      peopleEl.innerHTML = p.fees.map(function (f) {
        var v = cur.n[f[0]] || 0;
        return '<div class="stepper"><span class="st-l" id="l-' + f[0] + '">' + f[1] + ' <span class="num st-fee">' + (f[2] ? f[2].toLocaleString('ko-KR') + '원' : '무료') + '</span></span>' +
          '<button type="button" class="st-b" data-dn="' + f[0] + '" aria-label="' + f[1] + ' 한 명 빼기">−</button>' +
          '<input class="num st-v" type="number" inputmode="numeric" min="0" max="' + p.cap + '" value="' + v + '" data-n="' + f[0] + '" aria-labelledby="l-' + f[0] + '">' +
          '<button type="button" class="st-b" data-up="' + f[0] + '" aria-label="' + f[1] + ' 한 명 더하기">+</button></div>';
      }).join('') + '<p class="hint">이 회차 잔여석 <span class="num">' + leftOf(cur.s) + '</span>석</p>';
      sum();
    };
    var count = function () { var t = 0; Object.keys(cur.n).forEach(function (k) { t += cur.n[k] || 0; }); return t; };
    var sum = function () {
      if (!cur.s) { total.textContent = '0원'; detail.textContent = '회차를 고르지 않았다.'; return; }
      var p = PROG[cur.p], amt = 0, parts = [];
      p.fees.forEach(function (f) { var n = cur.n[f[0]] || 0; if (n) { amt += n * f[2]; parts.push(f[1].replace(/ \(.*\)/, '') + ' ' + n); } });
      total.textContent = won(amt);
      detail.textContent = p.name + ' · ' + dLabel(cur.s.date) + ' ' + cur.s.time + (parts.length ? ' · ' + parts.join(', ') : ' · 인원 0명');
    };
    form.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'prog') setProg(t.value);
      else if (t === dateSel) setDate(t.value);
      else if (t.name === 'slot') { Y.sessions.forEach(function (s) { if (s.id === t.value) cur.s = s; }); renderPeople(); err('slot', ''); }
      else if (t.hasAttribute('data-n')) { cur.n[t.getAttribute('data-n')] = Math.max(0, Math.min(99, parseInt(t.value, 10) || 0)); t.value = cur.n[t.getAttribute('data-n')]; sum(); }
    });
    form.addEventListener('click', function (e) {
      var up = e.target.closest('[data-up]'), dn = e.target.closest('[data-dn]');
      if (!up && !dn) return;
      var key = (up || dn).getAttribute(up ? 'data-up' : 'data-dn');
      cur.n[key] = Math.max(0, (cur.n[key] || 0) + (up ? 1 : -1));
      var inp = $('[data-n="' + key + '"]', peopleEl); if (inp) inp.value = cur.n[key];
      sum(); err('people', '');
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = [];
      var check = function (ok, id, msg, field) { err(id, ok ? '' : msg, field); if (!ok) bad.push(field || $('#e-' + id)); };
      check(!!cur.p, 'prog', '프로그램을 고르지 않았다.', $('input[name="prog"]'));
      check(!!cur.s, 'slot', cur.p ? '날짜와 회차를 고르지 않았다.' : '프로그램을 먼저 고른다.', cur.p ? (cur.date ? $('input[name="slot"]:not([disabled])', slotsEl) || dateSel : dateSel) : null);
      if (cur.s) {
        var n = count(), left = leftOf(cur.s), msg = '';
        if (n < 1) msg = '인원이 0명이다. 1명 이상 적는다.';
        else if (n > left) msg = '인원 ' + n + '명이 잔여석 ' + left + '석보다 많다.';
        else if (cur.p === 'kids' && !(cur.n.child > 0)) msg = '어린이가 1명 이상이어야 한다.';
        else if (cur.p === 'kids' && (cur.n.guardian || 0) < Math.ceil((cur.n.child || 0) / 3)) msg = '어린이 ' + cur.n.child + '명에는 보호자가 ' + Math.ceil(cur.n.child / 3) + '명 이상 필요하다.';
        else if (cur.p === 'evening' && (cur.n.adult || 0) === 0 && n > 0) msg = '성인 보호자가 1명 이상 함께 와야 한다.';
        check(!msg, 'people', msg, $('[data-n]', peopleEl));
      }
      var name = $('#r-name'), tel = $('#r-tel'), mail = $('#r-mail');
      check(name.value.trim().length >= 2, 'name', '이름을 두 글자 이상 적는다.', name);
      check(/^01[016789]-?\d{3,4}-?\d{4}$/.test(tel.value.trim()), 'tel', '휴대전화 번호 형식이 맞지 않다. 예: 010-1234-5678', tel);
      check(!mail.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim()), 'mail', '이메일 형식이 맞지 않다.', mail);
      if (AGE[cur.p]) check($('#r-age16').checked, 'age', '나이 조건을 확인하지 않았다.', $('#r-age16'));
      else err('age', '');
      check($('#r-agree').checked, 'agree', '개인정보 이용에 동의하지 않았다.', $('#r-agree'));
      if (bad.length) { var f0 = bad.filter(Boolean)[0]; if (f0 && f0.focus) f0.focus(); return; }
      booked[cur.s.id] = (booked[cur.s.id] || 0) + count();
      store.set('yeoneul-booked', JSON.stringify(booked));
      var p = PROG[cur.p], rows = [['프로그램', p.name], ['회차', dLabel(cur.s.date) + ' ' + cur.s.time], ['인원', detail.textContent.split(' · ').slice(2).join(' · ')], ['금액', total.textContent], ['신청자', name.value.trim() + ' · ' + tel.value.trim()], ['남은 자리', leftOf(cur.s) + '석']];
      $('#done-list').innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
      form.hidden = true; var done = $('#done'); done.hidden = false; done.focus();
    });
    $('#again').addEventListener('click', function () {
      form.reset(); form.hidden = false; $('#done').hidden = true;
      cur = { p: '', date: '', s: null, n: {} };
      dateSel.disabled = true; dateSel.innerHTML = '<option value="">프로그램을 먼저 고른다</option>'; slotsEl.innerHTML = ''; $('#c-age').hidden = true; renderPeople();
      $('input[name="prog"]').focus();
    });
    // 주소로 회차 지정 (?session= 또는 ?program=)
    var q3 = new URLSearchParams(location.search), sid = q3.get('session'), pid = q3.get('program');
    var ses = null; Y.sessions.forEach(function (s) { if (s.id === sid) ses = s; });
    if (ses) pid = ses.p;
    if (pid && PROG[pid]) {
      $('input[name="prog"][value="' + pid + '"]').checked = true; setProg(pid);
      if (ses) { dateSel.value = ses.date; setDate(ses.date); var r = $('input[value="' + ses.id + '"]', slotsEl); if (r && !r.disabled) { r.checked = true; cur.s = ses; renderPeople(); } }
    }
  }

  // ── 공지
  var ntList = $('.nt-list');
  if (ntList) {
    var cat0 = new URLSearchParams(location.search).get('cat') || '';
    var setCat = function (c) {
      $$('[data-nc]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-nc') === c)); });
      $$('.nt', ntList).forEach(function (li) { li.hidden = !!c && li.getAttribute('data-cat') !== c; });
      var p = new URLSearchParams(location.search); if (c) p.set('cat', c); else p.delete('cat'); p.delete('open');
      var s = p.toString(); history.replaceState(null, '', s ? '?' + s : location.pathname);
    };
    $$('[data-nc]').forEach(function (b) { b.addEventListener('click', function () { setCat(b.getAttribute('data-nc')); }); });
    var toggle = function (btn, open) {
      var body = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(open)); body.hidden = !open;
    };
    $$('.nt-btn', ntList).forEach(function (b) { b.addEventListener('click', function () { toggle(b, b.getAttribute('aria-expanded') !== 'true'); }); });
    if (['run', 'session', 'event', 'weather'].indexOf(cat0) > -1) setCat(cat0);
    var op = new URLSearchParams(location.search).get('open');
    if (op && document.getElementById(op)) { var ob2 = $('.nt-btn', document.getElementById(op)); toggle(ob2, true); ob2.focus(); }
  }
})();
