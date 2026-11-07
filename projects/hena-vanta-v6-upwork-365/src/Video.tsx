import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Background} from './hena-vanta/components';
import {SceneData, SceneView} from './SceneView';

export type TimelineV6 = {
  meta: {
    title: string;
    fps: number;
    width: number;
    height: number;
    durationSec: number;
    voiceover: string;
    background: string;
    timingFile?: string;
    checkpoint?: number;
  };
  scenes: SceneData[];
};

export const HenaVanta: React.FC<{
  timeline: TimelineV6;
  qaMode?: 'bgOnly';
}> = ({timeline, qaMode}) => {
  const {meta, scenes} = timeline;
  const fps = meta.fps;

  return (
    <AbsoluteFill style={{backgroundColor: '#FFFFFF'}}>
      <Background src={meta.background ?? 'hena-vanta/bg.mp4'} />

      {qaMode === 'bgOnly'
        ? null
        : scenes.map((s, i) => {
            const from = Math.round(s.start * fps);
            const to = Math.round(s.end * fps);
            const dur = Math.max(1, to - from);
            return (
              <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
                <SceneView scene={s} fps={fps} index={i} />
              </Sequence>
            );
          })}

      {qaMode === 'bgOnly' ? null : (
        <Audio src={staticFile(meta.voiceover ?? 'audio.wav')} />
      )}
    </AbsoluteFill>
  );
};

