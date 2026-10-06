/* Holmscar tide model — practice values, not a prediction.
   Height above chart datum (m) from five harmonic terms. Same file runs in the page and in build.mjs. */
(function (root) {
  var T0 = Date.UTC(2026, 9, 12, 6, 10); // spring high water, 12 Oct 2026 06:10 UTC (a day after new moon)
  var H = 3600000;
  var TERMS = [
    // amplitude m, period h, phase rad
    [1.70, 12.4206, 0],      // M2  principal lunar
    [0.55, 12.0, 0],         // S2  principal solar — in phase with M2 at T0 → springs
    [0.12, 6.2103, -1.2],    // M4  shallow water, quicker flood
    [0.07, 23.9345, 0.6],    // K1  diurnal inequality
    [0.05, 25.8193, -0.4],   // O1
  ];
  var Z0 = 3.0;
  var SILL = 1.9;       // marina sill, m above chart datum
  var CLEARANCE = 0.3;  // harbour rule under the keel
  var BST = 1;          // UTC+1 until Sun 25 Oct 2026

  function height(ms) {
    var t = (ms - T0) / H, h = Z0;
    for (var i = 0; i < TERMS.length; i++) h += TERMS[i][0] * Math.cos(2 * Math.PI * t / TERMS[i][1] + TERMS[i][2]);
    return h;
  }
  // day: 'YYYY-MM-DD' local (BST). Returns ms for local midnight.
  function dayStart(day) {
    var p = day.split('-');
    return Date.UTC(+p[0], +p[1] - 1, +p[2]) - BST * H;
  }
  // High and low waters between two instants, found on a one-minute grid.
  function turns(from, to) {
    var out = [], step = 60000, a = height(from - step), b = height(from);
    for (var t = from; t <= to; t += step) {
      var c = height(t + step);
      if (b > a && b >= c) out.push({ t: t, h: b, type: 'HW' });
      else if (b < a && b <= c) out.push({ t: t, h: b, type: 'LW' });
      a = b; b = c;
    }
    return out;
  }
  function clock(ms) {
    var d = new Date(ms + BST * H);
    var hh = d.getUTCHours(), mm = d.getUTCMinutes();
    return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
  }
  // Windows when depth over the sill is at least draught + clearance.
  function windows(from, to, draught) {
    var need = SILL + draught + CLEARANCE, out = [], open = null, step = 60000;
    for (var t = from; t <= to; t += step) {
      var ok = height(t) >= need;
      if (ok && open === null) open = t;
      if (!ok && open !== null) { out.push([open, t]); open = null; }
    }
    if (open !== null) out.push([open, to]);
    return out;
  }
  var api = { height: height, dayStart: dayStart, turns: turns, clock: clock, windows: windows, SILL: SILL, CLEARANCE: CLEARANCE, BST: BST, H: H };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HolmTide = api;
})(this);
