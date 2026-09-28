# 단청 읽기 — 신규 디자인 (모작 아님, 오방색 아카이브 재작업)

2026-09-28. 기획서: [`research/2026-W40/build-concepts.md` §3](../../research/2026-W40/build-concepts.md)

- 산출물: 정적 HTML 7장. 더블클릭(`file://`)으로 열리고 링크가 이어진다(링크는 전부 `…/index.html` 상대 경로)
- 생성: `node build.mjs` — `src/data.mjs`(내용·출처) + `src/svg.mjs`(도해) → 7장. HTML 을 손으로 쓰지 않는다
- 사진 없음. 이미지는 전부 `src/svg.mjs` 에서 좌표를 잡아 그린 SVG 도해

## 왜 다시 만들었나

W39 오방색 아카이브에 받은 지적:

> **"사이트 내 컨텐츠 부족이랑 뭘 전달하고싶은 사이트인지 잘 안와닿음 디자인이랑 같이 손보긴 해야할듯 다른방식으로"**

원인은 색 다섯 장에 방위·계절·안료가 한 줄씩이었고, "빛깔에는 자리가 있다"는 문장이 그 **자리**를 보여 주지 않았던 것.
이번에는 자리가 실제 건물 부재다. 사용자가 고른 방향 A:

> **"오방색은 단청에서 이렇게 쓰인다. 다음에 궁궐 가면 이걸 보라"**

## 페이지 (7) — 페이지마다 전달할 한 줄

| 경로 | 제목 | 한 줄 | 뼈대(KOREAN §2) | 분량 |
|---|---|---|---|---|
| `/` | 처마 밑 한 칸 | 처마 밑 한 칸은 부재 열 개로 나뉘고, 부재마다 칠과 문양이 다르다 | 공간 | 도해 부재 10 · 궁궐에서 볼 5곳 · 숫자 6 |
| `/bujae/` | 부재 | 기둥부터 개판까지 열한 개. 이름·자리·바탕색·문양·궁궐과 절의 차이 | 공간 | 도판 11장, 사실 33개 |
| `/deunggeup/` | 등급 비교 | 같은 창방 하나를 5등급 8종으로 칠해 나란히 놓았다 | 비교·대조(항목별) | 띠 5 · 상세 8종 |
| `/munyang/` | 문양 도감 | 머리초·휘·금문·별화·주의초·마구리 문양 열아홉 | 분류 | 문양 19 |
| `/bit/` | 색 쌓는 순서 | 바탕 닦기에서 들기름칠까지 열다섯 단계. 빛은 옅게→짙게 | 연대기 | 공정 15 · 빛 사다리 4계열 · 안료 39종 |
| `/gunggwol/` | 찾아보기 | 건물 열일곱 곳. 자료에 남은 단청 사실만 | 분류 | 건물 17 |
| `/chulcheo/` | 출처 | 사실마다 가져온 곳 | — | 57건 |

본문의 작은 숫자 배지가 출처 번호다(출처 페이지 앵커로 연결). **사실 문장마다 배지가 있다.**

## 조사 — 가져온 것과 안 가져온 것

- 방법: 원문을 `curl`/`fetch` 로 받아 HTML 을 벗겨 직접 읽었다(요약 도구 결과를 사실로 쓰지 않음). 57건 URL 전부 2026-09-28 에 다시 요청해 200 확인
- 국가유산청 건물 설명은 포털 상세 페이지가 스크립트로 본문을 싣기 때문에, 같은 내용을 주는 국가유산청 공개 API(`SearchKindOpenapiDt.do`)로 받았다
- **자료끼리 어긋나는 곳은 둘 다 적었다** — 궁궐 정전·편전 내부를 국가유산청 기고(김석곤)는 금단청으로, 한국민족문화대백과사전은 2등급(금모로 등)으로 적는다. 등급 페이지 1등급 "어디에"·찾아보기·출처 페이지에 병기
- **건물별 등급은 자료에 그 건물 이름과 함께 적힌 경우만 "기록"** — 종묘 정전·문묘 대성전(가칠단청, 백과사전), 통도사 대웅전(금단청, 국가유산청 기고). 나머지 14곳은 건물 성격에 따른 일반 규칙을 **"규칙상"** 으로 따로 적었다(예: "궁궐 건축 외부는 모로단청" — 백과사전)
- **뺀 것**
  - **얼금단청** — 공식 자료(국가유산청·백과사전·전통문화포털·표준국어대사전)에서 찾지 못했다. 검색에 걸린 건 다음 카페 글뿐. 같은 자리의 **금모로단청**(국가유산포털·백과사전)을 썼다
  - **휘의 백과사전 항목** — 백과사전 "휘"(E0065825)는 피휘(諱)라 무관. 휘·늘휘·인휘·바자휘 정의는 표준국어대사전
  - **먹기화** — 사전에 없어 공정 설명(국가유산진흥원, 단청장 홍점석)만 썼다
  - **초빛** — 표준국어대사전은 "애벌로 바르는 불그레한 채색", 전통문화포털(한석성)은 "처음 칠하는 연한 빛". 화면은 후자(색 계열마다 쓰는 뜻)를 따랐다
  - 근정전·경회루·인정전 등의 **외부 등급을 건물 단위로 적은 자료**는 찾지 못했다 → "규칙상"
  - 장여·창방·평방·공포·개판의 **한자 표기**는 받아 읽은 원문에서 확인하지 못해 넣지 않았다
  - 숭례문 2013 복구 단청 박락 논란(언론 보도)은 공식 자료가 아니라 넣지 않았다

### 출처 표 (전부)

| # | 제목 | 발행 | 쓴 곳 | URL |
|---|---|---|---|---|
| 1 | 단청 | 한국민족문화대백과사전 | 단청 5등급 8종 · 궁궐·사찰 적용 · 영건의궤 안료 · 도화서 화원 인원 | https://encykorea.aks.ac.kr/Article/E0013680 |
| 2 | 단청장 | 한국민족문화대백과사전 | 출초·천초·타분 · 1972년 지정 | https://encykorea.aks.ac.kr/Article/E0067111 |
| 3 | 우리나라 전통건축에서 단청은 왜 하나요 | 국가유산포털 | 단청 종류 · 계풍 · 특수단청 | https://www.heritage.go.kr/heri/html/HtmlPage.do?pg=%2Fcul%2FcultureEasySub01_13.jsp&pageNo=0 |
| 4 | 단청의 다양한 이름과 단청 장인 | 전통문화포털 · 『우리가 정말 알아야 할 우리 단청』(한석성 구술, 2004) | 가칠장·도채장 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3535 |
| 5 | 빛에 따라 기법이 달라진 고려시대의 단청 | 전통문화포털 · 한석성 | 상록하단 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3543 |
| 6 | 다시 칠해진 수덕사 대웅전의 단청 | 전통문화포털 · 한석성 | 1528년 재단청 · 벽화 30여 면 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3544 |
| 7 | 화려한 조선시대의 불사 단청 | 전통문화포털 · 한석성 | 『세종실록』 주의 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3545 |
| 8 | 내·외부가 다른 색조를 한 조선시대의 단청 | 전통문화포털 · 한석성 | 외부 등황색조 · 내부 녹청색조 · 주요 단청색 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3546 |
| 9 | 뇌록과 석간주를 많이 사용하는 단청 | 전통문화포털 · 한석성 | 부재별 가칠색 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3547 |
| 10 | 단일색을 부재면에 칠하는 단색칠하기 | 전통문화포털 · 한석성 | 부재별 단색 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3548 |
| 11 | 안료가 잘 접착되도록 하는 아교포수 | 전통문화포털 · 한석성 | 아교포수 · 바탕칠 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3549 |
| 12 | 줄을 긋는 긋기 단청 | 전통문화포털 · 한석성 | 먹긋기·분긋기 · 마구리 문양 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3551 |
| 13 | 머리초를 하고 중간은 긋기로 처리하는 모로단청 | 전통문화포털 · 한석성 | 모로단청 머리초 위치 · 휘 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3552 |
| 14 | 복잡하고 화려한 금단청 | 전통문화포털 · 한석성 | 금단청 구성 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3553 |
| 15 | 단청에서 빛 칠하는 순서 | 전통문화포털 · 한석성 | 초빛·2빛·3빛 · 5빛 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3554 |
| 16 | 빛넣기 순서 | 전통문화포털 · 한석성 | 녹·청 → 주·석간주 → 황 → 먹선·분선 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3555 |
| 17 | 단청무늬의 핵심인 무늬초 | 전통문화포털 · 한석성 | 머리초 기본 형식 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3558 |
| 18 | 건축부재에 많이 쓰이는 머리초 장식 | 전통문화포털 · 한석성 | 머리초가 들어가는 부재 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3559 |
| 19 | 기둥머리에 그려 넣는 주의초 | 전통문화포털 · 한석성 | 주의초 네 가지 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3560 |
| 20 | 사찰의 머리초 중간에 사용되는 장식화인 별화 | 전통문화포털 · 한석성 | 별화 소재 · 궁실 미사용 | https://www.kculture.or.kr/brd/board/401/L/menu/446?brdType=R&bbIdx=3561 |
| 21 | 다섯가지 색이 빚어내는 환상의 무늬, 한국의 단청 (단청장 홍점석) | 국가유산진흥원 국가유산이야기 | 공정 13단계 · 문양 의미 | https://www.kh.or.kr/brd/board/696/L/menu/314?brdType=R&thisPage=1&bbIdx=110582 |
| 22 | 만물의 형상과 조화를 그린 단청의 아름다움 (김석곤) | 국가유산청 월간 국가유산사랑 | 위계별 등급 · 통도사 대웅전 · 단청장 50년 | https://www.khs.go.kr/cop/bbs/selectBoardArticle.do?nttId=82237&bbsId=BBSMSTR_1008&mn=NS_01_09_01 |
| 23 | 지켜야 할 우리의 전통문양, 단청 (이수예) | 국가유산청 월간 문화재사랑 | 사찰 금단청 · 궁궐 모로 · 서원 긋기 | https://www.khs.go.kr/cop/bbs/selectBoardArticle.do?nttId=5695&bbsId=BBSMSTR_1008&nm=NS_01_10 |
| 24 | 기복과 장엄의 미학, 한국의 단청 (곽동해) | 국가유산청 월간 문화재사랑 | 궁궐 단청 특징 · 사찰 단청 특징 | https://www.cha.go.kr/cop/bbs/selectBoardArticle.do?nttId=5820&bbsId=BBSMSTR_1008&mn=NS_01_09_01 |
| 25 | 조선의 법궁 경복궁 근정전 내부특별관람 운영 (2019-08-07) | 국가유산청 보도자료 | 근정전 천장 칠조룡 | https://khs.go.kr/newsBbz/selectNewsBbzView.do?mn=NS_01_02&newsItemId=155701568&sectionId=b_sec_1 |
| 26 | 단청장 | 디지털대구문화대전(한국학중앙연구원) | 출초·천초·타초·채화 | https://daegu.grandculture.net/daegu/toc/GC40002145 |
| 27 | 창방 | 한국민족문화대백과사전 | 창방 정의 | https://encykorea.aks.ac.kr/Article/E0055421 |
| 28 | 부연 | 한국민족문화대백과사전 | 부연 정의 · 겹처마 | https://encykorea.aks.ac.kr/Article/E0071916 |
| 29 | 첨차 | 한국민족문화대백과사전 | 첨차 정의 | https://encykorea.aks.ac.kr/Article/E0071910 |
| 30 | 공포 | 한국민족문화대백과사전 | 공포 정의 | https://encykorea.aks.ac.kr/Article/E0004540 |
| 31 | 주두 | 한국민족문화대백과사전 | 주두 정의 | https://encykorea.aks.ac.kr/Article/E0071909 |
| 32 | 소로 | 한국민족문화대백과사전 | 소로 정의 | https://encykorea.aks.ac.kr/Article/E0030026 |
| 33 | 도리 | 한국민족문화대백과사전 | 도리 정의 | https://encykorea.aks.ac.kr/Article/E0015603 |
| 34 | 장여 | 한국민족문화대백과사전 | 장여 정의 | https://encykorea.aks.ac.kr/Article/E0048679 |
| 35 | 가구 | 한국민족문화대백과사전 | 서까래·도리·기둥·대들보 | https://encykorea.aks.ac.kr/Article/E0000059 |
| 36 | 석간주 | 한국민족문화대백과사전 | 석간주 성분 | https://encykorea.aks.ac.kr/Article/E0028336 |
| 37 | 포항 뇌성산 뇌록산지 | 한국민족문화대백과사전 | 뇌록 산지 · 쓰임 | https://encykorea.aks.ac.kr/Article/E0074958 |
| 38 | 경복궁 경회루 | 한국민족문화대백과사전 | 경회루 천장 단청 | https://encykorea.aks.ac.kr/Article/E0002438 |
| 39 | 덕수궁 대한문 | 한국민족문화대백과사전 | 1906년 겹처마 단청 | https://encykorea.aks.ac.kr/Article/E0015362 |
| 40 | 경복궁 근정전 | 국가유산청 국가유산 정보 | 연혁 · 규모 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=11&ccbaAsno=0002230000000&ccbaCtcd=11 |
| 41 | 경복궁 경회루 | 국가유산청 국가유산 정보 | 연혁 · 규모 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=11&ccbaAsno=0002240000000&ccbaCtcd=11 |
| 42 | 창경궁 명정전 | 국가유산청 국가유산 정보 | 연혁 · 규모 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=11&ccbaAsno=0002260000000&ccbaCtcd=11 |
| 43 | 종묘 정전 | 국가유산청 국가유산 정보 | 19칸 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=11&ccbaAsno=0002270000000&ccbaCtcd=11 |
| 44 | 서울 숭례문 | 국가유산청 국가유산 정보 | 연혁 · 복구 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=11&ccbaAsno=0000010000000&ccbaCtcd=11 |
| 45 | 덕수궁 중화전 및 중화문 | 국가유산청 국가유산 정보 | 연혁 · 규모 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=12&ccbaAsno=0008190000000&ccbaCtcd=11 |
| 46 | 창덕궁 선정전 | 국가유산청 국가유산 정보 | 편전 · 청기와 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=12&ccbaAsno=0008140000000&ccbaCtcd=11 |
| 47 | 서울 문묘 및 성균관 | 국가유산청 국가유산 정보 | 대성전 연혁 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=12&ccbaAsno=0001410000000&ccbaCtcd=11 |
| 48 | 양산 통도사 대웅전 및 금강계단 | 국가유산청 국가유산 정보 | 연혁 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=11&ccbaAsno=0002900000000&ccbaCtcd=38 |
| 49 | 안동 봉정사 대웅전 | 국가유산청 국가유산 정보 | 안쪽 단청 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=11&ccbaAsno=0003110000000&ccbaCtcd=37 |
| 50 | 영주 부석사 무량수전 | 국가유산청 국가유산 정보 | 광해군 때 단청 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=11&ccbaAsno=0000180000000&ccbaCtcd=37 |
| 51 | 경주 불국사 대웅전 | 국가유산청 국가유산 정보 | 1767년 단청 완료 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=12&ccbaAsno=0017440000000&ccbaCtcd=37 |
| 52 | 예산 수덕사 대웅전 | 국가유산청 국가유산 정보 | 1308년 건립 | https://www.khs.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=11&ccbaAsno=0000490000000&ccbaCtcd=34 |
| 53 | 휘 · 늘휘 · 인휘 · 바자휘 | 표준국어대사전 | 휘 정의 | https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%ED%9C%98 |
| 54 | 머리초 · 병머리초 · 장구머리초 · 주의초 | 표준국어대사전 | 머리초 정의 | https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%A8%B8%EB%A6%AC%EC%B4%88 |
| 55 | 녹화 · 주화 · 석류동 · 녹실 · 황실 · 별화 · 매화점 | 표준국어대사전 | 문양 정의 | https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EC%84%9D%EB%A5%98%EB%8F%99 |
| 56 | 뇌록 · 양록 · 삼청 · 초빛 · 개판 | 표준국어대사전 | 안료·색 정의 | https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EB%87%8C%EB%A1%9D |
| 57 | 금단청 · 긋기단청 | 표준국어대사전 | 등급 정의 | https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=%EA%B8%88%EB%8B%A8%EC%B2%AD |

4~20번 전통문화포털 항목의 원전은 『우리가 정말 알아야 할 우리 단청』(한석성 구술, 2004). 공공누리 출처표시+상업적 이용금지+변경금지.

## 토큰 — 색은 단청 안료 이름에서

바탕은 어두운 목재, 그 위에 안료 색을 **면으로** 깐다. 괘선(1px 줄) 없음. 화면 색은 안료 이름에 맞춘 **근사값**이다(도해 캡션·바닥글에 명시).

| 역할 | 값 | 대비 | 쓰는 곳 |
|---|---|---:|---|
| 나무 | `#1A1310` | | 바탕 |
| 나무 2 · 3 | `#251B16` `#30241D` | | 판·칸 |
| 한지 | `#EFE6D6` | **14.82** | 본문 |
| 한지 2 | `#B8A690` | **7.77** / 나무 2 위 **7.13** / 나무 3 위 6.37 | 보조 글자 |
| 황 | `#E8B23A` | **9.49** (나무 위 / 황 위 나무 글자) | 선택·링크·포커스·숫자 |
| 뇌록 | `#6E927C` | 나무 글자 5.30 | 가로 부재 · 볼 곳 2 |
| 석간주 | `#8E3B2A` | 한지 글자 6.40 | 기둥 · 볼 곳 3 |
| 장단(면) | `#DC6139` | 나무 글자 **5.08** | 볼 곳 1 · 빛 사다리 주 2빛. 처음 `#D2552F`(4.44)였다 — 글자 얹는 면만 밝혔다 |
| 백분 | `#F2EDE2` | 나무 글자 15.72 | 개판 · 볼 곳 4 |
| 먹 | `#120D0B` | | 먹선 · 바닥 |

**실측** (Playwright, 7페이지 1440px, 숨은 판·탭·도판까지 전부 드러내 텍스트 노드 약 1,500개를 계산): 4.5 미만 **0**.
페이지별 최저 — 홈 **5.08**(장단 면 위 출처 배지) · 색 쌓기 **4.82**(빛 사다리 청 2빛 라벨) · 나머지 5장 **7.13**.
빛 사다리 라벨 색은 빌드 때 두 후보(나무·한지) 중 대비가 높은 쪽을 계산해 고른다.

## 서체

**Hahmlet** 한 벌(Google Fonts 가변 300~800, CSS 요청 200 확인). 큰 제목 800 · 본문 400 · 숫자 `tabular-nums`. 고정폭 서체 없음.
지난 창작의 Noto Serif KR(오방색) · Wanted Sans + Plex Mono(새물) · Song Myung(HALIDE) · Barlow + Spline Mono(CORRIDOR)와 겹치지 않는다.

## 지난 창작과 무엇이 다른가

| | HALIDE | 오방색 | 새물 | CORRIDOR | **단청 읽기** |
|---|---|---|---|---|---|
| 레이아웃 | 가운데 단 + 표 | 가운데 단 + 카드 5 | 24px 타일 격자 + 표 | 가운데 단 + 대형 숫자 + 표 | **도해가 화면 주인공**(홈) · **가로 스냅 도판**(부재) · **전폭 띠**(등급) · 원색 면 5칸(홈) |
| 타이포 | 명조 + 고정폭 | Noto Serif KR | Wanted Sans + Plex Mono | Barlow + Spline Mono | Hahmlet 한 벌 |
| 색 | 밝은 바탕 · 단색 강조 | 먹/한지 · 색 카드 | 밝은 타일 · 물색 | 밝은 바탕 · 먹 | 어두운 목재 + 안료 원색 면, 괘선 없음 |
| 이미지 | 제품 도면 | 색 면 | 시설 도면 | 노선 막대 | 좌표를 잡아 그린 SVG 도해. 누르면 확대 |
| 모션 | 거의 없음 | 물감 차오름 · 테마 쓸기 | 레인 점 · 문서 전환 | 시각 갱신 | viewBox 확대 · 칠 쓸기 |

## 도해

- **한 칸 전체도**(`bay()`): 기둥 중심 300·1300, 한 칸 1000. 다포 — 기둥 위 주심포 + 칸 사이 주간포 2. 아래에서 위로 기둥 · 창방 · 평방 · 주두 · 공포(첨차 2단 + 소로) · 장여 · 도리(굴도리) · 서까래 마구리(원) · 부연 마구리(네모) · 개판(백분) · 기와. 궁궐 모로단청 기준 — 가로 부재 뇌록, 기둥 석간주, 기둥 위 이음에 병머리초 한 쌍, 계풍 뇌록 + 먹·분 긋기
- 머리초 3종(`byeong` `janggu` `gyeopJanggu`)은 직휘 → 녹화 반쪽 · 녹실/황실 고리 · 연화 · 석류동 → 늘휘(청·녹 초빛/2빛 교대) → 먹선·분선 순으로 쌓는다. 연화는 겉잎 초빛 · 속잎 2빛 · 가운데 3빛
- 등급 8종은 같은 `beam()` 함수의 인자만 바꾼다 — 가칠(단색) · 긋기(먹분 복선) · 모로(+병머리초) · 금모로(+귀갑 금문) · 별화모로(+안상 별화) · 선화모로(+한 색 당초) · 금단청(장구머리초 + 금문 + 별화 + 금색) · 갖은금단청(겹장구 + 촘촘한 금문 + 계풍 가장자리 머리초)
- 부재별 도판은 전체도 한 벌을 숨겨 두고 `<use href="#bayG">` 에 viewBox 만 달리해 잘라 본다(10장 × 290KB 를 피함)
- **단순화한 것**: 공포의 살미·쇠서 생략(정면에서 첨차·소로만), 계풍 긋기는 먹·분 한 줄씩, 주두 무늬는 띠 두 줄, 주의초 그림은 먹띠 + 드립 꼴만. 화면 캡션 "도해는 설명용 단순화"

## 모션 — 둘만

| | 무엇 | 어떻게 |
|---|---|---|
| 1 | 도해 확대 | 부재를 누르면 SVG `viewBox` 를 520ms 동안 그 부재로 옮긴다(ease-out cubic, rAF). 넓은 화면은 오른쪽 판을 피해 왼쪽 58% 에 부재를 둔다. 나머지 부재는 불투명도 .3 |
| 2 | 칠 쓸기 | 색 쌓기에서 새 층이 `clip-path: inset(0 100% 0 0) → inset(0)` 420ms 로 왼쪽→오른쪽 칠해진다(실측 중간값 `inset(0 29.3% 0 0)`) |

작은 전환: 판 등장 260ms, 버튼 색 150ms, 진행 막대 `scaleX` 300ms, 버거 선 200ms. 스크롤 등장 연출 없음.
`prefers-reduced-motion: reduce` — viewBox 즉시 점프(클릭 16ms 뒤 이미 목표값), 칠 쓸기 0개, 판 애니메이션 none, 전 전환 끔.

## 기능 — 자체 헤드리스 Chrome(Playwright)으로 눌러서 확인

| 기능 | 결과 |
|---|---|
| 도해 확대(마우스) | 창방 좌표 실제 클릭 → `viewBox 0 60 1600 940 → 210.8 351.5 617.9 363`, 창방만 `.on`, 판에 창방 설명, 목록 버튼 `aria-pressed` 동기화, 판 제목으로 포커스 |
| 닫기 3종 | ESC → 전체로 복귀 + 판 숨김 + 누른 부재로 포커스 복귀 / 닫기 버튼 / 도해 빈 곳 클릭 — 전부 복귀 |
| 도해 키보드 | Tab 으로 부재 `<g tabindex=0 role=button>` 도달(노란 포커스 틀 — SVG `<g>` 는 outline 이 안 그려져 따로 그림) → Enter 로 열림 |
| 부재 목록 버튼 | 부연·공포·도리 → 각각 확대 |
| 390px 확대 | 처음 viewBox 는 한 칸만(`240 60 1120 940`), 도리 → `153.6 171.3 332.8 279.3`, 판은 도해 아래 |
| 가로 도판 | `#dori` 로 들어오면 07 에서 시작 · 다음 → 08(해시 `#daedeulbo`) · ← → 07 · Home → 01(이전 비활성) · End → 11(다음 비활성) · 가로 휠 → 03 · 목록 링크 → 08. 화면 밖 도판은 `inert` |
| 등급 탭 | 초기 3등급 · 클릭 1등급 · → 로 5등급까지 순환 · End · 띠 클릭 → 해당 탭 선택 + 상세로 스크롤 · 선택된 띠 강조 동기화 |
| 세부 종류 | 1등급 금단청 ↔ 갖은금단청, 2등급 금모로/별화모로/선화모로 — 그림 교체 + `aria-pressed` |
| 문양 필터 | 전체 19 · 머리초 3 · 머리초 요소 5 · 휘 3 · 계풍 채움 3 · 기둥 1 · 마구리·판 4 — 수 표시 `aria-live` |
| 색 쌓기 | 1단계: 이전 비활성, 막대 1/15 · 다음 ×3 → 천초 · 목록 10 → 녹·청 층 · 15 → 다음 비활성, 기둥 들기름 층 · 이전 → 14. `progressbar` `aria-valuenow`·`valuetext` 동기화 |
| 찾아보기 | 사찰 5 → +기록만 1(통도사) → 궁궐+기록 0 → 빈 상태 + "조건 풀기" → 17, 체크 해제 → 유교 2 |
| 모바일 메뉴 | 390px — `aria-expanded` true, `html` overflow hidden, 휠 600 에도 scrollY 0, ESC 로 닫힘 + 잠금 해제 |
| `file://` | 홈 → 등급 → 찾아보기 → 출처 배지(앵커) → 로고로 홈. 서체 로드 확인 |
| 콘솔 | 전 페이지 에러 0 |

## 검수 게이트 (weblab 루트에서)

```
node scripts/serve.mjs studio/2026-W40-dancheong 4342
node scripts/verify-site.mjs http://127.0.0.1:4342
  페이지 81개 검사 (7장 + 해시 변형)
  문제 없음 — 콘솔 에러 0, 가로 넘침 0, href="#" 0, h1 전부 1개

npx --yes impeccable@latest detect <HTML 7 + site.css + site.js>
  0 anti-patterns, exit 0   (--no-config --json → advisory 12, 실패 0)

node scripts/check-korean.mjs studio/2026-W40-dancheong
  한국어가 있는 페이지 7개 / 전체 7개 · 종결어미: 해라체 단일 · 문제 없음.
```

### impeccable 처리 내역 (억제 설정 없이 고침)

- `undersized-ui-text` — 한자 병기가 `.6em` 이라 숨은 판에서 9.6px 로 계산됨 → 24px / 도감 16px
- `side-tab` — 도판 그림 왼쪽 10px 색 띠 → 삭제
- `low-contrast`(hover) — 선택된 탭·칩·띠가 hover 에서 어두운 배경으로 바뀌어 어두운 글자와 1.1:1 → 선택 상태는 hover 에도 황 유지
- `layout-transition` — 진행 막대 `width` 전환 → `transform: scaleX`
- `em-dash-overuse`(advisory) — 찾아보기 16개·등급 9개 → 규칙 문장을 "궁궐 건축 외부는 모로단청" 꼴로, 단계 이름을 "시채: 녹 · 청" 꼴로
- 남은 advisory 12 = `shape-assembled-illustration`(도해·문양 SVG). 도해가 이 사이트의 주제 자체라 유지

## 한국어

- 라벨·메뉴·제목은 명사형, 설명은 해라체 하나. 합쇼체·해요체 없음(검사기 "해라체 단일")
- 꾸밈어: 자료 표현(곽동해 기고)을 옮겼던 `단아한 병머리초` 를 읽다가 찾아 `병머리초` 로 줄임. 출처 제목 속 "화려한" "아름다움" 은 원 제목이라 그대로 둠
- 전 문자열을 한 번 읽고 고친 것: 줄표 과다(위), 한 판 안 문장 사이 줄표 → 마침표, 종묘 정전의 근거 없는 연대 표기("조선") 삭제

## 파일

```
build.mjs            7장 생성기 (대비 계산 포함)
src/data.mjs         출처 57 · 부재 11 · 등급 5(8종) · 문양 19 · 공정 15 · 빛 4 · 안료 39 · 건물 17 · 볼 곳 5
src/svg.mjs          도해 — 한 칸 전체도 · 머리초 3종 · beam() 8등급 · 문양 19 · 색 쌓기 무대 · 대들보
assets/site.css      토큰 · 레이아웃
assets/site.js       메뉴 · 도해 확대 · 도판 · 탭 · 거르기 · 단계
assets/icon.svg
refs/home-1440.png · home-768.png · home-390.png
refs/diagram-open-changbang-1440.png · diagram-open-seokkarae-1440.png · diagram-open-dori-390.png
refs/menu-open-390.png · bujae-changbang-1440.png · deunggeup-1440.png(갖은금단청 선택)
refs/munyang-hwi-1440.png · bit-step11-1440.png · gunggwol-rec-1440.png · chulcheo-1440.png
```

## 남은 것 · 불확실한 것

- **건물별 외부 등급**: 궁궐 전각 대부분은 건물 단위 기록을 못 찾아 "규칙상"으로만 적었다. 궁궐 정전 내부 등급은 자료끼리 다르다(위)
- **색 값**: 안료 발색 근사값. 빛 단계 수(2~3단계, 최대 5빛)는 자료를 따랐지만 각 색 값은 화면용
- **도해 정확도**: 공포 구성·부재 비례는 설명용. 실측 도면을 따르지 않았다. 머리초 도안은 한 가지 꼴로 다시 그린 것 — 실제는 시대·건물·도안가에 따라 다르다(화면에 명시)
- **표준국어대사전 링크**는 검색 결과 페이지(항목 고유 주소 아님)
- Chrome 에서만 검수. Firefox·Safari 미확인
- 사진은 쓰지 않았다(도해가 주인공이라는 기획). 궁궐 사진이 필요하면 `fetch-stock.mjs` 로 추가 가능
- 기획서 확인(§4-7 2번)은 사용자가 방향 A 를 고른 것으로 갈음했다. 세부 기획서(§3)는 이번에 쓰고 바로 만들었다
