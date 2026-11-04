/* Quench Automotive — 동작. 원본 실측값은 SPEC.md 7·8절 */
(() => {
  const d = document, H = d.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = d) => c.querySelector(s), $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const sm = (t) => t * t * (3 - 2 * t);
  const store = (o) => ({ get: (k) => { try { return o().getItem(k); } catch { return null; } }, set: (k, v) => { try { o().setItem(k, v); } catch { /* 저장 불가 */ } } });
  const ss = store(() => sessionStorage), ls = store(() => localStorage);
  let vh = innerHeight, vw = innerWidth, sy = scrollY;

  /* ── 부드러운 스크롤 (원본 Lenis 1.3.26) ── */
  let lenis = null;
  if (window.Lenis && !RM) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const lockers = new Set();
  const lock = (k, on) => {
    on ? lockers.add(k) : lockers.delete(k);
    const l = lockers.size > 0;
    H.style.overflow = l ? 'hidden' : '';
    if (lenis) l ? lenis.stop() : lenis.start();
  };
  const scrollToY = (y, immediate) => { if (lenis) lenis.scrollTo(y, { immediate: !!immediate, force: true }); else scrollTo({ top: y, behavior: immediate || RM ? 'auto' : 'smooth' }); };

  /* ── 입장 화면: 세션 첫 방문만. 원본은 쿠키 선택을 겸한다 ── */
  const gate = $('#gate');
  const enter = (choice) => {
    if (choice) ls.set('q-consent', choice);
    ss.set('q-entered', '1');
    gate.classList.add('out');
    H.classList.add('entered');
    lock('gate', false);
    setTimeout(() => { gate.hidden = true; gate.classList.remove('out', 'go'); }, 1000);
    const main = $('#main'); if (main) main.focus({ preventScroll: true });
  };
  const openGate = (ask) => {
    const hasChoice = !!ls.get('q-consent');
    $('.gate .one', gate).hidden = !!ask || !hasChoice;
    $('.gate .two', gate).hidden = !ask && hasChoice;
    gate.hidden = false; lock('gate', true);
    requestAnimationFrame(() => requestAnimationFrame(() => gate.classList.add('go')));
    setTimeout(() => { const b = $$('.gb', gate).find((x) => x.offsetParent); if (b) b.focus({ preventScroll: true }); }, 50);
  };
  if (gate) {
    $$('[data-enter]', gate).forEach((b) => b.addEventListener('click', () => enter(b.dataset.enter)));
    gate.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('.gb', gate).filter((x) => x.offsetParent);
      if (!f.length) return;
      const i = f.indexOf(d.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    if (ss.get('q-entered')) { gate.hidden = true; H.classList.add('entered'); } else openGate(false);
  }

  /* ── 메뉴: 페이지 판이 화면 가운데로 접힌다 (clip-path inset 0 → 50%) ── */
  const navb = $('.navb'), menu = $('#menu'), page = $('#page');
  const setMenu = (open) => {
    if (!menu) return;
    const isOpen = H.dataset.menu === 'open';
    if (open === isOpen) return;
    const top = scrollY, total = page.offsetHeight;
    const vis = `inset(${top}px 0px ${Math.max(0, total - top - vh)}px 0px)`;
    const shut = `inset(${top + vh / 2}px 50% ${Math.max(0, total - top - vh / 2)}px 50%)`;
    page.style.transformOrigin = `50% ${top + vh / 2}px`;
    if (open) {
      page.style.transition = 'none'; page.style.clipPath = vis; page.offsetWidth; page.style.transition = '';
      H.dataset.menu = 'open';
      requestAnimationFrame(() => { page.style.clipPath = shut; page.style.transform = RM ? '' : 'scale(.86)'; });
      menu.inert = false; page.inert = true;
      navb.setAttribute('aria-expanded', 'true'); navb.setAttribute('aria-label', 'Close menu');
      lock('menu', true);
      setTimeout(() => { const a = $('.pages a', menu); if (a) a.focus({ preventScroll: true }); }, RM ? 0 : 450);
    } else {
      page.style.clipPath = vis; page.style.transform = '';
      delete H.dataset.menu;
      menu.inert = true; page.inert = false;
      navb.setAttribute('aria-expanded', 'false'); navb.setAttribute('aria-label', 'Navigate');
      lock('menu', false);
      const done = () => { if (H.dataset.menu !== 'open') { page.style.transition = 'none'; page.style.clipPath = ''; page.offsetWidth; page.style.transition = ''; } };
      setTimeout(done, RM ? 0 : 1000);
      navb.focus({ preventScroll: true });
    }
  };
  if (navb) navb.addEventListener('click', () => setMenu(H.dataset.menu !== 'open'));
  if (menu) {
    menu.inert = true;
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = [...$$('a, button', menu), navb];
      const i = f.indexOf(d.activeElement);
      if (e.shiftKey && i === 0) { e.preventDefault(); navb.focus(); }
      else if (!e.shiftKey && i === f.length - 2) { e.preventDefault(); navb.focus(); }
    });
    navb.addEventListener('keydown', (e) => {
      if (H.dataset.menu !== 'open' || e.key !== 'Tab') return;
      e.preventDefault(); const f = $$('a, button', menu); (e.shiftKey ? f[f.length - 1] : f[0]).focus();
    });
    const cs = $('[data-cookies]', menu);
    if (cs) cs.addEventListener('click', () => { setMenu(false); setTimeout(() => openGate(true), RM ? 0 : 500); });
  }

  /* ── 대화상자 공통: 영상 · 사양 서랍 ── */
  let openDlg = null, lastFocus = null;
  const dlgOpen = (el) => {
    if (!el) return;
    lastFocus = d.activeElement; openDlg = el;
    el.hidden = false; el.offsetWidth; el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    $$('[data-dlg="' + el.id + '"]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    lock('dlg', true);
    setTimeout(() => { const x = $('.x', el); if (x) x.focus({ preventScroll: true }); }, 30);
    if (el.classList.contains('vmod')) vplay(true);
  };
  const dlgClose = () => {
    const el = openDlg; if (!el) return; openDlg = null;
    el.classList.remove('open'); el.setAttribute('aria-hidden', 'true');
    $$('[data-dlg="' + el.id + '"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    lock('dlg', false);
    if (el.classList.contains('vmod')) vplay(false);
    setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, RM ? 0 : 800);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  $$('[data-dlg]').forEach((b) => b.addEventListener('click', () => dlgOpen(d.getElementById(b.dataset.dlg))));
  $$('.vmod, .spec').forEach((el) => {
    el.hidden = true;
    $$('.x, .scrim', el).forEach((x) => x.addEventListener('click', dlgClose));
    el.addEventListener('click', (e) => { if (el.classList.contains('vmod') && !e.target.closest('.scr, .x, .vt')) dlgClose(); });
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('button, a, [tabindex="0"]', el).filter((x) => x.offsetParent || x === d.activeElement);
      const i = f.indexOf(d.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
  });
  /* 영상 대역: 정지 사진 3장 교차 + 진행 막대 (원본 영상은 쓰지 않는다) */
  let vT = null, vI = 0, vRun = false, vStart = 0, vEl = $('.vmod');
  const vtick = () => {
    if (!vEl || !vRun) return;
    const t = (performance.now() - vStart) / 6000;
    const shots = $$('.scr .ph', vEl);
    if (t >= 1) { vI = (vI + 1) % shots.length; vStart = performance.now(); shots.forEach((p, i) => p.classList.toggle('on', i === vI)); }
    const bar = $('.bar i', vEl); if (bar) bar.style.transform = `scaleX(${((vI + clamp(t)) / shots.length).toFixed(4)})`;
    vT = requestAnimationFrame(vtick);
  };
  const vplay = (on) => {
    if (!vEl) return;
    vRun = on; cancelAnimationFrame(vT);
    vEl.style.setProperty('--vps', on ? 'running' : 'paused');
    const pb = $('.pp', vEl);
    if (pb) { pb.setAttribute('aria-label', on ? 'Pause film' : 'Play film'); pb.setAttribute('aria-pressed', on ? 'false' : 'true'); $('.i-pause', pb).style.display = on ? '' : 'none'; $('.i-play', pb).style.display = on ? 'none' : ''; }
    if (on) { vStart = performance.now(); vtick(); }
  };
  if (vEl) { const pb = $('.pp', vEl); if (pb) pb.addEventListener('click', () => vplay(!vRun)); }
  /* 사양 아코디언 */
  $$('.acc h3 button').forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    d.getElementById(b.getAttribute('aria-controls')).classList.toggle('open', open);
  }));

  d.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (openDlg) { dlgClose(); return; }
    if (H.dataset.menu === 'open') setMenu(false);
  });

  /* ── 화면에 들어오면 한 번: 단어 등장 · 줄 등장 · 글자 채움 · 버튼 광택 ── */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.target.classList.contains('btn')) { e.target.classList.toggle('on', e.isIntersecting); return; }
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.25 });
  $$('.rv, .lines, .fill, .gal .ph, .ft, .btn').forEach((el) => io.observe(el));

  /* ── 스크롤 연동 (원본 GSAP scrub 값을 옮김) ── */
  const scrubs = [];
  const box = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return { top: y, h: el.offsetHeight }; };
  const add = (el, fn) => { if (el) scrubs.push({ el, fn, b: box(el) }); };
  const st = (el, s) => { for (const k in s) el.style[k] = s[k]; };

  // 홈 1: 머리 문장 흐려짐 → 소개 단어 등장 → 카드 확장
  add($('.intro'), (b) => {
    const s = clamp(sy - b.top, 0, b.h - vh);
    $$('.hero-h .wd').forEach((w, i) => { const t = clamp((s - i * 30) / 320); st(w, { opacity: 1 - t, filter: `blur(${(8 * t).toFixed(2)}px)`, transform: `scale(${1 - 0.1 * t})` }); });
    const hp = $('.hero-p'); if (hp) hp.style.opacity = 1 - clamp(s / 260);
    const out = clamp((s - 1150) / 420);
    $$('.intro-h .wd').forEach((w, i) => { const q = sm(clamp((s - 150 - i * 70) / 260)); st(w, { opacity: q * (1 - out), filter: `blur(${(8 * (1 - q) + 8 * out).toFixed(2)}px)`, transform: `scale(${q})` }); });
    const c = sm(clamp((s - 1250) / 1150));
    const card = $('.intro .card');
    if (card) { card.style.clipPath = `inset(${(50 * (1 - c)).toFixed(3)}%)`; $('.ph', card).style.transform = `scale(${(1.2 - 0.2 * c).toFixed(4)})`; }
    const ap = clamp((s - 1450) / 450);
    $$('.ap-h, .ap-b').forEach((el) => st(el, { opacity: ap, transform: `translateY(${(1 - ap) * 24}px)` }));
  });
  // 홈 2: 단계 — 사각 사진 안쪽이 가운데서 커지고(inset 50%→0) 흐린 배경이 바뀐다
  add($('.steps'), (b) => {
    const p = (sy - b.top) / 900;
    const sq = $$('.steps .sq .ph'), bg = $$('.steps .bgs > .ph');
    for (let k = 1; k < sq.length; k++) {
      const r = sm(clamp((p - (k - 1) - 0.25) / 0.7));
      sq[k].style.clipPath = `inset(${(50 * (1 - r)).toFixed(3)}%)`;
      if (bg[k]) bg[k].style.opacity = r;
    }
  });
  // 홈 3: 문장 — 글은 올라가고 사진은 내려간다(원본 translate 50%→-50% / -50%→50%), 글자 채움은 스크롤에 묶임
  add($('.state'), (b) => {
    const t = clamp((sy + vh - b.top) / (vh + b.h));
    const tx = $('.state .txt'), pic = $('.state .pic'), fv = $('.state .fillv');
    if (tx) tx.style.transform = `translateY(${(-50 + (0.5 - t) * 40).toFixed(2)}%)`;
    if (pic) pic.style.transform = `translateY(${(-50 + (t - 0.5) * 60).toFixed(2)}%)`;
    if (fv) { const F = clamp((t - 0.22) / 0.42) * 4; $$('.ln', fv).forEach((ln, i) => ln.style.setProperty('--fp', (clamp(F - i) * 106).toFixed(2) + '%')); }
  });
  // 홈 4: 서비스 — 오른쪽 사진이 아래에서 위로 닦이며(inset 100% 0 0 → 0) 확대 1.2→1
  $$('.svc .svi').forEach((it, k) => add(it, (b) => {
    const r = clamp((sy + vh - b.top) / vh);
    const ph = $$('.svc .stk .ph')[k];
    if (ph && k > 0) { ph.style.clipPath = `inset(${(100 * (1 - r)).toFixed(3)}% 0 0)`; }
    if (ph) $('img', ph).style.transform = `scale(${(1.2 - 0.2 * r).toFixed(4)})`;
    it.style.opacity = 1 - clamp((sy - b.top - 250) / 500);
  }));
  // 홈 5: 끝 — 'Standard' 가 작아지며 사라지고, 사진 층이 서로 다른 속도로 올라간 뒤 'Stops Here'
  add($('.ends'), (b) => {
    const p = clamp((sy - b.top) / (b.h - vh));
    const o = $('.ends .h-ord'), e = $('.ends .h-end');
    if (o) st(o, { opacity: 1 - clamp((p - 0.08) / 0.3), transform: `scale(${1 - 0.25 * clamp(p / 0.38)})` });
    const bg = $('.ends .bg'); if (bg) bg.style.transform = `scale(${(1.15 - 0.15 * p).toFixed(4)})`;
    const l1 = $('.ends .lay'), l2 = $('.ends .lay2');
    if (l1) l1.style.transform = `translateY(${(-p * (vh + 760) * 1.05).toFixed(1)}px)`;
    if (l2) l2.style.transform = `translateY(${(-p * (vh + 380) * 0.8).toFixed(1)}px)`;
    const q = sm(clamp((p - 0.55) / 0.32));
    if (e) st(e, { opacity: q, transform: `translateY(${(-(1 - q) * vh * 0.3).toFixed(1)}px) scale(${0.75 + 0.25 * q})` });
  });
  // CTA 띠: 배경 -25%→25%, 글 0→-50%
  $$('.cta').forEach((c) => add(c, (b) => {
    const t = clamp((sy + vh - b.top) / (vh + b.h));
    const bg = $('.bg', c), inn = $('.in', c);
    if (bg) bg.style.transform = `translateY(${((t - 0.5) * 50).toFixed(2)}%)`;
    if (inn) inn.style.transform = `translateY(${(-clamp((t - 0.5) * 2) * 50).toFixed(2)}%)`;
  }));
  // 꼬리말: 배경 scale 1.5→1, opacity 0→1
  $$('.ft').forEach((f) => add(f, (b) => {
    const t = clamp((sy + vh - b.top) / vh);
    const bg = $('.bg', f); if (bg) st(bg, { opacity: t, transform: `scale(${(1.5 - 0.5 * t).toFixed(4)})` });
  }));
  // 상세: 큰 사진 시차
  $$('.dt-img').forEach((c) => add(c, (b) => {
    const t = clamp((sy + vh - b.top) / (vh + b.h));
    const ph = $('.ph', c); if (ph) ph.style.transform = `translateY(${((t - 0.5) * 16).toFixed(2)}%)`;
  }));
  // 연락: 카드가 올라오면 머리 사진이 붉게 덮인다
  add($('.ct-hero'), (b) => {
    const t = clamp((sy - b.top) / vh);
    const bg = $('.ct-hero .bg'); if (bg) bg.style.setProperty('--ctr', (0.3 + 0.7 * t).toFixed(3));
    const hh = $('.ct-hero .hh'); if (hh) hh.style.opacity = 1 - 0.5 * t;
  });
  add($('.proc'), (b) => {
    const t = clamp((sy + vh - b.top) / (vh + b.h));
    $$('.proc .cards > div').forEach((c, i) => { c.style.transform = vw > 1023 ? `translateY(${(-(t - 0.3) * i * 160).toFixed(1)}px)` : ''; });
  });

  /* ── 목록: 사진 무대 + 빛줄기 전환 (원본 WebGL 셰이더를 DOM 마스크로) + 무한 반복 ── */
  const stage = $('.lst-stage'), lst = $('.lst');
  let rows = [], loopH = 0, loops = 0, pics = [];
  if (stage && lst) {
    rows = $$('.row', lst); pics = $$('.ph', stage);
    loops = +lst.dataset.loops; loopH = (rows.length - 1) / loops * 900;
  }
  const listTick = () => {
    if (!stage) return;
    const f = sy / 900, r = Math.floor(f), p = f - r;
    const per = rows.length ? (rows.length - 1) / loops : 1;
    const ia = +rows[Math.min(r, rows.length - 1)].dataset.pic, ib = +rows[Math.min(r + 1, rows.length - 1)].dataset.pic;
    const q = RM ? (p > 0.5 ? 1 : 0) : sm(clamp((p - 0.05) / 0.9));
    pics.forEach((ph, i) => {
      const on = i === ia || i === ib;
      ph.style.visibility = on ? 'visible' : 'hidden';
      ph.classList.toggle('inc', i === ib && ib !== ia);
      ph.style.zIndex = i === ib ? 2 : 1;
    });
    const out = pics[ia], inc = pics[ib];
    if (out) $('img', out).style.transform = `scale(${(1 + 0.08 * q).toFixed(4)}) translateY(${(-3 * q).toFixed(2)}%)`;
    if (inc && ib !== ia) { $('img', inc).style.transform = `scale(${(1.08 - 0.08 * q).toFixed(4)}) translateY(${(3 * (1 - q)).toFixed(2)}%)`; inc.style.setProperty('--bp', (-15 + 130 * q).toFixed(2) + '%'); }
    const env = clamp(q / 0.08) * (1 - clamp((q - 0.92) / 0.08));
    stage.style.setProperty('--bp', (-15 + 130 * q).toFixed(2) + '%');
    $('.beam', stage).style.opacity = (env * 0.9).toFixed(3);
    $('.flare', stage).style.opacity = (env * 0.7).toFixed(3);
    rows.forEach((row, i) => row.classList.toggle('cur', Math.abs(i - f) < 0.5 || (i === r && p < 0.5) || (i === r + 1 && p >= 0.5)));
    // 무한: 마지막 고리에 닿으면 한 고리만큼 되돌린다
    if (loopH && sy >= loopH * (loops - 1) + 10) scrollToY(sy - loopH, true);
    void per;
  };

  /* ── 법률: 보이는 정책에 따라 왼쪽 제목·탭이 바뀐다 ── */
  const pols = $$('.doc .pol[id]');
  const docTick = () => {
    if (!pols.length) return;
    let cur = pols[0];
    pols.forEach((p) => { if (box(p).top - vh * 0.5 <= sy) cur = p; });
    $$('.doc .tabs a').forEach((a) => a.setAttribute('aria-current', a.hash === '#' + cur.id ? 'true' : 'false'));
    const ht = $('.doc .ht > span'); const i = pols.indexOf(cur);
    if (ht) ht.style.transform = `translateY(${-i * 154}px)`;
  };
  $$('.doc .tabs a').forEach((a) => a.addEventListener('click', (e) => {
    const t = d.getElementById(a.hash.slice(1)); if (!t) return;
    e.preventDefault(); history.replaceState(null, '', a.hash);
    scrollToY(box(t).top - (vw > 1023 ? vh * 0.4 : 80));
  }));

  /* ── 머리 · 진행 막대 ── */
  const hd = $('.hd'), bar = $('.prog i'), ft = $('.ft, .nxt');
  const dtbar = $('.dt-bar');
  const tick = () => {
    sy = scrollY;
    const max = Math.max(1, H.scrollHeight - vh);
    if (bar) bar.style.transform = `scaleX(${clamp(sy / max).toFixed(4)})`;
    const nearEnd = ft ? box(ft).top - sy < vh * 0.5 : false;
    if (hd) H.classList.toggle('compact', sy > 40 && !nearEnd);
    if (dtbar) dtbar.classList.toggle('on', sy > 500 && !nearEnd);
    for (const s of scrubs) { if (sy + vh > s.b.top - 200 && sy < s.b.top + s.b.h + 200) s.fn(s.b, s.el); }
    listTick(); docTick();
  };
  let ticking = false;
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; tick(); }); } };
  if (lenis) lenis.on('scroll', req);
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', () => { vh = innerHeight; vw = innerWidth; scrubs.forEach((s) => { s.b = box(s.el); }); req(); });
  addEventListener('load', () => { scrubs.forEach((s) => { s.b = box(s.el); }); req(); });
  tick();

  /* 맨 위로 */
  $$('[data-top]').forEach((b) => b.addEventListener('click', () => { scrollToY(0); const l = $('.logo'); if (l) l.focus({ preventScroll: true }); }));

  /* 다음 빌드: 끝에서 더 내리면 넘어간다 + 전환 종류 표시 */
  const nx = $('.nxt a');
  if (nx) {
    let acc = 0;
    nx.addEventListener('click', () => ss.set('q-vt', 'next'));
    addEventListener('wheel', (e) => {
      if (H.style.overflow === 'hidden') return;
      if (scrollY >= H.scrollHeight - vh - 2 && e.deltaY > 0) { acc += e.deltaY; if (acc > 700) { acc = -1e9; ss.set('q-vt', 'next'); location.href = nx.href; } } else acc = 0;
    }, { passive: true });
  }
  addEventListener('pageswap', (e) => { if (e.viewTransition && ss.get('q-vt') === 'next') e.viewTransition.types.add('next'); });
  addEventListener('pagereveal', (e) => { if (e.viewTransition && ss.get('q-vt') === 'next') e.viewTransition.types.add('next'); ss.set('q-vt', ''); });

  /* 꼬리말 빛: 커서를 따라가는 점광원 + 사진 기울기 */
  $$('.ft').forEach((f) => {
    const ph = $('.bg .ph', f), lite = $('.lite', f);
    if (RM || !ph) return;
    f.addEventListener('pointermove', (e) => {
      const r = f.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      lite.style.setProperty('--lx', (x * 100).toFixed(1) + '%'); lite.style.setProperty('--ly', (y * 100).toFixed(1) + '%');
      ph.style.transform = `rotateY(${((x - 0.5) * 4).toFixed(2)}deg) rotateX(${((0.5 - y) * 3).toFixed(2)}deg)`;
    });
    f.addEventListener('pointerleave', () => { ph.style.transform = ''; });
  });

  /* ── 폼: 필수 칸이 차야 보내기가 켜진다(원본). 제출은 막고 문구로 검증 ── */
  $$('form[data-demo]').forEach((form) => {
    const btn = $('button[type="submit"]', form), msg = $('.fmsg', form);
    const fields = $$('[data-req]', form);
    const check = (el) => {
      const v = (el.type === 'radio') ? !!$('input[name="' + el.name + '"]:checked', form) : el.value.trim();
      let err = '';
      if (!v) err = el.dataset.req;
      else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())) err = 'Check the email format, e.g. name@domain.com.';
      return err;
    };
    const show = (el, err) => {
      const out = d.getElementById(el.getAttribute('aria-describedby'));
      el.setAttribute('aria-invalid', err ? 'true' : 'false');
      if (out) out.textContent = err;
    };
    const sync = () => { const ok = fields.every((f) => !check(f)); btn.setAttribute('aria-disabled', ok ? 'false' : 'true'); return ok; };
    fields.forEach((f) => {
      f.addEventListener('blur', () => { if (f.value) show(f, check(f)); });
      f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true') show(f, check(f)); sync(); });
      f.addEventListener('change', sync);
    });
    $$('input[type="file"]', form).forEach((fi) => fi.addEventListener('change', () => {
      const em = $('em', fi.closest('.up')); const n = [...fi.files].map((x) => x.name);
      em.textContent = n.length ? n.join(', ') : 'Click to upload or drag and drop';
    }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let first = null;
      fields.forEach((f) => { const err = check(f); show(f, err); if (err && !first) first = f; });
      if (first) { msg.textContent = ''; first.focus(); return; }
      msg.textContent = 'Demo form — nothing was sent.';
    });
    sync();
  });
})();
