import io
import json
import urllib.request
import urllib.parse
from PIL import Image
import rembg
from pathlib import Path

session = rembg.new_session("silueta")
print("Silueta session loaded successfully!")

headers = {
    "User-Agent": "MotionStudioProducer/1.0 (educational-video-project; info@motionstudio.org)"
}

dest_dirs = [
    Path(r"D:\Automations\motion-studio\projects\remotion-app\public\images"),
    Path(r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026\assets\images")
]

def get_wikimedia_image_url(filename: str) -> str:
    # Use Wikimedia API to get exact image URL
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{urllib.parse.quote(filename)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(api_url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    pages = data.get("query", {}).get("pages", {})
    for _, page in pages.items():
        imageinfo = page.get("imageinfo", [])
        if imageinfo:
            return imageinfo[0]["url"]
    return None

def fetch_and_cutout(wiki_filename: str, output_name: str, direct_url: str = None):
    print(f"\nProcessing {output_name}...")
    try:
        url = direct_url or get_wikimedia_image_url(wiki_filename)
        if not url:
            print(f"Could not find URL for {wiki_filename}")
            return
        print(f"URL: {url}")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        max_dim = 900
        if max(img.size) > max_dim:
            scale = max_dim / max(img.size)
            img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)
        
        print(f"Removing background with silueta...")
        out_img = rembg.remove(img, session=session)
        for d in dest_dirs:
            out_path = d / f"{output_name}.png"
            out_img.save(out_path, "PNG")
        print(f"✅ Saved {output_name}.png!")
    except Exception as e:
        print(f"Error {output_name}: {e}")

# Targets
targets = [
    ("Sam Altman TechCrunch Disrupt 2019 (cropped).jpg", "sam_altman", None),
    ("Dario Amodei (UK AI Safety Summit 2023).jpg", "dario_amodei", None),
    ("Jensen Huang at Computex 2023 keynote.jpg", "jensen_huang", None),
    ("Satya Nadella 2017.jpg", "satya_nadella", None),
    ("Mark Zuckerberg at the 37th G8 summit in Deauville 018 v1.jpg", "mark_zuckerberg", None),
    (None, "bad_luck_brian", "https://i.kym-cdn.com/entries/icons/original/000/009/528/scan_0003.jpg"),
    (None, "patrick_star", "https://upload.wikimedia.org/wikipedia/en/3/33/Patrick_Star.svg")
]

for wiki_file, out_name, d_url in targets:
    fetch_and_cutout(wiki_file, out_name, d_url)

print("\nAll cutouts processed!")
