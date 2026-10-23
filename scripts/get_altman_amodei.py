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
    "User-Agent": "MotionStudioProducer/1.0 (educational-video-project; info@motionstudio.org)"
}

def download_and_cutout(url, name):
    print(f"Downloading {name}...")
    try:
        r = requests.get(url, headers=headers, timeout=30)
        r.raise_for_status()
        img = Image.open(io.BytesIO(r.content)).convert("RGB")
        if max(img.size) > 900:
            scale = 900 / max(img.size)
            img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)
        print(f"Removing background for {name}...")
        cutout = rembg.remove(img, session=session)
        for d in dest_dirs:
            cutout.save(d / f"{name}.png", "PNG")
        print(f"[OK] Saved {name}.png")
    except Exception as e:
        print(f"[Error] {name}: {e}")

# 1. Sam Altman
download_and_cutout(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg/800px-Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg",
    "sam_altman"
)

# 2. Dario Amodei
download_and_cutout(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Dario_Amodei_at_the_2023_UK_AI_Safety_Summit.jpg/800px-Dario_Amodei_at_the_2023_UK_AI_Safety_Summit.jpg",
    "dario_amodei"
)

# 3. Mark Zuckerberg
download_and_cutout(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/800px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg",
    "mark_zuckerberg"
)
