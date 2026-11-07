import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {blurOut, drift, softIn} from '../motion';

/**
 * Wrap every scene. Applies camera drift and the blur hand-off.
 * durationInFrames = this scene's length INCLUDING the 6 f overlap with the next scene.
 * Put it inside a <Sequence from={..} durationInFrames={..}>.
 */
export const Scene: React.FC<{
  duration: number;
  seed: number;
  /** hand-in: 'blur' (default) or 'none' when the previous scene's container persists */
  enter?: 'blur' | 'none';
  exit?: 'blur' | 'none';
  children: React.ReactNode;
}> = ({duration, seed, enter = 'blur', exit = 'blur', children}) => {
  const frame = useCurrentFrame();
  const inStyle = enter === 'blur' ? softIn(frame, 0, 8) : {};
  const outStyle = exit === 'blur' ? blurOut(frame, duration - 8, 8) : {};
  return (
    <AbsoluteFill style={{...drift(frame, duration, seed)}}>
      <AbsoluteFill style={{...inStyle, ...outStyle, alignItems: 'center', justifyContent: 'center'}}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
