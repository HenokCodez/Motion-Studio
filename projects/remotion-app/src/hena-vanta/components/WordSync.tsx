import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT, HV, Word} from '../tokens';
import {LEAD, blurOut, interpolateProgress, wordPop} from '../wordUtils';

type Props = {
  words: Word[];
  mode: 'swap' | 'stack' | 'ticker';
  size?: number; // px, default 72
  /** frame at which the whole phrase blurs out (default: last word + 24 f) */
  outAt?: number;
};

const est = (w: Word, size: number) => w.text.length * size * 0.55 + size * 0.3;

export const WordSync: React.FC<Props> = ({words, mode, size = 72, outAt}) => {
  const frame = useCurrentFrame();
  const last = words[words.length - 1]?.frame ?? 0;
  const out = blurOut(frame, outAt ?? last + 24, 8);
  const base: React.CSSProperties = {fontFamily: FONT, fontSize: size, color: HV.ink, lineHeight: 1.1, whiteSpace: 'nowrap'};
  const wStyle = (w: Word): React.CSSProperties => ({
    color: w.color ?? HV.ink,
    fontStyle: w.italic ? 'italic' : 'normal',
    fontWeight: w.weight ?? (mode === 'swap' ? 700 : 600),
  });

  if (mode === 'swap') {
    let cur = -1;
    words.forEach((w, i) => { if (frame >= w.frame - LEAD) cur = i; });
    if (cur < 0) return null;
    const w = words[cur];
    const prev = cur > 0 ? words[cur - 1] : null;
    return (
      <div style={{...base, ...out, position: 'relative', width: 1200, height: size * 1.4, textAlign: 'center'}}>
        {prev && (
          <span style={{position: 'absolute', left: 0, right: 0, ...wStyle(prev), ...blurOut(frame, w.frame - LEAD, 4, 0, -12)}}>{prev.text}</span>
        )}
        <span style={{position: 'absolute', left: 0, right: 0, ...wStyle(w), ...wordPop(frame, w.frame - LEAD)}}>{w.text}</span>
      </div>
    );
  }

  // stack / ticker: row(s) that stay centred on what is VISIBLE so far
  const lines = mode === 'stack' ? [0, 1] : [0];
  return (
    <div style={{...base, ...out, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.2}}>
      {lines.map((ln) => {
        const ws = words.filter((w) => (w.line ?? 0) === ln);
        if (!ws.length) return null;
        const total = ws.reduce((a, w) => a + est(w, size), 0);
        const visible = ws.reduce((a, w) => a + est(w, size) * interpolateProgress(frame, w.frame - LEAD), 0);
        const shift = (total - visible) / 2; // centre what is visible
        const stagger = ln === 1 ? {marginLeft: -36, marginTop: 10} : {};
        return (
          <div key={ln} style={{display: 'flex', gap: size * 0.28, transform: `translateX(${shift}px)`, ...stagger}}>
            {ws.map((w, i) => {
              const age = ws.filter((x) => x.frame <= frame + LEAD).length - 1 - i; // 0 = newest
              const dim = mode === 'ticker' && age > 3 ? 0.6 : 1;
              return (
                <span key={i} style={{...wStyle(w), ...wordPop(frame, w.frame - LEAD), opacity: (wordPop(frame, w.frame - LEAD).opacity as number) * dim}}>
                  {w.text}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
