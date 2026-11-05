// small re-exports so components import from one place
import {interpolate} from 'remotion';
export {LEAD, blurOut, wordPop} from './motion';
export const interpolateProgress = (frame: number, start: number) =>
  interpolate(frame, [start, start + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
