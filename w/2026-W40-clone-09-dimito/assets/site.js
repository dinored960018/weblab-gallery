/* VEKRA — 공통 동작. 원본 동작은 SPEC.md 기능 목록 */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ROOT = document.body.dataset.root || '';
  const P = window.VEKRA_PRODUCTS || {};
  const won = n => n.toLocaleString('ko-KR') + '원';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 헤더 · 메가 메뉴 ── */
  const hd = $('.hd');
  const overlay = hd && hd.classList.contains('hd--overlay');
  const solid = () => { if (!overlay) return; const on = hd.classList.contains('is-fixed') || hd.classList.contains('is-menu') || hd.matches(':hover') || hd.classList.contains('is-search') || $$('.gnb__item.is-open').length > 0 || hd.contains(document.activeElement); hd.classList.toggle('is-solid', on); };
  if (hd) {
    hd.addEventListener('mouseenter', solid);
    hd.addEventListener('mouseleave', () => setTimeout(solid, 0));
    hd.addEventListener('focusin', solid);
    hd.addEventListener('focusout', () => setTimeout(solid, 0));
  }
  // 스크롤하면 헤더 고정 (원본: absolute/relative → fixed, 흰 바탕)
  const fix = () => { if (!hd) return; hd.classList.toggle('is-fixed', window.scrollY > 0); solid(); };
  window.addEventListener('scroll', fix, { passive: true }); fix();
  const items = $$('.gnb__item[data-mega]');
  const setOpen = (li, on) => {
    li.classList.toggle('is-open', on);
    const a = $('.gnb__link', li); if (a) a.setAttribute('aria-expanded', on ? 'true' : 'false');
    solid();
  };
  items.forEach(li => {
    li.addEventListener('mouseenter', () => { items.forEach(o => o !== li && setOpen(o, false)); setOpen(li, true); });
    li.addEventListener('mouseleave', () => setOpen(li, false));
    li.addEventListener('focusin', () => { items.forEach(o => o !== li && setOpen(o, false)); setOpen(li, true); });
    li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) setOpen(li, false); });
  });

  /* ── 검색 막대 ── */
  const dim = $('.dim');
  const searchBtn = $('.js-search');
  const closeSearch = () => { if (!hd) return; hd.classList.remove('is-search'); dim && dim.classList.remove('is-on'); searchBtn && searchBtn.setAttribute('aria-expanded', 'false'); solid(); };
  const openSearch = () => { hd.classList.add('is-search'); dim && dim.classList.add('is-on'); searchBtn.setAttribute('aria-expanded', 'true'); solid(); setTimeout(() => { const i = $('.search-bar input'); i && i.focus(); }, 50); };
  if (searchBtn) searchBtn.addEventListener('click', () => hd.classList.contains('is-search') ? closeSearch() : openSearch());
  if (dim) dim.addEventListener('click', closeSearch);

  /* ── 장바구니 (localStorage) ── */
  const KEY = 'vekra-cart';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const write = c => { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* 저장 불가 */ } render(); };
  const count = c => c.reduce((s, x) => s + x.qty, 0);
  const sum = c => c.reduce((s, x) => s + (P[x.slug] ? P[x.slug].price * x.qty : 0), 0);
  const lineHTML = (x, i) => {
    const p = P[x.slug]; if (!p) return '';
    return `<div class="cart-line"><img src="${ROOT}${p.img}" alt="" width="72" height="108"><div><a class="cart-line__name" href="${ROOT}product/${x.slug}/index.html">${p.name}</a><p class="cart-line__opt">SIZE : ${x.size}</p>
      <div class="cart-line__qty"><button type="button" data-i="${i}" data-d="-1" aria-label="수량 줄이기">−</button><span aria-live="polite">${x.qty}</span><button type="button" data-i="${i}" data-d="1" aria-label="수량 늘리기">+</button></div>
      <button type="button" class="cart-line__del" data-del="${i}">삭제</button></div><p class="cart-line__price">${won(p.price * x.qty)}</p></div>`;
  };
  function render() {
    const c = read();
    $$('.cart-count').forEach(e => e.textContent = count(c));
    const body = $('.drawer__body'), foot = $('.drawer__foot');
    if (body) {
      body.innerHTML = c.length ? c.map(lineHTML).join('') : '<p class="drawer__empty">장바구니에 담은 상품이 없습니다.</p>';
      foot.hidden = !c.length; const t = $('.cart-total b', foot); if (t) t.textContent = won(sum(c));
    }
    const page = $('.basket');
    if (page) {
      $('.basket__empty', page).hidden = !!c.length; $('.basket__list', page).hidden = !c.length; $('.basket__sum', page).hidden = !c.length;
      $('.basket__list', page).innerHTML = c.map(lineHTML).join('');
      $('.basket__sum b', page).textContent = won(sum(c));
      $('.basket__go', page).textContent = c.length ? '주문하기' : '계속 쇼핑하기';
    }
  }
  document.addEventListener('click', e => {
    const q = e.target.closest('[data-d]'), d = e.target.closest('[data-del]');
    if (q) { const c = read(), x = c[+q.dataset.i]; if (x) { x.qty = Math.max(1, x.qty + +q.dataset.d); write(c); } }
    if (d) { const c = read(); c.splice(+d.dataset.del, 1); write(c); }
  });
  const basketGo = $('.basket__go');
  if (basketGo) basketGo.addEventListener('click', e => { if (read().length) { e.preventDefault(); const m = $('.basket .form-msg'); m.textContent = '모작 사이트라 주문은 진행하지 않습니다.'; } });
  const drawer = $('.drawer'), ddim = $('.drawer-dim');
  let lastFocus = null;
  const openDrawer = () => { if (!drawer) return; lastFocus = document.activeElement; render(); drawer.classList.add('is-open'); ddim.classList.add('is-on'); drawer.setAttribute('aria-hidden', 'false'); drawer.inert = false; document.documentElement.classList.add('no-scroll'); setTimeout(() => $('.drawer__close').focus(), 60); };
  const closeDrawer = () => { if (!drawer || !drawer.classList.contains('is-open')) return; drawer.classList.remove('is-open'); ddim.classList.remove('is-on'); drawer.setAttribute('aria-hidden', 'true'); drawer.inert = true; document.documentElement.classList.remove('no-scroll'); lastFocus && lastFocus.focus(); };
  $$('.js-cart').forEach(b => b.addEventListener('click', openDrawer));
  if (drawer) { drawer.inert = true; $('.drawer__close').addEventListener('click', closeDrawer); ddim.addEventListener('click', closeDrawer); }
  window.VEKRA_CART = { add(slug, size, qty) { const c = read(); const x = c.find(i => i.slug === slug && i.size === size); if (x) x.qty += qty; else c.push({ slug, size, qty }); write(c); }, open: openDrawer };
  render();

  /* ── 모바일 메뉴 ── */
  const burger = $('.hd__menu'), mm = $('.mmenu');
  if (burger && mm) {
    const panels = $$('.mmenu__panel', mm), root = $('.mmenu__panel.is-root', mm);
    const reset = () => panels.forEach(p => { p.classList.remove('is-active', 'is-behind'); if (p !== root) { p.inert = true; p.hidden = true; } });
    const toggle = on => {
      mm.classList.toggle('is-open', on); burger.setAttribute('aria-expanded', on ? 'true' : 'false'); burger.setAttribute('aria-label', on ? '메뉴 닫기' : '메뉴 열기');
      $('.ico-burger', burger).toggleAttribute('hidden', on); $('.ico-close', burger).toggleAttribute('hidden', !on); hd.classList.toggle('is-menu', on); solid();
      document.body.classList.toggle('no-scroll', on); mm.inert = !on; if (!on) reset();
      if (on) setTimeout(() => { const f = $('a, button', root); f && f.focus(); }, 50);
    };
    mm.inert = true; reset();
    burger.addEventListener('click', () => toggle(!mm.classList.contains('is-open')));
    mm.addEventListener('click', e => {
      const go = e.target.closest('[data-panel]'), back = e.target.closest('.mmenu__crumb');
      if (go) { const cur = go.closest('.mmenu__panel'), next = $('#' + go.dataset.panel, mm); cur.classList.add('is-behind'); next.dataset.from = cur.id; next.inert = false; next.hidden = false; next.style.zIndex = (parseInt(cur.style.zIndex, 10) || 1) + 1; void next.offsetWidth; next.classList.add('is-active'); setTimeout(() => back || $('button, a', next).focus(), 320); }
      if (back) { const cur = back.closest('.mmenu__panel'), prev = $('#' + cur.dataset.from, mm); cur.classList.remove('is-active'); cur.inert = true; setTimeout(() => { if (!cur.classList.contains('is-active')) cur.hidden = true; }, 320); prev.classList.remove('is-behind'); const opener = $(`[data-panel="${cur.id}"]`, prev); opener && opener.focus(); }
    });
    window.VEKRA_MENU = toggle;
  }

  /* ── ESC ── */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if ($('.lb.is-open')) return;
    closeDrawer(); closeSearch(); items.forEach(li => setOpen(li, false));
    if (mm && mm.classList.contains('is-open')) { window.VEKRA_MENU(false); burger.focus(); }
  });

  /* ── 위로 가기 ── */
  const top = $('.scroll-top'), ft = $('.ft');
  if (top) {
    top.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
    if (ft && 'IntersectionObserver' in window) new IntersectionObserver(([en]) => top.classList.toggle('is-hidden', en.isIntersecting)).observe(ft);
  }

  /* ── 슬라이더 (Swiper) ── */
  const bar = (sw, el) => { const fill = $('.bar__fill', el); if (!fill) return; const n = sw.params.loop ? sw.slides.filter(s => !s.classList.contains('swiper-slide-duplicate')).length || sw.slides.length : sw.slides.length; fill.style.transform = `scaleX(${(sw.realIndex + 1) / n})`; };
  if (window.Swiper) {
    const hero = $('.mainbanner .swiper');
    if (hero) {
      const wrap = hero.closest('.mainbanner');
      new Swiper(hero, { speed: 300, rewind: true, autoplay: reduce ? false : { delay: 5000, disableOnInteraction: false }, a11y: { prevSlideMessage: '이전 배너', nextSlideMessage: '다음 배너' },
        on: { init(sw) { bar(sw, wrap); }, slideChange(sw) { bar(sw, wrap); } } });
    }
    $$('.prd-swiper').forEach(el => {
      const sec = el.closest('section');
      new Swiper(el, { speed: 300, loop: true, centeredSlides: true, slidesPerView: 'auto', spaceBetween: 12, breakpoints: { 641: { spaceBetween: 15 } },
        on: { init(sw) { bar(sw, sec); }, slideChange(sw) { bar(sw, sec); } } });
    });
    $$('.cats__swiper, .wn-swiper').forEach(el => {
      const wn = el.classList.contains('wn-swiper');
      new Swiper(el, { speed: 300, slidesPerView: wn ? 1.15 : 1.2, spaceBetween: 12, breakpoints: { 641: { slidesPerView: wn ? 1.15 : 1.2 }, 1025: { slidesPerView: 3, spaceBetween: 15 } } });
    });
    $$('.stock-swiper').forEach(el => {
      const box = el.closest('.stock__gallery');
      new Swiper(el, { speed: 300, slidesPerView: 'auto', spaceBetween: 10, scrollbar: { el: $('.sbar', box), dragClass: 'sbar__drag', draggable: true },
        navigation: { prevEl: $('.arrow--prev', box), nextEl: $('.arrow--next', box), disabledClass: 'is-disabled' } });
    });
    $$('.slider').forEach(el => {
      const dots = $$('.dots button', el);
      new Swiper($('.swiper', el), { speed: 300, loop: false, navigation: { prevEl: $('.arrow--prev', el), nextEl: $('.arrow--next', el), disabledClass: 'is-disabled' },
        on: { slideChange(sw) { dots.forEach((d, i) => d.setAttribute('aria-current', i === sw.activeIndex ? 'true' : 'false')); } } });
      dots.forEach((d, i) => d.addEventListener('click', () => $('.swiper', el).swiper.slideTo(i)));
    });
  }

  /* ── 카드 두 번째 사진 (호버 때 넣는다) ── */
  const addAlt = e => {
    const c = e.target.closest && e.target.closest('.card'); if (!c) return;
    const t = $('.card__thumb', c); if (!t || $('.alt', t)) return;
    const base = $('img', t), alt = base.cloneNode(); alt.className = 'alt is-pre'; alt.alt = ''; alt.removeAttribute('loading');
    t.insertBefore(alt, base.nextSibling); void alt.offsetWidth; requestAnimationFrame(() => alt.classList.remove('is-pre'));
  };
  document.addEventListener('pointerover', addAlt); document.addEventListener('focusin', addAlt);

  /* ── 상세 ── */
  const pdp = $('.pdp');
  if (pdp) {
    const slug = pdp.dataset.slug, price = +pdp.dataset.price, name = pdp.dataset.name;
    const rows = $('.opt-rows', pdp), total = $('.total', pdp);
    let sel = [];
    const draw = () => {
      rows.innerHTML = sel.map((s, i) => `<div class="opt-row"><p class="opt-row__name">${name} - ${s.size}</p><div class="qty"><button type="button" data-q="${i}" data-v="-1" aria-label="${s.size} 수량 줄이기">−</button><input type="text" inputmode="numeric" value="${s.qty}" data-qi="${i}" aria-label="${s.size} 수량"><button type="button" data-q="${i}" data-v="1" aria-label="${s.size} 수량 늘리기">+</button><button type="button" class="del" data-x="${i}" aria-label="${s.size} 선택 삭제">×</button></div><p class="opt-row__price">${won(price * s.qty)}</p></div>`).join('');
      const n = sel.reduce((a, s) => a + s.qty, 0);
      total.innerHTML = n ? `<b>TOTAL: ${won(price * n)}</b> (${n}개)` : '<b>TOTAL: 0</b> (0 Items)';
      $$('.sizes button', pdp).forEach(b => b.setAttribute('aria-pressed', sel.some(s => s.size === b.dataset.size) ? 'true' : 'false'));
    };
    $$('.sizes button', pdp).forEach(b => b.addEventListener('click', () => {
      if (b.getAttribute('aria-disabled') === 'true') return;
      if (sel.some(s => s.size === b.dataset.size)) { alert('이미 선택되어 있는 옵션입니다.'); return; }
      sel.push({ size: b.dataset.size, qty: 1 }); draw();
    }));
    rows.addEventListener('click', e => {
      const q = e.target.closest('[data-q]'), x = e.target.closest('[data-x]');
      if (q) { const s = sel[+q.dataset.q]; s.qty = Math.max(1, s.qty + +q.dataset.v); draw(); }
      if (x) { sel.splice(+x.dataset.x, 1); draw(); }
    });
    rows.addEventListener('change', e => { const i = e.target.dataset.qi; if (i !== undefined) { sel[+i].qty = Math.max(1, parseInt(e.target.value, 10) || 1); draw(); } });
    const need = () => { if (!sel.length) { alert('필수 옵션을 선택해주세요.'); return false; } return true; };
    $('.js-order', pdp).addEventListener('click', () => { if (!need()) return; sel.forEach(s => window.VEKRA_CART.add(slug, s.size, s.qty)); location.href = ROOT + 'cart/index.html'; });
    $('.js-add', pdp).addEventListener('click', () => { if (!need()) return; sel.forEach(s => window.VEKRA_CART.add(slug, s.size, s.qty)); sel = []; draw(); window.VEKRA_CART.open(); });
    draw();
    // 모바일 사진 넘김
    const strip = $('.pdp__imgs', pdp), dots = $$('.pdp__dots button', pdp);
    const idx = () => Math.round(strip.scrollLeft / strip.clientWidth);
    const go = i => strip.scrollTo({ left: i * strip.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    strip.addEventListener('scroll', () => { const i = idx(); dots.forEach((d, j) => d.setAttribute('aria-current', i === j ? 'true' : 'false')); }, { passive: true });
    dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
    $$('.pdp__media .arrow', pdp).forEach(a => a.addEventListener('click', () => go(Math.max(0, Math.min(dots.length - 1, idx() + (a.classList.contains('arrow--next') ? 1 : -1))))));
  }

  /* ── 아코디언 ── */
  $$('.acc__btn, .country__btn').forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-expanded') !== 'true';
    // 상세 정보는 원본처럼 한 번에 하나만 펼친다
    if (on && b.classList.contains('acc__btn')) $$('.acc__btn', b.closest('.acc')).forEach(o => { if (o !== b) { o.setAttribute('aria-expanded', 'false'); $('#' + o.getAttribute('aria-controls')).hidden = true; } });
    b.setAttribute('aria-expanded', on ? 'true' : 'false');
    $('#' + b.getAttribute('aria-controls')).hidden = !on;
  }));

  /* ── 탭 ── */
  $$('[role="tablist"]').forEach(list => {
    const tabs = $$('[role="tab"]', list);
    const pick = (t, focus) => { tabs.forEach(o => { const on = o === t; o.setAttribute('aria-selected', on ? 'true' : 'false'); o.tabIndex = on ? 0 : -1; $('#' + o.getAttribute('aria-controls')).hidden = !on; }); focus && t.focus(); };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => pick(t));
      t.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); pick(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true); } });
    });
  });

  /* ── 라이트박스 ── */
  const lb = $('.lb');
  if (lb) {
    const btns = $$('.gallery button'); let cur = 0, opener = null;
    const img = $('.lb__fig img', lb), cnt = $('.lb__count', lb);
    const show = i => { cur = (i + btns.length) % btns.length; const b = btns[cur]; img.src = b.dataset.full; img.alt = b.dataset.alt; img.width = +b.dataset.w; img.height = +b.dataset.h; cnt.textContent = `${cur + 1} of ${btns.length}`; };
    const open = i => { opener = btns[i]; show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); lb.inert = false; document.documentElement.classList.add('no-scroll'); setTimeout(() => $('.lb__close', lb).focus(), 50); };
    const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); lb.inert = true; document.documentElement.classList.remove('no-scroll'); opener && opener.focus(); };
    lb.inert = true;
    btns.forEach((b, i) => b.addEventListener('click', () => open(i)));
    $('.lb__close', lb).addEventListener('click', close);
    $('.lb__nav--prev', lb).addEventListener('click', () => show(cur - 1));
    $('.lb__nav--next', lb).addEventListener('click', () => show(cur + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'Tab') { const f = $$('button', lb); const a = f.indexOf(document.activeElement); if (e.shiftKey && a <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && a === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
  }

  /* ── 폼 검증 ── */
  const rules = {
    required: v => v.trim() ? '' : null,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : '이메일 형식이 아닙니다.',
    id: v => /^[a-z0-9]{4,16}$/.test(v.trim()) ? '' : '아이디는 영문 소문자·숫자 4~16자입니다.',
    pw: v => v.length >= 8 ? '' : '비밀번호는 8자 이상입니다.',
    same: (v, f) => v === f.elements.password.value ? '' : '비밀번호가 일치하지 않습니다.',
  };
  $$('form.js-validate').forEach(f => {
    f.noValidate = true;
    f.addEventListener('submit', e => {
      e.preventDefault(); let first = null;
      $$('[data-label]', f).forEach(inp => {
        const err = $('#' + inp.getAttribute('aria-describedby'), f); let msg = '';
        if (!inp.value.trim()) msg = `${inp.dataset.label} 항목은 필수 입력값입니다.`;
        else if (inp.dataset.rule) msg = rules[inp.dataset.rule](inp.value, f) || '';
        inp.setAttribute('aria-invalid', msg ? 'true' : 'false'); if (err) err.textContent = msg; if (msg && !first) first = inp;
      });
      const m = $('.form-msg', f);
      if (first) { first.focus(); if (m) m.textContent = ''; } else if (m) m.textContent = f.dataset.ok;
    });
  });
  $$('.nl').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); const i = $('input', f), m = f.nextElementSibling, ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim());
    i.setAttribute('aria-invalid', ok ? 'false' : 'true'); m.classList.toggle('is-ok', ok);
    m.textContent = !i.value.trim() ? '이메일을 입력해 주세요.' : ok ? '구독 신청이 접수되었습니다.' : '이메일 형식이 아닙니다.';
    if (!ok) i.focus();
  }));

  /* ── 검색 결과 ── */
  const sp = $('.search-page');
  if (sp) {
    const q = (new URLSearchParams(location.search).get('keyword') || '').trim();
    const inp = $('input', sp); inp.value = q;
    const cards = $$('.prd-grid > li', sp); let n = 0;
    cards.forEach(li => { const hit = !q || li.dataset.name.toLowerCase().includes(q.toLowerCase()); li.hidden = !hit; if (hit) n++; });
    $('.search-page__count', sp).textContent = q ? `‘${q}’ 검색 결과 ${n}개` : `전체 상품 ${n}개`;
    $('.empty', sp).hidden = n > 0;
  }
})();
