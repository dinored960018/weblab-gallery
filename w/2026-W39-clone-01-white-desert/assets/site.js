/* ═══════════════════════════════════════════════════════════════
   모작 — white-desert.com 기능부
   PROTOCOL 4-4: 원본에 있는 기능은 전부 실제로 동작해야 한다.

   원본과 다르게 만든 것 (REVIEW.md에 기록)
   - ESC로 메가메뉴 닫기: 원본은 안 닫힌다. 접근성 최소선이라 넣었다.
   - role="dialog" + aria-modal: 원본에 없다. 넣었다.
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const lock = (on) => document.body.classList.toggle('is-locked', on);

  /* ── 그리드 가이드 — 원본에 실제로 보인다 ── */
  const overlay = $('.grid-overlay');
  if (overlay) {
    const n = 6;
    for (let i = 0; i <= n; i++) {
      const bar = document.createElement('i');
      bar.style.left = `calc(var(--edge) + (100% - var(--edge)*2) * ${i / n})`;
      overlay.appendChild(bar);
    }
  }

  /* ── 메가메뉴 (데스크톱 탭) ── */
  const menu = $('.menu');
  const mmenu = $('.mmenu');
  let lastFocus = null;

  const openMenu = (which) => {
    if (!menu) return;
    lastFocus = document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    lock(true);
    if (which) selectTab(which);
    const first = $('.menu-tabs .btn[aria-selected="true"]', menu) || $('.menu-tabs .btn', menu);
    first && first.focus();
  };
  const closeMenu = () => {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    lock(false);
    lastFocus && lastFocus.focus();
  };
  const selectTab = (name) => {
    $$('.menu-tabs .btn', menu).forEach((b) => {
      const on = b.dataset.tab === name;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    $$('.menu-panel-group', menu).forEach((g) => {
      g.classList.toggle('is-active', g.dataset.tab === name);
      g.hidden = g.dataset.tab !== name;
    });
  };

  $$('[data-open-menu]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMenu(btn.dataset.openMenu);
    });
  });
  $$('.menu-tabs .btn').forEach((b) => {
    b.addEventListener('click', () => selectTab(b.dataset.tab));
    // 탭 목록은 좌우 화살표로 이동한다
    b.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const tabs = $$('.menu-tabs .btn');
      const i = tabs.indexOf(b);
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(next.dataset.tab);
      next.focus();
    });
  });
  $$('[data-close-menu]').forEach((b) => b.addEventListener('click', closeMenu));
  // 바깥(배경) 클릭으로 닫힌다
  $('.menu-bg') && $('.menu-bg').addEventListener('click', closeMenu);

  /* ── 모바일 메뉴 + 아코디언 ── */
  const openM = () => { if (!mmenu) return; mmenu.classList.add('is-open'); mmenu.setAttribute('aria-hidden', 'false'); lock(true); };
  const closeM = () => { if (!mmenu) return; mmenu.classList.remove('is-open'); mmenu.setAttribute('aria-hidden', 'true'); lock(false); };
  $$('[data-open-mmenu]').forEach((b) => b.addEventListener('click', openM));
  $$('[data-close-mmenu]').forEach((b) => b.addEventListener('click', closeM));

  $$('.mmenu-trigger').forEach((t) => {
    t.addEventListener('click', () => {
      const open = t.getAttribute('aria-expanded') === 'true';
      $$('.mmenu-trigger').forEach((o) => o.setAttribute('aria-expanded', 'false'));
      t.setAttribute('aria-expanded', String(!open));
    });
  });

  /* ── 아코디언 (FAQ 등) ── */
  $$('.acc-trigger').forEach((t) => {
    t.addEventListener('click', () => {
      t.setAttribute('aria-expanded', String(t.getAttribute('aria-expanded') !== 'true'));
    });
  });

  /* ── 모달 (Watch Film) ── */
  const openModal = (m) => { m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false'); lock(true); const c = $('.modal-close', m); c && c.focus(); };
  const closeModal = (m) => { m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); lock(false); };
  $$('[data-open-modal]').forEach((b) => {
    b.addEventListener('click', () => { const m = $('#' + b.dataset.openModal); m && openModal(m); });
  });
  $$('.modal').forEach((m) => {
    $('.modal-bg', m) && $('.modal-bg', m).addEventListener('click', () => closeModal(m));
    $$('[data-close-modal]', m).forEach((b) => b.addEventListener('click', () => closeModal(m)));
  });

  /* ── ESC — 열려 있는 것을 닫는다 ──
     원본은 ESC가 동작하지 않는다. 접근성 최소선이라 넣었다. */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const m = $('.modal.is-open');
    if (m) { closeModal(m); return; }
    if (mmenu && mmenu.classList.contains('is-open')) { closeM(); return; }
    if (menu && menu.classList.contains('is-open')) closeMenu();
  });

  /* ── 열린 패널 안에 포커스를 가둔다 ── */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const box = $('.modal.is-open .modal-box') || (mmenu && mmenu.classList.contains('is-open') ? mmenu : null)
      || (menu && menu.classList.contains('is-open') ? $('.menu-panel', menu) : null);
    if (!box) return;
    const f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', box)
      .filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ── 쿠키 배너 ── */
  const cookie = $('.cookie');
  if (cookie) {
    let seen = null;
    try { seen = localStorage.getItem('au-cookie'); } catch { seen = null; }
    if (seen) cookie.classList.add('is-gone');
    $$('[data-cookie]', cookie).forEach((b) => {
      b.addEventListener('click', () => {
        cookie.classList.add('is-gone');
        try { localStorage.setItem('au-cookie', b.dataset.cookie); } catch { /* 차단된 환경 */ }
      });
    });
  }

  /* ── 갤러리 슬라이더 ── */
  $$('.slider').forEach((sl) => {
    const track = $('.slider-track', sl);
    const items = $$('.slider-item', track);
    const prev = $('[data-slide="prev"]', sl);
    const next = $('[data-slide="next"]', sl);
    let i = 0;
    const perView = () => (window.innerWidth <= 860 ? 1 : window.innerWidth <= 1100 ? 2 : 3);
    const maxI = () => Math.max(0, items.length - perView());
    const apply = () => {
      i = Math.min(i, maxI());
      const step = items[0] ? items[0].getBoundingClientRect().width + 12 : 0;
      track.style.transform = `translateX(${-i * step}px)`;
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i >= maxI();
      items.forEach((it, n) => { it.setAttribute('aria-hidden', String(n < i || n >= i + perView())); });
    };
    prev && prev.addEventListener('click', () => { i = Math.max(0, i - 1); apply(); });
    next && next.addEventListener('click', () => { i = Math.min(maxI(), i + 1); apply(); });
    window.addEventListener('resize', apply);
    apply();
  });

  /* ── 필터 (일정 목록) ── */
  $$('[data-filter-group]').forEach((group) => {
    const targets = $$('[data-cat]', document.querySelector(group.dataset.filterGroup) || document);
    $$('button[data-filter]', group).forEach((b) => {
      b.addEventListener('click', () => {
        const v = b.dataset.filter;
        $$('button[data-filter]', group).forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
        targets.forEach((t) => {
          const show = v === 'all' || t.dataset.cat === v;
          t.hidden = !show;
        });
      });
    });
  });

  /* ── 폼 — 제출은 막고 검증 메시지는 보인다 ── */
  $$('form[data-validate]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('[required]', form).forEach((el) => {
        const wrap = el.closest('.field');
        const err = wrap ? $('.err', wrap) : null;
        let msg = '';
        if (!el.value.trim()) msg = 'Required';
        else if (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) msg = 'Check the address';
        if (msg) ok = false;
        wrap && wrap.classList.toggle('is-bad', !!msg);
        if (err) err.textContent = msg;
      });
      const done = $('[data-form-done]', form);
      if (done) done.textContent = ok ? 'Sent. Demo only — nothing was submitted.' : '';
    });
  });

  /* ── 스크롤에 따라 단어가 진해지는 문장 ── */
  const scrubs = $$('.scrub');
  if (scrubs.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    scrubs.forEach((el) => {
      if (el.dataset.split) return;
      el.dataset.split = '1';
      el.innerHTML = el.textContent.trim().split(/(\s+)/)
        .map((w) => (w.trim() ? `<span>${w}</span>` : w)).join('');
    });
    const onScroll = () => {
      scrubs.forEach((el) => {
        const r = el.getBoundingClientRect();
        const words = $$('span', el);
        const p = 1 - (r.top - window.innerHeight * 0.28) / (window.innerHeight * 0.55);
        const lit = Math.round(Math.max(0, Math.min(1, p)) * words.length);
        words.forEach((w, n) => w.classList.toggle('lit', n < lit));
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
  }

  /* ── 히어로를 지나면 헤더가 밝은 배경용으로 바뀐다 ── */
  const nav = $('.nav');
  const hero = $('.hero');
  if (nav && hero) {
    const io = new IntersectionObserver(
      ([e]) => nav.classList.toggle('on-light', !e.isIntersecting),
      { rootMargin: '-72px 0px 0px 0px' },
    );
    io.observe(hero);
  } else if (nav) {
    nav.classList.add('on-light');
  }
})();
