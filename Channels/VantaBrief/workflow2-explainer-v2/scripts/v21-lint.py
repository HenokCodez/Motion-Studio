#!/usr/bin/env python3
"""v21-lint.py scene-plan.json [--partial]   Extra gate added in v2.1 (run right after variety-lint.py). Exit 1 on violation.
timeline: scenes contiguous (no gaps/overlaps); scene >= 2.5 s (transition >= 1.2 s); every animation slot >= 1.8 s; no speed > 1.
branding (skipped with --partial): A27 used; A29 in the last 25%; last scene is cta/outro and >= 4 s; channel logo file exists.
creativity (skipped with --partial): >= 1/3 of scenes use a custom animation (meta custom:true, ids C##); same catalog ID never twice with identical params; distinct IDs >= 60% of scene count."""
import json,sys,os,glob,math
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
meta={os.path.basename(p)[:-5]:json.load(open(p)) for p in glob.glob(R+'/components/animations/meta/*.json')}
plan=json.load(open(sys.argv[1]));partial='--partial' in sys.argv;S=sorted(plan['scenes'],key=lambda s:s['start']);E=[];W=[]
for a,b in zip(S,S[1:]):
    if abs(b['start']-a['end'])>0.05:E.append(f"timeline: {a['id']} ends {a['end']:.2f}s but {b['id']} starts {b['start']:.2f}s (gap/overlap)")
for s in S:
    d=s['end']-s['start'];lim=1.2 if s['intent']=='transition' else 2.5
    if d<lim:E.append(f"{s['id']}: {d:.1f}s is too short (min {lim}s) - animations race ahead of the narration")
    if s['intent']!='transition' and d/len(s['animations'])<1.8:E.append(f"{s['id']}: slot {d/len(s['animations']):.1f}s per animation < 1.8s")
    for a in s['animations']:
        if a.get('speed',1)>1:E.append(f"{s['id']}: speed>1 not allowed")
    if not any('delay' in a for a in s['animations']) and len(s['narration'].split())>6:W.append(s['id'])
if W:print(f"WARN {len(W)} scenes have no 'delay' (sync the reveal to the narration word timestamps, see references/pacing-rules.md): {', '.join(W[:8])}{'...' if len(W)>8 else ''}")
if not partial:
    T=S[-1]['end'];ids=[a['id'] for s in S for a in s['animations']]
    if 'A27' not in ids:E.append('branding: A27 (channel logo intro/outro) never used')
    if not any(a['id']=='A29' and s['start']>=0.75*T for s in S for a in s['animations']):E.append('branding: A29 (subscribe with channel logo) must be in the last 25% of the video')
    L=S[-1]
    if L['intent'] not in('cta','outro'):E.append('branding: last scene must have intent cta/outro')
    if L['end']-L['start']<4:E.append('branding: last scene shorter than 4 s (video would end abruptly)')
    if not os.path.exists(R+'/assets/brand/vanta-brief-logo.png'):E.append('branding: assets/brand/vanta-brief-logo.png missing')
    cust=lambda i:meta.get(i,{}).get('custom') or i.startswith('C')
    nc=sum(1 for s in S if any(cust(a['id']) for a in s['animations']));need=math.ceil(len(S)/3)
    if nc<need:E.append(f"creativity: only {nc}/{len(S)} scenes use custom animations (need >= {need}); see references/creative-brief.md")
    seen={}
    for s in S:
        for a in s['animations']:
            k=(a['id'],json.dumps(a.get('params',{}),sort_keys=True))
            if not cust(a['id']) and k in seen:E.append(f"creativity: {a['id']} reused with identical params ({seen[k]} and {s['id']})")
            seen[k]=s['id']
    dis=len(set(ids))
    if dis<0.6*len(S):E.append(f"creativity: only {dis} distinct IDs for {len(S)} scenes (need >= {math.ceil(0.6*len(S))})")
for e in E:print('FAIL',e)
print('PASS' if not E else f'{len(E)} violation(s)');sys.exit(1 if E else 0)
