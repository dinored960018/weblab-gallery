// 켜흙토양검정소 — 화면 동작. 데이터 window.KH, 계산 window.KHCALC
(function () {
  var D = window.KH, C = window.KHCALC;
  var page = document.body.dataset.page, rel = document.body.dataset.rel || '';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(location.search);
  function setParams(obj) {
    var p = new URLSearchParams(location.search);
    Object.keys(obj).forEach(function (k) { var v = obj[k]; if (v === '' || v == null || v === false) p.delete(k); else p.set(k, v); });
    var s = p.toString();
    try { history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash); } catch (e) { /* file:// 에서 막히면 주소는 그대로 */ }
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function kv(rows, cls) { return '<dl class="kv ' + (cls || '') + '">' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl>'; }
  function link(id, q) { return rel + (id === 'home' ? 'index.html' : id + '/index.html') + (q || ''); }
  var USE = {}; D.USES.forEach(function (u) { USE[u[0]] = u[1]; });

  // 칸 오류 표시
  function fieldErr(input, errEl, msg) {
    if (msg) { input.setAttribute('aria-invalid', 'true'); errEl.textContent = msg; errEl.hidden = false; }
    else { input.removeAttribute('aria-invalid'); errEl.textContent = ''; errEl.hidden = true; }
  }
  function josa(w) { var c = w.charCodeAt(w.length - 1) - 0xAC00; return c >= 0 && c < 11172 && c % 28 ? '을' : '를'; }
  // 범위 검사 — 빈칸 허용 여부
  function checkNum(v, lo, hi, opt) {
    opt = opt || {};
    var n = C.readNum(v);
    if (n === null) return opt.empty ? { v: null } : { err: opt.label + josa(opt.label) + ' 넣어 주세요.' };
    if (isNaN(n)) return { err: '숫자만 넣어 주세요.' };
    if (opt.int && n !== Math.floor(n)) return { err: '정수로 넣어 주세요.' };
    if (n < lo || n > hi) return { err: C.num(lo, 2) + '~' + C.num(hi, 2) + ' 사이로 넣어 주세요.' };
    return { v: n };
  }

  // ── 깊이 눈금 ──
  var mark = $('.ruler-mark'), num = $('.ruler-num'), ticks = $('.ruler-ticks'), ticking = false;
  function depth() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    var h = window.innerHeight - 56;
    mark.style.transform = 'translateY(' + (p * h).toFixed(1) + 'px)';
    num.textContent = Math.round(p * 100) + ' cm';
  }
  if (mark) {
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(depth); } }, { passive: true });
    window.addEventListener('resize', depth);
    depth();
  }

  // ── 모바일 메뉴 ──
  var mb = $('.menu-btn'), nav = $('#nav');
  if (mb) {
    var closeMenu = function (focus) { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); document.body.classList.remove('lock'); if (focus) mb.focus(); };
    mb.addEventListener('click', function () {
      if (mb.getAttribute('aria-expanded') === 'true') return closeMenu(false);
      nav.classList.add('open'); mb.setAttribute('aria-expanded', 'true'); document.body.classList.add('lock');
      var a = $('a', nav); if (a) a.focus();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu(true); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && nav.classList.contains('open')) closeMenu(false); });
  }

  // ── 시료 채취 ──
  if (page === 'sampling') {
    var sf = $('#samp'), area = $('#s-area'), use = $('#s-use');
    var g = $('.wpath .pts'), wpath = JSON.parse(g.dataset.path);
    var units = $$('input[name="unit"]', sf);
    if (C.readNum(params.get('area')) > 0) area.value = params.get('area');
    if (params.get('unit') === 'pyeong') units[1].checked = true;
    if (USE[params.get('use')] && params.get('use') !== 'garden') use.value = params.get('use');
    var dots = function (n) {
      var seg = [], total = 0, out = '';
      for (var i = 1; i < wpath.length; i++) { var l = Math.hypot(wpath[i][0] - wpath[i - 1][0], wpath[i][1] - wpath[i - 1][1]); seg.push(l); total += l; }
      for (var k = 0; k < n; k++) {
        var d = total * (k + 0.5) / n, j = 0;
        while (d > seg[j]) { d -= seg[j]; j++; }
        var t = d / seg[j], a = wpath[j], b = wpath[j + 1];
        out += '<rect class="pt" x="' + (a[0] + (b[0] - a[0]) * t - 6).toFixed(1) + '" y="' + (a[1] + (b[1] - a[1]) * t - 6).toFixed(1) + '" width="12" height="12"/>';
      }
      g.innerHTML = out;
      g.parentNode.setAttribute('aria-label', '필지 안 W자 채취 길과 채취 지점 ' + n + '곳');
    };
    var runS = function (write) {
      var unit = units[1].checked ? 'pyeong' : 'm2';
      var r = checkNum(area.value, 1, 100000, { label: '면적' });
      fieldErr(area, $('#s-area-err'), r.err);
      if (r.err) { $('#s-out').innerHTML = '<p class="note">면적을 고치면 다시 계산합니다.</p>'; return; }
      var s = C.sampling(r.v, unit, use.value);
      $('#s-out').innerHTML = kv([
        ['채취 지점', '<b>' + s.points + '곳</b>' + (s.points === D.SAMPLING_RULE.max ? ' (최대)' : '')],
        ['채취 깊이', s.depth[0] + '~' + s.depth[1] + ' cm'],
        ['면적', C.comma(s.m2) + ' ㎡'],
        ['지점마다', '약 ' + D.SAMPLING_RULE.perPoint + ' g'],
        ['모으는 흙', '약 ' + C.comma(s.collect) + ' g'],
        ['섞어서 낼 양', D.SAMPLING_RULE.submit + ' g'],
      ]);
      dots(s.points);
      if (write) setParams({ area: area.value.trim(), unit: unit === 'm2' ? '' : unit, use: use.value === 'field' ? '' : use.value });
    };
    sf.addEventListener('input', function () { runS(true); });
    sf.addEventListener('change', function () { runS(true); });
    sf.addEventListener('submit', function (e) { e.preventDefault(); });
    runS(false);
  }

  // ── 검정 항목 ──
  if (page === 'tests') {
    var st = { use: [], set: [] };
    ['use', 'set'].forEach(function (f) {
      var ok = f === 'use' ? Object.keys(USE) : D.SETS.map(function (s) { return s.id; });
      (params.get(f) || '').split(',').forEach(function (v) { if (ok.indexOf(v) > -1 && st[f].indexOf(v) < 0) st[f].push(v); });
    });
    var items = $$('.test');
    var hit = function (arr, sel) { return !sel.length || sel.some(function (v) { return arr.indexOf(v) > -1; }); };
    var applyT = function (write) {
      $$('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(st[b.dataset.f].indexOf(b.dataset.v) > -1)); });
      var n = 0;
      items.forEach(function (li) {
        var ok = hit(li.dataset.uses.split(' '), st.use) && hit(li.dataset.sets.split(' '), st.set);
        li.hidden = !ok; if (ok) n++;
      });
      $('#count').textContent = n;
      $('#empty').hidden = n > 0;
      if (write) setParams({ use: st.use.join(','), set: st.set.join(',') });
    };
    $$('.chip').forEach(function (b) {
      b.addEventListener('click', function () {
        var arr = st[b.dataset.f], i = arr.indexOf(b.dataset.v);
        if (i > -1) arr.splice(i, 1); else arr.push(b.dataset.v);
        applyT(true);
      });
    });
    $('#clear').addEventListener('click', function () { st.use = []; st.set = []; applyT(true); $('.chip').focus(); });
    applyT(false);
  }

  // ── 요금 ──
  function priceOut(r) {
    var rows = [[r.set.name + ' ' + C.won(r.set.price) + ' × ' + r.n + '점', C.won(r.sub)]];
    if (r.bulk) rows.push(['묶음 할인 ' + Math.round(r.rate * 100) + ' %', C.won(r.bulk)]);
    if (r.rush) rows.push(['급행 30 %', C.won(r.rush)]);
    if (r.farmer) rows.push(['농업인 감면 20 %', C.won(r.farmer)]);
    rows.push(['공급가', C.won(r.supply)], ['부가세', C.won(r.vat)], ['합계', '<b>' + C.won(r.total) + '</b>'], ['예상 소요', r.days + '일']);
    return kv(rows, 'kv-sum');
  }
  if (page === 'prices') {
    var pf = $('#price'), pn = $('#p-n'), rush = $('#p-rush'), farmer = $('input[name="farmer"]', pf);
    var sets = $$('input[name="set"]', pf);
    var ps = params.get('set');
    sets.forEach(function (r) { if (r.value === ps) r.checked = true; });
    if (params.get('n')) pn.value = params.get('n');
    rush.checked = params.get('rush') === '1';
    farmer.checked = params.get('farmer') === '1';
    var runP = function (write) {
      var set = sets.filter(function (r) { return r.checked; })[0].value;
      rush.disabled = set === 'metal';
      if (rush.disabled) rush.checked = false;
      $('#p-rush-note').hidden = !rush.disabled;
      var r = checkNum(pn.value, D.PRICE_RULE.min, D.PRICE_RULE.max, { label: '시료 수', int: true });
      fieldErr(pn, $('#p-n-err'), r.err);
      if (r.err) { $('#p-out').innerHTML = '<p class="note">시료 수를 고치면 다시 계산합니다.</p>'; return; }
      $('#p-out').innerHTML = priceOut(C.price(set, r.v, rush.checked, farmer.checked));
      var q = { set: set, n: r.v, rush: rush.checked ? '1' : '', farmer: farmer.checked ? '1' : '' };
      var qs = Object.keys(q).filter(function (k) { return q[k] !== ''; }).map(function (k) { return k + '=' + q[k]; }).join('&');
      $('#p-go').href = link('submit', '?' + qs);
      if (write) setParams({ set: set === 'basic' ? '' : set, n: r.v === 1 ? '' : r.v, rush: q.rush, farmer: q.farmer });
    };
    pf.addEventListener('input', function () { runP(true); });
    pf.addEventListener('change', function () { runP(true); });
    pf.addEventListener('submit', function (e) { e.preventDefault(); });
    runP(false);
  }

  // ── 대화상자 공통 ──
  function dialog(dlg, closers) {
    var opener = null;
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    closers.forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
    dlg.addEventListener('close', function () { if (opener && document.contains(opener) && !opener.closest('[hidden]')) opener.focus(); });
    return { open: function (from) { opener = from || document.activeElement; if (!dlg.open) dlg.showModal(); } };
  }

  // ── 접수 신청 ──
  if (page === 'submit') {
    var af = $('#apply'), sum = $('#errsum'), done = $('#done');
    var fName = $('#f-name'), fPhone = $('#f-phone'), fN = $('#f-n'), fUse = $('#f-use'), fRush = $('#f-rush'), fFarmer = $('#f-farmer'), fAgree = $('#f-agree');
    var fSets = $$('input[name="set"]', af);
    fSets.forEach(function (r) { if (r.value === params.get('set')) r.checked = true; });
    if (C.readNum(params.get('n')) > 0) fN.value = params.get('n');
    if (USE[params.get('use')]) fUse.value = params.get('use');
    fRush.checked = params.get('rush') === '1';
    fFarmer.checked = params.get('farmer') === '1';
    var curSet = function () { var r = fSets.filter(function (x) { return x.checked; })[0]; return r ? r.value : ''; };
    var syncRush = function () { fRush.disabled = curSet() === 'metal'; if (fRush.disabled) fRush.checked = false; };
    fSets.forEach(function (r) { r.addEventListener('change', syncRush); });
    syncRush();
    var dlgEl = $('#confirm'), dlg = dialog(dlgEl, [$('#c-back')]);
    var validate = function () {
      var errs = [];
      var put = function (input, errId, msg) { fieldErr(input, $('#' + errId), msg); if (msg) errs.push([input.id, msg]); };
      put(fName, 'f-name-err', fName.value.trim() ? '' : '이름을 넣어 주세요.');
      var ph = fPhone.value.trim();
      put(fPhone, 'f-phone-err', !ph ? '휴대전화 번호를 넣어 주세요.' : /^01[016789]-?\d{3,4}-?\d{4}$/.test(ph) ? '' : '휴대전화 번호 형식은 010-0000-0000입니다.');
      var se = $('#f-set-err');
      if (!curSet()) { se.textContent = '세트를 골라 주세요.'; se.hidden = false; fSets[0].setAttribute('aria-invalid', 'true'); errs.push([fSets[0].id, '세트를 골라 주세요.']); }
      else { se.hidden = true; fSets[0].removeAttribute('aria-invalid'); }
      var n = checkNum(fN.value, 1, 200, { label: '시료 수', int: true });
      put(fN, 'f-n-err', n.err ? (C.readNum(fN.value) === null ? '시료 수를 넣어 주세요.' : '시료 수는 1~200점입니다.') : '');
      put(fAgree, 'f-agree-err', fAgree.checked ? '' : '동의해야 신청할 수 있습니다.');
      return { errs: errs, n: n.v };
    };
    af.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = validate();
      var ul = $('ul', sum);
      if (r.errs.length) {
        ul.innerHTML = r.errs.map(function (x) { return '<li><a href="#' + x[0] + '">' + esc(x[1]) + '</a></li>'; }).join('');
        sum.hidden = false; sum.focus();
        return;
      }
      sum.hidden = true;
      var p = C.price(curSet(), r.n, fRush.checked, fFarmer.checked);
      $('#c-body').innerHTML = kv([
        ['이름', esc(fName.value.trim())], ['휴대전화', esc(fPhone.value.trim())],
        ['세트', p.set.name + ' ' + p.set.count + '항목'], ['시료 수', r.n + '점'], ['용도', USE[fUse.value]],
        ['급행', fRush.checked ? '예' : '아니요'], ['농업인 감면', fFarmer.checked ? '예' : '아니요'],
        ['합계', '<b>' + C.won(p.total) + '</b> (부가세 포함)'], ['예상 소요', p.days + '일'],
      ]);
      dlg.open(af.querySelector('[type="submit"]'));
    });
    sum.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      e.preventDefault(); var t = document.getElementById(a.getAttribute('href').slice(1)); if (t) t.focus();
    });
    $('#c-ok').addEventListener('click', function () {
      var no = 'KH-' + C.TODAY.slice(2).replace(/-/g, '') + '-' + ('000' + (D.WEEK.received + 1)).slice(-4);
      dlgEl.close();
      af.hidden = true;
      done.innerHTML = '<h3>접수 화면</h3>' + kv([['접수번호', '<b>' + no + '</b>'], ['접수일', C.md(C.TODAY)], ['상태', '전송되지 않았습니다 · 가상의 기관']]) +
        '<p>시료를 가져올 때 접수번호를 봉지에 적어 주세요.</p><p class="links"><a href="' + link('track', '?no=' + no) + '">이 번호로 조회</a></p><p><button type="button" class="btn" id="again">다시 쓰기</button></p>';
      done.hidden = false; done.focus();
      $('#again').addEventListener('click', function () { af.reset(); syncRush(); done.hidden = true; af.hidden = false; fName.focus(); });
    });
  }

  // ── 접수 조회 ──
  if (page === 'track') {
    var tf = $('#trk'), tno = $('#t-no'), tout = $('#t-out');
    var shape = ['■', '◧', '□'];
    var runK = function (write) {
      var v = tno.value.trim();
      if (!v) { fieldErr(tno, $('#t-no-err'), '접수번호를 넣어 주세요.'); tout.innerHTML = ''; return; }
      var r = C.track(v, C.TODAY);
      if (r.err === 'format' || r.err === 'date') {
        fieldErr(tno, $('#t-no-err'), r.err === 'format' ? '형식은 KH-261013-0042입니다.' : '접수번호의 날짜가 달력에 없습니다.');
        tout.innerHTML = '';
        return;
      }
      fieldErr(tno, $('#t-no-err'), '');
      if (write) setParams({ no: v.toUpperCase() });
      if (r.err === 'none') { tout.innerHTML = '<div class="empty"><p>이 번호로 접수된 시료가 없습니다.</p><p class="note">번호를 다시 확인하거나 접수 창구에 메일로 문의해 주세요.</p></div>'; return; }
      tout.innerHTML = kv([
        ['접수번호', '<b>' + r.no + '</b>'], ['접수일', C.md(r.recv)], ['지난 날', r.elapsed + '일'],
        ['현재 단계', D.STAGES[r.stage].name], [r.done ? '발송일' : '발송 예정일', C.md(r.due)],
      ]) + '<ol class="stages">' + D.STAGES.map(function (s, i) {
        var k = i < r.stage ? 0 : i === r.stage ? 1 : 2;
        var lab = ['끝남', '지금', '남음'][k];
        return '<li class="' + ['past', 'now', 'todo'][k] + '"' + (k === 1 ? ' aria-current="step"' : '') + '><span class="shape" aria-hidden="true">' + shape[k] + '</span><b>' + s.name + '</b><span>' + lab + ' · ' + s.desc + '</span></li>';
      }).join('') + '</ol>';
    };
    tf.addEventListener('submit', function (e) { e.preventDefault(); runK(true); });
    if (params.get('no')) { tno.value = params.get('no'); runK(false); }
  }

  // ── 성적서 읽기 ──
  if (page === 'read') {
    var rf = $('#rd'), ruse = $('#r-use'), rout = $('#r-out');
    if (USE[params.get('use')]) ruse.value = params.get('use');
    D.READ_ITEMS.forEach(function (it) { var v = params.get(it.id); if (v != null) $('#r-' + it.id).value = v; });
    var rows = {};
    var JT = { low: ['부족', '□'], ok: ['적정', '■'], high: ['과다', '◧'] };
    var place = function () {
      Object.keys(rows).forEach(function (id) {
        var row = rows[id]; if (row.el.hidden) return;
        var w = row.bar.clientWidth;
        row.mark.style.transform = 'translateX(' + (row.p * w).toFixed(1) + 'px)';
      });
    };
    var runR = function (write) {
      var u = ruse.value, any = false, q = { use: u === 'field' ? '' : u };
      if (!rout.dataset.ready) { rout.innerHTML = '<p class="note" id="r-none">값을 넣으면 여기에 판정이 나옵니다.</p>'; rout.dataset.ready = '1'; }
      D.READ_ITEMS.forEach(function (it) {
        var inp = $('#r-' + it.id), t = C.testById(it.id);
        var r = checkNum(inp.value, it.lim[0], it.lim[1], { empty: true });
        fieldErr(inp, $('#r-' + it.id + '-err'), r.err);
        q[it.id] = r.err || r.v == null ? '' : inp.value.trim();
        var row = rows[it.id];
        if (!row) {
          var div = document.createElement('div');
          div.className = 'jrow'; div.hidden = true;
          div.innerHTML = '<p class="jrow-head"><span class="jrow-name">' + t.name + '</span><span class="jrow-v"></span><span class="jrow-j"></span></p><div class="bar" aria-hidden="true"><span class="band"></span><span class="mark"></span></div><p class="bar-scale"><span>' + it.scale[0] + '</span><span>' + it.scale[1] + '</span></p>';
          rout.appendChild(div);
          row = rows[it.id] = { el: div, bar: $('.bar', div), mark: $('.mark', div), p: 0 };
        }
        if (r.err || r.v == null) { row.el.hidden = true; return; }
        var j = C.judge(it.id, u, r.v);
        any = true;
        var span = it.scale[1] - it.scale[0], pc = function (v) { return Math.min(1, Math.max(0, (v - it.scale[0]) / span)); };
        var band = $('.band', row.el);
        band.style.left = (pc(j.rng[0]) * 100).toFixed(2) + '%';
        band.style.width = ((pc(j.rng[1]) - pc(j.rng[0])) * 100).toFixed(2) + '%';
        row.mark.className = 'mark ' + j.j;
        row.p = pc(r.v);
        $('.jrow-v', row.el).textContent = r.v + (t.unit === '—' ? '' : ' ' + t.unit) + ' · 적정 ' + j.rng[0] + '~' + j.rng[1];
        $('.jrow-j', row.el).textContent = JT[j.j][1] + ' ' + JT[j.j][0];
        row.el.hidden = false;
      });
      $('#r-none').hidden = any;
      place();
      if (write) setParams(q);
    };
    rf.addEventListener('input', function () { runR(true); });
    rf.addEventListener('change', function () { runR(true); });
    rf.addEventListener('submit', function (e) { e.preventDefault(); });
    window.addEventListener('resize', place);
    runR(false);
  }

  // ── 토성 판정 ──
  if (page === 'texture') {
    var xf = $('#tx'), xin = { sand: $('#x-sand'), silt: $('#x-silt'), clay: $('#x-clay') };
    ['sand', 'silt', 'clay'].forEach(function (k) { if (params.get(k) != null) xin[k].value = params.get(k); });
    var dot = $('.tri-dot'), GROUP = {}; D.TX_GROUPS.forEach(function (g) { GROUP[g[0]] = g[1]; });
    var runX = function (write) {
      var v = {}, bad = '', err = $('#x-err');
      ['sand', 'silt', 'clay'].forEach(function (k) {
        var r = checkNum(xin[k].value, 0, 100, { label: { sand: '모래', silt: '미사', clay: '점토' }[k] + ' 비율' });
        if (r.err && !bad) bad = r.err;
        if (r.err) xin[k].setAttribute('aria-invalid', 'true'); else xin[k].removeAttribute('aria-invalid');
        v[k] = r.v;
      });
      var total = bad ? 0 : v.sand + v.silt + v.clay;
      if (!bad && Math.abs(total - 100) > 1) {
        bad = '세 값의 합이 100이 되어야 합니다. 지금 합: ' + C.num(total, 1);
        ['sand', 'silt', 'clay'].forEach(function (k) { xin[k].setAttribute('aria-invalid', 'true'); });
      }
      if (bad) { err.textContent = bad; err.hidden = false; $('#x-out').innerHTML = '<p class="note">값을 고치면 다시 판정합니다.</p>'; return; }
      err.hidden = true;
      var s = v.sand * 100 / total, si = v.silt * 100 / total, c = v.clay * 100 / total;
      var t = C.texture(s, si, c), xy = C.triXY(s, si, c);
      dot.style.transform = 'translate(' + xy[0].toFixed(1) + 'px,' + xy[1].toFixed(1) + 'px)';
      $$('.tri polygon.tx').forEach(function (p) { p.classList.toggle('on', p.dataset.tx === t.id); });
      $('#x-out').innerHTML = kv([['토성', '<b>' + t.name + '</b>'], ['갈래', GROUP[t.group]], ['세 값의 합', C.num(total, 1) + ' %'], ['손 느낌', t.feel]]);
      $('#x-go').href = link('fertilizer', '?tx=' + t.group);
      if (write) setParams({ sand: xin.sand.value.trim(), silt: xin.silt.value.trim(), clay: xin.clay.value.trim() });
    };
    xf.addEventListener('input', function () { runX(true); });
    xf.addEventListener('submit', function (e) { e.preventDefault(); });
    runX(false);
  }

  // ── 시비 처방 ──
  if (page === 'fertilizer') {
    var zf = $('#fz'), z = { crop: $('#z-crop'), area: $('#z-area'), tx: $('#z-tx'), ph: $('#z-ph'), p: $('#z-p'), k: $('#z-k') };
    if (C.cropById(params.get('crop') || '')) z.crop.value = params.get('crop');
    if (D.LIME_BUFFER[params.get('tx')]) z.tx.value = params.get('tx');
    ['area', 'ph', 'p', 'k'].forEach(function (k) { if (params.get(k) != null) z[k].value = params.get(k); });
    var n1 = function (v) { return C.num(v, 1); };
    var runZ = function (write) {
      var a = checkNum(z.area.value, 1, 100000, { label: '면적' });
      var ph = checkNum(z.ph.value, 3, 10, { empty: true });
      var p = checkNum(z.p.value, 0, 3000, { empty: true });
      var k = checkNum(z.k.value, 0, 10, { empty: true });
      fieldErr(z.area, $('#z-area-err'), a.err); fieldErr(z.ph, $('#z-ph-err'), ph.err); fieldErr(z.p, $('#z-p-err'), p.err); fieldErr(z.k, $('#z-k-err'), k.err);
      if (a.err || ph.err || p.err || k.err) { $('#z-out').innerHTML = '<p class="note">값을 고치면 다시 계산합니다.</p>'; return; }
      var f = C.fertilizer(z.crop.value, a.v, ph.v, p.v, k.v, z.tx.value);
      var rows = [['질소', 'n'], ['인산', 'p'], ['칼리', 'k'], ['퇴비', 'compost'], ['석회', 'lime']];
      $('#z-out').innerHTML = '<div class="tbl-wrap" tabindex="0" role="region" aria-label="시비 처방 결과"><table class="tbl tbl-out"><caption>' + esc(f.crop.name) + ' · ' + C.comma(a.v) + ' ㎡ · 인산 보정 ×' + f.fp.toFixed(2) + ' · 칼리 보정 ×' + f.fk.toFixed(2) + (ph.v == null ? ' · pH 빈칸이라 석회 0' : '') + '</caption><thead><tr><th scope="col">성분</th><th scope="col">10a당 kg</th><th scope="col">입력 면적 kg</th><th scope="col">비료</th><th scope="col">포대</th></tr></thead><tbody>' +
        rows.map(function (r) { var bg = f.bags[r[1]]; return '<tr><th scope="row">' + r[0] + '</th><td class="n">' + n1(f.per[r[1]]) + '</td><td class="n">' + n1(f.area[r[1]]) + '</td><td>' + bg.name + ' ' + n1(bg.kg) + ' kg</td><td class="n">' + bg.bags + '</td></tr>'; }).join('') + '</tbody></table></div>';
      if (write) setParams({ crop: z.crop.value, area: z.area.value.trim(), tx: z.tx.value, ph: z.ph.value.trim(), p: z.p.value.trim(), k: z.k.value.trim() });
    };
    zf.addEventListener('input', function () { runZ(true); });
    zf.addEventListener('change', function () { runZ(true); });
    zf.addEventListener('submit', function (e) { e.preventDefault(); });
    runZ(false);
  }

  // ── 토양 단면 탭 ──
  if (page === 'profile') {
    var tabs = $$('[role="tab"]');
    var sel = function (tab, focus, write) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      var h = tab.id.slice(4);
      $$('.profsvg .hz').forEach(function (g) { g.classList.toggle('on', g.dataset.h === h); });
      if (focus) tab.focus();
      if (write) setParams({ h: h === 'A' ? '' : h });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { sel(t, false, true); });
      t.addEventListener('keydown', function (e) {
        var j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (j == null) return;
        e.preventDefault(); sel(tabs[(j + tabs.length) % tabs.length], true, true);
      });
    });
    var h0 = (params.get('h') || '').toUpperCase();
    var t0 = document.getElementById('tab-' + h0); if (t0) sel(t0, false, false);
  }

  // ── 자주 묻는 것 ──
  if (page === 'faq') {
    var cats = [], chips = $$('.chip'), qs = $$('.faq details');
    (params.get('cat') || '').split(',').forEach(function (c) { if (D.FAQ_CATS.some(function (x) { return x[0] === c; }) && cats.indexOf(c) < 0) cats.push(c); });
    var applyF = function (write) {
      chips.forEach(function (b) { b.setAttribute('aria-pressed', String(cats.indexOf(b.dataset.v) > -1)); });
      var n = 0;
      qs.forEach(function (d) { var ok = !cats.length || cats.indexOf(d.dataset.cat) > -1; d.hidden = !ok; if (ok) n++; });
      $('#count').textContent = n;
      if (write) setParams({ cat: cats.join(',') });
    };
    chips.forEach(function (b) { b.addEventListener('click', function () { var i = cats.indexOf(b.dataset.v); if (i > -1) cats.splice(i, 1); else cats.push(b.dataset.v); applyF(true); }); });
    qs.forEach(function (d) {
      d.addEventListener('toggle', function () { if (d.open) setParams({ open: d.id }); else if (params.get('open') === d.id || new URLSearchParams(location.search).get('open') === d.id) setParams({ open: '' }); });
    });
    var o = document.getElementById(params.get('open') || '');
    if (o && o.tagName === 'DETAILS') o.open = true;
    applyF(false);
  }
})();
