import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {GridBackground} from './GridBackground';
import {Watermark} from './Watermark';
import {BigStatCaption, BulletsCaption, WordsCaption} from './Caption';
import {CAPTION_CENTERED, MediaSwitch} from './media';
import {MP} from './hooks';
import {COLORS, WF3_PUBLIC, ZONES} from './theme';
import {Scene, Storyboard} from './types';

const keyOf = (s: Scene) => s.mediaKey ?? JSON.stringify(s.media);

const SceneView: React.FC<{scene: Scene; mp: MP}> = ({scene, mp}) => {
  const cy = CAPTION_CENTERED.includes(scene.media.type) ? ZONES.captionNoMediaCy : ZONES.captionMediaCy;
  const c = scene.caption;
  return (
    <AbsoluteFill>
      <MediaSwitch media={scene.media} mp={mp} />
      {c.mode === 'WORDS' && <WordsCaption words={c.words} sceneStart={scene.start} cy={cy} durationInFrames={mp.durationInFrames} />}
      {c.mode === 'BULLETS' && <BulletsCaption icon={c.icon} items={c.items} sceneStart={scene.start} durationInFrames={mp.durationInFrames} />}
      {c.mode === 'BIG_STAT' && <BigStatCaption words={c.words} stat={c.stat} statAt={c.statAt} sceneStart={scene.start} durationInFrames={mp.durationInFrames} />}
    </AbsoluteFill>
  );
};

export const Workflow3Short: React.FC<Storyboard> = ({meta, scenes}) => {
  const fps = meta.fps;
  const frames = scenes.map((s) => ({from: Math.round(s.start * fps), to: Math.round(s.end * fps)}));
  // runs of consecutive scenes sharing the same media key
  const runs = scenes.map((s, i) => {
    let a = i, b = i;
    while (a > 0 && keyOf(scenes[a - 1]) === keyOf(s)) a--;
    while (b < scenes.length - 1 && keyOf(scenes[b + 1]) === keyOf(s)) b++;
    return {start: frames[a].from, end: frames[b].to};
  });
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <GridBackground mode={meta.grid} />
      {scenes.map((s, i) => {
        const mp: MP = {
          durationInFrames: frames[i].to - frames[i].from,
          startFrame: frames[i].from,
          runStart: runs[i].start,
          runEnd: runs[i].end,
          skipEntry: frames[i].from > runs[i].start,
          skipExit: frames[i].to < runs[i].end,
        };
        return (
          <Sequence key={s.id} from={frames[i].from} durationInFrames={mp.durationInFrames}>
            <SceneView scene={s} mp={mp} />
          </Sequence>
        );
      })}
      <Watermark text={meta.brand} />
      {meta.audio && <Audio src={staticFile(`${WF3_PUBLIC}${meta.audio.replace(/^\/+/, '')}`)} />}
    </AbsoluteFill>
  );
};

export const Short = Workflow3Short;
