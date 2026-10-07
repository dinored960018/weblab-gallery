/* 볕가락제면소 — 화면 동작. 데이터는 assets/data.js(window.BG) */
(() => {
  'use strict';
  const D = window.BG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const won = (n) => n.toLocaleString('ko-KR') + '원';
  const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const mmss = (s) => `${Math.floor(s / 60)}분${s % 60 ? ` ${s % 60}초` : ''}`;
  const qs = () => new URLSearchParams(location.search);
  const setQs = (p) => { const s = p.toString(); history.replaceState(null, '', s ? `?${s}` : location.pathname); };
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* 저장 못 함 */ } },
  };
  const PHONE = /^01[016789]-?\d{3,4}-?\d{4}$/;

  // ── 모바일 메뉴 ──
  const menuBtn = $('.menu-btn'), nav = $('#nav');
  if (menuBtn && nav) {
    const close = (focus) => {
      nav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = '메뉴';
      document.documentElement.style.overflow = '';
      if (focus) menuBtn.focus();
    };
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') !== 'true';
      if (!open) return close(false);
      nav.classList.add('is-open'); menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.textContent = '닫기';
      document.documentElement.style.overflow = 'hidden';
      $('a', nav)?.focus();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) close(true); });
    window.matchMedia('(min-width: 1181px)').addEventListener('change', (m) => { if (m.matches) close(false); });
  }

  // ── 증감 단추 ──
  function stepper(el) {
    const out = $('output', el), min = +el.dataset.min, max = +el.dataset.max;
    const [dn, up] = $$('button', el);
    const sync = () => { const v = +out.value; dn.disabled = v <= min; up.disabled = v >= +el.dataset.max; };
    el.set = (v) => { out.value = Math.max(min, Math.min(+el.dataset.max, v)); sync(); el.dispatchEvent(new Event('change', { bubbles: true })); };
    el.get = () => +out.value;
    dn.addEventListener('click', () => el.set(+out.value - 1));
    up.addEventListener('click', () => el.set(+out.value + 1));
    out.value = out.textContent.trim(); sync();
    void max;
    return el;
  }
  $$('.stepper').forEach(stepper);

  // ── 탭 ──
  function tabs(list, onChange) {
    const ts = $$('[role="tab"]', list);
    const pick = (t, focus) => {
      ts.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
      if (focus) t.focus();
      onChange?.(t);
    };
    ts.forEach((t, i) => {
      t.addEventListener('click', () => pick(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: ts.length - 1 }[e.key];
        if (k === undefined) return;
        e.preventDefault(); pick(ts[(k + ts.length) % ts.length], true);
      });
    });
    return { pick };
  }

  // ── 가로 줄 ──
  const strip = $('#strip');
  if (strip) {
    const cols = $$('.col', strip), pos = $('.strip-pos'), [prev, next] = $$('.strip-btn');
    const idx = () => { const l = strip.scrollLeft; let best = 0; cols.forEach((c, i) => { if (Math.abs(c.offsetLeft - strip.offsetLeft - l - parseFloat(getComputedStyle(strip).paddingLeft)) < Math.abs(cols[best].offsetLeft - strip.offsetLeft - l - parseFloat(getComputedStyle(strip).paddingLeft))) best = i; }); return best; };
    const atEnd = () => strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
    const sync = () => { const i = atEnd() ? cols.length - 1 : idx(); pos.textContent = `${i + 1} / ${cols.length}`; prev.disabled = strip.scrollLeft <= 4; next.disabled = atEnd(); };
    const go = (d) => {
      const i = Math.max(0, Math.min(cols.length - 1, idx() + d));
      const pad = parseFloat(getComputedStyle(strip).paddingLeft);
      strip.scrollTo({ left: cols[i].offsetLeft - strip.offsetLeft - pad, behavior: reduce() ? 'auto' : 'smooth' });
      if (reduce()) sync();
    };
    prev.addEventListener('click', () => go(-1)); next.addEventListener('click', () => go(1));
    let raf; strip.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
    strip.addEventListener('focusin', (e) => { const c = e.target.closest('.col'); if (c && c !== cols[idx()]) c.scrollIntoView({ block: 'nearest', inline: 'start', behavior: reduce() ? 'auto' : 'smooth' }); });
    window.addEventListener('resize', sync); sync();
  }

  // ── 타이머 ──
  function makeTimer(el) {
    const clk = $('.t-clock', el), bar = $('.t-bar span', el), stepEl = $('.t-step', el), toggle = $('[data-act="toggle"]', el), reset = $('[data-act="reset"]', el), list = $('.t-steps', el);
    let total = +el.dataset.boil, shock = el.dataset.shock === 'true', left = total, endAt = 0, tick = 0, running = false, events = [], said = -1;
    const build = () => {
      events = [{ at: 0, text: '면을 펼쳐 넣고 젓가락으로 저어 푼다.' }];
      if (shock) events.push({ at: Math.round(total * 0.35), text: '다시 끓어오르면 찬물 반 컵을 붓는다.' });
      events.push({ at: Math.max(0, total - 30), text: '30초 남았다. 찬물 받을 그릇을 둔다.' });
      events.push({ at: total, text: '다 됐다. 건져서 찬물에 비벼 헹군다.' });
      if (list) list.innerHTML = events.map((e, i) => `<li data-i="${i}"><time>${clock(e.at)}</time><span>${e.text}</span></li>`).join('');
    };
    const draw = () => {
      clk.textContent = clock(left);
      el.style.setProperty('--p', 0);
      bar.style.setProperty('--p', total ? left / total : 0);
      const done = total - left;
      let cur = -1; events.forEach((e, i) => { if (done >= e.at && (running || left === 0)) cur = i; });
      if (list) $$('li', list).forEach((li, i) => { li.classList.toggle('is-now', i === cur); li.classList.toggle('is-past', i < cur); });
      if (cur !== said && cur >= 0) { said = cur; stepEl.textContent = events[cur].text; }
      el.classList.toggle('is-done', left === 0);
    };
    const stop = () => { running = false; clearInterval(tick); toggle.textContent = left === 0 ? '다시' : left === total ? '시작' : '계속'; };
    const loop = () => { left = Math.max(0, Math.round((endAt - Date.now()) / 1000)); draw(); if (left === 0) stop(); };
    toggle.addEventListener('click', () => {
      if (running) { stop(); stepEl.textContent = `멈춤 · 남은 시간 ${mmss(left)}`; return; }
      if (left === 0) { left = total; said = -1; }
      running = true; endAt = Date.now() + left * 1000; toggle.textContent = '멈춤';
      draw(); tick = setInterval(loop, 250);
    });
    reset.addEventListener('click', () => { stop(); left = total; said = -1; stepEl.textContent = '시작 전'; toggle.textContent = '시작'; draw(); });
    el.setBoil = (s, sh = shock) => { stop(); total = s; shock = sh; left = s; said = -1; stepEl.textContent = '시작 전'; toggle.textContent = '시작'; build(); draw(); };
    build(); draw();
    return el;
  }
  const timers = $$('[data-timer]').map(makeTimer);

  // 면 상세: 탭을 바꾸면 작은 타이머도 그 음식 시간으로
  const cookTabs = $('.tabs[role="tablist"]');
  if (cookTabs) {
    const mini = $('.mini-timer');
    tabs(cookTabs, (t) => mini?.setBoil(+t.dataset.boil));
  }
  // 건조 일지 날짜 탭
  const dtabs = $('.dtabs');
  if (dtabs) tabs(dtabs);

  // ── 타이머 페이지 ──
  const tf = $('#timer-form');
  if (tf) {
    const main = $('[data-main]'), food = $('#t-food'), serv = $('#t-serv').closest('.stepper');
    const cur = () => D.noodles.find((n) => n.id === $('input[name="noodle"]:checked', tf).value);
    const fillFood = (n, want) => {
      food.innerHTML = n.tabs.map((t) => `<option value="${t.food}">${t.label} · ${mmss(t.boil)}</option>`).join('');
      if (want && n.tabs.some((t) => t.food === want)) food.value = want;
    };
    const calc = () => {
      const n = cur(), t = n.tabs.find((x) => x.food === food.value) || n.tabs[0], s = serv.get();
      const g = n.serve * s, water = Math.max(2, Math.ceil(g / 100 * 2) / 2), extra = Math.max(0, s - 2) * 10, total = t.boil + extra;
      $('#c-g').textContent = `${g.toLocaleString('ko-KR')} g`;
      $('#c-water').textContent = `${water} L`;
      $('#c-time').textContent = mmss(total);
      main.setBoil(total, n.shock);
      const p = new URLSearchParams({ noodle: n.id, food: t.food, serv: s }); setQs(p);
    };
    const p = qs();
    const want = D.noodles.find((n) => n.id === p.get('noodle'));
    if (want) $(`input[value="${want.id}"]`, tf).checked = true;
    if (p.get('serv')) serv.set(+p.get('serv') || 2);
    fillFood(cur(), p.get('food'));
    $$('input[name="noodle"]', tf).forEach((r) => r.addEventListener('change', () => { fillFood(cur()); calc(); }));
    food.addEventListener('change', calc); serv.addEventListener('change', calc);
    tf.addEventListener('submit', (e) => e.preventDefault());
    calc();
  }

  // ── 면 고르기 ──
  const filter = $('#filter');
  if (filter) {
    const rows = $('#rows'), items = $$('.row', rows), count = $('#count'), empty = $('#empty'), sort = $('#sort');
    const groups = ['mat', 'thick', 'food'];
    const read = () => Object.fromEntries(groups.map((g) => [g, $$(`input[name="${g}"]:checked`, filter).map((i) => i.value)]));
    const apply = (push = true) => {
      const f = read();
      let n = 0;
      items.forEach((r) => {
        const ok = (!f.mat.length || f.mat.includes(r.dataset.mat)) && (!f.thick.length || f.thick.includes(r.dataset.thick)) && (!f.food.length || f.food.some((x) => r.dataset.foods.split(' ').includes(x)));
        r.hidden = !ok; if (ok) n++;
      });
      const key = sort.value;
      const val = (r) => (key === 'name' ? r.querySelector('.row-name').textContent : +r.dataset[key]);
      items.slice().sort((a, b) => (key === 'name' ? val(a).localeCompare(val(b), 'ko') : val(a) - val(b))).forEach((r) => rows.appendChild(r));
      count.textContent = n ? `면 ${n}가지` : '면 0가지';
      empty.hidden = n > 0;
      if (push) {
        const p = new URLSearchParams();
        groups.forEach((g) => f[g].length && p.set(g, f[g].join(',')));
        if (key !== 'w') p.set('sort', key);
        setQs(p);
      }
    };
    const p = qs();
    groups.forEach((g) => (p.get(g) || '').split(',').filter(Boolean).forEach((v) => { const i = $(`input[name="${g}"][value="${v}"]`, filter); if (i) i.checked = true; }));
    if (p.get('sort') && $(`option[value="${p.get('sort')}"]`, sort)) sort.value = p.get('sort');
    filter.addEventListener('change', () => apply());
    filter.addEventListener('submit', (e) => e.preventDefault());
    const clear = () => { $$('input', filter).forEach((i) => { i.checked = false; }); sort.value = 'w'; apply(); };
    $('#filter-clear').addEventListener('click', clear);
    $('#empty-clear').addEventListener('click', () => { clear(); $('input', filter).focus(); });
    apply(false);
  }

  // 폼 공통: 오류 표시
  function showErr(id, msg, input) {
    const e = document.getElementById(id);
    if (!e) return;
    e.hidden = !msg; e.textContent = msg || '';
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function summary(box, errs) {
    box.hidden = !errs.length;
    box.innerHTML = errs.length ? `${errs.length}곳을 확인해야 한다.<ul>${errs.map(([t, m]) => `<li><a href="#${t}">${m}</a></li>`).join('')}</ul>` : '';
    $$('a', box).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const t = document.getElementById(a.getAttribute('href').slice(1)); t?.focus(); }));
  }

  // ── 주문 ──
  const order = $('#order');
  if (order) {
    const lis = $$('.oi', order);
    const zip = $('#o-zip');
    const fb = $('.oitems .stepper button[data-step="1"]', order); if (fb) fb.id = 'oi-first';
    const island = (z) => /^\d{5}$/.test(z) && ((+z >= 63000 && +z <= 63644) || (+z >= 40200 && +z <= 40240));
    const totals = () => {
      const sum = lis.reduce((s, li) => s + (+li.dataset.price) * ($('.stepper', li)?.get() || 0), 0);
      const ship = sum === 0 ? 0 : (sum >= D.shipping.freeOver ? 0 : D.shipping.base) + (island(zip.value) ? D.shipping.island : 0);
      return { sum, ship, total: sum + ship };
    };
    const draw = () => {
      const t = totals();
      $('#s-items').textContent = won(t.sum);
      $('#s-ship').textContent = t.sum === 0 ? '—' : t.ship === 0 ? '없음' : won(t.ship);
      $('#s-total').textContent = won(t.total);
    };
    order.addEventListener('change', draw);
    zip.addEventListener('input', draw);
    const item = qs().get('item');
    if (item) { const li = lis.find((l) => l.dataset.id === item); $('.stepper', li || document.createElement('i'))?.set(1); }
    draw();
    order.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = [];
      const chosen = lis.filter((li) => ($('.stepper', li)?.get() || 0) > 0);
      const name = $('#o-name'), phone = $('#o-phone'), addr = $('#o-addr'), agree = $('#o-agree');
      const m1 = chosen.length ? '' : '면을 한 봉 이상 고른다.';
      showErr('e-items', m1); if (m1) errs.push(['oi-first', m1]);
      const m2 = name.value.trim().length >= 2 ? '' : '이름을 두 글자 이상 적는다.'; showErr('e-name', m2, name); if (m2) errs.push(['o-name', m2]);
      const m3 = PHONE.test(phone.value.trim()) ? '' : '휴대전화는 010-1234-5678 형식으로 적는다.'; showErr('e-phone', m3, phone); if (m3) errs.push(['o-phone', m3]);
      const m4 = /^\d{5}$/.test(zip.value.trim()) ? '' : '우편번호는 숫자 다섯 자리다.'; showErr('e-zip', m4, zip); if (m4) errs.push(['o-zip', m4]);
      const m5 = addr.value.trim().length >= 6 ? '' : '주소를 동·호수까지 적는다.'; showErr('e-addr', m5, addr); if (m5) errs.push(['o-addr', m5]);
      const m6 = agree.checked ? '' : '주문 내용 확인에 표시한다.'; showErr('e-agree', m6, agree); if (m6) errs.push(['o-agree', m6]);
      summary($('#err-sum'), errs);
      if (errs.length) { $('#err-sum').focus?.(); return; }
      const t = totals();
      $('#done-list').innerHTML = chosen.map((li) => { const p = D.packs[li.dataset.id], q = $('.stepper', li).get(); return `<div><dt>${p.name} ${p.g >= 1000 ? p.g / 1000 + ' kg' : p.g + ' g'} × ${q}</dt><dd>${won(p.price * q)}</dd></div>`; }).join('')
        + `<div><dt>배송비</dt><dd>${t.ship ? won(t.ship) : '없음'}</dd></div><div class="sum-total"><dt>합계</dt><dd>${won(t.total)}</dd></div><div><dt>출하</dt><dd>${D.ship[0].label}</dd></div><div><dt>받는 사람</dt><dd>${name.value.trim().replace(/</g, '&lt;')}</dd></div>`;
      order.hidden = true; const done = $('#done'); done.hidden = false; done.focus();
    });
    $('#done-again').addEventListener('click', () => {
      $('#done').hidden = true; order.hidden = false; order.reset(); lis.forEach((li) => $('.stepper', li)?.set(0));
      $$('[aria-invalid]', order).forEach((i) => i.removeAttribute('aria-invalid')); $$('.err', order).forEach((e) => { e.hidden = true; });
      summary($('#err-sum'), []); draw(); $('.oitems button:not(:disabled)', order)?.focus();
    });
  }

  // ── 견학 ──
  const tour = $('#tour');
  if (tour) {
    const used = () => store.get('bg-tour', {});
    const left = (s) => Math.max(0, s.left - (used()[s.id] || 0));
    const box = $('#t-sessions'), adult = $('#p-adult'), child = $('#p-child');
    const drawDates = () => {
      $$('.date', tour).forEach((lab) => {
        const inp = $('input', lab), ss = D.sessions.filter((s) => s.date === inp.value), n = ss.reduce((a, s) => a + left(s), 0);
        $('small', lab).textContent = n ? `잔여 ${n}석` : '마감';
        lab.classList.toggle('is-full', !n); inp.disabled = !n;
      });
    };
    const drawSessions = () => {
      const d = $('input[name="date"]:checked', tour);
      if (!d) { box.innerHTML = '<p class="hint">날짜를 먼저 고른다.</p>'; return; }
      box.innerHTML = D.sessions.filter((s) => s.date === d.value).map((s) => { const n = left(s); return `<label class="sess${n ? '' : ' is-full'}"><input type="radio" name="session" value="${s.id}"${n ? '' : ' disabled'}><span>${s.time}</span><small>${n ? `잔여 ${n} / ${D.tour.cap}` : '마감'}</small></label>`; }).join('');
      const first = $('input:not(:disabled)', box); if (first) first.checked = true;
    };
    const people = () => ({ a: adult.get(), c: child.get() });
    const drawSum = () => { const { a, c } = people(); $('#t-sum').textContent = `${a + c}명 · ${won(a * D.tour.adult + c * D.tour.child)}`; };
    $$('input[name="date"]', tour).forEach((r) => r.addEventListener('change', drawSessions));
    tour.addEventListener('change', drawSum);
    drawDates(); drawSum();
    const fd = $('input[name="date"]:not(:disabled)', tour); if (fd) fd.id = 'td-first';
    $('#p-adult button[data-step="1"]').id = 'pa-plus';
    const dlg = $('#t-dlg'), submitBtn = $('button[type="submit"]', tour);
    let pending = null;
    tour.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = [];
      const d = $('input[name="date"]:checked', tour), sIn = $('input[name="session"]:checked', tour);
      const m1 = d ? '' : '날짜를 고른다.'; showErr('e-date', m1); if (m1) errs.push(['td-first', m1]);
      const s = sIn && D.sessions.find((x) => x.id === sIn.value);
      const m2 = !d || s ? '' : '회차를 고른다.'; showErr('e-session', m2); if (m2) errs.push(['td-first', m2]);
      const { a, c } = people();
      let m3 = '';
      if (a + c === 0) m3 = '인원을 한 명 이상 고른다.';
      else if (c > 0 && a === 0) m3 = '만 14세 미만 어린이는 어른과 함께 와야 한다.';
      else if (a + c > D.tour.maxGroup) m3 = `한 번에 ${D.tour.maxGroup}명까지 신청한다.`;
      else if (s && a + c > left(s)) m3 = `인원 ${a + c}명이 잔여석 ${left(s)}석보다 많다.`;
      showErr('e-people', m3); if (m3) errs.push(['pa-plus', m3]);
      const nm = $('#t-name'), ph = $('#t-phone');
      const m4 = nm.value.trim().length >= 2 ? '' : '이름을 두 글자 이상 적는다.'; showErr('e-tname', m4, nm); if (m4) errs.push(['t-name', m4]);
      const m5 = PHONE.test(ph.value.trim()) ? '' : '휴대전화는 010-1234-5678 형식으로 적는다.'; showErr('e-tphone', m5, ph); if (m5) errs.push(['t-phone', m5]);
      summary($('#t-err'), errs);
      if (errs.length) return;
      pending = { s, a, c, name: nm.value.trim() };
      $('#dlg-list').innerHTML = `<div><dt>회차</dt><dd>${s.label} ${s.time}</dd></div><div><dt>인원</dt><dd>어른 ${a} · 어린이 ${c}</dd></div><div class="sum-total"><dt>요금</dt><dd>${won(a * D.tour.adult + c * D.tour.child)}</dd></div><div><dt>신청자</dt><dd>${pending.name.replace(/</g, '&lt;')}</dd></div>`;
      dlg.showModal(); $('#dlg-ok').focus();
    });
    const closeDlg = () => { if (dlg.open) dlg.close(); };
    dlg.addEventListener('close', () => { if (!pending?.ok) submitBtn.focus(); });
    $('#dlg-cancel').addEventListener('click', closeDlg);
    $('#dlg-x').addEventListener('click', closeDlg);
    dlg.addEventListener('click', (e) => { if (e.target === dlg) closeDlg(); });
    $('#dlg-ok').addEventListener('click', () => {
      const u = used(); u[pending.s.id] = (u[pending.s.id] || 0) + pending.a + pending.c; store.set('bg-tour', u);
      pending.ok = true; closeDlg();
      $('#t-done-list').innerHTML = $('#dlg-list').innerHTML + `<div><dt>남은 자리</dt><dd>${left(pending.s)}석</dd></div>`;
      tour.hidden = true; const done = $('#t-done'); done.hidden = false; done.focus();
    });
    $('#t-again').addEventListener('click', () => {
      pending = null; $('#t-done').hidden = true; tour.hidden = false; tour.reset(); adult.set(1); child.set(0);
      $$('.err', tour).forEach((e) => { e.hidden = true; }); $$('[aria-invalid]', tour).forEach((i) => i.removeAttribute('aria-invalid'));
      summary($('#t-err'), []); drawDates(); drawSessions(); drawSum(); $('input[name="date"]:not(:disabled)', tour)?.focus();
    });
  }

  // ── 공지 ──
  const nts = $('.nts');
  if (nts) {
    const btns = $$('.chip-btn'), items = $$('.nt', nts), count = $('#nt-count');
    const setCat = (cat, push = true) => {
      btns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === cat));
      let n = 0; items.forEach((it) => { const ok = cat === 'all' || it.dataset.cat === cat; it.hidden = !ok; if (ok) n++; });
      count.textContent = `공지 ${n}건`;
      if (push) { const p = qs(); p.delete('open'); cat === 'all' ? p.delete('cat') : p.set('cat', cat); setQs(p); }
    };
    btns.forEach((b) => b.addEventListener('click', () => setCat(b.dataset.cat)));
    const toggle = (btn, open) => { btn.setAttribute('aria-expanded', open); document.getElementById(btn.getAttribute('aria-controls')).hidden = !open; };
    $$('.nt-btn', nts).forEach((b) => b.addEventListener('click', () => toggle(b, b.getAttribute('aria-expanded') !== 'true')));
    const p = qs();
    if (p.get('cat') && D.cats[p.get('cat')]) setCat(p.get('cat'), false);
    const o = p.get('open') && document.getElementById(p.get('open'));
    if (o) { o.hidden = false; const b = $('.nt-btn', o); toggle(b, true); b.focus({ preventScroll: true }); o.scrollIntoView({ block: 'center' }); }
  }

  void timers;
})();
