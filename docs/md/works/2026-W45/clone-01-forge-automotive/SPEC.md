# SPEC: Forge Automotive 모작 → Quench Automotive

## 출처

- **원본 URL**: https://forgeautomotive.co.uk/
- **어워드**: Awwwards Site of the Day · **2026-10-25** · SOTD 7.24/10 (Design 7.16 · Usability 7.09 · Creativity 7.47 · Content 7.50) + **Developer Award 7.51/10** (Semantics/SEO 7.40 · Animations/Transitions 7.60 · Accessibility 7.40 · WPO 7.80 · Responsive 7.40 · Markup/Meta 7.40)
- **어워드 링크**: https://www.awwwards.com/sites/forge-automotive (2026-11-04 WebFetch 로 읽음. awwwards.com 은 curl·Chrome 접속이 막혀 캡처는 없다)
- 크레딧: **12 Studio** (PRO) · Joe Ben Taylor · Adam Roberts. 태그 Business & Corporate · Luxury · Animation · Infinite Scroll · Parallax · Scrolling · Transitions · Storytelling. 기술 WebGL · GSAP · Next.js. 어워드 팔레트 `#0C0C0C` · `#410306`
- 어워드 설명(요약): 차체·실내·휠·조명·배기·PPF 로 맞춤 차량을 만드는 영국의 퍼포먼스 아틀리에. 심사 하이라이트: Pointlight Fake 3D(꼬리말) · Clip-Path Menu Transition(메뉴) · 404 WebGL exhaust fumes · Introduction Scrubbing(스크롤) · USP Section · Desktop thumbnail
- 모작 날짜: 2026-11-04 · 모작 이름: **Quench Automotive** (가상의 리즈(Leeds) 맞춤 차량 공방). 2026-11-04 웹 검색에서 같은 이름의 업체를 찾지 못했다(`"Quench Automotive" UK bespoke vehicle builds` 결과 없음). 전화는 영국 Ofcom 이 드라마용으로 비워 둔 `0113 496 0xxx`, 메일은 예약 도메인 `quench.example`.

### 대상 선정 근거 (2026-11-04)

`research/2026-W45/targets.md` 가 없어 여기 남긴다.

| 항목 | 내용 |
|---|---|
| 고른 사람 | **사용자가 최근 SOTD 목록에서 직접 골랐다(2026-11-04)** — PROTOCOL 9절 3번 확인 끝 |
| 수상 | Awwwards SOTD 2026-10-25 + Developer Award (위 링크) |
| 언어 | 영어(`lang="en-GB"`) → 영어 모작 슬롯 |
| 페이지 수(실측) | 공개 경로 **16**: `/` · `/builds/` · `/builds/fa001`·`fa002`·`fa005`~`fa010`(8) · `/stock/` · `/stock/fa003/` · `/contact/` · `/legal/` · `/sitemap/` · 404 — **멀티페이지** |
| 기능(실측) | 입장 게이트 겸 쿠키 선택(Accept/Reject → 다음부턴 Enter), 클립 메뉴 덮개(Esc·포커스), 무한 반복 목록 2, 영상 대화상자, 사양 서랍(아코디언 9), 폼 2(필수 칸이 차야 보내기 활성), 법률 탭, 다음 빌드 전환 |
| WebGL(실측) | **홈에는 캔버스가 없다**(`refs/origin/origin.md` 「캔버스도 WebGL 도 쓰지 않는다」). `/builds/`·`/stock/` 에 1440×900 WebGL 캔버스 1개 — 사진 두 장 사이를 빛줄기로 넘기는 2D 셰이더(`refs/shaders/builds-1.glsl`), 404 에 아지랑이·연기 셰이더(`refs/shaders/404-1.glsl`). 3D 모델·장면 없음 → PROTOCOL 2절 「배경 효과 정도」로 허용, 대체 방법은 7절 |
| 문서 높이(1440) | 홈 17444(19.4화면) · builds 25200 · fa001 6586 · stock 19800 · fa003 7410 · contact 7553 · legal 21354 · sitemap 1744 · 404 900 |
| 같은 업종 | W44 clone-10 이 고급 차체 수리(ESR Bespoke)였다. 이번은 같은 자동차 업종이지만 **어두운 바탕·세리프 압축체·스크롤 스크럽 연출**이라 배울 것이 다르다(ESR 은 흑백 그로테스크·흰 바탕). W44 선정 표에서 Forge 는 「WebGL」로 탈락했었는데, 이번에 실측하니 WebGL 은 목록 사진 전환과 404 에만 있고 3D 가 아니었다 |

## 근거 자료

| 자료 | 경로 |
|---|---|
| 페이지별 뷰포트 캡처(Lenis 래퍼를 900px씩, 1.8초 대기) | `refs/<home·builds·build-detail·stock·stock-detail·contact·legal·sitemap·404>/vp/vp-*.jpg` |
| 페이지별 전체(래퍼를 풀어 fullPage — 고정 구간은 첫 상태로 찍힘) | `refs/<페이지>/00-full.jpg` |
| 390px 홈 | `refs/home-390/vp/` |
| 상태별 캡처(Playwright 스크립트로 실제 클릭·hover·Esc) | `refs/states/` — 메뉴 열림 100/250/400/600/900/1500ms · 링크 hover · Esc 뒤 · 닫힘 150/400/800ms · 버튼 hover, 사양 서랍 300ms·열림·Esc 뒤, 영상 400ms·열림·Esc 뒤, 연락 카드·폼·이름 칸 포커스, 구매 폼, 법률 Privacy 탭, 목록 항목·View build hover, 404 두 장, 꼬리말 커서 왼쪽·오른쪽 |
| computed style 실측 9페이지 | `measure.json` |
| 라이브러리·전환·토큰·키프레임·스크롤 | `refs/origin/origin.md`·`origin.json`(홈), `refs/origin-builds/`, `refs/origin-404/` |
| WebGL 셰이더 원문(참고용, 모작에 쓰지 않음) | `refs/shaders/builds-0/1.glsl`, `404-0/1.glsl` |
| 모션 녹화(로드 9초 + 휠 + hover 2) | 원본 `refs/motion-origin/` · 모작 `refs/motion-mine/` · 비교 `refs/motion-compare.html` |
| 원본·모작 같은 스크롤 위치 나란히 | `refs/compare/<페이지>.jpg` (왼쪽 원본, 오른쪽 모작) |
| 모작 실측(extract-origin) | `refs/origin-mine/origin.md` |
| 모작 상태별 캡처 | `refs/mine-states/` |

### 캡처에서 막힌 것과 우회 (사실대로)

1. **입장 게이트.** 원본은 페이지를 열 때마다 검은 게이트가 덮는다(첫 방문 Accept & Enter / Reject & Enter, 쿠키 `forge_consent` 가 있으면 Enter). `capture.mjs`·`extract-origin.mjs`·`record-motion.mjs` 는 클릭을 못 해서 **스크래치패드에 복사본**을 만들어 페이지 스크립트보다 먼저 「보이는 Enter/Reject 버튼을 누르는」 작은 스크립트를 주입했다(저장소의 `scripts/` 는 고치지 않았다 — 보고에 적음).
2. **Lenis 래퍼 스크롤.** 원본은 `html,body{overflow:hidden}` 이고 `div.lenis` 안에서 스크롤한다. 같은 복사본에 `window.scrollTo`·`scrollHeight` 대신 그 래퍼의 `scrollTop`·`scrollHeight` 를 쓰는 함수를 넣었다. 그래서 extract-origin 의 「하이재킹으로 보인다」는 원본에서 사실이다(래퍼 스크롤 + Lenis 1.3.26).
3. **원본 사진이 안 뜬다.** 사진 CDN(`cdn.forgeautomotive.media`)이 이 컨테이너의 브라우저에 403(봇 확인 페이지)을 돌려줘 `ERR_BLOCKED_BY_ORB` 로 막혔다. 우회하지 않았다. 그래서 refs 의 사진 자리는 원본이 미리 넣어 둔 **40px 흐림 자리 그림(LQIP)** 로 찍혔다. 사진의 구도·명도·색은 이 흐림 그림으로 읽었고, 셰이더가 사진을 넘기는 실제 모습은 보지 못했다(셰이더 원문으로 대신 읽음). 404 사진만 다른 경로라 선명하게 찍혔다.
4. **원본 폼은 제출하지 않았다.** 실제 문의가 나갈 수 있어 포커스·마크업(`required`·`aria-disabled`)만 봤다. 원본은 필수 칸이 차기 전 보내기 버튼이 `disabled` 이고 검증 문구가 없다.

라이브러리(원본): Next.js(Turbopack) · styled-components · GSAP 3.15.0 · Lenis 1.3.26(래퍼 모드, 목록은 무한) · WebGL(목록 · 404). 페이지 간 이동은 클라이언트 라우팅 + `--page-beat-dur:1.2s` 페이드, 다음 빌드는 View Transition(`next-build-dim`/`next-build-rise`).
모작: Lenis 1.3.26(jsdelivr, **window 모드**) + 바닐라 JS + CSS. WebGL 대신 DOM 마스크·SVG 필터.

## 1. 사이트 구조

### 원본 (16경로)

```
/                 홈: 머리 문장 → 소개 단어 → 카드 확장(접근법·마크 마퀴) · 단계 3(고정) · 문장 · 서비스 6(고정 사진) · Ordinary/Ends Here · Previous Builds · Available Stock · 꼬리말
/builds/          목록(무한 반복): 머리 'Builds' + 빌드 8 (각 900, 사진 무대 WebGL)
/builds/faNNN/    상세 8: 머리(태그·이름·설명·제원 2) · 큰 사진 · 문단 · 사진 묶음 · Next Build(끝까지 내리면 다음 빌드)
/stock/           목록(무한 반복): 머리 'Stock' + 2 (1개는 Coming soon)
/stock/fa003/     상세: 같은 머리 + 가격 꼬리표 + View full specs(서랍) · 사진 묶음 5줄 · Purchase This Build 폼
/contact/         연락: 머리(고정) + 카드 4 · 마크 띠 · 폼(붉은 바탕) · 과정 3 카드 · CTA 2 · 꼬리말
/legal/           법률: 왼쪽 고정 제목(Cookies/Privacy/Terms 로 바뀜) + 탭, 오른쪽 번호 조항 8 + 18 + 14
/sitemap/         같은 틀, 묶음 4
404               사진 전면 + 아지랑이·연기 + Back home
게이트(모든 페이지 첫 진입) · 메뉴 덮개(모든 페이지)
```

내비게이션: 고정 머리 — 왼쪽 소셜 3, 가운데 로고(스크롤하면 글자가 접히고 아이콘만), 오른쪽 `Navigate ≡`. 메뉴 덮개: BUILDS · STOCK · CONTACT(140px) + Legal · Cookie Settings + 아래 줄(저작권 · Powered by · Made by). 홈 링크는 로고.

### 재현 (16페이지)

| 원본 | 모작 파일 |
|---|---|
| / | `index.html` |
| /builds/ | `builds/index.html` |
| /builds/fa001 … fa010 (8) | `builds/qa001 … qa010/index.html` (번호도 원본처럼 003·004 건너뜀) |
| /stock/ | `stock/index.html` |
| /stock/fa003/ | `stock/qa003/index.html` |
| /contact/ | `contact/index.html` |
| /legal/ | `legal/index.html` (`#cookies` `#privacy` `#terms`) |
| /sitemap/ | `sitemap/index.html` |
| 404 | `404.html` |

생성: `node build.mjs` (내용 `data.mjs`, 스타일 `src/style.css`, 동작 `src/script.js`, 사진 평균색 `src/avg.json`). 결과는 페이지마다 HTML 한 파일, CSS·JS 인라인. 링크는 `…/index.html` 로 걸어 `file://` 로도 이어진다.

### 바꾼 것 · 줄인 것

- 이름·주소·전화·메일·차종은 전부 가상. 실존 차종(Defender 110, 911 Carrera, Urus …)은 가상 제조사 Halden · Carrow · Morrow · Velde · Brandt 의 모델(Ridgeline 110, Vantor 9, Aurox …)로 바꿨다. 글자 수 대역을 맞췄다(Defender 110 → Ridgeline 110).
- 마크 마퀴의 실존 브랜드 로고 8개는 가상 제조사 이름 8개를 세리프 대문자로 썼다(로고 이미지 없음).
- 로고는 직접 그렸다: 마름모 테 아이콘 + `QUENCH` 글자(78×36 판, 원본 로고 판 크기와 같음). 메뉴 바탕 무늬도 이 마름모를 크게 겹친 SVG.
- 소셜 3개는 플랫폼 첫 화면으로 건다(가상 계정이 없으므로). 「Powered by WRPD」는 가상 브랜드라 「Site index」(사이트맵)로, 「Made by 12 Studio」는 「Sitemap」으로 바꿨다.
- 지도 링크 2개(원본 Google Maps)는 OpenStreetMap 의 도시 검색(Leeds · Knutsford)으로. 지역 이름은 Yorkshire · North West → Yorkshire · Cheshire.
- 원본 **영상**(상세 Play Video)은 쓸 수 없어 정지 사진 3장 교차 + 켄번스 + 진행 막대의 「Stills reel」로 대신했다. 버튼 이름도 Play film. 대화상자의 열고 닫기·포커스·Esc 는 원본과 같다.

## 2. 그리드 실측 (1440px)

원본 `html{font-size:62.5%}`(1rem=10px), 1600px 이상 68.75%. 토큰 `--gap-*`(0.2–12.8rem), `--space-s/m/l/xl` 4.8/6/10/12rem.

| 항목 | 원본 실측 | 모작 |
|---|---|---|
| 컬럼 | 12칸 · 여백 16(1.6rem) · 간격 32 → 칸 88, 칸 시작 x = 16+120n (136 · 256 · 376 · 496 · 736 · 856 · 976 · 1216). 글 폭 448=4칸, 328=3칸, 568=5칸 | 같음 (`.grid` · 절대 위치 값) |
| 머리 | 높이 100, 소셜 24×24 x 32/64/96 y 32, 로고 78×36 가운데 y 40, Navigate 오른쪽 32 | 같음 |
| 진행 막대 | 좌우·아래 16, 1px, 바탕 bc5 10%, 채움 scaleX | 같음 |
| 홈 머리 문장 | h1 90px, 위 173, 가운데. 설명 448폭 y 786 | 같음 |
| 단계 | 사각 448×448 x 256 세로 가운데, 글 x 856 폭 328, 판마다 900 | 같음 |
| 문장 | 글 x 136(측정 125 — 변환 중), 80px 4줄, 설명 448, 사진 328×492 x 976 | 같음 |
| 서비스 | 왼쪽 절반 질감 + 글 x 136 폭 448 아래 정렬, 오른쪽 절반 고정 사진 | 같음 |
| CTA 띠 | 900, 제목 96 가운데 아래쪽, 설명 448 | 같음 |
| 꼬리말 | 100dvh, 위 여백 112(8rem+3.2rem), 라벨 → 96px 두 줄 → 버튼, Back to top 아래 | 같음 |
| 목록 | 줄마다 900. 머리 제목 위 549, 항목 꼬리표 위 143, 제목 96 이탤릭, 설명 448 | 같음 |
| 상세 머리 | 위 232, 좌우 40, 제목 96 이탤릭, 설명 568, 제원 x 856·1216 | 같음 |
| 상세 사진 | 큰 사진 1440×900, 문단 688 가운데(24px), 묶음 2칸 668×836 · 1칸 1360×888, 간격 24, 좌우 20 | 같음 |
| 폼 구역 | 붉은 바탕, 제목 칸 2–4, 폼 칸 7–11(568), 칸 높이 48 | 같음 |
| 법률 | 제목 col 2(x 136) 고정, 본문 col 8(x 856) 448 | 같음 |
| 1023px 이하 | 1단, 여백 20, 제목 크기 축소 | 원본 390 캡처(`refs/home-390`)를 보고 같은 방향으로. 하위 페이지 모바일은 원본 CSS 미디어쿼리를 보고 추정 |

### 문서 높이 (1440, ±15% 기준)

| 페이지 | 원본 | 모작 | 차 |
|---|---:|---:|---:|
| 홈 | 17444 | 17444 | 0.0% |
| builds | 25200 | 25200 | 0.0% |
| 상세 fa001 / qa001 | 6586 | 6692 | +1.6% |
| stock | 19800 | 19800 | 0.0% |
| 상세 fa003 / qa003 | 7410 | 7526 | +1.6% |
| contact | 7553 | 7575 | +0.3% |
| legal | 21354 | 18655 | −12.6% |
| sitemap | 1744 | 1811 | +3.8% |
| 404 | 900 | 900 | 0% |

홈 섹션(extract-origin): 원본 3160 · 2700 · 900 · 5400 · 2584 · 900 · 900 · 꼬리말 900 = 모작 같은 8개 같은 높이(`refs/origin-mine/origin.md`). **3화면 넘는 섹션**(소개 3160 · 단계 2700 · 서비스 5400 · 끝 2584)이 원본에 4개 → 모작도 같은 4개를 `position:sticky` 로 고정 시퀀스로 만들었다.
legal 은 조항 글을 더미로 새로 쓰면서 원본보다 짧아 조항 간격(140)과 문단 하나씩을 더해 −12.6% 로 맞췄다.

## 3. 타이포

| 역할 | 원본(measure.json) | 모작 | 이유 |
|---|---|---|---|
| 제목 서체 | **PP Editorial New** Ultralight 200 / Ultralight Italic / Light 300 (Pangram Pangram, 상용 — woff2 name 표로 확인) | **Noto Serif Display** 가변 `wdth 70` `wght 250` (본문 24px 은 `wdth 72` `wght 300`) | 같은 문장을 겹쳐 그려 비교(스크래치패드 서체 표): Instrument Serif 는 폭은 맞지만 굵고, Newsreader·Source Serif 는 넓고, Cormorant 는 붓맛이 강했다. Noto Serif Display 의 폭 축을 70 으로 줄이니 폭·획 굵기·이탤릭 꼴이 가장 가까웠다 |
| 본문·라벨 서체 | **Geist** Sans 300/400/600 | **Albert Sans** 300/400/600 | Geist 는 impeccable `overused-font` 목록에 있다. 같은 18px 300 으로 겹쳐 보니 Albert Sans 가 줄바꿈 자리까지 같았다(Hanken 은 좁고 Onest·Manrope 는 꼴이 달랐다) |
| 머리 문장 h1 | 90px / 108 · 200 · −2px · capitalize | 같음(가변 250) | |
| 소개 · 문장 · 접근법 · 폼 제목 | 80px / 96 · −1px | 같음 | |
| 단계 · 서비스 · CTA · 꼬리말 · 목록·상세 제목 | 96px / 115.2 · −2px (목록·상세는 이탤릭) | 같음 | |
| Ordinary/Ends Here · 메뉴 · 목록 머리 · 법률 제목 · Next Build | 140px / 154 · −2px (메뉴는 대문자) | 같음 | |
| 번호(01 / 03) · 상세 문단 · 연락 카드 제목 | 24px / 28.8 · 300 · −0.5px | 같음 | |
| 본문 | 18px / 25.2(1.4) · 300 · −0.5px · bc5 80% | 같음 | |
| 작은 글(폼 설명 · 법률 조항) | 14px / 16.8(1.2) · 400 | 14px / **18.2(1.3)** | 행간을 넓혔다(읽기) |
| 라벨 · 버튼 · Navigate · 꼬리표 | 10px / 20 · 600 · 3px · 대문자 | **11px** / 20 · 600 · 3px | impeccable `undersized-ui-text`(11px 바닥). 원본보다 1px 크다 |
| 메뉴 아래 줄 | 8px | 11px | 같은 규칙 |
| 1023px 이하 | 제목 58 등 | h80 48 · h90 52 · h96 58 · h140 64 · 메뉴 72 | |

## 4. 아이콘

원본: 소셜 3(16px 판 채움), 햄버거 3줄(16×10, hover 에 가운데 줄 `scale .5 1`, 열리면 ✕), 연락 카드 아이콘 4(24px, 1.2 선), 업로드 아이콘, 셀렉트 꺾쇠, 재생 ▶, 로고(78×36: 위 아이콘 + 아래 글자, 글자는 `clipPath` 로 접힘).
모작: 전부 SVG 로 새로 그렸다. 로고 아이콘은 마름모 테(원본 산 모양과 다르게), 글자는 Albert Sans 700 `QUENCH`. 스크롤하면 글자 줄이 위로 접혀 사라지고(600ms bezzy2), 꼬리말·다음 빌드 근처에서 다시 나온다(원본과 같은 시점).

## 5. 색

| 역할 | 원본 토큰 | 모작 |
|---|---|---|
| 기본 바탕 | `--brand-bc1 #0C0C0C` | 같음 |
| 카드 바탕(서랍·과정 카드) | `--brand-bc2 #161616` | 같음 |
| 붉은 면(메뉴 · 폼 구역) | `--brand-bc3 #410306` | 같음 |
| 강조 금색(서랍 가격) | `--brand-bc4 #C5A064` | 같음 |
| 글자 | `--brand-bc5 #F2F1ED` · `#fff` | 같음 |
| 흐린 글자 | bc5 55% · 60% · 80% | 같음 |
| 선 | bc5 10% · 20% | 같음 |
| 꼬리말 · CTA · 404 | `#000` | 같음 |
| 글자 채움 붉은 끝 | 실측 RGB 약 (196,85,63) | `#c4553f` |

**원본과 다르게 한 것(대비)**: 목록에서 지금 줄이 아닌 제목·글은 원본 약 .25 → **.7 + 흐림 3px**(impeccable `low-contrast`), 글자 채움 전 흐린 글자 bc5 약 20% → **45%**(96px 큰 글자 3:1), 법률 번호 25% → 45%, 붉은 바탕 위 입력 칸 안내 글자 bc5 55% → 분홍 기 흰색 72%(`gray-on-color`), 비활성 보내기 버튼 .4 → .75.

## 6. 간격

반복 수치(원본 토큰과 같은 값만 썼다): 4 · 8 · 16(gap-sm) · 24(gap-m) · 32(gap-l) · 40(gap-xl) · 64(gap-xxl) · 96(gap-uber) · 112(꼬리말 위) · 120 · 140(조항 사이, 모작) · 160(폼 구역 위아래) · 232(상세 머리 위) · 450(법률 본문 위) · 549(목록 머리 제목 위).

## 7. 모션

이징 실측(`refs/origin/origin.md`): `cubic-bezier(.43,.195,.02,1)`(`--easing-bezzy2`) ×292, `ease-in-out` ×49, `cubic-bezier(.5,0,0,1)`(bezzy3) ×2, 지속 0.5s ×305 · 0.6s ×23 · 0.3s · 1s. 페이지 전환 1.2s `cubic-bezier(.2,.7,.2,1)`, 다음 빌드 1.2s `cubic-bezier(.7,.05,.13,1)`. 모작은 이 곡선만 썼다.

| 무엇 | 원본 실측 | 모작 | 근거 |
|---|---|---|---|
| 게이트 | 단어마다 `translate(0,12px) op 0 → 0` 스태거, 아래 선 `scaleX(0)→1` 3.3초, 버튼 등장. Enter 뒤 머리 소셜·Navigate `translate(0,-100%)→0` | 단어 12px 800ms bezzy2 40ms 간격, 선 3.2초, 버튼 1.2초 뒤, 들어가면 머리 1000ms | motion.json inlineStyles 854–6141ms |
| 머리 문장 흐려짐 | 스크롤에 따라 단어가 blur·opacity 로 사라짐 | 단어마다 30px 차이로 0→320px 동안 blur 8 · opacity 0 · scale .9 | `refs/home/vp`, 미세 스크롤 캡처 |
| 소개 단어 | 단어마다 `scale(0,0) blur(8px) op 0 → 1` (GSAP) 스크롤 스크럽 | 같은 값, 70px 간격 | inlineStyles `div translate3d scale(0,0)` |
| 카드 확장 | 판 `clip-path: inset(50%) → inset(0)`, 안쪽 `scale(1.2)→1` | 같음(스크롤 1250–2400) | inlineStyles `div.jIunOh clip inset(50%)` |
| 로고 마퀴 | `logoMarquee` 20000ms linear, 간격 102.4px | 같음(이름·시간·간격) | origin.md 애니메이션 |
| 버튼 테두리 광택 | `gradient-angle` 4500ms linear(원뿔 그라디언트 두 점, screen) 화면 안에서만 재생 | 같음(`@property --ga`) | CSS `.gjuatN > i` |
| 버튼 hover | 글자마다 `translateY(4em)` 20ms 간격 0.5s bezzy2, 글자 .6, 테두리 40% | 같음 | stateRules |
| 단계 | 사각 안 다음 사진 `inset(50%)→0`, 흐린 배경 opacity 교차, 글 판은 자연 스크롤 | 같음 | inlineStyles `picture.3a017878-9 clip` |
| 제목 글자 채움 | 흐린 글자 위로 흰색이 왼쪽부터, 앞끝이 붉음(문장은 스크롤 스크럽, 단계·서비스 제목은 들어올 때) | `background-clip:text` 그라디언트 대신 같은 글자 세 겹(흐림·흰·붉은 띠)을 `clip-path` 로 자름. 1.8s bezzy2 / 문장은 줄마다 스크럽 | impeccable `gradient-text` 를 피하려고 수단을 바꿨다. 보이는 결과는 같다 |
| 문장 | 글 `translate(0,50%)→(0,-50%)`, 사진 반대 방향 | 글 ±20%, 사진 ±30% | inlineStyles `div.d69e8bb7-1` |
| 서비스 | 오른쪽 사진 `clip inset(100% 0 0)→0` + `scale(1.2)→1`, 왼쪽 글 판 opacity 1→0 | 같음 | inlineStyles `picture.ec8dda4b-7` |
| Ordinary/Ends Here | 'Ordinary' `scale→.75 op→0`, 사진 층 `translate→-55%/-50%`, 'Ends Here' `translate(0,-50dvh) scale(.75)→0` | 같은 흐름, 사진 층 2개 속도 1.05 · .8 | inlineStyles `waffl-grid → scale(.75) op 0` |
| CTA 띠 | 배경 `-50%→50%`, 글 `0→-50%` | 배경 ±25%, 글 0→-50% | inlineStyles `div.8d5ca2ab-1/2` |
| 꼬리말 | 배경 `scale(1.5)→1 · op 0→1`, 글 16px 위로, 단어 등장 | 같음 | inlineStyles `aside.a2c8839e-1` |
| 메뉴 | 페이지 판 `clip-path inset(0%)→inset(50%)` 약 1s(256ms 에 9.8%, 820ms 에 48.9%), 붉은 바탕·링크 드러남 | 같은 clip(페이지 판이 화면 가운데로 접힘) 1s bezzy2 + 판 `scale(.86)`, 링크 아래에서 올라옴 70ms 간격 | `refs/states/menu-open-*`, Playwright rAF 기록 |
| 메뉴 hover | 다른 링크 opacity .2 | 같음 | stateRules |
| 목록 사진 전환 | WebGL: 빛줄기(폭·밝기·기울기)가 왼쪽→오른쪽으로 쓸며 다음 사진을 드러냄, 나가는 사진 확대·위로, 들어오는 사진 축소·위에서, 가운데 흰 줄 번쩍임, 커서 깊이 시차 | DOM: 들어오는 사진에 105° `mask-image` 경계를 스크롤로 이동, 빛줄기는 같은 각도의 밝은 띠(screen), 가운데 흰 가로 줄, 나가는 사진 scale 1→1.08 + 위로 3%, 들어오는 사진 1.08→1 | `refs/shaders/builds-1.glsl` (uProgress · uBeam · uPush) |
| 목록 무한 | Lenis infinite | 같은 묶음을 3번(재고 7번) 깔고 마지막 묶음에 닿으면 한 묶음만큼 즉시 되돌림 | 클릭 검증 8400→… |
| 상세 사진 | 묶음 사진 scale 1.15→1 등장, 큰 사진 시차 | 같음 | |
| 다음 빌드 | 끝까지 내리면 다음 빌드로, View Transition `next-build-dim`(op .2 · brightness 1.6 · translateY -50%) / `next-build-rise`(100%→0) 1.2s | 클릭 또는 끝에서 휠 700px 더 → 이동. 같은 키프레임을 cross-document View Transition(`pageswap`/`pagereveal` 종류 'next')로. **file:// 와 미지원 브라우저에서는 그냥 이동** | origin.md 키프레임 |
| 404 | WebGL: 배기구 둘레 아지랑이(노이즈 굴절 + 색 분리), 연기 두 겹 | SVG `feTurbulence`+`feDisplacementMap` 아지랑이(baseFrequency 6초 왕복) + 연기 층(난류 변위 + 흐림, screen) | `refs/shaders/404-1.glsl` |
| 꼬리말 점광원 | 하이라이트 이름 「Pointlight Fake 3D」. 사진이 막혀 실제 모습은 못 봄 | 커서를 따라가는 420px 점광원(soft-light) + 사진 ±2° 기울기 | 이름에서 추정 — 사실대로 적음 |

**모션 비교표**(`refs/motion-compare.html`): 원본 CSS 애니메이션 서명 2종(`logoMarquee` 20000 linear, `gradient-angle` 4500 linear) 모두 모작에 같은 이름·지속·이징으로 있다. 첫 비교에서 둘 다 빨간 줄(모작 이름이 `mq`·`ga`)이라 이름을 맞췄다. 원본의 나머지 움직임은 GSAP 인라인이라 표의 「원본 JS 인라인 스타일」 칸에 있고, 위 표처럼 CSS/JS 로 옮겼다. 파란 줄(모작만): 단어 등장·줄 등장·글자 채움·게이트 전환 — 원본은 같은 움직임을 GSAP 인라인으로 한다.

옮기지 못한 것:
- 원본 사진·영상 자체(규칙상 쓰지 않음). 영상은 정지 사진 릴로 대신.
- 목록 셰이더의 **커서 깊이 시차**(사진마다 깊이 맵 텍스처를 씀). 깊이 맵이 없어 뺐다.
- 셰이더의 색 분리(404 아지랑이 R/G/B 따로 굴절). SVG 필터는 한 번 굴절만 한다.
- 원본 페이지 사이 클라이언트 라우팅(머리·Lenis 유지). 모작은 보통 페이지 이동이고, 게이트는 세션 첫 페이지에만 나온다.
- 홈 'Ends Here' 의 사진 층은 원본에서 오려 낸 차(PNG)로 보이나 사진이 막혀 확인하지 못했다. 모작은 사각 사진 두 장을 서로 다른 속도로 올린다.

`prefers-reduced-motion`: Lenis 를 켜지 않고, 단어·줄·채움을 처음부터 보이게, 전환·마퀴·광택·아지랑이·켄번스를 끈다(Playwright `reducedMotion:'reduce'` 로 확인).

## 8. 기능 목록

| 기능 | 원본 | 모작 동작 | 확인 |
|---|---|---|---|
| 입장 게이트 겸 쿠키 선택 | 매 진입. 선택 전 Accept & Enter / Reject & Enter, 쿠키가 있으면 Enter | 세션 첫 페이지. 선택 전 두 버튼, 선택(localStorage) 뒤엔 Enter 하나. `role=dialog` `aria-modal`, Tab 순환, 스크롤 잠금 | PASS |
| 메뉴 덮개 | Navigate ↔ Close, `aria-expanded`, Esc, 바탕 스크롤 잠금(`lenis-stopped`), 포커스 | 같음 + 메뉴 안 Tab 순환, 닫으면 버튼으로 포커스, 현재 페이지 `aria-current`(메뉴 링크 흐리게 .45 — 원본에 없는 표시, CHECKLIST 「현재 페이지 표시」) | PASS |
| Cookie Settings | 메뉴 안 버튼 → 선택 화면 다시 | 같음 | PASS |
| 버튼 hover 글자 굴림 · 광택 | 모든 버튼 | 같음 | PASS |
| 목록 무한 반복 · 사진 전환 | builds · stock | 같음(DOM) | PASS |
| Coming soon 항목 | 버튼 비활성 | `aria-disabled` | 확인 |
| 상세 상단 막대 | 스크롤하면 Play Video(재고는 View full specs 도) | 같음 | PASS |
| 영상 대화상자 | 검은 덮개, 왼쪽 위 이름, ✕, Esc | 같음 + 바깥 클릭 닫힘, 일시정지(`aria-pressed`), 포커스 갇힘·복귀 | PASS |
| 사양 서랍 | 오른쪽 서랍, 섹션 아코디언, 스태거 등장, Esc | 같음(첫 섹션 열림, `aria-expanded`·`aria-controls`) + 어두운 면 클릭·✕ 닫힘 | PASS |
| 다음 빌드 | 끝에서 다음으로 | 링크 + 끝에서 더 내리기 | PASS |
| 연락 · 구매 폼 | 필수(이름·연락 방법) 차기 전 보내기 `disabled`, 검증 문구 없음 | 필수 차기 전 `aria-disabled="true"`(원본처럼 흐림), 눌러도 보내지 않고 칸마다 문구 + 첫 칸 포커스, 메일 형식 문구, 다 차면 「Demo form — nothing was sent.」. 라디오(작업장), 파일 이름 표시, 셀렉트 | PASS |
| 법률 탭 | 탭 → 해당 정책으로, 왼쪽 제목이 정책 따라 바뀜 | 같음(`aria-current`) | PASS |
| Back to top | 꼬리말·다음 빌드 | 같음 | PASS |
| 꼬리말 점광원 | 커서 | 같음(추정 구현) | PASS |
| 390px 메뉴 | 열림·닫힘·잠금 | 같음 | PASS |

검증 방법: **Playwright MCP 가 이 세션에 없어서 Playwright 라이브러리 스크립트로 실제 마우스 클릭 · hover · 휠 · 키 입력(Tab/Enter/Escape) · 파일 선택을 보내 확인했다**(59항목 PASS, 콘솔·페이지 오류 0). 스크립트는 스크래치패드에 두고 커밋하지 않는다. 결과 화면은 `refs/mine-states/`.
처음 돌렸을 때 걸린 것: 재방문 게이트에서 두 줄이 다 보임(`.row` 의 `display:flex` 가 `hidden` 을 덮음) → `[hidden]{display:none}`, 비활성 버튼은 Playwright 가 누르지 않아 사람처럼 `force` 클릭으로 바꿈.

## 9. 섹션 순서

- **홈**: 머리 문장(고정) → 소개 단어 → 카드 확장(How Each Build Is Planned · 마퀴 · 설명 · 버튼) → 단계 3(Brief · Design · Build, 사각 사진 고정) → 문장(A car is judged…) → 서비스 6(Bodywork · Interior · Wheels · Lighting · Exhaust · Film) → Standard / Stops Here → Past Builds → Cars For Sale → 꼬리말(When you are ready · Book A Consultation)
- **builds**: 머리 Builds → QA001 · 002 · 005 · 006 · 007 · 008 · 009 · 010 → (반복)
- **상세**: 꼬리표 · 이름 · 설명 · 제원 → 큰 사진 → 문단 → 사진 2·1·2·1 → Next Build
- **stock**: 머리 Stock → QA003(가격) · QA004(Coming soon) → (반복)
- **재고 상세**: 꼬리표 2 · 이름 · 설명 · Availability · View full specs → 큰 사진 → 문단 → 사진 2·1·2·1·2 → Buy This Build 폼
- **contact**: 머리(고정, 카드 4가 위로) → 마크 띠 → Describe Your Car 폼 → Three Steps 과정 → Past Builds → Cars For Sale → 꼬리말
- **legal**: Cookies 8 → Privacy 18 → Terms 14 (왼쪽 제목 고정·교체)
- **sitemap**: Pages · Builds · Stock · Legal
- **404**: 사진 · Back Home · This Page Cannot Be Found
- 원본처럼 h1 은 페이지마다 하나(원본은 홈에서 h2 가 h1 앞에 온다 — 모작은 h1 을 먼저 두고 소개 문장을 h2 로).

## 10. 사진

`node scripts/fetch-stock.mjs … --w 1600` 로 받은 Unsplash 무료분만 썼다(15 검색어 118장, 결과는 전부 Unsplash). Pinterest 는 쓰지 않았다. 원본 묶음은 `refs/photo-raw/`(gitignore), 쓴 사진 42장은 긴 변 1600(전면) · 1000–1200(칸) · 800, JPEG 55–62% 로 줄여 `assets/stock/`(약 4.2MB). 출처 `credits.json`.
- 고른 기준: 원본 자리의 흐림 그림 명도·색(어두운 무광 바탕, 붉은 차, 갈색 가죽, 어두운 지하 주차장). 목록 사진은 원본처럼 차 전체가 보이는 가로 사진.
- 버린 사진(**다른 브랜드 로고·글자**): 보닛 DEFENDER 글자 3장, 번호판·링 로고가 보이는 주차 사진 2장, 'OVERNIGHTS' 데칼 차, Jeep·GMC·Toyota 그릴 로고 4장, 스티어링 휠 엠블럼 2장, 휠 센터 문장(Porsche·Mercedes) 2장, 'HOONIGAN' 글자 사진, 'CARBO' 글자 정비소, 배기 팁 각인 2장, 엔진룸 배터리 글자 2장, 앞유리 글자 사진, 주유소 간판 사진, 번호판이 큰 꼬리말 후보(BMW) 1장.
- 원본 사진은 받지 않았고(막혀 있었다) 같은 사진을 찾지도 않았다.

## 11. 커밋 전 게이트

| 검사 | 결과 |
|---|---|
| `node scripts/verify-site.mjs http://127.0.0.1:4501/` | 36개 주소 「문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개」 (1440 · 768 · 390) |
| 404.html (링크가 없어 크롤러가 닿지 않음) | `verify-site` 에 404.html 을 기준 주소로 주면 `/404.html/` 를 찾아 실패한다. 그래서 같은 항목을 Playwright 로 직접 쟀다: 1440 · 768 · 390 모두 콘솔 오류 0 · h1 1 · 가로 넘침 0 · `href="#"` 0 |
| `npx --yes impeccable@4.7.0 detect` (16 HTML) | **21건 — 전부 원본 실측 구조**(아래). 처음 420건: `low-contrast` 148(목록 흐린 줄 .25→.7, 법률 번호 25→45%, 셀렉트 옵션 바탕), `undersized-ui-text` 123(10·8px → 11px), `gradient-text` 26(글자 채움을 세 겹 clip 으로), `cramped-padding` 17(꼬리표 안쪽 4/8, 페이지 판 바탕은 메뉴가 열린 동안만, 마크 띠 안쪽), `all-caps-body` 16(게이트 문장 93→72자), `marquee` 16→2(마퀴 규칙을 마퀴가 있는 페이지에만 넣음), `dark-glow`·`radial-halo` 16+16(빛줄기 끝 푸른 후광 → 흰 가로 줄), `kicker-above-heading` 12(Service · 01/03 · 연락 라벨 · 꼬리말 라벨을 제목 안으로), `gray-on-color` 10(붉은 바탕 안내 글자 색), `em-dash-overuse` 1(권고). 설정으로 끈 규칙 없음 |
| `node scripts/check-korean.mjs` | 화면에 한국어가 없어 돌리지 않는다(영어 사이트) |

### impeccable 예외 (원본에 실측으로 있는 구조)

| 규칙 | 건수 | 원본 근거 |
|---|---:|---|
| `italic-serif-display` | 19 (builds 16 · stock 3) | 원본 목록·상세의 차 이름이 이탤릭 세리프 표시체: `measure.json` `/builds/` 「editorial 96px 200 italic」·`/builds/fa001/` h1 「editorial 96px italic」, `refs/builds/vp/vp-01.jpg`, `refs/build-detail/vp/vp-00.jpg`. 서체 파일도 `ultralight_italic` 을 따로 싣는다(origin.json fontFiles) |
| `marquee` | 2 (홈 · 연락) | 원본 `logoMarquee` 20000ms linear 무한(`refs/origin/origin.md` 애니메이션), 홈 접근법 카드와 연락 폼 위 마크 띠(`refs/home/vp/vp-03.jpg`, `refs/contact/vp/vp-02.jpg`) |

## 12. 못 한 것 · 원본과 다른 것

- 원본 사진·영상을 볼 수 없었다(CDN 403). 구도·명도는 흐림 그림으로만 맞췄다. 그래서 「사진이 실제로 어떻게 넘어가는지」 대조는 셰이더 원문 기준이다.
- 목록 셰이더의 커서 깊이 시차, 404 색 분리, 'Ends Here' 오려 낸 차 층(7절).
- 꼬리말 「Pointlight Fake 3D」는 이름만 보고 만든 추정 구현이다.
- 대비·글자 크기 때문에 원본과 다른 값: 흐린 줄 .25→.7, 채움 전 글자 20→45%, 라벨 10→11px, 메뉴 아래 줄 8→11px, 작은 글 행간 1.2→1.3.
- 메뉴 링크의 현재 페이지 흐림(.45)은 원본에 없다(CHECKLIST 「현재 페이지 표시」 때문에 넣음).
- 원본 폼은 검증 문구가 없다. 모작은 PROTOCOL 4-5 폼 기준대로 문구를 보인다.
- 원본 모바일은 390px 홈만 캡처했다. 하위 페이지 모바일 배치는 원본 미디어쿼리(1023px)를 보고 만든 것이다.
- legal 높이 −12.6%(기준 안이지만 가장 큼).
- 게이트는 원본(매 진입)과 달리 세션 첫 페이지에만 — 원본의 클라이언트 라우팅에서는 게이트가 한 번만 나오는 것과 같은 체감을 위해.
