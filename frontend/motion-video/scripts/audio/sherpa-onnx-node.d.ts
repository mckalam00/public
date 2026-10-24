// sherpa-onnx-node는 타입 선언을 제공하지 않아 사용하는 API만 선언한다.
declare module "sherpa-onnx-node" {
  export type GeneratedAudio = Readonly<{ samples: Float32Array; sampleRate: number }>;

  export type OfflineTtsConfig = Readonly<{
    model: Readonly<{
      vits: Readonly<{ model: string; tokens: string; dataDir?: string; lexicon?: string }>;
      numThreads?: number;
      provider?: "cpu";
      debug?: boolean;
    }>;
    maxNumSentences?: number;
  }>;

  export class OfflineTts {
    constructor(config: OfflineTtsConfig);
    generate(request: Readonly<{ text: string; sid: number; speed: number }>): GeneratedAudio;
  }

  // CommonJS 패키지라 ESM에서는 default export로만 접근할 수 있다.
  const sherpa: Readonly<{ OfflineTts: typeof OfflineTts }>;
  export default sherpa;
}
