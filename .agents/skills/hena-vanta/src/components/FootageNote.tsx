import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {FONT, HV} from '../tokens';

/**
 * Replaces the old black placeholder. ONE line of 20 px text, centred, nothing else.
 * It does not move, drift, blur or scale, so a centred clip hides it exactly.
 * Place it OUTSIDE <Scene> (no drift) — or pass `slot` to centre it on a framed slot.
 */
export const FootageNote: React.FC<{
  label: string; // "TYPE: what to show"
  slot?: {x: number; y: number}; // centre of the slot in px (default 960, 540)
}> = ({label, slot = {x: 960, y: 540}}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: slot.x,
          top: slot.y,
          transform: 'translate(-50%, -50%)',
          fontFamily: FONT,
          fontSize: 20,
          fontWeight: 500,
          color: HV.mute,
          opacity: o,
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};
