import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A18.json';
export const DURATION = meta.duration;
export const A18: React.FC<{gate?: string}> = ({gate = 'Agent'}) => {
  const f = useCurrentFrame(); const xf = [1590, 1390, 1190];
  return <Stage>
    <Card x={200} y={620} w={1520} h={50} p={prog(f, 0, 14, EASE.inOut)} seed={5} />
    {xf.map((fx, i) => { const e = prog(f, 10 + i * 14, 64 + i * 14, EASE.inOut), x = 170 + (fx - 170) * e, o = x + 75 > 960;
      return <g key={i} opacity={prog(f, 6 + i * 14, 12 + i * 14)}><Card x={x} y={510} w={150} h={110} fill={o ? C.hi : C.card} stroke={o ? C.orange : C.ink} seed={i + 40} /></g>; })}
    <Card x={840} y={400} w={240} h={230} p={prog(f, 0, 16, EASE.inOut)} fill={C.hi} stroke={C.orange} seed={8} />
    <T x={960} y={475} size={40} anchor="middle" color={C.orange} opacity={prog(f, 12, 22)}>{gate}</T>
  </Stage>;
};
