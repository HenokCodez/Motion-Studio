// Renders plan.json. Contains NO layout decisions: every x/y/size/time comes from the plan.
// If something looks wrong, fix beats.json, never this file.
import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import rough from 'roughjs';
import { loadFont as loadHand } from '@remotion/google-fonts/Kalam';       // swap for Excalifont/Virgil via @font-face in public/fonts
import { loadFont as loadSans } from '@remotion/google-fonts/Inter';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';
// @ts-ignore (allowJs)
import { COLOR, CANVAS, RULES } from '../src/core/tokens.mjs';
// @ts-ignore
import plan from '../plan.json';

const HAND = loadHand('normal', { weights: ['400', '700'] }).fontFamily;
const SANS = loadSans('normal', { weights: ['800'] }).fontFamily;
const MONO = loadMono('normal', { weights: ['400'] }).fontFamily;
const gen = rough.generator();

type Item = any;

// ---------- hand-drawn primitives (stroke draws itself via pathLength=1) ----------
const roundedPath = (w: number, h: number, r = 18) =>
  `M${r} 2H${w - r}Q${w - 2} 2 ${w - 2} ${r}V${h - r}Q${w - 2} ${h - 2} ${w - r} ${h - 2}H${r}Q2 ${h - 2} 2 ${h - r}V${r}Q2 2 ${r} 2Z`;

const Sketch: React.FC<{ d: string; stroke: string; width?: number; draw: number; seed: number; fill?: string }> = ({ d, stroke, width = 3.5, draw, seed, fill }) => {
  const paths = gen.toPaths(gen.path(d, { roughness: 1.15, bowing: 1.1, seed, stroke, strokeWidth: width, fill: undefined }));
  return (
    <>
      {fill && <path d={d} fill={fill} opacity={Math.min(1, draw * 1.5)} />}
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      ))}
    </>
  );
};

// ---------- timing helpers ----------
const useReveal = (atSec: number) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const f = frame - Math.round(atSec * fps);
  const p = f < 0 ? 0 : spring({ frame: f, fps, config: { damping: 12, stiffness: 200, mass: 0.6 } });
  const draw = f < 0 ? 0 : Math.min(1, f / 14);
  return { p, draw, f, visible: f >= 0 };
};

function usePulse(sc: any, id: string) {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  let bump = 0;
  for (const e of sc.events) if (e.type === 'pulse' && e.item === id) {
    const f = frame - Math.round(e.t * fps);
    if (f >= 0 && f < 12) bump = Math.max(bump, 0.06 * Math.sin((f / 12) * Math.PI));
  }
  return 1 + bump;
}

// ---------- camera: each keyframe = "start moving at t, arrive in camMoveSec". Never a slow drift. ----------
function useCamera(sc: any) {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const T = frame / fps, cams = sc.camera, CAM = RULES.camMoveSec;
  const ease = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
  const lerp = (a: any, b: any, e: number) => ({ s: a.s + (b.s - a.s) * e, cx: a.cx + (b.cx - a.cx) * e, cy: a.cy + (b.cy - a.cy) * e });
  const starts: any[] = [null, cams[0]];
  for (let i = 2; i < cams.length; i++) starts[i] = lerp(starts[i - 1], cams[i - 1], ease((cams[i].t - cams[i - 1].t) / CAM));
  let n = 0; for (let i = 1; i < cams.length; i++) if (T >= cams[i].t) n = i;
  const st = n === 0 ? cams[0] : lerp(starts[n], cams[n], ease(Math.max(0, (T - cams[n].t) / CAM)));
  const drift = 1 + 0.03 * (T / sc.dur);                   // barely-visible push so no frame is ever dead
  const s = st.s * drift;
  return `translate(${CANVAS.w / 2 - st.cx * s}px, ${CANVAS.h / 2 - st.cy * s}px) scale(${s})`;
}

// ---------- items ----------
const Logo: React.FC<{ name: string; size: number }> = ({ name, size }) => {
  // build.mjs copies assets/ -> public/assets/. Tries .svg then .png via onError.
  const [ext, setExt] = React.useState('svg');
  return <Img src={staticFile(`assets/logos/${name}.${ext}`)} onError={() => ext === 'svg' && setExt('png')} style={{ width: size, height: size, objectFit: 'contain', marginRight: 20 }} />;
};

const countText = (target: string, p: number) => {
  const m = target.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return target;
  const num = parseFloat(m[2].replace(/,/g, '')), cur = num * Math.min(1, p);
  const txt = m[2].includes(',') ? Math.round(cur).toLocaleString('en-US') : (m[2].includes('.') ? cur.toFixed(m[2].split('.')[1].length) : String(Math.round(cur)));
  return m[1] + txt + m[3];
};

const ItemView: React.FC<{ it: Item; sc: any; seed: number }> = ({ it, sc, seed }) => {
  const { p, draw, visible, f } = useReveal(it.at);
  const pulse = usePulse(sc, it.id);
  if (!visible) return null;
  const base: React.CSSProperties = {
    position: 'absolute', left: it.x, top: it.y, width: it.w, height: it.h, boxSizing: 'border-box',
    opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * 24}px) scale(${(0.85 + 0.15 * p) * pulse})`,
    fontFamily: HAND, fontSize: it.size, lineHeight: 1.25, color: COLOR.ink, textAlign: it.center ? 'center' : 'left',
  };
  const lines = (it.lines || []).map((l: string, i: number) => <div key={i}>{l}</div>);
  const logo = it.logo ? <Logo name={it.logo} size={Math.round(it.size * 1.5)} /> : null;

  switch (it.kind) {
    case 'shot':
      return <div style={{ ...base, borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 60px #0009', border: '2px solid #333' }}>
        <Img src={staticFile(it.asset)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>;
    case 'mark': { // marker highlight wipes left to right
      return <div style={{ ...base, transform: 'none', opacity: 1, background: `${COLOR.accent}59`, border: `4px solid ${COLOR.accent}`, borderRadius: 8, clipPath: `inset(0 ${(1 - draw) * 100}% 0 0)` }} />;
    }
    case 'bigtitle': return <div style={{ ...base, fontFamily: SANS, fontWeight: 800, lineHeight: 1 }}>{lines}</div>;
    case 'stat': return <div style={{ ...base, fontFamily: SANS, fontWeight: 800, color: COLOR.accent, lineHeight: 1 }}>{countText(it.countTo, f / 24)}</div>;
    case 'tag': return <div style={{ ...base, color: COLOR.accent, transform: `${base.transform} rotate(-4deg)` }}>{lines}</div>;
    case 'terminal': return <div style={{ ...base, background: '#1a1a1a', border: '2px solid #333', borderRadius: 14, padding: '22px 30px', fontFamily: MONO, fontSize: it.size, textAlign: 'left' }}>
      <div style={{ fontSize: 20, color: '#ff5f56' }}>● <span style={{ color: '#ffbd2e' }}>●</span> <span style={{ color: '#27c93f' }}>●</span></div>$ {it.lines[0]}</div>;
    case 'chip': return <div style={{ ...base, background: COLOR.rust, border: `3px solid ${COLOR.ink}`, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{lines}</div>;
    case 'header': case 'label': return <div style={{ ...base, display: 'flex', alignItems: 'center' }}>{logo}{it.lines[0]}</div>;
    case 'text': case 'caption': case 'date': return <div style={base}>{lines}</div>;
    case 'panel': {
      const [h, ...rest] = it.lines;
      return <div style={{ ...base, padding: '30px 36px', transform: base.transform }}>
        <svg width={it.w} height={it.h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <Sketch d={roundedPath(it.w, it.h, 22)} stroke={it.emphasis ? COLOR.accent : COLOR.dim} draw={draw} seed={seed} fill={it.emphasis ? COLOR.rust : COLOR.panel} /></svg>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: it.size + 8, marginBottom: 14, color: it.emphasis ? COLOR.accent : COLOR.ink, display: 'flex', alignItems: 'center' }}>{logo}{h}</div>
          {rest.map((r: string, i: number) => <div key={i}>• {r}</div>)}</div></div>;
    }
    default: // node / bubble
      return <div style={{ ...base, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <svg width={it.w} height={it.h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <Sketch d={roundedPath(it.w, it.h, it.kind === 'bubble' ? 36 : 18)} stroke={it.emphasis ? COLOR.accent : COLOR.dim} draw={draw} seed={seed} fill={it.emphasis ? COLOR.rust : COLOR.panel} /></svg>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>{logo}<div>{lines}</div></div>
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
  const poses: string[] = (plan as any).meta.mascot || [];       // e.g. ["point","think","shrug","cheer"] -> public/assets/mascot/<pose>.png
  const { p } = useReveal(0.5); const frame = useCurrentFrame();
  if (!sc.mascot || !poses.length) return null;
  const pose = poses[idx % poses.length];
  return <Img src={staticFile(`assets/mascot/${pose}.png`)} style={{ position: 'absolute', left: sc.mascot.x, top: sc.mascot.y, width: sc.mascot.w, height: sc.mascot.h, objectFit: 'contain', opacity: p, transform: `translateY(${Math.sin(frame / 9) * 3 + (1 - p) * 30}px) scale(${0.8 + 0.2 * p})` }} />;
};

const SceneView: React.FC<{ sc: any; idx: number }> = ({ sc, idx }) => {
  const transform = useCamera(sc);
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const exit = interpolate(frame, [sc.dur * fps - 6, sc.dur * fps], [1, 0], { extrapolateLeft: 'clamp' }); // 6-frame scale-out, no cross-dissolve
  const atOf = (id: string) => sc.items.find((i: Item) => i.id === id)?.at ?? 0;
  return (
    <AbsoluteFill style={{ opacity: exit, transform: `scale(${0.96 + 0.04 * exit})` }}>
      <AbsoluteFill style={{ transformOrigin: '0 0', transform }}>
        <svg style={{ position: 'absolute', inset: 0 }} width={CANVAS.w} height={CANVAS.h}>
          {(sc.edges || []).map((e: any, i: number) => <EdgeView key={i} e={e} at={atOf(e.to)} seed={i * 7 + 3} />)}
        </svg>
        {sc.items.map((it: Item, i: number) => <ItemView key={it.id} it={it} sc={sc} seed={i + 11} />)}
        <Mascot sc={sc} idx={idx} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Explainer: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLOR.bg, backgroundImage: `radial-gradient(${COLOR.dot} 2px, transparent 2px)`, backgroundSize: '32px 32px' }}>
      {(plan as any).meta.audio && <Audio src={staticFile((plan as any).meta.audio)} />}
      {(plan as any).scenes.map((sc: any, idx: number) => (
        <Sequence key={sc.id} from={Math.round(sc.start * fps)} durationInFrames={Math.round(sc.dur * fps)}><SceneView sc={sc} idx={idx} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
