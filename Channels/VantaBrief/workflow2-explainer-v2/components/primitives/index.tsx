import React, {useMemo} from 'react';
import {AbsoluteFill, Img, staticFile, delayRender, continueRender, getInputProps, useCurrentFrame as useRemotionFrame} from 'remotion';
import rough from 'roughjs';
import {C, SAFE, HAND, HEAVY, MIN_FONT} from './theme';
export * from './theme';
const gen = rough.generator();
const opts = (seed: number, extra: any = {}) => ({roughness: 1.1, bowing: 1.2, seed, strokeWidth: 4, disableMultiStroke: true, ...extra});
export const roughRect = (x: number, y: number, w: number, h: number, seed = 1) =>
  gen.toPaths(gen.rectangle(x, y, w, h, opts(seed))).map(p => p.d).join(' ');
export const roughLine = (pts: [number, number][], seed = 1) =>
  gen.toPaths(gen.linearPath(pts, opts(seed))).map(p => p.d).join(' ');
/** straight polyline, no hand-drawn jitter: use for geometry that changes every frame (ropes, morphing lines) so it does not shimmer */
export const plainLine = (pts: [number, number][]) => 'M' + pts.map(q => q.join(' ')).join(' L');
export const roughPath = (d: string, seed = 1) => gen.toPaths(gen.path(d, opts(seed))).map(p => p.d).join(' ');
export const roughEllipse = (cx: number, cy: number, w: number, h: number, seed = 1) =>
  gen.toPaths(gen.ellipse(cx, cy, w, h, opts(seed))).map(p => p.d).join(' ');

/** Real project: Grid_1.mp4 looped via <OffthreadVideo>. Boards use a still frame of that same video. NEVER recreate the grid. */
export const BgMode = React.createContext<'still' | 'none'>('still');
export const Stage: React.FC<{children: React.ReactNode; debug?: boolean}> = ({children, debug}) => {
  const bg = React.useContext(BgMode);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const done = React.useRef(false);
  const [h] = React.useState(() => delayRender('fonts'));
  const [hb] = React.useState(() => ((getInputProps() as any).__bounds ? delayRender('bounds') : null));
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    Promise.all([
      new FontFace('Excalifont', `url(${staticFile('fonts/Excalifont-Regular.woff2')})`).load(),
      new FontFace('InterXB', `url(${staticFile('fonts/Inter-ExtraBold.otf')})`).load(),
    ]).then(fs => { fs.forEach(f => (document as any).fonts.add(f)); setReady(true); continueRender(h); }).catch(() => { setReady(true); continueRender(h); });
  }, []);
  // DOM bounds report for scripts/bounds-check-remotion.mjs (only when inputProps.__bounds is set)
  React.useEffect(() => {
    if (!ready || hb === null || done.current) return;
    done.current = true; const out: any[] = [];
    svgRef.current?.querySelectorAll('text').forEach(t => { let o = 1; let n: Element | null = t;
      while (n && n !== svgRef.current) { const a = n.getAttribute('opacity'); if (a) o *= parseFloat(a); if (n !== t && n.getAttribute('clip-path')) o = 0; /* hidden by a clip window (e.g. scrolling list) */ n = n.parentElement; }
      const r = t.getBoundingClientRect();
      out.push({t: (t.textContent || '').slice(0, 40), fs: parseFloat(t.getAttribute('font-size') || '0'), o, x0: r.left, y0: r.top, x1: r.right, y1: r.bottom}); });
    console.log('__BOUNDS__' + JSON.stringify(out)); continueRender(hb);
  });
  return (
    <AbsoluteFill style={{background: bg === 'still' ? '#0B0B0B' : 'transparent'}}>
      {bg === 'still' && <Img src={staticFile('bg/grid-frame.png')} style={{width: 1920, height: 1080}} />}
      <svg ref={svgRef} width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        {ready && children}
        {debug && <rect x={SAFE.x0} y={SAFE.y0} width={SAFE.w} height={SAFE.h} fill="none" stroke="#1677FF" strokeDasharray="8 8" />}
      </svg>
    </AbsoluteFill>
  );
};

/** stroke that draws itself. p: 0..1. v2.1: subpaths are drawn one after another (SVG restarts dashes per subpath, which made detached fragments). */
const subLen = (d: string) => { const el = document.createElementNS('http://www.w3.org/2000/svg', 'path'); el.setAttribute('d', d); try { return Math.max(0.001, el.getTotalLength()); } catch { return 1; } };
export const Pen: React.FC<{d: string; p: number; color?: string; w?: number; fill?: string; opacity?: number}> = ({d, p, color = C.ink, w = 4, fill = 'none', opacity = 1}) => {
  const parts = useMemo(() => { const ps = d.split(/(?=M)/).map(x => x.trim()).filter(Boolean); const lens = ps.map(subLen); const tot = lens.reduce((x, y) => x + y, 0); let acc = 0;
    return ps.map((x, i) => { const a0 = acc / tot; acc += lens[i]; return {d: x, a: a0, b: acc / tot}; }); }, [d]);
  if (p <= 0) return null;
  return <g opacity={opacity}>
    {fill !== 'none' && <path d={d} fill={fill} stroke="none" />}
    {parts.map((pt, i) => { const q = Math.min(1, Math.max(0, (p - pt.a) / Math.max(1e-6, pt.b - pt.a))); return q <= 0 ? null :
      <path key={i} d={pt.d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - q} />; })}
  </g>;
};

/** hand-drawn card. p = outline draw progress, fillP = fill opacity. */
export const Card: React.FC<{x: number; y: number; w: number; h: number; p?: number; fillP?: number; fill?: string;
  stroke?: string; seed?: number; sw?: number; children?: React.ReactNode}> =
  ({x, y, w, h, p = 1, fillP, fill = C.card, stroke = C.ink, seed = 3, sw = 4, children}) => {
    const d = useMemo(() => roughRect(x, y, w, h, seed), [x, y, w, h, seed]);
    return <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={fill} opacity={fillP ?? p} />
      <Pen d={d} p={p} color={stroke} w={sw} />
      {children}
    </g>;
  };

/** text. size must be >= 24 (throws -> render fails loudly). p<1 wipes left->right. */
export const T: React.FC<{x: number; y: number; size: number; children: string; color?: string; anchor?: 'start' | 'middle' | 'end';
  heavy?: boolean; p?: number; opacity?: number; width?: number; id?: string; rot?: number}> =
  ({x, y, size, children, color = C.ink, anchor = 'start', heavy, p = 1, opacity = 1, width = 1700, id = 't', rot = 0}) => {
    if (size < MIN_FONT) throw new Error(`Text "${children}" size ${size} < ${MIN_FONT}px (layout-law)`);
    if (opacity <= 0 || p <= 0) return null;
    const x0 = anchor === 'start' ? x : anchor === 'middle' ? x - width / 2 : x - width;
    const cid = `clip-${id}`;
    return <g opacity={opacity} transform={`rotate(${rot} ${x} ${y})`}>
      {p < 1 && <clipPath id={cid}><rect x={x0} y={y - size * 1.3} width={width * p} height={size * 1.8} /></clipPath>}
      <text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor} fontFamily={heavy ? HEAVY : HAND}
        fontWeight={heavy ? 800 : 400} clipPath={p < 1 ? `url(#${cid})` : undefined}>{children}</text>
    </g>;
  };

/** simple icon set in a 100x100 box, drawn with pen */
export const ICONS: Record<string, string> = {
  scales: 'M50 8 L50 86 M26 88 L74 88 M16 26 L84 20 M16 26 L6 54 Q22 68 38 54 L16 26 M84 20 L70 50 Q84 64 96 50 L84 20',
  play: 'M26 14 L84 50 L26 86 Z',
  chip: 'M24 24 L76 24 L76 76 L24 76 Z M40 40 L60 40 L60 60 L40 60 Z M36 24 L36 10 M50 24 L50 10 M64 24 L64 10 M36 76 L36 90 M50 76 L50 90 M64 76 L64 90 M24 36 L10 36 M24 50 L10 50 M24 64 L10 64 M76 36 L90 36 M76 50 L90 50 M76 64 L90 64',
  browser: 'M10 18 L90 18 L90 84 L10 84 Z M10 36 L90 36 M26 18 L26 36',
  check: 'M12 54 L40 82 L90 20',
  cube: 'M50 8 L88 28 L88 72 L50 92 L12 72 L12 28 Z M12 28 L50 48 L88 28 M50 48 L50 92',
  bolt: 'M60 8 L22 56 L48 56 L40 92 L78 42 L52 42 Z',
  star: 'M50 8 L62 38 L92 38 L68 58 L78 90 L50 70 L22 90 L32 58 L8 38 L38 38 Z',
  search: 'M42 14 A28 28 0 1 0 42 70 A28 28 0 1 0 42 14 M62 62 L90 90',
  warn: 'M50 10 L92 86 L8 86 Z M50 36 L50 60 M50 72 L50 74',
};
export const Icon: React.FC<{name: string; x: number; y: number; size: number; p?: number; color?: string; seed?: number; w?: number}> =
  ({name, x, y, size, p = 1, color = C.ink, seed = 5, w = 5}) => {
    const d = useMemo(() => roughPath(ICONS[name], seed), [name, seed]);
    const s = size / 100;
    return <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`}><Pen d={d} p={p} color={color} w={w / s} /></g>;
  };

/** Wraps an animation so it renders only after fonts are loaded (textWidth() needs real metrics). */
export const withFonts = <P extends object>(Comp: React.FC<P>): React.FC<P> => (props: P) => {
  const [h] = React.useState(() => delayRender('fonts-hoc'));
  const [ok, setOk] = React.useState(false);
  React.useEffect(() => {
    Promise.all([
      new FontFace('Excalifont', `url(${staticFile('fonts/Excalifont-Regular.woff2')})`).load(),
      new FontFace('InterXB', `url(${staticFile('fonts/Inter-ExtraBold.otf')})`).load(),
    ]).then(fs => { fs.forEach(f => (document as any).fonts.add(f)); setOk(true); continueRender(h); })
      .catch(() => { setOk(true); continueRender(h); });
  }, []);
  return ok ? <Comp {...props} /> : null;
};

/** hand-drawn arrow: shaft draws first (p 0..0.85), head after */
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; p: number; color?: string; w?: number; seed?: number}> =
  ({x1, y1, x2, y2, p, color = C.ink, w = 4, seed = 7}) => {
    const d = useMemo(() => roughLine([[x1, y1], [x2, y2]], seed), [x1, y1, x2, y2, seed]);
    const a = Math.atan2(y2 - y1, x2 - x1), L = 26;
    const h = useMemo(() => roughLine([[x2 - L * Math.cos(a - 0.5), y2 - L * Math.sin(a - 0.5)], [x2, y2], [x2 - L * Math.cos(a + 0.5), y2 - L * Math.sin(a + 0.5)]], seed + 1), [x2, y2, a, seed]);
    return <g><Pen d={d} p={Math.min(1, p / 0.85)} color={color} w={w} /><Pen d={h} p={Math.max(0, (p - 0.85) / 0.15)} color={color} w={w} /></g>;
  };

/** hand-drawn stick figure. (x,y) = feet position, h = height px. pose: stand|point|think|wave. walk: -1..1 leg swing. */
export const Stick: React.FC<{x: number; y: number; h: number; pose?: 'stand' | 'point' | 'think' | 'wave'; p?: number; color?: string; flip?: boolean; walk?: number; w?: number}> =
  ({x, y, h, pose = 'stand', p = 1, color = C.ink, flip = false, walk = 0, w = 6}) => {
    const s = h / 200;
    const arms = pose === 'point' ? 'M50 70 L104 58 M50 70 L26 112' : pose === 'wave' ? 'M50 70 L84 34 M50 70 L26 112' : pose === 'think' ? 'M50 70 L34 98 L56 78 M50 70 L74 112' : 'M50 70 L26 112 M50 70 L74 112';
    const d = useMemo(() => roughPath(`M32 30 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0 M50 48 L50 120 ${arms}`, 3), [pose]);
    return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) translate(-50 -190)`}><Pen d={d} p={p} color={color} w={w / s} />{p > 0.6 && <path d={`M50 120 L${50 - 22 * walk} 190 M50 120 L${50 + 22 * walk} 190`} fill="none" stroke={color} strokeWidth={w / s} strokeLinecap="round" />}</g>;
  };
/** photo slot: real photo from assets/photos/<src>, else a labelled silhouette placeholder */
export const PhotoSlot: React.FC<{x: number; y: number; w: number; h: number; src?: string; p?: number}> = ({x, y, w, h, src, p = 1}) =>
  src ? <image href={staticFile('photos/' + src)} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid slice" opacity={p} /> :
    <g opacity={p}><rect x={x} y={y} width={w} height={h} fill="#2E2A2B" />
      <circle cx={x + w / 2} cy={y + h * 0.38} r={Math.min(w, h) * 0.14} fill="none" stroke={C.ink} strokeWidth={4} opacity={0.55} />
      <path d={`M${x + w * 0.22} ${y + h * 0.92} Q${x + w / 2} ${y + h * 0.52} ${x + w * 0.78} ${y + h * 0.92}`} fill="none" stroke={C.ink} strokeWidth={4} opacity={0.55} /></g>;
/** real logo on a cream badge (so dark logos stay visible). Missing file -> dashed placeholder with initial. */
export const LogoBadge: React.FC<{cx: number; cy: number; r: number; file?: string; initial?: string; round?: boolean}> = ({cx, cy, r, file, initial = '?', round = true}) =>
  file ? <g>{round ? <circle cx={cx} cy={cy} r={r} fill={C.ink} /> : <rect x={cx - r} y={cy - r} width={2 * r} height={2 * r} rx={r * 0.25} fill={C.ink} />}
    <image href={staticFile('logos/' + file)} x={cx - r * 0.62} y={cy - r * 0.62} width={r * 1.24} height={r * 1.24} preserveAspectRatio="xMidYMid meet" /></g> :
    <g><circle cx={cx} cy={cy} r={r} fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="10 8" /><text x={cx} y={cy + r * 0.3} fontSize={r * 0.8} fill={C.ink} textAnchor="middle" fontFamily={HEAVY}>{initial}</text></g>;

Object.assign(ICONS, {
  server: 'M15 18 L85 18 L85 42 L15 42 Z M15 58 L85 58 L85 82 L15 82 Z M28 30 L32 30 M28 70 L32 70 M70 30 L74 30 M70 70 L74 70',
  database: 'M20 25 Q50 5 80 25 L80 75 Q50 95 20 75 Z M20 25 Q50 45 80 25 M20 50 Q50 70 80 50',
  globe: 'M50 8 A42 42 0 1 0 50 92 A42 42 0 1 0 50 8 M8 50 L92 50 M50 8 Q25 50 50 92 M50 8 Q75 50 50 92',
  lock: 'M25 45 L75 45 L75 88 L25 88 Z M35 45 L35 30 Q35 12 50 12 Q65 12 65 30 L65 45',
  dollar: 'M50 8 L50 92 M72 28 Q60 14 45 16 Q26 20 30 38 Q34 52 52 54 Q74 58 70 72 Q64 88 40 84 Q26 80 24 70',
  rocket: 'M50 8 Q72 28 68 62 L32 62 Q28 28 50 8 M32 62 L20 80 L36 74 M68 62 L80 80 L64 74 M50 70 L50 90',
  cloud: 'M28 70 Q8 70 12 50 Q14 34 32 36 Q38 14 60 18 Q78 22 76 40 Q94 42 90 58 Q88 72 72 70 Z',
  clock: 'M50 8 A42 42 0 1 0 50 92 A42 42 0 1 0 50 8 M50 28 L50 52 L68 62',
  person: 'M50 14 A14 14 0 1 0 50 42 A14 14 0 1 0 50 14 M22 90 Q22 52 50 52 Q78 52 78 90',
  chart: 'M12 12 L12 88 L90 88 M24 70 L44 50 L60 62 L88 24',
  gear: 'M50 34 A16 16 0 1 0 50 66 A16 16 0 1 0 50 34 M50 8 L50 22 M50 78 L50 92 M8 50 L22 50 M78 50 L92 50 M20 20 L30 30 M70 70 L80 80 M80 20 L70 30 M30 70 L20 80',
  doc: 'M24 10 L64 10 L80 26 L80 90 L24 90 Z M64 10 L64 26 L80 26 M36 46 L68 46 M36 62 L68 62',
});
/** v2.1 pacing: animations read time through this context. speed<1 stretches an animation, delay (frames) postpones its start. SceneVideo sets it. */
export const TimeCtx = React.createContext<{speed: number; delay: number}>({speed: 1, delay: 0});
export const useCurrentFrame = () => { const f = useRemotionFrame(); const {speed, delay} = React.useContext(TimeCtx); return Math.max(0, f - delay) * speed; };
