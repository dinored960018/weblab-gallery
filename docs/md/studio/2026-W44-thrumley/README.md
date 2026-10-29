# Thrumley Removals — 영어 창작 (2026-W44, 목요일 2026-10-29)

가상 도시 Caddonford 의 이사 · 보관 업체. 방 크기나 짐 목록을 넣으면 부피(m³) → 맞는 차량 → 인원 → 그날 요금이 나오고, 페이지마다 큰 숫자 하나가 그 답을 보여 준다. 규칙 기반 도우미가 모든 페이지 오른쪽 4단(휴대전화는 아래 시트)에 상주하며 이 사이트의 표로만 답한다.

- 기획서: `research/2026-W44/build-concepts.md` §2 (사람이 소재를 직접 고름, 확인 완료). 제작 중 바뀐 것은 §2 끝 「제작 단계에서 바꾼 것」
- 진행 중 지시 변경: 처음에는 "에이전트 · 채팅 · 커맨드 팔레트 금지"로 시작했으나, 같은 날 사용자 새 지시(`research/notes/ax-dx-features.md`, "AI 상주 AX/DX 기능 10가지")로 바뀌어 만든 것 위에 10가지를 더했다. 레이아웃 · 색 · 서체 · 모션 둘은 그대로
- 포트 4434 · `node scripts/serve.mjs . 4434` 후 `/studio/2026-W44-thrumley/`, 또는 `index.html` 더블클릭. 링크는 전부 `…/index.html` 상대 경로(file:// 에서 홈 → Inventory → 계산 → Quote(쿼리 포함) → 홈 이동을 눌러서 확인)
- 빌드: `node build.mjs` 한 번으로 10쪽 + `assets/data.js` + `assets/calc.js`. 계산 · 문장 읽기 · 차량 도면은 `calc.mjs` 하나를 빌드와 브라우저가 같이 쓴다(빌드가 `export` 를 떼어 `assets/calc.js` 로 감쌈. 모듈 스크립트를 쓰지 않아 file:// 에서도 돈다)
- 빌드 검사: 카피가 인용하는 수치가 계산과 어긋나면 `build.mjs` 가 멈춘다 — 2-bed 예시 목록 22 m³, "Medium van · 3 crew · from £340", "Sat 14 Nov · weekend rate +15 %", 22 m³ · 8 mi 평일 £340, 첫 예약 가능일 Mon 2 Nov, 사진마다 credits 항목
- 고정 시각: Thursday 29 October 2026. 예약 범위 2026-11-01 ~ 2027-01-31, 4일 전 통지
- 이름: 가칭 "Fennick Removals" 는 검색에서 같은 상호는 없었으나 실존 영국 업체 Farrer & Fenwick Removals(Surrey, 이사 · 보관)와 소리가 거의 같아 바꿨다. `"Thrumley"` 검색 → 상호 · 지명 없음(Throckley · Thrumpton 등 다른 이름만). 우편 구역 QV1–QV9 는 영국에 없는 지역 코드(Q 로 시작하는 구역 없음). 메일 `desk@thrumley.example`, 전화 없음

## 기획 요지 — 지난 창작과 다른 점

| 항목 | Thrumley Removals | 같은 날 경정비소(한국어) | Pellbrook(W43) | Tarnwick(W42) |
|---|---|---|---|---|
| 레이아웃 | 12단 비대칭 에디토리얼. 머리는 왼쪽 1–7단 큰 숫자 + 오른쪽 9–12단 제목 · 입력(8단 비움). 아래 줄은 1–3단 이름 + 4–11단 본문(12단 비움). 사진은 풀블리드 띠 6번, 카드 없음 | 노랑 · 먹 면 분할 + 가로 주행거리 띠 | 커맨드 바 + 원장 | 펼친 장부 두 면 |
| 바탕 · 색 | 무채색 `#F2F2F0` + 짙은 청록 `#0F5F5C` 하나(합계 · 현재 쪽 · 주 단추 · 차량 칠) | 안전 노랑 + 먹 | 크라프트 + 적갈 | 라일락 책상 + 이끼 초록 |
| 서체 | Encode Sans(가변 폭, 112.5 %) + Host Grotesk | 한국어 굵은 고딕 | Funnel | Libre Caslon + Public Sans |
| 이미지 | 사진 띠 6 + 같은 축척 SVG 차량 측면도 | 정비 사진 | — | 갑문 도면 |
| 모션 | 차량 채우기 · 큰 숫자 교체 | 띠 이동 · 판정 막대 | 팔레트 · 원장 줄 | 장부 넘김 · 수위 |
| 도우미 모양 | 오른쪽에 붙는 대화 패널(본문 격자가 그만큼 좁아짐) / 휴대전화 아래 시트 | — | 전폭 커맨드 팔레트 | — |

겹치는 점: 짙은 청록은 Tarnwick 이끼 초록과 같은 계열이지만 여기서는 바탕이 아니라 합계 · 주 단추 · 현재 쪽 · 차량 칠에만 쓴다. 큰 숫자 포스터형은 지난 창작의 "큰 수치"(Gloock · Big Shoulders 등)와 이웃이지만 이번은 쪽마다 숫자 하나가 왼쪽 7단을 차지하는 격자 체계 자체다.

## 페이지 (10) — 페이지마다 전달할 한 줄

| 경로 | 큰 숫자 | 전달하는 것 |
|---|---|---|
| `/` | 22 m³ | 집 크기(Studio~5 bed) → 대략 m³ → 차량 · 인원 · 시작 요금 · 최소 시간. 요금이 정해지는 4단계, 다음 평일 빈 날 6개(견적으로 연결), 집 크기별 부피표, 우편 구역 9 |
| `/inventory/` | 합계 m³ | 방 6개 탭 · 품목 37개 ± → m³ 합계, 같은 축척 차량 측면도가 부피만큼 칠해짐(두 대면 두 장), 붙여넣기 목록 읽기 |
| `/vans/` | 38 m³ | 차량 3종 측면도(같은 축척) · 적재 치수 · m³ · 적재 중량 · 인원 · 시간당 · 최소 · 시작가 · 맞는 집, 두 대 조합, 비교표 |
| `/prices/` | £85 | 시간당 표(두 대 포함) · 시간 공식 · 거리 · 계단 · 포장 서비스 · 날짜 할증 · 계산 예시(22 m³ · 8 mi · 2층 · Sat 14 Nov) · 취소. 줄마다 id(근거 링크 도착점) |
| `/quote/` | 합계 £ | 말로 조건 넣기 → 칸 채움, 부피 · 거리 · 층 · 승강기 · 포장 · 달력 → 단계 표시 → 내역(줄마다 근거) · 알림 · 세 가지 안 · 확정 |
| `/packing/` | 57 | 상자 4종 규격 · 값, 포장재 6종, 방별 상자 수(2-bed 57개), 포장 규칙 5 |
| `/storage/` | £29 | 보관 칸 5종(2.3–14 m²) · 바닥 치수 · m³ · 주간 요금 · 들어가는 것, 조건 7 |
| `/checklist/` | 0/24 | 8주 전 → 당일 8묶음 24항목, 이사일을 넣으면 묶음마다 날짜 · 지난 묶음 표시 |
| `/faq/` | 9 | 시간 계산 · VAT · 초과 시간 · 분해 · 안 옮기는 것 · 통지 · 할증 · 취소 · 보상 |
| `/about/` | 9 | 가상 업체 고지 · 우편 구역 · 서체와 색 · 사진 출처 · 사람에게 넘기기 양식 · 연락처 |

## 기능 (실제 동작)

- **짐 계산기** (`/inventory/`) — 방 탭(`role="tab"`, `aria-selected`, ←/→/Home/End, 순환), 품목 ±(0–99, `aria-describedby` 로 수량 연결), 합계 `aria-live`("7.7 m³ · Small van · 2 crew · 86 % full"), 탭에 방별 m³, 차량 자동 판정(9/24/38 m³, 초과 시 대형 + 중형, 62 초과 방문 견적), `?i=sofa3.1,armchair.1` 주소 기록 · 복원 + 이 탭 sessionStorage, 견적 단추에 m³ 전달
- **견적** (`/quote/`) — 부피 1–62(소수 한 자리) · 거리 0–400 mi · 층 0–10 + 승강기 · 포장 서비스 · 날짜. 빈 값 · 범위 밖 → 칸 아래 "Error: …" + `aria-invalid` + 첫 오류로 포커스 + 요약(`role="alert"`). 계산: 0.16 h/m³ × 3 ÷ 인원 + 거리 ÷ 25 mph → 30분 올림 · 차량 최소, 20 mi 초과 £1.60/mi(차 수 × 구간 수), 승강기 없는 층 £16, 날짜 할증(토 +15 · 일 +20 · 월말 이틀 +10, 합산), 포장 £14/m³. 예: 22 m³ · 8 mi · 3층 · Sat 14 Nov = £446.20. `?m3=&mi=&fa=&la=&fb=&lb=&pk=&d=&v=&t=` 기록 · 복원
- **날짜 달력** — `role="grid"`, 날마다 단추(roving tabindex), ←/→ 하루, ↑/↓ 한 주, Home/End 주 시작 · 끝, PageUp/PageDown 한 달(달 넘어가면 다시 그림), 이전 · 다음 달 단추(범위 끝에서 비활성). 마감 · 휴무 · 통지 기간 · 범위 밖은 `aria-disabled` + 눌러도 선택 안 되고 이유 표시. 할증일은 숫자 아래 "+15" 글자(색만 쓰지 않음), 범례
- **체크리스트** (`/checklist/`) — 24항목 sessionStorage(새로고침 유지, 탭 닫으면 사라짐), 진행 수 큰 숫자 "7/24", 지우기
- **공통** — 건너뛰기 링크(`#main`), 1240 px 아래 Menu 단추 → 전체 화면 목록(`role="dialog"`, Close 로 포커스, Tab 순환, Esc · Close 로 닫힘 · Menu 로 포커스 복귀, 배경 스크롤 잠금, 넓어지면 자동 닫힘), FAQ `details`, 현재 쪽 `aria-current="page"`, `href="#"` 없음, 포커스 링 먹 3 px

## AX/DX 기능 10 — 규칙 기반 도우미

화면 고지: "Rule-based assistant. Answers come from the tables on this site; no AI service, nothing leaves this tab." 외부 API 없음, 저장은 sessionStorage 까지, 전송 · 결제 없음.

| # | 기능 | Removals 에서 한 것 |
|---|---|---|
| 1 | 상주 도우미 | 머리 막대 Ask → 오른쪽 패널(1100 px 이상은 본문 · 바닥글 오른쪽 여백을 패널 폭만큼 비워 격자를 좁힘, 760 px 아래는 아래 시트). 열면 입력 칸으로 포커스, Close · Esc 로 닫고 Ask 로 포커스 복귀. 열림 상태 · 대화는 sessionStorage 로 쪽을 옮겨도 유지. 쪽마다 빠른 질문 칩 2–4개. 지금 쪽의 상태로 답함(Inventory 의 "Is my list over the van?" → 현재 합계, Quote 의 "Why this total?" → 현재 내역, Checklist 의 "What is left to do?") 그 밖에 끼워 맞추기(치수 · 똑바로 세워 실어야 하는 품목), 차량 · 집 크기 요금 · 빈 날 · 할증 · 보관 칸 · 상자 수 · 상자 값 · 계단 · FAQ 8주제. 규칙에 없으면 "The rules do not cover that" + 사람에게 넘기기 |
| 2 | 말로 조건 넣기 | "2 bed flat, 3rd floor no lift, Sat 14 Nov, 8 miles" → 부피(침실 수 · m³) · 거리(mi · km 환산) · 층과 승강기(첫 언급 = 나가는 집, 둘째 = 들어가는 집) · 날짜(14 Nov · Nov 14 · Saturday · next Saturday · ISO) · 포장 · 보관을 읽어 칸을 채움. Quote 의 "Describe the move" 칸 또는 도우미 대화 어디서나(다른 쪽이면 대략 합계 + "Put this into the quote"). 읽은 것은 칩(누르면 그 칸으로 포커스, × 로 지우면 칸이 초기값), 못 읽은 부분은 점선 칩 "Not read: “piano”" |
| 3 | 작업 단계 표시 | 견적: Volume → Van → Crew and hours → Date rate → Total 다섯 단계가 대기 → 진행(점선 네모) → 완료(청록 네모)로 바뀌고 값이 붙음(단계당 110 ms). 도우미 대화의 계산 답도 "Read the words → Volume and van → Date rate → Total" 등 단계 줄 뒤에 답이 붙음. 결과 문장은 `aria-live`. 큰 모션으로 세지 않는 짧은 상태 변화, reduced-motion 이면 즉시 |
| 4 | 근거 붙이기 | 견적 내역 줄마다 "Prices table" 링크 → `prices/#r-rate-medium` · `#r-distance` · `#r-stairs-3` · `#r-sat` · `#r-packing` 등. 도우미 답마다 "Source:" 링크(차량 절 · 집 크기 표 줄 · 보관 칸 · FAQ 문항). 도착하면 그 줄이 옅은 면 + 왼쪽 청록 막대로 표시되고 FAQ 는 펼쳐짐 |
| 5 | 초안 만들기 | 짐 목록: "Draft from home size"(Studio–5 bed, 대화로 "Draft a 3 bed list"도 됨) → 기본 품목으로 채우고 "Draft" 표시, 사람이 고친 뒤 "confirm the list". 견적: 도우미가 채우거나 안 · 고칠 방법을 적용하면 "Draft quote", "confirm the quote" → "Confirmed · Reference TR-1112-590 · Not sent". 체크리스트: 이사일 → 묶음마다 "By Sat 31 Oct 2026" 날짜, "Draft" 표시, "Confirm the plan" |
| 6 | 이상 알림 | 견적: 62 m³ 초과(방문 견적), 차가 90 % 이상 참(다음 차 쓰기), 승강기 없는 계단(“There is a lift”), 주말 · 월말 할증(가장 가까운 평일로 옮기기), 말에 보관이 있으면 맞는 보관 칸 · 주간 요금. 짐 목록: 38 m³ 초과 두 대, 62 m³ 초과, 90 % 이상. 체크리스트: 날짜 지난 묶음(첫 미완료 항목으로 포커스), 2주 안인데 예약 안 됨. 알림마다 무엇 · 이유 · 고칠 단추 · Dismiss |
| 7 | 세 가지 안 비교 | 견적 결과 아래 "Three ways": Cheapest date(선택일 ±3주 안 최저 합계) · Earliest date(첫 예약 가능일) · 차 배치 대안(작은 차 두 번 / 큰 차 한 번 / 두 대 대신 대형 두 번, 상황에 따라 하나). 각 합계와 이유("One van twice instead of a bigger van: 6.0 h with the extra drive. Cheaper by £159.85."), "Use this" → 폼에 반영 후 다시 계산 |
| 8 | 붙여넣어 읽기 | Inventory "Paste a list": 한 줄에 하나("2 x double wardrobe", "sofa (3 seater)", "30 boxes", "three bikes") → 표(원문 · 읽은 품목 select · 수량 칸 · m³). 못 읽은 줄은 빨강 "Not read", select 로 품목을 골라 고침. "Add n lines to inventory" 로 더함 |
| 9 | 작업 기록 · 되돌리기 | 도우미 패널 "Changes" 탭: 도우미가 바꾼 것만 시각 · 쪽 · 내용으로 쌓임(초안 · 붙여넣기 · 말로 채우기 · 안 고르기 · 알림 고치기). 항목마다 Undo → 이전 상태 복원(다른 쪽에서 눌러도 sessionStorage 에 되돌리고 안내), 되돌린 항목은 줄 긋고 "Undone" |
| 10 | 사람에게 넘기기 | 패널 "Hand over to a person" · 알림의 방문 견적 링크 · 규칙 밖 답 → About 「Ask a person」 양식. 요약(짐 합계 · 큰 품목 5, 견적 입력 · 합계 · 보관 필요, 체크리스트 날짜 · 진행, 최근 질문 4, 규칙이 못 답한 질문)을 채우고 "Draft" 표시. 이름 · 메일 형식 · 요약 20자 검증, 통과하면 "Request checked. Not sent: this site has no server." 미리보기 |

## 토큰 (WCAG 상대 휘도 식으로 계산, 2026-10-29)

| 역할 | 값 | 대비 |
|---|---|---|
| 바탕 / 먹(본문 · 큰 숫자) | `#F2F2F0` / `#161616` | 16.14 |
| 바탕 / 보조(설명 · 표 머리 · 단위) | `#5E5E5B` | 5.80 |
| 바탕 / 청록(현재 쪽 · 링크 hover) | `#0F5F5C` | 6.66 |
| 청록 면 / 바탕색 글자(주 단추 · 고른 날) | `#0F5F5C` / `#F2F2F0` | 6.66 (hover `#0B4845` 9.24) |
| 먹 면 / 바탕색 글자(고른 집 크기 · 바닥글 · Ask 열림) | `#161616` / `#F2F2F0` | 16.14 |
| 먹 면 / 바닥글 보조 | `#A9A9A4` | 7.67 |
| 옅은 면(알림 · 근거 도착 줄 · 내 말) / 먹 · 보조 · 청록 · 빨강 | `#E4E4E1` | 14.20 · 5.11 · 5.86 · 5.88 |
| 흰 입력 칸 · 달력 칸 / 먹 · 보조 · 청록(+15) | `#FFFFFF` | 18.10 · 6.51 · 7.47 |
| 바탕 / 오류 빨강 | `#9E2A1F` | 6.68 |
| 괘선 | `#C9C9C5` | 장식 선(글자 아님) |

그라데이션 · 그림자 · 둥근 모서리 없음. 숫자는 `tabular-nums`. 상태는 색만 쓰지 않는다 — 고른 것은 면 채움, 할증은 "+15" 글자, 마감은 취소선 + 회색 면, 오류는 "Error:" 글자.

## 서체 (Google Fonts CSS 응답 200 확인, 2026-10-29)

`family=Encode+Sans:wdth,wght@75..125,500..800&family=Host+Grotesk:ital,wght@0,400..700;1,400`

- **Encode Sans** 가변(폭 75–125 · 굵기 500–800) — 큰 숫자 800 · 폭 112.5 % · `clamp(5.5rem, 2rem + 15vw, 17rem)` · 자간 −0.03em, 견적 합계는 `clamp(3.5rem, 1.5rem + 8.5vw, 11rem)`, 차량 · 보관 칸 중간 숫자 `clamp(3.5rem, 2rem + 5vw, 7rem)`, h1 700 `clamp(2rem, 1.5rem + 1.6vw, 3rem)`, 줄 이름 650 1.25rem, 상호 800 폭 125 %
- **Host Grotesk** 400–700 — 본문 1.0625rem/1.55, 표 · 폼 · 도우미
- studio/*/README.md · 생성 HTML 을 grep 해서 둘 다 지난 창작에 없음을 확인. 처음 고른 Mona Sans + Instrument Sans 는 impeccable 4.7.0 `overused-font` 규칙(목록: Inter · Roboto · Open Sans · Montserrat · Geist · Mona Sans · Instrument Sans · Plus Jakarta Sans · Space Grotesk 등)에 걸려 바꿨다. 대체 서체 Arial Narrow · system-ui

## 모션 — 큰 것 둘

1. **차량 채우기** — 짐 m³ 가 바뀌면 측면도의 청록 사각형이 `transform: scaleX(부피 ÷ 적재량)`, 300 ms `cubic-bezier(0.22, 1, 0.36, 1)`, 앞(운전석 쪽)에서 뒤로. 두 대면 대형부터 채우고 남는 만큼 중형
2. **큰 숫자 교체** — m³ · £ · 진행 수가 바뀌면 옛 숫자가 위로 밀려 나가고 새 숫자가 아래에서 들어옴(WAAPI, 200 ms, 같은 이징, 칸은 `overflow: hidden`)

작은 상태 변화: 견적 · 도우미 단계 표시(단계당 110 / 90 ms). `prefers-reduced-motion: reduce` 이면 1은 transition 0, 2는 글자만 바뀜, 단계는 즉시 완료(Playwright `reducedMotion: 'reduce'` 로 확인). 스크롤 등장 연출 없음.

## 사진 (6장, `credits.json`)

`node scripts/fetch-stock.mjs` 5개 검색어 × 6장(Unsplash 무료분)에서 골랐다. 1600 px 폭 · JPEG q78 로 다시 저장, 합계 약 1 MB. 원본 묶음은 `refs/photo-raw/`(gitignore).

| 파일 | 쪽 | 명도 |
|---|---|---|
| `room.jpg` 빈 방 · 창 하나 | 홈 | 43 |
| `boxes.jpg` 테이프 붙인 상자 더미 · 화분 | Inventory | 49 |
| `stairs.jpg` 타일 계단 · 위쪽 빛 | Prices(계단) | 22 |
| `hands.jpg` 접시를 상자에 넣는 손 | Packing | 15 |
| `corridor.jpg` 좁은 복도 · 철 계단 · 등 | Storage | 38 |
| `grid.jpg` 빈 상자 격자 | Quote | 27 |

버린 것: 승합차 뒷문 사진(옆면에 업체 로고), 짐칸 사진(해상도가 낮고 상자 라벨이 뭉개짐), 빈 방 흑백(벽 낙서), 테이프 사진들(브랜드 무늬 · 글자). 사진 위에 글자를 올리지 않는다(캡션은 사진 아래).

## 검수 결과

| 검사 | 결과(출력 마지막 줄) |
|---|---|
| `node scripts/verify-site.mjs http://127.0.0.1:4434/studio/2026-W44-thrumley` | 페이지 40개 검사(10쪽 + 링크된 쿼리 변형) · 1440/768/390 — "문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개" |
| `npx --yes impeccable@4.7.0 detect <10쪽 html> assets/site.css` | 0건(출력은 css 파일이 정규식 검사만 받는다는 안내 3줄뿐, exit 0). 설정 파일 · 억제 주석 없음 |
| impeccable 렌더 검사(10쪽 URL 각각) | 0건. 고치기 전에는 `overused-font` 20 · `cramped-padding` 49(`padding-block` 논리 속성을 정적 분석이 못 읽음 → `padding-top/bottom`) · 건너뛰기 링크 hover 대비 2.4:1 · `aphoristic-cadence` 1 · `line-length` 2 · `skipped-heading`(달력 월 이름 h3) 1 · 단어 하나 남는 줄 → 전부 고침 |
| `node scripts/check-korean.mjs studio/2026-W44-thrumley` | "한국어가 있는 페이지 0개 / 전체 10개 … 문제 없음." (화면 영어 전용) |
| 기능 클릭 검증(Playwright MCP 대신 Playwright 스크립트, 스크래치패드에 두고 커밋 안 함) | **107 / 107 통과, 콘솔 · 페이지 오류 0** |

### 눌러서 확인한 것 (Playwright 스크립트, 실제 클릭 · 키 입력)

- 홈: 4 bed → 큰 숫자 45, "Large van + Medium van · 7 crew · from £1,015", 견적 링크 `?m3=45`, 주소 `?home=4bed`. 건너뛰기 링크가 첫 Tab, Enter → `main` 포커스
- Inventory: ± 로 3.4 m³ · "Small van · 2 crew · 38 % full" · 칠 `scaleX(0.377778)`, − 동작, 탭 클릭 · → · End · 순환, 주소 기록, `?i=wardD.2,boxM.30` 복원 4.9 m³ · 견적 링크 `?m3=4.9`
- 달력: 첫 포커스 Mon 2 Nov, → 3 Nov, ↓ 10 Nov, End Sun 15 Nov, ← + Enter 로 Sat 14 Nov 선택("Sat 14 Nov · weekend rate +15 %"), PageDown → December · 14 Dec, ↑×3 으로 달 넘어 23 Nov, 마감일 27 Nov 클릭해도 선택 안 됨 · `aria-disabled`, 다음 달 단추
- 견적: 빈 제출 오류 3 · `aria-invalid` · 첫 칸 포커스, 80 m³ → 방문 견적 안내, 22 m³ · 8 mi · 3층 · Sat 14 Nov = £446.20, 다른 쪽에 갔다 돌아오면 sessionStorage 로 복원
- reduced-motion: 합계가 바로 글자로(교체 span 없음), 차량 칠 transition 0s
- 체크리스트: 2/24, 새로고침 후 유지, 범위 밖 날짜 오류, 지우기 0/24
- FAQ 열고 닫기. 390 px 메뉴: 열림 · `aria-expanded` · body overflow hidden · Close 포커스 · Shift+Tab 순환 · Esc 닫힘 · Menu 로 포커스 · 링크 이동
- file://: 홈 → Inventory(스크립트 동작 1.6 m³) → "Quote for 1.6 m³"(`quote/index.html?m3=1.6`) → Prices → 상호 클릭으로 홈

### AX/DX 기능별 결과

| # | 눌러 본 것 | 결과 |
|---|---|---|
| 1 | Ask 클릭 → 입력 칸 포커스, 1440 에서 `main` 오른쪽 여백 생김, 390 에서 아래 시트(위 204 px ~ 바닥 844, 폭 390). 칩 "Will a fridge-freezer fit the small van?" → "Small van: no. … 1.8 m tall and travels upright; load height 1.7 m." 다음 쪽으로 이동해도 패널 열림 · 대화 유지. Inventory 에서 "Is my list over the van?" → "7.7 m³ in the small van: 86 % full". "Storage for 22 m³" → "9.3 m² unit, £49 a week". 규칙 밖 질문 → "The rules do not cover that" + 넘기기. Esc · Close 로 닫히고 Ask 로 포커스 | 통과 |
| 2 | Quote "Describe the move"에 "2 bed flat, 3rd floor no lift, Sat 14 Nov, 8 miles, piano" → 22 · 8 · Floor 3 · 2026-11-14 채움, 칩 4 + "Not read: “piano”", 칩 × 로 층 초기화, 칩 눌러 Distance 칸 포커스. 도우미 대화에 "studio, 12 km, ground floor with lift, next saturday, storage" → 10 m³ · 7 mi · Sat 7 Nov | 통과 |
| 3 | 견적 계산 후 단계 5개 모두 완료 + "Van: Medium van" 값, 대화의 초안 답 단계 3개 완료 | 통과 |
| 4 | 내역 첫 줄 "Prices table" → `prices/index.html#r-rate-large` 도착, 그 줄 `.hit`. 대화 답의 "Small van" 근거 → `vans/index.html#v-small` 표시 | 통과 |
| 5 | 3 bed 초안 31.7 m³ + Draft 표시, 대화 칩 "Draft a 3 bed list"도 같은 결과, confirm 하면 표시 사라짐. 견적: 안 적용 후 "Draft", confirm → "Confirmed Reference TR-1112-590". 체크리스트: Sat 14 Nov → 2주 전 묶음 "By Sat 31 Oct 2026", Confirm | 통과 |
| 6 | 견적 알림 3종(92 % full · 3층 계단 £48 · 토요일 +15 %), "There is a lift" → Lift 체크 · £391, Dismiss. 보관 말 → 보관 칸 알림. 짐 4 bed → "Over 38 m³: two vans" + 측면도 두 장, Dismiss. 체크리스트 지난 묶음 3개 알림 → 첫 미완료 항목(w8c) 포커스 | 통과 |
| 7 | 세 안 "Cheapest date | Earliest date | Large van, one trip", Cheapest → 날짜 2026-11-12 · £340, 차량 안 → "Van chosen by you: Large van" | 통과 |
| 8 | 5줄 붙여넣기 → "4 of 5 lines read", 빨간 줄 1, select 로 Bookcase 지정 → 5 of 5, 수량 20 으로 고침, 추가 → 7.7 m³ | 통과 |
| 9 | Changes 탭에 초안 2건, Undo → 31.7 m³ 복원 · "Undone". 견적에서 "chose “Cheapest date”" · "filled from …" 기록, 최근 것 Undo → 부피 22 로 복원 | 통과 |
| 10 | 견적 30 m³ · 12 mi · 2층 · Sat 21 Nov 상태에서 "Hand over to a person" → About 요약 "Quote: 30 m³, 12 mi, out floor 2 no lift, in ground, Sat 21 Nov 2026, £715.30." + 최근 질문 + 못 답한 질문, Draft 표시. 빈 제출 → 이름 · 메일 오류 · 이름 칸 포커스, "ada@" → 형식 오류, 고친 뒤 "Request checked. Not sent" 미리보기 | 통과 |

상태 스크린숏: `refs/quote-result-1440.jpg`(결과 · 알림 · 세 안) · `refs/assistant-1440.jpg`(오른쪽 패널) · `refs/assistant-390.jpg`(아래 시트).

## 남은 것 · 한계

- 도우미는 정해 둔 규칙과 이 사이트의 표만 쓴다. 문장 읽기는 영어 숫자 · 단어 몇 가지(침실 수, mi/km, 층 · lift, 날짜 표기, packing, storage)만 알아듣고, "다음 주 토요일"은 Mon 시작 주 기준으로 계산한다. 영국식 "next Saturday" 해석이 사람마다 달라 칩으로 보여 주고 고치게 했다
- 끼워 맞추기 답은 품목 가장 긴 변 · 세워 싣는 품목만 본다(문 폭 · 계단 꺾임은 모름) — 그런 질문은 사람에게 넘기기로 보낸다
- 짐 목록 초안은 집 크기 평균표와 조금 다르다(Studio 초안 11.2 m³ / 표 10, 1 bed 14.0 / 15, 3 bed 31.7 / 32, 4 bed 44.1 / 45, 5 bed 56.5 / 58). 표는 "about" 값이라 맞추지 않았다
- 1100–1240 px 에서 도우미를 열면 본문 격자가 그만큼 좁아져 큰 숫자 · 띠 숫자가 작아진다. 덮는 방식보다 낫다고 보고 그대로 두었다
- impeccable 렌더 검사는 기본 뷰포트에서 도우미가 닫힌 상태로만 돌았다. 열린 패널은 Playwright 스크린숏으로만 보았다
- 기능 검증은 Playwright MCP 가 이 클라우드 세션에 없어 같은 클릭 · 키 입력을 Playwright 라이브러리 스크립트로 했다(스크립트는 커밋하지 않음)
- 이름 확인은 미국 기준 검색 도구라 영국 회사 등록부 전수 확인은 하지 않았다
- 모션 녹화(`record-motion.mjs`)는 창작 절차에 없어 돌리지 않았다

## 파일

```
studio/2026-W44-thrumley/
├─ index.html · inventory/ · vans/ · prices/ · quote/ · packing/ · storage/ · checklist/ · faq/ · about/   (build.mjs 가 생성)
├─ data.mjs          내용 · 수치(영어) · 도우미 단어표 · 초안 목록
├─ calc.mjs          부피 · 차량 · 견적 · 날짜 · 세 안 · 알림 · 문장/목록 읽기 · 차량 도면 SVG (빌드와 브라우저 공용)
├─ build.mjs         10쪽 + assets/data.js + assets/calc.js 생성, 카피 수치 검사
├─ assets/site.css · site.js(페이지 동작 + 도우미) · data.js · calc.js · photos/(6장)
├─ credits.json      사진 출처 · 라이선스 · 손본 것
└─ refs/             상태 스크린숏 3장 (photo-raw/ 는 gitignore)
```
