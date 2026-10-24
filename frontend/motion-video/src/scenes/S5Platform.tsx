import { useCurrentFrame } from "remotion";
import { SceneShell } from "../components/Frame";
import { KineticText } from "../components/KineticText";
import { LogoMark } from "../components/LogoMark";
import { PLATFORM } from "../config/content";
import { COLORS, RADIUS, SHADOW } from "../config/theme";
import { fadeUp, lerp, progress } from "../lib/anim";

const ORBIT = { cx: 520, cy: 580, radius: 300 } as const;
const NODE_SIZE = 210;
const HIGHLIGHT_START = 24;
const HIGHLIGHT_FRAMES = 36;
const DEG_PER_FRAME = 0.25;

/** S5 Platform — 4개 서비스가 공새로를 중심으로 순환한다 */
export const S5Platform = () => {
  const frame = useCurrentFrame();
  const count = PLATFORM.services.length;
  const active = Math.min(count - 1, Math.max(0, Math.floor((frame - HIGHLIGHT_START) / HIGHLIGHT_FRAMES)));
  const rotation = frame * DEG_PER_FRAME;

  return (
    <SceneShell background={COLORS.lightBg}>
      <svg width={1100} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle
          cx={ORBIT.cx}
          cy={ORBIT.cy}
          r={ORBIT.radius}
          fill="none"
          stroke={COLORS.blue}
          strokeWidth={3}
          strokeDasharray="10 14"
          strokeDashoffset={-frame * 1.5}
          opacity={progress(frame, 0, 16)}
          strokeLinecap="round"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: ORBIT.cx - 150,
          top: ORBIT.cy - 150,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: COLORS.surface,
          boxShadow: SHADOW.card,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          transform: `scale(${progress(frame, 0, 14)})`,
        }}
      >
        <LogoMark size={110} color={COLORS.navy} draw={progress(frame, 4, 24)} />
        <span style={{ fontSize: 34, fontWeight: 800, color: COLORS.navy, letterSpacing: "0.04em" }}>GONGSAERO</span>
      </div>

      {PLATFORM.services.map((service, i) => {
        const angle = ((i * 360) / count - 45 + rotation) * (Math.PI / 180);
        const x = ORBIT.cx + Math.cos(angle) * ORBIT.radius;
        const y = ORBIT.cy + Math.sin(angle) * ORBIT.radius;
        const isActive = i === active && frame >= HIGHLIGHT_START;
        return (
          <div
            key={service.no}
            style={{
              position: "absolute",
              left: x - NODE_SIZE / 2,
              top: y - NODE_SIZE / 2,
              width: NODE_SIZE,
              height: NODE_SIZE,
              borderRadius: "50%",
              background: isActive ? COLORS.navy : COLORS.surface,
              color: isActive ? COLORS.surface : COLORS.text,
              border: `3px solid ${isActive ? COLORS.navy : COLORS.blueSoft}`,
              boxShadow: SHADOW.card,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 20,
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.3,
              transform: `scale(${progress(frame, 6 + i * 4, 14) * (isActive ? 1.1 : 1)})`,
            }}
          >
            {service.name}
          </div>
        );
      })}

      <div style={{ position: "absolute", left: 1060, right: 90, top: 140 }}>
        <KineticText text={PLATFORM.headline} start={4} fontSize={54} weight={800} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 48 }}>
          {PLATFORM.services.map((service, i) => {
            const isActive = i === active && frame >= HIGHLIGHT_START;
            const emphasis = isActive ? progress(frame, HIGHLIGHT_START + i * HIGHLIGHT_FRAMES, 10) : 0;
            return (
              <div
                key={service.no}
                style={{
                  ...fadeUp(frame, 14 + i * 5),
                  padding: "26px 34px",
                  borderRadius: RADIUS.card,
                  background: isActive ? COLORS.blue : COLORS.surface,
                  color: isActive ? COLORS.surface : COLORS.text,
                  transform: `translateX(${lerp(0, -16, emphasis)}px)`,
                  display: "flex",
                  gap: 24,
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 800, opacity: 0.8 }}>{service.no}</span>
                <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 34, fontWeight: 800 }}>{service.name}</span>
                  <span style={{ fontSize: 26, opacity: 0.85 }}>{service.desc}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};
