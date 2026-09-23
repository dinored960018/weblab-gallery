/* ═══════════════════════════════════════════════════════════════
   모작 — lxlcreative.co.uk 기능부
   PROTOCOL 4-4: 원본에 있는 기능은 전부 실제로 동작해야 한다.

   원본과 다르게 만든 것 (REVIEW.md 기록)
   - 드롭다운을 키보드로 열 수 있게 했다. 원본은 호버 전용이다.
   - ESC 닫기 · 포커스 트랩 · role="dialog" 를 넣었다.
   ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const lock = (on) => document.body.classList.toggle('is-locked', on);

  /* ── 드롭다운 4종 ──
     원본은 호버만 된다. 키보드로도 열리게 했다. */
  const hosts = $$('.dd-host');
  const closeAllDd = (except) => hosts.forEach((h) => {
    if (h === except) return;
    h.querySelector('.dd').classList.remove('is-open');
    const t = h.querySelector('[aria-expanded]');
    t && t.setAttribute('aria-expanded', 'false');
  });
  hosts.forEach((host) => {
    const trigger = host.querySelector('[aria-expanded]');
    const panel = host.querySelector('.dd');
    if (!trigger || !panel) return;
    const open = () => { closeAllDd(host); panel.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); };
    const close = () => { panel.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); };
    host.addEventListener('mouseenter', open);
    host.addEventListener('mouseleave', close);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        open();
        const first = panel.querySelector('a');
        first && first.focus();
      }
    });
    host.addEventListener('focusout', (e) => {
      if (!host.contains(e.relatedTarget)) close();
    });
  });

  /* ── 모바일 메뉴 ── */
  const mm = $('.mm');
  let lastFocus = null;
  const openMM = () => {
    if (!mm) return;
    lastFocus = document.activeElement;
    mm.classList.add('is-open');
    mm.setAttribute('aria-hidden', 'false');
    lock(true);
    const c = $('.mm-close', mm); c && c.focus();
  };
  const closeMM = () => {
    if (!mm) return;
    mm.classList.remove('is-open');
    mm.setAttribute('aria-hidden', 'true');
    lock(false);
    lastFocus && lastFocus.focus();
  };
  $$('[data-open-mm]').forEach((b) => b.addEventListener('click', openMM));
  $$('[data-close-mm]').forEach((b) => b.addEventListener('click', closeMM));

  /* ── 모바일 아코디언 + 일반 아코디언 ── */
  $$('.mm-trigger, .acc-t').forEach((t) => {
    t.addEventListener('click', () => {
      t.setAttribute('aria-expanded', String(t.getAttribute('aria-expanded') !== 'true'));
    });
  });

  /* ── 모달 ── */
  const openModal = (m) => { m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false'); lock(true); const c = $('.modal-close', m); c && c.focus(); };
  const closeModal = (m) => { m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); lock(false); };
  $$('[data-open-modal]').forEach((b) => b.addEventListener('click', () => { const m = $('#' + b.dataset.openModal); m && openModal(m); }));
  $$('.modal').forEach((m) => {
    $('.modal-bg', m) && $('.modal-bg', m).addEventListener('click', () => closeModal(m));
    $$('[data-close-modal]', m).forEach((b) => b.addEventListener('click', () => closeModal(m)));
  });

  /* ── ESC ── */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const m = $('.modal.is-open');
    if (m) { closeModal(m); return; }
    if (mm && mm.classList.contains('is-open')) { closeMM(); return; }
    if ($('.dd.is-open')) closeAllDd(null);
  });

  /* ── 열린 패널 안에 포커스를 가둔다 ── */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const box = $('.modal.is-open .modal-box') || (mm && mm.classList.contains('is-open') ? $('.mm-panel', mm) : null);
    if (!box) return;
    const f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', box)
      .filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ── 드래그 캐러셀 ── */
  $$('.drag').forEach((sl) => {
    const track = $('.drag-track', sl);
    const items = $$('.drag-item', track);
    const prev = $('[data-drag="prev"]', sl);
    const next = $('[data-drag="next"]', sl);
    let i = 0;
    const per = () => (innerWidth <= 860 ? 1 : innerWidth <= 1100 ? 2 : 3);
    const max = () => Math.max(0, items.length - per());
    const apply = () => {
      i = Math.min(i, max());
      const step = items[0] ? items[0].getBoundingClientRect().width + 20 : 0;
      track.style.transform = `translateX(${-i * step}px)`;
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i >= max();
      items.forEach((it, n) => it.setAttribute('aria-hidden', String(n < i || n >= i + per())));
    };
    prev && prev.addEventListener('click', () => { i = Math.max(0, i - 1); apply(); });
    next && next.addEventListener('click', () => { i = Math.min(max(), i + 1); apply(); });

    // 실제로 끌어서 넘긴다. 원본의 'Drag' 라벨이 가리키는 동작
    let sx = null;
    track.addEventListener('pointerdown', (e) => { sx = e.clientX; track.setPointerCapture(e.pointerId); });
    track.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const d = e.clientX - sx;
      if (Math.abs(d) > 48) { i = d < 0 ? Math.min(max(), i + 1) : Math.max(0, i - 1); apply(); }
      sx = null;
    });
    addEventListener('resize', apply);
    apply();
  });

  /* ── 비디오 자리 — 재생 버튼을 누르면 진행 막대가 움직인다 ── */
  $$('.vid').forEach((v) => {
    const btn = $('.vid-play button', v);
    const bar = $('.vid-bar .track i', v);
    const now = $('.vid-bar .now', v);
    const total = 47;
    let t = 0, timer = null;
    const fmt = (s) => '0' + Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (timer) { clearInterval(timer); timer = null; btn.textContent = '▶'; return; }
      btn.textContent = '❚❚';
      timer = setInterval(() => {
        t = (t + 1) % (total + 1);
        if (bar) bar.style.width = (t / total * 100) + '%';
        if (now) now.textContent = fmt(t);
      }, 1000);
    });
  });

  /* ── 필터 ── */
  $$('[data-filter-group]').forEach((group) => {
    const list = document.querySelector(group.dataset.filterGroup);
    if (!list) return;
    const targets = $$('[data-cat]', list);
    $$('button[data-filter]', group).forEach((b) => {
      b.addEventListener('click', () => {
        const v = b.dataset.filter;
        $$('button[data-filter]', group).forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
        targets.forEach((t) => { t.hidden = !(v === 'all' || (t.dataset.cat || '').split(' ').includes(v)); });
      });
    });
  });

  /* ── 폼 ── */
  $$('form[data-validate]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('[required]', form).forEach((el) => {
        const wrap = el.closest('.f');
        const err = wrap ? $('.err', wrap) : null;
        let msg = '';
        if (!el.value.trim()) msg = 'Required';
        else if (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) msg = 'Check the address';
        if (msg) ok = false;
        wrap && wrap.classList.toggle('bad', !!msg);
        if (err) err.textContent = msg;
      });
      const done = $('[data-form-done]', form);
      if (done) done.textContent = ok ? 'Sent. Demo only — nothing was submitted.' : '';
    });
  });
})();

/* 영상 고정 시퀀스의 Sound 토글.
   원본에도 소리는 기본 꺼짐이고 누르면 켜진다. 여기서는 상태만 바꾼다. */
(function () {
  var b = document.querySelector('.vscroll__sound');
  if (!b) return;
  b.addEventListener('click', function () {
    var on = b.getAttribute('aria-pressed') === 'true';
    b.setAttribute('aria-pressed', String(!on));
    b.firstChild.nodeValue = on ? 'Sound' : 'Muted';
  });
})();

/* img-cycle — 원본은 사진이 제자리에서 돌아간다.
   자동으로 넘어가되 버튼으로도 고를 수 있다. 탭을 떠나면 멈춘다. */
(function () {
  'use strict';
  var st = document.querySelector('.icycle__stack');
  if (!st) return;
  var shots = [].slice.call(st.querySelectorAll('.ph'));
  var dots = [].slice.call(document.querySelectorAll('.icycle__dots button'));
  if (shots.length < 2) return;
  var i = 0, timer = null;
  var calm = matchMedia('(prefers-reduced-motion: reduce)');

  var show = function (n) {
    i = (n + shots.length) % shots.length;
    shots.forEach(function (s, k) { s.classList.toggle('on', k === i); });
    dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === i)); });
  };
  var start = function () {
    if (calm.matches || timer) return;
    timer = setInterval(function () { show(i + 1); }, 3200);
  };
  var stop = function () { clearInterval(timer); timer = null; };

  dots.forEach(function (d, k) {
    d.addEventListener('click', function () { stop(); show(k); start(); });
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
  show(0);
  start();
})();

/* 관성 스무스 스크롤 — 원본은 Lenis 를 쓴다(refs/origin.md "라이브러리").
   라이브러리를 받아 오는 대신 같은 결과를 직접 만든다. 30줄이면 된다.
   축소 모션이면 아예 켜지 않는다. 네이티브 스크롤이 그대로 남는다. */
(function () {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('requestAnimationFrame' in window)) return;

  var target = scrollY, current = scrollY, running = false;
  var EASE = 0.09;                 /* 낮을수록 더 미끄러진다 */

  var frame = function () {
    var d = target - current;
    if (Math.abs(d) < 0.4) { current = target; running = false; return; }
    current += d * EASE;
    window.scrollTo(0, current);
    requestAnimationFrame(frame);
  };

  addEventListener('wheel', function (e) {
    if (e.ctrlKey) return;                     /* 확대는 건드리지 않는다 */
    e.preventDefault();
    var max = document.documentElement.scrollHeight - innerHeight;
    target = Math.max(0, Math.min(max, target + e.deltaY));
    if (!running) { running = true; requestAnimationFrame(frame); }
  }, { passive: false });

  /* 키보드·앵커·터치는 네이티브에 맡기고 위치만 따라잡는다 */
  addEventListener('scroll', function () {
    if (!running) { target = scrollY; current = scrollY; }
  }, { passive: true });
})();
