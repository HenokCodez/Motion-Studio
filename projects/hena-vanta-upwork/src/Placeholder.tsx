import React from "react";
import { FONT } from "./theme";

export interface Placeholder { kind: "card" | "footage" | "phone" | "figure"; label: string; aspect?: string }
const PHONE = { radius: 28 };

export const aspectToRatio = (a?: string): number => {
  const m = /^(\d+):(\d+)$/.exec(a ?? "16:9");
  return m ? Number(m[1]) / Number(m[2]) : 16 / 9;
};

const TAG: Record<Placeholder["kind"], string> = {
  card: "SCREENSHOT HERE",
  footage: "FOOTAGE HERE",
  phone: "PHONE CLIP HERE",
  figure: "ART / FIGURE HERE",
};

export const fmtTc = (sec: number, fps: number) => {
  const total = Math.max(0, sec);
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  const f = Math.round((total - Math.floor(total)) * fps);
  return `${m}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

export const PlaceholderBox: React.FC<{
  ph: Placeholder;
  rect: { x: number; y: number; w: number; h: number };
  sceneId: string;
  startSec: number;
  endSec: number;
  fps: number;
}> = ({ ph, rect, sceneId, startSec, endSec, fps }) => {
  const radius = ph.kind === "phone" ? PHONE.radius : 0;
  return (
    <div
      data-role="placeholder"
      data-label={ph.label}
      data-rect={`${rect.x},${rect.y},${rect.w},${rect.h}`}
      style={{
        position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h,
        background: "#1A1A1A", border: "1px solid #444", borderRadius: radius,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)", boxSizing: "border-box",
        fontFamily: FONT, color: "#fff", fontStyle: "normal",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
        textAlign: "center", padding: 32,
      }}
    >
      <div style={{ position: "absolute", inset: 16, border: "3px dashed rgba(255,255,255,0.35)", borderRadius: Math.max(0, radius - 12), pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 28, top: 22, fontSize: 18, opacity: 0.6 }}>{sceneId}</div>
      <div style={{ fontSize: Math.min(40, rect.w / 12), fontWeight: 700, letterSpacing: 2 }}>{TAG[ph.kind]}</div>
      <div style={{ fontSize: Math.min(28, rect.w / 16), maxWidth: rect.w * 0.8, lineHeight: 1.2 }}>{ph.label}</div>
      <div style={{ fontSize: 22, opacity: 0.7 }}>
        {fmtTc(startSec, fps)} - {fmtTc(endSec, fps)} ({(endSec - startSec).toFixed(1)} s) {ph.aspect ?? "16:9"}
      </div>
    </div>
  );
};
