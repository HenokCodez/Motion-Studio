import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, C, SAFE, EASE, prog, roughEllipse, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C02.json';
export const DURATION = meta.duration;

export const C02: React.FC<{left?: string; right?: string; sub?: string}> = ({
  left = 'Billions Cloud',
  right = 'Pennies API',
  sub = 'Cloud Costs vs Efficient API'
}) => {
  const f = useCurrentFrame();
  const stackLeftP = prog(f, 6, 26, EASE.out);
  const stackRightP = prog(f, 22, 42, EASE.out);
  const burnP = prog(f, 38, 62, EASE.inOut);
  const vsP = prog(f, 18, 34, EASE.back);
  const subP = prog(f, 44, 66, EASE.out);

  // Left coin stack: 7 ellipses
  const leftLayers = [720, 670, 620, 570, 520, 470, 420];
  // Right coin stack: 2 compact ellipses
  const rightLayers = [720, 670];

  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={prog(f, 2, 18, EASE.out)} id="c02-title">Cost Disparity</T>
      
      {/* Left Stack ($ Billions) */}
      <g>
        {leftLayers.map((cy, i) => {
          const lp = prog(f, 6 + i * 3, 18 + i * 3, EASE.out);
          const d = roughEllipse(540, cy, 260, 70, i + 10);
          return (
            <g key={i}>
              <ellipse cx={540} cy={cy} rx={130} ry={35} fill={C.card} stroke="none" opacity={lp} />
              <Pen d={d} p={lp} color={C.ink} w={4} />
            </g>
          );
        })}
        {/* Burning flame smoke squiggles above left stack */}
        {burnP > 0.1 && (
          <g opacity={burnP}>
            <Pen d={roughLine([[500, 380], [480, 320], [520, 260]], 77)} p={burnP} color={C.orange} w={4} />
            <Pen d={roughLine([[560, 380], [580, 310], [550, 250]], 78)} p={burnP} color={C.orange} w={4} />
            <T x={540} y={230} size={32} anchor="middle" heavy color={C.orange} p={burnP} id="c02-burn">BURNING</T>
          </g>
        )}
        <T x={540} y={800} size={42} anchor="middle" heavy p={stackLeftP} id="c02-left">{left}</T>
      </g>

      {/* VS in center */}
      <circle cx={960} cy={560} r={48} fill={C.card} stroke={C.ink} strokeWidth={4} opacity={vsP} />
      <T x={960} y={574} size={38} anchor="middle" heavy p={vsP} id="c02-vs">VS</T>

      {/* Right Stack (Pennies) */}
      <g>
        {rightLayers.map((cy, i) => {
          const rp = prog(f, 22 + i * 6, 34 + i * 6, EASE.out);
          const d = roughEllipse(1380, cy, 260, 70, i + 30);
          return (
            <g key={i}>
              <ellipse cx={1380} cy={cy} rx={130} ry={35} fill={C.hi} stroke="none" opacity={rp} />
              <Pen d={d} p={rp} color={C.orange} w={5} />
            </g>
          );
        })}
        {/* Checkmark above penny stack */}
        <g opacity={stackRightP}>
          <Pen d={roughLine([[1340, 580], [1370, 610], [1430, 540]], 99)} p={stackRightP} color={C.orange} w={8} />
        </g>
        <T x={1380} y={800} size={42} anchor="middle" heavy color={C.orange} p={stackRightP} id="c02-right">{right}</T>
      </g>

      <T x={960} y={880} size={34} anchor="middle" p={subP} id="c02-sub">{sub}</T>
    </Stage>
  );
};

