import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A48.json';
export const DURATION = meta.duration;
export const A48: React.FC<{src?: string; caption?: string; note?: string}> = ({src, caption = 'DeepSeek V4', note = 'Release day'}) => {
  const f = useCurrentFrame(); const s = spring({frame: f, fps: 30, config: SPR.pop}), tp = prog(f, 14, 24, EASE.back);
  return <Stage>
    <g transform={`translate(860 520) rotate(-4) scale(${Math.min(s, 1.06)})`}>
      <Card x={-260} y={-230} w={520} h={460} seed={49} /><PhotoSlot x={-230} y={-200} w={460} h={320} src={src} />
      <T x={0} y={190} size={40} anchor="middle" opacity={prog(f, 20, 32)}>{caption}</T>
      <g transform={`translate(-230 -252) rotate(-8) scale(${tp})`}><rect width={150} height={44} fill={C.ink} opacity={0.9} /></g>
      <g transform={`translate(90 -252) rotate(6) scale(${tp})`}><rect width={150} height={44} fill={C.ink} opacity={0.9} /></g></g>
    <Arrow x1={1290} y1={440} x2={1150} y2={500} p={prog(f, 40, 54)} color={C.orange} w={6} seed={5} />
    <T x={1310} y={440} size={44} color={C.orange} p={prog(f, 50, 66, EASE.inOut)} width={400} id="a48">{note}</T>
  </Stage>;
};
