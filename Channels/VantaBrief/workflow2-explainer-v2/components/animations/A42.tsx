import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A42.json';
export const DURATION = meta.duration;
export const A42: React.FC<{text?: string}> = ({text = '#1'}) => {
  const f = useCurrentFrame(); const s = spring({frame: f, fps: 30, config: SPR.pop}), rot = -12 + Math.sin(f * 0.4) * 4 * Math.max(0, 1 - f / 40), k = prog(f, 12, 24);
  return <Stage>
    <g transform={`translate(960 540) rotate(${rot}) scale(${Math.min(s, 1.15)}) translate(-960 -540)`}>
      <circle cx={960} cy={540} r={130} fill={C.card} /><Pen d={roughEllipse(960, 540, 260, 260, 5)} p={prog(f, 0, 12)} w={6} />
      <T x={960} y={585} size={120} heavy anchor="middle" color={C.orange} opacity={prog(f, 4, 12)}>{text}</T></g>
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <Pen key={i} d={roughLine([[960 + a * 190, 540 + b * 190], [960 + a * 230, 540 + b * 230]], i + 1)} p={k} w={5} opacity={1 - prog(f, 26, 40)} />)}
  </Stage>;
};
