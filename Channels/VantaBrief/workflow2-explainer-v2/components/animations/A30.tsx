import React from 'react';
import {useCurrentFrame, spring, staticFile} from 'remotion';
import {Stage, Card, Pen, T, C, EASE, SPR, prog, roughLine, roughEllipse} from '../primitives';
import meta from './meta/A30.json';
export const DURATION = meta.duration;
export const A30: React.FC<{src?: string; url?: string; note?: string}> = ({src, url = 'deepseek.com', note = 'Look here'}) => {
  const f = useCurrentFrame(); const p = prog(f, 0, 16, EASE.inOut), b = prog(f, 10, 20), c = prog(f, 16, 26);
  return <Stage>
    <Card x={510} y={230} w={900} h={520} p={p} seed={170} />
    <g opacity={b}><Pen d={roughLine([[510, 300], [1410, 300]], 3)} p={1} w={3} />{[550, 585, 620].map(x => <circle key={x} cx={x} cy={265} r={8} fill={C.ink} />)}
      <T x={670} y={277} size={28}>{url}</T></g>
    <g opacity={c}>{src ? <image href={staticFile('screenshots/' + src)} x={522} y={312} width={876} height={426} preserveAspectRatio="xMidYMid slice" /> :
      <T x={960} y={545} size={36} anchor="middle" opacity={0.6}>screenshot placeholder</T>}</g>
    <Pen d={roughEllipse(1150, 470, 240, 130, 4)} p={prog(f, 40, 56, EASE.out)} color={C.orange} w={6} />
    <T x={1150} y={850} size={40} anchor="middle" color={C.orange} p={prog(f, 54, 70, EASE.inOut)} width={420} id="a30">{note}</T>
  </Stage>;
};
