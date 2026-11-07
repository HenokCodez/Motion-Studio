import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A32.json';
export const DURATION = meta.duration;
export const A32: React.FC<{label?: string}> = ({label = 'Signal detected'}) => {
  const f = useCurrentFrame(); const ds = spring({frame: f, fps: 30, config: SPR.pop});
  return <Stage>
    {[0, 1, 2].map(k => { const st = 6 + k * 14; if (f < st) return null; const t = prog(((f - st) % 48) + st, st, st + 48, EASE.out); return <circle key={k} cx={960} cy={500} r={40 + 220 * t} fill="none" stroke={C.orange} strokeWidth={4} opacity={1 - t} />; })}
    <circle cx={960} cy={500} r={30 * Math.min(ds, 1.1)} fill={C.orange} />
    <T x={960} y={830} size={56} anchor="middle" p={prog(f, 24, 42, EASE.inOut)} width={700} id="a32">{label}</T>
  </Stage>;
};
