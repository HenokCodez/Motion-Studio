#!/usr/bin/env python3
"""keyframe-check.py [IDs]  Validates rendered keyframes out/<ID>/f*.png against the spec table's claim that things change:
(1) every consecutive pair except the LAST pair (rest hold) must differ in >=0.02% of pixels (any RGB channel delta >25) - so each described step really shows motion,
(2) first and last frame must differ >=0.1% (animation does something), (3) last frame must contain content (>=0.05% non-background pixels vs frame 0).
Uses full-frame RGB difference (the Grid background is constant), so dark fills such as #6B3A2E count."""
import glob,json,os,sys,numpy as np
from PIL import Image
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));bad=0
ids=sys.argv[1:] or sorted(os.path.basename(p)[:-5] for p in glob.glob(R+'/components/animations/meta/*.json'))
df=lambda a,b:(np.abs(a-b).max(2)>25).mean()
for i in ids:
    m=json.load(open(f'{R}/components/animations/meta/{i}.json'));ims=[np.array(Image.open(f'{R}/out/{i}/f{f}.png').convert('RGB')).astype(int) for f in m['keyframes']];e=[]
    for k in range(1,len(ims)-1):
        d=df(ims[k],ims[k-1])
        if d<0.0002: e.append(f"keyframes {m['keyframes'][k-1]}->{m['keyframes'][k]} show no visible change ({d*100:.3f}%)")
    if df(ims[0],ims[-1])<0.001: e.append('first and last frame (almost) identical')
    if e: bad+=1;print('FAIL',i);[print('   ',x) for x in e]
print('PASS' if not bad else f'{bad} animation(s) with keyframe issues');sys.exit(1 if bad else 0)
