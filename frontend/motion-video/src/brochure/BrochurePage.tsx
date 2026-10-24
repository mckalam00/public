import { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { type BrochurePage as Page, PAGE_ASPECT, PAGE_IMAGE, TRANSITION_FRAMES, pageTimeline } from "../config/brochure";
import { COLORS } from "../config/theme";
import { progress } from "../lib/anim";
import { cameraAt } from "../lib/camera";

type Props = Readonly<{ page: Page; isFirst: boolean; isLast: boolean }>;

/** 확대 상한: 원본 이미지 해상도의 1.1배까지만 (그 이상은 흐려진다) */
const MAX_SCALE = PAGE_IMAGE.width * 1.1;

const BACKDROP = {
  light: `radial-gradient(circle at 50% 40%, ${COLORS.surface} 0%, ${COLORS.lightBg} 70%)`,
  dark: `radial-gradient(circle at 50% 40%, ${COLORS.navySoft} 0%, ${COLORS.navyDeep} 75%)`,
} as const;

/** 소개서 한 페이지: 전체 → 영역별 확대 카메라 */
export const BrochurePage = ({ page, isFirst, isLast }: Props) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const timeline = useMemo(() => pageTimeline(page, isLast), [page, isLast]);
  const camera = cameraAt(timeline, frame, { width, height, maxScale: MAX_SCALE });

  // 다음 페이지가 위에서 페이드 인하므로 현재 페이지는 그대로 둔다
  const opacity = isFirst ? progress(frame, 0, 12) : progress(frame, 0, TRANSITION_FRAMES);
  const pageWidth = camera.scale;
  const pageHeight = camera.scale / PAGE_ASPECT;
  const left = width / 2 - camera.cx * camera.scale;
  const top = height / 2 - camera.cy * camera.scale;

  return (
    <AbsoluteFill style={{ background: BACKDROP[page.tone], opacity }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: pageWidth,
          height: pageHeight,
          boxShadow: "0 30px 90px rgba(7, 29, 77, 0.25)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(`${PAGE_IMAGE.dir}/${PAGE_IMAGE.fileName(page.page)}`)}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
    </AbsoluteFill>
  );
};
