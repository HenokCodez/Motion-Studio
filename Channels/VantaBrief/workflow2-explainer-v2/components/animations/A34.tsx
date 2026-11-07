import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A34.json';
export const DURATION = meta.duration;
export const A34: React.FC<{icons?: string[]; labels?: string[]; target?: number}> = ({icons = ['search', 'play', 'bolt', 'chip'], labels = ['Search', 'Run', 'Boost', 'Compute'], target = 2}) => {
  const f = useCurrentFrame(); const xs = [300, 660, 1020, 1380]; const hop = prog(f, 46, 58, EASE.inOut); const fx = xs[1] + (xs[target] - xs[1]) * hop; const fo = prog(f, 28, 36);
  return <Stage>
    {icons.map((ic, i) => { const p = prog(f, i * 5, i * 5 + 16, EASE.out), o = Math.max(0, 1 - Math.abs(fx - xs[i]) / 150) * fo;
      return <g key={i}><Card x={xs[i]} y={380} w={280} h={280} p={p} seed={i + 34} />
        <rect x={xs[i]} y={380} width={280} height={280} rx={14} fill={C.hi} opacity={o} />
        <Icon name={ic} x={xs[i] + 140} y={500} size={120} p={p} color={o > 0.5 ? C.orange : C.ink} />
        <T x={xs[i] + 140} y={735} size={36} anchor="middle" opacity={p} color={o > 0.5 ? C.orange : C.ink}>{labels[i]}</T></g>; })}
    <Pen d={roughRect(fx - 12, 368, 304, 304, 9)} p={fo} color={C.orange} w={5} />
  </Stage>;
};
