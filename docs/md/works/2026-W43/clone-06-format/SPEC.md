# SPEC — FORMAT 모작 → BOUNDS

## 출처

- **원본 URL**: https://format.obys.agency/
- **어워드**: Awwwards Site of the Day · 2026-10-19 · SOTD 7.59/10 (Design 7.85 · Usability 7.2 · Creativity 7.78 · Content 7.38) + **Developer Award 7.54/10** (Semantics/SEO 7.60 · Animations/Transitions 8.80 · Accessibility 7.20 · WPO 8.00 · Responsive 6.20 · Markup/Meta 7.60)
- **어워드 링크**: https://www.awwwards.com/sites/format — 2026-10-21 WebFetch 로 다시 열어 등급·점수·태그를 확인했다
- 제작: Obys (PRO) — Viacheslav Olianishyn, Olha Olianishyna. "Obys × DES Special Project"
- 태그: Culture & Education · Web & Interactive · Experimental · Animation · Clean · Scrolling · Typography · Transitions · Interaction Design · CSS · GSAP · Matter.js
- 모작 날짜: 2026-10-21 · 폴더 `works/2026-W43/clone-06-format/` · 검증 포트 4422
- 모작 브랜드(가상): **BOUNDS** — "Bounds — Kettlehouse and LSN Joint Project", "Margins Term / by Layout School Notes". 링크는 `*.example` 도메인
- 어워드 페이지 캡처는 없다: awwwards.com 은 Chrome·curl 이 막혀 있고 WebFetch(텍스트)로만 읽혔다

### 대상 선정 근거 (2026-10-21, 사용자 지정)

사용자가 FORMAT 을 직접 골랐다. 함께 본 후보와 판정.

| 후보 | 수상 | 판정 |
|---|---|---|
| **FORMAT** format.obys.agency | SOTD 2026-10-19 + Dev Award | **선택 (사용자 지정)** — 원페이지 15451px, canvas 0 · WebGL 0 · video 0. 2D 도형·타이포·GSAP·Matter.js |
| Neutomni | SOTD 2026-10-13 | 원페이지 21535px. 사용자 지정에 밀림 |
| Overworld Audio | SOTD | 탈락 — Three.js 3D 주도 |
| Nick Ho | SOTD | 탈락 — Three.js 헬멧 모델 |
| Maria Vasilyeva | SOTD | 탈락 — WebGL 주도 |
| Huy Phan Vol.2 | SOTD | 탈락 — Three.js |
| Pensatori Irrazionali | SOTD | 탈락 — WebGL |
| bleibtgleich | SOTD | 탈락 — WebGL 2 |
| Colonia Zacamil / Butter | SOTD | 탈락 — 3D WebGL |

사전 실측(오케스트레이터): lang=en, 같은 호스트 내부 링크 0(원페이지), canvas 0, WebGL 0, video 0, 문서 높이 15451px.
원페이지라 PROTOCOL 2절 "주 4건 멀티페이지"에는 들지 않는다. 대신 하위 화면(노트 모드 · 아이 버전 · 물리 놀이판 · 모바일 대체 화면 · 되돌아갈 때 내려오는 짧은 내비)을 전부 만들었다.

## 근거 자료

| 자료 | 경로 |
|---|---|
| 섹션 캡처(capture.mjs, 1440) · 390 캡처 | `refs/home/00-full.jpg`, `refs/home/01~14-*.jpg`, `refs/home/90-mobile-390.jpg` |
| computed style 실측 | `measure.json` |
| 라이브러리·전환·토큰·키프레임·모션 곡선 | `refs/origin/origin.md`, `refs/origin/origin.json`, `refs/origin/origin-*.jpg` |
| 기능 상태별 캡처(Playwright 스크립트로 실제 클릭) | `refs/states/` — 프리로드 8장, 내비 기본, 노트 켬(위·스크롤), 되돌아가기 내비, 노트 끔, 아이 버전 켬(위·스크롤·seven), 놀이판 클릭 전/후, 390 대체 화면 |
| 모션 녹화 | `refs/motion-origin/` (motion.json · timeline.html), `refs/motion-mine/`, `refs/motion-compare.html` |
| 300px 간격 원본·모작 나란히 | `refs/compare-pairs/p-*.jpg` (왼쪽 원본, 오른쪽 모작) |
| 모작 상태 캡처 | `refs/mine/` |

원본 라이브러리: GSAP + ScrollTrigger · Lenis · Matter.js(번들). 캔버스는 300×150 2D 하나(fillText, 측정용으로 보임). WebGL·영상 없음.
모작: GSAP 3.12.5(타임라인·트윈) · Lenis 1.1.13 · Matter.js 0.19.0 — 전부 CDN. ScrollTrigger 는 쓰지 않고 스크롤 연동은 한 프레임 루프(`frame()`)에서 스크롤 값으로 직접 계산했다.

## 1. 사이트 구조

원페이지 + 하위 화면.

```
/ (한 장, 1440 프레임 기준 15451u)
├─ 프리로드: 흰 막 → 로고 글자 상승 → 내비 판·줄 → 회색 실루엣 띠가 내려와 첫 카드가 됨
├─ 고정 헤더: 로고(1400×215) + 내비 줄(크레딧 · 시즌 · Notes Mode · Daughter's Version)
├─ 되돌아가기 내비: 위로 스크롤할 때 위에서 내려오는 16u 띠(크레딧 + 두 토글)
├─ 본문 섹션 8개(+ 블록): block one · ground/wide/tag/side/screens · clock(+burst) · seven(7블록) · deck · fan · win · vee · gauge(+pip) · poster · field · footer
├─ Notes Mode: 노트 18개가 블록 옆에 붙는다
├─ Daughter's Version: 블록마다 크레용 낙서 + 종이 질감
└─ 767px 이하 / 터치: 로고 + 실시간 시계 + "데스크톱용" 안내만 있는 대체 화면
```

모작 파일: `index.html` 하나(`node build.mjs` 로 생성). 데이터 `data.mjs`, 스타일 `src/style.mjs`, 동작 `src/script.mjs`.

## 2. 그리드 실측 (1440)

원본 토큰: `--s: calc(100vw/1440)`, `--grid-columns 8`, `--grid-margin 20`, `--grid-gutter 20`, `--content-width 1400`. 모든 블록이 1440 프레임의 페이지 좌표에 absolute 로 놓인다. 모작도 `--u = 100vw/1440` 하나로 전부 잰다(소스에는 `553u` 처럼 쓰고 빌드가 calc 로 편다).

| 블록 | 원본 (x, y, w×h) | 모작 |
|---|---|---|
| 로고(fixed) | 20, 20, 1400×215 | 같음 |
| 내비(fixed) | 20, 244, 1400×29 · 바 16 높이 · 상자 696/353×29 | 같음 |
| block one | 553, 436 · 카드 335×426 · 사진 131×406 · 원형 시계 68 · 사각 68 | 같음 |
| ground | −26, 1074, 1497×999 | 같음 |
| wide | 198, 868, 1045×448 · 사진 355 · 릴 690/348 | 같음 |
| tag / side | 20 / 1249, 1013, 171×122 | 같음 |
| screens | 553, 1322, 335×226 · 사진 686(202) | 같음 |
| clock | 원판 513, 가운데 720, top 1554 · 눈금 반지름 220.2 | 같음 |
| seven | v-card 552,2913 · tile 20,3345(158) · bar 183,3345(534×158) · pill 724,3345(696×158, r79) · dial 20,3509(697) · side-a 723,3509(697) · tri 368,4212(704×609) · special 368,4827(705×327) | 같음 |
| seven ground | 0, 3858, 1440×1701 → deck 슬롯 79×100 로 줄어듦 | 같음 |
| deck | 553, 6009, 335×426 · 릴 x128 폭79 · 그림 100, 간격 105 | 같음 |
| fog | 0, 6789, 1440×1290 | 같음 |
| fan | 원판 376, 6441, 697 | 같음 |
| win | top 7144 · 검은 원판 715(중심 721, 7492) · 흰 판 198–1243, 448 높이, 창 두 개 · 규칙선 572/870 · 사진 칸 294×369 | 같음 |
| vee | 카드 20/723, 7847, 697×226 · 삼각판 348, 8079, 704×609 | 같음 |
| gauge | top 8808, 2050 높이 · 다이얼 중심 (0, 10026)·(1440, 10026) · 흰 1401 · 검정 891 · 유리 115 | 같음 |
| poster | 0, 10864, 1440×1617 · 사진 20,763 690×834 · 시계 730,1261 335 · 자리 원 1085,1262 335 | 같음 |
| field | 20, 13581, 1400×1247 | 같음 |
| footer | 0, 15178, 1440×273 | 같음 |

브레이크포인트: 원본 `@media (width<=767px),(pointer:coarse)` 에서 대체 화면(splash). 그 위 폭은 1440 프레임을 비율로 줄인다. 모작 같음.

### 문서 높이 (1440×900, ±15% 기준)

| | 원본 | 모작 | 차 |
|---|---:|---:|---:|
| 문서 높이 | 15451 | 15451 | 0% |
| `section` 수 | 8 (clock-section · deck · fan · win · vee · gauge · poster · field) | 8 (clock · deck · fan · win · vee · gauge · poster · field) | 같음 |

원본의 clock-spacer 는 `1262u + 180vh` 로 창 높이에 따라 늘어난다. 모작은 1440×900 기준 값으로 고정했다(창이 900보다 아주 높거나 낮으면 burst 와 seven 사이 여백이 원본과 달라진다).

## 3. 타이포

| 역할 | 원본 | 모작 | 이유 |
|---|---|---|---|
| 전체 | "Obys Sans" Regular 400 (자체 폰트 1벌) | **Inter Tight 400** (Google Fonts) | 같은 계열의 좁은 네오 그로테스크. 상용·자체 폰트 파일은 쓰지 않는다 |
| 작은 라벨 · 번호 | 8u / 12u 행간 | 같음 | |
| 제목 · 본문 · 내비 | 12u / 18u 행간 | 같음 | 카드 본문은 원본 행간 1.0 → 모작 1.3 (impeccable tight-leading 대응, 아래 11절) |
| 큰 글 (shout) | 42u, 행간 .9 (37.8), 자간 −1.26u(−.03em) | 같음 | |
| 포스터 큰 글 | 92u, 행간 .9 (82.8), 자간 −2.76u | 같음 | |
| 태그 단어 | 45.3u, 행간 .9 | 45u | |
| 대문자 | Side A · Triangle · vee 목록 · poster 만 대문자, 나머지 혼용 | 같음 | |
| 로고 | 14개 판으로 된 FORMAT 6글자(SVG) | **직접 그린 BOUNDS 6글자**(셀 226×215, 8 간격, 46 모따기) | 원본 로고 금지. 같은 구성 규칙(글자당 판 2–3개, 판 사이 8)으로 새로 그림 |
| 타입 배율 | 8 · 12 · 42 · 45 · 92 | 같음 | |

## 4. 아이콘

원본에는 아이콘 세트가 없다. 도형이 전부 SVG/CSS: 원, 링(#e9e9e9 1px), 모따기 사각, 삼각, 작은 눈금(시계 12개, stroke .6), 검은 스터드 원 33, 역삼각 마크.
모작: 전부 직접 그린 SVG/CSS. 팬 카드 6장은 BOUNDS 글자 판 + #636363 리벳(r 20.5) + 10% 검정 링.

## 5. 색 (원본 토큰 그대로)

| 역할 | 값 |
|---|---|
| 바탕 `--color-bg` | `#222222` |
| 판 / 로고 `--color-plate` | `#ffffff` |
| 잉크 `--color-plate-ink` | `#000000` |
| 내비 비활성·hover `--color-nav-muted` | `#939393` |
| 눈금·작은 라벨 `--color-mark` | `#bfbfbf` (글자에는 `#767676`, 아래 대비 표) |
| 노트 `--color-note` | `#e0ddbf` (글자 #000) |
| 옅은 판·링 | `#e9e9e9`, 규칙선 `#d9d9d9`, 왼쪽 삼각 `#f3f3f3`, 실루엣 띠 `#d9d9d9` |
| 유리 | `#d1d1d133` + `backdrop-filter: blur(12u)` |
| 포스터 흐린 글 | `rgba(255,255,255,.4)` |
| 아이 버전 크레용(모작이 정함) | `#c2412f` `#c58a2b` `#4f8a5b` `#7a4a2a` `#4b6fa8`, 종이 `#f2efe6` + 노이즈 |

대비 — 원본이 낮아도 고친다(PROTOCOL 4-5):

| 글자 | 원본 | 대비 | 모작 | 대비 |
|---|---|---:|---|---:|
| 회색 라벨 `(Bound)` · 흐린 목록 · 카드 본문 · 시계 눈금 · 다이얼 단어 (흰 바탕) | `#bfbfbf` | 1.8:1 | `#767676` | 4.5:1 |
| 포스터 흐린 글 (#222 바탕) | `rgba(255,255,255,.4)` | 3.7:1 | `.5` | 5.0:1 |
| 노트 라벨 (#e0ddbf 바탕) | 원본 회색 | — | `#5f5b40` | 5.0:1 |
| vee 띠 라벨 (#e9e9e9 바탕) | `#bfbfbf` | 1.5:1 | `#5e5e5e` | 5.3:1 |

도형용 `#bfbfbf`(링·눈금 아닌 선)은 그대로. deck 의 옅은 큰 글(#e5e5e5)은 릴 뒤에 깔린 장식 복제(같은 내용이 옆 목록 1.3 에 있음)라 `aria-hidden` 으로 두고 색은 원본대로 뒀다. 놀이판 글자 깜빡임의 흐린 단계(.25)는 원본 애니메이션 값 그대로다.

## 6. 간격

1440 프레임의 페이지 좌표가 곧 간격이다. 반복값: 바깥 여백 20, 블록 사이 5–6(seven 블록끼리 5·6, tile→bar 5), 카드 안쪽 10·12, 목록 행 간격 54(206→260→315→369), 목록 첫 항목 +2. 섹션 사이 여백 없이 블록이 맞붙는 곳(tile/bar/pill, dial/side-a)과 한 화면 이상 비는 곳(clock→seven, vee→gauge)이 번갈아 나온다.

## 7. 모션 (원본 실측 → 모작)

| 무엇 | 원본 | 모작 |
|---|---|---|
| 스크롤 | Lenis 관성 | Lenis 1.1.13 (lerp .1). reduced-motion 이면 끔 |
| 프리로드 | 녹화 2424ms 시작(자원 로드 대기) · 흰 막 위로 걷힘 · 글자 6개 상승 · 바/상자 scaleY 0→1 1067ms · 줄 상승 1418–1658ms · 헤더 translateY(607)→0 · 띠 scale .1364→1, y −1058→436 3774ms · block one 이어받음 | 시작 150ms(폰트 준비 후) · 막 .6s power3.inOut · 글자 .8s stagger .06 · 바/상자 clip-path .6s · 줄 .9s stagger .06 · 헤더 1.2s power3.inOut(1.8s 시작) · 띠 2.2s power2.inOut · 3.75s 본문 표시 · 4.25s 띠 걷음 |
| 내비 hover | color → #939393, .35s | 같음 |
| 되돌아가기 내비 | translateY, .45s cubic-bezier(.22,1,.36,1) | 같음 |
| 사진 drift | 창 안에서 ±7% | ±6% (스크롤 위치) |
| wide 릴 | 스크롤 연동 세로 이동 | 스크롤 × .35, 189u 주기 |
| clock | 눈금 링 회전 + 바늘 회전, 활성 눈금 #000 | 링 60°→0, 바늘 −150°→0 (600–1450) |
| burst | 검은 점이 테두리에서 떨어져 화면 가운데로 → 검은 링 + 흰 원 + 점 → 흰 원이 화면을 덮고 #222 원이 그 안에서 커짐 | 같은 순서. 1400–2330 구간, 지름을 매 프레임 계산 |
| side A | 인쇄된 글이 원판과 함께 회전, 유리는 고정 | 스크롤 × .06° |
| dial · 작은 시계 · 포스터 시계 | 실제 시각(초·분·시 공이 링 안쪽을 돎), 포스터 바늘은 1초에 30° | 같음(방문자 현지 시각) |
| seven ground | 창이 줄어 deck 의 빈 칸으로 들어가 바꿔치기 | 4900–5600, 창 rect 를 슬롯의 실시간 위치로 보간 |
| deck 릴 | 7칸이 끝없이 위로 | 18u/s |
| fan | 6장이 리벳을 축으로 속도 1–6 배로 회전 | 같음(× .045°/px) |
| win | 원판 1/4 회전마다 창 이름 교체 · 사진 릴 동기 | 6500–8000 동안 3/4 회전, 같은 규칙으로 이름 교체 |
| gauge 단어 | `transform .45s cubic-bezier(.22,1,.36,1)`, `color .25s linear` · 읽는 단어만 42px, 나머지 scale(.2857) | 같음(서명 일치) · 바늘이 −90°→0° 로 쓸어 감 · 다이얼 ±260 벌어짐 |
| pip | vee 아래 작은 삼각이 떨어져 나와 Triangle → Horizontal → Circle 로 모양이 바뀌며 커짐 | 같은 흐름(32점 polygon clip-path, .45s) · 검정→흰 |
| poster 글자 | 원이 자석처럼 글자를 밀어냄 | 글자마다 반경 밀어내기 + 접선 회전 |
| poster → field | 포스터가 0.17 배 카드로 줄고 테두리가 생긴 뒤 놀이판 바닥으로 떨어짐(Matter body) | 11980–12620 축소, 13150 부터 Matter body |
| field 글자 | 마스크에서 상승 .9s power3.out stagger .13 → `field-flick 2.6s step-end` (1 ↔ .25) | 같음(서명 일치) |
| footer | 프리로드와 같은 도착을 한 번 더 | 같음 |
| 노트 | opacity .18s + mask, `--i` 순서 | opacity .18s + clip-path .45s, 40ms 간격 |

### 모션 비교 결과 (`refs/motion-compare.html`)

- 애니메이션 서명 표: **빨간 줄 0**. 첫 녹화에서 `field-flick 2600 linear` 가 빨간 줄이었다(모작 키프레임 이름 `flick`, 흐림 .4) → 이름과 값(.25)을 원본대로 옮겼다. 원본에 없는 `clock__mark color` 전환(파랑)은 지웠다.
- 남은 파란 줄(모작에만): pip 의 `clip-path .45s` · `color .45s`, 회색 단어 색 보간. 원본은 같은 모양 변화를 JS 인라인으로 그린다 — 결과는 같고 수단만 다르다.
- 로드 시작 시각: 원본 녹화는 자원 대기로 2424ms 에 시작, 모작은 150ms. 원본도 캐시가 있을 때는 바로 시작한다(`refs/states/preload-150.jpg` 에서 150ms 에 이미 로고가 있음).

## 8. 기능 목록

| 기능 | 원본 동작 | 모작 | 클릭 검증(Playwright 스크립트) |
|---|---|---|---|
| Notes Mode 토글 | 누르면 노트 18개가 순서대로 나타남, 버튼 회색(aria-pressed) | 같음. 헤더·되돌아가기 내비 버튼이 서로 동기 | 클릭 → `is-notes`, aria-pressed true,true · 되돌아가기 내비에서 끄기 → false,false |
| Daughter's Version 토글 | 블록마다 아이 그림 + 종이 질감, 놀이판 조각도 바뀜 | 직접 그린 크레용 SVG(feTurbulence) + 종이 노이즈, 놀이판 조각에 `chip--paper` | Enter 키로 켬 → `is-kid` · 놀이판 조각 8/8 종이로 바뀜 · 되돌아가기 내비에서 끔 |
| 되돌아가기 내비 | 위로 스크롤하면 내려옴, 아래로 가면 올라감 | 같음 + 숨었을 때 `inert` | 위로 휠 → `is-down`, inert false · 아래로 → 사라짐, inert true |
| 놀이판(Matter.js) | 클릭한 곳에 사이트 블록 조각이 떨어짐 · 최대 30개 · 빠르게 스크롤하면 중력 반전(−.2) · 처음 클릭하면 안내 글 사라짐 | 같음(조각 15종: 카드·판·special·wide·tag·bar·pill·red·knob·clock·dial·side·face·삼각) | 클릭 8번 → 조각 8개, `is-played` · 빠른 스크롤 중 조각 y 가 4–7px 올라감 |
| 포스터 카드 낙하 | 줄어든 포스터가 물리 몸체로 바닥에 내려앉음 | 같음 | 스크롤 14100에서 바닥에 놓인 카드 확인(`refs/compare-pairs`) |
| 실시간 시계 3개 + 모바일 1개 | 현재 시각 | 같음 | 화면에서 공 위치가 시각과 맞음 |
| 모바일 대체 화면 | 767 이하·터치: 로고·시계·크레딧·"desktop" 안내 | 같음 | 390×844 터치 에뮬레이션 캡처 `refs/mine/m390.jpg` |
| 링크 | Obys · DES · Grids Season 외부 링크 | `kettlehouse.example` 등 예시 도메인 | `href="#"` 0 |

드롭다운·탭·아코디언·캐러셀·모달·폼은 원본에 없다. 만들지 않았다.
키보드: 토글은 `<button>`, Tab 으로 닿고 Enter 로 동작, 포커스 링 2px #4d8cff(원본은 포커스 스타일 없음 — 접근성 최소선 때문에 넣음).

## 9. 섹션 순서 (위→아래)

1. 고정 헤더(로고 + 내비) · 2. block one(세로 카드 + 시계 + 사각) · 3. ground + wide(가로 카드 + 단어 릴) + tag + side + screens · 4. clock → burst · 5. seven(v-card · tile · bar · pill · dial · side A · wedge · special, 바탕 ground) · 6. deck(ground 가 들어가는 카드) · 7. fan(팔레트) · 8. win(창) · 9. vee(카드 둘 + 삼각) · 10. gauge(다이얼 둘 + pip) · 11. poster(큰 글 + 사진 + 시계 + 자리 원) · 12. field(놀이판) · 13. footer(로고 재등장)

## 10. 바꾼 것 · 못 한 것

- 텍스트 전부 새로 씀. 포맷 이름 Vertical/Horizontal/Circle/Triangle/Complex → Portrait/Landscape/Round/Wedge/Compound, `(Format)` → `(Bound)`, 노트 18개도 같은 길이 대역으로 새로 씀.
- 사진: 원본 사진 대신 Pinterest 사진 25장(흑백 처리 21장), `credits.json`. 원본 아이 그림 대신 직접 그린 크레용 SVG.
- 놀이판 조각: 원본은 블록을 미리 렌더한 webp. 모작은 CSS 로 그린 축소판.
- gauge 의 Complex(원 + 사각 두 섬) 모양 단계는 모작 pip 에 없다. 원본 녹화 구간에서도 Triangle → Horizontal → Circle 세 단계만 보여서 그 셋만 옮겼다.
- burst·seven·poster 의 스크롤 구간은 1440×900 기준 고정값이다(원본은 창 높이로 계산).
- 원본 win 사진의 겹침 페이드(인접 프레임 opacity)는 옮기지 않았다 — 릴 이동만 있다.
- tag/side 의 사진 조각은 원본 `hard-light` 대신 `multiply`(밝은 사진이라 hard-light 이면 거의 안 보임).

## 11. impeccable 결과와 근거

`npx impeccable@latest detect index.html` → **1건 남음: `tight-leading` (line-height .90x)**.
원본 실측 구조라 예외로 둔다: 42u 큰 글과 92u 포스터 글의 행간이 원본에서 .9 다 — `refs/origin` 측정과 박스 실측(42px → line-height 37.8px, 92px → 82.8px; `.v-card__shout`, `.side-a__shout`, `.tri__shout`, `.poster__say` 모두 `line-height:.9`). 본문용 행간이 아니라 포스터식 큰 글이다.
처음 돌렸을 때 나온 9건 중 고친 것: 카드 본문 행간 1.17 → 1.3, 노트 1.12 → 1.3, `low-contrast`(#000 on #222) — 검정 글자가 흰 판과 형제 관계라 검사기가 바탕을 #222 로 읽었다. 내비·푸터 줄, special, win, vee, fan, clock, wedge 의 글자를 흰 판 요소 안으로 옮겨(보이는 화면은 같음) 해결.
