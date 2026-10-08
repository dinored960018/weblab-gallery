// TOLDE 모작 — 동작. 원본(magazine-b.com)에 있는 기능만 옮기고, 키보드·ESC·aria 는 접근성 최소선으로 더했다.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ROOT = (() => { const s = $('script[src$="assets/site.js"]'); return s ? s.getAttribute('src').replace('assets/site.js', '') : ''; })();
  const won = (n) => '₩' + Number(n).toLocaleString('en-US');

  // ── 모달(검색 · 장바구니 · 언어) ────────────────
  let openModal = null, lastFocus = null;
  const triggers = (name) => $$(`[data-modal="${name}"]`);
  const close = () => {
    if (!openModal) return;
    const name = openModal.id.replace('modal-', '');
    openModal.hidden = true;
    document.body.classList.remove('modal-open-' + name);
    triggers(name).forEach((t) => t.setAttribute('aria-expanded', 'false'));
    document.documentElement.style.overflow = '';
    openModal = null;
    if (lastFocus) lastFocus.focus();
  };
  const open = (name, from) => {
    const m = $('#modal-' + name); if (!m) return;
    if (openModal === m) { close(); return; }
    close();
    lastFocus = from || document.activeElement;
    m.hidden = false; openModal = m;
    document.body.classList.add('modal-open-' + name);
    triggers(name).forEach((t) => t.setAttribute('aria-expanded', 'true'));
    if (name !== 'search') document.documentElement.style.overflow = 'hidden';
    const f = name === 'search' ? $('#keyword') : $('.modal-close', m);
    if (f) setTimeout(() => f.focus(), 30);
  };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-modal]');
    if (t) { e.preventDefault(); open(t.dataset.modal, t); return; }
    if (e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (openModal) { close(); return; }
    const menu = $('.menu-btn[aria-expanded="true"]'); if (menu) menu.click();
  });
  // 포커스 가두기(옆 서랍)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !openModal) return;
    const f = $$('a[href],button:not([disabled]),input', openModal).filter((x) => x.offsetParent);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  // ── 모바일 메뉴(원본 aside) ────────────────────
  const menuBtn = $('.menu-btn'), aside = $('#aside');
  if (menuBtn && aside) menuBtn.addEventListener('click', () => {
    const on = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', String(on));
    aside.hidden = !on; document.body.classList.toggle('menu-open', on);
    document.documentElement.style.overflow = on ? 'hidden' : '';
    menuBtn.textContent = on ? 'Close' : 'Menu';
  });

  // ── 홈 헤더: 히어로를 지나면 흰 막 ─────────────
  const header = $('#header');
  if (header && header.classList.contains('is-light')) {
    const hero = $('.home-hero');
    const on = () => header.classList.toggle('is-scrolled', scrollY > (hero ? hero.offsetHeight - 56 : 0));
    addEventListener('scroll', on, { passive: true }); on();
  }

  // ── 장바구니 ──────────────────────────────────
  const dataEl = $('#cart-data');
  const DATA = dataEl ? JSON.parse(dataEl.textContent) : {};
  const KEY = 'tolde-cart';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = (c) => { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* 저장 불가 */ } };
  const render = () => {
    const c = read(); const keys = Object.keys(c).filter((k) => DATA[k] || c[k].d);
    const n = keys.reduce((s, k) => s + c[k].q, 0);
    $$('.basket-count').forEach((el) => { el.textContent = n; });
    const list = $('.cart-list'); if (!list) return;
    list.innerHTML = keys.map((k) => { const d = DATA[k] || c[k].d; return `<li><img src="${ROOT}${d.i}" alt=""><div><a class="ci-name" href="${ROOT}${d.u}index.html">${d.n}</a><p class="ci-meta">${d.l}</p>
      <div class="ci-row"><span>${won(d.p * c[k].q)}</span><span><button type="button" data-cq="${k}" data-d="-1" aria-label="${d.n} 수량 빼기">−</button> ${c[k].q} <button type="button" data-cq="${k}" data-d="1" aria-label="${d.n} 수량 더하기">+</button></span></div></div></li>`; }).join('');
    $('.cart-empty').hidden = keys.length > 0;
    $('.cart-total').textContent = won(keys.reduce((s, k) => s + (DATA[k] || c[k].d).p * c[k].q, 0));
  };
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add && !add.disabled) {
      const k = add.dataset.add; const c = read();
      const qEl = add.dataset.qtyFrom ? $(add.dataset.qtyFrom) : null;
      const q = qEl ? Number(qEl.textContent) || 1 : 1;
      c[k] = { q: (c[k] ? c[k].q : 0) + q, d: DATA[k] };
      save(c); render(); open('cart', add);
      return;
    }
    const cq = e.target.closest('[data-cq]');
    if (cq) { const c = read(); const k = cq.dataset.cq; c[k].q += Number(cq.dataset.d); if (c[k].q < 1) delete c[k]; save(c); render(); }
  });
  render();

  // ── 수량(상세 · 고정 막대) ─────────────────────
  $$('.qty').forEach((box) => box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-qty]'); if (!b) return;
    const v = Math.max(1, Math.min(99, Number($('.qty-val', box).textContent) + Number(b.dataset.qty)));
    $$('.qty-val').forEach((o) => { o.textContent = v; });
  }));
  // 스크롤하면 헤더 자리에 구매 막대(원본 동작)
  const bar = $('.buy-bar'), info = $('.info-container');
  if (bar && info) {
    const on = () => { const show = info.getBoundingClientRect().bottom < 56; bar.classList.toggle('is-on', show); bar.toggleAttribute('inert', !show); bar.setAttribute('aria-hidden', String(!show)); };
    addEventListener('scroll', on, { passive: true }); on();
  }

  // ── 홈 슬라이드(페이드 300ms · 4초 자동) ────────
  const hero = $('.home-hero');
  if (hero) {
    const slides = $$('.hero-slide', hero), cur = $('.current-page', hero), drag = $('.hero-drag', hero);
    let i = 0, timer = null, stopped = reduce;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { const on = k === i; s.classList.toggle('is-active', on); s.setAttribute('aria-hidden', String(!on)); $$('a', s).forEach((a) => (on ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1'))); });
      cur.textContent = i + 1; drag.style.transform = `translateX(${i * 100}%)`;
    };
    const play = () => { clearInterval(timer); if (!stopped) timer = setInterval(() => go(i + 1), 4300); };
    const stop = () => { stopped = true; clearInterval(timer); };   // 원본 disableOnInteraction
    let x0 = null;
    hero.addEventListener('pointerdown', (e) => { if (e.target.closest('a')) return; x0 = e.clientX; });
    hero.addEventListener('pointerup', (e) => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) { stop(); go(i + (dx < 0 ? 1 : -1)); } });
    hero.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { stop(); go(i + (e.key === 'ArrowRight' ? 1 : -1)); } });
    hero.addEventListener('focusin', stop);
    play();
  }

  // ── 탭(홈 Shop · Books / FAQ / Stockists) ──────
  const tabs = (list, onSel) => {
    const btns = $$('[role="tab"]', list);
    const sel = (b, focus) => { btns.forEach((x) => { const on = x === b; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; }); if (focus) b.focus(); onSel(b, btns.indexOf(b)); };
    btns.forEach((b) => b.addEventListener('click', () => sel(b)));
    list.addEventListener('keydown', (e) => {
      const k = btns.indexOf(document.activeElement); if (k < 0) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); sel(btns[(k + 1) % btns.length], true); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); sel(btns[(k - 1 + btns.length) % btns.length], true); }
    });
  };
  $$('.main-section').forEach((sec, si) => {
    const box = $('.section-item-box', sec), panels = $$('.section-item-container', sec);
    // 원본: 켜질 때 상자 높이 900 → 내용 높이, 바탕 #f2f2f2 → 첫 탭 색 (둘 다 300ms ease-out)
    if (!reduce) {
      const first = $('[role="tab"]', sec).dataset.bg, h = box.offsetHeight;
      sec.style.setProperty('--bg', '#f2f2f2'); box.style.height = '900px';
      setTimeout(() => { sec.style.setProperty('--bg', first); box.style.height = h + 'px'; setTimeout(() => { box.style.height = ''; }, 320); }, 1450 + si * 160);
    }
    tabs($('.section-menu', sec), (b, k) => {
      sec.style.setProperty('--bg', b.dataset.bg);
      const from = box.offsetHeight;
      panels.forEach((p, n) => { p.hidden = n !== k; p.classList.toggle('active', n === k); });
      if (reduce) return;
      const to = box.offsetHeight; box.style.height = from + 'px'; box.offsetHeight; box.style.height = to + 'px';
      panels[k].style.opacity = 0; requestAnimationFrame(() => { panels[k].style.opacity = 1; });
      setTimeout(() => { box.style.height = ''; }, 320);
    });
  });
  const ft = $('.board-tabs');
  if (ft) tabs(ft, (b) => { const c = b.dataset.cat; $$('#faq-list li').forEach((li) => { li.hidden = c !== '전체' && li.dataset.cat !== c; }); });
  const cl = $('.country-list');
  if (cl) {
    const map = $('.map'), label = $('.map-label');
    const show = (k) => {
      const panels = $$('.store-panel'); panels.forEach((p, n) => { p.hidden = n !== k; });
      const p = panels[k]; label.textContent = p.dataset.country;
      $$('.pin', map).forEach((x) => x.remove());
      JSON.parse(p.dataset.pins).forEach(([x, y]) => { const s = document.createElement('span'); s.className = 'pin'; s.style.left = x + '%'; s.style.top = y + '%'; map.append(s); });
    };
    tabs(cl, (b, k) => show(k)); show(0);
  }

  // ── 아코디언(FAQ · Notice) ─────────────────────
  $$('.board-list .q').forEach((q) => q.addEventListener('click', () => {
    const on = q.getAttribute('aria-expanded') !== 'true';
    q.setAttribute('aria-expanded', String(on));
    $('#' + q.getAttribute('aria-controls')).hidden = !on;
    q.parentElement.classList.toggle('is-open', on);
  }));

  // ── 소개 제목 펼침(▼) ──────────────────────────
  $$('.toggle-btn').forEach((b) => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(on));
    $('#' + b.getAttribute('aria-controls')).hidden = !on;
  }));

  // ── 캐러셀(끌기 · 좌우 키) ─────────────────────
  $$('.carousel').forEach((c) => {
    const track = $('.carousel-track', c), slides = $$('.carousel-slide', c), cnt = $('.cur', c), dr = $('.carousel-drag', c);
    let i = 0, x0 = null, dx = 0;
    const step = () => slides[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0);
    const go = (n) => { i = Math.max(0, Math.min(slides.length - 1, n)); track.style.transform = `translateX(${-i * step()}px)`; if (cnt) cnt.textContent = i + 1; if (dr) dr.style.transform = `translateX(${i * 100}%)`; };
    c.addEventListener('pointerdown', (e) => { x0 = e.clientX; dx = 0; c.classList.add('is-drag'); c.setPointerCapture(e.pointerId); });
    c.addEventListener('pointermove', (e) => { if (x0 === null) return; dx = e.clientX - x0; track.style.transform = `translateX(${-i * step() + dx}px)`; });
    const end = () => { if (x0 === null) return; x0 = null; c.classList.remove('is-drag'); go(Math.abs(dx) > 50 ? i + (dx < 0 ? 1 : -1) : i); };
    c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
    c.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); } });
    addEventListener('resize', () => go(i));
  });

  // ── 정렬(높은가격 · 낮은가격) ──────────────────
  $$('.sort-select').forEach((s) => s.addEventListener('change', () => {
    const ul = $('.prd-list'); const items = $$('.prd', ul);
    const v = s.value;
    items.sort((a, b) => (v === 'price-desc' ? b.dataset.price - a.dataset.price : v === 'price-asc' ? a.dataset.price - b.dataset.price : a.dataset.order - b.dataset.order));
    items.forEach((li) => ul.append(li));
  }));

  // ── Index: 이름을 누르면 오른쪽이 그 항목으로, 오른쪽을 넘기면 머리글이 따라감 ──
  const ix = $('.index-detail-items');
  if (ix) {
    const items = $$('.index-detail-item', ix), btns = $$('.index-brand-item');
    const title = $('.ix-title'), cat = $('.ix-cat'), shop = $('.ix-shop');
    const setHead = (it) => { title.textContent = it.dataset.title; cat.textContent = it.dataset.cat; shop.href = it.dataset.link; btns.forEach((b) => b.classList.toggle('is-on', b.dataset.target === it.id)); };
    btns.forEach((b) => b.addEventListener('click', () => { const it = $('#' + b.dataset.target); ix.scrollTop = it.offsetTop - ix.offsetTop; setHead(it); }));
    ix.addEventListener('scroll', () => { const y = ix.scrollTop + ix.offsetTop + 40; let cur = items[0]; for (const it of items) if (it.offsetTop <= y) cur = it; setHead(cur); }, { passive: true });
  }

  // ── 폼 검증(제출은 막고 문구만) ────────────────
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  $$('form.subscribe, form.member-form').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = $('.form-msg', f); msg.classList.remove('ok');
    const bad = $$('input[required]', f).find((x) => (x.type === 'checkbox' ? !x.checked : !x.value.trim()) || (x.type === 'email' && !emailOk(x.value.trim())));
    $$('input', f).forEach((x) => x.removeAttribute('aria-invalid'));
    if (bad) {
      bad.setAttribute('aria-invalid', 'true');
      msg.textContent = bad.type === 'checkbox' ? '개인정보 수집 및 이용에 동의해 주세요.' : bad.type === 'email' && bad.value.trim() ? '이메일 주소 형식을 확인해 주세요.' : `${(f.querySelector('label[for="' + bad.id + '"]') || {}).textContent || bad.placeholder} 칸을 채워 주세요.`;
      bad.focus(); return;
    }
    if (f.classList.contains('subscribe')) { msg.textContent = '구독 신청을 받았습니다. 확인 메일을 보냈습니다.'; msg.classList.add('ok'); f.reset(); return; }
    msg.textContent = f.dataset.ok;
  }));

  // ── 검색 결과 ─────────────────────────────────
  const sd = $('#search-data');
  if (sd) {
    const all = JSON.parse(sd.textContent);
    const q = (new URLSearchParams(location.search).get('keyword') || '').trim();
    const t = $('#search-title'), list = $('.search-list'), empty = $('.search-empty');
    if (!q) { t.textContent = 'Search'; empty.textContent = '검색어를 입력해 주세요.'; $('.search-inline').style.display = 'flex'; }
    else {
      t.textContent = q; document.title = q + ' - TOLDE';
      const hit = all.filter((p) => p.t.toLowerCase().includes(q.toLowerCase()));
      empty.textContent = hit.length ? '' : `‘${q}’ 검색 결과가 없습니다.`;
      list.innerHTML = hit.map((p) => `<li><a href="${ROOT}product/${p.s}/index.html"><img src="${ROOT}${p.i}" alt=""><span><span>${p.n}</span>${p.l.split('|').map((x) => `<span>${x}</span>`).join('')}<span>${won(p.p)}</span>${p.r ? `<span><s>${won(p.o)}</s> ${p.r}%</span>` : ''}</span></a></li>`).join('');
    }
  }

  // ── 오늘 날짜(원본: 접속한 날) ─────────────────
  const today = $('#today');
  if (today) {
    const d = new Date(); const D = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    today.innerHTML = `${D[d.getDay()]},<br>${d.getDate()} ${M[d.getMonth()]}<br>${d.getFullYear()}`;
  }
})();
