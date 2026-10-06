// PLOK — THE GLIM 모작 공통 스크립트
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
  };
  const HEART = '<svg viewBox="0 0 24 21"><path d="M12 20.3l-1.5-1.3C5.1 14.2 1.6 11 1.6 7a5.4 5.4 0 015.5-5.5c1.9 0 3.7.9 4.9 2.3A6.5 6.5 0 0116.9 1.5 5.4 5.4 0 0122.4 7c0 4-3.5 7.2-8.9 12z" fill="currentColor"/></svg>';

  // ── GNB 위치 이동 (원본: 페이지가 바뀌면 GNB 가 left·top·transform 0.5s 로 미끄러진다) ──
  const gnbEl = $('.gnb');
  try {
    const saved = JSON.parse(sessionStorage.getItem('plok-gnb') || 'null');
    sessionStorage.removeItem('plok-gnb');
    if (gnbEl && saved && !reduce && innerWidth > 768) {
      const now = gnbEl.getBoundingClientRect();
      const dx = saved.left - now.left;
      if (Math.abs(dx) > 2) gnbEl.animate([{ translate: `${dx}px 0` }, { translate: '0 0' }], { duration: 500, easing: 'ease' });
    }
  } catch {}
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || a.hasAttribute('download') || a.target || !gnbEl) return;
    if (a.origin && a.origin !== location.origin && location.protocol !== 'file:') return;
    try { sessionStorage.setItem('plok-gnb', JSON.stringify({ left: gnbEl.getBoundingClientRect().left })); } catch {}
  });

  // ── 드롭다운 (GNB 메뉴 · 분류) ──
  const dds = $$('[data-dd]');
  const setDD = (dd, open) => {
    dd.classList.toggle('dd-open', open);
    const btn = $('.dd-btn', dd);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', (dd.classList.contains('dd-filter') ? '분류 ' : '메뉴 ') + (open ? '접기' : '펼치기'));
    $$('.dd-list a, .dd-list button', dd).forEach((el, i) => {
      if (i === 0) { el.tabIndex = 0; return; }
      el.tabIndex = open ? 0 : -1;
    });
  };
  dds.forEach(dd => {
    $('.dd-btn', dd).addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !dd.classList.contains('dd-open');
      dds.forEach(o => o !== dd && setDD(o, false));
      setDD(dd, open);
    });
  });
  document.addEventListener('click', (e) => dds.forEach(dd => { if (!dd.contains(e.target)) setDD(dd, false); }));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    dds.forEach(dd => { if (dd.classList.contains('dd-open')) { setDD(dd, false); $('.dd-btn', dd).focus(); } });
  });

  // ── 좋아요 (원본: 누르면 하트 5개가 flowOne~Five 로 올라간다) ──
  const likeKey = k => 'plok-like-' + k;
  const paintLike = (btn) => {
    const k = btn.dataset.like, n = +btn.dataset.n, on = store.get(likeKey(k)) === '1';
    btn.setAttribute('aria-pressed', on);
    $('.like-n', btn).textContent = n + (on ? 1 : 0);
    btn.setAttribute('aria-label', `좋아요 ${n + (on ? 1 : 0)}${on ? ', 누름' : ''}`);
  };
  const paintAll = () => $$('[data-like]').forEach(paintLike);
  paintAll();
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-like]');
    if (!btn) return;
    e.preventDefault();
    const k = likeKey(btn.dataset.like), on = store.get(k) !== '1';
    store.set(k, on ? '1' : null);
    $$(`[data-like="${CSS.escape(btn.dataset.like)}"]`).forEach(paintLike);
    if (on && !reduce) {
      const box = $('.hearts', btn);
      if (box) { box.innerHTML = Array(5).fill('<i>' + HEART + '</i>').join(''); setTimeout(() => { box.innerHTML = ''; }, 2000); }
    }
  });

  // ── 주소 복사 + 알림 ──
  const toast = $('.toast');
  const say = (msg) => { if (!toast) return; toast.textContent = msg; toast.classList.remove('is-on'); void toast.offsetWidth; toast.classList.add('is-on'); };
  document.addEventListener('click', async (e) => {
    if (!e.target.closest('[data-share]')) return;
    const url = location.href;
    try { await navigator.clipboard.writeText(url); }
    catch { const t = document.createElement('textarea'); t.value = url; document.body.append(t); t.select(); try { document.execCommand('copy'); } catch {} t.remove(); }
    say('주소가 복사되었습니다.');
  });

  // ── 맨 위로 ──
  const top = $('.to-top');
  if (top) {
    const on = () => top.classList.toggle('is-on', scrollY > 300);
    addEventListener('scroll', on, { passive: true }); on();
    top.addEventListener('click', () => { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); $('#main')?.focus({ preventScroll: true }); });
  }

  // ── 경고 상자 ──
  const alertEl = $('#dlg-alert');
  let alertBack = null;
  const showAlert = (title, msg) => {
    alertBack = document.activeElement;
    $('#alert-t').textContent = title; $('#alert-d').textContent = msg;
    alertEl.hidden = false; $('.alert-ok', alertEl).focus();
  };
  const hideAlert = () => { alertEl.hidden = true; alertBack?.focus(); };
  alertEl?.addEventListener('click', (e) => { if (e.target === alertEl || e.target.closest('.alert-ok')) hideAlert(); });
  alertEl?.addEventListener('keydown', (e) => { if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); e.stopPropagation(); if (e.key === 'Escape') hideAlert(); } });

  // ── 다이얼로그 (Request · Recruit) ──
  let openDlg = null, dlgBack = null;
  const focusables = (root) => $$('a[href], button:not([disabled]), input:not([type=hidden]), textarea, [tabindex="0"]', root).filter(el => el.offsetParent !== null || el.closest('.choice-card, .check, .file-btn'));
  const openDialog = (name) => {
    const dlg = $('#dlg-' + name);
    if (!dlg) return;
    dlgBack = document.activeElement;
    dlg.hidden = false; dlg.scrollTop = 0; openDlg = dlg;
    document.body.classList.add('is-locked');
    $('.dialog-x', dlg).focus();
  };
  const closeDialog = () => {
    if (!openDlg) return;
    openDlg.hidden = true; openDlg = null;
    document.body.classList.remove('is-locked');
    dlgBack?.focus();
  };
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); openDialog(o.dataset.open); return; }
    if (e.target.closest('[data-close]')) closeDialog();
  });
  document.addEventListener('keydown', (e) => {
    if (!openDlg || !alertEl.hidden) return;
    if (e.key === 'Escape') {
      const pl = $('.prefix.is-open', openDlg);
      if (pl) return;
      closeDialog(); return;
    }
    if (e.key === 'Tab') {
      const f = focusables(openDlg); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // 지원 그룹 탭
  const tabs = $$('[role="tab"]');
  const selectTab = (t, focus) => {
    tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });

  // 연락처 앞자리 (목록 상자)
  $$('[data-prefix]').forEach(p => {
    const btn = $('.prefix-btn', p), list = $('.prefix-list', p), opts = $$('[role="option"]', p);
    let hl = 0;
    const open = (on) => { p.classList.toggle('is-open', on); btn.setAttribute('aria-expanded', on); if (on) { hl = opts.findIndex(o => o.getAttribute('aria-selected') === 'true'); paint(); list.focus(); } };
    const paint = () => { opts.forEach((o, i) => o.classList.toggle('is-hl', i === hl)); list.setAttribute('aria-activedescendant', ''); };
    const pick = (i) => { opts.forEach((o, k) => o.setAttribute('aria-selected', k === i)); $('span', btn).textContent = opts[i].dataset.v; btn.setAttribute('aria-label', `앞자리 선택, 현재 ${opts[i].dataset.v}`); open(false); btn.focus(); };
    btn.addEventListener('click', (e) => { e.stopPropagation(); open(!p.classList.contains('is-open')); });
    opts.forEach((o, i) => o.addEventListener('click', (e) => { e.stopPropagation(); pick(i); }));
    list.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); hl = Math.min(opts.length - 1, hl + 1); paint(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); hl = Math.max(0, hl - 1); paint(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(hl); }
      else if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); open(false); btn.focus(); }
    });
    document.addEventListener('click', (e) => { if (!p.contains(e.target)) open(false); });
  });

  // 약관 펼치기 · 파일 이름
  $$('.terms-toggle').forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', on); $('#' + b.getAttribute('aria-controls')).hidden = !on;
  }));
  $$('input[type=file]').forEach(inp => inp.addEventListener('change', () => {
    const out = $('[data-files]', inp.closest('.step'));
    const files = [...inp.files];
    out.textContent = files.length ? (files.length > 3 ? '최대 3개까지 첨부할 수 있습니다.' : files.map(f => f.name).join(', ')) : '선택한 파일 없음';
  }));

  // 폼 검사 (원본: 칸마다 빨간 문구 + 약관 미동의 'Wait!' 상자). 전송은 하지 않는다.
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const checkField = (inp) => {
    const box = inp.closest('[data-field]'), err = box && $('.err', box);
    if (!box) return true;
    const v = inp.value.trim();
    let msg = '';
    if (!v) msg = inp.dataset.msg;
    else if (inp.type === 'email' && !EMAIL.test(v)) msg = inp.dataset.bad;
    else if (inp.dataset.pattern && !new RegExp(inp.dataset.pattern).test(v)) msg = inp.dataset.bad;
    box.classList.toggle('is-err', !!msg);
    inp.setAttribute('aria-invalid', !!msg);
    err.textContent = msg;
    return !msg;
  };
  $$('[data-form]').forEach(form => {
    $$('[data-field] input, [data-field] textarea', form).forEach(inp => inp.addEventListener('input', () => { if (inp.getAttribute('aria-invalid') === 'true') checkField(inp); }));
    const agree = $('input[name=agree]', form);
    agree.addEventListener('change', () => $('.terms', form).classList.remove('is-err'));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = $$('[data-field] input[required], [data-field] textarea[required]', form).filter(i => !checkField(i));
      if (bad.length) bad[0].focus();
      if (!agree.checked) {
        $('.terms', form).classList.add('is-err');
        showAlert('Wait!', '[개인정보처리방침]에 동의하지 않으셨습니다. 약관에 동의해주세요.');
        return;
      }
      if (bad.length) return;
      showAlert('Check!', '입력 내용을 모두 확인했습니다. 이 화면은 전송을 연결하지 않았습니다.');
    });
  });

  // ── 브리프 첫 화면: 카드·물체가 위에서 떨어져 자리 잡는다 (원본 로드 후 약 1.3초) ──
  if ($('.drops') && !reduce) {
    $$('.drop').forEach((d, i) => {
      const r = parseFloat(getComputedStyle(d).getPropertyValue('--r')) || 0;
      d.animate([
        { transform: `translateY(-110vh) rotate(${r - 35}deg)` },
        { transform: `translateY(18px) rotate(${r + 5}deg)`, offset: .72 },
        { transform: `translateY(-6px) rotate(${r - 1}deg)`, offset: .88 },
        { transform: `rotate(${r}deg)` },
      ], { duration: 1100, delay: 150 + i * 80, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'backwards' });
    });
  }

  // ── 홈 (Reference) ──
  const home = $('.home');
  if (home && window.PROJECTS) {
    const P = window.PROJECTS;
    const slides = $$('.hero-slide', home), thumbs = $$('.thumb', home), gItems = $$('.g-item', home);
    const title = $('[data-hero-link]'), heroLike = $('.hero-like'), mName = $('[data-m-name]'), mMeta = $('[data-m-meta]');
    let visible = P.map((_, i) => i), cur = 0, prevOff = new Map(), busy = false;

    const layout = (animate = true) => {
      const n = visible.length, a = visible.indexOf(cur);
      thumbs.forEach(t => t.classList.add('is-hidden'));
      visible.forEach((idx, j) => {
        const t = thumbs[idx];
        let k = j - a;
        if (k > Math.floor((n - 1) / 2)) k -= n;
        if (k < -Math.floor(n / 2)) k += n;
        const x = k === 0 ? 212 : k > 0 ? 392 + (k - 1) * 90 : 122 + (k + 1) * 90;
        const jump = !animate || (prevOff.has(idx) && Math.abs(prevOff.get(idx) - k) > 1);
        t.classList.toggle('no-anim', jump);
        t.classList.remove('is-hidden');
        t.style.transform = `translateX(${x}px)`;
        t.classList.toggle('is-active', k === 0);
        $('.thumb-card', t).tabIndex = k === 0 ? 0 : -1;
        $('.thumb-btn', t).tabIndex = k === 0 ? -1 : 0;
        prevOff.set(idx, k);
      });
      setTimeout(() => thumbs.forEach(t => t.classList.remove('no-anim')), 40);
    };
    const info = (i) => {
      const p = P[i];
      title.textContent = p.phrase;
      title.href = `detail/${p.slug}/index.html`;
      heroLike.dataset.like = p.slug; heroLike.dataset.n = p.likes; paintLike(heroLike);
      mName.textContent = p.name; mMeta.textContent = `${p.client} / ${p.year} / ${p.cats.join(', ')}`;
    };
    const go = (i, dir) => {
      if (i === cur || busy) return;
      const from = slides[cur], to = slides[i];
      cur = i; info(i); layout(true);
      if (reduce) { from.classList.remove('is-on'); to.classList.add('is-on'); return; }
      busy = true;
      to.classList.add('is-in'); if (dir < 0) to.classList.add('from-top');
      void to.offsetWidth;
      to.classList.add('is-on'); to.classList.remove('from-top');
      from.classList.add('is-in', dir > 0 ? 'is-out' : 'to-bottom');
      setTimeout(() => { from.classList.remove('is-on', 'is-in', 'is-out', 'to-bottom'); to.classList.remove('is-in'); busy = false; }, 620);
    };
    const step = (d) => { if (!visible.length) return; const a = visible.indexOf(cur); go(visible[(a + d + visible.length) % visible.length], d); };
    $('.car-prev').addEventListener('click', () => step(-1));
    $('.car-next').addEventListener('click', () => step(1));
    thumbs.forEach((t, idx) => $('.thumb-btn', t).addEventListener('click', () => {
      const n = visible.length, a = visible.indexOf(cur); let k = visible.indexOf(idx) - a;
      if (k > n / 2) k -= n; if (k < -n / 2) k += n;
      go(idx, k > 0 ? 1 : -1);
    }));
    $('.carousel').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); step(e.key === 'ArrowRight' ? 1 : -1); const act = $('.thumb.is-active .thumb-card'); setTimeout(() => act && $('.thumb.is-active .thumb-card').focus(), 0); }
    });
    // 모바일: 밀어서 넘기기
    let sx = 0, sy = 0;
    $('.stage').addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    $('.stage').addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(d) > 40) step(d < 0 ? 1 : -1);
    }, { passive: true });

    // 분류
    const empty = $('.g-empty'), fdd = $('.dd-filter'), flist = $('.dd-list', fdd);
    $$('.pill-filter').forEach(b => b.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!fdd.classList.contains('dd-open')) { setDD(fdd, true); return; }
      const f = b.dataset.filter;
      flist.prepend(b.parentElement);
      $$('.pill-filter').forEach(x => { x.setAttribute('aria-pressed', x === b); x.classList.toggle('is-cur', x === b); });
      visible = P.map((p, i) => i).filter(i => f === 'All' || P[i].cats.includes(f));
      gItems.forEach((g, i) => g.classList.toggle('is-hidden', !visible.includes(i)));
      empty.hidden = visible.length > 0;
      home.classList.toggle('is-empty', !visible.length);
      $('.carousel').hidden = !visible.length;
      if (visible.length && !visible.includes(cur)) { const t = visible[0]; prevOff.clear(); go(t, 1); }
      else if (!visible.length) { title.textContent = '이 분류의 프로젝트가 없습니다.'; title.removeAttribute('href'); heroLike.hidden = true; }
      if (visible.length) { heroLike.hidden = false; if (!title.href) info(cur); }
      prevOff.clear(); layout(false);
      setDD(fdd, false); b.focus();
    }));

    // 보기 전환
    const vt = $$('.vt-btn'), grid = $('.grid-view');
    vt.forEach(b => b.addEventListener('click', () => {
      const g = b.dataset.view === 'grid';
      vt.forEach(x => x.setAttribute('aria-pressed', x === b));
      home.classList.toggle('is-grid', g); home.parentElement.classList.toggle('is-grid', g);
      grid.hidden = !g; $('.stage').setAttribute('aria-hidden', g);
      $$('.stage a, .stage button').forEach(el => { if (g) { el.dataset.ti = el.tabIndex; el.tabIndex = -1; } else if (el.dataset.ti != null) { el.tabIndex = +el.dataset.ti; } });
      if (g) grid.scrollTop = 0;
    }));
    layout(false);
  }
})();
