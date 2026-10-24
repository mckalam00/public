// 배경음악: 0~10초는 긴장감(Am 펄스), S3 Turn에서 밝은 C장조(I–V–vi–IV)로 전환, CTA에서 C코드로 마무리.
import { MUSIC } from "../../src/config/audio";
import {
  type Envelope,
  type Stereo,
  createStereo,
  filter,
  finalize,
  mixInto,
  mtof,
  noise,
  pingPongDelay,
  place,
  tone,
} from "./synth";

const BEAT = 60 / MUSIC.bpm;
const BAR = BEAT * 4;

const PLUCK: Envelope = { attack: 0.004, decay: 0.22, sustain: 0, release: 0.05 };
const PAD: Envelope = { attack: 0.35, decay: 0.4, sustain: 0.8, release: 0.7 };
const PULSE: Envelope = { attack: 0.005, decay: 0.12, sustain: 0.2, release: 0.06 };
const HAT: Envelope = { attack: 0.001, decay: 0.04, sustain: 0, release: 0.01 };
const CLAP: Envelope = { attack: 0.002, decay: 0.14, sustain: 0, release: 0.03 };

type Chord = Readonly<{ root: number; notes: ReadonlyArray<number> }>;

const TENSION: Chord = { root: 33, notes: [57, 60, 64, 71] }; // Am(add9)
const PROGRESSION: ReadonlyArray<Chord> = [
  { root: 36, notes: [60, 64, 67, 72] }, // C
  { root: 43, notes: [59, 62, 67, 71] }, // G
  { root: 45, notes: [57, 60, 64, 69] }, // Am
  { root: 41, notes: [57, 60, 65, 69] }, // F
];
const FINAL: Chord = { root: 36, notes: [60, 64, 67, 72, 76] };

const lowpass = (signal: Float32Array, hz: number) => filter(signal, "lowpass", () => hz);
const highpass = (signal: Float32Array, hz: number) => filter(signal, "highpass", () => hz);

const kick = (gain: number): Float32Array =>
  tone({
    freq: 48,
    durSec: 0.05,
    wave: "sine",
    gain,
    env: { attack: 0.002, decay: 0.3, sustain: 0, release: 0.08 },
    pitch: (t) => 1 + 2.2 * Math.exp(-t * 40),
  });

const hat = (gain: number, seed: number, open = false): Float32Array =>
  highpass(noise(open ? 0.18 : 0.02, open ? { ...HAT, decay: 0.2 } : HAT, gain, seed), 7_000);

const clap = (seed: number): Float32Array => filter(noise(0.05, CLAP, 0.5, seed), "bandpass", () => 1_600, 1.2);

const padChord = (chord: Chord, durSec: number, cutoff: number, gain: number): Float32Array => {
  const voices = chord.notes.map((n) => lowpass(tone({ freq: mtof(n), durSec, wave: "saw", env: PAD, gain, detuneCents: 9 }), cutoff));
  const length = Math.max(...voices.map((v) => v.length));
  return Float32Array.from({ length }, (_, i) => voices.reduce((sum, v) => sum + (v[i] ?? 0), 0));
};

/** 0초 ~ drop: 긴장감 있는 펄스 + 리저 */
const renderTension = (out: Stereo): void => {
  const steps = Math.floor(MUSIC.dropSec / (BEAT / 2));
  Array.from({ length: steps }, (_, i) => i).forEach((i) => {
    const t = i * (BEAT / 2);
    const openness = 300 + (t / MUSIC.dropSec) * 1_400;
    place(out, lowpass(tone({ freq: mtof(TENSION.root), durSec: BEAT / 3, wave: "saw", env: PULSE, gain: 0.5 }), openness), t);
    place(out, hat(i % 2 === 0 ? 0.12 : 0.06, 100 + i), t, i % 2 === 0 ? -0.3 : 0.3);
  });
  place(out, padChord(TENSION, MUSIC.dropSec - 0.6, 1_000, 0.07), 0);

  const riserSec = 2.6;
  const riser = filter(
    noise(riserSec, { attack: riserSec, decay: 0.01, sustain: 1, release: 0.02 }, 0.35, 7),
    "bandpass",
    (t) => 400 + (t / riserSec) ** 2 * 7_000,
    1.5,
  );
  place(out, riser, MUSIC.dropSec - riserSec);
};

/** 전환 순간의 임팩트 */
const renderImpact = (out: Stereo): void => {
  place(out, kick(1.1), MUSIC.dropSec);
  place(out, tone({ freq: 41, durSec: 0.2, wave: "sine", gain: 0.6, env: { attack: 0.005, decay: 1.4, sustain: 0, release: 0.2 } }), MUSIC.dropSec);
  place(out, highpass(noise(0.1, { attack: 0.002, decay: 1.6, sustain: 0, release: 0.3 }, 0.18, 11), 4_000), MUSIC.dropSec);
};

/** drop ~ outro: 밝은 테크 코퍼레이트 그루브 */
const renderGroove = (out: Stereo, arps: Stereo): void => {
  const bars = Math.floor((MUSIC.outroSec - MUSIC.dropSec) / BAR);
  const grooveStart = MUSIC.dropSec;
  const proofSec = MUSIC.outroSec - 5;

  Array.from({ length: bars }, (_, bar) => bar).forEach((bar) => {
    const chord = PROGRESSION[bar % PROGRESSION.length];
    const barStart = grooveStart + bar * BAR;
    place(out, padChord(chord, BAR - 0.1, 2_000, 0.05), barStart);

    Array.from({ length: 8 }, (_, step) => step).forEach((step) => {
      const t = barStart + step * (BEAT / 2);
      const isBeat = step % 2 === 0;
      if (isBeat && !(bar === 0 && step === 0)) place(out, kick(0.75), t);
      if (!isBeat) place(out, hat(0.1, 1_000 + bar * 8 + step, t >= proofSec), t, 0.25);
      if (bar >= 2 && (step === 2 || step === 6)) place(out, clap(2_000 + bar * 8 + step), t, -0.1);

      place(out, lowpass(tone({ freq: mtof(chord.root), durSec: BEAT / 2.4, wave: "triangle", env: PULSE, gain: 0.55 }), 600), t);

      const arpNote = chord.notes[step % chord.notes.length] + 12;
      place(arps, tone({ freq: mtof(arpNote), durSec: 0.05, wave: "triangle", env: PLUCK, gain: 0.16 }), t, step % 2 === 0 ? -0.5 : 0.5);
    });
  });
};

/** CTA: 마지막 C코드 */
const renderOutro = (out: Stereo, arps: Stereo): void => {
  const durSec = MUSIC.totalSec - MUSIC.outroSec;
  place(out, kick(0.8), MUSIC.outroSec);
  place(out, padChord(FINAL, durSec - 0.8, 2_400, 0.06), MUSIC.outroSec);
  FINAL.notes.forEach((n, i) => {
    place(arps, tone({ freq: mtof(n + 12), durSec: 0.05, wave: "triangle", env: { ...PLUCK, decay: 0.8 }, gain: 0.13 }), MUSIC.outroSec + i * (BEAT / 4), i % 2 === 0 ? -0.4 : 0.4);
  });
};

export const composeMusic = (): Stereo => {
  const out = createStereo(MUSIC.totalSec);
  const arps = createStereo(MUSIC.totalSec);
  renderTension(out);
  renderImpact(out);
  renderGroove(out, arps);
  renderOutro(out, arps);
  mixInto(out, pingPongDelay(arps, (BEAT * 3) / 4, 0.45, 0.8));
  return finalize(out, 0.89, 1.2);
};
