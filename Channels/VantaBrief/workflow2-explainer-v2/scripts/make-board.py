#!/usr/bin/env python3
"""make-board.py [IDs]  -> references/animation-catalog/filmstrips/<ID>.png (1920x1080 board: label bar + 6 keyframes (3x2) + numbered callouts + legend)
Keyframes come from real Remotion renders in out/<ID>/f<frame>.png."""
import json,sys,glob,os
from PIL import Image,ImageDraw,ImageFont
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-%s.otf'%('ExtraBold' if b else 'Medium'),s)
INK=(250,244,217);OR=(255,107,53);BG=(11,11,11);CARD=(35,31,32)
ids=sys.argv[1:] or sorted(os.path.basename(p)[:-5] for p in glob.glob(R+'/components/animations/meta/*.json'))
os.makedirs(R+'/references/animation-catalog/filmstrips',exist_ok=True)
def wrap(d,t,font,w):
    out=[];cur=''
    for wd in t.split():
        if d.textlength(cur+' '+wd,font=font)>w and cur: out.append(cur);cur=wd
        else: cur=(cur+' '+wd).strip()
    return out+[cur]
for i in ids:
    m=json.load(open(f'{R}/components/animations/meta/{i}.json'))
    B=Image.new('RGB',(1920,1080),BG);d=ImageDraw.Draw(B)
    d.rectangle([0,0,1919,104],fill=CARD)
    d.text((40,20),m['id'],font=F(56,True),fill=OR);d.text((200,16),m['name'],font=F(44,True),fill=INK)
    d.text((200,60),f"{m['category']}  |  {m['duration']} frames @30fps = {m['duration']/30:.1f}s",font=F(22),fill=INK)
    d.text((200,82),'Easing: '+m['easing'][:170],font=F(18),fill=INK)
    tw,th=576,324;gx,gy=(1920-3*tw)//4,18
    pos=[]
    for k,f in enumerate(m['keyframes']):
        x=gx+(k%3)*(tw+gx);y=122+(k//3)*(th+54);pos.append((x,y))
        im=Image.open(f'{R}/out/{i}/f{f}.png').convert('RGB').resize((tw,th),Image.LANCZOS);B.paste(im,(x,y))
        d.rectangle([x-1,y-1,x+tw,y+th],outline=INK,width=2)
        d.text((x,y+th+8),f'frame {f}  ({f/30:.2f}s)',font=F(24,True),fill=INK)
        # safe frame ticks
        sx0,sy0,sx1,sy1=[int(v*tw/1920) for v in (154,86,1766,994)]
        d.rectangle([x+sx0,y+sy0,x+sx1,y+sy1],outline=(22,119,255),width=1)
    for c in m['callouts']:
        x,y=pos[c['k']];cx=x+int(c['x']*tw/1920);cy=y+int(c['y']*th/1080)
        bx,by=cx+30,cy-30
        d.line([bx,by,cx,cy],fill=OR,width=3);d.ellipse([cx-4,cy-4,cx+4,cy+4],fill=OR)
        d.ellipse([bx-15,by-15,bx+15,by+15],fill=OR,outline=INK,width=2);d.text((bx,by),str(c['n']),font=F(22,True),fill=(11,11,11),anchor='mm')
    ly=122+2*(th+54)+2;col=0
    d.text((40,ly),'WHAT MOVES',font=F(24,True),fill=INK);ly+=34
    for c in m['callouts']:
        d.ellipse([40,ly,70,ly+30],fill=OR);d.text((55,ly+15),str(c['n']),font=F(22,True),fill=(11,11,11),anchor='mm')
        d.text((84,ly+2),c['text'],font=F(26),fill=INK);ly+=34
    if m.get('ref') and os.path.exists(f"{R}/references/visual-refs/{m['ref']}"):
        rf=Image.open(f"{R}/references/visual-refs/{m['ref']}").convert('RGB');rf.thumbnail((330,200));rx=1920-40-rf.width;ry=1080-20-rf.height
        B.paste(rf,(rx,ry));d.rectangle([rx-1,ry-1,rx+rf.width,ry+rf.height],outline=OR,width=2);d.text((rx,ry-28),'USER REFERENCE: '+m['ref'],font=F(20,True),fill=OR)
    d.text((1000,122+2*(th+54)+4),'blue dashed = safe frame (154,86)-(1766,994)  |  min text 24px',font=F(22),fill=(22,119,255))
    B.save(f"{R}/references/animation-catalog/filmstrips/{i}.png");print('board',i)
