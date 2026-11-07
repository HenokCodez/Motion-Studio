import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {FONT, HV} from '../tokens';
import {LEAD, softIn, wordPop} from '../motion';

/** A39: two circles slide in, labels pop, then circles overlap and the rotated result word lands. */
export const Venn: React.FC<{
  labelA: string; labelB: string; result: string;
  frames: {a: number; b: number; overlap: number; result: number}; // spoken frames
  resultColor?: string;
}> = ({labelA, labelB, result, frames, resultColor = HV.ink}) => {
  const frame = useCurrentFrame();
  const C = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const enter = interpolate(frame, [frames.a - LEAD - 16, frames.a - LEAD], [1, 0], {...C, easing: Easing.out(Easing.cubic)});
  const merge = interpolate(frame, [frames.overlap - LEAD, frames.overlap - LEAD + 20], [0, 1], {...C, easing: Easing.inOut(Easing.cubic)});
  const gap = 400 - 140 * merge; // centre distance in px (diameter 360 => overlap when < 360)
  const d = 360;
  const circle = (dx: number, label: string, at: number) => (
    <div style={{position: 'absolute', left: 960 - d / 2 + dx, top: 540 - d / 2, width: d, height: d, borderRadius: 999,
      border: `5px solid ${HV.ink}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: 1 - enter, filter: `blur(${enter * 14}px)`}}>
      <span style={{fontFamily: FONT, fontSize: 56, fontWeight: 400, color: HV.ink, ...wordPop(frame, at - LEAD)}}>{label}</span>
    </div>
  );
  const edge = 520 * enter; // slide-in from the sides
  return (
    <div style={{position: 'absolute', inset: 0, ...softIn(frame, 0, 6)}}>
      {circle(-gap / 2 - edge, labelA, frames.a)}
      {circle(gap / 2 + edge, labelB, frames.b)}
      <div style={{position: 'absolute', left: 960 - 40, top: 540 - 120, width: 80, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <span style={{fontFamily: FONT, fontSize: 44, fontWeight: 700, color: resultColor, transform: 'rotate(-90deg)', whiteSpace: 'nowrap',
          ...wordPop(frame, frames.result - LEAD)}}>{result}</span>
      </div>
    </div>
  );
};
