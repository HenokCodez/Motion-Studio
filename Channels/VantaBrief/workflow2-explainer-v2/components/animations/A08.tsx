import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A08.json';
export const DURATION = meta.duration;
export const A08: React.FC<{top?: string; big?: string; bottom?: string}> = ({top = 'It is not about', big = 'SPEED', bottom = 'it is about reliability'}) => {
  const f = useCurrentFrame(); const a = prog(f, 0, 14), b = spring({frame: f - 10, fps: 30, config: SPR.pop}), c = prog(f, 18, 32);
  const rays = Array.from({length: 10}, (_, i) => { const t = (i / 10) * Math.PI * 2 + 0.3, k = prog(f, 14, 24), fade = 1 - prog(f, 24, 34);
    return <Pen key={i} d={roughLine([[960 + Math.cos(t) * 500, 540 + Math.sin(t) * 215], [960 + Math.cos(t) * 560, 540 + Math.sin(t) * 245]], i + 1)} p={k} w={4} opacity={fade} />; });
  return <Stage>
    <T x={960 + (1 - a) * -900} y={360} size={56} anchor="middle" opacity={a}>{top}</T>
    <g transform={`translate(960 560) scale(${f < 10 ? 0 : 1 + (1 - Math.min(b, 1)) * 0.7}) translate(-960 -560)`}><T x={960} y={640} size={220} heavy anchor="middle" color={C.orange}>{big}</T></g>
    {rays}
    <T x={960 + (1 - c) * 900} y={790} size={56} anchor="middle" opacity={c}>{bottom}</T>
  </Stage>;
};
