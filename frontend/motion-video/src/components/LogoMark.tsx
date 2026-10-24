import { COLORS } from "../config/theme";

type Props = Readonly<{
  size: number;
  color?: string;
  /** 0~1, 선이 그려지는 정도 */
  draw?: number;
}>;

// 소개서 로고(원 + 분할선)를 단순화한 심볼. 공식 SVG를 받으면 이 컴포넌트만 교체한다.
const PATHS: ReadonlyArray<string> = [
  "M50 6 L50 94",
  "M6 50 L94 50",
  "M50 50 L82 82",
  "M50 50 L22 78",
];

const CIRCLE_LENGTH = 2 * Math.PI * 44;
const LINE_LENGTH = 90;

export const LogoMark = ({ size, color = COLORS.surface, draw = 1 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle
      cx={50}
      cy={50}
      r={44}
      stroke={color}
      strokeWidth={6}
      strokeDasharray={CIRCLE_LENGTH}
      strokeDashoffset={CIRCLE_LENGTH * (1 - draw)}
      transform="rotate(-90 50 50)"
    />
    {PATHS.map((d, i) => {
      const local = Math.min(1, Math.max(0, draw * 1.6 - i * 0.15));
      return (
        <path
          key={d}
          d={d}
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={LINE_LENGTH}
          strokeDashoffset={LINE_LENGTH * (1 - local)}
        />
      );
    })}
  </svg>
);
