import React from 'react';
import {Composition} from 'remotion';
import {Workflow3Short} from './Short';
import {Storyboard} from './types';
import {FPS, H, W} from './theme';
import storyboardJson from './storyboard.json';

const storyboard = storyboardJson as unknown as Storyboard;

export const Workflow3Root: React.FC = () => (
  <Composition
    id="Workflow3Short"
    component={Workflow3Short}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={Math.round(storyboard.meta.durationSec * FPS)}
    defaultProps={storyboard}
    calculateMetadata={({props}: {props: Storyboard}) => ({
      durationInFrames: Math.round((props?.meta?.durationSec || storyboard.meta.durationSec) * (props?.meta?.fps || FPS)),
      props: props || storyboard,
    })}
  />
);

export const RemotionRoot = Workflow3Root;
