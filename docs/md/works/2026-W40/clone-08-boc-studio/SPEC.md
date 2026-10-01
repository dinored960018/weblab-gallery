# SPEC — BOC.STUDIO

## 출처

- **원본 URL**: https://boc.studio/
- **어워드**: Awwwards **Site of the Day** (7.23/10 · Developer Award 7.3/10)
- **어워드 링크**: https://www.awwwards.com/sites/boc-studio
- **수상일**: 2026-09-19 (Awwwards 수상 페이지에서 직접 확인 — "Site of the Day - Sep 19, 2026")
- **제작**: Boc.Studio (자사 사이트. Awwwards 표기 "by Boc.Studio", 태그 Vercel · Sanity · Framer)
- **모작 날짜**: 2026-10-01
- **모작 브랜드명**: `Garfi.Studio` (가상. "Garfi Studio"/"Garfi.Studio" 웹 검색 결과 일치 상호 없음 — 후보였던 "Pou Studio"는 실존해서 버림). 원본 이름·로고·문구·사진·영상·고객사는 쓰지 않았다. 워드마크는 Onest(SIL OFL) 글리프 윤곽을 직접 뽑아 SVG 경로로 만들었다(`assets/glyphs.json`).

### 대상 선정 — 1·2순위를 바꾼 이유

| 순위 | 사이트 | 어워드(직접 확인) | 판정 |
|---|---|---|---|
| 1 | CoffeeTech® https://coffee-tech.com/ | Awwwards SOTD 2026-07-16 · 7.18 · https://www.awwwards.com/sites/coffeetech-r | **제외.** 수상 페이지 요소 목록에 "3D HERO"·"360"·태그 "3D". 직접 열어 보니 홈 첫 스크롤 뒤 로스터 기계 3D 렌더가 화면을 차지하고(`refs/rejected-coffeetech/ct-1.jpg`), 제품 페이지(Ghibli R90 로 확인, `sheet-prod.jpg`)의 히어로·특징 카드·관련 제품이 전부 렌더 이미지(파일명 `ghibli_90_new_11_0001_converted.avi` = 렌더 시퀀스 프레임). 렌더 사진이 주인공 → PROTOCOL §2 "3D 모델·렌더 주도 금지" |
| 2 | **BOC.STUDIO** https://boc.studio/ | Awwwards SOTD 2026-09-19 · 7.23 | **선택.** 주간 리서치(`research/2026-W40/targets.md` 예비표)는 "유리구슬 3D 가 화면 전부"라 적었지만, 실측 결과 그 유리 조형은 **쇼릴 영상 속 한 장면**일 뿐이다. 페이지의 캔버스는 `2d 64×64`(파비콘류)와 주황 띠의 `webgl`(띠 변위 효과) 둘뿐이고 3D 장면·모델 로더 없음(`refs/origin.md` "그래픽"). 화면을 주도하는 것은 타이포·주황 띠·사진 마퀴 목록 = 2D 코드 구현 |
| 3 | WARM & FUZZY | Awwwards SOTD 2026-09-12 | 2순위가 통과해서 쓰지 않음 |

> WebGL 은 **배경 효과 수준**(주황 띠를 포인터로 찢는 변위 셰이더 1개)이라 허용 조건. 대체 방법은 아래 "모션 — 띠 변위" 에 적었다.

---

## 사이트 구조

- **페이지 수 (원본)**: 홈(인트로+작업 목록) · `/work`(목록, `?cat=` 필터 8종) · 케이스 9 · 404 = **12** (+ INFO 패널·서비스 모달 3·쿠키 다이얼로그는 같은 페이지 위 레이어). 원본 `/about` 은 404 로 떨어진다(실측) — About 은 INFO 패널이다.
- **재현 페이지**: 12 전부 (`build.mjs` + `data.mjs` 로 생성). `href="#"` 0.
- **라우팅**: 원본 Next.js SPA. 모작은 일반 링크 + 떠나기 전 250 ms 페이드(원본 목록 복귀 전환 `refs/states/41-back-trans-*.jpg`). 필터는 원본처럼 URL `?cat=` 를 바꾸되 `history.replaceState` 로(파일 열기에서도 동작).

```
/  (index.html)            로더 → 쇼릴 인트로(주황 띠 가운데) → 첫 입력에 진입 → 작업 목록
├─ work/index.html         작업 목록 (필터 ?cat=art-direction … 8종)
│   └─ work/<slug>/        케이스 ×9 — 사이드바(제목·태그·챕터 아코디언) + 미디어 열 + 끝 푸터(다음 프로젝트)
│       albereda · badger-orvel · forn-mirall · comet-orvel · graderia · oliu · vora · the-final-grill · nodra
└─ 404.html                주황 전면 + 큰 404 + 가로 마퀴 "홈으로"
레이어: INFO 패널(위에서 내려옴) · 서비스 모달 ×3(building/reworking/pushing) · 쿠키 바 + 다이얼로그(More info → 법적 고지)
```

| 원본 | 모작 |
|---|---|
| Boc.Studio · Barcelona · 41.4120° N, 2.1580° E | Garfi.Studio · Valencia · 39.4699° N, 0.3763° W |
| Creative brand studio / Create, refresh and boost | Brand studio / Build, rework and push |
| CE Europa / Marmota Audi / Chocovic / Alien Audi / Sport / Yaba / The Seam / The Champions Burger / Incite | FC Albereda / Badger Orvel / Forn Mirall / Comet Orvel / Graderia / Oliu / Vora / The Final Grill / Nodra (전부 가상 고객) |
| 분류 8: Art direction · Brand identity · Campaign · Motion · Strategy · Creative direction · Artificial intelligence · Generative systems | 앞 6개 같음 + Image systems · Type systems. 프로젝트별 분류 수·분포는 원본 매핑(`refs/interaction-logs/structure.json` cats)을 따름 |
| creating / refreshing / boosting 서비스 모달 | building / reworking / pushing (글 새로 씀, 글자 수 대역 맞춤) |
| 설립자 2명 이름·LinkedIn | 가상 이름(Nil Ferrer · Ada Roig), 링크 없음 |
| Needless Studio · Social Coherence (외부 링크) | Plain Room · Slow Index (가상, 링크 없는 글자 — 가상 스튜디오에 걸 주소가 없어서) |
| Whatsapp 링크 | Instagram (instagram.com) — 가상 번호를 실재 서비스에 걸지 않으려고 |

## 그리드

| 항목 | 원본 실측 (1440) | 모작 |
|---|---|---|
| 사이드바 폭 | `--boc-sidebar-w: min(calc((100% - 135px) / 4 + 45px), 390.75px)` = 371.25 | 같음 |
| 페이지 여백 | `--boc-page-px` 15 (≤1023: 20) | 같음 |
| 헤더 띠 | 진입 후 38 (sticky top 0) · 인트로 61 (`--bar-h`), 화면 가운데 `translateY((100svh - bar-h)/2)` | 같음 |
| 목록 열 | x 371, pr 15, pt 15, 행 pb 15 | 같음 |
| 행 | 이미지 높이 188.78 (`--marquee-h-base`), 간격 15, 16:9 = 335.6 · 4:5 = 151 폭, 캡션 mt 15 · 18 | 같음 |
| 케이스 미디어 열 | pt 15 · pr 15 · pb 56 · gap 8, 16:9 1054×593 · 4:5 2단 523×654 | 같음 |
| 케이스 끝 푸터 | 고정 392 (패딩 30 · 267 그리드 · 주황 띠 65) | 같음 |
| 브레이크포인트 | 1024 (lg) | 1024 |
| **문서 높이** | 홈 2267(인트로) / 2244(진입 후) · 목록 2244 · 케이스 13595·4820·13534·7345·16416·14196·10470·8607·9885 | **전부 같은 값** (`refs/mine-origin.md` 2267, `ftest.txt`, 케이스 9개 측정) |

## 타이포

| 역할 | 원본 | 대체 | 근거 |
|---|---|---|---|
| 전부 | PP Mori 400 / 600 (Pangram Pangram, 유료) | **Onest 400 / 600** (Google Fonts) | 같은 문장을 31 px · -0.04em 로 11종(Hanken·Instrument·Albert·Schibsted·Geist·Onest·Figtree·Host·Inter Tight·Manrope) 나란히 렌더 → 줄 끝 위치 PP Mori 885 px · Onest 888 px, 1층 a·홑층 g 같은 형태 |

| 토큰 | 값 | 1440 | 쓰는 곳 |
|---|---|---:|---|
| h1 | `clamp(22px, 1.375rem + .5vw, 28.259px)` 행간 1 · -0.022em | 28.26 | Work, 케이스 이름·부제, 필터, 다음 프로젝트 |
| 캡션 | `clamp(13px, .8125rem + .16vw, …)` 행간 18 | 15.3 | 행 캡션 |
| 라벨 | 13 px 600 · 0.04em 대문자 | 13 | INFO, 시계, WORK 브레드크럼, 태그 |
| 사이드바 본문 | 15 px (원본 행간 ≈1.23 → 모작 1.3, 아래 detect 참고) | 15 | 챕터 글 |
| INFO 리드 | `clamp(20px, 1.25rem + .64vw, 31px)` -0.04em · 1.3 | 29.2 | About 문단 |
| INFO 목록 | `clamp(15px, .9375rem + .13vw, 17.426px)` | 16.9 | 고객·서비스 |
| 띠 마퀴 | 13 px (600 / 400) 2줄 16 px | 13 | 인트로 띠 |
| 쿠키 바 | 9 px · 14.18 | 9 | 원본 값 그대로 |

## 아이콘

- 원본: 인라인 SVG — 원 + 더하기(INFO 16 px), 원 + 왼쪽 화살표(뒤로 18 px), 원 + 대각 화살표(링크 22~28 px), 체크(9×7), 재생 삼각형. 선 1.2~1.4 px, 끝 둥글지 않음.
- 모작: 전부 직접 그림, 같은 크기·선 굵기(`build.mjs ICON`). ® 는 Onest 글리프 윤곽.

## 컬러

원본 CSS 변수 실측(`refs/interaction-logs/origin-rules.css`).

| 역할 | hex | 쓰는 곳 |
|---|---|---|
| 주황 | `#ff4421` | 헤더 띠, INFO 패널, 404, 문의 띠·카드 |
| 바탕 | `#181d21` | canvas / offblack |
| 검정 | `#111314` | 주황 위 글자 |
| 글자 | `#f3f3f3` | 본문 |
| 흐림 | `#adadad` · `#afabab` | 부제·캡션 / 사이드바 글 |
| 흐림 2 | `#545151` → **`#8a8484`** | Filter·브레드크럼 (a11y) |
| 주황 위 라벨 | `#85210f` → **`#43100a`** | INFO 라벨, 시계 상태 (a11y) |
| 주황 위 워드마크 | `#b62f17` | INFO 아래 큰 워드마크·404 숫자 — 글자가 아니라 SVG 경로(장식, aria-hidden) |
| 유리 | `#101316` | 쿠키 바·다이얼로그 |
| 알약 | `rgba(111,111,111,.55)` + blur 6 + 0.5px 흰 테두리 | 커서 알약 |

**대비 (WCAG 상대휘도 계산)** — 원본보다 올린 곳은 굵게.

| 글자 / 바탕 | 원본 | 모작 |
|---|---:|---:|
| Filter·"All" 브레드크럼 `#545151` / `#181d21` | 2.16 | **4.62** (`#8a8484`, 원본 쿠키 글 색) |
| INFO 라벨 `#85210f` / 주황 | 2.75 | **4.63** (`#43100a`) |
| 시계 OFFLINE `#b53219` / 주황 | 1.78 | **4.63** |
| 사이드바 카드 "GET IN TOUCH"·EMAIL (흰 12 px) / 주황 | 3.44 | **4.63 / 5.41** (어두운 적갈·검정) |
| 카드 부제 `#8a8484` / `#202427` | 4.25 | **5.2** (`#9a9494`) |
| 링크 호버 흰 / 주황 (INFO 링크, 문의 띠) | 3.44 | **호버를 굵은 밑줄로** (색 바꾸지 않음) |
| 검정 / 주황 · `#f3f3f3` / 바탕 · 주황 "New project" / `#202427` | 6.10 · 15.31 · 4.54 | 같음 |
| INFO 의 building/reworking/pushing (흰 31 px) / 주황 | 3.44 | 원본 유지 — 24 px 이상 큰 글자 기준 3:1 통과 |

## 간격

| 항목 | 원본 | 모작 |
|---|---|---|
| 사이드바 제목 위 | 60 (브레드크럼 38 아래) | 같음 |
| 제목–필터 | 15, 필터 항목 사이 30 | 같음 |
| 필터 목록 | 첫 항목 위 15, 항목 행간 1.2 | 같음 |
| INFO 패널 | pt 60 · px 15 · 열 간 15, 섹션 사이 26.14 | 같음 |
| 서비스 모달 | 카드 393 폭 · 위 88 · 가운데 정렬 | 같음 |
| 반복 수치 | 8 · 15 · 20 · 30 · 38 · 60 | 같음 |

---

## 모션

토큰(원본 실측): `--ease-boc-brisk (.4,0,.2,1)` · `--ease-boc-grow (1,0,.47,1.25)` · `--ease-boc-reveal (.25,.1,.25,1)` · 목록 `(.22,1,.36,1)` · 부드러운 등장 `(.16,1,.3,1)`.
라이브러리: 원본 Lenis(관성 스크롤)지만 `origin.md` 판정 "네이티브로 보인다" — 모작은 **Lenis 생략**(네이티브 스크롤). 원본 JS 인라인 트윈은 rAF 트윈·CSS 전환·WAAPI 로 옮김.

### 1. 홈 로드 (rAF 샘플 `samples2.txt`, 로더 시작 = 0)

| 시각 | 요소 | from → to | 지속 · 이징 |
|---|---|---|---|
| 0 | 주황 덮개 | 전면 | – |
| 0 | 가운데 로고 | scale 4 → 1 | 1311 · inOut |
| 970 | 덮개 | 위아래 대칭으로 띠(61)까지 수축 (top 0→419) | 760 · 가속(expo-in, 샘플: 700 ms 에 43 %) |
| 970 | 쇼릴 | 시작, 컷 1150 ms 간격, 컷마다 300 ms 페이드 + scale 1.06→1 드리프트 | |
| 1330 | 띠 나머지 항목 | opacity 0→1, 가운데에서 먼 순서로 300 ms 간격(0…1800) | 350 · linear |
| 2170 | 쿠키 바 | opacity 0→1, y 23→0 | 666 · (.16,1,.3,1) |
| 대기 | 커서 알약 "Click to enter" | scale 0→1 · 폭 31→112.75 | .16 grow · .24 brisk |

### 2. 진입 (첫 휠·클릭·터치·Enter) — rAF 샘플 `samples.txt`

| 요소 | from → to | 지속 · 이징 |
|---|---|---|
| 헤더 띠 | y 419→0, 높이 61→38 | **800 · 실측 곡선 표**(8.3 % 간격 13점: 0, .0003, .0019, .0071, .0197, .0419, .0807, .1427, .2368, .3641, .5433, .7856, 1) |
| 쇼릴 | y 0 → -100 % | 같음 |
| 목록 | y 100vh → 0 | 같음 |
| 띠 항목 | 왼쪽부터 13 ms 간격 opacity →0 | 200 |
| 로고 하나 | 헤더 로고 자리로 비행, scale .5064 | 같음 |
| 헤더 오른쪽(INFO·시계) | opacity 0→1 | 400 linear |
| 행 9개 | opacity 0→1, y 15→0, **150 ms 간격** | 620 · (.33,1,.68,1) |

모작 샘플 대조(같은 방법): t=.5 에서 p .061(원본 .081) · t=.75 .298(.364) · t=.918 .659(.786) — 같은 곡선이 약 1프레임 늦게 잡힘(시작 판정 차).

### 3. 목록

| 요소 | 트리거 | 동작 | 지속 · 이징 |
|---|---|---|---|
| 행 마퀴 | 상시 | translate 0 → -50 %, 행마다 103 · 34.2 · 102 · 53.6 · 123.2 · 105.9 · 78.9 · 63.2 · 73.2 s | linear (원본 값) |
| 행 | 호버 | 이미지 높이 188.78 → 259.5(×1.2 + 캡션 18 + 15), 폭 비례, 캡션 margin/max-height/opacity → 0 | 400 · grow(1,0,.47,1.25) — 기하 실측 일치(259.53) |
| 필터 | 클릭 | 목록 grid-rows 0fr→1fr 450 (.22,1,.36,1), 항목 y 12→0 · opacity 400 reveal, + 아이콘 90° | |
| 필터 선택 | 클릭 | 350 ms 뒤 목록 접힘 → 880 ms 에 행 교체(원본 실측과 같은 순서) | |
| INFO | 클릭 | 패널 y -100 % → 0 **500 감속** / 닫힘 460 가속, 아래 워드마크 y 16 · opacity 640 reveal | 샘플 `m-info-open/close.txt` |
| 서비스 모달 | 클릭 | 카드 y +120 → 0, 막 opacity 0 → 1 400 | `m-modal-open.txt` |
| egg 워드마크 | 글자 호버 / 클릭 | 글자 y -40 % 물결(이웃 60 ms), 클릭 시 12글자 흩어졌다 복귀 1.4 s | 원본 `egg-wave`·`egg-scatter` 형태 |
| 시계 | 호버 | 알약 "Say hola!" (114 px) | |

### 4. 케이스 (`refs/motion-origin-case`)

| 요소 | 트리거 | 동작 | 지속 · 이징 |
|---|---|---|---|
| 사이드바 항목·첫 미디어 | 로드 | y 15 → 0, opacity, 150 ms 간격 | 700 (0,0,.2,1) |
| 챕터 | 스크롤(섹션 top ≤ 130) · 클릭 | 한 개만 열림. 닫히는 글 opacity 1→0 `(.34,0,.75,.9)`, 여는 글 0→1 `(.66,.1,.25,1)` | 420 (WAAPI, 원본과 같은 두 곡선) |
| 챕터 클릭 | | 섹션으로 부드러운 스크롤(scroll-margin 128) | |
| 사이드바 카드 | 스크롤 진행 < 33 % | "New project" 카드(최신 프로젝트 = FC Albereda, 자기 자신이면 없음) | 700 (.25,.1,.25,1) 페이드 |
| 사이드바 카드 | ≥ 48 % | 주황 "Get in touch" 카드, 문구는 유형(Rework/Build/Push)별 | 같음 |
| 영상 칸 | 호버 | 알약 "Play video" | |
| 끝 | 마지막 392 px | 고정 푸터가 아래에서 올라옴, 본문 위 검정 막 0 → .62 | 스크롤 비례 |
| 끝 푸터 | 상시 | 다음 프로젝트 사진 마퀴(행 속도 ×1.25), 주황 문의 띠 18 s | linear |
| 뒤로 화살표 | 호버 | 라벨 주황 150, 화살표 -3 px 왕복 900 | |

### 5. 띠 변위 (WebGL) — 원본 셰이더 `refs/shaders/s01.glsl`

원본: 띠 전체를 2D 캔버스에 다시 그리고(`fillText` ×18237, `drawImage` ×4585) 칸별 오프셋 텍스처로 uv 를 밀어 그림. 128 = 0 인코딩, 밖으로 밀린 픽셀은 버림(찢어짐).
모작 `assets/band.js`: 같은 아이디어를 직접 구현 — 포인터가 띠 위를 움직일 때만 캔버스를 켜고, 띠 배경·글자·SVG 로고를 화면 위치 그대로 2D 캔버스에 그린 뒤, 72×10 격자 오프셋(최대 48 px)을 포인터 속도로 밀고 감쇠 스프링으로 되돌림. 격자 텍스처는 NEAREST 라 조각이 네모나게 찢김. 멈추면 캔버스를 끄고 DOM 띠로 복귀. 터치·reduced-motion 에서는 끔. (셰이더 코드는 새로 씀. 원본 주석·유니폼 이름 쓰지 않음)

### 녹화 대조 결과

`Desktop/모션비교-BOCSTUDIO.html` (= `refs/motion-compare.html` + `refs/motion-compare-case.html`).

| 대조 | 결과 |
|---|---|
| 홈 로드·진입·행 호버·필터 호버 | 양쪽에 있는 서명 10 (행 호버 높이·폭·캡션 3종 · 쿠키 666 · 알약 4종). 빨간 줄 14 는 **전부 같은 모션의 이름 차이** — 아래 표 |
| 케이스 로드·스크롤·챕터·뒤로 호버 | 양쪽 6 (챕터 크로스페이드 2종 · 뒤로 색 · 사이드바 카드 700 · Chapters 550 · 쿠키 666). 빨간 줄 4 = 이름 차이 3 + 실제 차이 1 |

| 원본에만 있는 서명 | 모작에서 | 이유 |
|---|---|---|
| `boc-marquee` 30000 / 103000 / 34200 / 102000 / 53600 / 123200 / 105900 / 78900 / 63200 / 73200 / 18000 | `marquee` 같은 지속시간 전부 있음(파랑 줄) | 키프레임 이름만 다름 |
| `bocMarqueeIn` 350 linear ×23 · `bocBarFadeIn` 400 · `boc-bump-left` 900 | `marqueeIn` 350 ×23 · `barFadeIn` 400 · `bumpLeft` 900 | 이름만 다름 |
| 쇼릴 `video` opacity 300 CSSTransition ×3 | 쇼릴 이미지 opacity 300 WAAPI ×6 | 원본은 영상 파일, 모작은 사진 컷 (아래 "생략·대체") |
| 케이스 끝 사진 마퀴 47 700 ms | 42 800 ms (다음 프로젝트 행 속도 × 1.25) | 원본 값의 계산식을 찾지 못함(행 속도 34.2 s × 1.25 = 42.75 ≠ 47.7). 케이스마다 한 값만 잴 수 있어 식으로 옮김 |
| 케이스 페이지 헤더 띠 마퀴 30 s | 없음 | 원본은 케이스 페이지에도 숨은 인트로 마퀴를 DOM 에 둔다(보이지 않음) |

## 기능 목록

| 기능 | 위치 | 열림 | 닫힘 | 상태 표시 |
|---|---|---|---|---|
| **로더 → 쇼릴 인트로 → 진입** | 홈 | 휠 · 클릭 · 터치 · (Enter/Space/↓: 접근성 최소선) | – | 커서 알약 "Click to enter" |
| **띠 찢기 (WebGL)** | 헤더 띠 전 페이지 | 포인터 이동 | 저절로 복귀 | – |
| **INFO 패널** | 전 페이지 | INFO 버튼 | INFO 버튼 · ESC | `aria-expanded`, 아이콘 45° |
| **서비스 모달 ×3** | INFO 안 | building / reworking / pushing | × · 막 클릭 · ESC | `role=dialog aria-modal`, 포커스 가둠·복귀 |
| **egg 워드마크** | INFO 아래 | 호버 물결 · 클릭 흩어짐 | – | – |
| **시계** | 헤더 | 마드리드 시간 CET/CEST, 평일 9–19 시 Online | 클릭 → mailto | 알약 "Say hola!" |
| **필터 (드롭다운)** | 목록 | Filter + | Filter − · ESC · 항목 선택 | `aria-expanded`, 현재 항목 자리에 All |
| **필터 적용** | 목록 | 8 분류 | All | 라벨·브레드크럼, `?cat=` |
| **행 마퀴 + 호버 확대** | 목록 | – | – | – |
| **챕터 아코디언 + 스크롤 연동** | 케이스 | 클릭(섹션으로 이동) · 스크롤 | 다른 챕터 | `aria-expanded` |
| **영상 칸** | 케이스 | 클릭 재생 | 다시 클릭 | `aria-pressed`, 알약 "Play video" |
| **사이드바 카드** | 케이스(데스크톱) | 스크롤 진행 | – | – |
| **끝 푸터 공개** | 케이스 | 스크롤 끝 392 px | – | – |
| **다음 프로젝트 / 전체 보기 / 뒤로** | 케이스 | 링크 | – | – |
| **쿠키 바 + 다이얼로그** | 전 페이지 | i · More info(법적 고지) | ✓ · Accept · Deny · ESC · 막 | localStorage 1 개 |
| **모바일 Chapters** | 케이스 ≤1023 | 버튼 | 링크 선택 · 버튼 | `aria-expanded` |
| **404 마퀴** | 404 | 호버 시 멈춤 | – | – |
| 탭 · 캐러셀 · 폼 | 없음 | | | |

**원본에 없는데 넣은 것 (접근성 최소선만)**: ① 인트로 진입 키보드(Enter/Space/↓ — 원본은 sr-only "Watch our showreel" 버튼만 있음) ② ESC 로 필터 목록 닫기 ③ 서비스·쿠키 모달 포커스 가둠/복귀. 원본 ESC 는 INFO·모달 둘 다 닫힘(실측)이라 추가 아님.

## 섹션 순서

- **홈/목록**: 헤더 띠 → [사이드바: WORK/All · Work · All Filter+ · 필터 목록] + [행 9: 사진 마퀴 · 이름 / 부제 / View project] → 쿠키 바.
- **케이스**: 헤더 띠 → [사이드바: WORK/이름 · ← · 이름·부제 · 태그 3 · 챕터 4~5] + [미디어 열: 히어로 16:9 → 챕터별 블록(16:9 단독 / 4:5 두 장, 원본 순서 그대로 `data.mjs blocks`)] → 끝 푸터(Next project · 사진 마퀴 · View all projects · 주황 문의 띠) · 사이드바 카드.
- **404**: 주황 전면 · 큰 404 · 가로 마퀴(문장 + Take me back home).

---

## impeccable detect — 74건, 전부 원본 구조 (설정으로 숨기지 않음)

`.impeccable/` 설정 없음. 대상: HTML 12 + `assets/site.css`. 출력 `refs/detect-final.txt`. **처음 513건 → 74건.**

직접 고친 것:
- `low-contrast` 252 → 0: 주황 위 흰 글자 호버 → 밑줄 호버, 위 대비 표 전부
- `buried-raster` 53 → 0: 쇼릴·영상 칸을 "여러 장 겹쳐 opacity 0" 에서 "한 장의 src 교체" 로, 스크롤 페이드(원본에 없음 — 녹화로 확인 후 삭제)
- `tight-leading` 58 → 0: 본문 행간 1.2 → 1.3 (원본 사이드바 글 ≈1.23)
- `tiny-text` 55 → 0: 11 px → 12 px (쿠키 i, 모달 라벨)
- `cramped-padding` 11 → 0: 쿠키 바 안쪽 8 px
- `flat-type-hierarchy` 9 → 0: 섹션 숨은 h2 → `aria-label`
- `clipped-overflow-container` 1 → 0: 인트로 스크롤 잠금을 `overflow:hidden` 대신 입력 막기로

남은 것:

| 규칙 | 건수 | 원본 근거 |
|---|---:|---|
| layout-transition | 61 (height 28 · width 13 · margin-top/max-height 19 · height+width 1) | 원본 `.boc-grow-row .marquee-strip a { transition: height .4s var(--ease-boc-grow), width .4s … }`, `.boc-grow-row .boc-grow-caption { transition: margin-top .4s …, max-height .4s … }` (`refs/interaction-logs/origin-rules.css`), `origin.md` "height, width ×406". 행 호버 시 사진이 커지며 폭이 비례해 늘어나는 것 자체가 원본 모션. 알약 폭 전환도 원본 `.boc-pill--reveal-on-hover { transition: … width .18s … }` |
| marquee | 12 (404 가로 마퀴 × HTML 12 개가 공유 CSS 를 읽음) | 원본 `.boc-404-back-track { animation: 45s linear infinite boc-404-back-marquee }` + 호버 시 멈춤 |
| bounce-easing | 1 | 원본 토큰 `--ease-boc-grow: cubic-bezier(1, 0, .47, 1.25)` (실측, 행 확대·알약) |

---

## 사진

> 사용자 지시 원문: **"근데 이미지가 없잖아 이미지를 비슷한 무드로 픽사베이나 언스플래쉬같은곳에서 긁어오셈"** · **"감도높은 사진을 핀터레스트에서 찾아서 긁어오기"**

| | |
|---|---|
| 채택 | **182장** — Pinterest 115 · Unsplash 67 (프로젝트 풀 9개, 풀당 17~23장) |
| 후보 | Pinterest 검색어 27개(+1 재수집) 389장 · Unsplash 11개 130장 = **519장** → 337장 제외 |
| 출처 기록 | `assets/photos/credits.json` (파일 · 풀 · 출처 · 핀/사진 주소 · 검색어 · 라이선스 · 명도 · 평균색 · 원본 후보 파일) — 출처 없는 사진 0 |
| 크기 | 큰 사진 1200 px(케이스·쇼릴) + 작은 사진 520 px(목록 마퀴) 두 벌, 22 MB |
| 원본 사진 | 한 장도 쓰지 않음(원본은 Sanity CDN 의 고객 작업물) |

### 왜 Unsplash 를 섞었나

Pinterest 결과 중 **오소리·버거·그릴·정물(올리브·수건)·경기장** 검색은 AI 생성으로 보이는 사진이 대부분이었다(지나치게 매끈한 털·음식 광택, 비현실적 조명). "AI 이미지 제외" 규칙 때문에 이 풀은 보조 출처 Unsplash 의 실사로 채웠다(`refs/queries-u.txt`).

### 뺀 기준과 예 (`refs/photo-review/*.jpg` 밀착 시트, 확대 검수 `z1.jpg`)

| 이유 | 예 |
|---|---|
| 얼굴 | fc-1-10·1-13(관중 얼굴), fm-2-12, cm-1-10·2-14, tr-2-11~14·3-03·3-13·3-14, ol-1-06·1-11·1-13, sv-2-03·2-06·2-12 |
| 글자·로고·상표 | fc-1-07·1-14(현수막), fc-3-*(유니폼 전부 — 제조사 로고·스폰서·엠블럼, fc-3-06 은 확대해서 발견), fm-1-02·1-06·1-09(가격표·워터마크), fm-3-*(가게 간판 전부), bd-2-06·u 차량 02·03·12·13(엠블럼), tr-2-*(신문 전부), sv-1-05·1-06·1-11(라벨·상표), sv-3-03(셔츠 글자), ds-1·2 대부분(제품 라벨), ds-3-01·3-08, fg-1-01·1-10·1-14, u-fg burger-02·12(콜라 로고), u-ol towels-04(모노그램), olive-13(책 글자) |
| AI 생성으로 보임 | bd-1-*(Pinterest 오소리 전부), bd-2-07·2-10·2-13, bd-3-01·3-03·3-04·3-10·3-11, fg-1·2·3 Pinterest 대부분, ol-2-*·3-*(정물 전부), tr-1-04·1-11·1-12, ds-2-02(3D 렌더 캡슐), fc-2-10 |
| 출처 기록 누락 | fc-2-* (수집 중단으로 핀 주소가 안 남음 → 같은 검색어로 다시 받아 `fc2b` 로 교체) |
| 워터마크·배지 | bd-3-07, cm-2-07·2-11(사용자 아이콘), cm-3-09 |
| 대상 불일치 | u-bd badger-05(너구리), 콜라주 cm-2-12 |

### 자리별 명도

원본 목록·케이스는 어두운 바탕(`#181d21`) 위 사진이 주인공이고 흰 글씨가 사진 위에 얹히지 않는다(캡션은 사진 아래). 명도 제약은 쇼릴(주황 띠 뒤)뿐 — 원본 쇼릴은 밝은 컷과 어두운 컷이 섞여 있어(`refs/motion-origin` 프레임) 모작도 풀마다 가로 사진을 섞어 18 컷(`build.mjs reelHtml`).

---

## 생략·대체 (숨기지 않고 적는다)

| 원본 | 처리 |
|---|---|
| 쇼릴 영상(`boc-showreel.webm`, 고객 작업 몽타주 — 유리 조형 3D 장면 포함) | 프로젝트 사진 18 컷을 1150 ms 간격으로 컷 전환(컷마다 300 ms 페이드 + scale 1.06→1). 영상·3D 장면을 새로 만들지 않음 |
| 케이스의 mux 영상(자동 재생·음소거, 클릭 시 소리) | 멈춘 사진 + "Play video" 알약, 클릭 시 같은 프로젝트 사진 3 장이 2.2 s 간격으로 바뀌며 느린 줌. 소리 없음 |
| 원본 워드마크 SVG · PP Mori | Onest 글리프 윤곽으로 만든 Garfi.Studio 워드마크 · Onest |
| 원본 띠 셰이더 | 같은 원리로 새로 작성한 셰이더(`band.js`) |
| Lenis 관성 스크롤 | 생략(원본도 실측상 네이티브 스크롤 판정) |
| Next.js 라우트 전환 | 떠나기 전 250 ms 페이드 + 도착 페이지 행/사이드바 등장 |
| 언어 기억(쿠키 문구 "your language") | 원본에 언어 전환 UI 가 보이지 않아(데스크톱·모바일 모두) 만들지 않음. 문구도 "닫았는지 여부"로 바꿈 |
| Whatsapp · 설립자 LinkedIn · 생태계 외부 링크 | Instagram/LinkedIn 루트 · 링크 없는 글자 |
