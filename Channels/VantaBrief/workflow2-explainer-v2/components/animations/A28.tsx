import React from 'react';
import {spring, staticFile} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {LogoBadge, Stage, Card, Pen, T, C, EASE, SPR, prog, roughLine, roughEllipse} from '../primitives';
import meta from './meta/A28.json';
export const DURATION = meta.duration;
export const A28: React.FC<{names?: string[]; files?: string[]; highlight?: number}> = ({names = ['ChatGPT', 'Claude', 'Gemini', 'Grok', 'Mistral', 'Meta'], files = ['chatgpt.svg', 'claude.svg', 'gemini.svg', 'grok.svg', 'mistral.svg', 'meta.svg'], highlight = 1}) => {
  const f = useCurrentFrame(); const n = Math.min(6, names.length), cols = Math.min(3, n), rows = Math.ceil(n / 3); const x0 = 960 - (cols * 240 + (cols - 1) * 60) / 2, y0 = 540 - (rows * 200 + (rows - 1) * 60) / 2; const dim = prog(f, 54, 66);
  return <Stage>{names.slice(0, n).map((nm, i) => { const x = x0 + (i % cols) * 300, y = y0 + Math.floor(i / cols) * 260, s = spring({frame: f - (4 + i * 6), fps: 30, config: SPR.pop}), hi = i === highlight, o = hi ? 1 : 1 - 0.55 * dim;
    return <g key={i} opacity={Math.min(1, s * 2) * o} transform={`translate(${x + 120} ${y + 100}) scale(${Math.max(0, s)}) translate(${-x - 120} ${-y - 100})`}>
      <Card x={x} y={y} w={240} h={200} fill={hi && dim > 0.5 ? C.hi : C.card} stroke={hi && dim > 0.5 ? C.orange : C.ink} seed={i + 150} />
      {files[i] ? <LogoBadge cx={x + 120} cy={y + 80} r={58} file={files[i]} round={false} /> :
        <><circle cx={x + 120} cy={y + 75} r={50} fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="10 8" /><T x={x + 120} y={y + 96} size={64} heavy anchor="middle">{nm[0]}</T></>}
      <T x={x + 120} y={y + 178} size={28} anchor="middle">{nm}</T></g>; })}</Stage>;
};
