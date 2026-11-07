import {Easing, interpolate} from 'remotion';
export const C = {ink:'#FAF4D9', card:'#231F20', orange:'#FF6B35', hi:'#6B3A2E', blue:'#1677FF', lime:'#CBFF4D'};
export const SAFE = {x0:154, y0:86, x1:1766, y1:994, w:1612, h:908, cx:960, cy:540};
export const HAND = "Excalifont, 'Gochi Hand', cursive";
export const HEAVY = "InterXB, Inter, sans-serif";
export const MIN_FONT = 24;
export const EASE = {
  out: Easing.bezier(0.22, 1, 0.36, 1),      // "out-expo-ish"  (0.22,1,0.36,1)
  inOut: Easing.bezier(0.65, 0, 0.35, 1),    // (0.65,0,0.35,1)
  back: Easing.bezier(0.34, 1.56, 0.64, 1),  // overshoot       (0.34,1.56,0.64,1)
  lin: (t: number) => t,
};
export const SPR = {
  pop:    {damping: 12, stiffness: 140, mass: 0.7},
  settle: {damping: 9,  stiffness: 90,  mass: 1},
  wobble: {damping: 5,  stiffness: 70,  mass: 1},
};
/** progress 0..1 of `frame` between start..end with easing, clamped */
export const prog = (frame: number, start: number, end: number, ease = EASE.out) =>
  interpolate(frame, [start, end], [0, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
let _ctx: CanvasRenderingContext2D | null = null;
export const textWidth = (text: string, size: number, family = HAND) => {
  if (!_ctx) _ctx = document.createElement('canvas').getContext('2d')!;
  _ctx.font = `${size}px ${family}`; return _ctx.measureText(text).width;
};
