import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A11.json';
export const DURATION = meta.duration;
export const A11: React.FC<{left?: string; right?: string}> = ({left = 'Paper metrics', right = 'Production reality'}) => {
  const f = useCurrentFrame(); const dv = prog(f, 0, 14, EASE.inOut), rv = prog(f, 10, 34, EASE.inOut), tp = prog(f, 30, 48, EASE.inOut);
  return <Stage>
    <clipPath id="a11l"><rect x={930 - 770 * rv} y={300} width={770 * rv} height={480} /></clipPath>
    <clipPath id="a11r"><rect x={990} y={300} width={770 * rv} height={480} /></clipPath>
    <g clipPath="url(#a11l)"><Card x={160} y={320} w={770} h={440} seed={41} /><Icon name="browser" x={545} y={460} size={140} color={C.ink} />
      <T x={545} y={660} size={56} anchor="middle" p={tp} width={700} id="a11a">{left}</T></g>
    <g clipPath="url(#a11r)"><Card x={990} y={320} w={770} h={440} seed={42} fill={C.hi} stroke={C.orange} /><Icon name="chip" x={1375} y={460} size={140} color={C.orange} />
      <T x={1375} y={660} size={56} anchor="middle" p={tp} width={700} id="a11b">{right}</T></g>
    <Pen d={roughLine([[960, 280], [960, 800]], 2)} p={dv} w={5} />
  </Stage>;
};
