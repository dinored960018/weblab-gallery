# Holmscar Harbour — 창작 (모작 아님)

가상의 작은 항만청 · 마리나. 영어 사이트. 2026-10-05 (W41 월요일, 영어 창작).
기획: [`research/2026-W41/build-concepts.md` §2](../../research/2026-W41/build-concepts.md) · 사용자 승인 "추천대로 바로"

## 한 줄

Tide times, berth availability and notices to mariners for a small working port — find a visitor berth by size and price it by length and nights.
해도(nautical chart) 문법으로 만든 항구 사이트. 주인공은 조석 곡선.

## 이름

- **Holmscar** — holm(작은 섬) + scar(바위 암초)
- 검색 2026-10-05: `"Holmscar"` → 같은 이름의 항구 · 마리나 · 항만청 없음(Hoscar 마을 · Holms 섬 지명뿐). `"Holmscar" harbour OR marina OR port` → 노르웨이 Holmsbu 손님 항구뿐
- 버린 후보: Skerrow(Skerries Harbour · Out Skerries 와 가까움) · Gullstone(Gull Harbour Marina 와 가까움)
- 강 River Rill · 바위 Holm Scar · 모래톱 Rill Sands 는 지어냄. 메일 `holmscar.example`(예약 도메인), 전화 01632 960 xxx · 07700 900 xxx(영국 방송 · 드라마용 번호대)
- 화면에 밝힘: 푸터 전 페이지 · 홈 · 조석 · 해도 · 요금 · About — "Practice site. Holmscar Harbour is fictional. Tides, berths, fees and notices are made up. Not for navigation."

## 소재 · 수치

| | 값 |
|---|---|
| 조석 | 다섯 항 조화 모형(M2 1.70 · S2 0.55 · M4 0.12 · K1 0.07 · O1 0.05 m, 평균 3.0 m). 사리 고조를 2026-10-12 06:10 UTC(10-11 신월 하루 뒤)에 맞춤 → 10-04 조금에서 10-12 사리로 커지는 현실 순서. 이번 주 고조 4.20–5.40 m, 저조 0.81–1.89 m (영국 남서부 소항 대역) |
| 시각 | BST(UTC+1, 2026-10-25 까지). 고정 시각 Mon 5 October 2026 10:40 → 2.83 m 상승 중 |
| 마리나 실(sill) | 해도 기준면 위 1.9 m, 용골 아래 여유 0.3 m 규칙 → 흘수별 통과 시간 계산 |
| 정박지 | 방문 37곳 — 방문 폰툰 V01–V14(밖, 2.4 m) · 마리나 C01–C10(안, 2.2 m) · 부두 벽 W1–W5(말림 1.4 m) · 계류 부표 M1–M8(2.8 m). 오늘 밤 빈 곳 22 |
| 요금 | 겨울/여름 m당 1박: 폰툰 £2.40/£3.10 · 마리나 £2.80/£3.60 · 벽 £1.50/£1.90 · 부표 1박 £16/£22. 0.5 m 올림, 최소 8 m, 7박째 무료, 쌍동선 ×1.5, 전기 £4.50 |
| 공지 | 14건(시행 7 · 예정 2 · 종료 5), 종류 6 |
| 바람 | 오늘 6시점(SW 4 → W 3, 돌풍 17–26 kn) |

- 실제와 맞춘 것: VHF 16(조난) · 12(항만) · 80(마리나), 국제 신호기 뜻(A 잠수 · B 위험물 · G 도선사 요청 · H 도선사 승선 · O 사람 추락 · P 출항 · Q 검역), 준설선 주간 형상(구 · 마름모 · 구), IALA A 부표(입항 방향 우현 초록 삼각 · 좌현 빨강 사각), 등질 표기(Fl(2) W 10s 18m 12M 등), 해도 수심 표기(소수 아래첨자 · 말림 높이 밑줄)

## 토큰 (실측)

| 역할 | 값 | 대비 |
|---|---|---|
| 해도 흰 바탕 / 남색 먹 | `#FBFCFC` / `#0E2233` | **15.77:1** |
| 보조 글자 | `#44596A` | 바탕 7.09 · 흰 7.28 · 10 m 색층 6.26 |
| 수심 색층 10 / 5 / 2 m | `#E3F0F6` / `#C7E0EE` / `#A8CDE3` | 먹 15.0 / 11.83 / 9.66 |
| 말림(간출) · 육지 · 시가지 | `#BFD0A0` · `#EFE2B8` · `#D9C68A` | 먹 9.84 · 12.54 · 9.57 |
| 물 이름 글자(SVG) | `#2B4F6E` | 2 m 색층 5.11 · 말림 5.21 · 5 m 6.26 |
| 정박지 — 사용 중 / 안 맞음 | `#9AA9B5` 위 먹 / `#EDF1F3` 위 보조 | 6.73 / 6.41 |
| 띠(ribbon) · 푸터 | 남색 위 `#DCE6EC` · `#C9D6DE` | 12.79 · 10.93 |
| 오류 | `#A3141F` | 흰 7.84 · 바탕 7.63 |
| 포커스 링 | `#1F5F8B` 3px | 바탕 6.66 |
| 신호기(깃발 안에서만) | 빨강 `#C8102E` · 노랑 `#F4C20D` · 파랑 `#0B3D91` | 글자 · 배경 · 버튼에 안 씀 |

**실측 방법:** 10페이지 × 1440 / 390 + 상태 12개(정박지 선택, 정박지 크기 오류, 정박지 0건, 예약 오류 요약, 부표 길이 경고, 예약 완료, 공지 필터, 공지 빈 결과, 공지 전부 펼침, 흘수 오류, 곡선 포인터, 모바일 메뉴)의 보이는 HTML 텍스트 노드 **5,146개** 전부 글자색과 실제 뒤 배경(반투명 합성)으로 계산 → **최저 6.26:1(요일 칸의 "Range 2.4 m", 10 m 색층 위 보조 글자), 4.5 미만 0.**
SVG 안 글자(해도 · 평면도 · 곡선)는 위 표의 색 쌍으로 따로 계산 → **최저 5.11:1(2 m 색층 위 물 이름).** 전체 최저 5.11.

### 서체

- **Spectral** 400/500/600 + 이탤릭 — 제목 · 큰 수치(2.83 m, VHF 채널) · 수심 숫자 · 물 이름. 해도의 기울인 수로 글자 자리
- **Libre Franklin** 가변 400–700 — 본문 · 라벨 · 표 · 곡선 축, `tabular-nums`
- Google Fonts CSS 200. impeccable `overused-font` 통과. 지난 12건 서체와 겹치지 않음. 처음 Red Hat Text 로 잡았다가 같은 날 §1 천문대의 Red Hat Mono 와 같은 집안이라 바꿨다

## 레이아웃 — 해도 한 장

- 페이지 양옆에 해도 테두리의 흑백 눈금 막대(경위도 눈금), 그림(조석 곡선 · 해도 · 평면도 · 요금 상자)은 눈금 막대를 낀 이중 테두리(neat line) 안. 640 px 아래에서는 양옆 막대를 뺀다
- 카드 · 그림자 · 둥근 모서리 0. 구분은 1 px 괘선
- 표는 요금 한 곳. 나머지는 곡선 · 지도 · 해도 · 줄 목록(CORRIDOR 운행표와 겹치지 않게)
- 꼭대기 남색 띠에 고정 시각의 조위 · 고조 · 저조 · 실 위 수심 · 바람을 전 페이지에 둔다

## 그림 — 어떻게 그렸나 (`chart.mjs`, 사진 아님)

- **수심 색층 · 등심선:** 해안선 경로를 폭 2r 로 굵게 그은 선(stroke)이 곧 "해안에서 r 안의 바다"다. 10 → 5 → 2 → 0 m 순으로 (등심선 색 2r+1.6) → (색층 2r) 를 겹쳐 그려 색층 경계에 가는 등심선이 남는다. 바위섬은 경사가 급하도록 1/1.35 배
- **수심 숫자:** 엇갈린 격자 + 시드 난수 흔들림, 같은 거리 → 수심 함수에 ±0.4 m. 그래서 숫자와 색층이 서로 맞는다. 장미 · 제목 메모 · 부표 · 도입선 근처는 비움
- **도입선 312°:** 방향 벡터로 페어웨이 부표 · 준설 수로(2.0 m) · 앞뒤 도입등 · 부표 3–6 위치를 모두 계산
- **나침반 장미:** 5° 눈금, 30° 마다 숫자, 편차 VAR 1°10′W 2026
- **항구 평면도:** 안쪽 내항 + 실(점선) + 바깥 항 + 부두 벽 말림 띠 + 해변. 정박지는 `<g role="button" tabindex="0">`
- **신호기 7 · 주간 형상:** ICS 규격 비율(30 × 20, 제비꼬리 A · B, G 노랑부터 6줄, O 대각 빨강 위 · 노랑 아래, P 가운데 1/3 흰 사각)

## 페이지 (10)

| 페이지 | 한 줄 |
|---|---|
| `/` Home | 고정 시각 조위 2.83 m · 오늘 곡선 · 실 통과 시간 · 바람 6시점 · 오늘 밤 빈 정박지 22/37 · VHF · 시행 공지 4 · 입항 4단계 + 사진 |
| `/tides/` | 요일 7칸 미니 곡선(조금 → 사리 범위 2.4 → 4.6 m) · 큰 곡선 · 흘수 입력 → 실 통과 시간 · 그날 고조 · 저조 · 높이 읽는 법 |
| `/berths/` | 크기 입력 → 평면도 · 목록 동시 걸러짐 · 고른 정박지 상세(가격 · 예약 링크) · 구역 설명 + 사진 |
| `/book/` | 정박 종류 4 · 정박지 번호 · 배 · 체류 · 선장 · 요금 상자(줄마다 합이 맞게) · 검증 · 전송 안 함 |
| `/notices/` | 종류 6 · 상태 3 · 검색, 공지 14 펼침(신호기 뜻 · 발행일) |
| `/approach/` | 해도 1000 × 700 · 등화 5 · 항법 4단계 · 위험 4 + 사진 |
| `/facilities/` | 시설 8 × 위치 · 시간 · 수치 + 사진 2 |
| `/fees/` | 요금표 · 계산 규칙 · 계산 예(9.6 m, 3박 = £72.00) · 기타 요금 11 |
| `/contact/` | VHF 채널판 4 · 전화 · 사무소 · 해외 입항(Q기) · 신호기 7 |
| `/about/` | 신탁 항만 · 수치 6 · 연표 6 · 사진 2 · 사진 출처 |

`node build.mjs` 가 `data.mjs` + `chart.mjs` + `assets/tide.js` 로 10장 + `assets/data.js` 를 만든다. 손으로 쓴 HTML 없음. 링크는 전부 상대경로 + `index.html`(file:// 로도 이어짐).

## 모션 — 하나

| 무엇 | 어떻게 |
|---|---|
| 조석 곡선이 처음 그려질 때 선이 왼쪽에서 오른쪽으로 그어진다 | `stroke-dashoffset` 길이 → 0, 1.1 s `cubic-bezier(.22,.61,.36,1)`(ease-out). 요일을 바꿔 다시 그릴 때는 즉시 |

- 그 밖: 버튼 · 칩 색 바뀜만. 스크롤 등장 · 페이지 전환 연출 없음
- `prefers-reduced-motion: reduce`: dasharray 를 걸지 않고 transition 0s — **실측 확인**(아래 표)

## 기능 — Playwright(npx 캐시 playwright-core + 시스템 Chrome, 헤드리스 하나씩)로 눌러서 확인 · **65/65 통과, 콘솔 에러 0**

| 기능 | 결과 |
|---|---|
| 조석 곡선 | 홈 렌더 · 읽기값 "10:40 2.83 m, rising · 0.93 m over the sill" · 고조 · 저조 점 4 · `role=slider` → → 650분, PageUp 710분, `aria-valuetext` 갱신 · 포인터 60 % 지점 "14:05 4.20 m" · 그리기 transition 1.1s |
| 요일 · 흘수 | Thu 8 → `aria-pressed` 이동, `?day=2026-10-08`, 목록 HW 04:34, 현재선 사라짐 · 흘수 2.2 → "03:09–05:57, 15:45–18:11. Needs 4.4 m of tide", `?draught=2.2` · 5 → 오류 + `aria-invalid` · `?day=2026-10-10&draught=1.2` 진입 → 복원, 캡션 "Saturday 10 October" |
| 정박지 고르기 | 길이 13 → "5 of 22", 목록 5줄, 지도 맞음 5 · 안 맞음 17 · 흘수 2.3 → 3(부표만) · 착저 가능 → 6(벽 추가) · 지도 M5 클릭 → 상세 + `aria-pressed`, 주소 `?loa=13&draught=2.3&ground=1&berth=M5`, 예약 링크 `type=mooring` · 새로고침 복원 · Clear · 키보드 Enter 로 V07 · 길이 30 → 오류 |
| 예약 · 요금 | 빈 제출 → "8 things to fix" 요약(포커스) + `aria-invalid` · 요약 링크 → 칸 포커스 · 9.6 m 2박 £48.00 · 고치면 오류 사라짐 · 7박 £144.00 + "Every 7th night free" · 쌍동선 £216.00 · 스테퍼 + · 전기 줄 · 부표 → 전기 비활성 · 2027-03-30 부표 3박 → 겨울 2 + 여름 1 = £54.00 · 부표 14 m → 길이 오류 · `?berth=V07&loa=13` → "V07 takes boats up to 12 m." · 메일 `ada@` → "1 thing to fix" · 정상 → "Request not sent… Nothing was stored, sent or charged. … V07, 2 nights from Mon 5 Oct, £55.20."(포커스) · 흘수 2.3 폰툰 → "Up to 2.1 m" |
| 공지 필터 | Diving → 2, + In force → 1, 다른 칩 개수 갱신(Ended 1), 주소 `?type=diving&status=in-force` · "zzzz" → 빈 상태 → 빈 상태 안 Clear → 14 · `?q=22/2026` → 1건 펼침 · `?type=lights` → 3 · 요약 눌러 펼침 |
| 모바일 메뉴(390) | 열림 `aria-expanded=true`, 첫 링크 포커스, html overflow hidden, 휠 900px 에도 scrollY 0 · ESC 닫힘 + 버튼 포커스 · 링크 이동 · 모바일 곡선 렌더 |
| reduced-motion | dasharray 없음, transition 0s |
| file:// | 홈 → Tides(곡선 렌더, 요일 바꿈) → Berths → Notices → Approach → Facilities → Fees → Contact → About → Book a berth. Spectral · Libre Franklin 로드 확인 |

## 게이트

```
node scripts/verify-site.mjs http://localhost:4434/
  페이지 37개 검사 (쿼리 · 해시 변형 포함)
  문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개

npx --yes impeccable@latest detect index.html */index.html assets/site.css  (html 10 + css 1, 설정 · 억제 없음)
  출력 없음, exit 0 (권고 advisory 포함 0)
```

한국어는 화면에 없다. `check-korean.mjs` 해당 없음.

## impeccable 처리 내역

처음 28건 → 10건 → 0. 억제 없이 구조 · 값으로 고쳤다.

- `cramped-padding` ×22 — 공지 줄의 위 괘선을 `li` 에서 `summary`(안쪽 여백 16px)로 옮김 · 홈 3단의 세로 괘선 대신 간격 · VHF 채널판 세로 괘선 제거 · 해도 · 평면도 테두리 안 여백 0 → 8px
- `flat-type-hierarchy` ×2 — 작은 대문자 라벨(13px)을 h2 로 쓰고 h1 을 `clamp()` 로 줘서 검사기가 h1 16px 로 읽음 → 라벨을 Spectral 21px 소제목으로, h1 은 px + 미디어 쿼리 단계
- `all-caps-body` · `kicker-above-heading` ×9 — 제목 위 대문자 키커(메뉴 이름 되풀이) 삭제
- `skipped-heading` — 조석 옆 칸 h3 → h2
- `aphoristic-cadence` — "No wash." 류 짧은 부정문 4곳을 한 문장으로 ("…, and no wash at any speed.")

## 작업 중 실제로 틀렸던 것

- **나침반 장미가 수로를 덮음.** 처음 장미를 (840, 470)에 둬서 준설 수로 · 부표 5 · 6 위에 겹침 → 왼쪽 아래 빈 바다(560, 590)로, "Holmscar Roads" 글자는 수로 오른쪽 위로
- **도입등이 방파제 뿌리에 걸림.** 앞등을 입구에서 150 떨어진 곳에 둬 서쪽 방파제 선과 겹침 → 112 · 176 으로 당기고 등질 글자를 뒤등 옆으로
- **수심 숫자가 부표 · 페어웨이 글자와 겹침** → 부표 주변 62, 페어웨이 글자 주변 70 비움
- **평면도 "Sill 1.9 m" 글자가 방문 폰툰과 겹침** → 실 아래 한 줄로
- **요금 상자의 줄 합이 총액과 안 맞음.** "6박 £165.60 − 7박째 £27.60 + 전기 £27" 로 보여 계산이 안 맞아 보임 → 첫 줄을 7박 전체로, 무료 1박을 빼는 줄, 전기는 7박 모두(£193.20 − £27.60 + £31.50 = £197.10), 규칙 문구에 "shore power still charged"
- **체크박스 문구 사이 빈칸.** `label` 이 flex 라 링크 앞뒤 글자가 따로 떨어짐 → 글자를 `span` 하나로
- **모바일 평면도 정박지가 22px.** → 760px 아래에서 평면도만 가로 스크롤(최소 720px)
- 사진 11장을 넣었다가 실제로 쓰는 7장만 남김(출처 목록에 안 쓴 사진이 있었음)
- 서체: 같은 날 §1 과 집안이 겹쳐 Red Hat Text → Libre Franklin

## 사진

Pinterest(`fetch-stock.mjs`) 3회 검색(작은 어항 부두 · 계류줄 비트 · 방파제 등대) 58장 중 **7장**.
제외: 얼굴 · 사람이 보이는 컷, 선명 · 등록번호 글자(노란 어선 등), 국기(미국 국기 등대), 유명 다리가 찍힌 컷, Dreamstime 워터마크(계류줄 4장), AI 생성으로 보이는 컷(색칠한 듯한 항구 마을 여러 장), HDR 과보정.
보조로만 씀(홈 1 · 정박지 1 · 해도 1 · 시설 2 · About 2). `credits.json` 에 핀 주소 · 명도 · 원 파일명. About 에 출처 목록. 나머지 51장은 작업 폴더에 두지 않음.

## 남은 것 · 한계

- 조석은 다섯 항 모형의 연습값. 실제 항구 예보가 아니다(화면에 명시). 기상 영향은 문장으로만
- 날짜 · 시각 고정. 이후에 열어도 2026-10-05 10:40 기준
- 예약 · 결제 · 메일 전송 없음(화면에 명시). 정박지 빈자리는 고정 데이터라 예약해도 줄지 않는다
- 평면도의 정박지 칸 크기는 최대 길이에 비례하지 않는다(같은 폭)
- 해도 위 요소(등화 · 부표)는 눌러도 반응하지 않는다. 등화표는 옆 목록으로
- 390 에서 해도 · 평면도는 그림 안 가로 스크롤. 860px 아래에서 요일 7칸도 가로 스크롤(768 에서 토 · 일이 밖으로 나가 있고 스크롤 표시가 약하다)
- Safari · Firefox 에서 직접 열어보지 않았다

## 지난 창작과 무엇이 다른가

| | Quoin & Slug | 물레내장 | Wadstone | **Holmscar** |
|---|---|---|---|---|
| 레이아웃 | 견본 한 줄 전폭 + 가이드 선 | 카드 없는 좌판 줄 | 전폭 색 면 분할 + 타일 벽 | **해도 한 장 — 눈금 테두리 · 이중 테두리 그림** |
| 바탕 | 순백 | 갱지 | 회백 + 흙 · 유약 면 | **해도 흰색 + 수심 색층(그림 안)** |
| 색 | 마젠타 선 하나 | 가격표 노랑 · 천막 빨강 | 흙 1 + 유약 3 | **남색 먹 하나 + 신호기 3원색은 깃발 안에만** |
| 이미지 | 글자 | 배치도 + 사진 | 유약 타일 + 그릇 | **해도 · 평면도 · 신호기 · 조석 곡선 + 사진 7** |
| 서체 | 가변 견본 여섯 | 손글씨 + 고딕 | Young Serif + Hanken | **Spectral 이탤릭 수심 숫자 + Libre Franklin** |
| 모양 | 모서리 0 | — | 알약형 | **모서리 0, 괘선만** |
| 모션 | 포인터로 축 | 지도 칠하기 | 물레 회전 | **곡선 그리기 하나** |
| 특이 기능 | 가변 축 테스터 | 장날 계산 | 유약 필터 · 가마 달력 | **포인터 조위 읽기 · 흘수별 실 통과 · 평면도 정박지 · 계절 요금** |

잣두루(등고선 지형도 뼈대)와 등심선이 닮는다 → 해도는 Approach 한 페이지에만, 화면 뼈대는 조석 곡선과 눈금 테두리로 잡았다.

## 파일

```
data.mjs          항구 · 고정 시각 · 바람 · 구역 · 정박지 37 · 요금 · 공지 14 · 신호기 · VHF · 시설 · 연표 · 등화
chart.mjs         접근 해도 · 나침반 장미 · 항구 평면도 · 신호기 7 · 주간 형상 · 바람 화살표 · 미니 곡선
build.mjs         10페이지 + assets/data.js 생성
credits.json      사진 7장 출처
assets/tide.js    조석 모형(페이지와 빌드가 같이 씀) — 높이 · 고조/저조 · 실 통과 시간
assets/site.js    메뉴 · 곡선(포인터 · 키보드) · 요일/흘수 · 정박지 고르기 · 요금 · 폼 검증 · 공지 필터
assets/site.css
assets/scale-v.svg · scale-h.svg   해도 테두리 눈금
assets/data.js    (생성물)
assets/photos/    사진 7
refs/             home-1440(+full) · home-tide-pointer-1440 · home-768-full · home-390-full · menu-390
                  tides-1440-full · tides-sat-draught-1440 · tides-768 · tides-390-full
                  berths-1440-full · berths-fit-selected-1440 · berths-390-full
                  book-1440-full · book-quote-1440 · book-errors-1440 · book-done-1440 · book-390-full
                  notices-1440-full · notices-filter-1440 · notices-empty-1440 · notices-390-full
                  approach-1440-full · approach-chart-1440 · approach-390-full
                  facilities-1440-full · fees-1440-full · contact-1440-full · contact-390-full · about-1440-full
```
