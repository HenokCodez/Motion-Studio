import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A35.json';
export const DURATION = meta.duration;
export const A35: React.FC<{banner?: string; photos?: string[]; highlight?: number}> = ({banner = 'PART 3', photos = [], highlight = 2}) => {
  const f = useCurrentFrame(); const pos = [[600, 150], [860, 150], [1120, 150], [730, 580], [990, 580]];
  return <Stage>
    {pos.map(([x, y], i) => { const s = spring({frame: f - (4 + i * 8), fps: 30, config: SPR.pop}), hi = i === highlight && f > 60, sc = Math.max(0, Math.min(s, 1.06));
      return <g key={i} opacity={Math.min(1, s * 2)} transform={`translate(${x + 100} ${y + 135}) scale(${sc}) translate(${-x - 100} ${-y - 135})`}>
        <Card x={x} y={y} w={200} h={270} fill={hi ? C.hi : C.card} stroke={hi ? C.orange : C.ink} seed={i + 35} />
        <PhotoSlot x={x + 12} y={y + 12} w={176} h={170} src={photos[i]} />
        <T x={x + 100} y={y + 250} size={64} heavy anchor="middle" color={hi ? C.orange : C.ink}>{String(i + 1)}</T></g>; })}
    <T x={960} y={525} size={44} anchor="middle" opacity={prog(f, 36, 48)}>{'▸ ' + banner + ' ◂'}</T>
  </Stage>;
};
