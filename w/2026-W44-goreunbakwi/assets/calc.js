// 고른바퀴 경정비 — 계산 (브라우저 · build.mjs 공용)
(function (g) {
  'use strict';
  var D = g.GB;
  var byId = function (list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; };
  var r1000 = function (n) { return Math.round(n / 1000) * 1000; };
  var num = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  var won = function (n) { return num(n) + '원'; };
  var km = function (n) { return num(n) + ' km'; };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var hm = function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };
  var cls = function (id) { return byId(D.CLASSES, id) || byId(D.CLASSES, 'jun'); };
  var fuel = function (id) { return byId(D.FUELS, id) || D.FUELS[0]; };

  // 품목 주기(km). null = 이 연료에는 해당 없음
  function interval(item, c, f) {
    var base = item.by && Object.prototype.hasOwnProperty.call(item.by, f) ? item.by[f] : item.km;
    if (!base) return null;
    var mod = item.mod ? cls(c)[item.mod] : 1;
    return r1000(base * mod);
  }

  function ageMonths(y) { return Math.max(6, (D.NOW.y - y) * 12 + D.NOW.m - 6); }

  // 진단 — 기록이 없는 품목은 주기대로 갈았다고 보고 계산한다
  function diagnose(s) {
    var perMonth = s.km / ageMonths(s.y);
    var rows = [];
    D.ITEMS.forEach(function (it) {
      var iv = interval(it, s.c, s.f);
      if (!iv) return;
      var given = s.last && s.last[it.id] != null && s.last[it.id] !== '' && +s.last[it.id] <= s.km;
      var lastKm = given ? +s.last[it.id] : Math.floor(s.km / iv) * iv;
      var next = lastKm + iv;
      var rem = next - s.km;
      var soon = Math.min(iv * D.SOON.ratio, D.SOON.cap);
      var st = rem < 0 ? 'over' : rem <= soon ? 'soon' : 'ok';
      var eta = perMonth > 0 ? rem / perMonth : null;
      rows.push({ id: it.id, name: it.name, short: it.short, work: it.work, iv: iv, last: lastKm, assumed: !given, next: next, rem: rem, st: st, eta: eta, fill: Math.max(0, Math.min(1, rem / iv)) });
    });
    var order = { over: 0, soon: 1, ok: 2 };
    rows.sort(function (a, b) { return order[a.st] - order[b.st] || a.rem - b.rem; });
    return { rows: rows, perYear: Math.round(perMonth * 12 / 100) * 100, over: rows.filter(function (r) { return r.st === 'over'; }), soon: rows.filter(function (r) { return r.st === 'soon'; }) };
  }

  function etaText(r) {
    if (r.st === 'over') return '지금';
    if (r.eta == null) return '';
    var m = Math.round(r.eta);
    if (m < 1) return '1개월 안';
    if (m < 12) return '약 ' + m + '개월 뒤';
    var y = Math.floor(m / 12), mm = m % 12;
    return '약 ' + y + '년' + (mm ? ' ' + mm + '개월' : '') + ' 뒤';
  }
  function remText(r) { return r.rem < 0 ? km(-r.rem) + ' 지남' : km(r.rem) + ' 남음'; }

  // 작업값
  function price(w, c) {
    var k = cls(c);
    var p = { labor: r1000(w.labor * k.labor), min: w.min };
    ['oem', 'alt', 're'].forEach(function (g2) { p[g2] = w[g2] ? r1000(w[g2] * k.part) : null; });
    return p;
  }
  function grades(w) { return ['oem', 'alt', 're'].filter(function (g2) { return !!w[g2]; }); }

  // 견적 — sel: [{id, g}]
  function estimate(c, sel) {
    var lines = [], labor = 0, part = 0, min = 0, saved = 0;
    var hasOil = sel.some(function (s) { return s.id === 'oil'; });
    sel.forEach(function (s) {
      var w = byId(D.WORKS, s.id);
      if (!w) return;
      var p = price(w, c);
      var gs = grades(w);
      var gr = gs.indexOf(s.g) > -1 ? s.g : (gs[0] || null);
      var pp = gr ? p[gr] : 0;
      var combo = hasOil && D.COMBO.indexOf(w.id) > -1;
      var lb = combo ? 0 : p.labor;
      if (combo) saved += p.labor;
      labor += lb; part += pp; min += w.min;
      lines.push({ id: w.id, name: w.name, g: gr, labor: lb, part: pp, min: w.min, combo: combo });
    });
    var sub = labor + part;
    var vat = Math.floor(sub * D.VAT / 10) * 10;
    var slots = Math.ceil(min / 30);
    return { saved: saved, lines: lines, labor: labor, part: part, vat: vat, total: sub + vat, min: min, slots: slots, book: Math.min(120, slots * 30) };
  }

  // 세 가지 안 — 등급 전략별 합계 · 가장 짧은 보증 · 가장 이른 다음 교환
  function plans(c, f, ids) {
    var out = [];
    [['oem', '정품 안', ['oem', 'alt', 're']], ['alt', '호환 안', ['alt', 'oem', 're']], ['re', '재생 우선 안', ['re', 'alt', 'oem']]].forEach(function (pl) {
      var sel = ids.map(function (id) {
        var w = byId(D.WORKS, id); var gs = w ? grades(w) : [];
        var gr = null; for (var i = 0; i < pl[2].length; i++) if (gs.indexOf(pl[2][i]) > -1) { gr = pl[2][i]; break; }
        return { id: id, g: gr };
      });
      var e = estimate(c, sel);
      var warr = null, life = null, lifeName = '';
      e.lines.forEach(function (l) {
        if (!l.g) return;
        var wm = D.WARRANTY_MO[l.g];
        if (warr == null || wm < warr) warr = wm;
        var it = null; for (var i = 0; i < D.ITEMS.length; i++) if (D.ITEMS[i].work === l.id) it = D.ITEMS[i];
        if (!it) return;
        var iv = interval(it, c, f); if (!iv) return;
        var lf = (D.LIFE[l.g] && D.LIFE[l.g][it.id]) || 1;
        var k = r1000(iv * lf);
        if (life == null || k < life) { life = k; lifeName = it.short; }
      });
      out.push({ id: pl[0], name: pl[1], sel: sel, e: e, warr: warr, life: life, lifeName: lifeName });
    });
    return out;
  }

  // 리프트 시간표
  function dayInfo(iso) {
    var p = iso.split('-').map(Number);
    var dt = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    var wd = dt.getUTCDay();
    return { iso: iso, m: p[1], d: p[2], wd: wd, wname: '일월화수목금토'[wd], label: p[1] + '월 ' + p[2] + '일 (' + '일월화수목금토'[wd] + ')', short: p[2] + '일 (' + '일월화수목금토'[wd] + ')', sat: wd === 6 };
  }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0); }
  var todayIso = D.NOW.y + '-' + pad(D.NOW.m) + '-' + pad(D.NOW.d);
  var nowMin = D.NOW.h * 60 + D.NOW.min;
  function slotTimes(iso) { return dayInfo(iso).sat ? D.SLOT_SAT : D.SLOT_WEEKDAY; }
  // state: 'past' | 'full' | 'open'
  function slotState(iso, lift, t, mine) {
    if (iso === todayIso && t < nowMin + 20) return 'past';
    var key = iso + '|' + lift + '|' + t;
    if (mine && mine[key]) return 'mine';
    var fillRate = iso === todayIso ? 62 : iso === D.BOOK_DAYS[1] ? 48 : 34;
    return hash(key) % 100 < fillRate ? 'full' : 'open';
  }
  // t 부터 dur 분이 같은 리프트에서 이어서 비어 있는가 (점심 · 마감에 걸리면 안 됨)
  function fits(iso, lift, t, dur, mine) {
    var times = slotTimes(iso);
    var need = dur / 30;
    var i = times.indexOf(t);
    if (i < 0) return false;
    for (var k = 0; k < need; k++) {
      var tt = times[i + k];
      if (tt == null || tt !== t + 30 * k) return false;
      if (slotState(iso, lift, tt, mine) !== 'open') return false;
    }
    return true;
  }
  function openCount(iso, mine) {
    var n = 0;
    D.LIFTS.forEach(function (l) { slotTimes(iso).forEach(function (t) { if (slotState(iso, l.id, t, mine) === 'open') n++; }); });
    return n;
  }
  function bookingNo(iso, lift, t) {
    var di = dayInfo(iso);
    return 'GB-' + pad(di.m) + pad(di.d) + '-' + lift + '-' + pad(Math.floor(t / 60)) + pad(t % 60);
  }

  function history(plate, phone) {
    for (var i = 0; i < D.HISTORY.length; i++) { var h = D.HISTORY[i]; if (h.plate === plate && h.phone === phone) return h; }
    return null;
  }

  g.GBCALC = {
    byId: byId, num: num, won: won, km: km, hm: hm, pad: pad, cls: cls, fuel: fuel, interval: interval,
    diagnose: diagnose, plans: plans, ageMonths: ageMonths, etaText: etaText, remText: remText, price: price, grades: grades, estimate: estimate,
    dayInfo: dayInfo, slotTimes: slotTimes, slotState: slotState, fits: fits, openCount: openCount, bookingNo: bookingNo,
    history: history, todayIso: todayIso, nowMin: nowMin,
  };
})(typeof window !== 'undefined' ? window : globalThis);
