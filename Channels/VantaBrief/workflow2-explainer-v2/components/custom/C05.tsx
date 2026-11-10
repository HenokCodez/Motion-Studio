import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, C, SAFE, EASE, prog, roughEllipse, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C05.json';
export const DURATION = meta.duration;

export const C05: React.FC<{stat?: string; label?: string; note?: string}> = ({
  stat = '80%',
  label = 'Gross Profit Margin',
  note = '$38/hr Rev vs $8/hr Cost'
}) => {
  const f = useCurrentFrame();
  const dialP = prog(f, 6, 26, EASE.out);
  const needleP = prog(f, 22, 48, EASE.back);
  const textP = prog(f, 32, 54, EASE.out);
  const noteP = prog(f, 46, 68, EASE.out);

  // Needle angle sweeps from -140 deg to 30 deg (approx 80% on a 180-deg arc)
  const needleAngle = -140 + 170 * needleP;
  const rad = (needleAngle * Math.PI) / 180;
  const nx = 960 + 170 * Math.cos(rad);
  const ny = 480 + 170 * Math.sin(rad);

  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={prog(f, 2, 18, EASE.out)} id="c05-title">Unmatched Margins</T>

      {/* Semicircular dial track */}
      <g opacity={dialP}>
        {/* Outer Arc */}
        <path d="M 660 520 A 300 300 0 0 1 1260 520" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
        {/* Orange highlight sector for top 80% */}
        <path d="M 1050 225 A 300 300 0 0 1 1240 440" fill="none" stroke={C.orange} strokeWidth={14} strokeLinecap="round" />
        
        {/* Ticks */}
        {[-140, -100, -60, -20, 20].map((deg, i) => {
          const r0 = 270, r1 = 300;
          const th = (deg * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={960 + r0 * Math.cos(th)}
              y1={520 + r0 * Math.sin(th)}
              x2={960 + r1 * Math.cos(th)}
              y2={520 + r1 * Math.sin(th)}
              stroke={i >= 3 ? C.orange : C.ink}
              strokeWidth={4}
            />
          );
        })}
      </g>

      {/* Big stat number in arch */}
      <T x={960} y={430} size={110} anchor="middle" heavy color={C.orange} p={textP} id="c05-stat">{stat}</T>

      {/* Needle */}
      <g opacity={needleP}>
        <line x1={960} y1={520} x2={nx} y2={ny} stroke={C.orange} strokeWidth={8} strokeLinecap="round" />
        <circle cx={960} cy={520} r={16} fill={C.card} stroke={C.orange} strokeWidth={5} />
      </g>

      <T x={960} y={640} size={44} anchor="middle" heavy p={textP} id="c05-lbl">{label}</T>

      {/* Bottom comparison note card */}
      <Card x={600} y={730} w={720} h={100} p={noteP} fill={C.card} stroke={C.ink} seed={95}>
        <T x={960} y={794} size={36} anchor="middle" heavy color={C.ink} p={noteP} id="c05-note">{note}</T>
      </Card>
    </Stage>
  );
};

