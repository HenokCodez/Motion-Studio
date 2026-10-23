#!/usr/bin/env python3
"""
Playwright Web Capture Utility for Motion Studio.
Captures high-resolution, reproducible screenshots of authorized public pages or interfaces,
saves them into the project's assets/images/generated/, and logs provenance into manifests/assets.json.
"""
import argparse
from datetime import datetime
import json
import os
from pathlib import Path
import re
import sys


def capture_url(
    url: str,
    output_dir: Path,
    filename: str = None,
    width: int = 1920,
    height: int = 1080,
    wait_until: str = "networkidle",
    selector: str = None,
    dark_mode: bool = True
):
    from playwright.sync_api import sync_playwright

    output_dir = Path(output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    if not filename:
        slug = re.sub(r"[^A-Za-z0-9_-]+", "-", url.split("//")[-1]).strip("-")[:40]
        filename = f"capture-{slug}.png"
    if not filename.endswith(".png"):
        filename += ".png"

    output_file = output_dir / filename

    print(f"-> Launching headless browser to capture: {url}")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": width, "height": height},
            color_scheme="dark" if dark_mode else "light",
            device_scale_factor=2,  # Retina high-DPI capture
        )
        page = context.new_page()

        try:
            page.goto(url, wait_until=wait_until, timeout=30000)
            page.wait_for_timeout(1000)  # Allow subtle CSS animations to settle
        except Exception as e:
            print(f"Warning: Navigation note: {e}")

        if selector:
            element = page.wait_for_selector(selector, timeout=10000)
            element.screenshot(path=str(output_file))
        else:
            page.screenshot(path=str(output_file), full_page=False)

        browser.close()

    print(f"-> Captured screenshot: {output_file}")
    return output_file


def main():
    parser = argparse.ArgumentParser(description="Web Screenshot Capture with Playwright")
    parser.add_argument("url", help="URL to capture")
    parser.add_argument("--out", required=True, help="Output directory or filepath")
    parser.add_argument("--filename", help="Optional output filename")
    parser.add_argument("--width", type=int, default=1920)
    parser.add_argument("--height", type=int, default=1080)
    parser.add_argument("--selector", help="Optional CSS selector for targeted element capture")
    parser.add_argument("--light", action="store_true", help="Force light color scheme")

    args = parser.parse_args()
    capture_url(
        url=args.url,
        output_dir=Path(args.out),
        filename=args.filename,
        width=args.width,
        height=args.height,
        selector=args.selector,
        dark_mode=not args.light,
    )


if __name__ == "__main__":
    main()
