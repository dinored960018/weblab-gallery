/* 개킴세탁소 — 화면 동작. 데이터는 assets/data.js 의 window.GK */
(() => {
  const D = window.GK;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const won = (n) => n.toLocaleString('ko-KR') + '원';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const params = () => new URLSearchParams(location.search);
  const setParams = (obj) => {
    const p = params();
    Object.entries(obj).forEach(([k, v]) => (v === '' || v == null ? p.delete(k) : p.set(k, v)));
    const q = p.toString();
    try { history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch (e) { /* file:// 에서 막히면 주소만 안 바뀐다 */ }
  };

  // ── 날짜 계산(build.mjs 와 같은 규칙) ───────────────
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  const HOLI = new Set(D.holidays.map((h) => h.iso));
  const parse = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const isoOf = (dt) => dt.toISOString().slice(0, 10);
  const addDay = (dt, n = 1) => new Date(dt.getTime() + n * 864e5);
  const isOpen = (dt) => dt.getUTCDay() !== 0 && !HOLI.has(isoOf(dt));
  const md = (dt) => `${dt.getUTCMonth() + 1}월 ${dt.getUTCDate()}일(${DOW[dt.getUTCDay()]})`;
  const firstDay = (iso, time) => { let d = parse(iso); if (!isOpen(d) || time >= D.hours.cutoff) { do d = addDay(d); while (!isOpen(d)); } return d; };
  const dueDate = (iso, time, days) => { let d = firstDay(iso, time); let n = 0; while (n < days) { d = addDay(d); if (isOpen(d)) n++; } return d; };

  // ── 모바일 메뉴 ─────────────────────────────────────
  const menuBtn = $('.menu-btn'), nav = $('#nav');
  if (menuBtn && nav) {
    const setMenu = (open, focusBack = true) => {
      nav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? '닫기' : '메뉴';
      document.body.classList.toggle('menu-open', open);
      if (open) $('a', nav).focus(); else if (focusBack) menuBtn.focus();
    };
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false); });
    $$('a', nav).forEach((a) => a.addEventListener('click', () => { if (nav.classList.contains('open')) setMenu(false, false); }));
    matchMedia('(min-width: 1024px)').addEventListener('change', (m) => { if (m.matches && nav.classList.contains('open')) setMenu(false, false); });
  }

  // ── 대화상자 공용 ───────────────────────────────────
  const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';
  function dialog(dlg, { onClose } = {}) {
    let back = null;
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$(FOCUSABLE, dlg).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    dlg.addEventListener('close', () => { if (onClose) onClose(dlg.returnValue); if (back && document.contains(back)) back.focus(); });
    return {
      open(from, focusEl) { back = from || document.activeElement; if (!dlg.open) dlg.showModal(); (focusEl || $(FOCUSABLE, dlg)).focus(); },
      close() { dlg.close(); },
    };
  }

  // ── 펼침(소재·공지) ─────────────────────────────────
  function accordion(root) {
    $$('.acc-h button', root).forEach((b) => b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      document.getElementById(b.getAttribute('aria-controls')).hidden = !open;
      return open;
    }));
  }
  const openAcc = (b, open) => { b.setAttribute('aria-expanded', String(open)); document.getElementById(b.getAttribute('aria-controls')).hidden = !open; };

  // 펼침 줄 어디를 눌러도 단추를 누른 것으로
  document.querySelectorAll('.acc-row').forEach((r) => r.addEventListener('click', (e) => { if (!e.target.closest('button')) r.querySelector('button').click(); }));

  const page = document.body.dataset.page;

  // ── 세탁 요금 고르기 ────────────────────────────────
  if (page === 'prices') {
    const list = $('#price-list'), rows = $$('.ld', list), order = rows.slice();
    const sel = { cat: new Set(), method: new Set() };
    const sortEl = $('#sort');
    const p = params();
    ['cat', 'method'].forEach((g) => (p.get(g) || '').split(',').filter(Boolean).forEach((v) => sel[g].add(v)));
    if (p.get('sort') && $(`option[value="${p.get('sort')}"]`, sortEl)) sortEl.value = p.get('sort');
    const apply = () => {
      $$('.chip', $('.filters')).forEach((c) => c.setAttribute('aria-pressed', String(sel[c.dataset.g].has(c.dataset.v))));
      let n = 0;
      rows.forEach((r) => {
        const ok = (!sel.cat.size || sel.cat.has(r.dataset.cat)) && (!sel.method.size || sel.method.has(r.dataset.method));
        r.hidden = !ok; if (ok) n++;
      });
      const s = sortEl.value;
      const cmp = {
        cat: (a, b) => order.indexOf(a) - order.indexOf(b),
        low: (a, b) => a.dataset.price - b.dataset.price || order.indexOf(a) - order.indexOf(b),
        high: (a, b) => b.dataset.price - a.dataset.price || order.indexOf(a) - order.indexOf(b),
        days: (a, b) => a.dataset.days - b.dataset.days || order.indexOf(a) - order.indexOf(b),
        name: (a, b) => a.dataset.name.localeCompare(b.dataset.name, 'ko'),
      }[s];
      rows.slice().sort(cmp).forEach((r) => list.appendChild(r));
      $('#count').textContent = n;
      $('#empty').hidden = n > 0;
      $('#clear').hidden = !(sel.cat.size || sel.method.size);
      setParams({ cat: [...sel.cat].join(','), method: [...sel.method].join(','), sort: s === 'cat' ? '' : s });
    };
    $$('.chip', $('.filters')).forEach((c) => c.addEventListener('click', () => {
      const set = sel[c.dataset.g]; set.has(c.dataset.v) ? set.delete(c.dataset.v) : set.add(c.dataset.v); apply();
    }));
    sortEl.addEventListener('change', apply);
    $('#clear').addEventListener('click', () => { sel.cat.clear(); sel.method.clear(); apply(); $('.chip').focus(); });
    apply();
  }

  // ── 찾는 날 계산 ────────────────────────────────────
  if (page === 'when') {
    const form = $('#when'), dEl = $('#w-date'), tEl = $('#w-time'), outEl = $('#w-out'), msg = $('#w-date-msg');
    const boxes = $$('input[name="items"]', form);
    const p = params();
    if (p.get('date') && $(`option[value="${p.get('date')}"]`, dEl)) dEl.value = p.get('date');
    if (p.get('time') && $(`option[value="${p.get('time')}"]`, tEl)) tEl.value = p.get('time');
    if (p.get('items')) { const s = new Set(p.get('items').split(',')); boxes.forEach((b) => (b.checked = s.has(b.value))); }
    const item = Object.fromEntries(D.items.map((i) => [i.id, i]));
    const render = () => {
      const iso = dEl.value, time = tEl.value, d = parse(iso);
      const sat = d.getUTCDay() === 6;
      const fd = firstDay(iso, time);
      let m = '';
      if (!isOpen(d)) m = `이날은 휴무다. 첫날은 ${md(fd)}로 센다.`;
      else if (sat && time >= D.hours.sat.close) m = `토요일은 ${D.hours.sat.close}에 닫는다. 첫날은 ${md(fd)}로 센다.`;
      else if (time >= D.hours.cutoff) m = `${D.hours.cutoff}이 지나 첫날은 ${md(fd)}로 센다.`;
      msg.textContent = m;
      const picked = boxes.filter((b) => b.checked).map((b) => item[b.value]);
      setParams({ date: iso === D.today.iso ? '' : iso, time: time === '10:30' ? '' : time, items: ((s) => (s === 'shirt,suit' ? '' : s))(picked.map((i) => i.id).join(',')) });
      if (!picked.length) { outEl.innerHTML = '<p class="empty">품목을 하나 이상 고른다.</p>'; return; }
      const rows = picked.map((i) => ({ i, due: dueDate(iso, time, i.days) }));
      const last = rows.reduce((a, r) => (r.due > a ? r.due : a), rows[0].due);
      outEl.innerHTML = `<p class="out-all">${md(last)} ${D.hours.ready}부터</p><p class="note">고른 ${picked.length}품목을 모두 찾을 수 있는 날이다.</p><ul class="leaders">${rows.map((r) => `<li class="ld"><span class="ld-name">${esc(r.i.name)}<small>${r.i.methodName} · ${r.i.days}일</small></span><span class="ld-fill" aria-hidden="true"></span><span class="ld-val">${md(r.due)}</span></li>`).join('')}</ul>`;
    };
    form.addEventListener('change', render);
    form.addEventListener('submit', (e) => e.preventDefault());
    render();
  }

  // ── 접수 조회 ───────────────────────────────────────
  if (page === 'track') {
    const form = $('#track'), noEl = $('#t-no'), tailEl = $('#t-tail'), res = $('#t-result');
    const setErr = (el, text) => { const m = $('#' + el.id + '-msg'); m.textContent = text; el.setAttribute('aria-invalid', text ? 'true' : 'false'); };
    const show = (t) => {
      res.hidden = false;
      $('#tr-no').textContent = t.no;
      const ready = t.stage === D.stages.length - 1;
      $$('#tr-stages li').forEach((li, i) => { li.className = i < t.stage ? 'past' : i === t.stage ? 'now' + (ready ? ' ready' : '') : ''; if (i === t.stage) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      const fill = $('#tr-fill');
      fill.style.transition = 'none'; fill.style.transform = 'scaleX(0)'; fill.classList.toggle('done', ready);
      void fill.offsetWidth; fill.style.transition = '';
      requestAnimationFrame(() => { fill.style.transform = `scaleX(${(t.stage + 1) / D.stages.length})`; });
      $('#tr-now').textContent = ready ? `찾을 수 있음 · 선반 ${t.shelf}` : t.out ? `${D.stages[t.stage]} · 외부 전문점에서 처리 중` : `지금 단계: ${D.stages[t.stage]}`;
      $('#tr-items').innerHTML = t.items.map((i) => `<li class="ld"><span class="ld-name">${esc(i.name)}<small>${i.method} · ${i.days}일</small></span><span class="ld-fill" aria-hidden="true"></span><span class="ld-val">${won(i.price)}</span></li>`).join('');
      const sum = t.items.reduce((a, i) => a + i.price, 0);
      $('#tr-facts').innerHTML = `<div><dt>맡긴 때</dt><dd>${t.at}</dd></div><div><dt>찾는 날</dt><dd>${t.due} ${D.hours.ready}부터</dd></div><div><dt>품목</dt><dd>${t.items.length}점</dd></div><div><dt>합계</dt><dd>${won(sum)}</dd></div>`;
      $('#h-tres').focus();
    };
    const run = () => {
      let no = noEl.value.trim().replace(/\s/g, '');
      if (/^\d{7}$/.test(no)) no = no.slice(0, 4) + '-' + no.slice(4);
      noEl.value = no;
      const tail = tailEl.value.trim();
      let bad = false;
      if (!/^\d{4}-\d{3}$/.test(no)) { setErr(noEl, '접수번호는 1006-014처럼 숫자 4자리, 붙임표, 숫자 3자리다.'); bad = true; } else setErr(noEl, '');
      if (!/^\d{4}$/.test(tail)) { setErr(tailEl, '전화번호 뒷자리 숫자 4개를 적는다.'); bad = true; } else setErr(tailEl, '');
      if (bad) { res.hidden = true; form.querySelector('[aria-invalid="true"]').focus(); return; }
      const t = D.tickets.find((x) => x.no === no);
      if (!t) { setErr(noEl, '그 번호의 접수 기록이 없다. 접수증의 번호를 다시 본다.'); res.hidden = true; noEl.focus(); return; }
      if (t.tail !== tail) { setErr(tailEl, '전화번호 뒷자리가 접수 기록과 다르다.'); res.hidden = true; tailEl.focus(); return; }
      setParams({ no });
      show(t);
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); run(); });
    $$('.ex [data-no]').forEach((b) => b.addEventListener('click', () => { noEl.value = b.dataset.no; tailEl.value = b.dataset.tail; run(); }));
    const p = params();
    if (p.get('no')) { noEl.value = p.get('no'); if (p.get('tail')) { tailEl.value = p.get('tail'); run(); } }
  }

  // ── 세탁 기호 ───────────────────────────────────────
  if (page === 'labels') {
    const grid = $('#sym-grid'), cells = $$('li', grid), dlgEl = $('#sym-dlg');
    const by = Object.fromEntries(D.labels.map((l) => [l.id, l]));
    let current = null;
    const dlg = dialog(dlgEl, { onClose: () => { current = null; setParams({ sym: '' }); } });
    const setGroup = (g) => {
      $$('[data-lg]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lg === g)));
      let n = 0; cells.forEach((c) => { const ok = g === 'all' || c.dataset.g === g; c.hidden = !ok; if (ok) n++; });
      $('#l-count').textContent = n;
      setParams({ g: g === 'all' ? '' : g });
    };
    const visible = () => cells.filter((c) => !c.hidden).map((c) => $('button', c));
    const fill = (id) => {
      const l = by[id]; current = id;
      $('#sd-sym').innerHTML = $(`[data-sym="${id}"] svg`, grid).outerHTML;
      $('#sd-group').textContent = l.gName;
      $('#sd-name').textContent = l.name;
      $('#sd-mean').textContent = l.mean;
      $('#sd-ours').textContent = l.ours;
      setParams({ sym: id });
    };
    const step = (d) => { const v = visible(); const i = v.findIndex((b) => b.dataset.sym === current); const nb = v[(i + d + v.length) % v.length]; fill(nb.dataset.sym); };
    $$('[data-lg]').forEach((b) => b.addEventListener('click', () => setGroup(b.dataset.lg)));
    $$('.sym-btn', grid).forEach((b) => b.addEventListener('click', () => { fill(b.dataset.sym); dlg.open(b, $('#sd-close')); }));
    $$('.sym-name', grid).forEach((n) => n.addEventListener('click', () => n.previousElementSibling.click()));
    $$('[data-step]', dlgEl).forEach((b) => b.addEventListener('click', () => step(+b.dataset.step)));
    $('#sd-close').addEventListener('click', () => dlg.close());
    dlgEl.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } });
    const p = params();
    if (p.get('g') && $(`[data-lg="${p.get('g')}"]`)) setGroup(p.get('g'));
    if (p.get('sym') && by[p.get('sym')]) { const b = $(`[data-sym="${p.get('sym')}"]`, grid); fill(p.get('sym')); dlg.open(b, $('#sd-close')); }
  }

  // ── 얼룩 탭 ─────────────────────────────────────────
  if (page === 'stains') {
    const tabs = $$('[role="tab"]');
    const select = (t, focus = true) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
      if (focus) t.focus();
      setParams({ stain: t === tabs[0] ? '' : t.dataset.id });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (k === undefined) return;
        e.preventDefault(); select(tabs[(k + tabs.length) % tabs.length]);
      });
    });
    const s = params().get('stain'); const t = s && tabs.find((x) => x.dataset.id === s);
    if (t) select(t, false);
  }

  // ── 소재 ────────────────────────────────────────────
  if (page === 'fabrics') accordion(document);

  // ── 공지 ────────────────────────────────────────────
  if (page === 'notices') {
    const items = $$('#n-list .acc');
    $$('.acc-h button').forEach((b) => b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true'; openAcc(b, open);
      setParams({ open: open ? b.closest('.acc').id : '' });
    }));
    const setCat = (c) => {
      $$('[data-nc]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.nc === c)));
      let n = 0; items.forEach((it) => { const ok = c === 'all' || it.dataset.cat === c; it.hidden = !ok; if (ok) n++; });
      $('#n-count').textContent = n;
      setParams({ cat: c === 'all' ? '' : c });
    };
    $$('[data-nc]').forEach((b) => b.addEventListener('click', () => setCat(b.dataset.nc)));
    const p = params();
    if (p.get('cat') && $(`[data-nc="${p.get('cat')}"]`)) setCat(p.get('cat'));
    const o = p.get('open') && document.getElementById(p.get('open'));
    if (o) { o.hidden = false; const b = $('.acc-h button', o); openAcc(b, true); o.scrollIntoView({ block: 'center' }); }
  }

  // ── 수거·배달 신청 ──────────────────────────────────
  if (page === 'pickup') {
    const P = D.pickup, form = $('#pickup'), done = $('#p-done');
    const qty = Object.fromEntries(P.groups.map((g) => [g.id, 0]));
    const estOf = () => P.groups.reduce((a, g) => a + qty[g.id] * g.est, 0);
    const countOf = () => Object.values(qty).reduce((a, b) => a + b, 0);
    const renderSum = () => {
      const e = estOf();
      $('#p-est').textContent = won(e);
      $('#p-fee').textContent = countOf() ? (e >= P.min ? '없음' : won(P.fee)) : '—';
      $$('.stepper').forEach((s) => { const v = qty[s.dataset.id]; $('output', s).textContent = v; $('[data-d="-1"]', s).disabled = v === 0; $('[data-d="1"]', s).disabled = v === 20; });
    };
    $$('.stepper').forEach((s) => $$('button', s).forEach((b) => b.addEventListener('click', () => {
      qty[s.dataset.id] = Math.max(0, Math.min(20, qty[s.dataset.id] + +b.dataset.d)); renderSum();
      if (b.disabled) $(`[data-d="${-b.dataset.d}"]`, s).focus();
    })));
    const slotsEl = $('#p-slots');
    $$('input[name="day"]', form).forEach((r) => r.addEventListener('change', () => {
      const list = r.dataset.sat === 'true' ? P.slots.sat : P.slots.week;
      slotsEl.innerHTML = list.map((s) => `<label class="opt"><input type="radio" name="slot" value="${s}"><span>${s}</span></label>`).join('');
    }));
    const msg = (id, text) => { const m = $('#' + id + '-msg'); m.textContent = text; const el = $('#' + id); if (el && el.matches('input, select')) el.setAttribute('aria-invalid', text ? 'true' : 'false'); };
    const val = () => {
      const errs = [];
      const f = (id, text, focusSel) => { msg(id, text); if (text) errs.push({ text, focusSel: focusSel || '#' + id }); };
      const dong = $('#p-dong').value;
      f('p-dong', !dong ? '동을 고른다.' : dong === 'other' ? '묵내1·2·3동 밖은 수거하지 않는다. 가게로 가져온다.' : '');
      f('p-addr', $('#p-addr').value.trim().length < 5 ? '주소를 동·호수까지 적는다.' : '');
      const day = $('input[name="day"]:checked', form);
      f('p-day', !day ? '수거 날짜를 고른다.' : '', 'input[name="day"]');
      f('p-slot', day && !$('input[name="slot"]:checked', form) ? '시간대를 고른다.' : '', 'input[name="slot"]');
      f('p-qty', !countOf() ? '옷을 한 점 이상 적는다.' : '', '.stepper [data-d="1"]');
      f('p-name', $('#p-name').value.trim().length < 2 ? '이름을 두 글자 이상 적는다.' : '');
      f('p-phone', !/^01[0-9]-?\d{3,4}-?\d{4}$/.test($('#p-phone').value.trim()) ? '휴대전화는 010-1234-5678 형식으로 적는다.' : '');
      f('p-agree', !$('#p-agree').checked ? '확인란에 표시한다.' : '', '#p-agree');
      return errs;
    };
    const sumBox = $('#p-errs');
    const summary = () => {
      const day = $('input[name="day"]:checked', form), slot = $('input[name="slot"]:checked', form), e = estOf();
      const fee = e >= P.min ? 0 : P.fee;
      const list = P.groups.filter((g) => qty[g.id]).map((g) => `${g.name} ${qty[g.id]}`).join(', ');
      return `<div><dt>곳</dt><dd>${esc($('#p-dong').value)} ${esc($('#p-addr').value.trim())}</dd></div><div><dt>때</dt><dd>${esc(day.nextElementSibling.textContent)} ${esc(slot.value)}</dd></div><div><dt>옷</dt><dd>${esc(list)}</dd></div><div><dt>어림 금액</dt><dd>${won(e + fee)}${fee ? `(수거·배달비 ${won(fee)} 포함)` : ''}</dd></div><div><dt>신청자</dt><dd>${esc($('#p-name').value.trim())} · ${esc($('#p-phone').value.trim())}</dd></div>`;
    };
    const dlgEl = $('#p-dlg');
    const dlg = dialog(dlgEl);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = val();
      if (errs.length) {
        sumBox.hidden = false;
        $('ul', sumBox).innerHTML = errs.map((x, i) => `<li><a href="#pickup" data-i="${i}">${esc(x.text)}</a></li>`).join('');
        $$('a', sumBox).forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); const t = $(errs[+a.dataset.i].focusSel, form); if (t) t.focus(); }));
        sumBox.focus();
        return;
      }
      sumBox.hidden = true;
      $('#pd-facts').innerHTML = summary();
      dlg.open($('button[type="submit"]', form), $('#pd-ok'));
    });
    $('#pd-back').addEventListener('click', () => dlg.close());
    $('#pd-ok').addEventListener('click', () => {
      $('#p-done-facts').innerHTML = $('#pd-facts').innerHTML;
      dlg.close();
      form.hidden = true; done.hidden = false; $('#h-pdone').focus();
    });
    $('#p-again').addEventListener('click', () => { form.reset(); Object.keys(qty).forEach((k) => (qty[k] = 0)); slotsEl.innerHTML = '<p class="hint">날짜를 먼저 고른다.</p>'; renderSum(); done.hidden = true; form.hidden = false; $('#p-dong').focus(); });
    renderSum();
  }
})();
