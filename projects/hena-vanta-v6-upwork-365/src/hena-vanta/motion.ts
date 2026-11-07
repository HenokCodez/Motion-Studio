import {CSSProperties} from 'react';
import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './tokens';

export const sec = (s: number) => Math.round(s * FPS);
const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const outCubic = Easing.out(Easing.cubic);
const inQuad = Easing.in(Easing.quad);
const outQuart = Easing.out(Easing.poly(4));

/** every word/object enters 3 frames BEFORE it is spoken */
export const LEAD = 3;

export const springPop = (frame: number, start: number) =>
  spring({frame: frame - start, fps: FPS, config: {damping: 11, stiffness: 260, mass: 0.7}});

export const springLayout = (frame: number, start: number) =>
  spring({frame: frame - start, fps: FPS, config: {damping: 20, stiffness: 160, mass: 0.8}});

/** softIn: calm default entrance (12 f) */
export function softIn(frame: number, start: number, dur = 12): CSSProperties {
  const t = interpolate(frame, [start, start + dur], [0, 1], {...C, easing: outCubic});
  return {
    opacity: t,
    filter: `blur(${(1 - t) * 12}px)`,
    transform: `translateY(${(1 - t) * 24}px) scale(${0.96 + 0.04 * t})`,
    willChange: 'transform, opacity, filter',
  };
}

/** wordPop: kinetic word entrance (12 f) */
export function wordPop(frame: number, start: number): CSSProperties {
  const o = interpolate(frame, [start, start + 6], [0, 1], C);
  const s = springPop(frame, start);
  const b = interpolate(frame, [start, start + 8], [8, 0], {...C, easing: outCubic});
  const y = interpolate(frame, [start, start + 12], [14, 0], {...C, easing: outCubic});
  return {opacity: o, filter: `blur(${b}px)`, transform: `translateY(${y}px) scale(${0.92 + 0.08 * Math.min(s, 1.08)})`};
}

/** popIn: pills, badges, bubbles, stats */
export function popIn(frame: number, start: number): CSSProperties {
  const s = springPop(frame, start);
  const o = interpolate(frame, [start, start + 4], [0, 1], C);
  return {opacity: o, transform: `scale(${0.6 + 0.4 * s})`};
}

export function slideIn(frame: number, start: number, from = 120, dur = 14): CSSProperties {
  const t = interpolate(frame, [start, start + dur], [0, 1], {...C, easing: outQuart});
  const o = interpolate(frame, [start, start + 6], [0, 1], C);
  return {opacity: o, filter: `blur(${(1 - t) * 6}px)`, transform: `translateX(${(1 - t) * from}px)`};
}

export function riseIn(frame: number, start: number, from = 80, dur = 14): CSSProperties {
  const t = interpolate(frame, [start, start + dur], [0, 1], {...C, easing: outCubic});
  const o = interpolate(frame, [start, start + 6], [0, 1], C);
  return {opacity: o, filter: `blur(${(1 - t) * 10}px)`, transform: `translateY(${(1 - t) * from}px)`};
}

/** blurOut: the ONLY exit. starts at `start`, 8 f. Returns {} before start. */
export function blurOut(frame: number, start: number, dur = 8, dx = 0, dy = -12): CSSProperties {
  const t = interpolate(frame, [start, start + dur], [0, 1], {...C, easing: inQuad});
  if (t <= 0) return {};
  return {
    opacity: 1 - t,
    filter: `blur(${t * 14}px)`,
    transform: `translate(${dx * t}px, ${dy * t}px) scale(${1 + 0.03 * t})`,
  };
}

/** focusDim: non-active items */
export function focusDim(frame: number, start: number, active: boolean): CSSProperties {
  const t = interpolate(frame, [start, start + 8], [0, 1], C);
  return active
    ? {transform: `scale(${1 + 0.04 * t})`}
    : {opacity: 1 - 0.7 * t, filter: `blur(${1.5 * t}px)`};
}

/** drawOn progress 0..1 */
export const drawOn = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {...C, easing: Easing.out(Easing.quad)});

/** countUp: out-expo 45 f */
export const countUp = (frame: number, start: number, target: number, dur = 45) =>
  Math.round(target * interpolate(frame, [start, start + dur], [0, 1], {...C, easing: Easing.out(Easing.exp)}));

/** seeded pseudo-random in [-1, 1] so drift is stable between renders */
export const seeded = (seed: number, k = 0) => {
  const x = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

/** camera drift for a scene of `dur` frames */
export function drift(frame: number, dur: number, seed: number): CSSProperties {
  const p = interpolate(frame, [0, dur], [0, 1], C);
  const tx = seeded(seed, 1) * 24 * p;
  const ty = seeded(seed, 2) * 16 * p;
  const sc = 1 + 0.04 * p;
  return {transform: `translate(${tx}px, ${ty}px) scale(${sc})`};
}

/** cursor path: quadratic bezier from a to b with ease-in-out and 3 px overshoot settle */
export function cursorAt(frame: number, start: number, dur: number, a: [number, number], b: [number, number]) {
  const t = interpolate(frame, [start, start + dur], [0, 1], {...C, easing: Easing.inOut(Easing.cubic)});
  const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.12;
  const my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.12;
  const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * mx + t * t * b[0];
  const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * my + t * t * b[1];
  return {x, y};
}

/** click pulse 0..1..0 over 6 f beginning at `at` */
export const clickPulse = (frame: number, at: number) =>
  interpolate(frame, [at, at + 3, at + 6], [0, 1, 0], C);
