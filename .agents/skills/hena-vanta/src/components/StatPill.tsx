import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT, HV} from '../tokens';
import {countUp, drawOn, popIn} from '../motion';

/** A03 stat pill with count-up and rising sparkline. `value` MUST be a number said in the voiceover or sourced. */
export const StatPill: React.FC<{
  value: number;
  start: number;
  prefix?: string;
  suffix?: string;
  tone?: 'blue' | 'green' | 'red';
  sparkline?: boolean;
  from?: number; // count down: set from > value
}> = ({value, start, prefix = '', suffix = '', tone = 'blue', sparkline = true, from = 0}) => {
  const frame = useCurrentFrame();
  const fill = {blue: HV.blue, green: HV.green, red: HV.red}[tone];
  const n = from === 0 ? countUp(frame, start + 4, value) : Math.round(from + (value - from) * Math.min(1, Math.max(0, (frame - start - 4) / 40)) ** 2);
  const p = drawOn(frame, start, 40);
  const pts = [0, 0.18, 0.1, 0.3, 0.22, 0.5, 0.42, 0.75, 0.6, 1].map((v, i) => `${i * 120},${220 - v * 200}`).join(' ');
  return (
    <div style={{position: 'relative', width: 900, height: 320}}>
      {sparkline && (
        <svg width={900} height={320} style={{position: 'absolute', inset: 0, opacity: 0.4, filter: 'blur(2px)'}}>
          <polyline points={pts} fill="none" stroke={HV.green} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </svg>
      )}
      <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)'}}>
        <div style={{...popIn(frame, start), fontFamily: FONT, fontWeight: 800, fontSize: 64, color: '#fff', background: fill,
          borderRadius: 44, padding: '26px 54px', fontVariantNumeric: 'tabular-nums', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', whiteSpace: 'nowrap'}}>
          {prefix}{n.toLocaleString('en-US')}{suffix}
        </div>
      </div>
    </div>
  );
};
