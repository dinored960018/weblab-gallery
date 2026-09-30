# LOW LANTERN RECORDS — 창작 (모작 아님)

가상의 독립 음반사. 영어 사이트. 2026-09-30.
기획: [`research/2026-W40/build-concepts.md` §5](../../research/2026-W40/build-concepts.md)

## 한 줄

Catalogue numbers, tracklists, run times and pressing details for a small label's 24 releases.
초대형 카탈로그 번호 + 원색 면 3 + 흑/백 교대 바탕. 트랙 미리 듣기는 브라우저가 직접 합성한다.

## 소재

음반 정보는 전부 사실 형태다 — 카탈로그 번호, 포맷, 프레스 수량, 비닐 무게, 발매일, 트랙 시간, 크레디트.
레이블·아티스트 6팀·스튜디오·공연장·사람 이름은 전부 지어냈다. 도시는 실제.
이름 검색: "Low Lantern Records" 와 정확히 일치하는 레이블 없음. "Lantern Records" 는 여럿 있다.

수치는 소규모 독립 레이블 대역에 맞췄다.

| | 값 |
|---|---|
| 카탈로그 | LL001–LL024, 2018-04 ~ 2026-10 (LL024 는 10월 2일 발매 예정 → 예약 판매) |
| 포맷 | LP 11 · 2LP 2 · 12" 5 · 7" 3 · CS 3 |
| 프레스 | 100 (CS) ~ 1,000 (LL024). 합계 11,450장 |
| 비닐 | 140 g / 180 g, 7" 40 g, 색 비닐 4장(투명·빨강·노랑·파랑) |
| 트랙 | 130곡. 길이는 장르 대역에서 시드 난수(앰비언트 3:10–7:10, 테크노 5:30–7:50, 7" 2:58–3:56) |
| 가격 | LP £24 · 2LP £32 · 12" £14 · 7" £8 · CS £9, 디지털 £2–12, 배송 UK £4 · Europe £9 · World £14 |
| 재고 | LL001–009 실물 품절(디지털만), 나머지 14장 실물 재고 |
| 투어 | 26회, 2026-10-03 ~ 2027-01-23, 4지역 |

## 토큰

| 역할 | 값 | 대비 (실측) |
|---|---|---|
| 흰 바탕 / 잉크 | `#FFFFFF` / `#111111` | **18.88:1** |
| 흰 바탕 보조 글자 | `#585858` | **7.11:1** |
| 검은 바탕 보조 글자 | `#A8A8A8` on `#111111` | **7.94:1** |
| 괘선 | `#BDBDBD` / `#474747` | 글자에 안 씀 |
| 빨강 면 | `#E23B2E` + 글자 `#000000` | **4.90:1** — `#111` 은 4.40, 흰색은 4.29 로 둘 다 미달이라 순흑 |
| 파랑 면 | `#1E4FD8` + 글자 `#FFFFFF` | **6.63:1** (`#111` 은 2.85) |
| 노랑 면 | `#F2C318` + 글자 `#111111` | **11.33:1** (흰색 1.67) |
| 면 위 버튼 | 파랑 글자 on 흰 / 노랑 글자 on 잉크 | 6.63 / 11.33 |

**실측 방법:** 36페이지의 보이는 텍스트 노드 전부(3,882개)를 돌며 글자색과 실제 뒤 배경색을 계산. 최저 **6.63:1**. 4.5 미만 0.
빨강 면 위에 올라가는 본문 글자는 결과적으로 없다. 빨강 면과 겹치는 것은 초대형 카탈로그 번호뿐이고(`aria-hidden`, 120px 이상 큰 글자),
그 경우 `#111` 4.40 · 흰색 4.29 — 큰 글자 기준 3:1 이상.

- **서체: Archivo 한 벌** (가변 wdth 62–125, wght 400–900). 폭 75% 로 포스터 숫자·제목, 85% 로 음반 제목, 100% 로 본문. 숫자는 전부 `tabular-nums`.
  impeccable `overused-font` 통과 확인. 지난 창작의 Barlow · Schibsted Grotesk · IBM Plex Mono · Hahmlet 과 안 겹침
- 그리드 12단. 카탈로그 번호는 `26vw`(1440 에서 약 860px = 화면 폭 60%)로 단을 무시하고 원색 면 위를 덮는다
- 바탕 교대: 홈 흰 · Releases 검 · 음반 상세 홀수 흰/짝수 검 · Artists 흰 · 아티스트 상세 교대 · Tour 검 · Shop 흰 · Label 검
- 모서리 0, 그림자 0, 장식 그라데이션 0 (재생 막대 채움에만 `linear-gradient` 한 줄)

## 페이지 (36)

```
/                      Now(LL024 + 미리 듣기) · Latest 6 · Tour 다음 6회 · Newsletter(파랑 면)
/releases/             Catalogue 24 — Format · Year 필터, Grid / List 전환
/releases/ll001/ …ll024/   음반 ×24 — 사실표 · 트랙리스트(면 A–D) · 미리 듣기 · Credits · Pressing · 앞뒤 번호
/artists/              Artists 6 — 이름 · 도시 · 카탈로그 번호 · 공연 수 · 재킷 색
/artists/<slug>/       아티스트 ×6 — 라인업 · 소개 2문장 · 음반 · 공연
/tour/                 Tour 26 — Region 필터
/shop/                 Shop 24 — 포맷 선택 · 수량 · 장바구니
/about/                Label — 사실표 · 사람 · 연락처 · 데모 · 미리 듣기 설명 · Newsletter(노랑 면)
```

기획서는 12페이지(음반 5 · 아티스트 3)였다. 빌드가 데이터에서 찍으므로 24장·6명 전부 만들었다. 5장만 두면 카탈로그 카드 19장이 막다른 곳이 된다.

`node build.mjs` 가 `data.mjs` 에서 36장을 만든다. 손으로 쓴 HTML 없음. 링크는 전부 상대경로 + `index.html` — **더블클릭(file://)으로 전 페이지 이동 확인** (실측, 아래).

## 소리 — 어떻게 나는가

오디오 파일 0개. `assets/sound.js` 가 Web Audio API 로 그 자리에서 합성한다.

1. **빌드 단계**: 트랙마다 `data-style · data-bpm · data-root · data-mode · data-wave · data-cut · data-seed` 를 심는다.
   style 은 아티스트(6종), 나머지는 카탈로그 번호+트랙 번호 시드로 장르 대역 안에서 뽑는다. 화면에도 `124 BPM · A♭ dorian` 으로 보인다
2. **스타일 6종** — 같은 엔진, 다른 악기 구성

   | style | 아티스트 | BPM | 구성 |
   |---|---|---|---|
   | ambient | Ines Marlow | 62–72 | 느린 어택 패드(디튠 2음) · 저음 · 드문 벨 + 딜레이 |
   | techno | Harbour Static | 124–132 | 4/4 킥 · 오프비트 햇 · 필터 엔벨로프 베이스(Q 9) · 코드 스탭 |
   | arp | Oda Veldt | 100–118 | 16분 아르페지오(시드 순서) · 삼각파 베이스 · 딜레이 |
   | motorik | The Quiet Engines | 116–126 | 킥 0·8·10 · 스네어 2·4 · 8분 베이스 · 톱니파 코드 |
   | jazz | Tomasz Brenn | 84–98 | 워킹 베이스 · 브러시(밴드패스 노이즈) · 7th 코드 · 스윙 33% |
   | dub | Field Office | 70–80 | 3박 킥(one drop) · 림 · 서브 · 오프비트 스캥크 + 점8분 딜레이 |

3. **루프**: 시드로 코드 진행(6종 중 1) · 베이스/햇 마스크 · 아르페지오 순서를 정해 4마디(64스텝)를 돈다. 25ms 타이머 + 120ms 선행 스케줄링
4. **재생 한 번 = 버스 하나**: 멈추면 버스 게인을 60ms 에 0으로 내리고 끊는다. 딜레이 꼬리까지 같이 사라진다
5. **미리 듣기 30초** → 다음 트랙 자동, 마지막 트랙 후 정지
6. **사용자 제스처**: `AudioContext` 는 첫 클릭 때 만든다. 페이지 로드 시 상태 `ctx: none` (실측)
7. **페이지 이탈**: `pagehide` 에서 정지 + `ctx.close()`. bfcache 복귀 시 정지 상태로 다시 그린다
8. 화면에 "Previews are synthesised in the browser from each track’s tempo and key. Not the recordings." 를 붙였다 — 녹음처럼 보이지 않게

스타일별 실측 (첫 재생 3초, 헤드리스 Chrome, AnalyserNode):

| 음반 | style | RMS 평균 | 스펙트럼 중심 |
|---|---|---|---|
| LL002 | ambient 71 BPM | 0.069 | 678 Hz |
| LL003 | techno 127 BPM | 0.098 | 4,188 Hz |
| LL004 | jazz 89 BPM | 0.051 | 1,250 Hz |
| LL005 | arp 101 BPM | 0.099 | 1,902 Hz |
| LL006 | dub 79 BPM | 0.143 | 1,467 Hz |
| LL007 | motorik 116 BPM | 0.113 | 4,527 Hz |

처음 측정에서 jazz 가 0.031 로 dub 의 1/4.5 → 워킹 베이스·코드 게인을 올려 0.051. 앰비언트·재즈는 성긴 편성이라 평균이 낮은 게 맞다.

## 모션 — 둘만

| | 무엇 | 어떻게 |
|---|---|---|
| 1 | 원색 면이 소리에 흔들림 | `AnalyserNode` 시간 영역 RMS → 빠른 상승(0.6)/느린 하강(0.12) 평활 → `--lvl` → `translate(-22px·lvl, 16px·lvl) rotate(-0.8deg·lvl)`. 재생 중에만 rAF |
| 2 | 재킷 호버 시 음반이 반쯤 나옴 | 카드의 디스크가 `translateX(52%)`, 0.5s. 키보드 포커스(`:focus-visible`)에도 같게 |

- `prefers-reduced-motion: reduce`: `--lvl` 계산을 안 하고(0 고정), 면 `transform: none`, 디스크 이동 없음 — **실측: 재생 중 transform `none`, `--lvl 0.000`, 호버 transform `none`**
- 스크롤 등장 연출, 페이지 전환 연출 없음

## 기능 — Playwright(캐시된 npx 패키지 + 시스템 Chrome)로 눌러서 확인

| 기능 | 결과 |
|---|---|
| 재생 | 로드 직후 `ctx: none` → 클릭 → `running`, 1.5초 후 `lvl 0.55`, 면 `matrix(… -10.9, 7.9)` 로 이동 |
| 트랙 넘김 | Next → A2 TEU · Prev → A1 · 트랙 행 버튼 → A4 Twistlock 재생, 같은 버튼 다시 → 일시정지(0.50초에서 멈춤). `aria-pressed`·`aria-label`(Play/Pause 제목) 동기화 |
| 키보드 | 재생 버튼 포커스 + Space → 재생. 진행 막대(`input[type=range]`, step 1) → ArrowRight ×5 = +5초, `aria-valuetext "6 of 30 seconds"` |
| 30초 → 다음 | 29초로 이동 → 1.8초 뒤 다음 트랙 0.71초 재생 중 |
| 페이지 이탈 | 재생 중 다른 페이지로 → `pagehide` 이후 상태 `playing:false, ctx:none` |
| 카탈로그 필터 | LP → 11장 · LP+2021 → LL011 LL010 · List 전환 → 표 2행 · 7"+2018 → 0장, "No releases match." + Clear filters → 24장, 포커스 All 로. `?format=lp&year=2021&view=list` 유지, 주소로 들어오면 복원(`?format=cs&view=list` → 3장, List) |
| 투어 지역 | Asia 4 · North America 4 · UK & Ireland 9 · Europe 9 · All 26. `aria-pressed`, 개수 `aria-live` |
| 상점 | + 두 번 → 3 · Add → "In cart: 3 × LP.", 머리 Cart 3 · LL001 LP 는 `disabled`(품절)라 Digital 선택 상태 · + 7번 → 5/5 에서 멈춤(1인 5장 한도) |
| 장바구니 서랍 | `<dialog>` 열림 · 줄 2개, £81 + £4 = £85 · −1 → £61 · 배송 World → £71 · Checkout → "Checkout not connected. No order placed, no payment taken." · ESC 닫힘, 스크롤 잠금 해제, Cart 버튼으로 포커스 복귀 · 바깥 클릭 닫힘 |
| 저장 | localStorage. 다른 페이지(Label)에서도 Cart 3 · 실물 줄 삭제 → 디지털만 남으면 배송 £0 자동, 다른 배송 옵션 비활성 |
| 뉴스레터 | 빈 제출 → "Enter an email address." + `aria-invalid` + 입력칸 포커스 · `nope@` → "Check the email address…" · 정상 주소 → 제출 막고 "Not sent. Demo site — no mailing list is connected.", 주소 안 바뀜 |
| 모바일 메뉴 (390) | 열림 `aria-expanded=true`, `html` overflow hidden, 휠 900px 에도 scrollY 0 · ESC 닫힘 + 버튼으로 포커스 · 메뉴 링크 이동 |
| file:// | 홈 → Releases → LL024 → 목록 → Artists → Ines Marlow → Tour → Shop → Label → 홈, 폰트·CSS 적용. file:// 에서 재생 `running`, 장바구니 담기, 필터+주소 갱신 동작. 콘솔 에러 0 |
| 콘솔 | 위 전 과정 에러 0 |

## 게이트

```
node scripts/verify-site.mjs http://127.0.0.1:4394
  페이지 98개 검사 (해시·쿼리 변형 포함)
  문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개

npx --yes impeccable@latest detect  (이 폴더 html 36 + css 1, 예외 설정 없음)
  findings 0, exit 0
```

한국어는 화면에 없다. `check-korean.mjs` 해당 없음.

## impeccable 처리 내역

처음 211건. 억제 없이 전부 값으로 고쳤다.

- `cramped-padding` ×186 — 트랙 행이 괘선에 붙음 → 행 `padding: 8px 0`, 최소 높이 56px, 목록 위 4px
- `flat-type-hierarchy` ×21 — 음반 상세의 Tracklist/Credits/Pressing 이 13px 라벨이라 본문과 단계 차이 1.23 → 30px 폭 75% 제목으로. 면 라벨(Side A)만 13px
- `cramped-padding` ×2 — 뉴스레터 면 좌우 여백이 `clamp()` 변수라 검사기가 0으로 읽음 → 40px / 모바일 16px 고정값
- `side-tab` ×1 — 이메일 오류 표시를 오른쪽 4px 테두리로 했음 → 안쪽 2px 전체 테두리(`inset box-shadow`)
- `oversized-h1` ×1 — 홈 h1 이 544px 카탈로그 번호 → 번호는 `aria-hidden` 장식, h1 은 음반 제목 "Standing Room"

## 작업 중 실제로 틀렸던 것

- **재킷이 겹침.** 무늬 8종 × 면 색 9칸 순환이라 LL024 와 LL008 이 같은 빨강 반원 재킷 → 색을 `(i + 2·⌊i/8⌋) mod 3` 로 돌려 24장 조합 전부 다르게
- **카드 줄 끝에 한 장.** `auto-fill` 로 5열 → 24장이 5·5·5·5·4, 홈 6장이 5·1 → 4열 고정(1100↓ 3열, 640↓ 2열), 홈만 3열
- **390px 상점 넘침.** 수량 + 담기 버튼이 96px 재킷 옆 한 줄에 안 들어감 → 모바일에서 폼 한 줄씩
- **재생 전부터 하단 플레이어가 사실표를 가림** (sticky) → 한 번 재생한 뒤에만 하단 고정
- **진행 막대 키보드가 0.1초씩.** 화살표 5번에 0.5초 → step 1초
- **상점 머리 숫자 "£2"** 가 정보가 아님 → 실물 재고 음반 수 **14**
- **소개 문구 사실 오류.** Ines Marlow "Five releases" → 실제 4장
- 셸 heredoc 앞에 붙은 빈 `cat >` 가 입력을 기다리며 10분 멈춤 — 도구 쪽 실수, 결과물 영향 없음

## 한계 · 안 한 것

- 소리는 헤드리스 Chrome 에서 AnalyserNode 수치로만 확인했다. **사람 귀로 들어보지 않았다.** 음량 균형은 RMS 로 맞춘 것
- Safari·Firefox 에서 직접 열어보지 않았다. `webkitAudioContext` 대비만 넣었다
- 페이지를 옮기면 재생이 끊긴다(기획서대로 하단 바 유지 생략)
- 결제·메일링은 연결하지 않았다. 버튼은 "연결 안 됨"을 화면에 밝힌다
- 메일 주소는 `lowlantern.example` — 실제 도메인과 겹치지 않게 예약 도메인
- 사진 0장. 재킷 24장은 SVG 도형(무늬 8종 × 원색 3 × 시드), 음반은 SVG 원. `fetch-stock.mjs` 안 씀, `credits.json` 없음

## 지난 창작과 무엇이 다른가

| | HALIDE | 새물 | CORRIDOR | 단청 | **LOW LANTERN** |
|---|---|---|---|---|---|
| 레이아웃 | 카탈로그 목록 | 타일·표 | 운행표 | 전폭 도해 | **초대형 번호 포스터 (화면 폭 60%)** |
| 바탕 | 흰색 | 흰색 | 회백색 | 어두운 목재 | **페이지마다 흑/백 교대** |
| 색 | 없음 | 물색 1 | 신호 빨강 1 | 안료 | **원색 3 면, 면마다 글자색 실측 선택** |
| 이미지 | 광학 SVG | 없음 | 노선 SVG | 도해 | **생성 재킷 SVG 24 + 음반** |
| 서체 | 그로테스크+모노 | 고딕+모노 | Barlow+Plex Mono | 명조 | **Archivo 한 벌, 폭 축으로 위계** |
| 모션 | — | — | 스크롤 노선도·VT | — | **소리에 반응하는 면 · 슬리브에서 나오는 음반** |
| 특이 기능 | 대여 폼 | 레인 현황 | 3단계 예약 | 도해 확대 | **Web Audio 합성 미리 듣기** |

## 파일

```
data.mjs         레이블 · 아티스트 6 · 음반 24(트랙 130) · 가격 · 투어 26
build.mjs        36페이지 생성기 (트랙 BPM/조성/면 배정 · 재킷 SVG · 음반 SVG)
assets/site.css
assets/site.js   메뉴 · 카탈로그 필터/보기 · 투어 필터 · 상점/장바구니 서랍 · 뉴스레터
assets/sound.js  합성 엔진 · 플레이어 · 분석기 모션
refs/            home-1440(+full) · home-390(+full) · catalogue-1440-full · catalogue-lp-2021-list
                 catalogue-hover-disc · release-ll015-playing-1440 · release-ll008-390
                 tour-asia · shop-cart-drawer · newsletter-error · artists-1440 · menu-390
```
