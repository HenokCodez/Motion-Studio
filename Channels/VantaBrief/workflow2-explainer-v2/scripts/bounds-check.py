#!/usr/bin/env python3
"""bounds-check.py scene.html [--frames 0,15,30 | --every 15 --total 150]
Scene contract: page 1920x1080; optional window.__setFrame(n); [data-box] primary objects; [data-connector] excluded from gap test.
Exit code 1 on any violation."""
import sys, json, argparse
from playwright.sync_api import sync_playwright
SAFE=dict(x0=154,y0=86,x1=1766,y1=994); MIN_FONT=24; MIN_GAP=40; MAX_PRIMARY=4
JS="""()=>{
 const out={boxes:[],texts:[],overflow:[]};
 document.querySelectorAll('[data-box]').forEach(e=>{const r=e.getBoundingClientRect();
   out.boxes.push({id:e.dataset.box,x0:r.left,y0:r.top,x1:r.right,y1:r.bottom,op:parseFloat(getComputedStyle(e).opacity)})});
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=walker.nextNode()){ if(!n.textContent.trim())continue; const el=n.parentElement; const cs=getComputedStyle(el);
   if(cs.visibility==='hidden'||parseFloat(cs.opacity)===0||el.closest('script,style'))continue;
   const range=document.createRange();range.selectNodeContents(n);const r=range.getBoundingClientRect();
   out.texts.push({t:n.textContent.trim().slice(0,40),fs:parseFloat(cs.fontSize),x0:r.left,y0:r.top,x1:r.right,y1:r.bottom});
   const box=el.closest('[data-box]'); if(box&&el.scrollWidth>el.clientWidth+1&&cs.overflow!=='visible')out.overflow.push(n.textContent.trim().slice(0,30));}
 return out}"""
def check(page,f):
    if f is not None: page.evaluate("n=>window.__setFrame&&window.__setFrame(n)",f); page.wait_for_timeout(30)
    d=page.evaluate(JS); errs=[]
    vis=[b for b in d['boxes'] if b['op']>0.05]
    for b in vis:
        if b['x0']<SAFE['x0']-1 or b['y0']<SAFE['y0']-1 or b['x1']>SAFE['x1']+1 or b['y1']>SAFE['y1']+1:
            errs.append(f"box '{b['id']}' leaves safe frame ({b['x0']:.0f},{b['y0']:.0f},{b['x1']:.0f},{b['y1']:.0f})")
    for t in d['texts']:
        if t['fs']<MIN_FONT: errs.append(f"text '{t['t']}' font {t['fs']:.0f}px < {MIN_FONT}")
        if t['x0']<SAFE['x0']-1 or t['x1']>SAFE['x1']+1 or t['y0']<SAFE['y0']-1 or t['y1']>SAFE['y1']+1:
            errs.append(f"text '{t['t']}' outside safe frame ({t['x0']:.0f}..{t['x1']:.0f})")
    if len(vis)>MAX_PRIMARY: errs.append(f"{len(vis)} primary objects > {MAX_PRIMARY}")
    for i,a in enumerate(vis):
        for b in vis[i+1:]:
            dx=max(b['x0']-a['x1'],a['x0']-b['x1']); dy=max(b['y0']-a['y1'],a['y0']-b['y1'])
            if max(dx,dy)<MIN_GAP: errs.append(f"gap {max(dx,dy):.0f}px < {MIN_GAP} between '{a['id']}' and '{b['id']}'")
    errs+= [f"text overflows card: {o}" for o in d['overflow']]
    return errs
if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('html');ap.add_argument('--frames');ap.add_argument('--every',type=int,default=15);ap.add_argument('--total',type=int,default=0)
    a=ap.parse_args()
    frames=[int(x) for x in a.frames.split(',')] if a.frames else (list(range(0,a.total,a.every)) if a.total else [None])
    bad=0
    with sync_playwright() as p:
        b=p.chromium.launch();pg=b.new_page(viewport={'width':1920,'height':1080});pg.goto('file://'+__import__('os').path.abspath(a.html));pg.wait_for_timeout(300)
        for f in frames:
            for e in check(pg,f): print(f"FAIL frame {f}: {e}");bad+=1
    print('PASS' if not bad else f'{bad} violation(s)');sys.exit(1 if bad else 0)
