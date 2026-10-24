// 영상의 모든 카피·수치를 모아 둔 파일.
// 출처: 「공새로(건설현장 통합조달 플랫폼) 솔루션 소개서」 26.08.30. 페이지 번호를 주석으로 남긴다.
// 수치를 바꿀 때는 기준일(METRICS_BASIS)도 함께 갱신한다.
import { VIDEO } from "./theme";

export type SceneId =
  | "hook"
  | "problem"
  | "turn"
  | "solution"
  | "platform"
  | "asset"
  | "proof"
  | "cta";

type SceneTiming = Readonly<{ id: SceneId; seconds: number }>;

export const SCENE_TIMINGS: ReadonlyArray<SceneTiming> = [
  { id: "hook", seconds: 5 },
  { id: "problem", seconds: 5 },
  { id: "turn", seconds: 4 },
  { id: "solution", seconds: 12 },
  { id: "platform", seconds: 6 },
  { id: "asset", seconds: 5 },
  { id: "proof", seconds: 5 },
  { id: "cta", seconds: 3 },
];

export const sceneFrames = (id: SceneId): number => {
  const scene = SCENE_TIMINGS.find((s) => s.id === id);
  if (!scene) {
    throw new Error(`정의되지 않은 씬입니다: ${id}`);
  }
  return scene.seconds * VIDEO.fps;
};

export const TOTAL_FRAMES = SCENE_TIMINGS.reduce((sum, s) => sum + s.seconds * VIDEO.fps, 0);

/** 영상 전체 기준으로 해당 씬이 시작되는 프레임 */
export const sceneStartFrame = (id: SceneId): number => {
  const index = SCENE_TIMINGS.findIndex((s) => s.id === id);
  if (index < 0) {
    throw new Error(`정의되지 않은 씬입니다: ${id}`);
  }
  return SCENE_TIMINGS.slice(0, index).reduce((sum, s) => sum + s.seconds * VIDEO.fps, 0);
};

// S1 Hook — p.1, p.7
export const HOOK = {
  lines: ["전화 · 카톡 · 엑셀로 관리하던", "건설 현장 구매"],
  chaosItems: [
    { kind: "chat", label: "견적 다시 주세요" },
    { kind: "phone", label: "자재 급해요!" },
    { kind: "sheet", label: "단가표_최종_v3.xlsx" },
    { kind: "phone", label: "부재중 전화 3통" },
    { kind: "chat", label: "거래명세서 어디 있죠?" },
    { kind: "sheet", label: "발주서_수정본.xlsx" },
    { kind: "phone", label: "납품 언제 와요?" },
    { kind: "sheet", label: "증빙 누락.xlsx" },
    { kind: "chat", label: "단가 비교 부탁해요" },
  ],
} as const;

// S2 Problem — p.7
export const PROBLEM = {
  personas: [
    { role: "현장 조달 담당자", quote: "반복적인 일이 줄어들기를 원해요." },
    { role: "본사 구매·관리팀", quote: "데이터는 많지만 비교 가능한 기준이 없어요." },
    { role: "전문건설사 경영진", quote: "전 현장의 구매 비용과 리스크가 보이지 않습니다." },
  ],
  headline: "분산된 업무는 데이터를 남기지 못합니다",
  highlight: ["데이터를"],
} as const;

// S3 Turn — p.1
export const TURN = {
  lead: "AI 시대에는",
  headline: "기업 데이터로 통합 관리하세요",
} as const;

// S4 Solution — p.11 (화면 수치는 소개서 캡처에 표시된 값)
export const SOLUTION = {
  steps: ["주문 요청", "비교 견적", "발주", "정산", "분석"],
  caption: "현장의 모든 조달 흐름을 하나의 화면에서",
  disclaimer: "화면은 이해를 돕기 위한 예시입니다",
  timing: { introFrames: 18, slideFrames: 14 },
  request: {
    title: "간편 주문 요청",
    items: [
      { name: "유로폼", spec: "일반(잡색) 1.8" },
      { name: "편사물호스", spec: "19mm" },
      { name: "pp로프", spec: "5mm" },
    ],
    action: "견적 요청하기",
    clickFrame: 44,
  },
  compare: {
    title: "실시간 자동 견적 비교",
    badge: "최적 공급사 추천",
    quotes: [
      { supplier: "(주)A산업안전", total: 4_960_800, note: "최저가 · 최고가 대비 78%", best: true },
      { supplier: "(주)B글로벌기업", total: 6_360_000, note: "최고가 · 100%", best: false },
    ],
  },
  order: {
    title: "발주 관리",
    badge: "발주처리 시간 3~4일 → 1일",
    statuses: [
      { label: "입찰중", count: 4 },
      { label: "입찰마감", count: 36 },
      { label: "발행완료", count: 6 },
      { label: "주문확인", count: 27 },
      { label: "배송완료", count: 154 },
      { label: "검수완료", count: 182 },
    ],
  },
  settle: {
    title: "검수 및 간편 정산",
    summary: "다수 공급사 주문서를 한 번에 정산",
    selectedLabel: "선택된 정산서",
    pendingCount: 23,
    action: "정산시작",
    clickFrame: 36,
  },
  analyze: {
    title: "데이터 축적 및 인사이트",
    savings: [
      { label: "최고가 대비 절감액", amount: 1_557_685_591 },
      { label: "평균가 대비 절감액", amount: 563_706_507 },
    ],
    // p.5 누적 현장 도입 수
    sitesByYear: [
      { year: "2023", value: 42 },
      { year: "2024", value: 76 },
      { year: "2025", value: 164 },
      { year: "2026", value: 377 },
    ],
  },
} as const;

/** S4에서 패널 하나가 머무는 프레임 수 */
export const solutionStepFrames = (): number =>
  Math.floor((sceneFrames("solution") - SOLUTION.timing.introFrames) / SOLUTION.steps.length);

/** S4 안에서 i번째 패널이 들어오기 시작하는 프레임 (씬 기준) */
export const solutionPanelStart = (index: number): number =>
  index === 0 ? 0 : SOLUTION.timing.introFrames + index * solutionStepFrames() - SOLUTION.timing.slideFrames;

// S5 Platform — p.10
export const PLATFORM = {
  headline: "현장 조달부터 커머스, 자산거래, 통합 관리까지",
  services: [
    { no: "01", name: "현장 조달 서비스", desc: "입찰 · 주문 · 정산 · 자산 관리 통합" },
    { no: "02", name: "공새로몰", desc: "현장 맞춤형 품목 발주 자동화" },
    { no: "03", name: "잉여 자산 거래", desc: "현장 잉여 자산 관리 및 중고마켓" },
    { no: "04", name: "통합 관리 솔루션", desc: "전 현장 조달을 기업 데이터로 자산화" },
  ],
} as const;

// S6 Data Asset — p.18
export const ASSET = {
  flow: ["현장 구매 요청", "공급사 견적", "발주 및 납품", "정산"],
  data: ["품목·규격 데이터", "가격·지역·납기 데이터", "공급사 데이터", "현장 데이터"],
  headlineLead: "거래가 쌓일수록",
  headlineEmphasis: "건설사는 더 똑똑해집니다",
  result: "기업 자산으로 전환 · 맞춤형 AI 에이전트",
} as const;

// S7 Proof — p.1, p.15
export const METRICS_BASIS = "2026년 8월 기준 · 공새로 솔루션 소개서";

export const METRICS = [
  { label: "전국 도입 현장", value: 377, suffix: "+" },
  { label: "전국 공급망", value: 297, suffix: "+" },
  { label: "평균 비용 절감", value: 20, suffix: "%" },
  { label: "조달 업무 단축", value: 50, suffix: "%" },
] as const;

export const PROOF = {
  headline: "전국 현장이 선택한 공새로",
  pinCount: 48,
} as const;

// S8 CTA — p.4, p.17, p.20
export const CTA = {
  brand: "공새로",
  slogan: "조달의 기준을 새롭게,",
  button: "우리 회사 현장 조달 DX 무료 진단받기",
  contact: "contact@gongsaero.com",
  credentials: ["국토교통부 스마트건설 강소기업", "POSCO그룹 사내벤처 출신"],
} as const;
