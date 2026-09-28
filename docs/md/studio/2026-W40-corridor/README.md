# CORRIDOR — 창작 (모작 아님)

가상의 야간 침대열차 운영사. 영어 사이트. 2026-09-28.
기획: [`research/2026-W40/build-concepts.md` §2](../../research/2026-W40/build-concepts.md)

## 한 줄

Routes · Cabins · Fares · Timetable · Book. 운행표 타이포그래피로 짠 야간열차 예약 사이트.

## 소재

열차 운행표는 고정폭 숫자·괘선·정렬만으로 정보가 서는 타이포그래피 교본이다.
내용이 전부 사실 형태(시각, 정차역, 객실, 운임)라 꾸밀 말이 없다.
HALIDE 가 "스펙 표"였다면 이번엔 **시간 축이 있는 표**다.

역·도시는 실제. 운영사·열차 번호(CR 401 등)·시각·운임·좌석 수는 지어냈다.
실존 운영사 이름·노선명·열차명·로고·배색은 쓰지 않았다.
운임은 실제 야간열차 대역에 맞췄다 — 좌석 €34~44, 쿠셋 €59~94, 침대 €122~279.

## 토큰

| 역할 | 값 | 바탕 대비 (실측) |
|---|---|---|
| 종이 | `#EFEFEA` | 무채색 승차권 용지. 처음 `#F2EFE6`(크림)은 impeccable `cream-palette` 에 걸려 교체 |
| 잉크 | `#141517` | **15.84:1** |
| 잉크 2 | `#55544F` | **6.58:1** |
| 괘선 | `#D6D2C6` | 글자에 안 씀 |
| 신호 | `#C21F2B` | **5.16:1** — "Departs in …" 한 곳 + 오류 메시지만 |
| 밤 (반전) | 잉크 바탕 / 종이 글자 | **15.84:1** |
| 밤 보조 | `#B9B5A9` on `#141517` | **8.91:1** — 야간 구간 승강장 번호 |

대비는 9개 페이지의 보이는 텍스트 노드 전부를 돌며 계산한 실제 색 조합의 최저값이다. 4.5:1 미만 없음.

- 서체: **Barlow** 400–600 제목·본문 — 도로·철도 표지의 DIN 계열. 처음 Instrument Sans 는 impeccable `overused-font` 에 걸려 교체, **IBM Plex Mono** 400/500 시각·열차 번호·수치 (`tabular-nums`)
- 괘선 1px, 그림자 없음, 모서리 0, 그라데이션 없음 (CSS 에 `gradient` 0개)

## 페이지 (12)

```
/                          홈 — 히어로(Amsterdam 21:14 / Vienna 08:52) · Tonight 출발 8편 · 노선 4 · 객실
/routes/                   노선 — 출발 도시 칩 필터
/routes/amsterdam-vienna/  노선 상세 ×4 — 사실 · 밤 축 막대 · 정차역(노선도) · 복편 · 7일 잔여석
/routes/brussels-prague/
/routes/hamburg-zurich/
/routes/berlin-budapest/
/cabins/                   객실 — Seat / Couchette / Sleeper 탭, 평면도 SVG
/fares/                    운임 — 계산기 + 전체 운임표
/timetable/                운행표 — 4노선 × 양방향, Mon–Thu / Fri–Sun 토글
/book/                     예약 — 3단계 폼 + 승차권 요약
/help/                     FAQ 8개
/about/                    소개 · 사실표
```

`node build.mjs` 가 데이터에서 12장을 만든다. 손으로 쓰지 않는다.
복편 시각은 편도 구간 소요를 거꾸로 쌓아 계산하고, 주말 시각은 노선별 지연분(+0/+30/+0/+20분)을 더해 만든다.

링크는 전부 상대경로 + `index.html`. **더블클릭(file://)으로 열어 전 페이지를 오간다** (실측).

## 모션 — 둘만

| | 무엇 | 어떻게 |
|---|---|---|
| 1 | 노선도 | 정차역 행마다 선 조각이 `view-timeline` 으로 그려지고, 점이 차례로 켜진다. 범위 `entry 40vh → entry calc(100% + 40vh)` — 선 끝이 항상 화면 60% 높이에 있다 |
| 2 | 페이지 전환 | 문서 간 View Transitions. 노선 카드의 막대(`view-transition-name: bar-<노선>`)가 상세의 넓은 막대로 늘어난다 |
| 부 | SMIL 노선 아이콘 | 홈·노선 목록. 정차역마다 멈췄다 가는 사각형. `animateMotion` 의 keyPoints/keyTimes 를 노선 시각에서 계산(이동 80% · 정차 20%). JS 없음 |

- `animation-timeline` 미지원 브라우저: 애니메이션이 `@supports` 안에만 있어 기본 스타일(선 다 그려짐, 점 다 켜짐)로 보인다
- `prefers-reduced-motion: reduce`: 스크롤 애니메이션 0개, SMIL `pauseAnimations()`, View Transition 꺼짐
- file:// 에서는 View Transition 을 켜지 않는다. file:// 는 opaque origin 이라 Chrome 이 매 이동마다 콘솔 에러를 찍는다. 그래서 `@view-transition` 을 CSS 가 아니라 `<head>` 인라인 스크립트가 http(s) 일 때만 넣는다
- 스크롤 등장 연출, 호버 트랜지션 없음

## 기능 — Playwright 로 눌러서 확인

| 기능 | 결과 |
|---|---|
| 출발 도시 필터 | Cologne → 2노선, 시각이 쾰른 출발 시각(00:04, 22:52)으로 바뀜 · Dresden 2 · Hamburg 1 · Frankfurt 2 · All 4. `aria-pressed`, 결과 수 `aria-live`, `?from=` URL 유지 |
| 객실 탭 | →→→ 순환, ← 역순, Home/End. `aria-selected`·roving `tabindex`·패널 `hidden` 동기화, 도면 SVG 교체 |
| 운임 계산기 | 선택 즉시 재계산. 예: Hamburg–Zürich, Couchette 4, 성인 2 + 아동 3, 카드 −25% → €246.75, 객실 2칸 |
| 요일 토글 | Mon–Thu/Fri–Sun, `aria-pressed`. 주말: Bruxelles-Midi 20:32 → 21:02, 바뀐 시각 38개 밑줄. 오늘 요일로 초기 선택 |
| 3단계 예약 | 빈 1단계 → "Choose a train" "Choose a travel date" + `aria-invalid` + 첫 오류로 포커스 · 2단계 빈 객실 → "Choose a cabin" · 8명 → "Up to 6 passengers per booking" · Back 후 값 유지 · 3단계 이메일 `nope@` → "Check the email address" · 전부 통과 시 제출 차단, "Not sent. … no ticket was issued" 표시. 단계 표시 `aria-current="step"` |
| 승차권 요약 | 입력마다 갱신. 금요일 CR 431 → 19:40 이 아니라 20:00 (주말 시각 반영) |
| 정차역 모달 | `<dialog>`. 열림 · ESC 닫힘 · 바깥 클릭 닫힘 · 안쪽 클릭 유지 · Close 닫힘 · 닫힌 뒤 누른 역 버튼으로 포커스 복귀 |
| FAQ | 클릭·Enter·Space 로 펼침/접힘, `aria-expanded` + `hidden` |
| 모바일 버거 (390) | 열림 시 `aria-expanded=true`, `html` overflow hidden, 휠 800px 에도 scrollY 0 · ESC 닫힘 · 드로어 링크 이동 |
| Tonight 보드 | Europe/Berlin 시각 기준 다음 출발에 빨간 "Departs in 14 h 9 min". 30초마다 갱신. 금–일이면 주말 시각 |
| 스크롤 노선도 | `getAnimations()` 21개가 `ViewTimeline` 에 붙음. 스크롤 380px 에서 Frankfurt 까지 켜지고 Nürnberg 이하 꺼진 상태 확인 |
| View Transition | http: `pageswap.viewTransition` 있음, `::view-transition-group(bar-berlin-budapest)` 생성 확인 · reduce: 없음 · file://: 없음, 콘솔 에러 0 |
| 포커스 링 | `:focus-visible` 2px 잉크 실선, 야간 행에서는 종이색 |

## 게이트

```
node scripts/verify-site.mjs http://127.0.0.1:4304
  페이지 42개 검사 (쿼리 변형 포함)
  문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개

npx impeccable detect (이 폴더에서, 12 html + site.css)
  exit 0
```

한국어는 화면에 없다 (Hangul 0자). `check-korean.mjs` 해당 없음.

## impeccable 처리 내역

처음 46건. 고친 것:

- `clipped-overflow-container` ×12 — `body{overflow-x:clip}` 이 스킵 링크·드로어를 자를 수 있음 → 제거. 넘침은 0 유지
- `cramped-padding` ×9 — FAQ 행이 괘선에 붙음 → `.faq` 위, `.q` 위아래 8px
- `all-caps-body` ×1 — 운임표 설명 문장이 대문자 라벨 스타일 → 일반 소문장으로

**남은 2건은 예외로 걸지 않고 값을 바꿨다.** 처음에는 `.impeccable/config.json` 으로 억제했으나 걷어냈다.

- `overused-font` Instrument Sans → **Barlow**
- `cream-palette` `#F2EFE6` → **`#EFEFEA`**

두 값은 기획서(`build-concepts.md` §2)가 정한 것이었다. 기획이 AI 기본값을 골랐던 것이라 기획서도 같이 고쳤다.
weblab 루트에서 예외 없이 `detect` — **발견 0, exit 0.**

## 작업 중 실제로 틀렸던 것

- **클래스 이름 충돌 2개.** 헤더 `.bar` 와 노선 막대 `.bar`, 요일 토글 `.seg` 와 노선 선 조각 `.seg`. 빌드 전에 발견 → `.rbar`, `.ln`
- **점 색 애니메이션이 화면에 안 그려짐.** `background-color` 를 스크롤 타임라인으로 바꿨더니 computed 는 종이색인데 스크린샷에는 채워진 점이 찍혔다. 선(`transform`)은 정상 → 점 채움도 `::after` 의 `transform: scale()` 로 바꿈
- **날짜 입력에 한국어가 나옴.** `<input type=date>` 의 자리표시자가 OS 언어로 "연도-월-일". 영어 사이트에 한국어가 섞임 → 다음 90일 `<select>` 로 교체
- **말이 안 되는 주말 공지.** Berlin–Budapest 에 "Extra stop in Dresden" 이라고 썼는데 드레스덴은 이미 정차역 → 공사 구간 공지로 수정
- **예약 요약이 주말 시각을 무시.** 토요일 CR 411 이 20:32 로 나옴 → 날짜 요일로 주말 지연 반영 (21:02)
- 운행표 머리글 "CR 401 ↓" 가 두 줄로 꺾임 → `nowrap`

## 한계 · 안 한 것

- `animation-timeline` 미지원 브라우저(Firefox·Safari 일부)에서 직접 열어보지 않았다. `@supports` 구조상 정지 상태로 보이는 것은 reduce 경로(같은 기본 스타일)로만 확인
- 문서 간 View Transitions 는 Chromium 계열만 동작. 다른 브라우저는 그냥 이동
- 객실 평면도 3종의 외곽 치수(2 000 × 1 600 mm)가 같다. 내부 배치만 다르다
- 7일 잔여석은 노선 이름을 시드로 한 결정적 난수. 날짜 라벨만 오늘 기준으로 JS 가 채운다

## 파일

```
build.mjs        12페이지 생성기 (데이터 · 복편/주말 시각 계산 · SMIL 아이콘 · 평면도)
assets/site.css
assets/site.js   필터 · 탭 · 계산기 · 토글 · 3단계 폼 · 모달 · FAQ · 버거 · Tonight 보드
.impeccable/     detect 예외 2건 (이유 포함)
refs/            home-1440 · home-390 · route-1440-scrolled · route-modal · routes-filter-cologne
                 cabins-sleeper · fares · timetable-fri-sun · book-errors · help-open · menu-390
```
