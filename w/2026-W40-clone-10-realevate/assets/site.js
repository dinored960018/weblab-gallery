/* HALVORIA — REALEVATE 모작 동작. 라이브러리 없음(원본은 GSAP·ScrollTrigger·SplitText — 같은 결과를 직접 계산). */
(() => {
  const d = document, root = d.documentElement, body = d.body;
  const page = body.dataset.page;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const $ = (s, el = d) => el.querySelector(s);
  const $$ = (s, el = d) => [...el.querySelectorAll(s)];

  /* ---------- 배율 k = min(1, 높이/950) — 원본 --compact-vw-as-svh ---------- */
  const setK = () => {
    if (innerWidth >= 1024) root.style.setProperty('--k', Math.min(1, innerHeight / 950).toFixed(4));
    else root.style.removeProperty('--k');
  };
  setK();
  addEventListener('resize', setK);

  /* ---------- 스크롤 위치 (선택 화면이 열린 동안은 고정값) ---------- */
  let frozenY = null;
  const SY = () => (frozenY != null ? frozenY : scrollY);

  /* ---------- 마퀴: 왼쪽으로 96px/s (1440 기준) ---------- */
  const marquees = $$('.marquee-track').map((t) => ({ t, x: 0, w: 0 }));
  const measureMarquees = () => marquees.forEach((m) => { m.w = m.t.firstElementChild ? m.t.firstElementChild.getBoundingClientRect().width : 0; });

  /* ---------- 등장 ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  $$('[data-reveal], .marquee--outro').forEach((el) => io.observe(el));

  const ready = () => {
    body.classList.add('is-loaded');
    measureMarquees();
  };

  /* ---------- 홈 프리로더 (0 → 100, 사진 5장, 남색 막이 위로 걷힘) ---------- */
  const pl = $('#preloader');
  if (pl) {
    if (RM) { pl.classList.add('is-gone'); ready(); }
    else {
      const num = $('[data-pl-num]', pl);
      const t0 = performance.now(), DUR = 3100;
      const tick = (now) => {
        const p = clamp((now - t0 - 600) / DUR, 0, 1);
        num.textContent = Math.round(p * p * (3 - 2 * p) * 100);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      setTimeout(() => { pl.classList.add('is-out'); ready(); }, 3800);
      setTimeout(() => pl.classList.add('is-gone'), 4800);
    }
  } else {
    (d.fonts ? d.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(ready));
    setTimeout(ready, 1200);
  }
  if (d.fonts) d.fonts.ready.then(measureMarquees);

  /* ---------- 오른쪽 아래 버튼 색 — 버튼 뒤 섹션 톤 ---------- */
  const actions = $('[data-actions]');
  const tones = $$('[data-tone]');
  const updateTone = () => {
    if (!actions || body.classList.contains('is-selection')) return;
    const y = innerHeight - actions.getBoundingClientRect().height / 2 - parseFloat(getComputedStyle(actions).bottom);
    let dark = false;
    for (const el of tones) {
      const r = el.getBoundingClientRect();
      if (r.top <= y && r.bottom >= y) dark = el.dataset.tone === 'dark';
    }
    // 히어로 사진이 화면을 덮은 동안
    actions.classList.toggle('is-dark', dark);
    if (stage) actions.classList.toggle('is-high', stage.getBoundingClientRect().bottom > innerHeight - 10);
  };

  /* ---------- 카테고리 히어로: 273² → 100vw × 110svh, 그 뒤 위로 밀리며 0.3 까지 흐려짐 ---------- */
  const stage = $('[data-hero-stage]');
  const hv = $('[data-hero-visual]');
  const heroScroll = () => {
    if (!stage || !hv) return;
    const s = SY();
    const vw = innerWidth, vh = innerHeight;
    const v = parseFloat(getComputedStyle(root).getPropertyValue('--k')) || 0.947;
    const mobile = vw < 768;
    const size0 = mobile ? vw * 0.34 : vw * 0.2 * (innerWidth >= 1024 ? v : 1.35);
    const top0 = mobile ? vh * 0.28 - vw * 0.02 : vh * 0.2589;
    const endH = vh * 1.1;
    const gap = vw * 0.05236 * v;
    const growLen = (endH + gap) * 2;
    const p = clamp(s / growLen, 0, 1);
    hv.style.width = lerp(size0, vw, p) + 'px';
    hv.style.height = lerp(size0, endH, p) + 'px';
    hv.style.top = lerp(top0, 0, p) + 'px';
    const pinEnd = stage.offsetHeight - vh;
    const q = clamp((s - pinEnd) / vh, 0, 1.2);
    stage.style.transform = q > 0 ? `translate3d(0, ${(s - pinEnd) * 0.342}px, 0)` : '';
    stage.style.opacity = q > 0 ? String(1 - Math.min(q, 1) * 0.7) : '';
  };

  /* ---------- 패럴랙스 이미지 ---------- */
  const pars = $$('[data-par]').map((img) => { const [amt, sc] = img.dataset.par.split(',').map(Number); return { img, amt, sc, box: img.parentElement }; });
  const nextPar = $('[data-next-par]');
  const parScroll = () => {
    if (RM) return;
    const vh = innerHeight;
    for (const o of pars) {
      const r = o.box.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) continue;
      const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      o.img.style.transform = `translate3d(0, ${lerp(-o.amt, o.amt, p)}%, 0) scale(${o.sc})`;
    }
    if (nextPar) {
      const r = nextPar.getBoundingClientRect();
      const p = clamp((vh - r.top) / r.height, 0, 1);
      nextPar.style.transform = `translate3d(0, ${lerp(-6, 0, p)}%, 0) scale(${lerp(1.16, 1, p)})`;
    }
  };

  /* ---------- About: 사진 위 어둠 · 영상 칸 확대 ---------- */
  const shade = $('[data-ab-shade]');
  const vbtn = $('[data-video]');
  const vStage = $('[data-video-stage]');
  const aboutScroll = () => {
    if (shade) shade.style.opacity = String(0.18 + clamp(SY() / innerHeight, 0, 1) * 0.42);
    if (!vbtn || !vStage || innerWidth < 768) { if (vbtn) vbtn.style.transform = ''; return; }
    const s = SY(), vh = innerHeight;
    vbtn.style.transform = '';
    const r0 = vbtn.getBoundingClientRect();
    const docTop = r0.top + s;
    const L = vh * 1.05;
    const start = docTop + r0.height / 2 - vh * 0.62;
    const p = clamp((s - start) / L, 0, 1);
    const e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    const pad = parseFloat(getComputedStyle(root).getPropertyValue('--pad')) || 61.4;
    const tw = innerWidth - pad * 2;
    const sc = lerp(1, tw / r0.width, e);
    const th = r0.height * sc;
    // 목표: 화면 가운데. p=1 뒤에는 페이지와 같이 올라간다.
    const pinShift = Math.max(0, s - (start + L));
    const top = lerp(r0.top, (vh - th) / 2, e) - pinShift;
    const left = lerp(r0.left, pad, e);
    vbtn.style.transform = `translate3d(${left - r0.left}px, ${top - r0.top}px, 0) scale(${sc})`;
  };

  /* ---------- 커스텀 스크롤바 ---------- */
  const sb = $('.scrollbar'), thumb = $('.scrollbar-thumb');
  let sbTimer = 0;
  const sbUpdate = () => {
    if (!sb || page === 'home' || page === 'contact') return;
    const h = root.scrollHeight, vh = innerHeight;
    const th = Math.max(40, vh * vh / h);
    thumb.style.height = th + 'px';
    thumb.style.transform = `translateY(${(vh - th) * (scrollY / Math.max(1, h - vh))}px)`;
  };
  if (thumb) {
    let dragY = null, startS = 0;
    thumb.addEventListener('pointerdown', (e) => { dragY = e.clientY; startS = scrollY; thumb.setPointerCapture(e.pointerId); });
    thumb.addEventListener('pointermove', (e) => {
      if (dragY == null) return;
      const h = root.scrollHeight, vh = innerHeight, th = thumb.offsetHeight;
      scrollTo(0, startS + (e.clientY - dragY) * (h - vh) / (vh - th));
    });
    thumb.addEventListener('pointerup', () => { dragY = null; });
  }

  /* ---------- 스크롤 루프 ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      heroScroll(); parScroll(); aboutScroll(); sbUpdate(); updateTone();
    });
    if (sb && frozenY == null) { sb.classList.add('is-on'); clearTimeout(sbTimer); sbTimer = setTimeout(() => sb.classList.remove('is-on'), 1100); }
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measureMarquees(); onScroll(); });
  onScroll();

  /* ---------- 슬라이더: 사선 배치 + 스크롤 흐름 + 화살표 + 끌기 ---------- */
  const slider = $('[data-slider]');
  let sl = null;
  if (slider) {
    const view = $('.slider-view', slider), track = $('.slider-track', slider);
    const orig = $$('.slide', track);
    // 앞뒤로 한 벌씩 복제해 끝없이 이어 붙인다 (원본도 3벌)
    const n = orig.length;
    orig.forEach((s) => { const c = s.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
    orig.slice().reverse().forEach((s) => { const c = s.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.insertBefore(c, track.firstChild); });
    const slides = $$('.slide', track);
    const status = $('[data-slider-status]', slider);
    sl = { manual: 0, target: 0, drag: null, idx: 0 };
    const pitch = () => slides[0].offsetWidth + view.offsetWidth * 0.01945;
    const slope = 104 / 739;
    const render = () => {
      const P = pitch(), W = P * n, vw = view.offsetWidth;
      sl.manual += (sl.target - sl.manual) * (sl.drag ? 1 : 0.085);
      const drift = RM ? 0 : SY() * 0.513;
      let base = -(sl.manual + drift);
      base = ((base % W) + W) % W - W; // 0..−W
      const center = vw / 2;
      slides.forEach((s, i) => {
        const x = base + (i - n) * P + W + (vw - slides[0].offsetWidth) / 2;
        const cx = x + slides[0].offsetWidth / 2;
        const y = -(cx - center) * slope;
        s.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
    const go = (dir) => {
      const P = pitch();
      sl.target = Math.round((sl.target) / P) * P + dir * P;
      sl.idx = ((sl.idx + dir) % n + n) % n;
      if (status) status.textContent = `Slide ${sl.idx + 1} of ${n}`;
    };
    $$('.slider-arrow', slider).forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.dir))));
    view.addEventListener('pointerdown', (e) => { sl.drag = { x: e.clientX, m: sl.target }; view.classList.add('is-drag'); view.setPointerCapture(e.pointerId); });
    view.addEventListener('pointermove', (e) => { if (sl.drag) { sl.target = sl.drag.m - (e.clientX - sl.drag.x); } });
    const end = () => { if (!sl.drag) return; sl.drag = null; view.classList.remove('is-drag'); const P = pitch(); sl.target = Math.round(sl.target / P) * P; };
    view.addEventListener('pointerup', end); view.addEventListener('pointercancel', end);
  }

  /* ---------- 마퀴 프레임 ---------- */
  let last = performance.now();
  const frame = (now) => {
    const dt = Math.min(64, now - last); last = now;
    if (!RM) {
      const speed = 96 * (innerWidth / 1440);
      for (const m of marquees) {
        if (!m.w) continue;
        m.x -= speed * dt / 1000;
        if (m.x <= -m.w) m.x += m.w;
        m.t.style.transform = `translate3d(${m.x}px,0,0)`;
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  /* ---------- Our Selection ---------- */
  const sel = $('#selection'), selBtn = $('.sel-btn'), stageEl = $('#stage');
  const cards = $$('.sel-card', sel || d);
  cards.forEach((c, i) => c.style.setProperty('--n', i));
  let selOpen = false, selBusy = false;
  const openSel = () => {
    if (selOpen || !sel) return;
    selOpen = true; selBusy = true;
    frozenY = scrollY;
    stageEl.classList.add('is-frozen');
    stageEl.scrollTop = frozenY;
    sel.hidden = false;
    body.classList.add('is-locked');
    requestAnimationFrame(() => requestAnimationFrame(() => { body.classList.add('is-selection'); }));
    selBtn.setAttribute('aria-expanded', 'true');
    stageEl.setAttribute('aria-hidden', 'true');
    setTimeout(() => { selBusy = false; cards[0] && cards[0].focus({ preventScroll: true }); }, 900);
  };
  const closeSel = (focusBtn = true) => {
    if (!selOpen) return;
    selOpen = false; selBusy = true;
    body.classList.remove('is-selection');
    selBtn.setAttribute('aria-expanded', 'false');
    stageEl.removeAttribute('aria-hidden');
    setTimeout(() => {
      sel.hidden = true;
      stageEl.classList.remove('is-frozen');
      body.classList.remove('is-locked');
      const y = frozenY; frozenY = null;
      if (y) scrollTo(0, y);
      selBusy = false;
      onScroll();
    }, 1000);
    if (focusBtn) selBtn.focus({ preventScroll: true });
  };
  if (selBtn) selBtn.addEventListener('click', () => (selOpen ? closeSel() : openSel()));
  if (stageEl) stageEl.addEventListener('click', (e) => { if (selOpen) { e.preventDefault(); e.stopPropagation(); closeSel(); } }, true);

  // 카드 → 그 카테고리 색으로 화면을 채운 뒤 이동
  cards.forEach((c) => c.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || RM) return;
    e.preventDefault();
    const r = c.getBoundingClientRect();
    const cover = d.createElement('div');
    cover.style.cssText = `position:fixed;z-index:500;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;background:${getComputedStyle($('.sel-panel', c)).backgroundColor};transition:all .8s cubic-bezier(.76,0,.24,1)`;
    body.appendChild(cover);
    requestAnimationFrame(() => requestAnimationFrame(() => { cover.style.left = '0px'; cover.style.top = '0px'; cover.style.width = '100vw'; cover.style.height = '100svh'; }));
    setTimeout(() => { location.href = c.href; }, 820);
  }));

  // 홈: 휠 아래 = 선택 열기, 위 = 닫기 (원본 홈은 스크롤 대신 이 전환)
  if (page === 'home') {
    let acc = 0, wt = 0;
    addEventListener('wheel', (e) => {
      if (body.classList.contains('is-menu')) return;
      acc += e.deltaY; clearTimeout(wt); wt = setTimeout(() => (acc = 0), 200);
      if (selBusy) return;
      if (acc > 40 && !selOpen) { acc = 0; openSel(); }
      else if (acc < -40 && selOpen) { acc = 0; closeSel(false); }
    }, { passive: true });
    let ty = null;
    addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
    addEventListener('touchend', (e) => {
      if (ty == null || selBusy) return;
      const dy = ty - e.changedTouches[0].clientY; ty = null;
      if (dy > 50 && !selOpen) openSel(); else if (dy < -50 && selOpen) closeSel(false);
    }, { passive: true });
  }

  /* ---------- 메뉴 ---------- */
  const nm = $('#nav-menu'), menuBtn = $('.menu-btn');
  let menuOpen = false, lastFocus = null;
  const openMenu = () => {
    if (menuOpen) return;
    menuOpen = true; lastFocus = d.activeElement;
    nm.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('is-menu')));
    menuBtn.setAttribute('aria-expanded', 'true');
    setTimeout(() => $('.roll', nm).focus({ preventScroll: true }), 350);
  };
  const closeMenu = () => {
    if (!menuOpen) return;
    menuOpen = false;
    body.classList.remove('is-menu');
    menuBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { if (!menuOpen) nm.hidden = true; }, 850);
    (lastFocus && lastFocus.focus ? lastFocus : menuBtn).focus({ preventScroll: true });
  };
  if (menuBtn) menuBtn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  $$('[data-menu-close]', nm || d).forEach((el) => el.addEventListener('click', closeMenu));

  /* ---------- 정책 오버레이 (Contact) ---------- */
  const pol = $('#policy');
  let polOpen = false, polFrom = null;
  const openPol = (from) => {
    polOpen = true; polFrom = from;
    pol.hidden = false; body.classList.add('is-locked');
    requestAnimationFrame(() => requestAnimationFrame(() => pol.classList.add('is-open')));
    setTimeout(() => $('.so-close', pol).focus({ preventScroll: true }), 50);
  };
  const closePol = () => {
    if (!polOpen) return; polOpen = false;
    pol.classList.remove('is-open'); body.classList.remove('is-locked');
    setTimeout(() => { if (!polOpen) pol.hidden = true; }, 800);
    polFrom && polFrom.focus({ preventScroll: true });
  };
  $$('.policy-open').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); openPol(b); }));
  if (pol) $$('[data-policy-close]', pol).forEach((b) => b.addEventListener('click', closePol));

  /* ---------- 키보드: ESC · 포커스 가둠 ---------- */
  const trap = (container, e) => {
    const f = $$('a[href], button:not([disabled]), input, select, textarea', container).filter((el) => el.offsetParent !== null || el === d.activeElement);
    if (!f.length) return;
    const first = f[0], lastEl = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); lastEl.focus(); }
    else if (!e.shiftKey && d.activeElement === lastEl) { e.preventDefault(); first.focus(); }
  };
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (polOpen) return closePol();
      if (menuOpen) return closeMenu();
      if (selOpen) return closeSel();
    }
    if (e.key === 'Tab') {
      if (polOpen) trap($('.so-panel', pol), e);
      else if (menuOpen) trap($('.menu-panel', nm), e);
      else if (selOpen) trap(sel, e);
    }
  });

  /* ---------- 끝까지 내린 뒤 더 굴리면 다음 페이지 (원본 scroll-continue) ---------- */
  const nextLink = $('[data-next-link]');
  const ring = $('.cursor-ring');
  if (nextLink && ring && !RM) {
    let lastWheel = 0, prog = 0, decay = 0, mx = innerWidth / 2, my = innerHeight / 2, gone = false;
    addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; ring.style.setProperty('--cx', mx + 'px'); ring.style.setProperty('--cy', my + 'px'); }, { passive: true });
    addEventListener('wheel', (e) => {
      if (gone || selOpen || menuOpen) return;
      const atEnd = scrollY + innerHeight >= root.scrollHeight - 2;
      if (!atEnd || e.deltaY <= 0) { if (e.deltaY < 0 && prog > 0) { prog = Math.max(0, prog - 0.2); } return; }
      ring.style.setProperty('--cx', mx + 'px'); ring.style.setProperty('--cy', my + 'px');
      ring.classList.add('is-on'); ring.classList.remove('is-out');
      // 원본: 끝에서 계속 굴리는 동안 약 2.4초에 링이 다 찬다 (휠 사이 간격을 시간으로 더함, 한 번에 최대 120ms)
      const tNow = performance.now();
      prog = Math.min(1, prog + Math.min(120, tNow - (lastWheel || tNow - 60)) / 2400);
      lastWheel = tNow;
      ring.style.setProperty('--p', (prog * 100).toFixed(1) + '%');
      clearTimeout(decay);
      decay = setTimeout(() => { if (!gone) { prog = 0; ring.style.setProperty('--p', '0%'); ring.classList.add('is-out'); ring.classList.remove('is-on'); } }, 1400);
      if (prog >= 1) {
        gone = true;
        ring.classList.add('is-out'); ring.classList.remove('is-on');
        const nx = nextLink.closest('.next');
        nx.classList.add('is-leaving');
        const r = nx.getBoundingClientRect();
        nx.style.transition = 'height .9s cubic-bezier(.76,0,.24,1)';
        nx.style.height = (r.height + (innerHeight - r.bottom) + (r.top)) + 'px';
        scrollTo({ top: root.scrollHeight, behavior: 'smooth' });
        setTimeout(() => { location.href = nextLink.href; }, 950);
      }
    }, { passive: true });
  }

  /* ---------- About 영상 칸: 재생/정지(사진 3컷 순환), 커서 원 ---------- */
  if (vbtn) {
    const img = $('.ab-vframe', vbtn);
    const frames = img.dataset.frames.split(',');
    const cur = $('.video-cursor');
    const label = cur && $('span', cur);
    let timer = 0, k = 0;
    const setState = (on) => {
      vbtn.classList.toggle('is-playing', on);
      vbtn.setAttribute('aria-pressed', String(on));
      vbtn.setAttribute('aria-label', on ? 'Pause video' : 'Play video');
      if (label) label.textContent = on ? 'Pause' : 'Play';
      clearInterval(timer);
      if (on) timer = setInterval(() => { img.classList.add('is-swap'); setTimeout(() => { k = (k + 1) % frames.length; img.src = frames[k]; img.classList.remove('is-swap'); }, 450); }, 2600);
    };
    vbtn.addEventListener('click', () => setState(!vbtn.classList.contains('is-playing')));
    if (cur && matchMedia('(pointer: fine)').matches) {
      vbtn.addEventListener('pointerenter', () => cur.classList.add('is-on'));
      vbtn.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
      vbtn.addEventListener('pointermove', (e) => { cur.style.setProperty('--x', e.clientX + 'px'); cur.style.setProperty('--y', e.clientY + 'px'); });
    }
  }

  /* ---------- Contact: 탭 · 메일 복사 · 폼 검증 ---------- */
  const tabs = $$('.c-tab');
  if (tabs.length) {
    const select = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.classList.toggle('is-active', on);
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const panel = d.getElementById(x.getAttribute('aria-controls'));
        panel.hidden = !on; panel.classList.toggle('is-active', on);
      });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true); }
      });
    });
  }
  $$('[data-copy]').forEach((b) => b.addEventListener('click', () => {
    const v = b.dataset.copy;
    const done = () => { b.classList.add('is-copied'); setTimeout(() => b.classList.remove('is-copied'), 1800); };
    if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(v).then(done, done); else done();
  }));
  const MSG = { valueMissing: 'Required', typeMismatch: 'Check the format' };
  $$('.c-form').forEach((f) => {
    const fields = $$('input, select, textarea', f);
    const check = (el) => {
      const err = d.getElementById(el.id + '-err');
      if (!err) return true;
      const v = el.validity;
      const bad = !v.valid;
      el.setAttribute('aria-invalid', String(bad));
      if (bad) { el.setAttribute('aria-describedby', err.id); err.textContent = el.type === 'checkbox' ? 'Please accept to continue' : (v.valueMissing ? MSG.valueMissing : MSG.typeMismatch); }
      else err.textContent = '';
      return !bad;
    };
    fields.forEach((el) => el.addEventListener(el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'blur', () => { if (el.hasAttribute('aria-invalid')) check(el); }));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = $('.f-status', f);
      const okAll = fields.map(check).every(Boolean);
      if (!okAll) {
        status.textContent = '';
        const firstBad = fields.find((el) => el.getAttribute('aria-invalid') === 'true');
        firstBad && firstBad.focus();
        return;
      }
      // 모작은 보내지 않는다 — 원본의 접수 완료 문구 자리
      status.textContent = 'Thank you. We will reply within two working days.';
    });
  });
})();
