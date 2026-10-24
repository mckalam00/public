import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ChaosCard } from "../components/ChaosCard";
import { SceneShell } from "../components/Frame";
import { KineticText } from "../components/KineticText";
import { LogoMark } from "../components/LogoMark";
import { HOOK, TURN } from "../config/content";
import { COLORS, EASE_IN_OUT } from "../config/theme";
import { chaosLayout, progress } from "../lib/anim";
import { CHAOS_ITEM_COUNT } from "./S1Hook";

const LOGO_SIZE = 220;

/** S3 Turn — 흩어진 업무가 로고 하나로 수렴한다 (영상의 시그니처 모션) */
export const S3Turn = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const items = useMemo(
    () => chaosLayout(CHAOS_ITEM_COUNT, width, height, HOOK.chaosItems.length),
    [width, height],
  );

  const converge = progress(frame, 0, 32, EASE_IN_OUT);
  const logoDraw = progress(frame, 24, 30);
  const logoLift = progress(frame, 50, 20);
  const centerY = height / 2 - logoLift * 150;
  const glow = progress(frame, 28, 10) * (1 - progress(frame, 38, 20));

  return (
    <SceneShell background={COLORS.navy}>
      {items.map((item, i) => (
        <ChaosCard
          key={`turn-${i}`}
          item={item}
          kind={HOOK.chaosItems[item.contentIndex].kind}
          label={HOOK.chaosItems[item.contentIndex].label}
          appear={1 - progress(frame, 26, 6)}
          converge={converge}
          wiggle={0}
          centerX={width / 2}
          centerY={height / 2}
          dark
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: width / 2 - 300,
          top: height / 2 - 300,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.blue} 0%, rgba(74,124,240,0) 70%)`,
          opacity: glow,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width / 2 - LOGO_SIZE / 2,
          top: centerY - LOGO_SIZE / 2,
          transform: `scale(${1 - logoLift * 0.35})`,
        }}
      >
        <LogoMark size={LOGO_SIZE} draw={logoDraw} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: height / 2 + 30, display: "flex", flexDirection: "column", gap: 10 }}>
        <KineticText text={TURN.lead} start={56} fontSize={60} weight={600} color={COLORS.surface} align="center" />
        <KineticText text={TURN.headline} start={64} fontSize={100} weight={800} color={COLORS.orange} align="center" />
      </div>
    </SceneShell>
  );
};
