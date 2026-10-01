// Garfi.Studio — pointer "tear" on the orange header band.
// The original redraws the band into a 2D canvas and displaces it in WebGL with a per-cell offset texture
// (refs/shaders, refs/states/80-band-swipe-*.png). This is my own implementation of the same idea:
//   1. while the pointer moves over the band, the band (bar background + every text / mark in it) is painted into
//      an offscreen 2D canvas at its on-screen position,
//   2. a coarse grid of offsets is pushed by the pointer velocity and relaxes back with a damped spring,
//   3. a fragment shader samples the band texture at uv − offset. Cells outside the band are empty, so the band
//      tears open instead of smearing.
// When the offsets settle the canvas hides and the DOM band shows again. No WebGL → nothing happens.
(() => {
  const bar = document.getElementById('bar');
  const cv = document.getElementById('bar-gl');
  if (!bar || !cv || matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(hover: none)').matches) return;
  const gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return;

  const PAD = 56;                 // canvas extends 56 px above and below the band (original: 173 = 61 + 112)
  const GX = 72, GY = 10;         // offset grid cells
  const REACH = 48;               // max pull in px
  const off = new Float32Array(GX * GY * 2), vel = new Float32Array(GX * GY * 2);
  const data = new Uint8Array(GX * GY * 4);

  const vs = 'attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; v.y = 1.0 - v.y; gl_Position = vec4(p, 0.0, 1.0); }';
  const fs = `precision mediump float; varying vec2 v; uniform sampler2D band, grid; uniform vec2 reach;
    void main(){
      vec2 o = (texture2D(grid, v).rg * 255.0 - 128.0) / 127.0;
      vec2 uv = v - o * reach;
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
      vec4 c = texture2D(band, uv);
      if (c.a < 0.02) discard;
      gl_FragColor = c;
    }`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const mkTex = (unit, filter) => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; };
  const tBand = mkTex(0, gl.LINEAR), tGrid = mkTex(1, gl.NEAREST);   // nearest on the grid → blocky tears
  gl.uniform1i(gl.getUniformLocation(prog, 'band'), 0); gl.uniform1i(gl.getUniformLocation(prog, 'grid'), 1);
  const uReach = gl.getUniformLocation(prog, 'reach');

  const off2d = document.createElement('canvas'); const ctx = off2d.getContext('2d');
  let W = 0, H = 0, dpr = 1, active = false, raf = 0, lastX = null, lastY = null, idle = 0;

  function size() {
    const r = bar.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    W = Math.round(r.width); H = Math.round(r.height + PAD * 2);
    cv.width = off2d.width = Math.round(W * dpr); cv.height = off2d.height = Math.round(H * dpr);
    gl.viewport(0, 0, cv.width, cv.height);
    gl.uniform2f(uReach, REACH / W, REACH / H);
  }

  // paint the band as it looks right now
  function paint() {
    const br = bar.getBoundingClientRect();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--orange') || '#ff4421';
    ctx.fillRect(0, PAD, W, br.height);
    const oy = PAD - br.top;
    const draw = (el) => {
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden') return;
      let a = 1; for (let n = el; n && n !== bar; n = n.parentElement) a *= +getComputedStyle(n).opacity;
      if (a < .02) return;
      const r = el.getBoundingClientRect();
      if (r.right < 0 || r.left > W || r.width === 0) return;
      ctx.globalAlpha = a;
      if (el.tagName.toLowerCase() === 'svg') {
        const vb = el.viewBox.baseVal; const sx = r.width / vb.width, sy = r.height / vb.height;
        ctx.save(); ctx.translate(r.left, r.top + oy); ctx.scale(sx, sy); ctx.translate(-vb.x, -vb.y);
        ctx.fillStyle = cs.color; ctx.strokeStyle = cs.color;
        el.querySelectorAll('path, circle').forEach((p) => {
          const pcs = getComputedStyle(p);
          if (p.tagName === 'circle') { ctx.beginPath(); ctx.arc(+p.getAttribute('cx'), +p.getAttribute('cy'), +p.getAttribute('r'), 0, Math.PI * 2); ctx.lineWidth = parseFloat(el.getAttribute('stroke-width')) || 1.3; ctx.stroke(); return; }
          const path = new Path2D(p.getAttribute('d'));
          const tr = p.getAttribute('transform');
          ctx.save();
          if (tr) { const m2 = tr.match(/translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)/); if (m2) { ctx.translate(+m2[1], +m2[2]); ctx.scale(+m2[3], +m2[3]); } }
          if (el.getAttribute('fill') === 'none') { ctx.lineWidth = parseFloat(el.getAttribute('stroke-width')) || 1.3; ctx.stroke(path); } else ctx.fill(path);
          ctx.restore();
        });
        ctx.restore();
      } else {
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        ctx.fillStyle = cs.color; ctx.textBaseline = 'alphabetic';
        if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
        const fsz = parseFloat(cs.fontSize);
        const lh = cs.lineHeight === 'normal' ? fsz * 1.2 : parseFloat(cs.lineHeight);
        const txt = el.textContent.trim().replace(/\s+/g, ' ');
        const text = cs.textTransform === 'uppercase' ? txt.toUpperCase() : txt;
        ctx.fillText(text, r.left, r.top + oy + (Math.min(lh, r.height) + fsz * .72) / 2);
      }
    };
    bar.querySelectorAll('.bar-mark svg, .bar-txt b, .bar-txt span, .bar-logo svg, .info-btn svg, .info-btn span, .clock time, .clock .status').forEach(draw);
    ctx.globalAlpha = 1;
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tBand);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off2d);
  }

  function push(x, y, dx, dy) {
    const br = bar.getBoundingClientRect();
    const cx = x / W * GX, cy = (y - br.top + PAD) / H * GY;
    const R = 3; // cells
    for (let j = Math.max(0, Math.floor(cy - R)); j < Math.min(GY, Math.ceil(cy + R)); j++) {
      for (let i = Math.max(0, Math.floor(cx - R)); i < Math.min(GX, Math.ceil(cx + R)); i++) {
        const d = Math.hypot(i + .5 - cx, (j + .5 - cy) * 1.6);
        if (d > R) continue;
        const f = (1 - d / R) * 1.5;
        const k = (j * GX + i) * 2;
        vel[k] += dx / REACH * f; vel[k + 1] += dy / REACH * f;
      }
    }
  }

  function frame() {
    let energy = 0;
    for (let k = 0; k < off.length; k++) {
      vel[k] += -off[k] * 0.11; vel[k] *= 0.8; off[k] += vel[k];
      if (off[k] > 1) off[k] = 1; if (off[k] < -1) off[k] = -1;
      energy += Math.abs(off[k]) + Math.abs(vel[k]);
    }
    for (let k = 0, q = 0; k < off.length; k += 2, q += 4) {
      data[q] = Math.round(128 + off[k] * 127); data[q + 1] = Math.round(128 + off[k + 1] * 127); data[q + 2] = 0; data[q + 3] = 255;
    }
    paint();
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tGrid);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GX, GY, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (energy < 0.004 * GX) { if (++idle > 12) return stop(); } else idle = 0;
    raf = requestAnimationFrame(frame);
  }
  function start() { if (active) return; active = true; idle = 0; size(); bar.classList.add('is-gl'); raf = requestAnimationFrame(frame); }
  function stop() { active = false; cancelAnimationFrame(raf); off.fill(0); vel.fill(0); bar.classList.remove('is-gl'); }

  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const br = bar.getBoundingClientRect();
    const inside = e.clientY >= br.top - 4 && e.clientY <= br.bottom + 4;
    if (lastX !== null && inside) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 2) { start(); push(e.clientX, e.clientY, dx, dy); }
    }
    lastX = e.clientX; lastY = e.clientY;
  }, { passive: true });
  addEventListener('resize', () => { if (active) size(); });
})();
