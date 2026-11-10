import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A37.json';
export const DURATION = meta.duration;
export const A37: React.FC<{stats?: {v: number; s: string; l: string}[]}> = ({stats = [{v: 40, s: '%', l: 'Faster checks'}, {v: 28, s: '%', l: 'Fewer errors'}, {v: 45, s: '%', l: 'Lower cost'}]}) => {
  const f = useCurrentFrame(); const xs = [170, 740, 1310], ys = [380, 440, 300];
  return <Stage>{stats.map((st, i) => { const p = prog(f, 4 + i * 10, 24 + i * 10, EASE.out), hi = i === 2, n = Math.round(st.v * prog(f, 14 + i * 10, 50 + i * 10, EASE.out));
    return <g key={i} transform={`translate(0 ${(1 - p) * 60})`} opacity={p}>
      <Card x={xs[i]} y={ys[i]} w={440} h={420} fill={hi ? C.hi : C.card} stroke={hi ? C.orange : C.ink} seed={i + 37} />
      <T x={xs[i] + 220} y={ys[i] + 90} size={40} anchor="middle" color={hi ? C.orange : C.ink}>{st.l}</T>
      <T x={xs[i] + 220} y={ys[i] + 280} size={130} heavy anchor="middle" color={hi ? C.orange : C.ink}>{`${n}${st.s}`}</T></g>; })}</Stage>;
};
