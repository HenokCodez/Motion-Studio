import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A52.json';
export const DURATION = meta.duration;
export const A52: React.FC<{from?: string; to?: string}> = ({from = 'Chapter 1', to = 'Chapter 2'}) => {
  const f = useCurrentFrame(); const fade = 1 - prog(f, 34, 48);
  return <Stage>
    <T x={960} y={590} size={110} heavy anchor="middle" opacity={1 - prog(f, 22, 30)}>{from}</T>
    {[300, 420, 540, 660, 780].map((y, i) => <Pen key={i} d={roughLine([[170, y], [1750, y + (i % 2 ? 8 : -8)]], i + 4)} p={prog(f, 10 + i * 3, 30 + i * 3, EASE.inOut)} w={90} opacity={fade} />)}
    <T x={960} y={590} size={110} heavy anchor="middle" opacity={prog(f, 40, 52)}>{to}</T>
    <Pen d={roughLine([[620, 640], [1300, 636]], 2)} p={prog(f, 50, 64)} color={C.blue} w={8} />
  </Stage>;
};
