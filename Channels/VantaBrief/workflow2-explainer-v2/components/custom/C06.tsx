import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, prog, roughEllipse, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C06.json';
export const DURATION = meta.duration;

export const C06: React.FC<{title?: string; part1?: string; part2?: string}> = ({
  title = '3D Mechanical Watch',
  part1 = 'Hairspring Loop',
  part2 = 'Escapement Gear'
}) => {
  const f = useCurrentFrame();
  const buildP = prog(f, 6, 30, EASE.out);
  const osc = Math.sin(f * 0.25) * 18; // gentle oscillation of balance wheel
  const labelsP = prog(f, 32, 56, EASE.out);

  // Balance wheel center: cx=660, cy=520
  // Escapement gear center: cx=1260, cy=520
  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={prog(f, 2, 18, EASE.out)} id="c06-title">{title}</T>

      {/* Balance Wheel (Left) */}
      <g transform={`rotate(${osc} 660 520)`} opacity={buildP}>
        {/* Outer Rim */}
        <circle cx={660} cy={520} r={170} fill="none" stroke={C.ink} strokeWidth={8} />
        {/* 3 Radial Spokes */}
        {[0, 120, 240].map((deg, i) => {
          const th = (deg * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={660}
              y1={520}
              x2={660 + 170 * Math.cos(th)}
              y2={520 + 170 * Math.sin(th)}
              stroke={C.ink}
              strokeWidth={5}
            />
          );
        })}
        {/* Center Spiral Hairspring */}
        <path
          d="M 660 520 Q 675 510 680 525 Q 685 545 660 550 Q 630 550 630 520 Q 630 480 670 480 Q 710 480 710 520 Q 710 570 660 570"
          fill="none"
          stroke={C.orange}
          strokeWidth={4}
        />
        <circle cx={660} cy={520} r={18} fill={C.orange} />
      </g>

      {/* Escapement Gear (Right) */}
      <g transform={`rotate(${-osc * 1.5} 1260 520)`} opacity={buildP}>
        {/* Gear Rim */}
        <circle cx={1260} cy={520} r={140} fill="none" stroke={C.ink} strokeWidth={6} />
        {/* 12 Gear Teeth */}
        {Array.from({length: 12}).map((_, i) => {
          const deg = i * 30;
          const th = (deg * Math.PI) / 180;
          const x0 = 1260 + 135 * Math.cos(th);
          const y0 = 520 + 135 * Math.sin(th);
          const x1 = 1260 + 165 * Math.cos(th + 0.08);
          const y1 = 520 + 165 * Math.sin(th + 0.08);
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />;
        })}
        <circle cx={1260} cy={520} r={24} fill={C.card} stroke={C.ink} strokeWidth={4} />
      </g>

      {/* Labels with pointers */}
      <g opacity={labelsP}>
        <Arrow x1={660} y1={730} x2={660} y2={650} p={labelsP} color={C.orange} w={4} />
        <T x={660} y={780} size={38} anchor="middle" heavy color={C.orange} p={labelsP} id="c06-p1">{part1}</T>

        <Arrow x1={1260} y1={730} x2={1260} y2={650} p={labelsP} color={C.ink} w={4} />
        <T x={1260} y={780} size={38} anchor="middle" heavy p={labelsP} id="c06-p2">{part2}</T>
      </g>

      <T x={960} y={880} size={34} anchor="middle" p={prog(f, 40, 60, EASE.out)} id="c06-sub">Spatial Geometry & Mechanical Physics</T>
    </Stage>
  );
};

