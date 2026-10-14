// 저울마루 — 화면 동작
(function () {
  'use strict';
  const J = window.JM, C = window.JMCALC;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const params = new URLSearchParams(location.search);
  const rel = document.body.dataset.page === 'home' ? '' : '../';
  const link = (id, q = '') => rel + (id === 'home' ? 'index.html' : `${id}/index.html`) + q;
  const setQuery = (obj) => {
    const u = new URL(location.href);
    Object.entries(obj).forEach(([k, v]) => (v === null || v === '' ? u.searchParams.delete(k) : u.searchParams.set(k, v)));
    try { history.replaceState(null, '', u.search ? u.pathname + u.search + u.hash : u.pathname + u.hash); } catch (e) { /* file:// 에서 막히면 무시 */ }
  };
  const kv = (rows) => `<dl class="kv">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;

  // 필드 오류
  function setErr(id, msg) {
    const el = document.getElementById(id);
    const box = document.getElementById(`${id}-err`);
    if (el) el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (box) { box.textContent = msg || ''; box.hidden = !msg; }
  }

  // ── 모바일 메뉴 ──────────────────────────────────────
  const btn = $('.menu-btn'), nav = $('#nav');
  if (btn && nav) {
    const close = (focus) => {
      nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open');
      if (focus) btn.focus();
    };
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      if (!open) return close(false);
      nav.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open');
      const first = $('a', nav); if (first) first.focus();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') close(true); });
    window.matchMedia('(min-width: 1241px)').addEventListener('change', (m) => { if (m.matches) close(false); });
  }

  // ── 눈금자 바늘: 스크롤 위치 → 0~1000 g ───────────────
  const needle = $('.needle'), readV = $('.read-v'), track = $('.track');
  const marks = $$('.marks a');
  const secs = $$('.sec[data-g]');
  if (needle && readV && track) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const g = Math.round(p * 1000);
      readV.textContent = String(g);
      const vertical = getComputedStyle(track.querySelector('.scale')).borderRightStyle !== 'none' && window.innerWidth > 960;
      if (!reduce.matches) {
        needle.style.transform = vertical ? `translateY(${p * track.clientHeight}px)` : `translateX(${p * track.clientWidth}px)`;
      }
      // 지금 보고 있는 구획 = 화면 위 1/3 선을 지난 마지막 구획
      let cur = secs[0];
      const line = window.innerHeight / 3;
      secs.forEach((s) => { if (s.getBoundingClientRect().top <= line) cur = s; });
      if (max > 0 && window.scrollY >= max - 2) cur = secs[secs.length - 1];
      marks.forEach((a) => {
        const on = cur && a.getAttribute('href') === `#${cur.id}`;
        a.classList.toggle('on', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    update();
  }

  const page = document.body.dataset.page;

  // ── 검정 주기 ────────────────────────────────────────
  if (page === 'cycle') {
    const form = $('#cycle-form'), out = $('#cycle-out'), type = $('#cy-type'), last = $('#cy-last');
    if (params.get('type') && $(`option[value="${CSS.escape(params.get('type'))}"]`, type)) type.value = params.get('type');
    if (params.has('last')) last.value = params.get('last');
    const run = (write) => {
      const r = C.cycle(type.value, last.value);
      setErr('cy-type', r.errors && r.errors.type);
      setErr('cy-last', r.errors && r.errors.last);
      if (r.errors) {
        out.innerHTML = '<p class="empty">입력을 고치면 결과가 나옵니다.</p>';
        return false;
      }
      let head;
      if (r.status === 'ok') head = `<p class="verdict pass-t">유효 · 남은 일수 <span class="mono">${r.left}</span>일</p>`;
      else if (r.status === 'grace') head = `<p class="verdict fail-t">만료 <span class="mono">${-r.left}</span>일 경과 · 유예 중</p>`;
      else head = `<p class="verdict fail-t">만료 <span class="mono">${-r.left}</span>일 경과</p>`;
      const rows = [
        ['저울 종류', `${esc(r.type.name)} · 주기 ${r.type.cycle}개월`],
        ['마지막 검정일', C.ymd(r.last)],
        ['다음 만료일', `<strong>${C.ymd(r.expiry)}</strong>`],
        ['유예 끝', `${C.ymd(r.graceEnd)} (만료 후 ${J.GRACE_DAYS}일)`],
      ];
      out.innerHTML = head + kv(rows) + (r.status === 'ok'
        ? (r.left <= 60 ? `<p class="fine">만료 60일 안 · 미리 예약하면 대기 없이 접수됩니다.</p><p><a href="${link('booking')}">예약하기</a></p>` : '')
        : `<p>${r.status === 'grace' ? '유예 기간 안에 접수하면 정기 검정으로 받습니다.' : '유예 기간이 지났습니다. 거래에 쓰지 말고 검정을 접수하세요.'}</p><p><a href="${link('booking')}">예약하기</a></p>`);
      if (write) setQuery({ type: type.value, last: last.value.trim() });
      return true;
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); if (!run(true)) (type.getAttribute('aria-invalid') === 'true' ? type : last).focus(); });
    type.addEventListener('change', () => run(true));
    run(false);
  }

  // ── 허용오차 판정 ────────────────────────────────────
  if (page === 'tolerance') {
    const form = $('#tol-form'), list = $('#tol-rows'), add = $('#tol-add'), out = $('#tol-out');
    const cap = $('#tol-cap'), e = $('#tol-e'), beam = $('.beam');
    const MAX = J.TOL_LIMITS.maxRows;
    const rowHtml = (i, r = '', d = '') => {
      const n = i + 1;
      return `<li class="pt" data-i="${i}"><span class="pt-n mono" aria-hidden="true">${String(n).padStart(2, '0')}</span>
        <div class="f"><label class="sr" for="pt-ref-${n}">${n}번 점 기준 분동 값 (g)</label><input id="pt-ref-${n}" class="pt-ref" type="text" inputmode="decimal" value="${esc(r)}" aria-describedby="pt-ref-${n}-err"><p class="err" id="pt-ref-${n}-err" hidden></p></div>
        <div class="f"><label class="sr" for="pt-disp-${n}">${n}번 점 표시 값 (g)</label><input id="pt-disp-${n}" class="pt-disp" type="text" inputmode="decimal" value="${esc(d)}" aria-describedby="pt-disp-${n}-err"><p class="err" id="pt-disp-${n}-err" hidden></p></div>
        <button type="button" class="btn-line pt-del" aria-label="${n}번 점 지우기">지우기</button></li>`;
    };
    const readRows = () => $$('.pt', list).map((li) => [$('.pt-ref', li).value, $('.pt-disp', li).value]);
    const render = (rows) => {
      list.innerHTML = rows.map(([r, d], i) => rowHtml(i, r, d)).join('');
      add.disabled = rows.length >= MAX;
      $$('.pt-del', list).forEach((b) => { b.disabled = rows.length <= 1; });
    };
    // 주소 복원 ?cap=&e=&pts=500:500,2000:2002
    if (params.has('cap')) cap.value = params.get('cap');
    if (params.has('e')) e.value = params.get('e');
    if (params.has('pts')) {
      const rows = params.get('pts').split(',').slice(0, MAX).map((p) => p.split(':')).map(([r = '', d = '']) => [r, d]);
      if (rows.length) render(rows);
    } else render(readRows());

    add.addEventListener('click', () => {
      const rows = readRows(); if (rows.length >= MAX) return;
      rows.push(['', '']); render(rows);
      $(`#pt-ref-${rows.length}`).focus();
    });
    list.addEventListener('click', (ev) => {
      const b = ev.target.closest('.pt-del'); if (!b) return;
      const i = +b.closest('.pt').dataset.i;
      const rows = readRows(); if (rows.length <= 1) return;
      rows.splice(i, 1); render(rows);
      const next = $(`#pt-ref-${Math.min(i, rows.length - 1) + 1}`); if (next) next.focus();
    });

    const tilt = (deg) => {
      if (!beam) return;
      if (reduce.matches) { beam.classList.remove('anim'); beam.style.transform = `rotate(${deg}deg)`; return; }
      beam.classList.remove('anim');
      beam.style.transform = `rotate(${deg === 0 ? -9 : -deg * 1.6}deg)`; // 먼저 반대쪽으로 크게 기울었다가
      void beam.getBoundingClientRect();
      requestAnimationFrame(() => { beam.classList.add('anim'); beam.style.transform = `rotate(${deg}deg)`; });
    };

    const run = (write, focusErr) => {
      const rows = readRows();
      const r = C.tolerance(cap.value, e.value, rows);
      setErr('tol-cap', r.errors && r.errors.cap);
      setErr('tol-e', r.errors && r.errors.e);
      const re = $('#tol-rows-err'); re.textContent = (r.errors && r.errors.rows) || ''; re.hidden = !(r.errors && r.errors.rows);
      rows.forEach((_, i) => {
        const er = (r.rowErr && r.rowErr[i]) || {};
        setErr(`pt-ref-${i + 1}`, er.ref); setErr(`pt-disp-${i + 1}`, er.disp);
      });
      if (r.errors) {
        out.innerHTML = '<p class="empty">입력을 고치면 판정이 나옵니다.</p>';
        if (focusErr) { const f = $('[aria-invalid="true"]', form); if (f) f.focus(); }
        return;
      }
      const verdict = r.pass
        ? '<p class="verdict pass-t">판정: 합격</p>'
        : `<p class="verdict fail-t">판정: 불합격 · ${r.res.length}점 중 ${r.failCount}점 벗어남</p>`;
      const tbl = `<div class="tbl-wrap"><table class="tbl tol-res"><caption>눈금 수 ${C.num(r.divs, 1)}개 · e ${C.num(r.e)} g</caption>
        <thead><tr><th scope="col">점</th><th scope="col">기준 (g)</th><th scope="col">표시 (g)</th><th scope="col">편차 (g)</th><th scope="col">허용 (g)</th><th scope="col">점 판정</th></tr></thead>
        <tbody>${r.res.map((p, i) => `<tr><th scope="row" class="mono">${String(i + 1).padStart(2, '0')}</th><td class="mono">${C.num(p.ref)}</td><td class="mono">${C.num(p.disp)}</td><td class="mono${p.pass ? '' : ' dev-bad'}">${C.signed(p.dev)}</td><td class="mono">± ${C.num(p.allow)} <small>(${p.k} e)</small></td><td>${p.pass ? '<span class="pass-t">합격</span>' : '<strong class="fail-t">불합격</strong>'}</td></tr>`).join('')}</tbody></table></div>`;
      out.innerHTML = verdict + tbl;
      tilt(r.pass ? 0 : r.lean * 7);
      if (write) setQuery({ cap: cap.value.trim(), e: e.value.trim(), pts: rows.map(([a, b]) => `${a.trim()}:${b.trim()}`).join(',') });
    };
    form.addEventListener('submit', (ev) => { ev.preventDefault(); run(true, true); });
    run(false, false);
  }

  // ── 수수료 ───────────────────────────────────────────
  if (page === 'fee') {
    const form = $('#fee-form'), out = $('#fee-out');
    const type = $('#fee-type'), band = $('#fee-band'), count = $('#fee-count'), trip = $('#fee-trip'), km = $('#fee-km');
    if (params.get('type') && $(`option[value="${CSS.escape(params.get('type'))}"]`, type)) type.value = params.get('type');
    if (params.has('band') && /^[0-2]$/.test(params.get('band'))) band.value = params.get('band');
    if (params.has('n')) count.value = params.get('n');
    if (params.get('trip') === '1') trip.checked = true;
    if (params.has('km')) km.value = params.get('km');
    const sync = () => {
      const isTruck = type.value === 'truck', isWeight = type.value === 'weight';
      if (isTruck) { band.value = '2'; trip.checked = true; }
      band.disabled = isWeight || isTruck;
      trip.disabled = isTruck;
      km.disabled = !trip.checked;
      $('label[for="fee-count"]').textContent = isWeight ? '개수' : '대수';
    };
    const run = (write) => {
      sync();
      const r = C.fee({ type: type.value, band: band.value, count: count.value, trip: trip.checked, km: km.value });
      ['type', 'band', 'count', 'km'].forEach((k) => setErr(`fee-${k}`, r.errors && r.errors[k]));
      if (r.errors) { out.innerHTML = '<p class="empty">입력을 고치면 견적이 나옵니다.</p>'; return; }
      out.innerHTML = `<p class="fine">견적 · ${J.TODAY.label} 기준</p>${kv(r.lines)}
        <div class="total"><span>합계</span><p class="big">${C.won(r.total)}</p></div>
        ${r.forcedTrip ? '<p class="fine">계근대는 출장 검정만 받습니다.</p>' : ''}`;
      if (write) setQuery({ type: type.value, band: band.disabled ? '' : band.value, n: count.value.trim(), trip: trip.checked ? '1' : '', km: trip.checked ? km.value.trim() : '' });
    };
    form.addEventListener('input', () => run(true));
    form.addEventListener('change', () => run(true));
    form.addEventListener('submit', (e) => { e.preventDefault(); run(true); });
    $('#fee-print').addEventListener('click', () => window.print());
    run(false);
  }

  // ── 예약 ────────────────────────────────────────────
  const KEY = 'jm-bookings';
  const loadBook = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
  const saveBook = (list) => { try { sessionStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* 저장 못 해도 화면 결과는 보인다 */ } };

  if (page === 'booking') {
    const form = $('#book-form'), cal = $('#book-cal'), slotsBox = $('#book-slots'), out = $('#book-out');
    const itemList = $('#book-item-list'), addItem = $('#item-add');
    let date = '';
    const typeOpts = (sel) => J.TYPES.map((t) => `<option value="${t.id}"${t.id === sel ? ' selected' : ''}>${t.name}</option>`).join('') + `<option value="weight"${sel === 'weight' ? ' selected' : ''}>분동</option>`;

    // 달력
    const months = J.BOOK_RANGE.months;
    cal.innerHTML = months.map(([y, m]) => {
      const first = Date.UTC(y, m - 1, 1);
      const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
      const pad = new Date(first).getUTCDay();
      let cells = C.WEEK.map((w) => `<span class="dw" aria-hidden="true">${w}</span>`).join('');
      cells += '<span class="pad"></span>'.repeat(pad);
      for (let d = 1; d <= days; d++) {
        const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const s = C.dayState(iso);
        const t = C.parseIso(iso);
        const label = s.closed ? `${C.md(t)} · ${s.why}` : `${C.md(t)} · 남은 자리 ${s.left}`;
        cells += `<button type="button" class="day" data-d="${iso}" aria-pressed="false" aria-label="${label}"${s.closed ? ' disabled' : ''}>${d}${s.closed ? '' : `<small>${s.left}</small>`}</button>`;
      }
      return `<div class="cal-m"><h3>${y}년 ${m}월</h3><div class="cal-g" role="group" aria-label="${y}년 ${m}월">${cells}</div></div>`;
    }).join('');

    const renderSlots = () => {
      if (!date) { slotsBox.innerHTML = '<legend>시간대</legend><p class="empty" id="slot-empty">날짜를 먼저 고르세요.</p>'; return; }
      const s = C.dayState(date);
      slotsBox.innerHTML = `<legend>시간대 · ${C.md(C.parseIso(date))}</legend>` + s.slots.map((sl, i) => `<label class="slot"><input type="radio" name="slot" value="${sl.time}"${sl.left ? '' : ' disabled'}><span>${sl.time}<small>${sl.left ? `남은 자리 ${sl.left}` : '마감'}</small></span></label>`).join('');
    };
    const pickDate = (iso) => {
      date = iso;
      $$('.day', cal).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.d === iso)));
      renderSlots();
      setErr('book-date', '');
    };
    cal.addEventListener('click', (e) => { const b = e.target.closest('.day'); if (b && !b.disabled) pickDate(b.dataset.d); });

    // 대상
    const itemHtml = (i, t = 'trade-e', n = '1') => `<li class="item" data-i="${i}"><span class="pt-n mono" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <div class="f"><label for="it-type-${i + 1}">${i + 1}번 대상 종류</label><select id="it-type-${i + 1}" class="it-type">${typeOpts(t)}</select></div>
      <div class="f"><label for="it-n-${i + 1}">대수</label><input id="it-n-${i + 1}" class="it-n" type="text" inputmode="numeric" value="${esc(n)}" aria-describedby="it-n-${i + 1}-err"><p class="err" id="it-n-${i + 1}-err" hidden></p></div>
      <button type="button" class="btn-line it-del" aria-label="${i + 1}번 대상 지우기">지우기</button></li>`;
    const readItems = () => $$('.item', itemList).map((li) => [$('.it-type', li).value, $('.it-n', li).value]);
    const renderItems = (items) => {
      itemList.innerHTML = items.map(([t, n], i) => itemHtml(i, t, n)).join('');
      addItem.disabled = items.length >= J.BOOK_MAX_ITEMS;
      $$('.it-del', itemList).forEach((b) => { b.disabled = items.length <= 1; });
    };
    renderItems([['trade-e', '1']]);
    addItem.addEventListener('click', () => {
      const items = readItems(); if (items.length >= J.BOOK_MAX_ITEMS) return;
      items.push(['trade-e', '1']); renderItems(items); $(`#it-type-${items.length}`).focus();
    });
    itemList.addEventListener('click', (e) => {
      const b = e.target.closest('.it-del'); if (!b) return;
      const i = +b.closest('.item').dataset.i; const items = readItems(); if (items.length <= 1) return;
      items.splice(i, 1); renderItems(items); const f = $(`#it-type-${Math.min(i, items.length - 1) + 1}`); if (f) f.focus();
    });

    // 받는 방법
    const place = $('#bk-place');
    form.addEventListener('change', (e) => {
      if (e.target.name === 'mode') { place.disabled = e.target.value !== 'trip'; if (place.disabled) setErr('bk-place', ''); }
    });

    // 단계별 검사
    const checkDate = () => {
      const slot = $('input[name="slot"]:checked', form);
      const msg = !date ? '날짜: 달력에서 날짜를 고르세요.' : !slot ? '시간대: 남은 자리가 있는 시간을 고르세요.' : '';
      setErr('book-date', msg);
      return msg ? [{ id: date ? 'book-slots' : 'book-cal', msg }] : [];
    };
    const checkItems = () => {
      const errs = [];
      readItems().forEach(([, n], i) => {
        const v = Number(n);
        const msg = !/^\d+$/.test(n.trim()) || v < 1 || v > 20 ? `${i + 1}번 대상 대수: 1~20 사이 정수를 입력하세요.` : '';
        setErr(`it-n-${i + 1}`, msg);
        if (msg) errs.push({ id: `it-n-${i + 1}`, msg });
      });
      const trip = $('input[name="mode"]:checked', form).value === 'trip';
      const total = readItems().reduce((a, [t, n]) => a + (t === 'truck' ? 99 : Number(n) || 0), 0);
      const msg = trip && total < 3 ? '출장: 저울 3대부터 출장합니다. 계근대는 1대도 됩니다.' : '';
      const ie = $('#book-items-err'); ie.textContent = msg; ie.hidden = !msg;
      if (msg) errs.push({ id: 'it-n-1', msg });
      return errs;
    };
    const checkContact = () => {
      const errs = [];
      const name = $('#bk-name').value.trim(), tel = $('#bk-tel').value.trim();
      const m1 = !name ? '이름: 이름을 입력하세요.' : name.length > 20 ? '이름: 20자 안으로 입력하세요.' : '';
      const m2 = !tel ? '휴대전화: 번호를 입력하세요.' : !/^[0-9-]+$/.test(tel) ? '휴대전화: 숫자와 하이픈만 입력하세요.' : !/^01[016789]-?\d{3,4}-?\d{4}$/.test(tel) ? '휴대전화: 010-0000-0000 형식으로 입력하세요.' : '';
      const trip = $('input[name="mode"]:checked', form).value === 'trip';
      const m3 = trip && !$('#bk-place').value.trim() ? '출장 장소: 동 이름까지 입력하세요.' : '';
      const m4 = !$('#bk-agree').checked ? '동의: 연락처 사용에 동의해야 접수됩니다.' : '';
      [['bk-name', m1], ['bk-tel', m2], ['bk-place', m3], ['bk-agree', m4]].forEach(([id, m]) => { setErr(id, m); if (m) errs.push({ id, msg: m }); });
      return errs;
    };
    $$('.next', form).forEach((b) => b.addEventListener('click', () => {
      const errs = b.dataset.next === 'book-items' ? checkDate() : checkItems();
      if (errs.length) { const f = document.getElementById(errs[0].id); (f.matches('input,select,button') ? f : $('button:not(:disabled), input:not(:disabled)', f) || f).focus(); return; }
      const next = document.getElementById(b.dataset.next);
      next.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
      const f = $('select, input', next); if (f) f.focus({ preventScroll: true });
    }));

    const sum = $('#book-errs');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = [...checkDate(), ...checkItems(), ...checkContact()];
      if (errs.length) {
        sum.hidden = false;
        sum.innerHTML = `<h2>입력 확인 ${errs.length}건</h2><ul>${errs.map((x) => `<li><a href="#${x.id}">${esc(x.msg)}</a></li>`).join('')}</ul>`;
        sum.focus();
        return;
      }
      sum.hidden = true; sum.innerHTML = '';
      const list = loadBook();
      const no = `JM-${J.TODAY.code}-${String(41 + list.length).padStart(3, '0')}`;
      const slot = $('input[name="slot"]:checked', form).value;
      const trip = $('input[name="mode"]:checked', form).value === 'trip';
      const items = readItems().map(([t, n]) => [t === 'weight' ? '분동' : J.TYPES.find((x) => x.id === t).name, Number(n)]);
      list.push({ no, date, slot, trip, items });
      saveBook(list);
      out.innerHTML = `<p class="fine">접수 완료 · 이 탭 안에서만 보관 · 서버로 보내지 않음</p>
        <p class="book-no">${no}</p>
        ${kv([['방문일', `${C.md(C.parseIso(date))} ${slot}`], ['받는 방법', trip ? '출장' : '가져오기'], ['대상', items.map(([t, n]) => `${esc(t)} ${n}${t === '분동' ? '개' : '대'}`).join(' · ')]])}
        <p><a href="${link('lookup', `?no=${no}`)}">이 번호로 조회</a></p>`;
      out.focus();
      out.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
    });
    sum.addEventListener('click', (e) => {
      const a = e.target.closest('a'); if (!a) return;
      e.preventDefault();
      const t = document.getElementById(a.getAttribute('href').slice(1));
      const f = t && (t.matches('input,select,button') ? t : $('button:not(:disabled), input:not(:disabled)', t));
      if (f) { f.scrollIntoView({ block: 'center' }); f.focus({ preventScroll: true }); }
    });
    // 주소로 날짜 복원 ?date=
    if (params.get('date')) { const b = $(`.day[data-d="${CSS.escape(params.get('date'))}"]`, cal); if (b && !b.disabled) pickDate(b.dataset.d); }
  }

  // ── 접수 조회 ────────────────────────────────────────
  if (page === 'lookup') {
    const form = $('#lk-form'), input = $('#lk-no'), out = $('#lk-out');
    const run = (write) => {
      const r = C.lookup(input.value, loadBook());
      setErr('lk-no', r.error || '');
      if (r.error) { out.innerHTML = '<p class="empty">번호 형식을 고치면 조회합니다.</p>'; return false; }
      input.value = r.no;
      if (write) setQuery({ no: r.no });
      if (r.none) {
        out.innerHTML = `<p class="verdict">조회 결과 없음</p><p>${esc(r.no)} 번호로 접수된 건이 없습니다.${r.tooOld ? ' 발급일부터 90일이 지난 번호는 조회되지 않습니다.' : ' 번호를 다시 확인하세요.'}</p>`;
        return true;
      }
      const bar = `<ol class="stage-bar">${J.STAGES.map((s, i) => `<li class="${i < r.stage ? 'done' : i === r.stage ? 'cur' : ''}"><span class="mono">${String(i + 1).padStart(2, '0')}</span>${s}${i === r.stage ? ' · 지금' : ''}</li>`).join('')}</ol>`;
      const rows = r.own
        ? [['접수번호', `<span class="mono">${r.no}</span>`], ['방문일', `${C.md(r.date)} ${r.own.slot}`], ['받는 방법', r.own.trip ? '출장' : '가져오기'], ['대상', r.own.items.map(([t, n]) => `${esc(t)} ${n}${t === '분동' ? '개' : '대'}`).join(' · ')]]
        : [['접수번호', `<span class="mono">${r.no}</span>`], ['접수일', C.md(r.received)], ['대상', `${esc(r.type.name)} ${r.count}대`], ['지금 단계', J.STAGES[r.stage]]];
      out.innerHTML = `<p class="verdict">${J.STAGES[r.stage]}${r.own ? ' · 방문 예정' : ''}</p>${bar}${kv(rows)}${r.stage === 3 ? '<p class="fine">반출 시간: 평일 10:00~17:30</p>' : ''}`;
      return true;
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); if (!run(true)) input.focus(); });
    if (params.has('no')) { input.value = params.get('no'); run(false); }
  }

  // ── 분동 등급 탭 ────────────────────────────────────
  if (page === 'weights') {
    const tabs = $$('[role="tab"]'), panel = $('#grade-panel'), svgBox = $('#grade-svg'), info = $('#grade-info');
    const tpl = $('#grade-svgs');
    const mk = (g) => {
      const nom = J.NOMINALS;
      return `${kv([['등급', `<strong class="mono">${g.name}</strong>`], ['쓰임', g.use], ['재질', g.material], ['조정 구멍', g.cavity], ['겉면', g.finish]])}
        <table class="tbl tbl-sm"><caption>${g.name} 허용 편차 (± mg, 가상 기준)</caption><thead><tr>${nom.map((n) => `<th scope="col">${n}</th>`).join('')}</tr></thead><tbody><tr>${g.mpe.map((v) => `<td class="mono">${v}</td>`).join('')}</tr></tbody></table>`;
    };
    const select = (tab, focus, write = true) => {
      tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      const g = J.GRADES.find((x) => x.id === tab.dataset.g);
      panel.setAttribute('aria-labelledby', tab.id);
      svgBox.innerHTML = $(`[data-g="${g.id}"]`, tpl.content).innerHTML;
      info.innerHTML = mk(g);
      if (focus) tab.focus();
      if (write) setQuery({ grade: g.id });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t, false));
      t.addEventListener('keydown', (e) => {
        let n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') n = tabs[0];
        else if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    const g = params.get('grade'); const t0 = g && tabs.find((t) => t.dataset.g === g.toUpperCase());
    if (t0) select(t0, false, false);
  }

  // ── 자주 묻는 것: ?open= 복원 ───────────────────────
  if (page === 'faq') {
    const open = (params.get('open') || '').split(',').filter(Boolean);
    open.forEach((n) => { const d = document.getElementById(`q${n}`); if (d) d.open = true; });
    $$('.faq details').forEach((d) => d.addEventListener('toggle', () => {
      const ids = $$('.faq details').filter((x) => x.open).map((x) => x.id.slice(1));
      setQuery({ open: ids.join(',') });
    }));
  }
})();
