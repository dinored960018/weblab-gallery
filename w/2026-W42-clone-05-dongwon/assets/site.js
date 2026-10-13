// 누리결그룹 모작 — 공통 동작. 원본 실측 지속시간·이징은 site.css 에 있고 여기서는 상태만 바꾼다.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hdr = $('.hdr');
  const dim = $('.dim');

  // ── 프리로더 (홈만) — 원본: 2.6초에 구멍 열림(0.8s), 3.575초에 확대(1.5s)·사라짐(0.5s) ──
  const pre = $('.pre');
  if (pre) {
    if (reduce) pre.classList.add('gone');
    else {
      const t0 = performance.now();
      const at = (ms, fn) => setTimeout(fn, Math.max(0, ms - (performance.now() - t0)));
      at(2600, () => pre.classList.add('s1'));
      at(3575, () => pre.classList.add('s2'));
      at(5100, () => pre.classList.add('gone'));
    }
  }

  // ── 헤더: 내리면 숨고 올리면 보인다(0.5s ease-in-out). 어두운 구간 위에서는 투명·흰 글씨 ──
  let lastY = scrollY;
  const darkSecs = $$('[data-nav="dark"]');
  const headerState = () => {
    const y = scrollY;
    if (!hdr.classList.contains('open')) {
      if (y > lastY + 4 && y > 200) hdr.classList.add('hide');
      else if (y < lastY - 4) hdr.classList.remove('hide');
    }
    lastY = y;
    const probe = 60;
    const dark = darkSecs.some((s) => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; });
    hdr.classList.toggle('dark', dark);
  };
  addEventListener('scroll', headerState, { passive: true });
  headerState();

  // ── 메가 메뉴 (호버·포커스로 열림, 바깥 클릭·ESC 로 닫힘) ──
  const mega = $('.mega');
  const gnbLinks = $$('.gnb > li > a');
  let megaTimer;
  const setOpen = (cls, on) => {
    hdr.classList.toggle(cls, on);
    const any = hdr.classList.contains('mega-open') || hdr.classList.contains('search-open');
    hdr.classList.toggle('open', any || !!document.querySelector('.mnav.show'));
    dim && dim.classList.toggle('show', any);
    if (cls === 'mega-open') gnbLinks.forEach((a) => a.setAttribute('aria-expanded', String(on)));
  };
  if (mega) {
    const openMega = () => { clearTimeout(megaTimer); closeSearch(); setOpen('mega-open', true); };
    const closeMega = () => { megaTimer = setTimeout(() => setOpen('mega-open', false), 120); };
    $('.gnb').addEventListener('mouseenter', openMega);
    $('.gnb').addEventListener('mouseleave', closeMega);
    mega.addEventListener('mouseenter', () => clearTimeout(megaTimer));
    mega.addEventListener('mouseleave', closeMega);
    gnbLinks.forEach((a) => a.addEventListener('focus', openMega));
    hdr.addEventListener('focusout', (e) => { if (!hdr.contains(e.relatedTarget)) setOpen('mega-open', false); });
    $$('.fold-btn').forEach((b) => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-expanded') !== 'true';
      $$('.fold-btn').forEach((o) => { o.setAttribute('aria-expanded', 'false'); $('#' + o.getAttribute('aria-controls')).classList.remove('show'); });
      b.setAttribute('aria-expanded', String(on));
      $('#' + b.getAttribute('aria-controls')).classList.toggle('show', on);
    }));
  }

  // ── 검색창 ──
  const sBtn = $('.search-btn');
  const closeSearch = () => { if (!sBtn) return; sBtn.setAttribute('aria-expanded', 'false'); setOpen('search-open', false); };
  sBtn && sBtn.addEventListener('click', () => {
    const on = sBtn.getAttribute('aria-expanded') !== 'true';
    setOpen('mega-open', false);
    sBtn.setAttribute('aria-expanded', String(on));
    setOpen('search-open', on);
    if (on) setTimeout(() => $('.search-panel input').focus(), 300);
  });

  // ── 작은 팝업 (언어 · 패밀리 사이트) ──
  $$('[data-pop]').forEach((b) => {
    const pop = $('#' + b.getAttribute('aria-controls'));
    b.addEventListener('click', (e) => { e.stopPropagation(); const on = b.getAttribute('aria-expanded') !== 'true'; closePops(); b.setAttribute('aria-expanded', String(on)); pop.classList.toggle('show', on); });
  });
  const closePops = () => $$('[data-pop]').forEach((b) => { b.setAttribute('aria-expanded', 'false'); $('#' + b.getAttribute('aria-controls')).classList.remove('show'); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang, .family')) closePops();
    if (!e.target.closest('.hdr')) { setOpen('mega-open', false); closeSearch(); }
  });
  dim && dim.addEventListener('click', () => { setOpen('mega-open', false); closeSearch(); });

  // ── 모바일 메뉴 (열린 동안 배경 스크롤 막음) ──
  const burger = $('.burger');
  const mnav = $('.mnav');
  const setM = (on) => { burger.setAttribute('aria-expanded', String(on)); mnav.classList.toggle('show', on); html.classList.toggle('lock', on); hdr.classList.toggle('open', on); };
  burger && burger.addEventListener('click', () => setM(burger.getAttribute('aria-expanded') !== 'true'));

  // ── 아코디언 ──
  $$('[data-acc]').forEach((b) => b.addEventListener('click', () => {
    const p = $('#' + b.getAttribute('aria-controls'));
    const on = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(on));
    if (p.classList.contains('acc-panel') && p.closest('.mnav')) p.classList.toggle('show', on); else p.hidden = !on;
  }));

  // ── 모달 ──
  let lastFocus = null;
  const openModal = (m) => { lastFocus = document.activeElement; m.classList.add('show'); m.setAttribute('aria-hidden', 'false'); html.classList.add('lock'); setTimeout(() => $('.modal-x', m).focus(), 50); };
  const closeModal = (m) => { m.classList.remove('show'); m.setAttribute('aria-hidden', 'true'); if (!$('.mnav.show')) html.classList.remove('lock'); lastFocus && lastFocus.focus(); };
  $$('[data-modal]').forEach((b) => b.addEventListener('click', () => {
    const m = $('#' + b.dataset.modal);
    if (b.dataset.fill) { const src = $('#' + b.dataset.fill); $('.modal-body', m).innerHTML = src.innerHTML; }
    openModal(m);
  }));
  $$('.modal').forEach((m) => {
    m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('.modal-x')) closeModal(m); });
    m.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('a, button, input, select, textarea', m).filter((x) => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  });

  // ── ESC: 열린 것부터 닫는다 ──
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const m = $('.modal.show');
    if (m) return closeModal(m);
    if ($('[data-pop][aria-expanded="true"]')) return closePops();
    if (hdr.classList.contains('search-open')) { closeSearch(); return sBtn.focus(); }
    if (hdr.classList.contains('mega-open')) return setOpen('mega-open', false);
    if (mnav && mnav.classList.contains('show')) { setM(false); return burger.focus(); }
  });

  // ── 탭 (클릭·방향키 · 주소의 #해시로 열기) ──
  const activate = (tab, focus) => {
    const list = tab.closest('[role="tablist"]');
    $$('[role="tab"]', list).forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const p = $('#' + t.getAttribute('aria-controls'));
      if (p) { p.hidden = !on; p.classList.toggle('on', on); }
    });
    if (focus) tab.focus();
    list.dispatchEvent(new CustomEvent('tabchange', { detail: tab }));
  };
  $$('[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => activate(t));
      t.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (d) { e.preventDefault(); activate(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
  });
  const fromHash = () => { const h = location.hash.slice(1); const t = h && $(`[role="tab"][data-hash="${h}"]`); if (t) { activate(t); } };
  fromHash();
  addEventListener('hashchange', fromHash);

  // ── 스크롤 등장 (원본 aos: 0.6s ease, 100px 위로) ──
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  $$('[data-aos], .draw, .stat').forEach((el) => io.observe(el));

  // ── 글자 채우기 (원본 span.letter: 인라인 opacity .4 → 1, 스크롤 연동 · 전환 없음) ──
  const fills = $$('.fill');
  fills.forEach((el) => { el.innerHTML = [...el.textContent].map((c) => (c === ' ' ? ' ' : `<span class="ch">${c}</span>`)).join(''); });
  const fillTick = () => fills.forEach((el) => {
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (innerHeight * .45)));
    const chs = $$('.ch', el); const pos = p * chs.length;
    chs.forEach((c, i) => { c.style.opacity = (0.4 + 0.6 * Math.min(1, Math.max(0, pos - i))).toFixed(3); });
  });
  if (fills.length && !reduce) { addEventListener('scroll', fillTick, { passive: true }); fillTick(); }

  // ── 홈 키 비주얼: 사진 교차 (원본 영상 자리) ──
  const slides = $$('.kv-slide');
  if (slides.length) {
    let i = 0;
    setInterval(() => { slides[i].classList.remove('on'); i = (i + 1) % slides.length; slides[i].classList.add('on'); }, reduce ? 6000 : 3200);
  }

  // ── 연혁: 시기별 가로 진행 (sticky + translateX) ──
  const eras = $$('.era');
  const eraTabs = $$('.era-tabs a');
  const sizeEras = () => eras.forEach((e) => {
    const tr = $('.era-track', e);
    const extra = Math.max(0, tr.scrollWidth - innerWidth);
    e.style.height = (innerHeight + extra) + 'px';
    e.dataset.extra = extra;
  });
  const eraTick = () => {
    let cur = 0;
    eras.forEach((e, k) => {
      const r = e.getBoundingClientRect();
      const extra = +e.dataset.extra;
      const p = extra ? Math.min(1, Math.max(0, -r.top / extra)) : 0;
      $('.era-track', e).style.transform = `translate3d(${-p * extra}px,0,0)`;
      const ticks = $$('.ticks i', e); const n = Math.round(p * ticks.length);
      ticks.forEach((t, j) => t.classList.toggle('on', j < Math.max(1, n)));
      if (r.top < innerHeight * .5) cur = k;
    });
    eraTabs.forEach((a, k) => a.classList.toggle('on', k === cur));
  };
  if (eras.length) { sizeEras(); eraTick(); addEventListener('scroll', eraTick, { passive: true }); addEventListener('resize', () => { sizeEras(); eraTick(); }); addEventListener('load', () => { sizeEras(); eraTick(); }); }

  // ── ESG: 3개 탭이 스크롤을 따라 바뀌고, 누르면 그 구간으로 이동 ──
  const esg = $('.esg-tabs');
  if (esg) {
    const tabs = $$('[role="tab"]', esg);
    let manual = 0;
    const tick = () => {
      if (Date.now() < manual) return;
      const r = esg.getBoundingClientRect();
      const span = esg.offsetHeight - innerHeight;
      const p = Math.min(.999, Math.max(0, -r.top / span));
      const k = Math.floor(p * tabs.length);
      if (tabs[k].getAttribute('aria-selected') !== 'true') activate(tabs[k]);
    };
    tabs.forEach((t, k) => t.addEventListener('click', () => {
      manual = Date.now() + 900;
      const span = esg.offsetHeight - innerHeight;
      scrollTo({ top: esg.offsetTop + span * (k + .5) / tabs.length, behavior: reduce ? 'auto' : 'smooth' });
    }));
    addEventListener('scroll', tick, { passive: true }); tick();
  }

  // ── 정도경영: 오른쪽 조항을 따라 왼쪽 번호가 바뀐다 ──
  const ch = $('.charter');
  if (ch) {
    const items = $$('ol li', ch); const num = $('.num', ch);
    const nums = JSON.parse(ch.dataset.nums);
    const t = () => { let k = 0; items.forEach((li, i) => { if (li.getBoundingClientRect().top < innerHeight * .45) k = i; }); num.textContent = nums[k]; };
    addEventListener('scroll', t, { passive: true }); t();
  }

  // ── 목록: 걸러내기 · 검색 · 쪽 나누기 ──
  $$('[data-list]').forEach((wrap) => {
    const items = $$('[data-item]', wrap);
    const per = +wrap.dataset.per || 9999;
    const pager = $('.pager', wrap);
    const q = $('[data-q]', wrap);
    const cnt = $('[data-count]', wrap);
    const empty = $('.empty', wrap);
    let page = 1; let filt = 'all';
    const render = () => {
      const kw = q ? q.value.trim().toLowerCase() : '';
      const vis = items.filter((it) => (filt === 'all' || it.dataset.cat === filt) && (!kw || it.textContent.toLowerCase().includes(kw)));
      const pages = Math.max(1, Math.ceil(vis.length / per));
      page = Math.min(page, pages);
      items.forEach((it) => { it.hidden = true; });
      vis.slice((page - 1) * per, page * per).forEach((it) => { it.hidden = false; });
      if (cnt) cnt.textContent = vis.length;
      if (empty) empty.hidden = vis.length > 0;
      if (pager) {
        const b = (lab, p, cls = '', dis = false, cur = false) => `<button type="button" class="${cls}" data-p="${p}" ${dis ? 'disabled' : ''} ${cur ? 'aria-current="page"' : ''} aria-label="${lab}">${cls ? lab === '첫 쪽' ? '«' : lab === '이전 쪽' ? '‹' : lab === '다음 쪽' ? '›' : '»' : p}</button>`;
        let h = b('첫 쪽', 1, 'arrow', page === 1) + b('이전 쪽', page - 1, 'arrow', page === 1);
        for (let p = 1; p <= pages; p++) h += b(p + '쪽', p, '', false, p === page);
        h += b('다음 쪽', page + 1, 'arrow', page === pages) + b('끝 쪽', pages, 'arrow', page === pages);
        pager.innerHTML = h;
      }
    };
    pager && pager.addEventListener('click', (e) => { const btn = e.target.closest('button[data-p]'); if (!btn || btn.disabled) return; page = +btn.dataset.p; render(); wrap.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); });
    q && q.closest('form').addEventListener('submit', (e) => { e.preventDefault(); page = 1; render(); });
    q && q.addEventListener('input', () => { page = 1; render(); });
    $$('[data-filter]', wrap).forEach((f) => f.addEventListener('click', () => {
      $$('[data-filter]', wrap).forEach((o) => o.setAttribute('aria-pressed', String(o === f)));
      filt = f.dataset.filter; page = 1; render();
    }));
    const sel = $('[data-filter-select]', wrap);
    sel && sel.addEventListener('change', () => { filt = sel.value; page = 1; render(); });
    render();
  });

  // ── 폼: 제출은 막고 검증 메시지를 보인다 ──
  $$('form[data-validate]').forEach((f) => {
    const msgs = { valueMissing: '필수 항목입니다.', typeMismatch: '형식이 맞지 않습니다.', patternMismatch: '형식이 맞지 않습니다.', rangeUnderflow: '범위를 벗어났습니다.', rangeOverflow: '범위를 벗어났습니다.' };
    const check = (el) => {
      const box = el.closest('.field'); if (!box) return true;
      const err = $('.err', box);
      const key = Object.keys(msgs).find((k) => el.validity[k]);
      box.classList.toggle('bad', !!key);
      el.setAttribute('aria-invalid', String(!!key));
      err.textContent = key ? msgs[key] : '';
      return !key;
    };
    $$('input, select, textarea', f).forEach((el) => el.addEventListener('blur', () => check(el)));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true; let first = null;
      $$('.field input, .field select, .field textarea', f).forEach((el) => { if (!check(el)) { ok = false; first = first || el; } });
      const ag = $('.agree input', f); const agErr = $('.agree-err', f);
      if (ag) { agErr.textContent = ag.checked ? '' : '개인정보 수집·이용에 동의해야 신청할 수 있습니다.'; if (!ag.checked) { ok = false; first = first || ag; } }
      const msg = $('.form-msg', f);
      if (!ok) { msg.hidden = true; first.focus(); return; }
      msg.hidden = false; msg.textContent = '입력 내용을 확인했습니다. 모작이라 실제로 전송하지 않습니다.';
    });
  });

  // ── 검색 결과 (search/) ──
  const sr = $('.sresult');
  if (sr) {
    const idx = JSON.parse($('#search-index').textContent);
    const q = new URLSearchParams(location.search).get('q') || '';
    const inp = $('#sq'); inp.value = q;
    const run = (kw) => {
      kw = kw.trim().toLowerCase();
      const hit = kw ? idx.filter((p) => (p.t + ' ' + p.d).toLowerCase().includes(kw)) : [];
      $('[data-count]').textContent = hit.length;
      sr.innerHTML = hit.map((p) => `<li><a href="${p.h}"><small>${p.s}</small><br><b>${p.t}</b><p>${p.d}</p></a></li>`).join('') || `<li class="empty">${kw ? '검색 결과가 없습니다.' : '검색어를 입력합니다.'}</li>`;
    };
    run(q);
    $('#sform').addEventListener('submit', (e) => { e.preventDefault(); run(inp.value); history.replaceState(null, '', '?q=' + encodeURIComponent(inp.value)); });
  }

  // ── 재무정보: 표를 CSV 로 내려받기 ──
  $$('[data-csv]').forEach((b) => b.addEventListener('click', () => {
    const t = $('#' + b.dataset.csv);
    const rows = $$('tr', t).map((tr) => $$('th, td', tr).map((c) => '"' + c.textContent.replace(/"/g, '""') + '"').join(','));
    const blob = new Blob(['﻿' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = b.dataset.name + '.csv'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }));
  // ── 자료실 내려받기 (파일 내용은 페이지 안 JSON) ──
  const files = $('#files');
  if (files) {
    const F = JSON.parse(files.textContent);
    $$('[data-file]').forEach((b) => b.addEventListener('click', () => {
      const f = F[b.dataset.file];
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([f.body], { type: f.type })); a.download = b.dataset.file; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }));
  }
})();
