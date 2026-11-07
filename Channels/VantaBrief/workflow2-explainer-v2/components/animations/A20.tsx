import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A20.json';
export const DURATION = meta.duration;
export const A20: React.FC<{layers?: string[]; highlight?: number; note?: string}> = ({layers = ['Application', 'Framework', 'Model', 'Hardware'], highlight = 2, note = 'You are here'}) => {
  const f = useCurrentFrame(); const n = layers.length, tops = layers.map((_, i) => 400 + i * 120 - (4 - n) * 60 + (4 - n) * 0); const hy = tops[highlight];
  return <Stage>
    {layers.map((l, j) => { const p = prog(f, (n - 1 - j) * 12, (n - 1 - j) * 12 + 14, EASE.out), hi = j === highlight;
      return <g key={j} transform={`translate(0 ${-(1 - p) * 140})`} opacity={p}><Card x={610} y={tops[j]} w={700} h={100} fill={hi ? C.hi : C.card} stroke={hi ? C.orange : C.ink} seed={j + 60} />
        <T x={960} y={tops[j] + 66} size={44} anchor="middle" color={hi ? C.orange : C.ink}>{l}</T></g>; })}
    <Arrow x1={1500} y1={hy + 50} x2={1335} y2={hy + 50} p={prog(f, 64, 76, EASE.out)} color={C.orange} w={5} seed={6} />
    <T x={1520} y={hy + 62} size={36} color={C.orange} opacity={prog(f, 70, 80)}>{note}</T>
  </Stage>;
};
