// 연귀표구사 — 화면 동작. 데이터는 data.js(window.YW), 계산은 calc.js(window.YWCALC)
(function () {
  'use strict';
  const D = window.YW, C = window.YWCALC;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const setParams = (obj) => {
    const p = new URLSearchParams(location.search);
    Object.entries(obj).forEach(([k, v]) => (v === null || v === '' || v === undefined ? p.delete(k) : p.set(k, v)));
    const q = p.toString();
    try { history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch (e) { /* file:// 에서 막히면 둔다 */ }
  };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const num = (v) => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : NaN; };
  const rel = page === 'home' ? '' : '../';
  const link = (id, q = '') => rel + (id === 'home' ? 'index.html' : id + '/index.html') + q;

  // ── 메뉴(좁은 화면) ──
  const base = $('.base'), menuBtn = $('.menu-btn');
  function closeMenu(focus) {
    base.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('locked');
    if (focus) menuBtn.focus();
  }
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    if (!open) return closeMenu(false);
    base.classList.add('open'); menuBtn.setAttribute('aria-expanded', 'true'); document.body.classList.add('locked');
    const first = $('.base-list a'); if (first) first.focus();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && base.classList.contains('open')) closeMenu(true); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1240 && base.classList.contains('open')) closeMenu(false); });

  // ── 대화상자 ──
  let opener = null;
  function openDlg(dlg, from) {
    opener = from || document.activeElement;
    if (!dlg.open) dlg.showModal();
    const f = $('h2', dlg); f.setAttribute('tabindex', '-1'); f.focus();
  }
  function closeDlg(dlg) { if (dlg.open) dlg.close(); }
  $$('dialog').forEach((dlg) => {
    dlg.addEventListener('close', () => { if (opener && document.contains(opener)) opener.focus(); dlg.dispatchEvent(new Event('closed')); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) closeDlg(dlg); });
    $$('.dlg-close', dlg).forEach((b) => b.addEventListener('click', () => closeDlg(dlg)));
    dlg.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('a[href], button:not([disabled]), input, select, textarea', dlg).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === $('h2', dlg))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  });

  // ── 탭(화살표·Home·End) ──
  function tabs(list, onSelect) {
    const ts = $$('[role="tab"]', list);
    const select = (t, focus) => {
      ts.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
      if (focus) t.focus();
      onSelect(t);
    };
    ts.forEach((t, i) => {
      t.addEventListener('click', () => select(t, false));
      t.addEventListener('keydown', (e) => {
        let j = null;
        if (e.key === 'ArrowRight') j = (i + 1) % ts.length;
        else if (e.key === 'ArrowLeft') j = (i - 1 + ts.length) % ts.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = ts.length - 1;
        if (j !== null) { e.preventDefault(); select(ts[j], true); }
      });
    });
    return select;
  }

  // ── 몰딩 견본 ──
  if (page === 'frames') {
    const keys = ['material', 'tone', 'width'];
    const state = { material: new Set(), tone: new Set(), width: new Set() };
    keys.forEach((k) => (params.get(k) || '').split(',').filter(Boolean).forEach((v) => state[k].add(v)));
    const sortSel = $('#f-sort');
    if ([...sortSel.options].some((o) => o.value === params.get('sort'))) sortSel.value = params.get('sort');
    const list = $('#mlist'), items = $$('#mlist > li');
    const W = Object.fromEntries(D.WIDTHS.map((w) => [w.id, w]));
    function apply(push = true) {
      $$('.chips[data-key]').forEach((fs) => $$('.chip', fs).forEach((b) => b.setAttribute('aria-pressed', state[fs.dataset.key].has(b.dataset.v))));
      let n = 0;
      items.forEach((li) => {
        const w = +li.dataset.w;
        const ok = (!state.material.size || state.material.has(li.dataset.material))
          && (!state.tone.size || state.tone.has(li.dataset.tone))
          && (!state.width.size || [...state.width].some((id) => w >= W[id].min && w <= W[id].max));
        li.hidden = !ok; if (ok) n++;
      });
      const s = sortSel.value, desc = s.startsWith('-'), key = s.replace('-', '');
      const sorted = [...items].sort((a, b) => {
        if (key === 'id') return a.dataset.id.localeCompare(b.dataset.id);
        const d = (+a.dataset[key] - +b.dataset[key]) * (desc ? -1 : 1);
        return d || a.dataset.id.localeCompare(b.dataset.id);
      });
      sorted.forEach((li) => list.appendChild(li));
      $('#f-count').textContent = `${n}종`;
      $('#f-empty').hidden = n > 0;
      if (push) setParams({ material: [...state.material].join(','), tone: [...state.tone].join(','), width: [...state.width].join(','), sort: s === 'id' ? '' : s });
    }
    $$('.chips[data-key] .chip').forEach((b) => b.addEventListener('click', () => {
      const set = state[b.closest('[data-key]').dataset.key];
      set.has(b.dataset.v) ? set.delete(b.dataset.v) : set.add(b.dataset.v);
      apply();
    }));
    sortSel.addEventListener('change', () => apply());
    const clear = () => { keys.forEach((k) => state[k].clear()); sortSel.value = 'id'; apply(); };
    $('#f-clear').addEventListener('click', clear);
    $('#f-clear2').addEventListener('click', () => { clear(); $('#f-count').focus?.(); });
    $('#filters').addEventListener('submit', (e) => e.preventDefault());
    apply(false);

    // 대화상자
    const dlg = $('#m-dlg');
    const MAT = Object.fromEntries(D.MATERIALS.map((m) => [m.id, m.name]));
    const TONE = Object.fromEntries(D.TONES.map((m) => [m.id, m.name]));
    let cur = null;
    function fill(id) {
      const m = D.MOULDINGS.find((x) => x.id === id); if (!m) return false;
      cur = id;
      $('#m-dlg-id').textContent = `${m.id} · ${MAT[m.mat]} · ${TONE[m.tone]}`;
      $('#m-dlg-title').textContent = m.name;
      $('#m-dlg-svg').innerHTML = profileBig(m);
      $('#m-dlg-facts').innerHTML = [
        ['단면', D.PROFILES[m.profile]], ['폭 × 높이', `${m.w} × ${m.d} mm`], ['턱 깊이', `${m.r} mm`],
        ['값', `1 m당 ${C.won(m.price)}`], ['무게', `1 m당 ${m.g} g`], ['완성', m.days ? `영업일 ${5 + m.days}일` : '영업일 5일'],
      ].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
      $('#m-dlg-note').textContent = m.note + '.';
      $('#m-dlg-calc').href = link('calculator', `?m=${m.id}`);
      return true;
    }
    function profileBig(m) {
      const { w, d, r } = m; const lip = Math.min(6, w * 0.4);
      let top;
      if (m.profile === 'round') top = `M0 ${d * 0.32} Q${w * 0.35} ${-d * 0.08} ${w} ${d * 0.22}`;
      else if (m.profile === 'step') top = `M0 0 L${w * 0.45} 0 L${w * 0.45} ${d * 0.16} L${w * 0.74} ${d * 0.16} L${w * 0.74} ${d * 0.3} L${w} ${d * 0.3}`;
      else if (m.profile === 'reverse') top = `M0 0 L${w} ${d * 0.38}`;
      else top = `M0 0 L${w} 0`;
      const p = `${top} L${w} ${d - r} L${w - lip} ${d - r} L${w - lip} ${d} L0 ${d} Z`;
      return `<svg class="profile profile-big" viewBox="-14 -12 80 66" role="img" aria-label="${esc(m.name)} 단면, 폭 ${w} mm, 높이 ${d} mm, 턱 ${r} mm"><path class="pf" d="${p}" style="fill:${m.hex}"/><g class="dim"><path d="M0 -6 H${w} M0 -8 V-4 M${w} -8 V-4"/><text x="${w / 2}" y="-8" text-anchor="middle">${w}</text><path d="M-6 0 V${d} M-8 0 H-4 M-8 ${d} H-4"/><text x="-8" y="${d / 2 + 1.5}" text-anchor="end">${d}</text><path d="M${w + 4} ${d - r} V${d} M${w + 2} ${d - r} H${w + 6} M${w + 2} ${d} H${w + 6}"/><text x="${w + 7}" y="${d - r / 2 + 1.5}">턱 ${r}</text></g></svg>`;
    }
    const sortedVisible = () => $$('#mlist > li').filter((li) => !li.hidden).map((li) => li.dataset.id);
    function step(dir) {
      const v = sortedVisible(); if (!v.length) return;
      const i = v.indexOf(cur); const id = v[(i + dir + v.length) % v.length];
      fill(id); setParams({ m: id });
    }
    $$('[data-open]').forEach((b) => b.addEventListener('click', () => { fill(b.dataset.open); setParams({ m: b.dataset.open }); openDlg(dlg, b); }));
    $$('[data-step]', dlg).forEach((b) => b.addEventListener('click', () => step(+b.dataset.step)));
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
    dlg.addEventListener('closed', () => setParams({ m: null }));
    if (params.get('m') && fill(params.get('m'))) openDlg(dlg, $(`[data-open="${params.get('m')}"]`));
  }

  // ── 액자 계산 ──
  if (page === 'calculator') {
    const f = {
      w: $('#c-w'), h: $('#c-h'), mat: $('#c-mat'), mc: $('#c-mc'), bottom: $('#c-bottom'), m: $('#c-m'), g: $('#c-g'),
      series: $('#c-series'), no: $('#c-no'), dir: $('#c-dir'),
    };
    const modeR = $$('input[name="mode"]');
    const fillNo = (sid, keep) => {
      f.no.innerHTML = D.SIZES[sid].map(([n, a, b]) => `<option value="${n}">${typeof n === 'number' ? n + '호' : n} · ${a.toFixed(1)} × ${b.toFixed(1)}</option>`).join('');
      if (keep && [...f.no.options].some((o) => o.value === String(keep))) f.no.value = String(keep);
    };
    // 복원
    const p = params;
    if (p.get('series') && D.SIZES[p.get('series')]) {
      modeR.find((r) => r.value === 'ho').checked = true; f.series.value = p.get('series'); fillNo(p.get('series'), p.get('no'));
      if (p.get('dir') === 'h') f.dir.value = 'h';
    } else fillNo('F', 10);
    if (p.has('w')) f.w.value = p.get('w');
    if (p.has('h')) f.h.value = p.get('h');
    if (p.has('mat')) f.mat.value = p.get('mat');
    if (p.has('bottom')) f.bottom.checked = p.get('bottom') === '1';
    if (p.get('mc') && D.MATS.some((m) => m.id === p.get('mc'))) f.mc.value = p.get('mc');
    if (p.get('m') && D.MOULDINGS.some((m) => m.id === p.get('m'))) f.m.value = p.get('m');
    if (p.get('g') && (p.get('g') === 'none' || D.GLAZING.some((g) => g.id === p.get('g')))) f.g.value = p.get('g');

    const err = $('#c-err');
    const mode = () => modeR.find((r) => r.checked).value;
    function size() {
      if (mode() === 'ho') {
        const row = D.SIZES[f.series.value].find(([n]) => String(n) === f.no.value);
        const [, a, b] = row;
        return f.dir.value === 'h' ? { w: a, h: b } : { w: b, h: a };
      }
      return { w: num(f.w.value), h: num(f.h.value) };
    }
    let first = true;
    function run() {
      $('#row-cm').hidden = mode() !== 'cm'; $('#row-ho').hidden = mode() !== 'ho';
      const { w, h } = size(); const mat = num(f.mat.value);
      const bad = [];
      if (!(w >= 5 && w <= 200)) bad.push('가로는 5~200 cm 사이로 넣는다.');
      if (!(h >= 5 && h <= 200)) bad.push('세로는 5~200 cm 사이로 넣는다.');
      if (!(mat >= 0 && mat <= 10)) bad.push('매트 폭은 0~10 cm 사이로 넣는다.');
      f.w.setAttribute('aria-invalid', mode() === 'cm' && !(w >= 5 && w <= 200));
      f.h.setAttribute('aria-invalid', mode() === 'cm' && !(h >= 5 && h <= 200));
      f.mat.setAttribute('aria-invalid', !(mat >= 0 && mat <= 10));
      err.hidden = !bad.length; err.textContent = bad.join(' ');
      if (bad.length) {
        ['#o-in', '#o-out', '#o-len', '#o-kg', '#o-due', '#o-total'].forEach((s) => ($(s).textContent = ''));
        $$('#bill li:not(.bill-total) strong').forEach((s) => (s.textContent = ''));
        $('#pv-art-t').textContent = ''; $('#pv-cap').textContent = '치수 오류 · 미리보기 없음';
        return;
      }
      const q = C.quote({ w, h, mat, bottom: f.bottom.checked, m: f.m.value, g: f.g.value === 'none' ? null : f.g.value });
      $('#o-in').textContent = `${C.cm(q.iw)} × ${C.cm(q.ih)} cm`;
      $('#o-out').textContent = `${C.cm(q.ow)} × ${C.cm(q.oh)} cm`;
      $('#o-len').textContent = `${C.cm(q.lenCm)} cm`;
      $('#o-kg').textContent = `약 ${q.kg.toFixed(1)} kg`;
      $('#o-due').textContent = `${C.md(q.due)} · 영업일 ${q.days}일`;
      $('#bill').innerHTML = q.lines.map((l) => `<li><span>${l.k}</span><small>${esc(l.note)}</small><strong>${C.won(l.v)}</strong></li>`).join('')
        + `<li class="bill-total"><span>합계</span><small>부가세 포함</small><strong id="o-total">${C.won(q.total)}</strong></li>`;
      // 미리보기(실척 비례)
      const box = $('#pv-box'); const bw = box.clientWidth * 0.94, bh = box.clientHeight * 0.94;
      const k = Math.min(bw / q.ow, bh / q.oh);
      const mc = D.MATS.find((m) => m.id === f.mc.value);
      const W0 = box.clientWidth, H0 = box.clientHeight;
      const ox = (W0 - q.ow * k) / 2, oy = (H0 - q.oh * k) / 2;
      const put = (el, x, y, w2, h2) => { el.style.transform = `translate(${x}px, ${y}px) scale(${w2}, ${h2})`; };
      const fw = Math.max(1, q.fw * k);
      put($('#pv-frame'), ox, oy, q.ow * k, q.oh * k); $('#pv-frame').style.backgroundColor = q.M.hex;
      put($('#pv-mat'), ox + fw, oy + fw, q.iw * k, q.ih * k); $('#pv-mat').style.backgroundColor = mc.hex;
      put($('#pv-art'), ox + fw + q.mat * k, oy + fw + q.mat * k, w * k, h * k);
      $('#pv-art-t').style.transform = `translate(-50%, calc(-50% - ${(q.extra * k) / 2}px))`;
      $('#pv-art-t').textContent = `${C.cm(w)} × ${C.cm(h)}`;
      $('#pv-cap').textContent = `바깥 ${C.cm(q.ow)} × ${C.cm(q.oh)} cm · 실제 비율`;
      // 주소·다음 화면 링크
      const state = mode() === 'ho'
        ? { series: f.series.value, no: f.no.value, dir: f.dir.value === 'h' ? 'h' : null, w: null, h: null }
        : { w: C.cm(w), h: C.cm(h), series: null, no: null, dir: null };
      const common = { mat: String(mat), bottom: f.bottom.checked ? '1' : '0', mc: f.mc.value, m: f.m.value, g: f.g.value };
      if (!first) setParams({ ...state, ...common });
      first = false;
      const oq = new URLSearchParams({ w: C.cm(w), h: C.cm(h), ...common }).toString();
      $('#to-order').href = link('order', '?' + oq);
      $('#to-hang').href = link('hanging', `?h=${C.cm(q.oh)}&kg=${q.kg.toFixed(1)}`);
    }
    $('#calc').addEventListener('input', run);
    $('#calc').addEventListener('change', (e) => { if (e.target === f.series) fillNo(f.series.value); run(); });
    $('#calc').addEventListener('submit', (e) => e.preventDefault());
    window.addEventListener('resize', run);
    run();
  }

  // ── 호수 ──
  if (page === 'sizes') {
    const list = $('#sizes-list'), nest = $('#nest');
    let series = D.SIZES[params.get('series')] ? params.get('series') : 'F';
    let picked = params.get('no');
    function draw() {
      const rows = D.SIZES[series];
      const max = Math.max(...rows.map((r) => r[1]));
      const sc = 164 / max;
      nest.innerHTML = rows.map(([n, a, b]) => `<rect data-no="${n}" x="1" y="${165 - b * sc}" width="${a * sc}" height="${b * sc}"/>`).join('') + '<text id="nest-t" x="4" y="10"></text>';
      list.innerHTML = rows.map(([n, a, b]) => `<li class="size-li"><button type="button" class="size-row" data-no="${n}" aria-pressed="false">${typeof n === 'number' ? n + '호' : esc(n)}</button><span class="size-d">${a.toFixed(1)} × ${b.toFixed(1)} cm</span></li>`).join('');
      const s = D.SERIES.find((x) => x.id === series);
      $('#series-desc').textContent = s.desc + '.';
      $('#nest-cap').textContent = `${s.full} ${series === 'paper' ? 'A·B 판형과 사진' : '1~100호'} · 실제 비율`;
      nest.setAttribute('aria-label', `${s.full} 크기를 왼쪽 아래 모서리에 맞춰 겹친 사각형`);
      $('#p-sizes').setAttribute('aria-labelledby', 't-' + series);
      $$('.size-row', list).forEach((b) => b.addEventListener('click', () => { picked = b.getAttribute('aria-pressed') === 'true' ? null : b.dataset.no; mark(); setParams({ series: series === 'F' ? null : series, no: picked }); }));
      mark();
    }
    function mark() {
      const ok = picked && D.SIZES[series].some(([n]) => String(n) === picked);
      if (!ok) picked = null;
      $$('.size-row', list).forEach((b) => b.setAttribute('aria-pressed', b.dataset.no === picked));
      $$('rect', nest).forEach((r) => r.classList.toggle('on', r.dataset.no === picked));
      nest.classList.toggle('has-pick', !!picked);
      const row = picked && D.SIZES[series].find(([n]) => String(n) === picked);
      $('#nest-t').textContent = row ? `${typeof row[0] === 'number' ? row[0] + '호' : row[0]} ${row[1].toFixed(1)} × ${row[2].toFixed(1)} cm` : '';
      $('#size-calc').href = link('calculator', row ? `?series=${series}&no=${encodeURIComponent(picked)}` : '');
    }
    const select = tabs($('.tabs'), (t) => { const s = t.dataset.s; if (s !== series) { series = s; picked = null; } draw(); setParams({ series: series === 'F' ? null : series, no: picked }); });
    const t0 = $(`[role="tab"][data-s="${series}"]`);
    if (series !== 'F') select(t0, false); else draw();
  }

  // ── 유리 ──
  if (page === 'glazing') {
    let picks = (params.get('g') || 'clear,museum').split(',').filter((id) => D.GLAZING.some((g) => g.id === id)).slice(0, 2);
    const rows = [['trans', '가시광 투과율', '%'], ['uv', '자외선 차단', '%'], ['refl', '반사율', '%'], ['kg', '무게', 'kg/㎡'], ['price', '값', ''], ['days', '더 걸리는 날', '일']];
    function draw(push) {
      $$('#glz-pick .chip').forEach((b) => b.setAttribute('aria-pressed', picks.includes(b.dataset.g)));
      $('#cmp').innerHTML = picks.length ? picks.map((id) => {
        const g = D.GLAZING.find((x) => x.id === id);
        return `<div class="cmp-col"><h3>${esc(g.name)} ${g.thick} mm</h3><dl>${rows.map(([k, label, u]) => `<div><dt>${label}</dt><dd>${k === 'price' ? C.won(g[k]) : g[k] + ' ' + u}${['trans', 'uv'].includes(k) ? `<span class="bar" style="--v:${g[k]}%"></span>` : ''}</dd></div>`).join('')}</dl><p>${esc(g.note)}.</p></div>`;
      }).join('') : '<p>견줄 유리를 고르면 여기에 놓인다.</p>';
      if (push) setParams({ g: picks.join(',') });
    }
    $$('#glz-pick .chip').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.g;
      if (picks.includes(id)) picks = picks.filter((x) => x !== id);
      else { picks.push(id); if (picks.length > 2) picks.shift(); }
      draw(true);
    }));
    draw(false);
  }

  // ── 매트 ──
  if (page === 'mats') {
    const frame = $('.framed-mat .framed-in'), cap = $('.framed-mat figcaption span:last-child');
    let tone = params.get('tone') && D.MAT_TONES.some((t) => t.id === params.get('tone')) ? params.get('tone') : 'all';
    let mat = D.MATS.some((m) => m.id === params.get('mat')) ? params.get('mat') : 'misaek';
    function draw(push) {
      $$('#mat-tone .chip').forEach((b) => b.setAttribute('aria-pressed', b.dataset.t === tone));
      $$('#swatches li').forEach((li) => (li.hidden = tone !== 'all' && li.dataset.tone !== tone));
      $$('.sw').forEach((b) => b.setAttribute('aria-pressed', b.dataset.mat === mat));
      const m = D.MATS.find((x) => x.id === mat);
      frame.style.setProperty('--matc', m.hex);
      $('#mat-now').textContent = m.name;
      cap.textContent = cap.textContent.replace(/매트 [^·]+·/, `매트 ${m.name} ·`);
      if (push) setParams({ tone: tone === 'all' ? null : tone, mat: mat === 'misaek' ? null : mat });
    }
    $$('#mat-tone .chip').forEach((b) => b.addEventListener('click', () => { tone = b.dataset.t; draw(true); }));
    $$('.sw').forEach((b) => b.addEventListener('click', () => { mat = b.dataset.mat; draw(true); }));
    draw(false);
  }

  // ── 거는 법 ──
  if (page === 'hanging') {
    const panels = $$('[role="tabpanel"][id^="wp-"]');
    let wall = D.WALLS.some((w) => w.id === params.get('wall')) ? params.get('wall') : 'concrete';
    const select = tabs($('.tabs'), (t) => { wall = t.id.slice(2); panels.forEach((p) => (p.hidden = p.id !== 'wp-' + wall)); run(); setParams({ wall: wall === 'concrete' ? null : wall }); });
    if (params.has('h')) $('#h-h').value = params.get('h');
    if (params.has('kg')) $('#h-kg').value = params.get('kg');
    function run() {
      const H = num($('#h-h').value), d = num($('#h-d').value), c = num($('#h-c').value), kg = num($('#h-kg').value);
      const bad = [];
      if (!(H >= 10 && H <= 200)) bad.push('액자 높이는 10~200 cm 사이로 넣는다.');
      if (!(d >= 0 && d <= 50 && d < H)) bad.push('줄 꼭대기에서 윗변까지는 0~50 cm이고 액자 높이보다 짧아야 한다.');
      if (!(c >= 80 && c <= 200)) bad.push('가운데 높이는 80~200 cm 사이로 넣는다.');
      if (!(kg > 0 && kg <= 60)) bad.push('무게는 0.1~60 kg 사이로 넣는다.');
      $('#h-err').hidden = !bad.length; $('#h-err').textContent = bad.join(' ');
      ['#h-h', '#h-d', '#h-c', '#h-kg'].forEach((s, i) => $(s).setAttribute('aria-invalid', [!(H >= 10 && H <= 200), !(d >= 0 && d <= 50 && d < H), !(c >= 80 && c <= 200), !(kg > 0 && kg <= 60)][i]));
      if (bad.length) { $('#h-nail').textContent = '계산 안 됨'; $('#h-tool').textContent = ''; return; }
      const nail = c + H / 2 - d;
      $('#h-nail').textContent = `${C.cm(nail)} cm`;
      const W = D.WALLS.find((w) => w.id === wall);
      const one = W.items.find((t) => t.load >= kg);
      const two = W.items.find((t) => t.load * 2 >= kg);
      $('#h-tool').textContent = one ? `${W.name} · ${one.tool} 한 개` : two ? `${W.name} · ${two.tool} 두 개 · 폭의 3분의 1 간격` : `${W.name}에는 ${kg} kg을 걸 도구가 없다. 상담이 필요하다.`;
      // 도해(바닥 y=260, 1 cm = 1 단위)
      const fy = 260 - (c + H / 2), fw = Math.min(160, H * 1.1);
      const fr = $('#ws-frame'); fr.setAttribute('x', 100 - fw / 2); fr.setAttribute('y', fy); fr.setAttribute('width', fw); fr.setAttribute('height', H);
      const ny = 260 - nail;
      $('#ws-nail').setAttribute('cy', ny);
      $('#ws-wire').setAttribute('d', `M${100 - fw / 2 + 3} ${fy + H / 3} L100 ${ny} L${100 + fw / 2 - 3} ${fy + H / 3}`);
      $('#ws-cl').setAttribute('d', `M0 ${260 - c} H200`);
      $('#ws-dim').setAttribute('d', `M${100 + fw / 2 + 12} ${ny} V260`);
      const t1 = $('#ws-t1'); t1.setAttribute('x', Math.min(150, 100 + fw / 2 + 14)); t1.setAttribute('y', (ny + 260) / 2); t1.textContent = `못 ${C.cm(nail)}`;
      const t2 = $('#ws-t2'); t2.setAttribute('y', 260 - c - 3); t2.textContent = `가운데 ${c}`;
    }
    $('#hcalc').addEventListener('input', run);
    $('#hcalc').addEventListener('submit', (e) => e.preventDefault());
    if (wall !== 'concrete') select($('#w-' + wall), false); else run();
  }

  // ── 주문 ──
  if (page === 'order') {
    const p = params; let q = null;
    const w = num(p.get('w')), h = num(p.get('h'));
    if (w >= 5 && w <= 200 && h >= 5 && h <= 200 && D.MOULDINGS.some((m) => m.id === p.get('m'))) {
      q = C.quote({ w, h, mat: num(p.get('mat')) || 0, bottom: p.get('bottom') === '1', m: p.get('m'), g: p.get('g') === 'none' ? null : p.get('g') });
      const mc = D.MATS.find((m) => m.id === p.get('mc'));
      $('#ord-q').innerHTML = `작품 ${C.cm(w)} × ${C.cm(h)} cm · ${esc(q.M.id + ' ' + q.M.name)} · 매트 ${q.mat ? C.cm(q.mat) + ' cm' + (mc ? ' ' + esc(mc.name) : '') : '없음'} · ${q.G ? esc(q.G.name) : '유리 없음'}<br>바깥 ${C.cm(q.ow)} × ${C.cm(q.oh)} cm · <strong class="big-inline">${C.won(q.total)}</strong> · 완성 ${C.md(q.due)}`;
      $('#ord-sum .link').textContent = '계산 고치기';
      $('#ord-sum .link').href = link('calculator', location.search);
    }
    const days = q ? q.days : D.RATES.baseDays;
    const first = C.bizDue(days);
    const opts = C.openDays(first, 10);
    $('#o-day').innerHTML = opts.map((d) => `<option value="${C.iso(d)}">${C.md(d)}</option>`).join('');
    const form = $('#order'), sum = $('#err-sum'), dlg = $('#o-dlg');
    const fields = [
      { id: 'kind', el: () => $('input[name="kind"]'), ok: () => !!$('input[name="kind"]:checked'), msg: '작품 종류를 고른다.', e: '#e-kind' },
      { id: 'name', el: () => $('#o-name'), ok: () => $('#o-name').value.trim().length >= 2, msg: '이름을 두 글자 이상 쓴다.', e: '#e-name' },
      { id: 'phone', el: () => $('#o-phone'), ok: () => /^01[016789]\d{7,8}$/.test($('#o-phone').value.replace(/[\s-]/g, '')), msg: '휴대전화는 010으로 시작하는 10~11자리로 쓴다.', e: '#e-phone' },
      { id: 'agree', el: () => $('#o-agree'), ok: () => $('#o-agree').checked, msg: '연락처 사용에 동의해야 접수된다.', e: '#e-agree' },
    ];
    function check() {
      const bad = fields.filter((f) => !f.ok());
      fields.forEach((f) => {
        const e = $(f.e); const isBad = bad.includes(f);
        e.hidden = !isBad; e.textContent = isBad ? f.msg : '';
        if (f.id !== 'kind') f.el().setAttribute('aria-invalid', isBad);
      });
      return bad;
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = check();
      if (bad.length) {
        sum.hidden = false;
        $('#err-list').innerHTML = bad.map((f) => `<li><a href="#${f.id === 'kind' ? 'f-kind' : f.id === 'agree' ? 'o-agree' : 'o-' + f.id}">${f.msg}</a></li>`).join('');
        $$('#err-list a').forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); const t = document.getElementById(a.getAttribute('href').slice(1)); const inp = t.matches('fieldset') ? $('input', t) : t; inp.focus(); }));
        sum.focus();
        return;
      }
      sum.hidden = true;
      const how = $('input[name="how"]:checked').value === 'visit' ? '공방에서 찾기' : '배달 · 1만 원';
      $('#o-dlg-facts').innerHTML = [
        ['작품', $('input[name="kind"]:checked').value], ['액자', q ? `${C.cm(q.ow)} × ${C.cm(q.oh)} cm · ${C.won(q.total)}` : '공방에서 재고 값 안내'],
        ['찾는 날', $('#o-day').selectedOptions[0].textContent + ' ' + D.HOURS.pickupFrom + '부터'], ['찾는 방법', how],
        ['이름', $('#o-name').value.trim()], ['휴대전화', $('#o-phone').value.trim()],
      ].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
      openDlg(dlg, form.querySelector('button[type="submit"]'));
    });
    $('#o-back').addEventListener('click', () => closeDlg(dlg));
    $('#o-ok').addEventListener('click', () => {
      const no = '1009-' + String(17 + ($('#o-name').value.length % 9)).padStart(3, '0');
      opener = null; closeDlg(dlg);
      form.hidden = true;
      $('#done-t').textContent = `접수 번호 ${no}. ${$('#o-day').selectedOptions[0].textContent} ${D.HOURS.pickupFrom}부터 찾을 수 있다.`;
      $('#done').hidden = false; $('#done').focus();
    });
    $('#again').addEventListener('click', () => { form.reset(); $('#done').hidden = true; form.hidden = false; fields.forEach((f) => { $(f.e).hidden = true; if (f.id !== 'kind') f.el().removeAttribute('aria-invalid'); }); $('#o-name').focus(); });
  }

  // ── 자주 묻는 것 ──
  if (page === 'faq') {
    let cat = D.FAQ_CATS.some((c) => c.id === params.get('cat')) ? params.get('cat') : 'all';
    function draw(push) {
      $$('#faq-cat .chip').forEach((b) => b.setAttribute('aria-pressed', b.dataset.c === cat));
      $$('#faq details').forEach((d) => (d.hidden = cat !== 'all' && d.dataset.cat !== cat));
      if (push) setParams({ cat: cat === 'all' ? null : cat });
    }
    $$('#faq-cat .chip').forEach((b) => b.addEventListener('click', () => { cat = b.dataset.c; draw(true); }));
    $$('#faq details').forEach((d) => d.addEventListener('toggle', () => { if (d.open) setParams({ open: d.id }); else if (params.get('open') === d.id || new URLSearchParams(location.search).get('open') === d.id) setParams({ open: null }); }));
    const o = params.get('open') && document.getElementById(params.get('open'));
    if (o && o.matches('#faq details')) { if (cat !== 'all' && o.dataset.cat !== cat) cat = 'all'; o.open = true; }
    draw(false);
  }
})();
