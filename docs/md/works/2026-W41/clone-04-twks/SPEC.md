# SPEC — twks

## 출처

- **원본 URL**: https://twks.ch/en (영어판. 기본 언어는 프랑스어 `twks.ch`)
- **어워드**: Awwwards **Site of the Day**
- **어워드 링크**: https://www.awwwards.com/sites/twks-1
- **수상일**: 2026-10-07 (수상 페이지를 헤드리스로 열어 "Site of the Day - Oct 7, 2026" 문구 직접 확인)
- **제작**: twks (스위스 제네바 크리에이티브 에이전시, 자체 제작)
- **모작 날짜**: 2026-10-07 (영어 모작, 2026-W41 clone-04)
- **모작 브랜드명**: `kvlo` (가상, 로잔의 디자인 스튜디오). 웹 검색 "kvlo agency OR studio branding" — 일치하는 에이전시·스튜디오 없음(비교 검색한 `oblq` 는 브뤼셀 실존 에이전시라 버림). 의뢰처 33곳(Halde Kultur · Furno Nove · Vergé Paper …), 인물 이름(크레딧·글쓴이·채팅 담당 Lena)도 전부 지어낸 것. 웹 검색 "Halde Kultur" OR "Ensemble Sorne" OR "Furno Nove" OR "Rinde Drinks" — 일치 없음. 원본 이름·로고·문구·사진·의뢰처(Bulgari·Chopard·ICRC 등 실존 브랜드)·인물 사진은 쓰지 않았다.

### 대상 선정 — 2026-10-07 Awwwards SOTD 목록을 직접 열어 본 결과

`awwwards.com/websites/sites_of_the_day/` 를 헤드리스 Chrome 으로 열어 목록을 긁고, 수상 페이지마다 "Site of the Day - …" 문구로 날짜를 확인했다. 후보 사이트는 첫 화면을 열어 캔버스·WebGL·영상·내부 링크 수·문서 높이를 쟀다(`refs/` 밖 스크래치 기록, 첫 화면 캡처는 아래 열).

| 수상일 | 사이트 | 판정 | 근거 (직접 열어서 잰 것) |
|---|---|---|---|
| **10-07** | **twks** https://twks.ch/en | **선택** | 영어판 있음. **캔버스 0 · WebGL 0**. 화면은 사진·실사 영상(인쇄물·현장 촬영)과 큰 타이포. 히어로 15장(사진 11 · 영상 4) 교차, 푸터 아래 글자 표범은 영상 1개 — 배경 효과 수준이라 2D 캔버스로 대체 가능. 내부 페이지: Projects · Archives · Agency · Services 3 · Insights · 프로젝트 상세 37 · 글 44 + 404. 기능: services 드롭다운, 연락 패널(시계·티커), 채팅형 문의 폼(단계 13, 체크·범위·라디오·검증), 프로젝트 필터(두 축 + Reset), 아카이브 호버 사진, 스크롤 아코디언, 고객 목록, See more · Credits 아코디언, 링크 복사, 뉴스레터 폼, 모바일 메뉴 |
| 10-06 | LIDAR DRONE SCANNING (Aevion) https://drone.riotters.com/ | 제외 | 화면 전체 WebGL2 캔버스 2개(1440×900 · 1392×824) + 영상 3, 내부 링크 1(원페이지) |
| 10-05 | SANTIONI SPIRITS | 제외(지난 판정) | WebGL 캔버스 1개가 화면 전부 (`clone-02-tengile/SPEC.md`) |
| 10-04 | EDOLUS | 제외(지난 판정) | PlayCanvas 3D 가 화면 전부 |
| 10-03 | TENGILE MALAMALA | 제외 | 이미 모작(W41 clone-02) |
| 09-26 | MEER MOHSIN https://www.meermohsin.me/ | 제외 | 1440×900 WebGL2 캔버스 3개, "3D Web Developer" 포트폴리오, 내부 링크 1 |
| 09-24 | MOTO FINANCE https://www.moto-card.com/ | 제외 | WebGL2 캔버스 3개(카드 3D), 내부 페이지 3개뿐 |
| 09-23 | SOBHA PRIVY COLLECTION https://sobha-privy-collection.com/ | 제외 | 문서 높이 900 고정, 영상 12개가 화면 주도, 내부 링크 2 |

이미 모작한 곳(works/ 전부)과 겹치지 않는다.

---

## 사이트 구조

- **원본 페이지**: Home · Projects(선정 37) · Archives(284줄) · 프로젝트 상세(37) · Agency · Services(Branding · Campaign · Digital) · Insights(44) · 글 상세 · 404. 연락은 페이지가 아니라 오른쪽 패널. **원본 Campaign 영어판은 404 페이지**(`refs/vp/services--campaign/00.jpg` — 글자 고양이 404). 메뉴에서 이어지므로 모작은 Branding 과 같은 틀로 만들었다(아래 생략·대체).
- **모작 페이지: 78** — 홈 · Projects · Archives · 상세 **33** · Agency · Services 3 · Insights · 글 **36** · 404. `build.mjs` + `data.mjs`(+`data-more.mjs`) 로 생성. `href="#"` 0. 링크는 전부 `<폴더>/index.html` 이라 더블클릭(file://)으로도 이어진다.
- **분량 맞춤**: 원본 선정 37 · 아카이브 284 · 글 44 → 모작 33 · 252 · 36. 문서 높이가 ±15% 안에 들도록 맞췄다(아래 그리드 표).

```
/ (홈)              히어로(사진 8장 3.6초 교차, 헤더가 화면 가운데) → 큰 문단(웃는 얼굴 SVG) → What we do → Agency·Career → Case studies 4 → Latest publications 4 → 푸터
├─ projects/        헤더 부제 "Selected projects ³³ / Archives ²⁵²" → 필터(Services | Industries · 옵션 · Reset) → 3열 카드 33
│   └─ <33>/        큰 제목 2줄 → Services·Industries·Visit + 소개 + See more 아코디언 → 갤러리 17칸(가로 1 · 세로 2 반복) → Credits 아코디언 → Awards → Download assets → More projects 3
├─ archives/        왼쪽 고정 사진 3/4 → 분야 12 × 21줄(이름·작업·연도·Case →)
├─ agency/          kvlo + 큰 문단 → About → 사무실 사진 → approach + 스크롤 아코디언 4 → customers(고정, 이름 15) → +28 awards → career
├─ services/<3>/    제목 + 큰 문단 → 스크롤 아코디언 5~6(Find out more → 글) → ○○ projects 4
├─ insights/        제목 + 회색 부제 → 4열 벽돌 배치 36
│   └─ <36>/        헤더 부제 "Published on dd.mm.yyyy" → 큰 제목 → 사진 → 본문 520 폭(소제목 9 · 사진 묶음 6) → Written by · Share · Subscribe → More articles 4
└─ 404.html         검은 화면 + 앉은 고양이 글자 그림 + "404 Not Found ☹ · Back to homepage"
레이어: services 드롭다운 · 연락 패널 · 채팅 문의 · 모바일 메뉴 · 커서 라벨
```

| 원본 | 모작 |
|---|---|
| twks · swiss creative agency · Genève · since 2011 | kvlo · swiss design studio · Lausanne · since 2012 |
| 실존 의뢰처(EPFL, Meyrin culture, Bulgari, ICRC…) | 가상 33곳 |
| Marie, Project Director (사진) | Lena, Project Director (머리글자 원 — 인물 사진 없음) |
| 전화·메일·주소 | `+41 (0) 00 000 00 00` · `hello@kvlo.example` · `Rue des Ateliers 00` |

## 그리드

원본 Tailwind 4: `--spacing .25rem`, 좌우 `px-base` 10px, 12열 거터 10px, `--spacing-accordion` 10px, `--spacing-gap-medium` 15px. 브레이크포인트 lg 1024 · xl 1280 · 2xl 1536.

| 항목 | 원본 (실측) | 모작 |
|---|---|---|
| 좌우 여백 · 거터 · 열 | 10 · 10 · 12열 | 같음 (`.grid12`) |
| 헤더 | 로고 2열 · 메뉴 5열(xl 6) gap 15 · 부제 9~10열 · contact 11~13열, 높이 42 | 같음 |
| 홈 큰 문단 | pt 90 · mb 160, 첫 줄 들여쓰기 1/6 | 같음 |
| What we do | 6열 중 2~7열, 안쪽 10열 중 7~11열, 위 테두리 | 같음 |
| CTA | 9~13열, 위 1px 선 + 화살표 | 같음 |
| 사례 카드 | 2열 · 세로 간격 100 · 비율 3/2·3/4 | 같음 |
| 글 카드 | 4열 · 1/1·3/4 | 같음 |
| 프로젝트 목록 | pt 120 · 필터 9열(+3열 옵션) · mb 100 · 3열 | 같음 (옵션 칸 높이 288 = 산업 12줄) |
| 상세 | 제목 pt 220 · mb 100, 6열 메타(3열 dl · 5~7열 글), 갤러리 2열 gap 10 | 같음 |
| 글 상세 | 제목·사진 688 폭 가운데, 본문 520 폭 가운데 | 같음 |
| 아카이브 | 사진 1~3열 sticky top 10, 목록 5~13열(분야 1열 · 행 3열) | 같음 |
| 스크롤 아코디언 | 사진 1~4열(xl) 3/4, 항목 7~13열 안 2열 중 1열 | 같음 |
| **문서 높이**(1440, 끝까지 스크롤 후) | 홈 5822 · Projects 10663 · Agency 8656 · Branding 7285 · Digital 6602 · Insights 6514 · Archives 20702 · 상세(Pinsa) 14278 · 글 12733 | 5834 (+0.2%) · 10084 (−5.4%) · 9172 (+6.0%) · 6336 (−13.0%) · 6731 (+2.0%) · 5742 (−11.9%) · 19666 (−5.0%) · 상세(Furno Nove) 14410 (+0.9%) · 글(Bakery) 10958 (−13.9%) |

전 페이지 ±15% 안. Campaign 은 원본이 404 라 Branding 높이와 비교(−13.0%).

## 타이포

| 역할 | 원본 | 대체 | 근거 |
|---|---|---|---|
| 전부 | GT Standard 400/500/600 (Grilli Type, 유료) | **Albert Sans 400/500/600** | 같은 계열의 중립 그로테스크. Google Fonts. Geist·Instrument Sans 는 impeccable `overused-font` 대상이라 바꿈 |
| 표지 패널(직접 짠 브랜드 그래픽) | — (원본은 실제 인쇄물 사진) | Anton · Archivo Black · DM Serif Display · Space Mono | 가상 의뢰처마다 서체·색 한 쌍 |

| 토큰 | 원본 (실측) | 모작 |
|---|---|---|
| text-big | 52.8px · lh 1 · 600 · −0.01em (lg) / 36px (모바일) | 같음 |
| 본문(기본) | 20px · lh 24 · 0.01em | 20px · **lh 26** (접근성, 아래) |
| text-small | 16px · lh 1.2 | 16px · **lh 1.32** |
| 글 본문 | 16 · lh 22.4 / 소제목 20 · 600 | 같음 |
| 캡션 | 12 · lh 16 | 같음 |
| 메뉴 | 20 · 소문자 | 같음 (줄 26 + 위아래 8 = 42, 원본 24 + 9 = 42) |
| 모바일 메뉴 | 60px · 500 | 같음 |

**바꾼 행간(접근성)**: 원본 20/24(1.2)·16/19.2(1.2)를 1.3 이상으로(impeccable `tight-leading`). 52.8px 큰 문단 lh 1.0 은 원본값 유지 — 아래 게이트 표.

## 아이콘

원본: 화살표는 글자 `→`(두 개 겹쳐 밀어내기), 채팅 아이콘(말풍선 2개), 편지 ✉, 닫기 ×(11px 선), 내려받기 화살표, 버거 두 줄(20×8). 모작은 같은 크기로 직접 그린 인라인 SVG(`build.mjs ICON`). 원본 문단 안의 로티 머리(53×53, 웃는 얼굴)는 **직접 그린 웃는 얼굴 SVG + 눈 깜빡임**(4.2초)으로 대체. 원형 번호는 원본처럼 글자 ①~⑥ / ❶~❻.

## 컬러

| 역할 | 원본 hex | 모작 | 대비 |
|---|---|---|---|
| 본문 바탕 · 글 | `#FFFFFF` · `#000000` | 같음 | 21:1 |
| 회색 글(grey-02) | `#8C8C8C` (흰 바탕 **3.36:1**) | **`#737373`** — 원본의 `--color-grey-02-inverted` 값 | 4.74:1 |
| 푸터 바탕 · 회색 | `#000` · `#8C8C8C` | 같음 | 6.25:1 |
| 연락 패널 칸 | `#2B2B2B`·`#575757`(Engage) / 글 `#D8D8D8`·`#FFF` | 같음 | 9.9:1 · 7.0:1(흰 글 on #575757) |
| 채팅 내 말풍선 | `#07F` 위 흰 글 (**4.14:1**) | **`#0060D1`** | 5.84:1 |
| 채팅 상대 말풍선 | `#505050`(grey-01) | 같음 | 8.06:1 |
| 오류 · 확인 | `#FF4B14` · `#39EB72` (검은 바탕) | 같음 / 흰 바탕 오류 `#C2360A`(5.5:1) · 확인 `#127A35`(5.4:1) | |
| 헤더 | 흰 글 + `mix-blend-mode: difference` (흰 바탕에선 검게 보임) | 같음. 부제의 흐린 줄(Archives/Selected projects)만 `#8C8C8C` → **`#A6A6A6`**(차이 합성 후 흰 바탕 `#595959` 7.0:1 · 검은 바탕 8.6:1) | |
| 고양이 글자 | 흰~회색 | `rgb(95~205)` 회색 단계 | 장식 |

## 간격

| 항목 | 원본 | 모작 |
|---|---|---|
| 섹션 사이 | 150 · 200 · 160 · 100 (mt-37.5 · mt-50 · mb-40 · mb-25) | 같음 |
| 페이지 머리 | pt 220 (lg:pt-55) · 목록 pt 120 | 같음 |
| 아코디언 · 표 행 | 위아래 10 (`--spacing-accordion`) | 같음 |
| 제목 → 목록 | 15 (`--spacing-gap-medium`) | 같음 |
| main 아래 | 150 | 같음 |
| 반복 수치 | 10 · 15 · 100 · 150 · 200 | 같음 |

---

## 모션

라이브러리: 원본 Alpine.js + GSAP(+ScrollTrigger) + Lenis(관성 스크롤) + dotLottie. 모작은 라이브러리 없이 CSS 전환·키프레임 + rAF 스크롤 계산(`assets/site.js`), 네이티브 스크롤.

실측(`refs/origin.md`, `refs/motion-origin/motion.json` 인라인 스타일 119요소): 전환 `0.5s ease` 계열, `cubic-bezier(.4,0,.2,1)`, 이미지 `scale 1.2 → 1 · opacity 0 → 1` 약 2.4s, 히어로 확대 `scale 1 + y/900 · opacity 1 − y/900`, 헤더 숨김 `translate 0 → −100%` 749ms, 푸터 `translate 80% → 0`.

| 시점 / 트리거 | 원본 (`refs/motion-origin`) | 모작 |
|---|---|---|
| 홈 0–0.5s | 검은 화면 | 같음 (`.intro-veil`) |
| 홈 ~0.5s | 가운데에 `twks` 글자가 아래(110%)에서 올라옴, 이어서 `swiss creative agency` | 같음 — `kvlo` 글자 40ms 간격 · 부제 14ms 간격, 0.9s |
| 홈 ~1.1–2.2s | 로고(→왼쪽 512px)와 부제(→오른쪽 −236px)가 갈라져 제자리로 | 같음 1.3s `(.77,0,.175,1)` (이동 거리는 화면 폭에서 계산) |
| 홈 ~2.2s | 히어로 사진 `scale 1.2 → 1 · opacity 0 → 1` 2.4s, 메뉴 글자 차례로 올라옴 | 같음 2.5s · 메뉴 22ms 간격 |
| 상시 | 히어로 15장 3604ms 마다 교체(영상 칸은 끝날 때까지), 새 장 `scale 1.2 → 1` | 사진 8장 3604ms, 새 장 2.5s 같은 확대 |
| 스크롤 | 히어로 `scale 1 → 2 · opacity 1 → 0` (한 화면 동안 선형) | 같음 |
| 스크롤 | **헤더: 홈은 화면 가운데(top 429)에서 시작해 페이지와 함께 올라가다가 맨 위(0)에 닿으면 고정. 안쪽 페이지는 처음부터 맨 위 고정. 숨지 않음.** 흰 글 + `difference` 합성이라 흰 바탕에선 검게, 사진 위에선 반전. **맨 끝에서 푸터가 화면을 다 덮으면(top ≤ ~10px) 헤더가 `translate −100%` 로 749ms 동안 올라가 숨고, 올리면 다시 내려옴** (헤드리스로 휠 250px 씩 굴려 실측: 홈 y 4910 −72% · 4921 −98.8% · 4922 −100%, 올려서 4716 에서 0. Agency 7752 −90%) | 같음 — 홈은 `--ny` 로 스크롤 그대로 따라감(전환 없음), 숨김만 750ms `(.77,0,.175,1)`. 테스트 "홈 헤더 첫 화면 top 429 → 스크롤 후 0", "맨 끝에서 헤더 숨김 → 올리면 다시 나옴" 통과 |
| 스크롤 끝 한 화면 | 푸터는 `fixed` 로 본문 아래 깔려 있고 `translate 0 80% → 0` 으로 올라옴 | 같음 |
| 스크롤 | 테두리 선 왼쪽부터 그려짐(animated-border-t) | 같음 1.2s |
| 스크롤 | 카드 사진 `scale 1.2 · opacity 0 → 1` (img-load) | 같음 |
| 스크롤 고정 | Approach·Services 아코디언: 고정 구간 진행도로 항목이 하나씩 열리고 왼쪽 사진이 바뀜, 번호 ① → ❶ | 같음 (열림은 0.7s 전환으로, 원본은 스크롤에 맞춰 높이가 스크럽됨 — 아래 생략 표) |
| 스크롤 고정 | Customers: 목록이 올라가며 화면 가운데 이름이 검게, 오른쪽 108px 사각 사진 교체 | 같음 |
| 호버 | 메뉴: 글자 하나씩 위로 빠졌다 아래에서 다시 올라옴 + 밑줄이 왼쪽에서 그려짐 | 같음 0.6s · 18ms 간격 |
| 호버 | services: 하위 3줄이 위(−110%)에서 내려옴 | 같음 0.5s, 40ms 간격 |
| 호버 | CTA: 위 선이 오른쪽으로 빠지고 새 선이 왼쪽에서 들어옴, 화살표도 같은 방식 (`cta-line-1 0 → 504px` · `cta-line-2 −507 → 0`) | 같음 0.9s / 화살표 0.6s |
| 호버 | 카드·고객 이름: 커서 옆 라벨 "See the project" / "Read the article" / "Coming soon" (`difference`) | 같음 |
| 클릭 | 연락 패널·채팅: 오른쪽에서 `translate 1440 → 0`, 뒤 화면 흐림 | 같음 0.8s · blur 24px |
| 연락 패널 | 위 티커 가로 흐름(`div.flex…whitespace-nowrap` −3.4 → −565px / 16.7s ≈ 34px/s) | 같음 34s 에 반 바퀴 |
| 채팅 | 말풍선 `opacity 0 · translateY 20px → 0` 차례로 | 같음 0.45s |
| 상세 | See more · Credits: 높이 펼침 + 글자 Open/Close 굴림 + ↓ 회전 | 같음 0.9s |
| 푸터 | 글자로 그린 표범이 달림(영상 루프, 글자 T·W·$·+·:) | **캔버스 2D 로 직접 그린 달리는 고양이**를 글자 K·V·L·O·+·:·. 로 찍음 (아래 생략 표) |

### 녹화 대조 결과

비교 HTML: `C:\Users\swxp\Desktop\더드림벤처스\모션비교\2026-10-07\모션비교-KVLO.html` (같은 파일 `refs/motion-compare.html`). 홈, 로드 5s → 휠 끝까지 → 메뉴(projects)·CTA 호버.

| 구분 | 줄 수 |
|---|---:|
| 서명 일치 | 0 |
| **빨강(원본에만)** | **0** — 원본은 CSS 애니메이션을 쓰지 않고 GSAP 가 인라인 스타일로 움직인다(애니메이션 0건 · 인라인 스타일 119요소). 그 인라인 기록(위 모션 표의 수치)을 하나씩 옮겼다 |
| 파랑(모작에만) | 15 — 원본의 GSAP 인라인 움직임을 CSS 로 옮긴 것들: 글자 올라옴 `chin` 900 · 로고/부제 `slideL/R` 1300 · 히어로 `sInFirst`/`sIn` 2500 · 사진 등장 opacity 900/scale 1600 · 테두리 1200 · 헤더 숨김 750 · 밑줄 500 · CTA 선 900/화살표 600 · 문단 등장 1000 · 웃는 얼굴 깜빡임 |
| 인트로 프레임 | 원본 1.78s(페이지가 뜬 시각)부터 / 모작 0.25s 부터 같은 순서: 검정 → 로고 → 부제 → 갈라짐 → 사진 → 메뉴. 프레임 시트 `refs/motion-mine/timeline.html` |

## 기능 목록

| 기능 | 위치 | 열림 | 닫힘 | 상태 표시 |
|---|---|---|---|---|
| services 드롭다운 | 전 페이지 헤더 | 호버 · 클릭/Enter | 마우스 떠남 · ESC · 바깥 클릭 · 포커스 이탈 | `aria-expanded` |
| 연락 패널 | contact 버튼 | 클릭 | ×, ESC, 바깥(흐린 덮개) | `aria-expanded`, 포커스 가둠·복귀, 배경 스크롤 잠금, 현지 시각·시계 실시간 |
| 채팅 문의 | 패널 Engage us · 푸터 Tell us about your project | 클릭 | ×, ESC, 바깥 | 단계: 이름 → 회사 → 서비스(체크 6) → 급한 정도(범위 5단) → 자유도(범위 4단) → 경험(라디오 3) → 추가 정보(선택) → 이메일+전화 → 알게 된 경로(라디오 6) → 끝 안내. 빈칸·미선택·이메일·전화 형식 검증 문구, `aria-invalid`, `aria-valuetext`. **전송하지 않음** |
| 뉴스레터 | 푸터 · 글 끝 | 버튼 → 입력칸 펼침·포커스 | | 빈칸·형식 오류, 접수 문구(보내지 않음) |
| 프로젝트 필터 | Projects | Services/Industries 탭(`role=tab`) → 옵션 클릭 | 같은 옵션 다시 · Reset | `aria-selected`·`aria-pressed`, 탭 옆 ¹, 결과 없는 옵션은 숨김(원본 `availableServices/Industries`), 결과 수 `aria-live` |
| 커서 라벨 | 카드 · 고객 이름 | 호버 | | `aria-hidden` (장식) |
| 아카이브 사진 | Archives | 줄 호버·포커스 | | 줄 검게 + 왼쪽 사진 교체 |
| 스크롤 아코디언 | Agency · Services 3 | 스크롤 진행 | | 번호 채움 · 사진 교체 |
| 고객 목록 | Agency | 스크롤 · 호버 | | 가운데 이름 검게 · 사진 |
| See more | 상세 | 버튼 | 다시 | `aria-expanded`, 닫힌 내용 `inert` |
| See all credits | 상세 | 버튼 | 다시 | 같음 |
| Download assets | 상세 | 링크 | | 실제 파일(가상 보도자료 .txt) |
| 링크 복사 · 공유 | 글 | Copy link | 1.8s | "Copied! ✓", 공유 링크에 현재 주소 |
| 모바일 메뉴 | <1024 | 버거 | 버거 · ESC | `aria-expanded`, 배경 잠금, services 하위 펼침 |

**원본에 없는데 넣은 것 (접근성 최소선만)**: ① 레이어 포커스 가둠/복귀 ② 연락 패널·채팅·드롭다운·모바일 메뉴 ESC 닫기(원본 연락 패널은 ESC 로 안 닫힘 — `refs/states/05b-contact-after-esc.jpg`) ③ 폼 오류를 입력칸 옆 글자로(원본 뉴스레터는 브라우저 기본 말풍선 `refs/states/07b-newsletter-invalid.jpg`) ④ 필터 결과 수 `aria-live` ⑤ 건너뛰기 링크 ⑥ 드롭다운을 클릭/Enter 로도 열기(원본은 호버만, `span` 이라 키보드로 못 엶).

### 상태별 refs

원본 `refs/states/`: 01–03 홈 처음·스크롤·되올림 · 04 드롭다운 · 05 연락 패널 · 05b ESC 뒤(안 닫힘) · 06 푸터 · 07 뉴스레터·오류 · 08 채팅 1~3단계 · 09–10 필터 Industries·Food · 11 커서 라벨 · 12–13 See more·Credits · 14 아코디언 · 15 고객 호버 · 16 아카이브 호버 · 17 링크 복사·구독 · 18–19 모바일 홈·메뉴. 페이지별 화면 `refs/vp/<페이지>/NN.jpg`, 전체 `refs/en*/00-full.jpg`.
모작 `refs/final/states/`(같은 번호) · `refs/final/mobile/` · 나란히 비교 `refs/cmp-1.jpg`·`cmp-2.jpg`·`cmp-states-1.jpg`·`cmp-states-2.jpg`.

## 섹션 순서

- **홈**: 헤더(가운데) → 히어로 → 큰 문단 → What we do → Agency·Career → Case studies 4 → Latest publications 4 → 푸터. (원본 main 섹션 6개 = 모작 6개, `refs/origin.md` "섹션")
- **Projects**: 부제(Selected/Archives) → 필터 → 카드 3열.
- **상세**: 제목 → 메타 + 소개 + See more → 갤러리 17 → Credits → Awards → Download assets → More projects 3.
- **Agency**: kvlo 문단 → About → 사진 → approach + 아코디언 → customers → awards → career.
- **Services**: 제목·문단 → 아코디언 → ○○ projects 4.
- **Insights**: 제목·부제 → 벽돌 4열. **글**: 제목 → 사진 → 본문 → Written by/Share/Subscribe → More articles.
- **Archives**: 사진 + 분야별 목록.

---

## 게이트

### verify-site — **190 URL 문제 없음**
`node scripts/verify-site.mjs http://localhost:4432/` → "콘솔 에러 0, 가로 넘침 0(1440·768·390), href=\"#\" 0, h1 전부 1개" (`refs/verify-final.txt`). 중간에 걸린 것: 홈 favicon 404(→ 데이터 URI 아이콘), Agency 390px 넘침 16px(career 문단의 메일 주소가 줄바꿈 안 됨 → `overflow-wrap:anywhere`).

### impeccable detect — 파일 78 HTML + CSS
`refs/detect-1.txt`(**1644건**) → `detect-2..4` → `refs/detect-final.txt` **11건, 전부 원본 구조**. 설정·주석으로 끄지 않음.

직접 고친 것:
- `overused-font` 78 → 0: Geist → Instrument Sans(이것도 걸림) → **Albert Sans**
- `cramped-padding` 948 → 1: 회색 `media` 배경 제거, `padding-block`(변수) → `padding-top/bottom` 10px 로 풀어 씀, 연락 패널 칸 위 14px, 404 섹션 배경을 main 으로
- `tight-leading` 268 → 10: 본문 20/26, 작은 글 1.32
- `buried-raster` 266 → 0(파일 검사): 아카이브·고객 사진을 겹쳐 둔 수십 장 → 한 장의 `src` 교체로
- `pulsing-dot` 78 → 0: 티커 점 깜빡임 제거(원본 실측 근거 없음)
- `skipped-heading` 3 → 0(서비스 단계 제목 h3 → h2) · `flat-type-hierarchy` 3 → 0 · `low-contrast` 1 → 0(404 흰 글 → 검은 main)

남은 것 — **원본에 실측으로 있는 구조**:

| 규칙 | 건수 | 원본 근거 |
|---|---:|---|
| `tight-leading` 1.00x | 8 (홈·Agency·Insights·Services 3) | 원본 `.text-big { font-size:3.3rem; line-height:1 }` (스타일시트 실측), h1 52.8/52.8 (`getComputedStyle` 실측). 52.8px 디스플레이 문단 |
| `tight-leading` 1.08x | 2 (홈·Agency) | 같은 text-big 줄에 53px 웃는 얼굴 SVG·✉ 아이콘이 끼어 줄 상자가 57px 가 된 것 — 원본 홈 문단의 53×53 로티와 같은 배치(DOM 실측 `dotlottie-wc twks_head_02.lottie 53x53`) |
| `cramped-padding` `<section> "hero"` | 1 (홈) | 원본 `section.relative.w-full.h-svh.overflow-hidden.bg-black` — 풀블리드 사진 히어로. 안의 사진·덮개는 절대 배치 |

URL 검사(`--viewport 1440x900`, 8페이지, `refs/detect-url-1.txt` → `refs/detect-url-final.txt`, script-error 0)에서 본 것과 처리:
- `script-error` 2 → **0** (고객·아카이브 사진 교체 코드의 `$$` 가 문자열 치환에서 `$` 로 바뀐 버그 — 고침)
- `low-contrast … on blend mode` 6 (Projects·Archives 헤더 부제): 흐린 줄 색을 `#A6A6A6`, 숫자 15px·600 으로 바꿔 **중앙값 5.8~12.4:1**. 남은 "pixel contrast 1.4~1.9" 는 차이 합성 글자 가장자리의 안티앨리어싱 픽셀 최솟값
- `buried-raster` (아래쪽 카드 사진 opacity 0): 원본 `.img-load img { scale:120%; opacity:0 }` 를 GSAP 가 화면에 들어올 때 1 로 올림(스타일시트·인라인 기록 실측). 모작도 화면에 들어오면 1
- `text-occlusion` (푸터 글자가 본문 아래): 원본 푸터는 `fixed` 로 본문 밑에 깔려 있다가 끝에서 드러남(실측 `footer translate(0%, 80%)` · top 720 고정)
- `clipped-overflow-container` (메뉴 글자 `li`, `ul.sub`, `span.tgl-w`, `cust-pin`): 원본 글자 굴림 `overflow:hidden; height:1lh`, `ul.absolute…overflow-hidden`, `data-accordion-text-wrapper overflow-hidden`, 고정 고객 목록 — 같은 구조
- `heading-rhythm` (카드 제목 위 10 · 아래 150, 아카이브 행 h2 위 10 · 아래 30): 원본 카드 `mb-2.5` + 그리드 `gap-y-25`, 아카이브 `py-(--spacing-accordion)` 그대로
- `body-text-viewport-edge` (큰 문단 좌우 10px): 원본 `px-base` 10px 전폭 문단

### 헤드리스 클릭 테스트 — **67 / 67 통과**
`refs/tests/click-test.js` (CDP 로 실제 마우스·키 이벤트), 결과 `refs/tests/click-result.txt`. 홈 인트로·헤더 위치 6 · 드롭다운 5 · 연락 패널 7 · 채팅 11 · 푸터·뉴스레터·헤더 숨김 6 · 필터 8 · 상세 5 · 아카이브 2 · 아코디언·고객 3 · 글 3 · 인사이트 2 · 메뉴 이동·키보드 2 · 404 1 · 모바일 5 · 콘솔 1.

---

## 사진

> 사용자 지시 원문: **"근데 이미지가 없잖아 이미지를 비슷한 무드로 픽사베이나 언스플래쉬같은곳에서 긁어오셈"** · **"감도높은 사진을 핀터레스트에서 찾아서 긁어오기"**
> 이번 작업 지시: Pinterest 사진에 AI 렌더가 섞여 지적받음 → 사용 사진 전체를 이름 붙인 밀착 시트로 직접 검수, 의심 계열은 Unsplash 실사 우선.

| | |
|---|---|
| 채택 | **213장 (원본 사진 205장 — 8장은 두 묶음에 같이 들어감) · 전부 Unsplash 무료분** (Unsplash+ 제외) |
| 후보 | 검색어 25개 → **339장** (Unsplash 273 · Pinterest 66), `refs/photo-raw/` (공개 안 함) |
| 2차 검수 | 1차로 고른 Pinterest 27장(정물·종이·밤 거리·알프스)을 **전부 빼고** Unsplash 실사 49장으로 교체 — AI 렌더가 섞이기 쉬운 계열이라 의심 여부와 관계없이 출처째로 바꿈. 이어 채택본 전체를 이름 붙인 밀착 시트(`refs/photo-review/used-0..6.jpg`)로 한 장씩 다시 보고 3장 더 뺌(무대 위 축제 로고, 사과 3개를 쌓은 합성 의심 정물, 과포화 호수) |
| 출처 기록 | `assets/photos/credits.json` — 파일 · 원 파일 · 묶음 · 출처 · 사진 페이지 주소 · 작가 · 검색어 · 라이선스 · 명도 · 평균색. 출처 없는 사진 0 |
| 선택 | `refs/select-photos.mjs` (뺀 134장과 이유 `REJECT`) |
| 검수 시트 | 후보 `refs/photo-review/raw-*.jpg` · `rawu-*.jpg`, 채택본 `refs/photo-review/used-*.jpg` |
| 인물 | 얼굴이 보이는 사진 0. 공연장 관객은 역광 실루엣, 작업 사진은 손만 |

### 뺀 기준

| 이유 | 예 |
|---|---|
| AI 생성·3D 렌더 의심 | 사무실 3(렌더 같은 하얀 미래형 실내), 의자 4(빛나는 상자 속 의자 등), 떠 있는 천, 정물 6(코카콜라 아닌 것 중 너무 매끈한 색 정물: 꽃병·푸딩·석류), 종이 4(떠 있는 책·나선 책탑·흐르는 종이), 알프스 4(과포화·HDR), 그라데이션 14장 전부 |
| 실존 인물 얼굴 | 밤 거리 인물 12장 전부, 작업실 여성 1, 보트 위 사람 1 |
| 로고·상표·글자 | 코카콜라 3, 카메라 상표(Canon·Minolta·Fujifilm·Nikon·Kodak) 13, 와인 라벨 2, 신문·책등 글자 4, "To do:" 메모, 포스터 걸린 작업실·전시장 4, 무대 화면 글자 |
| 누운 사진·주제 다름 | 알프스 3(90° 회전), 해골 병, 돌 |

목록과 이유: `refs/select-photos.mjs` 의 `REJECT`. 시트: `refs/photo-review/raw-*.jpg`(후보 전체, 이름 표시).

---

## 생략·대체 (숨기지 않고 적는다)

| 원본 | 처리 |
|---|---|
| 히어로 15장(사진 11 + 영상 4) | 사진 8장. 영상 칸 없음(모두 3604ms) |
| 카드·상세의 실제 인쇄물·브랜딩 사진 | 같은 무드의 실사 스톡 사진 + **직접 짠 표지 패널**(가상 의뢰처의 서체·색 그래픽). 상세 갤러리 17칸 중 3칸이 패널 |
| 푸터 글자 표범(영상 `twks_panthere_loop.mp4`) | 캔버스 2D 로 고양이 실루엣을 매 프레임 그리고(다리 4개 위상차 · 꼬리 · 몸 흔들림), 7×10 → 6×8px 칸마다 글자를 찍음. 404 의 앉은 고양이도 같은 방식 |
| 문단 속 로티 머리(dotLottie) | 직접 그린 웃는 얼굴 SVG + 눈 깜빡임 |
| Lenis 관성 스크롤 | 네이티브 스크롤 |
| 스크롤 아코디언의 높이 스크럽(GSAP ScrollTrigger) | 진행도로 항목 전환 + 0.7s 높이 전환 |
| 연락 패널 위 검은 칸(재생 목록 영상 영역) | 막대 48개 이퀄라이저(CSS) |
| 채팅 담당자 사진 | 머리글자 원(인물 사진 금지) |
| 채팅 13단계(이름 → … → 전송) | 10단계, 서버 전송 없음 |
| 영어 / Français 전환 | Français 는 흐린 글자로 두고 링크 없음("not available in this demo" 보조 문구) |
| Visit 칸의 의뢰처 인스타그램 링크 | 가상 계정이라 글자만(가짜 외부 링크를 만들지 않음) |
| Services › Campaign 영어판(원본 404) | Branding 과 같은 틀의 페이지로 만듦(메뉴에서 이어지므로 404 로 두지 않음). 원본 404 화면은 `404.html` 로 따로 재현 |
| 프로젝트 37 · 아카이브 284 · 글 44 | 33 · 252 · 36 (문서 높이 ±15% 안) |
| 히어로 영상 칸이 끝날 때 다음 장 | 해당 없음 |
| 폼 전송 · 뉴스레터 가입 | 보내지 않음, 접수 문구만 |
