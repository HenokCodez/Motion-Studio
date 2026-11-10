#!/usr/bin/env python3
"""frame-audit.py video.mp4   Samples the rendered video once per second and finds empty/sparse stretches. FAIL: any empty run >= 1.5 s, or the last 2 s empty. Reports sparse share (a lone tiny object in a big frame). Run on the preview in gate 8, then open the contact sheet."""
import sys,subprocess,numpy as np
v=sys.argv[1];W,H=192,108
raw=subprocess.run(['ffmpeg','-v','error','-i',v,'-vf',f'fps=1,scale={W}:{H},format=gray','-f','rawvideo','-'],capture_output=True).stdout
fr=np.frombuffer(raw,np.uint8).reshape(-1,H,W);ink=(fr>115).mean((1,2))   # grid lines are dark grey (<90); drawn strokes/text are bright
empty=ink<0.0006;sparse=ink<0.004;E=[]
def runs(m):
    out=[];s=None
    for i,x in enumerate(m):
        if x and s is None:s=i
        if not x and s is not None:out.append((s,i-s));s=None
    if s is not None:out.append((s,len(m)-s))
    return out
for s,l in runs(empty):
    if l>=2:E.append(f"empty frame for {l}s starting at {s}s")
if empty[-2:].all():E.append('video ends on an empty frame (add an outro/CTA hold)')
sp=[r for r in runs(sparse&~empty) if r[1]>=4]
print(f"duration {len(fr)}s | empty seconds {int(empty.sum())} | sparse seconds {int((sparse&~empty).sum())} ({(sparse&~empty).mean()*100:.0f}%) | long sparse runs: {[f'{a}s+{b}s' for a,b in sp[:6]]}")
for e in E:print('FAIL',e)
print('PASS' if not E else f'{len(E)} problem(s)');sys.exit(1 if E else 0)
