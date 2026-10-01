# SPEC — STUDIO OFF-BEAT (오프비트)

## 출처

- **원본 URL**: https://www.offbeat.kr/
- **어워드**: Awwwards **Honorable Mention**
- **어워드 링크**: https://www.awwwards.com/sites/studio-off-beat (응답 200, 페이지에 `Honorable Mention - Mar 18, 2026` 확인)
- **수상일**: 2026-03-18
- **업종**: 사진·영상 스튜디오 (포트레이트 · 브랜드 프로젝트 · 공연 무대). Webflow + GSAP 3.13(ScrollTrigger · SplitText · Flip) + Lenis + barba, finsweet CMS 필터
- **모작 날짜**: 2026-10-01
- **모작 브랜드명**: `HALF-REST / 하프레스트` (가상). 원본의 은유 ‘정박/엇박(OFF-BEAT)’을 ‘쉼표(반쉼표, half rest)’로 바꿨다. 웹 검색으로 같은 이름의 사진 스튜디오 없음 확인. 워드마크는 Jost 글자로 직접 조판, 로고 이미지·원본 문구·사진은 쓰지 않았다.

### 3D · WebGL 판정 (사용자 규칙: 3D 모델 주도 사이트 모작 금지)

| 확인 | 결과 | 근거 |
|---|---|---|
| 홈 캔버스·WebGL | 없음 | `refs/origin.md` “캔버스도 WebGL 도 쓰지 않는다” |
| 영상(`video`, mp4) | 없음 | `refs/origin.json` 문자열 검색 0건 |
| 목록 페이지(Portrait·Project·Stage·Current) | 고정 캔버스 1개(`z-index:-1`, 1440×900), WebGL2 | `getContext` 후킹 결과 `webgl2`, 셰이더는 **전체 화면 사각형 하나 + 값 노이즈 임계값**(검정 ↔ 회색 얼룩 + 그레인). 3D 모델·조명·카메라 없음 |
| 화면을 주도하는 것 | 사진 · 대형 타이포 · 스크롤 연동 레이아웃 모션 | 캡처 `refs/home/series`, `refs/studio/series` |

→ **3D 모델·렌더 영상 주도 아님. WebGL은 목록 페이지 배경 효과뿐** → 1순위 대상으로 확정, 2순위(Deepondé)로 바꾸지 않았다.
배경 효과 대체: **캔버스 2D**로 저해상도(1/12) 값 노이즈를 매 프레임 계산해 확대(부드러운 경계) + 그레인 캔버스 타일을 매 프레임 이동. 색은 원본 화면에서 잰 `#080808` ↔ `#4a4a4a`.

---

## 사이트 구조

- **원본**: 홈 · Studio · Portrait(목록 60) · Project(목록 약 210) · Stage(7) · Current(3) · Contact + 상세 템플릿 3종(`/portrait/*`, `/works/*`, `/interviews/*`). barba 로 페이지 전환.
- **재현**: `node build.mjs` 가 `data.mjs` 로 생성. 상대 경로 + `index.html` 이라 `file://` 더블클릭으로도 이어진다. `href="#"` 0.

```
/                         홈 (인트로 → 히어로 고정 → 식물 시차 → About → Featured Portraits/Projects/Stages → 푸터)
├─ studio/                Studio (히어로 · About · Attitude · 사진 모음 · Work Process · Team · 마퀴 · FAQ 아코디언)
├─ portrait/              Portrait 목록 44 · 필터(year · type · beat) · 카드 호버 사진 교체
│   └─ <slug>/ × 44        포트레이트 상세 (A-cut 8 + Behind the Scenes 7 썸네일 · 메인 뷰어 · 라이트박스)
├─ project/               Project 목록 88 · 필터(year · category)
├─ stage/                 Stage 목록 7 (포스터 카드)
│   └─ (works/<slug>/)     Project 88 + Stage 7 = 작업 상세 95
├─ current/               Current 3 (인터뷰 입구)
│   └─ interviews/<slug>/ × 3   인터뷰 (제목 · 사진 · Q/A)
└─ contact/               Contact (문구 · 사진 · 폼 4칸 · 검증)
```

원본 대비:
- 목록 수를 줄였다: Portrait 60 → 44, Project 약 210 → 88. 사진을 얼굴 없는 컷으로만 골라 쓸 수 있는 장수가 162장이고, 같은 사진을 목록 표지로 두 번 쓰지 않는 선에서 최대로 채웠다. 페이지 수 **149**(홈 1 · 목록·소개 6 · 포트레이트 상세 44 · 작업 상세 95 · 인터뷰 3).
- 외부 링크: 원본 ‘PORTRAIT 예약 가이드’·‘STAGE 협업 가이드’(구글 폼) → **모작 Contact 페이지**로 보낸다(가짜 폼 주소를 만들지 않는다). SNS 3개는 각 서비스 첫 화면(`instagram.com`, `youtube.com`)으로, 원본 ‘by SATZ’(제작사 크레딧) 자리는 ‘by WEBLAB’ → 홈.

## 그리드

| 항목 | 원본 실측 (1440) | 모작 |
|---|---|---|
| 컬럼 | 12 (`data-grid-hud-count=12`) | 12 |
| 좌우 여백 · 거터 | 26 · 26 (x=26 / 379 / 733 / 1086 = 3칸 간격 353) | `--pad: clamp(16px,1.806vw,32px)` 같은 값을 거터로 |
| 내비 높이 | 119 | 119 |
| 목록 카드 | Portrait span-3(4열) · Project span-6(2열) · Stage span-4(3열) · Current span-6 | 동일 |
| 상세 | 썸네일·정보 col 1–5, 뷰어 col 7–12 (681) | 동일 |
| 인터뷰 본문 | col 5–8 (x=497 w445) | 동일 |
| Contact | 제목 col 4 (x=379), 폼 col 6–9 (x=615 w445) | 동일 |
| 브레이크포인트 | 767 (모바일 4열 `m-span-*`, 버거 메뉴) | 767 |

## 타이포

| 역할 | 원본 | 모작 |
|---|---|---|
| 영문 제목·내비·CTA | Inter | Inter (Google Fonts 400/500/600/700) |
| 한글 본문 | Pretendard | Pretendard 1.3.9 (jsdelivr) |
| FEATURED 대형 제목·Q/A 라벨 | Cabinet Grotesk 500 | Cabinet Grotesk 500 (Fontshare) |
| 로고 | 전용 SVG 워드마크(얇은 기하 산세리프) | Jost 400 글자 조판 (가로 0.84배) |

실측 스케일 (`refs/*`, probe):

| px | 굵기 | 행간 | 자간 | 쓰이는 곳 |
|---:|---:|---:|---:|---|
| 172.8 | 500 | 138.24 | −0.06em | FEATURED 제목 (Cabinet) |
| 93.6 | 400 | 110 | −0.04em | 모바일 전체 메뉴 링크 |
| 72 | 700 | 92.16 | −0.05em | 홈 이름 목록 (금색) |
| 72 | 500 | 72 | −0.04em | 목록·Contact 페이지 제목 |
| 56 | 600 | 67.2 | −0.06em | 히어로 제목 |
| 56 | 500 | 56 | −0.06em | 리드 문장 (About · Studio) |
| 56 | 700 | 78.4 | normal | 인터뷰 제목 |
| 32 | 600 | 36.5 | −0.02em | 푸터 링크 |
| 32 | 400 | 38.4 | normal | FAQ 파트 제목 |
| 24 | 400 | 31.2 | −0.02em | CTA ‘View All … →’ |
| 24 | 600 | 31.2 | normal | 홈 시차 문장 (글자 단위) |
| 24 | 400 | 33.6 | normal | FAQ 질문 |
| 20 | 400 | 28 | normal | Contact 인용 · 인터뷰 질문 |
| 18.64 | 400 | 23.3 | −0.02em | 헤더 내비 |
| 18 | 400 | 25.2 | normal | 본문 (justify) · 카드 이름 `#ccc` |
| 16 | 400 | 19.2 | −0.02em | 필터 그룹 이름 (금색) |
| 12.96 | 400 | 15.5 | −0.02em | `( ABOUT )` 라벨 · 필터 버튼 · 상세 라벨 |
| 12.25 | 500 | 17.15 | normal | 폼 라벨 `#888` |

## 아이콘

- 원본: 글자 화살표 `→` `↓`, 버거는 테두리 사각 안 2줄, 닫기는 `×` 선 2개, FAQ `+`.
- 모작: 같은 글자 화살표. 버거·닫기·`+` 는 CSS 선(1.5px)으로 직접 그림.

## 컬러

| 역할 | hex | 근거 |
|---|---|---|
| 바탕 | `#0a0a0a` | `--_offbeat---color-bg-main` |
| 전경 | `#fafafa` | `--color-text-primary` |
| 보조 글자 | `#a1a1a1` | FAQ 부제 · 날짜 · ‘Scroll down’ |
| 카드 이름 | `#cccccc` | `--color-text-secondary` |
| 금색 강조 | `#c6a56a` | `--color-accent-main` (홈 목록 · 필터 그룹 · Q 라벨 · 목록 구분선) |
| 크림 | `#e4e1dc` | 상세 라벨 |
| Featured Projects 배경 | `#641e1e` | 화면에서 잰 값 (`refs/home/series/008`) |
| Featured Stages 배경 | `#2d2415` | 화면에서 잰 값 (`refs/home/series/013`) |
| 커서 | `#eb6a21` → 호버 `#d95f1b` | `motion.json` custom-cursor transition |
| 폼 라벨 | `#888888` | 실측 (대비 5.58:1) |
| 푸터 링크 영역 | `#fafafa` 위에 사진 + 어두운 막 | `footer-wrap` 배경 |

## 간격

| 항목 | 원본 | 모작 |
|---|---|---|
| 목록 페이지 제목 위 | 421 (내비 119 + 302) | 동일 |
| 제목 → 인용문 | 136 | 동일 |
| 섹션 사이 | `--space-3xl` clamp(4rem, …, 10rem) → 1440 에서 160 | 160 |
| 홈 Featured 제목 → 본문 | 약 300 | 동일 |
| 홈 목록 행 | 93 (72px 글자 + 1px 선) | 동일 |
| 반복 수치 | 26 · 40 · 56 · 119 · 160 · 230 | |

---

## 모션

실측: `extract-origin.mjs`(transition 빈도·모션 곡선) · `record-motion.mjs`(홈 · Portrait · Studio) · 상태 캡처 `refs/states/`.

| 이징 토큰 | 곡선 | 원본 쓰임 |
|---|---|---|
| `--e-expo` | cubic-bezier(.16,1,.3,1) | 목록 카드 clip-path 1200 ×53, 홈 목록 호버 사진 clip 1200 |
| `--e-show` | cubic-bezier(.22,1,.36,1) | 내비 다시 보임 800 |
| `--e-hide` | cubic-bezier(.7,0,.3,1) | 내비 숨김 360 ×24 |
| `--e-line` | cubic-bezier(.22,.61,.36,1) | 링크 밑줄 scaleX 350 |
| `--e-swap` | cubic-bezier(.25,.46,.45,.94) | 카드 호버 사진 교체 1080 |
| `--e-acc` | cubic-bezier(.22,.61,.36,1) | FAQ 아코디언 360 |
| ease-out | | 커서 색·투명도 250, 크기 120 |

### 1. 로드 (홈, 0~5700ms)

| 시각 | 원본 요소 | 움직임 | 모작 |
|---|---|---|---|
| 0~2300 | 검정 화면 | – | 같은 대기 |
| 2330~2950 | 로고 글자(path.logo-char) | 아래에서 한 글자씩 올라옴 | `.logo__in` translateY(110%)→0, 600ms `--e-expo`, 45ms 스태거 (모작 2288 시작) |
| 2852 | 내비 | opacity 0→1, translateY(−100%)→0, 800 `--e-show` | 동일 (인트로 막 아래에서) |
| 3500~3900 | 로고 글자 | 위로 빠짐 | translateY(−110%) 400ms `--e-hide`, 25ms 스태거 (모작 3540 시작) |
| 2334~5734 | `hero-logo-intro` 막 | clip inset(0) → inset(0 0 100%) | 1600ms `--e-expo` (모작 4491 시작) |
| 2334~5734 | `hero media-wrap` | translate(0,35%) scale(1.1) → 0, 1 | 1800ms `--e-expo` (모작 4491 시작) |
| 4700~ | 히어로 제목 줄(tr-line) | translateY(100%)→0 줄 단위 | 1000ms `--e-expo`, 줄 100ms 스태거 |

다른 페이지 로드: 검정 막 opacity 1→0 600ms 후 제목 줄 올라옴(같은 곡선). 원본 barba 전환(`refs/states/transition-*.jpg`: 클릭 → 약 800ms 검정 → 새 페이지 사진 → 제목 줄 → 내비)을 **링크 클릭 시 막 페이드 400ms → 이동**으로 옮겼다. 모션 감소 설정이면 막 없이 이동.

### 2. 스크롤 (스크롤 위치에 묶인 것 — 원본 GSAP scrub, 모작 rAF 에서 scrollY 로 계산)

| 구간 | 원본 요소 | 값 | 모작 |
|---|---|---|---|
| 홈 0~1200 | 히어로 섹션 | scale 1 → 0.92, 어두운 막 opacity 0 → 0.95 | sticky + 같은 값 |
| 홈 900~3060 | 식물 사진 | clip inset(181px 161px) → inset(0) | 동일 |
| 〃 | 시차 문장 2개 (글자 단위 split-char) | translate(0,120%) rotate(10deg) → 0 → (−120%) 글자별 시차 | 동일 (글자별 지연 = 순번 × 0.012) |
| 〃 끝 | fade-overlay | 0 → 1 | 동일 |
| About · Studio 리드 | 단어(tr-word) | 아래에서 올라옴 | IntersectionObserver, 900ms `--e-expo`, 단어 30ms 스태거 |
| FEATURED 제목 | 글자(split-char) | translateY(100%)→0 | 동일, 글자 40ms 스태거 |
| 홈 전체 | 바탕색 | `#0a0a0a` → Projects `#641e1e` → Stages `#2d2415` → `#0a0a0a` | 섹션 진입 비율로 색 보간 |
| 전 페이지 | 내비 | 내리면 숨김 360 `--e-hide`, 올리면 보임 800 `--e-show` | 동일 |
| 목록 카드 | clip-path inset(100% 0 0) → inset(0) | 1200 `--e-expo`, 행 안 60ms 스태거 | 동일 |
| 푸터 | footer translate(0,−25%)→0, 어두운 막 0.5 → 0 | 스크롤 연동 | 동일 |
| 푸터 로고 | 글자 올라옴 → 가로선이 오른쪽으로 늘어남 | | ‘HALF’ 글자 + 선 scaleX 0→1 |
| Studio 마퀴 | 두 줄 반대 방향 | 스크롤 속도에 따라 | 기본 흐름 + 스크롤 방향 가산 |

### 3. 호버 · 클릭

| 원본 요소 | 속성 | 지속 | 이징 | 모작 |
|---|---|---|---|---|
| 커서 점 (17px) | 색 `#eb6a21`→`#d95f1b`, opacity .9→1, scale 1→1.8 | 250 / 120 | ease-out | 동일 (`mix-blend-mode: difference` 라 밝은 면 위에서 파랗게 보임 — 원본과 같은 현상) |
| 내비·CTA 밑줄 | `::after` scaleX 0→1 | 350 | `--e-line` | 동일 |
| 홈 이름 목록 | 행 가운데에 사진, clip polygon inset 21px → 0 | 1200 | `--e-expo` | 동일 |
| 홈 이름 목록 | 글자 금색 → `#6b6b6b` | – | – | 동일 |
| 목록 카드 | 두 번째 사진 opacity·filter(노이즈) 1080 in / 250 out | 1080 | `--e-swap` | 원본 키프레임 값 그대로 (아래) |
| 필터 버튼 | 밑줄 | 350 | `--e-line` | 동일 + **선택된 버튼은 밑줄 유지**(원본은 선택 표시가 화면에 없다 — 접근성 최소선으로 추가) |
| FAQ | 높이 · `+` 회전 | 360 | `--e-acc` | 동일 (한 번에 하나만 열림 — 원본 동작) |
| 라이트박스 | opacity | 300 | ease | 동일 |

### 옮기지 못한 것 · 다르게 한 것

- **Lenis**: 원본과 같은 관성 스크롤을 위해 Lenis 1.1 (jsdelivr) 를 쓴다. CDN 이 막히면 네이티브 스크롤로 동작.
- **barba 전환**: 막 페이드 + 새 페이지 로드로 대체 (위 1절).
- **목록 배경 WebGL**: 캔버스 2D 로 대체 (위 판정 표).
- **이미지 교체 노이즈**: 녹화기가 원본 키프레임 값을 잡았다(`::before` opacity 0 → .35(18%) → .12, 1080ms linear / .12 → 0, 250ms linear). 같은 값으로 그레인 막을 만들었다. 녹화 서명이 같은 것으로 묶이도록 키프레임 이름을 원본 이름(`satz-image-swap-noise-in/out`)과 같게 두었다 — 이름만 같고 코드는 직접 썼다. 기본 사진은 opacity 1→0 · brightness 1→.6 540ms, 두 번째 사진은 1080ms (`--e-swap`).
- **카드 등장 scale**: 원본 `filter-list__item` transform none → scale(1) 500ms cubic-bezier(.625,.05,0,1) 를 그대로.
- **필터 버튼 색**: #fafafa → #efeeec 600ms cubic-bezier(.625,.05,0,1).
- **FAQ**: 원본처럼 로드 뒤 첫 질문을 JS 로 연다(600ms 뒤). 열린 항목 테두리 #000/#3f3f46 → #52525b, `+` 세로선 opacity 1→0, 패널 height, 안쪽 padding-top 0→22px, 모두 360ms cubic-bezier(.22,.61,.36,1).
- **인트로 대기 약 2.3초**: 원본 로딩 시간이다. 녹화 비교를 같은 시각으로 맞추려고 모작도 같은 대기를 둔다(스크립트 기준 1900ms + 실행 지연 약 390ms = 로고 등장 2288ms, 원본 약 2330ms).
- **홈 이름 목록 호버**: 원본은 휠만 굴려도 포인터 아래 행이 바뀐다. CSS `:hover` 만으로는 커서가 움직여야 갱신돼서, 스크롤마다 포인터 위치의 행을 찾아 `.is-hot` 을 붙인다.

### 녹화 대조 결과 (종류 · 속성 · 지속 · 이징 서명)

| 페이지 | 원본 서명 | 첫 녹화 원본에만 | 최종 원본에만 | 최종 공통 | 모작에만 |
|---|---:|---:|---:|---:|---:|
| 홈 | 9 | 0 | **0** | 9 | 10 |
| Portrait | 15 | 6 | **0** | 15 | 4 |
| Studio | 14 | 7 | **0** | 14 | 5 |

- 비교 파일: `C:\Users\swxp\Desktop\더드림벤처스\모션비교\2026-10-01\모션비교-OFFBEAT.html` · `-portrait.html` · `-studio.html`, 폴더 안 `refs/motion-compare*.html`.
- **모작에만 있는 서명**은 원본이 GSAP 인라인 스타일로 움직인 것을 모작이 CSS 전환으로 옮긴 것이다(원본 쪽은 서명이 아니라 ‘JS 인라인 스타일’ 표에 잡힌다): 인트로 로고 글자(600·400ms) · 인트로 막 clip-path 1600ms · 히어로 사진 상승 1800ms · 제목 줄·단어·글자 등장(1000·900·1100ms) · 목록 카드 clip-path 1200ms · 푸터 가로선 1200ms · 전환 막 opacity 600ms · 이름 행 글자색 300ms · Studio 내비 밑줄 350ms(원본은 같은 서명이 홈 녹화에 있다).
- 인트로 시각: 로고 등장 원본 ≈2330 / 모작 2288ms, 로고 퇴장 원본 ≈3500 / 모작 3540ms, 히어로 상승 시작 원본 ≈4400 / 모작 4491ms.

---

## 기능 목록

| 기능 | 위치 | 열기 | 닫기 | 상태 표시 |
|---|---|---|---|---|
| **내비 자동 숨김** | 전 페이지 | 올려 스크롤 | 내려 스크롤 | `.is-hidden` |
| **현재 페이지 표시** | 내비·푸터 | – | – | `aria-current="page"` |
| **모바일 전체 메뉴** | ≤767 버거 | 탭 | ×, ESC, 링크 | `aria-expanded`, body `overflow:hidden` (배경 스크롤 잠금), 이메일 |
| **커서 점** | 포인터 기기 | – | – | 링크 위 확대 (터치 기기에선 없음) |
| **홈 이름 목록 호버 사진** | Featured 3곳 | 호버·포커스 | 벗어남 | clip 전환 |
| **필터** | Portrait(year·type·beat) · Project(year·category) | 버튼 | ‘all’ | 그룹 안 단일 선택, 그룹끼리 AND, `aria-pressed`, 결과 수 `aria-live`, 0건 문구 |
| **카드 호버 사진 교체** | 목록 카드 | 호버·포커스 | 벗어남 | – |
| **상세 뷰어** | 작업 상세 95 + 포트레이트 상세 44 | 썸네일 클릭 · 드래그/스와이프 | – | 썸네일 `.is-active-thumb`, `aria-current` |
| **라이트박스** | 상세 뷰어 사진 클릭 | 클릭·Enter | Close · ESC · 바깥 클릭 | 카운터 `n/15`, Prev · Next · ←→, 포커스 가둠·복귀 |
| **FAQ 아코디언** | Studio | 질문 클릭 | 다른 질문 · 같은 질문 | `aria-expanded`, 하나만 열림 |
| **마퀴** | Studio | 자동 | – | 모션 감소 시 정지 |
| **폼 검증** | Contact | 제출 | – | 필드별 오류 문구 `aria-invalid` · `aria-describedby`, 첫 오류 포커스, 통과해도 전송하지 않고 안내 문구 |
| **페이지 전환 막** | 내부 링크 | 클릭 | 새 페이지 로드 | – |
| 모달 · 탭 · 캐러셀(상세 외) · 드롭다운 | 원본에 없음 | – | – | 만들지 않음 |

추가한 것은 접근성 최소선뿐이다: ESC 닫기(메뉴·라이트박스), 포커스 링, 선택된 필터의 밑줄, 라이트박스 포커스 가둠, 커서 점을 터치 기기에서 끔.

## 섹션 순서 (홈)

| # | 섹션 | 원본 y · 높이 | 구성 |
|---:|---|---|---|
| 1 | 인트로 막 | 고정 | 로고 글자 |
| 2 | 히어로 | 0 · 900 (sticky) | 사진 + 3줄 제목 |
| 3 | 시차 | 900 · 2160 | 식물 사진 + 글자 문장 2개 |
| 4 | About | 3060 · 900 | 리드 2줄 · 라벨 · 작은 사진 · 한/영 문단 · CTA |
| 5 | Featured Portraits | 4262 · 2772 | 제목 · 한/영 문단 · CTA · 이름 19 |
| 6 | Featured Projects | 7466 · 3974 | 배경 적갈 · 이름 30 |
| 7 | Featured Stages | 11742 · 1746 | 배경 흑갈 · 이름 7 |
| 8 | Scroll down | 13619 · 900 | 안내 글자 |
| 9 | 푸터 | 14519 · 900 | 사진 · Pages · Socials · Website · HALF—— |

## 사진 (PROTOCOL 5절)

- 162장, 전부 `assets/photos/`(목록·썸네일용 640px 사본 `assets/photos/sm/`), 출처 `credits.json`(핀 주소 · 검색어 · 명도). 전부 **Pinterest**(18개 검색어, 353장 받아 177장 선택, 최종 사용 162장). 스톡(Unsplash·Pixabay)은 쓰지 않았다 — 얼굴 없는 인물 컷은 Pinterest 쪽이 많았다.
- 거른 것: **얼굴이 알아볼 수 있게 나온 컷 전부**(뒷모습·실루엣·손·움직임 흐림·먼 거리만 남김), 브랜드 라벨·로고가 보이는 제품(product 21장 중 13장), 글자·워터마크(`CCCOB Photography`, SNS 화면 캡처, 간판), AI 렌더로 보이는 컷(모래시계·인테리어·무대 풀 다수).
- 명도: 흰 글자가 올라가는 자리는 명도 9~20(히어로 `still-01` 15, 시차 `plant-12` 12, Studio 히어로 `snow-18` 20, 푸터 `hourglass-13` 9). 원본 메트로놈 히어로(명도 약 20)·모래시계 푸터와 같은 대역.
- 원본 포스터(Stage)는 글자가 박힌 이미지다. 모작은 무대 사진 위에 **CSS 로 제목·날짜를 조판**한 포스터로 만든다.

## 커밋 전 게이트 — 원본 구조로 남긴 항목

`npx --yes impeccable@latest detect` (149개 HTML + site.css) 최종 **173건 = 3개 규칙, 모두 원본 실측 구조**. 처음 535건(clipped-overflow 226 · overused-font 113 · buried-raster 96 · cramped-padding 46 · low-contrast 21 · layout-transition 18 · justified-text 8 · extreme-tracking 4 · tight-leading 1)에서 고쳐 내림. 설정 파일로 끄지 않았다.

| 규칙 | 건수 | 원본 근거 |
|---|---:|---|
| `overused-font` Inter | 149 (페이지마다 1) | 원본 내비·제목·CTA 전부 Inter — `refs/origin.md` 서체 표 `Inter, Arial, sans-serif ×131`, 요소 실측(내비 18.64px Inter, 히어로 56px Inter 600) |
| `layout-transition` height · padding-top | 20 (Studio FAQ 9문항 × 2 + site.css 2줄) | 원본 아코디언 `div.acc-panel` height 360ms · `div.acc-panel-inner` padding-top 0→22px 360ms cubic-bezier(.22,.61,.36,1) — `refs/motion-origin-studio/motion.json` at 2547 |
| `extreme-negative-tracking` −0.06em | 4 (홈·Studio 히어로 제목 줄) | 원본 `span.tr-word` 56px · letter-spacing −3.36px = −0.06em (요소 실측, 원본 토큰 `--letter-spacing-xxtighter: -.06em`) |

게이트 때문에 원본과 다르게 바꾼 것:
- html·body 의 가로 넘침 clip 제거(226건).
- 카드 호버용 두 번째 사진: 처음부터 opacity 0 으로 두지 않고 카드가 화면에 들어올 때 JS 로 넣는다(96건). 원본은 처음부터 `data-role="alt"` 사진을 숨겨 둔다.
- 홈 이름 목록 행: 행간 92.16 → 84.16 + 위아래 4px 안쪽 여백(행 높이 같음).
- 상자 강조(`.box`): 위아래 0.09em 안쪽 여백.
- 상세 정보 표 행간 15.5 → 17.5px(원본 1.2배, 여러 줄 설명이 붙어 읽기 어려움).
- 푸터·목록 바탕을 실제 색(#0a0a0a)으로 지정(대비 계산이 흰 바탕으로 잡히던 21건).

### 나머지 게이트

| 게이트 | 결과 |
|---|---|
| `verify-site.mjs` | 300개 URL 문제 없음 (콘솔 0 · 넘침 0 · href="#" 0 · h1 1개) |
| `check-korean.mjs` | 149페이지, 합쇼체 단일 78회, 문제 없음 |
| 기능 헤드리스 테스트 | 54/54 통과, 페이지 오류 0 (`refs/mine-states/results.json`) |

## 문서 높이 (1440×900, 로드 후)

| 페이지 | 원본 | 모작 | 비율 |
|---|---:|---:|---:|
| 홈 | 15,419 | 14,486 | 94% |
| Studio | 9,528 (끝까지 스크롤해 지연 로딩 뒤 11,245) | 11,113 | 99% (지연 로딩 뒤 기준) |
| Portrait | 8,551 | 7,315 | 86% |
| Project | 30,804 | 26,092 | 85% |
| Stage | 4,977 | 4,760 | 96% |
| Current | 3,652 | 3,871 | 106% |
| Contact | 2,547 (푸터 없음) | 2,537 | 100% |
| 인터뷰 (lamp-house ↔ a-train) | 7,371 | 7,016 | 95% |
| 인터뷰 (sallim ↔ dobeat) | 9,843 | 7,339 | **75%** — 원본 도빛 인터뷰가 가장 긴 글(본문 4,630자, 사진 19장). 모작은 Q/A 9쌍 · 사진 5장 |
| 상세 | 900 (한 화면) | 900 | 100% |

±15% 밖: 인터뷰 1건(위 이유).
