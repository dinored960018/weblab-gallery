# SPEC — Mosby's Files

## 출처

- **원본 URL**: https://www.mosbyfiles.com/
- **어워드**: Awwwards **Site of the Day**
- **어워드 링크**: https://www.awwwards.com/sites/mosbys-files
- **수상일**: 2026-08-13
- **제작**: Tubik Studio (원본 푸터 서명)
- **모작 날짜**: 2026-09-30
- **모작 브랜드명**: `Tillman's Files` (가상). 원본 이름·로고·문구·사진·드로잉은 쓰지 않았다. 워드마크·서명 마크·방위표·자·컴퍼스·가위·필름 릴·도면은 전부 직접 SVG 로 그렸다.

> 원본 스택(실측, `refs/origin.md` · `refs/interaction-logs/*.json`): Nuxt 3 SPA + Storyblok, GSAP(인라인 `translate: none; rotate: none; scale: none;` 흔적, SplitText 식 `.line/.word/.char-mask/.char`), Lenis(`html.lenis`, 팝업 동안 `lenis-stopped`), GSAP Flip(`data-flip-id`, 팝업 확대), Draggable(`touch-action:none; cursor:grab`), plyr+YouTube iframe(영상 팝업), vue-pdf-embed(PDF 팝업).
> WebGL·캔버스 없음(`refs/origin.md` "화면은 전부 DOM 과 CSS"). 3D 는 CSS `perspective:3000px` + `rotateX/rotateY` 뿐 — PROTOCOL §2 3D 규칙 통과.

---

## 사이트 구조

- **페이지 수 (원본)**: 홈 · About · 건축가 케이스 8 = **10**
- **재현 페이지**: 10 전부 + 404 (`build.mjs` 가 생성). `href="#"` 0개.
- **라우팅**: 원본은 SPA 전환(홈 스택 → 케이스 폴더 회전, 케이스 → 다음 케이스, 홈 ↔ About). 모작은 **일반 링크 + 떠나는 쪽 퇴장 연출 → 도착 쪽 등장 연출**로 같은 순서를 나눠 재생한다(`sessionStorage` 로 "어디서 왔는지"를 넘김). 직접 열면 원본의 직접 로드 연출.

```
/                              홈 — 히어로 + 폴더 스택(분류 4 · 탭 8) + 푸터(방위표 7)
├─ /about/                     About — 흰 종이 패널, 사진 4장 순환, 서명, 닫기(×) → 홈
└─ /cases/<slug>/ ×8           폴더 — 이름 · 종이 시트(사진·생몰·본문) · 스크랩북 · 세로 탭 · 다음 폴더 · Next 위젯
     frank-lloyd-wright · irving-gill          (분류 1)
     frank-gehry                               (분류 2)
     louis-kahn · i-m-pei · paul-rudolph       (분류 3)
     mary-colter · louis-sullivan              (분류 4)
```

| 원본 | 모작 |
|---|---|
| Mosby's Files | Tillman's Files |
| American Modernism | Modernist America |
| Organic & Early Modernism / Expressive / Monumental Modernism / Contextual & Transitional Architecture | Early & Organic / Sculptural Form / Monumental Order / Regional & Transitional |
| 건축가 8명(실존 인물) | 같은 8명. 생몰은 공개된 사실만, 본문·메모는 직접 쓴 짧은 문장 |
| 케이스 초상 사진 | **얼굴 없는 제도 책상·손 사진** — 실존 인물 얼굴을 잘못 붙이는 위험을 피함 |
| YouTube 인터뷰 영상 | 영상 없음: 같은 팝업·플레이어 틀 안에 썸네일과 "No footage in this copy" |
| 팟캐스트 오디오 | 빌드가 만든 25 초 WAV(저음 룸톤)로 재생·진행·시간이 실제로 돈다 |
| PDF 문서 | 직접 조판한 2쪽 HTML 문서를 같은 팝업 틀(40rem, 세로 스크롤)에 |
| tubik studio 서명 | "Assembled by Tillman Desk" + 직접 그린 클립 마크 |

## 그리드

| 항목 | 원본 실측 (1440) | 모작 |
|---|---|---|
| 컨테이너 여백 | 34px (1025~1439: 32 · ≤1024: 30 · ≤768: 20 · ≤480: 18 · ≥1920: 48) | 같음 |
| 루트 글자 | 16px (1025~1439: 15 · ≤1024: 14 · ≤768: 13 · ≥1920: 18) | 같음 |
| 헤더 | 고정, 높이 60(3.75rem), `rgba(25,25,25,.8)` + blur 100, 하단선 `#fff 10%` | 같음 |
| 스택 폭 | `calc(90% - .1rem)` = 1233, x=103 | 같음 |
| 스택 그룹 | 높이 `80vh + 60·k`, 탭 행 간격 60(3.75rem), 모서리 4 | 같음 |
| 탭 | 높이 44(2.75rem), 옆 곡선 비율 1.409(62×44), 글자 26px | 같음(곡선은 직접 그린 path) |
| 케이스 폴더 | 폭 `(컨테이너-19rem)·16/20+15rem` = 1094.4, 안쪽 여백 34(왼쪽 0) | 같음 |
| 종이 시트 | 1026 폭, A4 비(210/297), 왼쪽 클립 열 5rem + 구멍 9개 | 같음 |
| 다음 폴더 | `80% - .2rem`, 높이 55vh, 위 10vh · 아래 -30vh | 같음 |
| Next 위젯 | 고정 우하단, 정보 카드 220×180 r20, 버튼 160×56 r20 `#ffe927` | 같음 |
| 브레이크포인트 | 1920 / 1440 / 1024 / 900 / 768 / 480 / 320, 가로세로비 2:1 | 1440 / 1024 / 768 / 480 |

## 타이포

| 역할 | 원본 | 대체 (Google Fonts) | 근거 |
|---|---|---|---|
| 제목·워드마크·메모 제목 | Founders Grotesk X-Condensed Bold | **Sofia Sans Extra Condensed 900** | Anton·League Gothic·Antonio·Saira XC·Big Shoulders 와 나란히 렌더해 비교(스크래치 fonts.png) — 폭·획 굵기·R 다리 모양이 가장 가까움 |
| 본문·탭 이름 | Signifier Light | **Crimson Pro 400/300** | Newsreader·Spectral·EB Garamond·Libre Caslon 비교. 날카로운 세리프, 좁은 폭 |
| 캡션·메뉴·메모 본문 | IBM Plex Mono | **IBM Plex Mono** (원본과 같음) | Google Fonts 로 원본도 같은 파일을 부름 |

| 토큰 | 값 | 1440 | 쓰는 곳 |
|---|---|---:|---|
| hero-title | `min((100vw - 2·offset)·.119, 200px)` (가로세로비 <2:1 → .105, ≤1024 .13, ≤768 .18, ≤480 .23) | 144 | 홈 h1 |
| heading-1 | `clamp(4rem, 2.25rem + 5.833vw, 7.5rem)`, 행간 .8, 대문자 | 120 | 케이스 이름 |
| heading-2 | `clamp(2.66rem, 1.49rem + 3.9vw, 5rem)` | 80 | 다음 폴더 이름 |
| heading-4 | 2rem, 행간 1 | 32 | 메모 제목 |
| par-1 | `clamp(1rem, .875rem + .417vw, 1.25rem)` 행간 1.4 | 20 | 히어로 설명 |
| par-2 | 1.125rem mono 행간 1.4 | 18 | 메모 본문 |
| caption | `clamp(.75rem, .833vw, 1rem)` mono | 12 | 분류 이름·설명, 푸터 |
| sheet-desc | 24px(1440) · 1.75vw(1025~) · 18 · 16 | 24 | 시트 본문, 첫 글자 5em 드롭캡 |
| tag | 1.625rem (≤1024 1.25rem, ≤480 15px) | 26 | 탭 |

## 아이콘

- 원본: iconify(material-symbols·mdi) + 커스텀(arrow-down 12×12 stroke). 방위표 7개는 손그림 PNG, 클립·자·컴퍼스·가위·필름 릴은 AVIF 사진.
- 모작: 전부 직접 그림 — 셰브런(12×12, stroke 1, round), 화살표(→), 닫기(×), 재생 삼각형(원 안), 종이 클립(stroke 1.4 선 한 줄 path), 방위표 7종(원 + N + 해칭 화살 — 선 굵기 1.2, 흰색), 자(눈금 SVG), 컴퍼스·가위(선화), 필름 릴(금색 원판 + 구멍 5 + 붉은 라벨), 도면(평면·입면 선화), 서명 마크.

## 컬러

원본 CSS 변수(실측) + 폴더 색(인라인 변수 실측).

| 역할 | hex | 쓰는 곳 |
|---|---|---|
| 바탕 | `#191919` | body |
| 밝은 글자 / About 종이 | `#fdfaf7` | 제목, About 패널 |
| 회색 | `#787a7f` | 히어로 설명 |
| 파랑 | `#1e4bd7` | Wright · Sullivan 탭, 분류 1 |
| 빨강 | `#d71e1e` | Gill · Colter 탭, 분류 4 |
| 초록 | `#0c7866` | Gehry, 분류 2 |
| 보라 | `#581e70` | Kahn, 분류 3 |
| 노랑 | `#ffe927` (글자 `#000`) | Pei 탭, Next 버튼 |
| 검정 | `#000000` | Rudolph |
| 시트 종이 | `#fffcf9`, 선 `#100f0a`, 클립 열 경계 `#b8b3ae` | 케이스 시트 |
| 메모 | `#de96a1` 분홍 · `#ffde7a` 노랑 · `#8eaced` 하늘 · `#79b6b2` 청록 · `#8f93f0` 라벤더 · `#79b2ef` 파랑 | 메모·오디오 카드 |
| 영상 버튼 | `#db0505` | 영상 카드 |
| 팝업 막 | `rgba(0,0,0,.85)` · 정보 상자 `#1e4bd7` r20 | 팝업 |

**대비 (WCAG 상대휘도로 계산, 탭 글자는 전부 4.5:1 이상)**:

| 글자 on 바탕 | 비 | 처리 |
|---|---:|---|
| 흰 on 파랑 `#1e4bd7` (Wright · Sullivan 탭, 분류 1, 팝업 정보) | 6.90 | 원본 색 유지 |
| 흰 on 빨강 `#d71e1e` (Gill · Colter 탭, 분류 4) | 5.13 | 원본 색 유지 |
| 흰 on 초록 `#0c7866` (Gehry 탭, 분류 2) | 5.39 | 원본 색 유지 |
| 흰 on 보라 `#581e70` (Kahn 탭, 분류 3) | 11.45 | 원본 색 유지 |
| 흰 on 검정 (Rudolph 탭) | 21.00 | |
| 검정 on 노랑 `#ffe927` (Pei 탭, Next 버튼) | 16.94 | |
| 흰 on 영상 버튼 `#db0505` | 5.20 | |
| 히어로 설명 `#787a7f` on `#191919` | 4.09 → **5.50** | `#8e9095` 로 올림 (원본보다 밝게) |
| About 서명 줄 `#b4b4b4` on `#fdfaf7` | 2.0 → **5.12** | `#6b6b6b` |
| 갤러리 캡션 (원본 opacity .6) | → **7.17** | `#555` 불투명 |
| 팝업 출처 (원본 opacity .5) | → **5.00** | opacity .8 |
| 메모 위 검정 (분홍·라벤더·청록·노랑·하늘) | 7.6~16 | |

## 간격

| 항목 | 원본 (1440×900) | 모작 |
|---|---|---|
| 히어로 | 100vh, 아래 패딩 `60·5`(가로세로비<2:1 → `60·3.5 + 20vw`), 제목–설명 간격 40(<2:1 → 20) | 같음 |
| 스택 겹침 | `margin-top: -60·4` (<2:1 → `-60·4 - sm + 60`) | 같음 |
| 문서 높이 | 홈 1404 · About 2366 · 케이스 2719~4399 | 빌드 후 대조(REVIEW) |
| 케이스 히어로 | margin-top 60, padding 60 0 | 같음 |
| 스크랩북 아래 여백 | 케이스마다 35 / 115 / 105 / 85 / 80 / 140 / 90 / 110 rem | 같음 |
| 반복 수치 | 4 · 16 · 20 · 34 · 44 · 60 · 80 | |

## 모션

토큰 — 원본 스타일시트 실측:

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `--ease` | `cubic-bezier(.33,1,.68,1)` (easeOutCubic) | 스택 그룹·표지·페이지 기울기, 헤더, 탭 호버, Next 위젯 |
| `--dur` | 0.65 s (반 = 0.325 s) | 같은 곳 |
| 로드 곡선 | power4.out ≈ `cubic-bezier(.25,1,.5,1)` | 스택 진입, 문자 등장 |
| 폴더 회전 | inOut 지수 ≈3.5 (샘플: 21% 시점 2.4%, 50% 시점 50%) | 탭 클릭 → 케이스 |

기술: **CSS 트랜지션(스택 상태) + 직접 쓴 rAF 트윈(GSAP 대체, power/inOut 곡선) + WAAPI(문자 등장)**. Lenis 는 jsDelivr 에서 같은 라이브러리를 불러 쓴다(원본과 같은 관성 스크롤·팝업 중 정지).
`prefers-reduced-motion: reduce` → 등장·퇴장·회전·기울기 트윈을 끄고 최종 상태로, 방위표 고정, Lenis 끔.

## 모션 타임라인

녹화: `refs/motion-origin/`(홈) · `refs/motion-origin-case/`(케이스) + 직접 CDP 기록 `refs/interaction-logs/*.json`(클래스·인라인 style 변화를 ms 단위로) + 프레임 띠 `refs/states/seq-*.png`. 시각은 트리거 기준 ms.

### 1. 홈 로드 (`rec-load.json`, 0 = `is-loading` 해제)

| 시각 | 요소 | from → to | 지속 · 스태거 | 이징 |
|---|---|---|---|---|
| 0 | 헤더 | translateY(-100%) → 0 | 650 | `--ease` |
| 0 | `.stack` | translateY(-50%) → 0 | ≈430 | power4.out |
| 0~ | 그룹 4개 | translateY(200%) scale(1.75) → 0 | ≈470 · 16 | power4.out |
| 390 | 제목 글자 | translateY(100%) opacity 0 → 0 / 1 (글자마다 overflow 마스크) | ≈700 · 15 | power4.out |
| 890 | 히어로 설명 | translateY(2rem) opacity 0 → 0 / 1 | ≈600 | power3.out |

### 2. 홈 호버 — 폴더 스택의 심장 (`rec-home-hover.json`, `refs/states/home-hover-*.png`)

| 상태 | 원본 클래스 변화(실측) | 결과 |
|---|---|---|
| 탭 k(그룹 g, 쪽 i) 위 | 그룹 g 표지 `is-hovered is-rotated is-unfolded`, 쪽 i `is-hovered`, **같은 그룹 앞쪽 쪽(0..i-1) `is-rotated`**, **앞 그룹(g+1..3) 전부 `is-rotated`**, 원래 펼쳐져 있던 마지막 표지 `is-unfolded` 해제 | 앞 그룹이 `rotateX(-3deg) translateZ(2px·g)` 로 눕고 높이 -1rem → 12px 내려감. 표지는 `translateY(1rem) rotateX(-3deg)` 로 앞으로 숙음. 앞쪽 쪽도 같이 숙어 i번째 쪽 탭이 드러남. 셰브런 90° → 0° |
| 쪽 오른쪽 33%(`unfold-area`) 위 | 위 + **앞 그룹 `is-unfolded`** → 높이 `80vh - sm + 60 + 60·k` | 앞 그룹이 156px 더 내려가 표지 설명(캡션) 이 보임 |
| 스택 밖 | 전부 해제, 마지막 표지만 `is-unfolded` | 초기 |
| 전환 | transform·height 0.65 s `--ease` (표지 ::after 흰 5% 막 opacity 0→1 같이) | |

### 3. 탭 클릭 → 케이스 (`rec-click-flw.json`, `states/seq-tab-click-to-case.png`)

| 시각 | 요소 | from → to | 지속 | 이징 |
|---|---|---|---|---|
| 340 | 다른 그룹 | translateY(0 → 120%) (눕힌 채) | ≈350 각, 앞 그룹부터 ≈100 간격 | power2.in |
| 340 | 같은 그룹 다른 쪽 탭 | translateY(0 → 110%) | 380 | power2.out |
| 340 | 분류 이름·설명 | opacity → 0 | 130 | – |
| 380 | 히어로 설명 | opacity 1→0, y → 2rem | 450 | power2.in |
| 480 | 히어로 제목 줄 | opacity 1→0, y → 2rem | 450 | power2.in |
| 1280 | (라우트 교체) 폴더를 스택 자리에서 `rotate(-90deg)` 로 눕힌 상태로 그림 | | | |
| 1310 | `.case-folder` | rotate(-90°)·translate(-831, 228)·크기 900×1233 → 0°·0·1094×2128 | 1430 | inOut(≈3.5) |
| 1315 | 표지 앞면 막·그림자 | opacity 1 → 0 | 480 | – |
| 1315 | 표지 | translate(-1rem) rotateY(-3°) → rotateY(-180°) | ≈1500 (1650부터 크게) | power3.inOut |
| 1580~2210 | 표지 그림자(0 0 250px 50%) | 0 → 1 → 0 | | |
| 2180 | 세로 탭 | translateY(110% → 0) | 700 | power3.out |
| 1315 | 케이스 제목 글자 | translateX(-150%) opacity 0 → 0 / 1 | ≈900 · 스태거 | power3.out |

모작: 떠나는 쪽(0~1280)은 홈에서, 도착 쪽(1310~)은 케이스에서 같은 수치로 재생. 폴더의 시작 좌표는 홈이 `sessionStorage` 에 넘긴 스택 위치에서 계산한다.

### 4. 케이스 직접 로드 (`rec-caseload.json`)

| 요소 | from → to | 지속 | 이징 |
|---|---|---|---|
| `.case-folder` | translateY(100vh - top) → 0 | ≈980 | power4.out |
| `.case-folder-sheet` | translateY(10rem) → 0 | ≈1080 | power4.out |
| 제목 글자 | translateX(-100%) opacity 0 → 0 / 1 | ≈1000 · 스태거 | power4.out |

### 5. 케이스 스크롤·호버

| 요소 | 트리거 | 동작 | 지속 · 이징 |
|---|---|---|---|
| 헤더 | 아래로 스크롤 | `is-hidden` translateY(-100%) | 325 `--ease` (보일 때 650) |
| 서브 헤더(케이스 이름 워드마크) | 헤더가 숨고 히어로를 지났을 때 | 보임 | 같음 |
| Next 위젯 | 히어로를 지나면 `is-disabled` 해제 | 아래에서 올라옴 | 429 `--ease` |
| Next 위젯 | 문서 끝 도달 `is-overscroll` | 정보 카드 높이 3.5rem·y 4.5rem, 버튼 폭 13.75rem, 안쪽 translateX(-13.75rem → 0) "Keep scrolling for the next page" | 650 `--ease` |
| 진행 막대 | 끝에서 휠 1회 | translateX(-100% → 0) 5%씩 | 500 |
| 내용 | 진행 중 | `.page-case__content` translateY(0 → -5vh) 진행률 비례 | |
| 100% 도달 | 다음 폴더 translateY(-10vh) 350, 폴더 위로 올라가며 교체 → 새 폴더 translateY(+206px → 0) ≈570, 세로 탭 translateY(100% → 0) ≈750 | power3 |
| 세로 탭(다른 쪽) | 호버 | translateY(-10px), 아래 그림자 opacity 0→1 | 325 `--ease` |
| 방위표(홈 푸터) | 포인터 이동 | 각 방위표가 포인터를 향해 회전 = `atan2(dy,dx)+45°`, 보간 | rAF |

### 6. 팝업 (`rec-case.json`, `states/seq-photo-popup.png`)

| 요소 | 동작 | 지속 · 이징 |
|---|---|---|
| 사진·스택 클릭 | 제자리에서 화면 가운데로 FLIP 확대(scale .51 → 1, 회전 → 0), 클립도 같이 커짐 | ≈700 power3.inOut |
| 막 | opacity 0 → .85 | 700 |
| 닫기 버튼 | scale .5 → 1, opacity | 325 `--ease` |
| 정보 상자 | translateY(1rem) opacity 0 → 0 | 150 `--ease` |
| 닫기(버튼·막 클릭) | 막 빠르게 사라짐(≈90), 사진이 제자리로 FLIP 복귀 | ≈680 |
| ESC | **원본은 안 닫힘(실측)** → 모작은 접근성 최소선으로 ESC 로 닫는다 | |

### 7. About (`rec-about.json`, `states/seq-about-open.png`)

| 시각 | 요소 | 동작 | 지속 |
|---|---|---|---|
| 0 | 헤더 | 숨김 | 325 |
| 360 | 히어로 제목 · (100 뒤) 설명 | translateY(0 → -50vh) | 650 power2.in |
| 360 | `.stack` | translateY(0 → 60%) scale(1 → 1.73), origin 50% 0 | 850 power2.in |
| 1207 | About 패널 | translateY(60vh → 0) opacity 0→1 | ≈1000 power3.out |
| 1207 | 갤러리 | 마스크 translateY(100% → 0), 사진 -100% → 0, 갤러리 -60vh → 0 | ≈970 |
| 1207 | 제목·본문 | opacity 0 → 1 | ≈1000 |
| 1207 | 서명 | stroke 그리기 | |
| 4150 | 갤러리 | 사진·캡션 교대(캡션 opacity 650) | 주기 ≈4.2 s |
| 닫기 | 패널 60vh 아래로 + opacity 0(≈750), 홈: 스택 60% → 0, 제목 -38vh → 0 | ≈500 / 700 |

### 녹화 대조 결과

| 대조 | 방법 | 결과 |
|---|---|---|
| 스택 호버 8탭 + 펼침 영역 + 이탈 | 같은 스크립트로 원본·모작 클래스와 그룹 높이·top·transform 행렬을 덤프 → `diff` | **완전 일치** (`refs/states/hover-states-origin.txt` = `refs/mine-states/hover-states-mine.txt`) |
| 홈 로드·스크롤·호버 | `record-motion` + `motion-compare` → `refs/motion-compare.html` | 서명 5종 전부 양쪽에 있음, 빨간 줄 0 |
| 케이스 로드·스크롤·호버 | 같음 → `refs/motion-compare-case.html` | 빨간 줄 4 — 아래 표 |
| 탭 클릭 → 폴더 회전, 사진 팝업, 오버스크롤 → 다음, About 열기·닫기 | 직접 CDP 녹화(`rec.mjs`, 브라우저가 그린 프레임 전부) 원본·모작을 **트리거 후 같은 ms** 로 나란히 | `Desktop/모션비교-MOSBYSFILES.html` = `refs/interaction-compare.html` (프레임은 `refs/interaction/`) |
| 문서 높이 (1440) | 홈 1404 / 1404 · 케이스 8개 2719·3999·3839·3519·3439·4399·3599·3919 / **8개 전부 같은 값** · About 2366 / 2187 (92%) | |

남은 빨간 줄(케이스) — 이유:

| 원본에만 있는 서명 | 이유 |
|---|---|
| `case-next-widget__action__progress` transform 500 ease ×23 | 원본은 SPA 라 페이지 로드 때 진행 막대가 -100% 로 초기화되며 트랜지션이 23번 기록된다. 모작은 같은 규칙(`.nw__prog { transition: transform .5s }`)이 있고 오버스크롤에서 실제로 돈다(`refs/mine-states/overscroll.png`, `anitest` 로 getAnimations 확인). record-motion 의 애니메이션 목록에는 모작 쪽이 잡히지 않았다 — 같은 녹화의 마지막 스크롤 프레임(`refs/motion-mine-case/frames/scroll-*` 끝)에는 'Keep scrolling' 상태와 차오른 진행 막대가 찍혀 있어 동작은 확인됨. 원인은 확정하지 못했다 |
| `case-next-widget__action` width 650 | 같은 경우. 폭 전환은 모작 CSS 에 같은 값(650, `--ease`, 10rem → 13.75rem)으로 있고 기능 테스트에서 `is-over` 확인 |
| `case-next-widget__info` background-color · color 650 | 원본은 SPA 전환 때 위젯이 다음 케이스 색으로 바뀌며 생긴 트랜지션. 모작은 페이지가 새로 뜨므로 색이 처음부터 맞다 |

## 기능 목록 — 전부 구현

| 기능 | 위치 | 어떻게 열리나 | 어떻게 닫히나 | 상태 표시 |
|---|---|---|---|---|
| 드롭다운 | 없음 | – | – | – |
| 모바일 메뉴 | 없음 (원본 390 도 About 링크 하나) | – | – | – |
| **폴더 스택 호버** | 홈 | 탭·쪽 위 포인터, 키보드 포커스 | 포인터가 나감, blur | `is-*` 클래스, 포커스 링 |
| **탭 링크** | 홈 스택 8 · 케이스 세로 탭 | 클릭/Enter | – | 현재 케이스 `aria-current` |
| 탭 | 없음 (역할은 링크) | – | – | – |
| 아코디언 | 없음 | – | – | – |
| 캐러셀 | About 갤러리 자동 교대(버튼 없음) | 자동 | – | 캡션 `is-active` |
| **팝업 — 사진** | 케이스 사진·스택 | 클릭/Enter | 닫기 버튼, 막 클릭, ESC | 포커스 이동·복귀, 스크롤 정지 |
| **팝업 — 영상** | 영상 카드·필름 릴 | 클릭/Enter | 같음 | |
| **팝업 — PDF** | PDF 카드 | 클릭/Enter | 같음 | 문서 세로 스크롤 |
| **오디오 재생** | 오디오 카드(Kahn) | 재생 버튼 | 다시 누름 | 버튼 `aria-pressed`, 파형 진행, 남은 시간 |
| **드래그** | 스크랩북 조각 전부(데스크톱) | 포인터 끌기 | 놓기 | 잡은 조각 맨 앞으로(z), `cursor: grab/grabbing`, 폴더 범위 안 |
| **Next 위젯 + 오버스크롤** | 케이스 | 끝에서 계속 스크롤 → 다음 케이스, 버튼 클릭 | – | 진행 막대, `is-overscroll` |
| **헤더 숨김/서브 헤더** | 전역 | 스크롤 방향 | | `is-hidden` |
| **About 닫기** | About | × 버튼, ESC | – | 홈으로 |
| 방위표 | 홈 푸터 | 포인터 따라 회전 | – | – |
| 필터/정렬 | 없음 | – | – | – |
| 폼 | 없음 | – | – | – |

## 섹션 순서

### 홈

| # | 섹션 | 원본 높이 | 구성 |
|---:|---|---:|---|
| 1 | 히어로 | 900 (100vh) | 헤더 · h1 한 줄 · 설명 3줄 |
| 2 | 폴더 스택 | 504 + 겹침 240 | 그룹 4(탭 2·1·3·2) · 마지막 표지 펼침(설명·방위표 7·자 눈금·©·서명) |
| | 합계 | 1404 | |

### 케이스

| # | 섹션 | 구성 |
|---:|---|---|
| 1 | 히어로 | 케이스 이름 heading-1 |
| 2 | 폴더 | 종이 시트(초상 자리 + 클립, Born/Died, 본문 2~3단락 드롭캡) + 스크랩북 3~5 묶음 + 세로 탭 |
| 3 | 다음 폴더 | 다음 케이스 색 · 이름 heading-2 |
| – | 고정 | 서브 헤더, Next 위젯 |

### About

좌(sticky): 제목 5줄 · 갤러리(4:3, 캡션) / 우: 본문 14단락 + 목록 3 · 서명.

---

## impeccable detect — 남은 22건은 원본 구조 (설정으로 숨기지 않음)

`.impeccable/` 설정 없음. 대상: HTML 11(`index` · `404` · `about` · 케이스 8) + `assets/site.css`. 출력 `refs/detect-final.txt`. **처음 239건 → 22건** (+ 권고 1건, 실패로 세지 않음).

직접 고친 내 흔적:
- `low-contrast` 52 → 0: About 패널 바탕을 형제 레이어(`about__bg`) 대신 요소 자체에(검출기가 바탕을 `#191919` 로 읽음), 도면 SVG 글자색 지정, 히어로 설명·서명·캡션 대비 올림(위 표)
- `cramped-padding` 82 → 0: 탭 가운데 띠에 .5rem 안쪽 여백(곡선 옆면을 -.5rem 겹쳐 폭은 원본과 같게), 다음 폴더·About·PDF·도면에 안쪽 여백, Next 버튼 노랑을 `::before` 로
- `organic-clip-path` 33 → 0: 찢긴 메모 가장자리를 clip-path 다각형 → **마스크 이미지**(`assets/img/torn-*.svg`). 원본도 AVIF 마스크(`--mask-1..6`)를 쓴다
- `dark-glow` 19 → 0: 커피 자국을 inset 그림자 → 테두리 + radial-gradient
- `skipped-heading` 8 → 0: 메모 제목 h3 → h2
- `clipped-overflow-container` 32 → 9: html·body·스크랩북의 `overflow-x: clip` 제거(가로 넘침은 verify-site 로 0 확인)

남은 것 — 원본 실측 근거 (`refs/origin-evidence.txt` 에 원본 규칙 원문 인용, `refs/origin.md`):

| 규칙 | 건수 | 원본 근거 |
|---|---:|---|
| clipped-overflow-container | 9 (홈 1 · 케이스 8) | 원본 `.__app, .__nuxt, .__page { overflow: clip !important; }`, `origin.md` "html overflow: clip visible". 케이스는 다음 폴더의 `margin-bottom: -30vh` 와 뒤로 넘어간 폴더 표지를, 홈은 기울어진 3D 그룹을 페이지 밖에서 자른다 |
| layout-transition | 10 (height 1 · width 1 · 케이스 8) | 원본 `.stack-group { transition: transform .65s, height .65s }` + `.is-rotated/.is-unfolded { height: … }` (`origin.md` "transform, height ×4"), `.case-next-widget__action { transition: width .65s }` 10rem → 13.75rem. 스택이 벌어지는 모션 자체가 높이 변화다 |
| buried-raster | 3 (About) | 원본 `.about-gallery img:not(:first-child) { opacity: 0 }` — 4장 교대 갤러리(`rec-about.json` 5358 ms `is-active` 교대) |
| (권고) shape-assembled-illustration | 1 | 필름 릴 SVG. 원본은 릴 사진(AVIF)이고 모작은 원본 이미지를 쓸 수 없어 직접 그림 |

---

## 사진

> 사용자 지시 원문: **"근데 이미지가 없잖아 이미지를 비슷한 무드로 픽사베이나 언스플래쉬같은곳에서 긁어오셈"** · **"감도높은 사진을 핀터레스트에서 찾아서 긁어오기"**

| | |
|---|---|
| 채택 | **85장 · 전부 Pinterest** (스톡 보조 출처는 쓰지 않음 — 흑백 건축 기록 사진 결은 Pinterest 쪽이 맞았다) |
| 후보 | **261장** 수집(검색어 20개) → **176장 제외** |
| 출처 기록 | `assets/photos/credits.json`(채택 85장: 파일·핀 이미지 주소·검색어·라이선스 미확인 표기·명도·평균색) · `credits-all.json`(후보 261장 전체 기록) |
| 원본 사진 | 한 장도 쓰지 않았다 (원본은 Storyblok 에 올린 AVIF) |
| 톤 | 원본 스크랩북 사진은 흑백 기록 사진 → 모작도 `grayscale(1)` + 테두리 3종(흰 인화지 · 검은 필름 · 테두리 없음) + 세피아 한 종 |

### 뺀 기준과 예

| 이유 | 대표 파일(제외) |
|---|---|
| **실존 인물 얼굴** (건축가 초상·인물 사진 — 잘못된 인물을 붙일 위험) | flw-01·04·09·10·11·12·15, gehry-02·03·04·08·10·14, pei-02~05·09, sullivan-04·11, desk-04·05·09·10, kahnk-06, kahne-05, flw-13(작업대 앞 인물) |
| **글자·워터마크·로고** | flw-01("Frank Lloyd"), gill-03·04(사이트 워터마크), gill-11(UI 오버레이), gehry-05·12(표지 문구), gehryb-07(서명), **gehryb-12(CC 배지 — 처음 채택했다가 확대 검수에서 발견해 교체)**, colter-14(캡션), sullivan-05(간판), sullivan-07·12(워터마크), sullb-07(엽서 문구), peil-01·14, desk-06·07, rudy-08·10·14(건물 현수막 글자) |
| **AI 렌더로 보임** | gill-10, gehry-09·11, kahn-05·07, rudolph-09·11·12, about-02·06·11·12·13, kahne-06, kahnk-10, colter-05 |
| 액자·목업 | gehryb-10·14, gehryd-09·10, rudy-09 |
| 무드·대상 불일치 | flw-16(다른 건축가 유리탑), peie-03·05~11·13·14(의사당 등 무관 건물), kahne-09~14(컬러 풍경), gill-13·15, 일러스트(desk-13, kahnk-07, rudy-13) |

### 자리별

| 자리 | 파일 | 근거 |
|---|---|---|
| 케이스 초상 자리 8 | desk-01·02·03·08·12·14·16·18 | 원본은 건축가 초상. 얼굴 없이 제도하는 손 — 이름만 실존 인물이고 사진이 그 사람이 아닐 수 있어 얼굴을 싣지 않음 |
| 스크랩북 사진·영상 썸네일 | 케이스별 7~14장 (Wright 7 · Gill 8 · Gehry 9 · Kahn 12 · Pei 11 · Rudolph 14 · Colter 11 · Sullivan 9) | 건축가 이름·대표작 검색어로 모은 풀에서 **원본 자리의 가로세로비에 가장 가까운 사진**을 차례로 배정(`build.mjs pickPhotos`). 캡션은 사진에 보이는 것만 쓰고, 건물이 확실히 알아볼 수 있을 때만 이름을 적었다(Fallingwater, Salk, Kimbell, Louvre Pyramid, Bilbao, Disney Hall, Dhaka) |
| About 갤러리 4 | about-01·04·05·09 | 원본: 흑백 콘크리트 기관 건물 4장 교대 |

---

## 기능 검증 — 자체 헤드리스 Chrome(Playwright, 공유 MCP 브라우저 미사용)으로 눌러서 확인

`refs/mine-states/ftest.txt` **40/40 PASS** — 키보드 Tab/Enter 로 탭 열기, 포커스 시 스택 상태, 호버·펼침·이탈, 방위표 회전, 헤더 숨김, About 열기·갤러리 교대·ESC/× 닫기, 사진 팝업(Enter·클릭·막 클릭·×·ESC, 포커스 가둠·복귀, 스크롤 잠금), 도면·영상·PDF 팝업, 메모 드래그·사진 드래그 시 팝업 안 열림, 서브 헤더·Next 위젯, 세로 탭 호버·이동, 오디오 재생·정지(`aria-pressed`), 끝에서 계속 스크롤 → 다음 케이스, 다음 폴더 링크, reduced-motion 즉시 이동, 390 가로 넘침 0, 콘솔 에러 0.

---

## 재현 난이도 메모

1. 스택 호버의 상태 조합 — 그룹 앞/뒤, 쪽 앞/뒤, 펼침 영역 세 축. 원본 클래스 변화를 그대로 표로 옮긴 뒤 구현(위 2절).
2. SPA 전환을 MPA 로 — 탭 클릭 퇴장(홈) + 폴더 회전 등장(케이스)을 나눠 이어 붙임.
3. 스크랩북 배치 — 원본에서 조각마다 중심·크기·회전을 폴더 폭 비율로 실측(`refs/interaction-logs/layout.json`)해 같은 자리에 내 조각을 놓음. 글 길이가 달라 메모 높이는 조금 다름.
4. 종이·메모 질감(원본 AVIF 오버레이) → 직접 만든 SVG 노이즈.

## 생략·대체 (숨기지 않고 적는다)

| 원본 | 처리 |
|---|---|
| Storyblok 콘텐츠 · 실존 인물 초상 | 직접 쓴 더미 + 얼굴 없는 사진 |
| YouTube 영상 3편 + 필름 릴 영상 | 같은 팝업 틀, 영상 없음 표기 |
| 원본 오디오(55:30) | 25 초 합성 룸톤 WAV |
| vue-pdf-embed | HTML 문서 페이지 |
| GSAP · Flip · Draggable · SplitText | 직접 쓴 rAF 트윈 · FLIP · 포인터 드래그 · 글자 분할 |
| 도면 마스크 이미지(plan.avif 등) | 직접 그린 SVG 평면·입면 |
| SPA 라우트 전환 | 퇴장/등장 나눠 재생 |
| 팝업 ESC 미지원 | ESC 로 닫힘(추가 — 접근성 최소선) |
