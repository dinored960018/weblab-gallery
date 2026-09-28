# SPEC — LxL Creative

## 출처

- **원본 URL**: https://www.lxlcreative.co.uk/
- **어워드**: Awwwards **Site of the Day**
- **어워드 링크**: https://www.awwwards.com/sites/lxl-creative
- **모작 날짜**: 2026-09-22
- **업종**: Film·TV 엔터테인먼트 캠페인 크리에이티브 에이전시 (런던 소호)
- **빌드**: Webflow

---

## 사이트 구조

- **페이지 수**: **17** · **재현 범위: 전부**
- **라우팅**: 일반 링크

```
/                          홈
├─ /work                   작업 목록
│   ├─ /work/steal
│   ├─ /work/sas-rogue-heroes
│   ├─ /work/malice
│   └─ /work/bake-off
├─ /services               서비스 목록
│   ├─ /service/key-art
│   ├─ /service/social-campaigns
│   ├─ /service/unit
│   ├─ /service/epk
│   ├─ /service/editorial
│   └─ /service/activations
├─ /lxl-studios
├─ /about
├─ /contact
└─ /privacy
```

> **이번엔 숨은 페이지가 없다.** 모바일 메뉴가 처음부터 DOM에 있어서 정적 링크로 17개가 전부 잡힌다.
> White Desert(25 → 30)와 다르다. **사이트마다 확인해야지 일반화하면 안 된다.**

---

## 기능 목록 — 전부 구현해야 한다

Playwright로 확인했다.

| 기능 | 위치 | 어떻게 열리나 | 닫히나 | 상태 |
|---|---|---|---|---|
| **드롭다운 ×4** | 헤더 `Work`/`Services`/`LxL Studios`/`LxL Creative` | 호버 | 포인터 이탈 | `aria-expanded` |
| **모바일 메뉴** | 헤더 `button.nav_menu_toggle` | 클릭 → 라운드 카드 패널 | `×` 버튼 | – |
| **모바일 아코디언** | 모바일 메뉴 `Services` | 셰브론 클릭 | 다시 클릭 | 셰브론 회전 |
| 비디오 플레이어 | 홈 하단 | `00:00 / 00:47` 진행 표시 | – | – |
| 카드 스택 | 홈 `card-stack_wrap` (5,400px) | 스크롤로 카드가 쌓임 | – | – |
| 드래그 캐러셀 | 홈 `ft-projects_wrap` | `Drag` 라벨 | – | – |

### 드롭다운 4종은 내용이 각각 다르다

| 드롭다운 | 크기 | 내용 |
|---|---|---|
| `is-work` | 462×451 | 프로젝트 3행 — 썸네일 + 제목 + 서비스 태그. 하단 오렌지 필 `All work →` |
| `is-services` | 462×414 | 서비스 6개 목록 + `All services` |
| `is-studios` | 462×613 | 이미지 + 설명문 + `Explore Studios` |
| `is-creative` | – | 이미지 + 설명문 + `Explore Creative` |

**메뉴 항목마다 드롭다운 구조가 다르다.** 같은 틀에 내용만 갈아끼운 게 아니다.
`is-work`는 이미지 3장이 있고, `is-services`는 텍스트만이며, `is-studios`는 문단이 들어간다.

### 데스크톱 ↔ 모바일

- **데스크톱**: 호버 드롭다운 4종
- **모바일**: 라운드 카드 패널(전체화면 아님) + `Services`만 아코디언

White Desert는 탭↔아코디언이었고 여기는 호버 드롭다운↔카드 패널이다. **패턴이 또 다르다.**

---

## 타이포

| 역할 | 원본 | 대체 | 근거 |
|---|---|---|---|
| 디스플레이 | **Owners Wide** (Ohno, 유료) | **Archivo** `wdth 125` `wght 700` | 후보 4종 렌더 비교. 넓은 폭·둥근 O·플랫 터미널이 맞음 |
| 스크립트 | **Scribo** (유료) | **Sacramento** | 후보 9종 렌더 비교. 얇은 모노라인 연결형이 맞음 |
| 본문 | **Manrope** | **Manrope** | Google Fonts에 동일 서체 있음. 대체 불필요 |

### 실측 스케일

크기가 소수점이다 — `101.7` `98.76` `54.86` `45.7` `17.43`. **`vw` 기반 유동 크기**다.

| px | 굵기 | 행간 | 폰트 | 색 | 쓰이는 곳 |
|---:|---:|---:|---|---|---|
| 101.7 | 400 | 91.5 | Scribo | `#ff5121` / `#055dff` | `Why lxl`, `Studios` |
| 98.76 | 400 | 29.6 | Scribo | `#ff5121` | 본문 안 강조어 (`biggest`) |
| 58.62 | 400 | 41.0 | Scribo | `#ff5121` | `Real people.` |
| 54.86 | 700 | 49.4 | Owners Wide | `#fcf2bd` | 히어로 문장 |
| 51.42 | 400 | 15.4 | Scribo | `#ff5121` | 본문 안 `360°` |
| 45.7 | 400 | 45.7 | Scribo | `#ff5121` | `Featured` |
| 42.3 | 700 | 42.3 | Owners Wide | `#fcf2bd` | 인용 |
| 32.57 | 700 | 32.6 | Owners Wide | `#fcf2bd` | 섹션 제목 |
| 28.57 | 600 | 28.6 | Manrope | `#fcf2bd` | 리드문 |
| 22.86 | 700 | 22.9 | Owners Wide | `#ffffff` | 카드 제목 |
| 17.43 | 500/600 | 24.4 | Manrope | `#fcf2bd` / 70% | 본문 |
| 15.43 | 700 | 18.5 | Owners Wide | 상황별 | 라벨·버튼 |
| 14.43 | 600 | 14.4 | Manrope | `#ffffff` | 작은 링크 |

**자간 전 구간 `normal`.** 라틴 전용.

**행간이 글자 크기보다 작은 구간이 있다** — 98.76px에 행간 29.6px, 51.42px에 15.4px.
스크립트가 본문 줄 사이에 **겹쳐 들어가기** 때문이다. 손글씨가 인쇄 교정지에 끼어든 것처럼 보인다.

## 컬러

| 역할 | hex | 면적 | 비고 |
|---|---|---:|---|
| 배경 | **`#27201d`** | 14,818,973 | **검정이 아니라 다크 브라운** |
| 스크립트 A | **`#055dff`** | 398,197 | 일렉트릭 블루 |
| 스크립트 B / 강조 | **`#ff5121`** | 25,548 | 오렌지. 필 버튼·로고 |
| 디스플레이 | **`#fcf2bd`** | 7,889 | 크림. 흰색이 아니다 |
| 흰색 | `#ffffff` | 103,982 | 카드 위 텍스트 |
| 검정 | `#000000` | 243,599 | 이미지 영역 |
| 회색 | `#646464` | 9,216 | 보조 |

**핵심** — 배경도 텍스트도 순색을 피한다. 다크 브라운 `#27201d` + 크림 `#fcf2bd`.
검정/흰색으로 바꾸면 필름 인화지 같은 질감이 사라진다.
그리고 **강조색이 둘**이다. 오렌지와 블루를 같은 스크립트 서체에 번갈아 쓴다.

## 그리드

| 항목 | 값 |
|---|---|
| 컨테이너 | 풀블리드 1440 / 내부 1371 |
| 본문 단 | **770px** (빈도 상위) |
| 외곽 여백 | 약 34px |
| 헤더 높이 | **72px** (`.nav_wrap`, 배경 투명) |
| 드롭다운 폭 | **462px** |
| 모서리 | 큰 카드 약 16~20px, 필 버튼 999px |

## 섹션 순서 (홈)

| # | 섹션 | 높이 | 구성 |
|---:|---|---:|---|
| 1 | `hero_home_wrap` | 900 | 좌 사진 카드 + 우 `REAL CRAFT./Real people./REAL RESULTS.` + 하단 `lxl creative` 락업 |
| 2 | `video-scroll_wrap` | **3,481** | `LXL PRODUCES 360° CREATIVE CAMPAIGNS FOR SCREEN` + `Sound` 토글 |
| 3 | `card-stack_wrap` | **5,400** | `Our SERVICES` — 스크롤로 카드가 쌓인다. 최장 섹션 |
| 4 | `img-cycle_wrap` | 891 | `From a garden shed to a creative hub in Soho` |
| 5 | `ft-projects_wrap` | 990 | `Featured` + 드래그 캐러셀 |
| 6 | `features_wrap` | 1,076 | `WHY LXL` |
| 7 | `testimonials_wrap` | 658 | 인용 |
| 8 | `studios_wrap` | 1,035 | `Studios` — 블루 스크립트 |
| 9 | `footer_wrap` | 892 | 비디오 + `GOT A PRODUCTION COMING UP?` |

전체 **15,323px**.

## 페이지별 높이

최장 `/lxl-studios` 14,405px · `/work/steal` 7,282px · `/services` 7,503px
최단 `/work` 1,792px (목록인데 짧다) · `/service/activations` 2,110px

---

## 재현 난이도 메모

1. **유료 서체 2종.** White Desert(1종)보다 까다롭다. 디스플레이와 스크립트가 **겹쳐서** 로고 락업을
   만들기 때문에, 둘의 상대 크기와 기울기가 안 맞으면 로고가 무너진다.
2. **강조색이 둘(오렌지·블루).** 어느 자리에 뭘 쓰는지 규칙이 있다 — 확인 필요.
3. **카드 스택 5,400px.** 스크롤로 카드가 쌓이는 연출. 정적으로 단순화할지 구현할지 판단 필요.
4. **드롭다운 4종이 서로 다른 구조.** 공통 틀로 못 묶는다.
5. **사진이 인물·영화 스틸.** 전부 플레이스홀더로 대체해야 하는데 명도 대역을 맞춰야 한다
   (White Desert에서 배운 것).
6. **WebGL 없음.** 재현 정확도를 밀어붙일 수 있다.

---

## 원본 실측 (2026-09-23 추가)

`node scripts/extract-origin.mjs https://www.lxlcreative.co.uk/ refs` 로 측정.
전체 결과는 `refs/origin.json` · `refs/origin.md`, 스냅샷은 `refs/origin-*.jpg`.

### 원본이 쓰는 것

| 항목 | 값 |
|---|---|
| 라이브러리 | GSAP · ScrollTrigger · Lenis · barba · Webflow · jQuery |
| 스크롤 | Lenis 관성 스무스 스크롤 |
| 페이지 전환 | barba |
| 문서 높이 | 15300px (17화면) |
| 서체 | Manrope · Owners Wide · Scribo |
| 이징 | `cubic-bezier(.65,0,0,1)` `cubic-bezier(.35,1.75,.6,1)` `cubic-bezier(.87,0,.13,1)` |
| 지속시간 | 0.15s 0.2s 0.25s 0.3s 0.35s 0.5s 0.6s |

### 섹션 대조

| 원본 | 높이 | 모작 | 높이 |
|---|---|---|---|
| `hero_home_wrap` | 900 | `.hero` | 900 |
| `video-scroll_wrap` | 3481 | `.vscroll` | 3480 |
| `card-stack_wrap` | 5400 | `.cstack` | 5022 |
| `img-cycle_wrap` | 891 | `.sec-sm` | 383 |
| `ft-projects_wrap` | 990 | `.sec` | 973 |
| `features_wrap` | 1076 | `.sec` | 589 |
| `testimonials_wrap` | 636 | `.sec-sm` | 480 |
| `studios_wrap` | 1035 | `.sec` | 529 |
| — | — | `.sec` (CTA) | 1150 |
| **합계** | **15300** | | **14047 (91.8%)** |

### 처음 놓쳤던 것

첫 작업에서는 스크린샷과 `getComputedStyle` 만 봤다.
색·서체·간격 같은 **정적인 것은 맞았지만 움직이는 것은 아무것도 재지 않았다.**
그래서 홈이 7079px(원본의 46%)에 그쳤고, 전체의 58%를 차지하는
스크롤 고정 시퀀스 두 개가 통째로 빠져 있었다.

### 다시 만든 것

| 장치 | 원본 | 모작 |
|---|---|---|
| 영상 고정 + 문장 흐름 | ScrollTrigger 핀 | `position:sticky` + `animation-timeline:view()` |
| 카드 쌓기 | ScrollTrigger 핀 | 카드별 `position:sticky` + `top:calc(11vh + var(--i)*26px)` |
| 이징 | 위 실측값 | `--ease-out` `--ease-back` `--ease-inout` 로 옮겨 씀 |

카드마다 고정 위치를 26px 씩 어긋나게 준 이유는, 같은 위치에 쌓으면
뒤 카드의 제목이 앞 카드에 가려 원본처럼 두 장이 함께 보이지 않기 때문이다.

### 일부러 넣지 않은 것

| 원본 | 판단 |
|---|---|
| Lenis 관성 스크롤 | **생략.** 네이티브 스크롤로 둔다. 느낌 차이가 남는다 |
| barba 페이지 전환 | **생략.** 정적 멀티페이지로 둔다 |
| `img-cycle` 이미지 순환 | **미구현.** 높이도 891 → 383 으로 모자라다 |

세 가지는 남은 차이다. 숨기지 않고 여기 적는다.

---

## 남은 3건 처리 (2026-09-23)

앞서 "일부러 넣지 않은 것" 으로 적어 둔 세 가지를 마저 했다.

| 항목 | 원본 | 처리 |
|---|---|---|
| 관성 스크롤 | Lenis | 라이브러리 없이 직접. wheel 을 가로채 감쇠 0.09 로 따라간다 (30줄) |
| 페이지 전환 | barba | View Transitions API. `@view-transition{navigation:auto}` |
| `img-cycle` | 사진이 제자리에서 바뀜 | `.icycle` — 4장 순환, 점으로 선택, 3.2초 자동, 탭 이탈 시 정지 |

셋 다 `prefers-reduced-motion: reduce` 에서 꺼진다.
관성 스크롤은 아예 켜지 않아 네이티브 스크롤이 그대로 남는다.

### 호버 실측

`extract-origin.mjs` 에 호버 검사를 붙여 원본에서 직접 쟀다.

```
button_main_wrap  transform
  matrix(1, 1.74533e-05, -1.74533e-05, 1, 0, 0)
→ matrix(1.04984, -0.018325, 0.018325, 1.04984, 0, 0)
```

풀면 `scale(1.05) rotate(-1.05deg)` 이다.
내가 넣었던 `translateY(-2px)` 는 추측이었고 틀렸다. 실측값으로 교체했다.

**원본의 호버 체계 자체도 알아냈다.** CSS 속성을 바꾸지 않는다.

```css
[data-trigger~="hover"]:hover { --_trigger---on: 0; --_trigger---off: 1 }
```

커스텀 속성을 뒤집고 다른 규칙이 그 값을 받아 보간한다.
그래서 일반 속성만 보면 "호버에 아무 변화 없음" 으로 읽힌다.


---

## 사진 (2026-09-28)

> 사용자 지시 원문: **"사진 깔끔스하게 채우기 ㄱㄱ"** · **"감도높은 사진을 핀터레스트에서 찾아서 긁어오기"**

플레이스홀더(그라디언트 `.ph`)를 실제 사진으로 바꿨다. 원본 사이트 사진은 한 장도 쓰지 않았다(원본이 쓴 컷으로 보이는 후보도 뺐다).

| | |
|---|---|
| 사진 | **37장** · Pinterest 30 · 스톡 7 (Unsplash 6 · Pixabay 1) |
| 용량 | 4.5 MB (긴 변 1600px 이하, JPEG 80%) |
| 후보 | 133장 수집 → 37장 채택 |
| 출처 기록 | `assets/photos/credits.json` — 자리 · Pinterest 핀 주소(열어서 같은 이미지인지 확인함) 또는 Unsplash/Pixabay 페이지 · 검색어 · 라이선스 · 명도 |
| 빌드 연결 | `assets/photos/photos.json` (파일 · 크기 · alt) → `build.mjs` 의 `ph(cls, cap, key)` 가 `<img width height loading>` 을 넣는다. 없는 키는 빌드가 멈춘다 |
| 로딩 | 첫 화면 히어로만 `fetchpriority="high"`, 나머지 `loading="lazy"`. 모든 `<img>` 에 width/height |

### 뺀 후보

- 실제 영화·드라마 스틸 — 해변 드라마 검색에서 나온 컷 대부분이 유명 작품 프레임이라 전부 뺐다. 유명 장면을 재현한 촬영장 컷도 뺐다
- 파파라치·레드카펫 셀럽 컷, 방송사 워터마크(TMZ)
- 콜라주(한 장에 3~4컷), 글자가 찍힌 포스터·잡지 레이아웃, 브랜드 로고(의류·카메라 라벨), 슬레이트에 적힌 글씨
- AI 생성으로 보이는 편집실 렌더
- 작업 상세에서 배너와 Featured 가 같은 사진이 되던 자리 → Featured Unit 칸을 다른 컷으로
- 추적 불가 2장 → 출처가 확인되는 컷으로 교체

### 사진 위 글씨 대비

크림색 글씨가 사진 위에 앉는 자리만 잰다(6페이지 15개). 전부 **4.5:1 이상** (최저 4.6 · 히어로 락업 `rivet &`).

| 자리 | 처리 |
|---|---|
| 360° 문장 `.vscroll__media::after` | .55 → .62 |
| 릴 영상 시간 표시 `.vid` · 히어로 사진 하단(락업이 걸침) | 사진 상자 안 하단 그라디언트 .7 |
| 서비스 카드 스택 | 기존 하단 그라디언트로 충분(최저 4.74) |

### 자리별

| 자리 | 파일 | 출처 | 명도 | 고른 이유 |
|---|---|---|---:|---|
| home hero photo card | `hero-still.jpg` | [Pinterest](https://www.pinterest.com/pin/46232333734430597/) | 34 | 원본 히어로 = 인물 스틸, 중간 명도. 익명 모델의 영화 스틸풍 인물 |
| home 360° statement (full-bleed under text) | `vscroll-set.jpg` | [Pinterest](https://www.pinterest.com/pin/41869471532228118/) | 53 | 원본 = 촬영 현장 카메라. 풀밭의 시네마 카메라, 오버레이 .62 위 크림색 대문자 |
| Harbour Line: card, dropdown, banner, featured | `work-harbour.jpg` | [Pinterest](https://www.pinterest.com/pin/152629874868051277/) | 47 | 작업 4건 — 카드 · 드롭다운 · 배너 · Featured 공용. 원본은 실제 방송 스틸이라 배우 얼굴 대신 현장 사진 |
| Night Shift: card, dropdown, banner, featured | `work-night.jpg` | [Pinterest](https://www.pinterest.com/pin/17099673582330318/) | 20 | 작업 4건 — 카드 · 드롭다운 · 배너 · Featured 공용. 원본은 실제 방송 스틸이라 배우 얼굴 대신 현장 사진 |
| Cold Open: card, dropdown, banner, featured | `work-cold.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%82%AC%EC%9A%B4%EB%93%9C%EC%8A%A4%ED%85%8C%EC%9D%B4%EC%A7%80-%EC%9E%91%EC%97%85-%EA%B3%B5%EA%B0%84%EC%97%90-%EC%9E%88%EB%8A%94-%EC%B4%AC%EC%98%81%ED%8C%80-br2HgQuvq6I) | 23 | 작업 4건 — 카드 · 드롭다운 · 배너 · Featured 공용. 원본은 실제 방송 스틸이라 배우 얼굴 대신 현장 사진 |
| Proving Ground: card, banner, featured | `work-proving.jpg` | [Pinterest](https://www.pinterest.com/pin/66709638230456986/) | 27 | 작업 4건 — 카드 · 드롭다운 · 배너 · Featured 공용. 원본은 실제 방송 스틸이라 배우 얼굴 대신 현장 사진 |
| Key Art: stack card, service card, featured | `svc-keyart.jpg` | [Pinterest](https://www.pinterest.com/pin/211174979034442/) | 21 | 서비스 이름 그대로(키아트 = 포스터풍 인물, 소셜 = 플래시 파티, 유닛 = 스튜디오 촬영, EPK = 인터뷰 의자, 편집 = 편집실, 행사 = 레드카펫) |
| Social Campaigns: stack card, service card, featured | `svc-social.jpg` | [Pinterest](https://www.pinterest.com/pin/1759287349492820/) | 35 | 서비스 이름 그대로(키아트 = 포스터풍 인물, 소셜 = 플래시 파티, 유닛 = 스튜디오 촬영, EPK = 인터뷰 의자, 편집 = 편집실, 행사 = 레드카펫) |
| Unit: stack card, service card, featured | `svc-unit.jpg` | [Pinterest](https://www.pinterest.com/pin/90283167527342923/) | 39 | 서비스 이름 그대로(키아트 = 포스터풍 인물, 소셜 = 플래시 파티, 유닛 = 스튜디오 촬영, EPK = 인터뷰 의자, 편집 = 편집실, 행사 = 레드카펫) |
| EPK: stack card, service card, featured | `svc-epk.jpg` | [Pinterest](https://www.pinterest.com/pin/220817187976508100/) | 21 | 서비스 이름 그대로(키아트 = 포스터풍 인물, 소셜 = 플래시 파티, 유닛 = 스튜디오 촬영, EPK = 인터뷰 의자, 편집 = 편집실, 행사 = 레드카펫) |
| Editorial: stack card, service card, featured | `svc-editorial.jpg` | [Pinterest](https://www.pinterest.com/pin/95912667058167207/) | 18 | 서비스 이름 그대로(키아트 = 포스터풍 인물, 소셜 = 플래시 파티, 유닛 = 스튜디오 촬영, EPK = 인터뷰 의자, 편집 = 편집실, 행사 = 레드카펫) |
| Activations: stack card, service card, featured | `svc-activations.jpg` | [Pinterest](https://www.pinterest.com/pin/5066618331503516/) | 18 | 서비스 이름 그대로(키아트 = 포스터풍 인물, 소셜 = 플래시 파티, 유닛 = 스튜디오 촬영, EPK = 인터뷰 의자, 편집 = 편집실, 행사 = 레드카펫) |
| /service/key-art banner | `sb-keyart.jpg` | [Pinterest](https://www.pinterest.com/pin/7318418142070975/) | 33 | 서비스 상세 배너 16:9 — 가로 컷 |
| /service/social banner | `sb-social.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%B9%B4%EB%A9%94%EB%9D%BC-%EC%A3%BC%EC%9C%84%EC%97%90-%EC%84%9C-%EC%9E%88%EB%8A%94-%ED%95%9C-%EB%AC%B4%EB%A6%AC%EC%9D%98-%EC%82%AC%EB%9E%8C%EB%93%A4-xKfS7Hll0Ck) | 23 | 서비스 상세 배너 16:9 — 가로 컷 |
| /service/unit banner | `sb-unit.jpg` | [Pinterest](https://www.pinterest.com/pin/626492998212099121/) | 62 | 서비스 상세 배너 16:9 — 가로 컷 |
| /service/epk banner | `sb-epk.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/person-sitting-in-front-bookshelf-KieCLNzKoBo) | 30 | 서비스 상세 배너 16:9 — 가로 컷 |
| /service/editorial banner | `sb-editorial.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EA%B1%B4%EB%AC%BC-%EC%95%88%EC%97%90-%EC%9E%88%EB%8A%94-%EB%82%A8%EC%9E%90%EC%9D%98-%EC%8B%A4%EB%A3%A8%EC%97%A3-%EC%82%AC%EC%A7%84-fGQJFXTfDto) | 14 | 서비스 상세 배너 16:9 — 가로 컷 |
| /service/activations banner | `sb-activations.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%96%B4%EB%91%A0-%EC%86%8D%EC%97%90%EC%84%9C-%EC%B9%B4%EB%A9%94%EB%9D%BC-%EC%A3%BC%EC%9C%84%EC%97%90-%EC%84%9C-%EC%9E%88%EB%8A%94-%ED%95%9C-%EB%AC%B4%EB%A6%AC%EC%9D%98-%EC%82%AC%EB%9E%8C%EB%93%A4-LP24lfRFKis) | 13 | 서비스 상세 배너 16:9 — 가로 컷 |
| home timeline 1998 | `cy-1998.jpg` | [Pinterest](https://www.pinterest.com/pin/220535713005229799/) | 35 | 원본 = 팀 사진 순환. 연도별 크루 사진 |
| home timeline 2007 | `cy-2007.jpg` | [Pinterest](https://www.pinterest.com/pin/1091278553487818518/) | 25 | 원본 = 팀 사진 순환. 연도별 크루 사진 |
| home timeline 2016 | `cy-2016.jpg` | [Pinterest](https://www.pinterest.com/pin/168673948538634725/) | 52 | 원본 = 팀 사진 순환. 연도별 크루 사진 |
| home timeline Today | `cy-today.jpg` | [Pinterest](https://www.pinterest.com/pin/533395149641658295/) | 24 | 원본 = 팀 사진 순환. 연도별 크루 사진 |
| home featured: Premiere | `premiere.jpg` | [Pinterest](https://www.pinterest.com/pin/41728734045155820/) | 30 | 홈 Featured 마지막 칸 Premiere |
| reel block (home, work, studios) | `reel.jpg` | [Pixabay](https://pixabay.com/photos/film-production-movie-production-237406/) | 64 | 릴 영상 자리 — 연기 속 시네마 카메라, 하단 오버레이 위 시간 표시 |
| work detail featured: Key art | `dr-keyart.jpg` | [Pinterest](https://www.pinterest.com/pin/5136987070927334/) | 21 | 작업 상세 Featured(키아트 · EPK · 소셜) |
| work detail featured: EPK | `dr-epk.jpg` | [Pinterest](https://www.pinterest.com/pin/2462974793507689/) | 31 | 작업 상세 Featured(키아트 · EPK · 소셜) |
| work detail featured: Social | `dr-social.jpg` | [Pinterest](https://www.pinterest.com/pin/914862421895834/) | 40 | 작업 상세 Featured(키아트 · EPK · 소셜) |
| service detail featured: Frame | `ds-frame.jpg` | [Pinterest](https://www.pinterest.com/pin/55802482886758955/) | 22 | 서비스 상세 Featured(Frame · On set · Grade) |
| service detail featured: On set | `ds-onset.jpg` | [Pinterest](https://www.pinterest.com/pin/10203536652515152/) | 39 | 서비스 상세 Featured(Frame · On set · Grade) |
| service detail featured: Grade | `ds-grade.jpg` | [Pinterest](https://www.pinterest.com/pin/1407443630034568/) | 19 | 서비스 상세 Featured(Frame · On set · Grade) |
| /studios banner | `studios-wide.jpg` | [Unsplash](https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EA%B0%88%EC%83%89-%EA%B3%A8%ED%8C%90%EC%A7%80-%EC%83%81%EC%9E%90%EC%97%90-%EA%B2%80%EC%9D%80-dslr-%EC%B9%B4%EB%A9%94%EB%9D%BC-KfMj3fi4R4s) | 54 | Studios 배너 |
| studios featured: Brand film | `st-brand.jpg` | [Pinterest](https://www.pinterest.com/pin/425942077281552918/) | 26 | Studios Featured(브랜드 필름 · 뮤직 · 라이브 · 제품) |
| studios featured: Music | `st-music.jpg` | [Pinterest](https://www.pinterest.com/pin/245235142207939903/) | 18 | Studios Featured(브랜드 필름 · 뮤직 · 라이브 · 제품) |
| studios featured: Live | `st-live.jpg` | [Pinterest](https://www.pinterest.com/pin/13862711351227923/) | 42 | Studios Featured(브랜드 필름 · 뮤직 · 라이브 · 제품) |
| studios featured: Product | `st-product.jpg` | [Pinterest](https://www.pinterest.com/pin/563018699150388/) | 24 | Studios Featured(브랜드 필름 · 뮤직 · 라이브 · 제품) |
| /about banner | `about-wide.jpg` | [Pinterest](https://www.pinterest.com/pin/2040762329372098/) | 65 | About 배너 — 안개 낀 들판의 촬영 크루 |
| Studios dropdown | `dd-studios.jpg` | [Pinterest](https://www.pinterest.com/pin/10203536652708152/) | 23 | Studios 드롭다운 썸네일 |

---

## impeccable — 전 페이지 검사 (2026-09-29)

처음 게이트는 `index.html` 하나만 돌렸다. 17페이지 HTML 전부 + `assets/site.css` 로 다시 돌렸다.

```bash
npx --yes impeccable@latest detect --json $(find works/2026-W39/clone-02-lxl-creative -name "*.html" -not -path "*/refs/*") $(find works/2026-W39/clone-02-lxl-creative/assets -name "*.css")
```

| 규칙 | 전 | 후 |
|---|---:|---:|
| low-contrast | 122 | 1 (큰 글씨 — 아래) |
| clipped-overflow-container | 17 | 0 |
| cramped-padding | 8 | 0 |
| skipped-heading | 3 | 0 |
| tight-leading | 5 | 5 (원본 실측 — 아래) |
| all-caps-body | 1 | 1 (원본 실측 — 아래) |
| bounce-easing | 1 | 0 |
| **합계** | **157** | **7** |

설정 파일(`.impeccable/config.json`)·인라인 무시 주석은 쓰지 않았다.
관성 스크롤 수정(`html.js-smooth{scroll-behavior:auto}` · `site.js` 휠 핸들러)은 건드리지 않았다.

### 고친 것

| 규칙 | 원인 | 처리 |
|---|---|---|
| low-contrast 흰 글씨 / `#ff5121` (38) · 호버 `#ff6a3f` (83) | 필 버튼 · 영상 재생 버튼. 흰 글씨 3.3:1 · 호버 2.8:1 (15.43px 라 큰 글씨 아님) | 주황은 그대로, 글씨를 `--on-orange:#27201d`(사이트 바탕 갈색)로 — **4.9:1 · 호버 5.6:1**. 원본은 흰 글씨(`refs/home/03-card-stack_wrap.jpg` "All services")지만 대비는 원본이 낮아도 고친다(PROTOCOL 4-5). 원본에도 갈색 글씨 버튼이 있다 — `measure.json` 15.43px `#27201d` "Steal" · 14.43px `#27201d` "Discover LxL Studios" |
| clipped-overflow-container `body` (17) | `body{overflow-x:clip}` 이 헤더 드롭다운(`.dd`, absolute)을 자를 수 있는 구조 | 삭제. `verify-site` 1440/768/390 가로 넘침 0 확인 |
| cramped-padding `vid` (6) | 영상 자리 바탕 위에 자식이 붙음 | `padding:20px`. 자식(사진·재생 막대·재생 버튼)이 전부 absolute 라 화면 동일 |
| cramped-padding `acc` (2) | 목록 윗선이 부모 `border-top` | 첫 `.acc-i` 의 `border-top` 으로. 화면 동일 |
| skipped-heading (3) | `/contact` `h1` 다음 푸터 제목 `h3` · `/work` `/services` 카드 제목 `h3` | 푸터 열 제목(Work · Services · Company) 전 페이지 `h2`, `/work` `/services` 카드 제목 `h2`. 스타일 선택자에 `h2` 추가 — 화면 동일 |
| bounce-easing (1) | `--ease-back: cubic-bezier(.35,1.75,.6,1)` — 원본 실측 곡선(`refs/origin.md` ×15)이지만 **모작 어디에서도 안 쓰는 변수** | 삭제. 쓰는 곳이 생기면 원본 값 그대로 다시 넣는다 |

### 남긴 것 — 근거

| 규칙 | 자리 | 근거 |
|---|---|---|
| low-contrast ×1 `#055dff on #27201d` 3.1:1 | `/studios` `.scr-blue` "Studios" | **큰 글씨라 3:1 기준.** `font-size:clamp(56px,7.1vw,101.7px)` — 가장 작을 때 56px. 탐지기는 clamp 를 못 풀어 본문(4.5:1)으로 본다. 렌더 실측 1440px **3.06:1** · 390px **3.06:1** (평면 바탕 계산값 3.07). 원본 실측 색 `#055dff` · Scribo 101.7px (`measure.json` "Studios") |
| tight-leading ×3 (1.06x) | 홈 `.cstack__left .lead` · 홈 `.icycle .lead` · `/studios` `.lead` | 원본 리드 문단 28.57px Manrope 600 `lh 28.568px`(**1.0**) — `measure.json` "From a garden shed…". 모작 1.16 으로 원본보다 느슨하다 |
| tight-leading ×1 (0.92x) | 홈 후기 `blockquote.d-2` | 원본 42.3px Owners Wide `lh 42.296px`(**1.0**) — `measure.json` "Through every twist, turn". 모작 1.0 |
| tight-leading ×1 (1.02x) · all-caps-body ×1 | 홈 `.vscroll__say` | 원본 `video-scroll_wrap` 문장 — 대문자(SPEC 섹션 순서 2번 `LXL PRODUCES 360° CREATIVE CAMPAIGNS…`), 54.86px `lh 49.38px`(**0.9**, `measure.json`). 모작 1.02 로 원본보다 느슨하다. 62px 디스플레이 크기 |

### 탐지기가 못 보는 것 — 렌더 실측으로 같이 고친 것

사진 위 흰 글씨를 390 · 768 · 861 · 1024 · 1280 · 1440px 에서 쟀다(글씨를 투명하게 하고 글씨 상자 뒤 픽셀의 밝은 쪽 95퍼센타일).
`.cstack__card h3` · `.vscroll__say` · `.hero-lockup` 은 1440 · 390px 통과. 영상 자리 재생 막대 시간(`.vid-bar .t`, 흰 16px)이 걸렸다.

| 폭 | 전 | 처리 | 후 |
|---|---:|---|---:|
| 390px | 2.76 | 860px 이하 스크림 40%→82% .9 | 10.40 |
| 861 · 1024px | 4.19 · 4.45 | 막대 자리만 짙게 (55% → 86% .72 → .88) | 8.21 · 8.61 |
| 1440px | 4.98 | 〃 | 9.42 |

히어로 사진(`.hero-photo`)은 같은 규칙을 쓰지만 글씨가 없어 그대로 두었다.

### 확인

- `node scripts/verify-site.mjs http://127.0.0.1:4372` — 18페이지, 콘솔 에러 0 · 가로 넘침 0 · `href="#"` 0 · h1 전부 1개
- 전후 스크린샷 `refs/mine/detect-before-*.jpg` / `detect-after-*.jpg` (홈 · `/studios` · `/contact`). 문서 높이 전후 동일(14471 · 4510 · 1497). 픽셀 차이는 필 버튼 글씨색 · 영상 자리 아래 스크림뿐
- 필 버튼 호버 글씨 `#27201d` 확인. `html.js-smooth` 유지 확인
