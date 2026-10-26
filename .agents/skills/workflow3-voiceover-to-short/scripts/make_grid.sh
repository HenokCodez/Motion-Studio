#!/usr/bin/env bash
# Re-create public/grid_vertical.mp4 from the user's landscape Grid_1.mp4 (1920x1080 -> 1080x1920 by rotating 90deg).
# Usage: bash scripts/make_grid.sh /path/Grid_1.mp4 public/grid_vertical.mp4
set -e
ffmpeg -y -i "${1:-Grid_1.mp4}" -vf "transpose=1" -an -c:v libx264 -crf 24 -preset veryfast -pix_fmt yuv420p "${2:-public/grid_vertical.mp4}"
