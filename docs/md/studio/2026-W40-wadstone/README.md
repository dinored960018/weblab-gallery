# Wadstone Pottery — 창작 (모작 아님)

가상의 소량 생산 도자기 공방. 영어 사이트. 2026-10-02.
기획: [`research/2026-W40/build-concepts.md` §11](../../research/2026-W40/build-concepts.md) · 사용자 승인 "추천대로 진행"

## 한 줄

A glaze library of 36 tested recipes, a kiln firing calendar and wheel and hand-building classes you can book by the seat.
흙 · 유약 색을 화면 끝까지 닿는 면으로 깔고(테라코타 · 청자 · 천목), 직접 그린 유약 시험 타일 36장이 주인공.

## 이름

- **Wadstone** — wad(가마 안에서 그릇 밑에 괴는 내화 점토 받침) + stone
- 검색 2026-10-02: `"Wadstone" pottery OR ceramics OR clay OR studio` → 같은 이름의 공방 · 도예가 없음. `"Wadstone"` → 성씨, 런던 부동산 법인뿐
- 버린 후보: Kettlehole(캐나다 오타와 Kettlehole Pottery 실존) · Slakewater(공방 Slake 와 가까움) · Glost House(스토크온트렌트 카페) · Coilhouse(잡지) · Saggar Lane(호주 실제 도로명)
- 마을 Ferrow · Tannery Yard 는 지어냄. 메일 `wadstone.example`(예약 도메인), 전화 01632 960 xxx(영국 방송·드라마용 번호대)

## 소재 · 수치

| | 값 |
|---|---|
| 유약 | 36 — 콘 10 환원 12 · 콘 6 산화 18 · 콘 04 산화 6 |
| 색 계열 | Blue 8 · Green 7 · Brown and black 5 · Red and pink 5 · White and clear 6 · Yellow and amber 5 |
| 광택 | Glossy 23 · Satin 10 · Matte 3 |
| 식기 안전 | Food-safe 29 · Outside only 7 (구리 무광 · 저화도 구리 · 흐르는 재유 · 플로트 계열 · 무광 철) |
| 소성 온도 | 오튼 콘 04 = 1060 °C · 6 = 1222 °C · 10 = 1285 °C (시간당 150 °C 기준값) |
| 베이스 | 16종, 원료 % 합 100 + 착색제 추가 %. 셀라돈 4321 · 5원료 유광(20×5) 같은 흔한 스튜디오 비율 대역. 납 · 바륨 · 망가니즈 없음 |
| 가마 | 비스크(전기 B) 매주 · 콘 6(전기 A) 매주 · 콘 10 환원(가스 C) 격주. 10~12월 회차 B-40~B-51 · A-40~A-51 · C-19~C-24, 12월 19일~1월 4일 휴무 |
| 수업 | 물레 6주 £260 · 8석 / 핸드빌딩 4주 £180 · 10석 / 유약 실습 1일 £95 · 6석. 회차 10개, 그중 만석 3개(대기 1~3명) |
| 상점 | 그릇 5종 + 시험 타일 세트, £18~£48. 우편 £6.50 |

- 실제와 맞춘 것: 원료 이름(Custer feldspar · EPK · Frit 3134 등), 콘 온도, 구리 무광 · 저화도 구리는 용출 위험이라 바깥만, 진사(Oxblood)는 가마 아래칸, 감(Kaki)은 서냉 필요 등 일반 공방 상식
- 화면에 밝힘(푸터 전 페이지 · About 첫 문단): "Practice site… firings, classes, prices and test results are fictional. Recipes follow common studio ranges. Test any glaze yourself before using it on food ware." 레시피를 실제로 쓰는 사람이 있을 수 있어 넣었다

## 토큰 (실측)

| 역할 | 값 | 대비 |
|---|---|---|
| 초벌 회백 바탕 / 먹 | `#E9E9E6` / `#1E1A17` | **14.20:1** |
| 보조 글자 | `#5A534D` | 바탕 6.21 · 흰 7.56 |
| 테라코타 면 (흙) | `#8E4527` 위 흰 글자 / 보조 `#F4E4DA` | 6.93 / 5.59 |
| 청자 면 (유약 1) | `#A9C2B2` 위 먹 / 보조 `#34433B` | 9.09 / 5.49 |
| 천목 면 (유약 2) | `#231915` 위 `#EFE9E2` / 보조 `#B8ACA2` | 14.27 / 7.75 |
| 철적 (유약 3) — 오류 글자 · 현재 메뉴 밑줄 · 포커스 링 · 막대 | `#9A3F1E` | 바탕 5.56 |
| 입력칸 · 서랍 · 달력 상세 | `#FFFFFF` | 먹 17.28 |
| 괘선 | `#C9C4BD` · 입력 테두리 `#6B635C` | 글자에 안 씀 |

**실측 방법:** 46페이지 × 1440 / 390 + 상태 8개(장바구니 서랍 + 결제 안내, 필터 빈 결과, 필터 적용, 달력 날짜 선택 + 가마 숨김, 예약 오류, 좌석 초과 대기 안내, 예약 완료, 모바일 메뉴)의 보이는 텍스트 노드 **10,128개** 전부 글자색과 실제 뒤 배경색(반투명 겹침 합성)으로 계산. 대화상자가 열리면 대화상자 안만. **최저 5.49:1(청자 면 위 보조 글자), 4.5 미만 0.**

- 바탕은 처음 `#ECEAE6` 이었다가 impeccable `cream-palette` 에 걸려 R=G, B −3 의 중립 회백 `#E9E9E6` 로 바꿈
- 버튼 · 칩은 알약형(모서리 999px) — 지난 창작들의 모서리 0 과 다르게. 그림자 0, 장식 그라데이션 0(그라데이션은 타일 · 그릇 SVG 안의 유약 두께 · 반사 표현에만)

### 서체

- **Young Serif** 400 — 제목 · 유약 이름 · 큰 숫자 · 가격. 무겁고 둥근 획
- **Hanken Grotesk** 가변 400–800 — 본문 · 표 · 라벨, `tabular-nums`
- Google Fonts CSS 200 확인. impeccable `overused-font` 목록(Inter · Roboto · Fraunces · Geist · Plus Jakarta · Space Grotesk · Recoleta · Instrument Sans/Serif 등) 밖. 지난 창작 서체(Barlow · Schibsted · Plex Mono · Spline Mono · Hahmlet · SUIT · Archivo · Old Standard TT · Newsreader · Spoqa · Martian Mono · 나눔스퀘어 네오 · Overpass · Roboto Flex 외)와 같은 날 물레내장(East Sea Dokdo · Gothic A1)과 안 겹침

## 유약 타일 — 어떻게 그렸나

`tile.mjs`. 사진 아님. 원 · 사각 도형을 쌓지 않고 path 로만. 점 · 알갱이 무늬 0.

- 세로 시험 타일(100 × 170). 손으로 자른 듯 모서리가 조금씩 어긋남(유약 slug 시드)
- **위 1/4 맨 흙** — 콘별 소지 색(적토 · 버프 · 환원 소지 · 백자)
- **첫 담금선** 물결 + 얇아진 가장자리에 브레이크 색, **아래 절반 두 번째 담금**(두꺼워져 진해짐)
- **눌러 찍은 홈 3줄** — 홈에는 유약이 고여 진한 선, 바로 위 모서리는 얇아져 브레이크 색
- **흐름** 0~3 — 홈에서 흘러내린 가늘고 긴 줄기, 2 이상은 바닥에 고임
- **광택** — 비스듬한 창 반사 띠. Glossy 좁고 선명(+홈 위 반짝임), Satin 넓고 흐림, Matte 없음
- **효과** — 빙열(가는 선 그물) · 토끼털 · 루틸 줄무늬 · 유백(균요) · 시노 붉은 그을림 · 투명(소지가 비침)
- **얼룩** — `feTurbulence` 저주파 잡음을 유약 면에만 합성해 유약 두께 차이처럼
- 그릇(`vessel`) 5형태: 머그 · 사발 · 접시 · 주전자 · 꽃병. 굽은 맨 흙, 유약 경계선, 흐르는 유약은 굽 위로 흘러내림
- 상점의 유약 선택을 바꾸면 그림이 그 유약으로 바뀐다

## 페이지 (46)

| 페이지 | 한 줄 |
|---|---|
| `/` Home | 히어로(이름 + 한 줄 + 물레 위 항아리) · 이번 주 가마 3종 · 타일 벽 12 · 수업 3 · 공방 수치 · 방문 |
| `/glazes/` | 36종 타일 벽을 색 · 광택 · 콘 · 식기 안전으로 고르기. 타일 읽는 법 |
| `/glazes/<slug>/` ×36 | 큰 타일 · 조성표(배치 g 계산) · 소성 조건 8항목 · 얇은 곳/두꺼운 곳/흐름/메모 · 같은 베이스 · 앞뒤 |
| `/kiln/` | 10~12월 달력 · 가마 고르기 · 날짜 상세 · 가마 3대 규격 · 적재 규칙 6 |
| `/classes/` | 세 과정을 색 면 하나씩, 회차별 잔여석 |
| `/classes/<slug>/` ×3 | 주차별 내용 · 포함 사항 · 좌석 예약 폼 |
| `/shop/` | 그릇 6종 · 유약 고르기 · 배송 |
| `/visit/` | 여는 시간 · 오는 길 · 접근성 · 오픈 스튜디오 요금 · 시설 |
| `/about/` | 가상 공방 고지 · 연표 · 유약 시험 5단계 · 수치 · 사진 · 사진 출처 |

기획서 9종(유약 상세 ×N, 수업 상세 ×3) → 46. 빌드가 데이터에서 찍으므로 유약 36종 전부 상세를 만들었다(타일 벽에 막다른 곳 없음).
`node build.mjs` 가 `data.mjs` + `tile.mjs` 에서 46장 + `assets/data.js` 를 만든다. 손으로 쓴 HTML 없음. 링크는 전부 상대경로 + `index.html`.

## 모션 — 하나

| 무엇 | 어떻게 |
|---|---|
| 홈 히어로의 항아리가 물레 위에서 돈다 | 항아리 실루엣 clipPath 안에서 담금선 물결 · 흘러내림 · 붓 자국 띠를 4번 이어 그리고 `translateX(-160)` 를 9초 linear 반복 → 회전처럼 보임. 원통 음영 · 반사 띠는 고정(실제로 도는 그릇도 빛은 제자리). 물레 판 눈금은 `stroke-dashoffset` 으로 같은 9초, 앞면이 같은 방향으로 이동. **Stop the wheel / Start the wheel** 버튼으로 멈춤 |

- 그 밖: 타일 호버 시 6px 들림(220ms), 버튼 · 칩 색 전환(160ms). 스크롤 등장 · 페이지 전환 연출 없음, 서랍 애니메이션 없음
- `prefers-reduced-motion: reduce`: 회전 · 눈금 `animation: none`, 멈춤 버튼 숨김, 타일 들림 · 전환 0s. **실측 확인**(아래 표)

## 기능 — Playwright(npx 캐시 playwright-core + 시스템 Chrome, 공유 MCP 브라우저 안 씀)로 눌러서 확인 · **67/67 통과, 콘솔 에러 0**

| 기능 | 결과 |
|---|---|
| 유약 고르기 | 36 → Blue 8 → +Satin 3, 주소 `?family=blue&finish=satin`, "Showing 3 of 36 glazes" · 다른 칩 개수 갱신(Green 1) · `aria-pressed` · +food-safe 3 · +Matte(같은 묶음 안은 OR) 3 · 주소 `?family=blue&finish=matte` 로 진입 → 0, 빈 상태 + 칩 눌림 복원 → Clear → 36, 주소 정리, 포커스 첫 칩 · 키보드 Enter 로 Green 7 |
| 배치 계산 | Hare's Fur 500 g → Custer feldspar 220.0 g, 합계 550.0 · 50 g → "Enter 100 to 20,000 grams." |
| 가마 달력 | 10월 → 11월 → 12월(Next 비활성, 포커스 Previous 로 이동) · 12월 24일 → 휴무 안내 · 10월 2일 → "Friday 2 October, today", C-19 적재 → Sat 3 Oct 소성 → Tue 6 Oct 찾기 · 날짜 `aria-pressed` · Cone 10 숨김 → 2일이 빈 칸, 상세 "No firing… among the kilns shown", 칩 `aria-pressed=false` · 키보드 Enter 로 5일 → B-41 |
| 좌석 예약 | 빈 제출 → "5 things to fix" 요약(포커스 이동) + `aria-invalid` · 요약 링크 → 해당 칸 포커스 · 만석 회차 → "Join the waiting list", 대기 4번 · 잔여 2석에 3석 → "Only 2 seats left…" · 스테퍼 최대 4 · 2석 → "Book 2 seats, £520" · `ada@` + 전화 3자리 → 오류 2 · 정상 → "Booking not sent… nothing was stored, sent or charged."(포커스 이동) · `?date=h-1010` 진입 → 만석 회차 선택 + 대기 버튼 |
| 장바구니 | 담기 → `<dialog>` 서랍 + 스크롤 잠금, 개수 1 · ESC 닫힘 + Add 버튼으로 포커스 복귀 · 유약 바꾸면 그림 교체 · 다른 유약 담기 → 2줄 · 수량 + → 3개 £84 · 우편 → £90.50 · Check out → "Checkout is not connected…" · 줄 삭제 → 다음 Remove 로 포커스 · 바깥 클릭 닫힘 · About 로 옮겨도 유지(localStorage, 막히면 메모리) · 비우면 빈 상태 |
| 모바일 메뉴(390) | 열림 `aria-expanded=true`, 첫 링크 포커스, 버튼 문구 Close, 휠 900px 에도 scrollY 0 · ESC 닫힘 + 버튼 포커스 · 링크 이동 |
| 물레 | transform 이 500ms 사이 −3.6 → −12.7 로 변함 · Stop → `animation-play-state: paused`, 버튼 "Start the wheel" |
| reduced-motion | `animation-name: none`, 멈춤 버튼 숨김, 타일 transition 0s |
| file:// | 홈 → Glazes(Green 7) → Harbour Celadon → Next(Ying Pale) → Kiln → Classes → Glaze mixing day → Shop(담기) → Visit → About(장바구니 1 유지) → 로고로 홈. Young Serif 적용, 콘솔 에러 0 |

## 게이트

```
node scripts/verify-site.mjs http://localhost:4424/
  페이지 120개 검사 (해시 · 쿼리 변형 포함)
  문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개

npx --yes impeccable@latest detect  (이 폴더 html 46 + css 1, 예외 설정 · 억제 없음)
  출력 없음, exit 0 (권고 advisory 도 0)
```

한국어는 화면에 없다. `check-korean.mjs` 해당 없음.

## impeccable 처리 내역

처음 238건. 억제 없이 값 · 구조로 고쳤다.

- `cream-palette` ×46 — 바탕 `#ECEAE6`(따뜻한 회백) → `#E9E9E6`(중립)
- `cramped-padding` ×192 — 색 면 섹션의 좌우 여백을 안쪽 `.wrap` 이 갖고 있어 정적 검사기가 섹션 자체 여백 0 으로 읽음. 또 `padding-inline` / `padding-block` 낱 속성과 `clamp()` 는 0 으로 읽힘(시험 페이지로 확인) → 섹션에 `padding: 112px 56px` 식 px 단축 속성, 1180 · 760 에서 단계별로. 달력 칸은 테두리에 글자가 붙어 있어 칸 안 여백 8px, 달력 위 · 왼쪽 굵은 선은 요일 줄 · 첫 열 칸으로 옮김

## 작업 중 실제로 틀렸던 것

- **달력 빈 날의 숫자가 48px 아래로.** 유약 빈 결과용 `.empty { padding: 48px 0 }` 가 달력의 빈 날 `.day.empty` 에도 걸림 → 빈 결과 쪽을 `.no-match` 로
- **휴무일을 눌러도 아무 일 없음.** 빌드가 이벤트 없는 휴무일에 `empty` 를 붙여 클릭을 막음 → 휴무일은 빈 날에서 제외(테스트 1건 실패로 발견)
- **물레 무늬 이음매.** 무늬 띠를 복제할 때마다 난수를 다시 뽑아 반복 경계가 튐 → 물결 높이를 한 번만 뽑아 공유
- **타일이 줄무늬 견본처럼 보임.** 홈 4줄을 밝은 선으로 그리고 세로 반사선을 끝까지 그음 → 홈 3줄을 "고인 진한 선 + 위 모서리 브레이크"로, 반사는 비스듬한 창 띠로, 흐름은 가늘고 긴 줄기로
- **그릇 흐름이 얼룩처럼.** 몸통 가운데 짧은 방울 → 흐름 2 이상만, 유약 경계에서 굽 쪽으로
- **수업 상세 머리의 사실 라벨이 안 보임.** `.facts dt` 의 보조색이 테라코타 면 규칙을 덮음 → 면별 `.field-* .facts dt`
- **모바일 메뉴 위로 히어로 색이 비침.** 메뉴 시작 위치를 73px 고정 → 열 때 머리 높이를 재서 맞춤
- **"Tuesdays, Tue 13 Oct"** 요일 중복 → 날짜 범위만
- 면책 문구가 "tested recipes"(한 줄 정의)와 "not tested by us" 로 서로 어긋남 → "test results are fictional" 로 정리
- 공유 스크래치 폴더 `wd/` 에 다른 작업 파일이 있는 줄 모르고 내 스크립트 6개를 한 번 썼다 → 바로 `wadstone-x/` 로 옮김. 그 폴더의 남은 파일은 내 파일을 참조하지 않음. 다만 `pw.mjs` 가 원래 그 폴더에 있었는지는 확인할 수 없다

## 사진

Pinterest(`fetch-stock.mjs`) 3회 검색 60장 중 **12장**. 공방 선반 · 초벌 그릇 · 물레 위 손.
제외: 얼굴이 보이는 컷 전부, 글자가 찍힌 컷(`stillness` 문구 · 워터마크 · 앞치마 라벨), 반점 · 구멍 무늬 그릇(점박이 사발 · 구멍 뚫린 사발), AI 생성으로 보이는 컷(빛나는 열린 가마 · 매끈한 렌더 느낌 물레 사진 다수).
보조로만 씀(홈 2 · 수업 목록 3 · 수업 상세 3 · 방문 2 · 소개 3 = 13자리, stack 만 두 번). `credits.json` 에 핀 주소 · 명도 · 원 파일명. About 에 출처 목록. 나머지 48장은 삭제.

## 남은 것 · 한계

- 예약 · 결제 연결 없음(화면에 명시). 대기 순번 · 잔여석은 고정 데이터라 예약해도 줄지 않는다
- 날짜 기준이 2026-10-02 로 고정("Dates as of Friday 2 October"). 이후에 열면 지난 회차도 그대로 보인다
- 유약 레시피는 흔한 대역을 따른 연습값이다. 실제 소성 시험을 하지 않았다
- 타일 그림은 규칙 기반이라 같은 효과끼리 닮는다(유광 반사 띠 위치 등). 오일스팟 · 크롤 · 반점 유약은 점 무늬 금지로 넣지 않았다
- 접시 그림은 옆모습이라 형태가 약하다
- 390 에서 가마 표(6열)는 표 안 가로 스크롤
- Safari · Firefox 에서 직접 열어보지 않았다

## 지난 창작과 무엇이 다른가

| | Seed Almanac | Quoin & Slug | 물레내장 (같은 날) | **Wadstone** |
|---|---|---|---|---|
| 레이아웃 | 신문 5단 조판 | 견본 한 줄 전폭 + 가이드 선 | 카드 없는 좌판 줄 | **전폭 색 면 분할 + 시험 타일 벽** |
| 바탕 | 종이 회백 | 순백 | 갱지 | **중립 회백 + 테라코타 · 청자 · 천목 면 교대** |
| 색 | 봉투 3색 작은 면 | 마젠타 선 하나 | 가격표 노랑 · 천막 빨강 | **흙 1 + 유약 3, 넓은 면** |
| 이미지 | 판화 SVG | 0 — 글자 | 배치도 SVG + 사진 | **그린 유약 타일 36 + 그릇 SVG + 공방 사진 12(보조)** |
| 서체 | 세리프 둘 | 가변 견본 여섯 | 손글씨 + 고딕 | **Young Serif + Hanken Grotesk** |
| 모양 | 모서리 0 | 모서리 0 | — | **알약형 버튼 · 칩** |
| 모션 | 달력 채움 · 봉투 | 포인터로 축 | 지도 칠하기 | **물레 회전 하나** |
| 특이 기능 | 파종 달력 | 가변 축 테스터 | 장날 계산 | **유약 4축 고르기 · 배치 계산 · 가마 달력 · 좌석 예약 + 대기 명단** |

## 파일

```
data.mjs        공방 · 콘 · 베이스 16 · 유약 36 · 가마 · 회차 생성 · 수업 · 상품 · 연표
tile.mjs        시험 타일 · 그릇 5형태 · 물레 위 항아리 SVG
build.mjs       46페이지 + assets/data.js 생성
credits.json    사진 12장 출처
assets/site.css
assets/site.js  메뉴 · 장바구니(저장 · 서랍) · 유약 고르기 · 배치 계산 · 가마 달력 · 좌석 예약 · 물레 멈춤
assets/data.js  (생성물)
assets/photos/  사진 12
refs/           home-1440(+full) · home-768 · home-390(+full) · menu-390
                glazes-1440-full · glazes-filter-1440 · glazes-empty-1440 · glazes-390-full
                glaze-oxblood-1440-full · glaze-chun-390-full
                kiln-1440-full · kiln-selected-1440 · kiln-768 · kiln-390-full
                classes-1440-full · class-wheel-1440-full · class-glaze-day-390-full
                book-errors-1440 · book-waitlist-1440 · book-done-1440
                shop-1440-full · shop-390-full · cart-drawer-1440 · visit-1440-full · about-1440-full
```
