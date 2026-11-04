// 감침세탁수선 — 화면 동작 · 도우미 판 · 작업 기록. 저장은 sessionStorage 뿐, 전송 없음.
(function () {
  'use strict';
  const D = window.GC, C = window.GCC, A = window.GCA;
  const { esc, won, md } = C;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const PAGE = body.dataset.page;
  const REL = body.dataset.rel || '';
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  const PAGE_NAME = { home: '처음', laundry: '세탁 요금', repair: '수선 요금', estimate: '맡기기 견적', status: '맡긴 옷 조회', pickup: '찾아가는 날', storage: '보관 · 미수령', care: '얼룩 · 소재', delivery: '수거 · 배달', info: '이용 안내' };
  const link = (page, hash = '', q = '') => `${REL}${page === 'home' ? '' : page + '/'}index.html${q}${hash ? '#' + hash : ''}`;
  const TEL = /^01[016789]-?\d{3,4}-?\d{4}$/;

  // 저장 -------------------------------------------------------------
  const S = {
    get(k, d) { try { const v = sessionStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { if (v == null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 불가 */ } },
  };
  const clone = (v) => (v == null ? null : JSON.parse(JSON.stringify(v)));

  // 작업 기록 · 되돌리기 --------------------------------------------
  function record(label, key, prev) {
    const log = S.get('gc.log', []);
    const n = (log[0] ? log[0].n : 0) + 1;
    log.unshift({ n, label, page: PAGE, key, prev: clone(prev), undone: false });
    S.set('gc.log', log.slice(0, 60));
    renderLog();
  }
  function undo(n) {
    const log = S.get('gc.log', []);
    const it = log.find((x) => x.n === n);
    if (!it || it.undone) return;
    S.set(it.key, it.prev);
    it.undone = true;
    S.set('gc.log', log);
    renderLog();
    document.dispatchEvent(new CustomEvent('gc:state', { detail: it.key }));
    say(`되돌림: ${it.label}`);
  }
  function renderLog() {
    const list = $('#log-list');
    const log = S.get('gc.log', []);
    $('#ax-log-n').textContent = log.filter((x) => !x.undone).length;
    if (!list) return;
    list.innerHTML = log.length ? log.map((x) => `<li class="${x.undone ? 'undone' : ''}"><span class="n">${String(x.n).padStart(2, '0')}</span><span><span class="t">${esc(x.label)}</span><span class="lp">${esc(PAGE_NAME[x.page] || '')}${x.undone ? ' · 되돌림' : ''}</span></span>${x.undone ? '<span></span>' : `<button type="button" class="b-small" data-undo="${x.n}">되돌리기</button>`}</li>`).join('') : '<li><span></span><span class="t">아직 기록이 없습니다.</span><span></span></li>';
  }
  // 화면 읽기 프로그램용 짧은 알림
  const live = document.createElement('p');
  live.className = 'vh'; live.setAttribute('aria-live', 'polite'); live.id = 'live';
  body.appendChild(live);
  function say(t) { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 30); }

  // 견적 상태 --------------------------------------------------------
  const EST0 = { items: {}, repairs: {}, express: false, how: 'shop', zone: 'solbat', want: '', mark: null };
  const estSt = () => ({ ...EST0, ...S.get('gc.est', {}) });
  function estSave(st, label, mark = 'keep') {
    const prev = S.get('gc.est', null);
    if (mark !== 'keep') st.mark = mark;
    else if (st.mark === 'final') st.mark = 'draft';
    S.set('gc.est', st);
    if (label) record(label, 'gc.est', prev);
    document.dispatchEvent(new CustomEvent('gc:state', { detail: 'gc.est' }));
  }
  function estSummary() {
    const st = estSt();
    const e = C.estimate(st);
    return { st, lines: e.lines, total: e.total, ready: e.ready };
  }
  const lineName = (kind, id) => (kind === 'l' ? C.L[id] : C.R[id]).name;

  // 탭 ---------------------------------------------------------------
  const tabHandlers = {};
  function setTab(group, v, focus) {
    const tl = $(`[data-tabs="${group}"]`);
    if (!tl) return;
    $$('[role="tab"]', tl).forEach((b) => {
      const on = b.dataset.v === v;
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
      if (on) { const p = document.getElementById(b.getAttribute('aria-controls')); if (p && group !== 'ax') p.setAttribute('aria-labelledby', b.id); }
    });
    (tabHandlers[group] || (() => {}))(v);
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[role="tab"]');
    if (b) setTab(b.closest('[data-tabs]').dataset.tabs, b.dataset.v);
  });
  document.addEventListener('keydown', (e) => {
    const b = e.target.closest && e.target.closest('[role="tab"]');
    if (!b || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const all = $$('[role="tab"]', b.closest('[data-tabs]'));
    let i = all.indexOf(b);
    i = e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length;
    e.preventDefault();
    setTab(b.closest('[data-tabs]').dataset.tabs, all[i].dataset.v, true);
  });

  // 메뉴 (좁은 화면) ---------------------------------------------------
  const menuBtn = $('#menu-btn'), nav = $('#nav');
  function menu(open) {
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.textContent = open ? '닫기' : '면 색인';
    nav.classList.toggle('is-open', open);
    body.classList.toggle('lock', open);
    if (open) $('a', nav).focus(); else menuBtn.focus();
  }
  menuBtn.addEventListener('click', () => menu(menuBtn.getAttribute('aria-expanded') !== 'true'));

  // 근거 줄 강조 -------------------------------------------------------
  function highlight(id, focus = true) {
    const el = id && document.getElementById(id);
    if (!el) return;
    if (PAGE === 'laundry' && el.dataset.cat) { setTab('lcat', 'all'); const f = $('#l-find'); if (f.value) { f.value = ''; filterLaundry(); } }
    if (PAGE === 'repair' && el.dataset.cat) setTab('rcat', 'all');
    if (PAGE === 'care') setTab('care', id.startsWith('m-') || id === 'materials' ? 'materials' : 'stains');
    $$('.is-hl').forEach((x) => x.classList.remove('is-hl'));
    if (el.matches('[data-row], #rules, #pay, #hours, #zones, #options, #samples')) el.classList.add('is-hl');
    el.scrollIntoView({ block: 'center', behavior: RM.matches ? 'auto' : 'smooth' });
    if (focus) { if (!el.hasAttribute('tabindex')) el.tabIndex = -1; el.focus({ preventScroll: true }); }
  }
  const hashNow = () => decodeURIComponent(location.hash.slice(1));
  window.addEventListener('hashchange', () => highlight(hashNow()));

  // 경고 카드 ---------------------------------------------------------
  const dismissed = () => S.get('gc.dismiss', []);
  function warnHTML(list) {
    const off = dismissed();
    return list.filter((w) => !off.includes(w.id)).map((w) => `<div class="warn" data-w="${esc(w.id)}"><p class="warn-h"><span>${esc(w.t)}</span><button type="button" data-dismiss="${esc(w.id)}" aria-label="알림 닫기: ${esc(w.t)}">닫기</button></p><div class="warn-b"><p>${esc(w.why)}</p><p>${esc(w.fix)}</p>${w.act ? `<button type="button" class="b-small" data-wact="${w.act[0]}">${esc(w.act[1])}</button>` : ''}</div></div>`).join('');
  }
  document.addEventListener('click', (e) => {
    const d = e.target.closest('[data-dismiss]');
    if (d) {
      const off = dismissed(); off.push(d.dataset.dismiss); S.set('gc.dismiss', off);
      const card = d.closest('.warn'); const next = card.nextElementSibling || card.parentElement.closest('section, form');
      card.remove(); say('알림을 닫았습니다');
      if (next && next.focus) { if (!next.hasAttribute('tabindex')) next.tabIndex = -1; next.focus(); }
      return;
    }
    const a = e.target.closest('[data-wact]');
    if (a) wAct(a.dataset.wact);
  });
  function wAct(k) {
    if (k === 'express') { const st = estSt(); st.express = true; estSave(st, '알림에서 급행으로 바꿈'); }
    else if (k === 'shop') { const st = estSt(); st.how = 'shop'; estSave(st, '알림에서 가게 접수로 바꿈'); }
    else if (k === 'handoff') { openAx(); setTab('ax', 'hand'); fillHand(); $('#h-need').focus(); }
    else if (k === 'care') location.href = link('care', 'materials');
    else if (k === 'storage') location.href = link('storage', 'rules');
  }

  // 해석 칩 (말로 넣기 · 도우미 공용) ------------------------------------
  function parseHTML(p, key) {
    const chips = [];
    Object.entries(p.items).forEach(([id, q]) => chips.push([`i:${id}`, `${C.L[id].name} ${q}${C.L[id].unit}`]));
    Object.entries(p.repairs).forEach(([id, q]) => chips.push([`r:${id}`, `${C.R[id].name}${q > 1 ? ' ' + q : ''}`]));
    if (p.want) chips.push(['want', `원하는 날 ${md(p.want)}`]);
    if (p.express) chips.push(['express', '급행']);
    if (p.how === 'pickup') chips.push(['how', `수거 · ${(D.ZONES.find((z) => z.id === p.zone) || D.ZONES[0]).name}`]);
    return `<div class="parse" data-parse="${key}"><ul class="pchips" aria-label="읽은 조건">${chips.map(([k, t]) => `<li>${esc(t)} <button type="button" data-chip="${k}" aria-label="빼기: ${esc(t)}">빼기</button></li>`).join('') || '<li>읽은 조건 없음</li>'}</ul>${p.unread.length ? `<p class="unread"><b>못 읽은 부분:</b> ${p.unread.map((u) => `「${esc(u)}」`).join(', ')}</p>` : ''}<div class="btns"><button type="button" class="b-main" data-apply="${key}"${chips.length ? '' : ' disabled'}>견적 칸에 넣기</button></div></div>`;
  }
  function chipRemove(p, k) {
    if (k.startsWith('i:')) delete p.items[k.slice(2)];
    else if (k.startsWith('r:')) delete p.repairs[k.slice(2)];
    else if (k === 'want') p.want = null;
    else if (k === 'express') p.express = false;
    else if (k === 'how') { p.how = null; p.zone = null; }
  }
  function applyParse(p, from) {
    const st = estSt();
    Object.entries(p.items).forEach(([id, q]) => (st.items[id] = q));
    Object.entries(p.repairs).forEach(([id, q]) => (st.repairs[id] = q));
    if (p.want) st.want = p.want;
    if (p.express) st.express = true;
    if (p.how === 'pickup') { st.how = 'pickup'; if (p.zone) st.zone = p.zone; }
    const names = [...Object.keys(p.items).map((i) => C.L[i].name), ...Object.keys(p.repairs).map((i) => C.R[i].name)];
    estSave(st, `${from}: ${names.slice(0, 3).join(' · ')}${names.length > 3 ? ` 외 ${names.length - 3}` : ''} 칸 채움`, 'draft');
  }

  // 도우미 판 ---------------------------------------------------------
  const ax = $('#ax'), scrim = $('#ax-scrim'), axOpen = $('#ax-open');
  let axReturn = null;
  function openAx(from) {
    if (!ax.hidden && ax.classList.contains('is-open')) return;
    axReturn = from || document.activeElement || axOpen;
    ax.hidden = false; scrim.hidden = false;
    axOpen.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => requestAnimationFrame(() => ax.classList.add('is-open')));
    renderChat(); renderChips(); renderLog();
    setTimeout(() => { const sel = $('[data-tabs="ax"] [aria-selected="true"]').dataset.v; (sel === 'chat' ? $('#ax-q') : $(`#tab-ax-${sel}`)).focus(); }, 20);
  }
  function closeAx(back = true) {
    if (ax.hidden) return;
    ax.classList.remove('is-open');
    axOpen.setAttribute('aria-expanded', 'false');
    scrim.hidden = true;
    setTimeout(() => { ax.hidden = true; }, RM.matches ? 0 : 200);
    if (back && axReturn && document.contains(axReturn)) axReturn.focus(); else if (back) axOpen.focus();
  }
  axOpen.addEventListener('click', () => (ax.hidden ? openAx(axOpen) : closeAx()));
  $('#ax-close').addEventListener('click', () => closeAx());
  scrim.addEventListener('click', () => closeAx());
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!ax.hidden) { e.preventDefault(); closeAx(); }
    else if (nav.classList.contains('is-open')) menu(false);
  });
  ax.addEventListener('click', (e) => { if (e.target.closest('a[href]')) closeAx(false); });
  tabHandlers.ax = (v) => {
    ['chat', 'log', 'hand'].forEach((k) => { $('#ax-' + k).hidden = k !== v; });
    if (v === 'log') renderLog();
    if (v === 'hand' && !$('#h-sum').value) fillHand();
  };

  function renderChips() {
    $('#ax-chips').innerHTML = (A.CHIPS[PAGE] || []).map((c) => `<button type="button" data-q="${esc(c)}">${esc(c)}</button>`).join('');
  }
  function stepsHTML(steps, state) {
    return steps ? `<ol class="steps" aria-label="작업 단계">${steps.map((s, i) => `<li data-s="${state[i]}">${esc(s)} <span class="s">${{ wait: '대기', run: '진행 중', done: '완료' }[state[i]]}</span></li>`).join('')}</ol>` : '';
  }
  function ansHTML(a, i, state) {
    return `${stepsHTML(a.steps, state || a.steps?.map(() => 'done'))}<div class="a-body">${a.html}</div>${a.parse ? parseHTML(a.parse, 'chat-' + i) : ''}${a.refs && a.refs.length ? `<p class="refs"><span>근거:</span>${a.refs.map((r) => `<a href="${r.href}">${esc(r.t)}</a>`).join('')}</p>` : ''}${a.acts && a.acts.filter((x) => x[0] !== 'fill').length ? `<div class="acts">${a.acts.filter((x) => x[0] !== 'fill').map(([k, t]) => `<button type="button" data-act="${k}">${esc(t)}</button>`).join('')}</div>` : ''}`;
  }
  function renderChat(animateLast) {
    const chat = S.get('gc.chat', []);
    const list = $('#ax-msgs');
    if (!chat.length) { list.innerHTML = '<li><span class="who">안내</span><p class="empty-msg">품목 · 얼룩 · 접수 번호 · 구역 이름으로 물어보세요. 값과 날짜는 이 가게의 표로 계산합니다.</p></li>'; return; }
    list.innerHTML = chat.map((m, i) => m.q ? `<li><span class="who">물음</span><p class="me">${esc(m.q)}</p></li>` : `<li data-i="${i}"><span class="who">답</span><div>${ansHTML(m.a, i, animateLast && i === chat.length - 1 && m.a.steps ? m.a.steps.map((_, k) => (k === 0 ? 'run' : 'wait')) : null)}</div></li>`).join('');
    list.scrollTop = list.scrollHeight;
    if (animateLast) runSteps(list.lastElementChild);
  }
  function runSteps(li) {
    const items = $$('.steps li', li);
    if (!items.length) return;
    const set = (el, s) => { el.dataset.s = s; $('.s', el).textContent = { wait: '대기', run: '진행 중', done: '완료' }[s]; };
    if (RM.matches) { items.forEach((el) => set(el, 'done')); return; }
    let k = 0;
    const tick = () => { if (k > 0) set(items[k - 1], 'done'); if (k < items.length) { set(items[k], 'run'); k++; setTimeout(tick, 160); } };
    tick();
  }
  function ask(q) {
    q = String(q || '').trim();
    if (!q) { $('#ax-q').focus(); return; }
    const a = A.answer(q, { page: PAGE, rel: REL, est: estSummary() });
    const chat = S.get('gc.chat', []);
    chat.push({ q }, { a });
    S.set('gc.chat', chat.slice(-40));
    renderChat(true);
    $('#ax-q').value = '';
  }
  $('#ax-form').addEventListener('submit', (e) => { e.preventDefault(); ask($('#ax-q').value); });
  $('#ax-chips').addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (b) ask(b.dataset.q); });
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-ask]'); if (b) { openAx(b); setTab('ax', 'chat'); ask(b.dataset.ask); } });
  $('#ax-msgs').addEventListener('click', (e) => {
    const chat = S.get('gc.chat', []);
    const li = e.target.closest('[data-i]');
    const c = e.target.closest('[data-chip]');
    if (c && li) { const i = +li.dataset.i; chipRemove(chat[i].a.parse, c.dataset.chip); S.set('gc.chat', chat); renderChat(); const nb = $(`[data-i="${i}"] [data-chip], [data-i="${i}"] [data-apply]`, $('#ax-msgs')); if (nb) nb.focus(); say('칩을 뺐습니다'); return; }
    const ap = e.target.closest('[data-apply]');
    if (ap && li) { applyParse(chat[+li.dataset.i].a.parse, '도우미'); if (PAGE !== 'estimate') location.href = link('estimate'); else { closeAx(false); $('#est-out').focus(); } return; }
    const act = e.target.closest('[data-act]');
    if (act) { if (act.dataset.act === 'handoff') { setTab('ax', 'hand'); fillHand(); $('#h-sum').focus(); } }
  });
  $('#log-list').addEventListener('click', (e) => { const b = e.target.closest('[data-undo]'); if (b) { const n = +b.dataset.undo; undo(n); const nb = $('[data-undo]', $('#log-list')); (nb || $('#tab-ax-log')).focus(); } });

  // 상담 요청 ---------------------------------------------------------
  function fillHand() {
    const lines = [];
    const es = estSummary();
    if (es.lines.length) lines.push(`견적${es.st.mark === 'final' ? '(확정)' : '(초안)'}: ${es.lines.map((l) => `${l.name} ${l.qty}`).join(', ')} · ${won(es.total)} · 찾는 날 ${es.ready ? md(es.ready) : '—'}${es.st.want ? ` · 원하는 날 ${md(es.st.want)}` : ''}`);
    const rd = S.get('gc.rdraft', null);
    if (rd && rd.lines && rd.lines.length) lines.push(`수선 사진 견적: ${rd.gName} · ${rd.lines.map((l) => C.R[l].name).join(', ')}${rd.memo ? ` · ${rd.memo}` : ''}`);
    const lk = S.get('gc.look', null);
    if (lk) lines.push(`조회: ${lk.no}`);
    const qs = S.get('gc.chat', []).filter((m) => m.q).slice(-3).map((m) => m.q);
    if (qs.length) lines.push(`최근 질문: ${qs.join(' / ')}`);
    $('#h-sum').value = lines.join('\n') || '';
  }
  $('#hand-fill').addEventListener('click', () => { fillHand(); say('요약을 다시 채웠습니다'); });
  function fieldErr(id, msg) {
    const el = document.getElementById(id), er = document.getElementById(id + '-err');
    if (el) el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (er) { er.hidden = !msg; er.textContent = msg || ''; }
    return msg ? [id, msg] : null;
  }
  function errSum(boxId, errs) {
    const box = document.getElementById(boxId);
    if (!box) { if (errs[0]) document.getElementById(errs[0][0]).focus(); return; }
    if (!errs.length) { box.hidden = true; box.innerHTML = ''; return; }
    box.hidden = false;
    box.innerHTML = `<p>고칠 곳 ${errs.length}개</p><ul>${errs.map(([id, m]) => `<li><a href="#${id}" data-goto="${id}">${esc(m)}</a></li>`).join('')}</ul>`;
    box.focus();
  }
  document.addEventListener('click', (e) => { const g = e.target.closest('[data-goto]'); if (g) { e.preventDefault(); const el = document.getElementById(g.dataset.goto); (el.matches('fieldset') ? $('input', el) : el).focus(); } });
  $('#hand-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const sum = $('#h-sum').value.trim(), need = $('#h-need').value.trim(), when = $('#h-when').value, tel = $('#h-tel').value.trim();
    const errs = [
      fieldErr('h-sum', sum.length < 10 ? '요약을 10자 이상 적어 주세요.' : ''),
      fieldErr('h-need', need.length < 2 ? '물어볼 것을 적어 주세요.' : ''),
      fieldErr('h-when', !when ? '연락받을 시간을 고르세요.' : ''),
      fieldErr('h-tel', !TEL.test(tel) ? '휴대전화를 010-0000-0000 형식으로 적어 주세요.' : ''),
    ].filter(Boolean);
    errSum('hand-sum', errs);
    if (errs.length) { $('#hand-out').innerHTML = ''; return; }
    const prev = S.get('gc.hand', null);
    const req = { sum, need, when, tel };
    S.set('gc.hand', req);
    record('상담 요청서 확인', 'gc.hand', prev);
    $('#hand-out').innerHTML = `<div class="head-stamp"><b>상담 요청서 · 전송되지 않음</b><span class="stamp final">확인</span></div><pre>${esc(`요약\n${sum}\n\n물어볼 것\n${need}\n\n연락: ${when} · ${tel}`)}</pre><p class="ax-sub">이 브라우저에만 저장했습니다. 가게에 알리려면 전화하세요. 가게 전화: ${D.SITE.tel}</p>`;
    $('#hand-out').tabIndex = -1; $('#hand-out').focus();
  });

  // 처음: 조회 칸 → 조회 면 --------------------------------------------
  const look = $('[data-look]');
  if (look) look.addEventListener('submit', (e) => {
    const no = $('#lk-no').value.trim(), ph = $('#lk-ph').value.trim();
    const errs = [fieldErr('lk-no', /^GC-?\d{4}-?\d{2}$/i.test(no) ? '' : '접수 번호를 GC-0000-00 형식으로 적어 주세요.'), fieldErr('lk-ph', /^\d{4}$/.test(ph) ? '' : '숫자 4개를 적어 주세요.')].filter(Boolean);
    if (errs.length) { e.preventDefault(); document.getElementById(errs[0][0]).focus(); }
  });

  // 2면 세탁 요금 ------------------------------------------------------
  let lcat = 'all';
  function filterLaundry() {
    const q = ($('#l-find').value || '').trim();
    let n = 0;
    $$('#table tbody tr').forEach((tr) => { const on = (lcat === 'all' || tr.dataset.cat === lcat) && (!q || tr.dataset.find.includes(q)); tr.hidden = !on; if (on) n++; });
    $('#l-find-n').textContent = `${n}개`;
    $('#l-empty').hidden = n > 0;
  }
  if (PAGE === 'laundry') {
    tabHandlers.lcat = (v) => { lcat = v; filterLaundry(); };
    $('#l-find').addEventListener('input', filterLaundry);
  }
  if (PAGE === 'repair') tabHandlers.rcat = (v) => { $$('#rtable tbody tr').forEach((tr) => { tr.hidden = !(v === 'all' || tr.dataset.cat === v); }); };
  if (PAGE === 'care') tabHandlers.care = (v) => { $$('[data-pane]').forEach((p) => { p.hidden = p.dataset.pane !== v; }); };

  // 3면 수선 사진 견적 ---------------------------------------------------
  if (PAGE === 'repair') {
    const gName = (v) => (D.PHOTO_EST.garments.find((g) => g[0] === v) || [, v])[1];
    const pName = (v) => (D.PHOTO_EST.parts.find((g) => g[0] === v) || [, v])[1];
    $('#pe-file').addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) { $('#pe-prev').hidden = true; return; }
      if (!/^image\//.test(f.type)) { fieldErr('pe-file', '사진 파일을 고르세요.'); $('#pe-prev').hidden = true; return; }
      fieldErr('pe-file', '');
      let img = $('#pe-img');
      if (!img) { img = document.createElement('img'); img.id = 'pe-img'; img.alt = '고른 사진 미리보기'; $('#pe-prev').prepend(img); }
      img.src = URL.createObjectURL(f);
      $('#pe-cap').textContent = `${f.name} · 이 브라우저에서만 보임 · 올라가지 않음`;
      $('#pe-prev').hidden = false;
    });
    function renderDraft() {
      const rd = S.get('gc.rdraft', null);
      const out = $('#pe-out');
      if (!rd) { out.innerHTML = '<p class="note">옷 종류와 부위를 고르면 여기에 초안이 나옵니다.</p>'; return; }
      const lines = rd.lines.map((id) => C.R[id]);
      const lo = lines.reduce((s, r) => s + r.price, 0);
      const hi = Math.round(lo * 1.3 / 1000) * 1000;
      const days = lines.length ? Math.max(...lines.map((r) => r.days)) : 0;
      out.innerHTML = `<div class="head-stamp"><h3 class="hl-m">${esc(rd.gName)} 수선 견적</h3><span class="stamp${rd.mark === 'final' ? ' final' : ''}">${rd.mark === 'final' ? '확정' : '초안'}</span></div>
<table class="sheet"><caption class="vh">수선 견적 초안</caption><thead><tr><th scope="col">수선</th><th scope="col" class="num">값</th><th scope="col" class="num">소요일</th><th scope="col">근거 · 고치기</th></tr></thead><tbody>${lines.map((r) => `<tr><th scope="row">${esc(r.name)}</th><td class="num" data-l="값">${won(r.price)}</td><td class="num" data-l="소요일">${r.days}일</td><td data-l="근거"><a href="#r-${r.id}">요금표 줄</a> <button type="button" class="b-small" data-pe-del="${r.id}" aria-label="빼기: ${esc(r.name)}">빼기</button></td></tr>`).join('') || '<tr><td colspan="4">남은 수선이 없습니다.</td></tr>'}</tbody></table>
<dl class="kv"><div><dt>값 범위</dt><dd>${won(lo)} ~ ${won(hi)} (실물 확인 뒤 확정)</dd></div><div><dt>소요일</dt><dd>영업일 ${days}일 · 오늘 맡기면 ${days ? md(C.pickupCalc(C.today, '10:00', [], rd.lines).ready) : '—'}</dd></div>${rd.memo ? `<div><dt>메모</dt><dd>${esc(rd.memo)}</dd></div>` : ''}${rd.miss.length ? `<div><dt>표에 없음</dt><dd>${rd.miss.map(pName).join(' · ')} · 가게에서 보고 정함</dd></div>` : ''}</dl>
<div class="btns"><button type="button" class="b-main" id="pe-final"${rd.mark === 'final' || !lines.length ? ' disabled' : ''}>초안 확정</button><button type="button" class="b-line" id="pe-cart"${lines.length ? '' : ' disabled'}>견적에 담기</button></div>`;
    }
    $('#pe-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const g = ($('input[name="pe-g"]:checked') || {}).value;
      const parts = $$('input[name="pe-p"]:checked').map((x) => x.value);
      const errs = [fieldErr('pe-g', g ? '' : '옷 종류를 고르세요.'), fieldErr('pe-p', parts.length ? '' : '고칠 부위를 하나 이상 고르세요.')].filter(Boolean);
      errSum('pe-sum', errs);
      if (errs.length) return;
      const d = C.photoDraft(g, parts);
      const prev = S.get('gc.rdraft', null);
      S.set('gc.rdraft', { g, gName: gName(g), parts, lines: d.lines.map((r) => r.id), miss: d.miss, memo: $('#pe-memo').value.trim(), mark: 'draft' });
      record(`수선 사진 견적 초안: ${gName(g)} · ${parts.map(pName).join(' · ')}`, 'gc.rdraft', prev);
      renderDraft();
      $('#pe-out').tabIndex = -1; $('#pe-out').focus();
    });
    $('#pe-out').addEventListener('click', (e) => {
      const rd = S.get('gc.rdraft', null); if (!rd) return;
      const del = e.target.closest('[data-pe-del]');
      if (del) { const prev = clone(rd); rd.lines = rd.lines.filter((x) => x !== del.dataset.peDel); rd.mark = 'draft'; S.set('gc.rdraft', rd); record(`수선 초안에서 뺌: ${C.R[del.dataset.peDel].name}`, 'gc.rdraft', prev); renderDraft(); ($('[data-pe-del]', $('#pe-out')) || $('#pe-out')).focus(); return; }
      if (e.target.id === 'pe-final') { const prev = clone(rd); rd.mark = 'final'; S.set('gc.rdraft', rd); record(`수선 견적 확정: ${rd.gName}`, 'gc.rdraft', prev); renderDraft(); $('#pe-cart').focus(); say('수선 견적을 확정했습니다'); }
      if (e.target.id === 'pe-cart') { const st = estSt(); rd.lines.forEach((id) => (st.repairs[id] = (st.repairs[id] || 0) + 1)); estSave(st, `수선 견적을 맡기기 견적에 담음: ${rd.gName}`, 'draft'); location.href = link('estimate'); }
    });
    document.addEventListener('gc:state', (e) => { if (e.detail === 'gc.rdraft') renderDraft(); });
    renderDraft();
  }

  // 4면 맡기기 견적 -----------------------------------------------------
  if (PAGE === 'estimate') {
    const out = $('#est-out');
    function renderEst() {
      const st = estSt();
      const e = C.estimate(st);
      // 담은 것
      $('#cart-body').innerHTML = e.lines.map((l) => `<tr><th scope="row">${esc(l.name)}${l.ex ? ' · 급행' : ''}<br><span class="note">${esc(l.method)} · ${won(l.each)}</span></th><td class="num" data-l="수량"><span class="qty"><button type="button" data-q="${l.kind}:${l.id}:-1" aria-label="${esc(l.name)} 하나 빼기">−</button><output aria-live="off">${l.qty}</output><button type="button" data-q="${l.kind}:${l.id}:1" aria-label="${esc(l.name)} 하나 더하기">+</button></span></td><td class="num" data-l="값">${won(l.sum)}</td><td class="num" data-l="소요일">${l.days}일</td><td data-l="근거"><a href="${link(l.kind === 'l' ? 'laundry' : 'repair', `${l.kind}-${l.id}`)}">요금표 줄</a></td></tr>`).join('');
      $('#cart-empty').hidden = e.lines.length > 0;
      // 조건
      $('#c-ex').checked = !!st.express;
      $$('input[name="c-how"]').forEach((r) => { r.checked = r.value === st.how; });
      $('#c-zone').value = st.zone; $('#c-zone').disabled = st.how !== 'pickup';
      $('#c-want').value = st.want || '';
      // 결과
      const stamp = st.mark ? `<span class="stamp${st.mark === 'final' ? ' final' : ''}">${st.mark === 'final' ? '확정' : '초안'}</span>` : '';
      out.innerHTML = e.lines.length ? `<div class="head-stamp"><p class="total">${won(e.total)}</p>${stamp}</div>
<dl class="kv">
<div><dt>세탁 · 수선</dt><dd>${won(e.sub)} · ${e.lines.length}가지</dd></div>
${e.fee ? `<div><dt>수거비</dt><dd>${won(e.fee)} (최소 금액 미만)</dd></div>` : ''}
<div><dt>${e.how === 'pickup' ? '수거' : '접수'}</dt><dd>${md(e.recv)}${e.how === 'pickup' ? ` · ${esc((D.ZONES.find((z) => z.id === st.zone) || D.ZONES[0]).name)}` : ` · ${D.RULES.cutoff} 전 접수 기준`}</dd></div>
<div><dt>소요일</dt><dd>영업일 ${e.days}일${e.both ? ' (세탁 + 수선 하루 더)' : ''}</dd></div>
<div><dt>찾는 날</dt><dd><span class="tag"><b>${md(e.ready)}</b> ${D.RULES.ready}부터</span></dd></div>
${e.deliver ? `<div><dt>배달</dt><dd>${md(e.deliver)}</dd></div>` : ''}
${st.want ? `<div><dt>원하는 날</dt><dd>${md(st.want)}</dd></div>` : ''}
</dl>` : '<p class="note">품목을 담으면 합계와 찾는 날이 나옵니다.</p>';
      $('#est-warns').innerHTML = warnHTML(C.warnings(st, e));
      $('#est-final').disabled = !e.lines.length || st.mark === 'final';
      // 세 가지 안
      const ops = C.options3(st);
      const cur = st.how === 'pickup' ? 'pick' : st.express ? 'fast' : 'base';
      $('#opts3').innerHTML = e.lines.length ? ops.map((o) => `<div class="opt${o.id === cur ? ' is-on' : ''}"><h3>${o.name}</h3><dl class="kv"><div><dt>값</dt><dd>${won(o.est.total)}</dd></div><div><dt>찾는 날</dt><dd>${o.est.ready ? md(o.est.ready) : '—'}${o.est.deliver ? ` · 배달 ${md(o.est.deliver)}` : ''}</dd></div><div><dt>가게에 오는 횟수</dt><dd>${o.est.visits}번</dd></div></dl><p>${esc(o.why)}</p><div class="btns"><button type="button" class="b-line" data-opt="${o.id}"${o.id === cur ? ' aria-pressed="true"' : ' aria-pressed="false"'}>이 안으로</button></div></div>`).join('') : '<p class="note">품목을 담으면 세 안을 계산합니다.</p>';
    }
    out.tabIndex = -1;
    $('#add-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = $('#add-it').value, q = Number($('#add-q').value);
      const errs = [fieldErr('add-it', v ? '' : '품목을 고르세요.'), fieldErr('add-q', q >= 1 && q <= 50 && Number.isInteger(q) ? '' : '1~50 사이 수량을 적어 주세요.')].filter(Boolean);
      if (errs.length) { document.getElementById(errs[0][0]).focus(); return; }
      const [k, id] = v.split(':');
      const st = estSt();
      const b = k === 'l' ? st.items : st.repairs;
      b[id] = (b[id] || 0) + q;
      estSave(st, `담음: ${lineName(k, id)} ${q}`);
      say(`${lineName(k, id)} ${q} 담음`);
    });
    $('#cart-body').addEventListener('click', (e) => {
      const b = e.target.closest('[data-q]'); if (!b) return;
      const [k, id, d] = b.dataset.q.split(':');
      const st = estSt();
      const bag = k === 'l' ? st.items : st.repairs;
      bag[id] = (bag[id] || 0) + Number(d);
      if (bag[id] <= 0) delete bag[id];
      estSave(st, `수량 ${Number(d) > 0 ? '더함' : '뺌'}: ${lineName(k, id)}`);
      const again = $(`[data-q="${b.dataset.q}"]`); (again || $('#add-it')).focus();
    });
    $('#c-ex').addEventListener('change', (e) => { const st = estSt(); st.express = e.target.checked; estSave(st, e.target.checked ? '급행으로 바꿈' : '급행 뺌'); });
    $$('input[name="c-how"]').forEach((r) => r.addEventListener('change', () => { const st = estSt(); st.how = r.value; estSave(st, r.value === 'pickup' ? '수거 · 배달로 바꿈' : '가게 접수로 바꿈'); }));
    $('#c-zone').addEventListener('change', (e) => { const st = estSt(); st.zone = e.target.value; estSave(st, `수거 구역: ${e.target.selectedOptions[0].textContent}`); });
    $('#c-want').addEventListener('change', (e) => { const st = estSt(); st.want = e.target.value; estSave(st, e.target.value ? `원하는 날: ${md(e.target.value)}` : '원하는 날 지움'); });
    $('#est-final').addEventListener('click', () => { const st = estSt(); estSave(st, '견적서 확정', 'final'); say('견적서를 확정했습니다'); $('#est-out').focus(); });
    $('#est-clear').addEventListener('click', () => { estSave({ ...EST0 }, '견적 비움', null); say('견적을 비웠습니다'); $('#add-it').focus(); });
    $('#opts3').addEventListener('click', (e) => {
      const b = e.target.closest('[data-opt]'); if (!b) return;
      const st = estSt();
      if (b.dataset.opt === 'base') { st.express = false; st.how = 'shop'; }
      if (b.dataset.opt === 'fast') { st.express = true; st.how = 'shop'; }
      if (b.dataset.opt === 'pick') { st.express = false; st.how = 'pickup'; }
      estSave(st, `세 가지 안에서 고름: ${{ base: '기본', fast: '급행', pick: '수거 · 배달' }[b.dataset.opt]}`);
      $(`[data-opt="${b.dataset.opt}"]`).focus();
      say('안을 반영했습니다');
    });
    // 문장으로 넣기
    let sayParse = null;
    function renderSay() { $('#say-out').innerHTML = sayParse ? parseHTML(sayParse, 'say') : ''; }
    $('#say-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = $('#say-q').value.trim();
      if (fieldErr('say-q', q ? '' : '맡길 것을 적어 주세요.')) { $('#say-q').focus(); return; }
      sayParse = C.parseText(q);
      renderSay();
    });
    $('#say-out').addEventListener('click', (e) => {
      const c = e.target.closest('[data-chip]');
      if (c) { chipRemove(sayParse, c.dataset.chip); renderSay(); ($('[data-chip]', $('#say-out')) || $('[data-apply]', $('#say-out'))).focus(); say('칩을 뺐습니다'); return; }
      if (e.target.closest('[data-apply]')) { applyParse(sayParse, '문장으로 넣기'); sayParse = null; renderSay(); out.focus(); }
    });
    // 붙여넣기
    let pasted = null;
    const allOpts = (sel) => D.LCATS.map(([c, t]) => `<optgroup label="세탁 · ${t}">${D.LAUNDRY.filter((x) => x.cat === c).map((x) => `<option value="l:${x.id}"${sel === 'l:' + x.id ? ' selected' : ''}>${x.name}</option>`).join('')}</optgroup>`).join('') + `<optgroup label="수선">${D.REPAIR.map((x) => `<option value="r:${x.id}"${sel === 'r:' + x.id ? ' selected' : ''}>${x.name}</option>`).join('')}</optgroup>`;
    function renderPaste() {
      const box = $('#paste-out');
      if (!pasted) { box.innerHTML = ''; return; }
      box.innerHTML = `<p><b>읽은 줄 ${new Set(pasted.rows.map((r) => r.n)).size} · 못 읽은 줄 ${pasted.bad.length}</b></p>
${pasted.rows.length ? `<table class="sheet ptable"><caption class="vh">읽은 품목</caption><thead><tr><th scope="col">줄</th><th scope="col">품목</th><th scope="col">수량</th><th scope="col">고치기</th></tr></thead><tbody>${pasted.rows.map((r, i) => `<tr><th scope="row">${r.n}</th><td data-l="품목"><label class="vh" for="pr-${i}">${r.n}번째 줄 품목</label><select id="pr-${i}" data-pr="${i}">${allOpts(r.kind + ':' + r.id)}</select></td><td data-l="수량"><label class="vh" for="pq-${i}">${r.n}번째 줄 수량</label><input id="pq-${i}" type="number" min="1" max="50" value="${r.qty}" data-pq="${i}"></td><td data-l="고치기"><button type="button" class="b-small" data-pd="${i}">빼기</button></td></tr>`).join('')}</tbody></table>` : ''}
${pasted.bad.length ? `<p class="unread"><b>못 읽은 줄:</b> ${pasted.bad.map((b) => `${b.n}번째 「${esc(b.line)}」 · ${b.why}`).join(', ')}</p>` : ''}
<div class="btns"><button type="button" class="b-main" id="paste-add"${pasted.rows.length ? '' : ' disabled'}>견적에 더하기</button></div>`;
    }
    $('#paste-sample').addEventListener('click', () => { $('#paste-t').value = D.PASTE_SAMPLE; $('#paste-t').focus(); });
    $('#paste-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const t = $('#paste-t').value;
      if (fieldErr('paste-t', t.trim() ? '' : '목록을 붙여 넣으세요.')) { $('#paste-t').focus(); return; }
      pasted = C.parsePaste(t);
      renderPaste();
    });
    $('#paste-out').addEventListener('change', (e) => {
      const s = e.target.closest('[data-pr]'), q = e.target.closest('[data-pq]');
      if (s) { const [k, id] = s.value.split(':'); Object.assign(pasted.rows[+s.dataset.pr], { kind: k, id }); }
      if (q) pasted.rows[+q.dataset.pq].qty = Math.max(1, Math.min(50, Number(q.value) || 1));
    });
    $('#paste-out').addEventListener('click', (e) => {
      const d = e.target.closest('[data-pd]');
      if (d) { pasted.rows.splice(+d.dataset.pd, 1); renderPaste(); ($('[data-pd]', $('#paste-out')) || $('#paste-t')).focus(); return; }
      if (e.target.id === 'paste-add') {
        const st = estSt();
        pasted.rows.forEach((r) => { const b = r.kind === 'l' ? st.items : st.repairs; b[r.id] = (b[r.id] || 0) + r.qty; });
        estSave(st, `붙여넣기 목록 ${pasted.rows.length}줄 더함`, 'draft');
        pasted = null; renderPaste(); out.focus();
      }
    });
    document.addEventListener('gc:state', (e) => { if (e.detail === 'gc.est') renderEst(); });
    renderEst();
  }

  // 5면 조회 -----------------------------------------------------------
  if (PAGE === 'status') {
    const outBox = $('#st-out');
    function show(no, ph, focus) {
      const r = C.lookup(no, ph);
      if (!r) { outBox.innerHTML = `<p class="err">찾은 접수 없음 · ${esc(no)} · 뒷자리 ${esc(ph)}</p><p>접수 번호와 뒷자리를 다시 확인하세요.</p><p class="note">예시 번호는 왼쪽 「예시 접수 번호」에 있습니다.</p>`; if (focus) { outBox.tabIndex = -1; outBox.focus(); } return; }
      const prev = S.get('gc.look', null);
      S.set('gc.look', { no: r.no });
      if (!prev || prev.no !== r.no) record(`맡긴 옷 조회: ${r.no}`, 'gc.look', prev);
      const warns = [];
      if (r.days > D.RULES.freeDays) warns.push({ id: 'over:' + r.no, t: `무료 보관 ${r.over}일 지남`, why: `무료 보관 ${md(r.freeUntil)}까지 · 지금 보관료 ${won(r.fee)}`, fix: `찾을 때 세탁비와 같이 냅니다. 최대 ${won(D.RULES.feeCap)}입니다.`, act: ['storage', '보관 규칙 보기'] });
      if (r.days > D.RULES.longDays - 14 && r.days <= D.RULES.longDays) warns.push({ id: 'long:' + r.no, t: '장기 보관 목록 2주 전', why: `${md(C.add(r.ready, D.RULES.longDays))}부터 장기 보관`, fix: '그 전에 찾으세요.', act: null });
      outBox.innerHTML = `<div class="st-head"><span class="tag">접수 <b>${esc(r.no)}</b></span><span>${r.allReady ? '모두 찾기 가능' : `찾는 날 ${md(r.ready)} ${D.RULES.ready}부터`}</span></div>
<dl class="kv"><div><dt>접수</dt><dd>${md(r.at.slice(0, 10))} ${r.at.slice(11)} · ${esc(r.how)}</dd></div><div><dt>찾는 날</dt><dd>${md(r.ready)}${r.days > 0 ? ` · ${r.days}일 지남` : r.days === 0 ? ' · 오늘' : ` · ${-r.days}일 남음`}</dd></div><div><dt>무료 보관</dt><dd>${md(r.freeUntil)}까지${r.fee ? ` · 보관료 ${won(r.fee)}` : ''}</dd></div></dl>
<div class="warns">${warnHTML(warns)}</div>
<ol class="items">${r.items.map(([n, q, s], i) => `<li><p class="nm"><span>${esc(n)} ${q}</span><span>${D.STAGES[s]}</span></p><div class="track"><span class="bar" data-p="${(s / 6) * 100}" style="transition-delay:${i * 60}ms" aria-hidden="true"></span><ol aria-label="${esc(n)} 단계: ${D.STAGES[s]}">${D.STAGES.map((t, k) => `<li class="${k < s ? 'done' : k === s ? 'now' : ''}"${k === s ? ' aria-current="step"' : ''}><span>${t}</span></li>`).join('')}</ol></div></li>`).join('')}</ol>`;
      requestAnimationFrame(() => requestAnimationFrame(() => $$('.bar', outBox).forEach((b) => { b.style.width = `calc(${b.dataset.p}% + 6px)`; })));
      if (focus) { outBox.tabIndex = -1; outBox.focus(); }
    }
    $('#st-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const no = $('#st-no').value.trim().toUpperCase().replace(/^GC-?(\d{4})-?(\d{2})$/, 'GC-$1-$2'), ph = $('#st-ph').value.trim();
      const errs = [fieldErr('st-no', /^GC-\d{4}-\d{2}$/.test(no) ? '' : '접수 번호를 GC-0000-00 형식으로 적어 주세요.'), fieldErr('st-ph', /^\d{4}$/.test(ph) ? '' : '휴대전화 뒷자리 숫자 4개를 적어 주세요.')].filter(Boolean);
      errSum('st-sum', errs);
      if (errs.length) return;
      $('#st-no').value = no;
      show(no, ph, true);
    });
    $$('[data-sample]').forEach((b) => b.addEventListener('click', () => { const [no, ph] = b.dataset.sample.split('|'); $('#st-no').value = no; $('#st-ph').value = ph; fieldErr('st-no', ''); fieldErr('st-ph', ''); show(no, ph, true); }));
    const qs = new URLSearchParams(location.search);
    if (qs.get('no')) { $('#st-no').value = qs.get('no').toUpperCase(); if (qs.get('ph')) { $('#st-ph').value = qs.get('ph'); show($('#st-no').value.replace(/^GC-?(\d{4})-?(\d{2})$/, 'GC-$1-$2'), qs.get('ph'), false); } }
  }

  // 6면 찾는 날 ---------------------------------------------------------
  if (PAGE === 'pickup') {
    $('#pk-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const d = $('#pk-d').value, t = $('#pk-t').value;
      const picks = $$('input[name="pk-i"]:checked').map((x) => x.value.split(':'));
      const errs = [fieldErr('pk-d', d && d >= C.today && d <= '2026-12-31' ? '' : `${md(C.today)}부터 12월 31일 사이 날짜를 고르세요.`), fieldErr('pk-items', picks.length ? '' : '품목을 하나 이상 고르세요.')].filter(Boolean);
      if (errs.length) { const el = document.getElementById(errs[0][0]); (el.matches('fieldset') ? $('input', el) : el).focus(); return; }
      const r = C.pickupCalc(d, t, picks.filter((p) => p[0] === 'l').map((p) => p[1]), picks.filter((p) => p[0] === 'r').map((p) => p[1]));
      const why = !C.isOpen(d) ? `${md(d)}은 휴무라 다음 영업일부터 셈` : r.late ? `${D.RULES.cutoff} 뒤 접수라 다음 영업일부터 셈` : `${D.RULES.cutoff} 전 접수 · 그날부터 셈`;
      $('#pk-out').innerHTML = `<p class="tag">찾는 날 <b>${md(r.ready)}</b> ${D.RULES.ready}부터</p><dl class="kv"><div><dt>맡기는 날</dt><dd>${md(d)} ${t}</dd></div><div><dt>셈 시작</dt><dd>${md(r.start)} · ${why}</dd></div><div><dt>소요일</dt><dd>영업일 ${r.days}일</dd></div>${r.closed.length ? `<div><dt>임시 휴무</dt><dd>${r.closed.map((c) => md(c) + ' ' + esc(D.CLOSED[c])).join(' · ')}</dd></div>` : ''}${r.ready > '2026-12-31' ? '<div><dt>달력</dt><dd>12월 뒤라 달력에 표시하지 않음</dd></div>' : ''}</dl>`;
      $$('#cals td').forEach((td) => td.classList.remove('recv', 'ready'));
      const rc = $(`#cals td[data-d="${r.start}"]`), rd = $(`#cals td[data-d="${r.ready}"]`);
      if (rc) rc.classList.add('recv');
      if (rd) rd.classList.add('ready');
      $('#pk-out').tabIndex = -1; $('#pk-out').focus();
    });
  }

  // 7면 보관료 ----------------------------------------------------------
  if (PAGE === 'storage') {
    $('#fee-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const d = $('#fee-d').value;
      if (fieldErr('fee-d', d && d <= C.today ? '' : `${md(C.today)}이나 그 전 날짜를 고르세요.`)) { $('#fee-d').focus(); return; }
      const days = C.diff(d, C.today);
      const f = C.storageFee(days);
      const w = [];
      if (days > D.RULES.talkDays) w.push({ id: 'talk', t: `${D.RULES.talkDays}일 지남`, why: '처리 방법을 전화로 상의하는 옷', fix: `가게로 전화하세요. ${D.SITE.tel}`, act: ['handoff', '상담 요청'] });
      else if (days > D.RULES.longDays) w.push({ id: 'long', t: `${D.RULES.longDays}일 지남`, why: '장기 보관 목록에 있는 옷', fix: '찾으러 오기 전에 전화하면 미리 꺼내 둡니다.', act: null });
      $('#fee-out').innerHTML = `<p class="tag">보관료 <b>${won(f.fee)}</b></p><dl class="kv"><div><dt>찾는 날</dt><dd>${md(d)} · ${days}일 지남</dd></div><div><dt>무료 보관</dt><dd>${md(C.add(d, D.RULES.freeDays))}까지</dd></div><div><dt>계산</dt><dd>${f.over ? `${f.over}일 × ${won(D.RULES.feePerDay)}${f.fee === D.RULES.feeCap ? ` → 상한 ${won(D.RULES.feeCap)}` : ''}` : '무료 기간 안'}</dd></div></dl><div class="warns">${warnHTML(w)}</div>`;
      $('#fee-out').tabIndex = -1; $('#fee-out').focus();
    });
  }

  // 9면 수거 신청 -------------------------------------------------------
  if (PAGE === 'delivery') {
    const zoneOf = (id) => D.ZONES.find((z) => z.id === id);
    function fillZone() {
      const z = zoneOf($('#dv-zone').value);
      const ds = [], from = C.add(C.today, 1);
      if (z) for (let i = 0; i < 14; i++) { const d = C.add(from, i); if (z.days.includes(C.dow(d)) && C.isOpen(d)) ds.push(d); }
      $('#dv-date').innerHTML = z ? `<option value="">고르기</option>${ds.map((d) => `<option value="${d}">${md(d)}</option>`).join('')}` : '<option value="">구역을 먼저 고르기</option>';
      $('#dv-slot').innerHTML = z ? `<option value="">고르기</option>${z.slots.map((s) => `<option>${s}</option>`).join('')}` : '<option value="">구역을 먼저 고르기</option>';
    }
    function minWarn() {
      const v = $('#dv-amt').value;
      const n = Number(v);
      $('#dv-warns').innerHTML = v !== '' && n >= 0 && n < D.RULES.minPickup ? warnHTML([{ id: 'dvmin:' + n, t: '수거 최소 금액 미만', why: `예상 ${won(n)} · 최소 ${won(D.RULES.minPickup)}`, fix: `수거비 ${won(D.RULES.pickupFee)}이 붙습니다. 품목을 더하거나 가게에 맡기세요.`, act: null }]) : '';
    }
    $('#dv-zone').addEventListener('change', fillZone);
    $('#dv-amt').addEventListener('input', minWarn);
    function renderPick() {
      const p = S.get('gc.pick', null);
      const box = $('#dv-out');
      if (!p) { box.innerHTML = ''; return; }
      const z = zoneOf(p.zone);
      box.innerHTML = `<div class="head-stamp"><h3 class="hl-m">수거 신청서</h3><span class="stamp${p.mark === 'final' ? ' final' : ''}">${p.mark === 'final' ? '확정' : '초안'}</span></div><dl class="kv"><div><dt>구역 · 날</dt><dd>${z ? z.name : ''} · ${p.date ? md(p.date) : '—'} · ${esc(p.slot)}</dd></div><div><dt>주소</dt><dd>${esc(p.addr)}</dd></div><div><dt>휴대전화</dt><dd>${esc(p.tel)}</dd></div><div><dt>예상 금액</dt><dd>${won(p.amt)}${p.amt < D.RULES.minPickup ? ` + 수거비 ${won(D.RULES.pickupFee)}` : ''}</dd></div>${p.memo ? `<div><dt>메모</dt><dd>${esc(p.memo)}</dd></div>` : ''}</dl><p class="note">전송되지 않습니다. 이 브라우저에만 저장합니다.</p><div class="btns"><button type="button" class="b-main" id="dv-final"${p.mark === 'final' ? ' disabled' : ''}>신청 확정</button></div>`;
    }
    $('#dv-draft').addEventListener('click', () => {
      const es = estSummary();
      if (!es.lines.length) { $('#dv-warns').innerHTML = warnHTML([{ id: 'noest-' + Date.now(), t: '맡기기 견적이 비어 있음', why: '채울 품목이 없습니다.', fix: '「맡기기 견적」에서 품목을 담은 뒤 다시 누르세요.', act: null }]); return; }
      const st = es.st;
      $('#dv-zone').value = st.zone || 'solbat'; fillZone();
      const e = C.estimate({ ...st, how: 'pickup' });
      $('#dv-date').value = e.recv; $('#dv-slot').selectedIndex = 1;
      $('#dv-amt').value = e.sub;
      $('#dv-memo').value = es.lines.map((l) => `${l.name} ${l.qty}`).join(', ').slice(0, 120);
      minWarn();
      record('수거 신청 칸을 견적으로 채움', 'gc.pickfill', null);
      say('견적으로 칸을 채웠습니다. 주소와 휴대전화를 적어 주세요.');
      $('#dv-addr').focus();
    });
    $('#dv-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (id) => $('#' + id).value.trim();
      const errs = [
        fieldErr('dv-zone', v('dv-zone') ? '' : '구역을 고르세요.'),
        fieldErr('dv-date', v('dv-date') ? '' : '수거 날을 고르세요.'),
        fieldErr('dv-slot', v('dv-slot') ? '' : '시간대를 고르세요.'),
        fieldErr('dv-addr', v('dv-addr').length >= 4 ? '' : '주소를 4자 이상 적어 주세요.'),
        fieldErr('dv-tel', TEL.test(v('dv-tel')) ? '' : '휴대전화를 010-0000-0000 형식으로 적어 주세요.'),
        fieldErr('dv-amt', v('dv-amt') !== '' && Number(v('dv-amt')) >= 0 ? '' : '예상 금액을 숫자로 적어 주세요.'),
      ].filter(Boolean);
      errSum('dv-sum', errs);
      if (errs.length) return;
      const prev = S.get('gc.pick', null);
      S.set('gc.pick', { zone: v('dv-zone'), date: v('dv-date'), slot: v('dv-slot'), addr: v('dv-addr'), tel: v('dv-tel'), amt: Number(v('dv-amt')), memo: v('dv-memo'), mark: 'draft' });
      record('수거 신청 초안', 'gc.pick', prev);
      renderPick();
      $('#dv-out').tabIndex = -1; $('#dv-out').focus();
    });
    $('#dv-out').addEventListener('click', (e) => {
      if (e.target.id !== 'dv-final') return;
      const p = S.get('gc.pick', null); const prev = clone(p);
      p.mark = 'final'; S.set('gc.pick', p); record('수거 신청 확정', 'gc.pick', prev); renderPick(); $('#dv-out').focus(); say('수거 신청을 확정했습니다');
    });
    document.addEventListener('gc:state', (e) => { if (e.detail === 'gc.pick') renderPick(); });
    renderPick();
  }

  // 10면 FAQ ------------------------------------------------------------
  $$('.faq-b').forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', open);
    document.getElementById(b.getAttribute('aria-controls')).hidden = !open;
  }));

  // 시작 --------------------------------------------------------------
  renderLog();
  document.addEventListener('gc:state', () => { if (!ax.hidden) renderChat(); });
  if (location.hash) setTimeout(() => highlight(hashNow()), 60);
})();
