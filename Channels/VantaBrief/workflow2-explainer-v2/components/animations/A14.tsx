import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A14.json';
export const DURATION = meta.duration;
export const A14: React.FC<{labels?: string[]}> = ({labels = ['Collect data', 'Run the test', 'Compare results']}) => {
  const f = useCurrentFrame(); const pp = prog(f, 6, 62, EASE.inOut); const stops = [[300, 700], [960, 420], [1560, 640]]; const ly = [810, 340, 750];
  return <Stage>
    <Pen d={roughPath('M300 700 C 620 700, 660 420, 960 420 S 1260 640, 1560 640', 5)} p={pp} w={5} />
    {stops.map(([x, y], i) => { const s = spring({frame: f - (6 + (i / 2) * 56), fps: 30, config: SPR.pop}), last = i === 2;
      return <g key={i} transform={`translate(${x} ${y}) scale(${Math.max(0, s)}) translate(${-x} ${-y})`}>
        <circle cx={x} cy={y} r={46} fill={last ? C.hi : C.card} stroke={last ? C.orange : C.ink} strokeWidth={5} />
        <T x={x} y={y + 15} size={44} anchor="middle" color={last ? C.orange : C.ink}>{String(i + 1)}</T>
        <T x={x} y={ly[i]} size={40} anchor="middle" color={last ? C.orange : C.ink}>{labels[i]}</T></g>; })}
  </Stage>;
};
