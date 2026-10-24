// 실행: npm run pages -- --pdf <소개서.pdf>
// PDF 각 페이지를 public/pages/page-01.jpg … 로 렌더링한다. (소개서 이미지는 저장소에 커밋하지 않는다)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { BROCHURE_PAGES, PAGE_IMAGE } from "../../src/config/brochure";

const projectRoot = join(import.meta.dirname, "..", "..");
const outDir = join(projectRoot, "public", PAGE_IMAGE.dir);

const pageCount = (pdf: string): number => {
  const info = execFileSync("pdfinfo", [pdf], { encoding: "utf8" });
  const match = /^Pages:\s+(\d+)/m.exec(info);
  if (!match) {
    throw new Error(`페이지 수를 읽지 못했습니다: ${pdf}`);
  }
  return Number(match[1]);
};

const main = (): void => {
  const { values } = parseArgs({ options: { pdf: { type: "string" } } });
  const pdfArg = values.pdf ?? process.env.BROCHURE_PDF;
  if (!pdfArg) {
    throw new Error("PDF 경로가 필요합니다: npm run pages -- --pdf <소개서.pdf>");
  }
  const pdf = resolve(pdfArg);
  if (!existsSync(pdf)) {
    throw new Error(`PDF가 없습니다: ${pdf}`);
  }

  const pages = pageCount(pdf);
  if (pages !== BROCHURE_PAGES.length) {
    throw new Error(`PDF는 ${pages}페이지인데 src/config/brochure.ts에는 ${BROCHURE_PAGES.length}페이지가 정의되어 있습니다.`);
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  execFileSync("pdftoppm", [
    "-jpeg",
    "-jpegopt",
    `quality=${PAGE_IMAGE.jpegQuality}`,
    "-scale-to-x",
    String(PAGE_IMAGE.width),
    "-scale-to-y",
    "-1",
    pdf,
    join(outDir, "raw"),
  ]);

  // pdftoppm은 페이지 수에 따라 자릿수가 달라지므로(raw-01, raw-1) 이름을 통일한다
  readdirSync(outDir)
    .filter((name) => name.startsWith("raw-"))
    .forEach((name) => {
      const index = Number(/raw-(\d+)\.jpg$/.exec(name)?.[1]);
      renameSync(join(outDir, name), join(outDir, PAGE_IMAGE.fileName(index)));
    });

  console.log(`[pages] ${pages}페이지 → ${outDir}`);
};

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const hint = message.includes("ENOENT") ? " (poppler-utils의 pdftoppm·pdfinfo를 설치하세요)" : "";
  console.error(`[pages] 실패: ${message}${hint}`);
  process.exit(1);
}
