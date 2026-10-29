/* Thrumley Removals — page behaviour and the rule-based assistant. Classic script (works from file://). */
(function () {
  'use strict';
  const D = window.TD, C = window.TC;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = C.esc;
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  const brand = $('.top .brand');
  const REL = brand.getAttribute('href').replace('index.html', '');
  const PAGE = document.body.dataset.page;
  const url = (k, rest) => REL + (k ? k + '/' : '') + 'index.html' + (rest || '');
  const ss = {
    get(k, d) { try { const v = sessionStorage.getItem('thr.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem('thr.' + k, JSON.stringify(v)); } catch (e) { /* storage blocked: state lives in the page only */ } },
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, RM.matches ? 0 : ms));
  const params = new URLSearchParams(location.search);
  const idx = C.itemIndex(D.ROOMS);
  const TH = {}; // page handlers the assistant and history can call

  // ---------- motion 2: number pushed up and replaced, 200 ms ----------
  function roll(el, text) {
    if (!el) return;
    text = String(text);
    const cur = el.dataset.v != null ? el.dataset.v : el.textContent;
    el.dataset.v = text;
    if (cur === text) { if (el.textContent !== text && !el.children.length) el.textContent = text; return; }
    if (RM.matches || !el.animate) { el.textContent = text; return; }
    const a = document.createElement('span'); a.textContent = cur;
    const b = document.createElement('span'); b.textContent = text;
    el.textContent = '';
    el.append(a, b);
    const o = { duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' };
    a.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-105%)' }], o);
    b.animate([{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], o).onfinish = () => { if (el.contains(a)) { el.textContent = text; } };
  }

  // ---------- menu ----------
  const menu = $('#menu'), menuBtn = $('.menu-btn');
  function trap(box, e) {
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button:not([disabled]), input, select, textarea', box).filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
  function menuOpen() { menu.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); document.body.classList.add('lock'); $('.menu-close', menu).focus(); }
  function menuClose(back) { if (menu.hidden) return; menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('lock'); if (back !== false) menuBtn.focus(); }
  menuBtn.addEventListener('click', () => (menu.hidden ? menuOpen() : menuClose()));
  $('.menu-close', menu).addEventListener('click', () => menuClose());
  menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') menuClose(); trap(menu, e); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1240) menuClose(false); });

  // ---------- feature 4: source links land on the row and mark it ----------
  function hit() {
    $$('.hit').forEach((x) => x.classList.remove('hit'));
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (!el || id === 'main') return;
    if (el.tagName === 'DETAILS') el.open = true;
    el.classList.add('hit');
  }
  window.addEventListener('hashchange', hit);
  hit();

  // ---------- feature 9: change log with undo ----------
  const hist = ss.get('hist', []);
  const hl = $('#as-hlist'), hn = $('#as-hn');
  const now = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  const PAGE_NAME = { inv: ['inventory', 'Inventory'], quote: ['quote', 'Quote'], checks: ['checklist', 'Checklist'] };
  function logChange(key, what, prev) {
    hist.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), t: now(), key, what, prev, undone: false });
    if (hist.length > 30) hist.length = 30;
    ss.set('hist', hist);
    renderHist();
  }
  function renderHist() {
    hn.textContent = hist.filter((h) => !h.undone).length;
    $('#as-hist-empty').hidden = hist.length > 0;
    hl.innerHTML = hist.map((h) => `<li><time>${h.t}</time><span${h.undone ? ' class="undone"' : ''}>${esc(PAGE_NAME[h.key][1])}: ${esc(h.what)}</span>${h.undone ? '<span class="note">Undone</span>' : `<button type="button" class="btn" data-undo="${h.id}" aria-label="Undo: ${esc(h.what)}">Undo</button>`}</li>`).join('');
  }
  hl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-undo]');
    if (!b) return;
    const h = hist.find((x) => x.id === b.dataset.undo);
    if (!h) return;
    ss.set(h.key, h.prev);
    h.undone = true;
    ss.set('hist', hist);
    renderHist();
    if (TH[h.key]) { TH[h.key](h.prev); say(`<p>Undone: ${esc(h.what)}.</p>`); }
    else say(`<p>Undone: ${esc(h.what)}. <a href="${url(PAGE_NAME[h.key][0])}">Open ${PAGE_NAME[h.key][1]}</a> to see it.</p>`);
    const nx = $('[data-undo]', hl); (nx || $('#as-t-hist')).focus();
  });
  renderHist();

  // ---------- feature 6: alert list ----------
  function renderAlerts(box, list, dismissed, onFix) {
    const shown = list.filter((a) => !dismissed.has(a.id));
    box.innerHTML = shown.map((a) => `<div class="alert" data-a="${a.id}" role="note"><p class="a-t">${esc(a.text)}</p><button type="button" class="linkbtn a-x" data-x="${a.id}" aria-label="Dismiss: ${esc(a.text)}">Dismiss</button><p class="a-w">${esc(a.why)}</p>${a.fix ? `<p class="a-f">${a.fix.href ? `<a href="${url(a.fix.href)}">${esc(a.fix.label)}</a>` : a.fix.act === 'handover' ? `<a href="${url('about', '#handover')}" data-handover>${esc(a.fix.label)}</a>` : `<button type="button" class="btn" data-fix="${a.id}">${esc(a.fix.label)}</button>`}</p>` : ''}</div>`).join('');
    box.onclick = (e) => {
      const x = e.target.closest('[data-x]');
      if (x) { dismissed.add(x.dataset.x); renderAlerts(box, list, dismissed, onFix); const n = $('button, a', box); if (n) n.focus(); return; }
      const f = e.target.closest('[data-fix]');
      if (f) onFix(list.find((a) => a.id === f.dataset.fix));
    };
  }

  // ---------- home ----------
  if (PAGE === 'home') {
    const radios = $$('input[name="home"]');
    const pick = params.get('home');
    if (pick) radios.forEach((r) => { r.checked = r.value === pick; });
    const upd = () => {
      const h = D.HOMES.find((x) => x.id === (radios.find((r) => r.checked) || radios[2]).value);
      const f = C.vansFor(h.m3, D.VANS, D.MAX_M3);
      roll($('#home-big'), h.m3);
      $('#home-big-cap').textContent = `About ${h.m3} m³ for a ${h.label === 'Studio' ? 'studio' : h.label.replace(' bed', '-bed') + ' home'}`;
      $('#home-van').textContent = C.vanLine(f);
      $('#home-crew').textContent = f.crew;
      $('#home-from').textContent = C.money(C.fromPrice(f));
      $('#home-min').textContent = f.min + ' h';
      $('#home-sum').textContent = `${h.label} · about ${h.m3} m³ · ${C.vanLine(f)} · ${f.crew} crew · from ${C.money(C.fromPrice(f))}`;
      const q = $('#home-quote');
      q.href = url('quote', '?m3=' + h.m3);
      q.textContent = `Quote for ${h.m3} m³`;
      history.replaceState(null, '', '?home=' + h.id + location.hash);
    };
    radios.forEach((r) => r.addEventListener('change', upd));
    if (pick) upd();
  }

  // ---------- inventory ----------
  function vanFigs(total) {
    const f = C.vansFor(Math.max(total, 0.01), D.VANS, D.MAX_M3);
    if (!f || f.over) return { vans: [D.VANS[2], D.VANS[1]], fills: [1, 1], cap: D.MAX_M3, over: true };
    let left = total;
    const fills = f.vans.map((v) => { const r = Math.max(0, Math.min(1, left / v.m3)); left -= v.m3; return r; });
    return { vans: f.vans, fills, cap: f.cap, fit: f };
  }
  if (PAGE === 'inventory') {
    let q = params.get('i') != null ? C.invDecode(params.get('i'), D.ROOMS) : (ss.get('inv', {}).q || {});
    let draft = params.get('i') != null ? false : !!ss.get('inv', {}).draft;
    const dismissed = new Set();
    const svgBox = $('#vf-svgs');
    let shownVans = '';
    const save = () => {
      ss.set('inv', { q, draft });
      const s = C.invEncode(q);
      history.replaceState(null, '', (s ? '?i=' + s : location.pathname.split('/').pop()) + location.hash);
    };
    const render = () => {
      let total = 0;
      const rooms = {};
      for (const id in idx) {
        const n = q[id] || 0;
        const it = idx[id];
        total += n * it.vol;
        rooms[it.room] = (rooms[it.room] || 0) + n * it.vol;
        const li = $(`[data-item="${id}"]`);
        $('.qty', li).textContent = n;
        li.classList.toggle('has', n > 0);
        $('[data-line]', li).textContent = C.m3(n * it.vol) + ' m³';
      }
      total = Math.round(total * 100) / 100;
      $$('[data-room-total]').forEach((s) => { s.textContent = C.m3(rooms[s.dataset.roomTotal] || 0) + ' m³'; });
      roll($('#inv-big'), C.m3(total));
      const vf = vanFigs(total);
      const key = vf.vans.map((v) => v.id).join('+');
      if (key !== shownVans) {
        svgBox.innerHTML = vf.vans.map((v, i) => C.vanSvg(v, { fill: 0, idp: 'vf' + i }).replace(/ style="width:[^"]*"/, ' style="width:100%"')).join('');
        shownVans = key;
        svgBox.getBoundingClientRect();
      }
      $$('.fill', svgBox).forEach((r, i) => { r.style.transform = `scaleX(${vf.fills[i]})`; });
      const pct = total ? Math.round((total / vf.cap) * 100) : 0;
      $('#vf-cap').textContent = vf.over ? `${C.m3(total)} m³: over two vans (${D.MAX_M3} m³). Home survey.` : `${C.vanLine(vf.fit || { vans: vf.vans })} · ${vf.cap} m³ · ${pct} % full`;
      $('#inv-sum').textContent = total ? (vf.over ? `${C.m3(total)} m³ · over ${D.MAX_M3} m³ · home survey` : `${C.m3(total)} m³ · ${C.vanLine(vf.fit)} · ${vf.fit.crew} crew · ${pct} % full`) : 'Nothing counted yet.';
      const ql = $('#inv-quote');
      if (total && !vf.over) { ql.href = url('quote', '?m3=' + (Math.round(total * 10) / 10)); ql.removeAttribute('aria-disabled'); ql.textContent = `Quote for ${C.m3(total)} m³`; }
      else { ql.setAttribute('aria-disabled', 'true'); ql.removeAttribute('href'); ql.textContent = 'Quote for this volume'; }
      const fl = $('#inv-flag');
      fl.hidden = !draft;
      renderAlerts($('#inv-alerts'), C.invAlerts(total, D), dismissed, () => {});
      save();
    };
    $$('.st-btn').forEach((b) => b.addEventListener('click', () => {
      const id = b.closest('[data-item]').dataset.item;
      q[id] = Math.max(0, Math.min(99, (q[id] || 0) + Number(b.dataset.d)));
      if (!q[id]) delete q[id];
      render();
    }));
    // tabs
    const tabs = $$('.tab');
    const selTab = (t, focus) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => selTab(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (k == null) return;
        e.preventDefault();
        selTab(tabs[(k + tabs.length) % tabs.length], true);
      });
    });
    // feature 5: draft from home size
    TH.invDraft = (home) => {
      const h = D.HOMES.find((x) => x.id === home) || D.HOMES[2];
      const prev = { q: { ...q }, draft };
      q = { ...D.DRAFTS[h.id] };
      draft = true;
      $('#inv-home').value = h.id;
      render();
      const t = C.invTotal(q, D.ROOMS);
      logChange('inv', `drafted a ${h.label} list, ${C.m3(t)} m³`, prev);
      return t;
    };
    $('#inv-draft').addEventListener('click', () => TH.invDraft($('#inv-home').value));
    $('#inv-confirm').addEventListener('click', () => { draft = false; render(); $('#inv-sum').textContent += ' · list confirmed'; $('#inv-quote').focus(); });
    $('#inv-clear').addEventListener('click', () => { q = {}; draft = false; render(); });
    TH.inv = (state) => { q = { ...(state.q || {}) }; draft = !!state.draft; render(); };
    TH.invTotal = () => C.invTotal(q, D.ROOMS);
    TH.invState = () => ({ q: { ...q }, draft });
    // feature 8: paste a list
    const opts = (sel) => `<option value="">Not read</option>` + D.ROOMS.map((r) => `<optgroup label="${esc(r.label)}">${r.items.map(([id, name]) => `<option value="${id}"${id === sel ? ' selected' : ''}>${esc(name)}</option>`).join('')}</optgroup>`).join('');
    let pasted = [];
    const pout = $('#paste-out');
    const paintPaste = () => {
      const read = pasted.filter((r) => r.id).length;
      const vol = pasted.reduce((a, r) => a + (r.id ? idx[r.id].vol * r.qty : 0), 0);
      pout.innerHTML = `<p class="sum">${read} of ${pasted.length} lines read · ${C.m3(vol)} m³${pasted.length - read ? ` · ${pasted.length - read} not read, pick an item or leave out` : ''}</p>
<div class="tbl"><table class="paste-t"><thead><tr><th scope="col">Your line</th><th scope="col">Read as</th><th scope="col">Qty</th><th scope="col" class="n">m³</th></tr></thead><tbody>
${pasted.map((r, i) => `<tr${r.id ? '' : ' class="miss"'}><th scope="row">${esc(r.line)}${r.id ? '' : '<br><span class="err">Not read</span>'}</th><td><label class="vh" for="pr-${i}">Item for line ${i + 1}</label><select id="pr-${i}" data-pi="${i}">${opts(r.id)}</select></td><td><input id="pr-q-${i}" data-pq="${i}" type="text" inputmode="numeric" value="${r.qty}" aria-label="Quantity for line ${i + 1}"></td><td class="n">${r.id ? C.m3(idx[r.id].vol * r.qty) : '—'}</td></tr>`).join('')}
</tbody></table></div><p class="acts"><button class="btn btn--pri" type="button" id="paste-add"${read ? '' : ' disabled'}>Add ${read} line${read === 1 ? '' : 's'} to inventory</button></p>`;
    };
    $('#paste-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const t = $('#paste-in').value.trim();
      if (!t) { pout.innerHTML = '<p class="err">Paste at least one line.</p>'; $('#paste-in').focus(); return; }
      pasted = C.parseList(t, D);
      paintPaste();
    });
    pout.addEventListener('change', (e) => {
      const s = e.target.closest('[data-pi]');
      if (s) { pasted[+s.dataset.pi].id = s.value || null; paintPaste(); $('#pr-' + s.dataset.pi).focus(); }
      const n = e.target.closest('[data-pq]');
      if (n) { const v = parseInt(n.value, 10); pasted[+n.dataset.pq].qty = v > 0 && v < 100 ? v : 1; paintPaste(); $('#pr-q-' + n.dataset.pq).focus(); }
    });
    pout.addEventListener('click', (e) => {
      if (!e.target.closest('#paste-add')) return;
      const prev = { q: { ...q }, draft };
      let n = 0;
      for (const r of pasted) if (r.id) { q[r.id] = Math.min(99, (q[r.id] || 0) + r.qty); n++; }
      draft = true;
      render();
      logChange('inv', `added ${n} pasted line${n === 1 ? '' : 's'}`, prev);
      pout.innerHTML = `<p class="sum">Added ${n} line${n === 1 ? '' : 's'}. Total ${C.m3(C.invTotal(q, D.ROOMS))} m³. Undo from the assistant’s Changes tab.</p>`;
      $('#inv-big').closest('.head').scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth' });
    });
    if (params.get('draft')) TH.invDraft(params.get('draft'));
    render();
  }

  // ---------- quote ----------
  if (PAGE === 'quote') {
    const F = { m3: $('#q-m3'), mi: $('#q-mi'), fa: $('#q-fa'), la: $('#q-fa-lift'), fb: $('#q-fb'), lb: $('#q-fb-lift'), pk: $('#q-pk'), d: $('#q-d') };
    let over = { vanId: '', trips: 1 };
    let draft = false, confirmed = '';
    let flags = {};
    const dismissed = new Set();
    const out = $('#q-out');
    const first = C.addDays(D.TODAY, D.NOTICE_DAYS);
    let view = first.slice(0, 7);
    let focusDay = first;
    const st0 = ss.get('quote', null);
    const state = () => ({ m3: F.m3.value, mi: F.mi.value, fa: F.fa.value, la: F.la.checked, fb: F.fb.value, lb: F.lb.checked, pk: F.pk.checked, d: F.d.value, v: over.vanId, t: over.trips, draft, flags });
    function setForm(s) {
      F.m3.value = s.m3 || ''; F.mi.value = s.mi || ''; F.fa.value = s.fa || '0'; F.la.checked = !!s.la; F.fb.value = s.fb || '0'; F.lb.checked = !!s.lb; F.pk.checked = !!s.pk;
      F.d.value = s.d || ''; over = { vanId: s.v || '', trips: s.t || 1 }; draft = !!s.draft; flags = s.flags || {};
      if (F.d.value) { view = F.d.value.slice(0, 7); focusDay = F.d.value; }
      paintCal(); picked();
    }
    const save = () => {
      const s = state();
      ss.set('quote', s);
      const p = new URLSearchParams();
      if (s.m3) p.set('m3', s.m3); if (s.mi) p.set('mi', s.mi); if (s.fa !== '0') p.set('fa', s.fa); if (s.la) p.set('la', 1); if (s.fb !== '0') p.set('fb', s.fb); if (s.lb) p.set('lb', 1); if (s.pk) p.set('pk', 1); if (s.d) p.set('d', s.d); if (s.v) { p.set('v', s.v); p.set('t', s.t); }
      history.replaceState(null, '', (p.toString() ? '?' + p : location.pathname.split('/').pop()) + location.hash);
    };
    // calendar
    const cal = $('#cal');
    const WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const WDL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    function dayLabel(s) {
      const i = C.dateInfo(s, D);
      const what = { open: 'standard rate', surcharge: `surcharge ${i.pct} per cent`, full: 'full', closed: 'closed', notice: 'inside notice period', out: 'outside booking range' }[i.status];
      return `${C.fmtLong(s)}, ${what}`;
    }
    function paintCal() {
      const [y, m] = view.split('-').map(Number);
      const mi = m - 1;
      const n = C.daysInMonth(y, mi);
      const lead = (new Date(Date.UTC(y, mi, 1)).getUTCDay() + 6) % 7;
      if (focusDay.slice(0, 7) !== view) focusDay = view + '-01';
      const cells = [];
      for (let i = 0; i < lead; i++) cells.push('<td></td>');
      for (let d = 1; d <= n; d++) {
        const s = `${view}-${String(d).padStart(2, '0')}`;
        const inf = C.dateInfo(s, D);
        const off = !(inf.status === 'open' || inf.status === 'surcharge');
        cells.push(`<td role="gridcell"><button type="button" class="day" data-d="${s}" data-s="${inf.status}" tabindex="${s === focusDay ? 0 : -1}" aria-label="${dayLabel(s)}" aria-pressed="${F.d.value === s}"${off ? ' aria-disabled="true"' : ''}>${d}${inf.status === 'surcharge' ? `<small aria-hidden="true">+${inf.pct}</small>` : ''}</button></td>`);
      }
      while (cells.length % 7) cells.push('<td></td>');
      const rows = [];
      for (let i = 0; i < cells.length; i += 7) rows.push(`<tr>${cells.slice(i, i + 7).join('')}</tr>`);
      const prevOk = view > D.RANGE.from.slice(0, 7), nextOk = view < D.RANGE.to.slice(0, 7);
      cal.innerHTML = `<div class="cal-nav"><button type="button" data-mv="-1" aria-label="Previous month"${prevOk ? '' : ' disabled'}>←</button><p class="cal-m" id="cal-h" aria-live="polite">${C.monthName(y, mi)}</p><button type="button" data-mv="1" aria-label="Next month"${nextOk ? '' : ' disabled'}>→</button></div>
<table role="grid" aria-labelledby="cal-h"><thead><tr>${WD.map((w, i) => `<th scope="col" abbr="${WDL[i]}">${w}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`;
    }
    const clampD = (s) => (s < D.RANGE.from ? D.RANGE.from : s > D.RANGE.to ? D.RANGE.to : s);
    function moveTo(s) {
      s = clampD(s);
      focusDay = s;
      if (s.slice(0, 7) !== view) { view = s.slice(0, 7); paintCal(); }
      else $$('.day', cal).forEach((b) => { b.tabIndex = b.dataset.d === s ? 0 : -1; });
      const b = $(`.day[data-d="${s}"]`, cal);
      if (b) b.focus();
    }
    function picked() {
      $('#q-picked').textContent = F.d.value ? 'Chosen: ' + C.dateLine(F.d.value, D) : 'No date chosen.';
    }
    function choose(s, byPerson) {
      const inf = C.dateInfo(s, D);
      if (!(inf.status === 'open' || inf.status === 'surcharge')) {
        $('#q-picked').textContent = `${C.dateLine(s, D)}. Choose another date.`;
        return false;
      }
      F.d.value = s;
      focusDay = s;
      $$('.day', cal).forEach((b) => b.setAttribute('aria-pressed', b.dataset.d === s));
      picked();
      clearErr('q-d');
      if (byPerson) save();
      return true;
    }
    cal.addEventListener('click', (e) => {
      const mv = e.target.closest('[data-mv]');
      if (mv) {
        const [y, m] = view.split('-').map(Number);
        const d = new Date(Date.UTC(y, m - 1 + Number(mv.dataset.mv), 1));
        view = C.iso(d).slice(0, 7);
        focusDay = view + '-01';
        paintCal();
        const again = $(`[data-mv="${mv.dataset.mv}"]`, cal);
        (again && !again.disabled ? again : $('.day[tabindex="0"]', cal)).focus();
        return;
      }
      const b = e.target.closest('.day');
      if (b) { choose(b.dataset.d, true); b.focus(); }
    });
    cal.addEventListener('keydown', (e) => {
      const b = e.target.closest('.day');
      if (!b) return;
      const s = b.dataset.d;
      const dow = (C.D0(s).getUTCDay() + 6) % 7;
      let t = null;
      if (e.key === 'ArrowLeft') t = C.addDays(s, -1);
      else if (e.key === 'ArrowRight') t = C.addDays(s, 1);
      else if (e.key === 'ArrowUp') t = C.addDays(s, -7);
      else if (e.key === 'ArrowDown') t = C.addDays(s, 7);
      else if (e.key === 'Home') t = C.addDays(s, -dow);
      else if (e.key === 'End') t = C.addDays(s, 6 - dow);
      else if (e.key === 'PageUp' || e.key === 'PageDown') {
        const d = C.D0(s); d.setUTCMonth(d.getUTCMonth() + (e.key === 'PageUp' ? -1 : 1));
        t = C.iso(d);
      }
      if (t) { e.preventDefault(); moveTo(t); }
    });
    // validation
    function setErr(id, msg) { const el = $('#' + id); const e = $('#' + id + '-e'); if (el && el.type !== 'hidden') el.setAttribute('aria-invalid', 'true'); e.textContent = 'Error: ' + msg; e.hidden = false; }
    function clearErr(id) { const el = $('#' + id); const e = $('#' + id + '-e'); if (el) el.removeAttribute('aria-invalid'); if (e) { e.hidden = true; e.textContent = ''; } }
    function readInput() {
      return { vol: parseFloat(F.m3.value), miles: parseFloat(F.mi.value), floorsA: +F.fa.value, liftA: F.la.checked, floorsB: +F.fb.value, liftB: F.lb.checked, packing: F.pk.checked, date: F.d.value, vanId: over.vanId, trips: over.trips };
    }
    function validate() {
      ['q-m3', 'q-mi', 'q-d'].forEach(clearErr);
      const bad = [];
      const v = F.m3.value.trim(), mi = F.mi.value.trim();
      if (!v) bad.push(['q-m3', 'Enter the volume in m³.']);
      else if (!/^\d+(\.\d)?$/.test(v) || +v < 1) bad.push(['q-m3', 'Enter a number from 1 to ' + D.MAX_M3 + ', one decimal at most.']);
      else if (+v > D.MAX_M3) bad.push(['q-m3', `Over ${D.MAX_M3} m³ needs a home survey. Use “Hand over to a person”.`]);
      else if (over.vanId) { const vv = D.VANS.find((x) => x.id === over.vanId); if (+v > vv.m3 * over.trips) bad.push(['q-m3', `${vv.name}${over.trips > 1 ? ' on ' + over.trips + ' trips' : ''} takes ${vv.m3 * over.trips} m³ at most.`]); }
      if (!mi) bad.push(['q-mi', 'Enter the distance in miles.']);
      else if (!/^\d+(\.\d)?$/.test(mi) || +mi > 400) bad.push(['q-mi', 'Enter a number from 0 to 400.']);
      if (!F.d.value) bad.push(['q-d', 'Choose a date in the calendar.']);
      else { const s = C.dateInfo(F.d.value, D).status; if (s !== 'open' && s !== 'surcharge') bad.push(['q-d', C.dateLine(F.d.value, D) + '. Choose another date.']); }
      bad.forEach(([id, m]) => setErr(id, m));
      const sum = $('#q-err');
      sum.hidden = !bad.length;
      sum.textContent = bad.length ? `Fix ${bad.length} field${bad.length > 1 ? 's' : ''} marked Error.` : '';
      return bad;
    }
    // feature 3: steps, then the result
    let run = 0;
    async function calc(opt = {}) {
      const bad = validate();
      save();
      if (bad.length) {
        if (opt.focus !== false) { const f = bad[0][0] === 'q-d' ? ($('.day[tabindex="0"]', cal) || cal) : $('#' + bad[0][0]); f.focus(); }
        return null;
      }
      const my = ++run;
      const inp = readInput();
      const q = C.quote(inp, D);
      const steps = [['Volume', `${C.m3(inp.vol)} m³`], ['Van', C.fitLine(q.fit)], ['Crew and hours', `${q.fit.crew} crew, ${C.num(q.hours.hours, 1)} h`], ['Date rate', q.info.pct ? `+${q.info.pct} %` : 'standard'], ['Total', C.money(q.total)]];
      out.innerHTML = `<h2>Steps</h2><ol class="pipeline" id="q-pipe">${steps.map((s) => `<li data-st="wait">${s[0]}</li>`).join('')}</ol><p class="vh" id="q-status" aria-live="polite">Calculating.</p>`;
      const lis = $$('#q-pipe li');
      for (let i = 0; i < lis.length; i++) {
        lis[i].dataset.st = 'run';
        await sleep(110);
        if (my !== run) return null;
        lis[i].dataset.st = 'done';
        lis[i].textContent = `${steps[i][0]}: ${steps[i][1]}`;
      }
      paintResult(inp, q);
      if (opt.focus !== false && window.innerWidth <= 960) $('#q-big').closest('.big-col').scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth' });
      return q;
    }
    function paintResult(inp, q) {
      roll($('#q-big'), C.money(q.total));
      $('#q-big-cap').textContent = `Total, VAT included · ${C.dateLine(inp.date, D)}`;
      const al = C.quoteAlerts(inp, D, flags);
      const op = C.quoteOptions(inp, D);
      const flag = confirmed ? `<p class="draft-flag"><span class="tag tag--ok">Confirmed</span> Reference ${confirmed}. Not sent: nothing leaves this page.</p>`
        : `<p class="draft-flag">${draft ? '<span class="tag">Draft</span> Filled by the assistant. Check every line, then ' : 'Check every line, then '}<button type="button" class="linkbtn" id="q-confirm">confirm the quote</button>.</p>`;
      const pipe = $('#q-pipe') ? $('#q-pipe').outerHTML : '';
      out.innerHTML = `${flag}<h2>Steps</h2>${pipe}
<h2>Breakdown</h2><div class="tbl"><table><thead><tr><th scope="col">Line</th><th scope="col">Source</th><th scope="col" class="n">£</th></tr></thead><tbody>
${q.rows.map(([k, v, src]) => `<tr><th scope="row">${esc(k)}</th><td><a href="${url('prices', '#' + src)}">Prices table</a></td><td class="n">${C.money(v)}</td></tr>`).join('')}
</tbody><tfoot><tr><th scope="row" colspan="2">Total, VAT included</th><td class="n">${C.money(q.total)}</td></tr></tfoot></table></div>
${over.vanId ? `<p class="note">Van chosen by you: ${esc(C.fitLine(q.fit))}. <button type="button" class="linkbtn" id="q-auto">Back to the van the volume needs</button></p>` : ''}
${al.length ? '<h2>Check these</h2><div class="alerts" id="q-alerts"></div>' : ''}
<h2>Three ways</h2><ul class="opts">${op.map((o) => `<li><span class="o-t">${esc(o.title)}</span><span class="o-v">${C.money(o.total)}</span><span class="o-w">${esc(o.why)}</span><button type="button" class="btn" data-opt="${o.id}">Use this</button></li>`).join('')}</ul>
<p class="vh" aria-live="polite" id="q-status">Total ${C.money(q.total)}.</p>`;
      if (al.length) renderAlerts($('#q-alerts'), al, dismissed, (a) => { patch(a.fix.patch, `fix: ${a.fix.label.toLowerCase()}`); });
      out.onclick = (e) => {
        const o = e.target.closest('[data-opt]');
        if (o) { const x = op.find((y) => y.id === o.dataset.opt); patch(x.patch, `chose “${x.title}”`); return; }
        if (e.target.closest('#q-confirm')) { confirmed = 'TR-' + inp.date.slice(5).replace('-', '') + '-' + String(Math.round(q.total) % 1000).padStart(3, '0'); draft = false; save(); paintResult(inp, q); $('#q-out .tag').parentElement.setAttribute('tabindex', '-1'); $('#q-out .draft-flag').focus(); return; }
        if (e.target.closest('#q-auto')) patch({ vanId: '', trips: 1 }, 'back to automatic van');
      };
    }
    function patch(p, what) {
      const prev = state();
      if ('date' in p) choose(p.date);
      if ('liftA' in p) F.la.checked = p.liftA;
      if ('liftB' in p) F.lb.checked = p.liftB;
      if ('vanId' in p) over = { vanId: p.vanId, trips: p.trips || 1 };
      draft = true; confirmed = '';
      if (p.date) { view = p.date.slice(0, 7); paintCal(); }
      logChange('quote', what, prev);
      return calc({ focus: false }).then(() => { $('#q-big').closest('.head').scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'start' }); });
    }
    // feature 2: words to fields
    TH.quoteFill = (text) => {
      const r = C.parseMove(text, D);
      const prev = state();
      const f = r.fields;
      if (f.vol != null) F.m3.value = f.vol;
      if (f.miles != null) F.mi.value = f.miles;
      if (f.floorsA != null) { F.fa.value = f.floorsA; F.la.checked = !!f.liftA; }
      if (f.floorsB != null) { F.fb.value = f.floorsB; F.lb.checked = !!f.liftB; }
      if (f.packing) F.pk.checked = true;
      if (f.date) { view = f.date.slice(0, 7); focusDay = f.date; paintCal(); if (!choose(f.date)) { F.d.value = f.date; } }
      flags = r.flags;
      over = { vanId: '', trips: 1 };
      draft = true; confirmed = '';
      $('#q-text').value = text;
      paintChips(r);
      if (r.chips.length) logChange('quote', `filled from “${text.slice(0, 48)}${text.length > 48 ? '…' : ''}”`, prev);
      calc({ focus: false });
      return r;
    };
    const FIELD_OF = { vol: 'q-m3', miles: 'q-mi', floorsA: 'q-fa', floorsB: 'q-fb', date: 'cal', packing: 'q-pk', storage: null };
    function paintChips(r) {
      $('#q-chips').innerHTML = (r.chips.length ? `<span class="note">Read:</span>` : '') + r.chips.map(([k, label]) => `<span class="chip">${FIELD_OF[k] ? `<button type="button" class="linkbtn" data-go="${FIELD_OF[k]}" aria-label="${esc(label)}, go to field">${esc(label)}</button>` : esc(label)}<button type="button" data-rm="${k}" aria-label="Remove: ${esc(label)}">×</button></span>`).join('') +
        r.unread.map((u) => `<span class="chip chip--miss">Not read: “${esc(u)}”</span>`).join('') + (r.chips.length || r.unread.length ? '' : '<span class="chip chip--miss">Nothing read. Try: 2 bed, 8 miles, 3rd floor no lift, Sat 14 Nov</span>');
    }
    $('#q-chips').addEventListener('click', (e) => {
      const g = e.target.closest('[data-go]');
      if (g) { const t = g.dataset.go === 'cal' ? $('.day[tabindex="0"]', cal) : $('#' + g.dataset.go); if (t) t.focus(); return; }
      const rm = e.target.closest('[data-rm]');
      if (!rm) return;
      const k = rm.dataset.rm;
      if (k === 'vol') F.m3.value = ''; if (k === 'miles') F.mi.value = ''; if (k === 'floorsA') { F.fa.value = '0'; F.la.checked = false; } if (k === 'floorsB') { F.fb.value = '0'; F.lb.checked = false; }
      if (k === 'date') { F.d.value = ''; paintCal(); picked(); } if (k === 'packing') F.pk.checked = false; if (k === 'storage') flags = {};
      const chip = rm.closest('.chip'); const nx = chip.nextElementSibling || chip.previousElementSibling; chip.remove();
      save();
      (nx && nx.querySelector('button') ? nx.querySelector('button') : $('#q-text')).focus();
    });
    $('#q-read').addEventListener('click', () => {
      const t = $('#q-text').value.trim();
      if (!t) { $('#q-chips').innerHTML = '<span class="chip chip--miss">Write the move first, for example: 2 bed flat, 8 miles, Sat 14 Nov</span>'; $('#q-text').focus(); return; }
      TH.quoteFill(t);
    });
    $('#qform').addEventListener('submit', (e) => { e.preventDefault(); confirmed = ''; calc(); });
    $('#qform').addEventListener('reset', () => {
      setTimeout(() => { F.d.value = ''; over = { vanId: '', trips: 1 }; draft = false; confirmed = ''; flags = {}; $('#q-chips').innerHTML = ''; ['q-m3', 'q-mi', 'q-d'].forEach(clearErr); $('#q-err').hidden = true; paintCal(); picked(); roll($('#q-big'), '£0'); $('#q-big-cap').textContent = 'Fill in the form for a total'; out.innerHTML = '<p class="note">The breakdown appears here.</p>'; save(); }, 0);
    });
    ['input', 'change'].forEach((ev) => $('#qform').addEventListener(ev, (e) => { if (e.target.id !== 'q-text') { if (e.target === F.m3 || e.target === F.mi) clearErr(e.target.id); save(); } }));
    TH.quote = (s) => { setForm(s || {}); confirmed = ''; if (s && s.m3) calc({ focus: false }); else out.innerHTML = '<p class="note">The breakdown appears here.</p>'; };
    TH.quoteInput = () => readInput();
    TH.quoteLast = () => { const i = readInput(); return i.vol > 0 && i.miles >= 0 && i.date ? C.quote(i, D) : null; };
    // start: URL wins, then this tab's last state
    if ([...params.keys()].some((k) => ['m3', 'mi', 'd', 'fa', 'fb'].includes(k))) {
      setForm({ m3: params.get('m3') || '', mi: params.get('mi') || '', fa: params.get('fa') || '0', la: params.has('la'), fb: params.get('fb') || '0', lb: params.has('lb'), pk: params.has('pk'), d: params.get('d') || '', v: params.get('v') || '', t: +params.get('t') || 1, draft: params.has('draft') });
      if (params.get('text')) { TH.quoteFill(params.get('text')); }
      else if (F.m3.value && F.mi.value && F.d.value) calc({ focus: false }); else save();
    } else if (params.get('text')) { paintCal(); TH.quoteFill(params.get('text')); }
    else if (st0) { setForm(st0); if (st0.m3 && st0.mi && st0.d) calc({ focus: false }); }
    else paintCal();
  }

  // ---------- checklist ----------
  if (PAGE === 'checklist') {
    let st = ss.get('checks', { ticks: {}, date: '', draft: false });
    const boxes = $$('[data-check]');
    const total = boxes.length;
    const dismissed = new Set();
    const render = () => {
      boxes.forEach((b) => { b.checked = !!st.ticks[b.dataset.check]; });
      const n = boxes.filter((b) => b.checked).length;
      roll($('#ck-big'), `${n}/${total}`);
      $('#ck-sum').textContent = `${n} of ${total} done.` + (st.date ? ` Moving day ${C.fmtDate(st.date)}.` : '');
      $('#ck-flag').hidden = !st.draft;
      const late = [];
      $$('[data-due]').forEach((s) => {
        if (!st.date) { s.textContent = ''; s.classList.remove('late'); return; }
        const gi = +s.dataset.due;
        const due = C.addDays(st.date, -D.CHECK_OFFSETS[gi]);
        const done = $$('[data-check]', s.closest('.row')).every((b) => b.checked);
        const isLate = due < D.TODAY && !done;
        s.textContent = (due === st.date ? 'On ' : 'By ') + C.fmtDate(due) + (isLate ? ' · past' : '');
        s.classList.toggle('late', isLate);
        if (isLate) late.push(s.closest('.row').querySelector('.row-h').firstChild.textContent);
      });
      if (st.date) $('#ck-date').value = st.date;
      const al = [];
      if (late.length) al.push({ id: 'late', text: `${late.length} group${late.length > 1 ? 's are' : ' is'} past ${late.length > 1 ? 'their dates' : 'its date'}: ${late.join(', ')}.`, why: `Moving day is ${C.fmtDate(st.date)}, ${Math.round((C.D0(st.date) - C.D0(D.TODAY)) / 864e5)} days from today. Do the oldest items first.`, fix: { label: 'Go to the first late group' } });
      const days = st.date ? Math.round((C.D0(st.date) - C.D0(D.TODAY)) / 864e5) : 99;
      if (st.date && days < 14 && !st.ticks.w8a) al.push({ id: 'book', text: 'Date and van not ticked as booked.', why: 'Inside two weeks weekend crews are usually full.', fix: { label: 'Open the quote' } });
      renderAlerts($('#ck-alerts'), al, dismissed, (a) => {
        if (a.id === 'late') { const r = $('.due.late'); if (r) { const c = $('input:not(:checked)', r.closest('.row')) || $('input', r.closest('.row')); c.focus(); } }
        if (a.id === 'book') location.href = url('quote', '?d=' + st.date);
      });
      ss.set('checks', st);
    };
    boxes.forEach((b) => b.addEventListener('change', () => { st.ticks[b.dataset.check] = b.checked; if (!b.checked) delete st.ticks[b.dataset.check]; render(); }));
    $('#ck-clear').addEventListener('click', () => { st.ticks = {}; render(); });
    TH.checkDraft = (date) => {
      const e = $('#ck-date-e');
      e.hidden = true; $('#ck-date').removeAttribute('aria-invalid');
      if (!date || date < D.TODAY || date > D.RANGE.to || C.dateInfo(date, D).status === 'invalid') {
        e.textContent = `Error: Choose a date from ${C.fmtDate(D.TODAY)} to ${C.fmtDate(D.RANGE.to)}.`; e.hidden = false; $('#ck-date').setAttribute('aria-invalid', 'true'); $('#ck-date').focus(); return false;
      }
      const prev = JSON.parse(JSON.stringify(st));
      st.date = date; st.draft = true;
      render();
      logChange('checks', `dated the plan for ${C.fmtDate(date)}`, prev);
      return true;
    };
    $('#ck-draft').addEventListener('click', () => TH.checkDraft($('#ck-date').value));
    $('#ck-confirm').addEventListener('click', () => { st.draft = false; render(); $('#ck-sum').textContent += ' Plan confirmed.'; $('#ck-sum').focus(); });
    TH.checks = (s) => { st = JSON.parse(JSON.stringify(s || { ticks: {}, date: '', draft: false })); if (!st.date) $('#ck-date').value = ''; render(); };
    TH.checkLeft = () => D.CHECK_IDS.filter((id) => !st.ticks[id]).length;
    TH.checkState = () => st;
    render();
  }

  // ---------- about: feature 10, hand over to a person ----------
  function sessionSummary() {
    const lines = [];
    const inv = ss.get('inv', null);
    if (inv && inv.q && Object.keys(inv.q).length) {
      const t = C.invTotal(inv.q, D.ROOMS);
      const top = Object.entries(inv.q).sort((a, b) => idx[b[0]].vol * b[1] - idx[a[0]].vol * a[1]).slice(0, 5).map(([k, n]) => `${n} × ${idx[k].name}`);
      lines.push(`Inventory: ${C.m3(t)} m³${inv.draft ? ' (draft)' : ''}. Largest: ${top.join(', ')}.`);
    }
    const q = ss.get('quote', null);
    if (q && q.m3) {
      const inp = { vol: +q.m3, miles: +q.mi || 0, floorsA: +q.fa, liftA: q.la, floorsB: +q.fb, liftB: q.lb, packing: q.pk, date: q.d, vanId: q.v, trips: q.t };
      const r = inp.vol > 0 && inp.vol <= D.MAX_M3 ? C.quote(inp, D) : null;
      lines.push(`Quote: ${q.m3} m³, ${q.mi || '?'} mi, out ${+q.fa ? 'floor ' + q.fa + (q.la ? ' with lift' : ' no lift') : 'ground'}, in ${+q.fb ? 'floor ' + q.fb + (q.lb ? ' with lift' : ' no lift') : 'ground'}${q.pk ? ', packing service' : ''}${q.d ? ', ' + C.fmtDate(q.d) : ''}${r ? ', ' + C.money(r.total) : ''}${q.flags && q.flags.storage ? '. Storage needed' : ''}.`);
      if (+q.m3 > D.MAX_M3) lines.push(`Over ${D.MAX_M3} m³: home survey needed.`);
    }
    const ck = ss.get('checks', null);
    if (ck && ck.date) lines.push(`Checklist: moving day ${C.fmtDate(ck.date)}, ${Object.keys(ck.ticks).length} of ${D.CHECK_IDS.length} done.`);
    const asked = ss.get('chat', []).filter((m) => m.who === 'me').slice(-4).map((m) => m.text);
    if (asked.length) lines.push(`Asked the assistant: ${asked.map((a) => '“' + a + '”').join('; ')}.`);
    const miss = ss.get('miss', []);
    if (miss.length) lines.push(`Not answered by the rules: ${miss.slice(-3).map((a) => '“' + a + '”').join('; ')}.`);
    return lines.length ? lines.join('\n') : '';
  }
  if (PAGE === 'about') {
    const fm = $('#ho-form');
    const fill = () => {
      const s = sessionSummary();
      $('#ho-sum').value = s || 'Nothing in this tab’s session yet. Write the volume, both addresses’ floors and the date.';
      $('#ho-flag').hidden = !s;
      if (ss.get('miss', []).length || /home survey/.test(s)) fm.querySelector('input[value="survey"]').checked = true;
    };
    $('#ho-fill').addEventListener('click', () => { fill(); $('#ho-sum').focus(); });
    $('#ho-sum').addEventListener('input', () => { /* person edits: still a draft until checked */ });
    fm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = [];
      const chk = (id, ok, msg) => { const el = $('#' + id), er = $('#' + id + '-e'); if (ok) { el.removeAttribute('aria-invalid'); er.hidden = true; } else { el.setAttribute('aria-invalid', 'true'); er.textContent = 'Error: ' + msg; er.hidden = false; bad.push(el); } };
      chk('ho-name', $('#ho-name').value.trim().length > 1, 'Enter your name.');
      const m = $('#ho-mail').value.trim();
      chk('ho-mail', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m), m ? 'Enter an email address like name@example.com.' : 'Enter your email address.');
      chk('ho-sum', $('#ho-sum').value.trim().length >= 20, 'Write at least 20 characters, or use “Fill from this session”.');
      const se = $('#ho-err');
      se.hidden = !bad.length;
      se.textContent = bad.length ? `Fix ${bad.length} field${bad.length > 1 ? 's' : ''} marked Error.` : '';
      if (bad.length) { bad[0].focus(); $('#ho-out').innerHTML = ''; return; }
      const type = fm.querySelector('input[name="ho-type"]:checked').value;
      $('#ho-flag').hidden = true;
      $('#ho-out').innerHTML = `<div class="alert" tabindex="-1" id="ho-done"><p class="a-t">Request checked. Not sent: this site has no server.</p><dl class="kv"><div><dt>Request</dt><dd>${type === 'survey' ? 'Home survey' : 'Question'}</dd></div><div><dt>Name</dt><dd>${esc($('#ho-name').value.trim())}</dd></div><div><dt>Email</dt><dd>${esc(m)}</dd></div><div><dt>Call back</dt><dd>${esc($('#ho-when').value)}</dd></div></dl><p class="a-w">${esc($('#ho-sum').value.trim()).replace(/\n/g, '<br>')}</p></div>`;
      $('#ho-done').focus();
    });
    if (ss.get('handover', false) || location.hash === '#handover') { fill(); ss.set('handover', false); }
  }

  // ======================================================================
  // Assistant (features 1–10 meet here). Rule-based: reads data.js, no network.
  // ======================================================================
  const asst = $('#asst'), askBtn = $('.ask-btn'), log = $('#as-log'), input = $('#as-in');
  let chat = ss.get('chat', []);
  const CHIPS = {
    home: ['Will a fridge-freezer fit the small van?', 'Price for a 3 bed', 'Next free Saturday', '2 bed flat, 3rd floor no lift, Sat 14 Nov, 8 miles'],
    inventory: ['Is my list over the van?', 'Draft a 3 bed list', 'Will a 3-seat sofa fit the small van?'],
    vans: ['Which van for 30 m³?', 'Will a double wardrobe fit the small van?', 'Price for a 4 bed'],
    prices: ['Why is Saturday dearer?', 'Cost of 3 floors without a lift', 'How are hours counted?'],
    quote: ['2 bed flat, 3rd floor no lift, Sat 14 Nov, 8 miles', 'Why this total?', 'Cheapest day in November'],
    packing: ['Boxes for a 3 bed', 'Price of 20 medium boxes'],
    storage: ['Storage for 22 m³', 'Storage for a 1 bed'],
    checklist: ['Draft dates for Sat 14 Nov', 'What is left to do?'],
    faq: ['Can I cancel?', 'What will you not move?', 'Is VAT included?'],
    about: ['Ask a person', 'Is this firm real?'],
  };
  const chipBox = $('#as-chips');
  chipBox.innerHTML = (CHIPS[PAGE] || []).map((c) => `<button type="button">${esc(c)}</button>`).join('');
  chipBox.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) ask(b.textContent); });
  function paintLog() {
    log.innerHTML = chat.map((m) => (m.who === 'me' ? `<div class="msg msg--me"><p>${esc(m.text)}</p></div>` : `<div class="msg msg--bot">${m.html}</div>`)).join('');
    log.scrollTop = log.scrollHeight;
  }
  function store() { if (chat.length > 40) chat = chat.slice(-40); ss.set('chat', chat); }
  function say(html) { chat.push({ who: 'bot', html }); store(); const d = document.createElement('div'); d.className = 'msg msg--bot'; d.innerHTML = html; log.append(d); log.scrollTop = log.scrollHeight; return d; }
  const src = (k, hash, label) => `<a href="${url(k, '#' + hash)}">${esc(label)}</a>`;
  const srcLine = (...links) => `<p class="src">Source: ${links.join(' · ')}</p>`;
  function setOpen(on, focus) {
    asst.hidden = !on;
    askBtn.setAttribute('aria-expanded', on);
    document.documentElement.classList.toggle('asst-open', on);
    ss.set('asOpen', on);
    if (on) {
      if (!chat.length) say(`<p>Ask about volumes, vans, prices, dates or packing. Or describe the move in one line and the quote is filled for you to check.</p>`);
      paintLog();
      if (focus) input.focus();
    } else if (focus !== false) askBtn.focus();
  }
  askBtn.addEventListener('click', () => setOpen(asst.hidden, true));
  $('.as-close', asst).addEventListener('click', () => setOpen(false));
  asst.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !asst.hidden && asst.contains(document.activeElement)) setOpen(false); });
  // tabs inside assistant
  const at = [$('#as-t-chat'), $('#as-t-hist')];
  const selAt = (t, f) => { at.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; }); if (f) t.focus(); };
  at.forEach((t, i) => { t.addEventListener('click', () => selAt(t)); t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); selAt(at[1 - i], true); } }); });
  $('#as-clear').addEventListener('click', () => { chat = []; store(); ss.set('miss', []); paintLog(); say('<p>Chat cleared. Changes stay in the Changes tab.</p>'); input.focus(); });
  // handover links carry a flag so the About form fills itself
  document.addEventListener('click', (e) => { const a = e.target.closest('#as-hand, [data-handover]'); if (a) ss.set('handover', true); });
  $('#as-form').addEventListener('submit', (e) => { e.preventDefault(); const t = input.value.trim(); if (!t) { input.focus(); return; } input.value = ''; ask(t); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#as-form').requestSubmit(); } });

  // feature 3 in chat: short step list, then the answer
  async function withSteps(names, fn) {
    const box = say(`<ol class="pipeline">${names.map((n) => `<li data-st="wait">${esc(n)}</li>`).join('')}</ol>`);
    const lis = $$('li', box);
    for (const li of lis) { li.dataset.st = 'run'; await sleep(90); li.dataset.st = 'done'; }
    const html = await fn();
    const full = box.innerHTML + html;
    box.innerHTML = full;
    chat[chat.length - 1].html = full;
    store();
    log.scrollTop = log.scrollHeight;
  }

  function homeFrom(t) {
    const m = t.match(/\b(studio|bedsit)\b/) || t.match(/\b(\d|one|two|three|four|five)[\s-]*(?:bed|bedroom)/);
    if (!m) return null;
    const W = { one: 1, two: 2, three: 3, four: 4, five: 5 };
    const n = /studio|bedsit/.test(m[1]) ? 0 : (W[m[1]] || parseInt(m[1], 10));
    return D.HOMES[Math.max(0, Math.min(5, n))];
  }
  const volFrom = (t) => { const m = t.match(/(\d+(?:\.\d+)?)\s*(?:m3|m³|cubic|cbm)/); return m ? parseFloat(m[1]) : null; };
  const vanFrom = (t) => D.VANS.find((v) => t.includes(v.id + ' van') || t.includes(v.name.toLowerCase()));

  async function ask(text) {
    if (asst.hidden) setOpen(true, false);
    selAt(at[0]);
    chat.push({ who: 'me', text });
    store();
    const d = document.createElement('div'); d.className = 'msg msg--me'; d.innerHTML = `<p>${esc(text)}</p>`; log.append(d);
    const t = text.toLowerCase();
    const parsed = C.parseMove(text, D);
    const pf = parsed.fields;
    const describes = (pf.vol != null || pf.home) && (pf.miles != null || pf.date || pf.floorsA != null);
    const item = C.matchItem(t, D);

    // feature 2: a move described in words
    if (describes) {
      if (PAGE === 'quote' && TH.quoteFill) {
        return withSteps(['Read the words', 'Fill the fields', 'Calculate'], async () => {
          const r = TH.quoteFill(text);
          await sleep(500);
          const q = TH.quoteLast();
          return `<p>Filled the quote from your words: ${r.chips.map((c) => esc(c[1])).join(' · ')}.</p>${r.unread.length ? `<p>Not read: ${r.unread.map((u) => '“' + esc(u) + '”').join(', ')}. Check those by hand.</p>` : ''}${q ? `<p>Draft total ${C.money(q.total)}. Check the fields, then confirm.</p>` : '<p>Some fields are still empty; they are marked Error.</p>'}${srcLine(src('prices', 'p-hour', 'Prices'))}`;
        });
      }
      return withSteps(['Read the words', 'Volume and van', 'Date rate', 'Total'], async () => {
        const inp = { vol: pf.vol, miles: pf.miles || 0, floorsA: pf.floorsA || 0, liftA: !!pf.liftA, floorsB: pf.floorsB || 0, liftB: !!pf.liftB, packing: !!pf.packing, date: pf.date || '' };
        const q = inp.vol <= D.MAX_M3 ? C.quote(inp, D) : null;
        const p = new URLSearchParams({ text });
        return `<p>Read: ${parsed.chips.map((c) => esc(c[1])).join(' · ')}.</p>${parsed.unread.length ? `<p>Not read: ${parsed.unread.map((u) => '“' + esc(u) + '”').join(', ')}.</p>` : ''}${q ? `<p>About ${C.money(q.total)}: ${esc(C.fitLine(q.fit))}, ${q.fit.crew} crew, ${C.num(q.hours.hours, 1)} h${pf.miles == null ? ', distance not given (0 mi used)' : ''}${pf.date ? '' : ', no date (weekday rate used)'}.</p>` : `<p>Over ${D.MAX_M3} m³: home survey.</p>`}<p class="acts"><a class="btn btn--pri" href="${url('quote', '?' + p)}">Put this into the quote</a></p>${srcLine(src('prices', 'r-rate-' + (q ? q.fit.vans[0].id : 'large'), 'Hourly rates'))}`;
      });
    }
    // feature 5 via chat: drafts
    if (/draft|make (?:a|my) list|fill (?:the|my) list/.test(t) && PAGE === 'inventory' && homeFrom(t)) {
      const h = homeFrom(t);
      return withSteps(['Home size', 'Typical items', 'Total and van'], async () => {
        const total = TH.invDraft(h.id);
        const f = C.vansFor(total, D.VANS, D.MAX_M3);
        return `<p>Drafted a ${esc(h.label)} list: ${C.m3(total)} m³, ${esc(C.vanLine(f))}. Marked Draft until you confirm it. Change any count first.</p>${srcLine(src('', 'r-home-' + h.id, 'Volume by home'))}`;
      });
    }
    if (/draft|plan/.test(t) && PAGE === 'checklist' && pf.date) {
      const ok = TH.checkDraft(pf.date);
      return say(ok ? `<p>Dated each group back from ${esc(C.fmtDate(pf.date))}. Marked Draft until you confirm. Late groups are flagged above the list.</p>` : `<p>${esc(C.fmtDate(pf.date))} is outside ${esc(C.fmtDate(D.TODAY))} to ${esc(C.fmtDate(D.RANGE.to))}.</p>`);
    }
    if (/draft/.test(t) && (/list|inventory/.test(t)) && PAGE !== 'inventory') {
      const h = homeFrom(t) || D.HOMES[2];
      return say(`<p>Lists are drafted on the Inventory page.</p><p class="acts"><a class="btn btn--pri" href="${url('inventory', '?draft=' + h.id)}">Draft a ${esc(h.label)} list there</a></p>`);
    }
    // context: this page's current figures
    if (/over the van|my list|my total|how full/.test(t) && TH.invTotal) {
      const total = TH.invTotal();
      if (!total) return say('<p>Nothing counted yet. Draft a list from the home size, or paste one.</p>');
      const f = C.vansFor(total, D.VANS, D.MAX_M3);
      if (f.over) return say(`<p>${C.m3(total)} m³ is over ${D.MAX_M3} m³: two vans cannot take it in a day. A person should survey.</p><p class="acts"><a class="btn" data-handover href="${url('about', '#handover')}">Hand over to a person</a></p>`);
      const pct = Math.round((total / f.cap) * 100);
      return say(`<p>${C.m3(total)} m³ in the ${esc(C.vanLine(f).toLowerCase())}: ${pct} % full. ${pct >= 90 ? 'Close to full; lists grow on the day.' : 'Room to spare.'}</p>${srcLine(src('vans', 'v-' + f.vans[0].id, f.vans[0].name))}`);
    }
    if (/why this total|explain|breakdown/.test(t) && TH.quoteLast) {
      const q = TH.quoteLast();
      if (!q) return say('<p>No total yet. Fill the volume, distance and date first.</p>');
      return say(`<p>${C.money(q.total)} is:</p><ul>${q.rows.filter((r) => r[1]).map(([k, v, s]) => `<li>${esc(k)}: ${C.money(v)} (${src('prices', s, 'source')})</li>`).join('')}</ul>`);
    }
    if (/left to do|what.*left|remaining/.test(t) && TH.checkLeft) {
      const s = TH.checkState();
      const left = TH.checkLeft();
      return say(`<p>${left} of ${D.CHECK_IDS.length} items left${s.date ? `, moving day ${esc(C.fmtDate(s.date))}` : ''}.${s.date ? '' : ' Give a moving day to date each group.'}</p>`);
    }
    if (/piano|gas bottle|paint|fuel/.test(t)) { const [q, a] = D.FAQ[4]; return say(`<p>${esc(a)}</p>${srcLine(src('faq', 'faq-5', q))}<p class="acts"><a class="btn" data-handover href="${url('about', '#handover')}">Hand over to a person</a></p>`); }
    // fit questions
    if (item && /fit|go in|take|get in/.test(t)) {
      const v = vanFrom(t);
      const lines = C.fitAnswer(item.id, v ? v.id : '', D);
      return say(`<ul>${lines.map((l) => `<li>${esc(l.line)}</li>`).join('')}</ul>${srcLine(...lines.map((l) => src('vans', 'v-' + l.van.id, l.van.name)))}`);
    }
    // which van / volume
    const vol = volFrom(t);
    if (vol != null && /van|which|fit|need/.test(t)) {
      const f = C.vansFor(vol, D.VANS, D.MAX_M3);
      if (!f || f.over) return say(`<p>${C.m3(vol)} m³ is over ${D.MAX_M3} m³: home survey.</p>`);
      return say(`<p>${C.m3(vol)} m³: ${esc(C.vanLine(f))}, ${f.crew} crew, from ${C.money(C.fromPrice(f))}.</p>${srcLine(src('vans', 'v-' + f.vans[0].id, f.vans[0].name))}`);
    }
    if (/storage|store|unit/.test(t)) {
      const h = homeFrom(t);
      const need = vol != null ? vol : h ? h.m3 : null;
      if (need == null) return say(`<p>Units from ${D.UNITS[0].m2} to ${D.UNITS[4].m2} m², ${C.money(D.UNITS[0].week)} to ${C.money(D.UNITS[4].week)} a week. Give a volume or home size for one size.</p>${srcLine(src('storage', 'u-0', 'Storage units'))}`);
      const i = D.UNITS.findIndex((u) => u.m3 >= need);
      if (i < 0) return say(`<p>${C.m3(need)} m³ needs two units. The largest holds ${D.UNITS[4].m3} m³.</p>${srcLine(src('storage', 'u-4', 'Largest unit'))}`);
      const u = D.UNITS[i];
      return say(`<p>${C.m3(need)} m³: the ${C.num(u.m2, 1)} m² unit, ${C.money(u.week)} a week. It holds ${C.num(u.m3, 1)} m³.</p>${srcLine(src('storage', 'u-' + i, C.num(u.m2, 1) + ' m² unit'))}`);
    }
    if (/box/.test(t)) {
      const pm = t.match(/(\d+)\s*(small|medium|large|wardrobe)/);
      if (pm) { const b = D.BOXES.find((x) => x.name.toLowerCase().startsWith(pm[2])); return say(`<p>${pm[1]} ${esc(b.name.toLowerCase())}es: ${pm[1]} × ${C.money(b.price)} = ${C.money(pm[1] * b.price)}.</p>${srcLine(src('packing', 'pk-box', 'Boxes table'))}`); }
      const h = homeFrom(t) || D.HOMES[2];
      const rooms = { studio: ['Kitchen', 'Living room', 'Main bedroom', 'Bathroom'], '1bed': ['Kitchen', 'Living room', 'Main bedroom', 'Bathroom'], '2bed': ['Kitchen', 'Living room', 'Main bedroom', 'Second bedroom', 'Bathroom'] }[h.id] || ['Kitchen', 'Living room', 'Main bedroom', 'Second bedroom', 'Second bedroom', 'Bathroom', 'Study', 'Shed or garage'].slice(0, 4 + (+h.id[0]));
      const n = rooms.reduce((a, r) => { const x = D.BOX_RULE.find((y) => y[0] === r); return a + x[1] + x[2] + x[3] + x[4]; }, 0);
      return say(`<p>${esc(h.label)}: about ${n} boxes (${rooms.map(esc).join(', ')}).</p>${srcLine(src('packing', 'pk-room', 'Boxes per room'))}`);
    }
    if (/stair|lift|floor/.test(t)) {
      const m = t.match(/(\d+)\s*(?:floors?|flights?)/);
      const n = m ? +m[1] : 1;
      return say(`<p>${C.money(D.RATES.perFloor)} a floor, each address, without a lift${m ? `: ${n} floor${n > 1 ? 's' : ''} = ${C.money(n * D.RATES.perFloor)}` : ''}. With a lift, nothing.</p>${srcLine(src('prices', 'r-stairs-' + Math.min(4, n), 'Stairs table'))}`);
    }
    if (/saturday|sunday|weekend|surcharge|dearer|month end/.test(t)) {
      const R = D.RATES.surcharge;
      return say(`<p>Saturday +${R.sat} %, Sunday +${R.sun} %, last two days of a month +${R.monthEnd} %, on labour and stairs. Most people move then, so crews cost more.</p>${srcLine(src('prices', 'r-sat', 'Saturday'), src('prices', 'r-sun', 'Sunday'), src('prices', 'r-monthend', 'Month end'))}`);
    }
    if (/cheapest|free|available|earliest|next|when/.test(t) && /date|day|saturday|sunday|weekday|free|available|november|december|january|when/.test(t)) {
      const wd = /saturday/.test(t) ? 6 : /sunday/.test(t) ? 0 : null;
      const mon = /november/.test(t) ? '2026-11' : /december/.test(t) ? '2026-12' : /january/.test(t) ? '2027-01' : null;
      return withSteps(['Read the calendar', 'Skip full dates', 'Sort by rate'], async () => {
        const list = [];
        for (let s = C.addDays(D.TODAY, D.NOTICE_DAYS); s <= D.RANGE.to && list.length < 4; s = C.addDays(s, 1)) {
          const i = C.dateInfo(s, D);
          if (mon && s.slice(0, 7) !== mon) continue;
          if (wd != null ? C.D0(s).getUTCDay() === wd && (i.status === 'open' || i.status === 'surcharge') : i.status === 'open') list.push(s);
        }
        if (!list.length) return '<p>No free date matches.</p>';
        return `<p>${wd != null ? 'Free' : 'Standard-rate'} dates:</p><ul>${list.map((s) => `<li><a href="${url('quote', '?d=' + s)}">${esc(C.dateLine(s, D))}</a></li>`).join('')}</ul>${srcLine(src('quote', 'cal', 'Calendar'))}`;
      });
    }
    const h = homeFrom(t);
    if (h && /price|cost|how much|quote|£/.test(t)) {
      const f = C.vansFor(h.m3, D.VANS, D.MAX_M3);
      return say(`<p>${esc(h.label)}: about ${h.m3} m³, ${esc(C.vanLine(f))}, ${f.crew} crew, from ${C.money(C.fromPrice(f))} (${f.min} h minimum, weekday, within ${D.RATES.freeMiles} mi, no stairs).</p>${srcLine(src('', 'r-home-' + h.id, 'Volume by home'), src('prices', f.vans.length > 1 ? 'r-two' : 'r-rate-' + f.vans[0].id, 'Hourly rate'))}`);
    }
    if (h) {
      const f = C.vansFor(h.m3, D.VANS, D.MAX_M3);
      return say(`<p>${esc(h.label)}: about ${h.m3} m³, ${esc(C.vanLine(f))}.</p>${srcLine(src('', 'r-home-' + h.id, 'Volume by home'))}`);
    }
    const faq = [[/cancel/, 8], [/vat|tax/, 2], [/cover|damage|insur|break/, 9], [/hour|how long|counted/, 1], [/not move|won.t move|piano|gas|paint/, 5], [/notice|how soon|advance/, 6], [/longer|overrun|extra time/, 3], [/apart|dismantle|assemble/, 4]];
    for (const [re, n] of faq) if (re.test(t)) {
      const [q, a] = D.FAQ[n - 1];
      return say(`<p>${esc(a)}</p>${srcLine(src('faq', 'faq-' + n, q))}`);
    }
    if (/price|cost|how much|rate/.test(t)) return say(`<p>Small van ${C.money(D.VANS[0].rate)}, medium ${C.money(D.VANS[1].rate)}, large ${C.money(D.VANS[2].rate)} an hour, VAT included.</p>${srcLine(src('prices', 'p-hour', 'Hourly'))}`);
    if (/real|fiction|exist|genuine/.test(t)) return say(`<p>No. Thrumley Removals, Caddonford and the QV postcodes are fictional. Nothing on this site is sent.</p>${srcLine(src('about', 'a-notice', 'Notice'))}`);
    if (/person|human|someone|call|survey|talk/.test(t)) return say(`<p>The request form is filled from this tab: inventory, quote, checklist and your questions. You check it before anything else.</p><p class="acts"><a class="btn btn--pri" data-handover href="${url('about', '#handover')}">Hand over to a person</a></p>`);
    if (/undo|revert|back/.test(t)) { return say('<p>Every change I make is in the Changes tab, each with Undo.</p>'); }
    // nothing matched
    const miss = ss.get('miss', []); miss.push(text); ss.set('miss', miss.slice(-6));
    return say(`<p>The rules do not cover that. Try a number of bedrooms, an item and a van, a date, or a volume in m³.</p><p class="acts"><a class="btn" data-handover href="${url('about', '#handover')}">Hand over to a person</a></p>`);
  }

  if (ss.get('asOpen', false)) setOpen(true, false);
  else paintLog();
})();
