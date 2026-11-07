import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A12.json';
export const DURATION = meta.duration;
export const A12: React.FC<{left?: string; right?: string}> = ({left = 'Paper metrics', right = 'Real usage'}) => {
  const f = useCurrentFrame(); const rp = prog(f, 0, 12), tug = f >= 14 && f < 64, amp = tug ? Math.min(1, (f - 14) / 8) : 0;
  const shake = Math.sin(f * 1.6) * 6 * amp, win = prog(f, 64, 86);
  const kx = f < 64 ? 960 + (tug ? Math.sin(f * 0.55) * 45 * amp : 0) : 960 + 220 * win + Math.sin(64 * 0.55) * 45 * (1 - win);
  const lx = 170 + (tug ? -shake : 0), rx = 1450 + (tug ? shake : 0), sag = f < 14 ? (1 - prog(f, 6, 14)) * 30 : 0;
  return <Stage>
    <Pen d={roughLine([[lx + 300, 540], [(lx + 300 + kx) / 2, 540 + sag], [kx, 540]], 12)} p={rp} w={6} />
    <Pen d={roughLine([[kx, 540], [(kx + rx) / 2, 540 + sag], [rx, 540]], 13)} p={rp} w={6} />
    <g opacity={1 - win * 0.4} transform={`rotate(${-3 * win} ${lx + 150} 540)`}><Card x={lx} y={470} w={300} h={140} p={rp} seed={61} /><T x={lx + 150} y={550} size={40} anchor="middle" opacity={rp}>{left}</T></g>
    <Card x={rx} y={470} w={300} h={140} p={rp} fill={C.hi} stroke={C.orange} seed={62} /><T x={rx + 150} y={550} size={40} anchor="middle" opacity={rp}>{right}</T>
    <circle cx={kx} cy={540} r={24} fill={C.orange} opacity={rp} />
  </Stage>;
};
