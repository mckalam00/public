// 내레이션 입력 소스
// - guide: 오프라인 TTS(KSS 여성 화자)로 만드는 타이밍 확인용 가이드 녹음
// - files: 성우·외부 TTS로 만든 씬별 WAV(<dir>/<scene>.wav)를 불러와 길이를 맞춤
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sherpa from "sherpa-onnx-node";
import { type NarrationLine, VOICE, lineMaxSec } from "../../src/config/audio";
import { ensureModel } from "./model";

export type LineAudio = Readonly<{ line: NarrationLine; samples: Float32Array; sampleRate: number; note: string }>;

/** ffmpeg atempo 한 번에 허용되는 범위 안에서만 늘이고 줄인다 */
const MAX_FILE_TEMPO = 1.25;
const MAX_TTS_SPEED = 1.35;
const FILE_SAMPLE_RATE = 48_000;
const FFMPEG_MAX_BUFFER = 256 * 1024 * 1024;

const durationOf = (samples: Float32Array, sampleRate: number): number => samples.length / sampleRate;

/** 앞뒤 무음을 잘라 실제 발화 길이만 남긴다 */
export const trimSilence = (samples: Float32Array, threshold = 0.01): Float32Array => {
  const first = samples.findIndex((v) => Math.abs(v) > threshold);
  if (first < 0) return samples;
  let last = samples.length - 1;
  while (last > first && Math.abs(samples[last]) <= threshold) last -= 1;
  return samples.slice(Math.max(0, first - 200), Math.min(samples.length, last + 400));
};

const warnIfTooLong = (line: NarrationLine, samples: Float32Array, sampleRate: number): void => {
  if (durationOf(samples, sampleRate) > lineMaxSec(line)) {
    console.warn(`[narration] 경고: "${line.text}"가 씬 길이(${lineMaxSec(line).toFixed(2)}s)를 넘습니다. 문장을 줄이세요.`);
  }
};

export const guideSource = async (projectRoot: string, lines: ReadonlyArray<NarrationLine>): Promise<ReadonlyArray<LineAudio>> => {
  const model = await ensureModel(projectRoot);
  const tts = new sherpa.OfflineTts({
    model: { vits: { model: model.model, tokens: model.tokens, dataDir: model.dataDir }, numThreads: 2, provider: "cpu", debug: false },
    maxNumSentences: 1,
  });

  return lines.map((line) => {
    const render = (speed: number) => {
      const audio = tts.generate({ text: line.speech, sid: 0, speed });
      return { samples: trimSilence(audio.samples), sampleRate: audio.sampleRate };
    };
    const first = render(VOICE.speed);
    const firstSec = durationOf(first.samples, first.sampleRate);
    if (firstSec <= lineMaxSec(line)) {
      return { line, ...first, note: `TTS 속도 ${VOICE.speed.toFixed(2)}` };
    }
    const speed = Math.min(MAX_TTS_SPEED, VOICE.speed * (firstSec / lineMaxSec(line)) * 1.03);
    const fitted = render(speed);
    warnIfTooLong(line, fitted.samples, fitted.sampleRate);
    return { line, ...fitted, note: `TTS 속도 ${speed.toFixed(2)} (씬 길이에 맞춤)` };
  });
};

const decode = (path: string, tempo: number): Float32Array => {
  const filters = ["aformat=channel_layouts=mono", ...(tempo === 1 ? [] : [`atempo=${tempo.toFixed(4)}`])].join(",");
  const raw = execFileSync(
    "ffmpeg",
    ["-loglevel", "error", "-i", path, "-af", filters, "-ar", String(FILE_SAMPLE_RATE), "-f", "f32le", "-"],
    { maxBuffer: FFMPEG_MAX_BUFFER },
  );
  return trimSilence(new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4));
};

export const fileSource = (dir: string, lines: ReadonlyArray<NarrationLine>): ReadonlyArray<LineAudio> => {
  const missing = lines.map((line) => join(dir, `${line.scene}.wav`)).filter((path) => !existsSync(path));
  if (missing.length > 0) {
    throw new Error(`녹음 파일이 없습니다:\n${missing.join("\n")}\n씬 ID(${lines.map((l) => l.scene).join(", ")}).wav 이름으로 저장하세요.`);
  }

  return lines.map((line) => {
    const path = join(dir, `${line.scene}.wav`);
    const original = decode(path, 1);
    const sec = durationOf(original, FILE_SAMPLE_RATE);
    if (sec <= lineMaxSec(line)) {
      return { line, samples: original, sampleRate: FILE_SAMPLE_RATE, note: "원본 길이" };
    }
    const tempo = Math.min(MAX_FILE_TEMPO, (sec / lineMaxSec(line)) * 1.02);
    const fitted = decode(path, tempo);
    warnIfTooLong(line, fitted, FILE_SAMPLE_RATE);
    return { line, samples: fitted, sampleRate: FILE_SAMPLE_RATE, note: `템포 ×${tempo.toFixed(2)} (씬 길이에 맞춤)` };
  });
};
