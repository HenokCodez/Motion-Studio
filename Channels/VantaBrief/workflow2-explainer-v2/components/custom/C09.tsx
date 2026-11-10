import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, Arrow, C, SAFE, EASE, prog, roughRect, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C09.json';
export const DURATION = meta.duration;

export const C09: React.FC<{title?: string; base?: string; turbo?: string}> = ({
  title = 'Inference Throughput',
  base = '150 T/S',
  turbo = '800 T/S'
}) => {
  const f = useCurrentFrame();
  const titleP = prog(f, 2, 18, EASE.out);
  const card1P = prog(f, 6, 26, EASE.out);
  const card2P = prog(f, 22, 44, EASE.back);
  const bridgeP = prog(f, 34, 54, EASE.out);

  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={titleP} id="c09-title">{title}</T>

      {/* Left Card: Base Output */}
      <Card x={360} y={260} w={480} h={440} p={card1P} fill={C.card} stroke={C.ink} seed={44}>
        <T x={600} y={340} size={38} anchor="middle" p={card1P} id="c09-lbl1">Standard Run</T>
        <T x={600} y={480} size={90} anchor="middle" heavy p={card1P} id="c09-val1">{base}</T>
        <T x={600} y={580} size={30} anchor="middle" p={card1P} id="c09-sub1">Pure Generation</T>
      </Card>

      {/* Acceleration Arrow / Boost Badge */}
      <g opacity={bridgeP}>
        <Arrow x1={860} y1={480} x2={1060} y2={480} p={bridgeP} color={C.orange} w={6} />
        <Card x={890} y={390} w={140} h={60} p={bridgeP} fill={C.card} stroke={C.orange} seed={48}>
          <T x={960} y={432} size={28} anchor="middle" heavy color={C.orange} p={bridgeP} id="c09-boost">5x BOOST</T>
        </Card>
      </g>

      {/* Right Card: Turbo Cloud Output */}
      <Card x={1080} y={260} w={480} h={440} p={card2P} fill={C.hi} stroke={C.orange} seed={45}>
        <T x={1320} y={340} size={38} anchor="middle" heavy color={C.orange} p={card2P} id="c09-lbl2">Cloud Turbo</T>
        <T x={1320} y={480} size={90} anchor="middle" heavy color={C.orange} p={card2P} id="c09-val2">{turbo}</T>
        <T x={1320} y={580} size={30} anchor="middle" color={C.ink} p={card2P} id="c09-sub2">Optimized Clusters</T>
      </Card>

      <T x={960} y={820} size={38} anchor="middle" heavy p={prog(f, 38, 58, EASE.out)} id="c09-foot">Fast, Cheap & Near Frontier Intelligence</T>
    </Stage>
  );
};

