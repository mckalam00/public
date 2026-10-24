import { random, useCurrentFrame } from "remotion";
import { SceneShell } from "../components/Frame";
import { KineticText } from "../components/KineticText";
import { PROBLEM } from "../config/content";
import { COLORS, RADIUS, SHADOW } from "../config/theme";
import { fadeUp, lerp, progress } from "../lib/anim";

const PARTICLE_COUNT = 36;
const DIM_START = 75;

/** S2 Problem — 세 사람의 목소리, 그리고 사라지는 데이터 */
export const S2Problem = () => {
  const frame = useCurrentFrame();
  const dim = progress(frame, DIM_START, 20);

  return (
    <SceneShell background={COLORS.grayBg}>
      <div style={{ position: "absolute", top: 150, left: 120, right: 120, display: "flex", gap: 40 }}>
        {PROBLEM.personas.map((persona, i) => (
          <div
            key={persona.role}
            style={{
              flex: 1,
              ...fadeUp(frame, 8 + i * 12, 16, 40),
              filter: `grayscale(${dim})`,
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 600, color: COLORS.subText, marginBottom: 20, textAlign: "center" }}>
              {persona.role}
            </div>
            <div
              style={{
                background: COLORS.surface,
                borderRadius: RADIUS.card,
                boxShadow: SHADOW.card,
                padding: "48px 44px",
                fontSize: 40,
                fontWeight: 700,
                lineHeight: 1.4,
                minHeight: 230,
                opacity: lerp(1, 0.45, dim),
              }}
            >
              “{persona.quote}”
            </div>
          </div>
        ))}
      </div>

      {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const seed = `particle-${i}`;
        const start = DIM_START + random(`${seed}-d`) * 30;
        const p = progress(frame, start, 40);
        return (
          <div
            key={seed}
            style={{
              position: "absolute",
              left: 160 + random(`${seed}-x`) * 1600,
              top: 480 + random(`${seed}-y`) * 120 - p * 160,
              width: 14,
              height: 14,
              borderRadius: 3,
              background: COLORS.blue,
              opacity: frame < start ? 0 : 1 - p,
            }}
          />
        );
      })}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 170 }}>
        <KineticText
          text={PROBLEM.headline}
          start={DIM_START + 5}
          fontSize={76}
          weight={800}
          align="center"
          highlight={PROBLEM.highlight}
        />
      </div>
    </SceneShell>
  );
};
