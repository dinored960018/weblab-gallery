// 이랑골 청과 공판장 — 화면 동작
(function () {
  'use strict';
  const D = window.IG, C = window.IGCALC, V = window.IGVIEW;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.prototype.slice.call((el || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('js');

  // 주소 쿼리 — file:// 에서 replaceState 가 막히면 조용히 넘어간다
  const query = () => new URLSearchParams(location.search);
  function setQuery(obj) {
    const q = new URLSearchParams();
    Object.keys(obj).forEach((k) => { if (obj[k] !== '' && obj[k] != null) q.set(k, obj[k]); });
    const s = q.toString();
    try { history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash); } catch (e) { /* file:// */ }
  }
  const store = {
    get(k, d) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 불가 */ } },
  };
  function showErr(id, msg) {
    const el = document.getElementById(id + '-err');
    const input = document.getElementById(id);
    if (el) { el.hidden = !msg; el.innerHTML = msg ? '<b>오류</b> ' + V.esc(msg) : ''; }
    if (input && input.matches('input, select')) {
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }
  }

  // ── 모바일 메뉴 ──────────────────────────────────────────
  (function menu() {
    const btn = $('.menu-btn'), nav = $('#nav');
    if (!btn || !nav) return;
    const close = (focus) => {
      nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open');
      if (focus) btn.focus();
    };
    btn.addEventListener('click', () => {
      if (nav.classList.contains('open')) { close(false); return; }
      nav.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open');
      const a = $('a', nav); if (a) a.focus();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) close(true); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1240 && nav.classList.contains('open')) close(false); });
  })();

  // ── 계단 단 들어옴 ───────────────────────────────────────
  (function stairs() {
    const dans = $$('.dan');
    if (!dans.length) return;
    if (reduce.matches || !('IntersectionObserver' in window)) { dans.forEach((d) => d.classList.add('in')); return; }
    const io = new IntersectionObserver((list) => {
      list.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    dans.forEach((d) => io.observe(d));
    // 주소에 #구획 이 있으면 그 단까지는 바로 제자리
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) dans.forEach((d) => { if (d.offsetTop <= t.offsetTop) d.classList.add('in'); }); }
  })();

  // ── 경매 시계 ────────────────────────────────────────────
  function Clock(root) {
    const el = {
      item: $('[data-c-item]', root), price: $('[data-c-price]', root), range: $('[data-c-range]', root),
      hand: $('[data-c-hand]', root), stamp: $('[data-c-stamp]', root), stampP: $('[data-c-stamp-p]', root),
      marks: $$('[data-c-mark]', root),
    };
    const st = { id: root.getAttribute('data-item'), spec: null, n: 0, timer: 0, running: false, t0: 0 };
    function paint() {
      const p = C.clockPrice(st.spec, st.n);
      el.price.textContent = C.won(p);
      const deg = (st.spec.start - p) / (st.spec.start - st.spec.floor) * 360;
      el.hand.style.transform = 'rotate(' + deg.toFixed(1) + 'deg)';
      return p;
    }
    function set(id) {
      stop();
      const it = C.item(id);
      st.id = id; st.spec = C.clockSpec(id); st.n = 0;
      el.item.textContent = C.itemName(it) + ' 특 · ' + C.num1(it.kg) + ' kg';
      el.range.textContent = '시작가 ' + C.won(st.spec.start) + '원 · 하한가 ' + C.won(st.spec.floor) + '원';
      el.marks.forEach((m, i) => { m.textContent = C.won(Math.round((st.spec.start - (st.spec.start - st.spec.floor) * (i * 2 + 1) / 8) / 100) * 100); });
      el.stamp.hidden = true;
      paint();
    }
    function stop() { clearInterval(st.timer); st.timer = 0; st.running = false; }
    // onEnd(kind, price, secs): kind = 'won' | 'fail'
    function start(onEnd, opts) {
      stop();
      st.n = 0; el.stamp.hidden = true; paint();
      st.running = true; st.t0 = performance.now(); st.onEnd = onEnd;
      const stepEvery = reduce.matches ? 10 : 1;         // 모션 줄이기: 1초마다 10틱씩
      const target = opts && opts.stopAt;
      st.timer = setInterval(() => {
        st.n = Math.min(st.spec.ticks, st.n + stepEvery);
        if (target != null && st.n >= target) { st.n = target; paint(); bid(); return; }
        paint();
        if (st.n >= st.spec.ticks) { stop(); if (st.onEnd) st.onEnd('fail', st.spec.floor, (performance.now() - st.t0) / 1000); }
      }, D.CLOCK.tick * stepEvery);
    }
    function bid() {
      if (!st.running) return false;
      stop();
      const p = paint();
      el.stampP.textContent = C.won(p) + '원';
      el.stamp.hidden = false;
      el.stamp.classList.remove('press');
      if (!reduce.matches) { void el.stamp.offsetWidth; el.stamp.classList.add('press'); }
      if (st.onEnd) st.onEnd('won', p, (performance.now() - st.t0) / 1000);
      return true;
    }
    function showFinal(n) { st.n = n; const p = paint(); el.stampP.textContent = C.won(p) + '원'; el.stamp.hidden = false; }
    set(st.id);
    return { set, start, bid, stop, showFinal, st };
  }

  (function clockPage() {
    const form = $('[data-clock-form]');
    const root = $('[data-clock]:not([data-auto])');
    if (!form || !root) return;
    const clock = Clock(root);
    const sel = $('#c-item'), msg = $('[data-c-msg]'), startBtn = $('[data-c-start]'), bidBtn = $('[data-c-bid]');
    const tbody = $('[data-c-log] tbody');
    let log = store.get('ig-clock-log', []);
    let round = store.get('ig-clock-round', 0);
    function drawLog() {
      if (!log.length) { tbody.innerHTML = '<tr class="empty"><td colspan="6">기록 없음</td></tr>'; return; }
      tbody.innerHTML = log.map((r) => '<tr><th scope="row" data-l="회">' + r.round + '회</th><td data-l="품목">' + V.esc(r.item) + '</td><td data-l="결과">' + r.kind + '</td><td class="num" data-l="가격">' + C.won(r.price) + '원</td><td class="num" data-l="시작가 대비">' + r.ratio + '</td><td class="num" data-l="걸린 시간">' + r.secs + '초</td></tr>').join('');
    }
    const q = query().get('item');
    if (q && C.item(q)) sel.value = q;
    clock.set(sel.value);
    drawLog();
    sel.addEventListener('change', () => {
      clock.set(sel.value);
      startBtn.textContent = '시작';
      msg.textContent = '품목: ' + C.itemName(C.item(sel.value)) + ' · 시작 단추를 누르세요.';
      setQuery({ item: sel.value });
    });
    function end(kind, price, secs) {
      const sp = clock.st.spec;
      const ratio = (price / sp.start * 100).toFixed(1) + ' %';
      round += 1; store.set('ig-clock-round', round);
      const it = C.item(clock.st.id);
      log.unshift({ round: round, item: it.name + ' (' + it.variety + ')', kind: kind === 'won' ? '낙찰' : '유찰', price: price, ratio: kind === 'won' ? ratio : '없음', secs: secs.toFixed(1) });
      log = log.slice(0, D.CLOCK.keep); store.set('ig-clock-log', log);
      drawLog();
      startBtn.textContent = '다시 시작';
      msg.textContent = kind === 'won'
        ? '낙찰: ' + C.won(price) + '원 · 시작가 대비 ' + ratio + ' · ' + secs.toFixed(1) + '초'
        : '유찰: 하한가 ' + C.won(price) + '원까지 누르지 않았습니다.';
    }
    startBtn.addEventListener('click', () => {
      clock.start(end);
      msg.textContent = '경매 중 · 0.1초마다 ' + C.won(clock.st.spec.step) + '원씩 내려갑니다.';
      bidBtn.focus();
    });
    bidBtn.addEventListener('click', () => {
      if (!clock.bid()) msg.textContent = '시작 단추를 먼저 누르세요.';
    });
    // Space · Enter — 단추 · 입력 칸 밖에서 눌렀을 때만 낙찰로 받는다
    document.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      if (e.target.closest && e.target.closest('button, a, input, select, textarea')) return;
      if (!clock.st.running) return;
      e.preventDefault();
      clock.bid();
    });
  })();

  // 홈 — 보기 시계: 한 번 내려가다 60 % 지점에서 낙찰
  (function homeClock() {
    const root = $('[data-clock][data-auto]');
    if (!root) return;
    const clock = Clock(root);
    const at = Math.round(clock.st.spec.ticks * 0.6);
    if (reduce.matches) { clock.showFinal(at); return; }
    const go = () => setTimeout(() => clock.start(null, { stopAt: at }), 600);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((list) => { if (list[0].isIntersecting) { io.disconnect(); go(); } }, { threshold: 0.4 });
      io.observe(root);
    } else go();
  })();

  // ── 출하 정산 ────────────────────────────────────────────
  (function settle() {
    const form = $('[data-settle]');
    if (!form) return;
    const out = $('[data-settle-out]');
    const f = { item: $('#s-item'), g: $('#s-g'), n: $('#s-n'), kg: $('#s-kg'), p: $('#s-p') };
    const q = query();
    let restored = false;
    ['item', 'g', 'n', 'kg', 'p'].forEach((k) => {
      const v = q.get(k);
      if (v == null) return;
      restored = true;
      if (f[k].tagName === 'SELECT') { if ($$('option', f[k]).some((o) => o.value === v)) f[k].value = v; } else f[k].value = v;
    });
    const read = () => ({ item: f.item.value, g: f.g.value, n: f.n.value, kg: f.kg.value, p: f.p.value });
    function run(write) {
      const res = C.settle(read());
      ['item', 'g', 'n', 'kg', 'p'].forEach((k) => showErr('s-' + k, res.ok ? '' : res.errors[k]));
      out.innerHTML = V.settle(res);
      if (write) setQuery(read());
      return res;
    }
    // 품목 · 등급을 바꾸면 오늘 시세로 중량 · 낙찰가를 다시 채운다
    function refill() {
      const it = C.item(f.item.value), pr = C.price(f.item.value, C.TODAY);
      f.kg.value = it.kg;
      if (pr && pr.open) f.p.value = pr.grades.find((x) => x.id === f.g.value).kg;
      else f.p.value = Math.round(it.base * C.grade(f.g.value).rate / 10) * 10;
    }
    f.item.addEventListener('change', () => { refill(); run(true); });
    f.g.addEventListener('change', () => { refill(); run(true); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = run(true);
      if (!res.ok) { const k = ['item', 'g', 'n', 'kg', 'p'].find((x) => res.errors[x]); f[k].focus(); }
    });
    if (restored) run(false);
  })();

  // ── 시세 ─────────────────────────────────────────────────
  (function price() {
    const form = $('[data-price]');
    if (!form) return;
    const sel = $('#p-item'), d = $('#p-d');
    const q = query();
    if (q.get('item') && C.item(q.get('item'))) sel.value = q.get('item');
    if (q.get('d') && $$('option', d).some((o) => o.value === q.get('d'))) d.value = q.get('d');
    function run(write) {
      const v = V.price(sel.value, d.value);
      $('[data-price-chart]').innerHTML = v.chart;
      $('[data-price-grades]').innerHTML = v.grades;
      if (write) setQuery({ item: sel.value, d: d.value });
    }
    sel.addEventListener('change', () => run(true));
    d.addEventListener('change', () => run(true));
    form.addEventListener('submit', (e) => { e.preventDefault(); run(true); });
    if (q.get('item') || q.get('d')) run(false);
  })();

  // ── 반입 예약 ────────────────────────────────────────────
  (function booking() {
    const form = $('[data-booking]');
    if (!form) return;
    const B = D.BOOKING;
    const st = { date: '', slot: -1 };
    const slotsBox = $('[data-slots]'), errBox = $('[data-b-errors]'), out = $('[data-b-out]');
    const f = { truck: $('#b-truck'), item: $('#b-item'), n: $('#b-n'), name: $('#b-name'), tel: $('#b-tel'), agree: $('#b-agree') };
    function drawSlots() { slotsBox.innerHTML = V.slots(st.date, st.slot); }
    $$('.day').forEach((b) => b.addEventListener('click', () => {
      if (b.disabled) return;
      st.date = b.getAttribute('data-date'); st.slot = -1;
      $$('.day').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      showErr('b-date', '');
      drawSlots();
    }));
    slotsBox.addEventListener('click', (e) => {
      const b = e.target.closest('.slot');
      if (!b || b.disabled) return;
      st.slot = +b.getAttribute('data-slot');
      $$('.slot', slotsBox).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      showErr('b-slot', '');
    });
    const truck = () => B.trucks.find((x) => x.id === f.truck.value);
    function check() {
      const errs = [];
      if (!st.date) errs.push(['b-date', '반입 날짜: 달력에서 날짜를 고르세요.', 'date']);
      if (st.slot < 0) errs.push(['b-slot', '시각대: 남은 자리가 있는 시각대를 고르세요.', 'slot']);
      const n = Number(f.n.value.trim()), t = truck();
      if (!f.n.value.trim() || !Number.isInteger(n) || n < 1 || n > t.max) errs.push(['b-n', '상자 수: 1~' + C.won(t.max) + ' 사이의 정수를 입력하세요. (' + t.name + ' 기준)']);
      const name = f.name.value.trim();
      if (name.length < 2 || name.length > 20) errs.push(['b-name', '출하자 이름: 2~20자로 입력하세요.']);
      if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(f.tel.value.trim())) errs.push(['b-tel', '휴대전화: 010-0000-0000 형식으로 숫자와 하이픈만 입력하세요.']);
      if (!f.agree.checked) errs.push(['b-agree', '동의: 이름 · 휴대전화 사용 동의 칸을 선택하세요.']);
      return errs;
    }
    ['b-n', 'b-name', 'b-tel'].forEach((id) => document.getElementById(id).addEventListener('input', () => showErr(id, '')));
    f.agree.addEventListener('change', () => showErr('b-agree', ''));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = check();
      ['b-date', 'b-slot', 'b-n', 'b-name', 'b-tel', 'b-agree'].forEach((id) => showErr(id, ''));
      if (errs.length) {
        errs.forEach(([id, msg]) => showErr(id, msg));
        out.hidden = true;
        errBox.hidden = false;
        errBox.innerHTML = '<p>오류 ' + errs.length + '건 · 고친 뒤 다시 접수하세요.</p><ul>' + errs.map(([id, msg, sec]) => '<li><a href="#' + (sec ? sec : id) + '" data-go="' + id + '">' + V.esc(msg) + '</a></li>').join('') + '</ul>';
        errBox.focus();
        return;
      }
      errBox.hidden = true; errBox.innerHTML = '';
      const seq = store.get('ig-seq', B.firstNo);
      const no = 'IG-' + D.TODAY.code + '-' + String(seq).padStart(3, '0');
      store.set('ig-seq', seq + 1);
      const t = truck(), it = C.item(f.item.value);
      const rec = { no: no, date: st.date, dateLabel: C.label(C.parseIso(st.date)), slot: B.slots[st.slot], truck: t.name, item: C.itemName(it), n: Number(f.n.value.trim()), name: f.name.value.trim() };
      const all = store.get('ig-booked', {}); all[no] = rec; store.set('ig-booked', all);
      const lk = (location.pathname.indexOf('/booking/') > -1 ? '../lookup/index.html' : 'lookup/index.html') + '?no=' + no;
      out.hidden = false;
      out.innerHTML = '<p class="net-label">반입번호</p><p class="b-no">' + no + '</p>' +
        V.dl([['반입', rec.dateLabel + ' ' + rec.slot], ['차량', rec.truck], ['품목', V.esc(rec.item) + ' · ' + C.won(rec.n) + '상자'], ['출하자', V.esc(rec.name)]]) +
        '<p class="go"><a href="' + lk + '">반입번호 조회</a></p><p class="note">이 탭에서만 조회할 수 있습니다. 번호를 적어 두세요.</p>';
      out.focus();
    });
    // 오류 요약의 링크 — 해당 칸으로 포커스
    errBox.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-go]');
      if (!a) return;
      const id = a.getAttribute('data-go');
      const target = id === 'b-date' ? ($('.day[aria-pressed="true"]') || $('.day:not([disabled])')) : id === 'b-slot' ? ($('.slot:not([disabled])', slotsBox) || slotsBox) : document.getElementById(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ block: 'center' }); target.focus(); }
    });
  })();

  // ── 반입번호 조회 ────────────────────────────────────────
  (function lookup() {
    const form = $('[data-lookup]');
    if (!form) return;
    const input = $('#l-no'), out = $('[data-lookup-out]');
    function run(raw, write) {
      const no = C.normNo(raw);
      const booked = store.get('ig-booked', {})[no];
      const r = booked ? null : C.lookup(raw);
      out.innerHTML = V.lookup(r, booked);
      if (!booked && !r.ok) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
      input.value = no;
      if (write) setQuery({ no: no });
    }
    form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value, true); });
    const q = query().get('no');
    if (q) run(q, false);
  })();

  // ── 품목 고르기 ──────────────────────────────────────────
  (function items() {
    const form = $('[data-items]');
    if (!form) return;
    const m = $('#i-m'), k = $('#i-k'), count = $('[data-items-count]'), empty = $('[data-items-empty]');
    const q = query();
    if (q.get('m') && $$('option', m).some((o) => o.value === q.get('m'))) m.value = q.get('m');
    if (q.get('k') && $$('option', k).some((o) => o.value === q.get('k'))) k.value = q.get('k');
    function run(write) {
      const month = +m.value, kind = k.value;
      let n = 0;
      $$('.item').forEach((li) => {
        const ok = (!month || li.getAttribute('data-season').split(' ').indexOf(String(month)) > -1) && (!kind || li.getAttribute('data-kind') === kind);
        li.hidden = !ok; if (ok) n += 1;
      });
      const label = (month ? month + '월' : '모든 달') + ' · ' + (kind || '전체');
      count.textContent = label + ': ' + n + '종';
      empty.hidden = n > 0;
      empty.textContent = n ? '' : label + ': 출하 철인 품목이 없습니다.';
      if (write) setQuery({ m: month || '', k: kind });
    }
    m.addEventListener('change', () => run(true));
    k.addEventListener('change', () => run(true));
    form.addEventListener('submit', (e) => { e.preventDefault(); run(true); });
    if (q.get('m') || q.get('k')) run(false);
  })();
})();
