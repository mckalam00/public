import { Audio, getStaticFiles, interpolate, staticFile } from "remotion";
import { AUDIO_FILES, MIX, NARRATION, lineMaxSec, lineStartSec } from "../config/audio";
import { VIDEO } from "../config/theme";

// npm run audio로 만든 파일이 있을 때만 붙인다. 없으면 무음으로 렌더링된다.
const hasFile = (path: string): boolean => getStaticFiles().some((file) => file.name === path);

const VOICE_WINDOWS = NARRATION.map((line) => {
  const start = lineStartSec(line) * VIDEO.fps;
  return { start, end: start + lineMaxSec(line) * VIDEO.fps };
});

const RAMP = MIX.duckRampSec * VIDEO.fps;

/** 내레이션 구간에서는 배경음악을 낮추고(덕킹), 사이 구간에서는 다시 올린다 */
const musicVolume = (frame: number): number => {
  const duck = VOICE_WINDOWS.reduce((max, w) => {
    const amount = interpolate(frame, [w.start - RAMP, w.start, w.end, w.end + RAMP], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return Math.max(max, amount);
  }, 0);
  return MIX.music - (MIX.music - MIX.musicDucked) * duck;
};

export const AudioTracks = () => (
  <>
    {hasFile(AUDIO_FILES.music) ? <Audio src={staticFile(AUDIO_FILES.music)} volume={musicVolume} /> : null}
    {hasFile(AUDIO_FILES.sfx) ? <Audio src={staticFile(AUDIO_FILES.sfx)} volume={MIX.sfx} /> : null}
    {hasFile(AUDIO_FILES.narration) ? <Audio src={staticFile(AUDIO_FILES.narration)} volume={MIX.narration} /> : null}
  </>
);
