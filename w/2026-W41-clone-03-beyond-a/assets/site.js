// WITHIN H. — 원본 동작(헤더 하위 메뉴 · 페이드 슬라이드 · 공유 · 라이트박스 · 영상 · 폼)을 직접 짠 스크립트
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const DESK = 900;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 헤더: 데스크톱 하위 메뉴(호버·포커스) · 모바일 메뉴 ──
  const nav = $('#header-nav');
  const toggle = $('.header-toggle');
  if (nav) {
    const subs = $$('li.has-sub-nav', nav);
    const anchor = () => {
      const nr = nav.getBoundingClientRect();
      subs.forEach((li) => {
        const a = $('.header-nav-row > a', li), sub = $('.header-sub-nav', li), inner = $('.header-sub-nav-inner', li);
        if (innerWidth < DESK) { sub.style.removeProperty('--anchor'); return; }
        sub.style.setProperty('--anchor', '0px');
        const raw = Math.max(0, Math.round(a.getBoundingClientRect().left - nr.left));
        const max = Math.max(0, Math.round(nr.width - inner.getBoundingClientRect().width - 16));
        sub.style.setProperty('--anchor', Math.min(raw, max) + 'px');
      });
    };
    const setSub = (li, open) => {
      li.classList.toggle('is-sub-open', open);
      const b = $('.header-sub-toggle', li);
      if (b) { b.setAttribute('aria-expanded', String(open)); b.setAttribute('aria-label', `${b.dataset.label} 하위 메뉴 ${open ? '닫기' : '열기'}`); }
    };
    const closeSubs = () => subs.forEach((li) => setSub(li, false));
    const setMenu = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      toggle.innerHTML = open
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.8"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="1.8"/></svg>';
      if (!open) closeSubs();
    };
    toggle && toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    subs.forEach((li) => {
      const b = $('.header-sub-toggle', li);
      b && b.addEventListener('click', (e) => {
        e.preventDefault();
        if (innerWidth >= DESK) return;
        const will = !li.classList.contains('is-sub-open');
        closeSubs(); setSub(li, will);
      });
      // 데스크톱: 호버로 열고, ESC·바깥 클릭으로 닫는다
      li.addEventListener('mouseenter', () => { if (innerWidth >= DESK) { anchor(); li.classList.remove('is-closed'); li.classList.add('is-hover'); } });
      li.addEventListener('mouseleave', () => li.classList.remove('is-hover', 'is-closed'));
      li.addEventListener('focusin', () => { if (innerWidth >= DESK) { anchor(); li.classList.remove('is-closed'); } });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const open = subs.find((li) => li.matches(':focus-within, .is-hover'));
      if (open && innerWidth >= DESK) {
        open.classList.add('is-closed'); open.classList.remove('is-hover');
        const a = $('.header-nav-row > a', open); if (open.contains(document.activeElement)) a.focus();
      }
      if (nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (innerWidth >= DESK && !nav.contains(e.target)) subs.forEach((li) => li.classList.remove('is-hover'));
    });
    $$('a', nav).forEach((a) => a.addEventListener('click', () => { if (innerWidth < DESK) setMenu(false); }));
    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { if (innerWidth >= DESK) setMenu(false); anchor(); }, 150); });
    anchor();
  }

  // ── 홈 슬라이드: 페이드 700ms · 5초 자동 · 반복 ──
  $$('[data-swiper]').forEach((el) => {
    const slides = $$('.swiper-slide', el), dots = $$('.swiper-pagination-bullet', el);
    let i = 0, timer = null, stopped = reduce;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        const on = k === i;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', String(!on));
        const a = $('a', s); on ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1');
        const im = $('img', s); if (on && im.loading === 'lazy') im.loading = 'eager';
      });
      dots.forEach((d, k) => { d.classList.toggle('is-active', k === i); k === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current'); });
    };
    const play = () => { clearInterval(timer); if (!stopped) timer = setInterval(() => go(i + 1), 5000); };
    const user = (n) => { stopped = true; clearInterval(timer); go(n); }; // 사용자가 넘기면 자동 넘김을 멈춘다
    $('.swiper-button-next', el).addEventListener('click', () => user(i + 1));
    $('.swiper-button-prev', el).addEventListener('click', () => user(i - 1));
    dots.forEach((d, k) => d.addEventListener('click', () => user(k)));
    el.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') user(i + 1); if (e.key === 'ArrowLeft') user(i - 1); });
    if (reduce) slides.forEach((s) => (s.style.transition = 'none'));
    play();
  });

  // ── 공유 ──
  const toast = (msg) => {
    let t = $('.share-toast');
    if (!t) { t = document.createElement('div'); t.className = 'share-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('is-visible');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('is-visible'), 2000);
  };
  const copy = (text) => {
    if (navigator.clipboard && isSecureContext) return navigator.clipboard.writeText(text);
    try {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); return Promise.resolve();
    } catch { return Promise.reject(); }
  };
  $$('.share[data-url]').forEach((box) => {
    const url = box.dataset.url, title = box.dataset.title;
    $('[data-share="copy"]', box).addEventListener('click', () => copy(url).then(() => toast('링크를 복사했습니다')).catch(() => toast('복사하지 못했습니다')));
    const nat = $('[data-share="native"]', box);
    if (nat && navigator.share && isSecureContext) {
      nat.hidden = false;
      nat.addEventListener('click', () => navigator.share({ title, url }).catch(() => {}));
    }
    $$('a[target="_blank"]', box).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); open(a.href, '_blank', 'width=600,height=500,noopener,noreferrer'); }));
  });

  // ── 라이트박스 ──
  const shots = $$('[data-lightbox]');
  if (shots.length) {
    const box = document.createElement('div');
    box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', '사진 보기');
    const ic = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
    box.innerHTML = `<button class="lightbox-close" type="button" aria-label="닫기">${ic('M5 5l14 14M19 5L5 19')}</button>
      <button class="lightbox-prev" type="button" aria-label="이전 사진">${ic('M15 5l-7 7 7 7')}</button>
      <button class="lightbox-next" type="button" aria-label="다음 사진">${ic('M9 5l7 7-7 7')}</button>
      <div class="lightbox-counter" aria-live="polite"></div>`;
    box.hidden = true;
    const pic = new Image(); pic.className = 'lightbox-image'; pic.alt = '';
    box.insertBefore(pic, $('.lightbox-next', box));
    document.body.appendChild(box);
    const im = pic, cnt = $('.lightbox-counter', box), prev = $('.lightbox-prev', box), next = $('.lightbox-next', box), close = $('.lightbox-close', box);
    let cur = 0, last = null;
    const show = (n) => { cur = (n + shots.length) % shots.length; im.src = shots[cur].dataset.src; im.alt = $('img', shots[cur]).alt || ''; cnt.textContent = shots.length > 1 ? `${cur + 1} / ${shots.length}` : ''; prev.hidden = next.hidden = shots.length < 2; };
    const openBox = (n) => { last = document.activeElement; show(n); box.hidden = false; void box.offsetWidth; box.classList.add('is-open'); document.body.style.overflow = 'hidden'; close.focus(); };
    const shut = () => { box.classList.remove('is-open'); document.body.style.overflow = ''; setTimeout(() => (box.hidden = true), 250); last && last.focus(); };
    shots.forEach((a, k) => a.addEventListener('click', (e) => { e.preventDefault(); openBox(k); }));
    close.addEventListener('click', shut);
    prev.addEventListener('click', () => show(cur - 1));
    next.addEventListener('click', () => show(cur + 1));
    box.addEventListener('click', (e) => { if (!e.target.closest('.lightbox-image, button, .lightbox-counter')) shut(); });
    document.addEventListener('keydown', (e) => {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') shut();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'Tab') {
        const f = [close, prev, next].filter((b) => !b.hidden);
        const i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
  }

  // ── 영상: 누르면 썸네일 자리에 플레이어를 넣는다 ──
  $$('.video-card-trigger[data-video]').forEach((b) => b.addEventListener('click', () => {
    const v = document.createElement('video');
    v.src = b.dataset.video; v.poster = b.dataset.poster; v.controls = true; v.playsInline = true; v.autoplay = !reduce;
    v.setAttribute('aria-label', b.getAttribute('aria-label').replace(/ 재생$/, ''));
    b.closest('.video-card-player').replaceChildren(v);
    v.focus();
  }));

  // ── 폼 검증(제출은 막고 메시지만 보인다) ──
  const MSG = { required: '필수 항목입니다', email: '이메일 형식이 아닙니다', tel: '숫자와 하이픈만 입력합니다', short: '10자 이상 입력합니다', agree: '필수 동의 항목입니다' };
  $$('form[data-form]').forEach((f) => {
    const err = (el, m) => {
      const box = el.type === 'checkbox' ? $('#' + el.dataset.err, f) : $('#' + el.id + '-error', f);
      if (box) box.textContent = m || '';
      el.setAttribute('aria-invalid', m ? 'true' : 'false');
    };
    const check = (el) => {
      const v = (el.value || '').trim();
      if (el.type === 'checkbox') { if (!el.required) return true; err(el, el.checked ? '' : MSG.agree); return el.checked; }
      if (el.required && !v) { err(el, MSG.required); return false; }
      if (v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { err(el, MSG.email); return false; }
      if (v && el.type === 'tel' && !/^[0-9-]{9,13}$/.test(v)) { err(el, MSG.tel); return false; }
      if (v && el.minLength > 0 && v.length < el.minLength) { err(el, MSG.short); return false; }
      err(el, ''); return true;
    };
    const fields = $$('input, textarea', f).filter((el) => el.name);
    fields.forEach((el) => el.addEventListener(el.type === 'checkbox' ? 'change' : 'blur', () => check(el)));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = fields.filter((el) => !check(el));
      const res = $('.stb_form_result', f);
      if (bad.length) { res.textContent = ''; bad[0].focus(); return; }
      res.textContent = f.dataset.form === 'event' ? '응모를 받았습니다. 당첨자는 발표일에 문자로 안내합니다.' : '구독 신청을 받았습니다. 확인 메일을 보냈습니다.';
      f.querySelector('button[type="submit"]').disabled = true;
    });
  });

  // ── 검색: ?q= 로 기사 목록을 거른다 ──
  const data = $('#search-data');
  if (data) {
    const list = JSON.parse(data.textContent);
    const input = $('#search-q'), out = $('#search-results'), count = $('#search-count'), msg = $('#search-msg');
    const root = location.pathname.replace(/search\/(index\.html)?$/, '');
    const q = (new URLSearchParams(location.search).get('q') || '').trim();
    input.value = q;
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    if (q.length >= 2) {
      const hit = list.filter((a) => [a.t, a.s, a.d, a.c, ...a.g].join(' ').toLowerCase().includes(q.toLowerCase()));
      count.textContent = `검색 결과 ${hit.length}건`;
      out.innerHTML = hit.map((a) => `<a class="card" href="${root}${a.u}index.html"><div class="card-image"><img src="${root}${a.i}" width="${a.w}" height="${a.h}" alt="${esc(a.t)}" loading="lazy"></div><div class="card-content"><div class="card-categories"><span>${esc(a.c)}</span></div><div class="card-title">${esc(a.t)}</div><div class="card-headline">${esc(a.s)}</div><div class="card-description">${esc(a.d)}</div><div class="tags card-tags">${a.g.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div></div></a>`).join('');
      if (!hit.length) msg.textContent = `‘${q}’에 맞는 기사가 없습니다`;
    } else if (q) {
      msg.textContent = '검색어를 두 글자 이상 입력합니다';
    }
    if (!q) input.focus();
  }
})();
