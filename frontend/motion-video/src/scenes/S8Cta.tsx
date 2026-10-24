import { useCurrentFrame } from "remotion";
import { SceneShell } from "../components/Frame";
import { LogoMark } from "../components/LogoMark";
import { CTA } from "../config/content";
import { COLORS, RADIUS } from "../config/theme";
import { fadeUp, progress } from "../lib/anim";

const PULSE_AT = 40;

/** S8 CTA — 로고, 슬로건, 무료 진단 안내 */
export const S8Cta = () => {
  const frame = useCurrentFrame();
  const pulse = progress(frame, PULSE_AT, 18);
  const pulseScale = 1 + Math.sin(pulse * Math.PI) * 0.06;

  return (
    <SceneShell background={COLORS.navyDeep} fadeOut={false}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 34,
          color: COLORS.surface,
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 600, ...fadeUp(frame, 4) }}>{CTA.slogan}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <LogoMark size={150} draw={progress(frame, 0, 24)} />
          <span style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.02em", ...fadeUp(frame, 10, 16, 40) }}>
            {CTA.brand}
          </span>
        </div>
        <div
          style={{
            ...fadeUp(frame, 22),
            marginTop: 16,
            padding: "28px 60px",
            borderRadius: RADIUS.pill,
            background: COLORS.orange,
            fontSize: 40,
            fontWeight: 800,
            transform: `scale(${pulseScale})`,
          }}
        >
          {CTA.button}
        </div>
        <div style={{ fontSize: 34, fontWeight: 500, color: COLORS.blueSoft, ...fadeUp(frame, 28) }}>{CTA.contact}</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 60,
          display: "flex",
          justifyContent: "center",
          gap: 40,
          fontSize: 26,
          color: COLORS.blueSoft,
          ...fadeUp(frame, 32),
        }}
      >
        {CTA.credentials.map((credential) => (
          <span key={credential}>{credential}</span>
        ))}
      </div>
    </SceneShell>
  );
};
