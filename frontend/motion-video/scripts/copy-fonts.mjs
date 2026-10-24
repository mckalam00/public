// Pretendard(OFL) woff2를 npm 패키지에서 public/fonts로 복사한다.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules", "pretendard", "dist", "web", "static", "woff2");
const target = join(root, "public", "fonts");
const weights = ["Regular", "Medium", "SemiBold", "Bold", "ExtraBold"];

if (!existsSync(source)) {
  console.error(`[copy-fonts] Pretendard 패키지를 찾을 수 없습니다: ${source}`);
  process.exit(1);
}

mkdirSync(target, { recursive: true });
weights.forEach((weight) => {
  const file = `Pretendard-${weight}.woff2`;
  copyFileSync(join(source, file), join(target, file));
});
console.log(`[copy-fonts] ${weights.length}개 폰트를 ${target}에 복사했습니다.`);
