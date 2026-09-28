# SOURCES — 2026-W40

이 주차 리서치의 **출처 원장**.

- **주차** 2026-W40 · **작성** 2026-09-28 · **원장 버전** v1
- 노트: [voice](notes/voice.md) · [icons](notes/icons.md) · [type](notes/type.md) · [motion](notes/motion.md)

| 노트 | 버전 | 조사일 | 재조사 시점 |
|---|---|---|---|
| [voice.md](notes/voice.md) — 말투 | v2 | 2026-09-28 | 한국어 모작 대상이 바뀔 때 |
| [icons.md](notes/icons.md) — 아이콘 | v2 | 2026-09-28 | 3개월 (2026-12) |
| [type.md](notes/type.md) — 폰트 | v2 | 2026-09-28 | CDN 404 나면 즉시 |
| [motion.md](notes/motion.md) — 모션 | v2 | 2026-09-28 | **W41 — npm 비교가 이번 주에 깨졌다** |

---

## 자동 수집

원재료 [raw.md](raw.md). `scripts/collect-research.mjs`를 **로컬에서** 2026-09-28 02:22 UTC에 실행. 실패 소스 0개.

월요일 Actions 는 돌지 않았다. 원인과 조치:

| 확인 | 결과 |
|---|---|
| `gh run list -w monday-research.yml` | `HTTP 404: workflow not found on the default branch` |
| `gh api repos/.../actions/workflows` | `total_count: 0` |
| `git check-ignore -v .github/workflows/monday-research.yml` | `.gitignore:8` 에 걸림 |

`.github/workflows/` 가 "토큰에 workflow 스코프가 붙기 전까지 임시 제외"로 빠져 있다.
**`gh auth refresh -h github.com -s workflow` 를 사람이 실행해야 풀린다**(브라우저 인증).

| 소스 | 경로 | 비고 |
|---|---|---|
| Smashing Magazine | `smashingmagazine.com/feed/` | 정상 |
| CSS-Tricks | `css-tricks.com/feed/` | 정상. 최신 글이 08-31. 한 달 가까이 새 글 없음 |
| Frontend Focus | `frontendfoc.us/rss` | 정상. blurb 가 메일 HTML |
| web.dev | `web.dev/static/blog/feed.xml` | 정상. 최신이 05-29. 4개월 멈춤 |
| npm | `api.npmjs.org/downloads/point/last-week` | 17개. **W39 기준값 오염** — 아래 |
| GitHub | `api.github.com/search/repositories` | 6개 토픽 |
| Hacker News | `hn.algolia.com/api/v1/search` | 최근 8일, 20점 이상 |

### npm 기준값 오염 (확인됨)

`api.npmjs.org/downloads/range/2026-09-07:2026-09-27/three` · `/lenis` 둘 다
**09-07 · 09-08 · 09-15 · 09-17 · 09-27 이 0.** W39 수집 기간(09-13~19)에 평일 이틀이 빠졌다.
대조군 `react` `lodash` `express` 도 받아봤다(W40 각 2억·1.96억·1.57억). 자세한 건 [motion.md](notes/motion.md).

→ **`collect-research.mjs` 가 0인 날을 검사하지 않는다.** 다음 수정 대상.

---

## 어워드 수상작 수집

`scripts/collect-targets.mjs 18 20` — 2026-09-28 실행. 헤드리스 Chrome 1440×900, CDP 직접.

| 목록 | URL | 응답 | 비고 |
|---|---|---:|---|
| Awwwards SOTD | `awwwards.com/websites/sites_of_the_day/` | 200 | 31건 |
| Awwwards SOTM | `awwwards.com/websites/sites_of_the_month/` | 200 | 31건 |
| **Awwwards 한국** | `awwwards.com/websites/South%20Korea/` | 200 | 31건. **이번 주 새로 찾은 경로** |

### 한국 목록 찾은 과정

| 시도 | 결과 |
|---|---|
| `/websites/south-korea/` | 200 이지만 **텍스트 검색 결과**(`south` 가 든 사이트명). 쓸모없음 |
| `/websites/sites_of_the_day/?country=south-korea` | 200, 사이트 링크 0 |
| `/websites/?country=KR` | 302 |
| `/websites/South%20Korea/` | 200, **국가 필터**. 사이드바 링크에서 경로를 찾았다 |

한국 목록 31건 중 **노미니 11건**이 섞여 있다. 노미니는 수상이 아니다(PROTOCOL 2절).
상세 페이지 본문의 `Honorable Mention - <날짜>` / `Nominee - <날짜>` 로 가른다. 스크립트에 넣었다.
**한국 목록에 SOTD 는 0건.** 전부 Honorable Mention 이다.

### 한계

- 실측은 **홈 1페이지**. 하위 페이지 기능은 안 셌다
- 한국 목록은 첫 화면 31건만. 더 오래된 수상작(무한 스크롤 뒤)은 안 봤다
- 언어 판정은 홈 화면 글자 중 한글 비율. 언어 전환이 있는 사이트는 첫 로드 언어로 잡힌다
