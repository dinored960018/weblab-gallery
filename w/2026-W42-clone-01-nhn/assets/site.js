/* NOLDA 모작 — 동작 (원본 실측 값은 SPEC.md '모션' 표) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DESK = () => innerWidth >= 1280;
  const hd = $('#hd');

  /* ── 관성 스크롤 (원본: Lenis) ── */
  let lenis = null;
  if (!RM && window.Lenis && !document.body.classList.contains('is-popup')) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
  const scrollToY = (y, imm = false) => { if (lenis) lenis.scrollTo(y, { immediate: imm, force: true }); else window.scrollTo({ top: y, behavior: imm || RM ? 'auto' : 'smooth' }); };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return;
    const t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
    e.preventDefault(); scrollToY(t.getBoundingClientRect().top + scrollY - (DESK() ? 80 : 60)); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
  });

  /* ── 헤더: 아래로 내리면 숨김, 올리면 보임 (opacity 200ms ease) ── */
  const tabbar = $('#tabbar');
  let lastY = scrollY, hidden = false, lockHeader = false;
  const setHidden = (v) => { if (hidden === v) return; hidden = v; hd.classList.toggle('is-hidden', v); if (v) closeMega(); };
  const onScrollHeader = () => {
    const y = scrollY;
    if (!lockHeader) { if (y <= 10) setHidden(false); else if (y > lastY + 2) setHidden(true); else if (y < lastY - 2) setHidden(false); }
    lastY = y;
    if (tabbar) { const stuck = tabbar.getBoundingClientRect().top <= 0.5 && y > 0; tabbar.classList.toggle('is-down', stuck && !hidden); }
  };
  addEventListener('scroll', onScrollHeader, { passive: true });

  /* ── 메가 메뉴 (호버·포커스, 높이 80→346 200ms, 패널 opacity 150ms) ── */
  const gnb = $('#gnb');
  const openMega = () => { if (!DESK() || hidden) return; hd.classList.add('is-open'); $$('#gnb > li > a').forEach((a) => a.setAttribute('aria-expanded', 'true')); };
  function closeMega() { hd.classList.remove('is-open'); $$('#gnb > li > a').forEach((a) => a.parentElement.querySelector('.sub') && a.setAttribute('aria-expanded', 'false')); }
  if (gnb) {
    $$('#gnb > li > a').forEach((a) => { if (a.parentElement.querySelector('.sub')) a.setAttribute('aria-expanded', 'false'); });
    $$('#gnb > li').forEach((li) => { if (li.querySelector('.sub')) li.addEventListener('mouseenter', openMega); });
    hd.addEventListener('mouseleave', closeMega);
    gnb.addEventListener('focusin', (e) => { if (e.target.closest('li')?.querySelector('.sub')) openMega(); });
    hd.addEventListener('focusout', (e) => { if (!hd.contains(e.relatedTarget)) closeMega(); });
  }

  /* ── 언어 선택 ── */
  const lang = $('#lang');
  const langBtn = lang && $('.lang__btn', lang);
  const setLang = (v) => { lang.classList.toggle('is-open', v); langBtn.setAttribute('aria-expanded', String(v)); };
  langBtn?.addEventListener('click', (e) => { e.stopPropagation(); setLang(!lang.classList.contains('is-open')); if (lang.classList.contains('is-open')) $('a', $('.lang__menu', lang)).focus(); });

  /* ── 모바일 메뉴 ── */
  const mnav = $('#mnav'), burger = $('.burger');
  const setM = (v) => { mnav.classList.toggle('is-open', v); burger.setAttribute('aria-expanded', String(v)); document.body.classList.toggle('lock', v); if (lenis) v ? lenis.stop() : lenis.start(); if (v) $('.m-close', mnav).focus(); else burger.focus(); };
  burger?.addEventListener('click', () => setM(true));
  $('.m-close')?.addEventListener('click', () => setM(false));
  $$('.mnav button[aria-controls]').forEach((b) => b.addEventListener('click', () => { const o = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', String(o)); $('#' + b.getAttribute('aria-controls')).classList.toggle('is-open', o); }));
  mnav?.addEventListener('keydown', (e) => { if (e.key !== 'Tab') return; const f = $$('a,button', mnav).filter((x) => x.offsetParent); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } });

  /* ── 푸터: 계열사 목록 · 팝업 창 ── */
  const fams = $$('.fam');
  const setFam = (f, v) => { f.classList.toggle('is-open', v); $('.fam__btn', f).setAttribute('aria-expanded', String(v)); };
  fams.forEach((f) => $('.fam__btn', f).addEventListener('click', (e) => { e.stopPropagation(); const o = !f.classList.contains('is-open'); fams.forEach((x) => setFam(x, false)); setFam(f, o); }));
  $$('[data-popup]').forEach((b) => b.addEventListener('click', () => { const w = window.open(b.dataset.popup, '_blank', 'width=800,height=840'); if (!w) location.href = b.dataset.popup; }));
  $$('[data-close-window]').forEach((b) => b.addEventListener('click', () => { if (window.opener) window.close(); else history.length > 1 ? history.back() : (location.href = '../index.html'); }));

  /* ── 공통 바깥 클릭 · ESC ── */
  document.addEventListener('click', (e) => {
    if (lang && !lang.contains(e.target) && lang.classList.contains('is-open')) setLang(false);
    fams.forEach((f) => { if (!f.contains(e.target)) setFam(f, false); });
    $$('.sel.is-open').forEach((s) => { if (!s.contains(e.target)) selClose(s); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if ($('.modal.is-open')) return modalClose();
    if (mnav?.classList.contains('is-open')) return setM(false);
    if (lang?.classList.contains('is-open')) { setLang(false); langBtn.focus(); return; }
    const of = fams.find((f) => f.classList.contains('is-open')); if (of) { setFam(of, false); $('.fam__btn', of).focus(); return; }
    const os = $('.sel.is-open'); if (os) { selClose(os); $('.sel__btn', os).focus(); return; }
    if (hd.classList.contains('is-open')) { closeMega(); if (hd.contains(document.activeElement)) document.activeElement.blur(); }
  });

  /* ── 셀렉트 (listbox) ── */
  function selClose(s) { s.classList.remove('is-open'); $('.sel__btn', s).setAttribute('aria-expanded', 'false'); }
  const selInit = (s) => {
    const btn = $('.sel__btn', s), list = $('.sel__list', s);
    const opts = () => $$('[role=option]', list);
    const pick = (o) => { opts().forEach((x) => x.setAttribute('aria-selected', String(x === o))); $('[data-val]', btn).textContent = o.textContent; s.dataset.value = o.dataset.v; selClose(s); btn.focus(); s.dispatchEvent(new CustomEvent('selchange', { detail: o.dataset.v })); };
    s._pick = pick;
    btn.addEventListener('click', (e) => { e.stopPropagation(); const o = !s.classList.contains('is-open'); $$('.sel.is-open').forEach(selClose); s.classList.toggle('is-open', o); btn.setAttribute('aria-expanded', String(o)); if (o) { const cur = opts().find((x) => x.getAttribute('aria-selected') === 'true') || opts()[0]; opts().forEach((x) => x.classList.toggle('is-act', x === cur)); list.focus(); } });
    list.addEventListener('click', (e) => { const o = e.target.closest('[role=option]'); if (o) pick(o); });
    list.addEventListener('keydown', (e) => {
      const os = opts(); let i = os.findIndex((x) => x.classList.contains('is-act'));
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); i = clamp(i + (e.key === 'ArrowDown' ? 1 : -1), 0, os.length - 1); os.forEach((x, k) => x.classList.toggle('is-act', k === i)); os[i].scrollIntoView({ block: 'nearest' }); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (os[i]) pick(os[i]); }
      else if (e.key === 'Tab') selClose(s);
    });
    s.dataset.value = (opts().find((x) => x.getAttribute('aria-selected') === 'true') || {}).dataset?.v || '';
  };
  $$('[data-sel]').forEach(selInit);

  /* ── 스크롤 등장 (원본: translateY 8 → 0, opacity, 600ms ease-out) ── */
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.rv').forEach((el) => io.observe(el));
  $$('.fade-up').forEach((el) => setTimeout(() => el.classList.add('is-in'), (+el.dataset.in || 0) + 50));

  /* ── 모달 ── */
  let modalRet = null;
  function modalOpen(id, from) { const m = document.getElementById(id); if (!m) return; modalRet = from; m.hidden = false; requestAnimationFrame(() => { m.classList.add('is-open'); $('[data-close]', m).focus(); }); document.body.classList.add('lock'); lenis?.stop(); }
  function modalClose() { const m = $('.modal.is-open'); if (!m) return; m.classList.remove('is-open'); setTimeout(() => (m.hidden = true), 220); document.body.classList.remove('lock'); lenis?.start(); modalRet?.focus(); }
  $$('[data-modal]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); modalOpen(b.dataset.modal, b); }));
  $$('[data-card]').forEach((c) => c.addEventListener('click', () => { const b = $('[data-modal]', c); modalOpen(b.dataset.modal, b); }));
  $$('.modal').forEach((m) => { m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) modalClose(); });
    m.addEventListener('keydown', (e) => { if (e.key !== 'Tab') return; const f = $$('button,a', m); if (f.length === 1) { e.preventDefault(); f[0].focus(); } }); });

  /* ── 홈: 최근 소식 스크롤 막대 ── */
  const ns = $('#newsScroll'), th = $('#newsThumb');
  if (ns && th) { const upd = () => { const r = ns.clientHeight / ns.scrollHeight; th.style.height = Math.max(40, r * ns.clientHeight) + 'px'; th.style.transform = `translateY(${(ns.scrollTop / (ns.scrollHeight - ns.clientHeight || 1)) * (ns.clientHeight - th.offsetHeight)}px)`; }; ns.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd(); ns.setAttribute('data-lenis-prevent', ''); }

  /* ── 홈: Our Business
     카드 236×368 → 537×836: 스크롤 연동 (원본 실측 y 960~1395)
     sticky 에 닿으면 스크롤 잠금, 휠 한 칸마다 다음 사업 (이미지 700ms 교차, 글 650ms·지연 120ms, translateY 8→0)
     마지막 다음 휠에서 잠금 해제 ── */
  const track = $('#bizTrack');
  if (track) {
    const card = $('#bizCard'), imgs = $$('img', card), arts = $$('#bizArt article'); const N = arts.length;
    let idx = -1, locked = false, cool = 0, lockY = 0;
    const topY = () => track.getBoundingClientRect().top + scrollY;
    const endY = () => topY() + track.offsetHeight - innerHeight;
    const show = (i) => {
      if (i === idx) return; idx = i;
      imgs.forEach((im, k) => { im.classList.toggle('is-on', k === Math.max(i, 0)); if (k) im.classList.remove('is-first'); });
      arts.forEach((a, k) => { a.classList.toggle('is-on', k === i); a.setAttribute('aria-hidden', String(k !== i)); a.style.transform = k === i ? '' : (k < i ? 'translateY(-6px)' : (k === 0 ? 'translateY(36px)' : '')); });
    };
    const grow = () => {
      if (!DESK()) return;
      const g = clamp((scrollY - (topY() - 653)) / 435);
      const hMax = Math.min(860, innerHeight - 64), wMax = hMax * 552 / 860;
      card.style.setProperty('--cw', (236 + (wMax - 236) * g).toFixed(1)); card.style.setProperty('--ch', (368 + (hMax - 368) * g).toFixed(1));
      if (!locked) { if (g >= 0.97 && idx < 0) show(0); else if (g < 0.9 && idx === 0) { idx = -1; arts[0].classList.remove('is-on'); } }
      if (!locked && !RM && scrollY > topY() + 4 && scrollY < endY() - 4) { const k = clamp(Math.floor((scrollY - topY()) / ((endY() - topY()) / N)), 0, N - 1); show(k); }
      if (RM && scrollY >= topY()) { const k = clamp(Math.floor((scrollY - topY()) / ((endY() - topY()) / N)), 0, N - 1); show(k); }
    };
    let prev = scrollY;
    const lock = (y, i) => { lockY = y; locked = true; lockHeader = true; lenis?.stop(); window.scrollTo(0, y); show(i); cool = performance.now() + 450; };
    const unlock = (y) => { locked = false; lenis?.start(); scrollToY(y, true); setTimeout(() => (lockHeader = false), 200); };
    addEventListener('scroll', () => {
      const y = scrollY, t = topY(), e = endY();
      if (locked && Math.abs(y - lockY) > 40) { locked = false; lenis?.start(); lockHeader = false; lastY = y + 3; onScrollHeader(); }
      if (DESK() && !RM && !locked) {
        if (prev < t && y >= t && y < e) lock(t, 0);
        else if (prev > e && y <= e && y > t) lock(e, N - 1);
      }
      prev = y; grow();
    }, { passive: true });
    const step = (dir) => {
      if (performance.now() < cool) return; cool = performance.now() + 750;
      const n = idx + dir;
      if (n >= N) unlock(endY() + 2); else if (n < 0) unlock(topY() - 2); else show(n);
    };
    addEventListener('wheel', (e) => { if (!locked) return; e.preventDefault(); if (Math.abs(e.deltaY) < 4) return; step(e.deltaY > 0 ? 1 : -1); }, { passive: false });
    addEventListener('keydown', (e) => { if (!locked) return; const k = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key]; if (k) { e.preventDefault(); cool = 0; step(k); } });
    let ty0 = null; addEventListener('touchstart', (e) => { ty0 = e.touches[0].clientY; }, { passive: true });
    addEventListener('touchmove', (e) => { if (!locked) return; e.preventDefault(); const d = ty0 - e.touches[0].clientY; if (Math.abs(d) > 30) { step(d > 0 ? 1 : -1); ty0 = e.touches[0].clientY; } }, { passive: false });
    grow(); addEventListener('resize', grow);
  }

  /* ── 홈: INSIDE 탭 ── */
  const itabs = $$('.itabs [role=tab]');
  const selTab = (i, focus) => { itabs.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; const c = $('#ic-' + k); c.classList.toggle('is-on', k === i); c.setAttribute('aria-hidden', String(k !== i)); c.tabIndex = k === i ? 0 : -1; }); if (focus) itabs[i].focus(); };
  itabs.forEach((b, i) => { b.addEventListener('click', () => selTab(i)); b.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); selTab((i + (e.key === 'ArrowRight' ? 1 : itabs.length - 1)) % itabs.length, true); } }); });

  /* ── 회사소개: 시대 카드 840×240 → 전체 화면 ── */
  const eras = $$('[data-era]');
  const histYs = $$('.hist__y, .hist__m');
  const eraUpd = () => {
    if (!DESK()) return;
    eras.forEach((s) => {
      const top = s.getBoundingClientRect().top + scrollY;
      const p = RM ? (scrollY > top - 200 ? 1 : 0) : clamp((scrollY - (top - 200)) / 650);
      const m = $('.era__media', s); const e = 1 - Math.pow(1 - p, 2);
      m.style.setProperty('--w', (840 + (innerWidth - 840) * e).toFixed(1)); m.style.setProperty('--h', (240 + (innerHeight - 240) * e).toFixed(1)); m.style.setProperty('--p', e.toFixed(3));
      $('.era__txt h2', s).style.marginBottom = (24 + 240 * (1 - e)).toFixed(1) + 'px';
      s.classList.toggle('is-full', p > 0.55);
    });
    histYs.forEach((el) => el.classList.toggle('is-on', el.getBoundingClientRect().top < innerHeight * 0.62));
  };
  if (eras.length) { addEventListener('scroll', eraUpd, { passive: true }); addEventListener('resize', eraUpd); eraUpd(); }

  /* ── 브랜드: 카드가 화면을 채운 뒤 문장이 한 단어씩 밝아진다 ── */
  const bseq = $('#bseq');
  if (bseq) {
    const c = $('#bseqCard'), ws = $$('#bseqWords span'), t = $('.bseq__t', bseq);
    const upd = () => {
      if (!DESK()) return;
      const top = bseq.getBoundingClientRect().top + scrollY, len = bseq.offsetHeight - innerHeight;
      const p = clamp((scrollY - top + 200) / (len * 0.45)), q = clamp((scrollY - top - len * 0.4) / (len * 0.5));
      const e = 1 - Math.pow(1 - p, 2);
      c.style.setProperty('--w', (236 + (innerWidth - 236) * e).toFixed(1)); c.style.setProperty('--h', (368 + (innerHeight - 368) * e).toFixed(1));
      c.style.setProperty('--ty', (120 * (1 - e)).toFixed(1)); c.style.setProperty('--r', (24 * (1 - e)).toFixed(1)); c.style.setProperty('--dim', e.toFixed(3));
      t.style.opacity = String(1 - clamp(p * 2.2)); $('#bseqWords').style.opacity = String(clamp((p - 0.7) * 4));
      const n = Math.round(q * ws.length); ws.forEach((w, k) => w.classList.toggle('is-on', k < n || RM));
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
    const sl = $('.bstory__list'), fig = $('.bstory__fig'), fImg = $('img', fig), srcs = JSON.parse(fig.dataset.srcs), sSteps = $$('.bstory__tx .bstep'); let sk = 0;
    const stUpd = () => { if (!DESK()) return; const r = sl.getBoundingClientRect(); const pr = clamp(-r.top / (sl.offsetHeight - innerHeight)); const k = Math.min(sSteps.length - 1, Math.floor(pr * sSteps.length)); if (k !== sk) { sk = k; fImg.src = srcs[k]; fImg.classList.remove('is-swap'); void fImg.offsetWidth; fImg.classList.add('is-swap'); } sSteps.forEach((st, j) => { st.classList.toggle('is-on', j === k); st.setAttribute('aria-hidden', String(j !== k)); }); };
    addEventListener('scroll', stUpd, { passive: true }); stUpd();
    const nav = $$('.bstory__nav a'); const story = $('#story'), res = $('#resource');
    addEventListener('scroll', () => { const r = res.getBoundingClientRect().top < innerHeight * 0.5; nav[0].toggleAttribute('aria-current', !r); nav[1].toggleAttribute('aria-current', r); if (!r) nav[0].setAttribute('aria-current', 'true'); else nav[1].setAttribute('aria-current', 'true'); }, { passive: true });
  }

  /* ── 서비스: 이미지 캐러셀 · 아래 바로가기 막대 ── */
  $$('[data-car]').forEach((car) => {
    const tr = $('.svc__track', car), n = tr.children.length; let i = 0;
    const pv = $('[data-prev]', car), nx = $('[data-next]', car), cur = $('[data-cur]', car);
    const go = (k) => { i = clamp(k, 0, n - 1); tr.style.transform = `translateX(${-100 * i}%)`; cur.textContent = String(i + 1).padStart(2, '0'); pv.disabled = i === 0; nx.disabled = i === n - 1; $$('img', tr).forEach((im, j) => im.setAttribute('aria-hidden', String(j !== i))); };
    pv.addEventListener('click', () => go(i - 1)); nx.addEventListener('click', () => go(i + 1));
    let x0 = null; car.addEventListener('pointerdown', (e) => (x0 = e.clientX)); car.addEventListener('pointerup', (e) => { if (x0 !== null && Math.abs(e.clientX - x0) > 40) go(i + (e.clientX < x0 ? 1 : -1)); x0 = null; });
    go(0);
  });
  const dock = $('#svcDock');
  if (dock) {
    const links = $$('a', dock), secs = links.map((a) => $(a.getAttribute('href'))), ul = $('ul', dock), view = $('.svc-dock__view', dock);
    let cur = -1;
    const upd = () => {
      const first = secs[0].getBoundingClientRect().top, last = secs[secs.length - 1].getBoundingClientRect().bottom;
      dock.classList.toggle('is-on', first < innerHeight * 0.6 && last > innerHeight * 0.4 && scrollY > 200);
      let k = 0; secs.forEach((s, j) => { if (s.getBoundingClientRect().top < innerHeight * 0.45) k = j; });
      if (k !== cur) { cur = k; links.forEach((a, j) => a.toggleAttribute('aria-current', j === k)); const a = links[k]; const off = a.offsetLeft + a.offsetWidth / 2 - view.clientWidth / 2; ul.style.transform = `translateX(${-clamp(off, 0, Math.max(0, ul.scrollWidth - view.clientWidth))}px)`; }
    };
    $$('[data-dock]', dock).forEach((b) => b.addEventListener('click', () => { const k = clamp(cur + +b.dataset.dock, 0, secs.length - 1); scrollToY(secs[k].getBoundingClientRect().top + scrollY - 80); }));
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ── 페이지 나누기 공통 ── */
  const pager = (el, total, cur, go) => {
    if (total <= 1) { el.innerHTML = ''; return; }
    const g = Math.floor((cur - 1) / 10) * 10; const nums = []; for (let i = g + 1; i <= Math.min(g + 10, total); i++) nums.push(i);
    el.innerHTML = `<button type="button" class="ar" data-p="${Math.max(1, cur - 1)}" aria-label="이전 쪽" ${cur === 1 ? 'disabled' : ''}><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7.5 2L3.5 6l4 4"/></svg></button>${nums.map((n) => `<button type="button" data-p="${n}" ${n === cur ? 'aria-current="page"' : ''} aria-label="${n}쪽">${n}</button>`).join('')}<button type="button" class="ar" data-p="${Math.min(total, cur + 1)}" aria-label="다음 쪽" ${cur === total ? 'disabled' : ''}><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4.5 2l4 4-4 4"/></svg></button>`;
    $$('button', el).forEach((b) => b.addEventListener('click', () => go(+b.dataset.p)));
  };
  const escH = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ── 홍보: 분류 · 검색 · 연도 · 9개씩 ── */
  const prD = $('#prData');
  if (prD) {
    const all = JSON.parse(prD.textContent); const grid = $('#prGrid'), pg = $('#prPager'), q = $('#prQ'), yr = $('#prYear');
    const st = { cat: '전체', q: '', y: '전체', p: 1 };
    const qs = new URLSearchParams(location.search); if (qs.get('category')) st.cat = qs.get('category');
    const render = (scroll) => {
      const list = all.filter((n) => (st.cat === '전체' || n.cat === st.cat) && (st.y === '전체' || n.date.startsWith(st.y.slice(0, 4))) && (!st.q || (n.title + ' ' + n.text).toLowerCase().includes(st.q.toLowerCase())));
      const total = Math.max(1, Math.ceil(list.length / 9)); st.p = clamp(st.p, 1, total);
      const page = list.slice((st.p - 1) * 9, st.p * 9);
      grid.innerHTML = page.length ? page.map((n) => `<a class="prc" href="${n.href}"><figure><img src="${n.img}" alt="" loading="lazy" width="370" height="228"></figure><p class="c">${escH(n.cat)}</p><p class="prc__h">${escH(n.title)}</p><p class="d">${n.date}</p></a>`).join('') : `<p class="empty">‘${escH(st.q || st.cat)}’ 결과가 없습니다.</p>`;
      $('#prCount').textContent = `보도자료 ${list.length}건`;
      pager(pg, list.length ? total : 0, st.p, (p) => { st.p = p; render(true); });
      $$('.prf .pill').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.cat === st.cat)));
      if (scroll) scrollToY($('.pr-search').getBoundingClientRect().top + scrollY - 160);
    };
    $$('.prf .pill').forEach((b) => b.addEventListener('click', () => { st.cat = b.dataset.cat; st.p = 1; const u = new URL(location.href); if (st.cat === '전체') u.searchParams.delete('category'); else u.searchParams.set('category', st.cat); history.replaceState(null, '', u); render(); }));
    $('#prSearch').addEventListener('submit', (e) => { e.preventDefault(); st.q = q.value.trim(); st.p = 1; render(); });
    q.addEventListener('input', () => { if (!q.value) { st.q = ''; st.p = 1; render(); } });
    yr.addEventListener('selchange', (e) => { st.y = e.detail; st.p = 1; render(); });
    render();
  }
  /* 보도자료 상세: 연관 보도자료 · 환경경영 카드 줄 */
  $$('[data-rel], [data-env-nav]').forEach((box) => {
    const root = box.matches('[data-env-nav]') ? box.closest('section') : box;
    const view = $('.rel__view', root), tr = $('.rel__track', view), pv = $('[data-rprev]', root), nx = $('[data-rnext]', root);
    let i = 0; const items = [...tr.children];
    const go = (k) => { const max = Math.max(0, items.length - Math.max(1, Math.floor(view.clientWidth / (items[0].offsetWidth || 1)))); i = clamp(k, 0, max); tr.style.transform = `translateX(${-(items[i].offsetLeft)}px)`; pv.disabled = i === 0; nx.disabled = i >= max; };
    pv.addEventListener('click', () => go(i - 1)); nx.addEventListener('click', () => go(i + 1)); addEventListener('resize', () => go(i)); go(0);
  });

  /* ── 투자정보: 일별 거래 · 일반공고 쪽 나누기 ── */
  const dd = $('#dailyData');
  if (dd) { const rows = JSON.parse(dd.textContent); const tb = $('#dailyTbl tbody'), pg = $('#dailyPager'); const n = (v) => Number(v).toLocaleString('ko-KR');
    const go = (p) => { tb.innerHTML = rows.slice((p - 1) * 10, p * 10).map(([d, c, ch, r, v, a]) => `<tr><td class="pop">${d}</td><td class="num">${n(c)}</td><td class="num ${ch < 0 ? 'dn' : 'up'}">${n(Math.abs(ch) === 0 ? 0 : ch)} ${ch < 0 ? '▼' : ch > 0 ? '▲' : ''}</td><td class="num ${ch < 0 ? 'dn' : 'up'}">${r}%</td><td class="num">${n(v)}</td><td class="num">${n(a)}</td></tr>`).join(''); pager(pg, Math.ceil(rows.length / 10), p, go); };
    go(1); }
  const nt = $('#ntData');
  if (nt) { const rows = JSON.parse(nt.textContent); const tb = $('#ntTbl tbody'), pg = $('#ntPager');
    const go = (p) => { tb.innerHTML = rows.slice((p - 1) * 10, p * 10).map(([no, t, d]) => `<tr><td>${no}</td><td>${escH(t)}</td><td class="pop">${d}</td></tr>`).join(''); pager(pg, Math.ceil(rows.length / 10), p, go); };
    go(1); }

  /* 재무제표: 분기/연간 · 기준 기간 → 열 4개 */
  const fd = $('#finData');
  if (fd) {
    const F = JSON.parse(fd.textContent); const per = $('#finPeriod'), col = $('#finCol');
    const fillCols = (mode) => { const list = F[mode]; $('.sel__list', col).innerHTML = list.slice(0, list.length - 3).map((c, i) => `<div role="option" aria-selected="${i === 0}" data-v="${c}">${c}</div>`).join(''); $('[data-val]', col).textContent = list[0]; col.dataset.value = list[0]; };
    const draw = () => { const mode = per.dataset.value || 'q'; const list = F[mode]; const s = Math.max(0, list.indexOf(col.dataset.value)); const cols = list.slice(s, s + 4);
      $$('[data-fin]').forEach((tb) => { const k = tb.dataset.fin; $('thead tr', tb).innerHTML = `<th>항목</th>${cols.map((c) => `<th class="num">${c}</th>`).join('')}`; $$('tbody tr', tb).forEach((tr, ri) => { tr.innerHTML = `<td>${tr.cells[0].textContent}</td>${cols.map((c) => `<td class="num">${F.v[k][c][ri].toLocaleString('ko-KR')}</td>`).join('')}`; }); }); };
    per.addEventListener('selchange', () => { fillCols(per.dataset.value); draw(); });
    col.addEventListener('selchange', draw);
    fillCols('q'); draw();
  }
  /* IR 행사: 연도별 */
  const ed = $('#evData');
  if (ed) { const E = JSON.parse(ed.textContent); const tb = $('#evTbl tbody'); const s = $('#evYear');
    const draw = () => { tb.innerHTML = (E[s.dataset.value] || []).map(([d, t, pdf]) => `<tr><td class="pop">${d}</td><td>${escH(t)}</td><td class="ctr"><a class="ib" href="https://example.com/nolda/ir-call/${d.replace(/\./g, '')}" target="_blank" rel="noopener" aria-label="${escH(t)} 컨퍼런스콜 듣기 (새 창)"><svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="1.5" y="5" width="19" height="12" rx="1.5"/><circle cx="7.5" cy="11" r="2"/><circle cx="14.5" cy="11" r="2"/><path d="M7.5 13h7"/></svg></a></td><td class="ctr"><a class="ib" href="${pdf}" download aria-label="${escH(t)} 자료 내려받기"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 2.5v8M4.5 7L8 10.5 11.5 7M3 13.5h10"/></svg></a></td></tr>`).join(''); };
    s.addEventListener('selchange', draw); draw(); }
  const sd = $('#schData');
  if (sd) { const E = JSON.parse(sd.textContent); const tb = $('#schTbl tbody'); const s = $('#schYear');
    const draw = () => { const r = E[s.dataset.value] || []; tb.innerHTML = r.map(([d, t, p], i) => `<tr><td>${r.length - i}</td><td class="pop">${d}</td><td>${escH(t)}</td><td>${escH(p)}</td></tr>`).join(''); };
    s.addEventListener('selchange', draw); draw(); }

  /* IR 미팅 예약: 달력 → 시간 → 정보 입력 */
  const cal = $('#cal');
  if (cal) {
    const today = new Date(2026, 9, 12); let ym = new Date(2026, 9, 1); let pick = null, slot = null;
    const avail = (d) => { const w = d.getDay(); return d > today && w > 0 && w < 6 && (d.getDate() * 7 + d.getMonth()) % 3 !== 0 && d < new Date(2026, 11, 31); };
    const tb = $('tbody', cal), title = $('[data-title]', cal), R = $('#calR'), form = $('#meetForm');
    const draw = () => {
      title.textContent = `${ym.getFullYear()}.${String(ym.getMonth() + 1).padStart(2, '0')}`;
      const first = new Date(ym), days = new Date(ym.getFullYear(), ym.getMonth() + 1, 0).getDate(); let html = '<tr>';
      for (let i = 0; i < first.getDay(); i++) html += '<td></td>';
      for (let d = 1; d <= days; d++) { const dt = new Date(ym.getFullYear(), ym.getMonth(), d); const isT = dt.getTime() === today.getTime(); const on = pick && pick.getTime() === dt.getTime();
        html += `<td class="${isT ? 'today' : ''}">${avail(dt) ? `<button type="button" data-d="${d}" aria-pressed="${on}" aria-label="${ym.getMonth() + 1}월 ${d}일 예약 가능">${d}</button>` : `<span>${d}</span>`}</td>`;
        if (dt.getDay() === 6 && d < days) html += '</tr><tr>'; }
      tb.innerHTML = html + '</tr>';
      $$('button', tb).forEach((b) => b.addEventListener('click', () => { pick = new Date(ym.getFullYear(), ym.getMonth(), +b.dataset.d); slot = null; draw(); slots(); }));
    };
    const slots = () => {
      const times = ['10:00', '11:00', '13:30', '14:30', '15:30', '16:30'];
      R.innerHTML = `<p style="font-size:15px;font-weight:700;color:#212126">${pick.getMonth() + 1}월 ${pick.getDate()}일 예약 가능 시간</p><div class="slots">${times.map((t, i) => `<button type="button" aria-pressed="false" ${(pick.getDate() + i) % 4 === 0 ? 'disabled aria-label="' + t + ' 예약 마감"' : ''}>${t}</button>`).join('')}</div>`;
      $$('.slots button', R).forEach((b) => b.addEventListener('click', () => { slot = b.textContent; $$('.slots button', R).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); form.hidden = false; $('[data-pick]', form).textContent = `선택한 일정: ${pick.getFullYear()}.${pick.getMonth() + 1}.${pick.getDate()} ${slot}`; }));
    };
    $$('[data-m]', cal).forEach((b) => b.addEventListener('click', () => { const n = new Date(ym.getFullYear(), ym.getMonth() + +b.dataset.m, 1); if (n < new Date(2026, 9, 1) || n > new Date(2026, 11, 1)) return; ym = n; draw(); }));
    draw();
  }

  /* 폼 검증 (제출은 막고 안내만) */
  $$('#propForm, #meetForm').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault(); let first = null;
      $$('.f', f).forEach((row) => { const inp = $('input,select,textarea', row); if (!inp) return; const ok = inp.type === 'checkbox' ? inp.checked : inp.checkValidity() && (!inp.required || inp.value.trim()); row.classList.toggle('is-err', !ok); inp.setAttribute('aria-invalid', String(!ok)); if (!ok && !first) first = inp; });
      const msg = $('.form-msg', f);
      if (first) { first.focus(); msg.classList.remove('is-on'); return; }
      msg.textContent = '입력 내용을 확인했습니다. 모작 누리집이라 실제로 보내지 않습니다.'; msg.classList.add('is-on');
    });
    f.addEventListener('input', (e) => { const row = e.target.closest('.f'); if (row?.classList.contains('is-err')) { const inp = e.target; const ok = inp.type === 'checkbox' ? inp.checked : inp.checkValidity(); if (ok) { row.classList.remove('is-err'); inp.removeAttribute('aria-invalid'); } } });
  });

  /* ── ESG: 사진이 화면을 채운 뒤 글이 나온다 ── */
  const xh = $$('[data-xhero]');
  const xUpd = () => {
    if (!DESK()) return;
    xh.forEach((s) => {
      const top = s.getBoundingClientRect().top + scrollY, im = $('.xhero__img', s), full = s.hasAttribute('data-full');
      const p = RM ? 1 : clamp((scrollY - (top - (full ? 250 : 300))) / 600), e = 1 - Math.pow(1 - p, 2);
      const w0 = full ? 1000 : Math.min(1416, innerWidth - 24), h0 = full ? 12 : 450;
      im.style.setProperty('--w', (w0 + (innerWidth - w0) * e).toFixed(1)); im.style.setProperty('--h', (h0 + (innerHeight - h0) * e).toFixed(1)); im.style.setProperty('--r', ((full ? 12 : 16) * (1 - e)).toFixed(1));
      im.style.top = full ? `${(innerHeight / 2 - (h0 + (innerHeight - h0) * e) / 2) * (1 - (1 - e))}px` : '0px';
      im.style.setProperty('--p', e.toFixed(3));
      $('.xhero__txt', s).style.setProperty('--t', RM ? 1 : clamp((scrollY - (top + 250)) / 300).toFixed(3));
    });
  };
  if (xh.length) { addEventListener('scroll', xUpd, { passive: true }); addEventListener('resize', xUpd); xUpd(); }

  /* ESG 지속가능경영: 500vh 머리(띠 → 화면 → 글 둘) · 350vh 떠다니는 카드 */
  const mh = $('#mhero');
  if (mh) {
    const im = $('.mhero__img', mh), tt = $('.mhero__t', mh), tx = $$('.mhero__txt', mh);
    const upd = () => { if (!DESK()) return; const r = mh.getBoundingClientRect(); const p = RM ? 1 : clamp(-r.top / (mh.offsetHeight - innerHeight));
      const g = clamp(p / 0.35), e = 1 - Math.pow(1 - g, 2);
      im.style.setProperty('--w', (1000 + (innerWidth - 1000) * e).toFixed(1)); im.style.setProperty('--h', (12 + (innerHeight - 12) * e).toFixed(1)); im.style.setProperty('--r', (12 * (1 - e)).toFixed(1)); im.style.setProperty('--p', e.toFixed(3));
      tt.style.opacity = String(1 - clamp(g * 1.6));
      tx[0].classList.toggle('is-on', p > 0.4 && p < 0.66); tx[1].classList.toggle('is-on', p >= 0.7); };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }
  const mf = $('#mfloat');
  if (mf) {
    const its = [...$$('.mfloat__it', mf), ...$$('.mfloat__ph', mf)];
    const off = [0, 0.18, 0.36, 0.08, 0.27, 0.46];
    const upd = () => { if (!DESK()) return; const r = mf.getBoundingClientRect(); const p = clamp(-r.top / (mf.offsetHeight - innerHeight));
      its.forEach((el, i) => { const q = (p - off[i]) / 0.6; const y = innerHeight - q * (innerHeight + 420); el.style.transform = `translateY(${y.toFixed(1)}px)`; }); };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }
  /* ESG: 카드 묶음 — 500vh 동안 스크롤로 넘기고, 위·아래 단추는 그 칸으로 이동 */
  const stack = $('#stack');
  if (stack) { const cs = $$('.stack__card', stack), n = $('[data-n]', stack), [up, dn] = $$('[data-s]', stack); let i = 0; const sec = $('#mstack');
    const draw = () => { cs.forEach((c, k) => { const d = k - i; c.style.zIndex = String(10 - Math.abs(d)); c.style.opacity = d < 0 ? '0' : d > 2 ? '0' : '1'; c.style.transform = d < 0 ? 'translateY(-30px) rotate(-3deg)' : `translate(${d * 10}px, ${d * 12}px) rotate(${d * 2.5}deg)`; c.setAttribute('aria-hidden', String(d !== 0)); $('a', c).tabIndex = d === 0 ? 0 : -1; }); n.textContent = i + 1; up.disabled = i === 0; dn.disabled = i === cs.length - 1; };
    const span = () => (sec.offsetHeight - innerHeight) / cs.length;
    const go = (k) => { i = clamp(k, 0, cs.length - 1); draw(); if (DESK()) scrollToY(sec.getBoundingClientRect().top + scrollY + span() * (i + 0.5)); };
    up.addEventListener('click', () => go(i - 1)); dn.addEventListener('click', () => go(i + 1));
    addEventListener('scroll', () => { if (!DESK()) return; const r = sec.getBoundingClientRect(); if (r.top > 0 || r.bottom < innerHeight) return; const k = clamp(Math.floor(-r.top / span()), 0, cs.length - 1); if (k !== i) { i = k; draw(); } }, { passive: true });
    draw(); }

  /* ESG: 왼쪽 주제 따라가기 */
  const spy = $('#spy');
  if (spy) { const ls = $$('.spy__l a', spy), items = $$('[data-spy]', spy);
    addEventListener('scroll', () => { let k = 0; items.forEach((it) => { if (it.getBoundingClientRect().top < innerHeight * 0.5) k = +it.dataset.spy; }); ls.forEach((a, j) => a.classList.toggle('is-on', j === k)); }, { passive: true }); }
})();
