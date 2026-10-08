# SPEC — Safeer

## 출처

- **원본 URL**: https://safeertemplate.webflow.io/ (영어. 제작 Weabers, Webflow 여행사 템플릿)
- **어워드**: CSS Design Awards **Website of the Day (WOTD)**
- **어워드 링크**: https://www.cssdesignawards.com/sites/safeer/50189/
- **수상일**: 2026-10-01 (수상 페이지를 헤드리스로 열어 "WEBSITE OF THE DAY 2026 OCT 1" 문구 직접 확인. 같은 날 WOTD 목록 `cssdesignawards.com/wotd-award-winners` 에서도 "WOTD OCT 1 · SAFEER · 8.09" 확인)
- **모작 날짜**: 2026-10-08 (영어 모작, 2026-W41 clone-06)
- **모작 브랜드명**: `VARNELO` (가상 소규모 여행사, 리스본). 웹 검색 "Varnelo" travel tours — 일치하는 여행사·브랜드 없음(비슷한 이름은 Veloso Tours · Vevely Tour 뿐). 인물 이름(Ines Halvorsen · Tomas Rehnberg 등 후기 5명)도 지어낸 것. 지명(Namib · Lofoten · Kyoto · Dolomites · Atacama · Iceland · Madeira · Utah)은 실제 지리 이름이지만 원본 지명(Sahara · Amalfi · Santorini · Swiss Alps · Maldives · Patagonia · Dubai · Bali · AlUla)과 겹치지 않게 골랐다. 원본 이름·로고·문구·사진·인물 사진은 쓰지 않았다.

### 대상 선정 — 2026-10-08 직접 열어 본 결과

**1) Awwwards SOTD** (`awwwards.com/websites/sites_of_the_day/` 를 헤드리스 Chrome 으로 긁음). 10-07 TWKS 이후 새 SOTD 없음(10-08 미발표). 10-07~09-28 은 지난 모작 SPEC 에서 이미 판정됨(`clone-04-twks`, `clone-02-tengile`, `W40/clone-10-realevate`) — 재조사하지 않음. 그 앞 9월 수상작 7곳을 새로 열어 캔버스 종류(`getContext` 후킹)·크기·내부 링크를 쟀다.

| 수상일 | 사이트 | 판정 | 근거 (직접 열어서 잰 것) |
|---|---|---|---|
| 09-25 | THE TIE-BREAK (merci-michel) | 제외 | `webgl2` 1418×802 캔버스가 화면 전부, 내부 링크 0, 높이 802 |
| 09-22 | BLEIBTGLEICH'26 | 제외 | `webgl2` 캔버스 3개(1418×802 · 717×717), 내부 페이지 3 |
| 09-21 | GIL HUYBRECHT | 제외 | `webgl2` 1418×802 fixed 배경 + 영상, 이미지 태그 0, 내부 3 |
| 09-20 | PENSATORI IRRAZIONALI | 제외 | 3D 렌더 리본(브랜드 로고 다수)이 첫 화면 주도, `webgl` 1426×802 + `webgl2` 2개 · 영상 10 (`scratch p-pensatori.jpg`) |
| 09-18 | NOHO | 제외 | `webgl2` 650×700 2개, `.glb` 3D 모델 로드 |
| 09-16 | L.I.S.A. | 제외 | `webgl2` 1418×802 가 화면 전부, 높이 802 |
| 09-15 | ASPEN SEARCH | 제외 | `webgl2` 캔버스 5개, 내부 링크 0 |
| 09-12 | WARM & FUZZY | 제외 | 첫 화면이 3D 렌더 운동화 영상·캔버스 17개 |

**2) CSS Design Awards WOTD** (`cssdesignawards.com/wotd-award-winners`, 수상 페이지마다 "WEBSITE OF THE DAY 2026 …" 확인)

| 수상일 | 사이트 | 판정 | 근거 |
|---|---|---|---|
| 10-07 | BULLES | 제외 | 프랑스어, `webgl2` 1418×802 fixed |
| 10-06 | AGRUMEA FARM | 제외 | 영어판은 있으나 첫 화면이 잼 병 제품 렌더(실존 상표 라벨)가 주도, 2d 캔버스 10개로 병 회전 |
| 10-05 | SOBHA PRIVY COLLECTION | 제외 | 지난 판정(영상 12개 주도) |
| 10-04 | STUDIO SEITARO | 제외 | 일본어, `webgl2` 1418×802 |
| 10-03 | LA REVOLTOSA | 제외 | 스페인어, `webgl2` fixed |
| 10-02 | A24 (raviklaassens) | 제외 | `webgl2` 화면 전부, 실존 영화사 콘셉트 |
| **10-01** | **SAFEER** https://safeertemplate.webflow.io/ | **선택** | 영어. **캔버스 0 · WebGL 0 · 영상 0**(`refs/origin.md` "캔버스도 WebGL 도 쓰지 않는다"). 히어로의 3D 사진 링은 CSS `transform-style: preserve-3d` + 키프레임(`autoRun` 50s) — 2D 코드. 내부 페이지 18(+블로그 글 4): Home · About · Tour · 투어 상세 4 · 여행 상세 4 · Gallery · Blog · 글 4 · Contact · Legal · 404 · License · Changelog · Style Guide. 기능: 투어 필터 탭 4, FAQ 아코디언, 후기 슬라이더 5장, 영상 라이트박스, 갤러리 라이트박스 11, 예약 폼(검증 7칸 + select + date), 뉴스레터 폼, 모바일 메뉴, 상세 마퀴 |
| 09-30 | EASYSELLER | 쓰지 않음 | 이탈리아어 |
| 09-27 | VIRU | 쓰지 않음 | 영어 /en 16페이지·캔버스 0 이라 조건은 맞으나 쿠키 배너·lang 이 스페인어, 기능이 메뉴·필터 정도. 더 최근이고 기능이 많은 SAFEER 를 골랐다 |

이미 모작한 곳(works/ 전부)과 겹치지 않는다.

---

## 사이트 구조

- **원본 페이지 (22)**: Home · About · Tour · 투어 상세 4(Sahara · Amalfi · Santorini · Swiss Alps) · 여행 상세 4(Maldives · Patagonia · Dubai · Bali) · Gallery · Blog · 글 4 · Contact · Privacy(Legal) · 404 · License · Changelog · Style Guide.
- **모작 페이지 (23)**: 같은 22 + `404.html`(루트). `build.mjs` + `data.mjs` 로 생성. `href="#"` 0. 링크는 전부 `<폴더>/index.html` 이라 더블클릭(file://)으로도 이어진다.

```
/ (index.html)              히어로(3D 사진 링) → About → Our Tour(검정, 투어 3) → Explore Trip(여행 4) → 영상 칸(흰) → 후기 → FAQ → 푸터
├─ about/                   페이지 히어로 → Our Story(단어 스크럽 문단 + 숫자 굴림 2) → 영상 칸 → Why Choose(카드 3) → Our Journey → 후기 → FAQ
├─ tour/                    페이지 히어로 → 필터(All · Adventure · Luxury · Family) + 투어 4 → 후기
│   └─ <4>/                 히어로(제목 1줄) → Details · Schedule 6줄 · 사진 · Experience · Itinerary · Additional Info → (Our Tour) 마퀴
├─ trip/<4>/                히어로 → Details · Schedule · 사진 · Includes · Experience · Itinerary · Additional Info (마퀴 없음 — 원본 같음)
├─ gallery/                 히어로 → 사진 11장(2·1·2·1·3·2) → 후기
├─ blog/                    히어로 → 카드 2×2
│   └─ <4>/                 히어로 → Details · Highlights · Perspective · Final Thought → (Blogs) 카드 2
├─ contact/                 히어로 → 사진 + 예약 폼 → 연락 카드 3 → FAQ
├─ privacy-policy/          "Legal" 히어로 + Last Updated → Privacy Policy 6항 → Terms Of Service 5항 → Contact
├─ 404.html                 전면 사진 + 외곽선 404 + PAGE NOT FOUND + Back To Home (푸터 없음 — 원본 같음)
└─ utility-pages/license · changelog · style-guide
레이어: 모바일 메뉴 · 라이트박스(영상/사진)
```

| 원본 | 모작 |
|---|---|
| Safeer · AlUla 사막 여행(사우디) | Varnelo · 리스본의 소규모 여행사 |
| 투어: Sahara Desert Adventure(Adventure) · Amalfi Coast Yacht(Luxury) · Santorini Sunset Romance(분류 없음) · Swiss Alps Family(Family) | Namib Dune Crossing(Adventure) · Lofoten Fjord Cruise(Luxury) · Kyoto Garden Evening(분류 없음) · Dolomites Family Trail(Family) — 분류 구조 같음 |
| 여행: Maldives · Patagonia · Dubai · Bali | Atacama · Iceland · Madeira · Utah |
| 후기 인물 사진(얼굴) | 머리글자 원(얼굴 사진 금지) |
| 주소·전화·메일 | `18 Harbour Row, Lisbon` · `+351 210 000 000` · `trips@varnelo.example` |

## 그리드

원본 Webflow: `page-wrapper` 바깥 패딩 8px · 최대 1440, `padding-global` 좌우 70px, `container-large` 1280, `container-medium` 1065, 섹션 패딩 128(`--spacing-9xl` 8rem), 반경 12px(`--radius-xl`). 브레이크포인트 991 · 767 · 479.

| 항목 | 원본 (실측 `refs/measure-els.json`) | 모작 |
|---|---|---|
| 바깥 | 8px 패딩, 히어로·검정·흰 섹션 r12 | 같음 |
| 헤더 | absolute top 8, 높이 45, 좌 3링크 · 가운데 로고 280×48 노치 · 우 2링크 + Book Now, 그룹 사이 80 | 같음 (노치는 SVG 경로) |
| 홈 히어로 | 851 높이, 위 150, 제목 652 폭 · 설명 557 · 버튼 48 · 링 1262×381 | 같음 |
| 페이지 히어로 | 501, 제목 아래 88 | 같음 |
| 홈 About | 1065 컨테이너, 왼 205 · 오 812 · 간격 48, 사진 238×220 ×2(간격 16), 글 248 | 같음 |
| 투어 줄 | 3칸 405×350 간격 24, 줄 사이 24, 짝수 줄은 상세 칸이 오른쪽 | 같음 (필터 뒤 보이는 순서로 다시 계산) |
| 여행 카드 | 4칸 303, 간격 16, 높이 356(1·4) / 388(2·3) 아래 맞춤 | 같음 |
| 영상 칸 | 흰 섹션 p128, 1262×638 r12 | 같음 |
| 후기 | 1065: 왼 368×584 + 오(위 카드 + 슬라이더 432) 간격 16 | 같음 |
| FAQ | 416×527 + 658, 간격 64, 항목 간격 12 · r8 | 같음 |
| 상세 | 본문 832 가운데, 일정 줄 p24 0 + 아래 선 | 같음 |
| 갤러리 | 행 간격 24, 2칸·3칸 362 높이 | 같음 (1칸 행 533) |
| 블로그 | 2칸 623, 간격 16, 카드 p12, 사진 358 | 같음 |
| 연락 | 607+607 간격 48, 사진 597 r16, 폼 2칸 간격 16, 카드 3 | 같음 |
| 푸터 | 검정 r12 pt96, 위 2단(536 / 400), 선, 아래 저작권 + 3그룹, 큰 로고 1402×331 | 같음 |

**문서 높이** (1440, 끝까지 스크롤 후 · `refs/heights.txt`)

| 페이지 | 원본 | 모작 | 차 |
|---|---:|---:|---:|
| 홈 | 7787 | 7916 | +1.7% |
| About | 6495 | 6881 | +5.9% |
| Tour | 4289 | 4426 | +3.2% |
| 투어 상세 | 4429 | 4408 | −0.5% |
| 여행 상세 | 4013 | 3972 | −1.0% |
| Gallery | 5367 | 5498 | +2.4% |
| Blog | 2936 | 2932 | −0.1% |
| 글 | 3770 | 3415 | −9.4% |
| Contact | 3556 | 3570 | +0.4% |
| Legal | 4387 | 5013 | +14.3% |
| 404 | 818 | 818 | 0 |
| License | 2702 | 2628 | −2.7% |
| Changelog | 2172 | 2103 | −3.2% |
| Style Guide | 11591 | 10540 | −9.1% (처음 −61% → 원본 목록대로 블록을 채워 맞춤) |

전 페이지 ±15% 안. 홈 섹션 8개(원본 `refs/origin.md` 섹션 8개) = 모작 8개.

## 타이포

| 역할 | 원본 | 모작 |
|---|---|---|
| 서체 | **Saprona**(SIL OFL, Google Fonts 에 없음) | **Hanken Grotesk** 300·400·500 (Google Fonts). "Explore The Best" 90px 폭: Saprona 652 / Hanken 625 — 후보 11종(Archivo · Bricolage · Onest · Gantari · Albert Sans · Schibsted · Familjen …)을 같은 조건으로 재서 가장 가까운 것 |
| 로고 | 고전 세리프 이미지(A 변형) | Cormorant Garamond 500, 자간 .06em (직접 짠 글자 로고) |
| 크기 스케일 | 90 · 56 · 48 · 40 · 32 · 24 · 20 · 18 · 16 · 14 (`--text-8xl … --text-s`) | 같음 |
| 행간 | 1.13(제목) · 1.25(20~32) · 1.5(본문) | 1.13 · **1.3** · 1.5 (아래 게이트 — 1.25 → 1.3) |
| 자간 | 제목 −.036em, 본문 −.006em | 같음 |
| 굵기 | 제목 300, 숫자·카드 제목 400 | 같음 |
| 404 | 355px 300, 투명 + 흰 외곽선 | 같음 (`-webkit-text-stroke` 2px) |

## 아이콘

원본: Lucide + Flowbite(MIT, 원본 License 페이지 기재) — 화살표 ↗ 18px, 좌우 꺾쇠 28, 전화·시계·메일 24, 재생 13×14, 별 18~20. 모작: 같은 형태를 **직접 SVG 로 그림**(스트로크 1.5, 둥근 끝 없음). 별은 채운 다각형, 반 별은 clipPath.

## 컬러

| 토큰 | hex | 역할 | 대비 |
|---|---|---|---|
| off-white | `#F8F8F8` | 페이지 바탕, 헤더 노치 | — |
| ink (dark-900) | `#0F0A01` | 본문 글 | 18.9:1 |
| black-600 | `rgba(0,0,0,.6)` | 보조 글(카드 설명) | 합성 #636363 → 5.6:1 |
| gray-500 | `#5A5A5A` | FAQ 답·상세 본문 | 6.5:1 |
| dark | `#08070C` | 투어 섹션·푸터 바탕 | 흰 글 19.6:1 |
| white-70 | `rgba(255,255,255,.72)` | 검정 위 보조 글 | 합성 #b9b9ba → 10.6:1 |
| white-15 / black-15 | `rgba(…, .15)` | 선·테두리 | — |
| gold | `#FEBD1A` | 별점, 푸터 구독 화살표, 포커스 링 | 검정 위 12:1 |
| 별(후기) | `#F58A07` | 후기 별 | 장식 |
| 오류 | `#B3321F` | 폼 오류 글 | 흰 위 5.9:1 |

## 간격

반복 값 = 원본 spacing scale: **8 · 12 · 16 · 24 · 32 · 48 · 56 · 64 · 96 · 128**. 섹션 상하 128, 섹션 제목(부제 → h2) 16, 제목 → 내용 56, 카드 안 24, 카드 사이 16/24.

## 모션

라이브러리: 원본 Webflow IX + **GSAP · ScrollTrigger · SplitText · CustomEase**, jQuery. 네이티브 스크롤(`refs/origin.md` "네이티브로 보인다"). 모작은 라이브러리 없이 CSS 전환·키프레임 + IntersectionObserver + 스크롤 계산(`assets/site.js`).

실측 출처: `refs/origin.md`(전환 지속·이징 빈도, @keyframes, 호버), `refs/motion-origin/motion.json`(CSS 애니메이션 29건 · GSAP 인라인 77요소), `refs/probe-story.txt`(단어 스크럽), `refs/states/states.log`(마퀴 속도).

| 시점 / 트리거 | 원본 | 모작 |
|---|---|---|
| 상시 | 히어로 사진 링 14장: `rotateY(i·25.71°) translateZ(480px)`, 부모 `perspective 2500px`, 양끝 5% 마스크, **`autoRun` 50s linear** `rotateX(6deg) rotateY(0 → −360deg)` | 같음 (같은 키프레임) |
| 로드 | 제목 y40 → 0 · opacity 0 → 1 562ms, 설명 662ms(+100), 버튼 762ms(+200), 링 `y50 scale .8 → 1` 1166ms | 같음 560 · 660 · 760 · 1170ms `cubic-bezier(.25,.46,.45,.94)` |
| 스크롤 진입 | 부제 y18 → 0, 섹션 제목 **줄 단위** y25 → 0 (줄마다 0.1s), 카드·폼·푸터 칸 y40, About 블록 y24, 푸터 그룹 y50 | 같음 (줄을 데이터에서 미리 나눔) |
| 스크롤 진입 | 투어 카드 3칸 `translateY(60px) → 0` · opacity, **800ms `cubic-bezier(0.075,0.82,0.165,1)` 지연 0 · 250 · 375ms** (CSS 전환) | 같음 |
| 스크롤 진입 | 여행 카드 같은 800ms 등장 | 같음 (0.08s 차례) |
| 스크롤 진입 | 후기 아바타 x15 → 0 차례, 숫자 글 x15 | 같음 (숫자 글은 이동만 — 아래 게이트) |
| 스크롤 진입 | 푸터 사진 2장 opacity + 회전 −14° / +18°, 큰 로고 `translateY(100%) → 0` | 같음 0.9s / 1.2s |
| 스크롤 스크럽 | About 문단 단어마다 opacity 0 → 1 · y8 → 0 (스크롤 160px 에 첫 단어 .03, 320px 에 첫 6단어 .65~.93, 480px 에 전부 1) | 같음 — 문단 위가 화면 90% → 40% 구간에서 6단어 폭으로 번짐 |
| 스크롤 진입 | 숫자 굴림(0~9 띠가 세로로 굴러 멈춤, `stats-number-track`) | 같음 2s |
| 상시 | 상세 More 마퀴 왼쪽으로 약 18px/s (2초에 −108 → −145px) | 60s 에 반 바퀴(≈17px/s), 호버 시 멈춤 |
| 호버 | 메뉴 밑줄 `translate(-100%) → 0` | 같음 450ms |
| 호버 | 주 버튼 아이콘 `translateX(-8px)` **500ms `cubic-bezier(.34,1.56,.64,1)`** | 같음 |
| 호버 | 글 버튼 ↗ 가 오른쪽 위(18,−20)로 빠지고 새 ↗ 가 왼쪽 아래에서 들어옴 | 같음 450ms |
| 호버 | 후기 화살표 테두리 .15 → .6 | 같음 300ms |
| 클릭 | FAQ 높이 펼침 + 세로 막대 90° 회전(+ → −) | 같음 (grid-template-rows 0fr → 1fr 0.4s) |
| 클릭 | 후기 슬라이드 가로 이동 | 같음 0.5s |
| 클릭 | 라이트박스 페이드 | 같음 0.3s |

### 녹화 대조 결과

비교 HTML: `C:\Users\swxp\Desktop\더드림벤처스\모션비교\2026-10-08\모션비교-VARNELO.html` (같은 파일 `refs/motion-compare.html`). 홈, 로드 5s → 휠 끝까지 → 호버(메뉴 · 주 버튼 · 여행 카드). 원본 `refs/motion-origin`(669프레임) · 모작 `refs/motion-mine`(590프레임).

| 구분 | 줄 수 |
|---|---:|
| 서명 일치 | **3** — 투어 카드 800ms (원본 13 / 모작 15) · `autoRun` 50000 linear · 버튼 아이콘 500ms |
| **빨강(원본에만)** | **0** |
| 파랑(모작에만) | 19 — 원본 GSAP 가 인라인 스타일로 움직인 것(77요소)을 CSS 전환으로 옮긴 것: 등장 760 · 줄 800 · 히어로 560/660/1170 · 아바타 700 · 푸터 사진 900 · 로고 1200 · ↗ 450 · 여행 사진 확대 2000 |

## 기능 목록

| 기능 | 위치 | 열림 | 닫힘 | 상태 표시 |
|---|---|---|---|---|
| 투어 필터 탭 | Tour | 클릭 · ← → Home End | — | `role=tab` · `aria-selected` · 로빙 tabindex, 결과 수 `aria-live`, 보이는 순서대로 상세 칸 좌우 다시 배치(원본: 한 개면 상세 왼쪽) |
| FAQ 아코디언 | 홈 · About · Contact | 클릭 · Enter/Space | 다시 클릭 | `aria-expanded` · `aria-controls`, 닫힌 답 `hidden`. 여러 개 동시에 열림(원본 같음 — `refs/states/states.log` faq-after2) |
| 후기 슬라이더 | 홈 · About · Tour · Gallery | ‹ › · ← → | 끝에서 처음으로 | `aria-roledescription=carousel`, 슬라이드 `aria-hidden`, `aria-live` "Review n of 5" |
| 영상 라이트박스 | 홈 · About 영상 칸 | 클릭 · Enter | ×, ESC, 바깥 클릭 | `role=dialog` `aria-modal`, 포커스 가둠·복귀, 배경 스크롤 잠금, `<video controls>` |
| 갤러리 라이트박스 | Gallery 11장 | 클릭 · Enter | ×, ESC, 바깥 클릭 | 같음 (원본도 사진마다 따로 — 이전/다음 비활성) |
| 예약 폼 | Contact | — | — | 필수 5칸(Name · Phone · Select Tour · Travelers · Message) + Email 형식 + Phone 형식, 칸 아래 오류 글 · `aria-invalid` · `aria-describedby`, 첫 오류에 포커스, 고치는 동안 다시 검사. **전송하지 않음** |
| 구독 폼 | 푸터 전 페이지 | — | — | 빈칸 · 형식 오류 글, 정상이면 접수 문구(보내지 않음) |
| 모바일 메뉴 | ≤991 | 버거 | 버거 · ESC · 바깥 클릭 | `aria-expanded`, 배경 스크롤 잠금, 첫 링크 포커스, ESC 후 버거로 복귀 |
| 마퀴 | 투어 상세 | 상시 | 호버 시 멈춤 | 복제 줄은 `aria-hidden` · `tabindex=-1` |
| 내비 현재 페이지 | 전 페이지 | — | — | `aria-current="page"` + 밑줄 |

**원본에 없는데 넣은 것 (접근성 최소선만)**: ① 모바일 메뉴 열린 동안 배경 스크롤 잠금·ESC·바깥 클릭 닫기(원본은 메뉴 열린 채 스크롤 400px 내려감 — `refs/states/mobile.log` scroll-while-open 400) ② 라이트박스 포커스 가둠·복귀 ③ 폼 오류를 칸 아래 글자로(원본은 브라우저 기본 말풍선 `refs/states/11-contact-empty.jpg`) ④ 필터 결과 수 `aria-live`, 탭 방향키 ⑤ 건너뛰기 링크 ⑥ 현재 페이지 밑줄(원본 `w--current` 클래스는 있으나 밑줄은 안 보임 — `refs/tools/probe2.mjs` 결과) ⑦ 마퀴 호버 멈춤.

### 상태별 refs

원본 `refs/states/`: 01 투어 탭 0~3 · 02 홈 로드 · 03 메뉴 호버 · 04 버튼 호버 · 05 여행·투어 사진 호버 · 06 FAQ 1·2 열림 · 07 후기 다음 · 08 영상 라이트박스 · 09 구독 빈칸·형식 오류·완료 · 10 갤러리 라이트박스·다음 · 11 연락 폼 빈 제출 · 12 상세 마퀴 · 13 About 카드 호버 · 20~22 모바일 홈·메뉴(열림·스크롤)·투어. 페이지별 화면 `refs/vp/<페이지>/NN.jpg`, 전체 `refs/<페이지>/00-full.jpg`.
모작 `refs/final/states/`(같은 번호) · `refs/final/mobile-states/` · `refs/final/vp/` · `refs/final/mobile/`. 나란히 비교 `refs/cmp-1..3.jpg` · `refs/cmp-states-1..2.jpg`.

## 섹션 순서

- **홈**: 헤더 → 히어로(제목 · 설명 · Start Your Trip · 3D 링) → About(부제 · 4.8 별 · 아바타 / 제목 · 사진 2 · 글 · More About Us) → Our Tour(검정, 제목 + All Tours, 투어 3줄) → Explore Trip(여행 4) → 영상 칸(흰 섹션, 96% · 재생) → 후기 → FAQ → 푸터.
- **About**: 히어로 → Our Story → 영상 칸 → Why Choose Us(사진 카드 01 + 흰 카드 02·03) → Our Journey(사진 + Mission/Vision) → 후기 → FAQ.
- **Tour**: 히어로 → 필터 + 투어 4줄 → 후기.
- **투어 상세**: 히어로 → (Details) → (Schedule) → 사진 → (Experience) → (Itinerary) → (Additional Info) → (Our Tour) 마퀴. **여행 상세**: (Includes) 추가, 마퀴 없음.
- **Gallery**: 히어로 → 사진 6행 → 후기. **Blog**: 히어로 → 카드 4. **글**: 히어로 → 4블록 → (Blogs) 2.
- **Contact**: 히어로 → 사진 + 폼 → 카드 3 → FAQ. **Legal**: 히어로 → Privacy → Terms → Contact. **404**: 한 화면.
- **License**: Images(사진 2) · Typography · Icon License(아이콘 5). **Changelog**: Version 1.0 · 선 · 인용. **Style Guide**: Colors · Typography · Text Sizes · Buttons · Text Colors · Other HTML Tags · Utility Classes · Rich Text ×4.

---

## 게이트

### verify-site — **48 URL 문제 없음**
`node scripts/verify-site.mjs http://localhost:4432/` → "콘솔 에러 0, 가로 넘침 0, href=\"#\" 0, h1 전부 1개" (`refs/verify-final.txt`). 중간에 걸린 것: Tour 390px 넘침(필터 탭 줄바꿈 없음 → `flex-wrap`), 푸터 사진 390px 넘침(푸터 `overflow` 를 풀면서 생김 → 모바일 위치 조정).

### impeccable detect (파일) — 23 HTML + CSS
`refs/detect-1.txt` **122건** → `detect-2` 29 → `detect-3` 1 → `refs/detect-final.txt` **1건**. 설정·주석으로 끄지 않음.

고친 것:
- `cramped-padding` 43 → 0: FAQ 항목 패딩을 버튼에서 상자로 옮김(8/24 + 16), 히어로·404 에 안쪽 여백, About 세로 선을 `::before` 로(모바일 규칙과 충돌), 이야기 머리 아래 24
- `tight-leading` 27 → 0: 20·24·32px 행간 1.25 → 1.3, 스타일 가이드 인용 1.5
- `clipped-overflow-container` 22 → 0: 푸터 `overflow:hidden` 제거, 큰 로고 칸만 자름
- `layout-transition` 19 → 0: FAQ `height` 전환 → `grid-template-rows 0fr → 1fr`
- `low-contrast` 8 → 0: 후기 사진 카드의 흰 글 — 그라데이션을 글 상자 자체의 배경으로 옮김(실제 화면 대비도 같음)
- `skipped-heading` 2 → 0: Tour · Blog 목록 앞에 숨긴 h2

남은 것 — **원본에 실측으로 있는 구조**:

| 규칙 | 건수 | 원본 근거 |
|---|---:|---|
| `bounce-easing` `cubic-bezier(.34,1.56,.64,1)` | 1 (site.css) | 원본 주 버튼 아이콘 전환을 녹화로 잼: `div.button-primary_icon-block` transform 500ms `cubic-bezier(0.34, 1.56, 0.64, 1)` (`refs/motion-origin/motion.json` at 13432 · `refs/origin.md` easing ×4). 녹화 대조 서명 일치 항목 |

### impeccable detect (URL, 14페이지 1440×900) — `refs/detect-url-1.txt` 51 → `refs/detect-url-final.txt` 45

- `text-occlusion` 2 → **0**: 블로그 카드 날짜가 카드 전체 덮개 링크(`::after`)에 가려짐 → 사진에 따로 링크
- `low-contrast` 4 → **0**: 후기 숫자 글이 등장 전 opacity 0 에서 측정됨 → 글은 이동만 하고 투명도는 바꾸지 않음
- 남은 것(원본 구조):

| 규칙 | 건수 | 원본 근거 |
|---|---:|---|
| `buried-raster` (아래쪽 사진 opacity 0) | 26 (페이지당 2) | 원본 투어·여행 카드가 화면에 들어오기 전 `opacity 0 · translateY(60px)` 이고 들어오면 800ms 로 1 (녹화 CSS 전환 `div.tour-card…is-visible` opacity 0 → 1 13건). 모작도 들어오면 1 — 테스트 "투어 카드 스크롤 등장" |
| `line-length` ~104자 | 7 (투어·여행 상세 2+2, Legal 3) | 원본 상세 본문 폭 832px(`tour-details_wrapper` 293,637 832 · `tour-info_description` 832×72 실측), Legal 같은 832 |
| `line-length` ~133자 | 4 (글) | 원본 글 본문 1062px(`blog--how-to…/00-full.jpg` 본문 x99~1250 at 1440) |
| `line-length` ~116자 | 3 (License) | 원본 License 본문 ~1064px(`utility-pages--license/00-full.jpg` x138~1250×1.35) |
| `line-length` ~141자 | 4 (Style Guide) | 원본 스타일 가이드 블록 전폭 1280 |
| `bounce-easing` | 1 (404) | 위와 같은 원본 버튼 곡선 |

### 헤드리스 클릭 테스트 — **60 / 60 통과**
`refs/tests/click-test.mjs` (CDP 실제 마우스·키 이벤트), 결과 `refs/tests/click-result.txt`. 홈 로드·링·호버 6 · 스크롤 등장 2 · FAQ 5 · 후기 3 · 영상 라이트박스 7 · 구독 4 · 내비 이동·About 스크럽·숫자 4 · 필터 6 · 마퀴 2 · 갤러리 3 · 블로그 2 · 연락 폼 7 · 404 1 · 키보드 2 · 모바일 메뉴 6 · 스크립트 오류 0.
중간에 잡은 버그: 연락 폼 칸을 떠날 때(blur) 다시 검사하면 오류 줄이 사라지며 제출 버튼이 위로 밀려 클릭이 빗나감 → 입력하는 동안(`input`/`change`) 다시 검사로 바꿈.

---

## 사진

> 사용자 지시 원문: **"근데 이미지가 없잖아 이미지를 비슷한 무드로 픽사베이나 언스플래쉬같은곳에서 긁어오셈"** · **"감도높은 사진을 핀터레스트에서 찾아서 긁어오기"**
> 이번 작업 지시: AI 생성 이미지 엄격 배제(과포화·매끈한 질감·형태 뭉개짐·글자 깨짐·비현실 조명 중 하나라도 의심되면 쓰지 않음), 의심 계열은 Unsplash 실사 우선.

| | |
|---|---|
| 채택 | **79 파일 · 원 사진 74장 · 전부 Unsplash 무료분**(Unsplash License, Unsplash+ 제외). Pinterest 는 쓰지 않음 — 원본 템플릿 사진이 AI 생성 계열(원본 License 페이지 "Lummi Ai" 명시)이라 같은 무드를 Pinterest 에서 찾으면 생성 이미지가 섞이기 쉬워서 처음부터 Unsplash 실사로 감 |
| 후보 | 검색어 21개 → **132장**, `refs/photo-raw/` (공개 안 함) |
| 1차 검수 | 후보 전체 밀착 시트 `refs/photo-review/raw-0..5.jpg` 를 한 장씩 봄 → 20장 뺌 |
| 2차 검수 | 채택본 밀착 시트 `refs/photo-review/used-0..3.jpg` 를 다시 보고 4장 교체: 청록 하늘 HDR 과포화(홈 히어로 후보) · 진홍 과포화 사구 · 주황 필터 도로 · 붉은 과포화 바위 |
| 3차 검수(코디네이터) | gal-08(hiker-04, 눈 봉우리 앞 빨간 배낭 — 합성·편집 의심) → hiker2-05(능선 뒷모습 실사). 교토: 같은 사진이 한 페이지에 두 번(tour-kyoto-a = in = ring-10 금각사, b = hero 회랑) → 새 실사 4장으로 전부 따로(moss-04 · autumn-03 · moss-06 · moss-05), ring-10 은 다른 교토 사진(moss-02), 금각사 제거. 같은 점검에서 홈의 링 2장(ring-02 = 아타카마 여행 카드, ring-05 = 로포텐 투어 카드)도 다른 사진으로 바꿈. 후보 24장 추가(`refs/photo-review/new-0..1.jpg`) |
| 출처 기록 | `assets/photos/credits.json` — 파일 · 원 파일 · 출처 · 사진 페이지 주소 · 검색어 · 라이선스 · 명도 · 평균색. 출처 없는 사진 0. 묶음 기록 `credits.json` |
| 선택 | `refs/select-photos.mjs` (`MAP` 역할 → 원 파일, `REJECT` 뺀 이유) |
| 인물 | 얼굴이 보이는 사진 0 — 등산객은 전부 뒷모습·원경. 원본 후기·About 의 얼굴 사진 자리는 머리글자 원과 뒷모습 사진 |

### 뺀 기준

| 이유 | 예 |
|---|---|
| AI 생성·편집 의심 | dunes-08(매끈한 하늘 그라데이션) · dunes-12(과포화 단색) · canyon-08(비현실 조명) · kyoto-02(HDR) · 2차 4장 |
| 로고·상표·글자 | 신발 로고 2 · 텐트 상표 · 쿼드 상표 2 · 간판·번호판 3 · 표지판 · 등 글자 |
| 얼굴·인물 | 옆얼굴 다수 단체 · 기모노 인물 |
| 톤·형태 | 거의 검정 3 · 빈 화면 · 흑백 |

## 영상

| | |
|---|---|
| 파일 | `assets/video/desert-sunset.webm` (4.1MB, 1920×1080, 13초) |
| 출처 | Wikimedia Commons "Mojave Desert Sunset (40480403760).webm" — 원 게시 BLM California Flickr, 촬영 Kyle Sullivan(BLM) |
| 라이선스 | **Public domain** (미국 연방정부 저작물) — 출처 표시 의무 없음. CC BY 계열은 후보에서 뺌(검색 결과의 CC BY · CC BY-SA 17건 제외) |
| 확인 | Commons API `extmetadata` LicenseShortName "Public domain" 직접 조회, 라이트박스에서 재생 확인(`refs/final/states/08-video-lightbox.jpg`) |
| 비고 | Pexels · Pixabay 는 헤드리스 접근이 막힘(Cloudflare "잠시만 기다리십시오") |

## 첫 화면(갤러리 썸네일)

검은 인트로 없음. 홈은 로드 직후 사진 히어로 + 제목이 0.56~1.17초 안에 다 올라와 안정된 화면(`refs/final/vp2/home/00.jpg`).

---

## 생략·대체 (숨기지 않고 적는다)

| 원본 | 처리 |
|---|---|
| Saprona 서체 | Hanken Grotesk (폭 실측으로 고름). 줄바꿈이 다른 문단이 있다(About 문단 원본 5줄 / 모작 4줄) |
| 로고 이미지(SAFEER, A 변형) | Cormorant Garamond 글자 로고 |
| YouTube 영상 임베드(라이트박스 안 iframe) | 직접 올린 공개 저작물 `<video controls>` — 외부 플레이어 쓰지 않음 |
| 후기·About 인물 사진(얼굴) | 머리글자 원 · 뒷모습 사진 |
| GSAP SplitText 줄 나누기(실행 중 계산) | 데이터에서 줄을 미리 나눔 — 화면 폭이 바뀌어도 줄이 고정 |
| GSAP ScrollTrigger 단어 스크럽 | 스크롤 이벤트로 직접 계산(6단어 폭) |
| Webflow 슬라이더·탭·라이트박스 | 직접 구현(같은 동작) |
| 후기 숫자 글 등장(opacity + x15) | x15 이동만 — 등장 전 대비 0 이 잡혀서 |
| 행간 1.25 (20·24·32px) | 1.3 — 게이트 |
| 투어 상세 마퀴 속도(GSAP 기반, 스크롤에 따라 미세 가속) | 일정 속도 CSS 키프레임 + 호버 멈춤 |
| 모바일 메뉴 배경 스크롤(원본은 잠기지 않음) | 잠금 (PROTOCOL 4-4 기준) |
| "Made in Webflow" 배지 | 원본 호스팅 배지 — 디자인 아님, 넣지 않음 |
| 소셜 링크 4(facebook.com 등 루트) | 원본처럼 각 서비스 첫 화면으로(가상 계정 주소를 만들지 않음) |
