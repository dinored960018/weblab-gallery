// Harnscombe Ringing Centre — behaviour. Uses window.HRC (calc.js) and window.HRC_DATA (data.js).
(function () {
  'use strict';
  const C = window.HRC, D = window.HRC_DATA;
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

  // ---------- tab-only store (sessionStorage, memory if blocked) ----------
  const KEY = 'hrc-demo';
  let mem = { bookings: [], courses: [] };
  const load = () => { try { return JSON.parse(sessionStorage.getItem(KEY)) || mem; } catch (e) { return mem; } };
  const save = (v) => { mem = v; try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* memory only */ } };
  const mine = (iso) => load().bookings.filter((b) => b.iso === iso && !b.wait).length;
  const sessionOn = (iso) => C.sessionOn(iso, D.SESSIONS, D.COURSE_THURSDAYS_FROM);
  const freeNow = (iso) => { const s = sessionOn(iso); return s && s.cap ? Math.max(0, C.freeOn(iso, s) - mine(iso)) : 0; };
  const courseLeft = (id) => { const c = D.COURSES.find((x) => x.id === id); const taken = load().courses.filter((x) => x.id === id && !x.wait).length; return Math.max(0, c.cap - c.taken - taken); };
  const paintCounts = () => {
    $$('[data-free]').forEach((el) => {
      const iso = el.dataset.free, cap = el.dataset.cap, f = freeNow(iso);
      el.textContent = !f ? 'Full' : el.dataset.fmt === 'long' ? `${f} of ${cap} places free` : `${f} of ${cap}`;
    });
    $$('[data-left]').forEach((el) => { const n = courseLeft(el.dataset.left); el.textContent = n ? `${n} ${n === 1 ? 'place' : 'places'} left` : 'Full'; });
  };
  paintCounts();

  // ---------- all-pages sheet ----------
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
  }

  // ---------- field errors ----------
  const showErr = (input, msg) => {
    const e = document.getElementById(input.id + '-e');
    if (msg) { e.textContent = msg; e.hidden = false; input.setAttribute('aria-invalid', 'true'); }
    else { e.textContent = ''; e.hidden = true; input.removeAttribute('aria-invalid'); }
    return !msg;
  };
  const mailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // ---------- towers ----------
  if (page === 'towers') {
    const form = $('#tower-filters'), tbody = $('#tower-table tbody');
    const rows = $$('tr', tbody);
    const pills = $$('.pill', form);
    const qI = $('#f-q'), minS = $('#f-min'), maxS = $('#f-max'), dayS = $('#f-day'), sortS = $('#f-sort');
    const count = $('#tower-count'), empty = $('#tower-empty'), err = $('#tower-err');
    const has = (sel, v) => [...sel.options].some((o) => o.value === v);
    // restore from address
    qI.value = q.get('q') || '';
    const want = (q.get('bells') || '').split(',').filter(Boolean);
    pills.forEach((p) => p.setAttribute('aria-pressed', String(want.includes(p.dataset.bells))));
    [[minS, 'min'], [maxS, 'max'], [dayS, 'day'], [sortS, 'sort']].forEach(([s, k]) => { const v = q.get(k); if (v && has(s, v)) s.value = v; });
    const apply = () => {
      const text = qI.value.trim().toLowerCase();
      const bells = pills.filter((p) => p.getAttribute('aria-pressed') === 'true').map((p) => p.dataset.bells);
      let min = minS.value ? Number(minS.value) * 112 : 0, max = maxS.value ? Number(maxS.value) * 112 : Infinity;
      err.hidden = true;
      if (min > max) { err.textContent = `Error: “Tenor from” (${minS.value} cwt) is above “Tenor up to” (${maxS.value} cwt). Showing all weights from ${minS.value} cwt.`; err.hidden = false; max = Infinity; }
      let n = 0;
      rows.forEach((r) => {
        const ok = (!text || r.dataset.name.includes(text)) && (!bells.length || bells.includes(r.dataset.bells)) && +r.dataset.lb >= min && +r.dataset.lb <= max && (!dayS.value || r.dataset.day === dayS.value);
        r.hidden = !ok; if (ok) n++;
      });
      const by = { miles: (a, b) => a.dataset.miles - b.dataset.miles, name: (a, b) => a.dataset.name.localeCompare(b.dataset.name), heavy: (a, b) => b.dataset.lb - a.dataset.lb }[sortS.value];
      rows.slice().sort(by).forEach((r) => tbody.appendChild(r));
      count.textContent = `${n} ${n === 1 ? 'tower' : 'towers'}${n < rows.length ? ` of ${rows.length}` : ''}`;
      empty.hidden = n > 0;
      $('#tower-table').hidden = n === 0;
      setQuery({ q: qI.value.trim(), bells: bells.join(','), min: minS.value, max: maxS.value, day: dayS.value, sort: sortS.value === 'miles' ? '' : sortS.value });
    };
    qI.addEventListener('input', apply);
    [minS, maxS, dayS, sortS].forEach((s) => s.addEventListener('change', apply));
    pills.forEach((p) => p.addEventListener('click', () => { p.setAttribute('aria-pressed', String(p.getAttribute('aria-pressed') !== 'true')); apply(); }));
    form.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
    $('#tower-clear').addEventListener('click', () => {
      qI.value = ''; pills.forEach((p) => p.setAttribute('aria-pressed', 'false')); minS.value = ''; maxS.value = ''; dayS.value = ''; sortS.value = 'miles';
      apply(); qI.focus();
    });
    apply();
  }

  // ---------- methods ----------
  if (page === 'methods') {
    const box = $('#m-dg'), errP = $('#m-err');
    let st = C.methodState({ bells: q.get('bells'), method: q.get('method'), bell: q.get('bell'), row: q.get('row') });
    let timer = null;
    const play = $('#m-play');
    const say = (errs) => { errP.hidden = !errs.length; errP.textContent = errs.map((e) => 'Error: ' + e).join(' '); };
    const stop = () => { clearInterval(timer); timer = null; play.textContent = 'Play'; play.setAttribute('aria-pressed', 'false'); };
    const showRow = (scroll) => {
      $$('.dg-row', box).forEach((r) => r.classList.toggle('is-cur', +r.dataset.row === st.row));
      const row = st.c.rows[st.row];
      $('#m-now').textContent = `Row ${st.row} of ${st.c.changes}: ${row.join(' ')} — bell ${st.bell} in ${ordinal(row.indexOf(st.bell) + 1)} place`;
      $('#m-prev').disabled = st.row === 0; $('#m-next').disabled = st.row === st.c.changes;
      if (scroll) { const cur = $(`.dg-row[data-row="${st.row}"]`, box); if (cur) { const x = +cur.getAttribute('x'); if (x < box.scrollLeft || x > box.scrollLeft + box.clientWidth - 60) box.scrollLeft = Math.max(0, x - 20); } }
      setQuery({ bells: st.n, method: st.m, bell: st.bell, row: st.row || '' });
    };
    const draw = () => {
      const name = C.methodName(st.m, st.n);
      const label = `${name}: ${st.c.changes} changes in ${st.c.leads} ${st.c.leads === 1 ? 'lead' : 'leads'}; the blue line follows bell ${st.bell}.`;
      box.innerHTML = C.diagram(st.c, st.n, st.bell, label);
      $('#m-cap').textContent = label;
      $('#m-name').textContent = name;
      $('#m-pn').textContent = st.c.pn;
      $('#m-len').textContent = `${st.c.changes} changes · ${st.c.leads} ${st.c.leads === 1 ? 'lead' : 'leads'} of ${st.c.lead}`;
      $$('[data-n]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.n === st.n)));
      $$('[data-m]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === st.m)));
      const sel = $('#m-bell');
      sel.innerHTML = Array.from({ length: st.n }, (_, i) => `<option value="${i + 1}">${i + 1}${i === 0 ? ' (treble)' : ''}</option>`).join('');
      sel.value = String(st.bell);
      const svg = $('svg', box);
      if (!reduce()) { svg.classList.add('pre'); svg.getBoundingClientRect(); requestAnimationFrame(() => svg.classList.remove('pre')); }
      showRow(false);
    };
    const set = (patch) => {
      stop();
      const next = { bells: st.n, method: st.m, bell: st.bell, row: 0, ...patch };
      st = C.methodState(next);
      say(st.errs);
      draw();
    };
    $$('[data-n]').forEach((b) => b.addEventListener('click', () => set({ bells: +b.dataset.n })));
    $$('[data-m]').forEach((b) => b.addEventListener('click', () => set({ method: b.dataset.m })));
    $('#m-bell').addEventListener('change', (e) => set({ bell: +e.target.value, row: st.row }));
    $('#m-prev').addEventListener('click', () => { stop(); if (st.row > 0) { st.row--; showRow(true); } });
    $('#m-next').addEventListener('click', () => { stop(); if (st.row < st.c.changes) { st.row++; showRow(true); } });
    play.addEventListener('click', () => {
      if (timer) { stop(); return; }
      if (st.row >= st.c.changes) st.row = 0;
      if (reduce()) { st.row = st.c.changes; showRow(true); return; }
      play.textContent = 'Pause'; play.setAttribute('aria-pressed', 'true');
      timer = setInterval(() => { st.row++; showRow(true); if (st.row >= st.c.changes) stop(); }, 320);
    });
    $('#m-form').addEventListener('submit', (e) => e.preventDefault());
    say(st.errs);
    draw();
  }
  function ordinal(n) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }

  // ---------- duration ----------
  if (page === 'duration') {
    const bellsS = $('#d-bells'), chI = $('#d-ch'), sI = $('#d-s'), gapI = $('#d-gap');
    let good = { ch: 5040, s: 2.6 };
    if ([...bellsS.options].some((o) => o.value === q.get('bells'))) bellsS.value = q.get('bells');
    const qc = Number(q.get('changes')), qs = Number(q.get('secs'));
    if (Number.isInteger(qc) && qc >= 1 && qc <= 10080) { good.ch = qc; chI.value = qc; }
    if (qs >= 1 && qs <= 5) { good.s = Math.round(qs * 100) / 100; sI.value = good.s.toFixed(2); }
    gapI.checked = q.get('gap') === '1';
    const render = () => {
      const r = C.duration(+bellsS.value, good.ch, good.s, gapI.checked);
      $('#d-total').textContent = C.hmin(r.total);
      $('#d-hmm').textContent = C.hmm(r.total);
      $('#d-blow').textContent = `${r.blow.toFixed(2)} s${gapI.checked ? ', with a one-beat gap at handstroke' : ''}`;
      $('#d-share').textContent = `${Math.round(r.share * 100)} % of 5 040 changes`;
      $('#d-peal').textContent = C.hmin(r.peal);
      $('#d-meter').style.width = Math.min(100, (r.share / 2) * 100) + '%';
      setQuery({ bells: bellsS.value === '8' ? '' : bellsS.value, changes: good.ch, secs: good.s.toFixed(2), gap: gapI.checked ? '1' : '' });
    };
    const readCh = () => {
      const v = chI.value.trim(), n = Number(v);
      if (v === '' || !Number.isInteger(n) || n < 1 || n > 10080) { showErr(chI, `Error: enter a whole number between 1 and 10 080. Kept ${C.fmtInt(good.ch)}.`); chI.value = good.ch; return; }
      showErr(chI, ''); good.ch = n; render();
    };
    const readS = () => {
      const v = sI.value.trim(), n = Number(v);
      if (v === '' || !Number.isFinite(n) || n < 1 || n > 5) { showErr(sI, `Error: enter seconds between 1.00 and 5.00. Kept ${good.s.toFixed(2)}.`); sI.value = good.s.toFixed(2); return; }
      showErr(sI, ''); good.s = Math.round(n * 100) / 100; sI.value = good.s.toFixed(2); render();
    };
    chI.addEventListener('change', readCh);
    sI.addEventListener('change', readS);
    bellsS.addEventListener('change', render);
    gapI.addEventListener('change', render);
    $$('[data-ch]').forEach((b) => b.addEventListener('click', () => { chI.value = b.dataset.ch; readCh(); }));
    $('#d-form').addEventListener('submit', (e) => { e.preventDefault(); readCh(); readS(); });
    render();
  }

  // ---------- bells ----------
  if (page === 'bells') {
    const dI = $('#b-d'), radios = $$('input[name=b-p]');
    const qd = q.get('d'), qp = q.get('p');
    if (qd != null) dI.value = qd;
    if (qp && C.PROFILES[qp]) radios.forEach((r) => (r.checked = r.value === qp));
    const out = (cwt, kg, lb, note) => { $('#b-cwt').textContent = cwt; $('#b-kg').textContent = kg; $('#b-lb').textContent = lb; $('#b-note').textContent = note; };
    const render = () => {
      const v = dI.value.trim(), d = Number(v), p = radios.find((r) => r.checked).value;
      if (v === '') { showErr(dI, ''); $('#b-d-e').hidden = false; $('#b-d-e').textContent = 'Enter a diameter in centimetres, 30 to 200.'; out('—', '—', '—', '—'); setQuery({ d: '', p }); return; }
      if (!Number.isFinite(d) || d < 30 || d > 200) { showErr(dI, 'Error: diameter must be between 30 and 200 cm.'); out('—', '—', '—', '—'); return; }
      showErr(dI, '');
      const e = C.estimate(d, p);
      out(C.cwtLong(e.cwt), `${C.fmtInt(e.kg)} kg`, `${C.fmtInt(e.lb)} lb`, `${e.note} · nominal near ${e.hz} Hz`);
      setQuery({ d: v, p: p === 'medium' ? '' : p });
    };
    dI.addEventListener('input', render);
    radios.forEach((r) => r.addEventListener('change', render));
    $('#b-form').addEventListener('submit', (e) => { e.preventDefault(); render(); });
    render();
  }

  // ---------- practice ----------
  if (page === 'practice') {
    const form = $('#p-form'), dateI = $('#p-date'), nameI = $('#p-name'), mailI = $('#p-mail'), lvl = $('#p-lvl');
    const sess = $('#p-session'), full = $('#p-full'), submit = $('#p-submit'), box = $('#p-confirm');
    const qd = q.get('date');
    if (qd && /^\d{4}-\d{2}-\d{2}$/.test(qd)) dateI.value = qd;
    const state = () => {
      const iso = dateI.value;
      const prob = C.dateProblem(iso, D.SESSIONS, D.COURSE_THURSDAYS_FROM);
      if (prob) { showErr(dateI, prob); sess.textContent = 'No session on this date.'; full.hidden = true; submit.textContent = 'Book a place'; return { ok: false }; }
      showErr(dateI, '');
      const s = sessionOn(iso), f = freeNow(iso);
      sess.textContent = `${C.dateLabel(iso)} · ${s.name} ${s.time} · ${f ? `${f} of ${s.cap} places free` : 'Full'}`;
      full.hidden = f > 0;
      submit.textContent = f ? 'Book a place' : 'Join the waiting list';
      setQuery({ date: iso });
      return { ok: true, iso, s, f };
    };
    const showConfirm = (b) => {
      if (!b) { box.hidden = true; box.innerHTML = ''; return; }
      box.innerHTML = `<p class="small">${b.wait ? `Waiting list, position ${b.pos}` : 'Place booked'}</p><p class="no">${b.no}</p><p>${C.dateLong(b.iso)} · ${b.session} ${b.time}</p><p>${escapeHtml(b.name)} · ${escapeHtml(b.mail)} · ${escapeHtml(b.lvl)}</p><p class="small">Kept in this tab only. Nothing is sent.</p><button class="btn" type="button" data-cancel="${b.no}">Cancel this ${b.wait ? 'request' : 'booking'}</button>`;
      box.hidden = false;
      $('[data-cancel]', box).addEventListener('click', () => {
        const v = load(); v.bookings = v.bookings.filter((x) => x.no !== b.no); save(v);
        paintCounts(); state(); showConfirm(null); dateI.focus();
      });
    };
    dateI.addEventListener('change', state);
    $$('[data-pick]').forEach((b) => b.addEventListener('click', () => { dateI.value = b.dataset.pick; state(); dateI.focus(); }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const st = state();
      const okName = showErr(nameI, nameI.value.trim() ? '' : 'Error: enter your name.');
      const okMail = showErr(mailI, mailOk(mailI.value.trim()) ? '' : 'Error: enter an email address like name@example.com.');
      if (!st.ok) { dateI.focus(); return; }
      if (!okName) { nameI.focus(); return; }
      if (!okMail) { mailI.focus(); return; }
      const v = load();
      let b;
      if (st.f > 0) {
        const place = st.s.cap - st.f + 1;
        b = { no: `HRC-${C.yymmdd(st.iso)}-${String(place).padStart(2, '0')}`, iso: st.iso, session: st.s.name, time: st.s.time, name: nameI.value.trim(), mail: mailI.value.trim(), lvl: lvl.value };
      } else {
        const pos = v.bookings.filter((x) => x.iso === st.iso && x.wait).length + 1;
        b = { no: `HRC-${C.yymmdd(st.iso)}-${String(st.s.cap + pos).padStart(2, '0')}`, wait: true, pos, iso: st.iso, session: st.s.name, time: st.s.time, name: nameI.value.trim(), mail: mailI.value.trim(), lvl: lvl.value };
      }
      v.bookings.push(b); save(v);
      paintCounts(); state(); showConfirm(b); box.focus();
    });
    state();
    const last = load().bookings.slice(-1)[0];
    if (last) showConfirm(last);
  }

  // ---------- learn ----------
  if (page === 'learn') {
    const form = $('#l-form'), nameI = $('#l-name'), mailI = $('#l-mail'), ageI = $('#l-age'), radios = $$('input[name=l-c]');
    const full = $('#l-full'), submit = $('#l-submit'), box = $('#l-confirm');
    const cur = () => D.COURSES.find((c) => c.id === radios.find((r) => r.checked).value);
    const state = () => { const c = cur(), n = courseLeft(c.id); full.hidden = n > 0; submit.textContent = n ? 'Take a place' : 'Join the waiting list'; return { c, n }; };
    const showConfirm = (b) => {
      if (!b) { box.hidden = true; box.innerHTML = ''; return; }
      box.innerHTML = `<p class="small">${b.wait ? `Waiting list, position ${b.pos}` : 'Place taken'}</p><p class="no">${b.no}</p><p>${b.title} · from ${C.dateLong(b.start)}</p><p>${escapeHtml(b.name)} · ${escapeHtml(b.mail)}</p><p class="small">Kept in this tab only. Nothing is sent.</p><button class="btn" type="button" data-cancel>Cancel</button>`;
      box.hidden = false;
      $('[data-cancel]', box).addEventListener('click', () => { const v = load(); v.courses = v.courses.filter((x) => x.no !== b.no); save(v); paintCounts(); state(); showConfirm(null); nameI.focus(); });
    };
    radios.forEach((r) => r.addEventListener('change', state));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { c, n } = state();
      const age = ageI.value.trim(), a = Number(age);
      const okName = showErr(nameI, nameI.value.trim() ? '' : 'Error: enter your name.');
      const okMail = showErr(mailI, mailOk(mailI.value.trim()) ? '' : 'Error: enter an email address like name@example.com.');
      const okAge = showErr(ageI, age === '' ? 'Error: enter your age.' : !Number.isInteger(a) || a > 99 ? 'Error: enter your age as a whole number.' : a < 12 ? 'Error: the course starts at 12. Younger children can watch on Saturday mornings.' : '');
      const first = [[okName, nameI], [okMail, mailI], [okAge, ageI]].find(([ok]) => !ok);
      if (first) { first[1].focus(); return; }
      const v = load();
      let b;
      if (n > 0) b = { id: c.id, no: `HRC-${C.yymmdd(c.start)}-${String(c.cap - n + 1).padStart(2, '0')}`, title: c.title, start: c.start, name: nameI.value.trim(), mail: mailI.value.trim() };
      else { const pos = v.courses.filter((x) => x.id === c.id && x.wait).length + 1; b = { id: c.id, wait: true, pos, no: `HRC-${C.yymmdd(c.start)}-${String(c.cap + pos).padStart(2, '0')}`, title: c.title, start: c.start, name: nameI.value.trim(), mail: mailI.value.trim() }; }
      v.courses.push(b); save(v);
      paintCounts(); state(); showConfirm(b); box.focus();
    });
    state();
    const last = load().courses.slice(-1)[0];
    if (last) showConfirm(last);
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }
})();
