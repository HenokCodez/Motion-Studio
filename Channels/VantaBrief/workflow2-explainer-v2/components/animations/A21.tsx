import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A21.json';
export const DURATION = meta.duration;
export const A21: React.FC<{hub?: string; spokes?: string[]}> = ({hub = 'DeepSeek', spokes = ['Open weights', 'Low cost', 'Long context', 'Agents']}) => {
  const f = useCurrentFrame(); const sat = [[190, 190], [1430, 190], [190, 790], [1430, 790]]; const from = [[790, 475], [1130, 475], [790, 605], [1130, 605]]; const to = [[490, 290], [1430, 290], [490, 790], [1430, 790]];
  return <Stage>
    {spokes.map((s, k) => <g key={k}>
      <Pen d={roughLine([from[k] as [number, number], to[k] as [number, number]], k + 70)} p={prog(f, 18 + k * 8, 32 + k * 8, EASE.inOut)} w={4} />
      <Card x={sat[k][0]} y={sat[k][1]} w={300} h={100} p={prog(f, 28 + k * 8, 42 + k * 8)} seed={k + 80} />
      <T x={sat[k][0] + 150} y={sat[k][1] + 64} size={36} anchor="middle" opacity={prog(f, 36 + k * 8, 46 + k * 8)}>{s}</T></g>)}
    <Card x={790} y={475} w={340} h={130} p={prog(f, 0, 16, EASE.inOut)} fillP={prog(f, 8, 18)} fill={C.hi} stroke={C.orange} seed={90} />
    <T x={960} y={555} size={48} anchor="middle" color={C.orange} opacity={prog(f, 10, 22)}>{hub}</T>
  </Stage>;
};
