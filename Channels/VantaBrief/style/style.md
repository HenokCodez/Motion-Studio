# VantaBrief Programmatic Style Tokens

## CSS & React Design Tokens
```typescript
export const VANTA_STYLE = {
  colors: {
    bg: "#231F20",
    bgSubtle: "#2C2728",
    surface: "#1C191A",
    surfaceElevated: "#252122",
    primary: "#1677FF",
    textPrimary: "#FAF4D9",
    textMuted: "rgba(250, 244, 217, 0.65)",
    border: "rgba(250, 244, 217, 0.12)",
    glow: "rgba(22, 119, 255, 0.35)",
    badgeBg: "rgba(22, 119, 255, 0.18)",
  },
  fonts: {
    display: "'Panton Rust Black Base', sans-serif",
    subtitle: "'Yolk Bold', sans-serif",
    pixel: "'VP Pixel', monospace",
    fallback: "system-ui, -apple-system, sans-serif",
  },
  springs: {
    hook: { damping: 14, stiffness: 200, mass: 0.6 },
    card: { damping: 16, stiffness: 180, mass: 0.7 },
    gentle: { damping: 18, stiffness: 140, mass: 0.8 },
  },
  radii: {
    card: "20px",
    badge: "8px",
    pill: "9999px",
  },
};
```
