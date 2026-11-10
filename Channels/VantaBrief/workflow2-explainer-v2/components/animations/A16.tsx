import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A16.json';
export const DURATION = meta.duration;
export const A16: React.FC<{steps?: string[]}> = ({steps = ['Test', 'Tune', 'Ship', 'Scale']}) => {
  const f = useCurrentFrame(); const tops = [780, 660, 540, 420]; const cxs = [510, 810, 1110, 1410];
  const hop = (k: number) => prog(f, 54 + k * 8, 62 + k * 8, EASE.inOut);
  let px = cxs[0], py = tops[0] - 30; for (let k = 0; k < 3; k++) { const h = hop(k); if (h > 0) { px = cxs[k] + (cxs[k + 1] - cxs[k]) * h; py = (tops[k] - 30) + ((tops[k + 1] - 30) - (tops[k] - 30)) * h - 80 * Math.sin(Math.PI * h); } }
  return <Stage>
    {steps.map((s, i) => { const p = prog(f, 10 + i * 12, 24 + i * 12), hi = i === 3, h = 900 - tops[i];
      return <g key={i}><Card x={360 + i * 300} y={tops[i]} w={300} h={h} p={p} fillP={p} fill={hi ? C.hi : C.card} stroke={hi ? C.orange : C.ink} seed={i + 20} />
        <T x={510 + i * 300} y={tops[i] + 70} size={40} anchor="middle" opacity={p} color={hi ? C.orange : C.ink}>{s}</T></g>; })}
    <circle cx={px} cy={py} r={22} fill={C.orange} opacity={prog(f, 40, 46)} />
  </Stage>;
};
