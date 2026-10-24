# 공새로 45초 영상 내레이션 스크립트

성우·TTS 담당자에게 그대로 전달하는 문서. 원본 데이터는 `frontend/motion-video/src/config/audio.ts`의 `NARRATION`이다(수정은 그 파일에서).

## 디렉션

- **목소리**: 20대 여성 아나운서. 밝고 또렷하게, 신뢰감 있는 정보 전달 톤
- **속도**: 보통보다 약간 빠르게(분당 약 330~350음절). 문장 끝은 올리지 말고 내려 닫는다
- **강조**: 굵게 표시한 단어에 힘을 준다
- **S1~S2**(문제 제기)는 차분하게, **S3부터**(해결)는 한 톤 밝게 올린다

## 스크립트 · 타이밍

| 파일명 | 시작 | 최대 길이 | 문장 | 발음 메모 |
|---|---|---|---|---|
| `hook.wav` | 0:00.6 | 4.0초 | 전화, 카톡, 엑셀로 관리하던 **건설 현장 구매**. | 쉼표마다 짧게 끊기 |
| `problem.wav` | 0:05.3 | 4.3초 | 업무는 반복되고, 기준은 없고, 리스크는 **보이지 않습니다**. | |
| `turn.wav` | 0:10.9 | 2.7초 | 이제, **기업의 데이터로** 통합 관리하세요. | "이제" 뒤 반 박자 쉼 |
| `solution.wav` | 0:14.4 | 11.2초 | 주문 요청부터 비교 견적, 발주, 정산, 분석까지. 현장의 모든 조달이 **하나의 화면에서** 끝납니다. | 나열은 일정한 리듬으로 |
| `platform.wav` | 0:26.4 | 5.2초 | 맞춤형 커머스와 잉여 자산 거래, 본사 **통합 관리**까지. | |
| `asset.wav` | 0:32.3 | 4.3초 | 거래가 쌓일수록, 건설사는 **더 똑똑해집니다**. | |
| `proof.wav` | 0:37.5 | 4.1초 | 전국 **377개 현장**, 평균 **20% 비용 절감**. | 삼백칠십칠 개 / 이십 퍼센트 |
| `cta.wav` | 0:42.2 | 2.4초 | 조달의 기준을 새롭게. **공새로**. | [공새로] 세 음절 또박또박, 마지막에 미소 |

최대 길이를 넘으면 영상 조립 시 자동으로 최대 1.25배까지 빨라진다. 그보다 길면 경고가 나오므로 다시 녹음한다.

## 납품 규격

- 문장마다 파일 1개, 위 표의 파일명 그대로(`hook.wav` … `cta.wav`)
- WAV, 44.1kHz 또는 48kHz, 모노 권장(스테레오도 가능)
- 앞뒤 무음은 상관없음(자동으로 잘라냄). 배경 소음·리버브 없이 드라이하게
- 음량 보정·EQ는 하지 않아도 됨(조립 단계에서 −16 LUFS로 맞춤)

## 영상에 넣기

```bash
cd frontend/motion-video
npm run audio:narration -- --from <녹음 폴더>
npm run render
```

## 무료로 고품질 TTS를 만들 때 (로컬 PC)

이 저장소의 기본 가이드 음성(오프라인 KSS 모델)은 **타이밍 확인용**이다. 발음이 부정확해서 그대로 공개하면 안 된다(특히 "공새로").
Supertone의 오픈소스 TTS인 Supertonic은 한국어와 여성 보이스를 지원한다. 처음 실행할 때 모델을 HuggingFace에서 내려받으므로 인터넷이 되는 PC에서 실행한다.

```bash
pip install supertonic
supertonic list-voices                      # 여성 보이스(F로 시작) 중 밝은 톤을 골라 VOICE에 넣는다
VOICE=F1
mkdir -p vo
supertonic tts '전화, 카톡, 엑셀로 관리하던 건설 현장 구매.' -o vo/hook.wav --lang ko --voice $VOICE --speed 1.05 --steps 10
supertonic tts '업무는 반복되고, 기준은 없고, 리스크는 보이지 않습니다.' -o vo/problem.wav --lang ko --voice $VOICE --speed 1.05 --steps 10
supertonic tts '이제, 기업의 데이터로 통합 관리하세요.' -o vo/turn.wav --lang ko --voice $VOICE --speed 1.05 --steps 10
supertonic tts '주문 요청부터 비교 견적, 발주, 정산, 분석까지. 현장의 모든 조달이 하나의 화면에서 끝납니다.' -o vo/solution.wav --lang ko --voice $VOICE --speed 1.05 --steps 10
supertonic tts '맞춤형 커머스와 잉여 자산 거래, 본사 통합 관리까지.' -o vo/platform.wav --lang ko --voice $VOICE --speed 1.05 --steps 10
supertonic tts '거래가 쌓일수록, 건설사는 더 똑똑해집니다.' -o vo/asset.wav --lang ko --voice $VOICE --speed 1.05 --steps 10
supertonic tts '전국 삼백칠십칠 개 현장, 평균 이십 퍼센트 비용 절감.' -o vo/proof.wav --lang ko --voice $VOICE --speed 1.05 --steps 10
supertonic tts '조달의 기준을 새롭게. 공새로.' -o vo/cta.wav --lang ko --voice $VOICE --speed 1.05 --steps 10
npm run audio:narration -- --from vo
```

상업적으로 공개하기 전에 사용한 TTS(모델 가중치 포함)의 라이선스가 상업 이용을 허용하는지 확인한다. 유료 TTS 서비스나 성우 녹음도 같은 파일명 규격으로 넣으면 된다.
