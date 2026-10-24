import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { AbsoluteFill, Series, cancelRender, continueRender, delayRender } from "remotion";
import { AudioTracks } from "./components/AudioTracks";
import { SCENE_TIMINGS, type SceneId, sceneFrames } from "./config/content";
import { COLORS } from "./config/theme";
import { loadBrandFonts } from "./lib/fonts";
import { S1Hook } from "./scenes/S1Hook";
import { S2Problem } from "./scenes/S2Problem";
import { S3Turn } from "./scenes/S3Turn";
import { S4Solution } from "./scenes/S4Solution";
import { S5Platform } from "./scenes/S5Platform";
import { S6Asset } from "./scenes/S6Asset";
import { S7Proof } from "./scenes/S7Proof";
import { S8Cta } from "./scenes/S8Cta";

const SCENES: Record<SceneId, ComponentType> = {
  hook: S1Hook,
  problem: S2Problem,
  turn: S3Turn,
  solution: S4Solution,
  platform: S5Platform,
  asset: S6Asset,
  proof: S7Proof,
  cta: S8Cta,
};

/** 45초 마스터: content.ts의 SCENE_TIMINGS 순서대로 씬을 이어 붙인다 */
export const GongsaeroVideo = () => {
  const [handle] = useState(() => delayRender("Pretendard 폰트 로딩"));

  useEffect(() => {
    loadBrandFonts()
      .then(() => continueRender(handle))
      .catch((error: unknown) => {
        // 폰트 없이 렌더링하면 한글이 대체 폰트로 나오므로 렌더링 자체를 중단한다
        cancelRender(new Error(`폰트 로딩 실패: public/fonts를 확인하세요 (npm install 재실행). ${String(error)}`));
      });
  }, [handle]);

  return (
    <AbsoluteFill style={{ background: COLORS.navy }}>
      <AudioTracks />
      <Series>
        {SCENE_TIMINGS.map(({ id }) => {
          const Scene = SCENES[id];
          return (
            <Series.Sequence key={id} durationInFrames={sceneFrames(id)} name={id}>
              <Scene />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
