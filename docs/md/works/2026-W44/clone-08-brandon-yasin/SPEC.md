# SPEC: Brandon Yasin 모작 → Aksel Varo

## 출처

- **원본 URL**: https://brandonyasin.com
- **어워드**: Awwwards Site of the Day · 2026-10-24 · SOTD 7.31/10 (Design 7.4 · Usability 7.04 · Creativity 7.44 · Content 7.54) + **Developer Award 7.77/10** (Semantics/SEO 7.60 · Animations/Transitions 8.20 · Accessibility 7.20 · WPO 8.20 · Responsive 7.60 · Markup 7.60)
- **어워드 링크**: https://www.awwwards.com/sites/brandon-yasin (2026-10-29 WebFetch로 다시 읽음. awwwards.com은 curl과 Chrome 접속이 막혀 있어 페이지 캡처는 없다)
- 크레딧: Brandon Yasin (PRO), Aslan GM · 태그 Design Agencies · Web & Interactive · Luxury · Animation · Minimal · Photographic · Portfolio · Typography · Unusual Navigation · 기술 GSAP · Nuxt.js · Sass
- 어워드 페이지 설명(요약): 하루 중 시각에 따라 색이 바뀌고, 시계를 끌어 "시간 여행"을 할 수 있다. 메뉴는 잡지 표지를 나란히 놓은 모양으로 열린다. 심사 항목: Clock & Colours · Editorial Menu · Preloader · Contact(Forms) · Core Values · Mobile · Case Study(Scroll)
- 어워드 팔레트: `#505B44` · `#2C2922`
- 모작 날짜: 2026-10-29 · 사용자가 대상을 골랐다(2026-10-29)
- 모작 이름: **Aksel Varo** (가상의 크리에이티브 디렉터, 베르겐). 원본 사례 6건은 가상 클라이언트로 바꿨다(1절 표).

### 대상 선정 근거 (2026-10-29)

조건: 영어 화면 · 내부 화면 여럿 · 3D/WebGL 주도 아님 · 같은 주 다른 작업과 스튜디오 겹침 없음.
사전 실측(헤드리스 Chrome 1440×900): lang=en, 홈 내부 경로 6개(사례 6건), canvas 0, WebGL 0, video 2, 홈 높이 900px(가로 갤러리).

| 후보 | 수상 | 판정 |
|---|---|---|
| **Brandon Yasin** brandonyasin.com | SOTD 2026-10-24 + Dev Award | **선택**: 2D, canvas·WebGL 0. 홈·사례 6·archive·about·메뉴·문의 모달 |
| ESR Bespoke | SOTD 2026-10-23 | 보류: 2D, 6쪽이지만 W42 Odyssée와 같은 스튜디오(NIGHTJAR)라 미룸 |
| Cartier | SOTD | 탈락: 3D |
| A24 | SOTD | 탈락: Three.js |
| Emotion Agency | SOTD | 탈락: Three.js |
| Forge Automotive | SOTD | 탈락: WebGL |
| G. Colombel | SOTD | 탈락: WebGL · Three.js |
| Ascension Pegassi | SOTD | 측정 안 함 (Jesper Landberg 작업, WebGL 가능성) |
| Awards Racing | SOTD | 측정 안 함 |

## 근거 자료

모든 수치는 아래 실측에서 옮겼다. 추측이면 "추정"이라고 적었다.

| 자료 | 경로 |
|---|---|
| 페이지별 전체 캡처(capture-site) | `refs/<페이지>/00-full.jpg`. 홈 섹션 `refs/home/01-div.jpg`, 390px `refs/home/90-mobile-390.jpg` |
| 페이지별 스크롤 뷰포트 캡처(휠로 900px씩, 1.4초 대기) | `refs/about/vp-*.jpg`, `refs/cases--*/vp-*.jpg` |
| 상태별 캡처(Playwright 스크립트로 클릭·드래그) | `refs/states/*.jpg` (38장: 메뉴 열림 4종 · 문의 Client/Talent/Email/빈 제출/스크롤 · 시계 드래그 6시각 · about 가치 hover 2종 · 과정 1/4/6단계 · archive 확대 · 홈 로드 단계 · 휠) |
| computed style 실측(9페이지) | `measure.json` |
| 라이브러리 · 전환 · 토큰 · 호버 · 키프레임 | `refs/origin/` (홈) · `refs/origin-about/` · `refs/origin-case/` (bestseller) |
| 모션 녹화(로드 5초 + 휠 + hover) | `refs/motion-origin/` · 모작 `refs/motion-mine/` · 비교 `refs/motion-compare.html` |
| 시계 드래그 팔레트 표 | 5절 (`--color-bg` · `--color-main` 을 6° 간격 48점 읽음) |

라이브러리(원본): Nuxt · GSAP · Lenis(래퍼 transform 없음, 네이티브 스크롤로 측정됨). 캔버스·WebGL 없음. 사례 페이지 미디어 대부분이 H.264 영상이라 헤드리스 Chromium에서 재생되지 않아 캡처에 빈 칸으로 남았다(위치·크기는 DOM으로 쟀다).
모작: 라이브러리 없이 CSS + 바닐라 JS. 관성 스크롤(Lenis)은 쓰지 않았다(원본도 실측상 네이티브).

## 1. 사이트 구조

### 원본 (9화면 + 오버레이 3)

```
/                         홈: 사례 6건 가로 무한 갤러리 (높이 900, 세로 스크롤 없음)
/cases/<slug> × 6         mall-of-the-emirates · bestseller · copenhagen-fashion-week · rains · nine-furniture · louis-vuitton
/archive                  가로 무한 이미지 띠 16장 (높이 900)
/about                    소개 · 가치 3 · 과정 6단계(고정 시퀀스)
오버레이: 메뉴(현재 페이지 + 나머지 2페이지를 0.75배 표지 3장으로) · 문의 모달(Client / Talent / Email) · 제출 후 thank you
```

내비게이션: 상단 4칸. 이름(로고, 수상 문구와 번갈아 바뀜) · 서명 SVG · MENU/CONTACT · LOCAL TIME + 시계 원. 푸터 없음. 사례 끝에 "next case"로 다음 사례로 넘어간다(6건이 고리로 이어짐).

### 재현 (9페이지)

| 원본 | 모작 파일 | 가상 클라이언트 |
|---|---|---|
| 홈 | `index.html` | |
| /cases/mall-of-the-emirates | `cases/west-quay-arcade/index.html` | West Quay Arcade (Quayside Holdings) |
| /cases/bestseller | `cases/ostervang-40-festival/index.html` | Ostervang 40 Festival |
| /cases/copenhagen-fashion-week | `cases/vesterlund-fashion-week/index.html` | Vesterlund Fashion Week (Ostervang) |
| /cases/rains | `cases/hailmark/index.html` | Hailmark A/W 2024 |
| /cases/nine-furniture | `cases/ottar-furniture/index.html` | Ottar Furniture |
| /cases/louis-vuitton | `cases/maison-aurel/index.html` | Maison Aurel (Quayside Holdings) |
| /archive | `archive/index.html` | |
| /about | `about/index.html` | |
| 메뉴 · 문의 · thank you | 모든 페이지에 같은 마크업 | |

생성: `node build.mjs` (내용·실측 배치 `data.mjs`, 스타일 `src/style.css`, 동작 `src/script.js`). 결과는 페이지마다 HTML 한 파일, CSS·JS 인라인. 링크는 `…/index.html`로 걸어 `file://`로도 이어진다.

### 바꾼 것 · 줄인 것

- 사례 수·순서·사례별 갤러리 항목 수는 원본 그대로(6 / 13 / 14 / 6 / 9 / 2 + west quay 줄 이미지 섹션). 항목 이름은 원본 역할을 따라 다시 썼다(예 "Diana Ross" → "Closing Concert").
- 원본 갤러리 대부분이 영상(UI 화면 녹화)이다. 모작은 사진 또는 **CSS로 그린 보드**(쇼핑몰 화면 2 · 행사 지도 · 메뉴판 · 환영 사인 · 라벨 그리드 · 라인업 · 스펙 시트 · 브랜드 가치/한 줄/색 3장)로 채웠다. 영상은 쓰지 않았다.
- 실존 이름(Majid Al Futtaim · Nike · Burberry · CIFF · Diana Ross 등)은 모두 가상 이름으로 바꿨다. 수상 문구 "Awwwards / Site of the day"는 가상의 "Folio Daily / Pick of the day"로 바꿨다.
- 원본의 모바일 전용 `time-contact` 버튼(시계 자리에 Contact · Drag)은 만들지 않았다. 모작 모바일은 상단 Contact 버튼만 쓴다.

## 2. 그리드 실측 (1440px)

원본 크기는 1438px 이상에서 vw로 비례한다(`font-headline-1 { font-size: 6.26vw }` 등). 모작도 `--u = 100vw / 1440`로 같은 비례를 쓴다.

| 항목 | 원본 | 모작 |
|---|---|---|
| 좌우 여백 | 16 | 16 |
| 컬럼 | 7칸 × 194.3, 간격 8 (x 16 · 218 · 421 · 623 · 825 · 1027 · 1230) | 같음(`--col`, `--step`) |
| 상단 | 이름 x16 y17 · 서명 x421 · MENU/CONTACT x825 · LOCAL TIME x1230 · 원 52px x1372 y16.5 | 같음 |
| 홈 갤러리 | 항목 397(2칸+간격) × 525, 이름 y359, 사진 y387 높이 497, 간격 8, 6항목 고리 | 같음 |
| 사례 hero | 제목 아래 정렬(1줄 y708 / 2줄 y628), 메타 2단 y855(x16 · x421), 사진 x825 y60 599×840 | 같음 |
| 사례 소개문 | x825 y956 폭 599, 40px | 같음 |
| 사례 갤러리 | 항목 폭 1408 / 1003 / 801 / 397 / 297×3 묶음 / 194×4 묶음, 항목 사이 약 240 | 원본 좌표 그대로 절대 배치(data.mjs) |
| next case | 사례 끝에서 약 230 아래, 높이 290–320, 썸네일 오른쪽 아래 194×223 | 같음 |
| west quay 줄 이미지 | 섹션 250vh, 고정 높이 100vh, 타일 194:292, 높이 39.45vh, 간격 8, 두 줄 | 같음. 1줄은 왼쪽, 2줄은 오른쪽으로 스크롤 진행만큼 이동 |
| archive | 제목 x16 y114, 설명 x825 y158, 띠 y614 높이 270, 폭 216/406/185 반복, 간격 8. 클릭하면 높이 594로 커진다 | 같음(16장 중 처음 6장 폭 실측, 나머지는 같은 리듬) |
| about | 제목 x16 y94 폭 1105, 왼쪽 사진 295×371(sticky), 오른쪽 글 x825 폭 571, 블록 간격 약 100 · 가치 제목 x421 y1911, 카드 397×571 · 과정 섹션 4445, 고정 래퍼 1205(top −305), 단계 이름 x825 | 같음 |
| 문의 모달 | 패널 폭 69.68vw(1003) x218, 위 여백 6.95vw(100), 안쪽 24 · 2단(380 / 나머지, 라벨 50%) | 같음 |
| 메뉴 | 표지 1080×675(0.75배), 왼쪽 37.4%만 보임(404). x 173 · 637 · 1102 (translate −0.5% · 31.75% · 64%), 커서 x에 따라 ±100px 이동 | 같음 |
| 브레이크포인트 | 768 · 1025 · 1438 (CSS). 모바일은 390 캡처 1장만 봤다 | 1024 이하 1단 배치(사례 세로 나열, about 1단, 모달 1단) |

### 문서 높이 (1440, ±15% 기준)

| 페이지 | 원본 | 모작 | 차 |
|---|---:|---:|---:|
| 홈 | 900 | 900 | 0% |
| archive | 900 | 900 | 0% |
| about | 7293 (extract 7333) | 7380 | +1.2% |
| mall → west quay | 8159 | 8202 | +0.5% |
| bestseller → ostervang | 10837 | 10837 | 0% |
| copenhagen → vesterlund | 10804 | 10804 | 0% |
| rains → hailmark | 7270 | 7270 | 0% |
| nine → ottar | 9233 | 9233 | 0% |
| louis vuitton → maison aurel | 3768 | 3768 | 0% |

섹션 수(extract-origin): about 원본 3(header 1616 · holder 1188 · process 4445) / 모작 3(1749 · 1187 · 4445). 사례 원본 3(hero+소개 1728 · gallery 8771 · next 320) / 모작 hero 900 + 소개 836 · gallery · next. 3화면 넘는 섹션: 원본 about process 4445(4.9화면) → 모작 4445, west quay rows 2250(2.5화면) → 2250.

## 3. 타이포

| 역할 | 원본(measure.json · CSS) | 모작 | 이유 |
|---|---|---|---|
| 큰 제목 `font-headline-1` | Neue Haas Unica Pro 400, 6.26vw(90px), 자간 −.04em, 줄 간격 79.5px(박스 112) | Inter Tight 350, 90px, 자간 −.03em, line-height .88 + 위아래 .183em | Neue Haas Unica는 상용. Inter Tight는 같은 네오그로테스크에 폭이 좁다. Inter Tight가 Unica보다 획이 굵고 자간이 좁아 굵기 350, 자간 −.03em으로 맞췄다 |
| 소개문 `font-body-40-100` | Unica 400, 2.78vw(40px)/1.22, −.04em | Inter Tight 350, 40px/1.22, −.03em | 같음 |
| about 본문 `font-body-24` | Unica 251(light), 1.67vw(24px)/1.2, −.01em | Inter Tight 300, 24px/1.2 | |
| 모달 본문 `font-body-18` | Unica 251, 18px/1.1 | Inter Tight 300, 18px/1.1 | |
| 라벨 `font-body-12` | Helvetica Now Variable 400, 12px/1, 대문자 | Inter Tight 400, 12px, 대문자 | Helvetica Now도 상용. 한 가족으로 묶었다 |
| 모달 큰 제목 `font-headline-2-large` | Unica 251, 90px | Inter Tight 300, 90px/1 | |
| 타입 배율 | 12 · 18 · 24 · 40 · 90 | 같음 | |

서체 후보 검사: Geist · Inter는 impeccable `overused-font`에 걸려 버렸다. Inter Tight와 Arimo는 통과. Arimo는 300 굵기가 없어 Inter Tight로 정했다.

## 4. 아이콘

원본: 서명 SVG(가는 필기체 "B y."), 시계 원(1px) + 손잡이 점(지름 9), 체크박스 14px 사각 · 라디오 원, thank you 체크 원.
모작: 전부 SVG/CSS로 새로 그렸다. 서명은 가상 이름 머리글자 "A v."를 1px 선으로 그렸고 `pathLength=1` 대시로 그려지게 했다. 원 52px stroke 1, 점 9px. 체크박스는 hover에서 안쪽 점이 0.4배, 선택하면 1배(원본 `.check-item:hover .check-box::after { transform: scale(.4) }`).

## 5. 색

### 시각별 팔레트 (원본 시계를 6°씩 48번 끌며 `--color-bg` / `--color-main` 읽음)

| 시각 | 배경 | 글자 |
|---|---|---|
| 21:47 – 04:00 (밤) | `#2c2922` | `#c3beb1` |
| 04:27 | `#413d33` | `#c3beb1` |
| 05:04 | `#5e574b` | `#c7bea9` |
| 05:46 | `#7b7362` | `#f1c345` (해돋이 금색) |
| 06:31 | `#938a78` | `#4e421f` |
| 07:17 | `#ada593` | `#111111` |
| 08:01 · 08:41 · 09:16 | `#cfcabc` · `#e7e4dd` · `#f7f5f1` | `#111111` |
| 09:47 – 15:55 (낮) | `#f8f6f2` | `#111111` |
| 16:27 · 17:04 · 17:46 · 18:31 | `#e6e3da` · `#cbc6b8` · `#afa795` · `#938a76` | `#111111` |
| 19:17 | `#766d5a` | `#2d2717` |
| 20:01 | `#564e40` | `#eac04c` (해넘이 금색) |
| 20:41 · 21:16 | `#3c372d` · `#2d2a23` | `#c3beb1` |

같이 바뀌는 값: `--img-over-opacity` 0.1(밤) → 0(낮) — 이미지 위 검정 덮개, `--bg-brightness` 0.2 → 1.
모작: 위 22점을 그대로 넣고 사이를 선형 보간한다(`data.mjs` palette). 시각은 방문자 브라우저의 현지 시각(원본도 컨테이너 UTC 시각 01:21을 그대로 표시했다).
**원본과 다르게 한 것**: 05:46 · 20:01 근처는 금색 글자와 중간 밝기 배경의 대비가 약 2.8:1이다. 모작은 대비가 4.5:1보다 낮으면 글자를 흰색 또는 검정 쪽으로 밀어 4.5:1을 맞춘다(금색이 옅어진다). 접근성 최소선 때문이다.

### 나머지

| 역할 | 원본 | 모작 |
|---|---|---|
| 메뉴 열림 바탕 | `#1a1915` (배경 × 0.6) | 배경 × 0.6 |
| 모달 덮개 | `#060804d1` | `rgba(6,8,4,.82)` |
| 모달 종이 | 낮 `#848f7a`, 밤 `#6e7965` + 종이 사진 | 낮 `#96a189`, 밤 `#85907a` + SVG 노이즈. **원본보다 밝게**: 원본 글자 `#263b1c`와 대비가 2.7(밤)·3.6(낮)이라 4.5를 넘기려고 바탕을 밝히고 글자를 `#172612`로 진하게 했다(밤 4.7:1, 낮 5.9:1) |
| 모달 오류 | 노란색(캡처) | `#420d04`(밤 종이 4.9:1, 낮 6.0:1). 노란색은 녹색 종이 위에서 3.2:1이라 바꿨다 |
| 가치 카드 hover 종이 | 사진 색에서 딴 옅은 회녹색(캡처) | `#c4c6b5` / 글자 `#1b1c16` |
| 과정 비활성 단계 | 글자 투명도 .3 (2.0:1) | .75 (5.0:1). impeccable `low-contrast`로 잡혀 고쳤다 |

## 6. 간격

- 반복 수치: 8(간격) · 16(여백) · 28(캡션 위) · 100(about 블록) · 135(가치 제목→카드) · 211(섹션 제목 위) · 230/240(사례 항목 사이) · 900(hero).
- 사례: hero 900 → 소개문 56 → 갤러리 첫 항목까지 약 240 → 항목 사이 약 240 → next case.
- about: 제목 위 94, 글 블록 시작 538, 블록 사이 약 100, 가치 섹션 위 211, 과정 제목 위 211, 단계 이름 y790, 내용 y894(고정 래퍼 기준).

## 7. 모션

| 무엇 | 원본 실측 | 모작 | 근거 |
|---|---|---|---|
| 프리로더 | 1.5s부터 화면 가운데 작은 틀에 사례 사진 4장이 위에서 아래로 차례로 드러남(약 2.4 · 3.2 · 3.8 · 4.2s), 틀이 커짐. 5.0–6.5s에 4장이 제자리로 펼쳐짐(item-stage `translate(505,−171) scale(.4)` → `none`), 사진 `scale(1.5)` → `1.15` | 2.4s부터 560ms 간격으로 4장 clip 공개(700ms, `cubic-bezier(.645,.045,.355,1)`), 틀 0.14→0.24배, 5.0s에 1550ms `cubic-bezier(.87,0,.13,1)`로 펼침, 사진 1.5→1.15 | motion.json inlineStyles, `refs/states/home-load-*.jpg` |
| 사례 이름 등장 | `translate(0,100%)` → 0, 6.3–7.8s 차례로 | 6.5s부터 150ms 간격, 900ms | motion.json div.name |
| 상단 등장 | 1364ms부터: 이름 2줄(≈1.7s), MENU/CONTACT(끝 ≈4.2s), 시간 3줄(끝 ≈4.5s), 원 손잡이 회전 0→현재 각도 + 투명도(1364–4889) | 1.4s부터 1.6s 동안 위로, 지연 0 · .06 · 1.2 · 1.26 · 1.5 · 1.56s, 서명 선 1.4s 지연, 원 선 2.3s, 손잡이 회전 3.5s | motion.json, 비교표 |
| 시계 점 | `tick-458dfb20` 1000ms linear 무한, 0/100% 불투명 · 50% 투명 | 같은 키프레임·이름 | 비교표 서명 일치 |
| 로고 문구 순환 | 이름 → Awwwards/Site of the day → Site of the day/날짜 (캡처마다 다름, 간격 추정 약 3s) | 3.2s 간격 3단 순환, 900ms | `refs/about/vp-*.jpg` |
| 링크 hover | 글자가 위로 빠지고 같은 글자가 아래에서 올라옴(`matrix(…,−12)`) | 500ms `cubic-bezier(.645,.045,.355,1)` | origin.md 호버 |
| 홈 사례 hover | 항목 −8px | 600ms 같은 이징 | origin.md `a.item.gsap-item` |
| 홈 갤러리 이동 | 휠·드래그로 가로 이동, 관성, 속도에 따라 항목 scale .99–.95 | 휠·드래그·화살표, 목표값 추적 0.085/프레임, scale 1−|v|/600 (최소 .94) | inlineStyles item-wrapper scale |
| 메뉴 열기 | 현재 페이지가 0.75배로 줄며 왼쪽 표지로, 나머지 2장이 오른쪽에서 들어옴(400ms 프레임에서 진행 중, 1.5s 완료) | 1000ms `cubic-bezier(.87,0,.13,1)`, 2·3번째 표지 80 · 140ms 지연, 커서 x 따라 이동 | `refs/states/menu-*.jpg`, extract 이징 빈도 |
| 문의 모달 | 패널 `translate(0,100%)` → 0, 덮개 페이드, 탭 밑줄 `transform` 350ms `cubic-bezier(.645,.045,.355,1)` | 패널 1000ms `cubic-bezier(.87,0,.13,1)`, 덮개 600ms, 밑줄 350ms 같은 이징 | motion.json tabs-line, `refs/states/contact-opening-*.jpg` |
| 사례 갤러리 등장 | 이미지 clip-path 위→아래, 캡션 아래→위 | clip-path 1300ms `cubic-bezier(.87,0,.13,1)`, 캡션 900ms(250ms 지연) | about 로드 inlineStyles `div.img-wrap` clip |
| west quay 줄 이미지 | 스크롤 진행에 따라 1줄 왼쪽, 2줄 반대 | 같은 방향 | `rows__row` 인라인 translate, @keyframes rows-trail |
| about 과정 | 단계 이름 띠가 옆으로 밀려 활성 단계가 x825, 비활성 .3 투명, 내용 교체 | 900ms 띠 이동, 내용 500ms 페이드 | `refs/states/about-process-*.jpg` |
| 가치 카드 | hover한 카드의 사진이 화면 전체 배경, 그 카드는 종이색 + 글, 나머지는 흰 테두리 | 같음(사진 700ms, 종이 500ms) | `refs/states/about-value-*-hover.jpg` |
| 미디어 등장 | 영상 포스터 `opacity 1→0` 250ms ease-out | 사진이 디코드되면 `opacity 0→1` 250ms ease-out | 비교표 서명 일치 |

**모션 비교표**(`refs/motion-compare.html`): 원본 서명 4건(tick 1000 linear · tabs-line 350 · poster opacity 250 ease-out ×2)이 모작에 모두 있다. **빨간 줄(원본에만 있는 모션) 0건.** 처음 비교에서 빨간 줄 3건(tick 키프레임 이름 · 포스터 페이드 · 탭 밑줄 첫 그리기)이 나와 옮겼다.

옮기지 못한 것:
- 원본 갤러리·hero의 **영상 자체**(Rains 재킷 영상, UI 화면 녹화). 원본 영상을 쓰지 않는 규칙이라 사진과 CSS 보드로 대신했다.
- 원본 페이지 이동 전환(Nuxt 페이지 전환: 사례 사진이 커지며 다음 페이지로 이어짐, 추정). 모작은 보통 페이지 이동이다.
- Lenis 관성 스크롤. 원본 실측이 네이티브라 생략했다.
- 메뉴 안에서의 휠 이동은 원본에서 확인하지 못해 만들지 않았다.

`prefers-reduced-motion`: 프리로더 · 상단 등장 · 로고 순환 · 전환을 모두 끄고, 공개(clip) 상태로 바로 그린다.

## 8. 기능 목록

| 기능 | 원본 | 모작 동작 | 확인 |
|---|---|---|---|
| 시계(시간 여행) | 원 손잡이를 끌면 시각과 팔레트가 바뀜, "Time Travel ✕"로 되돌림 | 끌기(360° = 12시간, 누적), `role=slider` · 화살표 ±15분 · PageUp/Down ±1시간 · Esc/Home 복귀, ✕ 버튼 | 클릭 PASS |
| 메뉴(잡지 표지) | MENU 클릭 → 3장 표지, 표지 클릭으로 이동 | 열림/닫힘(`aria-expanded`), 배경 스크롤 잠금, Esc · 현재 표지 클릭으로 닫힘, Tab 순환, 닫으면 원래 스크롤 위치 | PASS |
| 문의 모달 | Client / Talent 탭, Email 복사, 폼(체크 · 라디오 · 입력 5), 필수 검증, thank you | 탭(`role=tab`, `aria-selected`, ←/→), Email 클립보드 복사 → "Copied", 빈 제출 막고 "Please fill out required fields" + `aria-invalid`, 이메일 형식 검사, 통과하면 thank you(**보내지 않음** 표시), Esc · 덮개 클릭 · Close로 닫힘, 포커스 가둠 | PASS |
| 홈 갤러리 | 휠 · 드래그 가로 고리 | 휠 · 드래그 · ←/→, 포커스된 항목이 화면 밖이면 끌어옴 | PASS |
| archive 띠 | 휠 · 드래그, 클릭하면 확대 | 같음 + 다시 클릭 · Esc · 30px 넘게 끌면 축소, `aria-expanded` | PASS |
| about 가치 카드 | hover로 배경 · 글 | hover · 클릭 · Enter/Space, Esc 닫힘, `aria-expanded` | PASS |
| about 과정 | 스크롤로 단계 진행 | 스크롤 진행 + 단계 버튼 클릭/←→로 해당 위치로 이동 | PASS |
| "reach out" | 문의 모달 | "get in touch" → 모달 Talent 탭 | PASS |
| next case | 다음 사례 | 링크, hover에 "next case" 줄 넘김 | PASS |
| 390px 메뉴 | 원본 모바일 캡처 1장 | 같은 메뉴 동작, 스크롤 잠금 | PASS |
| 포커스 링 | `:focus-visible` 2px | 2px currentColor, 이미지 링크는 사진 테두리 | PASS |

검증 방법: **Playwright MCP가 이 세션에 없어서 Playwright 라이브러리 스크립트로 실제 마우스 클릭 · 드래그 · 휠 · 키 입력을 보내 확인했다**(39항목 PASS, 페이지 오류 0). 스크립트는 작업 폴더 밖(스크래치패드)에 두고 커밋하지 않는다. 처음 돌렸을 때 실패 2건을 고쳤다: 홈 갤러리 드래그가 이미지 기본 드래그에 빼앗김 → `dragstart` 막음, 가치 카드 줄이 화면 폭 전체라 mouseleave가 안 됨 → 폭을 내용 크기로.

## 9. 섹션 순서

- **홈**: 상단 → (메뉴 모드에서만 보이는 "cases") → 사례 6건 가로 갤러리
- **사례**: 상단 → hero(제목 · 메타 2단 | 사진) → 소개문 → (west quay만 줄 이미지 섹션) → 번호 붙은 갤러리 항목 → next case
- **archive**: 상단 → 제목 · 설명/연도 → 이미지 띠
- **about**: 큰 제목 → 왼쪽 사진(sticky, 블록 따라 3장 교체) | About me · Philosophy · What I do(7) · Global network → 가치 제목 → 카드 3 → 과정 제목(고정) · 단계 6 · 내용
- 메뉴 · 문의 · thank you는 모든 페이지 공통

## 10. 사진

`node scripts/fetch-stock.mjs … --w 1400`로 Unsplash · Pixabay(무료, 표기 의무 없음)에서만 받았다. Pinterest는 쓰지 않았다. 원본 묶음은 `refs/photo-raw/`(gitignore), 쓴 사진 64장은 긴 변 1100px · JPEG 72%로 줄여 `assets/stock/`(약 4.5MB). 출처 `credits.json`.
- 버린 사진(다른 브랜드 로고·글자): 아웃도어 브랜드 로고가 보이는 재킷·비니 3장, 무대에 페스티벌 로고 1장, 영화 포스터 글자 1장, 인쇄물 상표 1장, 자동차 키 1장, 놀이공원 성 1장.
- 처음 받은 6묶음은 동시에 돌려 `credits.json`이 덮어써졌다. 같은 검색어로 다시 받아(`*b-` 이름) 그 사진만 썼다.
- 도구가 이번에는 명도 값을 `undefined`로 남겨, 원본 자리 명도는 캡처와 나란히 놓고 눈으로 맞췄다: 어두운 밤 성(bestseller) → 불 켜진 저택, 흑백 인물(cph) → 흑백 인물, 눈 덮인 산 + 후드(rains) → 후드·고글 인물, 벽 그림자 속 포스터(nine) → 햇빛 그림자 속 등나무 의자, 파란 저녁 실루엣(LV) → 저녁 실루엣.

## 11. 커밋 전 게이트

| 검사 | 결과 |
|---|---|
| `node scripts/verify-site.mjs http://127.0.0.1:4432/works/2026-W44/clone-08-brandon-yasin/` | 20개 주소 문제 없음: 콘솔 에러 0, 가로 넘침 0(1440 · 768 · 390), `href="#"` 0, h1 전부 1개 |
| `npx --yes impeccable@4.7.0 detect` 9페이지 | 0건. 처음 180건(대부분 `cramped-padding`: `calc(N * var(--u))` 안쪽 여백을 검사기가 못 풀어 0으로 읽음 → 배경 있는 상자의 안쪽 여백을 px로), `tight-leading`(보드 글자 1.15 → 1.3), `skipped-heading`(보드 안 h3/h4 → p), `low-contrast`(행사 지도 보드 바탕, 과정 비활성 단계)를 고쳤다. 설정으로 끈 규칙 없음 |
| `node scripts/check-korean.mjs` | 한국어 있는 페이지 0 / 9. 화면이 영어라 해당 없음 |

## 12. 못 한 것 · 원본과 다른 것

- 원본 사례 영상(약 20개)과 hero 영상은 재생 캡처를 못 했다(헤드리스 Chromium 코덱). 위치·크기만 DOM으로 쟀다. 그래서 영상 안의 움직임은 옮기지 않았다.
- 원본 모바일 화면은 390px 홈 캡처 1장만 있다. 모작 1024px 이하 배치는 그 캡처와 원본 CSS 브레이크포인트(768 · 1025)를 참고한 추정이다.
- 원본 페이지 전환 애니메이션, 메뉴 안 휠 이동은 확인하지 못해 만들지 않았다.
- 모달 종이·오류색·과정 비활성 투명도·해돋이/해넘이 글자색은 대비 때문에 원본과 다르게 했다(5절).
- 원본 archive는 Esc로 확대가 닫히지 않았다(캡처 `refs/states/archive-item-open.jpg` 후 Esc). 모작은 키보드 접근 때문에 Esc로도 닫힌다.
- 서체는 상용(Neue Haas Unica · Helvetica Now)이라 Inter Tight로 대신했다.
