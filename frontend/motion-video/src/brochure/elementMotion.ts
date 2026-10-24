// 해체된 구성요소의 등장·퇴장 모션.
// 등장 방식은 요소의 모양으로 정한다: 글줄=마스크 업, 넓은 띠=와이프, 사진·화면=줌인, 작은 요소=팝, 패널=펼침.
import type { CSSProperties } from "react";
import { Easing, interpolate } from "remotion";
import { EASE_IN, EASE_OUT } from "../config/theme";
import type { LayoutElement } from "./layout";

export type MotionKind = "panel" | "maskUp" | "wipe" | "zoom" | "pop";

const TEXT_LINE_MAX_H = 130;
const TEXT_LINE_MIN_RATIO = 2.2;
const WIDE_MIN_W = 1100;
const LARGE_MIN_AREA = 120_000;

export const motionKindOf = (el: LayoutElement): MotionKind => {
  if (el.kind === "panel") return "panel";
  const { w, h } = el.box;
  if (h <= TEXT_LINE_MAX_H && w / h >= TEXT_LINE_MIN_RATIO) return "maskUp";
  if (w >= WIDE_MIN_W) return "wipe";
  if (w * h >= LARGE_MIN_AREA) return "zoom";
  return "pop";
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const overshoot = Easing.out(Easing.back(1.6));

/** 바깥 상자(자르기 영역)와 안쪽 내용에 각각 줄 스타일 */
export type MotionStyle = Readonly<{ outer: CSSProperties; inner: CSSProperties }>;

export const enterStyle = (kind: MotionKind, frame: number, start: number, duration: number): MotionStyle => {
  const t = interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: EASE_OUT });
  if (kind === "maskUp") {
    return { outer: {}, inner: { transform: `translateY(${(1 - t) * 105}%)` } };
  }
  if (kind === "wipe") {
    return { outer: { clipPath: `inset(0 ${(1 - t) * 100}% 0 0)` }, inner: {} };
  }
  if (kind === "zoom") {
    return { outer: { opacity: t }, inner: { transform: `scale(${1.12 - 0.12 * t})` } };
  }
  if (kind === "panel") {
    return { outer: { opacity: Math.min(1, t * 2), transform: `scale(${0.94 + 0.06 * t}, ${0.7 + 0.3 * t})` }, inner: {} };
  }
  const p = interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: overshoot });
  return { outer: { opacity: Math.min(1, t * 2.5), transform: `scale(${0.6 + 0.4 * p})` }, inner: {} };
};

/** 퇴장: 살짝 떠오르며 사라진다 */
export const exitStyle = (frame: number, start: number, duration: number): CSSProperties => {
  const t = interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: EASE_IN });
  return t === 0 ? {} : { opacity: 1 - t, transform: `translateY(${-30 * t}px)` };
};

/** 두 transform을 겹친다 (등장 + 퇴장) */
export const mergeStyles = (a: CSSProperties, b: CSSProperties): CSSProperties => ({
  ...a,
  ...b,
  opacity: (typeof a.opacity === "number" ? a.opacity : 1) * (typeof b.opacity === "number" ? b.opacity : 1),
  transform: [a.transform, b.transform].filter(Boolean).join(" ") || undefined,
});
