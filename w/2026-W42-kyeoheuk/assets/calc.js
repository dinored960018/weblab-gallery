// 켜흙토양검정소 — 계산. 화면(site.js)과 생성기(build.mjs)가 같이 쓴다. 데이터는 globalThis.KH
(function (G) {
  var D = G.KH;
  var DAY = 86400000;
  var WD = ['일', '월', '화', '수', '목', '금', '토'];

  function day(s) { var p = s.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / DAY; }
  function iso(n) { var d = new Date(n * DAY); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function md(s) { var d = new Date(day(s) * DAY); return (d.getUTCMonth() + 1) + '월 ' + d.getUTCDate() + '일 (' + WD[d.getUTCDay()] + ')'; }
  function addDays(s, n) { return iso(day(s) + n); }
  function comma(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function won(n) { return comma(n) + '원'; }
  function num(n, d) { var f = Math.pow(10, d || 0); var v = Math.round(n * f) / f; return d ? v.toFixed(d).replace(/\.?0+$/, '') : comma(v); }
  function floor10(n) { return Math.floor(n / 10) * 10; }

  // 입력 값 읽기 — 빈칸 null, 숫자가 아니면 NaN
  function readNum(v) {
    v = String(v == null ? '' : v).trim().replace(/,/g, '');
    if (v === '') return null;
    return /^-?\d+(\.\d+)?$/.test(v) ? +v : NaN;
  }

  // ── 채취 지점 ──
  function sampling(area, unit, use) {
    var R = D.SAMPLING_RULE;
    var m2 = unit === 'pyeong' ? area * R.pyeong : area;
    var pts = m2 <= R.baseArea ? R.base : Math.min(R.max, R.base + Math.ceil((m2 - R.baseArea) / R.step));
    var depth = D.SAMPLING_DEPTH[use] || D.SAMPLING_DEPTH.field;
    return { m2: m2, points: pts, depth: depth, collect: pts * R.perPoint, submit: R.submit, capped: pts === R.max && m2 > R.baseArea + (R.max - R.base - 1) * R.step };
  }

  // ── 요금 ──
  function setById(id) { for (var i = 0; i < D.SETS.length; i++) if (D.SETS[i].id === id) return D.SETS[i]; return null; }
  function price(setId, n, rush, farmer) {
    var R = D.PRICE_RULE, s = setById(setId);
    var sub = s.price * n, rate = 0;
    for (var i = 0; i < R.bulk.length; i++) if (n >= R.bulk[i][0]) { rate = R.bulk[i][1]; break; }
    var bulk = -floor10(sub * rate);
    var rushOk = rush && setId !== 'metal';
    var rushAdd = rushOk ? floor10((sub + bulk) * R.rush) : 0;
    var cut = farmer ? -floor10((sub + bulk + rushAdd) * R.farmer) : 0;
    var supply = sub + bulk + rushAdd + cut;
    var vat = floor10(supply * R.vat);
    return { set: s, n: n, sub: sub, rate: rate, bulk: bulk, rush: rushAdd, farmer: cut, supply: supply, vat: vat, total: supply + vat, days: rushOk ? R.rushDays : s.days };
  }

  // ── 접수 조회 ──
  function track(no, today) {
    var m = /^KH-(\d{2})(\d{2})(\d{2})-(\d{4})$/.exec(String(no).trim().toUpperCase());
    if (!m) return { err: 'format' };
    var y = 2000 + +m[1], mo = +m[2], d = +m[3];
    var dt = new Date(Date.UTC(y, mo - 1, d));
    if (mo < 1 || mo > 12 || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return { err: 'date' };
    var recv = y + '-' + pad(mo) + '-' + pad(d);
    if (m[4] === '0000' || day(recv) > day(today) || y < 2019) return { err: 'none', recv: recv };
    var el = day(today) - day(recv), cur = 0;
    for (var i = 0; i < D.STAGES.length; i++) if (el >= D.STAGES[i].from) cur = i;
    var due = addDays(recv, D.STAGES[D.STAGES.length - 1].from);
    return { no: m[0], recv: recv, elapsed: el, stage: cur, due: due, done: cur === D.STAGES.length - 1 };
  }

  // ── 성적서 판정 ──
  function testById(id) { for (var i = 0; i < D.TESTS.length; i++) if (D.TESTS[i].id === id) return D.TESTS[i]; return null; }
  function judge(id, use, v) {
    var t = testById(id), r = t.rng && t.rng[use];
    if (!r) return null;
    return { rng: r, j: v < r[0] ? 'low' : v > r[1] ? 'high' : 'ok' };
  }

  // ── 토성 ──
  function texture(sand, silt, clay) {
    var c = clay, s = sand, si = silt, id;
    if (si + 1.5 * c < 15) id = 's';
    else if (si + 2 * c < 30) id = 'ls';
    else if ((c >= 7 && c < 20 && s > 52) || (c < 7 && si < 50)) id = 'sl';
    else if (c >= 7 && c < 27 && si >= 28 && si < 50 && s <= 52) id = 'l';
    else if ((si >= 50 && c >= 12 && c < 27) || (si >= 50 && si < 80 && c < 12)) id = 'sil';
    else if (si >= 80 && c < 12) id = 'si';
    else if (c >= 20 && c < 35 && si < 28 && s > 45) id = 'scl';
    else if (c >= 27 && c < 40 && s > 20 && s <= 45) id = 'cl';
    else if (c >= 27 && c < 40 && s <= 20) id = 'sicl';
    else if (c >= 35 && s > 45) id = 'sc';
    else if (c >= 40 && si >= 40) id = 'sic';
    else id = 'c';
    for (var i = 0; i < D.TEXTURES.length; i++) if (D.TEXTURES[i].id === id) return D.TEXTURES[i];
    return null;
  }
  // 삼각도 좌표 — 왼쪽 아래 모래 100, 오른쪽 아래 미사 100, 위 점토 100
  var TRI = { w: 400, h: 346.4, x0: 50, y0: 30 };
  function triXY(sand, silt, clay) {
    var t = sand + silt + clay || 1;
    var si = silt / t, c = clay / t;
    return [TRI.x0 + (si + c / 2) * TRI.w, TRI.y0 + TRI.h - c * TRI.h];
  }

  // ── 시비 처방 ──
  function cropById(id) { for (var i = 0; i < D.CROPS.length; i++) if (D.CROPS[i].id === id) return D.CROPS[i]; return null; }
  function correct(v, r) {
    if (v == null) return 1;
    if (v > 2 * r[1]) return 0;
    if (v < r[0]) return 1 + Math.min(0.5, (r[0] - v) / r[0]);
    if (v > r[1]) return Math.max(0.5, 1 - (v - r[1]) / r[1]);
    return 1;
  }
  function fertilizer(cropId, area, ph, p, k, tx) {
    var c = cropById(cropId);
    var fp = correct(p, testById('p').rng[c.use]), fk = correct(k, testById('k').rng[c.use]);
    var lime = ph == null || ph >= 6.5 ? 0 : (6.5 - ph) * D.LIME_BUFFER[tx];
    var per = { n: c.n, p: c.p * fp, k: c.k * fk, compost: c.compost, lime: lime };
    var ratio = area / 1000;
    var out = {}, bags = {};
    Object.keys(per).forEach(function (key) { out[key] = per[key] * ratio; });
    D.STRAIGHT.forEach(function (s) { var kg = out[s[0]] / s[2]; bags[s[0]] = { name: s[1], kg: kg, bags: Math.ceil(kg / D.BAG - 1e-9) }; });
    bags.compost = { name: '퇴비', kg: out.compost, bags: Math.ceil(out.compost / D.BAG - 1e-9) };
    bags.lime = { name: '고토석회', kg: out.lime, bags: Math.ceil(out.lime / D.BAG - 1e-9) };
    return { crop: c, per: per, area: out, bags: bags, fp: fp, fk: fk };
  }

  G.KHCALC = {
    TODAY: D.TODAY, md: md, addDays: addDays, day: day, comma: comma, won: won, num: num, readNum: readNum,
    sampling: sampling, setById: setById, price: price, track: track, testById: testById, judge: judge,
    texture: texture, TRI: TRI, triXY: triXY, cropById: cropById, fertilizer: fertilizer,
  };
})(typeof window !== 'undefined' ? window : globalThis);
