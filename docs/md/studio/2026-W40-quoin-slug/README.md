# Quoin & Slug — 창작 (모작 아님)

가상의 활자 주조소(type foundry). 영어 사이트. 2026-10-01.
기획: [`research/2026-W40/build-concepts.md` §9](../../research/2026-W40/build-concepts.md) · 사용자 승인 "추천대로 바로 만들기"

## 한 줄

Six variable families you can set live — weight, width and optical size — with license prices by use.
초대형 글자 견본이 주인공. 모든 견본 첫 줄에 조판 가이드 선(어센트 · 캡하이트 · x하이트 · 베이스라인 · 디센트)을 그리고, 축을 움직이면 선이 따라간다. 흑백 + 마젠타 하나, 사진 0장.

## 이름

- **Quoin & Slug** — quoin(조판을 판틀에 잠그는 쐐기) + slug(행간 공목 · 주조된 한 줄)
- 검색 2026-10-01: `"Quoin Type" foundry` · `"Quoin & Slug" OR "Quoin and Slug"` · `Quoin font` → 같은 이름의 foundry·서체 없음(PyPI 도구 `quoin` 만). 후보였던 "Nick & Shank" 는 역사적 주조소 P.M. Shanks / Stevens, Shanks & Sons 와 가까워 버림
- 도시 Rotterdam(실제 도시, 주소 없음), 메일은 예약 도메인 `quoinslug.example`

## 서체 — 사칭하지 않는다

전시하는 여섯 벌은 **실제 이름 · 실제 디자이너 그대로**. 가상 패밀리명을 붙이지 않았다. 파일은 Google Fonts CDN 원본 그대로(수정 없음).
화면에 세 곳 이상 밝힘: 푸터(전 페이지) "Practice site. Quoin & Slug is fictional… SIL Open Font License 1.1… License prices are fictional; nothing is sold and payment is not connected." · 상세 페이지 Credits 표("Prices here: Fictional. The family is free under the OFL.") · 라이선스 FAQ "Why are these fonts free elsewhere?" · About · 장바구니.

| 패밀리 | 디자이너 | 테스터 축 | 파일 속 다른 축 |
|---|---|---|---|
| Roboto Flex | Font Bureau, David Berlow, Santiago Orozco, Irene Vlachou, Ilya Ruderman, Yury Ostromentsky, Mikhail Strukov | wght 100–1000 · wdth 25–151 · opsz 8–144 | GRAD · slnt · XOPQ · XTRA · YOPQ · YTAS · YTDE · YTFI · YTLC · YTUC |
| Bricolage Grotesque | Mathieu Triay | wght 200–800 · wdth 75–100 · opsz 12–96 | — |
| Anybody | Tyler Finck | wght 100–900 · wdth 50–150 | — |
| Science Gothic | Thomas Phinney, Vassil Kateliev, Brandon Buerkle | wght 100–900 · wdth 50–200 | CTRS · slnt |
| Literata | TypeTogether | wght 200–900 · opsz 7–72 | — |
| Bodoni Moda | Owen Earl | wght 400–900 · opsz 6–96 | — |

- 확인 방법: `fonts.google.com/metadata/fonts` 200(디자이너 · 축 범위 · 등록일) · `github.com/google/fonts/ofl/<이름>/OFL.txt` 여섯 개 모두 200 · Google Fonts CSS2 가변 범위 요청 200
- 상세 페이지 설명 3줄은 google/fonts 레포의 `DESCRIPTION.en_us.html` / `article/ARTICLE.en_us.html` 에 적힌 사실만 옮김(예: Science Gothic 은 Bank Gothic 기반, Bricolage 는 Mayenne Sans 포크). 문서에 없는 디자인 평가는 쓰지 않음
- **Fraunces 는 뺐다** — 시험 페이지에서 impeccable `overused-font` 에 걸림. 위 여섯은 시험 페이지 detect 0
- 사이트 UI 글자는 Roboto Flex 한 벌(본문 wdth 100, 제목 wdth 30–60 으로 좁힘). 지난 창작 서체(Barlow · Schibsted · Plex Mono · Spline Mono · Hahmlet · SUIT · Archivo · Old Standard TT · Newsreader · Spoqa · Martian Mono)와 안 겹침

## 소재 · 요금 (가상)

라이선스 가격 = 패밀리 기본가 × 사용량 배수. 유로, VAT 별도. 독립 주조소 대역.

| | 값 |
|---|---|
| 기본가 | Roboto Flex €280 · Literata €240 · Science Gothic €210 · Bricolage €190 · Anybody €170 · Bodoni Moda €160 |
| Desktop (사용자 수) | 1–3 ×1 · 4–10 ×2 · 11–25 ×3.5 · 26–50 ×5 · 51–100 ×8 |
| Web (월 페이지뷰) | 1만 ×0.6 · 10만 ×1 · 50만 ×2 · 100만 ×3 · 500만 ×6 |
| App (앱 수) | 1 ×2.5 · 2–3 ×5 · 4–5 ×7.5 |
| 묶음 | 여섯 벌 합(€1,250) × 0.6 = 배수 1 당 €750 |
| 최저가 | Web 1만 Bodoni Moda €96 · 최고 Roboto Flex App 4–5 €2,100 / 묶음 App 4–5 €5,625 |

## 토큰 (실측)

| 역할 | 값 | 대비 |
|---|---|---|
| 바탕 / 글자 | `#FFFFFF` / `#0B0B0B` | **19.68:1** |
| 보조 글자 | `#5E5E5E` | **6.48:1** (`#F2F2F2` 호버 면 위 5.79) |
| 마젠타 — 가이드 선 · 선 라벨 · 슬라이더 · 현재 메뉴 밑줄 · 오류 글자 · 포커스 링 | `#C8005F` | **5.80:1** |
| 다크 테스터 바탕 / 글자 | `#0B0B0B` / `#F2F2F2` | **17.58:1** |
| 다크 테스터 마젠타 | `#FF5CA3` | **6.85:1** |
| 괘선 · 호버 면 | `#D4D4D4` · `#F2F2F2` | 글자에 안 씀 |

**실측 방법:** 12페이지 × 1440/390 + 상태 6개(테스터 다크, 장바구니 서랍, 글리프 확대, 주문 폼 오류, 모바일 메뉴, 계산기 안내)의 보이는 텍스트 노드 **6,460개** 전부 글자색과 실제 뒤 배경색으로 계산(모달이 열리면 모달 안만). **최저 5.80:1(마젠타 선 라벨), 4.5 미만 0.**

- 색은 마젠타 하나. **면으로 쓰지 않고 선 · 글자로만.** 버튼 눌림은 먹 면 + 흰 글자
- 모서리 0, 그림자 0, 그라데이션 0, 이미지 0

## 조판 — 가이드 선

- 모든 견본(`[data-guides]`)의 첫 줄에 선 5개. 실선: 캡하이트 · x하이트 · 베이스라인(2px). 점선: 어센트 · 디센트. 왼쪽 여백 칸(84px / 390 에서 44px)에 `cap .71` 식 라벨(em 단위)
- **어떻게 재나:** 같은 글꼴 설정의 보이지 않는 거울 줄에 탐침을 넣는다. 캡하이트는 `height: 1cap`, x하이트는 `height: 1ex` 인 inline-block 의 윗변. Chrome 은 이 단위에 가변 축 값을 반영한다(실측: Literata 캡하이트 opsz 7 → 0.700em, opsz 72 → 0.730em). 그래서 축 슬라이더를 움직이면 선이 따라 움직인다
- 어센트 · 디센트는 `text-top` / `text-bottom` 탐침. 이 탐침은 줄 상자를 글꼴 전체 높이로 넓히므로 **행간 normal 인 별도 거울**에서 베이스라인과의 거리만 재서 옮긴다
- 선이 칸 밖(위 · 아래 글)으로 나가면 칸 여백을 자동으로 늘린다(위는 라벨 높이까지 22px). 라벨끼리 15px 안으로 붙으면 base → cap → x → asc → desc 순으로 뒤의 것을 숨기고 선만 남긴다. 64px 미만 견본은 라벨 전부 숨김
- **정확도 실측:** 7페이지 22개 견본에서 실제 베이스라인(글자 안에 넣은 탐침)과 그린 베이스라인 선의 차이 **최대 0.00px**
- 한 줄 견본은 JS 로 칸 폭에 맞춘다(`[data-fit]`, Range 로 글자 폭 측정). 홈 히어로는 포인터로 폭이 바뀔 때마다 다시 맞춘다

## 페이지 (12)

| 페이지 | 한 줄 |
|---|---|
| `/` Home | 히어로 "Quoin"(Anybody, 포인터로 축 조절) · 여섯 벌 초대형 견본 + 축 범위 + 시작가 · 테스터(패밀리 선택) · 라이선스 3종 요약 |
| `/families/` | 여섯 벌을 같은 문장으로 나란히. 문장 · 크기 직접 입력, 축(Width · Optical size) · 갈래로 거르고 네 가지로 정렬 |
| `/families/<slug>/` ×6 | 테스터 · 축 표 · 수직 메트릭(실측 em) · 굵기 목록(+폭 목록) · 문단 18/13px · 글리프 표 · 라이선스 계산기 · 크레딧 · 앞뒤 패밀리 |
| `/licensing/` | 계산기(묶음 포함) · 라이선스 3종 × 여섯 벌 + 묶음 가격표 · 질문 5 |
| `/cart/` | 담은 라이선스 · 합계 · 주문 폼(검증만, 결제 연결 없음) |
| `/about/` | 가상 주조소라는 사실 · 이름 뜻 · 서체 출처 표 · 가이드 선 읽는 법(Literata 견본 + 정의 5) |
| `/404.html` | "Not found" 를 폭 슬라이더로 직접 조절 |

`node build.mjs` 가 `data.mjs` 에서 12장 + `assets/data.js` 를 만든다. 손으로 쓴 HTML 없음. 링크는 전부 상대경로 + `index.html`. 페이지마다 필요한 서체만 불러온다(상세 = UI + 그 패밀리).

## 모션 — 둘만

| | 무엇 | 어떻게 |
|---|---|---|
| 1 | 홈 히어로: 포인터 가로 → 폭(50–150), 세로 → 굵기(100–900). 로드 때 한 번 굵기를 훑음 | `pointermove` → rAF 로 `font-variation-settings` 갱신 + 크기 재맞춤 + 선 재계산. 스윕 1.6초(100→900 은 0.6 구간 ease-in-out, 900→700 복귀). 터치는 `touch-action: pan-y` 로 가로 드래그만 받음 |
| 2 | 테스터 프리셋 · 굵기 목록 Set: 축이 240ms 에 걸쳐 이동, 가이드 선이 따라감 | `transition: font-variation-settings 240ms cubic-bezier(.22,.61,.36,1)` + 300ms 동안 매 프레임 선 재계산 |

- `prefers-reduced-motion: reduce`: 스윕 없음, 포인터 반응 없음(히어로 wght 700 고정), 프리셋 즉시 적용(`animating` 클래스 안 붙음, `transition-duration 0s`). **실측으로 확인**(아래 표)
- 스크롤 등장 연출 · 페이지 전환 연출 없음. 서랍 · 대화상자도 애니메이션 없음

## 기능 — Playwright(npx 캐시 playwright-core + 시스템 Chrome, 공유 MCP 브라우저 안 씀)로 눌러서 확인 · **71/71 통과, 콘솔 에러 0** (두 번 연속)

| 기능 | 결과 |
|---|---|
| 타입 테스터 | 직접 입력("Kerning 1234") · 굵기 850 / 폭 40 / 크기 140 / 행간 1.5 → `font-variation-settings` 반영 · Match size 켜면 opsz = 크기(140), 끄면 수동 20 · 정렬 Center(`aria-pressed`) · Dark 바탕 `rgb(11,11,11)` · Guides 끔/켬 · Reset → 샘플 문장 + 400 |
| URL 공유 | Copy link → 클립보드 `?f=roboto-flex&t=Kerning+1234&w=850&x=40&o=20&s=140&l=1.5&a=center&m=dark#tester` · 그 주소로 새로 열면 문장 · 굵기 · 다크 · 정렬 복원 · 조작 전에는 주소에 아무것도 안 붙음, 조작 후 주소창 갱신 · 클립보드가 막히면 읽기 전용 칸에 주소를 띄우고 선택 |
| 패밀리 전환(홈) | Science Gothic → 글꼴 교체, opsz 조절 숨김, 직접 쓴 문장 유지 |
| 가이드 선 | 크기 바꾸면 캡 선 이동 · Literata 캡하이트 opsz 7/72 = 0.700/0.730 · 메트릭 표 0.701 채움 · 22개 견본 베이스라인 오차 0.00px |
| 굵기 목록 | 700 Bold 의 Set → 테스터 wght 700 |
| 글리프 표 | 없는 글자 자동 제외(대체 글꼴 둘로 폭 비교): Literata "199 of 201" · Tab 으로 Q 에 가서 Enter → 확대 대화상자(U+0051, 테스터 굵기 700 그대로) · → 키로 R · Previous 두 번 P · 스크롤 잠금 · ESC 닫힘 + Q 로 포커스 복귀 · 바깥 클릭 닫힘 |
| 라이선스 계산기 | 아무것도 안 고르고 Add → "Choose at least one license type…" · Literata 4–10 users + 50만 + 1 app = 240×(2+2+2.5) = **€1,560** · Add → 서랍 열림, 개수 1 · 같은 패밀리 다시 담으면 줄 교체(€960) · 라이선스 페이지 묶음 = €750, +웹 500만 = €5,250, 옵션 라벨이 묶음 가격으로 바뀜 |
| 장바구니 서랍 | `<dialog>` · ESC 닫힘 + 스크롤 잠금 해제 · Close 버튼 → Add license 버튼으로 포커스 복귀 · 페이지 사이 유지(localStorage, 막히면 메모리) |
| 장바구니 페이지 · 주문 | 2줄 합계 €6,210 · 빈 제출 → 오류 5개 요약(포커스 이동) · 요약 링크 → 해당 칸 포커스 · `ada@` → 오류 1개 `aria-invalid` · 정상 → "Order not placed. Payment is not connected… nothing was charged and nothing was stored." · Remove → 다음 Remove 로 포커스 · 비면 빈 상태 + 개수 0 |
| 목록 필터 · 정렬 | Width 축 4 → +Optical size 2(Roboto Flex, Bricolage), 주소 `?axis=wdth,opsz` → +Serif 0 → 빈 상태 → Clear 6 · 가격순 Bodoni 먼저 · 폭 범위순 Science Gothic 먼저 · 문장 입력이 여섯 줄 모두에 · 크기 120px · 주소 `?genre=serif&sort=price` 로 진입 → Bodoni, Literata |
| 모바일 메뉴(390) | 열림 `aria-expanded=true`, 첫 링크 포커스, `html.lock`, 휠 900px 에도 scrollY 0 · ESC 닫힘 + 버튼 포커스 · 링크 이동 |
| 404 | 폭 슬라이더 → wdth 140 · 390/768/1440 가로 넘침 0 |
| reduced-motion | 히어로 1초 뒤에도 wght 700, 포인터 반응 없음, 프리셋 즉시 적용, transition 0s |
| 모션 켬 | 스윕 중간 값(예: wght 899) → 끝 700 · 오른쪽 아래 포인터 → wght 820 · wdth 145, 가로 넘침 없음 · 프리셋 중 `animating` 켜졌다 꺼짐 |
| file:// | 홈 → Families → Anybody(계산기 담기) → 다음 패밀리 → Licensing → About → 서랍 → Cart(1줄 유지) → 로고로 홈. CSS · 서체 적용, 콘솔 에러 0 |

## 게이트

```
node scripts/verify-site.mjs http://localhost:4404/
  페이지 30개 검사 (해시 변형 포함)
  문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개

npx --yes impeccable@latest detect  (이 폴더 html 12 + css 1, 예외 설정 · 억제 없음)
  출력 없음, exit 0 (권고 advisory 도 0)
```

404 는 어디서도 링크되지 않아 verify-site 순회에 안 잡힌다 → 따로 390/768/1440 에서 `scrollWidth = innerWidth` 확인.
한국어는 화면에 없다. `check-korean.mjs` 해당 없음.

## impeccable 처리 내역

처음 실패 7 + 권고 7. 억제 없이 값으로 고쳤다.

- `cramped-padding` ×7 — 테스터 무대 왼쪽 패딩 `calc(var(--gut) + 32px)` 를 정적 검사기가 0 으로 읽음 → 픽셀 값(116px / 390 에서 60px)
- `em-dash-overuse`(권고) ×7 — 가격 옵션 "1–3 users — €280" 식으로 한 페이지에 20개 넘게 → 구분자를 콜론으로, 제목의 대시를 가운뎃점으로, 메트릭 자리표시를 말줄임표로. 남은 대시는 홈 한 줄 정의의 두 개(사용자 지정 문장)와 글리프 표의 `—` 글자

## 작업 중 실제로 틀렸던 것

- **히어로 견본이 화면 폭의 1/3.** 긴 단어("Hamburgefonstiv")를 가장 넓은 인스턴스(wdth 150)로 맞춤 → 짧은 "Quoin" 으로 바꾸고 포인터가 폭을 바꿀 때마다 다시 맞춤
- **`hidden` 이 안 먹음.** `.share-box{display:grid}` 가 `hidden` 을 덮어 빈 링크 칸이 보임 → `[hidden]{display:none !important}`
- **글리프 확대에서 선이 글자보다 34px 아래.** `text-top` / `text-bottom` 탐침이 거울 줄 상자를 넓혀 베이스라인이 밀림(행간 1.25 < 글꼴 높이 1.49 인 Literata) → 어센트 · 디센트를 별도 거울(행간 normal)에서 재도록 분리. 이후 전 견본 오차 0.00px
- **글리프 버튼과 굵기 버튼이 같은 `data-set` 속성.** 글리프를 누르면 JSON 파싱 오류 2건 → 글리프 쪽을 `data-group` 으로
- **치환 문자열의 `$$` 가 `$` 로 줄어** 선이 하나도 안 그려짐(String.replace 특수 패턴) → 직접 고침
- **About · 목록에서 어센트 선이 위 제목과 겹침**(Literata 1.18em, Bodoni 1.13em > 행간 1.12) → 선이 칸 밖이면 칸 여백 자동 확장, 목록 견본 행간 1.5
- **390 에서 테스터 96px 이 "Labo/rato/ry" 로 쪼개짐** → 좁은 화면 기본 56px, `overflow-wrap: anywhere` → `break-word`
- **390 에서 404 가로 넘침.** 그리드 열이 한 줄 맞춤 글자에 끌려 늘어남 → `minmax(0, 1fr)`
- 서랍 ESC 테스트가 한 번 실패 → 단독 재현 안 됨, 스크린샷 직후 바로 키를 누른 타이밍 문제. 150ms 대기 후 두 번 연속 통과

## 남은 것 · 한계

- 결제 · 주문 전송 없음(화면에 명시). 라이선스 약관 원문(EULA)은 만들지 않았다 — 체크박스 문구만 있음
- 가이드 선 값은 글꼴 메트릭(OS/2 · MVAR)을 브라우저가 읽은 값이다. 실제 글자 윤곽(오버슈트)을 재지 않는다 — About 에 적음
- `cap` 단위를 지원하지 않는 옛 브라우저에서는 캡하이트 선이 베이스라인에 붙는다. Safari · Firefox 에서 직접 열어보지 않았다
- 글리프 표는 Google Fonts latin 서브셋 201자만. 합자 · 대체 글리프 · OpenType 기능은 보여주지 않는다
- Science Gothic 대비(CTRS) · 기울기, Roboto Flex 파라메트릭 축 10개는 축 표에만 있고 테스터에서 못 움직인다. 이탤릭(Anybody · Literata · Bodoni Moda)은 불러오지 않았다
- 홈에서 여섯 벌을 전부 불러와 첫 로드가 무겁다(가변 woff2 여섯 벌)
- 1px 가이드 선이 축소 캡처에서 회색처럼 보인다. 계산 색은 정확함(`rgb(200,0,95)` / 다크 `rgb(255,92,163)`)

## 지난 창작과 무엇이 다른가

| | LOW LANTERN | 암등 현상소 | Seed Almanac | **Quoin & Slug** |
|---|---|---|---|---|
| 레이아웃 | 초대형 번호 포스터, 12단 | 필름 스트립 가로 흐름 | 신문 5단 조판 | **견본 한 줄이 화면 폭 전체 + 조판 가이드 선을 화면에 노출** |
| 바탕 | 흑백 교대 | 암실 검정 | 종이 회백 | **순백, 테스터만 다크 전환** |
| 색 | 원색 3 면 | 안전등 빨강 | 봉투 3색 면 | **마젠타 하나, 선 · 글자로만** |
| 이미지 | 재킷 도형 | 필름 속 사진 | 판화 SVG 53 | **0 — 글자가 이미지** |
| 서체 | Archivo 한 벌 | Spoqa + Martian Mono | 세리프 둘 | **여섯 벌이 콘텐츠, UI 는 Roboto Flex** |
| 모션 | 소리 반응 면 | 현상 떠오름 | 달력 채움 · 봉투 | **포인터로 축 조절 · 축 전환** |
| 특이 기능 | 합성 미리 듣기 | 가격 계산 · 현황 조회 | 파종 달력 | **가변 축 테스터 · URL 공유 · 글리프 확대 · 사용량 요금 계산** |

## 파일

```
data.mjs        주조소 · 여섯 벌(축 · 디자이너 · 설명 · 프리셋 · 기본가) · 라이선스 배수 · 글리프 세트 · 질문
build.mjs       12페이지 + assets/data.js 생성
assets/site.css
assets/site.js  메뉴 · 가이드 선 · 맞춤 · 테스터(URL 공유) · 히어로 모션 · 목록 필터 · 글리프 · 계산기 · 장바구니 · 주문 폼
assets/data.js  (생성물) 패밀리 · 라이선스 데이터
refs/           home-1440 · home-1440-full · home-390 · home-390-full · home-hero-pointer-1440
                tester-dark-1440 · tester-shared-url-1440 · glyph-zoom-1440
                calculator-literata-1440 · calculator-bundle-1440 · cart-drawer-1440 · cart-errors-1440
                families-1440-full · families-1440-width-filter · family-literata-1440-full · family-science-gothic-390-full
                licensing-1440-full · about-1440-full · menu-390 · 404-390
```
