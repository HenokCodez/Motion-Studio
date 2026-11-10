import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, C, SAFE, EASE, prog, roughRect, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C11.json';
export const DURATION = meta.duration;

export const C11: React.FC<{title?: string; gpus?: string; drop?: string}> = ({
  title = 'Wide Expert Parallelism',
  gpus = '64-128 GPUs Cluster',
  drop = '-88% Traffic Drop'
}) => {
  const f = useCurrentFrame();
  const titleP = prog(f, 2, 18, EASE.out);
  const meshP = prog(f, 6, 30, EASE.out);
  const gpusP = prog(f, 18, 40, EASE.out);
  const dropP = prog(f, 36, 58, EASE.back);

  // 8 GPU chips: 2 rows of 4
  const chips = [
    {x: 400, y: 320, l: 'GPU 1'},
    {x: 760, y: 320, l: 'GPU 2'},
    {x: 1120, y: 320, l: 'GPU 3'},
    {x: 1480, y: 320, l: 'GPU 4'},
    {x: 400, y: 520, l: 'GPU 5'},
    {x: 760, y: 520, l: 'GPU 6'},
    {x: 1120, y: 520, l: 'GPU 7'},
    {x: 1480, y: 520, l: 'GPU 8'}
  ];

  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={titleP} id="c11-title">{title}</T>

      {/* Crossbar Bus Lines between chips */}
      <g opacity={meshP}>
        <line x1={400} y1={320} x2={1480} y2={320} stroke={C.ink} strokeWidth={3} strokeDasharray="8 8" />
        <line x1={400} y1={520} x2={1480} y2={520} stroke={C.ink} strokeWidth={3} strokeDasharray="8 8" />
        <line x1={580} y1={320} x2={1300} y2={520} stroke={C.orange} strokeWidth={2} opacity={0.6} />
        <line x1={580} y1={520} x2={1300} y2={320} stroke={C.orange} strokeWidth={2} opacity={0.6} />
      </g>

      {/* 8 GPU Nodes */}
      {chips.map((ch, i) => {
        const cp = prog(f, 10 + i * 3, 22 + i * 3, EASE.out);
        const isHighlight = i === 1 || i === 6;
        return (
          <g key={i}>
            <Card x={ch.x - 70} y={ch.y - 45} w={140} h={90} p={cp} fill={isHighlight ? C.hi : C.card} stroke={isHighlight ? C.orange : C.ink} seed={i + 90}>
              <T x={ch.x} y={ch.y + 10} size={28} anchor="middle" heavy color={isHighlight ? C.orange : C.ink} p={cp} id={`c11-gpu-${i}`}>
                {ch.l}
              </T>
            </Card>
          </g>
        );
      })}

      {/* Central Cluster Spec Label */}
      <T x={960} y={690} size={42} anchor="middle" heavy p={gpusP} id="c11-gpus">{gpus}</T>

      {/* Traffic Drop Hero Pill */}
      <Card x={640} y={750} w={640} h={100} p={dropP} fill={C.card} stroke={C.orange} seed={115}>
        <T x={960} y={814} size={44} anchor="middle" heavy color={C.orange} p={dropP} id="c11-drop">{drop}</T>
      </Card>

      <T x={960} y={900} size={32} anchor="middle" p={dropP} id="c11-foot">Massive Data Pumped Without Choking Single GPU</T>
    </Stage>
  );
};

