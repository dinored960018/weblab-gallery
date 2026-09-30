# SPEC — ELOREA (엘로리아)

## 출처

- **원본 URL**: https://elorea.co.kr/
- **어워드**: Awwwards **Honorable Mention**
- **어워드 링크**: https://www.awwwards.com/sites/elorea
- **수상일**: 2026-01-29
- **업종**: 향수 · 홈 프래그런스 · 핸드 & 보디 커머스 (Shopify, 테마 Broadcast 계열 — `hover-disclosure` · `data-aos` · `predictive-search` · `cart-drawer` · flickity. 퀴즈는 외부 앱 Tangent 임베드)
- **모작 날짜**: 2026-09-30
- **모작 브랜드명**: `결 / GYEOL` (가상). 워드마크는 SVG 선으로 직접 그린 G·Y·E·O·L, 인장은 ‘결’ 한 글자를 정사각 틀에 직선으로 짠 도형(`build.mjs` `WORDMARK` · `SEAL`). 원본 이름·로고·문구·사진·영상은 쓰지 않았다.

> 원본 스택 실측 (`refs/origin.md`): jQuery + 테마 스크립트, 웹폰트 DM Sans · Noto Sans KR, 본문 system-ui, 네이티브 스크롤(`scroll-behavior: smooth`), WebGL 없음(2D 캔버스 1개 200×50 = 트래킹 픽셀). 3D 비중 없음 → 2D 모작 대상 조건 충족.

---

## 사이트 구조

- **원본 페이지**: 크롤 30 + 추가 캡처 8 (`measure.json`, `refs/measure-extra.json`). 홈, 컬렉션 22, 브랜드·스토어 `/pages/*` 9, 상품 상세(컬렉션 카드에서 전부 링크), 카트, 검색.
- **재현 페이지**: **90페이지** — `node build.mjs` 가 `data.mjs` 로 생성. 모든 내비·카드·푸터 링크가 만든 페이지로 간다(상대 경로 + `index.html`, `file://` 로도 이어짐). `href="#"` 0.

```
/                                  홈
├─ 디스커버리                       /collections/2ml/        (원본 /collections/2ml)
├─ 프래그런스 ▾ (호버 메가 메뉴 6열)  /collections/eau-de-parfum/
│   ├─ 전체보기 · 디스커버리(전체, 세트) · 베스트셀러(향 라인 3) · 향 노트(4 계열) · 컬렉션(4) · 나의 향 찾기
│   ├─ /collections/best-sellers/ · /collections/line-{hanji,gyeongpo,maehwa}/  (원본 /collections/hazy-blue 등)
│   ├─ /collections/scent-profile/ → /collections/{floral,woody,fresh,warm}/
│   └─ /collections/by-collection/ → /collections/{seasons,garden,places,materials}/
├─ 홈                               /collections/home-fragrance/
├─ 핸드 & 보디                       /collections/hand-body-care/
├─ 기프트                            /collections/gifting/  (가로 레일 3줄)
├─ 나의 향 찾기                      /pages/fragrance-quiz/
├─ 브랜드 ▾ (호버 메가 메뉴 2열)      캠페인(/pages/campaign/ · /pages/campaign-archive/) · 결 소개(/pages/about/)
├─ 스토어                            /pages/seoul-store/ → /pages/{busan,jeju}-store/  (원본 seoul/ny/la)
├─ 상품 상세                          /products/<slug>/ × 53  (오 드 퍼퓸 15 · 엑스트레 2 · 2mL 15 · 세트 7 · 홈 5 · 핸드 & 보디 9)
├─ 헤더: 검색(팝다운) · 카트(드로어, /cart/) · 검색 결과 /search/?q=
└─ 푸터: 배송 · 교환 및 반품 · FAQ · 이용약관 · 개인정보처리방침 · 문의 · Press · Campaign
```

원본 대비:
- 원본 소개 페이지 2개(`/pages/ourstory`, `/pages/about-us-new-26`)는 **하나(`/pages/about/`)로 합쳤다.** 홈 ‘더보기’도 여기로 간다. 두 원본 모두 같은 소개 뼈대(정의 → 원료 → 철학 → 엠블럼 → 약속 → 나눔)라 나누면 같은 페이지가 두 번 생긴다.
- 원본 ‘캠페인 · 사랑에 대하여’(About Love, 챕터 탭 4개) → 가상 브랜드의 ‘절기에 대하여’(챕터 탭 4개). 구조 동일.
- 원본 해외 매장(뉴욕 · LA) → 부산 · 제주. 페이지 구성 동일.
- 원본 문의 페이지는 이메일 안내 문장만 있다. 모작도 같은 안내 문장만 둠(원본에 없는 폼은 넣지 않음).
- 원본 카카오 채널 버튼(서드파티 스크립트) → **정적 1:1 문의 버튼**(`.chat-btn`, 문의 페이지로 이동). 외부 스크립트 없음.

## 그리드

| 항목 | 원본 실측 (1440) | 모작 |
|---|---|---|
| 좌우 여백 | 32 (로고 x=32, 히어로 글 x=32) | `--pad: 32px` |
| 공지 바 / 헤더 | 36 / 78 (`header` 77.75) | 36 / 78 |
| 홈 히어로 | 첫 장 100vh−36 (864), 이후 100vh−78 (822), 사이 흰 띠 10 | 동일 |
| 탭 컬렉션 | 셀 402 × 3.58장, 1px 선 | 360 × 4장(아래 ‘옮기지 못한 것’) |
| 컬렉션 그리드 | 4열 360, 1px 선, 여백 0 | 동일 (선은 box-shadow 1px) |
| 컬렉션 히어로 | 600 (eau-de-parfum) · 675 (home, gifting) | 600 · 675 |
| 상품 상세 | 갤러리 x=32~720, 정보 x=805 폭 550 | `grid 1fr 550px; gap 85px` |
| 필터 드로어 | 왼쪽 380 | 380 |
| 카트 드로어 | 오른쪽 380 (1060~1440) | 380 |
| 브레이크포인트 | 990(헤더 모바일 전환) · 750 | 989 · 749 |
| 반경 | 0 (카카오 버튼만 둥글다) | 0 (문의 버튼 14) |

## 타이포

| 역할 | 원본 | 모작 |
|---|---|---|
| 제목·본문 | `system-ui` 스택 (Windows 에서 맑은 고딕) | 같은 스택 + `Apple SD Gothic Neo` · `Malgun Gothic` · `Noto Sans KR` 명시 |
| 내비·버튼·라벨 | **DM Sans** | DM Sans (Google Fonts 9..40 400/500/700) |
| 퀴즈 로고 | 세리프 이미지 | Georgia 세리프 텍스트 |

실측 스케일 (`measure.json` typo):

| px | 굵기 | 쓰이는 곳 |
|---:|---:|---|
| 40 | 700 | 컬렉션 섹션 제목(‘나에게 어울리는 향 찾기’), 향 노트 타일, 상품 하단 컬렉션명 |
| 30 | 700 | 히어로 제목, EXPLORE, 초대, 컬렉션 히어로 |
| 20 | 700 | 스토어 제목, 상품명 h1, 증정 카드 |
| 16 | 700 | 히어로 eyebrow, 약속 라벨, 푸터 제목 |
| 16 | 400 · 자간 1.6px | ‘뉴스레터’, ‘Collection 4’ eyebrow → **모작 0.04em**(아래 게이트) |
| 15.75 | 400 | 히어로 설명 (첫 장 이탤릭) |
| 14 | 400 | 카드 이름·가격(#646464), 본문 |
| 13.13 | 400 · 0.26px | 헤더 내비 (DM Sans) |
| 12.25 | 400/700 | 티커 문구, 컬렉션 설명, 사업자 정보 |
| 11 | 400 · 1.1px 대문자 | 버튼·탭·필터·정렬 (DM Sans) |
| 10.5 | 700 | 공지 바 → **모작 11px** (게이트 `undersized-ui-text`) |

## 아이콘

- 원본: 인라인 SVG 24 viewBox, stroke 1(`icon-search` 원 + 사선, 가방, 햄버거 `M3 5h18…`), 약속 섹션은 검정 채움 도형 이미지.
- 모작: 전부 직접 그림. 24 viewBox, **stroke 1.5 round**. 약속 도형(사람·물방울·쌓인 사각·점 5개)과 퀴즈 계열 도형(원·육각·마름모 별·십자)은 원본과 다른 모양으로 새로 그림.

## 컬러

| 역할 | hex | 근거 |
|---|---|---|
| 바탕 | `#ffffff` | `--COLOR-BG` |
| 본문 | `#212121` | `--COLOR-TEXT` |
| 보조 글자 | `#646464` | `--COLOR-TEXT-LIGHT` (가격) |
| 검정 면 | `#000000` | 공지 바, RTE·스토어·초대 섹션, 퀴즈 |
| 헤더 배경 | `rgba(0,0,0,.88)` | `header::after` 실측 |
| 헤더 선 | `#d1d0ce` 50% (홈 상단은 흰색) | `header::before` |
| 회색 띠 | `#f2f2f2` | 약속·티커·증정 카드 |
| 강조(골드) | `#ab8c52` | `--COLOR-ACCENT` (진행 막대·무료 배송 막대) |
| 카트 개수 뱃지 | 원본 `#ab8c52` 흰 글자 3.2:1 → **모작 `#7d6435` 5.6:1** | 대비 수정 |
| 캠페인 띠 | 원본 `#c5bdb2` 흰 글자 1.86:1 → **모작 `#7a6e60`** | 대비 수정 |
| 선 | `#e6e6e6` | 카드 격자 |
| 버튼 | `#212121` / 흰 글자 | `--BTN-PRIMARY-BG` |

## 간격

| 항목 | 원본 | 모작 |
|---|---|---|
| 히어로 글 블록 | eyebrow → 제목 26, 제목 → 설명 12, 버튼 위 32, 바닥 64 | 동일 |
| 탭 컬렉션 | 위 60, 제목 → 탭 46, 탭 → 그리드 40 | 동일 |
| RTE | 위 60, 문단 22, 더보기 위 56 | 동일 |
| 약속 띠 | 230 | 약 167 (문구 1줄) |
| 초대 | 460, 본문 좌 118 | 460+, 동일 |
| 푸터 | 위 90, 하단 정보 위 110 | 동일 |
| 반복 수치 | 10 · 16 · 24 · 32 · 40 · 60 · 78 · 110 | |

---

## 모션

실측 도구: `extract-origin.mjs`(transition 빈도·@keyframes) · `record-motion.mjs`(로드 5초 → 휠 스크롤 → 호버) · 상태별 `getAnimations()` 채집(`refs/states/states2~4.json`, `refs/states/mobile/mobile.json`).

| 이징 토큰 | 곡선 | 원본 쓰임 |
|---|---|---|
| `ease` | ease | 헤더 등장 1000, 공지 800/500, 검색 500, 드로어 300, 배지 800, 맨 위로 300 |
| `--ease-img` | cubic-bezier(.25,.46,.45,.94) | 이미지 틀 opacity·scale 800 |
| `--ease-out-quart` | cubic-bezier(.215,.61,.355,1) | 메가 메뉴 200, 헤더 배경 200 |
| `--ease-line` | cubic-bezier(.39,.575,.565,1) | 내비·탭 밑줄 width 300 |
| `--ease-btn` | cubic-bezier(.33,0,0,1) | 퀵 애드 버튼 transform 500, 버튼 채움 |
| heroFadeIn | 1s ease, `opacity .001 translateY(15px) → none`, 스태거 0/150/300(/450/600) | 스크롤 등장 전부 (테마 CSS `[data-aos=hero]` 확인) |

## 모션 타임라인

녹화: 홈 `refs/motion-origin/` · 컬렉션 `refs/motion-origin-collection/` · 상품 `refs/motion-origin-product/` (모작 `motion-mine*`). 시각은 네비게이션 시작 기준 ms.

### 1. 로드 (0~5000ms)

| 시각 | 원본 요소 | 속성 | 지속 · 지연 | 이징 | 모작 |
|---|---|---|---|---|---|
| 649 | 공지 바 | opacity 0→1 | 500 | ease | `.js.is-ready .announce` |
| 649 | 헤더 데스크톱 | opacity 0→1 | 500 | ease | `.hdr__inner` |
| 649 | 푸터 링크 묶음 | fadeInUp (15px) | 300 | linear 키프레임 | `.ftr__links` |
| 691 | 헤더 | opacity 0→1, transform → translateZ(0) | 1000 | ease | `.hdr` 동일 |
| 691 | 히어로 영상 | opacity 0→1 | 500 | ease | 영상 → 사진(아래). 사진은 `img` opacity 500 ease-in |
| 691 | 히어로 제목·설명·버튼 | heroFadeIn | 1000 · 0/150/300 | ease | 동일 (`data-aos="hero"` + `--d`) |
| 649~ | 이미지 | opacity 1e-6→1 | 500 | ease-in | `.fade-img` (화면에 들어온 미로드 사진만) |

### 2. 스크롤

| 시각 | 원본 요소 | 속성 | 지속 | 이징 | 모작 |
|---|---|---|---|---|---|
| 5289 | 헤더 `::after` 배경 | opacity 0→1 (투명 → 88% 검정) | 200 | out-quart | `.hdr.is-solid` (scrollY > 36) |
| 5289 | 헤더 `::before` 선 | border-bottom-color #fff→#d1d0ce | 200 | ease | 동일 |
| 5451 | 맨 위로 버튼 | opacity, translateY(100%)→0 | 300 | ease | 동일 (scrollY > 700) |
| 5808 | 카드 사진 틀 | scale(1.05)→none, opacity | 800 · 카드별 100 스태거 | ease-img | `.img-reveal.is-armed.aos-animate` |
| 5808 | 배지 | opacity 0→1, transform | 800 · 100/200 | ease | `.badge[data-aos]` |
| 5808 | 탭 제목·탭 4개 | heroFadeIn | 1000 · 0/150/300/450/600 | ease | 동일 |
| 5972 | 슬라이더 화살표 | opacity, translate(100%)→0 | 200 | ease-in-out | opacity + scale(.8)→1 (아래 이유) |
| 7568 | 공지 슬라이드 | opacity 1→0, visibility | 800 | ease | 6초 간격 교체, 동일 곡선 |
| 컬렉션 | 티커(마퀴) | translateX 반복 | 19,950 | linear | `ticker-rtl` 19.95s |

### 3. 호버 · 클릭 (상태별 채집)

| 원본 요소 | 속성 | 지속 | 이징 | 모작 |
|---|---|---|---|---|
| 내비 밑줄 | `::after` width 0→100% | 300 | ease-line | 동일 |
| 메가 메뉴 | opacity 0→1 | 200 | out-quart | 동일 |
| 카드 호버 사진 | opacity 0→1 | 250 | ease-in-out | 두 번째 사진을 첫 호버 때 넣고 같은 전환 |
| 퀵 애드 버튼 | opacity 500 ease, transform 500 | 500 | ease / (.33,0,0,1) | 동일 |
| 버튼 채움 | `::after` translateY(35px)→0 | 500 | (.33,0,0,1) | 동일 |
| 검색 팝다운 | opacity + translateY(-100%)→0, 덮개 opacity 300 · 지연 100 | 500 | ease | 동일 |
| 카트·퀵 애드 드로어 | slideInRight | 300 | ease | 동일 + 항목 cartDrawerItemsFadeInLeft 500, 50ms 스태거 |
| 필터 드로어 | 왼쪽에서 opacity·transform | 600 | ease | 동일 + 그룹 스태거 250/300/350/400 |
| 모바일 메뉴 | slideInLeft 300, 줄마다 fadeInRight 500 스태거 | 300/500 | ease | 동일 |
| 상품 탭 밑줄 | width | 300 | ease-line | 동일 |
| 담기 버튼 | 글자 opacity 500 → 로더 | 500 | ease | `.is-loading` 동일 |
| 상품 하단 고정 바 | transform translateY | 500 | ease | 동일 |

### 녹화 대조 결과 (종류 · 속성 · 지속 · 이징 서명, 로딩 쉬머·SVG 로더 제외)

| 페이지 | 원본 서명 | 첫 녹화 원본에만 | 최종 원본에만 | 최종 공통 |
|---|---:|---:|---:|---:|
| 홈 | 24종 | 12종 | 3종 | 20종 |
| 컬렉션 | 35종 | 26종(대부분 호버 중단 조각) | 0종 (호버 중단 조각만) | 17종 |
| 상품 | 18종 | 9종 | 0종 (호버 중단 조각 2건만) | 16종 |

비교 파일: `Desktop/모션비교-ELOREA.html` · `-collection.html` · `-product.html`, 폴더 안 `refs/motion-compare*.html`.

첫 녹화 뒤 고친 것: 헤더 1000ms 등장을 키프레임에서 **transition(opacity·transform 1000 ease)** 으로, 공지 800ms visibility, 이미지 틀 opacity 곡선을 ease-img 로, 배지 transform 800 ease 추가, 헤더 선 전환을 border-bottom-color 한 속성으로, 하단 고정 바 300→500, 티커 20s→19.95s, 푸터 링크·필터 그룹 fadeInUp 300 추가, 슬라이더 비활성 화살표 visibility 200 ease.

### 남은 원본 전용 서명 — 이유

| 서명 | 이유 |
|---|---|
| `visibility 200 ease` (슬라이더 이전 화살표) | 원본은 로드 직후 비활성 화살표를 숨기며 한 번 생긴다. 모작은 처음부터 disabled → visibility hidden 으로 시작해 전환이 생기지 않는다 |
| `transform 55 ease-in-out` (다음 화살표) | 200ms 전환이 녹화기 커서 이동으로 **도중에 뒤집힌 조각**. 모작도 같은 현상으로 84ms 조각이 생긴다 |
| `opacity 600 out-quart` (투명 헤더용 로고) | 원본은 흰 로고 이미지 두 장(기본·투명)을 겹쳐 교차. 모작 워드마크는 SVG 한 장이라 교차할 대상이 없다 |
| 컬렉션·상품의 짧은 opacity 조각들 | 호버 250/500ms 가 녹화기 커서 이동으로 중간에 끊긴 조각. 양쪽 모두 생기며 기본 곡선(250 ease-in-out, 500 ease, 800 ease-img)은 공통 |

### 모작에만 있는 서명

| 서명 | 이유 |
|---|---|
| `opacity 1600 ease` (`.hero__slide`) | **원본 히어로 영상 → 정지 사진 3장 크로스페이드.** 원본 첫 히어로는 자동 재생 영상(찻잔·향 연출). 영상은 가져오지 않는다(PROTOCOL 5절) |
| `opacity 600 ease` (`.pslides__s`) | 상품 상세 캠페인 슬라이드쇼(원본 flickity 점 슬라이드). 원본 녹화 구간에서 자동 넘김이 일어나지 않아 비교할 서명이 없다 |
| `transform 500 (.33,0,0,1)` (카드 퀵 애드) | 원본 `quick-add__button` 의 같은 전환(상태 채집 `refs/states/states2.json` qaAnims)이다. 녹화기 채집에서는 원본 쪽이 holder opacity 로만 잡혔다 |

### 옮기지 못한 것 · 다르게 한 것

- **영상**: 원본 히어로 6개 중 2개, 브랜드 캠페인 1개, 퀴즈 배경 1개가 영상. 모두 **정지 사진**(첫 히어로만 3장 크로스페이드 5초 간격)으로 대체.
- **탭 컬렉션·기프트 레일**: 원본은 셀 402px × 3.58장(오른쪽 끝 셀이 잘려 보임)을 flickity 로 끌어 넘긴다. 모작은 **4칸을 채워 한 칸씩 넘기는 방식**(`--per: 4`, 모바일 2)이다. 잘린 셀이 화면 밖으로 나가면 `verify-site` 가로 넘침 검사가 걸리기 때문. 넘길 때 새 칸은 30px 옆에서 450ms 페이드로 들어온다. 드래그 없음(화살표·키보드 ←→).
- **슬라이더 화살표**: 원본은 화면 밖(translate 100%)에서 들어온다. 같은 이유(가로 넘침)로 제자리 scale(.8)→1 + opacity.
- **이미지 틀 scale 1.05**: 원본은 처음부터 1.05 상태. 모작은 화면에 들어오는 순간 1.05 로 걸고 바로 풀어 준다(같은 800ms 전환). 화면 밖 사진이 커진 채로 가로 넘침에 걸리지 않게.
- **예측 검색**: 원본 `predictive-search` 는 헤드리스에서 결과가 뜨지 않아 모양을 못 봤다(`refs/states/search-predictive.jpg`). 컴포넌트 존재(`data-predictive-search-results`, `aria-owns`)는 확인. 모작은 상품 이름·설명 부분 일치로 최대 8건 + 전체 결과 링크.
- **Lenis·페이지 전환**: 원본에도 없음.

---

## 기능 목록 — 자체 헤드리스 Chrome(npx 캐시 Playwright)으로 눌러서 확인 75/75

| 기능 | 위치 | 어떻게 열리나 | 어떻게 닫히나 | 상태 표시 |
|---|---|---|---|---|
| **공지 슬라이더** | 최상단 | 6초 자동 · ‹ › | – | 비활성 슬라이드 `aria-hidden`·tabindex −1, 호버·포커스 정지 |
| **메가 메뉴** | 프래그런스(6열) · 브랜드(2열) | 호버 · 포커스 · ↓ | ESC(포커스 복귀) · 바깥 클릭 · 벗어남 | `aria-expanded`, 밑줄 |
| **투명 헤더** | 홈 | 스크롤 36px 넘으면 배경 | 맨 위 | `.is-solid` |
| **검색 팝다운** | 헤더 돋보기 | 클릭 | ×, ESC, 덮개 클릭 (포커스 복귀) | combobox `aria-expanded`, 결과 ↑↓, `aria-live` 개수 |
| 검색 결과 페이지 | `/search/?q=` | Enter | – | 필터 사이드바 · HIDE FILTERS 토글 · 정렬, h1 에 결과 수 |
| **카트 드로어** | 헤더 가방 · 담기 후 자동 | 클릭 | ×, ESC, 덮개 | 개수 뱃지, 무료 배송 막대(4만 원), 수량 ±, 삭제, 주문 메모, 빈 카트(HOME·CATALOG), `localStorage` |
| 카트 페이지 | `/cart/` | – | – | 같은 저장소, 결제 차단 문구 |
| **퀵 애드** | 카드 ‘장바구니 담기’(호버 시 등장) | 옵션 여러 개 → 오른쪽 퀵 애드 드로어 / 한 개 → 바로 담기 | ×, ESC, 덮개 | 옵션 라디오, 가격 즉시 갱신, 로더 |
| **증정 선택 모달** | 담은 뒤 소계 10만 · 20만 원 도달 | 자동 | ×, ESC, 바깥 → 다시 안 뜸 | 2mL / 10mL 6종 중 1종, ₩0 줄 추가, 소계가 내려가면 증정 줄 제거 |
| **필터 드로어** | 프래그런스 · 디스커버리 · 계열 · 전체 | FILTERS | ×, ESC, 덮개, VIEW N ITEMS | 재고 여부 · 가격(양손잡이 슬라이더 + 숫자) · 사이즈 · 향, 그룹 접기(`aria-expanded`), 즉시 적용, 개수, URL 반영·복원, 초기화 |
| **정렬** | 컬렉션 대부분 | SORT BY | 선택 · ESC · 바깥 | listbox `aria-selected`, ↑↓ Enter, 추천·판매량·가나다·역순·가격 2·오래된·최신 |
| 티커 | 프래그런스 컬렉션 | 자동 | – | 모션 감소 설정 시 정지 |
| **탭** | 홈 EXPLORE · 상품 정보 · 추천/최근 본 · 캠페인 챕터 | 클릭 · ←→ Home End | – | `aria-selected`, 로빙 tabindex |
| **레일 슬라이더** | 홈 탭 4개 · 기프트 3줄 | ‹ › · 카드에서 ←→ | – | 끝에서 disabled |
| **상품 옵션** | 상세 | 크기 라디오(이미지 칩) · 수량 select | – | 버튼 가격 = 단가 × 수량, 선택값 라벨 |
| 4+1 세트 | `/products/build-your-set/` | 5칸 select | – | 빈 칸 수 오류, 선택 향을 카트 줄에 기록 |
| 갤러리 | 상세 | ‹ › · 썸네일 · ←→ · 스와이프 | – | 썸네일 `aria-selected` |
| **하단 고정 바** | 상세 | 담기 버튼이 위로 사라지면 | 다시 보이면 | ‘옵션 선택’ → 폼으로 스크롤·포커스 |
| 점 슬라이드쇼 | 상세 캠페인 · 디스커버리 세트 계열 4개 | 5초 자동 · 점 | – | 호버 정지, 점 `aria-selected` |
| 최근 본 상품 | 상세 | 탭 | – | `localStorage` 8개 |
| **나의 향 찾기** | `/pages/fragrance-quiz/` | ‘나의 향 찾기’ | 뒤로(첫 질문에서 시작 화면) | 진행 막대, 선택 계열 아이콘 표시 |
| └ 7문항 | 나이(숫자 14~99) · 사용자(본인/선물 → 이후 질문 문구가 바뀜) · 사용 상황 · 계열(사진 막대) · 계절 · 좋아하는 재료 · 발향 거리 | Enter · 다음으로 | – | 빈값·범위·미선택 오류(`role=alert`) |
| └ 휴대폰 단계 | 결과 보기(형식 검증) · 건너뛰기 | – | – | 010 형식 오류 |
| └ 결과 | 계열 색 그라디언트 카드(영문명·노트·지속·발향), 결과 저장하기(PNG 내려받기), 다시 하기, 추천 향 3종 담기, 디스커버리 세트, 스토어 3곳 | – | – | 결과 카드로 포커스 |
| **모바일 메뉴** | ≤989 버거 | 탭 | ×, ESC, 덮개 | `aria-expanded`, **body overflow hidden**(배경 스크롤 0 확인), 하위 패널 ‹ 뒤로 |
| **폼 검증** | 뉴스레터 2곳(초대·푸터) | 제출 | – | 필드별 오류 `aria-invalid`·`aria-describedby`, 첫 오류 포커스, 통과해도 전송 안 함 |
| 맨 위로 | 700px 아래 | 클릭 | – | `#main` 포커스 |
| 모달·팝업 | 원본의 첫 방문 팝업 없음 | – | – | 만들지 않음 |
| 아코디언 | 없음 (원본 FAQ 는 펼친 질문·답 목록, `refs/states/pages/pages_faq-0.jpg`) | – | – | FAQ 는 `dl` 목록 |

## 섹션 순서 (홈)

| # | 섹션 | 원본 높이 | 모작 | 구성 |
|---:|---|---:|---:|---|
| 1 | 공지 바 | 36 | 36 | 두 문구 페이드 |
| 2 | 히어로 1 (NEW 챕터 3) | 864 | 864 | 영상 → 사진 3장 크로스페이드 |
| 3~7 | 히어로 2~6 + 흰 띠 10 | 822 ×5 | 822 ×5 | 챕터 2 · 챕터 1 · 디퓨저 · 베스트셀러 · 디스커버리 |
| 8 | EXPLORE (탭 4 + 레일) | 753 | 약 760 | 소개 셀 + 카드 |
| 9 | RTE (검정) | 393 | 약 390 | 제목 · 두 문단 · 더보기 |
| 10 | 구분선 + 스토어 3곳 | 41 + 652 | 41 + 약 560 | 사진 + 흰 버튼 |
| 11 | 약속 띠 | 230 | 167 | 4개 |
| 12 | 초대(뉴스레터) | 460 | 491 | 사진 반 · 폼 반 |
| 13 | 푸터 | 387 + 142 | 544 | 4열 + 사업자 정보 |

**문서 높이**(1440×900, 끝까지 스크롤 후): 홈 8118 → 7901 (97%) · 프래그런스 93% · 디스커버리 87% · 홈 향 98% · 핸드 91% · 기프트 96% · 상품 89% · 퀴즈 99% · 서울 스토어 96% · 카트 96% · FAQ 92% · 향 노트 99% · 컬렉션 96%. **±15% 기준 밖**: 디스커버리 세트 상세 79%(원본은 사진 섹션 5개 + 계열 4블록, 모작 사진 3 + 계열 4), 아카이브 81%, 캠페인 83%, 소개 83%(원본 소개 두 페이지를 하나로 합친 쪽), 검색 62%(결과 수에 따라 달라짐 — 원본 ‘hazy’ 23건, 모작 ‘한지’ 7건).

---

## 사진 (PROTOCOL 5절)

- 83장, 전부 `assets/photos/<슬롯>.jpg`, 출처는 `credits.json`(슬롯 · 사진 페이지 · 라이선스 · 검색어 · 명도).
- 출처: **Unsplash · Pixabay 72장, Pinterest 11장**(작약 3, 바다 1, 병·바이알 7). Pinterest 검색 결과의 절반 이상이 AI 생성 이미지(‘Meta AI’ 워터마크 2장 포함)·목업이라 스톡을 주로 썼다.
- 거른 것: **브랜드 라벨·로고가 보이는 향수병 전부**(Pinterest ‘perfume bottle’ 23장 중 21장, Unsplash 24장 중 17장 — 샤넬·디올·랑콤 등 병 모양만으로 브랜드가 드러나는 것 포함), AI 렌더·목업(유리병·드로퍼·디퓨저·선물 상자 풀 대부분), 유명인 얼굴 1장(초상 풀), 글자 간판이 찍힌 매장 사진.
- 명도: 흰 글자가 올라가는 히어로 자리는 명도 5~25(`hero-1a` 5 · `hero-3` 19 · `hero-4` 25 · `hero-5` 14 · `hero-6` 19), 하단 왼쪽에 55% 그라디언트 덧대기(원본 히어로는 영상 자체가 어두워 덧대기 없음 — 사진으로 바꾸며 대비 확보용).
- 원본 영상 → 사진: 홈 히어로 1(찻잔 영상 → 차 · 향 사진 3장 크로스페이드), 히어로 2(책 영상 → 어두운 리넨), 캠페인 영상 → 정지 사진, 퀴즈 배경 영상 → 검정 면 + 도형.

## 커밋 전 게이트 — 원본 구조로 남긴 항목 (근거)

`npx impeccable detect`(전 페이지 90개 HTML + site.css) 최종 **92건 = 2 규칙, 모두 원본 실측 구조**. 처음 2,739건(buried-raster 1,911 · cramped-padding 201 · tiny-text 189 · low-contrast 105 · undersized 91 · marquee 90 · clipped-overflow 90 · skipped-heading 37 · wide-tracking 18 외)에서 고쳐 내림. 설정 파일로 끄지 않았다.

| 규칙 | 건수 | 원본 근거 |
|---|---:|---|
| `marquee` (`.ticker__run`) | 90 (site.css 를 모든 페이지가 불러 페이지마다 1건) | 원본 컬렉션 페이지 티커 `ticker-rtl 19950ms linear` 무한 반복 — `refs/motion-origin-collection/motion.json`, `refs/states/states4.json` filterAn, 화면 `refs/states/pages/collections_eau-de-parfum-0.jpg` 하단 띠. 모작은 `prefers-reduced-motion` 에서 멈춤 |
| `layout-transition` width | 2 | 원본 내비 밑줄 `span.navtext::after width 0→100% 300ms cubic-bezier(.39,.575,.565,1)` (`refs/motion-origin/motion.json` at 11572), 탭 밑줄 같은 값 (`refs/origin.md` 호버 표 `li.tab-link` `::after width`). 1px 선 |

게이트 때문에 원본과 다르게 바꾼 것: 카트 뱃지 색(대비), 캠페인 띠 색(대비), 공지 10.5→11px, 16px eyebrow 자간 1.6px→0.04em, 스토어 영문 제목 자간 .12em→.04em, 탭 레일 3.58칸 → 4칸, 슬라이더 화살표 진입 방식, 원본 `kicker` 구조(OUR INGREDIENTS 위 라벨)를 h2 안 span 으로.

---

## 재현 난이도 메모

- 원본 퀴즈는 외부 앱(Tangent) iframe 없이 인라인 렌더. 문항·흐름·결과 구성을 전부 눌러 봐서 옮겼다(`refs/states/quiz/`, 선택 경로 2개: p0 본인·플로럴, p1 선물·우디).
- 증정 모달은 외부 프로모션 앱(10만·20만 원 도달 시). 가을 한정 프로모션이지만 캡처 시점 원본에 있는 기능이라 넣었다.
- 원본 이미지 다수가 lazy + shimmer 라 캡처에서 빈칸으로 찍힌 곳(스토어 3칸)이 있다. 스토어 칸 크기는 DOM 실측(652px 섹션)으로 잡았다.
