import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A47.json';
export const DURATION = meta.duration;
export const A47: React.FC<{a?: string; b?: string}> = ({a = 'Is it real?', b = 'Test it.'}) => {
  const f = useCurrentFrame(); const pa = prog(f, 12, 26, EASE.back), pb = prog(f, 40, 54, EASE.back);
  return <Stage>
    <Stick x={330} y={880} h={340} pose="stand" p={prog(f, 0, 12)} /><Stick x={1590} y={880} h={340} pose="wave" flip p={prog(f, 0, 12)} />
    <g opacity={pa} transform={`translate(0 ${(1 - pa) * 20})`}><Card x={440} y={260} w={500} h={110} seed={47} /><Pen d={roughLine([[470, 370], [390, 520]], 2)} p={1} w={4} /><T x={690} y={332} size={44} anchor="middle">{a}</T></g>
    <g opacity={pb} transform={`translate(0 ${(1 - pb) * 20})`}><Card x={980} y={430} w={500} h={110} fill={C.hi} stroke={C.orange} seed={48} /><Pen d={roughLine([[1450, 540], [1540, 600]], 3)} p={1} color={C.orange} w={4} /><T x={1230} y={502} size={44} anchor="middle" color={C.orange}>{b}</T></g>
  </Stage>;
};
