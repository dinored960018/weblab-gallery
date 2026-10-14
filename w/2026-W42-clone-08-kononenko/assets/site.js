// Veldmark 모작 — 모션 · 기능. 시각 · 지속시간 · 이징은 refs/motion-origin/motion.json 실측(SPEC.md 「모션」)을 따른다.
(() => {
  const html = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const isHome = document.body.classList.contains('pg-home');

  // ── 관성 스크롤 (원본: Lenis) — CDN 이 안 오면 네이티브 스크롤 ──
  let lenis = null;
  const startLenis = () => {
    if (RM || !window.Lenis || lenis) return;
    lenis = new window.Lenis({ lerp: 0.1 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  };
  window.addEventListener('load', startLenis);

  // ── 줄 나누기 등장 (span.ln translateY 101% → 0, 1.1s, 줄마다 60ms) ──
  const SRC = new WeakMap();
  function split(el) {
    if (!SRC.has(el)) SRC.set(el, el.innerHTML);
    el.classList.remove('split');
    el.innerHTML = SRC.get(el);
    const toks = [];
    const walk = (node) => {
      for (const n of [...node.childNodes]) {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          for (const p of parts) {
            if (!p) continue;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); continue; }
            const s = document.createElement('span'); s.className = 'tk'; s.textContent = p; frag.appendChild(s); toks.push(s);
          }
          n.replaceWith(frag);
        } else if (n.nodeName === 'BR') { toks.push(n); }
        else if (n.nodeType === 1) { n.classList.add('tk'); toks.push(n); }
      }
    };
    walk(el);
    const lines = []; let cur = null; let top = null;
    const tol = parseFloat(getComputedStyle(el).fontSize) * 0.45;
    for (const t of toks) {
      if (t.nodeName === 'BR') { cur = null; top = null; continue; }
      const r = t.getBoundingClientRect(), y = r.top + r.height / 2;
      if (!cur || Math.abs(y - top) > tol) { cur = []; lines.push(cur); top = y; }
      cur.push(t);
    }
    const indent = el.classList.contains('ind');
    el.innerHTML = '';
    lines.forEach((ln, i) => {
      const m = document.createElement('span'); m.className = 'lm';
      if (indent && i === 0) m.style.paddingLeft = 'var(--ind)';
      const s = document.createElement('span'); s.className = 'ln'; s.style.setProperty('--d', i);
      ln.forEach((t, j) => { if (j) s.appendChild(document.createTextNode(' ')); s.appendChild(t); });
      m.appendChild(s); el.appendChild(m);
    });
    el.classList.add('split');
  }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  const splitAll = () => $$('[data-lines]').forEach(split);
  const fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve();
  if (!RM) {
    fontsReady.then(() => {
      splitAll();
      $$('[data-lines]').forEach((el) => io.observe(el));
      let w = innerWidth;
      addEventListener('resize', () => { if (innerWidth === w) return; w = innerWidth; clearTimeout(split.t); split.t = setTimeout(splitAll, 150); });
    });
    $$('.offices').forEach((ul) => { $$('li', ul).forEach((li, i) => li.style.setProperty('--r', i)); io.observe(ul); });
    $$('.ft-mono').forEach((m) => { $$('.fm span', m).forEach((s, i) => s.style.setProperty('--d', i)); io.observe(m); });
  }

  // ── 푸터 대형 글자: 폭에 맞춰 글자 크기 맞춤 ──
  const fitMono = () => $$('.ft-mono').forEach((m) => {
    m.style.fontSize = '';
    const cs = getComputedStyle(m);
    const inner = m.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const sum = $$('.fm', m).reduce((a, s) => a + s.getBoundingClientRect().width, 0);
    if (sum > 0) m.style.fontSize = (parseFloat(cs.fontSize) * (inner * 0.985) / sum) + 'px';
  });
  fontsReady.then(fitMono);
  addEventListener('resize', fitMono);

  // ── 등장 순서: 프리로더(홈) 또는 전환 막(하위 페이지) ──
  const at = (ms, fn) => setTimeout(fn, Math.max(0, ms - performance.now()));
  const pre = $('#pre');
  const curtain = $('#curtain');
  if (RM) {
    html.classList.add('hs', 'ready');
    if (pre) pre.remove();
  } else if (pre) {
    // 원본 녹화(load): 막대 574→2303ms · 숫자 위로 퇴장 1426→1904 · 덮개 1904→2399 · 히어로 확대 1.1→1 518ms부터 3.8s · 단어 2.4s부터 100ms 간격
    const bar = $('.pre-bar', pre), num = $('.pre-n span', pre);
    at(518, () => html.classList.add('hs'));
    at(574, () => bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 1729, easing: 'cubic-bezier(.17,.84,.44,1)', fill: 'forwards' }));
    const t0 = performance.now();
    const count = () => {
      const p = clamp((performance.now() - t0) / Math.max(400, 1300 - t0));
      num.textContent = Math.round(100 * (1 - Math.pow(1 - p, 2)));
      if (p < 1) requestAnimationFrame(count);
    };
    requestAnimationFrame(count);
    at(1426, () => pre.classList.add('out'));
    at(1904, () => pre.classList.add('gone'));
    at(2400, () => { html.classList.add('ready'); pre.addEventListener('transitionend', () => pre.remove(), { once: true }); setTimeout(() => pre.remove(), 800); });
  } else {
    html.classList.add('hs');
    if (curtain) requestAnimationFrame(() => { curtain.classList.add('up'); html.classList.remove('enter'); });
    setTimeout(() => html.classList.add('ready'), 250);
  }

  // 내부 링크: 막이 아래에서 올라와 덮은 뒤 이동 (.6s)
  if (curtain && !RM) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || /^(mailto|tel):/.test(href)) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin && location.protocol !== 'file:') return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      curtain.classList.remove('up');
      curtain.classList.add('down');
      void curtain.offsetWidth;
      curtain.classList.remove('down');
      curtain.classList.add('cover');
      setTimeout(() => { location.href = a.href; }, 600);
    });
    addEventListener('pageshow', (e) => { if (e.persisted) { curtain.classList.remove('cover'); curtain.classList.add('up'); } });
  }

  // ── 스케치: 캔버스 2D 문턱값 드러남 (원본은 WebGL 셰이더로 같은 효과) ──
  const sketches = $$('[data-sketch]').map((fig) => {
    const im = $('img', fig), cv = $('canvas', fig);
    const S = { fig, im, cv, ok: false, p: -1 };
    const setup = () => {
      try {
        const W = Math.min(1000, im.naturalWidth), H = Math.round(W * im.naturalHeight / im.naturalWidth);
        cv.width = W; cv.height = H;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(im, 0, 0, W, H);
        const src = ctx.getImageData(0, 0, W, H).data; // file:// 에서는 보안 오류 → 아래 대체
        const auto = fig.dataset.cut === 'auto'; // 흐린 연필선: 종이 밝기(상위 10%)를 기준으로 상대 문턱
        const a = new Float32Array(W * H), th = new Float32Array(W * H);
        const G = 48, gw = Math.ceil(W / G) + 2, gh = Math.ceil(H / G) + 2;
        const grid = Float32Array.from({ length: gw * gh }, () => Math.random());
        const sm = (t) => t * t * (3 - 2 * t);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const i = y * W + x, k = i * 4;
          const lum = (src[k] * .299 + src[k + 1] * .587 + src[k + 2] * .114) / 255;
          a[i] = auto ? lum : clamp((0.56 - lum) * 3.2);
          const gx = x / G, gy = y / G, x0 = gx | 0, y0 = gy | 0, fx = sm(gx - x0), fy = sm(gy - y0);
          const v = (grid[y0 * gw + x0] * (1 - fx) + grid[y0 * gw + x0 + 1] * fx) * (1 - fy) + (grid[(y0 + 1) * gw + x0] * (1 - fx) + grid[(y0 + 1) * gw + x0 + 1] * fx) * fy;
          th[i] = v * 0.8 + Math.random() * 0.2;
        }
        if (auto) {
          const sorted = Float32Array.from(a).sort(); const bg = sorted[Math.floor(sorted.length * 0.9)];
          for (let i = 0; i < a.length; i++) a[i] = clamp((bg - a[i] - 0.06) * 4.5);
        }
        S.ctx = ctx; S.a = a; S.th = th; S.img = ctx.createImageData(W, H); S.ok = true; fig.classList.add('cv');
      } catch (err) { cv.remove(); S.cv = null; }
    };
    if (im.complete && im.naturalWidth) setup(); else im.addEventListener('load', setup, { once: true });
    return S;
  });
  const drawSketch = (S, p) => {
    if (Math.abs(S.p - p) < 0.004) return; S.p = p;
    if (!S.ok) { S.im.style.opacity = p; return; }
    const d = S.img.data, a = S.a, th = S.th, q = p * 1.15;
    for (let i = 0; i < a.length; i++) {
      const v = clamp((q - th[i]) / 0.12) * a[i];
      d[i * 4 + 3] = v * 235;
    }
    S.ctx.putImageData(S.img, 0, 0);
  };

  // ── 방사선 8가닥: 스크롤로 돌고, 스크롤 속도만큼 휜다 ──
  const rad = $('#rad');
  let RAD = null;
  if (rad) {
    const g = $('.rad-g', rad), labels = $$('.rad-l li', rad);
    const paths = labels.map(() => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); g.appendChild(p); return p; });
    RAD = { g, labels, paths, rot: 0, bend: 0 };
  }
  const drawRad = (rot, bend) => {
    const { paths, labels } = RAD;
    const svg = $('.rad-svg', rad); const k = svg.getBoundingClientRect().width / 1000;
    paths.forEach((p, i) => {
      const a0 = rot + i * Math.PI / 4 - Math.PI / 2;
      let d = '';
      for (let j = 0; j <= 16; j++) {
        const s = j / 16, r = 60 + s * 295, a = a0 + bend * Math.sin(s * Math.PI) * (s < .5 ? 1 : 1 - (s - .5) * .6);
        d += (j ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ' ' + (Math.sin(a) * r).toFixed(1);
      }
      p.setAttribute('d', d);
      const la = a0, R = 381.6 * k;
      labels[i].style.setProperty('--x', (Math.cos(la) * R).toFixed(1) + 'px');
      labels[i].style.setProperty('--y', (Math.sin(la) * R).toFixed(1) + 'px');
    });
  };

  // ── 스크롤 루프 ──
  const duo = $('#duo');
  const wheel = $('#wheel'), wheelR = wheel && $('.wheel-r', wheel), stats = $$('.stat');
  const ring = $('.cl-ring'), cl = $('#cl');
  const marks = ring ? $$('.cm-i', ring) : [];
  // 원본 실측(refs/home/09-uod.jpg): 위쪽은 작고 어두운 원, 아래쪽은 크고 밝은 원이 타원으로 둘러싼다
  const placeRing = (rot) => {
    const mob = innerWidth <= 768, Rx = innerWidth * (mob ? .44 : .36), Ry = innerWidth * (mob ? .62 : .29);
    marks.forEach((c, i) => {
      const a = (i * 20 - 90) * Math.PI / 180 + rot, k = (1 + Math.sin(a)) / 2;
      c.style.setProperty('--x', (Math.cos(a) * Rx).toFixed(1) + 'px');
      c.style.setProperty('--y', (Math.sin(a) * Ry).toFixed(1) + 'px');
      c.style.setProperty('--sz', ((mob ? 13 : 6.4) + k * (mob ? 5 : 2.2)).toFixed(2) + 'vw');
      c.style.background = `hsl(0 0% ${(12 + k * 72).toFixed(1)}%)`;
      c.style.color = k > .55 ? '#141414' : '#a3a3a3';
    });
  };
  placeRing(0);
  // 사람 섹션: 원본 실측(motion.json div.mimg.hyy.xuc) — 타원 궤도 x ±506px · y ±391px(1440 기준),
  // 앞(아래)은 1배 · 불투명, 뒤(위)는 0.7배 · 불투명도 0.1. 스크롤로 궤도를 돈다
  const whs = wheelR ? $$('.wh', wheelR) : [];
  const placeWheel = (rot) => {
    const k = innerWidth / 1440, Rx = 506 * k * (innerWidth <= 768 ? 1.25 : 1), Ry = 391 * k;
    whs.forEach((w, i) => {
      const a = rot + i * 2 * Math.PI / whs.length, f = (1 + Math.sin(a)) / 2;
      w.style.setProperty('--x', (Math.cos(a) * Rx).toFixed(1) + 'px');
      w.style.setProperty('--y', (Math.sin(a) * Ry).toFixed(1) + 'px');
      w.style.setProperty('--s', (0.7 + 0.3 * f).toFixed(3));
      w.style.setProperty('--o', (0.1 + 0.9 * f * f).toFixed(3));
      w.style.setProperty('--r', ((a * 180 / Math.PI + 90) * 0.35).toFixed(1) + 'deg');
      w.style.zIndex = Math.round(f * 100);
    });
  };
  placeWheel(0);
  let lastY = scrollY, vel = 0;
  const tick = () => {
    const vh = innerHeight, y = scrollY;
    vel += ((y - lastY) - vel) * 0.2; lastY = y;
    sketches.forEach((S) => {
      const r = S.fig.getBoundingClientRect(); if (r.bottom < -vh || r.top > vh * 1.5) return;
      const p = clamp((vh - r.top) / (vh * 0.85));
      if (!RM) {
        drawSketch(S, p);
        if (S.fig.classList.contains('sk-1')) S.fig.style.transform = `scale(${(0.55 + 0.45 * p).toFixed(4)})`;
      }
    });
    if (duo && rad) {
      const r = rad.getBoundingClientRect();
      duo.classList.toggle('dark', r.top < -0.44 * vh && r.bottom > 0);
    }
    if (RAD) {
      const r = rad.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        const p = clamp(-r.top / Math.max(1, r.height - vh));
        const target = RM ? 0 : clamp(vel * 0.012, -1.1, 1.1);
        RAD.bend += (target - RAD.bend) * 0.08;
        drawRad(RM ? 0 : p * Math.PI / 2, RAD.bend);
      }
    }
    if (wheel) {
      const r = wheel.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        const p = clamp((vh - r.top) / (r.height + vh));
        placeWheel(RM ? 0 : p * Math.PI * 1.6);
        let best = null, bd = 1e9;
        stats.forEach((s) => { const b = s.getBoundingClientRect(); const d = Math.abs(b.top + b.height / 2 - vh / 2); if (d < bd) { bd = d; best = s; } });
        stats.forEach((s) => s.classList.toggle('on', s === best));
      }
    }
    if (ring && cl) {
      const r = cl.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh && !RM) placeRing(((vh - r.top) / (vh + r.height) - .5) * 0.6);
    }
    requestAnimationFrame(tick);
  };
  if (RAD) drawRad(0, 0);
  requestAnimationFrame(tick);

  // ── Work: Grid / List / Gallery ──
  const work = $('#work');
  if (work) {
    const btns = $$('.pill [data-v]');
    btns.forEach((b) => b.addEventListener('click', () => {
      work.dataset.view = b.dataset.v;
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      scrollTo({ top: 0 });
    }));
  }

  // ── 상세: 평면도 슬라이더 ──
  $$('[data-slider]').forEach((sl) => {
    const items = $$('.plan', sl), cnt = $('[data-count]', sl);
    let i = 0;
    const go = (n) => {
      i = (n + items.length) % items.length;
      items.forEach((it, k) => { it.classList.toggle('on', k === i); it.setAttribute('aria-hidden', String(k !== i)); });
      cnt.textContent = `${i + 1} / ${items.length}`;
    };
    $('[data-prev]', sl).addEventListener('click', () => go(i - 1));
    $('[data-next]', sl).addEventListener('click', () => go(i + 1));
    sl.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') go(i - 1); if (e.key === 'ArrowRight') go(i + 1); });
  });

  // ── 상세: Detail / Masonry / Slider ──
  const gal = $('#gal');
  if (gal) {
    const items = $$('.gi', gal), cnt = $('[data-gcount]', gal);
    let i = 0;
    const show = (n) => { i = (n + items.length) % items.length; items.forEach((it, k) => it.classList.toggle('on', k === i)); cnt.textContent = `${i + 1} / ${items.length}`; };
    show(0);
    const btns = $$('.pill [data-g]');
    btns.forEach((b) => b.addEventListener('click', () => {
      gal.dataset.mode = b.dataset.g;
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const top = gal.getBoundingClientRect().top + scrollY - 80;
      if (lenis) lenis.scrollTo(top, { immediate: true }); else scrollTo({ top });
    }));
    $('[data-gprev]', gal).addEventListener('click', () => show(i - 1));
    $('[data-gnext]', gal).addEventListener('click', () => show(i + 1));
    gal.addEventListener('keydown', (e) => { if (gal.dataset.mode !== 'slider') return; if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
  }

  // ── Legal: 목차 현재 위치 ──
  const toc = $$('.toc a');
  if (toc.length) {
    const secs = toc.map((a) => document.getElementById(a.hash.slice(1)));
    const mark = () => {
      let k = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.35) k = i; });
      toc.forEach((a, i) => (i === k ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    };
    addEventListener('scroll', mark, { passive: true }); mark();
    toc.forEach((a) => a.addEventListener('click', (e) => {
      const t = document.getElementById(a.hash.slice(1)); if (!t) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(t, { offset: -90 }); else t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
      history.replaceState(null, '', a.hash);
      t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
    }));
  }
})();
