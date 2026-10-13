// Marrowby Record Office — every feature on the site. Nothing leaves the browser tab.
(function () {
  'use strict';
  const D = window.MRO, C = window.MROC;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REL = document.body.dataset.rel || '';
  const ITEM = Object.fromEntries(D.ITEMS.map((i) => [i.ref, i]));
  const MAX = 6;
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- storage: this tab only, memory if blocked ----------
  const mem = {};
  const store = {
    get(k, d) { try { const v = sessionStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return k in mem ? mem[k] : d; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch { mem[k] = v; } },
    del(k) { try { sessionStorage.removeItem(k); } catch { delete mem[k]; } },
  };

  const pullLabel = (p) => (p.day !== C.NOW.iso ? `${C.dateLabel(p.day)}, ` : '') + C.hhmm(p.round);
  const arriveLabel = (p) => (p.day !== C.NOW.iso ? `${C.dateLabel(p.day)}, ` : '') + C.hhmm(p.arrive);
  const stampDown = (el) => { el.hidden = false; el.classList.remove('is-down'); if (!reduce()) { void el.offsetWidth; el.classList.add('is-down'); } };

  // ---------- slip ----------
  const slip = {
    list() { return store.get('mro-slip', []).filter((r) => ITEM[r]); },
    save(l) { store.set('mro-slip', l); store.del('mro-slip-confirmed'); slip.paint(); },
    add(ref) {
      const l = slip.list(), it = ITEM[ref];
      if (l.includes(ref)) return { ok: true };
      if (it.closedUntil) return { ok: false, msg: `${ref} is closed until ${it.closedUntil}.` };
      if (l.length >= MAX) return { ok: false, msg: `Slip full: ${MAX} of ${MAX} items. Remove one to add another.` };
      l.push(ref); slip.save(l);
      return { ok: true, msg: `${ref} added. ${l.length} of ${MAX} on the slip.` };
    },
    remove(ref) { slip.save(slip.list().filter((r) => r !== ref)); },
    paint() {
      const l = slip.list();
      $$('[data-slip-count]').forEach((n) => { n.textContent = `${l.length}/${MAX}`; });
      $$('[data-slip-list]').forEach((ol) => { ol.innerHTML = l.map((r) => `<li>${r}<br>${ITEM[r].title}</li>`).join(''); });
      $$('[data-slip-empty]').forEach((p) => { p.hidden = l.length > 0; });
      $$('[data-add]').forEach((b) => {
        const on = l.includes(b.dataset.add);
        if (ITEM[b.dataset.add].closedUntil) return;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.textContent = on ? 'On slip' : 'Add to slip';
      });
    },
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b || b.disabled) return;
    const ref = b.dataset.add;
    const msgEl = $('[data-slip-msg]');
    if (slip.list().includes(ref)) { slip.remove(ref); if (msgEl) msgEl.textContent = `${ref} removed.`; return; }
    const r = slip.add(ref);
    if (msgEl && r.msg) msgEl.textContent = r.msg;
  });
  slip.paint();

  // ---------- index sheet (menu) ----------
  {
    const btn = $('.index-btn'), sheet = $('#index-sheet');
    const close = () => { sheet.hidden = true; btn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('is-locked'); btn.focus(); };
    btn.addEventListener('click', () => {
      sheet.hidden = false; btn.setAttribute('aria-expanded', 'true'); document.body.classList.add('is-locked');
      $('.ix-close', sheet).focus();
    });
    $('.ix-close', sheet).addEventListener('click', close);
    sheet.addEventListener('click', (e) => { if (e.target === sheet) close(); });
    document.addEventListener('keydown', (e) => {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') {
        const f = $$('button, a[href]', sheet), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const setUrl = (obj) => {
    const u = new URL(location.href);
    u.search = '';
    for (const [k, v] of Object.entries(obj)) if (v !== '' && v != null) u.searchParams.set(k, v);
    history.replaceState(null, '', u);
  };
  const setErr = (input, errEl, msg) => {
    errEl.textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  };

  // ---------- series: Scope / Items / Access ----------
  if (page === 'series') {
    const tabs = $$('[role="tab"]');
    const select = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        $('#' + x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
      setUrl({ tab: t.id.slice(2) });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
    const want = location.hash.startsWith('#item-') ? 'items' : params.get('tab');
    const t = tabs.find((x) => x.id === 't-' + want);
    if (t) {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
      if (location.hash) { const row = $(location.hash); if (row) row.scrollIntoView({ block: 'center' }); }
    }
  }

  // ---------- catalogue ----------
  if (page === 'catalogue') {
    const MIN = 1538, MAXY = 1998;
    const q = $('#q'), from = $('#from'), to = $('#to'), closed = $('#closed'), sort = $('#sort');
    const chips = $$('.chip'), list = $('#refs'), rows = $$('.ref-row'), count = $('#count'), empty = $('#empty');
    const last = { from: MIN, to: MAXY };
    const yr = (s) => (/^\d{4}$/.test(s.trim()) ? +s : NaN);
    const apply = () => {
      const needle = q.value.trim().toLowerCase();
      const codes = chips.filter((c) => c.getAttribute('aria-pressed') === 'true').map((c) => c.dataset.series);
      const vis = rows.filter((r) => {
        const okQ = !needle || r.dataset.title.includes(needle) || r.dataset.ref.toLowerCase().includes(needle);
        const okS = !codes.length || codes.includes(r.dataset.code);
        const okY = +r.dataset.to >= last.from && +r.dataset.from <= last.to;
        const okC = !closed.checked || r.dataset.closed === '0';
        const show = okQ && okS && okY && okC;
        r.hidden = !show;
        return show;
      });
      const key = { ref: (r) => r.dataset.ref, old: (r) => String(r.dataset.from).padStart(4, '0') + r.dataset.ref, new: (r) => String(9999 - r.dataset.to).padStart(4, '0') + r.dataset.ref }[sort.value];
      [...rows].sort((a, b) => key(a).localeCompare(key(b))).forEach((r) => list.appendChild(r));
      count.textContent = `${vis.length} of ${rows.length} items`;
      empty.hidden = vis.length > 0;
      setUrl({ q: q.value.trim(), series: codes.join(','), from: last.from !== MIN ? last.from : '', to: last.to !== MAXY ? last.to : '', closed: closed.checked ? '0' : '', sort: sort.value !== 'ref' ? sort.value : '' });
    };
    const year = (input, which) => {
      const v = yr(input.value), err = $('#' + input.id + '-err');
      let msg = '';
      if (isNaN(v) || v < MIN || v > MAXY) msg = `Enter a year from ${MIN} to ${MAXY}.`;
      else if (which === 'from' && v > last.to) msg = `From year is after the To year (${last.to}).`;
      else if (which === 'to' && v < last.from) msg = `To year is before the From year (${last.from}).`;
      setErr(input, err, msg);
      if (msg) { input.value = last[which]; return; }
      last[which] = v; apply();
    };
    // restore from the address
    q.value = params.get('q') || '';
    const ps = (params.get('series') || '').split(',');
    chips.forEach((c) => c.setAttribute('aria-pressed', ps.includes(c.dataset.series) ? 'true' : 'false'));
    const pf = yr(params.get('from') || ''), pt = yr(params.get('to') || '');
    if (pf >= MIN && pf <= MAXY) last.from = pf;
    if (pt >= MIN && pt <= MAXY && pt >= last.from) last.to = pt;
    from.value = last.from; to.value = last.to;
    closed.checked = params.get('closed') === '0';
    if (['ref', 'old', 'new'].includes(params.get('sort'))) sort.value = params.get('sort');

    q.addEventListener('input', apply);
    chips.forEach((c) => c.addEventListener('click', () => { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); apply(); }));
    from.addEventListener('change', () => year(from, 'from'));
    to.addEventListener('change', () => year(to, 'to'));
    [from, to].forEach((i) => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); i.dispatchEvent(new Event('change')); } }));
    closed.addEventListener('change', apply);
    sort.addEventListener('change', apply);
    $('#filters').addEventListener('submit', (e) => e.preventDefault());
    $('#clear').addEventListener('click', () => {
      q.value = ''; chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
      last.from = MIN; last.to = MAXY; from.value = MIN; to.value = MAXY; closed.checked = false; sort.value = 'ref';
      [from, to].forEach((i) => setErr(i, $('#' + i.id + '-err'), ''));
      apply(); q.focus();
    });
    apply();
  }

  // ---------- book ----------
  if (page === 'book') {
    const form = $('#book'), date = $('#b-date'), full = $('#full'), confirm = $('#confirm');
    const maxIso = C.addDays(C.NOW.iso, C.BOOK_DAYS);
    const booking = () => store.get('mro-booking', null);
    const slotV = () => (form.querySelector('[name="slot"]:checked') || {}).value;
    const free = (iso, s) => { const n = C.desksFree(iso, s); const b = booking(); return n == null ? null : Math.max(0, n - (b && b.date === iso && b.slot === s ? 1 : 0)); };
    const dateMsg = (iso) => {
      if (!iso) return 'Enter a date.';
      if (!C.validIso(iso)) return 'Enter a date as day, month and year.';
      if (iso < C.NOW.iso || iso > maxIso) return `Choose a date from ${C.dateLabel(C.NOW.iso)} to ${C.dateLabel(maxIso)} ${maxIso.slice(0, 4)}.`;
      const c = C.closedReason(iso);
      return c ? `${c}. Choose another date.` : '';
    };
    const update = () => {
      const iso = date.value, msg = dateMsg(iso);
      setErr(date, $('#b-date-err'), msg);
      C.SLOTS.forEach((s) => {
        const el = $(`[data-free="${s.key}"]`);
        const n = msg ? null : free(iso, s.key);
        el.textContent = n == null ? '' : n === 0 ? 'Full' : `${n} of ${C.DESKS} free`;
        el.classList.toggle('is-closed', n === 0);
      });
      const n = msg ? null : free(iso, slotV());
      full.hidden = n !== 0;
      $('#waitlist-out').textContent = '';
    };
    const showConfirm = (b, animate) => {
      form.hidden = true; confirm.hidden = false;
      $('#stamp').textContent = b.no;
      const slot = C.SLOTS.find((s) => s.key === b.slot);
      $('#confirm-fields').innerHTML = [['Booking', b.no], ['Date', `${C.dateLabel(b.date)} ${b.date.slice(0, 4)}`], ['Session', `${slot.label} ${slot.time}`], ['Desk', String(b.desk)], ['Name', b.name], ['Reason', b.reason]]
        .map(([l, v]) => `<div class="f"><span class="f-l">${l}</span><span class="f-v"></span></div>`).join('');
      const vals = [b.no, `${C.dateLabel(b.date)} ${b.date.slice(0, 4)}`, `${slot.label} ${slot.time}`, String(b.desk), b.name, b.reason];
      $$('#confirm-fields .f-v').forEach((n, i) => { n.textContent = vals[i]; });
      if (animate) { stampDown($('#stamp')); confirm.focus(); }
    };
    date.addEventListener('input', update);
    date.addEventListener('change', update);
    $$('[name="slot"]', form).forEach((r) => r.addEventListener('change', update));
    $$('[data-pick]').forEach((b) => b.addEventListener('click', () => {
      if (!form.hidden) { date.value = b.dataset.pick; update(); date.focus(); }
    }));
    $('#waitlist').addEventListener('click', () => {
      const s = C.SLOTS.find((x) => x.key === slotV());
      const pos = (date.value.split('-').reduce((a, n) => a + +n, 0) % 4) + 1;
      $('#waitlist-out').textContent = `On the waiting list for ${C.dateLabel(date.value)}, ${s.label.toLowerCase()}: position ${pos}. Kept in this tab only.`;
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      update();
      const checks = [
        [date, $('#b-date-err'), dateMsg(date.value) || (free(date.value, slotV()) === 0 ? 'This session is full. Choose another session or date, or join the waiting list.' : '')],
        [$('#b-name'), $('#b-name-err'), $('#b-name').value.trim().length < 2 ? 'Enter your name.' : ''],
        [$('#b-email'), $('#b-email-err'), !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#b-email').value.trim()) ? 'Enter an email address like name@example.com.' : ''],
        [$('#b-reason'), $('#b-reason-err'), !$('#b-reason').value ? 'Choose a reason.' : ''],
      ];
      checks.forEach(([i, el, m]) => setErr(i, el, m));
      const bad = checks.find(([, , m]) => m);
      if (bad) { bad[0].focus(); return; }
      const n = C.desksFree(date.value, slotV());
      const desk = C.DESKS - n + 1;
      const b = { date: date.value, slot: slotV(), name: $('#b-name').value.trim(), email: $('#b-email').value.trim(), reason: $('#b-reason').value, desk, no: `MRO-${date.value.slice(2).replace(/-/g, '')}-${String(desk).padStart(2, '0')}` };
      store.set('mro-booking', b);
      showConfirm(b, true);
    });
    $('#cancel').addEventListener('click', () => {
      store.del('mro-booking');
      confirm.hidden = true; form.hidden = false; $('#stamp').classList.remove('is-down');
      update(); date.focus();
    });
    const b = booking();
    if (b) showConfirm(b, false); else update();
  }

  // ---------- pulls ----------
  if (page === 'pulls') {
    const form = $('#pullform'), t = $('#p-time');
    const out = (cls, v) => { $(`.${cls} .f-v`).textContent = v; };
    const calc = () => {
      const zone = form.querySelector('[name="zone"]:checked').value;
      const m = C.parseTime(t.value);
      setErr(t, $('#p-time-err'), m == null ? 'Enter a time as HH:MM, 00:00 to 23:59.' : '');
      if (m == null) { ['r-round', 'r-cut', 'r-arrive'].forEach((c) => out(c, '—')); $('#pull-note').textContent = ''; return; }
      const p = C.pull(zone, m);
      out('r-round', p.offsite ? 'Off-site delivery' : pullLabel(p));
      out('r-cut', p.offsite ? '16:30 the day before' : C.hhmm(p.cutoff));
      out('r-arrive', arriveLabel(p));
      $('#pull-note').textContent = p.offsite
        ? `Held off-site. Available from 10:00 next open day, ${C.dateLabel(p.day)}.`
        : p.moved ? `After 14:45 the order moves to the first pull of the next open day, ${C.dateLabel(p.day)}.`
        : p.missed ? `The ${C.hhmm(p.missed)} pull closed at ${C.hhmm(p.missed - C.CUTOFF)}. This order goes with the next pull.`
        : m < C.OPEN.from ? 'Ordered before opening. It goes with the first pull.' : '';
      setUrl({ zone: zone !== 'a' ? zone : '', t: t.value.trim() !== C.hhmm(C.NOW.min) ? t.value.trim() : '' });
    };
    const z = params.get('zone');
    const zr = form.querySelector(`[name="zone"][value="${z}"]`);
    if (zr) zr.checked = true;
    if (params.get('t')) t.value = params.get('t');
    form.addEventListener('change', calc);
    t.addEventListener('input', () => { if (C.parseTime(t.value) != null || !t.value) calc(); });
    t.addEventListener('blur', calc);
    form.addEventListener('submit', (e) => { e.preventDefault(); calc(); });
    calc();
  }

  // ---------- copies ----------
  if (page === 'copies') {
    const form = $('#copyform');
    const v = (n) => (form.querySelector(`[name="${n}"]:checked`) || {}).value;
    const calc = () => {
      const method = v('method');
      $$('[data-for="sheet"]', form).forEach((n) => { n.hidden = method === 'permit'; });
      const sheetsIn = $('#c-sheets'), raw = sheetsIn.value.trim();
      const sheets = /^\d+$/.test(raw) ? +raw : NaN;
      const refRaw = $('#c-ref').value.trim().toUpperCase().replace(/\s+/g, '');
      const ref = refRaw && !refRaw.startsWith('MRO/') ? 'MRO/' + refRaw : refRaw;
      const it = ref ? ITEM[ref] : null;
      let block = '';
      $('#c-ref-out').textContent = !ref ? '' : !it ? 'No item with that reference in the online list. Copies are priced the same.' : it.closedUntil ? `${it.ref}: closed until ${it.closedUntil}. No copies.` : it.fragile ? `${it.ref}: fragile. No copies or photographs.` : `${it.ref}: ${it.title}, ${it.from}–${it.to}. Copies allowed.`;
      if (it && (it.fragile || it.closedUntil)) block = it.fragile ? 'This item is too fragile to copy or photograph.' : `This item is closed until ${it.closedUntil}.`;
      const q = C.copyQuote({ size: v('size'), method, sheets, delivery: v('delivery') });
      setErr(sheetsIn, $('#c-sheets-err'), !q.ok && q.field === 'sheets' ? q.error : '');
      const err = block || (!q.ok ? q.error : '');
      $('#quote-err').textContent = err;
      if (err) { $('#quote-lines').innerHTML = ''; $('#quote-total').textContent = '—'; $('#quote-days').textContent = '—'; return; }
      $('#quote-lines').innerHTML = q.lines.map(() => '<tr><th scope="row"></th><td></td></tr>').join('');
      $$('#quote-lines tr').forEach((tr, i) => { tr.cells[0].textContent = q.lines[i][0]; tr.cells[1].textContent = C.money(q.lines[i][1]); });
      $('#quote-total').textContent = C.money(q.total);
      $('#quote-days').textContent = q.days === 0 ? 'Same day, on your own camera' : `${q.days} working days`;
    };
    form.addEventListener('input', calc);
    form.addEventListener('change', calc);
    form.addEventListener('submit', (e) => { e.preventDefault(); calc(); });
    calc();
  }

  // ---------- deposit ----------
  if (page === 'deposit') {
    const form = $('#depform');
    const out = (cls, v, bad) => { const n = $(`.${cls} .f-v`); n.textContent = v; n.classList.toggle('is-closed', !!bad); };
    const calc = () => {
      const latestIn = $('#d-latest'), amountIn = $('#d-amount');
      const latest = /^\d+$/.test(latestIn.value.trim()) ? +latestIn.value.trim() : NaN;
      const amount = parseFloat(amountIn.value.replace(',', '.'));
      const r = C.depositCheck({ latest, amount, unit: form.querySelector('[name="unit"]:checked').value, personal: form.querySelector('[name="personal"]:checked').value === 'yes' });
      setErr(latestIn, $('#d-latest-err'), !r.ok && r.field === 'latest' ? r.error : '');
      setErr(amountIn, $('#d-amount-err'), !r.ok && r.field === 'amount' ? r.error : '');
      if (!r.ok) { ['r-dec', 'r-len', 'r-fee', 'r-open'].forEach((c) => out(c, '—')); $('#dep-note').textContent = ''; return; }
      out('r-dec', !r.accept ? 'Not yet' : r.review ? 'After review' : 'Can be accepted', !r.accept);
      out('r-len', `${r.metres.toFixed(1)} m`);
      out('r-fee', C.money(r.fee));
      out('r-open', r.review ? String(Math.max(r.openYear, 2026)) : 'Once listed');
      const notes = [];
      if (!r.accept) notes.push(`The newest paper is ${r.age} years old. The office can take it from ${r.openYear}.`);
      if (r.accept && r.review) notes.push('Papers naming living people are read by staff before they are accepted. Allow six to eight weeks.');
      if (r.large) notes.push(`Over ${C.DEPOSIT.maxMetres} m: a member of staff visits first to see the papers.`);
      $('#dep-note').textContent = notes.join(' ');
    };
    form.addEventListener('input', calc);
    form.addEventListener('change', calc);
    form.addEventListener('submit', (e) => { e.preventDefault(); calc(); });
    calc();
  }

  // ---------- slip page ----------
  if (page === 'slip') {
    const body = $('#slip-rows'), msg = $('#slip-msg'), stamp = $('#slip-stamp');
    const render = (focusRef) => {
      const l = slip.list();
      const rounds = C.assignRounds(l.map((r) => ITEM[r].zone));
      body.innerHTML = l.map((r, i) => {
        const it = ITEM[r], p = rounds[i];
        return `<tr><th scope="row" class="mono-ref">${r}</th><td></td><td>${p.zone}</td><td>${p.offsite ? 'Off-site delivery' : pullLabel(p)}${p.bumped ? '<br><span class="sub">pull full, moved</span>' : ''}</td><td>${arriveLabel(p)}</td><td><button class="btn" type="button" data-remove="${r}">Remove<span class="vh"> ${r}</span></button></td></tr>`;
      }).join('');
      $$('tr', body).forEach((tr, i) => { tr.cells[1].textContent = `${ITEM[l[i]].title}, ${ITEM[l[i]].from}–${ITEM[l[i]].to}`; });
      $('#slip-empty').hidden = l.length > 0;
      $('.tbl-slip').closest('.tbl-box').hidden = l.length === 0;
      $('#slip-actions').hidden = l.length === 0;
      const done = store.get('mro-slip-confirmed', null);
      stamp.hidden = !done;
      if (done) stamp.textContent = done;
      if (focusRef !== undefined) {
        const next = $(`[data-remove="${focusRef}"]`) || $('[data-remove]');
        (next || $('#slip-empty .btn')).focus();
      }
    };
    body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-remove]');
      if (!b) return;
      const l = slip.list(), i = l.indexOf(b.dataset.remove);
      slip.remove(b.dataset.remove);
      msg.textContent = `${b.dataset.remove} removed. ${l.length - 1} of ${MAX} on the slip.`;
      render(slip.list()[i] || slip.list()[i - 1] || null);
    });
    $('#slip-confirm').addEventListener('click', () => {
      const l = slip.list();
      if (!l.length) return;
      const no = `Slip ${C.NOW.iso.slice(2).replace(/-/g, '')}-${String(l.length * 7 + 11).padStart(2, '0')} received`;
      store.set('mro-slip-confirmed', no);
      stamp.textContent = no;
      stampDown(stamp);
      msg.textContent = `${l.length} items ordered. Pull times are shown against each item.`;
    });
    $('#slip-print').addEventListener('click', () => window.print());
    $('#slip-clear').addEventListener('click', () => { slip.save([]); msg.textContent = 'Slip cleared.'; render(null); });
    render();
  }
})();
