// 새벽노드 — 계산 규칙. 빌드(node vm)와 브라우저가 같은 파일을 쓴다. window.SB(데이터) → window.SBC
(function (g) {
  'use strict';
  const D = g.SB;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (n, d = 0) => Number(n).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const won = (n) => num(Math.round(n)) + '원';
  const pad = (n) => String(n).padStart(2, '0');
  const G = Object.fromEntries(D.GPUS.map((x) => [x.id, x]));
  const P = Object.fromEntries(D.PLANS.map((x) => [x.id, x]));
  const R = Object.fromEntries(D.REGIONS.map((x) => [x.id, x]));
  const today = `${D.NOW.y}-${pad(D.NOW.mo)}-${pad(D.NOW.d)}`;

  // 시간당 단가: 등급 × 리전 배수 × (1 - 할인), 원 단위 반올림
  function unit(grade, region, plan) {
    return Math.round(G[grade].hour * R[region].mult * (1 - P[plan].off));
  }
  // 한 달 비용. 약정은 720시간 전체, 쓰는 만큼은 하루 시간 × 일수
  function monthly(c) {
    const u = unit(c.grade, c.region, c.plan);
    const hours = P[c.plan].commit ? D.MONTH_HOURS : Math.min(24, c.hpd) * Math.min(31, c.days);
    return { unit: u, hours, total: u * c.count * hours };
  }
  // 쓰는 만큼이 약정보다 비싸지는 하루 사용 시간(30일 기준)
  function breakeven(plan) { return Math.round(24 * (1 - P[plan].off) * 10) / 10; }

  // 모델 메모리(GB) = 매개변수(B) × 바이트 × 1.2
  function needMem(params, bits) { return Math.round(params * D.MODEL.bytes[bits] * D.MODEL.overhead * 10) / 10; }
  function perUser(params) { return D.MODEL.kvPerUser * params; }
  // 서버 한 대가 받는 동시 사용자 수. 모델이 안 들어가면 0
  function capacity(grade, params, bits) {
    const room = G[grade].mem - needMem(params, bits);
    if (room <= 0) return 0;
    return Math.floor(room / perUser(params));
  }
  // 조건을 채우는 등급별 구성
  function fits(params, bits, users) {
    return D.GPUS.map((x) => {
      const cap = capacity(x.id, params, bits);
      return { grade: x.id, cap, count: cap ? Math.max(1, Math.ceil(users / cap)) : 0 };
    });
  }

  // 말로 조건 넣기 — "70B 모델, 동시 200명, 서울, 평일 낮만"
  function parseNeed(text) {
    const t = String(text || '');
    const out = { chips: [], miss: [] };
    let m;
    if ((m = t.match(/(\d+(?:\.\d+)?)\s*[bB]\b|(\d+(?:\.\d+)?)\s*(?:억|빌리언)/))) {
      out.params = Number(m[1] || m[2]) * (m[2] ? 0.1 : 1);
      out.chips.push(['params', `모델 ${num(out.params, out.params % 1 ? 1 : 0)}B`]);
    } else out.miss.push('모델 크기(예: 13B)');
    if ((m = t.match(/(16|8|4)\s*(?:비트|bit)/i))) { out.bits = Number(m[1]); out.chips.push(['bits', `${out.bits}비트`]); }
    if ((m = t.match(/(?:동시\s*(?:사용자|접속)?\s*)(\d[\d,]*)\s*명?|(\d[\d,]*)\s*명/))) {
      out.users = Number((m[1] || m[2]).replace(/,/g, ''));
      out.chips.push(['users', `동시 ${num(out.users)}명`]);
    } else out.miss.push('동시 사용자 수(예: 동시 200명)');
    const reg = D.REGIONS.find((r) => t.includes(r.name));
    if (reg) { out.region = reg.id; out.chips.push(['region', reg.name]); }
    if (/24\s*시간|하루\s*종일|밤낮|상시/.test(t)) { out.hpd = 24; out.days = 30; }
    else if ((m = t.match(/하루\s*(\d+)\s*시간/))) { out.hpd = Number(m[1]); }
    else if (/낮|업무\s*시간|근무\s*시간/.test(t)) { out.hpd = 10; }
    if (/평일/.test(t)) out.days = 22; else if (/매일|주말\s*포함/.test(t) && !out.days) out.days = 30;
    if (out.hpd) out.chips.push(['hpd', `하루 ${out.hpd}시간`]);
    if (out.days) out.chips.push(['days', `한 달 ${out.days}일`]);
    if ((m = t.match(/(1|12)\s*개월\s*약정/))) { out.plan = m[1] === '1' ? 'm1' : 'm12'; out.chips.push(['plan', P[out.plan].name]); }
    return out;
  }

  // 가장 싼 요금제(같은 구성에서)
  function bestPlan(c) {
    return D.PLANS.map((p) => ({ plan: p.id, ...monthly({ ...c, plan: p.id }) })).sort((a, b) => a.total - b.total)[0];
  }

  // 세 가지 안. need = { params, bits, users, hpd, days, region }
  function options(need) {
    const bits = need.bits || D.MODEL.defaultBits;
    const hpd = need.hpd || 10, days = need.days || 22;
    const list = fits(need.params, bits, need.users).filter((f) => f.cap);
    if (!list.length) return [];
    const stockOk = (grade, region, count) => R[region].stock[grade] >= count;
    const priced = [];
    list.forEach((f) => D.REGIONS.forEach((r) => {
      if (!stockOk(f.grade, r.id, f.count)) return;
      const c = { grade: f.grade, count: f.count, region: r.id, hpd, days };
      const b = bestPlan(c);
      priced.push({ ...c, plan: b.plan, total: b.total, cap: f.cap });
    }));
    if (!priced.length) return [];
    const cheap = [...priced].sort((a, b) => a.total - b.total)[0];
    const home = need.region || 'seoul';
    const near = [...priced].filter((x) => x.region === home).sort((a, b) => a.total - b.total)[0] || cheap;
    // 여유: 가장 싼 구성 + 한 대, 두 리전에 나눔
    const spare = { ...cheap, count: cheap.count + 1, split: true };
    const other = D.REGIONS.find((r) => r.id !== cheap.region && stockOk(cheap.grade, r.id, 1));
    spare.region2 = other ? other.id : cheap.region;
    const half = Math.ceil(spare.count / 2);
    spare.total = bestPlan({ ...spare, count: half }).total + bestPlan({ ...spare, region: spare.region2, count: spare.count - half }).total;
    spare.plan = bestPlan({ ...spare, count: half }).plan;
    return [
      { key: 'cost', label: '비용 우선', why: '조건을 채우는 구성 가운데 한 달 비용이 가장 낮습니다.', ...cheap },
      { key: 'latency', label: '지연 우선', why: `${R[home].name} 리전에 둡니다. ${D.CITIES.includes(R[home].name) ? R[home].name : '서울'}에서 왕복 지연 ${D.LATENCY[home][Math.max(0, D.CITIES.indexOf(R[home].name))]}ms.`, ...near },
      { key: 'spare', label: '여유 우선', why: `한 대를 더 두고 ${R[spare.region].name} · ${R[spare.region2].name} 두 리전에 나눕니다. 한쪽 점검 · 장애 때도 멈추지 않습니다.`, ...spare },
    ];
  }

  // 이상 알림. c = 계산기 값, need = 모델 조건(있으면)
  function alerts(c, need) {
    const out = [];
    const gr = G[c.grade], rg = R[c.region];
    if (need && need.params) {
      const bits = need.bits || D.MODEL.defaultBits;
      const nm = needMem(need.params, bits);
      if (nm >= gr.mem) out.push({ id: 'mem', lv: 'bad', t: `모델 메모리 ${num(nm, 1)}GB · ${gr.name} 메모리 ${num(gr.mem)}GB`, fix: `더 큰 등급을 고르거나 ${bits > 4 ? '비트를 낮추세요' : '등급을 올리세요'}.`, ref: `gpu/index.html#g-${c.grade}` });
      else if (need.users) {
        const cap = capacity(c.grade, need.params, bits) * c.count;
        if (cap < need.users) out.push({ id: 'cap', lv: 'warn', t: `동시 ${num(need.users)}명 · 이 구성은 ${num(cap)}명까지`, fix: `${Math.ceil(need.users / capacity(c.grade, need.params, bits))}대가 필요합니다.`, ref: 'pricing/index.html#rule-mem' });
      }
    }
    if (rg.stock[c.grade] < c.count) out.push({ id: 'stock', lv: 'bad', t: `${rg.name} 리전 ${gr.name} 남은 대수 ${rg.stock[c.grade]}대 · 요청 ${c.count}대`, fix: '다른 리전을 고르거나 상담으로 배정 일정을 잡으세요.', ref: `regions/index.html#r-${c.region}` });
    if (c.plan === 'od') {
      const b = bestPlan(c);
      if (b.plan !== 'od') out.push({ id: 'plan', lv: 'warn', t: `${P[b.plan].name}이 한 달 ${won(monthly(c).total - b.total)} 쌉니다`, fix: `하루 ${breakeven(b.plan)}시간 넘게 매일 쓰면 ${P[b.plan].name}이 유리합니다.`, ref: 'pricing/index.html#rule-plan', act: ['plan', b.plan] });
    }
    const live = D.INCIDENTS.find((i) => !i.end && i.comp.includes(c.region));
    if (live) out.push({ id: 'inc', lv: 'warn', t: `${rg.name} 리전 진행 중: ${live.title}`, fix: `${live.start}부터 · 새 배정이 늦을 수 있습니다.`, ref: `status/index.html#${live.id}` });
    return out;
  }

  // 붙여넣어 읽기 — 다른 클라우드 청구서 줄
  function parseBill(text) {
    return String(text || '').split(/\n/).map((s) => s.trim()).filter(Boolean).map((line) => {
      const mem = line.match(/(\d+)\s*GB/i);
      const cnt = line.match(/[x×]\s*(\d+)/i);
      const hrs = line.match(/(\d[\d,]*)\s*시간/);
      const amt = line.match(/(?:₩\s*)?(\d{1,3}(?:,\d{3})+|\d{4,})\s*원?/g);
      const isGpu = /GPU/i.test(line) && mem && hrs;
      const money = amt ? Number(amt[amt.length - 1].replace(/[₩원,\s]/g, '')) : null;
      if (isGpu && money) {
        const m = Number(mem[1]);
        const grade = (D.GPUS.find((x) => x.gpus === 1 && x.mem >= m) || G.g80x8).id;
        const count = cnt ? Number(cnt[1]) : 1;
        const hours = Number(hrs[1].replace(/,/g, ''));
        const ours = unit(grade, 'seoul', 'od') * count * hours;
        return { ok: true, kind: 'gpu', line, mem: m, count, hours, money, grade, ours };
      }
      if (money && /저장|스토리지|storage/i.test(line)) {
        const gb = line.match(/(\d[\d,]*)\s*GB/i);
        const g2 = gb ? Number(gb[1].replace(/,/g, '')) : 0;
        const st = D.EXTRA.find((e) => e.id === 'store');
        return { ok: true, kind: 'store', line, gb: g2, money, ours: Math.max(0, g2 - st.free) * st.price };
      }
      return { ok: false, line, why: money ? 'GPU · 저장소 줄이 아님' : '금액을 못 찾음' };
    });
  }

  // 날짜 도우미
  const dt = (s) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  const ds = (t) => { const x = new Date(t); return `${x.getUTCFullYear()}-${pad(x.getUTCMonth() + 1)}-${pad(x.getUTCDate())}`; };
  const md = (s) => `${Number(s.slice(5, 7))}월 ${Number(s.slice(8, 10))}일`;

  // 구성 요소의 지난 90일. 하루 가동률 = 100 - (장애 분 + 저하 분 × 0.5) / 1440
  function statusDays(comp) {
    const end = dt(today), out = [];
    for (let i = D.STATUS_DAYS - 1; i >= 0; i--) {
      const day = ds(end - i * 86400000);
      const inc = D.INCIDENTS.filter((x) => x.date === day && x.comp.includes(comp));
      let lost = 0, kind = 'ok';
      inc.forEach((x) => {
        if (x.kind === 'down') { lost += x.min; kind = 'down'; }
        else if (x.kind === 'slow') { lost += x.min * 0.5; if (kind !== 'down') kind = 'slow'; }
        else if (kind === 'ok') kind = 'maint';
      });
      out.push({ day, pct: Math.round((100 - (lost / 1440) * 100) * 1000) / 1000, kind, inc: inc.map((x) => x.id) });
    }
    return out;
  }
  function uptime(comp) {
    const d = statusDays(comp);
    return Math.round((d.reduce((s, x) => s + x.pct, 0) / d.length) * 100) / 100;
  }
  function uptimeAll() {
    const v = D.COMPONENTS.map((c) => uptime(c.id));
    return Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 100) / 100;
  }

  g.SBC = { esc, num, won, pad, md, G, P, R, today, unit, monthly, breakeven, needMem, perUser, capacity, fits, parseNeed, bestPlan, options, alerts, parseBill, statusDays, uptime, uptimeAll };
})(typeof window !== 'undefined' ? window : globalThis);
