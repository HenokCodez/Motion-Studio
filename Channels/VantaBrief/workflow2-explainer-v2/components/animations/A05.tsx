import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect} from '../primitives';
import meta from './meta/A05.json';
export const DURATION = meta.duration;
export const A05: React.FC<{text?: string; emphasis?: number[]}> = ({text = 'Real tasks break paper scores', emphasis = [2]}) => {
  const f = useCurrentFrame(); const S = 96, MAXW = 1300, words = text.split(' ');
  const lines: {w: string; i: number}[][] = [[]]; let cur = 0;
  words.forEach((w, i) => { const ww = textWidth(w + ' ', S); if (cur + ww > MAXW && lines[lines.length - 1].length) { lines.push([]); cur = 0; } lines[lines.length - 1].push({w, i}); cur += ww; });
  const y0 = 540 - (lines.length - 1) * 60 + 30;
  return <Stage>{lines.map((ln, li) => {
    const tw = ln.reduce((a, o) => a + textWidth(o.w + ' ', S), 0) - textWidth(' ', S); let x = 960 - tw / 2;
    return ln.map(o => { const w = textWidth(o.w, S), cx = x + w / 2, cy = y0 + li * 120 - 30, xx = x; x += textWidth(o.w + ' ', S);
      const s = spring({frame: f - (6 + o.i * 7), fps: 30, config: SPR.pop}), r = ((o.i * 37) % 7 - 3);
      return <g key={o.i} transform={`translate(${cx} ${cy}) scale(${s}) rotate(${r * (1 - s)}) translate(${-cx} ${-cy})`}>
        <T x={xx} y={y0 + li * 120} size={S} color={emphasis.includes(o.i) ? C.orange : C.ink} opacity={Math.min(1, s * 2)}>{o.w}</T></g>; });
  })}</Stage>;
};
