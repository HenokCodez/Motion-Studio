import React from "react";
import { RichText } from "./RichText";
import { easeInOut, progress, softIn, visible } from "./Motion";
import { SLOT, TIER } from "./theme";
import type { Ctx } from "./Stack";
import type { Graphic } from "./types";

/** Simple, calm visual metaphors in the media slot. Centred. No arrows. Every part appears on its spoken cue (softIn). */
export const GraphicView: React.FC<{ g: Graphic; cy: number; c: Ctx }> = ({ g, cy, c }) => {
  const { W, H, fps, frame } = c; const mid = (cy / 100) * H;
  if (g.kind === "blocks") {
    const n = g.items.length; const cols = Math.ceil((Math.sqrt(8 * n + 1) - 1) / 2); const s = 84, gap = 14;
    const pos: { x: number; y: number }[] = []; for (let col = 0, k = 0; col < cols && k < n; col++) for (let r = 0; r <= col && k < n; r++, k++) pos.push({ x: col, y: r });
    const w = cols * (s + gap) - gap, h = cols * (s + gap) - gap;
    return <>{g.items.map((it, i) => !visible(frame, fps, it.atSec) ? null : (
      <div key={i} data-role="graphic" style={{ position: "absolute", left: W / 2 - w / 2 + pos[i].x * (s + gap), top: mid + h / 2 - (pos[i].y + 1) * (s + gap) + gap, width: s, height: s, boxSizing: "border-box", border: `7px solid ${i === n - 1 ? c.red : c.col}`, borderRadius: 10, background: "#fff", zIndex: 1, ...softIn(frame, fps, it.atSec) }} />
    ))}</>;
  }
  if (g.kind === "progress") {
    const bw = 0.56 * W, bh = 46, x = W / 2 - bw / 2; const p = progress(frame, fps, g.atSec, g.durSec ?? 1.6, easeInOut); const v = g.from + (g.to - g.from) * p;
    if (!visible(frame, fps, g.atSec)) return null;
    return (
      <div data-role="graphic" style={{ position: "absolute", inset: 0, zIndex: 1, ...softIn(frame, fps, g.atSec) }}>
        <div style={{ position: "absolute", left: x, top: mid - bh / 2, width: bw, height: bh, border: `7px solid ${c.col}`, borderRadius: 26, boxSizing: "border-box", overflow: "hidden", background: "#fff" }}>
          <div style={{ width: `${v}%`, height: "100%", background: c.red }} />
        </div>
        {[25, 50, 75].map((t) => <div key={t} style={{ position: "absolute", left: x + (bw * t) / 100 - 2, top: mid + bh / 2 + 10, width: 4, height: 18, background: c.col }} />)}
        {g.check && g.to >= 100 && p >= 1 && <svg style={{ position: "absolute", left: W / 2 - 40, top: mid + bh / 2 + 40, width: 80, height: 80 }} viewBox="0 0 80 80"><path d="M12 42 L32 62 L68 18" fill="none" stroke="#00C853" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
    );
  }
  const cw = 0.3 * W, ch = 0.22 * H, gap = 0.04 * W;
  return (<>
    {([["before", W / 2 - gap / 2 - cw, g.before], ["after", W / 2 + gap / 2, g.after]] as const).map(([k, x, it]) => !visible(frame, fps, it.atSec) ? null : (
      <div key={k} data-role="graphic" style={{ position: "absolute", left: x, top: mid - ch / 2, width: cw, height: ch, border: `7px solid ${k === "after" ? c.red : c.col}`, borderRadius: 22, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, zIndex: 1, ...softIn(frame, fps, it.atSec) }}>
        <RichText text={it.text} fontSize={TIER.s + 8} bold color={k === "before" ? c.gray : c.col} redColor={c.red} maxWidth={cw - 40} />
      </div>
    ))}
  </>);
};
export const _slot = SLOT;
