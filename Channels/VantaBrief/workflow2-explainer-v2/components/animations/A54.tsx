import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A54.json';
export const DURATION = meta.duration;
export const A54: React.FC<{portal?: string; title?: string}> = ({portal = 'Inside', title = 'Inside the model'}) => {
  const f = useCurrentFrame(); const z = 1 + 22 * Math.pow(prog(f, 10, 42, EASE.lin), 3), go = 1 - prog(f, 36, 44), np = prog(f, 40, 56, EASE.out);
  return <Stage>
    <g opacity={go} transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
      <Pen d={roughEllipse(960, 540, 260, 260, 4)} p={prog(f, 0, 12, EASE.inOut)} w={8 / Math.max(1, z * 0.6)} />
      <T x={960} y={560} size={56} anchor="middle" opacity={prog(f, 6, 14)}>{portal}</T></g>
    <g transform={`translate(960 540) scale(${0.8 + 0.2 * np}) translate(-960 -540)`}><T x={960} y={570} size={100} heavy anchor="middle" opacity={np} color={C.orange}>{title}</T></g>
  </Stage>;
};
