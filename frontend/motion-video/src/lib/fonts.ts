import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT_FAMILY, FONT_WEIGHTS } from "../config/theme";

// public/fonts는 npm install 시 scripts/copy-fonts.mjs가 채운다.
// loadFont는 내부적으로 delayRender를 걸어 폰트 로드 전 프레임이 캡처되지 않게 한다.
export const loadBrandFonts = (): Promise<ReadonlyArray<void>> =>
  Promise.all(
    Object.entries(FONT_WEIGHTS).map(([name, weight]) =>
      loadFont({
        family: FONT_FAMILY,
        url: staticFile(`fonts/Pretendard-${name}.woff2`),
        weight: String(weight),
        format: "woff2",
      }),
    ),
  );
