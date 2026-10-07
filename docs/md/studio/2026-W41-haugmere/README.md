# Haugmere Sauna — 창작 (모작 아님)

가상의 호수 Haug Mere 동쪽 기슭의 공공 장작 사우나. 영어 사이트. 2026-10-07(수).
기획: [`research/2026-W41/build-concepts.md` §4](../../research/2026-W41/build-concepts.md) · 포트 4413

## 한 줄

방 셋(장작 난로방 · 연기 사우나 · 증기방)의 온도와 정원, 오늘 호수 수온과 입수 안내, 이번 주 90분 회차와 남은 자리, 요금, 그리고 예약한 회차를 시계 시각 일정으로 바꿔 주는 계획표.
**풀블리드 사진 구간 + 12단 비대칭 그리드.** 고정 바탕이 없고, 사진 평균색에서 뽑은 면 다섯이 스크롤 위치에 따라 바탕을 바꾼다.

## 이름

- **Haugmere** — haug(언덕) + mere(호수). 검색 2026-10-07: `"Haugmere"` → 같은 이름의 장소 · 상호 없음, `"Haugmere" sauna OR baths` → 노르웨이 Heit Haugesund Sauna만(이름 다름)
- 버린 후보 **Tarnfoss** — 영국 레이크 디스트릭트의 실존 "Tarn Saunas"가 걸림
- 도시 Haugby, 우편번호 HB9(실재 안 함). 처음 "Cumbria-on-Mere CA99"로 썼다가 실존 주(Cumbria) · 실존 우편 구역(CA)이라 바꿈
- 메일 `hello@haugmere.example`(예약 도메인), 전화 01632 960 418(영국 방송용 번호대)

## 소재 · 수치

전부 지어냈고 Wed 7 Oct 2026, 16:20 BST 고정.

| 항목 | 값 |
|---|---|
| 난로방 | 80–88 °C, 습도 10–20 %, 14석 3단, 돌 220 kg, 장작 하루 약 35 kg, 데우기 2 h 30 min |
| 연기 사우나 | 65–75 °C, 10석, 금–일 18:00–20:00, 5시간 데운 뒤 1시간 연기 빼기, 18세 이상 |
| 증기방 | 43–46 °C, 습도 100 %, 8석 |
| 회차 | 평일 9회(07:00부터 105분 간격), 주말 8회. 화·목 07:00 조용한 회차(16세 이상), 수 19:15 · 일 08:00 여성 전용. 주 64회 |
| 요금 | 회차 £13 / 피크(월–목 17시 이후 · 금–일) £16, 할인 £9 / £11, 연기 사우나 £26 / £20, 10회권 £120, 수건 £3, 가운 £5, 통째 대여 £240 |
| 호수 | 오늘 12.4 °C(07:00, 사다리 0.5 m), 14일 측정 14.9 → 12.4, 월평균 3.4–17.8 °C, 사다리 수심 2.4 m, 로프 구역 25 m |

남은 자리는 시드 해시로 고정(빌드마다 같음). 오늘 17:30 은 홈 문구와 맞추려 6/22로 고정, 연기 사우나는 금 2 · 토 0 · 일 4.

## 토큰 (실측 대비)

사진 평균색(`fetch-stock` 측정, `credits.json` `color`)을 글자 대비가 나오게 눌러 면 색으로 썼다. `data.mjs` `FIELDS` → `build.mjs` 가 `assets/fields.css` 생성.

| 면 | 출처 평균색 | 바탕 / 글자 · 보조 | 대비 |
|---|---|---|---|
| Fog | `#786c60` (fog-platform) | `#6E6357` / `#F4EEE6` | 5.08 |
| Lake | `#849398` (jetty-evening; 처음 기준이던 glass-drops 는 교체로 빠짐, 값은 유지) | `#3F5259` / `#EEF2F0` · `#C7D6D8` | 7.26 · 5.48 |
| Moss | `#575932` (cabin-moss) | `#4A4C2A` / `#F0EBD8` · `#D9D6B0` | 7.45 · 6.02 |
| Ember | `#664321` (logs) | `#6B3F1E` / `#F6E7D2` · `#F2B48A` | 7.34 · 4.96 |
| Tile | `#d3c7b8` (marble-basins) | `#C9C2AE` / `#1E1C17` · `#4A4436` | 9.57 · 5.44 |
| Ash (폼 · 목록 · 발) | — | `#1F1E1A` / `#ECE6DA` · `#C9C1B2` | 13.42 · 9.34 |
| 입력칸 | — | `#2A2924` / `#ECE6DA` · `#C9C1B2` | 11.73 · 8.16 |
| 난로 주황(오류 · 경고 · 체크) | — | Ash 위 `#F08A4B` · 입력칸 위 | 6.71 · 5.86 |

- 주황은 Ash 면에서만 쓴다. 그라데이션 · 그림자 · 둥근 모서리 · 괘선 없음
- 버튼은 그 면의 글자색 면 + 바탕색 글자(대비 = 그 면의 대비)

### 서체

- **Gloock** — 제목 · 큰 수치(84 °C, 12.4 °C, £16, 시각). 대비 큰 세리프, 비례 숫자
- **Familjen Grotesk** 400–700 — 본문 · 라벨 · 폼
- Google Fonts CSS 200 확인. 고정폭 서체 없음. 지난 14건 + 같은 날 §3(Black Han Sans · Paperlogy)과 안 겹침

## 레이아웃 — 풀블리드 사진 구간 + 비대칭

- 한 구간 = 사진 한 장 + 그 사진의 면 색. 사진은 화면 왼쪽 또는 오른쪽 끝까지 블리드(`margin: -pad`), 글은 12단에서 1–5 · 9–12 처럼 비껴 놓고 구간마다 좌우를 뒤집는다(`.flip`)
- 안쪽 페이지는 "왼쪽 1–3단 소제목 + 5–12단 내용"의 비대칭 한 가지로 통일
- 카드 · 괘선 · 상자 없음. 회차 · 요금 · 계획표는 큰 세리프 숫자 + 한 줄 설명의 목록이고, 줄 사이는 여백만

## 페이지 (13)

| 경로 | 전달하는 것 |
|---|---|
| `/` | 호수 12.4 °C · 난로방 84 °C · 다음 회차 17:30(6/22) → 방 셋(각자 면 색) → 호수 → 오늘 남은 회차 → 오시는 길 |
| `/rooms/` | 방 셋 비교 — 온도 · 습도 · 정원 · 여는 날 · 데우는 시간 |
| `/rooms/stove/` · `/smoke/` · `/steam/` | 방별 수치 5–6, 설명, 사진 라이트박스(5 · 3 · 3장), 다른 방 |
| `/sessions/` | 주간 64회 — 날 · 종류 · 시간대 · 자리 있는 것만, 주소 복원 |
| `/book/` | 예약 + 요금 계산 + 검증. 전송 없음 |
| `/plan/` | 라운드 계획표 — 시계 시각 일정, 남는/넘치는 분 |
| `/lake/` | 오늘 수온, 입수 안내(입력 → 구간), 월평균 막대(SVG), 14일 측정, 호수 사실 |
| `/prices/` | 회차 5종 · 카드와 대여 4종 · 할인 대상 |
| `/visit/` | 버스 · 자전거 · 차 · 도보, 여는 시간, 가져올 것 |
| `/rules/` | 규칙 6(펼침) |
| `/about/` | 가상 고지 · 수치 6 · 사진 6 라이트박스 · 사진 출처 24 |

## 모션 — 둘

1. **바탕 색 이어 바꾸기** — 화면 가운데 선을 지나는 구간의 `data-field` 를 `html` 에 옮기고, `@property` 로 등록한 `--bg/--fg/--fg2` 를 600 ms `cubic-bezier(.2,.7,.2,1)` 로 전환. 글자색도 같이 넘어가서 전환 중 대비가 뒤집히지 않는다. JS 가 없으면 구간마다 자기 면 색을 칠한다(`html:not(.js)`)
2. **라이트박스 열기** — View Transitions 로 누른 썸네일 자리에서 240 ms 커진다. 미지원이면 그냥 열림

`prefers-reduced-motion` → 전환 0 s, 뷰 전환 애니메이션 없음(테스트로 확인). 스크롤 등장 연출 없음.

## 기능 — 헤드리스 Chrome(playwright-core + 시스템 Chrome, 한 번에 하나)으로 눌러서 확인 · **58/58 통과, 콘솔 에러 0**

| 기능 | 결과 |
|---|---|
| 바탕 전환 | 홈 시작 fog → 난로방 구간 ember → 증기방 tile → 오늘 회차 ash. 전환 도중 `rgb(64,61,53)` → 끝 `rgb(31,30,26)` |
| 회차 고르기 | 오늘 9건 "9 sessions, 3 with places on Wed 7 Oct" · 토 칩 `aria-pressed` + `?day=2026-10-10` 9건 · 연기 사우나 1건 · 조용한 회차 → 빈 상태 → Clear → 주 64건 · 저녁 + 자리 있음 12건, `?part=evening&open=1` · `?day=2026-10-09&type=smoke` 진입 복원 · 칩 키보드 Enter |
| 예약 | 빈 제출 → "6 things to fix" 요약 포커스 + `aria-invalid` · 요약 링크 → 칸 포커스 · 21:00 회차 안내 "3 of 22 places left. Peak price." · 스테퍼로 4명 → "Only 3 places left" · 4 × £16 = £64 · 10세 → "No one under 12" · 할인 1명 14세 → "needs an adult" · 연기 사우나 17세 → "18 and over" · 메일 · 휴대전화 형식 · 2명 + 수건 2 = £38 · 제출 → "Not booked — nothing was sent … drops to 4 of 22"(포커스) · 회차 페이지 17:30 "4 of 22 places" · `?session=` 미리 고름 |
| 계획표 | 기본 "4 minutes to spare", 11줄 17:30 → 18:56 · 라운드 + (키보드 Enter) → "22 minutes over" + 주황 · `?rounds=4` · 2시간 → "8 minutes to spare" · `?start=18:00&len=120&rounds=2&heat=15…` 복원 · 99 입력 → 20 으로 묶음 |
| 입수 안내 | 오늘 "Up to five minutes" · 5 °C → "One minute" + 슬라이더 동기 · 슬라이더 → 20번 → 7.0 "Up to two minutes" · 오늘 단추 12.4 |
| 라이트박스 | 열림 · "1 of 5" · 닫기 단추 포커스 · → 다음(heater-steam) · 이전 두 번 → 5 of 5 · ESC 닫힘 + 썸네일로 포커스 복귀 · 바깥 클릭 닫힘 · 키보드 Enter 열기 + 닫기 단추 |
| 규칙 | `summary` Enter 로 펼침 |
| 모바일 메뉴(390) | 열림 `aria-expanded=true` · 첫 링크 포커스 · 휠 900 px 에도 scrollY 0 · ESC 닫힘 + 단추 포커스 · 링크 이동 |
| reduced-motion | `html` transition 0 s |
| file:// | 홈 → Rooms → Smoke → Steam → Sessions(고르기 동작 9건) → Book |

## 게이트

```
node scripts/verify-site.mjs http://localhost:4413/
  페이지 96개 검사 (쿼리 · 해시 변형 포함)
  문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개

npx --yes impeccable@latest detect index.html */index.html rooms/*/index.html assets/site.css assets/fields.css
  (html 13 + css 2, 설정 · 억제 없음) 출력 없음, exit 0 — 권고(advisory) 포함 0
```

한국어는 화면에 없다. `check-korean.mjs` 해당 없음.

## impeccable 처리 내역

처음 45건 + 권고 1 → 0. 억제 없이 고쳤다.

- `cramped-padding` ×26 — 사진 구간(section)이 위아래 0 · 좌우 0 이라 "면 위에 글이 붙음"으로 잡힘 → 좌우 여백을 `.grid` 에서 `.band` 로 옮기고 사진 구간도 위아래 40 px(모바일 16) 띄움. 블리드는 음수 여백으로 그대로
- `broken-image` ×13 — 라이트박스의 빈 `<img>` → JS 에서 만들어 넣음
- `tight-leading` ×5 — 사실 목록 `dd` 1.2 → 1.3, 큰 세리프 목록 줄(시각 · 요금 · 방 이름) 1.0–1.25 → 1.3–1.35
- `aphoristic-cadence` — 규칙 페이지의 "No diving…" "No talking…" "No one under 12." "No oils, no scents." 네 문장 → 이어지는 한 문장으로
- `em-dash-overuse`(권고) — 예약 · 계획표 옵션 32개의 "17:30 — Sauna session" → 쉼표

## 작업 중 실제로 틀렸던 것

- **같은 날 §3 과 겹침.** 처음 기획은 가로 스크롤 홈 + 라운드 타이머였는데, §3(볕가락제면소)이 가로 흐름 줄 + 삶기 타이머를 먼저 잡아서 풀블리드 세로 구간 + 계획표(시간을 재지 않고 일정을 냄)로 바꿈
- **회차 목록이 12단 중 한 칸에 끼어 세로로 무너짐** — `#s-rows` 에 단 지정 누락. 고르기 폼 안의 소제목도 `.side-h` 단 지정이 새어 열이 갈라짐 → `.filters > *` 전폭
- **지난 회차에 "Finished" 두 번** → 자리 칸은 비우고 행 전체를 보조색으로
- **연기 사우나 저녁 셋 다 만석** — 시드 값이 다 찼다. 예약 경로가 막혀 금 2 · 일 4 로 조정
- **라이트박스 열 때 닫기 단추 포커스 실패** — `startViewTransition` 콜백이 비동기라 대화상자가 열리기 전에 포커스를 줌 → 콜백 안에서
- **회차 안내 문장 마침표 누락**("…lake 3 of 22") → 방 문구 끝이 마침표가 아니면 붙임
- **390 에서 select 넘침** — 연기 사우나 회차가 열리며 가장 긴 옵션이 생김 → `width:100%` + `.f-field{min-width:0}`
- 요금표에 "£0 Dark towel" 같은 빈 항목 → 삭제
- 실존 지명(Cumbria) 사용 → Haugby 로

## 사진

검색 13회 199장을 밀착 시트로 직접 검수해 **24장** 사용(Pinterest 12 · Unsplash 12). 모두 쓰였다.

- Pinterest(`fetch-stock.mjs` 기본): 호숫가 사우나 · 난로 돌 · 부두 사다리 · 연기 사우나 · 증기방 5회 99장
- Unsplash(보조, 무료분): sauna · sauna stove · steam room · wood stack 4회 56장
- **AI 생성 배제가 가장 큰 일이었다.** Pinterest 의 사우나 실내 · 연기 사우나 · 난로 컷은 거의 전부 생성 이미지로 보였다 — 매끈한 나무결, 완벽한 촛불 · 노을 조명, 형태가 뭉개진 연기, 지나치게 정돈된 소품. `lake-sauna-01` 은 오른쪽 아래 생성 이미지 표지(✦)까지 있었다. 그래서 실내 · 난로는 Unsplash 실사로 채우고, Pinterest 에서는 필름 입자 · 렌즈 왜곡 · 고르지 않은 노출이 보이는 호수 · 부두 · 외관 컷만 남겼다. 남긴 후보는 한 번 더 크게(한 장 620 px) 띄워 확인
- **점/구슬 패턴 교체(검수 지적, 2026-10-07)** — 자잘한 무늬가 화면 대부분을 덮는 7장을 실사 다른 컷으로 바꿈: steam-mosaic(잔 모자이크 벤치) → marble-basins, steam-bench(육각 페니 타일) → glass-hand, stones-close(난로 돌 가득) → wood-bench, ladle-stones(돌 바구니) → birch-whisk, logs(통나무 단면 가득) → window-jetty, stove-dark(돌 철망 가득) → smoke-wall, woodshed(장작 단면 더미) → sauna-door. 대체 후보는 Unsplash hammam · steam bath · sauna interior · foggy bathroom 4회 44장에서 골라 크게 띄워 AI 여부를 다시 확인. heater-steam(김이 주인공, 돌은 화면 3분의 1 아래)은 남김
- **2차 교체(검수 지적)** — 물방울이 넓게 맺힌 glass-drops 와 유리 뒤 손이 섬뜩하게 읽히는 glass-hand → marble-room(큰 대리석 타일 함맘 전경) · pale-room(빈 연한 나무 휴게실). 둘 다 Unsplash 실사, 물방울 · 점 무늬 · 인체 없음
- 그 밖에 뺀 것: 얼굴이 보이는 컷(사람이 있는 실내 컷 대부분), 로고 · 글자(난로 각인, 네온 간판, 문 위 명판), 앱 UI 잔상(재생 · 화살표 단추), 워터마크
- `credits.json` 에 원 파일명 · 핀/사진 주소 · 명도 · 평균색. About 에 출처 목록. 안 쓴 175장은 작업 폴더에 두지 않음

## 남은 것 · 한계

- 날짜 · 시각 고정. 이후에 열어도 2026-10-07 16:20 기준
- 남은 자리는 이 브라우저(localStorage)에서만 줄고, 저장이 막힌 환경에서는 줄지 않는다(오류 없이 넘어감)
- 계획표는 시작 시각을 오늘 회차와 "07:00 any morning" 에서만 고른다. 다른 날은 주소의 `?start=` 로만
- 월평균 막대에 축 눈금이 없다(값을 막대 위에 적음)
- 라이트박스 뷰 전환은 Chrome 계열에서만. Safari · Firefox 에서 직접 열어보지 않았다
- Pinterest 사진은 라이선스 미확인. 요청이 오면 바꾼다

## 지난 창작과 무엇이 다른가

기획서 §4 표 참고. 요약 — 레이아웃: 풀블리드 사진 구간 + 비대칭(지난 14건과 §3 의 목록 · 표 · 해도 · 계기판 · 가로 줄과 다름) / 바탕: 고정 바탕 없이 사진에서 뽑은 면 다섯이 스크롤로 바뀜 / 이미지: 실사 사진이 주인공, 그림은 수온 막대 하나 / 서체: Gloock + Familjen Grotesk, 고정폭 없음 / 모션: 바탕 색 전환 · 라이트박스.

## 파일

```
studio/2026-W41-haugmere/
├─ index.html · rooms/(index · stove · smoke · steam) · sessions · book · plan · lake · prices · visit · rules · about   (생성물)
├─ data.mjs          내용 전부 (방 · 회차 · 요금 · 호수 · 규칙 · 면 색)
├─ build.mjs         data.mjs → 13 페이지 + assets/data.js + assets/fields.css
├─ assets/site.css · site.js (고르기 · 예약 · 계획표 · 입수 안내 · 라이트박스 · 메뉴 · 바탕 전환)
├─ assets/photos/    24장
├─ credits.json
└─ refs/             페이지 1440 × 13 · 390 × 6 · 768 × 1 · 상태 14
```
