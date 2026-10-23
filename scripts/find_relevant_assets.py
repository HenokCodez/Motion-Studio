import json

with open("library_index.json", "r", encoding="utf-8") as f:
    data = json.load(f)

assets = data.get("assets", [])
icons = [x for x in assets if x.get("category") == "icons"]
if icons:
    print("Keys in asset item:", list(icons[0].keys()))
    for a in icons[:20]:
        print(" ", a.get("filename", a.get("file", a.get("title", str(a)))))
