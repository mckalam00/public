// 실행: npm run audio:music → public/audio/music.wav, sfx.wav, brochure-music.wav
import { execFileSync } from "node:child_process";
import { renameSync } from "node:fs";
import { join } from "node:path";
import { AUDIO_FILES, MUSIC } from "../../src/config/audio";
import { BROCHURE_MUSIC_FILE, BROCHURE_TOTAL_FRAMES } from "../../src/config/brochure";
import { VIDEO } from "../../src/config/theme";
import { composeMusic } from "./music";
import { composeSfx } from "./sfx";
import { SAMPLE_RATE } from "./synth";
import { writeWav } from "./wav";

const publicDir = join(import.meta.dirname, "..", "..", "public");

const brochureSec = BROCHURE_TOTAL_FRAMES / VIDEO.fps;
// 소개서 영상: 긴장 구간 없이 바로 밝은 그루브, 마지막 3초 엔딩 코드
const brochureTiming = { bpm: MUSIC.bpm, dropSec: 0, outroSec: brochureSec - 3, totalSec: brochureSec } as const;

// 내레이션 없이 음악만 나오는 소개서 영상은 음악 자체를 웹 권장 음량으로 맞춘다
const BROCHURE_LOUDNESS_LUFS = -16;

type Job = Readonly<{ name: string; path: string; compose: () => ReturnType<typeof composeMusic>; loudnessLufs?: number }>;

const jobs: ReadonlyArray<Job> = [
  { name: "배경음악", path: join(publicDir, AUDIO_FILES.music), compose: () => composeMusic() },
  { name: "효과음", path: join(publicDir, AUDIO_FILES.sfx), compose: composeSfx },
  {
    name: "소개서 영상 배경음악",
    path: join(publicDir, BROCHURE_MUSIC_FILE),
    compose: () => composeMusic(brochureTiming),
    loudnessLufs: BROCHURE_LOUDNESS_LUFS,
  },
];

const normalizeLoudness = (path: string, lufs: number): void => {
  const temp = `${path}.tmp.wav`;
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path, "-af", `loudnorm=I=${lufs}:TP=-1.5:LRA=11`, "-ar", String(SAMPLE_RATE), temp]);
  renameSync(temp, path);
};

jobs.forEach(({ name, path, compose, loudnessLufs }) => {
  const started = Date.now();
  const { left, right } = compose();
  writeWav(path, [left, right], SAMPLE_RATE);
  if (loudnessLufs !== undefined) normalizeLoudness(path, loudnessLufs);
  console.log(`[audio] ${name} → ${path} (${(left.length / SAMPLE_RATE).toFixed(2)}s, ${Date.now() - started}ms)`);
});
