(() => {
  const html = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PAL = window.__PAL;
  const page = document.body.dataset.page;
  const T0 = performance.now();
  const at = (ms, fn) => setTimeout(fn, Math.max(0, ms - (performance.now() - T0)));
  const vw = () => window.innerWidth;
  const U = () => (vw() > 1024 ? vw() / 1440 : vw() > 767 ? vw() / 1024 : 1);

  /* ───────── time of day → palette ───────── */
  const lerp = (a, b, t) => a + (b - a) * t;
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  function paletteAt(h) {
    let i = 0; while (i < PAL.length - 2 && PAL[i + 1][0] <= h) i++;
    const [h0, b0, f0] = PAL[i], [h1, b1, f1] = PAL[i + 1];
    const t = h1 === h0 ? 0 : (h - h0) / (h1 - h0);
    const bg = b0.map((v, k) => Math.round(lerp(v, b1[k], t)));
    let fg = f0.map((v, k) => Math.round(lerp(v, f1[k], t)));
    // origin passes through gold text on a mid-tone ground at dawn and dusk; keep 4.5:1 (SPEC 5절)
    if (ratio(fg, bg) < 4.5) {
      const tgt = ratio([255, 255, 255], bg) >= ratio([0, 0, 0], bg) ? 255 : 0;
      for (let s = 0; s < 40 && ratio(fg, bg) < 4.5; s++) fg = fg.map(v => Math.round(lerp(v, tgt, .12)));
    }
    return { bg, fg };
  }
  const nowMinutes = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60; };
  let travel = null; // minutes offset from now while time travelling
  let knobDeg = 0;
  const mod = (a, n) => ((a % n) + n) % n;
  function shownMinutes() { return mod(nowMinutes() + (travel || 0), 1440); }
  function paint() {
    const m = shownMinutes();
    const { bg, fg } = paletteAt(m / 60);
    const b = lum(bg);
    const bright = Math.min(1, Math.max(0, (b - lum([44, 41, 34])) / (lum([248, 246, 242]) - lum([44, 41, 34]))));
    html.style.setProperty('--bg', `rgb(${bg})`);
    html.style.setProperty('--fg', `rgb(${fg})`);
    html.style.setProperty('--bg-dim', `rgb(${bg.map(v => Math.round(v * .6))})`);
    html.style.setProperty('--img-over', (0.1 * (1 - bright)).toFixed(3));
    html.classList.toggle('is-night', bright < .5);
    const hh = String(Math.floor(m / 60)).padStart(2, '0'), mm = String(Math.floor(m % 60)).padStart(2, '0');
    $$('.time-h').forEach(e => (e.textContent = hh));
    $$('.time-m').forEach(e => (e.textContent = mm));
    const knob = $('.knob');
    if (knob) {
      if (travel === null) knobDeg = (m / 2) % 360;
      knob.style.transform = `rotate(${knobDeg}deg)`;
      knob.setAttribute('aria-valuenow', Math.floor(m));
      knob.setAttribute('aria-valuetext', `${hh}:${mm}`);
    }
    $$('.time').forEach(t => t.classList.toggle('is-travel', travel !== null));
    $$('.time-reset').forEach(b => (b.tabIndex = travel !== null ? 0 : -1));
  }
  paint();
  setInterval(() => { if (!dragging) paint(); }, 15000);

  let dragging = false;
  const knob = $('.knob');
  if (knob) {
    let last = 0;
    const center = () => { const r = knob.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    const angle = e => { const [cx, cy] = center(); return Math.atan2(e.clientX - cx, -(e.clientY - cy)) * 180 / Math.PI; };
    knob.addEventListener('pointerdown', e => { dragging = true; knob.setPointerCapture(e.pointerId); last = angle(e); if (travel === null) { travel = 0; } e.preventDefault(); });
    knob.addEventListener('pointermove', e => {
      if (!dragging) return;
      const a = angle(e); let d = a - last; if (d > 180) d -= 360; if (d < -180) d += 360; last = a;
      knobDeg += d; travel += d * 2; // 360° = 12 hours
      paint();
    });
    const end = () => { dragging = false; };
    knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end);
    knob.addEventListener('keydown', e => {
      const step = { ArrowRight: 15, ArrowUp: 15, ArrowLeft: -15, ArrowDown: -15, PageUp: 60, PageDown: -60 }[e.key];
      if (step) { e.preventDefault(); if (travel === null) travel = 0; travel += step; knobDeg += step / 2; paint(); }
      if (e.key === 'Escape' || e.key === 'Home') { travel = null; paint(); }
    });
  }
  $$('.time-reset').forEach(b => b.addEventListener('click', () => { travel = null; paint(); }));

  /* media fade-in once decoded (origin: video poster opacity 1→0, 250ms ease-out) */
  $$('.iw > img').forEach(im => { if (im.complete && im.naturalWidth) return; im.classList.add('ld'); const done = () => im.classList.remove('ld'); im.addEventListener('load', done, { once: true }); im.addEventListener('error', done, { once: true }); });

  /* knob turns into place during the intro (origin: rotate 0 → now, 1364–4889ms) */
  if (knob && !reduce) { const k0 = performance.now(); at(isHomePage() ? 1400 : 250, () => knob.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${knobDeg}deg)` }], { duration: isHomePage() ? 3500 : 1600, easing: 'cubic-bezier(.645,.045,.355,1)' })); void k0; }
  function isHomePage() { return page === 'home'; }

  /* ───────── logo cycle: name → award → date ───────── */
  const logo = $('.logo');
  if (logo && !reduce) { let s = 0; setInterval(() => { s = (s + 1) % 3; logo.dataset.step = s; }, 3200); }

  /* ───────── intro: header rise + page reveals ───────── */
  const isHome = page === 'home';
  const startHd = isHome ? 1400 : 250;
  if (reduce) { html.classList.remove('pre', 'pre-name'); }
  else {
    at(startHd, () => html.classList.remove('pre'));
    if (!isHome) at(400, () => $$('.ln.is-pre').forEach((e, i) => setTimeout(() => e.classList.remove('is-pre'), i * 70)));
  }

  /* ───────── menu ───────── */
  const shell = $('#shell'), shellIn = $('#shell-in'), menu = $('#menu'), tileClose = $('.tile-close');
  const menuBtn = $('.menu-btn');
  let menuY = 0, menuOpen = false, lastFocus = null;
  function openMenu() {
    if (menuOpen) return; menuOpen = true; lastFocus = document.activeElement;
    menuY = scrollY;
    shell.classList.add('is-lifted'); shellIn.style.transform = `translateY(${-menuY}px)`;
    void shell.offsetWidth;
    html.classList.add('menu-open'); menuBtn.setAttribute('aria-expanded', 'true');
    shell.setAttribute('inert', '');
    setTimeout(() => tileClose.focus({ preventScroll: true }), 50);
  }
  function closeMenu() {
    if (!menuOpen) return; menuOpen = false;
    menu.classList.add('is-closing');
    html.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', 'false');
    shell.removeAttribute('inert');
    setTimeout(() => {
      menu.classList.remove('is-closing');
      if (menuOpen) return;
      shell.classList.remove('is-lifted'); shellIn.style.transform = '';
      scrollTo(0, menuY);
      (lastFocus && lastFocus.focus) ? lastFocus.focus({ preventScroll: true }) : menuBtn.focus();
    }, reduce ? 10 : 1000);
  }
  menuBtn && menuBtn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  tileClose && tileClose.addEventListener('click', closeMenu);
  addEventListener('mousemove', e => { if (menuOpen) html.style.setProperty('--par', `${-(e.clientX / vw() - .5) * 200 * U()}px`); });
  menu && menu.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = [tileClose, ...$$('.tile', menu)];
    const i = f.indexOf(document.activeElement);
    e.preventDefault();
    f[mod(i + (e.shiftKey ? -1 : 1), f.length)].focus();
  });

  /* ───────── contact modal ───────── */
  const modal = $('#contact'), backdrop = $('.backdrop'), success = $('#success');
  let modalReturn = null;
  const tabs = $$('.tabs [role=tab]', modal);
  function setTab(name) {
    tabs.forEach(t => { const on = t.dataset.tab === name; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    $$('.tabpanel', modal).forEach(p => (p.hidden = p.dataset.tab !== name));
    moveLine();
  }
  function moveLine() {
    const act = tabs.find(t => t.getAttribute('aria-selected') === 'true');
    const line = $('.tabs-line', modal);
    if (!act || !line) return;
    line.style.transform = `translateX(${act.offsetLeft}px) scaleX(${act.offsetWidth})`;
  }
  function openModal(tab = 'client') {
    modalReturn = document.activeElement;
    if (menuOpen) closeMenu();
    setTab(tab);
    html.classList.add('modal-open'); modal.removeAttribute('aria-hidden');
    shell.setAttribute('inert', ''); menu && menu.setAttribute('inert', '');
    modal.scrollTop = 0;
    setTimeout(() => { moveLine(); $('.btn-close', modal).focus({ preventScroll: true }); modal.scrollTop = 0; }, 60);
  }
  function closeModal() {
    html.classList.remove('modal-open'); modal.setAttribute('aria-hidden', 'true');
    shell.removeAttribute('inert'); menu && menu.removeAttribute('inert');
    modalReturn && modalReturn.focus && modalReturn.focus({ preventScroll: true });
  }
  $$('[data-contact]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.contact || 'client')));
  $('.btn-close', modal).addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (!e.target.closest('.panel')) closeModal(); });
  tabs.forEach(t => {
    t.addEventListener('click', () => setTab(t.dataset.tab));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const i = tabs.indexOf(t); const n = tabs[mod(i + (e.key === 'ArrowRight' ? 1 : -1), tabs.length)];
      n.focus(); setTab(n.dataset.tab);
    });
  });
  const mail = $('.tab-email', modal);
  mail && mail.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(mail.dataset.email); } catch (e) { /* clipboard blocked: label still confirms the address is shown */ }
    const s = mail.querySelectorAll('.roll > span');
    s.forEach(x => (x.textContent = 'Copied'));
    mail.setAttribute('aria-label', `Email address ${mail.dataset.email} copied`);
    setTimeout(() => { s.forEach(x => (x.textContent = 'Email')); mail.setAttribute('aria-label', `Copy email address ${mail.dataset.email}`); }, 2200);
  });
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = $$('button, input, textarea, [tabindex="0"]', modal).filter(x => !x.closest('[hidden]') && !x.disabled && x.tabIndex >= 0 && x.offsetParent !== null);
    if (!f.length) return;
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  });
  $$('form', modal).forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true, firstBad = null;
      $$('[data-req]', form).forEach(inp => {
        const v = inp.value.trim();
        const bad = !v || (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
        inp.closest('.fg').classList.toggle('bad', bad);
        inp.setAttribute('aria-invalid', bad);
        if (bad) { ok = false; firstBad = firstBad || inp; }
      });
      const err = $('.f-err', form);
      const email = $('input[type=email]', form);
      const emailBad = email.value.trim() && email.getAttribute('aria-invalid') === 'true';
      err.innerHTML = ok ? '' : emailBad && $('[data-req]', form).value.trim() ? 'Check the<br>email address' : 'Please fill out<br>required fields';
      if (!ok) { firstBad.focus(); return; }
      form.reset();
      success.classList.add('on'); success.removeAttribute('aria-hidden');
      $('button', success).focus();
    });
    $$('[data-req]', form).forEach(inp => inp.addEventListener('input', () => { if (inp.value.trim()) { inp.closest('.fg').classList.remove('bad'); inp.setAttribute('aria-invalid', 'false'); } }));
  });
  $$('textarea', modal).forEach(t => t.addEventListener('input', () => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }));
  const closeSuccess = () => { success.classList.remove('on'); success.setAttribute('aria-hidden', 'true'); closeModal(); };
  $('button', success).addEventListener('click', closeSuccess);

  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (success.classList.contains('on')) return closeSuccess();
    if (modalOpen()) return closeModal();
    if (menuOpen) return closeMenu();
  });
  function modalOpen() { return html.classList.contains('modal-open'); }
  addEventListener('resize', moveLine);
  setTimeout(() => setTab('client'), 60); // underline drawn on load, as the origin's mounted modal does

  /* ───────── horizontal loop (home gallery, archive) ───────── */
  function loop(el, items, opts) {
    const st = { off: 0, tgt: 0, v: 0, drag: null, moved: 0 };
    const gap = () => 8 * U();
    const widths = () => items.map(it => it.getBoundingClientRect().width);
    function layout() {
      const ws = opts.widths ? opts.widths() : widths();
      const g = gap(), m = 16 * U();
      const total = ws.reduce((a, b) => a + b + g, 0);
      const lead = Math.max(...ws) + g;
      let acc = 0;
      items.forEach((it, i) => {
        const x = m - lead + mod(acc + st.off + lead, total);
        acc += ws[i] + g;
        it.style.transform = `translate3d(${x}px,0,0)` + (opts.scale ? ` scale(${1 - Math.min(Math.abs(st.v) / 600, .06)})` : '');
      });
    }
    function tick() {
      const d = st.tgt - st.off; st.v = d; st.off += d * (reduce ? 1 : .085);
      if (opts.onTick) opts.onTick();
      layout(); requestAnimationFrame(tick);
    }
    el.addEventListener('wheel', e => { if (menuOpen || modalOpen()) return; e.preventDefault(); const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY; st.tgt -= d; opts.onMove && opts.onMove(Math.abs(d)); }, { passive: false });
    if (opts.wheelHost) opts.wheelHost.addEventListener('wheel', e => { if (el.contains(e.target) || menuOpen || modalOpen()) return; e.preventDefault(); const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY; st.tgt -= d; opts.onMove && opts.onMove(Math.abs(d)); }, { passive: false });
    el.addEventListener('pointerdown', e => { if (e.button !== 0) return; st.drag = e.clientX; st.moved = 0; });
    el.addEventListener('dragstart', e => e.preventDefault());
    addEventListener('pointermove', e => { if (st.drag === null) return; const d = e.clientX - st.drag; st.drag = e.clientX; st.moved += Math.abs(d); st.tgt += d * 1.4; if (st.moved > 6 && opts.onMove) opts.onMove(st.moved); });
    addEventListener('pointerup', () => { st.drag = null; });
    el.addEventListener('click', e => { if (st.moved > 6) { e.preventDefault(); e.stopPropagation(); } st.moved = 0; }, true);
    el.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); st.tgt -= 405 * U(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); st.tgt += 405 * U(); }
    });
    el.addEventListener('focusin', e => {
      const it = items.find(i => i.contains(e.target)); if (!it) return;
      const r = it.getBoundingClientRect();
      if (r.left < 0) st.tgt += -r.left + 16 * U(); else if (r.right > vw()) st.tgt -= r.right - vw() + 16 * U();
    });
    layout(); requestAnimationFrame(tick);
    return st;
  }

  /* home */
  if (isHome) {
    const gal = $('.gallery');
    const items = $$('.gal-item', gal);
    loop(gal, items, { scale: true, wheelHost: window });
    if (!reduce) {
      const stages = items.map(i => $('.stage', i));
      const imgs = items.map(i => $('.iw img', i));
      const cx = vw() / 2, cy = innerHeight / 2;
      const seq = [3, 2, 1, 0];
      const placed = items.map(it => it.getBoundingClientRect());
      stages.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2) + 14 * U();
        s.dataset.dx = dx; s.dataset.dy = dy;
        const hidden = !seq.includes(i);
        s.style.transform = `translate(${dx}px,${dy}px) scale(.14)`;
        s.style.clipPath = 'polygon(0 0,100% 0,100% 0,0 0)';
        items[i].style.zIndex = hidden ? '' : String(10 + seq.indexOf(i));
        if (hidden) s.style.opacity = '0';
        imgs[i].style.transform = 'scale(1.5)';
      });
      void placed;
      seq.forEach((i, k) => at(2400 + k * 560, () => {
        const s = stages[i];
        s.animate([{ clipPath: 'polygon(0 0,100% 0,100% 0,0 0)' }, { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' }], { duration: 700, easing: 'cubic-bezier(.645,.045,.355,1)', fill: 'forwards' });
      }));
      at(2400, () => stages.forEach(s => s.animate([{ transform: `translate(${s.dataset.dx}px,${s.dataset.dy}px) scale(.14)` }, { transform: `translate(${s.dataset.dx}px,${s.dataset.dy}px) scale(.24)` }], { duration: 2600, easing: 'linear', fill: 'forwards' })));
      at(5000, () => {
        stages.forEach((s, i) => {
          const from = `translate(${s.dataset.dx}px,${s.dataset.dy}px) scale(.24)`;
          s.getAnimations().forEach(a => a.cancel());
          s.style.clipPath = 'none'; s.style.opacity = '';
          const hidden = !seq.includes(i);
          s.animate(hidden ? [{ transform: 'translate(0,40px)', opacity: 0 }, { transform: 'none', opacity: 1 }] : [{ transform: from, clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' }, { transform: 'none', clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' }], { duration: 1550, easing: 'cubic-bezier(.87,0,.13,1)', fill: 'none' });
          s.style.transform = '';
          imgs[i].animate([{ transform: 'scale(1.5)' }, { transform: 'scale(1.15)' }], { duration: 1550, easing: 'cubic-bezier(.87,0,.13,1)' });
          imgs[i].style.transform = '';
        });
      });
      at(6500, () => { html.classList.remove('pre-name'); items.forEach(it => (it.style.zIndex = '')); });
      items.forEach((it, i) => { const r = $('.nm .roll', it); r.style.transitionDelay = `${(i % 4) * 150}ms`; });
    }
  }

  /* archive */
  if (page === 'archive') {
    const box = $('.arch');
    const items = $$('.arch-item', box);
    const U0 = () => U();
    const base = items.map(it => +it.dataset.w);
    const ratio = items.map(it => +it.dataset.r);
    const cur = base.map(w => w);
    let open = -1;
    const st = loop(box, items, {
      wheelHost: window,
      widths: () => cur.map(w => w * U0()),
      onTick: () => {
        items.forEach((it, i) => {
          const tw = i === open ? 594 * ratio[i] : base[i];
          cur[i] += (tw - cur[i]) * (reduce ? 1 : .09);
          it.style.width = cur[i] * U0() + 'px';
        });
      },
      onMove: d => { if (open >= 0 && d > 30) setOpen(-1); },
    });
    function setOpen(i) {
      if (open >= 0) { items[open].classList.remove('is-open'); $('button', items[open]).setAttribute('aria-expanded', 'false'); }
      open = i;
      if (i >= 0) {
        items[i].classList.add('is-open'); $('button', items[i]).setAttribute('aria-expanded', 'true');
        const r = items[i].getBoundingClientRect();
        const grow = (594 * ratio[i] - base[i]) * U0();
        if (r.left + r.width + grow > vw() - 16 * U0()) st.tgt -= r.left + r.width + grow - vw() + 16 * U0();
        if (r.left < 16 * U0()) st.tgt += 16 * U0() - r.left;
      }
    }
    items.forEach((it, i) => $('button', it).addEventListener('click', () => setOpen(open === i ? -1 : i)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && open >= 0 && !menuOpen && !modalOpen()) setOpen(-1); });
  }

  /* case: reveals + rows */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.rv').forEach(e => (reduce ? e.classList.add('in') : io.observe(e)));
  const rows = $('.rows');
  if (rows) {
    const ra = $('.rows-row.a', rows), rb = $('.rows-row.b', rows);
    const upd = () => {
      const r = rows.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      const span = Math.max(0, ra.scrollWidth - vw() + 16 * U());
      ra.style.transform = `translate3d(${-p * span}px,0,0)`;
      rb.style.transform = `translate3d(${-(1 - p) * span}px,0,0)`;
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  /* about */
  if (page === 'about') {
    const ports = $$('.ab-portraits .iw');
    const blocks = $$('.ab-item');
    const values = $('.values'), cards = $('.cards'), bgs = $$('.bg-images .iw');
    const vc = $$('.vcard');
    function act(i) {
      vc.forEach((c, k) => { c.classList.toggle('on', k === i); c.setAttribute('aria-expanded', k === i); });
      bgs.forEach((b, k) => b.classList.toggle('on', k === i));
      cards.classList.toggle('is-active', i >= 0); values.classList.toggle('is-active', i >= 0);
    }
    vc.forEach((c, i) => {
      c.addEventListener('mouseenter', () => matchMedia('(hover:hover)').matches && act(i));
      c.addEventListener('click', () => act(c.classList.contains('on') ? -1 : i));
      c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(c.classList.contains('on') ? -1 : i); } if (e.key === 'Escape') act(-1); });
    });
    cards.addEventListener('mouseleave', () => matchMedia('(hover:hover)').matches && act(-1));
    const proc = $('.process');
    const steps = $$('.track-in [role=tab]'), slots = $$('.slot > div'), trackIn = $('.track-in');
    let cur = -1;
    function setStep(i) {
      if (i === cur) return; cur = i;
      steps.forEach((s, k) => { s.setAttribute('aria-selected', k === i); s.tabIndex = k === i ? 0 : -1; });
      slots.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', k !== i); });
      trackIn.style.transform = `translateX(${-steps[i].offsetLeft}px)`;
    }
    steps.forEach((s, i) => {
      s.addEventListener('click', () => { const r = proc.getBoundingClientRect(); const span = r.height - innerHeight; scrollTo({ top: scrollY + r.top + span * (i + .5) / steps.length, behavior: reduce ? 'auto' : 'smooth' }); setStep(i); });
      s.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const n = steps[mod(i + (e.key === 'ArrowRight' ? 1 : -1), steps.length)]; n.focus(); n.click(); } });
    });
    const upd = () => {
      const mid = innerHeight * .5;
      let a = 0; blocks.forEach((b, k) => { if (b.getBoundingClientRect().top < mid) a = k; });
      ports.forEach((p, k) => p.classList.toggle('on', k === Math.min(a, ports.length - 1)));
      const r = proc.getBoundingClientRect();
      const p = Math.min(.999, Math.max(0, -r.top / (r.height - innerHeight)));
      setStep(Math.floor(p * steps.length));
      if (values.getBoundingClientRect().bottom < 0 && cards.classList.contains('is-active')) act(-1);
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }
})();
