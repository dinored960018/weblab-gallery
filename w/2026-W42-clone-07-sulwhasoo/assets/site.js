// 은결담 — 동작 전부. 원본 실측: 키비주얼 페이드 1000ms ease · 자동 넘김 3000ms · 글자 kv-text 1300ms linear (지연 300/500ms)
//   추천 캐러셀 translate 1000ms ease · 헤더 색 400ms ease · 맨 위로 버튼 200ms ease-out
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hdr = $('#hdr');
  const dim = $('.dim');

  // ── 열림 관리: 하나 열리면 나머지 닫힘, 바깥 클릭 · ESC 로 닫힘 ──
  const openers = new Set();
  function closeAll(except) { openers.forEach((o) => { if (o !== except) o.close(); }); }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
  document.addEventListener('click', (e) => { openers.forEach((o) => { if (o.open && !o.root.contains(e.target)) o.close(); }); });
  function makeOpener(root, btn, panel, { onOpen, onClose, cls = 'open' } = {}) {
    const o = {
      root, open: false,
      show() { closeAll(o); o.open = true; btn.setAttribute('aria-expanded', 'true'); panel.classList.add(cls); onOpen && onOpen(); },
      close() { if (!o.open) return; o.open = false; btn.setAttribute('aria-expanded', 'false'); panel.classList.remove(cls); onClose && onClose(); },
      toggle() { o.open ? o.close() : o.show(); },
    };
    btn.addEventListener('click', (e) => { e.preventDefault(); o.toggle(); });
    openers.add(o);
    return o;
  }

  // ── 헤더 ──
  if (hdr) {
    // 메가 메뉴: 호버 · 포커스로 열림 (원본: 마우스를 올리면 헤더가 흰 바탕이 되고 아래 줄이 열린다)
    $$('.gnb-li.has-sub', hdr).forEach((li) => {
      const a = $('.gnb-a', li);
      const o = { root: li, open: false,
        show() { closeAll(o); o.open = true; li.classList.add('open'); a.setAttribute('aria-expanded', 'true'); hdr.classList.add('is-open'); },
        close() { if (!o.open) return; o.open = false; li.classList.remove('open'); a.setAttribute('aria-expanded', 'false'); hdr.classList.remove('is-open'); } };
      openers.add(o);
      li.addEventListener('mouseenter', () => o.show());
      li.addEventListener('mouseleave', () => o.close());
      li.addEventListener('focusin', () => o.show());
      li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) o.close(); });
      a.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); o.show(); const f = $('.gnb-sub a', li); f && f.focus(); } });
    });
    $$('.gnb-li:not(.has-sub)', hdr).forEach((li) => li.addEventListener('mouseenter', () => closeAll()));

    const lb = $('.lang-btn', hdr);
    if (lb) makeOpener($('.lang', hdr), lb, $('#lang-list'), { onOpen: () => hdr.classList.add('is-open'), onClose: () => hdr.classList.remove('is-open') });

    const sb = $('.srch-btn', hdr);
    const srch = $('#srch');
    if (sb && srch) {
      const so = makeOpener(hdr.querySelector('.hdr-top').parentNode, sb, srch, {
        onOpen: () => { hdr.classList.add('is-open'); dim.classList.add('on'); sb.setAttribute('aria-label', '검색 닫기'); setTimeout(() => $('input', srch).focus(), 50); },
        onClose: () => { hdr.classList.remove('is-open'); dim.classList.remove('on'); sb.setAttribute('aria-label', '검색 열기'); },
      });
      so.root = srch.parentNode; // 헤더 안 클릭은 닫지 않는다
      $('.srch-close', srch).addEventListener('click', () => { so.close(); sb.focus(); });
      dim.addEventListener('click', () => so.close());
      $('form', srch).addEventListener('submit', (e) => {
        const v = $('input', srch).value.trim();
        if (!v) { e.preventDefault(); const m = $('.form-msg', srch); m.textContent = '검색어를 입력해 주십시오.'; $('input', srch).focus(); }
      });
    }

    // 모바일 메뉴 — 열린 동안 배경 스크롤 잠금
    const bg = $('.burger', hdr);
    const mnav = $('#mnav');
    if (bg && mnav) {
      const mo = makeOpener(hdr, bg, mnav, {
        onOpen: () => { document.body.classList.add('lock'); setTimeout(() => $('.mnav-x', mnav).focus(), 50); },
        onClose: () => { document.body.classList.remove('lock'); bg.focus(); },
      });
      $('.mnav-x', mnav).addEventListener('click', () => mo.close());
    }

    // 홈: 투명 헤더. 키비주얼을 지나면 흰 바탕
    const home = hdr.classList.contains('is-home');
    // 원본: 헤더는 문서와 함께 올라간다(고정 아님). 홈은 스크립트가 붙은 뒤 흰 바탕이 400ms 에 빠진다
    if (home) addEventListener('load', () => requestAnimationFrame(() => requestAnimationFrame(() => hdr.classList.add('is-clear'))));
    const topBtn = $('.to-top');
    const onScroll = () => { if (topBtn) topBtn.classList.toggle('on', scrollY > 300); };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const topBtn = $('.to-top');
  if (topBtn) topBtn.addEventListener('click', () => { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); $('#main').focus({ preventScroll: true }); });
  const main = $('#main'); if (main) main.setAttribute('tabindex', '-1');

  // ── 쪽 안 이동 단추 (본문 바로가기 · 제품 탭 · 점 내비 · 자세히 보기) ──
  // 주소에 #를 붙이지 않고 해당 구역으로 스크롤한 뒤 포커스를 옮긴다
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (!b) return;
    const t = document.getElementById(b.dataset.go);
    if (!t) return;
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    const sticky = $('.pdp-nav');
    const off = sticky && b.dataset.go.startsWith('pdp-') ? sticky.offsetHeight : 0;
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - off, behavior: reduce ? 'auto' : 'smooth' });
    t.focus({ preventScroll: true });
  });

  // ── 아코디언 ──
  $$('[data-acc]').forEach((b) => {
    const p = document.getElementById(b.getAttribute('aria-controls'));
    b.addEventListener('click', () => { const on = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', String(on)); p.classList.toggle('open', on); });
  });

  // ── 드롭다운 (카테고리 묶음 · 뉴스 필터 · 리뷰 정렬 · 구매처) ──
  $$('[data-dd]').forEach((dd) => {
    const btn = $('.dd-btn', dd);
    const list = $('.dd-list', dd);
    const o = makeOpener(dd, btn, list);
    $$('button', list).forEach((it) => it.addEventListener('click', () => {
      $$('button', list).forEach((x) => x.classList.toggle('on', x === it));
      const v = $('.dd-val', dd); if (v) v.textContent = it.textContent;
      o.close(); btn.focus();
      dd.dispatchEvent(new CustomEvent('pick', { detail: it }));
    }));
    list.addEventListener('keydown', (e) => {
      const items = $$('a, button', list); const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
    });
  });

  // ── 탭 (role=tablist) ──
  $$('[data-tabs]').forEach((box) => {
    const lists = $$('[role="tablist"]', box).filter((t) => t.closest('[data-tabs]') === box);
    lists.forEach((tl) => {
      const tabs = $$('[role="tab"]', tl);
      const select = (t, focus) => {
        tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
        if (focus) t.focus();
        box.dispatchEvent(new CustomEvent('tab', { detail: tabs.indexOf(t) }));
        if (t.dataset.hash) history.replaceState(null, '', '#' + t.dataset.hash); else if (box.classList.contains('stw')) history.replaceState(null, '', location.pathname + location.search);
      };
      tabs.forEach((t) => {
        t.addEventListener('click', () => select(t));
        t.addEventListener('keydown', (e) => {
          const i = tabs.indexOf(t);
          if (e.key === 'ArrowRight') { e.preventDefault(); select(tabs[(i + 1) % tabs.length], true); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length], true); }
        });
      });
      tl._select = select;
    });
  });

  // ── 슬라이더 (data-slider data-per) ──
  function slider(root) {
    const view = $('.sl-view', root), track = $('.sl-track', root);
    if (!track) return;
    const items = [...track.children];
    const prev = $('.sl-arw.prev', root), next = $('.sl-arw.next', root), dotsBox = $('.sl-dots', root);
    let i = 0;
    const per = () => parseInt(getComputedStyle(root).getPropertyValue('--per')) || parseInt(root.dataset.per) || 1;
    const pages = () => Math.max(1, items.length - per() + 1);
    let dots = [];
    const buildDots = () => {
      if (!dotsBox) return;
      dotsBox.innerHTML = '';
      dots = Array.from({ length: pages() }, (_, k) => { const d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', `${k + 1}번째로 이동`); d.addEventListener('click', () => go(k)); dotsBox.appendChild(d); return d; });
    };
    const go = (k) => {
      const n = pages(); i = Math.max(0, Math.min(k, n - 1));
      root.style.setProperty('--per', per());
      track.style.transform = `translateX(${-i * (100 / per())}%)`;
      items.forEach((it, j) => { const vis = j >= i && j < i + per(); it.setAttribute('aria-hidden', String(!vis)); $$('a, button', it).forEach((f) => { if (!f.closest('[role=tab]') || f.getAttribute('role') !== 'tab') f.tabIndex = vis ? 0 : -1; if (f.getAttribute('role') === 'tab') f.tabIndex = vis && f.getAttribute('aria-selected') === 'true' ? 0 : (vis ? -1 : -1); }); });
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i >= n - 1;
      dots.forEach((d, j) => d.setAttribute('aria-current', String(j === i)));
    };
    prev && prev.addEventListener('click', () => go(i - 1));
    next && next.addEventListener('click', () => go(i + 1));
    let sx = null;
    view.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    view.addEventListener('pointerup', (e) => { if (sx === null) return; const dx = e.clientX - sx; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); sx = null; });
    root.style.setProperty('--per', per());
    buildDots(); go(0);
    let lastPer = per();
    addEventListener('resize', () => { root.style.removeProperty('--per'); const p = per(); if (p !== lastPer) { lastPer = p; buildDots(); go(0); } else go(i); });
    root._go = go;
  }
  $$('[data-slider]').forEach(slider);

  // 살롱: 회차 카드를 누르면 아래 상세가 바뀐다 → 상세 위치로 스크롤
  const sa = $('.sa-events');
  if (sa) sa.addEventListener('tab', () => { const p = $('.sa-panels'); if (p && !reduce) p.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  // 스파: 탭에 맞춰 배경 사진 교체
  const spa3 = $('.spa-3');
  if (spa3) spa3.addEventListener('tab', (e) => $$('.spa-bg-i', spa3).forEach((b, j) => b.classList.toggle('on', j === e.detail)));

  // ── 홈 키비주얼 ──
  const kv = $('[data-kv]');
  if (kv) {
    const slides = $$('.kv-slide', kv), fill = $('.kv-fill', kv), pause = $('.kv-pause', kv);
    let i = 0, timer = null, paused = reduce;
    const sync = () => { const dark = slides[i].classList.contains('t-dark'); kv.classList.toggle('t-dark', dark); hdr && hdr.classList.toggle('t-dark', dark); };
    const show = (k) => {
      slides[i].classList.remove('on'); slides[i].setAttribute('aria-hidden', 'true'); $('a', slides[i]).tabIndex = -1;
      i = (k + slides.length) % slides.length;
      slides[i].classList.add('on'); slides[i].removeAttribute('aria-hidden'); $('a', slides[i]).tabIndex = 0;
      fill.style.transform = `scaleX(${(i + 1) / slides.length})`;
      sync();
    };
    const play = () => { clearInterval(timer); if (!paused) timer = setInterval(() => show(i + 1), 4000); };
    $('.kv-arw.prev', kv).addEventListener('click', () => { show(i - 1); play(); });
    $('.kv-arw.next', kv).addEventListener('click', () => { show(i + 1); play(); });
    const setPause = (p) => { paused = p; pause.classList.toggle('paused', p); pause.setAttribute('aria-label', p ? '슬라이드 재생' : '슬라이드 정지'); play(); };
    pause.addEventListener('click', () => setPause(!paused));
    kv.addEventListener('focusin', () => clearInterval(timer));
    kv.addEventListener('focusout', () => play());
    fill.style.transform = `scaleX(${1 / slides.length})`;
    sync(); setPause(paused);
  }

  // ── 홈 추천 캐러셀 (원본: 3개씩 1416px 이동 · 1000ms ease · 자동) ──
  const pick = $('[data-pick]');
  if (pick) {
    const track = $('.pick-track', pick), items = [...track.children], fill = $('.pick-fill', pick), pause = $('.pick-pause', pick);
    let page = 0, timer = null, paused = reduce;
    const per = () => (innerWidth <= 1024 ? 1 : 3);
    const pages = () => Math.ceil(items.length / per());
    const go = (k) => {
      const n = pages(); page = (k + n) % n;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      const w = items[0].getBoundingClientRect().width + gap;
      track.style.transform = `translateX(${-page * per() * w}px)`;
      fill.style.transform = `scaleX(${(page + 1) / n})`;
      items.forEach((it, j) => { const vis = Math.floor(j / per()) === page; it.setAttribute('aria-hidden', String(!vis)); $('a', it).tabIndex = vis ? 0 : -1; });
    };
    const play = () => { clearInterval(timer); if (!paused) timer = setInterval(() => go(page + 1), 5000); };
    $('.pick-arw.prev', pick).addEventListener('click', () => { go(page - 1); play(); });
    $('.pick-arw.next', pick).addEventListener('click', () => { go(page + 1); play(); });
    pause.addEventListener('click', () => { paused = !paused; pause.classList.toggle('paused', paused); pause.setAttribute('aria-label', paused ? '슬라이드 재생' : '슬라이드 정지'); play(); });
    pick.addEventListener('focusin', () => clearInterval(timer));
    pick.addEventListener('focusout', () => play());
    addEventListener('resize', () => go(page));
    pause.classList.toggle('paused', paused);
    go(0); play();
  }

  // ── 스크롤 등장 ──
  const aosEls = $$('[data-aos]');
  if (aosEls.length) {
    if (reduce || !('IntersectionObserver' in window)) aosEls.forEach((e) => e.classList.add('in'));
    else {
      const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px' });
      aosEls.forEach((e) => io.observe(e));
    }
  }

  // ── 점 내비 (브랜드 스토리 · 지속가능성) ──
  const dotnav = $('.dotnav');
  if (dotnav) {
    const links = $$('[data-go]', dotnav);
    const secs = links.map((a) => document.getElementById(a.dataset.go));
    const upd = () => {
      const mid = innerHeight / 2; let cur = 0;
      secs.forEach((s, j) => { if (s && s.getBoundingClientRect().top < mid) cur = j; });
      links.forEach((a, j) => { a.classList.toggle('on', j === cur); if (j === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  // ── 가로 연혁 (원본: 1800px 어두운 구역 · 스크롤에 맞춰 가로로 흐름) ──
  const hs = $('[data-hscroll]');
  if (hs) {
    const tr = $('.st-j-track', hs), bar = $('.st-j-line span', hs), view = $('.st-j-view', hs);
    const upd = () => {
      const r = hs.getBoundingClientRect();
      const total = hs.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (total || 1)));
      const max = Math.max(0, tr.scrollWidth - view.clientWidth + 80);
      tr.style.transform = `translateX(${-p * max}px)`;
      bar.style.width = (p * 100) + '%';
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  // ── 카테고리 쪽 나누기 ──
  $$('[data-paged]').forEach((grid) => {
    const size = parseInt(grid.dataset.paged, 10) * 2; // 4열 × 4줄 = 16
    const items = [...grid.children];
    const pager = grid.nextElementSibling;
    const n = Math.max(1, Math.ceil(items.length / size));
    let p = 0;
    const show = (k, scroll) => {
      p = Math.max(0, Math.min(n - 1, k));
      items.forEach((it, j) => { it.hidden = Math.floor(j / size) !== p; });
      $('.pg-now', pager).textContent = p + 1; $('.pg-all', pager).textContent = n;
      $('.pg-prev', pager).disabled = p === 0; $('.pg-next', pager).disabled = p === n - 1;
      if (scroll) grid.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    $('.pg-prev', pager).addEventListener('click', () => show(p - 1, true));
    $('.pg-next', pager).addEventListener('click', () => show(p + 1, true));
    show(0);
  });

  // ── 제품 상세 ──
  const pdp = $('.pdp');
  if (pdp) {
    const nav = $('.pdp-nav', pdp), links = $$('[data-go]', nav), secs = links.map((a) => document.getElementById(a.dataset.go));
    const bar = $('.pdp-bar', pdp), top = $('.pdp-top', pdp);
    const upd = () => {
      let cur = 0;
      secs.forEach((s, j) => { if (s.getBoundingClientRect().top < 120) cur = j; });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 300) cur = secs.length - 1;
      links.forEach((a, j) => { a.classList.toggle('on', j === cur); if (j === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      const on = top.getBoundingClientRect().bottom < 0;
      bar.classList.toggle('on', on); bar.setAttribute('aria-hidden', String(!on)); $$('a', bar).forEach((a) => (a.tabIndex = on ? 0 : -1));
    };
    addEventListener('scroll', upd, { passive: true }); upd();
    // 리뷰 정렬
    const sort = $('.sort', pdp), list = $('.rv-list', pdp);
    sort && sort.addEventListener('pick', (e) => {
      const k = e.detail.dataset.sort;
      [...list.children].sort((a, b) => k === 'likes' ? b.dataset.likes - a.dataset.likes : b.dataset.date.localeCompare(a.dataset.date)).forEach((li) => list.appendChild(li));
    });
    // 링크 복사
    const toast = $('.toast');
    const say = (t) => { toast.textContent = t; toast.classList.add('on'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('on'), 1800); };
    $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); say('주소를 복사했습니다.'); } catch { say('주소: ' + location.href); }
    }));
  }

  // ── 브랜드 뉴스 필터 · 더보기 ──
  const nw = $('.nw');
  if (nw) {
    const f = { year: 'all', cat: 'all' };
    let expanded = false;
    const more = $('.nw-more', nw), empty = $('.nw-empty', nw), grps = $$('.nw-grp', nw);
    const apply = () => {
      const filtering = f.year !== 'all' || f.cat !== 'all';
      let any = false;
      grps.forEach((g) => {
        let vis = 0;
        $$('li', g).forEach((li) => { const ok = (f.year === 'all' || li.dataset.year === f.year) && (f.cat === 'all' || li.dataset.cat === f.cat); li.hidden = !ok; if (ok) vis++; });
        g.hidden = vis === 0 || (!filtering && !expanded && g.classList.contains('is-more'));
        if (!g.hidden) any = true;
      });
      empty.hidden = any;
      more.hidden = filtering || expanded || !grps.some((g) => g.classList.contains('is-more'));
    };
    $$('[data-filter]', nw).forEach((dd) => dd.addEventListener('pick', (e) => { f[dd.dataset.filter] = e.detail.dataset.v; apply(); }));
    more.addEventListener('click', () => { expanded = true; apply(); const g = grps.find((x) => x.classList.contains('is-more') && !x.hidden); if (g) { const a = $('a', g); a && a.focus(); } });
    apply();
  }

  // ── 매장 찾기 ──
  const stw = $('.stw');
  if (stw) {
    const form = $('.st-form', stw), q = $('#st-q'), msg = $('.form-msg', stw), lis = $$('.st-list li', stw), cnt = $('.st-count strong', stw);
    let type = '전체';
    const apply = () => {
      const k = q.value.trim(); let n = 0;
      lis.forEach((li) => { const ok = (type === '전체' || li.dataset.type === type) && (!k || li.dataset.q.includes(k)); li.hidden = !ok; if (ok) n++; });
      cnt.textContent = n;
      msg.textContent = n ? '' : `'${k}'에 맞는 매장이 없습니다.`;
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); if (!q.value.trim()) { msg.textContent = '매장 이름이나 지역을 입력해 주십시오.'; q.focus(); return; } apply(); });
    q.addEventListener('input', () => { if (!q.value.trim()) apply(); });
    $$('.st-chips button', stw).forEach((b) => b.addEventListener('click', () => { type = b.dataset.type; $$('.st-chips button', stw).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply(); }));
    if (location.hash === '#online') { const t = $('#stt-1'); t && t.click(); }
  }

  // ── 검색 결과 ──
  const sr = $('.sr-page');
  if (sr) {
    const data = JSON.parse($('#sr-data').textContent);
    const kw = new URLSearchParams(location.search).get('keyword') || '';
    const input = $('#kw', sr), list = $('.sr-list', sr), n = $('.sr-n', sr), empty = $('.sr-empty', sr), form = $('.sr-form', sr), msg = $('.form-msg', sr);
    input.value = kw;
    const escH = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const mark = (s) => kw ? escH(s).split(escH(kw)).join(`<mark>${escH(kw)}</mark>`) : escH(s);
    const res = kw ? data.filter((d) => (d.n + ' ' + d.e + ' ' + d.d).toLowerCase().includes(kw.toLowerCase())) : data;
    n.textContent = res.length;
    list.innerHTML = res.map((d) => `<li><a href="${d.h}"><span class="im"><img src="${d.i}" alt="" loading="lazy"></span><span><strong>${mark(d.n)}</strong><p>${mark(d.d)}</p></span></a></li>`).join('');
    empty.hidden = res.length > 0;
    form.addEventListener('submit', (e) => { if (!input.value.trim()) { e.preventDefault(); msg.textContent = '검색어를 입력해 주십시오.'; input.focus(); } });
  }

  // ── 로그인 · 가입 폼 ──
  const lg = $('.lg');
  if (lg) {
    const panels = $$('.lg-panel', lg);
    $$('[data-panel]', lg).forEach((b) => b.addEventListener('click', () => {
      panels.forEach((p) => (p.hidden = p.id !== b.dataset.panel));
      const t = document.getElementById(b.dataset.panel); const f = $('input', t); f && f.focus();
    }));
    $$('.lg-form', lg).forEach((form) => {
      const msg = $('.form-msg', form);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        msg.classList.remove('ok');
        const short = (i) => i.minLength > 0 && i.value.length > 0 && i.value.length < i.minLength;
        const invalid = (i) => !i.checkValidity() || short(i);
        const bad = $$('input', form).find(invalid);
        $$('input', form).forEach((i) => i.classList.toggle('err', invalid(i)));
        if (bad) {
          const label = bad.dataset.label || '입력값';
          const last = label.charCodeAt(label.length - 1) - 0xac00;
          const obj = label + (last >= 0 && last < 11172 && last % 28 ? '을' : '를');
          msg.textContent = bad.type === 'checkbox' ? '필수 약관에 동의해 주십시오.'
            : bad.validity.valueMissing ? obj + ' 입력해 주십시오.'
            : short(bad) ? '비밀번호는 ' + bad.minLength + '자 이상입니다.'
            : bad.validity.typeMismatch ? '이메일 형식을 확인해 주십시오.'
            : bad.validity.patternMismatch ? '휴대폰 번호 10~11자리를 숫자로만 입력해 주십시오.' : '입력값을 확인해 주십시오.';
          bad.focus();
          return;
        }
        msg.classList.add('ok');
        msg.textContent = '모작 화면이라 실제로 전송하지 않습니다. 입력 형식은 맞습니다.';
      });
    });
  }

  // ── 공지 모달 (스파) — '오늘 다시 보지 않기' ──
  const notice = $('[data-notice]');
  if (notice) {
    const key = 'egd-spa-notice';
    const today = new Date().toISOString().slice(0, 10);
    let last = null;
    try { if (localStorage.getItem(key) === today) return; } catch { /* 저장 불가 */ }
    const close = () => {
      if ($('.modal-today', notice).checked) { try { localStorage.setItem(key, today); } catch { /* 저장 불가 */ } }
      notice.hidden = true; document.body.classList.remove('lock'); last && last.focus && last.focus();
      document.removeEventListener('keydown', onKey);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { const f = $$('button, input', notice); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    };
    setTimeout(() => {
      last = document.activeElement; notice.hidden = false; document.body.classList.add('lock'); $('.modal-ok', notice).focus();
      document.addEventListener('keydown', onKey);
    }, 600);
    $('.modal-x', notice).addEventListener('click', close);
    $('.modal-ok', notice).addEventListener('click', close);
    notice.addEventListener('click', (e) => { if (e.target === notice) close(); });
  }
})();
