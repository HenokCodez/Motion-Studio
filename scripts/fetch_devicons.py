import urllib.request
from pathlib import Path
import shutil

devicons = {
    "photoshop.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
    "premiere.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg",
    "aftereffects.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg",
    "blender.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg",
    "linux.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    "redhat.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redhat/redhat-original.svg",
    "supabase.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
    "gimp.svg": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gimp/gimp-original.svg",
}

proj_assets = Path(r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026\assets\images")
remotion_public = Path(r"D:\Automations\motion-studio\projects\remotion-app\public\assets\images")

headers = {"User-Agent": "Mozilla/5.0"}
for name, url in devicons.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as r:
            data = r.read()
            p1 = proj_assets / name
            p2 = remotion_public / name
            with open(p1, "wb") as f:
                f.write(data)
            shutil.copy(p1, p2)
            print(f"Success: {name}")
    except Exception as e:
        print(f"Error {name}: {e}")
