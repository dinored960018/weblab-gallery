// Garfi.Studio — behaviour for the BOC.STUDIO clone study.
// Timings are my own measurements of the original (SPEC "모션"): enter 800 ms measured curve, rows 150 ms stagger,
// info panel 500/460 ms, filter 450 ms, pills .16/.24 s, cookie bar 666 ms.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } } };

  /* ---------- tween helpers ---------- */
  // measured progress of the original enter move (header 419→0 px), sampled every 8.3 % of its 800 ms
  const ENTER = [0, .0003, .0019, .0071, .0197, .0419, .0807, .1427, .2368, .3641, .5433, .7856, 1];
  const table = (tb) => (t) => { const x = Math.min(1, Math.max(0, t)) * (tb.length - 1); const i = Math.floor(x); return i >= tb.length - 1 ? 1 : tb[i] + (tb[i + 1] - tb[i]) * (x - i); };
  const E = {
    enter: table(ENTER),
    expoIn: (t) => (t <= 0 ? 0 : (Math.pow(2, 10 * t) - 1) / 1023),
    inOut: (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    out: (t) => 1 - Math.pow(1 - t, 3),
  };
  const tween = (dur, ease, fn) => new Promise((res) => {
    if (reduce) { fn(1); return res(); }
    const t0 = performance.now();
    const step = (now) => { const t = Math.min(1, (now - t0) / dur); fn(ease(t)); t < 1 ? requestAnimationFrame(step) : res(); };
    requestAnimationFrame(step);
  });
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

  /* ---------- clock ---------- */
  const clockT = $('#clock-t'), clockS = $('#clock-s'), clock = $('#clock');
  function tick() {
    if (!clockT) return;
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23', timeZoneName: 'short' }).formatToParts(now);
    const g = (t) => (parts.find((p) => p.type === t) || {}).value;
    const tz = /\+2/.test(g('timeZoneName')) ? 'CEST' : 'CET';
    clockT.textContent = `${g('hour')}:${g('minute')} ${tz}`;
    const h = +g('hour'), wd = g('weekday');
    const on = !['Sat', 'Sun'].includes(wd) && h >= 9 && h < 19;
    clockS.textContent = on ? 'Online' : 'Offline';
  }
  tick(); setInterval(tick, 15000);
  clock && clock.addEventListener('click', () => { location.href = 'mailto:hola@garfi.studio'; });

  /* ---------- cursor pill ---------- */
  const pill = $('#pill'), pillT = $('#pill-t');
  const PILL = { enter: ['Click to enter', 112.75], play: ['Play video', 104.77], balloon: ['Say hola!', 114] };
  let pillType = null, px = -200, py = -200, tx = -200, ty = -200;
  function setPill(type) {
    if (!pill || type === pillType) return;
    pillType = type;
    if (type) { pillT.innerHTML = (type === 'play' ? '<svg viewBox="0 0 10 10" width="9" height="9" fill="currentColor"><path d="M2 1l7 4-7 4z"/></svg>' : '') + PILL[type][0]; pill.style.setProperty('--pw', PILL[type][1] + 'px'); pill.classList.add('is-on'); }
    else pill.classList.remove('is-on');
  }
  function pillAt(target) {
    const host = target && target.closest && target.closest('[data-pill]');
    let type = host ? host.dataset.pill : null;
    if (type === 'play' && host.classList.contains('is-play')) type = null;
    if (body.classList.contains('is-intro') && body.classList.contains('is-ready') && !type) type = 'enter';
    setPill(type);
  }
  addEventListener('scroll', () => { if (pillType && tx > 0) pillAt(document.elementFromPoint(tx, ty)); }, { passive: true });
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    tx = e.clientX; ty = e.clientY;
    const host = e.target.closest && e.target.closest('[data-pill]');
    let type = host ? host.dataset.pill : null;
    if (type === 'play' && host.classList.contains('is-play')) type = null;
    if (body.classList.contains('is-intro') && body.classList.contains('is-ready') && !type) type = 'enter';
    setPill(type);
  }, { passive: true });
  document.addEventListener('pointerleave', () => setPill(null));
  (function follow() { px += (tx - px) * .35; py += (ty - py) * .35; if (pill) pill.style.transform = `translate3d(${px}px, ${py}px, 0)`; requestAnimationFrame(follow); })();

  /* ---------- info panel ---------- */
  const infoBtn = $('#info-btn'), infoWrap = $('#info-wrap'), info = $('#info');
  let infoOpen = false, infoBusy = null;
  async function setInfo(open) {
    if (!infoWrap || open === infoOpen) return;
    infoOpen = open; infoBtn.setAttribute('aria-expanded', String(open));
    const from = open ? -100 : 0, to = open ? 0 : -100;
    const token = infoBusy = {};
    if (open) { infoWrap.classList.add('is-open'); infoWrap.classList.remove('is-closing'); }
    else { infoWrap.classList.add('is-closing'); infoWrap.classList.remove('is-open'); }
    await tween(open ? 500 : 460, open ? E.out : E.expoIn, (p) => { if (token === infoBusy) info.style.transform = `translateY(${from + (to - from) * p}%)`; });
    if (token === infoBusy && !open) infoWrap.classList.remove('is-closing');
  }
  infoBtn && infoBtn.addEventListener('click', () => setInfo(!infoOpen));

  /* egg wordmark: wave on hover, scatter on click */
  const eggGs = $$('.egg-g');
  eggGs.forEach((g, i) => g.addEventListener('pointerenter', () => {
    [-1, 0, 1].forEach((d, k) => { const n = eggGs[i + d]; if (!n || n.classList.contains('scatter')) return; setTimeout(() => { n.classList.remove('wave'); void n.getBBox(); n.classList.add('wave'); }, k * 60); });
  }));
  eggGs.forEach((g) => g.addEventListener('animationend', () => g.classList.remove('wave', 'scatter')));
  const egg = $('.egg-word');
  egg && egg.addEventListener('click', () => eggGs.forEach((g) => {
    g.style.setProperty('--tx', (Math.random() * 160 - 80).toFixed(0) + 'px');
    g.style.setProperty('--ty', (-Math.random() * 120).toFixed(0) + 'px');
    g.style.setProperty('--rot', (Math.random() * 90 - 45).toFixed(0) + 'deg');
    g.style.setProperty('--sc', (0.7 + Math.random() * 0.6).toFixed(2));
    g.classList.remove('wave'); void g.getBBox(); g.classList.add('scatter');
  }));

  /* ---------- dialogs (service + cookies) ---------- */
  let openPop = null, lastFocus = null;
  function showPop(pop) {
    if (openPop) hidePop(openPop, true);
    lastFocus = document.activeElement; openPop = pop;
    pop.hidden = false; pop.classList.remove('is-closing');
    requestAnimationFrame(() => requestAnimationFrame(() => pop.classList.add('is-open')));
    const card = $('.pop-card', pop); card.focus({ preventScroll: true });
  }
  function hidePop(pop, instant) {
    pop.classList.remove('is-open');
    if (instant) { pop.hidden = true; } else { pop.classList.add('is-closing'); setTimeout(() => { pop.classList.remove('is-closing'); if (!pop.classList.contains('is-open')) pop.hidden = true; }, 400); }
    if (openPop === pop) openPop = null;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  $$('[data-svc]').forEach((b) => b.addEventListener('click', () => { const pop = $('#svc-' + b.dataset.svc); pop && showPop(pop); }));
  $$('.pop').forEach((pop) => {
    pop.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) hidePop(pop); });
    pop.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('button, a[href]', pop).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && (document.activeElement === f[0] || document.activeElement.classList.contains('pop-card'))) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  });

  /* cookie bar */
  const cookie = $('#cookie'), ckPop = $('#cookie-pop');
  const cookieDone = () => { store.set('garfi-cookie', '1'); cookie && cookie.classList.add('is-gone'); };
  function showCookie(delay) { if (!cookie || store.get('garfi-cookie')) { cookie && cookie.classList.add('is-gone'); return; } setTimeout(() => { cookie.classList.add('is-in'); if (!reduce) cookie.animate([{ opacity: 0, transform: 'translateY(23px)' }, { opacity: 1, transform: 'none' }], { duration: 666, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }); }, delay); }
  $$('[data-ck]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.ck;
    if (k === 'info') { $('.ck', ckPop).classList.remove('is-legal'); showPop(ckPop); }
    else if (k === 'more') { $('.ck', ckPop).classList.add('is-legal'); $('.pop-card', ckPop).focus({ preventScroll: true }); }
    else { cookieDone(); if (openPop === ckPop) hidePop(ckPop); }
  }));

  /* ESC closes the top-most layer (a11y minimum — see SPEC) */
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (openPop) { hidePop(openPop); return; }
    if (fltOpen) { setFilter(false); fltBtn.focus(); return; }
    if (infoOpen) { setInfo(false); infoBtn.focus(); }
  });

  /* ---------- work list: filter + rows ---------- */
  const fltBtn = $('#flt-btn'), fltWrap = $('#flt-wrap'), fltCur = $('#flt-cur'), crumbCat = $('#crumb-cat');
  const rows = $$('.row');
  rows.forEach((r) => r.classList.add('row-in'));
  const LABEL = {}; $$('[data-cat]').forEach((b) => { if (b.dataset.cat !== 'all') LABEL[b.dataset.cat] = b.textContent; });
  let fltOpen = false, current = 'all';
  function setFilter(open) {
    if (!fltWrap) return;
    fltOpen = open; fltBtn.setAttribute('aria-expanded', String(open)); fltWrap.classList.toggle('is-open', open);
    $$('[data-cat]', fltWrap).forEach((b) => (b.tabIndex = open ? 0 : -1));
    $$('.flt-list li', fltWrap).forEach((li, i) => (li.style.transitionDelay = open ? `${i * 30}ms` : '0ms'));
  }
  function applyCat(cat, animate) {
    current = cat;
    const label = cat === 'all' ? 'All' : LABEL[cat];
    fltCur.textContent = label; crumbCat.textContent = label;
    fltCur.setAttribute('aria-label', cat === 'all' ? 'Show all projects' : `Current filter: ${label}. Show all projects`);
    $$('[data-cat-li]').forEach((li) => (li.hidden = li.dataset.catLi === cat || (cat === 'all' && li.dataset.catLi === 'all')));
    let n = 0;
    rows.forEach((r) => {
      const show = cat === 'all' || r.dataset.cats.split(' ').includes(cat);
      r.classList.toggle('is-hidden', !show);
      if (show && animate) { r.classList.remove('is-in'); const d = n++ * 150; setTimeout(() => r.classList.add('is-in'), 30 + d); }
    });
    try { const u = new URL(location.href); if (cat === 'all') u.searchParams.delete('cat'); else u.searchParams.set('cat', cat); history.replaceState(null, '', u); } catch (e) { /* file:// */ }
  }
  if (fltBtn) {
    fltBtn.addEventListener('click', () => setFilter(!fltOpen));
    $$('[data-cat]', fltWrap).forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = b.dataset.cat;
      setTimeout(() => setFilter(false), reduce ? 0 : 350);
      setTimeout(() => { applyCat(cat, true); fltBtn.focus({ preventScroll: true }); }, reduce ? 0 : 880);
    }));
    fltCur.addEventListener('click', (e) => { if (current !== 'all') { e.preventDefault(); applyCat('all', true); } else if (body.classList.contains('is-home') || body.classList.contains('is-list')) { e.preventDefault(); } });
    const q = new URLSearchParams(location.search).get('cat');
    if (q && LABEL[q]) applyCat(q, false);
  }
  function revealList(startDelay) {
    $$('.side-in').forEach((el) => setTimeout(() => el.classList.add('is-in'), startDelay));
    let n = 0;
    rows.forEach((r) => { if (r.classList.contains('is-hidden')) return; const d = startDelay + 50 + n++ * 150; setTimeout(() => r.classList.add('is-in'), d); });
  }

  /* ---------- home: loader → showreel → enter ---------- */
  const bar = $('#bar'), loader = $('#loader'), reel = $('#reel'), track = $('#bar-track');
  const page = $('#main');
  let entered = !body.classList.contains('is-intro');

  function runReel() {
    if (!reel) return () => {};
    const im = $('img', reel); const frames = [im.getAttribute('src'), ...reel.dataset.frames.split(' ')]; frames.forEach((f) => { const p = new Image(); p.src = f; });
    let i = 0; let t;
    const show = () => { im.classList.remove('is-on'); im.src = frames[i % frames.length]; void im.offsetWidth; im.classList.add('is-on'); if (i < frames.length && !reduce) im.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }); i++; t = setTimeout(show, 1150); };
    show();
    return () => clearTimeout(t);
  }

  async function loaderSeq() {
    const marks = $$('[data-mark]', track);
    const vw = innerWidth;
    // the mark nearest to the centre is the one the loader scales down
    const centre = marks.map((m) => { const r = m.getBoundingClientRect(); return { m, d: Math.abs(r.left + r.width / 2 - vw / 2), x: r.left + r.width / 2 }; }).sort((a, b) => a.d - b.d);
    const main = centre[0].m;
    body.classList.add('is-loading'); main.classList.add('is-main');
    track.style.animationPlayState = 'paused';
    const others = $$('.bar-group > *', track).filter((el) => el !== main);
    others.forEach((el) => (el.style.opacity = '0'));
    main.style.transformOrigin = '50% 50%';
    main.style.transform = 'scale(4)';
    main.style.position = 'relative'; main.style.zIndex = '60';
    await (document.fonts ? document.fonts.ready : Promise.resolve());
    await wait(250);
    const h = innerHeight, bh = 61, target = (h - bh) / 2;
    tween(1311, E.inOut, (p) => (main.style.transform = `scale(${4 - 3 * p})`));
    await wait(970);
    let stopReel = runReel();
    await tween(760, E.expoIn, (p) => { loader.style.clipPath = `inset(${(target * p).toFixed(1)}px 0 ${(target * p).toFixed(1)}px 0)`; });
    loader.classList.add('is-done');
    body.classList.remove('is-loading');
    await wait(80);
    main.style.transform = ''; main.style.zIndex = '';
    track.style.animationPlayState = '';
    // other items fade in by distance from the centre, 300 ms apart (measured delays 0…1800)
    const withD = others.map((el) => { const r = el.getBoundingClientRect(); return { el, d: Math.abs(r.left + r.width / 2 - vw / 2) }; }).sort((a, b) => a.d - b.d);
    withD.forEach(({ el }, k) => { const delay = Math.min(1800, Math.floor(k / 2) * 300); el.style.opacity = ''; el.style.animation = reduce ? 'none' : `marqueeIn 350ms linear ${delay}ms both`; });
    body.classList.add('is-marquee-in');
    body.classList.add('is-ready');
    showCookie(840);
    return stopReel;
  }

  async function enter(stopReel) {
    if (entered) return; entered = true;
    setPill(null);
    body.classList.remove('is-ready');
    const vh = innerHeight;
    const startY = (vh - 61) / 2;
    const items = $$('.bar-group > *', track);
    // the first mark fully on screen flies to the header logo spot
    const flyer = $$('[data-mark]', track).find((m) => m.getBoundingClientRect().left >= 0) || $('[data-mark]', track);
    track.style.animationPlayState = 'paused';
    const fr = flyer.getBoundingClientRect();
    const br = bar.getBoundingClientRect();
    const fx0 = fr.left, fy0 = fr.top - br.top;               // position inside the bar
    const lg = $('.bar-logo svg'); const lr = lg.getBoundingClientRect();
    const fx1 = lr.left, fy1 = (38 - lr.height) / 2, sc = lr.height / fr.height;
    flyer.style.transformOrigin = '0 0';
    items.filter((el) => el !== flyer).sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left)
      .forEach((el, k) => { el.style.animation = 'none'; el.style.transition = `opacity 200ms linear ${k * 13}ms`; requestAnimationFrame(() => (el.style.opacity = '0')); });
    page.style.transform = `translateY(${vh}px)`;
    body.classList.remove('is-intro');
    body.classList.add('is-entering');
    bar.style.height = '61px';
    await tween(800, E.enter, (p) => {
      bar.style.transform = `translateY(${(startY * (1 - p)).toFixed(2)}px)`;
      bar.style.height = `${(61 - 23 * p).toFixed(2)}px`;
      if (reel) reel.style.transform = `translateY(${(-100 * p).toFixed(3)}%)`;
      page.style.transform = `translateY(${(vh * (1 - p)).toFixed(2)}px)`;
      flyer.style.transform = `translate(${((fx1 - fx0) * p).toFixed(2)}px, ${((fy1 - fy0 - (61 - 38) / 2 * 0) * p).toFixed(2)}px) scale(${1 + (sc - 1) * p})`;
    });
    bar.style.transform = ''; bar.style.height = ''; page.style.transform = '';
    if (reel) { reel.classList.add('is-gone'); stopReel && stopReel(); }
    body.classList.remove('is-entering'); body.classList.add('is-entered');
    const right = $('.bar-right'); right.style.animation = reduce ? 'none' : 'barFadeIn 400ms linear both';
    revealList(0);
    scrollTo(0, 0);
  }

  if (!entered && track) {
    let stopReel = null;
    const ready = loaderSeq().then((s) => (stopReel = s));
    const go = (e) => { if (e && e.cancelable && (e.type === 'wheel' || e.type === 'touchmove')) e.preventDefault(); if (!body.classList.contains('is-ready')) return; if (e && e.type === 'keydown' && !['Enter', ' ', 'ArrowDown', 'PageDown'].includes(e.key)) return; if (e && e.type === 'keydown' && e.target.closest('button, a')) return; e && e.preventDefault && e.cancelable && e.preventDefault(); enter(stopReel); };
    addEventListener('wheel', go, { passive: false });
    addEventListener('touchmove', go, { passive: false });
    addEventListener('keydown', go);
    addEventListener('click', (e) => { if (!e.target.closest('button, a, .cookie')) go(e); });
    ready.then(() => { /* intro waits for input */ });
  } else {
    revealList(120);
    if (!body.classList.contains('is-404')) showCookie(700);
  }

  /* ---------- case page ---------- */
  const chapBtns = $$('.chap-btn');
  if (chapBtns.length) {
    const secs = chapBtns.map((b) => $('#' + b.dataset.target));
    let active = chapBtns[0].dataset.target, lock = 0;
    const setChap = (id) => {
      if (id === active) return; active = id;
      chapBtns.forEach((b) => { const on = b.dataset.target === id; const pn = $('#cp-' + b.dataset.target); const was = pn.classList.contains('is-open'); b.setAttribute('aria-expanded', String(on)); pn.classList.toggle('is-open', on); if (reduce) return; const inner = pn.firstElementChild; if (was && !on) { pn.classList.add('is-leaving'); inner.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: 'cubic-bezier(0.34, 0, 0.75, 0.9)' }).finished.then(() => pn.classList.remove('is-leaving')); } else if (on && !was) inner.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'cubic-bezier(0.66, 0.1, 0.25, 1)' }); });
    };
    chapBtns.forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.target; setChap(id); lock = performance.now() + 900;
      const s = $('#' + id); scrollTo({ top: s.getBoundingClientRect().top + scrollY - 128 + 1, behavior: reduce ? 'auto' : 'smooth' });
    }));
    const spy = () => {
      if (performance.now() < lock) return;
      let id = secs[0].id;
      for (const s of secs) if (s.getBoundingClientRect().top <= 130) id = s.id;
      setChap(id);
    };
    addEventListener('scroll', spy, { passive: true });
  }
  // media fade-in as it enters the viewport
  $$('.stag').forEach((el, k) => setTimeout(() => el.classList.add('is-in'), 80 + (el.classList.contains('m') ? 0 : k * 150)));
  // moving stills: click plays / pauses (stands in for the original's muted videos)
  $$('.m.v').forEach((m) => {
    const btn = $('button', m), im = $('img', m); const frames = [im.getAttribute('src'), ...m.dataset.frames.split(' ')]; let t = null, i = 0;
    btn.addEventListener('click', () => {
      const on = !m.classList.contains('is-play');
      m.classList.toggle('is-play', on); btn.setAttribute('aria-pressed', String(on)); btn.setAttribute('aria-label', (on ? 'Pause video: ' : 'Play video: ') + btn.getAttribute('aria-label').split(': ').slice(1).join(': '));
      clearInterval(t);
      if (on) { frames.forEach((f) => { const p = new Image(); p.src = f; }); const cycle = () => { i++; im.src = frames[i % frames.length]; }; t = setInterval(cycle, 2200); }
      setPill(on ? null : 'play');
    });
  });
  // end reveal: next-project footer rises over the last 392 px, content dims
  const end = $('#end'), dim = $('#end-dim'), spacer = $('.end-spacer');
  if (end && spacer) {
    const upd = () => {
      const H = end.offsetHeight; spacer.style.height = H + 'px';
      const docH = document.documentElement.scrollHeight, p = Math.min(1, Math.max(0, (scrollY + innerHeight - (docH - H)) / H));
      end.style.transform = `translateY(${((1 - p) * 100).toFixed(2)}%)`;
      dim.style.opacity = (p * .62).toFixed(3);
      end.style.visibility = p > 0 ? 'visible' : 'hidden';
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }
  // sidebar card: featured project until 33 % of the scroll, contact card from 48 % (measured on the original)
  const promoFeat = $('[data-promo=feat]'), promoContact = $('[data-promo=contact]');
  if (promoContact) {
    let state = null;
    const pUpd = () => {
      const max = document.documentElement.scrollHeight - innerHeight, pr = max > 0 ? scrollY / max : 0;
      const next = pr < 0.33 ? (promoFeat ? 'feat' : null) : pr >= 0.48 ? 'contact' : null;
      if (next === state) return;
      const prev = state === 'feat' ? promoFeat : state === 'contact' ? promoContact : null;
      state = next;
      const cur = next === 'feat' ? promoFeat : next === 'contact' ? promoContact : null;
      if (prev) { if (reduce) prev.classList.remove('is-on'); else prev.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' }).finished.then(() => { if (prev !== (state === 'feat' ? promoFeat : state === 'contact' ? promoContact : null)) prev.classList.remove('is-on'); }); }
      if (cur) { cur.classList.add('is-on'); if (!reduce) cur.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' }); }
    };
    addEventListener('scroll', pUpd, { passive: true }); pUpd();
  }
  // mobile chapters
  const mc = $('#m-chap');
  if (mc) {
    const b = $('button', mc);
    if (!reduce) mc.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    b.addEventListener('click', () => { const o = !mc.classList.contains('is-open'); mc.classList.toggle('is-open', o); b.setAttribute('aria-expanded', String(o)); });
    $$('a', mc).forEach((a) => a.addEventListener('click', () => { mc.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false'); }));
  }

  /* ---------- leaving: fade the page before navigating (original route transition) ---------- */
  addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || /^https?:/.test(href)) return;
    if (reduce) return;
    e.preventDefault();
    body.style.transition = 'opacity .25s cubic-bezier(.4,0,.2,1)'; body.style.opacity = '0';
    setTimeout(() => (location.href = a.href), 260);
  });
  addEventListener('pageshow', (e) => { if (e.persisted) body.style.opacity = ''; });
})();
