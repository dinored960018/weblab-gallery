# Marrowby Record Office — 영어 창작 (2026-W42, 화요일 2026-10-13)

가상의 잉글랜드 북부 마을 Marrowby 의 카운티 기록보관소 분관 안내 사이트. 여섯 시리즈 72항목의 연대 · 길이 · 서고 위치 · 열람 제한, 반출 회차와 도착 시각, 책상 예약, 복사 요금, 기탁 확인.

- 기획서: research/2026-W42/build-concepts.md §3 (무인 모드 상시 승인)
- 포트 4413 · `node scripts/serve.mjs studio/2026-W42-marrowby 4413` 또는 `index.html` 더블클릭(링크는 전부 `…/index.html` 상대 경로)
- 고정 시각: Tue 13 Oct 2026, 09:40 BST
- 화면 문구 전부 영어. 한국어 없음(`check-korean.mjs` 해당 없음)

## 기획 요지 — 지난 창작과 다른 점

| | 직전 Wrenlow Quarry | Marrowby Record Office |
|---|---|---|
| 레이아웃 | 고정 구간 가로 이동 길 + 사진 위 토포 선 | **서류철 한 장 + 어긋난 위치의 탭 7개 + 타자기 양식 칸**. 가로 이동 · 고정 구간 없음 |
| 바탕 | 로프 주황 `#FF6A2B` 전면 | **마닐라 책상 `#D8BF86` 위 크림 폴더 `#F6F0DF`** 두 겹 |
| 색 | 주황 + 먹 · 초크 · 해 노랑 | 먹 + **도장 보라 `#4A2B78`** 하나(현재 탭 밑줄 · 포커스 · 도장) |
| 이미지 | 화면 높이 벽 사진이 뼈대 | 오른쪽 작은 도판(Plate) 8장, 본문은 양식 · 표 |
| 서체 | Unbounded + Atkinson Hyperlegible Next | **Bricolage Grotesque + Courier Prime**(타자기 고정폭 세리프, 처음) |
| 모션 | 벽 밑 걷기 · 노선 선 긋기 | **탭 전환(문서 간 View Transitions) · 도장 찍기** |
| 기능 | 해 · 마름 · 줄 계산 | 반출 회차 계산 · 책상 예약(날짜 시드 잔여) · 신청서 상한 6 · 기탁 확인 · 복사 요금 |

겹치는 점(기획서에 밝힌 그대로): 문서 간 View Transitions 는 CORRIDOR · 새물 수영장과 같은 기법, 날짜 → 잔여 예약은 새물 수영장 · Wadstone 과 비슷한 흐름, 계산기 구성은 Dishwell · Kerfmoor 와 겹침, 밝은 종이 바탕은 HALIDE · 물레내장과 큰 방향이 같음.

## 페이지 (16 = 10 + 시리즈 상세 6)

| 경로 | 전달하는 것 |
|---|---|
| `/` | 오늘 상태(열림 · 오전 7/12 · 오후 5/12 · 다음 반출 11:30, 10:45 마감), 여섯 시리즈 칸막이 탭, 15분 단위 주문 시각 → 반출 · 도착 표 |
| `/catalogue/` | 72항목 서고 참조 줄 — 검색 · 시리즈 · 연대 · 닫힌 항목 숨김 · 정렬 3종, 오른쪽 신청서 띠 |
| `/series/<slug>/` ×6 | 범위 · 길이 · 서고 · 지금 주문하면 도착 시각, 미니 탭(Scope · Items · Access), 항목 → 신청서 |
| `/visit/` | 시간 · 휴관일 · 열람실 반입 규칙 · 버스 · 기차 · 주차 · 단차 없는 출입 |
| `/book/` | 책상 예약 + 앞으로 14 개관일 잔여 표 |
| `/pulls/` | 서고 · 주문 시각 → 반출 회차 · 마감 · 도착, 서고별 도착 표 |
| `/copies/` | 방식 · 크기 · 장수 · 수령 → 합계 · 제작 일수, 참조번호로 복사 불가 확인 |
| `/slip/` | 신청서 — 항목별 반출 회차, 제거 · 비우기 · 확정(도장) · 인쇄 |
| `/deposit/` | 최근 연도 · 양 · 개인정보 → 접수 여부 · 서고 길이 · 수수료 |
| `/faq/` · `/about/` | 질문 8 / 가상 고지 · 수치 근거 · 사진 출처 |

## 기능 (실제 동작)

- **카탈로그** — 제목 · 참조번호 검색(부분 `MAP/010` 도 됨), 시리즈 단추 6(`aria-pressed`, 여럿 선택), 연대 두 칸(1538–1998 밖 · 앞뒤 역전이면 칸 옆 오류 + `aria-invalid` + 값 되돌림), 닫힌 항목 숨김, 정렬(참조 · 오래된 순 · 최근 순), 결과 수 `aria-live`, 빈 결과 + Clear filters(검색칸으로 포커스), `?q=&series=&from=&to=&closed=0&sort=` 복원
- **신청서** — 카탈로그 · 시리즈 표의 Add to slip(`aria-pressed`, 다시 누르면 뺌), 6건 상한(7번째는 "Slip full: 6 of 6 items. Remove one to add another."), 닫힌 항목 단추 비활성, 탭 · 띠에 개수. 항목별 반출 회차 자동 배정 — 한 회차에 3건까지, 넘치면 다음 회차("pull full, moved"), Off-site 는 다음 개관일 10:00. 제거(포커스 다음 줄로) · 비우기 · 확정(도장) · 인쇄 스타일. sessionStorage(막히면 메모리)
- **책상 예약** — 날짜(오늘부터 60일, 일 · 월 · 12월 24–26 · 31 · 1월 1일 닫힘), 오전/오후, 남은 책상은 날짜 문자열 해시로 계산(같은 날짜는 늘 같은 수), 0 이면 Full + 대기 명단 단추. 이름 · 이메일 · 사유 필수, 오류는 칸 옆 `aria-describedby`, 첫 오류로 포커스. 확인서 `MRO-YYMMDD-NN`(NN = 책상 번호) + 도장, 새로고침해도 이 탭에 남음, 취소 가능. 14일 표의 날짜 단추로 날짜 채움
- **반출 시각** — 서고 5곳, 24시 주문 시각 → 10:00 · 11:30 · 14:00 · 15:30 중 마감(45분 전) 이후 첫 회차와 도착(서고별 걷는 시간 10–25분). 놓친 회차 안내, 14:45 이후는 다음 개관일, Off-site 고정 문구, 잘못된 시각 오류, `?zone=&t=` 복원
- **복사 요금** — A3 스캔 12장 우편 = £21.60, 10 working days(기획서 예시와 일치). A1 종이 복사 없음 안내, 장수 1–500 검증, 자가 촬영 £5(장수 칸 숨김), 참조번호 입력 시 연약(fragile) · 닫힘 항목은 복사 불가
- **기탁 확인** — 30년 규칙, 상자 1개 = 0.1 m, m 당 £42, 개인정보 포함이면 검토(6–8주), 20 m 초과는 방문 먼저
- **Index 시트** — 머리의 Index 단추로 전 페이지 목록. 열린 동안 배경 스크롤 막음, Esc · 바깥 클릭 · Close 로 닫고 단추로 포커스 복귀, 탭 순환
- 시리즈 미니 탭(←/→ · Home · End, `aria-selected`, `?tab=` 복원, `#item-…` 링크는 Items 탭을 열고 그 줄 표시), FAQ `details`, 건너뛰기 링크, 포커스 링 3 px, `href="#"` 없음, 서버 없음

## 토큰 (WCAG 식으로 계산)

| 역할 | 값 | 대비 |
|---|---|---|
| 책상 / 먹 | `#D8BF86` / `#1B1A17` | 9.71 |
| 책상 위 보조 | `#3E3A31` | 6.32 |
| 폴더 / 먹 | `#F6F0DF` / `#1B1A17` | 15.29 |
| 폴더 위 보조 | `#4A4237` | 8.68 |
| 폴더 위 도장 보라 | `#4A2B78` | 9.67 |
| 책상 위 도장 보라(포커스) | `#4A2B78` | 6.14 |
| 폴더 위 오류 · 닫힘 | `#A9300F` | 5.92 |
| 짝 줄 `#EFE6CF` / 먹 · 보조 · 오류 | | 14.00 · 7.95 · 5.42 |
| 뒤 탭 `#E9DDBE` / 먹 | | 12.89 |
| 먹 단추 / 크림 글자 | `#1B1A17` / `#F6F0DF` | 15.29 |
| 입력 예시 글자 | `#6B6253` | 5.28 |

그라데이션 · 그림자 · 둥근 모서리 없음(탭 윗모서리만 `clip-path` 로 2 px 깎음). 도장 보라는 면으로 채우지 않음.

## 서체

- **Bricolage Grotesque** 400–800(opsz 12–96) — 제목 · 탭 · 참조번호 · 라벨
- **Courier Prime** 400 · 700 · 이탤릭 — 양식의 값 · 표 · 요금 · 본문
- Google Fonts CSS 200(기획서 2026-10-13 확인). 지난 창작 · 직전 Wrenlow 와 겹치지 않음

## 모션 — 둘

1. **탭 전환** — `@view-transition { navigation: auto }`, 탭마다 `view-transition-name`, 폴더 면 `folder`. 현재 탭이 5 px 올라오고 폴더 내용 교체, 200 ms `cubic-bezier(0.22, 1, 0.36, 1)`. 지원 안 하는 브라우저 · `file://` 는 즉시 이동
2. **도장 찍기** — 예약 확인 · 신청서 확정 때 `scale(1.15 → 1)` + 불투명 0 → 1, 220 ms, 한 번

`prefers-reduced-motion: reduce` → 둘 다 끔(클릭 테스트로 `animation-name: none` 확인). 스크롤 등장 연출 없음.

## 사진

- 검색 7회(Pinterest 5 — archive shelves boxes · old documents tied with string · map chest drawers archive · handwritten old ledger · empty reading room desk library / Unsplash 2 — archive boxes · old documents) → 62장을 밀착 시트 2장(`refs/sheet-1.png` · `sheet-2.png`)으로 검수 → **8장 사용**(Pinterest 7 · Unsplash 1). 원본 전부는 `refs/photo-raw/`(+ 그곳 `credits.json`)
- **AI 생성 의심으로 뺀 것** — 끈 묶은 편지 · 마른 꽃 정물(bundle-02~10, 매끈한 종이결 · 연출 조명), 렌더 같은 열람실(reading-05 · 06 · 08), 그림(reading-01, udocs-03 정물화)
- 그 밖에 뺀 것 — 사람이 보이는 컷(shelves-08, udocs-05, ledger-01 손), 빈 택배 상자 제품컷(uboxes), 글자가 크게 읽히는 실존 문서(ledger-03 · 05 · 07 · 08, udocs-07), 우표(udocs-08)
- 출처는 `credits.json`(핀 · 사진 주소, 라이선스, 명도, 원 파일명)과 About 표. Pinterest 7장은 라이선스 미확인 → 요청 시 교체. CC BY 없음
- 기획서는 "열 장 안팎"이었으나 기준을 통과한 컷이 8장이라 8장으로 둠

## 기획서에서 바꾼 것

- **휴관일** — 기획서는 "월 · 공휴일(Mon 26 Oct · Mon 28 Dec · Fri 25 Dec)". 월요일은 전부 닫으므로 26 Oct · 28 Dec 는 따로 적을 필요가 없고, 대신 일요일 · 12월 24–26 · 31 · 1월 1일을 닫힘으로 둠. 개관은 화–토
- **카피 예시 "Closed for 30 years: school admission registers after 1968"** — 연도 기준이 30년 규칙(2026 − 30 = 1996)과 맞지 않아, 항목마다 "마지막 기재 + 30년"으로 열리는 해를 계산해 "Closed until 2028" 식으로 표기
- **모바일 메뉴** — 기획서는 "800 px 아래 탭 두 줄"과 "모바일 메뉴"를 함께 적음. 탭은 모든 폭에서 보이고(좁으면 두 줄), 탭에 없는 페이지(시리즈 6 · Deposit · FAQ · About)는 모든 폭의 **Index 시트**로 엶. 이것이 모바일 메뉴 역할(Esc · 포커스 복귀 · 배경 스크롤 막음)
- 폼 번호(“Form R1 · Desk booking”)는 처음에 h1 위 작은 대문자 라벨이었으나 impeccable `hero-eyebrow-chip` 16건 → h1 오른쪽 위 괘선 상자(양식 번호 칸)로 옮기고 대문자 · 자간을 뺌

## 검수 결과

```
node scripts/verify-site.mjs http://127.0.0.1:4413
  페이지 112개 검사(쿼리 · 해시 변형 포함, 1440 · 768 · 390)
  문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개

npx --yes impeccable@latest detect studio/2026-W42-marrowby
  설정 · 억제 없음 → 출력 없음, exit 0

node refs/test.mjs — 헤드리스 클릭 테스트(playwright-core + 시스템 Chrome)
  60 / 60 통과, 콘솔 · 페이지 오류 0
  홈 3 · Index 시트 5 · 카탈로그 13 · 신청서 4 · 신청서 페이지 5 · 시리즈 5 · 예약 9 · 반출 5 · 복사 5 · 기탁 4 · FAQ/키보드 3 · 390 + 감속 2
```

### impeccable 처리 내역 (처음 17건 → 0, 억제 없음)

- `hero-eyebrow-chip` ×16 → 위 "기획서에서 바꾼 것" 마지막 항목
- `cramped-padding` ×1 → 복사 합계 상자가 윗줄에 붙음 → `padding-top: 12px`

### 작업 중 실제로 틀렸던 것

- **390 px 가로 넘침(시리즈 Items 표 · 홈 · 반출 · About)** — 표는 가로 스크롤 상자 안에 있었는데, 머리칸의 화면 밖 라벨(`.vh`, `position:absolute`)이 스크롤 상자가 아닌 폴더를 기준으로 잡혀 문서 폭을 536 px 로 늘림 → `.tbl-box { position: relative }`. 그리드 · fieldset 의 최소폭도 0 으로
- **기탁 길이 1.5 m** — 14상자 × 0.1 = 1.4000000000000001 이 올림되어 1.5 m 가 됨 → 1/1000 단위로 반올림한 뒤 0.1 m 올림
- **신청서 Off-site 회차** — 3건 상한을 Off-site 에도 적용해 다음 날 11:30 으로 밀림(Off-site 는 10:00 고정) → Off-site 는 상한에서 뺌
- 테스트 쪽 오류 2건(도장 글자가 `text-transform` 으로 대문자라 `innerText` 비교 실패, 예약 테스트 날짜 15 Oct 오후가 Full) → 테스트 수정
- 처음 favicon 404 가 콘솔 에러로 잡힘 → `<link rel="icon" href="data:,">`

## 남은 것 · 한계

- 날짜 · 시각 고정. 잔여 책상은 계산값이고 실제 예약 상태가 아님(내 예약 1건만 반영)
- View Transitions 는 Chrome 계열 · `http://` 에서만 보임. Safari · Firefox 에서 직접 열어보지 않았다
- `<input type="date">` 는 브라우저 언어를 따름(페이지 문구 아님)
- 도판 번호(Plate N)는 빌드 순서대로 사이트 전체에서 이어짐
- 30년 규칙 · 요금 대역은 일반 범위로 잡은 값, 법적 안내 아님

## 파일

```
studio/2026-W42-marrowby/
├─ index.html · catalogue · series/(+6) · visit · book · pulls · copies · slip · deposit · faq · about   (생성물)
├─ data.mjs        내용 전부(시리즈 6 · 항목 72 · 이용 안내 · FAQ)
├─ calc.mjs        휴관 · 잔여 책상 · 반출 · 회차 배정 · 복사 · 기탁 — 빌드와 브라우저가 같은 함수를 씀
├─ build.mjs       data + calc → 16 페이지 + assets/data.js · calc.js
├─ assets/site.css · site.js · data.js · calc.js
├─ assets/photos/  8장
├─ credits.json
└─ refs/           페이지 스크린샷(1440 · 390), 사진 밀착 시트 2, photo-raw/(원본 62 + credits), shots.mjs · test.mjs
```
