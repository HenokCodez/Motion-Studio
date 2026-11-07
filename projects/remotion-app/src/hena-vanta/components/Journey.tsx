import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {FONT, HV} from '../tokens';
import {popIn, riseIn, softIn} from '../motion';

export type JourneyEvent = {label: string; note: string};

/**
 * A53 master journey. ONE persistent object across scenes.
 * Render it in each event scene with activeIndex = that scene's event; `extendAt` = frame (in that scene) the line starts extending.
 * NEVER pass events beyond activeIndex (future events must not exist yet). `reveal` shows all (verdict scene only).
 */
export const Journey: React.FC<{
  events: JourneyEvent[]; // full list is fine: only 0..activeIndex are rendered unless reveal
  activeIndex: number;
  extendAt: number;
  reveal?: boolean;
}> = ({events, activeIndex, extendAt, reveal = false}) => {
  const frame = useCurrentFrame();
  const gap = 360;
  const n = reveal ? events.length : activeIndex + 1;
  const ext = interpolate(frame, [extendAt, extendAt + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const lastX = (n - 1) * gap;
  const prevX = Math.max(0, (n - 2) * gap);
  const tipX = reveal ? lastX : prevX + (lastX - prevX) * (activeIndex === 0 ? 1 : ext);
  const scale = reveal ? Math.min(1, 1500 / Math.max(1, lastX + 300)) : 1;
  const cam = reveal ? -lastX / 2 : -tipX; // centre the active tip (or whole journey on reveal)
  return (
    <div style={{position: 'absolute', left: 960, top: 540, transform: `scale(${scale})`}}>
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translateX(${cam}px)`}}>
        <div style={{position: 'absolute', left: 0, top: -2, width: tipX, height: 4, background: HV.ink, borderRadius: 2}} />
        {events.slice(0, n).map((e, i) => {
          const isActive = !reveal && i === activeIndex;
          const appear = i === activeIndex && !reveal ? extendAt + (activeIndex === 0 ? 0 : 18) : 0;
          const x = i * gap;
          const past = !reveal && i < activeIndex;
          return (
            <div key={i} style={{position: 'absolute', left: x, top: 0, width: 0}}>
              <div style={{...(i === activeIndex && !reveal ? popIn(frame, appear) : {}), position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: 99,
                background: isActive ? HV.blue : HV.ink, boxShadow: isActive ? `0 0 0 8px ${HV.blue}33` : 'none'}} />
              <div style={{...(i === activeIndex && !reveal ? riseIn(frame, appear + 2, 24, 14) : {}), position: 'absolute', bottom: 34, left: -170, width: 340, textAlign: 'center',
                fontFamily: FONT, fontSize: 40, fontWeight: 700, color: HV.ink, opacity: past ? 0.6 : undefined}}>{e.label}</div>
              <div style={{...(i === activeIndex && !reveal ? softIn(frame, appear + 8, 12) : {}), position: 'absolute', top: 34, left: -170, width: 340, textAlign: 'center',
                fontFamily: FONT, fontSize: 24, fontWeight: 400, color: HV.mute}}>{e.note}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
