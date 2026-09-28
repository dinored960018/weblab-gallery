/* Background renderer — my own Canvas 2D recreation.
   The original draws its scenes with three.js (WebGL2 / WebGPU). Nothing here is taken from the
   original bundle or its shaders (refs/shaders/ is reference only). Motion values come from
   frame-by-frame recordings of the original (refs/motion-origin*, SPEC "모션 타임라인").

   A scene is chosen by the [data-scene] block that covers most of the viewport. Each block also
   reports its own scroll progress p (0 = block top at viewport top, 1 = block bottom at viewport
   bottom); the scene moves its camera with p the way the original does.
     ribbons — thick arched bands, bottom right; scrolling pushes the camera in until the bands
               stand vertical and fill the screen. One light streak runs along a band.
     sphere  — glass sphere with a stack of slabs turning inside, orbit ring; a hex glow pulses
               when the section arrives and while it scrolls.
     globe   — large wire globe low on the right with slabs orbiting it (LLM page); rises with p.
     rings   — concentric rings like a speaker cone (voice page); breathe, camera dives with p.
     blocks  — floating squares on three depth layers (image & video page); parallax with p.
   window.__bgIntro()   — load intro (bands rise from below, ~1.1 s)
   window.__bgHold(on)  — click-and-hold dive on the home hero */
(() => {
  'use strict';
  const cv = document.getElementById('bg');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, DPR = 1, S = 1;
  let scene = 'ribbons', prevScene = null, mix = 1;
  let p = 0, pPrev = null, pSmooth = 0;
  let hold = 0, holdTarget = 0, dive = 0, t = 0, last = performance.now();
  let introStart = reduce ? -1e9 : null, glow = 0, vel = 0, lastY = scrollY;
  let visible = true;

  const resize = () => {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight; S = W / 1440;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  };
  resize();
  window.addEventListener('resize', resize);

  /* grain tile */
  const grain = document.createElement('canvas');
  grain.width = grain.height = 160;
  {
    const g = grain.getContext('2d');
    const id = g.createImageData(160, 160);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.random() * 255;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
      id.data[i + 3] = 16;
    }
    g.putImageData(id, 0, 0);
  }
  const grainPat = ctx.createPattern(grain, 'repeat');

  /* hexagon tile for the sphere glow */
  const hexTile = document.createElement('canvas');
  {
    const r = 26, w = r * Math.sqrt(3), h = r * 3;
    hexTile.width = Math.round(w); hexTile.height = Math.round(h);
    const g = hexTile.getContext('2d');
    const hex = (cx, cy) => {
      g.beginPath();
      for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + (k * Math.PI) / 3; g.lineTo(cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82); }
      g.closePath(); g.fill();
    };
    g.fillStyle = '#ff5cc0';
    hex(w / 2, r); hex(0, r * 2.5); hex(w, r * 2.5); hex(0, -r * 0.5); hex(w, -r * 0.5);
  }
  const hexPat = ctx.createPattern(hexTile, 'repeat');
  const glowCv = document.createElement('canvas');

  /* particles */
  const parts = Array.from({ length: 60 }, () => ({
    x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 2.2, s: 0.2 + Math.random() * 0.8, a: 0.15 + Math.random() * 0.35,
  }));

  const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const bez = (p0, p1, p2, p3, u) => {
    const v = 1 - u;
    return [
      v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0],
      v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1],
    ];
  };
  const offsetPts = (pts, d) => pts.map((q, i) => {
    const a = pts[Math.max(0, i - 1)], c = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(c[1] - a[1]), ny = c[0] - a[0];
    const l = Math.hypot(nx, ny) || 1;
    return [q[0] + (nx / l) * d, q[1] + (ny / l) * d];
  });
  const poly = (a, b) => {
    ctx.beginPath();
    a.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
    for (let i = b.length - 1; i >= 0; i--) ctx.lineTo(b[i][0], b[i][1]);
    ctx.closePath();
  };

  /* ── ribbons ─────────────────────────────────────────────────────
     World units are 1440×900 px of the resting frame. Each band is a leaning arch: it climbs from
     below the frame on the left, turns over at its peak and drops steeply on the right.
     Back bands are drawn first. The bright lip is the band's top surface. */
  const RIB = Array.from({ length: 5 }, (_, k) => ({ px: 520 + k * 225, py: 690 - k * 90, rxL: 400 + k * 22, rxR: 95 - k * 4, w: 180 + (k % 2) * 12, ph: k * 1.3, k }));
  const CY = 1020;
  const ribPts = (r, time, rise, off = 0) => {
    const sw = Math.sin(time * 0.35 + r.ph) * 8;
    const up = rise * (640 + r.k * 60);
    const ry = CY - r.py - off;
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const th = Math.PI * 1.02 - (i / 64) * Math.PI * 0.86;
      const c = Math.cos(th);
      /* past the peak the band turns away from the camera: it narrows to nothing */
      const f = th >= Math.PI / 2 ? 1 : clamp((th - Math.PI * 0.16) / (Math.PI * 0.34));
      const o = off * f;
      const x = r.px + (c < 0 ? r.rxL - o : r.rxR - o * 0.6) * c + sw * Math.sin(th);
      const y = CY - (ry + off - o) * Math.sin(th);
      pts.push([x, y + up + Math.sin(time * 0.25 + r.ph) * 6]);
    }
    return pts;
  };
  /* camera: at p = 0 the cluster sits bottom right; p → 1 pushes in and tilts until the bands stand up */
  const ribCam = (pp, dv) => {
    /* holding dives into the bands: the camera jumps toward the scrolled-in pose and keeps pushing */
    const k = Math.max(ease(pp) * 0.8 + pp * 0.2, ease(dv * 1.4));
    const z = lerp(0.92, 2.3, k) * (1 + Math.max(0, dv - 0.4) * 0.9);
    return { z, rot: lerp(0, -0.42, k) - dv * 0.35, ax: lerp(1440, 720, k) + dv * 60, ay: lerp(900, 800, k) - dv * 40, tx: lerp(1440, 760, k), ty: lerp(900, 560, k) };
  };
  const drawRibbons = (time, a, pp, intro) => {
    const cam = ribCam(pp, dive);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.scale(S, S);
    ctx.translate(cam.tx, cam.ty); ctx.rotate(cam.rot); ctx.scale(cam.z, cam.z); ctx.translate(-cam.ax, -cam.ay);
    /* the dark wall behind the bands, top right of the resting frame */
    ctx.fillStyle = 'rgba(4, 0, 4, 0.9)';
    ctx.fillRect(1310, -400, 600, 780);
    const lines = [];
    RIB.forEach((r) => {
      const rise = 1 - ease((intro - r.k * 0.05) / 0.8);
      const outer = ribPts(r, time, rise, 0);
      const inner = ribPts(r, time, rise, r.w);
      const lip = ribPts(r, time, rise, -16);
      /* top surface (bright lip) */
      poly(lip, outer);
      ctx.fillStyle = '#a1267f'; ctx.fill();
      /* front face */
      poly(outer, inner);
      const g = ctx.createLinearGradient(r.px - r.rxL, 0, r.px + r.rxR, 0);
      g.addColorStop(0, '#34092e'); g.addColorStop(0.55, '#5e1852'); g.addColorStop(1, '#6d1d60');
      ctx.fillStyle = g; ctx.fill();
      ctx.lineWidth = 10; ctx.strokeStyle = 'rgba(8, 0, 8, 0.45)';
      ctx.beginPath(); inner.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
      ctx.lineWidth = 1 / cam.z; ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath(); lip.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
      if (r.k === 3 || (hold > 0.05 && r.k > 0)) lines.push(ribPts(r, time, rise, -6));
    });
    /* light streaks: one at rest, more while holding */
    ctx.lineCap = 'round';
    ctx.shadowColor = '#ff8ad8';
    lines.forEach((pts, n) => {
      const speed = 0.11 + hold * 0.5;
      const head = (((time * speed + n * 0.37) % 1.5) + 1.5) % 1.5 - 0.25;
      const len = 0.16 + hold * 0.12;
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < pts.length; i++) {
          const u = i / (pts.length - 1);
          if (u > head || u < head - len) continue;
          started ? ctx.lineTo(pts[i][0], pts[i][1]) : (ctx.moveTo(pts[i][0], pts[i][1]), (started = true));
        }
        ctx.shadowBlur = pass ? 10 : 28;
        ctx.strokeStyle = pass ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 120, 215, 0.55)';
        ctx.lineWidth = (pass ? 5 : 13) / Math.sqrt(cam.z);
        ctx.stroke();
      }
    });
    ctx.shadowBlur = 0;
    ctx.restore();
  };

  /* ── sphere (security section) ─────────────────────────────────── */
  const drawSphere = (time, a, pp) => {
    const cx = W * 0.5, cy = H * 0.5, R = Math.min(W * 0.375, H * 0.6);
    ctx.save();
    ctx.globalAlpha = a;
    const g = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.1, cx, cy, R);
    g.addColorStop(0, 'rgba(96, 30, 82, 0.55)');
    g.addColorStop(0.75, 'rgba(60, 12, 50, 0.6)');
    g.addColorStop(0.97, 'rgba(150, 60, 130, 0.55)');
    g.addColorStop(1, 'rgba(210, 120, 200, 0.6)');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.985, 0, Math.PI * 2); ctx.clip();
    ctx.translate(cx, cy);
    /* stack of slabs along a tilted axis; the stack turns with time and scroll */
    const spin = time * 0.22 + pp * 2.2;
    ctx.rotate(-0.72);
    const N = 9;
    for (let i = 0; i < N; i++) {
      const u = (i - (N - 1) / 2) / ((N - 1) / 2);
      const prof = Math.sqrt(Math.max(0, 1 - (u * 0.82) ** 2));
      const y = u * R * 0.62;
      const len = R * 1.28 * prof * (0.82 + 0.18 * Math.cos(spin + i * 0.9));
      const th = R * 0.165;
      const off = Math.sin(spin * 0.8 + i * 1.3) * R * 0.07;
      const face = 0.55 + 0.45 * Math.cos(spin + i * 0.45);
      /* top face */
      ctx.fillStyle = `rgba(${Math.round(110 + 40 * face)}, ${Math.round(34 + 12 * face)}, ${Math.round(96 + 30 * face)}, 0.92)`;
      ctx.beginPath(); ctx.roundRect(-len / 2 + off, y - th / 2, len, th * 0.34, 10); ctx.fill();
      /* front face */
      const sg = ctx.createLinearGradient(0, y - th / 2, 0, y + th / 2);
      sg.addColorStop(0, '#6d1d5e'); sg.addColorStop(1, '#2a0624');
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.roundRect(-len / 2 + off, y - th * 0.18, len, th * 0.7, 10); ctx.fill();
    }
    ctx.restore();
    /* hex glow — pulses in when the section arrives and while it scrolls */
    if (glow > 0.01) {
      if (glowCv.width !== cv.width || glowCv.height !== cv.height) { glowCv.width = cv.width; glowCv.height = cv.height; }
      const gctx = glowCv.getContext('2d');
      gctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      gctx.clearRect(0, 0, W, H);
      gctx.save();
      gctx.beginPath(); gctx.arc(cx, cy, R * 0.9, 0, Math.PI * 2); gctx.clip();
      const band = ctx.createLinearGradient(cx - R, cy + R * 0.5, cx + R, cy - R * 0.5);
      const c = (time * 0.35) % 1;
      band.addColorStop(0, 'rgba(0,0,0,0)');
      band.addColorStop(clamp(c - 0.2), 'rgba(0,0,0,0)');
      band.addColorStop(clamp(c), `rgba(255,255,255,${0.9 * glow})`);
      band.addColorStop(clamp(c + 0.2), 'rgba(0,0,0,0)');
      band.addColorStop(1, 'rgba(0,0,0,0)');
      gctx.fillStyle = hexPat;
      gctx.translate(cx, cy); gctx.rotate(-0.72); gctx.translate(-cx, -cy);
      gctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      gctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      gctx.globalCompositeOperation = 'destination-in';
      gctx.fillStyle = band;
      gctx.fillRect(cx - R * 1.5, cy - R * 1.5, R * 3, R * 3);
      gctx.globalCompositeOperation = 'source-over';
      gctx.restore();
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = a * glow * 0.8;
      ctx.drawImage(glowCv, 0, 0);
      ctx.restore();
    }
    /* rim */
    ctx.shadowColor = '#ff4fb8'; ctx.shadowBlur = 30;
    ctx.strokeStyle = 'rgba(240, 130, 220, 0.45)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    /* orbit ring, front half bright */
    ctx.translate(cx, cy); ctx.rotate(-0.7 + Math.sin(time * 0.2 + pp * 3) * 0.05);
    const ry = R * (0.1 + 0.04 * Math.sin(time * 0.3 + pp * 4));
    ctx.shadowBlur = 20;
    ctx.strokeStyle = 'rgba(255, 110, 200, 0.95)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 0, R * 0.74, ry, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
    ctx.shadowBlur = 0; ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(255, 170, 230, 0.35)';
    ctx.beginPath(); ctx.ellipse(0, 0, R * 0.74, ry, 0, Math.PI, Math.PI * 2); ctx.stroke();
    ctx.restore();
  };

  /* ── globe (LLM hero) ─────────────────────────────────────────── */
  const drawGlobe = (time, a, pp) => {
    const R = W * 0.36;
    const cx = W * 0.74, cy = H * 1.02 - ease(pp) * H * 0.42;
    ctx.save();
    ctx.globalAlpha = a;
    const g = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.35, R * 0.05, cx, cy, R);
    g.addColorStop(0, '#6a1d5c'); g.addColorStop(0.7, '#3b0d34'); g.addColorStop(1, '#23061f');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.translate(cx, cy); ctx.rotate(0.3);
    ctx.strokeStyle = 'rgba(255, 200, 240, 0.12)'; ctx.lineWidth = 1;
    const spin = time * 0.12 + pp * 1.5;
    for (let i = 0; i < 8; i++) {
      const k = Math.cos(spin + (i * Math.PI) / 8);
      ctx.beginPath(); ctx.ellipse(0, 0, Math.abs(k) * R, R, 0, 0, Math.PI * 2); ctx.stroke();
    }
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath(); ctx.ellipse(0, (i * R) / 4, R * Math.sqrt(1 - (i / 4) ** 2), R * 0.1, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    /* slabs orbiting the globe; they rise faster than the globe */
    for (let i = 0; i < 5; i++) {
      const ang = spin * 1.4 + i * 1.25;
      const x = cx + Math.cos(ang) * R * 0.75;
      const y = cy - R * 0.55 - Math.sin(ang) * R * 0.25 - ease(pp) * H * 0.25 * (1 + i * 0.1);
      const d = 0.6 + 0.4 * Math.sin(ang);
      ctx.save(); ctx.translate(x, y); ctx.rotate(-0.35 + i * 0.3);
      ctx.fillStyle = `rgba(${Math.round(90 + 60 * d)}, 24, ${Math.round(80 + 50 * d)}, ${0.55 + 0.35 * d})`;
      ctx.fillRect(-R * 0.05, -R * 0.2, R * 0.1 * (0.6 + d), R * 0.4);
      ctx.restore();
    }
    ctx.restore();
  };

  /* ── rings (voice hero) ───────────────────────────────────────── */
  const drawRings = (time, a, pp) => {
    const z = 1 + ease(pp) * 1.4;
    const cx = W * 0.49, cy = H * (0.49 - pp * 0.08);
    ctx.save();
    ctx.globalAlpha = a;
    const RS = [0.022, 0.05, 0.085, 0.13, 0.2, 0.3, 0.44, 0.62];
    for (let i = RS.length - 1; i >= 0; i--) {
      const beat = Math.sin(time * 2.2 - i * 0.7) * 0.004 * (i + 1) + Math.sin(time * 0.6 + i) * 0.003;
      const r = W * (RS[i] + beat) * z;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = ['#2b0827', '#4b1444', '#200520', '#541a4c'][i % 4]; ctx.fill();
      /* bevel: light on the upper left, shadow on the lower right */
      const bw = Math.max(2, r * 0.07);
      const bg2 = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      bg2.addColorStop(0, 'rgba(190, 80, 170, 0.55)'); bg2.addColorStop(0.5, 'rgba(90, 20, 80, 0.2)'); bg2.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(1, r - bw / 2), 0, Math.PI * 2);
      ctx.lineWidth = bw; ctx.strokeStyle = bg2; ctx.stroke();
    }
    ctx.restore();
  };

  /* ── blocks (image & video hero) ──────────────────────────────── */
  const BLK = Array.from({ length: 18 }, (_, i) => {
    const d = [0.35, 0.65, 1][i % 3];
    return { x: 0.15 + ((i * 0.618) % 1) * 0.85, y: ((i * 0.37) % 1) * 1.2, w: (0.05 + ((i * 0.29) % 1) * 0.12) * d, h: (0.05 + ((i * 0.53) % 1) * 0.14) * d, d, ph: i };
  });
  const drawBlocks = (time, a, pp) => {
    ctx.save();
    ctx.globalAlpha = a;
    for (const b of BLK) {
      const y = (((b.y - time * 0.006 * b.d - pp * 0.9 * b.d) % 1.2) + 1.2) % 1.2 - 0.1;
      const x = b.x + Math.sin(time * 0.2 + b.ph) * 0.004;
      const lum = 0.25 + b.d * 0.55;
      ctx.fillStyle = `rgba(${Math.round(150 * lum + 10)}, ${Math.round(22 * lum)}, ${Math.round(120 * lum + 8)}, ${0.5 + b.d * 0.5})`;
      ctx.fillRect(x * W, y * H, b.w * W, b.h * W);
      ctx.fillStyle = `rgba(255, 140, 220, ${0.08 * b.d})`;
      ctx.fillRect(x * W, y * H, b.w * W, 2);
    }
    ctx.restore();
  };

  const drawScene = (name, time, a, pp) => {
    if (name === 'sphere') drawSphere(time, a, pp);
    else if (name === 'globe' || name === 'orbit') drawGlobe(time, a, pp);
    else if (name === 'rings') drawRings(time, a, pp);
    else if (name === 'blocks') drawBlocks(time, a, pp);
    else drawRibbons(time, a, name === 'ribbons-rest' ? 0 : pp, introStart === null ? 0 : clamp((performance.now() - introStart) / 1100));
  };

  /* scene picking: which [data-scene] covers most of the viewport, and how far it has scrolled */
  const blocks = [...document.querySelectorAll('[data-scene]')];
  const pick = () => {
    let best = null, bestA = 0, bestR = null;
    for (const b of blocks) {
      const r = b.getBoundingClientRect();
      const ar = Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0));
      if (ar > bestA) { bestA = ar; best = b; bestR = r; }
    }
    visible = bestA > 0 || !blocks.length;
    let s = best ? best.dataset.scene : 'ribbons';
    if (best && best.tagName === 'FOOTER' && s === 'ribbons') s = 'ribbons-rest';
    if (bestR) p = clamp(-bestR.top / Math.max(1, bestR.height));
    if (s !== scene) {
      prevScene = scene; scene = s; mix = 0;
      if (s === 'sphere') glow = 1;
      pSmooth = p; pPrev = null;
    }
  };

  window.__bgHold = (on) => { holdTarget = on ? 1 : 0; };
  window.__bgIntro = () => { if (introStart === null) introStart = performance.now(); };
  setTimeout(() => window.__bgIntro(), 6000);

  const frame = (now) => {
    /* cap at ~60 fps: without vsync (some headless/high-refresh setups) the loop would starve input handling */
    if (!reduce && now - last < 15) { requestAnimationFrame(frame); return; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    pick();
    /* scroll velocity feeds the sphere glow */
    const dy = Math.abs(scrollY - lastY); lastY = scrollY;
    vel = lerp(vel, dy / Math.max(dt, 0.001), 0.2);
    if (scene === 'sphere') glow = Math.max(glow * Math.pow(0.35, dt), clamp(vel / 3000) * 0.8);
    pSmooth = pPrev === null ? p : lerp(pSmooth, p, 1 - Math.pow(0.0005, dt));
    pPrev = p;
    hold += (holdTarget - hold) * Math.min(1, dt * (holdTarget ? 4 : 3));
    dive = holdTarget ? dive + dt * 0.45 : dive * Math.pow(0.03, dt);
    t += dt * (1 + hold * 5);
    mix = Math.min(1, mix + dt * 1.6);
    if (visible && !document.hidden) {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const bg = ctx.createRadialGradient(W * 0.1, H * 0.1, 0, W * 0.6, H * 0.8, Math.max(W, H));
      bg.addColorStop(0, '#050105'); bg.addColorStop(0.55, '#170414'); bg.addColorStop(1, '#330a2c');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      if (prevScene && mix < 1) drawScene(prevScene, t, 1 - mix, pSmooth);
      drawScene(scene, t, mix, pSmooth);
      for (const q of parts) {
        const y = ((q.y - t * 0.004 * q.s) % 1 + 1) % 1;
        ctx.fillStyle = `rgba(255, 110, 200, ${q.a * 0.45})`;
        ctx.beginPath(); ctx.arc(q.x * W, y * H, q.r, 0, Math.PI * 2); ctx.fill();
      }
      const vg = ctx.createLinearGradient(0, 0, W, 0);
      vg.addColorStop(0, 'rgba(0, 0, 0, 0.5)'); vg.addColorStop(0.45, 'rgba(0, 0, 0, 0.08)'); vg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = grainPat; ctx.fillRect(0, 0, W, H);
    }
    if (!reduce) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  if (reduce) { window.addEventListener('scroll', () => requestAnimationFrame(frame), { passive: true }); }
})();
