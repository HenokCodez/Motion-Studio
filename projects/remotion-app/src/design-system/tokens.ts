// VantaBrief Official Design Tokens (Single Source of Truth)
// Rule R1: Strictly NO sound effects, NO music, NO ducking references.
// Rule R3: Derived strictly from VantaBrief brand files (channel.json, style.md, Episode003Components.tsx).

export const TOKENS = {
  colors: {
    // Canvas & Surfaces (Matte Charcoal Base)
    background: "#231F20",
    backgroundSubtle: "#2C2728",
    surface: "#1C191A",
    surfaceElevated: "#252122",
    
    // Core Typography (Warm Cream)
    textPrimary: "#FAF4D9",
    textMuted: "rgba(250, 244, 217, 0.65)",
    
    // Brand Accents
    primary: "#1677FF",      // VantaBrief Electric Blue
    accentBlue: "#1677FF",   // Tech Glow & Borders
    accentYellow: "#F59E0B", // Marker Highlight & Metric Emphasis
    accentRed: "#EF4444",    // Chapter Card Punch & Critical Stamps
    accentGreen: "#10B981",  // Success Metric
    
    // Structural Borders & Shadows
    borderSubtle: "rgba(250, 244, 217, 0.12)",
    borderActive: "rgba(22, 119, 255, 0.6)",
    glow: "rgba(22, 119, 255, 0.35)",
    badgeBg: "rgba(22, 119, 255, 0.18)",
    stickerBorder: "#FAF4D9",
    stickerShadow: "rgba(0, 0, 0, 0.75)",

    // Backward-compatible aliases for existing components
    text: "#FAF4D9",
    surfaceDark: "#1C191A",
    accentPink: "#EF4444",
    gridColor: "rgba(250, 244, 217, 0.08)",
    charcoal: "#231F20",
    creamLight: "#FAF4D9",
    mutedGray: "rgba(250, 244, 217, 0.65)",
  },
  typography: {
    displayHeadline: "'Panton Rust Black Base', 'Inter', system-ui, sans-serif",
    headline: "'Panton Rust Black Base', 'Inter', system-ui, sans-serif",
    subtitle: "'Yolk Bold', system-ui, sans-serif",
    handwritten: "'Permanent Marker', 'Caveat', cursive",
    code: "'VP Pixel', 'JetBrains Mono', monospace",
    body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamily: {
      sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      code: "'VP Pixel', 'JetBrains Mono', monospace",
      display: "'Panton Rust Black Base', 'Inter', system-ui, sans-serif",
    },
    sizes: {
      headlineLarge: 160,
      headline: 140,
      supporting: 64,
      captions: 56,
      subtext: 48,      // Absolute minimum for content
      placeholder: 40,  // Minimum for placeholder metadata
    },
    maxWordsPerBlock: 7,
  },
  layout: {
    width: 1920,
    height: 1080,
    safeMargin: 80,
    centerSubjectWidth: 0.70,     // Subject kept in central 70%
    bottomCaptionReserve: 0.15,   // Bottom 15% (162px) reserved for captions
  },
  motion: {
    inFrames: 8,
    outFrames: 6,
    maxShotDurationFrames: 90,     // Hard limit: 3.0s at 30fps
    minCutIntervalFrames: 45,      // 1.5s at 30fps
    springs: {
      hook: { damping: 14, stiffness: 200, mass: 0.6 },
      popIn: { damping: 11, stiffness: 230, mass: 0.45 },
      punchy: { damping: 9, stiffness: 280, mass: 0.35 },
      card: { damping: 16, stiffness: 180, mass: 0.7 },
      gentle: { damping: 18, stiffness: 140, mass: 0.8 },
      exitFast: { damping: 15, stiffness: 300, mass: 0.3 },
    },
  },
  animation: {
    inFrames: 8,
    outFrames: 6,
    springs: {
      hook: { damping: 14, stiffness: 200, mass: 0.6 },
      popIn: { damping: 11, stiffness: 230, mass: 0.45 },
      punchy: { damping: 9, stiffness: 280, mass: 0.35 },
      card: { damping: 16, stiffness: 180, mass: 0.7 },
      gentle: { damping: 18, stiffness: 140, mass: 0.8 },
      exitFast: { damping: 15, stiffness: 300, mass: 0.3 },
    },
    spring: { damping: 9, stiffness: 280, mass: 0.35 },
    pop: { damping: 11, stiffness: 230, mass: 0.45 },
    gentle: { damping: 18, stiffness: 140, mass: 0.8 },
  },
};

export type DesignTokens = typeof TOKENS;
