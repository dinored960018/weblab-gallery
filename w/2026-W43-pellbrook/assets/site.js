// Pellbrook Meat Supply — behaviour. Uses window.PB (calc.js) and window.PB_DATA (data.js).
// The ledger and the log live in sessionStorage: this tab only, nothing is sent.
(function () {
  'use strict';
  const C = window.PB, D = window.PB_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const rel = document.body.dataset.rel || '';
  const esc = C.esc;
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = new URLSearchParams(location.search);
  const setQuery = (obj) => {
    const u = new URL(location.href);
    Object.entries(obj).forEach(([k, v]) => (v === '' || v == null ? u.searchParams.delete(k) : u.searchParams.set(k, v)));
    try { history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? '?' + u.searchParams : '') + u.hash); } catch (e) { /* file:// in some browsers */ }
  };
  const link = (key, query = '') => `${rel}${key ? key + '/' : ''}index.html${query}`;
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  $$('.cmd-key').forEach((k) => { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });

  // ---------- store ----------
  const KEY = 'pb-ledger-v1';
  const load = () => { try { const s = JSON.parse(sessionStorage.getItem(KEY)); if (s && Array.isArray(s.lines)) return s; } catch (e) { /* none */ } return { lines: [], log: [], seq: 0, next: 1 }; };
  let store = load();
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* private mode: keep in memory */ } };
  // simulated clock: 10:00:00 plus 6 s per agent step
  const stamp = () => { store.seq += 1; const s = 36000 + store.seq * 6; return `${C.pad2(Math.floor(s / 3600))}:${C.pad2(Math.floor(s / 60) % 60)}:${C.pad2(s % 60)}`; };
  const log = (k, v) => { store.log.unshift({ t: stamp(), k, v }); store.log = store.log.slice(0, 40); save(); renderLog(); };
  const addLine = (code, cases, src) => {
    const c = C.cutBy(code, D.CUTS);
    const existing = store.lines.find((l) => l.code === code);
    let n;
    if (existing) { existing.cases = Math.min(99, existing.cases + cases); n = store.lines.indexOf(existing) + 1; existing.fresh = true; }
    else { store.lines.push({ id: store.next++, code, cases, at: stamp(), src, fresh: true }); n = store.lines.length; }
    save();
    log(existing ? 'Line updated' : 'Line written', `${c.code} ${c.name.split(',')[0]} · ${existing ? existing.cases : cases} cs · ${src}`);
    renderLedger();
    return { n, existing: !!existing };
  };

  // ---------- header state ----------
  const state = $('.agent-state');
  const setBusy = (busy) => {
    if (!state) return;
    state.classList.toggle('is-busy', busy);
    $('.as-text', state).textContent = busy ? 'Agent writing' : 'Agent idle';
  };
  const renderState = () => { if (state) $('.as-lines', state).textContent = `${store.lines.length} ${store.lines.length === 1 ? 'line' : 'lines'}`; };
  renderState();

  // ---------- ledger (home) ----------
  const body = $('#ledger-body');
  function renderLedger() {
    renderState();
    if (!body) { store.lines.forEach((l) => delete l.fresh); save(); return; }
    if (!store.lines.length) {
      body.innerHTML = `<tr class="empty"><td colspan="9">No lines. Tick above, or press ${isMac ? '⌘K' : 'Ctrl K'} and type “add 15 kg short rib”.</td></tr>`;
    } else {
      body.innerHTML = store.lines.map((l, i) => {
        const c = C.cutBy(l.code, D.CUTS);
        return `<tr data-id="${l.id}"${l.fresh ? ' class="is-new"' : ''}><td class="n c-no">${i + 1}</td><td class="c-time">${l.at}</td><td class="code c-code">${c.code}</td><td class="c-cut"><span class="m-code">${c.code} </span>${c.slug ? `<a href="${rel}cuts/${c.slug}/index.html">${esc(c.name)}</a>` : esc(c.name)}</td><td data-l="Cases" class="n c-qty"><label class="vh" for="q-${l.id}">Cases of ${esc(c.name)}</label><input class="qty" id="q-${l.id}" type="text" inputmode="numeric" value="${l.cases}" data-qty="${l.id}"></td><td data-l="kg" class="n c-kg">${C.kg1(l.cases * c.caseKg)}</td><td class="n c-price">${C.gbp(c.price)}</td><td data-l="Amount" class="n amt c-amt">${C.gbp(l.cases * C.casePrice(c))}</td><td class="act c-act"><button class="btn btn-small" type="button" data-remove="${l.id}">Remove<span class="vh"> ${esc(c.name)}</span></button></td></tr>`;
      }).join('');
    }
    const t = C.totals(store.lines, D.CUTS);
    const tc = $('#t-cases'), tk = $('#t-kg'), ta = $('#t-amt');
    const changed = ta.textContent !== C.gbp(t.amount);
    tc.textContent = t.cases; tk.textContent = C.kg1(t.kg); ta.textContent = C.gbp(t.amount);
    if (changed && !reduce()) [tc, tk, ta].forEach((el) => { el.classList.remove('tot-flash'); void el.offsetWidth; el.classList.add('tot-flash'); });
    const mn = $('#min-note');
    if (mn) {
      const under = t.amount > 0 && t.amount < D.DELIVERY.minOrder;
      mn.classList.toggle('is-under', under);
      mn.textContent = under ? `Under the ${C.gbp(D.DELIVERY.minOrder)} minimum by ${C.gbp(D.DELIVERY.minOrder - t.amount)}.` : `Minimum order ${C.gbp(D.DELIVERY.minOrder)} per drop.`;
    }
    store.lines.forEach((l) => delete l.fresh); save();
  }
  if (body) {
    renderLedger();
    body.addEventListener('change', (e) => {
      const id = Number(e.target.dataset.qty); if (!id) return;
      const l = store.lines.find((x) => x.id === id);
      const v = Number(e.target.value.trim());
      if (!Number.isInteger(v) || v < 0 || v > 99) { e.target.value = l.cases; e.target.setAttribute('aria-invalid', 'true'); $('#min-note').textContent = 'Error: cases must be a whole number from 0 to 99.'; return; }
      e.target.removeAttribute('aria-invalid');
      const c = C.cutBy(l.code, D.CUTS);
      if (v === 0) { store.lines = store.lines.filter((x) => x !== l); log('Line removed', `${c.code} · set to 0`); }
      else { l.cases = v; log('Line changed', `${c.code} · ${v} cs`); }
      save(); renderLedger();
      const again = $(`[data-qty="${id}"]`); if (again) again.focus();
    });
    body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-remove]'); if (!b) return;
      const id = Number(b.dataset.remove);
      const i = store.lines.findIndex((x) => x.id === id);
      const l = store.lines[i];
      store.lines.splice(i, 1);
      log('Line removed', `${l.code}`);
      save(); renderLedger();
      const nextBtn = $$('[data-remove]')[Math.min(i, store.lines.length - 1)];
      (nextBtn || $('#ledger-clear')).focus();
    });
    $('#ledger-clear').addEventListener('click', () => { if (!store.lines.length) return; store.lines = []; log('Ledger cleared', 'all lines'); save(); renderLedger(); });
  }

  // ---------- processing log ----------
  function renderLog() {
    const ol = $('#log'); if (!ol) return;
    ol.innerHTML = store.log.length ? store.log.map((e) => `<li><span class="lg-t">${e.t}</span><span class="lg-k">${esc(e.k)}</span><span class="lg-v">${esc(e.v)}</span></li>`).join('') : '<li class="empty">No entries.</li>';
  }
  renderLog();

  // ---------- ticks (home): any one applies → agent writes lines one by one ----------
  const ticks = $('#ticks');
  if (ticks) {
    const err = $('#ticks-e');
    let writing = false;
    ticks.addEventListener('change', () => { err.hidden = true; });
    ticks.addEventListener('submit', (e) => {
      e.preventDefault();
      if (writing) return;
      const on = $$('input[name="tick"]:checked', ticks).map((i) => i.value);
      if (!on.length) { err.textContent = 'Error: tick at least one line above.'; err.hidden = false; $('input[name="tick"]', ticks).focus(); return; }
      const lines = D.TICKS.filter((t) => on.includes(t.id)).flatMap((t) => t.lines);
      writing = true; setBusy(true);
      log('Draft started', `${on.length} ${on.length === 1 ? 'tick' : 'ticks'} · ${lines.length} lines`);
      const step = reduce() ? 0 : 320;
      let i = 0;
      const next = () => {
        if (i >= lines.length) {
          writing = false; setBusy(false);
          const t = C.totals(store.lines, D.CUTS);
          log('Draft done', `${store.lines.length} lines · ${C.kg1(t.kg)} kg · ${C.gbp(t.amount)}`);
          return;
        }
        const [code, n] = lines[i++];
        addLine(code, n, 'tick');
        setTimeout(next, step);
      };
      next();
    });
  }

  // ---------- add buttons (cuts list, spec sheets, standing orders) ----------
  const addStatus = $('#add-status');
  const said = (html) => { if (addStatus) addStatus.innerHTML = html; };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    const c = C.cutBy(b.dataset.add, D.CUTS);
    const r = addLine(c.code, 1, 'button');
    said(`${r.existing ? 'Line ' + r.n + ' updated' : 'Line ' + r.n + ' written'}: ${esc(c.code)} ${esc(c.name)}, 1 case. <a href="${link('')}#ledger-h">Open ledger</a>`);
  });

  // ---------- command palette ----------
  const pw = $('#palette'), pal = $('.pal', pw), input = $('#pal-q'), list = $('#pal-list'), out = $('#pal-out');
  let opener = null, opts = [], active = 0;
  const BASE = [
    ...D.AGENT.rules.map(([cmd, res]) => ({ kind: 'Command', label: cmd, sub: res, run: cmd })),
    ...D.PAGES.map((p) => ({ kind: 'Go to', label: p.label, sub: p.note, go: p.key })),
  ];
  const optionsFor = (text) => {
    const t = text.trim().toLowerCase();
    if (!t) return BASE;
    const res = [{ kind: 'Run', label: text.trim(), sub: C.parse(text, D).text, run: text.trim() }];
    BASE.forEach((o) => { if (o.label.toLowerCase().includes(t) && o.label.toLowerCase() !== t) res.push(o); });
    C.matchCuts(t, D.CUTS).slice(0, 4).forEach((c) => res.push({ kind: 'Price', label: `price ${c.code}`, sub: `${c.name} · ${C.gbp(c.price)}/kg`, run: `price ${c.code}` }));
    return res;
  };
  const paint = () => {
    list.innerHTML = opts.map((o, i) => `<li role="option" id="pal-o-${i}" aria-selected="${i === active}" data-i="${i}"><span class="pl-k">${esc(o.kind)}</span><span class="pl-l">${esc(o.label)}${o.sub ? `<span class="vh"> · </span><span class="pl-s hint"> · ${esc(o.sub)}</span>` : ''}</span></li>`).join('');
    input.setAttribute('aria-activedescendant', opts.length ? `pal-o-${active}` : '');
    const a = $(`#pal-o-${active}`); if (a) a.scrollIntoView({ block: 'nearest' });
  };
  const refresh = () => { opts = optionsFor(input.value); active = 0; paint(); };
  const openPal = (prefill = '') => {
    if (!pw.hidden) { input.value = prefill || input.value; refresh(); input.focus(); return; }
    opener = document.activeElement;
    pw.hidden = false; document.body.classList.add('is-locked');
    $$('.cmd').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    if (!reduce()) { pal.classList.remove('is-opening'); void pal.offsetWidth; pal.classList.add('is-opening'); }
    input.value = prefill; out.innerHTML = ''; refresh(); input.focus();
  };
  const closePal = () => {
    if (pw.hidden) return;
    pw.hidden = true; document.body.classList.remove('is-locked');
    $$('.cmd').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    (opener && document.contains(opener) ? opener : $('.cmd')).focus();
  };
  const run = (o) => {
    if (o.go !== undefined) { location.href = link(o.go); return; }
    const r = C.parse(o.run, D);
    let html = esc(r.text);
    if (r.kind === 'add') {
      setBusy(true);
      const w = addLine(r.code, r.cases, 'command');
      setTimeout(() => setBusy(false), reduce() ? 0 : 400);
      html = `Line ${w.n} ${w.existing ? 'updated' : 'written'}: ${esc(r.text)}${r.note.length ? '. ' + esc(r.note.join('. ')) : ''}.${page === 'home' ? '' : ` <a href="${link('')}#ledger-h">Open ledger</a>`}`;
    } else if (r.kind === 'delivery') { html += ` <a href="${link('delivery', '?d=' + r.district)}">Delivery</a>`; log('Delivery', r.text); }
    else if (r.kind === 'lot') { html += ` <a href="${link('traceability', '?lot=' + r.lot)}">Lot record</a>`; log('Lookup', r.text); }
    else if (r.kind === 'price') { html += ` <a href="${link('cuts', '?q=' + r.code)}">Cut list</a>`; log('Price', r.text); }
    else if (r.kind === 'spec') { const c = C.cutBy(r.code, D.CUTS); html += ` <a href="${rel}cuts/${c.slug}/index.html">Open spec sheet</a>`; log('Spec', r.text); }
    else if (r.kind === 'clear') { store.lines = []; save(); renderLedger(); log('Ledger cleared', 'by command'); }
    else if (r.kind === 'go') { location.href = link(r.key); return; }
    else if (r.kind === 'none') { log('Unmatched', `“${o.run}”`); }
    out.innerHTML = html;
    input.select();
  };
  if (pw) {
    $$('.cmd').forEach((b) => { b.setAttribute('aria-expanded', 'false'); b.addEventListener('click', () => openPal()); });
    $('.pal-close', pw).addEventListener('click', closePal);
    pw.addEventListener('mousedown', (e) => { if (e.target === pw) closePal(); });
    input.addEventListener('input', refresh);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % opts.length; paint(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + opts.length) % opts.length; paint(); }
      else if (e.key === 'Home' && !input.value) { e.preventDefault(); active = 0; paint(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (opts[active]) run(opts[active]); }
    });
    list.addEventListener('click', (e) => { const li = e.target.closest('[data-i]'); if (!li) return; active = Number(li.dataset.i); paint(); run(opts[active]); input.focus(); });
    pw.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closePal(); return; }
      if (e.key === 'Tab') {
        const f = $$('button, input, a[href]', pal).filter((x) => x.offsetParent !== null);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); if (pw.hidden) openPal(); else closePal(); return; }
      if (e.key === '/' && pw.hidden && $('#menu').hidden) {
        const t = e.target;
        if (t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;
        e.preventDefault(); openPal();
      }
    });
    $$('[data-try]').forEach((b) => b.addEventListener('click', () => openPal(b.dataset.try)));
  }

  // ---------- menu (narrow screens) ----------
  const mw = $('#menu'), menuBtn = $('.menu-btn');
  if (mw && menuBtn) {
    const panel = $('.menu', mw);
    const openM = () => { mw.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); document.body.classList.add('is-locked'); $('.menu-close', mw).focus(); };
    const closeM = () => { if (mw.hidden) return; mw.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('is-locked'); menuBtn.focus(); };
    menuBtn.addEventListener('click', () => (mw.hidden ? openM() : closeM()));
    $('.menu-close', mw).addEventListener('click', closeM);
    mw.addEventListener('mousedown', (e) => { if (e.target === mw) closeM(); });
    mw.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closeM(); }
      if (e.key === 'Tab') {
        const f = $$('a[href], button', panel), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => { if (e.matches) closeM(); });
  }

  // ---------- field helpers ----------
  const showErr = (el, msg) => {
    const e = document.getElementById(el.id + '-e');
    if (msg) { e.textContent = 'Error: ' + msg; e.hidden = false; el.setAttribute('aria-invalid', 'true'); }
    else { e.textContent = ''; e.hidden = true; el.removeAttribute('aria-invalid'); }
    return !msg;
  };
  const intIn = (el, lo, hi, what) => {
    const raw = el.value.trim().replace(/,/g, '');
    const v = Number(raw);
    if (raw === '' || !Number.isInteger(v) || v < lo || v > hi) return [null, `Enter ${what} from ${lo.toLocaleString('en-GB')} to ${hi.toLocaleString('en-GB')}.`];
    return [v, ''];
  };
  const firstInvalid = (form) => { const bad = $('[aria-invalid="true"]', form); if (bad) bad.focus(); };
  const DIST = /^PK[1-9]$/;
  const normDistrict = (s) => s.trim().toUpperCase().replace(/\s+/g, '');

  // ---------- cuts: filter, sort, search ----------
  if (page === 'cuts') {
    const tb = $('#cut-body'), rows = $$('tr', tb), segs = $$('.seg-b'), prim = $('#f-primal'), qi = $('#f-q'), sort = $('#f-sort');
    const count = $('#cut-count'), none = $('#cut-none'), table = $('#cut-table');
    let species = q.get('species') || '';
    if (!D.SPECIES[species]) species = '';
    prim.value = [...prim.options].some((o) => o.value === q.get('primal')) ? q.get('primal') : '';
    qi.value = q.get('q') || '';
    sort.value = [...sort.options].some((o) => o.value === q.get('sort')) ? q.get('sort') : 'code';
    const apply = () => {
      segs.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.species === species)));
      const text = qi.value.trim();
      const hits = text ? new Set(C.matchCuts(text, D.CUTS).map((c) => c.code)) : null;
      const cuts = D.CUTS.filter((c) => (!species || c.species === species) && (!prim.value || c.primal === prim.value) && (!hits || hits.has(c.code)));
      const s = sort.value;
      cuts.sort((a, b) => s === 'yield' ? b.yield - a.yield : s === 'price-asc' ? a.price - b.price : s === 'price-desc' ? b.price - a.price : s === 'stock' ? a.stock - b.stock : a.code.localeCompare(b.code));
      rows.forEach((r) => { r.hidden = true; });
      cuts.forEach((c) => { const r = rows.find((x) => x.dataset.code === c.code); r.hidden = false; tb.appendChild(r); });
      count.textContent = `${cuts.length} ${cuts.length === 1 ? 'spec' : 'specs'}`;
      none.hidden = cuts.length > 0; table.hidden = cuts.length === 0;
      setQuery({ species, primal: prim.value, q: text, sort: s === 'code' ? '' : s });
    };
    segs.forEach((b) => b.addEventListener('click', () => { species = b.dataset.species; apply(); }));
    [prim, sort].forEach((el) => el.addEventListener('change', apply));
    qi.addEventListener('input', apply);
    $('#filters').addEventListener('submit', (e) => e.preventDefault());
    $('#cut-clear').addEventListener('click', () => { species = ''; prim.value = ''; qi.value = ''; sort.value = 'code'; apply(); qi.focus(); });
    apply();
  }

  // ---------- standing orders ----------
  if (page === 'standing-orders') {
    const f = $('#so-form'), cut = $('#so-cut'), cov = $('#so-covers'), por = $('#so-portion'), outB = $('#so-out'), daysErr = $('#so-days-e');
    let last = null;
    if (D.CUTS.some((c) => c.code === q.get('cut'))) cut.value = q.get('cut');
    if (q.get('covers')) cov.value = q.get('covers');
    if (q.get('portion')) por.value = q.get('portion'); else por.value = C.cutBy(cut.value, D.CUTS).portion;
    if (q.get('days') !== null) $$('input[name="d"]', f).forEach((i) => { i.checked = q.get('days').split('').includes(i.value); });
    cut.addEventListener('change', () => { por.value = C.cutBy(cut.value, D.CUTS).portion; showErr(por, ''); });
    const work = (focusErr) => {
      const [covers, e1] = intIn(cov, 1, 2000, 'covers');
      const [portion, e2] = intIn(por, 50, 1000, 'a portion in grams');
      const days = $$('input[name="d"]:checked', f).map((i) => i.value);
      showErr(cov, e1); showErr(por, e2);
      daysErr.hidden = days.length > 0; daysErr.textContent = days.length ? '' : 'Error: tick at least one service day.';
      if (e1 || e2 || !days.length) {
        last = null;
        outB.innerHTML = '<p class="err">Fix the fields marked Error.</p>';
        if (focusErr) { if (e1 || e2) firstInvalid(f); else $('input[name="d"]', f).focus(); }
        return;
      }
      const c = C.cutBy(cut.value, D.CUTS);
      const w = C.weekly(c, covers, portion, days.length);
      last = { c, w };
      outB.innerHTML = `<div class="res"><p class="big">${C.kg1(w.kg)} kg a week · ${w.cases} ${w.cases === 1 ? 'case' : 'cases'} of ${C.kg1(c.caseKg)} kg · ${C.gbp(w.cost)}</p>
<dl class="kv"><div><dt>Worked</dt><dd>${covers.toLocaleString('en-GB')} covers × ${portion} g × ${days.length} ${days.length === 1 ? 'service' : 'services'} = ${C.kg1(w.kg)} kg</dd></div><div><dt>Delivered</dt><dd>${w.cases} × ${C.kg1(c.caseKg)} kg = ${C.kg1(w.caseKgTotal)} kg (${C.kg1(w.caseKgTotal - w.kg)} kg over)</dd></div><div><dt>Raw primal</dt><dd>${C.kg1(w.raw)} kg of ${c.primal.toLowerCase()} at ${c.yield} % yield</dd></div><div><dt>Cost a week</dt><dd>${C.gbp(w.cost)} at ${C.gbp(c.price)}/kg</dd></div><div><dt>Stock today</dt><dd>${c.stock} cases${w.cases > c.stock ? ' · short by ' + (w.cases - c.stock) : ''}</dd></div></dl></div>`;
      setQuery({ cut: c.code, covers, portion, days: days.join('') });
    };
    f.addEventListener('submit', (e) => { e.preventDefault(); work(true); });
    $('#so-add').addEventListener('click', () => {
      work(true);
      if (!last) { said('Fix the fields marked Error first.'); return; }
      const r = addLine(last.c.code, last.w.cases, 'standing order');
      said(`Line ${r.n} ${r.existing ? 'updated' : 'written'}: ${esc(last.c.code)} ${esc(last.c.name)}, ${last.w.cases} cases. <a href="${link('')}#ledger-h">Open ledger</a>`);
    });
    work(false);
  }

  // ---------- delivery ----------
  if (page === 'delivery') {
    const f = $('#dl-form'), di = $('#dl-district'), outB = $('#dl-out');
    const show = (focus) => {
      const d = normDistrict(di.value);
      if (!d) { showErr(di, 'Enter a district code, for example PK4.'); if (focus) di.focus(); return; }
      if (!/^PK\d{1,2}$/.test(d)) { showErr(di, 'Use the form PK and a number, for example PK4.'); if (focus) di.focus(); return; }
      if (!DIST.test(d)) { showErr(di, `${d} is outside the delivery area. Districts PK1 to PK9.`); if (focus) di.focus(); return; }
      showErr(di, '');
      di.value = d;
      const r = C.nextDelivery(d, D.ZONES, D.NOW);
      const after = C.nextDelivery(d, D.ZONES, { ...D.NOW, iso: r.iso, min: 0 });
      outB.innerHTML = `<div class="res"><p class="big">${d}: ${esc(C.deliveryLine(r, D.NOW))}</p>
<dl class="kv"><div><dt>Zone</dt><dd>${r.zone.zone} · ${esc(r.zone.note)} · ${r.zone.districts.join(', ')}</dd></div><div><dt>Delivery days</dt><dd>${r.zone.days.map((x) => C.dayName(x, true)).join(', ')}</dd></div><div><dt>Time left to order</dt><dd>${C.leftLabel(r.minutesLeft)}</dd></div><div><dt>Drop window</dt><dd>${D.DELIVERY.windows} · ${esc(r.zone.van)}</dd></div><div><dt>Drop after that</dt><dd>${esc(C.dateShort(after.iso))}</dd></div></dl></div>`;
      setQuery({ d });
    };
    f.addEventListener('submit', (e) => { e.preventDefault(); show(true); });
    if (q.get('d')) { di.value = q.get('d'); show(false); }
  }

  // ---------- traceability ----------
  if (page === 'traceability') {
    const f = $('#lot-form'), li = $('#lot-code'), outB = $('#lot-out');
    const show = (focus) => {
      const v = li.value.trim().toUpperCase();
      if (!C.LOT_RE.test(v)) { showErr(li, 'Enter a lot code like PB-2610-114.'); outB.innerHTML = ''; if (focus) li.focus(); return; }
      showErr(li, '');
      li.value = v;
      const l = C.lotBy(v, D.LOTS);
      setQuery({ lot: v });
      if (!l) { outB.innerHTML = `<div class="res"><p class="big">No lot ${esc(v)} on file.</p><p class="note">Check the label. Lots older than 60 days are archived; ask the depot.</p></div>`; return; }
      const cuts = l.cuts.map((code) => { const c = C.cutBy(code, D.CUTS); return c.slug ? `<a href="${rel}cuts/${c.slug}/index.html">${c.code} ${esc(c.name)}</a>` : `${c.code} ${esc(c.name)}`; }).join(' · ');
      outB.innerHTML = `<div class="res"><p class="big">${esc(l.lot)} · ${esc(l.farm)}</p><dl class="kv"><div><dt>Species · breed</dt><dd>${D.SPECIES[l.species]} · ${esc(l.breed)}</dd></div><div><dt>Killed</dt><dd>${C.dateShort(l.killed)}</dd></div><div><dt>Hung</dt><dd>${l.hung ? l.hung + ' days at 1–2 °C' : 'Not hung (pork, cut next day)'}</dd></div><div><dt>Cuts packed</dt><dd>${cuts}</dd></div><div><dt>Cases in store</dt><dd>${l.cases ? l.cases : 'None, sold out'}</dd></div></dl></div>`;
    };
    f.addEventListener('submit', (e) => { e.preventDefault(); show(true); });
    if (q.get('lot')) { li.value = q.get('lot'); show(false); }
  }

  // ---------- accounts ----------
  if (page === 'accounts') {
    const f = $('#acct-form'), outB = $('#acct-out'), anyErr = $('#ac-any-e');
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const any = $$('input[name="type"]:checked', f).length > 0;
      anyErr.hidden = any; anyErr.textContent = any ? '' : 'Error: tick at least one that applies.';
      const b = $('#ac-business'), c = $('#ac-contact'), em = $('#ac-email'), di = $('#ac-district');
      showErr(b, b.value.trim().length >= 2 ? '' : 'Enter the business name.');
      showErr(c, c.value.trim().length >= 2 ? '' : 'Enter a contact name.');
      showErr(em, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim()) ? '' : 'Enter an email address like name@kitchen.example.');
      const d = normDistrict(di.value);
      showErr(di, DIST.test(d) ? '' : 'Enter a district from PK1 to PK9.');
      const bad = $('[aria-invalid="true"]', f);
      if (!any || bad) {
        outB.innerHTML = '<p class="err">Fix the fields marked Error.</p>';
        if (!any) $('input[name="type"]', f).focus(); else bad.focus();
        return;
      }
      di.value = d;
      const z = C.zoneOf(d, D.ZONES);
      outB.innerHTML = `<div class="res"><p class="big">Held in this tab, not sent.</p><p class="note">${esc(b.value.trim())} · ${d}, zone ${z.zone} · delivery ${z.days.map((x) => C.dayName(x)).join(' ')}. On a real account the depot replies within 1 working day.</p></div>`;
      log('Account form', `${b.value.trim()} · ${d} · held, not sent`);
    });
  }
})();
