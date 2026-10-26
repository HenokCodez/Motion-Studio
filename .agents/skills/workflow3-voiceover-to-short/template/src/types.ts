// ============================================================================
// types.ts — the ONLY allowed storyboard vocabulary. If a template or field is
// not in this file, it does not exist. Do not invent new ones.
// All times are in SECONDS on the voiceover timeline (absolute, not per-scene).
// ============================================================================
export type Word = { t: string; s: number; e: number; b?: boolean };

/** Image living in public/. `src` is relative to public/ (e.g. "img/cursor.png"). */
export type ImgRef = {
  src: string;
  w: number; // natural pixel width  (filled by scripts/prep_images.py)
  h: number; // natural pixel height
  bg?: 'white' | 'black'; // badge background (default white)
  alt?: string;
};

export type Media =
  | { type: 'NONE' }
  | { type: 'HERO_CARD'; image: ImgRef; tilt?: 'none' | 'left' | 'right' }
  | { type: 'CUTOUT'; image: ImgRef; scale?: number } // transparent PNG object
  | { type: 'BADGE_LINE_CARD'; badges: ImgRef[]; card: ImgRef }
  | { type: 'HUB_SPOKES'; center: ImgRef; centerKind?: 'badge' | 'cutout'; spokes: ImgRef[] }
  | { type: 'ORBIT'; center: ImgRef; orbiters: ImgRef[] }
  | { type: 'BADGE_ROW'; badges: ImgRef[]; card?: ImgRef; shape?: 'circle' | 'square' }
  | { type: 'CARD_STACK'; cards: ImgRef[]; badges?: ImgRef[] }
  | { type: 'PROGRESS_BAR'; from: number; to: number; label?: string }
  | { type: 'WORDMARK'; text: string }
  | { type: 'ICON_SCATTER'; glyph: string }
  | {
      type: 'END_CTA';
      top: string; // e.g. "Comment"
      keyword?: string; // e.g. "BOT"  (rendered big, in quotes)
      image?: ImgRef;
      bottom?: string; // e.g. "and I will send you the guide"
      bottomBold?: string; // substring of bottom to embolden
    };

export type BulletIcon = 'x' | 'arrow' | 'sparkle' | 'check';

export type Caption =
  | { mode: 'WORDS'; words: Word[] }
  | { mode: 'BULLETS'; icon: BulletIcon; items: { text: string; at: number; bold?: string }[] }
  | { mode: 'BIG_STAT'; words: Word[]; stat: string; statAt: number }
  | { mode: 'NONE' };

export type Scene = {
  id: string;
  start: number; // seconds
  end: number; // seconds
  media: Media;
  mediaKey?: string; // same key on consecutive scenes = media stays on screen, no re-entry
  caption: Caption;
  note?: string; // free text for humans (ignored by renderer)
};

export type Storyboard = {
  meta: {
    fps: number; // 30
    durationSec: number; // = audio length
    audio: string; // file in public/, e.g. "voiceover.mp3"
    brand: string; // watermark text, '' to hide
    grid: 'video' | 'procedural';
  };
  scenes: Scene[];
};
