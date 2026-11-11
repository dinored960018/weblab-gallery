// 소릿골 스튜디오 — 화면 동작. 저장은 sessionStorage 까지, 전송 없음
(function () {
  'use strict';
  const D = window.SG, C = window.SGC, A = window.SGA;
  const { esc, num, won, md, hh } = C;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REL = document.body.dataset.rel || '';
  const PAGE = document.body.dataset.page;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ss = {
    get(k, d) { try { const v = sessionStorage.getItem('sg.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem('sg.' + k, JSON.stringify(v)); } catch (e) { /* 저장 불가 */ } },
  };
  const go = (page, hash) => `${REL}${page ? page + '/' : ''}index.html${hash ? '#' + hash : ''}`;
  // 기본 초안: 합주실 1 · 오늘(빈 2시간이 없으면 내일)의 가장 이른 빈 시간
  const d0 = C.freeStarts('e1', C.today, 2).length ? C.today : C.addDays(C.today, 1);
  const s0 = C.freeStarts('e1', d0, 2);
  const BOOK0 = { room: 'e1', date: d0, start: s0.length ? s0[0] : 19, hours: 2, people: 4, engineer: false, regular: false, ok: false };
  const getBook = () => ({ ...BOOK0, ...ss.get('book', {}) });
  const tm = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  let liveEl;
  function say(t) { if (!liveEl) { liveEl = document.createElement('p'); liveEl.className = 'vh'; liveEl.setAttribute('aria-live', 'polite'); document.body.append(liveEl); } liveEl.textContent = ''; setTimeout(() => { liveEl.textContent = t; }, 30); }
  const bookLine = (b) => `${C.R[b.room].name} · ${md(b.date)} ${hh(b.start)}부터 ${b.hours}시간`;

  // ── 작업 기록 · 되돌리기
  const LOG = {
    all() { return ss.get('log', []); },
    add(what, kind, before, after) { const l = LOG.all(); l.unshift({ id: Date.now() + '' + l.length, t: tm(), what, kind, before, after, undone: false }); ss.set('log', l.slice(0, 40)); LOG.render(); },
    undo(id) {
      const l = LOG.all(); const e = l.find((x) => x.id === id);
      if (!e || e.undone) return;
      e.undone = true; ss.set('log', l);
      if (e.kind === 'book') { ss.set('book', e.before); if (PAGE === 'booking') Booking.load(); }
      if (e.kind === 'handoff') { ss.set('handoff', null); if (PAGE === 'contact') { const m = $('#ct-msg'); if (m) m.value = e.before || ''; } }
      LOG.render(); say(`되돌림 · ${e.what}`);
    },
    render() {
      const l = LOG.all(); const ol = $('#log'); const cnt = $('#log-cnt');
      if (cnt) cnt.textContent = l.filter((x) => !x.undone).length;
      if (!ol) return;
      ol.innerHTML = l.length ? l.map((e) => `<li class="${e.undone ? 'undone' : ''}"><span class="n">${e.t}</span><span>${esc(e.what)}</span>${e.undone || e.kind === 'note' ? `<span>${e.undone ? '되돌림' : ''}</span>` : `<button type="button" data-undo="${e.id}">되돌리기</button>`}</li>`).join('') : '<li><span></span><span class="sub">아직 바꾼 값이 없습니다.</span><span></span></li>';
    },
  };
  function setBook(part, what) {
    const before = getBook(); const after = { ...before, ...part, ok: false };
    ss.set('book', after); LOG.add(what, 'book', before, after);
    if (PAGE === 'booking') Booking.load();
    return after;
  }

  // ── 머리: 100px 뒤 띠, 내릴 때 숨음 [Tengile]
  const hd = $('#hd'); let lastY = scrollY;
  function onScroll() {
    const y = scrollY;
    hd.classList.toggle('is-band', y > 100);
    hd.classList.toggle('is-hide', y > 100 && y > lastY + 2 && !document.body.classList.contains('lock') && panel.hidden);
    if (y < lastY - 2) hd.classList.remove('is-hide');
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });

  // ── 패널 공통: hidden + is-in 으로 열고 닫는다
  function slide(el, open) {
    if (open) { el.hidden = false; el.classList.add('is-in'); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('is-in'))); }
    else if (RM) el.hidden = true;
    else { el.classList.add('is-in'); setTimeout(() => { if (el.classList.contains('is-in')) { el.hidden = true; el.classList.remove('is-in'); } }, 1000); }
  }
  const focusables = (el) => $$('a[href], button:not([disabled]), input, select, textarea', el).filter((x) => x.offsetParent !== null);

  // 메뉴 [Tengile 오른쪽 패널]
  const menu = $('#menu'), menuBtn = $('#menu-open'), veil = $('#menu-veil');
  function menuOpen(open) {
    if (open === !menu.hidden && !menu.classList.contains('is-in')) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    veil.hidden = !open; document.body.classList.toggle('lock', open);
    slide(menu, open);
    if (open) setTimeout(() => $('#menu-close').focus(), 30); else menuBtn.focus();
  }
  menuBtn.addEventListener('click', () => menuOpen(true));
  $('#menu-close').addEventListener('click', () => menuOpen(false));
  veil.addEventListener('click', () => menuOpen(false));
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); menuOpen(false); }
    if (e.key === 'Tab') { const f = focusables(menu); if (!f.length) return; if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } }
  });

  // 탭 공통
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
    return { sel, tabs };
  }

  // ── 도우미 패널 [BOC Studio 위에서 내려오는 패널]
  const panel = $('#ai-panel'), aiBtn = $('#ai-open'), chat = $('#chat'), ask = $('#ask'), stepsEl = $('#steps');
  let lastFocus = null;
  function ai(open) {
    const isOpen = !panel.hidden && !panel.classList.contains('is-in');
    if (open === isOpen) return;
    aiBtn.setAttribute('aria-expanded', String(open));
    ss.set('ai', open);
    if (open) { lastFocus = document.activeElement; hd.classList.remove('is-hide'); slide(panel, true); setTimeout(() => ask.focus(), RM ? 0 : 80); chat.scrollTop = chat.scrollHeight; }
    else { slide(panel, false); (lastFocus && document.contains(lastFocus) && lastFocus.offsetParent !== null ? lastFocus : aiBtn).focus(); }
  }
  aiBtn.addEventListener('click', () => ai(panel.hidden || panel.classList.contains('is-in')));
  $('#ai-close').addEventListener('click', () => ai(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden && menu.hidden) ai(false);
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && panel.hidden) { e.preventDefault(); ai(true); }
  });
  tablist($('.ai-tabs'), (t) => { $('#ap-chat').hidden = t.id !== 'at-chat'; $('#ap-log').hidden = t.id !== 'at-log'; if (t.id === 'at-log') LOG.render(); });
  $('#log').addEventListener('click', (e) => { const b = e.target.closest('[data-undo]'); if (b) { LOG.undo(b.dataset.undo); $('#at-log').focus(); } });

  function renderMsg(m) {
    if (m.q) return `<p class="msg-q">${esc(m.q)}</p>`;
    const r = m.a;
    return `<div class="msg-a">${r.html}${r.refs && r.refs.length ? `<p class="refs">${r.refs.map((x) => `<a href="${x.href}">${esc(x.t)}</a>`).join('')}</p>` : ''}${r.acts && r.acts.length ? `<div class="acts">${r.acts.map(([k, label, data]) => `<button type="button" class="btn btn-w" data-act="${k}" data-arg="${esc(data || '')}">${esc(label)}</button>`).join('')}</div>` : ''}</div>`;
  }
  function chatRender() {
    const h = ss.get('chat', []);
    chat.innerHTML = h.length ? h.map(renderMsg).join('') : '<div class="msg-a"><p>방 · 요금 · 빈 시간 · 규칙을 이 사이트의 표로 답합니다. 날짜 · 시각 · 인원 · 시간을 적으면 맞는 방 세 가지 안을 냅니다.</p></div>';
    chat.scrollTop = chat.scrollHeight;
  }
  async function runSteps(list) {
    if (!list) { stepsEl.hidden = true; return; }
    stepsEl.hidden = false; stepsEl.innerHTML = list.map((s) => `<li>${esc(s)}</li>`).join('');
    for (const el of $$('li', stepsEl)) { el.className = 'run'; if (!RM) await new Promise((r) => setTimeout(r, 180)); el.className = 'done'; }
  }
  async function submit(q) {
    q = String(q || '').trim(); if (!q) return;
    const h = ss.get('chat', []); h.push({ q }); ss.set('chat', h); chatRender();
    const r = A.answer(q, { rel: REL });
    await runSteps(r && r.steps);
    h.push({ a: r }); ss.set('chat', h.slice(-30)); chatRender(); say('도우미 답이 왔습니다');
  }
  $('#ask-form').addEventListener('submit', (e) => { e.preventDefault(); const v = ask.value; ask.value = ''; submit(v); });
  $('#quick').addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (b) submit(b.dataset.q); });
  chat.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const arg = b.dataset.arg ? JSON.parse(b.dataset.arg) : {};
    if (b.dataset.act === 'handoff') return handoff();
    if (b.dataset.act === 'book') {
      const { need, ...part } = arg;
      if (need) ss.set('need', need);
      const a2 = setBook(part, `예약 초안 ← ${bookLine({ ...getBook(), ...part })}`);
      if (PAGE === 'booking') { ai(false); location.hash = 'draft'; $('#d-room').focus(); } else location.href = go('booking', 'draft');
      void a2;
    }
  });

  // 사람에게 넘기기
  function summary() {
    const b = ss.get('book', null);
    const qs = ss.get('chat', []).filter((m) => m.q).slice(-3).map((m) => '· ' + m.q);
    const L = ['[도우미 요약 · 규칙 기반]'];
    if (b) { const bb = { ...BOOK0, ...b }; const p = C.price(bb); L.push(`예약 초안(${bb.ok ? '확정' : '초안'}): ${bookLine(bb)} · ${bb.people}명${bb.engineer && C.R[bb.room].kind === 'rec' ? ' · 엔지니어' : ''}${bb.regular ? ' · 정기' : ''} · ${won(p.total)}`); }
    if (qs.length) L.push('물어본 것', ...qs);
    return { text: L.join('\n'), kind: b && C.R[{ ...BOOK0, ...b }.room].kind };
  }
  function handoff() {
    const s = summary(); const before = ss.get('handoff', null);
    ss.set('handoff', s); LOG.add('상담 요청서에 요약 채움', 'handoff', before ? before.text : '', s.text);
    if (PAGE === 'contact') { Contact.fill(); ai(false); $('#ct-msg').focus(); } else location.href = go('contact', 'form');
  }

  // ── 근거 강조
  function highlight() {
    const id = decodeURIComponent(location.hash.slice(1)); if (!id) return;
    const el = document.getElementById(id); if (!el || el.tagName === 'SECTION' || el.tagName === 'FORM') return;
    el.classList.add('hl'); setTimeout(() => el.classList.remove('hl'), 2600);
  }
  addEventListener('hashchange', highlight);
  function acc(btn, force) { const open = force != null ? force : btn.getAttribute('aria-expanded') !== 'true'; btn.setAttribute('aria-expanded', String(open)); document.getElementById(btn.getAttribute('aria-controls')).hidden = !open; }
  $$('.acc').forEach((b) => b.addEventListener('click', () => acc(b)));

  // ── 처음: 사진 넘김 (모션 1) [Brandon Yasin clip-path 1300ms]
  const Home = {
    init() {
      const imgs = $$('.hero-img'); const caps = JSON.parse($('#hero-data').textContent); let i = 0;
      const show = (n) => {
        const prev = imgs[i]; i = (n + imgs.length) % imgs.length;
        imgs.forEach((im) => im.classList.remove('is-prev'));
        prev.classList.remove('is-on'); prev.classList.add('is-prev');
        imgs[i].classList.add('is-on');
        $('#hero-no').textContent = i + 1; $('#hero-cap').textContent = caps[i];
      };
      $('#hero-next').addEventListener('click', () => show(i + 1));
      $('#hero-prev').addEventListener('click', () => show(i - 1));
    },
  };

  // ── 방: 종류 필터
  const Rooms = {
    init() {
      const bs = $$('.tabs button'), items = $$('#rooms .card');
      bs.forEach((b) => b.addEventListener('click', () => {
        bs.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        let n = 0; items.forEach((li) => { const on = b.dataset.kind === 'all' || li.dataset.kind === b.dataset.kind; li.hidden = !on; if (on) n++; });
        $('#rooms-count').textContent = `방 ${n}개`;
      }));
    },
  };

  // ── 요금: 일반/피크 토글 [Heron AI 라디오 그룹]
  const Pricing = {
    init() {
      const rs = $$('.seg [role="radio"]');
      const set = (r, focus) => {
        rs.forEach((x) => { const on = x === r; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
        if (focus) r.focus();
        const band = r.dataset.band;
        $$('.pc-n .n[data-off]').forEach((n) => { n.textContent = num(n.dataset[band]); });
        $$('.pcs').forEach((p) => p.classList.toggle('is-peak', band === 'peak'));
        $('#band-note').textContent = band === 'off' ? `일반 시간: 평일 ${hh(D.HOURS.open)}~${hh(D.PEAK.weekdayFrom)}` : `피크 시간: 평일 ${hh(D.PEAK.weekdayFrom)}~${hh(D.HOURS.close)} · 토요일 · 일요일 전 시간`;
      };
      rs.forEach((r, i) => {
        r.addEventListener('click', () => set(r));
        r.addEventListener('keydown', (e) => { if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); set(rs[(i + 1) % rs.length], true); } });
      });
    },
  };

  // ── 예약 [OFFFForum 날짜 탭 + 시간표 행]
  const Booking = {
    day: C.today, tabs: null, opts: [],
    init() {
      this.tabs = tablist($('.days'), (t) => { this.day = t.dataset.date; $('#grid').setAttribute('aria-labelledby', t.id); this.grid(); });
      $('#grid').addEventListener('click', (e) => {
        const s = e.target.closest('.sl'); if (!s || s.dataset.s !== 'free') return;
        const room = s.closest('.g-row').dataset.room, h = Number(s.dataset.h), b = getBook();
        const hours = Math.min(b.hours, D.HOURS.close - h);
        setBook({ room, date: this.day, start: h, hours }, `시간 고름 · ${bookLine({ room, date: this.day, start: h, hours })}`);
      });
      const f = { room: $('#d-room'), date: $('#d-date'), start: $('#d-start'), hours: $('#d-hours'), people: $('#d-people'), eng: $('#d-eng'), reg: $('#d-reg') };
      this.f = f;
      const read = () => {
        const part = { room: f.room.value, date: f.date.value, start: Number(f.start.value), hours: Math.max(1, Math.min(13, Number(f.hours.value) || 1)), people: Math.max(1, Number(f.people.value) || 1), engineer: f.eng.checked, regular: f.reg.checked, ok: false };
        ss.set('book', { ...getBook(), ...part }); this.load(true);
      };
      Object.values(f).forEach((el) => el.addEventListener('change', read));
      $('#nl-go').addEventListener('click', () => this.nl($('#nl-q').value));
      $('#nl-q').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); this.nl($('#nl-q').value); } });
      $('#opts-g').addEventListener('click', (e) => { const b = e.target.closest('[data-opt]'); if (b) this.pick(Number(b.dataset.opt)); });
      $('#alerts').addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.fix) { const [k, v, label] = JSON.parse(b.dataset.fix); const part = k === 'room' ? { room: v } : k === 'engineer' ? { engineer: true } : { [k]: Number(v) }; setBook(part, `알림 반영 · ${label}`); }
        if (b.dataset.close) { const s = ss.get('dismiss', []); s.push(b.dataset.close); ss.set('dismiss', s); this.alerts(); }
      });
      $('#d-ok').addEventListener('click', () => {
        const b = getBook();
        if (C.alerts(b).some((a) => a.lv === 'bad')) { say('고쳐야 할 알림이 있어 확정할 수 없습니다'); $('#alerts').scrollIntoView({ block: 'center' }); return; }
        const before = b; const after = { ...b, ok: true }; ss.set('book', after); LOG.add(`예약 초안 확정 · ${bookLine(after)}`, 'book', before, after); this.load(true); say('예약 초안을 확정했습니다. 전송되지 않습니다.');
      });
      $('#d-hand').addEventListener('click', (e) => { e.preventDefault(); handoff(); });
      $('#paste-go').addEventListener('click', () => this.paste());
      const q = new URLSearchParams(location.search);
      if (q.get('room') && C.R[q.get('room')]) { const part = { room: q.get('room') }; if (q.get('start')) part.start = Number(q.get('start')); ss.set('book', { ...getBook(), ...part, ok: false }); }
      this.load();
      if (q.get('q')) { $('#nl-q').value = q.get('q'); this.nl(q.get('q')); }
    },
    load(keepDay) {
      const b = getBook(), f = this.f;
      f.room.value = b.room; f.date.value = b.date; f.start.value = b.start; f.hours.value = b.hours; f.people.value = b.people; f.eng.checked = b.engineer; f.reg.checked = b.regular;
      f.eng.disabled = C.R[b.room].kind !== 'rec';
      if (!keepDay || this.day !== b.date) { this.day = b.date; const t = document.getElementById('day-' + b.date); if (t) { this.tabs.tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; }); $('#grid').setAttribute('aria-labelledby', t.id); t.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } }
      this.grid(); this.sum(); this.alerts();
      const n = ss.get('need', null); if (n && n.kind) this.optsRender(C.options({ ...n, date: n.date || b.date }));
    },
    grid() {
      const b = getBook(), day = this.day;
      const bl = D.BLOCKS.filter((x) => x.date === day);
      $('#day-note').textContent = `${md(day)}${bl.length ? ' · ' + bl.map((x) => `${hh(x.from)}~${hh(x.to)} ${x.why}`).join(' · ') : ''}`;
      $$('.g-row').forEach((row) => {
        const room = row.dataset.room;
        $$('.sl', row).forEach((s) => {
          const h = Number(s.dataset.h), st = C.slot(room, day, h), peak = C.isPeak(day, h);
          const sel = b.room === room && b.date === day && h >= b.start && h < b.start + b.hours;
          s.dataset.s = st; s.classList.toggle('is-peak', peak); s.classList.toggle('is-sel', sel);
          s.disabled = st !== 'free';
          s.setAttribute('aria-pressed', String(sel));
          const word = { free: '빈 시간', taken: '예약됨', past: '지남', block: '점검' }[st];
          s.setAttribute('aria-label', `${C.R[room].name} ${hh(h)} ${word}${st === 'free' ? ' · ' + won(C.rate(room, day, h)) + (peak ? ' 피크' : '') : ''}${sel ? ' · 고름' : ''}`);
          s.textContent = st === 'free' ? h : st === 'taken' ? '–' : '';
        });
        // 좁은 화면에서는 칸이 가로로 넘친다 — 첫 빈 시간(또는 고른 시간)이 보이게 옮긴다
        const box = $('.g-slots', row); const first = $('.sl.is-sel', row) || $('.sl[data-s="free"]', row);
        if (first && box.scrollWidth > box.clientWidth) box.scrollLeft = Math.max(0, first.offsetLeft - box.offsetLeft - 8);
      });
    },
    sum() {
      const b = getBook(), p = C.price(b), rf = C.refund(b.date);
      $('#d-lines tbody').innerHTML = p.lines.map((l) => `<tr><th scope="row">${esc(l.name)}<span class="sub"> · ${esc(l.note)}</span></th><td class="r n">${l.amount < 0 ? '−' : ''}${won(Math.abs(l.amount))}</td></tr>`).join('');
      $('#d-total').textContent = won(p.total);
      $('#d-refund').textContent = `${md(b.date)} ${hh(b.start)}~${hh(b.start + b.hours)} · ${b.people}명 · 지금 취소하면 ${rf.ratio === 1 ? '전액 환불' : rf.ratio ? '50% 환불' : '환불 없음'} · 부가세 포함`;
      const bd = $('#d-badge'); bd.textContent = b.ok ? '확정 · 전송 안 함' : '초안'; bd.classList.toggle('is-ok', !!b.ok);
    },
    alerts() {
      const b = getBook(), dis = ss.get('dismiss', []), key = (a) => `${a.id}:${b.room}${b.date}${b.start}${b.hours}${b.people}`;
      const list = C.alerts(b).filter((a) => !dis.includes(key(a)));
      const html = list.map((a) => `<li class="alert alert-${a.lv}" role="${a.lv === 'bad' ? 'alert' : 'status'}"><div><b>${esc(a.t)}</b><p>${esc(a.fix)} <a href="${REL}${a.ref}">근거</a></p></div><div class="acts">${a.act ? `<button type="button" data-fix='${esc(JSON.stringify(a.act))}'>${esc(a.act[2])}</button>` : ''}${a.lv === 'warn' ? `<button type="button" data-close="${key(a)}" aria-label="알림 닫기: ${esc(a.t)}">닫기</button>` : ''}</div></li>`).join('');
      // 같은 내용이면 다시 그리지 않는다 — 입력 칸에서 바로 알림 단추를 누를 때 단추가 바뀌어 클릭이 사라지는 것을 막는다
      if (html !== this.alertsHtml) { this.alertsHtml = html; $('#alerts').innerHTML = html; }
    },
    nl(text) {
      const n = C.parseNeed(text);
      const chips = n.chips.map(([k, v]) => `<span class="chip">${esc(v)}</span>`).join('') + n.miss.map((m) => `<span class="chip chip-miss">빠짐 · ${esc(m)}</span>`).join('');
      $('#nl-chips').innerHTML = chips || '<span class="chip chip-miss">못 읽음</span>';
      if (!n.date && !n.kind && n.start == null && !n.hours && !n.people) return;
      const need = { kind: n.kind, room: n.room, people: n.people, date: n.date, start: n.start, hours: n.hours, engineer: n.engineer, regular: n.regular };
      ss.set('need', need);
      const b = getBook(); const part = {};
      if (n.hours) part.hours = n.hours; if (n.people) part.people = n.people; if (n.engineer != null) part.engineer = n.engineer; if (n.regular) part.regular = true;
      const opts = n.kind ? C.options({ ...need, date: n.date || b.date }) : [];
      if (opts.length) Object.assign(part, { room: opts[0].room, date: opts[0].date, start: opts[0].start, hours: opts[0].hours });
      else { if (n.date) part.date = n.date; if (n.start != null) part.start = n.start; if (n.room) part.room = n.room; }
      setBook(part, `문장 읽기 · ${text.slice(0, 36)}`);
      this.optsRender(opts);
    },
    optsRender(opts) {
      this.opts = opts; $('#opts').hidden = !opts.length; const b = getBook();
      $('#opts-g').innerHTML = opts.map((o, i) => `<div class="opt${o.room === b.room && o.date === b.date && o.start === b.start ? ' is-pick' : ''}"><span class="lab">${esc(o.label)}</span><b>${esc(C.R[o.room].name)}</b><span>${md(o.date)} ${hh(o.start)}~${hh(o.start + o.hours)}</span><span class="big n">${won(o.total)}</span><p>${esc(o.why)}</p><button type="button" class="btn btn-l" data-opt="${i}">이 안으로</button></div>`).join('');
    },
    pick(i) { const o = this.opts[i]; if (!o) return; setBook({ room: o.room, date: o.date, start: o.start, hours: o.hours }, `세 가지 안 · ${o.label} 고름`); say(`${o.label} 안을 예약 초안에 넣었습니다`); },
    paste() {
      const rows = C.parseGear($('#paste-in').value), ok = rows.filter((r) => r.ok), bad = rows.filter((r) => !r.ok);
      const m = C.gearMatch(rows);
      const name = (k) => D.GEAR[k][0];
      $('#paste-out').innerHTML = `<div class="chips">${ok.map((r) => `<span class="chip">${esc(name(r.key))} ${r.qty}</span>`).join('')}${bad.map((r) => `<span class="chip chip-miss">못 읽음 · ${esc(r.line)}</span>`).join('')}</div>
<div class="tw"><table class="tbl paste-t"><caption class="vh">방별 장비 대조</caption><thead><tr><th scope="col">방</th><th scope="col">결과</th><th scope="col">모자란 것</th></tr></thead><tbody>${m.map((x) => `<tr class="${x.lack.length ? 'bad' : ''}"><th scope="row">${esc(C.R[x.room].name)}</th><td>${x.lack.length ? `${x.lack.length}가지 모자람` : '<span class="ok">다 있음</span>'}</td><td>${x.lack.map((l) => `${esc(name(l.k))} ${l.have}/${l.need}`).join(' · ') || '없음'}</td></tr>`).join('')}</tbody></table></div>
<p class="sub">읽은 줄 ${ok.length} · 못 읽은 줄 ${bad.length}. 못 읽은 품목은 가져오거나 문의로 확인하세요.</p>`;
      const best = m.find((x) => !x.lack.length);
      LOG.add(`장비 목록 ${rows.length}줄 읽음 · ${best ? C.R[best.room].name + ' 다 있음' : '다 있는 방 없음'}`, 'note', null, null);
    },
  };

  // ── 녹음 견적
  const Recording = {
    init() {
      const calc = () => {
        const kind = $('input[name="e-kind"]:checked').value, songs = Math.max(1, Math.min(12, Number($('#e-songs').value) || 1));
        const hours = C.recHours(kind, songs), room = kind === 'band' ? 'r1' : 'r2', rm = C.R[room], per = D.REC[kind];
        const roomFee = rm.off * hours, off = hours >= D.RULES.longHours ? Math.round(roomFee * D.RULES.longOff) : 0, eng = D.RULES.engineer * hours;
        const ex = Object.fromEntries(D.EXTRAS.map((e) => [e.id, e]));
        const rows = [[`${rm.name} ${hours}시간`, roomFee], ...(off ? [[`${D.RULES.longHours}시간 이상 10%`, -off]] : []), [`엔지니어 ${hours}시간`, eng]];
        if ($('#e-mix').checked) rows.push([`믹싱 ${songs}곡`, ex.mix.price * songs]);
        if ($('#e-master').checked) rows.push([`마스터링 ${songs}곡`, ex.master.price * songs]);
        const total = rows.reduce((s, r) => s + r[1], 0);
        $('#est-out').innerHTML = `<p class="lead">녹음 <span class="n">${hours}</span>시간 <span class="sub">준비 ${per.setup} + 곡당 ${per.perSong} × ${songs}곡</span></p><div class="tw"><table class="tbl"><caption class="vh">녹음 견적</caption><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td class="r n">${v < 0 ? '−' : ''}${won(Math.abs(v))}</td></tr>`).join('')}</tbody><tfoot><tr><th scope="row">합계</th><td class="r"><b class="n big">${won(total)}</b></td></tr></tfoot></table></div><div class="row"><a class="btn" href="${go('booking')}?room=${room}">${rm.name} 빈 시간</a></div>`;
      };
      $('#est').addEventListener('input', calc); $('#est').addEventListener('submit', (e) => e.preventDefault()); calc();
    },
  };

  // ── 이용 안내: 따라오는 목차 [OFFFForum]
  const Guide = {
    init() {
      const links = $$('[data-spy]'); const secs = links.map((a) => document.getElementById(a.dataset.spy));
      const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => { const on = a.dataset.spy === e.target.id; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); }); }, { rootMargin: '-90px 0px -60% 0px' });
      secs.forEach((s) => io.observe(s));
    },
  };

  // ── 문의
  const Contact = {
    init() {
      this.fill();
      $('#contact-form').addEventListener('submit', (e) => {
        e.preventDefault(); const errs = [];
        const need = (id, msg, ok) => { const el = $('#' + id); const bad = !ok(el); const er = $('#' + id + '-err'); er.hidden = !bad; er.textContent = bad ? msg : ''; el.setAttribute('aria-invalid', String(bad)); if (bad) errs.push(el); };
        need('ct-name', '이름을 적으세요.', (el) => el.value.trim().length > 0);
        need('ct-tel', '휴대전화 번호 형식이 아닙니다. 예: 010-0000-0000', (el) => /^01[016789]-?\d{3,4}-?\d{4}$/.test(el.value.trim()));
        need('ct-kind', '문의 종류를 고르세요.', (el) => !!el.value);
        need('ct-msg', '내용을 10자 이상 적으세요.', (el) => el.value.trim().length >= 10);
        need('ct-agree', '수집에 동의해야 요청서를 확인할 수 있습니다.', (el) => el.checked);
        const out = $('#ct-out'); out.hidden = false;
        if (errs.length) { out.className = 'form-msg'; out.textContent = `고칠 곳 ${errs.length}개`; errs[0].focus(); return; }
        out.className = 'form-msg ok'; out.textContent = '요청서 확인 끝 · 이 화면은 전송하지 않습니다. 실제로는 영업일 하루 안에 답합니다.';
      });
    },
    fill() {
      const h = ss.get('handoff', null); if (!h) return;
      const m = $('#ct-msg'); if (m && !m.value.includes('[도우미 요약')) m.value = h.text + (m.value ? '\n\n' + m.value : '');
      const k = $('#ct-kind'); if (k && !k.value && h.kind) k.value = h.kind === 'rec' ? '녹음' : '합주실 · 연습실';
    },
  };

  // ── 시작
  LOG.render(); chatRender(); onScroll();
  if (ss.get('ai', false)) { panel.hidden = false; aiBtn.setAttribute('aria-expanded', 'true'); }
  ({ home: Home, rooms: Rooms, pricing: Pricing, booking: Booking, recording: Recording, guide: Guide, contact: Contact }[PAGE] || { init() {} }).init();
  highlight();
})();
