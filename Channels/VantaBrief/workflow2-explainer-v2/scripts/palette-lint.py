#!/usr/bin/env python3
"""palette-lint.py frame.png [...]  Fails if frame colors fall outside the palette (excluding bg/logo/photo zones via --mask x0,y0,x1,y1),
blue > 15% area, lime > 2% area, or caption-like text pixels sit in the bottom 14% band."""
import sys,numpy as np
from PIL import Image
P={'cream':(250,244,217),'card':(35,31,32),'orange':(255,107,53),'hi':(107,58,46),'blue':(22,119,255),'lime':(203,255,77)}
def dist(a,c): return np.sqrt(((a-np.array(c))**2).sum(2))
def lint(path,masks=()):
    a=np.array(Image.open(path).convert('RGB')).astype(float); H,W,_=a.shape; keep=np.ones((H,W),bool)
    for x0,y0,x1,y1 in masks: keep[y0:y1,x0:x1]=False
    sat=a.max(2)-a.min(2); lum=a.mean(2); errs=[]
    colored=keep&(sat>60)&(lum>40)   # chromatic pixels (grey bg/grid ignored)
    near=np.zeros((H,W),bool)
    for k in ('cream','orange','hi','blue','lime','card'): near|=dist(a,P[k])<70
    stray=colored&~near
    if stray.mean()>0.002: errs.append(f'off-palette chromatic pixels {stray.mean()*100:.2f}% of frame')
    if (keep&(dist(a,P['blue'])<60)).mean()>0.15: errs.append('blue > 15% of frame')
    if (keep&(dist(a,P['lime'])<60)).mean()>0.02: errs.append('lime > 2% of frame')
    band=(lum[int(H*0.86):,:]>200)&keep[int(H*0.86):,:]
    if band.mean()>0.004: errs.append('bright text-like pixels in bottom caption band (captions forbidden)')
    pure=(a.min(2)>=252)|(a.max(2)<=2)
    if (pure&keep).mean()>0.001: errs.append('pure #FFF/#000 pixels found')
    return errs
if __name__=='__main__':
    bad=0
    for f in sys.argv[1:]:
        for e in lint(f): print(f'FAIL {f}: {e}');bad+=1
    print('PASS' if not bad else f'{bad} violation(s)');sys.exit(1 if bad else 0)
