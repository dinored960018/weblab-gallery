// 이랑골 청과 공판장 — 결과 화면 조각 (build.mjs 와 브라우저가 같은 틀을 쓴다)
(function (g) {
  'use strict';
  const D = g.IG, C = g.IGCALC;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const dl = (rows, cls) => `<dl class="kv${cls ? ' ' + cls : ''}">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  const err = (msg) => `<p class="err"><b>오류</b> ${esc(msg)}</p>`;

  // ── 출하 정산 결과 ───────────────────────────────────────
  function settle(res) {
    if (!res.ok) {
      return `<p class="res-empty">입력 칸의 오류를 고치면 정산액이 나옵니다.</p>`;
    }
    const rows = res.lines.map(([k, how, v]) => `<tr><th scope="row">${k}</th><td>${how}</td><td class="num">${v < 0 ? '− ' : ''}${C.won(Math.abs(v))}원</td></tr>`).join('');
    const minus = res.net < 0 ? `<p class="note">차감액이 낙찰 총액보다 많습니다. 예상 낙찰가나 상자당 중량을 확인하세요.</p>` : '';
    return `<p class="net-label">${esc(C.itemName(res.it))} ${res.gr.name} · ${C.won(res.n)}상자 정산액</p>
<p class="net"><span>${res.net < 0 ? '− ' : ''}${C.won(Math.abs(res.net))}</span>원</p>
${minus}
<table class="tbl tbl-on-panel"><caption>계산 근거</caption><tbody>${rows}<tr class="sum"><th scope="row">정산액</th><td>총액에서 세 항목 차감</td><td class="num">${res.net < 0 ? '− ' : ''}${C.won(Math.abs(res.net))}원</td></tr></tbody></table>`;
  }

  // ── 시세 ─────────────────────────────────────────────────
  function price(id, s) {
    const it = C.item(id);
    const t = C.parseIso(s);
    if (!it || isNaN(t)) return { chart: '', grades: `<p class="res-empty">품목과 기준일을 고르세요.</p>` };
    if (t > C.TODAY) {
      const msg = `${C.label(t)} 시세는 아직 없습니다. ${D.TODAY.label}까지 조회할 수 있습니다.`;
      return { chart: `<p class="res-empty">${msg}</p>`, grades: `<p class="res-empty">${msg}</p>` };
    }
    const days = C.week(id, t);
    const open = days.filter((d) => d.open);
    if (!open.length) {
      const msg = `${C.itemName(it)}: ${C.label(days[0].t)}~${C.label(t)} 거래가 없습니다. 출하 철은 ${it.season.join(' · ')}월입니다.`;
      return { chart: `<p class="res-empty">${msg}</p>`, grades: `<p class="res-empty">${msg}</p>` };
    }
    const max = Math.max.apply(null, open.map((d) => d.top));
    const top = Math.ceil(max * 1.1 / 1000) * 1000;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(top * f));
    const bars = days.map((d) => {
      const cur = d.t === t ? ' is-cur' : '';
      if (!d.open) return `<li class="bar is-off${cur}"><span class="bar-off">${d.reason.indexOf('휴장') > -1 ? '휴장' : '거래 없음'}</span><span class="bar-x">${d.short}</span></li>`;
      const h = (d.top / top * 100).toFixed(1);
      return `<li class="bar${cur}" tabindex="0" aria-label="${d.label} 특 ${C.won(d.top)}원/kg"><span class="bar-fill" style="height:${h}%"></span>${cur ? `<span class="bar-val" style="bottom:${h}%">${C.won(d.top)}</span>` : ''}<span class="bar-tip" aria-hidden="true">${d.label}<br>특 ${C.won(d.top)}원/kg</span><span class="bar-x">${d.short}</span></li>`;
    }).join('');
    const grid = ticks.map((v) => `<li style="bottom:${(v / top * 100).toFixed(1)}%"><span>${C.won(v)}</span></li>`).join('');
    const rows = days.map((d) => `<tr${d.t === t ? ' class="is-cur"' : ''}><th scope="row">${d.label}</th>${d.open ? d.grades.map((x) => `<td class="num">${C.won(x.kg)}</td>`).join('') + `<td class="num">${C.won(d.vol)}</td>` : `<td colspan="4">${d.reason}</td>`}</tr>`).join('');
    const chart = `<p class="chart-title">${esc(C.itemName(it))} 특 등급 · 원/kg · ${days[0].short}~${days[6].short}</p>
<div class="chart"><ol class="chart-grid" aria-hidden="true">${grid}</ol><ol class="bars">${bars}</ol></div>
<table class="tbl tbl-week"><caption>7일 시세 표 (원/kg)</caption><thead><tr><th scope="col">날짜</th>${D.GRADES.map((x) => `<th scope="col" class="num">${x.name}</th>`).join('')}<th scope="col" class="num">반입 상자</th></tr></thead><tbody>${rows}</tbody></table>`;

    const cur = days[6];
    let grades;
    if (!cur.open) {
      grades = `<p class="res-empty">${cur.label}: ${cur.reason}입니다. 앞선 6일 값은 위 표에 있습니다.</p>`;
    } else {
      grades = `<p class="g-date">${cur.label} · ${esc(C.itemName(it))} · 상자 ${C.num1(it.kg)} kg</p>
<table class="tbl tbl-grade"><thead><tr><th scope="col">등급</th><th scope="col" class="num">원/kg</th><th scope="col" class="num">상자당</th></tr></thead><tbody>${cur.grades.map((x) => `<tr><th scope="row">${x.name}</th><td class="num">${C.won(x.kg)}</td><td class="num">${C.won(Math.round(x.kg * it.kg / 10) * 10)}원</td></tr>`).join('')}</tbody></table>
<p class="g-vol">반입 상자: ${C.won(cur.vol)}개</p>`;
    }
    return { chart, grades };
  }

  // ── 반입 예약 — 시각대 ───────────────────────────────────
  function slots(s, picked) {
    if (!s) return `<p class="res-empty">날짜를 먼저 고르세요.</p>`;
    const st = C.dayState(s);
    if (st.closed) return `<p class="res-empty">${C.label(C.parseIso(s))}: ${st.why}</p>`;
    return `<p class="slot-date">${C.label(C.parseIso(s))} · 남은 차량 ${st.left}대</p>
<ul class="slots">${st.slots.map((x, i) => `<li><button type="button" class="slot" data-slot="${i}" aria-pressed="${picked === i ? 'true' : 'false'}"${x.left ? '' : ' disabled'}><span class="slot-t">${x.name}</span><span class="slot-n">${x.left ? `남은 ${x.left}대` : '마감'}</span></button></li>`).join('')}</ul>`;
  }

  // ── 반입번호 조회 ────────────────────────────────────────
  function stageBar(stage) {
    return `<ol class="stages">${D.STAGES.map((x, i) => `<li class="${i < stage ? 'is-done' : i === stage ? 'is-now' : ''}"${i === stage ? ' aria-current="step"' : ''}><span class="st-name">${x.name}</span><span class="st-note">${x.note}</span><span class="st-state">${i < stage ? '끝남' : i === stage ? '지금 단계' : '전'}</span></li>`).join('')}</ol>`;
  }
  function lookup(r, booked) {
    if (booked) {
      return `<p class="lk-no">${esc(booked.no)}</p>
<p class="lk-state">예약 접수 · 반입 전</p>
${stageBar(-1)}
${dl([['반입 날짜', booked.dateLabel], ['시각대', booked.slot], ['차량', booked.truck], ['품목', booked.item], ['상자 수', `${C.won(booked.n)}상자`], ['출하자', esc(booked.name)]])}
<p class="note">이 탭에서 접수한 번호입니다. 탭을 닫으면 기록이 사라집니다.</p>`;
    }
    if (!r.ok) return err(r.error);
    if (!r.found) return `<p class="res-empty">${esc(r.no)}: 해당 반입번호가 없습니다. 번호를 다시 확인하세요.</p>`;
    const rows = [
      ['반입일', r.label + ' ' + r.inTime],
      ['품목', `${esc(C.itemName(r.it))} · ${r.gr.name}`],
      ['상자', `${C.won(r.n)}상자 × ${C.num1(r.kg)} kg`],
      ['하차장', `${r.dock[0]} (${r.dock[1]})`],
    ];
    if (r.stage >= 2) rows.push(['낙찰가', `${C.won(r.p)}원/kg · 상자당 ${C.won(r.box)}원`]);
    if (r.stage >= 3) rows.push(['정산액', `${C.won(r.settle.net)}원`]);
    return `<p class="lk-no">${esc(r.no)}</p>
<p class="lk-state">${D.STAGES[r.stage].name} 단계</p>
${stageBar(r.stage)}
${dl(rows)}`;
  }

  g.IGVIEW = { esc, dl, err, settle, price, slots, lookup, stageBar };
})(typeof window !== 'undefined' ? window : globalThis);
