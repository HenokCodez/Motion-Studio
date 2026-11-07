import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A49.json';
export const DURATION = meta.duration;
export const A49: React.FC<{captions?: string[]; photos?: string[]}> = ({captions = ['2024', '2025', '2026'], photos = []}) => {
  const f = useCurrentFrame(); const P = [[700, 560, -10], [960, 540, 0], [1220, 560, 8]];
  return <Stage>{P.map(([x, y, r], i) => { const s = spring({frame: f - i * 10, fps: 30, config: SPR.settle}), hi = i === 2;
    return <g key={i} transform={`translate(${x} ${y - (1 - Math.min(s, 1)) * 500}) rotate(${r})`} opacity={Math.min(1, s * 3)}>
      <Card x={-150} y={-180} w={300} h={360} stroke={hi ? C.orange : C.ink} seed={i + 51} /><PhotoSlot x={-130} y={-160} w={260} h={240} src={photos[i]} />
      <T x={0} y={150} size={32} anchor="middle" color={hi ? C.orange : C.ink}>{captions[i]}</T></g>; })}</Stage>;
};
