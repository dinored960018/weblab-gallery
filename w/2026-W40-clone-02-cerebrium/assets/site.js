/* AXONFIELD — behaviour layer. Every feature listed in SPEC.md, function list. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
  };
  let locks = 0;
  const lock = (on) => { locks = Math.max(0, locks + (on ? 1 : -1)); root.classList.toggle('is-locked', locks > 0); };

  /* cubic-bezier easing for JS tweens (same curves as the CSS tokens) */
  const bezier = (x1, y1, x2, y2) => (x) => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3 - x;
      const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
      if (Math.abs(cx) < 1e-4 || !d) break;
      t -= cx / d;
    }
    return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
  };
  const easeStd = bezier(0.4, 0, 0.2, 1);

  /* ── title words: flicker-in (original c-split-title, measured frame by frame)
     words start in random order 33 ms apart, each fades 0 → 1 in 110 ms,
     then the whole title blinks 0.85 / 0.15 / 0.8 / 1 on four 17 ms frames ── */
  const BLINK = [0.85, 0.15, 0.8, 1];
  const flicker = (host) => {
    const ws = $$('.w', host);
    if (!ws.length || host._flick) return;
    host._flick = true;
    if (reduce) { ws.forEach((w) => { w.style.opacity = '1'; }); return; }
    const order = ws.map((_, i) => i).sort(() => Math.random() - 0.5);
    const st = []; order.forEach((wi, k) => { st[wi] = k * 33; });
    const D = 110, blinkAt = (ws.length - 1) * 33 + D + 20;
    const t0 = performance.now();
    const step = (now) => {
      const e = now - t0;
      const bi = Math.floor((e - blinkAt) / 17);
      const m = bi >= 0 && bi < BLINK.length ? BLINK[bi] : 1;
      ws.forEach((w, i) => { w.style.opacity = (easeStd((e - st[i]) / D) * m).toFixed(3); });
      if (bi < BLINK.length) requestAnimationFrame(step); else ws.forEach((w) => { w.style.opacity = '1'; });
    };
    requestAnimationFrame(step);
  };

  /* ── section labels: wrap the text so dot and text can move separately ── */
  $$('.eyebrow').forEach((eb) => {
    [...eb.childNodes].forEach((n) => {
      if (n.nodeType === 3 && n.textContent.trim()) { const sp = document.createElement('span'); sp.className = 'eb-t'; sp.textContent = n.textContent; n.replaceWith(sp); }
    });
  });

  /* ── in-view triggers ── */
  const once = (sel, cls, margin, fn) => {
    const o = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add(cls); fn && fn(e.target); o.unobserve(e.target);
    }), { rootMargin: margin });
    $$(sel).forEach((el) => o.observe(el));
  };
  let ready = false;
  const whenReady = [];
  const afterReady = (fn) => (ready ? fn() : whenReady.push(fn));
  /* titles below the hero flicker when they enter; the hero title waits for the loader */
  once('.reveal', 'is-in', '0px 0px -10% 0px', (el) => afterReady(() => flicker(el)));
  once('.eyebrow', 'is-in', '0px 0px -20% 0px');
  once('.ex, .case, .post, .faq details', 'is-inview', '0px 0px -5% 0px');
  once('.flist', 'is-inview', '0px 0px -10% 0px');

  /* ── loader → intro (original: loader lifts once the scene is ready — 3.8 s home, 3.0 s pricing, 1.9 s others —
     then header drops in 0.3 s, canvas fades 0.3 s, copy rises 0.8 s, line draws 1 s, cookie card follows) ── */
  const loader = $('.loader');
  const goReady = () => {
    if (ready) return;
    ready = true;
    root.classList.add('is-ready');
    window.__bgIntro && window.__bgIntro();
    whenReady.splice(0).forEach((fn) => fn());
    setTimeout(() => root.classList.add('intro-done'), reduce ? 0 : 1300);
    document.dispatchEvent(new Event('axf:ready'));
  };
  if (loader) {
    const seen = (() => { try { return sessionStorage.getItem('axf-loaded'); } catch { return null; } })();
    const done = () => { loader.classList.add('is-done'); try { sessionStorage.setItem('axf-loaded', '1'); } catch { /* ignore */ } goReady(); };
    if (seen || reduce) done();
    else {
      const min = +root.dataset.loaderMin || 1900;
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      Promise.all([fonts, new Promise((r) => setTimeout(r, Math.max(0, min - performance.now())))]).then(done);
    }
  } else goReady();

  /* ── scramble text on hover (nav + mono buttons) ── */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  $$('[data-scramble]').forEach((host) => {
    const label = host.querySelector('.sc') || host;
    label.dataset.final = label.textContent;
    const text0 = () => label.dataset.final;
    let raf = 0;
    const run = () => {
      if (reduce) return;
      cancelAnimationFrame(raf);
      const start = performance.now();
      const text = text0();
      const step = (now) => {
        const p = Math.min(1, (now - start) / 350);
        const n = Math.floor(p * text.length);
        label.textContent = text.split('').map((c, i) => (i < n || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
        if (p < 1 && text === text0()) raf = requestAnimationFrame(step); else label.textContent = text0();
      };
      raf = requestAnimationFrame(step);
    };
    host.addEventListener('mouseenter', run);
    host.addEventListener('mouseleave', () => { cancelAnimationFrame(raf); label.textContent = text0(); });
  });

  /* ── header dropdowns: hover or click, outside click + ESC close ── */
  const dds = $$('[data-dd]');
  const setMenuBlur = () => root.classList.toggle('menu-open', dds.some((b) => b.getAttribute('aria-expanded') === 'true'));
  const closeDd = (btn, focus) => {
    btn.setAttribute('aria-expanded', 'false');
    $('#' + btn.getAttribute('aria-controls')).classList.remove('is-open');
    setMenuBlur();
    if (focus) btn.focus();
  };
  const openDd = (btn) => {
    dds.forEach((b) => b !== btn && closeDd(b));
    if (btn.getAttribute('aria-expanded') !== 'true') btn._openedAt = performance.now();
    btn.setAttribute('aria-expanded', 'true');
    $('#' + btn.getAttribute('aria-controls')).classList.add('is-open');
    setMenuBlur();
  };
  dds.forEach((btn) => {
    const panel = $('#' + btn.getAttribute('aria-controls'));
    const item = btn.closest('.nav-item');
    let timer = 0;
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      /* a hover-open followed by a click should not immediately close the menu */
      if (isOpen && performance.now() - (btn._openedAt || 0) > 400) closeDd(btn); else openDd(btn);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); openDd(btn); const a = panel.querySelector('a'); a && a.focus(); }
    });
    if (fine) {
      item.addEventListener('mouseenter', () => { clearTimeout(timer); openDd(btn); });
      item.addEventListener('mouseleave', () => { timer = setTimeout(() => closeDd(btn), 160); });
      panel.addEventListener('mouseenter', () => clearTimeout(timer));
      panel.addEventListener('mouseleave', () => { timer = setTimeout(() => closeDd(btn), 160); });
    }
    panel.addEventListener('focusout', (e) => { if (!panel.contains(e.relatedTarget) && e.relatedTarget !== btn) closeDd(btn); });
  });
  document.addEventListener('click', (e) => {
    dds.forEach((b) => { if (b.getAttribute('aria-expanded') === 'true' && !b.closest('.nav-item').contains(e.target)) closeDd(b); });
  });

  /* ── header: a fixed copy slides down when scrolling up (original .c-header.is-fixed) ── */
  const hdr = $('.hdr');
  if (hdr) {
    let lastY = scrollY, fixed = false, shown = false;
    const setFixed = (on) => {
      if (on === fixed) return;
      fixed = on;
      hdr.classList.add('no-tr');
      hdr.classList.toggle('is-fixed', on);
      if (!on) hdr.classList.remove('is-shown');
      void hdr.offsetWidth;
      hdr.classList.remove('no-tr');
      shown = false;
    };
    addEventListener('scroll', () => {
      const y = scrollY, dy = y - lastY; lastY = y;
      if (root.classList.contains('is-locked') || Math.abs(dy) < 2) return;
      if (y < 90) { if (fixed && !shown) setFixed(false); else if (fixed && y <= 0) setFixed(false); return; }
      if (dy < 0 && y > 300) {
        setFixed(true);
        if (!shown) { requestAnimationFrame(() => hdr.classList.add('is-shown')); shown = true; }
      } else if (dy > 0 && fixed && shown) {
        hdr.classList.remove('is-shown'); shown = false;
        dds.forEach((b) => b.getAttribute('aria-expanded') === 'true' && closeDd(b));
      }
    }, { passive: true });
  }

  /* ── mobile menu ── */
  const burger = $('.burger');
  const mnav = $('#mnav');
  const setMnav = (on) => {
    if (!burger || !mnav) return;
    if ((burger.getAttribute('aria-expanded') === 'true') === on) return;
    burger.setAttribute('aria-expanded', String(on));
    const sc = burger.querySelector('.sc'); sc.textContent = sc.dataset.final = on ? 'Close' : 'Menu';
    mnav.classList.toggle('is-open', on);
    mnav.toggleAttribute('inert', !on);
    root.classList.toggle('menu-open', on);
    lock(on);
    if (on) { const f = mnav.querySelector('a, button'); f && f.focus(); } else burger.focus();
  };
  if (burger) {
    mnav.setAttribute('inert', '');
    burger.addEventListener('click', () => setMnav(burger.getAttribute('aria-expanded') !== 'true'));
    window.addEventListener('resize', () => { if (window.innerWidth > 1023) setMnav(false); });
  }
  $$('.acc-t').forEach((t) => t.addEventListener('click', () => {
    const on = t.getAttribute('aria-expanded') !== 'true';
    t.setAttribute('aria-expanded', String(on));
    $('#' + t.getAttribute('aria-controls')).classList.toggle('is-open', on);
  }));

  /* ── cookie consent + preferences ── */
  const cm = $('#cm'), pmw = $('#pm');
  const toggles = $$('#pm input[type="checkbox"]');
  const saveConsent = (analytics) => { store.set('axf-consent', JSON.stringify({ necessary: true, analytics, at: Date.now() })); };
  const openCm = () => { cm.classList.add('is-open'); cm.removeAttribute('inert'); };
  const closeCm = () => { cm.classList.remove('is-open'); cm.setAttribute('inert', ''); };
  let pmReturn = null;
  const openPm = () => {
    const saved = JSON.parse(store.get('axf-consent') || 'null');
    const ga = $('#pm [name="analytics"]');
    if (ga) ga.checked = !!(saved && saved.analytics);
    pmReturn = document.activeElement;
    pmw.classList.add('is-open'); pmw.removeAttribute('inert'); lock(true);
    $('.pm-hd button', pmw).focus();
  };
  const closePm = () => {
    if (!pmw.classList.contains('is-open')) return;
    pmw.classList.remove('is-open'); pmw.setAttribute('inert', ''); lock(false);
    if (pmReturn && document.contains(pmReturn)) pmReturn.focus();
  };
  if (cm) {
    cm.setAttribute('inert', ''); pmw.setAttribute('inert', '');
    if (!store.get('axf-consent')) afterReady(() => setTimeout(openCm, 100));
    cm.addEventListener('click', (e) => {
      const r = e.target.closest('[data-cc]');
      if (!r) return;
      const a = r.dataset.cc;
      if (a === 'all') { saveConsent(true); closeCm(); }
      if (a === 'none') { saveConsent(false); closeCm(); }
      if (a === 'close') closeCm();
      if (a === 'show') openPm();
    });
    pmw.addEventListener('click', (e) => {
      if (e.target === pmw) { closePm(); return; }
      const r = e.target.closest('[data-cc]');
      if (!r) return;
      const a = r.dataset.cc;
      if (a === 'all') { toggles.forEach((t) => { if (!t.disabled) t.checked = true; }); saveConsent(true); closePm(); closeCm(); }
      if (a === 'none') { toggles.forEach((t) => { if (!t.disabled) t.checked = false; }); saveConsent(false); closePm(); closeCm(); }
      if (a === 'save') { saveConsent(!!$('#pm [name="analytics"]').checked); closePm(); closeCm(); }
      if (a === 'close') closePm();
    });
    $$('.cat-exp').forEach((b) => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(on));
      b.closest('.cat').classList.toggle('is-open', on);
    }));
    $$('[data-cookie-prefs]').forEach((b) => b.addEventListener('click', openPm));
    pmw.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('button, input, a', pmw).filter((x) => !x.disabled);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }

  /* ── video modal (mobile hero "play" + about reel) ── */
  const modal = $('#vmodal');
  let modalReturn = null;
  const openModal = () => { modalReturn = document.activeElement; modal.classList.add('is-open'); modal.removeAttribute('inert'); lock(true); $('.modal-close', modal).focus(); };
  const closeModal = () => { if (!modal || !modal.classList.contains('is-open')) return; modal.classList.remove('is-open'); modal.setAttribute('inert', ''); lock(false); modalReturn && modalReturn.focus(); };
  if (modal) {
    modal.setAttribute('inert', '');
    $$('[data-video]').forEach((b) => b.addEventListener('click', openModal));
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.modal-close')) closeModal(); });
  }

  /* ── global ESC ── */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (pmw && pmw.classList.contains('is-open')) { closePm(); return; }
    if (modal && modal.classList.contains('is-open')) { closeModal(); return; }
    const openB = dds.find((b) => b.getAttribute('aria-expanded') === 'true');
    if (openB) { closeDd(openB, true); return; }
    if (burger && burger.getAttribute('aria-expanded') === 'true') { setMnav(false); return; }
    if (cm && cm.classList.contains('is-open')) closeCm();
  });

  /* ── segmented tabs (aria-selected + arrow keys + sliding indicator) ── */
  const tabHooks = {};
  window.__onTab = (name, fn) => { tabHooks[name] = fn; };
  $$('.seg[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    const ind = $('.seg-ind', list);
    const place = (t) => { if (!ind || !t) return; ind.style.transform = `translateX(${t.offsetLeft}px) scaleX(${t.offsetWidth / 100})`; };
    const select = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const pid = x.getAttribute('aria-controls');
        if (pid) {
          const p = document.getElementById(pid);
          if (p) {
            const was = p.hidden;
            p.hidden = !on;
            /* original c-segmented-panel: new panel slides in from 5% while fading, ~0.21 s */
            if (on && was && !reduce) p.animate([{ opacity: 0, transform: 'translateX(5%)' }, { opacity: 1, transform: 'none' }], { duration: 215, easing: 'cubic-bezier(0, 0, 0.2, 1)' });
          }
        }
      });
      place(t);
      if (focus) t.focus();
      const hook = tabHooks[list.dataset.tabs];
      if (hook) hook(t.dataset.value, t);
    };
    tabs.forEach((t) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const i = tabs.indexOf(t);
        let n = -1;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n >= 0) { e.preventDefault(); select(tabs[n], true); }
      });
    });
    const cur = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    tabs.forEach((x) => { x.tabIndex = x === cur ? 0 : -1; });
    list.classList.add('js-ready');
    if (!reduce) { cur.setAttribute('aria-selected', 'false'); requestAnimationFrame(() => requestAnimationFrame(() => cur.setAttribute('aria-selected', 'true'))); }
    requestAnimationFrame(() => place(cur));
    document.fonts && document.fonts.ready.then(() => place(tabs.find((t) => t.getAttribute('aria-selected') === 'true')));
    window.addEventListener('resize', () => place(tabs.find((t) => t.getAttribute('aria-selected') === 'true')));
  });

  /* ── hero: click and hold ── */
  const hero = $('.hero[data-hold]');
  if (hero && fine && !reduce) {
    const cur = $('.hold-cursor', hero);
    const words = $$('.hold-words > span', hero);
    /* split each word into letters */
    const chars = words.map((w) => { const t = w.textContent; w.textContent = ''; return [...t].map((c) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; w.appendChild(s); return s; }); });
    let raf = 0, t0 = 0;
    hero.style.cursor = 'none';
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      cur.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
      const overUi = e.target.closest('a, button');
      if (!overUi) cur.classList.add('was-on');
      cur.classList.toggle('is-on', !overUi);
      hero.style.cursor = overUi ? '' : 'none';
    });
    hero.addEventListener('pointerleave', () => { cur.classList.remove('is-on'); stop(); });
    /* original timing (frame-measured): word i builds from 1.0 s + 2.9 s·i, holds, flickers out 1.9 s later;
       letters come in random order ~40 ms apart, each flickers before it settles */
    const seeds = chars.map((cs) => cs.map(() => [Math.random() * 280, Math.random() * 1000]));
    const tick = (now) => {
      const e = now - t0;
      chars.forEach((cs, wi) => {
        const on = 1000 + wi * 2900, off = on + 1900;
        cs.forEach((c, ci) => {
          const [d, ph] = seeds[wi][ci];
          let v = 0;
          if (e >= on + d && e < off + d) {
            const k = e - on - d;
            v = k < 160 ? (Math.sin(k * 0.12 + ph) > -0.2 ? Math.min(1, k / 90) : 0.15) : 1;
          } else if (e >= off + d && e < off + d + 180) {
            v = Math.sin((e - off) * 0.15 + ph) > 0.1 ? 0.6 : 0;
          }
          c.style.opacity = v ? v.toFixed(2) : '0';
        });
      });
      raf = requestAnimationFrame(tick);
    };
    const start = (e) => {
      if (e.button !== 0 || e.target.closest('a, button')) return;
      hero.classList.add('is-holding'); root.classList.add('hero-holding'); window.__bgHold && window.__bgHold(true);
      cancelAnimationFrame(raf); t0 = performance.now(); raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      hero.classList.remove('is-holding'); root.classList.remove('hero-holding'); window.__bgHold && window.__bgHold(false);
      cancelAnimationFrame(raf); chars.flat().forEach((c) => { c.style.opacity = '0'; });
    };
    hero.addEventListener('pointerdown', start);
    window.addEventListener('pointerup', stop);
  }

  /* ── interactive dot grid ── */
  $$('.dots').forEach((d) => {
    const pool = Array.from({ length: 24 }, () => { const i = document.createElement('i'); d.appendChild(i); return i; });
    let k = 0, lastCell = '';
    const light = (cx, cy) => {
      const i = pool[k++ % pool.length];
      i.style.left = cx + 'px'; i.style.top = cy + 'px';
      i.classList.add('is-on');
      setTimeout(() => i.classList.remove('is-on'), 450);
    };
    d.addEventListener('pointermove', (e) => {
      const r = d.getBoundingClientRect();
      const cx = Math.round((e.clientX - r.left) / 71) * 71, cy = Math.round((e.clientY - r.top) / 71) * 71;
      const key = cx + ',' + cy;
      if (key !== lastCell) { lastCell = key; light(cx, cy); }
    });
    if (!reduce) setInterval(() => {
      const r = d.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      light(Math.floor(Math.random() * (r.width / 71)) * 71, Math.floor(Math.random() * (r.height / 71)) * 71);
    }, 700);
  });

  /* ── sticky feature list: scroll-spy ── */
  const featNav = $('.feat-nav');
  if (featNav) {
    const links = $$('a', featNav);
    const secs = links.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
    const spy = () => {
      let idx = 0;
      secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.55) idx = i; });
      links.forEach((a, i) => { a.classList.toggle('is-active', i === idx); a.toggleAttribute('aria-current', i === idx); });
    };
    addEventListener('scroll', spy, { passive: true }); spy();
  }

  /* ── cold-start bars: tab data ── */
  const COLD = {
    a: [['3.1s', 3], ['38s', 26], ['66s', 45], ['148s', 100]],
    b: [['2.9s', 3], ['9.4s', 10], ['57s', 60], ['95s', 100]],
  };
  const coldRun = (card) => {
    card.classList.remove('is-run');
    $$('.cold-bar b', card).forEach((b) => { b.style.setProperty('--d', Math.max(250, (+b.style.getPropertyValue('--w') / 100) * 4000) + 'ms'); });
    void card.offsetWidth;
    card.classList.add('is-run');
  };
  $$('.cold').forEach((c) => {
    if (!$('.cold-bar', c)) { c.classList.add('is-run'); return; }
    const o = new IntersectionObserver((es) => { if (es[0].isIntersecting) { coldRun(c); o.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' });
    o.observe(c);
  });
  window.__onTab('cold', (v) => {
    $$('.cold-row').forEach((row, i) => {
      const [txt, pct] = COLD[v][i];
      $('.v', row).textContent = txt;
      $('.cold-bar b', row).style.setProperty('--w', pct);
    });
    const card = $('.cold-row') && $('.cold-row').closest('.cold');
    card && coldRun(card);
  });

  /* ── observability chart ── */
  const chart = $('#chart');
  if (chart) {
    const SETS = {
      gpu: { y: 'Peak memory (GB)', max: 80, lines: [
        [22, 22, 22, 22, 22, 9, 22, 22, 22, 22, 19, 8, 8, 8, 26, 26, 17, 16],
        [36, 36, 36, 36, 24, 18, 36, 36, 36, 36, 36, 36, 36, 48, 24, 24, 13, 30],
        [52, 52, 52, 52, 48, 48, 52, 52, 52, 52, 52, 52, 52, 70, 47, 47, 51, 66],
      ] },
      cpu: { y: 'CPU use (%)', max: 100, lines: [
        [18, 20, 24, 30, 28, 22, 20, 26, 34, 30, 24, 20, 18, 22, 28, 26, 22, 20],
        [30, 34, 38, 46, 44, 36, 34, 40, 52, 48, 38, 34, 30, 36, 44, 42, 36, 32],
        [44, 50, 56, 64, 70, 52, 50, 58, 78, 72, 56, 50, 46, 54, 66, 62, 52, 48],
      ] },
      startup: { y: 'Startup (s)', max: 10, lines: [
        [2.1, 2.2, 2.0, 2.3, 2.1, 2.0, 2.2, 2.1, 2.4, 2.2, 2.1, 2.0, 2.2, 2.1, 2.3, 2.2, 2.1, 2.0],
        [3.0, 3.2, 3.1, 3.6, 3.2, 3.0, 3.3, 3.1, 3.8, 3.4, 3.1, 3.0, 3.2, 3.1, 3.5, 3.3, 3.2, 3.0],
        [4.2, 4.6, 4.4, 5.8, 4.6, 4.3, 4.8, 4.4, 7.2, 5.0, 4.5, 4.3, 4.6, 4.4, 5.4, 4.9, 4.6, 4.3],
      ] },
    };
    const COLORS = ['#7a7fb2', '#90aade', '#ff488b'];
    const X0 = 90, X1 = 540, Y0 = 50, Y1 = 290;
    const draw = (key) => {
      const s = SETS[key];
      const grid = [0, 1, 2, 3, 4].map((i) => {
        const y = Y1 - (i * (Y1 - Y0)) / 4;
        return `<line x1="${X0}" x2="${X1}" y1="${y}" y2="${y}" stroke="#c6cee0" stroke-dasharray="4 4"/><text x="${X0 - 14}" y="${y + 4}" text-anchor="end">${Math.round((s.max * i) / 4)}</text>`;
      }).join('');
      const xs = ['10:02', '10:06', '10:09', '10:13'].map((l, i) => `<text x="${X0 + 10 + i * 126}" y="${Y1 + 22}" text-anchor="middle">${l}</text>`).join('');
      const paths = s.lines.map((ln, li) => {
        const d = ln.map((v, i) => `${i ? 'L' : 'M'}${(X0 + 10 + (i * (X1 - X0 - 30)) / (ln.length - 1)).toFixed(1)} ${(Y1 - (v / s.max) * (Y1 - Y0)).toFixed(1)}`).join(' ');
        return `<path d="${d}" fill="none" stroke="${COLORS[li]}" stroke-width="2" stroke-linejoin="round" pathLength="1" class="ln"/>`;
      }).join('');
      chart.innerHTML = `<g font-family="IBM Plex Mono, monospace" font-size="12" fill="#586490">${grid}${xs}<text transform="translate(34 ${(Y0 + Y1) / 2}) rotate(-90)" text-anchor="middle" fill="#172b76" letter-spacing="0.5">${s.y.toUpperCase()}</text></g>${paths}`;
      if (!reduce) $$('.ln', chart).forEach((p) => p.animate([{ strokeDasharray: '1', strokeDashoffset: 1 }, { strokeDasharray: '1', strokeDashoffset: 0 }], { duration: 900, easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)', fill: 'forwards' }));
    };
    window.__onTab('chart', draw);
    draw('gpu');
  }

  /* ── terminal lines appear when in view ── */
  $$('.term').forEach((term) => {
    const lines = $$('p', term);
    let timers = [];
    if (!reduce) lines.forEach((l) => { l.style.opacity = '0'; });
    const o = new IntersectionObserver((es) => {
      timers.forEach(clearTimeout); timers = [];
      if (!es[0].isIntersecting) { if (!reduce) lines.forEach((l) => { l.classList.remove('is-on'); l.style.opacity = '0'; }); return; }
      lines.forEach((l, i) => timers.push(setTimeout(() => { l.classList.add('is-on'); l.style.opacity = '1'; }, reduce ? 0 : i * 84)));
    }, { rootMargin: '0px 0px -10% 0px' });
    o.observe(term);
  });

  /* ── dot map (my own drawing: continents as blobs sampled into a hex dot field) ── */
  $$('canvas.map').forEach((c) => {
    const draw = () => {
      const w = c.clientWidth, h = c.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
      c.width = w * dpr; c.height = h * dpr;
      const g = c.getContext('2d'); g.scale(dpr, dpr);
      const blobs = [
        [0.2, 0.33, 0.13, 0.13], [0.16, 0.24, 0.1, 0.07], [0.27, 0.62, 0.06, 0.18], [0.29, 0.5, 0.04, 0.06],
        [0.5, 0.25, 0.09, 0.08], [0.53, 0.55, 0.08, 0.17], [0.7, 0.3, 0.2, 0.14], [0.76, 0.46, 0.07, 0.07],
        [0.85, 0.72, 0.07, 0.07], [0.37, 0.12, 0.05, 0.05], [0.9, 0.2, 0.06, 0.06],
      ];
      const inside = (x, y) => blobs.some(([bx, by, rx, ry]) => ((x - bx) / rx) ** 2 + ((y - by) / ry) ** 2 < 1);
      const step = 7;
      for (let y = 0; y < h; y += step * 0.87) {
        const row = Math.round(y / (step * 0.87));
        for (let x = (row % 2) * step / 2; x < w; x += step) {
          if (!inside(x / w, y / h)) continue;
          g.fillStyle = '#cfd7e7'; g.beginPath(); g.arc(x, y, 2.4, 0, Math.PI * 2); g.fill();
        }
      }
      const hubs = JSON.parse(c.dataset.hubs || '[]');
      hubs.forEach(([hx, hy]) => {
        for (let y = -18; y <= 18; y += step * 0.87) for (let x = -18; x <= 18; x += step) {
          if (x * x + y * y > 18 * 18) continue;
          g.fillStyle = '#ff488b'; g.beginPath(); g.arc(hx * w + x, hy * h + y, 2.6, 0, Math.PI * 2); g.fill();
        }
      });
    };
    draw();
    addEventListener('resize', draw);
  });

  /* ── carousels ── */
  $$('[data-car]').forEach((wrap) => {
    const car = $('.car', wrap.closest('section') || document);
    const prev = $('[data-prev]', wrap), next = $('[data-next]', wrap);
    if (!car) return;
    const card = () => { const c = $('.case', car); return c ? c.offsetWidth + 15 : 400; };
    const upd = () => {
      prev.disabled = car.scrollLeft < 4;
      next.disabled = car.scrollLeft + car.clientWidth >= car.scrollWidth - 4;
    };
    prev.addEventListener('click', () => car.scrollBy({ left: -card(), behavior: reduce ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => car.scrollBy({ left: card(), behavior: reduce ? 'auto' : 'smooth' }));
    car.addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd); upd();
    let down = false, sx = 0, sl = 0, moved = false;
    car.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = car.scrollLeft; });
    addEventListener('pointermove', (e) => {
      if (!down) return;
      if (Math.abs(e.clientX - sx) > 4) { moved = true; car.classList.add('is-drag'); }
      car.scrollLeft = sl - (e.clientX - sx);
    });
    addEventListener('pointerup', () => { if (!down) return; down = false; car.classList.remove('is-drag'); });
    car.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
  });

  /* ── pricing: unit toggle ── */
  window.__onTab('unit', (v) => {
    $$('[data-ps]').forEach((el) => { el.textContent = v === 'hr' ? el.dataset.ph : el.dataset.ps; });
    $$('[data-us]').forEach((el) => { el.textContent = v === 'hr' ? el.dataset.uh : el.dataset.us; });
  });

  /* ── pricing calculator ── */
  const calc = $('#calc');
  if (calc) {
    const PRICE = JSON.parse(calc.dataset.prices);
    const CPU = 0.0000062, MEM = 0.0000021;
    const f = (id) => document.getElementById(id);
    const req = f('c-req'), run = f('c-run'), hw = f('c-hw'), gpu = f('c-gpu'), cpu = f('c-cpu'), mem = f('c-mem');
    const fmt = (v, d = 6) => '$' + v.toFixed(d);
    const reqVal = () => Math.max(1, Math.round(Math.pow(10, (req.value / 1000) * Math.log10(5000000))));
    const fill = (r) => { const p = ((r.value - r.min) / (r.max - r.min)) * 100; r.style.setProperty('--p', p + '%'); };
    const upd = () => {
      const isCpu = hw.value === 'cpu';
      gpu.disabled = isCpu;
      if (isCpu) gpu.value = 0; else if (+gpu.value === 0) gpu.value = 1;
      const n = reqVal();
      const secs = Math.max(0, parseFloat(run.value) || 0);
      const g = (PRICE[hw.value] || 0) * +gpu.value, c = CPU * +cpu.value, m = MEM * +mem.value;
      const tot = g + c + m;
      f('o-req').textContent = n.toLocaleString('en-US');
      f('o-gpu').textContent = gpu.value;
      f('o-cpu').textContent = cpu.value;
      f('o-mem').textContent = mem.value + ' GB';
      f('o-vram').textContent = (JSON.parse(calc.dataset.vram)[hw.value] || '—');
      f('e-gpu').textContent = fmt(g) + '/s';
      f('e-cpu').textContent = fmt(c) + '/s';
      f('e-mem').textContent = fmt(m) + '/s';
      f('e-tot').textContent = fmt(tot) + '/s';
      const month = tot * secs * n;
      f('e-big').textContent = '$' + (month < 1 ? month.toFixed(4) : month.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      [req, gpu, cpu, mem].forEach(fill);
    };
    [req, run, hw, gpu, cpu, mem].forEach((el) => el.addEventListener('input', upd));
    $$('[data-step]', calc).forEach((b) => b.addEventListener('click', () => {
      run.value = Math.max(0, (parseFloat(run.value) || 0) + +b.dataset.step); upd();
    }));
    upd();
  }

  /* ── pricing: mobile plan tabs ── */
  window.__onTab('plan', (v) => {
    $$('.plan-wrap').forEach((p) => { p.hidden = window.innerWidth < 768 && p.dataset.plan !== v; });
  });
  addEventListener('resize', () => {
    const sel = $('[data-tabs="plan"] [aria-selected="true"]');
    if (sel) $$('.plan-wrap').forEach((p) => { p.hidden = window.innerWidth < 768 && p.dataset.plan !== sel.dataset.value; });
  });
  { const sel = $('[data-tabs="plan"] [aria-selected="true"]'); if (sel) tabHooks.plan(sel.dataset.value); }

  /* ── list filter + pagination (blog, resources) ── */
  $$('[data-list]').forEach((grid) => {
    const items = $$('[data-cat]', grid);
    const per = +grid.dataset.per || 12;
    const pager = $('#' + grid.dataset.pager);
    let cat = 'all', page = 1;
    const empty = $('.empty', grid);
    const render = () => {
      const match = items.filter((i) => cat === 'all' || i.dataset.cat.split(' ').includes(cat));
      const pages = Math.max(1, Math.ceil(match.length / per));
      page = Math.min(page, pages);
      items.forEach((i) => { i.hidden = true; });
      match.slice((page - 1) * per, page * per).forEach((i) => { i.hidden = false; });
      if (empty) empty.hidden = match.length > 0;
      if (!pager) return;
      const nums = Array.from({ length: pages }, (_, k) => `<button type="button" data-p="${k + 1}"${k + 1 === page ? ' aria-current="page"' : ''} aria-label="Page ${k + 1}">${k + 1}</button>`).join('');
      pager.innerHTML = `<div class="in"><button type="button" data-p="prev" aria-label="Previous page"${page === 1 ? ' disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 12H4m6-6-6 6 6 6"/></svg></button>${nums}<button type="button" data-p="next" aria-label="Next page"${page === pages ? ' disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></button></div>`;
    };
    if (pager) pager.addEventListener('click', (e) => {
      const b = e.target.closest('[data-p]');
      if (!b || b.disabled) return;
      const v = b.dataset.p;
      page = v === 'prev' ? page - 1 : v === 'next' ? page + 1 : +v;
      render();
      const top = grid.getBoundingClientRect().top + scrollY - 120;
      scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
      const cur = pager.querySelector('[aria-current="page"]'); cur && cur.focus();
    });
    window.__onTab(grid.dataset.list, (v) => { cat = v; page = 1; render(); });
    render();
  });

  /* ── forms: visible validation, submit always blocked ── */
  $$('form[data-validate]').forEach((form) => {
    const status = $('.form-status', form);
    const msg = (el) => {
      if (el.validity.valueMissing) return el.tagName === 'SELECT' ? 'Choose an option.' : 'Required.';
      if (el.validity.typeMismatch && el.type === 'email') return 'Enter an email like name@company.com.';
      if (el.validity.tooShort) return `At least ${el.minLength} characters.`;
      if (el.validity.patternMismatch) return el.dataset.pattern || 'Check the format.';
      return '';
    };
    const check = (el) => {
      const m = msg(el);
      const box = el.closest('.ff');
      const err = $('.err', box);
      box.classList.toggle('has-err', !!m);
      el.setAttribute('aria-invalid', String(!!m));
      err.textContent = m;
      return !m;
    };
    const fields = $$('input, textarea, select', form).filter((el) => el.closest('.ff'));
    fields.forEach((el) => {
      el.addEventListener('blur', () => { if (el.value || el.closest('.ff').classList.contains('has-err')) check(el); });
      el.addEventListener('input', () => { if (el.closest('.ff').classList.contains('has-err')) check(el); });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = fields.filter((el) => !check(el));
      if (bad.length) {
        status.className = 'form-status bad';
        status.textContent = `${bad.length} field${bad.length > 1 ? 's' : ''} to fix.`;
        bad[0].focus();
        return;
      }
      status.className = 'form-status';
      status.textContent = form.dataset.done || 'Checked. This study page does not send anything.';
    });
  });

  /* ── copy email ── */
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const card = b.closest('.ccard');
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { /* clipboard blocked: still show the address */ }
    card.classList.add('is-copied');
    setTimeout(() => card.classList.remove('is-copied'), 1600);
  }));

  /* ── brand assets: download the mark as an SVG file ── */
  $$('[data-download]').forEach((b) => b.addEventListener('click', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" width="260" height="260"><rect x="2" y="4" width="16" height="4" rx="2" fill="#ff488b"/><rect x="8" y="11" width="16" height="4" rx="2" fill="#ff488b"/><rect x="2" y="18" width="10" height="4" rx="2" fill="#ff488b"/></svg>\n';
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'axonfield-mark.svg';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }));

  /* ── article: "see all" button hides over the footer ── */
  const seeAll = $('.see-all');
  const ftr = $('.ftr');
  if (seeAll && ftr) {
    const upd = () => seeAll.classList.toggle('is-hidden', ftr.getBoundingClientRect().top < innerHeight - 20);
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ── use-case strips ── */
  $$('.letters').forEach((L) => {
    const hls = $$('.hl', L);
    if (!hls.length || reduce) { hls.forEach((h) => h.classList.add('is-on')); return; }
    let i = 0;
    setInterval(() => { hls.forEach((h, k) => h.classList.toggle('is-on', k === i || k === (i + 1) % hls.length)); i = (i + 1) % hls.length; }, 1400);
    hls[0].classList.add('is-on'); hls[1] && hls[1].classList.add('is-on');
  });
  $$('.frames').forEach((F) => {
    const cells = $$('div', F);
    if (reduce) return;
    let i = 0;
    setInterval(() => { cells.forEach((c, k) => c.classList.toggle('pk', k === i)); i = (i + 1) % cells.length; }, 900);
  });

  if (reduce) return;
  const inView = (el, pad = 0) => { const r = el.getBoundingClientRect(); return r.bottom > -pad && r.top < innerHeight + pad; };

  /* ── image parallax (original c-inner-parallax: picture translateY -90 → 90 px across the viewport) ── */
  const pars = $$('.feat-vis > .art, .post-img .art, .bl-feat .art, .art-img .art');
  pars.forEach((a) => { if (a.parentElement.classList.contains('feat-vis')) a.style.inset = '-96px 0'; });

  /* ── voice visualiser: every bar rescales each frame (original c-voice-visualizer_line) ── */
  const bars = $$('.bars i');
  const barSeed = bars.map((_, i) => [Math.random() * 6.28, 0.6 + Math.random() * 1.4, 1.7 + Math.random() * 2.3]);

  /* ── partner logos: a vertical conveyor, centre tile full size, edges at 0.7 (original c-feature-card-logo-carousel) ── */
  const convs = $$('.conv').map((c) => {
    const items = [...c.children];
    items.forEach((it) => { const cl = it.cloneNode(true); cl.setAttribute('aria-hidden', 'true'); c.appendChild(cl); });
    const all = [...c.children];
    c.style.cssText = 'position:absolute;inset:0;display:block';
    all.forEach((it) => { it.style.position = 'absolute'; it.style.left = '50%'; it.style.top = '50%'; });
    return { c, all };
  });

  const loop = (now) => {
    const H = innerHeight;
    for (const a of pars) {
      const r = a.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H) continue;
      const k = Math.min(1, Math.max(0, (H - r.top) / (H + r.height)));
      a.style.transform = `translate3d(0, ${(-90 + 180 * k).toFixed(1)}px, 0)`;
    }
    if (bars.length) {
      const t = now / 1000;
      bars.forEach((b, i) => {
        const [ph, f1, f2] = barSeed[i];
        const v = 0.2 + 0.8 * Math.abs(Math.sin(t * f1 + ph) * 0.6 + Math.sin(t * f2 + ph * 2) * 0.4);
        b.style.transform = `scaleY(${v.toFixed(3)})`;
      });
    }
    for (const { c, all } of convs) {
      const gap = 150, n = all.length, span = gap * n;
      const off = (now * 0.03) % span;
      all.forEach((it, i) => {
        let y = ((i * gap - off) % span + span) % span - span / 2;
        const d = Math.min(1, Math.abs(y) / (gap * 1.6));
        const sc = 1 - 0.3 * d;
        it.style.transform = `translate(-50%, calc(-50% + ${y.toFixed(1)}px)) scale(${sc.toFixed(3)})`;
        it.style.opacity = (1 - Math.max(0, d - 0.75) * 4).toFixed(2);
      });
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
