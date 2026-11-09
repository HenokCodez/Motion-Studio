import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {
  Beam,
  Bubble,
  Cursor,
  FootageNote,
  Journey,
  ListCards,
  Pill,
  Scene,
  StatPill,
  Venn,
  Window,
  WordSync,
} from './hena-vanta/components';
import {FONT, HV, SHADOW, Word} from './hena-vanta/tokens';
import {riseIn} from './hena-vanta/motion';

export type SceneData = {
  id: string;
  start: number;
  end: number;
  anim: string;
  props?: Record<string, any>;
  words?: Array<{
    text: string;
    time?: number;
    color?: string;
    italic?: boolean;
    line?: number;
  }>;
  media?: {
    kind: 'screenshot' | 'footage';
    file?: string;
    label?: string;
  };
  sfx?: string;
  idea?: string;
  why?: string;
};

export const SceneView: React.FC<{
  scene: SceneData;
  fps: number;
  index: number;
}> = ({scene, fps, index}) => {
  const frame = useCurrentFrame();
  const durInFrames = Math.max(1, Math.round((scene.end - scene.start) * fps));
  const seed = index * 10 + 7;

  // Convert absolute word times to scene-relative frames
  const relWords: Word[] = (scene.words || []).map((w) => ({
    text: w.text,
    frame: w.time !== undefined ? Math.max(0, Math.round((w.time - scene.start) * fps)) : 0,
    color: w.color,
    italic: w.italic,
    line: w.line,
  }));

  const p = scene.props || {};

  // If this scene is footage (A52), render FootageNote only (no drift, 20px centered)
  if (scene.media?.kind === 'footage' || scene.anim === 'A52') {
    return <FootageNote label={scene.media?.label || ''} />;
  }

  const renderContent = () => {
    switch (scene.anim) {
      case 'A02': {
        const half = Math.ceil(relWords.length / 2);
        const splitWords = relWords.map((w, idx) => ({
          ...w,
          line: idx < half ? 0 : 1,
        }));
        return <WordSync words={splitWords} mode="stack" size={56} outAt={durInFrames - 8} />;
      }
      case 'A03':
        return (
          <StatPill
            value={p.value ?? 0}
            start={p.start ?? 0}
            suffix={p.suffix}
            tone={p.tone ?? 'blue'}
            sparkline={p.sparkline ?? true}
          />
        );
      case 'A04':
        return (
          <Beam start={p.start ?? 10} color={p.color}>
            <WordSync words={relWords} mode="stack" size={64} outAt={durInFrames - 8} />
          </Beam>
        );
      case 'A05':
        return <WordSync words={relWords} mode="swap" size={88} outAt={durInFrames - 8} />;
      case 'A06':
        return (
          <div style={{width: 900, display: 'flex', justifyContent: 'center'}}>
            <Bubble words={relWords} tone="me" start={p.start ?? 0} />
          </div>
        );
      case 'A07':
        return (
          <div style={{width: 900, display: 'flex', justifyContent: 'center'}}>
            <Bubble words={relWords} tone="them" start={p.start ?? 0} />
          </div>
        );
      case 'A08': {
        const normItems = (p.items || []).map((it: any, i: number) => {
          if (typeof it === 'string') {
            const colors = [HV.blue, HV.green, HV.amber, HV.ink];
            return { label: it, color: colors[i % colors.length], at: (i + 1) * 15 };
          }
          return {
            ...it,
            at: typeof it.at === 'number' && !isNaN(it.at) ? it.at : (i + 1) * 15,
            color: it.color || HV.blue,
          };
        });
        return <ListCards heading={p.heading || p.title} items={normItems} start={0} />;
      }
      case 'A09':
        return <ListCards heading={p.heading} items={p.items ?? []} active={p.active} focusAt={p.focusAt} start={0} />;
      case 'A10':
        return <Cursor from={p.from ?? [400, 700]} to={p.to ?? [960, 540]} start={p.start ?? 0} clickAt={p.clickAt} />;
      case 'A11':
        return (
          <Window title={p.title} width={1200} height={680} start={0}>
            {scene.media?.file && (
              <Img
                src={staticFile(scene.media.file)}
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            )}
          </Window>
        );
      case 'A14':
        return (
          <Window title={p.title} width={1200} height={680} scale={1.08} originX="50%" originY="40%" start={0}>
            {scene.media?.file && (
              <Img
                src={staticFile(scene.media.file)}
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            )}
          </Window>
        );
      case 'A30':
        return <Pill label={p.label ?? ''} tone={p.tone ?? 'blue'} start={p.start ?? 0} />;
      case 'A39':
        return (
          <Venn
            labelA={p.labelA ?? ''}
            labelB={p.labelB ?? ''}
            result={p.result ?? ''}
            resultColor={p.resultColor}
            frames={p.frames ?? {a: 20, b: 50, overlap: 90, result: 110}}
          />
        );
      case 'A45':
        return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{width: 1100, height: 600, borderRadius: 20, overflow: 'hidden', boxShadow: SHADOW, border: `1px solid ${HV.line}`}}>
              {scene.media?.file && (
                <Img src={staticFile(scene.media.file)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              )}
            </div>
            {p.footnote && (
              <div style={{marginTop: 16, fontFamily: FONT, fontSize: 22, fontStyle: 'italic', color: HV.mute}}>
                *{p.footnote}
              </div>
            )}
          </div>
        );
      case 'A47':
        return (
          <div style={{fontFamily: FONT, fontSize: 52, fontStyle: 'italic', fontWeight: 700, color: HV.ink, textAlign: 'center', maxWidth: 1200, lineHeight: 1.2}}>
            {p.prefix && <span>{p.prefix} </span>}
            <span style={{color: p.keywordColor ?? HV.red}}>{p.keyword}</span>
            {p.suffix && <span> {p.suffix}</span>}
          </div>
        );
      case 'A22': {
        const title = p.title || 'Portfolio player';
        const note = p.note || '';
        const imgSrc = p.src || scene.media?.file;
        const focusProg = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
        const blurAmount = interpolate(focusProg, [0, 1], [14, 0]);
        const cardOpacity = interpolate(focusProg, [0, 1], [0.15, 1]);
        const scrubProgress = interpolate(frame, [10, 45], [0, 100], {extrapolateRight: 'clamp'});

        return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 1000}}>
            <div style={{
              width: 960, height: 540, borderRadius: 24, overflow: 'hidden', background: '#fff',
              boxShadow: SHADOW, border: `1px solid ${HV.line}`,
              opacity: cardOpacity, filter: `blur(${blurAmount}px)`, position: 'relative'
            }}>
              {imgSrc ? (
                <Img src={staticFile(imgSrc)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: HV.card}}>
                  <span style={{fontFamily: FONT, fontSize: 36, color: HV.mute}}>{title}</span>
                </div>
              )}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 64,
                background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(8px)',
                borderTop: `1px solid ${HV.line}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16
              }}>
                <div style={{width: 12, height: 12, borderRadius: 6, background: HV.red}} />
                <div style={{flex: 1, height: 6, borderRadius: 3, background: HV.grey, position: 'relative'}}>
                  <div style={{width: `${scrubProgress}%`, height: '100%', borderRadius: 3, background: HV.blue}} />
                  <div style={{
                    position: 'absolute', left: `${scrubProgress}%`, top: '50%', transform: 'translate(-50%, -50%)',
                    width: 16, height: 16, borderRadius: 8, background: '#fff', border: `2px solid ${HV.blue}`
                  }} />
                </div>
                <span style={{fontFamily: FONT, fontSize: 16, fontWeight: 600, color: HV.ink}}>
                  {Math.floor(scrubProgress)}%
                </span>
              </div>
            </div>
            {note && (
              <div style={{marginTop: 16, fontFamily: FONT, fontSize: 22, color: HV.mute, fontStyle: 'italic'}}>
                *{note}
              </div>
            )}
          </div>
        );
      }
      case 'A27': {
        const title = p.title || 'Definition';
        const note = p.note || '';
        const imgSrc = p.src || scene.media?.file;
        return (
          <Window title={title} width={1160} height={660} start={0}>
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 36px', boxSizing: 'border-box', justifyContent: 'space-between', alignItems: 'center'}}>
              {imgSrc && (
                <div style={{height: 280, width: '100%', borderRadius: 16, overflow: 'hidden', border: `1px solid ${HV.line}`}}>
                  <Img src={staticFile(imgSrc)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
              )}
              <div style={{fontFamily: FONT, fontSize: 32, fontStyle: 'italic', color: HV.ink, lineHeight: 1.25, textAlign: 'center', maxWidth: 960}}>
                <WordSync words={relWords} mode="stack" size={32} outAt={durInFrames - 8} />
              </div>
              {note && (
                <div style={{fontFamily: FONT, fontSize: 18, color: HV.mute, fontStyle: 'italic', textAlign: 'center'}}>
                  *{note}
                </div>
              )}
            </div>
          </Window>
        );
      }
      case 'A35': {
        const title = p.title || 'Decision weight';
        const rawItems = Array.isArray(p.items) ? p.items : [
          { label: 'Category A', value: 70 },
          { label: 'Category B', value: 30 }
        ];
        const colors = [HV.blue, HV.amber, HV.green, HV.red];
        return (
          <div style={{display: 'flex', flexDirection: 'column', width: 900, gap: 24}}>
            {title && (
              <div style={{fontFamily: FONT, fontSize: 32, fontWeight: 700, color: HV.ink, marginBottom: 8}}>
                {title}
              </div>
            )}
            {rawItems.map((it: any, i: number) => {
              const label = typeof it === 'string' ? it : it.label;
              const val = typeof it === 'object' && typeof it.value === 'number' ? it.value : 50;
              const barIn = interpolate(frame, [i * 8, i * 8 + 14], [0, 1], {extrapolateRight: 'clamp'});
              const color = colors[i % colors.length];
              return (
                <div key={i} style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontSize: 24, fontWeight: 600, color: HV.ink}}>
                    <span>{label}</span>
                    <span>{Math.round(val * barIn)}%</span>
                  </div>
                  <div style={{height: 44, width: '100%', background: HV.card, borderRadius: 22, border: `1px solid ${HV.line}`, overflow: 'hidden'}}>
                    <div style={{
                      height: '100%', width: `${val * barIn}%`, background: color, borderRadius: 22
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
      case 'A36': {
        const milestones = Array.isArray(p.milestones) ? p.milestones : [];
        return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 1000, gap: 24}}>
            <div style={{display: 'flex', gap: 20, width: '100%', justifyContent: 'center'}}>
              {milestones.map((m: any, idx: number) => {
                const mIn = riseIn(frame, idx * 10, 24, 12);
                return (
                  <div
                    key={idx}
                    style={{
                      ...mIn,
                      flex: 1,
                      padding: '24px 20px',
                      borderRadius: 20,
                      background: '#fff',
                      border: `1px solid ${HV.line}`,
                      boxShadow: SHADOW,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12
                    }}
                  >
                    <div style={{
                      alignSelf: 'flex-start', padding: '6px 14px', borderRadius: 99,
                      background: idx === milestones.length - 1 ? HV.blue : HV.grey,
                      color: idx === milestones.length - 1 ? '#fff' : HV.ink,
                      fontFamily: FONT, fontSize: 18, fontWeight: 700
                    }}>
                      {m.time}
                    </div>
                    <div style={{fontFamily: FONT, fontSize: 24, fontWeight: 600, color: HV.ink, lineHeight: 1.2}}>
                      {m.label}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{fontFamily: FONT, fontSize: 26, fontStyle: 'italic', color: HV.mute, maxWidth: 960, textAlign: 'center'}}>
              <WordSync words={relWords} mode="stack" size={26} outAt={durInFrames - 8} />
            </div>
          </div>
        );
      }
      case 'A38': {
        const left = p.left || { title: 'Context', note: '' };
        const right = p.right || { title: 'Reality', note: '' };
        return (
          <div style={{position: 'relative', width: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{
              position: 'absolute', width: 1100, height: 420, borderRadius: 32,
              background: `linear-gradient(135deg, ${HV.grey} 0%, rgba(22, 115, 255, 0.08) 100%)`,
              filter: 'blur(24px)', opacity: 0.6
            }} />
            <div style={{position: 'relative', display: 'flex', gap: 36, width: 1100, zIndex: 2}}>
              <div style={{
                flex: 1, padding: '36px 32px', borderRadius: 24, background: '#fff',
                border: `1px solid ${HV.line}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', gap: 12
              }}>
                <div style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: HV.mute, textTransform: 'uppercase'}}>
                  Context
                </div>
                <div style={{fontFamily: FONT, fontSize: 44, fontWeight: 800, color: HV.ink, lineHeight: 1.15}}>
                  {left.title}
                </div>
                {left.note && (
                  <div style={{fontFamily: FONT, fontSize: 24, color: HV.mute, fontStyle: 'italic'}}>
                    *{left.note}
                  </div>
                )}
              </div>
              <div style={{
                flex: 1, padding: '36px 32px', borderRadius: 24, background: '#fff',
                border: `2px solid ${HV.blue}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', gap: 12
              }}>
                <div style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: HV.blue, textTransform: 'uppercase'}}>
                  Reality
                </div>
                <div style={{fontFamily: FONT, fontSize: 44, fontWeight: 800, color: HV.ink, lineHeight: 1.15}}>
                  {right.title}
                </div>
                {right.note && (
                  <div style={{fontFamily: FONT, fontSize: 24, color: HV.mute, fontStyle: 'italic'}}>
                    *{right.note}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
      case 'A48': {
        const iconType = p.icon || 'brain';
        const quoteText = p.quote || relWords.map((w) => w.text).join(' ');
        const warningText = p.warning || 'TRAP: FALLING FOR IT';
        const noteText = p.note || '';

        const iconOpacity = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
        const iconScale = interpolate(frame, [0, 15], [0.8, 1], {extrapolateRight: 'clamp'});
        const quoteProgress = interpolate(frame, [20, 32], [0, 1], {extrapolateRight: 'clamp'});
        const quoteTranslateY = interpolate(quoteProgress, [0, 1], [0, -28]);
        const quoteOpacity = interpolate(quoteProgress, [0, 1], [1, 0.55]);

        const warningIn = riseIn(frame, 24, 30, 12);
        const noteIn = riseIn(frame, 36, 20, 12);
        const warningParts = warningText.split(/(TRAP:?)/i);

        return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 1200, gap: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 24, transform: `translateY(${quoteTranslateY}px)`}}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, background: HV.card, border: `1px solid ${HV.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: iconOpacity, transform: `scale(${iconScale})`
              }}>
                {iconType === 'brain' ? (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={HV.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
                  </svg>
                ) : (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={HV.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                )}
              </div>
              <div style={{fontFamily: FONT, fontSize: 38, fontStyle: 'italic', fontWeight: 500, color: HV.ink, opacity: quoteOpacity}}>
                "{quoteText}"
              </div>
            </div>
            <div style={{
              ...warningIn,
              fontFamily: FONT,
              fontSize: 54,
              fontWeight: 800,
              fontStyle: 'italic',
              color: HV.ink,
              textAlign: 'center',
              marginTop: 8
            }}>
              {warningParts.map((part, i) => (
                /TRAP:?/i.test(part) ? <span key={i} style={{color: HV.red}}>{part} </span> : <span key={i}>{part}</span>
              ))}
            </div>
            {noteText && (
              <div style={{...noteIn, fontFamily: FONT, fontSize: 22, color: HV.mute, fontStyle: 'italic', textAlign: 'center'}}>
                *{noteText}
              </div>
            )}
          </div>
        );
      }
      case 'A63': {
        const timeText = p.time || '6 hours';
        const ringProg = interpolate(frame, [0, 30], [0, 0.75], {extrapolateRight: 'clamp'});
        const strokeDashoffset = 2 * Math.PI * 120 * (1 - ringProg);
        return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
            <div style={{position: 'relative', width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width="300" height="300" style={{transform: 'rotate(-90deg)'}}>
                <circle cx="150" cy="150" r="120" stroke={HV.grey} strokeWidth="16" fill="none" />
                <circle
                  cx="150" cy="150" r="120"
                  stroke={HV.blue} strokeWidth="16" fill="none"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <span style={{fontFamily: FONT, fontSize: 20, fontWeight: 600, color: HV.mute}}>INVESTED</span>
                <span style={{fontFamily: FONT, fontSize: 48, fontWeight: 800, color: HV.ink, fontVariantNumeric: 'tabular-nums'}}>
                  {timeText.split(' ')[0]}
                </span>
                <span style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: HV.blue, textTransform: 'uppercase'}}>
                  {timeText.split(' ').slice(1).join(' ')}
                </span>
              </div>
            </div>
            <div style={{fontFamily: FONT, fontSize: 36, fontStyle: 'italic', color: HV.ink}}>
              <WordSync words={relWords} mode="stack" size={36} outAt={durInFrames - 8} />
            </div>
          </div>
        );
      }
      case 'A50':
        return (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, width: 1400}}>
            <div style={{width: 760, height: 480, borderRadius: 20, overflow: 'hidden', boxShadow: SHADOW, border: `1px solid ${HV.line}`}}>
              {scene.media?.file && (
                <Img src={staticFile(scene.media.file)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              )}
            </div>
            <div style={{width: 440, fontFamily: FONT, fontSize: 56, fontWeight: 800, fontStyle: 'italic', color: HV.ink, lineHeight: 1.15}}>
              {p.heading ?? ''}
            </div>
          </div>
        );
      case 'A53':
        return (
          <Journey
            events={p.events ?? []}
            activeIndex={p.activeIndex ?? 0}
            extendAt={p.extendAt ?? 10}
          />
        );
      case 'A54':
        return (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36}}>
            <Pill label={p.leftLabel ?? '9-to-5'} tone="grey" start={0} />
            <div style={{width: 2, height: 80, background: HV.line}} />
            <Pill label={p.rightLabel ?? 'Freelance'} tone="blue" start={12} />
          </div>
        );
      case 'A56':
        return (
          <div style={{width: 720, display: 'flex', flexDirection: 'column', gap: 16}}>
            {p.heading && (
              <div style={{fontFamily: FONT, fontSize: 32, fontWeight: 600, color: HV.ink, marginBottom: 8}}>
                {p.heading}
              </div>
            )}
            {(p.items || []).map((it: any, i: number) => {
              const itemText = typeof it === 'string' ? it : it.label;
              const itemAt = typeof it === 'object' && typeof it.at === 'number' && !isNaN(it.at) ? it.at : (i + 1) * 15;
              const isDone = frame >= itemAt + 15;
              return (
                <div
                  key={i}
                  style={{
                    ...riseIn(frame, itemAt, 40, 14),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    height: 76,
                    padding: '0 24px',
                    background: HV.card,
                    border: `1px solid ${HV.line}`,
                    borderRadius: 20,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 99,
                      border: `3px solid ${isDone ? HV.green : HV.mute}`,
                      background: isDone ? HV.green : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isDone && <span style={{color: '#fff', fontSize: 20, fontWeight: 800}}>✓</span>}
                  </div>
                  <div style={{fontFamily: FONT, fontSize: 28, fontWeight: 600, color: HV.ink}}>
                    {itemText}
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 'A60':
        return (
          <Window title={p.title} width={1200} height={680} start={0}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#FAFAFA'}}>
              <div
                style={{
                  width: 760,
                  padding: '24px 36px',
                  borderRadius: 999,
                  background: '#EDEDF0',
                  color: '#0B0B0F',
                  fontSize: 32,
                  fontWeight: 600,
                  fontFamily: FONT,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
                }}
              >
                {p.title}
              </div>
            </div>
          </Window>
        );
      case 'A61':
        return (
          <div style={{width: 480, background: '#fff', borderRadius: 24, boxShadow: SHADOW, border: `1px solid ${HV.line}`, padding: '28px 36px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
              <div style={{fontFamily: FONT, fontSize: 28, fontWeight: 700, color: HV.ink}}>{p.month ?? 'March 2025'}</div>
              <div style={{fontFamily: FONT, fontSize: 20, fontWeight: 600, color: HV.blue}}>Day {p.day ?? 10}</div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, textAlign: 'center'}}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} style={{fontFamily: FONT, fontSize: 16, fontWeight: 600, color: HV.mute}}>{d}</div>
              ))}
              {Array.from({length: 31}, (_, i) => i + 1).map((d) => {
                const isTarget = d === (p.day ?? 10);
                return (
                  <div key={d} style={{
                    height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 10, fontFamily: FONT, fontSize: 18, fontWeight: isTarget ? 800 : 500,
                    background: isTarget ? HV.blue : 'transparent', color: isTarget ? '#fff' : HV.ink,
                    boxShadow: isTarget ? '0 4px 12px rgba(22,115,255,0.35)' : 'none'
                  }}>
                    {d}
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return <WordSync words={relWords} mode="stack" size={72} outAt={durInFrames - 8} />;
    }
  };

  return (
    <Scene duration={durInFrames} seed={seed}>
      {renderContent()}
    </Scene>
  );
};
