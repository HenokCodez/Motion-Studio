import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT, HV} from '../tokens';
import {softIn} from '../motion';

/** A11 window: persistent container. Put dark screenshots INSIDE so the page stays white. */
export const Window: React.FC<{
  title?: string;
  width?: number;
  height?: number;
  start?: number;
  children?: React.ReactNode;
  scale?: number;
  originX?: string; // transform origin for push-ins (A14/A32)
  originY?: string;
}> = ({title, width = 1100, height = 620, start = 0, children, scale = 1, originX = '50%', originY = '50%'}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{...softIn(frame, start, 14), width, height, background: '#fff', borderRadius: 18, overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: `1px solid ${HV.line}`, position: 'relative'}}>
      <div style={{height: 24, background: HV.grey, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px'}}>
        {[HV.red, HV.amber, HV.green].map((c) => <span key={c} style={{width: 10, height: 10, borderRadius: 99, background: c}} />)}
      </div>
      <div style={{position: 'absolute', inset: '24px 0 0 0', overflow: 'hidden'}}>
        <div style={{width: '100%', height: '100%', transform: `scale(${scale})`, transformOrigin: `${originX} ${originY}`}}>
          {title && <div style={{fontFamily: FONT, fontSize: 34, fontWeight: 500, color: HV.ink, padding: '24px 40px'}}>{title}</div>}
          {children}
        </div>
      </div>
    </div>
  );
};
