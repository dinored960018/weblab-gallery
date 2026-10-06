/* 여늘시립천문대 — 하늘 계산 (저정밀)
 * 태양·달·행성: Paul Schlyter, "How to compute planetary positions" (stjarnhimlen.se/comp/ppcomp.html)
 * 세차: IAU 1976 (Lieske) 각 ζ·z·θ
 * 항성시: GMST 근사식
 * 브라우저(window.Astro)와 build.mjs(new Function) 양쪽에서 쓴다. */
(function (G) {
  var R = Math.PI / 180, D = 180 / Math.PI;
  var sin = function (x) { return Math.sin(x * R); }, cos = function (x) { return Math.cos(x * R); };
  var rev = function (x) { return ((x % 360) + 360) % 360; };
  var atan2d = function (y, x) { return Math.atan2(y, x) * D; };

  function jd(ms) { return ms / 86400000 + 2440587.5; }
  function dnum(ms) { return jd(ms) - 2451543.5; }

  function sunEcl(d) {
    var w = 282.9404 + 4.70935e-5 * d, e = 0.016709 - 1.151e-9 * d, M = rev(356.0470 + 0.9856002585 * d);
    var E = M + D * e * sin(M) * (1 + e * cos(M));
    var xv = cos(E) - e, yv = Math.sqrt(1 - e * e) * sin(E);
    var v = atan2d(yv, xv), r = Math.hypot(xv, yv);
    var lon = rev(v + w);
    return { lon: lon, r: r, M: M, w: w, x: r * cos(lon), y: r * sin(lon) };
  }
  function obl(d) { return 23.4393 - 3.563e-7 * d; }
  function eclToEq(lon, lat, d) {
    var ec = obl(d);
    var x = cos(lon) * cos(lat), y = sin(lon) * cos(lat), z = sin(lat);
    var ye = y * cos(ec) - z * sin(ec), ze = y * sin(ec) + z * cos(ec);
    return { ra: rev(atan2d(ye, x)), dec: atan2d(ze, Math.hypot(x, ye)) };
  }
  function kepler(M, e) {
    var E = M + D * e * sin(M) * (1 + e * cos(M));
    for (var k = 0; k < 8; k++) E = E - (E - D * e * sin(E) - M) / (1 - e * cos(E));
    return E;
  }
  function orbitXYZ(el) {
    var E = kepler(rev(el.M), el.e);
    var xv = el.a * (cos(E) - el.e), yv = el.a * Math.sqrt(1 - el.e * el.e) * sin(E);
    var v = atan2d(yv, xv), r = Math.hypot(xv, yv), vw = v + el.w;
    return {
      x: r * (cos(el.N) * cos(vw) - sin(el.N) * sin(vw) * cos(el.i)),
      y: r * (sin(el.N) * cos(vw) + cos(el.N) * sin(vw) * cos(el.i)),
      z: r * sin(vw) * sin(el.i), r: r
    };
  }

  function moon(ms) {
    var d = dnum(ms), s = sunEcl(d);
    var el = { N: 125.1228 - 0.0529538083 * d, i: 5.1454, w: 318.0634 + 0.1643573223 * d, a: 60.2666, e: 0.0549, M: 115.3654 + 13.0649929509 * d };
    var p = orbitXYZ(el);
    var lon = rev(atan2d(p.y, p.x)), lat = atan2d(p.z, Math.hypot(p.x, p.y)), r = p.r;
    var Ms = s.M, Mm = rev(el.M), Ls = rev(s.M + s.w), Lm = rev(el.M + el.w + el.N), Dd = Lm - Ls, F = Lm - el.N;
    lon += -1.274 * sin(Mm - 2 * Dd) + 0.658 * sin(2 * Dd) - 0.186 * sin(Ms) - 0.059 * sin(2 * Mm - 2 * Dd) - 0.057 * sin(Mm - 2 * Dd + Ms)
      + 0.053 * sin(Mm + 2 * Dd) + 0.046 * sin(2 * Dd - Ms) + 0.041 * sin(Mm - Ms) - 0.035 * sin(Dd) - 0.031 * sin(Mm + Ms)
      - 0.015 * sin(2 * F - 2 * Dd) + 0.011 * sin(Mm - 4 * Dd);
    lat += -0.173 * sin(F - 2 * Dd) - 0.055 * sin(Mm - F - 2 * Dd) - 0.046 * sin(Mm + F - 2 * Dd) + 0.033 * sin(F + 2 * Dd) + 0.017 * sin(2 * Mm + F);
    r += -0.58 * cos(Mm - 2 * Dd) - 0.46 * cos(2 * Dd);
    lon = rev(lon);
    var eq = eclToEq(lon, lat, d);
    var elong = Math.acos(cos(s.lon - lon) * cos(lat)) * D;
    var FV = 180 - elong;
    var illum = (1 + cos(FV)) / 2;
    var waxing = rev(lon - s.lon) < 180;
    var age = rev(lon - s.lon) / 360 * 29.530589;
    return { ra: eq.ra, dec: eq.dec, r: r, illum: illum, waxing: waxing, age: age, elong: elong, lon: lon };
  }

  var PL = {
    venus: function (d) { return { N: 76.6799 + 2.4659e-5 * d, i: 3.3946 + 2.75e-8 * d, w: 54.891 + 1.38374e-5 * d, a: 0.72333, e: 0.006773 - 1.302e-9 * d, M: 48.0052 + 1.6021302244 * d }; },
    mars: function (d) { return { N: 49.5574 + 2.11081e-5 * d, i: 1.8497 - 1.78e-8 * d, w: 286.5016 + 2.92961e-5 * d, a: 1.523688, e: 0.093405 + 2.516e-9 * d, M: 18.6021 + 0.5240207766 * d }; },
    jupiter: function (d) { return { N: 100.4542 + 2.76854e-5 * d, i: 1.303 - 1.557e-7 * d, w: 273.8777 + 1.64505e-5 * d, a: 5.20256, e: 0.048498 + 4.469e-9 * d, M: 19.895 + 0.0830853001 * d }; },
    saturn: function (d) { return { N: 113.6634 + 2.3898e-5 * d, i: 2.4886 - 1.081e-7 * d, w: 339.3939 + 2.97661e-5 * d, a: 9.55475, e: 0.055546 - 9.499e-9 * d, M: 316.967 + 0.0334442282 * d }; }
  };
  function planet(name, ms) {
    var d = dnum(ms), s = sunEcl(d), el = PL[name](d), p = orbitXYZ(el);
    var hl = rev(atan2d(p.y, p.x)), hb = atan2d(p.z, Math.hypot(p.x, p.y)), r = p.r;
    if (name === 'jupiter' || name === 'saturn') {
      var Mj = rev(19.895 + 0.0830853001 * d), Mst = rev(316.967 + 0.0334442282 * d);
      if (name === 'jupiter') hl += -0.332 * sin(2 * Mj - 5 * Mst - 67.6) - 0.056 * sin(2 * Mj - 2 * Mst + 21) + 0.042 * sin(3 * Mj - 5 * Mst + 21)
        - 0.036 * sin(Mj - 2 * Mst) + 0.022 * cos(Mj - Mst) + 0.023 * sin(2 * Mj - 3 * Mst + 52) - 0.016 * sin(Mj - 5 * Mst - 69);
      else {
        hl += 0.812 * sin(2 * Mj - 5 * Mst - 67.6) - 0.229 * cos(2 * Mj - 4 * Mst - 2) + 0.119 * sin(Mj - 2 * Mst - 3) + 0.046 * sin(2 * Mj - 6 * Mst - 69) + 0.014 * sin(Mj - 3 * Mst + 32);
        hb += -0.02 * cos(2 * Mj - 4 * Mst - 2) + 0.018 * sin(2 * Mj - 6 * Mst - 49);
      }
    }
    var xh = r * cos(hl) * cos(hb), yh = r * sin(hl) * cos(hb), zh = r * sin(hb);
    var xg = xh + s.x, yg = yh + s.y, zg = zh;
    var gl = rev(atan2d(yg, xg)), gb = atan2d(zg, Math.hypot(xg, yg)), Rg = Math.sqrt(xg * xg + yg * yg + zg * zg);
    var eq = eclToEq(gl, gb, d);
    var FV = Math.acos(Math.max(-1, Math.min(1, (r * r + Rg * Rg - s.r * s.r) / (2 * r * Rg)))) * D;
    var lg = 5 * Math.log10(r * Rg), mag, ring = null;
    if (name === 'venus') mag = -4.47 + lg + 0.0103 * FV + 5.7e-5 * FV * FV + 1.3e-7 * FV * FV * FV; // Mallama 2018
    else if (name === 'mars') mag = -1.51 + lg + 0.016 * FV;
    else if (name === 'jupiter') mag = -9.25 + lg + 0.014 * FV;
    else {
      var ir = 28.06, Nr = 169.51 + 3.82e-5 * d;
      var B = Math.asin(sin(gb) * cos(ir) - cos(gb) * sin(ir) * sin(gl - Nr)) * D;
      mag = -9.0 + lg + 0.044 * FV - 2.6 * Math.abs(sin(B)) + 1.2 * sin(B) * sin(B);
      ring = B;
    }
    var elong = Math.acos(cos(s.lon - gl) * cos(gb)) * D;
    return { ra: eq.ra, dec: eq.dec, dist: Rg, mag: mag, elong: elong, ring: ring };
  }
  function sun(ms) { var d = dnum(ms), s = sunEcl(d), eq = eclToEq(s.lon, 0, d); return { ra: eq.ra, dec: eq.dec, lon: s.lon }; }

  // J2000 → 관측일 적경·적위 (IAU 1976 세차)
  function precess(ra, dec, ms) {
    var T = (jd(ms) - 2451545) / 36525, A = 1 / 3600;
    var zeta = (2306.2181 * T + 0.30188 * T * T) * A, z = (2306.2181 * T + 1.09468 * T * T) * A, th = (2004.3109 * T - 0.42665 * T * T) * A;
    var Aa = cos(dec) * sin(ra + zeta);
    var Bb = cos(th) * cos(dec) * cos(ra + zeta) - sin(th) * sin(dec);
    var Cc = sin(th) * cos(dec) * cos(ra + zeta) + cos(th) * sin(dec);
    return { ra: rev(atan2d(Aa, Bb) + z), dec: Math.asin(Cc) * D };
  }
  function lst(ms, lon) { var t = jd(ms) - 2451545; return rev(280.46061837 + 360.98564736629 * t + lon); }
  function altaz(ra, dec, ms, lat, lon) {
    var H = lst(ms, lon) - ra;
    var sa = sin(lat) * sin(dec) + cos(lat) * cos(dec) * cos(H);
    var alt = Math.asin(sa) * D;
    var az = rev(atan2d(-sin(H) * cos(dec), cos(lat) * sin(dec) - sin(lat) * cos(dec) * cos(H)));
    return { alt: alt, az: az };
  }
  function moonAltAz(ms, lat, lon) {
    var m = moon(ms), h = altaz(m.ra, m.dec, ms, lat, lon);
    h.alt = h.alt - Math.asin(1 / m.r) * D * cos(h.alt); // 지심 → 지표 시차
    return h;
  }
  G.Astro = { rev: rev, jd: jd, sun: sun, moon: moon, planet: planet, precess: precess, lst: lst, altaz: altaz, moonAltAz: moonAltAz };
})(typeof window !== 'undefined' ? window : globalThis);
