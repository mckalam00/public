import { Img, staticFile, useCurrentFrame } from "remotion";
import { PAGE_IMAGE } from "../config/brochure";
import { enterStyle, exitStyle, mergeStyles, motionKindOf } from "./elementMotion";
import type { LayoutElement } from "./layout";

type Props = Readonly<{
  element: LayoutElement;
  page: number;
  refWidth: number;
  refHeight: number;
  enterAt: number;
  enterFrames: number;
  /** 퇴장 시작 프레임. 마지막 페이지는 null */
  exitAt: number | null;
  exitFrames: number;
}>;

/** 해체된 구성요소 하나. 좌표는 페이지 공간(ref px) */
export const ElementLayer = ({ element, page, refWidth, refHeight, enterAt, enterFrames, exitAt, exitFrames }: Props) => {
  const frame = useCurrentFrame();
  if (frame < enterAt) return null;

  const { box } = element;
  const kind = motionKindOf(element);
  const enter = enterStyle(kind, frame, enterAt, enterFrames);
  const exit = exitAt === null ? {} : exitStyle(frame, exitAt, exitFrames);
  const outer = mergeStyles(enter.outer, exit);

  const base = {
    position: "absolute",
    left: box.x,
    top: box.y,
    width: box.w,
    height: box.h,
    transformOrigin: "50% 50%",
  } as const;

  if (element.kind === "panel") {
    return <div style={{ ...base, ...outer, background: element.color, borderRadius: element.radius }} />;
  }

  return (
    <div style={{ ...base, ...outer, overflow: "hidden" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformOrigin: "50% 50%", ...enter.inner }}>
        <Img
          src={staticFile(`${PAGE_IMAGE.dir}/${PAGE_IMAGE.fileName(page)}`)}
          style={{ position: "absolute", left: -box.x, top: -box.y, width: refWidth, height: refHeight, maxWidth: "none" }}
        />
      </div>
    </div>
  );
};
