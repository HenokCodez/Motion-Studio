import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A03.json';
export const DURATION = meta.duration;
export const A03: React.FC<{label?: string; icon?: string}> = ({label = 'Heavy-Duty Tasks', icon = 'chip'}) => {
  const f = useCurrentFrame();
  const pts: [number, number][] = []; for (let i = 0; i < 10; i++) { const y = 392 + i * 34; pts.push(i % 2 ? [1286, y] : [634, y], i % 2 ? [634, y + 17] : [1286, y + 17]); }
  const sp = prog(f, 0, 30, EASE.inOut), op = prog(f, 24, 44), fp = prog(f, 26, 38), cp = prog(f, 44, 60, EASE.back);
  return <Stage>
    <Pen d={roughLine(pts, 7)} p={sp} color={C.hi} w={40} />
    <Card x={610} y={360} w={700} h={360} p={op} fillP={fp} fill={C.hi} stroke={C.orange} seed={11} />
    <g opacity={cp} transform={`translate(0 ${(1 - cp) * 20})`}>
      <Icon name={icon} x={960} y={480} size={150} p={1} color={C.orange} />
      <T x={960} y={660} size={56} anchor="middle">{label}</T>
    </g>
  </Stage>;
};
