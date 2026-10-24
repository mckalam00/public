import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CountUp } from "../../components/CountUp";
import { Badge, Cursor } from "../../components/Frame";
import { CheckIcon } from "../../components/Icons";
import { SOLUTION } from "../../config/content";
import { COLORS } from "../../config/theme";
import { fadeUp, formatNumber, lerp, progress } from "../../lib/anim";
import { PANEL_PADDING, PanelTitle } from "./PanelsRequest";

/** 03 실시간 발주 및 납품 관리 */
export const OrderPanel = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { order } = SOLUTION;
  const badgePop = spring({ frame: frame - 28, fps, config: { damping: 9 } });

  return (
    <div style={{ padding: PANEL_PADDING, height: "100%", position: "relative" }}>
      <PanelTitle>{order.title}</PanelTitle>
      <div style={{ position: "absolute", top: PANEL_PADDING - 6, right: PANEL_PADDING, transform: `scale(${badgePop})` }}>
        <Badge color={COLORS.orange} fontSize={32}>
          {order.badge}
        </Badge>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {order.statuses.map((status, i) => (
          <div
            key={status.label}
            style={{
              ...fadeUp(frame, 2 + i * 3),
              padding: "30px 36px",
              borderRadius: 20,
              border: `2px solid ${COLORS.line}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <span style={{ fontSize: 30, color: COLORS.subText, fontWeight: 600 }}>{status.label}</span>
            <span style={{ fontSize: 60, fontWeight: 800, color: COLORS.blue }}>
              <CountUp value={status.count} start={6} duration={26} />
              <span style={{ fontSize: 26, marginLeft: 6, color: COLORS.subText }}>건</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SKELETON_ROWS = 4;

/** 04 검수 및 간편 정산 */
export const SettlePanel = () => {
  const frame = useCurrentFrame();
  const { settle } = SOLUTION;
  const clickAt = settle.clickFrame;
  const done = progress(frame, clickAt + 6, 12);
  const cursorMove = progress(frame, 12, 20);

  return (
    <div style={{ padding: PANEL_PADDING, height: "100%", position: "relative" }}>
      <PanelTitle>{settle.title}</PanelTitle>
      <div style={{ fontSize: 30, color: COLORS.subText, marginTop: -20, marginBottom: 30 }}>{settle.summary}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 860 }}>
        {Array.from({ length: SKELETON_ROWS }, (_, i) => (
          <div
            key={`row-${i}`}
            style={{
              ...fadeUp(frame, 2 + i * 3),
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "20px 26px",
              borderRadius: 14,
              background: COLORS.grayBg,
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                background: COLORS.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckIcon size={24} color={COLORS.surface} />
            </span>
            <span style={{ height: 18, width: 200, borderRadius: 9, background: COLORS.line }} />
            <span style={{ height: 18, width: 320, borderRadius: 9, background: COLORS.line }} />
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: PANEL_PADDING,
          top: 220,
          width: 440,
          padding: "36px 40px",
          borderRadius: 24,
          background: COLORS.lightBg,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 600 }}>
          {settle.selectedLabel} <span style={{ color: COLORS.blue, fontWeight: 800 }}>{settle.pendingCount}건</span>
        </div>
        <div
          style={{
            padding: "22px 0",
            textAlign: "center",
            borderRadius: 14,
            background: done > 0.5 ? COLORS.blue : COLORS.navy,
            color: COLORS.surface,
            fontSize: 32,
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
          }}
        >
          {done > 0.5 ? <CheckIcon size={34} color={COLORS.surface} /> : null}
          {settle.action}
        </div>
      </div>
      <Cursor x={lerp(700, 1220, cursorMove)} y={lerp(560, 360, cursorMove)} clickAt={clickAt} />
    </div>
  );
};

const CHART_HEIGHT = 300;

/** 05 데이터 축적 및 인사이트 */
export const AnalyzePanel = () => {
  const frame = useCurrentFrame();
  const { analyze } = SOLUTION;
  const maxValue = Math.max(...analyze.sitesByYear.map((d) => d.value));

  return (
    <div style={{ padding: PANEL_PADDING, height: "100%", display: "flex", gap: 56 }}>
      <div style={{ width: 600 }}>
        <PanelTitle>{analyze.title}</PanelTitle>
        {analyze.savings.map((saving, i) => (
          <div key={saving.label} style={{ ...fadeUp(frame, 4 + i * 6), marginBottom: 34 }}>
            <div style={{ fontSize: 28, color: COLORS.subText, fontWeight: 600 }}>{saving.label}</div>
            <CountUp
              value={saving.amount}
              start={8}
              duration={34}
              suffix="원"
              style={{ fontSize: 58, fontWeight: 800, color: COLORS.blue }}
            />
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ fontSize: 26, color: COLORS.subText, fontWeight: 600, marginBottom: 20 }}>누적 현장 도입 수</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 40, height: CHART_HEIGHT + 60 }}>
          {analyze.sitesByYear.map((d, i) => {
            const grow = progress(frame, 6 + i * 5, 24);
            const isLast = i === analyze.sitesByYear.length - 1;
            return (
              <div key={d.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: isLast ? COLORS.navy : COLORS.subText, opacity: grow }}>
                  {formatNumber(d.value * grow)}개소
                </span>
                <div
                  style={{
                    width: "100%",
                    height: (d.value / maxValue) * CHART_HEIGHT * grow,
                    borderRadius: "16px 16px 0 0",
                    background: isLast ? COLORS.blue : COLORS.blueSoft,
                  }}
                />
                <span style={{ fontSize: 26, color: COLORS.subText }}>{d.year}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
