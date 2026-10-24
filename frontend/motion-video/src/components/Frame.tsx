import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, RADIUS, SHADOW } from "../config/theme";
import { fadeOutAt, progress } from "../lib/anim";

type ShellProps = Readonly<{ background: string; children: ReactNode; fadeOut?: boolean }>;

/** 씬 공통 래퍼: 짧은 페이드 인/아웃으로 컷 사이 튀는 느낌을 줄인다 */
export const SceneShell = ({ background, children, fadeOut = true }: ShellProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = progress(frame, 0, 6) * (fadeOut ? fadeOutAt(frame, durationInFrames, 6) : 1);
  return (
    <AbsoluteFill style={{ background, fontFamily: FONT_FAMILY, color: COLORS.text, wordBreak: "keep-all" }}>
      <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

type DeviceProps = Readonly<{ width: number; height: number; children: ReactNode; title?: string }>;

/** 브라우저 창 형태의 UI 목업 프레임 (소개서 화면 스타일) */
export const DeviceFrame = ({ width, height, children, title }: DeviceProps) => (
  <div
    style={{
      width,
      height,
      borderRadius: RADIUS.card,
      background: COLORS.surface,
      boxShadow: SHADOW.card,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      border: `1px solid ${COLORS.line}`,
    }}
  >
    <div
      style={{
        height: 56,
        background: COLORS.navy,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 24px",
        color: COLORS.surface,
        fontSize: 20,
        fontWeight: 600,
      }}
    >
      {["#FF5F57", "#FEBC2E", "#E5E7EB"].map((c) => (
        <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
      ))}
      {title ? <span style={{ marginLeft: 16 }}>{title}</span> : null}
    </div>
    <div style={{ flex: 1, position: "relative" }}>{children}</div>
  </div>
);

type CursorProps = Readonly<{ x: number; y: number; clickAt: number }>;

/** 가상 커서 + 클릭 리플 */
export const Cursor = ({ x, y, clickAt }: CursorProps) => {
  const frame = useCurrentFrame();
  const ripple = progress(frame, clickAt, 16);
  const pressed = frame >= clickAt && frame < clickAt + 5;
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
      {frame >= clickAt ? (
        <div
          style={{
            position: "absolute",
            left: -40 * ripple,
            top: -40 * ripple,
            width: 80 * ripple,
            height: 80 * ripple,
            borderRadius: "50%",
            border: `3px solid ${COLORS.blue}`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <svg width={44} height={44} viewBox="0 0 24 24" style={{ transform: `scale(${pressed ? 0.85 : 1})` }}>
        <path d="M4 2l15 10-7 1.5L9 21z" fill={COLORS.navy} stroke={COLORS.surface} strokeWidth={1.5} />
      </svg>
    </div>
  );
};

type BadgeProps = Readonly<{ children: ReactNode; color?: string; fontSize?: number }>;

export const Badge = ({ children, color = COLORS.blue, fontSize = 26 }: BadgeProps) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: `${fontSize * 0.45}px ${fontSize * 0.9}px`,
      borderRadius: RADIUS.pill,
      background: color,
      color: COLORS.surface,
      fontSize,
      fontWeight: 700,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);
