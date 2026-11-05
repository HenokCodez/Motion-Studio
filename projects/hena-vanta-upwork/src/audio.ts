/** Peak level (dBFS) each SFX category should hit in the FINAL mix. Source files are pre-normalised to -6 dBFS peak by scripts/prep-sfx.mjs. */
export const PREPPED_PEAK_DBFS = -6;

/** v4 SFX policy: NEVER on text/diagrams. Only an image/screenshot card entering (ui), a chapter card (ding), nothing else. */
export const SFX_PEAK_DBFS: Record<string, number> = { ui: -20, ding: -19, error: -18 };

export const dbToLin = (db: number) => Math.pow(10, db / 20);

/** Linear gain to apply to a prepped SFX file. */
export const sfxGain = (category: string): number => dbToLin((SFX_PEAK_DBFS[category] ?? -20) - PREPPED_PEAK_DBFS);
