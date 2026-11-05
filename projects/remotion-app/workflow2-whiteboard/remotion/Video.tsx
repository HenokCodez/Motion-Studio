// Renders plan.json. Contains NO layout decisions: every x/y/size/time comes from the plan.
// If something looks wrong, fix beats.json, never this file.
import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import rough from 'roughjs';
// @ts-ignore (allowJs)
import { COLOR, CANVAS, RULES, SAFE } from '../src/core/tokens.mjs';
// PLAN SOURCE: swap this import (or pass `plan` as a prop / inputProps) if your studio keeps plan.json per video.
// @ts-ignore
import defaultPlan from '../plan.json';

const kalam = "'Kalam', 'Virgil', cursive, sans-serif";
const HAND = `Virgil, ${kalam}`;                                               // Virgil from public/fonts/virgil.woff2
const SANS = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const MONO = "'JetBrains Mono', 'VP Pixel', monospace, Consolas, 'Courier New'";
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
  const draw = f < 0 ? 0 : Math.min(1, f / 8);                       // the box/stroke draws FIRST (8 frames)
  const text = f < 3 ? 0 : Math.min(1, (f - 3) / 6);                  // ...and its text follows 3 frames later, never before
  return { p, draw, text, f, visible: f >= 0 };
};

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
const Logo: React.FC<{ name: string; size: number; plate?: boolean }> = ({ name, size, plate }) => {
  const [ext, setExt] = React.useState('svg');
  const img = <Img src={staticFile(`assets/logos/${name}.${ext}`)} onError={() => ext === 'svg' && setExt('png')} style={{ width: plate ? size - 12 : size, height: plate ? size - 12 : size, objectFit: 'contain' }} />;
  // dark logos (GitHub, Notion, Ps/Pr/Ae tiles) vanish on the dark canvas: give them a light plate
  return <div style={{ width: size, height: size, marginRight: 20, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: plate ? '#EDEDED' : 'transparent', borderRadius: plate ? Math.round(size * 0.22) : 0 }}>{img}</div>;
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
  const { p, draw, text, visible } = useReveal(it.at);
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
    opacity: (isFocus ? 1 : 1 - dim), transform: `translateX(${(1 - p) * -28}px) scale(${0.97 + 0.03 * p})`,   // always slides in from the LEFT
    fontFamily: HAND, fontSize: it.size, lineHeight: 1.25, color: COLOR.ink, textAlign: it.center ? 'center' : 'left',
  };
  const sw = 3.5;
  const tx: React.CSSProperties = { opacity: text };            // text layer: appears after its box
  const lines = (it.lines || []).map((l: string, i: number) => <div key={i}>{l}</div>);
  const logoSize = it.kind === 'header' || it.kind === 'label' ? it.h - 8 : Math.round(it.size * 1.5);
  const logo = it.logo ? <Logo name={it.logo} size={logoSize} plate={!!it.logoDark} /> : null;
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
    case 'bigtitle': return <div style={{ ...base, ...tx, fontFamily: SANS, fontWeight: 800, lineHeight: 1, whiteSpace: 'nowrap' }}>{lines}</div>;
    case 'stat': return <div style={{ ...base, ...tx, fontFamily: SANS, fontWeight: 800, color: COLOR.accent, lineHeight: 1, whiteSpace: 'nowrap' }}>{it.lines[0]}</div>;
    case 'tag': return <div style={{ ...base, color: COLOR.accent, whiteSpace: 'nowrap', transform: `${base.transform} rotate(-4deg)` }}>{lines}</div>;
    case 'terminal': return <div style={{ ...base, background: '#1a1a1a', border: '2px solid #333', borderRadius: 14, padding: '22px 30px', fontFamily: MONO, fontSize: it.size, textAlign: 'left' }}>
      <div style={{ fontSize: 20, color: '#ff5f56' }}>● <span style={{ color: '#ffbd2e' }}>●</span> <span style={{ color: '#27c93f' }}>●</span></div>$ {it.lines[0]}</div>;
    case 'chip': return <div style={{ ...base, background: COLOR.rust, border: `3px solid ${COLOR.ink}`, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>{lines}</div>;
    case 'header': case 'label': return <div style={{ ...base, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{logo}{it.lines[0]}</div>;
    case 'text': case 'caption': case 'date': return <div style={{ ...base, ...tx, whiteSpace: 'nowrap' }}>{lines}</div>;
    case 'panel': {
      const [h, ...rest] = it.lines;
      return <div style={{ ...base, padding: '30px 36px' }}>
        <svg width={it.w} height={it.h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <Sketch d={roundedPath(it.w, it.h, 22)} stroke={it.emphasis ? COLOR.accent : COLOR.dim} width={sw} draw={draw} seed={seed} fill={fillBox} /></svg>
        <div style={{ position: 'relative', ...tx }}>
          <div style={{ fontSize: it.size + 8, marginBottom: 14, color: it.emphasis ? COLOR.accent : COLOR.ink, display: 'flex', alignItems: 'center', gap: it.icon ? 24 : 0 }}>{icon}{logo}<span>{h}</span></div>
          {rest.map((r: string, i: number) => <div key={i}>• {r}</div>)}</div></div>;
    }
    case 'icard': // big illustrated card: icon on top, label below
      return <div style={{ ...base, padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
        <svg width={it.w} height={it.h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <Sketch d={roundedPath(it.w, it.h, 26)} stroke={it.emphasis ? COLOR.accent : COLOR.dim} width={sw} draw={draw} seed={seed} fill={fillBox} /></svg>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, ...tx }}>
          {icon}<div>{lines}</div>{(it.subLines || []).map((l: string, i: number) => <div key={i} style={{ fontSize: 34, color: COLOR.dim }}>{l}</div>)}</div></div>;
    default: // node / bubble: icon or logo sits to the LEFT of the label
      return <div style={{ ...base, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <svg width={it.w} height={it.h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <Sketch d={roundedPath(it.w, it.h, it.kind === 'bubble' ? 36 : 18)} stroke={it.emphasis ? COLOR.accent : COLOR.dim} width={sw} draw={draw} seed={seed} fill={fillBox} /></svg>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: icon ? 24 : 0, ...tx }}>{icon}{logo}<div>{lines}</div></div>
        {(it.subLines || []).map((l: string, i: number) => <div key={i} style={{ position: 'relative', fontSize: 34, color: COLOR.dim, ...tx }}>{l}</div>)}
      </div>;
  }
};

const EdgeView: React.FC<{ e: any; at: number; seed: number }> = ({ e, at, seed }) => {
  const { f, visible } = useReveal(Math.max(0, at - 0.3));
  if (!visible) return null;
  const draw = Math.min(1, f / 9);                       // the arrow reaches its target exactly as the target appears
  const [x0, y0] = e.p0, [x1, y1] = e.p1, mx = (x0 + x1) / 2;
  return <>
    <Sketch d={`M${x0 + 6} ${y0}C${mx} ${y0} ${mx} ${y1} ${x1 - 16} ${y1}`} stroke={COLOR.dim} width={4} draw={draw} seed={seed} />
    <Sketch d={`M${x1 - 34} ${y1 - 16}L${x1 - 8} ${y1}L${x1 - 34} ${y1 + 16}`} stroke={COLOR.dim} width={4} draw={draw >= 1 ? 1 : 0} seed={seed + 1} />
  </>;
};

// Timeline: the line draws left to right, and each dot pops exactly when its point appears.
const TimelineLine: React.FC<{ sc: any }> = ({ sc }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const nodes = sc.items.filter((i: Item) => i.kind === 'node');
  if (!sc.timelineY || !nodes.length) return null;
  const T = frame / fps, t0 = Math.min(...nodes.map((n: Item) => n.at)) - 0.25, t1 = Math.max(...nodes.map((n: Item) => n.at));
  const draw = Math.max(0, Math.min(1, (T - t0) / Math.max(0.6, t1 - t0 + 0.3)));
  return (
    <svg style={{ position: 'absolute', inset: 0 }} width={CANVAS.w} height={CANVAS.h}>
      <Sketch d={`M${SAFE.x} ${sc.timelineY}H${SAFE.x + SAFE.w}`} stroke={COLOR.dim} width={4} draw={draw} seed={91} />
      {sc.xs.map((x: number, i: number) => {
        const n = nodes.find((m: Item) => m.col === i); const k = n ? Math.max(0, Math.min(1, (T - n.at) * fps / 6)) : 0;
        return k > 0 ? <circle key={i} cx={x} cy={sc.timelineY} r={13 * k} fill={COLOR.accent} /> : null;
      })}
    </svg>
  );
};

// Visible hand-drawn emphasis for quiet stretches: a marker wipe behind, or an underline drawn left to right.
const FillView: React.FC<{ ev: any; it: Item; idx: number }> = ({ ev, it, idx }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const f = frame - Math.round(ev.t * fps);
  if (f < 0 || !it) return null;
  const p = Math.min(1, f / 10);
  if (ev.type === 'marker')
    return <div style={{ position: 'absolute', left: it.x - 12, top: it.y - 8, width: it.w + 24, height: it.h + 16, background: `${COLOR.accent}38`, borderRadius: 12, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }} />;
  const y = it.y + it.h + 14, x0 = it.x + it.w * 0.08, x1 = it.x + it.w * 0.92;
  return <svg style={{ position: 'absolute', inset: 0 }} width={CANVAS.w} height={CANVAS.h}>
    <Sketch d={`M${x0} ${y}Q${(x0 + x1) / 2} ${y + 10} ${x1} ${y - 2}`} stroke={COLOR.accent} width={6} draw={p} seed={300 + idx} /></svg>;
};

const SceneView: React.FC<{ sc: any }> = ({ sc }) => {
  const cam = useCamera(sc);
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const exit = interpolate(frame, [sc.dur * fps - 6, sc.dur * fps], [1, 0], { extrapolateLeft: 'clamp' });
  const dim = Math.min(1, Math.max(0, (cam.s - 1.02) / 0.15));          // during a zoom, everything except the screenshot fades away
  const atOf = (id: string) => sc.items.find((i: Item) => i.id === id)?.at ?? 0;
  return (
    <AbsoluteFill style={{ opacity: exit, transform: `scale(${0.97 + 0.03 * exit})` }}>
      <AbsoluteFill style={{ transformOrigin: '0 0', transform: cam.transform }}>
        {sc.events.filter((e: any) => e.type === 'marker').map((e: any, i: number) => <FillView key={'m' + i} ev={e} it={sc.items.find((x: Item) => x.id === e.item)} idx={i} />)}
        <TimelineLine sc={sc} />
        <svg style={{ position: 'absolute', inset: 0, opacity: 1 - dim }} width={CANVAS.w} height={CANVAS.h}>
          {(sc.edges || []).map((e: any, i: number) => <EdgeView key={i} e={e} at={atOf(e.to)} seed={i * 7 + 3} />)}
        </svg>
        {sc.items.map((it: Item, i: number) => <ItemView key={it.id} it={it} sc={sc} seed={i + 11} dim={dim} />)}
        {sc.events.filter((e: any) => e.type === 'underline').map((e: any, i: number) => <FillView key={'u' + i} ev={e} it={sc.items.find((x: Item) => x.id === e.item)} idx={i} />)}
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
          <Sequence key={sc.id} from={Math.round(sc.start * fps)} durationInFrames={Math.round(sc.dur * fps)}><SceneView sc={sc} /></Sequence>
        ))}
      </AbsoluteFill>
    </PlanCtx.Provider>
  );
};
