import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, C, SAFE, EASE, prog, roughLine, roughRect} from '../primitives';
import meta from '../animations/meta/C01.json';
export const DURATION = meta.duration;

export const C01: React.FC<{title?: string; sub?: string}> = ({
  title = 'Compute Cluster',
  sub = 'Data Center Infrastructure'
}) => {
  const f = useCurrentFrame();
  const titleP = prog(f, 4, 20, EASE.out);
  const subP = prog(f, 35, 55, EASE.out);

  const racks = [
    {x: 360, label: 'Cluster A'},
    {x: 840, label: 'Cluster B'},
    {x: 1320, label: 'Cluster C'}
  ];

  return (
    <Stage>
      <T x={960} y={170} size={54} anchor="middle" heavy p={titleP} id="c01-title">{title}</T>
      {racks.map((r, i) => {
        const s = 10 + i * 10;
        const rackP = prog(f, s, s + 18, EASE.out);
        const ledP = prog(f, s + 18, s + 32, EASE.inOut);
        const isCenter = i === 1;
        const bladeCount = 7;
        return (
          <g key={i}>
            <Card x={r.x} y={240} w={240} h={540} p={rackP} fill={isCenter ? C.hi : C.card} stroke={isCenter ? C.orange : C.ink} seed={i + 12}>
              <T x={r.x + 120} y={290} size={32} anchor="middle" heavy p={rackP} id={`c01-lbl-${i}`}>{r.label}</T>
              {Array.from({length: bladeCount}).map((_, bi) => {
                const by = 340 + bi * 60;
                const bLine = roughLine([[r.x + 20, by], [r.x + 220, by]], i * 10 + bi + 1);
                return (
                  <g key={bi}>
                    <Pen d={bLine} p={rackP} color={isCenter ? C.orange : C.ink} w={2} opacity={0.6} />
                    <circle cx={r.x + 40} cy={by - 12} r={5} fill={ledP > 0.5 ? (isCenter ? C.orange : C.lime) : C.card} stroke={C.ink} strokeWidth={2} />
                    <circle cx={r.x + 60} cy={by - 12} r={5} fill={ledP > 0.5 ? C.orange : C.card} stroke={C.ink} strokeWidth={2} />
                  </g>
                );
              })}
            </Card>
          </g>
        );
      })}
      <T x={960} y={850} size={36} anchor="middle" p={subP} color={C.orange} id="c01-sub">{sub}</T>
    </Stage>
  );
};

