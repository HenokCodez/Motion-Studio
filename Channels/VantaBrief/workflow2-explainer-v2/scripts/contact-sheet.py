#!/usr/bin/env python3
"""contact-sheet.py video.mp4 out.png  -> one thumbnail every 3 s, 4 per row, with timestamps. Open the PNG and review it."""
import sys,subprocess,glob,os,tempfile
from PIL import Image,ImageDraw
v,out=sys.argv[1],sys.argv[2];t=tempfile.mkdtemp()
subprocess.run(['ffmpeg','-v','error','-i',v,'-vf','fps=1/3,scale=480:-1',t+'/f_%04d.png'],check=True)
fs=sorted(glob.glob(t+'/f_*.png'));im=Image.open(fs[0]);W,H=im.size;cols=4;rows=(len(fs)+cols-1)//cols
S=Image.new('RGB',(W*cols,H*rows));d=ImageDraw.Draw(S)
for i,f in enumerate(fs): x,y=(i%cols)*W,(i//cols)*H;S.paste(Image.open(f),(x,y));d.text((x+8,y+6),f'{i*3}s',fill=(250,244,217))
S.save(out);print(out,len(fs),'frames')
