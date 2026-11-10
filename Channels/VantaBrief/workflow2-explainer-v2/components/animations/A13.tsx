import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A13.json';
export const DURATION = meta.duration;
export const A13: React.FC<{items?: string[]}> = ({items = ['Official test runs', 'Real case studies', 'Heavy-duty tasks']}) => {
  const f = useCurrentFrame(); const n = items.length, y0 = 540 - (n - 1) * 55 + 18;
  return <Stage>{items.map((t, i) => { const s = 8 + i * 20, y = y0 + i * 110;
    return <g key={i}>
      <Pen d={roughRect(520, y - 52, 64, 64, i + 3)} p={prog(f, s, s + 10, EASE.inOut)} w={4} />
      <T x={620} y={y} size={56} p={prog(f, s + 6, s + 22, EASE.inOut)} width={820} id={'a13' + i}>{t}</T>
      <Pen d={roughLine([[530, y - 24], [548, y - 6], [582, y - 60]], i + 9)} p={prog(f, s + 20, s + 32, EASE.back)} color={C.orange} w={8} />
    </g>; })}</Stage>;
};
