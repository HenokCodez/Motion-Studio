import React from 'react';
import {AbsoluteFill, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {COLORS, H, W, WF3_PUBLIC} from './theme';
import {clamp} from './hooks';

// public/workflow3/grid_vertical.mp4 = the user's Grid_1.mp4 rotated to 1080x1920 (1195 frames).
const LOOP = 1190; // frames per loop
const XF = 36; // cross-fade frames at the loop seam (hides the jump)

const Vid: React.FC = () => (
  <OffthreadVideo
    src={staticFile(`${WF3_PUBLIC}grid_vertical.mp4`)}
    muted
    style={{width: '100%', height: '100%', objectFit: 'cover'}}
  />
);

const VideoGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const p = frame % LOOP;
  const d = Math.min(p, LOOP - p); // distance to nearest seam of layer A
  const aOpacity = interpolate(d, [0, XF], [0, 1], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* layer B: same loop, shifted by half a loop -> is mid-clip while A is at its seam */}
      <Sequence from={-Math.floor(LOOP / 2)}>
        <Loop durationInFrames={LOOP}>
          <Vid />
        </Loop>
      </Sequence>
      <AbsoluteFill style={{opacity: aOpacity}}>
        <Loop durationInFrames={LOOP}>
          <Vid />
        </Loop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Fallback (no video file needed): wavy dark grid + soft drifting glow.
const ProceduralGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const cell = 160;
  const wob = (x: number, y: number) => 7 * Math.sin(y / 240 + t * 0.55 + x / 210) + 4 * Math.sin(x / 130 - t * 0.4);
  const vPaths: string[] = [];
  for (let x = 0; x <= W + cell; x += cell) {
    let d = '';
    for (let y = 0; y <= H; y += 40) d += `${y === 0 ? 'M' : 'L'}${(x + wob(x, y)).toFixed(1)},${y} `;
    vPaths.push(d);
  }
  const hPaths: string[] = [];
  for (let y = 0; y <= H + cell; y += cell) {
    let d = '';
    for (let x = 0; x <= W; x += 40) d += `${x === 0 ? 'M' : 'L'}${x},${(y + wob(y, x)).toFixed(1)} `;
    hPaths.push(d);
  }
  const gx = 540 + 110 * Math.sin(t * 0.22);
  const gy = 900 + 150 * Math.cos(t * 0.17);
  const all = [...vPaths, ...hPaths];
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <radialGradient id="glow" cx={gx} cy={gy} r={640} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mk" cx={gx} cy={gy} r={560} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="m">
            <rect width={W} height={H} fill="url(#mk)" />
          </mask>
        </defs>
        <rect width={W} height={H} fill="url(#glow)" />
        <g stroke="rgba(255,255,255,0.10)" strokeWidth={2} fill="none">
          {all.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g stroke="rgba(255,255,255,0.26)" strokeWidth={2.4} fill="none" mask="url(#m)">
          {all.map((d, i) => <path key={i} d={d} />)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const GridBackground: React.FC<{mode: 'video' | 'procedural'}> = ({mode}) =>
  mode === 'procedural' ? <ProceduralGrid /> : <VideoGrid />;
