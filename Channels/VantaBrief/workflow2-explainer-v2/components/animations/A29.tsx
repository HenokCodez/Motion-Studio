import React from 'react';
import {useCurrentFrame, spring, staticFile} from 'remotion';
import {Stage, Card, Pen, T, C, EASE, SPR, prog, roughLine, roughEllipse} from '../primitives';
import meta from './meta/A29.json';
export const DURATION = meta.duration;
export const A29: React.FC<{channel?: string}> = ({channel = 'Vanta Brief'}) => {
  const f = useCurrentFrame(); const ls = spring({frame: f - 2, fps: 30, config: SPR.pop}), bs = spring({frame: f - 28, fps: 30, config: SPR.pop}); const press = f >= 56 && f < 64 ? 0.94 : 1; const done = f >= 60;
  return <Stage>
    <g transform={`translate(480 540) scale(${f < 2 ? 0 : Math.min(ls, 1.1)}) translate(-480 -540)`}><image href={staticFile('brand/vanta-brief-logo.png')} x={330} y={390} width={300} height={300} /></g>
    <T x={700} y={520} size={88} heavy p={prog(f, 12, 34, EASE.inOut)} width={620} id="a29">{channel}</T>
    <g opacity={Math.min(1, bs * 2)} transform={`translate(910 635) scale(${(f < 28 ? 0 : Math.min(bs, 1.08)) * press}) translate(-910 -635)`}>
      <Card x={700} y={580} w={420} h={110} fill={done ? C.card : C.blue} stroke={C.ink} seed={160} />
      <T x={910} y={650} size={52} anchor="middle">{done ? 'Subscribed' : 'Subscribe'}</T></g>
  </Stage>;
};
