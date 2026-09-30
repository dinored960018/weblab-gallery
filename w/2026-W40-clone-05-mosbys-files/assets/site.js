/* Tillman's Files — interactions. Written from scratch for the clone study; timings measured from the original (SPEC.md). */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOVER = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const html = document.documentElement;
  const body = document.body;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const raf = requestAnimationFrame;

  /* ---------- easing + tween ---------- */
  const E = {
    lin: (t) => t,
    p2in: (t) => t * t,
    p2out: (t) => 1 - (1 - t) ** 2,
    p3out: (t) => 1 - (1 - t) ** 3,
    p4out: (t) => 1 - (1 - t) ** 4,
    p3io: (t) => (t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
    p35io: (t) => (t < .5 ? .5 * (2 * t) ** 3.5 : 1 - .5 * (2 - 2 * t) ** 3.5),
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const tw = (dur, ease, fn, delay = 0) => new Promise((res) => {
    if (RM || dur <= 0) { fn(1); return res(); }
    let t0 = null;
    const step = (now) => {
      if (t0 === null) t0 = now + delay;
      const t = Math.min(1, Math.max(0, (now - t0) / dur));
      fn(ease(t));
      if (t < 1) raf(step); else res();
    };
    raf(step);
  });
  const wait = (ms) => new Promise((r) => setTimeout(r, RM ? 0 : ms));
  const store = {
    get() { try { const v = JSON.parse(sessionStorage.getItem('tf-nav') || 'null'); sessionStorage.removeItem('tf-nav'); return v; } catch (e) { return null; } },
    set(v) { try { sessionStorage.setItem('tf-nav', JSON.stringify(v)); } catch (e) { /* storage off: plain navigation */ } },
  };
  const arrival = store.get();
  if ('scrollRestoration' in history && arrival) { history.scrollRestoration = 'manual'; scrollTo(0, 0); }

  /* ---------- Lenis ---------- */
  let lenis = null;
  if (!RM && window.Lenis) {
    try { lenis = new window.Lenis({ autoRaf: true, lerp: .1 }); } catch (e) { lenis = null; }
  }
  const lock = (on) => { html.classList.toggle('is-locked', on); if (lenis) on ? lenis.stop() : lenis.start(); };

  /* ---------- split text ---------- */
  const split = (el) => {
    const text = el.textContent.trim();
    el.textContent = '';
    const line = document.createElement('span'); line.className = 'line'; line.setAttribute('aria-hidden', 'true');
    text.split(' ').forEach((w, wi, arr) => {
      const word = document.createElement('span'); word.className = 'word';
      [...w].forEach((c) => { const m = document.createElement('span'); m.className = 'cm'; const ch = document.createElement('span'); ch.className = 'ch'; ch.textContent = c; m.appendChild(ch); word.appendChild(m); });
      line.appendChild(word); if (wi < arr.length - 1) line.appendChild(document.createTextNode(' '));
    });
    el.appendChild(line);
    return $$('.ch', el);
  };
  const charsIn = (chars, { from, dur, stagger, ease = E.p4out, delay = 0 }) => Promise.all(chars.map((ch, i) => {
    ch.style.opacity = 0; ch.style.transform = from;
    return tw(dur, ease, (p) => {
      ch.style.opacity = p;
      const m = from.match(/translate\(([-\d.]+)%,\s*([-\d.]+)%\)/);
      ch.style.transform = `translate(${lerp(+m[1], 0, p)}%, ${lerp(+m[2], 0, p)}%)`;
    }, delay + i * stagger).then(() => { ch.style.transform = ''; ch.style.opacity = ''; });
  }));

  /* ---------- header hide on scroll ---------- */
  const hdr = $('.hdr');
  const sub = $('.sub-hdr');
  let lastY = scrollY;
  const onScrollHeader = () => {
    const y = scrollY;
    if (body.classList.contains('is-about')) return;
    // direction with a 12px hysteresis so small eased corrections do not flicker the bar
    if (y <= 80) { hdr.classList.remove('is-hidden'); lastY = y; }
    else if (y > lastY + 12) { hdr.classList.add('is-hidden'); lastY = y; }
    else if (y < lastY - 12) { hdr.classList.remove('is-hidden'); lastY = y; }
    else if ((hdr.classList.contains('is-hidden') && y > lastY) || (!hdr.classList.contains('is-hidden') && y < lastY)) lastY = y;
    if (sub) {
      const hero = $('#hero');
      const past = y > hero.offsetTop + hero.offsetHeight - 60;
      const show = past && hdr.classList.contains('is-hidden');
      sub.classList.toggle('is-hidden', !show);
    }
  };
  addEventListener('scroll', onScrollHeader, { passive: true });

  const ready = () => document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, wait(1500)]) : Promise.resolve();

  /* ================= HOME ================= */
  if (body.classList.contains('is-home')) {
    const stack = $('.stack');
    const groups = $$('.sg', stack);
    const covers = groups.map((g) => $('.cover', g));
    const pagesOf = groups.map((g) => $$('.sp', g));
    const title = $('.hero__title');
    const desc = $('.hero__desc');
    const chars = split(title);
    let busy = false;

    const reset = () => {
      groups.forEach((g, gi) => {
        g.classList.remove('is-rotated', 'is-unfolded');
        covers[gi].classList.remove('is-hovered', 'is-rotated', 'is-unfolded');
        pagesOf[gi].forEach((p) => p.classList.remove('is-hovered', 'is-rotated'));
      });
      covers[covers.length - 1].classList.add('is-unfolded');
    };
    const setHover = (g, i, unfold) => {
      if (busy) return;
      groups.forEach((G, gi) => {
        const front = gi > g;
        G.classList.toggle('is-rotated', front);
        G.classList.toggle('is-unfolded', front && unfold);
        const on = gi === g;
        covers[gi].classList.toggle('is-hovered', on && i === 0);
        covers[gi].classList.toggle('is-rotated', on);
        covers[gi].classList.toggle('is-unfolded', on);
        pagesOf[gi].forEach((p, pi) => { p.classList.toggle('is-hovered', on && pi === i); p.classList.toggle('is-rotated', on && pi < i); });
      });
    };
    pagesOf.forEach((ps, g) => ps.forEach((p, i) => {
      if (HOVER) {
        p.addEventListener('pointerover', (e) => setHover(g, i, !!e.target.closest('.sp__unfold')));
        p.addEventListener('pointermove', (e) => { const u = !!e.target.closest('.sp__unfold'); if (groups[g + 1] && groups[g + 1].classList.contains('is-unfolded') !== u) setHover(g, i, u); });
      }
      p.addEventListener('focus', () => { setHover(g, i, false); const t = p.querySelector('.tag.is-on'); const r = t.getBoundingClientRect(); if (r.top < 70 || r.bottom > innerHeight) scrollTo({ top: scrollY + r.top - innerHeight / 2, behavior: 'instant' }); });
      p.addEventListener('blur', () => { if (!busy) reset(); });
      p.addEventListener('click', (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; e.preventDefault(); openCase(g, i, p); });
    }));
    if (HOVER) stack.addEventListener('pointerleave', () => { if (!busy) reset(); });

    // tab click → exit choreography (0–1280 ms of the original transition), then the case page plays the rest
    async function openCase(g, i, page) {
      if (busy) return; busy = true;
      setHover(g, i, false);
      const gr = groups[g].getBoundingClientRect();
      const tagEl = $('.tag.is-on', page); const tr = tagEl.getBoundingClientRect();
      store.set({ type: 'stack', slug: page.dataset.case, x: gr.left, y: gr.top, w: gr.width, h: gr.height, tagOff: tr.left - gr.left, vh: innerHeight });
      if (RM) { location.href = page.href; return; }
      stack.style.pointerEvents = 'none';
      // others fall away, the front-most group first
      const others = groups.map((G, gi) => gi).filter((gi) => gi !== g).sort((a, b) => b - a);
      others.forEach((gi, k) => {
        const G = groups[gi]; const base = getComputedStyle(G).transform; const b = base === 'none' ? '' : base;
        tw(350, E.p2in, (p) => { G.style.transform = `translateY(${lerp(0, 120, p)}%) ${b}`; }, 340 + k * 110);
      });
      pagesOf[g].forEach((P, pi) => {
        if (pi === i) return;
        const head = $('.sp__head', P);
        tw(380, E.p2out, (p) => { head.style.transform = `translateY(${110 * p}%)`; P.style.transform = `translateY(${120 * p}%)`; }, 340);
      });
      $$('.cover__desc, .cover__cat', stack).forEach((el) => tw(130, E.lin, (p) => { el.style.opacity = 1 - p; }, 340));
      tw(450, E.p2in, (p) => { desc.style.opacity = 1 - p; desc.style.transform = `translateY(${2 * p}rem)`; }, 380);
      tw(450, E.p2in, (p) => { title.style.opacity = 1 - p; title.style.transform = `translateY(${2 * p}rem)`; }, 480);
      await wait(1280);
      location.href = page.href;
    }

    // About link → hero up, stack down + scale (0–1200 ms), then the About page rises
    const toAbout = async (e) => {
      const a = e.currentTarget; if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault(); if (busy) return; busy = true;
      store.set({ type: 'about' });
      if (RM) { location.href = a.href; return; }
      hdr.classList.add('is-hidden');
      stack.style.transformOrigin = '50% 0%';
      tw(650, E.p2in, (p) => { title.style.transform = `translateY(${-50 * p}vh)`; }, 0);
      tw(650, E.p2in, (p) => { desc.style.transform = `translateY(${-50 * p}vh)`; }, 100);
      tw(850, E.p2in, (p) => { stack.style.transform = `translateY(${60 * p}%) scale(${lerp(1, 1.73, p)})`; }, 0);
      await wait(1200);
      location.href = a.href;
    };
    $$('[data-about]').forEach((a) => a.addEventListener('click', toAbout));

    // wind roses point at the pointer
    const roses = $$('[data-rose]');
    if (roses.length && !RM) {
      const cur = roses.map(() => 0); const tgt = roses.map(() => 0); let px = null, py = null, running = false;
      const loop = () => {
        let moving = false;
        roses.forEach((r, k) => {
          if (px !== null) { const b = r.getBoundingClientRect(); tgt[k] = Math.atan2(py - (b.top + b.height / 2), px - (b.left + b.width / 2)) * 180 / Math.PI + 90; }
          let d = ((tgt[k] - cur[k] + 540) % 360) - 180; cur[k] += d * .12; if (Math.abs(d) > .05) moving = true;
          r.style.transform = `rotate(${cur[k].toFixed(2)}deg)`;
        });
        if (moving) raf(loop); else running = false;
      };
      addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; if (!running) { running = true; raf(loop); } }, { passive: true });
    }

    // intro
    ready().then(async () => {
      html.classList.remove('is-loading');
      if (arrival && arrival.type === 'from-about' && !RM) {
        stack.style.transformOrigin = '50% 0%';
        tw(500, E.p3out, (p) => { stack.style.transform = `translateY(${lerp(60, 0, p)}%) scale(${lerp(1.73, 1, p)})`; });
        tw(700, E.p3out, (p) => { title.style.transform = `translateY(${lerp(-38, 0, p)}vh)`; desc.style.transform = `translateY(${lerp(-38, 0, p)}vh)`; }, 80);
        await wait(720);
      } else if (!RM) {
        tw(430, E.p4out, (p) => { stack.style.transform = `translateY(${lerp(-50, 0, p)}%)`; });
        groups.forEach((G, gi) => tw(470, E.p4out, (p) => { G.style.transform = `translateY(${lerp(200, 0, p)}%) scale(${lerp(1.75, 1, p)})`; }, 16 * (groups.length - 1 - gi)).then(() => { G.style.transform = ''; }));
        charsIn(chars, { from: 'translate(0%, 100%)', dur: 700, stagger: 15, delay: 390 });
        desc.style.opacity = 0;
        tw(600, E.p3out, (p) => { desc.style.opacity = p; desc.style.transform = `translateY(${lerp(2, 0, p)}rem)`; }, 890);
        await wait(560);
      }
      stack.style.transform = ''; title.style.transform = ''; desc.style.transform = '';
      body.classList.add('is-ready');
      reset();
    });
    return;
  }

  /* ================= ABOUT ================= */
  if (body.classList.contains('is-about')) {
    hdr.classList.add('is-hidden');
    const panel = $('.about'); const closeW = $('.about-close'); const gal = $('.gal'); const galIn = $('.gal__in'); const imgs = $('.gal__imgs');
    const txt = [$('.about__title'), $('.about__desc')];
    const sig = $('.sig__path');
    let len = 0; try { len = sig.getTotalLength(); } catch (e) { len = 0; }
    const close = async (e) => {
      if (e) e.preventDefault();
      store.set({ type: 'from-about' });
      const href = $('[data-close]').href;
      if (RM) { location.href = href; return; }
      tw(750, E.p2in, (p) => { panel.style.transform = `translateY(${60 * p}vh)`; panel.style.opacity = 1 - p; closeW.style.opacity = 1 - p; });
      await wait(760); location.href = href;
    };
    $('[data-close]').addEventListener('click', close);
    addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    ready().then(async () => {
      html.classList.remove('is-loading');
      if (!RM) {
        panel.style.opacity = 0; closeW.style.opacity = 0; txt.forEach((t) => { t.style.opacity = 0; });
        if (len) { sig.style.strokeDasharray = len; sig.style.strokeDashoffset = len; }
        tw(1000, E.p3out, (p) => { panel.style.opacity = p; panel.style.transform = `translateY(${lerp(60, 0, p)}vh)`; closeW.style.opacity = p; });
        tw(970, E.p3out, (p) => { gal.style.transform = `translateY(${lerp(-60, 0, p)}vh)`; galIn.style.transform = `translateY(${lerp(100, 0, p)}%)`; imgs.style.transform = `translateY(${lerp(-100, 0, p)}%)`; });
        tw(1000, E.p3out, (p) => txt.forEach((t) => { t.style.opacity = p; }), 100);
        if (len) tw(1600, E.p3out, (p) => { sig.style.strokeDashoffset = len * (1 - p); }, 700);
        await wait(1000);
        [panel, gal, galIn, imgs].forEach((el) => { el.style.transform = ''; });
      }
    });
    // gallery: cross-fade every 4.2 s
    const gi = $$('.gal__imgs img'); const gc = $$('.gal__caps p'); let k = 0;
    if (!RM && gi.length > 1) setInterval(() => { gi[k].classList.remove('is-active'); gc[k].classList.remove('is-active'); k = (k + 1) % gi.length; gi[k].classList.add('is-active'); gc[k].classList.add('is-active'); }, 4200);
    return;
  }

  /* ================= CASE ================= */
  if (body.classList.contains('is-case')) {
    const folder = $('.folder');
    const cover = $('.folder__cover');
    const coverO = $('.folder__cover-o'), coverS = $('.folder__cover-s'), coverSh = $('.folder__cover-sh');
    const sheet = $('.sheet');
    const title = $('.case-hero .case-title');
    const content = $('.page-case__content');
    const tagPages = $$('.ftags__page');
    const activeTags = $('.ftags__page.is-active');
    const nw = $('.nw'); const prog = $('.nw__prog');
    const nextHref = body.dataset.next;
    const chars = split(title);
    let leaving = false;

    /* ----- intro ----- */
    const intro = async () => {
      html.classList.remove('is-loading');
      if (RM) return;
      const fr = folder.getBoundingClientRect();
      if (arrival && arrival.type === 'stack' && arrival.slug === body.dataset.slug) {
        // the stack group becomes this folder: rotated -90° around its top-right corner, then turned upright
        const Wf = fr.width, Hf = fr.height;
        const W0 = arrival.h * (innerHeight / arrival.vh), H0 = arrival.w;
        const tx0 = arrival.x - fr.left - W0, ty0 = arrival.y - fr.top;
        folder.classList.add('is-anim');
        tagPages.forEach((t) => { t.style.transition = 'none'; if (t !== activeTags) t.style.transform = 'translateY(110%)'; });
        cover.style.transform = 'translate(-1rem, 0) rotateY(-3deg)'; coverO.style.opacity = 1; coverS.style.opacity = 1;
        chars.forEach((c) => { c.style.opacity = 0; });
        const set = (p) => {
          folder.style.width = `${lerp(W0, Wf, p)}px`; folder.style.height = `${lerp(H0, Hf, p)}px`;
          folder.style.transform = `translate(${lerp(tx0, 0, p)}px, ${lerp(ty0, 0, p)}px) rotate(${lerp(-90, 0, p)}deg)`;
        };
        set(0);
        const turn = tw(1430, E.p35io, set);
        tw(480, E.lin, (p) => { coverO.style.opacity = 1 - p; coverS.style.opacity = 1 - p; });
        tw(340, E.p2out, (p) => { cover.style.transform = `translate(${lerp(-1, 0, p)}rem, 0) rotateY(${lerp(-3, -6, p)}deg)`; });
        tw(1180, E.p3io, (p) => { cover.style.transform = `rotateY(${lerp(-6, -180, p)}deg)`; }, 340);
        tw(630, E.lin, (p) => { coverSh.style.opacity = p < .45 ? p / .45 : Math.max(0, 1 - (p - .45) / .55); }, 270);
        tagPages.forEach((t) => { if (t !== activeTags) tw(700, E.p3out, (p) => { t.style.transform = `translateY(${lerp(110, 0, p)}%)`; }, 870).then(() => { t.style.transform = ''; t.style.transition = ''; }); else t.style.transition = ''; });
        charsIn(chars, { from: 'translate(-150%, 0%)', dur: 600, stagger: 35, ease: E.p3out, delay: 950 });
        await turn;
        folder.classList.remove('is-anim');
        ['width', 'height', 'transform'].forEach((k) => { folder.style[k] = ''; });
        await wait(420); cover.style.transform = '';
      } else if (arrival && arrival.type === 'next' && arrival.slug === body.dataset.slug) {
        lock(true); setTimeout(() => lock(false), 900);
        tw(570, E.p3out, (p) => { folder.style.transform = `translateY(${lerp(206, 0, p)}px)`; }).then(() => { folder.style.transform = ''; });
        tagPages.forEach((t) => { t.style.transition = 'none'; t.style.transform = 'translateY(100%)'; tw(750, E.p3out, (p) => { t.style.transform = `translateY(${lerp(100, 0, p)}%)`; }, 620).then(() => { t.style.transform = ''; t.style.transition = ''; }); });
      } else {
        const d = innerHeight - fr.top;
        tw(980, E.p4out, (p) => { folder.style.transform = `translateY(${lerp(d, 0, p)}px)`; }).then(() => { folder.style.transform = ''; });
        tw(1080, E.p4out, (p) => { sheet.style.transform = `translateY(${lerp(10, 0, p)}rem)`; }).then(() => { sheet.style.transform = ''; });
        charsIn(chars, { from: 'translate(-100%, 0%)', dur: 1000, stagger: 25 });
      }
    };
    ready().then(intro);

    /* ----- next widget + overscroll ----- */
    let p = 0; // 0..100
    const setProg = (v) => {
      p = Math.max(0, Math.min(100, v));
      nw.style.setProperty('--prog', `${p - 100}%`);
      content.style.transform = p ? `translateY(${-5 * p / 100}vh)` : '';
    };
    const atBottom = () => scrollY + innerHeight >= html.scrollHeight - 4;
    const onScroll = () => {
      const hero = $('#hero');
      nw.classList.toggle('is-off', scrollY < hero.offsetTop + hero.offsetHeight - 10);
      const b = atBottom();
      nw.classList.toggle('is-over', b);
      if (!b && p) setProg(0);
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    const goNext = async () => {
      if (leaving) return; leaving = true;
      store.set({ type: 'next', slug: nextHref.split('/').slice(-2)[0] });
      if (RM) { location.href = nextHref; return; }
      const nf = $('.next-folder');
      tw(350, E.p2in, (q) => { nf.style.transform = `translateY(${-10 * q}vh)`; });
      tw(500, E.p2in, (q) => { folder.style.transform = `translateY(${-38 * q}vh)`; });
      await wait(520); location.href = nextHref;
    };
    addEventListener('wheel', (e) => {
      if (leaving || $('.popup')) return;
      if (e.deltaY > 0 && atBottom()) { nw.classList.add('is-over'); setProg(p + 5); if (p >= 100) goNext(); else armDecay(); }
      else if (e.deltaY < 0 && p) setProg(0);
    }, { passive: true });
    // the original drops the progress back to empty as soon as the wheel pauses (measured: 120 ms gaps keep it, longer gaps reset it)
    let decay = null;
    const armDecay = () => { clearTimeout(decay); decay = setTimeout(() => { if (!leaving) setProg(0); }, 200); };
    let ty = null;
    addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
    addEventListener('touchmove', (e) => {
      if (ty === null || leaving || !atBottom()) return;
      const d = ty - e.touches[0].clientY; if (Math.abs(d) < 24) return; ty = e.touches[0].clientY;
      if (d > 0) { setProg(p + 5); if (p >= 100) goNext(); else { clearTimeout(decay); decay = setTimeout(() => { if (!leaving) setProg(0); }, 600); } } else setProg(0);
    }, { passive: true });
    $$('[data-next-link]').forEach((a) => a.addEventListener('click', (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); goNext(); }));

    /* ----- drag ----- */
    const bounds = $('.bounds');
    let Z = 50;
    $$('.pc:not(.pc--clip)').forEach((pc) => {
      let sx, sy, ox = 0, oy = 0, bx = 0, by = 0, moved = false, id = null, downT = null;
      const target = pc.classList.contains('pc--deco') ? pc.firstElementChild : pc;
      const opener = pc.dataset.open ? pc : pc.querySelector('[data-open]');
      target.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || e.target.closest('.player__btn')) return;
        id = e.pointerId; sx = e.clientX; sy = e.clientY; bx = ox; by = oy; moved = false; downT = e.target;
        pc.style.zIndex = ++Z;
        try { target.setPointerCapture(id); } catch (err) { /* capture unsupported */ }
      });
      target.addEventListener('pointermove', (e) => {
        if (id !== e.pointerId) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 5) return;
        moved = true; pc.classList.add('is-dragging');
        const br = bounds.getBoundingClientRect(); const r = pc.getBoundingClientRect();
        const cx = r.left + r.width / 2 - ox + bx + dx, cy = r.top + r.height / 2 - oy + by + dy;
        const kx = Math.max(br.left, Math.min(br.right, cx)) - cx, ky = Math.max(br.top, Math.min(br.bottom, cy)) - cy;
        ox = bx + dx + kx; oy = by + dy + ky;
        pc.style.translate = `${ox}px ${oy}px`;
      });
      const end = (e) => {
        if (id !== e.pointerId) return; id = null; pc.classList.remove('is-dragging');
        if (!moved && opener && e.type === 'pointerup' && (opener === pc || opener.contains(downT))) openPopup(opener, pc);
      };
      target.addEventListener('pointerup', end); target.addEventListener('pointercancel', end);
      if (opener) opener.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPopup(opener, pc); } });
    });

    /* ----- audio ----- */
    $$('.player').forEach((pl) => {
      const btn = $('.player__btn', pl), au = $('audio', pl), wv = $('.player__waves', pl), tm = $('.player__time', pl);
      const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
      const sync = () => { const on = !au.paused; btn.setAttribute('aria-pressed', on); $('.i-play', btn).hidden = on; $('.i-pause', btn).hidden = !on; btn.setAttribute('aria-label', (on ? 'Pause ' : 'Play ') + btn.getAttribute('aria-label').replace(/^(Play|Pause) /, '')); };
      btn.addEventListener('click', () => { $$('audio').forEach((o) => { if (o !== au) o.pause(); }); if (au.paused) au.play().catch(() => {}); else au.pause(); });
      au.addEventListener('play', sync); au.addEventListener('pause', sync);
      au.addEventListener('timeupdate', () => { const d = au.duration || 25; wv.style.setProperty('--p', `${(au.currentTime / d) * 100}%`); tm.textContent = fmt(Math.max(0, d - au.currentTime)); });
      au.addEventListener('ended', () => { au.currentTime = 0; wv.style.setProperty('--p', '0%'); tm.textContent = '0:25'; sync(); });
    });

    /* ----- popup ----- */
    let pop = null;
    function openPopup(pc, piece = pc) {
      if (pop) return;
      const kind = pc.dataset.open;
      const el = document.createElement('div');
      el.className = `popup popup--${kind === 'video' ? 'video' : kind === 'pdf' ? 'pdf' : 'image'}`;
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', pc.dataset.cap);
      let view = '';
      if (kind === 'video') view = `<div class="vp">${pc.dataset.thumb ? `<img src="${pc.dataset.thumb}" alt="">` : ''}<p>${pc.dataset.cap}<br>No footage in this study copy.</p></div>`;
      else if (kind === 'pdf') view = document.getElementById(`doc-${body.dataset.slug}`).innerHTML;
      else if (kind === 'drawing' && pc !== piece) view = pc.outerHTML.replace(/ style="[^"]*--ar:([\d.]+)"/, ' style="--ar:$1"').replace(/ (tabindex|role|data-open)="[^"]*"/g, '');
      else view = pc.innerHTML;
      el.innerHTML = `<div class="popup__main"><div class="popup__view" tabindex="-1">${view}</div><div class="popup__side"><button class="xbtn" type="button" aria-label="Close">${'<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4.5 4.5l11 11M15.5 4.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'}</button><div class="info"><div class="info__in"><div class="info__d">${pc.dataset.cap}</div><div class="info__s">Source:<br>${pc.dataset.src}</div></div></div></div></div><div class="popup__bg"></div>`;
      body.appendChild(el);
      const v = $('.popup__view', el), bg = $('.popup__bg', el), xb = $('.xbtn', el), info = $('.info', el);
      let flip = null;
      if (kind === 'photo' || kind === 'drawing') {
        // fit the picture into the free area, then FLIP from its place on the desk
        const vis = $('.ph, .drw', v); const ar = parseFloat(getComputedStyle(vis).getPropertyValue('--ar')) || 1.4;
        const main = $('.popup__main', el); const cs = getComputedStyle(el);
        const aw = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const ah = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (innerWidth <= 1024 ? 180 : 0);
        let w = aw, h = w / ar; if (h > ah) { h = ah; w = h * ar; }
        v.style.width = `${w}px`; v.style.height = `${h}px`; vis.style.width = '100%'; vis.style.height = '100%';
        main.style.width = `${w}px`;
        const tr = v.getBoundingClientRect(); const sr = pc.getBoundingClientRect();
        const sw = pc.offsetWidth; const rot = parseFloat(getComputedStyle(piece).getPropertyValue('--r')) || 0;
        const dx = sr.left + sr.width / 2 - (tr.left + tr.width / 2), dy = sr.top + sr.height / 2 - (tr.top + tr.height / 2), sc = sw / tr.width;
        flip = { dx, dy, sc, rot };
        piece.style.visibility = 'hidden';
      }
      const setV = (q) => { if (flip) v.style.transform = `translate(${lerp(flip.dx, 0, q)}px, ${lerp(flip.dy, 0, q)}px) scale(${lerp(flip.sc, 1, q)}) rotate(${lerp(flip.rot, 0, q)}deg)`; else v.style.opacity = q; };
      setV(0); bg.style.opacity = 0; xb.style.opacity = 0; xb.style.transform = 'scale(.5)'; info.style.opacity = 0; info.style.transform = 'translateY(1rem)';
      tw(700, E.p3io, setV);
      tw(700, E.lin, (q) => { bg.style.opacity = q; });
      tw(325, E.p3out, (q) => { xb.style.opacity = q; xb.style.transform = `scale(${lerp(.5, 1, q)})`; }, 300).then(() => { xb.style.transform = ''; });
      tw(150, E.p3out, (q) => { info.style.opacity = q; info.style.transform = `translateY(${lerp(1, 0, q)}rem)`; }, 450);
      lock(true);
      const prev = document.activeElement;
      xb.focus({ preventScroll: true });
      const trap = (e) => {
        if (e.key === 'Escape') { e.preventDefault(); closeP(); }
        if (e.key === 'Tab') { const f = [xb, ...$$('a, button, [tabindex="0"]', v)]; const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
      };
      addEventListener('keydown', trap);
      let closing = false;
      const closeP = async () => {
        if (closing) return; closing = true;
        removeEventListener('keydown', trap);
        tw(90, E.lin, (q) => { bg.style.opacity = 1 - q; });
        tw(150, E.lin, (q) => { xb.style.opacity = 1 - q; info.style.opacity = 1 - q; });
        await tw(flip ? 680 : 325, flip ? E.p3io : E.lin, (q) => setV(1 - q));
        el.remove(); piece.style.visibility = ''; pop = null; lock(false);
        if (prev && prev.focus) prev.focus({ preventScroll: true });
      };
      xb.addEventListener('click', closeP);
      bg.addEventListener('click', closeP);
      el.addEventListener('click', (e) => { if (e.target === el) closeP(); });
      pop = el;
    }
  }

  /* ---------- 404 and fallbacks ---------- */
  ready().then(() => html.classList.remove('is-loading'));
})();
