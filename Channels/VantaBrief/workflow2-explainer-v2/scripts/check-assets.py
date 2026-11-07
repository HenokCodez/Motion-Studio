#!/usr/bin/env python3
"""check-assets.py scene-plan.json  Verifies every file a plan references exists under assets/ (plan.assets, params.files/src/leftFile/rightFile/hubFile/photos, plan.audio). Exit 1 if any is missing."""
import json,sys,os
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));plan=json.load(open(sys.argv[1]));miss=[]
def chk(p,sub=''):
    if p and not os.path.exists(f'{R}/assets/{sub}{p}') and not os.path.exists(f'{R}/assets/{p}'): miss.append(f'assets/{sub}{p}')
if plan.get('audio'): chk(plan['audio'])
for s in plan['scenes']:
    for a in s.get('assets',[]): chk(a)
    for an in s['animations']:
        P=an.get('params',{})
        for k,sub in (('files','logos/'),('photos','photos/')):
            for f in P.get(k,[]): chk(f,sub)
        for k,sub in (('leftFile','logos/'),('rightFile','logos/'),('hubFile','logos/')): chk(P.get(k),sub)
        if an['id']=='A30': chk(P.get('src'),'screenshots/')
        if an['id']=='A48': chk(P.get('src'),'photos/')
for m in sorted(set(miss)): print('MISSING',m)
print('PASS' if not miss else f'{len(set(miss))} missing asset(s): run scripts/asset-fetch.py or drop files in manually');sys.exit(1 if miss else 0)
