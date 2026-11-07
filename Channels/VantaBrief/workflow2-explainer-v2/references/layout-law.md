# layout-law.md — LAW. bounds-check.py enforces it. Canvas 1920x1080 landscape long-form only (no vertical/shorts).

1. **Safe frame**: x 154-1766, y 86-994. Nothing crosses it (strokes, rotated corners, glow included). Exceptions: background, and camera/slide entrances that are fully inside at rest.
2. **Minimum text size: 24 px font-size for ANY text, no exceptions** (chips, axis labels, captions on photos, logo names). Recommended: small label 28, label 36-44, card title 44-56, card body 32-36, scene title 72-96 (Inter ExtraBold, cream), hero stat 260-340 (Inter ExtraBold, orange). Max: scene title 110, label 72.
3. **Footprints** (relative to safe frame): single object <= 32% of frame width (~614 px); 2-up 40% each; 3-up 26.6% each (510 px); 4-up 19% each. Primary group <= 84% of frame width, <= 65% height. Full-width 3-row allowed in at most 1 scene in 4.
4. **Spacing**: gap between objects >= 40 px; text-to-border padding >= 28 px; text never touches a stroke.
5. **Counts**: <= 4 primary objects and 1 focal point per scene at rest.
6. **Titles**: one line, left edge on safe frame (x=154) or centered; width <= 1612. Auto-fit with font-fit.js; if the fitted size would be < 56 px, wrap to 2 lines at a word boundary. Never clip. Title top y >= 86.
7. **Camera**: rest zoom 1.0 = layout above. Zoom-in > 1.25 only transient (<= 24 frames). Zoom-out reveals must end inside the safe frame.
8. **Verification**: bounds-check.py samples every 15 frames plus keyframe boundaries, and fails on: outside safe frame, text < 24 px, overlap < 40 px gap (unless connector), >4 primary objects, text overflowing its card (scrollWidth > clientWidth). On failure run font-fit.js, rescale, re-check.
9. **Markup contract** (what the checker reads): every primary object has `data-box`; every connector `data-connector`; every text element is a real DOM/SVG text node with computed font-size. No text baked into images.
