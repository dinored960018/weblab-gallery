// VARNELO — 동작: 등장 모션 · 메뉴 · 필터 탭 · 아코디언 · 후기 슬라이더 · 라이트박스 · 폼 검증 · 단어 스크럽 · 숫자 굴림
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 히어로 로드 등장 (원본 GSAP: 제목 y40 → 0, 설명 +0.1s, 버튼 +0.2s, 링 y50 scale .8 → 1)
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('ready')));

  // 스크롤 등장
  const targets = $$('[data-r], [data-split], .cardrise, .trow, .trip, .testi-top, .f-left, .f-word, .odo');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach((t) => io.observe(t));
  } else targets.forEach((t) => t.classList.add('in'));

  // About 문단: 스크롤에 따라 단어가 하나씩 (원본 gsap_split_word · opacity 0→1 · y 8→0 스크럽)
  const words = $('[data-words]');
  if (words) {
    const ws = $$('.w', words);
    const upd = () => {
      const r = words.getBoundingClientRect(); const vh = innerHeight;
      // 문단 위가 화면 아래 90% 에 닿을 때 시작, 화면 40% 에 닿을 때 끝
      const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.5)));
      const span = 6; // 한 번에 번지는 단어 수
      ws.forEach((w, i) => {
        const o = Math.min(1, Math.max(0, p * (ws.length + span) - i) / span);
        w.style.setProperty('--o', o.toFixed(3));
      });
    };
    if (reduce) ws.forEach((w) => w.style.setProperty('--o', 1));
    else { addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd(); }
  }

  // 모바일 메뉴 (열린 동안 배경 스크롤 잠금 · ESC · 바깥 클릭)
  const burger = $('.burger'), mnav = $('#mnav');
  if (burger && mnav) {
    const set = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mnav.hidden = !open;
      document.documentElement.classList.toggle('locked', open);
      document.body.classList.toggle('locked', open);
      if (open) $('a', mnav)?.focus();
    };
    burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mnav.hidden) { set(false); burger.focus(); } });
    document.addEventListener('click', (e) => { if (!mnav.hidden && !mnav.contains(e.target) && !burger.contains(e.target)) set(false); });
    addEventListener('resize', () => { if (innerWidth > 991 && !mnav.hidden) set(false); });
  }

  // 투어 필터 탭 (원본 Webflow 탭: All · Adventure · Luxury · Family)
  const tabs = $$('.tab');
  if (tabs.length) {
    const rows = $$('#tour-list .trow'); const live = $('[data-f-live]');
    const apply = (btn, focus) => {
      tabs.forEach((t) => { const on = t === btn; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      const f = btn.dataset.f; let n = 0;
      rows.forEach((r) => {
        const show = f === 'all' || r.dataset.cat === f;
        r.hidden = !show;
        if (show) { r.classList.toggle('alt', n % 2 === 1); n++; r.classList.remove('in'); requestAnimationFrame(() => requestAnimationFrame(() => r.classList.add('in'))); }
      });
      if (live) live.textContent = `${n} tour${n === 1 ? '' : 's'} shown`;
      if (focus) btn.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => apply(t));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); apply(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); apply(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); apply(tabs[tabs.length - 1], true); }
      });
    });
  }

  // 아코디언 (원본: 여러 개 동시에 열림 · 78 → 142px)
  $$('.acc-b').forEach((b) => {
    const p = document.getElementById(b.getAttribute('aria-controls'));
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      if (open) {
        p.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('open')));
      } else {
        p.classList.remove('open');
        const done = () => { if (b.getAttribute('aria-expanded') === 'false') p.hidden = true; };
        if (reduce) done(); else p.addEventListener('transitionend', done, { once: true });
      }
    });
  });

  // 후기 슬라이더 (5장 · 좌우 화살표 · 끝에서 처음으로)
  $$('.slider').forEach((s) => {
    const track = $('.sl-track', s), slides = $$('.slide', s), live = $('[data-sl-live]', s);
    let i = 0;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(${-100 * i}%)`;
      slides.forEach((sl, k) => sl.setAttribute('aria-hidden', String(k !== i)));
      if (live) live.textContent = `Review ${i + 1} of ${slides.length}`;
    };
    $('.prev', s).addEventListener('click', () => go(i - 1));
    $('.next', s).addEventListener('click', () => go(i + 1));
    s.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); });
  });

  // 라이트박스 (영상 · 갤러리 사진) — 닫기 버튼 · ESC · 바깥 클릭, 포커스 가둠·복귀
  const lb = $('#lb');
  if (lb) {
    const stage = $('.lb-stage', lb), x = $('.lb-x', lb); let back = null;
    const close = () => {
      lb.classList.remove('on'); document.documentElement.classList.remove('locked');
      const v = $('video', stage); if (v) v.pause();
      setTimeout(() => { lb.hidden = true; stage.innerHTML = ''; }, reduce ? 0 : 300);
      back?.focus();
    };
    const open = (html, from) => {
      back = from; stage.innerHTML = html; lb.hidden = false;
      document.documentElement.classList.add('locked');
      requestAnimationFrame(() => lb.classList.add('on'));
      x.focus();
    };
    $$('[data-video]').forEach((b) => b.addEventListener('click', () => open(`<video src="${b.dataset.video}" controls autoplay playsinline muted width="1280" height="720"></video>`, b)));
    $$('[data-img]').forEach((b) => b.addEventListener('click', () => { const im = $('img', b); open(`<img src="${b.dataset.img}" alt="${im.alt}" width="${im.width}" height="${im.height}">`, b); }));
    x.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target === stage) close(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { const f = $$('button, video', lb); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    });
  }

  // 폼: 전송하지 않고 검증 문구만
  const mailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  $$('.f-form').forEach((f) => {
    const inp = $('input', f), msg = $('.f-msg', f);
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = inp.value.trim();
      const bad = !v ? 'Enter an email address.' : !mailOk(v) ? 'Check the email format, e.g. name@example.com.' : '';
      inp.setAttribute('aria-invalid', String(!!bad));
      msg.classList.toggle('bad', !!bad);
      msg.textContent = bad || 'Thank you. This demo does not send email.';
      if (bad) inp.focus(); else inp.value = '';
    });
  });
  $$('.ct-form').forEach((f) => {
    const msg = $('.ct-msg', f);
    const check = (el) => {
      const v = el.value.trim(); let m = '';
      if (el.required && !v) m = el.tagName === 'SELECT' ? 'Choose a tour.' : 'Fill in this field.';
      else if (el.type === 'email' && v && !mailOk(v)) m = 'Check the email format, e.g. name@example.com.';
      else if (el.type === 'tel' && v && !/^[+()\d\s-]{6,}$/.test(v)) m = 'Use digits, spaces, and + only.';
      el.setAttribute('aria-invalid', String(!!m));
      const e = document.getElementById(el.id + '-e'); if (e) e.textContent = m;
      return !m;
    };
    // 고친 칸은 입력하는 동안 다시 검사(blur 에서 검사하면 오류 줄이 사라지며 제출 버튼이 밀린다)
    $$('input, select, textarea', f).forEach((el) => ['input', 'change'].forEach((t) => el.addEventListener(t, () => { if (el.getAttribute('aria-invalid') === 'true') check(el); })));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const els = $$('input, select, textarea', f); const bad = els.filter((el) => !check(el));
      if (bad.length) { msg.textContent = `${bad.length} field${bad.length > 1 ? 's need' : ' needs'} attention.`; bad[0].focus(); }
      else { msg.textContent = 'Thank you. Your request is noted. This demo does not send messages.'; f.reset(); els.forEach((el) => el.removeAttribute('aria-invalid')); }
    });
  });
})();
