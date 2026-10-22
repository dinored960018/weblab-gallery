# Pellbrook Meat Supply — 영어 창작 (2026-W43, 수요일 2026-10-21)

가상 도시의 업소 납품 도매 정육(레스토랑 · 호텔 · 학교 급식). 사람이 메뉴를 뒤지는 대신 **주문 에이전트**가 늘 떠 있다 — 화면 맨 위 전폭 커맨드 바(Ctrl K / ⌘K)에 적으면, 또는 홈에서 "Tick any that apply" 를 하나라도 체크하면, 에이전트가 원장(ledger)에 줄을 하나씩 적고 kg · 케이스 · 금액을 합한다. 에이전트는 이 사이트의 표(부위 규격 · 가격 · 재고 · 배송 구역 · 로트)로만 답하는 **규칙 기반**이고, 화면에 "Rule-based assistant · nothing is sent" 를 밝힌다.

- 기획서: research/2026-W43/build-concepts.md §2 (사용자가 소재를 직접 지시 · 확인 완료)
- 사용자 지시 원문: "좀 더 쓸모있어보이는 분야로 이번엔 정육점 … 이 두개를 내용만 보고 재해석해서 만드는데 요소만 가져오고 특정되는 텍스트는 하나도 가져오지마셈 그리고 AXDX 에이전트 상주 사이트 감성으로 제작"
- 포트 4424 · `node scripts/serve.mjs studio/2026-W43-pellbrook 4424` 또는 `index.html` 더블클릭(링크는 전부 `…/index.html` 상대 경로)
- 빌드: `node build.mjs` 한 번으로 15쪽 + `assets/data.js` + `assets/calc.js` 생성. 계산 · 에이전트 규칙은 `calc.mjs` 하나를 빌드와 브라우저가 같이 쓴다(빌드가 `export` 를 떼어 `assets/calc.js` 로 복사)
- 빌드 검사: 화면 문구가 인용하는 값(규칙 예시 "add 15 kg short rib" → 3 cases, PK8 → "Thu 22 Oct, order by 12:00 today", FAQ 의 short rib 수율 74 %, 정기 주문 기본값 14 cases, 예시 로트)이 계산과 어긋나면 `build.mjs` 가 멈춘다
- 고정 시각: Wednesday 21 October 2026, 10:00

## 참고 사이트에서 가져온 것 — 요소만

| 참고 | 가져온 구조 | 이 사이트에서 |
|---|---|---|
| 정육식당 가맹 본부 사이트 | 숙성을 수치로 앞세움 · 부위를 축종별로 나눔 · 물류 직영 · 거래(가맹) 문의 | 규격서의 숙성 일수 · 습도, 축종 필터(Beef/Pork/Lamb), 배송 구역 · 냉장 기록, Trade accounts |
| 세금 환급 조회 랜딩 | 해당 항목 체크 → 하나라도 맞으면 → 빠른 조회 → 결과 · 안심 근거 셋 · FAQ · 반복되는 단일 행동 단추 | 홈 "Tick any that apply"(하나면 충분) → Draft order → 원장, "Three checks on every case", FAQ 10, 계좌 신청의 "any one applies" |

상호 · 슬로건 · 문장 · 수치 · 메뉴명 · 주소 · 수상 이력은 하나도 쓰지 않았다(빌드 산출물에서 두 사이트 이름 grep 0건). 화면 문구는 전부 새로 쓴 영어.

## 이름 확인

WebSearch `"Pellbrook Meat"` · `Pellbrook butcher OR "Pellbrook" meat supply` (2026-10-21) → 같은 이름의 정육 · 도매 업체 없음(가까운 결과는 Pellon(지명) · Cranbrook Meats · Meadowbrook Meat Company 로 다른 이름). 이름 유지. 검색 도구가 미국 기준이라 영국 회사 등록부까지 직접 보지는 못했다.
메일 `orders@pellbrook.example`, 전화 · 실제 주소 없음. 농장 · 로트 · 계좌 번호 · 구역 코드는 지어낸 값.

## 지난 창작과 다른 점

| 항목 | Pellbrook | 같은 날 살결정육점(한국어) | 직전 영어 Tarnwick | Marrowby |
|---|---|---|---|---|
| 레이아웃 | 전폭 커맨드 바(늘 보임, 적갈 띠) + 원장 한 장 — 섹션마다 왼쪽 번호 칸(01, 02 …)에 줄이 화면 끝까지. 카드 없음. 부위 상세는 규격서 2단(왼쪽 큰 사진, 오른쪽 규격 표) | 본문 + 오른쪽 에이전트 레일 | 펼친 장부 두 면 | 서류철 + 탭 |
| 바탕 · 색 | 크라프트 `#E8DDCB` + 적갈 `#7A1F1A` + 먹 2도 | 숯 + 분홍 | 라일락 책상 + 종이 + 이끼 초록 | 마닐라 · 보라 |
| 서체 | Funnel Display + Funnel Sans, 고정폭 없음(`tabular-nums`) | 한국어 산세리프 + 고정폭 | Libre Caslon + Public Sans | Bricolage + Courier Prime |
| 에이전트 위치 | 위 전폭 바 → 가운데 팔레트, 결과는 본문 원장 | 오른쪽 레일 | — | — |
| 모션 | 팔레트 열림 · 원장 줄 추가 | 단계 · 하이라이트 | 장부 넘김 · 방 수위 | — |

겹치는 점: 원장은 Tarnwick 의 펼친 장부와 이웃이지만 이번은 한 장 전폭 표 + 커맨드 바가 붙은 업무 도구 화면이다. 크라프트와 마닐라(Marrowby)는 종이색 계열이라 적갈 2도로 갈랐다. 같은 날 살결정육점과는 소재(정육)가 같은데 이는 사용자 지시이고, 업태(업소 납품 도매 / 소매 + 정육식당) · 레이아웃(위 바 / 오른쪽 레일) · 색(밝은 크라프트 / 어두운 숯) · 서체 · 모션을 전부 다르게 했다. "보라-파랑 그라디언트 · 글로우 · 카드 남발 금지" 지시대로 그라디언트 · 그림자 · 글로우 0, 카드 0.

## 페이지 (9 + 부위 규격서 6 = 15)

| 경로 | 무엇을 전달하나 |
|---|---|
| `/` | Tick any that apply(3항목, 하나면 충분) → Draft order → 에이전트가 원장에 줄을 하나씩 적음. 원장(수정 · 삭제 · 합계 · 최소 주문 £150 판정) · 처리 로그(이 탭) · 케이스마다 세 가지 확인 · 오늘(목요일 마감 · PK8 다음 배송 · 냉장 재고 · 재고 부족 3건 · 가격표 공지) |
| `/cuts/` | 납품 규격 17종 — 코드 · 부위 · 트림 · 축종 · 1차 분할 · 지방 mm · 수율 % · 케이스 kg · £/kg · 재고 · Add case |
| `/cuts/striploin/` · `short-rib/` · `chuck-roll/` · `pork-belly/` · `pork-shoulder/` · `lamb-rack/` | 규격서 한 장 — 11항목(트림 · 지방 · 포션 ± 허용 오차 · 수율 · 숙성 · 포장 · 케이스 무게 · 유통기한 · 가격 · 재고), 손질 순서 4단계, 손실 %, 이 부위를 담은 로트, 이전 · 다음 규격서 |
| `/standing-orders/` | 정기 주문 — 커버 × 포션 g × 주간 영업 횟수 → kg, 올림 케이스, 원물 kg(수율), 주간 비용, 재고 대비 부족 |
| `/delivery/` | 구역 코드 → 다음 배송일 · 마감 · 남은 시간 · 다음 다음 배송. 4구역 9구역코드 표, 배송 조건 6줄 |
| `/traceability/` | 로트 번호 → 농장 · 품종 · 도축일 · 숙성 일수 · 포장한 부위 · 재고. 로트 8건 표 |
| `/agent/` | 에이전트가 하는 일 5 / 안 하는 일 4, 규칙 7종(Try 단추로 팔레트에 채워 실행), 이 탭 로그, 창고 오늘 로그 10줄 |
| `/accounts/` | 거래 계좌 — "Tick any that apply" 5항목 + 업체명 · 담당자 · 메일 · 구역 · 주간 지출 → 검증 → "Held in this tab, not sent." 조건 4줄 |
| `/faq/` | 10문항 `details` |
| `/about/` | 가상 사이트 고지 4줄 · 사진 출처 표 (9번째 페이지 — 기획서 표에 8쪽만 있어 "9" 를 맞추려 추가. 메뉴에는 없고 바닥글 · 모바일 메뉴에서 연결) |

## 기능 (실제 동작)

- **커맨드 팔레트** — Ctrl K / ⌘K(다시 누르면 닫힘) · `/`(글 입력칸 밖에서) · 커맨드 바 클릭으로 열림. `role="dialog"` `aria-modal`, 입력칸은 `role="combobox"` + `aria-activedescendant`, 목록 `role="listbox"` · 선택 `aria-selected`. ↑ ↓(끝에서 돌아감) · Enter 실행 · 클릭 실행, Esc · Close · 바깥 클릭으로 닫힘, 포커스 가둠(Tab / Shift+Tab 순환), 닫으면 연 요소로 포커스 복귀, 열린 동안 배경 스크롤 잠금. 빈 입력이면 규칙 예시 7 + 페이지 8, 입력하면 첫 줄 "Run" 에 해석 결과 미리보기 + 맞는 명령 · 부위 가격
- **에이전트 규칙**(`calc.mjs` `parse`) — `add 15 kg short rib`(kg 는 케이스로 올림, 같은 부위면 줄 갱신, 재고 초과 · 여러 부위 일치 알림) · `add 2 cases belly` · `next delivery PK8` / `pk4` · `lot PB-2610-114` · `price ribeye` · `spec B104` · `clear ledger` · `go cuts`. 못 알아들으면 "No rule for that." + 예시, 로그에 Unmatched 로 남김
- **체크 → 원장** — 0개면 "Error: tick at least one line above." + 첫 칸 포커스. 체크한 항목의 줄을 320 ms 간격으로 하나씩 기록(머리 상태 "Agent writing" → "Agent idle"), 로그에 Draft started · Line written ×n · Draft done. 원장은 케이스 수 입력(0 이면 삭제, 숫자 아니면 오류 후 되돌림) · Remove(포커스는 다음 Remove 로) · Clear ledger. 합계 cases · kg · 금액, £150 미만이면 모자란 금액. `sessionStorage` 라 탭 안에서 페이지를 옮겨도 남고 탭을 닫으면 사라진다(이 사실을 화면에 적음). 머리의 "n lines" 가 전 페이지에서 따라감
- **규격 목록** — 축종 단추(`aria-pressed`) · 1차 분할 select · 이름/코드 검색(입력마다) · 정렬 5종(코드 · 수율 높은 순 · 가격 낮은 순 · 높은 순 · 재고 적은 순). 결과 수 `aria-live`, 0건이면 문구 + Clear filters(검색칸 포커스). `?species=&primal=&q=&sort=` 기록 · 복원. 줄마다 Add case → 원장 + 상태 줄 "Line n written … Open ledger"
- **정기 주문 계산** — 커버 1~2,000 · 포션 50~1,000 g(부위를 바꾸면 규격 포션으로) · 요일 체크 1개 이상. 오류는 칸 아래 "Error: …" + `aria-invalid` + 첫 오류 칸 포커스. 결과 `aria-live`, `?cut=&covers=&portion=&days=` 기록 · 복원, "Add weekly cases to ledger"
- **배송일 계산** — 빈 값 / 형식(PK+숫자) / 구역 밖(PK0, PK12) 오류 구분. 오늘(수 10:00) 기준: PK8 → Thu 22 Oct, 12:00 today 마감(2 h 00 min), PK4 → Fri 23 Oct, 14:00 Thu 22 Oct 마감. `?d=` 복원
- **로트 조회** — 형식 검사(PB-YYMM-NNN), 없는 로트는 "No lot … on file.", 표의 로트 링크 → `?lot=` 복원
- **계좌 신청** — 체크 하나 이상 + 4칸 검증(메일 형식 · 구역 PK1~9). 통과하면 전송하지 않고 "Held in this tab, not sent." + 구역 · 배송 요일
- **공통** — 건너뛰기 링크, 1100 px 아래 Menu 단추 → 오른쪽 시트(`role="dialog"`, Close 포커스, Tab 순환, Esc · 바깥 · Close 로 닫힘, 배경 잠금, 넓어지면 자동 닫힘), FAQ `details`, 현재 쪽 `aria-current="page"`(규격서는 Cuts), `href="#"` 없음, 포커스 링 적갈 3 px(적갈 띠 위에서는 크림)

## 토큰 — 2도 인쇄: 크라프트 + 적갈 + 먹 (WCAG 상대 휘도 식으로 실측, 2026-10-21)

기획서 초안 값을 재 보니 전부 기준을 넘어 그대로 확정했다. 괘선 색과 적갈 위 글자색 두 개를 더했다.

| 역할 | 값 | 대비 |
|---|---|---|
| 바탕(크라프트) / 글자(먹) | `#E8DDCB` / `#1B1714` | 13.26 |
| 바탕 / 보조 글자(설명 · 표 머리 · 힌트) | `#5A4E43` | 6.00 |
| 바탕 / 적갈(섹션 번호 · 합계 · 현재 쪽 · 오류) | `#7A1F1A` | 7.67 |
| 원장 짝수 줄 `#DED1BC` / 먹 · 보조 · 적갈 | | 11.83 · 5.35 · 6.84 |
| 적갈 띠(커맨드 바 · 팔레트 입력) / 크림 글자 | `#7A1F1A` / `#F3EADB` | 8.64 |
| 먹 면(주 단추 · 선택된 팔레트 줄) / 크라프트 · 짝 면 글자 | `#1B1714` / `#E8DDCB` · `#DED1BC` | 13.26 · 11.83 |
| 괘선 | `#B9A88E` | 장식 선(글자 아님) |

그라디언트 · 그림자 · 글로우 없음. 모서리 3 px(팔레트 4 px). 상태는 색만 쓰지 않는다 — 머리 상태는 점 + 글자("Agent idle" / "Agent writing"), 오류는 "Error:" 글자 + 2 px 테두리.

## 서체

- **Funnel Display** 500 · 700 — h1 `clamp(2rem, 1.3rem + 2.6vw, 3.5rem)` 자간 −0.02em, h2 1.375rem, 섹션 번호 · 결과 문장 1.5rem
- **Funnel Sans** 400 · 500 · 600 · 400 italic — 본문 1rem/1.55, 표 0.9375rem, 전부 `tabular-nums`
- 지난 작업과 겹침 확인: `grep -rl "Funnel Display|Funnel Sans"` → studio · works 0건(research 의 이 기획서만). `works/2026-W40/clone-09-dimito` 의 "funnel" 은 상품명(funnel fleece)이라 서체 아님
- Google Fonts CSS 응답 200 확인(2026-10-21, `family=Funnel+Display:wght@400..800&family=Funnel+Sans:ital,wght@0,300..800;1,300..800`). 실제로는 쓰는 굵기만 요청. 대체 서체 Arial Narrow · system-ui

## 모션 — 둘

1. **팔레트 열림** — `.pal` 에 `pal-in` 160 ms, `scale(0.98) → 1` + 투명도 0 → 1, `cubic-bezier(0.22, 1, 0.36, 1)`(ease-out). Playwright 에서 `getAnimations()` 지속 160 확인
2. **원장 줄 추가** — 새 줄 `translateY(-10px) → 0` + 투명도, 240 ms 같은 곡선. 합계 세 칸은 바뀔 때 240 ms 투명도 0.35 → 1. 체크로 쓴 줄은 320 ms 간격으로 하나씩 들어온다

`prefers-reduced-motion: reduce` 이면 둘 다 꺼지고 체크 줄도 한 번에 기록(Playwright `reducedMotion: 'reduce'` 로 애니메이션 0개 · 즉시 기록 확인). 스크롤 등장 연출 없음. 머리 상태 점도 깜빡이지 않는다(색만 바뀜).

## 사진 (12장 · `credits.json`)

`node scripts/fetch-stock.mjs` 로 Pinterest 에서 6개 검색어(도매 작업장 · 숙성 냉장 · 부위 정물 · 삼겹 · 양갈비 · 돼지 어깨) 76장을 받아 밀착 시트로 골랐다. 제외: 얼굴이 주인 사진 · 상호 · 워터마크 · 손글씨("Guanciale") · AI 생성 의심 렌더. 긴 변 1200 px, JPEG 76 %, 총 1.7 MB. 원본 묶음은 `refs/photo-raw/`(gitignore).

| 파일 | 쪽 | 비고 |
|---|---|---|
| `home.jpg` | 홈 · 세 가지 확인 | 뒷모습만, 냉장실 고리의 이름표 글자는 판독 불가 크기 |
| `striploin.jpg` · `short-rib.jpg` · `chuck-roll.jpg` · `pork-belly.jpg` · `pork-shoulder.jpg` · `lamb-rack.jpg` | 규격서 6 | |
| `standing.jpg` · `delivery.jpg` · `traceability.jpg` · `accounts.jpg` · `agent.jpg` | 각 쪽 오른쪽 칸 | 지육 사진의 라벨은 판독 불가 크기 |

Pinterest 사진은 라이선스 미확인(원 게시자 저작물). `credits.json` 과 About 쪽에 이미지 주소를 남겼고 요청 시 교체한다. fetch-stock 이 핀 주소를 확인하지 못해(`page` 빈 값) 이미지 파일 주소(`i.pinimg.com/originals/…`)를 대신 남겼다.

## 검수

| 검사 | 결과 |
|---|---|
| `node scripts/verify-site.mjs http://127.0.0.1:4424` | 59쪽(15쪽 + 쿼리 변형) · 1440/768/390 — "문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개" |
| `npx impeccable detect` (15개 html) | 0건. 처음 16건(`a:hover` 적갈이 건너뛰기 링크의 먹 면 위에 오는 대비 1.7 15쪽, FAQ 테두리에 붙은 내용 1) → 링크 hover 를 `.btn` · `.skip` 에서 빼고 FAQ 테두리를 첫 `details` 로 옮겨 0. 설정 · 억제 주석 없음 |
| impeccable 렌더 검사(URL 10쪽) | 0건. 처음 straggler 권고 2(Standing orders 결과 문장 · Accounts lede) → `p { text-wrap: pretty }` 로 0 |
| `node scripts/check-korean.mjs studio/2026-W43-pellbrook` | "한국어가 있는 페이지 0개 / 전체 15개 · 문제 없음." (화면 전부 영어) |
| 기능 테스트(Playwright 라이브러리 스크립트, 스크래치패드 · 커밋 안 함) | **103 / 103 통과, 콘솔 · 페이지 오류 0**. Playwright MCP 는 이 컨테이너에 없어 **Playwright 스크립트로 실제 클릭 · 키 입력**해서 확인했다 |
| 금지어 · Lorem · 이모지 · 참고 사이트 이름 | grep 0건 |

기능 테스트가 누른 것: 체크 없이 Draft(오류 · 포커스) → 2개 체크 → 줄이 하나씩 들어옴(120 ms 시점 1~3줄) · "Agent writing" → idle · 4줄 · 합계 £1,339.40 / 7 cases · 로그 6건 순서, 케이스 2→5(£1,704.00) · "abc"(오류 · 되돌림) · 0(삭제) · Remove(포커스 유지); Ctrl+K 열림 · 입력 포커스 · `aria-expanded` · 160 ms 애니메이션 · 스크롤 잠금 · ↓↓ · ↑ · ↑ 감기 · `aria-selected`, "add 15 kg short rib" Enter(줄 갱신 · 올림 안내), Tab ×6 / Shift+Tab ×6 가둠, Esc 닫힘 · 잠금 해제, `/` 열림, 명령 6종 결과, Close · 포커스 복귀, 커맨드 바 클릭, 바깥 클릭, Meta+K 열고 Ctrl+K 닫기, clear ledger, go cuts 이동; 규격 목록 Pork 5 · Loin 2 · 가격 높은 순 B103 · "rib" 3 · URL 기록 · 새로고침 복원 · 0건 · Clear filters 포커스 · Add case · 머리 줄 수; 규격서 Add · Next; 홈으로 돌아와 원장 유지; 정기 주문 기본 168.0 kg / 14 · 커버 0 오류 포커스 · 요일 0 오류 · 부위 바꾸면 450 g · 72.0 kg / 12 · URL · 원장 추가; 배송 빈 값 · E8 · PK0 · PK4 · `?d=PK8`; 로트 형식 오류 · 없는 로트 · 표 링크; 계좌 빈 제출(체크 오류 · 4칸 · 포커스) → 통과(zone C); FAQ 열고 닫기; 첫 Tab 건너뛰기 → Enter 본문; 390 px 메뉴(열림 · 잠금 · Close 포커스 · Tab ×12 가둠 · Esc · 포커스 복귀 · 바깥 클릭 · 링크 이동 · 넘침 없음); reduced motion(팔레트 · 줄 애니메이션 0, 즉시 기록); **file://** 홈 → Cuts → 규격서 → Add → Traceability 조회 → 홈 원장 1줄 유지.

## 기획서에서 바꾼 것 (build-concepts.md §2 에도 반영)

- 배송 구역 코드 `E8` → `PK1`~`PK9`. `E8` 은 실존 런던 우편 구역이라 실존하지 않는 영국 우편 지역 문자(PK)로 바꿈
- 예시 "Thu 23 Oct, order by 14:00 Wed" → 2026-10-21 이 수요일이므로 목요일은 22일. 구역 D 마감을 12:00 으로 두어 "Thu 22 Oct, order by 12:00 today"
- 예시 명령 "Add 6 kg short rib" → "add 15 kg short rib" — 케이스가 6 kg 라 6 kg 는 올림이 드러나지 않음. 15 kg → 3 cases 18.0 kg
- 페이지 9 를 맞추려고 `/about/`(고지 · 사진 출처) 추가
- 색 · 서체 초안 값은 실측 후 그대로 확정, 괘선 `#B9A88E` · 적갈 위 글자 `#F3EADB` 추가

## 남은 것 · 한계

- Pinterest 사진 12장은 라이선스 미확인이고 핀 주소가 아닌 이미지 주소만 남았다. 공개 갤러리에 올리기 전 스톡(`--source stock`)으로 바꾸는 편이 안전하다
- 에이전트는 정해진 문형만 안다. "add short rib 6 kg" 처럼 순서가 다르면 "No rule for that." 이 뜬다(로그에 Unmatched 로 남김)
- 원장 · 로그는 `sessionStorage` — 탭을 닫으면 사라지고 다른 탭과 공유하지 않는다(의도이며 화면에 적음). 저장소가 막힌 브라우저에서는 그 페이지 안에서만 유지
- 390 px 에서 원장 · 표는 줄마다 쌓는 배치로 바꾼다. 표 머리줄을 시각적으로만 숨기므로 일부 화면 낭독기에서 표 의미가 약해질 수 있다
- 원장 줄 수정은 케이스 수만 된다(부위 변경은 삭제 후 다시 추가)
- 모션 녹화(`record-motion.mjs`)는 모작용 절차라 이번에는 돌리지 않았다. 모션은 `getAnimations()` 로 지속시간 · 꺼짐만 확인
- 이름 확인은 미국 기준 검색 도구 한계로 영국 회사 등록부까지는 보지 못했다

## 파일

```
studio/2026-W43-pellbrook/
├─ index.html · cuts/ (+ 6 규격서) · standing-orders/ · delivery/ · traceability/ · agent/ · accounts/ · faq/ · about/   (build.mjs 가 생성)
├─ data.mjs        내용 · 더미 데이터(영어)
├─ calc.mjs        계산 · 배송일 · 에이전트 규칙(빌드와 브라우저 공용)
├─ build.mjs       15쪽 + assets/data.js + assets/calc.js 생성, 문구-계산 대조
├─ assets/site.css · site.js · data.js · calc.js · photos/(12장)
├─ credits.json    사진 출처
└─ refs/photo-raw/ 받은 원본 묶음(gitignore)
```
