import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A02.json';
export const DURATION = meta.duration;
export const A02: React.FC<{before?: string; keyword?: string}> = ({before = 'Benchmarks hide', keyword = 'real failures'}) => {
  const f = useCurrentFrame(); const S = 88, y = 560;
  const bw = textWidth(before + ' ', S), kw = textWidth(keyword, S), x0 = 960 - (bw + kw) / 2;
  const e = prog(f, 0, 10), u1 = prog(f, 14, 30), u2 = prog(f, 30, 42), kc = prog(f, 14, 20);
  const kx = x0 + bw;
  return <Stage>
    <T x={x0} y={y + (1 - e) * 20} size={S} opacity={e}>{before}</T>
    <T x={kx} y={y + (1 - e) * 20} size={S} opacity={e} color={kc > 0.5 ? C.orange : C.ink}>{keyword}</T>
    <Pen d={roughLine([[kx - 8, y + 24], [kx + kw + 12, y + 18]], 4)} p={u1} color={C.orange} w={10} />
    <Pen d={roughLine([[kx + 20, y + 46], [kx + kw * 0.85, y + 42]], 9)} p={u2} color={C.orange} w={4} />
  </Stage>;
};
