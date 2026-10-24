import { COLORS, RADIUS } from "../../config/theme";
import { lerp } from "../../lib/anim";

type Props = Readonly<{
  steps: ReadonlyArray<string>;
  /** 0 ~ steps.length-1 사이의 연속값 */
  position: number;
}>;

const PILL_WIDTH = 220;
const GAP = 70;

/** 주문 요청 → 비교 견적 → 발주 → 정산 → 분석 진행 표시 */
export const StepIndicator = ({ steps, position }: Props) => {
  const totalWidth = steps.length * PILL_WIDTH + (steps.length - 1) * GAP;
  const lineProgress = position / Math.max(1, steps.length - 1);

  return (
    <div style={{ position: "relative", width: totalWidth, height: 64 }}>
      <div
        style={{
          position: "absolute",
          left: PILL_WIDTH / 2,
          right: PILL_WIDTH / 2,
          top: 30,
          height: 4,
          background: COLORS.line,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: PILL_WIDTH / 2,
          top: 30,
          height: 4,
          width: (totalWidth - PILL_WIDTH) * lineProgress,
          background: COLORS.blue,
        }}
      />
      {steps.map((step, i) => {
        const activeness = Math.max(0, 1 - Math.abs(position - i));
        const done = position >= i;
        return (
          <div
            key={step}
            style={{
              position: "absolute",
              left: i * (PILL_WIDTH + GAP),
              width: PILL_WIDTH,
              height: 64,
              borderRadius: RADIUS.pill,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontSize: 28,
              fontWeight: 700,
              background: activeness > 0.5 ? COLORS.navy : done ? COLORS.blueSoft : COLORS.surface,
              color: activeness > 0.5 ? COLORS.surface : done ? COLORS.navy : COLORS.muted,
              border: `2px solid ${done ? COLORS.blue : COLORS.line}`,
              transform: `scale(${lerp(1, 1.08, activeness)})`,
            }}
          >
            <span style={{ fontSize: 22, opacity: 0.7 }}>{String(i + 1).padStart(2, "0")}</span>
            {step}
          </div>
        );
      })}
    </div>
  );
};
