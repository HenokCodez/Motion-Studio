import React from 'react';
import {spring, staticFile} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, C, EASE, SPR, prog, roughLine, roughEllipse} from '../primitives';
import meta from './meta/A27.json';
export const DURATION = meta.duration;
export const A27: React.FC<{src?: string; name?: string}> = ({src = 'brand/vanta-brief-logo.png', name = 'Vanta Brief'}) => {
  const f = useCurrentFrame(); const s = spring({frame: f - 4, fps: 30, config: SPR.pop}); const sc = f < 4 ? 0 : 1 + (1 - Math.min(s, 1)) * 0.6;
  return <Stage>
    {Array.from({length: 10}, (_, i) => { const t = (i / 10) * Math.PI * 2 + 0.2; return <Pen key={i} d={roughLine([[960 + Math.cos(t) * 210, 450 + Math.sin(t) * 210], [960 + Math.cos(t) * 260, 450 + Math.sin(t) * 260]], i + 1)} p={prog(f, 10, 20)} w={5} color={C.blue} opacity={1 - prog(f, 22, 34)} />; })}
    <g transform={`translate(960 450) scale(${sc}) translate(-960 -450)`}><image href={staticFile(src)} x={800} y={290} width={320} height={320} /></g>
    <T x={960} y={730} size={72} heavy anchor="middle" opacity={prog(f, 18, 30)}>{name}</T>
  </Stage>;
};
