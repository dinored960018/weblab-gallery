/* NINEFOLD COFFEE — study reproduction. Vanilla JS, no dependencies. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const won = (n) => '₩' + Math.round(n).toLocaleString('en-US');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PRODUCTS = window.NF_PRODUCTS || [];
  const ROOT = window.NF_ROOT || './';
  const pById = (id) => PRODUCTS.find((p) => p.id === id);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
  };

  /* ── scroll lock & focus helpers ──────────────────────────── */
  const locks = new Set();
  const lock = (k) => { locks.add(k); document.body.classList.add('is-locked'); };
  const unlock = (k) => { locks.delete(k); if (!locks.size) document.body.classList.remove('is-locked'); };
  const focusables = (el) => $$('a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])', el).filter((x) => x.offsetParent !== null || x === document.activeElement);
  const trap = (el, e) => {
    if (e.key !== 'Tab') return;
    const f = focusables(el); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  /* ── image fade-in (opacity .4s, measured curve) ──────────── */
  $$('img.fade-img').forEach((im) => {
    const done = () => im.classList.add('is-loaded');
    if (im.complete && im.naturalWidth) done(); else { im.addEventListener('load', done, { once: true }); im.addEventListener('error', done, { once: true }); }
  });

  /* ── announcement carousel (300ms ease slide, 5s interval) ── */
  const ann = $('[data-ann]');
  if (ann) {
    const track = $('.ann-track', ann), items = $$('.ann-item', ann);
    let i = 0, paused = false;
    const go = (n) => {
      i = (n + items.length) % items.length;
      track.style.transform = `translateX(${-100 * i}%)`;
      items.forEach((it, k) => { const on = k === i; it.classList.toggle('is-active', on); it.toggleAttribute('aria-hidden', !on); it.tabIndex = on ? 0 : -1; });
    };
    ann.addEventListener('mouseenter', () => { paused = true; });
    ann.addEventListener('mouseleave', () => { paused = false; });
    ann.addEventListener('focusin', () => { paused = true; });
    ann.addEventListener('focusout', () => { paused = false; });
    if (!reduce && items.length > 1) setInterval(() => { if (!paused && !document.hidden) go(i + 1); }, 5000);
  }

  /* ── header hide on scroll down / show on scroll up ───────── */
  const hdrWrap = $('[data-hdr]');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    if (!hdrWrap) return;
    if (locks.size) { lastY = y; return; }
    if (y > lastY && y > 190) hdrWrap.classList.add('is-hidden');
    else if (y < lastY) hdrWrap.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });

  /* ── menu drawer ──────────────────────────────────────────── */
  const drawer = $('[data-menu-drawer]');
  const toggles = $$('[data-menu-toggle]');
  let menuReturn = null;
  const subBtns = $$('[data-md-sub]');
  const closeSubs = () => {
    subBtns.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    $$('[data-md-panel]').forEach((p) => { p.hidden = true; p.classList.remove('is-shown'); });
    drawer && drawer.classList.remove('has-sub');
  };
  const setMenu = (open, returnFocus = true) => {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    hdrWrap.classList.toggle('menu-open', open);
    toggles.forEach((t) => t.setAttribute('aria-expanded', String(open)));
    const ov = $('.md-overlay');
    if (open) {
      hdrWrap.classList.remove('is-hidden');
      const r = $('.hdr').getBoundingClientRect();
      ov.style.top = Math.max(0, r.bottom) + 'px';
      lock('menu');
      setTimeout(() => { const f = $('.md-main .md-link', drawer); f && f.focus({ preventScroll: true }); }, reduce ? 20 : 210);
    } else {
      closeSubs();
      unlock('menu');
      if (returnFocus && menuReturn && document.contains(menuReturn)) menuReturn.focus({ preventScroll: true });
    }
  };
  toggles.forEach((t) => t.addEventListener('click', () => {
    const open = !drawer.classList.contains('is-open');
    menuReturn = t; setMenu(open);
  }));
  $$('[data-menu-close]').forEach((b) => b.addEventListener('click', () => setMenu(false)));
  subBtns.forEach((b) => b.addEventListener('click', () => {
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    const wasOpen = b.getAttribute('aria-expanded') === 'true';
    closeSubs();
    if (wasOpen && innerWidth >= 990) return;
    b.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    drawer.classList.add('has-sub');
    requestAnimationFrame(() => { panel.classList.add('is-shown'); setTimeout(() => { const f = $('.md-list .md-link', panel); f && f.focus({ preventScroll: true }); }, reduce ? 20 : 210); });
  }));
  $$('[data-md-back]').forEach((b) => b.addEventListener('click', () => {
    const panel = b.closest('[data-md-panel]');
    const opener = subBtns.find((s) => s.getAttribute('aria-controls') === panel.id);
    closeSubs(); opener && opener.focus();
  }));
  addEventListener('resize', () => { if (drawer && drawer.classList.contains('is-open') && innerWidth >= 990) { /* keep */ } });
  document.addEventListener('click', (e) => {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    if (e.target.closest('[data-menu-drawer]') || e.target.closest('[data-menu-toggle]')) return;
    setMenu(false, false);
  });

  /* ── search modal (slide from right, 500ms ease) ──────────── */
  const sm = $('[data-search-modal]');
  let smReturn = null;
  const smInput = $('[data-search-input]');
  const hl = (text, q) => {
    const safe = text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    if (!q) return safe;
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return safe;
    const e = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    return e(text.slice(0, i)) + '<mark>' + e(text.slice(i, i + q.length)) + '</mark>' + e(text.slice(i + q.length));
  };
  const match = (p, q) => { const s = (p.n + ' ' + p.t).toLowerCase(); return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => s.includes(w)); };
  const renderSearch = () => {
    const q = smInput.value.trim();
    const list = q ? PRODUCTS.filter((p) => match(p, q)) : PRODUCTS.filter((p) => ['harbor-blend', 'morning-table-set', 'stoneware-mug', 'daily-tumbler-20', 'ethiopia-guji', 'ceramic-dripper'].includes(p.id));
    $('[data-search-title]').textContent = q ? `검색 결과 ${list.length}건` : '인기 상품';
    const empty = $('[data-search-empty]');
    empty.hidden = !(q && !list.length);
    empty.textContent = q ? `"${q}" 검색 결과 없음` : '';
    $('[data-search-results]').innerHTML = list.slice(0, 6).map((p) => `<li class="sm-card"><a href="${p.u}"><img src="${p.img}" alt="" loading="lazy"><span class="t">${hl(p.t, q)}</span><span class="n">${hl(p.n, q)}</span></a></li>`).join('');
    const all = $('[data-search-all]');
    all.hidden = !q;
    all.href = ROOT + 'search/index.html?q=' + encodeURIComponent(q);
    $('[data-search-clear]').hidden = !q;
  };
  const setSearch = (open) => {
    if (!sm) return;
    if (open) {
      smReturn = document.activeElement;
      sm.hidden = false;
      $$('[data-search-open]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
      renderSearch();
      lock('search');
      requestAnimationFrame(() => requestAnimationFrame(() => { sm.classList.add('is-open'); smInput.focus({ preventScroll: true }); }));
    } else {
      sm.classList.remove('is-open');
      $$('[data-search-open]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      unlock('search');
      const done = () => { if (!sm.classList.contains('is-open')) sm.hidden = true; };
      reduce ? done() : setTimeout(done, 500);
      smReturn && smReturn.focus && smReturn.focus({ preventScroll: true });
    }
  };
  $$('[data-search-open]').forEach((b) => b.addEventListener('click', () => { setMenu(false, false); setSearch(true); }));
  $('[data-search-close]') && $('[data-search-close]').addEventListener('click', () => setSearch(false));
  if (smInput) {
    smInput.addEventListener('input', renderSearch);
    $('[data-search-clear]').addEventListener('click', () => { smInput.value = ''; renderSearch(); smInput.focus(); });
    sm.addEventListener('keydown', (e) => trap(sm, e));
  }

  /* ── cart ─────────────────────────────────────────────────── */
  const KEY = 'nf-cart-v1';
  const FREE = 30000, SHIP = 3000;
  const unitPrice = (p, variant) => (/500g/.test(variant || '') ? Math.round((p.pr * 2.2) / 1000) * 1000 : p.pr);
  let cart = store.get(KEY, []).filter((l) => pById(l.id));
  const save = () => { store.set(KEY, cart); renderCart(); };
  const totals = () => {
    const sub = cart.reduce((s, l) => s + unitPrice(pById(l.id), l.v) * l.q, 0);
    const ship = sub === 0 || sub >= FREE ? 0 : SHIP;
    return { sub, ship, total: sub + ship, count: cart.reduce((s, l) => s + l.q, 0) };
  };
  const addToCart = (id, v, q) => {
    const l = cart.find((x) => x.id === id && x.v === v);
    if (l) l.q = Math.min(20, l.q + q); else cart.push({ id, v, q });
    save();
  };
  const qtyHTML = (i, q, label) => `<div class="qty" data-line="${i}"><button type="button" aria-label="${label} 수량 줄임" data-line-dec${q <= 1 ? ' disabled' : ''}><svg viewBox="0 0 10 10" fill="none" stroke="currentColor"><path d="M1.5 5h7"/></svg></button><input type="number" value="${q}" min="1" max="20" aria-label="${label} 수량" data-line-input><button type="button" aria-label="${label} 수량 늘림" data-line-inc${q >= 20 ? ' disabled' : ''}><svg viewBox="0 0 10 10" fill="none" stroke="currentColor"><path d="M1.5 5h7M5 1.5v7"/></svg></button></div>`;
  const rmHTML = (i, label) => `<button class="cd-rm" type="button" aria-label="${label} 삭제" data-line-rm="${i}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.2 4.5l.7 9h6.2l.7-9M6.8 7v4.5M9.2 7v4.5"/></svg></button>`;
  function renderCart() {
    const t = totals();
    $$('[data-cart-count]').forEach((c) => { c.textContent = t.count; c.hidden = !t.count; });
    $$('[data-cart-open]').forEach((a) => a.setAttribute('aria-label', t.count ? `카트, 상품 ${t.count}개` : '카트'));
    $$('[data-sum-sub]').forEach((e) => { e.textContent = won(t.sub); });
    $$('[data-sum-ship]').forEach((e) => { e.textContent = t.ship ? won(t.ship) : '무료'; });
    $$('[data-sum-total]').forEach((e) => { e.textContent = won(t.total); });
    const empty = !cart.length;
    const d = $('[data-cart-drawer]');
    if (d) {
      $('[data-cart-empty]', d).hidden = !empty;
      $('[data-cart-foot]', d).hidden = empty;
      $('[data-cart-items]', d).hidden = empty;
      const pct = Math.min(100, Math.round((t.sub / FREE) * 100));
      $('[data-ship-bar]', d).style.transform = `scaleX(${pct / 100})`;
      $('.cd-bar', d).setAttribute('aria-valuenow', pct);
      $('[data-ship-text]', d).textContent = t.sub >= FREE ? '무료 배송 적용' : empty ? '30,000원 이상 주문 시 무료 배송' : `무료 배송까지 ${won(FREE - t.sub)}`;
      $('[data-cart-items]', d).innerHTML = cart.map((l, i) => {
        const p = pById(l.id);
        return `<li class="cd-item"><img src="${p.img}" alt=""><div><a class="n" href="${p.u}">${p.n}</a>${l.v ? `<p class="v">${l.v}</p>` : ''}<p class="pr">${won(unitPrice(p, l.v))}</p><div class="row">${qtyHTML(i, l.q, p.n)}${rmHTML(i, p.n)}</div></div></li>`;
      }).join('');
    }
    const cp = $('[data-cart-page]');
    if (cp) {
      $('[data-cp-empty]', cp).hidden = !empty;
      $('[data-cp-table]', cp).hidden = empty;
      $('[data-cp-foot]', cp).hidden = empty;
      $('[data-cp-items]', cp).innerHTML = cart.map((l, i) => {
        const p = pById(l.id);
        return `<tr><td><div class="cp-prod"><img src="${p.img}" alt=""><div><a class="n" href="${p.u}">${p.n}</a>${l.v ? `<p class="v">${l.v}</p>` : ''}<p class="pr">${won(unitPrice(p, l.v))}</p></div></div></td><td><div class="cp-qty">${qtyHTML(i, l.q, p.n)}${rmHTML(i, p.n)}</div></td><td>${won(unitPrice(p, l.v) * l.q)}</td></tr>`;
      }).join('');
    }
  }
  document.addEventListener('click', (e) => {
    const dec = e.target.closest('[data-line-dec]'), inc = e.target.closest('[data-line-inc]'), rm = e.target.closest('[data-line-rm]');
    if (dec || inc) {
      const i = +e.target.closest('[data-line]').dataset.line;
      cart[i].q = Math.max(1, Math.min(20, cart[i].q + (inc ? 1 : -1)));
      const sel = inc ? '[data-line-inc]' : '[data-line-dec]';
      const host = e.target.closest('[data-cart-drawer],[data-cart-page]');
      save();
      const again = host && $$(`[data-line="${i}"] ${sel}`, host)[0];
      if (again && !again.disabled) again.focus(); else if (host) { const inp = $(`[data-line="${i}"] input`, host); inp && inp.focus(); }
    } else if (rm) {
      cart.splice(+rm.dataset.lineRm, 1); save();
      const host = $('[data-cart-drawer].is-open'); if (host) $('.cd-close', host).focus();
    }
  });
  document.addEventListener('change', (e) => {
    const inp = e.target.closest('[data-line-input]'); if (!inp) return;
    const i = +inp.closest('[data-line]').dataset.line;
    cart[i].q = Math.max(1, Math.min(20, parseInt(inp.value, 10) || 1)); save();
  });
  const cd = $('[data-cart-drawer]');
  let cdReturn = null;
  const setCart = (open) => {
    if (!cd) return;
    if (open) {
      cdReturn = document.activeElement;
      cd.hidden = false;
      lock('cart');
      requestAnimationFrame(() => requestAnimationFrame(() => { cd.classList.add('is-open'); $('.cd-close', cd).focus({ preventScroll: true }); }));
    } else {
      cd.classList.remove('is-open');
      unlock('cart');
      setTimeout(() => { if (!cd.classList.contains('is-open')) cd.hidden = true; }, reduce ? 0 : 200);
      cdReturn && cdReturn.focus && document.contains(cdReturn) && cdReturn.focus({ preventScroll: true });
    }
  };
  $$('[data-cart-open]').forEach((a) => a.addEventListener('click', (e) => { if ($('[data-cart-page]')) return; e.preventDefault(); setMenu(false, false); setCart(true); }));
  $$('[data-cart-close]').forEach((b) => b.addEventListener('click', () => setCart(false)));
  cd && cd.addEventListener('keydown', (e) => trap($('.cd-inner', cd), e));
  const addWithFeedback = (btn, id, v, q, then) => {
    btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true');
    setTimeout(() => {
      btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy');
      addToCart(id, v, q);
      then ? then() : setCart(true);
    }, reduce ? 0 : 450);
  };

  /* qty steppers (product page & quick add) */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-qty-dec],[data-qty-inc]'); if (!b) return;
    const box = b.closest('[data-qty]'), inp = $('input', box);
    const v = Math.max(1, Math.min(20, (parseInt(inp.value, 10) || 1) + (b.hasAttribute('data-qty-inc') ? 1 : -1)));
    inp.value = v;
    $('[data-qty-dec]', box).disabled = v <= 1;
    $('[data-qty-inc]', box).disabled = v >= 20;
    if (b.disabled) (b.hasAttribute('data-qty-inc') ? $('[data-qty-dec]', box) : $('[data-qty-inc]', box)).focus();
  });
  document.addEventListener('change', (e) => {
    const inp = e.target.closest('[data-qty] input'); if (!inp) return;
    const box = inp.closest('[data-qty]');
    const v = Math.max(1, Math.min(20, parseInt(inp.value, 10) || 1)); inp.value = v;
    $('[data-qty-dec]', box).disabled = v <= 1; $('[data-qty-inc]', box).disabled = v >= 20;
  });

  /* quick add on product cards */
  const closeVariant = (card, focusBtn) => {
    const panel = $('[data-variant-panel]', card); if (!panel) return;
    panel.hidden = true; card.classList.remove('is-open');
    const btn = $('.pc-add', card); btn.setAttribute('aria-expanded', 'false');
    focusBtn && btn.focus();
  };
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.pc-add');
    if (btn) {
      const card = btn.closest('.pc'), id = btn.dataset.add, panel = $('[data-variant-panel]', card);
      if (panel && panel.hidden) {
        $$('.pc.is-open').forEach((c) => c !== card && closeVariant(c));
        panel.hidden = false; card.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true');
        $('select', panel).focus();
        return;
      }
      const v = panel ? $$('select', panel).map((s) => s.value).join(' / ') : '';
      const q = panel ? parseInt($('.qty input', panel).value, 10) || 1 : 1;
      addWithFeedback(btn, id, v, q, () => { if (panel) closeVariant(card); setCart(true); });
      return;
    }
    const c = e.target.closest('[data-variant-close]');
    if (c) closeVariant(c.closest('.pc'), true);
  });

  /* product page form */
  const pdForm = $('[data-pd-form]');
  if (pdForm) {
    const id = $('[data-product]').dataset.product, p = pById(id);
    const out = $('[data-price-out]');
    const variant = () => $$('select', pdForm).map((s) => s.value).join(' / ');
    const qty = () => parseInt($('.qty input', pdForm).value, 10) || 1;
    pdForm.addEventListener('change', () => { if (out) out.textContent = won(unitPrice(p, variant())); });
    pdForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = $('.pd-add', pdForm); if (btn.disabled) return;
      addWithFeedback(btn, id, variant(), qty());
    });
    const now = $('[data-buy-now]', pdForm);
    now && now.addEventListener('click', () => addWithFeedback(now, id, variant(), qty(), () => { location.href = ROOT + 'cart/index.html'; }));
  }

  /* cart page checkout (blocked) */
  const co = $('[data-checkout]');
  co && co.addEventListener('click', () => { const m = $('[data-checkout-msg]'); m.textContent = '결제 미지원 · 학습용 모작'; m.className = 'form-msg is-err'; });

  /* ── sliders ──────────────────────────────────────────────── */
  const hoverArrows = (root) => {
    if (!matchMedia('(hover: hover)').matches) return;
    root.addEventListener('mouseenter', () => root.classList.add('is-hover'));
    root.addEventListener('mouseleave', () => root.classList.remove('is-hover'));
  };
  const swipe = (el, prev, next) => {
    let x0 = null;
    el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    el.addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) (dx < 0 ? next : prev)(); });
    el.addEventListener('pointercancel', () => { x0 = null; });
  };
  const tabsKeys = (list, go) => list.addEventListener('keydown', (e) => {
    const tabs = $$('[role=tab]', list), i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length; else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
    if (n !== null) { e.preventDefault(); go(n); tabs[n].focus(); }
  });
  const setupPag = (root, count, go) => {
    const pag = $(':scope > .sw-pag', root);
    if (!pag) return () => {};
    const tabs = $$('[role=tab]', pag);
    tabs.forEach((t, k) => t.addEventListener('click', () => go(k)));
    tabsKeys(pag, go);
    return (i) => tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
  };
  // fade slider (hero)
  $$('[data-hero]').forEach((root) => {
    const slides = $$('.hero-slide', root);
    let i = 0;
    let upd;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { const on = k === i; s.classList.toggle('is-active', on); s.toggleAttribute('aria-hidden', !on); $$('a', s).forEach((a) => { a.tabIndex = on ? 0 : -1; }); });
      upd(i);
    };
    upd = setupPag(root, slides.length, go);
    $('[data-prev]', root).addEventListener('click', () => go(i - 1));
    $('[data-next]', root).addEventListener('click', () => go(i + 1));
    hoverArrows(root); swipe(root, () => go(i - 1), () => go(i + 1));
    go(0);
  });
  // translate sliders (locate, gallery)
  $$('[data-locate],[data-gallery]').forEach((root) => {
    const track = $('.loc-track,.pdg-track', root), slides = [...track.children];
    let i = 0, upd;
    const go = (n) => {
      i = Math.max(0, Math.min(slides.length - 1, n));
      track.style.transform = `translate3d(${-100 * i}%,0,0)`;
      slides.forEach((s, k) => { s.toggleAttribute('aria-hidden', k !== i); $$('a', s).forEach((a) => { a.tabIndex = k === i ? 0 : -1; }); });
      $('[data-prev]', root).disabled = i === 0;
      $('[data-next]', root).disabled = i === slides.length - 1;
      upd(i);
    };
    upd = setupPag(root, slides.length, go);
    $('[data-prev]', root).addEventListener('click', () => go(i - 1));
    $('[data-next]', root).addEventListener('click', () => go(i + 1));
    hoverArrows(root); swipe(track, () => go(i - 1), () => go(i + 1));
    go(0);
  });
  // rail (3 per view)
  $$('[data-rail]').forEach((root) => {
    const track = $('.rail-track', root), n = track.children.length;
    let i = 0;
    const per = () => (innerWidth >= 990 ? 3 : 1);
    const go = (k) => {
      if (per() === 1) return;
      i = Math.max(0, Math.min(n - per(), k));
      track.style.transform = `translate3d(${(-100 / 3) * i}%,0,0)`;
      $('[data-prev]', root).disabled = i === 0;
      $('[data-next]', root).disabled = i >= n - per();
    };
    $('[data-prev]', root).addEventListener('click', () => go(i - 1));
    $('[data-next]', root).addEventListener('click', () => go(i + 1));
    root.addEventListener('focusin', (e) => { const li = e.target.closest('.cc'); if (!li || per() === 1) return; const k = [...track.children].indexOf(li); if (k < i) go(k); else if (k >= i + per()) go(k - per() + 1); root.querySelector('.rail-view').scrollLeft = 0; });
    hoverArrows(root); swipe(track, () => go(i - 1), () => go(i + 1));
    go(0);
  });

  /* ── blog tabs ────────────────────────────────────────────── */
  const blog = $('[data-blog]');
  if (blog) {
    const tabs = $$('[role=tab]', blog), posts = $$('.bpost', blog);
    const go = (k) => {
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(j === k)); t.tabIndex = j === k ? 0 : -1; });
      const c = tabs[k].dataset.cat;
      posts.forEach((p) => { p.hidden = !(c === 'all' || p.dataset.cat === c); });
    };
    tabs.forEach((t, k) => t.addEventListener('click', () => go(k)));
    tabsKeys($('.blog-tabs', blog), go);
    const c0 = new URLSearchParams(location.search).get('cat');
    const k0 = tabs.findIndex((t) => t.dataset.cat === c0);
    go(k0 > 0 ? k0 : 0);
  }

  /* ── FAQ accordion ────────────────────────────────────────── */
  $$('.faq-q').forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    document.getElementById(b.getAttribute('aria-controls')).hidden = !open;
  }));

  /* ── modal ────────────────────────────────────────────────── */
  let modalReturn = null;
  const closeModal = (m) => { m.hidden = true; unlock('modal'); modalReturn && modalReturn.focus(); };
  $$('[data-modal-open]').forEach((b) => b.addEventListener('click', () => {
    const m = document.getElementById(b.dataset.modalOpen); modalReturn = b; m.hidden = false; lock('modal');
    $('.modal-x', m).focus();
  }));
  $$('[data-modal]').forEach((m) => {
    $$('[data-modal-close]', m).forEach((x) => x.addEventListener('click', () => closeModal(m)));
    m.addEventListener('keydown', (e) => trap($('.modal-box', m), e));
  });

  /* ── ESC closes the top layer ─────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const m = $('[data-modal]:not([hidden])');
    if (m) return closeModal(m);
    if (sm && sm.classList.contains('is-open')) return setSearch(false);
    if (cd && cd.classList.contains('is-open')) return setCart(false);
    const openCard = $('.pc.is-open'); if (openCard) return closeVariant(openCard, true);
    if (drawer && drawer.classList.contains('is-open')) {
      if (innerWidth < 990 && drawer.classList.contains('has-sub')) { const b = $('[data-md-sub][aria-expanded="true"]'); closeSubs(); b && b.focus(); return; }
      return setMenu(false);
    }
  });

  /* ── reviews: sort + paginate (3 per page) ────────────────── */
  const rv = $('[data-reviews]');
  if (rv) {
    const list = $('[data-rv-list]', rv), items = $$('.rv', list), pager = $('[data-rv-pager]', rv), sel = $('[data-rv-sort]', rv);
    const PER = 3; let page = 0;
    const render = () => {
      const s = sel.value;
      const sorted = items.slice().sort((a, b) => (s === 'new' ? b.dataset.date.localeCompare(a.dataset.date) : s === 'high' ? b.dataset.rate - a.dataset.rate || b.dataset.date.localeCompare(a.dataset.date) : a.dataset.rate - b.dataset.rate));
      sorted.forEach((r, k) => { list.appendChild(r); r.hidden = Math.floor(k / PER) !== page; });
      const pages = Math.ceil(items.length / PER);
      pager.innerHTML = Array.from({ length: pages }, (_, k) => `<button type="button" data-page="${k}"${k === page ? ' aria-current="page"' : ''} aria-label="리뷰 ${k + 1}쪽">${k + 1}</button>`).join('');
    };
    sel.addEventListener('change', () => { page = 0; render(); });
    pager.addEventListener('click', (e) => { const b = e.target.closest('[data-page]'); if (!b) return; page = +b.dataset.page; render(); $(`[data-page="${page}"]`, pager).focus(); });
    render();
  }

  /* ── search results page ──────────────────────────────────── */
  const sp = $('[data-search-page]');
  if (sp) {
    const inp = $('#sp-input', sp), grid = $('[data-sp-grid]', sp), postsEl = $('[data-sp-posts]', sp), status = $('[data-sp-status]', sp);
    const posts = JSON.parse($('#nf-posts').textContent);
    const run = (q) => {
      q = q.trim();
      const ps = q ? PRODUCTS.filter((p) => match(p, q)) : [];
      const bs = q ? posts.filter((b) => (b.t + ' ' + b.c + ' ' + b.b).toLowerCase().includes(q.toLowerCase())) : [];
      status.textContent = q ? `"${q}" 검색 결과 ${ps.length + bs.length}건 (상품 ${ps.length} · 글 ${bs.length})` : '검색어 입력';
      grid.innerHTML = ps.map((p) => `<li class="pc"><div class="pc-media"><a href="${p.u}" tabindex="-1" aria-hidden="true"><img class="pc-img1" src="${p.img}" alt="" loading="lazy"></a></div><div class="pc-info"><p class="pc-type">${hl(p.t, q)}</p><h2 class="pc-name"><a href="${p.u}">${hl(p.n, q)}</a></h2><p class="pc-type">${won(p.pr)}</p></div></li>`).join('');
      postsEl.innerHTML = bs.map((b) => `<li><a href="${b.u}">${hl(b.t, q)}</a><span>${b.c}</span></li>`).join('');
    };
    const q0 = new URLSearchParams(location.search).get('q') || '';
    inp.value = q0; run(q0);
    inp.addEventListener('input', () => run(inp.value));
    $('[data-sp-form]', sp).addEventListener('submit', (e) => {
      e.preventDefault(); run(inp.value);
      const u = new URL(location.href); u.searchParams.set('q', inp.value.trim());
      try { history.replaceState(null, '', u); } catch (err) { /* file:// */ }
    });
  }

  /* ── form validation (submit always blocked) ──────────────── */
  const MSG = {
    valueMissing: (el) => (el.type === 'checkbox' ? '동의가 필요해요' : el.tagName === 'SELECT' ? '항목을 선택해 주세요' : `${(el.labels[0] || {}).textContent || '이 항목'}을 입력해 주세요`.replace(/\(선택\)/, '').replace(/([가-힣])을/, (m, c) => c + ((c.charCodeAt(0) - 0xac00) % 28 ? '을' : '를'))),
    typeMismatch: () => '이메일 형식을 확인해 주세요 (예: name@example.com)',
    tooShort: (el) => `${el.minLength}자 이상 입력해 주세요`,
    patternMismatch: () => '숫자와 하이픈만 입력해 주세요 (9~13자)',
  };
  const errorOf = (el) => { const v = el.validity; for (const k of ['valueMissing', 'typeMismatch', 'tooShort', 'patternMismatch']) if (v[k]) return MSG[k](el); return ''; };
  $$('[data-validate]').forEach((form) => {
    const fields = $$('input,select,textarea', form).filter((el) => el.willValidate);
    const show = (el) => {
      const msg = errorOf(el);
      const id = (el.getAttribute('aria-describedby') || '').split(' ')[0];
      const out = id && document.getElementById(id);
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (out && !out.classList.contains('nl-msg')) out.textContent = msg;
      return msg;
    };
    fields.forEach((el) => el.addEventListener('blur', () => { if (el.getAttribute('aria-invalid')) show(el); }));
    fields.forEach((el) => el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') show(el); }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = fields.filter((el) => show(el));
      const status = $('.form-msg, .nl-msg', form);
      if (bad.length) {
        status.textContent = form.dataset.validate === 'newsletter' ? errorOf(bad[0]) : `입력 확인 필요 ${bad.length}건`;
        status.className = status.className.replace(/\bis-(ok|err)\b/g, '').trim() + ' is-err';
        bad[0].focus();
      } else {
        status.textContent = form.dataset.validate === 'newsletter' ? '입력 확인 완료 · 학습용 모작이라 전송하지 않음' : '입력 확인 완료 · 학습용 모작이라 전송하지 않음';
        status.className = status.className.replace(/\bis-(ok|err)\b/g, '').trim() + ' is-ok';
      }
    });
  });

  renderCart();
})();
