import React from 'react';
import {Composition} from 'remotion';
import {HenaVanta, TimelineV6} from './Video';
import timelineJson from './timeline.v6.json';

const timeline = timelineJson as unknown as TimelineV6;

export const Root: React.FC = () => {
  const fps = timeline.meta.fps || 30;
  const durationInFrames = Math.max(1, Math.round(timeline.meta.durationSec * fps));

  return (
    <Composition
      id="HenaVanta"
      component={HenaVanta}
      defaultProps={{timeline}}
      durationInFrames={durationInFrames}
      fps={fps}
      width={timeline.meta.width || 1920}
      height={timeline.meta.height || 1080}
    />
  );
};

