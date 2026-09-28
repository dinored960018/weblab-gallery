# 폰트 구조

- **버전** v1 · **조사일** 2026-09-18
- **방법** 각 CDN URL에 실제로 요청을 보내 응답 코드 확인. 추측 없음.
- **출처** [sources.md](../sources.md#폰트-cdn-확인)

---

## 우리 제약

단일 HTML + 허용 CDN(`cdn.jsdelivr.net/npm`, `cdnjs`, Google Fonts)만 쓴다.
**로컬 폰트 파일을 못 쓴다.** 그래서 "무슨 폰트가 좋은가"보다 **"CDN에서 실제로 오는가"**가 먼저다.

## 실측 결과

| 폰트 | 경로 | 응답 | 가변축 |
|---|---|---:|---|
| **Pretendard** | `cdn.jsdelivr.net/gh/orioncactus/pretendard` | 200 | wght 45~920 |
| **Pretendard Variable** | 〃 `/variable/pretendardvariable.css` | 200 | ○ |
| **SUIT Variable** | `cdn.jsdelivr.net/gh/sunn-us/SUIT` | 200 | ○ |
| **Wanted Sans Variable** | `cdn.jsdelivr.net/gh/wanteddev/wanted-sans` | 200 | ○ |
| **Paperlogy** | `cdn.jsdelivr.net/gh/projectnoonnu/2408-3` | 200 | × (굵기별 파일) |
| Freesentation | `projectnoonnu/2404` | **404** | 경로 바뀜. 쓰지 말 것 |
| IBM Plex Sans KR | Google Fonts | 200 | × |
| Noto Sans KR | Google Fonts | 200 | ○ |
| Gowun Dodum / Song Myung / Hahmlet / Nanum Myeongjo | Google Fonts | 200 | – |
| Black Han Sans | Google Fonts | 200 | – |

### 기본 스택

```css
/* 한글 본문 — 대부분의 경우 이걸로 시작한다 */
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css");
font-family:"Pretendard Variable",Pretendard,-apple-system,system-ui,sans-serif;
```

Pretendard는 **Apple SD Gothic Neo의 대체**로 만들어져서 한글 UI의 기본값처럼 쓰인다. 원본이 애플 계열 산세리프면 대체로 여기서 시작하면 맞는다.

---

## 한글 타이포의 라틴과 다른 점

모작할 때 라틴 감각으로 수치를 잡으면 반드시 틀어진다.

### 1. 측정폭(measure)이 다르다
영문 45~75자가 편한 줄 길이인데, **한글은 25~40자**다. 한 글자가 정보량이 크고 폭이 넓어서다. 영문 기준 `max-width: 65ch`를 그대로 쓰면 한글에선 너무 길다.

### 2. 자간을 좁혀야 한다
한글은 글자마다 폭이 같은 정사각 틀(전각)이라 라틴보다 성기게 보인다.
- 큰 제목: `-0.02em ~ -0.04em` (라틴보다 더 좁힘)
- 본문: `-0.003em ~ 0`
- 작은 글씨: `0`

### 3. 행간을 넓혀야 한다
받침 때문에 세로로 꽉 찬다.
- 제목: `1.2 ~ 1.3` (라틴은 1.0~1.2)
- 본문: `1.6 ~ 1.75` (라틴은 1.5~1.6)

### 4. 굵기 체감이 다르다
같은 700이라도 한글이 더 무겁게 보인다. 라틴 제목이 Bold면 **한글은 600 정도**로 내려야 비슷해 보인다.

### 5. 줄바꿈 규칙
```css
word-break: keep-all;   /* 단어 중간에서 안 끊는다. 한글 필수 */
overflow-wrap: break-word;
```
`keep-all`을 안 주면 어절 중간에서 끊겨 읽기가 나빠진다. **한글 페이지에서 가장 흔한 실수다.**

---

## 타입 스케일

배율을 정하고 거기서만 고른다. 임의의 수치를 섞지 않는다.

| 배율 | 성격 | 본문 16px 기준 |
|---|---|---|
| 1.200 (minor third) | 촘촘함. 대시보드·문서 | 16 · 19 · 23 · 28 · 33 · 40 |
| 1.250 (major third) | 무난함. 기본값 | 16 · 20 · 25 · 31 · 39 · 49 |
| 1.333 (perfect fourth) | 대비 큼. 랜딩 | 16 · 21 · 28 · 38 · 51 · 67 |
| 1.618 (golden) | 극단적. 포스터 | 16 · 26 · 42 · 68 · 110 |

**모작에서는 배율을 먼저 역산한다.** h1을 body로 나눠 몇 단계인지 보면 원본이 쓴 배율이 나온다.

---

## 조합 원칙

**두 종류까지.** 셋을 넘으면 통제가 안 된다.

| 역할 | 무엇을 쓰나 |
|---|---|
| 디스플레이(제목) | 성격이 있는 것. 폭·굵기 대비를 크게 |
| 본문 | 중립적인 것. Pretendard / IBM Plex Sans KR |
| 유틸(수치·라벨) | 고정폭. IBM Plex Mono / JetBrains Mono |

**주의**: 라틴 고정폭 폰트에는 **한글 글리프가 없다.** 한글에 mono를 지정하면 시스템 대체 폰트로 떨어지면서 자간이 벌어져 어색해진다. 숫자·영문 라벨에만 쓰고, 한글 라벨은 본문 폰트로 둔다.

```css
/* 수치만 고정폭, 한글은 본문 폰트 */
.num { font-family:"IBM Plex Mono",ui-monospace,monospace; }
```

### 가변폰트 축

```css
font-variation-settings: "wght" 700, "wdth" 125, "opsz" 32;
```
- `wght` 굵기 — 거의 모든 가변폰트에 있다
- `wdth` 폭 — Archivo, Roboto Flex 등. **넓힌 제목은 인상이 강해서 기억에 남는다**
- `opsz` 광학 크기 — 큰 제목용/본문용 자형이 자동으로 갈린다
