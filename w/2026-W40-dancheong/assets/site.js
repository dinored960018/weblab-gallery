// 단청 읽기 — 메뉴 · 도해 확대 · 도판 넘기기 · 탭 · 거르기 · 단계 넘기기
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // ── 모바일 메뉴 ───────────────────────────
  const burger = $('.burger');
  const nav = $('#nav');
  if (burger && nav) {
    const set = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      document.documentElement.classList.toggle('lock', open);
    };
    burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { set(false); burger.focus(); }
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) set(false); });
  }

  // ── 한 칸 전체도 ─────────────────────────
  const wrap = $('.bay-wrap');
  if (wrap) {
    const svg = $('.bay', wrap);
    const panel = $('#panel');
    const BOX = JSON.parse(wrap.dataset.boxes);
    const wideQ = matchMedia('(min-width: 901px)');
    // 좁은 화면에서는 기둥과 기둥 사이 한 칸만 보이게 시작한다
    const full = () => (wideQ.matches ? [0, 60, 1600, 940] : [240, 60, 1120, 940]);
    let FULL = full();
    let cur = FULL.slice();
    svg.setAttribute('viewBox', FULL.join(' '));
    wideQ.addEventListener('change', () => { FULL = full(); if (!active) setVB(FULL); });
    let active = null;
    let opener = null;
    let raf = 0;
    const wide = wideQ;

    const setVB = (v) => { cur = v; svg.setAttribute('viewBox', v.map((n) => n.toFixed(1)).join(' ')); };
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const animate = (to) => {
      cancelAnimationFrame(raf);
      if (reduce.matches) { setVB(to); return; }
      const from = cur.slice();
      const t0 = performance.now();
      const dur = 520;
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        const k = ease(t);
        setVB(from.map((a, i) => a + (to[i] - a) * k));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    // 부재 영역을 화면 비율에 맞춰 넓힌다. 넓은 화면에서는 오른쪽 판을 피해 왼쪽 58% 에 둔다
    const target = (key) => {
      const [x, y, w, h] = BOX[key];
      const r = svg.getBoundingClientRect();
      const ar = r.width / r.height;
      const pad = 0.14;
      let bw = w * (1 + pad * 2), bh = h * (1 + pad * 2);
      const frac = wide.matches ? 0.58 : 1;
      const arL = ar * frac;
      if (bw / bh > arL) bh = bw / arL; else bw = bh * arL;
      const cx = x + w / 2, cy = y + h / 2;
      const fw = bw / frac;
      return [cx - bw / 2, cy - bh / 2, fw, bh];
    };

    const open = (key, from) => {
      active = key;
      opener = from || document.activeElement;
      $$('.part', svg).forEach((g) => g.classList.toggle('on', g.dataset.part === key));
      svg.classList.add('zoomed');
      $$('.pl-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.go === key)));
      $$('.pbody', panel).forEach((d) => { d.hidden = d.dataset.for !== key; });
      panel.hidden = false;
      animate(target(key));
      const h = $(`#pn-${key}-name`);
      if (h) h.focus({ preventScroll: !wide.matches ? false : true });
    };
    const close = () => {
      if (!active) return;
      active = null;
      svg.classList.remove('zoomed');
      $$('.part', svg).forEach((g) => g.classList.remove('on'));
      $$('.pl-btn').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      panel.hidden = true;
      animate(FULL);
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };

    // SVG <g> 에는 outline 이 그려지지 않는다 — 포커스 틀을 따로 그린다
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    ring.setAttribute('class', 'focus-ring');
    ring.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(ring);
    const showRing = (g) => {
      const bb = g.getBBox();
      const x1 = Math.max(bb.x, 0), y1 = Math.max(bb.y, 60), x2 = Math.min(bb.x + bb.width, 1600), y2 = Math.min(bb.y + bb.height, 1000);
      ring.setAttribute('x', x1 - 4); ring.setAttribute('y', y1 - 4);
      ring.setAttribute('width', x2 - x1 + 8); ring.setAttribute('height', y2 - y1 + 8);
      ring.classList.add('on');
    };
    $$('.part', svg).forEach((g) => {
      g.addEventListener('click', (e) => { e.stopPropagation(); active === g.dataset.part ? close() : open(g.dataset.part, g); });
      g.addEventListener('focus', () => { if (g.matches(':focus-visible')) showRing(g); });
      g.addEventListener('blur', () => ring.classList.remove('on'));
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(g.dataset.part, g); }
      });
    });
    svg.addEventListener('click', (e) => { if (!e.target.closest('.part')) close(); });
    $$('.pl-btn').forEach((b) => b.addEventListener('click', () => (active === b.dataset.go ? close() : open(b.dataset.go, b))));
    $('.panel-close', panel).addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && active) close(); });
    addEventListener('resize', () => { if (active) setVB(target(active)); });
  }

  // ── 부재 도판 가로 넘기기 ─────────────────
  const plates = $('#plates');
  if (plates) {
    const items = $$('.plate', plates);
    const links = $$('.pl-index a');
    const cur = $('.prog .cur');
    const [prev, next] = $$('.pl-ctl .btn');
    let i = 0;
    const sync = (n) => {
      i = n;
      cur.textContent = String(n + 1).padStart(2, '0');
      links.forEach((a, k) => (k === n ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      prev.disabled = n === 0;
      next.disabled = n === items.length - 1;
      items.forEach((p, k) => p.toggleAttribute('inert', k !== n));
    };
    const go = (n, smooth = true) => {
      n = Math.max(0, Math.min(items.length - 1, n));
      plates.scrollTo({ left: items[n].offsetLeft - plates.offsetLeft, behavior: smooth && !reduce.matches ? 'smooth' : 'auto' });
      sync(n);
      history.replaceState(null, '', '#' + items[n].id);
      const a = links[n];
      if (a) a.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    let t;
    plates.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const n = Math.round(plates.scrollLeft / plates.clientWidth);
        if (n !== i) { sync(n); history.replaceState(null, '', '#' + items[n].id); }
      }, 90);
    }, { passive: true });
    prev.addEventListener('click', () => go(i - 1));
    next.addEventListener('click', () => go(i + 1));
    links.forEach((a, k) => a.addEventListener('click', (e) => { e.preventDefault(); go(k); }));
    plates.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      if (e.key === 'Home') { e.preventDefault(); go(0); }
      if (e.key === 'End') { e.preventDefault(); go(items.length - 1); }
    });
    addEventListener('resize', () => go(i, false));
    const start = items.findIndex((p) => '#' + p.id === location.hash);
    sync(0);
    if (start > 0) requestAnimationFrame(() => go(start, false));
  }

  // ── 탭 ─────────────────────────────────
  const tablist = $('[role="tablist"]');
  if (tablist) {
    const tabs = $$('[role="tab"]', tablist);
    const select = (tab, focus = true) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        $('#' + t.getAttribute('aria-controls')).hidden = !on;
      });
      const key = tab.id.slice(2);
      $$('.strip').forEach((s) => s.classList.toggle('on', s.dataset.tab === key));
      if (focus) tab.focus();
    };
    tabs.forEach((t, k) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        let n = null;
        if (e.key === 'ArrowRight') n = (k + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (k - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(tabs[n]); }
      });
    });
    $$('.strip').forEach((s) => s.addEventListener('click', () => {
      const tab = $('#t-' + s.dataset.tab);
      select(tab, false);
      $('.gd-sec').scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
      tab.focus({ preventScroll: true });
    }));
    const init = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
    if (init) select(init, false);
    // 세부 종류
    $$('.seg').forEach((seg) => {
      const panel = seg.closest('.g-panel');
      $$('button', seg).forEach((b) => b.addEventListener('click', () => {
        $$('button', seg).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        $$('.g-art', panel).forEach((f) => { f.hidden = f.dataset.v !== b.dataset.v; });
      }));
    });
  }

  // ── 거르기 (문양 · 찾아보기) ───────────────
  const filters = $('.filters');
  if (filters) {
    const chips = $$('button', filters);
    const items = $$('.mo, .place');
    const count = $('.count span');
    const rec = $('#recOnly');
    const empty = $('.empty');
    let f = 'all';
    const apply = () => {
      let n = 0;
      items.forEach((it) => {
        const k = it.dataset.kind || it.dataset.type;
        const ok = (f === 'all' || k === f) && (!rec || !rec.checked || it.dataset.rec === '1');
        it.hidden = !ok;
        if (ok) n++;
      });
      count.textContent = n;
      if (empty) empty.hidden = n !== 0;
    };
    chips.forEach((c) => c.addEventListener('click', () => {
      f = c.dataset.f;
      chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      apply();
    }));
    if (rec) rec.addEventListener('change', apply);
    const reset = $('[data-reset]');
    if (reset) reset.addEventListener('click', () => { f = 'all'; chips.forEach((x, k) => x.setAttribute('aria-pressed', String(k === 0))); rec.checked = false; apply(); chips[0].focus(); });
  }

  // ── 색 쌓기 단계 ─────────────────────────
  const data = $('#steps-data');
  if (data) {
    const S = JSON.parse(data.textContent);
    const layers = $$('.stage-svg .layer');
    const btns = $$('.st-list button');
    const [prev, next] = $$('.st-ctl .btn');
    const bar = $('.bar');
    const now = $('.st-now');
    let i = 1;
    const render = (n, animateNew) => {
      const old = i;
      i = Math.max(1, Math.min(S.length, n));
      layers.forEach((l) => {
        const s = +l.dataset.step;
        const u = l.dataset.until ? +l.dataset.until : Infinity;
        const show = s <= i && i <= u;
        l.classList.toggle('show', show);
        l.classList.remove('wipe');
        if (show && animateNew && s === i && i > old && !reduce.matches) {
          void l.getBoundingClientRect();
          l.classList.add('wipe');
        }
      });
      btns.forEach((b, k) => {
        if (k + 1 === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        b.classList.toggle('done', k + 1 < i);
      });
      prev.disabled = i === 1;
      next.disabled = i === S.length;
      bar.setAttribute('aria-valuenow', i);
      bar.setAttribute('aria-valuetext', `${i}단계 ${S[i - 1].name}`);
      $('span', bar).style.transform = `scaleX(${i / S.length})`;
      const d = S[i - 1];
      now.innerHTML = `<p class="st-no"><span>${d.no}</span> / ${S.length}</p><h2>${d.name}</h2><p class="st-text">${d.text}${d.cite}</p>`;
    };
    prev.addEventListener('click', () => render(i - 1, true));
    next.addEventListener('click', () => render(i + 1, true));
    btns.forEach((b) => b.addEventListener('click', () => render(+b.dataset.i, true)));
    render(1, false);
  }
})();
