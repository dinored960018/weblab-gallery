// 연귀표구사 — 날짜·값 계산. 화면(site.js)과 생성기(build.mjs)가 같은 식을 쓴다.
(function (root) {
  const D = root.YW;
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const iso = (dt) => dt.toISOString().slice(0, 10);
  const add = (dt, n = 1) => new Date(dt.getTime() + n * 864e5);
  const holi = (s) => D.HOLIDAYS.find((h) => h.iso === s);
  const isOpen = (dt) => { if (dt.getUTCDay() === 0) return false; const h = holi(iso(dt)); return !h || h.open; };
  const md = (dt) => `${dt.getUTCMonth() + 1}월 ${dt.getUTCDate()}일(${DOW[dt.getUTCDay()]})`;
  const won = (n) => n.toLocaleString('ko-KR') + '원';
  const cm = (n) => (Math.round(n * 10) / 10).toFixed(1);
  const up100 = (n) => Math.ceil(n / 100) * 100;
  function cutoffOf(dt) {
    const h = holi(iso(dt));
    if (h && h.open) return D.HOURS.holiday.cutoff;
    return dt.getUTCDay() === 6 ? D.HOURS.sat.cutoff : D.HOURS.weekday.cutoff;
  }
  // 맡긴 날. 오늘 마감 전이면 오늘, 아니면 다음 영업일
  function startDay() {
    let d = parse(D.TODAY.iso);
    if (!isOpen(d) || D.TODAY.time >= cutoffOf(d)) { do d = add(d); while (!isOpen(d)); }
    return d;
  }
  // 영업일 n일 뒤(맡긴 다음 날부터 센다)
  function bizDue(days) { let d = startDay(); let n = 0; while (n < days) { d = add(d); if (isOpen(d)) n++; } return d; }
  // 달력 n일 뒤. 닫는 날이면 다음 영업일
  function calDue(days) { let d = add(startDay(), days); while (!isOpen(d)) d = add(d); return d; }
  // 다음 영업일 목록
  function openDays(from, n) { const out = []; let d = from; while (out.length < n) { if (isOpen(d)) out.push(d); d = add(d); } return out; }

  // 액자 값. o = { w, h, mat, bottom, m, g } (cm · 몰딩 번호 · 유리 id 또는 'none')
  function quote(o) {
    const M = D.MOULDINGS.find((x) => x.id === o.m) || D.MOULDINGS[1];
    const G = D.GLAZING.find((x) => x.id === o.g) || null;
    const mat = Number(o.mat) || 0;
    const extra = mat > 0 && o.bottom ? 1 : 0;
    const iw = o.w + 2 * mat, ih = o.h + 2 * mat + extra;
    const fw = M.w / 10;
    const ow = iw + 2 * fw, oh = ih + 2 * fw;
    const lenCm = 2 * (iw + ih) + 8 * fw;
    const area = (iw * ih) / 10000;
    const R = D.RATES;
    const lines = [
      { k: '몰딩', v: up100((lenCm / 100) * M.price), note: `${cm(lenCm)} cm × 1 m당 ${won(M.price)}` },
      { k: '유리', v: G ? Math.max(R.glassMin, up100(area * G.price)) : 0, note: G ? `${G.name} ${area.toFixed(3)} ㎡` : '넣지 않음' },
      { k: '매트', v: mat > 0 ? up100(area * R.matPerM2) + R.matWindow : 0, note: mat > 0 ? `${cm(mat)} cm 폭 · 창 내기 포함` : '넣지 않음' },
      { k: '뒷판', v: up100(area * R.backPerM2), note: 'MDF 3 mm' },
      { k: '공임', v: R.base, note: '자르기·연귀 맞춤·조립' },
    ];
    const total = lines.reduce((s, l) => s + l.v, 0);
    const kg = ((lenCm / 100) * M.g) / 1000 + (G ? area * G.kg : 0) + (mat > 0 ? area * R.matKgM2 : 0) + area * R.backKgM2;
    const days = R.baseDays + (M.days || 0) + (G ? G.days : 0) + (Math.max(ow, oh) > R.bigEdge ? R.bigDays : 0);
    return { M, G, mat, extra, iw, ih, fw, ow, oh, lenCm, area, lines, total, kg, days, due: bizDue(days) };
  }

  root.YWCALC = { DOW, parse, iso, add, isOpen, md, won, cm, startDay, bizDue, calDue, openDays, quote };
})(typeof window !== 'undefined' ? window : globalThis);
