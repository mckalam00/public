import { Easing } from "remotion";

export const VIDEO = { width: 1920, height: 1080, fps: 30 } as const;

// 소개서(26.08)에서 추출한 근사치. 공식 브랜드 가이드 값이 나오면 여기만 교체한다.
export const COLORS = {
  navy: "#0B2A6B",
  navyDeep: "#071D4D",
  navySoft: "#16397F",
  blue: "#4A7CF0",
  blueSoft: "#C9D8FB",
  orange: "#F47B20",
  lightBg: "#EEF4FF",
  surface: "#FFFFFF",
  grayBg: "#F2F3F5",
  text: "#111827",
  subText: "#4B5563",
  muted: "#9CA3AF",
  line: "#DCE3F0",
} as const;

export const FONT_FAMILY = "Pretendard";

export const FONT_WEIGHTS = {
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
} as const;

// 모든 씬이 같은 이징을 써야 브랜드 리듬이 생긴다.
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const RADIUS = { card: 28, pill: 999 } as const;

export const SHADOW = {
  card: "0 24px 60px rgba(11, 42, 107, 0.12)",
  float: "0 30px 80px rgba(7, 29, 77, 0.35)",
} as const;
