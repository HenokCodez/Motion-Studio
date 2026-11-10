import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A25.json';
export const DURATION = meta.duration;
export const A25: React.FC<{values?: number[]; labels?: string[]}> = ({values = [35, 55, 70, 100], labels = ['Model A', 'Model B', 'Model C', 'Ours']}) => {
  const f = useCurrentFrame();
  return <Stage>
    <Pen d={roughLine([[360, 260], [360, 860], [1560, 860]], 2)} p={prog(f, 0, 18, EASE.inOut)} w={5} />
    {values.map((v, i) => { const g = prog(f, 20 + i * 8, 44 + i * 8, EASE.out), h = v * 5.2 * g, hi = i === values.length - 1, x = 460 + i * 280;
      return <g key={i}>{h > 2 && <Card x={x} y={860 - h} w={160} h={h} fill={hi ? C.hi : C.card} stroke={hi ? C.orange : C.ink} seed={i + 140} />}
        <T x={x + 80} y={860 - h - 20} size={40} anchor="middle" opacity={prog(f, 40 + i * 8, 50 + i * 8)} color={hi ? C.orange : C.ink}>{`${v}`}</T>
        <T x={x + 80} y={925} size={32} anchor="middle" opacity={prog(f, 12 + i * 4, 22 + i * 4)}>{labels[i]}</T></g>; })}
  </Stage>;
};
