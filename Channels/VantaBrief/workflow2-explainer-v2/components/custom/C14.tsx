import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, C, SAFE, EASE, prog, roughRect, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C14.json';
export const DURATION = meta.duration;

export const C14: React.FC<{title?: string; chipA?: string; chipB?: string; skipped?: string}> = ({
  title = 'Hardware Independence',
  chipA = 'NVIDIA Blackwell',
  chipB = 'Huawei Ascend 950',
  skipped = 'Hopper H100 (Bypassed)'
}) => {
  const f = useCurrentFrame();
  const titleP = prog(f, 2, 18, EASE.out);
  const cardAP = prog(f, 6, 26, EASE.out);
  const cardBP = prog(f, 16, 36, EASE.out);
  const strikeP = prog(f, 32, 54, EASE.back);
  const subP = prog(f, 44, 66, EASE.out);

  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={titleP} id="c14-title">{title}</T>

      {/* Chip A: NVIDIA Blackwell */}
      <Card x={380} y={240} w={540} h={400} p={cardAP} fill={C.card} stroke={C.ink} seed={71}>
        <g transform="translate(650, 360)">
          <Icon name="chip" x={0} y={0} size={84} color={C.ink} />
        </g>
        <T x={650} y={490} size={40} anchor="middle" heavy p={cardAP} id="c14-ca">{chipA}</T>
        <T x={650} y={550} size={28} anchor="middle" color={C.orange} p={cardAP} id="c14-cadesc">Next-Gen Architecture</T>
      </Card>

      {/* Chip B: Huawei Ascend */}
      <Card x={1000} y={240} w={540} h={400} p={cardBP} fill={C.hi} stroke={C.orange} seed={72}>
        <g transform="translate(1270, 360)">
          <Icon name="chip" x={0} y={0} size={84} color={C.orange} />
        </g>
        <T x={1270} y={490} size={40} anchor="middle" heavy color={C.orange} p={cardBP} id="c14-cb">{chipB}</T>
        <T x={1270} y={550} size={28} anchor="middle" color={C.ink} p={cardBP} id="c14-cbdesc">Domestic Silicon First-Class</T>
      </Card>

      {/* Bottom Bypassed Generation Card with Orange Strike-Through */}
      <g opacity={strikeP}>
        <Card x={560} y={690} w={800} h={110} p={strikeP} fill={C.card} stroke={C.ink} seed={73}>
          <T x={960} y={758} size={36} anchor="middle" heavy color={C.ink} opacity={0.5} p={strikeP} id="c14-skip">
            {skipped}
          </T>
          {/* Orange Strike-through Line */}
          <Pen d={roughLine([[620, 750], [1300, 750]], 74)} p={strikeP} color={C.orange} w={8} />
        </Card>
      </g>

      <T x={960} y={870} size={34} anchor="middle" heavy p={subP} id="c14-foot">Frontier AI Completely Independent of US Trade Curbs</T>
    </Stage>
  );
};

