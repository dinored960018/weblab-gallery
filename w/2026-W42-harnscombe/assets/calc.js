// generated from calc.mjs by build.mjs
(function(){
// Harnscombe Ringing Centre — shared calculations. build.mjs imports this; the browser gets the same code as assets/calc.js.

const NOW = { iso: '2026-10-14', label: 'Wed 14 Oct 2026', clock: '10:00 BST' };
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ---------- dates (UTC noon so no zone drift) ----------
const toDate = (iso) => new Date(iso + 'T12:00:00Z');
const isoOf = (d) => d.toISOString().slice(0, 10);
const addDays = (iso, n) => { const d = toDate(iso); d.setUTCDate(d.getUTCDate() + n); return isoOf(d); };
const weekday = (iso) => toDate(iso).getUTCDay();
const dateLabel = (iso) => { const d = toDate(iso); return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`; };
const dateLong = (iso) => { const d = toDate(iso); return `${dateLabel(iso)} ${d.getUTCFullYear()}`; };
const yymmdd = (iso) => iso.slice(2).replace(/-/g, '');
const LAST_DAY = addDays(NOW.iso, 60);

// ---------- weights ----------
const lbOf = (t) => t[0] * 112 + t[1] * 28 + t[2];
const cwtOf = (lb) => { lb = Math.round(lb); const c = Math.floor(lb / 112); const r = lb - c * 112; const q = Math.floor(r / 28); return [c, q, r - q * 28]; };
const cwtLong = (t) => `${t[0]} cwt ${t[1]} qr ${t[2]} lb`;
const cwtShort = (t) => `${t[0]}–${t[1]}–${t[2]}`;
const kgOf = (lb) => Math.round(lb * 0.45359237);
const fmtInt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// ---------- notes ----------
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const MAJOR = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19];
const pcOf = (key) => (PC[key[0]] + (key.includes('♭') ? -1 : key.includes('♯') ? 1 : 0) + 12) % 12;
const usesFlats = (key) => key.includes('♭') || key === 'F';
// Bells of a ring, treble first: note and weight scaled from the tenor
function ring(bells, tenor, key) {
  const names = usesFlats(key) ? FLAT : SHARP;
  const t = lbOf(tenor);
  const out = [];
  for (let i = 1; i <= bells; i++) {
    const step = MAJOR[bells - i];
    const lb = i === bells ? t : t * Math.pow(2, (-1.6 * step) / 12);
    out.push({ n: i, note: names[(pcOf(key) + step) % 12], cwt: i === bells ? tenor : cwtOf(lb), lb: Math.round(lb) });
  }
  return out;
}

// ---------- place notation ----------
const STAGE = { 4: 'Minimus', 5: 'Doubles', 6: 'Minor', 8: 'Major' };
const BELL_COUNTS = [4, 5, 6, 8];
const METHODS = {
  hunt: { name: 'Plain Hunt', pn: (n) => (n % 2 ? `${n}.1` : `x1${n}`), note: 'Every bell hunts out to the back and in to the lead. Two blows at each end.' },
  bob: {
    name: 'Plain Bob',
    pn: (n) => ({ 4: 'x14x14x14x12', 5: '5.1.5.1.5.1.5.1.5.125', 6: 'x16x16x16x16x16x12', 8: 'x18x18x18x18x18x18x18x12' })[n],
    note: 'The treble plain hunts. At each lead end the bell in 2nds makes second’s place and the others dodge.',
  },
};
const methodName = (m, n) => (m === 'hunt' ? `Plain Hunt on ${n}` : `Plain Bob ${STAGE[n]}`);
function parsePN(pn) {
  const out = []; let cur = '';
  for (const ch of pn) {
    if (ch === 'x' || ch === '-') { if (cur) out.push(cur); cur = ''; out.push('x'); }
    else if (ch === '.') { if (cur) out.push(cur); cur = ''; }
    else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}
function change(row, tok) {
  const n = row.length;
  const places = tok === 'x' ? [] : [...tok].map((c) => (c === '0' ? 10 : Number(c)));
  const r = row.slice();
  for (let i = 0; i < n;) {
    if (places.includes(i + 1)) { i += 1; continue; }
    if (i + 1 < n && !places.includes(i + 2)) { [r[i], r[i + 1]] = [r[i + 1], r[i]]; i += 2; } else i += 1;
  }
  return r;
}
// Plain course: all rows from rounds back to rounds; leads of the given length
function course(m, n) {
  const toks = parsePN(METHODS[m].pn(n));
  const rounds = Array.from({ length: n }, (_, i) => i + 1);
  const rows = [rounds];
  let row = rounds;
  for (let guard = 0; guard < 40; guard++) {
    for (const t of toks) { row = change(row, t); rows.push(row); }
    if (row.every((b, i) => b === i + 1)) break;
  }
  const lead = m === 'hunt' ? rows.length - 1 : toks.length;
  return { rows, lead, leads: (rows.length - 1) / lead, changes: rows.length - 1, pn: METHODS[m].pn(n) };
}
// Read and correct a method request; returns the settings and any reasons it had to change
function methodState(q) {
  const errs = [];
  let n = Number(q.bells);
  if (!BELL_COUNTS.includes(n)) { if (q.bells != null && q.bells !== '') errs.push(`No ring of ${q.bells} here; showing 6 bells.`); n = 6; }
  let m = q.method;
  if (!METHODS[m]) { if (m) errs.push(`No method called “${m}”; showing Plain Bob.`); m = 'bob'; }
  const c = course(m, n);
  let bell = Number(q.bell);
  if (!(bell >= 1 && bell <= n && Number.isInteger(bell))) { if (q.bell != null && q.bell !== '') errs.push(`A ring of ${n} has no bell ${q.bell}; following bell 2.`); bell = 2; }
  let row = Number(q.row);
  if (!(row >= 0 && row <= c.changes && Number.isInteger(row))) { if (q.row != null && q.row !== '') errs.push(`${methodName(m, n)} has rows 0 to ${c.changes}; starting at 0.`); row = 0; }
  return { n, m, bell, row, c, errs };
}

// ---------- duration ----------
const PEAL = 5040;
function duration(bells, changes, secs, gap) {
  const total = changes * secs;
  const blow = gap ? (2 * secs) / (2 * bells + 1) : secs / bells;
  return { total, blow, share: changes / PEAL, peal: PEAL * secs };
}
const hmin = (s) => { const m = Math.round(s / 60); const h = Math.floor(m / 60); return h ? `${h} h ${m % 60} min` : `${m} min`; };
const hmm = (s) => { const m = Math.round(s / 60); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`; };

// ---------- bell estimate ----------
const PROFILES = {
  light: { label: 'Light', k: 0.00047, f: 0.95, note: 'Thin walls, often 18th-century trebles' },
  medium: { label: 'Medium', k: 0.00056, f: 1, note: 'Most rings cast since 1900' },
  heavy: { label: 'Heavy', k: 0.00066, f: 1.06, note: 'Thick walls, tenors of heavy rings' },
};
const NOTE12 = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
function estimate(d, p) {
  const pr = PROFILES[p];
  const kg = pr.k * d * d * d;
  const lb = kg / 0.45359237;
  const hz = (75850 / d) * pr.f;
  const midi = Math.round(69 + 12 * Math.log2(hz / 440));
  return { kg: Math.round(kg), lb: Math.round(lb), cwt: cwtOf(lb), hz: Math.round(hz), note: NOTE12[((midi % 12) + 12) % 12] };
}

// ---------- places free (seeded by date, same answer every time) ----------
const SALT = 'harnscombe-43';
function hash(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function sessionOn(iso, SESSIONS, courseFrom) {
  const w = weekday(iso);
  if (w === 4 && iso >= courseFrom) return { key: 'course', name: 'Learners’ course', time: '19:00 – 20:30', cap: 0, who: 'Enrolled learners only' };
  return SESSIONS[w] || null;
}
const freeOn = (iso, s) => (s && s.cap ? hash(`${SALT}|${iso}|${s.key}`) % (s.cap + 1) : 0);
// Why a date cannot be booked, or '' if it can
function dateProblem(iso, SESSIONS, courseFrom) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return 'Error: pick a date.';
  if (iso < NOW.iso) return 'Error: that date has passed. Pick today or later.';
  if (iso > LAST_DAY) return `Error: bookings open 60 days ahead, up to ${dateLong(LAST_DAY)}.`;
  const w = weekday(iso);
  if (w === 0 || w === 1) return 'Error: no practice on Sundays or Mondays. Pick Tuesday to Saturday.';
  const s = sessionOn(iso, SESSIONS, courseFrom);
  if (s.key === 'course') return 'Error: Thursdays from 5 Nov are course nights, for enrolled learners only.';
  return '';
}

// ---------- method diagram (SVG string; leads side by side, blue line follows one bell) ----------
function diagram(c, n, bell, label) {
  const cw = n >= 8 ? 17 : 22, rh = 20, numW = 32, gap = 22, top = 6;
  const leadW = numW + n * cw;
  const per = c.lead + 1;
  const W = c.leads * leadW + (c.leads - 1) * gap, H = top * 2 + per * rh;
  let rects = '', txt = '', lines = '';
  for (let L = 0; L < c.leads; L++) {
    const x0 = L * (leadW + gap);
    const pts = [];
    for (let j = 0; j < per; j++) {
      const r = L * c.lead + j, row = c.rows[r], y = top + j * rh;
      rects += `<rect class="dg-row" data-row="${r}" x="${x0}" y="${y}" width="${leadW}" height="${rh}"/>`;
      txt += `<text class="dg-rn" x="${x0 + numW - 10}" y="${y + rh / 2}" text-anchor="end" dominant-baseline="central">${r}</text>`;
      row.forEach((b, i) => {
        const cx = x0 + numW + i * cw + cw / 2;
        if (b === bell) pts.push(`${cx},${y + rh / 2}`);
        else txt += `<text class="dg-b" x="${cx}" y="${y + rh / 2}" text-anchor="middle" dominant-baseline="central">${b}</text>`;
      });
    }
    lines += `<polyline class="dg-line" pathLength="1" points="${pts.join(' ')}"/>`;
  }
  return `<svg class="dg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label}">${rects}${txt}${lines}</svg>`;
}

window.HRC={NOW,DAYS,toDate,isoOf,addDays,weekday,dateLabel,dateLong,yymmdd,LAST_DAY,lbOf,cwtOf,cwtLong,cwtShort,kgOf,fmtInt,ring,STAGE,BELL_COUNTS,METHODS,methodName,parsePN,change,course,methodState,PEAL,duration,hmin,hmm,PROFILES,estimate,hash,sessionOn,freeOn,dateProblem,diagram};
})();
