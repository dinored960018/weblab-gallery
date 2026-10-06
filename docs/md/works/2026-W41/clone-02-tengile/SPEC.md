# SPEC — TENGILE MALAMALA COLLECTION

## 출처

- **원본 URL**: https://tengilemalamala.com/
- **어워드**: Awwwards **Site of the Day**
- **어워드 링크**: https://www.awwwards.com/sites/tengile-malamala-collection
- **수상일**: 2026-10-03 (수상 페이지에서 헤드리스로 직접 확인 — "Site of the Day - Oct 3, 2026")
- **제작**: DashDigital Studio(웹) · HKLM(브랜드) — 원본 푸터 표기
- **모작 날짜**: 2026-10-05 (영어 모작, 2026-W41 clone-02)
- **모작 브랜드명**: `SELOWE KAVARI COLLECTION` (가상). 웹 검색 "Selowe Collection" · "Kavari game reserve" · "Ravuma Selowe" — 일치하는 숙소·보호구역 없음(비슷한 지명은 Selous·Serowe 뿐). 숙소 6곳(Selowe River Lodge · Ashby's Lodge · Nandi River Lodge · Kavari Camp · Ebony Camp · Hartley's Camp), 강(Lehana River), 공동체(Mavhu)도 전부 지어낸 이름. 원본 이름·로고·문구·사진·인용 출처(National Geographic)·인물은 쓰지 않았다.

### 대상 선정 — 2026-09-28 이후 SOTD 를 직접 열어 본 결과

Awwwards SOTD 목록(`awwwards.com/websites/sites_of_the_day/`)을 2026-10-05 헤드리스 Chrome 으로 열고, 수상 페이지의 "Site of the Day - …" 문구로 날짜를 확인했다. 사이트마다 캔버스·WebGL·영상·내부 링크 수를 직접 쟀다.

| 수상일 | 사이트 | 판정 | 근거 (직접 열어서 잰 것) |
|---|---|---|---|
| 10-05 | SANTIONI SPIRITS https://santionispirits.com/ | **제외** | 연령 게이트 뒤 화면 전체가 WebGL 캔버스 1개(2127×1203, `webgl` 컨텍스트 확인, 제작 Active Theory), 문서 높이 802 고정·내부 링크 0. 수상 범위(~10-04) 밖이기도 함. `refs/rejected/p-santioni.jpg` |
| 10-04 | EDOLUS https://edolus.com/ | **제외** | PlayCanvas 3D 엔진(`playcanvas-stable.min.js`)이 화면 전부, 이미지 태그 0, 문서 높이 802. `refs/rejected/p-edolus.jpg` |
| **10-03** | **TENGILE MALAMALA COLLECTION** https://tengilemalamala.com/ | **선택** | 영어. **캔버스 0 · WebGL 0** (`refs/origin.md` "캔버스도 WebGL 도 쓰지 않는다. 화면은 전부 DOM 과 CSS"). 영상은 홈·숙소 히어로 배경 1개씩(실사 촬영본, 렌더 아님) — 배경 효과 수준이라 사진 교차로 대체. 내부 페이지 19개 이상(+숙소 6 · 이야기 상세). 기능: 메뉴 패널, 영상 모달, 큰 갤러리, 지도 핀·범례, 아코디언, 챕터 막대, 필터·쪽, 연도 필터, 폼 2종(달력 포함), 쿠키 배너 |
| 10-02 | MILLEDOLLARS | 제외(지난 판정) | 풀스크린 영상 + WebGL 전환 |
| 10-01 | COLONIA ZACAMIL | 제외(지난 판정) | WebGL2 지도 주도 |
| 09-30 | COMINVI | 제외(지난 판정) | CGI 렌더 영상·이미지 시퀀스 |
| 09-29 | JESPER LANDBERG | 제외(지난 판정) | Three.js 장면이 홈 전부 |
| 09-28 | BUTTER | 제외(지난 판정) | 3D·WebGL·영상 49개 |
| 09-12 | WARM & FUZZY | 쓰지 않음 | 조건을 통과하는 더 최근 SOTD(10-03)가 있어서 |

이미 모작한 곳(works/ 전부: white-desert · lxl · bluebottle · cerebrium · mimicus · house-of-honey · mosbys-files · elorea · offbeat · boc-studio · dimito · realevate · W41 y-vision)과 겹치지 않는다.

---

## 사이트 구조

- **원본 페이지**: 홈 · About · Accommodation · 숙소 상세 6(그중 Khensani 는 "Coming soon" 축약형) · Experiences · Conservation · Partner Hub · Stories(+상세 134편, 12편씩 쪽) · Wildlife Journals · Gallery · FAQ · Contact · Booking · Privacy · Terms
- **모작 페이지: 34** — 홈 1 · About · Accommodation · 숙소 6 · Experiences · Conservation · Partner Hub · Stories · 이야기 상세 **14**(같은 틀) · Wildlife Journals · Gallery · FAQ · Contact · Booking · Privacy · Terms. `build.mjs` + `data.mjs` 로 생성. `href="#"` 0. 링크는 전부 `<폴더>/index.html` 이라 더블클릭(file://)으로도 이어진다.
- **라우팅**: 원본은 Next.js SPA + 녹색 막 전환. 모작은 일반 링크 + 페이지마다 같은 녹색 막 등장(아래 모션 1).

```
/ (홈)                       히어로(영상) → 인트로 → 숙소 문단 → Lodges 3 · Camps 3 → 인용 → 큰 갤러리 → Our story → 사진 구름(보전) → 공동체 마퀴 → Plan a trip → 푸터
├─ about/                    히어로 → 큰 문단 → 두 칸 + 사진 → 스크롤로 채워지는 문단 → OUR HISTORY → 연표(큰 연도 고정) → 사람들
├─ accommodation/            히어로 → Lodges · Camps → 지도(핀·범례) → 경험 사진 줄 → 고르는 법 아코디언 + 문의
│   └─ <숙소 6>/              녹색 제목 히어로 → 큰 문단 → 위치·특징 + 사진 → LODGE DETAILS → Suites · Guest Area · Dining → 갤러리 → Wellness → 마퀴 → Info(아코디언·요금) → 다른 숙소 3 + 챕터 막대
│                             (Nandi 는 원본 Khensani 처럼 "곧 개장" 축약형)
├─ experiences/              히어로 → 큰 문단 → 두 칸 → 녹색 문단 → OUR ACTIVITIES → 번호 행 6 (1번에 Discover More 서랍) → 끝 사진
├─ conservation/             히어로 → 큰 문단 → 두 칸 → 넓은 사진 → OUR INITIATIVES → 번호 행 4 → 흩어진 사진 → Plan a trip
├─ partner-hub/              큰 제목 → 왼쪽 필터 묶음(Media Library · Rates · Factsheets) → 사진·요금표·내려받기
├─ stories/ (+14 상세)        큰 제목 → 필터(분류·건수) → 대표 1 + 2열 카드 → 쪽 매김 / 상세: 사진 히어로 → 본문 + 사진 3 → 공유 → UP NEXT
├─ wildlife-journal/         큰 제목 → 넓은 사진 → 연도 필터 → 내려받기 목록
├─ gallery/                  큰 제목 → 흩어진 사진 격자 → 챕터 막대(Wildlife · Dining · Experiences)
├─ faq/  contact/  booking/  privacy-policy/  terms-and-conditions/
레이어: 메뉴 패널 · 구독 모달 · 영상 모달 · 쿠키 배너
```

| 원본 | 모작 |
|---|---|
| TENGILE MALAMALA COLLECTION, Sabi Sand, Sand River, Shangaan | SELOWE KAVARI COLLECTION, northern Lowveld, Lehana River, Mavhu |
| UNMATCHED ABUNDANCE | RIVERBEND COUNTRY (같은 9자 · 2줄) |
| 1927 · Ntumbuluko | 1931 · Vuxaka (가상) |
| 실제 전화·메일 | `+00 …` · `*.example` |

## 그리드

원본은 1440 기준 vw 스케일(1418 폭에서 여백 15.76 = 1.111vw, 섹션 패딩 78.78 = 5.555vw, 히어로 h1 118.17 = 8.333vw). 모작은 `--u = 100vw/1440` 하나로 같은 계산.

| 항목 | 원본 (실측) | 모작 |
|---|---|---|
| 좌우 여백 · 거터 | 16u · 16u, 12열 | 같음 (`--g`) |
| 두 칸 | 왼쪽 16 / 오른쪽 728 시작(6열+거터) | `.c-left 1/7` · `.c-right 7/13` |
| 숙소 카드 | 452×586 (사진 452×550 + 이름) | 3열, 사진 451:550 |
| 큰 갤러리 | 1408×792, 위아래 16 | 같음 |
| 사진 구름 | 가운데 제목 + 6장(164·127 폭) 흩어짐 | 같은 크기·좌표 |
| 마퀴 사진 | 465 폭, 높이 545/568/384 번갈아 | 같음 |
| Plan a trip | 1270 높이, 글은 728 시작 · 아래 80 | 같음 |
| 브레이크포인트 | 1024 · 768 | 같음 (모바일 `--u = 100vw/390`) |
| **문서 높이** | 홈 11586 · About 22107 · Acc 6369 · 숙소 13673 · Rattray's 11964 · Kirkman's 14286 · Khensani 3533 · Exp 9751 · Cons 10498 · Hub 3928 · Stories 5336 · 상세 7233 · Journal 2700 · Gallery 14506 · FAQ 4079 · Contact 2871 · Booking 3734 | 10642 (−8%) · 19597 (−11%) · 5912 (−7%) · 13335 (−2%) · Ashby's 13301 (+11%) · Hartley's 13221 (−7%) · Nandi 2500 (−29%) · 8952 (−8%) · 9655 (−8%) · 3869 (−2%) · 4344 (−19%) · 6096 (−16%) · 2474 (−8%) · 14286 (−2%) · 3471 (−15%) · 2578 (−10%) · 3461 (−7%) |

±15% 밖 3곳: **Nandi**(원본 Khensani 는 개장 예정 숙소라 사진·문단 수가 우리 데이터보다 많다), **Stories**(원본은 한 쪽 12편, 모작은 14편 전체라 한 쪽 10편으로 나눔), **이야기 상세**(원본 본문이 더 길다 — 본문 7문단으로 맞춤). 셋 다 틀이 아니라 내용 분량 차이.

## 타이포

| 역할 | 원본 | 대체 | 근거 |
|---|---|---|---|
| 디스플레이 세리프 | PP Fragment 220/310 (Pangram Pangram, 유료) | **Newsreader 200/300 (opsz 72)** | 대비 높은 라이트 세리프. Google Fonts 제공 |
| 본문 산세리프 | Inter 400/500 | **Hanken Grotesk 400/500/600** | 같은 중립 그로테스크. Inter 는 impeccable `overused-font` 대상이라 피함 |

| 토큰 | 원본 (실측) | 모작 |
|---|---|---|
| 히어로 h1 | 118.17px(8.333vw) · lh 0.9 · −0.02em · 대문자 · 2줄(오른쪽 정렬 둘째 줄) | 120u · 0.9 · −0.02em |
| 페이지 큰 제목(CONTACT 등) | 화면 폭 가득(Fragment) | 폭에 맞춤(JS로 글자 크기 계산) — Newsreader 가 더 넓어 고정 크기로는 넘침 |
| 녹색 큰 문단 · 인용 | 47.27px(3.333vw) · lh 1.1 · 220 · `#5C6E21` | 52u · 1.1 · 200 (Newsreader 가 좁아 줄바꿈을 맞추려 4u 키움) |
| 세리프 중간 | 32px · lh 36.8 · 310 | 32 · 36.8 · 300 |
| 카드 이름 · 아코디언 | 20px · lh 24 | 20 · **26.4** (아래 접근성) |
| 히어로 설명 | 18px · lh 19.8 | 18 · **23.6** |
| 본문 | Inter 16 · lh 20 · −0.01em | 16 · **21** |
| 라벨·버튼 | Inter 14 · 500 · 대문자 · lh 14 | 14 · 500 · 대문자 · 버튼 lh **18.4** |
| 메뉴 큰 링크 | 40px · lh 40 | 같음 |

**바꾼 행간(접근성)**: 원본 Inter 16/20(1.25)·18/19.8(1.1) 같은 작은 글 행간을 1.3 이상으로 올렸다(impeccable `tight-leading`). 32px 이상 디스플레이 세리프(1.1·1.15)는 원본값 유지 — 아래 게이트 표.

## 아이콘

원본: 10×10 화살표(→), 꺾쇠(‹ ›), +/−(아코디언), 내려받기 화살표. 1.1px 선, 둥근 칸(24×24, 2px → 호버 시 12px 원형). 모작은 같은 크기·선 두께로 직접 그린 인라인 SVG(`build.mjs ICON`). 로고는 원본 3줄 워드마크 대신 **SELOWE / KAVARI / COLLECTION** 3줄을 새로 짰고, 프리로더 모노그램도 원본(T·M) 대신 S·K 선 그리기.

## 컬러

| 역할 | 원본 hex | 모작 | 대비 |
|---|---|---|---|
| 바탕 | `#F5EEE9` | 같음 | — |
| 글자 진녹 | `#373F1D` | 같음 | 바탕 위 9.67:1 |
| 녹(푸터·큰 문단·강조) | `#5C6E21` | 같음 | 바탕 위 4.93:1 · 푸터 크림 글 4.93:1 |
| 호버 진녹 | `#48561A` | 같음 | |
| 연한 칸(버튼·아코디언) | `#E3E1D4` | 같음 | |
| 흰 칸 | `#FBF8F6` | 같음 | |
| 흐린 글 | `#A5A593` (바탕 위 **2.18:1**) | **`#6B6B55` (4.74:1)** | 대비 고침 |
| 푸터 아래 줄 | `#E3E1D4` on `#5C6E21` (**4.31:1**) | **크림 `#F5EEE9` (4.93:1)** | 대비 고침 |
| 오류 | 원본 빨강 문구 | `#A3271B` (바탕 6.39:1 · 입력칸 6.94:1) | |

**히어로 위 헤더 글자**: 원본은 투명 헤더 + 사진 덮개만. 모작은 덮개 위쪽을 `.72 → .3`(14% 지점)으로 진하게 해 Enquire·Menu 뒤 배경 대비를 사진 히어로 19곳(홈·About·Accommodation·Experiences·Conservation·이야기 14) 전부 **p90 4.9:1 이상**으로 맞췄다(화면 픽셀로 잼 — `refs/tests/header-contrast.txt`, 가장 낮은 곳 Weavers 이야기 4.90:1). 처음(.38)엔 Experiences 3.50 · Accommodation Menu 3.54 로 미달이었다.

## 간격

| 항목 | 원본 | 모작 |
|---|---|---|
| 섹션 상하 | 78.78(5.555vw) · 큰 문단 100u | 80~110u |
| 라벨 → 문단 | 32 | 32 |
| 카드 사이 | 16 | 16 |
| 숙소 상세 장 사이 | 약 100~200 | 100u + 사진 엇갈림 |
| 반복 수치 | 16 · 32 · 80 · 100 | 같음 |

---

## 모션

라이브러리: 원본 React(Next.js) + Lenis(관성 스크롤, `html.lenis`) + plyr(영상). 모작은 라이브러리 없이 CSS 전환 + rAF(`assets/site.js`), 네이티브 스크롤(Lenis 생략 — 아래 생략 표).

실측 이징: `cubic-bezier(.19,1,.22,1)` 등장 1600·2000·400 · `(.165,.84,.44,1)` 설명 흐림 1000 · 카드 태그 500 · `ease` 300 색 · `(.77,0,.175,1)` 전환.

| 시점 / 트리거 | 원본 (`refs/motion-origin`) | 모작 |
|---|---|---|
| 0–1.4s | 녹색 막(`#5C6E21`) 가운데 모노그램 선 그리기 (path 3개, 834·1090·1320ms) | 같음 — S·K 선 3개 1.3s, 0.2s 간격 |
| ~1.5–2.7s | 녹색 막 `clip inset` 으로 위로 걷힘 ~1.1s | 같음 1.1s (.77,0,.175,1) |
| 2.15s | 히어로 제목 글자마다 translateY(100%)·blur(5px) → 0, **1600ms (.19,1,.22,1), 50ms 간격** | 같음 (`.ch`, `--i×50ms`) |
| 2.15s | 히어로 사진 scale 1.1 → 1, 2000ms | 같음 |
| 2.15s | 설명 blur·opacity 1000ms (.165,.84,.44,1) | 같음 |
| 상시 | 히어로 영상 | 사진 4장 5초 교차 + 9초 느린 줌(아래 생략 표) |
| 히어로 호버 | 커서 옆 "Play Video" 라벨이 아래에서 올라옴 400ms | "Play Film" 같은 동작 |
| 스크롤 | 사진 패럴랙스 translateY −6% → 6%, scale 1.12 | 같음 |
| 스크롤 | 헤더 글자 크림 ↔ 진녹 300ms ease (덮는 사진 위/아래) | 같음 |
| 스크롤 > 100px | **헤더가 크림 바탕 38px + 작은 모노그램으로 바뀌고, 내리는 동안 translateY(−38px) 로 숨음, 올리면 다시 나옴.** 전환 transform 300ms (.25,.46,.45,.94) · 바탕 150ms — 첫 숨김은 전환 없이(원본 `hasTransitions` 클래스가 첫 숨김 뒤에 붙음), 맨 위로 돌아오면 투명 (헤드리스로 휠 25px 씩 굴려 실측: 99px 보임 · 124px 숨김) | 같음 — 처음엔 헤더가 계속 떠서 로고가 큰 본문 글자와 겹쳤다(검수 지적) → 고침. 16페이지 내림/올림 상태 캡처로 겹침 없음 확인 |
| 스크롤 | 사진 구름: 6장이 가운데에서 흩어지며 clip inset 99% → 0 | 같음(`--p` 진행값) |
| 상시 | 공동체 사진 마퀴 120000ms 선형 | 같음 |
| 스크롤 | 푸터 안쪽 패럴랙스(translate %) | 같음 |
| 큰 갤러리 | 커서 라벨 Prev/Next, 사진 교차 | 같음 |
| 메뉴 | 오른쪽 패널 clip 으로 펼침, 링크 20px 아래에서 차례로 | 같음 0.8s, 40ms 간격 |
| 버튼 호버 | 배경 녹색 + 모서리 2 → 12px | 같음 |
| About | 문단 글자가 스크롤로 채워짐 · 큰 연도 고정, 값이 굴러 바뀜 | 같음 |
| 숙소 | 챕터 막대가 아래에서 올라옴, 현재 장 이름 따라감 | 같음 |

### 녹화 대조 결과

비교 HTML: `C:\Users\swxp\Desktop\더드림벤처스\모션비교\2026-10-05\모션비교-SELOWE-KAVARI.html` (같은 파일 `refs/motion-compare.html`). 홈, 로드 5s → 휠 끝까지 → 메뉴·Enquire 호버.

| 구분 | 줄 수 |
|---|---:|
| 서명 일치 | 7 (헤더 색 300 · 제목 filter/transform 1600 · 라벨 400 · 설명 1000 ×2 · 사진 2000) |
| **빨강(원본에만)** | **3 — 실질 0** |
| 파랑(모작에만) | 9 (등장 연출·켄번스·프리로더·쿠키 — 원본은 인라인 스타일/JS 라 서명이 안 잡힌 것들) |
| 헤더 숨김 | 원본 녹화처럼 첫 숨김은 전환 없음 → 양쪽 다 서명 없음(일치). 올릴 때 전환 300/150 은 원본에서 직접 잰 값 |

빨강 3줄의 내용:
1. `SectionImagesMarquee…__marquee` 120000ms linear — 모작 `mq` 120000ms linear 와 같은 움직임. **이름만 다름**(원본 CSS 모듈 이름을 베끼지 않음).
2. `Web` 0ms opacity 1→1 — 아무 변화 없는 기록.
3. 라벨 `transform 390ms` — 커서 라벨이 내려가다 중간에 끊긴 기록(원본 400ms 의 잘린 판). 모작도 같은 순간 322ms 로 끊김.

## 기능 목록

| 기능 | 위치 | 열림 | 닫힘 | 상태 표시 |
|---|---|---|---|---|
| 메뉴 패널 | 전 페이지 | Menu | Close · ESC · 바깥 클릭 | `aria-expanded`, 포커스 가둠·복귀, 배경 스크롤 잠금 |
| 영상 모달 | 홈 히어로 | 히어로 클릭 | Close · ESC · 바깥 | 재생/일시정지 `aria-pressed`, 진행 막대 |
| 큰 갤러리 | 홈·숙소 | 왼쪽/오른쪽 반 클릭 · ←→ | – | "n / 6" `aria-live` |
| 숙소 카드 태그 | 홈·목록 | 호버·포커스 시 아래에서 올라옴 | – | – |
| 지도 핀 | Accommodation | 핀 클릭 | × · ESC | `aria-expanded`, 카드에 사진·설명·링크 |
| 범례 | Accommodation | 접기/펴기 | | `aria-expanded` |
| 아코디언 | Accommodation · 숙소 Info · FAQ | 클릭 · Enter | 다시 클릭 | `aria-expanded` |
| 챕터 막대 | 숙소 6 · Gallery | 이전/다음 · 현재 장 클릭 → 목록 | ESC · 바깥 | `aria-expanded`, 현재 장 `aria-current` |
| Discover More 서랍 | Experiences 1번 | 버튼 | Close · ESC · 바깥 | 원본처럼 오른쪽에서 나오는 패널 |
| 필터 묶음 | Partner Hub · Journals | 묶음 접기/펴기, 항목 선택 | | `aria-pressed` |
| 이야기 필터 · 쪽 | Stories | Filter → 분류(건수) | ESC · 바깥 | 건수·쪽 번호 `aria-current` |
| 갤러리 챕터 | Gallery | Wildlife / Dining / Experiences | | |
| 연락 폼 | Contact | Submit | | 칸별 "Required"·"Check the email format", `aria-invalid`, 첫 오류로 포커스, 통과 시 접수 문구(보내지 않음) |
| 예약 폼 | Booking | 숙소 선택 · 두 달 달력 범위 · 인원 ± · 연락처 | | 오른쪽 요약(숙소·날짜·박 수·인원) 실시간, 검증 같은 방식 |
| 구독 모달 | 푸터 Subscribe | 버튼 | Close · ESC · 바깥 | 검증 |
| 쿠키 배너 | 첫 방문 | 자동 | Accept · Decline | Settings 펼침, 스위치 `role=switch` |
| 링크 복사 | 이야기 상세 | Copy link | 1.8s | "Link copied" |
| 내려받기 | Journals · Hub | 링크 | | 실제 파일(가상 요약 .txt) |

**원본에 없는데 넣은 것 (접근성 최소선만)**: ① 모달·메뉴 포커스 가둠/복귀 ② 갤러리 위치 `aria-live` ③ 폼 오류를 칸 옆 글자로 ④ 쿠키 설정 스위치에 `role=switch` ⑤ 건너뛰기 링크. 그 밖의 기능은 원본에서 눌러 확인한 것만 만들었다(`refs/states/`). 처음 만든 **갤러리 라이트박스는 원본 Gallery 사진이 눌리지 않는 것을 확인하고 지웠다**(`refs/states/15` 없음 — 클릭 대상 없음). Discover More 도 처음엔 가운데 모달로 만들었다가 원본(`refs/states/12-exp-discover-more.jpg`)이 오른쪽 서랍이라 고쳤다.

### 상태별 refs

`refs/states/`: 01 쿠키 배너 · 02 쿠키 설정 · 03–04 메뉴 열림 · 06 홈 갤러리 2 · 07 숙소 페이지 · 08 지도 범례 · 09 아코디언 · 10–11 챕터 막대/목록 · 12 Discover More 서랍 · 13 이야기 필터 · 14 갤러리 챕터 · 16 FAQ 열림 · 17 허브 Camps · 18 일지 2024 · 19 연락 오류 · 20 예약 달력.

## 섹션 순서

- **홈**: 헤더(Enquire · 로고 · Menu) → 히어로(제목 2줄 · 설명 · Explore Collection · 무늬 띠) → 라벨 + 세리프 문단 → 작은 글 + 사진 2 → 녹색 큰 문단 → Lodges(글 + 카드 3) → Camps(글 + 카드 3) → 인용 → 큰 갤러리(1/6) → Our story(문단 + 사진 2 + 버튼) → 사진 구름 + Conservation → Community 문단 + 마퀴 → Plan a trip → 푸터.
- **숙소 상세**: 녹색 제목(첫 단어 / 나머지, 둘째 줄 들여씀) + 짧은 글 + 사진 → 큰 녹색 문단 → Location·Highlights + 사진 2 → LODGE DETAILS → The Suites(문단·특징 목록·사진) → Guest Area → Food & Dining(사진 4) → 갤러리 → Wellness & Activities → 마퀴 → Info(아코디언 5 + 요금) → Lodges & Camps 3.
- **About**: 히어로 → 큰 문단 → 두 칸 → 채워지는 문단 + 작은 글 → OUR HISTORY → 연표 10 → 사람들 2.
- **Experiences / Conservation**: 히어로 → 큰 문단 → 두 칸 → (녹색 문단 / 넓은 사진) → OUR ACTIVITIES · OUR INITIATIVES → 번호 행 → (끝 사진 / 흩어진 사진 + Plan a trip).
- **나머지**: 큰 제목 → 각 기능 영역 → 푸터.

---

## 게이트

### verify-site — **143개 URL 문제 없음**
`node scripts/verify-site.mjs http://localhost:4432/` → "콘솔 에러 0, 가로 넘침 0(1440·768·390), href="#" 0, h1 전부 1개" (`refs/verify-final.txt`). 중간에 걸린 것: 보전 페이지 흩어진 사진이 모바일에서 vw 좌표로 넘침 → 모바일은 2열 격자로, 이야기 상세 UP NEXT 제목 크기, `clip-path` 로 바꾼 사진 칸이 스크롤 넘침을 못 막음 → `overflow: clip`.

### impeccable detect — 파일 34 HTML + CSS 3, **원본 구조 2종만 남음**, 설정으로 끄지 않음
`refs/detect-1.txt`(처음 **1580줄 · 수백 건**) → `detect-2..5` → `refs/detect-final.txt`.

직접 고친 것:
- `low-contrast` 133 → 0: 흐린 글 `#A5A593`→`#6B6B55`, 푸터 아래 줄 크림, 덮는 사진·이야기 카드에 어두운 바탕색, "Opening 2027" 글 뒤 진한 칸, 히어로 위쪽 덮개
- `tight-leading` 264 → 0(파일 검사): 작은 글·버튼·폼·아코디언·모바일 세리프 행간 1.3 이상
- `cramped-padding` 88 → 0: 아코디언 위아래 8px, 히어로·갤러리·덮는 사진 칸 안쪽 여백(절대 배치라 화면은 그대로)
- `gray-on-color` 68 → 0 · `layout-transition`(쿠키 설정 max-height → grid-rows) · `buried-raster`(교차 사진은 화면에 한 장만 두고 바꿀 때만 새 장 페이드) · `repeating-stripes-gradient`(무늬 띠를 SVG 타일로) · `all-caps-body`(이야기 부제 대문자 해제) · `skipped-heading`·`flat-type-hierarchy`(푸터 열 제목을 제목 요소에서 뺌, 요금 소제목 세리프) · `broken-image`
- 마퀴 CSS 를 쓰는 6페이지에만 연결(나머지 28페이지에 마퀴 규칙이 따라가지 않게)

남은 것 — **원본에 실측으로 있는 구조**:

| 규칙 | 건수 | 원본 근거 |
|---|---:|---|
| `cream-palette` | 34 (전 페이지) | 원본 `body` 배경 **rgb(245, 238, 233) = #F5EEE9** (`refs/origin.json` 컬러 실측, 모든 페이지 같은 바탕). 사이트의 정체성 색 — 바꾸면 모작이 아님 |
| `marquee` | 6 (홈 + 숙소 5) | 원본 `@keyframes SectionImagesMarquee…__marquee` **120000ms linear 무한** (`refs/origin.md` "애니메이션"·"@keyframes", 홈 Community · 숙소 상세 마퀴 섹션 `refs/home/10-SectionImagesMarquee.jpg`, `refs/accommodation--tengile-river-lodge/07-SectionImagesMarquee.jpg`). `prefers-reduced-motion` 에서 멈춤 |

URL 검사(`--viewport 1440x900`, 8페이지, `refs/detect-url-*.txt`)에서 추가로 본 것과 처리:
- 헤더 글자 대비 "1.0:1" — 고정 헤더를 본문 바탕(크림)과 비교한 값. 실제 화면 픽셀로 재면 사진 히어로 19곳 전부 4.9:1 이상(위 컬러 표)
- 디스플레이 세리프 32px `1.15` · 52u `1.1` 행간 — 원본 실측 Fragment 32/36.8, 47.27/51.99 그대로
- `heading-rhythm`(카드 사진 아래 이름) · `line-length 87`(숙소 큰 문단 전폭) · `first-viewport-column-overflow`(예약 폼 긴 왼쪽 + 고정 요약) — 원본 같은 배치
- 등장 연출 도중(흐림·투명) 잰 대비 — 애니메이션이 끝나면 4.5 이상

### 헤드리스 클릭 테스트 — **59 / 59 통과**
`refs/tests/click-test.js` (CDP 로 실제 마우스·키 이벤트), 결과 `refs/tests/click-result.txt`. 쿠키 4 · 메뉴 6(열기·잠금·포커스·ESC 복귀·바깥·이동) · 영상 4 · 갤러리 2 · 구독 3 · 지도·범례·아코디언 6 · 챕터 5 · 서랍 2 · 허브 2 · 일지 2 · 이야기 6 · 갤러리 챕터 1 · 연락 3 · 예약 7 · 키보드 3 · 헤더 숨김/재등장/맨 위 3 · 모바일 메뉴 1.

---

## 사진

> 사용자 지시 원문: **"근데 이미지가 없잖아 이미지를 비슷한 무드로 픽사베이나 언스플래쉬같은곳에서 긁어오셈"** · **"감도높은 사진을 핀터레스트에서 찾아서 긁어오기"**

| | |
|---|---|
| 채택 | **183장** — **Pinterest 92 · Unsplash 91** (안 쓰는 후보는 지움) |
| 2차 검수 | 홈 Nandi 카드의 굽이치는 강 항공 사진(핀 18436679720688964)이 AI 렌더로 보인다는 지적 → 채택본 전체를 이름 붙인 밀착 시트로 다시 훑어 **AI 의심 40장을 Unsplash 실사로 교체**(자리 번호는 그대로). 항공 5 · 표범 4 · 버팔로 5 · 치타 2 · 기린 3 · 영양 2 · 새 3 · 코끼리 1 · 사자 1 · 풍경 1 · 코뿔소 2 · 거북·카멜레온 4 · 바오밥 4 · 라운지 3. 목록과 이유는 `refs/photo-reject.mjs` 의 `REPLACE`, 시트는 `refs/photo-review/2nd-*.jpg` |
| 후보 | 검색어 45개(Pinterest 25 · Unsplash 20, 그중 1개는 결과 0) → **645장** (`refs/photo-raw/`, 공개 안 함) |
| 출처 기록 | `assets/photos/credits.json` — 파일 · 원 파일 · 출처 · 핀/사진 페이지 주소 · 검색어 · 라이선스 · 명도 · 평균색. 출처 없는 사진 0 |
| 선택 | `refs/select-photos.mjs` + `refs/photo-reject.mjs`(뺀 270장과 이유) · 분류별 장수 고정 `refs/photo-pool.json` |
| 검수 시트 | `refs/photo-review/<분류>.jpg` |

### 뺀 기준

| 이유 | 예 |
|---|---|
| AI 생성으로 보임 | lodgeroom(침실) **20장 전부**, 라운지 15/20, 노을 풍경 17/20, 은하수 15/20, 카멜레온 대부분, 바오밥 합성, 표범·코끼리·기린의 과한 노을·반사 컷 |
| 실존 인물 얼굴 | vintage(1930년대 사파리 인물) **9장 전부**, 차량 위 여행자, 스파 치료사·손님(작게 보여도 뺌) |
| 글자·로고·워터마크 | 사진가 서명(코끼리·버팔로·코뿔소·새), 사진집 제목이 박힌 들개, 스파 브랜드 로고(Ikewana 등), 숙소 로고, 차량 번호판 3장 |
| 주제 다름 | 아시아 원숭이(마카크·랑구르), 눈표범, 도시 주택 거실, 동물원 원숭이 |
| 출처 기록 누락 | walk 6장(수집이 멈춰 credits 미기록) → Unsplash 로 다시 받음 |

침실·라운지는 Pinterest 결과가 거의 AI 렌더라 Unsplash 실사로 채웠고, 역사 연표 사진은 인물 사진을 쓸 수 없어 Unsplash 흑백 야생 사진으로 대신했다.

### 자리별 명도·방향

히어로·갤러리·덮는 사진처럼 가로 자리는 가로 사진만(`credits.json` w/h 로 골라 `build.mjs` 의 LR·LL 목록), 카드·패럴랙스는 세로 사진. 흰 글이 올라가는 히어로·덮는 사진은 덮개 + 위쪽 진한 덮개.

---

## 생략·대체 (숨기지 않고 적는다)

| 원본 | 처리 |
|---|---|
| 히어로 배경 영상(실사, 여러 컷) · 숙소 히어로 영상 | 사진 4장 5초 교차 + 느린 줌. 숙소 히어로는 사진 1장 |
| 영상 모달(plyr, 소리) | 사진 6컷 4초씩 + 진행 막대 + 일시정지. 소리 없음 |
| Lenis 관성 스크롤 | 네이티브 스크롤 |
| SPA 페이지 전환 | 일반 링크 + 페이지마다 녹색 막 등장 |
| 히어로 제목이 마우스 따라 미세 이동(0.01%) | 생략(거의 안 보이는 값) |
| 국가 선택(국기 249개) · 전화 국가 코드 | 21개 + Other · 코드 6개 |
| 이야기 134편 · 12편/쪽 | 14편 · 10편/쪽 |
| 일지 PDF | 가상 요약 .txt |
| 지도(원본 일러스트 지도) | 직접 그린 가상 지형 SVG(강·두 보호구역·국립공원·활주로) |
| 원본 구슬 무늬 띠 | 다른 무늬의 SVG 띠 |
| 폼 전송 | 보내지 않음, 접수 문구만 |
