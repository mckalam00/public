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

## 구조

| 경로 | 역할 |
|---|---|
| `src/config/content.ts` | **모든 카피·수치·씬 길이**. 소개서 페이지 번호 주석 포함. 수정은 대부분 여기서 끝난다 |
| `src/config/theme.ts` | 색상·폰트·이징·해상도 토큰 |
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
- **음악·내레이션 추가**: 파일을 `public/audio/`에 두고 `Video.tsx`의 `<Series>` 옆에 `<Audio src={staticFile("audio/파일명.mp3")} />`를 추가한다.

## 공개 전 확인 사항

1. **로고**: `LogoMark.tsx`는 소개서 심볼을 단순화한 대체 도형이다. 공식 SVG로 교체해야 한다.
2. **수치 기준**: 누적 매출(139억+ vs 100억+)은 자료마다 달라 영상에서 뺐다. 넣으려면 확정값과 기준일을 받아 `METRICS`에 추가한다.
3. **고객사 로고**: 사용 동의 전이라 넣지 않았다. S7에는 텍스트 수치만 있다.
4. **UI 화면 값**: S4 금액·건수는 소개서 p.5·p.9·p.11 캡처에 표시된 값이며, 화면 우하단에 "예시" 문구를 넣었다.
5. **폰트 라이선스**: Pretendard는 SIL OFL 1.1로 상업 영상에 사용할 수 있다. 폰트 파일은 커밋하지 않는다(`npm install` 시 복사).
