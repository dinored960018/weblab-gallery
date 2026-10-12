(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement, body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ARROW = '<svg viewBox="0 0 12 10" aria-hidden="true"><path d="M0 5h10.5M6.5 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1"/></svg>';
  const LOGO = $('.hd-logo') ? $('.hd-logo').innerHTML : '';

  // ── 프리로더 ──
  const pl = $('#pl');
  const ready = () => { body.classList.add('ready'); pl && pl.classList.add('done'); };
  if (pl && pl.classList.contains('pl-full') && !reduce) {
    html.style.overflow = 'hidden';
    const T = [[300, 's1'], [1100, 's2'], [2300, 's3'], [3500, 's4']];
    T.forEach(([t, c]) => setTimeout(() => pl.classList.add(c), t));
    setTimeout(() => { html.style.overflow = ''; ready(); }, 4700);
  } else {
    setTimeout(ready, reduce ? 0 : 450);
  }

  // ── 스크롤 상태 ──
  const onScrollState = () => body.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScrollState, { passive: true }); onScrollState();

  // ── 포커스 가둠 ──
  const focusables = (root) => $$('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"]),input,select,textarea', root).filter((e) => e.offsetParent !== null || e === document.activeElement);
  const trap = (root, e) => {
    if (e.key !== 'Tab') return;
    const f = focusables(root); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // ── 메뉴 ──
  const mb = $('#mb'), menu = $('#menu');
  let lastFocus = null;
  $$('.mi', menu).forEach((el, i) => el.style.setProperty('--d', i));
  const setMenu = (open) => {
    mb.setAttribute('aria-expanded', open);
    body.classList.toggle('menu-open', open);
    html.style.overflow = open ? 'hidden' : '';
    if (open) {
      lastFocus = document.activeElement;
      menu.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open')));
      setTimeout(() => { const a = $('.menu-big a', menu); a && a.focus({ preventScroll: true }); }, 350);
    } else {
      menu.classList.remove('open');
      setTimeout(() => { if (!menu.classList.contains('open')) menu.hidden = true; }, 700);
      (lastFocus && lastFocus.focus ? lastFocus : mb).focus({ preventScroll: true });
    }
  };
  mb.addEventListener('click', () => setMenu(mb.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (mb.getAttribute('aria-expanded') === 'true') {
      if (e.key === 'Escape') setMenu(false);
      else trap(document.querySelector('.hd').parentElement === body ? { querySelectorAll: (s) => [...$$(s, $('.hd')), ...$$(s, menu)] } : menu, e);
    }
  });
  menu.addEventListener('click', (e) => { if (e.target === menu || e.target.classList.contains('menu-in')) setMenu(false); });

  // ── 등장 ──
  $$('.card-img, .pcd-img').forEach((el) => el.classList.add('rvi'));
  const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
  const watch = (root = document) => $$('.rv, .rvi', root).forEach((el) => reduce ? el.classList.add('in') : io.observe(el));
  watch();

  // ── 스크롤 연동(홈 히어로 · 머리 이미지 · 푸터) ──
  const hh = $('#hh'), hhc = $('#hhc'), hhMain = $('.hh-main');
  const hcs = $$('.hc');
  const mhImg = $('.mh-img img'), fx = $('.fx'), fxImg = $('.fx-img img');
  const tick = () => {
    const vw = innerWidth, vh = innerHeight;
    if (hh && vw > 767) {
      const r = hh.getBoundingClientRect();
      const pin = hh.offsetHeight - vh;
      const p = clamp(-r.top / pin);
      // 원본: 카드 묶음이 고정 구간의 86% 동안 240vw 이동, 마지막 카드 왼쪽 39.3vw 에서 멈춤
      const travel = clamp(p / 0.94) * 2.61 * vw;
      hhc.style.transform = `translate3d(${-travel}px,0,0)`;
      hhMain.style.opacity = 1 - clamp((p - 0.86) / 0.08);
      hcs.forEach((c) => {
        const left = c.getBoundingClientRect().left / vw;
        const img = c.firstElementChild.firstElementChild;
        img.style.transform = `scale(${1 + 0.3 * clamp(left / 0.86)})`;
        if (left < 0.97) c.classList.add('in');
      });
    }
    if (mhImg) { const r = mhImg.parentElement.getBoundingClientRect(); if (r.bottom > 0 && r.top < vh) mhImg.style.transform = `translate3d(0,${-(1 - (r.bottom / (vh + r.height))) * 13}%,0)`; }
    if (fx && fxImg) { const r = fx.getBoundingClientRect(); if (r.top < vh && r.bottom > 0) { const q = clamp((vh - r.top) / (vh + r.height)); fxImg.style.transform = `translate3d(0,${(q - 0.5) * -12}%,0) scale(1.4)`; } }
  };
  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; tick(); }); };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); tick();

  // ── 홈 소식 미리보기(커서 따라감) ──
  const lo = $('#lo');
  if (lo && matchMedia('(hover: hover)').matches) {
    const pv = $('.lo-pv', lo), pvi = $('img', pv);
    $$('.lo-a', lo).forEach((a) => {
      a.addEventListener('mouseenter', () => { pvi.src = a.dataset.img; pv.classList.add('on'); });
      a.addEventListener('mouseleave', () => pv.classList.remove('on'));
      a.addEventListener('mousemove', (e) => { const r = lo.getBoundingClientRect(); pv.style.transform = `translate(${e.clientX - r.left - 165}px,${e.clientY - r.top - 105}px)`; });
    });
  }

  // ── 푸터 ──
  const ff = $('#ftfocus');
  if (ff) ff.addEventListener('click', () => {
    const nav = $('#ftnav'); const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open); ff.setAttribute('aria-expanded', open);
    $$('.ft-m a', nav).forEach((a) => a.tabIndex = open ? 0 : -1);
  });
  $$('[data-top]').forEach((b) => b.addEventListener('click', () => { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); const l = $('.hd-logo'); l && setTimeout(() => l.focus({ preventScroll: true }), 600); }));

  // ── 공정 슬라이더 · 패널 ──
  const pr = $('.pr');
  if (pr) {
    const track = $('.pr-track', pr), cards = $$('.pc', pr), prev = $('.pr-prev', pr), next = $('.pr-next', pr), lis = $$('.pr-list button', pr);
    const data = JSON.parse($('#proc-data').textContent);
    let idx = 0;
    const maxIdx = () => { const vp = $('.pr-vp', pr).getBoundingClientRect().width; const w = cards[0].getBoundingClientRect().width + 10; return Math.max(0, cards.length - Math.floor((vp + 10) / w)); };
    const go = (i) => {
      track.style.transition = '';
      idx = clamp(i, 0, maxIdx());
      track.style.transform = `translateX(${-idx * (cards[0].getBoundingClientRect().width + 10)}px)`;
      prev.disabled = idx === 0; next.disabled = idx >= maxIdx();
      lis.forEach((b, k) => b.classList.toggle('on', k === i));
    };
    // 데스크톱: 원본처럼 페이지 스크롤이 카드 줄을 가로로 민다(상자 고정)
    const box = $('#prbox'), vpEl = $('.pr-vp', pr);
    const pinned = () => innerWidth > 1023;
    let travel = 0;
    const layout = () => {
      if (!pinned()) { pr.style.height = ''; box.style.top = ''; return; }
      travel = Math.max(0, track.scrollWidth - (innerWidth - vpEl.getBoundingClientRect().left) + 50);
      box.style.top = Math.min(0, innerHeight - box.offsetHeight - 20) + 'px';
      pr.style.height = (box.offsetHeight + travel + 120) + 'px';
    };
    const onPr = () => {
      if (!pinned()) return;
      const top = pr.getBoundingClientRect().top + parseFloat(box.style.top || 0) * -1;
      const p = clamp(-top / Math.max(1, travel));
      track.style.transition = 'none';
      track.style.transform = `translateX(${-p * travel}px)`;
      const k = Math.round(p * (cards.length - 1)); lis.forEach((b2, i2) => b2.classList.toggle('on', i2 === k));
    };
    layout(); addEventListener('resize', () => { layout(); onPr(); }); addEventListener('scroll', onPr, { passive: true }); onPr();
    const goPinned = (k) => { const y = pr.getBoundingClientRect().top + scrollY - parseFloat(box.style.top || 0) + travel * (k / (cards.length - 1)); scrollTo({ top: y + 1, behavior: reduce ? 'auto' : 'smooth' }); };
    prev.addEventListener('click', () => go(idx - 1));
    next.addEventListener('click', () => go(idx + 1));
    lis.forEach((b, k) => b.addEventListener('click', () => pinned() ? goPinned(k) : go(k)));
    addEventListener('resize', () => { if (!pinned()) go(idx); else track.style.transition = 'none'; });
    if (!pinned()) { go(0); lis.forEach((b) => b.classList.remove('on')); }

    const so = $('#so'), sob = $('#so-body'), sop = $('.so-p', so);
    body.appendChild(so); // 헤더(z 800) 위로 — 본문 쌓임 맥락 밖으로
    let cur = 0, opener = null;
    const render = (i) => {
      cur = (i + data.length) % data.length; const d = data[cur];
      const words = (d.intro + ' ' + d.steps.join(' ') + ' ' + d.result).split(/\s+/).length;
      sob.innerHTML = `<h2 class="so-h" id="so-h">${esc(d.title)}</h2><p class="so-sub">${esc(d.tag)}</p><p class="so-meta">${Math.max(1, Math.round(words / 60))} minute read</p><p class="so-lead">${esc(d.intro)}</p><div class="so-sec"><h3>The Process</h3><ul>${d.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div><div class="so-sec"><h3>The Result</h3><p>${esc(d.result)}</p></div>`;
      sop.scrollTop = 0;
    };
    const open = (i, from) => {
      opener = from; render(i); so.hidden = false; html.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => so.classList.add('open')));
      setTimeout(() => $('.so-close', so).focus({ preventScroll: true }), 60);
    };
    const close = () => {
      so.classList.remove('open'); html.style.overflow = '';
      setTimeout(() => { so.hidden = true; }, 500);
      opener && opener.focus({ preventScroll: true });
    };
    $$('.pc-b', pr).forEach((b) => b.addEventListener('click', () => open(+b.dataset.open, b)));
    $$('[data-close]', so).forEach((b) => b.addEventListener('click', close));
    $$('[data-step]', so).forEach((b) => b.addEventListener('click', () => render(cur + +b.dataset.step)));
    so.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); else trap(so, e); });
  }

  // ── 카드 마크업(포트폴리오) ──
  const cardHTML = (p, size) => `<a class="card card-${size}" href="${p.href}"><span class="card-img rvi"><img src="${p.img}" alt="${esc(p.name)}" width="${p.w}" height="${p.h}" loading="lazy"></span><span class="card-t">${esc(p.name)}</span><span class="card-l">${esc(p.loc)}</span></a>`;
  const hlHTML = (p) => `<div class="row-h"><a class="hl" href="${p.href}"><span class="hl-img"><img src="${p.img}" alt="${esc(p.name)}" width="${p.w}" height="${p.h}" loading="lazy"></span><span class="hl-c"><span class="bc bc-w" aria-hidden="true"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0v16M0 8h16" fill="none" stroke="currentColor" stroke-width="1"/></svg><span class="bc-bg"></span></span><span class="hl-t">${esc(p.name)}</span><span class="hl-l">${esc(p.loc)}</span></span></a></div>`;
  const pager = (nav, pages, page, onGo) => {
    if (pages <= 1) { nav.innerHTML = ''; return; }
    nav.innerHTML = `<button type="button" class="pg-arr pg-prev" aria-label="Previous page"${page === 1 ? ' disabled' : ''}>${ARROW}</button>` + Array.from({ length: pages }, (_, i) => `<button type="button" data-p="${i + 1}"${i + 1 === page ? ' aria-current="page"' : ''} aria-label="Page ${i + 1}">${i + 1}</button>`).join('') + `<button type="button" class="pg-arr pg-next" aria-label="Next page"${page === pages ? ' disabled' : ''}>${ARROW}</button>`;
    $$('button', nav).forEach((b) => b.addEventListener('click', () => onGo(b.dataset.p ? +b.dataset.p : page + (b.classList.contains('pg-next') ? 1 : -1))));
  };

  // ── 포트폴리오 필터 · 페이지 ──
  const pfg = $('#pfgrid');
  if (pfg) {
    const items = JSON.parse($('#pf-data').textContent);
    const q = new URLSearchParams(location.search);
    let mk = q.get('market') || '', sub = q.get('sub') || '', page = 1;
    const SEQ = ['A', 'B', 'H', 'A', 'C', 'H'], N = { A: 3, B: 3, H: 1, C: 2 }, PER = 13;
    const subRow = $('.flt-sub');
    const render = (scroll) => {
      const list = items.filter((p) => (!mk || p.m === mk) && (!sub || p.s === sub));
      const pages = Math.max(1, Math.ceil(list.length / PER)); page = clamp(page, 1, pages);
      const chunk = list.slice((page - 1) * PER, page * PER);
      let out = '', k = 0, s = 0;
      while (k < chunk.length) {
        const t = SEQ[s++ % SEQ.length], g = chunk.slice(k, k + N[t]); k += g.length;
        if (t === 'H') out += hlHTML(g[0]);
        else if (t === 'A') out += `<div class="row row-a">${cardHTML(g[0], 'big')}${g[1] ? cardHTML(g[1], 'sm') : ''}${g[2] ? cardHTML(g[2], 'sm') : ''}</div>`;
        else if (t === 'B') out += `<div class="row row-b">${cardHTML(g[0], 'sm')}${g[1] ? cardHTML(g[1], 'sm') : ''}${g[2] ? cardHTML(g[2], 'big') : ''}</div>`;
        else out += `<div class="row row-c">${g.map((p) => cardHTML(p, 'big')).join('')}</div>`;
      }
      pfg.innerHTML = out || '<p class="pf-empty">No projects in this category yet.</p>';
      watch(pfg);
      $$('[data-f]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.f === mk));
      $$('[data-sf]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.sf === sub));
      subRow.hidden = mk !== 'housing';
      pager($('#pg'), pages, page, (n) => { page = n; render(true); });
      const u = new URL(location.href); u.search = ''; if (mk) u.searchParams.set('market', mk); if (sub) u.searchParams.set('sub', sub); if (page > 1) u.searchParams.set('page', page);
      try { history.replaceState(null, '', u); } catch (e) { /* file:// */ }
      if (scroll) $('.pf').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    };
    page = +(q.get('page') || 1);
    $$('[data-f]').forEach((b) => b.addEventListener('click', () => { mk = b.dataset.f; sub = ''; page = 1; render(false); }));
    $$('[data-sf]').forEach((b) => b.addEventListener('click', () => { sub = b.dataset.sf; page = 1; render(false); }));
    render(false);
  }

  // ── 소식 필터 · 페이지 ──
  const nwg = $('#nwgrid');
  if (nwg) {
    const items = JSON.parse($('#nw-data').textContent);
    let f = '', page = 1; const PER = 16;
    const post = (n, i) => {
      const tall = i % 16 === 5;
      let media;
      if (n.kind === 'photo') media = `<img src="${n.img}" alt="" loading="lazy">`;
      else if (n.kind === 'statement') media = `<span class="poster st"><span class="poster-k">Studio news</span><span class="poster-t">${esc(n.title)}</span><span class="poster-l">${LOGO}</span></span>`;
      else media = `<span class="poster"><span class="poster-img"><img src="${n.img}" alt="" loading="lazy"></span><span class="poster-k">${esc(n.short)}</span><span class="poster-t">${esc(n.title)}</span><span class="poster-l">${LOGO}</span></span>`;
      return `<a class="pcd${tall ? ' pcd-tall' : ''}" href="${n.href}"><span class="pcd-img rvi">${media}<span class="pcd-ic" aria-hidden="true">${ARROW}</span></span><span class="pcd-d">${esc(n.long)}</span><span class="pcd-t">${esc(n.title)}</span></a>`;
    };
    const render = (scroll) => {
      const list = items; // 원본도 분류가 하나뿐(All = Instagram)
      const pages = Math.ceil(list.length / PER); page = clamp(page, 1, pages);
      nwg.innerHTML = list.slice((page - 1) * PER, page * PER).map(post).join('');
      watch(nwg);
      $$('[data-nf]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.nf === f));
      pager($('#npg'), pages, page, (n) => { page = n; render(true); });
      if (scroll) $('.nw').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    };
    $$('[data-nf]').forEach((b) => b.addEventListener('click', () => { f = b.dataset.nf; page = 1; render(false); }));
    render(false);
  }

  // ── 팀 필터 ──
  const tm = $('.tm');
  if (tm) $$('[data-tf]', tm).forEach((b) => b.addEventListener('click', () => {
    const v = b.dataset.tf;
    $$('[data-tf]', tm).forEach((x) => x.setAttribute('aria-pressed', x === b));
    $$('.mc', tm).forEach((m) => { m.hidden = !(v === '' || (v === 'Leadership' ? m.dataset.l === '1' : m.dataset.o === v)); });
  }));

  // ── 프로젝트 탭 ──
  const tabs = $$('.id-tabs [role=tab]');
  if (tabs.length) {
    const sel = (t) => { tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; }); };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => sel(t));
      t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; sel(n); n.focus(); } });
    });
    $$('.id-panel .rv').forEach((el) => el.classList.add('in'));
  }

  // ── 갤러리 슬라이더 ──
  $$('.sl').forEach((sl) => {
    const tr = $('.sl-track', sl), n = $$('.sl-i', sl).length, pv = $('.sl-prev', sl), nx = $('.sl-next', sl), lab = $('.sl-n', sl);
    let i = 0;
    const go = (k) => { i = clamp(k, 0, n - 1); tr.style.transform = `translateX(${-i * 100}%)`; pv.disabled = i === 0; nx.disabled = i === n - 1; lab.textContent = `${i + 1} / ${n}`; $$('.sl-i', sl).forEach((s, j) => s.setAttribute('aria-hidden', j !== i)); };
    pv.addEventListener('click', () => go(i - 1)); nx.addEventListener('click', () => go(i + 1));
    sl.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); });
    go(0);
  });
})();
