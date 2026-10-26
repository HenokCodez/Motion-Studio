import React from 'react';
import {COLORS, FONT, ZONES} from './theme';

export const Watermark: React.FC<{text: string}> = ({text}) =>
  text ? (
    <div
      style={{
        position: 'absolute', left: 0, width: 1080, top: ZONES.watermarkCy - 40, height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT, fontWeight: 700, fontSize: 46, letterSpacing: '-0.01em', color: COLORS.watermark,
      }}
    >
      {text}
    </div>
  ) : null;
