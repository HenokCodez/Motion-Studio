import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A04.json';
export const DURATION = meta.duration;
export const A04: React.FC<{title?: string; lines?: string[]}> = ({title = 'Benchmarks vs reality', lines = ['Tests are curated', 'Production is messy']}) => {
  const f = useCurrentFrame(); const s = spring({frame: f, fps: 30, config: SPR.settle});
  const dy = (1 - s) * -800, rot = -3 + (1 - s) * -12, tp = prog(f, 14, 24, EASE.back);
  return <Stage>
    <g transform={`translate(960 ${540 + dy}) rotate(${rot})`}>
      <Card x={-320} y={-190} w={640} h={380} seed={21} />
      <g transform={`translate(-300 -212) rotate(-8) scale(${tp})`}><rect width={150} height={44} fill={C.ink} opacity={0.9} /></g>
      <g transform={`translate(150 -212) rotate(6) scale(${tp})`}><rect width={150} height={44} fill={C.ink} opacity={0.9} /></g>
      <T x={-270} y={-80} size={56} p={prog(f, 24, 40, EASE.inOut)} width={560} id="a04a">{title}</T>
      {lines.map((l, i) => <T key={i} x={-270} y={20 + i * 70} size={40} p={prog(f, 38 + i * 10, 52 + i * 10, EASE.inOut)} width={560} id={'a04' + i}>{'• ' + l}</T>)}
    </g>
  </Stage>;
};
