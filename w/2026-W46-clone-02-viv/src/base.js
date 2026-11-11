// HoH MGMT 공통 동작. 수치는 SPEC 7절(원본 실측).
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const html = document.documentElement;
const mainEl = $('main');
const page = $('.main');
const PG = document.body.dataset.pg;
const E = { p1o: 'cubic-bezier(.5,1,.89,1)', p2o: 'cubic-bezier(.33,1,.68,1)', p2i: 'cubic-bezier(.32,0,.67,0)', p2io: 'cubic-bezier(.65,0,.35,1)', p3o: 'cubic-bezier(.25,1,.5,1)', p3io: 'cubic-bezier(.76,0,.24,1)', p4o: 'cubic-bezier(.22,1,.36,1)', expo: 'cubic-bezier(.87,0,.13,1)', menu: 'cubic-bezier(.23,1,.32,1)', sine: 'cubic-bezier(.37,0,.63,1)' };
const ease = { p2o: (t) => 1 - Math.pow(1 - t, 3), p3io: (t) => (t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2), p3: (t) => 1 - Math.pow(1 - t, 4), c3io: (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) };
const tween = (dur, fn, ez = (t) => t, done) => {
  if (RM || dur <= 0) { fn(1); done && done(); return { stop() {} }; }
  let raf, t0 = performance.now(), off = false;
  const step = (now) => { if (off) return; const t = clamp((now - t0) / dur, 0, 1); fn(ez(t)); if (t < 1) raf = requestAnimationFrame(step); else done && done(); };
  raf = requestAnimationFrame(step);
  return { stop() { off = true; cancelAnimationFrame(raf); } };
};

// 스크롤: main 이 스크롤 통이다(원본과 같다). Lenis 가 있으면 관성, 없으면 그대로.
let lenis = null;
const noLenis = PG === 'all' || PG === 'artists';
if (!RM && window.Lenis && !noLenis) {
  lenis = new window.Lenis({ wrapper: mainEl, content: page, duration: 1.1, smoothWheel: true });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
const Scroll = {
  get y() { return mainEl.scrollTop; },
  to(y, { dur = 0, ez, done } = {}) {
    if (lenis && dur) lenis.scrollTo(y, { duration: dur / 1000, easing: ez, onComplete: done, force: true });
    else if (lenis) { lenis.scrollTo(y, { immediate: true, force: true }); done && done(); }
    else if (dur && !RM) { const from = mainEl.scrollTop; tween(dur, (k) => { mainEl.scrollTop = from + (y - from) * k; }, ez, done); }
    else { mainEl.scrollTop = y; done && done(); }
  },
  stop() { lenis ? lenis.stop() : (mainEl.style.overflow = 'hidden'); },
  start() { lenis ? lenis.start() : (mainEl.style.overflow = ''); },
  resize() { lenis && lenis.resize(); },
  on(fn) { mainEl.addEventListener('scroll', fn, { passive: true }); },
};
window.__scroll = Scroll;

// 페이지 들어옴 · 나감
requestAnimationFrame(() => page.classList.add('is-in'));
addEventListener('pageshow', (e) => { if (e.persisted) { page.classList.remove('is-out'); page.classList.add('is-in'); } });
const go = (href) => { if (RM) { location.href = href; return; } page.classList.add('is-out'); page.classList.remove('is-in'); setTimeout(() => { location.href = href; }, 500); };
window.__go = go;
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  if (a.target === '_blank' || a.hasAttribute('download')) return;
  const h = a.getAttribute('href');
  if (/^(mailto:|tel:|https?:)/i.test(h) || h.startsWith('#')) return;
  e.preventDefault();
  go(a.href);
});
if (!mainEl.contains(document.activeElement)) mainEl.focus({ preventScroll: true });

// 머리 가운데 표식: 홈과 Artists 에서는 숨고, 나머지는 위에서 내려온다
const navLogo = $('.nav__logo');
if (navLogo && PG !== 'home' && PG !== 'artists') setTimeout(() => navLogo.classList.add('is-in'), RM ? 0 : (PG === 'artist' ? 1100 : 300));

// 모바일 메뉴
const burger = $('.nav__burger'), mmenu = $('.mmenu');
if (burger && mmenu) {
  const set = (open) => {
    document.body.classList.toggle('is-menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    open ? mmenu.removeAttribute('aria-hidden') : mmenu.setAttribute('aria-hidden', 'true');
    mmenu.inert = !open;
    open ? Scroll.stop() : Scroll.start();
  };
  mmenu.inert = true;
  burger.addEventListener('click', () => set(!document.body.classList.contains('is-menu-open')));
  mmenu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('is-menu-open')) { set(false); burger.focus(); } });
  document.addEventListener('click', (e) => { if (document.body.classList.contains('is-menu-open') && !e.target.closest('.mmenu ul') && !e.target.closest('.nav__burger')) set(false); });
  matchMedia('(min-width: 992px)').addEventListener('change', (m) => { if (m.matches) set(false); });
}

// 사진 등장
const fadeIO = new IntersectionObserver((es) => es.forEach((en) => {
  if (!en.isIntersecting) return;
  const im = en.target; fadeIO.unobserve(im);
  const on = () => setTimeout(() => im.classList.add('is-loaded'), +im.dataset.wait || 0);
  im.complete ? on() : (im.addEventListener('load', on, { once: true }), im.addEventListener('error', on, { once: true }));
}), { root: mainEl, rootMargin: '0px 0px 200px 0px' });
const watchFade = (root = document) => $$('.fade', root).forEach((im) => fadeIO.observe(im));
watchFade();
window.__watchFade = watchFade;

// 벽돌 쌓기: 가장 낮은 단에 놓는다
const masonry = (box, items, cols, gap, vgap) => {
  const W = box.clientWidth;
  const w = cols === 1 ? W : Math.floor((W - gap * (cols - 1)) / cols);
  const hs = new Array(cols).fill(0);
  items.forEach((it) => { it.style.width = w + 'px'; });
  items.forEach((it) => {
    const c = hs.indexOf(Math.min(...hs));
    it.style.transform = `translate(${c * (w + gap)}px,${hs[c]}px)`;
    hs[c] += it.offsetHeight + vgap;
  });
  box.style.height = Math.max(0, Math.max(...hs) - vgap) + 'px';
};
window.__masonry = masonry;
const layAll = () => {
  $$('.mas').forEach((box) => {
    const its = $$('.mas__it', box);
    const cols = innerWidth >= 992 ? 3 : 1;
    box.classList.add('is-on');
    if (cols === 1) { its.forEach((it) => { it.style.width = ''; }); masonry(box, its, 1, 0, 50); return; }
    const W3 = box.clientWidth / 3, w = W3 - 10;
    const hs = [0, 0, 0];
    its.forEach((it) => { it.style.width = w + 'px'; });
    its.forEach((it) => { const c = hs.indexOf(Math.min(...hs)); it.style.transform = `translate(${c * W3}px,${hs[c]}px)`; hs[c] += it.offsetHeight + 60; });
    box.style.height = Math.max(0, Math.max(...hs) - 10) + 'px';
  });
  $$('.blk--gal').forEach((box) => {
    const n = +box.dataset.n;
    if (n === 2 || n === 3) return;
    box.classList.add('is-on');
    masonry(box, $$('.blk__m', box), innerWidth >= 992 ? 4 : innerWidth >= 768 ? 3 : 2, 10, 10);
  });
  Scroll.resize();
};
layAll();
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(layAll, 120); });
addEventListener('load', layAll);
document.fonts && document.fonts.ready.then(layAll);

// 꼬리말: 아래에 깔려 있다가 드러난다 (안쪽 -25% → 0, 어두운 막 .5 → .1), 절반 넘게 드러나면 머리를 숨긴다
const ftr = $('.ftr');
if (ftr) {
  const fin = $('.ftr__in', ftr), fbg = $('.ftr__bg', ftr), flogo = $('.ftr__logo svg', ftr);
  let shown = false;
  const r1 = flogo && flogo.querySelector('[id$="-r1"]'), r2 = flogo && flogo.querySelector('[id$="-r2"]');
  if (r1 && !RM) { r1.setAttribute('x', 560); r1.setAttribute('width', 0); r2.setAttribute('width', 0); }
  const upd = () => {
    const top = ftr.getBoundingClientRect().top, vh = innerHeight;
    const p = clamp((vh - top) / vh, 0, 1);
    if (!RM) { fin.style.transform = `translate3d(0,${-25 * (1 - p)}%,0)`; fbg.style.opacity = (.5 - .4 * p).toFixed(3); }
    html.classList.toggle('is-nav-hidden', p > .5);
    if (!shown && r1 && !RM && flogo.getBoundingClientRect().top < vh) {
      shown = true;
      tween(1600, (k) => { r1.setAttribute('x', 560 * (1 - k)); r1.setAttribute('width', 560 * k); r2.setAttribute('width', 560 * k); }, ease.p3io);
    }
  };
  Scroll.on(upd); addEventListener('resize', upd); upd(); setTimeout(upd, 600);
}

// 커서를 따라오는 사진 (꼬리말 작가 이름 · Next 버튼 · About 메일 · 소개글 이름)
const canHover = html.classList.contains('no-touch');
if (canHover) {
  $$('[data-img]').forEach((el) => {
    let box = null, tOff;
    const kind = el.dataset.rev || 'foot';
    const make = () => { box = document.createElement('div'); box.className = 'hr'; box.setAttribute('aria-hidden', 'true'); box.innerHTML = `<div class="hr__in"><div class="hr__img" style="background-image:url(${el.dataset.img})"></div></div>`; document.body.appendChild(box); };
    const place = (e) => {
      const w = 240, h = 320;
      let x = kind === 'mail' ? e.clientX - w - 20 : e.clientX + 20;
      let y = kind === 'next' ? e.clientY - h - 20 : e.clientY + 20;
      x = clamp(x, 0, innerWidth - w); y = clamp(y, 0, Math.max(0, innerHeight - h));
      box.style.transform = `translate(${x}px,${y}px)`;
    };
    el.addEventListener('mouseenter', (e) => {
      if (kind === 'foot' && ftr && ftr.getBoundingClientRect().top > innerHeight * .1) return;
      if (!box) make();
      clearTimeout(tOff); place(e);
      box.classList.remove('is-off'); void box.offsetWidth; box.classList.add('is-on');
      const tgt = kind === 'foot' ? ftr : kind === 'bio' ? mainEl : null;
      if (tgt && el.dataset.color) tgt.style.backgroundColor = el.dataset.color;
    });
    el.addEventListener('mousemove', (e) => { if (box) requestAnimationFrame(() => place(e)); });
    const leave = () => {
      if (!box) return;
      box.classList.remove('is-on'); box.classList.add('is-off');
      tOff = setTimeout(() => box.classList.remove('is-off'), 300);
      const tgt = kind === 'foot' ? ftr : kind === 'bio' ? mainEl : null;
      if (tgt) tgt.style.backgroundColor = '';
    };
    el.addEventListener('mouseleave', leave);
    el.addEventListener('click', () => { if (box) box.classList.remove('is-on', 'is-off'); });
  });
}

// 큰 사진 보기: 썸네일 자리에서 날아와 가운데에 놓인다. Esc · 좌우 키 · 바탕/사진 클릭
const lb = (() => {
  let box, img, cur = null, busy = false, open = false, trigger = null;
  const list = () => $$('[data-zoom]').filter((a) => a.getClientRects().length);
  const build = () => {
    box = document.createElement('div'); box.className = 'lb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photo viewer'); box.tabIndex = -1;
    box.innerHTML = '<div class="lb__ui"><button class="lb__b" type="button" data-lb="prev">Previous</button><span class="lb__n" aria-live="polite"></span><button class="lb__b" type="button" data-lb="next">Next</button><button class="lb__b" type="button" data-lb="close">Close</button></div>';
    document.body.appendChild(box);
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lb]');
      if (b) { b.dataset.lb === 'close' ? close() : step(b.dataset.lb === 'next' ? 1 : -1); return; }
      close();
    });
    let sx = 0, sy = 0;
    box.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    box.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return; step(dx < 0 ? 1 : -1); }, { passive: true });
  };
  const fit = (ratio) => {
    const cs = getComputedStyle(box);
    const W = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), H = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    let w = W, h = w / ratio; if (h > H) { h = H; w = h * ratio; }
    return [w, h];
  };
  const count = () => { const l = list(); $('.lb__n', box).textContent = `${l.indexOf(cur) + 1} / ${l.length}`; };
  const show = (a, fade) => {
    const th = a.querySelector('img'); if (!th) return;
    cur = a; busy = true;
    const r = th.getBoundingClientRect();
    img = document.createElement('img'); img.className = 'lb__img'; img.alt = th.alt; img.src = a.dataset.zoom;
    box.classList.add('is-open');
    const [w, h] = fit(r.width / r.height);
    img.style.width = w + 'px'; img.style.height = h + 'px';
    box.insertBefore(img, box.firstChild);
    count();
    const t = img.getBoundingClientRect();
    const end = () => { busy = false; open = true; box.classList.add('is-ready'); };
    if (RM) { box.style.backgroundColor = '#fff'; end(); return; }
    if (fade) { img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: E.p1o }).onfinish = end; return; }
    box.animate([{ backgroundColor: 'rgba(255,255,255,0)' }, { backgroundColor: '#fff' }], { duration: 300, easing: 'linear', fill: 'forwards' });
    img.animate([{ transform: `translate(${r.left + r.width / 2 - (t.left + t.width / 2)}px,${r.top + r.height / 2 - (t.top + t.height / 2)}px) scale(${r.width / t.width},${r.height / t.height})` }, { transform: 'none' }], { duration: 550, easing: E.p3o }).onfinish = end;
  };
  const openAt = (a) => { if (busy || open) return; if (!box) build(); trigger = a; html.style.cursor = 'zoom-out'; Scroll.stop(); show(a, false); box.focus({ preventScroll: true }); document.addEventListener('keydown', key); };
  const step = (d) => {
    const l = list(); if (!open || busy || l.length < 2) return;
    busy = true; open = false;
    const nx = l[(l.indexOf(cur) + d + l.length) % l.length];
    const old = img;
    const swap = () => { old.remove(); nx.scrollIntoView({ block: 'center' }); show(nx, true); };
    RM ? swap() : (old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'cubic-bezier(.11,0,.5,0)', fill: 'forwards' }).onfinish = swap);
  };
  const close = () => {
    if (!open || busy) return;
    busy = true; box.classList.remove('is-ready'); html.style.cursor = '';
    document.removeEventListener('keydown', key);
    const fin = () => { box.classList.remove('is-open'); box.getAnimations().forEach((a) => a.cancel()); box.style.backgroundColor = ''; img && img.remove(); img = null; open = false; busy = false; Scroll.start(); const t = cur || trigger; cur = null; t && t.focus({ preventScroll: true }); };
    if (RM) { fin(); return; }
    const th = cur.querySelector('img').getBoundingClientRect(), t = img.getBoundingClientRect();
    img.animate([{ transform: 'none' }, { transform: `translate(${th.left + th.width / 2 - (t.left + t.width / 2)}px,${th.top + th.height / 2 - (t.top + t.height / 2)}px) scale(${th.width / t.width},${th.height / t.height})` }], { duration: 450, easing: E.p2io, fill: 'forwards' }).onfinish = fin;
    box.animate([{ backgroundColor: '#fff' }, { backgroundColor: 'rgba(255,255,255,0)' }], { duration: 300, delay: 180, easing: E.p2i, fill: 'forwards' });
  };
  const key = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); } else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'Tab') { const f = $$('.lb__b', box); const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  };
  document.addEventListener('click', (e) => { const a = e.target.closest('[data-zoom]'); if (!a || e.metaKey || e.ctrlKey) return; e.preventDefault(); openAt(a); });
  return { get open() { return open; } };
})();
