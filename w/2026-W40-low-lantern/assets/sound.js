// LOW LANTERN RECORDS — 미리 듣기. 오디오 파일 없이 Web Audio 로 합성한다.
// 트랙마다 data-* (style · bpm · root · mode · wave · cut · seed) 에서 4마디 루프를 만든다.
// 30초 재생 후 다음 트랙. 첫 재생은 사용자 클릭에서만 시작된다(AudioContext 생성 시점).
(function () {
  'use strict';
  const root = document.querySelector('[data-player]');
  if (!root) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  const rows = [...document.querySelectorAll('.trk[data-track]')];
  if (!AC || !rows.length) { root.hidden = true; return; }

  const LEN = 30;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const planes = [...document.querySelectorAll('[data-react]')];
  const $ = (s) => root.querySelector(s);
  const btnToggle = $('[data-toggle]'), btnPrev = $('[data-prev]'), btnNext = $('[data-next]');
  const seek = $('[data-seek]'), timeEl = $('[data-time]'), nowPos = $('[data-now-pos]'), nowTitle = $('[data-now-title]');

  const tracks = rows.map((el) => ({
    el,
    btn: el.querySelector('.tplay'),
    title: el.dataset.title, pos: el.dataset.pos,
    style: el.dataset.style, bpm: +el.dataset.bpm, root: +el.dataset.root, mode: el.dataset.mode,
    wave: el.dataset.wave, cut: +el.dataset.cut, seed: +el.dataset.seed,
  }));

  // ---------- 음악 재료 ----------
  const MODES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10] };
  const PROGS = [[0, 5, 3, 4], [0, 3, 4, 0], [0, 5, 1, 4], [0, 2, 5, 4], [0, 6, 5, 4], [0, 3, 5, 4]];
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function song(tr) {
    const R = rng(tr.seed);
    const sc = MODES[tr.mode] || MODES.minor;
    const deg = (i) => { const o = Math.floor(i / 7); return sc[((i % 7) + 7) % 7] + 12 * o; };
    const prog = PROGS[Math.floor(R() * PROGS.length)];
    const base = 48 + tr.root; // C3 + 근음
    const chord = (bar, n = 3) => [0, 2, 4, 6].slice(0, n).map((x) => base + deg(prog[bar % 4] + x));
    const mask = (p) => Array.from({ length: 16 }, (_, i) => i === 0 || R() < p);
    return {
      base, deg, prog, chord,
      bassMask: mask(0.42), bassOct: Array.from({ length: 16 }, () => R() < 0.22),
      hatMask: mask(0.35), bellMask: Array.from({ length: 64 }, () => R() < 0.09),
      arpOrder: Array.from({ length: 16 }, () => Math.floor(R() * 7)),
      stab: [6, 10, 14, 3][Math.floor(R() * 4)], sync: [6, 10, 11][Math.floor(R() * 3)],
      subMask: [0, 3, 6, 10].filter(() => R() < 0.8),
      bellDeg: Array.from({ length: 64 }, () => Math.floor(R() * 7)),
    };
  }

  // ---------- 오디오 그래프 ----------
  let ctx = null, master = null, analyser = null, noise = null, buf = null;
  function ensure() {
    if (ctx) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.85;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 4;
    analyser = ctx.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.6;
    master.connect(comp); comp.connect(analyser); analyser.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    buf = new Uint8Array(analyser.fftSize);
  }

  // 한 번 재생할 때마다 새 버스. 멈출 때 버스째 줄이고 끊으면 딜레이 꼬리까지 사라진다.
  let P = null;
  function makeBus(beat, sendAmt) {
    const bus = ctx.createGain(); bus.gain.value = 0.0001;
    bus.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.04);
    bus.connect(master);
    const dIn = ctx.createGain(); dIn.gain.value = sendAmt;
    const dl = ctx.createDelay(2); dl.delayTime.value = Math.min(1.9, beat * 0.75);
    const fb = ctx.createGain(); fb.gain.value = 0.42;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    dIn.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(bus);
    return { bus, dIn };
  }
  function killBus(p) {
    if (!p) return;
    const t = ctx.currentTime;
    p.bus.gain.cancelScheduledValues(t);
    p.bus.gain.setValueAtTime(p.bus.gain.value, t);
    p.bus.gain.linearRampToValueAtTime(0, t + 0.06);
    const b = p.bus;
    setTimeout(() => { try { b.disconnect(); } catch (e) { /* */ } }, 200);
  }

  function voice(t, o) {
    const { f, type = 'sine', dur = 0.2, a = 0.005, r = 0.12, g = 0.2, cut = 0, q = 0.7, env = 0, send = 0, det = 0 } = o;
    const osc = ctx.createOscillator();
    osc.type = type; osc.frequency.setValueAtTime(f, t); if (det) osc.detune.value = det;
    const v = ctx.createGain();
    v.gain.setValueAtTime(0.0001, t);
    v.gain.linearRampToValueAtTime(g, t + a);
    const hold = Math.max(t + a, t + dur);
    v.gain.setValueAtTime(g, hold);
    v.gain.exponentialRampToValueAtTime(0.0001, hold + r);
    let n = osc;
    if (cut) {
      const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.Q.value = q;
      if (env) { fl.frequency.setValueAtTime(cut + env, t); fl.frequency.exponentialRampToValueAtTime(cut, t + Math.max(0.03, dur)); }
      else fl.frequency.value = cut;
      osc.connect(fl); n = fl;
    }
    n.connect(v); v.connect(P.bus);
    if (send) { const s = ctx.createGain(); s.gain.value = send; v.connect(s); s.connect(P.dIn); }
    osc.start(t); osc.stop(hold + r + 0.05);
  }
  function hiss(t, { dur = 0.03, g = 0.1, type = 'highpass', f = 7000, q = 0.7, send = 0 }) {
    const s = ctx.createBufferSource(); s.buffer = noise;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    const v = ctx.createGain();
    v.gain.setValueAtTime(g, t); v.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(v); v.connect(P.bus);
    if (send) { const x = ctx.createGain(); x.gain.value = send; v.connect(x); x.connect(P.dIn); }
    s.start(t, Math.random() * 0.8); s.stop(t + dur + 0.02);
  }
  function kick(t, g = 0.9) {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
    const v = ctx.createGain(); v.gain.setValueAtTime(g, t); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    o.connect(v); v.connect(P.bus); o.start(t); o.stop(t + 0.42);
  }
  function snare(t, g = 0.22) {
    hiss(t, { dur: 0.16, g, type: 'highpass', f: 1400 });
    voice(t, { f: 190, type: 'triangle', dur: 0.02, r: 0.08, g: g * 0.8 });
  }

  // ---------- 스타일별 한 스텝 ----------
  const STEP = {
    ambient(s, t, tr, S, st) {
      const bar = Math.floor(s / 16), i = s % 16, barLen = st * 16;
      if (i === 0) S.chord(bar, 3).forEach((m, k) => {
        voice(t, { f: hz(m + 12), type: tr.wave, dur: barLen * 0.9, a: 1.1, r: 1.6, g: 0.075, cut: tr.cut, det: -7 });
        voice(t, { f: hz(m + 12), type: 'sine', dur: barLen * 0.9, a: 1.3, r: 1.6, g: 0.04, det: 7, send: k === 0 ? 0.3 : 0 });
      });
      if (i === 0 && bar % 2 === 0) voice(t, { f: hz(S.chord(bar)[0] - 12), type: 'sine', dur: barLen * 1.8, a: 0.8, r: 1.2, g: 0.09 });
      if (S.bellMask[s % 64]) voice(t, { f: hz(S.base + 24 + S.deg(S.bellDeg[s % 64])), type: 'sine', dur: 0.02, r: 1.8, g: 0.05, send: 0.55 });
    },
    techno(s, t, tr, S, st) {
      const bar = Math.floor(s / 16), i = s % 16;
      if (i % 4 === 0) kick(t, 0.95);
      if (i % 4 === 2) hiss(t, { dur: 0.05, g: 0.11 });
      else if (S.hatMask[i]) hiss(t, { dur: 0.025, g: 0.04 });
      if (i === 4 || i === 12) hiss(t, { dur: 0.09, g: 0.07, type: 'bandpass', f: 2200, q: 2 });
      if (S.bassMask[i]) {
        const m = S.chord(bar)[0] - 12 + (S.bassOct[i] ? 12 : 0);
        voice(t, { f: hz(m), type: tr.wave, dur: st * 0.7, r: 0.05, g: 0.16, cut: tr.cut, env: 1700, q: 9 });
      }
      if (i === S.stab && bar % 2 === 1) S.chord(bar, 3).forEach((m) => voice(t, { f: hz(m + 12), type: 'sawtooth', dur: 0.06, r: 0.1, g: 0.035, cut: 1600, send: 0.45 }));
    },
    arp(s, t, tr, S, st) {
      const bar = Math.floor(s / 16), i = s % 16;
      const tones = S.chord(bar, 4);
      const k = S.arpOrder[i];
      const m = tones[k % 4] + 12 + (k >= 4 ? 12 : 0);
      voice(t, { f: hz(m), type: tr.wave, dur: st * 0.6, r: 0.08, g: 0.055, cut: tr.cut, env: 1400, q: 4, send: 0.32 });
      if (i === 0 || i === 8) voice(t, { f: hz(tones[0] - 12), type: 'triangle', dur: st * 6, r: 0.2, g: 0.2, cut: 600 });
      if (i % 4 === 2) hiss(t, { dur: 0.03, g: 0.05 });
      if (i === 0) kick(t, 0.5);
    },
    motorik(s, t, tr, S, st) {
      const bar = Math.floor(s / 16), i = s % 16;
      if (i === 0 || i === 8 || i === 10) kick(t, 0.8);
      if (i === 4 || i === 12) snare(t, 0.2);
      if (i % 2 === 0) hiss(t, { dur: 0.04, g: i % 4 === 2 ? 0.09 : 0.05 });
      if (i % 2 === 0) {
        const r0 = S.chord(bar)[0] - 12;
        voice(t, { f: hz(i === 14 ? r0 + 7 : r0), type: 'triangle', dur: st * 1.6, r: 0.06, g: 0.2, cut: 900 });
      }
      if (i === 0) S.chord(bar, 3).forEach((m, k) => voice(t, { f: hz(m + 12), type: tr.wave, dur: st * 14, a: 0.04, r: 0.3, g: 0.03, cut: tr.cut, det: k ? 5 : -5 }));
    },
    jazz(s, t, tr, S, st) {
      const bar = Math.floor(s / 16), i = s % 16;
      const tones = S.chord(bar, 4);
      if (i % 4 === 0) {
        const beat = i / 4;
        const nxt = S.chord(bar + 1)[0];
        const walk = [tones[0], tones[1], tones[2], nxt + (S.bassOct[i] ? -1 : 1)][beat] - 24;
        voice(t, { f: hz(walk), type: 'triangle', dur: 0.05, r: 0.35, g: 0.55, cut: 900 });
        hiss(t, { dur: 0.14, g: 0.05, type: 'bandpass', f: 3200, q: 0.8 });
      }
      if (i === 4 || i === 12) hiss(t, { dur: 0.08, g: 0.05, type: 'bandpass', f: 1800, q: 1 });
      if (i === 14 || i === 6) hiss(t, { dur: 0.03, g: 0.03 });
      if (i === 0 || i === S.sync) tones.forEach((m) => {
        voice(t, { f: hz(m + 12), type: 'sine', dur: 0.08, r: 0.7, g: 0.085, cut: tr.cut });
        voice(t, { f: hz(m + 24), type: tr.wave, dur: 0.02, r: 0.25, g: 0.012 });
      });
    },
    dub(s, t, tr, S, st) {
      const bar = Math.floor(s / 16), i = s % 16;
      if (i === 8) kick(t, 0.95);
      if (i === 12) voice(t, { f: 1700, type: 'square', dur: 0.005, r: 0.025, g: 0.06, send: 0.4 });
      if (i % 4 === 2) hiss(t, { dur: 0.03, g: 0.04 });
      if (S.subMask.includes(i)) voice(t, { f: hz(S.chord(bar)[0] - 24 + (i === 10 ? 7 : 0)), type: 'sine', dur: st * 2.5, a: 0.01, r: 0.1, g: 0.42 });
      if (i === 4 || i === 12) S.chord(bar, 3).forEach((m) => voice(t, { f: hz(m + 12), type: tr.wave, dur: 0.05, r: 0.06, g: 0.03, cut: tr.cut, send: 0.75 }));
    },
  };
  const SWING = { jazz: 0.33 };
  const SEND = { ambient: 0.9, techno: 0.8, arp: 0.9, motorik: 0.5, jazz: 0.4, dub: 1 };

  // ---------- 재생기 ----------
  let cur = 0, playing = false, offset = 0, t0 = 0, timer = null, raf = 0, lvl = 0;

  function position() { return playing ? Math.min(LEN, offset + (ctx.currentTime - t0)) : offset; }

  function start(from) {
    ensure();
    if (ctx.state === 'suspended') ctx.resume();
    const tr = tracks[cur];
    const beat = 60 / tr.bpm, st = beat / 4;
    killBus(P);
    P = Object.assign(makeBus(beat, SEND[tr.style] || 0.5), { tr, S: song(tr), st, step: Math.ceil(from / st) });
    offset = from; t0 = ctx.currentTime + 0.05;
    P.next = t0 + P.step * st - from;
    playing = true;
    root.classList.add('is-live'); // 한 번 재생하면 하단에 붙는다
    clearInterval(timer);
    timer = setInterval(tick, 25);
    tick();
    ui();
    loop();
  }
  function tick() {
    if (!playing || !P) return;
    const ahead = ctx.currentTime + 0.12;
    const fn = STEP[P.tr.style] || STEP.ambient;
    while (P.next < ahead) {
      const at = P.next - t0 + offset;
      if (at >= LEN) break;
      const sw = SWING[P.tr.style] && P.step % 2 === 1 ? P.st * SWING[P.tr.style] : 0;
      fn(P.step, P.next + sw, P.tr, P.S, P.st);
      P.step++; P.next += P.st;
    }
    if (position() >= LEN) {
      if (cur < tracks.length - 1) { cur++; start(0); } else { stop(true); }
    }
  }
  function pause() {
    if (!playing) return;
    offset = position();
    playing = false;
    clearInterval(timer);
    killBus(P); P = null;
    ui();
  }
  function stop(reset) {
    pause();
    if (reset) { offset = 0; cur = 0; }
    ui();
  }
  function go(i, autoplay) {
    cur = (i + tracks.length) % tracks.length;
    offset = 0;
    if (autoplay) start(0); else ui();
  }

  // ---------- 화면 ----------
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  function ui() {
    const tr = tracks[cur];
    btnToggle.classList.toggle('is-playing', playing);
    btnToggle.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + tr.title);
    nowPos.textContent = tr.pos; nowTitle.textContent = tr.title;
    tracks.forEach((t, i) => {
      const on = i === cur && playing;
      t.btn.setAttribute('aria-pressed', String(on));
      t.btn.classList.toggle('is-playing', on);
      t.btn.setAttribute('aria-label', (on ? 'Pause ' : 'Play ') + t.title);
      t.el.classList.toggle('is-on', i === cur && (playing || offset > 0));
    });
    progress();
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({ title: tr.title + ' (preview)', artist: document.querySelector('.artist')?.textContent.trim() || '', album: document.querySelector('.title')?.textContent.trim() || '' });
        navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
      } catch (e) { /* */ }
    }
  }
  function progress() {
    const p = position();
    if (document.activeElement !== seek || !dragging) seek.value = p.toFixed(1);
    seek.style.setProperty('--p', (p / LEN * 100) + '%');
    seek.setAttribute('aria-valuetext', `${Math.floor(p)} of ${LEN} seconds`);
    timeEl.textContent = fmt(p);
  }
  function loop() {
    cancelAnimationFrame(raf);
    const frame = () => {
      progress();
      if (!reduce.matches && analyser) {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
        const rms = Math.min(1, Math.sqrt(sum / buf.length) * 4);
        lvl = rms > lvl ? lvl + (rms - lvl) * 0.6 : lvl + (rms - lvl) * 0.12; // 빠른 상승, 느린 하강
      } else lvl = 0;
      const v = playing ? lvl : lvl * 0.85;
      planes.forEach((p) => p.style.setProperty('--lvl', v.toFixed(3)));
      if (playing || lvl > 0.01) raf = requestAnimationFrame(frame);
      else planes.forEach((p) => p.style.setProperty('--lvl', '0'));
    };
    raf = requestAnimationFrame(frame);
  }

  // ---------- 입력 ----------
  btnToggle.addEventListener('click', () => (playing ? pause() : start(offset >= LEN ? 0 : offset)));
  btnPrev.addEventListener('click', () => { if (position() > 3) go(cur, playing); else go(cur - 1, playing); });
  btnNext.addEventListener('click', () => go(cur + 1, playing));
  tracks.forEach((t, i) => t.btn.addEventListener('click', () => {
    if (i === cur && playing) pause();
    else if (i === cur) start(offset >= LEN ? 0 : offset);
    else go(i, true);
  }));
  let dragging = false;
  seek.addEventListener('pointerdown', () => { dragging = true; });
  seek.addEventListener('pointerup', () => { dragging = false; });
  seek.addEventListener('input', () => {
    const v = Number(seek.value);
    if (playing) start(v); else { offset = v; ui(); }
  });
  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.setActionHandler('play', () => start(offset));
      navigator.mediaSession.setActionHandler('pause', pause);
      navigator.mediaSession.setActionHandler('nexttrack', () => go(cur + 1, playing));
      navigator.mediaSession.setActionHandler('previoustrack', () => go(cur - 1, playing));
    } catch (e) { /* */ }
  }

  // 페이지를 떠나면 멈춘다. bfcache 로 돌아오면 정지 상태로 다시 그린다.
  window.addEventListener('pagehide', () => {
    if (playing) pause();
    offset = 0;
    if (ctx) { ctx.close(); ctx = null; }
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) { playing = false; offset = 0; P = null; ui(); } });

  // 검수용 — 상태 읽기만
  window.__llPlayer = { state: () => ({ playing, cur, pos: position(), lvl, ctx: ctx ? ctx.state : 'none' }) };

  ui();
})();
