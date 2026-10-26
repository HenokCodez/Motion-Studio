#!/usr/bin/env bash
# Grab ONE full-resolution frame to inspect closely.   bash scripts/frame_at.sh out/short.mp4 12.4 qa/look.png
ffmpeg -v error -y -ss "$2" -i "$1" -frames:v 1 "${3:-qa/look.png}" && echo "saved ${3:-qa/look.png} (open it with the image viewer)"
