// 효과음: config/audio.ts의 SFX_CUES 시점에 배치한다.
import { MUSIC, SFX_CUES, type SfxKind } from "../../src/config/audio";
import { type Stereo, createStereo, filter, finalize, mtof, noise, place, tone } from "./synth";

/** 휴대폰 진동 (전화 업무의 혼란) */
const buzz = (out: Stereo, at: number): void => {
  [0, 0.28].forEach((offset) => {
    const body = tone({ freq: 140, durSec: 0.2, wave: "square", gain: 0.25, env: { attack: 0.01, decay: 0.05, sustain: 0.9, release: 0.03 } });
    place(out, filter(body, "lowpass", () => 500), at + offset, -0.2);
  });
};

/** 카드가 로고로 빨려 들어가는 소리 */
const whoosh = (out: Stereo, at: number, seed: number): void => {
  const dur = 0.9;
  const sweep = filter(
    noise(dur, { attack: dur * 0.7, decay: 0.2, sustain: 0, release: 0.05 }, 0.9, seed),
    "bandpass",
    (t) => 300 + Math.sin((t / dur) * Math.PI) * 3_500,
    2,
  );
  place(out, sweep, at);
};

/** 로고 완성 순간의 맑은 종소리 */
const chime = (out: Stereo, at: number): void => {
  [88, 95, 100].forEach((midi, i) => {
    const bell = tone({ freq: mtof(midi), durSec: 0.02, wave: "sine", gain: 0.22 / (i + 1), env: { attack: 0.003, decay: 1.4, sustain: 0, release: 0.2 } });
    place(out, bell, at + i * 0.03, i === 1 ? 0.3 : -0.2);
  });
};

/** UI 클릭 */
const click = (out: Stereo, at: number, seed: number): void => {
  place(out, filter(noise(0.004, { attack: 0.0005, decay: 0.01, sustain: 0, release: 0.005 }, 0.8, seed), "highpass", () => 2_500), at, 0.2);
  place(out, tone({ freq: 1_900, durSec: 0.004, wave: "sine", gain: 0.3, env: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.01 } }), at, 0.2);
};

/** CTA 버튼 강조 */
const pop = (out: Stereo, at: number): void => {
  const blip = tone({
    freq: 420,
    durSec: 0.05,
    wave: "sine",
    gain: 0.4,
    env: { attack: 0.003, decay: 0.15, sustain: 0, release: 0.04 },
    pitch: (t) => 1 + Math.min(1, t / 0.08) * 1.2,
  });
  place(out, blip, at);
};

const RENDER: Record<SfxKind, (out: Stereo, at: number, seed: number) => void> = {
  buzz: (out, at) => buzz(out, at),
  whoosh,
  chime: (out, at) => chime(out, at),
  click,
  pop: (out, at) => pop(out, at),
};

export const composeSfx = (): Stereo => {
  const out = createStereo(MUSIC.totalSec);
  SFX_CUES.forEach((cue, i) => RENDER[cue.kind](out, cue.atSec, 500 + i));
  return finalize(out, 0.8, 0.05);
};
