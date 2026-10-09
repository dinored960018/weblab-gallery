# SPEC — 1367 Studio

## 출처

- **원본 URL**: https://www.1367studio.com/ (영어. 마르세유·플로리아노폴리스의 소프트웨어 에이전시, Astro + Lenis + three-globe)
- **어워드**: CSS Design Awards **Website of the Day (WOTD)**
- **어워드 링크**: https://www.cssdesignawards.com/sites/1367-studio/50191/
- **수상일**: 2026-10-09 (수상 페이지를 헤드리스로 열어 "WEBSITE OF THE DAY 2026 OCT 9 · 1367 Studio · Diego Goncalves CANADA" 문구 직접 확인. 같은 날 WOTD 목록 `cssdesignawards.com/wotd-award-winners` 에서도 "WOTD OCT 9 · 1367 STUDIO · JPANEL 8.42" 확인. 태그 animated · parallax · scroll, 분류 agency)
- **모작 날짜**: 2026-10-09 (영어 모작, 2026-W41 clone-08)
- **모작 브랜드명**: `4082` / `4082 Studio` (가상 소프트웨어 스튜디오, 로테르담·리스본·발파라이소). 웹 검색 "4082 Studio" software agency — 일치하는 회사 없음(비슷한 1648 Studio · 404 Studios 뿐). 의뢰처 `Velmora Freight` · `Norrvik Clinics` · `Tesselo` 웹 검색 — 일치 없음(가장 가까운 것 Tesselar, 다른 이름). 인물(Rui Valente · Ines Kortmann · Maren Okafor 등)·로고 글자(Halvane · MERIDA&CO · ostrel · TAVO · Korm.)도 지어낸 것. 원본 이름·로고·문구·사진·인물 사진·실존 의뢰처 로고(Santander 등)는 쓰지 않았다.

### 대상 선정 — 2026-10-09 직접 열어 본 결과

Awwwards SOTD 목록(`awwwards.com/websites/sites_of_the_day/` 1·2쪽)을 헤드리스 Chrome 으로 긁고, CSSDA WOTD 목록에서 사이트 주소를 뽑았다. 후보마다 첫 화면을 열어 `getContext` 후킹으로 캔버스 종류·크기, 영상 수, 내부 링크, 문서 높이를 쟀다(첫 화면 캡처 `refs/rejected/`). 10-07 이전 SOTD 는 지난 SPEC(`clone-04-twks`, `clone-06-safeer`, `W40/clone-10-realevate`)에서 판정됨 — 다시 보지 않음.

| 수상 | 사이트 | 판정 | 근거 (직접 열어서 잰 것) |
|---|---|---|---|
| **CSSDA WOTD 10-09** | **1367 STUDIO** https://www.1367studio.com/ | **선택** | 영어. 화면은 사진·실사 영상과 큰 타이포. WebGL 은 홈 9개 구역 중 한 구역(three-globe 선 지구본, 흰 바탕 선 그림)뿐 — 2D 캔버스로 대체 가능. 2d 512×512 캔버스 60여 개는 종이 질감 노이즈. 문장 구역의 280×280 빨간 물체(USDZ iframe)는 화면 7% 크기. 내부 페이지 **15**: Home · Projects · 상세 3 · About · Blog · 글 6 · Contact · Legal. 기능: 전체 메뉴 패널(ESC·닫기), 헤더 알약 전환, 집중 분야 호버 미리보기, 후기 자동 슬라이더(6초 진행 막대), 블로그 필터 4, 문의 폼(필수 3 · 이메일 · URL · 사용자 드롭다운), Legal 색인, 글 목차 |
| Awwwards SOTD 10-09 | MARIA VASILYEVA https://www.mariavasilyeva.com/ | 제외 | `webgl2` 1418×802 캔버스 2개가 화면 전부, 문서 높이 802, 이미지 태그 0 (`refs/rejected/p-www_mariavasilyeva_com_.jpg`) |
| Awwwards SOTD 10-08 | ODYSSÉE https://www.odysseeclinic.com.au/ | 제외 | 캔버스 0 이지만 첫 화면이 실존 인물 얼굴 클로즈업 영상(영상 8), 내부 페이지 5(+약관 2), 기능 메뉴·탭 정도 (`p-www_odysseeclinic_com_au_.jpg`) |
| CSSDA WOTD 10-08 | EDDYOS https://eddy-naboulet.dev/ | 제외 | 프랑스어 경로(/projet), 높이 802 고정 OS 흉내 화면, `webgl2` 1418×802 |
| CSSDA WOTD 09-24 | CATSKILLS https://catskills-showcase.pages.dev/ | 제외 | 내부 링크 1(원페이지 쇼핑 데모) |
| CSSDA WOTD 09-23 | EMOTION AGENCY https://emotion-agency.com/ | 제외 | `webgl2` 1418×802 화면 전부, 높이 802 |
| CSSDA WOTD 09-22 | FORGE AUTOMOTIVE https://forgeautomotive.co.uk/ | 제외 | ENTER 게이트 + 높이 802 고정 스크롤 가로채기, Builds·Stock 에 `webgl` 1418×802 (`f-1.jpg`) |
| CSSDA WOTD 09-29 | ZIRKA https://www.zrk.technology/ | 제외 | 군용 요격 드론 제품 사이트, 내부 링크 4 |
| CSSDA WOTD 09-25 | AWARDS RACING https://awards.racing/ | 제외 | `webgl2` + `.glb` 4개, 내부 링크 0 |

이미 모작한 곳(works/ 전부)과 겹치지 않는다. 같은 주 clone-07 은 한국어(현대문학)다.

---

## 사이트 구조

- **원본 페이지 (15)**: Home · Projects · 상세 3(ASR Temp · Strat Éclosia · Formwise) · About · Blog · 글 6 · Contact · Legal(Mentions légales). 푸터 Privacy Policy 와 Legal Notice 는 **둘 다 같은 Legal 페이지**로 간다(원본 링크 수집 결과 `/legal/mentions-legales` 하나뿐).
- **모작 페이지 (16)**: 같은 15 + `404.html`. `build.mjs` + `data.mjs` 로 생성. `href="#"` 0. 링크는 전부 `<폴더>/index.html` 이라 더블클릭(file://)으로도 이어진다.

```
/ (index.html)            히어로 500vh(사진 확대 → 주황 → 문장) → 문장 고정 280vh(줄 등장 + 빨간 물체) → Focus areas 6 → Working Across Time Zones → 지구본 200vh → 후기 + 의뢰처 → 프로젝트 2 쌓임 200vh → CTA → 푸터
├─ projects/              제목 + 소개 → 정사각 카드 2열 3개
│   └─ <3>/               검정 히어로(이름 · 80px 제목 · 분야/연도/서비스) → (큰 사진) → Project overview → (큰 사진) → What we did → 갤러리(2·1·2·2·1·2 칸) → 주황 후기 → CTA → 푸터
├─ about/                 검정(문단 + mono 문단 + 화면 폭 4082 글자) → 흰 문단 → 주황 Our philosophy + 숫자 3 → CTA → 푸터
├─ blog/                  검정 제목 → 대표 글 → 필터 4 → 카드 3열 5개 → CTA → 푸터
│   └─ <6>/               Back to all posts · 메타 · 제목 · 요약 · 글쓴이 → 사진 → 본문(+ On this page 목차, 3개 글) → CTA → 푸터
├─ contact/               주황 전면: 제목 + 폼 | 세로선 | Talk to us + 사무소 3 (CTA·푸터 없음 — 원본 같음)
├─ legal/legal-notice/    검정: Last updated · Legal Notice · 소개 → Index(고정) | 10항 → CTA → 푸터
└─ 404.html
레이어: 헤더 알약 · 메뉴 패널
```

| 원본 | 모작 |
|---|---|
| 1367 Studio · Marseille · Paris · London · Florianópolis | 4082 Studio · Rotterdam · Lisbon · Valparaíso (지구본 도시 Rotterdam · Lisbon · Milan → Valparaíso) |
| 프로젝트: ASR Temp(인력) · Strat Éclosia(컨설팅) · Formwise(협회 SaaS) | Velmora Freight(화물 예약) · Norrvik Clinics(물리치료 예약) · Tesselo(회원 관리 SaaS) — 구조 같음(상세 2개는 큰 사진형, 1개는 사진 없는 SaaS 형) |
| 글 6: Jev(대표) · Sanity 파트너 · Agents · AI 콘텐츠 · Sanity 신기능 · Everything NYC | Fenn(대표) · CMS 파트너 · Agents in the pipeline · 콘텐츠 편집 모델 · Schema Week 릴리스 · Schema Week Brooklyn — 분류(COMMUNITY/PRODUCT/TECHNOLOGY) 조합·읽기 시간·날짜 대역 같음 |
| 후기 인물 사진 · 실존 의뢰처 로고 6 | 머리글자 판 · 지어낸 글자 로고 5 |

## 그리드

원본 Tailwind 4 (`measure.json`, `measure-els.json`, 뷰포트 1418 실측).

| 항목 | 원본 | 모작 |
|---|---|---|
| 헤더 | fixed, 알약 `#header-pill` max-width 1144 · width calc(100% − 32px) · 높이 72 · r8 · margin-top 16 · padding 0 31.72 0 33. 왼쪽 링크 2(gap 48) · 가운데 로고 · 오른쪽 링크 2 + 메뉴 아이콘 16 | 같음 |
| 홈 히어로 | section 5vh, 안쪽 sticky 100vh. 제목 left 40 bottom 40 폭 303, 오른쪽 mono 문단 205 + 버튼 158×48 r8 | 같음 |
| 문장 고정 | pin-spacer 2.8vh(802 + 1444), 문단 max 599 가운데 | 같음 |
| Focus areas | padding 80 32, 줄 h 65 간격 32, 제목 58% · 하위 3열 42% | 같음 |
| 지구본 | 제목 구역 padding-top 100, 72px. 장면 2vh, sticky | 같음 |
| 후기 | min-h 100vh, padding 96 48, 왼쪽 38%(413) · 오른쪽 525, 로고 3열 154 · 열 간격 31 | 같음 |
| 프로젝트 쌓임 | 2vh, sticky 100vh, 왼쪽 글 left 40 bottom 40%, 오른쪽 글 폭 217 | 같음 |
| CTA | 높이 0.8vh, padding 48 40, 왼쪽 576 · 오른쪽 384(padding-bottom 80) | 같음 |
| 푸터 | padding 64 48 0, 왼쪽 58% · 링크 열 gap 28 · 주소 열 gap 44, 큰 숫자 margin-top 170 · 높이 459/1418 vw | 같음 |
| Projects·Blog | 바깥 padding 176 48 96, 안쪽 max 1216, 카드 2열(600) gap 16 · 행 64 / 블로그 3열(395) | 같음 |
| 상세 | 히어로 padding 152 32 72, 이름 열 451 + 제목, 사진 padding 0 32 48 r8, overview 2열, What we did 538, 갤러리 칸 높이 869 gap 16 | 같음 |
| 글 | padding 152 48 96, max 1100, 본문 720 + 목차 240 | 같음 |
| Contact | 왼쪽 padding 160·120, 폼 721, 칸 72 · textarea 168, 세로선 955/1418, 오른쪽 열 1082/1418 · top 434 | 같음 |
| Legal | padding 200 40 128, 색인 280 sticky top 120, 본문 max 720 | 같음 |
| 브레이크포인트 | md 768 · lg 1024 | 헤더 767 · 레이아웃 1023 |

**문서 높이** (같은 헤드리스 창, `refs/heights.txt`)

| 페이지 | 원본 | 모작 | 차이 |
|---|---:|---:|---:|
| 홈 | 12862 | 12862 | 0% |
| About | 3956 | 4022 | +2% |
| Projects | 3585 | 3483 | −3% |
| Blog | 3961 | 3879 | −2% |
| Contact | 1020 | 924 | −9% |
| Legal | 6031 | 5398 | −10% |
| 상세(큰 사진형) ASR / Velmora | 11329 | 10447 | −8% |
| 상세 Strat / Norrvik | 8604 | 8590 | 0% |
| 상세(SaaS) Formwise / Tesselo | 5092 | 4826 | −5% |
| 글 Jev / Fenn | 5970 | 5460 | −9% |
| 글 파트너 | 3945 | 3527 | −11% |
| 글 Agents | 5844 | 5339 | −9% |
| 글 AI 콘텐츠 / 편집 | 5262 | 4799 | −9% |
| 글 Sanity 신기능 / Schema Week 릴리스 | 8227 | 7150 | −13% |
| 글 NYC / Brooklyn | 4668 | 4063 | −13% |

전부 ±15% 안. 홈 섹션 수 9 = 9, 3화면 넘는 구역(히어로 5vh · 문장 2.8vh)은 모작에도 있다.

## 타이포

원본: **Geist** (본문·제목) + **Geist Mono** (라벨·버튼). 모작도 Google Fonts 의 Geist · Geist Mono 그대로.

| 쓰임 | 원본 px / 굵기 / 행간 / 자간 | 모작 |
|---|---|---|
| Legal 제목 | 86.4 / 400 / 89.9 / −0.86 | clamp(48, 6vw, 86.4) 같음 |
| 상세 제목 · About 숫자 | 80 / 400 / 83.2 · 104 | 같음 (숫자 행간 105 — 아래 게이트) |
| CTA 제목 · Building Worldwide | 72 / 400 / 72 (−2.16) | 같음 |
| 페이지 제목 | 56 / 400 / 58.24 / −0.56 | 같음 |
| 집중 분야 | clamp(28, 3.33vw, 48) 47.2 / 1.1 | 같음 |
| overview 큰 문장 | 48 / 57.6 | 같음 |
| 히어로 주황 문장 · 문장 고정 · 푸터 제목 | 40 / 41.6 / −0.4 | 같음 |
| 대표 글 제목 | 36 / 500 / 41.4 | 같음 |
| 히어로 제목 · 섹션 제목 | 32 / 33.28 · 38.4 | 같음 |
| 후기 큰 인용 · About 문단 | 28 / 36.4 | 같음 (About 37.8 — 게이트) |
| 프로젝트 이름 · 지구본 도시 | 24 / 32 · 21 / 600 | 같음 |
| 본문 | 16 / 26 (#333) · 16 / 20.8 (#666) | 같음 |
| 헤더 링크 | 14 / 15.68 / −0.14 | 같음 |
| mono 라벨·버튼 | 12 / 600 · 400 / 14.4 / −0.12, 대문자 | 같음 |
| 블로그 태그 | 10 mono | **11** (게이트 undersized-ui-text, 접근성 최소선) |
| 후기 인용 | 16 / 16.64 | 16 / 21 (게이트 tight-leading) |

로고: 원본은 이미지(`img.header-logo`)에 `filter: brightness(0)` ↔ `brightness(0) invert(1)` 전환. 모작은 글자 `4082` (Geist 700 23px)에 같은 filter 전환.

## 아이콘

메뉴(가로선 3, 14×12, 선 1.2), 닫기(X 16, 선 1.5), 지구본 핀(14×20 채움 + 흰 점), 드롭다운 화살표(16, 선 1.4). 전부 인라인 SVG 로 직접 그림.

## 컬러

| 역할 | 원본 | 모작 |
|---|---|---|
| 주 색(주황) | `#f43c00` | **`#d93500`** — 흰 글자 대비 3.8:1 → **4.7:1** (게이트 low-contrast, 대비는 무조건 고침) |
| 검정 · 흰 | `#000` · `#fff` | 같음 |
| 회색 글 | `#666` · `#4d4d4d` · `#9a9aa0` · `#7a7a7a` | `#666` · `#4d4d4d` · `#6e6e74`(지구본 부제, 흰 위 4.9:1) · `#8a8a8a`(검정 위) |
| 히어로 바탕 | 영상 속 베이지 `#ece3c8` | `.vf` 바탕 `#ece3c8` + 사진 `mix-blend-mode: multiply` (흰 배경 사진을 베이지로) |
| 히어로 제목 | 흰 글 `mix-blend-mode: difference` → 베이지 위 `#131c37` | 직접 `#131c37`, 셋째 줄 `#6f6b62` (아래 생략·대체) |
| 알약(스크롤 후) | `rgba(0,0,0,.32)` + blur 12 | 같음 |
| 메뉴 패널 | 어두운 반투명 + 흐림 | `rgba(32,30,28,.86)` + blur 18 |
| 상세 타일 | 남색 `#151a3b` · 크림 `#fce7c3` (원본 ASR 갤러리 패널 색) | 같음 |
| 문의 칸 테두리 | `#ccc` 1px | `rgba(255,255,255,.8)` |

## 간격

반복 수치: 8 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 120 · 152 · 176. 섹션 상하 96(후기) · 80(집중 분야) · 152/120(상세 갤러리) · 176/96(목록 머리).

## 모션

실측: `refs/origin.md`, `refs/motion-origin/motion.json`(애니메이션 115 · 인라인 스타일 49요소), `refs/vp/home/` 450px 걸음 30장.

| 무엇 | 원본 | 모작 |
|---|---|---|
| 로드: 히어로 틀 | `#video-frame` scale .55 → 1, 624 → 3246ms (2.6s) | `.vf` scale .55 → 1, 2.6s `cubic-bezier(.65,0,.35,1)` 지연 .62s |
| 로드: 제목·mono 줄 | `.reveal-line` translate(0,100%) → 0, 714ms 시작 · 1.3~1.7s 스태거 | `.rl` 1.3s(mono 1.4s) `cubic-bezier(.16,1,.3,1)` |
| 로드: 헤더 | opacity 0→1 500ms ease · translateY(−12px)→0 400ms ease, 861ms | 같음 |
| 스크롤: 헤더 알약 | `.is-scrolled` → max-width 1144→682 600ms `(.65,0,.35,1)`, 배경·blur 300ms, 유리 층 opacity 0→1 300ms, 로고 filter 300ms, 링크 색 300ms. **숨지 않음**(30걸음 내내 `is-visible`, transform 0) | 같음. 헤더 글자색은 아래 구역의 `data-hd`(밝음/어두움)를 따라감. 숨김 없음 |
| 스크롤: 히어로 | 제목·aside translateY 0→140 · opacity 1→0 (문서 2%≈300px), 영상 확대(고글로 들어감) → `#orange-overlay` opacity → 1 → 주황 위 문장 3줄 등장 | 같은 순서. 사진을 렌즈 중심(73% 61%)으로 scale 1→10 (`hp` .02~.78), 주황 덮개 .6~.86, 줄 .84~.97 |
| 스크롤: 문장 고정 | 줄 5개 차례로 translateY(100%)→0, 물체 translate(−50%,200%)→(−50%,−40%) | 같음 (물체는 CSS 3D, 9s 회전) |
| 스크롤: 지구본 | three-globe 회전, 도시 카드 opacity 교차, 카드 transform 160ms ease-out | 캔버스 2D 정사영. 중심 (2°,−12°) → (−48°,−92°), 유럽 3장 → Valparaíso, 카드 160ms ease-out |
| 스크롤: 프로젝트 | 두 번째 패널 translateY(100%)→0, 글 줄 등장 | 같음 |
| 호버 | 헤더 링크 opacity .6 200ms · View project 색 .6 150ms `(.4,0,.2,1)` · 메뉴 링크 나머지 .4 · 메뉴 사진 scale 1.05 · 집중 분야 줄 opacity .3 300ms `(.4,0,.2,1)` + 332×332 r12 미리보기가 커서를 따라감 | 같음 |
| 후기 | 6초 진행 막대 width 0→100% linear, 자동 다음 장 | 같음 (글 바뀜 400ms 페이드) |
| 메뉴 | 알약이 사라지고 472×670 r16 패널이 열림, 아래 사진 띠 | clip-path 위→아래 600ms `(.65,0,.35,1)` + 사진 띠 24s 흐름 |
| Lenis 관성 스크롤 | 있음 | **생략** — 네이티브 스크롤(아래 생략·대체) |

### 녹화 대조 결과

`record-motion.mjs` 로 원본·모작을 같은 조건(1440×900, 로드 5초 → 휠 → 호버)으로 녹화하고 `motion-compare.mjs` 로 붙였다. `refs/motion-compare.html`, 바탕화면 `더드림벤처스/모션비교/2026-10-09/모션비교-4082-1367studio.html`.

| 첫 대조 | 마지막 대조 |
|---|---|
| 빨강(원본에만) 4 — 지구본 카드 scale 160ms · 집중 분야 opacity 300ms · 알약 유리 층 opacity 300ms · 로고 filter 300ms | **빨강 0** · 같음 13 · 파랑(모작에만) 6 |

파랑 6은 원본이 GSAP 인라인 스타일로 움직인 것을 CSS 전환으로 옮긴 것(줄 등장 1.0/1.3/1.4s, 히어로 틀 2.6s, 후기 페이드 400ms)과 3D 물체 대체 회전(spin 9s).

## 기능 목록

| 기능 | 위치 | 열기 | 닫기 | 상태 |
|---|---|---|---|---|
| 헤더 알약 | 전 페이지 | 스크롤 > 10px | 맨 위 | `.scr` |
| 메뉴 패널 | 전 페이지 ≡ | 클릭 · Enter | ESC · 닫기 · 바깥 클릭 | `aria-expanded`, 포커스 가둠·복귀, 모바일에서 배경 스크롤 잠금 |
| 집중 분야 미리보기 | 홈 | 줄 호버 · 포커스 | 목록 밖으로 | `.on` |
| 후기 슬라이더 | 홈 | 6초 자동 | — | `01 / 03`, `aria-live` |
| 블로그 필터 | Blog | 클릭 · Enter | — | `aria-pressed`, 5 → 3 · 2 · 4 |
| 드롭다운 | Contact | 클릭 · ↓ | ESC · 바깥 · 선택 | `aria-expanded`, listbox · option `aria-selected` |
| 폼 검증 | Contact | 제출 | — | 필수 3 · 이메일 · URL, `aria-invalid`, 제출 막고 안내 |
| 목차 | 글 3개 | 클릭 | — | 소제목으로 이동(scroll-margin 120) |
| Legal 색인 | Legal | 클릭 | — | 10항 이동, sticky |
| 모바일 메뉴 | 390 | ≡ | ✕ | 전면 패널 |

원본에 없는 기능은 넣지 않았다. 접근성 최소선으로 더한 것: 본문 바로가기 링크, 포커스 링, 메뉴 포커스 가둠, 폼 오류 문구(원본은 브라우저 기본 말풍선), `aria-*`.

### 상태별 refs

원본 `refs/states/` 25장(메뉴 열기·호버·ESC·닫기, 헤더 호버, 집중 분야 호버 3, 후기 2, View 호버, 필터 4, 카드 호버, 폼 빈/드롭다운/선택/제출/포커스, 모바일 2). 모작 `refs/final/states/` 20장.

## 섹션 순서

- **홈**: 히어로 → 문장 → Focus areas → Working Across Time Zones → 지구본 → 후기 → 프로젝트 2 → CTA → 푸터 (원본 9 = 모작 9)
- **About**: 검정 → 흰 문단 → 주황 철학 → CTA → 푸터
- **Projects**: 머리 + 카드 3 → CTA → 푸터
- **상세**: 히어로 → (사진) → overview → (사진) → What we did → 갤러리 → 후기 → CTA → 푸터
- **Blog**: 머리 → 대표 → 필터 → 카드 5 → CTA → 푸터
- **글**: 머리 → 사진 → 본문(+목차) → CTA → 푸터
- **Contact**: 폼 화면 하나
- **Legal**: 머리 → 색인 | 10항 → CTA → 푸터

## 게이트

### verify-site — **61 URL 문제 없음**

`node scripts/verify-site.mjs http://localhost:4432` → 콘솔 에러 0 · 가로 넘침 0(1440/768/390) · `href="#"` 0 · h1 각 1개. `refs/verify.txt`. 처음엔 768 넘침(태블릿 폭에 데스크톱 배치) + 파비콘 404 1 → 레이아웃 브레이크포인트 1023 · 닫힌 메뉴 `hidden` · 인라인 파비콘으로 고침.

### impeccable detect (16 HTML, 억제 없음) — `refs/detect-1.txt` 194 → `refs/detect-final.txt` 56

고친 것: low-contrast 97(주황 `#d93500`), cramped-padding 22(메뉴 패널 16 · 후기 96 · 문장 · About · 404 안쪽 여백), buried-raster 5(미리보기 사진 5장 겹침 → 한 장 교체), undersized-ui-text 9(태그 11px), tight-leading 5(후기 인용 · About 문단·숫자·라벨 · 문의 주소, 1.3 이상).

남은 56 — **전부 원본 구조**, 근거:

| 규칙 | 수 | 근거 |
|---|---:|---|
| overused-font (Geist · Geist Mono) | 32 | 원본 서체 그대로. `refs/origin.md` 서체 "Geist ×191 · Geist Mono ×58" |
| layout-transition (max-width) | 16 | 원본 알약 실측 `transition: max-width .6s cubic-bezier(.65,0,.35,1)` (`refs/motion-origin/motion.json` "max-width 600 · 1144px → 682px"). 원본의 width·height·padding 전환은 값이 안 바뀌어 뺐다 |
| all-caps-body | 8 | 원본 mono 대문자 라벨: About 상단 mono 문단(`measure-els.json` "WE CRAFT PREMIUM WEBSITES…" 12px uppercase), 글 메타 "5 MIN READ · OCTOBER 2, 2026", 상세 서비스 "PRODUCT DESIGN & SAAS DEVELOPMENT" |

### 헤드리스 클릭 테스트 — **74 / 74 통과**

`refs/tests/click-test.mjs` (CDP 실제 마우스·휠·키), 결과 `refs/tests/click-result.txt`. 로드 모션 4 · 헤더 알약 4 · 히어로 스크롤 3 · 문장 2 · 집중 분야 4 · 지구본 3 · 후기 1 · 프로젝트 쌓임 2 · 메뉴 11 · 목록/상세 4 · 블로그 필터 10 · 글 목차 3 · 폼 12 · Legal 2 · 404 1 · 포커스 링 1 · 모바일 5 · 오류 없음 1.

## 사진

34장(서로 다른 원본 31장, 메뉴 사진 3장은 프로젝트 카드와 같은 컷). **전부 Unsplash 무료 실사**(Unsplash License, Unsplash+ 아님). Pinterest 후보(고글·렌즈·창고·클리닉·홀 57장, `refs/photo-raw/`)는 AI 생성 의심이 많아(고글 렌즈 반사가 실제와 안 맞는 컷 등) 하나도 쓰지 않았다. `credits.json` 에 원본 페이지·검색어·명도.

검수: `refs/photo-review/raw-0~9.jpg`(후보 197장 이름 붙인 밀착 시트), `used-0~1.jpg`(사용 34장). 사용 사진은 한 장씩 원본 크기로 열어 봤다.

### 뺀 기준
- **로고·글자**: 컨테이너 사진 4장(MSC · MAERSK · Hapag-Lloyd · COSCO · OOCL 표시)을 처음엔 넣었다가 원본 크기 검수에서 발견하고 사무실·키보드 사진으로 바꿨다. 지금 남은 컨테이너 사진(카드)은 번호 스티커만 있다.
- **얼굴**: 사람 얼굴이 보이는 컷 제외(강연장 관객 컷 `u-stage-04` → 무대만 있는 `u-stage-05`). 손·뒷모습만 있는 컷(타이핑 손, 태블릿 손, 휴대폰 손)만 사용.
- **AI 의심**: 과포화·매끈한 질감·형태 뭉개짐·글자 깨짐·비현실 조명 중 하나라도 의심되면 제외. 사용 34장은 노출·노이즈·원근이 실사 카메라 결과로 확인.

## 생략·대체 (숨기지 않고 적는다)

| 원본 | 모작 | 이유 |
|---|---|---|
| 히어로 영상: 고글 쓴 인물 실루엣이 돌아서며 확대되는 스크럽 영상 | 오렌지 렌즈 선글라스 실사 사진을 렌즈 중심으로 확대 → 주황 | 인물(AI 렌더로 보이는 영상) 대신 실존 인물 없는 물체 사진. 흐름(인물 → 렌즈 → 주황 → 문장)은 같다 |
| 히어로 제목 `mix-blend-mode: difference` | 결과 색 `#131c37` 을 직접 칠함 | 모작 구조에서 `.hx` 가 transform 으로 쌓임 맥락을 만들어 합성이 흰색으로 나와서. 화면 결과는 같다 |
| three-globe WebGL 지구본 | 캔버스 2D 정사영 위경선(10° 간격, 30°마다 진함) | 3D 대신 2D 코드 구현(PROTOCOL 2절). 대륙 선은 원본에도 없음 |
| 문장 구역 USDZ 3D 빨간 물체(iframe) | CSS 3D 빨간 막대 3개 회전 | 3D 모델 대신 CSS. 크기·이동 경로 같음 |
| Lenis 관성 스크롤 | 네이티브 스크롤 | PROTOCOL 4-5 허용. 높이·고정 구간은 같음 |
| 프로젝트 쌓임 영상(모니터 목업) 2 | 사진 2 | 원본 영상은 의뢰처 화면. 모작은 실사 사진 |
| 메뉴 사진 띠(앱 화면 캡처) | 프로젝트 카드 사진 3장 흐름 | 원본 앱 화면 대신 |
| 알약 안 "liquid glass" SVG 필터 | 135° 흰 그라데이션 층만 | 원본도 opacity 0→1 층. 굴절 필터는 생략 |
| 종이 질감 2d 캔버스 60여 개 | 생략 | 거의 보이지 않는 노이즈 |
| 주황 `#f43c00` | `#d93500` | 대비 4.5:1 (접근성 최소선) |
| 폼 오류: 브라우저 기본 말풍선 | 칸 아래 문구 | 접근성 최소선, 제출은 막음 |
