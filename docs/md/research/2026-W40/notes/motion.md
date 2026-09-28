# CSS / HTML 모션 라이브러리

- **버전** v2 · **조사일** 2026-09-28 · 이전 [W38 v1](../../2026-W38/notes/motion.md)
- **방법** [raw.md](../raw.md) §2 npm 주간 다운로드 + `downloads/range` 일별 조회로 수집 기간 검증 + raw.md §1 글 교차
- **출처** [sources.md](../sources.md)

---

## 먼저 — 이번 주 증가율 표는 오류다

raw.md 표는 17개 전부 **+15~65%** 로 나온다. 서로 관계없는 `tailwindcss` 와 `matter-js` 가
같이 +50% 넘게 오르는 건 시장이 아니라 측정 문제다.

`api.npmjs.org/downloads/range/2026-09-07:2026-09-27/<pkg>` 로 일별 값을 받아 확인했다.
`three` 와 `lenis` 둘 다 **같은 날이 0**이다.

| 0으로 오는 날 | 요일 |
|---|---|
| 09-07, 09-08 | 일, 월 |
| **09-15** | 화 |
| **09-17** | 목 |
| 09-27 | 일 (오늘 기준 미집계) |

W39 수집 기간(09-13~19)에 평일 이틀이 빠져 있다. **W39 값이 작게 잡혔고, W40 값은 정상이다.**
평일 이틀이 빠지면 7일 합이 30% 안팎 줄어든다. 그만큼 올라 보인 것이다.

**그래서 다음 주(W41) 비교부터 의미가 있다.** 이번 주는 전체 중앙값(+55%)에서 얼마나 벗어났는지만 본다.

| 라이브러리 | W40 주간 | 중앙값 대비 |
|---|---:|---:|
| lottie-web | 8,856,591 | +9%p |
| lenis | 1,733,960 | +9%p |
| gsap | 5,796,974 | +8%p |
| motion | 24,946,285 | +7%p |
| three | 19,389,640 | +5%p |
| locomotive-scroll | 19,040 | −20%p |
| split-type | 57,720 | −22%p |
| p5 | 143,547 | −40%p |

±10%p 는 잡음 범위다. **해석하지 않는다.** 순위와 격차는 W38 그대로다.

- `lenis` 173만 vs `locomotive-scroll` 1.9만 — **91배**. W38 100배와 같은 판
- `motion` 2,495만 vs `framer-motion` 5,298만 — 구 이름이 아직 2배

## 이번 주 글에서 가져갈 것

W38 에 이미 적은 `animation-trigger`, 스크롤 구동 애니메이션은 빼고 **새로 나온 것만.**

| 글 | 날짜 | 이번 주 쓰는 곳 |
|---|---|---|
| [Stop Treating CSS Container Queries Like Media Queries](https://smashingmagazine.com/2026/09/stop-treating-css-container-queries-traditional-media-queries/) | 09-16 | 창작 2건 — 같은 카드가 사이드바·본문 폭에 따라 형태를 바꾼다 |
| [CSS Navigation Matching, Early Days](https://css-tricks.com/css-navigation-matching-early-days/) | 08-19 | 창작 2건 — 문서 간 View Transitions. 매칭 문법은 아직 초기라 `@view-transition { navigation: auto }` 까지만 쓴다 |
| [Timing Charts: A Blueprint For SMIL Animations](https://smashingmagazine.com/2026/08/timing-charts-blueprint-smil-animations/) | 08-20 | 영문 창작 — 노선도 SVG. JS 없이 SVG 안에서 끝낸다 |
| [CSS random() polyfill](https://css-tricks.com/css-random-function-polyfill/) | 08-31 | 쓰지 않는다. 사양 확정 전 |
| [12 CSS features that can retire your dependencies](https://frontendfoc.us/issues/759) | 09-23 | 목록만 확인. 본문이 메일 HTML 이라 raw 에서 안 읽힌다 |

## 경계할 것

raw.md §3 새 레포 중 셋이 **"premium, immersive, cinematic scroll" 웹사이트를 찍어내는 AI 스킬**이다
(`scroll-craft` ★2,816, `cinematic-scroll-prompt-kit` ★213, `scroll-video-website-skill` ★38).
스크롤 시퀀스가 템플릿이 되고 있다는 신호다. **창작에서 스크롤 연출을 기본값으로 깔지 않는다.**
