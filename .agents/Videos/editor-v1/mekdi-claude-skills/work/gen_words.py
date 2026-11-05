import json, os

lines = [
    ("That's it. The solution is this simple.", 0.15, 3.38),
    ("Let me introduce you to a new AI that can help you reduce the various pressures and burdens of office work.", 3.42, 7.64),
    ("It's called Claude.", 7.72, 9.12),
    ("This AI allows you to prepare various long-form texts,", 9.20, 13.58),
    ("professional emails,", 13.68, 15.52),
    ("and reports.", 15.60, 17.56),
    ("And doesn't that mean less pressure at the office?", 17.68, 20.46),
    ("But that's not all. We at Geez Tutorials", 20.58, 24.60),
    ("have also prepared skills for different purposes.", 24.68, 26.84),
    ("YouTube script writing,", 26.90, 28.58),
    ("graphic design,", 28.64, 30.50),
    ("and copywriting skills.", 30.58, 31.78),
    ("To get these skills, don't forget to follow the page", 31.88, 35.26),
    ('and write "SKILL" in the comment section.', 35.34, 38.65),
]

all_words = []
for text, s, e in lines:
    words = text.split()
    n = len(words)
    dur = e - s
    step = dur / n
    for i, w in enumerate(words):
        ws = round(s + i * step, 3)
        we = round(s + (i + 1) * step, 3)
        all_words.append({'w': w, 's': ws, 'e': we})

out_dir = r"D:\Automations\motion-studio\.agents\Videos\editor-v1\mekdi-claude-skills\work\tx"
os.makedirs(out_dir, exist_ok=True)
out_p = os.path.join(out_dir, "words.json")

with open(out_p, "w", encoding="utf-8") as f:
    json.dump(all_words, f, indent=2)

print(f"Generated {len(all_words)} words into {out_p}")
