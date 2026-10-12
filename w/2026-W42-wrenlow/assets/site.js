// Wrenlow Quarry — menu, ticks, the walk, topo, route finder, grades, sun, conditions, rope, access, ticklist.
(() => {
  const D = window.WL, C = window.WLC;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 901px)');
  const params = new URLSearchParams(location.search);
  const rel = (() => { const a = $('.mark'); return a ? a.getAttribute('href').replace('index.html', '') : ''; })();
  const ROUTE = Object.fromEntries(D.ROUTES.map((r) => [r.id, r]));
  const WALL = Object.fromEntries(D.WALLS.map((w) => [w.slug, w]));
  const NOWMS = Date.parse(D.NOW.iso);
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const setParams = (obj) => {
    const u = new URL(location.href);
    for (const [k, v] of Object.entries(obj)) { if (v === '' || v == null || v === false) u.searchParams.delete(k); else u.searchParams.set(k, v); }
    history.replaceState(null, '', u);
  };
  // UK local date + time → epoch ms
  const ukMs = (date, time) => {
    const [y, m, d] = date.split('-').map(Number); const [hh, mm] = time.split(':').map(Number);
    return Date.UTC(y, m - 1, d, hh, mm) - C.ukOffset(date) * 3600000;
  };
  const ukParts = (ms) => {
    const probe = new Date(ms); const iso = probe.toISOString().slice(0, 10);
    const off = C.ukOffset(iso); const t = new Date(ms + off * 3600000);
    return { iso: t.toISOString().slice(0, 10), min: t.getUTCHours() * 60 + t.getUTCMinutes(), label: `${DAYS[t.getUTCDay()]} ${t.getUTCDate()} ${MON[t.getUTCMonth()]}` };
  };
  const nowParts = ukParts(NOWMS);

  // ---------- menu ----------
  const btn = $('.menu-btn'), nav = $('#nav');
  if (btn && nav) {
    const set = (open, focusBtn) => {
      btn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      document.documentElement.classList.toggle('menu-open', open);
      btn.textContent = open ? 'Close' : 'Menu';
      if (open) nav.querySelector('a').focus(); else if (focusBtn) btn.focus();
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') set(false, true); });
    wide.addEventListener('change', () => { if (wide.matches) set(false); });
  }

  // ---------- ticks (this tab only) ----------
  const KEY = 'wl-ticks';
  const getTicks = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || '[]').filter((id) => ROUTE[id]); } catch { return []; } };
  const setTicks = (a) => { try { sessionStorage.setItem(KEY, JSON.stringify(a)); } catch { /* storage blocked: ticks last for this page only */ } memTicks = a; };
  let memTicks = getTicks();
  const ticks = () => { const s = getTicks(); return s.length || !memTicks.length ? s : memTicks; };
  const paintTicks = () => {
    const t = new Set(ticks());
    $$('[data-tick]').forEach((b) => {
      const on = t.has(b.dataset.tick);
      b.setAttribute('aria-pressed', String(on));
      const vis = b.querySelector('[aria-hidden]'); if (vis) vis.textContent = on ? 'Ticked' : 'Tick';
    });
    $$('[data-tickcount]').forEach((n) => { n.textContent = t.size; });
    renderTickPage();
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tick]'); if (!b) return;
    const t = ticks(); const id = b.dataset.tick; const i = t.indexOf(id);
    if (i > -1) t.splice(i, 1); else t.push(id);
    setTicks(t); paintTicks();
  });

  // ---------- home: walk along the quarry floor ----------
  const walk = $('.walk');
  if (walk) {
    const track = $('.walk-track', walk), pin = $('.walk-pin', walk), readout = $('[data-walk-m]', walk), bar = $('.walk-bar', walk);
    const panels = $$('.panel', track);
    const dists = panels.map((p) => Number(p.dataset.dist));
    const maxD = dists.at(-1);
    let on = false, ticking = false;
    const span = () => Math.max(0, track.scrollWidth - innerWidth);
    const progress = () => { const r = walk.getBoundingClientRect(); const run = walk.offsetHeight - innerHeight; return run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0; };
    const update = () => {
      ticking = false;
      if (!on) return;
      const p = progress(); const x = p * span();
      track.style.transform = `translate3d(${-x}px,0,0)`;
      const probe = x + innerWidth * 0.35;
      let d = maxD;
      for (let i = 0; i < panels.length - 1; i++) {
        const a = panels[i].offsetLeft, b = panels[i + 1].offsetLeft;
        if (probe < b) { d = dists[i] + Math.max(0, (probe - a) / (b - a)) * (dists[i + 1] - dists[i]); break; }
      }
      if (p >= 0.999) d = maxD;
      readout.textContent = Math.round(d);
      bar.style.setProperty('--p', (d / maxD).toFixed(4));
    };
    const mode = () => {
      on = wide.matches && !reduce.matches;
      document.documentElement.classList.toggle('walk-on', on);
      if (!on) track.style.transform = '';
      update();
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    wide.addEventListener('change', mode); reduce.addEventListener('change', mode);
    // keyboard: bring the focused panel into view by scrolling the page, not the pinned box
    track.addEventListener('focusin', (e) => {
      if (!on) return;
      pin.scrollLeft = 0;
      const panel = e.target.closest('.panel'); if (!panel) return;
      const p = Math.min(1, panel.offsetLeft / (span() || 1));
      const top = walk.getBoundingClientRect().top + scrollY + p * (walk.offsetHeight - innerHeight);
      scrollTo({ top, behavior: 'instant' });
      update();
    });
    mode();
  }

  // ---------- wall page: topo ----------
  const topo = $('[data-topo]');
  if (topo) {
    const card = $('[data-card]', topo);
    const order = $$('.rsel', topo).map((b) => b.dataset.route);
    let current = null;
    const show = (id, focusType) => {
      const r = ROUTE[id]; if (!r) return;
      current = id;
      $$('[data-route]', topo).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.route === id)));
      $$('tr[data-row]', topo).forEach((tr) => tr.classList.toggle('on', tr.dataset.row === id));
      $$('.tl', topo).forEach((l) => l.classList.remove('sel', 'prep'));
      const line = $(`.tl[data-line="${id}"]`, topo);
      if (line) {
        line.parentNode.appendChild(line);
        line.classList.add('sel');
        if (!reduce.matches) { line.classList.add('prep'); line.getBoundingClientRect(); requestAnimationFrame(() => line.classList.remove('prep')); }
      }
      const need = r.need ? `${r.need} m` : r.style === 'sport' ? 'Longer than 80 m' : 'Walk off or abseil';
      card.innerHTML = `<h2 class="rc-name">${r.n}. ${esc(r.name)} <span class="rc-grade">${esc(r.grade)}</span></h2>
<dl class="rc-facts"><div><dt>Length</dt><dd>${r.len} m</dd></div><div><dt>${r.style === 'sport' ? 'Bolts' : 'Style'}</dt><dd>${r.style === 'sport' ? r.bolts : 'Trad'}</dd></div>${r.style === 'sport' ? `<div><dt>Quickdraws</dt><dd>${r.bolts + 2}</dd></div>` : ''}<div><dt>Rope</dt><dd>${need}</dd></div><div><dt>First climbed</dt><dd>${r.fa}</dd></div></dl>
<p class="rc-note">${esc(r.note)}</p>${r.closure ? `<p class="rc-closed">Closed ${esc(r.closure.from.split('-').reverse().map(Number).join('/'))} to ${esc(r.closure.to.split('-').reverse().map(Number).join('/'))}: ${esc(r.closure.reason)}.</p>` : ''}`;
      if (focusType) { const b = $(`${focusType}[data-route="${id}"]`, topo); if (b) b.focus(); }
      setParams({ route: id });
    };
    topo.addEventListener('click', (e) => { const b = e.target.closest('button[data-route]'); if (b) show(b.dataset.route); });
    topo.addEventListener('keydown', (e) => {
      const b = e.target.closest('button[data-route]'); if (!b) return;
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const i = order.indexOf(current || b.dataset.route);
      const j = current ? (e.key === 'ArrowDown' ? Math.min(order.length - 1, i + 1) : Math.max(0, i - 1)) : order.indexOf(b.dataset.route);
      show(order[j], b.classList.contains('tm') ? '.tm' : '.rsel');
    });
    const pre = params.get('route');
    if (pre && order.includes(pre)) show(pre);
  }

  // ---------- route finder ----------
  const filters = $('[data-filters]');
  if (filters) {
    const list = $('[data-list]'), items = $$('.ri', list), count = $('[data-count]'), empty = $('[data-empty]');
    const gMin = $('#g-min'), gMax = $('#g-max'), q = $('#q'), sort = $('#sort'), sun = $('[data-sun]');
    const litNow = new Set(D.WALLS.filter((w) => C.lit(w, NOWMS, D.SITE.lat, D.SITE.lon)).map((w) => w.slug));
    const toIdx = (v, d) => { if (v == null || v === '') return d; const n = /^\d+$/.test(v) ? Number(v) : D.SCALE.indexOf(v); return n >= 0 && n < D.SCALE.length ? n : d; };
    const st = { min: toIdx(params.get('min'), 0), max: toIdx(params.get('max'), D.SCALE.length - 1), style: params.get('style') || '', wall: WALL[params.get('wall')] ? params.get('wall') : '', sun: params.get('sun') === '1', q: params.get('q') || '', sort: params.get('sort') || 'walk' };
    if (st.min > st.max) [st.min, st.max] = [st.max, st.min];
    if (!['', 'sport', 'trad'].includes(st.style)) st.style = '';
    if (![...sort.options].some((o) => o.value === st.sort)) st.sort = 'walk';
    const sorters = {
      walk: (a, b) => a.dataset.order - b.dataset.order,
      grade: (a, b) => a.dataset.fr - b.dataset.fr || a.dataset.order - b.dataset.order,
      'grade-d': (a, b) => b.dataset.fr - a.dataset.fr || a.dataset.order - b.dataset.order,
      len: (a, b) => b.dataset.len - a.dataset.len || a.dataset.order - b.dataset.order,
      name: (a, b) => a.dataset.name.localeCompare(b.dataset.name),
    };
    const render = () => {
      gMin.value = st.min; gMax.value = st.max;
      gMin.setAttribute('aria-valuetext', D.SCALE[st.min]); gMax.setAttribute('aria-valuetext', D.SCALE[st.max]);
      $('[data-out="min"]').textContent = D.SCALE[st.min]; $('[data-out="max"]').textContent = D.SCALE[st.max];
      $$('.chip[data-style]', filters).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.style === st.style)));
      $$('.chip[data-wall]', filters).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.wall === st.wall)));
      sun.checked = st.sun; if (q.value !== st.q) q.value = st.q; sort.value = st.sort;
      const term = st.q.trim().toLowerCase();
      let n = 0;
      for (const li of items) {
        const fr = Number(li.dataset.fr);
        const ok = fr >= st.min && fr <= st.max && (!st.style || li.dataset.style === st.style) && (!st.wall || li.dataset.wall === st.wall) && (!st.sun || litNow.has(li.dataset.wall)) && (!term || li.dataset.name.includes(term) || WALL[li.dataset.wall].name.toLowerCase().includes(term));
        li.hidden = !ok; if (ok) n++;
      }
      items.slice().sort(sorters[st.sort]).forEach((li) => list.appendChild(li));
      count.textContent = `${n} ${n === 1 ? 'route' : 'routes'}`;
      empty.hidden = n > 0; list.hidden = n === 0;
      setParams({ min: st.min ? D.SCALE[st.min] : '', max: st.max < D.SCALE.length - 1 ? D.SCALE[st.max] : '', style: st.style, wall: st.wall, sun: st.sun ? '1' : '', q: st.q, sort: st.sort === 'walk' ? '' : st.sort });
    };
    gMin.addEventListener('input', () => { st.min = Number(gMin.value); if (st.min > st.max) st.max = st.min; render(); });
    gMax.addEventListener('input', () => { st.max = Number(gMax.value); if (st.max < st.min) st.min = st.max; render(); });
    filters.addEventListener('click', (e) => {
      const c = e.target.closest('.chip'); if (!c) return;
      if ('style' in c.dataset) st.style = c.dataset.style; else st.wall = c.dataset.wall;
      render();
    });
    sun.addEventListener('change', () => { st.sun = sun.checked; render(); });
    q.addEventListener('input', () => { st.q = q.value; render(); });
    sort.addEventListener('change', () => { st.sort = sort.value; render(); });
    filters.addEventListener('submit', (e) => e.preventDefault());
    $('[data-clear]').addEventListener('click', () => { Object.assign(st, { min: 0, max: D.SCALE.length - 1, style: '', wall: '', sun: false, q: '', sort: 'walk' }); render(); gMin.focus(); });
    render();
  }

  // ---------- grade converter ----------
  const conv = $('[data-conv]');
  if (conv) {
    const sys = $('#cv-sys'), val = $('#cv-val'), out = $('[data-conv-out]');
    const fill = () => {
      const vals = D.GRADES[sys.value]; const seen = [];
      vals.forEach((v) => { if (!seen.includes(v)) seen.push(v); });
      val.innerHTML = seen.map((v) => `<option>${esc(v)}</option>`).join('');
    };
    const show = () => {
      const idx = D.GRADES[sys.value].map((v, i) => (v === val.value ? i : -1)).filter((i) => i > -1);
      $$('.gt tbody tr').forEach((tr) => tr.classList.toggle('on', idx.includes(Number(tr.dataset.gi))));
      $$('.gsel').forEach((b) => b.setAttribute('aria-pressed', String(idx.includes(Number(b.dataset.gi)))));
      const span = (k) => { const a = D.GRADES[k][idx[0]], b = D.GRADES[k][idx.at(-1)]; return a === b ? a : `${a} to ${b}`; };
      const here = D.ROUTES.filter((r) => idx.includes(r.fr)).length;
      out.innerHTML = `<dl>${D.SYSTEMS.filter(([k]) => k !== sys.value).map(([k, l]) => `<div><dt>${esc(l)}</dt><dd>${esc(span(k))}</dd></div>`).join('')}<div><dt>Routes here</dt><dd>${here}</dd></div></dl>`;
      setParams({ sys: sys.value === 'french' ? '' : sys.value, g: val.value });
    };
    sys.addEventListener('change', () => { fill(); show(); });
    val.addEventListener('change', show);
    $$('.gsel').forEach((b) => b.addEventListener('click', () => { sys.value = 'french'; fill(); val.value = D.GRADES.french[Number(b.dataset.gi)]; show(); }));
    if (D.GRADES[params.get('sys')]) sys.value = params.get('sys');
    fill();
    const g = params.get('g'); if (g && [...val.options].some((o) => o.value === g)) val.value = g; else val.value = sys.value === 'french' ? '6b+' : val.options[0].value;
    show();
  }

  // ---------- sun ----------
  const stripHTML = (s, marker) => {
    const pct = (m) => (((m - 300) / 960) * 100).toFixed(2);
    return s.map(([a, b]) => `<span class="sun-seg" style="left:${pct(a)}%;width:${(pct(b) - pct(a)).toFixed(2)}%"></span>`).join('') + (marker >= 300 && marker <= 1260 ? `<span class="strip-now" style="left:${pct(marker)}%"></span>` : '');
  };
  const sunForm = $('[data-sun-form]');
  if (sunForm) {
    const sd = $('#sd'), stt = $('#st'), err = $('[data-sun-err]');
    const okDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && v >= sd.min && v <= sd.max;
    if (okDate(params.get('date') || '')) sd.value = params.get('date');
    if (/^\d{2}:\d{2}$/.test(params.get('time') || '')) stt.value = params.get('time');
    const pick = params.get('wall');
    const run = () => {
      const bad = !okDate(sd.value) || !/^\d{2}:\d{2}$/.test(stt.value);
      sd.setAttribute('aria-invalid', String(!okDate(sd.value)));
      if (bad) { err.hidden = false; err.textContent = `Pick a date between 1 January 2026 and 31 December 2027, and a time.`; return; }
      err.hidden = true;
      const [hh, mm] = stt.value.split(':').map(Number); const min = hh * 60 + mm;
      const ms = ukMs(sd.value, stt.value);
      const s = C.solar(ms, D.SITE.lat, D.SITE.lon);
      $('[data-sun-head]').textContent = s.alt > 0 ? `Sun at ${s.az.toFixed(0)}°, ${s.alt.toFixed(0)}° up` : 'Sun below the horizon';
      const litW = D.WALLS.filter((w) => C.lit(w, ms, D.SITE.lat, D.SITE.lon));
      $('[data-sun-lit]').textContent = litW.length ? `In the sun at ${stt.value}: ${litW.map((w) => w.name).join(', ')}.` : `No wall in the sun at ${stt.value}.`;
      for (const li of $$('.sun-row')) {
        const w = WALL[li.dataset.wall]; const segs = C.sunStrip(w, sd.value, D.SITE.lat, D.SITE.lon);
        const txt = segs.length ? segs.map(([a, b]) => `${C.hhmm(a)}–${C.hhmm(b)}`).join(', ') : 'No sun';
        $('[data-sun-t]', li).textContent = txt;
        const strip = $('.strip', li); strip.innerHTML = stripHTML(segs, min);
        strip.setAttribute('aria-label', `${w.name}: ${segs.length ? segs.map(([a, b]) => `sun ${C.hhmm(a)} to ${C.hhmm(b)}`).join(', ') : 'no sun'}`);
        li.classList.toggle('pick', li.dataset.wall === pick);
      }
      setParams({ date: sd.value === D.NOW.date ? '' : sd.value, time: stt.value === '09:00' ? '' : stt.value });
    };
    sd.addEventListener('change', run); stt.addEventListener('change', run); sd.addEventListener('input', run); stt.addEventListener('input', run);
    $$('[data-date]', sunForm).forEach((b) => b.addEventListener('click', () => { sd.value = b.dataset.date; run(); }));
    sunForm.addEventListener('submit', (e) => e.preventDefault());
    run();
  }

  // ---------- conditions ----------
  const dryForm = $('[data-dry-form]');
  if (dryForm) {
    const dr = $('#dr'), dd = $('#dd'), dt = $('#dt'), err = $('[data-dry-err]');
    const pick = params.get('wall');
    if (params.has('rain')) dr.value = params.get('rain');
    const run = () => {
      const v = dr.value.trim() === '' ? NaN : Number(dr.value);
      const bad = !(v >= 0 && v <= 80);
      dr.setAttribute('aria-invalid', String(bad));
      if (bad) { err.hidden = false; err.textContent = 'Enter rain between 0 and 80 mm.'; $('[data-dry-head]').textContent = 'Check the rain figure'; return; }
      err.hidden = true;
      if (!dd.value || !dt.value) return;
      const stop = ukMs(dd.value, dt.value);
      let dry = 0;
      for (const li of $$('[data-dry-list] li')) {
        const w = WALL[li.dataset.wall]; const h = C.dryHours(w, v); const at = stop + h * 3600000;
        const el = $('.dry-at', li);
        const ok = at <= NOWMS && stop <= NOWMS;
        if (ok) { dry++; el.textContent = 'Dry now'; el.classList.add('ok'); }
        else { const p = ukParts(at); el.textContent = `Dry by about ${C.hhmm(Math.round(p.min / 5) * 5)}${p.iso === nowParts.iso ? '' : `, ${p.label}`}`; el.classList.remove('ok'); }
        li.classList.toggle('pick', li.dataset.wall === pick);
      }
      $('[data-dry-head]').textContent = stop > NOWMS ? 'That rain has not stopped yet' : `${dry} of ${D.WALLS.length} walls dry at ${D.NOW.time.replace(' BST', '')}`;
      setParams({ rain: String(v) === String(D.TODAY.rainLast) ? '' : v });
    };
    [dr, dd, dt].forEach((i) => { i.addEventListener('input', run); i.addEventListener('change', run); });
    dryForm.addEventListener('submit', (e) => e.preventDefault());
    run();
  }

  // ---------- rope ----------
  const ropeForm = $('[data-rope-form]');
  if (ropeForm) {
    const sport = D.ROUTES.filter((r) => r.style === 'sport');
    let rope = D.ROPES.includes(Number(params.get('rope'))) ? Number(params.get('rope')) : 60;
    const sel = $('#rr'), need = $('[data-rope-need]');
    const run = () => {
      $$('.chip[data-rope]', ropeForm).forEach((c) => c.setAttribute('aria-pressed', String(Number(c.dataset.rope) === rope)));
      const max = C.ropeMax(rope, D.ROPE_MARGIN);
      const short = sport.filter((r) => r.len > max);
      $('[data-rope-head]').textContent = `A ${rope} m rope lowers off ${sport.length - short.length} of ${sport.length} bolted routes`;
      $('[data-rope-sub]').textContent = `Longest route it reaches: ${Math.floor(max)} m.${short.length ? ` Too short for ${short.length}:` : ' Every bolted route is in reach.'}`;
      $('[data-rope-list]').innerHTML = short.map((r) => `<li><a href="${rel}walls/${r.wall}/index.html?route=${r.id}">${esc(r.name)}</a>, ${esc(r.wallName)}, ${r.len} m</li>`).join('');
      const r = ROUTE[sel.value];
      need.textContent = r ? `${r.name}, ${r.len} m: needs ${2 * r.len + D.ROPE_MARGIN} m of rope and ${r.bolts + 2} quickdraws. ${r.need ? `A ${r.need} m rope is enough.` : ''}` : '';
      setParams({ rope: rope === 60 ? '' : rope, route: sel.value });
    };
    ropeForm.addEventListener('click', (e) => { const c = e.target.closest('.chip[data-rope]'); if (c) { rope = Number(c.dataset.rope); run(); } });
    sel.addEventListener('change', run);
    if (ROUTE[params.get('route')]) sel.value = params.get('route');
    run();
  }

  // ---------- access ----------
  const accessForm = $('[data-access-form]');
  if (accessForm) {
    const ad = $('#ad');
    const NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const lab = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${NAMES[m - 1]} ${y}`; };
    if (/^\d{4}-\d{2}-\d{2}$/.test(params.get('date') || '')) ad.value = params.get('date');
    const run = () => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ad.value)) return;
      const md = ad.value.slice(5);
      const rows = D.WALLS.map((w) => {
        const c = w.closure && md >= w.closure.from && md <= w.closure.to ? w.closure : null;
        return { w, c };
      });
      const n = rows.filter((x) => x.c).length;
      $('[data-access-head]').textContent = n ? `${lab(ad.value)}: ${n} ${n === 1 ? 'closure' : 'closures'}` : `${lab(ad.value)}: every wall open`;
      $('[data-access-list]').innerHTML = rows.map(({ w, c }) => `<li><strong>${esc(w.name)}</strong>: ${c ? `${c.routes === 'all' ? 'closed' : `routes ${c.routes.join(', ')} closed`}. ${esc(c.reason)}.` : 'open'}</li>`).join('');
      setParams({ date: ad.value === D.NOW.date ? '' : ad.value });
    };
    ad.addEventListener('change', run); ad.addEventListener('input', run);
    $$('[data-date]', accessForm).forEach((b) => b.addEventListener('click', () => { ad.value = b.dataset.date; run(); }));
    accessForm.addEventListener('submit', (e) => e.preventDefault());
    run();
  }

  // ---------- ticklist page ----------
  function renderTickPage() {
    const full = $('[data-ticks-full]'); if (!full) return;
    const t = ticks().map((id) => ROUTE[id]).filter(Boolean).sort((a, b) => b.fr - a.fr);
    $('[data-ticks-empty]').hidden = t.length > 0; full.hidden = t.length === 0;
    if (!t.length) return;
    $('[data-ticks-head]').textContent = `${t.length} ${t.length === 1 ? 'route' : 'routes'}, hardest ${t[0].grade}`;
    const by = {}; t.forEach((r) => { by[r.fr] = (by[r.fr] || 0) + 1; });
    const keys = Object.keys(by).map(Number).sort((a, b) => b - a);
    $('[data-pyr]').innerHTML = keys.map((k) => `<li><span class="pyr-g">${esc(D.SCALE[k])}</span><span class="pyr-b" role="img" aria-label="${by[k]} ${by[k] === 1 ? 'route' : 'routes'}">${'<span></span>'.repeat(by[k])}</span></li>`).join('');
    $('[data-tick-list]').innerHTML = t.map((r) => `<li><span class="tl-g">${esc(r.grade)}</span><span><a href="${rel}walls/${r.wall}/index.html?route=${r.id}">${esc(r.name)}</a><span class="tl-w">${esc(r.wallName)}, ${r.len} m</span></span><button class="tick" type="button" data-tick="${r.id}" aria-pressed="true"><span class="vh">Untick ${esc(r.name)}</span><span aria-hidden="true">Ticked</span></button></li>`).join('');
  }
  const clear = $('[data-ticks-clear]');
  if (clear) clear.addEventListener('click', () => { setTicks([]); paintTicks(); const a = $('[data-ticks-empty] a'); if (a) a.focus(); });

  paintTicks();
})();
