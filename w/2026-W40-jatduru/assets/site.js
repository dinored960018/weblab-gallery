// 잣두루 산막 — 메뉴 · 지도 강조 · 고도 단면 짚기 · 대피소/코스 필터 · 예약 · 준비물 · 기온 계산
(() => {
  const JD = window.JD;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const num = (n) => Math.round(n).toLocaleString('ko-KR');
  const km = (m) => (m / 1000).toFixed(1);
  const WD = ['일', '월', '화', '수', '목', '금', '토'];
  const dObj = (s) => new Date(s + 'T00:00:00');
  const mdw = (s) => { const d = dObj(s); return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WD[d.getDay()]})`; };
  const hm = (h) => { const t = Math.round(h * 60 / 5) * 5; const H = Math.floor(t / 60), M = t % 60; return H ? `${H}시간${M ? ` ${String(M).padStart(2, '0')}분` : ''}` : `${M}분`; };
  const clock = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(Math.round(min % 60)).padStart(2, '0')}`;
  const params = () => new URLSearchParams(location.search);
  const setParams = (obj) => {
    const p = params();
    for (const [k, v] of Object.entries(obj)) { if (v === '' || v == null || (Array.isArray(v) && !v.length)) p.delete(k); else p.set(k, Array.isArray(v) ? v.join(',') : v); }
    const q = p.toString();
    try { history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch (e) { /* file:// 등 */ }
  };
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 불가 */ } },
  };

  // ───────── 모바일 메뉴 ─────────
  const mBtn = $('.menu-btn'), menu = $('#menu');
  if (mBtn && menu) {
    const setMenu = (open) => {
      mBtn.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      mBtn.textContent = open ? '닫기' : '메뉴';
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (open) $('a', menu).focus();
    };
    mBtn.addEventListener('click', () => setMenu(menu.hidden));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); mBtn.focus(); } });
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    addEventListener('resize', () => { if (innerWidth > 960 && !menu.hidden) setMenu(false); });
  }

  // ───────── 지도 위 대피소 링크 ↔ 그림 강조
  $$('.hit').forEach((a) => {
    const g = a.closest('.map-box').querySelector(`.ht[data-hut="${a.dataset.hut}"]`);
    const set = (v) => g && g.classList.toggle('hl', v);
    a.addEventListener('pointerenter', () => set(true)); a.addEventListener('pointerleave', () => set(false));
    a.addEventListener('focus', () => set(true)); a.addEventListener('blur', () => set(false));
  });

  // ───────── 지도 가운데 맞추기 (가로로 넘치는 좁은 화면) ─────────
  $$('.mapwrap[data-center]').forEach((w) => { const c = +w.dataset.center; w.scrollLeft = Math.max(0, (w.scrollWidth - w.clientWidth) * c); });

  // ───────── 지도 강조 ─────────
  function highlight(svg, id) {
    if (!svg) return;
    const hi = $('.tr-hi', svg);
    $$('.tr', svg).forEach((p) => p.classList.toggle('on', p.dataset.trail === id));
    if (!id) { hi.setAttribute('d', ''); hi.classList.remove('go'); return; }
    hi.setAttribute('d', JD.trails[id].path);
    const len = hi.getTotalLength();
    hi.style.setProperty('--len', len);
    hi.classList.remove('go');
    if (!reduce()) { void hi.getBBox(); hi.classList.add('go'); }
  }
  function cursor(svg, x, y) { const c = svg && $('.cur', svg); if (c) { c.setAttribute('cx', x); c.setAttribute('cy', y); } }

  // ───────── 고도 단면 짚기 ─────────
  const P = JD.pxmap;
  const px = (d) => P.PX0 + d / P.DMAX * (P.PX1 - P.PX0);
  const py = (z) => P.PY0 - (z - P.ZMIN) / (P.ZMAX - P.ZMIN) * (P.PY0 - P.PY1);
  $$('.prof').forEach((svg) => {
    const t = JD.trails[svg.dataset.trail];
    const g = $('.scrub', svg), line = $('.sv', g), dotc = $('circle', g), box = $('.sr rect', g), txt = $('.sr text', g);
    const li = svg.closest('.trail');
    const out = li && $('.readout', li);
    const map = document.getElementById('trails-map');
    let idx = -1;
    const show = (i) => {
      idx = Math.max(0, Math.min(t.d.length - 1, i));
      const d = t.d[idx], z = t.z[idx], x = px(d), y = py(z);
      g.hidden = false;
      line.setAttribute('transform', `translate(${x} 0)`);
      dotc.setAttribute('cx', x); dotc.setAttribute('cy', y);
      const post = `${t.no}-${String(Math.round(d / 500)).padStart(2, '0')}`;
      txt.textContent = `${km(d)} km · ${num(z)} m`;
      const w = txt.textContent.length * 9.6 + 16;
      const bx = Math.min(Math.max(x - w / 2, P.PX0), P.PX1 - w);
      box.setAttribute('x', bx); box.setAttribute('y', 0); box.setAttribute('width', w); box.setAttribute("height", 24);
      txt.setAttribute('x', bx + 8); txt.setAttribute("y", 18);
      if (out) out.textContent = `${km(d)} km 지점 · 해발 ${num(z)} m · 가까운 이정표 ${post}`;
      if (map) cursor(map, t.x[idx], t.y[idx]);
    };
    const fromEvent = (e) => {
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      const d = (p.x - P.PX0) / (P.PX1 - P.PX0) * P.DMAX;
      let best = 0, bd = Infinity;
      t.d.forEach((v, i) => { const dd = Math.abs(v - d); if (dd < bd) { bd = dd; best = i; } });
      show(best);
    };
    svg.addEventListener('pointermove', fromEvent);
    svg.addEventListener('pointerdown', (e) => { fromEvent(e); if (li) select(li.dataset.id, false); });
    svg.addEventListener('pointerleave', () => { g.hidden = true; if (map) cursor(map, -100, -100); });
    svg.addEventListener('focus', () => { if (idx < 0) show(0); if (li) select(li.dataset.id, false); });
    svg.addEventListener('blur', () => { g.hidden = true; });
    svg.addEventListener('keydown', (e) => {
      const step = Math.max(1, Math.round(250 / (t.d[1] - t.d[0] || 6)));
      if (e.key === 'ArrowRight') { show(idx + step); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { show(idx - step); e.preventDefault(); }
      else if (e.key === 'Home') { show(0); e.preventDefault(); }
      else if (e.key === 'End') { show(t.d.length - 1); e.preventDefault(); }
    });
  });

  // ───────── 코스 ─────────
  const tList = $('#trail-list');
  let selectedTrail = '';
  function select(id, scroll) {
    if (!tList) return;
    if (id === selectedTrail) return;
    selectedTrail = id;
    const map = document.getElementById('trails-map');
    highlight(map, id);
    $$('.trail', tList).forEach((li) => {
      const on = li.dataset.id === id;
      li.classList.toggle('sel', on);
      $('.show', li).setAttribute('aria-pressed', String(on));
      $('.show', li).textContent = on ? '지도에 표시 중' : '지도에 표시';
      const pr = $('.prof', li);
      pr.classList.toggle('on', on);
      pr.classList.remove('go');
      if (on && !reduce()) { void pr.getBBox(); pr.classList.add('go'); }
    });
    const t = id && JD.trails[id];
    const cap = $('#map-sel');
    if (cap) cap.textContent = t ? `${t.no} ${t.name} — ${km(t.dist)} km, 오르막 ${num(t.up)} m, ${hm(t.time)}` : '코스를 고르면 지도에 주황으로 표시된다.';
    setParams({ t: id });
    if (scroll && id) document.getElementById('t-' + id).scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
  }
  if (tList) {
    const chips = $$('#trail-filters .chip');
    const sortSel = $('#t-sort');
    const q = params();
    const levels = (q.get('level') || '').split(',').filter(Boolean);
    chips.forEach((c) => c.setAttribute('aria-pressed', String(levels.includes(c.dataset.v))));
    if (q.get('sort')) sortSel.value = q.get('sort');
    const apply = () => {
      const lv = chips.filter((c) => c.getAttribute('aria-pressed') === 'true').map((c) => c.dataset.v);
      const rows = $$('.trail', tList);
      let n = 0;
      rows.forEach((li) => { const on = !lv.length || lv.includes(li.dataset.level); li.hidden = !on; if (on) n++; });
      const key = sortSel.value;
      rows.sort((a, b) => (+a.dataset[key]) - (+b.dataset[key])).forEach((li) => tList.appendChild(li));
      $('#trail-count').textContent = !lv.length ? '여덟 코스 모두' : n ? `${n}코스` : '0코스';
      $('#trail-empty').hidden = n > 0;
      if (selectedTrail && document.getElementById('t-' + selectedTrail).hidden) select('', false);
      setParams({ level: lv, sort: key === 'no' ? '' : key });
    };
    chips.forEach((c) => c.addEventListener('click', () => { c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true')); apply(); }));
    sortSel.addEventListener('change', apply);
    $$('.show', tList).forEach((b) => b.addEventListener('click', () => { const id = b.closest('.trail').dataset.id; select(selectedTrail === id ? '' : id, false); }));
    $$('#trails-map .tr').forEach((p) => p.addEventListener('click', () => select(p.dataset.trail, true)));
    apply();
    const t0 = q.get('t');
    if (t0 && JD.trails[t0] && !document.getElementById('t-' + t0).hidden) select(t0, true);
  }

  // ───────── 대피소 목록 ─────────
  const hList = $('#hut-list');
  if (hList) {
    const chips = $$('#hut-filters .chip');
    const dateSel = $('#f-date'), sortSel = $('#f-sort');
    const map = document.getElementById('huts-map');
    const q = params();
    const pre = { water: (q.get('water') || '').split(','), cook: [q.get('cook') || ''], band: [q.get('band') || ''], avail: [q.get('avail') || ''] };
    chips.forEach((c) => c.setAttribute('aria-pressed', String(pre[c.dataset.f].includes(c.dataset.v))));
    if (q.get('date') && JD.days.includes(q.get('date'))) dateSel.value = q.get('date');
    if (q.get('sort')) sortSel.value = q.get('sort');
    const on = (f) => chips.filter((c) => c.dataset.f === f && c.getAttribute('aria-pressed') === 'true').map((c) => c.dataset.v);
    const seatTxt = (n) => (n < 0 ? '휴무' : n === 0 ? '마감' : `${n}석`);
    const apply = () => {
      const water = on('water'), cook = on('cook').length, band = on('band'), avail = on('avail').length, date = dateSel.value;
      const rows = $$('.hut-row', hList);
      let n = 0;
      rows.forEach((li) => {
        const id = li.dataset.id, seat = JD.seats[id][date], elev = +li.dataset.elev;
        const ok = (!water.length || water.includes(li.dataset.water)) && (!cook || li.dataset.cook === '1')
          && (!band.length || band.some((b) => (b === 'high' ? elev >= 1000 : elev < 1000))) && (!avail || seat > 0);
        li.hidden = !ok; if (ok) n++;
        li.dataset.seat = seat;
        $('.seat-n', li).textContent = seatTxt(seat);
        const d = dObj(date); $('.seat-d', li).textContent = `${d.getMonth() + 1}월 ${d.getDate()}일`;
        const mk = map && $(`.ht[data-hut="${id}"]`, map);
        if (mk) mk.classList.toggle('off', !ok);
        $$(`.hit[data-hut="${id}"]`).forEach((a) => { a.hidden = !ok; });
      });
      const [k, dir] = sortSel.value.split('-');
      const val = (li) => +(k === 'seat' ? li.dataset.seat : li.dataset[k]);
      rows.sort((a, b) => (dir === 'desc' ? val(b) - val(a) : val(a) - val(b))).forEach((li) => hList.appendChild(li));
      const filtered = water.length || cook || band.length || avail;
      $('#hut-count').textContent = !filtered ? `여섯 곳 모두 · ${mdw(date)}` : `${n}곳 · ${mdw(date)}`;
      $('#hut-empty').hidden = n > 0;
      setParams({ water, cook: cook ? 1 : '', band, avail: avail ? 1 : '', date: date === JD.today ? '' : date, sort: sortSel.value === 'elev-desc' ? '' : sortSel.value });
    };
    chips.forEach((c) => c.addEventListener('click', () => {
      const was = c.getAttribute('aria-pressed') === 'true';
      if (c.dataset.f === 'band') chips.filter((x) => x.dataset.f === 'band').forEach((x) => x.setAttribute('aria-pressed', 'false'));
      c.setAttribute('aria-pressed', String(!was)); apply();
    }));
    dateSel.addEventListener('change', apply);
    sortSel.addEventListener('change', apply);
    $('#hut-reset').addEventListener('click', () => { chips.forEach((c) => c.setAttribute('aria-pressed', 'false')); apply(); chips[0].focus(); });
    // 목록과 지도 서로 가리키기
    $$('.hut-row', hList).forEach((li) => {
      const mk = map && $(`.ht[data-hut="${li.dataset.id}"]`, map);
      if (!mk) return;
      const set = (v) => mk.classList.toggle('hl', v);
      li.addEventListener('pointerenter', () => set(true)); li.addEventListener('pointerleave', () => set(false));
      $$(`.hit[data-hut="${li.dataset.id}"]`).forEach((a) => { a.addEventListener('pointerenter', () => li.classList.add('hl')); a.addEventListener('pointerleave', () => li.classList.remove('hl')); });
    });
    apply();
  }

  // ───────── 예약 ─────────
  const form = $('#rsv');
  if (form) {
    const st = { hut: '', date: '', ppl: 1 };
    const R = JD.rules;
    const pplOut = $('#ppl'), bl = $('#blanket'), route = $('#route');
    const won = (n) => n.toLocaleString('ko-KR') + '원';
    const sunset = (date) => { const i = (dObj(date) - dObj('2026-10-01')) / 864e5; return 18 * 60 + 10 - i * 1.6; };
    const maxPpl = () => Math.min(R.maxPeople, st.hut && st.date ? Math.max(1, JD.seats[st.hut][st.date]) : R.maxPeople);

    function renderCal() {
      const g = $('#cal-g'); g.innerHTML = '';
      const first = dObj(JD.days[0]).getDay();
      for (let i = 0; i < first; i++) { const s = document.createElement('span'); s.className = 'cal-b na'; s.setAttribute('aria-hidden', 'true'); g.appendChild(s); }
      JD.days.forEach((d) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'cal-b'; b.dataset.date = d;
        const n = st.hut ? JD.seats[st.hut][d] : null;
        const day = +d.slice(8);
        if (JD.holidays.includes(d)) b.classList.add('hol');
        let label = `${mdw(d)}`;
        let nTxt = '—';
        if (n === null) { b.disabled = true; label += ', 대피소를 먼저 고른다'; }
        else if (n < 0) { b.disabled = true; b.classList.add('off'); nTxt = '휴무'; label += ', 휴무'; }
        else if (n === 0) { b.disabled = true; b.classList.add('full'); nTxt = '마감'; label += ', 마감'; }
        else { nTxt = `${n}석`; label += `, 잔여 ${n}석`; }
        b.innerHTML = `<span class="cal-d">${day}</span><span class="cal-n">${nTxt}</span>`;
        b.setAttribute('aria-label', label);
        b.setAttribute('aria-pressed', String(d === st.date));
        b.addEventListener('click', () => { st.date = d; clearErr('date'); renderCal(); update(); $(`.cal-b[data-date="${d}"]`).focus(); });
        g.appendChild(b);
      });
    }
    function renderRoutes() {
      route.innerHTML = '';
      if (!st.hut) { route.disabled = true; route.innerHTML = '<option value="">대피소를 먼저 고른다</option>'; return; }
      route.disabled = false;
      const ap = JD.huts[st.hut].approach;
      route.innerHTML = (ap.length > 1 ? '<option value="">코스를 고른다</option>' : '') + ap.map((a, i) => `<option value="${i}">${a.label} · ${km(a.dist)} km · ${hm(a.time)}</option>`).join('');
    }
    function update() {
      const H = st.hut && JD.huts[st.hut];
      $('#cal-hut').textContent = H ? `${H.name} · 해발 ${num(H.elev)} m` : '대피소를 먼저 고른다';
      const mx = maxPpl();
      if (st.ppl > mx) st.ppl = mx;
      pplOut.textContent = st.ppl;
      $$('.st-btn').forEach((b) => { b.disabled = (+b.dataset.d < 0 && st.ppl <= 1) || (+b.dataset.d > 0 && st.ppl >= mx); });
      $('#h-ppl').textContent = st.hut && st.date && JD.seats[st.hut][st.date] < R.maxPeople ? `이 날 잔여 ${JD.seats[st.hut][st.date]}석 — 최대 ${mx}명` : `1회 최대 ${R.maxPeople}명`;
      const blv = Math.min(+bl.value || 0, st.ppl);
      bl.innerHTML = Array.from({ length: st.ppl + 1 }, (_, i) => `<option value="${i}">${i}장</option>`).join('');
      bl.value = blv;
      // 출발 시각
      const dep = $('#depart');
      const a = H && route.value !== '' ? H.approach[+route.value] : null;
      if (a) {
        const [ah, am] = R.arriveBy.split(':').map(Number);
        const latest = Math.min(ah * 60 + am - a.time * 60, 15 * 60);
        const ss = st.date ? `, 해 지는 시각 약 ${clock(sunset(st.date))}` : '';
        dep.innerHTML = `${a.label} ${km(a.dist)} km, 오르막 ${num(a.up)} m, ${hm(a.time)}. ${R.arriveBy} 도착 기준 <b>늦어도 ${clock(Math.floor(latest / 5) * 5)} 출발</b>${ss}.`;
      } else dep.textContent = '';
      // 요약
      $('#s-hut').textContent = H ? `${H.name} (${num(H.elev)} m)` : '—';
      $('#s-date').textContent = st.date ? mdw(st.date) : '—';
      $('#s-ppl').textContent = `${st.ppl}명`;
      $('#s-bl').textContent = `${bl.value}장`;
      $('#s-total').textContent = won(H ? H.fee * st.ppl + (+bl.value) * R.blanketFee : 0);
    }
    const errEl = (k) => $('#e-' + k);
    function setErr(k, msg, field) { const e = errEl(k); e.textContent = msg; e.hidden = false; if (field) field.setAttribute('aria-invalid', 'true'); }
    function clearErr(k) { const e = errEl(k); if (!e) return; e.hidden = true; e.textContent = ''; const f = $('#' + k); if (f && f.setAttribute) f.removeAttribute('aria-invalid'); }

    $$('input[name="hut"]', form).forEach((r) => r.addEventListener('change', () => {
      st.hut = r.value; clearErr('hut');
      const note = [];
      if (st.date && JD.seats[st.hut][st.date] <= 0) { note.push(st.date); st.date = ''; }
      renderCal(); renderRoutes(); update();
      if (note.length) setErr('date', `${mdw(note[0])}은 이 대피소에 자리가 없어 날짜를 다시 고른다.`);
    }));
    $$('.st-btn').forEach((b) => b.addEventListener('click', () => { st.ppl = Math.max(1, Math.min(maxPpl(), st.ppl + +b.dataset.d)); update(); }));
    bl.addEventListener('change', update);
    route.addEventListener('change', () => { clearErr('route'); update(); });
    ['name', 'tel', 'birth'].forEach((k) => $('#' + k).addEventListener('input', () => clearErr(k)));
    $('#agree').addEventListener('change', () => clearErr('agree'));

    function validBirth(s) {
      if (!/^\d{8}$/.test(s)) return false;
      const y = +s.slice(0, 4), m = +s.slice(4, 6), d = +s.slice(6);
      const dt = new Date(y, m - 1, d);
      return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d && y >= 1900 && dt <= dObj(JD.today);
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errs = [];
      const add = (k, msg, focusId, field) => { setErr(k, msg, field); errs.push([focusId, msg]); };
      ['hut', 'date', 'route', 'name', 'tel', 'birth', 'agree'].forEach(clearErr);
      if (!st.hut) add('hut', '대피소를 고르지 않았다.', 'f-hut', null);
      if (!st.date) add('date', st.hut ? '날짜를 고르지 않았다.' : '날짜를 고르지 않았다. 대피소를 먼저 고른다.', 'f-date', null);
      if (st.hut && route.value === '') add('route', '들어가는 코스를 고르지 않았다.', 'route', route);
      const name = $('#name').value.trim();
      if (name.length < 2) add('name', name ? '이름은 두 글자 이상 적는다.' : '이름이 비어 있다.', 'name', $('#name'));
      const tel = $('#tel').value.trim().replace(/\s/g, '');
      if (!tel) add('tel', '휴대전화 번호가 비어 있다.', 'tel', $('#tel'));
      else if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(tel)) add('tel', '휴대전화 번호 형식이 맞지 않는다. 예: 010-1234-5678', 'tel', $('#tel'));
      const birth = $('#birth').value.trim();
      if (!birth) add('birth', '생년월일이 비어 있다.', 'birth', $('#birth'));
      else if (!validBirth(birth)) add('birth', /^\d{8}$/.test(birth) ? '없는 날짜다. 예: 19900101' : '생년월일은 숫자 8자리로 적는다. 예: 19900101', 'birth', $('#birth'));
      if (!$('#agree').checked) add('agree', '이용 규칙을 읽었다는 확인이 필요하다.', 'agree', $('#agree'));
      const sum = $('#err-sum'), res = $('#result');
      if (errs.length) {
        res.hidden = true;
        sum.innerHTML = `<h2>고칠 곳 ${errs.length}곳</h2><ul>${errs.map(([id, m]) => `<li><a href="#${id}" data-go="${id}">${m}</a></li>`).join('')}</ul>`;
        sum.hidden = false; sum.focus();
        $$('a[data-go]', sum).forEach((a) => a.addEventListener('click', (ev) => {
          ev.preventDefault();
          const el = document.getElementById(a.dataset.go);
          const f = el.matches('fieldset') ? el.querySelector('input:not(:disabled), button:not(:disabled)') : el;
          el.scrollIntoView({ block: 'center', behavior: reduce() ? 'auto' : 'smooth' });
          (f || el).focus({ preventScroll: true });
        }));
        return;
      }
      sum.hidden = true;
      const H = JD.huts[st.hut], a = H.approach[+route.value];
      res.innerHTML = `<h3>예약이 전송되지 않았다</h3><p>연습용 사이트라 예약은 어디에도 보내지 않는다. 입력한 내용은 ${H.name}, ${mdw(st.date)}, ${st.ppl}명, 모포 ${bl.value}장, ${a.label}, 합계 ${$('#s-total').textContent}이다.</p>`;
      res.hidden = false; res.focus();
    });

    // 주소로 미리 고르기
    const q = params();
    const qh = q.get('hut'), qd = q.get('date');
    if (qh && JD.huts[qh]) { const r = $(`input[name="hut"][value="${qh}"]`, form); r.checked = true; st.hut = qh; }
    if (st.hut && qd && JD.seats[st.hut][qd] > 0) st.date = qd;
    renderCal(); renderRoutes(); update();
  }

  // ───────── 산행 준비 ─────────
  const prep = $('.prep');
  if (prep) {
    const KEY = 'jatduru-pack-v1';
    const saved = store.get(KEY) || {};
    const st = { plan: saved.plan || 'overnight', hut: saved.hut || 'jatdurubong', checked: saved.checked || {} };
    const hutSel = $('#prep-hut');
    if (JD.huts[st.hut]) hutSel.value = st.hut;
    const topLow = Math.min(...JD.fc.map((f) => f.lo - (JD.layers[2].elev - JD.layers[0].elev) / 100 * JD.lapse));
    const save = () => store.set(KEY, st);
    const render = () => {
      $$('[data-plan]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.plan === st.plan)));
      $('#prep-hut-f').hidden = st.plan !== 'overnight';
      const H = JD.huts[st.hut];
      const notes = {
        water: st.plan === 'day' ? '1인 1.5~2 L'
          : H.water === 'yes' ? `1인 2 L, ${H.name}에서 채울 수 있음`
            : H.water === 'season' ? `<b>1인 3 L</b> ${H.name} 샘은 10월에 끊길 수 있음`
              : `<b>1인 3.5 L 이상</b> ${H.name}는 식수 없음, 저녁·아침 물까지`,
        stove: st.plan === 'overnight' && !H.cook ? `<b>${H.name} 취사 불가</b> 챙기지 않음` : '가스 버너만. 취사장에서만 조리',
        meal: st.plan === 'overnight' && !H.cook ? '조리 없이 먹을 것으로' : '',
        hotpack: `잣두루봉 5일 예보 중 최저 ${topLow.toFixed(1)} °C`,
      };
      let all = 0, done = 0;
      $$('.pk-g').forEach((g) => {
        let ga = 0, gd = 0;
        $$('li', g).forEach((li) => {
          const id = li.dataset.item;
          const skip = id === 'stove' && st.plan === 'overnight' && !H.cook;
          const vis = li.dataset.when === 'all' || st.plan === 'overnight';
          li.hidden = !vis;
          const cb = $('input', li);
          cb.checked = !!st.checked[id];
          cb.disabled = skip;
          li.classList.toggle('done', cb.checked);
          $(`[data-note="${id}"]`, li).innerHTML = notes[id] || '';
          if (vis && !skip) { ga++; all++; if (cb.checked) { gd++; done++; } }
        });
        $('.pk-c', g).textContent = `${gd} / ${ga}`;
      });
      $('#pk-done').textContent = done; $('#pk-all').textContent = all;
      $('#pk-bar').style.transform = `scaleX(${all ? done / all : 0})`;
    };
    $$('[data-plan]').forEach((b) => b.addEventListener('click', () => { st.plan = b.dataset.plan; save(); render(); }));
    hutSel.addEventListener('change', () => { st.hut = hutSel.value; save(); render(); });
    $$('.pk-g input').forEach((cb) => cb.addEventListener('change', () => { st.checked[cb.dataset.item] = cb.checked; save(); render(); }));
    $('#pk-reset').addEventListener('click', () => { st.checked = {}; save(); render(); });
    render();
  }

  // ───────── 해발별 기온 ─────────
  const calc = $('#calc');
  if (calc) {
    const el = $('#c-elev'), day = $('#c-day'), out = $('#c-out');
    const run = () => {
      const e = +el.value;
      if (!el.value || e < 300 || e > 1696) { el.setAttribute('aria-invalid', 'true'); out.textContent = '해발은 300~1,696 m 사이로 적는다.'; return; }
      el.removeAttribute('aria-invalid');
      const f = JD.fc[+day.value];
      const dz = (e - JD.layers[0].elev) / 100 * JD.lapse;
      const hi = (f.hi - dz).toFixed(1), lo = (f.lo - dz).toFixed(1);
      out.innerHTML = `해발 ${num(e)} m · ${mdw(f.date)} — 최고 <span class="big">${hi}</span> °C · 최저 <span class="big">${lo}</span> °C`;
    };
    el.addEventListener('input', run); day.addEventListener('change', run);
    calc.addEventListener('submit', (e) => { e.preventDefault(); run(); });
    run();
  }
})();
