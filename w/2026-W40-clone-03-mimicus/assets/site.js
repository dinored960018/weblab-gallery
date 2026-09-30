/* PHYLLO — behaviour for the mimic.us study reproduction. Vanilla JS, no dependencies. */
(() => {
  const d = document, B = d.body, ROOT = B.dataset.root || './', LANG = B.dataset.lang || 'ko';
  d.documentElement.classList.add('js');
  const $ = (s, el = d) => el.querySelector(s);
  const $$ = (s, el = d) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = (ko, en) => (LANG === 'en' ? en : ko);
  const escH = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  /* scroll lock shared by menus and dialogs */
  let locks = 0;
  const lock = (on) => { locks = Math.max(0, locks + (on ? 1 : -1)); d.documentElement.classList.toggle('is-locked', locks > 0); B.classList.toggle('is-locked', locks > 0); };

  /* ── header search mode (search icon ↔ MENU box) ───────── */
  const hdr = $('#hdr');
  const sbar = $('[data-search]');
  const sOpen = $('[data-search-open]'), sClose = $('[data-search-close]');
  const setSearch = (on, focus = true) => {
    sbar.hidden = !on; sClose.hidden = !on; hdr.classList.toggle('is-search', on);
    sOpen.setAttribute('aria-expanded', String(on));
    if (on && focus) $('input[name=q]', sbar).focus();
    if (!on && focus) sOpen.focus();
  };
  sOpen.addEventListener('click', () => setSearch(true));
  sClose.addEventListener('click', () => setSearch(false));
  const modeSel = $('[data-mode]', sbar), qIn = $('input[name=q]', sbar);
  const phFor = () => { qIn.placeholder = modeSel.value === 'semantic' ? qIn.dataset.phS : qIn.dataset.phK; };
  modeSel.addEventListener('change', phFor);
  const params = new URLSearchParams(location.search);
  if (B.classList.contains('p-search')) { // results page opens in search mode with the query filled
    qIn.value = params.get('q') || ''; modeSel.value = params.get('mode') === 'semantic' ? 'semantic' : 'keyword'; phFor(); setSearch(true, false);
  }
  const goSearch = (form, e) => {
    e.preventDefault();
    const q = new FormData(form).get('q').trim();
    const mode = new FormData(form).get('mode') || 'keyword';
    const url = new URL(form.getAttribute('action'), location.href);
    url.search = new URLSearchParams({ q, mode }).toString();
    location.href = url.href;
  };
  sbar.addEventListener('submit', (e) => goSearch(sbar, e));
  const hero = $('[data-hero-search]');
  if (hero) hero.addEventListener('submit', (e) => goSearch(hero, e));

  /* ── dropdowns: language + mobile "Menus" ───────────── */
  function dropdown(btn, menu, { scrollLock = false } = {}) {
    const set = (on, focusBtn) => {
      if ((btn.getAttribute('aria-expanded') === 'true') === on) return;
      btn.setAttribute('aria-expanded', String(on)); menu.hidden = !on;
      if (scrollLock) lock(on);
      if (on) { const f = $('a', menu); f && f.focus(); } else if (focusBtn) btn.focus();
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    d.addEventListener('click', (e) => { if (!menu.hidden && !btn.contains(e.target) && !menu.contains(e.target)) set(false); });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) set(false, true); });
    menu.addEventListener('keydown', (e) => {
      const items = $$('a', menu); const i = items.indexOf(d.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    });
    return set;
  }
  const langBtn = $('.lang__btn');
  if (langBtn) dropdown(langBtn, $('#lang-menu'));
  const mBtn = $('[data-mmenu]');
  if (mBtn) dropdown(mBtn, $('#mmenu-list'), { scrollLock: true });
  d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sbar.hidden && sbar.contains(d.activeElement)) setSearch(false); });

  /* ── entrance animations (viewport-triggered, like the original) ── */
  const anim = $$('.m-slide, .m-fade, .m-fold, .m-float');
  if (reduce || !('IntersectionObserver' in window)) anim.forEach((el) => el.classList.add('is-in'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    anim.forEach((el) => io.observe(el));
  }

  /* ── list skeleton (original shows a loading card with a quote ~0.4s) ── */
  $$('[data-skel]').forEach((box) => { box.classList.add('is-loading'); setTimeout(() => box.classList.remove('is-loading'), reduce ? 0 : 420); });

  /* ── dialogs (case modal + magazine lightbox) ───────── */
  function dialog(root, { onOpen } = {}) {
    let last = null;
    const box = root.querySelector('[tabindex="-1"]');
    const focusables = () => $$('a[href], button:not([hidden]), input, select, textarea, [tabindex="0"]', root).filter((x) => x.offsetParent !== null);
    const close = () => {
      if (root.hidden) return;
      root.hidden = true; root.classList.remove('is-open'); lock(false);
      if (location.hash && root.id === 'modal') history.replaceState(null, '', location.pathname + location.search);
      last && last.focus();
    };
    const open = (arg, opener) => {
      last = opener || d.activeElement;
      onOpen(arg);
      root.hidden = false; lock(true);
      requestAnimationFrame(() => root.classList.add('is-open'));
      box.focus();
    };
    root.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
    root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') {
        const f = focusables(); if (!f.length) return;
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && (d.activeElement === a || d.activeElement === box)) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    return { open, close };
  }

  const modal = $('#modal');
  let artDlg = null;
  if (modal) {
    const slot = $('[data-slot]', modal);
    artDlg = dialog(modal, { onOpen: (slug) => { const t = $('#art-' + slug); slot.innerHTML = ''; slot.append(t.content.cloneNode(true)); slot.scrollTop = 0; } });
    d.addEventListener('click', (e) => {
      const a = e.target.closest('[data-article]'); if (!a) return;
      e.preventDefault(); history.replaceState(null, '', '#' + a.dataset.article); artDlg.open(a.dataset.article, a);
    });
    const h = location.hash.slice(1);
    if (h && $('#art-' + h)) artDlg.open(h, null);
  }

  const lbox = $('#lbox');
  if (lbox) {
    const tiles = $$('.maggrid .mag');
    const data = JSON.parse(($('#mag-data') || {}).textContent || '[]');
    const media = $('[data-media]', lbox), text = $('[data-text]', lbox), date = $('[data-date]', lbox);
    let idx = 0;
    const fmt = (s) => { const [y, m, dd] = s.split('-').map(Number); return LANG === 'en' ? new Date(y, m - 1, dd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : `${y}년 ${m}월 ${dd}일`; };
    const show = (i) => {
      idx = (i + tiles.length) % tiles.length;
      const clone = tiles[idx].cloneNode(true); clone.removeAttribute('data-post'); clone.setAttribute('tabindex', '-1'); clone.setAttribute('aria-hidden', 'true');
      const div = d.createElement('div'); div.className = clone.className; div.innerHTML = clone.innerHTML;
      media.innerHTML = ''; media.append(div);
      text.textContent = data[idx] ? data[idx].x : ''; date.textContent = data[idx] ? fmt(data[idx].d) : '';
    };
    const lb = dialog(lbox, { onOpen: show });
    tiles.forEach((t, i) => t.addEventListener('click', () => lb.open(i, t)));
    $('[data-prev]', lbox).addEventListener('click', () => show(idx - 1));
    $('[data-next]', lbox).addEventListener('click', () => show(idx + 1));
    lbox.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
  }

  /* ── pagination (in place, like the original) ───────── */
  $$('[data-pager]').forEach((nav) => {
    const list = $(`[data-list="${nav.dataset.pager}"]`);
    const items = $$(':scope > li', list);
    const per = +nav.dataset.per, n = +nav.dataset.pages;
    const label = $('[data-page-label]');
    const next = $('[data-page-next]', nav);
    let cur = 1;
    const go = (pg, scroll) => {
      cur = Math.min(Math.max(1, pg), n);
      items.forEach((li, i) => { li.hidden = Math.floor(i / per) + 1 !== cur; });
      $$('[data-page]', nav).forEach((b) => (+b.dataset.page === cur ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current')));
      if (next) next.disabled = cur === n;
      if (label) label.textContent = `Page #${cur} of ${n} pages`;
      if (scroll) { const top = $('#list'); top && top.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
    };
    nav.addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]'); if (b) go(+b.dataset.page, true);
      if (e.target.closest('[data-page-next]')) go(cur + 1, true);
    });
    go(1, false);
  });

  /* ── accordion (single open, like the original) ─────── */
  $$('[data-acc]').forEach((acc) => {
    const btns = $$('button[aria-controls]', acc);
    btns.forEach((b) => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-expanded') !== 'true';
      btns.forEach((x) => { x.setAttribute('aria-expanded', 'false'); $('#' + x.getAttribute('aria-controls')).hidden = true; });
      b.setAttribute('aria-expanded', String(on)); $('#' + b.getAttribute('aria-controls')).hidden = !on;
    }));
  });

  /* ── inquiry form validation (submit is blocked) ────── */
  const form = $('[data-form]');
  if (form) {
    const status = $('.inq__status', form);
    const msg = {
      req: T('필수 항목입니다.', 'This field is required.'),
      mail: T('이메일 주소 형식이 아닙니다. 예: name@example.com', 'Enter an email address such as name@example.com.'),
      svc: T('관심 서비스를 하나 이상 선택해 주세요.', 'Select at least one service.'),
    };
    const setErr = (el, errEl, text) => {
      if (el) el.setAttribute('aria-invalid', text ? 'true' : 'false');
      errEl.textContent = text || '';
    };
    const check = (input) => {
      const e = $('#' + input.id + '-e');
      const v = input.value.trim();
      if (input.required && !v) return setErr(input, e, msg.req), false;
      if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setErr(input, e, msg.mail), false;
      setErr(input, e, ''); return true;
    };
    const svcSet = $('fieldset[aria-describedby="svc-e"]', form);
    const checkSvc = () => { const ok = $$('input[name=svc]:checked', form).length > 0; svcSet.classList.toggle('is-err', !ok); setErr(null, $('#svc-e'), ok ? '' : msg.svc); return ok; };
    $$('.fld input', form).forEach((i) => i.addEventListener('blur', () => { if (i.value || i.getAttribute('aria-invalid') === 'true') check(i); }));
    $$('input[name=svc]', form).forEach((c) => c.addEventListener('change', () => { if (svcSet.classList.contains('is-err')) checkSvc(); }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const okSvc = checkSvc();
      const fields = $$('.fld input', form).map((i) => [i, check(i)]);
      const bad = fields.filter(([, ok]) => !ok).map(([i]) => i);
      if (!okSvc || bad.length) {
        status.classList.add('is-err');
        status.textContent = T(`입력하지 않았거나 잘못된 항목이 ${bad.length + (okSvc ? 0 : 1)}개 있습니다.`, `${bad.length + (okSvc ? 0 : 1)} field(s) need attention.`);
        (okSvc ? bad[0] : $('input[name=svc]', form)).focus();
        return;
      }
      status.classList.remove('is-err');
      status.textContent = T('입력 확인이 끝났습니다. 이 페이지는 연습용 모작이라 실제로 전송하지 않습니다.', 'All fields are valid. This is a study copy, so nothing is sent.');
    });
  }

  /* ── search results ─────────────────────────────────── */
  const res = $('[data-results]');
  if (res) {
    const data = JSON.parse($('#search-data').textContent);
    const q = (params.get('q') || '').trim();
    const mode = params.get('mode') === 'semantic' ? 'semantic' : 'keyword';
    const type = params.get('type') || 'all';
    const more = res.dataset.more === '1';
    const STOP = new Set('a an the of to in on for and or how what why do does can is are be by with from at it its this that which who whom into than then so as up out about using use'.split(' '));
    const terms = mode === 'semantic' ? q.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 1 && !STOP.has(w)).map((w) => w.replace(/(ies)$/, 'y').replace(/(es|s)$/, '')) : (q ? [q.toLowerCase()] : []);
    const score = (item, fields) => {
      const hay = fields.map((f) => [].concat(item[f] || []).join(' ')).join(' ').toLowerCase();
      if (!terms.length) return 0;
      if (mode === 'keyword') return hay.includes(terms[0]) ? 1 + (hay.split(terms[0]).length - 2) * 0.01 : 0;
      return terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
    };
    const rank = (arr, fields) => arr.map((x) => [x, score(x, fields)]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).map(([x]) => x);
    const re = terms.length ? new RegExp('(' + terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi') : null;
    const hl = (s) => { const e = escH(s); return re ? e.replace(re, '<mark>$1</mark>') : e; };
    const A = rank(data.a, ['t', 'x', 'alt']), P = rank(data.p, ['t', 'x', 'tags', 'au']), Pt = rank(data.t, ['t', 'x', 'au']);
    const u = (path) => ROOT + (LANG === 'en' ? 'en/' : '') + path;
    const sp = (k) => { const s = data.s[k]; return s ? `<div class="spbox"><a class="spbox__i" href="https://www.gbif.org/species/search?q=${encodeURIComponent(s.sci)}" target="_blank" rel="noopener"><img src="${ROOT}assets/photos/${s.ph}" alt="${escH(s.c)}" loading="lazy"><span class="spbox__sci">${escH(s.sci)}</span><span class="spbox__c">${escH(s.c)}</span></a></div>` : ''; };
    const aCard = (a) => `<li class="acard"><a class="acard__a" href="${u('articles/index.html')}#${a.id}" data-article="${a.id}"><div class="acard__img"><img src="${ROOT}assets/photos/${a.ph}" alt="" loading="lazy"><h3 class="acard__t"><span>${hl(a.t)}</span></h3></div><p class="acard__x">${hl(a.x)}</p><p class="acard__d">Last updated on ${a.d} by PHYLLO Rangers</p></a></li>`;
    const pCard = (x) => `<li class="pcard${x.sp ? ' pcard--sp' : ''}"><div class="pcard__main"><p class="pcard__j">${escH(x.j)}</p><h3 class="pcard__t"><a href="https://scholar.google.com/scholar?q=${encodeURIComponent(x.q)}" target="_blank" rel="noopener">${hl(x.t)}</a></h3><p class="pcard__a">${escH(x.au)}</p><p class="pcard__x">${hl(x.x)}</p>${x.tags ? `<ul class="pills">${x.tags.map((t) => `<li>${hl(t)}</li>`).join('')}</ul>` : ''}</div>${sp(x.sp)}</li>`;
    const tCard = (x) => `<li class="pcard pcard--pt${x.sp ? ' pcard--sp' : ''}"><div class="pcard__main"><p class="pcard__j">${escH(x.j)}</p><h3 class="pcard__t"><a href="https://patents.google.com/?q=${encodeURIComponent(x.q)}" target="_blank" rel="noopener">${hl(x.t)}</a></h3><p class="pcard__a">${escH(x.au)}</p><p class="pcard__x">${hl(x.x)}</p></div>${sp(x.sp)}</li>`;
    const title = mode === 'semantic' ? ['Semantic Search', '의미 검색 결과'] : ['Keyword Search', '키워드 검색 결과'];
    $('[data-mode-title]').textContent = title[0]; const tk = $('[data-mode-title-ko]'); if (tk) tk.textContent = title[1];
    const qs = (t) => `?${new URLSearchParams({ q, mode, ...(t ? { type: t } : {}) })}`;
    $$('[data-tab]').forEach((a) => {
      const k = a.dataset.tab; a.href = a.href.split('?')[0] + qs(k === 'all' ? '' : k);
      if ((more && k === type) || (!more && k === 'all')) a.setAttribute('aria-current', 'page');
    });
    const sum = $('[data-sum]');
    const total = A.length + P.length + Pt.length;
    const secT = {
      articles: ['🌿', 'Biomimicry Case Studies', '자연모방 사례 검색 결과', A.length, T('건의 사례를', ' case studies')],
      papers: ['🔬', 'Biomimetics Research Papers', '자연모방 논문 검색 결과', P.length, T('건의 논문을', ' papers')],
      patents: ['💡', 'Bio-inspired Patents', '자연모방 특허 검색 결과', Pt.length, T('건의 특허를', ' patents')],
    };
    const head = (k) => { const [e, en, ko, n, unit] = secT[k]; return `<div class="stitle"><h2 class="stitle__h"><span aria-hidden="true">${e}</span> ${en}${LANG === 'ko' ? ` | ${ko}` : ''}</h2><p class="stitle__r">${T(`검색어 "${escH(q)}"에 대해 ${n}${unit} 찾았습니다.`, `Found ${n}${unit} for "${escH(q)}".`)}</p></div>`; };
    const moreLink = (k, n) => (n > 5 ? `<p class="sres__more"><a href="${u('searchshowmore/index.html')}${qs(k)}">More ${secT[k][0]} ${secT[k][1]} ➤</a></p>` : '');
    const none = `<p class="sres__none">${T('검색 결과가 없습니다. 다른 검색어나 검색 방식을 써 보세요.', 'No results. Try another word or search mode.')}</p>`;
    const sec = (k, list, card, lim) => `<section class="sres__sec" aria-label="${secT[k][1]}">${head(k)}${list.length ? `<ul class="${k === 'articles' ? 'agrid' : 'plist'}">${list.slice(0, lim).map(card).join('')}</ul>${lim < 99 ? moreLink(k, list.length) : ''}` : none}</section>`;
    if (!q) {
      sum.textContent = T('검색어를 입력해 주세요.', 'Enter a search term.');
      res.innerHTML = `<p class="sres__none">${T('위 검색창에 영문 검색어를 입력하세요. 예: surface, adhesion, drag', 'Type an English word in the search bar above, e.g. surface, adhesion, drag.')}</p>`;
    } else if (more) {
      const map = { articles: [A, aCard], papers: [P, pCard], patents: [Pt, tCard] };
      const [list, card] = map[type] || map.papers;
      sum.textContent = T(`검색어 "${q}"에 대해 ${list.length}${secT[type in map ? type : 'papers'][4]} 찾았습니다.`, `Found ${list.length}${secT[type in map ? type : 'papers'][4]} for "${q}".`);
      res.innerHTML = sec(type in map ? type : 'papers', list, card, 99);
    } else {
      sum.textContent = T(`질문 "${q}"에 대해 모두 ${total}건의 결과를 찾았습니다.`, `Found ${total} results for "${q}".`);
      res.innerHTML = sec('articles', A, aCard, 6) + sec('papers', P, pCard, 5) + sec('patents', Pt, tCard, 5);
    }
  }
})();
