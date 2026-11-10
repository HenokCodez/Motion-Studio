import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A43.json';
export const DURATION = meta.duration;
export const A43: React.FC<{text?: string}> = ({text = 'Agentic Workflows'}) => {
  const f = useCurrentFrame(); const mv = prog(f, 0, 40, EASE.inOut), walking = f < 40;
  return <Stage>
    <Stick x={250 + 370 * mv} y={900} h={380} pose={f >= 40 ? 'point' : 'stand'} p={prog(f, 0, 10)} walk={walking ? Math.sin(f * 0.8) : 0} />
    <Card x={900} y={380} w={640} h={260} p={prog(f, 44, 60)} fill={C.hi} stroke={C.orange} seed={43} />
    <T x={940} y={525} size={56} color={C.orange} p={prog(f, 56, 76, EASE.inOut)} width={560} id="a43">{text}</T>
  </Stage>;
};
