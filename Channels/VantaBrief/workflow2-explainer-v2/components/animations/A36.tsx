import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A36.json';
export const DURATION = meta.duration;
export const A36: React.FC<{icons?: string[]; labels?: string[]}> = ({icons = ['search', 'check', 'play', 'star'], labels = ['Search', 'Verify', 'Run', 'Rank']}) => {
  const f = useCurrentFrame(); const cx = [622, 847, 1072, 1297]; const pill = 'M580 470 L1340 470 A70 70 0 0 1 1340 610 L580 610 A70 70 0 0 1 580 470 Z';
  const k1 = prog(f, 38, 50, EASE.inOut), k2 = prog(f, 58, 74, EASE.inOut); const pos = f < 38 ? cx[0] : f < 58 ? cx[0] + (cx[1] - cx[0]) * k1 : cx[1] + (cx[3] - cx[1]) * k2; const idx = f < 44 ? 0 : f < 66 ? 1 : 3;
  return <Stage>
    <path d={pill} fill={C.card} opacity={prog(f, 0, 14)} /><Pen d={roughPath(pill, 36)} p={prog(f, 0, 14, EASE.inOut)} w={5} />
    <g opacity={prog(f, 16, 26)}><rect x={pos - 95} y={485} width={190} height={110} rx={55} fill={C.hi} stroke={C.orange} strokeWidth={4} /></g>
    {icons.map((ic, i) => <Icon key={i} name={ic} x={cx[i]} y={540} size={64} p={prog(f, 8 + i * 4, 22 + i * 4)} color={i === idx && f > 20 ? C.orange : C.ink} w={5} />)}
    <T x={960} y={730} size={48} anchor="middle" opacity={prog(f, 20, 30)} color={C.orange}>{labels[idx]}</T>
  </Stage>;
};
