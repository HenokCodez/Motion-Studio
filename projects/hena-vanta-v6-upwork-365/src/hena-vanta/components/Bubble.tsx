import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT, HV, Word} from '../tokens';
import {LEAD, drawOn, popIn, wordPop} from '../motion';

/** A06/A07 iMessage-style bubble. Words land at their spoken frame. strikeLine: index (0-based) of the line to strike. */
export const Bubble: React.FC<{
  words: Word[];
  tone?: 'me' | 'them';
  start: number;
  strikeAt?: number; // frame the strike starts (red line across the first `strikeWords` words)
  strikeWords?: number;
  size?: number;
  maxWidth?: number;
}> = ({words, tone = 'me', start, strikeAt, strikeWords = 0, size = 44, maxWidth = 760}) => {
  const frame = useCurrentFrame();
  const me = tone === 'me';
  const sp = strikeAt !== undefined ? drawOn(frame, strikeAt, 10) : 0;
  return (
    <div style={{...popIn(frame, start), position: 'relative', alignSelf: me ? 'flex-end' : 'flex-start'}}>
      <div style={{background: me ? HV.blue : HV.grey, color: me ? '#fff' : HV.ink, borderRadius: 44,
        padding: '26px 40px', fontFamily: FONT, fontSize: size, fontWeight: 600, maxWidth, lineHeight: 1.2,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)', position: 'relative'}}>
        {words.map((w, i) => (
          <span key={i} style={{display: 'inline-block', marginRight: size * 0.25, fontStyle: w.italic ? 'italic' : 'normal',
            fontWeight: w.italic ? 800 : 600, color: w.color ?? 'inherit', ...wordPop(frame, w.frame - LEAD),
            position: 'relative'}}>
            {w.text}
            {i < strikeWords && sp > 0 && (
              <span style={{position: 'absolute', left: 0, top: '52%', height: 5, width: `${sp * 100}%`, background: HV.red, borderRadius: 3}} />
            )}
          </span>
        ))}
      </div>
      {/* tail */}
      <div style={{position: 'absolute', bottom: 0, [me ? 'right' : 'left']: -6, width: 28, height: 28,
        background: me ? HV.blue : HV.grey, borderRadius: me ? '0 0 0 26px' : '0 0 26px 0', transform: me ? 'skewX(-18deg)' : 'skewX(18deg)'}} />
    </div>
  );
};
