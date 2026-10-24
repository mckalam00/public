// 소개서 전체(20p) 영상 설정.
// 각 페이지는 전체 화면으로 시작한 뒤, shots에 적힌 영역을 읽는 순서대로 확대·이동한다.
// 영역 좌표는 페이지를 가로 2000px로 봤을 때의 픽셀값(x, y, w, h)으로 적고 px()로 정규화한다.
import { VIDEO } from "./theme";

/** 원본 PDF 페이지 비율 (3578 × 2550 pt) */
export const PAGE_ASPECT = 3578 / 2550;
const REF_WIDTH = 2000;
const REF_HEIGHT = REF_WIDTH / PAGE_ASPECT;

export const PAGE_IMAGE = {
  dir: "pages",
  /** 확대해도 선명하도록 크게 렌더링한다 */
  width: 5000,
  jpegQuality: 90,
  fileName: (page: number): string => `page-${String(page).padStart(2, "0")}.jpg`,
} as const;

export type Region = Readonly<{ x: number; y: number; w: number; h: number }>;
export type Shot = Readonly<{ region: Region; holdSec?: number }>;
export type Section = "Intro" | "Who" | "Why" | "What" | "Value" | "Contact";

export type BrochurePage = Readonly<{
  page: number;
  section: Section;
  title: string;
  tone: "light" | "dark";
  shots: ReadonlyArray<Shot>;
}>;

const px = (x: number, y: number, w: number, h: number): Region => ({
  x: x / REF_WIDTH,
  y: y / REF_HEIGHT,
  w: w / REF_WIDTH,
  h: h / REF_HEIGHT,
});

const shot = (x: number, y: number, w: number, h: number, holdSec?: number): Shot => ({ region: px(x, y, w, h), holdSec });

export const FULL_PAGE: Region = { x: 0, y: 0, w: 1, h: 1 };

export const BROCHURE_PAGES: ReadonlyArray<BrochurePage> = [
  { page: 1, section: "Intro", title: "표지", tone: "dark", shots: [shot(80, 200, 1360, 360, 2.2), shot(60, 1170, 1900, 180, 2.4)] },
  { page: 2, section: "Intro", title: "목차", tone: "light", shots: [shot(700, 790, 1220, 370)] },
  { page: 3, section: "Who", title: "WHO & WHY", tone: "light", shots: [shot(1120, 95, 790, 1240, 1.8)] },
  {
    page: 4,
    section: "Who",
    title: "회사 소개",
    tone: "light",
    shots: [shot(90, 160, 1180, 170), shot(90, 350, 950, 270, 2.2), shot(1100, 960, 810, 340)],
  },
  { page: 5, section: "Who", title: "연혁", tone: "light", shots: [shot(90, 90, 1820, 1040, 2.6), shot(90, 1160, 1830, 180, 2.4)] },
  {
    page: 6,
    section: "Who",
    title: "전문가 팀",
    tone: "light",
    shots: [shot(90, 160, 950, 140), shot(95, 480, 1810, 425, 2.6), shot(95, 945, 1810, 385)],
  },
  {
    page: 7,
    section: "Why",
    title: "기존 조달의 한계",
    tone: "light",
    shots: [shot(90, 160, 1000, 240), shot(95, 505, 1810, 640, 3), shot(95, 1205, 1810, 130)],
  },
  { page: 8, section: "Why", title: "통합 조달 솔루션", tone: "light", shots: [shot(90, 160, 980, 240), shot(95, 480, 1810, 850, 3)] },
  { page: 9, section: "What", title: "WHAT & VALUE", tone: "light", shots: [shot(1195, 95, 715, 1240, 1.8)] },
  {
    page: 10,
    section: "What",
    title: "주요 서비스",
    tone: "light",
    shots: [shot(95, 160, 1110, 160), shot(95, 520, 1020, 810), shot(1150, 520, 760, 810, 2.6)],
  },
  {
    page: 11,
    section: "What",
    title: "01 현장 조달 서비스",
    tone: "light",
    shots: [
      shot(90, 90, 1120, 230),
      shot(95, 445, 575, 420),
      shot(95, 905, 575, 425),
      shot(710, 445, 580, 885),
      shot(1330, 445, 575, 350),
      shot(1330, 835, 575, 495),
    ],
  },
  {
    page: 12,
    section: "What",
    title: "02 현장 맞춤형 커머스",
    tone: "light",
    shots: [shot(90, 90, 1280, 310), shot(95, 465, 450, 865), shot(590, 465, 1315, 580, 2.2), shot(590, 1075, 1315, 255, 2.4)],
  },
  {
    page: 13,
    section: "What",
    title: "03 잉여 자산 거래 플랫폼",
    tone: "light",
    shots: [shot(90, 90, 900, 350), shot(95, 520, 885, 810, 2.2), shot(1020, 520, 885, 810, 2.2)],
  },
  {
    page: 14,
    section: "What",
    title: "04 통합 관리 솔루션",
    tone: "light",
    shots: [
      shot(90, 90, 1120, 300),
      shot(118, 478, 870, 400),
      shot(1012, 478, 870, 400),
      shot(118, 903, 870, 400),
      shot(1012, 903, 870, 400),
    ],
  },
  {
    page: 15,
    section: "Value",
    title: "성과 및 지표",
    tone: "light",
    shots: [shot(90, 160, 950, 240), shot(95, 480, 720, 850, 2.4), shot(835, 510, 1035, 790, 2.6)],
  },
  { page: 16, section: "Value", title: "고객 도입 사례", tone: "light", shots: [shot(90, 160, 800, 180), shot(95, 410, 1810, 440, 3), shot(95, 875, 1810, 430, 3)] },
  { page: 17, section: "Value", title: "정부 및 기술 인증", tone: "light", shots: [shot(90, 160, 920, 100), shot(95, 415, 1810, 510, 2.8), shot(95, 950, 1810, 380, 2.6)] },
  { page: 18, section: "Value", title: "데이터 자산 가치", tone: "light", shots: [shot(90, 160, 1050, 160), shot(95, 505, 1265, 825, 2.6), shot(1410, 505, 460, 825, 2.4)] },
  {
    page: 19,
    section: "Value",
    title: "자주 묻는 질문",
    tone: "light",
    shots: [shot(90, 160, 800, 160), shot(95, 480, 1810, 260, 2.6), shot(95, 778, 1810, 260, 2.6), shot(95, 1075, 1810, 260, 2.6)],
  },
  {
    page: 20,
    section: "Contact",
    title: "도입 문의",
    tone: "dark",
    shots: [shot(560, 90, 880, 300), shot(95, 460, 1810, 305, 2.6), shot(100, 800, 1190, 470, 2.4), shot(1325, 800, 580, 475, 3)],
  },
];

export const BROCHURE_TIMING = {
  /** 페이지 전체를 보여 주는 첫 장면 */
  establishSec: 1.6,
  /** 영역 사이 카메라 이동 */
  moveSec: 0.75,
  /** 영역 기본 정지 시간 */
  holdSec: 1.6,
  /** 페이지 사이 크로스페이드 */
  transitionSec: 0.6,
  /** 마지막 페이지에서 전체 화면으로 돌아와 머무는 시간 */
  outroSec: 2.5,
} as const;

const toFrames = (sec: number): number => Math.round(sec * VIDEO.fps);

export type ShotTiming = Readonly<{ region: Region; moveStart: number; holdStart: number; holdEnd: number }>;

/** 페이지 안의 카메라 타임라인(프레임). 첫 항목은 전체 페이지 */
export const pageTimeline = (page: BrochurePage, isLast: boolean): ReadonlyArray<ShotTiming> => {
  const t = BROCHURE_TIMING;
  const establish: ShotTiming = { region: FULL_PAGE, moveStart: 0, holdStart: 0, holdEnd: toFrames(t.establishSec) };
  const shots = page.shots.reduce<ReadonlyArray<ShotTiming>>((acc, s) => {
    const prevEnd = acc[acc.length - 1].holdEnd;
    const holdStart = prevEnd + toFrames(t.moveSec);
    return [...acc, { region: s.region, moveStart: prevEnd, holdStart, holdEnd: holdStart + toFrames(s.holdSec ?? t.holdSec) }];
  }, [establish]);
  if (!isLast) return shots;
  const lastEnd = shots[shots.length - 1].holdEnd;
  const backStart = lastEnd + toFrames(t.moveSec);
  return [...shots, { region: FULL_PAGE, moveStart: lastEnd, holdStart: backStart, holdEnd: backStart + toFrames(t.outroSec) }];
};

export const TRANSITION_FRAMES = toFrames(BROCHURE_TIMING.transitionSec);

/** 다음 페이지와 겹치는 전환 구간까지 포함한 페이지 길이 */
export const pageFrames = (page: BrochurePage, isLast: boolean): number => {
  const timeline = pageTimeline(page, isLast);
  return timeline[timeline.length - 1].holdEnd + (isLast ? 0 : TRANSITION_FRAMES);
};

/** 각 페이지의 시작 프레임 (전환 구간만큼 겹친다) */
export const pageStarts: ReadonlyArray<number> = BROCHURE_PAGES.reduce<ReadonlyArray<number>>(
  (acc, _, i) => (i === 0 ? [0] : [...acc, acc[i - 1] + pageFrames(BROCHURE_PAGES[i - 1], false) - TRANSITION_FRAMES]),
  [],
);

export const BROCHURE_TOTAL_FRAMES =
  pageStarts[pageStarts.length - 1] + pageFrames(BROCHURE_PAGES[BROCHURE_PAGES.length - 1], true);

export const BROCHURE_MUSIC_FILE = "audio/brochure-music.wav";
