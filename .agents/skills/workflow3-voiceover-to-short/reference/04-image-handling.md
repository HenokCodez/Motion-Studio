# 04 - Photos, screenshots, logos and cutouts (do this well - it decides how professional the video looks)

## 1. Which kind of image for which job
| Job | Image kind | Format | Target size | Template |
|---|---|---|---|---|
| A website / app / dashboard / code | **Screenshot** | JPG/PNG | 1600x1000 (16:10) or 1440x900, 2x DPR | HERO_CARD, BADGE_LINE_CARD.card, BADGE_ROW.card |
| A person / real photo | **Photo** | JPG | >= 1000 px short side | HERO_CARD (portrait ok) |
| A physical object (laptop, GPU, printer, phone, box) | **Cutout** | PNG with alpha | 1200-2400 px long side | CUTOUT, HUB_SPOKES center (cutout) |
| A company/product identity | **Logo** | PNG with alpha (from SVG) | square, >= 512 px | any badge |
| Document/doc page / briefing | **Page screenshot** | PNG | 900x1200 (3:4) | CARD_STACK |
| A product mockup (ebook, box) at the end | **Cutout PNG** | PNG alpha | 900x1100 | END_CTA.image |

## 2. Getting images (in this order)
1. **User's files** in the upload / `raw/`: always preferred.
2. **Screenshot the real thing** with your browser tool, or:
   `node scripts/screenshot.mjs https://example.com raw/example.png 1440 900`
   - Capture the **most visual part** (hero section, dashboard), not a wall of text. Accept cookie banners first (script tries). Scroll or crop if needed.
   - Use dark mode of the site/app when available (fits the black grid better).
3. **Official logos**: the company's website header (SVG), its press/brand kit, or its GitHub org avatar. Save to `raw_logos/<name>.png`.
4. **Photos/objects**: only if the user provided them or you can obtain properly licensed/free-to-use ones. If the object is a generic one (laptop, printer) a clean product photo on a plain background + `--cutout` works.
5. **Nothing found** -> letter badge (`"src": ""`) or `NONE`. Do NOT use unrelated stock pictures, and do NOT fabricate fake screenshots of real products.

## 3. Cleaning (always run the script)
```bash
python scripts/prep_images.py raw/ --out public/img                # trims uniform borders, caps at 2400 px, JPG q92
python scripts/prep_images.py raw_logos/ --out public/img --logos  # trims to content, pads to a transparent SQUARE, min 512 px
python scripts/prep_images.py raw_objects/ --out public/img --cutout   # background removal (pip install rembg), then trim
```
Read the output lines: `LOW-RES`, `extreme aspect ratio`, `rembg not installed` are problems to resolve now, not later.
After the script: **open 2-3 of the output files with the image viewer** and check them (see 5).

## 4. Fit rules the renderer applies (so you can predict the result)
- **Cards** (`HERO_CARD`, card in BADGE_LINE_CARD / BADGE_ROW / CARD_STACK): the card takes the image's own aspect ratio, scaled to fit the box (900x820 for HERO). Never cropped, never stretched. Landscape fills the width; portrait fills the height.
- **Upscale cap = 2x.** An image smaller than half its display size will look soft -> find a bigger one or switch to a smaller template (BADGE_ROW card is 880x520 max).
- **Badges**: logo is shown at 58% of the tile, centred, `contain`. White tile by default; `"bg":"black"` for logos that are white/very light. **Check: a black logo on a black tile is invisible; a white logo on a white tile is invisible.**
- **Cutouts**: object centred, `contain`, drop-shadow + ground glow. Alpha edges must be clean (no halo). If rembg leaves a halo/holes, try the other source photo or use `HERO_CARD` instead.
- Text inside screenshots: viewers on a phone cannot read small text. Crop so that the interesting part is big (zoom into the pricing card, the chat bubble, the dashboard graph).

## 5. Quality checklist per image (look at the file!)
- [ ] Sharp at 100% zoom (no JPEG blocks, no pixelation).
- [ ] No leftover browser chrome/cookie banner/blank margins (unless the browser frame IS the point).
- [ ] Content is relevant to the spoken words.
- [ ] Not a duplicate of an image used in the previous scene.
- [ ] Cutout: edges clean, nothing cut off, transparent corners (check by viewing against the grid).
- [ ] Logo: correct brand, recognisable at 100 px, correct tile colour.
- [ ] Contains no personal/private data (emails, tokens, faces of private people) - blur or choose another.

## 6. Composition tips (how the references handle photos)
- **One hero per scene.** Do not show 3 screenshots at once except via `CARD_STACK`.
- **Breathing room**: the card is centred in the upper zone with >= 90 px side margin; there is a clear gap to the caption.
- **Depth, not decoration**: shadow + 1.5px light edge. No extra frames, stickers, arrows, emojis.
- **Variety of aspect**: alternate landscape card -> badges/diagram -> portrait photo -> cutout, so the screen shape changes.
- **Use the slow zoom** (automatic) rather than adding motion yourself.
- Reuse the same visual across 2 chunks with `mediaKey` instead of showing 2 similar images.
