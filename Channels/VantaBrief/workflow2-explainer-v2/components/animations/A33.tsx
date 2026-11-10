import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {plainLine, Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A33.json';
export const DURATION = meta.duration;
export const A33: React.FC<{tabs?: string[]; values?: number[]; title?: string}> = ({tabs = ['24H', '7D', '30D'], values = [71.3, 94.2, 88.0], title = 'Benchmark score'}) => {
  const f = useCurrentFrame(); const A = [20, 30, 28, 40, 38, 50], B = [30, 25, 45, 42, 60, 75]; const m = prog(f, 44, 64, EASE.inOut), cp = prog(f, 0, 14, EASE.inOut), lp = prog(f, 12, 36, EASE.inOut);
  const pts = A.map((a, i) => [560 + i * 160, 740 - (a + (B[i] - a) * m) * 3.6] as [number, number]); const tx = [1100, 1215, 1330], hop = prog(f, 40, 52, EASE.inOut), sx = tx[0] + (tx[1] - tx[0]) * hop;
  return <Stage>
    <Card x={510} y={260} w={900} h={520} p={cp} seed={33} />
    <T x={550} y={335} size={36} opacity={prog(f, 8, 18)}>{title}</T>
    <T x={550} y={440} size={96} heavy opacity={prog(f, 10, 20)}>{(m < 0.5 ? values[0] : values[1]).toFixed(1)}</T>
    {tabs.map((t, i) => <T key={i} x={tx[i]} y={340} size={28} anchor="middle" opacity={prog(f, 8, 18)} color={Math.abs(sx - tx[i]) < 30 ? C.orange : C.ink}>{t}</T>)}
    <Pen d={roughRect(sx - 45, 305, 90, 50, 5)} p={prog(f, 14, 24)} color={C.orange} w={4} />
    <path d={`M${pts[0][0]} 740 L${pts.map(q => q.join(' ')).join(' L')} L${pts[5][0]} 740 Z`} fill={C.hi} opacity={0.5 * lp} />
    <Pen d={plainLine(pts)} p={lp} color={C.orange} w={6} />
  </Stage>;
};
