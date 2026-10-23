import urllib.request
import urllib.parse
import json
import shutil
from pathlib import Path

def download_file(url, target_path):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(target_path, "wb") as f:
                f.write(data)
        print(f"Downloaded: {target_path.name} ({len(data)} bytes)")
        return True
    except Exception as e:
        print(f"Failed {url}: {e}")
        return False

def main():
    proj_assets = Path(r"D:\Automations\motion-studio\Channels\VantaBrief\videos\003-Open-Source-Is-Taking-Over-Software-in-2026\assets\images")
    remotion_public = Path(r"D:\Automations\motion-studio\projects\remotion-app\public\assets\images")

    proj_assets.mkdir(parents=True, exist_ok=True)
    remotion_public.mkdir(parents=True, exist_ok=True)

    # 1. Copy Bezos Amazon desk from references
    ref_bezos = Path(r"D:\Automations\motion-studio\Channels\VantaBrief\references\2026-10-22-05-04-30-af78.png")
    if ref_bezos.exists():
        shutil.copy(ref_bezos, proj_assets / "bezos_desk.png")
        shutil.copy(ref_bezos, remotion_public / "bezos_desk.png")
        print("Copied bezos_desk.png from references!")

    # 2. Copy Github and other icons from tag-icons if found in library_index
    tag_icons_dir = Path(r"C:\Users\zakbi\Downloads\tag-icons")
    try:
        for icon_name in ["Github.png", "Google docs.png", "Chat gpt.png", "DeepSeek Harness Desktop logo.png", "FileYt-dlp logo.svg.png"]:
            src = tag_icons_dir / icon_name
            if src.exists():
                shutil.copy(src, proj_assets / icon_name.lower().replace(" ", "_"))
                shutil.copy(src, remotion_public / icon_name.lower().replace(" ", "_"))
                print(f"Copied icon {icon_name}")
    except Exception as e:
        print(f"Notice regarding tag-icons: {e}")

    # 3. Direct high-res official Wikimedia logos for software mentioned in script
    urls = {
        "photoshop.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/512px-Adobe_Photoshop_CC_icon.svg.png",
        "premiere.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Adobe_Premiere_Pro_CC_icon.svg/512px-Adobe_Premiere_Pro_CC_icon.svg.png",
        "aftereffects.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Adobe_After_Effects_CC_icon.svg/512px-Adobe_After_Effects_CC_icon.svg.png",
        "blender.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Blender_logo_no_text.svg/512px-Blender_logo_no_text.svg.png",
        "davinci.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/DaVinci_Resolve_Studio.png/512px-DaVinci_Resolve_Studio.png",
        "libreoffice.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/LibreOffice_Logo_Flat.svg/512px-LibreOffice_Logo_Flat.svg.png",
        "redhat.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Red_Hat_logo.svg/512px-Red_Hat_logo.svg.png",
        "linux.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/512px-Tux.svg.png",
        "supabase.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Supabase_logo.svg/512px-Supabase_logo.svg.png",
        "nvidia.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/512px-Nvidia_logo.svg.png",
        "opensource.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Opensource.svg/512px-Opensource.svg.png",
        "krita.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Calligrakrita-base.svg/512px-Calligrakrita-base.svg.png",
        "gimp.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/The_GIMP_icon_-_gnome.svg/512px-The_GIMP_icon_-_gnome.svg.png"
    }

    for name, url in urls.items():
        dest = proj_assets / name
        if not dest.exists():
            success = download_file(url, dest)
            if success:
                shutil.copy(dest, remotion_public / name)
        else:
            shutil.copy(dest, remotion_public / name)
            print(f"Already exists: {name}")

if __name__ == "__main__":
    main()
