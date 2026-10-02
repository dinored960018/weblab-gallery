// 물레내장 — 메뉴 · 장보기 목록 · 장날 계산 · 달력 · 지도 고르기 · 점포/시세 고르기
(() => {
  const J = window.JANG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rel = document.body.dataset.rel || '';
  const n = (v) => v.toLocaleString('ko-KR');
  const WD = ['일', '월', '화', '수', '목', '금', '토'];
  const STORE = Object.fromEntries(J.stores.map((s) => [s.id, s]));
  const ZONE = Object.fromEntries(J.zones.map((z) => [z.id, z]));
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const params = new URLSearchParams(location.search);
  const setURL = (obj) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(obj)) if (v) p.set(k, v);
    const q = p.toString();
    history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
  };

  // ───── 날짜 ─────
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parse = (s) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return null; const d = new Date(s + 'T00:00:00'); return isNaN(d) || iso(d) !== s ? null : d; };
  const md = (d) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
  const isJang = (d) => J.site.rule.includes(d.getDate() % 10);
  const days = (a, b) => Math.round((b - a) / 86400000);
  function firstJang(from) { // from 포함, 휴장 건너뜀
    const d = new Date(from);
    const skipped = [];
    for (let i = 0; i < 40; i++) {
      if (isJang(d)) { if (J.closed[iso(d)]) skipped.push(new Date(d)); else return { d, skipped }; }
      d.setDate(d.getDate() + 1);
    }
    return null;
  }
  const todayD = parse(params.get('today')) || (() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; })();

  // ───── 알림 ─────
  const toast = $('[data-toast]');
  let tt;
  function say(msg) { if (!toast) return; toast.textContent = msg; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2600); }

  // ───── 모바일 메뉴 ─────
  const mb = $('.menu-btn'), nav = $('#nav');
  function closeMenu(focus) { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.textContent = '메뉴'; document.documentElement.style.overflow = ''; if (focus) mb.focus(); }
  mb.addEventListener('click', () => {
    if (nav.classList.contains('open')) return closeMenu();
    nav.classList.add('open'); mb.setAttribute('aria-expanded', 'true'); mb.textContent = '닫기';
    document.documentElement.style.overflow = 'hidden';
    $('a', nav).focus();
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a') && nav.classList.contains('open')) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu(true); });
  matchMedia('(min-width: 1041px)').addEventListener('change', (m) => { if (m.matches) closeMenu(); });

  // ───── 장보기 목록 ─────
  const KEY = 'mullenae-list';
  let mem = [];
  const load = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => STORE[x.s] && J.items[x.i]) : []; } catch { return mem; } };
  const save = (list) => { mem = list; try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* 저장이 막혀도 이 화면에서는 동작 */ } };
  let cart = load();
  const priceOf = (s, i) => (STORE[s].goods.find((g) => g.k === i) || {}).price || 0;
  function syncCart() {
    $$('[data-cart-n]').forEach((el) => { el.textContent = cart.length; });
    $$('.add').forEach((b) => {
      const it = cart.find((x) => x.s === b.dataset.s && x.i === b.dataset.i);
      b.classList.toggle('is-in', !!it);
      b.textContent = it ? `담음 ${it.q}` : '담기';
    });
  }
  function addItem(s, i) {
    const it = cart.find((x) => x.s === s && x.i === i);
    if (it) it.q += 1; else cart.push({ s, i, q: 1, done: false });
    save(cart); syncCart();
    const q = cart.find((x) => x.s === s && x.i === i).q;
    say(`${STORE[s].name} ${J.items[i].name} 담음 · 수량 ${q} · 목록 ${cart.length}가지`);
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.add');
    if (b) addItem(b.dataset.s, b.dataset.i);
  });
  window.addEventListener('storage', (e) => { if (e.key === KEY) { cart = load(); syncCart(); renderList(); } });

  // 상품 줄 (지도 정보판)
  function goodsHTML(s) {
    return s.goods.map((g) => {
      const it = J.items[g.k], p = J.price[g.k];
      const vs = p ? (g.price > p.today ? '시세보다 높음' : g.price < p.today ? '시세보다 낮음' : '시세와 같음') : '시세표 밖 품목';
      return `<li class="good"><span class="g-name">${esc(it.name)}</span><span class="g-unit">${esc(it.unit)}</span><span class="g-price">${n(g.price)}<span class="won">원</span></span><span class="g-vs">${vs}</span><button class="add" type="button" data-s="${s.id}" data-i="${g.k}" aria-label="${esc(s.name)} ${esc(it.name)} 담기">담기</button></li>`;
    }).join('');
  }

  // ───── 홈: 오늘 장날 ─────
  const jd = $('[data-jangday]');
  if (jd) {
    const t = todayD;
    const closed = J.closed[iso(t)];
    let chip, date, next;
    if (isJang(t) && !closed) {
      const nx = firstJang(new Date(t.getTime() + 86400000));
      chip = '오늘 장날'; date = t;
      next = `다음 장날은 ${md(nx.d)} ${WD[nx.d.getDay()]}요일, ${days(t, nx.d)}일 뒤다.`;
      jd.classList.remove('is-off');
    } else {
      const nx = firstJang(t);
      chip = closed ? '오늘 휴장 · 다음 장날' : '다음 장날'; date = nx.d;
      next = `${days(t, nx.d)}일 뒤. 오늘(${md(t)})은 ${closed ? closed[0] + '이다' : '장이 서지 않는다'}.`;
      jd.classList.add('is-off');
    }
    $('[data-jd-chip]').textContent = chip;
    $('[data-jd-date]').textContent = md(date);
    $('[data-jd-wd]').textContent = WD[date.getDay()] + '요일';
    $('[data-jd-next]').textContent = next;
  }

  // ───── 장날 달력 ─────
  const cal = $('[data-cal]');
  if (cal) {
    const [r0, r1] = J.range.map(parse);
    const mIndex = (d) => d.getFullYear() * 12 + d.getMonth();
    const minM = mIndex(r0), maxStart = mIndex(r1) - 2;
    let start = Math.min(Math.max(mIndex(todayD), minM), maxStart);
    const nb = firstJang(todayD);
    if (nb) {
      const same = days(todayD, nb.d) === 0;
      $('[data-nb-date]').textContent = md(nb.d);
      $('[data-nb-sub]').textContent = `${WD[nb.d.getDay()]}요일 · ${same ? '오늘' : days(todayD, nb.d) + '일 뒤'}`;
      if (same) $('[data-next-box] .nb-l').textContent = '오늘 장날';
    }
    function month(mi) {
      const y = Math.floor(mi / 12), m = mi % 12;
      const first = new Date(y, m, 1), last = new Date(y, m + 1, 0).getDate();
      let h = `<div class="month"><h3>${y}년 ${m + 1}월</h3><div class="grid7" role="list">`;
      h += WD.map((w, i) => `<span class="wd${i === 0 ? ' sun' : ''}" aria-hidden="true">${w}</span>`).join('');
      for (let i = 0; i < first.getDay(); i++) h += '<span class="day" aria-hidden="true"></span>';
      let count = 0;
      for (let d = 1; d <= last; d++) {
        const dt = new Date(y, m, d), k = iso(dt);
        const jang = isJang(dt), hol = J.holidays[k], cl = J.closed[k], rain = J.rain[k];
        if (jang && !cl) count++;
        const cls = ['day', jang && 'jang', hol && 'hol', dt.getDay() === 0 && 'sun', cl && 'closed', rain && 'rain', k === iso(todayD) && 'today'].filter(Boolean).join(' ');
        const tg = cl ? '휴장' : rain ? '노천 휴장 가능' : hol ? hol : '';
        const label = `${m + 1}월 ${d}일 ${WD[dt.getDay()]}요일${jang ? (cl ? ', 장날이지만 휴장' : ', 장날') : ''}${hol ? ', ' + hol : ''}${rain ? ', 비 예보로 노천 휴장 가능' : ''}${k === iso(todayD) ? ', 오늘' : ''}`;
        h += `<span class="${cls}" role="listitem" aria-label="${label}"><span class="dn" aria-hidden="true">${d}</span>${tg ? `<span class="tg" aria-hidden="true">${tg}</span>` : ''}</span>`;
      }
      return h + `</div><p class="sec-note">장날 ${count}번</p></div>`;
    }
    function draw() {
      cal.innerHTML = [0, 1, 2].map((i) => month(start + i)).join('');
      const a = start, b = start + 2;
      const ym = (mi) => `${Math.floor(mi / 12)}년 ${mi % 12 + 1}월`;
      $('[data-cal-range]').textContent = Math.floor(a / 12) === Math.floor(b / 12) ? `${ym(a)}~${b % 12 + 1}월` : `${ym(a)}~${ym(b)}`;
      $('[data-cal-prev]').disabled = start <= minM;
      $('[data-cal-next]').disabled = start >= maxStart;
    }
    $('[data-cal-prev]').addEventListener('click', () => { start = Math.max(minM, start - 3); draw(); });
    $('[data-cal-next]').addEventListener('click', () => { start = Math.min(maxStart, start + 3); draw(); });
    draw();

    const form = $('[data-pick]'), inp = $('#pick-d'), out = $('[data-pick-out]');
    function pick(v, push) {
      const d = parse(v);
      if (!d) { out.innerHTML = '<span class="err">날짜를 2026-10-02 꼴로 적는다.</span>'; inp.setAttribute('aria-invalid', 'true'); return; }
      if (d < r0 || d > r1) { out.innerHTML = `<span class="err">달력은 ${md(r0)}(2026년)부터 ${md(r1)}(2027년)까지다.</span>`; inp.setAttribute('aria-invalid', 'true'); return; }
      inp.removeAttribute('aria-invalid');
      const r = firstJang(d);
      const gap = days(d, r.d);
      const k = iso(r.d), extra = J.rain[k] ? ' 비 예보가 있어 노천 좌판은 쉴 수 있다.' : J.holidays[k] ? ` ${J.holidays[k]}이지만 장은 선다.` : '';
      const skip = r.skipped.map((s) => `${md(s)}은 ${J.closed[iso(s)][0]}이라 건너뛴다. `).join('');
      out.innerHTML = gap === 0
        ? `${md(d)} ${WD[d.getDay()]}요일은 <b>장날</b>이다.${extra}`
        : `${skip}${md(d)} 뒤 첫 장날은 <b>${md(r.d)}</b> ${WD[r.d.getDay()]}요일, ${gap}일 뒤다.${extra}`;
      const mi = mIndex(r.d);
      if (mi < start || mi > start + 2) { start = Math.min(Math.max(mi - 1, minM), maxStart); draw(); }
      if (push) setURL({ date: v });
    }
    form.addEventListener('submit', (e) => { e.preventDefault(); pick(inp.value, true); });
    const pd = params.get('date');
    if (pd) { inp.value = pd; pick(pd, false); }
  }

  // ───── 지도 ─────
  const map = $('#jangmap');
  if (map) {
    const sts = $$('.st', map);
    const sel = $('[data-item-sel]'), out = $('[data-map-out]'), hits = $('[data-hits]'), info = $('[data-info]');
    const chips = $$('[data-cat]');
    let st = { cat: J.cats.some(([c]) => c === params.get('cat')) ? params.get('cat') : '', item: J.items[params.get('item')] ? params.get('item') : '', store: STORE[params.get('store')] ? params.get('store') : '' };
    if (st.item) st.cat = '';
    const catName = Object.fromEntries(J.cats);
    function apply() {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === st.cat)));
      sel.value = st.item;
      const on = (el) => (st.item ? el.dataset.items.split(' ').includes(st.item) : st.cat ? el.dataset.cats.split(' ').includes(st.cat) : false);
      map.classList.toggle('picking', !!(st.item || st.cat));
      const list = [];
      sts.forEach((el) => { const m = on(el); el.classList.toggle('on', m); el.classList.toggle('focus', el.dataset.store === st.store); if (m) list.push(STORE[el.dataset.store]); });
      list.sort((a, b) => a.no.localeCompare(b.no, 'ko'));
      if (st.item || st.cat) {
        const what = st.item ? J.items[st.item].name : catName[st.cat];
        out.textContent = `${what} — 파는 점포 ${list.length}곳`;
        hits.innerHTML = list.map((s) => {
          const g = st.item ? s.goods.find((x) => x.k === st.item) : null;
          return `<li><button type="button" data-hit="${s.id}"><span class="h-no">${s.no}</span><span class="h-name">${esc(s.name)}</span>${g ? `<span class="h-price">${n(g.price)}원</span>` : ''}</button></li>`;
        }).join('');
      } else {
        out.textContent = '품목을 고르면 파는 점포가 노랗게 칠해진다.';
        hits.innerHTML = '';
      }
      if (st.store) {
        const s = STORE[st.store];
        info.hidden = false;
        info.innerHTML = `<div class="info-head"><span class="s-no">${s.no}</span><h2 class="info-name" tabindex="-1">${esc(s.name)}</h2><span class="s-meta">${ZONE[s.zone].mark} ${esc(ZONE[s.zone].name)} · ${s.perm ? '상설' : '노점'}</span><button class="btn line info-close" type="button" data-info-close>닫기</button></div><ul class="goods">${goodsHTML(s)}</ul>${s.perm ? `<p class="more"><a href="${rel}stores/${s.id}/index.html">${esc(s.name)} 자세히</a></p>` : ''}`;
        syncCart();
      } else { info.hidden = true; info.innerHTML = ''; }
      setURL({ item: st.item, cat: st.cat, store: st.store });
    }
    function openStore(id, focusInfo) { st.store = id; apply(); if (focusInfo) { const h = $('.info-name', info); h && h.focus({ preventScroll: false }); } }
    chips.forEach((c) => c.addEventListener('click', () => { st.cat = st.cat === c.dataset.cat ? '' : c.dataset.cat; st.item = ''; apply(); }));
    sel.addEventListener('change', () => { st.item = sel.value; st.cat = ''; apply(); });
    $('[data-map-clear]').addEventListener('click', () => { st = { cat: '', item: '', store: '' }; apply(); });
    hits.addEventListener('click', (e) => { const b = e.target.closest('[data-hit]'); if (b) openStore(b.dataset.hit, true); });
    sts.forEach((el) => {
      el.addEventListener('click', () => openStore(el.dataset.store, false));
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStore(el.dataset.store, true); } });
    });
    info.addEventListener('click', (e) => {
      if (e.target.closest('[data-info-close]')) { const id = st.store; st.store = ''; apply(); const g = $(`.st[data-store="${id}"]`, map); g && g.focus(); }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && st.store && !nav.classList.contains('open')) { const id = st.store; st.store = ''; apply(); const g = $(`.st[data-store="${id}"]`, map); g && g.focus(); } });
    apply();
    // 좁은 화면: 고른 점포가 보이도록 가로 스크롤
    if (st.store) { const sc = $('[data-map-scroll]'); const g = $(`.st[data-store="${st.store}"]`, map); if (sc && g && sc.scrollWidth > sc.clientWidth) { const r = g.getBoundingClientRect(), b = sc.getBoundingClientRect(); sc.scrollLeft += r.left - b.left - b.width / 2 + r.width / 2; } }
  }

  // ───── 점포 목록 ─────
  const storeList = $('[data-stores]');
  if (storeList) {
    const rows = $$('.store', storeList);
    const zSel = $('[data-f-zone]'), kSel = $('[data-f-kind]'), sSel = $('[data-f-sort]'), out = $('[data-f-out]'), empty = $('[data-empty]');
    const chips = $$('[data-f-cat]');
    const valid = (v, sel) => [...sel.options].some((o) => o.value === v) ? v : '';
    let st = {
      cat: (params.get('cat') || '').split(',').filter((c) => J.cats.some(([k]) => k === c)),
      zone: valid(params.get('zone') || '', zSel), kind: valid(params.get('kind') || '', kSel), sort: valid(params.get('sort') || 'no', sSel) || 'no',
    };
    function apply() {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(st.cat.includes(c.dataset.fCat))));
      zSel.value = st.zone; kSel.value = st.kind; sSel.value = st.sort;
      let shown = 0;
      rows.forEach((r) => {
        const ok = (!st.cat.length || r.dataset.cats.split(' ').some((c) => st.cat.includes(c))) && (!st.zone || r.dataset.zone === st.zone) && (!st.kind || r.dataset.kind === st.kind);
        r.hidden = !ok; if (ok) shown++;
      });
      const sorted = [...rows].sort((a, b) => st.sort === 'name' ? a.dataset.name.localeCompare(b.dataset.name, 'ko') : rows.indexOf(a) - rows.indexOf(b));
      sorted.forEach((r) => storeList.appendChild(r));
      out.textContent = shown === rows.length ? `${rows.length}곳` : `${rows.length}곳 중 ${shown}곳`;
      empty.hidden = shown > 0; storeList.hidden = shown === 0;
      setURL({ cat: st.cat.join(','), zone: st.zone, kind: st.kind, sort: st.sort === 'no' ? '' : st.sort });
    }
    chips.forEach((c) => c.addEventListener('click', () => { const k = c.dataset.fCat; st.cat = st.cat.includes(k) ? st.cat.filter((x) => x !== k) : [...st.cat, k]; apply(); }));
    zSel.addEventListener('change', () => { st.zone = zSel.value; apply(); });
    kSel.addEventListener('change', () => { st.kind = kSel.value; apply(); });
    sSel.addEventListener('change', () => { st.sort = sSel.value; apply(); });
    $$('[data-f-clear]').forEach((b) => b.addEventListener('click', () => { st = { cat: [], zone: '', kind: '', sort: 'no' }; apply(); }));
    apply();
  }

  // ───── 시세 ─────
  const pt = $('[data-ptable]');
  if (pt) {
    const tb = $('tbody', pt), rows = $$('tr', tb);
    const cSel = $('[data-p-cat]'), sSel = $('[data-p-sort]'), out = $('[data-p-out]'), empty = $('[data-p-empty]');
    const dirs = $$('[data-p-dir]');
    const valid = (v, sel) => [...sel.options].some((o) => o.value === v) ? v : '';
    let st = { dir: ['up', 'down', 'same'].includes(params.get('dir')) ? params.get('dir') : '', cat: valid(params.get('cat') || '', cSel), sort: valid(params.get('sort') || 'ord', sSel) || 'ord' };
    function apply() {
      dirs.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pDir === st.dir)));
      cSel.value = st.cat; sSel.value = st.sort;
      let shown = 0;
      rows.forEach((r) => { const ok = (!st.dir || r.dataset.dir === st.dir) && (!st.cat || r.dataset.cat === st.cat); r.hidden = !ok; if (ok) shown++; });
      const key = { ord: (r) => +r.dataset.ord, 'pct-desc': (r) => -r.dataset.pct, 'pct-asc': (r) => +r.dataset.pct, 'price-desc': (r) => -r.dataset.price, 'price-asc': (r) => +r.dataset.price }[st.sort];
      [...rows].sort((a, b) => key(a) - key(b) || a.dataset.ord - b.dataset.ord).forEach((r) => tb.appendChild(r));
      out.textContent = shown === rows.length ? `${rows.length}가지` : `${rows.length}가지 중 ${shown}가지`;
      empty.hidden = shown > 0;
      setURL({ dir: st.dir, cat: st.cat, sort: st.sort === 'ord' ? '' : st.sort });
    }
    dirs.forEach((b) => b.addEventListener('click', () => { st.dir = b.dataset.pDir; apply(); }));
    cSel.addEventListener('change', () => { st.cat = cSel.value; apply(); });
    sSel.addEventListener('change', () => { st.sort = sSel.value; apply(); });
    apply();
  }

  // ───── 장보기 목록 화면 ─────
  const listBox = $('[data-list]');
  function renderList() {
    if (!listBox) return;
    const sheet = $('[data-sheet]'), empty = $('[data-list-empty]');
    const has = cart.length > 0;
    sheet.hidden = !has; empty.hidden = has;
    $$('[data-print], [data-printview], [data-clear-list]').forEach((b) => { b.disabled = !has; });
    let total = 0, h = '';
    for (const z of J.zones) {
      const rows = cart.filter((x) => STORE[x.s].zone === z.id).sort((a, b) => STORE[a.s].no.localeCompare(STORE[b.s].no, 'ko'));
      if (!rows.length) continue;
      h += `<div class="lzone"><h3>${z.mark} ${esc(z.name)}</h3>`;
      for (const x of rows) {
        const s = STORE[x.s], it = J.items[x.i], p = priceOf(x.s, x.i), sum = p * x.q;
        total += sum;
        const id = `chk-${x.s}-${x.i}`;
        h += `<div class="lrow${x.done ? ' done' : ''}" data-row="${x.s}|${x.i}"><input type="checkbox" id="${id}" data-done${x.done ? ' checked' : ''} aria-label="${esc(it.name)} 샀음"><label class="l-name" for="${id}">${esc(it.name)}<span class="l-store">${s.no} ${esc(s.name)}</span></label><span class="l-unit">${esc(it.unit)} ${n(p)}원</span><span class="qty"><button type="button" data-q="-1" aria-label="${esc(it.name)} 하나 빼기">−</button><output aria-label="${esc(it.name)} 수량">${x.q}</output><button type="button" data-q="1" aria-label="${esc(it.name)} 하나 더">+</button></span><span class="l-sum">${n(sum)}<span class="won">원</span></span><button class="l-del" type="button" data-del aria-label="${esc(it.name)} 빼기">빼기</button></div>`;
      }
      h += '</div>';
    }
    listBox.innerHTML = h;
    $('[data-total]').innerHTML = `${n(total)}<span class="won">원</span>`;
  }
  if (listBox) {
    renderList();
    const find = (el) => { const [s, i] = el.closest('[data-row]').dataset.row.split('|'); return cart.find((x) => x.s === s && x.i === i); };
    listBox.addEventListener('click', (e) => {
      const q = e.target.closest('[data-q]'), del = e.target.closest('[data-del]');
      if (!q && !del) return;
      const x = find(e.target);
      const key = e.target.closest('[data-row]').dataset.row;
      if (q) {
        x.q = Math.max(1, Math.min(99, x.q + Number(q.dataset.q)));
        save(cart); syncCart(); renderList();
        const b = $(`[data-row="${key}"] [data-q="${q.dataset.q}"]`, listBox); b && b.focus();
      } else {
        cart = cart.filter((y) => y !== x); save(cart); syncCart(); renderList();
        say(`${J.items[x.i].name} 뺌 — 목록 ${cart.length}가지`);
        const next = $('[data-del]', listBox) || $('.list-empty a'); next && next.focus();
      }
    });
    listBox.addEventListener('change', (e) => {
      if (!e.target.matches('[data-done]')) return;
      const x = find(e.target); x.done = e.target.checked; save(cart);
      e.target.closest('.lrow').classList.toggle('done', x.done);
    });
    $('[data-print]').addEventListener('click', () => window.print());
    const pv = $('[data-printview]');
    const setPV = (on) => { document.body.classList.toggle('printview', on); pv.setAttribute('aria-pressed', String(on)); pv.textContent = on ? '보통 화면' : '인쇄용 화면'; setURL({ view: on ? 'print' : '' }); };
    pv.addEventListener('click', () => setPV(!document.body.classList.contains('printview')));
    if (params.get('view') === 'print') setPV(true);
    const clr = $('[data-clear-list]');
    let armed = false;
    clr.addEventListener('click', () => {
      if (!armed) { armed = true; clr.textContent = '한 번 더 누르면 비움'; setTimeout(() => { armed = false; clr.textContent = '목록 비우기'; }, 4000); return; }
      armed = false; clr.textContent = '목록 비우기';
      cart = []; save(cart); syncCart(); renderList(); say('목록을 비웠다');
      const a = $('.list-empty a'); a && a.focus();
    });
  }

  syncCart();
})();
