# SPEC: ESR Bespoke 모작 → KVR Coachworks

## 출처

- **원본 URL**: https://www.esrbespoke.au/
- **어워드**: Awwwards Site of the Day · 2026-10-23 · SOTD 7.31/10 (Design 7.51 · Usability 7.04 · Creativity 7.24 · Content 7.43) + **Developer Award 7.26/10** (Semantics/SEO 7.40 · Animations/Transitions 7.00 · Accessibility 6.40 · WPO 7.40 · Responsive 7.80 · Markup/Meta 7.00)
- **어워드 링크**: https://www.awwwards.com/sites/esr-bespoke (2026-10-30 WebFetch 로 다시 읽음. awwwards.com 은 curl·Chrome 접속이 막혀 페이지 캡처는 없다)
- 크레딧: Nightjar (Nightjar.co, PRO) · 태그 Business & Corporate · Promotional · Luxury · Big Background Images · Clean · Footer Design · 기술 After Effects · Figma · Sanity · 어워드 팔레트 `#000` · `#fff`
- 어워드 설명(요약): 오래된 이력과 업계 평판을 가진 고급 차체 수리점(autobody shop). 포르쉐 등 고급 브랜드의 독점 인증을 가졌다. 심사 하이라이트: ESR Home(히어로) · ESR Brands(마크 목록) · ESR Navigation(메뉴)
- 모작 날짜: 2026-10-30 · **사용자가 대상을 골랐다(2026-10-30)**
- 모작 이름: **KVR Coachworks** (가상의 시드니 고급차 사고 수리 공장, 1991년 설립). 웹 검색에서 같은 이름의 업체를 찾지 못했다(2026-10-30, `"KVR Coachworks" Sydney` 결과 없음)

### 업종을 바꾸지 않은 이유

작업 지시에는 "가상 호주 건설·인테리어 시공사"라고 적혀 있었지만, 원본은 **고급차 사고 수리(collision repair)** 회사다(어워드 설명 "luxury autobody shop", 원본 본문 Insurance Repairs · Claims Management · Porsche Certified Collision Centre). PROTOCOL 5절 "그 사이트의 업종에 맞는 그럴듯한 더미"와 "원본과 같은 글자 수 대역"을 지키려면 업종을 원본과 같게 둬야 한다. 그래서 **가상 호주(시드니) 차체 수리 공장**으로 만들었다. 지시와 다르게 한 점이라 보고에 적는다.

### 같은 스튜디오 작업과 겹치지 않게

원본 제작사 Nightjar 의 Odyssée 를 W42 에 했다(`works/2026-W42/clone-06-odyssee`, 가상 브랜드 **Sorrel & Vane**). 겹치지 않게 한 것:

| | W42 Sorrel & Vane | 이번 KVR Coachworks |
|---|---|---|
| 업종 | 미용의학 클리닉 | 고급차 사고 수리 |
| 색 | 크림 `#fffcf8` + 남색 `#1e305e` | 흰 `#fff` · 검정 `#000` · 짙은 회색 `#191919` (원본 그대로) |
| 로고 | 세리프 대문자 글자 로고 | 각진 블록 3글자 SVG(KVR), 직접 그림 |
| 서체 | 세리프 + 산세리프 | Schibsted Grotesk + Saira Semi Condensed |

### 대상 선정 근거 (2026-10-30, 사용자 선택)

조건: 영어 화면 · 내부 화면 여럿 · 3D/WebGL 주도 아님 · 같은 주 다른 작업과 겹침 없음.
사전 실측(헤드리스 Chrome 1440×900): lang=en, 내부 경로 6(/services · /partners · /about · /contact · /careers · /privacy-policy), canvas 18 · **WebGL 0**, video 3, 홈 높이 6870px.

| 후보 | 수상 | 판정 |
|---|---|---|
| **ESR Bespoke** esrbespoke.au | SOTD 2026-10-23 + Dev | **선택**. 2D. 캔버스 18개는 전부 `2d` 컨텍스트(40×40 사진 자리 흐림 + 1440×900 사진 넘김 1개), WebGL 0 |
| Unbelievably Crap | SOTD 2026-10-29 | 탈락: WebGL · Three.js |
| G. Colombel | SOTD | 탈락: WebGL |
| Awards Racing | SOTD | 탈락: WebGL · Three.js |
| A24 | SOTD | 탈락: Three.js |
| Forge Automotive | SOTD | 탈락: WebGL |
| Emotion Agency | SOTD | 탈락: Three.js |
| Brandon Yasin | SOTD 2026-10-24 | 제외: 이미 W44 clone-08 |

같은 스튜디오(Nightjar) 작업을 W42 에 한 것은 위 표대로 밝힌다. 이번 주 모작 중 Nightjar 는 이 1건이다.

## 근거 자료

| 자료 | 경로 |
|---|---|
| 페이지별 전체 캡처(capture-site) | `refs/<페이지>/00-full.jpg`, 홈 섹션 `refs/home/01~05-*.jpg`, 390px `refs/home/90-mobile-390.jpg` |
| 페이지별 뷰포트 캡처(휠 900px씩, 1.5초 대기, **영상 재생 상태**) | `refs/<페이지>/vp/vp-*.jpg` |
| 상태별 캡처(Playwright 스크립트로 클릭·hover·키 입력) | `refs/states/` — 메뉴 열림 중 150/300/600ms · 열림 · 항목 hover 5 · Esc 뒤, 상단 메뉴 hover, Automotive Group hover, Our story hover, 사진 넘김 hover · 클릭 100–1400ms · 2·3번째, 마크 스크롤 0/300/600/900/1200 · hover, 꼬리말 드러남 5단계 · 이메일 포커스 · 빈 제출 · 형식 오류, 아코디언 닫힘 · hover · 여는 중 · 1번 열림 · 1+3번 열림, 채용 행 hover, 연락처 사진 넘김 hover · 끌기, 팀 이름 hover, 모바일 홈 · 메뉴 |
| computed style 실측 7페이지 | `measure.json` |
| 라이브러리 · 전환 · 토큰 · 호버 · 키프레임 · 캔버스 명령 | `refs/origin/origin.md` · `origin.json` |
| 모션 녹화(로드 5초 + 휠 + hover 3) | 원본 `refs/motion-origin/` · 모작 `refs/motion-mine/` · 비교 `refs/motion-compare.html` |
| 원본·모작 같은 스크롤 위치 나란히 | `refs/compare/<페이지>.jpg` (왼쪽 원본, 오른쪽 모작) |
| 모작 상태별 캡처 | `refs/mine-states/` |

**캡처에서 막힌 것과 우회.** 원본 영상 3개는 Vimeo HLS(H.264)를 hls.js 로 튼다. 이 컨테이너의 Chromium 은 H.264 가 없어 영상 자리가 검게 찍혔다(`refs/home/00-full.jpg` 히어로). 그래서 Vimeo 스트림 2개를 ffmpeg 로 VP9 webm(720p, 30–40초)으로 바꾸고(스크래치패드, 커밋 안 함), esrbespoke.au 를 그대로 중계하면서 HTML `<head>` 에 작은 스크립트를 넣어 ① `MediaSource` 를 지워 hls.js 대신 `video.src` 경로를 타게 하고 ② `.m3u8` 주소를 로컬 webm 으로 바꾸는 역프록시를 127.0.0.1:4442 에 잠깐 띄웠다(W43 SIMPAC 방식). `refs/<페이지>/vp/` · `refs/states/` · `refs/motion-origin` 이 이 프록시로 찍은 것이다. 세 번째 영상(services, Vimeo 947267724)은 Vimeo 가 404 를 돌려줘 바꾸지 못했다(원본 사이트에서도 안 나오는 영상으로 보인다). `refs/origin`(extract-origin)은 프록시 없이 원본에 직접 돌렸다.

라이브러리(원본): Next.js(React) · Sanity 이미지 CDN · hls.js · nprogress. GSAP 류 인라인 transform(글자 등장, 커서 추적, 히어로 패럴랙스). 스크롤은 **네이티브**(extract-origin `looksHijacked` 아님, 래퍼 transform 없음). 캔버스 2D: `drawImage` 872 · `clearRect` 874 · `putImageData` 17 — 40×40 흐림 자리(사진 로드 전)와 사진 넘김 1개.
모작: 라이브러리 없이 CSS + 바닐라 JS. 캔버스 대신 DOM `img` + `clip-path` 로 같은 결과를 냈다.

## 1. 사이트 구조

### 원본 (7화면 + 메뉴 덮개)

```
/                 홈: 영상 히어로 · Porsche 인증 문단 · 사진 넘김(캔버스) · 마크 12 · Tailored Solutions(검정) · 꼬리말
/services         서비스: 하위 히어로 · What we offer · 서비스 아코디언 6 · 사진 · 마크 12 · The details that drive us · Exceptional standard · ESR difference 아코디언 4 · 사진
/partners         파트너: 하위 히어로 · Global Partnerships · Porsche 블록 · Glasurit 블록
/about            소개: 하위 히어로 · A trusted partner · Our story · The People Behind ESR · 임원 6(hover 사진)
/contact          연락: 하위 히어로 · Enquiries 표 · Visit us · 두 지점(사진 넘김 3 · 4장 + 소개 + 전문분야)
/careers          채용(어두운 바탕): 큰 문단 · 채용 4(mailto) · 사진
/privacy-policy   개인정보(어두운 바탕)
메뉴 덮개(모든 페이지): 큰 링크 5 · 링크 hover 사진 · 연락처 · 로고 · 인스타그램
```

내비게이션: 상단(absolute, 스크롤하면 사라짐) 로고 글자 · Automotive Group(hover 하면 since 1989) · 세로 메뉴 5(col 9). 고정 Contact 알약 + 햄버거(오른쪽 위). 꼬리말에 같은 메뉴 5 + Privacy.

### 재현 (7페이지)

| 원본 | 모작 파일 |
|---|---|
| / | `index.html` |
| /services | `services/index.html` |
| /partners | `partners/index.html` |
| /about | `about/index.html` |
| /contact | `contact/index.html` |
| /careers | `careers/index.html` |
| /privacy-policy | `privacy-policy/index.html` |
| 메뉴 덮개 | 모든 페이지 같은 마크업 |

생성: `node build.mjs` (내용·템플릿 `build.mjs`, 스타일 `src/style.css`, 동작 `src/script.js`). 결과는 페이지마다 HTML 한 파일, CSS·JS 인라인. 링크는 `…/index.html` 로 걸어 `file://` 로도 이어진다(Playwright 로 file:// 에서 about → careers 이동 확인).

### 바꾼 것 · 줄인 것

- 이름·주소·전화·메일·인물·브랜드는 전부 가상. 전화는 호주 통신청(ACMA)이 드라마·광고용으로 비워둔 `(02) 5550 01xx` 대역, 메일은 예약 도메인 `kvr.example`.
- 실존 자동차 브랜드 12개(Porsche · Bentley …)는 가상 마크 12개(Vallour · Ashcombe · Torrani · Kestrel-Hale · Brennan Moss · Castavelli · Dunmore · Halvorsen-GT · Ardo M · Oskar RS · Fell Ranger · Severano)로 바꿨다. 글자 수와 줄바꿈 자리(12자 두 개가 넘침: 원본 Mercedes-AMG → 모작 Halvorsen-GT·Kestrel-Hale)를 맞췄다.
- 파트너 Porsche · Serventis/Glasurit 은 가상의 Vallour(차 제조사) · Velacor(도료사)로. 원본 로고 대신 검은 상자에 글자 로고와 원 엠블럼을 직접 그렸다(SVG/CSS).
- 인스타그램 링크(@esrbespoke → 외부)는 가상 계정이라 연락 페이지로 걸었다.
- 원본 히어로 **영상**은 사진 3장 교차(1.6초 페이드 + 7초 1.08→1 확대)로 대신했다. 원본 "Unmute" 버튼은 소리가 없으니 **Pause/Play**(자동으로 바뀌는 배경 멈춤)로 바꿨다 — 원본에 없는 기능을 만든 것이 아니라 같은 자리의 버튼이 대역물에 맞는 일을 하게 했다.
- 메뉴 덮개의 기본 영상(0.8 비율)도 사진으로 대신했다.

## 2. 그리드 실측 (1440px)

원본은 rem 고정 크기(1024px 이상에서 같은 수치). `.grid-layout{grid-template-columns:repeat(12,1fr);gap:1rem}`, 좌우 `md:px-8`.

| 항목 | 원본 | 모작 |
|---|---|---|
| 좌우 여백 · 컬럼 · 간격 | 32 · 12칸(100px) · 16. 칸 시작 x 32 · 148 · 264 · 380 · … · 728(7) · 960(9) | 같음 |
| 1023px 이하 | 6칸 · 여백 18(`px-[1.125rem]`) | 같음 |
| 상단 | top 28(`top-7`), 로고 col 1–3, Automotive Group col 4–6, 메뉴 col 9 (줄 1.25em, `mt -0.2em`), 현재 점 6.4px `-left-4` | 같음 |
| 고정 버튼 | 햄버거 24×24 right 37 top 24, Contact 알약 h24 right 65, 바탕 `#2b2b2b` | 같음 |
| 홈 히어로 | 100svh, 글 시작 44vh, h1 col-span 8 max 15ch, 오른쪽 col 9–12 (pb 24), Unmute 왼쪽 아래 24, 아래 여백 56 | 같음(Pause) |
| 인증 문단 | min-h 45vw(648), 라벨 아래 336(`md:mb-[21rem]`), large 40px | 같음 |
| 사진 넘김 | 100svh, 커서 미리보기 216×216(15vw) 커서 오른쪽 아래, `next` 꼬리표 +16/+16 | 같음 |
| 마크 | 머리줄(mono col 1–8 · 설명 col 9–10) · 목록 py 278 · 이름 92px 행 간격 88 · 사각 사진 216 sticky top 270(col 9) | 같음 |
| Tailored Solutions | pt 56, 라벨 아래 336, 아래 목록 mt 300 · 위 선 · 오른쪽 col 9–12 행 py 20 · 번호→글 40 · 아래 224 | 같음 |
| 하위 히어로 | 윗칸 min-h 616(38.5rem) 아래 정렬 pb 28 · h1 col 1–6 · 설명 col 9–12 + ↓ · 사진 비율 1.6(900) · 아래 32 | 같음 |
| 하위 섹션 | `mb-32`(128), 위 선 + pt 28, 라벨 col 1–6, 내용 col 7–12(680) | 같음 |
| 표 행 | 라벨 216 + 값 448(x 960), 위 선, pt 16 | 같음 |
| 사진 상자(파트너·지점) | 680×510 | 같음 |
| 팀 | 라벨 col 1–2, 사진 col 3–5(332×221), 표 col 7–12(이름 2칸 · 직함 2칸) | 같음 |
| 채용 | 문단 위·아래 304(19rem), 40px | 같음 |
| 꼬리말 | 100svh 고정 뒤판, 줄 `1fr auto 1fr`, 로고 max 32vw | 같음 |

### 문서 높이 (1440, ±15% 기준)

| 페이지 | 원본 | 모작 | 차 | 모작 섹션 높이 |
|---|---:|---:|---:|---|
| 홈 | 6870 | 6872 | 0.0% | 900 · 652 · 900 · 1721 · 1679 (원본 900 · 648 · 900 · 1721 · 1681) |
| services | 8821 | 8744 | −0.9% | 1516 · 156 · 382 · 900 · 1704 · 1260 · 114 · 256 · 900 |
| partners | 5076 | 5040 | −0.7% | 1516 · 118 · 1045 · 1045 |
| about | 4068 | 4000 | −1.7% | 1516 · 59 · 510 · 201 · 270 |
| contact | 5492 | 5388 | −1.9% | 1516 · 263 · 106 · 1051 · 1008 |
| careers | 2915 | 2927 | +0.4% | 160 · 231 · 900 |
| privacy-policy | 4546 | 4441 | −2.3% | 40 · 2765 |

섹션 수: 홈 원본 5 / 모작 5(hero · cert · 사진 넘김 · 마크 · solutions). 3화면 넘는 섹션은 원본에 없다(가장 긴 것 홈 마크 1721 = 1.9화면) → 모작도 없다. 꼬리말 900(100svh)은 모든 페이지 높이에 들어 있다.
모작에 `extract-origin.mjs` 를 돌리면 "하이재킹으로 보인다"가 나온다. 첫 방문 인트로 동안 `main` 에 `translateY` 가 걸려 있어서다(원본도 같은 시점에 `main#page-content` 가 `translate3d(0,100vh)`→0 — motion.json). 인트로가 끝나면 transform 이 없고 스크롤은 네이티브다.

## 3. 타이포

| 역할 | 원본(measure.json · CSS) | 모작 | 이유 |
|---|---|---|---|
| 본문 서체 | **FK Grotesk**(Florian Karsten, 상용) 500 | **Schibsted Grotesk** 500 | 같은 크기로 겹쳐 그려 비교(스크래치패드 서체 표). 폭·글자 모양이 가장 가까웠다. Hanken 은 좁고, Familjen 은 굵고, Host 는 넓었다 |
| 라벨 서체 `.mono` | Binnenland/norm "Regular"(상용, 각진 DIN 계열) 300 · 14px/1 · .09em · 대문자 | **Saira Semi Condensed** 400 · 14px · .07em · 대문자 | 각진 반좁은 꼴. 원본보다 넓어 자간을 .07em 으로 줄여 폭을 맞췄다 |
| .h0 (마크) | 92px · line-height .95em(실측 87.4) · −.01em | 같음 | |
| h1 / .h1 | 62px · .95em · −.01em | 같음 | |
| large-body | 40px/40px · −.01em | 40px/1 | |
| 본문 · 아코디언 · 표 값 | 20px/24px 500 | 20px/**26px**(1.3) 500 | impeccable `tight-leading`(1.2 < 1.3)을 고쳤다. 원본보다 행간이 2px 넓다 |
| 작은 제목(파트너명 · 지점명 · 팀 · 개인정보 소제목) | 18px/23.4px 500 | 같음 | |
| 라벨 여러 줄(히어로 설명 · 연락처 묶음 · 꼬리말) | 14px/14px | 14px/**18.2px** | 같은 규칙(tight-leading) |
| 타입 배율 | 14 · 18 · 20 · 40 · 62 · 92 | 같음 | |
| 1023px 이하 | h1 38 · .h0 38 · large 24(careers 24) · 메뉴 링크 40 | 같음 | |

`overused-font` 목록(Inter · Geist · Space Grotesk 등)은 피했다.

## 4. 아이콘

원본: 햄버거(15×5.6, 1px 선 2개, hover 에 서로 1px 다가감, 열리면 ✕), 아코디언 삼각형 8×5(`-scale-y-100` ↔ `scale-y-100`, 150ms ease-in-out), ↓ 화살표(하위 히어로), ↗(채용 행 hover), 점 6.4px(현재 메뉴 · Our story hover), 꼬리말 "EST." 타원, 블록 글자 로고(332×100).
모작: 전부 SVG/CSS 로 새로 그렸다. 로고는 같은 332×100 판에 각진 K · V · R(R 의 모서리 10 라운드)을 직접 그렸다. 삼각형·화살표·EST 타원 모두 직접 그린 path.

## 5. 색

| 역할 | 원본 | 모작 |
|---|---|---|
| 바탕 / 글자 | `#fff` / `#000` (`--background-rgb` `--foreground-rgb`) | 같음 |
| 어두운 바탕(히어로 · careers · privacy) | `#191919` (`bg-dark-grey`) | 같음 |
| 검정 섹션 · 사진 섹션 | `#000`, 사진 opacity .8 | 같음 |
| Contact 알약 · 스크롤 후 햄버거 | `#2b2b2b` (`bg-grey-menu`), hover `#000` | 같음 |
| 선 | 밝은 면 `var(--border)` 10%, 검정 면 `hsla(0,0%,100%,.1)` | rgba(0,0,0,.1) · rgba(255,255,255,.1) |
| 사진 자리 | 사진마다 평균색(`style="background-color"`) | 같은 방식. 모작 사진 평균색을 PIL 로 재서 넣었다 |
| 꼬리말 | 페이지마다 다름 — 홈 · services · careers 흰 바탕, partners · about · contact · privacy 검정 | 같음 |
| 꼬리말 흐린 글자(라벨 · Privacy) | opacity .5 | .6 (흰 바탕 4.5:1 위로) |

**원본과 다르게 한 것(대비)**: 마크 목록 꺼진 이름과 메뉴 hover 때 꺼진 링크가 원본은 opacity .1(흰 바탕 `#e6e6e6` = 1.2:1). impeccable `low-contrast` 로 잡혀 **.44**(약 3.1:1, 92px·62px 큰 글자 기준 3:1)로 올렸다. 원본보다 꺼진 이름이 진하다. 아코디언(.5) · 채용(.25) · 팀(.25) hover 흐림은 마우스를 올린 동안만 생기는 상태라 원본 값을 그대로 뒀다.

## 6. 간격

반복 수치: 16(간격) · 20(행 안쪽) · 28(선 아래, 상단 top) · 32(좌우 여백, 섹션 사이) · 56(히어로 아래) · 128(하위 섹션 사이) · 278(마크 위) · 300(검정 블록 목록 위) · 304(careers · privacy 문단 위아래) · 336(라벨 → 큰 문단) · 616(하위 히어로 윗칸).

## 7. 모션

| 무엇 | 원본 실측 | 모작 | 근거 |
|---|---|---|---|
| 첫 방문 인트로 | 검은 화면. 539ms 부터 상단 글자가 한 글자씩(약 28ms 간격) 켜짐, 상단은 353px 아래에 있다가 올라감. 큰 로고가 아래에서 올라옴. 2605–3603ms `main#page-content` 가 `translate3d(0,100vh)`→0, 로고 −60vh | 같은 순서: 300ms 부터 글자 타자, 600ms 로고 상승(900ms), 2600ms 에 `main` 100vh→0 · 상단 353→0 · 로고 −60vh (1000ms `cubic-bezier(.19,1,.22,1)`). 세션 첫 방문만. 다음 페이지부터는 `main` 만 1000ms 올라옴 | motion.json inlineStyles · `refs/motion-origin/frames/load-*` |
| 글자 타자 | 글자마다 `div` opacity 0→1, 약 28ms 간격(헤더 · 히어로 · 라벨 · 메뉴 · 꼬리말) | 같은 방식(글자 span, 28ms, 긴 글은 전체 1.4초 안) · 화면에 들어올 때 | inlineStyles `div op 0→1` 수백 건 |
| 전환 이징 | `ease-expo-out-2` = `cubic-bezier(.19,1,.22,1)` ×49, `ease-expo-out` `(.16,1,.3,1)` ×1 | 같은 두 곡선만 씀 | origin.md 전환 |
| 메뉴 덮개 | `translate3d(0,-105%,0)`→0, 링크·연락처 타자 | 900ms expo-out-2, 링크 22ms 간격 타자 | `refs/states/menu-opening-*` |
| 메뉴 hover | 다른 링크 흐림, 오른쪽 사진 바뀜 300ms | 같음(.44) | `refs/states/menu-hover-*` |
| 상단 메뉴 hover | 다른 항목 .5 (500ms expo-out-2), 점이 hover 항목으로 이동 | 같음 | origin 전환 표 opacity 500 |
| Automotive Group hover | 아래로 빠지고 since 1989 가 위에서 내려옴 | 500ms | `refs/states/header-hover-group.jpg` |
| 햄버거 hover | 선 ±1px, 500ms | 같음 | 비교표 transform 500 |
| 햄버거·알약 스크롤 | 바탕 투명→`#2b2b2b` 300ms, 글자색 300ms | 같음 | 비교표 background-color · color 300 |
| Our story hover | 왼쪽 점 scale 0→1, 300ms | 같음 | 비교표 `::before` transform 300 |
| 히어로 패럴랙스 | 영상 판 translateY 스크롤에 따라(실측 0→125.7px) | scrollY × .3 | inlineStyles `div.!absolute.inset-0` |
| 사진 넘김 | 커서를 lerp 로 따라가는 216px 다음 사진 + `next` 꼬리표(clip 79%→0). 클릭하면 그 사각형에서 화면 가득으로 커짐(100ms 에 이미 절반, 250ms 거의 끝) | `clip-path` 사각형 → `inset(0)` 900ms expo-out-2, 커서 lerp .2, 꼬리표 clip 500ms | `refs/states/home-slider-click-*` |
| 마크 목록 | 화면 가운데를 지난 마지막 이름이 1, 나머지 흐림(100ms), 사각 사진 교체. hover 하면 그 이름 | 같음 | probe 결과 표(아래 8절) · 비교표 opacity 100 |
| 아코디언 | 높이 열림, 삼각형 뒤집힘 150ms ease-in-out, 다른 행 .5 | 높이 600ms expo-out-2, 삼각형 150ms | `refs/states/services-accordion-*` |
| 사진 등장 | 40×40 캔버스 흐림 → img opacity 0→1 약 450ms | 평균색 바탕 → img opacity 500ms | inlineStyles `img.opacity-0` |
| 하위 페이지 사진 패럴랙스 | 캔버스가 사진 칸보다 크고 스크롤에 따라 이동(services 히어로 캔버스 y431 h900, 칸 y616) | img 를 240px 크게 두고 ±120px 이동 | rects 실측 |
| 꼬리말 | 고정 뒤판, 본문이 위로 걷히며 드러남. 글자 타자, 이메일 밑줄 scaleX 0→1 | 같음(밑줄 1200ms) | `refs/states/footer-reveal-*` |
| 연락처 사진 | 끌어서 넘김, 카운터 `1/3` hover 때 보임 | 끌기 · 클릭 · ←/→, 800ms | `refs/states/contact-slider-*` |

**모션 비교표**(`refs/motion-compare.html`): 원본 서명 7종(opacity 500 · opacity 100 · 햄버거 transform 500 · background-color 300 · color 300 · `::before` transform 300) 모두 모작에 있다. **빨간 줄(원본에만 있는 모션) 0건.** 첫 비교에서 빨간 줄 1건(햄버거 글자색 300ms: 로드 직후 기본색 → 히어로 흰색)이 나와 옮겼다(헤더 색 변수를 로드 다음 프레임에 넣어 같은 전환이 일어나게).
파란 줄(모작에만): 히어로 사진 교차 · 확대(영상 대역), 인트로 transform(원본은 GSAP 인라인이라 표의 다른 칸에 잡힘), 알약 opacity.

옮기지 못한 것:
- 원본 **영상 내용**(히어로 · 메뉴). 원본 영상을 쓰지 않는 규칙이라 사진으로 대신했다.
- 40×40 캔버스 흐림 자리(blur-up). 평균색 바탕으로 대신했다.
- 원본 페이지 간 클라이언트 전환(Next.js). 모작은 보통 페이지 이동 + `main` 상승으로 비슷하게만 했다.
- 원본 "Automotive Group" 줄이 처음에 아래에서 올라오는 464ms 이동(`div.relative translate(0,100%)→0`)은 타자 등장과 겹쳐 따로 만들지 않았다.

`prefers-reduced-motion`: 인트로 · 타자 · 패럴랙스 · 사진 교차를 끄고(히어로는 멈춤 상태로 시작) 전환 시간을 0 으로. Playwright `reducedMotion:'reduce'` 로 확인.

## 8. 기능 목록

| 기능 | 원본 | 모작 동작 | 확인 |
|---|---|---|---|
| 메뉴 덮개 | 햄버거 → 위에서 내려옴, ✕ 로 닫힘, Esc 닫힘, 배경 스크롤 잠금(`body overflow hidden`), `aria-expanded` | 같음 + 포커스를 닫기 버튼으로, Tab 순환, 닫으면 원래 포커스, `inert` | PASS |
| 메뉴 hover 사진 | 링크마다 사진 | 같음 | PASS |
| 상단 메뉴 hover · 현재 점 | 다른 항목 .5, 점 이동, 현재 페이지 점 | 같음(`aria-current="page"`) | PASS |
| Contact 알약 | 스크롤하면 나타남(로드 후 opacity .03→1) | 스크롤 40px 넘으면 | PASS |
| 히어로 Unmute | 영상 소리 | Pause/Play(`aria-pressed`) — 1절 이유 | PASS |
| 사진 넘김 | 클릭하면 다음 사진, 커서 미리보기 | 클릭 · Enter/Space, 커서 미리보기, `aria-label` "n of 4" | PASS |
| 마크 목록 | 스크롤 따라 켜짐 + hover, 홈은 1–9번이 /services 링크(10–12 는 글자) | 같음 | PASS (스크롤 0/300/600/900/1200 → 1·5·8·11·11. 원본 1·5·7·10) |
| 아코디언 | 여러 개 동시 열림, hover 다른 행 .5. 원본은 `aria-expanded` 없음 | 같음 + `aria-expanded` · `aria-controls` · region | PASS |
| 연락처 사진 넘김 | 끌기, 카운터 | 끌기 · 클릭 · ←/→, 카운터 `aria-live` | PASS |
| 팀 hover | 이름 hover → 사진, 다른 행 .25, 오른쪽 점 | 같음 + 포커스로도 | PASS |
| 채용 행 | mailto 링크, hover 다른 행 .25 + ↗ | 같음 | PASS |
| 꼬리말 이메일 | 브라우저 기본 검증 말풍선(`required`, type=email) | 막고 문구 표시: 빈 값 "Enter your email address." · 형식 "Check the email format…" · 통과 "Demo form — nothing was sent." (`aria-invalid`, `role=status`) | PASS |
| 페이지 이동 | 내비 5 + 로고 + Privacy | 같음, file:// 도 | PASS |
| 390px 메뉴 | 열림 · 닫힘 · 잠금 | 같음 | PASS |

검증 방법: **Playwright MCP 가 이 세션에 없어서 Playwright 라이브러리 스크립트로 실제 마우스 클릭 · hover · 끌기 · 휠 · 키 입력을 보내 확인했다**(39항목 PASS, 페이지 오류 0). 스크립트는 작업 폴더 밖(스크래치패드)에 두고 커밋하지 않는다. 처음 돌렸을 때 걸린 것: 히어로 Pause 버튼을 글자 층이 덮어 클릭이 안 됨 → z-index, favicon 404 콘솔 오류 → 인라인 아이콘, 메뉴를 열 때 첫 링크에 포커스가 가며 나머지가 흐려짐 → 포커스를 닫기 버튼으로.

## 9. 섹션 순서

- **홈**: 상단 → 히어로(사진 교차 · h1 · 설명 · Our story · Pause) → 인증 문단 → 사진 넘김 → 마크(머리줄 · 12 이름 · 사각 사진) → Full service(검정: 라벨 · 큰 문단 · Our services 6) → 꼬리말
- **services**: 하위 히어로 → What we repair → Services 아코디언 6 → 사진 → 마크 → Measured twice, signed once(사진 위 h2 · 설명) → How we work → The KVR method 아코디언 4 → 사진 → 꼬리말
- **partners**: 하위 히어로 → Manufacturer approvals → Vallour 블록(상자 · 소개 · 행 3) → Velacor 블록 → 꼬리말(검정)
- **about**: 하위 히어로 → A family workshop → Our story(3문단) → The people behind KVR → Executive team(사진 · 6명) → 꼬리말(검정)
- **contact**: 하위 히어로 → Enquiries 표 4 → Visit us → KVR Studio(주소 · 사진 3 · 소개 · 전문분야 5) → KVR HQ(사진 4 · 전문분야 4) → 꼬리말(검정)
- **careers**: 큰 문단 → Open positions 4 → 사진 → 꼬리말(흰)
- **privacy-policy**: 제목 → Policy(소제목 7 · 문단) → 꼬리말(검정)
- 메뉴 덮개 · 고정 알약/햄버거는 모든 페이지 공통. 원본처럼 섹션 제목 h1 이 여러 개인 것은 `verify-site`(h1 1개) 때문에 h2 로 바꿨다(보기는 같은 62px)

## 10. 사진

`node scripts/fetch-stock.mjs … --w 1600` 로 Unsplash 무료분에서만 받았다(14 검색어, 결과는 전부 Unsplash). Pinterest 는 쓰지 않았다. 원본 묶음은 `refs/photo-raw/`(gitignore), 쓴 사진 40장은 긴 변 1600(전면) · 640/900(작은 칸), JPEG 70–72% 로 줄여 `assets/stock/`(약 2.6MB). 출처 `credits.json`.
- 고른 기준: 원본 자리 명도에 맞춤(히어로·검정 섹션 → 어두운 실루엣·도장 부스, 메뉴 → 밝은 도장 작업 세로 사진, 마크 → 차체 부분 클로즈업, 연락 → 검은 건물 외벽, 응접실 → 어두운 라운지).
- 버린 사진(**다른 브랜드 로고·글자**): PORSCHE 글자가 보이는 도장 부스 차 뒷면, GT4 글자, 대리점 간판 글자가 보이는 진열장, 번호판·삼각별이 보이는 주차 타워, 엠블럼이 보이는 스티어링 휠 6장, 휠 센터 로고(BBS · 말) 2장, Camaro · Aston Martin 앞모습 2장, 글자가 큰 작업복 사진.
- 도구가 명도를 재지만 원본 자리 명도는 캡처와 나란히 놓고 눈으로 맞췄다.

## 11. 커밋 전 게이트

| 검사 | 결과 |
|---|---|
| `node scripts/verify-site.mjs http://127.0.0.1:4442/` | 8개 주소 "문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개" (1440 · 768 · 390) |
| `npx --yes impeccable@4.7.0 detect index.html */index.html` | 0건(`--json` 결과 `[]`). 처음 178건: `buried-raster` 85(겹친 사진의 opacity 0 → 겹쳐 쌓고 위 사진만 fadein 애니메이션, 미리보기·팀 사진은 clip-path 로 숨김, img 의 로드 전 숨김은 JS 가 붙이는 `.wait` 로), `tight-leading` 79(20px 1.2→1.3, 여러 줄 라벨 1→1.3), `all-caps-body` 4(대문자 라벨 80자 넘던 문장을 80자 안으로 줄임), `kicker-above-heading` 2(라벨 아래 큰 문단을 h2→p), `low-contrast` 2(꺼진 마크 .1→.44), `cramped-padding` 5(파트너 상자 안쪽 24, 첫 표 행 선 처리, 섹션 아래 여백 위치), `flat-type-hierarchy` 1(개인정보 소제목 h2 → p). 설정으로 끈 규칙 없음 |
| `node scripts/check-korean.mjs works/2026-W44/clone-10-esr-bespoke` | 한국어 있는 페이지 0개 / 전체 7개 — 해당 없음 |

## 12. 못 한 것 · 원본과 다른 것

- 원본 영상 3개의 움직임 자체(히어로 · 메뉴 · services). 사진 교차로 대신했다. services 영상은 원본에서도 404 라 내용을 모른다.
- 40×40 캔버스 흐림 자리 → 평균색 바탕.
- 페이지 간 전환은 원본(Next.js 클라이언트 이동)과 다르다.
- 대비 때문에 꺼진 마크·메뉴 글자 .1→.44, 꼬리말 흐린 글자 .5→.6, 본문 행간 1.2→1.3(5절·3절).
- 원본은 섹션 제목에 h1 을 여러 번 쓴다. 모작은 h2.
- 원본 모바일은 390px 홈·메뉴 캡처만 봤다. 하위 페이지 모바일 배치는 원본 CSS `downMd:` 클래스(1단 · 18px 여백 · 글자 크기)를 보고 만든 것이다.
- 서체는 상용(FK Grotesk · norm Regular)이라 Google Fonts 대체.
