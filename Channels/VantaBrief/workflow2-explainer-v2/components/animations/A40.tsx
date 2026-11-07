import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A40.json';
export const DURATION = meta.duration;
export const A40: React.FC<{label?: string}> = ({label = 'NEW'}) => {
  const f = useCurrentFrame(); const s = spring({frame: f - 4, fps: 30, config: SPR.pop}), k = prog(f, 10, 22), fd = 1 - prog(f, 24, 36);
  return <Stage>
    {Array.from({length: 12}, (_, i) => { const t = (i / 12) * Math.PI * 2; return <Pen key={i} d={roughLine([[960 + Math.cos(t) * 175, 540 + Math.sin(t) * 175], [960 + Math.cos(t) * 215, 540 + Math.sin(t) * 215]], i + 2)} p={k} color={C.orange} w={6} opacity={fd} />; })}
    <g transform={`translate(960 540) scale(${f < 4 ? 0 : Math.min(s, 1.15)}) translate(-960 -540)`}><circle cx={960} cy={540} r={150} fill={C.hi} stroke={C.orange} strokeWidth={6} /><T x={960} y={580} size={120} heavy anchor="middle" color={C.orange}>{label}</T></g>
  </Stage>;
};
