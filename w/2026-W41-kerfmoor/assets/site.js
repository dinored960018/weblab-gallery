/* Kerfmoor Timber Yard — menu, species strips, filters, compare, three bench tools, quote form. */
(() => {
  const KM = window.KM;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const SP = Object.fromEntries(KM.SPECIES.map((s) => [s.slug, s]));
  const fmt = (v, d = 0) => Number(v).toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
  const gbp = (v) => '£' + fmt(v, 2);
  const total = (s) => Object.values(s.stock).reduce((a, b) => a + b, 0);
  const params = new URLSearchParams(location.search);
  const setParams = (obj) => {
    const p = new URLSearchParams(location.search);
    Object.entries(obj).forEach(([k, v]) => (v === '' || v == null ? p.delete(k) : p.set(k, v)));
    const q = p.toString();
    history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
  };
  const flip = (el, text) => {
    if (el.textContent === text) return;
    el.textContent = text;
    if (reduce.matches) return;
    el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip');
  };

  // ---------- quote store (this tab only) ----------
  const QKEY = 'kerfmoor-quote';
  const qGet = () => { try { return JSON.parse(sessionStorage.getItem(QKEY) || '[]'); } catch { return []; } };
  const qSet = (v) => { try { sessionStorage.setItem(QKEY, JSON.stringify(v)); } catch { /* storage blocked: lines live for this page only */ } qCount(); };
  const qCount = () => { const n = qGet().length; $$('[data-qcount]').forEach((e) => (e.textContent = n ? `(${n})` : '')); };
  qCount();

  // ---------- menu ----------
  const mb = $('.menu-btn'), nav = $('#nav');
  if (mb && nav) {
    const set = (open) => {
      mb.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      mb.textContent = open ? 'Close' : 'Menu';
    };
    mb.addEventListener('click', () => set(mb.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mb.getAttribute('aria-expanded') === 'true') { set(false); mb.focus(); }
    });
    matchMedia('(min-width: 1241px)').addEventListener('change', (m) => m.matches && set(false));
  }

  // ---------- strips ----------
  const box = $('[data-strips]');
  const openStrip = (strip, open) => {
    strip.classList.toggle('is-open', open);
    $('.strip-btn', strip).setAttribute('aria-expanded', String(open));
    $('.strip-panel', strip).hidden = !open;
  };
  if (box) {
    box.addEventListener('click', (e) => {
      const btn = e.target.closest('.strip-btn'); if (!btn) return;
      const strip = btn.parentElement, was = strip.classList.contains('is-open');
      $$('.strip', box).forEach((s) => s !== strip && openStrip(s, false));
      openStrip(strip, !was);
    });
    box.addEventListener('keydown', (e) => {
      const btn = e.target.closest('.strip-btn'); if (!btn) return;
      const list = $$('.strip:not([hidden]) .strip-btn', box);
      const i = list.indexOf(btn);
      let j = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % list.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + list.length) % list.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = list.length - 1;
      if (e.key === 'Escape') { const s = btn.parentElement; if (s.classList.contains('is-open')) { openStrip(s, false); e.preventDefault(); } return; }
      if (j != null) { e.preventDefault(); list[j].focus(); }
    });
  }

  // ---------- species filters ----------
  if (document.body.dataset.page === 'species' && box) {
    const chips = $$('.chip[data-use]'), q = $('#sp-q'), sort = $('#sp-sort'), count = $('#sp-count'), empty = $('#sp-empty');
    const strips = $$('.strip', box);
    const keys = { stock: (s) => total(s), price: (s) => s.price, density: (s) => s.density, janka: (s) => s.janka, t: (s) => s.t };
    let use = params.get('use') || '';
    if (!chips.some((c) => c.dataset.use === use)) use = '';
    q.value = params.get('q') || '';
    if (keys[params.get('sort')]) sort.value = params.get('sort');
    const apply = () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.use === use)));
      const term = q.value.trim().toLowerCase();
      const k = keys[sort.value];
      strips.sort((a, b) => k(SP[b.dataset.slug]) - k(SP[a.dataset.slug])).forEach((s) => box.appendChild(s));
      let n = 0;
      strips.forEach((s) => {
        const ok = (!use || s.dataset.uses.split(' ').includes(use)) && (!term || s.dataset.name.includes(term));
        s.hidden = !ok; if (!ok) openStrip(s, false); else n++;
      });
      count.textContent = n === 1 ? '1 species' : `${n} species`;
      empty.hidden = n > 0; box.hidden = n === 0;
      setParams({ use, q: term, sort: sort.value === 'stock' ? '' : sort.value });
    };
    chips.forEach((c) => c.addEventListener('click', () => { use = c.dataset.use; apply(); }));
    q.addEventListener('input', apply);
    sort.addEventListener('change', apply);
    $('#sp-clear').addEventListener('click', () => { use = ''; q.value = ''; sort.value = 'stock'; apply(); chips[0].focus(); });
    apply();

    // compare
    const a = $('#cmp-a'), b = $('#cmp-b'), out = $('#cmp-out');
    const rows = [
      ['In the yard', (s) => total(s), (v) => fmt(v, 1) + ' m³'],
      ['Price, 27 mm', (s) => s.price, (v) => '£' + fmt(v) + ' /m³'],
      ['Density', (s) => s.density, (v) => fmt(v) + ' kg/m³'],
      ['Hardness', (s) => s.janka, (v) => fmt(v) + ' N'],
      ['Movement, flat-sawn', (s) => s.t, (v) => fmt(v, 2) + ' %'],
      ['Durability class', (s) => 6 - s.dur, (v) => 'Class ' + (6 - v)],
    ];
    const draw = () => {
      const A = SP[a.value], B = SP[b.value];
      out.innerHTML = `<dl>
        <div class="cmp-row"><dt></dt><dd class="cmp-head">${A.name}</dd><dd class="cmp-head">${B.name}</dd></div>
        ${rows.map(([label, f, show]) => {
          const max = Math.max(...KM.SPECIES.map(f));
          const cell = (s) => `<dd><span class="cmp-bar" style="--c:${s.color};--w:${Math.max(4, (f(s) / max) * 70)}%"></span><span class="cmp-v">${show(f(s))}</span></dd>`;
          return `<div class="cmp-row"><dt>${label}</dt>${cell(A)}${cell(B)}</div>`;
        }).join('')}
      </dl>`;
      setParams({ a: A.slug === 'oak' ? '' : A.slug, b: B.slug === 'chestnut' ? '' : B.slug });
    };
    if (SP[params.get('a')]) a.value = params.get('a');
    if (SP[params.get('b')]) b.value = params.get('b');
    a.addEventListener('change', draw); b.addEventListener('change', draw);
    draw();
  }

  // ---------- stock filters ----------
  if (document.body.dataset.page === 'stock') {
    const chips = $$('.chip[data-kind]'), tSel = $('#st-t'), minSel = $('#st-min'), rows = $$('.bar-row'), count = $('#st-count'), empty = $('#st-empty'), list = $('#st-list');
    let kind = ['Hardwood', 'Softwood'].includes(params.get('kind')) ? params.get('kind') : '';
    if ([...tSel.options].some((o) => o.value === params.get('t'))) tSel.value = params.get('t');
    if ([...minSel.options].some((o) => o.value === params.get('min'))) minSel.value = params.get('min');
    const apply = () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.kind === kind)));
      const t = tSel.value, min = Number(minSel.value);
      let n = 0;
      rows.forEach((r) => {
        const s = SP[r.dataset.slug];
        const v = t ? s.stock[t] : total(s);
        const ok = (!kind || s.kind === kind) && v >= min && v > 0;
        r.hidden = !ok; if (ok) n++;
        $$('.seg-b', r).forEach((g) => (g.hidden = !!t && g.dataset.t !== t));
        $('[data-v]', r).textContent = fmt(v, 1) + ' m³';
      });
      count.textContent = n === 1 ? '1 species' : `${n} species`;
      empty.hidden = n > 0; list.hidden = n === 0;
      setParams({ kind, t, min: min ? minSel.value : '' });
    };
    chips.forEach((c) => c.addEventListener('click', () => { kind = c.dataset.kind; apply(); }));
    tSel.addEventListener('change', apply); minSel.addEventListener('change', apply);
    $('#st-clear').addEventListener('click', () => { kind = ''; tSel.value = ''; minSel.value = '0'; apply(); chips[0].focus(); });
    apply();
  }

  // ---------- number field helper ----------
  const numField = (input, { min, max, label, unit }) => {
    const err = document.getElementById(input.getAttribute('aria-describedby'));
    const v = Number(input.value);
    const bad = input.value.trim() === '' || !Number.isFinite(v) || v < min || v > max;
    input.setAttribute('aria-invalid', String(bad));
    if (err) { err.hidden = !bad; err.textContent = bad ? `${label}: ${fmt(min)}–${fmt(max)}${unit ? ' ' + unit : ''}` : ''; }
    return bad ? null : v;
  };

  // ---------- board calculator ----------
  const calc = $('#calc');
  if (calc) {
    const sp = $('#c-sp'), t = $('#c-t'), w = $('#c-w'), l = $('#c-l'), n = $('#c-n');
    const totalEl = $('#c-total'), list = $('#c-list'), add = $('#c-add'), added = $('#c-added');
    if (SP[params.get('sp')]) sp.value = params.get('sp');
    if (KM.THICK.includes(Number(params.get('t')))) t.value = params.get('t');
    ['w', 'l', 'n'].forEach((k) => { const v = params.get(k); if (v && /^\d+$/.test(v)) ({ w, l, n })[k].value = v; });
    if (params.get('f') === 'par') $('input[name="f"][value="par"]', calc).checked = true;
    let current = null;
    const run = () => {
      const s = SP[sp.value], th = Number(t.value);
      const W = numField(w, { min: 50, max: 400, label: 'Width', unit: 'mm' });
      const L = numField(l, { min: 300, max: 4800, label: 'Length', unit: 'mm' });
      const N = numField(n, { min: 1, max: 500, label: 'Boards', unit: '' });
      const par = $('input[name="f"]:checked', calc).value === 'par';
      if (W == null || L == null || N == null) { current = null; flip(totalEl, '—'); list.innerHTML = '<dt>Check the highlighted field</dt><dd></dd>'; add.disabled = true; return; }
      add.disabled = false;
      const m3 = (th / 1000) * (W / 1000) * (L / 1000) * N;
      const rate = Math.round((s.price * KM.THICK_FACTOR[th]) / 10) * 10;
      const timber = m3 * rate;
      const lin = (L / 1000) * N;
      const plane = par ? Math.max(20, lin * (W > 200 ? 1.4 : 0.85)) : 0;
      const ex = timber + plane, vat = ex * 0.2;
      const kg = m3 * s.density * (/Air dried/.test(s.mc) ? 1.06 : 1);
      current = { slug: s.slug, text: `${N} × ${s.short.toLowerCase()} ${th} × ${W} × ${fmt(L)} mm${par ? ', planed' : ', sawn'}`, ex };
      flip(totalEl, '£' + fmt(ex + vat, 2));
      list.innerHTML = [
        ['Volume', fmt(m3, 4) + ' m³'],
        ['Board feet', fmt(m3 * 423.78, 1)],
        ['Weight', fmt(kg, 0) + ' kg'],
        [`Timber at £${fmt(rate)}/m³`, gbp(timber)],
        ...(par ? [[`Planing, ${fmt(lin, 1)} m`, gbp(plane)], ['Finished size', `${th - 5} × ${W - 5} mm`]] : []),
        ['Ex VAT', gbp(ex)],
        ['VAT 20 %', gbp(vat)],
      ].map(([a, b]) => { const c = a === 'Ex VAT' ? ' class="tot"' : ''; return `<dt${c}>${a}</dt><dd${c}>${b}</dd>`; }).join('');
      setParams({ sp: s.slug, t: th, w: W, l: L, n: N, f: par ? 'par' : '' });
    };
    calc.addEventListener('input', run);
    calc.addEventListener('change', run);
    calc.addEventListener('submit', (e) => e.preventDefault());
    add.addEventListener('click', () => {
      if (!current) return;
      const lines = qGet(); lines.push(current); qSet(lines);
      added.innerHTML = `Added. ${lines.length} line${lines.length === 1 ? '' : 's'} in your quote — <a href="../order/index.html">view quote</a>.`;
    });
    run();
  }

  // ---------- cut list ----------
  const cut = $('#cut');
  if (cut) {
    const partsEl = $('#parts'), bl = $('#cut-l'), kerf = $('#cut-k'), trim = $('#cut-tr'), errBox = $('#cut-err');
    const outN = $('#cut-n'), outSum = $('#cut-sum'), map = $('#cut-map');
    const TONES = ['#C49A6C', '#E2D2AE', '#D9B48A', '#EDE3CC', '#CD8E5C'];
    const START = [['Table leg', 720, 4], ['Long rail', 1600, 2], ['Short rail', 700, 2], ['Top board', 1900, 5]];
    let uid = 0;
    const addRow = (name = '', len = '', qty = 1, focus = false) => {
      const id = ++uid;
      const li = document.createElement('li');
      li.className = 'part';
      li.innerHTML = `<input id="p${id}-name" aria-label="Part ${id} name" value="${String(name).replace(/"/g, '&quot;')}" data-k="name">
        <input id="p${id}-len" aria-label="Part ${id} length in mm" type="number" min="10" max="4800" inputmode="numeric" value="${len}" data-k="len">
        <input id="p${id}-qty" aria-label="Part ${id} how many" type="number" min="1" max="99" inputmode="numeric" value="${qty}" data-k="qty">
        <button type="button" class="part-del" aria-label="Remove part ${id}">×</button>`;
      partsEl.appendChild(li);
      if (focus) $('input', li).focus();
    };
    START.forEach(([a, b, c]) => addRow(a, b, c));
    $('#part-add').addEventListener('click', () => { addRow('', '', 1, true); run(); });
    partsEl.addEventListener('click', (e) => {
      const del = e.target.closest('.part-del'); if (!del) return;
      const li = del.parentElement, next = li.nextElementSibling || li.previousElementSibling;
      li.remove(); run();
      (next ? $('.part-del', next) : $('#part-add')).focus();
    });
    const run = () => {
      const L = Number(bl.value), K = Math.max(0, Number(kerf.value) || 0), T = Math.max(0, Number(trim.value) || 0);
      const usable = L - 2 * T;
      const errs = [];
      const pieces = [];
      $$('.part', partsEl).forEach((li, i) => {
        const [nm, ln, qt] = $$('input', li);
        const len = Number(ln.value), qty = Number(qt.value);
        const name = nm.value.trim() || `Part ${i + 1}`;
        let bad = false;
        if (ln.value.trim() === '' && qt.value.trim() !== '') { bad = true; errs.push([ln, `${name}: enter a length`]); }
        else if (!(len >= 10)) { bad = ln.value.trim() !== ''; if (bad) errs.push([ln, `${name}: length must be 10 mm or more`]); }
        else if (len > usable) { bad = true; errs.push([ln, `Part longer than the board: ${name} ${fmt(len)} mm > ${fmt(usable)} mm usable`]); }
        ln.setAttribute('aria-invalid', String(bad));
        const qbad = !(qty >= 1 && qty <= 99 && Number.isInteger(qty));
        qt.setAttribute('aria-invalid', String(qbad));
        if (qbad) errs.push([qt, `${name}: how many must be 1–99`]);
        if (!bad && !qbad && len >= 10) for (let k = 0; k < qty; k++) pieces.push({ name, len, tone: TONES[i % TONES.length] });
      });
      errBox.hidden = !errs.length;
      const errHtml = errs.length ? `<p>${errs.length === 1 ? 'One part needs fixing' : errs.length + ' parts need fixing'}:</p><ul>${errs.map(([el, m], i) => `<li><a href="#${el.id}" data-i="${i}">${m}</a></li>`).join('')}</ul>` : '';
      // re-render only when the message changes, so a click that blurs a field does not lose its target
      if (errBox.dataset.html !== errHtml) { errBox.innerHTML = errHtml; errBox.dataset.html = errHtml; }
      errBox.onclick = (e) => { const a = e.target.closest('a[data-i]'); if (a) { e.preventDefault(); errs[a.dataset.i][0].focus(); } };
      if (errs.length) { outN.className = 'out-big err'; flip(outN, 'Fix the parts list'); outSum.textContent = ''; map.innerHTML = ''; return; }
      if (!pieces.length) { outN.className = 'out-big err'; flip(outN, 'Add a part'); outSum.textContent = ''; map.innerHTML = ''; return; }
      outN.className = 'out-big';
      // first-fit decreasing
      pieces.sort((a, b) => b.len - a.len);
      const boards = [];
      pieces.forEach((p) => {
        let b = boards.find((x) => x.used + (x.cuts.length ? K : 0) + p.len <= usable);
        if (!b) { b = { used: 0, cuts: [] }; boards.push(b); }
        const at = b.used + (b.cuts.length ? K : 0);
        b.cuts.push({ ...p, at });
        b.used = at + p.len;
      });
      const bought = boards.length * L, parts = pieces.reduce((a, p) => a + p.len, 0);
      const offPct = ((bought - parts) / bought) * 100;
      flip(outN, `${boards.length} × ${(L / 1000).toFixed(1)} m`);
      outSum.textContent = `${boards.length} board${boards.length === 1 ? '' : 's'} of ${(L / 1000).toFixed(1)} m · ${fmt(bought / 1000, 1)} m bought for ${fmt(parts / 1000, 2)} m of parts · ${fmt(offPct, 0)} % offcut, trims and kerf.`;
      const pct = (mm) => (mm / L) * 100;
      map.innerHTML = boards.map((b, i) => {
        const left = usable - b.used;
        return `<div><p class="board-l">Board ${i + 1} · offcut ${fmt(left)} mm</p>
        <div class="board" role="img" aria-label="Board ${i + 1}: ${b.cuts.map((c) => `${c.name} ${c.len} mm`).join(', ')}; offcut ${left} mm">
          <span class="trim" style="left:0;width:${pct(T)}%"></span>
          ${b.cuts.map((c) => `<span class="pc" style="--c:${c.tone};left:${pct(T + c.at)}%;width:${pct(c.len)}%"><span class="pc-n">${c.name} </span>${c.len}</span>`).join('')}
          <span class="off" style="width:${pct(left)}%;right:${pct(T)}%">${left >= 300 ? fmt(left) : ''}</span>
          <span class="trim" style="right:0;width:${pct(T)}%"></span>
        </div></div>`;
      }).join('');
      if (!reduce.matches) {
        $$('.board', map).forEach((board) => $$('.pc', board).forEach((pc, k) => {
          const dx = -pc.offsetLeft;
          pc.animate([{ transform: `translateX(${dx}px)`, opacity: 0.4 }, { transform: 'none', opacity: 1 }], { duration: 260, delay: k * 30, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
        }));
      }
    };
    let timer = 0;
    cut.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 180); });
    cut.addEventListener('change', run);
    cut.addEventListener('submit', (e) => e.preventDefault());
    run();
  }

  // ---------- movement ----------
  const move = $('#move');
  if (move) {
    const sp = $('#m-sp'), w = $('#m-w'), a = $('#m-a'), b = $('#m-b');
    const out = $('#m-out'), line = $('#m-line'), barA = $('#m-bar-a'), barB = $('#m-bar-b'), d = $('#m-bar-d'), all = $('#m-all'), cap = $('#all-cap');
    if (SP[params.get('sp')]) sp.value = params.get('sp');
    ['w', 'a', 'b'].forEach((k) => { const v = params.get(k); if (v && /^\d+$/.test(v)) ({ w, a, b })[k].value = v; });
    if (params.get('cut') === 'r') $('input[name="cut"][value="r"]', move).checked = true;
    const run = () => {
      const s = SP[sp.value];
      const W = numField(w, { min: 20, max: 1200, label: 'Width', unit: 'mm' });
      const A = numField(a, { min: 5, max: 28, label: 'Moisture now', unit: '%' });
      const B = numField(b, { min: 5, max: 28, label: 'Moisture later', unit: '%' });
      const cutK = $('input[name="cut"]:checked', move).value;
      if (W == null || A == null || B == null) { flip(out, '—'); line.textContent = 'Check the highlighted field.'; return; }
      const dW = W * (s[cutK] / 100) * (B - A);
      const word = dW < 0 ? 'narrower' : dW > 0 ? 'wider' : 'no change';
      flip(out, (dW > 0 ? '+' : dW < 0 ? '−' : '') + fmt(Math.abs(dW), 1) + ' mm');
      line.textContent = dW === 0 ? 'Same moisture, same width.' : `A ${fmt(W)} mm ${cutK === 't' ? 'flat-sawn' : 'quarter-sawn'} ${s.short.toLowerCase()} board gets ${fmt(Math.abs(dW), 1)} mm ${word} between ${A} % and ${B} %: ${fmt(W + dW, 1)} mm.`;
      const big = W + Math.max(0, dW * 10);
      barA.style.setProperty('--c', s.color); barB.style.setProperty('--c', s.color);
      barA.style.setProperty('--k', W / big);
      const bw = W + Math.min(0, dW * 10);
      barB.style.setProperty('--k', bw / big);
      d.classList.toggle('shrink', dW < 0);
      d.style.setProperty('--dw', (Math.abs(dW * 10) / bw) * 100 + '%');
      cap.textContent = `${fmt(W)} mm ${cutK === 't' ? 'flat-sawn' : 'quarter-sawn'}, ${A} % → ${B} %`;
      const rows = KM.SPECIES.map((x) => ({ x, v: W * (x[cutK] / 100) * (B - A) })).sort((p, q) => Math.abs(q.v) - Math.abs(p.v));
      const max = Math.max(...rows.map((r) => Math.abs(r.v)), 0.0001);
      all.innerHTML = rows.map(({ x, v }) => `<li${x.slug === s.slug ? ' class="is-me"' : ''}><span class="nm">${x.short}</span><span class="b" style="--c:${x.color};--w:${Math.max(1, (Math.abs(v) / max) * 100)}%"></span><span class="v">${fmt(Math.abs(v), 1)} mm</span></li>`).join('');
      setParams({ sp: s.slug, w: W, a: A, b: B, cut: cutK === 'r' ? 'r' : '' });
    };
    move.addEventListener('input', run);
    move.addEventListener('change', run);
    move.addEventListener('submit', (e) => e.preventDefault());
    run();
  }

  // ---------- quote request ----------
  const order = $('#order');
  if (order) {
    const linesEl = $('#o-lines'), more = $('#o-more'), days = $('#o-days'), zoneWrap = $('#o-zone-wrap'), zone = $('#o-zone');
    const name = $('#o-name'), email = $('#o-email'), phone = $('#o-phone'), errBox = $('#o-err'), done = $('#o-done'), sum = $('#o-sum');
    const drawLines = () => {
      const lines = qGet();
      linesEl.innerHTML = lines.length
        ? `<ol class="plain">${lines.map((l, i) => `<li class="line"><span>${l.text.replace(/</g, '&lt;')}</span><span class="line-p">£${fmt(l.ex, 2)}</span><button type="button" class="line-del" data-i="${i}" aria-label="Remove line ${i + 1}: ${l.text.replace(/"/g, '')}">Remove</button></li>`).join('')}</ol><p class="small">Ex VAT. Prices are checked again when we cut.</p>`
        : `<p class="lines-empty">No lines yet. Add boards from the <a href="../calculator/index.html">board calculator</a>, or describe what you need below.</p>`;
    };
    linesEl.addEventListener('click', (e) => {
      const b = e.target.closest('.line-del'); if (!b) return;
      const lines = qGet(); lines.splice(Number(b.dataset.i), 1); qSet(lines); drawLines();
      (linesEl.querySelector('.line-del') || more).focus();
    });
    drawLines();
    const how = () => $('input[name="how"]:checked', order).value;
    const syncHow = () => { const del = how() === 'deliver'; days.hidden = del; zoneWrap.hidden = !del; };
    $$('input[name="how"]', order).forEach((r) => r.addEventListener('change', syncHow));
    syncHow();
    const setErr = (el, errEl, msg) => {
      el.setAttribute('aria-invalid', String(!!msg));
      errEl.hidden = !msg; errEl.textContent = msg || '';
    };
    order.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = [];
      const check = (el, errId, msg) => { setErr(el, $('#' + errId), msg); if (msg) errs.push([el, msg]); };
      const lines = qGet();
      check(more, 'o-more-e', !lines.length && more.value.trim().length < 5 ? 'Add a line from the calculator or describe what you need' : '');
      const dayIn = $('input[name="day"]:checked', order);
      const dayErr = $('#o-days-e');
      if (how() === 'collect' && !dayIn) { dayErr.hidden = false; dayErr.textContent = 'Choose a collection day'; errs.push([$('input[name="day"]:not(:disabled)', order), 'Choose a collection day']); }
      else { dayErr.hidden = true; dayErr.textContent = ''; }
      check(zone, 'o-zone-e', how() === 'deliver' && !zone.value ? 'Choose a delivery zone' : '');
      check(name, 'o-name-e', name.value.trim().length < 2 ? 'Enter your name' : '');
      check(email, 'o-email-e', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? 'Enter an email like name@example.com' : '');
      check(phone, 'o-phone-e', phone.value.replace(/\D/g, '').length < 10 ? 'Enter a phone number with at least 10 digits' : '');
      if (errs.length) {
        errBox.hidden = false;
        errBox.innerHTML = `<p>${errs.length === 1 ? 'One thing to fix' : errs.length + ' things to fix'}:</p><ul>${errs.map(([el, m], i) => `<li><a href="#${el.id}" data-i="${i}">${m}</a></li>`).join('')}</ul>`;
        errBox.onclick = (ev) => { const a = ev.target.closest('a[data-i]'); if (a) { ev.preventDefault(); errs[a.dataset.i][0].focus(); } };
        errBox.focus();
        return;
      }
      errBox.hidden = true;
      const exTotal = lines.reduce((a, l) => a + l.ex, 0);
      const z = KM.ZONES.find((x) => x.id === zone.value);
      const rows = [
        ['Lines', lines.length ? lines.map((l) => l.text).join('; ') : 'None'],
        ['Lines total', lines.length ? `£${fmt(exTotal, 2)} ex VAT` : '—'],
        ['Also', more.value.trim() || '—'],
        [how() === 'collect' ? 'Collect' : 'Deliver', how() === 'collect' ? dayIn.parentElement.querySelector('.day-d').textContent : `${z.name}, £${z.price}${z.free && exTotal >= z.free ? ' (free over £' + fmt(z.free) + ')' : ''}`],
        ['Name', name.value.trim()], ['Email', email.value.trim()], ['Phone', phone.value.trim()],
      ];
      sum.innerHTML = rows.map(([a, b]) => `<dt>${a}</dt><dd>${String(b).replace(/</g, '&lt;')}</dd>`).join('');
      order.hidden = true; done.hidden = false; done.focus();
    });
    $('#o-back').addEventListener('click', () => { done.hidden = true; order.hidden = false; name.focus(); });
  }
})();
