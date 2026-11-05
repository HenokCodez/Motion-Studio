/** v4: a small, strict vocabulary. Everything is horizontally centred. No arrows, no free coordinates. */
export type LayoutId = "STACK" | "JOURNEY" | "STEPS" | "LIST";

export type BeatType =
  | "none"        // bare footage/media only (budget: <= 25% of runtime)
  | "keyterm" | "stat" | "takeaway" | "quote" | "chapter" | "list" | "steps" | "journey" | "screenshot" | "annotate";

export interface PlaceholderMedia {
  kind: "placeholder";
  /** INSTRUCTION for the user, never spoken words. Format "TYPE: what to show", e.g. "SCREEN RECORDING: Upwork job search results" */
  label: string;
  aspect?: "16:9" | "9:16" | "4:3" | "1:1";
}
export interface ImageMedia {
  kind: "image";
  label: string;              // alt text / what it is
  src: string;                // file inside public/ (captured screenshot or found photo)
  aspect: "16:9" | "9:16" | "4:3" | "1:1" | "3:2";
  /** where it came from + licence/date. REQUIRED for images */
  source: string;
  /** must be set to true by the agent AFTER viewing the file (not a bot-check, consent wall or error page) */
  verified: boolean;
  /** red frame around a region, % of the image; fades in WITH the image (never after) */
  box?: { x: number; y: number; w: number; h: number };
  /** slow zoom into a region once the caption has appeared */
  zoom?: { atSec: number; fx: number; fy: number; scale: number };
}
export type Media = (PlaceholderMedia | ImageMedia) & { atSec?: number; cue?: string };

/** Every timed element names the spoken word it is tied to (`cue`). QA checks atSec against the supplied time-stamped script. */
export interface Timed { atSec?: number; cue?: string }
export interface TextEl extends Timed { text: string }          // **red** keyword(s), __underline__, ^^green^^, ~~struck~~
export interface StatEl extends Timed { template: string; from: number; to: number; decimals?: number; durSec?: number; label?: string }
export interface ItemEl extends Timed { text: string }

export type Graphic =
  | { kind: "blocks"; items: { atSec: number; cue: string }[] }                       // small blocks accumulate into a staircase, one per cue
  | { kind: "progress"; from: number; to: number; atSec: number; cue: string; durSec?: number; check?: boolean }   // bar fills; green check only if to = 100
  | { kind: "compare"; before: { text: string; atSec: number; cue: string }; after: { text: string; atSec: number; cue: string } }; // two cards side by side (no arrows)

export interface Stack {
  /** visual metaphor in the media slot (mutually exclusive with media) */
  graphic?: Graphic;
  media?: Media;
  headline?: TextEl;            // small line above the media (<= 6 words)
  statement?: TextEl & { size?: "xl" | "l" | "m" };   // the one bold line (<= 9 words)
  note?: TextEl;                // regular italic support line (<= 12 words)
  stat?: StatEl;
  itemsTitle?: TextEl;
  items?: (ItemEl & { atSec: number })[];   // centred list, each item appears on its own spoken cue
}

export interface StepItem { text: string; atSec: number; cue: string }
export interface JourneyEvent { id: string; label: string; note: string; /** ISO date, optional; if every event has one, spacing is proportional */ date?: string }
export interface JourneyScene {
  /** event id that this scene is about; events AFTER it are not shown yet */
  focus: string;
  /** the focus of the previous journey scene (continuity: its line + events are already on screen) */
  from?: string;
  /** seconds after scene start when the focus label appears */
  revealSec?: number;
  cue: string;
}

export interface SfxCue { file: string; category: "ui" | "ding" | "error"; atSec: number }

export interface Scene {
  id: string;
  startSec: number;
  endSec: number;
  layout: LayoutId;
  beat: BeatType;
  /** spoken words of this scene (never rendered). Used by QA. */
  vo: string;
  /** one sentence: what this adds beyond the audio (required when anything is shown besides footage) */
  why?: string;
  /** where a number/claim on screen comes from if it is not in the voiceover */
  source?: string;
  stack?: Stack;
  journey?: JourneyScene;
  steps?: { heading?: TextEl; items: StepItem[] };
  list?: { title?: TextEl; items: (ItemEl & { atSec: number })[] };
  sfx?: SfxCue[];
  exit?: "cut" | "fadeOut";
}

export interface Timeline {
  meta: {
    fps: number; width: number; height: number; durationSec: number;
    background: string; backgroundIsVideo: boolean; backgroundDurationSec?: number;
    voiceover: string; textMode: "light" | "dark";
    /** the supplied time-stamped script, imported to this raw file (authoritative timing) */
    timingFile: string;
    /** words you deliberately introduced that were not spoken (checked as real words by you). Anything else not in the transcript fails QA. */
    allowWords?: string[];
    /** the one master timeline of the story, used by JOURNEY scenes across the whole video */
    journey?: { title?: string; events: JourneyEvent[] };
  };
  scenes: Scene[];
}
