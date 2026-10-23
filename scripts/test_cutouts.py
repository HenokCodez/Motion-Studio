import io
import urllib.request
from PIL import Image
import rembg
from pathlib import Path

session = rembg.new_session("silueta")
print("Silueta session loaded successfully!")

# Test with Wikimedia URL using proper User-Agent
headers = {
    "User-Agent": "MotionStudioProducer/1.0 (educational-video-project; info@motionstudio.org)"
}

test_urls = {
    "sam_altman": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Sam_Altman_TechCrunch_Disrupt_2019_%28cropped%29.jpg",
    "dario_amodei": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Dario_Amodei_at_the_2023_UK_AI_Safety_Summit.jpg",
    "linus_torvalds": "https://upload.wikimedia.org/wikipedia/commons/0/01/LinuxCon_Europe_Linus_Torvalds_03_%28cropped%29.jpg",
    "jensen_huang": "https://upload.wikimedia.org/wikipedia/commons/c/c4/Jensen_Huang_at_Computex_2023_keynote.jpg",
    "satya_nadella": "https://upload.wikimedia.org/wikipedia/commons/7/78/MS-Executive-Satya-Nadella-cropped.jpg",
}

dest_dirs = [
    Path(r"D:\Automations\motion-studio\projects\remotion-app\public\images"),
    Path(r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026\assets\images")
]

for name, url in test_urls.items():
    print(f"Downloading {name}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        max_dim = 900
        if max(img.size) > max_dim:
            scale = max_dim / max(img.size)
            img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)
        
        print(f"Removing background for {name} with silueta...")
        out_img = rembg.remove(img, session=session)
        for d in dest_dirs:
            out_img.save(d / f"{name}.png", "PNG")
        print(f"Saved {name}.png!")
    except Exception as e:
        print(f"Error {name}: {e}")
