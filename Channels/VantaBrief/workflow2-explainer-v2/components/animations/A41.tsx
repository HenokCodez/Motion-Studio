import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A41.json';
export const DURATION = meta.duration;
export const A41: React.FC<{target?: string}> = ({target = 'This one'}) => {
  const f = useCurrentFrame(); const ap = prog(f, 10, 28, EASE.out), b = f >= 30 ? Math.sin((f - 30) * 0.55) * 16 * Math.max(0, 1 - (f - 30) / 40) : 0, ux = 310 / 369, uy = -200 / 369;
  return <Stage>
    <Card x={770} y={480} w={420} h={120} p={prog(f, 0, 14, EASE.inOut)} seed={41} /><T x={980} y={560} size={48} anchor="middle" opacity={prog(f, 8, 18)}>{target}</T>
    <g transform={`translate(${ux * b} ${uy * b})`}><Arrow x1={420} y1={820} x2={730} y2={620} p={ap} color={C.orange} w={8} seed={4} /></g>
  </Stage>;
};
