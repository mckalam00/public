import type { CSSProperties } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { FONT_FAMILY } from "../config/theme";
import { formatNumber } from "../lib/anim";

type Props = Readonly<{
  value: number;
  start: number;
  duration: number;
  suffix?: string;
  prefix?: string;
  style?: CSSProperties;
}>;

/** 0에서 목표값까지 감속하며 올라가는 숫자 */
export const CountUp = ({ value, start, duration, suffix = "", prefix = "", style }: Props) => {
  const frame = useCurrentFrame();
  const current = interpolate(frame, [start, start + duration], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <span style={{ fontFamily: FONT_FAMILY, fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {formatNumber(current)}
      {suffix}
    </span>
  );
};
