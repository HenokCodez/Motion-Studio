import React from 'react';
import {spring} from 'remotion';
import {useCurrentFrame} from '../primitives';
import {Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, SPR, HAND, HEAVY, prog, textWidth, roughLine, roughRect, roughPath, roughEllipse} from '../primitives';
import meta from './meta/A19.json';
export const DURATION = meta.duration;
type N = {label: string; icon: string};
export const A19: React.FC<{nodes?: N[]; highlight?: number}> = ({nodes = [{label: 'Hairspring', icon: 'search'}, {label: '3D Explode', icon: 'bolt'}, {label: '3D Space', icon: 'cube'}], highlight = 1}) => {
  const f = useCurrentFrame(); const xs = [170, 740, 1310], st = [0, 22, 44]; const pr = prog(f, 60, 84, EASE.out);
  return <Stage>
    {nodes.map((n, i) => { const hi = i === highlight, p = prog(f, st[i], st[i] + 14, EASE.inOut);
      return <g key={i}><Card x={xs[i]} y={465} w={440} h={150} p={p} fillP={p} fill={hi ? C.hi : C.card} stroke={hi ? C.orange : C.ink} seed={i + 50} />
        <Icon name={n.icon} x={xs[i] + 75} y={540} size={70} p={prog(f, st[i] + 8, st[i] + 20)} color={hi ? C.orange : C.ink} w={5} />
        <T x={xs[i] + 135} y={556} size={44} color={hi ? C.orange : C.ink} p={prog(f, st[i] + 10, st[i] + 26, EASE.inOut)} width={300} id={'a19' + i}>{n.label}</T></g>; })}
    <Arrow x1={620} y1={540} x2={730} y2={540} p={prog(f, 14, 26, EASE.inOut)} seed={3} />
    <Arrow x1={1190} y1={540} x2={1300} y2={540} p={prog(f, 36, 48, EASE.inOut)} seed={4} />
    <g opacity={1 - pr}><Pen d={roughRect(740 - pr * 50, 465 - pr * 50, 440 + pr * 100, 150 + pr * 100, 77)} p={pr > 0 ? 1 : 0} color={C.orange} w={4} /></g>
  </Stage>;
};
