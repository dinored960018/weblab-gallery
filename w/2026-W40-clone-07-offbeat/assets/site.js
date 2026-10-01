/* HALF-REST — 모작 동작. 원본 GSAP·barba 코드를 옮기지 않고 같은 결과를 직접 계산한다. */
(() => {
  const d = document, html = d.documentElement, body = d.body;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const vh = () => innerHeight;

  // ── 그레인 텍스처 (원본 셰이더의 grain 대체) ──
  (() => {
    const c = d.createElement('canvas'); c.width = c.height = 160;
    const g = c.getContext('2d'), im = g.createImageData(160, 160);
    for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 40; }
    g.putImageData(im, 0, 0);
    html.style.setProperty('--grain', `url(${c.toDataURL()})`);
  })();

  // ── 관성 스크롤 (Lenis) ──
  let lenis = null;
  if (window.Lenis && !RM) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const lock = on => { body.classList.toggle('is-locked', on); if (lenis) on ? lenis.stop() : lenis.start(); };

  // ── 준비 · 전환 막 ──
  const ready = () => requestAnimationFrame(() => html.classList.add('is-ready'));
  addEventListener('pageshow', e => { if (e.persisted) html.classList.remove('is-leaving'); });
  d.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.protocol !== location.protocol) return;
    if (url.pathname === location.pathname && url.hash) return;
    if (RM) return;
    e.preventDefault();
    html.classList.add('is-leaving');
    setTimeout(() => { location.href = a.href; }, 400);
  });

  // ── 내비 자동 숨김 ──
  const nav = $('.nav');
  let lastY = scrollY;
  const onNav = y => {
    if (!nav || nav.classList.contains('is-pre')) return;
    if (y > 119 && y > lastY + 2) nav.classList.add('is-hidden');
    else if (y < lastY - 2 || y <= 119) nav.classList.remove('is-hidden');
    lastY = y;
  };
  d.addEventListener('focusin', e => { if (nav && nav.contains(e.target)) nav.classList.remove('is-hidden'); });

  // ── 모바일 메뉴 ──
  const burger = $('.nav__burger'), mm = $('#mmenu');
  if (burger && mm) {
    const close = $('.mmenu__close', mm);
    const open = on => {
      mm.classList.toggle('is-open', on); mm.setAttribute('aria-hidden', String(!on)); mm.inert = !on;
      burger.setAttribute('aria-expanded', String(on)); lock(on);
      (on ? close : burger).focus();
    };
    mm.inert = true;
    burger.addEventListener('click', () => open(true));
    close.addEventListener('click', () => open(false));
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && mm.classList.contains('is-open')) open(false); });
    mm.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const f = $$('a,button', mm), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  // ── 커서 점 ──
  const cur = $('.cursor');
  if (cur && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let x = -50, y = -50, tx = -50, ty = -50;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; cur.classList.add('is-on'); }, { passive: true });
    d.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
    d.addEventListener('pointerover', e => cur.classList.toggle('is-hover', !!e.target.closest('a,button,[role=button],input,textarea,label')));
    const loop = () => { x = lerp(x, tx, .35); y = lerp(y, ty, .35); cur.style.left = x + "px"; cur.style.top = y + "px"; requestAnimationFrame(loop); };
    loop();
  }

  // ── 등장 (줄·단어·글자) ──
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  const watchReveal = () => $$('[data-words],[data-chars],[data-lines]:not([data-manual])').forEach(el => io.observe(el));

  // ── 스크롤 장면 ──
  const hero = $('.home .hero'), heroDim = hero && $('.hero__dim', hero);
  const stDim = $('.st-hero__dim');
  const plx = $('.plx');
  const plxImg = plx && $('.plx__img', plx), plxFade = plx && $('.plx__fade', plx);
  const plxSent = plx ? $$('.plx__s', plx).map(s => $$('.c__in', s)) : [];
  const feats = $$('[data-bg]');
  const footer = $('.footer'), fInner = footer && $('.footer__inner', footer), fDark = footer && $('.footer__dark', footer);
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const BG = '#0a0a0a';

  const charT = (p, i, n, a, b) => {
    // 문장 구간 [a,b] 안에서 글자 i 의 진행도 (앞 글자부터 차례로)
    const span = b - a, each = span * .5, lag = (span - each) / Math.max(1, n - 1);
    return clamp((p - a - i * lag) / each);
  };
  const charX = t => {
    if (t <= 0) return 'translate(0,120%) rotate(10deg)';
    if (t < .35) { const k = t / .35, e = 1 - Math.pow(1 - k, 3); return `translate(0,${120 * (1 - e)}%) rotate(${10 * (1 - e)}deg)`; }
    if (t < .65) return 'translate(0,0) rotate(0deg)';
    const k = (t - .65) / .35, e = k * k * k; return `translate(0,${-120 * e}%) rotate(${-10 * e}deg)`;
  };

  // 스크롤만 해도 포인터 아래 이름 행이 바뀌게 (원본과 같은 동작)
  let px = -1, py = -1, hotRow = null;
  addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; }, { passive: true });
  const rowAtPointer = () => {
    if (px < 0) return;
    const el = d.elementFromPoint(px, py), row = el && el.closest('.tlist__a');
    if (row !== hotRow) { if (hotRow) hotRow.classList.remove('is-hot'); if (row) row.classList.add('is-hot'); hotRow = row; }
  };

  const scene = () => {
    const y = scrollY, h = vh();
    onNav(y);
    rowAtPointer();
    if (hero && !RM) {
      const p = clamp(y / (h * 1.33));
      hero.style.transform = `translate3d(0,0,0) scale(${1 - .08 * p})`;
      heroDim.style.opacity = (.95 * p).toFixed(3);
    }
    if (stDim) stDim.style.opacity = (clamp(y / h) * .7).toFixed(3);
    if (plx) {
      const top = plx.offsetTop, len = plx.offsetHeight - h;
      const enter = clamp((y + h - top) / h);
      const p = clamp((y - top + h * .5) / (len + h * .5));
      const k = 1 - Math.pow(1 - enter, 2);
      const iy = lerp(181, 0, k), ix = lerp(161, 0, k);
      plxImg.style.clipPath = innerWidth < 768 ? `inset(${lerp(80, 0, k)}px ${lerp(30, 0, k)}px)` : `inset(${iy}px ${ix}px)`;
      plxSent.forEach((chars, s) => {
        const a = s ? .42 : .0, b = s ? .88 : .46;
        chars.forEach((c, i) => { c.style.transform = RM ? 'none' : charX(charT(p, i, chars.length, a, b)); });
      });
      plxFade.style.opacity = clamp((p - .86) / .14).toFixed(3);
    }
    if (feats.length) {
      // 섹션 윗변이 화면 아래 → 위로 올라오는 동안 앞 색에서 섹션 색으로
      let col = hex(BG);
      feats.forEach(f => {
        const r = f.getBoundingClientRect();
        const t = clamp((h * .9 - r.top) / (h * .6));
        const target = hex(f.dataset.bg);
        col = col.map((v, i) => Math.round(lerp(v, target[i], t)));
      });
      body.style.backgroundColor = `rgb(${col.join(',')})`;
    }
    if (footer && fInner) {
      const r = footer.getBoundingClientRect();
      const e = clamp(1 - r.top / h);
      fInner.style.transform = RM ? 'none' : `translate3d(0,${-25 * (1 - e)}%,0)`;
      fDark.style.opacity = (.5 * (1 - e)).toFixed(3);
      if (e > .7) footer.classList.add('is-in');
    }
  };
  let ticking = false;
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; scene(); }); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);

  // ── 홈 인트로 ──
  const intro = $('.intro');
  const startPage = () => {
    ready();
    const heads = $$('[data-lines][data-manual]');
    if (nav) nav.classList.remove('is-pre');
    heads.forEach(el => el.classList.add('is-in'));
    watchReveal();
    scene();
  };
  if (intro && !RM) {
    const media = $('.hero__media');
    if (media) media.classList.add('is-pre');
    lock(true);
    html.classList.add('is-ready');
    setTimeout(() => intro.classList.add('is-in'), 1900);
    setTimeout(() => { if (nav) nav.classList.remove('is-pre'); }, 2850);
    setTimeout(() => { intro.classList.remove('is-in'); intro.classList.add('is-out'); }, 3150);
    setTimeout(() => {
      intro.classList.add('is-open');
      if (media) { media.classList.add('is-rise'); media.classList.remove('is-pre'); }
    }, 4000);
    setTimeout(() => { lock(false); startPage(); }, 4950);
    setTimeout(() => intro.classList.add('is-done'), 5650);
  } else {
    if (intro) intro.classList.add('is-done');
    const go = () => setTimeout(startPage, 60);
    d.readyState === 'loading' ? d.addEventListener('DOMContentLoaded', go) : go();
  }

  // ── 목록: 카드 등장 · 필터 ──
  const cards = $$('.card');
  // 호버용 두 번째 사진은 카드가 화면에 들어올 때 넣는다 (처음부터 숨긴 사진을 받지 않게)
  const addAlt = c => { const box = c.querySelector('[data-alt]'); if (!box || box.querySelector('.card__alt')) return; const im = new Image(); im.className = 'card__alt'; im.alt = ''; im.decoding = 'async'; im.src = box.dataset.alt; box.appendChild(im); };
  if (cards.length) {
    const cio = new IntersectionObserver(es => {
      let n = 0;
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const c = e.target; c.style.setProperty('--d', `${(n++ % 4) * 60}ms`);
        c.classList.add('is-show'); c.classList.remove('is-pre'); cio.unobserve(c); addAlt(c);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    const arm = list => list.forEach(c => { if (RM) addAlt(c); if (!RM) { c.classList.remove('is-show'); c.classList.add('is-pre'); cio.observe(c); } });
    arm(cards);

    const groups = $$('.fgroup');
    const count = $('.lcount'), empty = $('.cards__empty');
    const state = {};
    const apply = () => {
      const shown = [];
      cards.forEach(c => {
        const ok = Object.entries(state).every(([k, v]) => {
          if (v === 'all') return true;
          const cv = c.dataset[k] || '';
          if (k === 'year' && v === 'earlier') return +cv < 2023;
          return cv === v;
        });
        c.hidden = !ok; if (ok) shown.push(c);
      });
      if (count) count.textContent = `${shown.length}개 표시`;
      if (empty) empty.hidden = shown.length > 0;
      arm(shown);
      req();
    };
    groups.forEach(g => {
      const key = g.dataset.key; state[key] = 'all';
      $$('.fbtn', g).forEach(b => b.addEventListener('click', () => {
        $$('.fbtn', g).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        state[key] = b.dataset.v; apply();
      }));
    });
  }

  // ── 목록 배경 (값 노이즈 임계값 · 캔버스 2D) ──
  const fx = $('.bgfx');
  if (fx) {
    const g = fx.getContext('2d');
    const off = d.createElement('canvas'), og = off.getContext('2d');
    const S = 12; let W = 0, H = 0, img;
    const size = () => { fx.width = innerWidth; fx.height = innerHeight; W = Math.ceil(innerWidth / S); H = Math.ceil(innerHeight / S); off.width = W; off.height = H; img = og.createImageData(W, H); };
    size(); addEventListener('resize', size);
    const rnd = (x, y) => { const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return s - Math.floor(s); };
    const noise = (x, y) => {
      const ix = Math.floor(x), iy = Math.floor(y), fx_ = x - ix, fy = y - iy;
      const a = rnd(ix, iy), b = rnd(ix + 1, iy), c = rnd(ix, iy + 1), e = rnd(ix + 1, iy + 1);
      const ux = fx_ * fx_ * (3 - 2 * fx_), uy = fy * fy * (3 - 2 * fy);
      return lerp(a, b, ux) + (c - a) * uy * (1 - ux) + (e - b) * ux * uy;
    };
    const lo = [8, 8, 8], hi = [74, 74, 74];
    const draw = t => {
      const time = RM ? 0 : t * .00008, pulse = Math.sin(time * 6) * .04;
      const zoom = 2.4, ar = W / H;
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
        const n = noise((i / W) * zoom * ar + time, (j / H) * zoom + time);
        const e0 = .44 + pulse, e1 = e0 + .2, k = clamp((n - e0) / (e1 - e0)), s = k * k * (3 - 2 * k);
        const o = (j * W + i) * 4;
        img.data[o] = lerp(lo[0], hi[0], s); img.data[o + 1] = lerp(lo[1], hi[1], s); img.data[o + 2] = lerp(lo[2], hi[2], s); img.data[o + 3] = 255;
      }
      og.putImageData(img, 0, 0);
      g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
      g.drawImage(off, 0, 0, fx.width, fx.height);
      if (!RM) requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
    const gr = $('.bgfx-grain');
    if (gr && !RM) { const jit = () => { gr.style.transform = `translate(${(Math.random() * 40) | 0}px,${(Math.random() * 40) | 0}px)`; setTimeout(() => requestAnimationFrame(jit), 70); }; jit(); }
  }

  // ── 상세: 뷰어 · 썸네일 · 라이트박스 ──
  const viewer = $('.viewer');
  if (viewer) {
    const track = $('.viewer__track', viewer), slides = $$('.viewer__slide', viewer), thumbs = $$('.thumb');
    const n = slides.length; let idx = 0;
    const go = i => {
      idx = (i + n) % n;
      track.style.transform = `translate3d(${-idx * 100}%,0,0)`;
      thumbs.forEach((t, k) => t.setAttribute('aria-current', String(k === idx)));
      slides.forEach((s, k) => { s.tabIndex = k === idx ? 0 : -1; s.setAttribute('aria-hidden', String(k !== idx)); });
      const live = $('.viewer__live'); if (live) live.textContent = `${idx + 1} / ${n}`;
    };
    thumbs.forEach((t, k) => t.addEventListener('click', () => go(k)));
    // 드래그 · 스와이프
    let sx = 0, dx = 0, drag = false, moved = false;
    viewer.addEventListener('pointerdown', e => { drag = true; moved = false; sx = e.clientX; dx = 0; viewer.classList.add('is-drag'); viewer.setPointerCapture(e.pointerId); });
    viewer.addEventListener('pointermove', e => { if (!drag) return; dx = e.clientX - sx; if (Math.abs(dx) > 6) moved = true; track.style.transform = `translate3d(calc(${-idx * 100}% + ${dx}px),0,0)`; });
    const end = () => { if (!drag) return; drag = false; viewer.classList.remove('is-drag'); if (Math.abs(dx) > 60) go(idx + (dx < 0 ? 1 : -1)); else go(idx); };
    viewer.addEventListener('pointerup', end); viewer.addEventListener('pointercancel', end);

    const lb = $('.lb'), lbImg = $('.lb__img', lb), lbCount = $('.lb__count', lb);
    let li = 0, opener = null;
    const show = i => { li = (i + n) % n; const im = $('img', slides[li]); lbImg.src = im.currentSrc || im.src; lbImg.alt = im.alt; lbCount.textContent = `${li + 1}/${n}`; };
    const openLb = i => { opener = d.activeElement; show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); lb.inert = false; lock(true); $('.lb__close', lb).focus(); };
    const closeLb = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); lb.inert = true; lock(false); go(li); (opener || slides[li]).focus(); };
    lb.inert = true;
    viewer.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; return; } openLb(idx); });
    $('.lb__prev', lb).addEventListener('click', () => show(li - 1));
    $('.lb__next', lb).addEventListener('click', () => show(li + 1));
    $('.lb__close', lb).addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb__stage')) closeLb(); });
    d.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') show(li + 1);
      else if (e.key === 'ArrowLeft') show(li - 1);
      else if (e.key === 'Tab') {
        const f = $$('button', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    go(0);
  }

  // ── FAQ 아코디언 (하나만 열림 · 높이 360ms) ──
  const faqs = $$('.faq__item');
  const setH = (it, on) => { const a = $('.faq__a', it), inn = $('.faq__in', it); a.style.height = on ? (inn.scrollHeight + (it.classList.contains('is-open') ? 0 : 22)) + 'px' : '0px'; a.inert = !on; };
  faqs.forEach(it => {
    const q = $('.faq__q', it);
    q.addEventListener('click', () => {
      const on = !it.classList.contains('is-open');
      faqs.forEach(o => { if (o !== it && o.classList.contains('is-open')) { setH(o, false); o.classList.remove('is-open'); $('.faq__q', o).setAttribute('aria-expanded', 'false'); } });
      setH(it, on); it.classList.toggle('is-open', on); q.setAttribute('aria-expanded', String(on));
    });
  });
  faqs.forEach(it => setH(it, false));
  const init = faqs.find(it => it.hasAttribute('data-open-init'));
  if (init) setTimeout(() => $('.faq__q', init).click(), 600);
  addEventListener('resize', () => faqs.forEach(it => { if (it.classList.contains('is-open')) setH(it, true); }));

  // ── 마퀴 (기본 흐름 + 스크롤 방향 가산) ──
  const rows = $$('.marquee__row');
  if (rows.length && !RM) {
    const pos = rows.map(() => 0); let prev = scrollY;
    const tick = () => {
      const v = scrollY - prev; prev = scrollY;
      rows.forEach((r, i) => {
        const dir = i % 2 ? 1 : -1, half = r.scrollWidth / 2;
        pos[i] += dir * (0.6 + Math.min(12, Math.abs(v)) * .5);
        if (pos[i] <= -half) pos[i] += half; if (pos[i] > 0) pos[i] -= half;
        r.style.transform = `translate3d(${pos[i]}px,0,0)`;
      });
      requestAnimationFrame(tick);
    };
    tick();
  }

  // ── 폼 검증 (전송하지 않음) ──
  const form = $('.form');
  if (form) {
    const note = $('.form__note', form);
    const rules = {
      email: v => !v ? '이메일을 입력해 주십시오.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '이메일 형식을 확인해 주십시오. 예: name@studio.kr' : '',
      name: v => v ? '' : '성함을 입력해 주십시오.',
      org: v => v ? '' : '소속을 입력해 주십시오. 개인이면 ‘개인’이라고 적어 주십시오.',
      msg: v => v.length >= 10 ? '' : '촬영 목적과 희망 일정을 10자 이상 적어 주십시오.',
    };
    const check = el => {
      const msg = rules[el.name](el.value.trim()), err = $(`#${el.id}-err`);
      err.textContent = msg; el.setAttribute('aria-invalid', String(!!msg)); return !msg;
    };
    $$('input,textarea', form).forEach(el => el.addEventListener('blur', () => { if (el.getAttribute('aria-invalid') !== null) check(el); }));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const els = $$('input,textarea', form), bad = els.filter(el => !check(el));
      if (bad.length) { note.textContent = ''; bad[0].focus(); return; }
      note.textContent = '이 페이지는 모작이라 실제로 보내지 않습니다. 입력한 내용은 저장되지 않습니다.';
    });
  }

  scene();
})();
