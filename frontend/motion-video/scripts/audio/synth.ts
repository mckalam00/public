// 배경음악·효과음용 최소 신시사이저. 외부 샘플 없이 코드로만 소리를 만들어 라이선스 이슈가 없다.
// 성능을 위해 신호 버퍼는 함수 내부에서만 변경하고, 결과는 새 배열로 돌려준다.

export const SAMPLE_RATE = 48_000;

export type Stereo = Readonly<{ left: Float32Array; right: Float32Array }>;
export type Wave = "sine" | "saw" | "square" | "triangle";
export type Envelope = Readonly<{ attack: number; decay: number; sustain: number; release: number }>;
export type FilterMode = "lowpass" | "highpass" | "bandpass";
/** 신호 시작 기준 경과 시간(초) → 컷오프(Hz) */
export type Cutoff = (t: number) => number;

export const createStereo = (seconds: number): Stereo => {
  const length = Math.ceil(seconds * SAMPLE_RATE);
  return { left: new Float32Array(length), right: new Float32Array(length) };
};

export const mtof = (midi: number): number => 440 * 2 ** ((midi - 69) / 12);

/** 재현 가능한 노이즈를 위한 시드 난수 (mulberry32) */
export const seededRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
};

const waveAt = (wave: Wave, phase: number): number => {
  const p = phase - Math.floor(phase);
  if (wave === "sine") return Math.sin(2 * Math.PI * p);
  if (wave === "saw") return 2 * p - 1;
  if (wave === "square") return p < 0.5 ? 1 : -1;
  return 1 - 4 * Math.abs(p - 0.5);
};

/** ADSR. holdSec 동안 attack→decay→sustain, 이후 release */
export const envelopeAt = (t: number, holdSec: number, env: Envelope): number => {
  if (t < 0) return 0;
  const held =
    t < env.attack
      ? t / env.attack
      : t < env.attack + env.decay
        ? 1 - (1 - env.sustain) * ((t - env.attack) / env.decay)
        : env.sustain;
  if (t <= holdSec) return held;
  const releaseT = t - holdSec;
  const levelAtRelease = envelopeAt(holdSec, holdSec, env);
  return releaseT >= env.release ? 0 : levelAtRelease * (1 - releaseT / env.release);
};

/** 상태변수 필터(SVF). 컷오프는 시간에 따라 바뀔 수 있다 */
export const filter = (input: Float32Array, mode: FilterMode, cutoff: Cutoff, resonance = 0.7): Float32Array => {
  const out = new Float32Array(input.length);
  const damping = 1 / Math.max(0.5, resonance);
  let low = 0;
  let band = 0;
  for (let i = 0; i < input.length; i += 1) {
    const fc = Math.min(SAMPLE_RATE / 6, Math.max(20, cutoff(i / SAMPLE_RATE)));
    const f = 2 * Math.sin((Math.PI * fc) / SAMPLE_RATE);
    const high = input[i] - low - damping * band;
    band += f * high;
    low += f * band;
    out[i] = mode === "lowpass" ? low : mode === "highpass" ? high : band;
  }
  return out;
};

export type ToneSpec = Readonly<{
  freq: number;
  durSec: number;
  wave: Wave;
  env: Envelope;
  gain: number;
  /** 같은 음을 미세하게 어긋나게 겹쳐 두께를 만든다(센트) */
  detuneCents?: number;
  /** 시간 → 주파수 배율 (피치 스윕용) */
  pitch?: (t: number) => number;
}>;

/** 단일 음 렌더링 (mono) */
export const tone = (spec: ToneSpec): Float32Array => {
  const length = Math.ceil((spec.durSec + spec.env.release) * SAMPLE_RATE);
  const out = new Float32Array(length);
  const voices = spec.detuneCents ? [-spec.detuneCents, spec.detuneCents] : [0];
  const phases = voices.map(() => 0);
  for (let i = 0; i < length; i += 1) {
    const t = i / SAMPLE_RATE;
    const ratio = spec.pitch ? spec.pitch(t) : 1;
    const sample = voices.reduce((sum, cents, v) => {
      phases[v] += (spec.freq * ratio * 2 ** (cents / 1200)) / SAMPLE_RATE;
      return sum + waveAt(spec.wave, phases[v]);
    }, 0);
    out[i] = (sample / voices.length) * envelopeAt(t, spec.durSec, spec.env) * spec.gain;
  }
  return out;
};

/** 엔벨로프가 걸린 화이트 노이즈 (mono) */
export const noise = (durSec: number, env: Envelope, gain: number, seed: number): Float32Array => {
  const length = Math.ceil((durSec + env.release) * SAMPLE_RATE);
  const rand = seededRandom(seed);
  return Float32Array.from({ length }, (_, i) => (rand() * 2 - 1) * envelopeAt(i / SAMPLE_RATE, durSec, env) * gain);
};

/** mono 신호를 stereo 버퍼의 특정 시점에 팬을 적용해 더한다 (pan: -1 왼쪽 ~ 1 오른쪽) */
export const place = (target: Stereo, signal: Float32Array, atSec: number, pan = 0): void => {
  const start = Math.round(atSec * SAMPLE_RATE);
  const leftGain = Math.cos(((pan + 1) * Math.PI) / 4);
  const rightGain = Math.sin(((pan + 1) * Math.PI) / 4);
  const end = Math.min(signal.length, target.left.length - start);
  for (let i = Math.max(0, -start); i < end; i += 1) {
    target.left[start + i] += signal[i] * leftGain;
    target.right[start + i] += signal[i] * rightGain;
  }
};

/** 핑퐁 딜레이 (공간감) */
export const pingPongDelay = (source: Stereo, delaySec: number, feedback: number, mix: number): Stereo => {
  const d = Math.round(delaySec * SAMPLE_RATE);
  const left = Float32Array.from(source.left);
  const right = Float32Array.from(source.right);
  for (let i = d; i < left.length; i += 1) {
    left[i] += right[i - d] * feedback * mix;
    right[i] += left[i - d] * feedback * mix;
  }
  return { left, right };
};

export const mixInto = (target: Stereo, source: Stereo, gain = 1): void => {
  for (let i = 0; i < target.left.length; i += 1) {
    target.left[i] += (source.left[i] ?? 0) * gain;
    target.right[i] += (source.right[i] ?? 0) * gain;
  }
};

/** 피크를 목표값으로 맞추고, 끝부분을 페이드 아웃한다 */
export const finalize = (source: Stereo, peak: number, fadeOutSec: number): Stereo => {
  const max = source.left.reduce((m, v, i) => Math.max(m, Math.abs(v), Math.abs(source.right[i])), 1e-9);
  const scale = peak / max;
  const fadeStart = source.left.length - Math.round(fadeOutSec * SAMPLE_RATE);
  const shape = (v: number, i: number) => v * scale * (i < fadeStart ? 1 : (source.left.length - i) / (source.left.length - fadeStart));
  return { left: source.left.map(shape), right: source.right.map(shape) };
};
