// All: 8칸 × 10줄 판이 사방으로 끝없이 돈다. 휠 · 끌기 · 화살표 키로 움직이고, 칸을 누르면 그 사진으로 확대된다
(() => {
  const box = $('.all');
  if (!box) return;
  const tiles = $$('.all__t', box), label = $('.all__label');
  let vw, vh, W0, H0, cells = [];
  const st = { x: 0, y: 0, tx: 0, ty: 0, s: 1, zoom: null, busy: false };
  const mod = (a, n) => ((a % n) + n) % n;
  const measure = () => {
    vw = box.clientWidth; vh = box.clientHeight;
    const tw = vw * .1, gap = vw * .08, pad = vw * .04;
    cells = []; let y = pad;
    for (let r = 0; r < tiles.length; r += 8) {
      const row = tiles.slice(r, r + 8), hs = row.map((t) => tw * t.dataset.h / t.dataset.w), rh = Math.max(...hs);
      row.forEach((t, i) => cells.push({ t, x: pad + i * (tw + gap), y: y + (rh - hs[i]) / 2, w: tw, h: hs[i] }));
      y += rh + gap;
    }
    W0 = pad * 2 + 8 * tw + 7 * gap; H0 = y - gap + pad;
  };
  const place = (c) => {
    const s = st.s, w = c.w * s, h = c.h * s;
    return [mod(c.x * s + st.x + w, W0 * s) - w, mod(c.y * s + st.y + h, H0 * s) - h, w, h];
  };
  const draw = () => {
    for (const c of cells) {
      const [px, py, w, h] = place(c), t = c.t;
      if (px >= vw || py >= vh) { if (t.style.visibility !== 'hidden') { t.style.visibility = 'hidden'; t.style.width = '0px'; t.style.transform = 'translate3d(0,0,0)'; } continue; }
      t.style.visibility = 'visible';
      t.style.transform = `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0)`;
      t.style.width = Math.min(w, vw - px).toFixed(1) + 'px';
      t.style.height = h.toFixed(1) + 'px';
      t.style.setProperty('--w', w.toFixed(1) + 'px');
    }
  };
  measure(); draw();
  addEventListener('resize', () => { if (st.zoom) return; measure(); draw(); });
  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!st.zoom && !st.busy) {
      const k = RM ? 1 : 1 - Math.exp(-dt * 4.2), dx = st.tx - st.x, dy = st.ty - st.y;
      if (Math.abs(dx) > .05 || Math.abs(dy) > .05) { st.x += dx * k; st.y += dy * k; draw(); }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  // 움직이기
  addEventListener('wheel', (e) => { if (st.zoom || st.busy) return; st.tx -= e.deltaX; st.ty -= e.deltaY; }, { passive: true });
  let down = null, moved = false;
  box.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY }; moved = false; });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) { moved = true; box.classList.add('is-drag'); }
    if (!st.zoom && !st.busy) { st.tx += 2 * (e.clientX - down.lx); st.ty += 2 * (e.clientY - down.ly); }
    down.lx = e.clientX; down.ly = e.clientY;
  });
  addEventListener('pointerup', () => { down = null; box.classList.remove('is-drag'); });
  addEventListener('pointercancel', () => { down = null; box.classList.remove('is-drag'); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && st.zoom) { zoomOut(); return; }
    if (st.zoom || st.busy) return;
    const d = { ArrowLeft: [160, 0], ArrowRight: [-160, 0], ArrowUp: [0, 160], ArrowDown: [0, -160] }[e.key];
    if (d) { st.tx += d[0]; st.ty += d[1]; e.preventDefault(); }
  });
  // 확대
  const zoomIn = (c) => {
    if (st.zoom || st.busy) return;
    st.busy = true;
    const [px, py] = place(c);
    const ex = px - c.x, ey = py - c.y;
    const k = .75 * Math.min(vw, vh) / Math.min(c.w, c.h);
    const zx = vw / 2 - (c.x + c.w / 2) * k, zy = vh / 2 - (c.y + c.h / 2) * k;
    st.zoom = { c, ex, ey };
    st.x = ex; st.y = ey;
    box.classList.add('is-zoom');
    label.hidden = false; label.textContent = ''; const sp = document.createElement('span'); sp.className = 'ul'; sp.textContent = c.t.dataset.artist; label.appendChild(sp); label.href = c.t.dataset.href;
    requestAnimationFrame(() => label.classList.add('is-on'));
    c.t.setAttribute('aria-pressed', 'true');
    tween(750, (e) => { st.s = 1 + (k - 1) * e; st.x = ex + (zx - ex) * e; st.y = ey + (zy - ey) * e; draw(); }, ease.p3io, () => { st.busy = false; });
  };
  const zoomOut = () => {
    if (!st.zoom || st.busy) return;
    st.busy = true;
    const { c, ex, ey } = st.zoom, s0 = st.s, x0 = st.x, y0 = st.y;
    label.classList.remove('is-on');
    c.t.setAttribute('aria-pressed', 'false');
    tween(750, (e) => { st.s = s0 + (1 - s0) * e; st.x = x0 + (ex - x0) * e; st.y = y0 + (ey - y0) * e; draw(); }, ease.p3io, () => { st.s = 1; st.tx = st.x = ex; st.ty = st.y = ey; st.zoom = null; label.hidden = true; box.classList.remove('is-zoom'); draw(); setTimeout(() => { st.busy = false; }, 250); });
  };
  box.addEventListener('click', (e) => {
    if (moved) { moved = false; return; }
    if (st.zoom) { zoomOut(); return; }
    const t = e.target.closest('.all__t'); if (!t) return;
    zoomIn(cells.find((c) => c.t === t));
  });
})();
