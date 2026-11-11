# SPEC: ViV 모작 → HoH MGMT

## 출처

- **원본 URL**: https://vivmgmt.com/ (`lang="en"`)
- **어워드**: Awwwards Site of the Day · **2026-11-06** · SOTD 7.28/10 (Design 7.47 · Usability 7.05 · Creativity 7.14 · Content 7.55) + **Developer Award 7.3/10** (Semantics/SEO 7.60 · Animations/Transitions 7.00 · Accessibility 7.20 · WPO 7.60 · Responsive 7.20 · Markup/Meta 7.00)
- **어워드 링크**: https://www.awwwards.com/sites/viv (2026-11-11 WebFetch 로 읽음. awwwards.com 은 curl·Chrome 캡처를 막아 화면 캡처는 없다)
- 크레딧: **Sam Dallyn** (PRO). 태그 Design Agencies · Photography · Clean · Flat Design · Minimal · Photo & Video. 기술 표기 Figma. 어워드 팔레트 `#000000` · `#ffffff`
- 어워드 설명(요약): 뉴욕의 아티스트 매니지먼트 · 프로덕션 회사의 새 아이덴티티와 사이트. 소속 작가와 프로덕션 작업을 앞에 세운다
- 모작 날짜: 2026-11-11 · 모작 이름: **HoH MGMT** — 가상의 사진가 에이전시 겸 프로덕션. 2026-11-11 웹 검색 `"HoH MGMT" photographer agency artist management production` 결과에 같은 이름의 에이전시가 없다. 메일은 예약 도메인 `hohmgmt.example`.

### 대상 선정 근거 (2026-11-11)

`research/2026-W46/targets.md` 가 없어 여기 남긴다.

| 항목 | 내용 |
|---|---|
| 고른 사람 | **사용자가 제시된 목록에서 직접 골랐다(2026-11-11)** — PROTOCOL 9절 3번 확인 끝. 목록을 만든 것은 이 작업을 맡긴 세션이고, 이 문서에는 고른 결과만 있다 |
| 수상 | Awwwards SOTD 2026-11-06 + Developer Award (위 링크에서 직접 확인) |
| 언어 | 영어(`lang="en"`) → 영어 모작 |
| 페이지 수(실측) | `/sitemap-0.xml` **134경로**: `/` · `/about` · `/all` · `/artists` · `/artist/<작가>` 8 + 분류 48 · `/directors` · `/director/danielle-moore` + 프로젝트 5 · `/news` + 글 49 · `/production` + 글 16. 사이트맵 밖에 404 — **멀티페이지** |
| 내비게이션(실측) | 머리: Artists(+) · 가운데 표식(홈) · News / About / All · Production(+). 꼬리: Artists 9 · Explore 4 · Connect 3. `/directors` 는 어떤 메뉴에도 없다(사이트맵에만). 디렉터 1명은 Artists 목록과 꼬리말에 작가와 함께 나온다 |
| 기능(실측) | Artists 덮개(끝없는 목록 · hover 사진 · 바탕색 · 분야 표시), 작가 격자 2종 전환 · 분류 판 · Load more · Bio 전환 · 아래 막대, 사진 확대 보기(좌우 키 · Esc), All 의 끝없는 판(휠 · 끌기 · 확대), 커서를 따라오는 사진(꼬리말 · Next · 메일), 모바일 버거 메뉴, 홈 등장 · 사진 띠 · 글자 등장 · 꼬리말 시차 |
| WebGL(실측) | **캔버스 0 · WebGL 없음**(13개 페이지 종류 모두 `canvas` 0 — 스크래치 probe1). 영상은 Mux(`mux-video`) — 홈 사진 띠 일부, 뉴스 카드 일부, 확대 보기 → PROTOCOL 2절 2D 사이트 |
| 문서 높이(1440) | `body{overflow:hidden}` + `main{height:100svh;overflow:auto}` 구조라 도구가 재는 문서 높이는 전부 **900**. 실제 길이는 `main.scrollHeight`: 홈 5319 · news 11023 · about 6373 · production 3846 · directors 1906 · artist 4248 · artist 분류 2770 · director 2433 · director 프로젝트 5310 · news 글 2310 / 2485 · production 글 6032 / 8437 · all 900(판 4147×6523) · 404 1199 |
| 같은 업종 | W39–W46 모작에 사진가 에이전시가 없다. 포트폴리오 계열(W44 brandon-yasin 등)과 달리 「소속 작가 여럿 + 뉴스 + 프로덕션 사례」 구조이고, 사진만 색을 갖는 흑백 2서체 체계다 |
| 탈락시킨 후보 | 이 세션은 후보 목록을 받지 않았다(사용자가 고른 대상만 전달받음). 기록 없음 |

## 근거 자료

| 자료 | 경로 |
|---|---|
| capture-site.mjs (12페이지, 첫 화면 + 390 홈 + computed style) | `refs/<home·artists·news·about·all·production·directors·artist--arturo-torres·…>/00-full.jpg` · `refs/home/90-mobile-390.jpg` · `refs/measure.json` |
| 전체 길이 캡처(Playwright 로 `main` 을 900px 씩 내려 이어 붙임) + 요소 좌표 · 글자 실측 | `refs/<페이지>/full-1440.jpg` · `full-390.jpg` · `geo-1440.json` · `geo-390.json` (16종 · 390 은 11종), 길이 요약 `refs/_summary-*.json` |
| 상태별 캡처(Playwright 스크립트로 실제 클릭 · hover · 키) 95장 | `refs/states/` — 홈 등장 150–4500ms 9장 · 홈 스크롤 10위치 · 머리 hover · Artists 열림 100–3000ms · 이름 hover 250ms/끝 · 닫힘 · 작가 등장 · 분류 판 200/500/1200ms · hover · 격자 전환 250/700/1600ms · Bio · 확대 200–1600ms · 다음 · Esc · All 휠/끌기/확대/복귀 · 꼬리말 hover · Next hover · 메일 hover · about 스크롤 5위치 · 디렉터 Bio · 390 메뉴 250ms/열림/닫힘 · 390 artists · all · artist |
| 라이브러리 · 전환 · 이징 · 상태 규칙 | `refs/origin/origin.md`(홈) · `refs/origin-<news·about·artists·artist·production-detail·all>/` |
| 모션 녹화 | 원본 `refs/motion-origin/`(홈) · `motion-origin-artists/` · `motion-origin-artist/` · 모작 `refs/motion-mine*/` · 비교 `refs/motion-compare*.html` |
| 모작 실측 · 캡처 | `refs/origin-mine*/` · `refs/mine/<페이지>/full-1440.jpg · full-390.jpg` · `refs/mine-states/` · `refs/clicktest.json` |

### 캡처에서 막힌 것과 우회 (사실대로)

1. **스크롤이 `main` 안에 있다.** `capture.mjs` · `capture-site.mjs` · `extract-origin.mjs` 는 문서를 스크롤하므로 원본에서 첫 화면(900px)만 찍고 문서 높이를 900 으로 잰다. 전체 길이와 섹션 좌표는 Playwright 로 `main` 을 스크롤해 따로 떴다(위 표 2행). `record-motion.mjs` 의 휠은 `main` 에 그대로 먹는다.
2. **Mux 영상이 안 돈다.** 이 컨테이너의 Chromium 은 HLS 코덱을 못 풀어 원본에서 `manifestIncompatibleCodecsError` 가 난다(홈 6건, all 64건). 영상 자리는 포스터와 자리 색으로만 읽었다.
3. **원본 CSS · JS 를 읽었다.** 토큰(`--space-*` clamp 식) · 브레이크포인트 · 전환 값은 원본 스타일시트(`/_astro/seo.*.css`)에서, 홈 등장 · 순환 · 확대 보기 · All 판의 지속시간과 이징은 원본 스크립트의 GSAP 호출 값에서 읽어 7절 표에 옮겼다. 코드는 옮기지 않았다 — 모작은 GSAP · swup · Packery 없이 바닐라 JS 와 CSS 로 같은 결과를 냈다.
4. 원본 폼은 없다(문의는 전부 `mailto:`).

라이브러리(원본): Astro · swup(페이지 전환) · GSAP(ScrollTrigger · SplitText · Flip · Observer) · Lenis(`main` 래퍼) · Packery(벽돌 쌓기) · Mux 플레이어 · DatoCMS 이미지 · Modernizr(`no-touchevents`).
모작: Lenis 1.3.26(jsdelivr) + 바닐라 JS + CSS.

## 1. 사이트 구조

### 원본

```
/                       홈: 로고 + 한 줄 → 사진 띠(작가 5명 × 4장, 130vw) → 문장(96px) → News 6 → All News → 꼬리말
/artists                덮개 페이지: 작가 9명 이름(96px)이 끝없이 돈다. 왼쪽 가운데 Photography / Motion / Creative, 오른쪽 위 ✕
/artist/<작가> 8        이름 + 「All (188)」 → 4단 격자 24장 → Load more → 아래 막대(Work · Bio · Contact | 격자 2종)
/artist/<작가>/<분류> 48  같은 틀, 그 분류 사진만
/directors              Directors → 카드 1
/director/<이름>        이름 → 프로젝트 5(3단) → 아래 막대(Projects · Bio)
/director/<이름>/<프로젝트> 5  제목 → 글 · Client · Role → 사진 블록 → Next
/news                   News → 3단 벽돌 쌓기 49
/news/<글> 49           제목(대문자 96px) → 글(반 폭) → 갤러리 → Next
/production             Production(오른쪽 정렬) → 3단 16
/production/<글> 16     제목 → 전폭 사진 → 글 · Client · Role → 홀로 선 사진 · 갤러리 → Next
/about                  문장 2줄(이탤릭) + 큰 글 3문단 / 오른쪽 고정 연락처 3 → 작은 글 → Prep · Shoot · Post → 사진 2
/all                    사진 80장이 8칸 판으로 사방에 끝없이 돈다
404                     Page Not Found + 한 줄 → 꼬리말
꼬리말(모든 페이지, artists · all 제외) · 머리(artists 에서는 숨김)
```

### 재현 (113페이지)

| 원본 | 모작 파일 |
|---|---|
| / | `index.html` |
| /artists | `artists/index.html` |
| /artist/<작가> 8 + 분류 48 | `artist/<슬러그>/index.html` 8 + `artist/<슬러그>/<분류>/index.html` **26** |
| /directors · /director/… + 프로젝트 5 | `directors/index.html` · `director/dalia-whitlock/index.html` + 프로젝트 5 |
| /news + 49 | `news/index.html` + `news/<슬러그>/index.html` 49 |
| /production + 16 | `production/index.html` + `production/<슬러그>/index.html` 16 |
| /about · /all · 404 | `about/index.html` · `all/index.html` · `404.html` |

생성: `node build.mjs` (내용 `data.mjs`, 사진 목록 `credits.json`, 스타일 `src/*.css`, 동작 `src/*.js`, 로고 · 아이콘 `src/svg.mjs`). 결과는 페이지마다 HTML 한 파일, CSS · JS 인라인(PROTOCOL 4-4). 페이지 종류마다 필요한 CSS · JS 만 넣는다(홈은 base + home, 작가는 base + artist …). 링크는 `…/index.html` 로 걸어 `file://` 로도 이어진다.

### 줄인 것 · 바꾼 것

- **분류 48 → 26.** 원본 작가는 분류가 3–10개, 사진이 수십–188장이다. 모작은 작가마다 분류 2–4개 · 사진 14–26장. 목록(분류 판)에 나오는 분류는 전부 만든 페이지로 간다.
- **Load more 묶음 24 → 18.** 사진 수가 적어 24 로 두면 버튼이 나오는 작가가 없다. 18 이면 4명에게 나온다.
- 뉴스 49 · 프로덕션 16 · 디렉터 프로젝트 5 · All 80칸은 원본과 같은 수.
- 이름 · 클라이언트 · 문구는 전부 가상. 작가 9명은 원본과 같은 구성(사진가 8 + 크리에이티브 디렉터 1, 이름순)이고, 원본 뉴스 제목의 실제 브랜드는 지어낸 이름(Saltline · Okra Market · Kestrel Optics …)으로 바꿨다.
- 문구는 원본과 같은 길이 대역 · 같은 짧은 말투로 새로 썼다. 원본 선언 「… is artist management. … is production.」 은 「HoH manages artists. HoH runs productions.」, Artists 의 분야 글자 Photography / Motion / Creative 는 Stills / Motion / Direction, about 세 단 제목 Prep · Shoot · Post 는 Plan · Shoot · Finish 로 — 이름만 바꾼 복사가 되지 않게 했다. 머리 · 버튼 라벨(Artists · News · About · All · Production · Work · Bio · Contact · Load more · Next)은 기능 이름이라 그대로다.
- 로고는 직접 그렸다: 굵은 기둥 + 가는 기둥의 H 둘과 가운데 원 — `HoH`(560×216 판). 머리 가운데 표식은 그 축소형(굵은 막대 · 원 · 가는 막대, 46×23). 원본 로고(ViV, 543×216)의 「굵은 획 묶음과 가는 획 묶음이 양쪽에서 열리는」 등장만 같게 했다.
- 외부 링크: 작가 Instagram → 플랫폼 첫 화면, LinkedIn · Instagram(꼬리말) → 플랫폼 첫 화면. 작가 Website 는 가상 도메인이라 글자로만 뒀다(죽은 링크를 만들지 않으려고). Contact 는 `mailto:`.
- 영상(Mux) 자리는 전부 사진.

## 2. 그리드 실측 (1440px)

`.container-fluid{padding:0 10px}` + `.row{margin:0 -5px}` + 칸 `padding:0 5px` → 내용 시작 x 10, 끝 x 1430. 12칸 퍼센트 폭.

| 항목 | 원본 실측(`refs/*/geo-1440.json`) | 모작 |
|---|---|---|
| 머리 | fixed, 위 20 · 좌우 10. 세 묶음 75% / 16.667% / 8.333%: Artists(+ 20×20, 글자 x59) · News x1078 / About x1128 / All x1182 · Production x1312(+ x1400). 가운데 표식 45×23 x698 y20 | 같음 (표식 46×23) |
| 제목(하위 페이지) | y150(`--space-5xl`), 96px 한 줄, 아래 37.5(`--space-m`) → 내용 y284 | 같음 |
| 3단 목록 | 칸 폭 `calc(33.333% − 10px)` = 463, x 10 · 483 · 957, 세로 간격 60(아래 여백 50 + 홈통 10), 제목 14px 이 사진 아래 10 | 같음 |
| 작가 격자 | 4단 347 + 간격 10 (x 10 · 367 · 724 · 1081), 991 이하 3단 | 같음 |
| 작가 큰 격자(editorial) | 한 쌍 60/40(846 + 564) ↔ 홀로 60–80% 를 번갈아, 정렬 좌 · 중 · 우 무작위 | 같음(홀로 65–80%) |
| 작가 머리줄 | 이름 x10 y153 / 오른쪽 「(188) All」 x1309, 둘 다 96px. 아래 9(`--space-xs`) → 격자 y261 | 같음 |
| 아래 막대 | 가운데, bottom 20, 283×54, 검정. 버튼 안쪽 20 12.5, 글자 14px | 같음 |
| 글 페이지 | 글 칸 50%(뉴스 p 705, 프로덕션 p 635 = 90%) · Client x720 · Role x1078(각 25%) · 전폭 사진 1420 · 정보 아래 112.5(`--space-3xl`) · 블록 간격 10 · 갤러리 4단 347 · Next 버튼 가운데(위 75) | 같음 |
| 홀로 선 사진 · 버튼 | 글 속 홀로 선 사진 폭 42–74%(596 · 682 · 696 · 880 · 1008 · 1022 · 1051px), 정렬 좌 · 중 · 우. 버튼(All News · Load more · Next): `#ebebeb`, 14px 500 행간 100%, 안쪽 `--space-s`(18.75) → 높이 52 | 같음(폭 40–74%) |
| about | 왼쪽 8/12(943) · 오른쪽 연락처 3/12(x1077, 1칸 띄움) `sticky top 150` · 큰 글 들여쓰기 9vw · 작은 글 반 폭(710) · 세 단 436 × 3(간격 56) · 사진 48% 왼쪽 / 62% 오른쪽 | 같음 |
| 홈 | 로고 left 18vw(259) · 폭 40vw(576) · y270(= 30vh) / 한 줄 x864 폭 300 / 사진 띠 130vw 를 −15vw 에 · 기둥 5 × 362.4 간격 10 · 2 · 4번 기둥 22.5vw, 3번 9.5vw 아래 · 사진 3:4 4장 + 이름 · 띠 높이 2318, 아래 −30vw 겹침 / 문장 y2156 / News 위 30vh / 6장 3단 / All News 버튼 가운데 | 같음 |
| artists | 줄 높이 136(96 + 위아래 20) · 이름 x468(32.5vw) · 사진 화면 한가운데 고정(2:3 은 21.5vw, 3:2 는 30vw) · 왼쪽 가운데 글자 x20 y450 · ✕ 오른쪽 위 20 | 같음 |
| all | 판 8칸 × 10vw(144), 간격 8vw(115), 안쪽 4vw(58) → 한 벌 2074×3261, 2×2 로 깔아 4147×6523. 줄 안에서 세로 가운데 정렬 | 같은 수치. 깔지 않고 화면 안 칸만 그린다(12절) |
| 꼬리말 | 위 112.5 띄우고 100svh. 문장 칸 50%(43.2px/90%) · 링크 칸 16.667% × 3(x720 · 958 · 1197, 제목 14px, 링크 24px/110% 간격 9.4) · 아래 줄: 로고 41.667%(586×233) + © 오른쪽 아래 · 어두운 막 `#201d1d` 10% | 같음(로고 판 560×216) |
| 991 이하 | 머리: Artists · Production 세로쓰기, 가운데 버거 / 목록 1단 / 작가 격자 3단 / 홈 사진 띠 2기둥(폭 100%) · 로고 위에 한 줄 / 꼬리말 2단 / 제목 위 여백 210 | `refs/*/full-390.jpg` · `refs/states/m390-*.jpg` 를 보고 같게 |
| 767 이하 | 글 블록 1단 · about 연락처가 위로 · 갤러리 2단 | 같음 |

브레이크포인트: 375 · 550 · 768 · 992 · 1200 · 1500 (그리드 정의), 실제 배치가 바뀌는 곳은 **992** 와 768.

### 문서 길이

11절 표(원본 · 모작 나란히).

## 3. 타이포

원본 서체 둘 다 상용(자체 호스팅 woff2): **Garamond Narrow** Regular · **Helvetica Now Display** Regular/Medium. 대체는 같은 낱말을 그려 폭으로 골랐다(스크래치 `fontcmp*.mjs`): 「Arturo Torres」 96px 가 원본 443px.

- 세리프: Instrument Serif 430px 이 가장 가까웠지만 impeccable `overused-font` 에 걸린다. 그다음 **Libre Caslon Condensed** 495px(Linden Hill 505 · EB Garamond 512 · Cormorant Garamond 524 · Newsreader 556). 좁은 올드스타일에 살아 있는 이탤릭이 있어 인상이 가장 가깝다. 폭 12% 차이는 크기 96 → **90px**(줄 상자는 96 그대로) + 자간 −0.02em 으로 메웠다 → 「Anouk Ferreira」 류가 원본과 같은 자리에서 끝난다. 획이 원본보다 굵다(가는 굵기가 없다).
- 산세리프: **Inter Tight** 400/500 — 24px 「Arturo Torres」 원본 140px, 모작 138px.

| 역할 | 원본 | 모작 |
|---|---|---|
| 큰 제목 · 이름 · about 큰 글 · 홈 문장 | Garamond Narrow `clamp(40px, 13vw, 96px)`, 1440 이상 6.667vw · 행간 100% · 자간 normal | Libre Caslon Condensed `clamp(37.5px, 12.2vw, 90px)`, 1440 이상 6.25vw · 행간 1.0667(같은 96px 줄) · 자간 −0.02em |
| 중간 세리프(꼬리말 문장 · Bio · 모바일 about) | `clamp(24px, 8vw, 44px)`, 1440 이상 3vw(43.2) · 행간 90%(Bio 110%) · 자간 .01em | `clamp(22.4px, 7.5vw, 41px)`, 2.8vw(40.3) · 행간 .965(Bio 1.18) · 자간 −0.01em |
| 본문 `p` | Helvetica Now Display 24px(991 이하 16px) · 150% · .01em · 400 | Inter Tight 같은 값 |
| 큰 링크(꼬리말 · 메타 값 · 연락처) | 24px(16px) · 110% | 같음 |
| 작은 글(머리 · 카드 제목 · 라벨 · 버튼 · ©) | 14px · 150%(버튼 100%) · .01em · **500** | 같음 |
| 이탤릭 | 홈 문장에서 is · an · and 를 뺀 낱말, about 의 `em`, 꼬리말의 `em` | 같은 규칙(is · a · and 제외) |

타입 배율: 96 → 43.2 → 24 → 14 (×2.2 · ×1.8 · ×1.7). 크기는 넷뿐이다.

## 4. 아이콘

원본: 더하기 +(viewBox 22, 2px 선, 20px 로 표시 — Artists · Production 옆, 45° 돌려 닫기 ✕), 버거 2줄(viewBox 44×39, 4px 선 → 20px 폭), 격자 아이콘 2종(8×8 채움 도형: 네모 넷 / 큰 네모 + 작은 네모 둘, 높이 9px), 가운데 표식(반원 44×22). 전부 직접 그린 선 · 채움 도형이고 아이콘 세트가 아니다.
모작: 같은 판 크기 · 선 굵기로 SVG 를 새로 그렸다(`src/svg.mjs`). 색은 `currentColor`.

## 5. 색

| 역할 | 원본 | 모작 |
|---|---|---|
| 바탕 | `--color-page-bg #ffffff` | 같음 |
| 글자 · 선 | `--color-page-text #000000` | 같음 |
| 버튼 바탕 | `#ebebeb`(All News · Load more · Next) | 같음 |
| 사진 자리 색 | `#e8e8e8` 또는 사진마다의 대표색(인라인 `background-color`) | `#e8e8e8` + 사진마다 평균색(`credits.json` 의 `color`) |
| 꼬리말 막 | `#201d1d` 불투명도 .1 (드러나는 동안 .5 → .1) → 흰 바탕 위 `#e9e8e8` | 같음 |
| 모바일 메뉴 열림 | `main` 바탕 `#201d1d1a` | 같음 |
| 아래 막대 | 바탕 `#000`, 비활성 글자 `#878787`, 활성 `#fff` | 같음(`#878787` 대비 5.8:1) |
| 작가색 | 작가마다 파스텔 1색(`data-color` `#D3B6AA` · `#B1BDCA` · `#CE8EAC` · `#D3C4AD` …). Artists 덮개 hover 와 꼬리말 이름 hover 때 바탕이 그 색으로 0.5s | 작가 9명에 파스텔 1색씩(`data.mjs` `color`) |
| 선택 | `::selection` 검정 바탕 흰 글자 | 같음 |

색은 흑 · 백 · 회색 둘. 색면은 사진과 작가색뿐이다.

## 6. 간격

토큰(원본 `:root`, 그대로 받음): `--space-xs clamp(.3125rem, .2344rem + .3906vw, .625rem)` · `-s clamp(.625rem, .4688rem + .7813vw, 1.25rem)` · `-m clamp(1.25rem, .9375rem + 1.5625vw, 2.5rem)` · `-l clamp(1.875rem, 1.4063rem + 2.3438vw, 3.75rem)` · `-xl clamp(2.5rem, 1.875rem + 3.125vw, 5rem)` · `-3xl clamp(3.75rem, 2.8125rem + 4.6875vw, 7.5rem)` · `-5xl clamp(5rem, 3.75rem + 6.25vw, 10rem)`.
1440 에서 **9.4 · 18.75 · 37.5 · 56.25 · 75 · 112.5 · 150**. 그 밖의 반복 수치: 5 · 10(홈통 · 가장자리) · 20(머리 위 · 고정 요소 가장자리) · 40 · 50(카드 아래) · 30vh(홈 구획 사이) · 9vw(들여쓰기) · 210(991 이하 제목 위).

## 7. 모션

이징 실측(`refs/origin*/origin.md` 전환 표 + 원본 스크립트의 GSAP 값). CSS 전환은 대부분 `ease`: 0.5s(머리 숨김 · 밑줄 · 사진 페이드 · 바탕색) · 0.3s · 0.25s · 0.7s `ease-in-out`(더하기 회전) · 0.35s `cubic-bezier(.23,1,.32,1)`(버거) · 0.75s `cubic-bezier(.65,0,.35,1)`(`main` 변환) · 1.2s `cubic-bezier(.16,1,.3,1)`(Artists 사진 열림) · 0.6s `cubic-bezier(.19,1,.22,1)`(아래 막대). `@keyframes` 3개: `artistsClose` · `artistsStrapline` · `itemLoad`. 나머지는 GSAP 인라인. 모작은 GSAP 의 power 곡선을 같은 모양의 `cubic-bezier` 로 옮겼다(power1.out `.5,1,.89,1` · power2.out `.33,1,.68,1` · power2.in `.32,0,.67,0` · power2.inOut `.65,0,.35,1` · power3.out `.25,1,.5,1` · power3.inOut `.76,0,.24,1` · expo.inOut `.87,0,.13,1` · sine.inOut `.37,0,.63,1`).

| 무엇 | 원본 실측 | 모작 | 근거 |
|---|---|---|---|
| 페이지 들어옴 · 나감 | `.main` op 0→1 0.4s power2.out / 나갈 때 1→0 0.5s power2.in (swup) | 같은 값. 링크를 누르면 0.5s 뒤 이동 | 원본 스크립트 · motion-origin-artists 인라인 `div.main` |
| 머리 가운데 표식 | 홈 · artists 에서는 top −100, 나머지는 0.6s power2.out 으로 20 까지(지연 0.3s, 작가 페이지 1.1s) | 같음 | `refs/states/artist-load-*.jpg` |
| 머리 hover | 더하기 90°(Production 은 −90°) 0.7s ease-in-out, 글자 밑줄 `scaleX 0→1` 0.5s(오른쪽에서 닫히고 왼쪽에서 열림), 현재 페이지는 늘 1 | 같음 | `refs/origin/origin.md` 호버 실측 |
| 홈 등장(세션 첫 방문) | 사진 띠 `scale 1.3 · y 5vh`(위 가운데 기준) · 사진 op 0 → 첫 사진들이 뜨면(최대 2s) 사진 op 1 0.8s power1.out 0.04s 간격 → 0.6s 뒤 띠 1 · 0 으로 1.6s power2.out, 로고 두 묶음이 좌 · 우에서 1.6s power3.inOut 으로 열림 → 한 줄 op 1 0.6s. 그동안 스크롤 잠김. 두 번째부터는 생략(`sessionStorage`) | 같은 값 · 같은 순서(`hoh-home-intro`) | `refs/states/home-load-*.jpg` · motion-origin 인라인 `img.c-home__gallery-media` op 0→1 |
| 홈 사진 띠 좌우 | 띠 130vw, 마우스 x 비율로 0 ↔ −30vw, 프레임마다 5% 씩 따라감, 벗어나면 가운데(−15vw) | 같음 | 원본 스크립트 · `refs/states/home-load-4500.jpg` |
| 홈 기둥 시차 | 휠 `deltaY/2` 만큼 기둥이 더 올라감(최대 기둥 높이의 절반), 기둥마다 따라오는 속도 다름(0.5 · 0.8 · 0.2 · 0.3 · 0.6s power3) | 스크롤 위치의 절반(같은 양) · 같은 속도 차. 키보드 스크롤에도 먹는다 | 스크래치 home.json(휠 60회 좌표) |
| 홈 순환(맨 위에서 가만히) | 기둥마다 0.62s 간격으로: 위 두 장 `y 70` 1s power1.inOut + op 0 0.9s → 첫 장을 다음 사진으로 교체(자리 색 0.5s) → `y 0` 1s + op 1 0.85s. 한 바퀴 뒤 3s 쉼. 스크롤하면 멈추고, 맨 위로 돌아와 3s 뒤 다시 | 같은 값. 순환 중 스크롤 잠금은 뺐다(12절) | 원본 스크립트 · `refs/mine-states/home-cycle-down.jpg` |
| 홈 문장 | 글자마다 `op 0 · scale .6 · rotate ±20°(무작위)` → 제자리, 0.03s 간격, power4, 스크롤에 묶임(문장 위가 화면 아래에 닿을 때 → 문장 아래가 화면 30% 에 올 때) | 같음 | `refs/states/home-scroll-01488.jpg` · `-01988.jpg` |
| 사진 로드 | 자리 색 위로 사진 op 0→1 0.5s ease. 작가 격자는 로드 0.6s 뒤 시작 + 덮개 `::before` op 1→0 0.3s ease 지연 0.5s | 같음 | motion-origin-artist `opacity 500 ease ×25` · `opacity 300 ease 지연 500 ×23` |
| Artists 열림 | 목록 op 0→1 0.4s(지연 .05), 스크롤 1000 → 0 을 1.5s cubic-out, 줄마다 `padding-left 50px × n → 0` 1.5s(`itemLoad`), ✕ `translateY(−40px)→0` 1s, 왼쪽 글자 `translateX(−125%)→0` 1s | 같음 | motion-origin-artists `itemLoad 1500 ×54` · `artistsClose` · `artistsStrapline` |
| Artists 이름 hover | 이름 `margin-left −100px` 0.3s, 사진 `clip-path inset(36px)→0` 1.2s `(.16,1,.3,1)` + op 1, 바탕색 0.5s, 그 작가가 하지 않는 분야 op .25 0.25s. 터치 기기는 화면 가운데에 가장 가까운 이름이 켜진다 | 같음 | `refs/states/artists-hover-*.jpg` · motion-origin-artists |
| 작가 아래 막대 | 1.1s 뒤 `bottom −10rem → 20px` 0.6s `(.19,1,.22,1)`. hover: 폭 넓어짐(padding 0 20px 0.3s) + `scale 1.06` + 버튼이 6px 씩 벌어짐 0.3s power2.out. 작가 영역 끝이 화면 아래에 닿으면 `y 200%` 0.4s power2.in | 같음 | motion-origin-artist `bottom 600 (.19,1,.22,1)` |
| 분류 판 | 판 `clip-path inset(0 0 100% 0)→0` + 격자가 같은 높이만큼 내려옴 0.65s `(.23,1,.32,1)`, 항목 `y 110%→0` 0.04s 간격, 「/」 op .3, 버튼 글자 All → Close(위로 빠지고 아래서 들어옴), 아래 막대 숨김. 닫힐 때 항목 `y −110%` 0.02s 간격. 분류를 누르면 닫힌 뒤 격자 op 0 0.4s → 페이지 전환 없이 이동 | 같음 | `refs/states/artist-filter-200 · 500 · 1200.jpg` |
| 격자 전환 | 맨 위로(0.5–1.6s, 스크롤 양/800) → 칸들이 새 자리 · 크기로 0.7s expo.inOut(Flip) | 같음(WAAPI 로 이전 좌표 → 새 좌표) | `refs/states/artist-view2-250 · 700 · 1600.jpg` |
| Bio 전환 | 격자 op 0 0.25s → 맨 위로 0.5s → Bio op 1 0.3s. 돌아올 때 반대 | 같음 | `refs/states/artist-bio-300 · 900 · 2000.jpg` |
| 확대 보기 | 흰 바탕 0.3s linear + 사진이 썸네일 자리에서 가운데로 0.55s power3.out. 다음 · 이전: op 0 0.2s → op 1 0.25s. 닫힘: 썸네일 자리로 0.45s power2.inOut, 바탕 0.3s power2.in 지연 0.18s | 같음 | `refs/states/artist-zoom-200 · 500 · 900.jpg` |
| 커서를 따라오는 사진 | 240×320 상자가 커서 +20px(Next 는 커서 위, 메일은 커서 왼쪽). 안쪽 틀 `(−100%,−100%)→0` 과 사진 `(100%,100%)→0` 이 동시에 0.4s power5.out, 나갈 때 0.3s. 꼬리말은 90% 넘게 드러났을 때만 | 같은 값(`cubic-bezier(.11,1,.26,1)`) | `refs/states/footer-hover-150.jpg` · `next-hover-150.jpg` |
| 꼬리말 | 드러나는 동안(꼬리말 위가 화면 아래 → 위) 안쪽 `y −25% → 0`, 막 `.5 → .1`, 절반 넘으면 머리 숨김(0.5s). 로고는 화면에 들어올 때 한 번 양쪽에서 열림 1.6s power3.inOut | 같음 | 스크래치 home.json(`footc matrix … −225 → 0`) |
| All | 휠 · 끌기(끌기는 2배)로 판이 움직이고 1.5s power4 로 따라감, 사방으로 이어짐. 칸을 누르면 그 칸의 짧은 변이 화면 짧은 변의 75% 가 되게 0.75s power3.inOut 확대 + 왼쪽 아래 작가 이름 링크 op 1 0.3s(지연 0.5s). 다시 누르면 복귀 | 같음(따라가는 곡선은 지수 감쇠로 근사) | `refs/states/all-*.jpg` · 스크래치 probe5(`matrix(4.6875 …)`) |
| 모바일 메뉴 | 판 op 0→1 · `y −6 → 0` 0.5s, 항목 op · y 6 → 0 0.35s 지연 .25 / .31 / .37 / .43s, 버거 두 줄이 ±45° 0.35s `(.23,1,.32,1)`, `main` 바탕 10% 어두워짐 | 같음 | `refs/states/m390-menu-250.jpg` · `m390-menu-open.jpg` |
| 관성 스크롤 | Lenis(`main` 래퍼), Artists 는 `infinite` | Lenis 1.3.26 같은 구성 | origin 라이브러리 |

옮기지 못한 것:
- **영상**(홈 사진 띠 · 뉴스 카드 · 확대 보기 안 영상과 재생 컨트롤 · 커서 사진의 영상). 사진으로 대신했다.
- **swup 페이지 전환**(머리가 남고 내용만 바뀜). 모작은 보통 페이지 이동 + 같은 페이드.
- All 확대 뒤 고해상도 사진으로 바꿔 끼우는 것(`w=2000`). 모작 사진은 한 크기다.

`prefers-reduced-motion`: Lenis 끔, 홈 등장 · 순환 · 시차 · 글자 등장 없이 바로 보임, 전환 · 애니메이션 시간 0, 확대 보기는 날지 않고 뜸.

## 8. 기능 목록

| 기능 | 원본 | 모작 동작 | 확인 |
|---|---|---|---|
| 드롭다운 / 메가메뉴 | 없음. Artists 는 덮개처럼 보이는 **별도 페이지**(`/artists`, swup 전환) | `artists/index.html` 로 이동. ✕ · Esc → 홈(원본 ✕ 도 `href="/"`) | 11절 |
| 모바일 버거 메뉴 | 991 이하. 흰 판이 위에서(Home · News · About · Contact), `aria-expanded` · `aria-hidden`, 바깥 클릭 · 링크 클릭으로 닫힘 | 같음 + Esc, 열린 동안 배경 스크롤 잠금 · `inert` | 11절 |
| 탭 | 작가 아래 막대 Work · Bio(내용 교체), 격자 2종(4단 · 큰 격자) | 같음. `aria-pressed` 가 따라감 | 11절 |
| 아코디언 | 분류 판(작가 이름 옆 「All (n)」): 눌러 펼치고 다시 눌러 접음 | 같음 + Esc, `aria-expanded` · `aria-controls` · `inert` | 11절 |
| 캐러셀 | 없음(확대 보기 안의 이전 · 다음이 가장 가깝다) | — | — |
| 모달 / 라이트박스 | 사진 클릭 → 흰 덮개 + 큰 사진. 좌우 키 · 스와이프, 닫기는 Esc · 바탕 · 사진 클릭. 버튼 없음 | 같음 + `role=dialog`, 포커스 가둠 · 복귀, Tab 하면 보이는 Previous · n / N · Next · Close 버튼 | 11절 |
| 필터 / 정렬 | 분류 판의 분류 링크 → 분류 URL(`/artist/x/sports`)로 이동해 그 사진만 | 같음(분류 페이지 26) | 11절 |
| 더 보기 | Load more (n) — 24장씩 | 18장씩, 남은 수 표시, 다 보이면 버튼 사라짐, 새 사진에 포커스 | 11절 |
| 폼 | 없음(Contact 는 전부 `mailto:`) | 없음 | — |
| Artists 덮개 | 끝없는 목록 · 이름 hover 사진/바탕색/분야 | 같음(키보드 포커스에도) | 11절 |
| All 판 | 휠 · 끌기 · 확대 · 작가 이름 링크 | 같음 + 화살표 키 이동, 칸이 버튼(Enter 확대 · Esc 복귀) | 11절 |
| 커서 사진 | 꼬리말 작가 9 · Next 버튼 · about 메일 3 · Bio 의 이름 | 같음 | 11절 |
| 홈 사진 띠 | 기둥 클릭 → 그 작가 페이지(끌면 무시), 방문마다 9명 중 5명 무작위 | 같음(기둥이 링크) | 11절 |
| 현재 페이지 표시 | 머리 링크 밑줄(`is-active`), 작가 · 디렉터 페이지에서는 Artists | `aria-current="page"` + 밑줄 | 11절 |

## 9. 섹션 순서

- **홈**: (숨긴 h1) 로고 + 한 줄 → 사진 띠 → 문장 → News 6 + All News → 꼬리말
- **artists**: 이름 9(끝없음) · 분야 글자 · ✕
- **artist**: 이름 + 분류 버튼 → (분류 판) → 격자 → Load more → (Bio: Website · Instagram · Select Client List / Biography) → 아래 막대 → 꼬리말
- **director**: 이름 → 프로젝트 5 → (Bio) → 아래 막대 → 꼬리말
- **director 프로젝트 · production 글**: 제목 → (전폭 사진) → 글 · Client · Role → 홀로 선 사진 1–3 · 갤러리 → Next → 꼬리말
- **news 글**: 제목 → 글 → 갤러리 → Next → 꼬리말
- **news · production · directors**: 제목 → 3단 목록 → 꼬리말
- **about**: (숨긴 h1) 문장 2 + 큰 글 3 / 연락처 3 → 작은 글 3문단 → 세 단 15 · 7 · 12줄(원본 Prep · Shoot · Post, 모작 Plan · Shoot · Finish) → 사진 2 → 꼬리말
- **all**: (숨긴 h1) 판 80칸
- **404**: h1 + 한 줄 → 꼬리말
- 원본 Artists 덮개의 이름은 `h3`, 카드 제목도 `h3`(h1 다음 h3). 모작은 `h2`.

## 10. 사진

`node scripts/fetch-stock.mjs … --w 1600 --source unsplash` 로 받았다(32 검색어 · 258장, `refs/photo-raw/`, gitignore). 전부 Unsplash 무료분, Pinterest 는 쓰지 않았다. 쓴 사진 **186장**을 긴 변 1000(전폭으로 쓰는 18장은 1500), JPEG 56–58% 로 줄여 `assets/stock/`(9.4MB). 출처 · 원본 파일 이름 · 작가 키 · 분류 · 평균색은 `credits.json`.

- 작가별 결(원본 작가의 분야에 맞춤): Anouk = 해변 · 친구들 · 스케이트 · 수영(필름 톤), Birgit = 얼굴 클로즈업 · 메이크업 · 피부, Cleo = 화장품 · 꽃 · 음식 · 음료 정물, Dalia = 색면 세트의 패션 · 키즈 · 아이웨어 · 소품, Emre = 흑백 다큐 · 무대 뒤 · 복싱, Gideon = 수영 · 농구 · 트랙 · 운동장, Jerome = 흑백 음악가 초상 · 빨간 배경, Juno = 입술 · 크림 질감, Quentin = 사막의 클래식카 · 운전석 · 폰, 스튜디오 = 빈 스튜디오 · 촬영 현장(about · 프로덕션 갤러리).
- 흰 글씨가 올라가는 사진 자리는 없다(원본 · 모작 모두 글자는 사진 밖).
- 버린 사진(**다른 브랜드 로고 · 글자**): 스우시 · 삼선이 보이는 운동화 6장(an-sneak-01 · 03–07)과 삼선 트랙재킷(da-acc-04) · 러닝화(gi-run-04), 상표가 읽히는 화장품 4장(cl-cosm-02 · 04 · 05 · 09), 라벨 병(cl-drink-04) · 글씨가 긁힌 병(cl-drink-03), 필름 상자(cl-flower-03), 글러브 상표 4장(em-box-01 · 05 · 06 · 07), 현수막 · 포스터(em-box-08 · em-doc-08 · je-bw-06), 공 상표 · 코트 글자(gi-hoops-04 · 06), 등번호 · 유니폼 글자(gi-run-01 · gi-soccer-01 · 03), 「4FT」(gi-swim-01), 벽 문양(je-red-07), 간판(bi-freckle-04 · qu-tech-02), 번호판(qu-car-04), 운전대 엠블럼(qu-driver-02).
- 원본 사진은 받지 않았고 같은 사진을 찾지도 않았다.
- 준비 과정(고르기 → 줄이기 → 평균색)은 스크래치 스크립트로 했다. 결과와 대응표가 `credits.json`(`raw` = 받은 파일 이름)에 있다.

## 11. 대조 · 기능 확인 · 커밋 전 게이트

### 문서 길이 (1440, `main.scrollHeight`, ±15% 기준)

| 원본 | 모작 | 원본 | 모작 | 차 |
|---|---|---:|---:|---:|
| / | `index.html` | 5319 | 5447 | +2.4% |
| /news | `news/` | 11023 | 11314 | +2.6% |
| /about | `about/` | 6373 | 6339 | −0.5% |
| /production | `production/` | 3846 | 3971 | +3.3% |
| /directors | `directors/` | 1906 | 1907 | 0.0% |
| /artist/arturo-torres (24장 + Load more) | `artist/anouk-ferreira/` (18장 + Load more) | 4248 | 3862 | −9.1% |
| /artist/arturo-torres/sports (13장) | `artist/anouk-ferreira/lifestyle/` (11장) | 2770 | 2766 | −0.1% |
| /director/danielle-moore | `director/dalia-whitlock/` | 2433 | 2444 | +0.5% |
| /director/danielle-moore/accessories | `director/dalia-whitlock/accessories/` | 5310 | 4409 | **−17.0%** |
| /news/arturo-torres-x-marine-layer (4장) | `news/anouk-ferreira-x-saltline/` (4장) | 2310 | 2164 | −6.3% |
| /news/danielle-moore-x-old-navy-bts (8장) | `news/dalia-whitlock-x-paper-kite-kids-bts/` (8장) | 2485 | 2773 | +11.6% |
| /production/dolby | `production/vela-audio/` | 6032 | 6449 | +6.9% |
| /production/instacart-super-bowl (홀로 선 사진 3) | `production/okra-market-big-game/` (3) | 8437 | 6525 | **−22.7%** |
| /all | `all/` | 900 | 900 | 0.0% |
| 404 | `404.html` | 1199 | 1199 | 0.0% |

390px: 홈 6705 → 6972(+4.0%) · news 24779 → 24940(+0.6%) · about 5037 → 5025(−0.2%) · production 7329 → 7285(−0.6%) · artist 2580 → 2380(−7.8%) · news 글 2144 → 1897(−11.5%) · production 글 4389 → 4714(+7.4%) · director 3453 → 3690(+6.9%) · directors 1707 → 1518(−11.1%).

처음 잰 값에서 고친 것: news +15.8% → 표지 13장을 가로 사진으로 바꿔 +2.6%. production +15.7% → 세로 표지를 7 → 3장으로. artist −27% → 한 번에 보이는 장수를 12 → 18. director +16% → 프로젝트 표지 2장을 가로 · 정사각으로.
±15% 밖 두 건: 디렉터 프로젝트(−17.0%)와 Big Game 글(−22.7%)은 원본 글이 사진을 더 많이 싣는다(원본 Accessories · Instacart 는 세로 사진 전폭 블록이 여럿). 모작은 그 분류의 사진 6–7장으로 같은 블록 순서(홀로 선 사진 → 갤러리)만 맞췄다. 같은 틀의 다른 글(vela-audio +6.9%)은 범위 안이다.

`/artists` 는 길이를 대조하지 않았다. 원본은 `.c-artists` 안에서 끝없이 돌고(목록을 여러 벌 복제, scrollHeight 4572), 모작은 목록 1벌 + 화면 한 장 복제(2124)다. 보이는 결과(줄 높이 136, 9명이 돌아옴)는 같다.

**도구가 재는 문서 높이**(`extract-origin.mjs`): 원본 900 = 모작 900(7페이지 모두, `refs/origin*/origin.md` · `refs/origin-mine*/origin.md`). **섹션 수**(같은 도구의 「섹션」): 홈 2 = 2(`div.main` + `section` 사진 띠), news · about · artist 1 = 1. **3화면 넘는 섹션**: 원본 `div.main` 한 덩어리 구조라 해당 없음 — 모작도 같다.

### 모션 비교 (`refs/motion-compare.html` · `-artists.html` · `-artist.html`, 1440×900, 로드 5초 + 휠 + hover)

| 페이지 | 원본에만(빨강) | 결과 |
|---|---|---|
| 홈 | 없음 — 같은 서명 2건(`opacity 500 ease` 원본 8 · 모작 8, `visibility 500 ease` 10 · 2) | **빨강 0**. 원본 GSAP 인라인(사진 op 0→1 약 1.1–1.3s 구간 · 띠 scale · 로고 clip · 기둥 y)은 표의 「원본 JS 인라인」 칸 → 같은 값을 JS 로 옮김(7절) |
| Artists | 첫 비교 5건: `itemLoad 1500` · `artistsClose 1000` · `artistsStrapline 1000`(모작이 다른 이름으로 같은 애니메이션을 갖고 있었음) · `background-color 500 ease`(등장 전환 규칙이 덮어 안 걸림) · `span::before transform 500 ease` | 앞의 4건을 옮김 → **빨강 1 남음**: `span::before transform 500 ease` 1회. 원본은 `/artists` 에서 숨은 머리의 Artists 밑줄이 로드 뒤 JS(`is-active`)로 한 번 열린다. 모작은 `aria-current` 로 처음부터 열려 있다. 같은 전환 규칙은 모작에도 있고 홈 녹화에 `span.ul::before transform 500 ease` 로 잡혔다 |
| 작가 | 첫 비교 1건: 사진 덮개 `picture::before opacity 300 ease`(지연 500) ×23 | 옮김(`.at__a::before`) → **빨강 0**. `opacity 500 ease` 25 · 20, `bottom 600 cubic-bezier(.19,1,.22,1)` 1 · 1 |

파랑(모작에만): 페이지 페이드 `opacity 400 (.33,1,.68,1)` · 홈 한 줄 `opacity 600` · 사진 띠 `span.hg__w::before opacity 800` · 표식 `top 600` · 막대 `transform 400` · Artists 목록 `opacity 400 ease`. 원본은 같은 것을 GSAP 인라인으로 해서 CSS 전환으로 잡히지 않는다(같은 시간 · 곡선).

모작 녹화(`refs/motion-mine*`)는 확대 보기 안쪽 여백 한 줄(5vh → 8vh)을 고치기 직전 빌드에서 했다. 녹화 구간(로드 · 스크롤 · hover)에 확대 보기가 없어 결과는 같다. 기능 확인 · 게이트 · 모작 실측은 마지막 빌드에서 다시 돌렸다.

처음에 hover 가 통째로 빠져 보였던 이유: 모작이 hover 를 `@media (hover:hover)` 로 걸었는데 녹화 도구의 Chrome 에서는 이 조건이 거짓이었다 → 원본(Modernizr `no-touchevents`)처럼 터치 지원 여부로 붙이는 클래스(`no-touch`)로 바꾼 뒤 다시 녹화했다.

### 기능 — Playwright 스크립트로 실제 클릭 · hover · 키 입력

Playwright MCP 가 이 세션에 없어(TOOLING 클라우드 세션 항목) Playwright 라이브러리 스크립트로 마우스 클릭 · hover · 휠 · 끌기 · 탭(touch) · 키(Tab · Enter · Esc · 화살표)를 보냈다. **83/83 PASS, 콘솔 · 페이지 오류 0** (`refs/clicktest.json`, 화면 `refs/mine-states/`).

| 묶음 | 확인한 것 |
|---|---|
| 홈 | 등장 시작(로고 닫힘 · 띠 1.3배 · 한 줄 숨김) → 끝(로고 열림 · 띠 362.4px 기둥 5 · 한 줄 · 세션 표시), 등장 중 가로 넘침 0, 마우스 왼쪽 → 띠가 오른쪽으로, 맨 위에서 가만히 두면 첫 사진이 70px 내려갔다 바뀜, 휠 스크롤(Lenis)과 기둥 시차, 문장 글자가 스크롤 따라 섬, 기둥 클릭 → 작가 페이지 |
| 머리 | Artists hover 더하기 90° + 밑줄, News 활성(`aria-current` + 밑줄), 가운데 표식이 20px 로 내려옴 |
| 꼬리말 | 끝까지 내리면 안쪽 0% · 막 .1 · 머리 숨김 · 로고 열림, 작가 이름 hover → 240×320 사진이 커서 옆 + 꼬리말이 작가색, 벗어나면 원래대로 |
| Artists | 열림(머리 숨김 · 페이드 · 맨 위 정착 · 이름 x468), 이름 hover(사진 가운데 열림 · −100px · 바탕색 · 다른 분야 흐려짐), 휠 4500px 뒤에도 목록 안, Esc → 홈, Tab 포커스 링, 이름 클릭 → 작가 |
| 작가 | 아래 막대 1초 뒤 올라옴(bottom 20), 18장 4단 347px, Load more (4) → 22장 · 버튼 사라짐, 막대 hover(넓어짐 · 버튼 벌어짐), 분류 판 열림(높이 · 「Close」 · 분류 4 + 개수 · 막대 숨김) · 항목 hover .7 · Esc 닫힘 + 포커스 · Enter 다시 열림 · Swim 클릭 → `/swim/`(라벨 Swim · (06) · 6장 · 막대 바로 보임), 큰 격자(846 + 564, 홀로 65–80%) ↔ 4단, Bio(격자 숨김 · 40px 세리프 · 분류 버튼 숨김 · `aria-pressed`) · 이름 hover 사진 + 바탕색 · Work 복귀, Contact `mailto:`, 꼬리말 앞에서 막대 떠남 |
| 확대 보기 | 클릭 → 가운데 · 흰 바탕 · `role=dialog` · 「2 / 22」, → 「3 / 22」, ← ← 「1 / 22」, Tab 하면 버튼 보이고 안에 갇힘, Esc 닫힘 + 썸네일로 포커스, 바탕 클릭 · 사진 클릭 닫힘 |
| 뉴스 · 프로덕션 · about · 디렉터 | 3단 좌표(10 · 483 · 957, 463), 카드 hover 밑줄, 카드 → 글(제목 y150 · 글 715 · 갤러리 4단), 갤러리 확대(2 / 4), Next hover 사진이 커서 위 · Next → 다음 글, production 제목 오른쪽 정렬 · 16건 · 활성 표시, 글의 전폭 사진 · Client/Role x720/1078 · 「+」 4 · 홀로 선 사진 74% / 46% · 갤러리 16, about 연락처 sticky 150 · 들여쓰기 129.6 · 메일 hover 사진이 커서 왼쪽 · `mailto:`, 디렉터 프로젝트 5 · 막대 「Projects|Bio」 · Bio 전환 · 프로젝트 글, Directors 카드 1, 404 |
| All | 칸 144px · 첫 칸 x58 · 간격 259 · 오른쪽 넘침 0, 휠 · 끌기(확대 안 됨) · 가로 12000px 뒤에도 칸이 보임, 칸 클릭 → 짧은 변 675px 가운데 + 작가 이름 링크, 확대 중 넘침 0, 다시 클릭 복귀, Tab → Enter 확대 → Esc 복귀 |
| 390 | 버거 보임 · 글자 링크 숨김 · 세로쓰기 · 사진 2기둥 · 로고 전폭, 버거 탭 → 메뉴 4항목 · `aria-expanded` · 스크롤 잠금, Esc · 바깥 탭 닫힘, 메뉴 링크 이동, artists 는 가운데 이름이 켜짐, 작가 격자 3단 · 분류 버튼 숨김, news 1단 |
| reduced motion | 홈 등장 없음 · 로고 · 사진 · 문장 바로 보임, 작가 막대 바로 제자리, 확대 보기 바로 뜸 |
| 넘침 | 14개 페이지 종류 × 1440 / 768 / 390 — 오른쪽으로 넘는 요소 0 |

처음 돌렸을 때 걸린 것(고침): All 확대를 되돌린 뒤 이름 링크가 남음(숨기는 시점이 확대 해제보다 빨랐음) → 복귀가 끝날 때 숨김. 사진 확대 링크(`<a href="….jpg">`)를 `verify-site` 가 페이지로 따라가 h1 없음 · 넘침으로 셈 → 확대 단추를 `<button data-zoom>` 으로. Artists 바탕색 전환이 등장 전환 규칙에 덮여 안 걸림 → 전환 목록에 `background-color .5s` 추가. hover 를 `@media (hover:hover)` 로 걸었더니 녹화 도구의 Chrome 에서 hover 가 전부 꺼짐 → 원본처럼 터치 지원 여부로 가르는 클래스(`no-touch`)로.

### 커밋 전 게이트

| 검사 | 결과 |
|---|---|
| `node scripts/verify-site.mjs http://127.0.0.1:4461/works/2026-W46/clone-02-viv/` | **페이지 224개 검사 · 문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개** (1440 · 768 · 390. 건너뛰기 링크의 해시 주소 포함 224) |
| `directors/index.html` · `404.html` (어떤 링크도 없어 크롤러가 닿지 않음) | Playwright 로 같은 항목을 잼(clicktest 「overflow」 · 「director」 · 「404」): 3폭 넘침 0 · h1 1 · 콘솔 오류 0. `href="#"` 는 113개 파일 전체에 0(빌드 결과 grep) |
| `npx --yes impeccable@4.7.0 detect` (113 HTML) | **0 anti-patterns** (출력 없음 · `--json` 결과 `[]`). 처음 13건: `overused-font` 13(대체 세리프 Instrument Serif → Libre Caslon Condensed). 그 뒤 3건: `oversized-h1` 2(40자 넘는 뉴스 제목 → 39자 이하로) · `tight-leading` 1(두 줄로 넘어가던 제목을 줄임). 예외로 둔 것 없음, 설정으로 끈 규칙 없음 |
| `node scripts/check-korean.mjs works/2026-W46/clone-02-viv` | 「한국어가 있는 페이지 0개 / 전체 113개 · 문제 없음」. 빌드에서 JS 의 한국어 주석 줄과 CSS 주석을 뺀다 |
| 기능(Playwright 스크립트) | 83/83 PASS, 오류 0 (`refs/clicktest.json`) |
| `file://` 로 열기 | Playwright 로 `file:///…/index.html` 에서 Production → 글 → Artists → 디렉터까지 4번 이동, 오류 0(스크래치 filetest) |
| 폭 1440 / 768 / 390 | 넘침 0(verify-site 224 + clicktest 14종 × 3폭). 768 은 `refs` 에 원본 캡처가 없어 모작 캡처만 눈으로 봤다 |

## 12. 못 한 것 · 원본과 다른 것

- **영상**(Mux)을 사진으로 대신했다 — 홈 사진 띠 · 뉴스 카드 · 확대 보기의 영상과 재생 컨트롤 · 커서 사진의 영상. 이 컨테이너에서 원본 영상도 재생되지 않아 움직임은 보지 못했다.
- **swup 페이지 전환**(머리 유지 · 클라이언트 라우팅) 없음. 보통 페이지 이동 + 같은 페이드(나감 0.5s · 들어옴 0.4s). 분류 이동만 원본처럼 페이드 없이 격자만 바뀐다.
- **홈 사진 띠 · All 판의 구조가 다르다.** 원본은 화면보다 넓은 요소(130vw 띠, 4147×6523 판)를 그대로 놓는다. `verify-site.mjs` 는 오른쪽 끝이 화면을 넘는 요소를 가로 넘침으로 세므로, 모작은 기둥 · 칸의 상자를 화면 오른쪽 끝에서 자르고 사진은 그 안의 `::before` 가 원래 폭으로 그린다(All 은 화면에 들어온 칸만 그리고, 80칸이 위치를 돌려 쓴다). 보이는 결과와 수치(기둥 362.4 · 간격 10 · 칸 144 · 확대 4.69배)는 같다. 그래서 이 두 곳의 사진은 `<img>` 가 아니라 배경이다(기둥 링크와 칸 버튼에 이름을 붙였다).
- **홈 순환 중 스크롤 잠금을 뺐다.** 원본은 맨 위에서 사진이 바뀌는 2–5초 동안 Lenis 를 멈춰 스크롤이 먹지 않는다. 모작은 스크롤하면 순환이 바로 멈춘다. 기둥 시차는 휠 양 대신 스크롤 위치에 묶었다(휠로는 같은 양, 키보드 · 스크롤바로도 문장과 겹치지 않는다).
- **서체 대체.** Garamond Narrow → Libre Caslon Condensed(90px + 자간 −0.02em 로 폭을 맞춤, 획은 더 굵다). Helvetica Now Display → Inter Tight.
- **글자 수를 줄인 제목.** 원본 뉴스 제목은 41자까지 있다. 모작 제목은 39자까지(impeccable `oversized-h1` 이 40자 이상의 큰 h1 을 잡는다).
- **접근성 때문에 원본에 없는 것**: 포커스 링(원본은 `:focus{outline:none}`), 확대 보기의 `role=dialog` · 포커스 가둠 · 숨은 버튼, 모바일 메뉴 Esc · 배경 스크롤 잠금(원본은 열린 채로 뒤가 스크롤된다), 분류 판 Esc · `inert`, All 의 화살표 키 · 칸 버튼 · Esc, `aria-pressed` · `aria-current`, Artists 이름 `h3` → `h2`.
- **링크**: 확대 단추는 `<a href=사진>` 이 아니라 `<button>`(게이트 크롤러 때문). Artists 의 분야 글자는 원본에서 동작 없는 `<button>`, 모작은 `<p>`. Bio 의 이름은 원본에서 작가 사이트 링크, 모작은 포커스되는 글자(가상 도메인). `/directors` 는 원본처럼 어떤 메뉴에도 걸지 않았다 — 크롤러가 닿지 않아 404 와 함께 Playwright 로 따로 확인했다.
- **수량**: 분류 48 → 26, 작가 사진 14–26장(원본 최대 188), Load more 24 → 18, 디렉터 프로젝트 · 일부 프로덕션 글의 사진 수가 적어 두 페이지가 −17% · −23%(11절).
- 큰 격자(editorial)의 홀로 선 사진 폭은 65–80% 무작위(원본 60–80% 에서 60 · 40 근처를 뺀 값과 같은 범위).
- All 확대 뒤 고해상도 교체 없음. All 판의 따라오는 움직임은 GSAP `quickTo` 1.5s power4 대신 지수 감쇠(같은 체감 시간).
- 원본 모바일은 390 캡처 11종을 봤다. 768 은 원본 캡처 없이 원본 CSS 의 768 · 992 분기 값으로 맞췄다.
