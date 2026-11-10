import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, prog, roughRect, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C10.json';
export const DURATION = meta.duration;

export const C10: React.FC<{reader?: string; writer?: string; saving?: string}> = ({
  reader = 'Bottom: Reader (50%)',
  writer = 'Top: Writer (50%)',
  saving = '50% Compute Saved'
}) => {
  const f = useCurrentFrame();
  const titleP = prog(f, 2, 18, EASE.out);
  const bottomP = prog(f, 6, 26, EASE.out);
  const topP = prog(f, 18, 38, EASE.out);
  const arrowP = prog(f, 30, 50, EASE.out);
  const saveP = prog(f, 42, 64, EASE.back);

  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={titleP} id="c10-title">Causal Split Architecture</T>

      {/* Top Writer Deck */}
      <Card x={440} y={240} w={1040} h={180} p={topP} fill={C.card} stroke={C.ink} seed={55}>
        <T x={960} y={320} size={42} anchor="middle" heavy p={topP} id="c10-writer">{writer}</T>
        <T x={960} y={370} size={28} anchor="middle" p={topP} id="c10-wdesc">Dedicated generation layers</T>
      </Card>

      {/* Causal Bridge Arrow from Reader to Writer */}
      <g opacity={arrowP}>
        <Arrow x1={960} y1={500} x2={960} y2={430} p={arrowP} color={C.orange} w={6} />
        <T x={1080} y={470} size={28} color={C.orange} p={arrowP} id="c10-bridge">Causal Bridge</T>
      </g>

      {/* Bottom Reader Deck (Highlighted) */}
      <Card x={440} y={510} w={1040} h={180} p={bottomP} fill={C.hi} stroke={C.orange} seed={56}>
        <T x={960} y={590} size={42} anchor="middle" heavy color={C.orange} p={bottomP} id="c10-reader">{reader}</T>
        <T x={960} y={640} size={28} anchor="middle" color={C.ink} p={bottomP} id="c10-rdesc">Prompt runs ONLY through reader</T>
      </Card>

      {/* Prompt In Arrow */}
      <g opacity={bottomP}>
        <Arrow x1={220} y1={600} x2={430} y2={600} p={bottomP} color={C.orange} w={6} />
        <T x={320} y={570} size={28} anchor="middle" heavy color={C.orange} p={bottomP} id="c10-pin">Prompt In</T>
      </g>

      {/* Compute Saving Hero Badge */}
      <Card x={640} y={740} w={640} h={90} p={saveP} fill={C.card} stroke={C.orange} seed={57}>
        <T x={960} y={798} size={40} anchor="middle" heavy color={C.orange} p={saveP} id="c10-save">{saving}</T>
      </Card>

      <T x={960} y={880} size={32} anchor="middle" p={saveP} id="c10-foot">Halves Reading Compute Before Server Sweats</T>
    </Stage>
  );
};

