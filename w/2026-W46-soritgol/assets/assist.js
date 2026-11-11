// 소릿골 스튜디오 — 도우미 답 규칙. 외부 API 없음. 이 사이트의 표와 규칙으로만 답한다.
// SGA.answer(질문, { rel }) → { html, steps, refs, acts }
(function (g) {
  'use strict';
  const D = g.SG, C = g.SGC;
  const { esc, won, md, hh } = C;
  const link = (rel, page, hash) => `${rel}${page ? page + '/' : ''}index.html${hash ? '#' + hash : ''}`;
  const kv = (rows) => `<dl class="a-kv">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  const STEPS = {
    need: ['조건 확인', '방 고르기', '빈 시간 대조', '요금 계산'],
    free: ['방 · 날짜 확인', '예약 달력 대조'],
    price: ['방 확인', '요금표 대조'],
    rec: ['곡 수 확인', '녹음 시간 계산', '요금 계산'],
    rule: ['규칙 확인'],
  };
  const roomIn = (t) => D.ROOMS.find((r) => t.replace(/\s/g, '').includes(r.name.replace(/\s/g, '')));
  const gearLine = (rm) => Object.entries(rm.gear).filter(([, q]) => q).map(([k, q]) => `${D.GEAR[k][0]}${D.GEAR[k][1] && q > 1 ? ' ' + q + D.GEAR[k][1] : k === 'iface' ? ' ' + q + '채널' : ''}`).join(' · ');

  function answer(q, ctx) {
    const rel = ctx.rel || '';
    const t = String(q || '').trim();
    if (!t) return null;

    // 1. 사람에게
    if (/상담|사람|직원|통화|전화\s*주|문의\s*남/.test(t)) {
      return { html: '<p>대화와 예약 초안을 요약해 상담 요청서에 채웠습니다. 고친 뒤 「요청서 확인」을 누르세요. 전송되지 않습니다.</p>', acts: [['handoff', '상담 요청서 열기']], refs: [] };
    }

    // 2. 녹음 견적 — "3곡 밴드 녹음"
    const songs = t.match(/(\d+)\s*곡/);
    if (songs && /녹음|레코딩/.test(t)) {
      const kind = /보컬|노래|내레이션/.test(t) && !/밴드|합주/.test(t) ? 'vocal' : 'band';
      const n = Number(songs[1]), hours = C.recHours(kind, n), room = kind === 'band' ? 'r1' : 'r2';
      const day = C.days().find((d) => !C.isWeekend(d) && C.freeStarts(room, d, Math.min(hours, 12)).length) || C.addDays(C.today, 1);
      const per = D.REC[kind];
      const hrs = Math.min(hours, 12);
      const st = (C.freeStarts(room, day, hrs)[0] != null ? C.freeStarts(room, day, hrs)[0] : 10);
      const p = C.price({ room, date: day, start: st, hours: hrs, engineer: true });
      return {
        steps: STEPS.rec,
        html: kv([['녹음 시간', `<b>${hours}시간</b> (준비 ${per.setup} + 곡당 ${per.perSong} × ${n}곡, 올림)`], ['방', `${C.R[room].name} · 엔지니어 포함`], ['가장 빠른 평일', `${md(day)} ${hh(st)}부터`], ['녹음 요금', `<b>${won(p.total)}</b>`], ['믹싱(선택)', `${won(D.EXTRAS.find((e) => e.id === 'mix').price)} × ${n}곡`]]),
        refs: [{ t: '녹음 시간 견적 규칙', href: link(rel, 'recording', 'estimate') }, { t: `요금표 · ${C.R[room].name} 줄`, href: link(rel, 'pricing', 'rate-' + room) }],
        acts: [['book', '예약 초안에 넣기', JSON.stringify({ room, date: day, start: st, hours: hrs, people: kind === 'band' ? 4 : 1, engineer: true })]],
      };
    }

    // 3. 조건 → 세 가지 안
    const need = C.parseNeed(t);
    const rm0 = roomIn(t);
    if (rm0) { need.room = rm0.id; need.kind = rm0.kind; }
    if (need.date && (need.kind || need.room) && !/빈\s*시간|비어|남은|가능한\s*시간/.test(t)) {
      const chips = need.chips.map(([, v]) => `<span class="chip">${esc(v)}</span>`).join('') + (need.hours ? '' : '<span class="chip chip-miss">시간 없음 → 2시간</span>') + (need.start != null ? '' : '<span class="chip chip-miss">시각 없음 → 19:00 근처</span>') + (need.people || need.kind !== 'band' ? '' : '<span class="chip chip-miss">인원 없음 → 4명</span>');
      const opts = C.options(need);
      if (!opts.length) return { steps: STEPS.need, html: `<div class="chips">${chips}</div><p class="a-warn">${md(need.date)}에 조건에 맞는 빈 시간이 없습니다.</p>`, refs: [{ t: '예약 달력', href: link(rel, 'booking', 'cal') }], acts: [['handoff', '상담 요청']] };
      const row = (o) => `<div><span class="a-lab">${esc(o.label)}</span><b>${esc(C.R[o.room].name)}</b><span>${md(o.date)} ${hh(o.start)}~${hh(o.start + o.hours)}</span><b>${won(o.total)}</b><span class="a-why">${esc(o.why)}</span></div>`;
      return {
        steps: STEPS.need,
        html: `<div class="chips">${chips}</div><div class="a-opts">${opts.map(row).join('')}</div>`,
        refs: [{ t: `방 규격 · ${C.R[opts[0].room].name}`, href: link(rel, 'rooms', 'room-' + opts[0].room) }, { t: '피크 · 일반 시간 규칙', href: link(rel, 'pricing', 'rule-peak') }, { t: `예약 달력 · ${md(opts[0].date)}`, href: link(rel, 'booking', 'cal') }],
        acts: [['book', '예약 초안에 넣기', JSON.stringify({ room: opts[0].room, date: opts[0].date, start: opts[0].start, hours: opts[0].hours, people: need.people || (need.kind === 'band' ? 4 : 1), engineer: !!need.engineer, regular: !!need.regular, need })]],
      };
    }

    // 4. 빈 시간
    if (/빈\s*시간|비어|남은|가능한\s*시간|언제\s*돼|언제\s*되/.test(t)) {
      const date = need.date || C.today;
      const rooms = rm0 ? [rm0] : need.kind ? C.fitRooms(need.kind, need.people) : D.ROOMS;
      const rows = rooms.map((r) => { const fs = C.freeStarts(r.id, date, need.hours || 1); return [r.name, fs.length ? fs.map(hh).join(' · ') : '<span class="a-warn">빈 시간 없음</span>']; });
      return { steps: STEPS.free, html: `<p>${md(date)} · ${need.hours || 1}시간 이어서 쓸 수 있는 시작 시각</p>${kv(rows)}`, refs: [{ t: `예약 달력 · ${md(date)}`, href: link(rel, 'booking', 'cal') }], acts: [] };
    }

    // 5. 취소 · 환불
    if (/취소|환불|변경|미루/.test(t)) {
      return { steps: STEPS.rule, html: kv([['이용일 3일 전까지', '전액 환불'], ['2일 · 1일 전', '50% 환불'], ['당일', '환불 없음'], ['날짜 변경', '이용일 3일 전까지 한 번']]), refs: [{ t: '이용 안내 · 취소와 환불', href: link(rel, 'guide', 'refund') }], acts: [] };
    }

    // 6. 방 요금 · 장비
    if (rm0) {
      const rows = [['크기 · 정원', `${rm0.area}㎡ · ${rm0.cap}명`], ['일반 시간', `${won(rm0.off)}/시간 (평일 18:00 전)`], ['피크 시간', `${won(rm0.peak)}/시간 (평일 18:00부터 · 주말)`], ['장비', esc(gearLine(rm0))]];
      if (rm0.kind === 'rec') rows.push(['엔지니어', `시간당 ${won(D.RULES.engineer)} 더`]);
      return { steps: STEPS.price, html: kv(rows), refs: [{ t: `요금표 · ${rm0.name} 줄`, href: link(rel, 'pricing', 'rate-' + rm0.id) }, { t: `방 규격 · ${rm0.name}`, href: link(rel, 'rooms', 'room-' + rm0.id) }], acts: [['book', `${rm0.name} 예약 초안`, JSON.stringify({ room: rm0.id })]] };
    }
    if (/요금|얼마|가격|할인|정기/.test(t)) {
      return { steps: STEPS.price, html: kv([...D.ROOMS.map((r) => [r.name, `${won(r.off)} · 피크 ${won(r.peak)}`]), ['할인', `4시간 이상 10% · 정기(주 1회 4주 이상) 15% — 큰 쪽 하나`]]), refs: [{ t: '요금표', href: link(rel, 'pricing') }], acts: [] };
    }

    // 7. 장비 목록
    if (/장비|앰프|마이크\s*몇|드럼\s*있/.test(t)) {
      return { html: kv(D.ROOMS.map((r) => [r.name, esc(gearLine(r))])) + '<p>가져올 장비 목록을 예약 페이지 「장비 목록 붙여넣기」에 넣으면 맞는 방을 찾습니다.</p>', refs: [{ t: '장비 목록 붙여넣기', href: link(rel, 'booking', 'paste') }], acts: [] };
    }

    // 8. 영업 · 위치
    if (/영업|몇\s*시|휴무|쉬는|문\s*여|오픈/.test(t)) {
      const bl = D.BLOCKS.map((b) => [md(b.date), `${hh(b.from)}~${hh(b.to)} ${esc(b.why)}${b.rooms === 'all' ? '' : ' (' + b.rooms.map((x) => C.R[x].name).join(' · ') + ')'}`]);
      return { steps: STEPS.rule, html: kv([['영업', `매일 ${hh(D.HOURS.open)}~${hh(D.HOURS.close)}`], ['휴무', esc(D.CLOSED_RULE)], ...bl]), refs: [{ t: '이용 안내 · 영업 시간', href: link(rel, 'guide', 'hours') }], acts: [] };
    }
    if (/위치|주소|어디|주차|지하철|오시는/.test(t)) {
      return { html: kv([['주소', esc(D.SITE.addr)], ['지하철', esc(D.SITE.subway)], ['주차', esc(D.SITE.parking)]]), refs: [{ t: '오시는 길', href: link(rel, 'location') }], acts: [] };
    }
    if (/엔지니어/.test(t)) {
      return { html: kv(D.ENGINEERS.map((e) => [e.name, `${esc(e.role)} · ${e.years}년 · ${e.days.map((d) => C.WD[d]).join(' ')} 근무`])), refs: [{ t: '엔지니어', href: link(rel, 'engineers') }], acts: [] };
    }

    return { html: `<p>이 사이트의 표로 답할 수 있는 질문입니다.</p>${kv([['예약', '"금요일 저녁 7시 4명 합주 2시간"'], ['빈 시간', '"토요일 합주실 2 빈 시간"'], ['녹음', '"밴드 녹음 3곡"'], ['규칙', '"취소하면 환불되나요"']])}`, refs: [], acts: [] };
  }

  g.SGA = { answer, STEPS, gearLine };
})(window);
