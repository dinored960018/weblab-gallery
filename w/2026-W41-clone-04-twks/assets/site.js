// kvlo — twks 모작 상호작용. 라이브러리 없음. 원본 Alpine + GSAP + Lenis 동작을 실측값으로 옮김.
(() => {
  const d = document, root = d.documentElement, body = d.body;
  root.classList.add('js');
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const isHome = body.classList.contains('home');
  const nav = $('.nav');
  const lg = () => innerWidth >= 1024;

  // ── 잠금(모달·메뉴) ──
  let locks = 0;
  const lock = () => { locks++; body.classList.add('is-locked'); };
  const unlock = () => { locks = Math.max(0, locks - 1); if (!locks) body.classList.remove('is-locked'); };

  // ── 홈 인트로: 검은 화면 → 로고·부제 글자 → 양옆으로 갈라짐 → 사진 → 메뉴 글자 (원본 녹화 1.78s~5.4s) ──
  if (isHome) {
    const logo = $('.n-logo', nav), sub = $('.n-sub', nav);
    if (reduce || !lg()) { body.classList.add('intro-done'); }
    else {
      body.classList.add('intro-wait');
      const lr = logo.getBoundingClientRect(), sr = sub.getBoundingClientRect();
      const w = lr.width + 24 + sr.width, x0 = (innerWidth - w) / 2;
      logo.style.setProperty('--lx', (x0 - lr.left) + 'px');
      sub.style.setProperty('--sx', (x0 + lr.width + 24 - sr.left) + 'px');
      requestAnimationFrame(() => { body.classList.add('intro-play'); body.classList.remove('intro-wait'); });
      setTimeout(() => body.classList.add('intro-done'), 2250);
      setTimeout(() => startSlides(), 2150);
    }
  }

  // ── 홈 히어로 슬라이드 (3.6s 간격, 새 장 scale 1.2 → 1 · 2.5s) ──
  let slideTimer;
  function startSlides() {
    const slides = $$('.slide'); if (slides.length < 2) return;
    let i = 0;
    const next = () => { slides[i].classList.remove('is-on'); i = (i + 1) % slides.length; slides[i].classList.add('is-on'); };
    if (!reduce) slideTimer = setInterval(next, 3604);
  }
  if (isHome && (reduce || !lg())) startSlides();

  // ── 스크롤 연동: 홈 헤더 위치 · 히어로 확대 · 푸터 올라옴 · 헤더 숨김 ──
  const zoom = $('.hero-zoom');
  const foot = $('.foot');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    if (isHome && lg()) {
      const start = vh / 2 - 21;
      nav.style.setProperty('--ny', Math.max(0, start - y) + 'px');
    }
    if (zoom && !reduce) {
      const p = clamp(y / vh, 0, 1);
      zoom.style.transform = `scale(${1 + p})`;
      zoom.style.opacity = String(1 - p);
    }
    if (foot) {
      const max = root.scrollHeight - vh;
      const p = clamp((y - (max - vh)) / vh, 0, 1);
      foot.style.translate = `0 ${(80 * (1 - p)).toFixed(3)}%`;
      nav.classList.toggle('is-out', p > .985 && !d.querySelector('.cp.is-open, .chat.is-open'));
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // ── 등장: 미디어 · 테두리 · 문단 ──
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.media.lazy, .bt[data-draw], [data-rise]').forEach((el) => io.observe(el));

  // ── 커서 라벨 ──
  const tip = $('.tip');
  if (tip) {
    let on = null;
    d.addEventListener('pointermove', (e) => {
      const t = e.target.closest && e.target.closest('[data-tip]');
      if (t !== on) { on = t; tip.textContent = t ? t.dataset.tip : ''; tip.classList.toggle('is-on', !!t); }
      if (t) { const left = t.hasAttribute('data-tip-left'); tip.style.transform = `translate(${e.clientX + (left ? -tip.offsetWidth - 16 : 16)}px, ${e.clientY + 16}px)`; }
    });
    d.addEventListener('pointerleave', () => tip.classList.remove('is-on'));
  }

  // ── 드롭다운(services): 호버는 CSS, 키보드·클릭은 여기 ──
  $$('.has-sub').forEach((li) => {
    const b = $('.sub-btn', li);
    const set = (v) => { b.setAttribute('aria-expanded', v); li.classList.toggle('is-open', v); };
    b.addEventListener('click', () => set(b.getAttribute('aria-expanded') !== 'true'));
    li.addEventListener('mouseenter', () => set(true));
    li.addEventListener('mouseleave', () => set(false));
    li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) set(false); });
    li.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); b.focus(); } });
    d.addEventListener('click', (e) => { if (!li.contains(e.target)) set(false); });
  });

  // ── 레이어 공통(연락 패널·채팅·모바일 메뉴): 열기·닫기·ESC·바깥·포커스 가둠/복귀 ──
  const ov = $('.ov');
  const layers = [];
  function layer(el, { onOpen, onClose, overlay = true } = {}) {
    let opener = null;
    const L = {
      el, open(from) {
        if (L.isOpen) return;
        layers.filter((x) => x !== L && x.isOpen && x.el !== $('.mnav')).forEach((x) => x.close(true));
        opener = from || d.activeElement; L.isOpen = true;
        el.hidden = false; el.removeAttribute('inert'); requestAnimationFrame(() => el.classList.add('is-open'));
        if (overlay && ov) ov.classList.add('is-on');
        lock(); onOpen && onOpen();
        setTimeout(() => { const f = el.querySelector('[data-autofocus]') || el.querySelector('button, a, input, textarea'); f && f.focus({ preventScroll: true }); }, 60);
        $$('[aria-controls="' + el.id + '"]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
      },
      close(silent) {
        if (!L.isOpen) return;
        L.isOpen = false; el.classList.remove('is-open'); el.setAttribute('inert', '');
        if (overlay && ov && !layers.some((x) => x.isOpen && x !== L)) ov.classList.remove('is-on');
        unlock(); onClose && onClose();
        $$('[aria-controls="' + el.id + '"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
        if (!silent && opener && opener.focus) opener.focus({ preventScroll: true });
      },
    };
    el.setAttribute('inert', '');
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('a[href], button:not([disabled]), input:not([type=hidden]):not([disabled]), textarea, [tabindex]:not([tabindex="-1"])', el).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); }
    });
    layers.push(L); return L;
  }
  d.addEventListener('keydown', (e) => { if (e.key === 'Escape') { const top = [...layers].reverse().find((x) => x.isOpen); if (top) { e.preventDefault(); top.close(); } } });
  ov && ov.addEventListener('click', () => layers.filter((x) => x.isOpen).forEach((x) => x.close()));

  // 연락 패널
  const cpEl = $('#contact');
  const cp = cpEl && layer(cpEl);
  $$('[data-open="contact"]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); cp.isOpen ? cp.close() : cp.open(b); if (mnavL && mnavL.isOpen) mnavL.close(true); }));
  $$('[data-close="contact"]').forEach((b) => b.addEventListener('click', () => cp.close()));

  // 시계·시각 (Europe/Zurich)
  const zurich = () => { const s = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Zurich', hour12: false }); const t = s.split(', ')[1] || s; return t.split(':').map(Number); };
  function tickClock() {
    const [h, m, s] = zurich();
    $$('[data-time]').forEach((el) => { el.textContent = [h, m, s].map((n) => String(n).padStart(2, '0')).join(':'); });
    const hh = $('.clock .hh'), mm = $('.clock .mm'), ss = $('.clock .ss');
    if (hh) { hh.setAttribute('transform', `rotate(${(h % 12) * 30 + m * .5} 50 50)`); mm.setAttribute('transform', `rotate(${m * 6 + s * .1} 50 50)`); ss.setAttribute('transform', `rotate(${s * 6} 50 50)`); }
  }
  tickClock(); setInterval(tickClock, 1000);

  // ── 채팅 문의 (원본 typeform 말풍선 흐름) ──
  const chatEl = $('#chat');
  let chat;
  if (chatEl) {
    const thread = $('.thread', chatEl), scroller = $('.chat-scroll', chatEl);
    const host = chatEl.dataset.host || 'Lena';
    let started = false, data = {};
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const bubble = (cls, html) => { const b = d.createElement('div'); b.className = 'b ' + cls; b.innerHTML = html; thread.appendChild(b); requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('is-in'))); setTimeout(() => scroller.scrollTo({ top: scroller.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }), 60); return b; };
    const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
    const say = async (html) => { await wait(650); bubble('host', html); };
    const err = (form, msg) => { const e = $('.f-err', form); e.textContent = msg; e.hidden = false; };
    const field = (step) => new Promise((resolve) => {
      const id = 'q-' + step.name;
      let inner = '';
      if (step.type === 'text' || step.type === 'email') inner = `<label class="f-label" for="${id}">${step.label}</label><input class="f-in" id="${id}" name="${step.name}" type="${step.type}" autocomplete="${step.ac || 'off'}">` + (step.extra ? `<input class="f-in" id="${id}-2" name="${step.extra.name}" type="${step.extra.type}" placeholder="${step.extra.label}" aria-label="${step.extra.label}" autocomplete="tel">` : '');
      else if (step.type === 'textarea') inner = `<label class="f-label" for="${id}">${step.label}</label><textarea class="f-in" id="${id}" name="${step.name}"></textarea>`;
      else if (step.type === 'check' || step.type === 'radio') inner = `<fieldset style="border:0;margin:0;padding:0"><legend class="sr-only">${step.label}</legend><div class="opts">` + step.options.map((o, i) => `<label class="opt"><span>${o}</span><input type="${step.type === 'check' ? 'checkbox' : 'radio'}" name="${step.name}" value="${esc(o)}"></label>`).join('') + `</div></fieldset>`;
      else if (step.type === 'range') inner = `<label class="sr-only" for="${id}">${step.label}</label><div class="range-label" aria-hidden="true">${step.label} <strong data-rl>${step.options[0]}</strong></div><input class="range" id="${id}" type="range" min="0" max="${step.options.length - 1}" step="1" value="0" aria-valuetext="${esc(step.options[0])}">`;
      const b = bubble('me form', `<form novalidate>${inner}<span class="f-err" role="alert" hidden></span><div class="send-row"><button class="send" type="submit">Send</button></div></form>`);
      const form = $('form', b);
      const rng = $('.range', form);
      if (rng) rng.addEventListener('input', () => { const t = step.options[rng.value]; $('[data-rl]', form).textContent = t; rng.setAttribute('aria-valuetext', t); rng.style.setProperty('--pct', (rng.value / (step.options.length - 1) * 100) + '%'); });
      setTimeout(() => { const f = form.querySelector('input, textarea'); f && f.focus({ preventScroll: true }); }, reduce ? 0 : 450);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let v;
        if (step.type === 'check') { v = $$('input:checked', form).map((x) => x.value); if (!v.length) return err(form, 'Choose at least one option.'); }
        else if (step.type === 'radio') { const c = $('input:checked', form); if (!c) return err(form, 'Choose one option.'); v = c.value; }
        else if (step.type === 'range') v = step.options[rng.value];
        else {
          const inp = form.querySelector('input, textarea'); v = inp.value.trim();
          if (step.required !== false && !v) { inp.setAttribute('aria-invalid', 'true'); inp.focus(); return err(form, 'This field is required.'); }
          if (step.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { inp.setAttribute('aria-invalid', 'true'); inp.focus(); return err(form, 'Check the email format.'); }
          if (step.extra) { const ph = $('#' + id + '-2', form).value.trim(); if (ph && !/^[+()\d\s-]{6,}$/.test(ph)) return err(form, 'Check the phone number.'); data[step.extra.name] = ph; }
        }
        $('.f-err', form).hidden = true;
        $$('input, textarea, button', form).forEach((x) => { x.disabled = true; x.removeAttribute('aria-invalid'); });
        b.classList.add('done');
        data[step.name] = v; resolve(v);
      });
    });
    const run = async () => {
      if (started) return; started = true;
      await say(`<p>Hello.<br>I'm ${host}. I'll be your contact while we shape your project together.</p>`);
      await say(`<p>If you have two minutes, answer a few questions so we understand what you need. If not, write to me at <a href="mailto:${chatEl.dataset.mail}">${chatEl.dataset.mail}</a></p>`);
      await wait(500); bubble('me', `<p>Nice to meet you, ${host}.</p>`);
      const name = await field({ name: 'name', type: 'text', label: 'My name is', ac: 'name' });
      await say(`<p>Nice to meet you, ${esc(name)}.</p>`); await say('<p>Which company do you work for?</p>');
      await field({ name: 'company', type: 'text', label: 'I work for', ac: 'organization' });
      await say('<p>Noted.</p>'); await say('<p>What brings you to kvlo today?</p>');
      await field({ name: 'services', type: 'check', label: 'Services', options: ['A new brand identity, or a rework of the current one.', 'A brand or communication strategy.', 'An advertising campaign.', 'Content for social media, print or the website.', 'A new or updated website.', 'Something else.'] });
      await say('<p>How urgent is it?</p>');
      await field({ name: 'urgency', type: 'range', label: 'My project is', options: ['Not urgent.', 'Planned for next season.', 'Due in a few weeks.', 'Due very soon.', 'Already late.'] });
      await say('<p>And how much room do we have?</p>');
      await field({ name: 'freedom', type: 'range', label: 'Creative freedom', options: ['Strict guidelines.', 'Some room.', 'Open to proposals.', 'Surprise us.'] });
      await say('<p>Have you worked with a studio before?</p>');
      await field({ name: 'experience', type: 'radio', label: 'My past experience', options: ['Yes, regularly.', 'Once or twice.', 'No, this is the first time.'] });
      await say('<p>Anything else we should know?</p>');
      await field({ name: 'extra', type: 'textarea', label: 'Extra information', required: false });
      await say('<p>Thank you.</p>'); await say('<p>How can we reach you?</p>');
      await field({ name: 'email', type: 'email', label: 'Email address', ac: 'email', extra: { name: 'phone', type: 'tel', label: 'Phone number (optional)' } });
      await say('<p>Last one. How did you hear about us?</p>');
      await field({ name: 'reference', type: 'radio', label: 'Reference', options: ['One of your clients', 'A friend or colleague', 'Someone at kvlo', 'Social media', 'A search engine', 'Other'] });
      await say(`<p>Thank you, ${esc(data.name)}. This is a demo page, so nothing was sent. In a real studio, I would reply within two working days.</p>`);
    };
    chat = layer(chatEl, { onOpen: run });
    $$('[data-open="chat"]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); chat.open(b); }));
    $$('[data-close="chat"]').forEach((b) => b.addEventListener('click', () => chat.close()));
  }

  // ── 모바일 메뉴 ──
  const mnav = $('.mnav');
  var mnavL = mnav && layer(mnav, { overlay: false, onOpen: () => nav.classList.add('menu-open'), onClose: () => nav.classList.remove('menu-open') });
  $$('[data-open="menu"]').forEach((b) => b.addEventListener('click', () => (mnavL.isOpen ? mnavL.close() : mnavL.open(b))));
  $$('.mnav [data-sub]').forEach((b) => b.addEventListener('click', () => { const s = b.nextElementSibling; const o = !s.classList.contains('is-open'); s.classList.toggle('is-open', o); b.setAttribute('aria-expanded', o); }));
  addEventListener('resize', () => { if (lg() && mnavL && mnavL.isOpen) mnavL.close(true); });

  // ── 뉴스레터 (푸터 · 글 끝) ──
  $$('[data-nl]').forEach((wrap) => {
    const btn = $('[data-nl-open]', wrap), form = $('form', wrap), msg = $('.nl-msg, .art-msg', wrap), inp = $('input', form);
    btn.addEventListener('click', () => { form.hidden = false; btn.setAttribute('aria-expanded', 'true'); inp.focus(); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = inp.value.trim();
      msg.className = msg.className.replace(/ ?(err|ok)/g, '');
      if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { inp.setAttribute('aria-invalid', 'true'); msg.classList.add('err'); msg.textContent = v ? '✗ Check the email format.' : '✗ Enter your email.'; return; }
      inp.removeAttribute('aria-invalid'); msg.classList.add('ok'); msg.textContent = 'Thank you. Nothing was sent: demo page.'; inp.value = '';
    });
  });

  // ── 프로젝트 필터 (Services / Industries 탭 + 선택 · Reset) ──
  const flt = $('[data-filter]');
  if (flt) {
    const tabs = $$('[role=tab]', flt), lists = $$('.f-list', flt), reset = $('.f-reset', flt);
    const cards = $$('[data-sv]'), empty = $('.f-empty');
    const sel = { sv: null, ind: null };
    const match = (c, k, v) => !v || c.dataset[k].split(' ').includes(v);
    function apply() {
      let n = 0;
      cards.forEach((c) => { const ok = match(c, 'sv', sel.sv) && match(c, 'ind', sel.ind); c.classList.toggle('is-hidden', !ok); if (ok) n++; });
      $$('.f-opt', flt).forEach((o) => {
        const k = o.dataset.k, v = o.dataset.v, other = k === 'sv' ? 'ind' : 'sv';
        o.setAttribute('aria-pressed', sel[k] === v);
        o.disabled = !cards.some((c) => match(c, k, v) && match(c, other, sel[other]));
      });
      tabs.forEach((t) => { const s = $('sup', t); s.hidden = !sel[t.dataset.k]; });
      reset.hidden = !(sel.sv || sel.ind);
      empty.hidden = n > 0;
      const live = $('.f-live'); if (live) live.textContent = n + ' projects';
    }
    tabs.forEach((t) => t.addEventListener('click', () => {
      tabs.forEach((x) => x.setAttribute('aria-selected', x === t));
      lists.forEach((l) => { const on = l.id === t.getAttribute('aria-controls'); l.hidden = !on; l.classList.remove('is-on'); if (on) requestAnimationFrame(() => requestAnimationFrame(() => l.classList.add('is-on'))); });
    }));
    tabs.forEach((t, i) => t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); const n = tabs[(i + 1) % tabs.length]; n.focus(); n.click(); } }));
    $$('.f-opt', flt).forEach((o) => o.addEventListener('click', () => { const k = o.dataset.k; sel[k] = sel[k] === o.dataset.v ? null : o.dataset.v; apply(); }));
    reset.addEventListener('click', () => { sel.sv = sel.ind = null; apply(); tabs[0].focus(); });
    requestAnimationFrame(() => lists[0].classList.add('is-on'));
    apply();
  }

  // ── 아카이브: 줄에 올리면 왼쪽 사진 · 줄 강조 ──
  const archImg = $('.arch-img');
  if (archImg) {
    const srcs = JSON.parse(archImg.dataset.srcs), im = $('img', archImg);
    srcs.forEach((s) => { const p = new Image(); p.src = s; });
    const show = (row) => { $$('.arch-row.is-on').forEach((r) => r.classList.remove('is-on')); row.classList.add('is-on'); im.src = srcs[+row.dataset.img]; };
    $$('.arch-row').forEach((r) => { r.addEventListener('mouseenter', () => show(r)); r.addEventListener('focusin', () => show(r)); });
    const first = $('.arch-row'); first && show(first);
  }

  // ── 스크롤 아코디언(에이전시 Approach · 서비스): 고정 구간 진행도로 항목이 열린다 ──
  $$('.sacc').forEach((s) => {
    const items = $$('.sitem', s), imgs = $$('.sacc-img img', s);
    let cur = -1;
    const set = (i) => {
      if (i === cur) return; cur = i;
      items.forEach((it, k) => it.classList.toggle('is-on', k === i));
      imgs.forEach((im, k) => { im.classList.toggle('was-on', im.classList.contains('is-on') && k !== i); im.classList.toggle('is-on', k === i); });
      setTimeout(() => imgs.forEach((im, k) => { if (k !== i) im.classList.remove('was-on'); }), 950);
    };
    const upd = () => {
      if (!lg()) { items.forEach((it) => it.classList.add('is-on')); return; }
      const r = s.getBoundingClientRect(); const span = s.offsetHeight - innerHeight;
      const p = clamp(-r.top / Math.max(1, span), 0, .9999);
      set(Math.floor(p * items.length));
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  });

  // ── 고객 목록: 화면 가운데 줄에 온 이름이 검게, 오른쪽 사각 사진이 바뀐다 ──
  const cust = $('.cust');
  if (cust) {
    const list = $('.cust-list', cust), lis = $$('li', list), th = $('.cust-thumb', cust), srcs = JSON.parse(th.dataset.srcs), tim = $('img', th);
    srcs.forEach((s) => { const p = new Image(); p.src = s; });
    const on = (i) => { lis.forEach((l, k) => l.classList.toggle('is-on', k === i)); if (tim.getAttribute('src') !== srcs[i]) tim.src = srcs[i]; };
    let hover = -1;
    lis.forEach((l, k) => { l.addEventListener('mouseenter', () => { hover = k; on(k); }); l.addEventListener('mouseleave', () => { hover = -1; upd(); }); l.addEventListener('focusin', () => on(k)); });
    function upd() {
      if (!lg()) return;
      const r = cust.getBoundingClientRect(); const span = cust.offsetHeight - innerHeight;
      const p = clamp(-r.top / Math.max(1, span), 0, 1);
      const lh = lis[0].offsetHeight, total = lh * lis.length;
      const y = innerHeight / 2 - lh / 2 - p * (total - lh);
      list.style.transform = `translateY(${y}px)`;
      if (hover < 0) on(clamp(Math.round(p * (lis.length - 1)), 0, lis.length - 1));
    }
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  // ── 상세: See more · See all credits ──
  $$('[data-toggle]').forEach((b) => {
    const box = b.closest('[data-box]');
    b.addEventListener('click', () => { const o = !box.classList.contains('is-open'); box.classList.toggle('is-open', o); $$('[data-toggle]', box).forEach((x) => x.setAttribute('aria-expanded', o)); const c = $('#' + b.getAttribute('aria-controls')); c && c.toggleAttribute('inert', !o); });
  });

  // ── 글: 링크 복사 · 공유 주소 ──
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const t = $('span', b); const old = t.textContent;
    try { await navigator.clipboard.writeText(location.href); } catch (e) { const ta = d.createElement('textarea'); ta.value = location.href; d.body.appendChild(ta); ta.select(); try { d.execCommand('copy'); } catch (x) {} ta.remove(); }
    t.textContent = 'Copied! ✓'; setTimeout(() => (t.textContent = old), 1800);
  }));
  $$('[data-share]').forEach((a) => { const u = encodeURIComponent(location.href); a.href = a.dataset.share.replace('{u}', u); });

  // ── 인사이트 벽돌 배치: 가장 짧은 열에 차례로 ──
  const mas = $('[data-masonry]');
  if (mas) {
    const items = $$('.card', mas);
    const layout = () => {
      const n = innerWidth < 768 ? 1 : innerWidth < 1024 ? 2 : innerWidth < 1280 ? 3 : 4;
      if (mas.dataset.n == n) return; mas.dataset.n = n;
      mas.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`;
      $$('.mcol', mas).forEach((c) => c.remove());
      const cols = Array.from({ length: n }, () => { const c = d.createElement('div'); c.className = 'mcol'; mas.appendChild(c); return c; });
      const h = new Array(n).fill(0);
      items.forEach((it) => { const k = h.indexOf(Math.min(...h)); cols[k].appendChild(it); const ar = (it.dataset.ar || '1/1').split('/'); h[k] += ar[1] / ar[0] + .18; });
    };
    layout(); addEventListener('resize', layout);
  }

  // ── ASCII 고양이 (원본: 글자로 그린 표범 영상 루프 → 캔버스 2D 로 직접 그림) ──
  $$('canvas[data-ascii]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    const off = d.createElement('canvas'), o = off.getContext('2d', { willReadFrequently: true });
    const CW = 6, CH = 8, mode = cv.dataset.ascii; // run | sit
    const RAMP = ['K', 'V', 'L', 'O', '+', ':', '.'];
    let W, H, cols, rows, t0 = performance.now(), visible = true;
    const fit = () => { const r = cv.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); cols = Math.ceil(W / CW); rows = Math.ceil(H / CH); off.width = cols; off.height = rows; };
    const seg = (x1, y1, x2, y2, w) => { o.lineWidth = w; o.beginPath(); o.moveTo(x1, y1); o.lineTo(x2, y2); o.stroke(); };
    const ell = (x, y, rx, ry, r = 0) => { o.beginPath(); o.ellipse(x, y, rx, ry, r, 0, 7); o.fill(); };
    // 다리: 엉덩이/어깨(hx,hy)에서 무릎·발목·발. ph = 걸음 위상
    function leg(hx, hy, ph, L, w, back) {
      const swing = Math.sin(ph) * .62, lift = Math.max(0, Math.sin(ph + (back ? 2.2 : 1.6)));
      const a1 = swing + (back ? .25 : -.05);
      const kx = hx + Math.sin(a1) * L * .48, ky = hy + Math.cos(a1) * L * .48;
      const a2 = a1 + (back ? -.9 - lift * .7 : .35 + lift * 1.1);
      const fx = kx + Math.sin(a2) * L * .5, fy = ky + Math.cos(a2) * L * .5;
      seg(hx, hy, kx, ky, w); seg(kx, ky, fx, fy, w * .62); seg(fx, fy, fx + 16, fy + 2, w * .5);
    }
    // 원본 표범 크기(1440 기준 약 730×320px, 화면 아래 중앙 왼쪽)를 px 좌표로 그린 뒤 글자 칸으로 줄인다
    function cat(t) {
      o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, cols, rows);
      o.setTransform(1 / CW, 0, 0, 1 / CH, 0, 0);
      o.fillStyle = '#fff'; o.strokeStyle = '#fff'; o.lineCap = 'round'; o.lineJoin = 'round';
      if (mode === 'sit') {
        const k = Math.min(W / 1440, H / 900) * 1.05, sx = W / 2, by = H * .93;
        o.save(); o.translate(sx, by); o.scale(k, k);
        ell(0, -170, 120, 175, -.05); ell(-20, -330, 92, 110, .1);
        ell(10, -500, 62, 56); o.beginPath(); o.moveTo(-30, -530); o.lineTo(-22, -610); o.lineTo(8, -545); o.fill();
        o.beginPath(); o.moveTo(22, -545); o.lineTo(48, -612); o.lineTo(64, -520); o.fill();
        seg(-5, -400, 10, -470, 70);
        seg(50, -250, 70, -20, 30); seg(-70, -230, -60, -10, 34);
        o.lineWidth = 26; o.beginPath(); o.moveTo(-110, -40); o.bezierCurveTo(-260, 0, -300 + Math.sin(t * 1.4) * 30, -10, -250, -160 + Math.sin(t * 1.4) * 20); o.stroke();
        ell(0, -8, 190, 14);
        o.restore(); return;
      }
      const k = Math.min(1, W / 1440), ph = t * 6.2;
      o.save(); o.translate(W * .44, H - 30 * k); o.scale(k, k);
      const bob = Math.sin(ph * 2) * 5, st = Math.sin(ph) * 10;
      o.translate(0, bob);
      // 몸통 (엉덩이 x≈-150 · 어깨 x≈150, 바닥 y=0)
      ell(0, -205, 185 + st * .4, 46, -.02);
      ell(-150, -205, 70, 62, -.15);
      ell(140, -200, 78, 66, .12);
      ell(20, -180, 120, 34, 0);
      // 목·머리
      seg(190, -225, 255, -255, 54);
      ell(290, -262, 50, 34, .12);
      ell(328, -248, 22, 15, .3);
      o.beginPath(); o.moveTo(262, -288); o.lineTo(270, -312); o.lineTo(286, -292); o.fill();
      // 꼬리: 엉덩이에서 왼쪽 아래로 길게
      o.lineWidth = 15; o.beginPath(); o.moveTo(-210, -225);
      o.bezierCurveTo(-290, -200 + Math.sin(ph) * 6, -360, -110, -440, -95 + Math.sin(ph + .6) * 10); o.stroke();
      o.lineWidth = 11; o.beginPath(); o.moveTo(-440, -95 + Math.sin(ph + .6) * 10); o.quadraticCurveTo(-470, -90, -500, -86 + Math.sin(ph + 1.2) * 12); o.stroke();
      // 다리 (먼 쪽은 옅게)
      o.globalAlpha = .6; leg(-150, -190, ph + Math.PI, 205, 34, true); leg(150, -185, ph + .9, 200, 28, false);
      o.globalAlpha = 1; leg(-165, -185, ph + 2.4, 210, 40, true); leg(135, -180, ph + .1 + Math.PI, 205, 32, false);
      o.restore();
    }
    function frame(now) {
      if (!visible) return requestAnimationFrame(frame);
      const t = reduce ? 0 : (now - t0) / 1000;
      cat(t);
      const px = o.getImageData(0, 0, cols, rows).data;
      ctx.clearRect(0, 0, W, H);
      ctx.font = '400 8px "Space Mono", monospace'; ctx.textBaseline = 'top';
      for (let y = 0; y < rows; y++) {
        // 위쪽(등)일수록 촘촘한 글자
        for (let x = 0; x < cols; x++) {
          const a = px[(y * cols + x) * 4 + 3]; if (a < 40) continue;
          let up = 0; for (let k = 1; k <= 3; k++) if (y - k >= 0 && px[((y - k) * cols + x) * 4 + 3] < 40) up++;
          const n = (Math.sin(x * 12.9898 + y * 78.233 + Math.floor(t * 8)) * 43758.5453) % 1;
          let idx = up >= 2 ? 0 : up === 1 ? 1 : a < 200 ? 5 : 2 + Math.floor(Math.abs(n) * 5);
          if (Math.abs(n) > .8) idx = 6;
          if (Math.abs(n) > .93 && !up) continue;
          const g = up ? 205 : a < 200 ? 95 : 120 + Math.floor(Math.abs(n) * 60);
          ctx.fillStyle = `rgb(${g},${g},${g})`;
          ctx.fillText(RAMP[Math.min(idx, 6)], x * CW, y * CH);
        }
      }
      if (!reduce) requestAnimationFrame(frame);
    }
    fit(); addEventListener('resize', fit);
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(cv);
    requestAnimationFrame(frame);
  });
})();
