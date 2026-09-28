/* CORRIDOR — behaviour only. No reveal animations, no scroll listeners.
   Each block runs only if its markup is on the page. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const json = (id) => { const n = document.getElementById(id); return n ? JSON.parse(n.textContent) : null; };
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const hhmm = (m) => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  const money = (n) => '€' + (Number.isInteger(n) ? n : n.toFixed(2));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // Local time at the stations (all CET/CEST)
  function cet() {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { min: +p.hour * 60 + +p.minute, wd: p.weekday, label: `${p.weekday} ${p.day} ${p.month}` };
  }
  const isWeekend = (wd) => wd === 'Fri' || wd === 'Sat' || wd === 'Sun';

  /* ── mobile menu, scroll lock ─────────────────────────────── */
  const burger = $('.burger');
  const drawer = $('#drawer');
  if (burger && drawer) {
    const set = (open) => {
      drawer.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      document.documentElement.classList.toggle('lock', open);
    };
    burger.addEventListener('click', () => set(drawer.hidden));
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.hidden) { set(false); burger.focus(); }
    });
    matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) set(false); });
  }

  /* ── SMIL icons: stop under reduced motion ────────────────── */
  const smil = () => $$('svg.ico').forEach((s) => {
    if (reduced.matches) { s.pauseAnimations(); s.setCurrentTime(0); } else s.unpauseAnimations();
  });
  smil();
  reduced.addEventListener('change', smil);

  /* ── home: tonight board ──────────────────────────────────── */
  const board = $('#board');
  if (board) {
    const rows = $$('.b-row', board);
    const tick = () => {
      const now = cet();
      const we = isWeekend(now.wd);
      $('#today').textContent = now.label + ' · ' + hhmm(now.min);
      let next = null;
      rows.forEach((row) => {
        const dep = toMin(row.dataset.dep) + (we ? +row.dataset.wk : 0);
        const arr = toMin(row.dataset.arr) + (we ? +row.dataset.wk : 0);
        $('.b-dep', row).textContent = hhmm(dep);
        $('.b-arr', row).textContent = hhmm(arr);
        row.dataset.m = dep;
        row.classList.remove('gone');
        const st = $('.b-st', row);
        st.classList.remove('now');
        // Departures are all in the evening; before 12:00 the evening is still ahead
        if (now.min >= 720 && dep <= now.min) { row.classList.add('gone'); st.textContent = 'Departed'; } else st.textContent = '';
        if (!row.classList.contains('gone') && (!next || dep < +next.dataset.m)) next = row;
      });
      const target = next || rows[0];
      const left = ((+target.dataset.m - now.min) + 1440) % 1440;
      const st = $('.b-st', target);
      st.classList.add('now');
      st.textContent = left < 1 ? 'Departing' : `Departs in ${left >= 60 ? Math.floor(left / 60) + ' h ' : ''}${left % 60} min`;
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ── routes: departure city filter ────────────────────────── */
  const list = $('#route-list');
  if (list) {
    const chips = $$('.chip');
    const items = $$('.rrow', list);
    const apply = (city) => {
      let n = 0;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.city === city)));
      items.forEach((li) => {
        const hit = JSON.parse(li.dataset.board).find(([k]) => k === city);
        const show = city === 'all' || !!hit;
        li.hidden = !show;
        if (show) n++;
        const dep = $('.r-dep', li);
        if (!li.dataset.dep0) li.dataset.dep0 = dep.textContent;
        // Show the boarding time at the chosen city, not only at the origin
        if (hit && hit !== JSON.parse(li.dataset.board)[0]) dep.textContent = hit[1];
        else dep.textContent = li.dataset.dep0;
      });
      const label = chips.find((c) => c.dataset.city === city).textContent;
      $('#count').textContent = `${n} route${n === 1 ? '' : 's'}${city === 'all' ? '' : ' from ' + label + ', times at ' + label}`;
      $('#empty').hidden = n > 0;
      const u = new URL(location.href);
      if (city === 'all') u.searchParams.delete('from'); else u.searchParams.set('from', city);
      try { history.replaceState(null, '', u); } catch { /* file:// in some browsers */ }
    };
    chips.forEach((c) => c.addEventListener('click', () => apply(c.dataset.city)));
    const q = new URLSearchParams(location.search).get('from');
    if (q && chips.some((c) => c.dataset.city === q)) apply(q);
  }

  /* ── route page: station modal ────────────────────────────── */
  const dlg = $('#station');
  if (dlg) {
    const data = json('st-data');
    let opener = null;
    const row = (k, v, mono) => `<div><dt>${k}</dt><dd${mono ? ' class="mono"' : ''}>${v}</dd></div>`;
    $$('.s-name').forEach((b) => b.addEventListener('click', () => {
      const s = data.stations[+b.dataset.st];
      opener = b;
      $('#st-name').textContent = s.name;
      $('#st-dl').innerHTML = row('Platform', s.pl, true)
        + row(`CR ${data.no}`, (s.last ? 'arr ' : 'dep ') + s.time, true)
        + row(`CR ${data.ret}`, (s.first ? 'arr ' : 'dep ') + s.back, true)
        + row('Step-free', s.stepfree ? 'Yes, lift' : 'No, stairs only')
        + row('Local', s.local)
        + (s.first ? row('Doors', '30 min before') : '')
        + (toMin(s.time) < 360 ? row('Night stop', 'Doors on request') : '');
      dlg.showModal();
    }));
    const close = () => dlg.close();
    $('[data-close]', dlg).addEventListener('click', close);
    // Backdrop click: the dialog box itself has no padding, so a hit on <dialog> is outside the content
    dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
    dlg.addEventListener('close', () => { if (opener) opener.focus(); });
  }

  /* ── route page: dates in the availability table ─────────── */
  const nights = $$('[data-night]');
  if (nights.length) {
    const fmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/Berlin' });
    nights.forEach((th) => { th.textContent = fmt.format(new Date(Date.now() + (+th.dataset.night) * 864e5)); });
  }

  /* ── cabins: tabs ─────────────────────────────────────────── */
  const tablist = $('[role="tablist"]');
  if (tablist) {
    const tabs = $$('[role="tab"]', tablist);
    const select = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.at(-1), true); }
      });
    });
  }

  /* ── fares: calculator ────────────────────────────────────── */
  const calc = $('#calc');
  if (calc) {
    const { fares, cabins } = json('fare-data');
    const q = new URLSearchParams(location.search).get('route');
    if (q && fares[q]) $('#c-route').value = q;
    const run = () => {
      const f = fares[$('#c-route').value];
      const [key, name, cap] = cabins.find(([k]) => k === $('#c-cabin').value);
      const ad = +$('#c-ad').value, ch = +$('#c-ch').value, card = +$('#c-card').value;
      const unit = f[key];
      const lines = [[`${ad} adult${ad > 1 ? 's' : ''} × ${money(unit)}`, ad * unit]];
      if (ch) lines.push([`${ch} child${ch > 1 ? 'ren' : ''} × ${money(unit / 2)}`, ch * unit / 2]);
      const sub = lines.reduce((a, [, v]) => a + v, 0);
      if (card) lines.push([`Card −${card}%`, -Math.round(sub * card) / 100]);
      const total = lines.reduce((a, [, v]) => a + v, 0);
      const rooms = Math.ceil((ad + ch) / cap);
      $('#c-total').textContent = money(Math.round(total * 100) / 100);
      $('#c-lines').innerHTML = lines.map(([k, v]) => `<li><span>${k}</span><span>${v < 0 ? '−' + money(-v) : money(v)}</span></li>`).join('')
        + `<li><span>${name}</span><span>${rooms} compartment${rooms > 1 ? 's' : ''}</span></li>`;
    };
    calc.addEventListener('input', run);
    calc.addEventListener('change', run);
    calc.addEventListener('submit', (e) => e.preventDefault());
    run();
  }

  /* ── timetable: Mon–Thu / Fri–Sun ─────────────────────────── */
  const tts = $('.tts');
  if (tts) {
    const btns = $$('.seg button');
    const show = (days) => {
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.days === days)));
      tts.dataset.days = days;
      $$('td[data-wd]', tts).forEach((td) => { td.textContent = td.dataset[days]; });
      const n = $$('td.diff', tts).length;
      $('#tt-note').textContent = days === 'wd'
        ? 'Mon–Thu. ↓ read down, ↑ read up.'
        : `Fri–Sun. ${n} times differ from Mon–Thu, underlined.`;
    };
    btns.forEach((b) => b.addEventListener('click', () => show(b.dataset.days)));
    show(isWeekend(cet().wd) ? 'we' : 'wd');
  }

  /* ── booking: 3 steps ─────────────────────────────────────── */
  const form = $('#book');
  if (form) {
    const D = json('book-data');
    const steps = $$('fieldset.step', form);
    const marks = $$('.steps li', form);
    const back = $('#b-back'), next = $('#b-next'), status = $('#b-status');
    const date = $('#b-date');
    let cur = 1;

    // Next 90 nights as options: no native date picker, so no OS-locale placeholder
    const pad = (n) => String(n).padStart(2, '0');
    const dayFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    for (let i = 0; i < 90; i++) {
      const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i);
      date.add(new Option(dayFmt.format(d) + (i === 0 ? ', tonight' : ''), d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())));
    }

    const q = new URLSearchParams(location.search).get('train');
    if (q && D.trains[q]) $('#b-train').value = q;

    const err = (id, msg) => {
      const el = document.getElementById('e-' + id);
      el.textContent = msg || '';
      const field = { train: '#b-train', date: '#b-date', name: '#b-name', mail: '#b-mail', ok: '#b-ok', pax: '#b-ad' }[id];
      if (field) $(field).setAttribute('aria-invalid', String(!!msg));
      if (id === 'cabin') $$('input[name=cabin]').forEach((r) => r.setAttribute('aria-invalid', String(!!msg)));
      return !msg;
    };

    const cabin = () => { const r = $('input[name=cabin]:checked', form); return r ? D.cabins.find(([k]) => k === r.value) : null; };

    const total = () => {
      const t = D.trains[$('#b-train').value], c = cabin();
      if (!t || !c) return null;
      const unit = D.fares[t.slug][c[0]];
      return (+$('#b-ad').value) * unit + (+$('#b-ch').value) * unit / 2;
    };

    const paint = () => {
      const t = D.trains[$('#b-train').value];
      $('#t-train').textContent = t ? 'CR ' + $('#b-train').value : '–';
      // Fri–Sun departures run on the weekend timetable
      const wd = date.value ? new Date(date.value + 'T12:00').getDay() : 1;
      const sh = t && (wd === 5 || wd === 6 || wd === 0) ? t.wk : 0;
      $('#t-dep').innerHTML = t ? `<span class="mono">${hhmm(toMin(t.dep) + sh)}</span> ${t.fromSt}` : '–';
      $('#t-arr').innerHTML = t ? `<span class="mono">${hhmm(toMin(t.arr) + sh)}</span> ${t.toSt}` : '–';
      $('#t-date').textContent = date.value
        ? new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date.value + 'T12:00'))
        : '–';
      $$('[data-price]', form).forEach((s) => { s.textContent = t ? money(D.fares[t.slug][s.dataset.price]) : ''; });
      const c = cabin();
      $('#t-cabin').textContent = c ? c[1] : '–';
      const ad = +$('#b-ad').value, ch = +$('#b-ch').value;
      $('#t-pax').textContent = `${ad} adult${ad === 1 ? '' : 's'}` + (ch ? `, ${ch} child${ch > 1 ? 'ren' : ''}` : '');
      const tot = total();
      $('#t-total').textContent = tot == null ? '–' : money(tot);
    };

    const check = (n) => {
      if (n === 1) {
        const a = err('train', $('#b-train').value ? '' : 'Choose a train');
        let m = '';
        if (!date.value) m = 'Choose a travel date';
        return [a, err('date', m)].every(Boolean);
      }
      if (n === 2) {
        const a = err('cabin', cabin() ? '' : 'Choose a cabin');
        const ad = +$('#b-ad').value, ch = +$('#b-ch').value;
        let m = '';
        if (ad < 1) m = 'At least one adult';
        else if (ad + ch > 6) m = 'Up to 6 passengers per booking';
        return [a, err('pax', m)].every(Boolean);
      }
      const a = err('name', $('#b-name').value.trim().length > 1 ? '' : 'Enter the lead passenger’s name');
      const v = $('#b-mail').value.trim();
      const b = err('mail', !v ? 'Enter an email address' : (/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v) ? '' : 'Check the email address'));
      const c = err('ok', $('#b-ok').checked ? '' : 'Tick to confirm');
      return [a, b, c].every(Boolean);
    };

    const go = (n) => {
      cur = n;
      steps.forEach((s) => { s.hidden = +s.dataset.step !== n; });
      marks.forEach((m) => {
        const k = +m.dataset.step;
        if (k === n) m.setAttribute('aria-current', 'step'); else m.removeAttribute('aria-current');
        m.classList.toggle('done', k < n);
      });
      back.hidden = n === 1;
      next.textContent = n === 3 ? 'Book' : 'Next';
      status.textContent = '';
      status.classList.remove('bad');
      const first = $('select, input', steps[n - 1]);
      if (first) first.focus();
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!check(cur)) {
        const bad = $('[aria-invalid="true"]', steps[cur - 1]);
        if (bad) bad.focus();
        status.classList.add('bad');
        status.textContent = 'Check the marked fields';
        return;
      }
      if (cur < 3) { go(cur + 1); return; }
      // Final step: the booking is valid but never sent
      status.classList.remove('bad');
      status.textContent = `Not sent. CORRIDOR is fictional; no ticket was issued and nothing was charged. Total would be ${$('#t-total').textContent}.`;
    });
    back.addEventListener('click', () => go(cur - 1));
    form.addEventListener('input', (e) => {
      paint();
      // Clear a field's message as soon as it is corrected
      const id = e.target.id && e.target.id.replace('b-', '');
      if (e.target.getAttribute('aria-invalid') === 'true') {
        if (e.target.name === 'cabin') err('cabin', '');
        else if (id === 'ad' || id === 'ch') err('pax', '');
        else if (document.getElementById('e-' + id)) err(id, '');
      }
    });
    form.addEventListener('change', paint);
    paint();
  }

  /* ── help: FAQ ────────────────────────────────────────────── */
  $$('.t-q button').forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    document.getElementById(b.getAttribute('aria-controls')).hidden = !open;
  }));
})();
