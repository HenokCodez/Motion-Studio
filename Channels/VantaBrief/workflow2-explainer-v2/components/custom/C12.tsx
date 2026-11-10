import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, C, SAFE, EASE, prog, roughRect, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C12.json';
export const DURATION = meta.duration;

export const C12: React.FC<{title?: string; storage?: string; hitRate?: string}> = ({
  title = 'Input Context Caching',
  storage = '100 PB SSD Storage',
  hitRate = '96% Cache Hit Rate'
}) => {
  const f = useCurrentFrame();
  const titleP = prog(f, 2, 18, EASE.out);
  const vaultP = prog(f, 6, 28, EASE.out);
  const hitP = prog(f, 32, 54, EASE.back);
  const subP = prog(f, 44, 66, EASE.out);

  // 3 storage drive towers
  const towers = [
    {x: 420, l: 'SSD Tier 1'},
    {x: 840, l: 'Custom FS Pool'},
    {x: 1260, l: 'SSD Tier 2'}
  ];

  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={titleP} id="c12-title">{title}</T>

      {/* 3 Storage Drive Cabinets */}
      {towers.map((tw, i) => {
        const tp = prog(f, 8 + i * 8, 24 + i * 8, EASE.out);
        const isCenter = i === 1;
        return (
          <g key={i}>
            <Card x={tw.x - 160} y={240} w={320} h={440} p={tp} fill={isCenter ? C.hi : C.card} stroke={isCenter ? C.orange : C.ink} seed={i + 130}>
              <T x={tw.x} y={300} size={34} anchor="middle" heavy color={isCenter ? C.orange : C.ink} p={tp} id={`c12-tw-${i}`}>
                {tw.l}
              </T>
              {/* Drive slots */}
              {Array.from({length: 5}).map((_, di) => {
                const dy = 360 + di * 60;
                const dLine = roughLine([[tw.x - 120, dy], [tw.x + 120, dy]], di + 10);
                return (
                  <g key={di}>
                    <Pen d={dLine} p={tp} color={isCenter ? C.orange : C.ink} w={2} />
                    <circle cx={tw.x - 100} cy={dy - 12} r={4} fill={isCenter ? C.orange : C.lime} />
                  </g>
                );
              })}
            </Card>
          </g>
        );
      })}

      {/* 100 PB Capacity Spec */}
      <T x={960} y={730} size={42} anchor="middle" heavy p={prog(f, 26, 44, EASE.out)} id="c12-storage">{storage}</T>

      {/* 96% Hit Rate Hero Pill */}
      <Card x={600} y={780} w={720} h={100} p={hitP} fill={C.card} stroke={C.orange} seed={140}>
        <T x={960} y={844} size={46} anchor="middle" heavy color={C.orange} p={hitP} id="c12-hit">{hitRate}</T>
      </Card>

      <T x={960} y={920} size={30} anchor="middle" p={subP} id="c12-sub">Reuses Computed Context Instead of Starting from Scratch</T>
    </Stage>
  );
};

