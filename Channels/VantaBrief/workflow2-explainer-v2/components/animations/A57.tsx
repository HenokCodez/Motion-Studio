import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A57.json';
export const DURATION = meta.duration;
export const A57: React.FC<{source?: string; headlines?: string[]; highlight?: number}> = ({source = 'reuters.com', headlines = ['Chip export rules tighten again', 'Open model tops coding tests', 'Cloud prices fall for AI workloads', 'Startups shift to open weights', 'New model matches closed rivals', 'Regulators study AI benchmarks'], highlight = 4}) => {
  const f = useCurrentFrame(); const off = 330 * prog(f, 10, 70, EASE.inOut), hl = prog(f, 70, 84, EASE.out), fy = 360 + highlight * 110 - 330;
  return <Stage>
    <Card x={510} y={230} w={900} h={560} p={prog(f, 0, 16, EASE.inOut)} seed={58} />
    <g opacity={prog(f, 8, 18)}><Pen d={roughLine([[510, 300], [1410, 300]], 3)} p={1} w={3} />{[550, 585, 620].map(x => <circle key={x} cx={x} cy={265} r={8} fill={C.ink} />)}<T x={670} y={277} size={28}>{source}</T></g>
    <clipPath id="a57c"><rect x={522} y={312} width={876} height={466} /></clipPath>
    <g clipPath="url(#a57c)" opacity={prog(f, 14, 24)}>{headlines.map((h, i) => <g key={i}><T x={550} y={360 + i * 110 - off} size={36} color={i === highlight && hl > 0.5 ? C.orange : C.ink}>{h}</T>
      <Pen d={roughLine([[550, 385 + i * 110 - off], [1250, 385 + i * 110 - off]], i + 1)} p={1} w={3} opacity={0.3} /></g>)}</g>
    <Pen d={roughLine([[545, fy + 24], [1300, fy + 20]], 6)} p={hl} color={C.orange} w={6} />
  </Stage>;
};
