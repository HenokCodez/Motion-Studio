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

figures = [
    ("Sam_Altman", "sam_altman"),
    ("Jensen_Huang", "jensen_huang"),
    ("Satya_Nadella", "satya_nadella"),
    ("Mark_Zuckerberg", "mark_zuckerberg"),
    ("Jeff_Bezos", "jeff_bezos"),
    ("Bill_Gates", "bill_gates"),
    ("Linus_Torvalds", "linus_torvalds"),
]

for title, out_name in figures:
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=800"
    print(f"\nQuerying Wikipedia for {title}...")
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        pages = data.get("query", {}).get("pages", {})
        thumb_url = None
        for _, page in pages.items():
            if "thumbnail" in page:
                thumb_url = page["thumbnail"]["source"]
                break
        
        if not thumb_url:
            print(f"No thumbnail found for {title}")
            continue
            
        print(f"Downloading from {thumb_url}...")
        img_req = urllib.request.Request(thumb_url, headers=headers)
        with urllib.request.urlopen(img_req, timeout=15) as resp:
            img_bytes = resp.read()
            
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        print(f"Removing background for {out_name}...")
        cutout = rembg.remove(img, session=session)
        
        for d in dest_dirs:
            out_file = d / f"{out_name}.png"
            cutout.save(out_file, "PNG")
        print(f"✅ Successfully created {out_name}.png!")
    except Exception as e:
        print(f"Error {title}: {e}")

print("\nAll figures finished!")
