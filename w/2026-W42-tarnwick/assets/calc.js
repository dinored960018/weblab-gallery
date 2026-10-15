// generated from calc.mjs by build.mjs
(function(){
// Tarnwick Locks — shared calculations. build.mjs imports this file; build.mjs also copies it to
// assets/calc.js (exports stripped) so the browser runs the same functions.

const NOW = { iso: '2026-10-15', day: 'Thu', min: 540, label: 'Thursday 15 October 2026', short: 'Thu 15 Oct 2026', clock: '09:00 BST' };

// Passage constants (minutes, metres per minute)
const GATES_MIN = 5;      // open gates, enter, close, leave — per lock
const QUEUE_MIN = 18;     // each boat ahead: one turn at the slowest lock
const POUND_SPEED = 40;   // metres per minute between locks (about 2.4 km/h)
const BEAM_ALLOW = 0.07;  // chamber width less this = largest beam
const KEEL_ALLOW = 0.10;  // depth over cill less this = deepest draught
const LAST_ENTRY_BEFORE = 180; // last entry to the flight: 3 h before the keepers go off

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYNAME = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
const dayName = (d) => DAYNAME[d] || d;

// ---------- numbers and times ----------
const m1 = (n) => (Math.round(n * 10) / 10).toFixed(1);
const m2 = (n) => (Math.round(n * 100) / 100).toFixed(2);
const gbp = (n) => '£' + (Math.round(n * 100) / 100).toFixed(2);
const pad2 = (n) => String(n).padStart(2, '0');
const hm = (min) => { const t = ((Math.round(min) % 1440) + 1440) % 1440; return pad2(Math.floor(t / 60)) + ':' + pad2(t % 60); };
const parseHM = (s) => { const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || '').trim()); if (!m) return null; const h = +m[1], mi = +m[2]; return h < 24 && mi < 60 ? h * 60 + mi : null; };
const dur = (min) => { const t = Math.round(min); const h = Math.floor(t / 60), m = t % 60; return h ? `${h} h${m ? ' ' + m + ' min' : ''}` : `${m} min`; };
const round5 = (min) => Math.round(min / 5) * 5;
const listAnd = (xs) => (xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1]);

// ---------- dates (UTC, ISO strings) ----------
const toD = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const toIso = (dt) => dt.toISOString().slice(0, 10);
const isIso = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || '')) && toIso(toD(s)) === s;
const addDays = (iso, n) => { const d = toD(iso); d.setUTCDate(d.getUTCDate() + n); return toIso(d); };
const dow = (iso) => DAYS[(toD(iso).getUTCDay() + 6) % 7];
const dateLabel = (iso) => { const d = toD(iso); return `${dow(iso)} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`; };
const dateLong = (iso) => { const d = toD(iso); return `${dayName(dow(iso))} ${d.getUTCDate()} ${MONTH[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
const dayMonth = (iso) => { const d = toD(iso); return `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`; };
const span = (a, b) => {
  const A = toD(a), B = toD(b);
  if (a === b) return dayMonth(a);
  if (A.getUTCMonth() === B.getUTCMonth() && A.getUTCFullYear() === B.getUTCFullYear()) return `${A.getUTCDate()} – ${dayMonth(b)}`;
  return `${dayMonth(a)} – ${dayMonth(b)}`;
};
const monthName = (y, m) => `${MONTH[m]} ${y}`;
// Calendar grid for one month: weeks of 7 ISO strings (or '' outside the month), Monday first
const monthGrid = (y, m) => {
  const first = new Date(Date.UTC(y, m, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push('');
  for (let d = 1; d <= days; d++) cells.push(`${y}-${pad2(m + 1)}-${pad2(d)}`);
  while (cells.length % 7) cells.push('');
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};

// ---------- locks ----------
const beamMax = (L) => Math.round((L.width - BEAM_ALLOW) * 100) / 100;
const draughtMax = (L) => Math.round((L.cill - KEEL_ALLOW) * 100) / 100;
const fillNow = (L) => (L.restriction && L.restriction.fill) || L.fill;
const extraNow = (L) => (L.restriction && L.restriction.extra) || 0;
const lockful = (L) => Math.round(L.chamber * L.width * L.fall); // m³ per fill
const fallBand = (f) => (f < 2.4 ? 'low' : f <= 2.6 ? 'mid' : 'high');
const FALL_BANDS = { low: 'Under 2.4 m', mid: '2.4 to 2.6 m', high: 'Over 2.6 m' };

// Chainage: metres from the Basin entrance. Each lock structure is chamber + 6 m long.
const chain = (locks, start) => {
  let at = start;
  return locks.map((L) => {
    const tail = at, head = at + L.chamber + 6;
    at = head + (L.next || 0);
    return { n: L.n, tail, head };
  });
};
// Water level of the pound below each lock, metres above the Basin
const levels = (locks) => {
  let z = 0;
  return locks.map((L) => { const low = z; z += L.fall; return { n: L.n, low, high: z }; });
};
const totalFall = (locks) => Math.round(locks.reduce((s, L) => s + L.fall, 0) * 10) / 10;

// ---------- will it fit ----------
const FIT_RANGE = { len: [6, 25], beam: [1, 3], draft: [0.3, 1.5] };
const fit = ({ len, beam, draft }, locks) => locks.map((L) => {
  const why = [];
  if (len > L.chamber) why.push({ k: 'len', text: `${m1(len - L.chamber)} m too long` });
  if (beam > beamMax(L)) why.push({ k: 'beam', text: `${m2(beam - beamMax(L))} m too wide` });
  if (draft > draughtMax(L)) why.push({ k: 'draft', text: `${m2(draft - draughtMax(L))} m too deep` });
  return { n: L.n, ok: !why.length, why };
});
const lockNames = (ns) => (ns.length === 1 ? `Lock ${ns[0]}` : `Locks ${listAnd(ns.map(String))}`);
// Plain sentences, grouped by limit: "Your boat is 18.4 m. Locks 3 and 4 take 18.0 m. They will not fit."
const fitSummary = (input, locks) => {
  const res = fit(input, locks);
  const bad = res.filter((r) => !r.ok);
  if (!bad.length) return [`Your boat fits all ${locks.length} locks.`];
  const out = [];
  const group = (k, val) => {
    const by = new Map();
    res.forEach((r, i) => { if (r.why.some((w) => w.k === k)) { const v = val(locks[i]); by.set(v, [...(by.get(v) || []), r.n]); } });
    return [...by.entries()];
  };
  const lens = group('len', (L) => m1(L.chamber));
  if (lens.length) {
    const parts = lens.map(([v, ns]) => `${lockNames(ns)} take${ns.length === 1 ? 's' : ''} ${v} m`);
    const n = lens.reduce((s, [, ns]) => s + ns.length, 0);
    out.push(`Your boat is ${m1(input.len)} m. ${parts.join('; ')}. ${n === 1 ? 'It' : 'They'} will not fit.`);
  }
  const beams = group('beam', (L) => m2(beamMax(L)));
  if (beams.length) {
    const n = beams.reduce((s, [, ns]) => s + ns.length, 0);
    out.push(n === locks.length
      ? `Your beam is ${m2(input.beam)} m. No lock in the flight takes more than ${beams.map(([v]) => v).sort()[0]} m.`
      : `Your beam is ${m2(input.beam)} m. ${beams.map(([v, ns]) => `${lockNames(ns)} take${ns.length === 1 ? 's' : ''} ${v} m`).join('; ')}.`);
  }
  const drafts = group('draft', (L) => m2(draughtMax(L)));
  if (drafts.length) {
    out.push(`Your draught is ${m2(input.draft)} m. ${drafts.map(([v, ns]) => `${lockNames(ns)} take${ns.length === 1 ? 's' : ''} ${v} m`).join('; ')} (depth over the cill less ${m2(KEEL_ALLOW)} m).`);
  }
  out.push(`${bad.length} of ${locks.length} locks will not take this boat, so it cannot pass through the flight.`);
  return out;
};

// ---------- keepers ----------
// timetable: { Mon: [from, to] | null, ... } in minutes
const keeperAt = (table, day, min) => {
  const t = table[day];
  if (t && min >= t[0] && min < t[1]) return { on: true, until: t[1], from: t[0] };
  // next start: later today, then following days
  const i = DAYS.indexOf(day);
  if (t && min < t[0]) return { on: false, nextDay: day, nextFrom: t[0], today: true };
  for (let k = 1; k <= 7; k++) {
    const d = DAYS[(i + k) % 7], s = table[d];
    if (s) return { on: false, nextDay: d, nextFrom: s[0], today: false };
  }
  return { on: false };
};
const keeperLine = (table, day, min) => {
  const k = keeperAt(table, day, min);
  if (k.on) return `Keeper on duty until ${hm(k.until)}`;
  if (k.nextDay) return `No keeper on duty. Next on duty ${k.today ? 'today' : dayName(k.nextDay)} at ${hm(k.nextFrom)}`;
  return 'No keeper on duty';
};

// ---------- passage ----------
const QUEUE_MAX = 10;
const passage = ({ from, at, queue }, locks, pounds, table, day) => {
  const up = from !== 'top';
  const order = up ? locks : [...locks].reverse();
  const wait = queue * QUEUE_MIN;
  let t = at + wait;
  const steps = [];
  order.forEach((L, i) => {
    const work = (up ? fillNow(L) : fillNow(L) - 1) + extraNow(L) + GATES_MIN;
    steps.push({ n: L.n, name: L.name, in: t, out: t + work, work, note: L.restriction ? L.restriction.short : '' });
    t += work;
    if (i < order.length - 1) {
      const gap = up ? L.next : order[i + 1].next;
      t += gap / POUND_SPEED;
    }
  });
  const k = table[day];
  const warn = [];
  if (!k) warn.push(`No keeper on duty on ${dayName(day)}. The flight is chained.`);
  else {
    if (at + wait < k[0]) warn.push(`The keeper comes on at ${hm(k[0])}. You cannot enter the first lock before then.`);
    if (at + wait > k[1] - LAST_ENTRY_BEFORE) warn.push(`Last entry to the flight is ${hm(k[1] - LAST_ENTRY_BEFORE)} on ${dayName(day)}.`);
    if (t > k[1]) warn.push(`You would still be in the flight after the keeper goes off at ${hm(k[1])}.`);
  }
  return { up, start: at, wait, enter: at + wait, finish: t, about: round5(t), steps, warn };
};
const passageLine = (r, queue) => `Through the flight by about ${hm(r.about)}${queue ? ` with ${queue === 1 ? 'one boat' : (['', '', 'two', 'three', 'four', 'five'][queue] || queue) + ' boats'} ahead` : ''}`;

// ---------- tolls ----------
const TOLL_RANGE = { len: [6, 25], days: [1, 28] };
const TOLL_BANDS = [[12, 14], [18, 19], [Infinity, 24]]; // under 12 m £14 · 12 to under 18 m £19 · 18 m and over £24
const RETURN_WITHIN = 7;
const RETURN_OFF = 0.25;
const MOOR_RATE = 0.5;
const tollBand = (len) => TOLL_BANDS.find(([lim]) => len < lim)[1];
const toll = ({ len, mode, days }) => {
  const base = tollBand(len);
  const lines = [[`One passage, boat ${m1(len)} m`, base]];
  let total = base;
  if (mode === 'return') {
    lines.push(['Second passage', base]);
    total = base * 2;
    if (days <= RETURN_WITHIN) {
      const off = Math.round(total * RETURN_OFF * 100) / 100;
      lines.push([`Back within ${RETURN_WITHIN} days (${days} ${days === 1 ? 'day' : 'days'}), 25% off`, -off]);
      total -= off;
    } else lines.push([`Back after ${days} days, no reduction`, 0]);
  }
  if (mode === 'moor') {
    const moor = Math.round(days * len * MOOR_RATE * 100) / 100;
    lines.push([`Mooring ${days} ${days === 1 ? 'night' : 'nights'} × ${m1(len)} m × ${gbp(MOOR_RATE)}`, moor]);
    total += moor;
  }
  return { lines, total: Math.round(total * 100) / 100 };
};

// ---------- stoppages ----------
const STOP_RANGE = ['2026-10-01', '2027-03-31'];
const stoppagesOn = (iso, list) => list.filter((s) => s.from <= iso && iso <= s.to);
const closedSet = (list) => {
  const set = new Set();
  list.forEach((s) => { for (let d = s.from; d <= s.to; d = addDays(d, 1)) set.add(d); });
  return set;
};

// ---------- drawings ----------
const f1 = (n) => Math.round(n * 10) / 10;

// Side section of one lock. Water rect `.water` sits at the lower level; CSS moves it up by `--rise` (user units).
const sectionSVG = (L) => {
  const W = 640, H = 300, XS = 18, ZS = 34;           // 18 px per metre along, 34 px per metre up (about 1.9× exaggeration)
  const chamberW = L.chamber * XS, x0 = (W - chamberW) / 2, x1 = x0 + chamberW;
  const yLow = 196, rise = L.fall * ZS, yHigh = yLow - rise;
  const floor = yLow + L.cill * ZS;                    // chamber floor level with the lower cill
  const yTopBed = yHigh + L.cill * ZS;                 // upper pound bed / top cill
  const gate = 7;
  const wallTop = yHigh - 22;
  const g = [];
  g.push(`<svg class="section" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="sec-t sec-d" style="--rise:${f1(rise)}px">`);
  g.push(`<title id="sec-t">Section through Lock ${L.n}, ${esc(L.name)}</title>`);
  g.push(`<desc id="sec-d">Fall ${m1(L.fall)} m. Chamber ${m1(L.chamber)} m long and ${m1(L.width)} m wide. ${m2(L.cill)} m of water over the cill. Fills in ${fillNow(L)} min.</desc>`);
  g.push(`<defs><clipPath id="sec-clip"><rect x="${f1(x0 + gate)}" y="${f1(wallTop)}" width="${f1(chamberW - 2 * gate)}" height="${f1(floor - wallTop)}"/></clipPath></defs>`);
  // pounds either side
  g.push(`<rect class="pond" x="0" y="${yLow}" width="${f1(x0)}" height="${f1(floor - yLow)}"/>`);
  g.push(`<rect class="pond" x="${f1(x1)}" y="${f1(yHigh)}" width="${f1(W - x1)}" height="${f1(yTopBed - yHigh)}"/>`);
  // chamber water: full height rect, shifted down by the fall when the lock is empty
  g.push(`<g clip-path="url(#sec-clip)"><rect class="water" x="${f1(x0 + gate)}" y="${f1(yHigh)}" width="${f1(chamberW - 2 * gate)}" height="${f1(floor - yHigh + rise)}"/></g>`);
  // ground and masonry outline
  g.push(`<path class="ground" d="M0 ${f1(floor)} H${f1(x0)} V${f1(floor + 14)} H${f1(x1)} V${f1(yTopBed)} H${W}"/>`);
  g.push(`<path class="wall" d="M${f1(x0)} ${f1(floor)} V${f1(wallTop)} M${f1(x1)} ${f1(yTopBed)} V${f1(wallTop)} M${f1(x0)} ${f1(floor + 14)} H${f1(x1)}"/>`);
  g.push(`<line class="cope" x1="${f1(x0 - 40)}" y1="${f1(wallTop)}" x2="${f1(x1 + 40)}" y2="${f1(wallTop)}"/>`);
  // gates
  g.push(`<rect class="gate" x="${f1(x0)}" y="${f1(wallTop)}" width="${gate}" height="${f1(floor - wallTop)}"/>`);
  g.push(`<rect class="gate" x="${f1(x1 - gate)}" y="${f1(wallTop)}" width="${gate}" height="${f1(yTopBed - wallTop)}"/>`);
  // level lines
  g.push(`<line class="lvl" x1="0" y1="${yLow}" x2="${f1(x0)}" y2="${yLow}"/><line class="lvl" x1="${f1(x1)}" y1="${f1(yHigh)}" x2="${W}" y2="${f1(yHigh)}"/>`);
  // dimensions
  const dx = x1 + 22;
  g.push(`<path class="dim" d="M${f1(dx)} ${yLow} V${f1(yHigh)} M${f1(dx - 5)} ${yLow} H${f1(dx + 5)} M${f1(dx - 5)} ${f1(yHigh)} H${f1(dx + 5)}"/>`);
  g.push(`<text class="lbl" x="${f1(dx + 10)}" y="${f1((yLow + yHigh) / 2 + 5)}">Fall ${m1(L.fall)} m</text>`);
  g.push(`<path class="dim" d="M${f1(x0)} ${f1(floor + 32)} H${f1(x1)} M${f1(x0)} ${f1(floor + 26)} V${f1(floor + 38)} M${f1(x1)} ${f1(floor + 26)} V${f1(floor + 38)}"/>`);
  g.push(`<text class="lbl" x="${f1((x0 + x1) / 2)}" y="${f1(floor + 54)}" text-anchor="middle">Chamber ${m1(L.chamber)} m</text>`);
  g.push(`<text class="lbl" x="10" y="${yLow - 10}">Lower pound</text>`);
  g.push(`<text class="lbl" x="${W - 10}" y="${f1(yHigh - 10)}" text-anchor="end">Upper pound</text>`);
  g.push(`<text class="lbl" x="${f1(x0 - 8)}" y="${f1(wallTop - 8)}">Bottom gates</text>`);
  g.push(`<text class="lbl" x="${f1(x1 + 8)}" y="${f1(wallTop - 8)}" text-anchor="end">Top gates</text>`);
  g.push(`<text class="lbl" x="10" y="${f1(floor - 8)}">${m2(L.cill)} m over cill</text>`);
  g.push('</svg>');
  return g.join('');
};

// Long profile of the flight: steps of water level against chainage
const profileSVG = (locks, start, current) => {
  const W = 640, H = 230, padL = 34, padR = 12, padT = 34, padB = 34;
  const ch = chain(locks, start), lv = levels(locks);
  const end = ch[ch.length - 1].head + 200, total = totalFall(locks);
  const X = (m) => padL + (m / end) * (W - padL - padR);
  const Y = (z) => padT + (1 - z / total) * (H - padT - padB);
  let d = `M${f1(X(0))} ${f1(Y(0))}`;
  ch.forEach((c, i) => { d += ` H${f1(X(c.tail))} V${f1(Y(lv[i].high))}`; });
  d += ` H${f1(X(end))}`;
  const fillD = d + ` V${H - padB} H${f1(X(0))} Z`;
  const g = [];
  g.push(`<svg class="profile" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="pro-t"><title id="pro-t">Long profile: ${locks.length} locks, ${m1(total)} m of fall over ${m1(end / 1000)} km</title>`);
  g.push(`<path class="pond" d="${fillD}"/><path class="lvl" d="${d}"/>`);
  g.push(`<line class="dim" x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}"/>`);
  ch.forEach((c, i) => {
    const x = X(c.tail);
    g.push(`<text class="num${current === c.n ? ' is-cur' : ''}" x="${f1(x)}" y="${f1(Y(lv[i].high) - 8)}" text-anchor="middle">${c.n}</text>`);
  });
  [0, 10, 20].forEach((z) => g.push(`<text class="lbl" x="${padL - 6}" y="${f1(Y(z) + 4)}" text-anchor="end">${z}</text>`));
  g.push(`<text class="lbl" x="${padL}" y="${H - 10}">Basin entrance, 0 km</text><text class="lbl" x="${W - padR}" y="${H - 10}" text-anchor="end">Hollin Pound, ${m1(end / 1000)} km</text>`);
  g.push(`<text class="lbl" x="${padL - 6}" y="16" text-anchor="end">m</text>`);
  g.push('</svg>');
  return g.join('');
};

// Plan strip: locks as ticks along the line, moorings as thick bars beneath
const planSVG = (locks, start, moorings) => {
  const W = 640, H = 150, padL = 12, padR = 12;
  const ch = chain(locks, start);
  const end = ch[ch.length - 1].head + 400;
  const X = (m) => padL + (m / end) * (W - padL - padR);
  const g = [];
  g.push(`<svg class="plan" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="plan-t"><title id="plan-t">Plan: ${moorings.length} moorings along the flight, measured from the Basin entrance</title>`);
  g.push(`<line class="canal" x1="${padL}" y1="56" x2="${W - padR}" y2="56"/>`);
  ch.forEach((c) => {
    g.push(`<rect class="lockmark" x="${f1(X(c.tail))}" y="48" width="${f1(Math.max(3, X(c.head) - X(c.tail)))}" height="16"/>`);
    g.push(`<text class="num" x="${f1((X(c.tail) + X(c.head)) / 2)}" y="38" text-anchor="middle">${c.n}</text>`);
  });
  moorings.forEach((m, i) => {
    const y = 80 + (i % 2) * 22;
    g.push(`<rect class="moor" x="${f1(X(m.from))}" y="${y}" width="${f1(Math.max(4, X(m.to) - X(m.from)))}" height="8"/>`);
    g.push(`<text class="lbl" x="${f1(X(m.from))}" y="${y + 19}">${m.id}</text>`);
  });
  g.push(`<text class="lbl" x="${padL}" y="${H - 4}">0 m</text><text class="lbl" x="${W - padR}" y="${H - 4}" text-anchor="end">${Math.round(end / 100) * 100} m</text>`);
  g.push('</svg>');
  return g.join('');
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

window.TWL={NOW,GATES_MIN,QUEUE_MIN,POUND_SPEED,BEAM_ALLOW,KEEL_ALLOW,LAST_ENTRY_BEFORE,DAYS,dayName,m1,m2,gbp,pad2,hm,parseHM,dur,round5,listAnd,isIso,addDays,dow,dateLabel,dateLong,dayMonth,span,monthName,monthGrid,beamMax,draughtMax,fillNow,extraNow,lockful,fallBand,FALL_BANDS,chain,levels,totalFall,FIT_RANGE,fit,fitSummary,keeperAt,keeperLine,QUEUE_MAX,passage,passageLine,TOLL_RANGE,TOLL_BANDS,RETURN_WITHIN,RETURN_OFF,MOOR_RATE,tollBand,toll,STOP_RANGE,stoppagesOn,closedSet,sectionSVG,profileSVG,planSVG,esc};
})();
