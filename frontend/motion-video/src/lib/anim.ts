import type { CSSProperties } from "react";
import { interpolate, random } from "remotion";
import { EASE_IN, EASE_OUT } from "../config/theme";

type EasingFn = (input: number) => number;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** start 프레임부터 duration 동안 0→1로 진행하는 값 */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: EasingFn = EASE_OUT,
): number => interpolate(frame, [start, start + duration], [0, 1], { ...CLAMP, easing });

/** 아래에서 위로 떠오르며 나타나는 스타일 */
export const fadeUp = (frame: number, start: number, duration = 14, distance = 28): CSSProperties => {
  const p = progress(frame, start, duration);
  return { opacity: p, transform: `translateY(${(1 - p) * distance}px)` };
};

/** 씬 끝에서 사라지는 불투명도 */
export const fadeOutAt = (frame: number, end: number, duration = 10): number =>
  1 - progress(frame, end - duration, duration, EASE_IN);

/** 두 값 사이 선형 보간 */
export const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

export type ChaosItem = Readonly<{
  x: number;
  y: number;
  rotate: number;
  delay: number;
  /** content.ts HOOK.chaosItems의 인덱스 */
  contentIndex: number;
}>;

const GRID_COLS = 6;
const CHAOS_TOP = 90;
/** 헤드라인(하단)을 침범하지 않도록 카드가 머무는 영역의 하단 비율 */
const CHAOS_BOTTOM_RATIO = 0.6;

/**
 * S1(흩어짐)과 S3(수렴)이 같은 좌표를 쓰도록 결정적(seeded) 배치를 만든다.
 * 격자 셀마다 하나씩 두고 셀 안에서만 흔들어 겹침을 줄인다.
 */
export const chaosLayout = (
  count: number,
  width: number,
  height: number,
  contentCount: number,
): ReadonlyArray<ChaosItem> => {
  const rows = Math.ceil(count / GRID_COLS);
  const cellW = width / GRID_COLS;
  const cellH = (height * CHAOS_BOTTOM_RATIO - CHAOS_TOP) / rows;
  return Array.from({ length: count }, (_, i) => {
    const seed = `chaos-${i}`;
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    const rowShift = row % 2 === 0 ? 0 : cellW * 0.35;
    return {
      x: cellW * (col + 0.3 + random(`${seed}-x`) * 0.4) + rowShift - cellW * 0.15,
      y: CHAOS_TOP + cellH * (row + 0.25 + random(`${seed}-y`) * 0.5),
      rotate: (random(`${seed}-r`) - 0.5) * 18,
      delay: Math.floor(random(`${seed}-d`) * 70),
      contentIndex: i % contentCount,
    };
  });
};

/** 정수 천 단위 구분 */
export const formatNumber = (value: number): string =>
  Math.round(value).toLocaleString("ko-KR");
