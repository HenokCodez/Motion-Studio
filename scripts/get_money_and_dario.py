import requests
import io
import time
from PIL import Image
import rembg
from pathlib import Path

session = rembg.new_session("silueta")

dest_dirs = [
    Path(r"D:\Automations\motion-studio\projects\remotion-app\public\images"),
    Path(r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026\assets\images")
]

# Generate falling money transparent graphic directly using PIL
def create_falling_money_graphic():
    w, h = 600, 350
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    # We can draw or download high-res dollar bill
    # Let's download a direct 100 dollar bill graphic
    r = requests.get("https://upload.wikimedia.org/wikipedia/commons/7/7b/Obverse_of_the_series_2009_%24100_Federal_Reserve_Note.jpg", headers={"User-Agent": "Mozilla/5.0"})
    bill = Image.open(io.BytesIO(r.content)).convert("RGBA")
    bill.thumbnail((360, 160))
    # Rotate slightly and paste with drop shadow
    rotated = bill.rotate(18, expand=True, resample=Image.BICUBIC)
    for d in dest_dirs:
        rotated.save(d / "falling_dollar.png", "PNG")
    print("Saved falling_dollar.png!")

create_falling_money_graphic()

# Fetch Dario Amodei from alternate source
try:
    time.sleep(2)
    # TechCrunch Disrupt Dario Amodei
    r = requests.get("https://upload.wikimedia.org/wikipedia/commons/c/cd/Dario_Amodei_at_the_2023_UK_AI_Safety_Summit.jpg", headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}, timeout=15)
    img = Image.open(io.BytesIO(r.content)).convert("RGB")
    if max(img.size) > 800:
        scale = 800 / max(img.size)
        img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)
    out = rembg.remove(img, session=session)
    for d in dest_dirs:
        out.save(d / "dario_amodei.png", "PNG")
    print("Saved dario_amodei.png!")
except Exception as e:
    print(f"Dario error: {e}")
