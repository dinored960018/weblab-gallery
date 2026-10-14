# Harnscombe Ringing Centre — 영어 창작 (2026-W42, 수요일 2026-10-14)

가상의 잉글랜드 남서부 마을 Harnscombe 의 교회 종탑 변주 타종(change ringing) 센터 사이트. 종 8개 탑 하나와 시뮬레이터 방 하나 — 어떤 방식을 몇 개 종으로 칠 수 있는지, 타종에 걸리는 시간, 종마다 무게, 어느 저녁에 자리가 남는지.

- 기획서: research/2026-W42/build-concepts.md §4 (무인 모드 상시 승인)
- 포트 4413 · `node scripts/serve.mjs studio/2026-W42-harnscombe 4413` 또는 `index.html` 더블클릭(링크는 전부 `…/index.html` 상대 경로)
- 고정 시각: Wed 14 Oct 2026, 10:00 BST
- 화면 문구 전부 영어. 한국어 없음(`check-korean.mjs` 해당 없음)

## 기획 요지 — 지난 창작과 다른 점

| | 직전 Marrowby Record Office | Harnscombe Ringing Centre |
|---|---|---|
| 레이아웃 | 서류철 한 장 + 어긋난 위치의 탭 7개 + 타자기 양식 칸 | **번호 매긴 세로 열 여섯 개가 뼈대**. 화면을 가로지르는 괘선 6줄, 열 번호(종 1–6)가 곧 내비. 제목은 열 1–3, 보조 설명은 열 4–6 · 5–6, 표는 열 2–6. 800 px 아래 두 열 × 세 줄 |
| 바탕 | 마닐라 책상 `#D8BF86` 위 크림 폴더 | **적갈색 전면 `#6E1B22`** |
| 색 | 먹 + 도장 보라 하나 | 크림 글자 + **하늘색 `#9FC9E8` 하나**(선 · 링크 · 포커스) |
| 이미지 | 오른쪽 작은 도판 8장 | 작은 도판 8장(열 5–6) + **값에서 계산한 줄 격자 SVG** |
| 서체 | Bricolage Grotesque + Courier Prime | **Fraunces + DM Mono** |
| 모션 | 탭 전환 · 도장 찍기 | **파란 선 그리기 · 줄 재생** |
| 기능 | 반출 회차 · 책상 예약 · 복사 요금 | **place notation 변주 계산** · 타종 시간 · 종 무게 추정 · 탑 디렉터리 · 연습 신청 · 강좌 신청 |

기획서에 밝힌 겹침 그대로: 계산기 위주 구성은 Dishwell · Kerfmoor, 날짜 시드 잔여 + 대기 명단은 Marrowby · Wadstone, 선 그리기는 잣두루 · Holmscar, 어두운 전면은 암등 현상소 · 여늘시립천문대와 큰 방향이 같다.

## 페이지 (13)

| 경로 | 전달하는 것 |
|---|---|
| `/` | 오늘 연습 19:30 – 21:00 · 3 of 8 places free, 다음 강좌(5 Nov부터 목요일 6회 · 2 places left), 여섯 열 입구(번호 · 이름 · 수치 하나), 8일 일정, 이 탑 종 8개 표 |
| `/towers/` | 인근 탑 24곳 — 종 수 · 테너 무게 · 음 · 연습 요일 · 계단 · 층 · 거리 |
| `/towers/<slug>/` ×4 | harnscombe · tollacott · wyncott-cross · dunscarrow — 종 목록(음 · cwt–qr–lb · kg · 테너 대비 %), 연습 · 일요일 · 주차, 접근, 이 탑에서 치는 방식(Methods 링크), 쿼터 필 시간 계산 링크, 이전 · 다음 탑 |
| `/methods/` | 변주 시각화 |
| `/duration/` | 타종 시간 계산 + 흔한 길이 × 속도 표 |
| `/bells/` | 종 무게 추정 + 이 탑 종 8개의 지름 역산 표 |
| `/practice/` | 연습 신청 + 3주 잔여 표 |
| `/learn/` | 강좌 2개 · 6주 계획 · 신청 · 준비물 · 질문 5 |
| `/visit/` | 계단 · 소음 · 귀마개 · 나이 · 시간 · 교통 · 질문 4 |
| `/about/` | 가상 기관 고지 · 수치 근거 · 사진 출처 |

기획서 표는 "페이지 (12)" 라고 적었지만 표의 행을 세면 13(탑 상세 4 포함)이라 13으로 만들었다.

## 기능 (실제 동작)

- **변주 시각화** — 종 수 단추 4 · 5 · 6 · 8, 방식 단추 Plain Hunt · Plain Bob(둘 다 `aria-pressed`), 따라갈 종 선택. place notation(`x16x16x16x16x16x12` 등)을 규칙(적힌 자리는 그대로, 나머지는 짝끼리 바꿈)으로 풀어 플레인 코스 전체를 계산 — Minimus 24 · Doubles 40 · Minor 60 · Major 112 변주, Plain Hunt on n 은 2n. 리드마다 한 단의 SVG 격자, 선택한 종의 경로만 파란 선. −1 · Play/Pause · +1 로 한 줄씩, 현재 줄은 `aria-live` 문구("Row 2 of 12: 2 4 1 6 3 5 — bell 2 in 1st place"). 불가능한 조합은 이유 문구 — 8종에서 7번 종을 따라가다 6종으로 바꾸면 "A ring of 6 has no bell 7; following bell 2.", 주소의 `bells=7` · 없는 방식 · 범위 밖 `row` 도 같은 방식. `?bells=&method=&bell=&row=` 복원
- **타종 시간** — 종 수 · 변주 횟수(1–10 080 정수, 밖이면 "Error: enter a whole number between 1 and 10 080." + 직전 값으로 되돌림 + `aria-invalid`) · 변주당 초(1.00–5.00, 소수 둘째 자리) · open handstroke lead 토글. 총 시간(h min · h:mm) · 종 사이 간격(토글 시 2t ÷ (2n+1)) · 5 040 대비 % · 이 속도의 필 길이 · 막대(가운데 표시가 한 필). 길이 단추 4개, 흔한 길이 표의 시간마다 계산기로 가는 링크. 5 040 × 2.6 s = 3 h 38 min(기획서 예시와 일치). `?bells=&changes=&secs=&gap=` 복원
- **종 무게 추정** — 지름 30–200 cm, 두께 계열 3종(라디오). 무게 = k × d³(k 0.00047 · 0.00056 · 0.00066), cwt–qr–lb · kg · lb, 공칭 주파수 ≈ 75 850 ÷ d(계열 보정)와 가장 가까운 음. "Estimate only. Real bells vary with profile and tuning." 빈 입력은 안내 문구, 범위 밖은 Error 문구. 108.6 cm medium → 14 cwt 0 qr 13 lb · F(이 탑 테너와 맞춤). `?d=&p=` 복원
- **탑 디렉터리** — 이름 · 마을 검색, 종 수 단추(여럿, `aria-pressed`), 테너 하한 · 상한(역전이면 Error 문구 후 상한 무시), 연습 요일, 정렬 3종(가까운 순 · 마을 A–Z · 무거운 순), 결과 수 `aria-live`, 빈 결과 + Clear filters(검색칸으로 포커스), `?q=&bells=&min=&max=&day=&sort=` 복원
- **연습 신청** — 날짜(오늘부터 60일, 일 · 월 닫힘, 5 Nov 이후 목요일은 강좌 전용), 요일마다 세션 · 정원(Tue 4 · Wed 8 · Thu 6 · Fri 8 · Sat 10), 남은 자리는 날짜 문자열 해시(같은 날짜는 늘 같은 수, 오늘 3/8 · Sat 17 Oct Full 등). 0 이면 "Full. Join the waiting list." + 단추 문구 바뀜. 이름 · 이메일 필수, 오류는 칸 아래 `aria-describedby`, 첫 오류로 포커스. 확인서 `HRC-YYMMDD-NN`(NN = 자리 번호, 대기 명단은 정원 + 순번) — sessionStorage 에만, 새로고침해도 남고 취소 가능, 홈 · 표의 남은 자리 수에 반영. 3주 표의 Pick 단추가 날짜를 채움
- **강좌 신청** — 가을(2 places left) · 겨울(Full). 이름 · 이메일 · 나이(12 미만이면 이유 문구) 검증, 가을은 자리 확보(`HRC-261105-07`), 겨울은 대기 명단(`HRC-270114-09`, position 1). 남은 자리 표기가 바로 바뀜
- **All pages 시트**(모바일 메뉴 겸) — 모든 폭에서 머리의 단추로 엶. 열린 동안 배경 스크롤 막음, Esc · 바깥 클릭 · Close 로 닫고 단추로 포커스 복귀, Tab 순환
- FAQ `details`, 건너뛰기 링크, 포커스 링 3 px 하늘색(요소 밖 2 px — 크림 단추 위에서도 적갈색 바탕 대비로 보임), `href="#"` 없음, 서버 없음

## 토큰 (WCAG 상대 휘도 식으로 계산, 2026-10-14)

| 역할 | 값 | 대비 |
|---|---|---|
| 바탕 / 크림 글자 | `#6E1B22` / `#F2E9D8` | 9.45 |
| 보조 글자 | `#D9C9B0` | 7.02 |
| 하늘색(선 · 링크 · 포커스) | `#9FC9E8` | 6.51 |
| 오류 + 접두 "Error:" | `#FFC857` | 7.41 |
| 입력칸 `#5E161C` / 크림 · 보조 · 오류 | | 10.84 · 8.04 · 8.49 |
| 옅은 면(오늘 행 · hover) `#7B3034` / 크림 · 보조 · 하늘색 | | 7.53 · 5.59 · 5.18 |
| 격자 현재 줄 `#864043` / 크림 · 보조(줄 번호) | | 6.16 · 4.57 |
| 뒤집힌 열 번호 · 눌린 단추: 크림 면 / 적갈색 글자 | | 9.45 |
| 괘선 | 크림 24 % | 장식 |

그라데이션 · 그림자 · 둥근 모서리 없음. 하늘색은 면으로 칠하지 않음(선 · 글자 · 포커스만).

## 서체

- **Fraunces** 400 · 600 · 800(opsz 9–144) — 제목 · 열 번호 · 본문
- **DM Mono** 400 · 500 — 줄 격자 · 숫자 · 표 · 라벨 · 단추
- ♭ · ♯ 는 두 서체 모두 글리프가 없어 `unicode-range: U+266D-266F` 로 시스템 기호 서체(Segoe UI Symbol 등)만 끌어옴
- Google Fonts CSS 200(기획서 2026-10-14 확인)

## 모션 — 둘

1. **파란 선 그리기** — 변주 격자를 그릴 때마다(종 수 · 방식 · 따라갈 종을 바꿀 때) 리드마다 polyline 을 `pathLength=1` · `stroke-dashoffset 1 → 0`, 600 ms `cubic-bezier(0.22, 1, 0.36, 1)`
2. **줄 재생** — Play 를 누를 때만 320 ms 간격으로 현재 줄이 한 칸씩 내려가며 그 줄 배경이 바뀜(120 ms 선형), 가로 스크롤이 현재 리드를 따라감

`prefers-reduced-motion: reduce` → 선은 즉시 완성(transition 0s), Play 는 마지막 줄로 바로 이동(−1 · +1 로 한 줄씩은 그대로). 스크롤 등장 연출 없음.

## 사진

- 검색 7회(Pinterest 6 — church bells in belfry · bell ropes ringing chamber · stone spiral staircase church tower · old tower clock mechanism · english village church tower devon · belfry louvre window / Unsplash 1 — church bell) → 58장을 밀착 시트 3장(`refs/sheet-1.png` · `sheet-2.png` · `sheet-3.png`)으로 검수 → **8장 사용**(Pinterest 7 · Unsplash 1). 원본 전부는 `refs/photo-raw/`(+ 그곳 `credits.json`)
- **AI 생성 · 렌더 의심으로 뺀 것** — 시계 기구 clock-01~07(스팀펑크 렌더), clock-08(안개 낀 연출 조명), 나선 계단 stairs-01 · 02 · 07(과장된 대칭)
- 그 밖에 뺀 것 — 사람이 보이는 컷(ropes-04 · 06, bells-05 · 07 · 08), 글자가 읽히는 표지판 · 명판(ropes-03, ropes-06 의 DANGER, ropes-01 아래 명판), 워터마크 띠(stairs-08), 종탑이 아닌 피사체(louvre-01~06 주택 덧창, stairs-06 성관 계단, ubell-04 목조 교회), 실루엣 · 그래픽(bells-06, ubell-02 · 07 · 08)
- 쓴 8장: ropes(샐리) · frame(나무 틀 속 종) · bells · mouth(입 위로 세운 종) · belfry · stairs · tower · opening. 모두 열 5–6 의 작은 도판(최대 320 px, 4:5), 전폭 사진 없음
- 출처는 `credits.json`(핀 · 사진 주소, 라이선스, 명도, 원 파일명)과 About 표. Pinterest 7장은 라이선스 미확인 → 요청 시 교체. CC BY 없음
- 기획서는 "열 장 안팎"이었으나 기준을 통과한 컷이 8장이라 8장으로 둠

## 기획서에서 바꾼 것

- **페이지 수** — 위 "페이지" 절 참고(12 → 13, 표의 행 수대로)
- **"종 수와 방식 조합이 불가능하면 이유 문구"** — 4 · 5 · 6 · 8 × Plain Hunt · Plain Bob 은 모두 실제로 칠 수 있는 조합이라 불가능한 경우가 없다. 그래서 검증 대상을 "따라갈 종 번호가 그 종 수에 없는 경우"와 주소의 잘못된 `bells` · `method` · `row` 로 잡고 이유 문구를 띄움
- **모바일 메뉴** — 열 번호 여섯 칸은 모든 폭에서 한 줄로 남고(560 px 아래는 번호만 보이고 이름은 화면 낭독용), 탑 상세 · Practice · Visit · About 은 모든 폭의 **All pages 시트**로 엶
- **종별 무게** — 탑 상세의 테너 아래 종 무게는 기획서에 없던 값이라, 테너 무게를 음 높이 비율(주파수비^−1.6)로 줄여 계산하고 "estimates scaled by pitch" 로 밝힘
- **강좌 정원** — 홈 카피 "8 learners · 2 places left" 를 그대로 쓰려고 가을 강좌는 정원 8 · 신청 6, 비교용 겨울 강좌(정원 8 · 신청 8, Full)를 더함

## 검수 결과

```
node scripts/verify-site.mjs http://127.0.0.1:4413
  페이지 114개 검사(쿼리 · 해시 변형 포함, 1440 · 768 · 390)
  문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개

npx --yes impeccable@latest detect studio/2026-W42-harnscombe
  설정 · 억제 없음 → 출력 없음, exit 0

node refs/test.mjs — 헤드리스 클릭 테스트(playwright-core + 시스템 Chrome)
  65 / 65 통과, 콘솔 · 페이지 오류 0
  홈 4 · All pages 시트 6 · 탑 디렉터리 9 · 탑 상세 2 · 변주 11 · 시간 6 · 무게 4 · 연습 10 · 강좌 6 · 키보드 3 · 390 + 감속 4
```

Playwright MCP 로 홈 · Methods · Towers · Practice(오류 상태) · Learn 은 1440, 홈 · Duration 은 390 에서 직접 열어 봄(`refs/*.png`).

### impeccable 처리 내역 (처음 48건 → 0, 억제 없음)

- `cramped-padding` ×32(`<section> "band"`) — 띠의 윗여백을 `padding-block` 으로 줬는데 검사기가 논리 속성을 읽지 않아 0 으로 봄 → 전부 `padding-top` · `padding-bottom` 으로
- `cramped-padding` ×16(`<div>` · `<li>`) — 키–값 목록 · 줄 목록의 첫 줄에서 `border-top: 0` 을 테두리 제거로 읽지 않음 → `border-top: none`

### 작업 중 실제로 틀렸던 것

- **바닥글 칸 어긋남** — 바닥글을 subgrid 목록에 넣었는데 바닥글은 격자의 자식이 아니라 subgrid 가 무시됨 → 자체 6열 격자로
- **♭ 글리프** — DM Mono 에 없어 대체 서체가 들쭉날쭉하게 그려짐(`B♭`, `in E♭`) → unicode-range 로 기호 서체 지정
- **390 px "This week" 표** — 다섯 칸이 세로로 짓눌림 → 넓은 표 3개에 `min-width: 560px`, 가로 스크롤 상자 안에서 밀림
- **Plain Hunt 리드 수** — 처음엔 place notation 두 토큰을 한 리드로 세서 Plain Hunt on 6 이 리드 6개로 나옴 → Plain Hunt 는 코스 전체를 한 리드로
- 테스트 쪽 오류 1건(숫자 입력칸에 글자를 넣으려다 Playwright 가 거부) → 범위 밖 숫자로 바꿈
- 금지어 검사에서 "unlocked"(문이 열림)가 `unlock` 에 걸림 → "open from 19:15" 로

## 남은 것 · 한계

- 날짜 · 시각 고정. 남은 자리는 계산값이고 실제 예약 상태가 아님(이 탭의 내 신청만 반영)
- 종 무게 · 음 · 지름은 단순 비례식의 추정치. 실제 종은 단면 · 조율에 따라 다름
- 방식은 Plain Hunt · Plain Bob 두 가지, 플레인 코스만(Bob · Single 호출 없음)
- `<input type="date">` 는 브라우저 언어를 따름(페이지 문구 아님)
- 도판 번호는 빌드 순서대로 사이트 전체에서 이어짐
- Safari · Firefox 에서 직접 열어보지 않았다

## 파일

```
studio/2026-W42-harnscombe/
├─ index.html · towers/(+4) · methods · duration · bells · practice · learn · visit · about   (생성물)
├─ data.mjs        내용 전부(탑 24 · 상세 4 · 세션 · 강좌 2 · 방문 · FAQ · About)
├─ calc.mjs        날짜 · cwt · 종 음/무게 · place notation · 코스 · 시간 · 추정 · 잔여 해시 · 격자 SVG — 빌드와 브라우저가 같은 함수를 씀
├─ build.mjs       data + calc → 13 페이지 + assets/data.js · calc.js
├─ assets/site.css · site.js · data.js · calc.js
├─ assets/photos/  8장
├─ credits.json
└─ refs/           화면 캡처, 사진 밀착 시트 3, photo-raw/(원본 58 + credits), test.mjs
```
