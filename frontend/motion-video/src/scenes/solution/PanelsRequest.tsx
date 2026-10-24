import type { ReactNode } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CountUp } from "../../components/CountUp";
import { Badge, Cursor } from "../../components/Frame";
import { CheckIcon } from "../../components/Icons";
import { SOLUTION } from "../../config/content";
import { COLORS, RADIUS } from "../../config/theme";
import { fadeUp, lerp, progress } from "../../lib/anim";

export const PanelTitle = ({ children }: Readonly<{ children: ReactNode }>) => (
  <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.text, marginBottom: 36 }}>{children}</div>
);

export const PANEL_PADDING = 56;

/** 01 간편 주문 요청 */
export const RequestPanel = () => {
  const frame = useCurrentFrame();
  const { request } = SOLUTION;
  const cursorMove = progress(frame, 22, 20);
  const clickAt = request.clickFrame;
  const pressed = frame >= clickAt;

  return (
    <div style={{ padding: PANEL_PADDING, height: "100%", position: "relative" }}>
      <PanelTitle>{request.title}</PanelTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {request.items.map((item, i) => (
          <div
            key={item.name}
            style={{
              ...fadeUp(frame, 4 + i * 6),
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "22px 30px",
              borderRadius: 18,
              background: COLORS.lightBg,
              fontSize: 32,
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: COLORS.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckIcon size={28} color={COLORS.surface} />
            </span>
            <span style={{ fontWeight: 700, width: 260 }}>{item.name}</span>
            <span style={{ color: COLORS.subText }}>{item.spec}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: PANEL_PADDING,
          bottom: PANEL_PADDING,
          padding: "24px 48px",
          borderRadius: 16,
          background: pressed ? COLORS.blue : COLORS.navy,
          color: COLORS.surface,
          fontSize: 32,
          fontWeight: 700,
          transform: `scale(${frame >= clickAt && frame < clickAt + 5 ? 0.96 : 1})`,
        }}
      >
        {request.action}
      </div>
      <Cursor x={lerp(900, 1290, cursorMove)} y={lerp(300, 570, cursorMove)} clickAt={clickAt} />
    </div>
  );
};

/** 02 실시간 자동 견적 비교 */
export const ComparePanel = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { compare } = SOLUTION;
  const badgePop = spring({ frame: frame - 34, fps, config: { damping: 10 } });

  return (
    <div style={{ padding: PANEL_PADDING, height: "100%" }}>
      <PanelTitle>{compare.title}</PanelTitle>
      <div style={{ display: "flex", gap: 40 }}>
        {compare.quotes.map((quote, i) => (
          <div
            key={quote.supplier}
            style={{
              ...fadeUp(frame, 4 + i * 6),
              flex: 1,
              position: "relative",
              padding: "44px 48px",
              borderRadius: RADIUS.card,
              border: `4px solid ${quote.best ? COLORS.blue : COLORS.line}`,
              background: quote.best ? COLORS.lightBg : COLORS.grayBg,
            }}
          >
            {quote.best ? (
              <div style={{ position: "absolute", top: -30, left: 40, transform: `scale(${badgePop})` }}>
                <Badge>{compare.badge}</Badge>
              </div>
            ) : null}
            <div style={{ fontSize: 34, fontWeight: 700, color: quote.best ? COLORS.navy : COLORS.subText }}>
              {quote.supplier}
            </div>
            <CountUp
              value={quote.total}
              start={10}
              duration={30}
              suffix="원"
              style={{
                display: "block",
                marginTop: 36,
                fontSize: 76,
                fontWeight: 800,
                color: quote.best ? COLORS.blue : COLORS.muted,
              }}
            />
            <div style={{ marginTop: 16, fontSize: 28, color: COLORS.subText }}>{quote.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
