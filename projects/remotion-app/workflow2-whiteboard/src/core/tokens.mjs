// Single source of truth. The LLM never touches these.
export const CANVAS = { w: 1920, h: 1080, margin: 96, fps: 30 };
export const SAFE = {
  x: CANVAS.margin, y: CANVAS.margin,
  w: CANVAS.w - 2 * CANVAS.margin, h: CANVAS.h - 2 * CANVAS.margin,
};
export const FONT = {
  min: 32,         // absolutely nothing typed may be smaller
  label: 44,       // diagram labels
  labelFloor: 40,  // solver may shrink labels down to this, never below
  sub: 34, mono: 38, title: 170, stat: 230, statLabel: 60, header: 56,
};
export const COLOR = {
  bg: '#111111', dot: '#1c1c1c', ink: '#EDEDED', dim: '#BDBDBD',
  accent: '#FF6B35', rust: '#6B3A2A', panel: '#161616',
};
export const TIMING = {
  lead: 0.4,            // a visual lands this long BEFORE the word it illustrates (eye reads first, voice confirms)
  openAt: 0.25,         // the first content item appears this long after the scene starts, whatever its cue
  step: 0.3,            // minimum spacing between consecutive reveals
  minTail: 1.3,         // the last item must stay on screen at least this long before the scene exits
  fillGap: 2.4,         // a visible filler event (underline / marker) is added if nothing new happens for this long
  maxGap: 3.2,          // lint: no stretch longer than this without a VISIBLE event
};
export const RULES = {
  maxGapSec: 3.0,        // no visual-event gap longer than this
  targetGapSec: 2.0,     // pulses are inserted to stay under this
  maxSceneSec: 12,       // longer scenes must be split
  maxItemsPerScene: 8,
  maxWordsPerLabel: 8,
  minGap: 24,            // min px between any two items
  camMoveSec: 0.45,      // snappy camera move duration
};
export const MASCOT = { w: 190, h: 230 };
