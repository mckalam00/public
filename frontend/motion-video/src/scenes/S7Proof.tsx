import { useMemo } from "react";
import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CountUp } from "../components/CountUp";
import { SceneShell } from "../components/Frame";
import { PinIcon } from "../components/Icons";
import { KineticText } from "../components/KineticText";
import { METRICS, METRICS_BASIS, PROOF } from "../config/content";
import { COLORS, RADIUS } from "../config/theme";
import { fadeUp, progress } from "../lib/anim";

// 실제 지도 대신 세로로 긴 타원 영역에 핀을 흩뿌린다 (전국 확산의 은유)
const FIELD = { cx: 430, cy: 560, rx: 250, ry: 380 } as const;
const GRID_STEP = 34;
const PIN_SIZE = 44;

type Point = Readonly<{ x: number; y: number }>;

const insideField = (x: number, y: number): boolean =>
  ((x - FIELD.cx) / FIELD.rx) ** 2 + ((y - FIELD.cy) / FIELD.ry) ** 2 <= 1;

const buildGrid = (): ReadonlyArray<Point> => {
  const points: Point[] = [];
  for (let x = FIELD.cx - FIELD.rx; x <= FIELD.cx + FIELD.rx; x += GRID_STEP) {
    for (let y = FIELD.cy - FIELD.ry; y <= FIELD.cy + FIELD.ry; y += GRID_STEP) {
      if (insideField(x, y)) points.push({ x, y });
    }
  }
  return points;
};

const buildPins = (count: number): ReadonlyArray<Point> =>
  Array.from({ length: count }, (_, i) => {
    const angle = random(`pin-a-${i}`) * Math.PI * 2;
    const dist = Math.sqrt(random(`pin-d-${i}`)) * 0.9;
    return { x: FIELD.cx + Math.cos(angle) * FIELD.rx * dist, y: FIELD.cy + Math.sin(angle) * FIELD.ry * dist };
  });

/** S7 Proof — 전국으로 퍼지는 현장과 성과 수치 */
export const S7Proof = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grid = useMemo(buildGrid, []);
  const pins = useMemo(() => buildPins(PROOF.pinCount), []);

  return (
    <SceneShell background={COLORS.navy}>
      {grid.map((p) => (
        <div
          key={`dot-${p.x}-${p.y}`}
          style={{
            position: "absolute",
            left: p.x - 3,
            top: p.y - 3,
            width: 6,
            height: 6,
            borderRadius: 3,
            background: COLORS.navySoft,
            opacity: progress(frame, 0, 12),
          }}
        />
      ))}

      {pins.map((p, i) => {
        const drop = spring({ frame: frame - 6 - i * 1.5, fps, config: { damping: 11, stiffness: 200 } });
        return (
          <div
            key={`pin-${i}`}
            style={{
              position: "absolute",
              left: p.x - PIN_SIZE / 2,
              top: p.y - PIN_SIZE - (1 - drop) * 60,
              opacity: Math.min(1, drop * 2),
            }}
          >
            <PinIcon size={PIN_SIZE} color={i % 4 === 0 ? COLORS.orange : COLORS.blue} />
          </div>
        );
      })}

      <div style={{ position: "absolute", left: 900, right: 100, top: 150 }}>
        <KineticText text={PROOF.headline} start={4} fontSize={64} weight={800} color={COLORS.surface} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 56 }}>
          {METRICS.map((metric, i) => (
            <div
              key={metric.label}
              style={{
                ...fadeUp(frame, 14 + i * 6),
                padding: "34px 40px",
                borderRadius: RADIUS.card,
                background: COLORS.navySoft,
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 600, color: COLORS.blueSoft }}>{metric.label}</div>
              <CountUp
                value={metric.value}
                start={18 + i * 6}
                duration={36}
                suffix={metric.suffix}
                style={{ display: "block", fontSize: 120, fontWeight: 800, color: COLORS.surface, lineHeight: 1.1 }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", right: 100, bottom: 50, fontSize: 22, color: COLORS.blueSoft, opacity: 0.8 }}>
        {METRICS_BASIS}
      </div>
    </SceneShell>
  );
};
