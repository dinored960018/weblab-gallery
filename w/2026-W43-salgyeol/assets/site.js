// 살결정육점 — 화면 동작 (에이전트 레일 · 체크 조회 · 부위표 · 주문 · 매장 · 식당 · 문의 · 소식 · 질문)
(function () {
  const D = window.SG, C = window.SGC;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = () => window.matchMedia('(min-width: 1200px)').matches;
  const STEP_MS = 400;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced() ? 0 : ms));
  const escH = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const rel = ($('.brand').getAttribute('href') || 'index.html').replace(/index\.html$/, '');

  // 저장소 — 이 탭에만
  const ss = {
    get(k, d) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 못 해도 화면은 동작 */ } },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) { /* 무시 */ } },
  };

  // ── 장바구니 ────────────────────────────────────
  let cart = ss.get('sg-cart', []);
  function cartAdd(items) {
    items.forEach((it) => {
      const f = cart.find((x) => x.id === it.id);
      if (f) f.g += it.g; else cart.push({ id: it.id, g: it.g });
    });
    saveCart();
  }
  function saveCart() { cart = cart.filter((x) => x.g > 0); ss.set('sg-cart', cart); renderCart(); }
  const cartTotal = () => cart.reduce((a, it) => a + C.cost(C.cut(it.id), it.g), 0);
  function renderCart() {
    $$('[data-cart]').forEach((box) => {
      const empty = !cart.length;
      $('[data-cart-empty]', box).hidden = !empty;
      $('[data-cart-table]', box).hidden = empty;
      $('[data-cart-total]', box).textContent = C.won(cartTotal()) + '원';
      $('[data-cart-rows]', box).innerHTML = cart.map((it) => {
        const c = C.cut(it.id); const n = C.fullName(c);
        return `<tr><td>${n}</td><td class="mono">${C.kg(it.g)}</td><td class="num">${C.won(C.cost(c, it.g))}원</td><td><span class="qty"><button type="button" data-q="-100" data-id="${it.id}" aria-label="${n} 100 g 빼기">−100</button><button type="button" data-q="100" data-id="${it.id}" aria-label="${n} 100 g 더하기">+100</button><button type="button" data-q="del" data-id="${it.id}" aria-label="${n} 빼기">빼기</button></span></td></tr>`;
      }).join('');
    });
    const rc = $('[data-rail-cart]');
    if (rc) rc.innerHTML = cart.length ? `장바구니 초안 ${cart.length}줄 · <strong class="pink">${C.won(cartTotal())}원</strong> · <a href="${rel}order/index.html#pickup">픽업 예약</a>` : '';
    updateMine();
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    const it = cart.find((x) => x.id === b.dataset.id);
    if (!it) return;
    const n = C.fullName(C.cut(it.id));
    if (b.dataset.q === 'del') it.g = 0; else it.g = Math.max(0, it.g + Number(b.dataset.q));
    const q = b.dataset.q;
    saveCart();
    // 같은 단추로 포커스를 돌려준다(줄이 남아 있으면)
    const again = $(`[data-cart] [data-id="${it.id}"][data-q="${q}"]`) || $('[data-cart] [data-q]') || $('[data-cart] h3');
    if (again && again.focus) again.focus();
    say(`${n} ${it.g ? C.kg(it.g) + '으로 바꿈' : '뺌'}`);
  });
  // 화면 낭독용 짧은 알림
  const live = document.createElement('p'); live.className = 'vh'; live.setAttribute('aria-live', 'polite'); document.body.appendChild(live);
  const say = (t) => { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 30); };

  // ── 에이전트 레일 ───────────────────────────────
  const rail = $('[data-agent]');
  const logEl = $('[data-agent-log]');
  const toggle = $('[data-agent-toggle]');
  const statusEl = $('[data-agent-status]');
  let log = ss.get('sg-log', null);
  let seq = ss.get('sg-seq', 0);
  const stamp = () => { seq += 1; ss.set('sg-seq', seq); const s = 600 * 60 + seq * 7; return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  function setStatus(state) {
    statusEl.dataset.state = state;
    $('[data-agent-status-t]').textContent = { idle: '대기', run: '작업 중', done: '완료' }[state];
  }
  const stepsHtml = (steps, doneAll) => `<ol class="steps">${steps.map((s, i) => `<li class="step" data-state="${doneAll ? 'done' : 'wait'}"><span class="mark" aria-hidden="true"></span><span class="step-n">${String(i + 1).padStart(2, '0')}</span><span class="step-name">${escH(s.name)}</span><span class="step-state">${doneAll ? '완료' : '대기'}</span><span class="step-detail">${doneAll ? escH(s.detail) : ''}</span></li>`).join('')}</ol>`;
  function entryHtml(e, final) {
    const who = e.who === 'me' ? '나' : D.SITE.agent;
    return `<div class="lg-h"><span class="who">${who}</span><span class="mono">${e.t}</span></div>`
      + (e.q ? `<p class="lg-q">${escH(e.q)}</p>` : '')
      + (e.steps ? stepsHtml(e.steps, final) : '')
      + (final ? e.lines.map((l) => `<p class="lg-l">${escH(l)}</p>`).join('') : '')
      + (final && e.rule ? `<p class="lg-rule">규칙: ${escH(e.rule)}</p>` : '');
  }
  function renderLog() {
    logEl.innerHTML = log.map((e) => `<li class="${e.who === 'me' ? 'me' : 'ag'}">${entryHtml(e, true)}</li>`).join('');
    logEl.scrollTop = logEl.scrollHeight;
  }
  function pushLog(e) { log.push(e); if (log.length > 40) log = log.slice(-40); ss.set('sg-log', log); updateMine(); }
  // 응답을 단계 → 줄 순서로 쌓는다 (모션 1)
  let busy = Promise.resolve();
  function agentSay(e) {
    busy = busy.then(async () => {
      const li = document.createElement('li'); li.className = 'ag in';
      li.innerHTML = entryHtml(e, false);
      logEl.appendChild(li);
      logEl.scrollTop = logEl.scrollHeight;
      setStatus('run');
      const stepEls = $$('.step', li);
      for (let i = 0; i < stepEls.length; i++) {
        const st = stepEls[i];
        st.dataset.state = 'run'; $('.step-state', st).textContent = '진행 중';
        await wait(STEP_MS);
        st.dataset.state = 'done'; $('.step-state', st).textContent = '완료';
        $('.step-detail', st).textContent = e.steps[i].detail;
        logEl.scrollTop = logEl.scrollHeight;
      }
      for (const l of e.lines) {
        const p = document.createElement('p'); p.className = 'lg-l in'; p.textContent = l;
        li.appendChild(p);
        logEl.scrollTop = logEl.scrollHeight;
        await wait(90);
      }
      if (e.rule) { const r = document.createElement('p'); r.className = 'lg-rule'; r.textContent = '규칙: ' + e.rule; li.appendChild(r); }
      pushLog(e);
      setStatus('done');
    });
    return busy;
  }
  function meSay(q) {
    const e = { who: 'me', t: stamp(), q, lines: [] };
    const li = document.createElement('li'); li.className = 'me in'; li.innerHTML = entryHtml(e, true);
    logEl.appendChild(li); logEl.scrollTop = logEl.scrollHeight;
    pushLog(e);
  }
  function ask(q) {
    const text = String(q || '').trim();
    if (!text) { const inp = $('#agent-q'); inp.focus(); return; }
    meSay(text);
    const r = C.reply(text, { cart });
    if (r.add) cartAdd(r.add);
    return agentSay({ who: 'ag', t: stamp(), lines: r.lines, steps: r.steps, rule: r.rule });
  }
  function greet() {
    log = [];
    seq = 0; ss.set('sg-seq', 0);
    const e = { who: 'ag', t: stamp(), lines: [`${D.SITE.agent}입니다. 부위 이름, 인원과 용도, 매장 이름으로 물어보세요.`, `부위표 · 매장 · 숙성고 데이터 ${D.NOW.time} 갱신`], rule: '인사' };
    log.push(e); ss.set('sg-log', log);
  }
  if (!Array.isArray(log) || !log.length) greet();
  renderLog();

  $('[data-agent-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('#agent-q');
    ask(inp.value); inp.value = '';
  });
  $$('[data-ask]').forEach((b) => b.addEventListener('click', () => { openRail(false); ask(b.dataset.ask); }));

  // 열기 · 닫기 — 넓은 화면은 오른쪽 레일, 좁은 화면은 아래 시트
  function railOpen() { return wide() ? !document.body.classList.contains('rail-off') : document.body.classList.contains('sheet-open'); }
  function syncToggle() { toggle.setAttribute('aria-expanded', String(railOpen())); }
  function openRail(focusInput = true) {
    if (wide()) { document.body.classList.remove('rail-off'); ss.set('sg-rail', 'on'); }
    else document.body.classList.add('sheet-open');
    syncToggle();
    if (focusInput) $('#agent-q').focus();
  }
  function closeRail() {
    if (wide()) { document.body.classList.add('rail-off'); ss.set('sg-rail', 'off'); }
    else document.body.classList.remove('sheet-open');
    syncToggle();
    toggle.focus();
  }
  if (ss.get('sg-rail', 'on') === 'off') document.body.classList.add('rail-off');
  syncToggle();
  window.addEventListener('resize', syncToggle);
  toggle.addEventListener('click', () => (railOpen() ? closeRail() : openRail()));
  $('[data-agent-close]').addEventListener('click', closeRail);

  // ── 모바일 메뉴 ─────────────────────────────────
  const menuBtn = $('.menu-btn');
  const nav = $('#nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) { const a = $('a', nav); if (a) a.focus(); }
  }
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); return; }
    if (!wide() && document.body.classList.contains('sheet-open')) { closeRail(); return; }
    if (wide() && rail.contains(document.activeElement)) closeRail();
  });

  // ── 공통 검증 ───────────────────────────────────
  function fieldErr(input, msg) {
    const err = document.getElementById(input.id + '-err') || document.getElementById(input.getAttribute('aria-describedby'));
    if (msg) { input.setAttribute('aria-invalid', 'true'); if (err) { err.textContent = msg; err.hidden = false; } }
    else { input.removeAttribute('aria-invalid'); if (err) { err.textContent = ''; err.hidden = true; } }
    return !msg;
  }
  function errSummary(form, list) {
    const box = $('[data-err-sum]', form);
    if (!list.length) { box.hidden = true; box.innerHTML = ''; return true; }
    box.innerHTML = `<p>입력을 확인하세요 · ${list.length}건</p><ul>${list.map(([id, m]) => `<li><a href="#${id}">${m}</a></li>`).join('')}</ul>`;
    box.hidden = false;
    box.focus();
    return false;
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-err-sum] a');
    if (!a) return;
    e.preventDefault();
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if (t) { t.scrollIntoView({ block: 'center' }); t.focus(); }
  });
  const telOk = (v) => /^01[016789]-?\d{3,4}-?\d{4}$/.test(v.trim());
  const nameMsg = (v) => (v.trim().length < 2 || v.trim().length > 20 ? '이름: 2~20자로 입력하세요.' : '');
  const telMsg = (v) => (!v.trim() ? '휴대전화: 번호를 입력하세요.' : telOk(v) ? '' : '휴대전화: 010-1234-5678 형식으로 입력하세요.');
  const intIn = (v, a, b) => /^\d+$/.test(String(v).trim()) && Number(v) >= a && Number(v) <= b;

  // 단계 표시(본문)
  function stepSet(list, i, state, detail) {
    const st = $$('.step', list)[i];
    st.dataset.state = state;
    $('[data-step-state]', st).textContent = { wait: '대기', run: '진행 중', done: '완료' }[state];
    if (detail !== undefined) $('[data-step-detail]', st).textContent = detail;
  }

  // ── 홈: 체크 조회 ───────────────────────────────
  const check = $('[data-check]');
  if (check) {
    const run = $('[data-run]');
    const list = $('[data-steps]', run);
    const err = $('[data-check-err]');
    let running = false;
    check.addEventListener('change', () => { if ($$('input[name="plan"]:checked', check).length) { err.hidden = true; $('.checks', check).removeAttribute('aria-invalid'); } });
    check.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (running) return;
      const plans = $$('input[name="plan"]:checked', check).map((x) => x.value);
      if (!plans.length) {
        err.textContent = '해당하는 항목을 1개 이상 고르세요.'; err.hidden = false;
        $('.checks', check).setAttribute('aria-invalid', 'true');
        $('input[name="plan"]', check).focus();
        return;
      }
      running = true;
      const people = Number($('#ck-people').value);
      const res = C.checkRun(plans, people, $('#ck-store').value);
      run.hidden = false;
      $('[data-run-result]').textContent = '';
      $('[data-run-time]').textContent = D.NOW.time;
      [0, 1, 2].forEach((i) => stepSet(list, i, 'wait', ''));
      meSay(`${plans.map((p) => D.PLANS.find((x) => x.id === p).label).join(' · ')} · ${people}인`);
      const agentDone = agentSay({ who: 'ag', t: stamp(), steps: res.steps, lines: [`장바구니 초안에 ${res.items.length}줄을 담았습니다.`, `픽업: ${C.store(res.store).name} ${res.slot}`], rule: '체크 조회' });
      for (let i = 0; i < 3; i++) {
        stepSet(list, i, 'run');
        await wait(STEP_MS);
        stepSet(list, i, 'done', res.steps[i].detail);
      }
      cartAdd(res.items);
      ss.set('sg-pick', { store: res.store, slot: res.slot });
      $('[data-run-result]').innerHTML = `장바구니 초안에 ${res.items.length}줄을 담았습니다. 픽업: <strong>${C.store(res.store).name} ${res.slot}</strong> · <a href="${rel}order/index.html#pickup">픽업 예약</a>`;
      await agentDone;
      running = false;
    });
  }
  renderCart();

  // ── 부위표 ──────────────────────────────────────
  const tabs = $$('[role="tab"]');
  if (tabs.length) {
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const fUse = $('[data-f-use]'), fSort = $('[data-f-sort]');
    function activate(i, focus) {
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; panels[j].hidden = i !== j; });
      if (focus) tabs[i].focus();
      applyFilter();
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => activate(i, false));
      t.addEventListener('keydown', (e) => {
        let n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); activate(n, true); }
      });
    });
    function applyFilter() {
      const use = fUse.value, sort = fSort.value;
      panels.forEach((p) => {
        const tb = $('tbody', p);
        const rows = $$('tr', tb);
        rows.sort((a, b) => {
          if (sort === 'price-asc') return a.dataset.price - b.dataset.price;
          if (sort === 'price-desc') return b.dataset.price - a.dataset.price;
          if (sort === 'aging') return b.dataset.aging - a.dataset.aging || a.dataset.order - b.dataset.order;
          return a.dataset.order - b.dataset.order;
        }).forEach((r) => tb.appendChild(r));
        let shown = 0;
        rows.forEach((r) => {
          const ok = !use || r.dataset.uses.split(' ').includes(use);
          r.hidden = !ok; if (ok) shown += 1;
          const rg = $(`.rg[data-cut="${r.dataset.row}"]`, p);
          if (rg) rg.classList.toggle('is-dim', !ok);
        });
        $('[data-empty]', p).hidden = shown > 0;
        $('table', p).hidden = shown === 0;
        p.dataset.shown = shown; p.dataset.all = rows.length;
      });
      const act = panels.find((p) => !p.hidden);
      const k = D.KINDS.find((x) => x.id === act.dataset.kind).name;
      $('[data-cut-count]').textContent = `${k} ${act.dataset.all}종 중 ${act.dataset.shown}종`;
    }
    fUse.addEventListener('change', applyFilter);
    fSort.addEventListener('change', applyFilter);
    function pick(id, from) {
      const c = C.cut(id);
      const p = document.getElementById('panel-' + c.kind);
      $$('.rg', p).forEach((g) => g.setAttribute('aria-pressed', String(g.dataset.cut === id)));
      $$('.row-pick', p).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cut === id)));
      $$('tr[data-row]', p).forEach((r) => r.classList.toggle('is-picked', r.dataset.row === id));
      const pk = $('[data-pick]', p);
      pk.innerHTML = `<strong>${escH(C.fullName(c))}</strong> · 100 g ${C.won(c.price)}원 · ${c.aging ? '숙성 ' + c.aging + '일' : '숙성 안 함'} · 권장 두께 ${c.thick} cm<br><button type="button" class="btn" data-ask-cut="${c.id}">에이전트에게 묻기</button>`;
      if (from === 'fig') {
        const row = $(`tr[data-row="${id}"]`, p);
        if (row && !row.hidden) row.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' });
      }
    }
    $$('.rg').forEach((g) => {
      g.addEventListener('click', () => pick(g.dataset.cut, 'fig'));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(g.dataset.cut, 'fig'); } });
    });
    $$('.row-pick').forEach((b) => b.addEventListener('click', () => pick(b.dataset.cut, 'row')));
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ask-cut]');
      if (b) { openRail(false); ask(C.fullName(C.cut(b.dataset.askCut))); }
    });
    applyFilter();
  }

  // ── 주문 계산 ───────────────────────────────────
  const calc = $('[data-calc]');
  if (calc) {
    const sCut = $('#o-cut'), sUse = $('#o-use'), iPeople = $('#o-people'), sThick = $('#o-thick');
    function fillUses(keep) {
      const c = C.cut(sCut.value);
      const prev = sUse.value;
      sUse.innerHTML = c.uses.map((u) => `<option value="${u}">${C.useName(u)}</option>`).join('');
      if (keep && c.uses.includes(prev)) sUse.value = prev;
    }
    function update() {
      const c = C.cut(sCut.value);
      const ok = intIn(iPeople.value, 1, 30);
      fieldErr(iPeople, ok ? '' : '인원: 1~30 사이의 정수를 입력하세요.');
      if (!ok) { ['g', 'pcs', 'price', 'stock'].forEach((k) => { $(`[data-o-${k}]`).textContent = '—'; }); $('[data-calc-add]').disabled = true; return null; }
      const r = C.orderCalc(c.id, Number(iPeople.value), sUse.value, Number(sThick.value));
      $('[data-o-g]').textContent = C.kg(r.g);
      $('[data-o-pcs]').textContent = `약 ${r.pieces}장 · 한 장 ${r.per} g`;
      $('[data-o-price]').textContent = C.won(r.price) + '원';
      $('[data-o-stock]').textContent = r.stockOk ? `남은 양 ${c.stock} kg · 주문 가능` : `남은 양 ${c.stock} kg · 부족`;
      $('[data-calc-add]').disabled = !r.stockOk;
      return r;
    }
    sCut.addEventListener('change', () => { fillUses(true); sThick.value = String(C.cut(sCut.value).thick); update(); });
    [sUse, sThick].forEach((x) => x.addEventListener('change', update));
    iPeople.addEventListener('input', update);
    fillUses(false); sThick.value = String(C.cut(sCut.value).thick); update();
    $('[data-calc-add]').addEventListener('click', () => {
      const r = update(); if (!r) return;
      const c = C.cut(sCut.value);
      cartAdd([{ id: c.id, g: r.g }]);
      say(`${C.fullName(c)} ${C.kg(r.g)}을 장바구니에 담았습니다.`);
      agentSay({ who: 'ag', t: stamp(), lines: [`주문 계산: ${C.josa(C.fullName(c) + ' ' + C.kg(r.g), '을/를')} 담았습니다.`, `두께 ${sThick.value} cm · 약 ${r.pieces}장 · ${C.won(r.price)}원`], rule: '주문 계산' });
    });

    // 픽업 예약
    const form = $('[data-pickup]');
    const slotsEl = $('[data-slots]');
    const pre = ss.get('sg-pick', null);
    if (pre) { const rd = $(`input[name="store"][value="${pre.store}"]`, form); if (rd && !rd.disabled) rd.checked = true; }
    function renderSlots() {
      const st = $('input[name="store"]:checked', form).value;
      const list = C.slots(st);
      slotsEl.innerHTML = list.map((s) => `<label class="slot"><input type="radio" name="slot" value="${s.t}"${s.state !== 'open' ? ' disabled' : ''}${pre && pre.store === st && pre.slot === s.t ? ' checked' : ''}><span>${s.t}<small>${{ open: '가능', past: '지남', full: '마감', off: '휴무' }[s.state]}</small></span></label>`).join('');
    }
    $$('input[name="store"]', form).forEach((r) => r.addEventListener('change', renderSlots));
    renderSlots();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = [];
      const slotErr = $('#slot-err');
      const slot = $('input[name="slot"]:checked', form);
      if (!cart.length) errs.push(['o-cut', '장바구니: 부위를 1개 이상 담으세요.']);
      if (!slot) { slotErr.textContent = '시각: 픽업 시각을 고르세요.'; slotErr.hidden = false; const first = $('input[name="slot"]:not(:disabled)', form); if (first) { first.id = first.id || 'slot-first'; errs.push([first.id, '시각: 픽업 시각을 고르세요.']); } }
      else slotErr.hidden = true;
      const n = $('#p-name'), t = $('#p-tel');
      const nm = nameMsg(n.value); fieldErr(n, nm); if (nm) errs.push(['p-name', nm]);
      const tm = telMsg(t.value); fieldErr(t, tm); if (tm) errs.push(['p-tel', tm]);
      if (!errSummary(form, errs)) return;
      const st = C.store($('input[name="store"]:checked', form).value);
      const cnt = ss.get('sg-pno', 0) + 1; ss.set('sg-pno', cnt);
      const no = `SG-1021-${String(100 + cnt)}`;
      const done = $('[data-pickup-done]');
      done.innerHTML = `<h3>예약 확인 · 전송 없음</h3><dl class="kv"><div><dt>픽업 번호</dt><dd class="mono">${no}</dd></div><div><dt>매장 · 시각</dt><dd>${st.name} · ${D.NOW.label} ${slot.value}</dd></div><div><dt>부위</dt><dd>${cart.map((it) => `${escH(C.fullName(C.cut(it.id)))} ${C.kg(it.g)}`).join(', ')}</dd></div><div><dt>예상 금액</dt><dd>${C.won(cartTotal())}원</dd></div></dl><p class="note">연습용 화면입니다. 매장으로 전송되지 않았습니다.</p>`;
      done.hidden = false; done.focus();
      agentSay({ who: 'ag', t: stamp(), lines: [`픽업 번호 ${no} · ${st.name} ${slot.value}`, '연습용이라 매장으로 전송하지 않았습니다.'], rule: '픽업' });
    });
  }

  // ── 매장 ───────────────────────────────────────
  const sf = $('[data-store-filter]');
  if (sf) {
    const items = $$('[data-store]');
    function apply() {
      const area = sf.area.value, open = sf.open.checked, table = sf.table.checked;
      let n = 0;
      items.forEach((li) => {
        const ok = (!area || li.dataset.area === area) && (!open || li.dataset.open === 'true') && (!table || li.dataset.table === 'true');
        li.hidden = !ok; if (ok) n += 1;
      });
      $('[data-store-count]').textContent = `${n}곳`;
      $('[data-store-empty]').hidden = n > 0;
    }
    sf.addEventListener('change', apply);
    sf.addEventListener('submit', (e) => e.preventDefault());
    apply();
  }

  // ── 2층 식당 예약 ───────────────────────────────
  const book = $('[data-book]');
  if (book) {
    const sStore = $('#t-store'), sDate = $('#t-date');
    const DAYS = '일월화수목금토';
    function fillDates() {
      const s = C.store(sStore.value);
      const prev = sDate.value;
      const out = [];
      for (let i = 0; i < 11; i++) {
        const d = new Date(D.NOW.iso + 'T00:00:00'); d.setDate(d.getDate() + i);
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const off = DAYS[d.getDay()] === s.closedDay;
        out.push(`<option value="${iso}"${off ? ' disabled' : ''}>${C.md(d)}${i === 0 ? ' · 오늘' : ''}${off ? ' · 휴무' : ''}</option>`);
      }
      sDate.innerHTML = out.join('');
      const opt = $(`option[value="${prev}"]:not(:disabled)`, sDate);
      if (opt) sDate.value = prev; else sDate.value = $('option:not(:disabled)', sDate).value;
    }
    function renderBookSlots() {
      const full = sDate.value === D.NOW.iso ? (D.TABLE.full[sStore.value] || []) : [];
      $('[data-book-slots]').innerHTML = D.TABLE.slots.map((t) => `<label class="slot"><input type="radio" name="slot" value="${t}"${full.includes(t) ? ' disabled' : ''}><span>${t}<small>${full.includes(t) ? '마감' : '가능'}</small></span></label>`).join('');
    }
    function fee() {
      const a = Number($('#t-adult').value) || 0, k = Number($('#t-kid').value) || 0;
      $('[data-fee]').textContent = C.won(a * D.TABLE.setting[0][1] + k * D.TABLE.setting[1][1]) + '원';
    }
    sStore.addEventListener('change', () => { fillDates(); renderBookSlots(); });
    sDate.addEventListener('change', renderBookSlots);
    ['#t-adult', '#t-kid', '#t-baby'].forEach((s) => $(s).addEventListener('input', fee));
    fillDates(); renderBookSlots(); fee();
    book.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = [];
      const slot = $('input[name="slot"]:checked', book);
      const se = $('#t-slot-err');
      if (!slot) { se.textContent = '시각: 예약 시각을 고르세요.'; se.hidden = false; const f = $('input[name="slot"]:not(:disabled)', book); f.id = f.id || 't-slot-first'; errs.push([f.id, '시각: 예약 시각을 고르세요.']); } else se.hidden = true;
      const a = $('#t-adult'), k = $('#t-kid'), b = $('#t-baby');
      const pe = $('#t-people-err');
      let pm = '';
      if (![a, k, b].every((x) => intIn(x.value, 0, 20))) pm = '인원: 0~20 사이의 정수를 입력하세요.';
      else if (Number(a.value) < 1) pm = '인원: 어른 1명 이상이어야 합니다.';
      else if (Number(a.value) + Number(k.value) + Number(b.value) > 20) pm = '인원: 한 예약은 20명까지입니다.';
      pe.textContent = pm; pe.hidden = !pm; if (pm) { a.setAttribute('aria-invalid', 'true'); errs.push(['t-adult', pm]); } else a.removeAttribute('aria-invalid');
      const n = $('#t-name'), t = $('#t-tel');
      const nm = nameMsg(n.value); fieldErr(n, nm); if (nm) errs.push(['t-name', nm]);
      const tm = telMsg(t.value); fieldErr(t, tm); if (tm) errs.push(['t-tel', tm]);
      if (!errSummary(book, errs)) return;
      const s = C.store(sStore.value);
      const total = Number(a.value) + Number(k.value) + Number(b.value);
      const done = $('[data-book-done]');
      done.innerHTML = `<h3>예약 확인 · 전송 없음</h3><dl class="kv"><div><dt>매장</dt><dd>${s.name} ${s.table.floor}</dd></div><div><dt>일시</dt><dd>${$('option:checked', sDate).textContent.replace(' · 오늘', '')} ${slot.value}</dd></div><div><dt>인원</dt><dd>${total}명 (어른 ${a.value} · 초등학생 ${k.value} · 미취학 ${b.value})</dd></div><div><dt>상차림비</dt><dd>${$('[data-fee]').textContent}</dd></div></dl><p class="note">연습용 화면입니다. 매장으로 전송되지 않았습니다.</p>`;
      done.hidden = false; done.focus();
    });
  }

  // ── 에이전트 페이지 ─────────────────────────────
  function updateMine() {
    const m = $('[data-mine]');
    if (m) m.textContent = `대화 ${Array.isArray(log) ? log.length : 0}건 · 장바구니 ${cart.length}줄`;
  }
  const clr = $('[data-clear]');
  if (clr) clr.addEventListener('click', () => {
    ss.del('sg-cart'); ss.del('sg-pick'); cart = [];
    greet(); renderLog(); renderCart(); setStatus('idle');
    say('대화와 장바구니를 지웠습니다.');
  });
  updateMine();

  // ── 매장 열기 문의 ──────────────────────────────
  const p1 = $('[data-p1]');
  if (p1) {
    const flow = $('[data-pflow]');
    stepSet(flow, 0, 'run');
    p1.addEventListener('submit', (e) => {
      e.preventDefault();
      const n = $$('input[name="c"]:checked', p1).length;
      const err = $('#p1-err');
      if (!n) { err.textContent = '조건: 해당하는 항목을 1개 이상 고르세요.'; err.hidden = false; $('input[name="c"]', p1).focus(); return; }
      err.hidden = true;
      stepSet(flow, 0, 'done', `${n}개 해당`); stepSet(flow, 1, 'run');
      $('[data-p2-sec]').hidden = false;
      $('#h-p2').focus();
    });
    const p2 = $('[data-p2]');
    p2.addEventListener('submit', (e) => {
      e.preventDefault();
      const ans = {}; let first = null;
      D.PARTNER.questions.forEach((q) => {
        const c = $(`input[name="${q.id}"]:checked`, p2);
        const er = $(`#${q.id}-err`);
        if (!c) { er.textContent = `${q.label}: 하나를 고르세요.`; er.hidden = false; if (!first) first = $(`input[name="${q.id}"]`, p2); }
        else { er.hidden = true; ans[q.id] = c.value; }
      });
      if (first) { first.focus(); return; }
      const checks = $$('input[name="c"]', p1).map((x) => x.checked);
      const miss = D.PARTNER.checks.filter((t, i) => !checks[i]);
      let title, why;
      if (ans.homes === 'lt3') { title = '상권 재검토 후 상담'; why = '반경 1 km 세대 수가 정육점 한 곳의 상담 기준(3,000세대)보다 적습니다.'; }
      else if (ans.floor2 === 'yes' && checks.filter(Boolean).length >= 2) { title = '정육점 + 2층 식당 형태로 상담'; why = '2층을 쓸 수 있고 조건 2개 이상이 맞습니다.'; }
      else { title = '정육점 단독 형태로 상담'; why = ans.floor2 === 'yes' ? '2층 식당은 조건 2개 이상이 맞아야 상담합니다.' : '1층만 쓰는 판매대 형태입니다.'; }
      const zone = D.PARTNER.questions[0].options.find((o) => o[0] === ans.zone)[1];
      const v = $('[data-verdict]');
      v.innerHTML = `<h3>${title}</h3><p>${why}</p><dl class="kv"><div><dt>상권</dt><dd>${zone}</dd></div><div><dt>해당 조건</dt><dd>${checks.filter(Boolean).length}개 / ${checks.length}개</dd></div></dl>${miss.length ? `<p class="note">준비 필요</p><ul>${miss.map((m) => `<li>${m}</li>`).join('')}</ul>` : ''}`;
      v.hidden = false; v.focus();
      stepSet(flow, 1, 'done', title); stepSet(flow, 2, 'run');
      $('[data-p3-sec]').hidden = false;
    });
    const p3 = $('[data-p3]');
    p3.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = [];
      const n = $('#q-name'), t = $('#q-tel'), a = $('#q-area'), s = $('#q-size'), m = $('#q-msg'), g = $('input[name="agree"]', p3);
      const chk = (el, msg) => { fieldErr(el, msg); if (msg) errs.push([el.id, msg]); };
      chk(n, nameMsg(n.value));
      chk(t, telMsg(t.value));
      chk(a, a.value.trim().length < 2 || a.value.trim().length > 30 ? '희망 지역: 2~30자로 입력하세요.' : '');
      chk(s, s.value.trim() && !intIn(s.value, 30, 500) ? '점포 면적: 30~500 사이의 정수를 입력하세요. 모르면 비워 두세요.' : '');
      chk(m, m.value.trim().length < 10 ? '문의 내용: 10자 이상 입력하세요.' : '');
      g.id = 'q-agree';
      const ge = $('#q-agree-err');
      if (!g.checked) { ge.textContent = '동의: 연락처 사용에 동의해야 문의할 수 있습니다.'; ge.hidden = false; errs.push(['q-agree', ge.textContent]); } else ge.hidden = true;
      if (!errSummary(p3, errs)) return;
      const d = $('[data-p3-done]');
      d.innerHTML = `<h3>문의 확인 · 전송 없음</h3><p>${escH(n.value.trim())} · ${escH(a.value.trim())} · ${s.value ? escH(s.value) + ' m²' : '면적 미정'}</p><p class="note">연습용 화면입니다. 본부로 전송되지 않았습니다.</p>`;
      d.hidden = false; d.focus();
      stepSet(flow, 2, 'done', '확인 완료');
    });
  }

  // ── 소식 ───────────────────────────────────────
  const seg = $('.seg');
  if (seg) {
    $$('button', seg).forEach((b) => b.addEventListener('click', () => {
      $$('button', seg).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      let n = 0;
      $$('.news li').forEach((li) => { const ok = !b.dataset.cat || li.dataset.cat === b.dataset.cat; li.hidden = !ok; if (ok) n += 1; });
      $('[data-news-count]').textContent = `${n}건`;
    }));
  }

  // ── 질문 ───────────────────────────────────────
  $$('.acc-i button').forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!open));
    document.getElementById(b.getAttribute('aria-controls')).hidden = open;
  }));
})();
