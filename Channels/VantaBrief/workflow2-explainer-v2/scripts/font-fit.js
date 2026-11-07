#!/usr/bin/env node
// font-fit.js: fitTitle(text, {maxWidth=1612, fontPx=96, minPx=56, family='Inter', weight=800}) -> {lines:[...], fontPx}
// Uses a char-width estimate (Inter ExtraBold avg 0.60em); bounds-check.py is the real judge in a browser.
function measure(text, px){return text.length*px*0.60}
function fitTitle(text,o={}){const W=o.maxWidth||1612,max=o.fontPx||96,min=o.minPx||56;
  for(let px=max;px>=min;px-=2) if(measure(text,px)<=W) return {lines:[text],fontPx:px};
  const w=text.split(' ');let best=null;
  for(let i=1;i<w.length;i++){const a=w.slice(0,i).join(' '),b=w.slice(i).join(' ');const L=Math.max(a.length,b.length);
    if(!best||L<best.L)best={L,lines:[a,b]}}
  let px=max;while(px>min&&measure('x'.repeat(best?best.L:text.length),px)>W)px-=2;
  return {lines:best?best.lines:[text],fontPx:Math.max(px,min)}}
function fitInBox(text,boxW,{fontPx=44,minPx=24,pad=28}={}){const inner=boxW-2*pad;let px=fontPx;
  while(px>minPx&&text.split(' ').reduce((m,w)=>Math.max(m,w.length),0)*px*0.55>inner)px-=2;return px}
module.exports={fitTitle,fitInBox};
if(require.main===module){console.log(JSON.stringify(fitTitle(process.argv[2]||'Real World or Benchmark?')))}
