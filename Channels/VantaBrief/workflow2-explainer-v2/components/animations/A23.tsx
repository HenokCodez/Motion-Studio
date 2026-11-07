import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A23.json';
export const DURATION = meta.duration;
export const A23: React.FC<{stages?: string[]; highlight?: number}> = ({stages = ['Ingest', 'Route', 'Compute', 'Serve'], highlight = 2}) => {
  const f = useCurrentFrame(); const xs = [165, 595, 1025, 1455];
  return <Stage>
    {[0, 1, 2].map(j => { const x = 315 + prog(f, 22 + j * 12, 58 + j * 12, EASE.lin) * 1290, o = 1 - prog(f, 52 + j * 12, 58 + j * 12), a = prog(f, 20 + j * 12, 22 + j * 12);
      return <circle key={j} cx={x} cy={540} r={24} fill={x > 1175 ? C.orange : C.ink} opacity={o * a} />; })}
    {stages.map((s, i) => { const p = prog(f, i * 6, i * 6 + 14, EASE.out), hi = i === highlight;
      return <g key={i}><Card x={xs[i]} y={485} w={300} h={110} p={p} fillP={p} fill={hi ? C.hi : C.card} stroke={hi ? C.orange : C.ink} seed={i + 100} />
        <T x={xs[i] + 150} y={553} size={40} anchor="middle" opacity={p} color={hi ? C.orange : C.ink}>{s}</T>
        {i < 3 && <Arrow x1={xs[i] + 308} y1={540} x2={xs[i + 1] - 8} y2={540} p={prog(f, i * 6 + 10, i * 6 + 22)} seed={i + 5} />}</g>; })}
  </Stage>;
};
