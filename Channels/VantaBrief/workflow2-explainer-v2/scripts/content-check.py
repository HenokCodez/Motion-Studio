#!/usr/bin/env python3
"""content-check.py scene-plan.json   Catches the text mistakes seen in the first video: single-letter/placeholder strings ("I", "Info"), '_' or 'undefined' in labels, and strings longer than the '<=N chars' limit in the animation's spec (components/animations/meta/<ID>.json params). Exit 1 on problems."""
import json,sys,os,re,glob
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
meta={os.path.basename(p)[:-5]:json.load(open(p)) for p in glob.glob(R+'/components/animations/meta/*.json')}
plan=json.load(open(sys.argv[1]));E=[]
BAD=re.compile(r'(undefined|null|todo|lorem|\[object|_)',re.I)
def strings(v):
    if isinstance(v,str):yield v
    elif isinstance(v,list):
        for x in v:yield from strings(x)
    elif isinstance(v,dict):
        for x in v.values():yield from strings(x)
FILEKEYS={'src','files','photos','leftFile','rightFile','hubFile','icon','icons','target'}
for s in plan['scenes']:
    for a in s['animations']:
        P=a.get('params',{});spec=meta.get(a['id'],{}).get('params',{})
        for k,v in P.items():
            if k in FILEKEYS or k in('theme','url'):continue
            m=re.search(r'<=\s*(\d+)\s*chars',str(spec.get(k,'')))
            if not m:
                m=re.search(r'<=\s*(\d+)',str(spec.get(k,'')))
            lim=int(m.group(1)) if m else None
            for t in strings(v):
                if len(t.strip())<2:E.append(f"{s['id']} {a['id']}.{k}: '{t}' is a single character / placeholder")
                if BAD.search(t):E.append(f"{s['id']} {a['id']}.{k}: '{t}' contains placeholder/raw formatting")
                if lim and len(t)>lim:E.append(f"{s['id']} {a['id']}.{k}: '{t}' is {len(t)} chars > limit {lim}")
for e in E:print('FAIL',e)
print('PASS' if not E else f'{len(E)} problem(s)');sys.exit(1 if E else 0)
