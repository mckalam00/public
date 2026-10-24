import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  cancelRender,
  continueRender,
  delayRender,
  getStaticFiles,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  BROCHURE_MUSIC_FILE,
  BROCHURE_PAGES,
  BROCHURE_TOTAL_FRAMES,
  TRANSITION_FRAMES,
  pageFrames,
  pageStarts,
} from "../config/brochure";
import { COLORS, FONT_FAMILY, VIDEO } from "../config/theme";
import { loadBrandFonts } from "../lib/fonts";
import { BrochurePage } from "./BrochurePage";

const MUSIC_FADE = { inSec: 1, outSec: 3 } as const;
// 음량은 build-music.ts에서 −16 LUFS로 맞춰 두었다
const MUSIC_VOLUME = 1;

const musicVolume = (frame: number): number =>
  interpolate(
    frame,
    [0, MUSIC_FADE.inSec * VIDEO.fps, BROCHURE_TOTAL_FRAMES - MUSIC_FADE.outSec * VIDEO.fps, BROCHURE_TOTAL_FRAMES],
    [0, MUSIC_VOLUME, MUSIC_VOLUME, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

/** 현재 페이지 번호·섹션과 전체 진행률 */
const ProgressOverlay = () => {
  const frame = useCurrentFrame();
  const index = pageStarts.reduce((found, start, i) => (frame >= start + TRANSITION_FRAMES / 2 ? i : found), 0);
  const page = BROCHURE_PAGES[index];
  const visible = interpolate(frame, [pageStarts[1] ?? 0, (pageStarts[1] ?? 0) + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dark = page.tone === "dark";

  return (
    <AbsoluteFill style={{ fontFamily: FONT_FAMILY, pointerEvents: "none", opacity: visible }}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 32,
          display: "flex",
          gap: 14,
          alignItems: "center",
          padding: "10px 22px",
          borderRadius: 999,
          background: dark ? "rgba(255,255,255,0.14)" : "rgba(11,42,107,0.82)",
          color: COLORS.surface,
          fontSize: 22,
          fontWeight: 600,
        }}
      >
        <span style={{ opacity: 0.75 }}>{page.section}</span>
        <span>{page.title}</span>
        <span style={{ opacity: 0.75, fontVariantNumeric: "tabular-nums" }}>
          {String(page.page).padStart(2, "0")} / {String(BROCHURE_PAGES.length).padStart(2, "0")}
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: "rgba(11,42,107,0.12)" }}>
        <div style={{ height: "100%", width: `${(frame / BROCHURE_TOTAL_FRAMES) * 100}%`, background: COLORS.blue }} />
      </div>
    </AbsoluteFill>
  );
};

/** 소개서 20페이지를 순서대로 보여 주는 영상 */
export const BrochureVideo = () => {
  const [handle] = useState(() => delayRender("Pretendard 폰트 로딩"));
  useEffect(() => {
    loadBrandFonts()
      .then(() => continueRender(handle))
      .catch((error: unknown) => cancelRender(new Error(`폰트 로딩 실패: ${String(error)}`)));
  }, [handle]);

  const hasMusic = getStaticFiles().some((file) => file.name === BROCHURE_MUSIC_FILE);

  return (
    <AbsoluteFill style={{ background: COLORS.navyDeep }}>
      {hasMusic ? <Audio src={staticFile(BROCHURE_MUSIC_FILE)} volume={musicVolume} /> : null}
      {BROCHURE_PAGES.map((page, i) => {
        const isLast = i === BROCHURE_PAGES.length - 1;
        return (
          <Sequence key={page.page} from={pageStarts[i]} durationInFrames={pageFrames(page, isLast)} name={`p${page.page} ${page.title}`}>
            <BrochurePage page={page} isFirst={i === 0} isLast={isLast} />
          </Sequence>
        );
      })}
      <ProgressOverlay />
    </AbsoluteFill>
  );
};
