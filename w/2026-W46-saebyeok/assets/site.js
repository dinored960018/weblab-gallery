// 새벽노드 — 화면 동작. 저장은 sessionStorage 까지, 전송 없음
(function () {
  'use strict';
  const D = window.SB, C = window.SBC, A = window.SBA;
  const { esc, num, won } = C;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REL = document.body.dataset.rel || '';
  const PAGE = document.body.dataset.page;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ss = {
    get(k, d) { try { const v = sessionStorage.getItem('sb.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem('sb.' + k, JSON.stringify(v)); } catch (e) { /* 저장 불가 */ } },
  };
  const go = (page, hash) => `${REL}${page ? page + '/' : ''}index.html${hash ? '#' + hash : ''}`;
  const CALC0 = { grade: 'g48', count: 1, hpd: 10, days: 22, region: 'seoul', plan: 'od' };
  const tm = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

  // ── 작업 기록 · 되돌리기
  const LOG = {
    all() { return ss.get('log', []); },
    add(what, kind, before, after) {
      const l = LOG.all();
      l.unshift({ id: Date.now() + '' + l.length, t: tm(), what, kind, before, after, undone: false });
      ss.set('log', l.slice(0, 40)); LOG.render();
    },
    undo(id) {
      const l = LOG.all(); const e = l.find((x) => x.id === id);
      if (!e || e.undone) return;
      e.undone = true; ss.set('log', l);
      if (e.kind === 'calc') { ss.set('calc', e.before); ss.set('need', e.before && e.before.__need ? e.before.__need : ss.get('need', null)); if (PAGE === 'pricing') Pricing.load(); }
      if (e.kind === 'quote') { ss.set('quote', e.before); if (PAGE === 'pricing') Pricing.quoteRender(); }
      if (e.kind === 'handoff') { ss.set('handoff', null); if (PAGE === 'contact') { const m = $('#ct-msg'); if (m) m.value = e.before || ''; } }
      LOG.render(); say(`되돌림 · ${e.what}`);
    },
    render() {
      const l = LOG.all(); const ol = $('#log'); const cnt = $('#log-cnt');
      if (cnt) cnt.textContent = l.filter((x) => !x.undone).length;
      if (!ol) return;
      ol.innerHTML = l.length ? l.map((e) => `<li class="${e.undone ? 'undone' : ''}"><span class="mono">${e.t}</span><span>${esc(e.what)}</span>${e.undone ? '<span class="sub">되돌림</span>' : `<button type="button" data-undo="${e.id}">되돌리기</button>`}</li>`).join('') : '<li><span></span><span class="sub">아직 바꾼 값이 없습니다.</span><span></span></li>';
    },
  };
  let liveEl;
  function say(t) { if (!liveEl) { liveEl = document.createElement('p'); liveEl.className = 'vh'; liveEl.setAttribute('aria-live', 'polite'); document.body.append(liveEl); } liveEl.textContent = ''; setTimeout(() => { liveEl.textContent = t; }, 30); }

  // ── 머리: 드롭다운 · 휴대전화 메뉴
  const ddBtn = $('.dd-btn'), ddMenu = $('#dd-prod');
  function dd(open) { ddBtn.setAttribute('aria-expanded', String(open)); ddMenu.hidden = !open; }
  ddBtn.addEventListener('click', () => dd(ddMenu.hidden));
  document.addEventListener('click', (e) => { if (!e.target.closest('.dd')) dd(false); });
  $('.dd').addEventListener('keydown', (e) => { if (e.key === 'Escape' && !ddMenu.hidden) { dd(false); ddBtn.focus(); e.stopPropagation(); } });
  $('.dd').addEventListener('focusout', (e) => { if (!e.currentTarget.contains(e.relatedTarget) && innerWidth > 900) dd(false); });
  const burger = $('.burger'), nav = $('#nav');
  function menu(open) { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기'); nav.classList.toggle('is-open', open); document.body.style.overflow = open ? 'hidden' : ''; if (open) nav.querySelector('a, button').focus(); }
  burger.addEventListener('click', () => menu(!nav.classList.contains('is-open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { menu(false); burger.focus(); } });
  addEventListener('resize', () => { if (innerWidth > 900 && nav.classList.contains('is-open')) menu(false); });

  // ── 근거 강조
  function highlight() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    if (PAGE === 'regions') Regions.showFor(id);
    if (PAGE === 'status' && el.classList.contains('inc')) { const b = $('.acc', el); acc(b, true); }
    const tgt = el.tagName === 'TR' ? el : el;
    tgt.classList.add('hl');
    setTimeout(() => tgt.classList.remove('hl'), 2600);
  }
  addEventListener('hashchange', highlight);

  // ── 탭(공통): role=tablist 안의 화살표 이동
  function tablist(list, onSelect) {
    const tabs = $$('[role="tab"]', list);
    const sel = (t, focus) => { tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; }); if (focus) t.focus(); onSelect(t); };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => sel(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); sel(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); sel(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); sel(tabs[tabs.length - 1], true); }
      });
    });
    return { sel };
  }
  function acc(btn, force) {
    const open = force != null ? force : btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
  }
  $$('.acc').forEach((b) => b.addEventListener('click', () => acc(b)));

  // ── 도우미 서랍
  const dockBtn = $('#dock-open'), panel = $('#dock-panel'), chat = $('#chat'), ask = $('#ask'), stepsEl = $('#steps');
  let lastFocus = null;
  function dock(open) {
    if (open === !panel.hidden) return;
    if (open) {
      lastFocus = document.activeElement;
      panel.hidden = false; panel.classList.add('is-in');
      requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.remove('is-in')));
      dockBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.toggle('dock-on', innerWidth <= 560);
      ss.set('dock', true);
      setTimeout(() => ask.focus(), RM ? 0 : 60);
      chat.scrollTop = chat.scrollHeight;
    } else {
      panel.hidden = true; dockBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('dock-on'); ss.set('dock', false);
      (lastFocus && document.contains(lastFocus) ? lastFocus : dockBtn).focus();
    }
  }
  dockBtn.addEventListener('click', () => dock(true));
  $('#dock-close').addEventListener('click', () => dock(false));
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); dock(false); } });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && panel.hidden) { e.preventDefault(); dock(true); }
    if (e.key === 'Escape' && !panel.hidden && !nav.classList.contains('is-open') && (!ddMenu || ddMenu.hidden)) dock(false);
  });
  const dockTabs = tablist($('.dock-tabs'), (t) => { $('#dp-chat').hidden = t.id !== 'dt-chat'; $('#dp-log').hidden = t.id !== 'dt-log'; if (t.id === 'dt-log') LOG.render(); });
  $('#log').addEventListener('click', (e) => { const b = e.target.closest('[data-undo]'); if (b) { LOG.undo(b.dataset.undo); $('#dt-log').focus(); } });

  function renderMsg(m) {
    if (m.q) return `<p class="msg-q">${esc(m.q)}</p>`;
    const r = m.a;
    return `<div class="msg-a">${r.html}${r.refs && r.refs.length ? `<p class="refs">${r.refs.map((x) => `<a href="${x.href}">${esc(x.t)}</a>`).join('')}</p>` : ''}${r.acts && r.acts.length ? `<div class="acts">${r.acts.map(([k, label, data], i) => `<button type="button" class="btn btn-s${i === 0 ? ' btn-dawn' : ''}" data-act="${k}" data-arg="${esc(data || '')}">${esc(label)}</button>`).join('')}</div>` : ''}</div>`;
  }
  function chatRender() {
    const h = ss.get('chat', []);
    chat.innerHTML = h.length ? h.map(renderMsg).join('') : `<div class="msg-a"><p>사양 · 요금 · 지연 · 상태를 이 사이트의 표로 답합니다. 모델 크기와 동시 사용자를 적으면 구성 세 가지와 월 비용을 계산합니다.</p></div>`;
    chat.scrollTop = chat.scrollHeight;
  }
  async function runSteps(list) {
    if (!list) { stepsEl.hidden = true; return; }
    stepsEl.hidden = false;
    stepsEl.innerHTML = list.map((s) => `<li>${esc(s)}</li>`).join('');
    const li = $$('li', stepsEl);
    for (const el of li) {
      el.className = 'run';
      if (!RM) await new Promise((r) => setTimeout(r, 180));
      el.className = 'done';
    }
  }
  async function submit(q) {
    q = String(q || '').trim(); if (!q) return;
    const h = ss.get('chat', []);
    h.push({ q }); ss.set('chat', h); chatRender();
    const r = A.answer(q, { rel: REL, calc: ss.get('calc', CALC0) });
    await runSteps(r && r.steps);
    h.push({ a: r }); ss.set('chat', h.slice(-30)); chatRender();
    say('도우미 답이 왔습니다');
  }
  $('#prompt').addEventListener('submit', (e) => { e.preventDefault(); const v = ask.value; ask.value = ''; submit(v); });
  $('#quick').addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (b) submit(b.dataset.q); });
  chat.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const k = b.dataset.act, arg = b.dataset.arg ? JSON.parse(b.dataset.arg) : {};
    if (k === 'handoff') return handoff();
    if (k === 'need' || k === 'calc') {
      const before = { ...ss.get('calc', CALC0), __need: ss.get('need', null) };
      const after = { ...ss.get('calc', CALC0), ...(arg.calc || {}) };
      ss.set('calc', after); if (arg.need) ss.set('need', arg.need);
      LOG.add(`계산기 ← ${C.G[after.grade].name} × ${after.count} · ${C.R[after.region].name} · ${C.P[after.plan].name}`, 'calc', before, after);
      if (PAGE === 'pricing') { Pricing.load(); location.hash = 'calc'; dock(false); } else location.href = go('pricing', 'calc');
    }
  });

  // 사람에게 넘기기 — 요약을 만들어 상담 요청서에
  function summary() {
    const c = ss.get('calc', null), n = ss.get('need', null), qt = ss.get('quote', null);
    const qs = ss.get('chat', []).filter((m) => m.q).slice(-3).map((m) => '· ' + m.q);
    const L = ['[도우미 요약 · 규칙 기반]'];
    if (n && n.params) L.push(`모델 ${n.params}B · ${n.bits || D.MODEL.defaultBits}비트 · 동시 ${n.users || '?'}명`);
    if (c) { const m = C.monthly(c); L.push(`구성 ${C.G[c.grade].name} × ${c.count} · ${C.R[c.region].name} · ${C.P[c.plan].name} · 한 달 ${won(m.total)}(부가세 별도)`); }
    if (qt && qt.lines) L.push(`견적서 ${qt.ok ? '확정' : '초안'} · 합계 ${won(Pricing.sum(qt.lines) * (1 + D.VAT))}(부가세 포함)`);
    if (qs.length) L.push('물어본 것', ...qs);
    return { text: L.join('\n'), n, c };
  }
  function handoff() {
    const s = summary();
    const before = ss.get('handoff', null);
    ss.set('handoff', s);
    LOG.add('상담 요청서에 요약 채움', 'handoff', before ? before.text : '', s.text);
    if (PAGE === 'contact') { Contact.fill(); dock(false); $('#ct-msg').focus(); } else location.href = go('contact');
  }

  // ── 처음: 콘솔 숫자 · 로그 (모션 1)
  const Home = {
    init() {
      if (RM) return;
      const cells = $$('[data-tps]').filter((x) => Number(x.dataset.tps) > 0);
      const log = $('#console-log');
      const extra = ['health law-search-prod · 정상', 'key sk-…7f2a 사용 · 분당 요청', 'scale qa-vision-batch 1 → 1 · 변경 없음', 'health chat-ko-70b-a · 정상'];
      let k = 0;
      setInterval(() => {
        if (document.hidden) return;
        cells.forEach((c) => {
          const base = Number(c.dataset.tps);
          const v = Math.round(base * (0.92 + Math.random() * 0.16));
          c.textContent = num(v);
          const tr = c.closest('tr'); tr.classList.add('flash'); setTimeout(() => tr.classList.remove('flash'), 600);
        });
        const t = `14:${String(20 + Math.floor((2 + k * 2) / 60)).padStart(2, '0')}:${String((2 + k * 2) % 60).padStart(2, '0')}`;
        const line = extra[k % extra.length] + (k % extra.length === 1 ? ' ' + (200 + (k * 7) % 40) : k % extra.length === 0 ? ` · ${num(Number(cells[0].textContent.replace(/,/g, '')))} tok/s` : '');
        const li = document.createElement('li'); li.textContent = `${t} ${line}`; log.prepend(li);
        while (log.children.length > 6) log.lastElementChild.remove();
        k++;
      }, 2000);
    },
  };

  // ── GPU 서버
  const Gpu = {
    init() {
      const rows = $$('#gpu-rows tr');
      const panelEl = $('#gpu-table');
      tablist($('.tools .tabs'), (t) => {
        const p = t.dataset.plan;
        $$('.price', panelEl).forEach((c) => { c.hidden = c.dataset.plan !== p; });
        panelEl.setAttribute('aria-labelledby', t.id);
      });
      const apply = () => {
        const min = Number($('#f-mem').value), sort = $('#f-sort').value;
        let n = 0;
        rows.forEach((r) => { const on = Number(r.dataset.mem) >= min; r.hidden = !on; if (on) n++; });
        const sorted = rows.slice().sort((a, b) => sort === 'mem' ? a.dataset.mem - b.dataset.mem : b.dataset.hour - a.dataset.hour);
        sorted.forEach((r) => $('#gpu-rows').append(r));
        $('#gpu-count').textContent = `${n}개 등급`;
      };
      $('#f-mem').addEventListener('change', apply); $('#f-sort').addEventListener('change', apply);
      const mc = () => {
        const p = Number($('#mc-p').value) || 0, b = Number($('#mc-b').value);
        if (p <= 0) { $('#mc-out').innerHTML = '<p class="err">매개변수를 1 이상으로 적으세요.</p>'; return; }
        const nm = C.needMem(p, b);
        $('#mc-out').innerHTML = `<p>필요 메모리 <b class="mono">${num(nm, 1)}GB</b></p><table class="tbl"><caption class="vh">등급별 동시 사용자</caption><thead><tr><th scope="col">등급</th><th scope="col" class="num">동시 사용자(대당)</th></tr></thead><tbody>${D.GPUS.map((x) => { const c = C.capacity(x.id, p, b); return `<tr><th scope="row">${x.name}</th><td class="mono num ${c ? '' : 'zero'}">${c ? num(c) + '명' : '안 들어감'}</td></tr>`; }).join('')}</tbody></table>`;
      };
      $('#mc-p').addEventListener('input', mc); $('#mc-b').addEventListener('change', mc);
      $('#memcalc').addEventListener('submit', (e) => e.preventDefault());
      mc();
    },
  };

  // ── 요금
  const Pricing = {
    f: {},
    init() {
      this.f = { grade: $('#c-grade'), count: $('#c-count'), hpd: $('#c-hpd'), days: $('#c-days'), region: $('#c-region') };
      Object.values(this.f).forEach((el) => el.addEventListener('input', () => this.read()));
      $$('input[name="c-plan"]').forEach((r) => r.addEventListener('change', () => this.read()));
      $('#nl-go').addEventListener('click', () => this.nl($('#nl-q').value));
      $('#nl-q').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); this.nl($('#nl-q').value); } });
      $('#nl-chips').addEventListener('click', (e) => { const b = e.target.closest('[data-rm]'); if (b) this.rmChip(b.dataset.rm); });
      $('#opts-g').addEventListener('click', (e) => { const b = e.target.closest('[data-opt]'); if (b) this.pick(Number(b.dataset.opt)); });
      $('#alerts').addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.fix) { const [k, v] = b.dataset.fix.split(':'); this.set({ [k]: v }, `알림 반영 · 요금제 ${C.P[v].name}`); }
        if (b.dataset.close) { const s = ss.get('dismiss', []); s.push(b.dataset.close); ss.set('dismiss', s); this.alerts(); }
      });
      $('#q-fill').addEventListener('click', () => this.quoteFill());
      $('#q-ok').addEventListener('click', () => this.quoteOk());
      $('#q-rows').addEventListener('change', (e) => { const i = e.target.dataset.i; if (i == null) return; const q = ss.get('quote'); const before = JSON.parse(JSON.stringify(q)); q.lines[i].qty = Math.max(0, Number(e.target.value) || 0); q.ok = false; ss.set('quote', q); LOG.add(`견적 줄 수량 · ${q.lines[i].name} ${num(before.lines[i].qty)} → ${num(q.lines[i].qty)}`, 'quote', before, q); this.quoteRender(); });
      $('#paste-go').addEventListener('click', () => this.paste());
      const q = new URLSearchParams(location.search).get('q');
      this.load();
      if (q) { $('#nl-q').value = q; this.nl(q); }
      if (!ss.get('quote', null)) this.quoteFill(true); else this.quoteRender();
    },
    load() {
      const c = ss.get('calc', CALC0);
      this.f.grade.value = c.grade; this.f.count.value = c.count; this.f.hpd.value = c.hpd; this.f.days.value = c.days; this.f.region.value = c.region;
      $$('input[name="c-plan"]').forEach((r) => { r.checked = r.value === c.plan; });
      const n = ss.get('need', null);
      if (n) this.chips(n);
      this.out(c);
    },
    read() {
      const c = { grade: this.f.grade.value, count: Math.max(1, Math.min(64, Number(this.f.count.value) || 1)), hpd: Math.max(1, Math.min(24, Number(this.f.hpd.value) || 1)), days: Math.max(1, Math.min(31, Number(this.f.days.value) || 1)), region: this.f.region.value, plan: $('input[name="c-plan"]:checked').value };
      ss.set('calc', c); this.out(c);
    },
    set(part, what) {
      const before = { ...ss.get('calc', CALC0), __need: ss.get('need', null) };
      const after = { ...ss.get('calc', CALC0), ...part };
      ss.set('calc', after); LOG.add(what, 'calc', before, after); this.load();
    },
    out(c) {
      const m = C.monthly(c);
      $('#calc-kv').innerHTML = [['시간당 단가', `<span class="mono">${won(m.unit)}</span>`], ['대수', `<span class="mono">${c.count}</span>`], ['과금 시간', `<span class="mono">${num(m.hours)}시간</span>${C.P[c.plan].commit ? ' (약정 720시간)' : ` (${Math.min(24, c.hpd)} × ${c.days})`}`]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
      $('#calc-total').textContent = won(m.total);
      $('#calc-vat').textContent = `부가세 포함 ${won(m.total * (1 + D.VAT))} · ${C.R[c.region].name} 리전 배수 ${C.R[c.region].mult}`;
      $$('.plan').forEach((p) => p.classList.toggle('is-on', p.id === 'plan-' + c.plan));
      this.alerts();
    },
    alerts() {
      const c = ss.get('calc', CALC0), n = ss.get('need', null), dis = ss.get('dismiss', []);
      const list = C.alerts(c, n).filter((a) => !dis.includes(a.id + ':' + c.grade + c.region + c.plan + c.count));
      $('#alerts').innerHTML = list.map((a) => `<li class="alert alert-${a.lv}" role="${a.lv === 'bad' ? 'alert' : 'status'}"><span class="dot dot-${a.lv === 'bad' ? 'down' : 'slow'}"></span><div><b>${esc(a.t)}</b><p>${esc(a.fix)} <a href="${REL}${a.ref}">근거</a></p></div><div class="acts">${a.act ? `<button type="button" data-fix="${a.act[0]}:${a.act[1]}">${esc(C.P[a.act[1]].name)}로 바꾸기</button>` : ''}<button type="button" data-close="${a.id}:${c.grade + c.region + c.plan + c.count}" aria-label="알림 닫기: ${esc(a.t)}">닫기</button></div></li>`).join('');
    },
    nl(text) {
      const n = C.parseNeed(text);
      if (!n.params && !n.users && !n.region && !n.hpd) { $('#nl-chips').innerHTML = `<span class="chip chip-miss">못 읽음 · ${esc(n.miss.join(' · '))}</span>`; return; }
      const need = { params: n.params, bits: n.bits || D.MODEL.defaultBits, users: n.users, region: n.region, hpd: n.hpd, days: n.days, miss: n.miss, nobits: !n.bits };
      ss.set('need', need);
      this.chips(need);
      const part = {};
      if (n.region) part.region = n.region;
      if (n.hpd) part.hpd = n.hpd;
      if (n.days) part.days = n.days;
      if (n.plan) part.plan = n.plan;
      const opts = n.params && n.users ? C.options(need) : [];
      if (opts.length) Object.assign(part, { grade: opts[0].grade, count: opts[0].count, region: opts[0].region, plan: opts[0].plan });
      this.set(part, `문장 읽기 · ${text.slice(0, 40)}`);
      this.optsRender(opts);
    },
    chips(n) {
      const out = [];
      if (n.params) out.push(['params', `모델 ${n.params}B`]);
      if (n.params) out.push(['bits', `${n.bits}비트${n.nobits ? ' (기본값)' : ''}`]);
      if (n.users) out.push(['users', `동시 ${num(n.users)}명`]);
      if (n.region) out.push(['region', C.R[n.region].name]);
      if (n.hpd) out.push(['hpd', `하루 ${n.hpd}시간`]);
      if (n.days) out.push(['days', `한 달 ${n.days}일`]);
      $('#nl-chips').innerHTML = out.map(([k, v]) => `<span class="chip">${esc(v)}<button type="button" data-rm="${k}" aria-label="${esc(v)} 빼기">×</button></span>`).join('') + (n.miss || []).map((m) => `<span class="chip chip-miss">빠짐 · ${esc(m)}</span>`).join('');
      if (n.params && n.users) this.optsRender(C.options(n));
    },
    rmChip(k) {
      const n = ss.get('need', {}); const before = { ...ss.get('calc', CALC0), __need: { ...n } };
      delete n[k]; if (k === 'bits') { n.bits = D.MODEL.defaultBits; n.nobits = true; }
      ss.set('need', n); LOG.add(`조건 빼기 · ${k}`, 'calc', before, ss.get('calc', CALC0)); this.chips(n);
      if (!(n.params && n.users)) $('#opts').hidden = true;
      this.alerts();
    },
    optsRender(opts) {
      this.opts = opts;
      $('#opts').hidden = !opts.length;
      const c = ss.get('calc', CALC0);
      $('#opts-g').innerHTML = opts.map((o, i) => `<div class="opt${o.grade === c.grade && o.count === c.count && o.region === c.region ? ' is-pick' : ''}"><span class="eyebrow">${esc(o.label)}</span><p class="mono big">${won(o.total)}</p><b>${C.G[o.grade].name} × ${o.count} · ${C.R[o.region].name}${o.split ? ' + ' + C.R[o.region2].name : ''}</b><span class="sub">${esc(C.P[o.plan].name)} · 대당 동시 ${num(o.cap)}명</span><p>${esc(o.why)}</p><button type="button" class="btn btn-s" data-opt="${i}">이 안으로</button></div>`).join('');
    },
    pick(i) {
      const o = this.opts[i]; if (!o) return;
      this.set({ grade: o.grade, count: o.count, region: o.region, plan: o.plan }, `세 가지 안 · ${o.label} 고름`);
      this.optsRender(this.opts); say(`${o.label} 안을 계산기에 넣었습니다`);
    },
    sum(lines) { return lines.reduce((s, l) => s + l.price * l.qty, 0); },
    quoteFill(silent) {
      const c = ss.get('calc', CALC0), m = C.monthly(c), before = ss.get('quote', null);
      const ex = Object.fromEntries(D.EXTRA.map((e) => [e.id, e]));
      const q = { ok: false, lines: [
        { name: `GPU ${C.G[c.grade].name} · ${C.R[c.region].name} · ${C.P[c.plan].name}`, unit: '시간 · 대', price: m.unit, qty: m.hours * c.count },
        { name: ex.store.name, unit: ex.store.unit, price: ex.store.price, qty: 200 - ex.store.free },
        { name: ex.egress.name, unit: ex.egress.unit, price: ex.egress.price, qty: 0 },
        { name: ex.ip.name, unit: ex.ip.unit, price: ex.ip.price, qty: 1 },
      ] };
      ss.set('quote', q); if (!silent) LOG.add('견적서 초안을 계산기 값으로 채움', 'quote', before, q);
      this.quoteRender();
    },
    quoteOk() { const q = ss.get('quote'); const before = JSON.parse(JSON.stringify(q)); q.ok = true; ss.set('quote', q); LOG.add('견적서 확정', 'quote', before, q); this.quoteRender(); say('견적서를 확정했습니다. 전송되지 않습니다.'); },
    quoteRender() {
      const q = ss.get('quote', null); if (!q) return;
      $('#q-rows').innerHTML = q.lines.map((l, i) => `<tr><th scope="row">${esc(l.name)}</th><td>${esc(l.unit)}</td><td class="mono num">${won(l.price)}</td><td class="num"><label class="vh" for="q-${i}">${esc(l.name)} 수량</label><input id="q-${i}" type="number" min="0" value="${l.qty}" data-i="${i}" inputmode="numeric"></td><td class="mono num">${won(l.price * l.qty)}</td></tr>`).join('');
      $('#q-sum').textContent = won(this.sum(q.lines) * (1 + D.VAT));
      const b = $('#q-badge'); b.textContent = q.ok ? '확정 · 전송 안 함' : '초안'; b.classList.toggle('is-ok', q.ok);
    },
    paste() {
      const rows = C.parseBill($('#paste-in').value);
      const ok = rows.filter((r) => r.ok), bad = rows.filter((r) => !r.ok);
      const theirs = ok.reduce((s, r) => s + r.money, 0), ours = ok.reduce((s, r) => s + r.ours, 0);
      $('#paste-out').innerHTML = `<table class="tbl paste-t"><caption>읽은 줄 ${ok.length} · 못 읽은 줄 ${bad.length}</caption><thead><tr><th scope="col">줄</th><th scope="col">읽은 값</th><th scope="col" class="num">지금</th><th scope="col" class="num">새벽노드</th></tr></thead><tbody>${rows.map((r) => r.ok ? `<tr><th scope="row" class="mono">${esc(r.line)}</th><td>${r.kind === 'gpu' ? `${r.mem}GB × ${r.count} · ${num(r.hours)}시간 → ${C.G[r.grade].name}` : `저장소 ${num(r.gb)}GB`}</td><td class="mono num">${won(r.money)}</td><td class="mono num">${won(r.ours)}</td></tr>` : `<tr class="bad"><th scope="row" class="mono">${esc(r.line)}</th><td colspan="3">못 읽음 · ${esc(r.why)}</td></tr>`).join('')}</tbody><tfoot><tr><th scope="row" colspan="2">읽은 줄 합계</th><td class="mono num">${won(theirs)}</td><td class="mono num">${won(ours)}</td></tr></tfoot></table><p class="${ours < theirs ? 'save' : 'a-warn'}">${ours < theirs ? `한 달 ${won(theirs - ours)} 적음` : `한 달 ${won(ours - theirs)} 많음`} · 쓰는 만큼 · 서울 기준. 못 읽은 줄은 빼고 견줬습니다.</p>`;
      LOG.add(`청구서 ${rows.length}줄 읽음(못 읽은 줄 ${bad.length})`, 'note', null, null);
    },
  };

  // ── 리전
  const Regions = {
    t: null,
    init() { this.t = tablist($('.tabs[aria-label="리전"]'), (t) => { $$('.rg').forEach((p) => { p.hidden = p.id !== t.getAttribute('aria-controls'); }); }); },
    showFor(id) {
      const m = id.match(/^(?:r|lat)-(seoul|busan|chuncheon)/); if (!m || !this.t) return;
      this.t.sel(document.getElementById('rt-' + m[1]));
    },
  };

  // ── 상태
  const Status = {
    init() {
      const tip = $('#bar-tip');
      const show = (b) => { tip.textContent = b.getAttribute('aria-label'); };
      $$('.bar').forEach((b) => {
        b.addEventListener('mouseenter', () => show(b)); b.addEventListener('focus', () => show(b));
        const go2 = () => { if (b.dataset.inc) location.hash = b.dataset.inc; };
        b.addEventListener('click', go2); b.addEventListener('keydown', (e) => { if (e.key === 'Enter') go2(); });
      });
    },
  };

  // ── 문서
  const Docs = {
    init() {
      $$('.code .tabs').forEach((tl) => tablist(tl, (t) => { $$('pre', tl.closest('.code')).forEach((p) => { p.hidden = p.id !== t.getAttribute('aria-controls'); }); }));
      $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
        const pre = $$('pre', b.closest('.code')).find((p) => !p.hidden);
        try { await navigator.clipboard.writeText(pre.textContent); } catch (e) { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
        b.classList.add('done'); $('span', b).textContent = '복사됨'; say('코드를 복사했습니다');
        setTimeout(() => { b.classList.remove('done'); $('span', b).textContent = '복사'; }, 1600);
      }));
      const links = $$('[data-spy]');
      const secs = links.map((a) => document.getElementById(a.dataset.spy)).filter(Boolean);
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => { const on = a.dataset.spy === e.target.id; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); });
      }, { rootMargin: '-90px 0px -65% 0px' });
      secs.forEach((s) => io.observe(s));
    },
  };

  // ── 변경 기록
  const Changelog = {
    init() {
      const bs = $$('.filters button'), items = $$('.cl li');
      bs.forEach((b) => b.addEventListener('click', () => {
        bs.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        let n = 0; items.forEach((li) => { const on = b.dataset.kind === 'all' || li.dataset.kind === b.dataset.kind; li.hidden = !on; if (on) n++; });
        $('#cl-count').textContent = `${n}건`;
      }));
    },
  };

  // ── 상담
  const Contact = {
    init() {
      const f = $('#contact-form');
      this.fill();
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        const errs = [];
        const need = (id, msg, ok) => { const el = $('#' + id); const bad = !ok(el); const er = $('#' + id + '-err'); er.hidden = !bad; er.textContent = bad ? msg : ''; el.setAttribute('aria-invalid', String(bad)); if (bad) errs.push(el); };
        need('ct-co', '회사 이름을 적으세요.', (el) => el.value.trim().length > 0);
        need('ct-name', '담당자 이름을 적으세요.', (el) => el.value.trim().length > 0);
        need('ct-mail', '메일 형식이 아닙니다. 예: name@company.co.kr', (el) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()));
        need('ct-model', '모델 크기는 1 이상의 숫자입니다.', (el) => !el.value || Number(el.value) >= 1);
        need('ct-users', '동시 사용자는 1 이상의 숫자입니다.', (el) => !el.value || Number(el.value) >= 1);
        need('ct-msg', '내용을 10자 이상 적으세요.', (el) => el.value.trim().length >= 10);
        need('ct-agree', '수집에 동의해야 요청서를 확인할 수 있습니다.', (el) => el.checked);
        const out = $('#ct-msg-out');
        out.hidden = false;
        if (errs.length) { out.className = 'form-msg'; out.textContent = `고칠 곳 ${errs.length}개`; errs[0].focus(); return; }
        out.className = 'form-msg ok'; out.textContent = '요청서 확인 끝 · 이 화면은 전송하지 않습니다. 실제로는 영업일 하루 안에 메일로 답합니다.';
      });
    },
    fill() {
      const h = ss.get('handoff', null); if (!h) return;
      const m = $('#ct-msg'); if (m && !m.value.includes('[도우미 요약')) m.value = h.text + (m.value ? '\n\n' + m.value : '');
      if (h.n && h.n.params && !$('#ct-model').value) $('#ct-model').value = h.n.params;
      if (h.n && h.n.users && !$('#ct-users').value) $('#ct-users').value = h.n.users;
      const rg = (h.n && h.n.region) || (h.c && h.c.region);
      if (rg && !$('#ct-region').value) $('#ct-region').value = rg;
    },
  };

  // ── 시작
  LOG.render(); chatRender();
  if (ss.get('dock', false)) { panel.hidden = false; dockBtn.setAttribute('aria-expanded', 'true'); }
  ({ home: Home, gpu: Gpu, pricing: Pricing, regions: Regions, status: Status, docs: Docs, changelog: Changelog, contact: Contact }[PAGE] || { init() {} }).init();
  highlight();
  void dockTabs;
  window.SBUI = { Pricing };
})();
