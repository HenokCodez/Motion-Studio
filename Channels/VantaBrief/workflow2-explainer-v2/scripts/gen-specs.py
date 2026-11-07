#!/usr/bin/env python3
"""Generates references/animation-catalog/<ID>-<name>.md and INDEX.md from components/animations/meta/*.json (single source of truth)."""
import json,glob,os,re
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));D=R+'/references/animation-catalog'
for f in glob.glob(D+'/A*.md'): os.remove(f)
M=[json.load(open(p)) for p in sorted(glob.glob(R+'/components/animations/meta/*.json'))]
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
for m in M:
    i=m['id'];name=f"{i}-{slug(m['name'])}.md";m['file']=name
    ref=(f"\n**User reference:** `references/visual-refs/{m['ref']}` (shown on the board's bottom-right). Match its composition and motion idea, but in the Vanta Brief flat hand-drawn palette (see visual-refs/MAP.md)." if m.get('ref') else '')
    t=[f"# {i} — {m['name']}",f"**Category:** {m['category']}  |  **Status:** {m['status']}  |  **Filmstrip:** `filmstrips/{i}.png` (open it together with this file)",
       "",f"## Best used when\n{m['bestFor']}",f"\n## Not suitable when\n{m['notSuitable']}",
       f"\n## Duration and easing\n- Duration: **{m['duration']} frames @30fps ({m['duration']/30:.1f}s)**\n- Easing: {m['easing']}\n- Named easings in `components/primitives/theme.ts`: EASE.out = cubic-bezier(0.22,1,0.36,1), EASE.inOut = (0.65,0,0.35,1), EASE.back = (0.34,1.56,0.64,1); SPR.pop {{damping 12, stiffness 140, mass 0.7}}, SPR.settle {{9,90,1}}, SPR.wobble {{5,70,1}}",
       "\n## Keyframe table (px on 1920x1080 canvas; safe frame x154-1766, y86-994)","| Frame | What is on screen |","|---|---|"]
    t+=[f"| {a} | {b} |" for a,b in m['keyframeTable']]
    t+=["\n## Plain-English motion script"]+[f"{n+1}. {s}" for n,s in enumerate(m['script'])]
    t+=["\n## Callouts on the filmstrip"]+[f"{c['n']}. (frame {m['keyframes'][c['k']]}) {c['text']}" for c in m['callouts']]
    t+=["\n## Parameters"]+[f"- `{k}`: {v}" for k,v in m['params'].items()]
    t+=[f"\n## Max content\n{m['maxContent']}",f"\n## Layout footprint\n{m['footprint']}",f"\n## Color usage rules\n{m['colorRules']}",
        f"\n## Entrance from off-screen\n{'Yes: frames before 40% of duration may be off-screen; the rest frames must be fully inside the safe frame.' if m.get('entrance') else 'No: every frame must be inside the safe frame.'}",
        f"\n## Component\n`components/animations/{i}.tsx`\n```tsx\nimport {{{i}}} from './animations/{i}';\n// registered in components/animations/index.ts, composition id \"{i}\", {m['duration']} frames\n<{i} {' '.join(k+'=...' for k in list(m['params'])[:2])} />\n```"]
    open(f"{D}/{name}",'w').write('\n'.join(t)+'\n')
rows=["# Animation Catalog INDEX","","Catalog of 57 animations (A01-A57). Status `rendered` = keyframes rendered from the real Remotion component by `scripts/render-boards.mjs` and composed by `scripts/make-board.py`.","",
"| ID | Name | Category | Best for | Frames | Intensity | Status | Spec | Board |","|---|---|---|---|---|---|---|---|---|"]
inten={'A01':'hero','A02':'calm','A03':'medium','A04':'calm','A05':'medium','A06':'medium','A07':'hero','A08':'hero','A09':'medium','A10':'hero','A11':'medium','A12':'hero','A13':'calm','A14':'medium','A15':'medium','A16':'medium','A17':'calm','A18':'hero','A19':'medium','A20':'medium','A21':'hero','A22':'hero','A23':'medium','A24':'medium','A25':'medium','A26':'hero','A27':'hero','A28':'medium','A29':'medium','A30':'medium','A33':'hero','A35':'hero','A37':'hero','A43':'hero','A50':'hero','A54':'hero','A55':'hero','A56':'hero'}
for m in M: rows.append(f"| {m['id']} | {m['name']} | {m['category']} | {m['bestFor'].split(';')[0].split('.')[0]} | {m['duration']} | {inten.get(m['id'],'medium')} | {m['status']} | [{m['file']}]({m['file']}) | [png](filmstrips/{m['id']}.png) |")
open(D+'/INDEX.md','w').write('\n'.join(rows)+'\n');print(len(M),'specs')
