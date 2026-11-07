#!/usr/bin/env python3
import json, sys, os, glob
from collections import Counter

R = os.path.dirname(os.path.abspath(__file__))
meta = {os.path.basename(p)[:-5]: json.load(open(p)) for p in glob.glob(R + '/components/animations/meta/*.json')}

# Read transcript lines
with open(r'D:\Youtube\Vanta Brief\New Videos\3 deepseek , httpsyoutu.beYX6QdIYVSgYsi=yfMHI9kLwAtFLx3R\for Ai\script-timestamped.txt', 'r', encoding='utf-8') as f:
    raw_lines = [l.strip() for l in f if l.strip()]

def parse_time(ts):
    # 00:00:05.280
    parts = ts.split(':')
    return int(parts[0]) * 3600 + int(parts[1]) * 60 + float(parts[2])

parsed_lines = []
for line in raw_lines:
    # [00:00:00.000 --> 00:00:05.280]  Text...
    if line.startswith('\ufeff'):
        line = line[1:]
    start_str = line[1:13]
    end_str = line[18:30]
    text = line[32:].strip()
    parsed_lines.append((parse_time(start_str), parse_time(end_str), text))

print(f"Parsed {len(parsed_lines)} timestamped lines from transcript.")
print(f"Total time range: {parsed_lines[0][0]:.3f} -> {parsed_lines[-1][1]:.3f}")

