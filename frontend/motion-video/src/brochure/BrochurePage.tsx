import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ASSEMBLY_FRAMES,
  type BrochurePage as Page,
  EXIT_FRAMES,
  PAGE_IMAGE,
  TRANSITION_FRAMES,
  pageExitStart,
  pageTimeline,
} from "../config/brochure";
import { progress } from "../lib/anim";
import { cameraAt } from "../lib/camera";
import { ElementLayer } from "./ElementLayer";
import type { LayoutElement, PageLayout } from "./layout";

type Props = Readonly<{
  page: Page;
  layout: PageLayout;
  refWidth: number;
  refHeight: number;
  isFirst: boolean;
  isLast: boolean;
}>;

/** 확대 상한: 원본 이미지 해상도의 1.1배까지만 (그 이상은 흐려진다) */
const MAX_SCALE = PAGE_IMAGE.width * 1.1;
const ENTER_FRAMES = 18;
const ENTER_LEAD = 4;
/** 패널 위 요소는 패널이 펼쳐진 뒤에 들어온다 */
const CHILD_DELAY = 6;
const EXIT_EACH = 8;

type Schedule = Readonly<{ element: LayoutElement; enterAt: number; exitAt: number | null }>;

/** 읽는 순서(id 순)로 등장, 역순으로 퇴장. 요소 수와 관계없이 조립 시간 안에 끝나도록 간격을 줄인다 */
const schedule = (elements: ReadonlyArray<LayoutElement>, exitStart: number | null): ReadonlyArray<Schedule> => {
  const n = Math.max(1, elements.length);
  const stagger = Math.min(4, (ASSEMBLY_FRAMES - ENTER_FRAMES - ENTER_LEAD) / n);
  const enterById = new Map<number, number>();
  return elements.map((element, i) => {
    const parentEnter = element.parent === null ? undefined : enterById.get(element.parent);
    const enterAt = Math.round(Math.max(ENTER_LEAD + i * stagger, parentEnter === undefined ? 0 : parentEnter + CHILD_DELAY));
    enterById.set(element.id, enterAt);
    const exitAt = exitStart === null ? null : exitStart + Math.floor(((n - 1 - i) / n) * (EXIT_FRAMES - EXIT_EACH));
    return { element, enterAt, exitAt };
  });
};

/** 소개서 한 페이지: 구성요소 조립 → 카메라 투어 → 해체 */
export const BrochurePage = ({ page, layout, refWidth, refHeight, isFirst, isLast }: Props) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const timeline = useMemo(() => pageTimeline(page, isLast), [page, isLast]);
  const plan = useMemo(() => schedule(layout.elements, pageExitStart(page, isLast)), [layout, page, isLast]);
  const camera = cameraAt(timeline, frame, { width, height, maxScale: MAX_SCALE });

  const scale = camera.scale / refWidth;
  const left = width / 2 - camera.cx * camera.scale;
  const top = height / 2 - camera.cy * camera.scale;
  const backgroundOpacity = isFirst ? 1 : progress(frame, 0, TRANSITION_FRAMES);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: layout.background, opacity: backgroundOpacity }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: refWidth,
          height: refHeight,
          transformOrigin: "0 0",
          transform: `translate(${left}px, ${top}px) scale(${scale})`,
        }}
      >
        {plan.map(({ element, enterAt, exitAt }) => (
          <ElementLayer
            key={element.id}
            element={element}
            page={page.page}
            refWidth={refWidth}
            refHeight={refHeight}
            enterAt={enterAt}
            enterFrames={ENTER_FRAMES}
            exitAt={exitAt}
            exitFrames={EXIT_EACH}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
