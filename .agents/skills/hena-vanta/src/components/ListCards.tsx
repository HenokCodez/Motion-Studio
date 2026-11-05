import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT, HV} from '../tokens';
import {focusDim, popIn, riseIn} from '../motion';

export type ListItem = {label: string; color: string; at: number /* spoken frame */};

/** A08/A09. Items appear ONLY at their spoken frame. `active` + `focusAt` triggers A09 focus-dim. */
export const ListCards: React.FC<{
  heading?: string;
  items: ListItem[];
  active?: number;
  focusAt?: number;
  start?: number;
}> = ({heading, items, active, focusAt, start = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{width: 560, fontFamily: FONT}}>
      {heading && <div style={{fontSize: 34, fontWeight: 600, color: HV.ink, marginBottom: 18, ...riseIn(frame, start, 20, 12)}}>{heading}</div>}
      {items.map((it, i) => {
        const dim = active !== undefined && focusAt !== undefined ? focusDim(frame, focusAt, i === active) : {};
        return (
          <div key={i} style={{...riseIn(frame, it.at - 3, 40, 14), ...dim, display: 'flex', alignItems: 'center', gap: 18, height: 72,
            padding: '0 20px', marginBottom: 12, background: HV.card, border: `1px solid ${HV.line}`, borderRadius: 18}}>
            <div style={{...popIn(frame, it.at), width: 46, height: 46, borderRadius: 12, background: it.color}} />
            <div style={{fontSize: 26, fontWeight: 600, color: HV.ink}}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};
