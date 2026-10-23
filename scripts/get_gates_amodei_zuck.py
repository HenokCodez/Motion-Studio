import requests
import io
from PIL import Image
import rembg
from pathlib import Path

session = rembg.new_session("silueta")
print("Silueta loaded.")

dest_dirs = [
    Path(r"D:\Automations\motion-studio\projects\remotion-app\public\images"),
    Path(r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026\assets\images")
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

items = [
    ("https://upload.wikimedia.org/wikipedia/commons/d/d9/Bill_Gates_at_the_European_Commission_-_P067383-987995_%28cropped%29_5.jpg", "bill_gates"),
    ("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg/1280px-Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg", "dario_amodei"),
    ("https://upload.wikimedia.org/wikipedia/commons/1/12/P20260929DT-1655_%2855561811540%29_%28cropped_2%29.jpg", "mark_zuckerberg"),
]

for url, name in items:
    print(f"Downloading {name}...")
    try:
        r = requests.get(url, headers=headers, timeout=20)
        r.raise_for_status()
        img = Image.open(io.BytesIO(r.content)).convert("RGB")
        if max(img.size) > 900:
            scale = 900 / max(img.size)
            img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)
        print(f"Cutting out {name}...")
        cutout = rembg.remove(img, session=session)
        for d in dest_dirs:
            cutout.save(d / f"{name}.png", "PNG")
        print(f"Saved {name}.png successfully!")
    except Exception as e:
        print(f"Failed {name}: {e}")

print("Done!")
