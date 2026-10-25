import React from 'react';
import { Composition } from 'remotion';
import { Explainer } from './Video';
// @ts-ignore
import plan from '../plan.json';

export const Root: React.FC = () => (
  <Composition id="Explainer" component={Explainer} durationInFrames={(plan as any).meta.totalFrames}
    fps={(plan as any).meta.fps} width={(plan as any).meta.width} height={(plan as any).meta.height} />
);
