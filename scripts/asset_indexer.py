#!/usr/bin/env python3
"""
Local Asset Indexer and Discovery Tool.
Scans local asset directories, extracts technical metadata with FFprobe and PIL,
creates searchable offline JSON indexes, and tracks asset provenance and licensing.
"""
import json
import os
import re
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

AUDIO_EXTS = {".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg", ".opus"}
VIDEO_EXTS = {".mp4", ".mov", ".mkv", ".webm", ".avi", ".m4v"}
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".bmp", ".tiff"}
FONT_EXTS = {".ttf", ".otf", ".woff", ".woff2"}

def run_ffprobe(file_path: Path):
    """Run ffprobe to get JSON metadata for audio/video files."""
    ffprobe_cmd = shutil.which("ffprobe")
    if not ffprobe_cmd:
        return None

    cmd = [
        ffprobe_cmd,
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        str(file_path)
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return json.loads(res.stdout)
    except Exception:
        return None

def detect_category(file_path: Path, ext: str, duration: float = 0.0) -> str:
    """Heuristic category detection based on path, extension, and duration."""
    lower_path = str(file_path).lower()
    if ext in AUDIO_EXTS:
        if "voice" in lower_path or "narration" in lower_path:
            return "voice"
        if "sfx" in lower_path or "sound effect" in lower_path or (duration > 0 and duration <= 15.0):
            return "sfx"
        return "music"
    if ext in VIDEO_EXTS:
        if "b-roll" in lower_path or "broll" in lower_path:
            return "b-roll"
        return "video"
    if ext in IMAGE_EXTS:
        if "logo" in lower_path:
            return "logos"
        if "icon" in lower_path or ext == ".svg":
            return "icons"
        if "b-roll" in lower_path or "broll" in lower_path or "photo" in lower_path:
            return "b-roll"
        return "images"
    if ext in FONT_EXTS:
        return "fonts"
    return "other"

def inspect_file(file_path: Path) -> dict:
    """Extract metadata for an individual media file."""
    stat = file_path.stat()
    ext = file_path.suffix.lower()
    item = {
        "filename": file_path.name,
        "path": str(file_path.resolve()),
        "size_bytes": stat.st_size,
        "modified_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
        "extension": ext,
        "type": "unknown",
        "category": "other",
        "duration": None,
        "width": None,
        "height": None,
        "fps": None,
        "codec": None,
        "sample_rate": None,
        "channels": None
    }

    if ext in AUDIO_EXTS:
        item["type"] = "audio"
        info = run_ffprobe(file_path)
        if info:
            fmt = info.get("format", {})
            try:
                item["duration"] = round(float(fmt.get("duration", 0)), 2)
            except (ValueError, TypeError):
                pass
            streams = info.get("streams", [])
            for s in streams:
                if s.get("codec_type") == "audio":
                    item["codec"] = s.get("codec_name")
                    try:
                        item["sample_rate"] = int(s.get("sample_rate", 0))
                        item["channels"] = int(s.get("channels", 0))
                    except (ValueError, TypeError):
                        pass
                    break
        item["category"] = detect_category(file_path, ext, item["duration"] or 0)

    elif ext in VIDEO_EXTS:
        item["type"] = "video"
        info = run_ffprobe(file_path)
        if info:
            fmt = info.get("format", {})
            try:
                item["duration"] = round(float(fmt.get("duration", 0)), 2)
            except (ValueError, TypeError):
                pass
            streams = info.get("streams", [])
            for s in streams:
                if s.get("codec_type") == "video":
                    item["codec"] = s.get("codec_name")
                    item["width"] = s.get("width")
                    item["height"] = s.get("height")
                    r_fps = s.get("r_frame_rate", "")
                    if "/" in r_fps:
                        try:
                            num, den = r_fps.split("/")
                            item["fps"] = round(float(num) / float(den), 2)
                        except Exception:
                            pass
                    break
        item["category"] = detect_category(file_path, ext, item["duration"] or 0)

    elif ext in IMAGE_EXTS:
        item["type"] = "image"
        if ext == ".svg":
            item["category"] = "icons" if "icon" in str(file_path).lower() else "logos"
        else:
            # Try PIL if available or ffprobe
            info = run_ffprobe(file_path)
            if info:
                for s in info.get("streams", []):
                    if s.get("codec_type") == "video":
                        item["width"] = s.get("width")
                        item["height"] = s.get("height")
                        item["codec"] = s.get("codec_name")
                        break
            item["category"] = detect_category(file_path, ext)

    elif ext in FONT_EXTS:
        item["type"] = "font"
        item["category"] = "fonts"

    return item

from concurrent.futures import ThreadPoolExecutor

def scan_directory(directory: Path, recursive: bool = True, max_workers: int = 8) -> list:
    """Scan directory and index all media files with fast parallel metadata extraction."""
    directory = Path(directory).resolve()
    if not directory.exists():
        raise FileNotFoundError(f"Directory not found: {directory}")

    media_exts = AUDIO_EXTS | VIDEO_EXTS | IMAGE_EXTS | FONT_EXTS
    files_to_inspect = []

    pattern = "**/*" if recursive else "*"
    for p in directory.glob(pattern):
        if p.is_file() and p.suffix.lower() in media_exts:
            files_to_inspect.append(p)

    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(inspect_file, f): f for f in files_to_inspect}
        for future in futures:
            f = futures[future]
            try:
                item = future.result()
                results.append(item)
            except Exception as e:
                print(f"Warning: Failed to inspect {f.name}: {e}")

    return results

def index_library(directory: Path, output_file: Path = None) -> Path:
    """Scan and save index JSON file."""
    directory = Path(directory).resolve()
    print(f"Scanning asset directory: {directory}...")
    assets = scan_directory(directory)
    print(f"Indexed {len(assets)} media assets.")

    if not output_file:
        output_file = directory / "library_index.json"
    else:
        output_file = Path(output_file).resolve()

    index_data = {
        "indexed_at": datetime.now().isoformat(),
        "library_path": str(directory),
        "total_assets": len(assets),
        "summary": {
            "audio": len([a for a in assets if a["type"] == "audio"]),
            "video": len([a for a in assets if a["type"] == "video"]),
            "images": len([a for a in assets if a["type"] == "image"]),
            "fonts": len([a for a in assets if a["type"] == "font"]),
        },
        "assets": assets
    }
    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_file.write_text(json.dumps(index_data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved asset index to: {output_file}")
    return output_file

def search_index(index_file: Path, query: str = "", category: str = None, media_type: str = None, max_duration: float = None) -> list:
    """Search indexed assets by query, category, and filters."""
    index_file = Path(index_file).resolve()
    if not index_file.exists():
        raise FileNotFoundError(f"Index file not found: {index_file}")

    data = json.loads(index_file.read_text(encoding="utf-8"))
    results = []
    tokens = [t.lower() for t in query.split()] if query else []

    for a in data.get("assets", []):
        if media_type and a.get("type") != media_type:
            continue
        if category and a.get("category") != category:
            continue
        if max_duration is not None and a.get("duration") and a["duration"] > max_duration:
            continue

        if tokens:
            target = (a["filename"] + " " + a["category"] + " " + a["path"]).lower()
            if not all(t in target for t in tokens):
                continue

        # Check if file still exists on disk
        a["exists_on_disk"] = Path(a["path"]).exists()
        results.append(a)

    return results

def import_to_project(
    project_dir: Path,
    source_file: Path,
    category: str = "b-roll",
    copy: bool = True,
    license_type: str = "personal",
    attribution: str = "",
    notes: str = ""
) -> dict:
    """Import an external asset into a project and record in manifests."""
    project_dir = Path(project_dir).resolve()
    source_file = Path(source_file).resolve()

    if not source_file.exists():
        raise FileNotFoundError(f"Source asset not found: {source_file}")

    # Determine destination subfolder
    subfolders = {
        "voice": project_dir / "assets" / "audio" / "voice",
        "music": project_dir / "assets" / "audio" / "music",
        "sfx": project_dir / "assets" / "audio" / "sfx",
        "b-roll": project_dir / "assets" / "video" / "b-roll",
        "video": project_dir / "assets" / "video" / "source",
        "images": project_dir / "assets" / "images" / "b-roll",
        "logos": project_dir / "assets" / "images" / "logos",
        "icons": project_dir / "assets" / "images" / "icons",
        "fonts": project_dir / "assets" / "fonts"
    }

    dest_dir = subfolders.get(category, project_dir / "assets" / category)
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_file = dest_dir / source_file.name

    if copy:
        if dest_file != source_file:
            shutil.copy2(source_file, dest_file)
    else:
        # Create relative symlink if supported, otherwise copy
        if dest_file != source_file:
            try:
                dest_file.symlink_to(source_file)
            except OSError:
                shutil.copy2(source_file, dest_file)

    meta = inspect_file(dest_file)
    entry = {
        "id": re.sub(r"[^A-Za-z0-9_-]+", "_", source_file.stem).lower(),
        "filename": source_file.name,
        "category": category,
        "original_path": str(source_file),
        "project_path": str(dest_file.relative_to(project_dir)).replace("\\", "/"),
        "type": meta.get("type"),
        "duration": meta.get("duration"),
        "width": meta.get("width"),
        "height": meta.get("height"),
        "license": license_type,
        "attribution": attribution,
        "notes": notes,
        "imported_at": datetime.now().isoformat()
    }

    # Update manifests/assets.json
    manifests_dir = project_dir / "manifests"
    manifests_dir.mkdir(parents=True, exist_ok=True)
    master_manifest = manifests_dir / "assets.json"

    master_list = []
    if master_manifest.exists():
        try:
            master_list = json.loads(master_manifest.read_text(encoding="utf-8"))
        except Exception:
            master_list = []

    # Replace if exists or append
    master_list = [item for item in master_list if item.get("filename") != source_file.name]
    master_list.append(entry)
    master_manifest.write_text(json.dumps(master_list, indent=2, ensure_ascii=False), encoding="utf-8")

    # Update category manifest (e.g. manifests/b-roll.json, manifests/sound-effects.json, etc.)
    cat_manifest_map = {
        "sfx": manifests_dir / "sound-effects.json",
        "music": manifests_dir / "assets.json",
        "b-roll": manifests_dir / "b-roll.json",
        "logos": manifests_dir / "logos.json",
        "icons": manifests_dir / "icons.json"
    }
    cat_file = cat_manifest_map.get(category)
    if cat_file:
        cat_list = []
        if cat_file.exists():
            try:
                cat_list = json.loads(cat_file.read_text(encoding="utf-8"))
            except Exception:
                cat_list = []
        cat_list = [item for item in cat_list if item.get("filename") != source_file.name]
        cat_list.append(entry)
        cat_file.write_text(json.dumps(cat_list, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Imported '{source_file.name}' into {category} -> {dest_file}")
    return entry


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Asset indexing and discovery helper")
    sub = parser.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("scan", help="Scan and index a directory")
    s.add_argument("directory", help="Directory to scan")
    s.add_argument("--out", "-o", default=None, help="Output index JSON path")

    s = sub.add_parser("search", help="Search an asset index")
    s.add_argument("index", help="Path to library_index.json")
    s.add_argument("query", nargs="?", default="", help="Search query")
    s.add_argument("--category", default=None, help="Filter by category")
    s.add_argument("--type", default=None, help="Filter by type (audio, video, image, font)")
    s.add_argument("--max-duration", type=float, default=None, help="Max duration in seconds")

    s = sub.add_parser("import", help="Import asset to project")
    s.add_argument("project", help="Path to project directory")
    s.add_argument("file", help="Path to source file")
    s.add_argument("--category", default="b-roll", help="Category (sfx, music, b-roll, logos, icons)")
    s.add_argument("--license", default="free_or_owned", help="License info")
    s.add_argument("--attribution", default="", help="Attribution details")

    args = parser.parse_args()

    if args.cmd == "scan":
        index_library(Path(args.directory), Path(args.out) if args.out else None)
    elif args.cmd == "search":
        matches = search_index(
            Path(args.index),
            query=args.query,
            category=args.category,
            media_type=args.type,
            max_duration=args.max_duration
        )
        print(f"Found {len(matches)} matching assets:")
        for m in matches[:20]:
            dur = f" ({m['duration']}s)" if m.get("duration") else ""
            res = f" ({m['width']}x{m['height']})" if m.get("width") else ""
            print(f" - [{m['category']}] {m['filename']}{dur}{res} -> {m['path']}")
    elif args.cmd == "import":
        import_to_project(
            Path(args.project),
            Path(args.file),
            category=args.category,
            license_type=args.license,
            attribution=args.attribution
        )
