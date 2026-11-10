# SPEC: OFFFForum 모작 → OTTTAtrium

## 출처

- **원본 URL**: https://www.offforum.com/ (`lang="en-CA"`, 프랑스어판 `/fr/`)
- **어워드**: Awwwards Site of the Day · **2026-10-16** · SOTD 7.33/10 (Design 7.41 · Usability 7.06 · Creativity 7.50 · Content 7.50) + **Developer Award 7.20/10** (Semantics/SEO 7.00 · Animations/Transitions 7.80 · Accessibility 6.60 · WPO 7.40 · Responsive 7.20 · Markup/Meta 7.00)
- **어워드 링크**: https://www.awwwards.com/sites/offfforum (2026-11-10 WebFetch 로 읽음. awwwards.com 은 curl·Chrome 캡처를 막아 화면 캡처는 없다)
- 크레딧: **REF Digital** (PRO) · **Bagage** (PRO). 태그 Events · Animation · Clean · Gallery · About Page. 기술 GSAP · Nuxt.js · Netlify. 어워드 팔레트 `#FFFFFF` · `#000000`
- 어워드 설명(요약): 디자이너·작가·디지털 문화 실무자가 모이는 일주일짜리 축제. 심사 하이라이트 요소: Schedule · 404 · Home · Hero Image · Line up · About us · Gallery
- 모작 날짜: 2026-11-10 · 모작 이름: **OTTTAtrium** — 가상의 축제 `OTTT`(이틀) + 가상의 모임 `ATRIUM`(하루), 가상의 장소 「Centre des pratiques numériques [CPN]」(오타와). 2026-11-10 웹 검색 `"OTTT Atrium" design festival` 결과에 같은 이름이 없다. 메일은 예약 도메인 `otttatrium.example`.

### 대상 선정 근거 (2026-11-10)

`research/2026-W46/targets.md` 가 없어 여기 남긴다.

| 항목 | 내용 |
|---|---|
| 고른 사람 | **사용자가 제시된 목록에서 직접 골랐다(2026-11-10)** — PROTOCOL 9절 3번 확인 끝 |
| 수상 | Awwwards SOTD 2026-10-16 + Developer Award (위 링크) |
| 언어 | 영어(`lang="en-CA"`) → 영어 모작 슬롯 |
| 페이지 수(실측) | 사이트맵(`/sitemap_index.xml` → `__sitemap__/en-CA.xml`) 영어 **33경로**: `/` · `/about` · `/faq` · `/media-room` · `/privacy-policy` · `/lineup` + 연사 19 · `/schedule` + 일정 상세 3 · `/archives-2022`~`2025`(4). 사이트맵 밖에 404 1. 일정표가 링크하는 상세 2개(`/schedule/creative-lunch-club-2/`, `/schedule/imaginer-…/`)는 원본에서 **404** 다(curl 실측). 프랑스어 미러 33경로(`fr-CA.xml`) — **멀티페이지** |
| 내비게이션(실측) | 머리: About · FR(언어). 꼬리: Media room · FAQ · Contact(mailto) · Privacy policy · 소셜 3. **Lineup · Schedule 은 어떤 메뉴에도 걸려 있지 않다**(지난 2026 회차 페이지, 사이트맵에만 있음). Archives 는 About 의 「Past edition archives」 로만 들어간다 |
| 기능(실측) | 쿠키 동의 창(3버튼 + Manage 토글 4 + Back · Confirm), 꼬리말 뉴스레터(라디오를 고르면 폼이 열림), 모바일 버거 메뉴, FAQ 아코디언 7, 일정 날짜 탭 3, 연사·일정 호버 사진, 아카이브 갤러리 라이트박스(좌우·Esc·카운터), 강연 영상 라이트박스(Listen), 아카이브 회차 전환, 언어 전환 |
| WebGL(실측) | **캔버스·WebGL 없음**(`refs/origin/origin.md` 「캔버스도 WebGL 도 쓰지 않는다」, 7페이지 모두 같음). 홈 히어로·404 배경·연사 작업 일부가 Mux 영상(`mux-player`) → PROTOCOL 2절 2D 사이트 |
| 문서 높이(1440) | 홈 1397(1.6화면) · about 5167 · faq 1389 · media-room 4312 · privacy 2211 · lineup 2131 · schedule 2304 · archives 2025 3062 / 2024 1992 / 2023 2882 / 2022 2641 · 연사 4277–6181(REF 5525) · 일정 상세 1995(점심) / 4733(와인) / 5699(Krea) · 404 900 |
| 같은 업종 | W45 까지 행사·축제 업종 모작이 없다. 흰 바탕·검정 하나·세리프+그로테스크 두 서체의 행사 사이트는 처음이다 |

## 근거 자료

| 자료 | 경로 |
|---|---|
| 페이지별 capture.mjs(전체 + 섹션 + 390) | `refs/<home·about·faq·media-room·privacy-policy·archives-2025·archives-2022·lineup·lineup-detail·schedule·schedule-detail·fr>/` (`00-full.jpg` · `NN-*.jpg` · `90-mobile-390.jpg` · `measure.json`) |
| 상태별 캡처(Playwright 스크립트로 실제 클릭·호버·키) | `refs/states/` — 홈 로드 200/600/1200/2500ms · 쿠키 창 · 메뉴 hover · 티켓 hover · 404 · about 스크롤 7위치 · lineup 호버 150ms/끝 · 스크롤 · 일정 SEP 3 200ms/끝 · SEP 4 · 행 hover · 아카이브 라이트박스 250ms/열림/다음/Esc · Listen 열림/Esc · 연사 상세 4위치 · 일정 상세 · media-room · privacy · fr · 390 홈·lineup·about |
| FAQ 열림 · 쿠키 Manage · 꼬리말 라디오 → 폼 · 꼬리말 큰 로고 · Front and Center 목록 | `refs/states/faq-open*.jpg` · `faq-policies.jpg` · `cookie-manage.jpg` · `footer*.jpg` · `lineup-detail-podcast.jpg` |
| 라이브러리·전환·이징·섹션 | `refs/origin/origin.md`(홈) · `refs/origin-<about·lineup·schedule·archives·lineup-detail·faq·media-room>/` |
| 모션 녹화 | 원본 `refs/motion-origin/`(홈) · `motion-origin-about/` · `motion-origin-lineup/` · 모작 `refs/motion-mine*/` · 비교 `refs/motion-compare*.html` |
| 모작 실측 | `refs/origin-mine*/` |
| 모작 상태별 캡처 | `refs/mine-states/` |

### 캡처에서 막힌 것과 우회 (사실대로)

1. **Mux 영상이 안 돈다.** 이 컨테이너의 Chromium 은 H.264 를 못 풀어 홈 히어로·404·연사 작업 영상 자리에 「Media Error」 가 찍혔다(`refs/states/home-load-1200.jpg`, `404.jpg`). 영상 첫 프레임(포스터)과 흐림 자리 그림으로 구도·명도만 읽었다.
2. **쿠키 창.** 첫 방문마다 오른쪽 아래에 뜬다. capture.mjs·extract-origin.mjs·record-motion.mjs 는 클릭을 못 해서 그 화면에는 창이 같이 찍혔다. 상태 캡처는 Playwright 로 「Allow necessary cookies」 를 누른 뒤 찍었다. 저장소 `scripts/` 는 고치지 않았다.
3. **원본 폼은 보내지 않았다.** 뉴스레터는 라디오로 폼을 연 것까지만 봤다(`required` 속성 확인).
4. capture.mjs 의 「섹션」 은 원본에서 `div.page` 하나(+ 꼬리말)라 페이지마다 섹션 캡처가 2–3장이다. 나머지 위치는 `refs/states/` 의 스크롤 위치 캡처로 채웠다.

라이브러리(원본): Nuxt(Vue) · Tailwind 4 · GSAP(인라인 transform) · Lenis(네이티브 스크롤 위 관성) · Mux 플레이어 · DatoCMS 이미지.
모작: Lenis 1.3.x(jsdelivr) + 바닐라 JS + CSS. 영상 자리는 스톡 사진으로 대신(7절).

## 1. 사이트 구조

### 원본

```
/                      홈: 영상 히어로(로고 · 일정 표 · 문장 h1 · 티켓 버튼) → 꼬리말
/about/                About 제목 → 소개 문장(80px) → 사진 7장 대각선 행렬(시간+스크롤) → 세리프 문장 → OFFF · FORUM 소개(링크 3 · 1) → OFFF 파트너 7 · FORUM 파트너 10 → 도시 사진 + 글
/faq/                  FAQ 제목 → 왼쪽 고정 목차(General · Policies) / 오른쪽 아코디언 4 + 3
/media-room/           제목 → 보도 자료 2묶음(Object · Dates & Location · Image · Press note · Contact · Media Kit)
/privacy-policy/       제목 → 오른쪽 조항 9
/lineup/               Lineup + 2026 → 왼쪽 아래 고정 사진 / 오른쪽 이름 19(OFFF 산세리프, FORUM 세리프) + 첫 글자 색인
/lineup/<연사>/ 19      왼쪽 사진 반 화면 / 오른쪽 이름 · 역할 · 나라 → 일정·링크 / 소개 → 작업 3–6(스크롤로 커짐)
/schedule/             Schedule + 2026 → 왼쪽 고정 사진 / 오른쪽 날짜 탭(OFFF SEP 2 · SEP 3 / FORUM SEP 4) + 시간표
/schedule/<일정>/ 3     연사 상세와 같은 틀(+ WORKSHOP 꼬리표 · 진행자 · 가격 · 예매 버튼)
/archives-2022~2025/   Archives + Forum → Edition 알약 4 · Lineup 이름 · Gallery 썸네일 20 · Conferences 카드 6(2024 는 없음)
404                    글리치 영상 전면 · 404 ERROR · BACK TO HOME · 흰 로고
쿠키 동의 창(모든 페이지 첫 방문) · 꼬리말(모든 페이지, 404 제외)
```

### 재현 (37페이지)

| 원본 | 모작 파일 |
|---|---|
| / | `index.html` |
| /fr/ | `fr/index.html` (프랑스어 더미 홈 1장) |
| /about/ · /faq/ · /media-room/ · /privacy-policy/ | `about/` · `faq/` · `media-room/` · `privacy-policy/` `index.html` |
| /lineup/ + 연사 19 | `lineup/index.html` + `lineup/<가상 슬러그>/index.html` 19 |
| /schedule/ + 일정 상세 3 | `schedule/index.html` + 상세 **5** (원본이 404 로 끊어 둔 2개도 만들었다 — 모든 링크가 만든 페이지로 가야 하므로) |
| /archives-2022 ~ 2025 | `archives-2022/` ~ `archives-2025/` `index.html` 4 |
| 404 | `404.html` |

생성: `node build.mjs` (내용 `data.mjs`, 스타일 `src/style.css`, 동작 `src/script.js`, 로고·아이콘 `src/svg.mjs`). 결과는 페이지마다 HTML 한 파일, CSS·JS 인라인(PROTOCOL 4-4). 링크는 `…/index.html` 로 걸어 `file://` 로도 이어진다. 원본의 Lineup·Schedule 이 메뉴에 없는 구조는 그대로 두되, 들어가는 길은 원본과 같다(아카이브는 About, 연사·일정은 서로의 링크).

### 언어 전환(FR)

원본은 33경로 전부 프랑스어판이 있다. 모작은 **프랑스어 홈 1장**(`fr/index.html`)만 만들었다. 모든 영어 페이지의 `FR` 은 `fr/index.html` 로, 프랑스어 홈의 `EN` 은 `index.html` 로 간다. 프랑스어 홈의 머리·꼬리 링크(À propos · Salle de presse · FAQ · Politique de confidentialité)는 영어 페이지로 간다. 이유: 같은 틀 32장을 번역 더미로 다시 찍는 것은 디자인 훈련으로 얻는 것이 없고, 전환 동작(링크·`hreflang`·`lang`)은 한 장으로 확인된다.

### 바꾼 것 · 줄인 것

- 이름·날짜·장소·연사·스튜디오·파트너는 전부 가상. 연사 19는 원본과 같은 비율(OTTT 11 산세리프 · ATRIUM 8 세리프)과 같은 첫 글자 분포(A·B·D·H·K·L·M·P·R·S·T·U)로 새로 지었다.
- 원본 로고(OFFF 블록 글자 + FORUM 세리프)는 직접 그렸다: 원 + 세 개의 T 가 위 막대를 나눠 갖는 블록 글자 `OTTT` + Marcellus 대문자 `ATRIUM` 을 SVG 1408×181 판(원본 viewBox 와 같은 판)에.
- 파트너 로고 17은 가상 이름의 손글자 SVG/CSS 워드마크. 원본은 외부 링크지만 가상 업체라 링크 없는 칸으로 뒀다. 「Become partner」 는 `mailto:`.
- 외부 링크: 티켓(Ticketscandy) → 일정 페이지(가장 가까운 만든 페이지), 지도 → OpenStreetMap 검색, 소셜 → 플랫폼 첫 화면, OFFF 다른 도시 회차 3 → 그 도시의 위키백과 문서, 「Website by REF®」 → 「Website by Placard®」(About 의 ATRIUM 파트너 칸으로).
- 영상(Mux) 자리는 사진: 홈 히어로는 무대 사진 + 느린 확대(영상이 움직이는 화면이라는 것만 대신), 404 는 추상 사진 + CSS 글리치(steps 흔들림·색 이동·주사선), 연사 작업 영상은 사진, 강연 Listen 은 정지 사진 + 재생 버튼과 진행 막대(가짜 재생, `aria-pressed`).

## 2. 그리드 실측 (1440px)

원본 `html{font-size:62.5%}`(1rem=10px). 토큰 `--spacing-gutter:.8rem`(8) · `--spacing-double-gutter:1.6rem`(16) · `--spacing-header-height: calc(6.42755vw + 27.8864px)`(1440 에서 120). 칸 구조는 `container-main{padding-inline:gutter}` + 칸마다 `px-gutter` → 글 시작 x 16, 반 칸 시작 x 728.

| 항목 | 원본 실측(`refs/*/measure.json` · 스크래치 geo 실측) | 모작 |
|---|---|---|
| 좌우 여백 | 16(8+8). 12칸 퍼센트 폭(1/2 · 5/12 · 4/12 · 3/12 · 1/6) | 같음 |
| 머리 | absolute, 높이 120. 로고 a 폭 1/2(svg 688×88, x16 y16). 오른쪽 About x1335 · FR x1407, y13 | 같음 |
| 홈 | 히어로 1440×900 영상. 일정 표 x16 y120 470×138(칸 235 둘, 흰 1px 테, 안쪽 16 16 36). h1 712 폭 가운데, y654, 아래 티켓 버튼 y842 | 같음 |
| 꼬리말 | 위 선 x16–1424, pt16 · 블록 간격 120 · pb16. 왼쪽 4/12(h3 32px) · 오른쪽 6/12(링크 2열 x728 · x965, 소셜 x1203 · x1321). 큰 로고 1408×181 y+261. 아래 줄 ©(11px .4) · Website by | 같음 |
| 제목 상자 | h1 x16 y120 검정 바탕 안쪽 8, 아래 보조 상자(테 1px, 위 테 없음) | 같음 |
| 본문 시작 | 제목 아래 120(pt-120) | 같음 |
| FAQ | 왼쪽 목차 x16 y329 · 오른쪽 x728 폭 696, 질문 줄 51, 묶음 사이 80 | 같음 |
| media-room | 라벨 x601 폭 208 · 내용 x817 폭 607 · 줄 사이 80 · 사진 607×405 | 같음 |
| privacy | x728 폭 696, 문단 사이 18 | 같음 |
| about | 소개 h x16 y323 폭 949(8/12) · 사진 행렬 판 1408×1280(aspect 11/10), 위 −220 겹침 · 사진 586×733(4/5, 폭 5/12, 왼쪽 아래 기준) · 세리프 h x728 y1521 · 소개 블록 라벨 x728 · 글 x853 폭 571 · 파트너 6칸(237×161) · 도시 사진 왼쪽 반 · 글 x847 | 같음 |
| lineup | 목록 x720 폭 712 · 줄 56 · 위 여백 143 · 검정 막대 5/6(580) · 글자 색인 1/6. 사진 왼쪽 1/4(340×394), 화면 아래에 붙어 따라오다 목록 끝에서 멈춤 | `position:sticky; bottom:0` 으로 같은 결과 |
| schedule | 탭 줄 x728 y427 · 칸 1/6 시간(119) · 제목 · 사진 1/6 정사각 · 행 127(py12) · 문 열림 같은 줄 39 | 같음 |
| archives | 바탕 `#e2e2e2`(이 페이지만, `div.page` 실측) · 라벨 x601 · 내용 x817 · 이름 줄 45 · Gallery 선 y1357 · 썸네일 103 정사각 10칸 간격 145 · 줄 143 · 강연 카드 3칸 459×258 | 같음 |
| 연사 상세 | 위 반 화면 2칸(사진 0–720 × 900, 오른쪽 h1 가운데 · 아래 역할/나라 2칸 y820) · 정보 3/12(340) · 소개 x728 폭 696 · 작업 판 10/12(1173×660) 세로로 붙음 · 위아래 120. 팟캐스트 연사는 Speakers · Moderators 목록(제목 1/2 · 행 127: 이름 2/6 · 역할 2/6 · 사진 1/6) | 같음 |
| 404 | 전면 배경 · 가운데 h1 + 버튼 · 아래 흰 로고 x16 y705 1408×181 | 같음 |
| 1023 이하 | 글자 토큰이 모바일 값으로(아래 3절) | 같음 |
| 767 이하 | 1단 · 로고 높이 24 · 버거 · 일정 표·목록 전폭 | 원본 390 캡처(`refs/states/m390-*.jpg`, `refs/*/90-mobile-390.jpg`)를 보고 같은 방향으로 |

### 문서 높이

11절 표(원본 · 모작 나란히).

## 3. 타이포

원본 서체 둘 다 상용(woff2 이름 표로 확인): **Baikal SemiBold**(600) · **Forvm Roman**(400). 대체는 같은 문장을 겹쳐 그려 골랐다(스크래치패드 `fontcmp.png`): Baikal 1058px 문장에 Schibsted Grotesk 600 이 1048px 로 폭·획·숫자 꼴이 가장 가깝다(Hanken·Familjen 은 좁고 Geologica 는 넓다). Forvm 1163px 문장에 Marcellus 1104 · Bellefair 1113 · Forum 975 — Forvm 의 굵은 획과 벌어진 획끝은 Marcellus 가 가장 가깝다. 폭 차이 5% 는 자간으로 메웠다(아래).

| 역할(원본 토큰) | 원본 | 모작 |
|---|---|---|
| 산세리프 서체 | Baikal SemiBold 600 | **Schibsted Grotesk** 600 |
| 세리프 서체 | Forvm Roman 400, 늘 대문자 | **Marcellus** 400, 대문자 |
| h1-offf (제목 상자 · 소개 문장 · 연사 이름) | 80/77 · −0.04em (모바일 32/31) | 같음 |
| h1-forum (about 세리프 문장) | 76/73 · −0.02em (모바일 46/44) | 76/73 · **−0.005em** |
| h2-offf (lineup OTTT 이름) | 48/46 · −0.04em (모바일 32/31) | 같음 |
| h2-forum (홈 문장 · lineup ATRIUM 이름 · 404) | 45/43 · −0.02em (모바일 30/29) | 45/43 · −0.005em |
| h3-offf (꼬리말 문장 · FAQ 목차 · 아카이브 소제목) | 32/31 · −0.04em (모바일 24/23) | 같음 |
| h3-forum (아카이브 이름) | 30/29 · −0.06em (모바일 22/21) | 30/29 · −0.045em |
| body (본문 · FAQ 질문) | 24/26 · −0.04em (모바일 18/20) | 같음 |
| body-2 (FAQ 답 · privacy · 일정 표) | 18/20 · −0.04em (모바일 14/17) | 같음 |
| h4/h5 (일정 시간표 · 연사 역할) | 14/15 · −0.02em · 600 | 같음 |
| button (메뉴 · 알약 · 입력칸) | Forvm 14/12 · −0.02em · 대문자 (모바일 11) | Marcellus 14/12 · 대문자 (모바일 **12**) |
| small (©, 위치) | 11/12 · 600 | 같음 |
| 꼬리표(WORKSHOP) | Forvm 11/10 | Marcellus 11/10 |
| Website by | 10px | **11px** (impeccable `undersized-ui-text`) |

## 4. 아이콘

원본: 꺾쇠(FAQ, 16), 오른쪽 위 화살표 ↗(외부 링크 줄, 24), 오른쪽 화살표 →(내부 링크 줄 · 라이트박스 좌우, 1px 선), ✕(라이트박스 · 메뉴), 재생 ▸(Listen), 버거 2줄(32×1, 간격 4), 라디오(16 원 + 8 점), 쿠키 토글. 모두 1px 선 또는 채움 도형.
모작: 전부 SVG 로 새로 그렸다(1.2px 선, 끝 각짐). 로고 2벌(전체 · 404·꼬리말 큰 로고)은 같은 SVG.

## 5. 색

| 역할 | 원본 토큰 | 모작 |
|---|---|---|
| 바탕 | `--color-white #fff` (html 은 `#000`) | 같음 |
| 글자 · 선 · 채운 버튼 | `--color-black #000` | 같음 |
| 회색(일정 행 hover · 꼬리표 바탕 20%) | `--color-grey #c5c5c5` | 같음 |
| 빨강(쓰이지 않는 토큰) | `--color-red #ee3338` | 쓰지 않음 |
| 흐린 글자 | 목차 비활성 opacity .3 · © .4 · 지난 일정 행 .5 | 목차 .3 → **.55**, © .4 → **.6**, 일정 행 .5 → **.62** (대비 4.5:1, impeccable `low-contrast`) |
| 영상 위 어둡게 | 히어로 · 연사 사진 `bg-black/30` | 같음 |

## 6. 간격

반복 수치(원본 Tailwind 값 그대로): 4 · 6 · 8 · 12 · 16 · 24 · 32 · 36 · 40 · 56 · 70 · 80 · 104 · 110 · 120 · 143 · 220.

## 7. 모션

이징 실측(`refs/origin/origin.md`): `cubic-bezier(.4,0,.2,1)`(ease-in-out) ×14 · `cubic-bezier(.32,.94,.6,1)`(쿠키 창) ×15 · `cubic-bezier(.87,0,.13,1)`(ease-in-out-expo) ×4, CSS 토큰 `--ease-in-out-quart cubic-bezier(.76,0,.24,1)`. 지속 0.4s ×13 · 0.3s · 0.7s · 0.1s(버튼) · 0.5s(밑줄 · 사진 페이드). `@keyframes` 없음 — 나머지는 GSAP 인라인. 모작은 이 곡선만 썼다.

| 무엇 | 원본 실측 | 모작 | 근거 |
|---|---|---|---|
| 제목 상자 등장 | h1 `translateY(-100%)→0` 약 0.1–0.64s(304ms 에 86% 남음, 480ms 에 34%), 보조 상자 `-100%→0` + op 0→1 약 0.54–1.14s 빠르게 감속 | h1 0.55s `(.65,0,.35,1)` 지연 .1s · 보조 0.6s `(.16,1,.3,1)` 지연 .52s | rAF 실측(스크래치 curves.json), motion-origin-about inlineStyles `h1 translate3d(0,-92.8px)→0` 706ms |
| lineup 이름 등장 | 줄마다 `translate(20px,0) op 0 → 0` 약 1.1s, 50ms 간격 | 같음 1.1s `(.16,1,.3,1)` 50ms | motion-origin-lineup inlineStyles 19줄 838→1950…2641ms |
| lineup 사진 | 호버한 이름의 사진이 왼쪽 아래 기준 `scale(0)→1` 로 위에 쌓임 | 0.7s ease-in-out-expo | `refs/states/lineup-hover-3-150.jpg`, DOM 의 쌓인 사진 scale .25–1 |
| 이름·행 호버 | 이름: 검정 막대 + 흰 글자 즉시. 일정 행: 회색 바탕 | 같음 | `refs/states/lineup-hover-3.jpg`, `schedule-row-hover.jpg` |
| about 사진 행렬 | 사진 7장이 진행값 p(1/7 간격)로 왼쪽 아래→오른쪽 위 곡선을 탄다. p 는 **시간으로 초당 0.0515** 늘고, 스크롤로도 밀린다. 크기는 p=.5 근처 .92 정점, 양끝 0. 안쪽 사진은 역으로 `scale(1.7 − .7·s)` | 같은 진행값·초당 속도·간격. 곡선은 원본에서 잰 (p, x, 크기) 28점 표를 선형 보간 | 스크래치 sample/about.json(시간 4점 · 스크롤 17위치 × 7장), DOM `data-progress` |
| 연사 사진 시차 | 위 반 화면 사진 `scale(1.2)` + `translateY(10%→20%)` 스크롤 0→900 | 같음 | sample2(0→900 에서 90→180px) |
| 연사 작업 판 | 판이 화면 아래에 닿을 때 0 → 판 높이(660)만큼 올라오면 1, 위 가운데 기준 선형 | 같음 | sample2(top 858→.064, 708→.291, 558→.518 …) |
| 밑줄 링크 | `::after scaleX(0→1)` 0.5s ease-in-out-quart, 현재 페이지는 늘 1 | 같음 | origin stateRules `hover:after:scale-x-100` |
| 버튼 hover | 채움↔테 0.1s ease-in-out | 같음 | origin stateRules |
| 라디오 | 점 hover `scale .5`, 선택 1, 0.2s | 같음 | 꼬리말 DOM |
| FAQ | 질문 줄이 검정 바탕 흰 글자로, 답이 열림, 꺾쇠 뒤집힘 | 높이 0.4s `(.4,0,.2,1)` | `refs/states/faq-open*.jpg` |
| 일정 탭 | 활성 알약 검정, 행 교체 | 행 op 0→.62 0.4s | `refs/states/schedule-sep3-200.jpg` |
| 모바일 메뉴 | 흰 판 `clip-path inset(0 0 100% 0)→0` + `translateY(-30px)→0`, 바탕 검정 30% 페이드, 버거 두 줄이 ±45° 로 X, 0.7s ease-in-out-expo | 같음 | 원본 DOM 클래스 `duration-700 ease-in-out-expo in-[.open]:…` |
| 쿠키 창 | 0.3–0.4s `(.32,.94,.6,1)` | 같음 | origin 전환 표 |
| 사진 로드 | 흐림 자리 그림 → 사진 op 0.5s ease | 사진 op 0→1 0.5s ease(load 이벤트) | motion-origin animations `img opacity 500ms ease` |
| 라이트박스 | 흰 덮개 페이드, 사진 교체 | 0.3s 페이드 | `refs/states/archives-lightbox-250.jpg` |
| 관성 스크롤 | Lenis | Lenis 1.3.x window 모드 | origin 라이브러리 |
| 홈 히어로 | Mux 영상 루프 | 사진 `scale 1→1.06` 18s 왕복(영상 대신) | 대체 — 아래 |
| 404 | Mux 글리치 영상 | 사진 + `steps()` 흔들림·`hue-rotate`·주사선 | 대체 — 아래 |

옮기지 못한 것:
- 영상 4종(홈 히어로 · 404 · 연사 작업 일부 · 강연 녹화). 영상 파일을 만들 수 없어 사진과 CSS 로 대신했다.
- about 행렬의 스크롤 결합 세기는 근사다. 원본은 스크롤 속도에 비례해 진행값을 밀고(200px 에 약 −0.04), 화면을 벗어나면 결합이 풀린다. 모작은 화면 안에서만 `Δscroll × −0.0002` 를 더한다.
- Nuxt 페이지 전환(머리 유지). 모작은 보통 페이지 이동.

`prefers-reduced-motion`: Lenis 끔, 제목·목록 등장 없이 바로 보임, about 행렬 정지(정점 배치), 히어로 확대·404 글리치 끔, 작업 판 처음부터 1.

## 8. 기능 목록

| 기능 | 원본 | 모작 동작 | 확인 |
|---|---|---|---|
| 쿠키 동의 창 | 첫 방문 오른쪽 아래. Allow all · Allow necessary · Manage(토글 4 + Necessary 늘 켜짐 · Back · Confirm) | 같음. `role=dialog`, 선택은 localStorage, 고르면 다시 안 뜸. Manage 의 토글은 `role=switch` `aria-checked` | 11절 |
| 머리 내비 | About · FR(언어) | 같음 + 현재 페이지 밑줄(`aria-current`) | 11절 |
| 모바일 버거 메뉴 | 767 이하. 흰 판이 위에서 열림, 바탕 검정 30%, About · Media room · Contact · FAQ · FR | 같음 + `aria-expanded`, Esc · 바탕 클릭 닫힘, 열린 동안 스크롤 잠금, 포커스 | 11절 |
| 언어 전환 | 같은 페이지의 프랑스어판 | 프랑스어 홈 1장으로(1절) | 11절 |
| 꼬리말 뉴스레터 | 라디오(Only OFFF / Only Forum)를 고르면 이름·메일·Subscribe 폼이 열림. `required` | 같음. 보내기를 막고 빈 칸·메일 형식 문구 + 첫 칸 포커스, 다 맞으면 「Demo form — nothing was sent.」 | 11절 |
| FAQ 아코디언 | 7개, 하나씩 열림, 목차 General · Policies 가 스크롤 위치를 따라 커짐, 누르면 그 묶음으로 | 같음(`aria-expanded` · `aria-controls`, 목차 `aria-current`) | 11절 |
| lineup 호버 사진 | 호버/포커스한 이름의 사진이 커지며 쌓임 | 같음(키보드 포커스에도) | 11절 |
| 일정 날짜 탭 | SEP 2 · SEP 3 · SEP 4, 행 교체, FORUM 날은 세리프, 탭 줄이 위에 고정 | `role=tablist` `aria-selected`, 좌우 화살표 키, 주소 `#sep-N` 으로 그 날 열림 | 11절 |
| 일정 행 호버 사진 | 행 회색 + 왼쪽 고정 사진 교체 | 같음 | 11절 |
| 아카이브 회차 | 알약 4 → 해당 연도 페이지 | 같음(`aria-current`) | 11절 |
| 갤러리 라이트박스 | 흰 덮개, 좌우 화살표 · 키, 「1 / 20」, ✕ · Esc | 같음 + 바깥(덮개) 클릭 닫힘, 포커스 갇힘·복귀 | 11절 |
| 강연 Listen | 같은 라이트박스에 영상(1 / 6) | 같은 라이트박스에 정지 사진 + 재생 버튼(진행 막대) | 11절 |
| 일정 상세 예매 버튼 | 외부 예매 | 일정 페이지 그 날 탭으로(1절) | 11절 |
| 링크 줄 hover | about · media-room 의 화살표 줄이 검정 막대 + 흰 글자 | 같음 | 11절 |
| 사람 행 hover | Front and Center 의 Speakers · Moderators 행 검정 | 같음(Side by Side) | 확인 |

## 9. 섹션 순서

- **홈**: 히어로(로고 · 일정 표 · h1 문장 · GET YOUR ATRIUM TICKET) → 꼬리말
- **about**: About → 소개 문장 → 사진 행렬 → WHERE STUDIO PRACTICE MEETS OPEN TALK AND CRITIQUE. → OTTT(글 + 도시 회차 3) → ATRIUM(글 + Past edition archives) → OTTT partners 7 → ATRIUM partners 10 → 오타와 사진 + 글 → 꼬리말
- **faq**: FAQ → General 4 · Policies 3 → 꼬리말
- **media-room**: Media room → OTTT 보도 자료 6줄 → ATRIUM 보도 자료 5줄 → 꼬리말
- **privacy-policy**: Privacy Policy → 날짜 + 조항 9 → 꼬리말
- **lineup**: Lineup · 2026 → 이름 19 → 꼬리말
- **연사**: 사진 + 이름 · 역할 · 나라 → 일정 · 링크 / 소개 → 작업 3–6 → 꼬리말
- **schedule**: Schedule · 2026 → 탭 → 행(SEP 8: 11 · SEP 9: 8 · SEP 10: 12) → 꼬리말
- **일정 상세**: 사진 + (꼬리표) 이름 · 진행자 · 가격 → 일정 · 예매 · 링크 / 글 → (작업 3) → 꼬리말
- **archives**: Archives · Atrium → Edition → Lineup → Gallery 20 → Conferences 6(2024 없음) → 꼬리말
- **404**: 배경 · 404 ERROR · BACK TO HOME · 로고
- 원본은 about 에서 h1 이 둘이다(제목 상자 + 소개 문장). 모작은 소개 문장을 같은 크기의 h2 로 두었다(페이지마다 h1 하나).

## 10. 사진

`node scripts/fetch-stock.mjs … --w 1600` 로 받았다(17 검색어 · 1개는 0장이라 검색어를 바꿔 다시 · 162장, `refs/photo-raw/`, gitignore). 결과는 전부 Unsplash 무료분, Pinterest 는 쓰지 않았다. 쓴 사진 97장을 긴 변 1100–1600, JPEG 58% 로 줄여 `assets/stock/`(6.9MB). 출처 `credits.json`.
- 자리별: 히어로 = 어두운 강연장(흰 글자가 올라가므로 명도 낮은 것), 404 = 형광 물결 추상, 연사·작업 = 포스터·패키지·인쇄물·전시 설치·무드보드·추상(원본 연사 작업과 같은 「디자인 결과물」 결), 갤러리·about 행렬·강연 카드 = 강연장·워크숍·디제이·마이크, 일정 상세 = 긴 식탁·와인잔·무드보드·워크숍, 도시 = 파란 하늘의 현대 건물.
- 버린 사진(**다른 브랜드 로고·글자**): 글자가 큰 타이포 포스터 9장(「Photography can stop time」, 「GOOD BYE」, 「You've written…」 등), Kodak 필름 상자, HAKU · POURED · Ethical 상자, 「Logo and Packaging Design」 견본, MACARONS 상자, HEY DESIGN · Very Good Creative Co. 명함, SWAGGER 잡지, 애플 로고 휴대폰, 이름이 찍힌 카드, 화면에 행사 이름이 뜬 강연장 2장, 식탁에 손글씨 「Welcome friends」 가 쓰인 사진.
- 원본 사진은 받지 않았고 같은 사진을 찾지도 않았다.

## 11. 대조 · 기능 확인 · 커밋 전 게이트

### 문서 높이 (1440, ±15% 기준)

| 원본 | 모작 | 원본 | 모작 | 차 |
|---|---|---:|---:|---:|
| / | `index.html` | 1397 | 1397 | 0.0% |
| /fr/ | `fr/index.html` | 1397 | 1366 | −2.2% |
| /about/ | `about/` | 5167 | 5109 | −1.1% |
| /faq/ | `faq/` | 1389 | 1387 | −0.1% |
| /media-room/ | `media-room/` | 4312 | 4066 | −5.7% |
| /privacy-policy/ | `privacy-policy/` | 2211 | 2189 | −1.0% |
| /lineup/ | `lineup/` | 2131 | 2115 | −0.8% |
| /schedule/ | `schedule/` | 2304 | 2304 | 0.0% |
| /archives-2025/ · 2024 · 2023 · 2022 | 같은 연도 | 3062 · 1992 · 2882 · 2641 | 3073 · 2001 · 2893 · 2623 | +0.4 · +0.5 · +0.4 · −0.7% |
| /lineup/ref/ (작업 5) | `lineup/rim/` (작업 5) | 5525 | 5315 | −3.8% |
| /lineup/principal/ · alex-center/ · hayley-lim/ · mlti-nyc/ | plinth · abel-corder · helka-lin · mrkt-ldn | 5705 · 5473 · 6181 · 4277 | 5367 · 5291 · 6025 · 4121 | −5.9 · −3.3 · −2.5 · −3.6% |
| /lineup/front-and-center/ (Speakers · Moderators 목록) | `lineup/side-by-side/` | 3180 | 2867 | −9.8% |
| /schedule/creative-lunch-club/ | `schedule/long-table-lunch/` | 1995 | 1943 | −2.6% |
| /schedule/creative-winemaking-workshop/ (작업 4) | `schedule/cider-blending-workshop/` (4) | 4733 | 4705 | −0.6% |
| /schedule/proving-the-concept-…/ (작업 5) | `schedule/testing-the-brief/` (5) | 5699 | 5569 | −2.3% |
| 404 | `404.html` | 900 | 900 | 0.0% |

처음 잰 값에서 고친 것: 일정 상세 두 장이 −14.5% · −28.1% 였다 → 원본 작업 판 수(4 · 5)를 다시 세어 맞춤. Side by Side 는 −35.6% → 원본에 있는 Speakers · Moderators 목록(이름 · 역할 · 사진 행, hover 검정)을 빠뜨렸던 것이라 추가.

**섹션 수**(extract-origin `main > div` 기준): 원본 페이지마다 `div.page` 1개 = 모작 `div.page` 1개(8페이지 모두, `refs/origin-mine*/origin.md`). **3화면 넘는 섹션**: 원본 단일 `div.page` 구조라 해당 없음(about 5.7화면 · 연사 6.1화면도 한 덩어리) — 모작도 같은 구조.

### 모션 비교 (`refs/motion-compare.html` · `-about.html` · `-lineup.html`, 1440×900, 로드 5–6초 + 휠 + hover)

| 페이지 | 원본에만(빨강) | 결과 |
|---|---|---|
| 홈 | 첫 비교: 사진 자리 그림 `opacity 500 ease`, 영상 포스터 `opacity 200 (.4,0,.2,1)` | 둘 다 옮김(히어로 자리 그림 층 · 포스터 층) → **빨강 0** |
| about | 없음(`opacity 500 ease` 원본 34 · 모작 1 — 같은 서명) | 원본 GSAP 인라인(행렬 7장 · 안쪽 확대 · 제목 h1 `translate3d(0,-92.8px)→0` 706ms)은 표의 「원본 JS 인라인」 칸 → JS·CSS 로 옮김 |
| lineup | 없음(원본은 CSS 애니메이션 0, 전부 인라인) | 인라인 `li translate(20px)→0 op 0→1` 19줄 ≈1.1s → 모작은 `padding-left 28→8` + op(아래 이유), 고정 사진 `translate(0,829)` 핀 → `position:sticky` |

파랑(모작에만): 밑줄 `scaleX 500 (.76,0,.24,1)`(원본은 Tailwind `after:` 전환이라 녹화 시간 안에 hover 가 닿지 않은 것), 쿠키 창 `400 (.32,.94,.6,1)`(원본 쿠키 창은 같은 곡선 — 녹화에서는 창이 이미 떠 있었음), 히어로 `drift`(영상 대신).

lineup 줄 등장의 수단을 바꾼 이유: `translateX(20px)` 는 오른쪽 끝 줄을 20px 화면 밖으로 밀어 `verify-site` 의 가로 넘침(768·390 에서 `li r=770…`)에 걸렸다. `padding-left` 를 줄이면 글자는 같은 거리 · 같은 곡선으로 움직이고 상자는 넘치지 않는다.

### 기능 — Playwright 스크립트로 실제 클릭·hover·키 입력

Playwright MCP 가 이 세션에 없어(TOOLING 클라우드 세션 항목) Playwright 라이브러리 스크립트로 마우스 클릭 · hover · 탭(touch) · 키(Tab · Enter · Esc · 화살표)를 보냈다. **58/58 PASS, 콘솔·페이지 오류 0** (`refs/clicktest.json`, 화면 `refs/mine-states/`).

| 묶음 | 확인한 것 |
|---|---|
| 쿠키 | 첫 방문 표시 · Manage → 스위치 `aria-checked` · Back · Confirm 저장 · 다시 열어도 안 뜸 |
| FAQ | 클릭 열림(높이 > 40) · 검정 막대 · 다른 질문 열면 닫힘 · 다시 누르면 닫힘 · Enter · 포커스 링(2px solid) · Policies 목차 → 스크롤 + `aria-current` |
| 뉴스레터 | 라디오 전 폼 숨김 · 라디오 → 폼 · 빈 제출 문구 + 이름 칸 포커스 · 메일 형식 문구 · 정상 입력 「Demo form — nothing was sent.」, 이동 없음 |
| 머리 · 언어 | 밑줄 hover · 티켓 hover 반전 · About 이동 + `aria-current` · FR → `lang=fr-CA` · EN 복귀 |
| about | 행렬이 시간으로 움직임 · 링크 줄 hover 검정 |
| lineup | hover → 그 연사 사진이 scale 0→1 로 위에 · 검정 막대 · 키보드 포커스도 사진 교체 · 이름 → 연사 페이지 |
| 연사 | 작업 판 scale 0 → 1(스크롤) · 일정 링크 → 같은 날 탭 |
| schedule | SEP 9 탭 · → 키로 SEP 10(세리프) · 행 hover 회색 + 왼쪽 사진 · 탭 줄 고정 |
| archives | 회차 알약 이동 · 라이트박스 3/20 열림 · 닫기 버튼 포커스 · → 4/20 · ← 20/20 순환 · Tab 갇힘 · Esc 닫힘 + 포커스 복귀 · 바탕 클릭 · ✕ · Listen 2/6 · 재생 `aria-pressed` + 진행 막대 · 일시정지 · Esc |
| 일정 상세 · 404 | Book your ticket → 해당 날 탭 · Back to home |
| 390 | 버거 보임 · 열림 `aria-expanded` + 스크롤 잠금 · Esc 닫힘 + 잠금 해제 · 바탕 탭 닫힘 · 메뉴 링크 이동 |
| reduced motion | Lenis 없음 · 행렬 정지 · 작업 판 처음부터 1 |

처음 돌렸을 때 걸린 것(고침): FAQ 질문을 h2 로 감싸면서 `button + .acc__a` 선택자가 끊겨 답이 안 열림 → `.acc__it.open` 으로. 라이트박스가 `visibility:hidden` 인 채로 포커스를 옮겨 실패 → 같은 프레임에 열고 포커스.

### 커밋 전 게이트

| 검사 | 결과 |
|---|---|
| `node scripts/verify-site.mjs http://127.0.0.1:4610/works/2026-W46/clone-01-offfforum/` | **페이지 78개 검사 · 문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개** (1440 · 768 · 390. 해시 주소 포함 78) |
| 404.html (링크가 없어 크롤러가 닿지 않음) | 같은 항목을 Playwright(CDP 같은 순서 1440→768→390)로 직접 잼: 넘침 0 · h1 1 · `href="#"` 0 · 콘솔 오류 0 |
| `npx --yes impeccable@4.7.0 detect` (37 HTML) | **0 anti-patterns found** · advisory 1(아래). 처음 87건: `tight-leading` 77(모바일 본문 18/20·14/17 → 18/24·14/19, 일정 위치 11/12 → 11/15, 강연 이름 14/12 → 14/19), `low-contrast` 3(강연 카드 Listen 흰 글자 → 검정 55% 바탕), `cramped-padding` 4(히어로 바탕색 제거 · FAQ 아래 선을 의사 요소로), `buried-raster` 2(히어로 사진 opacity 0 시작 제거 — 대신 자리 그림 층이 걷힘), `skipped-heading` 1(FAQ 질문 h3 → h2). 설정으로 끈 규칙 없음 |
| `node scripts/check-korean.mjs` | 화면에 한국어 없음(「한국어가 있는 페이지 0개」). 처음 빌드에서 인라인 JS 의 한국어 주석이 HTML 에 들어가 있어 빌드에서 주석 줄을 뺐다 |

### impeccable 예외 (advisory, 원본 실측 근거)

| 규칙 | 건수 | 근거 |
|---|---:|---|
| `repeating-stripes-gradient` (advisory) | 1 (404) | 원본 404 배경이 가로 주사선이 보이는 글리치 영상(`refs/states/404.jpg` · `404-mouse.jpg`의 가는 가로 줄). 영상을 쓸 수 없어 같은 줄을 `repeating-linear-gradient` 로 그렸다. 404 페이지에만 넣었다(처음엔 공통 CSS 에 있어 37페이지 모두 걸렸음) |

## 12. 못 한 것 · 원본과 다른 것

- **영상 4종**(홈 히어로 · 404 · 연사 작업 일부 · 강연 녹화)을 사진 + CSS 로 대신했다. 이 컨테이너에서 원본 영상도 재생되지 않아 움직임 자체는 보지 못했고, 포스터와 404 정지 화면으로만 읽었다.
- **프랑스어판**은 홈 1장. 나머지 32경로의 프랑스어 미러는 만들지 않았다(1절 이유). 프랑스어 홈의 메뉴·꼬리말 링크는 영어 페이지로 간다.
- **Nuxt 페이지 전환**(머리 유지 · 클라이언트 라우팅)은 없다. 보통 페이지 이동 + 제목 상자 등장.
- about 행렬의 **스크롤 결합**은 근사(7절). 원본은 화면을 벗어나면 결합이 풀리는 것까지 있다.
- about 행렬의 안쪽 확대를 `transform: scale` 대신 `object-view-box` 로 했다(넘침 검사 때문). Chrome·Edge·Safari 18 에서 같고, Firefox 는 확대 없이 보인다.
- **대비·행간 때문에 원본과 다른 값**: 지난 일정 행 .5 → .62, FAQ 목차 비활성 .3 → .55, © .4 → .6, 모바일 본문 18/20 → 18/24 · 14/17 → 14/19, 버튼 글자 모바일 11 → 12, Website by 10 → 11px, 강연 Listen 바탕 검정 55%. 데스크톱 본문 24/26 은 원본 그대로.
- **접근성 때문에 원본에 없는 것**: 일정 탭 `role=tab`·`aria-selected`·화살표 키, 라이트박스 좌우 버튼 이름 · 포커스 갇힘, 버거 `aria-expanded`, 쿠키 스위치 `role=switch`, 뉴스레터 검증 문구, 건너뛰기 링크. about 소개 문장 h1 → h2, FAQ 질문 h3 → h2.
- **외부 링크 대체**(1절): 티켓 · 예매 → 일정 페이지, 연사 「Website - …」 → 「Schedule - Sep N」(가상 업체라 갈 곳이 없음), 파트너 로고는 링크 없는 칸, 도시 회차 → 위키백과.
- 원본이 404 로 끊어 둔 일정 상세 2개를 만들어 이었다(원본과 다름).
- 아카이브 「Galerie」 → 「Gallery」.
- 원본 모바일은 홈 · lineup · about 390 캡처만 있다. 나머지 페이지의 모바일 배치는 원본 클래스(`md:` · `lg:` 분기)를 읽고 맞췄다.
