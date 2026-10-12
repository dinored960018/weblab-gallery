# SPEC — LPAS

## 출처

- **원본 URL**: https://lpas.com/ (영어. 캘리포니아 새크라멘토·오클랜드의 건축·인테리어 스튜디오. WordPress + GSAP ScrollTrigger + Lenis + swup)
- **어워드**: Awwwards **Site of the Day (SOTD)** · 7.24/10 · Studio Naam
- **어워드 링크**: https://www.awwwards.com/sites/lpas
- **수상일**: 2026-10-10 (수상 페이지를 헤드리스로 열어 "LPAS by Studio Naam PRO · SOTD 7.24/10 · Site of the Day - Oct 10, 2026" 문구 직접 확인. 같은 날 SOTD 목록 `awwwards.com/websites/sites_of_the_day/` 2번째 칸. 수상 페이지 Elements: Modal/Popup · Footer · Contact · Portfolio pages · Hero Image · Homepage loader · Full page menu. 태그 Architecture · Portfolio · GSAP · WordPress)
- **모작 날짜**: 2026-10-12 (영어 모작, 2026-W42 clone-02)
- **모작 브랜드명**: `KMRV` / `KMRV Architecture + Interiors` (가상 건축·인테리어 스튜디오, 워싱턴주 Spokane · 아이다호주 Boise). 웹 검색 `"KMRV" architecture interiors studio` — 일치하는 회사 없음(가장 가까운 것은 MKV Design · KVA Design, 다른 이름). 프로젝트 18개·인물 40명·의뢰처 이름은 지어낸 것. 도시는 실존 지명. 원본 이름·로고(사선 A)·문구·사진·인물 사진·실존 의뢰처는 쓰지 않았다. 로고는 가는 획 `KMRV` 를 SVG 로 직접 그렸다(사선 획은 R 다리).

### 대상 선정 — 2026-10-12 직접 열어 본 결과

Awwwards SOTD 목록(`awwwards.com/websites/sites_of_the_day/`)과 CSSDA WOTD 목록(`cssdesignawards.com/wotd-award-winners`)을 헤드리스 Chrome 으로 긁어, 10-09 이후 신규 수상작 4개와 지난 판정에 없던 후보 2개를 열었다. 후보마다 `getContext` 후킹으로 캔버스 종류, 영상 수, 내부 링크, 문서 높이를 쟀다(첫 화면 캡처 `refs/rejected/`). 10-09 이전 수상작은 W41 clone-04·06·08 SPEC 에서 판정됨 — 다시 보지 않음.

| 수상 | 사이트 | 판정 | 근거 (직접 열어서 잰 것) |
|---|---|---|---|
| **Awwwards SOTD 10-10** | **LPAS** https://lpas.com/ | **선택** | 영어. **캔버스 0 · WebGL 0**(`refs/origin.md` "캔버스도 WebGL 도 쓰지 않는다"), 영상 2(히어로 사무실 실사 영상). 화면은 건축 사진과 시장별 색 면 + 큰 타이포. 내부 페이지 **100+**(크롤 80쪽 확인): Home · Portfolio · 시장 5 · 하위 시장 4 · 프로젝트 상세 60+ · 공정 패널 25 · Latest · About · Culture · Careers · Contact. 기능: 전면 메뉴, 홈 고정 가로 카드, 헤더 시장 알약, 공정 카드 고정 가로 스크롤, 공정 슬라이드 패널(Previous·Next·Close), 포트폴리오 필터 2단 + 페이지, 팀 필터, 소식 필터 + 페이지, 상세 탭, 푸터 Our Focus 펼침, 소식 미리보기 |
| Awwwards SOTD 10-11 | NICK HO (BORING) https://nickho-motorsports.nl/ | 제외 | 수상 페이지 태그 "3D · Three.js", 360° 헬멧 3D 뷰어가 주도 + 실존 레이서 개인 사이트 |
| CSSDA WOTD 10-11 | CRISTIANA ARAÚJO https://www.cristianaaraujo.com/ | 제외 | 일러스트(벌·꽃·버섯)가 첫 화면 주도, 2d 캔버스 60×68 12개, 내부 링크 9 (`p-www_cristianaaraujo_com_.jpg`) |
| CSSDA WOTD 10-10 | WONDER VISION https://www.wonder-vision.com/ | 제외 | CGI 렌더 스튜디오 — 화면이 렌더 이미지·쇼릴 영상, 실존 브랜드(ASICS·Sprite) 작업물이 주도 (`p-www_wonder_vision_com_.jpg`) |
| CSSDA WOTD 09-30 | EASYSELLER https://www.easyseller.it/ | 제외 | 이탈리아어(`lang=it-IT`), 문서 높이 802 고정 |
| CSSDA WOTD 09-27 | VIRU https://www.virugroup.com/en/ | 제외 | 식품 회사, 영어판이나 `lang=es`, 2d 캔버스 19개, LPAS 보다 기능 적음 |

이미 모작한 곳(works/ 전부)·SANTIONI·EDOLUS·W41 탈락 후보와 겹치지 않는다. 같은 주 다른 슬롯과도 겹치지 않는다.

---

## 사이트 구조

- **원본**: Home · Portfolio(목록 3쪽) · Markets 5(Housing · Interiors · Higher Education · Civic · Commercial) · Housing 하위 4(Affordable · Student · Market Rate · Senior) · 프로젝트 상세 60+ · 공정 패널 25(`/processes/…`, swup 오버레이) · Latest(2쪽) · About · Culture · Careers · Contact.
- **모작 (35 HTML)**: Home · Portfolio · Markets 5 · 하위 4(Affordable · Student · **Multifamily** · Senior Living) · 프로젝트 18 · Latest · About · Culture · Careers · Contact · 404. `build.mjs` + `data.mjs` + `photos.mjs` 로 생성. `href="#"` 0. 링크는 전부 `<폴더>/index.html` 이라 더블클릭(file://)으로도 이어진다. 공정 패널은 원본처럼 별도 주소 대신 같은 페이지 안 대화상자로 열린다(아래 생략·대체).

```
/ (index.html)              프리로더 → 히어로 고정(100vh + 300vw): 사무실 사진 + 시장 카드 5장 가로 이동 → 소개 → A selection of our work(6) → Latest updates(6줄) → [푸터 사진] → 푸터
├─ portfolio/               배너 머리 → 시장 필터(+ Housing 하위 필터) → 카드 13건/쪽(A·B·H·A·C·H 배치) → 페이지
│   └─ <18>/                사진 머리 → Introduction|Details 탭 → 사진 묶음 → 갤러리 슬라이더 → 인용 → 사진 → Project details → Next up(다음 프로젝트) → 푸터(시장색)
├─ markets/<5>/             색 머리 + 사진 → 소개 → (공정 카드 고정 가로 스크롤 + 패널) → (전문 분야) → Highlighted projects → [푸터 사진] → 푸터
│   └─ housing/<4>/         색 머리(Back to Housing) → 소개 → 공정 → 전문 분야 2묶음 → Highlighted Projects(7) → 푸터
├─ latest/                  배너 머리 → 소개 → 필터 → 카드 16/쪽 → 페이지
├─ about/                   반반 머리 → 소개 → 사진 2 + 문단 → 팀(필터 4, 40명)
├─ culture/                 반반 머리 → 소개 → 사진 3 → 넓은 사진 → Careers 링크
├─ careers/                 반반 머리(어두움) → 사무소별 채용 목록 → 사진 3
├─ contact/                 어두운 한 화면(사무소 2 · 링크 · 사진 · 바닥줄) — 푸터 없음(원본 같음)
└─ 404.html
레이어: 헤더(로고·[시장 알약]·Menu) · 전면 메뉴 · 공정 패널
```

| 원본 | 모작 |
|---|---|
| LPAS · Sacramento · Oakland | KMRV · Spokane · Boise |
| 시장 부제 Residential Housing · Design for everyday life … | Homes for every stage · Rooms for daily use · Buildings for campus life · Buildings for public service · Space for working teams |
| 하위 시장 Market Rate Housing · Senior Housing | Multifamily Housing · Senior Living |
| 소식 = 인스타그램 글 묶음(외부 링크) | 자체 소식 20건(링크는 관련 프로젝트 상세). 분류 이름 Instagram → Studio |
| 팀 사진(흑백 인물 사진) | 회색 머리글자 판(실존 인물 얼굴 금지) |
| 소셜 링크 Instagram · Linkedin · Facebook | Journal · Studio · Jobs(내부 페이지로) |
| Website by Naam | Site by KMRV |

## 그리드

원본 실측(`refs/measure-els.json`, 뷰포트 1418·1440). 좌우 여백 50, 내용 폭 1318, 카드 4열(322) 간격 10.

| 항목 | 원본 | 모작 |
|---|---|---|
| 헤더 | 고정. 로고 60×30 (50, 35). 오른쪽 Menu 버튼 89×30 r6 `#0e0e0e`, 안쪽 라벨 44×24 r4 `#262626` + 두 줄 아이콘. 시장 페이지는 앞에 "Shift your focus" + 알약 238×29(칸 20 · 활성 130) | 같음 |
| 홈 히어로 | pin-spacer 5220(900 + 4320 = 3×1440). 카드 폭 771(53.5vw), 첫 카드 왼쪽 1240(86vw), 사진 68%, + 버튼 45 원 top 655 | `.hh` `calc(100vh + 300vw)`, 카드 53.5vw, 86vw 에서 시작, 사진 68% |
| 히어로 문구 | 라벨 14px y≈390(48.6%) · 두 번째 라벨 x360 · Scroll to explore 오른쪽 · 제목 75/75 아래 | 같음 |
| 카드 묶음 | A(큰 654×464 + 작은 322×257 ×2) · B(작은 2 + 큰) · H(전폭 1318×945 + 왼쪽 위 어두운 카드) · C(큰 2), 행 간격 50 | 같음 |
| 마켓 머리 | 색 띠 500 (라벨 y237 · 제목 75px 바닥) + 사진 | 같음, 사진 640(패럴랙스) |
| 공정 | 회색 상자 + Workflow 줄 · 왼쪽 348(라벨 28px) · Our Process 75px · 카드 353×642 간격 10 · 왼쪽 아래 Phases 목록 | 같음 |
| 소개(IntroDouble) | 라벨 줄 + h2 38/41.8 폭 1052 · 문단 2단 x448 폭 787 | 같음 |
| 전문 분야 | 왼쪽 h2 28px(폭 236) · 오른쪽 x448 굵은 머리 + 문단 | 같음 |
| 프로젝트 상세 | 머리 1100(사진 전면) · 왼쪽 View all projects · x714 28px 요약 · 바닥 위치/시장 + 56px 제목 · 상세 표 2열 388 | 같음 |
| 소식 | 4열 322, 사진 322×322(5번째 322×407), 날짜 12 · 제목 16 | 같음 |
| 팀 | 5열, 사진 261×326, 이름 16 · 직함 12 | 같음(머리글자 판) |
| 푸터 | 사진 구역 800(scale 1.4 패럴랙스) + 어두운 바닥 626(position sticky 로 아래에서 드러남) | 같음 |
| 브레이크포인트 | 1023 · 767 | 1023 · 767 |

**문서 높이** (같은 1440×900, 원본 `refs/capture-site.log` · 모작 `refs/heights.txt`)

| 페이지 | 원본 | 모작 | 차이 |
|---|---:|---:|---:|
| 홈 | 9363 | 9113 | −3% |
| Portfolio | 7044 | 6293 | −11% |
| Housing | 5646 | 5431 | −4% |
| Interiors | 8232 | 7278 | −12% |
| Affordable / Affordable | 8441 | 8224 | −3% |
| 상세 Frederic / Marlowe | 11775 | 10250 | −13% |
| Latest | 4927 | 4254 | −14% |
| About | 7979 | 7035 | −12% |
| Culture | 5026 | 4923 | −2% |
| Careers | 3737 | 3556 | −5% |
| Contact | 900 | 914 | +2% |

전부 ±15% 안. 홈 구역 수 4(히어로·소개·작업·소식) + 푸터 = 같음. 3화면 넘는 구역(히어로 고정 4320, 공정 고정)은 모작에도 있다.

## 타이포

원본: **Aeonik**(상용, 단일 서체). 모작: **Host Grotesk**(Google Fonts) — 같은 기하 그로테스크 인상, 둥근 a·g, 넓은 자폭. 굵기는 원본처럼 400 하나(라벨 일부 500·600).

| 쓰임 | 원본 px / 행간 | 모작 |
|---|---|---|
| 히어로 제목 · 페이지 제목(font-3XL) | 75 / 75 | 같음 |
| 시장 카드 이름 · 소개 제목(XXL) | 56 / 61.6 | 같음 |
| 메뉴 · 푸터 시장 링크(XL) | 50 / 55(줄 간격 62) | 같음 |
| 섹션 제목 · 공정 카드 제목(L) | 38 / 41.8 | 같음 |
| 소식 제목 · 공정 라벨(M) | 28 / 36.4 | 같음 |
| Phases 목록(SM) | 24 / 32.4 | 같음 |
| 본문 | 16 / 21.6 | 같음 |
| 라벨(S) | 14 / 18.9 | 같음 |
| 위치 · 날짜(XS) | 12 / 16.8 (날짜 600) | 같음 |

## 아이콘

화살표(12×10, 선 1) · 아래 화살표 · 위 화살표 · + (16, 선 1) · 닫기 X · 메뉴 두 줄(22×8) · 공정 카드 선 드로잉 5종(원본은 이미지 → 원·타원·사각 SVG 로 직접 그림). 전부 인라인 SVG.

## 컬러

| 역할 | 원본 | 모작 |
|---|---|---|
| 시장색 Housing · Interiors · Higher Ed · Civic · Commercial | `#625653` `#925434` `#c9d3df` `#707569` `#e3c1aa` | 같음 (밝은 두 색 위 글자는 `#262626`) |
| 어두운 바탕 · 버튼 | `#262626` · `#0e0e0e` | 같음 |
| 글 · 회색 글 | `#111111` · `#747474` · `#595656` | `#111111` · **`#6e6e6e`**(흰 위 5.1:1) · `#595656` |
| 푸터 회색 링크 | `#747474`(어두운 위 3.3:1) | **`#959595`**(5.0:1) |
| 줄 | `#d6d6d6` | `rgba(17,17,17,.16)` |
| 일반 머리 바탕 | `#e8e8e8` 근처 | `#e8e8e8` |
| 프로젝트 페이지 푸터 | 다음 프로젝트 시장색 | 시장색 30% + `#1c1c1c` (회색 글 대비 4.5:1 이상) |

## 간격

반복 수치: 10(카드 간격) · 15(라벨 아래) · 25 · 30 · 40 · 50(여백·행 간격) · 60 · 100 · 120 · 160. 이징은 원본 실측 `cubic-bezier(0,0,.13,.99)`(호버 300ms) · `cubic-bezier(.14,.83,.4,1)`(등장 1200ms).

## 모션

실측: `refs/origin.md`, `refs/motion-origin/motion.json`(애니메이션 39 · 인라인 스타일 82요소), `refs/vp/home/` 450px 걸음 20장, 상태 `refs/states/` 46장.

| 무엇 | 원본 | 모작 |
|---|---|---|
| 프리로더 | 어두운 화면에 L·P·A·S 세로로 한 글자씩(translateY 10→0, 590~1377ms 스태거) → 단어로 펼침(Listen · Plan · Analyze · Shape, 1300ms) → 가운데 사진 scale 0→1 → 좌우 단어 묶음 translate ±·scale .8·opacity 0 → 사진이 전면으로 → 히어로 | 같은 단계: K·M·R·V → Know · Model · Refine · Verify(max-width 1.3s) → 사진 330×210 → 단어 묶음 ±40vw·scale .8 → 사진 전면(1.1s `(.65,0,.35,1)`) → 페이드 .5s. 총 4.7s |
| 히어로 문구 등장 | 라벨 3 + 제목 translateY 20→0 · opacity, 약 200ms 간격 | 1s `(.14,.83,.4,1)`, 0 · .2 · .4 · .6s |
| 히어로 스크롤 | 카드 묶음 translateX 선형(≈0.93px/px, 고정 구간 86~94% 에서 끝), 카드 사진 scale 1.3→1, 카드 글 translateY 10→0, + 버튼 opacity 0→1, 본 화면 opacity 1→0(46~48%) | 같음 (`travel = clamp(p/.94)·261vw`, 본 화면 .86~.94) |
| 로고 | 스크롤하면 opacity →0 | 같음(`.scrolled [data-hide-scroll]` .3s) |
| 메뉴 | 패널 clip-path inset(0 0 100%)→0, 위 줄 scaleX(오른쪽 기준), 항목 translateY 10·opacity 스태거 | 같음(.7s · 45ms 스태거) |
| 이미지 등장 | 카드 사진 clip-path inset(40% 0 0)→0 + opacity, 1200ms `(.14,.83,.4,1)` | 같음 |
| 문단 등장 | 제목 translateY 50→0 · opacity | 같음 1.2s |
| 화살표 버튼 호버 | 원 27→37 폭 · r 13.5 · 화살표 1 오른쪽으로 빠지고 화살표 2 왼쪽에서 들어옴(지연 .3s) | 같음 |
| + 원 버튼 호버 | 배경 top 100%→0 · r 100%→25% · 색 반전 300ms `(0,0,.13,.99)`. **카드 전체 호버로도 채워짐**(data-btnhover) | 같음(`.hc:hover .hc-plus`, `.pc-b:hover`) |
| 하위 링크 호버 | 글 translateX 5px 300ms | 같음 |
| 푸터 링크 호버 | 나머지 blur(2px) 200ms | 같음 |
| 소식 줄 호버 | 사진(330×210, 모서리 사선)이 커서를 따라감 | 같음 |
| 시장 알약 호버 | 올린 칸 130px 로 펼치고 활성 칸 20px 로 접힘 | 같음(width .3s) |
| 공정 카드 | 세로 스크롤이 카드 줄을 가로로 민다(상자 고정) | 같음(데스크톱). 모바일은 화살표 버튼 |
| 푸터 | 사진 scale 1.4 패럴랙스, 어두운 바닥이 아래에서 드러남 | 같음(sticky) |
| Lenis 관성 스크롤 · swup 페이지 전환 | 있음 | **생략**(아래 생략·대체) |

### 녹화 대조 결과

`record-motion.mjs` 로 원본·모작을 같은 조건(1440×900, 로드 9초 — 원본 프리로더가 끝나고 Lenis 가 풀리는 시점 — → 휠 240px → 호버 Menu · 화살표 버튼)으로 녹화하고 `motion-compare.mjs` 로 붙였다. `refs/motion-compare.html`, 바탕화면 `더드림벤처스/모션비교/2026-10-12/모션비교-KMRV-LPAS.html`.

| 첫 대조 | 마지막 대조 |
|---|---|
| 빨강(원본에만) 8 — + 원 버튼 color 300ms · top 300ms · 역방향 219ms 6건 | **빨강 6** · 파랑(모작에만) 32 |

- 첫 대조의 빨강은 원본에서 **카드 전체에 커서가 지나가면 + 버튼이 채워지는** 동작(data-btnhover) 때문이었다. 모작에 카드 호버를 넣어 color·top 300ms 가 같아졌다.
- 남은 빨강 6 은 전부 같은 전환의 **역방향 219ms** — 채움 도중 커서가 카드를 벗어나 Chrome 이 되돌림을 경과분(73%)만큼 줄인 것. 같은 CSS(300ms `(0,0,.13,.99)`)라 커서 타이밍에 달렸고, 모작 녹화에서는 채움이 끝난 뒤 벗어났다.
- 파랑 32 는 원본이 GSAP 인라인 스타일로 움직인 것(프리로더 글자·사진, 히어로 문구, 카드 글, 문단 등장)을 CSS 전환으로 옮긴 것.

## 기능 목록

| 기능 | 위치 | 열기 | 닫기 | 상태 |
|---|---|---|---|---|
| 전면 메뉴 | 전 페이지 Menu | 클릭 · Enter | ESC · Close · 바깥(빈 곳) | `aria-expanded`, 배경 스크롤 잠금, 포커스 가둠·복귀, 버튼 흰색 반전 |
| 시장 알약 | 시장·하위 시장 헤더 | 호버 · 포커스 | — | 현재 시장 `aria-current` |
| 홈 시장 카드 | 홈 | 세로 스크롤 | — | 5장, 카드 호버 → + 채움, Housing 카드 하위 링크 4 |
| 소식 미리보기 | 홈 Latest updates | 줄 호버 | 벗어남 | 커서 따라감 |
| 공정 가로 스크롤 | 시장 4 · 하위 4 | 세로 스크롤 / Phases 클릭 | — | 현재 단계 표시. 모바일은 화살표(비활성 표시) |
| 공정 패널 | 공정 카드 클릭 | 클릭 · Enter | ESC · Close · 바깥 | `role=dialog` `aria-modal`, Previous · Next 순환, 포커스 가둠·복귀, 배경 스크롤 잠금 |
| 포트폴리오 필터 | Portfolio | 클릭 | — | `aria-pressed`, Housing 고르면 하위 필터 줄, 주소 `?market=&sub=` 유지 |
| 페이지 | Portfolio(13/쪽) · Latest(16/쪽) | 클릭 | — | `aria-current="page"`, 처음·끝 화살표 비활성 |
| 팀 필터 | About | 클릭 | — | All 40 · Leadership 8 · Spokane 23 · Boise 17 |
| 소식 필터 | Latest | 클릭 | — | All · Studio(원본 All · Instagram 같은 한 분류) |
| 상세 탭 | 프로젝트 | 클릭 · ←/→ | — | `role=tab` `aria-selected`, roving tabindex |
| 갤러리 슬라이더 | 프로젝트 | 화살표 · ←/→ | — | `1 / 4`, `aria-live` |
| 푸터 Our Focus | 전 페이지 | 클릭 | 다시 클릭 | `aria-expanded`, 시장 링크 5 펼침 |
| Back to top | 푸터 | 클릭 | — | 맨 위 + 로고로 포커스 |

원본에 없는 기능은 넣지 않았다. 접근성 최소선으로 더한 것: 본문 바로가기, 포커스 링(원본 실측 점선 1.5px `#625653` · 어두운 바탕 `#e3c1aa`), 메뉴·패널 포커스 가둠, `aria-*`, 키보드 탭 이동.

### 상태별 refs

원본 `refs/states/` 46장(메뉴 열림·호버·ESC, 히어로 카드·+ 호버·하위 링크 호버, 카드·소식 호버, 푸터, 시장 알약 호버, 공정 스크롤·목록·카드 호버, 패널 열림·Next·ESC, 포트폴리오 필터·2쪽·카드 호버, 팀 필터, 소식 필터·2쪽, 모바일 홈·메뉴). 모작 `refs/final/states/` 34장. 원본 대 모작 페이지 대조 `refs/cmp/*.jpg` 11장.

## 섹션 순서

- **홈**: (프리로더) → 히어로 + 시장 카드 → 소개 → A selection of our work → Latest updates → 푸터 사진 → 푸터
- **시장**: 색 머리 + 사진 → 소개 → 공정(Housing 제외) → 전문 분야(Interiors) → Highlighted projects → 푸터 사진 → 푸터
- **하위 시장**: 색 머리 → 소개 → 공정 → 전문 분야 2 → Highlighted Projects → 푸터 사진 → 푸터
- **Portfolio**: 배너 → 필터 → 카드 → 페이지 → 푸터 사진 → 푸터
- **상세**: 사진 머리 → 탭 소개 → 사진 묶음 → 전폭 사진 → 사진 3 → 슬라이더 → 인용 → 사진 2 + 글 → 전폭 사진 → 상세 표 → Next up → 푸터
- **Latest**: 배너 → 소개 → 필터 → 카드 → 페이지 → 푸터 사진 → 푸터
- **About**: 머리 → 소개 → 사진 2 + 문단 → 팀 → 푸터 사진 → 푸터
- **Culture**: 머리 → 소개 → 사진 3 → 전폭 사진 → Careers → 푸터 사진 → 푸터
- **Careers**: 머리(어두움) → 사무소별 목록 → 사진 3 → 푸터 사진 → 푸터
- **Contact**: 한 화면

## 게이트

### verify-site — **113 URL 문제 없음**

`node scripts/verify-site.mjs http://localhost:4432/` → 콘솔 에러 0 · 가로 넘침 0(1440/768/390) · `href="#"` 0 · h1 각 1개. `refs/verify.txt`.

### impeccable detect (35 HTML, 억제 없음) — `refs/detect-1.txt` 234 → `refs/detect-final.txt` 48

고친 것: low-contrast 181(푸터 회색 `#959595`, 회색 글 `#6e6e6e`, 프로젝트 푸터 시장색 혼합, 밝은 시장색 위 다음 프로젝트 카드 글 `#262626`, 하이라이트 카드 `#c4c4c4`, 팀 머리글자 `#636363`, 현재 하위 시장 표시를 opacity 대신 2px 줄), gray-on-color 12, cramped-padding 47(Menu 라벨·시장 띠·Contact 바닥줄 안쪽 여백), broken-image 1(소식 미리보기 빈 src).

남은 48 — **전부 원본 구조**, 근거:

| 규칙 | 수 | 근거 |
|---|---:|---|
| cramped-padding `mm-i` | 45 | 원본 시장 알약 칸이 패딩 없는 색 칸: `refs/measure-els.json` `/markets/interiors/` "li.marketsMenu__item [1055,40,20x21] bg#625653 p0px" (활성 칸 130×21 p0px). 20px 색 견본이라 안쪽 여백을 넣으면 색이 줄어든다. 화면 `refs/states/05c-market-menu-item-hover.jpg` |
| cramped-padding `gh` | 3 | 원본 About · Culture · Careers 머리: 오른쪽 사진이 위·아래 끝까지 닿는 반반 구성(`refs/about--/01-blockHeaderGeneral.jpg`, `refs/view/culture--.jpg`) |

### 헤드리스 클릭 테스트 — **56 / 56 통과**

`refs/tests/click-test.mjs` (CDP 실제 마우스·휠·키), 결과 `refs/tests/click-result.txt`. 프리로더 2 · 히어로 휠·로고·카드·+ 호버 4 · 메뉴 7(열기·잠금·포커스·ESC 복귀·닫기·Enter·Tab 가둠) · 소식 미리보기·화살표 호버 2 · 푸터 2 · 시장 알약 1 · 공정 고정 스크롤 4 · 패널 7(열기·포커스·Next·Previous·ESC 복귀·Close·바깥) · 하위 시장 2 · 포트폴리오 7 · 상세 탭·슬라이더·다음 6 · 소식 3 · 팀 3 · 포커스 링 1 · 모바일 4 · 오류 없음 1.

### 한국어 — 화면에 한국어 없음

`check-korean.mjs http://localhost:4432/` → 0 페이지. 한국어는 HTML 안 CSS·JS 주석에만 있다(렌더되지 않음).

## 사진

**117장 · 전부 Unsplash 무료분**(Unsplash License, Unsplash+ 아님). `credits.json` 에 원본 페이지·검색어·명도·쓰인 자리. 배정 `refs/tools/select-photos.mjs`(뺀 사진과 이유 `REJECT`).

- 후보 **329장**: Unsplash 27개 검색어 284장 + Pinterest 2개 검색어 45장(`refs/photo-raw/`, 밀착 시트 `refs/photo-review/raw-0~9.jpg` · `raw2-0~7.jpg`).
- **Pinterest 45장은 하나도 쓰지 않았다.** 건축 외관 핀(pin-apt)은 간판 글자가 깨지고(pin-apt-03·04 "KAMDIRA…") 조명이 균일한 AI 렌더로 보였고, 인테리어 핀(pin-int)은 인물 얼굴이 주인공이었다. 건축 사진은 렌더가 섞이기 쉬운 분야라 Unsplash 실사를 기본으로 했다.
- 검수: 사용 사진 전체를 3×2 밀착 시트(`refs/photo-review/used-0~19.jpg`, 잘리지 않게 contain)로 한 장씩 보고, 의심 컷은 원본 크기로 열었다. 세 차례 걸러 158장 → 137장 → 117장.

### 뺀 기준 (원본 크기 검수에서 발견한 것 포함)
- **로고·글자**: dusk-05(주유소 Shell · 마트 Waitrose 간판 · 번호판), work-04(모니터 사과 로고 · Trello 책), yard-06(분양 현수막 "Capitol Towers"), campus-01(실존 학생회관 이름 "Montview Student Union"), campus-02·06(같은 건물 이름 글자), mat-03·04·08(견본 라벨·책 표지·색상 견본첩 상표), lobby-02·08·11(LED·안내판 글자), loft-04·transit-03·08(표지판), amen-02(피아노 상표), kitchen-01·04·09(가전 상표), office-10·loft-01·05·roof-03·05(노트북·모니터 로고 위험), town-03·09(분양 간판·자동차 상표), court-10(건물 명문).
- **얼굴**: kitchen-05, model-03·06·07, lib-02·08·11, mat-10, office-03, transit-02·09(마스크 인물), work-01 등. 남은 사진의 사람은 아주 작은 뒷모습뿐(student-02 · senior-02 · work-11).
- **AI·렌더 의심**: office-01·02·04·05~09·13, amen-04·05, kitchen-06·07·10, lounge-04·06·07·12, lobby-01·12, roof-01·02·09, model-05·09, yard-09, senior-04, work-09.
- **식별 가능한 랜드마크**: civic-01(Axel Towers), civic-05·13(Getty Center), civic-02·03·04·08·09·10·14, lib-01·04·05·07·09·10, roof-06(사그라다 파밀리아), court-02~08.

## 생략·대체 (숨기지 않고 적는다)

| 원본 | 모작 | 이유 |
|---|---|---|
| 히어로 사무실 실사 영상(천창·벽화) | 같은 무드의 붉은 벽돌 사무실 사진(loft-08) 한 장 | 원본 영상은 원본 소유. 실사 사진으로 대체, 움직임 없음 |
| 공정 패널이 별도 주소(`/processes/…`) + swup 오버레이 | 같은 페이지 안 대화상자(`role=dialog`), Previous · Next 순환 | 정적 사이트에서 주소 전환 없이 같은 화면. 크기(74.3% 폭)·버튼·ESC·Close 같음 |
| swup 페이지 전환 · 페이지마다 어두운 짧은 로더 | 홈만 전체 프리로더, 나머지는 .45s 어두운 화면 페이드 | 원본도 홈 외에는 짧은 어두운 화면. 전환 애니메이션 자체는 생략 |
| Lenis 관성 스크롤 | 네이티브 스크롤 | PROTOCOL 4-5 허용. 고정 구간 길이(3×vw)는 같음 |
| 공정 카드 선 드로잉 이미지 | SVG 로 직접 그린 원·타원·사각 5종 | 원본 이미지 사용 금지 |
| 팀 흑백 인물 사진 40 | 회색 머리글자 판 | 실존 인물 얼굴 금지 |
| 소식 = 인스타그램 이미지(인물·포스터) | 건축 사진 + CSS 로 만든 남색 포스터 카드(글자·로고) | 인물 얼굴 금지, 외부 SNS 링크 대신 관련 프로젝트로 |
| 소셜 링크 3(외부) | Journal · Studio · Jobs(내부) | 실존 SNS 계정이 없음 |
| 프로젝트 상세 사진 묶음 배치가 프로젝트마다 다름 | 한 가지 배치(묶음 2 · 전폭 2 · 슬라이더 · 인용) | 18개 프로젝트를 한 틀로 생성 |
| 상세 Introduction · Details 탭 | 같은 자리 글 바꿈(Details 는 상세 표 요약) | 원본 Details 를 누른 뒤 화면은 헤드리스에서 로더에 걸려 확인하지 못했다(`refs/states/11b-*` 어두운 화면). 탭 버튼 두 개와 활성 색(검정 / `#747474`)만 실측 |
| 회색 글 `#747474` · 푸터 링크 | `#6e6e6e` · `#959595` | 대비 4.5:1 (접근성 최소선) |
