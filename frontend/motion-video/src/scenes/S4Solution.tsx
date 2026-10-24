import type { ComponentType } from "react";
import { Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { DeviceFrame, SceneShell } from "../components/Frame";
import { KineticText } from "../components/KineticText";
import { SOLUTION } from "../config/content";
import { COLORS, EASE_IN_OUT } from "../config/theme";
import { fadeUp, progress } from "../lib/anim";
import { ComparePanel, RequestPanel } from "./solution/PanelsRequest";
import { AnalyzePanel, OrderPanel, SettlePanel } from "./solution/PanelsManage";
import { StepIndicator } from "./solution/StepIndicator";

const PANELS: ReadonlyArray<ComponentType> = [RequestPanel, ComparePanel, OrderPanel, SettlePanel, AnalyzePanel];
const DEVICE = { width: 1480, height: 640 } as const;
const INTRO_FRAMES = 18;
const SLIDE_FRAMES = 14;

/** S4 Solution — 5단계 조달 흐름을 하나의 화면에서 시연 */
export const S4Solution = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const stepFrames = Math.floor((durationInFrames - INTRO_FRAMES) / PANELS.length);

  // 단계 표시는 패널 전환과 같은 타이밍으로 부드럽게 이동
  const position = PANELS.reduce(
    (acc, _, i) => (i === 0 ? acc : acc + progress(frame, INTRO_FRAMES + i * stepFrames - SLIDE_FRAMES, SLIDE_FRAMES, EASE_IN_OUT)),
    0,
  );

  return (
    <SceneShell background={COLORS.lightBg}>
      <div style={{ position: "absolute", top: 46, left: 0, right: 0 }}>
        <KineticText text={SOLUTION.caption} start={0} fontSize={52} weight={800} align="center" />
      </div>

      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center", ...fadeUp(frame, 6) }}>
        <StepIndicator steps={SOLUTION.steps} position={position} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 268,
          left: (width - DEVICE.width) / 2,
          ...fadeUp(frame, 8, 18, 60),
        }}
      >
        <DeviceFrame width={DEVICE.width} height={DEVICE.height} title="공새로 | 현장조달">
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            {PANELS.map((Panel, i) => {
              const start = INTRO_FRAMES + i * stepFrames - (i === 0 ? INTRO_FRAMES : SLIDE_FRAMES);
              const enter = i === 0 ? 1 : progress(frame, start, SLIDE_FRAMES, EASE_IN_OUT);
              const isLast = i === PANELS.length - 1;
              const exit = isLast ? 0 : progress(frame, INTRO_FRAMES + (i + 1) * stepFrames - SLIDE_FRAMES, SLIDE_FRAMES, EASE_IN_OUT);
              const offset = (1 - enter) * DEVICE.width - exit * DEVICE.width;
              return (
                <Sequence key={SOLUTION.steps[i]} from={start} layout="none">
                  <div style={{ position: "absolute", inset: 0, transform: `translateX(${offset}px)` }}>
                    <Panel />
                  </div>
                </Sequence>
              );
            })}
          </div>
        </DeviceFrame>
      </div>

      <div style={{ position: "absolute", bottom: 26, right: 60, fontSize: 22, color: COLORS.muted }}>
        {SOLUTION.disclaimer}
      </div>
    </SceneShell>
  );
};
