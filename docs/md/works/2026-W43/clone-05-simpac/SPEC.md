# SPEC — 심팩그룹(SIMPAC) 모작 → 모벡그룹(MORVEC)

## 출처

- **원본 URL**: https://www.simpac.com/
- **어워드**: Awwwards Honorable Mention · 2026-01-11
- **어워드 링크**: https://www.awwwards.com/sites/simpac
- 제작: DFY® · 태그 Business & Corporate · Animation · Clean · Responsive Design · 3D · UI design · Microinteractions · After Effects · Figma · Adobe Photoshop · 어워드 페이지 색 `#255a4b` `#2f363a`
- 확인 방법: 2026-10-21 WebFetch 로 어워드 페이지를 다시 읽음(등급·날짜·제작사·태그 위와 같음). 심사 점수는 개별 표 15건(6.70~9.70)만 있고 합계 점수는 없음. awwwards.com 은 Chrome 직접 접속이 막혀 어워드 페이지 캡처(`award-page.jpg`)는 **만들지 못했다.**
- 모작 날짜: 2026-10-21 · 포트 4421
- 모작 브랜드: **모벡그룹 / MORVEC Group** (가상). 웹 검색 `"Morvec" company OR group` 결과 같은 이름의 회사 없음(Moravec·Morvern 등 부분 일치만). 처음 고른 `Kelnor` 는 영국 `Celnor Group` 과 발음이 겹쳐 버렸다.

### 대상 선정 근거 (2026-10-21, 사용자 위임 "알아서 좋은걸로")

조건: 한국어 화면 · 멀티페이지 · 3D/WebGL 장면이 화면을 주도하지 않음. 오케스트레이터 사전 실측 + 이 작업에서 재확인.

| 후보 | 수상 | 실측 | 판정 |
|---|---|---|---|
| **SIMPAC** simpac.com | HM 2026-01-11 | lang=ko · 홈 내부 경로 20 · canvas 0 · WebGL 0 · video 6 · 홈 9678px | **선택** — 한국어, 하위 페이지 18종, WebGL 없음 |
| ABT helloabt.com | HM 2026-02-19 | 기본 영어 + /Kor | 탈락 — 기본 화면이 영어 |
| UNOVE | — | 영어 Shopify | 탈락 — 영어 쇼핑몰 |
| Knock | — | us. 영어 Shopify | 탈락 — 영어 쇼핑몰 |
| NewmixCoffee | — | WebGL·Three.js 주도 | 탈락 — 3D 주도(PROTOCOL 2절) |
| MIJIHEON | — | 3D · Video · Sound | 탈락 — 3D·영상 주도 |

태그 "3D" 는 실제로 **영상과 이미지 안의 렌더**다(캔버스 2D 컨텍스트 3개는 dotlottie·차트용, WebGL 0). 히어로·커리어·푸터·하위 페이지 머리의 영상 6+10개는 **같은 무드의 사진 + 느린 확대 이동(CSS `drift`)** 으로 대체했다. 영상·AI 영상은 쓰지 않았다.

## 근거 자료

| 자료 | 경로 |
|---|---|
| 페이지별 전체 캡처(capture-site) · computed style | `refs/<페이지>/00-full.jpg`, `measure.json` |
| **스크롤 단계 캡처(영상 대체 후, 유효본)** | `refs/<페이지>/steps/s00-*.jpg …` |
| 원본 상태별 캡처 | `refs/states/` (메가메뉴 열림/닫힘, 언어 열림, 슬라이더 1/2, 계열사 열림/닫힘, 헤더 다시 보임, 모바일 홈·메뉴·하위 펼침, 뉴스 상단, 연혁 시기 목록 열림) |
| 원본 사업분야 상태 | `refs/business/steps/biz-0~6.jpg`(휠 단계), `refs/states/business-learnmore-open.jpg` · `business-learnmore-scrolled.jpg` · `business-grid-open.jpg` |
| 라이브러리 · 전환 · 이징 · 애니메이션 | `refs/origin/origin.md`, `refs/origin/origin.json` |
| 모션 녹화 · 비교 | `refs/motion-origin/`, `refs/motion-mine/`, `refs/motion-compare.html` |
| 모작 상태별 캡처 | `refs/mine-states/` |

**캡처에서 막힌 것과 우회.** 이 컨테이너의 Chromium 에는 H.264 코덱이 없다. 원본은 영상 6개가 `canplay` 될 때까지 로더(`.page-loading`)를 걷지 않아서, `capture-site.mjs` 결과(`refs/<페이지>/00-full.jpg`, `refs/home/01~07`)는 대부분 **로더 로고만 찍혔다.** 그래서 원본 영상을 받아 VP9 webm 으로 바꾸고(스크래치패드, 커밋 안 함), simpac.com 을 그대로 중계하면서 `.mp4` 요청만 webm 으로 돌려주는 역프록시를 4421 포트에 잠깐 띄워 `extract-origin.mjs` · `record-motion.mjs` · 단계 캡처를 다시 돌렸다. `refs/origin` 과 `refs/motion-origin` 의 URL 이 `127.0.0.1:4421` 인 이유다. 응답 본문은 원본 그대로이고 영상 코덱만 다르다.

## 1. 사이트 구조

### 원본 (KOR 18화면 + ENG)

```
/                홈
/business        사업분야 (전체 화면 슬라이드 5장 + Learn more 패널 + 전체 보기)
/about/simpac-group · greeting · history · brand · ci      그룹소개 5
/story/newsroom (+ /view) · notice · simpacdaum · social     스토리 4 (+뉴스 본문)
/ir/stock · disclosure · financials · archive              투자정보 4
/esg/overview · environment · social · governance         ESG 4
/en              영어 사이트
인재채용 → 외부 채용 사이트(ninehire)
```

내비게이션: 1단 6칸(사업분야 · 그룹소개 · 스토리 · 투자정보 · ESG · 인재채용↗) + 2단은 마우스를 올리면 헤더가 66→128px 로 늘며 가운데 한 줄로 나온다. 하위 페이지에서는 현재 섹션의 2단이 늘 보인다. 오른쪽 지구본 → KOR/ENG.

### 재현 (45페이지)

| 원본 | 모작 | 비고 |
|---|---|---|
| 홈 | `index.html` | |
| 사업분야 | `business/index.html` | 슬라이드 5 · Learn more 패널 5 · 전체 보기 |
| 소개 · 인사말 · 연혁 · 브랜드 · CI | `about/{morvec-group,greeting,history,brand,ci}/` | |
| 뉴스 · 공지사항 · 심팩다움 · 소셜채널 | `story/{newsroom,notice,morvecdaum,social}/` | 뉴스 본문 12쪽 `story/newsroom/<id>/`, 공지 본문 13쪽 `story/notice/<id>/` |
| 주가 · 공시 · 재무 · IR자료실 | `ir/{stock,disclosure,financials,archive}/` | |
| ESG 4 | `esg/{overview,environment,social,governance}/` | |
| ENG | `en/index.html` | **영어 홈 1쪽만.** 원본 /en 은 하위 페이지까지 영어지만 모작은 홈만 영어로 만들고, 메뉴는 한국어 하위 페이지로 연결 |
| 인재채용(외부) | `https://careers.morvec.example/` | 원본도 외부. 가상 도메인 |

원본 메뉴 항목 19개(1단 6 + 2단 17, 중복 제외)가 모두 만든 페이지로 이어진다. 외부로 가는 것(채용 · SNS · 계열사 · 지도 · 계열사 사이트)은 전부 `*.example` 도메인이다.

## 2. 그리드 (1440)

| 항목 | 원본 | 모작 |
|---|---|---|
| 좌우 여백 | 32 (콘텐츠 1376 = `widths` 실측 1376 ×33) | 32 |
| 헤더 | 66 (`gnb-inner` 66→128 전환 실측) · 로고 32 · 메뉴 가운데 · 항목 간격 약 48 | 같음 |
| 홈 사업 카드 | 왼쪽 682 · 오른쪽 694 (`widths` 682×20, 694×10) · 사진 높이 510 · 카드 높이 약 576 | 1fr · 694 · 510 · 575 |
| 가치 슬라이드 | 1376 × 654, 모서리 8 | 같음 |
| 하이라이트 유리 카드 | 732 × 408 가운데 | 732, 패딩 48 |
| 스토리 목록 | 흰 행 1376, 간격 16 | 같음 |
| 푸터 카드 | 1376 × 520, 바깥 여백 32, 오른쪽 열 x≈828 | 1fr · 580 |
| 하위 2단 | 라벨 32~470 · 내용 502~1408 | 438 · 1fr (간격 32) |
| 브레이크포인트 | 1024 메뉴 → 버거, 768 이하 1단(모바일 캡처) | 1200 · 1024 · 768 |

### 문서 높이 (1440, ±15%)

원본 값은 영상이 재생된 상태로 잰 단계 캡처 기준(영상 없으면 홈 9678).

| 페이지 | 원본 | 모작 | 차 |
|---|---:|---:|---:|
| 홈 | 9312 | 9573 | +2.8% |
| 소개 | 6162 | 5355 | −13.1% |
| 인사말 | 3864 | 3447 | −10.8% |
| 연혁 | 15391 | 13910 | −9.6% |
| 브랜드 | 12439 | 10758 | −13.5% |
| CI | 6031 | 5560 | −7.8% |
| 뉴스 | 3841 | 3770 | −1.8% |
| 공지사항 | 3300 | 3067 | −7.1% |
| 심팩다움 → 모벡다움 | 4865 | 4192 | −13.8% |
| 소셜채널 | 3104 | 2764 | −11.0% |
| 주가정보 | 3371 | 3784 | +12.3% |
| 공시정보 | 2053 | 2088 | +1.7% |
| 재무정보 | 2894 | 2931 | +1.3% |
| IR자료실 | 2053 | 2088 | +1.7% |
| ESG 개요 | 3869 | 3656 | −5.5% |
| 환경 | 4439 | 4043 | −8.9% |
| 사회 | 3060 | 3268 | +6.8% |
| 지배구조 | 3513 | 3626 | +3.2% |
| 사업분야 | 900(고정) | 900(고정) | 0 |

## 3. 타이포

| 역할 | 원본 (measure.json) | 모작 |
|---|---|---|
| 영문 제목 · 숫자 | SpecialGothicExpanded 600 — 80/90 −1.6(히어로) · 88/114 −2.6(인원) · 48/58 −1.4(계열사명) · 42/54(지표) · 36/54 −0.9(가치·푸터) · 20/22 −0.4(COMPANY) | Google Fonts **Special Gothic Expanded One**(400만 있음) 같은 크기·행간·자간 |
| 한글 본문 | Pretendard Variable — 42/62 520 −0.8(키카피) · 28/48 520(카드 제목) · 24/36 400 #535862(설명) · 24/40 520(목록 제목) · 20/30 400(설명) · 18/20 520(메뉴) · 16/20(주석) | Pretendard Variable 1.3.9 (jsDelivr) 같은 값. 주석 행간만 20→22(1.25 → 1.375, impeccable `tight-leading`) |
| 하위 제목 | 72/84 520 #131415 | 같음 |
| 타입 배율 | 16 · 18 · 20 · 24 · 28 · 36 · 42 · 48 · 72 · 80 · 88 | 같음 |

## 4. 아이콘

원본: 1.5 선 화살표(→ ↗), 꺾쇠, 지구본, 버거(lottie), 카드 선 아이콘(사람·그래프·전구·지구), ESG(공장·저울·조직도), 재생, 소셜 3종. 원본 심벌은 S 모양 8조각.
모작: 전부 SVG 로 다시 그렸다. 선 1.5~1.6, 둥근 끝. 심벌은 **같은 판 6장이 60° 씩 도는 형태**로 새로 설계(원본 S 와 다른 모양). 버거는 lottie 대신 SVG 두 개 전환.

## 5. 색

| 역할 | 원본 | 모작 |
|---|---|---|
| 주색(버튼·메뉴·로고) | `#255a4b` | `#255a4b` |
| 제목 | `#2f363a` | `#2f363a` |
| 본문 | `#535862` | `#535862` |
| 보조 글자 | `#828d92` (흰 바탕 3.4:1) | `#656d71` (5.3:1) — **대비 때문에 바꿈** |
| 회색 면 | `#f5f5f5` | `#f5f5f5` |
| 가치 슬라이드 | `#d5e5e8` · 그림 `#11634f` | 같음 |
| 유리(하이라이트·푸터·사업 버튼) | 반투명 회색 + blur (캡처 스포이드 약 `#a3a7ab`) | `rgba(58,64,70,.76)` + blur — 흰 글자 대비가 2.4:1 이라 어둡게(impeccable `low-contrast`) |
| 브랜드 화면 바탕 | `#15171a` 부근 | `#15171a` |
| 주가 상승/하락 | 빨강/파랑 | `#d6332c` / `#2b63c9` |

## 6. 간격

- 섹션 위아래 140 (`main-company` · `main-story` padT/padB 140, `main-highlight` padT 140 — measure.json).
- 섹션 머리: 분류(20) → 16~20 → 키카피 → 40 → 버튼 → 56~80 → 본문.
- 하위 2단 섹션 사이 140, 회색 섹션 안쪽 140.
- 반복 수치: 8 · 16 · 24 · 32 · 40 · 56 · 140.

## 7. 모션

| 무엇 | 원본 실측 | 모작 | 근거 |
|---|---|---|---|
| 첫 등장 | `#wrap` opacity 0→1 400ms ease · 로더 opacity 400ms `cubic-bezier(.165,.84,.44,1)` + left/visibility 400ms 지연 | 같은 값. 로더는 심벌 6조각이 110ms 간격으로 모인 뒤 1400ms 에 걷힘 | motion.json · 비교표 |
| 문장 등장 | `span.value` translateY(100%)→0, 600ms `cubic-bezier(.165,.84,.44,1)`, 지연 50ms + 줄마다 50ms | 같음 (IntersectionObserver) | 비교표 17 대 19건 |
| 버튼 글자 굴림 | 글자마다 translateY 0→−100%, 600ms `cubic-bezier(.77,0,.175,1)`, 15ms 간격 | 같음 | 비교표 14 대 28건 |
| 헤더 숨김 | 내릴 때 translateY(−128px) 400ms, 올릴 때 복귀 | 같음 | `div.header-outer` |
| 메가메뉴 | 헤더 높이 66→128 400ms · 흰 바탕 opacity 200ms · 2단 opacity 400ms | 같음 | `div.gnb-inner` |
| 사업 카드 쌓임 | 카드가 위에 붙으며 다음 카드가 덮음. 덮일 때 `.item-info` translateY 70% · `.obj` 40% (2000ms `cubic-bezier(.075,.82,.165,1)`). 안쪽 `.outer` 는 GSAP 로 −102.65px → 0 | sticky(84px 간격) + 같은 전환 + 스크롤 연동 translate3d −102.65 → 0 | 인라인 스타일 기록 |
| 히어로 심벌 | 로드 뒤 opacity 0→1 400ms ease | 같음 | `div.symbol` |
| 숫자 | countUp 2초, 시작값 → 목표값 | 2초 ease-out | `data-duration="2"` |
| 영상 | 히어로·커리어·푸터 배경 영상(금속 판이 흩어지고 모임) | 사진 + `drift` 18~26초 확대 이동 | 영상 대체 |
| 하위 머리 | 영상 + 스크롤 시 가장자리가 안쪽으로 접힘 | sticky + `clip-path inset` 이 스크롤 진행에 따라 0→32/40px | 단계 캡처 |
| 연혁 | 시기 사진이 화면 가득 → 카드로 줄어듦, 아래 시기 이동 막대 | 같은 구조(clip-path) | 단계 캡처 |
| 스크롤 | Lenis 로드됨, 측정상 네이티브 | 네이티브(Lenis 생략) | origin.md |

비교표(`refs/motion-compare.html`) 빨간 줄(원본에만 있는 모션): **0건.** 처음 녹화에서 로더의 `left` · `visibility` 전환이 빨간 줄로 떠서 같은 이징·지연으로 옮겼다. 원본의 GSAP 인라인 변화(`div.outer` −102.65px→0)는 스크롤 연동 inline transform 으로 옮겼다.
파란 줄(모작에만): `drift`(영상 대체), 가치 슬라이드 막대 `barUp`(원본 lottie 대체), 로더 조각 `pcIn`(원본 lottie 로더 대체), 버튼 배경색 200ms(원본 hover 색 변화 미측정 — 추가).
옮기지 못한 것: 원본 로더는 영상 로딩을 기다려 약 3.9초 뒤 화면이 나온다. 모작은 영상이 없어 1.4초로 줄였다. lottie 애니메이션(가치 슬라이드 그림, 버거 아이콘)은 같은 형태를 SVG + CSS 로 다시 그렸고 프레임 단위 일치는 아니다.
`prefers-reduced-motion`: 전 애니메이션·전환 끔, 로더 숨김, 문장 바로 표시, 숫자 바로 끝값.

## 8. 기능 목록

검증: **Playwright MCP 가 이 컨테이너에 없어서 Playwright 라이브러리 스크립트로 실제 클릭·휠·키 입력을 보내 확인했다**(54항목 전부 PASS, JS 에러 0). 스크립트는 스크래치패드에 두고 커밋하지 않았다.

| 기능 | 원본 | 모작 동작 | 확인 |
|---|---|---|---|
| 메가메뉴 | 호버로 헤더 확장 + 2단 | 호버·Tab 포커스로 열림, 마우스 벗어남·바깥 클릭·ESC 로 닫힘(ESC 후 1단 링크로 포커스), `aria-expanded` | PASS |
| 하위 페이지 2단 고정 | 현재 섹션 2단 상시 + 밑줄 | 같음, `aria-current` | PASS |
| 헤더 숨김/보임 | 있음 | 있음 | PASS |
| 언어 선택 | 지구본 → KOR/ENG | 클릭 열림, ESC·바깥 클릭 닫힘, ENG → `en/` | PASS |
| 모바일 메뉴 | 버거 → 전체 화면, 하위 아코디언, KOR/ENG | 같음 + 배경 스크롤 잠금, ESC 닫힘 | PASS |
| 가치 슬라이더(Swiper) | ← → · 점 3개 | 이전/다음(끝에서 비활성), 점 클릭·화살표 키, 스와이프, `aria-selected` | PASS |
| 사업 카드 쌓임 | sticky + GSAP | sticky + 전환 + 스크롤 연동 | PASS |
| 숫자 올라가기 | countUp | 같음 | PASS |
| 계열사 바로가기 | 위로 열리는 목록 | 클릭 열림, ESC·바깥 클릭 닫힘 | PASS |
| 사업분야 슬라이드 | 휠로 5장 넘김 | 휠(900ms 잠금)·↑↓ 키·터치·오른쪽 점 | PASS |
| Learn more | 현재 계열사 상세 패널(블러 덮개, ×) | 같은 구성, ESC·× ·바깥 클릭 닫힘, 포커스 가둠/복귀, 열린 동안 휠 막힘 | PASS |
| 전체 보기 | 5개 썸네일, 현재 표시 점 | 클릭하면 그 슬라이드로 이동 후 닫힘 | PASS |
| 홈 → 사업분야 카드 | `?pageNum=n` | `#unit-n` 으로 해당 슬라이드 | PASS |
| 대표 뉴스 캐러셀 | ← → · 점 | 같음 | PASS |
| 뉴스·공지 필터 | 토픽 select · 연도 select · 검색 | 실제로 목록·건수가 바뀜, 결과 없음 문구 | PASS |
| 쪽 나누기 | 뉴스·공시·IR자료실 | 이전/번호/다음 | PASS |
| 소셜 채널 버튼 | 외부 채널 링크 3개 | 같음(가상 주소) | 링크 검사 |
| 소셜 더보기 | 더보기 | 9 → 12개 | PASS |
| 주가 기간 | 2개월·6개월·1년·2년 + 확인 | 봉 차트 다시 그림(40→250봉) | PASS |
| 재무 탭 | 연결/별도 | 탭 전환, ←→ 키, `aria-selected` | PASS |
| 연혁 시기 이동 | 아래 고정 막대, 펼치면 시기 4개 | 같음, 스크롤 위치 따라 현재 시기 표시 | PASS |
| 브랜드 미션/비전 | 슬라이드 2장 + 점 | 페이드 전환 | PASS |
| 계열사 CI 다운로드 | 파일 내려받기 | SVG 내려받기 | PASS |
| 포커스 링 | 없음 | 2px 초록(어두운 면은 흰색) — **원본과 다르게** 접근성 최소선 | PASS |

## 9. 섹션 순서

- **홈**: 헤더 → 히어로(배경, Momentum For Value, 심벌) → COMPANY(키카피 · 버튼 · 가치 슬라이더) → BUSINESS(키카피 · 쌓이는 카드 5) → HIGHLIGHTS(키카피 · 사진 + 유리 카드: 인원 · 매출 · 자산 · 영업이익) → MORVEC STORY(키카피 · 버튼 · 목록 5) → CAREERS(사진 · 키카피 · 외부 버튼) → 푸터(SNS · 큰 로고 · 영문 문장 · 지도 · 주소 · 계열사 바로가기)
- **사업분야**: 전체 화면 슬라이드 5 + 아래 막대(Learn more · 전체 보기) + 오른쪽 점
- **소개**: 머리 → Overview → Vision(가치 슬라이더) → Values(카드 4) → Group Highlights(4) → Group Assets(4)
- **인사말**: 머리 → CEO Message(사진 · 요약 · 문단 2묶음 · 서명)
- **연혁**: 머리(제목 → 소개 문장) → [시기 표지 → 시기 사진·이름 | 연도 목록] × 4 → 시기 이동 막대
- **브랜드**: 머리 → 문장 → 초록 빛 → 문장 → 미션/비전 → 키워드 모자이크 8 → 슬로건
- **CI**: 머리 → Signature → Symbol & Wordmark → Clear Space → Slogan → Affiliate CI + 다운로드
- **뉴스**: 제목 → 대표 캐러셀 → 필터 · 검색 → 건수 → 목록 → 쪽
- **공지사항**: 제목 → 필터 · 검색 → 건수 → 목록 → 쪽 · 본문은 `항목: 값` 표
- **모벡다움**: 제목 → 매거진 카드 3 → 연도 select → "내용이 없습니다." (원본과 같은 빈 목록)
- **소셜채널**: 제목 → 채널 버튼 3 → 영상 격자 → 더보기
- **주가정보**: 제목 → 현재가(가격 · 대비 · 시고저 · 당일 흐름) → 호가 · 종목 정보 → 일자별 시세(기간 · 봉 차트 · 15일 표)
- **공시정보 · IR자료실**: 제목 → 번호/제목/등록일 표 → 쪽
- **재무정보**: 제목 → 탭 → 막대 차트 6 → 표
- **ESG 개요**: 머리 → Overview → Sustainability Message(사진) → ESG Direction(카드 3)
- **환경 · 사회 · 지배구조**: 제목 → 개요(사진) → 주제별 2단(지표 · 목록 · 카드)

## 10. 사진

`node scripts/fetch-stock.mjs` 로 Pinterest(기본) 17개 검색 + Unsplash·Pixabay(`--source stock`, 넓은 사진) 2개 검색, 받은 원본은 `refs/photo-raw/`(gitignore). 58장을 골라 1440px 이하·JPEG 66 으로 줄여 `assets/stock/`(4.3MB). 출처: `credits.json`(핀·사진 주소, 라이선스, 검색어, 명도, 쓴 자리).
고르지 않은 것: 회사 로고가 찍힌 작업자 사진(workers-09), 글자가 들어간 공장 사진(press-07 · press-08), 투명 배경 체크무늬가 구워진 금속 오브젝트(object-03 · 07 · 11 · 12 · 14), 포스터 글자가 있는 액체 금속(liquid-02).
자리 맞춤: 원본 히어로 영상(밝은 회색 바탕에 떠 있는 금속 판) → `widealu-06`(회색 금속 판 반복, 밝음) · 원본 사업 카드 3D 렌더(흰 바탕 금속·유리 오브젝트) → 금속 줄무늬 · 녹색 조명 기계 · 크롬 기어 · 액체 금속 · 무지개 유리 · 하이라이트 녹색 기어 렌더 → 녹색 녹 기어 · 푸터 금속 판 영상 → 사선 금속 판(`widegeo-01`).
CEO 사진은 Pinterest 의 익명 인물 사진이다. 실존 인물로 확인된 사진이 아니다(요청이 오면 바로 바꾼다).

## 11. 원본과 다르게 한 것

- 보조 글자 `#828d92` → `#656d71`, 유리 면을 어둡게 — 대비비(접근성 최소선).
- 검색창 placeholder `#5f686c` — impeccable `low-contrast`.
- 포커스 링 추가.
- 주가정보의 지수(KOSPI·KOSDAQ 등) 상자는 실제 지수에 가상 값을 붙이게 되어 **뺐다.**
- 공시정보·IR자료실의 행은 원본에서 외부 공시 시스템·PDF 로 가지만 모작은 링크 없는 글자다(가상 문서가 없음).
- 영어 사이트는 홈 1쪽만.
- impeccable 이 잡은 것 중 고친 것: `low-contrast`(유리 면·placeholder), `skipped-heading`(카드 제목 h3 → h2), `tight-leading`(주석 행간), `cramped-padding`(공지 표 위 선 · 히어로 배경색 제거), `codex-grid-background`(CI 격자를 CSS 그라디언트 대신 CI 화면 안의 SVG 패턴으로 — 원본 CI 의 격자 위 시그니처 자리). 설정으로 끈 규칙 없음. 최종 결과 0건.
