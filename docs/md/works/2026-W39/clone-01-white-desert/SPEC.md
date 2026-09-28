# SPEC — White Desert

## 출처

- **원본 URL**: https://white-desert.com/
- **어워드**: Awwwards **Site of the Day**
- **어워드 링크**: https://www.awwwards.com/sites/white-desert
- **제작**: Malvah (https://www.malvah.co)
- **모작 날짜**: 2026-09-22
- **업종**: 남극 럭셔리 원정 여행

---

## 사이트 구조

- **페이지 수**: **30** (내부 전부)
- **재현 범위**: **전부.** 30페이지 모두 만든다.
- **라우팅**: 일반 링크. SPA 아님.

```
/                                     홈
├─ /itineraries                       일정 목록
│   ├─ /early-emperor-penguins        · Baby Penguins & Blue Tunnels
│   ├─ /south-pole-emperor-penguins   · South Pole & Penguins
│   ├─ /south-pole-blue-rivers        · South Pole & Blue Rivers
│   ├─ /the-long-stay                 · The Long Stay
│   ├─ /antarctica-in-a-day           · Antarctica in a Day
│   └─ /discovery-week                · Discovery Week
├─ /camps                             캠프 목록
│   ├─ /whichaway-camp                · Whichaway Camp
│   ├─ /echo-base                     · Echo Base
│   └─ /explorer-camp                 · Explorer Camp
├─ /antarctica                        운영 목록
│   ├─ /behind-the-scenes             · Behind the Scenes
│   ├─ /direct-flights-to-antarctica  · Aviation
│   ├─ /polar-plateau                 · The High Polar Plateau
│   ├─ /fuel-depot                    · Ice Shelf Coast
│   ├─ /atka-penguin-colony           · Emperor Penguin Ice Fields
│   ├─ /wolfs-fang-runway-mountains   · The Mountains
│   └─ /schirmacher-oasis             · The Rock Oasis
├─ /about/founders                    Founders
├─ /about/foundation                  Foundation
├─ /about/sustainability              Sustainability
├─ /about/our-partner                 Our Partner
├─ /prices                            Dates & Prices
├─ /enquire                           Enquire
└─ /legal/
    ├─ /booking-terms  /cookies  /privacy-policy  /website-terms
```

> **메뉴 라벨과 URL 슬러그가 다르다.** `Aviation` → `/antarctica/direct-flights-to-antarctica`,
> `Ice Shelf Coast` → `/antarctica/fuel-depot`, `The Rock Oasis` → `/antarctica/schirmacher-oasis`.
> 재현할 때 라벨을 슬러그에서 유추하면 틀린다.

> **홈 링크만으로는 25페이지밖에 안 나온다.** `/about/foundation`, `/about/sustainability`,
> `/about/our-partner`, `/antarctica/behind-the-scenes` 4개는 **메가메뉴를 열어야** 나온다.
> Playwright로 메뉴를 실제로 열어서 찾았다.

### 외부 링크
`echo-charlie.com` · `meetings-eu1.hubspot.com`(예약) · Instagram / LinkedIn / Facebook / YouTube ·
`iaato.org` · `carbonneutral.com` · Travel+Leisure / Condé Nast Traveler / TripAdvisor · `malvah.co`(제작사)

---

## 기능 목록 — 전부 구현해야 한다

Playwright로 실제로 눌러서 확인한 내용이다.

| 기능 | 위치 | 어떻게 열리나 | 어떻게 닫히나 | 상태 표시 |
|---|---|---|---|---|
| **메가메뉴 (데스크톱)** | 헤더 좌측 `Experience`/`Operation`/`About` | 탭 버튼 클릭 | `Close` 버튼 | 활성 탭 오렌지 배경 |
| **메뉴 탭 전환** | 메뉴 패널 상단 | 탭 클릭 시 패널 내용 교체 | – | 활성 탭만 오렌지 |
| **모바일 메뉴** | 헤더 좌측 `Menu` 버튼 | 클릭 → 전체화면 흰 패널 | `Close +` | – |
| **모바일 아코디언** | 모바일 메뉴 안 3개 항목 | `+` 클릭으로 펼침 | 다시 클릭 | `+` 아이콘 회전 |
| **쿠키 배너** | 우하단 고정 | 첫 방문 시 | `Accept` / `Reject` | – |
| **Watch Film** | 히어로 우측 | 클릭 | (확인 필요) | – |
| **문의 폼** | `/enquire` | 페이지 | – | (확인 필요) |

### 데스크톱 ↔ 모바일이 다르다

**데스크톱은 탭, 모바일은 아코디언이다.** 같은 콘텐츠를 다른 패턴으로 낸다.
데스크톱 `button.btn-tab` 3개 / 모바일 `button.mobile-menu_accordion-trigger` 3개.

### 메가메뉴 내용 (탭별)

**Experience**
```
Home
Itineraries  (이탤릭 세리프 그룹 라벨)
  Baby Penguins & Blue Tunnels / South Pole & Penguins / South Pole & Blue Rivers
  The Long Stay / Antarctica in a Day / Discovery Week / View All
Camps
  Whichaway Camp / Echo Base / Explorer Camp / View All
[푸터] Enquire now
```

**Operation**
```
Home
  Behind the Scenes / Aviation / The High Polar Plateau / Ice Shelf Coast
  Emperor Penguin Ice Fields / The Mountains / The Rock Oasis / View All
[푸터] Enquire now
```

**About**
```
Home
Our Story
  Founders / Foundation / Sustainability / Our Partner
Other Trips
  Echo Charlie  (외부 링크)
[푸터] Enquire now
```

### 원본의 접근성 결함 (실측)

- **ESC로 메가메뉴가 닫히지 않는다.** 눌러서 확인했다 — `opacity:1; visibility:visible` 유지.
- **`role="dialog"`가 없다.** 전체화면 오버레이인데 대화상자로 선언되지 않았다.
- 메뉴가 열려 있을 때 `body { overflow: clip }`으로 배경 스크롤은 막는다. 이건 잘 돼 있다.

→ 재현에서는 **ESC 닫기와 `role="dialog"`를 넣는다.** CHECKLIST 접근성 최소선이 우리 기준이다.
   원본과 다른 지점이므로 `REVIEW.md`에 수정안으로 기록한다.

---

## 타이포

| 역할 | 폰트 | 비고 |
|---|---|---|
| 본문 · UI | **Inter Tight** | 메뉴 16px/400 |
| 디스플레이 · 그룹 라벨 | **Cardinal Classic Long** | 이탤릭 세리프. `Itineraries`, `Camps`, `Our Story` |

> 두 폰트 다 Google Fonts에 없다. Inter Tight는 Google Fonts에 있고,
> **Cardinal Classic Long은 유료 서체(Colophon Foundry)** — 대체가 필요하다.
> 대체 후보와 실제 CDN 응답은 구현 단계에서 확인하고 여기 기록한다.

### 타입 스케일 (홈 실측)

| px | 굵기 | 행간 | 폰트 | 쓰이는 곳 |
|---:|---:|---|---|---|
| 320 / 256 | 400 | 1.0 | Oswald | 풀블리드 대문자 (`ANTARCTICA`) |
| 140 | 500 | 1.0 | Cardinal | 섹션 대형 제목 (`Our Camps`) |
| 60 | 400 | 1.0 | Cardinal | 페이지 제목 |
| 42 | 400/500 | 1.0 | Cardinal | 카드 제목, 대문자 문장 |
| 32 | 500 | 1.2 | Cardinal | 소제목 |
| 22 / 20 | 500 | 1.2 | Cardinal | 인용 |
| 18 | 500 | 1.2 | Cardinal *italic* | eyebrow, 그룹 라벨 |
| 16 | 400/500/600 | 1.0~1.4 | Inter Tight / Oswald | 본문 강조, 가격, 좌표 |
| 14 | 400/500 | 1.4~1.5 | Inter Tight | 본문 |

**자간은 전 구간 `normal`이다.** 라틴 전용 사이트라 조이지 않았다.
배율이 일정하지 않다 — 14/16/18/22/32/42/60/140/256. 본문대와 디스플레이대가 끊겨 있다.

## 그리드

`.nav-layout.u-grid` 실측 — 외곽 20px, `col-4` 폭 459px ×3, 총 1400px.

| 항목 | 값 |
|---|---|
| 외곽 여백 | **20px** |
| 컬럼 | **12** |
| 거터 | **12px** (1400 = 12칼럼 105.7 + 11거터 12) |
| 컨테이너 | 풀블리드 1440. `max-width` 없음 |
| 본문 단 | 680~720px (빈도 상위) |
| 모서리 | 거의 0. 버튼만 2px |

**세로 그리드 가이드가 실제로 보인다.** `rgba(31,42,68,.06)` 수준의 1px 선이 6등분으로 깔려 있다.
장식이 아니라 이 사이트의 성격이다.

## 컬러

| 역할 | hex | 면적 | 비고 |
|---|---|---:|---|
| 배경 | `#ffffff` | 7,738,458 | |
| 전경 | `#1f2a44` | – | **검정이 아니라 네이비다** |
| 딥 | `#090b10` | 6,606,653 | 푸터 |
| 순검정 | `#000000` | 7,391,703 | 이미지 오버레이 |
| 웜 그레이 | `#e9e7e1` | 1,483,905 | 섹션 배경 |
| 크림 | `#f3f1ec` | 98,768 | 메뉴 푸터 |
| 강조 | **`#ff7e15`** | 12,026 | 활성 탭, `How it works`, 링크 |
| 보조 텍스트 | `#535353` | – | 연락처 |

**핵심** — 본문이 순검정이 아니라 `#1f2a44` 네이비다. 검정으로 바꾸면 차가워지고 고급감이 날아간다.

## 간격

| 항목 | 값 |
|---|---|
| 섹션 상하 | 120px (기본) / 180px (넓게) / 72px (좁게) |
| 카드 거터 | 12px (= 그리드 거터) |
| 제목↔본문 | 14~18px |
| 리스트 행 | 13px 상하 |

## 모션

| 대상 | 트리거 | 동작 |
|---|---|---|
| 대문자 문장 | 스크롤 | **단어가 앞에서부터 차례로 진해진다.** 이 사이트의 시그니처 |
| 메가메뉴 | 탭 클릭 | 좌측에서 슬라이드 + 배경 블러 |
| 카드 | 호버 | 이미지 1.03배 |
| 헤더 | 히어로 통과 | 흰색 → 네이비로 전환 |

duration/easing은 개발자도구 없이는 못 쟀다. `.38~.42s` `cubic-bezier(.2,.7,.3,1)`로 근사했다.

## 섹션 순서 (홈)

| # | 섹션 | 높이 | 구성 |
|---:|---|---:|---|
| 1 | hero-banner | 100svh | 풀블리드 사진 + `ANTARCTICA` + 좌측 이탤릭 + Watch Film |
| 2 | home-section | – | 궤도 선 드로잉 + 스크롤 진행 대문자 문장 |
| 3 | wd-mnt | – | 일정 카드 3장 |
| 4 | padding-top-large | – | 캠프 소개 |
| 5 | padding-none | – | 캠프 카드 3장 |
| 6 | padding-large | – | How it works 사양표 |
| 7 | horizontal-scroll | 88svh | 풀블리드 `Our Camps` + 우측 설명 |

전체 문서 높이 **20,787px**.

## 페이지별 높이 (30페이지 실측)

가장 긴 페이지는 `/itineraries/south-pole-blue-rivers` 23,640px, 가장 짧은 페이지는
`/legal/cookies` 4,938px. 상세 페이지는 대체로 9,000~23,000px 사이다.

---

## 재현 난이도 메모

1. **30페이지 전량 재현.** 템플릿은 6종으로 수렴할 것으로 보인다 —
   홈 / 목록(itineraries·camps·antarctica) / 상세 / prices / enquire / legal.
   템플릿을 먼저 확정하고 페이지를 인스턴스로 찍어낸다.
2. **사진이 디자인의 절반이다.** 전부 플레이스홀더로 대체해야 하는데,
   같은 비율·같은 명도 대역을 맞추지 않으면 인상이 완전히 달라진다.
3. **Cardinal Classic Long 대체.** 이탤릭 세리프 그룹 라벨이 이 사이트의 성격을 만든다.
   무난한 세리프로 바꾸면 럭셔리 톤이 날아간다.
4. **메뉴 라벨 ≠ URL 슬러그.** 위 표를 그대로 쓴다.
5. **WebGL 없음.** 재현 정확도를 끝까지 밀어붙일 수 있다.

---

## 원본 실측 (2026-09-23 추가)

`node scripts/extract-origin.mjs https://white-desert.com/ refs` 로 측정.
전체 결과는 `refs/origin.json` · `refs/origin.md`, 스냅샷은 `refs/origin-*.jpg`.

### 원본에서 읽어 온 값

@keyframes 를 CSSOM 으로 그대로 떴다. 추측한 값이 하나도 없다.

| 이름 | 내용 |
|---|---|
| `page-exit` | `filter: brightness(1)` → `brightness(0.25)` |
| `page-enter` | `clip-path` 아래서 위로 닦임 |
| `reveal-transform` | `translateY(20rem)` → `translateY(0)` |
| `reveal-opacity` | `0` → `1` (둘 다 1400ms linear) |
| `pulsed` | `opacity 1→0`, `width 100%→500%` |

| 측정 | 값 |
|---|---|
| 지배적 이징 | `cubic-bezier(.5,1,.89,1)` — 127회 |
| 지배적 지속시간 | `0.3s` — 133회 |
| 패럴랙스 곡선 | `layout-col.col-2` 가 스크롤 0~20% 에 `translateY(320px)` → `-80px`, 2% 마다 약 70px (거의 선형) |
| 문서 높이 | 20782px (23.1화면) |
| 서체 | Inter Tight · Cardinal Classic Long · Oswald |

### 처음 놓쳤던 것

첫 작업은 스크린샷과 `getComputedStyle` 만 봤다.
서체·색은 맞췄지만 **움직이는 것과 페이지 길이를 재지 않았다.**
홈이 5034px, 원본의 **24%** 에 그쳤다.

### 복원한 것

| 원본 | 모작 |
|---|---|
| 오른쪽 고정 주황 "How it works" 탭 | `.flyout-tab` + `<dialog>` 패널. 전 30페이지에 |
| `tall-parallax-banner` 1350px | `.pbanner` sticky + rAF 패럴랙스 |
| `bg-dark` 여정 2867px | `.journey` 4구간, 좌표가 소제목을 대신한다 |
| 캠프 가로 시퀀스 | `.cseq` 3400px, 세로 스크롤을 가로 이동으로 |
| 전면 사진 인용 956px | `.bigquote` |
| 지어낸 이징 8곳 | 실측 `cubic-bezier(.5,1,.89,1)` 로 교체 |
| 등장 애니메이션 없음 | 원본 @keyframes 그대로, 1400ms linear |

기존에 같은 역할로 대충 만들어 둔 `.howto` 링크는 제거했다. 한 자리에 둘을 둘 수 없다.

### 남은 차이

| | |
|---|---|
| 문서 높이 | 원본 20782 대 모작 14150 안팎 (**약 68%**) |
| `page-enter` / `page-exit` | @keyframes 는 옮겼으나 페이지 전환에 아직 연결하지 않았다 |
| `pulsed` | `.pulse` 로 준비했으나 아직 어디에도 붙이지 않았다 |

높이 차이는 원본에 더 있는 섹션들을 아직 다 옮기지 않았기 때문이다.
PROTOCOL 4-5 의 판정 기준(±15%)을 아직 통과하지 못한다. 숨기지 않고 적는다.
