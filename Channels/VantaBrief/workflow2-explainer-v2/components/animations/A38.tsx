import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A38.json';
export const DURATION = meta.duration;
export const A38: React.FC<{before?: string; word?: string; after?: string}> = ({before = 'Look at', word = 'this number', after = 'closely'}) => {
  const f = useCurrentFrame(); const S = 88, y = 560, bw = textWidth(before + ' ', S), ww = textWidth(word, S), aw = textWidth(' ' + after, S), x0 = 960 - (bw + ww + aw) / 2, cx = x0 + bw + ww / 2, e = prog(f, 0, 10);
  return <Stage>
    <T x={x0} y={y + (1 - e) * 20} size={S} opacity={e}>{before}</T>
    <T x={x0 + bw} y={y + (1 - e) * 20} size={S} opacity={e} color={prog(f, 14, 20) > 0.5 ? C.orange : C.ink}>{word}</T>
    <T x={x0 + bw + ww} y={y + (1 - e) * 20} size={S} opacity={e}>{' ' + after}</T>
    <Pen d={roughEllipse(cx, y - 32, ww + 80, 150, 3)} p={prog(f, 14, 32, EASE.out)} color={C.orange} w={7} />
    <Pen d={roughEllipse(cx + 4, y - 30, ww + 56, 134, 8)} p={prog(f, 30, 42)} color={C.orange} w={4} />
  </Stage>;
};
