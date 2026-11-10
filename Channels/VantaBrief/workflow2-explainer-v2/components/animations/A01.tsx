import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A01.json';
export const DURATION = meta.duration;
export const A01: React.FC<{title?: string; subtitle?: string; icon?: string}> = ({title = 'Real World or Benchmark?', subtitle = 'Paper metrics vs production reality', icon = 'scales'}) => {
  const f = useCurrentFrame();
  const size = Math.min(96, Math.floor(96 * SAFE.w / textWidth(title, 96, HEAVY)));
  const tw = textWidth(title, size, HEAVY) + 10;
  const ip = prog(f, 0, 26, EASE.inOut), wp = prog(f, 14, 46, EASE.inOut), sp = prog(f, 46, 62);
  const nibX = SAFE.cx - tw / 2 + wp * tw;
  return <Stage>
    <Icon name={icon} x={960} y={300} size={190} p={ip} color={C.orange} w={7} />
    <T x={960} y={600} size={size} heavy anchor="middle" p={wp} width={tw} id="a01">{title}</T>
    {wp > 0 && wp < 1 && <circle cx={nibX} cy={600 - size * 0.35} r={10} fill={C.orange} />}
    <T x={960} y={700 + (1 - sp) * 16} size={48} anchor="middle" opacity={sp}>{subtitle}</T>
  </Stage>;
};
