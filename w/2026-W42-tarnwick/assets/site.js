// Tarnwick Locks — behaviour. Uses window.TWL (calc.js) and window.TWL_DATA (data.js).
(function () {
  'use strict';
  const C = window.TWL, D = window.TWL_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = new URLSearchParams(location.search);
  const setQuery = (obj) => {
    const u = new URL(location.href);
    Object.entries(obj).forEach(([k, v]) => (v === '' || v == null ? u.searchParams.delete(k) : u.searchParams.set(k, v)));
    history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? '?' + u.searchParams : '') + u.hash);
  };
  const esc = C.esc;
  const tag = (s) => `<span class="st st-${s}">${D.STATUS[s]}</span>`;
  const kv = (rows) => `<dl class="kv">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>`;

  // ---------- index sheet (narrow screens) ----------
  const sheet = $('#menu'), menuBtn = $('.menu-btn');
  if (sheet && menuBtn) {
    const panel = $('.sheet-panel', sheet);
    const focusables = () => $$('a[href], button:not([disabled])', panel);
    const open = () => { sheet.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); document.body.classList.add('is-locked'); $('.sheet-close', sheet).focus(); };
    const close = () => { sheet.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('is-locked'); menuBtn.focus(); };
    menuBtn.addEventListener('click', () => (sheet.hidden ? open() : close()));
    $('.sheet-close', sheet).addEventListener('click', close);
    sheet.addEventListener('click', (e) => { if (e.target === sheet) close(); });
    document.addEventListener('keydown', (e) => {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') {
        const f = focusables(), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // a wide window has the index on the left page; close the sheet if the window grows
    window.matchMedia('(min-width: 1181px)').addEventListener('change', (e) => { if (e.matches && !sheet.hidden) close(); });
  }

  // ---------- field errors ----------
  const showErr = (input, msg) => {
    const e = document.getElementById(input.id + '-e');
    if (msg) { e.textContent = 'Error: ' + msg; e.hidden = false; input.setAttribute('aria-invalid', 'true'); }
    else { e.textContent = ''; e.hidden = true; input.removeAttribute('aria-invalid'); }
    return !msg;
  };
  // number in range with at most `dp` decimals; returns [value, message]
  const num = (input, lo, hi, dp, what) => {
    const raw = input.value.trim();
    if (raw === '') return [null, `Enter ${what} between ${lo} and ${hi}${what.includes('number') ? '' : ' m'}.`];
    const v = Number(raw);
    if (!Number.isFinite(v) || v < lo || v > hi) return [null, `Enter ${what} between ${lo} and ${hi}${what.includes('number') ? '' : ' m'}.`];
    if (dp === 0 && !Number.isInteger(v)) return [null, `Enter a whole number between ${lo} and ${hi}.`];
    return [Math.round(v * 10 ** dp) / 10 ** dp, ''];
  };
  const firstInvalid = (form) => { const bad = $('[aria-invalid="true"]', form); if (bad) bad.focus(); };

  // ---------- the flight: one lock + fill ----------
  if (page === 'flight') {
    const box = $('#section-box'), kvBox = $('#lock-kv'), head = $('#lock-h'), btn = $('#fill-btn'), note = $('#fill-note');
    const btns = $$('.num-btn');
    const chain = C.chain(D.LOCKS, D.START);
    let cur = null, full = false, timer = 0;
    const render = (n, push) => {
      const L = D.LOCKS.find((x) => x.n === n) || D.LOCKS[6];
      cur = L; full = false; clearTimeout(timer);
      head.textContent = `Lock ${L.n} · ${L.name}`;
      box.innerHTML = C.sectionSVG(L);
      btn.textContent = 'Fill';
      note.textContent = 'Chamber empty, level with the lower pound.';
      const ch = chain[L.n - 1];
      kvBox.innerHTML = kv([
        ['Status', `${tag(L.status)}${L.restriction ? ' ' + esc(L.restriction.text) : ''}`],
        ['Fall', `${C.m1(L.fall)} m`],
        ['Chamber', `${C.m1(L.chamber)} m by ${C.m1(L.width)} m`],
        ['Longest boat', `${C.m1(L.chamber)} m`],
        ['Widest boat', `${C.m2(C.beamMax(L))} m`],
        ['Water over the cill', `${C.m2(L.cill)} m · deepest draught ${C.m2(C.draughtMax(L))} m`],
        ['Fills in', `${C.fillNow(L)} min${L.restriction && L.restriction.fill ? ` (${L.fill} min when both paddles work)` : ''}`],
        ['Water per fill', `${C.lockful(L)} m³`],
        ['Side pond', L.pond ? 'Yes' : 'No'],
        ['Paddle gear', esc(L.gear)],
        ['From the Basin entrance', `${Math.round(ch.tail)} m (tail) to ${Math.round(ch.head)} m (head)`],
        ['Pound above', L.next ? `${L.next} m to Lock ${L.n + 1}` : 'Hollin Pound'],
      ]);
      btns.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.lock) === L.n)));
      $$('tr[data-lock]').forEach((r) => r.classList.toggle('is-cur', Number(r.dataset.lock) === L.n));
      $$('.li[data-lock]').forEach((a) => {
        const on = Number(a.dataset.lock) === L.n;
        a.classList.toggle('is-cur', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      if (push) setQuery({ lock: L.n === 7 ? '' : L.n });
    };
    const want = Number(q.get('lock'));
    render(D.LOCKS.some((L) => L.n === want) ? want : 7, false);
    btns.forEach((b) => b.addEventListener('click', () => render(Number(b.dataset.lock), true)));
    btn.addEventListener('click', () => {
      const svg = $('svg.section', box);
      const L = cur;
      full = !full;
      clearTimeout(timer);
      // proportional to the real fill time, at most 4 s
      const ms = reduce() ? 0 : Math.min(4000, C.fillNow(L) * 400);
      svg.style.setProperty('--fill-dur', ms + 'ms');
      svg.classList.toggle('is-full', full);
      btn.textContent = full ? 'Empty' : 'Fill';
      note.textContent = full
        ? `Filling: ${C.fillNow(L)} min in the lock, shown in ${(ms / 1000).toFixed(1)} s.`
        : `Emptying: ${C.fillNow(L) - 1} min in the lock, shown in ${(ms / 1000).toFixed(1)} s.`;
      timer = setTimeout(() => {
        note.textContent = full
          ? `Chamber full, level with the upper pound, ${C.m1(L.fall)} m above the lower.`
          : 'Chamber empty, level with the lower pound.';
      }, ms);
    });
  }

  // ---------- find a lock ----------
  if (page === 'locks') {
    const list = $('#lock-list'), items = $$('.lk', list);
    const qI = $('#f-q'), st = $('#f-status'), fb = $('#f-fall'), so = $('#f-sort'), pond = $('#f-pond');
    const count = $('#lock-count'), empty = $('#lock-empty');
    const has = (sel, v) => [...sel.options].some((o) => o.value === v);
    qI.value = q.get('q') || '';
    [[st, 'status'], [fb, 'fall'], [so, 'sort']].forEach(([s, k]) => { const v = q.get(k); if (v && has(s, v)) s.value = v; });
    pond.setAttribute('aria-pressed', String(q.get('pond') === '1'));
    const apply = () => {
      const text = qI.value.trim().toLowerCase();
      const onlyPond = pond.getAttribute('aria-pressed') === 'true';
      const sorted = [...items].sort((a, b) => {
        if (so.value === 'fall') return Number(b.dataset.fall) - Number(a.dataset.fall) || a.dataset.n - b.dataset.n;
        if (so.value === 'fill') return Number(a.dataset.fill) - Number(b.dataset.fill) || a.dataset.n - b.dataset.n;
        return a.dataset.n - b.dataset.n;
      });
      let shown = 0;
      sorted.forEach((li) => {
        const ok = (!text || li.dataset.name.includes(text) || li.dataset.n === text)
          && (!st.value || li.dataset.status === st.value)
          && (!fb.value || li.dataset.band === fb.value)
          && (!onlyPond || li.dataset.pond === 'true');
        li.hidden = !ok;
        if (ok) shown += 1;
        list.appendChild(li);
      });
      count.textContent = shown === 1 ? '1 lock' : `${shown} locks`;
      empty.hidden = shown > 0;
      setQuery({ q: text, status: st.value, fall: fb.value, pond: onlyPond ? '1' : '', sort: so.value === 'number' ? '' : so.value });
    };
    qI.addEventListener('input', apply);
    [st, fb, so].forEach((s) => s.addEventListener('change', apply));
    pond.addEventListener('click', () => { pond.setAttribute('aria-pressed', String(pond.getAttribute('aria-pressed') !== 'true')); apply(); });
    $('#lock-filters').addEventListener('submit', (e) => e.preventDefault());
    $('#lock-clear').addEventListener('click', () => { qI.value = ''; st.value = ''; fb.value = ''; so.value = 'number'; pond.setAttribute('aria-pressed', 'false'); apply(); qI.focus(); });
    apply();
  }

  // ---------- will it fit ----------
  if (page === 'fit') {
    const form = $('#fit-form'), len = $('#fit-len'), beam = $('#fit-beam'), draft = $('#fit-draft');
    const out = $('#fit-out'), rows = $$('#fit-table tbody tr');
    ['len', 'beam', 'draft'].forEach((k) => { const v = q.get(k); if (v !== null) ({ len, beam, draft })[k].value = v; });
    const run = (fromSubmit) => {
      const [l, el] = num(len, 6, 25, 1, 'a length');
      const [b, eb] = num(beam, 1, 3, 2, 'a beam');
      const [d, ed] = num(draft, 0.3, 1.5, 2, 'a draught');
      showErr(len, el); showErr(beam, eb); showErr(draft, ed);
      if (el || eb || ed) {
        out.innerHTML = '<p>Fix the fields marked Error to see which locks take your boat.</p>';
        rows.forEach((r) => { r.classList.remove('is-no'); $('.fit-r', r).textContent = '—'; });
        if (fromSubmit) firstInvalid(form);
        return;
      }
      const input = { len: l, beam: b, draft: d };
      const lines = C.fitSummary(input, D.LOCKS);
      out.innerHTML = `<p class="big">${esc(lines[0])}</p>${lines.length > 1 ? `<ul class="out-list">${lines.slice(1).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}`;
      C.fit(input, D.LOCKS).forEach((r, i) => {
        rows[i].classList.toggle('is-no', !r.ok);
        $('.fit-r', rows[i]).textContent = r.ok ? 'Fits' : 'No: ' + r.why.map((w) => w.text).join(', ');
      });
      setQuery({ len: l.toFixed(1), beam: b.toFixed(2), draft: d.toFixed(2) });
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); run(true); });
    [len, beam, draft].forEach((i) => i.addEventListener('change', () => run(false)));
    run(false);
  }

  // ---------- passage ----------
  if (page === 'passage') {
    const form = $('#pass-form'), at = $('#pass-at'), queue = $('#pass-queue');
    const out = $('#pass-out'), warn = $('#pass-warn'), kvBox = $('#pass-kv'), tbody = $('#pass-table tbody');
    const table = D.KEEPERS.summer.table, day = C.NOW.day;
    const fromQ = q.get('from');
    if (fromQ === 'top' || fromQ === 'bottom') $(`input[name="from"][value="${fromQ}"]`, form).checked = true;
    if (q.get('at') !== null) at.value = q.get('at');
    if (q.get('queue') !== null) queue.value = q.get('queue');
    const run = (fromSubmit) => {
      const t = C.parseHM(at.value);
      let eAt = '';
      if (at.value.trim() === '') eAt = 'Enter a start time, for example 09:30.';
      else if (t === null || t < 360 || t > 1200) eAt = 'Enter a time between 06:00 and 20:00.';
      const [n, eQ] = num(queue, 0, C.QUEUE_MAX, 0, 'a whole number');
      showErr(at, eAt); showErr(queue, eQ);
      if (eAt || eQ) {
        out.innerHTML = '<p>Fill in the fields marked Error to see an estimate.</p>';
        warn.hidden = true; kvBox.innerHTML = ''; tbody.innerHTML = '';
        if (fromSubmit) firstInvalid(form);
        return;
      }
      const from = $('input[name="from"]:checked', form).value;
      const r = C.passage({ from, at: t, queue: n }, D.LOCKS, null, table, day);
      out.innerHTML = `<p class="big">${esc(C.passageLine(r, n))}.</p>`;
      warn.innerHTML = r.warn.map((w) => `<li>${esc(w)}</li>`).join('');
      warn.hidden = !r.warn.length;
      kvBox.innerHTML = kv([
        ['Direction', r.up ? 'Up, Lock 1 to Lock 11' : 'Down, Lock 11 to Lock 1'],
        ['Waiting for boats ahead', n ? `${C.dur(r.wait)} (${n} × ${C.QUEUE_MIN} min)` : 'None'],
        ['Into the first lock', C.hm(r.enter)],
        ['Out of the last lock', `${C.hm(r.finish)} (about ${C.hm(r.about)})`],
        ['Time in the flight', C.dur(r.finish - r.enter)],
        ['Keeper today', `${C.hm(table[day][0])} to ${C.hm(table[day][1])}`],
      ]);
      tbody.innerHTML = r.steps.map((s) => `<tr><th scope="row"><span class="t-n">${s.n}</span> ${esc(s.name)}</th><td>${C.hm(s.in)}</td><td>${C.hm(s.out)}</td><td>${s.work}</td><td class="wrap">${esc(s.note)}</td></tr>`).join('');
      setQuery({ from, at: C.hm(t), queue: n });
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); run(true); });
    $$('input', form).forEach((i) => i.addEventListener('change', () => run(false)));
    run(false);
  }

  // ---------- tolls ----------
  if (page === 'tolls') {
    const form = $('#toll-form'), len = $('#toll-len'), days = $('#toll-days'), daysL = $('#days-l');
    const out = $('#toll-out'), tbody = $('#toll-table tbody'), total = $('#toll-total');
    const modeQ = q.get('mode');
    if (['single', 'return', 'moor'].includes(modeQ)) $(`input[name="mode"][value="${modeQ}"]`, form).checked = true;
    if (q.get('len') !== null) len.value = q.get('len');
    if (q.get('days') !== null) days.value = q.get('days');
    const run = (fromSubmit) => {
      const mode = $('input[name="mode"]:checked', form).value;
      days.disabled = mode === 'single';
      daysL.textContent = mode === 'moor' ? 'Nights moored' : mode === 'return' ? 'Days until you come back' : 'Days (not used for a single passage)';
      const [l, el] = num(len, 6, 25, 1, 'a length');
      let d = 1, ed = '';
      if (mode !== 'single') [d, ed] = num(days, 1, 28, 0, 'a whole number');
      showErr(len, el); showErr(days, ed);
      if (el || ed) {
        out.innerHTML = '<p>Fix the fields marked Error to see the toll.</p>';
        tbody.innerHTML = ''; total.textContent = '';
        if (fromSubmit) firstInvalid(form);
        return;
      }
      const r = C.toll({ len: l, mode, days: d });
      out.innerHTML = `<p class="big">${C.gbp(r.total)}</p>`;
      tbody.innerHTML = r.lines.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td class="num">${v < 0 ? '−' + C.gbp(-v).slice(1) : C.gbp(v).slice(1)}</td></tr>`).join('');
      total.textContent = C.gbp(r.total).slice(1);
      setQuery({ len: l.toFixed(1), mode, days: mode === 'single' ? '' : d });
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); run(true); });
    $$('input', form).forEach((i) => i.addEventListener('change', () => run(false)));
    run(false);
  }

  // ---------- stoppages ----------
  if (page === 'stoppages') {
    const form = $('#stop-form'), date = $('#stop-date'), out = $('#stop-out');
    const days = $$('.day');
    if (q.get('date') !== null) date.value = q.get('date');
    const run = (fromSubmit) => {
      const v = date.value.trim();
      days.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.date === v)));
      if (!v) { showErr(date, 'Enter a date.'); out.innerHTML = '<p>Choose a date, or a day in the calendar.</p>'; if (fromSubmit) date.focus(); return; }
      if (!C.isIso(v)) { showErr(date, 'Enter a date as year-month-day, for example 2026-10-19.'); out.innerHTML = ''; if (fromSubmit) date.focus(); return; }
      showErr(date, '');
      setQuery({ date: v === C.NOW.iso ? '' : v });
      if (v < C.STOP_RANGE[0] || v > C.STOP_RANGE[1]) {
        out.innerHTML = `<p class="big">${esc(C.dateLong(v))}: not on this list.</p><p>The list covers ${C.dateLong(C.STOP_RANGE[0])} to ${C.dateLong(C.STOP_RANGE[1])}. Email the keepers for later dates.</p>`;
        return;
      }
      const list = C.stoppagesOn(v, D.STOPPAGES);
      const restricted = v === C.NOW.iso ? D.LOCKS.filter((L) => L.status === 'restricted') : [];
      if (!list.length) {
        out.innerHTML = `<p class="big">${esc(C.dateLong(v))}: no locks closed.</p>${restricted.length ? `<p>Restricted today: ${restricted.map((L) => `Lock ${L.n} (${esc(L.restriction.short.toLowerCase())})`).join('; ')}.</p>` : ''}`;
        return;
      }
      const shut = [...new Set(list.flatMap((s) => s.locks))].sort((a, b) => a - b);
      out.innerHTML = `<p class="big">${esc(C.dateLong(v))}: ${shut.length === D.LOCKS.length ? 'whole flight closed' : `${shut.length === 1 ? 'Lock' : 'Locks'} ${C.listAnd(shut.map(String))} closed`}.</p>`
        + `<ul class="out-list">${list.map((s) => `<li><span class="st st-closed">Closed</span> ${s.locks.length === D.LOCKS.length ? 'All locks' : (s.locks.length === 1 ? 'Lock ' : 'Locks ') + C.listAnd(s.locks.map(String))}. ${esc(s.reason)}. ${C.span(s.from, s.to)}, reopens ${esc(C.dateLong(C.addDays(s.to, 1)))}.</li>`).join('')}</ul>`;
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); run(true); });
    date.addEventListener('change', () => run(false));
    days.forEach((b) => b.addEventListener('click', () => { date.value = b.dataset.date; run(false); }));
    run(false);
  }

  // ---------- keepers ----------
  if (page === 'keepers') {
    const form = $('#keep-form'), season = $('#keep-season'), day = $('#keep-day'), at = $('#keep-at'), out = $('#keep-out');
    if (q.get('season') && D.KEEPERS[q.get('season')]) season.value = q.get('season');
    if (q.get('day') && C.DAYS.includes(q.get('day'))) day.value = q.get('day');
    if (q.get('at') !== null) at.value = q.get('at');
    const run = (fromSubmit) => {
      const t = C.parseHM(at.value);
      if (t === null) { showErr(at, 'Enter a time, for example 14:30.'); out.innerHTML = '<p>Enter a time to check.</p>'; if (fromSubmit) at.focus(); return; }
      showErr(at, '');
      const table = D.KEEPERS[season.value].table;
      const k = C.keeperAt(table, day.value, t);
      const line = C.keeperLine(table, day.value, t);
      out.innerHTML = `<p class="big">${esc(line)}.</p><p>${esc(C.dayName(day.value))} ${C.hm(t)}, timetable ${esc(D.KEEPERS[season.value].label.toLowerCase())}. ${k.on ? 'The flight is open.' : 'The flight is chained.'}</p>`;
      setQuery({ season: season.value === 'summer' ? '' : season.value, day: day.value === C.NOW.day ? '' : day.value, at: t === C.NOW.min ? '' : C.hm(t) });
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); run(true); });
    [season, day, at].forEach((i) => i.addEventListener('change', () => run(false)));
    run(false);
  }
})();
