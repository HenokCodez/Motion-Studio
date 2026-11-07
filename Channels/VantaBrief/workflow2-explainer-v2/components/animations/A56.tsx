import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A56.json';
export const DURATION = meta.duration;
export const A56: React.FC<{left?: string; right?: string; leftFile?: string; rightFile?: string}> = ({left = 'ChatGPT', right = 'DeepSeek', leftFile = 'chatgpt.svg', rightFile = 'deepseek.svg'}) => {
  const f = useCurrentFrame(); const e = prog(f, 0, 20, EASE.out), vs = spring({frame: f - 22, fps: 30, config: SPR.pop}), w = prog(f, 50, 62, EASE.inOut);
  return <Stage>
    <g opacity={1 - 0.55 * w} transform={`translate(${-(1 - e) * 700} 0)`}><Card x={380} y={330} w={300} h={300} seed={56} /><LogoBadge cx={530} cy={470} r={90} file={leftFile} initial={left[0]} round={false} /><T x={530} y={700} size={40} anchor="middle">{left}</T></g>
    <g transform={`translate(${(1 - e) * 700} 0) translate(1390 480) scale(${1 + 0.06 * w}) translate(-1390 -480)`}><Card x={1240} y={330} w={300} h={300} fill={w > 0.5 ? C.hi : C.card} stroke={w > 0.5 ? C.orange : C.ink} seed={57} /><LogoBadge cx={1390} cy={470} r={90} file={rightFile} initial={right[0]} round={false} /><T x={1390} y={700} size={40} anchor="middle" color={w > 0.5 ? C.orange : C.ink}>{right}</T></g>
    <g transform={`translate(960 520) scale(${f < 22 ? 0 : Math.min(vs, 1.1)}) translate(-960 -520)`}><T x={960} y={550} size={96} heavy anchor="middle" color={C.orange}>VS</T></g>
  </Stage>;
};
