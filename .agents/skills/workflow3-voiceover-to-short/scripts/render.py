#!/usr/bin/env python3
"""Cross-platform Python runner for Workflow 3: Validate -> Render -> QA."""
import argparse
import os
import subprocess
import sys
from pathlib import Path

def main():
    ap = argparse.ArgumentParser(description="Render Workflow 3 Vertical Short")
    ap.add_argument("sb", nargs="?", default="src/workflow3/storyboard.json", help="Path to storyboard.json")
    ap.add_argument("--public", default="public/workflow3", help="Path to public directory")
    ap.add_argument("--out", default="out/short.mp4", help="Output MP4 path")
    ap.add_argument("--qa", default="qa", help="Output QA directory")
    ap.add_argument("--crf", type=int, default=18, help="CRF quality (default: 18)")
    a = ap.parse_args()

    remotion_dir = Path("projects/remotion-app") if Path("projects/remotion-app").exists() else Path(".")
    script_dir = Path(__file__).resolve().parent

    sb_path = Path(a.sb)
    if not sb_path.is_absolute():
        sb_path = (Path.cwd() / sb_path).resolve()

    public_dir = Path(a.public)
    if not public_dir.is_absolute():
        public_dir = (remotion_dir / a.public).resolve() if not public_dir.exists() else public_dir.resolve()

    print(f"--> Validating {sb_path.name} with public dir {public_dir}...")
    val_script = script_dir / "validate.py"
    res = subprocess.run([sys.executable, str(val_script), str(sb_path), "--public", str(public_dir)])
    if res.returncode != 0:
        sys.exit(1)

    out_file = Path(a.out)
    if not out_file.is_absolute():
        out_file = (remotion_dir / out_file).resolve()
    out_file.parent.mkdir(parents=True, exist_ok=True)

    print(f"\n--> Rendering Workflow3Short -> {out_file}...")
    npx_cmd = "npx.cmd" if os.name == "nt" else "npx"
    render_cmd = [
        npx_cmd, "remotion", "render",
        "src/index.ts",
        "Workflow3Short",
        str(out_file),
        f"--props={sb_path}",
        "--codec=h264",
        f"--crf={a.crf}",
        "--pixel-format=yuv420p",
        "--audio-codec=aac"
    ]
    subprocess.run(render_cmd, cwd=remotion_dir, check=True)
    print(f"[OK] Master render complete: {out_file}")

    print(f"\n--> Running QA checks on {out_file.name}...")
    qa_script = script_dir / "qa.py"
    qa_dir = Path(a.qa)
    if not qa_dir.is_absolute():
        qa_dir = (remotion_dir / qa_dir).resolve()
    qa_cmd = [
        sys.executable, str(qa_script),
        str(out_file),
        str(sb_path),
        "--out", str(qa_dir)
    ]
    subprocess.run(qa_cmd, cwd=remotion_dir)

if __name__ == "__main__":
    main()
