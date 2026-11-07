import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A39.json';
export const DURATION = meta.duration;
export const A39: React.FC<{text?: string}> = ({text = 'Leaked test set?'}) => {
  const f = useCurrentFrame(); const pp = prog(f, 0, 14, EASE.back), dec = Math.max(0, 1 - (f - 14) / 30), dx = f >= 14 && f < 44 ? Math.sin(f * 2.2) * 14 * dec : 0, sk = prog(f, 14, 26), sf = 1 - prog(f, 26, 40);
  return <Stage>
    <g transform={`translate(${dx} 0)`} opacity={pp}><Card x={640} y={390} w={640} h={300} fill={C.hi} stroke={C.orange} seed={39} />
      <Icon name="warn" x={780} y={540} size={120} color={C.orange} w={7} /><T x={880} y={556} size={48} color={C.orange}>{text}</T></g>
    {[[-1, 0], [-1, 1], [1, 0], [1, 1]].map(([sd, k], i) => <Pen key={i} d={roughLine([[960 + sd * 350, 450 + k * 140], [960 + sd * 410, 430 + k * 180]], i + 1)} p={sk} w={5} opacity={sf} />)}
  </Stage>;
};
