import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/** Float32 채널들을 16-bit PCM WAV로 저장한다 */
export const writeWav = (path: string, channels: ReadonlyArray<Float32Array>, sampleRate: number): void => {
  const frames = channels[0]?.length ?? 0;
  const blockAlign = channels.length * 2;
  const dataSize = frames * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels.length, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * blockAlign, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < frames; i += 1) {
    channels.forEach((channel, c) => {
      const clamped = Math.max(-1, Math.min(1, channel[i]));
      buffer.writeInt16LE(Math.round(clamped * 32_767), 44 + i * blockAlign + c * 2);
    });
  }

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buffer);
};
