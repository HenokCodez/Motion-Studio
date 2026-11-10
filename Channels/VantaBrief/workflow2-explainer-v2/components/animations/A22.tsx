import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A22.json';
export const DURATION = meta.duration;
export const A22: React.FC<{layers?: string[]; highlight?: number}> = ({layers = ['Prompt', 'Experts', 'Output'], highlight = 1}) => {
  const f = useCurrentFrame(); const ex = prog(f, 22, 58, EASE.out), fin = prog(f, 0, 14); const dia = (cy: number) => `M960 ${cy - 90} L1240 ${cy} L960 ${cy + 90} L680 ${cy} Z`;
  const ys = [0, 1, 2].map(i => (480 + i * 20) + ((300 + i * 200) - (480 + i * 20)) * ex);
  return <Stage>
    {[0, 1].map(i => <g key={i} opacity={ex > 0.6 ? (ex - 0.6) / 0.4 : 0}>{[680, 1240].map(x => <line key={x} x1={x} y1={ys[i] + 0} x2={x} y2={ys[i + 1]} stroke={C.ink} strokeWidth={3} strokeDasharray="10 12" />)}</g>)}
    {[2, 1, 0].map(i => { const hi = i === highlight; return <g key={i} opacity={fin}>
      <Pen d={roughPath(dia(ys[i]), i + 11)} p={1} fill={hi ? C.hi : C.card} color={hi ? C.orange : C.ink} w={5} />
      <Pen d={roughLine([[1250, ys[i]], [1295, ys[i]]], i + 3)} p={ex} w={3} />
      <T x={1310} y={ys[i] + 14} size={40} color={hi ? C.orange : C.ink} opacity={prog(f, 50 + i * 6, 62 + i * 6)}>{layers[i]}</T></g>; })}
  </Stage>;
};
