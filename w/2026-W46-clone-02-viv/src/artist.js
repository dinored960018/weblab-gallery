// 작가 · 디렉터 페이지: 격자 2종 · 더 보기 · 분류 판 · 소개 · 아래 막대
(() => {
  const at = $('.at');
  if (!at) return;
  const grid = $('.at__grid'), itemsBox = $('.at__items'), about = $('.at__about'), nav = $('.at__nav');
  const fbtn = $('.at__fbtn'), filters = $('.at__filters'), moreWrap = $('.at__more');
  let fromFilter = false;
  try { fromFilter = sessionStorage.getItem('hoh-filter-nav') === '1'; sessionStorage.removeItem('hoh-filter-nav'); } catch (e) { /* storage off */ }

  // ── 격자 ──
  const GAP = 10;
  const its = () => $$('.at__it', grid);
  const pos = new WeakMap();
  const put = (it, x, y, w) => { it.style.width = w + 'px'; it.style.transform = `translate(${x}px,${y}px)`; pos.set(it, { x, y, w }); };
  const layCols = (list, cols) => {
    const W = grid.clientWidth, w = Math.floor((W - GAP * (cols - 1)) / cols), hs = new Array(cols).fill(0);
    list.forEach((it) => { it.style.width = w + 'px'; });
    list.forEach((it) => { const c = hs.indexOf(Math.min(...hs)); put(it, c * (w + GAP), hs[c], w); hs[c] += it.offsetHeight + GAP; });
    grid.style.height = Math.max(0, Math.max(...hs) - GAP) + 'px';
  };
  const plan = new WeakMap();
  const makePlan = (list) => {
    let g = 0, i = 0;
    while (i < list.length) {
      if (g % 2 === 0) { const wide = Math.random() < .5; plan.set(list[i], wide ? 'wide' : 'narrow'); i++; if (i < list.length) { plan.set(list[i], wide ? 'narrow' : 'wide'); i++; } }
      else { plan.set(list[i], { w: Math.round(65 + 15 * Math.random()), al: ['l', 'c', 'r'][Math.floor(3 * Math.random())] }); i++; }
      g++;
    }
  };
  const layEditorial = (list) => {
    const W = grid.clientWidth, wide = Math.floor(.6 * (W - GAP)), narrow = W - GAP - wide;
    let y = 0, i = 0;
    while (i < list.length) {
      const it = list[i], p = plan.get(it);
      if (p && typeof p === 'object') { const w = Math.round(W * p.w / 100); put(it, p.al === 'c' ? Math.round((W - w) / 2) : p.al === 'r' ? W - w : 0, y, w); y += it.offsetHeight + GAP; i++; continue; }
      const nx = list[i + 1], np = nx && plan.get(nx);
      if (!nx || (np && typeof np === 'object')) { put(it, 0, y, W); y += it.offsetHeight + GAP; i++; continue; }
      const [a, b] = p === 'wide' ? [it, nx] : [nx, it];
      const aw = p === 'wide' ? wide : narrow;
      put(a, 0, y, aw); put(b, aw + GAP, y, W - GAP - aw);
      y += Math.max(a.offsetHeight, b.offsetHeight) + GAP; i += 2;
    }
    grid.style.height = Math.max(0, y - GAP) + 'px';
  };
  const lay = () => {
    if (!grid) return;
    const list = its(); if (!list.length) return;
    if (grid.dataset.cols === 'editorial') layEditorial(list);
    else { let c = parseInt(grid.dataset.cols, 10) || 4; if (innerWidth < 992 && c > 3) c = 3; layCols(list, c); }
    Scroll.resize();
  };
  if (grid) { lay(); let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(lay, 120); }); addEventListener('load', lay); }

  // 더 보기
  const moreBtn = $('[data-more]');
  if (moreBtn) {
    const rest = JSON.parse($('#at-more').textContent);
    const BATCH = +moreBtn.dataset.batch || 12;
    const cnt = $('span', moreBtn);
    moreBtn.addEventListener('click', () => {
      const add = rest.splice(0, BATCH);
      const made = add.map((m) => { const d = document.createElement('div'); d.className = 'at__it'; d.innerHTML = `<button class="at__a" type="button" data-zoom="${m.u}" aria-label="View larger: ${m.a}" style="--c:${m.c}"><img class="fade" data-wait="600" src="${m.u}" alt="${m.a}" width="${m.w}" height="${m.h}" loading="lazy" decoding="async"></button>`; grid.appendChild(d); return d; });
      if (grid.dataset.cols === 'editorial') makePlan(made);
      window.__watchFade(grid); lay();
      if (!rest.length) moreWrap.hidden = true; else cnt.textContent = `(${rest.length})`;
      made[0] && made[0].querySelector('button').focus({ preventScroll: true });
    });
  }

  // ── 아래 막대 ──
  const btns = nav ? $$('.at__nb', nav) : [];
  const workBtn = $('[data-work]'), aboutBtn = $('[data-about]'), layoutBtns = $$('[data-layout]');
  if (nav) {
    if (fromFilter || RM) { nav.style.transitionDuration = '0s'; nav.classList.add('is-in'); nav.getBoundingClientRect(); nav.style.transitionDuration = ''; }
    else setTimeout(() => nav.classList.add('is-in'), 1100);
    if (html.classList.contains('no-touch') && !RM) {
      nav.addEventListener('mouseenter', () => { nav.style.scale = '1.06'; btns.forEach((b, i) => { b.style.transform = `translateX(${(i - (btns.length - 1) / 2) * 6}px)`; }); });
      nav.addEventListener('mouseleave', () => { nav.style.scale = ''; btns.forEach((b) => { b.style.transform = ''; }); });
      nav.style.transition += ',scale .3s cubic-bezier(.33,1,.68,1)';
    }
    const away = () => nav.classList.toggle('is-away', at.getBoundingClientRect().bottom <= innerHeight + 1);
    setTimeout(() => { Scroll.on(away); away(); }, 1500);
  }
  const press = (b, on) => { if (!b) return; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); };

  // 소개 ↔ 작업
  let bioOn = false, lastLayout = layoutBtns.find((b) => b.classList.contains('is-active')) || layoutBtns[0];
  const fade = (el, to, ms) => new Promise((res) => { if (!el) return res(); if (RM) { el.style.opacity = to; return res(); } const a = el.animate([{ opacity: getComputedStyle(el).opacity }, { opacity: to }], { duration: ms, easing: E.p1o, fill: 'forwards' }); a.onfinish = () => { el.style.opacity = to; a.cancel(); res(); }; });
  const showBio = async () => {
    bioOn = true;
    press(workBtn, false); press(aboutBtn, true); layoutBtns.forEach((b) => press(b, false));
    if (moreWrap) moreWrap.style.display = 'none';
    fbtn && fade(fbtn, 0, 250).then(() => { fbtn.style.visibility = 'hidden'; });
    await fade(itemsBox, 0, 250);
    await new Promise((res) => Scroll.to(0, { dur: 500, ez: ease.p2o, done: res }));
    itemsBox.style.display = 'none'; about.hidden = false; about.style.opacity = 0;
    Scroll.resize();
    await fade(about, 1, 300);
    about.focus({ preventScroll: true });
  };
  const showWork = async () => {
    if (!bioOn) return;
    bioOn = false;
    press(aboutBtn, false); press(workBtn, true); press(lastLayout, true);
    await fade(about, 0, 250);
    about.hidden = true; itemsBox.style.display = '';
    if (moreWrap) moreWrap.style.display = '';
    lay(); window.__masonry && $$('.mas', at).length && dispatchEvent(new Event('resize'));
    if (fbtn) { fbtn.style.visibility = ''; fade(fbtn, 1, 200); }
    await fade(itemsBox, 1, 300);
  };
  aboutBtn && aboutBtn.addEventListener('click', () => (bioOn ? showWork() : showBio()));
  workBtn && workBtn.addEventListener('click', showWork);

  // 격자 바꾸기: 맨 위로 올라간 뒤 칸들이 새 자리로 옮겨 간다 (0.7s)
  layoutBtns.forEach((b) => b.addEventListener('click', () => {
    const mode = b.dataset.layout;
    layoutBtns.forEach((x) => press(x, x === b)); lastLayout = b;
    const apply = () => {
      const list = its(), old = list.map((it) => ({ ...pos.get(it), h: it.offsetHeight }));
      grid.dataset.cols = mode;
      if (mode === 'editorial') makePlan(list);
      lay();
      if (RM) return;
      list.forEach((it, i) => { const o = old[i], n = pos.get(it); if (!o || !n) return; it.style.transformOrigin = '0 0'; it.animate([{ transform: `translate(${o.x}px,${o.y}px) scale(${o.w / n.w},${o.h / it.offsetHeight})` }, { transform: `translate(${n.x}px,${n.y}px)` }], { duration: 700, easing: E.expo }); });
    };
    if (bioOn) { grid.dataset.cols = mode; if (mode === 'editorial') makePlan(its()); showWork(); return; }
    const y = Scroll.y;
    if (y > 2) Scroll.to(0, { dur: clamp(y / 800, .5, 1.6) * 1000, ez: ease.c3io, done: apply }); else apply();
  }));

  // ── 분류 판 ──
  if (fbtn && filters) {
    const label = $('[data-label]', fbtn), count = $('.at__n', fbtn);
    const clips = $$('.at__fclip', filters), fitems = $$('.at__f', filters), seps = $$('.at__sep', filters);
    let open = false, H = 0, anims = [];
    const D = 650;
    const kill = () => { anims.forEach((a) => a.cancel()); anims = []; };
    const an = (el, kf, o) => { if (RM) return null; const a = el.animate(kf, { duration: D, easing: E.menu, fill: 'both', ...o }); anims.push(a); return a; };
    const swap = (txt) => {
      if (RM) { label.textContent = txt; return; }
      const h = label.offsetHeight || 20;
      label.animate([{ transform: 'none' }, { transform: `translateY(${-h}px)` }], { duration: D * .25, easing: E.menu }).onfinish = () => { label.textContent = txt; label.animate([{ transform: `translateY(${h}px)` }, { transform: 'none' }], { duration: D * .75, easing: E.menu }); };
    };
    const openF = () => {
      kill(); open = true;
      fbtn.classList.add('is-open'); fbtn.setAttribute('aria-expanded', 'true');
      filters.classList.add('is-open'); filters.removeAttribute('aria-hidden'); filters.inert = false;
      nav && nav.classList.remove('is-in');
      swap('Close'); Scroll.stop();
      filters.style.height = 'auto';
      H = Math.max(filters.scrollHeight, innerHeight - filters.getBoundingClientRect().top);
      filters.style.height = H + 'px';
      an(filters, [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }]);
      an(itemsBox, [{ transform: `translateY(${-H}px)` }, { transform: 'none' }]);
      fitems.forEach((f, i) => an(f, [{ transform: 'translateY(110%)' }, { transform: 'none' }], { delay: i * 40 }));
      seps.forEach((s, i) => { if (RM) s.style.opacity = .3; else an(s, [{ opacity: 0 }, { opacity: .3 }], { delay: i * 40, easing: 'ease' }); });
      setTimeout(() => fitems[0] && fitems[0].focus({ preventScroll: true }), 80);
    };
    const closeF = (txt, cnt) => {
      kill(); open = false;
      fbtn.classList.remove('is-open'); fbtn.setAttribute('aria-expanded', 'false');
      Scroll.start();
      if (cnt) count.textContent = cnt;
      swap(txt || fbtn.dataset.label);
      const end = () => { kill(); filters.style.height = ''; filters.classList.remove('is-open'); filters.setAttribute('aria-hidden', 'true'); filters.inert = true; seps.forEach((s) => { s.style.opacity = ''; }); nav && nav.classList.add('is-in'); };
      if (RM) { end(); return; }
      fitems.forEach((f, i) => an(f, [{ transform: 'none' }, { transform: 'translateY(-110%)' }], { delay: i * 20 }));
      seps.forEach((s) => an(s, [{ opacity: .3 }, { opacity: 0 }], { easing: 'ease' }));
      an(filters, [{ clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { delay: 50 });
      an(itemsBox, [{ transform: 'none' }, { transform: `translateY(${-H}px)` }], { delay: 50 }).onfinish = end;
    };
    filters.inert = true;
    fbtn.addEventListener('click', () => (open ? closeF() : openF()));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) { closeF(); fbtn.focus(); } });
    filters.addEventListener('click', (e) => {
      const f = e.target.closest('.at__f'); if (!f || !open) return;
      e.preventDefault(); e.stopPropagation();
      const name = f.dataset.name, c = $('.at__n', f).textContent.trim();
      closeF(name, c);
      setTimeout(() => { fade(itemsBox, 0, 400).then(() => { try { sessionStorage.setItem('hoh-filter-nav', '1'); } catch (er) { /* storage off */ } location.href = f.href; }); }, RM ? 0 : D);
    }, true);
  }
  if (fromFilter) { page.style.transition = 'none'; page.classList.add('is-in'); if (itemsBox && !RM) itemsBox.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.45,0,.55,1)' }); }
})();
