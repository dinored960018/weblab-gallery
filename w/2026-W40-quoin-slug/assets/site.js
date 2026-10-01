// Quoin & Slug — 메뉴 · 가이드 선 · 맞춤 · 테스터 · 목록 필터 · 글리프 · 계산기 · 장바구니
(() => {
  'use strict';
  const QS = window.QS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fam = Object.fromEntries(QS.families.map((f) => [f.slug, f]));
  const eur = (n) => '€' + Math.round(n).toLocaleString('en-GB');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fvs = (o) => Object.entries(o).map(([t, v]) => `'${t}' ${v}`).join(', ');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  // 저장: 막히면 메모리
  const mem = {};
  const store = {
    get(k) { try { const v = localStorage.getItem(k); return v == null ? mem[k] ?? null : v; } catch { return mem[k] ?? null; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, v); } catch { /* 메모리만 */ } },
  };

  // ---------- 메뉴 ----------
  const menuBtn = $('.menu-btn');
  const nav = $('#nav');
  function setMenu(open, focusBtn) {
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    document.documentElement.classList.toggle('lock', open);
    menuBtn.textContent = open ? 'Close' : 'Menu';
    if (open) { const a = $('a', nav); if (a) a.focus(); } else if (focusBtn) menuBtn.focus();
  }
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false, true); });
  window.matchMedia('(min-width: 861px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });

  // ---------- 가이드 선 ----------
  // 첫 줄과 같은 글꼴 설정의 보이지 않는 거울 줄에 탐침을 넣고, 탐침 위치로 선을 긋는다.
  // cap · ex 단위는 현재 축 값의 글꼴 메트릭을 따른다(Chrome 실측).
  const LINES = [['asc', 'asc', 'dash'], ['cap', 'cap', ''], ['x', 'x', ''], ['base', 'base', 'base'], ['desc', 'desc', 'dash']];
  function guides(stage, again) {
    const text = $('.gtext', stage);
    if (!text) return null;
    let wrap = stage.__gl;
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'gl-wrap'; wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = LINES.map(([k, , c]) => `<div class="gl ${c}" data-l="${k}"><span></span></div>`).join('')
        + '<div class="gmirror" data-m1>H<i data-p="cap" style="vertical-align:baseline;height:1cap"></i><i data-p="x" style="vertical-align:baseline;height:1ex"></i><i data-p="base" style="vertical-align:baseline;height:0"></i></div>'
        // 어센트·디센트는 줄 상자를 넓히므로 행간 normal 인 따로 된 거울에서 잰다
        + '<div class="gmirror" data-m2>H<i data-p="asc" style="vertical-align:text-top;height:0"></i><i data-p="base2" style="vertical-align:baseline;height:0"></i><i data-p="desc" style="vertical-align:text-bottom;height:0"></i></div>';
      stage.insertBefore(wrap, stage.firstChild);
      stage.__gl = wrap;
    }
    const cs = getComputedStyle(text);
    const wr = wrap.getBoundingClientRect();
    const tr = text.getBoundingClientRect();
    for (const mirror of $$('.gmirror', wrap)) {
      for (const p of ['fontFamily', 'fontSize', 'lineHeight', 'fontVariationSettings', 'fontWeight', 'fontStretch', 'fontOpticalSizing', 'letterSpacing', 'fontStyle']) mirror.style[p] = cs[p];
      mirror.style.top = (tr.top - wr.top + parseFloat(cs.paddingTop)) + 'px';
      mirror.style.left = '0px';
    }
    $('[data-m2]', wrap).style.lineHeight = 'normal';
    const mr = (k) => $(`[data-p="${k}"]`, wrap).getBoundingClientRect();
    const size = parseFloat(cs.fontSize);
    const base = mr('base').top;
    const b2 = mr('base2').top;
    const y = { asc: base - (b2 - mr('asc').top), cap: mr('cap').top, x: mr('x').top, base, desc: base + (mr('desc').bottom - b2) };
    const em = {};
    for (const [k] of LINES) {
      const line = $(`[data-l="${k}"]`, wrap);
      line.style.top = Math.round(y[k] - wr.top) + 'px';
      em[k] = (base - y[k]) / size;
      const v = k === 'base' ? '0' : Math.abs(em[k]).toFixed(2).replace(/^0/, '');
      $('span', line).textContent = `${k} ${k === 'desc' ? '−' : ''}${v}`;
    }
    // 라벨이 겹치면 우선순위가 낮은 쪽을 숨긴다 (선은 남긴다)
    const shown = [];
    for (const k of ['base', 'cap', 'x', 'asc', 'desc']) {
      const sp = $(`[data-l="${k}"] span`, wrap);
      const clash = shown.some((v) => Math.abs(v - y[k]) < 15);
      sp.style.visibility = clash ? 'hidden' : '';
      if (!clash) shown.push(y[k]);
    }
    // 어센트·디센트 선이 칸 밖으로 나가면 칸 여백을 늘려 담는다 (위아래 글과 겹치지 않게)
    if (!stage.__pad) { const s = getComputedStyle(stage); stage.__pad = [parseFloat(s.paddingTop), parseFloat(s.paddingBottom)]; }
    const sr = stage.getBoundingClientRect(); const scs = getComputedStyle(stage);
    const curT = parseFloat(scs.paddingTop), curB = parseFloat(scs.paddingBottom);
    const tT = Math.max(stage.__pad[0], Math.ceil(curT + 22 - (y.asc - sr.top)));
    const tB = Math.max(stage.__pad[1], Math.ceil(curB + 6 - (sr.bottom - y.desc)));
    if (!again && (Math.abs(tT - curT) > 1 || Math.abs(tB - curB) > 1)) {
      stage.style.paddingTop = tT + 'px'; stage.style.paddingBottom = tB + 'px';
      return guides(stage, true);
    }
    stage.classList.toggle('small', size < 64);
    stage.__em = em;
    return em;
  }
  const allGuides = () => $$('[data-guides]').forEach(guides);

  // ---------- 맞춤: 한 줄이 칸을 넘지 않게 ----------
  function fit(el, maxPx, vars) {
    const saveV = el.style.fontVariationSettings;
    if (vars) el.style.fontVariationSettings = vars; // 가장 넓은 인스턴스로 재고 되돌린다
    el.style.whiteSpace = 'nowrap';
    el.style.fontSize = '100px';
    const r = document.createRange(); r.selectNodeContents(el);
    const w = r.getBoundingClientRect().width;
    const avail = el.clientWidth;
    const px = w > 0 ? Math.min(maxPx, (100 * avail) / w * 0.98) : maxPx;
    el.style.fontSize = Math.floor(px) + 'px';
    if (vars) el.style.fontVariationSettings = saveV;
  }
  function fitAll() {
    $$('[data-fit]').forEach((el) => {
      if (el.closest('[data-hero]')) fit(el, 460);
      else if (el.classList.contains('fam-name')) fit(el, 240);
      else if (el.closest('.nf')) fit(el, 420);
      else fit(el, el.closest('.read') ? 260 : 300);
    });
  }
  function relayout() { fitAll(); allGuides(); }

  // ---------- 테스터 ----------
  const T = $('[data-tester]');
  let tester = null;
  if (T) {
    const text = $('.t-text', T);
    const stage = $('[data-tstage]', T);
    const out = (k, v) => { const o = $(`[data-out="${k}"]`, T); if (o) o.textContent = v; };
    const input = (k) => $(`[data-t="${k}"]`, T);
    const params = new URLSearchParams(location.search);
    const initial = (slug) => {
      const f = fam[slug];
      return { family: slug, text: f.sample, wght: f.axes.wght[2], wdth: f.axes.wdth ? f.axes.wdth[2] : 100, opsz: f.axes.opsz ? f.axes.opsz[2] : 12, opszAuto: true, size: innerWidth < 600 ? 56 : 96, lead: 1.1, align: 'left', dark: false, guides: true };
    };
    let S = initial(T.dataset.family);
    const picker = input('family');
    if (params.has('f') && picker && fam[params.get('f')]) S = initial(params.get('f'));
    const num = (k, a, b) => { const v = parseFloat(params.get(k)); return Number.isFinite(v) ? clamp(v, a, b) : null; };
    {
      const f = fam[S.family];
      if (params.has('t')) S.text = params.get('t').slice(0, 400);
      const w = num('w', f.axes.wght[0], f.axes.wght[1]); if (w != null) S.wght = w;
      if (f.axes.wdth) { const x = num('x', f.axes.wdth[0], f.axes.wdth[1]); if (x != null) S.wdth = x; }
      if (f.axes.opsz && params.has('o')) { if (params.get('o') === 'auto') S.opszAuto = true; else { const o = num('o', f.axes.opsz[0], f.axes.opsz[1]); if (o != null) { S.opsz = o; S.opszAuto = false; } } }
      const s = num('s', 12, 240); if (s != null) S.size = s;
      const l = num('l', 0.8, 2); if (l != null) S.lead = l;
      if (['left', 'center', 'right'].includes(params.get('a'))) S.align = params.get('a');
      if (params.get('m') === 'dark') S.dark = true;
      if (params.get('g') === '0') S.guides = false;
    }

    const vars = () => {
      const f = fam[S.family]; const o = { wght: S.wght };
      if (f.axes.wdth) o.wdth = S.wdth;
      if (f.axes.opsz) o.opsz = S.opszAuto ? clamp(S.size, f.axes.opsz[0], f.axes.opsz[1]) : S.opsz;
      return o;
    };
    const shareUrl = () => {
      const p = new URLSearchParams();
      if (picker) p.set('f', S.family);
      p.set('t', S.text); p.set('w', S.wght);
      const f = fam[S.family];
      if (f.axes.wdth) p.set('x', S.wdth);
      if (f.axes.opsz) p.set('o', S.opszAuto ? 'auto' : S.opsz);
      p.set('s', S.size); p.set('l', S.lead); p.set('a', S.align);
      if (S.dark) p.set('m', 'dark');
      if (!S.guides) p.set('g', '0');
      return location.href.split(/[?#]/)[0] + '?' + p.toString() + '#tester';
    };
    let touched = [...params.keys()].length > 0;
    const writeUrl = debounce(() => { if (!touched) return; try { history.replaceState(null, '', shareUrl()); } catch { /* file:// 등에서 막힘 */ } }, 250);

    function syncControls() {
      const f = fam[S.family];
      const set = (k, min, max, v) => { const el = input(k); if (!el) return; el.min = min; el.max = max; el.value = v; };
      set('wght', f.axes.wght[0], f.axes.wght[1], S.wght);
      $('[data-axis="wdth"]', T).hidden = !f.axes.wdth;
      $('[data-axis="opsz"]', T).hidden = !f.axes.opsz;
      if (f.axes.wdth) set('wdth', f.axes.wdth[0], f.axes.wdth[1], S.wdth);
      if (f.axes.opsz) set('opsz', f.axes.opsz[0], f.axes.opsz[1], S.opsz);
      input('opszAuto').checked = S.opszAuto;
      input('opsz').disabled = S.opszAuto;
      input('size').value = S.size; input('lead').value = S.lead;
      $$('[data-align]', T).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.align === S.align)));
      input('dark').setAttribute('aria-pressed', String(S.dark));
      input('guides').setAttribute('aria-pressed', String(S.guides));
      if (picker) picker.value = S.family;
      const pr = $('[data-presets]', T);
      if (pr.dataset.for !== S.family) {
        pr.dataset.for = S.family;
        pr.innerHTML = f.presets.map(([n, v]) => `<button type="button" class="btn-plain" data-preset='${JSON.stringify(v)}'>${n}</button>`).join('');
      }
    }
    function render(opts = {}) {
      const f = fam[S.family];
      const v = vars();
      text.style.fontFamily = `'${f.name}', serif`;
      text.style.fontVariationSettings = fvs(v);
      text.style.fontSize = S.size + 'px';
      text.style.lineHeight = String(S.lead);
      text.style.textAlign = S.align;
      if (!opts.keepText && text.innerText !== S.text) text.textContent = S.text;
      T.classList.toggle('dark', S.dark);
      stage.classList.toggle('no-guides', !S.guides);
      out('wght', Math.round(S.wght)); out('wdth', (+S.wdth).toFixed(1).replace(/\.0$/, '') + '%');
      out('opsz', Math.round(v.opsz ?? S.opsz)); out('size', S.size + 'px'); out('lead', (+S.lead).toFixed(2));
      $('[data-readout]', T).textContent = `${f.name} · ${Object.entries(v).map(([t, x]) => `${t} ${Math.round(x * 10) / 10}`).join(' · ')} · ${S.size}px / ${(+S.lead).toFixed(2)}`;
      guides(stage);
      writeUrl();
    }
    // 축 전환 모션: 240ms 동안 선도 따라 움직인다
    function animateTo(next) {
      Object.assign(S, next);
      if (next.opsz != null) S.opszAuto = false;
      if (reduce.matches) { syncControls(); render(); return; }
      T.classList.add('animating');
      syncControls(); render();
      const t0 = performance.now();
      const step = (t) => { guides(stage); if (t - t0 < 300) requestAnimationFrame(step); else { T.classList.remove('animating'); guides(stage); } };
      requestAnimationFrame(step);
    }
    const status = (m) => { $('[data-status]', T).textContent = m; };

    T.addEventListener('input', (e) => {
      touched = true;
      const k = e.target.dataset.t;
      if (e.target === text) { S.text = text.innerText.replace(/\n$/, '').slice(0, 400); render({ keepText: true }); return; }
      if (!k) return;
      if (k === 'opszAuto') { S.opszAuto = e.target.checked; input('opsz').disabled = S.opszAuto; }
      else if (k === 'family') {
        const was = fam[S.family];
        const keep = S.text !== was.sample ? S.text : null;
        S = { ...initial(e.target.value), size: S.size, lead: S.lead, align: S.align, dark: S.dark, guides: S.guides };
        if (keep) S.text = keep;
        syncControls();
        status(`${fam[S.family].name} loaded in the tester.`);
      } else S[k] = parseFloat(e.target.value);
      render();
    });
    T.addEventListener('change', (e) => { if (e.target.dataset.t === 'opszAuto') render(); });
    T.addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      touched = true;
      if (b.dataset.align) { S.align = b.dataset.align; syncControls(); render(); }
      else if (b.dataset.t === 'dark') { S.dark = !S.dark; syncControls(); render(); }
      else if (b.dataset.t === 'guides') { S.guides = !S.guides; syncControls(); render(); }
      else if (b.dataset.preset) { animateTo(JSON.parse(b.dataset.preset)); status(`Preset: ${b.textContent}.`); }
      else if (b.dataset.t === 'reset') { S = initial(S.family); syncControls(); render(); status('Tester reset.'); }
      else if (b.dataset.t === 'share') {
        const url = shareUrl();
        const box = $('[data-sharebox]', T); const field = $('[data-url]', T);
        field.value = url; box.hidden = false;
        try { await navigator.clipboard.writeText(url); status('Link copied. It opens the tester with these settings.'); }
        catch { field.focus(); field.select(); status('Copy the link from the field below.'); }
      }
    });
    text.addEventListener('keydown', (e) => { if (e.key === 'Escape') text.blur(); });
    text.addEventListener('paste', (e) => { e.preventDefault(); const t = (e.clipboardData || window.clipboardData).getData('text'); document.execCommand('insertText', false, t.slice(0, 400)); });

    syncControls(); render();
    tester = { set(v, label) { touched = true; animateTo(v); status(`${label} set in the tester.`); T.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' }); }, vars, state: () => S };
  }
  $$('[data-set]').forEach((b) => b.addEventListener('click', () => { if (tester) tester.set(JSON.parse(b.dataset.set), b.closest('.wrow').querySelector('.wrow-lab').textContent); }));

  // ---------- 홈 첫 견본: 포인터 → 폭 · 굵기 (모션 1) ----------
  const hero = $('[data-hero]');
  if (hero) {
    const text = $('.gtext', hero); const stage = $('.stage', hero); const read = $('[data-hero-read]');
    const setV = (w, x) => { text.style.fontVariationSettings = fvs({ wght: Math.round(w), wdth: Math.round(x) }); fit(text, 460); read.textContent = `Anybody · wght ${Math.round(w)} · wdth ${Math.round(x)}`; guides(stage); };
    let raf = 0;
    stage.addEventListener('pointermove', (e) => {
      if (reduce.matches) return;
      const r = stage.getBoundingClientRect();
      const px = clamp((e.clientX - r.left) / r.width, 0, 1); const py = clamp((e.clientY - r.top) / r.height, 0, 1);
      cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setV(100 + py * 800, 50 + px * 100));
    });
    const sweep = () => {
      if (reduce.matches) return;
      const t0 = performance.now(); const D = 1600;
      const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
      const step = (t) => {
        const k = clamp((t - t0) / D, 0, 1);
        const w = k < 0.6 ? 100 + 800 * ease(k / 0.6) : 900 - 200 * ease((k - 0.6) / 0.4);
        setV(w, 100);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    document.fonts.ready.then(() => setTimeout(sweep, 200));
  }

  // ---------- 404 ----------
  const nf = $('[data-nf]');
  if (nf) {
    const r = $('[data-nf-w]'); const t = $('.gtext', nf);
    r.addEventListener('input', () => { t.style.fontVariationSettings = fvs({ wght: 900, wdth: r.value }); $('[data-nf-out]').textContent = r.value + '%'; fit(t, 420); guides($('.stage', nf)); });
  }

  // ---------- 목록 ----------
  const FC = $('[data-fcontrols]');
  if (FC) {
    const list = $('[data-flist]'); const rows = $$('[data-frow]', list);
    const F = { axes: new Set(), genre: 'all', sort: 'order', text: $('[data-f="text"]').value, size: 72 };
    const q = new URLSearchParams(location.search);
    if (q.get('genre') && ['sans', 'serif', 'display'].includes(q.get('genre'))) F.genre = q.get('genre');
    (q.get('axis') || '').split(',').filter((a) => a === 'wdth' || a === 'opsz').forEach((a) => F.axes.add(a));
    if (['order', 'range', 'price', 'added'].includes(q.get('sort'))) F.sort = q.get('sort');
    function apply() {
      let n = 0;
      rows.forEach((r) => {
        const ax = r.dataset.axes.split(' ');
        const ok = [...F.axes].every((a) => ax.includes(a)) && (F.genre === 'all' || r.dataset.genre === F.genre);
        r.hidden = !ok; if (ok) n++;
        const t = $('.gtext', r); if (t.textContent !== F.text) t.textContent = F.text || ' ';
        r.style.setProperty('--fsize', F.size + 'px');
      });
      const key = { order: (r) => +r.dataset.order, range: (r) => -r.dataset.range, price: (r) => +r.dataset.price, added: (r) => -Date.parse(r.dataset.added) }[F.sort];
      [...rows].sort((a, b) => key(a) - key(b) || a.dataset.order - b.dataset.order).forEach((r) => list.insertBefore(r, $('[data-f-empty]', list)));
      $('[data-f-count]').textContent = `Showing ${n} of ${rows.length}`;
      $('[data-f-empty]').hidden = n > 0;
      $$('[data-fax]').forEach((b) => b.setAttribute('aria-pressed', String(F.axes.has(b.dataset.fax))));
      $$('[data-fgenre]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.fgenre === F.genre)));
      $('[data-f="sort"]').value = F.sort;
      $('[data-f-out]').textContent = F.size + 'px';
      const p = new URLSearchParams();
      if (F.axes.size) p.set('axis', [...F.axes].join(','));
      if (F.genre !== 'all') p.set('genre', F.genre);
      if (F.sort !== 'order') p.set('sort', F.sort);
      try { history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : '')); } catch { /* file:// */ }
      requestAnimationFrame(() => rows.forEach((r) => { if (!r.hidden) guides($('.stage', r)); }));
    }
    FC.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.fax) { F.axes.has(b.dataset.fax) ? F.axes.delete(b.dataset.fax) : F.axes.add(b.dataset.fax); }
      else if (b.dataset.fgenre) F.genre = b.dataset.fgenre;
      apply();
    });
    FC.addEventListener('input', (e) => {
      const k = e.target.dataset.f;
      if (k === 'text') F.text = e.target.value.slice(0, 80);
      if (k === 'size') F.size = +e.target.value;
      if (k === 'sort') F.sort = e.target.value;
      apply();
    });
    $('[data-f-clear]').addEventListener('click', () => { F.axes.clear(); F.genre = 'all'; apply(); $('[data-fgenre="all"]').focus(); });
    apply();
  }

  // ---------- 글리프 ----------
  const G = $('[data-glyphs]');
  if (G) {
    const f = fam[G.dataset.family];
    const cells = $$('.g', G);
    const dlg = $('[data-gz]', G); const ch = $('[data-gz-ch]', G); const gstage = $('.gz-stage', G);
    let vis = cells; let cur = 0; let opener = null;
    // 이 패밀리에 없는 글자는 숨긴다: 대체 글꼴 둘로 폭을 재서 다르면 없는 것
    async function prune() {
      const all = cells.map((c) => c.dataset.ch).join('');
      try { await document.fonts.load(`40px '${f.name}'`, all); } catch { return; }
      const cv = document.createElement('canvas').getContext('2d');
      const w = (c, fb) => { cv.font = `40px '${f.name}', ${fb}`; return cv.measureText(c).width; };
      let miss = 0;
      cells.forEach((c) => { const x = c.dataset.ch; const gone = Math.abs(w(x, 'monospace') - w(x, 'serif')) > 0.01; c.hidden = gone; if (gone) miss++; });
      vis = cells.filter((c) => !c.hidden);
      $('[data-glyph-count]', G).textContent = `${vis.length} of ${cells.length} characters from the Latin set are in this family${miss ? `; ${miss} missing are left out` : ''}. Press one to enlarge.`;
    }
    function show(i) {
      cur = (i + vis.length) % vis.length;
      const c = vis[cur]; const x = c.dataset.ch;
      const cp = 'U+' + x.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
      ch.textContent = x;
      ch.style.fontVariationSettings = tester ? fvs(tester.vars()) : '';
      $('[data-gz-title]', G).textContent = `${x}  ${cp}`;
      const inSet = vis.filter((v) => v.dataset.group === c.dataset.group);
      $('[data-gz-meta]', G).textContent = `${c.dataset.group} · ${inSet.indexOf(c) + 1} of ${inSet.length}`;
      requestAnimationFrame(() => guides(gstage));
    }
    G.addEventListener('click', (e) => {
      const c = e.target.closest('.g'); if (!c) return;
      opener = c; show(vis.indexOf(c));
      dlg.showModal(); document.documentElement.classList.add('lock');
      requestAnimationFrame(() => guides(gstage));
    });
    $('[data-gz-prev]', G).addEventListener('click', () => show(cur - 1));
    $('[data-gz-next]', G).addEventListener('click', () => show(cur + 1));
    $('[data-gz-close]', G).addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
    });
    dlg.addEventListener('close', () => { document.documentElement.classList.remove('lock'); if (opener) opener.focus(); });
    prune();
  }

  // ---------- 메트릭 표 ----------
  function metrics() {
    const dl = $('[data-metrics]'); if (!dl) return;
    const em = $('.stage-met').__em; if (!em) return;
    const put = (k, v) => { $(`[data-m="${k}"]`, dl).textContent = v; };
    put('asc', em.asc.toFixed(3)); put('cap', em.cap.toFixed(3)); put('x', em.x.toFixed(3));
    put('desc', (-Math.abs(em.desc)).toFixed(3).replace('-', '−')); put('ratio', (em.x / em.cap).toFixed(3));
  }

  // ---------- 장바구니 ----------
  const KEY = 'qs-cart-v1';
  const readCart = () => { try { const v = JSON.parse(store.get(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
  const writeCart = (c) => { store.set(KEY, JSON.stringify(c)); renderCart(); };
  const baseOf = (slug) => (slug === QS.bundle.slug ? QS.families.reduce((s, f) => s + f.base, 0) * (1 - QS.bundle.discount) : fam[slug].base);
  const nameOf = (slug) => (slug === QS.bundle.slug ? QS.bundle.name : fam[slug].name);
  const linesOf = (item) => Object.keys(QS.licenses).filter((k) => item[k] !== null && item[k] !== undefined && item[k] !== '')
    .map((k) => { const [n, m] = QS.licenses[k].tiers[item[k]]; return { k, label: `${QS.licenses[k].name}, ${n}`, price: baseOf(item.slug) * m }; });
  const priceOf = (item) => linesOf(item).reduce((s, l) => s + l.price, 0);
  const drawer = $('#cart-drawer');
  let drawerOpener = null;
  function renderCart() {
    const c = readCart();
    const total = c.reduce((s, i) => s + priceOf(i), 0);
    $$('[data-cart-count]').forEach((n) => { n.textContent = c.length; });
    const dl = $('[data-drawer-list]');
    dl.innerHTML = c.map((i, n) => `<li><span class="name">${nameOf(i.slug)}</span><span class="price">${eur(priceOf(i))}</span><span class="what">${linesOf(i).map((l) => l.label).join(' · ')}</span><button type="button" class="btn-plain" data-remove="${n}" aria-label="Remove ${nameOf(i.slug)}">Remove</button></li>`).join('');
    $('[data-drawer-empty]').hidden = c.length > 0;
    $('[data-drawer-total]').textContent = eur(total);
    const page = $('[data-cartpage]');
    if (page) {
      $('[data-cart-list]', page).innerHTML = c.map((i, n) => {
        const f = fam[i.slug];
        const style = f ? ` style="font-family:'${f.name}',serif"` : '';
        return `<li class="cart-item"><h3${style}>${nameOf(i.slug)}</h3><ul>${linesOf(i).map((l) => `<li>${l.label}: ${eur(l.price)}</li>`).join('')}</ul><p class="price">${eur(priceOf(i))}</p><button type="button" class="btn-plain" data-remove="${n}" aria-label="Remove ${nameOf(i.slug)}">Remove</button></li>`;
      }).join('');
      $('[data-cart-empty]', page).hidden = c.length > 0;
      $('[data-cart-total]', page).textContent = eur(total);
    }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]'); if (!b) return;
    const idx = +b.dataset.remove; const list = b.closest('ul');
    const c = readCart(); const [gone] = c.splice(idx, 1); writeCart(c);
    const btns = $$('[data-remove]', list);
    const next = btns[Math.min(idx, btns.length - 1)];
    if (next) next.focus(); else if (drawer.open) $('[data-drawer-close]').focus(); else { const a = $('[data-cart-empty] a'); if (a) a.focus(); }
    const done = $('[data-co-done]'); if (done && gone) done.textContent = `${nameOf(gone.slug)} removed.`;
  });
  function openDrawer() {
    drawerOpener = document.activeElement;
    drawer.showModal(); document.documentElement.classList.add('lock');
    $('[data-drawer-close]').focus();
  }
  $$('[data-cart-open]').forEach((b) => b.addEventListener('click', openDrawer));
  $('[data-drawer-close]').addEventListener('click', () => drawer.close());
  drawer.addEventListener('click', (e) => { if (e.target === drawer) drawer.close(); });
  drawer.addEventListener('close', () => { document.documentElement.classList.remove('lock'); if (drawerOpener && drawerOpener.focus) drawerOpener.focus(); });
  window.addEventListener('storage', (e) => { if (e.key === KEY) renderCart(); });

  // ---------- 계산기 ----------
  const C = $('[data-calc]');
  if (C) {
    const famSel = $('[data-c="family"]', C);
    const cur = () => ({ slug: famSel ? famSel.value : C.dataset.family, ...Object.fromEntries(Object.keys(QS.licenses).map((k) => { const v = $(`[data-c="${k}"]`, C).value; return [k, v === '' ? null : +v]; })) });
    const q = new URLSearchParams(location.search);
    if (famSel && (fam[q.get('family')] || q.get('family') === QS.bundle.slug)) famSel.value = q.get('family');
    function calc() {
      const it = cur(); const b = baseOf(it.slug);
      for (const k of Object.keys(QS.licenses)) {
        const sel = $(`[data-c="${k}"]`, C);
        QS.licenses[k].tiers.forEach(([n, m], i) => { sel.options[i + 1].textContent = `${n}: ${eur(b * m)}`; });
      }
      const ls = linesOf(it);
      $('[data-calc-lines]', C).textContent = ls.length ? ls.map((l) => `${l.label}: ${eur(l.price)}`).join(' + ') : 'No license type chosen.';
      $('[data-calc-total]', C).textContent = eur(priceOf(it));
    }
    C.addEventListener('input', () => { $('[data-calc-status]', C).textContent = ''; calc(); });
    C.addEventListener('submit', (e) => {
      e.preventDefault();
      const it = cur();
      if (!linesOf(it).length) { $('[data-calc-status]', C).textContent = 'Choose at least one license type: desktop, web or app.'; $('[data-c="desktop"]', C).focus(); return; }
      const c = readCart().filter((x) => x.slug !== it.slug);
      c.push(it); writeCart(c);
      $('[data-calc-status]', C).textContent = `${nameOf(it.slug)} added: ${eur(priceOf(it))}. Cart has ${c.length} ${c.length === 1 ? 'family' : 'families'}.`;
      openDrawer();
    });
    calc();
  }

  // ---------- 주문 폼 ----------
  const CO = $('[data-co]');
  if (CO) {
    const box = $('[data-co-errors]'); const done = $('[data-co-done]');
    const rules = [
      ['name', (v) => v.trim().length >= 2, 'Enter your name.'],
      ['mail', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), 'Enter an email address like name@studio.com.'],
      ['org', (v) => v.trim().length >= 2, 'Enter the licensee: a company or a person.'],
      ['country', (v) => v !== '', 'Choose a country.'],
      ['eula', (v, el) => el.checked, 'Confirm you have read the license terms.'],
    ];
    CO.addEventListener('submit', (e) => {
      e.preventDefault();
      done.textContent = '';
      const errs = [];
      $$('.err', CO).forEach((n) => n.remove());
      for (const [name, ok, msg] of rules) {
        const el = CO.elements[name];
        const good = ok(el.value, el);
        el.setAttribute('aria-invalid', String(!good));
        const id = 'err-' + name;
        if (!good) {
          errs.push([el.id || name, msg]);
          const p = document.createElement('p'); p.className = 'err'; p.id = id; p.textContent = msg;
          el.closest('.field').append(p); el.setAttribute('aria-describedby', id);
        } else el.removeAttribute('aria-describedby');
      }
      if (!readCart().length) errs.unshift(['', 'The cart is empty. Add a license first.']);
      if (errs.length) {
        box.hidden = false;
        box.innerHTML = `<p><strong>${errs.length} ${errs.length === 1 ? 'problem' : 'problems'} to fix</strong></p><ul>${errs.map(([id, m]) => `<li>${id ? `<a href="#${id}">${m}</a>` : m}</li>`).join('')}</ul>`;
        box.focus();
        return;
      }
      box.hidden = true;
      done.textContent = 'Order not placed. Payment is not connected on this practice site; nothing was charged and nothing was stored.';
    });
    box.addEventListener('click', (e) => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); const el = document.getElementById(a.getAttribute('href').slice(1)); if (el) el.focus(); });
  }

  // ---------- 시작 ----------
  renderCart();
  relayout(); metrics();
  document.fonts.ready.then(() => { relayout(); metrics(); });
  document.fonts.addEventListener('loadingdone', () => { relayout(); metrics(); });
  const onResize = debounce(() => { relayout(); metrics(); }, 120);
  window.addEventListener('resize', onResize);
})();
