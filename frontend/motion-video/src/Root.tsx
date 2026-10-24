import { Composition } from "remotion";
import { TOTAL_FRAMES } from "./config/content";
import { VIDEO } from "./config/theme";
import { GongsaeroVideo } from "./Video";

export const RemotionRoot = () => (
  <Composition
    id="GongsaeroMain"
    component={GongsaeroVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
