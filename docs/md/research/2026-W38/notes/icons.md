# 아이콘 라이브러리

- **버전** v1 · **조사일** 2026-09-18
- **방법** npm registry 주간 다운로드 실측(`api.npmjs.org/downloads/point/last-week`)
- **출처** [sources.md](../sources.md#아이콘--모션-라이브러리)

---

## 판은 이미 끝났다

| 라이브러리 | 주간 다운로드 | 개수 | 라이선스 | 성격 |
|---|---:|---:|---|---|
| **lucide-react** | **74,057,283** | ~1,600 | ISC | Feather 포크. 얇은 선, 24px 그리드, 2px 스트로크 |
| react-icons | 6,415,241 | 수만 | MIT | 여러 세트 묶음. 무겁고 결이 안 맞음 |
| @radix-ui/react-icons | 3,919,670 | ~300 | MIT | 15px 그리드. UI 전용, 작고 정밀 |
| @heroicons/react | 3,046,937 | ~300 | MIT | Tailwind 공식. outline/solid 2종 |
| @phosphor-icons/react | 2,797,489 | ~9,000 | MIT | 굵기 6단계(thin~fill). 표현폭 최대 |
| @tabler/icons-react | 2,274,981 | ~5,900 | MIT | Lucide와 비슷하나 수가 많음 |
| lucide (바닐라) | 906,839 | ~1,600 | ISC | React 없이 쓸 때 |
| @iconify/react | 732,393 | 20만+ | MIT | 온디맨드 로더. 세트를 섞어 쓸 때 |
| bootstrap-icons | 547,368 | ~2,000 | MIT | – |
| material-symbols | 446,892 | ~3,700 | Apache 2.0 | 가변축(FILL/wght/GRAD/opsz) 있음 |
| feather-icons | 147,942 | ~290 | MIT | Lucide의 원본. 사실상 유지보수 종료 |
| remixicon | 130,379 | ~3,000 | Apache 2.0 | – |

**lucide-react가 2위의 11.5배다.** 사실상 표준이 정해졌다고 봐야 한다.

---

## 우리 제약에서의 선택

우리는 단일 HTML이라 npm을 안 쓴다. **CDN으로 되는지가 진짜 기준**이다.

### 바닐라에서 Lucide 쓰기

```html
<script src="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js"></script>
<i data-lucide="arrow-right"></i>
<script>lucide.createIcons()</script>
```

전체 번들이 온다. 아이콘 몇 개만 쓸 거면 **SVG를 직접 박는 게 낫다** — Lucide 사이트에서 복사하면 된다.

### 세트를 섞어야 할 때 — Iconify

```html
<script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
<iconify-icon icon="ph:heart-fill"></iconify-icon>
<iconify-icon icon="lucide:arrow-right"></iconify-icon>
```

20만 개를 온디맨드로 가져온다. 쓰는 것만 네트워크로 받는다. 모작할 때 **원본이 무슨 세트를 썼는지 모를 때** 유용하다.

---

## 모작할 때 아이콘 판별법

원본 아이콘 세트를 맞히면 재현 정확도가 크게 오른다. 순서대로 본다.

1. **스트로크 굵기** — 2px 고정이면 Lucide/Tabler 계열. 가변이면 Phosphor.
2. **모서리 처리** — 둥근 끝(`stroke-linecap: round`)이면 Lucide. 각지면 Radix.
3. **그리드 크기** — 24px 기준이면 Lucide, 15px면 Radix, 20/24 혼용이면 Heroicons.
4. **채움 변형이 있나** — outline/solid 쌍이면 Heroicons, 6단계면 Phosphor.
5. **못 맞히겠으면** Iconify에서 비슷한 걸 검색해 형태를 대조한다.

SPEC.md 타이포 항목 아래에 **아이콘 세트와 크기·굵기**를 같이 적는다.
