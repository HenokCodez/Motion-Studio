import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
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
      case 'A48':
        return <Pill label={p.label ?? ''} tone="red" start={p.start ?? 0} />;
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
