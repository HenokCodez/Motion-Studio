import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A45.json';
export const DURATION = meta.duration;
export const A45: React.FC<{count?: number; label?: string}> = ({count = 18, label = '130+ testers'}) => {
  const f = useCurrentFrame(); const n = Math.min(18, count);
  return <Stage>{Array.from({length: n}, (_, i) => { const c = i % 6, r = Math.floor(i / 6), x = 560 + c * 160, y = 480 + r * 160, s = spring({frame: f - (4 + i * 3), fps: 30, config: SPR.pop}), last = i === n - 1;
    return <g key={i} transform={`translate(${x} ${y}) scale(${Math.max(0, Math.min(s, 1.1))}) translate(${-x} ${-y})`}><Stick x={x} y={y} h={110} w={5} color={last ? C.orange : C.ink} pose={last ? 'wave' : 'stand'} /></g>; })}
    <T x={960} y={935} size={48} anchor="middle" opacity={prog(f, 50, 66)}>{label}</T></Stage>;
};
