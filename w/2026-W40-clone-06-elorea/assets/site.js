/* 결 GYEOL — ELOREA 모작 동작. 외부 라이브러리 없음 */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('is-ready')));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const won = (n) => '₩' + Number(n).toLocaleString('ko-KR');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SCRIPT = document.currentScript.getAttribute('src');
  const ROOT = SCRIPT.replace(/assets\/site\.js.*$/, '');
  const ASSET = ROOT + 'assets/';
  const url = (p) => ROOT + p.replace(/^\//, '') + (p.endsWith('/') ? 'index.html' : '');
  const DATA = window.GYEOL || { products: [], frag: [] };
  const P = Object.fromEntries(DATA.products.map((p) => [p.slug, p]));
  const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* 저장 불가 */ } } };

  // ── 공통 ──
  const toastEl = $('[data-toast]');
  let toastT;
  function toast(msg) { if (!toastEl) return; toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2600); }
  let locks = 0;
  const lock = () => { if (locks++ === 0) document.body.classList.add('is-locked'); };
  const unlock = () => { if (--locks <= 0) { locks = 0; document.body.classList.remove('is-locked'); } };
  const focusables = (el) => $$('a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])', el).filter((e) => !e.closest('[hidden]') && e.offsetParent !== null);
  function trap(el, e) {
    if (e.key !== 'Tab') return;
    const f = focusables(el); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // 이미지 페이드 (원본: 로드 후 opacity 500ms ease-in)
  // 아직 안 받은 사진만 화면에 들어올 때 잠깐 투명 → 로드 후 페이드
  const pend = (img) => { if (img.complete && img.naturalWidth) return; img.classList.add('is-pending'); const done = () => img.classList.remove('is-pending'); img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); };
  const imgObs = 'IntersectionObserver' in window ? new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { pend(en.target); imgObs.unobserve(en.target); } }), { rootMargin: '200px' }) : null;
  const markImg = (img) => (imgObs ? imgObs.observe(img) : null);
  $$('img.fade-img').forEach(markImg);
  // data-src 자리에 사진을 필요할 때 넣는다 (가려진 사진을 미리 싣지 않음)
  const ensureImg = (el) => { if (!el || !el.dataset.src || el.querySelector('img')) return; const im = new Image(); im.className = 'fade-img ' + (el.dataset.cls || ''); im.alt = ''; im.decoding = 'async'; im.src = el.dataset.src; el.appendChild(im); pend(im); };
  // 카드 호버 — 두 번째 사진 250ms ease-in-out
  const hoverImg = (c) => { const m = c.querySelector('[data-img2]'); if (!m) return; let im = m.querySelector('.card__img2'); if (!im) { im = new Image(); im.className = 'card__img2'; im.alt = ''; im.src = m.dataset.img2; m.appendChild(im); void im.offsetWidth; } return im; };
  document.addEventListener('pointerover', (e) => { const c = e.target.closest('.card'); if (!c || c.contains(e.relatedTarget)) return; const im = hoverImg(c); if (im) requestAnimationFrame(() => im.classList.add('is-on')); });
  document.addEventListener('pointerout', (e) => { const c = e.target.closest('.card'); if (!c || c.contains(e.relatedTarget)) return; c.querySelector('.card__img2')?.classList.remove('is-on'); });
  document.addEventListener('focusin', (e) => { const a = e.target.closest('.card__link'); if (a) { const im = hoverImg(a.closest('.card')); if (im) requestAnimationFrame(() => im.classList.add('is-on')); } });
  document.addEventListener('focusout', (e) => { const a = e.target.closest('.card__link'); if (a) a.querySelector('.card__img2')?.classList.remove('is-on'); });

  // AOS — 뷰포트 진입 시 .aos-animate
  const aosObs = 'IntersectionObserver' in window ? new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { const t = en.target; if (t.classList.contains('img-reveal') && !RM) { t.classList.add('is-armed'); void t.offsetWidth; } t.classList.add('aos-animate'); aosObs.unobserve(t); } }), { rootMargin: '0px 0px -40px 0px' }) : null;
  const aos = (root = document) => $$('[data-aos]', root).forEach((el) => (aosObs ? aosObs.observe(el) : el.classList.add('aos-animate')));
  aos();

  // ── 공지 바: 6초 자동, 800ms 페이드, 화살표 ──
  const ann = $('[data-announce]');
  if (ann) {
    const slides = $$('.announce__slide', ann); let i = 0, t;
    const show = (n) => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', String(k !== i)); $$('a', s).forEach((a) => (a.tabIndex = k === i ? 0 : -1)); }); };
    const play = () => { clearInterval(t); if (!RM) t = setInterval(() => show(i + 1), 6000); };
    $('.announce__arrow--prev', ann).addEventListener('click', () => { show(i - 1); play(); });
    $('.announce__arrow--next', ann).addEventListener('click', () => { show(i + 1); play(); });
    ann.addEventListener('mouseenter', () => clearInterval(t)); ann.addEventListener('mouseleave', play);
    ann.addEventListener('focusin', () => clearInterval(t)); ann.addEventListener('focusout', play);
    play();
  }

  // ── 헤더: 투명 → 스크롤 시 배경 (원본 ::after opacity 200ms) ──
  const hdr = $('[data-hdr]');
  const onScroll = () => {
    const y = scrollY;
    if (hdr) hdr.classList.toggle('is-solid', y > 36);
    const tt = $('[data-to-top]'); if (tt) tt.classList.toggle('is-visible', y > 700);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  $('[data-to-top]')?.addEventListener('click', () => { scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); $('#main').focus({ preventScroll: true }); });

  // ── 메가 메뉴 (호버·포커스로 열림, ESC·바깥 클릭으로 닫힘) ──
  const megas = $$('[data-mega]');
  const closeMega = (m, returnFocus) => { if (!m.classList.contains('is-open')) return; m.classList.remove('is-open'); const a = $('.nav__link', m); a.setAttribute('aria-expanded', 'false'); if (returnFocus) a.focus(); };
  const openMega = (m) => { megas.forEach((o) => o !== m && closeMega(o)); m.classList.add('is-open'); $('.nav__link', m).setAttribute('aria-expanded', 'true'); };
  megas.forEach((m) => {
    let t;
    m.addEventListener('mouseenter', () => { clearTimeout(t); openMega(m); });
    m.addEventListener('mouseleave', () => { t = setTimeout(() => closeMega(m), 120); });
    m.addEventListener('focusin', () => openMega(m));
    m.addEventListener('focusout', (e) => { if (!m.contains(e.relatedTarget)) closeMega(m); });
    m.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeMega(m, true); }
      if (e.key === 'ArrowDown' && e.target.classList.contains('nav__link')) { e.preventDefault(); openMega(m); $('.mega a', m)?.focus(); }
    });
  });
  $$('.nav__item:not([data-mega])').forEach((li) => li.addEventListener('mouseenter', () => megas.forEach((m) => closeMega(m))));
  document.addEventListener('click', (e) => megas.forEach((m) => !m.contains(e.target) && closeMega(m)));

  // ── 드로어 공통 ──
  let openStack = [];
  function openDrawer(el, trigger) {
    if (!el || !el.hidden) return;
    el._trigger = trigger || document.activeElement;
    el.hidden = false; void el.offsetWidth; el.classList.add('is-open'); el.classList.remove('is-closing');
    lock(); openStack.push(el);
    if (trigger && trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'true');
    $$('[aria-controls="' + el.id + '"][aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    // 원본: 드로어 안 항목 cartDrawerItemsFadeInLeft 500ms, 50ms 스태거
    $$('.fgroup, .mm__list > li, .cd__item', el).forEach((it, k) => { it.classList.remove('is-anim-item', 'is-anim-item-r'); void it.offsetWidth; it.style.setProperty('--d', (250 + k * 50) + 'ms'); it.classList.add(el.classList.contains('drawer--cart') ? 'is-anim-item' : 'is-anim-item-r'); });
    setTimeout(() => { const f = focusables($('.drawer__inner', el) || el); (f[0] || el).focus(); }, 30);
  }
  function closeDrawer(el) {
    if (!el || el.hidden || el.classList.contains('is-closing')) return;
    el.classList.remove('is-open'); el.classList.add('is-closing');
    const dur = el.classList.contains('drawer--filter') ? 600 : 300;
    setTimeout(() => { el.hidden = true; el.classList.remove('is-closing'); }, RM ? 0 : dur);
    unlock(); openStack = openStack.filter((x) => x !== el);
    $$('[aria-controls="' + el.id + '"][aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    el._trigger?.focus?.();
  }
  $$('.drawer').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d) closeDrawer(d); if (e.target.closest('[data-close-drawer]')) closeDrawer(d); });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeDrawer(d); } else trap(d, e); });
  });

  // ── 모바일 메뉴 ──
  const menu = $('#menu-drawer');
  $$('[data-open-menu]').forEach((b) => b.addEventListener('click', () => openDrawer(menu, b)));
  if (menu) {
    $$('[data-mm-open]', menu).forEach((b) => b.addEventListener('click', () => { const sub = document.getElementById(b.getAttribute('aria-controls')); sub.hidden = false; b.setAttribute('aria-expanded', 'true'); $('[data-mm-back]', sub).focus(); }));
    $$('[data-mm-back]', menu).forEach((b) => b.addEventListener('click', () => { const sub = b.closest('.mm__sub'); sub.hidden = true; const opener = $(`[aria-controls="${sub.id}"]`, menu); opener.setAttribute('aria-expanded', 'false'); opener.focus(); }));
  }

  // ── 검색 팝다운 + 예측 결과 ──
  const sp = $('#search-pop');
  const underlay = $('[data-underlay]');
  const spInput = $('#search-pop-input');
  const spRes = $('#search-pop-results');
  let spTrigger;
  const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, '');
  const matches = (p, q) => { const n = norm(q); if (!n) return true; return norm(p.title).includes(n) || norm(p.sub).includes(n) || norm(p.slug.replace(/-/g, '')).includes(n); };
  const hl = (s, q) => { const i = s.toLowerCase().indexOf(q.toLowerCase().trim()); return i < 0 || !q.trim() ? s : `${s.slice(0, i)}<mark>${s.slice(i, i + q.trim().length)}</mark>${s.slice(i + q.trim().length)}`; };
  function openSearch(b) {
    spTrigger = b; sp.hidden = false; sp.classList.toggle('is-top', scrollY > 36); void sp.offsetWidth; sp.classList.add('is-open');
    underlay.hidden = false; void underlay.offsetWidth; underlay.classList.add('is-on');
    $$('[data-open-search]').forEach((x) => x.setAttribute('aria-expanded', 'true'));
    setTimeout(() => spInput.focus(), 50);
  }
  function closeSearch() {
    if (sp.hidden) return; sp.classList.remove('is-open'); underlay.classList.remove('is-on');
    $$('[data-open-search]').forEach((x) => x.setAttribute('aria-expanded', 'false'));
    setTimeout(() => { sp.hidden = true; underlay.hidden = true; }, RM ? 0 : 500);
    spTrigger?.focus();
  }
  $$('[data-open-search]').forEach((b) => b.addEventListener('click', () => (sp.hidden ? openSearch(b) : closeSearch())));
  $('[data-close-search]')?.addEventListener('click', closeSearch);
  underlay?.addEventListener('click', closeSearch);
  sp?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
    const opts = $$('.sp-item', spRes);
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && opts.length) {
      e.preventDefault(); let k = opts.findIndex((o) => o.getAttribute('aria-selected') === 'true');
      k = e.key === 'ArrowDown' ? Math.min(k + 1, opts.length - 1) : Math.max(k - 1, 0);
      opts.forEach((o, j) => o.setAttribute('aria-selected', String(j === k))); opts[k].focus();
    }
  });
  const renderPredict = () => {
    const q = spInput.value.trim();
    if (!q) { spRes.hidden = true; spInput.setAttribute('aria-expanded', 'false'); return; }
    const found = DATA.products.filter((p) => matches(p, q));
    const st = $('[data-search-status]'); if (st) st.textContent = `검색 결과 ${found.length}개`;
    spRes.hidden = false; spInput.setAttribute('aria-expanded', 'true');
    spRes.innerHTML = found.length
      ? `<ul>${found.slice(0, 8).map((p) => `<li><a class="sp-item" role="option" aria-selected="false" href="${url('/products/' + p.slug + '/')}"><img src="${ASSET + p.img}" alt="" loading="lazy"><span>${hl(p.title, q)}<small>${won(p.price)}</small></span></a></li>`).join('')}</ul><a class="search-pop__all" href="${url('/search/')}?q=${encodeURIComponent(q)}">‘${q.replace(/</g, '')}’ 전체 결과 ${found.length}개 보기</a>`
      : `<p class="search-pop__none">‘${q.replace(/</g, '')}’에 맞는 상품이 없습니다.</p>`;
  };
  spInput?.addEventListener('input', renderPredict);
  $('.search-pop__form')?.addEventListener('reset', () => setTimeout(() => { renderPredict(); spInput.focus(); }));

  // ── 장바구니 ──
  const KEY = 'gyeol-cart-v1';
  let cart = store.get(KEY, []);
  const FREE = 40000;
  const subtotal = () => cart.filter((l) => !l.gift).reduce((s, l) => s + l.price * l.qty, 0);
  const count = () => cart.reduce((s, l) => s + l.qty, 0);
  const cartDrawer = $('#cart-drawer');
  function saveCart() { store.set(KEY, cart); renderCart(); }
  function lineHTML(l, i) {
    return `<div class="cd__item" data-line="${i}"><img src="${ASSET + l.img}" alt=""><div><a class="cd__name" href="${url('/products/' + l.slug + '/')}">${l.title}</a><p class="cd__meta">${l.variant}${l.gift ? ' · 증정' : ''}</p><p class="cd__meta">${l.gift ? '₩0' : won(l.price)}</p>
      ${l.gift ? '' : `<div class="cd__qty"><button type="button" aria-label="${l.title} 수량 줄이기" data-dec>−</button><label class="sr-only" for="q-${i}">수량</label><input id="q-${i}" type="number" min="1" max="99" value="${l.qty}" data-qty-in><button type="button" aria-label="${l.title} 수량 늘리기" data-inc>+</button></div>`}
      <button class="cd__remove" type="button" data-remove>삭제</button></div><p class="cd__line">${l.gift ? '₩0' : won(l.price * l.qty)}</p></div>`;
  }
  function renderCart() {
    const n = count(), sub = subtotal();
    $$('[data-cart-count]').forEach((c) => { c.textContent = n; c.hidden = n === 0; });
    $$('[data-open-cart]').forEach((a) => a.setAttribute('aria-label', `장바구니, ${n}개`));
    $$('[data-cart-count-text]').forEach((c) => (c.textContent = `(${n})`));
    if (cartDrawer) {
      $('[data-cart-items]', cartDrawer).innerHTML = cart.map(lineHTML).join('');
      $('[data-cart-empty]', cartDrawer).hidden = n > 0;
      $('[data-cart-foot]', cartDrawer).hidden = n === 0;
      $('[data-ship]', cartDrawer).hidden = n === 0;
      $('[data-cart-total]', cartDrawer).textContent = won(sub) + ' KRW';
      $('[data-ship-text]', cartDrawer).textContent = sub >= FREE ? '무료 배송이 적용되었습니다.' : `${won(FREE - sub)} 더 담으면 무료 배송`;
      $('[data-ship-bar]', cartDrawer).style.transform = `scaleX(${Math.min(1, sub / FREE)})`;
    }
    const cp = $('[data-cartpage-body]');
    if (cp) {
      cp.innerHTML = n
        ? `<table class="cp__table"><thead><tr><th>상품</th><th>수량</th><th>합계</th></tr></thead><tbody>${cart.map((l, i) => `<tr data-line="${i}"><td><div class="cp__prod"><img src="${ASSET + l.img}" alt=""><div><a href="${url('/products/' + l.slug + '/')}">${l.title}</a><p class="cd__meta">${l.variant}</p><p class="cd__meta">${l.gift ? '₩0 · 증정' : won(l.price)}</p></div></div></td><td>${l.gift ? '1' : `<div class="cd__qty"><button type="button" aria-label="수량 줄이기" data-dec>−</button><label class="sr-only" for="cq-${i}">수량</label><input id="cq-${i}" type="number" min="1" max="99" value="${l.qty}" data-qty-in><button type="button" aria-label="수량 늘리기" data-inc>+</button></div>`}<button class="cd__remove" type="button" data-remove>삭제</button></td><td>${l.gift ? '₩0' : won(l.price * l.qty)}</td></tr>`).join('')}</tbody></table>
          <div class="cp__sum"><p class="cd__fine">${sub >= FREE ? '무료 배송이 적용되었습니다.' : `${won(FREE - sub)} 더 담으면 무료 배송`}</p><div class="cd__sum"><span>소계</span><strong>${won(sub)} KRW</strong></div><button class="btn btn--solid btn--full" type="button" data-checkout>CHECK OUT</button><p class="cd__fine" role="status" data-checkout-msg>배송비·할인은 결제 단계에서 계산됩니다.</p></div>`
        : `<div class="cp__empty"><p>장바구니가 비어 있습니다.</p><div><a class="btn btn--outline btn--dark" href="${url('/')}">HOME</a><a class="btn btn--outline btn--dark" href="${url('/collections/all/')}">CATALOG</a></div></div>`;
    }
  }
  function syncGifts() {
    const sub = subtotal();
    cart = cart.filter((l) => !l.gift || sub >= l.gift);
    const need = [100000, 200000].filter((t) => sub >= t && !cart.some((l) => l.gift === t) && !store.get('gyeol-gift-skip-' + t, false));
    if (need.length) openGift(need[0]);
  }
  function addToCart(slug, vIndex = 0, qty = 1, extra = '', opts = {}) {
    const p = P[slug]; if (!p) return;
    const [variant, price] = p.variants[vIndex] || p.variants[0];
    const vName = extra || variant;
    const ex = cart.find((l) => l.slug === slug && l.variant === vName && !l.gift);
    if (ex) ex.qty += qty; else cart.push({ slug, title: p.title, variant: vName, price, qty, img: p.img });
    saveCart();
    $$('[data-cart-count]').forEach((c) => { c.classList.remove('is-bump'); void c.offsetWidth; c.classList.add('is-bump'); });
    if (!opts.silent) openDrawer(cartDrawer, $('[data-open-cart]'));
    setTimeout(syncGifts, opts.silent ? 0 : 350);
  }
  cartDrawer && renderCart();
  $$('[data-open-cart]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); openDrawer(cartDrawer, a); }));
  document.addEventListener('click', (e) => {
    const row = e.target.closest('[data-line]'); if (!row) return;
    const i = +row.dataset.line; const l = cart[i]; if (!l) return;
    if (e.target.closest('[data-inc]')) l.qty = Math.min(99, l.qty + 1);
    else if (e.target.closest('[data-dec]')) l.qty = Math.max(1, l.qty - 1);
    else if (e.target.closest('[data-remove]')) { cart.splice(i, 1); }
    else return;
    const focusSel = e.target.closest('[data-inc]') ? '[data-inc]' : e.target.closest('[data-dec]') ? '[data-dec]' : null;
    cart = cart.filter((x) => !x.gift || subtotal() >= x.gift);
    saveCart();
    const again = focusSel && $(`[data-line="${i}"] ${focusSel}`, row.closest('.drawer, [data-cart-page]') || document); again ? again.focus() : $('[data-close-drawer]', cartDrawer)?.focus();
  });
  document.addEventListener('change', (e) => {
    if (!e.target.matches('[data-qty-in]')) return;
    const i = +e.target.closest('[data-line]').dataset.line; const v = Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1));
    cart[i].qty = v; saveCart();
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-checkout]'); if (!b) return;
    const m = b.parentElement.querySelector('[data-checkout-msg]');
    if (m) m.textContent = '모작 사이트라 결제는 진행되지 않습니다.';
  });

  // 증정 선택 모달 (원본: 10만·20만 원 도달 시 뜨는 증정 선택 창)
  const gm = $('#gift-modal');
  function openGift(t) {
    if (!gm || !gm.hidden) return;
    const list = DATA.frag.slice(0, 6);
    $('[data-gift-title]', gm).textContent = `장바구니 금액 ${t / 10000}만 원 도달`;
    $('[data-gift-sub]', gm).textContent = t === 100000 ? '증정 2mL 1종을 골라 주세요' : '증정 10mL 1종을 골라 주세요';
    $('[data-gift-grid]', gm).innerHTML = list.map((f) => `<li><img src="${ASSET + f.img}" alt=""><p>${f.ko} | ${f.enko} ${t === 100000 ? '2ML' : '10ML'}</p><button class="btn btn--solid" type="button" data-gift-pick="${f.slug}">선택하기</button></li>`).join('');
    gm.dataset.t = t; gm._trigger = document.activeElement; gm.hidden = false; lock();
    setTimeout(() => $('[data-gift-pick]', gm)?.focus(), 30);
  }
  function closeGift(skip) {
    if (!gm || gm.hidden) return; gm.hidden = true; unlock();
    if (skip) store.set('gyeol-gift-skip-' + gm.dataset.t, true);
    (gm._trigger && document.body.contains(gm._trigger) ? gm._trigger : $('[data-close-drawer]', cartDrawer))?.focus();
  }
  gm?.addEventListener('click', (e) => {
    if (e.target === gm || e.target.closest('[data-close-modal]')) return closeGift(true);
    const b = e.target.closest('[data-gift-pick]'); if (!b) return;
    const f = DATA.frag.find((x) => x.slug === b.dataset.giftPick); const t = +gm.dataset.t;
    cart.push({ slug: f.slug, title: `${f.ko} | ${f.enko} ${t === 100000 ? '2ML' : '10ML'}`, variant: t === 100000 ? '2mL' : '10mL', price: 0, qty: 1, img: f.img, gift: t });
    saveCart(); closeGift(false); toast('증정품을 담았습니다.'); setTimeout(syncGifts, 100);
  });
  gm?.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeGift(true); else trap(gm, e); });

  // ── 퀵 애드 (카드 '장바구니 담기') ──
  const qa = $('#qa-drawer');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-qa]'); if (!b) return;
    const p = P[b.dataset.qa]; if (!p) return;
    if (p.build) { location.href = url('/products/' + p.slug + '/'); return; }
    if (p.variants.length === 1) {
      b.classList.add('is-loading'); setTimeout(() => { b.classList.remove('is-loading'); addToCart(p.slug, 0, 1); }, RM ? 0 : 450); return;
    }
    $('[data-qa-body]', qa).innerHTML = `<img class="qa__img" src="${ASSET + p.img}" alt=""><div class="qa__body"><h2 class="qa__title" id="qa-title">${p.title}</h2><p class="qa__price" data-qa-price>${won(p.variants[0][1])}</p><p class="qa__ship">배송비는 결제 단계에서 계산됩니다.</p>
      <fieldset class="qa__opts"><legend>옵션</legend><div class="qa__vlist">${p.variants.map(([v, pr], i) => `<label class="qa__v"><input type="radio" name="qa-v" value="${i}"${i ? '' : ' checked'} data-price="${pr}"><span>${v}</span></label>`).join('')}</div></fieldset>
      <button class="btn btn--solid btn--full qa__add" type="button" data-qa-add="${p.slug}"><span class="btn__text">장바구니 담기</span><span class="btn__loader" aria-hidden="true"></span></button></div>`;
    $$('.qa__body > *', qa).forEach((el, k) => { el.style.setProperty('--d', (250 + k * 50) + 'ms'); el.classList.add('is-anim-item'); });
    openDrawer(qa, b);
  });
  qa?.addEventListener('change', (e) => { if (e.target.name === 'qa-v') $('[data-qa-price]', qa).textContent = won(e.target.dataset.price); });
  qa?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-qa-add]'); if (!b) return;
    const v = +$('input[name="qa-v"]:checked', qa).value; b.classList.add('is-loading');
    setTimeout(() => { closeDrawer(qa); setTimeout(() => addToCart(b.dataset.qaAdd, v, 1), RM ? 0 : 320); }, RM ? 0 : 450);
  });

  // ── 탭 (역할 tab — 클릭·←→·Home·End) ──
  $$('[role="tablist"]').forEach((list) => {
    if (list.closest('[data-gallery]') || list.closest('[data-dots-slider]')) return;
    const tabs = $$('[role="tab"]', list);
    const select = (t, focus) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; const pnl = document.getElementById(x.getAttribute('aria-controls')); if (pnl) pnl.hidden = !on; if (on && pnl) aos(pnl); });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (k === undefined) return; e.preventDefault(); select(tabs[(k + tabs.length) % tabs.length], true);
      });
    });
  });

  // ── 가로 슬라이더 ──
  // 한 칸씩 넘기는 슬라이더. 보이는 칸만 그린다 (화면 밖 칸은 hidden)
  $$('[data-slider]').forEach((s) => {
    const tr = $('[data-track]', s), prev = $('[data-prev]', s), next = $('[data-next]', s);
    const cells = [...tr.children]; let i = 0;
    const per = () => parseInt(getComputedStyle(s).getPropertyValue('--per'), 10) || 4;
    const show = (n, dir = 0) => {
      const k = per(); i = Math.max(0, Math.min(n, cells.length - k));
      cells.forEach((c, j) => { const on = j >= i && j < i + k; const was = !c.hidden; c.hidden = !on; c.classList.remove('is-in'); if (on && !was && dir && !RM) { c.style.setProperty('--from', dir > 0 ? '30px' : '-30px'); void c.offsetWidth; c.classList.add('is-in'); aos(c); } });
      prev.disabled = i === 0; next.disabled = i >= cells.length - k;
      s.setAttribute('data-pos', `${i + 1}`);
    };
    prev.addEventListener('click', () => show(i - 1, -1));
    next.addEventListener('click', () => show(i + 1, 1));
    s.addEventListener('keydown', (e) => { if (e.target.closest('input, select')) return; if (e.key === 'ArrowRight' && e.target.closest('.card, .tabcol__intro')) { show(i + 1, 1); } if (e.key === 'ArrowLeft' && e.target.closest('.card, .tabcol__intro')) { show(i - 1, -1); } });
    addEventListener('resize', () => show(i)); show(0);
  });

  // ── 히어로 크로스페이드 (원본 영상 → 정지 사진 3장) ──
  $$('[data-crossfade]').forEach((w) => {
    const sl = $$('.hero__slide', w); let i = 0;
    if (RM || sl.length < 2) return;
    ensureImg(sl[1]);
    setInterval(() => { sl[i].classList.remove('is-on'); i = (i + 1) % sl.length; ensureImg(sl[i]); sl[i].classList.add('is-on'); ensureImg(sl[(i + 1) % sl.length]); }, 5000);
  });

  // ── 상품 상세 ──
  const pdp = $('[data-product]');
  if (pdp) {
    const slug = pdp.dataset.slug; const p = P[slug];
    // 최근 본 상품
    const recent = store.get('gyeol-recent', []).filter((s) => s !== slug && P[s]);
    store.set('gyeol-recent', [slug, ...recent].slice(0, 8));
    const rp = $('[data-recent]');
    if (rp) rp.innerHTML = recent.length ? recent.slice(0, 4).map((s) => { const q = P[s]; return `<article class="card"><a class="card__link" href="${url('/products/' + s + '/')}"><div class="card__media"><img class="card__img fade-img is-loaded" src="${ASSET + q.img}" alt="${q.title}" loading="lazy"></div><div class="card__info"><h3 class="card__title">${q.title}</h3><p class="card__price">${won(q.price)}${q.variants.length > 1 ? ' 부터' : ''}</p></div></a></article>`; }).join('') : '<p class="grid__none">최근 본 상품이 없습니다.</p>';
    // 갤러리
    const g = $('[data-gallery]'); const slides = $$('.pdp__slide', g); const thumbs = $$('[data-g-to]', g); let gi = 0;
    const go = (n, focus) => { gi = (n + slides.length) % slides.length; ensureImg(slides[gi]); slides.forEach((s, k) => { s.classList.toggle('is-on', k === gi); s.setAttribute('aria-hidden', String(k !== gi)); }); thumbs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === gi)); t.tabIndex = k === gi ? 0 : -1; }); if (focus) thumbs[gi].focus(); };
    $('[data-g-prev]', g).addEventListener('click', () => go(gi - 1)); $('[data-g-next]', g).addEventListener('click', () => go(gi + 1));
    thumbs.forEach((t, k) => { t.addEventListener('click', () => go(k)); t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(gi + 1, true); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(gi - 1, true); } }); });
    let sx = null; const stage = $('.pdp__stage', g);
    stage.addEventListener('pointerdown', (e) => (sx = e.clientX)); stage.addEventListener('pointerup', (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 40) go(gi + (e.clientX < sx ? 1 : -1)); sx = null; });
    // 옵션·가격
    const form = $('[data-pform]', pdp);
    const priceOut = () => { const r = $('input[name="variant"]:checked', form); const v = r ? +r.value : 0; const pr = p.variants[v][1] * +$('[data-qty]', form).value; $$('[data-price-out], [data-price-out2]').forEach((o) => (o.textContent = won(pr))); const lab = $('[data-variant-label]', form); if (lab) lab.textContent = p.variants[v][0]; };
    form.addEventListener('change', priceOut);
    form.addEventListener('submit', (e) => {
      e.preventDefault(); const btn = $('[data-add]', form); if (btn.disabled) return;
      let extra = '';
      if (p.build) {
        const picks = $$('[data-build-pick]', form); const err = $('[data-build-err]', form);
        const empty = picks.filter((s) => !s.value);
        picks.forEach((s) => s.setAttribute('aria-invalid', String(!s.value)));
        if (empty.length) { err.textContent = `향 ${empty.length}개를 더 골라 주세요.`; empty[0].focus(); return; }
        err.textContent = ''; extra = picks.map((s) => s.value.split(' | ')[0]).join(' · ');
      }
      const r = $('input[name="variant"]:checked', form); const v = r ? +r.value : 0; const q = +$('[data-qty]', form).value;
      btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true');
      setTimeout(() => { btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); addToCart(slug, v, q, extra); }, RM ? 0 : 600);
    });
    // 하단 고정 바 — 담기 버튼이 화면 위로 사라지면 등장
    const sticky = $('[data-sticky-atc]'); const addBtn = $('[data-add]', form);
    if (sticky && 'IntersectionObserver' in window) new IntersectionObserver(([en]) => { const on = !en.isIntersecting && en.boundingClientRect.top < 0; sticky.classList.toggle('is-on', on); sticky.setAttribute('aria-hidden', String(!on)); $('[data-configure]', sticky).tabIndex = on ? 0 : -1; }).observe(addBtn);
    $('[data-configure]')?.addEventListener('click', () => { form.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' }); setTimeout(() => (focusables(form)[0] || addBtn).focus({ preventScroll: true }), RM ? 0 : 500); });
  }
  // 점 슬라이드쇼
  $$('[data-dots-slider]').forEach((w) => {
    const s = $$('.pslides__s', w), d = $$('.pslides__dots button', w); let i = 0, t;
    const go = (n, f) => { i = (n + s.length) % s.length; ensureImg(s[i]); s.forEach((x, k) => { x.classList.toggle('is-on', k === i); x.setAttribute('aria-hidden', String(k !== i)); }); d.forEach((x, k) => { x.setAttribute('aria-selected', String(k === i)); x.tabIndex = k === i ? 0 : -1; }); if (f) d[i].focus(); };
    d.forEach((b, k) => { b.addEventListener('click', () => { go(k); play(); }); b.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(i + 1, true); if (e.key === 'ArrowLeft') go(i - 1, true); }); });
    const play = () => { clearInterval(t); if (!RM) t = setInterval(() => go(i + 1), 5000); };
    w.addEventListener('mouseenter', () => clearInterval(t)); w.addEventListener('mouseleave', play); play();
  });

  // ── 필터 · 정렬 · 검색 결과 ──
  const gridEl = $('[data-grid]');
  const fform = $('[data-filter-form]');
  const srchPage = $('[data-search-page]');
  const qParam = new URLSearchParams(location.search).get('q') || '';
  let sortVal = 'manual';
  function applyGrid() {
    if (!gridEl) return;
    const cards = $$('[data-card]', gridEl);
    const fd = fform ? new FormData(fform) : new FormData();
    const avail = fd.getAll('avail'), sizes = fd.getAll('size'), fams = fd.getAll('fam');
    const pmin = +(fd.get('pmin') || 0), pmax = +(fd.get('pmax') || Infinity);
    let n = 0;
    cards.forEach((c) => {
      const d = c.dataset;
      const ok = (!avail.length || avail.includes(d.avail)) && (!sizes.length || d.sizes.split(',').some((s) => sizes.includes(s))) && (!fams.length || fams.includes(d.fam)) && +d.price >= pmin && +d.price <= pmax && (!srchPage || matches(P[d.slug] || { title: d.title }, qParam));
      c.hidden = !ok; if (ok) n++;
    });
    const cmp = { manual: (a, b) => a.dataset.order - b.dataset.order, best: (a, b) => b.dataset.sales - a.dataset.sales, az: (a, b) => a.dataset.title.localeCompare(b.dataset.title, 'ko'), za: (a, b) => b.dataset.title.localeCompare(a.dataset.title, 'ko'), plh: (a, b) => a.dataset.price - b.dataset.price, phl: (a, b) => b.dataset.price - a.dataset.price, old: (a, b) => a.dataset.date - b.dataset.date || a.dataset.order - b.dataset.order, new: (a, b) => b.dataset.date - a.dataset.date || a.dataset.order - b.dataset.order }[sortVal];
    cards.sort(cmp).forEach((c) => gridEl.appendChild(c));
    $$('[data-filter-count]').forEach((x) => (x.textContent = n));
    const st = $('[data-grid-status]'); if (st) st.textContent = `상품 ${n}개`;
    const em = $('[data-grid-empty]'); if (em) em.hidden = n > 0;
    const sc = $('[data-srch-count]'); if (sc) sc.textContent = qParam ? `‘${qParam}’ 검색 결과 ${n}개` : `전체 상품 ${n}개`;
    // URL 반영
    const u = new URLSearchParams(); if (qParam) u.set('q', qParam);
    avail.forEach((v) => u.append('avail', v)); sizes.forEach((v) => u.append('size', v)); fams.forEach((v) => u.append('fam', v));
    if (fform && (pmin > 0 || pmax < +$('[data-range]', fform).dataset.max)) { u.set('pmin', pmin); u.set('pmax', pmax); }
    if (sortVal !== 'manual') u.set('sort', sortVal);
    try { history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : '')); } catch { /* file:// 등 */ }
  }
  if (fform) {
    const range = $('[data-range]', fform), rmin = $('[data-rmin]', fform), rmax = $('[data-rmax]', fform), nmin = $('[data-nmin]', fform), nmax = $('[data-nmax]', fform), fill = $('[data-range-fill]', fform);
    const max = +range.dataset.max;
    const paint = () => { fill.style.left = (rmin.value / max) * 100 + '%'; fill.style.right = 100 - (rmax.value / max) * 100 + '%'; };
    rmin.addEventListener('input', () => { if (+rmin.value > +rmax.value) rmin.value = rmax.value; nmin.value = rmin.value; paint(); applyGrid(); });
    rmax.addEventListener('input', () => { if (+rmax.value < +rmin.value) rmax.value = rmin.value; nmax.value = rmax.value; paint(); applyGrid(); });
    nmin.addEventListener('change', () => { nmin.value = Math.max(0, Math.min(+nmin.value || 0, +nmax.value)); rmin.value = nmin.value; paint(); applyGrid(); });
    nmax.addEventListener('change', () => { nmax.value = Math.min(max, Math.max(+nmax.value || max, +nmin.value)); rmax.value = nmax.value; paint(); applyGrid(); });
    fform.addEventListener('change', (e) => { if (e.target.type === 'checkbox') applyGrid(); });
    $$('.fgroup__h button', fform).forEach((b) => b.addEventListener('click', () => { const open = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', String(!open)); document.getElementById(b.getAttribute('aria-controls')).hidden = open; }));
    $('[data-filter-reset]', fform)?.addEventListener('click', () => { fform.reset(); rmin.value = nmin.value = 0; rmax.value = nmax.value = max; paint(); applyGrid(); });
    // URL → 상태
    const u = new URLSearchParams(location.search);
    ['avail', 'size', 'fam'].forEach((k) => u.getAll(k).forEach((v) => { const c = $(`input[name="${k}"][value="${CSS.escape(v)}"]`, fform); if (c) c.checked = true; }));
    if (u.get('pmin')) { rmin.value = nmin.value = u.get('pmin'); } if (u.get('pmax')) { rmax.value = nmax.value = u.get('pmax'); }
    paint();
  }
  $$('[data-open-filter]').forEach((b) => b.addEventListener('click', () => openDrawer($('#filter-drawer'), b)));
  const sortEl = $('[data-sort]');
  if (sortEl) {
    const btn = $('.sort__btn', sortEl), list = $('.sort__list', sortEl), opts = $$('[data-sort-val]', list);
    const open = () => { list.hidden = false; btn.setAttribute('aria-expanded', 'true'); (opts.find((o) => o.getAttribute('aria-selected') === 'true') || opts[0]).focus(); };
    const close = (f) => { if (list.hidden) return; list.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (f) btn.focus(); };
    const pick = (o) => { opts.forEach((x) => x.setAttribute('aria-selected', String(x === o))); sortVal = o.dataset.sortVal; close(true); applyGrid(); };
    btn.addEventListener('click', () => (list.hidden ? open() : close()));
    opts.forEach((o, i) => { o.addEventListener('click', () => pick(o)); o.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(o); } if (e.key === 'ArrowDown') { e.preventDefault(); opts[Math.min(i + 1, opts.length - 1)].focus(); } if (e.key === 'ArrowUp') { e.preventDefault(); opts[Math.max(i - 1, 0)].focus(); } if (e.key === 'Escape') close(true); if (e.key === 'Tab') close(); }); });
    document.addEventListener('click', (e) => { if (!sortEl.contains(e.target)) close(); });
    const s0 = new URLSearchParams(location.search).get('sort'); const o0 = s0 && opts.find((o) => o.dataset.sortVal === s0); if (o0) { opts.forEach((x) => x.setAttribute('aria-selected', String(x === o0))); sortVal = s0; }
  }
  if (srchPage) {
    const inp = $('[data-srch-input]'); inp.value = qParam;
    const tg = $('[data-srch-toggle]');
    tg.addEventListener('click', () => { const mobile = matchMedia('(max-width: 989px)').matches; const shown = tg.getAttribute('aria-expanded') === 'true'; tg.setAttribute('aria-expanded', String(!shown)); srchPage.classList.toggle(mobile ? 'is-side-open' : 'is-side-hidden', mobile ? !shown : shown); $('span', tg).textContent = shown ? 'SHOW FILTERS' : 'HIDE FILTERS'; });
    if (matchMedia('(max-width: 989px)').matches) { tg.setAttribute('aria-expanded', 'false'); $('span', tg).textContent = 'SHOW FILTERS'; }
  }
  if (gridEl && (fform || sortEl || srchPage)) applyGrid();

  // ── 폼 검증 (전송하지 않음) ──
  $$('[data-form]').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault(); let first = null;
    $$('input, textarea', f).forEach((i) => {
      const err = document.getElementById(i.getAttribute('aria-describedby') || ''); let m = '';
      if (i.required && !i.value.trim()) m = i.type === 'email' ? '이메일을 입력해 주세요.' : '값을 입력해 주세요.';
      else if (i.type === 'email' && i.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value)) m = '이메일 형식을 확인해 주세요.';
      i.setAttribute('aria-invalid', String(!!m)); if (err) err.textContent = m; if (m && !first) first = i;
    });
    const msg = $('.form__msg', f);
    if (first) { first.focus(); if (msg) msg.textContent = ''; return; }
    if (msg) msg.textContent = '확인되었습니다. 모작 사이트라 실제로 전송하지 않습니다.';
    f.reset();
  }));

  // ── 나의 향 찾기 ──
  const qz = $('[data-quiz]');
  if (qz) {
    const QD = JSON.parse($('#quiz-data').textContent);
    const Q = QD.QUIZ; const total = Q.length + 1;
    const ans = {}; let step = 0;
    const start = $('[data-q-start]', qz), steps = $('[data-q-steps]', qz), stage = $('[data-q-stage]', qz), result = $('[data-q-result]', qz), bar = $('[data-q-bar]', qz), prog = $('.quiz__progress', qz), next = $('[data-q-next]', qz);
    const qtext = (q) => (typeof q.q === 'string' ? q.q : q.q[ans.who || 'self']);
    function render() {
      bar.style.transform = `scaleX(${(step + 1) / total})`; prog.setAttribute('aria-valuenow', String(step + 1));
      $$('[data-fam-icon]', qz).forEach((s) => s.classList.toggle('is-on', s.dataset.famIcon === ans.fam));
      next.hidden = false;
      if (step === Q.length) {
        next.textContent = '결과 보기';
        stage.innerHTML = `<div class="q-screen q-gate"><p class="q-h" id="q-h">추천 결과 확인</p><p class="q-gate__sub">휴대폰 번호를 입력하면 결과를 문자로도 보내 드려요.</p>
          <label class="sr-only" for="q-phone">휴대폰 번호</label><input class="q-input" id="q-phone" type="tel" inputmode="tel" placeholder="010-0000-0000" autocomplete="tel" aria-describedby="q-err"><p class="q-err" id="q-err" role="alert"></p></div>`;
        stage.insertAdjacentHTML('beforeend', '<button class="q-skip" type="button" data-q-skip>건너뛰기</button><p class="q-gate__fine">번호 입력 시 결과 안내와 이벤트 문자 수신에 동의하게 됩니다. 수신은 언제든 거부할 수 있습니다.</p>');
        $('#q-phone').focus(); return;
      }
      next.textContent = '다음으로';
      const q = Q[step];
      if (q.type === 'number') {
        stage.innerHTML = `<div class="q-screen"><label class="q-h" for="q-in" id="q-h" style="display:block">${qtext(q)}</label><input class="q-input" id="q-in" type="number" inputmode="numeric" min="14" max="99" placeholder="${q.ph}" value="${ans[q.id] || ''}" aria-describedby="q-err"><p class="q-err" id="q-err" role="alert"></p></div>`;
        $('#q-in').focus();
      } else {
        stage.innerHTML = `<fieldset class="q-screen"><legend class="q-h" id="q-h">${qtext(q)}</legend><div class="q-opts">${q.opts.map(([v, t]) => `<label class="q-opt${q.img ? ' q-opt--img' : ''}"><input type="radio" name="q-${q.id}" value="${v}"${ans[q.id] === v ? ' checked' : ''}><span${q.img ? ` style="background-image:url('${QD.FAM[v].q}')"` : ''}>${q.img ? `<b>${t}</b>` : t}</span></label>`).join('')}</div><p class="q-err" id="q-err" role="alert"></p></fieldset>`;
        ($(`input[name="q-${q.id}"]:checked`, stage) || $('input', stage)).focus();
      }
    }
    function validate() {
      const err = $('#q-err', stage);
      if (step === Q.length) {
        const v = $('#q-phone').value.replace(/\D/g, '');
        if (!v) { err.textContent = '휴대폰 번호를 입력해 주세요.'; $('#q-phone').setAttribute('aria-invalid', 'true'); return false; }
        if (!/^01[016789]\d{7,8}$/.test(v)) { err.textContent = '010으로 시작하는 10~11자리 번호를 입력해 주세요.'; $('#q-phone').setAttribute('aria-invalid', 'true'); return false; }
        return true;
      }
      const q = Q[step];
      if (q.type === 'number') {
        const inp = $('#q-in'); const v = inp.value.trim();
        const m = !v ? '값을 입력해 주세요.' : !/^\d+$/.test(v) || +v < 14 || +v > 99 ? '14~99 사이 숫자를 입력해 주세요.' : '';
        err.textContent = m; inp.setAttribute('aria-invalid', String(!!m)); if (m) { inp.focus(); return false; }
        ans[q.id] = v; return true;
      }
      const c = $(`input[name="q-${q.id}"]:checked`, stage);
      if (!c) { err.textContent = '하나를 골라 주세요.'; $('input', stage).focus(); return false; }
      ans[q.id] = c.value; return true;
    }
    function score(f) {
      let s = 0;
      if (f.fam === ans.fam) s += 10;
      s += { petal: { floral: 3 }, wood: { woody: 3 }, peel: { fresh: 3, floral: 1 }, resin: { warm: 3 }, soap: { fresh: 2 } }[ans.note]?.[f.fam] || 0;
      s += { spring: { floral: 2, fresh: 1 }, summer: { fresh: 2 }, autumn: { woody: 2, warm: 1 }, winter: { warm: 2, woody: 1 } }[ans.season]?.[f.fam] || 0;
      s -= Math.abs((f.proj || 3) - (+ans.proj + 0.5)) * 0.8;
      return s;
    }
    function showResult() {
      const ranked = [...DATA.frag].sort((a, b) => score(b) - score(a));
      const top = ranked[0], more = ranked.slice(1, 3);
      const fam = QD.FAM[top.fam];
      const seasonKo = { spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' }[ans.season];
      const projKo = { 1: '30cm 이내', 2: '약 60cm', 3: '약 1m', 4: '1m 이상' }[ans.proj];
      const lifeH = { 1: 2, 2: 3, 3: 4, 4: 6, 5: 8 }[top.life] || 4;
      steps.hidden = true; result.hidden = false;
      result.innerHTML = `<div class="qr__top" style="--g1:${fam.grad[2]};--g2:${fam.grad[0]};--g3:${fam.grad[1]};--g4:${fam.grad[1]}">
        <article class="qr__card" id="qr-card" aria-labelledby="qr-name"><div class="qr__card-top"><p class="qr__label">추천 결과</p><h2 class="qr__name" id="qr-name" tabindex="-1">${top.en.toUpperCase()}</h2><p class="qr__ko">${top.ko} | ${top.enko} 오 드 퍼퓸</p><div class="qr__icon">${QD.icons[top.fam]}</div><p class="qr__trait">${fam.ko} · ${seasonKo} · 발향 ${projKo}</p></div>
          <dl class="qr__card-body"><dt>TOP</dt><dd>${top.top}</dd><dt>HEART</dt><dd>${top.heart}</dd><dt>BASE</dt><dd>${top.base}</dd><dt>지속</dt><dd>피부에서 약 ${lifeH}시간</dd></dl>
          <div class="qr__card-foot"><svg class="wordmark" viewBox="0 0 132 20" aria-hidden="true">${$('.hdr__logo .wordmark').innerHTML}</svg></div></article>
        <div class="qr__actions"><button class="btn btn--outline btn--dark qr__save" type="button" data-q-save>결과 저장하기</button><button class="qr__retake" type="button" data-q-retake>다시 하기</button></div></div>
        <section class="qr__match" aria-labelledby="qr-m"><h2 id="qr-m">추천 향</h2><div class="qr__grid">${[top, ...more].map((f) => `<div class="qr__item"><a href="${url('/products/' + f.slug + '/')}"><img src="${ASSET + f.img}" alt=""><p>${f.ko} | ${f.enko} 오 드 퍼퓸</p></a><button class="btn btn--solid btn--small" type="button" data-q-add="${f.slug}">장바구니 담기</button></div>`).join('')}</div></section>
        <section class="qr__match" aria-labelledby="qr-r"><h2 id="qr-r">함께 보기</h2><div class="qr__grid"><div class="qr__item"><a href="${url('/products/discovery-set/')}"><img src="${ASSET + P['discovery-set'].img}" alt=""><p>${P['discovery-set'].title}</p></a><button class="btn btn--solid btn--small" type="button" data-qa="discovery-set">장바구니 담기</button></div></div></section>
        <section class="qr__visit" aria-labelledby="qr-v"><h2 id="qr-v">VISIT US</h2>${QD.stores.map((s) => `<div class="qr__store"><img src="${s.img}" alt="${s.ko} 스토어"><div><p>${s.addr.join('<br>')}</p><strong>${s.region}</strong><a href="${s.url}">매장 안내</a></div></div>`).join('')}</section>`;
      bar.style.transform = 'scaleX(1)';
      store.set('gyeol-quiz-last', { ...ans, top: top.slug });
      $('#qr-name').focus();
      scrollTo({ top: 0, behavior: 'auto' });
    }
    $('[data-q-go]', qz).addEventListener('click', () => { start.hidden = true; steps.hidden = false; step = 0; render(); });
    steps.addEventListener('submit', (e) => { e.preventDefault(); if (!validate()) return; if (step === Q.length) return showResult(); step++; render(); });
    steps.addEventListener('change', (e) => { if (e.target.type === 'radio') $('#q-err', stage).textContent = ''; });
    stage.addEventListener('click', (e) => { if (e.target.closest('[data-q-skip]')) showResult(); });
    $('[data-q-back]', qz).addEventListener('click', () => { if (step === 0) { steps.hidden = true; start.hidden = false; $('[data-q-go]', qz).focus(); return; } step--; render(); });
    result.addEventListener('click', (e) => {
      if (e.target.closest('[data-q-retake]')) { Object.keys(ans).forEach((k) => delete ans[k]); result.hidden = true; result.innerHTML = ''; steps.hidden = false; step = 0; render(); return; }
      const add = e.target.closest('[data-q-add]'); if (add) { addToCart(add.dataset.qAdd, 1, 1); return; }
      if (e.target.closest('[data-q-save]')) saveCard();
    });
    function saveCard() {
      const last = store.get('gyeol-quiz-last', {}); const f = DATA.frag.find((x) => x.slug === last.top); if (!f) return;
      const fam = QD.FAM[f.fam];
      const c = document.createElement('canvas'); c.width = 900; c.height = 1300; const x = c.getContext('2d');
      const gr = x.createLinearGradient(0, 0, 900, 1300); gr.addColorStop(0, fam.grad[0]); gr.addColorStop(.5, '#f4f2ee'); gr.addColorStop(1, fam.grad[1]);
      x.fillStyle = gr; x.fillRect(0, 0, 900, 1300); x.fillStyle = '#212121'; x.textAlign = 'center';
      x.font = '32px sans-serif'; x.fillText('추천 결과', 450, 200);
      x.font = 'bold 84px sans-serif'; x.fillText(f.en.toUpperCase(), 450, 360);
      x.font = 'bold 34px sans-serif'; x.fillText(`${f.ko} | ${f.enko} 오 드 퍼퓸`, 450, 430);
      x.font = '30px sans-serif'; [['TOP', f.top], ['HEART', f.heart], ['BASE', f.base]].forEach(([k, v], i) => { x.fillText(`${k} / ${v}`, 450, 620 + i * 70); });
      x.font = '28px sans-serif'; x.fillText(`${fam.ko} 계열`, 450, 900); x.font = 'bold 40px sans-serif'; x.fillText('GYEOL 결', 450, 1180);
      c.toBlob((b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `gyeol-scent-${f.slug}.png`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('결과 이미지를 저장했습니다.'); });
    }
  }

  // 전역 ESC — 검색·메가 닫기
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (sp && !sp.hidden) closeSearch(); megas.forEach((m) => closeMega(m)); } });
  addEventListener('storage', (e) => { if (e.key === KEY) { cart = store.get(KEY, []); renderCart(); } });
})();
