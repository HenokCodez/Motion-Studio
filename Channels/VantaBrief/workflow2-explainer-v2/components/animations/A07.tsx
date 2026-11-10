import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A07.json';
export const DURATION = meta.duration;
export const A07: React.FC<{value?: number; label?: string; sub?: string}> = ({value = 130, label = 'individual pastries identified', sub = 'in a single test run'}) => {
  const f = useCurrentFrame(); const n = Math.round(value * prog(f, 8, 52, EASE.out));
  return <Stage>
    <Icon name="check" x={960} y={250} size={130} p={prog(f, 0, 18, EASE.inOut)} color={C.orange} w={8} />
    <T x={960} y={650} size={300} heavy anchor="middle" color={C.orange} opacity={prog(f, 6, 12)}>{`${n}+`}</T>
    <T x={960} y={760} size={52} anchor="middle" opacity={prog(f, 40, 56)}>{label}</T>
    <T x={960} y={820} size={32} anchor="middle" opacity={prog(f, 48, 62) * 0.75}>{sub}</T>
  </Stage>;
};
