import subprocess

html_content = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { background: #111; color: #fff; font-family: 'Segoe UI', Nyala, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
h1 { font-size: 64px; text-align: center; color: #ffdd00; }
p { font-size: 36px; text-align: center; color: #fff; }
</style>
</head>
<body>
<div>
<h1>በቃ መፍትሄው የዚህን ያክል ቀላል ነው።</h1>
<p>That's it. The solution is this simple.</p>
</div>
</body>
</html>"""

with open('test_amharic.html', 'w', encoding='utf-8') as hf:
    hf.write(html_content)

subprocess.run(['npx.cmd', '-y', 'hyperframes@0.8.210', 'snapshot', 'test_amharic.html', '--at', '0.1', '-o', 'test_amharic.png'], check=True)
print('Snapshot done!')
