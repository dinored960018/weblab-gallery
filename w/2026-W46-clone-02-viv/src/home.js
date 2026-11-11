// 홈: 사진 띠(다섯 기둥) · 등장 · 가만히 있을 때 사진 바꾸기 · 문장 글자 등장
(() => {
  const hg = $('#hg');
  if (!hg) return;
  const people = JSON.parse($('#hg-data').textContent);
  for (let i = people.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [people[i], people[j]] = [people[j], people[i]]; }
  const cols = people.slice(0, 5).map((p, i) => {
    const a = document.createElement('a');
    a.className = 'hg__col'; a.href = p.href; a.setAttribute('aria-label', p.name);
    a.innerHTML = `<span class="hg__item">${p.media.slice(0, 4).map((m) => `<span class="hg__w" style="--img:url(${m.u});--c:${m.c}"></span>`).join('')}<span class="hg__name">${p.name}</span></span>`;
    hg.appendChild(a);
    return { a, item: a.firstChild, wraps: [...a.querySelectorAll('.hg__w')], cyc: p.media.slice(4), ci: -1, first: p.media[0], py: 0 };
  });
  const st = { s: 1, yv: 0, pan: 0, panTo: 0, acc: 0, ready: false };
  const RATE = [.5, .8, .2, .3, .6];
  let geo = {};
  const measure = () => {
    const vw = hg.clientWidth, desk = innerWidth >= 992, n = desk ? 5 : 2, F = desk ? 1.3 : 1;
    const cw = (vw * F - 20 - 10 * (n - 1)) / n;
    const a = vw * (desk ? .225 : .35), b = vw * (desk ? .095 : .15);
    const mt = desk ? [0, a, b, a, 0] : [0, a];
    const itemH = 4 * (cw * 4 / 3) + 40 + 21 + 40;
    geo = { vw, desk, n, cw, mt, itemH, maxPan: vw * F - vw };
    hg.style.setProperty('--hg-h', Math.max(...mt.map((m) => m + itemH - 40)) + 'px');
    cols.forEach((c, i) => { c.a.style.display = i < n ? '' : 'none'; });
    if (!st.ready) { st.pan = st.panTo = -geo.maxPan / 2; }
    st.panTo = clamp(st.panTo, -geo.maxPan, 0); st.pan = clamp(st.pan, -geo.maxPan, 0);
  };
  const draw = () => {
    const { vw, n, cw, mt } = geo, cx = vw / 2, s = st.s;
    for (let i = 0; i < n; i++) {
      const c = cols[i];
      let left = cx + (10 + i * (cw + 10) + st.pan - cx) * s;
      const w = cw * s;
      let vis = clamp(vw - left, 0, w);
      if (left >= vw) { left = vw; vis = 0; }
      c.a.style.transform = `translate3d(${left.toFixed(2)}px,${(mt[i] * s + st.yv).toFixed(2)}px,0)`;
      c.a.style.setProperty('--vis', vis.toFixed(2) + 'px');
      c.a.style.setProperty('--cw', w.toFixed(2) + 'px');
      c.a.style.setProperty('--g', (10 * s).toFixed(2) + 'px');
      c.item.style.transform = `translate3d(0,${(c.py * s).toFixed(2)}px,0)`;
    }
  };
  measure(); draw();
  let seen = true;
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; }, { root: mainEl }).observe(hg);
  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    let dirty = false;
    if (Math.abs(st.panTo - st.pan) > .05) { st.pan += (st.panTo - st.pan) * .05; dirty = true; }
    cols.forEach((c, i) => { const d = st.acc - c.py; if (Math.abs(d) > .1) { c.py += d * (1 - Math.exp(-dt * 5 / RATE[i])); dirty = true; } });
    if (dirty) draw();
    requestAnimationFrame(loop);
  };
  if (!RM) requestAnimationFrame(loop);
  addEventListener('resize', () => { measure(); draw(); });
  if (!RM) {
    hg.addEventListener('mousemove', (e) => { if (!st.ready || !geo.desk) return; const r = hg.getBoundingClientRect(); st.panTo = -geo.maxPan * clamp((e.clientX - r.left) / r.width, 0, 1); }, { passive: true });
    hg.addEventListener('mouseleave', () => { st.panTo = -geo.maxPan / 2; }, { passive: true });
    Scroll.on(() => { if (!st.ready) return; st.acc = clamp(-Scroll.y / 2, -geo.itemH / 2, 0); });
  }

  // 가만히 있을 때: 기둥마다 위 두 장이 70px 내려가며 흐려지고, 첫 장이 다음 사진으로 바뀌어 돌아온다
  let timers = [], cycling = false;
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  const stopCycle = () => {
    timers.forEach(clearTimeout); timers = []; cycling = false;
    cols.forEach((c) => c.wraps.slice(0, 2).forEach((w) => { w.style.transform = ''; w.style.setProperty('--o', 1); }));
  };
  const runCycle = () => {
    if (RM || cycling || Scroll.y > 2) return;
    cycling = true;
    const vis = cols.slice(0, geo.n);
    vis.forEach((c, k) => {
      const T = k * 620, two = c.wraps.slice(0, 2);
      later(T, () => two.forEach((w) => { w.style.transition = 'transform 1s cubic-bezier(.45,0,.55,1),background-color .5s cubic-bezier(.37,0,.63,1)'; w.style.transform = 'translate3d(0,70px,0)'; }));
      later(T + 100, () => two.forEach((w) => { w.style.setProperty('--od', '.9s'); w.style.setProperty('--o', 0); }));
      later(T + 1120, () => {
        if (c.cyc.length) { c.ci = (c.ci + 1) % (c.cyc.length + 1); const m = c.ci === c.cyc.length ? c.first : c.cyc[c.ci]; c.wraps[0].style.setProperty('--img', `url(${m.u})`); c.wraps[0].style.setProperty('--c', m.c); }
        two.forEach((w) => { w.style.transform = 'translate3d(0,0,0)'; w.style.setProperty('--od', '.85s'); w.style.setProperty('--o', 1); });
      });
    });
    later((vis.length - 1) * 620 + 2120 + 3000, () => { cycling = false; runCycle(); });
  };
  let backTimer;
  Scroll.on(() => {
    if (Scroll.y > 2) { clearTimeout(backTimer); if (cycling) stopCycle(); } else if (!cycling && st.ready) { clearTimeout(backTimer); backTimer = setTimeout(runCycle, 3000); }
  });

  // 등장: 첫 방문 한 번. 사진이 켜지고(0.8s, 0.04s 간격), 띠가 1.3배 · 5vh 아래에서 제자리로(1.6s), 로고가 양쪽에서 열린다(1.6s)
  const KEY = 'hoh-home-intro';
  const r1 = $('#hl-r1'), r2 = $('#hl-r2'), tag = $('.home__tag');
  const allW = cols.flatMap((c) => c.wraps);
  let seenIntro = false;
  try { seenIntro = !!sessionStorage.getItem(KEY); } catch (e) { /* storage off */ }
  const finish = () => { st.ready = true; try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* storage off */ } Scroll.start(); if (Scroll.y <= 2) backTimer = setTimeout(runCycle, 3000); };
  if (RM || seenIntro) {
    allW.forEach((w) => w.style.setProperty('--o', 1));
    tag.classList.add('is-in');
    finish();
  } else {
    r1.setAttribute('x', 560); r1.setAttribute('width', 0); r2.setAttribute('width', 0);
    st.s = 1.3; st.yv = innerHeight * .05; draw();
    Scroll.stop();
    const firsts = cols.slice(0, geo.n).map((c) => new Promise((res) => { const im = new Image(); im.onload = im.onerror = res; im.src = c.first.u; }));
    Promise.race([Promise.all(firsts), new Promise((res) => setTimeout(res, 2000))]).then(() => {
      allW.forEach((w, i) => { w.style.setProperty('--od', '.8s'); w.style.setProperty('--dl', (i * .04).toFixed(2) + 's'); w.style.setProperty('--o', 1); });
      setTimeout(() => allW.forEach((w) => w.style.setProperty('--dl', '0s')), 2000);
      setTimeout(() => {
        const y0 = st.yv;
        tween(1600, (k) => { st.s = 1.3 - .3 * k; st.yv = y0 * (1 - k); draw(); }, ease.p2o, finish);
        tween(1600, (k) => { r1.setAttribute('x', 560 * (1 - k)); r1.setAttribute('width', 560 * k); r2.setAttribute('width', 560 * k); }, ease.p3io, () => tag.classList.add('is-in'));
      }, 600);
    });
  }

  // 문장: 스크롤에 맞춰 글자가 하나씩 선다 (0.6배 · ±20° · 투명 → 제자리)
  const say = $('.home__say');
  if (say && !RM) {
    const chars = $$('b', say);
    const rot = chars.map(() => Math.random() * 40 - 20);
    const total = .5 + .03 * (chars.length - 1);
    const upd = () => {
      const r = say.getBoundingClientRect(), vh = innerHeight;
      const p = clamp((vh - r.top) / (vh - r.top + (r.bottom - vh * .3)), 0, 1);
      const t = p * total;
      chars.forEach((c, i) => { const k = clamp((t - .03 * i) / .5, 0, 1), e = 1 - Math.pow(1 - k, 5); c.style.opacity = e.toFixed(3); c.style.transform = e >= 1 ? '' : `scale(${(.6 + .4 * e).toFixed(3)}) rotate(${(rot[i] * (1 - e)).toFixed(2)}deg)`; });
    };
    Scroll.on(upd); addEventListener('resize', upd); upd();
  }
})();
