import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A50.json';
export const DURATION = meta.duration;
export const A50: React.FC<{left?: string; right?: string}> = ({left = 'Question', right = 'Answer'}) => {
  const f = useCurrentFrame(); const p1 = prog(f, 20, 30, EASE.inOut), p2 = prog(f, 30, 54, EASE.inOut), p3 = prog(f, 54, 76, EASE.inOut);
  const z = f < 54 ? 1 + 0.2 * p1 : 1.2 - 0.2 * p3; const cx = f < 30 ? 960 + (480 - 960) * p1 : f < 54 ? 480 + 960 * p2 : 1440 - 480 * p3;
  return <Stage><g transform={`translate(960 540) scale(${z}) translate(${-cx} -540)`}>
    <Card x={290} y={470} w={380} h={140} p={prog(f, 0, 14, EASE.inOut)} seed={50} /><T x={480} y={555} size={48} anchor="middle" opacity={prog(f, 6, 16)}>{left}</T>
    <Arrow x1={690} y1={540} x2={1230} y2={540} p={prog(f, 10, 24)} seed={6} />
    <Card x={1250} y={470} w={380} h={140} p={prog(f, 12, 26, EASE.inOut)} fill={C.hi} stroke={C.orange} seed={51} /><T x={1440} y={555} size={48} anchor="middle" color={C.orange} opacity={prog(f, 18, 28)}>{right}</T></g></Stage>;
};
