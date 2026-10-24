// 실행: npm run pages -- --pdf <소개서.pdf> [--debug]
// 1) PDF 각 페이지를 public/pages/page-01.jpg … 로 렌더링  2) 페이지를 구성요소로 해체해 layout.json 저장
// --debug: public/pages/debug/에 해체 결과(패널=파랑, 요소=빨강)를 겹친 확인용 이미지 저장
// 소개서 이미지와 분석 결과는 저장소에 커밋하지 않는다.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";
import { type BrochureLayout, LAYOUT_FILE, type PageLayout } from "../../src/brochure/layout";
import { BROCHURE_PAGES, PAGE_ASPECT, PAGE_IMAGE, REF_WIDTH } from "../../src/config/brochure";
import { segmentPage } from "./segment";

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

const DEBUG_WIDTH = 1000;

const writeDebug = async (layout: PageLayout): Promise<void> => {
  const scale = DEBUG_WIDTH / REF_WIDTH;
  const height = Math.round(DEBUG_WIDTH / PAGE_ASPECT);
  const rects = layout.elements
    .map(({ kind, id, box }) => {
      const [x, y, w, h] = [box.x, box.y, box.w, box.h].map((v) => v * scale);
      const color = kind === "panel" ? "#2563eb" : "#ef4444";
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${color}" stroke-width="2"/><text x="${x + 3}" y="${y + 11}" font-size="11" fill="${color}">${id}</text>`;
    })
    .join("");
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${DEBUG_WIDTH}" height="${height}">${rects}</svg>`);
  const debugDir = join(outDir, "debug");
  mkdirSync(debugDir, { recursive: true });
  await sharp(join(outDir, PAGE_IMAGE.fileName(layout.page)))
    .resize(DEBUG_WIDTH, height)
    .composite([{ input: svg }])
    .png()
    .toFile(join(debugDir, `page-${String(layout.page).padStart(2, "0")}.png`));
};

const main = async (): Promise<void> => {
  const { values } = parseArgs({ options: { pdf: { type: "string" }, debug: { type: "boolean" } } });
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

  const pageLayouts = await Promise.all(
    BROCHURE_PAGES.map(({ page }) => segmentPage(join(outDir, PAGE_IMAGE.fileName(page)), page)),
  );
  const layout: BrochureLayout = { refWidth: REF_WIDTH, refHeight: REF_WIDTH / PAGE_ASPECT, pages: pageLayouts };
  writeFileSync(join(projectRoot, "public", LAYOUT_FILE), JSON.stringify(layout));
  pageLayouts.forEach((p) => {
    const panels = p.elements.filter((e) => e.kind === "panel").length;
    console.log(`[pages] p${String(p.page).padStart(2, "0")} 패널 ${panels}개 · 요소 ${p.elements.length - panels}개`);
  });
  if (values.debug) {
    await Promise.all(pageLayouts.map(writeDebug));
    console.log(`[pages] 확인용 이미지 → ${join(outDir, "debug")}`);
  }
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  const hint = message.includes("ENOENT") ? " (poppler-utils의 pdftoppm·pdfinfo를 설치하세요)" : "";
  console.error(`[pages] 실패: ${message}${hint}`);
  process.exit(1);
});
