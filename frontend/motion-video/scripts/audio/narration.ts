// 실행
//   npm run audio:narration                       → 가이드 TTS로 public/audio/narration.wav 생성
//   npm run audio:narration -- --from <폴더>       → 성우·외부 TTS 녹음(<폴더>/<scene>.wav)으로 생성
// 공통: 씬 타이밍에 배치 → 목소리 EQ·컴프레서 → 라우드니스 정규화
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { AUDIO_FILES, MUSIC, NARRATION, VOICE, lineMaxSec, lineStartSec } from "../../src/config/audio";
import { type LineAudio, fileSource, guideSource } from "./sources";
import { writeWav } from "./wav";

const projectRoot = join(import.meta.dirname, "..", "..");

const placeOnTimeline = (lines: ReadonlyArray<LineAudio>, sampleRate: number): Float32Array => {
  const timeline = new Float32Array(Math.ceil(MUSIC.totalSec * sampleRate));
  lines.forEach(({ line, samples }) => {
    const start = Math.round(lineStartSec(line) * sampleRate);
    timeline.set(samples.subarray(0, Math.max(0, timeline.length - start)), start);
  });
  return timeline;
};

/** 목소리 대역 EQ + 컴프레서 + 라우드니스. pitchSemitones가 0이 아니면 템포를 유지한 채 피치를 올린다 */
const masteringFilter = (sampleRate: number): string => {
  const ratio = 2 ** (VOICE.pitchSemitones / 12);
  const pitch = VOICE.pitchSemitones === 0 ? [] : [`asetrate=${Math.round(sampleRate * ratio)}`, `atempo=${(1 / ratio).toFixed(5)}`];
  return [
    ...pitch,
    `aresample=${VOICE.outputSampleRate}`,
    "highpass=f=90",
    "equalizer=f=250:t=q:w=1:g=-2",
    "equalizer=f=3200:t=q:w=1.2:g=3",
    "equalizer=f=9000:t=h:w=2000:g=2",
    "acompressor=threshold=-20dB:ratio=3:attack=5:release=80",
    `loudnorm=I=${VOICE.loudnessLufs}:TP=-1.5:LRA=7`,
    `aresample=${VOICE.outputSampleRate}`,
  ].join(",");
};

const main = async (): Promise<void> => {
  const { values } = parseArgs({ options: { from: { type: "string" } } });
  const sourceDir = values.from ?? process.env.NARRATION_SOURCE_DIR;
  const lines = sourceDir ? fileSource(resolve(sourceDir), NARRATION) : await guideSource(projectRoot, NARRATION);
  console.log(`[narration] 소스: ${sourceDir ? `녹음 파일 (${resolve(sourceDir)})` : "가이드 TTS (KSS 오프라인 모델)"}`);

  lines.forEach(({ line, samples, sampleRate, note }) => {
    const sec = samples.length / sampleRate;
    console.log(
      `[narration] ${line.scene.padEnd(8)} ${lineStartSec(line).toFixed(2)}s +${sec.toFixed(2)}s / 최대 ${lineMaxSec(line).toFixed(2)}s  ${note}  ${line.text}`,
    );
  });

  const sampleRate = lines[0]?.sampleRate;
  if (!sampleRate) {
    throw new Error("내레이션 문장이 없습니다 (src/config/audio.ts NARRATION).");
  }

  const workDir = mkdtempSync(join(tmpdir(), "gongsaero-narration-"));
  try {
    const raw = join(workDir, "narration-raw.wav");
    writeWav(raw, [placeOnTimeline(lines, sampleRate)], sampleRate);
    const output = join(projectRoot, "public", AUDIO_FILES.narration);
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", raw, "-af", masteringFilter(sampleRate), "-ac", "2", output]);
    console.log(`[narration] 완료 → ${output}`);
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  const hint = message.includes("ENOENT") && message.includes("ffmpeg") ? " (ffmpeg를 설치하세요)" : "";
  console.error(`[narration] 실패: ${message}${hint}`);
  process.exit(1);
});
