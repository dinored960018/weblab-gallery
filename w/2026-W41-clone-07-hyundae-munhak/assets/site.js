// 결문학 — 모작 동작. 원본(jQuery + Swiper)과 같은 결과를 바닐라 JS 로 낸다.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => matchMedia('(max-width:1100px)').matches;
  const root = document.body.dataset.root || './';

  // ── GNB 드롭다운 + 슬라이드 막대 ──
  const gnb = $('nav.gnb');
  if (gnb) {
    const bar = $('.slide', gnb);
    const items = $$('.main_menu', gnb);
    const cur = $('.main_menu.current', gnb);
    const place = (li) => {
      if (!li) { bar.style.transform = 'scaleX(0)'; bar.classList.remove('on'); return; }
      const a = li.firstElementChild; const pad = 30;
      bar.style.transform = `translateX(${li.offsetLeft + pad}px) scaleX(${a.offsetWidth - pad * 2})`; bar.classList.add('on');
    };
    const open = () => { gnb.classList.add('open'); items.forEach((li) => li.firstElementChild.setAttribute('aria-expanded', 'true')); };
    const close = () => { gnb.classList.remove('open'); items.forEach((li) => li.firstElementChild.setAttribute('aria-expanded', 'false')); place(cur); };
    items.forEach((li) => { li.addEventListener('mouseenter', () => { open(); place(li); }); li.addEventListener('focusin', () => { open(); place(li); }); });
    gnb.addEventListener('mouseleave', close);
    gnb.addEventListener('focusout', (e) => { if (!gnb.contains(e.relatedTarget)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && gnb.classList.contains('open')) { close(); const f = document.activeElement; if (gnb.contains(f)) f.blur(); } });
    requestAnimationFrame(() => { bar.style.transition = 'none'; place(cur); bar.offsetWidth; bar.style.transition = ''; });
    addEventListener('load', () => place(cur));
  }

  // ── 검색 상자 ──
  const goSearch = (q) => { location.href = root + 'search/index.html?q=' + encodeURIComponent(q); };
  const sa = $('.head_area .search_area');
  if (sa) {
    const inp = $('input', sa), btn = $('.sbtn', sa);
    const openS = () => { sa.classList.add('on'); btn.setAttribute('aria-expanded', 'true'); };
    const closeS = () => { if (inp.value || sa.contains(document.activeElement)) return; sa.classList.remove('on'); btn.setAttribute('aria-expanded', 'false'); };
    sa.addEventListener('mouseenter', openS);
    sa.addEventListener('mouseleave', closeS);
    sa.addEventListener('focusout', () => setTimeout(closeS, 0));
    btn.addEventListener('click', () => {
      if (!sa.classList.contains('on')) { openS(); inp.focus(); return; }
      if (!inp.value.trim()) { alert('검색어를 입력해주세요.'); inp.focus(); return; }
      goSearch(inp.value.trim());
    });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); btn.click(); } if (e.key === 'Escape') { inp.value = ''; inp.blur(); sa.classList.remove('on'); } });
  }

  // ── 모바일 메뉴 · 검색 ──
  const mNav = $('.m_nav'), mDim = $('.m_dim'), mBtn = $('.btn_menu');
  if (mNav && mBtn) {
    const openM = () => { mNav.classList.add('on'); mDim.classList.add('on'); document.body.classList.add('lock'); mBtn.setAttribute('aria-expanded', 'true'); setTimeout(() => $('.close', mNav).focus(), 50); };
    const closeM = () => { mNav.classList.remove('on'); mDim.classList.remove('on'); document.body.classList.remove('lock'); mBtn.setAttribute('aria-expanded', 'false'); };
    mBtn.addEventListener('click', openM);
    $('.close', mNav).addEventListener('click', () => { closeM(); mBtn.focus(); });
    mDim.addEventListener('click', closeM);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mNav.classList.contains('on')) { closeM(); mBtn.focus(); } });
    $$('.mm>button', mNav).forEach((b) => b.addEventListener('click', () => {
      const ul = b.nextElementSibling, on = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(on)); ul.classList.toggle('on', on);
    }));
  }
  const mSch = $('.m_sch'), mSearch = $('.m_search');
  if (mSch && mSearch) {
    mSch.addEventListener('click', () => { const on = !mSearch.classList.contains('on'); mSearch.classList.toggle('on', on); mSch.setAttribute('aria-expanded', String(on)); if (on) $('input', mSearch).focus(); });
    $('form', mSearch).addEventListener('submit', (e) => { e.preventDefault(); const v = $('input', mSearch).value.trim(); if (!v) { alert('검색어를 입력해주세요.'); return; } goSearch(v); });
  }

  // ── 맨 위로 ──
  const top = $('.main_top');
  if (top) {
    const chk = () => top.classList.toggle('on', scrollY > 300);
    addEventListener('scroll', chk, { passive: true }); chk();
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  }

  // ── 레이어 ──
  const dim = $('.dim');
  let lastOpener = null;
  const closeLayers = () => { $$('.layer.on').forEach((l) => l.classList.remove('on')); dim && dim.classList.remove('on'); if (lastOpener) lastOpener.focus(); };
  $$('[data-layer]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault(); const l = document.getElementById(b.dataset.layer); if (!l) return;
    lastOpener = b; l.classList.add('on'); dim.classList.add('on'); $('.close', l).focus();
  }));
  $$('.layer .close').forEach((b) => b.addEventListener('click', closeLayers));
  dim && dim.addEventListener('click', closeLayers);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('.layer.on')) closeLayers(); });

  // ── 히어로 슬라이드 (원본 Swiper: loop · autoplay 3000 · speed 2000) ──
  const vis = $('.visual');
  if (vis) {
    const track = $('.track', vis), slides = $$('.slide', track), n = slides.length;
    track.prepend(slides[n - 1].cloneNode(true)); track.append(slides[0].cloneNode(true));
    $$('.slide', track).forEach((s, i) => { if (i === 0 || i === n + 1) { s.setAttribute('aria-hidden', 'true'); $$('a', s).forEach((a) => a.tabIndex = -1); } });
    let i = 1, busy = false, timer;
    const fill = $('.bar i', vis);
    const set = (anim) => { track.style.transition = anim && !reduce ? 'transform 2s ease' : 'none'; track.style.transform = `translateX(${-i * 100}%)`; fill.style.transform = `scaleX(${(((i - 1 + n) % n) + 1) / n})`; };
    const go = (d) => { if (busy) return; busy = true; i += d; set(true); setTimeout(() => { if (i > n) { i = 1; set(false); } if (i < 1) { i = n; set(false); } busy = false; }, reduce ? 20 : 2000); };
    const auto = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(1), 5000); };
    set(false);
    $('.next', vis).addEventListener('click', () => { go(1); auto(); });
    $('.prev', vis).addEventListener('click', () => { go(-1); auto(); });
    vis.addEventListener('focusin', () => clearInterval(timer)); vis.addEventListener('focusout', auto);
    auto();
  }

  // ── 단행본 흐름 (원본: 한 칸씩 5초 이동 + 0.5초 대기) ──
  const bl = $('.bok_list');
  if (bl) {
    const track = $('.track', bl), items = $$('.bok_item', track), n = items.length;
    items.forEach((it) => { const c = it.cloneNode(true); c.setAttribute('aria-hidden', 'true'); $$('a', c).forEach((a) => a.tabIndex = -1); track.append(c); });
    let i = 0;
    const step = () => (items[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 100));
    const start = () => track.style.transform = `translateX(${-step() * 1 + (isMobile() ? 20 : -38)}px)`;
    const move = () => {
      i++; track.style.transition = 'transform 5s ease'; track.style.transform = `translateX(${-step() * (i + 1) + (isMobile() ? 20 : -38)}px)`;
      setTimeout(() => { if (i >= n) { i = 0; track.style.transition = 'none'; start(); } }, 5050);
    };
    start();
    let t = reduce ? null : setInterval(move, 5500);
    bl.addEventListener('focusin', () => { clearInterval(t); t = null; });
  }

  // ── 베스트셀러 (원본: autoplay 3000 · speed 1000 · loop) ──
  const sel = $('.seller');
  if (sel) {
    const track = $('.track', sel), items = $$('.s_item', track), n = items.length;
    items.forEach((it) => { const c = it.cloneNode(true); c.setAttribute('aria-hidden', 'true'); $$('a', c).forEach((a) => a.tabIndex = -1); track.append(c); });
    const all = $$('.s_item', track);
    const name = $('#seller_name'), writer = $('#seller_writer'), sum = $('#seller_summary');
    let i = 0, timer;
    const paint = () => all.forEach((el, k) => { const on = k === i || k === i + n; el.classList.toggle('on', on); el.style.backgroundColor = on ? el.dataset.bg : ''; });
    const set = (anim) => {
      const w = all[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0);
      track.style.transition = anim && !reduce ? 'transform 1s ease' : 'none'; track.style.transform = `translateX(${-i * w}px)`;
      const src = items[i % n]; name.textContent = src.dataset.title; writer.textContent = src.dataset.writer; sum.textContent = src.dataset.summary; paint();
    };
    const go = () => { i++; set(true); setTimeout(() => { if (i >= n) { i = 0; set(false); } }, 1020); };
    set(false);
    const auto = () => { clearInterval(timer); if (!reduce) timer = setInterval(go, 4000); };
    $('.s_next', sel).addEventListener('click', () => { go(); auto(); });
    sel.addEventListener('focusin', () => clearInterval(timer));
    auto();
  }

  // ── 커스텀 셀렉트 (원본 .select_area) ──
  $$('.select_area').forEach((sa2) => {
    const btn = $('button.st', sa2), ul = $('ul', sa2), label = $('.lb', sa2);
    const close = () => { sa2.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', (e) => { e.stopPropagation(); const on = !sa2.classList.contains('open'); $$('.select_area.open').forEach((x) => x.classList.remove('open')); sa2.classList.toggle('open', on); btn.setAttribute('aria-expanded', String(on)); if (on) $('li.current button', ul)?.focus(); });
    $$('li button', ul).forEach((b) => b.addEventListener('click', () => {
      $$('li', ul).forEach((li) => li.classList.remove('current')); b.parentElement.classList.add('current');
      label.textContent = b.dataset.v ? b.textContent : sa2.dataset.label;
      sa2.dataset.value = b.dataset.v; close(); btn.focus();
      sa2.dispatchEvent(new CustomEvent('pick', { bubbles: true, detail: b.dataset.v }));
    }));
    sa2.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); btn.focus(); } });
  });
  document.addEventListener('click', (e) => { $$('.select_area.open').forEach((x) => { if (!x.contains(e.target)) { x.classList.remove('open'); $('button.st', x).setAttribute('aria-expanded', 'false'); } }); });

  // ── 탭 (role=tablist) ──
  $$('[role=tablist]').forEach((tl) => {
    const tabs = $$('[role=tab]', tl);
    const act = (t, focus) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
      if (focus) t.focus();
      tl.dispatchEvent(new CustomEvent('tab', { detail: t }));
    };
    tabs.forEach((t, k) => {
      t.addEventListener('click', () => act(t));
      t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') act(tabs[(k + 1) % tabs.length], true); if (e.key === 'ArrowLeft') act(tabs[(k - 1 + tabs.length) % tabs.length], true); });
    });
  });

  // ── 목록 거르기 · 더보기 (문학상 · 출신 작가 · 월간 · 표지화가 · 소식) ──
  $$('[data-list]').forEach((list) => {
    const id = list.id, size = +list.dataset.size || 20;
    const items = $$('[data-item]', list);
    const more = document.querySelector(`[data-more="${id}"]`);
    const empty = $('.empty_row', list) || document.querySelector(`[data-empty="${id}"]`);
    const state = { page: 1, q: '', f: {} };
    const apply = () => {
      const hit = items.filter((it) => Object.entries(state.f).every(([k, v]) => !v || it.dataset[k] === v) && (!state.q || it.dataset.text.toLowerCase().includes(state.q.toLowerCase())));
      const pages = Math.max(1, Math.ceil(hit.length / size));
      items.forEach((it) => it.hidden = true);
      hit.slice(0, state.page * size).forEach((it) => it.hidden = false);
      if (empty) empty.hidden = hit.length > 0;
      if (more) { more.hidden = state.page >= pages; $('.pg', more).textContent = `(${state.page}/${pages})`; }
    };
    $$(`[data-for="${id}"]`).forEach((c) => {
      if (c.matches('[role=tablist]')) c.addEventListener('tab', (e) => { state.f[c.dataset.key] = e.detail.dataset.v; state.page = 1; apply(); });
      else if (c.classList.contains('select_area')) c.addEventListener('pick', (e) => { state.f[c.dataset.key] = e.detail; state.page = 1; apply(); });
      else if (c.tagName === 'SELECT') c.addEventListener('change', () => { state.f[c.dataset.key] = c.value; state.page = 1; apply(); });
      else if (c.tagName === 'FORM') c.addEventListener('submit', (e) => { e.preventDefault(); state.q = $('input', c).value.trim(); const s = $('select', c); if (s) state.f[s.dataset.key] = s.value; state.page = 1; apply(); });
    });
    more && more.addEventListener('click', () => { state.page++; apply(); });
    apply();
  });

  // ── 단행본 목록: 정렬 · 시리즈 · 검색 · 더보기 → 3단 석조 배치 ──
  const grid = $('.grid[data-books]');
  if (grid) {
    const pool = $$('a[data-item]', $('.pool'));
    const cols = $$('.col', grid);
    const more = $('#bl_more'); const st = { sort: 'new', kind: '', q: '', field: 'title', page: 1 }; const size = 9;
    const render = () => {
      let hit = pool.filter((a) => (!st.kind || a.dataset.kind === st.kind) && (!st.q || a.dataset[st.field].includes(st.q)));
      const byDate = (a, b) => b.dataset.date.localeCompare(a.dataset.date);
      hit.sort((a, b) => st.sort === 'title' ? a.dataset.title.localeCompare(b.dataset.title, 'ko') : st.sort === 'rec' ? (b.dataset.rec - a.dataset.rec) || byDate(a, b) : st.sort === 'best' ? (a.dataset.best - b.dataset.best) || byDate(a, b) : byDate(a, b));
      const pages = Math.max(1, Math.ceil(hit.length / size));
      cols.forEach((c) => c.innerHTML = '');
      hit.slice(0, st.page * size).forEach((a, k) => cols[[2, 1, 0][k % 3]].append(a));
      $('#bl_empty').hidden = hit.length > 0;
      more.hidden = st.page >= pages; $('.pg', more).textContent = `(${st.page}/${pages})`;
    };
    $('#bl_sort').addEventListener('pick', (e) => { st.sort = e.detail || 'new'; st.page = 1; render(); });
    $('#bl_kind').addEventListener('pick', (e) => { st.kind = e.detail; st.page = 1; render(); });
    $('#bl_search').addEventListener('submit', (e) => { e.preventDefault(); st.q = $('input', e.target).value.trim(); st.field = $('select', e.target).value; st.page = 1; render(); });
    more.addEventListener('click', () => { st.page++; render(); });
    render();
  }

  // ── 상세: 목차 더보기 · 찜 · 공유 · 인쇄 · 연관 도서 ──
  $$('[data-fold]').forEach((b) => b.addEventListener('click', () => { const t = document.getElementById(b.dataset.fold); const open = t.classList.toggle('fold') === false; b.setAttribute('aria-expanded', String(open)); b.firstChild.textContent = open ? '접기' : '더보기'; }));
  const pick = $('.pick'); pick && pick.addEventListener('click', () => pick.setAttribute('aria-pressed', String(pick.getAttribute('aria-pressed') !== 'true')));
  const share = $('.share'); const tip = $('.tooltip');
  if (share) {
    share.addEventListener('click', () => { const on = !tip.classList.contains('on'); tip.classList.toggle('on', on); share.setAttribute('aria-expanded', String(on)); });
    $('button', tip).addEventListener('click', () => { navigator.clipboard?.writeText(location.href).catch(() => {}); $('span', tip).textContent = '주소를 복사했습니다.'; });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && tip.classList.contains('on')) { tip.classList.remove('on'); share.setAttribute('aria-expanded', 'false'); share.focus(); } });
  }
  $('.print')?.addEventListener('click', () => print());
  const rel = $('.rel_slider');
  if (rel) {
    const track = $('.track', rel), its = $$('.it', track), dots = $('.dots');
    const per = () => isMobile() ? 1 : 5; let p = 0;
    const pages = () => Math.max(1, Math.ceil(its.length / per()));
    const draw = () => {
      dots.innerHTML = ''; for (let k = 0; k < pages(); k++) { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `${k + 1}쪽`); if (k === p) b.setAttribute('aria-current', 'true'); b.addEventListener('click', () => { p = k; draw(); }); dots.append(b); }
      track.style.transform = `translateX(${-p * its[0].offsetWidth * per()}px)`;
    };
    $('.rp', rel).addEventListener('click', () => { p = (p - 1 + pages()) % pages(); draw(); });
    $('.rn', rel).addEventListener('click', () => { p = (p + 1) % pages(); draw(); });
    draw(); addEventListener('resize', () => { p = 0; draw(); });
  }

  // ── FAQ 아코디언 ──
  $$('.faq_list .q button').forEach((b) => b.addEventListener('click', () => {
    const a = document.getElementById(b.getAttribute('aria-controls')); const on = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(on)); a.classList.toggle('on', on);
  }));

  // ── 폼 검증 (제출은 막고 메시지만) ──
  $$('form[data-validate]').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault(); let first = null;
      $$('[data-req]', f).forEach((el) => {
        const box = el.closest('.f') || el.parentElement; let bad = false;
        if (el.type === 'checkbox') bad = !el.checked; else bad = !el.value.trim();
        if (!bad && el.type === 'email') bad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim());
        if (!bad && el.dataset.min) bad = el.value.trim().length < +el.dataset.min;
        box.classList.toggle('bad', bad); el.setAttribute('aria-invalid', String(bad));
        if (bad && !first) first = el;
      });
      const ok = $('.ok', f);
      if (first) { first.focus(); ok && ok.classList.remove('on'); } else if (ok) ok.classList.add('on');
    });
    f.addEventListener('input', (e) => { const box = e.target.closest('.f'); if (box && box.classList.contains('bad') && e.target.value.trim()) { box.classList.remove('bad'); e.target.setAttribute('aria-invalid', 'false'); } });
  });

  // ── 검색 결과 ──
  const sr = $('#sr');
  if (sr) {
    const idx = JSON.parse($('#sr_index').textContent);
    const q = (new URLSearchParams(location.search).get('q') || '').trim();
    $('#sr_kw').textContent = q || '전체'; $('#sr_input').value = q;
    const groups = { monthly: [], gyeol: [], morae: [] };
    idx.forEach((r) => { if (!q || r.text.includes(q)) groups[r.g].push(r); });
    const total = groups.monthly.length + groups.gyeol.length + groups.morae.length;
    $('#sr_count').textContent = `‘${q || '전체'}’ 검색결과 ${total.toLocaleString()}건`;
    const size = 12; const st = { g: 'monthly', page: 1 };
    const tabs = $$('#sr_tabs [role=tab]');
    tabs.forEach((t) => { t.querySelector('.n').textContent = `(${groups[t.dataset.v].length})`; });
    const draw = () => {
      const list = groups[st.g]; const pages = Math.max(1, Math.ceil(list.length / size));
      $('#sr_grid').innerHTML = list.slice(0, st.page * size).map((r) => `<li><a href="${root}${r.url}"><img src="${root}${r.img}" alt="" width="122" height="180" loading="lazy"><div><strong>${r.title}</strong><em>${r.cat}</em><span>${r.name}</span><span>${r.date}</span></div></a></li>`).join('');
      $('#sr_empty').hidden = list.length > 0;
      const more = $('#sr_more'); more.hidden = st.page >= pages; $('.pg', more).textContent = `(${st.page}/${pages})`;
    };
    $('#sr_tabs').addEventListener('tab', (e) => { st.g = e.detail.dataset.v; st.page = 1; draw(); });
    $('#sr_more').addEventListener('click', () => { st.page++; draw(); });
    $('#sr_form').addEventListener('submit', (e) => { e.preventDefault(); const v = $('#sr_input').value.trim(); if (!v) { alert('검색어를 입력해주세요.'); return; } goSearch(v); });
    $('#sr_clear').addEventListener('click', () => { $('#sr_input').value = ''; $('#sr_input').focus(); });
    draw();
  }
})();
