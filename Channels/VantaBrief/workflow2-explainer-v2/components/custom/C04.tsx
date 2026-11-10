import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, C, SAFE, EASE, prog, roughRect, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C04.json';
export const DURATION = meta.duration;

export const C04: React.FC<{val?: string; label?: string; sub?: string}> = ({
  val = '155 TRILLION',
  label = 'Tokens Processed / Day',
  sub = '1.8 Billion Words / Second'
}) => {
  const f = useCurrentFrame();
  const numP = prog(f, 4, 30, EASE.out);
  const lanesP = prog(f, 20, 44, EASE.out);
  const subP = prog(f, 42, 64, EASE.out);

  // Highway stream lanes
  const lanes = [580, 650, 720];

  return (
    <Stage>
      {/* Hero Big Stat */}
      <T x={960} y={240} size={42} anchor="middle" p={prog(f, 2, 16, EASE.out)} id="c04-top">DATA CENTER SCALE</T>
      <T x={960} y={390} size={110} anchor="middle" heavy color={C.orange} p={numP} id="c04-num">{val}</T>
      <T x={960} y={480} size={44} anchor="middle" heavy p={numP} id="c04-lbl">{label}</T>

      {/* 3 Streaming Lanes with animated packets */}
      {lanes.map((ly, i) => {
        const laneLine = plainLine([[340, ly], [1580, ly]]);
        // Dots moving with frame
        const dotOffset = (f * 18 + i * 280) % 1200;
        const dx = 360 + dotOffset;
        return (
          <g key={i} opacity={lanesP}>
            <path d={laneLine} fill="none" stroke={C.ink} strokeWidth={2} strokeDasharray="12 12" opacity={0.4} />
            <circle cx={dx} cy={ly} r={7} fill={C.orange} />
            <circle cx={dx > 420 ? dx - 60 : dx + 1140} cy={ly} r={5} fill={C.ink} opacity={0.7} />
          </g>
        );
      })}

      {/* Subtitle card below lanes */}
      <Card x={580} y={790} w={760} h={90} p={subP} fill={C.card} stroke={C.ink} seed={82}>
        <T x={960} y={848} size={36} anchor="middle" heavy color={C.orange} p={subP} id="c04-sub">{sub}</T>
      </Card>
    </Stage>
  );
};

