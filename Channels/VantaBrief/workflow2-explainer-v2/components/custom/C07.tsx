import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, C, SAFE, EASE, prog, roughEllipse, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C07.json';
export const DURATION = meta.duration;

export const C07: React.FC<{title?: string; layers?: string[]}> = ({
  title = 'Exploded 3D Space',
  layers = ['Top Glass Bezel', 'Mechanical Movement', 'Titanium Case Back']
}) => {
  const f = useCurrentFrame();
  const titleP = prog(f, 2, 18, EASE.out);
  const explodeP = prog(f, 10, 42, EASE.back);
  const labelsP = prog(f, 32, 54, EASE.out);

  // Layers explode vertically from center y=520
  const yOffsets = [
    520 - 220 * explodeP, // top layer: ~300
    520,                  // middle layer: 520
    520 + 220 * explodeP  // bottom layer: ~740
  ];

  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={titleP} id="c07-title">{title}</T>

      {/* Vertical central guide alignment dashed line */}
      <line x1={800} y1={250} x2={800} y2={790} stroke={C.ink} strokeWidth={2} strokeDasharray="8 8" opacity={explodeP * 0.5} />

      {/* 3 Isometric exploded layers */}
      {yOffsets.map((cy, i) => {
        const lp = prog(f, 8 + i * 8, 26 + i * 8, EASE.out);
        const isMiddle = i === 1;
        const d = roughEllipse(800, cy, 540, 140, i + 80);
        return (
          <g key={i}>
            <ellipse cx={800} cy={cy} rx={270} ry={70} fill={isMiddle ? C.hi : C.card} opacity={lp} />
            <Pen d={d} p={lp} color={isMiddle ? C.orange : C.ink} w={isMiddle ? 6 : 4} />
            
            {/* Gear teeth hints inside middle movement layer */}
            {isMiddle && (
              <g opacity={explodeP}>
                <circle cx={760} cy={cy} r={32} fill="none" stroke={C.orange} strokeWidth={3} strokeDasharray="6 6" />
                <circle cx={840} cy={cy} r={24} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="5 5" />
              </g>
            )}

            {/* Connecting line to label */}
            <g opacity={labelsP}>
              <line x1={1080} y1={cy} x2={1180} y2={cy} stroke={isMiddle ? C.orange : C.ink} strokeWidth={3} strokeDasharray="4 4" />
              <T x={1200} y={cy + 12} size={36} heavy={isMiddle} color={isMiddle ? C.orange : C.ink} p={labelsP} id={`c07-l-${i}`}>
                {layers[i] || `Layer ${i + 1}`}
              </T>
            </g>
          </g>
        );
      })}

      <T x={960} y={880} size={34} anchor="middle" p={prog(f, 44, 66, EASE.out)} id="c07-sub">Every Internal Layer Separated In Perspective</T>
    </Stage>
  );
};

