// SELOWE KAVARI 모작 — 동작 전부 (라이브러리 없음)
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* 저장 불가 */ } } };

  // ── 프리로더 → 등장 ──
  const loader = $('.loader');
  const ready = () => { body.classList.add('is-ready'); };
  if (loader && !reduce) {
    setTimeout(() => { loader.classList.add('is-done'); setTimeout(ready, 250); setTimeout(() => loader.classList.add('is-skip'), 1300); }, 1500);
  } else { loader && loader.classList.add('is-skip'); ready(); }

  // ── 큰 제목을 화면 폭에 맞춘다(원본: 제목이 좌우 여백까지 꽉 참) ──
  const fitTitles = () => $$('.ptitle:not(.ptitle--2) h1').forEach((h) => {
    h.style.fontSize = '100px'; const w = h.scrollWidth; const avail = h.parentElement.clientWidth - parseFloat(getComputedStyle(h.parentElement).paddingLeft) * 2;
    h.style.fontSize = Math.min(100 * avail / w, innerWidth * .3) + 'px';
  });
  fitTitles(); addEventListener('resize', fitTitles); document.fonts && document.fonts.ready.then(fitTitles);

  // ── 포커스 가두기 ──
  const focusables = (el) => $$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])', el).filter((x) => x.offsetParent !== null || x === document.activeElement);
  function trap(el, e) {
    if (e.key !== 'Tab') return;
    const f = focusables(el); if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }

  // ── 메뉴 ──
  const menuBtn = $('.menu-btn'), menu = $('#menu'), veil = $('.menu-veil');
  let menuReturn = null;
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open); veil.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open); body.classList.toggle('is-locked', open);
    if (open) { menuReturn = document.activeElement; setTimeout(() => $('a', menu).focus(), 60); }
    else if (menuReturn) menuReturn.focus();
  };
  menuBtn && menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  $$('[data-menu-close]').forEach((b) => b.addEventListener('click', () => setMenu(false)));
  menu && menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); trap(menu, e); });

  // ── 모달(구독 · 영상 · 일정 · 라이트박스) ──
  let openModal = null, modalReturn = null;
  function showModal(m) {
    if (!m) return;
    modalReturn = document.activeElement; m.hidden = false; openModal = m;
    requestAnimationFrame(() => m.classList.add('is-open'));
    body.classList.add('is-locked');
    setTimeout(() => (focusables(m)[0] || m).focus(), 50);
    m.dispatchEvent(new CustomEvent('open'));
  }
  function hideModal(m = openModal) {
    if (!m) return;
    m.classList.remove('is-open'); body.classList.remove('is-locked');
    m.dispatchEvent(new CustomEvent('close'));
    setTimeout(() => { m.hidden = true; }, 500);
    openModal = null; modalReturn && modalReturn.focus();
  }
  $$('[data-open]').forEach((b) => b.addEventListener('click', () => showModal(document.getElementById(b.dataset.open))));
  $$('.modal [data-close]').forEach((b) => b.addEventListener('click', () => hideModal(b.closest('.modal'))));
  document.addEventListener('keydown', (e) => {
    if (openModal) { if (e.key === 'Escape') hideModal(); else trap(openModal, e); }
  });

  // ── 영상 자리: 사진 6컷이 4초씩 (원본은 영상 — SPEC 참조) ──
  // 교차 사진은 첫 장만 HTML 에 두고 나머지는 여기서 붙인다
  // 교차 전환: 화면에는 늘 한 장만 두고, 바꿀 때만 새 장을 위에 올려 페이드
  const fader = (box) => {
    const first = $('img', box); const list = JSON.parse((box.dataset.seq || first.dataset.seq) || '[]');
    list.forEach((s) => { const p = new Image(); p.src = s; });
    let cur = 0;
    const show = (k) => {
      if (k === cur || !list[k]) return; cur = k;
      const im = new Image(); im.src = list[k]; im.alt = first.alt; im.className = 'fade-in'; box.appendChild(im);
      requestAnimationFrame(() => requestAnimationFrame(() => im.classList.add('is-on')));
      setTimeout(() => $$('img', box).forEach((x) => { if (x !== im) x.remove(); }), 1300);
    };
    return { show, size: list.length, get cur() { return cur; } };
  };
  const film = $('#film');
  if (film) {
    const fd = fader($('.film', film));
    const imgs = [], fill = $('.fb-fill', film), time = $('.film-time', film), tog = $('.film-toggle', film);
    const total = fd.size * 4000; let t = 0, playing = true, last = 0, raf;
    const tick = (now) => {
      if (playing) { t = (t + (now - last)) % total; }
      last = now;
      const i = Math.floor(t / 4000); fd.show(i);
      fill.style.width = (t / total * 100) + '%';
      const s = Math.floor(t / 1000); time.textContent = `0:${String(s).padStart(2, '0')} / 0:${total / 1000}`;
      raf = requestAnimationFrame(tick);
    };
    film.addEventListener('open', () => { last = performance.now(); raf = requestAnimationFrame(tick); });
    film.addEventListener('close', () => cancelAnimationFrame(raf));
    tog.addEventListener('click', () => { playing = !playing; tog.textContent = playing ? 'Pause' : 'Play'; tog.setAttribute('aria-pressed', playing); });
  }

  // ── 히어로 사진 교차 ──
  const seq = $('[data-hero-seq]');
  if (seq && !reduce) {
    const fd = fader(seq); $('img', seq).classList.add('kb');
    setInterval(() => { fd.show((fd.cur + 1) % fd.size); const im = seq.lastElementChild; im.classList.add('kb'); }, 5000);
  }

  // ── 커서 라벨(히어로 Play Film · 갤러리 Prev/Next) ──
  function cursorLabel(area, label, textFn) {
    const span = $('span', label);
    area.addEventListener('pointermove', (e) => {
      const r = area.getBoundingClientRect();
      label.style.transform = `translate(${e.clientX - r.left + 16}px, ${e.clientY - r.top + 16}px)`;
      if (textFn) span.textContent = textFn(e, r);
      label.classList.add('is-on');
    });
    area.addEventListener('pointerleave', () => label.classList.remove('is-on'));
  }
  const hero = $('.hero');
  if (hero && $('.hero-play', hero)) cursorLabel(hero, $('.hero > .cursor-label'));

  // ── 큰 갤러리 ──
  $$('[data-lg]').forEach((st) => {
    const slides = $$('.lg-slide', st), n = $('.lg-n', st); let i = 0;
    const srcOf = slides.map((s) => s.dataset.src ? { src: s.dataset.src, alt: s.dataset.alt || '' } : { src: $('img', s).getAttribute('src'), alt: $('img', s).alt });
    srcOf.forEach((o) => { const p = new Image(); p.src = o.src; });
    const fill = (k) => { if (!$('img', slides[k])) { const im = new Image(); im.src = srcOf[k].src; im.alt = srcOf[k].alt; slides[k].appendChild(im); } };
    const go = (d) => {
      const prev = slides[i]; prev.classList.remove('is-on'); prev.setAttribute('aria-hidden', 'true');
      setTimeout(() => { if (!prev.classList.contains('is-on')) { const x = $('img', prev); x && x.remove(); } }, 1100);
      i = (i + d + slides.length) % slides.length; fill(i);
      slides[i].classList.add('is-on'); slides[i].removeAttribute('aria-hidden'); n.textContent = i + 1;
    };
    $('.lg-prev', st).addEventListener('click', () => go(-1));
    $('.lg-next', st).addEventListener('click', () => go(1));
    st.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); });
    cursorLabel(st, $('.cursor-label', st), (e, r) => (e.clientX - r.left < r.width / 2 ? 'Prev' : 'Next'));
  });

  // ── 아코디언 ──
  $$('.acc-toggle').forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', open);
    document.getElementById(b.getAttribute('aria-controls')).classList.toggle('is-open', open);
  }));

  // ── 등장 ──
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('[data-reveal]').forEach((el) => io.observe(el));

  // ── 스크롤 연동(패럴랙스 · 헤더 색 · 사진 구름 · 글자 채움 · 연표 · 챕터) ──
  const pxs = $$('.media .px');
  const footIn = $('.site-footer .ft-in'), foot = $('.site-footer');
  const header = $('.site-header');
  const darkZones = $$('.hero, .cover-cta, .site-footer, .cover-heading:not(.is-plain)');
  const cloud = $('[data-cloud]');
  const fill = $('[data-fill]'); const words = fill ? $$('.w', fill) : [];
  const tl = $('[data-timeline]'); const tlY = tl && $('.tl-y', tl); const tlItems = tl ? $$('.tl-item', tl) : [];
  const chapters = $('.chapters:not(.chapters--gal)');
  const chSecs = $$('[data-chapter]');
  let chIdx = 0;
  let lastY = scrollY;
  function onScroll() {
    const vh = innerHeight;
    if (!reduce) for (const el of pxs) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 … 1
      el.style.setProperty('--py', (Math.max(-1, Math.min(1, p)) * -6).toFixed(2) + '%');
    }
    if (foot && !reduce) { const r = foot.getBoundingClientRect(); const p = Math.max(0, Math.min(1, (vh - r.top) / r.height)); footIn.style.setProperty('--fy', ((1 - p) * -30).toFixed(1) + '%'); }
    if (header) {
      const y = scrollY;
      const scrolled = y > 100;
      header.classList.toggle('is-scrolled', scrolled);
      if (scrolled && !header.classList.contains('has-tr')) setTimeout(() => { if (scrollY > 100) header.classList.add('has-tr'); }, 60);
      if (!scrolled) header.classList.remove('has-tr');
      if (!scrolled) header.classList.remove('is-hidden');
      else if (Math.abs(y - lastY) > 2) header.classList.toggle('is-hidden', y > lastY && !body.classList.contains('is-locked'));
      lastY = y;
      let light = false;
      for (const z of darkZones) { const r = z.getBoundingClientRect(); if (r.top <= 23 && r.bottom >= 23) { light = true; break; } }
      header.classList.toggle('is-light', light);
    }
    if (cloud) {
      const r = cloud.getBoundingClientRect();
      const p = reduce ? 1 : Math.max(0.01, Math.min(1, (vh - r.top) / (vh * .9)));
      cloud.style.setProperty('--p', p.toFixed(3));
    }
    if (fill) {
      const r = fill.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (vh * .85 - r.top) / (r.height + vh * .35)));
      const k = Math.round(p * words.length); words.forEach((w, i) => w.classList.toggle('on', i < k));
    }
    if (tl) {
      let y = tlItems[0].dataset.year;
      for (const it of tlItems) if (it.getBoundingClientRect().top < vh * .55) y = it.dataset.year;
      if (tlY.textContent !== y) { tlY.textContent = y; tlY.classList.remove('roll'); void tlY.offsetWidth; tlY.classList.add('roll'); }
    }
    if (chapters && chSecs.length) {
      const first = chSecs[0].getBoundingClientRect();
      chapters.classList.toggle('is-on', first.bottom < vh * .6 && $('.site-footer').getBoundingClientRect().top > vh * .9);
      let k = 0; chSecs.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * .5) k = i; });
      if (k !== chIdx) { chIdx = k; $('.ch-cur', chapters).textContent = chSecs[k].dataset.chapter; $$('.ch-list a', chapters).forEach((a, i) => a.toggleAttribute('aria-current', i === k)); }
    }
  }
  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });
  addEventListener('resize', onScroll); onScroll();

  // ── 챕터 막대(숙소 · 갤러리) ──
  $$('.chapters').forEach((ch) => {
    const cur = $('.ch-cur', ch), list = $('.ch-list', ch);
    const setList = (o) => { ch.classList.toggle('is-list', o); cur.setAttribute('aria-expanded', o); };
    cur.addEventListener('click', () => setList(!ch.classList.contains('is-list')));
    document.addEventListener('click', (e) => { if (!ch.contains(e.target)) setList(false); });
    ch.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setList(false); cur.focus(); } });
    const isGal = ch.classList.contains('chapters--gal');
    const links = $$('.ch-list a', ch);
    const goGal = (k) => {
      $$('[data-gal]').forEach((g) => { g.hidden = g.dataset.gal !== k; });
      links.forEach((a) => a.toggleAttribute('aria-current', a.dataset.galGo === k)); cur.textContent = k;
      scrollTo({ top: Math.max(0, $('.ptitle').offsetHeight - 40), behavior: reduce ? 'auto' : 'smooth' });
    };
    links.forEach((a) => a.addEventListener('click', (e) => { setList(false); if (isGal) { e.preventDefault(); goGal(a.dataset.galGo); } }));
    const step = (d) => {
      if (isGal) { const ks = links.map((a) => a.dataset.galGo); const k = ks.indexOf(cur.textContent); goGal(ks[(k + d + ks.length) % ks.length]); return; }
      const t = chSecs[Math.max(0, Math.min(chSecs.length - 1, chIdx + d))];
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    };
    $('.ch-prev', ch).addEventListener('click', () => step(-1));
    $('.ch-next', ch).addEventListener('click', () => step(1));
  });

  // ── 지도 ──
  const map = $('[data-map]');
  if (map) {
    const data = JSON.parse($('#pin-data').textContent); const card = $('#pin-card', map);
    const close = () => { card.hidden = true; $$('.pin', map).forEach((p) => p.setAttribute('aria-expanded', 'false')); };
    $$('.pin', map).forEach((p) => p.addEventListener('click', () => {
      const d = data.find((x) => x.slug === p.dataset.pin);
      $$('.pin', map).forEach((q) => q.setAttribute('aria-expanded', q === p));
      $('.pc-img', card).style.backgroundImage = `url("${d.img}")`;
      $('.pc-res', card).textContent = d.res; $('.pc-name', card).textContent = d.name; $('.pc-text', card).textContent = d.text;
      $('.pc-link', card).href = d.href; card.hidden = false;
    }));
    $('.pc-x', card).addEventListener('click', close);
    map.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    const lt = $('.legend-t', map), lu = $('#legend-b', map);
    lt.addEventListener('click', () => { const o = lt.getAttribute('aria-expanded') !== 'true'; lt.setAttribute('aria-expanded', o); lu.hidden = !o; $('.acc-ico', lt).innerHTML = o ? '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M0 5h10" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>' : '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0v10M0 5h10" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>'; });
  }

  // ── 왼쪽 필터 묶음(파트너 허브 · 일지) ──
  const ICO_MINUS = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M0 5h10" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>';
  const ICO_PLUS = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0v10M0 5h10" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>';
  $$('.flt-head').forEach((h) => h.addEventListener('click', () => {
    const o = h.getAttribute('aria-expanded') !== 'true'; h.setAttribute('aria-expanded', o);
    document.getElementById(h.getAttribute('aria-controls')).hidden = !o; $('.acc-ico', h).innerHTML = o ? ICO_MINUS : ICO_PLUS;
  }));
  const pickOne = (btns, b) => btns.forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
  const setBtns = $$('[data-set]');
  setBtns.forEach((b) => b.addEventListener('click', () => { pickOne(setBtns, b); $$('[data-set-panel]').forEach((p) => { p.hidden = p.dataset.setPanel !== b.dataset.set; }); }));
  const yBtns = $$('[data-year]').filter((b) => b.tagName === 'BUTTON');
  yBtns.forEach((b) => b.addEventListener('click', () => { pickOne(yBtns, b); $$('[data-year-panel]').forEach((p) => { p.hidden = p.dataset.yearPanel !== b.dataset.year; }); }));

  // ── 이야기: 필터 + 쪽 ──
  const flt = $('[data-filter]');
  if (flt) {
    const btn = $('.stf-btn', flt), panel = $('#stf-panel'), opts = $$('.stf-opt', flt);
    const all = $$('.st-grid .scard'), feat = $('.st-feature'), pager = $('.pager'), nums = $('.pg-nums'), empty = $('.st-empty');
    const PER = 10; let cat = 'All', pg = 1;
    const setP = (o) => { panel.hidden = !o; btn.setAttribute('aria-expanded', o); };
    btn.addEventListener('click', () => setP(panel.hidden));
    document.addEventListener('click', (e) => { if (!flt.contains(e.target)) setP(false); });
    flt.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setP(false); btn.focus(); } });
    const render = () => {
      const list = all.filter((c) => cat === 'All' || c.dataset.cat === cat);
      const pages = Math.max(1, Math.ceil(list.length / PER)); pg = Math.min(pg, pages);
      all.forEach((c) => { c.hidden = true; });
      list.slice((pg - 1) * PER, pg * PER).forEach((c) => { c.hidden = false; });
      feat.hidden = !(cat === 'All' || $('.scard', feat).dataset.cat === cat) || pg > 1;
      empty.hidden = list.length > 0;
      $('.stf-n', flt).textContent = list.length + (cat === 'All' || $('.scard', feat).dataset.cat === cat ? 1 : 0);
      $('.stf-all', flt).firstChild.textContent = (cat === 'All' ? 'All' : cat) + ' ';
      nums.innerHTML = Array.from({ length: pages }, (_, i) => `<button aria-label="Page ${i + 1}"${i + 1 === pg ? ' aria-current="page"' : ''}>${i + 1}</button>`).join('');
      $$('button', nums).forEach((b, i) => b.addEventListener('click', () => { pg = i + 1; render(); flt.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }));
      $('.pg-prev', pager).disabled = pg <= 1; $('.pg-next', pager).disabled = pg >= pages;
    };
    opts.forEach((o) => o.addEventListener('click', () => { pickOne(opts, o); cat = o.dataset.cat; pg = 1; setP(false); render(); }));
    $('.pg-prev', pager).addEventListener('click', () => { pg--; render(); });
    $('.pg-next', pager).addEventListener('click', () => { pg++; render(); });
    render();
  }

  // ── 링크 복사 ──
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const out = $('.copied', b.parentElement);
    try { await navigator.clipboard.writeText(location.href); out.textContent = 'Link copied'; } catch { out.textContent = location.href; }
    setTimeout(() => { out.textContent = ''; }, 1800);
  }));

  // ── 쿠키 배너 ──
  const ck = $('.cookie');
  if (ck && !store.get('sk-consent')) {
    ck.hidden = false; setTimeout(() => ck.classList.add('is-on'), 1800);
    const done = (v) => { store.set('sk-consent', v); ck.classList.remove('is-on'); setTimeout(() => { ck.hidden = true; }, 500); };
    $('[data-ck-accept]', ck).addEventListener('click', () => done('all'));
    $('[data-ck-decline]', ck).addEventListener('click', () => done('none'));
    const sb = $('[data-ck-settings]', ck);
    sb.addEventListener('click', () => { const o = !ck.classList.contains('is-settings'); ck.classList.toggle('is-settings', o); sb.setAttribute('aria-expanded', o); });
    $$('.switch:not([disabled])', ck).forEach((s) => s.addEventListener('click', () => s.setAttribute('aria-checked', s.getAttribute('aria-checked') !== 'true')));
  }

  // ── 달력(예약) ──
  const cal = $('[data-cal]');
  let range = [null, null];
  const fmt = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const short = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (cal) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let view = new Date(today.getFullYear(), today.getMonth(), 1);
    const box = $('.cal-months', cal);
    const draw = () => {
      box.innerHTML = [0, 1].map((k) => {
        const m = new Date(view.getFullYear(), view.getMonth() + k, 1);
        const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
        let cells = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<span class="dow" aria-hidden="true">${d}</span>`).join('');
        cells += '<span></span>'.repeat(m.getDay());
        for (let d = 1; d <= days; d++) {
          const dt = new Date(m.getFullYear(), m.getMonth(), d), t = dt.getTime();
          const edge = (range[0] && t === range[0].getTime()) || (range[1] && t === range[1].getTime());
          const inR = range[0] && range[1] && t > range[0] && t < range[1];
          cells += `<button type="button" data-t="${t}" class="${edge ? 'is-edge' : ''}${inR ? ' in-range' : ''}"${dt < today ? ' disabled' : ''} aria-label="${dt.toDateString()}"${edge ? ' aria-pressed="true"' : ''}>${d}</button>`;
        }
        return `<div class="cal-m"><p class="cal-h">${m.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p><div class="cal-g">${cells}</div></div>`;
      }).join('');
      $('.cal-prev', cal).disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
      $('.cal-in', cal).textContent = range[0] ? fmt(range[0]) : '—';
      $('.cal-out', cal).textContent = range[1] ? fmt(range[1]) : '—';
      summary();
    };
    box.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-t]'); if (!b) return;
      const d = new Date(+b.dataset.t);
      if (!range[0] || range[1] || d <= range[0]) range = [d, null]; else range[1] = d;
      const keep = b.dataset.t; draw(); const nb = $(`button[data-t="${keep}"]`, box); nb && nb.focus();
    });
    $('.cal-prev', cal).addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); draw(); });
    $('.cal-next', cal).addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); draw(); });
    draw();
  }
  $$('[data-counter]').forEach((c) => {
    const out = $('output', c), minus = $('[data-step="-1"]', c);
    const min = c.dataset.counter === 'adults' ? 1 : 0;
    const upd = () => { minus.disabled = +out.textContent <= min; summary(); };
    $$('[data-step]', c).forEach((b) => b.addEventListener('click', () => { out.textContent = Math.max(min, Math.min(12, +out.textContent + +b.dataset.step)); upd(); }));
    upd();
  });
  function summary() {
    const s = $('.bk-sum'); if (!s) return;
    const props = $$('input[name="prop"]:checked').map((i) => i.value);
    $('.s-props', s).textContent = props.length ? props.join(', ') : '—';
    $('.s-dates', s).textContent = range[0] ? `${short(range[0])} → ${range[1] ? short(range[1]) : '…'}` : '—';
    $('.s-nights', s).textContent = range[0] && range[1] ? Math.round((range[1] - range[0]) / 864e5) : '—';
    const v = (k) => $(`[data-counter="${k}"] output`).textContent;
    $('.s-guests', s).textContent = `${v('adults')} Adults, ${v('children')} Children, ${v('infants')} Infants`;
  }
  $$('input[name="prop"]').forEach((i) => i.addEventListener('change', summary));

  // ── 폼 검증(전송은 하지 않는다) ──
  $$('.js-form').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      let first = null;
      const mark = (el, msg) => {
        const errEl = el.closest('.field')?.querySelector('.err') || f.querySelector(`.err[data-for="${el.name}"]`);
        el.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (errEl) { errEl.textContent = msg; if (!errEl.id) errEl.id = 'e-' + Math.random().toString(36).slice(2, 8); el.setAttribute('aria-describedby', errEl.id); }
        if (msg && !first) first = el;
      };
      $$('input[required], select[required], textarea[required]', f).forEach((el) => {
        let msg = '';
        if (el.type === 'checkbox') msg = el.checked ? '' : 'Please tick to continue';
        else if (!el.value.trim()) msg = 'Required';
        else if (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) msg = 'Check the email format';
        mark(el, msg);
      });
      if (f.id === 'bk-form') {
        const pe = $('.err[data-for="prop"]', f), de = $('.err[data-for="dates"]', f);
        const anyProp = $$('input[name="prop"]:checked', f).length > 0;
        pe.textContent = anyProp ? '' : 'Choose at least one lodge or camp';
        de.textContent = range[0] && range[1] ? '' : 'Choose check-in and check-out dates';
        if (!anyProp && !first) first = $('input[name="prop"]', f);
        if (!(range[0] && range[1]) && !first) first = $('.cal-months button:not(:disabled)', f);
      }
      if (first) { first.focus(); return; }
      const ok = document.createElement('p'); ok.className = 'form-ok'; ok.setAttribute('role', 'status'); ok.tabIndex = -1; ok.textContent = f.dataset.ok;
      f.replaceWith(ok); ok.focus();
      const go = $('.bk-go'); if (go && f.id === 'bk-form') go.disabled = true;
    });
  });
})();
