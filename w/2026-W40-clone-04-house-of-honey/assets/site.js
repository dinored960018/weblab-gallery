/* Parlor of Plum — interactions. Timings measured from the original (see SPEC.md 모션 타임라인). */
(() => {
  const d = document, root = d.documentElement;
  root.classList.add('js');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const VT = 'cubic-bezier(.7,0,.25,1)';
  const EASE = 'cubic-bezier(.65,.05,.36,1)';
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const store = { get(k) { try { return sessionStorage.getItem(k); } catch { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch {} } };

  /* ---------- intro (first page of a session only) ---------- */
  const intro = $('.intro');
  let introDelay = 0;
  if (intro) {
    if (store.get('pop-intro') || RM) intro.remove();
    else { store.set('pop-intro', '1'); introDelay = 1100; intro.addEventListener('animationend', () => intro.remove()); }
  }

  /* ---------- split lines ---------- */
  const splitEl = (el) => {
    if (!el.dataset.src) el.dataset.src = el.innerHTML;
    const segs = el.dataset.src.split(/<br\s*\/?>/i).map((s) => { const t = d.createElement('div'); t.innerHTML = s; return t.textContent.replace(/\s+/g, ' ').trim(); }).filter(Boolean);
    if (!segs.length) return;
    const ex = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    el.innerHTML = segs.map((s) => s.split(' ').map((w) => `<span class="w">${ex(w)}</span>`).join(' ')).join('<br>');
    const lines = []; let top = null, prev = null;
    for (const s of $$('.w', el)) {
      const t = Math.round(s.offsetTop);
      const forced = prev && prev.nextSibling && prev.nextSibling.nodeName === 'BR';
      if (t !== top || forced) { lines.push([]); top = t; }
      lines[lines.length - 1].push(s.textContent); prev = s;
    }
    el.innerHTML = lines.map((l, i) => `<span class="ln" style="--line:${i}">${ex(l.join(' '))}</span>`).join('');
  };
  const splits = $$('[data-split]');
  const doSplit = () => splits.forEach((el) => { const was = el.classList.contains('is-in'); splitEl(el); if (was) el.classList.add('is-in'); });
  const playSplit = (el, base = 0) => {
    el.classList.add('is-in');
    if (RM) return;
    $$('.ln', el).forEach((ln, i) => ln.animate(
      [{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }],
      { duration: 800, delay: base + i * 80, easing: 'ease-out', fill: 'backwards' }));
  };
  (d.fonts ? d.fonts.ready : Promise.resolve()).then(() => {
    doSplit();
    let w = innerWidth;
    addEventListener('resize', () => { if (innerWidth !== w) { w = innerWidth; doSplit(); } });
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting);
      vis.forEach((e, n) => { io.unobserve(e.target); playSplit(e.target, (e.target.closest('.hh-top') ? introDelay : 0) + n * 100); });
    }, { rootMargin: '0px 0px -8% 0px' });
    splits.forEach((el) => io.observe(el));
  });

  /* ---------- rise / draw / marquee fade ---------- */
  const once = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    once.unobserve(e.target);
    const t = e.target; t.classList.add('is-in');
    if (!RM && t.hasAttribute('data-rise')) t.animate([{ opacity: 0.001 }, { opacity: 1 }], { duration: 800, delay: 200, easing: VT, fill: 'backwards' });
    if (!RM && t.hasAttribute('data-fadein')) t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: VT, fill: 'backwards' });
  }), { rootMargin: '0px 0px -10% 0px' });
  $$('[data-rise], [data-draw], [data-fadein]').forEach((el) => once.observe(el));
  /* the original fades every marquee in at load (≈0.9 s), not on view */
  $$('.mq-fade').forEach((el) => el.classList.add('is-on'));

  /* marquee speed: constant ≈28 px/s like the original (112 s for its longest word) */
  const setMarquees = () => $$('.mq-set').forEach((s) => { const w = s.getBoundingClientRect().width; s.style.setProperty('--dur', Math.max(20, w / 28 / s.children.length).toFixed(2) + 's'); });
  (d.fonts ? d.fonts.ready : Promise.resolve()).then(setMarquees);

  /* ---------- parallax ---------- */
  const pxs = $$('.px-in');
  let ticking = false;
  const para = () => {
    ticking = false;
    const vh = innerHeight;
    for (const el of pxs) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      const p = ((vh - r.top) / (vh + r.height)) * 2 - 1;
      el.style.transform = `translateY(calc(var(--po) * ${Math.max(-1, Math.min(1, p)).toFixed(4)}))`;
    }
  };
  if (!RM) { addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(para); } }, { passive: true }); addEventListener('resize', para); para(); }

  /* ---------- curtain buttons ---------- */
  $$('.btn-line').forEach((b) => {
    const c = $('.curtain', b); if (!c) return;
    const enter = () => { c.style.transition = 'none'; c.style.transform = 'translateY(100%)'; c.offsetHeight; c.style.transition = `transform .4s ${EASE}`; c.style.transform = 'translateY(0)'; };
    const leave = () => { c.style.transition = `transform .4s ${EASE}`; c.style.transform = 'translateY(-100%)'; };
    b.addEventListener('pointerenter', enter); b.addEventListener('pointerleave', leave);
    b.addEventListener('focus', () => { if (b.matches(':focus-visible')) enter(); }); b.addEventListener('blur', leave);
  });

  /* ---------- hero slideshow: clip wipe right→left, 5866 ms period, 1870 ms transition ---------- */
  const slides = $$('.slides .slide');
  if (slides.length > 1) {
    const bar = $('.slides .bar i');
    const PERIOD = 5866, T = 1870;
    let cur = 0, t0 = performance.now() + introDelay, busy = false;
    const go = () => {
      busy = true;
      const out = slides[cur], nx = (cur + 1) % slides.length, inn = slides[nx];
      const outT = $('.slide-t', out), inT = $('.slide-t', inn);
      inn.style.zIndex = 2; inn.style.opacity = 1;
      const o = { duration: T, easing: VT, fill: 'forwards' };
      const a1 = inn.animate([{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)' }], o);
      inT.style.transformOrigin = 'left center';
      inT.animate([{ transform: 'scale(1.072) rotate(0.45deg)' }, { transform: 'scale(1) rotate(0deg)' }], o);
      outT.animate([{ transform: 'translate3d(0,0,0) scale(1) rotate(0deg)' }, { transform: 'translate3d(-2.4%,0,0) scale(.958) rotate(-.35deg)' }], o);
      a1.onfinish = () => {
        out.classList.remove('is-cur'); out.style.zIndex = ''; out.style.opacity = '';
        out.getAnimations({ subtree: true }).forEach((a) => a.cancel());
        inn.classList.add('is-cur'); inn.style.zIndex = ''; inn.getAnimations({ subtree: true }).forEach((a) => a.cancel());
        cur = nx; busy = false;
      };
    };
    const loop = (now) => {
      const k = (now - t0) / PERIOD;
      if (bar) bar.style.transform = `scaleX(${Math.max(0, Math.min(1, k)).toFixed(4)})`;
      if (k >= 1 && !busy) { t0 = now; go(); }
      requestAnimationFrame(loop);
    };
    if (!RM) requestAnimationFrame(loop);
    else if (bar) bar.style.transform = 'scaleX(1)';
  }

  /* ---------- mobile menu ---------- */
  const mbtn = $('.mbtn'), menu = $('#mmenu');
  if (mbtn && menu) {
    const set = (open) => {
      mbtn.setAttribute('aria-expanded', open); mbtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', open); menu.setAttribute('aria-hidden', !open); menu.inert = !open;
      root.classList.toggle('is-locked', open);
      if (open) setTimeout(() => $('a', menu).focus(), 60);
    };
    menu.inert = true;
    mbtn.addEventListener('click', () => set(mbtn.getAttribute('aria-expanded') !== 'true'));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { set(false); mbtn.focus(); } });
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = [mbtn, ...$$('a, button', menu)]; const i = f.indexOf(d.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    addEventListener('resize', () => { if (innerWidth >= 1024 && menu.classList.contains('is-open')) set(false); });
  }
  const top = $('.mhdr-top'); if (top) top.addEventListener('click', () => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }));

  /* ---------- lightbox ---------- */
  const lb = $('#lb');
  if (lb) {
    const items = $$('.gitem');
    const track = $('.lb-track', lb), dots = $('.lb-dots', lb), prev = $('.lb-prev', lb), next = $('.lb-next', lb), vp = $('.lb-vp', lb);
    track.innerHTML = items.map((a, i) => { const im = $('img', a); return `<div class="lb-slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}"><img src="${im.getAttribute('src')}" alt="${im.alt}" width="${im.getAttribute('width')}" height="${im.getAttribute('height')}" loading="lazy" draggable="false"></div>`; }).join('');
    dots.innerHTML = items.map((_, i) => `<button type="button" aria-label="Show image ${i + 1}"></button>`).join('');
    let idx = 0, opener = null;
    const show = (i, anim = true) => {
      idx = Math.max(0, Math.min(items.length - 1, i));
      track.style.transition = anim ? '' : 'none';
      track.style.transform = `translate3d(calc(${-idx * 100}% - ${idx * 4}px),0,0)`;
      $$('button', dots).forEach((b, k) => b.setAttribute('aria-current', k === idx));
      if (!lb.hidden) { try { history.replaceState(null, '', '?photo=' + idx); } catch {} }
      prev.disabled = idx === 0; next.disabled = idx === items.length - 1;
      $$('.lb-slide', track).forEach((s, k) => s.setAttribute('aria-hidden', k !== idx));
    };
    const open = (i, from) => {
      opener = from; lb.hidden = false; lb.classList.remove('is-closing'); lb.classList.add('is-open');
      root.classList.add('is-locked'); show(i, false); $('.lb-close', lb).focus();
      try { history.replaceState(null, '', '?photo=' + i); } catch {}
    };
    const close = () => {
      lb.classList.add('is-closing');
      try { history.replaceState(null, '', location.pathname); } catch {}
      const done = () => { lb.hidden = true; lb.classList.remove('is-open', 'is-closing'); root.classList.remove('is-locked'); if (opener) opener.focus(); };
      RM ? done() : setTimeout(done, 480);
    };
    items.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); open(i, a); }));
    const deep = new URLSearchParams(location.search).get('photo');
    if (deep !== null && items[+deep]) open(+deep, items[+deep]);
    $('.lb-close', lb).addEventListener('click', close);
    prev.addEventListener('click', () => show(idx - 1)); next.addEventListener('click', () => show(idx + 1));
    dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show($$('button', dots).indexOf(b)); });
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'Tab') { const f = $$('button:not([disabled])', lb); const k = f.indexOf(d.activeElement); if (e.shiftKey && k <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
    let sx = null;
    vp.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    addEventListener('pointerup', (e) => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); });
  }

  /* gallery expand icon: shown while the frame is in view (original: 350 ms fade in/out, refs/states/gallery-hover.jpg) */
  const gitems = $$('.gitem');
  if (gitems.length) {
    const fade = (el, to) => { const g = $('.gx', el); const from = getComputedStyle(g).opacity; if (+from === to) return; g.getAnimations().forEach((a) => a.cancel()); g.style.opacity = to; if (!RM) g.animate([{ opacity: from }, { opacity: to }], { duration: 350, easing: VT }); };
    const gio = new IntersectionObserver((es) => es.forEach((en) => fade(en.target, en.intersectionRatio >= 0.5 ? 1 : 0)), { threshold: [0, 0.5] });
    gitems.forEach((g) => gio.observe(g));
  }

  /* ---------- generic carousel (story pages) ---------- */
  $$('.car').forEach((car) => {
    const tr = $('.car-track', car), prev = $('.car-prev', car), next = $('.car-next', car);
    const n = tr.children.length; let i = 0;
    const per = () => (innerWidth >= 1024 ? 3 : 1);
    const upd = () => {
      const max = Math.max(0, n - per()); i = Math.min(i, max);
      const w = tr.children[0].getBoundingClientRect().width + 8;
      tr.style.transform = `translate3d(${-i * w}px,0,0)`;
      prev.disabled = i === 0; next.disabled = i >= max;
      [...tr.children].forEach((c, k) => c.setAttribute('aria-hidden', k < i || k >= i + per()));
    };
    prev.addEventListener('click', () => { i--; upd(); }); next.addEventListener('click', () => { i++; upd(); });
    addEventListener('resize', upd); upd();
  });

  /* ---------- press: load more ---------- */
  const more = $('#load-more');
  if (more) {
    more.addEventListener('click', () => {
      const hid = $$('.pitem[hidden]').slice(0, 10);
      hid.forEach((el, k) => { el.hidden = false; if (!RM) el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: k * 60, easing: 'ease-out', fill: 'backwards' }); });
      if (hid[0]) $('a, h2', hid[0]) && hid[0].focus();
      const left = $$('.pitem[hidden]').length;
      $('#press-count').textContent = `${$$('.pitem:not([hidden])').length} of ${$$('.pitem').length} shown`;
      if (!left) more.closest('.load-w').hidden = true;
    });
  }

  /* ---------- press: cover stack ---------- */
  const covs = $$('.cov');
  if (covs.length > 1 && !RM) {
    let c = 0;
    covs[0].classList.add('is-cur');
    setInterval(() => {
      covs.forEach((x) => x.classList.remove('is-prev'));
      covs[c].classList.remove('is-cur'); covs[c].classList.add('is-prev');
      c = (c + 1) % covs.length;
      const nx = covs[c]; nx.style.transition = 'none'; nx.classList.remove('is-prev'); nx.offsetHeight; nx.style.transition = ''; nx.classList.add('is-cur');
    }, 2600);
  } else if (covs[0]) covs[0].classList.add('is-cur');

  /* ---------- forms ---------- */
  $$('form[data-validate]').forEach((f) => {
    const rules = { fullName: 'Full name is required', email: 'Email is required', message: 'Message is required' };
    const check = (el) => {
      const v = el.value.trim(); let m = '';
      if (!v) m = rules[el.name] || 'Required';
      else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) m = 'Enter a valid email';
      el.setAttribute('aria-invalid', !!m);
      $('#' + el.getAttribute('aria-describedby'), f).textContent = m;
      return !m;
    };
    const fields = $$('input:not([type=hidden]):not([tabindex="-1"]), textarea', f);
    fields.forEach((el) => el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') check(el); }));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = fields.filter((el) => !check(el));
      const st = $('.form-status', f);
      if (bad.length) { bad[0].focus(); st.textContent = ''; return; }
      st.textContent = 'Thank you. Sending is switched off on this study site.';
    });
  });

  /* ---------- password gate ---------- */
  const gate = $('#gate-form');
  if (gate) {
    const inp = $('input', gate), err = $('#pw-err'), eye = $('.pw button', gate);
    eye.addEventListener('click', () => { const s = inp.type === 'password'; inp.type = s ? 'text' : 'password'; eye.setAttribute('aria-pressed', s); eye.setAttribute('aria-label', s ? 'Hide password' : 'Show password'); });
    gate.addEventListener('submit', (e) => {
      e.preventDefault();
      err.textContent = inp.value.trim() ? 'Incorrect password' : 'Password is required';
      inp.setAttribute('aria-invalid', 'true'); inp.focus();
    });
  }

  /* ---------- bee cursor (canvas 2D) ---------- */
  const cv = $('.bee canvas');
  if (cv && !RM && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const wrap = cv.parentElement, ctx = cv.getContext('2d');
    const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = cv.height = 40 * dpr; ctx.scale(dpr, dpr);
    let tx = -100, ty = -100, x = -100, y = -100, ang = 0, seen = false;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; if (!seen) { seen = true; x = tx; y = ty; wrap.classList.add('is-on'); wrap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.25,.1,.35,1)' }); } }, { passive: true });
    d.addEventListener('pointerleave', () => wrap.classList.remove('is-on'));
    d.addEventListener('pointerenter', () => { if (seen) wrap.classList.add('is-on'); });
    const draw = (t) => {
      const dx = tx - x, dy = ty - y;
      x += dx * 0.16; y += dy * 0.16;
      const target = Math.hypot(dx, dy) > 2 ? Math.atan2(dy, dx) : ang;
      let da = target - ang; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; ang += da * 0.12;
      const hover = Math.sin(t / 260) * 1.5;
      wrap.style.transform = `translate(${(x + 14).toFixed(1)}px, ${(y + 14 + hover).toFixed(1)}px)`;
      ctx.clearRect(0, 0, 40, 40);
      ctx.save(); ctx.translate(20, 20); ctx.rotate(ang * 0.25);
      const flap = Math.abs(Math.sin(t / 28));
      ctx.fillStyle = 'rgba(255,248,239,.85)'; ctx.strokeStyle = 'rgba(51,25,23,.6)'; ctx.lineWidth = .8;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(-2 + s * 1, -6, 5, 8 * (0.35 + 0.65 * flap), s * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = '#331917'; ctx.beginPath(); ctx.ellipse(0, 2, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 2, 9, 6, 0, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = '#fc72c4'; for (const sx of [-5, -1, 3]) ctx.fillRect(sx, -5, 2.2, 14); ctx.restore();
      ctx.fillStyle = '#331917'; ctx.beginPath(); ctx.arc(9, 1, 3.6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-9, 2); ctx.lineTo(-12.5, 2.5); ctx.lineTo(-9, 3.6); ctx.fill();
      ctx.restore();
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }
})();
