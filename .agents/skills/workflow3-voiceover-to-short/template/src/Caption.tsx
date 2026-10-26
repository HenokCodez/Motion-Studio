import React from 'react';
import {Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT, MOTION, ZONES} from './theme';
import {clamp} from './hooks';
import {BulletIcon, Word} from './types';

export const pickFontSize = (text: string) => {
  const n = text.length;
  if (n <= 26) return 84;
  if (n <= 44) return 76;
  if (n <= 64) return 68;
  return 60;
};

const Box: React.FC<{cy: number; h?: number; children: React.ReactNode; opacity?: number}> = ({cy, h = 400, children, opacity = 1}) => (
  <div
    style={{
      position: 'absolute', left: (1080 - ZONES.captionW) / 2, width: ZONES.captionW,
      top: cy - h / 2, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity,
    }}
  >
    {children}
  </div>
);

/** Word-by-word caption. Words are laid out from frame 0 (invisible) so nothing ever reflows. */
export const WordsCaption: React.FC<{
  words: Word[]; sceneStart: number; cy: number; durationInFrames: number; sizeScale?: number; alignTop?: boolean;
}> = ({words, sceneStart, cy, durationInFrames, sizeScale = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fs = pickFontSize(words.map((w) => w.t).join(' ')) * sizeScale;
  const out = interpolate(frame, [durationInFrames - MOTION.captionExitFrames, durationInFrames], [1, 0], clamp);
  return (
    <Box cy={cy} opacity={out}>
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '0.26em', rowGap: '0.08em',
          fontFamily: FONT, fontSize: fs, lineHeight: 1.12, letterSpacing: '-0.025em', textAlign: 'center',
        }}
      >
        {words.map((w, i) => {
          const f0 = (w.s - sceneStart) * fps;
          const appear = interpolate(frame, [f0, f0 + MOTION.wordFadeFrames], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          const next = words[i + 1] ? (words[i + 1].s - sceneStart) * fps : f0 + 14;
          const sStart = Math.max(f0 + 3, Math.min(next, f0 + 16));
          const settle = interpolate(frame, [sStart, sStart + MOTION.wordSettleFrames], [0, 1], clamp);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block', opacity: appear, transform: `translateY(${(1 - appear) * 16}px)`,
                color: interpolateColors(settle, [0, 1], [COLORS.ghost, COLORS.text]),
                fontWeight: w.b ? 800 : 500,
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </Box>
  );
};

const Icon: React.FC<{kind: BulletIcon; size: number}> = ({kind, size}) => {
  const c = '#fff';
  if (kind === 'x')
    return (
      <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill={c} /><path d="M8 8l8 8M16 8l-8 8" stroke="#0a0a0a" strokeWidth="2.6" strokeLinecap="round" /></svg>
    );
  if (kind === 'check')
    return (
      <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill={c} /><path d="M7 12.5l3.3 3.3L17 9" stroke="#0a0a0a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
    );
  if (kind === 'arrow')
    return (
      <svg width={size} height={size} viewBox="0 0 24 24"><path d="M3 12h17M13 5l7 7-7 7" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 1.5C12.9 8.2 15.8 11.1 22.5 12 15.8 12.9 12.9 15.8 12 22.5 11.1 15.8 8.2 12.9 1.5 12 8.2 11.1 11.1 8.2 12 1.5Z" fill={c} /></svg>
  );
};

const withBold = (text: string, bold?: string) => {
  if (!bold || !text.includes(bold)) return <>{text}</>;
  const [a, ...rest] = text.split(bold);
  return (<>{a}<b style={{fontWeight: 800}}>{bold}</b>{rest.join(bold)}</>);
};

/** Bullets REPLACE the words caption. Max 3 items, each <= 2 lines (~28 chars). */
export const BulletsCaption: React.FC<{
  icon: BulletIcon; items: {text: string; at: number; bold?: string}[]; sceneStart: number; durationInFrames: number;
}> = ({icon, items, sceneStart, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - MOTION.captionExitFrames, durationInFrames], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 170, width: 760, top: 1070, opacity: out, fontFamily: FONT}}>
      {items.map((it, i) => {
        const f0 = (it.at - sceneStart) * fps;
        const p = spring({frame: frame - f0, fps, config: {damping: 200}, durationInFrames: 12});
        return (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 30, marginBottom: 40,
              opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -28}px)`,
              fontSize: 58, lineHeight: 1.14, fontWeight: 500, letterSpacing: '-0.02em', color: COLORS.text,
            }}
          >
            <div style={{flex: '0 0 auto', marginTop: 4}}><Icon kind={icon} size={56} /></div>
            <div>{withBold(it.text, it.bold)}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Small lead-in words + one HUGE stat that pops in at statAt (e.g. "around" / "1400GB"). */
export const BigStatCaption: React.FC<{
  words: Word[]; stat: string; statAt: number; sceneStart: number; durationInFrames: number;
}> = ({words, stat, statAt, sceneStart, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - (statAt - sceneStart) * fps, fps, config: {damping: 14, mass: 0.7}, durationInFrames: 18});
  const out = interpolate(frame, [durationInFrames - MOTION.captionExitFrames, durationInFrames], [1, 0], clamp);
  const sz = stat.length <= 6 ? 190 : stat.length <= 9 ? 150 : 112;
  return (
    <>
      <WordsCaption words={words} sceneStart={sceneStart} cy={1110} durationInFrames={durationInFrames} sizeScale={0.8} />
      <div
        style={{
          position: 'absolute', left: 60, width: 960, top: 1215, height: 260, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: sz,
          letterSpacing: '-0.04em', color: COLORS.text, opacity: Math.min(1, p * 2) * out, transform: `scale(${0.7 + 0.3 * p})`,
        }}
      >
        {stat}
      </div>
    </>
  );
};
