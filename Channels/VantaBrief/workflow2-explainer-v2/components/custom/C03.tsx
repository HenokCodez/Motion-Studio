import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, C, SAFE, EASE, prog, roughRect, roughPath, roughLine} from '../primitives';
import meta from '../animations/meta/C03.json';
export const DURATION = meta.duration;

export const C03: React.FC<{title?: string; label?: string}> = ({
  title = 'Core Production Engine',
  label = 'OPEN SOURCE GITHUB'
}) => {
  const f = useCurrentFrame();
  const bodyP = prog(f, 6, 24, EASE.out);
  const shacklePop = prog(f, 26, 42, EASE.back);
  const sparkP = prog(f, 38, 56, EASE.out);
  const badgeP = prog(f, 40, 60, EASE.out);

  // Shackle translation and rotation when unlocked
  const shackleDy = -35 * shacklePop;
  const shackleRot = 25 * shacklePop;

  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={prog(f, 2, 18, EASE.out)} id="c03-title">{title}</T>

      {/* Padlock Assembly */}
      <g transform="translate(0, 40)">
        {/* Shackle (Arch) */}
        <g transform={`translate(0, ${shackleDy}) rotate(${shackleRot} 960 380)`} opacity={bodyP}>
          <Pen d={roughPath('M880 430 L880 340 A80 80 0 0 1 1040 340 L1040 430', 41)} p={bodyP} color={C.ink} w={12} />
        </g>

        {/* Lock Body */}
        <Card x={820} y={420} w={280} h={240} p={bodyP} fill={shacklePop > 0.6 ? C.hi : C.card} stroke={shacklePop > 0.6 ? C.orange : C.ink} seed={52}>
          {/* Keyhole */}
          <circle cx={960} cy={510} r={18} fill={C.ink} />
          <Pen d={roughLine([[960, 520], [960, 570]], 53)} p={bodyP} color={C.ink} w={8} />
        </Card>

        {/* Unlock sparks */}
        {sparkP > 0.1 && (
          <g opacity={sparkP}>
            <Pen d={roughLine([[800, 390], [740, 360]], 61)} p={sparkP} color={C.orange} w={6} />
            <Pen d={roughLine([[1120, 390], [1180, 360]], 62)} p={sparkP} color={C.orange} w={6} />
            <Pen d={roughLine([[960, 260], [960, 210]], 63)} p={sparkP} color={C.orange} w={6} />
          </g>
        )}
      </g>

      {/* Open Source Label Badge */}
      <Card x={640} y={760} w={640} h={100} p={badgeP} fill={C.card} stroke={C.orange} seed={71}>
        <T x={960} y={824} size={42} anchor="middle" heavy color={C.orange} p={badgeP} id="c03-badge">{label}</T>
      </Card>
    </Stage>
  );
};

