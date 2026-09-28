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


---

## 사진 (2026-09-28)

> 사용자 지시 원문: **"사진 깔끔스하게 채우기 ㄱㄱ"** · **"감도높은 사진을 핀터레스트에서 찾아서 긁어오기"**

플레이스홀더(그라디언트 `.ph`)를 실제 사진으로 바꿨다. 원본 사이트 사진은 한 장도 쓰지 않았다(원본이 쓴 컷으로 보이는 후보도 뺐다).

| | |
|---|---|
| 사진 | **77장** · Pinterest 59 · 스톡 18 (Unsplash 9 · Pixabay 9) |
| 용량 | 8.8 MB (긴 변 1600px 이하, JPEG 80%) |
| 후보 | 369장 수집 → 77장 채택 |
| 출처 기록 | `assets/photos/credits.json` — 자리 · Pinterest 핀 주소(열어서 같은 이미지인지 확인함) 또는 Unsplash/Pixabay 페이지 · 검색어 · 라이선스 · 명도 |
| 빌드 연결 | `assets/photos/photos.json` (파일 · 크기 · alt) → `build.mjs` 의 `ph(cls, cap, key)` 가 `<img width height loading>` 을 넣는다. 없는 키는 빌드가 멈춘다 |
| 로딩 | 첫 화면 히어로만 `fetchpriority="high"`, 나머지 `loading="lazy"`. 모든 `<img>` 에 width/height |

### 뺀 후보

- AI 생성 이미지 — 오두막 실내 12장 전부, 오로라·과채도 일몰, 합성 빙산(수면 위아래 반쪽), 생성기 워터마크(✦)가 찍힌 인물
- 로고·글자 — 항공사 윙렛 로고, 수상비행기 도장(Harbour Air), 쿨러 상표(Igloo), 선체 번호, 등산복 로고, 해적 깃발, 사진 워터마크
- 북극 피사체 — 북극곰, 북극곰이 들어간 캠프 컷 (남극 사이트)
- 원본 운영사 컷으로 보이는 것 — 청빙 활주로 위 걸프스트림 제트 등
- 같은 핀이 여러 검색어에 겹친 중복
- 추적 불가 — 핀 주소를 다시 찾을 수 없던 5장은 출처가 확인되는 컷(스톡 포함)으로 바꿨다
- 실존 인물 얼굴 — 창업자 카드에 가상 이름이 붙으므로 얼굴이 드러난 인물은 뺐다(고글 · 마스크 · 뒷모습만)

### 사진 위 글씨 대비

흰 글씨가 앉는 자리는 글씨 상자 뒤 픽셀의 **밝은 쪽 95퍼센타일** 명도로 WCAG 대비를 쟀다(글씨를 잠시 투명하게 하고 캡처).
25페이지 155개 텍스트 전부 **4.5:1 이상** (최저 4.53 · `.bleed-title`).

| 자리 | 처리 |
|---|---|
| 히어로·상세 배너 `.hero-media::after` | 하단 띠를 .42 → .72 로 짙게. 홈의 좌우 캡션·Watch Film 뒤에 작은 원형 스크림 |
| 카드 `.card::after` | 28%부터 시작해 하단 .8 |
| 캠프 시퀀스 카드 | `.cseq__card .ph::after` .56 (카드 쪽 `::after` 는 사진 위로 칠해지지 않아 사진 상자 안으로 옮겼다) |
| 인용 · 출발 배너 · Our Camps | 섹션 `::after` 스크림 (원형 또는 세로 그라디언트) |
| 패럴랙스 Our Season | `.pbanner__in::before` 를 원형 스크림으로 |

### 같이 고친 기존 문제

- `.hero-media .ph` 에 크기가 없어 히어로 사진 자리가 0px 이었다. 자리 표시 때는 배경색에 가려 안 보였다 → `position:absolute; inset:0`
- `.pbanner .para` 에 transform 이 걸려 `.ph` 의 기준 상자가 0×0 이 됐다. 패럴랙스 사진이 한 번도 보인 적이 없었다 → `.para` 에 `inset:0`
- 오른쪽 고정 "How it works" 탭이 Our Camps 설명 글 끝을 가린다(그대로 둠, 대비 측정에서만 숨김)

### 자리별

| 자리 | 파일 | 출처 | 명도 | 고른 이유 |
|---|---|---|---:|---|
| founders portrait 4 | `ab-person-4.jpg` | [Pixabay](https://pixabay.com/photos/snowboard-man-snow-snowboarding-4803050/) | 75 | 창업자 카드 — 실존 인물 얼굴을 가상 이름에 붙이지 않도록 고글 · 마스크 · 뒷모습만 |
| home hero | `home-hero.jpg` | [Pinterest](https://www.pinterest.com/pin/1073123417600144026/) | 51 | 원본 히어로 = 청빙 벽 + 원정대, 중간 명도. 같은 얼음 벽이고 아래가 어두운 바다라 흰 ANTARCTICA 대비 확보 |
| home Our Season parallax | `home-season.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EB%88%88-%EB%8D%AE%EC%9D%B8-%EC%82%B0%EC%9C%BC%EB%A1%9C-%EB%91%98%EB%9F%AC%EC%8B%B8%EC%9D%B8-%ED%81%B0-%EC%88%98%EC%97%AD-MC4vKEsIKVY) | 58 | 원본 = 눈 덮인 봉우리. 설산 + 수면 반영, 중앙 스크림 위 흰 글씨 |
| home journey: Cape Town | `journey-capetown.jpg` | [Pinterest](https://www.pinterest.com/pin/83316661830357040/) | 43 | 여정 구간 소제목(케이프타운 · 비행 · 활주로 · 캠프)과 같은 피사체. 어두운 구간이라 사진이 떠 보이는 중간 명도 |
| home journey: flight | `journey-wing.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EB%B9%84%ED%96%89%EA%B8%B0%EC%97%90%EC%84%9C-%EB%B3%B8-%EA%B2%83%EC%B2%98%EB%9F%BC-%ED%83%9C%EC%96%91%EC%9D%B4-%EA%B5%AC%EB%A6%84-%EC%9C%84%EB%A1%9C-%EC%A7%80%EA%B3%A0-%EC%9E%88%EB%8B%A4-GPY8Dn02OW8) | 32 | 여정 구간 소제목(케이프타운 · 비행 · 활주로 · 캠프)과 같은 피사체. 어두운 구간이라 사진이 떠 보이는 중간 명도 |
| home journey: runway; /antarctica/aviation hero | `journey-runway.jpg` | [Pinterest](https://www.pinterest.com/pin/4597612368648862080/) | 65 | 여정 구간 소제목(케이프타운 · 비행 · 활주로 · 캠프)과 같은 피사체. 어두운 구간이라 사진이 떠 보이는 중간 명도 |
| home journey: camp | `journey-camp.jpg` | [Pinterest](https://www.pinterest.com/pin/71987294020532060/) | 64 | 여정 구간 소제목(케이프타운 · 비행 · 활주로 · 캠프)과 같은 피사체. 어두운 구간이라 사진이 떠 보이는 중간 명도 |
| home camp sequence background | `cseq-bg.jpg` | [Pixabay](https://pixabay.com/photos/iceberg-antarctica-polar-ice-sea-404966/) | 62 | 원본 가로 시퀀스 배경 = 넓은 빙원. 밝은 해빙 + 산맥 |
| home camp sequence Ridgeway; /camps/ridgeway hero | `camp-ridgeway.jpg` | [Pixabay](https://pixabay.com/photos/snow-warehouse-base-camp-aconcagua-738/) | 67 | 캠프 3곳 — 시퀀스 카드와 상세 배너에 같은 컷(원본도 캠프 사진을 반복) |
| home camp sequence Relay Base; /camps/relay-base hero | `camp-relay.jpg` | [Pinterest](https://www.pinterest.com/pin/677580706443452088/) | 69 | 캠프 3곳 — 시퀀스 카드와 상세 배너에 같은 컷(원본도 캠프 사진을 반복) |
| home camp sequence Field Camp; /camps/field-camp hero | `camp-field.jpg` | [Pinterest](https://www.pinterest.com/pin/272045633728055451/) | 66 | 캠프 3곳 — 시퀀스 카드와 상세 배너에 같은 컷(원본도 캠프 사진을 반복) |
| home quote | `bigquote.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%ED%83%9C%EC%96%91%EC%9D%80-%EB%88%88-%EB%8D%AE%EC%9D%B8-%ED%92%8D%EA%B2%BD-%EC%9C%84%EB%A1%9C-%EB%B0%9D%EA%B2%8C-%EB%B9%9B%EB%82%A9%EB%8B%88%EB%8B%A4-MKM3wc3Efeo) | 43 | 원본 전면 인용 = 밝은 설원. 태양 + 설원, 중앙 스크림 |
| home Our Camps banner | `bleed-camps.jpg` | [Pinterest](https://www.pinterest.com/pin/121667627429883602/) | 52 | 원본 Our Camps = 눈 속 바위 능선. 어두운 바위 능선이라 큰 흰 제목 대비 |
| footer Start planning banner (all pages) | `banner-start.jpg` | [Pinterest](https://www.pinterest.com/pin/30540103718986856/) | 68 | 원본 출발 배너 = 설원 위 캠프. 설원 + 화산, 중앙 스크림 |
| footer film tile (all pages) | `foot-film.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EB%88%88-%EB%8D%AE%EC%9D%B8-%EC%8A%AC%EB%A1%9C%ED%94%84%EB%A5%BC-%EA%B0%80%EB%A1%9C-%EC%A7%88%EB%9F%AC-%EC%8A%A4%ED%82%A4%EB%A5%BC-%ED%83%80%EB%8A%94-%EB%91%90-%EC%82%AC%EB%9E%8C-l5RiA5vEuWs) | 63 | 필름 타일 — 썰매 끄는 원정대원, 가로로 긴 컷 |
| trip card Blue Ice & Early Chicks | `card-chicks.jpg` | [Pinterest](https://www.pinterest.com/pin/4592686531676096384/) | 74 | 일정 카드 3:4 — 일정 이름과 같은 피사체 |
| trip card South Pole & Colony | `card-pole.jpg` | [Pinterest](https://www.pinterest.com/pin/107453141106453627/) | 62 | 일정 카드 3:4 — 일정 이름과 같은 피사체 |
| trip card South Pole & Meltwater | `card-meltwater.jpg` | [Pinterest](https://www.pinterest.com/pin/15270086238606710/) | 60 | 일정 카드 3:4 — 일정 이름과 같은 피사체 |
| trip card Long Stay | `card-longstay.jpg` | [Pinterest](https://www.pinterest.com/pin/199002877280568094/) | 49 | 일정 카드 3:4 — 일정 이름과 같은 피사체 |
| trip card One Day | `card-oneday.jpg` | [Pinterest](https://www.pinterest.com/pin/52213676924086978/) | 77 | 일정 카드 3:4 — 일정 이름과 같은 피사체 |
| trip card Discovery Week | `card-discovery.jpg` | [Pinterest](https://www.pinterest.com/pin/294774738132503769/) | 43 | 일정 카드 3:4 — 일정 이름과 같은 피사체 |
| /itineraries/blue-ice-early-chicks hero | `hero-chicks.jpg` | [Pinterest](https://www.pinterest.com/pin/15129348743480294/) | 69 | 일정 상세 배너 — 카드와 다른 가로 컷 |
| /itineraries/south-pole-colony hero | `hero-pole.jpg` | [Pinterest](https://www.pinterest.com/pin/329959110223224892/) | 77 | 일정 상세 배너 — 카드와 다른 가로 컷 |
| /itineraries/south-pole-meltwater hero | `hero-meltwater.jpg` | [Pixabay](https://pixabay.com/photos/antarctica-iceberg-ice-marine-cold-1621775/) | 51 | 일정 상세 배너 — 카드와 다른 가로 컷 |
| /itineraries/long-stay hero | `hero-longstay.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%82%B0-%EC%95%9E%EC%97%90%EC%84%9C-%EB%B3%B4%ED%8A%B8%EB%A5%BC-%ED%83%84-%EC%82%AC%EB%9E%8C%EB%93%A4-Xodpk0gAJzI) | 54 | 일정 상세 배너 — 카드와 다른 가로 컷 |
| /itineraries/one-day hero | `hero-oneday.jpg` | [Pinterest](https://www.pinterest.com/pin/65302263320252307/) | 52 | 일정 상세 배너 — 카드와 다른 가로 컷 |
| /itineraries/discovery-week hero | `hero-discovery.jpg` | [Pinterest](https://www.pinterest.com/pin/73465037666444768/) | 69 | 일정 상세 배너 — 카드와 다른 가로 컷 |
| itinerary slider: Runway | `sl-runway.jpg` | [Pinterest](https://www.pinterest.com/pin/534661787037293047/) | 45 | 일정 슬라이더 라벨 그대로(Runway · Camp · Plateau · Colony · Night) |
| itinerary slider: Camp | `sl-camp.jpg` | [Pinterest](https://www.pinterest.com/pin/22447698138599192/) | 56 | 일정 슬라이더 라벨 그대로(Runway · Camp · Plateau · Colony · Night) |
| itinerary slider: Plateau | `sl-plateau.jpg` | [Pinterest](https://www.pinterest.com/pin/328199891616005572/) | 77 | 일정 슬라이더 라벨 그대로(Runway · Camp · Plateau · Colony · Night) |
| itinerary slider: Colony | `sl-colony.jpg` | [Pinterest](https://www.pinterest.com/pin/915427061789319334/) | 74 | 일정 슬라이더 라벨 그대로(Runway · Camp · Plateau · Colony · Night) |
| itinerary slider: Night | `sl-night.jpg` | [Pinterest](https://www.pinterest.com/pin/231653974567134435/) | 65 | 일정 슬라이더 라벨 그대로(Runway · Camp · Plateau · Colony · Night) |
| camp card Ridgeway | `ccard-ridgeway.jpg` | [Pinterest](https://www.pinterest.com/pin/145663369184198214/) | 77 | 캠프 목록 카드 3:4 — 홈의 시퀀스와 겹치지 않는 다른 컷 |
| camp card Relay Base | `ccard-relay.jpg` | [Pinterest](https://www.pinterest.com/pin/420945896446308769/) | 75 | 캠프 목록 카드 3:4 — 홈의 시퀀스와 겹치지 않는 다른 컷 |
| camp card Field Camp | `ccard-field.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EB%B0%A4%EC%9D%98-%EC%96%B4%EB%91%90%EC%9A%B4-%EC%82%B0%EC%9D%98-%ED%92%8D%EA%B2%BD-%EC%86%8D%EC%97%90%EC%84%9C-%EB%B9%9B%EB%82%98%EB%8A%94-%ED%85%90%ED%8A%B8-H6pzqTLOhoM) | 14 | 캠프 목록 카드 3:4 — 홈의 시퀀스와 겹치지 않는 다른 컷 |
| /camps hero | `camps-hero.jpg` | [Pinterest](https://www.pinterest.com/pin/272045633728055451/) | 66 |  |
| camp slider: Pod | `cs-pod.jpg` | [Pinterest](https://www.pinterest.com/pin/420945896446308885/) | 55 | 캠프 슬라이더 라벨 그대로(Pod · Mess · Field · Ridge) |
| camp slider: Mess | `cs-mess.jpg` | [Pinterest](https://www.pinterest.com/pin/154811305936421839/) | 60 | 캠프 슬라이더 라벨 그대로(Pod · Mess · Field · Ridge) |
| camp slider: Field | `cs-field.jpg` | [Pinterest](https://www.pinterest.com/pin/814096070166813044/) | 59 | 캠프 슬라이더 라벨 그대로(Pod · Mess · Field · Ridge) |
| camp slider: Ridge | `cs-ridge.jpg` | [Pinterest](https://www.pinterest.com/pin/34551122122005285/) | 57 | 캠프 슬라이더 라벨 그대로(Pod · Mess · Field · Ridge) |
| ops card + split: Logistics | `op-logistics-card.jpg` | [Pinterest](https://www.pinterest.com/pin/631770653949464368/) | 59 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/logistics hero | `op-logistics-hero.jpg` | [Pinterest](https://www.pinterest.com/pin/633387443270885/) | 33 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/logistics split 2 | `op-logistics-2.jpg` | [Pinterest](https://www.pinterest.com/pin/165648092540280100/) | 60 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| ops card: Aviation | `op-aviation-card.jpg` | [Pinterest](https://www.pinterest.com/pin/996914067526990809/) | 64 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/aviation split 1 | `op-aviation-1.jpg` | [Pinterest](https://www.pinterest.com/pin/97460779420544791/) | 61 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/aviation split 2 | `op-aviation-2.jpg` | [Pinterest](https://www.pinterest.com/pin/492649953558341/) | 62 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| ops card: Polar Plateau | `op-plateau-card.jpg` | [Pinterest](https://www.pinterest.com/pin/1088886016567272663/) | 80 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/polar-plateau hero | `op-plateau-hero.jpg` | [Pixabay](https://pixabay.com/photos/ice-snow-nature-barren-clouds-sky-7788590/) | 42 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/polar-plateau split 1 | `op-plateau-1.jpg` | [Pinterest](https://www.pinterest.com/pin/107804985307477600/) | 89 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/polar-plateau split 2 | `op-plateau-2.jpg` | [Pinterest](https://www.pinterest.com/pin/687150855687532944/) | 67 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| ops card: Ice Shelf | `op-shelf-card.jpg` | [Pinterest](https://www.pinterest.com/pin/23010648076396293/) | 45 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/ice-shelf hero | `op-shelf-hero.jpg` | [Pinterest](https://www.pinterest.com/pin/353954851980824004/) | 54 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/ice-shelf split 1 | `op-shelf-1.jpg` | [Pinterest](https://www.pinterest.com/pin/160933386679927930/) | 57 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/ice-shelf split 2 | `op-shelf-2.jpg` | [Pinterest](https://www.pinterest.com/pin/853291460692256449/) | 58 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| ops card: Penguin Ice Fields | `op-penguin-card.jpg` | [Pinterest](https://www.pinterest.com/pin/196680708721375752/) | 80 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/penguin-ice-fields hero | `op-penguin-hero.jpg` | [Pinterest](https://www.pinterest.com/pin/90635011238259707/) | 67 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/penguin-ice-fields split 1 | `op-penguin-1.jpg` | [Pinterest](https://www.pinterest.com/pin/385972630585170218/) | 66 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/penguin-ice-fields split 2 | `op-penguin-2.jpg` | [Pinterest](https://www.pinterest.com/pin/19632948394921511/) | 49 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| ops card: The Mountains | `op-mountain-card.jpg` | [Pinterest](https://www.pinterest.com/pin/44613852554399164/) | 52 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/mountains hero | `op-mountain-hero.jpg` | [Pinterest](https://www.pinterest.com/pin/236790892904688923/) | 52 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/mountains split 1 | `op-mountain-1.jpg` | [Pinterest](https://www.pinterest.com/pin/2814818501344088/) | 63 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/mountains split 2 | `op-mountain-2.jpg` | [Pinterest](https://www.pinterest.com/pin/20055160839893471/) | 56 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| ops card: Rock Oasis | `op-rock-card.jpg` | [Pinterest](https://www.pinterest.com/pin/326088829293725419/) | 29 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/rock-oasis hero | `op-rock-hero.jpg` | [Pixabay](https://pixabay.com/photos/iceberg-ice-antarctica-snow-winter-8008071/) | 51 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/rock-oasis split 1 | `op-rock-1.jpg` | [Pinterest](https://www.pinterest.com/pin/361132463892603434/) | 44 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| /antarctica/rock-oasis split 2 | `op-rock-2.jpg` | [Pinterest](https://www.pinterest.com/pin/89157267630133890/) | 66 | 운영 페이지 주제 그대로(연료 · 항공 · 고원 · 빙붕 · 펭귄 · 산 · 바위 오아시스) |
| operation slider: Detail | `os-detail.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EB%82%AE-%EB%8F%99%EC%95%88-%EC%82%B0-%EA%B7%BC%EC%B2%98%EC%9D%98-%EB%B9%99%EC%82%B0-m5r2FFo8NJM) | 73 | 운영 슬라이더 공용 컷 |
| operation slider: Ice | `os-ice.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EB%B0%94%EB%8B%A4-%ED%95%9C%EA%B0%80%EC%9A%B4%EB%8D%B0%EC%97%90-%EB%96%A0-%EC%9E%88%EB%8A%94-%ED%81%B0-%EB%B9%99%EC%82%B0-yh4UNHxc4qU) | 58 | 운영 슬라이더 공용 컷 |
| operation slider: Sky | `os-sky.jpg` | [Pinterest](https://www.pinterest.com/pin/757589968613007707/) | 77 | 운영 슬라이더 공용 컷 |
| /about/founders hero | `ab-founders.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%84%A4%EC%9B%90%EC%97%90-%EC%84%9C-%EC%9E%88%EB%8A%94-%EB%91%90-%EC%82%AC%EB%9E%8C-IkJC9YAar-8) | 62 | About 배너 — 페이지 주제(원정대 · 연구기지 · 빙산 · 항공) |
| founders portrait 1 | `ab-person-1.jpg` | [Pinterest](https://www.pinterest.com/pin/14988611255420185/) | 34 | 창업자 카드 — 실존 인물 얼굴을 가상 이름에 붙이지 않도록 고글 · 마스크 · 뒷모습만 |
| founders portrait 2 | `ab-person-2.jpg` | [Pinterest](https://www.pinterest.com/pin/599049187981955949/) | 48 | 창업자 카드 — 실존 인물 얼굴을 가상 이름에 붙이지 않도록 고글 · 마스크 · 뒷모습만 |
| founders portrait 3 | `ab-person-3.jpg` | [Pixabay](https://pixabay.com/photos/skier-ski-skiing-winter-snow-4799483/) | 46 | 창업자 카드 — 실존 인물 얼굴을 가상 이름에 붙이지 않도록 고글 · 마스크 · 뒷모습만 |
| /about/foundation hero | `ab-foundation.jpg` | [Pinterest](https://www.pinterest.com/pin/3870349671952139/) | 47 | About 배너 — 페이지 주제(원정대 · 연구기지 · 빙산 · 항공) |
| /about/sustainability hero | `ab-sustain.jpg` | [Pixabay](https://pixabay.com/photos/iceberg-ocean-ice-snow-winter-8162195/) | 58 | About 배너 — 페이지 주제(원정대 · 연구기지 · 빙산 · 항공) |
| /about/partner hero | `ab-partner.jpg` | [Pinterest](https://www.pinterest.com/pin/323062973285804588/) | 39 | About 배너 — 페이지 주제(원정대 · 연구기지 · 빙산 · 항공) |
| /prices hero | `prices-hero.jpg` | [Pixabay](https://pixabay.com/photos/iceberg-ocean-winter-cold-snow-7994536/) | 67 | 요금 배너 — 빙하 전면, 하단 오버레이 |
