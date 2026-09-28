# 폰트 구조

- **버전** v2 · **조사일** 2026-09-28 · 이전 [W38 v1](../../2026-W38/notes/type.md)
- **방법** 이번 주 창작 후보 서체의 CDN 경로를 `curl`로 실제 요청, 응답 코드와 크기 기록
- **출처** [sources.md](../sources.md)

---

## CDN 응답 — 전부 정상

| 서체 | 경로 | 응답 | 크기 |
|---|---|---:|---:|
| Pretendard Variable (dynamic subset) | `cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css` | 200 | 53,513 B |
| **Wanted Sans Variable** (split) | `cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css` | 200 | 46,153 B |
| SUIT Variable | `cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css` | 200 | 131 B |
| IBM Plex Sans KR | Google Fonts `css2` 400·500·600 | 200 | 692 B |
| Gothic A1 | Google Fonts `css2` 400·700 | 200 | 418 B |
| **Instrument Sans** | Google Fonts `css2` wght 400..700 | 200 | 1,136 B |
| **IBM Plex Mono** | Google Fonts `css2` 400·500 | 200 | 442 B |

- SUIT 의 131 B 는 오류가 아니다. `@font-face` 하나만 들어 있고 woff2 를 상대경로로 부른다
- SUIT 는 W38 표의 `sunn-us/SUIT` 경로와 `sun-typeface/SUIT@2` 경로 **둘 다 200**. 저장소 이름이 바뀌어도 jsDelivr 가 따라간다
- Google Fonts 는 UA 없이 요청하면 TTF 를 돌려줘서 CSS 가 작다. 브라우저에서는 woff2 로 바뀐다

## 변동

W38 이후 경로가 바뀌거나 404 난 서체 **없음.** 굵게 표시한 셋이 이번 주 창작 후보다.
