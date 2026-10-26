import React from 'react';
import {Composition} from 'remotion';
import {Short} from './Short';
import {Storyboard} from './types';
import {FPS, H, W} from './theme';
import storyboardJson from '../storyboard.json';

const storyboard = storyboardJson as unknown as Storyboard;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Short"
    component={Short}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={Math.round(storyboard.meta.durationSec * FPS)}
    defaultProps={storyboard}
    calculateMetadata={({props}: {props: Storyboard}) => ({durationInFrames: Math.round(props.meta.durationSec * FPS), props})}
  />
);
