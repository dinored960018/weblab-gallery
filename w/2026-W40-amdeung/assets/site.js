/* 암등 현상소 — 메뉴 · 필름 스트립 · 현상 탭 · 도감 필터 · 접수 계산 · 작업 조회 */
(function () {
  'use strict';
  var D = window.AMDEUNG || {};
  var ROOT = document.documentElement.getAttribute('data-root') || '';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var won = function (n) { return n.toLocaleString('ko-KR'); };
  var params = new URLSearchParams(location.search);
  function setQuery(q) {
    try { history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch (e) { /* file:// 에서 막히면 그냥 둔다 */ }
  }

  /* ── 모바일 메뉴 ── */
  var btn = $('.menu-btn'), menu = $('#menu');
  function setMenu(open) {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? '닫기' : '메뉴';
    menu.hidden = !open;
    document.documentElement.classList.toggle('lock', open);
    if (open) { var a = $('a', menu); if (a) a.focus(); }
  }
  if (btn) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
    });
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a', menu).concat([btn]);
      var i = f.indexOf(document.activeElement);
      if (e.shiftKey && i === 0) { e.preventDefault(); btn.focus(); }
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && !e.shiftKey && btn.getAttribute('aria-expanded') === 'true') { e.preventDefault(); $('a', menu).focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 860 && !menu.hidden) setMenu(false); });
  }

  /* ── 필름 스트립: 끌기 · 관성 · 키보드 ── */
  $$('.strip').forEach(function (s) {
    var down = false, sx = 0, sl = 0, lx = 0, lt = 0, v = 0, moved = 0, raf = 0;
    var cells = $$('.c35, .c120', s);
    var cellW = function () { return cells[0] ? cells[0].getBoundingClientRect().width : 300; };
    s.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      cancelAnimationFrame(raf);
      down = true; moved = 0; sx = lx = e.clientX; sl = s.scrollLeft; lt = performance.now(); v = 0;
      s.setPointerCapture(e.pointerId); s.classList.add('is-drag');
    });
    s.addEventListener('pointermove', function (e) {
      if (!down) return;
      var now = performance.now();
      s.scrollLeft = sl - (e.clientX - sx);
      moved = Math.max(moved, Math.abs(e.clientX - sx));
      var dt = now - lt; if (dt > 0) v = 0.8 * ((lx - e.clientX) / dt) + 0.2 * v;
      lx = e.clientX; lt = now;
    });
    function end() {
      if (!down) return;
      down = false; s.classList.remove('is-drag');
      if (reduce.matches || Math.abs(v) < 0.05) return;
      var last = performance.now();
      (function glide(t) {
        var dt = t - last; last = t;
        s.scrollLeft += v * dt;
        v *= Math.pow(0.92, dt / 16.7);
        if (Math.abs(v) > 0.02) raf = requestAnimationFrame(glide);
      })(last);
    }
    s.addEventListener('pointerup', end);
    s.addEventListener('pointercancel', end);
    s.addEventListener('click', function (e) { if (moved > 4) { e.preventDefault(); e.stopPropagation(); } }, true);
    s.addEventListener('keydown', function (e) {
      var step = cellW(), to = null;
      if (e.key === 'ArrowRight') to = s.scrollLeft + step;
      else if (e.key === 'ArrowLeft') to = s.scrollLeft - step;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = s.scrollWidth;
      if (to === null) return;
      e.preventDefault(); cancelAnimationFrame(raf);
      s.scrollTo({ left: to, behavior: reduce.matches ? 'auto' : 'smooth' });
    });
    // 가운데 칸 표시
    var ro = s.getAttribute('data-readout') ? document.getElementById(s.getAttribute('data-readout')) : null;
    var pending = false;
    function mark() {
      pending = false;
      var r = s.getBoundingClientRect(), mid = r.left + Math.min(r.width, window.innerWidth) / 2, best = null, bd = 1e9;
      cells.forEach(function (c) {
        var b = c.getBoundingClientRect(), d = Math.abs(b.left + b.width / 2 - mid);
        if (d < bd) { bd = d; best = c; }
      });
      cells.forEach(function (c) { c.classList.toggle('is-on', c === best); });
      if (ro && best) {
        var n = String(best.getAttribute('data-n')).padStart(2, '0');
        ro.innerHTML = '<b>' + n + '</b> / ' + String(cells.length).padStart(2, '0') + ' · ' + best.getAttribute('data-code') + ' · ' + $('img', best).alt;
      }
    }
    s.addEventListener('scroll', function () { if (!pending) { pending = true; requestAnimationFrame(mark); } }, { passive: true });
    window.addEventListener('resize', mark);
    mark();
  });

  /* ── 현상 탭 ── */
  function develop(el) {
    if (!el) return;
    el.classList.remove('developing');
    if (reduce.matches) return;
    void el.offsetWidth; // 애니메이션 다시 시작
    el.classList.add('developing');
  }
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) t.focus();
      develop($('.fit', document.getElementById(t.getAttribute('aria-controls'))));
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { if (t.getAttribute('aria-selected') !== 'true') select(t); });
      t.addEventListener('keydown', function (e) {
        var j = null;
        if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = tabs.length - 1;
        if (j === null) return;
        e.preventDefault(); select(tabs[j], true);
      });
    });
  });

  /* ── 필름 도감 필터 ── */
  var sheet = $('#sheet');
  if (sheet) {
    var rows = $$('.row', sheet), fbtns = $$('.filters button');
    var st = { type: 'all', iso: 'all', fmt: 'all' };
    ['type', 'iso', 'fmt'].forEach(function (k) {
      var v = params.get(k);
      if (v && fbtns.some(function (b) { return b.dataset.f === k && b.dataset.v === v; })) st[k] = v;
    });
    function apply(push) {
      var n = 0;
      fbtns.forEach(function (b) { b.setAttribute('aria-pressed', String(st[b.dataset.f] === b.dataset.v)); });
      rows.forEach(function (r) {
        var ok = (st.type === 'all' || r.dataset.type === st.type)
          && (st.iso === 'all' || r.dataset.iso === st.iso)
          && (st.fmt === 'all' || r.dataset.fmt.split(' ').indexOf(st.fmt) > -1);
        r.hidden = !ok; if (ok) n++;
      });
      $('#count').textContent = n === rows.length ? rows.length + '종' : rows.length + '종 중 ' + n + '종';
      $('#empty').hidden = n > 0;
      if (push) {
        var q = new URLSearchParams();
        Object.keys(st).forEach(function (k) { if (st[k] !== 'all') q.set(k, st[k]); });
        setQuery(q.toString());
      }
    }
    fbtns.forEach(function (b) {
      b.addEventListener('click', function () { st[b.dataset.f] = b.dataset.v; apply(true); });
    });
    $('#reset').addEventListener('click', function () {
      st = { type: 'all', iso: 'all', fmt: 'all' }; apply(true); fbtns[0].focus();
    });
    apply(false);
  }

  /* ── 영업일 ── */
  var WD = ['일', '월', '화', '수', '목', '금', '토'];
  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function isWork(d) { var w = d.getDay(); return w !== 0 && w !== 6 && (D.holidays || []).indexOf(ymd(d)) < 0; }
  function nextWork(d) { var x = new Date(d); do { x.setDate(x.getDate() + 1); } while (!isWork(x)); return x; }
  function dueDate(days) {
    var now = new Date(), start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var cut = (D.cutoff || '15:00').split(':');
    var late = now.getHours() * 60 + now.getMinutes() >= (+cut[0]) * 60 + (+cut[1]);
    if (!isWork(start) || late) start = nextWork(start); // 접수일
    var d = start;
    for (var i = 0; i < days; i++) d = nextWork(d);
    return (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + WD[d.getDay()] + ')';
  }

  /* ── 접수 ── */
  var form = $('#order');
  if (form) {
    var list = $('#lines'), tpl = $('#line-tpl'), addBtn = $('#add-line');
    var MAX_LINES = 5, MAX_ROLLS = 30, tried = false, uid = 0;
    function lineEls() { return $$('.line', list); }
    function addLine(pre) {
      var li = tpl.content.firstElementChild.cloneNode(true), id = ++uid;
      $$('.field', li).forEach(function (f) {
        var c = $('select, input', f), l = $('label', f), cid = 'l' + id + '-' + c.dataset.k;
        c.id = cid; l.setAttribute('for', cid);
      });
      var err = $('.line-err', li); err.id = 'l' + id + '-err';
      $('[data-k="rolls"]', li).setAttribute('aria-describedby', err.id);
      if (pre) {
        if (pre.process && D.process[pre.process]) $('[data-k="process"]', li).value = pre.process;
        if (pre.fmt === '35' || pre.fmt === '120') $('[data-k="fmt"]', li).value = pre.fmt;
      }
      list.appendChild(li);
      renumber(); calc();
      return li;
    }
    function renumber() {
      var ls = lineEls();
      ls.forEach(function (li, i) {
        $('.line-no', li).textContent = String(i + 1).padStart(2, '0');
        var del = $('.line-del', li);
        del.disabled = ls.length === 1;
        del.setAttribute('aria-label', (i + 1) + '번 줄 삭제');
      });
      addBtn.disabled = ls.length >= MAX_LINES;
    }
    function rollsOf(li) { var v = $('[data-k="rolls"]', li).value.trim(); return /^\d+$/.test(v) ? +v : NaN; }
    function state() {
      return {
        lines: lineEls().map(function (li) { return { li: li, process: $('[data-k="process"]', li).value, fmt: $('[data-k="fmt"]', li).value, rolls: rollsOf(li) }; }),
        scan: form.scan.value, tiff: form.tiff.checked, ret: form.ret.value,
      };
    }
    function calc() {
      var s = state(), rows = [], total = 0, rolls = 0, scanSum = 0, scanRolls = 0, days = 0;
      var tiffBox = $('#tiff');
      tiffBox.disabled = s.scan === 'none';
      if (s.scan === 'none') tiffBox.checked = false;
      $('#addr-field').hidden = s.ret !== 'ship';
      s.lines.forEach(function (l) {
        var p = D.process[l.process], n = l.rolls > 0 ? l.rolls : 0;
        var dev = p.price[l.fmt] * n, sc = D.scan[s.scan].price[l.fmt] * n;
        rows.push([p.code + ' ' + (l.fmt === '35' ? '35mm' : '120') + ' × ' + n, dev]);
        total += dev + sc; scanSum += sc; scanRolls += n; rolls += n;
        if (n) days = Math.max(days, p.days + D.scan[s.scan].extra);
      });
      if (s.scan !== 'none') rows.push([D.scan[s.scan].name + ' 스캔 × ' + scanRolls, scanSum]);
      if (s.tiff) { rows.push(['TIFF × ' + rolls, D.tiff * rolls]); total += D.tiff * rolls; }
      var r = D.ret[s.ret], rp = r.per === 'roll' ? r.price * rolls : r.price;
      rows.push([r.name, rp]); total += rp;
      total = Math.max(total, 0);
      $('#sum-lines').innerHTML = rows.map(function (x) {
        return '<li><span>' + x[0] + '</span><span class="num">' + (x[1] < 0 ? '−' + won(-x[1]) : won(x[1])) + '</span></li>';
      }).join('');
      $('#sum-total').textContent = won(total);
      $('#sumbar-total').textContent = won(total);
      $('#sum-rolls').textContent = rolls;
      $('#sum-due').textContent = rolls ? dueDate(days) : '—';
      if (tried) validate(false);
      return { total: total, rolls: rolls };
    }
    function setErr(input, errEl, msg) {
      errEl.textContent = msg || '';
      if (input) { if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
      return msg ? [msg, input] : null;
    }
    function validate(show) {
      var s = state(), out = [], total = 0;
      s.lines.forEach(function (l, i) {
        var inp = $('[data-k="rolls"]', l.li), n = l.rolls;
        var msg = isNaN(n) || n < 1 || n > 20 ? (i + 1) + '번 줄: 롤 수는 1~20 사이로 넣어 주세요.' : '';
        if (!msg) total += n;
        out.push(setErr(inp, $('.line-err', l.li), msg));
      });
      var note = $('#lines-note');
      if (total > MAX_ROLLS) { out.push(['롤 수 합계가 ' + total + '롤이에요. 한 주문에 30롤까지 받아요.', $('[data-k="rolls"]', list)]); note.classList.add('err'); }
      else note.classList.remove('err');
      var nmEl = $('#f-name'), name = nmEl.value.trim(), tel = form.tel.value.trim(), mail = form.mail.value.trim(), addr = form.addr.value.trim();
      out.push(setErr(nmEl, $('#e-name'), name ? '' : '이름을 넣어 주세요.'));
      out.push(setErr(form.tel, $('#e-tel'), !tel ? '휴대폰 번호를 넣어 주세요.' : /^01[016789]-?\d{3,4}-?\d{4}$/.test(tel) ? '' : '휴대폰 번호를 확인해 주세요. 예: 010-1234-5678'));
      out.push(setErr(form.mail, $('#e-mail'), !mail ? '파일 받을 메일 주소를 넣어 주세요.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail) ? '' : '메일 주소를 확인해 주세요. 예: name@example.com'));
      out.push(setErr(form.addr, $('#e-addr'), s.ret === 'ship' && !addr ? '택배 반송이면 주소를 넣어 주세요.' : ''));
      out.push(setErr(form.agree, $('#e-agree'), form.agree.checked ? '' : '보관 기준에 동의해 주세요.'));
      out = out.filter(Boolean);
      var sum = $('#errsum');
      if (show) {
        if (out.length) {
          sum.innerHTML = '<p>' + out.length + '곳을 확인해 주세요.</p><ul>' + out.map(function (x) {
            return '<li><a href="#' + x[1].id + '">' + x[0] + '</a></li>';
          }).join('') + '</ul>';
          sum.hidden = false; sum.focus();
        } else sum.hidden = true;
      } else if (!out.length) sum.hidden = true;
      return out.length === 0;
    }
    list.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var li = b.closest('.line');
      if (b.dataset.step) {
        var inp = $('[data-k="rolls"]', li), n = rollsOf(li);
        inp.value = Math.min(20, Math.max(1, (isNaN(n) ? 1 : n) + (+b.dataset.step)));
        calc();
      } else if (b.classList.contains('line-del') && !b.disabled) {
        var idx = lineEls().indexOf(li);
        li.remove(); renumber(); calc();
        var ls = lineEls(); $('[data-k="process"]', ls[Math.min(idx, ls.length - 1)]).focus();
      }
    });
    addBtn.addEventListener('click', function () {
      var li = addLine(); $('[data-k="process"]', li).focus();
    });
    form.addEventListener('input', calc);
    form.addEventListener('change', calc);
    $('#errsum').addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      e.preventDefault(); var t = document.getElementById(a.getAttribute('href').slice(1)); if (t) t.focus();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); tried = true;
      var res = $('#result'); res.textContent = ''; res.className = 'result';
      if (!validate(true)) return;
      var c = calc();
      res.className = 'result ok';
      res.textContent = '접수되지 않았어요. 연습용 사이트라 실제 접수는 연결하지 않았어요. 계산 결과는 ' + c.rolls + '롤, ' + won(c.total) + '원이에요.';
    });
    addLine({ process: params.get('process'), fmt: params.get('fmt') });
  }

  /* ── 작업 조회 ── */
  var lk = $('#lookup');
  if (lk) {
    var no = $('#no'), err = $('#no-err'), res = $('#res');
    var FMT = { '35': '35mm', '120': '120' };
    function show(key) {
      var o = D.orders[key], now = o.done ? 4 : o.stage;
      $('#res-h').innerHTML = '<span class="fn" aria-hidden="true">▸</span>' + key + ' · ' + (o.done ? '발송 완료' : o.wait ? D.stages[o.stage] + ' 대기' : D.stages[o.stage] + ' 중');
      $('#stages').innerHTML = D.stages.map(function (name, i) {
        var done = i < now, cur = i === now;
        var photo = o.photos[i];
        var img = done ? '<img src="' + ROOT + 'assets/photos/' + photo + '.jpg" alt="' + (D.alt[photo] || name) + '">' : '<span class="blank"></span>';
        return '<li' + (cur ? ' aria-current="step"' : '') + '><figure class="c35' + (cur ? ' is-now is-on' : '') + '" data-n="' + (i + 1) + '">' + img
          + '<span class="et et-t" aria-hidden="true">AMDEUNG ' + key + '</span><span class="et et-b" aria-hidden="true"><b>' + (i + 1) + '</b>▸' + (i + 1) + 'A</span></figure>'
          + '<div class="stage-t' + (cur ? ' is-now-t' : '') + '"><span class="stage-n">' + String(i + 1).padStart(2, '0') + (done ? ' · 끝남' : cur ? (o.wait ? ' · 차례 기다림' : ' · 진행 중') : ' · 대기') + '</span>'
          + '<span class="stage-name">' + name + '</span><span class="stage-time">' + (o.times[i] || '—') + '</span></div></li>';
      }).join('');
      var lines = o.lines.map(function (l) { return D.process[l[0]].code + ' ' + FMT[l[1]] + ' × ' + l[2] + '롤'; }).join(', ');
      var sc = D.scan[o.scan];
      var dl = [['필름', lines], ['스캔', o.scan === 'none' ? '스캔 안 함' : sc.name + ' (35mm ' + sc.px['35'] + ')'], ['반송', D.ret[o.ret].name], [o.done ? '예정일' : '완료 예정', o.due]];
      if (o.parcel) dl.push(['송장 번호', '<span class="num">' + o.parcel + '</span>']);
      $('#res-dl').innerHTML = dl.map(function (x) { return '<div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>'; }).join('');
      $('#res-memo').textContent = o.memo || '';
      res.hidden = false;
      develop($('#stages'));
    }
    function run(focusRes) {
      var v = no.value.trim().toUpperCase().replace(/\s+/g, '');
      var msg = '';
      if (!v) msg = '주문번호를 넣어 주세요.';
      else if (!/^AD\d{6}-\d{3}$/.test(v)) msg = '주문번호 형식이 달라요. 예: AD260928-014';
      else if (!D.orders[v]) msg = '없는 주문번호예요. 접수 문자에 온 번호를 다시 확인해 주세요.';
      err.textContent = msg;
      if (msg) { no.setAttribute('aria-invalid', 'true'); res.hidden = true; no.focus(); return; }
      no.removeAttribute('aria-invalid'); no.value = v;
      show(v); setQuery('no=' + v);
      if (focusRes) res.focus();
    }
    lk.addEventListener('submit', function (e) { e.preventDefault(); run(true); });
    $$('.chip[data-no]').forEach(function (c) {
      c.addEventListener('click', function () { no.value = c.dataset.no; run(true); });
    });
    if (params.get('no') !== null) { no.value = params.get('no'); run(false); }
  }
})();
