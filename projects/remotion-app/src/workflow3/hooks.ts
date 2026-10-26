import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MOTION} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Props every media component receives. Computed once in Short.tsx. */
export type MP = {
  durationInFrames: number; // this scene
  startFrame: number; // this scene's start on the global timeline
  runStart: number; // first frame of the run of scenes sharing this media
  runEnd: number; // last frame (exclusive) of that run
  skipEntry: boolean; // media continues from previous scene
  skipExit: boolean; // media continues into next scene
};

export const fit = (w: number, h: number, maxW: number, maxH: number, cap = 2) => {
  const s = Math.min(maxW / w, maxH / h, cap);
  return {w: Math.round(w * s), h: Math.round(h * s), s};
};

/** 0..1 spring with no overshoot + derived transform values. `delay` in frames. */
export const useEnter = (mp: MP, delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (mp.skipEntry) return {p: 1, opacity: 1, scale: 1, y: 0};
  const p = spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.6}, durationInFrames: MOTION.enterFrames});
  return {p, opacity: Math.min(1, p * 1.6), scale: 0.9 + 0.1 * p, y: (1 - p) * 40};
};

export const useExit = (mp: MP) => {
  const frame = useCurrentFrame();
  if (mp.skipExit) return 1;
  return interpolate(frame, [mp.durationInFrames - MOTION.exitFrames, mp.durationInFrames], [1, 0], clamp);
};

/** 0..1 progress across the whole run of identical media (for slow zoom, progress bars). */
export const useRunProgress = (mp: MP) => {
  const frame = useCurrentFrame();
  const g = mp.startFrame + frame;
  return interpolate(g, [mp.runStart, Math.max(mp.runStart + 1, mp.runEnd)], [0, 1], clamp);
};

export const kenBurns = (p: number) => 1 + MOTION.kenBurns * Easing.inOut(Easing.quad)(p);
