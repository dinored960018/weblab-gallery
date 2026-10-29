# SPEC — 한화에어로스페이스 모작 → 타브린에어로스페이스(TAVRIN Aerospace)

## 출처

- **원본 URL**: https://www.hanwhaaerospace.com/kor/index.do
- **어워드**: Awwwards Honorable Mention · 2024-09-15
- **어워드 링크**: https://www.awwwards.com/sites/hanwha-aerospace-website
- 제작: does interactive · 태그 Business & Corporate · Web & Interactive · Fullscreen · Video · 360 · Storytelling · 3D · 어워드 페이지 색 `#f37321`
- 확인 방법: 2026-10-29 WebFetch 로 어워드 페이지를 다시 읽음(등급·날짜·제작사·태그 위와 같음). 개별 심사 15건(종합 5.00~8.90)만 있고 합계 점수는 없다. awwwards.com 은 Chrome 직접 접속이 막혀 어워드 페이지 캡처는 **만들지 못했다.**
- 모작 날짜: 2026-10-29 · 포트 4431 · 사용자가 고른 대상(2026-10-29)
- 모작 브랜드: **타브린에어로스페이스 / TAVRIN Aerospace** (가상의 항공·우주 부품 회사). 웹 검색 `"Tavrin" aerospace company` 결과 같은 이름의 회사 없음(TAV Technologies · TAVCO 등 부분 일치만).
  - 지난주 모벡그룹(SIMPAC 모작, 초록 `#255a4b`, 판 6장 심벌)과 겹치지 않게: 이름 계열이 다르고, 색은 원본 주황 `#f37321`, 심벌은 **오른쪽 위로 올라가는 평행사변형 띠 3개**(궤적)로 새로 그렸다. 원본 한화 심벌(고리 소용돌이)과도 다른 모양이다.
  - 실존 방산·항공 기업 이름·제품명을 쓰지 않았다. 원본의 누리호·K9·레드백 자리는 가상 부품 TS-3 위성 버스 · TF-90 터보팬 · TR-40 팬 모듈 · TL-2 발사체 엔진으로 바꿨다. 무기 제품은 넣지 않았다(Protect 는 지구 관측·기상 위성 부품으로).

### 대상 선정 근거 (2026-10-29)

조건: 한국어 화면 · 멀티페이지 · 3D/WebGL 장면이 화면을 주도하지 않음. 오케스트레이터 사전 실측 + 이 작업에서 재확인.

| 후보 | 수상 | 실측 | 판정 |
|---|---|---|---|
| **한화에어로스페이스** hanwhaaerospace.com/kor | HM 2024-09-15 | lang=ko · 내부 경로 45 · canvas 1(2D, WebGL 0) · video 0(로드 시점) · Locomotive 가상 스크롤(문서 높이 900 고정, 실제 내용 7289) | **선택** — 한국어, 하위 페이지 다수, 3D 는 쇼룸 한 화면 |
| DINO TAENG | HM 2026-01-25 | 기본 영어 · 일러스트 주도 | 탈락 — 기본 화면이 영어 |
| LX HAUSYS TRENDSHIP | — | WebGL · 3D | 탈락 — 3D 주도(PROTOCOL 2절) |
| Joguman | — | WebGL | 탈락 — WebGL 주도 |
| Plus X 15th | — | Three.js | 탈락 — 3D 주도 |
| EASY TOMORROW | SOTD | 미측정 | 보류 — 측정 전 |

태그 **360 · 3D** 의 실체: 홈의 캔버스(`canvas.visual__canvas`)는 **2D 컨텍스트**이고 제품 렌더 이미지를 끌어 넘기는 장치다(extract-origin: `2d 300×150 · visual__canvas`, WebGL 0). 3D 는 **Virtual Showroom 의 제품 보기 화면**(1440×900 캔버스, 제품 3D 모델 + 설명 점 `#popup_*` 15개)에만 있다. 이 화면만 **2D 로 대체**했다 — 넓은 사진을 끌어서 둘러보는 장면 + 설명 점 + 제품 바꾸기(7·8절). 원본 3D 보기는 이 컨테이너의 헤드리스 Chromium 에서 클릭해도 열리지 않아(캔버스만 생성) 캡처하지 못했다. 링크 이름(`popup_longerFiringRange` 등)과 쇼룸 첫 화면·호버 상태(`refs/states/showroom-*.jpg`)로 구조를 잡았다.

**H.264 문제**: 이 대상은 로드 시점 영상이 0개라 SIMPAC 때의 webm 역프록시가 필요 없었다. 인재상 화면의 영상(재생 버튼 → 유튜브)은 모작에서 뺐다(11절).

## 근거 자료

| 자료 | 경로 |
|---|---|
| 페이지별 첫 화면 캡처(capture-site) · computed style | `refs/kor--<경로>.do/`, `refs/measure.json` — 원본이 가상 스크롤이라 문서 높이가 900 으로 잡혀 **첫 화면만** 찍힌다 |
| **스크롤 단계 캡처(유효본)** | `refs/<페이지>/steps/s00.jpg …` + `steps.json` — 휠을 실제로 굴려 가상 스크롤을 움직이며 찍었다(15페이지). 관성 이동 중이라 일부 프레임이 덜 멈춘 상태다 |
| 원본 상태별 캡처 | `refs/states/` — 팝업 열림/닫힘, 메가메뉴 Who We Are·What We Do, 메뉴 벗어남, 언어 열림, 전체 메뉴 열림/호버/닫힘, 제품 탭 1/2·끌기, 바닥 계열사 목록 열림, 사업장 해외 탭, 실적발표 연도 목록 열림, 뉴스룸 전체/YOUTUBE, 제품 AIR, 쇼룸 호버 |
| 라이브러리 · 이징 · 애니메이션 · 섹션 높이 | `refs/origin/origin.md`, `origin.json` |
| 모션 녹화 · 비교 | `refs/motion-origin/`, `refs/motion-mine/`, `refs/motion-compare.html` |
| 모작 실측(같은 도구) | `refs/mine-origin/origin.md` |
| 모작 상태별 캡처 | `refs/mine-states/` |

## 1. 사이트 구조

### 원본 (KOR 45경로)

```
/kor/index.do                         홈
Who We Are   whoweare/about · history · location/domestic · location/overseas
Why We Exist whyweexist
What We Do   showroom(별도 화면, 자체 헤더) · sustainable-tech · product/space·air·land·sea · discover · protect
IR           earning-release · ir-event · financial-info/finance01·02 · stock-info · invest-info · finance/notice·business-report·audit-report
Media        newsroom/list (+view) · library/list · notice/list
ESG          sustain-business · compliance/introduce·program·report · ehs/introduce·program · winwin · social-contribution · association/governance·directors·regulations
Careers      talent · recruit
기타         privacy-policy · terms-of-service · sitemap · certificate · 방문신청(외부) · 관련 기관/계열사(외부)
```

내비게이션: 1단 7칸(WHO WE ARE · WHY WE EXIST · WHAT WE DO · IR · MEDIA · ESG · CAREERS, 영문 대문자) + 마우스를 올리면 헤더가 어두운 유리(`rgba(0,0,0,.7)` + blur 30px)로 바뀌고 그 항목 아래로 2단이 세로로 나온다. 나머지 1단은 `opacity .3`. 오른쪽: 지구본(KOR/ENG) · 방문신청 · 햄버거(전체 메뉴 = 사이트맵 격자).

### 재현 (28페이지)

| 원본 | 모작 | 비고 |
|---|---|---|
| 홈 | `index.html` | |
| (ENG) | `en/index.html` | **영어 홈 1쪽만.** 메뉴는 한국어 하위 페이지로 간다 |
| 기업 소개 · 연혁 · 사업장(국내/해외) | `whoweare/{about,history,location}/` | 사업장 국내/해외는 원본에서 별도 주소, 모작은 한 쪽 안의 탭(`#domestic`·`#overseas` 주소로 바로 열림) |
| Why We Exist | `whyweexist/` | |
| Virtual Showroom | `whatwedo/showroom/` | 원본처럼 자체 헤더(로고 + KOR ▾), 바닥 없음 |
| Sustainable Technologies · Discover · Protect | `whatwedo/{sustainable-tech,discover,protect}/` | |
| Products & Services Space/Air/Land/Sea | `whatwedo/products/{space,air,land,sea}/` | |
| 실적발표 · IR 일정 · 재무정보 · 주식정보 · 공시정보 · 전자공고 | `ir/{earning-release,ir-event,financials,stock,disclosure,announcement}/` | 사업보고서·감사보고서는 공시정보로 연결 |
| 뉴스룸 · 라이브러리 · 공지사항 | `media/{newsroom,library,notice}/` | 뉴스 본문 화면은 만들지 않았다(카드 링크는 목록 안 자기 자리로) |
| ESG 6항목 | `esg/sustainability/` + `#ethics` `#ehs` `#partners` `#social` `#governance` | 원본은 6화면+, 모작은 지속가능경영 1쪽 안의 해당 칸으로 연결 |
| 인재상 · 채용안내 | `careers/talent/` + `#recruit` | |
| 개인정보 처리방침 · 이용약관 · 사이트맵 | `privacy/` `terms/` `sitemap/` | |
| 방문신청 | `whoweare/location/#visit` | 원본은 외부 신청 화면 |
| 외부(전자조달·윤리 신고·경력증명서·SNS·관련 기관·계열사·채용 사이트) | `*.tavrin.example` · `*.example` | 가상 도메인 |

원본 메뉴의 1단 7칸, 2단 26항목, 3단(국내/해외, Space~Sea, 연결/별도, 공고/사업보고서/감사보고서) 전부가 만든 페이지(또는 그 페이지의 칸)로 이어진다.

## 2. 그리드 (1440)

원본 `html{font-size}` 가 화면폭에 따라 변한다: `0.8333vw`(기본) · `.88vw`(1400~1800) · `.93vw`(~1399) · `9px`(≤1024). 1440 에서 1rem = 12.67px. 모작도 같은 규칙.

| 항목 | 원본 | 모작 |
|---|---|---|
| 좌우 여백 | `.container` padding 5vw (=72, 내용 1296 — `widths` 1296×6) | 같음 |
| 컬럼 | 14칸(`.col-1`~`.col-14`), 거터 `clamp(16px,1.5rem,28px)` (=19) | 같음 |
| 헤더 | `40px + (1.3vw+15px)×2 + 1px` = 108.4 · 열림/위로 스크롤 `0.9vw` 기준 = 96.9 | 같은 식 |
| 로고 | `clamp(196px,12.7vw,272px)` 폭, 높이 `clamp(32px,2.5rem,48px)` | 심벌 1.45em + 글자(SVG·텍스트) |
| 홈 섹션 | KV 900 · 소개 508 · 미션 2068 · 제품 900 · 쇼룸(70vh) 630 · 뉴스 991 · 파트너 576 | 900 · 509 · 2070 · 900 · 630 · 993 · 663 (`refs/mine-origin`) |
| 뉴스 4열 | `grid repeat(4,1fr)` 거터 동일, 사진 4:3 | 같음 |
| 파트너 사각 | 11.25vw(=162) + 거터, 두 줄 60초 반대 방향 | 같음 |
| 연혁 행 | x=636, 폭 639(7칸), 행 높이 78, 글자 19px | 7칸째부터 7칸, 최소 78px, `max(16px,1.5rem)` |
| 브레이크포인트 | 1024 이하 rem 9px · 바닥 `min-width:1024px`(가로 스크롤) | 1024 · 640. 바닥은 1024 고정 대신 줄바꿈(가로 넘침 0) |

### 문서 높이 (1440, ±15%)

원본 값은 가상 스크롤 내용 높이(`steps.json` 의 마지막 `-top + 900`), 모작은 `scrollHeight`.

| 페이지 | 원본 | 모작 | 차 |
|---|---:|---:|---:|
| 홈 | 7289 | 7274 | −0.2% |
| 기업 소개 | 8404 | 7454 | −11.3% |
| 연혁 | 17076 | 14861 | −13.0% |
| 사업장 소개 | 4851 | 4281 | −11.8% |
| Why We Exist | 10506 | 10226 | −2.7% |
| Sustainable Technologies | 8104 | 7754 | −4.3% |
| Virtual Showroom | 900 | 900 | 0 |
| Products (Space) | 2030 | 2137 | +5.3% |
| Discover | 7862 | 8486 | +7.9% |
| Protect | 8977 | 8345 | −7.0% |
| 실적발표 | 2018 | 1815 | −10.1% |
| IR 일정 | 2021 | 1815 | −10.2% |
| 뉴스룸 | 2079 | 1903 | −8.5% |
| 인재상 | 4145 | 4233 | +2.1% |
| ESG 지속가능경영 | 9542 | 8653 | −9.3% |

연혁은 원본이 157행이다. 모작은 손으로 쓴 39행에 같은 결의 행을 규칙으로 덧붙여 139행(`data.mjs` 의 `fill()`)을 만들었다. 덧붙인 행은 제품·나라·사업장 목록을 돌려 쓴 것이라 반복이 보인다(REVIEW 5절).

## 3. 타이포

원본 서체 2벌: 한글 **HanwhaGothic**(자체 웹폰트 — weight 400 이 Light 파일, 700 이 Regular) · 영문 **canada-type-gibson**(Typekit, 200·300·400).

| 원본 클래스 | 값(원본 CSS) | 1440 | 모작 |
|---|---|---:|---|
| `kv-headline` | gibson 200 · `max(36px,3.5417vw)`/1.1 · −0.03em | 51 | Albert Sans 200, 같은 값 |
| `headline-1` | gibson 200 · `max(66px,7.75rem)`/.96 | 98 | 같은 값 (연혁 시기 제목) |
| `headline-2-en` | gibson 200 · `max(51px,6rem)`/.96 · −0.03em | 76 | 같은 값 |
| `headline-2-kr` | Hanwha 400(L) · `max(51px,6rem)`/1.25 · −0.04em | 76 | Pretendard 300 |
| `headline-3-en/kr` | `max(45px,5.25rem)` /1 · /1.25 | 66.5 | 같음 (실측 66.53 · 행간 83.16) |
| `headline-4-kr` | `max(36px,4.25rem)`/1.25 · −0.04em | 53.9 | 같음 (실측 53.86) |
| `body1` · `body2` | `max(17px,1.375rem)` · `max(16px,1.25rem)` /1.5 · −0.015em | 17.4 · 16 | 같음 |
| `btn3` · `btn4` | `clamp(14px,1.125rem,22px)` · `clamp(13px,1rem,20px)` | 14.3 · 13 | 같음 |
| 1단 메뉴 | gibson 400 · btn4 · 대문자 · 자간 .02em | 13 | 같음 |
| 글자+원 버튼 | gibson 400 · `clamp(14px,1.125rem,22px)` · 원 1.11em | 14.3 | 같음 |

대체: gibson → **Albert Sans**(Google Fonts, 200/300/400/500 — 두 층 a, 기하 인문 산세리프라 가장 가까움). HanwhaGothic → **Pretendard Variable 1.3.9**(jsDelivr) 300(원본 Light 자리)·400·500. 타입 배율 13 · 14 · 16 · 17 · 51 · 54 · 66.5 · 76 · 98 — 원본과 같다.
정적 분석기(impeccable 파일 모드)가 `max()`/`clamp()` 를 못 읽어 모든 글자를 9~16px 로 잡는 문제가 있어, 생성기가 이런 선언 앞에 1440 기준 px 값을 한 번 더 적는다(`build.mjs` 의 `evalFns`). 브라우저는 뒤의 `clamp` 를 쓴다.

## 4. 아이콘

원본: 글자 옆 검은 원 안 흰 화살표(`txt-circle-w.svg`, 호버 때 화살표가 오른쪽으로 빠지고 왼쪽에서 새로 들어옴) · 사각 테두리 아래 화살표(KV) · 지구본 · 햄버거(선 2개 키프레임 `menuTopOg`) · 위로(사각 테두리) · 플러스(선택 상자) · 다운로드 · 돋보기 · 페이스북/유튜브 · ESG 선 아이콘(주황).
모작: 전부 SVG 로 다시 그렸다. 선 1.3~1.6. 햄버거는 선 3개 → X(.4s). ESG 아이콘 12개(잎·공장·물방울·연료·손·하트·사람·방패·조직도·저울·문서·경고)는 주황 `#f37321` 선.

## 5. 색

| 역할 | 원본 | 모작 |
|---|---|---|
| 우주 바탕(KV·미션) | `#00040e` | `#00040e` |
| 강조(어워드 색, 개인정보 처리방침·호버) | `#f37321` | `#f37321`(아이콘·포커스 링), 글자는 `#b44f0c`(흰 바탕 5.2:1) |
| 글자 | `#000` · 보조 `#666` · 날짜/약함 `#999` | `#000` · `#666` · `#999` → **`#767676`**(4.5:1, 대비 때문에) |
| 선 | `rgba(0,0,0,.1)` · 어두운 면 `hsla(0,0%,100%,.1)` | 같음 |
| 헤더 열림 | `rgba(0,0,0,.7)` + blur 30 | 같음 |
| 헤더 위로 스크롤 | `hsla(0,0%,100%,.85)` + blur 30 + 아래 선 | 같음 |
| 베일 | `#000` | 같음 |
| 팝업 버튼 | 캡처 스포이드 `#e4793a` 부근(흰 글자 3.0:1) | `#c25515`(4.6:1) — 대비 |
| 미션 비활성 글자 | 흰색 `opacity .3` | `opacity .5` — 대비(5.3:1) |

## 6. 간격

- 반복 수치(원본 CSS): `12.5vmax`(뉴스 머리 위·목록 아래) · `6.25vmax`(머리 아래) · `28vh`(소개 위) · `22.2vh`(미션 사이) · `80vh`(미션 첫 문장 위) · `9vh`(제품 글 위) · `3.3vw`(쇼룸 글 왼쪽) · `6.666vw`(바닥 위·아래 단 사이) · 바닥 위 선 `clamp(37px,3rem,58px)`.
- 섹션 머리: 제목(`padding-bottom .36em`) → 버튼. 등장 이동 거리 5rem(제목) · 3rem(설명) · 1.5rem(버튼).
- 하위: 쪽 제목 위 `헤더 높이 + 11vh`, 섹션 사이 12.5vmax(ESG 19vmax), 마지막 여백 12.5vmax.

## 7. 모션

| 무엇 | 원본 실측 | 모작 | 근거 |
|---|---|---|---|
| 스크롤 | **Locomotive Scroll**(가상, `#scroll-wrapper` transform · html overflow hidden) + GSAP 3.11 ScrollTrigger | **Lenis 1.1.13**(lerp .1) — 네이티브 스크롤 위의 관성. 문서 높이가 실제로 생긴다 | origin.md "하이재킹으로 보인다" / mine-origin "네이티브" |
| 첫 등장 | `.veil` `#000` opacity .992→0 약 500ms · 헤더 `translate3d(0,-100%)`→0 600ms ease | 같은 값(베일 .5s ease, 헤더 `init` → 600ms) | motion.json · 비교표(헤더 1 대 4 일치) |
| KV 문구 | `.box__translate` translateY(100%)→0 1000ms `cubic-bezier(0,0,.25,1)` | 같은 값 | 비교표 1 대 1 일치 |
| KV 사진 | Swiper zoom 컨테이너(정지) | 1.08→1 2.4s 확대 (**모작 추가** — 영상 없는 KV 를 살리려고) | 비교표 파란 줄 |
| 문장 등장 | `motion-state=on` 때 opacity 0→1 + translateY 5rem/3rem/1.5rem → 0, `transition: all 750ms`, 지연 0/250/500ms | opacity·transform 750ms ease, 같은 지연 (IntersectionObserver) | 원본 CSS · 비교표(원본은 `all` 이라 visibility 로 기록) |
| 뉴스 카드 | GSAP `translate(0,20%)` op 0 → 원위치 | 800ms ease, 카드마다 100ms 지연 | 인라인 스타일 기록 |
| 미션 | 사진이 컨테이너 폭에서 화면 가득으로 넓어짐(`missions__bg` GSAP) · 배경 사진 교체 opacity .5s · 문장 opacity .3↔1 .5s | sticky + `clip-path inset(0 5vw→0)` 스크롤 연동 · 두 겹 교차 전환 .5s · 문장 .5s | 단계 캡처 `refs/home/steps` |
| 헤더 | 내릴 때 숨김, 올릴 때 흰 유리, 높이 108→97 `.4s` | 같음 | `header.translated` 600ms |
| 메가메뉴 | 바 `transform 1000ms cubic-bezier(.23,1,.32,1)` · 2단 opacity · 1단 색 .4s | 같은 값 | 원본 CSS |
| 버튼(글자+원) | 글자 위로 −150% + opacity .5, 화살표 통과 · `.34s ease-in-out` | 같은 값 | 원본 CSS |
| 뉴스 제목 밑줄 | `background-size 0→100%` `.5s ease` · 사진 scale 1.1 `.6s` | 같음 | 원본 CSS |
| 제품 끌기 | 캔버스 2D, 끌기 핸들, 이웃 제품이 양옆에 걸침, 커서 원(◀ ▶) | 캔버스 2D 직접 그림(이웃 걸침, 바닥 그림자, 끝을 흰 바닥으로 녹임) + lerp .12 | `refs/states/home-products-*` |
| 쇼룸 카드 | 배경 130% 높이 패럴랙스 | `data-py` 패럴랙스 | 원본 CSS |
| 파트너 | `marquee-top`/`marquee-bottom` 60000ms linear, 반대 방향 | 같은 값(`mq-top`/`mq-bot`) | 비교표 이름만 다름 |
| 바닥 | `.footer-wrap` translate(0,−180px)→0 | 같은 값, 바닥 안에서만 움직이게 `overflow:hidden` | 인라인 스타일 기록 |
| 커서 | `cursor-follower` 마우스를 따라감 | 끌기 영역(`data-drag`)에서만 원이 보임 | 단계 캡처 |
| 연혁 | 시기 막대 고정 + 사진 있는 행에 마우스 → 사진이 떠서 따라옴 | 같음 | `refs/history/steps` |
| Why | 넓은 사진이 커지며 글 등장 · 장 표지 사진 축소 · 장 막대 고정 · 콜라주 패럴랙스 | 같은 구조(clip-path · scale 1.15→1 · sticky · `data-py`) | `refs/whyweexist/steps` |
| Discover · Protect | 장마다 배경 사진 고정 + 왼쪽 제목 고정 + 오른쪽 사진·글 스크롤 | 같은 구조 | `refs/discover/steps` |

**모션 비교표의 빨간 줄(원본에만)** — 13종이 남는다. 무엇이고 왜 남는지:
- `visibility` 340·500·600·750ms (탭·제목·이미지·버튼): 원본이 `transition: all` 이라 visibility 까지 기록됐다. 같은 요소의 opacity·transform·color 전환은 모작에 같은 길이로 있다(파란 줄 750ms opacity/transform 9건).
- `color 400ms a.d1-link` · `color 200ms menu__region` · `background-image 200ms`: 원본 헤더가 로드 직후 `light`(검은 글자) → 흰 글자로 한 번 바뀌며 생긴 기록. 모작 헤더는 처음부터 흰 글자라 이 전환이 생기지 않는다. 아이콘은 SVG `currentColor` 라 그림 교체가 없다.
- `selectbox__dropdown` opacity·scrollbar-color 400ms `(.25,1,.5,1)`: 녹화 중 바닥 선택 상자를 열지 않았다. 모작 선택 상자도 같은 곡선 400ms 로 열린다(기능 검증에서 확인).
- `marquee-top/bottom`: 모작 `mq-top/mq-bot` 과 값이 같고 이름만 다르다.
- 원본 스크롤 구간 녹화는 **2.5초 만에 끝났다**(y=0). 가상 스크롤이라 녹화 도구가 문서 끝을 못 찾는다. 원본 스크롤 모션은 단계 캡처(`refs/<페이지>/steps`)와 `inlineStyles` 기록으로 대신 봤다.

`prefers-reduced-motion`: 모든 전환·애니메이션 끔, Lenis 끔, 베일 숨김, 등장 요소 바로 표시, 마퀴 정지.

## 8. 기능 목록

검증: **Playwright MCP 가 이 컨테이너에 없어서 Playwright 라이브러리 스크립트로 실제 클릭·끌기·휠·키 입력을 보내 확인했다**(59항목 PASS, JS 에러 0). 스크립트는 스크래치패드에 두고 커밋하지 않았다.

| 기능 | 원본 | 모작 동작 | 확인 |
|---|---|---|---|
| 공지 팝업 | 로드 때 왼쪽 위 이미지 공지, ×, "오늘 하루 보지 않기" | 같음. 체크하고 닫으면 그날은 다시 안 뜸(localStorage, 실패해도 동작), ESC | PASS |
| 메가메뉴 | 호버로 헤더 확장 + 그 항목 2단 | 호버·Tab 포커스로 열림, 항목 사이 이동, 벗어남·바깥 클릭·ESC 닫힘, `aria-expanded` | PASS |
| 헤더 숨김/보임 | 있음 | 있음 | 녹화 |
| 언어 | 지구본 → KOR/ENG | 클릭 열림, 바깥·ESC 닫힘, ENG → `en/` | PASS |
| 전체 메뉴(햄버거) | 전체 화면 사이트맵 | 열림/닫힘(버튼·ESC), 열린 동안 배경 스크롤 잠금, 390px 동작 | PASS |
| 제품 끌기 | 끌어서 넘김 + 탭 3개 | 끌기·탭·←→ 키, 탭 `aria-selected`, 커서 원 | PASS |
| 바닥 선택 상자 2개 | 관련 기관 · 계열사(분류 머리 포함) | 열면 다른 쪽 닫힘, 바깥·ESC 닫힘 | PASS |
| 위로 버튼 | 있음 | 있음 | PASS |
| 사업장 국내/해외 | 별도 주소 탭 | 탭(클릭·←→), 주소 `#overseas` 로 바로 열림 | PASS |
| 재무 연결/별도 | 별도 주소 | 탭 | PASS |
| 실적발표 연도·쪽 | 연도 드롭다운(직접 만든 목록) · 쪽 | 연도 `select` 로 실제 필터(2024 → 4행), 쪽 이동, 검색(1자 → 검증 문구, 결과 없음 문구) | PASS |
| 뉴스룸 분류·검색·쪽 | 전체/NEWS/YOUTUBE/FACEBOOK + 검색 | 같음, 건수가 실제로 바뀜 | PASS |
| 제품 카드 | 상세 페이지로 이동 | **상세 창(모달)** — 사양 표, ESC·×·바깥 클릭 닫힘, 포커스 가둠/복귀, 스크롤 잠금 | PASS |
| 쇼룸 | 패널 호버 → 다른 패널 어두워짐, 클릭 → 3D 보기(설명 점 15개, 제품 이동) | 호버 → 다른 패널 어두워짐(.45) + 사진 확대, 클릭 → 넓은 사진 끌기 보기 + 설명 점 3개씩 + 제품 바꾸기 탭 + ←→ 키 + ESC/× | PASS |
| 연혁 | 시기 막대 고정·현재 표시, 사진 행 호버 | 같음 | PASS |
| Why 장 막대 | 고정·현재 표시 | 같음, 클릭 이동 | PASS |
| 자료 내려받기 | PDF | 모작용 빈 텍스트 파일(`data:` URI) | 링크 |
| 포커스 링 | 없음 | 2px `#f37321` — **원본과 다르게** 접근성 최소선 | PASS |

## 9. 섹션 순서

- **홈**: 팝업 → 헤더 → KV(우주 사진, 영문 한 줄, 아래로 버튼) → 소개(한글 두 줄 + WHAT WE DO) → 미션 3(사진이 넓어짐 · Protect / Sustainable Technologies / Discover) → 제품(끌기 캔버스 + 탭 3) → Virtual showroom 카드 → News & media(4열) → Our partners(마퀴 2줄) → 바닥
- **기업 소개**: 사진 머리(라벨 + 두 줄) → Vision(문단 + 번호 3) → 큰 문장 → 반반 3(Sustainable technologies · Discover · Protect, 왼쪽 사진 고정) → 영역 머리 + 카드 4(Space · Air · Land · Sea, 엇갈림)
- **연혁**: 사진 머리(80vh) → 시기 막대(고정) → [시기 제목 → 행 목록] × 6
- **사업장 소개**: 큰 제목 → 국내/해외 탭(고정) → 2열 카드(사진 · 이름 · 하는 일 · 주소 · 전화) → 방문신청
- **Why We Exist**: 영문 두 줄 제목 → 넓은 사진(커지며 글) → 장 막대(고정) → [장 표지 → 콜라주] × 3 → 맺음 문장 → 사진 마퀴
- **Sustainable Technologies**: 가운데 영문 제목 머리 → 한글 두 줄 + 영문 한 줄 → [왼쪽 고정 제목 | 기술 3(사진 · 영문 제목 · 한글 소제목 · 설명)] × 3
- **Discover · Protect**: 가운데 영문 제목 머리 → 소개 → [고정 배경 사진 · 왼쪽 고정 영문 제목 | 사진 + 글 3] × 3
- **Products**: 사진 머리(가운데 제목 · 설명) + 아래 분야 탭 4 → 분야 영문 큰 제목 → 카드 격자
- **Virtual Showroom**: 자체 헤더 → 3분할 패널(왼쪽 큰 1 · 오른쪽 2)
- **IR · 공지 표 화면**: 큰 제목 → (연도 · 검색) → 표 → 쪽
- **뉴스룸 · 라이브러리**: 큰 제목 → 분류 · 검색 → 4열 카드 → 쪽
- **ESG**: 라벨 + 두 줄 → 넓은 사진 → 경영전략(문단 · 3열 · 평가 등급 · 지표 4) → 거버넌스(위원회 구성 표 · 개최 현황 표) → Performance(번호 행 4: Environmental · Social · Governance 카드 2×2, 보고서 다운로드)
- **인재상**: 사진 머리 → 제목 → 큰 글자 상자(STEADY CLIMBER) → 사진 카드 3 → 가치별 행동 목록 3 → 채용안내 5단계

## 10. 사진

`node scripts/fetch-stock.mjs` 로 Unsplash·Pixabay(기본 `stock`) 24개 검색(2개는 결과 0 → 검색어를 바꿔 다시), 받은 원본 132장은 `refs/photo-raw/`(gitignore). 118자리에 골라 1440/820/520px·JPEG 58~64 로 줄여 `assets/stock/`(5.09MB). 출처: `credits.json`(사진 주소·라이선스·검색어·쓴 자리). Pinterest 는 쓰지 않았다.
자리 맞춤: KV(지구 + 위성, 어두움) → 위성과 지구 · 미션 Protect(햇빛 든 침엽수 계곡) → 같은 결의 계곡 · Sustainable(보라 무한 빛) → 파란 빛 궤적 · Discover(우주인 + 행성 고리) → 바위 위 우주인 · 제품(흰 바닥 렌더) → 밝은 바탕의 위성 모형 · 엔진 사진을 캔버스에서 밝게 하고 끝을 흰색으로 녹임 · 쇼룸(베이지 조형 공간) → 베이지 조형 공간.
고르지 않은 것: 회사 로고가 찍힌 작업 조끼 사진(people-03), 벽에 로고가 있는 회의 사진(meet-02 · meet-05), 국적 표지가 그려진 군용기 사진(test-04 — 처음 쇼룸 보기에 넣었다가 뺐다).

## 11. 원본과 다르게 한 것 · 못 한 것

- **3D 쇼룸 → 2D 사진 끌기 보기**(1절). 설명 점은 제품마다 3개(원본 15개).
- **제품 카드 → 상세 창.** 원본은 제품별 상세 페이지. 모작은 상세 페이지를 만들지 않고 같은 정보를 창으로 연다.
- 뉴스 본문 화면, ESG 하위 5화면, 채용안내 화면을 따로 만들지 않고 각 페이지의 칸으로 연결했다.
- 인재상의 **영상(재생 → 유튜브) 자리를 뺐다.** 큰 글자 상자와 사진 카드만 있다. 가치마다 붙은 원본의 주황 그림 아이콘도 없다.
- 실적발표 연도 선택은 원본의 직접 만든 드롭다운 대신 `select`(같은 위치·선 모양).
- 영어 사이트는 홈 1쪽만.
- 스크롤: Locomotive 가상 스크롤 대신 Lenis(네이티브 위 관성). 원본은 문서 높이 900 고정이라 브라우저 찾기·스크롤바·앵커가 원본에서는 어색하다 — 모작은 그 점이 다르다.
- 대비: `#999` → `#767676`, 미션 비활성 .3 → .5, 팝업 버튼 `#c25515`.
- 바닥 `min-width:1024px`(원본, 좁은 화면에서 가로 스크롤) 대신 줄바꿈.
- 바닥 선택 상자는 아래로 펼쳐지며 아래 내용을 민다(원본은 겹쳐 열림 — 겹치면 두 번째 상자를 누를 수 없어서).
- impeccable 이 잡은 것 중 고친 것: `undersized-ui-text` 2786 · `tiny-text` 114 · `flat-type-hierarchy` 18(전부 clamp 를 못 읽어서 → px 대체 선언), `low-contrast` 17, `cramped-padding` 51(바닥 선 위 여백 px 로, 히어로·쇼룸 바탕색 제거, 뉴스 카드 위 여백), `buried-raster` 4(미션 사진을 두 겹 교차로 바꿔 숨은 사진 0), `skipped-heading` 3. 설정으로 끈 규칙 없음.
- **남은 impeccable 6건 = `marquee`(홈 · 영어 홈 · Why).** 원본에 실측으로 있는 구조다: `refs/origin/origin.md` 「애니메이션」 `marquee-top` · `marquee-bottom` 60000ms linear (`ul.partners-list`), Why 페이지 하단 사진 띠가 단계 캡처마다 옮겨 가 있다(`refs/whyweexist/steps/s09~s11.jpg`). PROTOCOL 4-6 예외로 친다.
