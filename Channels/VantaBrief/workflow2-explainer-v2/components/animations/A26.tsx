import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A26.json';
export const DURATION = meta.duration;
export const A26: React.FC<{values?: number[]; note?: string}> = ({values = [30, 38, 35, 55, 70, 95], note = 'Real-world jump'}) => {
  const f = useCurrentFrame(); const pts = values.map((v, i) => [460 + i * 200, 860 - v * 5.2] as [number, number]); const lp = prog(f, 18, 64, EASE.inOut); const last = pts[pts.length - 1];
  return <Stage>
    <Pen d={roughLine([[360, 260], [360, 860], [1560, 860]], 2)} p={prog(f, 0, 18, EASE.inOut)} w={5} />
    <Pen d={roughLine(pts, 6)} p={lp} w={6} />
    {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill={C.card} stroke={C.ink} strokeWidth={4} opacity={lp >= i / (pts.length - 1) - 0.01 ? 1 : 0} />)}
    <Pen d={roughEllipse(last[0], last[1], 110, 110, 4)} p={prog(f, 66, 78, EASE.out)} color={C.orange} w={6} />
    <Pen d={roughLine([[1400, 310], [last[0] - 35, last[1] - 45]], 8)} p={prog(f, 72, 80)} color={C.orange} w={4} />
    <T x={1230} y={300} size={40} anchor="middle" color={C.orange} p={prog(f, 76, 92, EASE.inOut)} width={420} id="a26">{note}</T>
  </Stage>;
};
