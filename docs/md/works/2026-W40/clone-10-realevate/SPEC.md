# SPEC — REALEVATE

## 출처

- **원본 URL**: https://realevate.agency/
- **어워드**: Awwwards **Site of the Day** (PRO · DEV 표기)
- **어워드 링크**: https://www.awwwards.com/sites/realevate
- **수상일**: 2026-09-27 (수상 페이지에서 헤드리스로 직접 확인 — "Site of the Day - Sep 27, 2026", 제작 Or Halevi)
- **모작 날짜**: 2026-10-02 (영어 모작, 2026-W40 clone-10)
- **모작 브랜드명**: `HALVORIA` (가상. 웹 검색 "Halvoria" real estate — 일치 상호 없음, 비슷한 이름은 Halvatzis Realty·Halstatt 뿐). 원본 이름·로고·문구·사진·인용 출처(Knight Frank·Urban Land Institute)는 쓰지 않았다. 인용 출처도 가상 기관(Meridian Property Review · Civic Streets Institute)으로 바꿨다.

### 대상 선정 — 2026-09-27 이후 SOTD 를 직접 열어 본 결과

Awwwards SOTD 목록(`awwwards.com/websites/sites_of_the_day/`)을 2026-10-02 헤드리스 Chrome 으로 열어 REALEVATE 보다 최근 수상작 5건을 모두 확인했다. 수상일은 각 수상 페이지의 "Site of the Day - …" 문구로 확인.

| 수상일 | 사이트 | 판정 | 근거 (직접 열어서 잰 것) |
|---|---|---|---|
| 10-02 | MILLEDOLLARS https://milledollars.fr/ | **제외** | 영상 제작사 포트폴리오. 화면 전체가 풀스크린 영상 + WebGL 왜곡 전환(`webgl` 캔버스 1, `video` 1, 문서 높이 900 고정) — 렌더·영상 주도. `refs/rejected/p-milledollars_fr*.jpg` |
| 10-01 | COLONIA ZACAMIL https://coloniazacamil.com/ | **제외** | WebGL2 지도 탐색이 화면을 주도(`webgl2` 캔버스, 내부 링크 0 — 단일 화면 앱). 영어·스페인어 혼용. `p-coloniazacamil_com*.jpg` |
| 09-30 | COMINVI https://www.cominvi.com.mx/ | **제외** | 영어 9페이지라 조건은 근접했으나 히어로가 CGI 렌더 영상(갱도·트럭), 광물 360° 회전은 렌더 이미지 시퀀스(2d 캔버스 680×502), 장비 목록도 3D 렌더 컷 — 렌더 주도 3곳. `refs/rejected/cm-sheet.jpg` |
| 09-29 | JESPER LANDBERG http://jesperlandberg.com/ | **제외** | Three.js WebGL2 장면이 홈 화면 전부(`webgl2` 캔버스, 이미지 태그 0). `p-jesperlandberg_com*.jpg` |
| 09-28 | BUTTER https://www.butter.video/ | **제외** | 수상 페이지 태그 "3D · WebGL · P5.js", 영상 49개 — 제품(영상 편집기) 화면이 영상·WebGL 로 채워짐. `p-www_butter_video*.jpg` |
| **09-27** | **REALEVATE** https://realevate.agency/ | **선택** | 영어. **캔버스 0 · 영상 0(About 의 짧은 클립 1개뿐) · WebGL 0** (`refs/origin.md` "캔버스도 WebGL 도 쓰지 않는다. 화면은 전부 DOM 과 CSS"). 페이지 7개(홈·카테고리 4·About·Contact). 기능: Our Selection 전환, 메뉴, 사선 슬라이더, 끝까지 굴리면 다음 페이지, 폼 탭·검증, 정책 패널, 메일 복사 |
| 09-12 | WARM & FUZZY https://www.warmnfuzzy.tv/ | 쓰지 않음 | REALEVATE 가 더 최근이고 조건을 통과해서 |

이미 모작한 곳(white-desert · lxl · bluebottle · cerebrium · mimicus · house-of-honey · mosbys-files · elorea · offbeat · boc-studio)은 후보에 없었다.

---

## 사이트 구조

- **페이지 수 (원본 = 모작)**: **7** — 홈 · By The Sea · Evergreen · Urban Living · Rare Gems · About · Contact. 레이어: Our Selection 화면 · 메뉴 패널 · 정책 패널.
- **재현**: 7 전부 (`build.mjs` + `data.mjs` 로 생성). `href="#"` 0 (원본의 `<a href="#">Our Selection</a>` 은 `<button>` 으로 바꿨다).
- **라우팅**: 원본은 자체 SPA 전환(페이지 스테이지 교체). 모작은 일반 링크 + 전환 연출(카드 확장 / 다음 섹션 확장)을 링크 이동 직전에 재생.

```
/ (index.html)              프리로더 → 히어로(마퀴 + 가운데 사진) · 휠↓ = Our Selection 열림
├─ shoreline/  greenbelt/  oldtown/  oneoff/     카테고리 4 — 같은 틀, 색만 다름
│     히어로(고정·확대) → 소개+사선 슬라이더 → 마퀴+인용 → 패럴랙스 → 수치 행 3~5(+리드) → 큰 인용 → 패럴랙스 → CTA → 다음 카테고리
├─ about/                   히어로 사진(100vw) → 소개 + 영상 칸(스크롤 확대) → 인용 → 마퀴 → 철학 → 수치 4(번호) → 과정 → 패럴랙스 → CTA → 다음
└─ contact/                 세로 마퀴 + 연락 채널 + 폼(탭 2) · 정책 패널
레이어: Our Selection(카드 4 + 축소된 현재 페이지) · 메뉴(오른쪽 아래 패널) · 정책(오른쪽 패널)
```

| 원본 | 모작 |
|---|---|
| REALEVATE · Cyprus, Montenegro, Georgia · Elevating Life | HALVORIA · Portugal, Croatia, Albania · Higher Ground |
| By The Sea / Evergreen / Urban Living / Rare Gems | Shoreline / Greenbelt / Old Town / One Off |
| Knight Frank · Urban Land Institute 인용 | 가상 기관 인용(문장도 새로 씀) |
| WhatsApp · 실제 전화 · info@realevate.agency | Instagram 루트 · 가상 번호 · office@halvoria.example |
| Evergreen: 리드 행 + 수치 5, 큰 인용 없음 | Greenbelt: 같은 구성(리드 + 5) |

## 그리드

원본 CSS 변수를 그대로 받았다(`refs/interaction-logs/origin-rules.css`). 배율 `k = min(1, 100svh / 950px)` (원본 `--compact-vw-as-svh`), 1440×900 에서 0.947. 모작은 `--v = 1vw × k` 로 같은 계산.

| 항목 | 원본 (1440×900 실측) | 모작 |
|---|---|---|
| 좌우 여백 | 4.5vw×k = 61.4 | 같음 |
| 거터 | 2.601vw×k = 35.5 · 12열(77.2) | 같음 |
| 로고 | 20vw×k = 273 폭, top 64 | 워드마크 273 폭, top 64 |
| 히어로 사진 | 20vw×k = 273², top 233 | 같음 |
| 수치 행 | 사진 2–5열(303×388) · 글 5–8열 / 반대 행 글 6–9 · 사진 9–12 | 같음 |
| 큰 인용 | 2–12열 1092 폭 | 같음 |
| 슬라이드 | 52.083vw×k × 33.738vw×k = 711×460, 간격 28 | 같음 |
| Our Selection 카드 | 4열, 303×614(패널 434 + 사진 20svh 180), top 61 | 같음 |
| 메뉴 패널 | 23vw×k = 314 폭, 오른쪽 아래(버튼 자리) | 같음 |
| 브레이크포인트 | 1024 · 768 | 같음(태블릿 k=1.35, 모바일 2.25 — 원본 `--mobile-size-scale 2.25`) |
| **문서 높이** | 홈 900 · By The Sea 11739 · Evergreen 12826 · Urban 11523 · Rare 11772 · About 10429 · Contact 900 | 900 · **11757** · 12502 · 11541 · 11674 · 10198 · 900 (전부 ±3% 안) |

## 타이포

| 역할 | 원본 | 대체 | 근거 |
|---|---|---|---|
| 산세리프 | Google Sans 500 | **Google Sans 400/500** (Google Fonts 제공 확인, 200 응답) | 같은 서체 |
| 디스플레이 세리프 | Roslindale Display 200(DJR, 유료) | **Newsreader 300 (opsz 72)** | 좁고 대비 높은 라이트 세리프. 처음 쓴 Instrument Serif 는 impeccable `overused-font` 로 걸려 교체 |
| 확장 산세리프 | Monument Extended(유료, 가격 표·로고) | **Syncopate 400** | 가로로 넓은 대문자 |

| 토큰 | 원본 값 | 1440×900 | 쓰는 곳 |
|---|---|---:|---|
| h1 마퀴 | 16vw×k · lh 1 · −0.02em | 218.3 | 히어로·바깥 마퀴 |
| h2 세리프 | 5.2vw×k · lh .94 · −0.03em | 70.9 | 소개·인용·CTA |
| h3 수치 | 3.646vw×k · lh .92 · −0.05em | 49.7 | 수치 행 · 큰 인용(lh 1 · −0.02em) |
| About 문단 | 53.3 · lh 1.1 · −0.035em | 53.3 | About 소개·철학·과정 |
| 히어로 설명 | 1.736vw×k · lh 1.35 | 23.7 | h1 |
| 본문 | 1.2vw×k · lh 1.35 | 16.4 | 설명·인용 출처 |
| 내비 | 1.25vw×k | 17.1 | About·Contact·버튼 |
| 다음 제목 / 설명 / 라벨 | 5.787 / 1.447 / 1.1 vw×k | 78.9 / 19.7 / 15 | 다음 카테고리 |
| 메뉴 링크 | 2.816vw×k 세리프 | 38.4 | 메뉴 |
| 가격 표 | Monument Ext 13 · 0.08em 대문자 | 13 | 히어로 |
| 폼 | .99vw×k (최소 13px) | 13.5 | 입력·버튼 |

## 아이콘

원본 인라인 SVG: 2×2 점(13×13, Our Selection), 버거 두 줄(23×12, 긴 줄 + 오른쪽 짧은 줄), 원형 화살표(47 원 · 1px), 화살표(17×15), 말풍선·편지(20×19 · 20×16, 호버 시 위로 굴러 바뀜), 체크. 모작: 같은 크기·두께로 직접 그림(`build.mjs ICON`). 카드 심볼은 원본 R 모양 대신 **H 모양**을 새로 그렸다.

## 컬러

| 역할 | hex | 비고 |
|---|---|---|
| 남색(홈·About·Contact) | `#1F2B5E` | `--brand-navy` |
| Shoreline / Greenbelt / Old Town / One Off | `#222A4C` · `#36614D` · `#2D1C2D` · `#1C181D` | 원본 카테고리 색 그대로 |
| 흐린 글 | `#626C95` · `#5D668D` · `#6B5A6B` · `#5C585D` | 흰 바탕 5.12 · 5.60 · 6.36 · 6.98 |
| Greenbelt 흐린 글 | 원본 `#80988E` → **`#5E7A6D`** | 흰 바탕 **3.09 → 4.69** (대비 고침) |
| 선택 화면 바탕 | `#E3E5EB` | 실측 |
| 메뉴 덮개 | 카테고리색 30% | 원본 `rgba(31,43,94,.24)` / 카테고리 36% |
| 오류 | `#B3261E` | 6.54 — 원본은 브라우저 기본 말풍선 |

**대비 (WCAG 계산)**: 흰 글/카테고리 바탕 13.4~17.5, 남색/선택 바탕 10.65. **다음 카테고리 덮개** 원본 `rgba(0,0,0,.2)` (호버 .1) → 모작 **.36 (호버 .26)** — 밝은 사진(명도 65~83) 위 흰 글씨가 4.5 를 못 넘어서 올렸다. 호버 때 밝아지는 움직임은 유지.

## 간격

| 항목 | 원본 | 모작 |
|---|---|---|
| 섹션 상하 | 14vw×k = 191 | 같음 |
| 소개 선 → 제목 → 글 | 55 선 · 4.282vw×k = 58.4 간격 | 같음 |
| 수치 행 사이 | 5vw×k = 68 · 큰 인용 위 13vw×k = 177 | 같음 |
| 슬라이더 | 위 5vw×k · 아래 8vw×k · 화살표 47 · 오른쪽 12.5vw×k | 같음 |
| 버튼 묶음 | 오른쪽 61.4 · 아래 61.4 (카테고리 히어로에서는 72) | 같음 |
| 반복 수치 | 35.5 · 58.4 · 61.4 · 68 · 177 · 191 | 같음 |

---

## 모션

실측 이징: `cubic-bezier(.7,.6,0,1)` 밑줄·버튼 750/650 · `(.18,.13,0,.99)` 카드·다음 호버 800 · `(.16,1,.3,1)` 등장 · `(.15,.32,.2,.99)` 커서 링. 원본 라이브러리 GSAP·ScrollTrigger·SplitText → 모작은 라이브러리 없이 CSS 전환 + rAF 계산(`assets/site.js`).

### 1. 홈 로드 (`refs/motion-origin`, 0 = 내비게이션)

| 시각(ms) | 요소 | 원본 | 모작 |
|---|---|---|---|
| 642 | 남색 막 + 가운데 사진 5장 | 사진마다 clip inset(50%)→0 약 1500, 500 간격, img scale 1.5→1 | 같음(`plFrame` 1500 · 500 간격 · `plImg` 1600) |
| 642–3709 | 숫자 카운터 0→100 | 자릿수 굴림 | 숫자 증가(굴림 없이 값만 바뀜 — 아래 "남은 차이") |
| 3800–4445 | 남색 막 | clip inset(0 0 100%) 로 위로 걷힘 | 같음 800 (.76,0,.24,1) |
| 3266–5437 | 마퀴·문장·로고 | 줄마다 translateY(100~140%) skew(−1°) + clip → 0 | 같음 1100~1400 (.16,1,.3,1) 70ms 간격 |
| 4705 | Our Selection 점 아이콘 | scale 0→1 | 같음 900 |
| 상시 | 마퀴 | 왼쪽으로 96px/s | 96.0px/s (`ftest`) |

### 2. Our Selection (홈 휠↓ · 버튼 · 카테고리 버튼)

| 요소 | 원본 | 모작 |
|---|---|---|
| 현재 페이지 | translate(0, 211px) scale(.445), 아래 가운데 기준 ~1000 | 같음 1000 (.76,0,.24,1) |
| 카드 4장 | translateY(110%)→0 · opacity, 46ms 간격 | 같음 900 (.16,1,.3,1) |
| 카드 안 | 심볼 y12 · 제목 x20 · 설명 y16 → 0 | 같음 |
| 카드 호버 | brightness 1.08 · 사진 scale 1.045 · 빛 번짐 800 (.18,.13,0,.99) | 같음 |
| 닫기 | 휠↑ · ESC · 축소된 페이지 클릭 | 같음 |
| 카드 클릭 | 카드가 화면 전체로 커진 뒤 그 페이지 | 카드 색 막이 화면으로 커진 뒤 이동 820 |

### 3. 카테고리 스크롤 (`refs/motion-origin-cat`, 샘플 `refs/interaction-logs` + 실측)

| 구간 | 원본 | 모작 |
|---|---|---|
| 0 → 2131px | 히어로 사진 273² → 1440×990(110svh), top 233→0, 선형(1065px 에서 857 폭) | 같음 — 1065px 에서 858 (`ftest`) |
| 2176 → | 히어로 묶음 translateY 0.342×진행 · opacity 1→0.3 | 같음 |
| 슬라이더 | 사선 배치(739px 당 −104px), 스크롤 1px 당 0.513px 흐름, 화살표 한 칸, 끌기 | 같음 — 사선 −104px (`ftest`) |
| 패럴랙스 | 큰 사진 −10%→10% scale 1.2 · 수치 사진 −8%→8% scale 1.12 · 다음 사진 −6%/1.16 → 0/1 | 같음 |
| 버튼 색 | 뒤 섹션 톤에 따라 흰↔카테고리색 750 (.7,.6,0,1) · 아래 72→61 400 ease | 같음 |
| 끝 | 계속 굴리면 커서 자리에 링(200px)이 약 2.4초 동안 차고 다음 섹션이 화면을 덮은 뒤 다음 페이지 | 같음(휠 사이 시간 누적 2400ms) |
| 스크롤바 | 오른쪽 9px 막대, 스크롤 중 나타남 350 | 같음 · 끌기 가능 |

### 4. 메뉴 · 기타 호버

| 요소 | 원본 | 모작 |
|---|---|---|
| 메뉴 패널 | 버튼 자리에서 clip 으로 펼쳐짐, 링크 아래에서 위로 | clip 850 (.76,0,.24,1), 링크 60ms 간격 |
| 메뉴 링크 호버 | 글자별로 위로 굴러 바뀜(rolling text) | 같음 22ms 간격 |
| 연락 아이콘 호버 | 아이콘이 위로 바뀜 680 (.16,1,.3,1) | 같음 |
| About·Contact 밑줄 | scaleX 0→1 650 (.7,.6,0,1) | 같음 |
| Our Selection 호버 | 배경이 왼쪽부터 채워짐 750 | 같음 |
| 다음 카테고리 호버 | 사진 scale 1.1 · 덮개 옅어짐 800 | 같음 |
| About 영상 칸 | 스크롤에 따라 415 → 1317 폭으로 커지며 가운데 | 같음(1266 확인) |

### 녹화 대조 결과

비교 HTML: `C:\Users\swxp\Desktop\더드림벤처스\모션비교\2026-10-02\모션비교-REALEVATE.html` (홈) · `모션비교-REALEVATE-카테고리.html` (By The Sea ↔ Shoreline). 같은 파일을 `refs/motion-compare*.html` 에도 둠.

| 대조 | 원본에만 있는 줄(빨강) |
|---|---|
| 홈 로드·휠·호버 | **0** (처음 대조 때 1 — About 밑줄. 선택 화면이 열린 동안 축소된 페이지의 호버를 막아둔 것이 원인 → 풀었다) |
| 카테고리 스크롤·호버 | **1** — `custom-scrollbar-thumb` background 150: 원본이 다음 페이지(Evergreen)로 넘어가며 막대 색이 바뀐 것. 모작은 새 페이지가 처음부터 그 색이라 전환이 기록되지 않음 |

처음 대조 때 빨강이던 커서 링 4줄·다음 호버 2줄은 모작이 끝에서 너무 빨리(휠 4번) 넘어가 기록 전에 페이지가 바뀐 것이었다 → 원본처럼 약 2.4초 동안 차게 고친 뒤 0줄. 원본의 GSAP 인라인 변화(표 아래 목록)는 모작에서 CSS 전환·rAF 로 옮겼다.

## 기능 목록

| 기능 | 위치 | 열림 | 닫힘 | 상태 |
|---|---|---|---|---|
| **프리로더** | 홈 | 로드 | 3.8초 뒤 걷힘 | – |
| **Our Selection** | 전 페이지(Contact 데스크톱 제외 — 원본도 버튼 없음) | 버튼 · 홈 휠↓ · 터치 쓸기 | ESC · 휠↑ · 축소 페이지 클릭 · 버튼 | `aria-expanded`, 포커스 가둠 |
| **카드 이동** | 선택 화면 | 클릭 | – | 현재 페이지 대신 Homepage 카드 |
| **메뉴** | 전 페이지 | 버거 | × · ESC · 바깥 클릭 | `aria-expanded`, `role=dialog`, 포커스 가둠·복귀 |
| **사선 슬라이더** | 카테고리 | 이전/다음 · 끌기 · 스크롤 흐름 | – | `aria-live` "Slide n of 8" |
| **끝까지 굴려 다음 페이지** | 카테고리·About | 끝에서 계속 휠 | 멈추면 1.4초 뒤 초기화 | 링 진행 |
| **다음 카테고리 링크** | 카테고리·About | 클릭 | – | – |
| **영상 칸** | About | 클릭 · Enter | 다시 클릭 | `aria-pressed`, 커서 원 Play/Pause |
| **폼 탭** | Contact | Investors / Partnership 클릭 · ←→ | – | `role=tab` `aria-selected` |
| **폼 검증** | Contact | Send | – | 칸별 "Required"·"Check the format", `aria-invalid`, 첫 오류로 포커스. 통과하면 접수 문구(보내지 않음) |
| **메일 복사** | Contact | 클릭 | 1.8초 | "Email Copied" |
| **정책 패널** | Contact 동의 문구 | 링크 | × · ESC · 바깥 클릭 | `role=dialog` `aria-modal`, 포커스 가둠·복귀 |
| 드롭다운·캐러셀 외 | 원본에 없음 | | | |

**원본에 없는데 넣은 것 (접근성 최소선만)**: ① 슬라이더 위치 알림(`aria-live`) ② 메뉴·정책·선택 화면 포커스 가둠/복귀 ③ 폼 오류를 브라우저 말풍선 대신 칸 옆 글자로(원본은 `reportValidity()` 말풍선 — 기계로 확인 가능하고 색만으로 전하지 않게) ④ 탭 화살표 키 ⑤ 선택 화면 ESC(원본도 ESC 로 닫힘 — 실측 `refs/states/23-sel-after-esc.jpg`, 추가 아님). 원본의 "Our Selection" `<a href="#">` → `<button>`.

## 섹션 순서

- **홈**: 내비(About · 로고 · Contact) → 마퀴 "Higher Ground" + 가운데 사진 → 설명 2줄 → 가격 표 → 아래 왼쪽 ©, 오른쪽 아래 버튼.
- **카테고리**: 히어로(마퀴·사진·설명·가격·(Scroll)) → 소개(선·세리프 제목·글) + 슬라이더 → 바깥 마퀴 + 정사각 사진 + 세리프 인용 + 출처 → 패럴랙스 → [리드 행] + 수치 행 3(5) → 큰 인용(Old Town 3줄, 나머지 6줄; Greenbelt 없음) → 패럴랙스 → CTA → 다음.
- **About**: 히어로 사진 + 마퀴 → (About Us) 문단 + 영상 칸 → 인용 → 마퀴 → (Philosophy) → 수치 4 (01~04) → (The process) → 패럴랙스 → CTA → 다음(Shoreline).
- **Contact**: 세로 마퀴 → Let's talk + Office/Instagram/Phone → 탭 + 폼 → 동의 + Send.

---

## impeccable detect — **2건 (원본 구조)**, 설정으로 끄지 않음

`.impeccable/` 설정 없음. 대상 HTML 7 + `assets/site.css`. 출력 `refs/detect-1.txt`(처음) → `detect-2/3.txt` → `refs/detect-final.txt`. **처음 53건 → 2건.** URL 검사(1280×800 · 1440×900)도 같은 규칙 외 0.

직접 고친 것:
- `tight-leading` 20 → 0 (정책 본문 줄간격이 상속 계산에서 깨짐 → px 로 명시 1.55)
- `cramped-padding` 17 → 0 (CTA·다음·히어로 묶음·탭 줄: 패딩 추가, 탭 밑줄을 ::before 로, 섹션 배경을 ::before 로)
- `overused-font` 7 → 0 (Instrument Serif → Newsreader)
- `buried-raster` 2 → 0 (영상 칸 사진 3장 겹침 → 한 장의 src 교체)
- `clipped-overflow-container` 4 → 0 (body·contact·home 의 overflow hidden/clip 제거 — 홈은 내용이 100svh 안에 있어 잘라낼 것이 없음)
- `skipped-heading` 1 → 0 (정책 제목 h3→h2, 소제목 h3/h4)
- `oversized-h1` 5 → 0 (모바일 h1 4.6vw → clamp(15px, 4.6vw, 20px))
- URL 검사의 `undersized-ui-text`(1280×800 에서 9.7~10.8px) → 카드 설명·가격 표·연락 링크·라벨에 최소 12px

남은 것:

| 규칙 | 건수 | 원본 근거 |
|---|---:|---|
| tight-leading (line-height 1.00) | 2 (Shoreline · One Off 의 6줄 큰 인용) | 원본 `.category-pull-quote__text` font-size 49.7391px · line-height 49.7391px (`refs/interaction-logs/measure-bythesea.txt` 줄 "category-pull-quote__text0") — 49.7px 디스플레이 인용의 원본 행간 1.0. Old Town(3줄)은 같은 규칙인데 줄 수가 적어 걸리지 않음 |

---

## 사진

> 사용자 지시 원문: **"근데 이미지가 없잖아 이미지를 비슷한 무드로 픽사베이나 언스플래쉬같은곳에서 긁어오셈"** · **"감도높은 사진을 핀터레스트에서 찾아서 긁어오기"**

| | |
|---|---|
| 채택 | **78장** (자리 78 · 중복 0) — **Unsplash 63 · Pinterest 15** |
| 후보 | 검색어 49개(Pinterest 21 · Unsplash 28) → **647장** 받음 (`refs/photo-raw/`, 공개 안 함) |
| 출처 기록 | `assets/photos/credits.json` — 자리 · 원 파일 · 출처 · 페이지 주소 · 검색어 · 라이선스 · 명도 · 평균색. 출처 없는 사진 0 |
| 선택 스크립트 | `refs/select-photos.mjs` (자리 → 원 파일 표) |
| 검수 시트 | `refs/photo-review/*.jpg` (검색어별 밀착 시트, 채택본 `sel1.jpg`·`sel2.jpg`) |

### 왜 Unsplash 가 대부분인가

Pinterest 의 "luxury villa / balcony sea view / hotel lobby / penthouse / architecture photography" 결과는 **거의 전부 AI 생성 렌더**였다(매끈한 수면·과한 노을·같은 구도 반복, `photo-review/shore.jpg`·`home-17.jpg`·`gem-15.jpg`·`gem-16.jpg`·`green-6.jpg`·`green-8.jpg`). AI 이미지 금지라 Pinterest 는 실사로 보이는 바다 질감·항구 항공·미니멀 건축·옛 지붕만 남기고 나머지는 Unsplash 실사로 채웠다.

### 뺀 기준과 예

| 이유 | 예 |
|---|---|
| AI 생성으로 보임 | shore-01 전부, shore-03-02/04/07/10/11/12/14, green-06 전부, green-08 전부, home-17 전부, home-21 전부, gem-15·16 전부, gem-13-11/13/14, old-09 다수 |
| 얼굴·사람 중심 | shore-22-07, home-20-02/13, gem-32-13, old-29-14, home-b01-02/14, gem-b04-01/07 |
| 글자·로고·상표 | old-30-12(상점 간판 — 처음 채택했다가 확대 검수로 교체), shore-04-14·green-05-10(GRAYMALIN), green-05-05·12, gem-13-04/05, old-12-04, gem-14-14, home-18-08, shore-03-08(재생 아이콘), gem-15-06(워터마크), home-20-07, home-20-09(병 라벨), gem-b05-07(타워브리지) |
| 랜드마크·상표 건물 | shore-23-11(버즈 알 아랍), old-29-02·old-12-11(에펠탑), gem-13-08(부르즈 할리파) |
| 촘촘한 점 무늬 | green-05-13(벙커 무늬 — 정사각 자리에서 교체), shore-04-04/12/13(사람·파라솔 빽빽) |
| 출처 기록 누락 | shore-02-01/03, home-18-03/05 (수집 중단으로 credits 가 안 남음 → 다른 사진으로) |

### 자리별 명도

원본: 히어로·카드 사진은 밝은 낮 사진, 다음 섹션은 흰 글씨가 올라가는 중간 명도. 모작 명도(0~100): 히어로 45~67, 다음 섹션으로도 쓰이는 히어로 52~67 + 덮개 .36. One Off 히어로는 처음 고른 흰 건물(83)이 너무 밝아 안개 낀 도시(67)로 바꿨다. About 히어로 29(흰 마퀴 아래), 패럴랙스 11~64.

---

## 생략·대체 (숨기지 않고 적는다)

| 원본 | 처리 |
|---|---|
| 자체 SPA 페이지 전환(스테이지를 바꿔 끼움) | 일반 링크 + 떠나기 전 연출(카드 색 막 확장 820 / 다음 섹션 확장 900). 새 페이지는 자체 등장 |
| 관성 스크롤(html overflow hidden + 커스텀 스크롤) | 네이티브 스크롤 + 커스텀 스크롤바(끌기 가능). 원본도 `window.scrollY` 가 움직이는 방식 |
| About 영상(`realevate-website-video.mp4`, 클릭 시 소리 재생) | 바다 사진 3컷이 2.6초 간격으로 바뀌고 느린 줌. 소리 없음 |
| 프리로더 숫자의 자릿수 굴림 | 숫자 값만 증가 |
| 원본 로고(R 화살표) · 카드 심볼 | HALVORIA 워드마크(Syncopate + 왼쪽 가로 막대) · H 모양 심볼 |
| 폼 전송(서버) · 실패 문구 | 보내지 않음, 접수 문구만 |
| 국가 목록 249개 | 48개 + Other |
| "Please rotate your device" 가로 경고 | 만들지 않음(모바일 세로 배치로 대응) |
| WhatsApp | Instagram 루트 링크(가상 번호를 실제 서비스에 걸지 않으려고) |
