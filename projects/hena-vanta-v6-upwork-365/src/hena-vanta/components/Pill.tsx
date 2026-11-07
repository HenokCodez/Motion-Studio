import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT, HV} from '../tokens';
import {clickPulse, popIn} from '../motion';

/** A30/A31/A54/A59 pill. `pressAt` = frame of the cursor click (pressed look). */
export const Pill: React.FC<{
  label: string;
  tone?: 'blue' | 'red' | 'green' | 'grey' | 'amber' | 'ink';
  start: number;
  pressAt?: number;
  size?: number;
  width?: number;
}> = ({label, tone = 'blue', start, pressAt, size = 64, width}) => {
  const frame = useCurrentFrame();
  const fill = {blue: HV.blue, red: HV.red, green: HV.green, grey: HV.grey, amber: HV.amber, ink: HV.ink}[tone];
  const press = pressAt !== undefined ? clickPulse(frame, pressAt) : 0;
  const pop = popIn(frame, start);
  return (
    <div
      style={{
        ...pop,
        transform: `${pop.transform} scale(${1 - 0.03 * press})`,
        filter: `blur(${1.5 * press}px)`,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        color: tone === 'grey' ? HV.mute : '#fff',
        background: fill,
        padding: `${size * 0.22}px ${size * 0.7}px`,
        borderRadius: 999,
        width,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}
    >
      {label}
    </div>
  );
};
