// 살결정육점 — 계산 · 에이전트 규칙 (브라우저와 build.mjs 가 같이 쓴다)
(function (G) {
  const D = G.SG;
  const won = (n) => Math.round(n).toLocaleString('ko-KR');
  const kg = (g) => (g >= 1000 ? (g / 1000).toFixed(g % 1000 === 0 ? 0 : 1).replace(/\.0$/, '') + ' kg' : g + ' g');
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const toTime = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  const cut = (id) => D.CUTS.find((c) => c.id === id);
  const kindName = (k) => D.KINDS.find((x) => x.id === k).name;
  const fullName = (c) => (c.kind === 'lamb' || c.name.startsWith(kindName(c.kind)) ? c.name : kindName(c.kind) + ' ' + c.name);
  const useName = (u) => D.USES.find((x) => x.id === u).name;
  const store = (id) => D.STORES.find((s) => s.id === id);
  const cost = (c, g) => Math.round((c.price * g) / 100);
  const ceil100 = (g) => Math.ceil(g / 100) * 100;
  const DAYS = '일월화수목금토';
  // 조사: 받침 유무로 을/를 · 은/는 · 으로/로
  function josa(w, pair) {
    const ch = String(w).trim().slice(-1);
    let jong = -1;
    if (/[가-힣]/.test(ch)) jong = (ch.charCodeAt(0) - 0xac00) % 28;
    else if (/[gm]/i.test(ch)) jong = 16; // 그램 · 미터 → ㅁ 받침
    const has = jong > 0;
    const [a, b] = pair.split('/');
    if (pair === '으로/로') return w + (has && jong !== 8 ? '으로' : '로');
    return w + (has ? a : b);
  }
  const todayDow = DAYS[new Date(D.NOW.iso + 'T00:00:00').getDay()];
  const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return d; };
  const isoOf = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const md = (d) => `${d.getMonth() + 1}월 ${d.getDate()}일 (${DAYS[d.getDay()]})`;
  const mdIso = (iso) => md(new Date(iso + 'T00:00:00'));

  function storeState(s) {
    if (s.closedDay === todayDow) return { open: false, label: '오늘 휴무', code: 'off' };
    const n = D.NOW.min;
    if (n < toMin(s.open)) return { open: false, label: s.open + ' 영업 시작', code: 'later' };
    if (n >= toMin(s.close)) return { open: false, label: '영업 종료', code: 'done' };
    return { open: true, label: '영업 중 · ' + s.close + '까지', code: 'open' };
  }

  function slots(storeId) {
    const s = store(storeId);
    const st = storeState(s);
    const out = [];
    for (let m = toMin(s.open); m <= toMin(s.close) - 30; m += 30) {
      const t = toTime(m);
      let state = 'open';
      if (st.code === 'off') state = 'off';
      else if (m < D.NOW.min + D.PICKUP_LEAD) state = 'past';
      else if ((D.SLOT_FULL[storeId] || []).includes(t)) state = 'full';
      out.push({ t, state });
    }
    return out;
  }
  const firstSlot = (storeId) => (slots(storeId).find((x) => x.state === 'open') || {}).t || null;

  // 숙성 판 — 꺼낼 날 · 오늘 기준 며칠째
  function batchInfo(b) {
    const out = addDays(b.in, b.days);
    const day = Math.round((new Date(D.NOW.iso + 'T00:00:00') - new Date(b.in + 'T00:00:00')) / 864e5);
    const left = b.days - day;
    return { outIso: isoOf(out), outLabel: md(out), inLabel: mdIso(b.in), day, left, today: left === 0 };
  }
  function todayOut() {
    const rows = [];
    D.AGING.forEach((a) => a.batches.forEach((b) => { if (batchInfo(b).today) rows.push({ unit: a, b, c: cut(b.cut) }); }));
    return rows;
  }

  // 체크 조회 · 에이전트 공통 — 용도와 인원으로 부위 · 중량을 정한다
  function planUse(use, people, preferCut) {
    const u = D.USES.find((x) => x.id === use);
    const total = people * u.perPerson;
    let split;
    if (preferCut) split = [[preferCut, 1]];
    else {
      const p = D.PLANS.find((x) => x.use === use);
      split = p ? p.split : [[{ steak: 'b-sirloin', soup: 'b-flank' }[use], 1]];
    }
    const items = []; const notes = [];
    split.forEach(([id, r]) => {
      let c = cut(id);
      const g = ceil100(total * r);
      if (g / 1000 > c.stock) {
        const p = D.PLANS.find((x) => x.use === use);
        const altId = p && p.alt[id];
        if (altId && cut(altId).stock >= g / 1000) {
          notes.push(`${fullName(c)} 남은 양 ${c.stock} kg → ${josa(fullName(cut(altId)), '으로/로')} 바꿈`);
          c = cut(altId);
          items.push({ id: c.id, g });
          return;
        }
        const capped = Math.floor(c.stock * 10) * 100;
        notes.push(`${fullName(c)} 남은 양 ${c.stock} kg만 담음 · 요청 ${kg(g)}`);
        items.push({ id: c.id, g: capped });
        return;
      }
      items.push({ id: c.id, g });
    });
    return { use, people, total, items, notes };
  }

  // 체크 조회 3단계
  function checkRun(planIds, people, storeId) {
    const plans = planIds.map((pid) => D.PLANS.find((p) => p.id === pid));
    const results = plans.map((p) => planUse(p.use, people));
    const items = []; results.forEach((r) => r.items.forEach((it) => items.push(it)));
    const stockLine = items.map((it) => `${fullName(cut(it.id))} ${cut(it.id).stock} kg`).join(' · ');
    const notes = results.flatMap((r) => r.notes);
    const weightLine = results.map((r) => `${useName(r.use)} ${people}인 × ${D.USES.find((u) => u.id === r.use).perPerson} g → ${kg(ceil100(r.total))}`).join(' · ');
    let s = store(storeId); let slot = firstSlot(storeId); let moved = '';
    if (!slot) {
      const other = D.STORES.find((x) => firstSlot(x.id));
      moved = `${josa(s.name, '은/는')} ${storeState(s).label} → `;
      s = other; slot = firstSlot(other.id);
    }
    return {
      steps: [
        { name: '재고 확인', detail: stockLine + (notes.length ? ' · ' + notes.join(' · ') : '') },
        { name: '중량 계산', detail: weightLine },
        { name: '픽업 시각', detail: moved + `${s.name} ${slot}` },
      ],
      items, store: s.id, slot,
    };
  }

  // 주문 계산
  function orderCalc(cutId, people, use, thick) {
    const c = cut(cutId);
    const u = D.USES.find((x) => x.id === use);
    const g = ceil100(people * u.perPerson);
    const per = c.slice * thick;
    const pieces = Math.max(1, Math.round(g / per));
    return { g, price: cost(c, g), pieces, per: Math.round(per), stockOk: g / 1000 <= c.stock };
  }

  // ── 에이전트 규칙 ─────────────────────────────────────────
  const NUM = { 한: 1, 하나: 1, 두: 2, 둘: 2, 세: 3, 셋: 3, 네: 4, 넷: 4, 다섯: 5, 여섯: 6, 일곱: 7, 여덟: 8, 아홉: 9, 열: 10 };
  function parsePeople(q) {
    let m = q.match(/(\d{1,2})\s*(인|명|사람|식구)/);
    if (m) return Number(m[1]);
    m = q.match(/(다섯|여섯|일곱|여덟|아홉|하나|한|두|둘|세|셋|네|넷|열)\s*(명|사람|식구)/);
    return m ? NUM[m[1]] : null;
  }
  function parseUse(q) {
    if (/스테이크/.test(q)) return 'steak';
    if (/수육|찜|보쌈/.test(q)) return 'boil';
    if (/불고기|볶음|반찬/.test(q)) return 'bulgogi';
    if (/국|탕|육수/.test(q)) return 'soup';
    if (/구이|구워|굽|바비큐/.test(q)) return 'grill';
    return null;
  }
  function parseKind(q) {
    if (/돼지|돈육/.test(q)) return 'pork';
    if (/양고기|램/.test(q)) return 'lamb';
    if (/소고기|쇠고기|한우|(^|\s)소\s/.test(q)) return 'beef';
    return null;
  }
  function parseCuts(q) {
    const flat = q.replace(/\s+/g, '');
    const kind = parseKind(q);
    let found = D.CUTS.filter((c) => flat.includes(c.name.replace(/\s+/g, '')));
    // 양갈비 안의 '갈비' 같은 겹침 제거: 더 긴 이름이 잡히면 짧은 이름은 버린다
    found = found.filter((c) => !found.some((o) => o !== c && o.name.replace(/\s+/g, '').includes(c.name.replace(/\s+/g, '')) && o.name.length > c.name.length));
    if (kind) { const k = found.filter((c) => c.kind === kind); if (k.length) found = k; }
    return found;
  }
  const cutLine = (c) => `${fullName(c)}: 100 g ${won(c.price)}원 · ${c.aging ? '숙성 ' + c.aging + '일' : '숙성 안 함'} · 권장 두께 ${c.thick} cm · 남은 양 ${c.stock} kg`;

  function cartSummary(cart) {
    if (!cart.length) return ['장바구니 초안이 비어 있습니다. "4인 구이"처럼 인원과 용도를 말하면 담겠습니다.'];
    const total = cart.reduce((a, it) => a + cost(cut(it.id), it.g), 0);
    return ['장바구니 초안입니다.'].concat(cart.map((it) => `${fullName(cut(it.id))} ${kg(it.g)} · ${won(cost(cut(it.id), it.g))}원`), [`합계 ${won(total)}원`]);
  }

  function reply(qRaw, ctx) {
    const q = String(qRaw || '').trim();
    const cart = (ctx && ctx.cart) || [];
    if (!q) return { lines: ['질문을 입력하세요.'], rule: '빈 입력' };
    const people = parsePeople(q);
    const use = parseUse(q);
    const cuts = parseCuts(q);
    const stores = D.STORES.filter((s) => q.includes(s.name) || q.includes(s.area) || q.includes(s.name.replace('점', '')));

    if (/장바구니|담은|담긴/.test(q)) return { lines: cartSummary(cart), rule: '장바구니' };

    if (people && (use || cuts.length)) {
      const u = use || cuts[0].uses[0];
      if (people > 30) return { lines: ['30인이 넘는 주문은 매장 전화로 받습니다.'], rule: '인원 + 용도' };
      const pc = cuts.find((c) => c.uses.includes(u));
      const r = planUse(u, people, pc && pc.id);
      const lines = [`${people}인 ${useName(u)}용으로 ${josa(r.items.map((it) => `${fullName(cut(it.id))} ${kg(it.g)}`).join(', '), '을/를')} 담았습니다.`];
      r.items.forEach((it) => lines.push(`${fullName(cut(it.id))} ${kg(it.g)} · ${won(cost(cut(it.id), it.g))}원`));
      r.notes.forEach((n) => lines.push('재고: ' + n));
      if (cuts.length && !pc) lines.push(`${josa(cuts.map(fullName).join(', '), '은/는')} ${useName(u)}용 부위가 아니어서 ${useName(u)} 기본 부위로 담았습니다.`);
      return {
        lines, rule: '인원 + 용도', add: r.items,
        steps: [
          { name: '재고 확인', detail: r.items.map((it) => `${fullName(cut(it.id))} ${cut(it.id).stock} kg`).join(' · ') },
          { name: '중량 계산', detail: `${people}인 × ${D.USES.find((x) => x.id === u).perPerson} g → ${kg(r.items.reduce((t, it) => t + it.g, 0))}` },
          { name: '장바구니 담기', detail: r.items.length + '줄' },
        ],
      };
    }
    if (people && !use && !cuts.length) return { lines: [`${people}인 기준으로 무엇을 할지 알려 주세요. 구이 · 스테이크 · 수육 · 국 · 불고기 중에서 고르면 됩니다.`], rule: '인원 + 용도' };

    if (cuts.length) {
      const lines = cuts.slice(0, 4).map(cutLine);
      const uses = [...new Set(cuts.flatMap((c) => c.uses))].map(useName).join(' · ');
      lines.push('용도: ' + uses);
      return { lines, rule: '부위 이름' };
    }
    if (stores.length) {
      const lines = stores.map((s) => `${s.name}: ${s.open}~${s.close} · ${storeState(s).label} · 휴무 ${s.closedDay === '없음' ? '없음' : s.closedDay + '요일'}${s.table ? ` · ${s.table.floor} 식당 ${s.table.seats}석` : ' · 식당 없음'}`);
      return { lines, rule: '매장 · 동네' };
    }
    if (/숙성|꺼내|꺼낸/.test(q)) {
      const rows = todayOut();
      const lines = ['오늘 꺼내는 판은 ' + rows.reduce((a, x) => a + x.b.trays, 0) + '판입니다.'];
      D.AGING.forEach((a) => {
        const r = rows.filter((x) => x.unit === a);
        if (r.length) lines.push(`${a.name}(${a.method}): ` + r.map((x) => `${fullName(x.c)} ${x.b.trays}판 · ${x.b.days}일`).join(', '));
      });
      return { lines, rule: '숙성' };
    }
    if (/픽업|몇\s*시|찾으러|가지러/.test(q)) {
      const lines = D.STORES.map((s) => { const t = firstSlot(s.id); return `${s.name}: ${t ? '가장 이른 픽업 ' + t : storeState(s).label}`; });
      return { lines, rule: '픽업' };
    }
    if (/영업|열어|문\s*열|휴무|쉬는/.test(q)) {
      return { lines: D.STORES.map((s) => `${s.name}: ${storeState(s).label}`), rule: '매장 · 동네' };
    }
    if (/식당|상차림|자리|좌석/.test(q)) {
      return { lines: ['2층 식당: 물푸레점 48석 · 장터점 36석', '상차림비: 어른 4,000원 · 초등학생 2,000원 · 미취학 무료', '마지막 주문 21:00'], rule: '식당' };
    }
    if (/가격|얼마|싼|저렴/.test(q)) {
      const k = parseKind(q);
      const list = D.CUTS.filter((c) => !k || c.kind === k).sort((a, b) => a.price - b.price).slice(0, 3);
      return { lines: ['100 g 가격이 낮은 부위입니다.'].concat(list.map((c) => `${fullName(c)} ${won(c.price)}원`)), rule: '가격' };
    }
    if (/안녕|도와|뭐\s*할|무엇을/.test(q)) {
      return { lines: ['부위 이름, 인원과 용도, 매장 이름으로 물어보세요.', '예: "4인 구이", "채끝 숙성", "솔밭점 영업"'], rule: '인사' };
    }
    return { lines: ['이 질문에 맞는 규칙이 없습니다.', '부위 이름, 인원과 용도, 매장 이름으로 물어보세요.'], rule: '규칙 없음' };
  }

  G.SGC = { won, kg, toMin, toTime, cut, kindName, fullName, useName, store, cost, storeState, slots, firstSlot, batchInfo, todayOut, planUse, checkRun, orderCalc, reply, cartSummary, josa, md, mdIso, todayDow, cutLine };
})(typeof window !== 'undefined' ? window : globalThis);
