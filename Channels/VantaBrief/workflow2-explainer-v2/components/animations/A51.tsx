import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A51.json';
export const DURATION = meta.duration;
export const A51: React.FC<{from?: string; to?: string}> = ({from = 'Before', to = 'After'}) => {
  const f = useCurrentFrame(); const e = prog(f, 14, 34, EASE.inOut), ml = prog(f, 12, 24), mf = 1 - prog(f, 26, 36);
  return <Stage>
    {[0, 1, 2, 3, 4, 5].map(i => <Pen key={i} d={roughLine([[220 + (i % 2) * 120, 400 + i * 55], [1700 - (i % 3) * 100, 400 + i * 55]], i + 1)} p={ml} w={4} opacity={mf * 0.8} />)}
    <T x={960 - e * 2300} y={590} size={120} heavy anchor="middle" opacity={Math.max(0, 1 - e * 1.2)}>{from}</T>
    <T x={960 + (1 - e) * 2300} y={590} size={120} heavy anchor="middle" color={C.orange} opacity={Math.min(1, e * 1.2)}>{to}</T>
  </Stage>;
};
