import React from 'react';
import {useCurrentFrame} from 'remotion';
import {HV} from '../tokens';
import {clickPulse, cursorAt} from '../motion';

/** Hand cursor (UI interaction only). Move with from/to + start/dur; click at `clickAt`. */
export const Cursor: React.FC<{
  from: [number, number];
  to: [number, number];
  start: number;
  dur?: number;
  clickAt?: number;
}> = ({from, to, start, dur = 24, clickAt}) => {
  const frame = useCurrentFrame();
  const {x, y} = cursorAt(frame, start, dur, from, to);
  const c = clickAt !== undefined ? clickPulse(frame, clickAt) : 0;
  return (
    <svg width={44} height={52} viewBox="0 0 22 26"
      style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - 0.12 * c})`, transformOrigin: '4px 2px', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.25))'}}>
      <path d="M5 1.5c1 0 1.6.7 1.6 1.7v6.2l.5-.2c.8-.3 1.8 0 2 .9.9-.4 2-.1 2.3.9 1-.3 2 .1 2.3 1.1l.2 5.6c0 2.4-1.6 4.1-4 4.1H9c-1.5 0-2.4-.6-3.3-1.8L2.2 15c-.5-.8 0-1.8.9-1.9.5 0 .9.2 1.3.6l.6.7V3.2C5 2.2 4.4 1.5 5 1.5z"
        fill="#fff" stroke={HV.ink} strokeWidth={1.2} strokeLinejoin="round" />
    </svg>
  );
};
