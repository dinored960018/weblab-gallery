/* 여늘시립천문대 — 원형 성도 그리기
 * 천정이 가운데, 북이 위, 동이 왼쪽(하늘을 올려다본 방향). 등거리 방위 도법: 반지름 = (90° − 고도) / 90°
 * drawSky(Astro, data, ms, opts) → { svg, up: [지평선 위 천체] } — 브라우저와 build.mjs 가 같이 쓴다 */
(function (G) {
  var SIZE = 760, C = SIZE / 2, RAD = 318;
  function f1(x) { return Math.round(x * 10) / 10; }
  function xy(alt, az) {
    var r = (90 - alt) / 90 * RAD, a = az * Math.PI / 180;
    return [C - r * Math.sin(a), C - r * Math.cos(a)];
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function moonPath(cx, cy, R, illum, waxing) {
    // 밝은 쪽: 차는 달은 오른쪽(서), 기우는 달은 왼쪽(동) — 성도 좌우가 뒤집혀 있어도 달 모양은 맨눈으로 본 모양으로 그린다
    var k = illum, rx = Math.abs(1 - 2 * k) * R;
    var litRight = waxing;
    var top = cx + ' ' + f1(cy - R), bot = cx + ' ' + f1(cy + R);
    var outer = 'A' + R + ' ' + R + ' 0 0 ' + (litRight ? 1 : 0) + ' ' + bot;
    var innerSweep = (k < 0.5) ? (litRight ? 0 : 1) : (litRight ? 1 : 0);
    var inner = 'A' + f1(rx) + ' ' + R + ' 0 0 ' + innerSweep + ' ' + top;
    return 'M' + top + ' ' + outer + ' ' + inner + 'Z';
  }
  function drawSky(A, D, ms, opts) {
    opts = opts || {};
    var lat = D.site.lat, lon = D.site.lon, sel = opts.sel || '';
    var parts = [], up = [];
    parts.push('<svg class="sky" viewBox="0 0 ' + SIZE + ' ' + SIZE + '" role="img" aria-labelledby="sky-t">');
    parts.push('<title id="sky-t">' + esc(opts.title || '성도') + '</title>');
    parts.push('<circle class="sky-disc" cx="' + C + '" cy="' + C + '" r="' + RAD + '"/>');
    [30, 60].forEach(function (a) { parts.push('<circle class="sky-ring" cx="' + C + '" cy="' + C + '" r="' + f1((90 - a) / 90 * RAD) + '"/>'); });
    // 방위 눈금
    for (var az = 0; az < 360; az += 5) {
      var big = az % 30 === 0, mid = az % 10 === 0;
      var a = az * Math.PI / 180, r1 = RAD, r2 = RAD + (big ? 14 : mid ? 9 : 5);
      parts.push('<line class="sky-tick' + (big ? ' big' : '') + '" x1="' + f1(C - r1 * Math.sin(a)) + '" y1="' + f1(C - r1 * Math.cos(a)) + '" x2="' + f1(C - r2 * Math.sin(a)) + '" y2="' + f1(C - r2 * Math.cos(a)) + '"/>');
    }
    var CARD = { 0: '북', 90: '동', 180: '남', 270: '서' };
    for (var z = 0; z < 360; z += 30) {
      var aa = z * Math.PI / 180, rr = RAD + 30;
      var lx = f1(C - rr * Math.sin(aa)), ly = f1(C - rr * Math.cos(aa) + 5);
      parts.push(CARD[z] !== undefined ? '<text class="sky-card" x="' + lx + '" y="' + f1(ly + 2) + '">' + CARD[z] + '</text>' : '<text class="sky-deg" x="' + lx + '" y="' + ly + '">' + z + '°</text>');
    }
    parts.push('<text class="sky-deg" x="' + (C + 4) + '" y="' + f1(C - (60 / 90) * RAD + 14) + '">30°</text>');
    parts.push('<text class="sky-deg" x="' + (C + 4) + '" y="' + f1(C - (30 / 90) * RAD + 14) + '">60°</text>');

    // 별 위치
    var pos = {};
    D.stars.forEach(function (s) {
      var p = A.precess(s[2] * 15, s[3], ms), h = A.altaz(p.ra, p.dec, ms, lat, lon);
      pos[s[0]] = { alt: h.alt, az: h.az, s: s };
    });
    // 별자리 선
    var lines = [];
    D.lines.forEach(function (c) {
      var sx = 0, sy = 0, n = 0;
      c[1].forEach(function (chain) {
        for (var i = 0; i < chain.length - 1; i++) {
          var p1 = pos[chain[i]], p2 = pos[chain[i + 1]];
          if (!p1 || !p2 || p1.alt < 0 || p2.alt < 0) continue;
          var a1 = xy(p1.alt, p1.az), a2 = xy(p2.alt, p2.az);
          lines.push('<line x1="' + f1(a1[0]) + '" y1="' + f1(a1[1]) + '" x2="' + f1(a2[0]) + '" y2="' + f1(a2[1]) + '"/>');
          sx += a1[0] + a2[0]; sy += a1[1] + a2[1]; n += 2;
        }
      });
      if (n >= 4) c.label = [sx / n, sy / n]; else c.label = null;
    });
    parts.push('<g class="sky-lines">' + lines.join('') + '</g>');
    // 별자리 이름 — 별 점과 겹치지 않는 자리를 고른다
    var dots = [];
    D.stars.forEach(function (s) { var p = pos[s[0]]; if (p.alt >= 0) dots.push(xy(p.alt, p.az)); });
    var OFF = [[0, 22], [0, -14], [0, 34], [34, 4], [-34, 4], [0, -28], [40, 22], [-40, 22]];
    D.lines.forEach(function (c) {
      if (!c.label) return;
      var w = c[0].length * 7 + 6, best = OFF[0];
      for (var i = 0; i < OFF.length; i++) {
        var lx = c.label[0] + OFF[i][0], ly = c.label[1] + OFF[i][1] - 4;
        var hit = dots.some(function (d) { return Math.abs(d[0] - lx) < w && Math.abs(d[1] - ly) < 10; });
        if (!hit) { best = OFF[i]; break; }
      }
      parts.push('<text class="sky-con" x="' + f1(c.label[0] + best[0]) + '" y="' + f1(c.label[1] + best[1]) + '">' + c[0] + '</text>');
    });

    // 별
    var st = [];
    D.stars.forEach(function (s) {
      var p = pos[s[0]]; if (p.alt < 0) return;
      var q = xy(p.alt, p.az), r = Math.max(1.1, 4.6 - 0.95 * s[4]);
      st.push('<circle cx="' + f1(q[0]) + '" cy="' + f1(q[1]) + '" r="' + f1(r) + '"/>');
    });
    parts.push('<g class="sky-stars">' + st.join('') + '</g>');

    // 도감 천체 (행성·달·이름 있는 대상)
    var objs = [];
    D.objects.forEach(function (o) {
      var h, ra, dec, mag = o.mag;
      if (o.kind === 'moon') { h = A.moonAltAz(ms, lat, lon); }
      else if (o.kind === 'planet') { var pl = A.planet(o.planet, ms); h = A.altaz(pl.ra, pl.dec, ms, lat, lon); mag = pl.mag; }
      else { var pp = A.precess(o.ra * 15, o.dec, ms); h = A.altaz(pp.ra, pp.dec, ms, lat, lon); }
      if (h.alt < 0) return;
      up.push({ id: o.id, name: o.name, kind: o.kind, alt: h.alt, az: h.az, mag: mag });
      objs.push({ o: o, h: h, mag: mag });
    });
    var g = [];
    objs.forEach(function (x) {
      var q = xy(x.h.alt, x.h.az), cx = f1(q[0]), cy = f1(q[1]), o = x.o, on = sel === o.id;
      var label = o.name.replace(/\(.*\)/, '');
      var mark;
      if (o.kind === 'moon') {
        var m = A.moon(ms);
        mark = '<circle class="sky-moon-dark" cx="' + cx + '" cy="' + cy + '" r="11"/><path class="sky-moon-lit" d="' + moonPath(+cx, +cy, 11, m.illum, m.waxing) + '"/>';
      } else if (o.kind === 'planet') {
        mark = '<circle class="sky-planet" cx="' + cx + '" cy="' + cy + '" r="5.5"/>';
      } else if (o.kind === 'star' || o.kind === 'double') {
        mark = '';
      } else {
        mark = '<circle class="sky-dso" cx="' + cx + '" cy="' + cy + '" r="6"/>';
      }
      var showLabel = on || o.kind === 'moon' || o.kind === 'planet' || (o.kind === 'star' && x.mag < 1.3);
      g.push('<g class="sky-obj' + (on ? ' on' : '') + '" data-obj="' + o.id + '">' +
        '<circle class="sky-hit" cx="' + cx + '" cy="' + cy + '" r="14"/>' + mark +
        (on ? '<circle class="sky-sel" cx="' + cx + '" cy="' + cy + '" r="17"/>' : '') +
        (showLabel ? '<text class="sky-name" x="' + f1(+cx + 14) + '" y="' + f1(+cy - 10) + '">' + esc(label) + '</text>' : '') + '</g>');
    });
    parts.push('<g class="sky-objs">' + g.join('') + '</g>');
    parts.push('<circle class="sky-edge" cx="' + C + '" cy="' + C + '" r="' + RAD + '"/>');
    parts.push('</svg>');
    up.sort(function (a, b) { return b.alt - a.alt; });
    return { svg: parts.join(''), up: up };
  }
  G.SkyChart = { drawSky: drawSky, moonPath: moonPath };
})(typeof window !== 'undefined' ? window : globalThis);
