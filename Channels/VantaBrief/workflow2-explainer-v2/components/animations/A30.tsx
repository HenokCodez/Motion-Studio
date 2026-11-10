import React from 'react';
import {staticFile} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, C, EASE, prog, roughLine, roughEllipse} from '../primitives';
import meta from './meta/A30.json';
export const DURATION = meta.duration;
/** v2.1: bigger sketch browser, screenshot inverted to the dark theme (theme="original" keeps native colors), orange pen circle on a chosen region, then the view zooms into that region. region = [x,y,w,h] as fractions of the screenshot. */
export const A30: React.FC<{src?: string; url?: string; note?: string; region?: number[]; theme?: 'dark' | 'original'}> = ({src, url = 'deepseek.com', note = 'Look here', region = [0.58, 0.2, 0.32, 0.28], theme = 'dark'}) => {
  const f = useCurrentFrame(); const p = prog(f, 0, 16, EASE.inOut), b = prog(f, 10, 20), c = prog(f, 16, 26);
  const VX = 422, VY = 292, VW = 1076, VH = 526; const cx = VX + VW * (region[0] + region[2] / 2), cy = VY + VH * (region[1] + region[3] / 2);
  const ew = Math.max(170, VW * region[2] + 50), eh = Math.max(120, VH * region[3] + 40), z = 1 + 0.8 * prog(f, 58, 78, EASE.inOut);
  return <Stage>
    <Card x={410} y={210} w={1100} h={620} p={p} seed={170} />
    <g opacity={b}><Pen d={roughLine([[410, 280], [1510, 280]], 3)} p={1} w={3} />{[450, 485, 520].map(x => <circle key={x} cx={x} cy={245} r={8} fill={C.ink} />)}<T x={600} y={257} size={28}>{url}</T></g>
    <clipPath id="a30c"><rect x={VX} y={VY} width={VW} height={VH} /></clipPath>
    <g opacity={c} clipPath="url(#a30c)"><g transform={`translate(${cx} ${cy}) scale(${z}) translate(${-cx} ${-cy})`}>
      {src ? <image href={staticFile('screenshots/' + src)} x={VX} y={VY} width={VW} height={VH} preserveAspectRatio="xMidYMid slice" style={theme === 'dark' ? {filter: 'invert(0.9) hue-rotate(180deg) brightness(0.9)'} : undefined} /> :
        <T x={960} y={565} size={36} anchor="middle" opacity={0.6}>screenshot placeholder</T>}
      <Pen d={roughEllipse(cx, cy, ew, eh, 4)} p={prog(f, 40, 56, EASE.out)} color={C.orange} w={6} />
    </g></g>
    <T x={960} y={905} size={44} anchor="middle" color={C.orange} p={prog(f, 54, 72, EASE.inOut)} width={700} id="a30">{note}</T>
  </Stage>;
};
