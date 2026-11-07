import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A17.json';
export const DURATION = meta.duration;
export const A17: React.FC<{items?: {label: string; year: string}[]}> = ({items = [{label: 'Linux', year: '1990s'}, {label: 'Blender', year: '2000s'}, {label: 'Open AI', year: '2026'}]}) => {
  const f = useCurrentFrame(); const xs = [420, 960, 1500], ts = [34, 52, 70]; const mx = 250 + prog(f, 30, 70, EASE.inOut) * 1250;
  return <Stage>
    <Pen d={roughLine([[250, 600], [1670, 600]], 3)} p={prog(f, 0, 20, EASE.inOut)} w={5} />
    {items.map((it, i) => { const s = spring({frame: f - ts[i], fps: 30, config: SPR.pop}), hi = i === 2;
      return <g key={i} opacity={Math.min(1, s * 2)} transform={`translate(${xs[i]} 500) scale(${Math.max(0, s)}) translate(${-xs[i]} -500)`}>
        <Card x={xs[i] - 140} y={450} w={280} h={84} fill={hi ? C.hi : C.card} stroke={hi ? C.orange : C.ink} seed={i + 30} />
        <T x={xs[i]} y={508} size={40} anchor="middle" color={hi ? C.orange : C.ink}>{it.label}</T>
        <circle cx={xs[i]} cy={600} r={14} fill={C.card} stroke={C.ink} strokeWidth={4} />
        <T x={xs[i]} y={690} size={36} anchor="middle">{it.year}</T></g>; })}
    <circle cx={mx} cy={600} r={18} fill={C.orange} opacity={prog(f, 26, 32)} />
  </Stage>;
};
