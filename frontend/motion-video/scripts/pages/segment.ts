// 페이지 이미지를 구성요소로 해체한다 (재귀).
// 영역마다 1) 단색 카드·패널(컨테이너)을 찾아 색·모서리를 뽑고 2) 그 영역 바탕 위의 내용 블록(제목줄·문단·사진·아이콘)을 찾는다.
// 컨테이너 안은 같은 방식으로 다시 해체하므로, 잘라 낸 요소의 바탕색은 항상 바로 아래 면의 색과 같다.
// 계산은 1/4 해상도 격자(가로 500칸)에서 하고, 결과는 ref px(가로 2000)로 저장한다.
import sharp from "sharp";
import type { Box, LayoutElement, PageLayout } from "../../src/brochure/layout";

const GRID_W = 500;
const CELL = 4; // 1칸 = ref 4px
const PANEL_THRESHOLD = 5; // 아주 옅은 패널(#F5F8FE 등)도 잡는다
const CONTENT_THRESHOLD = 30;
const OPEN_RADIUS = 2; // 이보다 가는 선·글자는 패널 후보에서 지운다
const MIN_PANEL_CELLS = 750; // ref 12,000px² 이상
const MIN_PANEL_FILL = 0.88;
/** 패널 가장자리 띠에서 같은 색이어야 하는 비율 (말풍선 꼬리·가장자리에 닿은 스크린샷을 허용) */
const MIN_BAND_UNIFORM = 0.6;
const BAND = { from: 1, to: 4 } as const;
const MAX_DEPTH = 3;
const MIN_CONTENT_CELLS = 25;
const DILATE = { x: 3, y: 2 }; // 이 간격 안의 글자·아이콘은 한 블록으로 묶는다
const MAX_RADIUS = 40;

type Rgb = readonly [number, number, number];
type Grid = Readonly<{ w: number; h: number; px: Uint8Array }>;
type Rect = Readonly<{ x0: number; y0: number; x1: number; y1: number }>;
type Comp = Rect & Readonly<{ count: number }>;

const at = (g: Grid, x: number, y: number): Rgb => {
  const i = (y * g.w + x) * 3;
  return [g.px[i], g.px[i + 1], g.px[i + 2]];
};
const diff = (a: Rgb, b: Rgb): number => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
const hex = (c: Rgb): string => `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
const cells = (r: Rect): number => (r.x1 - r.x0 + 1) * (r.y1 - r.y0 + 1);
const toBox = (r: Rect): Box => ({ x: r.x0 * CELL, y: r.y0 * CELL, w: (r.x1 - r.x0 + 1) * CELL, h: (r.y1 - r.y0 + 1) * CELL });
const readingOrder = (a: Box, b: Box): number => Math.floor(a.y / 80) - Math.floor(b.y / 80) || a.x - b.x;
const inset = (r: Rect, n: number): Rect => ({ x0: r.x0 + n, y0: r.y0 + n, x1: r.x1 - n, y1: r.y1 - n });

const median = (colors: ReadonlyArray<Rgb>): Rgb => {
  const pick = (k: 0 | 1 | 2) => [...colors.map((c) => c[k])].sort((a, b) => a - b)[Math.floor(colors.length / 2)] ?? 0;
  return [pick(0), pick(1), pick(2)];
};

/** 사각형 안쪽 테두리를 따라 색을 모은다 */
const ring = (g: Grid, r: Rect): ReadonlyArray<Rgb> => {
  const out: Rgb[] = [];
  for (let x = r.x0; x <= r.x1; x += 1) out.push(at(g, x, r.y0), at(g, x, r.y1));
  for (let y = r.y0; y <= r.y1; y += 1) out.push(at(g, r.x0, y), at(g, r.x1, y));
  return out;
};

const maskOf = (g: Grid, bg: Rgb, threshold: number, area: Rect, blocked: ReadonlyArray<Rect>): Uint8Array => {
  const m = new Uint8Array(g.w * g.h);
  const isBlocked = (x: number, y: number) => blocked.some((b) => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1);
  for (let y = area.y0; y <= area.y1; y += 1)
    for (let x = area.x0; x <= area.x1; x += 1) if (diff(at(g, x, y), bg) > threshold && !isBlocked(x, y)) m[y * g.w + x] = 1;
  return m;
};

/** 직사각형 구조 요소로 팽창(value=1) 또는 침식(value=0) */
const morph = (m: Uint8Array, w: number, h: number, rx: number, ry: number, value: 0 | 1): Uint8Array => {
  const pass = (src: Uint8Array, horizontal: boolean, r: number): Uint8Array => {
    const out = new Uint8Array(src.length).fill(value === 1 ? 0 : 1);
    for (let y = 0; y < h; y += 1)
      for (let x = 0; x < w; x += 1) {
        if (src[y * w + x] !== value) continue;
        for (let d = -r; d <= r; d += 1) {
          const [nx, ny] = horizontal ? [x + d, y] : [x, y + d];
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) out[ny * w + nx] = value;
        }
      }
    return out;
  };
  return pass(pass(m, true, rx), false, ry);
};

/** 연결 요소 라벨링. 경계 상자는 bboxSource(팽창 전 마스크)의 픽셀로 계산한다 */
const components = (m: Uint8Array, w: number, h: number, bboxSource: Uint8Array = m): ReadonlyArray<Comp> => {
  const label = new Int32Array(m.length).fill(-1);
  const stack = new Int32Array(m.length);
  let next = 0;
  for (let start = 0; start < m.length; start += 1) {
    if (!m[start] || label[start] >= 0) continue;
    let top = 0;
    stack[top++] = start;
    label[start] = next;
    while (top > 0) {
      const i = stack[--top];
      const x = i % w;
      [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i >= w ? i - w : -1, i < m.length - w ? i + w : -1].forEach((n) => {
        if (n >= 0 && m[n] && label[n] < 0) {
          label[n] = next;
          stack[top++] = n;
        }
      });
    }
    next += 1;
  }
  const acc = Array.from({ length: next }, () => ({ x0: w, y0: h, x1: -1, y1: -1, count: 0 }));
  for (let i = 0; i < m.length; i += 1) {
    if (label[i] < 0 || !bboxSource[i]) continue;
    const a = acc[label[i]];
    const x = i % w;
    const y = (i - x) / w;
    [a.x0, a.y0, a.x1, a.y1, a.count] = [Math.min(a.x0, x), Math.min(a.y0, y), Math.max(a.x1, x), Math.max(a.y1, y), a.count + 1];
  }
  return acc.filter((a) => a.count > 0);
};

/** 위쪽 테두리에서 처음 패널 색이 나오는 거리로 모서리 반경을 잰다 */
const cornerRadius = (g: Grid, r: Rect, color: Rgb): number => {
  const row = r.y0;
  let x = r.x0;
  while (x < r.x1 && diff(at(g, x, row), color) > 12) x += 1;
  return Math.min(MAX_RADIUS, ((x - r.x0) * CELL) * 1.6, (r.y1 - r.y0) * CELL * 0.5);
};

/** 영역 테두리와 이어지지 않은 빈칸(패널 안의 흰 말풍선·스크린샷 등)을 채운다 */
const fillHoles = (m: Uint8Array, w: number, area: Rect): Uint8Array => {
  const outside = new Uint8Array(m.length);
  const stack: number[] = [];
  const push = (x: number, y: number) => {
    const i = y * w + x;
    if (x < area.x0 || x > area.x1 || y < area.y0 || y > area.y1 || m[i] || outside[i]) return;
    outside[i] = 1;
    stack.push(i);
  };
  for (let x = area.x0; x <= area.x1; x += 1) [push(x, area.y0), push(x, area.y1)];
  for (let y = area.y0; y <= area.y1; y += 1) [push(area.x0, y), push(area.x1, y)];
  while (stack.length > 0) {
    const i = stack.pop() ?? 0;
    const x = i % w;
    const y = (i - x) / w;
    [push(x - 1, y), push(x + 1, y), push(x, y - 1), push(x, y + 1)];
  }
  return m.map((v, i) => {
    const x = i % w;
    const y = (i - x) / w;
    return v || (x >= area.x0 && x <= area.x1 && y >= area.y0 && y <= area.y1 && !outside[i]) ? 1 : 0;
  });
};

/** 가장자리 안쪽 띠의 모든 칸 색 */
const band = (g: Grid, r: Rect): ReadonlyArray<Rgb> =>
  Array.from({ length: BAND.to - BAND.from + 1 }, (_, k) => ring(g, inset(r, BAND.from + k))).flat();

type Panel = Readonly<{ rect: Rect; color: Rgb }>;

const findPanels = (g: Grid, area: Rect, bg: Rgb): ReadonlyArray<Panel> => {
  const raw = maskOf(g, bg, PANEL_THRESHOLD, area, []);
  const opened = morph(morph(raw, g.w, g.h, OPEN_RADIUS, OPEN_RADIUS, 0), g.w, g.h, OPEN_RADIUS, OPEN_RADIUS, 1);
  return components(fillHoles(opened, g.w, area), g.w, g.h)
    .filter((c) => cells(c) >= MIN_PANEL_CELLS && c.count / cells(c) >= MIN_PANEL_FILL && cells(c) < cells(area) * 0.92)
    .flatMap((c) => {
      const samples = band(g, c);
      const color = median(samples);
      const uniform = samples.filter((s) => diff(s, color) <= 12).length / samples.length;
      return uniform >= MIN_BAND_UNIFORM && diff(color, bg) >= PANEL_THRESHOLD ? [{ rect: c, color }] : [];
    });
};

const findContent = (g: Grid, area: Rect, bg: Rgb, blocked: ReadonlyArray<Rect>): ReadonlyArray<Rect> => {
  const raw = maskOf(g, bg, CONTENT_THRESHOLD, area, blocked);
  const grouped = morph(raw, g.w, g.h, DILATE.x, DILATE.y, 1);
  return components(grouped, g.w, g.h, raw)
    .filter((c) => cells(c) >= MIN_CONTENT_CELLS)
    .map((c) => ({ x0: Math.max(area.x0, c.x0 - 1), y0: Math.max(area.y0, c.y0 - 1), x1: Math.min(area.x1, c.x1 + 1), y1: Math.min(area.y1, c.y1 + 1) }));
};

/** 요소 트리 (id는 평탄화할 때 붙인다) */
type Node = Readonly<{ box: Box; panel?: Readonly<{ color: string; radius: number }>; children: ReadonlyArray<Node> }>;

const segmentRegion = (g: Grid, area: Rect, bg: Rgb, depth: number): ReadonlyArray<Node> => {
  const panels = depth < MAX_DEPTH ? findPanels(g, area, bg) : [];
  const blocked = panels.map((p) => p.rect);
  const leaves: ReadonlyArray<Node> = findContent(g, area, bg, blocked).map((r) => ({ box: toBox(r), children: [] }));
  const containers: ReadonlyArray<Node> = panels.map(({ rect, color }) => ({
    box: toBox(rect),
    panel: { color: hex(color), radius: cornerRadius(g, rect, color) },
    children: segmentRegion(g, inset(rect, 2), color, depth + 1),
  }));
  return [...leaves, ...containers].sort((a, b) => readingOrder(a.box, b.box));
};

const flatten = (nodes: ReadonlyArray<Node>, parent: number | null, start: number): ReadonlyArray<LayoutElement> =>
  nodes.reduce<ReadonlyArray<LayoutElement>>((acc, node) => {
    const id = start + acc.length;
    const self: LayoutElement = node.panel
      ? { kind: "panel", id, box: node.box, color: node.panel.color, radius: node.panel.radius, parent }
      : { kind: "crop", id, box: node.box, parent };
    return [...acc, self, ...flatten(node.children, id, id + 1)];
  }, []);

export const segmentPage = async (imagePath: string, page: number): Promise<PageLayout> => {
  const { data, info } = await sharp(imagePath).resize(GRID_W).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const g: Grid = { w: info.width, h: info.height, px: new Uint8Array(data) };
  const whole: Rect = { x0: 0, y0: 0, x1: g.w - 1, y1: g.h - 1 };
  const bg = median(ring(g, whole));
  return { page, background: hex(bg), elements: flatten(segmentRegion(g, inset(whole, 1), bg, 0), null, 0) };
};
