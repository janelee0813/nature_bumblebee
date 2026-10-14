# 뒤엉벌 — 작은 날갯짓, 커다란 연결

스크롤에 따라 호박벌 등장 → 가까이 접근 → 비행 시작으로 이어지는 홈페이지 인트로입니다.

[배포된 인트로 보기](https://dweongbeol-first-flight.alertshark1.chatgpt.site)

## 실행

빌드나 패키지 설치 없이 실행할 수 있습니다.

```sh
python3 -m http.server 4173 --directory dist
```

브라우저에서 `http://localhost:4173`을 엽니다.

## Vercel 배포

저장소 루트를 Root Directory로 사용합니다. `vercel.json`이 정적 사이트의 Output Directory를 `dist`로 지정합니다. 별도의 설치나 빌드 명령은 필요하지 않습니다.

## 구성

- `dist/index.html`: 화면 구조
- `dist/style.css`: 디자인, 반응형 레이아웃, 날갯짓
- `dist/app.js`: 스크롤 장면, 장면 이동, 모션 줄이기
- `dist/assets/`: 자체 제작한 이미지와 한글 글꼴
- `dist/vendor/`: 로컬로 제공하는 Lenis·GSAP·ScrollTrigger
- `ASSET-PROMPTS.txt`: ImageGen 이미지 생성 프롬프트

Lenis 1.3.11과 GSAP·ScrollTrigger 3.13.0을 사용합니다. 이미지 레이어에 깊이와 이동을 주는 2.5D 프로토타입이며, 전체 3D 모델을 사용하지 않습니다. 모바일, 키보드 탐색, 시스템의 모션 줄이기 설정을 지원합니다. `MOTION OFF`는 확대 이동과 주변 움직임을 끄고 장면을 짧게 교차 전환합니다.

현재 구현 범위는 인트로와 비행 시작까지입니다. 꽃 착지, 꽃가루 이동, 수분, 생태계 줌아웃은 후속 기획에서 확장할 수 있습니다.

## 참고 및 라이선스

- 디자인 레퍼런스: [ATMOS by Leeroy](https://atmos.leeroy.ca/)
- GSAP: [Standard License](https://gsap.com/standard-license/)
- Lenis: [MIT](https://github.com/darkroomengineering/lenis)
- Pretendard: [SIL Open Font License 1.1](https://github.com/orioncactus/pretendard)

벌과 초원 이미지는 ImageGen으로 생성한 시각 연출용 에셋입니다. 과학적 표본 사진이 아닙니다. 글꼴과 Lenis 라이선스 전문은 해당 에셋 폴더에 포함되어 있습니다.
