# AI 실습 코스 통합관 (`/course/`)

업종과 단계(개업 준비 · 인수 · 운영 중)를 고르면 공통 강의와 업종 전용 강의를 골라 한 코스로 엮어 주는 페이지입니다.
기존 코스(`/`, `/arch/`, `/vet/`)는 그대로 두고, 같은 강의를 한 번만 쓰도록 정리한 새 판입니다.

## 주소로 바로 열기
- `course/?biz=flower&stage=prep` — 꽃집 · 신규 개업
- `course/?biz=vet&stage=takeover` — 동물병원 · 인수
- `course/?biz=custom&name=미용실&type=shop&stage=operate` — 목록에 없는 업종 (type: shop 매장 / clinic 병의원 / edu 학원·공방 / office 사무소)
- 화면의 **코스 링크 복사**를 누르면 뺀 강의·더한 강의(`off`, `add`)까지 담긴 링크가 복사됩니다.

## 폴더
| 경로 | 내용 |
|---|---|
| `index.html`, `course.js`, `course.css`, `hub.css` | 화면과 엔진 |
| `industries.js` | 업종 프로필: 이름·검색어·단계 이름·호칭 토큰 값 |
| `data.js` | 용어 사전, AI별 안내, 가상 사무실 직원(업종별) |
| `src/common/` | 공통 강의 원본 (토큰 사용) |
| `src/vet/`, `src/salad/`, `src/arch/`, `src/flower/` | 업종 전용 강의 원본 |
| `tools/spine.py` | 장 순서와 강의 배치 (수준·단계·업종 한정/제외) |
| `tools/build.py` | `src/` → `lib/` 묶기 |
| `tools/tokenbox.py` | 강의마다 '토큰 아끼기' 상자 다시 만들기 (강의를 고친 뒤 build 전에 실행) |
| `tools/themes.py` → `themes.css` | 업종별 디자인(스킨). 색·글꼴·모서리·배경 무늬·제목 장식·아이콘을 `html[data-skin]`(vet, salad, flower, arch, c-shop, c-clinic, c-edu, c-office)별로 정해요. 새 업종을 더하면 `SKINS`에 한 줄 추가 후 실행 |
| `art.js` | 업종 그림·캐릭터(직접 그린 SVG). 동물병원 콩이와 나비, 꽃집 봉이, 샐러드 가게 아삭이와 채소 친구들. 상단 인사, 강의 머리 그림, 왜 필요해요 얼굴, 완료 칭찬, 목차 아이콘, 배경 무늬에 쓰여요. 새 업종은 `window.ART[스킨]`에 추가 |
| `tools/check.py` | 태그 짝·토큰·남은 동물병원 단어 점검 |
| `lib/` | 화면이 읽는 묶음 파일 (build.py가 만듦, 직접 고치지 않기) |

## 강의 글에 쓰는 표시
- 토큰: `{{owner}} {{customer}} {{place}} {{biz}} {{shopname}} {{open}} {{work}} {{hours}} {{item}} {{visit}} {{staff}} {{supplier}} {{stockitem}}`,
  예시 토큰 `{{ex_post}} {{ex_reel}} {{ex_review}} {{ex_revisit}} {{ex_faq}} {{ex_season}} {{ex_keyword}} {{ex_service3}}`
- 조사: `{{customer:가}}` → 보호자가 / 손님이. (이·가, 은·는, 을·를, 과·와, 으로·로, 이다, 이에요)
- 업종 갈래: `data-biz="vet"`(그 업종에서만), `data-biz-not="vet salad"`(그 업종에서는 지움)
- 단계 쪽지: `data-stage-only="takeover"` / `"operate"` / `"prep"`
- 강의 안 스크립트는 `window.COURSE.biz`로 업종을 알 수 있어요.

## 업종 추가하기 (예: 카페)
1. `industries.js`의 `INDUSTRIES`에 `cafe: {...}` 한 덩어리를 복사해 호칭·예시를 채웁니다.
2. 전용 강의를 `src/cafe/` 에 `k-xxx.html`처럼 넣고, `tools/build.py`의 `GROUP`에 `'k': 'cafe'`, `tools/spine.py`에 줄을 추가합니다.
3. `data.js`의 `STAFF`에 `cafe` 직원 목록을 넣으면 가상 사무실이 그 업종으로 바뀝니다(없으면 공통 목록).
4. `python3 tools/check.py src/cafe/*.html` → `python3 tools/build.py`.

전용 강의가 없어도 1번만 하면 검색에 뜨고, 공통 강의로 코스가 만들어집니다.
