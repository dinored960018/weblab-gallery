// 감침세탁수선 — 도우미 답 규칙. 외부 API 없음. 이 사이트의 표와 규칙으로만 답한다.
// GCA.answer(질문, { page, rel, est }) → { html, steps, refs, acts, parse }
(function (g) {
  'use strict';
  const D = g.GC, C = g.GCC;
  const { esc, won, md } = C;
  const link = (rel, page, hash) => `${rel}${page ? page + '/' : ''}index.html${hash ? '#' + hash : ''}`;
  const kv = (rows) => `<dl class="a-kv">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  const nowTime = `${C.pad(D.NOW.h)}:${C.pad(D.NOW.m)}`;
  // 받침에 따라 로 / 으로
  const ro = (w) => { const c = w.charCodeAt(w.length - 1); if (c < 0xac00 || c > 0xd7a3) return w + '(으)로'; const j = (c - 0xac00) % 28; return w + (j === 0 || j === 8 ? '로' : '으로'); };

  const STEPS = {
    est: ['품목 확인', '요금표 대조', '찾는 날 계산'],
    status: ['접수 번호 확인', '단계 대조', '보관 기한 계산'],
    care: ['얼룩 · 소재 확인', '얼룩표 대조'],
    store: ['날짜 확인', '보관료 규칙 대조'],
    zone: ['구역 확인', '수거 요일 대조'],
    hours: ['날짜 확인', '영업시간표 대조'],
  };

  function itemLine(rel, kind, id) {
    const x = kind === 'l' ? C.L[id] : C.R[id];
    return { t: `${kind === 'l' ? '세탁 요금표' : '수선 요금표'} · ${x.name} 줄`, href: link(rel, kind === 'l' ? 'laundry' : 'repair', `${kind}-${id}`) };
  }

  function answer(q, ctx) {
    const rel = ctx.rel || '';
    const t = String(q || '').trim();
    const est = ctx.est || null;
    if (!t) return null;

    // 1. 사람에게
    if (/상담|사장님|사람|직원|통화/.test(t)) {
      return { html: '<p>상담 요청서를 채워 두었습니다. 고친 뒤 「요청서 확인」을 누르세요. 전송되지 않습니다.</p>', acts: [['handoff', '상담 요청서 열기']], refs: [] };
    }

    // 2. 조회
    const no = t.match(/GC[-\s]?(\d{4})[-\s]?(\d{2})/i);
    if (no || /조회|어디까지|다\s*됐|됐나요|맡긴\s*옷/.test(t)) {
      if (!no) return { html: `<p>접수 번호와 휴대전화 뒷자리 4개가 필요합니다.</p>${kv([['예시', 'GC-1102-07 1234']])}`, refs: [{ t: '맡긴 옷 조회', href: link(rel, 'status') }], acts: [] };
      const code = `GC-${no[1]}-${no[2]}`;
      const ph = t.replace(no[0], ' ').match(/(?:^|\D)(\d{4})(?!\d)/);
      if (!ph) return { steps: STEPS.status, html: `<p>${esc(code)} · 휴대전화 뒷자리 4개를 같이 적어 주세요.</p>`, refs: [{ t: '맡긴 옷 조회', href: link(rel, 'status', '') + `?no=${code}` }], acts: [] };
      const r = C.lookup(code, ph[1]);
      if (!r) return { steps: STEPS.status, html: `<p>찾은 접수 없음 · ${esc(code)} · 뒷자리 ${esc(ph[1])}</p><p>번호를 다시 확인하세요.</p>`, refs: [{ t: '예시 접수 번호', href: link(rel, 'status', 'samples') }], acts: [['handoff', '상담 요청']] };
      const rows = [['접수', `${md(r.at.slice(0, 10))} ${r.at.slice(11)} · ${esc(r.how)}`], ['찾는 날', `${md(r.ready)} ${D.RULES.ready}부터`]];
      r.items.forEach(([n, q2, s]) => rows.push([`${n} ${q2}`, D.STAGES[s]]));
      let warn = '';
      if (r.days > D.RULES.freeDays) warn = `<p class="a-warn">무료 보관 ${md(r.freeUntil)}까지 · ${r.over}일 지남 · 보관료 ${won(r.fee)}</p>`;
      else if (r.days >= 0 && r.allReady) warn = `<p>무료 보관: ${md(r.freeUntil)}까지</p>`;
      return { steps: STEPS.status, html: kv(rows) + warn, refs: [{ t: '조회 결과 보기', href: link(rel, 'status') + `?no=${code}&ph=${ph[1]}` }, ...(r.fee ? [{ t: '보관료 규칙', href: link(rel, 'storage', 'rules') }] : [])], acts: [] };
    }

    // 3. 얼룩
    const stains = C.findBy(D.STAINS, t);
    if (stains.length && /얼룩|묻|빠지|빠져|흘|번졌|자국|빼/.test(t)) {
      const old = /오래|지난|몇\s*달|작년|한\s*달|2주|이\s*주/.test(t);
      const s = stains[0];
      const lv = Math.min(2, s.level + (old ? 1 : 0));
      const rows = [['빠지는 정도', D.STAIN_LEVEL[lv] + (old ? ' (오래된 얼룩)' : '')], ['하지 말 것', esc(s.dont)], ['얼룩 빼기', `${won(s.fee)} 더`]];
      return { steps: STEPS.care, html: `<p>${esc(s.name)} 얼룩</p>${kv(rows)}${old ? '<p class="a-warn">2주 넘은 얼룩은 빠지는 정도를 한 단계 낮춰 안내합니다.</p>' : ''}`, refs: [{ t: `얼룩표 · ${s.name} 줄`, href: link(rel, 'care', 's-' + s.id) }], acts: [] };
    }
    // 4. 소재
    const mats = C.findBy(D.MATERIALS, t);
    if (mats.length && /소재|물세탁|드라이|줄어|빨아|세탁\s*방법|주의|돼요|되나|빨면/.test(t)) {
      const m = mats[0];
      const bad = /물세탁|빨아|빨면/.test(t) && m.method !== 'water';
      const rows = [['세탁 방식', D.METHODS[m.method]], ['주의', esc(m.warn)], ['추가 요금', m.fee ? won(m.fee) : '없음']];
      return { steps: STEPS.care, html: `<p>${esc(m.name)}</p>${kv(rows)}${bad ? `<p class="a-warn">${esc(m.name)}: 물세탁 안 함 · ${ro(D.METHODS[m.method])} 맡기세요.</p>` : ''}`, refs: [{ t: `소재표 · ${m.name} 줄`, href: link(rel, 'care', 'm-' + m.id) }], acts: [] };
    }

    // 5. 보관
    if (/보관|안\s*찾|못\s*찾|미수령|깜빡|오래\s*두/.test(t)) {
      const n = t.match(/(\d+)\s*일/);
      const rows = [['무료 보관', `찾는 날 다음 날부터 ${D.RULES.freeDays}일`], ['그 뒤', `접수 한 건 하루 ${won(D.RULES.feePerDay)} · 최대 ${won(D.RULES.feeCap)}`], [`${D.RULES.longDays}일 지남`, '장기 보관 목록 · 문자 안내'], [`${D.RULES.talkDays}일 지남`, '전화로 처리 방법 상의']];
      let extra = '';
      if (n) { const f = C.storageFee(Number(n[1])); extra = `<p>${n[1]}일 지난 경우: 보관료 ${won(f.fee)}${f.over ? ` (${f.over}일 × ${won(D.RULES.feePerDay)}${f.fee === D.RULES.feeCap ? ', 상한' : ''})` : ' · 무료 기간 안'}</p>`; }
      return { steps: STEPS.store, html: kv(rows) + extra, refs: [{ t: '보관료 규칙', href: link(rel, 'storage', 'rules') }], acts: [] };
    }

    // 6. 영업시간 · 휴무
    const pd = C.parseDate(t);
    if (/몇\s*시|영업|문\s*(열|닫)|마감|휴무|쉬는|쉬어|일요일/.test(t) && !(C.parseText(t).hits.length)) {
      const day = pd ? pd.iso : C.today;
      const h = C.hoursOf(day);
      const rows = [[md(day), h ? `${h[0]}~${h[1]}${D.SHORT[day] ? ' (단축 영업)' : ''}` : esc(D.CLOSED[day] || '일요일 휴무')]];
      if (!pd) rows.push(['접수 마감', `${D.RULES.cutoff} 전 접수분은 그날 접수로 계산`], ['찾는 시간', `찾는 날 ${D.RULES.ready}부터`]);
      return { steps: STEPS.hours, html: kv(rows), refs: [{ t: '영업시간표', href: link(rel, 'pickup', 'hours') }], acts: [] };
    }
    // 결제
    if (/카드|결제|현금|계좌/.test(t)) return { html: kv([['결제', esc(D.INFO.pay)]]), refs: [{ t: '이용 안내 · 결제', href: link(rel, 'info', 'pay') }], acts: [] };

    // 7. 품목 · 수선
    const p = C.parseText(t);
    if (p.hits.length) {
      const late = /오후|저녁|퇴근|밤|11시\s*(넘|지나|후)/.test(t);
      if (p.hits.length === 1 && !p.want && !p.how && /얼마|값|요금|언제|며칠|찾|맡기면|맡길/.test(t)) {
        const h = p.hits[0];
        const x = h.kind === 'l' ? C.L[h.id] : C.R[h.id];
        const pc = h.kind === 'l' ? C.pickupCalc(C.today, late ? '15:00' : nowTime, [h.id], []) : C.pickupCalc(C.today, late ? '15:00' : nowTime, [], [h.id]);
        const rows = [['값', `${won(x.price)} / ${x.unit}${h.kind === 'r' && x.cond ? ` · ${esc(x.cond)}` : ''}`], ['방식', h.kind === 'l' ? D.METHODS[x.method] : '수선'], ['소요일', `영업일 ${x.days}일`], ['찾는 날', `${md(pc.ready)} ${D.RULES.ready}부터`]];
        if (h.kind === 'l') rows.push(['급행', x.express ? `${won(Math.ceil(x.price * D.RULES.expressRate / 500) * 500)} · 하루 당김` : '안 됨']);
        const cl = pc.closed.length ? `<p class="a-warn">${pc.closed.map((c) => md(c) + ' ' + esc(D.CLOSED[c])).join(' · ')}로 하루 늦어짐</p>` : '';
        return { steps: STEPS.est, html: `<p>${esc(x.name)} · ${late ? '오늘 11:00 뒤' : '오늘 11:00 전'} 접수 기준</p>${kv(rows)}${cl}`, refs: [itemLine(rel, h.kind, h.id)], acts: [['fill', '견적 칸에 넣기']], parse: p };
      }
      const st = { items: p.items, repairs: p.repairs, express: p.express, how: p.how || 'shop', zone: p.zone || 'solbat', want: p.want };
      const e = C.estimate(st);
      const rows = [['합계', won(e.total) + (e.fee ? ` (수거비 ${won(e.fee)} 포함)` : '')], ['찾는 날', e.ready ? `${md(e.ready)} ${D.RULES.ready}부터` : '—']];
      if (e.deliver) rows.push(['배달', md(e.deliver)]);
      if (p.want) rows.push(['원하는 날', md(p.want)]);
      const w = C.warnings(st, e).map((x) => `<p class="a-warn">${esc(x.t)} · ${esc(x.why)}</p>`).join('');
      return { steps: STEPS.est, html: `<p>읽은 조건은 아래 칩입니다. 빼거나 고친 뒤 「견적 칸에 넣기」를 누르세요.</p>${kv(rows)}${w}`, refs: e.lines.slice(0, 4).map((l) => itemLine(rel, l.kind, l.id)), acts: [['fill', '견적 칸에 넣기']], parse: p };
    }

    // 8. 지금 견적으로 답 (급행 · 수거 · 언제)
    if (est && est.lines && est.lines.length && /급행|수거|배달|언제|얼마|합계/.test(t)) {
      const st = { ...est.st, express: /급행/.test(t) ? true : est.st.express, how: /수거|배달/.test(t) ? 'pickup' : est.st.how };
      const e = C.estimate(st);
      const rows = [['지금 견적', `${est.lines.length}가지 · ${won(est.total)} · ${est.ready ? md(est.ready) : '—'}`], [/급행/.test(t) ? '급행이면' : /수거|배달/.test(t) ? '수거 · 배달이면' : '다시 계산', `${won(e.total)} · ${e.ready ? md(e.ready) : '—'}${e.deliver ? ` · 배달 ${md(e.deliver)}` : ''}`]];
      return { steps: STEPS.est, html: kv(rows), refs: [{ t: '세 가지 안 비교', href: link(rel, 'estimate', 'options') }], acts: [] };
    }
    if (/급행/.test(t)) {
      const rows = [['급행', '값 1.5배 · 하루 당김']];
      D.LCATS.forEach(([c, name]) => { const no2 = D.LAUNDRY.filter((x) => x.cat === c && !x.express); if (no2.length) rows.push([`안 됨 · ${name}`, esc(no2.length === D.LAUNDRY.filter((x) => x.cat === c).length ? '전부' : no2.map((x) => x.name).join(' · '))]); });
      return { html: kv(rows), refs: [{ t: '세탁 요금표 · 급행 칸', href: link(rel, 'laundry', 'table') }], acts: [] };
    }

    // 9. 수거 · 배달
    if (/수거|배달|가지러/.test(t) || D.ZONES.some((z) => t.includes(z.name))) {
      const z = D.ZONES.find((x) => t.includes(x.name));
      const list = z ? [z] : D.ZONES;
      const rows = list.map((x) => [x.name, `${x.days.map((d) => C.DOW[d]).join(' · ')} · ${x.slots.join(' / ')} · 다음 수거 ${md(C.zoneDay(x, C.add(C.today, 1)))}`]);
      rows.push(['최소 금액', `${won(D.RULES.minPickup)} · 미만이면 수거비 ${won(D.RULES.pickupFee)}`]);
      return { steps: STEPS.zone, html: kv(rows), refs: [{ t: z ? `수거 구역 · ${z.name} 줄` : '수거 구역표', href: link(rel, 'delivery', z ? 'z-' + z.id : 'zones') }], acts: [] };
    }

    return { html: '<p>표에 없는 질문이라 답할 수 없습니다. 품목 이름 · 얼룩 · 접수 번호 · 구역 이름으로 물어보거나 사장님께 넘기세요.</p>', refs: [], acts: [['handoff', '상담 요청']] };
  }

  const CHIPS = {
    home: ['패딩 찾는 날', '오늘 마감 시각', '셔츠 5장 정장 1벌 금요일까지', '커피 얼룩'],
    laundry: ['롱패딩 값', '급행 안 되는 품목', '이불 찾는 날'],
    repair: ['바지 기장 줄이기 값', '코트 지퍼 교체', '셔츠 품 줄이기'],
    estimate: ['셔츠 5장 정장 1벌 바지 기장 금요일까지', '급행이면 언제', '수거로 하면'],
    status: ['GC-1102-07 1234', 'GC-0923-04 5678'],
    pickup: ['오후에 코트 맡기면', '11월 14일 영업'],
    storage: ['보관료 규칙', '40일 못 찾으면'],
    care: ['오래된 와인 얼룩', '실크 물세탁'],
    delivery: ['버들동 수거 요일', '수거 최소 금액'],
    info: ['카드 결제', '영업시간', '사장님 상담'],
  };

  g.GCA = { answer, CHIPS };
})(typeof window !== 'undefined' ? window : globalThis);
