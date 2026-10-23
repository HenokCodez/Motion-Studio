import urllib.request
from pathlib import Path
import shutil

simple_icons = {
    "davinci.svg": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/davinciresolve.svg",
    "libreoffice.svg": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/libreoffice.svg",
    "nvidia.svg": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nvidia.svg",
    "openai.svg": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg",
    "microsoft.svg": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoft.svg",
    "apple.svg": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg",
    "python.svg": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/python.svg",
    "git.svg": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/git.svg",
    "docker.svg": "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/docker.svg",
}

proj_assets = Path(r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026\assets\images")
remotion_public = Path(r"D:\Automations\motion-studio\projects\remotion-app\public\assets\images")

headers = {"User-Agent": "Mozilla/5.0"}
for name, url in simple_icons.items():
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
