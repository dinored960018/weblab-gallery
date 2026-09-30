// BRIAR 찔레 — 통화 · 가방 · 서랍 · 모달 · 필터 · 갤러리 · 폼
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ROOT = document.body.dataset.root || '';
  const CAT = (window.BRIAR && window.BRIAR.products) || {};
  const RATE = (window.BRIAR && window.BRIAR.rate) || 1350;

  // 저장소 — 막혀 있어도 화면은 돈다
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* 무시 */ } },
  };

  // ── 통화 ──
  let cur = store.get('briar-cur', null);
  const fmt = (krw) => (cur === 'USD' ? 'USD ' + Math.round(krw / RATE).toLocaleString('en-US') : 'KRW ' + krw.toLocaleString('en-US'));
  function applyCur() {
    $$('[data-krw]').forEach((el) => { el.textContent = fmt(+el.dataset.krw); });
    $$('.cur-label').forEach((el) => { el.textContent = cur === 'USD' ? 'USD $' : 'KRW ₩'; });
    $$('.loc-opts [data-cur]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cur === (cur || 'KRW'))));
    renderBag();
  }

  // ── 대화상자 공통: 포커스 가둠, ESC, 바깥 클릭 ──
  let openDlg = null, lastFocus = null;
  const focusables = (el) => $$('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])', el).filter((x) => x.offsetParent !== null || x === document.activeElement);
  function openDialog(el, { onClose, focus } = {}) {
    if (openDlg) closeDialog(true);
    lastFocus = document.activeElement;
    el.hidden = false;
    openDlg = { el, onClose };
    document.body.classList.add('lock');
    requestAnimationFrame(() => (focus || focusables(el)[0] || el).focus());
  }
  function closeDialog(silent) {
    if (!openDlg) return;
    const { el, onClose } = openDlg;
    openDlg = null;
    if (onClose) onClose(el); else el.hidden = true;
    if (!$('.mnav:not([hidden])')) document.body.classList.remove('lock');
    if (!silent && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('keydown', (e) => {
    if (!openDlg) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDialog(); return; }
    if (e.key === 'Tab') {
      const f = focusables(openDlg.el); if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
  document.addEventListener('click', (e) => {
    if (!openDlg) return;
    if (e.target.closest('[data-close]') && openDlg.el.contains(e.target)) { closeDialog(); return; }
    // 바깥 클릭: 모달 바탕(자기 자신) 또는 서랍 뒤 가림막
    if (e.target === openDlg.el || e.target.classList.contains('scrim')) closeDialog();
  });

  // ── 쇼핑 지역 ──
  const loc = $('#loc');
  function openLoc() { openDialog(loc, { focus: $(`.loc-opts [data-cur="${cur || 'KRW'}"]`, loc), onClose: (el) => { el.hidden = true; if (!cur) { cur = 'KRW'; store.set('briar-cur', cur); applyCur(); } } }); }
  $$('.cur-btn').forEach((b) => b.addEventListener('click', () => { closeMenu(); openLoc(); }));
  $$('.loc-opts [data-cur]').forEach((b) => b.addEventListener('click', () => { cur = b.dataset.cur; store.set('briar-cur', cur); applyCur(); closeDialog(); }));

  // ── 모바일 메뉴 ──
  const burger = $('.burger'), mnav = $('#mnav');
  function closeMenu() { if (!mnav || mnav.hidden) return; mnav.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('lock'); }
  burger && burger.addEventListener('click', () => {
    const open = mnav.hidden;
    mnav.hidden = !open; burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('lock', open);
    if (open) $('a', mnav).focus();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mnav && !mnav.hidden && !openDlg) { closeMenu(); burger.focus(); } });
  matchMedia('(min-width: 861px)').addEventListener('change', (m) => { if (m.matches) closeMenu(); });

  // ── 가방 ──
  let bag = store.get('briar-bag', []).filter((l) => CAT[l.id]);
  const lineKey = (l) => l.id + '|' + l.opt;
  const linePrice = (l) => CAT[l.id].price + (l.add || 0);
  const saveBag = () => { store.set('briar-bag', bag); renderBag(); };
  function addToBag(item) {
    const hit = bag.find((l) => lineKey(l) === lineKey(item));
    if (hit) hit.qty = Math.min(5, hit.qty + item.qty); else bag.push(item);
    saveBag();
  }
  function lineHtml(l, i, big) {
    const p = CAT[l.id];
    return `<li class="line"><a class="line-img" href="${ROOT}${p.url}" tabindex="-1" aria-hidden="true"><img src="${ROOT}${p.img}" alt="" width="800" height="1000"></a>
      <div class="line-t"><a href="${ROOT}${p.url}">${p.name}</a>${l.opt ? `<span class="line-o">${l.opt}</span>` : ''}<span data-krw="${linePrice(l) * l.qty}">${fmt(linePrice(l) * l.qty)}</span>
      <div class="line-ctl"><div class="qty-c" role="group" aria-label="${p.name} 수량"><button type="button" data-lq="-1" data-i="${i}" aria-label="수량 줄이기">−</button><span aria-live="polite">${l.qty}</span><button type="button" data-lq="1" data-i="${i}" aria-label="수량 늘리기">+</button></div><button class="line-rm" type="button" data-rm="${i}">삭제</button></div></div>
      ${big ? `<span class="line-p" data-krw="${linePrice(l)}">${fmt(linePrice(l))}</span>` : ''}</li>`;
  }
  const subtotal = () => bag.reduce((s, l) => s + linePrice(l) * l.qty, 0);
  function renderBag() {
    const n = bag.reduce((s, l) => s + l.qty, 0);
    $$('.bag-n').forEach((el) => { el.textContent = n; });
    const list = $('.dr-list');
    if (list) list.innerHTML = bag.length ? `<ul>${bag.map((l, i) => lineHtml(l, i, false)).join('')}</ul>` : '<p class="dr-empty">가방이 비어 있어요.</p>';
    const tot = $('.dr-total'); if (tot) tot.textContent = fmt(subtotal());
    // 가방 페이지
    const bl = $('.bag-list');
    if (bl) {
      bl.innerHTML = bag.map((l, i) => lineHtml(l, i, true)).join('');
      $('.bag-empty').hidden = !!bag.length;
      const sub = subtotal(), ship = !bag.length ? 0 : cur === 'USD' ? 25 * RATE : sub >= 70000 ? 0 : 3000;
      $('.s-sub').textContent = fmt(sub);
      $('.s-ship').textContent = !bag.length ? '—' : ship ? fmt(ship) : '무료';
      $('.s-tot').textContent = fmt(sub + ship);
      $('.s-note').textContent = cur === 'USD' ? '해외 배송 EMS 25달러 고정' : sub >= 70000 || !bag.length ? '7만 원 이상 무료 배송' : `${(70000 - sub).toLocaleString('ko-KR')}원 더 담으면 무료 배송`;
    }
  }
  document.addEventListener('click', (e) => {
    const q = e.target.closest('[data-lq]'), rm = e.target.closest('[data-rm]');
    if (q) { const l = bag[+q.dataset.i]; l.qty = Math.max(1, Math.min(5, l.qty + +q.dataset.lq)); saveBag(); const again = $(`[data-lq="${q.dataset.lq}"][data-i="${q.dataset.i}"]`, q.closest('.drawer, .bag-list') || document); again && again.focus(); }
    if (rm) { bag.splice(+rm.dataset.rm, 1); saveBag(); const f = $('.line-rm') || $('.drawer .x') ; if (openDlg || $('.bag-list')) (f || document.body).focus(); }
  });

  // 서랍
  const drawer = $('#drawer'), scrim = $('.scrim'), bagBtn = $('.bag-btn');
  function openDrawer() {
    scrim.hidden = false;
    openDialog(drawer, { focus: $('.x', drawer), onClose: (el) => { el.classList.remove('open'); bagBtn.setAttribute('aria-expanded', 'false'); scrim.hidden = true; const done = () => { if (!el.classList.contains('open')) el.hidden = true; }; matchMedia('(prefers-reduced-motion: reduce)').matches ? done() : setTimeout(done, 290); } });
    bagBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => requestAnimationFrame(() => drawer.classList.add('open')));
  }
  bagBtn && bagBtn.addEventListener('click', openDrawer);

  // ── 샵 필터 · 정렬 ──
  const grid = $('.shop-grid');
  if (grid) {
    const tiles = $$('.tile', grid), sub = $('.cats.sub'), SUBS = ['decks', 'grip', 'wheels'];
    const setF = (f, push) => {
      if (!$(`.cats [data-f="${f}"]`)) f = 'all';
      const main = SUBS.includes(f) ? 'skateboard' : f;
      $$('.cats:not(.sub) [data-f]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === main)));
      $$('[data-f]', sub).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
      sub.hidden = main !== 'skateboard';
      let n = 0;
      tiles.forEach((t) => {
        const ok = f === 'all' || (f === 'new' ? t.dataset.new === '1' : t.dataset.cat === f || t.dataset.sub === f);
        t.hidden = !ok; if (ok) n++;
      });
      $('.count-n').textContent = n; $('.empty').hidden = n > 0;
      if (push) history.replaceState(null, '', '#' + f);
    };
    $$('.cats [data-f]').forEach((b) => b.addEventListener('click', () => setF(b.dataset.f, true)));
    $('#sort').addEventListener('change', (e) => {
      const v = e.target.value;
      tiles.sort((a, b) => (v === 'low' ? a.dataset.price - b.dataset.price : v === 'high' ? b.dataset.price - a.dataset.price : a.dataset.order - b.dataset.order)).forEach((t) => grid.appendChild(t));
    });
    setF(location.hash.slice(1) || 'all', false);
    addEventListener('hashchange', () => setF(location.hash.slice(1), false));
  }

  // ── 제품 상세 ──
  const gal = $('.gal');
  if (gal) {
    const slides = $$('.gal-slide', gal), thumbs = $$('.gal-thumbs button', gal);
    let i = 0;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { s.hidden = k !== i; });
      thumbs.forEach((t, k) => t.setAttribute('aria-pressed', String(k === i)));
      $('.gal-i', gal).textContent = i + 1;
    };
    $('.gal-prev', gal).addEventListener('click', () => go(i - 1));
    $('.gal-next', gal).addEventListener('click', () => go(i + 1));
    thumbs.forEach((t) => t.addEventListener('click', () => go(+t.dataset.i)));
    gal.tabIndex = -1;
    $('.gal-main', gal).tabIndex = 0;
    $('.gal-main', gal).setAttribute('aria-label', '제품 사진. 왼쪽·오른쪽 화살표 키로 넘겨요');
    gal.addEventListener('keydown', (e) => {
      if (e.target.closest('.gal-thumbs') && !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    });
  }
  const form = $('.pd-form');
  if (form) {
    const qty = $('input[name="qty"]', form), eQ = $('#err-qty'), eO = $('#err-opt');
    const clampQ = () => { const v = Math.round(+qty.value); if (!v || v < 1 || v > 5) { eQ.textContent = '수량은 1~5개로 골라 주세요'; eQ.hidden = false; qty.setAttribute('aria-invalid', 'true'); return false; } eQ.hidden = true; qty.removeAttribute('aria-invalid'); qty.value = v; return true; };
    $$('[data-q]', form).forEach((b) => b.addEventListener('click', () => { qty.value = Math.max(1, Math.min(5, (+qty.value || 1) + +b.dataset.q)); clampQ(); }));
    qty.addEventListener('change', clampQ);
    $$('input[type="radio"]', form).forEach((r) => r.addEventListener('change', () => { if (eO) eO.hidden = true; }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fs = $('.opt[data-required]', form);
      let opt = '', add = 0;
      if (fs) {
        const c = $('input:checked', fs);
        if (!c) { eO.textContent = fs.querySelector('legend').textContent === '그립 작업' ? '그립 작업을 선택해 주세요' : '사이즈를 선택해 주세요'; eO.hidden = false; $('input', fs).focus(); return; }
        opt = c.value; add = +c.dataset.add || 0;
      } else { const h = $('input[type="hidden"][name="opt"]', form); opt = h ? h.value : ''; }
      if (!clampQ()) { qty.focus(); return; }
      addToBag({ id: form.dataset.id, opt, add, qty: +qty.value });
      $('.added', form).textContent = `가방에 담았어요 · ${opt ? opt + ' · ' : ''}${qty.value}개`;
      openDrawer();
    });
    const sg = $('#sizeguide'), sgBtn = $('.sg-open');
    sgBtn && sgBtn.addEventListener('click', () => openDialog(sg));
  }
  // 탭
  $$('[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    const sel = (t, focus) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
      if (focus) t.focus();
    };
    tabs.forEach((t, k) => {
      t.addEventListener('click', () => sel(t));
      t.addEventListener('keydown', (e) => {
        const m = { ArrowRight: k + 1, ArrowLeft: k - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (m === undefined) return;
        e.preventDefault(); sel(tabs[(m + tabs.length) % tabs.length], true);
      });
    });
  });

  // ── 룩북 보기 ──
  const viewer = $('#viewer');
  if (viewer) {
    const btns = $$('.lb-grid button'), img = $('img', viewer), n = $('.v-n', viewer);
    let i = 0;
    const show = (k) => { i = (k + btns.length) % btns.length; const s = $('img', btns[i]); img.src = s.src; img.alt = s.alt; n.textContent = `${String(i + 1).padStart(2, '0')} / ${String(btns.length).padStart(2, '0')}`; };
    btns.forEach((b) => b.addEventListener('click', () => { show(+b.dataset.i); openDialog(viewer, { focus: $('.v-next', viewer), onClose: (el) => { el.hidden = true; lastFocus = btns[i]; } }); }));
    $('.v-prev', viewer).addEventListener('click', () => show(i - 1));
    $('.v-next', viewer).addEventListener('click', () => show(i + 1));
    document.addEventListener('keydown', (e) => { if (viewer.hidden) return; if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); } });
    viewer.addEventListener('click', (e) => { if (e.target === viewer || e.target.classList.contains('v-fig')) closeDialog(); });
  }

  // ── 아코디언 ──
  $$('.acc button').forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    document.getElementById(b.getAttribute('aria-controls')).hidden = !open;
  }));

  // ── 폼 검증 ──
  const RULES = {
    name: (v) => (v.trim().length >= 2 ? '' : '이름을 두 글자 이상 입력해 주세요'),
    phone: (v) => (/^01[016789]-?\d{3,4}-?\d{4}$/.test(v.trim()) ? '' : '휴대전화 번호를 확인해 주세요. 예: 010-1234-5678'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : '이메일 주소를 확인해 주세요'),
    zip: (v) => (/^\d{5}$/.test(v.trim()) ? '' : '우편번호 5자리를 입력해 주세요'),
    text: (v) => (v.trim() ? '' : '주소를 입력해 주세요'),
    pw: (v) => (v.length >= 8 ? '' : '비밀번호는 8자 이상이에요'),
    orderno: (v) => (/^\d{8}-\d{4}$/.test(v.trim()) ? '' : '주문 번호 형식을 확인해 주세요. 예: 20260930-0001'),
  };
  const EMPTY = { name: '이름을 입력해 주세요', phone: '휴대전화 번호를 입력해 주세요', email: '이메일을 입력해 주세요', zip: '우편번호를 입력해 주세요', text: '주소를 입력해 주세요', pw: '비밀번호를 입력해 주세요', orderno: '주문 번호를 입력해 주세요' };
  function check(inp) {
    const rule = inp.dataset.rule, e = document.getElementById(inp.id + '-e');
    const msg = !inp.value.trim() ? EMPTY[rule] : RULES[rule](inp.value);
    inp.setAttribute('aria-invalid', String(!!msg)); if (!msg) inp.removeAttribute('aria-invalid');
    e.textContent = msg; e.hidden = !msg;
    return !msg;
  }
  $$('.vform').forEach((f) => {
    // 오류가 난 칸만 입력하는 동안 다시 검사한다(포커스 이탈 검사는 문구가 사라지며 레이아웃이 밀려 클릭을 놓치게 한다)
    $$('[data-rule]', f).forEach((inp) => inp.addEventListener('input', () => { if (inp.getAttribute('aria-invalid') === 'true') check(inp); }));
    f.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let bad = null;
      $$('[data-rule]', f).forEach((inp) => { if (!check(inp) && !bad) bad = inp; });
      const pay = $$('input[name="o-pay"]', f);
      if (pay.length) { const ok = pay.some((r) => r.checked), e = $('#o-pay-e'); e.textContent = ok ? '' : '결제 수단을 선택해 주세요'; e.hidden = ok; if (!ok && !bad) bad = pay[0]; }
      const ag = $('#o-agree', f);
      if (ag) { const e = $('#o-agree-e'); e.textContent = ag.checked ? '' : '동의가 필요해요'; e.hidden = ag.checked; if (!ag.checked && !bad) bad = ag; }
      const msg = $('.form-msg', f);
      if (bad) { msg.textContent = '표시한 칸을 확인해 주세요'; bad.focus(); return; }
      const kind = f.dataset.kind;
      if (kind === 'order' && !bag.length) { msg.textContent = '가방이 비어 있어요'; return; }
      msg.textContent = { signin: '연습용 사이트라 로그인은 진행되지 않아요', 'order-lookup': '연습용 사이트라 조회할 주문이 없어요', order: '연습용 사이트라 결제는 진행되지 않아요' }[kind];
    });
    $$('input[type="radio"], input[type="checkbox"]', f).forEach((r) => r.addEventListener('change', () => { const e = document.getElementById((r.name === 'o-pay' ? 'o-pay' : r.id) + '-e'); if (e) e.hidden = true; }));
  });

  // ── 시작 ──
  applyCur();
  if (!cur) openLoc();
})();
