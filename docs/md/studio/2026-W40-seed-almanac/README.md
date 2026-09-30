# The Seed Almanac — 창작 (모작 아님)

가상의 지역 씨앗 도서관. 영어 사이트. 2026-09-30.
기획: [`research/2026-W40/build-concepts.md` §7](../../research/2026-W40/build-concepts.md)

## 한 줄

53 open-pollinated varieties with sowing months, days to germination, spacing and seed-saving notes; borrow up to 5 packets, return seed at harvest.
신문·연감 5단 조판 + 커다란 제호 + 괘선. 식물은 직접 그린 판화풍 SVG, 색은 씨앗 봉투 3색을 작은 면으로만.

## 소재

씨앗 정보는 전부 수치다 — 파종 달(실내/노지), 발아 일수, 포기·줄 간격(cm), 수확·개화까지 일수, 햇빛, 채종 난이도, 봉투당 씨앗 수.

- 이름 검색: "The Seed Almanac" 과 같은 이름의 단체·도서관 없음. The Old Farmer's Almanac 이 씨앗을 팔지만 이름·노란 표지·브랜딩을 쓰지 않았다
- 도서관·장소(Brackwater, The Old Weighhouse)·수치(회원 612 등)는 지어냈다. **식물은 전부 실제 종·실제 자가수분(OP) 품종**, F1 없음
- 원예 수치 기준: 온대 북반구(영국형), 마지막 서리 5월 15–25일, 첫 서리 10월 20–31일. 확실하지 않은 값은 범위로, 보수적으로
- 약효·효능 문구 없음. 안전 사실만 두 줄(스위트피 씨앗은 먹지 말 것, 파스닙 잎은 햇빛 아래서 피부 자극)

| | 값 |
|---|---|
| 품종 | 53 — 채소 34 · 허브 7 · 꽃 12 |
| 채종 난이도 | Easy 22 · Moderate 16 · Hard 15 |
| 햇빛 | Full sun 34 · Sun or part shade 11 · Light shade 8 |
| 달별 파종 가능 | 1월 2 · 2월 12 · 3월 36 · 4월 48 · 5월 43 · 6월 33 · 7월 21 · 8월 10 · 9월 12 · 10월 2 · 11월 2 · 12월 0 |
| 재고 | 봉투 494, Zinnia ‘Envy’ 는 0(품절 상태 표시용) |
| 대출 규칙 | 회원당 한 철 5봉, 11월 30일까지 씨앗 또는 미개봉 봉투 반납 |

12월 0종은 사실대로 둔다. 달력에서 12월을 고르면 "nothing to sow" 로 나온다.

## 토큰 (실측)

| 역할 | 값 | 대비 |
|---|---|---|
| 종이 / 먹 | `#F5F5F3` / `#161616` | **16.58:1** |
| 보조 글자 | `#565656` on 종이 | **6.72:1** |
| 오류 글자 (Madder) | `#A63A2B` on 종이 | **5.90:1** |
| 눌린 버튼 · 선택 달 | 종이 on 먹 | **16.58:1** |
| 호버 면 | `#E6E6E2` — 먹 14.46, 보조 5.87 | |
| 입력칸 | `#FFFFFF` — 먹 18.10 | |
| 봉투 3색 | Madder `#A63A2B` · Ochre `#C08A1E` · Sage `#3E6B4F` | **글자 안 올림** (면만) |
| 괘선 | `#9C9C98` 단 사이 · `#D2D2CE` 표 안 · 먹 굵은-가는 이중 괘선 | 글자에 안 씀 |

**실측 방법:** 59페이지 + 상태 4개(필터·담기 눌림, 바구니 서랍, 달력 4월 선택, 폼 오류)의 보이는 텍스트 노드 **9,019개** 전부 글자색과 실제 뒤 배경색으로 계산. **최저 5.90:1, 4.5 미만 0.**

- 종이는 크림이 아닌 중립 회백(R=G, B −2). impeccable cream 계열 경고 없음
- 봉투 색이 쓰이는 곳: 봉투 그림(덮개·아래 띠), 반납일 상자의 작은 사각, 달력에서 고른 달의 칸 채움, 오류 글자. 넓은 면에는 안 씀
- 모서리 0, 그림자 0, 그라데이션 장식 0 (달력 "둘 다" 칸의 반반 채움에만 `linear-gradient` 한 줄). 빗금은 SVG 타일

### 서체

- **Old Standard TT** 700 — 제호·제목·숫자 표제. 19세기 신문 활자 계열
- **Newsreader** 가변(opsz 6–72) — 본문·표·라벨. 광학 크기가 자동으로 붙는다
- Google Fonts CSS 200 확인. impeccable `overused-font` 없음. 지난 창작의 Barlow · Schibsted Grotesk · IBM Plex Mono · Spline Sans Mono · Hahmlet · SUIT · Archivo 와 안 겹침. **본문 세리프는 창작 중 처음**

### 조판

- 5단 그리드(`repeat(5, 1fr)`, 단 사이 40px), 단 사이 세로 괘선
- 제호 150px(1440) / 110 / 76 / 52(390). 제호 위 한 줄: 권·호 · 장소 · 날짜 (`Vol. IX · No. 40 · Wednesday, 30 September 2026`)
- 굵은-가는 이중 괘선(3px + 1px)이 섹션 머리마다
- 카탈로그는 CSS 다단(`columns: 5 210px`, `column-rule`) — 신문 안내란처럼 품종이 단을 따라 흐른다. 필터로 줄면 그대로 다시 흐른다
- 1024 이하 2단, 640 이하 1단. 달력은 390에서 "이름 한 줄 + 12칸" 격자로 바뀐다(가로 스크롤 없음)

## 페이지 (59)

| 페이지 | 한 줄 |
|---|---|
| `/` Front page | 이번 달(9월) 12종 파종 · 지금 씨앗이 익는 19종 · 반납일 · 도서관 수치 · 서리 · 대출 5단계 · 다음 달 · 선반 |
| `/catalogue/` | 53종을 파종 달 · 햇빛 · 채종 난이도로 거르고 선택지마다 개수를 본다 |
| `/varieties/<slug>/` ×53 | 한 품종의 수치 8줄 · 12달 띠 · 메모 · 채종 3단계 · 판화 · 같은 과 · 앞뒤 번호 |
| `/calendar/` | 12달 × 53종. 달을 고르면 그 달 심을 품종이 위에서부터 차례로 칠해진다 |
| `/borrow/` | 바구니(최대 5봉) + 대출 신청 폼 |
| `/return/` | 채종 6단계 · 난이도별 방법과 품종 · 작물별 최소 반납량 · 발아 검사 · 반납함 |
| `/about/` | 규칙 5 · 연표 · 방문 · 받는 씨앗 · 수치 · 판화 5장 |

기획서 11페이지(품종 4) → 59. 빌드가 데이터에서 찍으므로 53종 전부 만들었다. 4장만 두면 카탈로그 49줄이 막다른 곳이 된다.

`node build.mjs` 가 `data.mjs` 에서 59장 + `assets/varieties.js`(바구니용 이름표)를 만든다. 손으로 쓴 HTML 없음. 링크는 전부 상대경로 + `index.html`.

## 판화 — 어떻게 그렸나

`engrave.mjs`. 사진·스톡 이미지 0장, 외부 일러스트 0. 선 + 빗금으로만.

- 식물 형태 템플릿 **12종**: 열매 덩굴(토마토·고추·피망) · 꼬투리(덩굴콩·완두·잠두·스위트피, 지주/덤불 두 갈래) · 잎 로제트(상추·케일·근대·로켓…) · 뿌리(단면 흙선 아래 뿌리) · 파속(대파·양파·쪽파·차이브) · 박과 · 옥수수 · 꽃대(바질·보리지·파셀리아·물망초) · 산형(딜·고수·파슬리·처빌) · 국화형(칼렌듈라·코스모스·수레국화·백일홍) · 해바라기 · 컵꽃(한련·니겔라·캘리포니아포피·포치드에그)
- 품종 slug 를 시드로 줄기 굽음·잎 수·길이가 달라진다. 같은 템플릿이어도 품종마다 그림이 다름
- 음영: 모양으로 자르고(clipPath) → 빗금 패턴을 깔고 → 종이색 사본을 왼쪽 위로 밀어 덮는다. 오른쪽 아래에만 빗금이 남아 판화처럼 보인다
- 빗금 패턴 3종(38° 가는 선, −52° 성긴 선, 교차 빗금) + 흙 가로 선
- 해바라기 씨는 황금각 나선 위 마름모 330개를 한 path 로, 산형 꽃은 작은 v 획으로 (원 도형을 쌓지 않음)

## 모션 — 둘만

| | 무엇 | 어떻게 |
|---|---|---|
| 1 | 달력에서 달을 고르면 그 달 칸이 위에서부터 차례로 칠해짐 | 해당 달 파종 칸의 Madder 막대가 `scaleX 0→1`, 0.28s. 지연 = 순번 × min(32ms, 1100ms/개수) → 3월 36칸이 약 1.4초에 걸쳐 내려감. 달을 바꾸면 이전 칸은 즉시 비움 |
| 2 | 씨앗 봉투에 마우스를 올리면 덮개가 열리고 씨앗이 보임 | 덮개 `rotateX(172deg)`(원근 260px) + 씨앗 점 `translateY(40% → −55%)`, 0.45s. 카탈로그 항목에서는 이름 링크·담기 버튼에 키보드 포커스가 가도 열림(`:focus-within`) |

- `prefers-reduced-motion: reduce`: 두 모션의 transition 을 끄고 봉투는 닫힌 채로. **실측: 5월 선택 40ms 뒤 43칸 전부 채워짐, `transition-duration 0s`, 호버 시 덮개 transform `none`**
- 스크롤 등장 연출, 페이지 전환 연출 없음. 바구니 서랍도 애니메이션 없음

## 기능 — Playwright(npx 캐시 패키지 + 시스템 Chrome, 공유 MCP 브라우저 안 씀)로 눌러서 확인

| 기능 | 결과 |
|---|---|
| 카탈로그 필터 | 전체 53 → Mar 36 → +Light shade 7(이때 Easy 칩 개수 3으로 갱신) → +Hard 2, 주소 `?month=3&sun=shade&save=hard` → Dec 로 바꾸면 0, "No variety matches." + Clear → 53, 포커스 Jan 칩 · 주소로 진입 `?month=9&save=easy` → 7, 칩 눌림 복원 · 키보드 Enter 로 +Full sun → 5 · 칩마다 다른 필터를 반영한 개수 표시, `aria-pressed` |
| 봉투 모션 | 호버 시 덮개 `matrix3d(…−0.99…)`(172°) · 이름 링크 포커스에도 같은 값 |
| 바구니 | 6번 담기 → 5/5 에서 멈춤, 6번째 `aria-pressed=false`, 알림 "Basket full: 5 of 5 packets. Remove one to add another." · 첫 봉투 다시 누르면 빠짐 4/5 · 품절 Zinnia 버튼 `disabled` |
| 바구니 서랍 | `<dialog>` 열림, 5줄, `html overflow hidden` · 줄 삭제 → 4줄, 포커스는 그 자리 다음 줄의 Remove · ESC 닫힘 + 스크롤 잠금 해제 + Basket 버튼으로 포커스 복귀 · 바깥 클릭 닫힘 |
| 저장 | localStorage(읽기·쓰기 모두 try/catch, 막히면 메모리). About 로 옮겨도 4/5 · 품종 상세의 버튼 상태 동기화 |
| 파종 달력 | 3월 → 250ms 시점 완료 0칸, 1.85초에 36칸 완료(지연 0·31·61·92ms…) · 요약 "March: 36 to sow — 9 under cover, 20 outdoors, 7 either way." · 12월 → "nothing to sow" · 같은 달 다시 누르면 해제 · 키보드 Space 로 9월 선택 |
| 대출 폼 | 빈 제출 → 오류 5개 요약 상자(포커스 이동) + 칸마다 `aria-invalid` · `ada@` / `BW-12` / 우편 선택 시 주소 칸 등장 → 오류 4개 · 요약 링크 누르면 해당 칸 포커스 · 정상 입력(`bw-0412` 소문자도 통과) → 제출 막고 "Request not sent. Demo site — no lending system is connected, nothing was stored." · 바구니 비우고 제출 → "Basket is empty…" 오류, 전송 안 됨 |
| 모바일 메뉴 (390) | 열림 `aria-expanded=true`, 첫 링크 포커스, `html overflow hidden`, 휠 900px 에도 scrollY 0 · ESC 닫힘 + 토글로 포커스 · 링크 이동 |
| file:// | 홈 → Catalogue(필터 Easy 22, 담기 1/5) → 토마토 상세 → 다음 번호 → Calendar(5월) → Borrow(바구니 1줄) → Return → About → 제호로 홈. 폰트·CSS 적용, 콘솔 에러 0 |
| 콘솔 | 위 전 과정 에러 0 |

## 게이트

```
node scripts/verify-site.mjs http://127.0.0.1:4398
  페이지 120개 검사 (해시 변형 포함)
  문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개

npx --yes impeccable@latest detect  (이 폴더 html 59 + css 1, 예외 설정·억제 없음)
  findings [] , exit 0
```

한국어는 화면에 없다. `check-korean.mjs` 해당 없음.

## impeccable 처리 내역

처음 657건. 억제 없이 전부 값·구조로 고쳤다.

- `cramped-padding` ×295 — 목록 줄마다 점선 괘선을 두어 글자가 선에 붙음 → 목록 줄 괘선을 없애고 간격으로. 괘선은 섹션 머리·단 사이에만. 메뉴 구분선은 li 가 아닌 링크(안쪽 여백 18px)로 옮김
- `cramped-padding` ×53 — 1024 이하에서 단 위에 선을 긋고 일부 단만 여백 0 → 태블릿 단 위 선 없애고 행 간격 40px
- `clipped-overflow-container` ×221 — 달력 칸 막대가 `overflow: hidden` → 제거(채움 막대가 칸 안에 있어 필요 없었음)
- `repeating-stripes-gradient` ×59 — "실내 파종" 빗금을 `repeating-linear-gradient` 로 → 판화와 같은 빗금 SVG 타일
- `kicker-above-heading` ×12 — 제목 위 작은 대문자 라벨(Catalogue, Sow this month…) → 삭제하거나 제목에 합침("Return day: Sunday 4 October…", "Figures, 2026"). 품종 번호는 학명 줄 뒤로
- `shape-assembled-illustration` ×12 — 해바라기 씨(원 330개)·산형 꽃(원 120개)·빗금 바탕(rect) → 씨는 나선 위 마름모 한 path, 꽃은 v 획, 바탕은 path. 원 도형 0개
- `tight-leading` ×4 — 21px 링크(같은 과·앞뒤 번호)가 줄바꿈될 때 줄 간격 1.14 → 1.35. 여러 줄 되는 제목 1.3
- `skipped-heading` ×1 — 카탈로그 h1 다음 품종 이름이 h3 → h2
- `side-tab` / `cramped-padding` — 반납일 상자의 8px 위 색 띠 → 제목 앞 작은 봉투색 사각

## 작업 중 실제로 틀렸던 것

- **본문 위 여백 0.** `main{padding-top}` 을 `.wrap{padding}` 이 덮어 첫 줄이 메뉴 괘선에 붙음 → `main.wrap`
- **덩굴 줄기가 한쪽으로만 감김.** 지주를 도는 곡선의 좌우 판정이 `y % 52` 라 전부 참 → 순번 짝홀로
- **근대 잎자루가 검은 막대.** 두 겹 선의 안쪽을 0.1px 로 그림 → 먹 5px 위에 종이 3px
- **박과 잎이 나무처럼 보임.** 잎자루 끝에 작은 잎 다섯 장 → 잎 두 장을 크게, 땅 가까이
- **바구니 줄 삭제 후 포커스 오류.** 다시 그린 목록의 옛 노드로 위치를 찾음 → 콘솔 에러 2건 → 삭제 전 순번을 저장
- **달력 요약 숫자 합이 안 맞음.** "16 under cover, 27 outdoors"(합 43 ≠ 36) — 둘 다 되는 품종을 양쪽에 셈 → 실내만 · 노지만 · 둘 다로 나눔
- **10월 칸이 2종뿐이라 빈 띠.** 첫 화면 "다음 달" 을 파종 2 + 수확·개화 36 두 목록으로
- 공유 스크래치 폴더에 있던 남의 `shot.mjs` 를 같은 이름으로 한 번 덮어씀 → 이후 `sa/` 하위 폴더만 사용. 결과물 영향 없음

## 한계 · 안 한 것

- 대출 폼은 연결하지 않았다. 제출은 막고 "연결 안 됨" 을 화면에 밝힌다. 메일은 예약 도메인 `seedalmanac.example`
- 원예 수치는 영국형 기후 기준 일반 대역이다. 지역별 차이는 반영하지 않았다
- 판화는 템플릿 12종 변형이라 같은 과 품종끼리 모양이 닮는다(토마토 3종 등). 품종별 고유 특징(과실 색 등)은 먹 한 색이라 안 보인다
- Safari·Firefox 에서 직접 열어보지 않았다
- 사진 0장. `fetch-stock.mjs` 안 씀, `credits.json` 없음 — 판화풍 직접 그림이 기획

## 지난 창작과 무엇이 다른가

| | HALIDE | 새물 | CORRIDOR | 단청 | BRIAR | LOW LANTERN | 현상소(진행 중) | **Seed Almanac** |
|---|---|---|---|---|---|---|---|---|
| 레이아웃 | 카탈로그 목록 | 타일·표 | 운행표 | 전폭 도해 | 4열 제품 판 | 초대형 번호 포스터 | 필름 스트립 가로 흐름 | **신문 5단 조판 · 다단 흐름 · 제호** |
| 바탕 | 흰색 | 흰색 | 회백색 | 어두운 목재 | 흰색 | 흑백 교대 | 암실 검정 | **중립 종이 회백** |
| 색 | 없음 | 물색 1 | 신호 빨강 1 | 안료 면 | 제품 그림 안 | 원색 3 면 | 안전등 빨강 1 | **봉투 3색, 작은 면만** |
| 이미지 | 광학 SVG | 없음 | 노선 SVG | 도해 | 제품 SVG + 사진 | 재킷 도형 | 프레임 속 사진 | **판화풍 식물 SVG 53** |
| 서체 | 그로테스크+모노 | 고딕+모노 | Barlow+Plex Mono | 명조 | SUIT | Archivo | — | **세리프 둘(Old Standard TT + Newsreader)** |
| 모션 | — | — | 스크롤 노선도 | — | — | 소리 반응 면 · 음반 | 현상 떠오름 · 드래그 | **달력 차례 채움 · 봉투 덮개** |
| 특이 기능 | 대여 폼 | 레인 현황 | 3단계 예약 | 도해 확대 | 통화 전환 | 합성 미리 듣기 | 가격 계산 · 현황 조회 | **파종 달력 · 5봉 바구니** |

## 파일

```
data.mjs        도서관 · 햇빛/채종 정의 · 봉투 3색 · 품종 53
engrave.mjs     판화 12형태 + 빗금 패턴 defs
build.mjs       59페이지 + assets/varieties.js 생성
assets/site.css
assets/site.js  메뉴 · 바구니(저장·서랍) · 카탈로그 필터 · 파종 달력 · 대출 폼
assets/varieties.js  (생성물) 바구니용 이름·번호·봉투색
refs/           front-1440(+full) · front-768 · front-390(+full) · menu-390
                catalogue-1440(+full) · catalogue-1440-sep-easy · catalogue-390 · catalogue-packet-open
                calendar-1440-full · calendar-march-1440 · calendar-april-390
                variety-runner-bean-1440 · variety-sunflower-390-full
                basket-drawer-1440 · borrow-errors-1440 · return-1440-full · about-1440-full
```
