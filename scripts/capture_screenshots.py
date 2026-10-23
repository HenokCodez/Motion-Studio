"""
Reusable high-DPI screenshot capture script using Playwright.
Captures full 1920px desktop viewports and extracts text bounding boxes for <MarkerHighlight>.
"""

import sys
import os
import json
import argparse
from pathlib import Path

def capture_url(url: str, output_path: str, extract_boxes: bool = True, keywords: list = None):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("[ERROR] Playwright not installed. Run: pip install playwright && playwright install chromium")
        return False

    output_file = Path(output_path).resolve()
    output_file.parent.mkdir(parents=True, exist_ok=True)
    boxes_file = output_file.with_suffix(".boxes.json")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1.5,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        print(f"[NAVIGATING] {url}")
        try:
            page.goto(url, wait_until="networkidle", timeout=25000)
        except Exception:
            page.goto(url, wait_until="domcontentloaded", timeout=15000)

        # Wait a moment for animations/fonts to settle
        page.wait_for_timeout(1500)

        # Capture screenshot
        page.screenshot(path=str(output_file), full_page=False)
        print(f"[SAVED SCREENSHOT] {output_file}")

        # Extract text bounding boxes for target keywords
        boxes = []
        if extract_boxes and keywords:
            for kw in keywords:
                elements = page.query_selector_all(f"text='{kw}'")
                if not elements:
                    # Case-insensitive xpath search
                    elements = page.query_selector_all(f"xpath=//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{kw.lower()}')]")

                for el in elements[:3]:
                    box = el.bounding_box()
                    if box and box["width"] > 0 and box["height"] > 0:
                        # Normalize to percentage of 1920x1080
                        boxes.append({
                            "keyword": kw,
                            "x": round((box["x"] / 1920) * 100, 2),
                            "y": round((box["y"] / 1080) * 100, 2),
                            "width": round((box["width"] / 1920) * 100, 2),
                            "height": round(box["height"], 1)
                        })

        if boxes:
            with open(boxes_file, "w", encoding="utf-8") as f:
                json.dump(boxes, f, indent=2)
            print(f"[SAVED BOUNDING BOXES] {boxes_file} ({len(boxes)} highlights)")

        browser.close()
        return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Capture 1920px web screenshots with text bounding boxes")
    parser.add_argument("url", help="Target website URL")
    parser.add_argument("output", help="Output PNG path")
    parser.add_argument("--keywords", nargs="*", help="Keywords to find bounding boxes for")
    args = parser.parse_args()

    success = capture_url(args.url, args.output, keywords=args.keywords)
    sys.exit(0 if success else 1)
