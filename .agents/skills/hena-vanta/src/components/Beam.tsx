import React from 'react';
import {useCurrentFrame} from 'remotion';
import {HV} from '../tokens';
import {popIn} from '../motion';

/** A04 spotlight cone. Children = <WordSync mode="stack" /> placed inside. */
export const Beam: React.FC<{start: number; color?: string; children?: React.ReactNode}> = ({start, color = HV.green, children}) => {
  const frame = useCurrentFrame();
  const sweep = Math.sin(frame / 18) * 6; // deg
  return (
    <div style={{position: 'relative', width: 900, height: 700}}>
      <div style={{...popIn(frame, start), position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 120, bottom: 90, width: 640, height: 420, transformOrigin: '0% 100%',
          transform: `rotate(${-32 + sweep}deg)`, clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
          background: `linear-gradient(to right, ${color}59, ${color}00)`}} />
        <div style={{position: 'absolute', left: 102, bottom: 72, width: 36, height: 36, borderRadius: 99, background: color,
          boxShadow: `0 0 0 10px ${color}40`}} />
      </div>
      <div style={{position: 'absolute', left: 300, top: 200}}>{children}</div>
    </div>
  );
};
