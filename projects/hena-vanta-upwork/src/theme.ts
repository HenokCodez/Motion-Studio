export const FONT = "Arial, 'Liberation Sans', Helvetica, sans-serif";
export const COLORS = {
  text: "#000000", textOnDark: "#FFFFFF", red: "#FF0000", redOnDark: "#FF3B3B", green: "#00FF0F",
  gray: "#666666", grayOnDark: "#BBBBBB", placeholderBg: "#1A1A1A",
};
/** px at 1080 high (reference image 08: bold italic, big) */
export const TIER = { xl: 108, l: 84, m: 64, s: 44, xs: 32 } as const;
export const LINE_HEIGHT = 1.02;

/** Vertical slots (% of canvas height). EVERYTHING is centred horizontally at 50%. */
export const SLOT = {
  media: { cy: 38, w16x9: 56, w9x16: 17, w4x3: 44, w1x1: 34, w3x2: 50 },
  mediaWithHeadlineCy: 43, headline: 9,
  statementUnderMedia: 78, noteUnderMedia: 91,
  statement: 46, note: 64,
  stat: 40, statLabel: 58, statNote: 74,
  itemsTitle: 18, itemsStart: 34, itemsStep: 11,
};

/** Motion: calm and professional. No tilt, no overshoot, no per-letter effects. */
export const MOTION = {
  softInSec: 0.35, softRisePx: 20,
  fadeOutSec: 0.2, sceneFadeOutSec: 0.25,
  countUpSec: 0.9,
  lineDrawSec: 0.8, journeyRevealSec: 0.35,
  stepBorderSec: 0.35, stepConnectorSec: 0.3,
  imagePushPerSec: 0.01,
};
export const timeToFrame = (sec: number, fps: number) => Math.round(sec * fps);
