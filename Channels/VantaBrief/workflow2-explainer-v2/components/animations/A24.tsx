import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A24.json';
export const DURATION = meta.duration;
export const A24: React.FC<{root?: string; children?: string[]; highlight?: number}> = ({root = 'Three-step strategy', children = ['Search', 'Compare', 'Decide'], highlight = 2}) => {
  const f = useCurrentFrame(); const cx = [400, 960, 1520];
  return <Stage>
    <Card x={700} y={150} w={520} h={120} p={prog(f, 0, 16, EASE.inOut)} seed={120} /><T x={960} y={225} size={44} anchor="middle" opacity={prog(f, 8, 20)}>{root}</T>
    <Pen d={roughLine([[960, 270], [960, 430]], 2)} p={prog(f, 14, 26)} w={4} />
    <Pen d={roughLine([[cx[0], 600], [cx[0], 430], [cx[2], 430], [cx[2], 600]], 3)} p={prog(f, 24, 40, EASE.inOut)} w={4} />
    <Pen d={roughLine([[960, 430], [960, 600]], 4)} p={prog(f, 30, 40)} w={4} />
    {children.map((c, i) => { const p = prog(f, 38 + i * 6, 52 + i * 6, EASE.out), hi = i === highlight;
      return <g key={i}><Card x={cx[i] - 200} y={600} w={400} h={150} p={p} fillP={p} fill={hi ? C.hi : C.card} stroke={hi ? C.orange : C.ink} seed={i + 130} />
        <T x={cx[i]} y={690} size={48} anchor="middle" opacity={p} color={hi ? C.orange : C.ink}>{c}</T></g>; })}
  </Stage>;
};
