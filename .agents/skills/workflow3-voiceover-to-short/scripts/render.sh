#!/usr/bin/env bash
# Validate -> render -> QA.  Run from the Remotion project root.   bash scripts/render.sh
set -e
python scripts/validate.py storyboard.json --public public/workflow3
mkdir -p out
npx remotion render src/index.ts Workflow3Short out/short.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --audio-codec=aac --concurrency=50%
python scripts/qa.py out/short.mp4 storyboard.json --out qa || echo "QA found ERRORS: fix them (see qa/review.md), then re-run this script."
