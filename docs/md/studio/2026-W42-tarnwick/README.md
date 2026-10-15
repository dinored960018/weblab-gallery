# Tarnwick Locks — 영어 창작 (2026-W42, 목요일 2026-10-15)

가상 운하 Tarnwick Canal 의 좁은 갑문 11개 연속 구간(flight) 안내 사이트. 방 치수 · 낙차 · 채우는 시간 · 공사 폐쇄 · 통행 요금 · 계류장을 펼친 장부 두 면에 싣고, 배가 들어가는지 · 언제 빠져나오는지 · 요금이 얼마인지를 서버 없이 계산한다.

- 기획서: research/2026-W42/build-concepts.md §7 (무인 모드 상시 승인)
- 포트 4413 · `node scripts/serve.mjs studio/2026-W42-tarnwick 4413` 또는 `index.html` 더블클릭(링크는 전부 `…/index.html` 상대 경로. file:// 로 홈 → Will it fit(계산) → Stoppages → 홈 이동을 눌러서 확인)
- 빌드: `node build.mjs` 한 번으로 12쪽 + `assets/data.js` + `assets/calc.js` 재생성. 계산 함수는 `calc.mjs` 하나를 빌드와 브라우저가 같이 쓴다(빌드가 export 를 떼어 `assets/calc.js` 로 복사)
- 빌드 검사: 화면 문구가 인용하는 수치(FAQ 의 "about 3 h 10 min", 홈 · FAQ 의 "18.4 m … Locks 3 and 4 … will not fit")가 계산값과 어긋나면 `build.mjs` 가 멈춘다
- 고정 시각: Thursday 15 October 2026, 09:00 BST
- 이름 확인은 기획서(concept 단계)에서 함: `"Tarnwick Locks" canal` 등 → 같은 이름의 갑문 · 운하 · 지명 없음. 메일 `keepers@tarnwick.example`, 전화 · 주소 없음

## 기획 요지 — 지난 창작과 다른 점

| 항목 | Tarnwick Locks | 직전 창작 Harnscombe Ringing Centre | 직전 창작 이랑골 청과 공판장 |
|---|---|---|---|
| 레이아웃 | 펼친 장부 두 면. 가운데 점선 접힘, 왼쪽 면(verso)은 쪽 색인 12 + 갑문 번호 색인 11 + 도판, 오른쪽 면(recto)은 본문. 쪽머리(Index / Folio 03 · 날짜)와 바닥 쪽번호(홀수 · 짝수). 1180 px 아래는 오른쪽 면 먼저 한 면씩 | 번호 매긴 세로 열 16개 격자 — 열 번호가 내비 | 12단 격자 위 계단식 대각 흐름 + 왼쪽 빈 삼각의 단 번호 |
| 바탕 | 라일락 책상 `#B8B2D4` 위 종이 면 `#F8F6FB` 두 장, 아래 테두리 이중선 | 적갈색 전면 `#6E1B22` | 버터 노랑 `#F3EBB8` + 먹녹 패널 |
| 색 | 먹 `#16131F` + 이끼 초록 `#2C6A3A` 하나(열림 · 선택 · 링크 · 지금 쪽). 폐쇄는 초록이 아닌 먹 면 + "Closed" 글자 | 크림 글자 + 하늘색 `#9FC9E8` | 먹녹 + 자두 보라 `#5B1F4A` |
| 이미지 | 값에서 계산한 SVG 도면이 주인 — 갑문 단면(수위 움직임) · 구간 종단(계단 수위) · 평면 띠(갑문 · 계류장). 사진 9장은 왼쪽 면 도판(Plate n) | 종탑 도판 + 줄 격자 SVG | 청과 실물 사진 13장 주인 |
| 서체 | Libre Caslon Text(제목 · 쪽머리 · 갑문 번호) + Public Sans(본문 · 표 · 폼), 고정폭 없음 | Fraunces + DM Mono | Do Hyeon + Sunflower |
| 모션 | 장부 넘김(문서 간 View Transition, 오른쪽 면만 300 ms 덮임) · 방 수위(Fill 누르면 채우는 시간에 비례해 최대 4 s) | 파란 선 그리기 | 경매 시계 가격 하락 + 계단 단 들어옴 |
| 특이 기능 | 배 들어가나 · 통과 완료 시각 · 요금 · 폐쇄 달력 · 지금 근무 | 변주 계산 | 0.1초 하향 경매 시계 |

겹치는 점(기획서에 밝힌 대로): 초록이 저울마루의 합격 녹색 · 종자 달력 Sage 와 비슷하지만 여기서는 판정 의미 없이 열림 · 선택 · 링크 하나에만 쓴다. 책상 위 종이 면은 Marrowby(마닐라 책상 + 서류철)와 닮았으나 이번은 탭 없는 두 면 장부 + 접힘선이고 책상색 · 서체 · 모션이 다르다. 계산 도면은 Kerfmoor 재단 도면 · Holmscar 해도와 같은 계열. 직전 두 창작과는 레이아웃 · 바탕 · 색 · 서체 · 모션이 모두 다르다.

## 페이지 (12)

| 경로 | 무엇을 전달하나 |
|---|---|
| `/` | 09:00 상태 — "Open. 9 of 11 locks working, 2 restricted. Last boat through at 08:40." + 수위 · 근무 · 다음 폐쇄, 오늘 제한 2건, 종단 도면, 11개 갑문 한 줄 요약, 계산 예시 3(Will it fit · Passage · Tolls) |
| `/flight/` | 갑문 하나 고르기(1~11 단추) → 이름 · 단면 도면 · 12항목 수치, 11개 전체 표(낙차 · 길이 · 문턱 위 수심 · 채우는 시간 · 물 m³ · 연못 · 상태), 종단 도면. 27.6 m 낙차, 한 번 올라가는 데 1,261 m³ |
| `/locks/` | 갑문 고르기 — 이름 · 번호 검색, 상태, 낙차 범위 3구간, 연못 단추, 정렬 3종 |
| `/fit/` | 배 들어가나 — 길이 · 폭 · 흘수 → 문장 판정 + 갑문별 표(최대 길이 · 폭 · 흘수 / 내 배) |
| `/passage/` | 통과 계획 — 출발 쪽 · 첫 갑문 도착 시각 · 앞 배 수 → 완료 예상 시각, 경고, 요약 6줄, 갑문별 들어가고 나오는 시각 |
| `/tolls/` | 요금 — 배 길이 · 단순/왕복/계류 포함 · 일수 → 파운드 합계와 근거 줄, 요율표 |
| `/stoppages/` | 폐쇄 — 날짜 입력 또는 달력(2026년 10월 ~ 2027년 3월, 6개월) → 그날 닫힌 갑문 · 사유 · 재개일, 전체 6건 표 |
| `/moorings/` | 계류장 6곳 — 평면 띠 도면(구간 m), 표(사이 갑문 · 구간 · 길이 · 급수 · 체류), 쪽 · 메모 |
| `/keepers/` | 근무 — 시간표(11월 1일까지 / 11월 2일부터) · 요일 · 시각 → 근무 중인지, 다음 근무 시작, 요일별 표, 교대 6항목 |
| `/rules/` | 규칙 — 숫자만. 통과(한 방에 1척 · 최대 길이 · 폭 · 흘수 · 마지막 진입) · 속도 · 패들 · 문과 시간 |
| `/faq/` | 9문항 `details` |
| `/about/` | 가상 사이트 고지 4줄 · 수치 근거 8줄 · 사진 출처 표 |

## 기능 (실제 동작)

- **배 들어가나** (`/fit/`) — 길이 6~25 m(0.1 단위) · 폭 1.00~3.00 m · 흘수 0.30~1.50 m. 빈 값 · 범위 밖이면 칸 아래 "Error: Enter a length between 6 and 25 m." + `aria-invalid` + `aria-describedby`, 제출 시 첫 오류 칸으로 포커스, 결과는 "Fix the fields marked Error…". 판정: 길이 > 방 길이, 폭 > 방 폭 − 0.07 m, 흘수 > 문턱 위 수심 − 0.10 m. 같은 한계끼리 묶은 문장("Your boat is 18.4 m. Locks 3 and 4 take 18.0 m. They will not fit." + "2 of 11 locks will not take this boat…"), 표의 안 되는 줄은 빨강 + "No: 0.4 m too long". `?len=&beam=&draft=` 기록 · 복원. 390 px 에서는 갑문마다 한 덩어리(길이 · 폭 · 흘수 + 판정)로 쌓여 판정이 화면 안에 남는다
- **통과 계획** (`/passage/`) — 출발(아래 · 위 라디오), 도착 시각 `HH:MM` 06:00~20:00, 앞 배 0~10. 갑문마다 채우는 시간(내려갈 때 1분 덜) + 문 5분 + 제한 가산(10번 +5분), 갑문 사이 연못 길이 ÷ 40 m/분, 앞 배 1척당 18분. 예: 09:30 아래에서 · 앞 배 2 → about 13:15, 앞 배 없이 올라가면 3 h 9 min(FAQ "about 3 h 10 min" 과 빌드에서 대조). 오늘(목) 근무 08:00~16:00 기준 경고 3종(근무 전 · 마지막 진입 13:00 이후 · 16:00 뒤까지 걸림). `?from=&at=&queue=` 기록 · 복원
- **갑문 고르기** (`/locks/`) — 이름 · 번호 검색(입력마다), 상태 · 낙차 select, 연못 단추(`aria-pressed`), 정렬 번호 · 낙차 큰 순 · 채우는 시간 짧은 순. 결과 수 `aria-live`("4 locks"), 0건이면 "No lock matches these filters." + Clear filters(포커스는 검색 칸으로). `?q=&status=&fall=&pond=&sort=` 기록 · 복원
- **요금** (`/tolls/`) — 길이 대역 12 m 미만 £14 · 18 m 미만 £19 · 그 이상 £24. 왕복은 7일 안에 돌아오면 두 번 합계의 25 % 할인, 계류 포함은 m당 1박 £0.50. 단순이면 일수 칸 비활성 · 라벨이 "Days (not used for a single passage)" 로 바뀜. 근거 줄 표(할인은 −) + 합계. 예: 18.4 m 왕복 3일 £36.00, 계류 2박 £42.40. `?len=&mode=&days=` 기록 · 복원
- **폐쇄 달력** (`/stoppages/`) — 날짜 `YYYY-MM-DD` 입력(형식 · 실재 날짜 검사) 또는 달력 날 단추(`aria-pressed`, 닫힌 날은 먹 면). 그날 닫힌 갑문 · 사유 · 기간 · 재개일, 오늘이면 제한 갑문도 표시, 범위(2026-10-01 ~ 2027-03-31) 밖이면 범위 안내. `?date=` 기록 · 복원
- **지금 근무** (`/keepers/`) — 시간표 · 요일 · 시각 → "Keeper on duty until 16:00." 또는 "No keeper on duty. Next on duty Thursday at 09:00." + 구간이 열렸는지 · 체인으로 묶였는지. `?season=&day=&at=` 기록 · 복원
- **방 수위** (`/flight/`) — 갑문 번호 단추(`aria-pressed`, `?lock=` 복원 · 기록), 왼쪽 면 갑문 색인에도 현재 갑문 표시(`aria-current`). Fill/Empty 단추와 상태 문장(`aria-live`)
- **공통** — 건너뛰기 링크(`#main`), 1180 px 아래 Index 단추 → 왼쪽에서 나오는 색인 시트(`role="dialog"`, 닫기 단추로 포커스, Tab 순환, Esc · 바깥 클릭 · Close 로 닫힘, 닫히면 Index 단추로 포커스 복귀, 열린 동안 배경 스크롤 잠금, 창이 넓어지면 자동 닫힘), FAQ `details`, 현재 쪽 `aria-current="page"`, `href="#"` 없음, 포커스 링 먹 3 px

## 토큰 (WCAG 상대 휘도 식으로 계산, 2026-10-15)

| 역할 | 값 | 대비 |
|---|---|---|
| 책상 / 먹(머리 · 바닥 글자) | `#B8B2D4` / `#16131F` | 9.03 |
| 종이 / 먹(본문) | `#F8F6FB` / `#16131F` | 17.06 |
| 종이 / 보조 글자(설명 · 표 머리 · placeholder 없음) | `#4A4560` | 8.47 |
| 종이 / 이끼 초록(링크 · 열림 · 지금 쪽) | `#2C6A3A` | 6.06 |
| 초록 면 / 종이 글자(누른 단추 · 연못 단추) | `#2C6A3A` / `#F8F6FB` | 6.06 |
| 먹 면 / 종이 글자(Closed · 닫힌 날 · 주 단추) | `#16131F` / `#F8F6FB` | 17.06 |
| 종이 / 빨강(오류 · 안 되는 줄 · 경고) | `#8E1F2B` | 8.22 |
| 옅은 면(hover · 오늘 줄) / 먹 · 보조 · 초록 | `#ECE9F3` | 15.27 · 7.58 · 5.42 |
| 괘선 | `#CFCBD8` | 장식 선(글자 아님) |

그라데이션 · 그림자 없음. 모서리 0. 상태는 색만 쓰지 않는다 — Open(초록 테 글자) · Restricted(먹 테 이탤릭) · Closed(먹 면 + 글자). 숫자는 `tabular-nums`.

## 서체

- **Libre Caslon Text** 400 · 400 italic · 700 — h1 `clamp(2.25rem, 1.5rem + 2.2vw, 3.25rem)` · h2 700 1.375rem · 결과 문장 1.625rem · 갑문 번호 · 쪽머리 이탤릭 0.9375rem · 쪽번호 이탤릭
- **Public Sans** 400~700 — 본문 1rem/1.55 · 표 0.9375rem · 폼
- Google Fonts CSS 응답 200 확인(2026-10-15, `family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Public+Sans:wght@400..700`). 대체 서체 Georgia · system-ui

## 모션 — 둘

1. **장부 넘김** — `@view-transition { navigation: auto; }` + `.recto { view-transition-name: recto }`. 루트와 왼쪽 면은 그대로 두고 새 오른쪽 면만 `clip-path: inset(0 100% 0 0) → inset(0)`, 300 ms, `cubic-bezier(0.22, 1, 0.36, 1)`. 스크립트 세 개를 `defer blocking="render"` 로 두어 site.js 가 결과를 채운 뒤의 화면이 넘어온다. Playwright 로 링크를 눌러 `pagereveal` 의 `viewTransition` 이 생기고 `finished` 가 정상 끝나는 것, 링크를 120 ms 간격으로 연달아 눌러도 콘솔 오류가 없는 것을 확인
2. **방 수위** — 단면 SVG 의 물 사각형을 `translateY(낙차 × 34 px) → 0`. 시간 = min(4 s, 채우는 시간(분) × 400 ms) — 9번(10분) 4.0 s, 3번(6분) 2.4 s. 이징 `cubic-bezier(0.45, 0, 0.55, 1)`. 끝나면 "Chamber full, level with the upper pound, 2.9 m above the lower."

`prefers-reduced-motion: reduce` 이면 1은 즉시 교체, 2는 0 ms(최종 수위만). 스크롤 등장 연출 없음.

## 사진 (9장, 전부 왼쪽 면 도판 · `credits.json`)

`node scripts/fetch-stock.mjs` 로 받은 Unsplash(무료분, 원본 주소 `images.unsplash.com`) 7장 · Pixabay 2장. 표기 의무 없는 라이선스.

| 파일 | 쪽 | 손본 것 |
|---|---|---|
| `flight.jpg` | 홈 | 오른쪽 끝 로고 표지 잘라냄(x 0–1400) |
| `chamber.jpg` | The flight | — |
| `beams.jpg` | Find a lock · Rules | — |
| `tail.jpg` | Will it fit | 오른쪽 빔 끝의 갑문 번호판 두 개 잘라냄(x 0–1130) |
| `weir.jpg` | Passage | 위쪽 걷는 사람들 · 빔의 표지 잘라냄(y 600–1200) — 이번 세션에서 표지판 글자가 찍힌 앞 사진을 바꿈 |
| `sunrise.jpg` | Tolls | — (빠진 `bridge.jpg` 자리) |
| `pound.jpg` | Stoppages · Questions | — |
| `mist.jpg` | Moorings | 왼쪽 배의 이름 글자 잘라냄(x 440–1600) |
| `cottage.jpg` | Keepers | — |

## 이번 세션에서 한 것 — 이전 시도 이어받기

이 폴더는 같은 기획서로 두 번 시도된 흔적이 있었다(11:12~11:35 첫 시도: 12쪽 · 계산 · 테스트까지, 14:08~14:14 두 번째 시도: Pinterest 사진을 스톡으로 바꾸던 중 멈춤). README 가 없고 빌드가 깨진 상태였다. 새로 만들지 않고 이어받아 아래를 고쳤다(무인 모드 · 보수적 판단: 기획서와 같은 결과물을 버리고 다시 만들 이유가 없음).

- **빌드 실패** — 두 번째 시도가 `bridge.jpg` 를 지웠는데 Tolls 쪽이 계속 찾았다 → `sunrise.jpg` 로, 사진 설명 추가
- **출처 표기 오류** — About 의 사진 출처가 Pixabay 도 "Unsplash" 로 찍혔다 → 출처별 이름
- **사진 설명이 사진과 다름** — 바뀐 `flight.jpg` 에 옛 설명("from above")이 남아 있었다 → 사진을 보고 4장 설명 다시 씀
- **글자 찍힌 사진** — `weir.jpg`(경고 표지판) 교체, `mist.jpg`(배 이름) · `tail.jpg`(번호판) 잘라냄. 후보 중 실존 운하 이름 표지(`ubridge-01`) · 실존 지명 표지(`ucottage-01`) 사진은 버림
- **impeccable 렌더 검사** — 폴더 검사는 0건이었지만 페이지를 띄워 검사하니 `kicker-above-heading` 12쪽(오른쪽 면 쪽머리 "FOLIO 03 · FIND A LOCK" 이 작은 대문자 · 자간으로 h1 바로 위에서 h1 을 되풀이), `low-contrast` 1(검색 칸 placeholder 4.3:1), 390 px `body-text-viewport-edge` 12쪽(바닥글이 화면 끝 10 px) → 쪽머리를 이탤릭 세리프 · 일반 대소문자로 바꾸고 h1 대신 고정 시각을 넣음(위 막대의 같은 시각은 뺌), placeholder 를 없애고 라벨을 "Name or number" 로, 책상 좌우 여백 최소 10 → 16 px. 설정 파일 · 억제 주석 없이 0건
- **390 px Will it fit 표** — 핵심 열(Your boat)이 칸 안 가로 스크롤 밖에 있었다 → 갑문마다 쌓는 배치
- **390 px Index 단추** — 이름 아래 줄로 떨어졌다 → 같은 줄 오른쪽
- **Moorings 표** — 두 면 배치 가장 좁은 폭(1181 px)에서 칸 안 가로 스크롤, 이름이 네 줄로 꺾임 → Side 열을 Notes 로 옮기고("Towpath side. …") 이름 칸 최소 9em
- **View Transition 콘솔 오류** — 첫 시도 기록에는 "headless 에서만 나는 무해한 오류"로 남아 있었다. 이번 빌드에서 verify-site(55쪽) · 링크 클릭 순회 · 연속 클릭 · 기능 테스트 어디서도 재현되지 않았다(콘솔 오류 0). 원인을 따로 고친 것은 아니므로 아래 한계에 적는다
- `refs/` 정리 — 원본 후보 사진 폴더(`photo-raw`, 라이선스가 확인되지 않는 Pinterest 사진 포함) · Pinterest 접촉 시트 · 옛 스크린숏 · 임시 스크립트 삭제, `credits.json` 의 `raw` 키 삭제

## 게이트

| 검사 | 결과 |
|---|---|
| `node scripts/verify-site.mjs http://127.0.0.1:4413` | 55쪽(12쪽 + 쿼리 변형) · 1440/768/390 — 콘솔 에러 0, 가로 넘침 0, `href="#"` 0, h1 전부 1개 |
| `npx impeccable detect studio/2026-W42-tarnwick` | 0건(`--no-config` 로도 0건, 억제 주석 없음) |
| impeccable 렌더 검사(URL) | 12쪽 × 1280×800 · 390×844 0건, 768×1024(홈 · flight) 0건 |
| 기능 테스트 `node refs/test.mjs`(playwright-core + 시스템 Chrome, 서버 4413) | 79 / 79 통과, 콘솔 · 페이지 오류 0 — 홈 문장 · 링크 인자 전달, 장부 넘김 VT, 갑문 고르기 · Fill · reduced-motion, 필터 · 정렬 · 검색 · 비우기 · 주소 복원, Will it fit 오류 · 판정 · 복원, 통과 계획 경고 · 복원, 요금 3방식 · 오류, 폐쇄 날짜 · 달력 · 범위 밖 · 형식 오류, 근무 겨울 화요일 · 오류 · 복원, FAQ 열고 닫기, 키보드(건너뛰기 · Enter · 포커스 링), 390 넘침 · 면 순서 · Index 단추 줄 · Will it fit 판정 칸 화면 안, 메뉴(열기 · 잠금 · 포커스 · 순환 · Esc · 바깥 · Close) |
| Playwright MCP 눌러 보기 | 쪽 색인 12개 링크 순서대로 클릭 · 콘솔 오류 0, VT 실행 · 완료, 390 메뉴 열림(`aria-expanded` true · 배경 잠금 · Close 포커스) → Esc(닫힘 · Index 로 포커스), file:// 이동 · 계산 |
| 금지어 · Lorem · 이모지 · 실존 상호 | 없음(화면 문구 영어, 예시 도메인 `.example`) |

## 남은 것 · 한계

- 장부 넘김은 같은 출처 문서 간 View Transition 이라 file:// (불투명 출처)와 이를 지원하지 않는 브라우저에서는 바로 바뀐다. 기능에는 영향 없음
- 첫 시도 때 headless 에서 보였다는 `ViewTransition` 오류는 이번에 재현되지 않았지만 원인을 확정하지 않았다
- 390 px Will it fit 표는 `tr` 를 grid 로 바꿔 쌓으므로 일부 화면 낭독기에서 표 의미가 약해질 수 있다(머리줄은 시각적으로만 숨김)
- `sunrise.jpg` 의 배 옆면에 작은 판이 있으나 도판 크기(약 620 px)에서 글자가 읽히지 않아 그대로 두었다
- 통과 계획은 오늘(목, 여름 시간표)만 계산한다. 다른 날은 Keepers 쪽에서 근무 여부만 본다
- About 쪽 사진 출처 링크 중 Pixabay 두 개는 원래 사진 페이지 주소라 주소 안에 실존 지명이 들어 있다(화면 글자는 "Source page"). 출처를 정확히 남기려고 주소를 바꾸지 않았다
- 이름 확인은 미국 기준 검색 도구 한계로 영국 등록 지명까지는 확인하지 못했다(기획서 기록)

## 파일

```
studio/2026-W42-tarnwick/
├─ index.html · flight/ · locks/ · fit/ · passage/ · tolls/ · stoppages/ · moorings/ · keepers/ · rules/ · faq/ · about/   (build.mjs 가 생성)
├─ data.mjs          내용 · 더미 데이터(영어)
├─ calc.mjs          계산 · SVG 도면(빌드와 브라우저 공용)
├─ build.mjs         12쪽 + assets/data.js + assets/calc.js 생성
├─ assets/site.css · site.js · data.js · calc.js · photos/(9장)
├─ credits.json      사진 출처 · 라이선스 · 자른 범위
└─ refs/             test.mjs + 상태 스크린숏(home · flight 채우는 중 · locks 필터 · passage · tolls · stoppages · moorings · about · fit 390 · menu 390)
```
