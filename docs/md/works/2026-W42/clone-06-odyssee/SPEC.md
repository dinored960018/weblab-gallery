# SPEC — Odyssée 모작 → Sorrel & Vane

## 출처

- **원본 URL**: https://www.odysseeclinic.com.au/
- **어워드**: Awwwards Site of the Day · 2026-10-08 · SOTD (종합 7.38/10, Dev Award 7.36/10)
- **어워드 링크**: https://www.awwwards.com/sites/odyssee
- **제작사**: Nightjar (Next.js · GSAP · Sanity)
- **업종**: 호주 미용의학 클리닉 (시술 · 고민별 안내 · 상담 예약)
- **모작 날짜**: 2026-10-13
- **모작 브랜드명(영문)**: Sorrel & Vane
- **언어**: 영어 (`<html lang="en">`)

### 대상 선정 근거 (2026-10-13, 무인 모드 상시 승인)

**조건**: 영어 화면 · 내부 링크로 이어지는 화면 5종 이상 · 수상 당시 디자인이 지금도 살아 있음 · 3D/WebGL/렌더 영상 주도 아님 · 일러스트 · 캐릭터 주도 아님 · `## 제외` 및 `works/**/SPEC.md` 원본 URL 과 겹치지 않음.

**방법**: Awwwards SOTD 목록(2026-09-19 ~ 10-12)과 CSS Design Awards WOTD 목록에서 제외 목록에 없는 후보를 추리고, 홈 HTML 로 1차 거른 뒤 4곳을 헤드리스 Chrome 으로 열어 내부 링크 · canvas · video 수와 첫 화면을 쟀다. 수상 등급과 날짜는 어워드 페이지에서 직접 확인했다.

| 후보 | 수상 | 내부 링크 | canvas / video | 판정 |
|---|---|---|---|---|
| **Odyssée** (odysseeclinic.com.au) | Awwwards SOTD 2026-10-08 | 6 (홈 · treatments · concerns · about · 약관 2) + 하위 상세 | 0 / 8 | **선택**. 실사 영상(렌더 아님) · 타이포 중심 · 수상 당시와 현재 화면 일치 |
| CoMinVi (cominvi.com.mx) | Awwwards SOTD 2026-09-30 | 10 | 2 / 2 | 탈락. 첫 화면이 CG 렌더 광산 영상 주도 · 스크롤 높이 849px 로 잡혀 실측 불안정 |
| Milledollars (milledollars.fr) | Awwwards SOTD 2026-10-02 | 11 (홈 + works 상세) | 1 / 0 | 탈락. 작업물 상세가 인터랙티브 3D 데모 중심 · 공통 화면 종류가 적음 |
| Pensatori Irrazionali (pensatori-irrazionali.com) | Awwwards SOTD 2026-09-20 | 13 | 4 / 10 | 탈락. WebGL(basis 텍스처) 주도 |

그 밖에 홈 HTML 만 보고 제외한 곳: Colonia Zacamil(링크 0 · WebGL 흔적) · Gil Huybrecht(링크 1) · The Tie-break(단일 화면) · Moto Finance(WebGL 흔적 177). 이미 `works/` 에 있는 LPAS · twks · Realevate · Safeer · Tengile · Boc.Studio · 1367 Studio · NHN, 제외 목록의 EDOLUS · Santioni 는 대조해 뺐다.

**제외 목록 대조**: 원본 호스트 `odysseeclinic.com.au` · 브랜드 `Odyssée` 는 `## 제외` 와 `works/**/SPEC.md` 어디에도 없다.

### 모작 브랜드명 확인

- 검색어: `"Sorrel & Vane" OR "Sorrel and Vane" clinic` → 같은 이름의 실존 상호 없음(비슷한 철자의 Sorell Veterinary Centre · The Sorrells Surgery 는 다른 상호).
- 이전에 검토하고 버린 이름: `Verelle`(Revelle Aesthetics · Vonélle 과 철자 근접), `Auralis Skin`(Auralis Aesthetic & Wellness Clinic 실존).

## 원본 구조 (캡처 기준)

| 화면 | 경로 | 높이 | 섹션 |
|---|---|---|---|
| 홈 | `/` | 8840px | 8 |
| 시술 | `/treatments` | 10706px | 6 |
| 고민별 | `/concerns` | 7793px | 4 |
| 소개 | `/about` | 6422px | 5 |
| 개인정보 | `/privacy-policy` | 3190px | 3 |
| 이용약관 | `/terms-of-use` | 2887px | 3 |

## 실측 자료

- 화면 캡처: `refs/<page>/` (1440 · 768 · 390)
- 모션: `refs/motion-origin/motion.json` · `timeline.html` (애니메이션 16건)
- 스타일 실측: `refs/origin/origin.json` · `origin.md`
- 어워드 화면: `refs/award-awwwards-odyssee.png`

- build 단계 추가 캡처(Playwright, 2026-10-13): `refs/<page>/v-NNNNN.jpg`(스크롤 위치별 뷰포트), `refs/home/10-state-load.jpg`, `refs/home/20-state-menu-open.jpg` · `21-state-menu-open2.jpg`(메뉴 열림 상태)

## 사이트 구조

원본은 Next.js 앱 하나에 화면 6종이다. 시술 · 고민 상세 화면은 없다(2026-10-13 Playwright 로 `/treatments` · `/concerns` 의 링크를 다시 모았다 — 내부 링크는 `/` `/about` `/privacy-policy` `/terms-of-use` 와 같은 화면 안 앵커뿐). select 단계 메모의 "하위 상세"는 확인 결과 없다.

| 화면 | 원본 경로 | 모작 경로 | 원본 높이 | 처리 |
|---|---|---|---:|---|
| 홈 | `/` | `index.html` | 8840 | 재현 |
| 시술 | `/treatments` | `treatments/index.html` | 10706 | 재현 (분야 5 → 5) |
| 고민별 | `/concerns` | `concerns/index.html` | 7793 | 재현 (분야 3 → 3) |
| 소개 | `/about` | `about/index.html` | 6422 | 재현 (의료진 2 → 2) |
| 개인정보 | `/privacy-policy` | `privacy-policy/index.html` | 3190 | 재현 (12개 조 → 10개 조) |
| 이용약관 | `/terms-of-use` | `terms-of-use/index.html` | 2887 | 재현 (10개 조 → 9개 조) |

**내비게이션 계층**

- 홈 히어로 가운데 띠: 로고 · 태그라인 · TREATMENTS · CONCERNS · ABOUT · BOOK CONSULTATION
- 머리막대(전 화면, 홈은 히어로가 끝난 뒤 붙는다): 로고 · MENU · BOOK CONSULTATION
- MENU 패널: 1. Home · 2. Treatments · 3. Concerns · 4. About · 5. Book Consultation + 미리보기 사진 · 설명 + 연락처(남색 상자)
- 하위 화면 왼쪽 아래 고정 목차(현재 구역에 점): 시술 = TREATMENTS · OUR MODALITIES · PRE AND AFTERCARE / 고민별 = OUR PHILOSOPHY · CONCERNS
- 꼬리말: 연락처 · 영업시간 · 현지 시각 · Privacy Policy · Terms of Use

**외부 링크 처리 (원본에 있으나 모작에서 바꾼 것)**

| 원본 | 모작 | 이유 |
|---|---|---|
| BOOK CONSULTATION → 외부 예약 CRM | `mailto:book@sorrelvane.example?subject=Consultation` | 가상 상호라 예약 시스템이 없다. 동작하는 링크로 둔다 |
| Get Directions → 지도 앱 | `about/index.html#visit` (소개 화면 주소 블록) | 실존 주소를 쓰지 않는다 |
| Instagram · Gift Cards | Newsletter · Gift Cards (`mailto:` 두 개) | 실존 상표 링크를 쓰지 않는다 |
| LINKEDIN (의료진) | EMAIL (`mailto:`) | 실존 서비스 프로필을 지어내지 않는다 |
| Site by Nightjar | `Site: in-house` (링크 아님) | 실존 제작사 이름을 쓰지 않는다 |

## 그리드 실측

`refs/origin/origin.json` · `measure.json` · Playwright `getComputedStyle(.grid-layout)` (1440 뷰포트).

| 항목 | 원본 | 모작 |
|---|---|---|
| 컬럼 | 12 × 107.5px | 12 × `1fr` (1440 에서 107.5px) |
| 컬럼 간격 | 10px | 10px |
| 좌우 여백(grid-gutter) | 20px | 20px |
| 내용 폭 | 1400px | 1400px |
| 최대폭 | 없음(전폭) | 없음 |
| 머리막대 높이 | 42px | 42px |
| 홈 히어로 | 1800px (사진 900 × 2) | 1800px |
| 섹션 아래 여백 | 96px · 120px(`lg:mb-30`) · 160/240px(`mb-40/60`) | 같은 값 |
| 브레이크포인트 | 768 (`md`) · 1024 (`lg`) | 768 · 1024 |
| 390px | 1단, 좌우 20px | 1단, 좌우 20px |

## 타이포

원본 서체: `baselGrotesk`(본문 · 라벨) · `psTimes`(제목 · 큰 문장). 파일을 쓰지 않는다.

| 역할 | 원본 | 모작 | 크기 / 행간 / 자간 |
|---|---|---|---|
| 큰 문장 · 히어로 제목 | psTimes 400 | **Newsreader** 400 (Google Fonts) | 48px / 1.0 / normal |
| 중간 문장 · 메뉴 링크 · 이름 | psTimes 400 | Newsreader 400 | 32px / 1.05 / normal |
| 태그라인 · 항목 제목 | psTimes 400 | Newsreader 400 | 18px / 1.1 / 0.02em |
| 본문 | baselGrotesk 400 | **Hanken Grotesk** 400 | 14px / 1.3 / normal |
| 꼬리말 작은 링크 | baselGrotesk 400 | Hanken Grotesk 400 | 13px / 1.3 |
| 라벨(대문자) | baselGrotesk 400 uppercase | Hanken Grotesk 400 uppercase | 12px / 1.0 / 0.03em |

배율: 12 · 14 · 18 · 32 · 48. 대체 서체는 Times 계열 세리프(Newsreader, opsz 축)와 신고딕 계열 그로테스크(Hanken Grotesk)로 골랐다.

## 아이콘

원본은 아이콘 세트를 쓰지 않는다. 쓰는 표식은 둘뿐이다.
- 점(●): 링크 호버 · 현재 목차 표시. 지름 0.4em 원, `::before`. 모작도 CSS 원으로 만든다.
- 목록 가운뎃점(·): 시술 · 고민 목록 앞. 글자로 둔다.

로고: 원본은 세리프 대문자 SVG(104×24, 호버 시 `SS` 가 `rotateX(180deg)`). 모작은 `SORREL&VANE` 세리프 대문자를 직접 짜고, 호버 시 `RR` 을 같은 방식으로 뒤집는다.

## 컬러

| 역할 | 원본 hex | 모작 | 근거 |
|---|---|---|---|
| 바탕 | `#fffcf8` | `#fffcf8` | measure colors 1위(면적 17,003,363) |
| 전경(본문 · 제목) | `#1e305e` | `#1e305e` | typo color |
| 어두운 면 | `#28292a` | `#28292a` | measure colors 3위 |
| 프리로더 | `#a79f9c` | `#7b7370` | Playwright `bg-pale-grey` computed. 흰 글자 대비 2.6:1 → 4.6:1 로 어둡게 고쳤다(접근성 최소선, 원본보다 어둡다) |
| 사진 위 글자 | `#ffffff` | `#ffffff` | typo color |
| 흐린 글자 | `#1e305e` 50% | `rgb(30 48 94 / .7)` | about typo(oklab … / 0.5). 대비 3.8:1 → 5.2:1 맞추려고 .5 → .7 |
| 비활성 항목 | 불투명도 0.1(WHY) · 0.3(아코디언) · 0.35(영업시간) · 0.45(꼬리말 링크) | 사진 0.1, **글자는 0.7** | 모션 기록 article opacity. 원본 값 그대로면 글자 대비 1.2~2.5:1 이라 글자만 0.7(≈5.2:1)로 올렸다. WHY 는 사진만 0.1 로 흐려 원본 인상을 남긴다. 오늘 요일은 굵기 500 으로 구분(원본에 없는 굵기 — 불투명도 차이가 줄어서) |
| 영업중 점 | 초록 | `#5ac24a` | 꼬리말 캡처 |
| 메뉴 연락처 상자 | `#1e305e` | `#1e305e` | 메뉴 열림 캡처 |

대비: `#1e305e` on `#fffcf8` ≈ 12:1. 사진 위 흰 글자 자리에는 어두운 막(20%)을 깔고, 사진 섹션 바탕을 `#28292a` 한 겹으로 칠해 사진이 늦게 떠도 흰 글자가 어두운 바탕 위에 있게 했다(원본에 없는 막 — 스톡 사진 명도가 원본 영상보다 밝아서).

## 간격

반복 수치: 10(컬럼 간격) · 20(좌우 여백) · 28(`gap-y-7`) · 40(`pt-10`) · 96 · 120 · 160 · 240. 모작은 같은 값을 CSS 변수로 쓴다.

## 모션

근거: `refs/motion-origin/motion.json`(애니메이션 16건 · 인라인 스타일 210건), `refs/origin/origin.md`(전환 빈도), 로드 프레임(`load-01553` · `load-02360` · `load-03208` · `load-04083`).

| 무엇 | 트리거 | 지속 | 이징 | 원본 근거 | 모작 |
|---|---|---|---|---|---|
| 프리로더 막 사라짐 | 로드 | 약 1.4s 머문 뒤 1000ms | `cubic-bezier(0.4,0,0.2,1)` | 1553ms 막 · 2360ms 반투명 · 3208ms 사라짐, `1s` ×3 | 같은 값 |
| 히어로 메뉴 4개 나타남 | 프리로더 뒤 | 500ms, 100ms 간격 | `cubic-bezier(0,0,0.2,1)` | 2360ms 흐릿 → 3208ms 선명 | 같은 값 |
| 사진 나타남(불러온 뒤) | 이미지 load | 500ms | `cubic-bezier(0,0,0.2,1)` | CSSTransition `img.opacity-0` ×8 | 같은 값 |
| 블록 등장 | 화면 진입 | 약 600ms | `cubic-bezier(0.16,1,0.3,1)` | 인라인 `translate(0,10px)` opacity 0 → 0 / 1, 스크롤 단계 14%→26% | `translateY(10px)` + opacity, 600ms |
| 큰 문장 단어별 밝아짐 | 스크롤 연동 | 스크롤 비례 | 선형 | 단어 div opacity 0→1 이 40ms 간격으로 끝남, 정지 캡처에서 부분 상태 유지 | 단어 span opacity 를 스크롤 진행률로 |
| 사진 패럴랙스 | 스크롤 연동 | — | 선형 | `div.h-full.lg:h-[110%]` translate(0,-8%) ↔ 0 | 같은 값 |
| WHY 항목 전환 | 자동 넘김 · 호버 · 클릭 · 키보드 | 300ms | `cubic-bezier(0.16,1,0.3,1)` | article opacity 1↔0.1, 설명 p 0↔1 | 같은 값, 6s 마다 넘김 |
| WHY 진행 막대 | 자동 넘김 | 항목당 6s | 선형 | `div.h-full.bg-current` scaleX | 같은 방식 |
| 하위 히어로 흐림 | 스크롤 연동 | — | — | treatments 0 · 800 · 1600 캡처에서 블러 증가 | `filter: blur(0→20px)` |
| 글자 한 자씩(BESPOKE 류) | 스크롤 연동 | — | — | home 3200 · 5600 캡처 `BES` 부분 노출 | 글자 span opacity |
| 점 호버 | 호버 | 300ms | `cubic-bezier(0.4,0,0.2,1)` | `.dot-hover:hover::before` opacity · scale | 같은 값 |
| 밑줄 호버 | 호버 | 500ms | `cubic-bezier(0.4,0,0.2,1)` | `.link-underline:hover` background-size 0→100% 1px | 같은 값 |
| 사진 링크 호버 | 호버 | 500ms | ease | `group-hover:saturate-100` | 남색 막 걷힘 + 채도 복귀 |
| 메뉴 패널 | 클릭 | 500ms, 링크 60ms 간격 | `cubic-bezier(0.16,1,0.3,1)` | 메뉴 캡처 2장(1.2s 시점 링크 미표시 → 2.7s 표시) | 같은 값 |
| 대기 화면 | 무입력 | 1000ms | ease | `z-[200] transition-opacity duration-1000` | 60s 무입력 후 표시, 클릭 · 키 · 스크롤로 닫힘 |
| 커서 따라다니는 라벨 | 마우스 이동 | 즉시 | — | `z-cursor` · `p.dot.fixed` | 꼬리말 아래 사진 위에서만 |

옮기지 못한 것 / 바꾼 것:
- **영상 8개 → 정지 사진.** 원본 히어로 · 섹션은 촬영 영상이다. 원본 영상을 쓰지 않고, 출처 표기 의무 없는 스톡 영상을 받을 도구가 없어 같은 자리에 같은 무드의 정지 사진을 둔다.
- **Lenis 관성 스크롤 → 생략.** 네이티브 스크롤로 둔다(origin.md "네이티브로 보인다").
- **WHY 자동 넘김 주기**: 헤드리스에서 rAF 가 느려져 진행 막대가 멈춰 재지 못했다. 6s 로 둔다(원본 실측값 아님).
- **대기 화면 대기 시간**: 재지 못했다. 60s 로 둔다.

## 기능 목록

| 기능 | 원본 동작 | 모작 |
|---|---|---|
| 메뉴 패널 | MENU 클릭 → 오른쪽 3칸 패널, 배경 흐림. CLOSE 로 닫힘. 링크 호버 시 미리보기 사진 · 설명 바뀜 | 같음 + ESC · 바깥 클릭으로 닫힘, 포커스 가둠, `aria-expanded`, 배경 스크롤 잠금 |
| WHY 4항목 (탭 성격) | 자동 넘김, 현재 항목만 진하고 설명 보임, 진행 막대 · `n : 4` | `role="tablist"` · 화살표 키 · 호버 · 클릭 · `aria-selected` |
| 스크롤 아코디언 (시술 5 · 고민 3) | 오른쪽 사진이 보이는 항목이 펼쳐짐 | 같음 + 제목 버튼 클릭 시 해당 사진으로 스크롤, `aria-expanded` |
| 하위 화면 목차 | 왼쪽 아래 고정, 현재 구역에 점 | 같음, `aria-current` |
| 꼬리말 영업시간 | 오늘 요일 진하게 | 같음 |
| 꼬리말 시각 | 현지 시각 매분 갱신 + 초록 점 | 같음(브라우저 시각) |
| 커서 라벨 | 마지막 사진 위에서 라벨이 커서를 따라감 | 같은 동작 |
| 대기 화면 | 일정 시간 무입력 시 흐린 사진 막 | 같음 |
| 폼 | 없음 | 없음 |

## 섹션 순서

**홈** — ① 히어로(사진 2장 + 가운데 고정 띠) ② 소개 문장(48px, 단어 스크럽) ③ WHY 4항목 ④ 사진 2분할 + 글자 노출 ⑤ 철학 문장(32px) ⑥ Method 큰 사진 + 고정 작은 사진 + 제목 ⑦ 전폭 사진 + 글자 노출 ⑧ 마무리 문장(32px) ⑨ OUR APPROACH + 사진 링크 2 ⑩ 꼬리말 ⑪ 꼬리말 아래 전체 화면 사진(예약 링크)

**시술** — ① 히어로(전폭 사진 고정 + 좌우로 갈린 제목 + 32px 문단 + 라벨) ② 분야 5개 스크롤 아코디언 + 사진 5 ③ 전폭 사진 + 사전 · 사후 관리 문장 ④ YOUR JOURNEY 제목 + 사진 2 + 라벨 3 ⑤ 마무리 문장 + LEARN MORE ⑥ 꼬리말

**고민별** — ① 히어로(고정 제목 + 흐림 사진 + 32px 문단) ② 고민 3개 스크롤 아코디언 + 사진 3 ③ SCIENCE-LED 제목 + 사진 2 + 라벨 3 ④ 마무리 문장 + LEARN MORE ⑤ 꼬리말

**소개** — ① 히어로(전폭 사진 + 좌우 제목 + 작은 사진 + 라벨) ② ABOUT 문장 + 주소 ③ 의료진 사진 + 제목 ④ 의료진 2명 ⑤ 예약 안내 + 사진 링크 2 ⑥ 꼬리말

**개인정보 · 이용약관** — ① 가운데 48px 제목 ② 4칸 폭 본문 ③ 꼬리말

## 원본에 없는 것 (넣은 이유)

- 사진 위 어두운 막: 스톡 사진이 원본 영상보다 밝아 흰 글자 대비를 못 맞춰서.
- 메뉴 ESC · 바깥 클릭 닫기, 포커스 가둠: 접근성 최소선(PROTOCOL 4-4).
- 건너뛰기 링크(Skip to content): 키보드 접근.
- `prefers-reduced-motion`: 스크럽 · 패럴랙스 · 흐림 · 자동 넘김을 끄고 최종 상태로 보인다.

## 줄인 것 (omitted)

- 영상 8개 → 정지 사진 (위 모션 절).
- Lenis 관성 스크롤.
- 개인정보 12개 조 → 10개 조, 이용약관 10개 조 → 9개 조 (개수만).
- 외부 예약 CRM · 지도 · Instagram · LinkedIn · 제작사 링크 → 위 표대로 대체.

## impeccable 예외

설정 파일로 규칙을 끄지 않았다. 게이트 기록: `refs/detect-site.txt`(사이트 HTML 6 + `src/site.css`), `refs/detect-final.txt`(폴더 전체).

처음 폴더 전체 712건 → 고친 것:
- `low-contrast` 27 → 0: 꼬리말 링크 0.45 · 영업시간 0.35 · WHY 비활성 0.1 · 흐린 글자 0.6 → 글자 0.7, 프리로더 `#a79f9c` → `#7b7370`, 사진 위 흰 글자가 놓인 섹션에 어두운 바탕 한 겹(`--dark`).
- `tight-leading` 7 → 0: `.t18` 행간 1.1 → 1.3(원본 19.8/18 = 1.1 — 18px 한두 줄이라 화면 차이는 줄 높이 3.6px), 소개 히어로 캡션 1.25 → 1.3.
- `skipped-heading` 2 → 0: 시술 · 고민 아코디언 위 고정 문구를 `h2` 로.

남은 것 — 사이트 13건, 전부 원본 구조:

| 규칙 | 수 | 위치 | 근거 |
|---|---:|---|---|
| `cream-palette` | 6 | 전 화면 `body` 바탕 `#fffcf8` | 원본 바탕 실측값. `measure.json` 홈 colors 1위 `#fffcf8` 면적 17,003,363 · 전 화면 colors 1위가 같은 값. 바꾸면 원본 색이 아니다 |
| `cramped-padding` | 7 | 홈 `.hero` · `.split` · `.wide`, 시술 `.sh` · `.wide`, 고민 `.sh`, 소개 `.ah` | 원본의 전폭 사진 · 영상 섹션 구조. `measure.json` 해당 섹션 `padT 0 padB 0`(홈 `section.bg-theme-bg` 0/0 · `section.relative.min-h-svh` 0/0 · `section.relative.min-h-[110svh]` 0/0, 시술 · 고민 · 소개 히어로 0/0), 화면 `refs/home/v-00800.jpg` · `v-03200.jpg` · `v-05600.jpg` · `refs/treatments/v-00000.jpg` 에서 사진이 화면 가장자리까지 닿는다. 규칙이 걸린 건 흰 글자 대비를 위해 깐 어두운 바탕 때문이고, 안쪽 여백을 넣으면 전폭 사진이 아니게 된다 |

폴더 전체 실행의 나머지 674건은 사이트가 아니라 **저장소 도구가 만든 보고서 HTML** 이다 — `refs/motion-origin/timeline.html`(tiny-text 323 · cramped-padding 2), `refs/motion-mine/timeline.html`(tiny-text 44~ · cramped-padding 2), `refs/motion-compare.html`(tiny-text 296~ · cramped-padding 2 · low-contrast 1). `scripts/record-motion.mjs` · `scripts/motion-compare.mjs` 의 출력이라 손으로 고치지 않는다(지정 경로 `refs/` 에 두라는 절차를 따랐다). 규칙명: `tiny-text` · `cramped-padding` · `low-contrast`.

## 게이트 결과 (2026-10-13)

| 검사 | 명령 | 결과 |
|---|---|---|
| 전 페이지 | `node scripts/verify-site.mjs http://127.0.0.1:4432` | 20개 경로 · 문제 없음 — 콘솔 에러 0, 가로 넘침 0(1440 · 768 · 390), `href="#"` 0, h1 전부 1개 |
| 디자인 안티패턴 | `npx impeccable detect works/2026-W42/clone-06-odyssee` | 사이트 13건(위 예외 2종) + 도구 보고서 674건 |
| 문서 높이(1440) | Playwright `scrollHeight` | 홈 8735 / 8840(−1%) · 시술 9745 / 10706(−9%) · 고민 6748 / 7793(−13%) · 소개 5708 / 6422(−11%) · 개인정보 2915 / 3190(−9%) · 이용약관 2473 / 2887(−14%) — 전부 ±15% 안 |
| 모션 | `record-motion` → `motion-compare` (`refs/motion-compare.html`) | 빨간 줄(원본에만) 0. CSS 서명 2종 지속 · 이징 일치(500ms `0,0,.2,1` · 300ms `.16,1,.3,1`) |
