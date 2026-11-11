// Artists 덮개: 이름 목록이 끝없이 돈다. 이름에 올리면 사진 · 바탕색 · 분야 표시가 바뀐다
(() => {
  const box = $('.ars');
  if (!box) return;
  html.classList.add('is-artists');
  const items = $$('.ars__it', box), kinds = $$('.ars__kinds [data-kind]');
  const set = (it, tint = true) => {
    items.forEach((x) => x.classList.toggle('is-on', x === it));
    if (!it) { kinds.forEach((k) => k.classList.remove('is-off')); return; }
    if (tint) box.style.backgroundColor = it.dataset.color || '';
    const ex = (it.dataset.exp || '').split(',');
    kinds.forEach((k) => k.classList.toggle('is-off', !ex.includes(k.dataset.kind)));
  };
  // 끝없는 스크롤: 목록 뒤에 화면 한 장 높이의 복제본을 붙이고, 끝에 닿으면 처음으로 돌아간다
  const list = $('.ars__list', box), inner = $('.ars__scroll', box);
  let al = null;
  if (!RM && window.Lenis) {
    al = new window.Lenis({ wrapper: box, content: inner, duration: 1.1, smoothWheel: true, infinite: true, syncTouch: true });
    const raf = (t) => { al.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    al.scrollTo(Math.min(1000, list.offsetHeight - 1), { immediate: true, force: true });
    box.classList.add('is-in');
    al.scrollTo(0, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 3), force: true });
    document.fonts && document.fonts.ready.then(() => al.resize());
  } else {
    box.classList.add('is-in');
    box.addEventListener('scroll', () => { const h = list.offsetHeight; if (box.scrollTop >= h) box.scrollTop -= h; }, { passive: true });
  }
  if (html.classList.contains('no-touch')) {
    items.forEach((it) => { it.addEventListener('mouseenter', () => set(it)); const a = it.querySelector('a'); a.addEventListener('focus', () => set(it)); });
    inner.addEventListener('mouseleave', () => set(null));
  } else {
    const tick = () => {
      const mid = innerHeight / 2; let best = null, bd = 1e9;
      items.forEach((it) => { const r = it.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; const d = Math.abs(mid - (r.top + r.height / 2)); if (d < bd) { bd = d; best = it; } });
      if (best && !best.classList.contains('is-on')) set(best, false);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { const x = $('.ars__x'); x && x.click(); } });
})();
