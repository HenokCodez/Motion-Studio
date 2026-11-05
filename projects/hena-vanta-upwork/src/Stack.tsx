import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { PlaceholderBox } from "./Placeholder";
import { RichText } from "./RichText";
import { countValue, easeInOut, softIn, visible } from "./Motion";
import { GraphicView } from "./Graphic";
import { MOTION, SLOT, TIER } from "./theme";
import type { ImageMedia, Media, Scene, TextEl } from "./types";

export interface Ctx { W: number; H: number; fps: number; frame: number; col: string; red: string; gray: string; mode: "preview" | "overlay" }

const ratio = (a?: string) => { const m = /^(\d+):(\d+)$/.exec(a ?? "16:9"); return m ? +m[1] / +m[2] : 16 / 9; };
const mediaW = (a?: string) => (a === "9:16" ? SLOT.media.w9x16 : a === "4:3" ? SLOT.media.w4x3 : a === "1:1" ? SLOT.media.w1x1 : a === "3:2" ? SLOT.media.w3x2 : SLOT.media.w16x9);

/** one horizontally centred line/block at a vertical slot, entering with softIn */
const Slot: React.FC<{ y: number; at: number; c: Ctx; children: React.ReactNode; w?: number }> = ({ y, at, c, children, w = 72 }) =>
  !visible(c.frame, c.fps, at) ? null : (
    <div style={{ position: "absolute", left: ((50 - w / 2) / 100) * c.W, width: (w / 100) * c.W, top: (y / 100) * c.H, transform: "translateY(-50%)", zIndex: 2, display: "flex", justifyContent: "center" }}>
      <div style={softIn(c.frame, c.fps, at)}>{children}</div>
    </div>
  );
const T: React.FC<{ el: TextEl; size: number; bold?: boolean; c: Ctx; gray?: boolean }> = ({ el, size, bold = true, c, gray }) => (
  <RichText text={el.text} fontSize={size} bold={bold} color={gray ? c.gray : c.col} redColor={c.red} maxWidth={0.72 * c.W} />
);

export const MediaBox: React.FC<{ m: Media; cy: number; scene: Scene; c: Ctx }> = ({ m, cy, scene, c }) => {
  const at = m.atSec ?? 0;
  if (!visible(c.frame, c.fps, at)) return null;
  const pw = (mediaW(m.aspect) / 100) * c.W, ph = pw / ratio(m.aspect);
  const rect = { x: c.W / 2 - pw / 2, y: (cy / 100) * c.H - ph / 2, w: pw, h: ph };
  const t = c.frame / c.fps;
  const scale = 1 + MOTION.imagePushPerSec * Math.max(0, t - at);
  const enter = softIn(c.frame, c.fps, at);
  if (m.kind === "placeholder") {
    if (c.mode === "overlay") return null;
    return <div data-role="media" data-kind="placeholder" data-rect={`${rect.x.toFixed(0)},${rect.y.toFixed(0)},${rect.w.toFixed(0)},${rect.h.toFixed(0)}`} style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 1 }}>
      <PlaceholderBox ph={{ kind: m.aspect === "9:16" ? "phone" : "footage", label: m.label, aspect: m.aspect }} rect={rect} sceneId={scene.id} startSec={scene.startSec + at} endSec={scene.endSec} fps={c.fps} />
    </div>;
  }
  const im = m as ImageMedia;
  const z = im.zoom ? interpolate(t, [im.zoom.atSec, im.zoom.atSec + 0.9], [1, im.zoom.scale], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut }) : 1;
  return (
    <div data-role="media" data-kind="image" data-rect={`${rect.x.toFixed(0)},${rect.y.toFixed(0)},${rect.w.toFixed(0)},${rect.h.toFixed(0)}`} style={{ position: "absolute", inset: 0, zIndex: 1, ...enter }}>
      <div style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, transform: `scale(${scale})`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", border: "8px solid #fff", boxSizing: "border-box", boxShadow: "0 10px 30px rgba(0,0,0,0.28)", background: "#fff" }}>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: im.zoom ? `${im.zoom.fx}% ${im.zoom.fy}%` : "50% 50%" }}>
            <Img src={staticFile(im.src)} alt={im.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {im.box && <div style={{ position: "absolute", left: `${im.box.x}%`, top: `${im.box.y}%`, width: `${im.box.w}%`, height: `${im.box.h}%`, border: "6px solid #E8181F", borderRadius: 8, boxSizing: "border-box" }} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StackView: React.FC<{ scene: Scene; c: Ctx }> = ({ scene, c }) => {
  const s = scene.stack ?? {};
  const hasMedia = !!s.media || !!s.graphic;
  const mediaCy = s.headline ? SLOT.mediaWithHeadlineCy : SLOT.media.cy;
  const tall = s.media?.aspect === "9:16";
  const stSize = TIER[s.statement?.size ?? "l"];
  return (
    <>
      {s.graphic && <GraphicView g={s.graphic} cy={SLOT.media.cy} c={c} />}
      {s.media && <MediaBox m={s.media} cy={tall ? 40 : mediaCy} scene={scene} c={c} />}
      {s.headline && <Slot y={SLOT.headline} at={s.headline.atSec ?? 0} c={c}><T el={s.headline} size={TIER.m} c={c} /></Slot>}
      {s.statement && <Slot y={hasMedia ? SLOT.statementUnderMedia : SLOT.statement} at={s.statement.atSec ?? 0} c={c}><T el={s.statement} size={stSize} c={c} /></Slot>}
      {s.note && <Slot y={hasMedia ? SLOT.noteUnderMedia : SLOT.note} at={s.note.atSec ?? 0} c={c}><T el={s.note} size={TIER.s} bold={false} c={c} gray /></Slot>}
      {s.stat && (() => {
        const st = s.stat, at = st.atSec ?? 0;
        const v = countValue(c.frame, c.fps, at, st.from, st.to, st.durSec);
        const txt = st.template.replace("{n}", v.toLocaleString("en-US", { minimumFractionDigits: st.decimals ?? 0, maximumFractionDigits: st.decimals ?? 0 }));
        return (<>
          <Slot y={SLOT.stat} at={at} c={c}><RichText text={txt} fontSize={TIER.xl} bold color={c.col} redColor={c.red} /></Slot>
          {st.label && <Slot y={SLOT.statLabel} at={at} c={c}><RichText text={st.label} fontSize={TIER.m} bold color={c.col} redColor={c.red} /></Slot>}
        </>);
      })()}
      {s.itemsTitle && <Slot y={SLOT.itemsTitle} at={s.itemsTitle.atSec ?? 0} c={c}><T el={s.itemsTitle} size={TIER.m} c={c} /></Slot>}
      {(s.items ?? []).map((it, i) => <Slot key={i} y={SLOT.itemsStart + i * SLOT.itemsStep} at={it.atSec} c={c}><T el={it} size={TIER.l} c={c} /></Slot>)}
    </>
  );
};
export const ListView: React.FC<{ scene: Scene; c: Ctx }> = ({ scene, c }) => {
  const l = scene.list; if (!l) return null;
  const title = typeof l.title === "string" ? { text: l.title, atSec: 0 } : l.title;
  return (<>
    {title && <Slot y={SLOT.itemsTitle} at={title.atSec ?? 0} c={c}><RichText text={title.text} fontSize={TIER.l} bold color={c.col} redColor={c.red} underlineAll /></Slot>}
    {l.items.map((it, i) => <Slot key={i} y={SLOT.itemsStart + i * SLOT.itemsStep} at={it.atSec} c={c}><RichText text={it.text} fontSize={TIER.m} bold color={c.col} redColor={c.red} /></Slot>)}
  </>);
};
export { Slot };
