# SPEC — Cerebrium

## 출처

- **원본 URL**: https://cerebrium.ai/
- **어워드**: Awwwards **Site of the Day**
- **어워드 링크**: https://www.awwwards.com/sites/cerebrium
- **수상일**: 2026-09-10
- **업종**: 서버리스 GPU 인프라 (실시간 AI 추론)
- **모작 날짜**: 2026-09-28
- **모작 브랜드명**: `Axonfield` (가상). 원본 이름·로고·고객 로고·문구는 쓰지 않았다.

> 원본 스택 (실측): three.js WebGL2 + WebGPU 플래그(`html.webgpu-is-ready`), Swup 페이지 전환(`html.swup-enabled`, `transition-fade`/`transition-blur` 클래스),
> Lenis(`html.lenis`), Swiper(`--swiper-theme-color`), vanilla-cookieconsent(`#cc-main`), lottie_light(49KB), Tailwind v4 유틸리티, DatoCMS.
> 큰 스크립트: `BackgroundCanvas` 344KB.

---

## 사이트 구조

- **페이지 수 (원본)**: 크롤 24페이지 (`measure.json`) + 외부 도메인 3개(docs · dashboard · status)
- **재현 페이지**: **44페이지** — 모든 내비·푸터·카드 링크가 만든 페이지로 간다. `href="#"` 0개.
- **라우팅**: 원본 Swup(PJAX) → 모작은 일반 링크 + `@view-transition { navigation: auto }` (아래 모션 참조)

```
/                                  홈
├─ /use-cases/large-language-models   (드롭다운 Use cases)
├─ /use-cases/voice
├─ /use-cases/image-and-video
├─ /pricing
├─ /docs                           원본은 docs.cerebrium.ai (외부) → 문서 랜딩 스텁을 만들었다
├─ /blog                           필터 탭 5개 + 페이지네이션
│   ├─ /blog/<post> ×8             일반 글 (Tutorial / Announcement / Engineering)
│   └─ /blog/<case> ×7             케이스 스터디
├─ /about                          (Company)
├─ /resources                      페이지네이션
│   └─ /resources/<guide> ×12
├─ /contact                        폼
├─ /book-demo                      폼 (원본 "Book a demo" → 모작 "Request a demo")
├─ /brand-assets
├─ /privacy
├─ /terms-of-service
├─ /status                         원본은 status.cerebrium.ai (외부) → 스텁
├─ /login                          원본은 dashboard.cerebrium.ai/login (외부) → 폼 스텁
└─ /signup                         원본은 dashboard.cerebrium.ai/signup (외부) → 폼 스텁
```

- **헤더 ⋮⋮ 메뉴**: Book a demo · Contact us · 소셜 4개 (원본 실측: `/book-demo`, `/contact`, x/github/discord/linkedin)
- **소셜 링크**: 가상 브랜드라 각 플랫폼 루트 도메인으로. 아이콘은 플랫폼 로고가 아니라 직접 그린 일반 기호(×, `<>`, 말풍선, `in` 박스).

## 그리드

| 항목 | 원본 실측 | 모작 |
|---|---|---|
| 뷰포트 기준 콘텐츠 폭 | 1425 (스크롤바 15 제외) | 같음 |
| 좌우 여백 | **40px** (`x=40`, 우측 끝 1385) | `--margin: 40px` / 모바일 15px |
| 2단 그리드 | 오른쪽 단 시작 **x=722**, 단 폭 662, 거터 ≈21 | `grid-template-columns:1fr 1fr; column-gap:21px` |
| CSS 변수 | `--grid-columns:6` `--grid-gutter:15px` `--grid-margin:15px` (모바일 기준값) | 모바일 15/15 |
| 브레이크포인트 | 레이아웃 `md`=768, 헤더 내비 → 버거 전환 **1024 미만** (768·1024·1100에서 실측) | 767 / 1023 |
| 반경 | 패널 **32px**, 피처 비주얼 **15px**, 카드 **10px**, 버튼·내비·탭 **7px**, 쿠키 모달 8px | 같음 |
| 패널 겹침 | 흰/슬레이트 패널이 앞 섹션 위로 `-mt-15` = **-60px**, 모바일 -30px | 같음 |

## 타이포

| 역할 | 원본 | 대체 | 근거 |
|---|---|---|---|
| 디스플레이 | **ABC Favorit (Trial)** 300 | **Albert Sans 300** | 유료 서체. 가벼운 기하학 그로테스크 계열. 처음엔 Geist를 골랐으나 `impeccable detect`의 `overused-font`에 걸려 교체(내 흔적) |
| 본문 | **Suisse Int'l** 400/500 | **Hanken Grotesk** 400/500 | 유료. 네오그로테스크 대체 |
| 라벨 | **Suisse Int'l Mono** 400, 13px, uppercase, `-0.325px` | **IBM Plex Mono** 400 | 유료. 폭 넓은 모노 대체 |

실측 스케일 (1440 뷰포트, `getComputedStyle`):

| px | 굵기 | 행간 | 자간 | 서체 | 쓰이는 곳 |
|---:|---:|---:|---:|---|---|
| 86.09 | 300 | 86.09 (1.0) | -2.15 (-0.025em) | Favorit | 히어로 h1 |
| 72.61 | 300 | 76.24 (1.05) | -1.82 | Favorit | 섹션 h2 (`Built for teams`, `Powering…`) |
| 57.39 | 300 | 60.26 (1.05) | -2.87 (-0.05em) | Favorit | 보안 섹션 h2 |
| 43.91 | 300 | 50.5 (1.15) | -2.20 (-0.05em) | Favorit | 스티키 피처 목록 (비활성 `#c6cee0`) |
| 36.08 | 300/400 | 41.5 (1.15) | -0.90 | Favorit/Suisse | `Latest from our blog`, 푸터 CTA |
| 26.52 | 400 | 35.8 (1.35) | -0.66 | Suisse | h3, 케이스 카드 제목, 피처 리스트 |
| 21.26 | 400 | 28.7 (1.35) | -0.53 | Suisse | Built with 카드 제목 |
| 18 | 400 | 27 (1.5) | 0.18 | Suisse | 피처 본문 |
| 17 | 400 | 22.95 (1.35) | 0.17 | Suisse | 히어로 부제, 탭 라벨 |
| 16 | 500 | 24 | normal | Suisse | 기본 body |
| 15 | 400 | 19.5 | 0.15 | Suisse | `Read Case Study`, 푸터 제목 (opacity .65) |
| 13 | 400 | 13.9 (1.07) | -0.325 | Suisse Mono | 내비·버튼·라벨 (uppercase) |

- 유동 크기: 86.09/1440 = 5.978vw → `clamp(44px, 5.978vw, 86.09px)` 식으로 전부 옮겼다.
- **수정한 곳**: 모노 라벨 행간 1.07 → **1.3**, 푸터 CTA 1.15 → 1.3 (`tight-leading` 게이트. 한 줄 라벨이라 화면 차이는 박스 높이 3px 수준).

## 아이콘

- 원본: 인라인 SVG, **fill 기반** 26×26 viewBox (드롭다운 아이콘 `size-6`), 보안 목록·소셜 동일 계열.
- 모작: 전부 직접 그렸다. **stroke 1.5, 24 그리드, round cap**. 원본 path를 쓰지 않았다.
- 드롭다운 아이콘 타일 58×58 `#eef2f5` r7 (실측).

## 컬러

| 역할 | hex | 근거 (실측) |
|---|---|---|
| 페이지 바탕 (캔버스 뒤) | `#0b0610` 근처 | WebGL 배경, 좌상단이 가장 어둡다 |
| 차콜 (버튼 글자·터미널 배경) | **`#101421`** | `rgb(16,20,33)` |
| 네이비 900 (본문·제목) | **`#172b76`** | `rgb(23,43,118)` |
| 네이비 500 (보조·탭 활성) | **`#586490`** | `rgb(88,100,144)` |
| 슬레이트 50 (슬레이트 패널) | **`#eef2f5`** | 면적 3위 |
| 슬레이트 100 (케이스 카드) | `#dbe5ed` | |
| 슬레이트 200 / 300 / 400 | `#cfd7e7` / `#c6cee0` / `#b3c0d4` | 로그인 버튼·아이콘 타일·비활성 목록 |
| 핑크 500 (CTA) | **`#ff488b`** | `rgb(255,72,139)` |
| 핑크 600 (호버) | `#f6186a` | 버튼 내부 호버 레이어 |
| 그라디언트 강조어 | `linear-gradient(to right in oklab, #ff488b, #e33adb)` | h1 `scales` 단어 `background-clip:text` |
| 내비 유리 | `rgba(34,39,62,.45)` + blur | `c-header_nav_list` |
| 다크 버튼 | `oklab(0.194 0 -0.027 / .35)` ≈ `rgba(16,20,33,.35)` | `Book a demo` |
| 차트 범례 | P50 `#7a7fb2` · P90 `#90aade` · Max `#ff488b` (흰 글자) | 실측 |

## 간격

| 항목 | 원본 | 모작 |
|---|---|---|
| 패널 상하 패딩 | **82.09px** (`wrapper`) | 82px |
| 보안 다크 섹션 | pt **128.26** / pb **169.74** | 128 / 170 |
| 헤더 | top 14, 높이 54, 로고~내비 사이 플렉스 | 같음 |
| 히어로 | 높이 100vh(900), 제목 하단 82px 위 | 같음 |
| 피처 사이 | 비주얼 562 + 텍스트 → 다음 비주얼까지 약 104 | 104 |
| 카드 간격 | 15 (케이스 캐러셀) / 20 (블로그·예제) | 같음 |
| 반복 수치 | 7 · 10 · 15 · 20 · 32 · 54 · 82 · 104 · 128 | |

## 모션

`extract-origin.mjs` 실측 (`refs/origin.md`) + `record-motion.mjs` 녹화 (`refs/motion-origin*/motion.json`).
원본이 쓰는 이징은 둘이다. 이름은 원본 CSS 변수 그대로 옮겼다.

| 토큰 (모작) | 원본 변수 | 곡선 | 쓰는 곳 |
|---|---|---|---|
| `--ease` | `--ease` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | 로더·헤더·히어로 등장·라벨·드롭다운·내비 호버·탭 알약 배경 |
| `--ease-std` | `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 카드 등장(anim-scale)·카드 호버·기능 목록·스티키 목록 색·탭 글자색·커서 링·캔버스 페이드 |
| `--ease-out` | `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 콜드스타트 막대·탭 슬라이딩 표시 |
| (keyword) | – | `ease` 0.25 s | 쿠키 카드 (원본 vanilla-cookieconsent 기본값) |

지속시간 토큰: fast 0.2 s · 기본 0.3 s · slow 0.6 s · slower 0.8 s · slowest 1 s (원본 `--transition-duration-*`).

기술: **CSS 트랜지션 + 바닐라 JS(rAF) + WAAPI 1곳**. GSAP·Lenis 는 쓰지 않았다 — 원본 모션이 전부 CSS 트랜지션과 인라인 스타일 트윈이라 같은 수치를 CSS 로 그대로 걸 수 있었다.
`prefers-reduced-motion: reduce` 에서는 로더를 건너뛰고(is-ready 즉시), 제목 깜빡임·패럴랙스·캔버스 루프·JS 트윈을 멈추고 모든 등장 요소를 최종 상태로 둔다.

### WebGL · 캔버스 (원본 실측)

- 컨텍스트: `webgl2` 1개 + `2d` 2개. 드로우 콜 7,937회, 텍스처 26, 버퍼 11,989KB (캡처 구간).
- 잡힌 셰이더 4개 (`refs/shaders/`): `s00`/`s01` 은 three.js ShaderMaterial 로 **노이즈 그라디언트 배경**. `s02`/`s03` 는 풀스크린 쿼드. 리본 본체는 WebGPU 경로라 후킹에 안 잡혔다.
- 장면은 페이지·구간마다 다르다 (캔버스만 남기고 스크롤 위치별로 찍어 확인, 2026-09-28):
  - 홈 히어로: 오른쪽 아래에 모인 두꺼운 아치 리본. **스크롤하면 카메라가 리본 안으로 밀고 들어가며 기울어**, y≈1200 에서는 리본이 거의 세로 기둥으로 화면을 채운다.
  - 홈 보안~Built with: 유리 구 안에서 슬랩 더미가 천천히 돌고, 궤도 링. **구간에 들어올 때와 스크롤할 때 육각 격자가 분홍으로 번쩍였다 사라진다.**
  - 푸터: 히어로 첫 화면과 같은 리본 구도.
  - LLM: 오른쪽 아래 큰 와이어 구 + 떠 있는 판. 스크롤하면 위로 올라온다.
  - Voice: 스피커 콘 같은 동심원 링. 스크롤하면 카메라가 안으로 들어간다.
  - Image & Video: 검정 위 크고 작은 사각 블록. 스크롤하면 깊이별로 다른 속도로 올라간다.
  - Pricing: 히어로 오른쪽은 영상(`mux-video`) — 포스터가 0.5 s 에 걷히며 재생.
- **Click and hold**: 누르는 순간 UI·헤더가 사라지고 카메라가 리본 속으로 계속 파고든다. 흰 광선이 여러 줄로 늘고, 1.0 s 에 첫 단어가 글자 단위로 깜빡이며 생겼다가 1.9 s 뒤 깜빡이며 사라지고, 2.9 s 간격으로 다음 단어(가운데)가 뜬다. 떼면 UI 가 즉시 돌아오고 카메라는 약 1 s 에 원위치 (`refs/motion-origin-interact/hold/`).

### 모작의 대체 (직접 그림, 원본 코드·셰이더 미사용)

| 원본 | 모작 (`assets/bg.js`, Canvas 2D) |
|---|---|
| WebGPU 리본 + 스크롤 카메라 | 기울어진 타원 아치 5개(앞면 그라디언트·윗면 밝은 띠·안쪽 그림자), 봉우리 뒤는 가늘어지며 사라진다. 카메라 = 2D 변환(줌 0.92→2.3, 회전 0→-0.42 rad, 기준점 이동)을 블록 진행률 p 로 보간 |
| 로드 시 리본 등장 | 로더가 걷히면 리본이 아래에서 솟아오른다 (0.8 s ease-out, 리본마다 50 ms 차) + 캔버스 opacity 0→1 0.3 s `--ease-std` |
| 보안 구 | 반투명 구 + 슬랩 9장(시간·스크롤로 회전) + 궤도 링. 육각 격자는 오프스크린 캔버스에 그려 밝은 띠로 훑고 `lighter` 로 합성 — 장면 진입 시 1 로 켜져 초당 0.35 배로 감쇠, 스크롤 속도에 비례해 다시 켜짐 |
| LLM 구 / Voice 링 / Image 블록 | `globe` · `rings` · `blocks` 장면. 각각 p 로 상승·줌·깊이별 패럴랙스 |
| 누르고 있기 | 카메라가 스크롤 끝 구도로 곧장 넘어간 뒤 초당 0.45 씩 계속 파고듦, 광선 1→4줄·속도 ×6, 단어 `Boot`(왼쪽)/`Burst`(가운데)/`Worldwide`(오른쪽)를 글자 단위로 깜빡여 1.0 s + 2.9 s·i 에 띄움 |
| 노이즈 그라디언트 셰이더 | 방사형 그라디언트 + 160px 노이즈 타일 |
| 모든 장면 | 60 fps 상한 (vsync 없는 환경에서 입력 처리를 막지 않도록) |

## 모션 타임라인

원본을 켜지는 순간부터 녹화해(`record-motion.mjs`, 정지 24 fps · 모션 구간 최대 60 fps, 실제 GPU) 단계별로 나눠 읽었다.
시각은 네비게이션 시작 기준 ms. 녹화 폴더: 홈 `refs/motion-origin/` · 가격 `refs/motion-origin-pricing/` · Voice `refs/motion-origin-voice/` · 상호작용(드롭다운·탭·호버·스크롤업·누르고 있기) `refs/motion-origin-interact/`. 모작은 같은 이름의 `motion-mine*`.

### 1. 로드 → 로더 → 히어로 등장 (홈)

| 시각 | 원본 요소 | 트리거 | 속성 from → to | 지속 · 지연 | 이징 | 모작 |
|---|---|---|---|---|---|---|
| 320 | 로더 로고 바 4개 | 로드 | translateX 0 → ∓5px → 0 (반복) | 1 s · 0 / 0.1 s | ease-in-out (키프레임) | 같은 키프레임 이름·수치. 로더 마크에 가운데 짧은 바를 더해 4개 |
| 440 | 로더 로고 | 로드 | opacity 0→1, translateY 25px → 0 | 0.3 s | `--ease-std` (키프레임) | `overlay-anim-in` 동일 |
| 845 | 탭 3곳 초기 선택 | 스크립트 초기화 | 글자색 navy→white / 알약 배경 slate-200→navy-500 | 0.2 s | `--ease-std` / `--ease` | 초기 선택을 스크립트가 다음 프레임에 다시 걸어 같은 전환이 일어난다 |
| 3845 | 로더 | 장면 준비 완료 | opacity 1→0, visibility 0.2 s 뒤 hidden | 0.2 s | `--ease` | 최소 대기 홈 3.8 s · 가격 3.0 s · 그 외 1.9 s (원본 실측값), 폰트 로드와 둘 다 끝나면. 세션 첫 로드만 |
| 3845 | 로더 로고 | 〃 | opacity 1→0, translateY 0 → -25px | 0.3 s | `--ease-std` | `overlay-anim-out` 동일 |
| 3845 | 헤더 | 〃 (`is-ready`) | translate3d(0,-100%,0) → 0 | 0.3 s | `--ease` | 동일 |
| 3845 | 배경 캔버스 | 〃 | opacity 0→1 | 0.3 s | `--ease-std` | 동일 + 리본이 아래에서 솟음 (0.8 s) |
| 3845 | 히어로 설명 · 버튼 2개 | 〃 | opacity 0→1, translateY 40px → 0 | 0.8 s · 0 / 0.2 / 0.3 s | `--ease` | 동일 (버튼 각각 따로) |
| 3845 | 히어로 아래 가로선 | 〃 | scaleX 0→1 (왼쪽 기준) | 1 s | `--ease` | `.logos::before` / 유즈케이스 `.top-rule::after` |
| 3829 | h1 단어 7개 (JS 인라인) | 〃 | opacity 0→1 | 단어당 ≈110 ms, 무작위 순서 33 ms 간격, 끝나면 전체 0.85 / 0.15 / 0.8 / 1 을 17 ms씩 깜빡 | – (rAF 트윈) | 프레임별 opacity 샘플(`words.json`)대로 재현. 단어 트윈은 `--ease-std` 곡선 |
| 3942 | 쿠키 카드 | 로더 후 +0.1 s | opacity 0→1, translateY 25.6px → 0, visibility | 0.25 s | `ease` | 동일 |

### 2. 스크롤 (홈 → 푸터)

| 원본 요소 | 트리거 | 속성 | 지속 · 지연 | 이징 | 모작 |
|---|---|---|---|---|---|
| 배경 카메라 (리본) | 히어로 블록 스크롤 진행률 | 줌·기울기 (스크롤 연동) | 연속 | – | `ribCam(p)` — p = -top / 블록 높이 |
| 섹션 라벨 점 (`c-label_circle`) | 20% 들어오면 | clip-path inset(100% round 7px) → inset(0) | 0.2 s · 0.3 s | `--ease` | `.eyebrow::before` 동일 |
| 섹션 라벨 글자 | 〃 | opacity 0→1, translateX 10px → 0 | 0.3 s · 0.3 s | `--ease` | 글자를 `span.eb-t` 로 감싸 동일 |
| 섹션 제목 단어 (JS) | 들어오면 | opacity 깜빡임 (위 1 과 같은 방식) | 0.35~0.65 s | – | 동일 함수 |
| 스티키 기능 목록 활성 | 스크롤 스파이 | color slate-300 ↔ navy-900 | 0.2 s | `--ease-std` | 0.3 s `--ease` → 0.2 s `--ease-std` 로 고침 |
| 콜드스타트 막대 4개 | 카드가 들어올 때 · 탭 바꿀 때 | 0 → 목표 길이, **같은 속도** (95% 에 4 s) | 250 / 1662 / 2897 / 4000 ms | `--ease-out` | **width 대신 `transform: scaleX`**. 지속 = max(250, 길이%×40 ms) → 모작 데이터(3·26·45·100%)로 250 / 1040 / 1800 / 4000 ms |
| 피처 이미지 (`c-inner-parallax`, JS) | 화면 통과 | translateY -90 → +90px | 연속 | – | `.feat-vis > .art`, 카드·글 이미지(`.post-img .art` 등)에 같은 수치, 이미지를 위아래 96px 크게 |
| 터미널 21줄 (JS) | 들어올 때마다 다시 | opacity 0 → 1 한 줄씩 | 84 ms 간격 | – | 180 ms·1회 → 84 ms·재진입마다 재생 |
| Built with 카드 · 사례 카드 · 블로그 카드 (`anim-scale`) | 들어오면 | scale(0.95) translateY(20px) → none | 0.4 s | `--ease-std` | `.ex` `.case` `.post` (+ 가격 FAQ) |
| 기능 14행 (`c-feature-list_item`) | 목록이 들어오면 | opacity 0→1, translateX 10px → 0 | 0.4 s | `--ease-std` | `.flist li` |
| 로고 레일 (JS) | 상시 | translate3d x | ≈30 px/s | linear | **손대지 않음** (사용자 결정 대기) |
| 인터랙티브 점 (`c-interactive-dots`) | 무작위 · 커서 | 34px 분홍 사각 scale 0 ↔ 1, screen 블렌드 0.85 | 켜짐 0.2 s · 꺼짐 0.4 s | `--ease` | 20px opacity → 34px scale, 켜짐 유지 0.45 s |
| 보안 구 육각 격자 | 구간 진입 · 스크롤 | 밝기 펄스 | ≈1 s 감쇠 | – | 캔버스 `glow` |
| 스크롤 업 고정 헤더 (`c-header.is-fixed`) | 위로 스크롤 (y > 300) | translateY(-100%) → 0, 내리면 되돌림 + visibility 0.2 s 뒤 | 0.2 s | `--ease` | 새로 구현. 고정 상태에선 로고 글자 숨김(원본 동일) |

### 3. 호버 · 클릭 (`refs/motion-origin-interact/interact.json`)

| 원본 요소 | 속성 | 지속 · 지연 | 이징 | 모작 |
|---|---|---|---|---|
| 내비 링크 호버 배경 | ::before opacity 0 → 0.15, scale(0.9, 0.7) → 1, 반경 4px | 0.2 s | `--ease` | background-color 전환 → 원본과 같은 ::before 층 |
| 드롭다운 패널 | clip-path inset(10% round 7px) → inset(0), opacity 0→1 · 닫힘 visibility 0.2 s 뒤 | 0.3 s | `--ease` | translateY(-6px) 0.2 s → 원본 수치로 교체 |
| 드롭다운 항목 | opacity 0→1, translate(10px,10px) → 0 | 0.2 s · 0 / 75 / 150 / 225 ms | `--ease` | 동일 |
| 드롭다운 하단 버튼 | translateY(100% + 10px) → 0 | 0.2 s | `--ease` | 동일 |
| 드롭다운 소셜 줄 | opacity, translateY 20px → 0 | 0.2 s | `--ease` | 동일 |
| 드롭다운 링크 호버 | ::before slate-50 opacity·scale(0.9,0.7); 아이콘 칸 ::before charcoal, 아이콘 흰색 | 0.2 s | `--ease` | 동일 (아이콘 칸 배경색 전환 대체) |
| 메뉴 열림 오버레이 | 검정 opacity 0 → 0.5 | 0.3 s | `--ease` | `.hdr::before` |
| 메뉴 열림 본문 블러 | filter none → blur(10px) | 0.6 s | `--ease` | 0.3 s + opacity 0.85 → 0.6 s 블러만 |
| 탭 클릭 | 슬라이딩 표시 left/width · 글자색 · 알약 배경색 | 0.2 s | `--ease-out` · `--ease-std` · `--ease` | 슬라이딩 표시는 transform(0.35 s → 0.2 s `--ease-out`), 탭마다 ::before 알약 추가 |
| 탭 패널 교체 (JS) | 새 패널 translateX 5% → 0, opacity 0→1 | ≈215 ms | – | WAAPI 215 ms `--ease-out` (나가는 패널 -5% 는 생략, 아래) |
| Built with 카드 호버 | 배경 slate-50 → white, 아이콘 칸 scale 1.02, 화살표 opacity 0→1 · 4px → 0 | 0.2 s | `--ease-std` | translateY(-1px) 대신 동일 수치. 화살표는 CSS mask 로 추가 |
| 사례 카드 호버 | 배경층 scale 1.01, 제목 -4px, 링크 (-4px, 4px), 태그 (-4px,-4px), 화살표 -4px → (4px, 4px) | 0.2 s | `--ease-std` | 배경색 전환 → 동일 수치 |
| 블로그 카드 호버 | 이미지 scale 1.05 (0.6 s), 메타 글자색, 화살표 4px → 0 | 0.6 / 0.2 s | `--ease-std` | 카드 scale(1.01) → 동일 수치 |
| 기능 행 호버 | 흰 알약 opacity·scale(0.95, 0.7); 라벨 +15px, 화살표 -15px; 위아래 구분선 opacity 0 · scaleX 0.95 | 0.2 s | `--ease-std` | 화살표 4px 이동 → 동일 수치 (라벨 `span.fl-l`) |
| 히어로 커서 | opacity 0.2 s `--ease`; 링 rotate(-90deg) scale 0.72 → 1 (0.35 s, 0.1 s 뒤), 숨길 때 0.82, 누를 때 0.75 | | `--ease-std` | 0.3 s opacity → 동일 수치 |
| 누르고 있기 | 위 "Click and hold" | | | 위 대체 표 |
| 내비·모노 버튼 텍스트 스크램블 (`c-scramble-text`) | 글자 무작위 → 원문, ≈350 ms | | – | 직접 구현 (기존 유지) |
| 페이지 전환 (Swup `overlay-anim-in/out`) | 오버레이 로고 25px 상승·하강, 본문 페이드/블러 | 0.3 s | `--ease-std` | View Transitions: 나가는 화면 -25px·blur, 들어오는 화면 +25px (기존 유지) |

### 4. 가격 · Voice

| 페이지 | 원본 | 모작 |
|---|---|---|
| 가격 | 설명 0 s · 버튼 0.2/0.3 s · 가격표 0.2 s · 단위 토글 0.3 s 지연으로 40px 상승 (0.8 s `--ease`) | 같은 지연으로 `data-fade` / `data-fade="2"` / `data-fade="3"` |
| 가격 | 히어로 영상 포스터 opacity 1→0, 영상 0→1 (0.5 s `--ease-std`) | 오른쪽 단 위의 어두운 덮개가 0.5 s 에 걷혀 라이브 캔버스를 드러낸다 |
| 가격 | FAQ 5개 `anim-scale` | `.faq details` |
| Voice | 음성 막대 36개가 매 프레임 scaleY (JS) | `.bars i` 64개를 사인 합성으로 매 프레임 scaleY (CSS 반복 애니메이션 대체) |
| Voice | 파트너 로고 세로 컨베이어, 가운데 1 · 가장자리 0.7 (JS) | `.conv` — 복제 후 무한 이동, 거리별 scale 1 → 0.7 |

### 녹화 대조 결과 (2026-09-28, 같은 도구·같은 조건)

| | 원본 홈 | 모작 홈 전 | 모작 홈 후 |
|---|---:|---:|---:|
| 애니메이션·트랜지션 | 191 | 52 | 141 |
| `cubic-bezier(0.645,0.045,0.355,1)` | 97 | 27 | 36 |
| `cubic-bezier(0.4,0,0.2,1)` | 80 | **0** | 89 |
| `cubic-bezier(0,0,0.2,1)` | 4 | 0 | 5 |
| JS 인라인으로 움직인 요소 | 60 | 2 | 35 |

비교 파일: `Desktop/모션비교-CEREBRIUM.html` (홈) · `-pricing.html` · `-voice.html`.

### 남은 빨간 줄 — 이유

| 페이지 | 원본에만 있는 서명 | 이유 |
|---|---|---|
| 홈 | `width` 250 / 1662 / 2897 / 4000 ms `--ease-out` (콜드스타트 막대) | 같은 모션을 **transform: scaleX** 로 옮겼다 (레이아웃 속성 애니메이션 금지 규칙). 곡선·속도 규칙은 같고, 지속시간은 막대 길이에서 나오므로 모작 데이터 기준 250 / 1040 / 1800 / 4000 ms 가 된다 |
| 홈 | 182 · 191 · 136 · 26 · 18 ms 짜리 `--ease-std` 전환 11건 | **호버가 중간에 뒤집힌 흔적**이다. 녹화기가 스크롤 동안 커서를 화면 한가운데 두어, 카드·행 위를 지나갈 때 0.2 s 호버 전환이 도중에 역재생되며 남은 시간만 기록됐다. 기본 서명(0.2 s / 0.6 s)은 양쪽에 다 있고, 모작도 같은 현상으로 101~123 ms 파란 줄이 생긴다 |
| Voice | `color` 172 ms `--ease-std` | 위와 같은 도중 역재생 (스티키 목록 색) |
| 가격 | 없음 | – |

### 옮기지 못한 것 · 다르게 한 것

- **나가는 탭 패널의 -5% 이동**: 원본은 두 패널을 겹쳐 두고 교차 이동한다. 모작 패널은 흐름 안에 있어 겹치려면 레이아웃을 바꿔야 해 들어오는 쪽만 옮겼다.
- **Lenis 관성 스크롤**: 생략(네이티브). 그래서 같은 휠 입력에서 원본보다 스크롤 위치가 빨리 바뀌고, 비교 파일의 스크롤 칸은 위치 기준으로만 맞는다.
- **3D 장면**: 셰이더·에셋은 쓰지 않고 Canvas 2D 로 새로 그렸다. 구도·카메라 방향·타이밍은 스크린샷과 녹화로 맞췄지만 조명·깊이감은 원본보다 평평하다. 누르고 있기 해제 때의 색수차 가장자리는 없다.
- **가격 히어로 영상**: 영상 자체가 없어 포스터가 걷히는 모션만 옮겼다.
- **원본 스크롤 녹화의 인라인 요소 60개** 중 로고 레일(1, 손대지 않음)·영상 관련·쿠키 스크립트 내부 요소는 대응물이 없다.

## 기능 목록 — 전부 구현, Playwright로 눌러서 확인

| 기능 | 위치 | 어떻게 열리나 | 어떻게 닫히나 | 상태 표시 |
|---|---|---|---|---|
| **드롭다운 ×2** | 헤더 `Use cases`, `⋮⋮` | 호버 또는 클릭, `↓` 키 (첫 링크로 포커스) | 포인터 이탈, 바깥 클릭, `ESC`(버튼으로 포커스 복귀), 포커스 이탈 | `aria-expanded`, 본문 블러 |
| **모바일 메뉴** | ≤1023px `MENU` 버튼 | 클릭 | 다시 클릭(`CLOSE`), `ESC`, 1024 이상 리사이즈 | `aria-expanded`, 라벨 MENU↔CLOSE, **html overflow hidden** |
| 모바일 아코디언 | 메뉴 안 `Use cases` | `+` 클릭 | 다시 클릭 | `aria-expanded`, `+`→`×` |
| **쿠키 배너** | 첫 방문 우하단 | 자동 (1.1s) | Accept all / Reject all / × / `ESC` | 선택은 `localStorage` (try/catch) |
| **쿠키 설정 모달** | 배너 `Settings`, 푸터 `Cookie preferences` | 클릭 | ×, 오버레이 클릭, `ESC`, Accept/Decline/Save | 포커스 트랩, 스크롤 잠금, 카테고리 펼침(`aria-expanded`), 토글 |
| **탭** | 홈 콜드스타트(2), 관측 차트(3), Built with(3) / 유즈케이스 배칭(3) / 가격 단위(2) / 모바일 플랜(3) / 블로그 필터(5) | 클릭, `←` `→` `Home` `End` | – | `aria-selected`, 로빙 tabindex, 슬라이딩 인디케이터 |
| **캐러셀** | 홈 Industries, 유즈케이스 Teams | ← → 버튼, 마우스 드래그, 스크롤 스냅 | – | 양 끝에서 버튼 `disabled` |
| **스티키 피처 목록** | 홈·유즈케이스 | 스크롤 / 클릭하면 해당 카드로 | – | 활성 항목 네이비, `aria-current` |
| **Click and hold** | 홈 히어로 (정밀 포인터만) | 마우스 누르기 | 떼기 / 이탈 | 원형 커서 진행 링 |
| **가격 단위 토글** | 가격 히어로 | Per second / Per hour | – | 11개 행의 값·단위가 바뀜 |
| **가격 계산기** | 가격 | 슬라이더 4개(요청 수는 로그 스케일 1~5,000,000), 런타임 ▲▼ + 입력, 하드웨어 select | – | 월 추정·항목별 초당 비용 실시간, CPU only면 GPU 슬라이더 비활성 |
| **FAQ 아코디언** | 가격 | `<details>` 클릭·Enter | 다시 클릭 | `+`→`×` |
| **필터 + 페이지네이션** | 블로그(9개/쪽), 리소스(9개/쪽) | 탭·번호·이전/다음 | – | 결과 없음 문구, 양 끝 disabled, `aria-current` |
| **폼 ×4** | contact, book-demo, login, signup | 입력 | – | 제출 항상 차단, 필드별 오류(`aria-invalid`, `aria-describedby`), 요약 상태 문구, 첫 오류로 포커스 |
| 이메일 복사 | about 연락 카드 | 클릭 | 1.6s 후 | `Copied` |
| 비디오 모달 | 모바일 히어로 ▶, about 필름 | 클릭 | ×, 오버레이, `ESC` | 스크롤 잠금, 포커스 복귀 |
| 브랜드 에셋 다운로드 | brand-assets | 클릭 | – | SVG 파일 저장 (Blob) |
| 필터/정렬 | – | – | – | 블로그 필터 외 없음 |

원본과 다른 점:
- 블로그 필터: 원본은 `/blog/category/<x>` 로 **페이지 이동**. 모작은 같은 페이지에서 목록을 거른다.
- 원본 드롭다운은 `aria-expanded` 속성이 없다(실측 `null`). 모작은 넣었다.

## 섹션 순서 (홈)

| # | 섹션 | 원본 높이 | 모작 높이 | 구성 |
|---:|---|---:|---:|---|
| 1 | 히어로 블록 (다크, 리본) | 1545 | 1546 | 히어로 900 + 로고 레일 216 + 인터랙티브 점 격자 430 |
| 2 | 흰 패널 | 3679 | 3563 | 인트로 2단 + 스티키 목록 / 피처 4개 (콜드스타트 탭·맵·터미널·차트) |
| 3 | 다크 섹션 (구체) | 2342 | 2319 | 보안 2단 + Built with 탭 + 예제 카드 4 |
| 4 | 슬레이트 패널 | 2593 | 2573 | Industries 캐러셀 7장 + Features 14행 + 블로그 3장 |
| 5 | 푸터 (리본) | 891 | ≈841 | 소셜 / 링크 2단 / CTA / 하단 바 |
| | **합계** | **10,870** | **10,690 (98.3%)** | 모작 `extract-origin` 실측, `refs/mine/origin-mine.md` |

### 페이지별 높이 (1440)

| 페이지 | 원본 | 모작 | 비율 |
|---|---:|---:|---:|
| `/` | 10,870 | 10,690 | 98% |
| `/pricing` | 5,974 | 5,991 | 100% |
| `/use-cases/large-language-models` | 7,553 | 7,055 | 93% |
| `/use-cases/voice` | 7,376 | 7,029 | 95% |
| `/use-cases/image-and-video` | 7,138 | 6,843 | 96% |
| `/about` | 6,320 | 5,715 | 90% |
| `/blog` | 5,018 | 5,041 | 100% |
| `/book-demo` | 1,793 | 1,951 | 109% |
| 블로그 글 | 5,454~9,889 | 4,578~4,679 | 본문 분량이 짧다 (더미) |
| `/privacy` | 19,618 | 짧음 | 법률 원문 분량을 재현하지 않음 |

---

## impeccable detect — 남은 2건은 원본 구조 (설정으로 숨기지 않음)

`.impeccable/config.json` 은 건드리지 않았다. 처음 536건 → 내 흔적을 고쳐 9건 → **대비 7건은 원본과 달라지더라도 고쳤다**(CHECKLIST 접근성 최소선 4.5:1 이 원본 충실도보다 우선). 남은 2건은 원본 구조다.

### 원본에서 벗어나 고친 대비 7건

| 자리 | 원본 | 모작 | 대비 |
|---|---|---|---|
| 홈 터미널 성공 줄 ×4 | 글자 `#ff488b` on `#e7e8e9` (2.6:1) | 글자 `#c2185b` | 4.79:1 |
| 홈 차트 범례 P50 · P90 · Max | 흰 글자 on `#7a7fb2` · `#90aade` · `#ff488b` (3.8 · 2.3 · 3.2:1) | 글자 `#101421`, 칩 색 유지 | 4.81 · 7.86 · 5.73:1 |

범례 글자색은 홈 칩에만 걸었다. 같은 `.legend` 를 쓰는 이미지·영상 페이지는 칩이 어두워 흰 글자가 맞다.

### 남은 2건 — 원본 구조 (2026-09-28 사용자 확인: 원본 그대로 사용)

> 사용자: **"cerebrium 여기사이트는 괜찮네 이걸로 사용 ㄱㄱ"**

| 파일 | 규칙 | 원본 근거 (실측) |
|---|---|---|
| `index.html` | marquee | 원본 `c-rail`: `.c-rail_pattern` 2벌 복제, `translate3d` 가 2초에 60px 이동 (x -177.1 → -237.1 실측). 모작은 홈에만, 호버 정지, reduced-motion 에서 정지 |
| `blog/index.html` | flat-type-hierarchy (h1 16 / h2 15) | 원본 블로그 h1은 `sr-only` 16px `Engineering Blog`, 보이는 h2는 푸터 제목 15px뿐 (실측) |

직접 고친 내 흔적 (요약): Geist(overused-font) → Albert Sans · 패널/내비/쿠키 카테고리/모달 패딩 · body `overflow-x:clip` 제거 · 모노 행간 · 탭 인디케이터와 막대를 `width` 전환 → `transform` · 쿠키 × 버튼을 제목 뒤로 · 긴 대문자 라벨 줄임 · 아바타 그라디언트 제거 · 직접 만든 범례 색(`Requests`)을 `#586490` 으로.

---

## 재현 난이도 메모

1. **배경이 전부 WebGL(WebGPU)**. 셰이더로 잡힌 건 배경 그라디언트뿐이라 리본 형태는 화면으로 읽어 다시 그렸다.
2. **고정 캔버스 위로 흰/슬레이트 패널이 32px 모서리로 올라온다.** 캔버스는 하나, 장면은 스크롤 위치로 바뀐다.
3. **서체 3종 모두 유료.** 디스플레이 300 굵기의 인상이 핵심.
4. 스티키 피처 목록 + 스크롤 스파이, 가격 계산기, 쿠키 모달 2단 — 기능이 많다.
5. 스크롤 방식: 원본은 Lenis 클래스가 있으나 `looksHijacked` 는 네이티브로 판정. 모작은 **네이티브 스크롤** (Lenis 생략).

## 생략·대체 (숨기지 않고 적는다)

| 원본 | 처리 |
|---|---|
| three.js/WebGPU 리본·구체 | Canvas 2D 직접 구현으로 대체 (위 표) |
| Lenis 관성 스크롤 | **생략**. 네이티브 스크롤 |
| Swup PJAX 전환 | View Transitions API 로 대체 (크로스도큐먼트, 지원 브라우저에서만) |
| lottie 애니메이션 (피처 비주얼 큐브 등) | 정적 SVG (직접 그린 아이소메트릭 큐브, 핑크 큐브 1개) |
| 모바일 `Play video` 실제 영상 | 모달은 열리지만 안은 플레이스홀더 |
| 고객 로고·사진 | 가상 이름 + 기하 도형 마크, 사진 자리는 그라디언트 블록 |
| 외부 도메인 (docs / dashboard / status) | 사이트 안 스텁 페이지 |
| 블로그 카테고리 URL | 클라이언트 필터 |
| reCAPTCHA | 없음. 폼은 전송하지 않는다 |
