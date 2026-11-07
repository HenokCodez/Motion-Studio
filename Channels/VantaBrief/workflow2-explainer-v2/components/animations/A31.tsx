import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A31.json';
export const DURATION = meta.duration;
export const A31: React.FC<{label?: string}> = ({label = 'Agent mode'}) => {
  const f = useCurrentFrame(); const pp = prog(f, 0, 14, EASE.inOut);
  const sp = f < 26 ? 0 : spring({frame: f - 26, fps: 30, config: SPR.pop}); const on = Math.min(1, sp), isOn = on > 0.5;
  const track = 'M800 440 L1120 440 A100 100 0 0 1 1120 640 L800 640 A100 100 0 0 1 800 440 Z';
  return <Stage>
    <T x={960} y={380} size={56} anchor="middle" opacity={prog(f, 6, 18)}>{label}</T>
    <path d={track} fill={isOn ? C.hi : C.card} opacity={pp} />
    <Pen d={roughPath(track, 2)} p={pp} w={6} color={isOn ? C.orange : C.ink} />
    <circle cx={800 + 320 * on} cy={540} r={78} fill={C.ink} stroke={C.card} strokeWidth={6} opacity={pp} />
    <T x={isOn ? 850 : 1070} y={555} size={48} anchor="middle" opacity={prog(f, 10, 20)} color={isOn ? C.orange : C.ink}>{isOn ? 'ON' : 'OFF'}</T>
  </Stage>;
};
