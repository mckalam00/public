// 한국어 TTS 모델(KSS 여성 화자, VITS) 준비. 없으면 내려받는다.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_MODEL_NAME = "vits-mimic3-ko_KO-kss_low";
const DEFAULT_MODEL_URL = `https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/${DEFAULT_MODEL_NAME}.tar.bz2`;

export type TtsModel = Readonly<{ model: string; tokens: string; dataDir: string }>;

const modelFiles = (dir: string): TtsModel => ({
  model: join(dir, "ko_KO-kss_low.onnx"),
  tokens: join(dir, "tokens.txt"),
  dataDir: join(dir, "espeak-ng-data"),
});

/**
 * TTS_MODEL_DIR이 있으면 그 경로를, 없으면 프로젝트의 .models/에 내려받아 쓴다.
 * 압축 해제는 시스템 tar를 사용한다.
 */
export const ensureModel = async (projectRoot: string): Promise<TtsModel> => {
  const dir = process.env.TTS_MODEL_DIR ?? join(projectRoot, ".models", DEFAULT_MODEL_NAME);
  const files = modelFiles(dir);
  if (existsSync(files.model)) {
    return files;
  }
  if (process.env.TTS_MODEL_DIR) {
    throw new Error(`TTS_MODEL_DIR에 모델 파일이 없습니다: ${files.model}`);
  }

  const url = process.env.TTS_MODEL_URL ?? DEFAULT_MODEL_URL;
  const modelsDir = join(projectRoot, ".models");
  const archive = join(modelsDir, `${DEFAULT_MODEL_NAME}.tar.bz2`);
  mkdirSync(modelsDir, { recursive: true });
  console.log(`[tts] 모델 다운로드: ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`모델 다운로드 실패 (${response.status}): ${url}`);
  }
  writeFileSync(archive, Buffer.from(await response.arrayBuffer()));
  execFileSync("tar", ["xjf", archive, "-C", modelsDir]);
  rmSync(archive);

  if (!existsSync(files.model)) {
    throw new Error(`압축을 풀었지만 모델 파일이 없습니다: ${files.model}`);
  }
  return files;
};
