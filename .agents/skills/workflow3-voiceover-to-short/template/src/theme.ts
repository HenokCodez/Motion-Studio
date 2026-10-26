// ============================================================================
// theme.ts  —  EVERY number that controls the look lives here.
// Canvas: 1080 x 1920 (9:16), 30 fps. Do NOT hard-code colors/positions elsewhere.
// Measured from the reference videos (see reference/01-style-bible.md).
// ============================================================================
export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const COLORS = {
  bg: '#0a0a0a', // matches Grid_1.mp4 background (rgb 11,11,11)
  text: '#F4F4F4', // settled caption words
  ghost: '#6B6B6B', // newest (just-appeared) words
  dim: '#9A9A9A', // secondary text
  line: 'rgba(255,255,255,0.42)', // connector lines
  badgeWhite: '#FFFFFF',
  badgeBlack: '#050505',
  badgeInk: '#0A0A0A',
  cardBorder: 'rgba(255,255,255,0.16)',
  watermark: 'rgba(255,255,255,0.30)',
};

export const FONT =
  '"Inter", "SF Pro Display", "Helvetica Neue", Arial, sans-serif';

// Safe layout zones (pixels, canvas coordinates)
export const ZONES = {
  // Media (cards, badges, cutouts) must stay inside this box. Center = (540, 600).
  media: { x: 90, y: 170, w: 900, h: 860 },
  mediaCx: 540,
  mediaCy: 600,
  // Caption block centre-line
  captionW: 880,
  captionMediaCy: 1200, // when media is present  (~62% of height)
  captionNoMediaCy: 880, // when there is no media (~46% of height)
  watermarkCy: 1650, // ~86% of height
};

export const SHADOW_CARD =
  '0 44px 90px rgba(0,0,0,0.9), 0 0 0 1.5px rgba(255,255,255,0.16), 0 0 140px rgba(255,255,255,0.07)';
export const SHADOW_BADGE =
  '0 22px 46px rgba(0,0,0,0.85), 0 0 0 1.5px rgba(255,255,255,0.22), 0 0 60px rgba(255,255,255,0.08)';

export const MOTION = {
  enterFrames: 14, // media enter (spring, no overshoot)
  exitFrames: 6, // media fade-out
  wordFadeFrames: 6, // each caption word fade/rise
  wordSettleFrames: 10, // ghost -> full colour
  captionExitFrames: 4,
  kenBurns: 0.045, // total extra zoom over a media run
};
