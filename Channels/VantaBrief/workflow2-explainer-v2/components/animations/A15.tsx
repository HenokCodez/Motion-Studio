import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A15.json';
export const DURATION = meta.duration;
export const A15: React.FC<{chips?: string[]; result?: string}> = ({chips = ['Papers', 'Demos', 'Leaderboards'], result = 'Real score'}) => {
  const f = useCurrentFrame(); const xs = [700, 960, 1220]; const rs = spring({frame: f - 58, fps: 30, config: SPR.pop});
  return <Stage>
    <Pen d={roughPath('M510 240 L1410 240 L1060 640 L1060 760 L860 760 L860 640 Z', 4)} p={prog(f, 0, 16, EASE.inOut)} w={5} />
    {chips.map((c, i) => { const t = prog(f, 10 + i * 12, 34 + i * 12, EASE.inOut), o = 1 - prog(f, 28 + i * 12, 36 + i * 12), sc = 1 - 0.6 * t;
      const cx = xs[i] + (960 - xs[i]) * t, cy = 130 + t * 400, a = prog(f, 4 + i * 12, 12 + i * 12);
      return <g key={i} opacity={Math.min(a, o)} transform={`translate(${cx} ${cy}) scale(${sc})`}><Card x={-110} y={-32} w={220} h={64} seed={i + 2} /><T x={0} y={10} size={28} anchor="middle">{c}</T></g>; })}
    <g transform={`translate(960 850) scale(${f < 58 ? 0 : Math.min(rs, 1.1)}) translate(-960 -850)`}><Card x={780} y={800} w={360} h={100} fill={C.hi} stroke={C.orange} seed={9} /><T x={960} y={865} size={44} anchor="middle" color={C.orange}>{result}</T></g>
  </Stage>;
};
