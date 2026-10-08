(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const params = new URLSearchParams(location.search);
  const setParams = (obj) => {
    const p = new URLSearchParams(location.search);
    for (const [k, v] of Object.entries(obj)) { if (v === '' || v == null || v === false) p.delete(k); else p.set(k, v); }
    const q = p.toString();
    try { history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch (e) { /* file: in some browsers */ }
  };
  const roll = (el, text) => {
    if (!el || el.textContent === String(text)) return;
    el.textContent = text;
    if (reduce.matches) return;
    el.classList.remove('is-new'); void el.offsetWidth; el.classList.add('is-new');
  };

  // ---------- menu ----------
  const btn = $('.menu-btn'), nav = $('#nav');
  if (btn && nav) {
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      btn.textContent = open ? 'Close' : 'Menu';
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); } });
    matchMedia('(min-width: 1241px)').addEventListener('change', (m) => { if (m.matches) set(false); });
  }

  // ---------- sheets: stick each one at the point its bottom meets the viewport bottom ----------
  const sheets = $$('.sheet');
  const stackMQ = matchMedia('(min-width: 1024px) and (min-height: 700px)');
  const layout = () => {
    for (const s of sheets) s.style.setProperty('--top', stackMQ.matches ? Math.min(0, innerHeight - s.offsetHeight) + 'px' : '0px');
    cover();
  };
  let ticking = false;
  function cover() {
    ticking = false;
    const on = stackMQ.matches && !reduce.matches;
    for (let i = 0; i < sheets.length; i++) {
      const next = sheets[i + 1] || $('.foot');
      let v = 0;
      if (on && next) {
        const t = next.getBoundingClientRect().top;
        v = Math.max(0, Math.min(1, 1 - t / innerHeight)) * 0.35;
      }
      sheets[i].style.setProperty('--cover', v.toFixed(3));
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(cover); } }, { passive: true });
  addEventListener('resize', layout);
  stackMQ.addEventListener('change', layout);
  if (document.fonts) document.fonts.ready.then(layout);
  addEventListener('load', layout);
  layout();
  const relayout = () => requestAnimationFrame(layout);

  // ---------- steppers ----------
  $$('.step').forEach((b) => b.addEventListener('click', () => {
    const inp = document.getElementById(b.dataset.for);
    const step = Number(inp.step) || 1;
    const v = (Number(inp.value) || 0) + step * Number(b.dataset.dir);
    const c = Math.min(Number(inp.max), Math.max(Number(inp.min), v));
    inp.value = Number.isInteger(step) ? String(Math.round(c)) : c.toFixed(1).replace(/\.0$/, '');
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  }));
  const val = (id) => { const el = document.getElementById(id); const n = Number(el.value); return Number.isFinite(n) && el.value !== '' ? n : NaN; };
  const restore = (form, keys) => keys.forEach((k) => {
    if (!params.has(k)) return;
    const el = form.elements[k]; if (!el) return;
    if (el.type === 'checkbox') el.checked = params.get(k) === '1';
    else if (el.tagName === 'SELECT') { if ([...el.options].some((o) => o.value === params.get(k))) el.value = params.get(k); }
    else el.value = params.get(k);
  });

  // ---------- tyre pressure ----------
  const pp = $('#pp');
  if (pp) {
    const SURF = { smooth: 1, worn: 0.93, gravel: 0.85, trail: 0.78 };
    const keys = ['rider', 'bike', 'width', 'surface', 'tubeless', 'hookless', 'max'];
    restore(pp, keys);
    const calc = () => {
      const rider = val('pp-rider'), bike = val('pp-bike'), width = val('pp-width'), max = val('pp-max');
      const warn = $('#pp-warn');
      const msgs = [];
      if ([rider, bike, width].some((n) => !(n > 0))) { warn.hidden = false; warn.textContent = 'Enter rider weight, bike weight and tyre width as numbers.'; return; }
      const lb = (rider + bike) * 2.20462;
      const f = SURF[pp.elements.surface.value] * (pp.elements.tubeless.checked ? 0.92 : 1);
      const at = (load) => Math.max(15, (153.6 * load / Math.pow(width, 1.5785) - 7.1685) * f);
      let rear = at(lb * 0.6), front = at(lb * 0.4);
      const limit = Math.min(max > 0 ? max : Infinity, pp.elements.hookless.checked ? 72 : Infinity);
      if (rear > limit) { msgs.push(`The rear works out at ${Math.round(rear)} psi, over the ${Math.round(limit)} psi limit${pp.elements.hookless.checked && limit === 72 ? ' for a hookless rim' : ' printed on the tyre'}. Shown at the limit: a wider tyre would let you run less.`); rear = limit; }
      if (front > limit) front = limit;
      if (width > 50 && pp.elements.surface.value === 'smooth') msgs.push('Tyres over 50 mm on smooth road: the formula runs low. Add 2–3 psi if the tyre squirms in corners.');
      roll($('#pp-rear'), String(Math.round(rear)));
      roll($('#pp-front'), String(Math.round(front)));
      $('#pp-rear-bar').textContent = (rear / 14.5038).toFixed(1) + ' bar';
      $('#pp-front-bar').textContent = (front / 14.5038).toFixed(1) + ' bar';
      warn.hidden = !msgs.length; warn.textContent = msgs.join(' ');
      setParams({ rider, bike, width, surface: pp.elements.surface.value === 'smooth' ? '' : pp.elements.surface.value, tubeless: pp.elements.tubeless.checked ? 1 : '', hookless: pp.elements.hookless.checked ? 1 : '', max: max === 100 ? '' : max });
    };
    pp.addEventListener('input', calc); pp.addEventListener('change', calc); pp.addEventListener('submit', (e) => e.preventDefault());
    calc();
  }

  // ---------- spoke length ----------
  const sp = $('#sp');
  if (sp) {
    const keys = ['erd', 'count', 'cross', 'hole', 'pcdl', 'pcdr', 'cfl', 'cfr'];
    restore(sp, keys);
    const calc = () => {
      const erd = val('sp-erd'), n = Number(sp.elements.count.value), x = Number(sp.elements.cross.value), hole = val('sp-hole');
      const sides = [['left', val('sp-pcdl'), val('sp-cfl')], ['right', val('sp-pcdr'), val('sp-cfr')]];
      const warn = $('#sp-warn');
      const theta = 720 * x / n;
      if ([erd, hole, ...sides.flatMap((s) => [s[1], s[2]])].some((v) => !(v > 0))) { warn.hidden = false; warn.textContent = 'Enter every measurement in millimetres.'; return; }
      if (theta > 90) {
        warn.hidden = false;
        warn.textContent = `${x}-cross with ${n} spokes puts the spoke at ${Math.round(theta)}° across the flange. Use ${Math.floor(n / 8)}-cross or fewer.`;
        roll($('#sp-left'), '—'); roll($('#sp-right'), '—');
        $('#sp-left-x').textContent = 'No valid length'; $('#sp-right-x').textContent = 'No valid length';
        setParams(Object.fromEntries(keys.map((k) => [k, sp.elements[k].value])));
        return;
      }
      const R = erd / 2, cos = Math.cos(theta * Math.PI / 180);
      for (const [side, pcd, a] of sides) {
        const r = pcd / 2;
        const L = Math.sqrt(a * a + r * r + R * R - 2 * r * R * cos) - hole / 2;
        const stock = Math.floor(L / 2) * 2;
        roll($(`#sp-${side}`), String(stock));
        $(`#sp-${side}-x`).textContent = `${L.toFixed(1)} mm worked out`;
      }
      warn.hidden = true; warn.textContent = '';
      setParams(Object.fromEntries(keys.map((k) => [k, sp.elements[k].value])));
    };
    sp.addEventListener('input', calc); sp.addEventListener('change', calc); sp.addEventListener('submit', (e) => e.preventDefault());
    calc();
  }

  // ---------- tyre and rim ----------
  const ty = $('#ty');
  if (ty) {
    restore(ty, ['rim', 'tyre']);
    const calc = () => {
      const rim = val('ty-rim'), tyre = val('ty-tyre');
      if (!(rim > 0) || !(tyre > 0)) { $('#ty-why').textContent = 'Enter both widths in millimetres.'; return; }
      const lo = Math.ceil(rim * 1.4), hi = Math.floor(rim * 2.2);
      $('#ty-range').textContent = `This rim takes ${lo} to ${hi} mm tyres.`;
      let v, why;
      if (tyre < lo) { v = 'Too narrow'; why = `A ${tyre} mm tyre on a ${rim} mm rim sits square and can roll off the bead. Go ${lo} mm or wider, or use a narrower rim.`; }
      else if (tyre > hi) { v = 'Too wide'; why = `A ${tyre} mm tyre on a ${rim} mm rim balloons and squirms at low pressure. Go ${hi} mm or narrower, or use a wider rim.`; }
      else { v = 'Fits'; const mid = (lo + hi) / 2; why = Math.abs(tyre - mid) <= (hi - lo) / 6 ? `A ${tyre} mm tyre sits in the middle of the range.` : tyre < mid ? `A ${tyre} mm tyre is at the narrow end. It will measure about ${Math.round(tyre + (rim - 19) * 0.4)} mm when fitted.` : `A ${tyre} mm tyre is at the wide end. Check frame clearance: 4 mm each side at least.`; }
      roll($('#ty-verdict'), v);
      $('#ty-why').textContent = why;
      setParams({ rim, tyre });
    };
    ty.addEventListener('input', calc); ty.addEventListener('submit', (e) => e.preventDefault());
    calc();
  }

  // ---------- generic list filter ----------
  function listFilter({ form, list, count, empty, clear, noun, test, chipAttr, extra }) {
    const f = $(form); if (!f) return;
    const items = $$(`${list} > li`);
    const chips = chipAttr ? $$(`[data-${chipAttr}]`, f).filter((b) => b.classList.contains('chip')) : [];
    let chip = '';
    const q = f.querySelector('input[type="search"]');
    const apply = () => {
      const term = q ? q.value.trim().toLowerCase() : '';
      let n = 0;
      for (const li of items) { const ok = test(li, term, chip); li.hidden = !ok; if (ok) n++; }
      $(count).textContent = `${n} ${n === 1 ? noun[0] : noun[1]}`;
      $(empty).hidden = n > 0;
      const p = {}; if (q) p.q = term; if (chipAttr) p[chipAttr === 'cat' ? 'cat' : 'topic'] = chip; if (extra) Object.assign(p, extra.params());
      setParams(p);
      relayout();
    };
    const setChip = (v) => { chip = v; chips.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset[chipAttr] === v))); };
    chips.forEach((b) => b.addEventListener('click', () => { setChip(b.dataset[chipAttr]); apply(); }));
    if (q) { q.addEventListener('input', apply); if (params.get('q')) q.value = params.get('q'); }
    f.addEventListener('submit', (e) => e.preventDefault());
    const key = chipAttr === 'cat' ? 'cat' : 'topic';
    if (chipAttr && chips.some((b) => b.dataset[chipAttr] === params.get(key))) setChip(params.get(key));
    if (extra) extra.init(apply);
    $(clear)?.addEventListener('click', () => { if (q) q.value = ''; setChip(''); if (extra) extra.reset(); apply(); (q || chips[0]).focus(); });
    apply();
  }
  listFilter({ form: '#pf', list: '#pf-list', count: '#pf-count', empty: '#pf-empty', clear: '#pf-clear', noun: ['job', 'jobs'], chipAttr: 'cat',
    test: (li, t, c) => (!c || li.dataset.cat === c) && (!t || li.dataset.name.includes(t)) });
  listFilter({ form: '#bf', list: '#bf-list', count: '#bf-count', empty: '#bf-empty', clear: '#bf-clear', noun: ['size', 'sizes'],
    test: (li, t) => !t || t.split(/\s+/).every((w) => li.dataset.q.includes(w.replace(/["”]/g, ''))) });
  const cfOpen = $('#cf-open');
  listFilter({ form: '#cf', list: '#cf-list', count: '#cf-count', empty: '#cf-empty', clear: '#cf-clear', noun: ['class', 'classes'], chipAttr: 'topic',
    test: (li, t, c) => (!c || li.dataset.topic === c) && (!cfOpen.checked || Number(li.dataset.left) > 0),
    extra: cfOpen && { init: (apply) => { cfOpen.checked = params.get('open') === '1'; cfOpen.addEventListener('change', apply); }, reset: () => { cfOpen.checked = false; }, params: () => ({ open: cfOpen.checked ? 1 : '' }) } });

  // ---------- booking ----------
  const bk = $('#bk');
  if (bk && window.DW) {
    const { SERVICES, ADDONS, SLOTS } = window.DW;
    const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const long = (iso) => { const d = new Date(iso + 'T12:00:00Z'); return `${DAY[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`; };
    const pre = params.get('service');
    if (pre) { const r = bk.querySelector(`input[name="service"][value="${CSS.escape(pre)}"]`); if (r) r.checked = true; }
    const wheelsBox = $('#g-wheels');
    const sum = () => {
      const s = SERVICES.find((x) => x.id === bk.elements.service.value);
      wheelsBox.hidden = !(s && s.per);
      let total = 0; const lines = [];
      if (s) { const w = s.per ? Number(bk.elements.wheels.value) : 1; total += s.price * w; lines.push(`${s.name}${s.per ? ` × ${w}` : ''} £${s.price * w}`); }
      $$('input[name="addon"]:checked', bk).forEach((c) => { const a = ADDONS.find((x) => x.id === c.value); total += a.price; lines.push(`${a.name} £${a.price}`); });
      roll($('#bk-total'), '£' + total);
      $('#bk-lines').textContent = lines.length ? lines.join(' · ') + '. Parts quoted after we see the bike.' : 'Choose a service.';
      return { s, total, lines };
    };
    bk.addEventListener('change', (e) => { sum(); if (e.target.name === 'service') { setParams({ service: e.target.value }); relayout(); } clearErr(e.target); });
    bk.addEventListener('input', (e) => clearErr(e.target));
    function clearErr(el) {
      const host = el.closest('fieldset.f-group') || el.closest('.opt-consent') || el;
      if (host.getAttribute('aria-invalid') === 'true') {
        host.removeAttribute('aria-invalid');
        const id = host.dataset.err && document.getElementById(host.dataset.err); if (id) id.remove();
        if (el !== host) el.removeAttribute('aria-invalid');
      }
    }
    sum();
    bk.addEventListener('submit', (e) => {
      e.preventDefault();
      $$('.f-err', bk).forEach((n) => n.remove());
      $$('[aria-invalid]', bk).forEach((n) => n.removeAttribute('aria-invalid'));
      $$('[aria-describedby]', bk).forEach((n) => { if (n.dataset.desc !== undefined) n.removeAttribute('aria-describedby'); });
      const errs = [];
      const flag = (host, focusEl, msg) => {
        const id = 'err-' + errs.length;
        const p = document.createElement('p'); p.className = 'f-err'; p.id = id; p.textContent = msg;
        host.setAttribute('aria-invalid', 'true'); host.dataset.err = id;
        if (host.tagName === 'FIELDSET') host.appendChild(p); else host.insertAdjacentElement('afterend', p);
        focusEl.setAttribute('aria-describedby', id); focusEl.dataset.desc = '';
        errs.push([focusEl, msg]);
      };
      const svc = bk.elements.service.value;
      if (!svc) flag($('#g-service'), bk.querySelector('input[name="service"]'), 'Choose a service.');
      const date = bk.elements.date.value;
      if (!date) flag($('#g-date'), bk.querySelector('input[name="date"]:not(:disabled)'), 'Choose a drop-off day with places left.');
      const bike = bk.elements.bike.value.trim();
      if (bike.length < 3) flag(bk.elements.bike, bk.elements.bike, 'Tell us the bike, for example “grey hybrid, Shimano gears”.');
      const name = bk.elements.name.value.trim();
      if (!name) flag(bk.elements.name, bk.elements.name, 'Enter your name.');
      const email = bk.elements.email.value.trim(), phone = bk.elements.phone.value.trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) flag(bk.elements.email, bk.elements.email, 'Enter an email address like name@example.com.');
      const digits = phone.replace(/[\s()+-]/g, '');
      if (!phone) flag(bk.elements.phone, bk.elements.phone, 'Enter a mobile number for the ready text.');
      else if (!/^\d{10,13}$/.test(digits)) flag(bk.elements.phone, bk.elements.phone, 'Enter a mobile number of 10 to 13 digits, like 07700 900 123.');
      if (!bk.elements.consent.checked) flag($('#g-consent'), bk.elements.consent, 'Tick to confirm you know about storage charges.');
      const box = $('#bk-errs');
      if (errs.length) {
        box.innerHTML = `<h3>${errs.length} ${errs.length === 1 ? 'thing' : 'things'} to fix</h3><ul>${errs.map(([el, m], i) => `<li><a href="#${el.id || 'bk'}" data-i="${i}">${m}</a></li>`).join('')}</ul>`;
        $$('a', box).forEach((a) => { a.addEventListener('click', (ev) => { ev.preventDefault(); errs[a.dataset.i][0].focus(); }); });
        box.hidden = false; relayout(); box.focus();
        return;
      }
      box.hidden = true;
      const { s, total, lines } = sum();
      const left = SLOTS.find(([d]) => d === date)[1];
      const done = $('#bk-done');
      done.innerHTML = `<h3>Not booked — nothing was sent</h3><p class="lede">This is a practice site. Here is what would have gone to the workshop.</p>
        <dl><div><dt>Service</dt><dd>${s.name}</dd></div><div><dt>Drop off</dt><dd>${long(date)}, before 10:00 (${left} ${left === 1 ? 'place' : 'places'} left that day)</dd></div><div><dt>Bike</dt><dd></dd></div><div><dt>Estimate</dt><dd>£${total} labour · ${lines.join(' · ')}</dd></div></dl>
        <p><button type="button" class="btn btn-line" id="bk-again">Change booking</button></p>`;
      done.querySelector('dl div:nth-child(3) dd').textContent = bike;
      bk.hidden = true; done.hidden = false; relayout(); done.focus();
      $('#bk-again').addEventListener('click', () => { done.hidden = true; bk.hidden = false; relayout(); bk.querySelector('input[name="service"]:checked, input[name="service"]').focus(); });
    });
  }
})();
