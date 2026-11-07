import React from 'react';
import {AbsoluteFill, Audio, Loop, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {registry} from './animations';
import {BgMode} from './primitives';
type Scene = {id: string; start: number; end: number; animations: {id: string; params?: any}[]};
const GRID_FRAMES = 1194; // Grid_1.mp4 = 39.8s @30fps (measured)
export type Plan = {fps?: number; audio?: string; scenes: Scene[]};
/** Plan -> video. Grid_1.mp4 loops underneath; scene Stages are transparent. Each scene splits its time evenly across its animations. */
export const SceneVideo: React.FC<{plan: Plan}> = ({plan}) => {
  const fps = plan.fps || 30; const byId: any = Object.fromEntries(registry.map(r => [r.meta.id, r.Component]));
  return <AbsoluteFill style={{background: '#0B0B0B'}}>
    <Loop durationInFrames={GRID_FRAMES}><OffthreadVideo src={staticFile('bg/Grid_1.mp4')} style={{width: 1920, height: 1080}} /></Loop>
    {plan.audio && <Audio src={staticFile(plan.audio)} />}
    <BgMode.Provider value="none">{plan.scenes.flatMap(sc => {
      const from = Math.round(sc.start * fps), total = Math.round((sc.end - sc.start) * fps), n = sc.animations.length, each = Math.floor(total / n);
      return sc.animations.map((a, i) => { const C = byId[a.id]; if (!C) throw new Error(`Unknown animation ${a.id} in scene ${sc.id}`);
        return <Sequence key={sc.id + i} from={from + i * each} durationInFrames={i === n - 1 ? total - each * (n - 1) : each}><C {...(a.params || {})} /></Sequence>; });
    })}</BgMode.Provider>
  </AbsoluteFill>;
};
