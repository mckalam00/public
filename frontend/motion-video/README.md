# 공새로 45초 모션그래픽 (Remotion)

`docs/motion-video-guide.md`의 45초 스토리보드를 코드로 옮긴 프로젝트. 1920×1080, 30fps, 1350프레임.

## 실행

```bash
cd frontend/motion-video
npm install          # postinstall이 Pretendard 폰트를 public/fonts로 복사
npm run dev          # Remotion Studio에서 미리보기·타임라인 확인
npm run render       # out/gongsaero-45s.mp4 출력
npm run still -- --frame=700   # 특정 프레임 PNG
npm run typecheck
```

Chrome 자동 다운로드가 막힌 서버(CI 등)에서는 로컬 Chromium headless shell 경로를 지정한다.

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-headless-shell npm run render
```

## 소개서 전체 영상 (20페이지, 약 3분 35초)

소개서 PDF 20페이지를 순서대로 보여 주는 모션그래픽 영상(`GongsaeroBrochure`). 페이지를 구성요소로 **해체**해 다시 조립한다.

1. **조립**: 카드·패널이 펼쳐지고, 그 위로 제목줄·문단·사진·아이콘이 읽는 순서대로 하나씩 들어온다
2. **카메라 투어**: 핵심 영역을 차례로 확대·이동한다
3. **해체**: 전체 화면으로 돌아와 구성요소가 역순으로 흩어지고 다음 페이지가 조립된다

```bash
npm run pages -- --pdf <소개서.pdf> [--debug]   # 페이지 이미지 + 해체 분석(layout.json). --debug는 확인용 겹침 이미지
npm run audio:music                             # public/audio/brochure-music.wav (−16 LUFS)
npm run render:brochure                         # out/gongsaero-brochure.mp4
```

- **해체 방식** (`scripts/pages/segment.ts`, 자동): 단색 카드·패널을 찾아 색·모서리를 뽑아 **코드로 그리고**, 그 위 내용 블록만 이미지에서 잘라 낸다. 패널 안은 같은 방식으로 다시 해체한다(최대 3단). 잘라 낸 조각의 바탕색은 항상 바로 아래 면과 같아서 경계가 보이지 않는다.
- **등장 모션** (`src/brochure/elementMotion.ts`, 모양으로 자동 결정): 글줄=마스크 업, 넓은 띠·차트=와이프, 사진·화면=줌인, 작은 요소=팝, 패널=펼침. 퇴장은 역순으로 떠오르며 사라진다.
- **카메라 투어 영역·정지 시간**: `src/config/brochure.ts`의 `BROCHURE_PAGES`(페이지를 가로 2000px로 본 좌표). 제목은 조립 단계에서 읽히므로 넣지 않는다.
- **속도**: `BROCHURE_TIMING`(조립·이동·정지·해체 시간). 영상 길이와 배경음악 길이는 자동으로 다시 계산된다.
- 소개서가 바뀌면 `npm run pages`만 다시 실행하면 해체 결과가 새로 만들어진다. 페이지 수가 `BROCHURE_PAGES`와 다르면 멈춘다. 레이아웃이 크게 바뀐 페이지는 카메라 영역 좌표를 다시 잡는다.
- 소개서 이미지·분석 결과(고객사 로고·사진·QR 포함)는 공개 저장소에 올리지 않도록 `public/pages/`를 `.gitignore`에 넣었다.
- 필요 도구: poppler(`pdftoppm`, `pdfinfo`). 이미지 분석은 `sharp`(npm)를 쓴다.

## 오디오 (배경음악 · 효과음 · 내레이션)

```bash
npm run audio            # public/audio/에 music.wav, sfx.wav, narration.wav 생성 (처음 1회 TTS 모델 자동 다운로드)
npm run render           # 오디오 파일이 있으면 자동으로 포함
```

| 트랙 | 생성 | 내용 |
|---|---|---|
| 배경음악 `music.wav` | `scripts/audio/music.ts` (코드 합성, 라이선스 무관) | 0–10초 긴장감 펄스(Am) → S3에서 임팩트 후 밝은 C장조 그루브(105 BPM) → CTA 엔딩 코드 |
| 효과음 `sfx.wav` | `scripts/audio/sfx.ts` | 휴대폰 진동, 흡입 whoosh, 로고 종소리, UI 클릭, CTA 팝. 시점은 `config/audio.ts`의 `SFX_CUES`가 화면 프레임에서 계산 |
| 내레이션 `narration.wav` | `scripts/audio/narration.ts` | 문장별 합성 → 씬 길이에 맞춤 → 목소리 EQ·컴프레서 → −16 LUFS |

- 내레이션 구간에서는 배경음악이 자동으로 낮아진다(덕킹, `MIX` 설정).
- **기본 내레이션은 타이밍 확인용 가이드 음성**(오프라인 KSS 모델)이다. 발음이 부정확하므로 공개용은 성우·고품질 TTS 녹음으로 교체한다.
  - 스크립트·디렉션·납품 규격: `docs/narration-script.md`
  - 교체: `npm run audio:narration -- --from <녹음 폴더>` (`hook.wav` … `cta.wav`)
- 필요 도구: `ffmpeg`(시스템 설치), `tar`. TTS 모델 경로는 `TTS_MODEL_DIR`로 바꿀 수 있다.
- `sherpa-onnx-node`는 **1.x로 고정**한다. 2.x는 이 모델이 쓰는 발음 변환(espeak)을 제거했다.

## 구조

| 경로 | 역할 |
|---|---|
| `src/config/content.ts` | **모든 카피·수치·씬 길이**. 소개서 페이지 번호 주석 포함. 수정은 대부분 여기서 끝난다 |
| `src/config/theme.ts` | 색상·폰트·이징·해상도 토큰 |
| `src/config/audio.ts` | 내레이션 스크립트, 목소리 설정, 믹스 볼륨, 효과음 큐 |
| `src/config/brochure.ts` | 소개서 영상: 페이지별 확대 영역·타이밍 |
| `src/brochure/` | 소개서 영상: 페이지 조립·해체(`BrochurePage`), 요소 모션, layout.json 로딩·검증 |
| `src/lib/camera.ts` | 카메라(확대·이동) 계산 |
| `scripts/pages/` | PDF → 페이지 이미지 변환(`pdftoppm`), 페이지 구성요소 해체 분석 |
| `scripts/audio/` | 배경음악·효과음 합성, 내레이션 생성(TS, `tsx`로 실행) |
| `src/Video.tsx` | `SCENE_TIMINGS` 순서대로 씬을 `Series`로 연결, 폰트 로딩 |
| `src/scenes/S1Hook.tsx` ~ `S8Cta.tsx` | 씬별 구현 (S4는 `scenes/solution/`에 패널 분리) |
| `src/components/` | KineticText, CountUp, LogoMark, ChaosCard, DeviceFrame·Cursor·Badge, 아이콘 |
| `src/lib/anim.ts` | 진행값·페이드·결정적 배치(`chaosLayout`) 헬퍼 |

| 씬 | 시간 | 내용 |
|---|---|---|
| S1 hook | 0–5s | 전화·카톡·엑셀 카드가 화면을 뒤덮음 |
| S2 problem | 5–10s | 현장·본사·경영진의 목소리, 사라지는 데이터 |
| S3 turn | 10–14s | 카드가 로고로 수렴 → "기업 데이터로 통합 관리하세요" |
| S4 solution | 14–26s | 주문 요청 → 비교 견적 → 발주 → 정산 → 분석 UI 시연 |
| S5 platform | 26–32s | 4개 서비스 궤도 |
| S6 asset | 32–37s | 거래 데이터가 AI 데이터베이스로 축적 |
| S7 proof | 37–42s | 377+ / 297+ / 20% / 50% 카운트업 |
| S8 cta | 42–45s | 로고·슬로건·무료 진단 CTA |

## 자주 하는 수정

- **수치 변경**: `content.ts`의 `METRICS`와 `METRICS_BASIS`(기준일)를 함께 바꾼다.
- **씬 길이 변경**: `SCENE_TIMINGS`의 `seconds`만 바꾸면 전체 길이(`TOTAL_FRAMES`)가 자동 계산된다.
- **30초 컷다운**: `SCENE_TIMINGS`에서 `problem`, `platform`을 빼면 34초. `solution`을 8초로 줄이면 30초.
- **내레이션 문장 수정**: `config/audio.ts`의 `NARRATION`에서 `text`(자막·검수용)와 `speech`(TTS 입력, 숫자는 한글로)를 함께 바꾸고 `npm run audio:narration`.

## 공개 전 확인 사항

1. **로고**: `LogoMark.tsx`는 소개서 심볼을 단순화한 대체 도형이다. 공식 SVG로 교체해야 한다.
2. **수치 기준**: 누적 매출(139억+ vs 100억+)은 자료마다 달라 영상에서 뺐다. 넣으려면 확정값과 기준일을 받아 `METRICS`에 추가한다.
3. **고객사 로고**: 사용 동의 전이라 넣지 않았다. S7에는 텍스트 수치만 있다.
4. **UI 화면 값**: S4 금액·건수는 소개서 p.5·p.9·p.11 캡처에 표시된 값이며, 화면 우하단에 "예시" 문구를 넣었다.
5. **폰트 라이선스**: Pretendard는 SIL OFL 1.1로 상업 영상에 사용할 수 있다. 폰트 파일은 커밋하지 않는다(`npm install` 시 복사).
