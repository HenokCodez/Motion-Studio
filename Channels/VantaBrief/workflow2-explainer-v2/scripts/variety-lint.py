#!/usr/bin/env python3
"""variety-lint.py scene-plan.json [--partial]  Enforces scheduler-rules.md + pacing. Exit 1 on violation. --partial skips whole-video totals (for excerpts)."""
import json,sys,os,glob
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
meta={os.path.basename(p)[:-5]:json.load(open(p)) for p in glob.glob(R+'/components/animations/meta/*.json')}
plan=json.load(open(sys.argv[1]));partial='--partial' in sys.argv;S=plan['scenes'];errs=[]
dur=(max(s['end'] for s in S)-min(s['start'] for s in S))/60
ids=[[a['id'] for a in s['animations']] for s in S]
for s,i in zip(S,ids):
    for x in i:
        if x not in meta: errs.append(f"{s['id']}: unknown animation {x}")
    if s['end']<=s['start']: errs.append(f"{s['id']}: end<=start")
    per=(s['end']-s['start'])/len(i)
    if per>3.5+1e-9: errs.append(f"{s['id']}: {per:.1f}s per animation > 3.5s (static risk): add another animation/sub-step or shorten")
    if s['intent']=='cta' and 'A29' not in i: errs.append(f"{s['id']}: cta scene must use A29 (channel logo)")
    if s['intent']=='brand-group' and 'A28' not in i: errs.append(f"{s['id']}: brand-group must use A28")
    if s['intent']=='screenshot' and 'A30' not in i: errs.append(f"{s['id']}: screenshot scene must use A30")
flat=[(k,x) for k,i in enumerate(ids) for x in i]
for n,(k,x) in enumerate(flat):
    for k2,y in flat[n+1:]:
        if y==x and k2-k<6 and k2!=k: errs.append(f"{x} repeats within 6 scenes (scenes {S[k]['id']} and {S[k2]['id']})");break
for k in range(1,len(S)):
    ca={meta[x]['category'] for x in ids[k] if x in meta};cb={meta[x]['category'] for x in ids[k-1] if x in meta}
    if ca==cb and len(ca)==1: errs.append(f"{S[k-1]['id']}->{S[k]['id']}: same category twice in a row ({list(ca)[0]})")
if not partial:
    from collections import Counter
    c=Counter(x for _,x in flat);cap=2 if dur<6 else 3 if dur<=12 else 4
    for x,n in c.items():
        if n>cap: errs.append(f"{x} used {n}x > {cap}")
    if len(c)<15: errs.append(f"only {len(c)} distinct animations (<15)")
    if sum(1 for s in S if s.get('intensity')=='hero')<5: errs.append('fewer than 5 hero scenes')
    if not any(s['intent']=='cta' for s in S): errs.append('no CTA scene')
for e in errs: print('FAIL',e)
print('PASS' if not errs else f'{len(errs)} violation(s)');sys.exit(1 if errs else 0)
