// 내레이션 스크립트 · 음성 톤 · 믹스 · 효과음 큐.
// 영상(Remotion)과 오디오 생성 스크립트(scripts/audio)가 함께 읽는다.
import { SOLUTION, type SceneId, sceneFrames, sceneStartFrame, solutionPanelStart } from "./content";
import { VIDEO } from "./theme";

export type NarrationLine = Readonly<{
  scene: SceneId;
  /** 자막·검수용 원문 */
  text: string;
  /** TTS 입력. 숫자·영문은 한글 발음으로 풀어 쓴다 */
  speech: string;
  /** 씬 시작 후 말을 시작하는 시점(초) */
  offsetSec: number;
}>;

// 20대 밝은 여성 아나운서 톤: 문장은 짧게, 끝은 내려 닫는다.
export const NARRATION: ReadonlyArray<NarrationLine> = [
  { scene: "hook", offsetSec: 0.6, text: "전화, 카톡, 엑셀로 관리하던 건설 현장 구매.", speech: "전화, 카톡, 엑셀로 관리하던 건설 현장 구매." },
  { scene: "problem", offsetSec: 0.3, text: "업무는 반복되고, 기준은 없고, 리스크는 보이지 않습니다.", speech: "업무는 반복되고, 기준은 없고, 리스크는 보이지 않습니다." },
  { scene: "turn", offsetSec: 0.9, text: "이제, 기업의 데이터로 통합 관리하세요.", speech: "이제, 기업의 데이터로 통합 관리하세요." },
  {
    scene: "solution",
    offsetSec: 0.4,
    text: "주문 요청부터 비교 견적, 발주, 정산, 분석까지. 현장의 모든 조달이 하나의 화면에서 끝납니다.",
    speech: "주문 요청부터 비교 견적, 발주, 정산, 분석까지. 현장의 모든 조달이 하나의 화면에서 끝납니다.",
  },
  { scene: "platform", offsetSec: 0.4, text: "맞춤형 커머스와 잉여 자산 거래, 본사 통합 관리까지.", speech: "맞춤형 커머스와 잉여 자산 거래, 본사 통합 관리까지." },
  { scene: "asset", offsetSec: 0.3, text: "거래가 쌓일수록, 건설사는 더 똑똑해집니다.", speech: "거래가 쌓일수록, 건설사는 더 똑똑해집니다." },
  { scene: "proof", offsetSec: 0.5, text: "전국 377개 현장, 평균 20% 비용 절감.", speech: "전국 삼백칠십칠 개 현장, 평균 이십 퍼센트 비용 절감." },
  { scene: "cta", offsetSec: 0.2, text: "조달의 기준을 새롭게. 공새로.", speech: "조달의 기준을 새롭게. 공새로." },
];

/** 문장이 다음 씬으로 넘어가지 않도록 남겨 두는 여유(초) */
export const NARRATION_TAIL_SEC = 0.35;

export const lineStartSec = (line: NarrationLine): number => sceneStartFrame(line.scene) / VIDEO.fps + line.offsetSec;

export const lineMaxSec = (line: NarrationLine): number =>
  sceneFrames(line.scene) / VIDEO.fps - line.offsetSec - NARRATION_TAIL_SEC;

export const VOICE = {
  /** 가이드 TTS 말하기 속도(1 = 모델 기본). 음성인식 검증에서 1.0이 가장 또렷했다 */
  speed: 1,
  /** 피치 상승(반음, 템포 유지). 가이드 TTS에 1.5를 주면 발음이 뭉개져 0으로 둔다. 녹음 파일에는 필요 시 0.5~1 */
  pitchSemitones: 0,
  /** 목표 라우드니스(LUFS) — 유튜브·SNS 권장 범위 */
  loudnessLufs: -16,
  outputSampleRate: 48_000,
} as const;

export const AUDIO_FILES = {
  narration: "audio/narration.wav",
  music: "audio/music.wav",
  sfx: "audio/sfx.wav",
} as const;

export const MIX = {
  narration: 1,
  music: 0.55,
  /** 내레이션이 나오는 동안 배경음악 볼륨 */
  musicDucked: 0.22,
  sfx: 0.7,
  /** 덕킹 진입·복귀 시간(초) */
  duckRampSec: 0.25,
} as const;

export const MUSIC = {
  bpm: 105,
  /** 긴장 → 밝음으로 바뀌는 시점: S3 Turn 시작 */
  dropSec: sceneStartFrame("turn") / VIDEO.fps,
  /** 엔딩 코드가 울리는 시점: S8 CTA 시작 */
  outroSec: sceneStartFrame("cta") / VIDEO.fps,
  totalSec: (sceneStartFrame("cta") + sceneFrames("cta")) / VIDEO.fps,
} as const;

export type SfxKind = "buzz" | "whoosh" | "chime" | "click" | "pop";

export type SfxCue = Readonly<{ kind: SfxKind; atSec: number }>;

const sec = (scene: SceneId, localFrame: number): number => (sceneStartFrame(scene) + localFrame) / VIDEO.fps;

const SETTLE_PANEL_INDEX = SOLUTION.steps.indexOf("정산");

// 화면 모션과 같은 프레임에 맞춘 효과음
export const SFX_CUES: ReadonlyArray<SfxCue> = [
  { kind: "buzz", atSec: sec("hook", 12) },
  { kind: "buzz", atSec: sec("hook", 70) },
  { kind: "whoosh", atSec: sec("turn", 0) },
  { kind: "chime", atSec: sec("turn", 30) },
  { kind: "click", atSec: sec("solution", SOLUTION.request.clickFrame) },
  { kind: "click", atSec: sec("solution", solutionPanelStart(SETTLE_PANEL_INDEX) + SOLUTION.settle.clickFrame) },
  { kind: "whoosh", atSec: sec("asset", 50) },
  { kind: "pop", atSec: sec("cta", 40) },
];
