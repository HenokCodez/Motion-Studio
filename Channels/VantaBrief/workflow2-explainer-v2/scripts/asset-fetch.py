#!/usr/bin/env python3
"""asset-fetch.py logo <name> <url>   | screenshot <name> <page-url>
Downloads to assets/logos or assets/screenshots, appends provenance.json. On failure appends to assets/MISSING.md (never invent assets).
Source order for logos: official brand/press page -> Wikimedia Commons -> svgl.app -> simpleicons.org. Only URLs reachable from this sandbox work; otherwise log MISSING and tell the user to drop the file in manually."""
import sys,os,json,datetime,urllib.request
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def prov(kind,name,url,path):
    p=f'{R}/assets/{kind}/provenance.json';d=json.load(open(p)) if os.path.exists(p) else {}
    d[name]={'url':url,'file':os.path.basename(path),'date':datetime.date.today().isoformat()};json.dump(d,open(p,'w'),indent=1)
def missing(kind,name,url,why):
    open(f'{R}/assets/MISSING.md','a').write(f'- {kind}/{name}: {url} ({why}) -> use sketch placeholder, user to supply file\n');print('MISSING',name,why)
kind,name,url=sys.argv[1],sys.argv[2],sys.argv[3]
try:
    if kind=='logo':
        ext=os.path.splitext(url.split('?')[0])[1] or '.svg';path=f'{R}/assets/logos/{name}{ext}';os.makedirs(os.path.dirname(path),exist_ok=True)
        urllib.request.urlretrieve(url,path);prov('logos',name,url,path);print('ok',path)
    else:
        from playwright.sync_api import sync_playwright
        path=f'{R}/assets/screenshots/{name}.png';os.makedirs(os.path.dirname(path),exist_ok=True)
        with sync_playwright() as p:
            b=p.chromium.launch();pg=b.new_page(viewport={'width':1600,'height':900});pg.goto(url,timeout=30000);pg.wait_for_timeout(1500);pg.screenshot(path=path)
        prov('screenshots',name,url,path);print('ok',path)
except Exception as e: missing(kind,name,url,str(e)[:80])
