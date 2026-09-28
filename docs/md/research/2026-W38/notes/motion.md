# CSS / HTML 모션 라이브러리

- **버전** v1 · **조사일** 2026-09-18
- **방법** npm 주간 다운로드 실측 + 이번 주 raw.md의 CSS 신규 기능 교차
- **출처** [sources.md](../sources.md#아이콘--모션-라이브러리)

---

## 실측

| 라이브러리 | 주간 다운로드 | 성격 |
|---|---:|---|
| **framer-motion** | **34,335,473** | 구 이름. 여전히 이쪽이 더 많이 받힌다 |
| **motion** | **15,428,930** | 새 이름. 같은 프로젝트. 바닐라 JS도 지원 |
| @react-spring/web | 3,892,727 | 물리 기반(스프링). 값 보간이 다름 |
| **gsap** | 3,488,380 | 타임라인의 표준. 2024년부터 전 기능 무료 |
| @lottiefiles/dotlottie-web | 1,214,662 | AE에서 뽑은 벡터 애니메이션 재생 |
| @formkit/auto-animate | 1,138,381 | 한 줄로 리스트 추가/삭제 애니메이션 |
| **lenis** | 1,100,438 | 스무스 스크롤 표준 |
| @rive-app/canvas | 826,954 | 상태기계가 있는 인터랙티브 애니메이션 |
| animejs | 767,490 | 가벼운 범용 |
| react-spring | 763,891 | 구 패키지 |
| aos | 196,215 | 스크롤 등장. 사실상 레거시 |
| split-type | 52,020 | 텍스트를 글자/단어로 쪼갬. GSAP와 짝 |
| scrollreveal | 7,116 | 죽음 |
| theatre | 316 | 죽음 |

**세대교체가 확인된다.** `lenis` 110만 vs `locomotive-scroll` 1.1만 — **100배 차이**. AOS·ScrollReveal은 CSS가 흡수했다.

---

## 이번 주의 진짜 뉴스 — CSS가 라이브러리를 먹는 중

raw.md에서 한 달 안에 네 개가 동시에 나왔다.

### 1. `animation-trigger` (CSS-Tricks, 2026-08-26)
애니메이션 시작을 **특정 트리거까지 지연**시킨다. 지금까지 `IntersectionObserver` + JS로 하던 걸 CSS 선언으로 끝낸다.

### 2. 스크롤 구동 애니메이션 — 이미 쓸 수 있다
```css
@keyframes reveal { from { opacity:0; translate:0 24px } to { opacity:1; translate:0 0 } }
.card {
  animation: reveal linear both;
  animation-timeline: view();      /* 요소가 뷰포트를 지나는 동안 */
  animation-range: entry 0% cover 40%;
}
@media (prefers-reduced-motion:reduce){ .card{ animation:none } }
```
**이거 하나로 AOS·ScrollReveal이 전부 대체된다.** JS 0줄.

### 3. `random()` (CSS-Tricks, 2026-08-31)
곧 표준. 폴리필이 나왔다. CSS만으로 제너러티브 레이아웃이 가능해진다.

### 4. SMIL 재조명 (Smashing, 2026-08-20)
`<img>` 태그 안에서도 도는 SVG 애니메이션. JS 없이 SVG 전체를 움직인다.

---

## 언제 무엇을 쓰나

| 상황 | 답 |
|---|---|
| 스크롤 등장, 패럴랙스 | **CSS `animation-timeline: view()`**. 라이브러리 안 쓴다 |
| 스크롤 감속(관성) | **lenis**. 이건 CSS로 안 된다 |
| 복잡한 타임라인, 시퀀스 제어 | **gsap** + ScrollTrigger |
| 글자 단위 등장 | **split-type** + CSS 스태거 |
| React 컴포넌트 전환 | **motion**(구 framer-motion) |
| 리스트 추가/삭제 | **@formkit/auto-animate** 한 줄 |
| 디자이너가 만든 벡터 애니메이션 | **lottie** 또는 **rive** |

**이건 판단 근거지 규칙이 아니다.** CSS로 되는 걸 알고도 라이브러리를 고르는 건 괜찮다.
모르고 고르는 것만 문제다. 기술 스택은 자유롭게 쓰고, 왜 골랐는지만 `NOTES.md`에 적는다.

---

## 모작에서 모션 해부하기

SPEC.md 모션 항목에 이걸 채운다.

| 항목 | 어떻게 재나 |
|---|---|
| 트리거 | 로드 / 스크롤 진입 / 호버 / 클릭 |
| duration | 개발자도구 Animations 패널. 보통 200~600ms |
| easing | `cubic-bezier` 값. 들어올 때 ease-out, 나갈 때 ease-in |
| 이동거리 | 8~24px가 흔하다. 길수록 느리게 느껴진다 |
| 스태거 | 요소 간 시차. 40~80ms |

`motiscope`(raw.md §3, ★115)가 **화면 녹화에서 타이밍·이징·스태거를 역산**해준다. 이번 주 새로 발견한 것이고, CLONE 3-2 해부 단계에 바로 쓸 수 있다.

---

## 최소 기준

모션이 있는 WORK는 반드시 지킨다.

```css
@media (prefers-reduced-motion: reduce){
  *, *::before, *::after { animation-duration:.01ms !important; transition-duration:.01ms !important }
}
```

이걸 빠뜨리면 접근성 결함이다. CHECKLIST의 BUILD 판정 항목에 들어 있다.
