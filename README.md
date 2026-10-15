# 일 잘하는 벌, 자연수정벌

[홈페이지](https://naturebumblebee.vercel.app/) · [본문 바로 보기](https://naturebumblebee.vercel.app/index.html#home)

스크롤을 따라 수정벌과 카메라가 풀과 꽃 사이를 비행하는 3D 인트로, 그리고 제품·작물·생산자·농가 정보를 연결하는 반응형 홈페이지입니다. 제공된 2026.10.14 홈페이지 기획안의 메인 9개 구간과 6개 메뉴를 구현합니다.

## 실행과 수정

의존성 설치 없이 정적 HTTP 서버로 실행합니다.

```sh
npm run preview
```

`http://localhost:4173`을 엽니다. 메인 화면과 공통 헤더·푸터는 `scripts/build-pages.mjs`, 인트로 마크업은 `scripts/intro.html`, 세부 페이지 콘텐츠는 `dist/pages.js`에서 수정합니다. HTML을 다시 생성하려면 다음 명령을 실행합니다.

```sh
npm run build:pages
```

생성된 `dist/`를 함께 커밋합니다. Vercel은 저장소 루트의 `vercel.json`에 따라 `dist`를 바로 배포하며 설치·빌드 명령은 사용하지 않습니다.

## 화면과 기능

- 인트로: 기존 곡선 비행·카메라 궤도·날개와 몸체 움직임을 유지하며, 밝은 풀과 야생화, 따뜻한 하늘과 은은한 태양을 추가했습니다. 본문을 읽을 때는 3D 렌더링을 쉬게 합니다.
- 메인: 브랜드·행동 → 작물 선택 → 제품 → 생산·포장·출고 → 생산자·농가 → 첫 사용 → FAQ → 소식 → 상담.
- 메뉴: 소개, 제품·주문, 작물별 사용법, 농가 이야기, FAQ, 소식·문의.
- 작물: 토마토·딸기·블루베리·참외·과수의 개별 안내와 해당 작물이 선택된 상담 화면.
- 이야기: 가족, 토마토 농가, 도착 후 체크리스트의 개별 화면과 공식 원문 링크.
- 구매: 안내창과 비활성 결제 버튼만 구현했습니다. 실제 홈페이지 결제·장바구니·회원가입은 없습니다.
- 상담: 입력 조건을 브라우저에서 텍스트로 정리하고 복사합니다. 저장하거나 서버에 제출하지 않습니다. 이용자가 네이버 톡톡에 직접 붙여넣어 상담을 시작합니다.
- 모바일 메뉴와 하단 구매·상담 버튼, 키보드 탐색, FAQ 펼치기, 시스템의 움직임 줄이기 설정을 지원합니다.

## 소스 구조

- `dist/app.js`, `bee.js`, `meadow.js`, `sun-sky.js`: Three.js 3D 장면과 Lenis·GSAP·ScrollTrigger 스크롤 연결.
- `dist/style.css`: 인트로 UI와 글꼴.
- `dist/home.css`, `home.js`: 홈페이지 공통 디자인과 상호작용.
- `dist/pages.js`, `page-entry.js`: 세부 페이지 콘텐츠와 query 기반 상세 안내.
- `dist/assets/`: 공식 채널에서 확인한 실제 사진, 자체 SVG 작물 일러스트, 글꼴·아이콘·대체 이미지.
- `dist/source-notes.json`: 사진의 공식 출처 및 콘텐츠 검토일.

봉군 구성은 2026.10.15 사용자 확인에 따라 고품질 뒤영벌, 통 당 130마리 내외로 안내합니다. 가격, 출고 마감, 준비 기간, 교환·보상 기준 등 확정되지 않은 운영 정보는 임의로 만들지 않았습니다. 현재 제품 조건과 판매자 정보는 공식 스토어에서 확인하도록 연결합니다. 최신 연락처가 확인될 때까지 전화 대신 확인된 네이버 톡톡 경로를 사용합니다.

## 참고 및 라이선스

- 모션 참고: [ATMOS by Leeroy](https://atmos.leeroy.ca/). 전체 스크롤 비행을 확인한 뒤 추격 카메라와 장면 연결을 참고했습니다.
- 콘텐츠: 사용자 제공 홈페이지 기획안, [자연수정벌 공식 블로그](https://blog.naver.com/naturebul), [인스타그램](https://www.instagram.com/nature_bumblebee/).
- Three.js 0.180.0: MIT / Lenis 1.3.11: MIT / GSAP·ScrollTrigger 3.13.0: Standard License / Pretendard: SIL Open Font License 1.1. 전문은 해당 폴더에 포함합니다.
- 이전 인트로의 ImageGen 배경 생성 기록은 `ASSET-PROMPTS.txt`에 보관했습니다. 현재 비행 중 벌과 식생은 코드로 생성한 표현용 모델입니다.
