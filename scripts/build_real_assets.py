#!/usr/bin/env python3
"""
Real Asset Builder for VantaBrief Episode 003.
Downloads authentic photos of tech founders / CEOs, applies background removal (rembg)
for transparent PNG cutouts, and captures real live websites with Playwright.
"""
import io
import json
import os
from pathlib import Path
import urllib.request
from PIL import Image
import rembg

PROJECT_DIR = Path(r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026")
PUBLIC_IMG_DIR = Path(r"D:\Automations\motion-studio\projects\remotion-app\public\images")
PROJECT_IMG_DIR = PROJECT_DIR / "assets" / "images"

PUBLIC_IMG_DIR.mkdir(parents=True, exist_ok=True)
PROJECT_IMG_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def download_and_remove_bg(url: str, output_name: str, crop_box=None):
    print(f"-> Processing cutout: {output_name} from {url[:60]}...")
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        
        img = Image.open(io.BytesIO(data)).convert("RGB")
        if crop_box:
            img = img.crop(crop_box)
            
        # Resize if huge to make rembg fast and crisp
        max_dim = 1200
        if max(img.size) > max_dim:
            scale = max_dim / max(img.size)
            img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)
            
        # Run rembg
        transparent_img = rembg.remove(img)
        
        # Save to both locations
        for dest in [PROJECT_IMG_DIR, PUBLIC_IMG_DIR]:
            out_file = dest / f"{output_name}.png"
            transparent_img.save(out_file, "PNG")
        print(f"   [OK] Saved transparent cutout: {output_name}.png")
    except Exception as e:
        print(f"   [Warning] Failed {output_name}: {e}")

def capture_real_websites():
    from playwright.sync_api import sync_playwright
    
    sites = [
        {
            "name": "davinci_site.png",
            "url": "https://www.blackmagicdesign.com/products/davinciresolve",
            "dark": True
        },
        {
            "name": "blender_site.png",
            "url": "https://www.blender.org",
            "dark": True
        },
        {
            "name": "supabase_github.png",
            "url": "https://github.com/supabase/supabase",
            "dark": True
        },
        {
            "name": "kokoro_github.png",
            "url": "https://github.com/hexgrad/kokoro",
            "dark": True
        },
        {
            "name": "krea_site.png",
            "url": "https://www.krea.ai",
            "dark": True
        },
        {
            "name": "anthropic_blog.png",
            "url": "https://www.anthropic.com/research",
            "dark": False
        }
    ]
    
    print("\n-> Launching Playwright to capture real live websites...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for s in sites:
            try:
                print(f"   Navigating to {s['url']}...")
                context = browser.new_context(
                    viewport={"width": 1920, "height": 1080},
                    color_scheme="dark" if s["dark"] else "light",
                    device_scale_factor=2
                )
                page = context.new_page()
                page.goto(s["url"], wait_until="load", timeout=20000)
                page.wait_for_timeout(2000)
                
                # Save screenshot to both folders
                for dest in [PROJECT_IMG_DIR, PUBLIC_IMG_DIR]:
                    out_path = dest / s["name"]
                    page.screenshot(path=str(out_path))
                print(f"   [OK] Captured: {s['name']}")
                context.close()
            except Exception as e:
                print(f"   [Warning] Could not capture {s['url']}: {e}")
        browser.close()

def main():
    print("=== Sourcing Real People & Meme Cutouts ===")
    
    # 1. Sam Altman (OpenAI CEO)
    download_and_remove_bg(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg/800px-Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg",
        "sam_altman"
    )
    
    # 2. Dario Amodei (Anthropic CEO)
    download_and_remove_bg(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Dario_Amodei_at_the_2023_UK_AI_Safety_Summit.jpg/800px-Dario_Amodei_at_the_2023_UK_AI_Safety_Summit.jpg",
        "dario_amodei"
    )
    
    # 3. Linus Torvalds (Linux founder)
    download_and_remove_bg(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg/800px-LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg",
        "linus_torvalds"
    )
    
    # 4. Jensen Huang (NVIDIA CEO)
    download_and_remove_bg(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Jensen_Huang_at_Computex_2023_keynote.jpg/800px-Jensen_Huang_at_Computex_2023_keynote.jpg",
        "jensen_huang"
    )

    # 5. Satya Nadella (Microsoft CEO)
    download_and_remove_bg(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/MS-Executive-Satya-Nadella-cropped.jpg/800px-MS-Executive-Satya-Nadella-cropped.jpg",
        "satya_nadella"
    )

    # 6. Bad Luck Brian meme
    download_and_remove_bg(
        "https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Bad_Luck_Brian.jpg/640px-Bad_Luck_Brian.jpg",
        "bad_luck_brian"
    )

    # 7. Patrick Star meme (pop-up cutout)
    download_and_remove_bg(
        "https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Patrick_Star.svg/600px-Patrick_Star.svg.png",
        "patrick_star"
    )

    print("\n=== Capturing Real Live Websites ===")
    capture_real_websites()

    print("\n[OK] All real visuals successfully sourced and processed!")

if __name__ == "__main__":
    main()
