import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT_FAMILY } from "../config/theme";
import { progress } from "../lib/anim";

type Props = Readonly<{
  text: string;
  start: number;
  fontSize: number;
  color?: string;
  weight?: number;
  stagger?: number;
  highlight?: ReadonlyArray<string>;
  highlightColor?: string;
  align?: CSSProperties["textAlign"];
}>;

/** 단어 단위로 아래에서 마스크 리빌되는 타이포그래피 */
export const KineticText = ({
  text,
  start,
  fontSize,
  color = COLORS.text,
  weight = 700,
  stagger = 3,
  highlight = [],
  highlightColor = COLORS.blue,
  align = "left",
}: Props) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const justify = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: justify,
        columnGap: fontSize * 0.28,
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight: weight,
        lineHeight: 1.25,
        letterSpacing: "-0.02em",
      }}
    >
      {words.map((word, i) => {
        const p = progress(frame, start + i * stagger, 14);
        const isHighlighted = highlight.includes(word);
        return (
          <span key={`${word}-${i}`} style={{ overflow: "hidden", display: "inline-block", paddingBottom: fontSize * 0.08 }}>
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - p) * 105}%)`,
                color: isHighlighted ? highlightColor : color,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};
