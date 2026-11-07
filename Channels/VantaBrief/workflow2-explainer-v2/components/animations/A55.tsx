import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, Stick, PhotoSlot, LogoBadge, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A55.json';
export const DURATION = meta.duration;
export const A55: React.FC<{names?: string[]; files?: string[]; hub?: string; hubFile?: string}> = ({names = ['ChatGPT', 'Claude', 'Gemini', 'Grok'], files = ['chatgpt.svg', 'claude.svg', 'gemini.svg', 'grok.svg'], hub = 'DeepSeek', hubFile = 'deepseek.svg'}) => {
  const f = useCurrentFrame(); const hs = spring({frame: f, fps: 30, config: SPR.pop});
  return <Stage>
    <Pen d={roughEllipse(960, 540, 1040, 460, 3)} p={prog(f, 4, 26, EASE.inOut)} w={3} opacity={0.4} />
    {names.map((n, i) => { const a = (i / names.length) * Math.PI * 2 - Math.PI / 2 + f * 0.045, s = spring({frame: f - (14 + i * 6), fps: 30, config: SPR.pop});
      return <g key={i} transform={`translate(${960 + 520 * Math.cos(a)} ${540 + 230 * Math.sin(a)}) scale(${Math.max(0, Math.min(s, 1.1))})`}><LogoBadge cx={0} cy={0} r={66} file={files[i]} initial={n[0]} /></g>; })}
    <g transform={`translate(960 540) scale(${Math.min(hs, 1.08)})`}><circle r={120} fill={C.hi} stroke={C.orange} strokeWidth={6} /><LogoBadge cx={0} cy={-18} r={62} file={hubFile} initial={hub[0]} />
      <T x={0} y={92} size={32} anchor="middle" color={C.orange}>{hub}</T></g>
  </Stage>;
};
