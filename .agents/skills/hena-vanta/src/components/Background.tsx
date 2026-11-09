import React from 'react';
import {AbsoluteFill, Loop, OffthreadVideo, staticFile, useVideoConfig} from 'remotion';

/** Supplied white-grid loop (copy D:\Youtube\Hena Vanta\Branding\Bg -> public/hena-vanta/bg.mp4). Muted, looped. */
export const Background: React.FC<{src?: string}> = ({src = 'hena-vanta/bg.mp4'}) => {
  const {fps} = useVideoConfig();
  const loopFrames = Math.round(30 * fps);
  return (
    <AbsoluteFill style={{backgroundColor: '#FFFFFF'}}>
      <Loop durationInFrames={loopFrames}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </Loop>
    </AbsoluteFill>
  );
};
