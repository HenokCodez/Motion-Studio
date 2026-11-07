import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A44.json';
export const DURATION = meta.duration;
export const A44: React.FC<{nodes?: string[]}> = ({nodes = ['Data', 'Model', 'Result']}) => {
  const f = useCurrentFrame(); const bolt = prog(f, 24, 36) * (1 - prog(f, 46, 54)); const xs = [740, 900, 1060];
  return <Stage>
    <Stick x={400} y={900} h={400} pose="think" p={prog(f, 0, 12)} />
    <Pen d={roughEllipse(640, 520, 32, 32, 2)} p={prog(f, 6, 12)} w={4} /><Pen d={roughEllipse(585, 575, 20, 20, 3)} p={prog(f, 4, 10)} w={4} />
    <Pen d={roughEllipse(900, 330, 560, 300, 7)} p={prog(f, 10, 30, EASE.inOut)} w={5} />
    <g opacity={bolt}><Icon name="bolt" x={900} y={330} size={140} color={C.orange} w={7} /></g>
    {nodes.map((n, i) => <g key={i}><Card x={xs[i] - 50} y={298} w={100} h={64} p={prog(f, 52 + i * 6, 62 + i * 6)} fill={i === 1 ? C.hi : C.card} stroke={i === 1 ? C.orange : C.ink} seed={i + 44} />
      <T x={xs[i]} y={338} size={24} anchor="middle" opacity={prog(f, 58 + i * 6, 66 + i * 6)}>{n}</T>
      {i < 2 && <Arrow x1={xs[i] + 52} y1={330} x2={xs[i + 1] - 52} y2={330} p={prog(f, 60 + i * 6, 72 + i * 6)} w={3} seed={i + 2} />}</g>)}
  </Stage>;
};
