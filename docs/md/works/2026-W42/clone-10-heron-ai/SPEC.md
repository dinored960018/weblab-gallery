# SPEC — Heron AI 모작 → Sillmark

## 출처

- **원본 URL**: https://heronaiapp.com/
- **어워드**: Awwwards Site of the Day · 2026-10-12
- **어워드 링크**: https://www.awwwards.com/sites/heron-ai
- **제작사**: Bearplus (Awwwards 수상 페이지 표기)
- **업종**: 건축 설계 AI 소프트웨어 (BIM · Revit 법규 검토)
- **모작 날짜**: 2026-10-15
- **모작 브랜드명(영문)**: Sillmark

### 대상 선정 근거 (2026-10-15, 무인 모드 상시 승인)

**조건**: 영어 화면 · 내부 링크로 이어지는 화면 5종 이상 · 수상 당시 디자인이 지금도 살아 있음 · 3D/WebGL/렌더 영상 주도 아님 · 일러스트·캐릭터 주도 아님 · `## 제외` 및 `works/**/SPEC.md` 의 원본 호스트와 겹치지 않음.

**방법**: Awwwards 타이포그래피 목록과 SOTD 목록(2026-09-15 ~ 2026-10-14)에서 미사용 후보를 추리고, 수상 페이지에서 원본 URL 을 얻어 헤드리스 Chrome 으로 내부 링크 수 · canvas · video 수를 쟀다. 수상일은 수상 페이지에서 직접 확인했다. 수상 3일 전이라 당시 화면과 현재 화면이 같다.

| 후보 | 수상 | 내부 링크 / canvas / video | 판정 |
|---|---|---|---|
| Aspen Search (aspensearch.com) | SOTD 2026-09-15 | 0 / 2 / 0 | 탈락 — 단일 화면 랜딩 |
| Moto Finance (moto-card.com) | SOTD 2026-09-24 | 3 / 3 / 1 | 탈락 — 화면 부족, 영상·canvas |
| Butter (butter.video) | SOTD 2026-09-28 | 7 / 1 / 49 | 탈락 — 영상 주도 |
| Milledollars (milledollars.fr) | SOTD 2026-10-02 | 10 / 1 / 1 | 보류 — 영상 제작사, 작업물이 영상 중심 |
| Noho (noho.ink) | SOTD 2026-09-18 | 0 / 2 / 0 | 탈락 — glb 3D 모델, 단일 화면 |
| **Heron AI (heronaiapp.com)** | **SOTD 2026-10-12** | **9 / 1(분석 도구 오버레이) / 0** | **채택 — 실존 화면 7종, 영상·3D 없음** |

- 같은 날 W42 clone-08 SPEC 에서 Heron AI 를 "내부 링크 0, 단일 화면"으로 탈락시켰다. 로딩 화면 중에 잰 값이었다. 이번에 로딩 후 재측정하고 각 경로를 직접 요청해 판정을 뒤집었다. 응답 200 확인: `/` `/heron-chat-widget` `/heron-dashboard` `/pricing` `/resources` `/about-us` `/contact-us` (`/product` 는 404, 모작에서 제외). 이 모순은 원본 호스트 · 브랜드가 `## 제외` 에 없어 허용된다.
- canvas 1개는 Microsoft Clarity 분석 오버레이(`position: fixed`, `pointer-events: none`)로 화면 콘텐츠가 아니다.
- 원본은 Webflow + GSAP · ScrollTrigger · Lenis · Swiper · barba (`refs/origin/origin.md`). 하이재킹 스크롤로 측정되고 문서 높이 = 뷰포트 높이다. 빌드 단계에서 `refs/motion-origin/motion.json` 으로 전환 방식을 확인한다.

### 브랜드명 확인

- 검색어: `"Sillmark" architecture software OR company OR brand`, `"Sillmark Review" building code compliance` (2026-10-15)
- 결과: 같은 이름의 실존 상호 없음. 가장 가까운 것은 샌디에이고 건축사무소 SILLMAN(철자 다름).

## 캡처 · 실측 산출물

- `refs/<페이지>/00-full.jpg` — select 단계 캡처 10페이지 (`measure.json` 에 computed style). 원본은 안쪽 래퍼(`.main-inner.lenis`)가 스크롤해서 `capture.mjs` 로는 첫 화면만 찍혔다.
- `refs/<페이지>/s-NN.jpg` · `text.json` — **build 단계 보강 캡처**. 로딩이 끝난 뒤 실제 휠을 굴려 화면마다 찍었다(`refs/_deep/home.mjs` · `pages.mjs` · `text.mjs`). 홈 25장, 제품 2종 각 12장, 소개 7장, 요금 4장, 자료 4장, 기사 4장, 문의 2장, 개인정보 4장, 404 2장.
- `refs/states/` — 드롭다운(Product·Resources) 호버 상태, 유스케이스 아코디언 기본 상태, 모바일 메뉴 열림(`refs/_deep/probe.mjs` · `mobile.mjs`).
- `refs/_probe-home.json` — 홈 주요 요소의 computed style·위치(`html` 글자 크기 8.333px 포함).
- `refs/motion-origin/` — `motion.json` · `timeline.html` · 프레임 267장.
- `refs/origin/` — `origin.json` · `origin.md` · 샘플 캡처.
- `refs/_sheets/` — 원본·모작 캡처를 묶은 대조용 시트. `refs/_mine/` · `refs/states-mine/` — 모작 캡처.
- `refs/award-awwwards.png` — Awwwards 수상 페이지.

분석용이며 결과물에 쓰지 않는다.

## 사이트 구조

원본은 Webflow 멀티페이지(barba 전환). 메뉴 `Product ▾(2) · Pricing · Resources ▾(3) · About · Contact us`.

| 종류 | 원본 경로 (개수) | 모작 경로 (개수) | 처리 |
|---|---|---|---|
| 홈 | `/` (1) | `index.html` (1) | 재현 |
| 제품 상세 | `/heron-chat-widget` · `/heron-dashboard` (2) | `chat-widget/` · `dashboard/` (2) | 재현. 같은 틀에 내용만 다름 |
| 요금 | `/pricing` (1) | `pricing/` (1) | 재현 |
| 자료 목록 | `/resources` (1, 필터 4종) | `resources/` (1, 필터 4종) | 재현. 드롭다운 3항목은 해시(`#insights` 등)로 필터 선택 |
| 자료 기사 | `/insights/*` · `/ai-practices/*` · `/design-workflows/*` (16) | `resources/<slug>/` (9, 분류별 3) | **개수만 줄임** 16 → 9 |
| 소개 | `/about-us` (1) | `about/` (1) | 재현 |
| 문의 | `/contact-us` (1) | `contact/` (1) | 재현. 하단 CTA 없음(원본도 없음) |
| 정책 | `/privacy-policy` · `/terms-and-conditions` · `/cookie-policy` (3) | `privacy-policy/` · `terms/` · `cookie-policy/` (3) | 재현 |
| 404 | 없는 주소 (1) | `404.html` (1) | 재현 |
| **합계** | 27 | **20** | 종류 9 = 9 |

- `/product` 는 원본에서 404 다(select 단계 확인). 메뉴의 Product 는 드롭다운 단추라 페이지가 없다. 모작도 단추로 만들었다.
- 공통: 헤더(로고 · 메뉴 칸 4 + Contact us 칸) · 하단 CTA(문의 · 정책 · 404 제외) · 푸터(메뉴 3열 · 구독 폼 · 주소 · 메일 · 기타 링크 · 큰 워드마크 · 정책 링크) · 쿠키 배너.

### 줄인 것 · 뺀 것

| 항목 | 원본 | 모작 | 이유 |
|---|---|---|---|
| 기사 수 | 16 | 9 | 개수만 줄임. 3분류 × 3편으로 필터 동작이 보이게 남김 |
| Awwwards "W. Site of the Day" 고정 리본 | 오른쪽 가운데 고정 | 없음 | 제3자 상표 배지. 사이트 디자인이 아니다 |
| 소셜 링크 (Website · Dribbble · FWA · Awwwards · Instagram · LinkedIn) | 외부 링크 6 | 내부 링크 6(`Elsewhere` 열) | 실존 상표를 쓰지 않는다. 자리와 2열 배치는 그대로 |
| 제작사 링크(Bearplus) | 외부 링크 | 가상 스튜디오 "Lintel Office" → 소개 페이지 | 실존 상호 금지 |
| 공유 단추(Facebook · X · LinkedIn · 링크) | 4 | 링크 복사 · 메일 · 인쇄 3 | 실존 상표 금지. 링크 복사는 실제로 동작 |
| barba 페이지 전환 | 있음 | CSS `@view-transition{navigation:auto}` | 같은 문서 간 페이드. 지원 안 되는 브라우저는 일반 이동 |
| Lenis 관성 스크롤 · 안쪽 래퍼 스크롤 | `.main-inner.lenis` 가 스크롤 | 네이티브 문서 스크롤 | 접근성(키보드·스크롤바)과 `position:sticky` 를 위해. 그래서 원본 `문서 높이 = 900` 은 비교 기준이 아니고, 래퍼 `scrollHeight 12338` 과 비교한다 |
| 로딩 화면 첫 1.1초 검은 화면 | 있음 | 없음 | 브라우저가 첫 프레임을 그리기 전 빈 화면이다(`refs/_sheets/load1.jpg` `load-00708`). 디자인이 아니다 |

### 원본에 없는 것

| 항목 | 이유 |
|---|---|
| `Skip to content` 링크 | 접근성 최소선(키보드). 포커스 받을 때만 보인다 |
| 히어로 위반 표식이 **단추**로도 열림 | 원본은 드래그로만 본다. 키보드 사용자를 위해 표식을 누르면 같은 카드가 열리게 했다 |
| 문의 폼 성공 문구가 실제 전송 없이 뜸 | 규격 4-4 "제출은 막되 검증 메시지는 보인다" |
| `prefers-reduced-motion` 대응 | 규격 필수. 로더를 건너뛰고 반복 애니메이션을 멈춘다 |

## 섹션 순서 (홈, 위 → 아래)

| # | 원본 섹션 · 높이(px) | 모작 · 높이(px, 1440×900) | 내용 |
|---|---|---|---|
| 0 | 로더 (fixed, 1.7~9.1 s) | 로더 | 입면 선그림 그려짐 · 진행선 0→100% · 제목 · 정보표 · 단계 10줄 |
| 1 | `home-hero` 887 | `.hero` 887 | 사진 + 위반 표식 + 십자선 커서 / 하단 바: H1 · 설명 · 마퀴 · Discover more |
| 2 | `home-intro` 723 | `.intro` 723 | 좌 사진 / 우 큰 문장(끝 두 단어 회색) · Learn more / 고객 로고 캐러셀 · 도구 안내 |
| 3 | `home-problem` 743 | `.problem` 748 | 머리말 + 4열 카드(태그 · 아이소 선그림 · 제목 · 설명) |
| 4 | `home-map` **6300** (고정 시퀀스) | `.map` **6300** | 제목 2개 → 벽 조각 모임 → 평면 채움 → 오른쪽 패널 열림 → 위반 표식 |
| 5 | `home-platform` 710 | `.platform` 721 | [01] 채팅 위젯 · [02] 대시보드 — 3열(제목 · 목업 · 설명+링크) |
| 6 | `home-why` 681 + 패널(스크롤 캡처상 약 1,500) | `.why` 1188 | 머리말 2열 + 2×2 일러스트 패널(Observe · Advise · Act · Learn) |
| 7 | `home-usecase` 887 | `.usecase` 887 | 좌 사진(빨간 원·막대) / 우 제목 + 아코디언 8 |
| 8 | `cta` 698 | `.cta` 743 | 좌표 라벨 · 점선 격자 · 제목 · 문의 단추 · 선그림 |
| 9 | `footer` 711 (위 사진 띠 제외) | `.ftr` 982 (사진 띠 213 포함) | 위 참조 |

문서 높이: 원본 래퍼 12,338 px → 모작 13,185 px (**+6.9 %**, 기준 ±15 % 안). 실측 `refs/_deep/measure-mine.mjs`. 섹션 수 9 = 9. 3화면 넘는 섹션(맵 6300 px)은 모작에도 같은 높이로 있다.

## 그리드 실측표 (1440 × 900)

`html` 글자 크기를 원본처럼 `100vw / 172.8` 로 잡아 1440에서 1rem = 8.333 px. 모든 칸 폭은 rem 또는 % 라서 1440에서 원본 px 과 같다.

| 항목 | 원본 (근거) | 모작 |
|---|---|---|
| 화면 테두리 안쪽 여백 | 6.67 px (`.header` x=7, `_probe-home.json`) | `.8rem` = 6.67 px, 고정 테두리 1 px `#b3b3af` |
| 헤더 높이 | 56 px | `6.75rem` = 56.25 px |
| 로고 칸 / 왼쪽 패딩 | 705 px(50 %) / 26.67 px | 나머지 폭 / `3.2rem` = 26.67 px |
| 메뉴 칸 · Contact 칸 | 137 px × 4 · 167 px (`dropdown.json`) | `16.4rem` = 136.7 px × 4 · `20rem` = 166.7 px |
| 드롭다운 폭 · 항목 높이 | 220 px · 37 px | `22rem` = 183 px · 37 px |
| 히어로 하단 바 | H1 칸 825 px(57.8 %) · 설명 459 px · 단추 142 px, 높이 134 px | `57.8% 1fr 17rem` · 높이 `16rem` 이상 |
| 인트로 | 50 % / 50 %, 문장 x=845 (패딩 125 px) | `50% 50%`, 패딩 `15.2rem` = 127 px |
| 문제 카드 | 4열 × 357 px(25 %) | `repeat(4,1fr)` |
| 플랫폼 행 | 360 · 601 · 465 px (25.2 · 42.1 · 32.7 %) | `25.2% 42.1% 1fr` |
| Why 머리 | 962 · 465 px (67.6 · 32.4 %) | `67.6% 1fr` |
| 유스케이스 | 50 / 50, 제목 x=848 | `50% 50%`, 패딩 `15.2rem` |
| CTA | 25 · 50 · 25 %, 점선 y=79 · 311 px | `25% 50% 25%`, 점선 `9.6rem` · `37.2rem` |
| 푸터 | 25 % · 1/6 × 3 · 25 % (x=363·602·840·1076) | `25% 1fr 1fr 1fr 25%` |
| 요금 | 5열 × 285 px(20 %) | `repeat(5,1fr)` |
| 제품 기능 탭 | 5칸 + 진행 막대 | `repeat(5,1fr) 6rem` |
| 기사 / 정책 목차 칸 | 25.6 % / 33 % | `25.2%` / `33%` |
| 자료 카드 | 4열 | `repeat(4,1fr)` |
| 브레이크포인트 | 991 · 767 (Webflow 기본, 모바일 캡처 `refs/home/90-mobile-390.jpg`) | 991 · 767 |

## 타이포

원본 `measure.json` · `_probe-home.json`. 대문자(`text-transform:uppercase`) 제목, 자간 −0.02em.

| 역할 | 원본 | 모작 |
|---|---|---|
| 본문 서체 | BT Grotesk (상용) | **Schibsted Grotesk** (Google Fonts). 같은 네오 그로테스크, 굵은 대문자에서 좁게 붙는 인상 |
| 고정폭 | Geistmono | **Fragment Mono** (Google Fonts). 같은 헬베티카 계열 고정폭. Geist Mono 는 impeccable `overused-font` 에 걸려 바꿨다(아래 게이트 절) |
| H1 | 46.67 px / 700 / 행간 1 / −0.93 px | `5.6rem` 700 / 1 / −.02em |
| H2 | 40 px / 600 / 1 / −0.8 px | `4.8rem` 600 |
| 인트로 큰 문장 | 33.33 px / 600 | `4rem` 600 |
| 맵 제목 | 46.67 px / 700, 색 `#626260` | `5.6rem` 700 `#626260` |
| 카드 제목 | 23.33 px / 600 | `2.8rem` 600 |
| 유스케이스 · FAQ 항목 | 20 px / 700 / 22 px · 16.67 px 700 | `2.4rem` · `2rem` 700 |
| 정책 제목 | 60 px / 500 | `7.2rem` 500 |
| 본문 | 13.33 px / 500 / 17.33 px / −0.27 px | `1.6rem` 500 / 1.3 |
| 리드 | 16.67 px / 500 / 20 px | `2rem` / 1.2 |
| 고정폭 라벨 | 11.67 px · 10 px · 8.33 px, 대문자 | `1.4rem` · `1.2rem` · `1rem` 대문자 |

## 아이콘

원본은 선 1 px 육각형 테두리 아이콘(맵 오른쪽 행 · 미션 목록 · 마퀴), 화살표 → , 모서리 꺾쇠 ⌟(드롭다운 칸), +/− (아코디언). 모작은 전부 SVG 로 새로 그렸다(`src/art.mjs` `hexIcon` · `ICON`). 선 1.1~1.2, 끝 각짐.

## 컬러

| 역할 | 원본 (근거) | 모작 |
|---|---|---|
| 종이 바탕 | `#f5f5ed`~`#f7f7ef` (`refs/home/s-05.jpg` 픽셀 표본) + 노이즈 SVG(`--bg-img`) | `#f5f5ed` + feTurbulence 노이즈 |
| 글자 주색 | `--content--primary #282828` | `#282828` (종이 위 13.5:1) |
| 보조 | `--content--secondary #414140`, `--content--terriary #282828b8` | `#414140`(9.3:1), `rgba(40,40,40,.78)` |
| 선 | `--content--border #b3b3af` | `#b3b3af` |
| 흐린 글자 | `--content--disable #b4b4b0` (대비 1.9:1) | 작은 글자 `#686865`(5.1:1), 큰 회색 제목 `#8c8c88`(3.1:1, 큰 글씨 기준 3:1 이상) — **대비 부족이라 고쳤다** |
| 강조(면·표식) | `--content--brand #fa3600` | `#fa3600` 그대로 |
| 강조 글자 | `#fa3600` (3.43:1) | `#c92b00` (5.01:1) — 대비 고침 |
| 강조 단추 바탕 + 흰 글자 | `#fa3600` (흰 글자 3.76:1) | `#dc3000` (4.70:1) — 대비 고침 |
| 벽 채움 | 평면 벽 `#3a3a3a` 근처 | `#3a3a3a` |

## 간격

- 섹션 사이 여백 대신 **1 px 선으로 칸을 나누는 체계**. 칸 안 패딩이 리듬을 만든다.
- 반복 수치: 26.67 px(3.2rem, 칸 좌우), 13.33 px(1.6rem), 10 px(1.2rem, 라벨 위), 53.33 px(6.4rem, 히어로 위), 125 px(15.2rem, 인트로·유스케이스 들여쓰기).
- 눈금자(+ ||||| +)가 화면 테두리와 큰 사진 칸 위아래에 붙는다(`refs/home/s-05.jpg`). 모작은 SVG 눈금 무늬(`src/style.mjs .ruler`).

## 모션

근거: `refs/motion-origin/motion.json` · `refs/origin/origin.md`. 원본 녹화의 스크롤 구간은 안쪽 래퍼가 움직여 `scrollY=0` 으로 남았다. 그래서 스크롤 등장 모션은 `origin.md` 의 키프레임 · 인라인 스타일 초깃값으로 옮겼다.

| 무엇 | 원본 실측 | 모작 |
|---|---|---|
| 로더 제목 줄 등장 | 1717 ms 시작, `translate(0,100%)→0` + opacity, 줄별 432·454·472·493 ms | 1700 ms, 같은 지속 줄별, `cubic-bezier(.16,1,.3,1)` |
| 로더 정보표 · 단계 줄 | 1717 ms 부터 약 300 ms 간격으로 한 줄씩 opacity 0→1 | 1717 ms + 300 ms × n |
| 입면 선그림 | 1750~7100 ms 진행선과 함께 그려짐 | 선마다 1.2 s `stroke-dashoffset 1→0`, 각 선의 시작 시각을 아래 진행 곡선에 맞춤 |
| 진행선 · % | 원본 프레임에서 잰 곡선: 2308 ms 31 % · 4000 ms 50 % · 7100 ms 100 % (초반이 빠름) | 같은 네 점을 잇는 구간 선형. 시계는 `performance.now()` 원점(내비게이션 시작) — 원본 녹화와 같은 기준. 모작 녹화에서 2316 ms 30 % · 4000 ms 49 % |
| 로더 퇴장 | 7156 ms: 내용 opacity 386 ms, 위·아래 판 `translate ∓` 808 ms | 7156 ms, 386 ms · 808 ms `cubic-bezier(.625,.05,0,1)`, 선그림 0.4 s 페이드 |
| 헤더 · 테두리선 등장 | 7964 ms: 헤더 항목 opacity 1200 ms, 선 `scale(0→1)` 1200 ms | 7964 ms, 1.2 s |
| 사진 등장 | 선그림 → 렌더 이미지 교차 페이드 | 입면 선그림 → 사진 1.2 s 교차 |
| 위반 표식 깜빡임 | `fadeLoop` 1500 ms linear, scale .95↔1 · opacity .7↔1 | 같음 |
| 마퀴 | `marqueeLeft` 10000 ms linear, 목록 1벌 이동 | 10 s, 1벌(1/6) 이동 |
| 고객 로고 캐러셀 | Swiper `transform` 600 ms ease, 자동 넘김 | 600 ms ease, 3.6 s 자동, 화살표 |
| 버튼 호버 | 글자 두 벌 `translateY(-100%)` 480 ms `cubic-bezier(.625,.05,0,1)`, 색 300 ms | 같음 |
| 메뉴 칸 호버 | 어두운 바탕 · 흰 글자, color 0.4 s | 바탕 아래→위 채움 0.4 s, 글자 흰색 |
| 드롭다운 | `opacity .4s, grid-template-rows .4s` | 같음 |
| 문제 아이콘 | `homeProblemDraw` · `homeProblemDashAppear` · `homeProblemDashFlow` | 같은 이름·구조, 화면 진입 시 |
| 맵 시퀀스 | ScrollTrigger 고정 6300 px | `position:sticky` + 스크롤 진행률 JS (아래 단계) |
| Why 패널 반복 | `homeWhyBoxReveal` · `IconReveal` · `IconBgSwap` · `IconBorderPulse` · `pointReveal` · `LineVisibility` · `DashMove 800` · `Card2Reveal` · `CardDotsVisibility` · `CardDotLoading 1200` · `loadingActive` · `checkActive` · `homeWhySpin 1000` · `homeWhyBorderActive` (전부 5000 ms linear 반복) | 같은 이름·지속·키프레임 비율로 다시 씀 |
| 섹션 내용 등장 | `translate(0, 26.67px)` + opacity 0 초깃값 (`cta-head-item-txt` 등) | `.reveal` `translateY(3.2rem)` → 0, 0.9 s; 제목 줄 마스크 `translateY(100%)` → 0, 줄 간격 60 ms |
| 헤더 숨김 | 스크롤하면 사라짐 (`refs/home/s-01.jpg`) | 아래로 숨김 · 위로 보임 0.6 s |

맵 시퀀스 단계(진행률 p): 0~.12 "Right there with you" → .1~.42 벽 조각이 흩어진 자리에서 모임(테두리만) · 소개 카드 3단계 문장 교체 → .44~.54 벽 채움 · 치수/가구 등장 → .6~.78 오른쪽 패널 열림(0→39.3 %) · 평면 축소 → .74~.82 위반 표식 01·02·03 튀어나옴(1.15 오버슈트) → 클릭하면 조항 카드.

옮기지 못한 것: 원본 로드 직후 Webflow 버튼 변형이 바뀌며 생긴 `color` 300 · 200 ms 전환 8건(`motion-compare.html` 빨간 줄). 화면에 보이지 않는 초기화 동작이라 옮기지 않았다. 원본 Lenis 관성은 위 "줄인 것" 표.

## 기능 목록

| 기능 | 원본 | 모작 동작 (전부 `refs/_deep/func.mjs` 로 실제 클릭·키 입력 검증) |
|---|---|---|
| 드롭다운 2개 | 호버로 열림, 칸 검게 | 호버·클릭·Enter 로 열림, 바깥 클릭·ESC 로 닫힘, ESC 후 포커스 복귀, `aria-expanded` |
| 모바일 메뉴 | MENU 단추 → 아래로 목록 | 열림·닫힘·ESC, 열린 동안 `body` 스크롤 잠금 |
| 히어로 위반 보기 | 클릭·드래그 → 위반 카드, 십자선 X/Y 좌표 | 캔버스 2D 십자선 + 좌표, 드래그 선택 영역 안 표식 카드 열림, 표식 단추 클릭·ESC |
| 고객 로고 캐러셀 | 좌우 화살표 · 자동 | 좌우 화살표 · 자동(호버 시 멈춤) |
| 맵 위반 표식 | [CLICK ON VIOLATION] | 표식 단추 → 조항 카드, ESC 로 닫힘 |
| 유스케이스 아코디언 | 하나만 열림 | 하나만 열림, `aria-expanded` |
| 제품 기능 탭 | 스크롤 따라 활성 탭 이동 | 스크롤 연동 + 클릭 시 해당 기능으로 스크롤, ←/→ 키, `aria-selected` |
| 제품 · 요금 FAQ | 아코디언 | 아코디언 |
| 요금 월/연 | 토글, 가격 바뀜 | 라디오 그룹, 가격·단위 바뀜, `aria-checked` |
| 자료 필터 | ALL [16] · 분류별 | ALL [9] · 분류별, `aria-pressed`, 해시로 선택(메뉴 링크) |
| 기사 · 정책 목차 | 현재 절 표시 | 스크롤 따라 표시, 클릭 이동 |
| 공유 | 링크 4 | 링크 복사(상태 문구) · 메일 · 인쇄 |
| 문의 폼 | 필수 · 형식 검사 "Wrong format" | 필수 "Required" · 형식 "Wrong format", 첫 오류로 포커스, 성공 문구(전송 안 함) |
| 구독 폼 | 이메일 | 형식 검사 · 성공 문구 |
| 쿠키 배너 | Accept / Reject | 선택을 `localStorage` 에 저장하고 닫힘 |

## 사진

`node scripts/fetch-stock.mjs … --source unsplash` 로 받은 18장(`credits.json`, 전부 Unsplash License · 표기 의무 없음). 원본 자리는 연필 렌더 풍 건축 일러스트와 인물 소묘다. 같은 무드(흑백 콘크리트 건축 · 밝은 바탕 인물)로 고르고 CSS `grayscale(1) contrast(1.12)` + `mix-blend-mode:multiply` 로 종이 위에 얹었다. 원본의 빨간 원·사각 면은 CSS 도형으로 겹쳤다.

- Pinterest 대신 Unsplash 를 쓴 이유: 지시의 금지 항목(AI 생성 이미지 · 표기 의무 사진)을 확실히 피하기 위해. Pinterest 는 라이선스와 AI 생성 여부를 확인할 수 없다.
- 평면도 · 입면 · 아이소 아이콘 · 목업 UI · 로고 · 워드마크 · 404 는 전부 SVG/HTML 로 새로 그렸다.

## 게이트 예외 (impeccable)

`npx impeccable detect works/2026-W42/clone-10-heron-ai` 최종 1,400건. 처음 719건에서 `overused-font`(Geist · Geist Mono → Schibsted Grotesk · Fragment Mono), `repeating-stripes-gradient`(눈금을 SVG 무늬로), `low-contrast`(.fa 라벨), `skipped-heading`(자료 카드 h3→h2), `all-caps-body`(도구 안내 88자 → 짧게), `tiny-text`(자료 카드 요약 10→13.33 px), `cramped-padding` 24건(로고 칸 패딩)을 고쳤다. 설정 파일로 규칙을 끄지 않았다.

남은 것:

| 규칙 | 건수 | 위치 | 근거 |
|---|---:|---|---|
| `cramped-padding` | 37 | 모작 20페이지 | 원본은 여백 대신 1 px 선으로 칸을 나누고 칸끼리 맞붙는다. 실측: 문제 카드 357 px 4칸이 x=7·364·721·1078 에 붙어 있고(`_probe-home.json` `.home-problem-item`), 메뉴 칸 137 px 가 선으로 맞닿는다(`refs/states/dropdown.json`). 섹션 아래 선에 칸이 닿는 것이 이 체계다(`refs/home/s-03.jpg` · `s-15.jpg`). 칸 **안의 글자**에는 패딩 26.67 px 을 그대로 줬다 |
| `cream-palette` | 20 | 모작 20페이지 | 원본 바탕 `#f5f5ed`~`#f7f7ef` (`refs/home/s-05.jpg` 픽셀 표본, `origin.md` `--bg-img` 노이즈 SVG). 사이트 인상의 중심이다 |
| `marquee` | 40 | 모작 20페이지 (홈 히어로 · 소개 후원 로고) | 원본 `@keyframes marqueeLeft` · `marqueeRight`, 애니메이션 `marqueeLeft 10000ms linear` (`refs/origin/origin.md`), 히어로 "FASTER ITERATIONS · FEWER MISTAKES · LESS BUSYWORK" 띠(`refs/home/s-01.jpg`), 소개 "BACKED BY" 로고 띠(`refs/_sheets/about.jpg`). CSS 가 모든 페이지에 들어 있어 페이지마다 잡힌다 |
| `tiny-text` | 1,296 | `refs/motion-origin/timeline.html` · `refs/motion-mine/timeline.html` · `refs/motion-compare.html` | 녹화·비교 도구(`scripts/record-motion.mjs` · `motion-compare.mjs`)가 만든 분석 보고서. 모작 페이지가 아니다. 절차가 `refs/` 에 두라고 정했다 |
| `cramped-padding` | 6 | 위 도구 보고서 3개 | 같음 |
| `low-contrast` | 1 | `refs/motion-compare.html` | 같음 |
