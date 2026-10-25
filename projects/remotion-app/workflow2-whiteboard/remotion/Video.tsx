// Renders plan.json. Contains NO layout decisions: every x/y/size/time comes from the plan.
// If something looks wrong, fix beats.json, never this file.
import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import rough from 'roughjs';
import { loadFont as loadHand } from '@remotion/google-fonts/Kalam';          // fallback if Virgil is missing
import { loadFont as loadSans } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';
// @ts-ignore (allowJs)
import { COLOR, CANVAS, RULES } from '../src/core/tokens.mjs';
// PLAN SOURCE: swap this import (or pass `plan` as a prop / inputProps) if your studio keeps plan.json per video.
// @ts-ignore
import defaultPlan from '../plan.json';

const kalam = loadHand('normal', { weights: ['400', '700'] }).fontFamily;
const HAND = `Virgil, ${kalam}`;                                               // Virgil from public/fonts/virgil.woff2
const SANS = loadSans('normal', { weights: ['800'] }).fontFamily;
const MONO = loadMono('normal', { weights: ['400'] }).fontFamily;
const fontCss = `@font-face{font-family:'Virgil';src:url('${staticFile('fonts/virgil.woff2')}') format('woff2');}`;
const gen = (rough as any).generator ? (rough as any).generator() : (rough as any).default.generator();

const PlanCtx = React.createContext<any>(defaultPlan);
type Item = any;

// ---------- hand-drawn primitives (stroke draws itself via pathLength=1) ----------
const roundedPath = (w: number, h: number, r = 18) =>
  `M${r} 2H${w - r}Q${w - 2} 2 ${w - 2} ${r}V${h - r}Q${w - 2} ${h - 2} ${w - r} ${h - 2}H${r}Q2 ${h - 2} 2 ${h - r}V${r}Q2 2 ${r} 2Z`;

const Sketch: React.FC<{ d: string; stroke: string; width?: number; draw: number; seed: number; fill?: string }> = ({ d, stroke, width = 3.5, draw, seed, fill }) => {
  const paths = useMemo(() => gen.toPaths(gen.path(d, { roughness: 1.15, bowing: 1.1, seed, stroke, strokeWidth: width })), [d, seed, stroke, width]);
  return (
    <>
      {fill && <path d={d} fill={fill} opacity={Math.min(1, draw * 1.5)} />}
      {paths.map((p: any, i: number) => (
        <path key={i} d={p.d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      ))}
    </>
  );
};

// Icons are drawn with a light hand-made wobble and then "write themselves" on screen.
const IconSketch: React.FC<{ data: { vb: number; paths: string[] }; size: number; color: string; draw: number; seed: number }> = ({ data, size, color, draw, seed }) => {
  const strokes = useMemo(() => data.paths.flatMap((d, i) =>
    gen.toPaths(gen.path(d, { roughness: 0.45, bowing: 0.6, maxRandomnessOffset: 0.45, disableMultiStroke: true, seed: seed + i, stroke: color, strokeWidth: 1.6 }))), [data, seed, color]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${data.vb} ${data.vb}`} style={{ flex: 'none', overflow: 'visible' }}>
      {strokes.map((p: any, i: number) => (
        <path key={i} d={p.d} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      ))}
    </svg>
  );
};

// ---------- timing helpers: calm, critically-damped springs (no wobble) ----------
const useReveal = (atSec: number) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const f = frame - Math.round(atSec * fps);
  const p = f < 0 ? 0 : spring({ frame: f, fps, config: { damping: 22, stiffness: 240, mass: 0.7 } });
  const draw = f < 0 ? 0 : Math.min(1, f / 12);
  return { p, draw, f, visible: f >= 0 };
};

// Filler "pulse" = a brief stroke emphasis. It never moves or scales anything.
function usePulse(sc: any, id: string) {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  let e = 0;
  for (const ev of sc.events) if (ev.type === 'pulse' && ev.item === id) {
    const f = frame - Math.round(ev.t * fps);
    if (f >= 0 && f < 14) e = Math.max(e, Math.sin((f / 14) * Math.PI));
  }
  return e;
}

// ---------- camera: STILL unless the plan zooms into a highlight. A move = start at t, arrive in camMoveSec. ----------
function useCamera(sc: any) {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const T = frame / fps, cams = sc.camera, CAM = RULES.camMoveSec;
  const ease = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
  const lerp = (a: any, b: any, e: number) => ({ s: a.s + (b.s - a.s) * e, cx: a.cx + (b.cx - a.cx) * e, cy: a.cy + (b.cy - a.cy) * e });
  const starts: any[] = [null, cams[0]];
  for (let i = 2; i < cams.length; i++) starts[i] = lerp(starts[i - 1], cams[i - 1], ease((cams[i].t - cams[i - 1].t) / CAM));
  let n = 0; for (let i = 1; i < cams.length; i++) if (T >= cams[i].t) n = i;
  const st = n === 0 ? cams[0] : lerp(starts[n], cams[n], ease(Math.max(0, (T - cams[n].t) / CAM)));
  return { s: st.s, transform: `translate(${CANVAS.w / 2 - st.cx * st.s}px, ${CANVAS.h / 2 - st.cy * st.s}px) scale(${st.s})` };
}

// ---------- items ----------
const Logo: React.FC<{ name: string; size: number }> = ({ name, size }) => {
  const [ext, setExt] = React.useState('svg');
  return <Img src={staticFile(`assets/logos/${name}.${ext}`)} onError={() => ext === 'svg' && setExt('png')} style={{ width: size, height: size, objectFit: 'contain', marginRight: 20, flex: 'none' }} />;
};

const countText = (target: string, p: number) => {
  const m = target.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return target;
  const num = parseFloat(m[2].replace(/,/g, '')), cur = num * Math.min(1, p);
  const txt = m[2].includes(',') ? Math.round(cur).toLocaleString('en-US') : (m[2].includes('.') ? cur.toFixed(m[2].split('.')[1].length) : String(Math.round(cur)));
  return m[1] + txt + m[3];
};

// Hand-drawn device frame around a screenshot (browser / laptop / phone)
const FrameSketch: React.FC<{ it: Item; draw: number; seed: number }> = ({ it, draw, seed }) => {
  const { w, h, inset: ins } = it, c = COLOR.dim;
  return (
    <svg width={w} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      {it.frame === 'browser' && <>
        <Sketch d={roundedPath(w, h, 18)} stroke={c} draw={draw} seed={seed} />
        <Sketch d={`M2 ${ins.t}H${w - 2}`} stroke={c} draw={draw} seed={seed + 1} />
        {[0, 1, 2].map(i => <circle key={i} cx={34 + i * 30} cy={ins.t / 2} r={8} fill={['#ff5f56', '#ffbd2e', '#27c93f'][i]} opacity={draw} />)}
        <Sketch d={roundedPath(w - 200, 34, 17).replace(/^M/, `M`)} stroke="#555" width={2.5} draw={draw} seed={seed + 2} />
      </>}
      {it.frame === 'laptop' && <>
        <Sketch d={roundedPath(w, h - ins.b + 14, 22)} stroke={c} draw={draw} seed={seed} />
        <Sketch d={`M-30 ${h - ins.b + 24}H${w + 30}L${w + 10} ${h - 4}H${-10}Z`} stroke={c} draw={draw} seed={seed + 1} />
      </>}
      {it.frame === 'phone' && <>
        <Sketch d={roundedPath(w, h, 56)} stroke={c} draw={draw} seed={seed} />
        <Sketch d={`M${w / 2 - 45} 24H${w / 2 + 45}`} stroke={c} width={6} draw={draw} seed={seed + 1} />
      </>}
    </svg>
  );
};

const ItemView: React.FC<{ it: Item; sc: any; seed: number; dim: number }> = ({ it, sc, seed, dim }) => {
  const { p, draw, visible, f } = useReveal(it.at);
  const emph = usePulse(sc, it.id);
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  if (!visible) return null;
  // a highlight can never exist before the thing it highlights
  if (it.kind === 'mark') {
    const par = sc.items.find((i: Item) => i.id === it.parent);
    if (!par || frame < Math.round((par.at + 0.2) * fps)) return null;
  }
  const isFocus = it.kind === 'shot' || it.kind === 'mark';
  const base: React.CSSProperties = {
    position: 'absolute', left: it.x, top: it.y, width: it.w, height: it.h, boxSizing: 'border-box',
    opacity: Math.min(1, p * 1.8) * (isFocus ? 1 : 1 - dim), transform: `translateY(${(1 - p) * 14}px) scale(${0.94 + 0.06 * p})`,
    fontFamily: HAND, fontSize: it.size, lineHeight: 1.25, color: COLOR.ink, textAlign: it.center ? 'center' : 'left',
  };
  const sw = 3.5 + 3.5 * emph;                                   // pulse = thicker stroke only
  const lines = (it.lines || []).map((l: string, i: number) => <div key={i}>{l}</div>);
  const logoSize = it.kind === 'header' || it.kind === 'label' ? it.h - 8 : Math.round(it.size * 1.5);
  const logo = it.logo ? <Logo name={it.logo} size={logoSize} /> : null;
  const accent = it.emphasis ? COLOR.accent : COLOR.ink;
  const icon = it.icon && it.iconData ? <IconSketch data={it.iconData} size={it.iconSize} color={accent} draw={draw} seed={seed * 3} /> : null;
  const fillBox = it.emphasis ? COLOR.rust : COLOR.panel;

  switch (it.kind) {
    case 'shot':
      return <div style={{ ...base, boxShadow: '0 20px 60px #0009' }}>
        <div style={{ position: 'absolute', left: it.inset.l, top: it.inset.t, right: it.inset.r, bottom: it.inset.b, overflow: 'hidden', borderRadius: it.frame ? 6 : 18, background: '#1d1d1d' }}>
          <Img src={staticFile(it.asset)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
        {it.frame && <FrameSketch it={it} draw={draw} seed={seed} />}
      </div>;
    case 'hero': return <div style={{ ...base, display: 'flex', justifyContent: 'center' }}>{icon}</div>;
    case 'mark':   // marker highlight wipes left to right
      return <div style={{ ...base, transform: 'none', opacity: 1, background: `${COLOR.accent}59`, border: `4px solid ${COLOR.accent}`, borderRadius: 8, clipPath: `inset(0 ${(1 - draw) * 100}% 0 0)` }} />;
    case 'bigtitle': return <div style={{ ...base, fontFamily: SANS, fontWeight: 800, lineHeight: 1, whiteSpace: 'nowrap' }}>{lines}</div>;
    case 'stat': return <div style={{ ...base, fontFamily: SANS, fontWeight: 800, color: COLOR.accent, lineHeight: 1, whiteSpace: 'nowrap' }}>{countText(it.countTo, f / 24)}</div>;
    case 'tag': return <div style={{ ...base, color: COLOR.accent, whiteSpace: 'nowrap', transform: `${base.transform} rotate(-4deg)` }}>{lines}</div>;
    case 'terminal': return <div style={{ ...base, background: '#1a1a1a', border: '2px solid #333', borderRadius: 14, padding: '22px 30px', fontFamily: MONO, fontSize: it.size, textAlign: 'left' }}>
      <div style={{ fontSize: 20, color: '#ff5f56' }}>● <span style={{ color: '#ffbd2e' }}>●</span> <span style={{ color: '#27c93f' }}>●</span></div>$ {it.lines[0]}</div>;
    case 'chip': return <div style={{ ...base, background: COLOR.rust, border: `3px solid ${COLOR.ink}`, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>{lines}</div>;
    case 'header': case 'label': return <div style={{ ...base, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{logo}{it.lines[0]}</div>;
    case 'text': case 'caption': case 'date': return <div style={{ ...base, whiteSpace: 'nowrap' }}>{lines}</div>;
    case 'panel': {
      const [h, ...rest] = it.lines;
      return <div style={{ ...base, padding: '30px 36px' }}>
        <svg width={it.w} height={it.h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <Sketch d={roundedPath(it.w, it.h, 22)} stroke={it.emphasis ? COLOR.accent : COLOR.dim} width={sw} draw={draw} seed={seed} fill={fillBox} /></svg>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: it.size + 8, marginBottom: 14, color: it.emphasis ? COLOR.accent : COLOR.ink, display: 'flex', alignItems: 'center', gap: it.icon ? 24 : 0 }}>{icon}{logo}<span>{h}</span></div>
          {rest.map((r: string, i: number) => <div key={i}>• {r}</div>)}</div></div>;
    }
    case 'icard': // big illustrated card: icon on top, label below
      return <div style={{ ...base, padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
        <svg width={it.w} height={it.h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <Sketch d={roundedPath(it.w, it.h, 26)} stroke={it.emphasis ? COLOR.accent : COLOR.dim} width={sw} draw={draw} seed={seed} fill={fillBox} /></svg>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          {icon}<div>{lines}</div>{(it.subLines || []).map((l: string, i: number) => <div key={i} style={{ fontSize: 34, color: COLOR.dim }}>{l}</div>)}</div></div>;
    default: // node / bubble: icon or logo sits to the LEFT of the label
      return <div style={{ ...base, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <svg width={it.w} height={it.h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <Sketch d={roundedPath(it.w, it.h, it.kind === 'bubble' ? 36 : 18)} stroke={it.emphasis ? COLOR.accent : COLOR.dim} width={sw} draw={draw} seed={seed} fill={fillBox} /></svg>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: icon ? 24 : 0 }}>{icon}{logo}<div>{lines}</div></div>
        {(it.subLines || []).map((l: string, i: number) => <div key={i} style={{ position: 'relative', fontSize: 34, color: COLOR.dim }}>{l}</div>)}
      </div>;
  }
};

const EdgeView: React.FC<{ e: any; at: number; seed: number }> = ({ e, at, seed }) => {
  const { draw, visible } = useReveal(Math.max(0, at - 0.3));
  if (!visible) return null;
  const [x0, y0] = e.p0, [x1, y1] = e.p1, mx = (x0 + x1) / 2;
  return <>
    <Sketch d={`M${x0 + 6} ${y0}C${mx} ${y0} ${mx} ${y1} ${x1 - 16} ${y1}`} stroke={COLOR.dim} width={4} draw={draw} seed={seed} />
    <Sketch d={`M${x1 - 34} ${y1 - 16}L${x1 - 8} ${y1}L${x1 - 34} ${y1 + 16}`} stroke={COLOR.dim} width={4} draw={draw >= 1 ? 1 : 0} seed={seed + 1} />
  </>;
};

const Mascot: React.FC<{ sc: any; idx: number }> = ({ sc, idx }) => {
  const plan = React.useContext(PlanCtx);
  const poses: string[] = plan.meta.mascot || [];       // e.g. ["point","think","shrug","cheer"] -> public/assets/mascot/<pose>.png
  const { p } = useReveal(0.5); const frame = useCurrentFrame();
  if (!sc.mascot || !poses.length) return null;
  return <Img src={staticFile(`assets/mascot/${poses[idx % poses.length]}.png`)} style={{ position: 'absolute', left: sc.mascot.x, top: sc.mascot.y, width: sc.mascot.w, height: sc.mascot.h, objectFit: 'contain', opacity: p, transform: `translateY(${Math.sin(frame / 14) * 2 + (1 - p) * 24}px)` }} />;
};

const SceneView: React.FC<{ sc: any; idx: number }> = ({ sc, idx }) => {
  const cam = useCamera(sc);
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const exit = interpolate(frame, [sc.dur * fps - 6, sc.dur * fps], [1, 0], { extrapolateLeft: 'clamp' });
  const dim = Math.min(1, Math.max(0, (cam.s - 1.02) / 0.15));          // during a zoom, everything except the screenshot fades away
  const atOf = (id: string) => sc.items.find((i: Item) => i.id === id)?.at ?? 0;
  return (
    <AbsoluteFill style={{ opacity: exit, transform: `scale(${0.97 + 0.03 * exit})` }}>
      <AbsoluteFill style={{ transformOrigin: '0 0', transform: cam.transform }}>
        <svg style={{ position: 'absolute', inset: 0, opacity: 1 - dim }} width={CANVAS.w} height={CANVAS.h}>
          {(sc.edges || []).map((e: any, i: number) => <EdgeView key={i} e={e} at={atOf(e.to)} seed={i * 7 + 3} />)}
        </svg>
        {sc.items.map((it: Item, i: number) => <ItemView key={it.id} it={it} sc={sc} seed={i + 11} dim={dim} />)}
        <Mascot sc={sc} idx={idx} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Explainer: React.FC<{ plan?: any }> = ({ plan: planProp }) => {
  const { fps } = useVideoConfig();
  const plan = planProp ?? defaultPlan;
  const isVantaBrief = plan.meta?.channel?.toLowerCase() === 'vantabrief' || plan.meta?.bgVideo;
  const bgVideoSrc = plan.meta?.bgVideo ? staticFile(plan.meta.bgVideo) : isVantaBrief ? staticFile('backgrounds/vanta_grid.mp4') : null;

  return (
    <PlanCtx.Provider value={plan}>
      <AbsoluteFill style={{ background: COLOR.bg }}>
        {bgVideoSrc ? (
          <AbsoluteFill>
            <Loop durationInFrames={1195}>
              <OffthreadVideo src={bgVideoSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Loop>
          </AbsoluteFill>
        ) : (
          <AbsoluteFill style={{ backgroundImage: `radial-gradient(${COLOR.dot} 2px, transparent 2px)`, backgroundSize: '32px 32px' }} />
        )}
        <style>{fontCss}</style>
        {plan.meta.audio && <Audio src={staticFile(plan.meta.audio)} />}
        {plan.scenes.map((sc: any, idx: number) => (
          <Sequence key={sc.id} from={Math.round(sc.start * fps)} durationInFrames={Math.round(sc.dur * fps)}><SceneView sc={sc} idx={idx} /></Sequence>
        ))}
      </AbsoluteFill>
    </PlanCtx.Provider>
  );
};
