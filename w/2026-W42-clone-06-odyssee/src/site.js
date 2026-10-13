(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  document.documentElement.style.setProperty('--sbw', (innerWidth - document.documentElement.clientWidth) + 'px');

  // 사진 나타남 — 불러온 뒤 500ms
  $$('img.fi').forEach((im) => {
    const done = () => im.classList.add('ld');
    if (im.complete && im.naturalWidth) done(); else { im.addEventListener('load', done, { once: true }); im.addEventListener('error', done, { once: true }); }
  });

  // 프리로더 — 홈 첫 방문만. 약 1.4s 머문 뒤 1s 동안 사라진다
  const pre = $('#pre');
  let seen = false;
  try { seen = sessionStorage.getItem('sv-pre') === '1'; sessionStorage.setItem('sv-pre', '1'); } catch (e) { /* 저장소 막힘 */ }
  if (pre && !seen && !RM) {
    setTimeout(() => pre.classList.add('out'), 1400);
    setTimeout(() => body.classList.add('ready'), 2200);
    setTimeout(() => pre.remove(), 2500);
  } else {
    if (pre) pre.remove();
    body.classList.add('ready');
  }

  // 블록 등장 — 화면 진입 시 600ms
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('[data-rv]').forEach((el) => (RM ? el.classList.add('in') : io.observe(el)));

  // 스크롤 연동: 단어 스크럽 · 글자 노출 · 패럴랙스 · 히어로 흐림 · 머리막대 색
  const scrubs = $$('[data-scrub]').map((el) => ({ el, w: $$('.w', el) }));
  const lets = $$('[data-letters]').map((el) => ({ el, l: $$('.l', el) }));
  const pxs = $$('[data-px]');
  const blurs = $$('[data-blur]');
  const hd = $('#hd');
  const sx = $('#sx');
  const darks = $$('[data-hd="dark"]');
  const isDarkAt = (y) => darks.some((s) => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom > y; });

  function frame() {
    const vh = innerHeight;
    if (!RM) {
      for (const s of scrubs) {
        const r = s.el.getBoundingClientRect();
        const p = clamp((vh * 0.85 - r.top) / (vh * 0.65 + r.height));
        const n = s.w.length, span = 5;
        s.w.forEach((w, i) => w.style.setProperty('--o', clamp((p * (n + span) - i) / span).toFixed(3)));
      }
      for (const s of lets) {
        const r = s.el.closest('section').getBoundingClientRect();
        const p = clamp((vh - r.top) / (r.height + vh * 0.2));
        const n = s.l.length;
        s.l.forEach((l, i) => l.style.setProperty('--o', p * (n + 2) - i > 1 ? 1 : 0));
      }
      for (const el of pxs) {
        const box = el.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) continue;
        const p = clamp((vh - box.top) / (vh + box.height));
        el.style.transform = `translate3d(0, ${(-8 + p * 8).toFixed(2)}%, 0)`;
      }
      for (const el of blurs) {
        const r = el.closest('section').getBoundingClientRect();
        const p = clamp(-r.top / Math.max(1, r.height - vh));
        el.style.filter = p > 0.01 ? `blur(${(p * 20).toFixed(1)}px)` : '';
      }
    }
    if (hd) hd.classList.toggle('is-dark', isDarkAt(21));
    if (sx) sx.classList.toggle('is-dark', isDarkAt(vh - 50));
  }
  let tick = false;
  const req = () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; frame(); }); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();

  // 메뉴 패널 — 클릭으로 열고 CLOSE · ESC · 바깥 클릭으로 닫는다
  const mn = $('#menu');
  const mbtn = $('#menu-btn');
  let lastFocus = null;
  function openMenu() {
    lastFocus = document.activeElement;
    mn.hidden = false;
    body.classList.add('lock');
    mbtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => requestAnimationFrame(() => mn.classList.add('open')));
    setTimeout(() => $('.mn-close', mn).focus(), 30);
  }
  function closeMenu() {
    if (mn.hidden) return;
    mn.classList.remove('open');
    mbtn.setAttribute('aria-expanded', 'false');
    body.classList.remove('lock');
    setTimeout(() => { mn.hidden = true; }, RM ? 0 : 450);
    (lastFocus || mbtn).focus();
  }
  if (mn && mbtn) {
    mbtn.addEventListener('click', openMenu);
    $$('[data-close]', mn).forEach((b) => b.addEventListener('click', closeMenu));
    mn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); }
      if (e.key === 'Tab') {
        const f = $$('a[href], button', $('.mn-panel', mn));
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    const prevImg = $('.mn-img', mn), prevTxt = $('.mn-txt', mn);
    $$('.mn-a', mn).forEach((a) => {
      const show = () => { prevImg.src = a.dataset.photo; prevTxt.textContent = a.dataset.text; };
      a.addEventListener('mouseenter', show);
      a.addEventListener('focus', show);
    });
  }

  // WHY — 4항목 자동 넘김(6s), 호버 · 클릭 · 화살표 키
  const whys = $$('[data-why]');
  if (whys.length) {
    const prog = $('#why-prog'), cur = $('#why-cur');
    const DUR = 6000, N = whys.length;
    let idx = 0, t0 = performance.now(), paused = false;
    const tabs = whys.map((w) => $('[role="tab"]', w));
    const set = (i, focus) => {
      idx = (i + N) % N; t0 = performance.now();
      whys.forEach((w, k) => { const on = k === idx; w.classList.toggle('is-on', on); tabs[k].setAttribute('aria-selected', on); tabs[k].tabIndex = on ? 0 : -1; });
      cur.textContent = idx + 1;
      if (focus) tabs[idx].focus();
    };
    whys.forEach((w, k) => {
      w.addEventListener('mouseenter', () => { paused = true; set(k); });
      w.addEventListener('mouseleave', () => { paused = false; t0 = performance.now(); });
      w.addEventListener('click', () => set(k));
      const t = tabs[k];
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); set(idx + 1, true); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); set(idx - 1, true); }
        if (e.key === 'Home') { e.preventDefault(); set(0, true); }
        if (e.key === 'End') { e.preventDefault(); set(N - 1, true); }
      });
      t.addEventListener('focus', () => { paused = true; });
      t.addEventListener('blur', () => { paused = false; t0 = performance.now(); });
    });
    const loop = (now) => {
      if (paused || RM) t0 = now - ((now - t0) % DUR);
      const f = clamp((now - t0) / DUR);
      if (!paused && !RM && f >= 1) set(idx + 1);
      prog.style.transform = `scaleX(${((idx + (RM ? 1 : f)) / N).toFixed(4)})`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // 스크롤 아코디언 — 오른쪽 사진이 화면 가운데에 오면 그 항목이 펼쳐진다
  const acItems = $$('[data-ac]');
  if (acItems.length) {
    const pics = $$('[data-ac-ph]');
    const setAc = (i) => acItems.forEach((it, k) => { const on = k === i; it.classList.toggle('is-on', on); $('.ac-b', it).setAttribute('aria-expanded', on); });
    const acIo = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setAc(Number(e.target.dataset.acPh)); }), { rootMargin: '-50% 0px -50% 0px' });
    pics.forEach((p) => acIo.observe(p));
    $$('[data-ac-go]').forEach((b) => b.addEventListener('click', () => {
      const i = Number(b.dataset.acGo);
      setAc(i);
      const r = pics[i].getBoundingClientRect();
      if (r.height && getComputedStyle(pics[i]).display !== 'none') scrollTo({ top: scrollY + r.top + 1, behavior: RM ? 'auto' : 'smooth' });
    }));
  }

  // 하위 화면 목차 — 현재 구역에 점
  if (sx) {
    const links = $$('[data-sx]', sx);
    const secs = links.map((a) => document.getElementById(a.dataset.sx)).filter(Boolean);
    const spy = () => {
      const y = innerHeight * 0.5;
      let on = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top <= y) on = i; });
      links.forEach((a, i) => (i === on ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
    };
    addEventListener('scroll', spy, { passive: true });
    spy();
  }

  // 꼬리말 — 오늘 요일 · 현지 시각
  const today = new Date().getDay();
  $$('.hrs tr').forEach((tr) => tr.classList.toggle('is-today', Number(tr.dataset.day) === today));
  const clock = $('#clock');
  const tickClock = () => {
    const d = new Date(); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0');
    const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    if (clock) clock.textContent = `${h}:${m}${ap}`;
  };
  tickClock(); setInterval(tickClock, 20000);

  // 커서 라벨 — 마지막 사진 위에서만 따라다닌다
  const cursor = $('#cursor');
  $$('[data-cursor]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      cursor.style.transform = `translate(${e.clientX + 14}px, ${e.clientY - 9}px)`;
      cursor.classList.add('on');
    });
    el.addEventListener('pointerleave', () => cursor.classList.remove('on'));
  });

  // 대기 화면 — 60s 무입력 시. 클릭 · 키 · 스크롤로 닫힘
  const idle = $('#idle');
  let idleT;
  const wake = () => { idle.classList.remove('on'); clearTimeout(idleT); idleT = setTimeout(() => { if (mn.hidden) idle.classList.add('on'); }, 60000); };
  ['pointerdown', 'pointermove', 'keydown', 'scroll', 'wheel', 'touchstart'].forEach((ev) => addEventListener(ev, wake, { passive: true }));
  idle.addEventListener('click', wake);
  wake();
})();
