# SPEC — 동원그룹 모작 → 누리결그룹

> **어워드 없음 — 사용자 승인 범위** (국내 상업 사이트, 3순위. NHN `2026-W42-clone-01-nhn` 과 같은 범위)

## 출처

- **원본 URL**: https://www.dongwon.com/ (한국어 `/kr` · 영어 `/en`. Next.js 기반, 네이티브 스크롤, 히어로 배경 영상)
- **어워드**: 어워드 없음 — 사용자 승인 범위 (Awwwards South Korea 목록 1쪽에 `Dongwon Group website` 카드가 있으나 수상 라벨이 없다. 수상으로 세지 않는다)
- **어워드 링크**: 어워드 없음 — 사용자 승인 범위
- **수상 연도**: 없음
- **제작사**: 동원그룹 (사이트 제작사는 확인하지 못함)
- **업종**: 식품 · 물류 · 소재 · 금융 계열을 거느린 종합 그룹 기업 사이트
- **모작 날짜**: 2026-10-13 (한국어 모작, 2026-W42 clone-05)
- **화면 한글 비율**: 홈 DOM 텍스트 기준 한글 1,057자 · 영문 332자 → 한글 76%
- **모작 브랜드명**: `누리결그룹` / `NURIGYEOL GROUP` (가상의 종합 그룹). 웹 검색 `"누리결" 그룹 OR 주식회사 OR 기업` — 같은 이름의 회사 없음(누리게임즈 · 누리팜 · 누리텔레콤 등 다른 이름만 나옴). 앞서 `"벼리온"` 도 검색했으나 오리온과 어감이 가까워 쓰지 않았다.

### 대상 선정 근거 (2026-10-13, 무인 모드 상시 승인)

**조건**: 한글 30% 이상 · 내부 화면 5종 이상 · 수상 당시 디자인이 지금도 살아 있음 · 3D/WebGL/렌더 영상 주도 아님 · 일러스트·캐릭터 주도 아님 · `## 제외` 와 `works/` 전부와 겹치지 않음.

**방법**: 1순위는 Awwwards South Korea 목록(`awwwards.com/websites/South Korea/` 1~4쪽)에서 제외 목록·`works/` 와 겹치지 않는 수상작을 모두 뽑아 헤드리스 Chrome 으로 한글 글자 수 · 영문 글자 수 · 내부 링크 수 · canvas · video 를 쟀다. CSS Design Awards 는 최근 WOTD 목록에 한국 사이트가 없었다(웹 검색 확인). iF · Red Dot 은 한국 Websites 수상작 목록을 찾지 못했다(검색 결과에 웹사이트 부문 한국 수상작이 나오지 않음). 1·2순위에서 조건을 맞추는 곳이 없어 3순위로 내려왔다.

| 후보 | 수상 | 한글 | 판정 |
|---|---|---|---|
| Hanwha Aerospace `hanwhaaerospace.com/kor` | Awwwards HM 2024-09-15 (does interactive) | 60% · 링크 48 · canvas 1(2D) · video 0 | 탈락 — 홈 첫 화면이 렌더된 위성·지구 영상(이미지 시퀀스 캔버스, 수상 태그 3D·360)이라 "렌더 영상 주도" 조건에 걸림. 보수적으로 제외 |
| Oksuro `oksuro.com/ko` | Awwwards HM 2024-01-31 | 7% · 링크 140 · canvas 0 | 탈락 — 화면이 영어 위주(AI 이미지 스톡), 한글 30% 미달 |
| Joguman Studio `joguman.com` | Awwwards HM 2025-08-07 | 56% · 링크 36 | 탈락 — 캐릭터 주도 |
| LX Hausys Trendship `lxtrendship.com/ko` | Awwwards HM 2025-08-01 | 측정 불가 | 탈락 — 이 환경에서 접속 차단 페이지(Block Page)만 열림, 실측 불가 |
| Easy Tomorrow `easytomorrow.com/ko` | Awwwards SOTD 2025-07-04 | 100%이나 본문 54자 · 링크 4 | 탈락 — 화면 종류 5종 미달, `noindex` 단일 화면 |
| Synergy Tower `synergytower.co.kr` | Awwwards HM 2024-07-23 | 측정 불가 | 탈락 — 도메인 이름 풀이 실패(`ERR_NAME_NOT_RESOLVED`), 사이트 닫힘 |
| WEEKLY WINE · Black Dog · RayRay lab · Stubborn's Room · ABT | Awwwards HM/SOTD | 한글 0~100%, 링크 1~4 | 탈락 — 단일 화면이거나 영어 위주 |
| **Dongwon Group `dongwon.com`** | 없음 (3순위) | **76% · 링크 72 · video 6 · canvas 1(300×150 기본 크기, 화면에 안 보임)** | **선택** |

**선택 이유**: 한국어 화면에 내부 화면이 5종을 넘는다 — 그룹소개(`/kr/company`, `/kr/company/history`, `/kr/company/management-philosophy`) · 사업분야(`/kr/business` + 계열사 상세 18) · 미디어(`/kr/media`) · 지속가능경영(`/kr/esg`, `/kr/esg/about`, `/kr/esg/ethic`) · 투자정보(`/kr/ir`, `/kr/ir/financial` 등) · 채용(`/kr/recruitment`, `/kr/recruitment/culture`). 히어로 배경은 도심 건물 실사 영상이고 3D 렌더가 아니다. WebGL 컨텍스트는 300×150 하나뿐이며 셰이더 2개는 화면 연출을 이끌지 않는다. 일러스트·캐릭터 없음. `## 제외` 호스트 · `works/` 원본 URL 과 겹치지 않는다.

**위험**: 히어로가 전면 영상이라 영상 자산을 쓸 수 없다. 모작은 영상 대신 정지 사진 + CSS 모션으로 대체해야 한다(build 단계 `omitted` 에 적는다). 어워드가 없어 "수상 당시 디자인" 기준이 없고, 현재 화면이 기준이다.

---

## 캡처 · 실측 (이번 단계 산출물)

- `refs/home` `refs/kr--*` 등 14페이지 전체 화면 · 섹션 캡처 + 모바일 390 (`measure.json`)
- `refs/motion-origin/` 모션 녹화(`motion.json` · `timeline.html` · 프레임 367장)
- `refs/origin/` 원본 실측(`origin.md` · `origin.json` · 셰이더 2개 — 분석용)
- 어워드 페이지 캡처: 3순위라 생략

원본 자산(사진 · 로고 · 영상 · 카피)은 `refs/` 분석용으로만 둔다. 결과물에 쓰지 않는다.

- build 단계 추가 캡처: `refs/sub/refs/kr--*` 10페이지(경영철학 · 연혁 · 미디어 · ESG · 정도경영 · 공시정보 · 재무정보 · 인재상 · 기업 문화), `refs/states/` 원본 상태별 캡처(메가 메뉴 열림 · 사업분야 접기 펼침 · 언어 팝업 · 검색창 · 사업 연결도 모달 · 모바일 메뉴 · 연혁 가로 진행 · ESG 탭)
- 상태 캡처 도구: Playwright MCP 가 다른 세션에 잡혀 있어(`Browser is already in use`) 작업 폴더 안 `tools/states.mjs`(CDP 로 실제 마우스·키 입력)로 대신했다. 같은 도구로 모작 기능도 눌러서 확인했다(`tools/test-*.json`).

---

## 사이트 구조 (원본 · 재현 · 줄인 것)

대메뉴 6개와 하위 구조는 원본 그대로다. 줄인 것은 개수(계열사 18 → 13, 목록 항목 수)뿐이다.

| 원본 페이지 (경로) | 모작 (경로) | 비고 |
|---|---|---|
| 홈 `/kr` | `index.html` | 프리로더 · 키 비주얼 · 여정 · 지속가능 · 사업 분야 · 미디어 · Social · 푸터 |
| 영어 홈 `/en` | `en/` | 홈과 같은 틀, 영문 더미. 영어 하위 페이지는 줄임(아래) |
| 경영철학 `/kr/company/management-philosophy` | `company/` | 원본 `/kr/company` 도 같은 화면 |
| 연혁 `/kr/company/history` | `company/history/` | 시기 탭 6개 + 시기별 가로 진행 |
| 자료실 (메뉴에만 있음, refs 없음) | `company/archive/` | 분류 고르기 + 내려받기. 화면 근거가 메뉴뿐이라 공시정보 목록 틀을 따랐다 |
| 사업분야 `/kr/business` | `business/` | 머리 · 소개 · 4부문 · 수치 8칸 · 점 지도 |
| 계열사 상세 `/kr/business/*` 18개 | `business/<slug>/` 13개 | 같은 틀. 개수만 줄임 |
| 미디어 `/kr/media` | `media/` | 최신 3 · 콘텐츠룸/뉴스룸 탭 · 쪽 나누기 |
| 미디어 글 (원본은 외부 영상·기사) | `media/<id>/` 12개 | 원본 카드는 외부로 나가지만 외부 상표 링크를 쓸 수 없어 안쪽 글 페이지로 이었다 |
| ESG `/kr/esg` (`/kr/esg/about`) | `esg/` | 사진 머리 · 환경/사회/지배구조 고정 탭 · 실적 · 소식 · 보고서 |
| 정도경영 `/kr/esg/ethic` | `esg/ethic/` | 윤리헌장/신고하기 탭. 푸터 `신고하기` → `#report` |
| 지속가능경영 보고서 (메뉴) | `esg/report/` | 연도 고르기 + 요약 모달 |
| 공시정보 `/kr/ir` | `ir/` | 표 · 검색 · 쪽 나누기 |
| 공고 · 보고서 (메뉴) | `ir/notice/` · `ir/reports/` | 공시정보와 같은 표 틀 |
| 재무정보 `/kr/ir/financial` | `ir/financial/` | 탭 4개 · 막대 그래프 · 표 · 내려받기 |
| 인재상 `/kr/recruitment` | `recruitment/` | 4행 |
| 기업 문화 `/kr/recruitment/culture` | `recruitment/culture/` | 인사/교육/지원 탭 |
| 채용 사이트 (외부) | `recruitment/jobs/` | **원본에 없는** 안쪽 페이지. 외부 채용 사이트 링크를 죽은 링크로 둘 수 없어 공고 목록 + 직군 고르기로 대신했다 |
| 푸터: 이용약관 · 개인정보처리방침 · 이메일무단수집거부 · 사이트맵 · 공지사항 · 고객문의 · 답변확인 · 퇴직자 증명서 발급 · 방문 예약 신청 | `policy/*` · `sitemap/` · `notice/` · `contact/` · `contact/check/` · `certificate/` · `visit/` | 문서 3 · 목록 1 · 사이트맵 1 · 폼 4 |
| 검색창 결과 | `search/` | 페이지 색인 JSON 으로 걸러 보여 준다 |

모두 52페이지. `node build.mjs` 한 번으로 다시 만든다. 상대 경로 + `index.html` 이라 `file://` 로도 이어진다.

### 줄인 것 · 바꾼 것 (omitted)

| 원본 | 모작 | 이유 |
|---|---|---|
| 키 비주얼 배경 영상 6개(문구가 영상 안에 있음) | 사진 4장 교차(opacity 1s ease) + HTML 문구 | 영상 자산을 쓸 수 없다. 장면 전환만 남겼다 |
| CF 영상 확대 재생(`section.scale-up-video`) | 정지 사진 모달 | 같은 이유 |
| 사업 연결도 모달 안 아이소메트릭 그림 | 직접 그린 상자·선 도식 | 원본 일러스트를 쓸 수 없고, 스톡 일러스트로 흉내 내지 않는다 |
| 유리 블롭 3D 렌더 그림 | 유리구슬 사진을 둥근 모양으로 잘라 씀 | 3D 렌더를 다시 만들지 않는다(규격 §2) |
| 계열사 18개 | 13개 | 개수만 줄임 |
| 계열사 상세 `회사 바로가기`(외부) | `사업분야 목록` 단추 | 가상 회사의 외부 누리집이 없다 |
| YouTube · Instagram 큰 링크 | `Video` · `Gallery` → 미디어 탭 | 실존 상표를 쓰지 않는다 |
| 패밀리 사이트 외부 링크 | 계열사 상세로 | 같은 이유 |
| 영어 사이트 하위 페이지 | 영어 홈만 | 한국어 모작이 대상이다. 영어 홈의 메뉴는 한국어 하위 페이지로 간다 |
| 공시 행 클릭 → 외부 공시 시스템 | 행 클릭 없음 | 외부 기관 링크를 쓸 수 없다 |
| WebGL 컨텍스트 300×150(화면에 안 보임) | 없음 | 화면에 그리는 것이 없다 |
| 폰트 Isamanru · Suit | Chakra Petch(라틴·숫자) + Pretendard(한글) | 원본 폰트 파일을 쓰지 않는다. 각진 숫자 인상은 Chakra Petch, 한글 고딕은 Pretendard |

---

## 그리드 실측표 (1440 × 900 기준)

원본 값은 `measure.json` · `refs/sub/measure.json` · `refs/origin/origin.md` · `tools/origin-*.json` 실행 결과(`refs/states/`)에서 잰 것이다. 모작 값은 `refs/origin-mine/origin.md` 와 같은 도구로 잰 것이다.

| 항목 | 원본 | 모작 |
|---|---|---|
| 헤더 높이 | 120px (모바일 62px) | 120px (≤1024 에서 62px) |
| 로고 | x 50 | x 50 (`3.47vw`) |
| 대메뉴 x | 256 · 434 · 612 · 776 · 982 · 1160 | 같음 (`17.78vw` 뒤 `12.36/12.36/11.39/14.31/12.36vw` 칸) |
| 메가 메뉴 | 헤더 아래 흰 판, 열린 높이 600px, 칸이 대메뉴 x 에 맞춤 | 같음 |
| 글 왼쪽 여백 | 30px | 30px (`clamp(16px, 2.083vw, 30px)`) |
| 사진 바깥 여백 · 모서리 | 12px · 10px | 12px · 10px |
| 문서 높이(홈) | 8178 (`measure.json`; `origin.md` 실측 시점 7516) | 7987 (8178 대비 −2.3%) |
| 홈 섹션 | kv 900 · journey 900 · answering 1518(+인포그래픽) · business 1866 · media · social | kv 900 · journey 900 · answer 1767 · biz 2431 · media 1231 · social 396 — 순서·개수 같음 |
| 사업 행 | 글 칸 531 + 사진 897×348 | 글 칸 36.9% + 사진 1fr, 최소 높이 348 |
| 미디어 카드 | 2열 698×392, 간격 20 | 같음 |
| 하위 페이지 머리 | 오른쪽 칸 x 1131, 폭 309, 높이 998, 왼쪽 세로 괘선 | `21.47vw`, `min-height 998px`, 괘선 |
| 머리 글 위치 | 작은 제목 y 281 · 큰 제목 105px | 작은 제목 y≈296 · 큰 제목 105px |
| 계열사 수치 칸 | 2열, 칸 높이 384 | 2열, `clamp(220px, 26.7vw, 384px)` |
| 브레이크포인트 | 390 캡처에서 버거 메뉴(정확한 값은 확인 못 함) | 1024 · 768 · 480 |

## 서체

| 쓰임 | 원본 (크기/굵기/행간/자간) | 모작 |
|---|---|---|
| 큰 숫자 | Isamanru 200/300/200px | Chakra Petch 200/400 |
| 섹션 제목(사업 분야 · 미디어) | Isamanru 120/300/165.6px | Pretendard 120/600/1.38 |
| 하위 머리 제목 | Isamanru 105/300/139.65px/−1.5px | Pretendard 105/500/1.33/−1.5px |
| Social 링크 | Isamanru 80/300 | Chakra Petch 80 |
| 부문 제목 | Isamanru 54/300/64.8px | Pretendard 54/600/1.2 |
| 부제 | Suit 40/500/63.2px | Pretendard 40/500/1.58 |
| 여정 머리말 | Suit 28/500/47.6px #0065bd | Pretendard 28/500/1.7 |
| 하위 머리 작은 제목 | Suit 22.5/700, 자간 11.25px(0.5em) | Pretendard 22.5/700, 자간 0.5em |
| 하위 머리 설명 | Suit 25.5/700/40.8px, 자간 12.75px(0.5em) | Pretendard 25.5/700/1.6, 자간 0.5em |
| 본문 | Suit 21/500/33.6px | Pretendard 21/500/1.6 |
| 대메뉴 | Suit 16/700/25.6px | Pretendard 16/700/1.6 |
| 메가 메뉴 항목 | Suit 20/700/32px, rgba(17,26,33,.376) | 같음 |
| 둥근 단추 | 14/700, 높이 48, 좌우 24, `border-radius 99999px` | 같음 (홈 큰 단추 62px) |

Isamanru 300 은 각진 고딕이라 한글은 Pretendard 로 대신하고 굵기를 한 단계 올렸다(300 → 500~600). 획 굵기 인상을 맞추려는 것이다.

## 색

| 역할 | 원본 | 모작 | 비고 |
|---|---|---|---|
| 강조 파랑 | #0065bd | #0065bd | |
| 글자 | #11141a · #13203c · #111a21 | 같음 | |
| 어두운 바탕 | #11141a (지속가능 섹션) | #11141a | |
| 프리로더 | #1a1f2d | #1a1f2d | |
| 괘선 | #dddddd | #dddddd | |
| 보조 파랑 | #405e80 | #405e80 | |
| 흐린 글자 | #b5b5b5 (비활성 탭 · 날짜) | **#767676** | 대비 2.1:1 → 4.5:1. 접근성 최소선이라 원본과 다르게 고쳤다 |
| 흐린 글자 2 | #939393 | **#6f6f6f** | 3.1:1 → 4.9:1 |
| 흐린 파랑 | #7a95b4 | **#4f6a8a** | 3.1:1 → 5.6:1 |
| 연혁 끝 연도 | #b9d2ea 계열 | #405e80 | 같은 이유 |

## 아이콘

원본은 1.5px 선 아이콘(화살표 · 검색 · 닫기 · 꺾쇠 · 대각 화살표)과 칩 안의 십자 표시다. 모작은 같은 굵기로 직접 그린 SVG(`build.mjs` 의 `I`)다. 로고는 원 안 물결 3줄 + `Nurigyeol` 워드마크로 새로 그렸다.

## 간격

반복 수치: 글 여백 30 · 사진 여백 12 · 섹션 위 여백 260(사업 분야 · 미디어 제목 앞) · 지속가능 섹션 위 120 · 사업 행 위아래 20 · 칩 간격 12 · 미디어 카드 간격 20 · Social 위 200.

## 모션

원본 값은 `refs/motion-origin/motion.json`, 비교는 `refs/motion-compare.html`.

| 무엇 | 원본 | 모작 |
|---|---|---|
| 프리로더 구멍 | 2.6초에 `width 0 → 622.5px` 800ms ease-in-out (x 15, y 220, 높이 150, 둥근 모서리) | 같음 (`box-shadow` 로 둘레를 칠한 구멍) |
| 프리로더 확대 · 사라짐 | 3.575초에 `scale(150)` 1500ms ease-in-out · 바탕 opacity 500ms ease-in-out | 같음 |
| 키 비주얼 | 배경 영상 | 사진 교차 opacity 1000ms ease, 3.2초 간격 (**원본에 없는** 전환 — 영상 대신 장면을 바꾸려고 넣었다) |
| 스크롤 등장 | `translate3d(0,100px,0)` → 0, opacity 0 → 1, 600ms ease | 같음 (`[data-aos]`) |
| 글자 채우기 | `span.letter` 인라인 opacity 0.4 → 1, 스크롤 연동, 전환 없음 | 같음 (`.fill .ch` 인라인 opacity) |
| 괘선 긋기 | `width 0 → 100%` 1000ms ease | 같음 (`.draw`) |
| 더하기 · 빼기 표시 | `scaleY/scaleX 0 → 1` 500ms ease-out, 지연 300ms | 같음 |
| 헤더 숨김 | 내리면 `margin-top 0 → -200px`, 올리면 되돌림, 500ms ease-in-out | 같음 |
| 헤더 바탕 | 어두운 구간 위 투명·흰 글씨 ↔ 흰 바탕·괘선 1px, 500ms ease-in-out (바탕 · 글자 · 괘선 색 · 괘선 굵기) | 같음 |
| 로고 색 | 500ms ease | 같음 |
| 대메뉴 밑줄 | `::after width 0 → 100%`, 2px #0065bd | 같음 |
| 둥근 단추 호버 | 바탕·글자 반전 0.5s ease-in-out, 화살표 `marginPulse` 0.5s ease-in-out 무한 왕복 | 같음 |
| 궤도 그림 | `spin` · `spin-90` · `spin-reverse` 20s linear 무한 | 같음 |
| 메가 메뉴 | 높이 0 → 600, 0.5s ease-in-out | 같음 |

`prefers-reduced-motion` 에서는 프리로더를 끄고 등장·채우기·전환을 모두 끈다.

## 기능 목록 (원본 → 모작, 눌러서 확인한 결과는 REVIEW 에)

| 기능 | 원본 동작 | 모작 |
|---|---|---|
| 메가 메뉴 | 대메뉴 호버로 전체 판 열림 | 호버·포커스로 열림, 바깥 클릭·ESC 로 닫힘, `aria-expanded` |
| 사업분야 접기 | 부문 단추로 계열사 목록 펼침 | 같음 |
| 언어 팝업 | KR/EN 작은 판 | 같음, ESC·바깥 클릭 닫힘 |
| 검색창 | 헤더 아래 판, 태그 4개 | 같음, 제출하면 `search/` 결과 |
| 사업 연결도 모달 | 회색 덮개 + 흰 판 + 아래 둥근 닫기 단추 | 같음, ESC·바깥·닫기 단추 |
| 영상 썸네일 | 클릭하면 영상 확대 | 정지 사진 모달 |
| 미디어 탭 | 콘텐츠룸/뉴스룸 | 같음, 방향키, `#contents`/`#news` |
| 연혁 | 시기 탭 + 가로 진행 + 아래 눈금 | 같음 (`position: sticky` + `translate3d`) |
| ESG 탭 | 환경/사회/지배구조, 스크롤 고정 구간 | 300vh 고정 구간, 스크롤·클릭 모두 |
| 계열사 아코디언 | 사업 부문 등 펼침/접힘 | 같음 |
| 정도경영 | 윤리헌장/신고하기 탭, 왼쪽 번호 고정 | 같음 + 신고 폼 검증 |
| 공시정보 | 검색 · 쪽 나누기 | 같음 |
| 재무정보 | 탭 4개 · 그래프 · 표 · 엑셀 내려받기 | 탭 4개 · SVG 막대(세로축 중간 생략) · 표 · CSV 내려받기 |
| 기업 문화 | 인사/교육/지원 탭 | 같음 |
| 모바일 메뉴 | 버거 → 아코디언 목록 | 같음, 열린 동안 배경 스크롤 잠금 |
| 패밀리 사이트 | 위로 열리는 목록 | 같음 |
| 폼(고객문의 등 4개) | 원본은 외부 · 로그인 | 입력·포커스, 제출 막고 검증 메시지 |

## 섹션 순서 (홈)

1. 프리로더 → 2. 키 비주얼(900) → 3. 여정(900, 좌우 세로 라벨 · 썸네일) → 4. 지속가능(어두운 바탕, 띠 사진 · 큰 제목 · 괘선 · 설명 · 블롭 + 수치 2개) → 5. 사업 분야(제목 · 부제 · 본문 · 단추 · 4부문 행) → 6. 미디어(제목 · 탭 · 더 보기 · 카드 2) → 7. Social → 8. 푸터

## impeccable 예외

| 규칙 | 남긴 곳 | 이유 · 근거 |
|---|---|---|
| `wide-tracking` | 하위 페이지 머리의 작은 제목 · 설명 (17쪽) | 원본 실측 자간 0.5em. `measure.json`(`refs/sub/measure.json`) `/kr/recruitment/ideal-talent` 25.5px/700, 자간 12.75px · `tools/origin-anim.json` 실행 결과 h1 22.5px 자간 11.25px. 원본 머리 글의 인상이 이 넓은 자간에서 나온다 |
| `tiny-text` · `cramped-padding` · `low-contrast` | `refs/motion-origin/timeline.html` · `refs/motion-mine/timeline.html` · `refs/motion-compare.html` 만 | 녹화·비교 도구(`scripts/record-motion.mjs` · `motion-compare.mjs`)가 만든 분석 자료다. 모작 페이지가 아니다. 모작 52페이지에서는 0건 |

## 사진

`assets/photos/` 64장. 출처는 작업 폴더 루트 `credits.json`(사진마다 파일 · 경로 · 원 페이지 · 라이선스 · 검색어 · 명도). `node build.mjs` 가 `assets/photos/credits.json`(fetch-stock 기록)에서 만들고, 출처 없는 사진이 있으면 멈춘다. Unsplash 무료분만 받았다(`--source unsplash`). Pinterest 는 라이선스가 확인되지 않아 이번 지시의 "출처 표기 의무가 있는 사진 금지"에 맞춰 보수적으로 뺐다. 받은 뒤 다른 브랜드 로고·글자가 찍힌 사진(목업 문구가 찍힌 파우치·병, 해운사 로고 컨테이너, 이름이 쓰인 배, 실존 랜드마크 타워)과 3D 렌더로 보이는 사진 1장을 지웠다.

