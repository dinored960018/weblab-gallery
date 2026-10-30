(() => {
  const doc = document.documentElement, body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* 사파리 사생활 모드 */ } } };

  /* 헤더 글자색: 원본은 로드 직후 페이지 기본색 → 히어로 위 흰색으로 300ms 전환 */
  if (body.dataset.hfg) requestAnimationFrame(() => requestAnimationFrame(() => body.style.setProperty('--hfg', body.dataset.hfg)));

  /* 사진: 로드되면 opacity 0→1 */
  $$('.ph img').forEach(i => { if (i.complete && i.naturalWidth) return; i.classList.add('wait'); i.addEventListener('load', () => i.classList.remove('wait'), { once: true }); });

  /* ── 글자 타자 등장: 원본은 글자 하나마다 opacity 0→1, 약 28ms 간격 ── */
  function split(el) {
    if (el.dataset.split) return;
    el.dataset.split = 1;
    const label = el.textContent.replace(/\s+/g, ' ').trim();
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'tw'; w.setAttribute('aria-hidden', 'true');
            for (const c of part) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; w.append(s); }
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.matches('svg,img,input,button.keep')) walk(n);
      });
    };
    walk(el);
    if (!el.querySelector('.sr-copy')) { const s = document.createElement('span'); s.className = 'sr sr-copy'; s.textContent = label; el.append(s); }
  }
  function typeIn(el, delay = 0, step = 28) {
    split(el);
    const chars = $$('.ch', el);
    const per = Math.min(step, 1400 / Math.max(chars.length, 1));
    chars.forEach((c, i) => { c.style.transition = 'none'; setTimeout(() => { c.style.opacity = 1; }, delay + i * per); });
    return delay + chars.length * per;
  }
  function resetType(el) { $$('.ch', el).forEach(c => { c.style.opacity = ''; }); }
  const typers = $$('.tp');
  if (reduce) typers.forEach(el => el.classList.add('typed'));
  else typers.forEach(split);

  const io = !reduce && 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); typeIn(e.target, +(e.target.dataset.d || 0)); });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  const watch = list => list.forEach(el => io ? io.observe(el) : el.classList.add('typed'));

  /* ── 인트로 ── */
  const headTypers = $$('.hd .tp');
  const rest = typers.filter(t => !t.closest('.hd') && !t.closest('.menu') && !t.closest('.ft'));
  const footTypers = typers.filter(t => t.closest('.ft'));
  const pre = $('.pre');
  if (reduce) { pre && pre.remove(); }
  else if (!store.get('kvr-intro') && pre) {
    store.set('kvr-intro', 1);
    body.classList.add('intro', 'withpre');
    let t = 300; headTypers.forEach(el => { t = typeIn(el, t) + 60; });
    setTimeout(() => body.classList.add('rise'), 600);
    setTimeout(() => { body.classList.add('go'); body.classList.remove('withpre'); }, 2600);
    setTimeout(() => { body.classList.remove('intro', 'go', 'rise', 'withpre'); pre.remove(); watch(rest); }, 3700);
  } else {
    pre && pre.remove();
    body.classList.add('intro');
    let t = 0; headTypers.forEach(el => { t = typeIn(el, t, 14) + 20; });
    requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('go')));
    setTimeout(() => body.classList.remove('intro', 'go'), 1100);
    setTimeout(() => watch(rest), 250);
  }

  /* ── 상단 메뉴: 현재 페이지 점 + hover 시 나머지 .5 ── */
  $$('.nav').forEach(nav => {
    const links = $$('a', nav), dot = $('.dot', nav);
    const cur = links.findIndex(a => a.getAttribute('aria-current') === 'page');
    const place = i => { if (i < 0) { nav.classList.remove('has-dot'); return; } nav.classList.add('has-dot'); dot.style.top = (links[i].offsetTop) + 'px'; };
    place(cur);
    links.forEach((a, i) => {
      const on = () => { nav.classList.add('hovering'); links.forEach(l => l.classList.toggle('on-hover', l === a)); place(i); };
      a.addEventListener('mouseenter', on); a.addEventListener('focus', on);
    });
    const off = () => { nav.classList.remove('hovering'); links.forEach(l => l.classList.remove('on-hover')); place(cur); };
    nav.addEventListener('mouseleave', off); nav.addEventListener('focusout', e => { if (!nav.contains(e.relatedTarget)) off(); });
  });

  /* 묶음 hover: 하나만 1, 나머지는 흐리게 (아코디언 .5 · 채용 .25 · 팀 .25 · 메뉴 .1) */
  $$('[data-dim]').forEach(box => {
    const items = $$('[data-item]', box);
    const on = it => { box.classList.add('hovering'); items.forEach(x => x.classList.toggle('on-hover', x === it)); box.dispatchEvent(new CustomEvent('pick', { detail: items.indexOf(it) })); };
    items.forEach(it => { it.addEventListener('mouseenter', () => on(it)); it.addEventListener('focusin', () => on(it)); });
    const off = () => { box.classList.remove('hovering'); items.forEach(x => x.classList.remove('on-hover')); box.dispatchEvent(new CustomEvent('pick', { detail: -1 })); };
    box.addEventListener('mouseleave', off);
    box.addEventListener('focusout', e => { if (!box.contains(e.relatedTarget)) off(); });
  });

  /* ── 스크롤 상태 · 패럴랙스 ── */
  const heroBg = $('.hero .bg');
  const pars = $$('.par');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    body.classList.toggle('scrolled', y > 40);
    if (reduce) return;
    if (heroBg && y < vh * 1.2) heroBg.style.transform = `translate3d(0,${(y * .3).toFixed(1)}px,0)`;
    pars.forEach(p => {
      const r = p.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const k = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
      p.querySelector('img').style.transform = `translate3d(0,${(-k * 120).toFixed(1)}px,0)`;
    });
    marques();
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);

  /* ── 메뉴 덮개 ── */
  const burger = $('.burger'), menu = $('#menu');
  let lastFocus = null;
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    body.classList.toggle('lock', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.toggleAttribute('inert', !open);
    menu.setAttribute('aria-hidden', !open);
    if (open) {
      lastFocus = document.activeElement;
      const tp = $$('.tp', menu);
      if (reduce) tp.forEach(el => el.classList.add('typed'));
      else { tp.forEach(resetType); let t = 120; tp.forEach(el => { t = typeIn(el, t, 22) - (el.closest('.links') ? 60 : 0); }); }
      burger.focus({ preventScroll: true });
    } else if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  if (burger && menu) {
    menu.setAttribute('inert', ''); menu.setAttribute('aria-hidden', 'true');
    burger.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
    addEventListener('keydown', e => {
      if (!body.classList.contains('menu-open')) return;
      if (e.key === 'Escape') { setMenu(false); return; }
      if (e.key === 'Tab') {
        const f = [...$$('a,button', menu), burger].filter(x => x.offsetParent !== null);
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    const pics = $$('.pics .ph', menu);
    const links = $('.links', menu);
    links.addEventListener('pick', e => { const i = e.detail < 0 ? 0 : e.detail; if (pics[i].classList.contains('on')) return; pics.forEach((p, k) => { p.classList.toggle('was', p.classList.contains('on')); p.classList.toggle('on', k === i); }); });
  }

  /* ── 홈 히어로: 사진 3장 교차(원본 영상 대역) + 멈춤 ── */
  const slides = $$('.hero .bg .ph');
  const pauseBtn = $('.hero .pause');
  if (slides.length) {
    let i = 0, timer = null;
    const show = k => slides.forEach((s, n) => { s.classList.toggle('was', s.classList.contains('on') && n !== k); s.classList.toggle('on', n === k); });
    show(0);
    const play = () => { timer = setInterval(() => { i = (i + 1) % slides.length; show(i); }, 5500); };
    if (!reduce) play();
    pauseBtn && pauseBtn.addEventListener('click', () => {
      const playing = !!timer;
      if (playing) { clearInterval(timer); timer = null; } else play();
      pauseBtn.setAttribute('aria-pressed', playing);
      pauseBtn.textContent = playing ? 'Play' : 'Pause';
    });
    if (reduce && pauseBtn) { pauseBtn.textContent = 'Play'; pauseBtn.setAttribute('aria-pressed', 'true'); }
  }

  /* ── 풀블리드 슬라이더 + 커서 미리보기 (원본: 2D 캔버스, 커서에 다음 사진 216px, 클릭하면 그 자리에서 화면 가득) ── */
  const slider = $('.slider'), cursor = $('.cursor');
  if (slider && cursor) {
    const srcs = JSON.parse(slider.dataset.pics);
    let cur = 0, mx = 0, my = 0, cx = 0, cy = 0, inside = false, raf = 0;
    const thumbImg = $('.thumb img', cursor), thumbPh = $('.thumb .ph', cursor);
    const setThumb = () => { const n = srcs[(cur + 1) % srcs.length]; thumbImg.src = n.src; thumbPh.style.setProperty('--c', n.c); };
    setThumb();
    const loop = () => { cx += (mx - cx) * (reduce ? 1 : .2); cy += (my - cy) * (reduce ? 1 : .2); cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`; if (inside || Math.abs(mx - cx) > .5) raf = requestAnimationFrame(loop); else raf = 0; };
    slider.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; if (!inside) { inside = true; cx = mx; cy = my; cursor.classList.add('on'); } if (!raf) raf = requestAnimationFrame(loop); });
    slider.addEventListener('pointerleave', () => { inside = false; cursor.classList.remove('on'); });
    const advance = (fromX, fromY) => {
      const r = slider.getBoundingClientRect();
      cur = (cur + 1) % srcs.length;
      const n = srcs[cur];
      const ph = document.createElement('div');
      ph.className = 'ph grow'; ph.style.setProperty('--c', n.c);
      const x = (fromX ?? r.left + r.width / 2 - 108) - r.left, y = (fromY ?? r.top + r.height / 2 - 108) - r.top;
      ph.style.setProperty('--t', Math.max(0, y) + 'px'); ph.style.setProperty('--l', Math.max(0, x) + 'px');
      ph.style.setProperty('--r', Math.max(0, r.width - x - 216) + 'px'); ph.style.setProperty('--b', Math.max(0, r.height - y - 216) + 'px');
      const im = new Image(); im.alt = ''; im.src = n.src; ph.append(im);
      slider.append(ph);
      requestAnimationFrame(() => requestAnimationFrame(() => ph.classList.add('full')));
      setTimeout(() => { $$('.ph', slider).forEach(p => { if (p !== ph) p.remove(); }); ph.classList.remove('grow', 'full'); }, reduce ? 0 : 950);
      slider.setAttribute('aria-label', `Next photo (${cur + 1} of ${srcs.length})`);
      cursor.classList.remove('on');
      setTimeout(() => { setThumb(); if (inside) cursor.classList.add('on'); }, 450);
    };
    slider.addEventListener('click', e => advance(cx || undefined, cy || undefined));
    slider.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); } });
  }

  /* ── 마크 목록: 화면 가운데를 지난 마지막 이름이 켜진다. hover 하면 그 이름 ── */
  const names = $$('.marq .names>*'), squares = $$('.marq .sq .ph');
  let marqHover = -1;
  function setMarq(i) { if (names[i] && names[i].classList.contains('on')) return; names.forEach((n, k) => n.classList.toggle('on', k === i)); squares.forEach((s, k) => { s.classList.toggle('was', s.classList.contains('on')); s.classList.toggle('on', k === i); }); }
  function marques() {
    if (!names.length || marqHover >= 0) return;
    const mid = innerHeight / 2;
    let a = 0; names.forEach((n, k) => { if (n.getBoundingClientRect().top <= mid) a = k; });
    setMarq(a);
  }
  names.forEach((n, k) => { n.addEventListener('mouseenter', () => { marqHover = k; setMarq(k); }); n.addEventListener('focus', () => { marqHover = k; setMarq(k); }); n.addEventListener('mouseleave', () => { marqHover = -1; }); n.addEventListener('blur', () => { marqHover = -1; }); });
  addEventListener('wheel', () => { marqHover = -1; }, { passive: true });

  /* ── 아코디언: 여러 개를 같이 열 수 있다(원본 실측) ── */
  $$('.acc button').forEach(b => {
    const p = document.getElementById(b.getAttribute('aria-controls'));
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', open);
      if (open) { p.hidden = false; p.style.height = '0px'; requestAnimationFrame(() => { p.style.height = p.scrollHeight + 'px'; }); }
      else { p.style.height = p.scrollHeight + 'px'; requestAnimationFrame(() => { p.style.height = '0px'; }); }
      clearTimeout(p._t);
      p._t = setTimeout(() => { if (open) p.style.height = 'auto'; else p.hidden = true; }, reduce ? 0 : 620);
    });
  });

  /* ── 연락처 사진 넘김: 끌기 · 클릭 · ←/→ ── */
  $$('.cslide').forEach(s => {
    const track = $('.track', s), n = $$('.ph', track).length, count = $('.count', s);
    let i = 0, sx = 0, dx = 0, down = false, moved = false;
    const go = k => { i = (k + n) % n; track.style.transform = `translateX(${-i * 100}%)`; count.textContent = `${i + 1}/${n}`; s.setAttribute('aria-label', `${s.dataset.name} photos, ${i + 1} of ${n}`); };
    s.addEventListener('pointerdown', e => { down = true; moved = false; sx = e.clientX; dx = 0; s.setPointerCapture(e.pointerId); track.style.transition = 'none'; });
    s.addEventListener('pointermove', e => { if (!down) return; dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; track.style.transform = `translateX(calc(${-i * 100}% + ${dx}px))`; });
    const up = () => { if (!down) return; down = false; track.style.transition = ''; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); else if (!moved) go(i + 1); else go(i); };
    s.addEventListener('pointerup', up); s.addEventListener('pointercancel', up);
    s.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); } });
    s.addEventListener('dragstart', e => e.preventDefault());
    go(0);
  });

  /* ── 팀: 이름 hover → 사진 ── */
  const people = $('.team .people');
  if (people) {
    const ps = $$('.team .pic .ph');
    people.addEventListener('pick', e => ps.forEach((p, k) => p.classList.toggle('on', k === e.detail)));
  }

  /* ── 꼬리말: 보이면 글자 타자 + 밑줄 ── */
  const ft = $('.ft');
  if (ft && 'IntersectionObserver' in window) {
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { ft.classList.add('seen'); o.disconnect(); if (!reduce) { let t = 0; footTypers.forEach(el => { t = typeIn(el, t, 18) - 200; }); } } }), { threshold: .05 }).observe(ft);
  } else if (ft) { ft.classList.add('seen'); footTypers.forEach(el => el.classList.add('typed')); }

  /* 소식 받기: 보내지 않는다. 검증 메시지만 */
  $$('.ft form').forEach(f => {
    const inp = $('input', f), msg = $('.msg', f);
    f.addEventListener('submit', e => {
      e.preventDefault();
      const v = inp.value.trim();
      let m = '';
      if (!v) m = 'Enter your email address.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = 'Check the email format: name@domain.com';
      inp.setAttribute('aria-invalid', !!m);
      msg.textContent = m || 'Demo form — nothing was sent.';
      if (m) inp.focus();
    });
    inp.addEventListener('input', () => { inp.removeAttribute('aria-invalid'); msg.textContent = ''; });
  });

  onScroll();
})();
