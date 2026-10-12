// 늦울림음악당 계산식 — 생성기(build.mjs)와 화면(site.js)이 같이 쓴다. 전역 NU(데이터) → NUCALC
(function (g) {
  var D = g.NU;
  var DOW = ['일', '월', '화', '수', '목', '금', '토'];
  function parse(s) { var p = s.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function iso(dt) { return dt.toISOString().slice(0, 10); }
  function addDays(s, n) { var d = parse(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); }
  function dow(s) { return parse(s).getUTCDay(); }
  function md(s) { var d = parse(s); return (d.getUTCMonth() + 1) + '월 ' + d.getUTCDate() + '일(' + DOW[d.getUTCDay()] + ')'; }
  function diffDays(a, b) { return Math.round((parse(b) - parse(a)) / 864e5); }
  function won(n) { return Math.round(n).toLocaleString('ko-KR') + '원'; }
  var TODAY = D.TODAY.y + '-' + String(D.TODAY.m).padStart(2, '0') + '-' + String(D.TODAY.d).padStart(2, '0');

  // ── 좌석 ── 무대 앞 가운데가 원점. x 오른쪽(m), y 객석 쪽(m)
  function zoneOf(row) {
    if (row[2] === 2) return 'A';
    return 'CDEFGHJ'.indexOf(row[0]) > -1 ? 'R' : 'S';
  }
  var SEATS = null;
  function seats() {
    if (SEATS) return SEATS;
    var G = D.SEATGEO, out = [], k = 0;
    D.ROWS.forEach(function (row, ri) {
      var n = row[1], floor = row[2];
      var r = G.focus + (floor === 1 ? G.first + ri * G.gap : G.balconyR + (ri - 14) * G.balconyGap);
      // 통로 둘: 좌석을 왼쪽 ¼ · 가운데 ½ · 오른쪽 ¼ 로 나눈다
      var left = Math.round(n / 4), right = left, mid = n - left - right;
      var arc = n * G.seatW + 2 * G.aisle;
      var half = arc / 2;
      for (var i = 0; i < n; i++) {
        var s = -half + G.seatW * (i + 0.5) + (i >= left ? G.aisle : 0) + (i >= left + mid ? G.aisle : 0);
        var th = s / r; // 호 길이 → 각
        var x = r * Math.sin(th), y = r * Math.cos(th) - G.focus;
        var h = floor === 2 ? G.balconyH : 0.0;
        var dist = Math.sqrt(x * x + y * y + (h - 0.9 + 1.1) * (h - 0.9 + 1.1)); // 눈높이 1.1 m, 무대 0.9 m
        var ang = Math.atan2(Math.abs(x), y) * 180 / Math.PI;
        out.push({ id: row[0] + (i + 1), row: row[0], ri: ri, n: i + 1, floor: floor, zone: zoneOf(row), x: x, y: y, dist: dist, ang: ang, block: i < left ? 'L' : i < left + mid ? 'C' : 'R', k: k++ });
      }
    });
    SEATS = out; return out;
  }
  // 공연마다 팔린 자리 — 공연 번호로 정한 의사 난수. 앞·가운데부터 먼저 팔린다
  function soldSet(c) {
    var seed = 0; for (var i = 0; i < c.id.length; i++) seed = seed * 31 + c.id.charCodeAt(i);
    function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    var list = seats().map(function (s) { var pref = (s.zone === 'R' ? 0 : s.zone === 'S' ? 0.25 : 0.45) + s.ang / 200; return { id: s.id, v: pref + rnd() * 0.7 }; });
    list.sort(function (a, b) { return a.v - b.v; });
    var n = Math.round(list.length * c.sold), set = {};
    for (var j = 0; j < n; j++) set[list[j].id] = 1;
    return set;
  }
  function priceOf(c, zone) { if (c.price.length === 1) return c.price[0]; return c.price[{ R: 0, S: 1, A: 2 }[zone]]; }

  // ── 잔향 — 세이빈 식 RT = 0.161 V / (ΣSα + 4mV)
  function rt(occ, curtain, shell) {
    var S = D.SURFACES, V = D.HALL.volume;
    return D.BANDS.map(function (_, i) {
      var seat = S.seatEmpty[2][i] + (S.seatFull[2][i] - S.seatEmpty[2][i]) * occ;
      var A = S.seatEmpty[1] * seat;
      A += (S.wall[1] - (curtain ? S.curtain[1] : 0)) * S.wall[2][i];
      if (curtain) A += S.curtain[1] * S.curtain[2][i];
      A += S.ceil[1] * S.ceil[2][i] + S.floor[1] * S.floor[2][i];
      A += shell ? S.shell[1] * S.shell[2][i] : S.tower[1] * S.tower[2][i];
      A += 4 * D.AIR[i] * V;
      return Math.round(0.161 * V / A * 100) / 100;
    });
  }
  function midRt(arr) { return Math.round((arr[2] + arr[3]) / 2 * 100) / 100; }

  // ── 환불 ── days = 관람일 - 취소일
  function refund(c, cancel, qty, zone) {
    var days = diffDays(cancel, c.date);
    var each = priceOf(c, zone), total = each * qty;
    if (days < 0) return { error: '이미 지난 공연이다.' };
    if (days === 0) return { error: '공연 당일에는 취소하지 않는다.' };
    if (cancel < TODAY) return { error: '취소일은 오늘(' + md(TODAY) + ')부터 고른다.' };
    var rule = D.REFUND.filter(function (r) { return days >= r[0] && days <= r[1]; })[0];
    var fee = Math.round(total * rule[2] / 100);
    return { days: days, rate: rule[2], label: rule[3], total: total, fee: fee, back: total - fee };
  }

  // ── 대관 ──
  function concertOn(s) { return D.CONCERTS.filter(function (c) { return c.date === s; })[0] || null; }
  function bookedBlocks(s) {
    var b = (D.BOOKED[s] || []).slice();
    if (concertOn(s)) { ['pm', 'eve'].forEach(function (x) { if (b.indexOf(x) < 0) b.push(x); }); }
    return b;
  }
  function dayState(s) {
    if (s < TODAY || s > D.RENT_END) return 'out';
    if (dow(s) === 1) return 'closed';
    if (bookedBlocks(s).length >= 3) return 'full';
    return 'open';
  }
  function rental(o) {
    // o: {kind, date, blocks:[], extra, inst:[], tune:bool, rec:bool, np:bool}
    var kind = D.RENT_KINDS.filter(function (k) { return k[0] === o.kind; })[0];
    var weekend = dow(o.date) === 0 || dow(o.date) === 6 || D.HOLIDAYS.indexOf(o.date) > -1;
    var lines = [], hall = 0;
    o.blocks.forEach(function (b) {
      var bl = D.BLOCKS.filter(function (x) { return x[0] === b; })[0];
      var v = bl[3] * kind[2] * (weekend ? 1 + D.RENT.weekend : 1);
      hall += v; lines.push([bl[1] + ' ' + bl[2] + (weekend ? ' · 주말' : ''), v]);
    });
    if (o.extra > 0) { var e = o.extra * D.RENT.extraHour; hall += e; lines.push(['추가 리허설 ' + o.extra + '시간', e]); }
    var disc = o.np ? -Math.round(hall * D.RENT.nonprofit) : 0;
    if (disc) lines.push(['비영리 30 %', disc]);
    var extra = 0;
    o.inst.forEach(function (id) {
      var it = D.INSTRUMENTS.filter(function (x) { return x.id === id; })[0];
      extra += it.fee; lines.push([it.name + ' 사용', it.fee]);
      if (it.tune) { extra += it.tune; lines.push([it.name + ' 조율', it.tune]); }
    });
    if (o.rec) { extra += D.RENT.recording; lines.push(['녹음 장비', D.RENT.recording]); }
    var supply = hall + disc + extra, vat = Math.round(supply * D.RENT.vat);
    return { lines: lines, supply: supply, vat: vat, total: supply + vat, weekend: weekend };
  }

  g.NUCALC = { DOW: DOW, TODAY: TODAY, parse: parse, iso: iso, addDays: addDays, dow: dow, md: md, diffDays: diffDays, won: won,
    seats: seats, soldSet: soldSet, priceOf: priceOf, rt: rt, midRt: midRt, refund: refund, concertOn: concertOn, bookedBlocks: bookedBlocks, dayState: dayState, rental: rental };
})(typeof window !== 'undefined' ? window : globalThis);
