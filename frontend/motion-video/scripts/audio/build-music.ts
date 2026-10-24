// 실행: npm run audio:music → public/audio/music.wav, public/audio/sfx.wav
import { join } from "node:path";
import { AUDIO_FILES } from "../../src/config/audio";
import { composeMusic } from "./music";
import { composeSfx } from "./sfx";
import { SAMPLE_RATE } from "./synth";
import { writeWav } from "./wav";

const publicDir = join(import.meta.dirname, "..", "..", "public");

const jobs = [
  { name: "배경음악", path: join(publicDir, AUDIO_FILES.music), compose: composeMusic },
  { name: "효과음", path: join(publicDir, AUDIO_FILES.sfx), compose: composeSfx },
] as const;

jobs.forEach(({ name, path, compose }) => {
  const started = Date.now();
  const { left, right } = compose();
  writeWav(path, [left, right], SAMPLE_RATE);
  console.log(`[audio] ${name} → ${path} (${(left.length / SAMPLE_RATE).toFixed(2)}s, ${Date.now() - started}ms)`);
});
