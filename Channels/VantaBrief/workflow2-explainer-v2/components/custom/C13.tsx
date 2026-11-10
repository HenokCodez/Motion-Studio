import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, C, SAFE, EASE, prog, roughRect, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C13.json';
export const DURATION = meta.duration;

export const C13: React.FC<{title?: string; open?: string; closed?: string}> = ({
  title = 'What Was Kept Private',
  open = 'DeepInfer Engine',
  closed = 'Industrial Bakery'
}) => {
  const f = useCurrentFrame();
  const titleP = prog(f, 2, 18, EASE.out);
  const leftP = prog(f, 6, 26, EASE.out);
  const rightP = prog(f, 18, 38, EASE.out);
  const lockP = prog(f, 32, 52, EASE.back);
  const subP = prog(f, 44, 66, EASE.out);

  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={titleP} id="c13-title">{title}</T>

      {/* Left Card: Open Engine */}
      <Card x={340} y={240} w={580} h={520} p={leftP} fill={C.card} stroke={C.ink} seed={61}>
        <T x={630} y={320} size={42} anchor="middle" heavy p={leftP} id="c13-open-t">{open}</T>
        <T x={630} y={370} size={28} anchor="middle" color={C.orange} p={leftP} id="c13-open-tag">PUBLIC ON GITHUB</T>

        <g opacity={leftP}>
          <Pen d={roughLine([[400, 440], [420, 440]], 62)} p={leftP} color={C.orange} w={4} />
          <T x={440} y={448} size={32} p={leftP} id="c13-ob1">Causal Attention Core</T>

          <Pen d={roughLine([[400, 520], [420, 520]], 63)} p={leftP} color={C.orange} w={4} />
          <T x={440} y={528} size={32} p={leftP} id="c13-ob2">Parallel GPU Kernels</T>

          <Pen d={roughLine([[400, 600], [420, 600]], 64)} p={leftP} color={C.orange} w={4} />
          <T x={440} y={608} size={32} p={leftP} id="c13-ob3">Inference Dispatcher</T>
        </g>
      </Card>

      {/* Right Card: Closed Private Infra */}
      <Card x={1000} y={240} w={580} h={520} p={rightP} fill={C.hi} stroke={C.orange} seed={65}>
        <T x={1290} y={320} size={42} anchor="middle" heavy color={C.orange} p={rightP} id="c13-close-t">{closed}</T>
        <T x={1290} y={370} size={28} anchor="middle" color={C.ink} p={rightP} id="c13-close-tag">KEPT PROPRIETARY</T>

        <g opacity={rightP}>
          <Pen d={roughLine([[1060, 440], [1080, 440]], 66)} p={rightP} color={C.orange} w={4} />
          <T x={1100} y={448} size={32} p={rightP} id="c13-cb1">100PB SSD Storage Mesh</T>

          <Pen d={roughLine([[1060, 520], [1080, 520]], 67)} p={rightP} color={C.orange} w={4} />
          <T x={1100} y={528} size={32} p={rightP} id="c13-cb2">Global Load Balancers</T>

          <Pen d={roughLine([[1060, 600], [1080, 600]], 68)} p={rightP} color={C.orange} w={4} />
          <T x={1100} y={608} size={32} p={rightP} id="c13-cb3">Custom Routing Fabrics</T>
        </g>

        {/* Lock Icon Badge */}
        <g opacity={lockP} transform="translate(1480, 270) scale(0.6)">
          <circle cx={50} cy={50} r={42} fill={C.card} stroke={C.orange} strokeWidth={4} />
          <Icon name="lock" x={50} y={50} size={48} color={C.orange} />
        </g>
      </Card>

      <T x={960} y={830} size={36} anchor="middle" heavy p={subP} id="c13-sub">Requires 128 High-End GPUs To Run At Scale</T>
    </Stage>
  );
};

