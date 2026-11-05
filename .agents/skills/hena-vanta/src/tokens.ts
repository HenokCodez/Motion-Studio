// Hena Vanta design tokens (v6). 1920x1080 @ 30 fps.
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const SAFE = 96; // px margin

export const HV = {
  ink: '#0B0B0F',
  paper: '#FFFFFF',
  red: '#E01E2D',
  blue: '#1673FF',
  green: '#27C75A',
  amber: '#FFB020',
  grey: '#EDEDF0',
  mute: '#8C8C93',
  card: '#F6F6F8',
  line: '#D7D7DD',
} as const;

export const FONT = "Inter, 'Inter Variable', -apple-system, 'Segoe UI', Arial, sans-serif";
export const SHADOW = '0 8px 24px rgba(0,0,0,0.12)';

export type Word = {
  text: string;
  /** frame (relative to the Sequence start) at which the word is SPOKEN */
  frame: number;
  color?: string; // use HV.red for the keyword
  italic?: boolean;
  weight?: number;
  /** stack mode: 0 = first line, 1 = second line (staggered) */
  line?: number;
};
