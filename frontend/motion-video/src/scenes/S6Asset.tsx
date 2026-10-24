import { useCurrentFrame, useVideoConfig } from "remotion";
import { SceneShell } from "../components/Frame";
import { DatabaseIcon } from "../components/Icons";
import { KineticText } from "../components/KineticText";
import { ASSET } from "../config/content";
import { COLORS, EASE_IN_OUT, RADIUS, SHADOW } from "../config/theme";
import { fadeUp, lerp, progress } from "../lib/anim";

const COLUMN_WIDTH = 360;
const COLUMN_GAP = 60;
const FLOW_TOP = 290;
const CARD_TOP = 430;
const DB = { y: 800, size: 230 } as const;
const DROP_START = 52;

/** S6 Data Asset — 거래 데이터가 쌓여 기업 자산(AI)이 된다 */
export const S6Asset = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const rowWidth = ASSET.flow.length * COLUMN_WIDTH + (ASSET.flow.length - 1) * COLUMN_GAP;
  const rowLeft = (width - rowWidth) / 2;
  const dbAppear = progress(frame, DROP_START + 20, 16);
  const pulse = 1 + Math.sin(Math.max(0, frame - DROP_START - 30) / 4) * 0.03 * dbAppear;
  const headlineWords = `${ASSET.headlineLead} ${ASSET.headlineEmphasis}`;

  return (
    <SceneShell background={COLORS.grayBg}>
      <div style={{ position: "absolute", top: 90, left: 0, right: 0 }}>
        <KineticText
          text={headlineWords}
          start={0}
          fontSize={72}
          weight={800}
          align="center"
          highlight={ASSET.headlineEmphasis.split(" ")}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: rowLeft + COLUMN_WIDTH / 2,
          width: (rowWidth - COLUMN_WIDTH) * progress(frame, 10, 30),
          top: FLOW_TOP + 34,
          height: 4,
          background: COLORS.line,
        }}
      />

      {ASSET.flow.map((step, i) => {
        const left = rowLeft + i * (COLUMN_WIDTH + COLUMN_GAP);
        const drop = progress(frame, DROP_START + i * 4, 26, EASE_IN_OUT);
        const cardX = lerp(left, width / 2 - COLUMN_WIDTH / 2, drop);
        const cardY = lerp(CARD_TOP, DB.y - 40, drop);
        return (
          <div key={step}>
            <div
              style={{
                position: "absolute",
                left,
                top: FLOW_TOP,
                width: COLUMN_WIDTH,
                padding: "18px 0",
                textAlign: "center",
                borderRadius: RADIUS.pill,
                background: COLORS.surface,
                border: `2px solid ${COLORS.line}`,
                fontSize: 30,
                fontWeight: 700,
                ...fadeUp(frame, 8 + i * 5),
              }}
            >
              {step}
            </div>
            <div
              style={{
                position: "absolute",
                left: cardX,
                top: cardY,
                width: COLUMN_WIDTH,
                padding: "24px 0",
                textAlign: "center",
                borderRadius: 20,
                background: COLORS.lightBg,
                border: `2px solid ${COLORS.blueSoft}`,
                color: COLORS.navy,
                fontSize: 30,
                fontWeight: 700,
                boxShadow: SHADOW.card,
                opacity: progress(frame, 22 + i * 5, 12) * (1 - progress(frame, DROP_START + 20 + i * 4, 8)),
                transform: `scale(${lerp(1, 0.4, drop)})`,
              }}
            >
              {ASSET.data[i]}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: width / 2 - DB.size / 2,
          top: DB.y - DB.size / 2,
          width: DB.size,
          height: DB.size,
          borderRadius: "50%",
          background: COLORS.blue,
          boxShadow: `0 0 ${80 * dbAppear}px ${COLORS.blue}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${dbAppear * pulse})`,
        }}
      >
        <DatabaseIcon size={120} color={COLORS.surface} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: DB.y + DB.size / 2 + 26,
          textAlign: "center",
          fontSize: 34,
          fontWeight: 700,
          color: COLORS.navy,
          ...fadeUp(frame, DROP_START + 36),
        }}
      >
        {ASSET.result}
      </div>
    </SceneShell>
  );
};
