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
