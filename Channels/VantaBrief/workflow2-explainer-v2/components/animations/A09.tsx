import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A09.json';
export const DURATION = meta.duration;
type Side = {title: string; bullets: string[]};
export const A09: React.FC<{left?: Side; right?: Side}> = ({left = {title: 'Standard Webchat', bullets: ['Casual Q&A', 'Single-turn queries']}, right = {title: 'Agentic Workflows', bullets: ['Long-horizon tasks', 'Tool orchestration']}}) => {
  const f = useCurrentFrame(); const l = prog(f, 0, 20), r = prog(f, 4, 24), hp = prog(f, 26, 38), vs = spring({frame: f - 22, fps: 30, config: SPR.pop});
  const box = (s: Side, x: number, k: number, hi: boolean, seed: number) => <g transform={`translate(${(hi ? 1 : -1) * (1 - k) * 700} 0)`}>
    <Card x={x} y={330} w={770} h={420} seed={seed} />
    {hi && <><rect x={x} y={330} width={770} height={420} rx={14} fill={C.hi} opacity={hp} /><Pen d={roughRect(x, 330, 770, 420, seed)} p={hp} color={C.orange} w={5} /></>}
    <T x={x + 40} y={420} size={56} color={hi ? C.orange : C.ink} p={prog(f, 28, 44, EASE.inOut)} width={700} id={'a9t' + seed}>{s.title}</T>
    {s.bullets.map((b, i) => <T key={i} x={x + 40} y={520 + i * 80} size={40} p={prog(f, 40 + i * 10, 54 + i * 10, EASE.inOut)} width={700} id={'a9b' + seed + i}>{'• ' + b}</T>)}
  </g>;
  return <Stage>{box(left, 160, l, false, 31)}{box(right, 990, r, true, 32)}
    <T x={960} y={552} size={32} anchor="middle" opacity={Math.min(1, vs)}>vs</T></Stage>;
};
