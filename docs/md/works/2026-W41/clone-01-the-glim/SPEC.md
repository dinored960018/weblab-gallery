# SPEC — THE GLIM (글림) 회사 사이트

## 출처

- **원본 URL**: http://www.theglim.co.kr/ — 한국 UI/UX 에이전시 (주)글림 사이트 (Vue SPA, lang=ko)
- **어워드**: Awwwards **Honorable Mention**
- **어워드 링크**: https://www.awwwards.com/sites/the-glim (2026-10-06 직접 열어 확인 — 페이지에 `Honorable Mention - Nov 10, 2025`, 제작 Glim, 설명 “A playful digital experience that connects brand and users through motion, interaction, and joyful identity.”, 방문 링크 `http://www.theglim.co.kr/`. 캡처 `refs/awwwards-the-glim.jpg`)
- **수상일**: 2025-11-10
- **업종**: UI/UX 디자인 에이전시 (포트폴리오 · 구성원 · 회사 소개 · 문의)
- **모작 날짜**: 2026-10-05 슬롯 (작업 2026-10-06)
- **모작 브랜드명**: `Plok / (주)플록` (가상). 웹 검색 “Plok UX design agency Seoul”, “플록 디지털 에이전시 UX plok” 에서 같은 이름의 UI/UX 회사 없음. 로고는 P·l·o·k 를 사각·원 도형으로 직접 그린 SVG(원본 Glim 로고와 글자·모양이 다르다). 고객사 12곳(한결백화점 · 다온리테일 · 다슬증권 · 단비로지스 · 노을페이 · 하람은행 · 새봄여행 · 가람에어 · 솔담제약 · 온결패션 등), 구성원 20명, 주소·전화·이메일은 전부 지어낸 값. 실존 고객사 로고·상표(원본의 신세계 · 교보 · 7-Eleven · 품고 · Red Dot · iF · Excel · Apple 노트북 등)는 하나도 쓰지 않았다.

### 대상 선정 근거 (지시 순서대로 확인)

| 순서 | 후보 | 수상 | 확인 결과 | 판정 |
|---|---|---|---|---|
| – | Y-VISION | HM 2026-08-09 | 사용자가 앞서 삭제를 지시한 대상 | 제외 (폐기본 `weblab-dropped/2026-W41-clone-01-y-vision`) |
| 1 | DINO TAENG `dinotaeng.com` | HM 2026-01-25 (`awwwards.com/sites/dino-taeng` 에서 확인, 제작 FAVE®) | 2D·한국어·멀티페이지 커머스는 맞다. 그러나 홈이 **1636×1803 일러스트 마을 지도**(건물 7채가 링크), 캐릭터 · 히스토리 1F/2F(조각상 진열장) · 프로젝트 · 문의 · 다운로드가 모두 **전면 일러스트 장면 + Lottie 인트로**로 이뤄져 있다(`weblab-dropped/2026-W41-clone-01-dinotaeng/refs/`) | **중단** — 사용자 지시(코디네이터 전달): “사용자 지시로 디노탱은 중단합니다(일러스트가 너무 많이 필요)”. 작업분은 `weblab-dropped/2026-W41-clone-01-dinotaeng` 으로 옮김 |
| 2 | 드퐁데 `deeponde.com` | SOTD 2021-01-08 (`awwwards.com/sites/deeponde`, Plus X) | 수상 페이지 썸네일은 검은 바탕 · ‘Deephydra B5 / Hyabalance’ 메뉴 · KR/CN · 가로 내비게이션. **지금 deeponde.com 은 흰 바탕 Cafe24 쇼핑몰(글루타치온 앰플, 운영사 플러스그로스)로 완전히 바뀌어** 수상 당시 디자인이 남아 있지 않다 | 탈락 — 수상 디자인이 없음 |
| 3 | **THE GLIM** `theglim.co.kr` | HM 2025-11-10 | lang=ko, 화면 한글(소개·구성원·문의 본문 대부분 한글). 페이지: 레퍼런스(홈) · 상세 35 · Glimmer(People) · Gallery · 갤러리 상세 8 · Brief(Introduce) · Contact + Request/Recruit 대화상자. **캔버스·WebGL 없음**(`refs/origin.md`: 2d 1×1·300×150 캔버스 = 지도 SDK 측정용). 화면을 이끄는 것은 프로젝트 사진·영상, 큰 타이포, 빨강·초록·파랑 원색 면. 일러스트는 없고 이모지·미모지 이미지가 장식으로 쓰인다 | **선택** |

- 일러스트 의존도: 낮음. 사진 자리(프로젝트 대표 이미지·상세 목업·갤러리 행사 사진)는 Pinterest 사진으로 채울 수 있다. 원본의 이모지(Apple 이모지 이미지)·미모지는 **Noto Color Emoji 글꼴 문자**로 대체했다(그림을 새로 그리거나 원본 이미지를 쓰지 않음).
- 영상: 홈 배경 3개(`video` mp4)와 Glimmer 소개 영상 → 정지 사진(아래 ‘옮기지 못한 것’).

---

## 사이트 구조

- **원본**: 레퍼런스(홈, 크게 보기/바둑판 보기, 분류 All·UX·CX·BX·System) → 상세 `/detail/<uuid>` 35건 / Glimmer `/glimmer`(People) · `/glimmer/gallery` · `/glimmer/gallery/detail/<uuid>` 8건 / Brief `/brief`(Introduce) · `/brief/contact` / 전 페이지 하단 Request · Recruit 대화상자와 Brochure 내려받기. GNB 는 알약 모양 하나이고, 현재 대메뉴가 맨 위 칸에 오며 + 단추로 나머지 두 메뉴가 아래로 펼쳐진다. 페이지마다 GNB 위치가 다르다(홈 가운데 · Glimmer 오른쪽 · Brief 왼쪽, 상세는 화면 아래 떠 있는 막대).
- **재현**: `node build.mjs` 가 `data.mjs` 로 **25페이지** 생성. 상대 경로 + `index.html` 이라 `file://` 로도 이어진다. `href="#"` 0.

```
/                                   Reference (크게 보기 · 바둑판 보기 · 분류)
├─ detail/<slug>/ × 12              프로젝트 상세
├─ glimmer/                         People
│  └─ gallery/                      Gallery
│     └─ detail/<slug>/ × 8         행사 상세
├─ brief/                           Introduce
│  └─ contact/                      Contact
└─ (전 페이지) Request · Recruit 대화상자, assets/plok-brochure.pdf
```

줄인 것: 프로젝트 35 → 12(분류 비율 유지, System 0건 그대로), 구성원 약 39명 → 20명.

## 그리드 (1440×900 실측)

| 항목 | 원본 | 모작 |
|---|---|---|
| 바깥 틀 | `main` 1440×860, 10px 검은 테두리, 안쪽 패널 1420×840 r30, 아래 푸터 50 | 동일 (`.home` fixed inset 10/10/50, r30) |
| GNB | 413×70 r40, 좌우 패딩 30, 로고 80×34 → 메뉴 알약 124×34 (간격 30) → 분류 111×33 (간격 6) | 동일 |
| 홈 제목 | x50 y620, 610×70 | 동일 (left 40 / bottom 80 within panel) |
| 좋아요 | x50 y720, 106×50 r25 | 동일 |
| 캐러셀 | 740,640 584×130 r30, 원 70 · 간격 20, 활성 카드 160×205 r20 (952,544) | 동일 |
| 보기 전환 | 1344,640 46×130 r23 | 동일 |
| 바둑판 | 3열 · 간격 10 · 정사각 467 r30 | 동일 |
| 상세 | 대표 이미지 10,10 1050×776 r30 · 정보 카드 1070,10 360×405 r30 · 팀 카드 175 정사각 2열 간격 10 | 동일 |
| 상세 본문 | 1420 폭, 제목 x10, 문단 x20, 키워드 2단, 고정 단락 467 + 700 정사각 | 동일 |
| 아래 이동 막대 | 492,750 456×70 | 동일 |
| Glimmer 사람 카드 | 큰 카드 467 정사각(3열) · 작은 카드 228 (6열) · 간격 10 | 동일 |
| 갤러리 · 연혁 · 복지 | 3열 467 정사각 r30 | 동일 |
| Contact | 지도 1050×840 r30 + 오른쪽 360 (카드 + 175 타일 3) | 동일 |
| 브레이크포인트 | 원본 1024 이하에서 캐러셀을 감추고 정보만 남김(`refs/states/m-home.jpg`) | 768 이하 한 단 · 캐러셀 숨김 · 밀어서 넘김 |

## 타이포

| 역할 | 원본 | 모작 |
|---|---|---|
| 전부 | Pretendard (자체 호스팅, 100~900) | Pretendard 1.3.9 (jsdelivr) |
| 이모지 | Apple 이모지 PNG | Noto Color Emoji (Google Fonts) — 글자로 그림 |

| px / 행간 | 굵기 | 쓰이는 곳 |
|---:|---:|---|
| 130 / 140 | 400 | Glimmer 첫 화면 |
| 100 / 110 | 400 | 그룹 제목, Brief 섹션 제목 |
| 90 / 110 | 400 | 대화상자 큰 글자, Glimmer 끝 |
| 80 / 80 | 400 | 상세 개요 제목 |
| 60 / 70·72 | 700 / 400 | 홈 프로젝트 문구(700), 상세 단락 제목(400) |
| 28 / 34 | 700 | 상세 카드 제목 |
| 18 · 16 · 15 | 400·700 | 단계 질문 · 본문 · 알약 메뉴 |
| 14 / 22 | 400 | 소개 문단 |
| 13 · 11 | 400 | 카드 메타 · 기술 꼬리표(r9) |

## 아이콘

- 원본: 직접 그린 SVG(+ 원 18px, 화살표, 공유, 하트, 바둑판 4점, 맨 위로), 수상 리본 2개(Awwwards 외부 위젯).
- 모작: 같은 모양을 SVG 로 직접 그림(선 1~1.4px). 하트 24×21, + 원 18. 수상 리본은 외부 서비스 상표라 넣지 않았다.
- 원본 스티커 ‘N.X MAKES ME HIGH’ 원형 → ‘P.L.K / PLAN LOOK KEEP’ 원형 SVG(빨강·초록·파랑 원색).

## 컬러

| 역할 | 원본 | 모작 | 근거 |
|---|---|---|---|
| 바탕 | `#000` | 동일 | body · main 테두리 |
| GNB 유리 | `rgba(255,255,255,.6)` + blur 5, 테두리 `.67px #fff` | 동일 | `.gnb::before` |
| Reference 알약 · 좋아요 · UXD | `#ff0000` + 흰 글자 | **`#e00000`** | 흰 글자 대비 4.0 → 5.0:1 |
| Glimmer 알약 · UXP | `#00ff00` + 검정 글자 | 동일 (15.3:1) | |
| Brief 알약 · UXI | `#0000ff` + 흰 글자 | 동일 (8.6:1) | |
| 검정 위 파란 글자(UXI 제목) | `#0000ff` (2.4:1) | **`#5c6bff`** (5.0:1) | 대비 |
| 분류 개수 | `#fc0000` 위첨자 | `#c00000` on `#dcdcdc` (4.7:1) | 대비 |
| 카드 바탕 | `#1d1d1d` · 캐러셀 활성 `#eee` | 동일 | |
| 캐러셀 유리 | `rgba(0,0,0,.1)` + blur 30 | 동일 | `.reference-nav-list::before` |
| 보기 전환 | `rgba(0,0,0,.8)` + blur 30, 손잡이 `#fff` | 동일 | |
| 입력칸 | `#1d1d1d`, 오류 빨강 테두리·글자 | 동일 (오류 `#ff6b6b` 6.1:1, 자리표시 `#8f8f8f` 5.2:1) | |

## 간격

반복 값: 10 (틀·카드 간격) · 20 · 30 (r30, GNB top) · 40 · 50 · 70 · 100 · 130. 상세 본문 단락 사이 130, 제목→문단 30, 문단→그림 60. 사람 그룹 사이 100, 그룹 제목→카드 70.

---

## 모션

실측: `extract-origin.mjs`(transition 빈도 · @keyframes · 상태 규칙), `record-motion.mjs`(홈 · Brief, 로드 → 휠 → 호버), 상태 캡처 `refs/states/`.
원본 CSS 이징은 `ease` 가 1,530회로 거의 전부, 길이는 0.3s(102) · 0.5s(25) · 0.2s 세 가지.

| 원본 요소 | 속성 · 길이 · 이징 | 모작 |
|---|---|---|
| 캐러셀 활성 카드 | height 70→205, border-radius 35→20, 300ms ease (녹화 `motion-origin`) | border-radius 300ms ease 동일, **height 대신 clip-path 300ms ease**로 원 → 카드를 연다(아래 게이트 이유) |
| 캐러셀 이동 | Swiper slide 300ms, loop, centered | translateX 300ms ease, 끝에서 끊김 없이 순환 |
| 홈 프로젝트 바뀜 | 패널이 위로 빠지고 다음 패널이 아래에서 올라옴, 패널 간격 30 (`refs/states/home-next-250.jpg`) | translateY(100%+30px) 600ms ease |
| GNB 메뉴 펼침 | 항목 transform · opacity 0.5s | 동일 (40px 간격으로 내려옴) |
| GNB 페이지 사이 이동 | left · top · transform · width 0.5s (SPA 라 GNB 가 미끄러짐) | 다중 페이지라 이전 페이지 GNB 위치를 sessionStorage 에 두고 새 페이지에서 translate 500ms ease 로 옮긴다 |
| 좋아요 | 하트 5개 `flowOne~Five` (bottom 0→120~180, opacity →0) | 같은 키프레임 값, 1.4~1.8s |
| 바둑판 카드 호버 | 사진 scale 1.0683, 정보 opacity | 동일 (.5s / .3s) |
| 상세 PRE/NXT 호버 | `hoverPrev/Next` translate ±5px 1.5s infinite | 동일 |
| 공유 | `animateToastCopied` opacity 1→1→0 | 동일 1.8s |
| Glimmer 스티커 | `aniFaceRed/Green/Blue` left 0↔100%, rotate 1800° | 같은 키프레임, 길이는 원본 미노출이라 14·16·18s |
| Glimmer 끝 스티커 | `aniFaceBounce`(top 0↔−100) · `aniFaceBounceGreen/Blue`(rotate 2160°/4320°) | 같은 값, 이름만 `stickerHop*` (아래 게이트) |
| 사람 카드 호버 | 바탕 그룹색, 이름 → 한마디, 미모지 rotate 15° | 동일 |
| 지원 버튼 호버 | rotate(-15°) → 0 | 동일 .5s |
| 복지 카드 호버 | 테두리·바탕 200ms ease, 앞/뒤 그림 opacity 200ms | 동일 (녹화 서명 6개 공통) |
| Brief 첫 화면 | 카드 3장 · 사진 카드 · 장식 8개가 위에서 떨어져 기울어진 자리에 멈춤, 로드 후 약 0.6s 안에 끝 (`refs/motion-origin-brief/frames/load-03875~04375`) | WAAPI: translateY(−110vh) → +18px → −6px → 0, 1100ms, 80ms 시차 |

### 녹화 대조

| 페이지 | 원본 서명 | 공통 | 원본에만 | 모작에만 |
|---|---:|---:|---:|---:|
| 홈 | 5 | 4 | 1 (height 300ms) | 2 (clip-path 300ms · 카드 opacity 300ms) |
| Brief | 7 | 6 | 1 (커스텀 스크롤바 opacity 275ms) | 1 (떨어지는 물체 Web 애니메이션) |

- 홈 `height` → `clip-path`: impeccable `layout-transition`(높이·너비 전환 금지) 때문에 같은 모양을 clip-path 로 냈다. 크기(70→160×205)·모서리(35→20)·시간(300ms ease)은 원본 값.
- Brief 원본의 떨어지는 동작은 녹화기에 애니메이션·인라인 style 로 잡히지 않았다(프레임에는 보임). 원본이 무엇으로 움직였는지 확인하지 못해 프레임에서 잰 경로로 WAAPI 를 짰다.
- 스크롤바: 원본은 커스텀 스크롤 라이브러리(`.scrollbar__scroller`, 엄지 opacity 275ms). 모작은 문서 스크롤 + `scrollbar-width: thin`.
- 비교 파일: `C:\Users\swxp\Desktop\더드림벤처스\모션비교\2026-10-05\모션비교-THE-GLIM.html`, `모션비교-THE-GLIM-brief.html` (폴더 안 `refs/motion-compare.html`, `refs/motion-compare-brief.html`)

### 옮기지 못한 것 · 다르게 한 것

- **홈 배경 영상 3개 · Glimmer 영상**: 정지 사진. 원본 영상 안의 로고 애니메이션·패널 움직임은 영상 내용이라 CSS 로 옮기지 않았다. 원본 CSS 에 있는 `imgScaleUp`(scale 1→1.15)는 녹화 중 홈에서 돌지 않아 넣지 않았다.
- **Glimmer ‘Sound off’ 단추**: 영상 소리 제어라 영상이 없으면 동작할 대상이 없어 뺐다.
- **Contact 지도**: 원본은 카카오맵(드래그·확대). 모작은 직접 그린 약도 SVG(가상 주소). 카카오맵·네이버맵 앱 열기 단추 2개는 실제 서비스 상표·외부 링크라 뺐다.
- **SNS 링크 3개(페이스북·인스타그램·비핸스)**, **Awwwards 리본 2개**: 실존 서비스 로고 · 외부 계정이라 뺐다.
- **Brochure**: 원본은 API 로 회사 소개 PDF 를 내려받는다. 모작은 `build.mjs` 가 만든 한 쪽 영문 PDF.
- **Brief 물체 끌기**: 원본도 끌어지지 않았다(직접 끌어 보고 위치 변화 없음 확인). 넣지 않았다.

---

## 기능 목록

| 기능 | 위치 | 열기 | 닫기 | 상태 표시 |
|---|---|---|---|---|
| **GNB 메뉴** (Reference · Glimmer · Brief) | 전 페이지(상세 제외) | + 단추 | 다시 누름 · 바깥 클릭 · ESC(포커스 복귀) | `aria-expanded`, 현재 메뉴가 맨 위 칸 + `aria-current` |
| **하위 메뉴** People/Gallery · Introduce/Contact | Glimmer · Brief | 링크 | – | 검정 알약 + `aria-current` |
| **분류 필터** All · UX · CX · BX · System | 홈 | + 단추 / 맨 위 칸 | 항목 선택 · 바깥 · ESC | 고른 분류가 맨 위 칸, 개수 위첨자, `aria-pressed`, 캐러셀·바둑판 둘 다 걸러짐, 0건이면 빈 상태 문구 |
| **캐러셀** | 홈 | 이전·다음 · 원 클릭 · ←→ · (모바일) 밀기 | – | 활성 카드 펼침, 끝에서 순환 |
| **크게 보기 / 바둑판 보기** | 홈 | 전환 단추 2개 | – | `aria-pressed`, 흰 손잡이 이동 |
| **바둑판 카드 호버** | 홈 | 호버 · 포커스 | 벗어남 | 꼬리표·제목·좋아요 표시, 사진 확대 |
| **좋아요** | 홈 · 상세 · 갤러리 | 클릭 | 다시 클릭(취소) | 수 +1, `aria-pressed`, 하트 5개, `localStorage` 유지 |
| **공유(주소 복사)** | 상세 · 갤러리 상세 | 클릭 | – | 알림 `role=status` |
| **이전/다음 · 목록** | 상세 · 갤러리 상세 아래 막대 | 링크 | – | 처음↔끝 순환 |
| **맨 위로** | 상세 · 갤러리 상세 | 300px 넘으면 나타남 | – | |
| **팀원 이름** | 상세 팀 카드 | 호버 · 포커스 | 벗어남 | 이름 말풍선 |
| **사람 카드** | Glimmer | 호버 · 포커스 | 벗어남 | 그룹색 바탕, 이름 → 한마디, 이모지 15° |
| **갤러리 카드** | Gallery | 호버 · 포커스 | 벗어남 | 어두운 막 + 분류·제목·날짜·좋아요 |
| **복지 카드** | Brief | 호버 · 포커스 | 벗어남 | 흰 테두리, 이모지 바뀜 |
| **Request 대화상자** | 푸터 · Contact 타일 | 클릭 | 닫기 · ESC | 포커스 가둠·복귀, 배경 스크롤 잠금 |
| **Recruit 대화상자 + 그룹 탭** | 푸터 · Contact 타일 · Glimmer 끝 단추 | 클릭 | 닫기 · ESC | 탭 `role=tab` `aria-selected` ←→ |
| **폼 검사** (두 대화상자) | 단계 1~5 | Send | – | 칸별 빨간 문구 `aria-invalid` · `aria-describedby`, 첫 오류 포커스, 약관 미동의 시 ‘Wait!’ 상자(`role=alertdialog`), 통과해도 전송하지 않고 확인 상자 |
| **연락처 앞자리** | 폼 | 클릭 | 선택 · ESC · 바깥 | `role=listbox`, ↑↓ Enter |
| **약관 내용보기** | 폼 5단계 | 클릭 | 다시 클릭 | `aria-expanded` |
| **파일 찾기** | 폼 4단계 | 파일 선택 | – | 고른 파일 이름 (`aria-live`) |
| **Brochure** | 푸터 · Contact | 클릭 | – | PDF 내려받기 |

추가한 것은 접근성 최소선뿐이다: 키보드 메뉴·ESC, 포커스 링, 대화상자 포커스 가둠·복귀, 연락처 목록 상자 키보드, 캐러셀 ←→, 오류 문구 연결(`aria-describedby`), 본문 바로가기, `prefers-reduced-motion`.

## 섹션 순서

- **홈**: GNB(가운데) → 전면 프로젝트 패널(제목 · 좋아요) → 캐러셀 → 보기 전환 → 푸터
- **상세**: 대표 이미지 + 정보 카드 + 팀 카드 → 개요(80px) → KEYWORD(번호 3개 + 겹친 사진) → 넓은 사진 → MAIN → 넓은·긴 사진 → 고정 단락(왼쪽 제목 고정, 오른쪽 정사각 3장) → SUB PAGE → 긴 사진 → OPTIMIZED UI → 넓은 사진 2 → 아래 이동 막대
- **Glimmer**: GNB(오른쪽) → 큰 글자 3줄(이모지) → 굴러가는 스티커 → 사진 → Management · UX Planning · UX Design · UX Interactive → 끝 문구 · 가로줄 · 스티커 · 지원 단추
- **Gallery**: 3열 정사각 8장 / 상세: 분류·좋아요·공유 → 제목·날짜 → 한·영 문단 → 대표 사진 → 소제목 → 사진 2열
- **Brief**: GNB(왼쪽) → 큰 로고 + 떨어지는 카드 → 소개 → 세 줄(UX PLANNING · UX DESIGN · UX INTERACTIVE) → Our History(연도 카드 9) → Awards → Work and Life(복지 8)
- **Contact**: 지도 + 주소 카드 + Request · Recruit · Brochure 타일

## 문서 높이 (1440×900)

원본은 내부 스크롤러(`.scrollbar__scroller`)라 문서 높이는 900이고 스크롤러 높이로 잰다. 모작은 문서 스크롤.

| 페이지 | 원본 | 모작 | 비율 | 차이 이유 |
|---|---:|---:|---:|---|
| 홈 | 900 (한 화면) | 900 | 100% | |
| 상세 | 13,605 | 12,660 | 93% | |
| Brief | 6,233 | 6,045 | 97% | |
| Glimmer | 7,800 | 6,365 | 82% | 구성원 39 → 20명(카드 줄 수) |

## 사진 (PROTOCOL 5절)

- **104장 = Pinterest 55 + Unsplash 49** (`fetch-stock.mjs`). 출처·핀/사진 주소·검색어·명도는 `credits.json`. 후보 원본 `refs/photo-raw/`(커밋 제외).
- **AI 생성 의심 교체 (2026-10-06 검수 지적)**: Glimmer 사무실·화분 사진(과포화 초록, 잎 형태 뭉개짐)을 시작으로 104장 전부를 같은 기준(과포화 · 매끈한 질감 · 형태 뭉개짐 · 글자 깨짐 · 비현실 조명)으로 다시 보고 49장을 Unsplash 실사로 바꿨다 — office 13장 전부, hall 6(02·03·06·07·15·16), desk 9(03·06·07·08·11·13·14·15·16), arch 8(02·03·05·06·07·10·12·19), light 5(10·11·12·13·15), glass 6(01·02·10·12·17·18), still 2(12·18). 파일 이름은 그대로 두고 내용과 `credits.json` 항목만 바꿨다(항목마다 `replaced` 에 원래 이름 → 교체 사진 기록). 상표·로고 글자가 보이는 Unsplash 후보(화장품 병 8장, 노트북 사과 로고, 목업 글자)는 고르지 않았다.
- **프로젝트 대표 12장**: 명도 2~28(교체 후에도 같은 범위)의 어두운 컷(콘크리트 그림자·유리·빛줄기·뒷모습 화보) — 흰 60px 제목이 올라가는 자리. 원본 대표 이미지도 어두운 화보·목업(명도 측정 `refs/states/home-load-*.jpg`).
- **상세 본문 55장**: 건축·빛·유리 정물·책상 위 사물·얼굴 없는 화보.
- **갤러리·Glimmer·Brief 37장**: 캠핑·바다·강당·사무실 — 사람 없는 장면만.
- 거른 것(고르지 않은 것): 상표 글자(LOEWE · Byredo · Aesop · Centella · CADEN · “THE ROW”), 워터마크(office-12 작가 표기), 글자 간판(office-18 “YES”, city-01 편의점 간판), AI 렌더로 보이는 천 사진 대부분, 얼굴이 보이는 컷(beach-03·07·11, fashion2-04·09 등), 신용 기록(credits)이 저장되지 않은 hills·city 컷.
- 사람 얼굴 대신: 구성원 사진·미모지 자리는 Noto Color Emoji 사람 이모지.

## 커밋 전 게이트 — 원본 구조로 남긴 항목

`npx --yes impeccable@latest detect` (25 HTML + site.css + site.js): 처음 약 430건 → **0건**. 설정 파일·주석으로 규칙을 끄지 않았다. 원본 구조 예외로 남긴 항목 없음.

게이트 때문에 원본과 다르게 바꾼 것:
- 빨강 `#ff0000` → `#e00000`(흰 글자 대비), 검정 위 파랑 글자 → `#5c6bff`, 분류 개수 위첨자 바탕 `#dcdcdc`.
- 캐러셀 활성 카드 height 전환 → clip-path 전환(`layout-transition`). GNB width 전환 → translate.
- Glimmer 끝 가로줄: 반복 그라디언트 → 선 요소 9개(`repeating-stripes-gradient`).
- 원본 키프레임 이름 `aniFaceBounce*` → `stickerHop*`(움직임 값은 같고, 이징은 ease-in-out 이라 탄성 이징이 아닌데 이름 때문에 `bounce-easing` 이 걸렸다).
- 지도의 글자를 SVG 인라인 대신 이미지 파일(`assets/map.svg`)로.
- 대화상자 약관 제목 h4/h5 → h3/h4, 상세 본문 제목 h3 → h2(제목 순서).
- 덮개 링크가 있는 카드(바둑판·갤러리·상세 대표)는 상자 바탕색을 빼고 사진에만 둠.
