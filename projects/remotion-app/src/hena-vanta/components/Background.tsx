import React from 'react';
import {AbsoluteFill, Video, staticFile} from 'remotion';

/** Supplied white-grid loop (copy D:\Youtube\Hena Vanta\Branding\Bg -> public/hena-vanta/bg.mp4). Muted, looped. */
export const Background: React.FC<{src?: string}> = ({src = 'hena-vanta/bg.mp4'}) => (
  <AbsoluteFill style={{backgroundColor: '#FFFFFF'}}>
    <Video src={staticFile(src)} loop muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
  </AbsoluteFill>
);
