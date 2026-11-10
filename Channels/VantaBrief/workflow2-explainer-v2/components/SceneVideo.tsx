import React from 'react';
import {AbsoluteFill, Audio, Loop, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {registry} from './animations';
import {customRegistry} from './custom';
import {BgMode, TimeCtx} from './primitives';
const GRID_FRAMES = 1194; // Grid_1.mp4 = 39.8s @30fps (measured)
type Anim = {id: string; params?: any; delay?: number; speed?: number};
type Scene = {id: string; start: number; end: number; animations: Anim[]};
/** pacing: 'auto' (default, v2.1) stretches each animation so it finishes at ~75% of its slot (never faster than 1x, never slower than 0.45x) and holds the finished picture; 'legacy' = v2.0 behaviour.
 *  Per-animation `delay` (seconds, from narration word timestamps) postpones its start; per-animation `speed` (<=1) overrides auto. */
export type Plan = {fps?: number; audio?: string; pacing?: 'auto' | 'legacy'; scenes: Scene[]};
/** Plan -> video. Grid_1.mp4 loops underneath; scene Stages are transparent. Each scene splits its time evenly across its animations. */
export const SceneVideo: React.FC<{plan: Plan}> = ({plan}) => {
  const fps = plan.fps || 30; const all = [...registry, ...customRegistry]; const byId: any = Object.fromEntries(all.map(r => [r.meta.id, r]));
  return <AbsoluteFill style={{background: '#0B0B0B'}}>
    <Loop durationInFrames={GRID_FRAMES}><OffthreadVideo src={staticFile('bg/Grid_1.mp4')} style={{width: 1920, height: 1080}} /></Loop>
    {plan.audio && <Audio src={staticFile(plan.audio)} />}
    <BgMode.Provider value="none">{plan.scenes.flatMap(sc => {
      const from = Math.round(sc.start * fps), total = Math.round((sc.end - sc.start) * fps), n = sc.animations.length, each = Math.floor(total / n);
      return sc.animations.map((a, i) => { const R = byId[a.id]; if (!R) throw new Error(`Unknown animation ${a.id} in scene ${sc.id}`);
        const slot = i === n - 1 ? total - each * (n - 1) : each; const animSec = R.meta.duration / 30, slotSec = slot / fps;
        const auto = plan.pacing === 'legacy' ? 1 : Math.max(0.45, Math.min(1, animSec / Math.max(0.1, slotSec * 0.75)));
        const speed = Math.min(1, a.speed ?? auto), delay = Math.round((a.delay || 0) * fps); const C = R.Component;
        return <Sequence key={sc.id + i} from={from + i * each} durationInFrames={slot}><TimeCtx.Provider value={{speed, delay}}><C {...(a.params || {})} /></TimeCtx.Provider></Sequence>; });
    })}</BgMode.Provider>
  </AbsoluteFill>;
};
