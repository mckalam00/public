// 소개서 페이지 해체 결과(public/pages/layout.json)의 타입·검증·로딩.
// layout.json은 npm run pages가 페이지 이미지를 분석해 만든다 (scripts/pages/segment.ts).
import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

/** 좌표는 페이지 가로를 2000으로 본 ref px */
export type Box = Readonly<{ x: number; y: number; w: number; h: number }>;

/** 단색 카드·패널: 이미지를 자르지 않고 색을 뽑아 직접 그린다. parent가 있으면 그 패널 안에 놓인다 */
export type PanelElement = Readonly<{ kind: "panel"; id: number; box: Box; color: string; radius: number; parent: number | null }>;

/** 이미지에서 잘라 낸 구성요소. parent가 있으면 그 패널 위에 올라간다 */
export type CropElement = Readonly<{ kind: "crop"; id: number; box: Box; parent: number | null }>;

export type LayoutElement = PanelElement | CropElement;

export type PageLayout = Readonly<{ page: number; background: string; elements: ReadonlyArray<LayoutElement> }>;

export type BrochureLayout = Readonly<{ refWidth: number; refHeight: number; pages: ReadonlyArray<PageLayout> }>;

export const LAYOUT_FILE = "pages/layout.json";

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

const isBox = (v: unknown): v is Box => isRecord(v) && isNumber(v.x) && isNumber(v.y) && isNumber(v.w) && isNumber(v.h);

const isElement = (v: unknown): v is LayoutElement => {
  if (!isRecord(v) || !isNumber(v.id) || !isBox(v.box) || !(v.parent === null || isNumber(v.parent))) return false;
  if (v.kind === "panel") return typeof v.color === "string" && isNumber(v.radius);
  return v.kind === "crop";
};

const isPage = (v: unknown): v is PageLayout =>
  isRecord(v) && isNumber(v.page) && typeof v.background === "string" && Array.isArray(v.elements) && v.elements.every(isElement);

export const parseLayout = (v: unknown): BrochureLayout => {
  if (!isRecord(v) || !isNumber(v.refWidth) || !isNumber(v.refHeight) || !Array.isArray(v.pages) || !v.pages.every(isPage)) {
    throw new Error(`${LAYOUT_FILE} 형식이 올바르지 않습니다. npm run pages를 다시 실행하세요.`);
  }
  return { refWidth: v.refWidth, refHeight: v.refHeight, pages: v.pages };
};

/** 렌더링 전에 layout.json을 읽어 온다 (없으면 렌더링을 멈추고 이유를 알린다) */
export const useBrochureLayout = (): BrochureLayout | null => {
  const [layout, setLayout] = useState<BrochureLayout | null>(null);
  const [handle] = useState(() => delayRender("소개서 레이아웃 로딩"));

  useEffect(() => {
    fetch(staticFile(LAYOUT_FILE))
      .then((res) => {
        if (!res.ok) throw new Error(`${LAYOUT_FILE}이 없습니다. npm run pages -- --pdf <소개서.pdf>를 먼저 실행하세요.`);
        return res.json();
      })
      .then((json: unknown) => {
        setLayout(parseLayout(json));
        continueRender(handle);
      })
      .catch((error: unknown) => cancelRender(error instanceof Error ? error : new Error(String(error))));
  }, [handle]);

  return layout;
};
