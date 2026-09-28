/* 새물 수영장 — 화면 동작. 데이터와 계산은 pool.js(window.SAEMUL). */
(() => {
  'use strict';
  const S = window.SAEMUL;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  // 시각 — ?t=2026-10-01T07:20 으로 바꿔 볼 수 있다(검수용)
  const clock = () => {
    const t = new URLSearchParams(location.search).get('t');
    const d = t ? new Date(t) : new Date();
    return isNaN(d) ? new Date() : d;
  };
  const md = (d) => `${S.pad(d.getMonth() + 1)}.${S.pad(d.getDate())}(${S.DAY[d.getDay()]})`;

  // ── 스크롤 잠금 — 메뉴와 모달이 같이 쓴다 ───────────
  const locks = new Set();
  const lock = (k, on) => {
    if (on) locks.add(k); else locks.delete(k);
    root.classList.toggle('is-locked', locks.size > 0);
  };

  // ── 모바일 메뉴 ───────────────────────────────────
  const burger = $('.burger');
  const nav = $('#nav');
  if (burger && nav) {
    const set = (open) => {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      lock('nav', open);
    };
    burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); burger.focus(); }
    });
    matchMedia('(min-width: 761px)').addEventListener('change', (e) => { if (e.matches) set(false); });
  }

  // ── 줄눈 맞춤 — .blk 높이를 24px 배수로 올린다 ───────
  const snap = (el) => {
    const cur = parseFloat(el.style.getPropertyValue('--snap')) || 0;
    const h = el.getBoundingClientRect().height - cur;
    const want = Math.ceil((h - 0.5) / 24) * 24;
    const extra = Math.max(0, Math.round((want - h) * 100) / 100);
    if (Math.abs(extra - cur) > 0.2) el.style.setProperty('--snap', extra + 'px');
  };
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((es) => es.forEach((e) => snap(e.target)));
    $$('.blk').forEach((el) => ro.observe(el));
  }

  // ── 지금 레인 ─────────────────────────────────────
  const lanesEl = $('#lanes');
  if (lanesEl) {
    const line = $('#now-line');
    const phase = (n) => ((n * 0.37 + 0.13) % 1).toFixed(3);
    const render = () => {
      const d = clock();
      const st = S.now(d);
      const t = `${md(d)} ${S.hm(d.getHours(), d.getMinutes())}`;
      let txt;
      if (st.state === 'swim') {
        const free = st.lanes.filter((l) => l.kind === '자유').length;
        txt = `${t} · ${st.from}~${st.to} · 자유 ${free}레인` + (free < 8 ? ` · 강습 ${8 - free}레인` : '');
      } else if (st.state === 'rest') txt = `${t} · 휴식 ${st.from}~${st.to}`;
      else if (st.state === 'check') txt = `${t} · 수질 점검 ${st.from}~${st.to}`;
      else if (st.state === 'before') txt = `${t} · 운영 전 · ${st.next} 시작`;
      else if (st.state === 'after') txt = `${t} · 운영 종료`;
      else txt = `${t} · 휴관 · ${st.why}`;
      line.textContent = txt;

      $$('.lane', lanesEl).forEach((li, i) => {
        const l = st.lanes[i];
        const on = !!l.kind;
        li.classList.toggle('is-on', on);
        li.classList.toggle('is-idle', !on);
        li.classList.toggle('is-class', l.kind === '강습');
        li.style.setProperty('--pace', l.pace || 6);
        li.style.setProperty('--at', phase(l.n));
        $('.lane-use', li).textContent = on ? `${l.kind} · ${l.label}` : '';
        $('.lane-cnt', li).textContent = on ? `${l.count}명` : '';
        li.setAttribute('aria-label', on
          ? `레인 ${l.n}, ${l.kind} ${l.label}, ${l.count}명`
          : `레인 ${l.n}, 비어 있음`);
      });
    };
    render();
    setInterval(render, 60000);

    // 오늘 자유수영
    const today = $('#today tbody');
    const d = clock();
    $('#today-day').textContent = md(d);
    const why = S.closedReason(d);
    if (why) {
      today.innerHTML = `<tr><td colspan="2">휴관 · ${why}</td></tr>`;
    } else {
      today.innerHTML = S.freeRuns(d.getDay()).map((r) => {
        const range = `<span class="num">${S.hm(r.start)}~${S.hm(r.end - 1, 50)}</span>`;
        const v = r.check ? '수질 점검' : `<span class="num">${r.free}</span>`;
        const cur = d.getHours() >= r.start && d.getHours() < r.end ? ' aria-current="time"' : '';
        return `<tr${cur}><td>${range}</td><td class="r">${v}</td></tr>`;
      }).join('');
    }
  }

  // ── 요일 탭 ───────────────────────────────────────
  const tablist = $('[role="tablist"]');
  if (tablist) {
    const tabs = $$('[role="tab"]', tablist);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t) => t.addEventListener('click', () => select(t, false)));
    tablist.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = tabs.length - 1;
      if (j === null) return;
      e.preventDefault();
      select(tabs[j], true);
    });
    const todayTab = tabs.find((t) => t.dataset.day === String(clock().getDay()));
    if (todayTab) select(todayTab, false);
  }

  // ── 강습 필터 ─────────────────────────────────────
  const filters = $('#filters');
  if (filters) {
    const cards = $$('#cls-list .cls');
    const result = $('#result');
    const empty = $('#empty');
    const list = $('#cls-list');
    const apply = () => {
      const f = Object.fromEntries(new FormData(filters));
      let n = 0;
      cards.forEach((c) => {
        const ok = (!f.level || c.dataset.level === f.level)
          && (!f.days || c.dataset.days === f.days)
          && (!f.band || c.dataset.band === f.band);
        c.hidden = !ok;
        if (ok) n++;
      });
      const any = f.level || f.days || f.band;
      result.innerHTML = any
        ? `반 <span class="num">${cards.length}</span>개 중 <span class="num">${n}</span>개`
        : `반 <span class="num">${cards.length}</span>개`;
      empty.hidden = n > 0;
      list.toggleAttribute('data-empty', n === 0);
    };
    filters.addEventListener('change', apply);
    $('#reset').addEventListener('click', () => { filters.reset(); apply(); $('input', filters).focus(); });
    apply();
  }

  // 강습 카드 → 상세: 누른 카드의 수준 이름만 전환 이름을 받는다
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.cls-lv');
    if (!a) return;
    $$('.vt-src').forEach((s) => { s.style.viewTransitionName = ''; });
    a.querySelector('.vt-src').style.viewTransitionName = 'level-title';
  });
  // bfcache 로 돌아왔을 때 이름을 지운다
  addEventListener('pageshow', () => $$('.vt-src').forEach((s) => { s.style.viewTransitionName = ''; }));

  // ── 요금 토글 ─────────────────────────────────────
  const feeSeg = $('#fee-seg');
  if (feeSeg) {
    const note = $('#fee-note');
    feeSeg.addEventListener('change', (e) => {
      const k = Number(e.target.value);
      $$('[data-fee]').forEach((td) => {
        td.textContent = Number(td.dataset.fee.split(',')[k]).toLocaleString('ko-KR');
      });
      note.textContent = (k ? '비구민' : '구민') + ' 요금 · 단위 원';
    });
  }

  // ── 휴관일 달력 ───────────────────────────────────
  const cal = $('#cal');
  if (cal) {
    let view = clock(); view = new Date(view.getFullYear(), view.getMonth(), 1);
    let opener = null;
    const draw = () => {
      const y = view.getFullYear(), m = view.getMonth();
      $('.cal-m', cal).textContent = `${y}.${S.pad(m + 1)}`;
      const first = new Date(y, m, 1).getDay();
      const last = new Date(y, m + 1, 0).getDate();
      const now = clock();
      const offs = [];
      let cells = '';
      for (let i = 0; i < first; i++) cells += '<td></td>';
      for (let day = 1; day <= last; day++) {
        const d = new Date(y, m, day);
        const why = S.closedReason(d);
        if (why) offs.push([d, why]);
        const today = S.ymd(d) === S.ymd(now);
        const cls = [why && 'is-off', today && 'is-today'].filter(Boolean).join(' ');
        cells += `<td${cls ? ` class="${cls}"` : ''}${today ? ' aria-current="date"' : ''}>${day}${why ? `<span class="sr"> 휴관</span>` : ''}</td>`;
        if ((first + day) % 7 === 0 && day < last) cells += '</tr><tr>';
      }
      $('tbody', cal).innerHTML = `<tr>${cells}</tr>`;
      $('.cal-list', cal).innerHTML = offs.map(([d, w]) =>
        `<li><span class="num">${d.getMonth() + 1}.${S.pad(d.getDate())}(${S.DAY[d.getDay()]})</span><span>${w}</span></li>`).join('');
    };
    const close = () => { cal.close(); };
    cal.addEventListener('close', () => { lock('cal', false); if (opener) opener.focus(); });
    $$('[data-cal]').forEach((b) => b.addEventListener('click', () => {
      opener = b;
      view = new Date(clock().getFullYear(), clock().getMonth(), 1);
      draw();
      cal.showModal();
      lock('cal', true);
    }));
    $$('[data-month]', cal).forEach((b) => b.addEventListener('click', () => {
      view = new Date(view.getFullYear(), view.getMonth() + Number(b.dataset.month), 1);
      draw();
    }));
    $('[data-close]', cal).addEventListener('click', close);
    // 바깥(backdrop) 클릭 — dialog 자체가 대상이고 좌표가 상자 밖일 때
    cal.addEventListener('click', (e) => {
      if (e.target !== cal) return;
      const r = cal.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) close();
    });
  }

  // ── 공지 검색 ─────────────────────────────────────
  const ntList = $('#nt-list');
  if (ntList) {
    const q = $('#q');
    const items = $$('li', ntList);
    const result = $('#nt-result');
    const empty = $('#nt-empty');
    const run = () => {
      const term = q.value.trim().toLowerCase();
      const cat = ($('input[name="cat"]:checked') || {}).value || '';
      let n = 0;
      items.forEach((li) => {
        const ok = (!cat || li.dataset.cat === cat) && (!term || li.dataset.title.toLowerCase().includes(term));
        li.hidden = !ok;
        if (ok) n++;
      });
      result.innerHTML = `<span class="num">${n}</span>건`;
      empty.hidden = n > 0;
      ntList.hidden = n === 0;
    };
    q.addEventListener('input', run);
    $$('input[name="cat"]').forEach((r) => r.addEventListener('change', run));
  }

  // ── 강습 접수 ─────────────────────────────────────
  const form = $('#apply');
  if (form) {
    const sel = $('#f-class'), name = $('#f-name'), tel = $('#f-tel'), agree = $('#f-agree');
    const sum = $('#form-sum'), ok = $('#form-ok');
    const pick = $('#pick');
    const FEES = window.SAEMUL_FEES || {};
    const show = () => {
      const c = S.CLASSES.find((x) => x.id === sel.value);
      const put = (k, v) => { $(`[data-k="${k}"]`, pick).innerHTML = v; };
      if (!c) { ['time', 'lane', 'left', 'fee'].forEach((k) => put(k, '')); put('name', '선택 전'); return; }
      put('name', `${c.level} · ${c.days}`);
      put('time', `<span class="num">${S.hm(c.hour)}~${S.hm(c.hour, 50)}</span>`);
      put('lane', `<span class="num">${c.lanes.join('·')}</span>`);
      put('left', `<span class="num">${c.cap - c.enrolled}</span>명`);
      put('fee', `<span class="num">${(FEES[c.days] || 0).toLocaleString('ko-KR')}</span>원`);
    };
    const pre = new URLSearchParams(location.search).get('c');
    if (pre && $(`option[value="${CSS.escape(pre)}"]:not([disabled])`, sel)) sel.value = pre;
    show();
    sel.addEventListener('change', show);

    // 숫자만 받아 010-0000-0000 꼴로 맞춘다
    tel.addEventListener('input', () => {
      const v = tel.value.replace(/\D/g, '').slice(0, 11);
      tel.value = v.length < 4 ? v : v.length < 8 ? `${v.slice(0, 3)}-${v.slice(3)}` : `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7)}`;
    });

    const rules = [
      [sel, () => (sel.value ? '' : '반을 선택해 주세요')],
      [name, () => {
        const v = name.value.trim();
        if (!v) return '이름을 입력해 주세요';
        if (!/^[가-힣a-zA-Z\s]{2,20}$/.test(v)) return '이름은 한글이나 영문 2~20자로 입력해 주세요';
        return '';
      }],
      [tel, () => (/^01[016789]-\d{3,4}-\d{4}$/.test(tel.value.trim()) ? '' : '휴대전화 번호를 확인해 주세요')],
      [agree, () => (agree.checked ? '' : '개인정보 수집·이용에 동의해 주세요')],
    ];
    const check = (el, fn) => {
      const msg = fn();
      const err = document.getElementById('e-' + el.id.slice(2));
      err.textContent = msg;
      if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
      return !msg;
    };
    rules.forEach(([el, fn]) => el.addEventListener(el === agree || el === sel ? 'change' : 'blur', () => {
      if (el.hasAttribute('aria-invalid') || form.dataset.tried) check(el, fn);
    }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.dataset.tried = '1';
      const bad = rules.filter(([el, fn]) => !check(el, fn));
      ok.hidden = true;
      if (bad.length) {
        sum.hidden = false;
        sum.textContent = `${bad.length}개 항목을 확인해 주세요`;
        bad[0][0].focus();
        return;
      }
      sum.hidden = true;
      ok.hidden = false;
      ok.textContent = '입력을 모두 확인했어요. 가상 시설이라 실제로 접수되지는 않아요.';
    });
  }
})();
