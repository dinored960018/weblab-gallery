# SPEC — Kononenko Architectural Bureau 모작 → Veldmark Architectural Office

## 출처

- **원본 URL**: https://kononenkogroup.com/ (영어. 러시아 건축 사무소 포트폴리오. lang=en, Lenis, 네이티브 스크롤)
- **어워드**: Awwwards Site of the Day · 2026-08-23
- **어워드 링크**: https://www.awwwards.com/sites/kononenko-architectural-bureau
- **제작사**: 웹 디자이너 Artem Shcherbakov (어워드 페이지 크레딧, Russia)
- **업종**: 건축 설계 사무소 (주거 · 복합 · 상업 프로젝트 포트폴리오)
- **모작 날짜**: 2026-10-14
- **모작 브랜드명(영문)**: Veldmark Architectural Office
  - 실존 상호 확인 검색어: `"Veldmark Architects" OR "Veldmark Architectural Bureau" OR "Veldmark Architecture"` → 같은 이름의 상호 없음(유사: Veld Architects 등은 다른 이름)

### 대상 선정 근거 (2026-10-14, 무인 모드 상시 승인)

**조건**: 영어 화면 · 내부 링크로 이어지는 화면 5종 이상 · 수상 당시 디자인이 지금도 살아 있음 · 3D/WebGL/렌더 영상 주도 아님 · 일러스트 · 캐릭터 주도 아님 · `## 제외` 및 `works/**/SPEC.md` 원본 URL 과 겹치지 않음 · 국제 어워드 SOTD 이상.

**방법**: Awwwards SOTD 목록(2026-08-20 ~ 10-13)에서 최근 작업과 겹치지 않는 후보를 골라, 원본 HTML 을 받아 내부 링크 · canvas · video · WebGL 문자열을 세고, 통과 후보는 헤드리스로 전 페이지 캡처했다.

| 후보 | 수상 | 판정 |
|---|---|---|
| CoMinVi (cominvi.com.mx) | SOTD 2026-09-30 | 탈락 — 내부 9화면이나 CG 렌더 광산 영상 · 이미지 시퀀스 canvas · video 1. W40 · W41 · W42 기록에서 이미 세 번 제외됨 |
| Neutomni (neutomni.com) | SOTD 2026-10-13 | 탈락 — 내부 링크 `/` 하나뿐인 단일 화면, canvas 1 · video 1 |
| Heron AI (heronaiapp.com) | SOTD 2026-10-12 | 탈락 — 내부 링크 0, 단일 화면 랜딩 |
| Colonia Zacamil (coloniazacamil.com) | SOTD 2026-10-01 | 탈락 — Nuxt SPA, three 계열 WebGL · video 주도, 화면 구조 불분명 |
| Era Residence (era-residence.com) | SOTD 2026-08-31 | 탈락 — video 8, 내부 링크 5, 영상 주도 |
| United Carriers (unitedcarriers.com) | SOTD 2026-09-06 | 탈락 — canvas 5 · video 1 · WebGL 문자열, 인터랙션 주도 |
| Aardvark Book Club (aardvarkbookclub.com) | SOTD 2026-08-30 | 보류 — 내부 15링크이나 canvas 2 · 일러스트 비중 높음 |
| **Kononenko Architectural Bureau (kononenkogroup.com)** | **SOTD 2026-08-23** | **선택** — 내부 화면 13종(`/` · `/work` · `/work/*` 8 · `/about` · `/contact` · `/legal`), 정적 HTML 의 `canvas`/`video` 0, WebGL 은 300×150 하나(화면 연출 비주도), 사진 중심, 2026-10-14 캡처 시 수상 당시 화면과 같음 |

**선택 이유 요약**: 화면 13종이 모두 내부 링크로 이어지고, 큰 사진 · 대형 타이포 · 밑줄 호버 · 프로젝트 인덱스로 구성되어 2D HTML/CSS 로 재현 가능하다. 원본 사진은 건축 CG 컷이므로 모작은 같은 분위기의 스톡 사진으로 대체한다.

## 실측 요약 (refs/origin/origin.md)

- 라이브러리: Lenis. 스크롤은 네이티브로 측정됨, 문서 높이 19034px (홈, 뷰포트 900 기준 21.1화면)
- 전환: `0.6s` · `0.3s` · `1.109s`, easing `cubic-bezier(0.17, 0.84, 0.44, 1)`
- 호버: 링크 `::before` 가 `scaleX` 로 밑줄처럼 그려지고 빠짐
- WebGL: `webgl2` 300×150 하나, 셰이더 2개 (`refs/origin/shaders/`)
- 화면 13종 캡처: `refs/<페이지>/` (홈 전체 + 섹션 + 모바일 390), 모션 녹화: `refs/motion-origin/` (프레임 422장, 애니메이션 31건)
- 어워드 페이지 캡처: `refs/award-page.png`


---

# 해부 (build 단계, 2026-10-14)

근거는 `refs/` 의 실측값만 쓴다 — `measure.json`(1440 폭 computed style · 섹션 · 링크), `refs/origin/origin.md`(전환 · 호버 · 셰이더), `refs/motion-origin/motion.json`(로드 5s + 휠 스크롤 녹화), 페이지별 캡처(`refs/<page>/00-full.jpg`, 1300px 조각은 `refs/tools/crops/`).

## 1. 사이트 구조

| 원본 경로 | 원본 높이(px) | 모작 경로 | 모작 높이(px) | 차이 | 비고 |
|---|---:|---|---:|---:|---|
| `/` | 19034 | `index.html` | 18231 | −4.2% | 섹션 10개 + 푸터, 순서 같음 |
| `/work` | 4316 | `work/index.html` | 4326 | +0.2% | 카드 8 · 보기 전환 알약 |
| `/work/pokrovskoe-private-house` | 7375 | `work/hollin-lane-house/` | 7978 | +8.2% | 상세 8종 모두 같은 틀 |
| `/work/millenium-park` | 8392 | `work/westerbeek-private-park/` | 7841 | −6.6% | |
| `/work/kns-stolbovo` | 7660 | `work/eskerveld-pumping-station/` | 7841 | +2.4% | |
| `/work/bolshevik-residential` | 9517 | `work/calder-yard-residential/` | 8197 | −13.9% | 본문 문단을 늘려 맞춤 |
| `/work/kotelnaya-kinetics` | 9220 | `work/ostmark-boiler-hall/` | 7994 | −13.3% | |
| `/work/vision-mansion` | 8984 | `work/linden-court-villa/` | 7926 | −11.8% | |
| `/work/almaty-hotelornament-stone` | 8402 | `work/selva-harbour-hotel/` | 7807 | −7.1% | |
| `/work/eli-house-corner-plot` | 8688 | `work/corner-plot-house/` | 7776 | −10.5% | |
| `/about` | 7818 | `about/index.html` | 7870 | +0.7% | |
| `/contact` | 3702 | `contact/index.html` | 4011 | +8.3% | |
| `/legal` | 3375 | `legal/index.html` | 3521 | +4.3% | |

모작 높이: `refs/tools/heights.txt` (1440×900, `refs/tools/heights.mjs`). 전부 ±15% 안.

- **내비게이션**: 헤더 `Index, Work, About, Contact` (쉼표 구분, 오른쪽 위) · 로고 3줄(왼쪽 위) → 홈. 푸터 Navigation(Index · About · Work · Team / Contact · Order design) · Media 7개 · Address · Hours · Legal documents.
- **재현**: 페이지 종류 6가지(홈 · 목록 · 상세 · 소개 · 연락 · 법적 고지) 전부, 개수도 원본과 같은 13장.
- **줄인 것**: About 팀 인원 20여 명 → 12명(4열 3줄). 원본 Team 링크는 About 안 팀 블록이라 `about/index.html#team` 으로 잇는다.
- 실존 이름 회피: 브랜드 `Veldmark Architectural Office`, 프로젝트 · 인명 · 도시 · 거리 · 전화(+1 555-01xx 가상 대역) · 도메인(`.example`) 전부 지어냄. 고객사 원 18개도 지어낸 이름을 글자로만 그렸다(원본은 실제 고객 로고). 푸터 Media 는 원본의 SNS 이름 대신 Portfolio · Press kit · Newsletter · Careers · Phone · Email · Order design(메일 · 전화 링크).

## 2. 그리드 실측표

원본 열 위치는 `refs/tools/crops/home/01~08` 에서 글자 시작 x 를 읽었다(1440 기준). 23 · 117 · 211 · 305 · 399 · 493 · 587 · 681 · 775 · 869 · 963 · 1057 · 1151 · 1245 · 1339 → 간격 94px 의 15열.

| 항목 | 원본(1440) | 근거 | 모작 |
|---|---|---|---|
| 열 수 | 15 | 위 x 좌표, `measure.json` widths 643(7열) · 549(6열) · 361(4열) · 737(8열) · 831(9열) | `.g` `repeat(15, 1fr)` |
| 열 폭 · 거터 | 79px · 15px | 7열 = 7×79 + 6×15 = 643 | `--g: 1.0417vw`(15px) |
| 좌우 여백 | 22.5px | widths 1395 = 1440 − 45 | `--m: 1.5625vw` |
| 최대 폭 | 없음(뷰포트 비례) | 글자 크기가 vw 비례(131.25 = 9.115vw) | 모든 수치를 vw 로 |
| 첫 줄 들여쓰기 | 93.75px(2열 시작) | 큰 세리프 문단 첫 줄 x=117 | `--ind: 6.51vw` |
| 프로젝트 카드 배치 | (열, 폭, 위치) = (1,7,0) (9,7,128) (1,4,888) (6,6,717) (8,7,1295) (5,4,1876) (1,7,2687) (9,7,2560) | crops/home/06~08 | `CARD_LAYOUT` 같은 값, 위치 px/14.4 = vw |
| 오피스 표 | 6~12열(643), 열 경계 493 · 680 · 868, 행 35px | crops/home/02 | 29.1% · 29.2% · 나머지, 행 2.45vw |
| 팀 격자 | 4열 337.5px, 열마다 위 어긋남 0 · 37 · 80 · 22px | crops/about/02 | `--o` 같은 값 |
| 브레이크포인트 | 390 캡처에서 메뉴는 줄 링크 유지, Index 숨김 | `refs/home/90-mobile-390.jpg` | `≤768px` 1열 · Index 숨김 |

## 3. 타이포

원본 서체 두 개(`n` 산세리프 · `h` 세리프, 웹폰트 이름이 가려짐)는 쓰지 않는다. 같은 인상의 Google Fonts 로 바꿨다.

| 역할 | 원본(1440, `measure.json`) | 모작 |
|---|---|---|
| 산세리프 | `n` — 좁은 그로테스크 | Instrument Sans(`font-stretch: 92%`) |
| 세리프 | `h` — 날카로운 본문용 세리프 | Newsreader(옵티컬 사이즈 자동) |
| 대형 xxl | 131.25 / lh 91.875(0.7) / ls −3.94(−0.03em) | `9.115vw` / .7 / −.03em (세리프일 때 lh .817 — 원본 107.19/131.25) |
| xl | 88.5 / 79.65(0.9) / −2.655 | `6.146vw` / .9 / −.03em |
| l | 60 / 48(0.8) / −1.8 | `4.167vw` / .8 / −.03em |
| m | 33 / 39.6 / −0.66 | `2.292vw` / 1.3 |
| ml(세리프 본문) | 30 / 33(1.1) / −0.9 | `2.083vw` / 1.1 / −.03em |
| 로고 | 14.25 / 14.25 | `.99vw` / 1 |
| s(본문 · 메뉴) | 12 / 14.4(1.2) / −0.24 | 12px / **1.3** (impeccable `tight-leading` — 원본 1.2 를 0.1 올림) |
| xs(방사선 숫자) | 9 | `max(.625vw, 9px)` |
| 상세 「Design Plans」 | 10.5 | 12px(s) |
| 타입 배율 | 12 → 30 → 60 → 88.5 → 131.25 (약 1.48배씩) | 같음 |

## 4. 아이콘

원본 아이콘은 오피스 표의 `↗`(글자)와 보기 전환 알약의 작은 막대 글리프뿐이다(crops/work/00 · work--pokrovskoe-private-house/00). 모작은 `↗` 를 글자로, 알약 글리프 6개(Grid · List · Gallery · Detail · Masonry · Slider)를 11×7 SVG 사각형으로 직접 그렸다. 선 없음(면), 모서리 직각.

## 5. 컬러

| 역할 | 원본 | 근거 | 모작 |
|---|---|---|---|
| 바탕 | `#ffffff` / 어두운 구간 `#000000` | measure colors · sections bg | 같음 |
| 글자 | `#000000` / `#ffffff` | typo color | 같음 |
| 보조 글자 | `#929292` | typo color(61건) | 흰 바탕 `#767676`(4.54:1, 원본 3.1:1 이라 고침) · 검은 바탕 `#929292` 그대로(6.9:1) |
| 알약 바탕 | `#eeeeee` | `/work` colors | 같음, 비활성 단추 글자 `#6b6b6b`(4.9:1) |
| 표 괘선 | 옅은 회색 | crops/home/02 | `#e2e2e2` (검은 바탕 `#2c2c2c`) |
| 방사선 | 선 불투명도 .35 → .5 | motion.json `g.qqg` | 같음 |
| 고객 원 | 위쪽 어두운 회색 → 아래쪽 흰색 | refs/home/09-uod.jpg | `hsl(0 0% 12%→84%)` 각도 따라 |

## 6. 간격

| 구간 | 원본(px, 섹션 top / h) | 모작 |
|---|---|---|
| 히어로 | 0 / 900 (100vh) | `100vh` |
| 성명 | 1032 / 1135 — 위 132 | `padding-top 9.17vw` · 넓은 사진 높이 592 = `41.1vw` |
| 사실 · 수상 | 2268 / 598 | 위 `15.8vw`, 수상 줄 `8.5vw` |
| 범위 문장 · 오피스 | 2986 / 904 | 위 `13.5vw`, 표 위 `6.25vw` |
| 스케치 → 전략 | 4025 / 3447 | 제목 · 스케치 · 큰 문장 · 본문 · 수상 · 둘째 제목 · 스케치 · 본문 |
| 선택 프로젝트 | 7682 / 3494, 아래 패딩 90 | 카드 상자 `218vw`, 아래 `6.25vw` |
| 방사선 | 11176 / 1800 | `125vw` + 안쪽 100vh 고정 |
| 사람 · 과정 | 12976 / 4239, 위아래 패딩 192 | 위아래 `13.33vw` |
| 고객 | 17215 / 903, 위 67.5 | `62.7vw`, 위 `4.7vw` |
| 푸터 | 18118 / 916, 위 120 | 위 `8.33vw`, 대형 글자 + 아랫줄 |

## 7. 모션 표

| 무엇 | 원본 실측 | 근거 | 모작 |
|---|---|---|---|
| 프리로더 진행 막대 | `div.yap` scaleX 0→1, 574→2303ms | motion.json inlineStyles | WAAPI 1729ms, `cubic-bezier(.17,.84,.44,1)`, 574ms 시작 |
| 프리로더 숫자 | 왼쪽 아래 60px 카운터, `p.fn-h4` 위로 −101% 500ms (1426ms) | animations | 0→100 세기, 1426ms 에 위로 500ms |
| 프리로더 덮개 | `div.tlk` 불투명도 → 0, 1904→2399ms | inlineStyles | 1904ms 에 `.5s ease` |
| 히어로 사진 | `div.okc` scale 1.1 → 1, 518→4304ms | inlineStyles | `transform 3.8s` 518ms 시작 |
| 히어로 제목 | `span.wd` 단어 마스크 101%→0, 끝 3522 · 3615 · 3728ms(약 100ms 간격) | inlineStyles | 2400ms 부터 1.1s, 단어마다 100ms |
| 헤더 링크 | `a.link` 101% → 0 | inlineStyles | 같은 시점 1.1s |
| 문단 줄 등장 | `span.ln` 101% → 0, 스크롤 진입 | inlineStyles(169건) | 줄 나누기 + `1.1s` · 줄마다 60ms (원본 전환 `1.109s` 실측) |
| 오피스 표 | 행 글자 `div.hgh` 101%→0, 괘선 `div.wem` scaleX 0→1, 40~50ms 간격 | inlineStyles | 같은 구조, 1.1s · 40ms |
| 프로젝트 카드 | `a.qct` translateY 50% → 0, 스크롤 연동 | inlineStyles | `animation-timeline: view()` 50% → 0 |
| 카드 호버 | 이미지 scale 1.035 · 이름 −101% · 「보기」 0 · 밑줄 .3s 지연 | origin.md 상태 규칙 | 같음, .6s |
| 밑줄 링크 | `::before` scaleX, 들어올 때 왼쪽 기준 · 나갈 때 오른쪽 | origin.md 호버 | 같음, .6s |
| 명암 전환 | `section.lxo` · `section.nmc` 배경 · 글자 300ms `cubic-bezier(.17,.84,.44,1)` (방사선 섹션이 화면 44% 지나면) | animations 8144ms | 같은 값, 방사선 top < −44vh |
| 방사선 | 라벨 8개 반지름 381.6px, 스크롤로 회전 · 선은 스크롤 속도만큼 휨 | inlineStyles span ×594 · 프레임 scroll-02914 | SVG 8가닥, 회전 = 진행 × 90°, 휨 = 속도 × 0.012 rad |
| 사람 사진 궤도 | `div.mimg.hyy.xuc` 14장, 타원 x ±506 · y ±391px, 뒤쪽 scale .7 · 불투명도 .1 | inlineStyles | 같은 타원(vw 비례), 스크롤로 1.6π 회전 |
| 통계 강조 | `div.ohb` 불투명도 .2 ↔ 1, 300ms ease | animations | 300ms ease, 비활성 **.4**(대비 3:1 맞춤) |
| 스케치 | WebGL 셰이더(문턱값 드러남, 텍스처 8) | origin.md 셰이더 · 프레임 scroll-01026 | 캔버스 2D 문턱값(값 노이즈) + 0.55→1 확대. `file://` 에서는 보안상 픽셀을 못 읽어 불투명도 전환으로 대체 |
| 넓은 사진 | img `translate(0,−20%) scale(1.0444)` 녹화 내내 고정 | inlineStyles | 같은 고정값(패럴랙스 없음) |
| 푸터 대형 글자 | `path` 4개 571px → 0, 약 1.12s, 60ms 간격 | inlineStyles 9710~11014ms | 글자 마스크 1.1s · 60ms |
| 관성 스크롤 | Lenis | origin.md | Lenis 1.1.13(CDN). 오지 않으면 네이티브 |
| 페이지 전환 | 하위 페이지마다 900px 검은 `dyh` 요소 | measure sections | 검은 막이 아래에서 덮고(.6s) 새 페이지에서 위로 걷힘 — **녹화가 없어 시간은 추정** |

`prefers-reduced-motion`: 프리로더 · 전환 막 · 줄 등장 · 회전 전부 끔.

## 8. 기능 목록 (원본 ↔ 모작)

| 기능 | 원본 | 모작 | 확인 |
|---|---|---|---|
| 헤더 · 푸터 링크, 현재 페이지 밑줄 | 있음 | 같음(`aria-current`) | 클릭 이동 PASS |
| Work 보기 전환 Grid · List · Gallery | 화면 아래 알약(crops/work/00) | 같음, `aria-pressed` | PASS (List · Gallery · Enter) |
| 상세 보기 전환 Detail · Masonry · Slider | 알약(crops/kot/00) | 같음, Slider 는 이전 · 다음 · 번호 | PASS |
| Design Plans 슬라이더 Prev · Next | 있음(crops/kot/01) | SVG 평면 3장, 순환, ← → 키 | PASS |
| 다음 작업 썸네일 | 있음 | 같음 | PASS |
| Legal 목차 · 현재 위치 | 01~08 목록, 현재 항목 진하게 | 클릭 이동 + 스크롤 위치 표시 | PASS |
| 카드 호버 | 있음 | 같음 | PASS |
| 드롭다운 · 모달 · 폼 · 버거 | 없음(`measure.json` features 0, 390 에서도 줄 링크) | 만들지 않음 | — |

검증: Playwright MCP 가 이 세션에서 연결되지 않아(CONNECT_TIMEOUT), 같은 엔진(playwright-core + Chrome)으로 실제 클릭 · 키 입력하는 `refs/tools/func-test.mjs` 를 돌렸다. 결과 25/25 PASS — `refs/tools/func-test.txt`.

## 9. 섹션 순서

- 홈: 히어로(사진 + 이름) → 성명 「Systematic / Clarity & Rigour」 + 메모 2 + 넓은 사진 → 사실(Founded · Founder · Services) + 소개 문단 + Achievement(Awards · Publications) → 범위 큰 문장 + Offices 표 → From Sketch to Strategy(스케치 · 큰 문장 · 본문 · 수상 · Precision in Development · 스케치 · 본문) → Selected Projects (8+) 카드 8 + See All → 방사선 「Plain & Exact / Essential」 → People & Process(큰 문장 · 사진 궤도 · 통계 5) → 고객 고리 + 큰 세리프 제목 → 푸터.
- Work: 카드 8(홈과 같은 배치) + 알약.
- 상세: 히어로(제목 · 면적) → 메타 + 소개 → Design Plans → 사진 → 라벨 + 본문 → Next work → 푸터.
- About: 사진 히어로 + 큰 문장 → Our Philosophy + 오피스 표 → Our Team + 메모 + 팀 격자 → 수상 흩뿌림 → 푸터(검정).
- Contact: 큰 문장 → Technical · General · Sales(메일 · 전화) → 넓은 사진 → Address → 푸터.
- Legal: 제목 → 목차 + 8절.

## 10. 원본에 없는 것 · 바꾼 것

| 항목 | 이유 |
|---|---|
| 히어로 · 상세 히어로 아래 28~30% 어두운 그라디언트 | **원본에 없는** 장치. 원본은 CG 렌더라 아래가 어두웠고, 스톡 사진(밝은 풀밭)에선 흰 제목 대비가 모자라 넣었다 |
| About 히어로 38% 어둡게 | **원본에 없는** 장치. 같은 이유(흰 세리프 제목 대비) |
| 상세 평면도 SVG | 원본 평면 이미지는 캡처에 비어 있어 내용 미상. 자리 · 상자 · 이전/다음만 원본, 도면은 직접 그림 |
| Work List · Gallery 보기의 내용 | 원본은 Grid 상태만 캡처됨. 목록(번호 · 이름 · 유형 · 지역 · 연도 · 면적 + 호버 썸네일)과 4열 갤러리는 추정 |
| 상세 Slider 보기의 이전 · 다음 · 번호 | 원본 Slider 상태 미캡처, 추정 |
| 방사선 아래 「Simplicity · Clarity of Method」 메모 위치 | 원본 섹션 글자에는 있으나 화면 위치가 캡처되지 않아 아래 양 끝에 둠 |
| 상세 사진 5번째(히어로 사진 재사용) | 원본 사진 구간(`ijt` 5019px)이 캡처에서 비어 있어 장수를 모름. 높이를 원본 대역(±15%)에 맞추려고 넣음 |
| 보조 회색 `#767676`, 통계 비활성 .4, 본문 행간 1.3 | 접근성 최소선 · impeccable 게이트(원본 #929292 · .2 · 1.2) |
| About 의 h1 | 원본 큰 문장(72자)은 그대로 보이게 두고, 의미상 h1 은 짧은 「About」(시각적 숨김). Work · Contact 도 같은 방식 |

## 11. 생략 (omitted)

- 원본 이미지의 WebGL 렌더(이미지 평면 · 셰이더) — `<img>` + 캔버스 2D 로 대체.
- 팀 20여 명 → 12명.
- 고객 실제 로고 → 지어낸 이름 글자.
- 원본 페이지 전환의 정확한 시간 · 이징(녹화 없음) — 검은 막 .6s 로 추정 구현.

## 12. impeccable 예외

사이트 페이지 13장은 **0건**. 폴더 전체 실행에서 남는 342건은 사이트가 아니라 저장소 도구가 만든 보고서 HTML 이다.

| 규칙 | 파일 | 건수 | 이유 |
|---|---|---:|---|
| `tiny-text` | `refs/motion-origin/timeline.html` · `refs/motion-mine/timeline.html` · `refs/motion-compare.html` | 104 · 152 · 79 | `scripts/record-motion.mjs` · `scripts/motion-compare.mjs` 출력(프레임 띠 · 비교표). 절차가 정한 경로라 손대지 않음 |
| `cramped-padding` | 같은 세 파일 | 2 · 2 · 2 | 같음 |
| `low-contrast` | `refs/motion-compare.html` | 1 | 같음 |

## 13. 사진

`node scripts/fetch-stock.mjs … --source stock`(Unsplash 무료분 · Pixabay) 72장, 출처 `credits.json`(루트) · `assets/photos/credits.json`. 출처 표기 의무가 있을 수 있는 사진을 피하려고 기본값 Pinterest 대신 stock 을 골랐다. 원본 자리 명도에 맞춤: 히어로는 흐린 하늘 + 풀밭(헛간), 넓은 사진은 어두운 숲 속 흰 집, 카드는 주택 · 공장 외관, 스케치는 연필 드로잉 사진, 사람 궤도는 작업 장면, 팀은 흰 바탕 인물. 다른 브랜드 글자가 큰 사진(로고 티셔츠 단체 사진 · 간판이 보이는 공원 사진)은 뺐다.
