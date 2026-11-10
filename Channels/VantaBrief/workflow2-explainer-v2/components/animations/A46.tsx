import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A46.json';
export const DURATION = meta.duration;
export const A46: React.FC<{title?: string; bullets?: string[]}> = ({title = 'Why it matters', bullets = ['Cheaper to run', 'Open weights', 'Faster agents']}) => {
  const f = useCurrentFrame();
  return <Stage>
    <Stick x={520} y={880} h={420} pose="point" p={prog(f, 0, 14)} />
    <Card x={780} y={300} w={760} h={440} p={prog(f, 10, 28)} seed={46} />
    <T x={830} y={395} size={56} color={C.orange} p={prog(f, 26, 42, EASE.inOut)} width={660} id="a46">{title}</T>
    {bullets.map((b, i) => <T key={i} x={830} y={490 + i * 80} size={44} p={prog(f, 40 + i * 14, 54 + i * 14, EASE.inOut)} width={660} id={'a46' + i}>{'• ' + b}</T>)}
  </Stage>;
};
