# SOURCES — 2026-W38

이 주차 리서치의 **출처 원장**. 어디서 뭘 어떻게 확인했는지 남긴다.
나중에 "그때 이게 맞았나"를 되짚을 수 있어야 하고, 같은 조사를 반복하지 않기 위해서다.

- **주차** 2026-W38 · **작성** 2026-09-18 · **원장 버전** v1
- 노트: [voice](notes/voice.md) · [icons](notes/icons.md) · [type](notes/type.md) · [motion](notes/motion.md)

| 노트 | 버전 | 조사일 | 재조사 시점 |
|---|---|---|---|
| [voice.md](notes/voice.md) — 말투 | v1 | 2026-09-18 | 6개월. 브랜드 리뉴얼 있으면 즉시 |
| [icons.md](notes/icons.md) — 아이콘 | v1 | 2026-09-18 | 3개월 |
| [type.md](notes/type.md) — 폰트 | v1 | 2026-09-18 | CDN 404 나면 즉시 |
| [motion.md](notes/motion.md) — 모션 | v1 | 2026-09-18 | 3개월 |

---

## 자동 수집

원재료 [raw.md](raw.md). `scripts/collect-research.mjs`가 2026-09-17 15:48 UTC에 생성. 실패 소스 0개.

| 소스 | 경로 | 비고 |
|---|---|---|
| Smashing Magazine | `smashingmagazine.com/feed/` | RSS 정상 |
| CSS-Tricks | `css-tricks.com/feed/` | RSS 정상. **단 HN에 "CSS-Tricks in Limbo"(267점) — 방치 상태라 소스에서 빠질 수 있음** |
| Frontend Focus | `frontendfoc.us/rss` | RSS 정상. 본문이 메일 HTML이라 blurb가 지저분함 |
| web.dev | `web.dev/static/blog/feed.xml` | RSS 정상. 갱신이 느림(최신 2026-05) |
| npm | `api.npmjs.org/downloads/point/last-week` | 17개 감시 |
| GitHub | `api.github.com/search/repositories` | 6개 토픽, 최근 120일 생성 |
| Hacker News | `hn.algolia.com/api/v1/search` | 최근 8일, 20점 이상 |

### 수집 불가로 확정된 것 (재조사 금지)

2026-09-17 실제 요청으로 확인.

| 사이트 | 결과 | 확인 |
|---|---|---|
| Codrops | **410 Gone** | `/feed`, `/feed/`, `/?feed=rss2` 전부 410. 피드를 내렸다 |
| Awwwards | RSS 없음 | `/rss-feed/` 404 |
| Godly | 200이지만 **HTML** | SPA 셸이 반환됨. 피드 아님 |
| CSS Design Awards | 200이지만 **404 페이지** | `/feed`가 404 본문을 200으로 반환 |

→ 어워드 사이트는 **월요일 세션에 헤드리스 Chrome으로 직접 캡처**한다. 이 방식은 동작 확인됨.

---

## 어워드 갤러리 육안 조사

2026-09-18, 헤드리스 Chrome 1440×1400, `--virtual-time-budget=15000`. 셋 다 정상 렌더.

| 사이트 | URL | 본 것 |
|---|---|---|
| Awwwards | https://www.awwwards.com/websites/ | 3D 클레이/토이 렌더, 70s 여행포스터 타이포, 대형 흑백 브루탈 아이콘, 다크+마젠타 AI 인프라, 시네마틱 풀블리드 |
| Godly | https://godly.website/ | **리퀴드 글래스 압도적**("Liquid Glass. Actual liquid."), 다크 이리데슨트, 파티클 구체 |
| Land-book | https://land-book.com/ | 3D 마스코트+통계 바, 에디토리얼 제품사진, 두꺼운 디스플레이 세리프 포스터 |

---

## 말투 조사

**방법** 헤드리스 Chrome `--dump-dom --virtual-time-budget=14000` → script/style 제거 → 한국어 포함 줄(4~120자)만 추출 → 중복 제거 → 종결어미 정규식 분류.
분석 스크립트는 일회성이라 레포에 남기지 않았다. 방법은 위 기술로 재현 가능.

| 사이트 | URL | 수집일 | 한국어 줄 |
|---|---|---|---|
| 토스 | https://toss.im/ | 2026-09-18 | 128 |
| 당근 | https://www.daangn.com/kr/ | 2026-09-18 | 54 |
| 채널톡 | https://channel.io/ko | 2026-09-18 | 145 |
| 오늘의집 | https://ohou.se/ | 2026-09-18 | 132 |
| 29CM | https://www.29cm.co.kr/ | 2026-09-18 | 45 |
| 배달의민족 | https://www.baemin.com/ | 2026-09-18 | 63 |

**한계** 홈 1페이지만. 내부 페이지·앱 미포함. 오늘의집은 UGC 후기가 섞여 수치가 흐려짐. 29CM는 추출된 줄이 45개로 적어 비율 신뢰도가 낮다.

---

## 폰트 CDN 확인

2026-09-18, 각 URL에 실제 요청 후 응답 코드 기록.

| 폰트 | URL | 코드 |
|---|---|---:|
| Pretendard | `cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css` | 200 |
| Pretendard Variable | `…@v1.3.9/dist/web/variable/pretendardvariable.css` | 200 |
| SUIT Variable | `cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css` | 200 |
| Wanted Sans Variable | `cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/…/WantedSansVariable.css` | 200 |
| Paperlogy | `cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-4Regular.woff2` | 200 |
| **Freesentation** | `cdn.jsdelivr.net/gh/projectnoonnu/2404@1.0/Freesentation.woff2` | **404** |
| Google Fonts 한글 9종 | IBM Plex Sans KR, Noto Sans KR, Nanum Gothic, Gowun Dodum, Black Han Sans, Hahmlet, Gaegu, Song Myung, Nanum Myeongjo | 전부 200 |

---

## 아이콘 · 모션 라이브러리

2026-09-18, `api.npmjs.org/downloads/point/last-week` 실측. 수치는 [icons.md](notes/icons.md) · [motion.md](notes/motion.md) 참조.

**주의** npm 다운로드는 CI·미러가 섞여 절대값이 부풀려진다. **순위와 배수 비교에만 쓴다.**

---

## 이번 주 raw.md에서 건진 것

| 항목 | 출처 | 왜 중요한가 |
|---|---|---|
| `animation-trigger` | [CSS-Tricks](https://css-tricks.com/almanac/properties/a/animation-trigger/) | 애니메이션 시작 지연을 CSS로 |
| CSS `random()` 폴리필 | [CSS-Tricks](https://css-tricks.com/css-random-function-polyfill/) | CSS만으로 제너러티브 |
| Document PiP 위젯 | [CSS-Tricks](https://css-tricks.com/creating-web-widgets-using-the-document-picture-in-picture-api/) | 새 창을 UI로 |
| Container queries 오해 | [Smashing](https://smashingmagazine.com/2026/09/stop-treating-css-container-queries-traditional-media-queries/) | 뷰포트 없는 반응형 |
| SMIL 타이밍 차트 | [Smashing](https://smashingmagazine.com/2026/08/timing-charts-blueprint-smil-animations/) | JS 없는 SVG 애니메이션 |
| `canvas-ui` ★4628 | [GitHub](https://github.com/DavidHDev/canvas-ui) | HTML 위에 WebGL을 얹음 |
| `motiscope` ★115 | [GitHub](https://github.com/KumarSashank/motiscope) | **녹화에서 모션 역산. CLONE 해부에 바로 씀** |
| `350-layout-compositions` ★798 | [GitHub](https://github.com/nevertoday/350-layout-compositions) | 레이아웃 구성 레퍼런스 |
| `vintage-latex` ★401 | [GitHub](https://github.com/Foadsf/vintage-latex) | 옛 과학논문 미학 |
| WebGPU 리퀴드 글래스 | [orb](https://github.com/LerSent001/orb) · [liquid-glass-webgl](https://github.com/martin65536/liquid-glass-webgl) | Godly 시각 신호와 일치 |
| lenis vs locomotive | npm 실측 | 110만 vs 1.1만. **세대교체 완료** |
