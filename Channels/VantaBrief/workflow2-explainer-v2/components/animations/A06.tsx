import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A06.json';
export const DURATION = meta.duration;
export const A06: React.FC<{oldText?: string; newText?: string}> = ({oldText = 'Benchmark score', newText = 'Real-world result'}) => {
  const f = useCurrentFrame(); const w = textWidth(oldText, 96);
  const sk = prog(f, 6, 22, EASE.inOut), fade = prog(f, 22, 34), np = prog(f, 28, 46, EASE.back), no = prog(f, 28, 38);
  return <Stage>
    <T x={960} y={470 - fade * 40} size={96} anchor="middle" opacity={1 - fade * 0.6}>{oldText}</T>
    <Pen d={roughLine([[960 - w / 2 - 20, 470 - 34 - fade * 40], [960 + w / 2 + 20, 470 - 56 - fade * 40]], 6)} p={sk} w={8} />
    <T x={960} y={650 + (1 - np) * 60} size={110} anchor="middle" color={C.orange} opacity={no}>{newText}</T>
  </Stage>;
};
