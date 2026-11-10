import React from 'react';
import {useCurrentFrame, Stage, Card, Pen, T, Icon, C, SAFE, EASE, prog, roughRect, roughLine, plainLine} from '../primitives';
import meta from '../animations/meta/C08.json';
export const DURATION = meta.duration;

export const C08: React.FC<{title?: string; count?: string; sub?: string}> = ({
  title = 'Vision Reasoning Test',
  count = '130+ Pastries',
  sub = 'Spatial Occlusion & Counting'
}) => {
  const f = useCurrentFrame();
  const titleP = prog(f, 2, 18, EASE.out);
  const frameP = prog(f, 6, 26, EASE.out);
  const scanY = 280 + ((f * 12) % 400); // laser scanline sweeps down
  const countP = prog(f, 40, 64, EASE.out);

  // 4 items on the bakery counter
  const items = [
    {x: 420, y: 380, label: '#01 Croissant'},
    {x: 740, y: 440, label: '#42 Tartlet'},
    {x: 1060, y: 380, label: '#89 Brioche'},
    {x: 1380, y: 450, label: '#130 Occluded'}
  ];

  return (
    <Stage>
      <T x={960} y={160} size={54} anchor="middle" heavy p={titleP} id="c08-title">{title}</T>

      {/* Main counter viewing frame */}
      <Card x={320} y={230} w={1280} h={520} p={frameP} fill={C.card} stroke={C.ink} seed={33}>
        {/* Horizontal Laser Scanning Line */}
        <line x1={340} y1={scanY} x2={1580} y2={scanY} stroke={C.orange} strokeWidth={3} opacity={0.8} />

        {/* 4 Items with Bounding Boxes */}
        {items.map((it, i) => {
          const itemP = prog(f, 16 + i * 8, 32 + i * 8, EASE.back);
          const boxD = roughRect(it.x - 90, it.y - 70, 180, 140, i + 101);
          return (
            <g key={i} opacity={itemP}>
              {/* Item Silhouette Card */}
              <rect x={it.x - 70} y={it.y - 50} width={140} height={100} rx={12} fill="#2E2A2B" />
              {/* Bounding Box */}
              <Pen d={boxD} p={itemP} color={i === 3 ? C.orange : C.ink} w={3} />
              {/* Tag pill */}
              <rect x={it.x - 85} y={it.y - 88} width={170} height={32} rx={6} fill={i === 3 ? C.orange : C.card} stroke={C.ink} strokeWidth={2} />
              <T x={it.x} y={it.y - 64} size={24} anchor="middle" heavy color={i === 3 ? C.card : C.ink} p={itemP} id={`c08-tag-${i}`}>
                {it.label}
              </T>
            </g>
          );
        })}
      </Card>

      {/* Hero Detection Result Count Pill */}
      <Card x={640} y={790} w={640} h={100} p={countP} fill={C.hi} stroke={C.orange} seed={109}>
        <T x={960} y={854} size={44} anchor="middle" heavy color={C.orange} p={countP} id="c08-count">{count}</T>
      </Card>

      <T x={960} y={930} size={32} anchor="middle" p={countP} id="c08-sub">{sub}</T>
    </Stage>
  );
};
