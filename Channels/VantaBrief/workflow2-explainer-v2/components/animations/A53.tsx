import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A53.json';
export const DURATION = meta.duration;
export const A53: React.FC<{front?: string; back?: string}> = ({front = 'Page 1', back = 'Page 2'}) => {
  const f = useCurrentFrame(); const sx = f < 12 ? 1 : f < 30 ? 1 - prog(f, 12, 30, EASE.inOut) : prog(f, 30, 48, EASE.back), face2 = f >= 30, lift = Math.sin(Math.PI * prog(f, 12, 48)) * -24;
  return <Stage><g transform={`translate(960 ${540 + lift}) scale(${Math.max(sx, 0.001)} 1)`}>
    <Card x={-350} y={-210} w={700} h={420} p={prog(f, 0, 12)} fill={face2 ? C.hi : C.card} stroke={face2 ? C.orange : C.ink} seed={face2 ? 54 : 53} />
    <T x={0} y={25} size={96} heavy={false} anchor="middle" color={face2 ? C.orange : C.ink} opacity={prog(f, 6, 14)}>{face2 ? back : front}</T></g></Stage>;
};
