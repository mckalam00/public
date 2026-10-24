import { Easing, interpolate } from "remotion";
import { PAGE_ASPECT, type Region, type ShotTiming } from "../config/brochure";
import { lerp } from "./anim";

/** scale: 페이지 가로 1을 화면 몇 px로 그릴지 / cx·cy: 화면 중앙에 올 페이지 좌표(가로 기준 단위) */
export type Camera = Readonly<{ scale: number; cx: number; cy: number }>;

type Viewport = Readonly<{ width: number; height: number; maxScale: number }>;

/** 정지 중 아주 느리게 다가가는 정도 (살아 있는 화면감) */
const HOLD_DRIFT = 0.025;
const FIT_W = 0.9;
const FIT_H = 0.86;

const ease = Easing.bezier(0.65, 0, 0.35, 1);

export const cameraFor = (region: Region, vp: Viewport): Camera => {
  const w = region.w;
  const h = region.h / PAGE_ASPECT;
  const fit = Math.min((vp.width * FIT_W) / w, (vp.height * FIT_H) / h);
  return {
    scale: Math.min(fit, vp.maxScale),
    cx: region.x + region.w / 2,
    cy: (region.y + region.h / 2) / PAGE_ASPECT,
  };
};

const drift = (camera: Camera, amount: number): Camera => ({ ...camera, scale: camera.scale * (1 + HOLD_DRIFT * amount) });

/** 크기는 로그 공간에서 보간해야 확대 속도가 일정하게 느껴진다 */
const blend = (a: Camera, b: Camera, t: number): Camera => ({
  scale: Math.exp(lerp(Math.log(a.scale), Math.log(b.scale), t)),
  cx: lerp(a.cx, b.cx, t),
  cy: lerp(a.cy, b.cy, t),
});

const holdAmount = (frame: number, shot: ShotTiming): number =>
  interpolate(frame, [shot.holdStart, shot.holdEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** 타임라인의 현재 프레임 카메라 */
export const cameraAt = (timeline: ReadonlyArray<ShotTiming>, frame: number, vp: Viewport): Camera => {
  const cams = timeline.map((s) => cameraFor(s.region, vp));
  const nextIndex = timeline.findIndex((s, i) => i > 0 && frame < s.holdStart);
  if (nextIndex < 0) {
    const last = timeline.length - 1;
    return drift(cams[last], holdAmount(frame, timeline[last]));
  }
  const prev = nextIndex - 1;
  const next = timeline[nextIndex];
  if (frame < next.moveStart) {
    return drift(cams[prev], holdAmount(frame, timeline[prev]));
  }
  const t = ease((frame - next.moveStart) / Math.max(1, next.holdStart - next.moveStart));
  return blend(drift(cams[prev], 1), cams[nextIndex], t);
};
