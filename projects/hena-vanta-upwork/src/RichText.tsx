import React from "react";
import { COLORS, FONT, LINE_HEIGHT } from "./theme";

export interface RichTextProps {
  text: string; fontSize: number; bold?: boolean; color: string; redColor: string;
  align?: "center" | "left"; maxWidth?: number; underlineAll?: boolean; style?: React.CSSProperties;
}
type Seg = { t: string; kind: "plain" | "red" | "ul" | "green" | "strike" };

/** Markup: **red keyword**  __underline__  ^^green^^  ~~struck~~. Red words are red from the FIRST frame (they are part of the text). */
export const parse = (text: string): Seg[] => {
  if (!text) return [];
  const segs: Seg[] = []; const re = /(\*\*[^*]+\*\*|__[^_]+__|\^\^[^^]+\^\^|~~[^~]+~~)/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) segs.push({ t: text.slice(last, m.index), kind: "plain" });
    const tok = m[0];
    segs.push({ t: tok.slice(2, -2), kind: tok.startsWith("**") ? "red" : tok.startsWith("__") ? "ul" : tok.startsWith("~~") ? "strike" : "green" });
    last = m.index + tok.length;
  }
  if (last < text.length) segs.push({ t: text.slice(last), kind: "plain" });
  return segs;
};
export const plain = (text: string) => parse(text).map((s) => s.t).join("");

export const RichText: React.FC<RichTextProps> = ({ text, fontSize, bold, color, redColor, align = "center", maxWidth, underlineAll, style }) => {
  if (!text) return null;
  return (
  <div data-text={plain(text)} data-role="text" style={{
    fontFamily: FONT, fontStyle: "italic", fontWeight: bold ? 700 : 400, fontSize, lineHeight: LINE_HEIGHT, letterSpacing: 0,
    textAlign: align, color, maxWidth, whiteSpace: "pre-line", textWrap: "balance" as React.CSSProperties["textWrap"], ...style,
  }}>
    {parse(text).map((s, i) => (
      <span key={i} style={{
        color: s.kind === "red" ? redColor : s.kind === "green" ? COLORS.green : color,
        textDecoration: s.kind === "strike" ? "line-through" : s.kind === "ul" || underlineAll ? "underline" : "none",
        textDecorationColor: s.kind === "strike" ? redColor : undefined,
        textDecorationThickness: s.kind === "strike" ? 7 : s.kind === "ul" || underlineAll ? 4 : undefined,
        textUnderlineOffset: s.kind === "ul" || underlineAll ? 8 : undefined,
        textShadow: s.kind === "green" ? "0 0 6px rgba(0,255,15,0.55), 0 0 1px #000" : undefined,
      }}>{s.t}</span>
    ))}
  </div>
  );
};
