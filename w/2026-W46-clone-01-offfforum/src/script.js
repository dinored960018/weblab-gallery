(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  // 관성 스크롤 (원본 Lenis)
  let lenis = null;
  if (!RM && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const lock = (on) => { document.documentElement.style.overflow = on ? 'hidden' : ''; if (lenis) on ? lenis.stop() : lenis.start(); };

  // 사진 로드 페이드
  $$('img').forEach((img) => { const on = () => img.classList.add('ld'); if (img.complete && img.naturalWidth) on(); else img.addEventListener('load', on, { once: true }); });

  // 제목 상자 · 목록 등장
  requestAnimationFrame(() => requestAnimationFrame(() => { $$('.ttl, .lu, .arc__names').forEach((el) => el.classList.add('in')); }));

  // 모바일 메뉴
  const hdr = $('.hdr'), burger = $('.burger');
  if (burger) {
    const set = (open) => {
      hdr.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); lock(open);
      if (open) $('.mmenu a').focus();
    };
    burger.addEventListener('click', () => set(!hdr.classList.contains('open')));
    $('.mscrim').addEventListener('click', () => set(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && hdr.classList.contains('open')) { set(false); burger.focus(); } });
    matchMedia('(min-width: 768px)').addEventListener('change', (m) => { if (m.matches && hdr.classList.contains('open')) set(false); });
  }

  // 쿠키 동의 창
  const ck = $('.ck');
  if (ck) {
    const main = $('.ck__main', ck), mng = $('.ck__mng', ck);
    const close = (val) => { store.set('ottt-consent', val); ck.classList.remove('open'); setTimeout(() => { ck.hidden = true; }, 420); };
    if (!store.get('ottt-consent')) { ck.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => ck.classList.add('open'))); }
    $('[data-ck=all]', ck).addEventListener('click', () => close('all'));
    $('[data-ck=nec]', ck).addEventListener('click', () => close('necessary'));
    $('[data-ck=mng]', ck).addEventListener('click', () => { main.hidden = true; mng.hidden = false; $('[data-ck=back]', ck).focus(); });
    $('[data-ck=back]', ck).addEventListener('click', () => { mng.hidden = true; main.hidden = false; $('[data-ck=mng]', ck).focus(); });
    $$('.sw', ck).forEach((sw) => sw.addEventListener('click', () => sw.setAttribute('aria-checked', String(sw.getAttribute('aria-checked') !== 'true'))));
    $('[data-ck=ok]', ck).addEventListener('click', () => close($$('.sw', ck).filter((s) => s.getAttribute('aria-checked') === 'true').map((s) => s.dataset.k).join(',') || 'necessary'));
  }

  // 뉴스레터
  const nl = $('.nl');
  if (nl) {
    const fr = document.documentElement.lang.startsWith('fr');
    const T = fr ? { req: 'Champ requis.', mail: 'Courriel invalide.', ok: 'Formulaire de démonstration — rien n’a été envoyé.' } : { req: 'This field is required.', mail: 'Enter a valid email address.', ok: 'Demo form — nothing was sent.' };
    $$('.radios input').forEach((r) => r.addEventListener('change', () => { nl.hidden = false; nl.dataset.list = r.value; }));
    nl.addEventListener('submit', (e) => {
      e.preventDefault();
      let first = null;
      $$('.inp', nl).forEach((inp) => {
        const err = $('#' + inp.getAttribute('aria-describedby'));
        let msg = '';
        if (!inp.value.trim()) msg = T.req; else if (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) msg = T.mail;
        err.textContent = msg; inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (msg && !first) first = inp;
      });
      const out = $('.nl__msg', nl);
      if (first) { out.textContent = ''; first.focus(); } else { out.textContent = T.ok; nl.reset(); }
    });
  }

  // FAQ
  $$('.acc__q').forEach((q) => q.addEventListener('click', () => {
    const open = q.getAttribute('aria-expanded') === 'true';
    $$('.acc__q[aria-expanded="true"]').forEach((o) => { o.setAttribute('aria-expanded', 'false'); o.closest('.acc__it').classList.remove('open'); $('#' + o.getAttribute('aria-controls')).setAttribute('aria-hidden', 'true'); });
    if (!open) { q.setAttribute('aria-expanded', 'true'); q.closest('.acc__it').classList.add('open'); $('#' + q.getAttribute('aria-controls')).setAttribute('aria-hidden', 'false'); }
  }));
  const fnav = $$('.faq__nav a');
  if (fnav.length) {
    const groups = fnav.map((a) => $(a.getAttribute('href')));
    const upd = () => { let cur = 0; groups.forEach((g, i) => { if (g.getBoundingClientRect().top < innerHeight * .45) cur = i; }); fnav.forEach((a, i) => a.toggleAttribute('aria-current', i === cur)); };
    addEventListener('scroll', upd, { passive: true }); upd();
    fnav.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const t = $(a.getAttribute('href')); if (lenis) lenis.scrollTo(t, { offset: -24 }); else t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); history.replaceState(null, '', a.getAttribute('href')); }));
  }

  // 따라오는 사진(lineup · schedule)
  const frame = $('.ls__frame');
  const show = (src, alt) => {
    if (!frame || !src) return;
    const top = frame.lastElementChild;
    if (top && top.dataset.src === src) return;
    const d = document.createElement('div'); d.dataset.src = src;
    const img = new Image(); img.src = src; img.alt = ''; d.appendChild(img); frame.appendChild(d);
    requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('on')));
    while (frame.children.length > 6) frame.firstElementChild.remove();
  };
  $$('[data-pic]').forEach((a) => {
    const on = () => { $$('[data-pic].on').forEach((o) => o !== a && o.classList.remove('on')); a.classList.add('on'); show(a.dataset.pic); };
    a.addEventListener('mouseenter', on); a.addEventListener('focus', on);
  });

  // 일정 탭
  const tabs = $$('[role=tab]');
  if (tabs.length) {
    const sel = (t, focus) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; const p = $('#' + x.getAttribute('aria-controls')); p.hidden = !on; if (on) { p.classList.add('fade'); requestAnimationFrame(() => requestAnimationFrame(() => p.classList.remove('fade'))); } });
      if (focus) t.focus();
      const first = $('#' + t.getAttribute('aria-controls') + ' [data-pic]'); if (first) show(first.dataset.pic);
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => { sel(t); history.replaceState(null, '', '#' + t.id.replace('tab-', '')); });
      t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); sel(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true); } });
    });
    const h = location.hash.slice(1); const byHash = tabs.find((t) => t.id === 'tab-' + h);
    if (byHash) sel(byHash);
  }

  // 라이트박스 (갤러리 · 강연)
  const lb = $('.lb');
  if (lb) {
    const stage = $('.lb__stage', lb), num = $('.lb__n', lb);
    let set = [], idx = 0, kind = 'img', opener = null, playT = null;
    const stop = () => { if (playT) { cancelAnimationFrame(playT); playT = null; } };
    const render = () => {
      stop();
      const it = set[idx];
      if (kind === 'img') stage.innerHTML = `<img src="${it.src}" alt="${it.alt}">`;
      else {
        stage.innerHTML = `<div class="lb__vid"><img src="${it.src}" alt="${it.alt}"><button class="lb__play" type="button" aria-pressed="false" aria-label="Play recording">${$('#ic-play').innerHTML}</button><div class="lb__bar"><span></span></div></div>`;
        const btn = $('.lb__play', stage), bar = $('.lb__bar span', stage); let p = 0, last = 0;
        btn.addEventListener('click', () => {
          const on = btn.getAttribute('aria-pressed') !== 'true';
          btn.setAttribute('aria-pressed', String(on)); btn.setAttribute('aria-label', on ? 'Pause recording' : 'Play recording');
          btn.innerHTML = $(on ? '#ic-pause' : '#ic-play').innerHTML;
          if (on) { last = performance.now(); const tick = (t) => { p = Math.min(1, p + (t - last) / 45000); last = t; bar.style.transform = `scaleX(${p})`; if (p < 1) playT = requestAnimationFrame(tick); }; playT = requestAnimationFrame(tick); } else stop();
        });
      }
      num.textContent = `${idx + 1} / ${set.length}`;
    };
    const focusables = () => $$('button', lb).filter((b) => b.offsetParent !== null);
    const open = (group, i, k, btn) => {
      set = $$(`[data-lb="${group}"]`).map((b) => ({ src: b.dataset.full, alt: b.dataset.alt || '' })); idx = i; kind = k; opener = btn;
      render(); lb.hidden = false; void lb.offsetWidth; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); lock(true);
      $('.lb__x', lb).focus();
    };
    const close = () => { stop(); lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lock(false); setTimeout(() => { lb.hidden = true; stage.innerHTML = ''; }, 310); if (opener) opener.focus(); };
    const go = (d) => { idx = (idx + d + set.length) % set.length; render(); };
    $$('[data-lb]').forEach((b) => { const g = b.dataset.lb; b.addEventListener('click', () => open(g, $$(`[data-lb="${g}"]`).indexOf(b), g === 'talks' ? 'vid' : 'img', b)); });
    $('.lb__x', lb).addEventListener('click', close);
    $('.lb__p', lb).addEventListener('click', () => go(-1));
    $('.lb__nx', lb).addEventListener('click', () => go(1));
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target === stage) close(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') { const f = focusables(); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
  }

  // about 사진 행렬 — 원본에서 잰 (진행값, x, y, 크기) 표를 보간. 진행값은 시간으로 초당 0.0515, 스크롤로 밀림
  const box = $('.ab__box');
  if (box) {
    const P = [[0,0,0,0],[.006,0,0,.005],[.021,0,0,.017],[.042,0,0,.032],[.088,0,-1,.072],[.125,0,0,.109],[.149,3,-1,.136],[.164,10,-8,.152],[.185,19,-17,.174],[.231,42,-36,.234],[.268,64,-54,.293],[.292,82,-70,.338],[.307,99,-83,.363],[.322,115,-96,.389],[.341,137,-113,.43],[.374,179,-147,.515],[.411,236,-188,.651],[.434,280,-216,.772],[.45,311,-237,.842],[.465,343,-259,.888],[.483,388,-292,.917],[.517,481,-362,.917],[.553,618,-474,.827],[.577,733,-575,.713],[.593,805,-643,.636],[.608,864,-699,.576],[.626,927,-760,.515],[.659,1020,-850,.43],[.696,1104,-935,.356],[.72,1150,-983,.315],[.736,1178,-1012,.286],[.756,1210,-1047,.252],[.802,1271,-1115,.189],[.839,1313,-1160,.148],[.863,1336,-1186,.123],[.879,1346,-1199,.106],[.899,1358,-1215,.085],[.945,1383,-1247,.043],[.982,1400,-1269,.014],[1,1408,-1280,0]];
    const at = (p) => { let i = 1; while (i < P.length - 1 && P[i][0] < p) i++; const a = P[i - 1], b = P[i], t = (p - a[0]) / (b[0] - a[0] || 1); return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t]; };
    const items = $$('.ab__it', box), n = items.length;
    let base = .194, lastT = performance.now(), lastY = scrollY, vis = true;
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { rootMargin: '200px' }).observe(box);
    const draw = () => {
      const k = box.clientWidth / 1408;
      items.forEach((it, i) => {
        const p = ((base + i / n) % 1 + 1) % 1; const [x, y, s] = at(p);
        it.style.transform = `translate(${x * k}px,${y * k}px) scale(${s})`; it.style.zIndex = Math.round(s * 100);
        const z = (1 - 1 / (1.7 - .7 * s)) * 50; it.querySelector('img').style.objectViewBox = `inset(${z.toFixed(2)}% ${z.toFixed(2)}% ${z.toFixed(2)}% ${z.toFixed(2)}%)`;
      });
    };
    addEventListener('resize', draw);
    if (RM) { base = .5 - 3 / n; draw(); }
    else {
      const tick = (t) => {
        const dt = Math.min(.1, (t - lastT) / 1000); lastT = t;
        const y = scrollY; if (vis) base += dt * .0515 - (y - lastY) * .0002; lastY = y;
        if (vis) draw(); requestAnimationFrame(tick);
      };
      draw(); requestAnimationFrame(tick);
    }
  }

  // 연사 · 일정 상세: 사진 시차 + 작업 판 확대
  const hero = $('.dt__ph>div'), frames = $$('.stack__in');
  if ((hero || frames.length) && !RM) {
    const upd = () => {
      const vh = innerHeight;
      if (hero) { const y = Math.min(scrollY, vh); hero.style.transform = `translateY(${10 + 10 * (y / vh)}%) scale(1.2)`; }
      frames.forEach((f) => { const r = f.parentElement.getBoundingClientRect(); const s = Math.max(0, Math.min(1, (vh - r.top) / r.height)); f.style.setProperty('--s', s.toFixed(4)); });
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }
})();
