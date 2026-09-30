// LOW LANTERN RECORDS — 메뉴 · 카탈로그 필터 · 보기 전환 · 투어 필터 · 상점/장바구니 · 뉴스레터
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- 모바일 메뉴 ----------
  const menuBtn = $('.menu-btn');
  const menu = $('#menu');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    menuBtn.textContent = open ? 'Close' : 'Menu';
    if (open) { const a = $('a', menu); if (a) a.focus(); }
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
    });
    matchMedia('(min-width: 861px)').addEventListener('change', (m) => { if (m.matches && !menu.hidden) setMenu(false); });
  }

  // ---------- 카탈로그: 형식 · 연도 · 보기 ----------
  const filters = $('[data-filters]');
  if (filters) {
    const state = { format: 'all', year: 'all', view: 'grid' };
    const q = new URLSearchParams(location.search);
    for (const k of ['format', 'year', 'view']) if (q.get(k)) state[k] = q.get(k);
    const grid = $('[data-view-grid]'), list = $('[data-view-list]'), none = $('[data-none]'), count = $('[data-count]');
    function apply(push) {
      $$('[data-f]').forEach((b) => b.setAttribute('aria-pressed', String(state[b.dataset.f] === b.dataset.v)));
      $$('[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(state.view === b.dataset.view)));
      const match = (el) => (state.format === 'all' || el.dataset.format === state.format) && (state.year === 'all' || el.dataset.year === state.year);
      let n = 0;
      $$('.card', grid).forEach((el) => { const ok = match(el); el.hidden = !ok; if (ok) n++; });
      $$('tbody tr', list).forEach((el) => { el.hidden = !match(el); });
      grid.hidden = state.view !== 'grid' || n === 0;
      list.hidden = state.view !== 'list' || n === 0;
      none.hidden = n > 0;
      count.textContent = n === 1 ? '1 release' : n + ' releases';
      if (push) {
        const p = new URLSearchParams();
        for (const [k, v] of Object.entries(state)) if (v !== 'all' && !(k === 'view' && v === 'grid')) p.set(k, v);
        const s = p.toString();
        try { history.replaceState(null, '', s ? '?' + s : location.pathname); } catch (e) { /* file:// 일부 브라우저 */ }
      }
    }
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.f) state[b.dataset.f] = b.dataset.v;
      if (b.dataset.view) state.view = b.dataset.view;
      apply(true);
    });
    $('[data-reset]').addEventListener('click', () => { state.format = 'all'; state.year = 'all'; apply(true); $('[data-f="format"][data-v="all"]').focus(); });
    apply(false);
  }

  // ---------- 투어 지역 ----------
  const tourTbl = $('[data-tour]');
  if (tourTbl) {
    const chips = $$('[data-region]').filter((b) => b.tagName === 'BUTTON');
    const cnt = $('[data-tour-count]');
    function setRegion(r) {
      chips.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.region === r)));
      let n = 0;
      $$('tbody tr', tourTbl).forEach((tr) => { const ok = r === 'all' || tr.dataset.region === r; tr.hidden = !ok; if (ok) n++; });
      cnt.textContent = n === 1 ? '1 date' : n + ' dates';
      try { history.replaceState(null, '', r === 'all' ? location.pathname : '?region=' + r); } catch (e) { /* */ }
    }
    chips.forEach((b) => b.addEventListener('click', () => setRegion(b.dataset.region)));
    const r0 = new URLSearchParams(location.search).get('region');
    if (r0 && chips.some((b) => b.dataset.region === r0)) setRegion(r0);
  }

  // ---------- 장바구니 ----------
  const KEY = 'lowlantern-cart-v1';
  const load = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
  const save = (c) => { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* 저장 불가 환경 */ } };
  let cart = load();
  const gbp = (n) => '£' + (Number.isInteger(n) ? n : n.toFixed(2));
  const drawer = $('#cart');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  function render() {
    const items = cart.reduce((s, l) => s + l.qty, 0);
    $$('[data-cart-count]').forEach((el) => { el.textContent = items; });
    $$('[data-cart-open]').forEach((b) => b.setAttribute('aria-label', `Cart, ${items} ${items === 1 ? 'item' : 'items'}`));
    if (!drawer) return;
    const ul = $('[data-cart-lines]', drawer);
    ul.innerHTML = cart.map((l, i) => `<li data-i="${i}">
      <div><p class="l-t"><span class="tab">${esc(l.cat)}</span> ${esc(l.title)}</p><p class="l-m">${esc(l.artist)} · ${esc(l.fmt)} · ${gbp(l.price)} each</p></div>
      <p class="l-p tab">${gbp(l.price * l.qty)}</p>
      <div class="l-ctl">
        <div class="qty" role="group" aria-label="Quantity, ${esc(l.cat)} ${esc(l.fmt)}">
          <button type="button" class="q-b" data-lq="-1" aria-label="Decrease quantity">−</button>
          <input class="tab" type="number" value="${l.qty}" min="1" max="${l.max}" aria-label="Quantity" data-lin>
          <button type="button" class="q-b" data-lq="1" aria-label="Increase quantity"${l.qty >= l.max ? ' disabled' : ''}>+</button>
        </div>
        <button type="button" class="l-rm" data-rm>Remove</button>
      </div>
    </li>`).join('');
    const empty = cart.length === 0;
    $('[data-cart-empty]', drawer).hidden = !empty;
    $('[data-cart-sum]', drawer).hidden = empty;
    const onlyDigital = cart.length && cart.every((l) => l.fmt === 'Digital');
    const ship = $('[data-ship]', drawer);
    if (onlyDigital) ship.value = '0';
    else if (ship.value === '0') ship.value = '4';
    $$('option', ship).forEach((o) => { o.disabled = onlyDigital ? o.value !== '0' : o.value === '0'; });
    const sub = cart.reduce((s, l) => s + l.price * l.qty, 0);
    const sh = Number(ship.value);
    $('[data-cart-sub]', drawer).textContent = gbp(sub);
    $('[data-cart-ship]', drawer).textContent = gbp(sh);
    $('[data-cart-total]', drawer).textContent = gbp(sub + sh);
  }
  function setQty(i, q) {
    const l = cart[i];
    if (!l) return;
    l.qty = Math.max(1, Math.min(l.max, Math.round(q) || 1));
    save(cart); render();
  }
  if (drawer) {
    let opener = null;
    $$('[data-cart-open]').forEach((b) => b.addEventListener('click', () => {
      opener = b; if (menu && !menu.hidden) setMenu(false);
      $('[data-checkout-note]', drawer).textContent = '';
      drawer.showModal(); document.documentElement.style.overflow = 'hidden';
    }));
    drawer.addEventListener('close', () => { document.documentElement.style.overflow = ''; if (opener) opener.focus(); });
    $('[data-cart-close]', drawer).addEventListener('click', () => drawer.close());
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) { drawer.close(); return; } // 바깥(backdrop) 클릭
      const li = e.target.closest('li[data-i]');
      if (!li) return;
      const i = Number(li.dataset.i);
      if (e.target.closest('[data-lq]')) {
        const d = Number(e.target.closest('[data-lq]').dataset.lq);
        setQty(i, cart[i].qty + d);
        const again = $(`li[data-i="${i}"] [data-lq="${d}"]`, drawer);
        if (again && !again.disabled) again.focus(); else { const inp = $(`li[data-i="${i}"] [data-lin]`, drawer); if (inp) inp.focus(); }
      } else if (e.target.closest('[data-rm]')) {
        cart.splice(i, 1); save(cart); render();
        const next = $$('[data-rm]', drawer)[Math.min(i, cart.length - 1)];
        (next || $('[data-cart-close]', drawer)).focus();
      }
    });
    drawer.addEventListener('change', (e) => {
      if (e.target.matches('[data-lin]')) setQty(Number(e.target.closest('li').dataset.i), Number(e.target.value));
      if (e.target.matches('[data-ship]')) render();
    });
    $('[data-checkout]', drawer).addEventListener('click', () => {
      $('[data-checkout-note]', drawer).textContent = 'Checkout not connected. No order placed, no payment taken.';
    });
  }
  window.addEventListener('storage', (e) => { if (e.key === KEY) { cart = load(); render(); } });

  // 상점 폼
  $$('[data-buy]').forEach((f) => {
    const sel = $('select', f), qty = $('input[name="qty"]', f), msg = $('[data-added]', f);
    const max = () => Number(sel.selectedOptions[0].dataset.max) || 1;
    function clamp() { qty.max = max(); qty.value = Math.max(1, Math.min(max(), Math.round(Number(qty.value)) || 1)); }
    sel.addEventListener('change', () => { clamp(); msg.textContent = ''; });
    qty.addEventListener('change', clamp);
    $$('[data-q]', f).forEach((b) => b.addEventListener('click', () => { qty.value = Number(qty.value) + Number(b.dataset.q); clamp(); }));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      clamp();
      const o = sel.selectedOptions[0];
      const line = { id: f.dataset.cat + '-' + o.value, cat: f.dataset.cat, title: f.dataset.title, artist: f.dataset.artist, fmt: o.value, price: Number(o.dataset.price), max: max(), qty: Number(qty.value) };
      const have = cart.find((l) => l.id === line.id);
      if (have) have.qty = Math.min(have.max, have.qty + line.qty); else cart.push(line);
      save(cart); render();
      const now = cart.find((l) => l.id === line.id).qty;
      msg.textContent = `In cart: ${now} × ${line.fmt}${now === line.max && line.max > 1 ? ' (limit reached)' : ''}.`;
    });
    clamp();
  });

  // ---------- 뉴스레터 ----------
  $$('[data-news]').forEach((f) => {
    const input = $('input', f), msg = $('[data-msg]', f);
    const re = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      let err = '';
      if (!v) err = 'Enter an email address.';
      else if (!re.test(v)) err = 'Check the email address — for example name@example.com.';
      input.setAttribute('aria-invalid', String(!!err));
      if (err) { msg.textContent = err; input.focus(); return; }
      msg.textContent = 'Not sent. Demo site — no mailing list is connected.';
    });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') { input.removeAttribute('aria-invalid'); msg.textContent = ''; } });
  });

  render();
})();
