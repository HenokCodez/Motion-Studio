import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A10.json';
export const DURATION = meta.duration;
export const A10: React.FC<{left?: string; right?: string}> = ({left = 'Paper metrics', right = 'Real workloads'}) => {
  const f = useCurrentFrame(); const s = spring({frame: Math.max(0, f - 20), fps: 30, config: SPR.wobble}); const ang = 7 * (f < 20 ? 0 : s);
  const bp = prog(f, 0, 14, EASE.inOut), cp = prog(f, 6, 24);
  const pan = (sgn: number, label: string, hi: boolean) => <g transform={`translate(${sgn * 520} 0) rotate(${-ang})`}>
    <Pen d={roughLine([[0, 0], [0, 90]], 5)} p={cp} w={3} />
    <Card x={-150} y={90} w={300} h={130} p={cp} fillP={cp} fill={hi ? C.hi : C.card} stroke={hi ? C.orange : C.blue} seed={sgn + 50} />
    <T x={0} y={170} size={40} anchor="middle" opacity={cp}>{label}</T></g>;
  return <Stage>
    <Pen d={'M960 575 L890 880 L1030 880 Z'} p={bp} w={4} />
    <Pen d={roughLine([[820, 884], [1100, 884]], 3)} p={bp} w={4} />
    <g transform={`translate(960 560) rotate(${ang})`}>
      <Pen d={roughLine([[-520, 0], [520, 0]], 8)} p={bp} w={6} />
      {pan(-1, left, false)}{pan(1, right, true)}
    </g>
    <circle cx={960} cy={560} r={16} fill={C.card} stroke={C.ink} strokeWidth={4} opacity={bp} />
  </Stage>;
};
