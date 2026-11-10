// 새벽노드 — 도우미 답 규칙. 외부 API 없음. 이 사이트의 표와 규칙으로만 답한다.
// SBA.answer(질문, { rel, calc }) → { html, steps, refs, acts }
(function (g) {
  'use strict';
  const D = g.SB, C = g.SBC;
  const { esc, num, won } = C;
  const link = (rel, page, hash) => `${rel}${page ? page + '/' : ''}index.html${hash ? '#' + hash : ''}`;
  const kv = (rows) => `<dl class="kv">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  const STEPS = {
    need: ['조건 확인', '메모리 계산', '대수 맞추기', '요금 계산'],
    price: ['등급 확인', '요금 규칙 대조'],
    lat: ['도시 확인', '지연 표 대조'],
    status: ['구성 요소 확인', '상태 기록 대조'],
  };
  const gradeIn = (t) => D.GPUS.slice().sort((a, b) => b.name.length - a.name.length).find((x) => t.toUpperCase().replace(/\s|X|\*/g, (c) => (c === 'X' || c === '*' ? '×' : '')).includes(x.name.toUpperCase()));

  function answer(q, ctx) {
    const rel = ctx.rel || '';
    const t = String(q || '').trim();
    if (!t) return null;

    // 1. 사람에게
    if (/상담|사람|영업|담당자|통화|연락/.test(t)) {
      return { html: '<p>대화와 계산 결과로 상담 요청서를 채웠습니다. 고친 뒤 「요청서 확인」을 누르세요. 전송되지 않습니다.</p>', acts: [['handoff', '상담 요청서 열기']], refs: [] };
    }

    // 2. 모델 조건 → 세 가지 안
    const need = C.parseNeed(t);
    if (need.params && (need.users || /동시|명|사용자/.test(t))) {
      if (!need.users) return { steps: STEPS.need, html: `<p>모델 ${num(need.params)}B · 동시 사용자 수가 빠졌습니다.</p><p class="a-warn">예: 동시 200명</p>`, refs: [{ t: '모델 메모리 규칙', href: link(rel, 'pricing', 'rule-mem') }], acts: [] };
      const bits = need.bits || D.MODEL.defaultBits;
      const nm = C.needMem(need.params, bits);
      const opts = C.options(need);
      const chips = need.chips.map(([, v]) => `<span class="chip">${esc(v)}</span>`).join('') + (need.bits ? '' : `<span class="chip chip-miss">비트 없음 → ${bits}비트로 계산</span>`) + (need.hpd ? '' : '<span class="chip chip-miss">시간 없음 → 하루 10시간</span>') + (need.days ? '' : '<span class="chip chip-miss">일수 없음 → 22일</span>');
      if (!opts.length) {
        return { steps: STEPS.need, html: `<div class="chips">${chips}</div><p class="a-warn">필요 메모리 ${num(nm, 1)}GB · 재고가 있는 등급으로 조건을 채우지 못했습니다.</p>`, refs: [{ t: 'GPU 사양표', href: link(rel, 'gpu') }], acts: [['handoff', '상담 요청']] };
      }
      const row = (o) => `<div><span class="sub">${esc(o.label)}</span><b>${C.G[o.grade].name} × ${o.count}</b><span>${C.R[o.region].name}${o.split ? ' + ' + C.R[o.region2].name : ''} · ${esc(C.P[o.plan].name)}</span><b>${won(o.total)}</b></div>`;
      return {
        steps: STEPS.need,
        html: `<div class="chips">${chips}</div>${kv([['필요 메모리', `<span class="mono">${num(nm, 1)}GB</span> (${num(need.params)}B × ${D.MODEL.bytes[bits]} × ${D.MODEL.overhead})`], ['한 명당', `<span class="mono">${num(C.perUser(need.params), 2)}GB</span>`]])}<div class="a-opts">${opts.map(row).join('')}</div><p class="sub">부가세 별도 · 남은 대수 안에서 계산</p>`,
        refs: [{ t: `GPU 사양표 · ${C.G[opts[0].grade].name} 줄`, href: link(rel, 'gpu', 'g-' + opts[0].grade) }, { t: '모델 메모리 규칙', href: link(rel, 'pricing', 'rule-mem') }, { t: `${C.R[opts[0].region].name} 리전 재고`, href: link(rel, 'regions', 'r-' + opts[0].region) }],
        acts: [['need', '계산기에 넣기', JSON.stringify({ need: { params: need.params, bits, users: need.users, region: need.region }, calc: { grade: opts[0].grade, count: opts[0].count, region: opts[0].region, plan: opts[0].plan, hpd: need.hpd || 10, days: need.days || 22 } })]],
      };
    }
    if (need.params && /들어|올릴|메모리|돌릴|되나|돼/.test(t)) {
      const bits = need.bits || D.MODEL.defaultBits;
      const nm = C.needMem(need.params, bits);
      const ok = D.GPUS.filter((x) => x.mem > nm);
      return { steps: STEPS.need, html: kv([['필요 메모리', `<span class="mono">${num(nm, 1)}GB</span> · ${bits}비트`], ['들어가는 등급', ok.length ? ok.map((x) => `${x.name}(동시 ${num(C.capacity(x.id, need.params, bits))}명)`).join(' · ') : '없음']]), refs: [{ t: '모델 메모리 규칙', href: link(rel, 'pricing', 'rule-mem') }], acts: [] };
    }

    // 3. 상태 · 장애
    if (/장애|상태|점검|느려|안\s*돼|먹통|가동률/.test(t)) {
      const live = D.INCIDENTS.filter((i) => !i.end);
      const rows = live.map((i) => [`진행 중 ${i.start}~`, `<span class="a-warn">${esc(i.title)}</span>`]);
      rows.push(['90일 가동률', `<span class="mono">${num(C.uptimeAll(), 2)}%</span>`]);
      const last = D.INCIDENTS.find((i) => i.end && i.kind === 'down');
      if (last) rows.push(['마지막 장애', `${C.md(last.date)} ${last.start}~${last.end} · ${esc(last.title)}`]);
      return { steps: STEPS.status, html: kv(rows), refs: [...live.map((i) => ({ t: `상태 기록 · ${i.title}`, href: link(rel, 'status', i.id) })), { t: '구성 요소별 90일', href: link(rel, 'status') }], acts: [] };
    }

    // 4. 지연 · 리전
    const city = D.CITIES.find((c) => t.includes(c));
    if (/지연|리전|가까|핑|ms|빠른\s*곳/.test(t) || (city && /에서/.test(t))) {
      if (city) {
        const i = D.CITIES.indexOf(city);
        const rows = D.REGIONS.map((r) => [r.name, `<span class="mono">${D.LATENCY[r.id][i]}ms</span>`]).sort((a, b) => parseFloat(a[1].replace(/<[^>]+>/g, '')) - parseFloat(b[1].replace(/<[^>]+>/g, '')));
        const best = D.REGIONS.slice().sort((a, b) => D.LATENCY[a.id][i] - D.LATENCY[b.id][i])[0];
        return { steps: STEPS.lat, html: `<p>${esc(city)} 기준 왕복 지연 중앙값 · 가장 짧은 곳 ${best.name}</p>${kv(rows)}`, refs: [{ t: `리전 지연 표 · ${best.name} · ${city} 줄`, href: link(rel, 'regions', `lat-${best.id}-${i}`) }], acts: [] };
      }
      return { steps: STEPS.lat, html: kv(D.REGIONS.map((r) => [r.name, `${r.site} · PUE ${r.pue} · 요금 배수 ${r.mult}`])), refs: [{ t: '리전', href: link(rel, 'regions') }], acts: [] };
    }

    // 5. 약정
    if (/약정|할인|언제\s*더\s*싸|싸/.test(t) && !gradeIn(t)) {
      return { steps: STEPS.price, html: kv([['1개월 약정', `30% 할인 · 하루 ${C.breakeven('m1')}시간 넘게 매일 쓰면 더 쌈`], ['12개월 약정', `45% 할인 · 하루 ${C.breakeven('m12')}시간 넘게 매일 쓰면 더 쌈`], ['쓰는 만큼', '분 단위 · 중지하면 저장소 요금만']]), refs: [{ t: '요금 규칙 · 약정이 더 싼 때', href: link(rel, 'pricing', 'rule-plan') }], acts: [] };
    }

    // 6. 등급 요금
    const gr = gradeIn(t);
    if (gr) {
      const rows = D.PLANS.map((p) => [p.name, `<span class="mono">${won(C.unit(gr.id, 'seoul', p.id))}</span>/시간 · 720시간 <span class="mono">${won(C.unit(gr.id, 'seoul', p.id) * 720)}</span>`]);
      rows.unshift(['사양', `${gr.mem}GB · vCPU ${gr.vcpu} · RAM ${num(gr.ram)}GB`]);
      rows.push(['남은 대수', D.REGIONS.map((r) => `${r.name} ${r.stock[gr.id]}`).join(' · ')]);
      return { steps: STEPS.price, html: kv(rows), refs: [{ t: `GPU 사양표 · ${gr.name} 줄`, href: link(rel, 'gpu', 'g-' + gr.id) }], acts: [['calc', `${gr.name}로 계산`, JSON.stringify({ calc: { grade: gr.id } })]] };
    }

    // 7. 한도
    if (/한도|분당|429|요청\s*수|최대\s*토큰/.test(t)) {
      return { steps: STEPS.price, html: kv(D.PLANS.map((p) => [p.name, `분당 ${num(p.rpm)} · 동시 배포 ${p.deploys}`])), refs: [{ t: '문서 · 요청 한도', href: link(rel, 'docs', 'limits') }], acts: [] };
    }
    // 8. 보안
    if (/보안|암호|데이터\s*위치|해외|삭제|로그|기록\s*보관/.test(t)) {
      return { html: kv(D.SECURITY.slice(0, 5).map(([k, v]) => [k, esc(v)])), refs: [{ t: '보안 · 데이터', href: link(rel, 'security') }], acts: [] };
    }
    // 9. 청구서
    if (/청구서|붙여|비교|지금\s*쓰는/.test(t)) {
      return { html: '<p>요금 페이지 「지금 청구서와 견주기」에 청구서 줄을 붙여넣으면 GPU · 저장소 줄을 읽어 견줍니다.</p>', refs: [{ t: '지금 청구서와 견주기', href: link(rel, 'pricing', 'paste') }], acts: [] };
    }
    // 10. 시작
    if (/시작|키|배포|첫\s*요청|문서|api/i.test(t)) {
      return { html: kv(D.DOC_STEPS.map((s, i) => [`0${i + 1} ${s.title}`, esc(s.body)])), refs: [{ t: '문서 · 첫 요청까지 4단계', href: link(rel, 'docs') }], acts: [] };
    }

    return { html: `<p>이 사이트의 표로 답할 수 있는 질문입니다.</p>${kv([['구성 · 요금', '"13B 모델 동시 50명, 하루 24시간"'], ['등급', '"G80 한 달 요금"'], ['지연', '"부산에서 지연"'], ['상태', '"지금 장애 있어?"']])}`, refs: [], acts: [] };
  }

  g.SBA = { answer, STEPS };
})(window);
