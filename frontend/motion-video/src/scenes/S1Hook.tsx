import { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ChaosCard } from "../components/ChaosCard";
import { SceneShell } from "../components/Frame";
import { KineticText } from "../components/KineticText";
import { HOOK } from "../config/content";
import { COLORS } from "../config/theme";
import { chaosLayout } from "../lib/anim";

export const CHAOS_ITEM_COUNT = 18;

/** S1 Hook — 전화·카톡·엑셀이 화면을 점점 뒤덮는다 */
export const S1Hook = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const items = useMemo(
    () => chaosLayout(CHAOS_ITEM_COUNT, width, height, HOOK.chaosItems.length),
    [width, height],
  );

  return (
    <SceneShell background={COLORS.lightBg} fadeOut={false}>
      {items.map((item, i) => {
        const content = HOOK.chaosItems[item.contentIndex];
        const appear = spring({ frame: frame - item.delay, fps, config: { damping: 12, stiffness: 180 } });
        // 시간이 갈수록 흔들림이 커져 "혼란"이 고조된다
        const intensity = 1 + frame / 50;
        const wiggle = Math.sin(frame / 3 + i) * intensity * (content.kind === "phone" ? 2.5 : 1);
        return (
          <ChaosCard
            key={`chaos-${i}`}
            item={item}
            kind={content.kind}
            label={content.label}
            appear={appear}
            converge={0}
            wiggle={wiggle}
            centerX={width / 2}
            centerY={height / 2}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 420,
          background: `linear-gradient(to top, ${COLORS.lightBg} 55%, rgba(238,244,255,0))`,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, display: "flex", flexDirection: "column", gap: 8 }}>
        <KineticText text={HOOK.lines[0]} start={30} fontSize={58} weight={600} color={COLORS.subText} align="center" />
        <KineticText text={HOOK.lines[1]} start={48} fontSize={120} weight={800} align="center" stagger={5} />
      </div>
    </SceneShell>
  );
};
