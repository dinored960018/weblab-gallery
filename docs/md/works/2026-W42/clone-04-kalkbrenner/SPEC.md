# SPEC — Paul Kalkbrenner 공식 사이트 모작 → Kessel Arc

## 출처

- **원본 URL**: https://www.paulkalkbrenner.net/ (영어. 독일 뮤지션 공식 사이트. Webflow + GSAP ScrollTrigger + Lenis + barba, lang=en)
- **어워드**: Awwwards Site of the Day (SOTD) · 2026-09-02 · 점수 7.47/10
- **어워드 링크**: https://www.awwwards.com/sites/paul-kalkbrenner
- **제작사**: HOLOGRAPHIK (Ilja van Eck 병기)
- **업종**: 음악가 공식 사이트 (디스코그래피 · 투어 일정 · 갤러리 · 뉴스)
- **모작 날짜**: 2026-10-12
- **모작 브랜드명(영문)**: Kessel Arc — 가상의 전자음악 프로듀서 공식 사이트

### 대상 선정 근거 (2026-10-12, 무인 모드 상시 승인)

**조건**: 영어 화면 · 내부 링크로 이어지는 화면 5종 이상 · 수상 당시 디자인이 지금도 살아 있음 · 3D/WebGL/렌더 영상 주도 아님 · 일러스트·캐릭터 주도 아님 · `## 제외` 와 `works/**/SPEC.md` 원본 URL 과 겹치지 않음 · 국제 어워드 SOTD/HM 이상.

**방법**:
1. `research/2026-W40/targets.md` 의 영어권 미모작 후보에서 SOTD · HM 6곳을 골랐다.
2. 1440×900 헤드리스 Chrome 으로 홈을 열어 내부 링크 · `canvas` · `video` 를 쟀다(`--dump-dom`, 가상 시간 9초).
3. 어워드 상세 페이지에서 등급 · 날짜를 직접 확인했다. 선정한 곳은 어워드 페이지 캡처를 `refs/award-awwwards.png` 에 남겼다.
4. 원본 호스트를 `## 제외` 와 대조했고, 기존 `works/**/SPEC.md` 원본 URL 20건과도 대조했다. 겹침 없음.

**후보 판정표**

| 후보 | 수상 | 내부 링크 | canvas | video | 판정 |
|---|---|---:|---:|---:|---|
| **Paul Kalkbrenner** (paulkalkbrenner.net) | Awwwards SOTD · 2026-09-02 | 10 (music · tour · about · journey · gallery · news · contact · 법적 2) | 0 | 0 | **선택.** 멀티페이지 10화면, 2D 사진·타이포 주도, 수상 6주 전이라 화면 동일 |
| UNOVE (unoveglobal.com) | Awwwards HM · 2026-01-29 | 32 | 0 | 3 | 탈락. Shopify 스토어 테마 구조라 디자인 고유성이 약하고 영상 비중이 있음 |
| KNOCK (us.knockofficial.com) | Awwwards HM · 2026-02-06 | 45 | 0 | 7 | 탈락. 커머스, 영상 7개 · 폼 285개로 재현 비용 대비 디자인 고유성 낮음 |
| ABT (helloabt.com) | Awwwards HM · 2026-02-19 | 1 | 0 | 1 | 탈락. 원페이지, 멀티페이지 조건 미달 |
| WARM & FUZZY (warmnfuzzy.tv) | Awwwards SOTD · 2026-09-12 | 15 | 17 | 3 | 탈락. canvas 17개 · 캐릭터/일러스트 주도 |
| PENSATORI IRRAZIONALI (pensatori-irrazionali.com) | Awwwards SOTD · 2026-09-20 | 15 | 4 | 10 | 탈락. WebGL · 영상 주도 |

**모작 브랜드명 확인**: "Kessel Arc" — 웹 검색어 `"Kessel Arc" musician OR band OR DJ OR studio` 결과 같은 이름의 실존 상호·인명 없음(Barney Kessel · Kessel Vale 등 성만 겹치는 다른 이름만 나옴). 대안으로 본 `"Halden Voss" electronic music producer` 도 실존 이름 없음, 쓰지 않음. 이름의 "Kessel" 이 Kessel Vale 과 앞 단어가 같아 빌드 단계에서 로고타이프·도메인을 쓰지 않고 가상 상호로만 표기한다.

## 원본 실측 요약

| 항목 | 값 |
|---|---|
| 홈 높이 | 10,324px (1440×900 기준 11.5화면) · 캡처 시 10,535px |
| 홈 섹션 | 12 (히어로 · 사운드 토글+트랙 리스트 · 음반 · 투어 · 갤러리 · 비디오 · 소개 · 뉴스레터 등) |
| 하위 페이지 높이 | about 5,078 · music 5,435 · journey 5,730 · tour 3,774 · news 3,168 · contact 2,721 · gallery 1,813 · privacy 11,302 · imprint 1,682 |
| 라이브러리 | GSAP · ScrollTrigger · Lenis · barba · Webflow · jQuery |
| 스크롤 | 네이티브로 보임(`html overflow: visible`) · Lenis 감지 |
| 이징 | `cubic-bezier(0.625, 0.05, 0, 1)` (메뉴 · 호버 텍스트 시프트) · `cubic-bezier(0.87, 0, 0.13, 1)` |
| 지속시간 | 0.3s 호버 · 0.55s · 1s |
| 키프레임 | `soundFlash` 1s linear · `spin` 12s linear |
| 원본 실측 파일 | `refs/origin/origin.json` · `origin.md` · `refs/motion-origin/motion.json` |

기능 목록 · 그리드 · 서체 · 색 · 간격 · 모션 상세는 build 단계에서 `refs/origin/` 과 `refs/<페이지>/` 를 근거로 채운다.

## 3D · WebGL 대체 방침

원본 홈에 `canvas` · `video` 요소가 없다. 대체할 3D 는 없다. 비디오 아카이브의 썸네일은 정적 이미지 카드로 둔다.

## 이 단계 산출물

- `refs/<페이지>/` — 10페이지 풀 페이지 · 섹션 · 모바일 캡처 (홈 +11장)
- `refs/motion-origin/` — 프레임 346장 · `motion.json` · `timeline.html`
- `refs/origin/` — 실측 `origin.json` · `origin.md` · 섹션 캡처
- `refs/award-awwwards.png` — 어워드 상세 페이지 캡처 (SOTD · Sep 2, 2026 · 7.47)
