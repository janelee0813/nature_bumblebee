# 자연수정벌 — 풀밭 비행 인트로

[배포된 인트로 보기](https://naturebumblebee.vercel.app/)

호박벌을 가까이 보는 첫 장면에서 카메라가 벌의 뒤로 돌아가고, 풀과 야생화 사이의 곡선 경로를 따라 비행하는 3D 인트로입니다. 이번 범위는 애니메이션 중심의 인트로이며, 상품·사용법·구매·상담 본문은 포함하지 않습니다.

## 실행

설치나 빌드 없이 HTTP 서버로 실행합니다. JavaScript 모듈을 사용하므로 파일을 직접 여는 방식 대신 서버를 사용하세요.

```sh
python3 -m http.server 4173 --directory dist
```

브라우저에서 `http://localhost:4173`을 엽니다.

## 사용

- 아래로 스크롤하면 벌과 카메라가 전진합니다. 위로 스크롤하면 같은 경로를 되돌아갑니다.
- 첫 장면은 벌 주변을 도는 카메라에서 뒤쪽 추격 시점으로 이어집니다.
- 경로의 곡률에 따라 벌의 방향과 몸체 기울기가 바뀝니다.
- 장면 버튼, 비행 건너뛰기, 다시 보기로 위치를 이동할 수 있습니다.
- `MOTION OFF`는 카메라를 현재 위치에 고정하고 주변 움직임을 줄입니다. 스크롤과 키보드로 문구·장면을 계속 탐색할 수 있습니다.
- 시스템의 `prefers-reduced-motion` 설정을 존중합니다.

## 구성

- `dist/index.html`: 자연수정벌 인트로와 접근 가능한 탐색 버튼
- `dist/style.css`: 반응형 레이아웃, 글꼴, 장면 UI
- `dist/app.js`: 스크롤, 곡선 비행 경로, 카메라 추종, 조명, 깊이 기반 렌즈 효과
- `dist/bee.js`: 절차적으로 생성하는 입체 호박벌, 털, 4개 날개, 다리·더듬이
- `dist/meadow.js`: GPU 바람 효과가 있는 인스턴스 풀과 잎, 야생화, 낮은 잔디, 원경 식생
- `dist/vendor/`: Three.js 0.180.0, Lenis 1.3.11, GSAP·ScrollTrigger 3.13.0
- `dist/assets/`: 한글 글꼴, 아이콘, 로딩/오류 시 사용하는 배경 이미지

벌과 초원은 외부 3D 모델 없이 코드로 생성합니다. 실제 WebGL 공간에서 카메라와 벌의 위치가 이동하므로 식물의 원근·가림·시차가 비행 진행에 따라 달라집니다. 표현용 모델이며 생물학적 표본 모델은 아닙니다.

## Vercel 배포

저장소 루트를 Root Directory로 사용합니다. `vercel.json`이 Output Directory를 `dist`로 지정합니다. 설치와 빌드 명령은 비워 두며 `main` 푸시에 연결된 자동 배포를 사용합니다.

## 참고 및 라이선스

- 모션 레퍼런스: [ATMOS by Leeroy](https://atmos.leeroy.ca/)
- 브랜드·색감·인트로 범위: 제공된 자연수정벌 홈페이지 기획안
- Three.js: [MIT](https://github.com/mrdoob/three.js)
- GSAP: [Standard License](https://gsap.com/standard-license/)
- Lenis: [MIT](https://github.com/darkroomengineering/lenis)
- Pretendard: [SIL Open Font License 1.1](https://github.com/orioncactus/pretendard)

배경 대체 이미지는 이전 인트로에서 ImageGen으로 생성했습니다. `ASSET-PROMPTS.txt`에 이전 이미지의 생성 기록이 있으며, 현재 비행 중 벌과 식생은 Three.js로 렌더링합니다. 글꼴과 오픈 소스 라이브러리의 라이선스 전문은 관련 폴더에 포함합니다.
