#!/usr/bin/env python3
"""safe-pixel-check.py: for every rendered keyframe, finds cream/orange ink pixels outside the safe frame. Backstop for bounds-check.py."""
import glob,sys,json,numpy as np,os
from pathlib import Path
from PIL import Image
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));bad=0
explicit=[a for a in sys.argv[1:] if a.endswith('.png')]
for p in (explicit or sorted(glob.glob(R+'/out/*/f*.png'))):
    if not explicit:
        i=Path(p).parent.name;f=int(Path(p).stem[1:]);meta=json.load(open(f'{R}/components/animations/meta/{i}.json'))
        sf=meta.get('strictFrom', meta['duration']*0.4 if meta.get('entrance') else 0)
        if f<sf: continue  # declared off-screen entrance: only the rest frames are strict
    a=np.array(Image.open(p).convert('RGB')).astype(int)
    ink=(a.sum(2)>560)|((a[:,:,0]>220)&(a[:,:,1]<140)&(a[:,:,2]<90))
    m=np.ones_like(ink);m[86:995,154:1767]=False
    n=(ink&m).sum()
    if n>40: print('FAIL',os.path.relpath(p,R),n,'ink px outside safe frame');bad+=1
print('PASS' if not bad else f'{bad} frames fail');sys.exit(1 if bad else 0)
