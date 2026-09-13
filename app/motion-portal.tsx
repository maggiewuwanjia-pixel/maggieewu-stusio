'use client';
import {useEffect,useRef} from 'react';

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(a:number,b:number,n:number)=>{const x=clamp((n-a)/(b-a));return x*x*(3-2*x);};

export function MotionPortal(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const canvas=ref.current,ctx=canvas?.getContext('2d');if(!canvas||!ctx)return;
  const ids=['northstar','plateforge','architecture','about','nivea'];
  const sections=ids.map(id=>document.getElementById(id)).filter((el):el is HTMLElement=>!!el);
  const scenes=['forest-office.jpg','food-background.jpg','building-background.jpg','green-gallery.jpg','portal-background.jpg'].map(src=>{const image=new Image();image.src='/portfolio/'+src;return image;});
  const sparks=Array.from({length:950},(_,i)=>({a:i*2.39996323,seed:(i*47%313)/313,phase:i*.731,size:.45+(i%7)*.19}));
  const stars=Array.from({length:260},(_,i)=>({x:(i*83%257)/257,y:(i*149%263)/263,phase:i*.97,size:.35+(i%9)*.16}));
  const sprite=document.createElement('canvas');sprite.width=sprite.height=48;const sg=sprite.getContext('2d')!;
  const bloom=sg.createRadialGradient(24,24,0,24,24,24);bloom.addColorStop(0,'#fff');bloom.addColorStop(.12,'#fffbd8');bloom.addColorStop(.38,'#f7c75d88');bloom.addColorStop(1,'#d8a83300');sg.fillStyle=bloom;sg.fillRect(0,0,48,48);
  let stops:number[]=[],w=0,h=0,frame=0,last=0,position=scrollY,target=scrollY,active=true;
  const measure=()=>{w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio,1.5);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);stops=sections.map(el=>el.getBoundingClientRect().top+scrollY);};
  const drawCover=(image:HTMLImageElement,zoom=1)=>{if(!image.complete||!image.naturalWidth)return;const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight)*zoom,iw=image.naturalWidth*scale,ih=image.naturalHeight*scale;ctx.drawImage(image,(w-iw)/2,(h-ih)/2,iw,ih);};
  const ringPath=(cx:number,cy:number,r:number,now:number,p:number,offset=0)=>{ctx.beginPath();for(let i=0;i<=240;i++){const a=i/240*Math.PI*2,n=Math.sin(a*7+now*.0016)*5+Math.sin(a*17-now*.0011)*2.8+Math.sin(a*29+1.7)*1.4,rr=Math.max(0,r+offset+n*(1-p*.55)),x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();};
  const drawSpark=(x:number,y:number,size:number,alpha:number,cross=false)=>{ctx.globalAlpha=alpha;ctx.drawImage(sprite,x-size/2,y-size/2,size,size);if(cross){ctx.strokeStyle='#fffbe7';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(x-size*.8,y);ctx.lineTo(x+size*.8,y);ctx.moveTo(x,y-size*.8);ctx.lineTo(x,y+size*.8);ctx.stroke();}};
  const drawPortal=(p:number,now:number,image:HTMLImageElement)=>{
   const intro=smooth(0,.18,p),open=smooth(.12,.84,p),out=1-smooth(.84,1,p),alpha=Math.min(intro,out),cx=w*.5,cy=h*.5;
   // Hold the complete halo in-frame longer on a portrait viewport. The reference
   // blooms first and only accelerates once the light filaments are established.
   const expansion=Math.pow(open,w<700?1.42:.92),r=8+expansion*Math.hypot(w,h)*(w<700?.67:.7);
   const preGlow=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(w,h)*.62);preGlow.addColorStop(0,`rgba(255,241,171,${.22*intro*out})`);preGlow.addColorStop(.5,`rgba(235,190,83,${.08*intro*out})`);preGlow.addColorStop(1,'transparent');ctx.fillStyle=preGlow;ctx.fillRect(0,0,w,h);
   for(const s of sparks.slice(0,260)){const rr=Math.min(w,h)*(.08+s.seed*.58)*(1-.16*open),x=cx+Math.cos(s.a)*rr,y=cy+Math.sin(s.a)*rr*.65,tw=.25+.75*Math.pow(Math.sin(now*.003+s.phase),8);drawSpark(x,y,s.size*(2+tw*5),alpha*tw*.78,s.size>1.25&&tw>.8);}
   if(open<.015)return;
   ctx.save();ringPath(cx,cy,r,now,p,-5);ctx.clip();ctx.globalAlpha=.98*out;drawCover(image,1.07-.07*open);const wash=ctx.createRadialGradient(cx,cy,0,cx,cy,r);wash.addColorStop(0,'#ffeeb000');wash.addColorStop(.76,'#f1c7650b');wash.addColorStop(1,'#fff0b02b');ctx.fillStyle=wash;ctx.fillRect(0,0,w,h);ctx.restore();
   ctx.save();ctx.globalCompositeOperation='lighter';for(let band=0;band<3;band++){ringPath(cx,cy,r,now,p,band*5-2);ctx.setLineDash([8+band*5,3+band*7,18,5]);ctx.lineDashOffset=-now*(.012+band*.004);ctx.strokeStyle=band===0?'#fffdf0':band===1?'#ffd679':'#d9fff0';ctx.globalAlpha=alpha*(.82-band*.18);ctx.lineWidth=band===0?2.2:1.1;ctx.stroke();}
   for(const s of sparks){const wave=Math.sin(s.a*11+now*.0018)*5,rr=r+(s.seed-.5)*(24+18*open)+wave,x=cx+Math.cos(s.a)*rr,y=cy+Math.sin(s.a)*rr,tw=Math.pow(Math.sin(now*.0024+s.phase),6);drawSpark(x,y,s.size*(1.5+tw*4),alpha*(.12+tw*.74),s.size>1.35&&tw>.88);}ctx.restore();ctx.globalAlpha=1;ctx.setLineDash([]);
  };
  const tearY=(x:number,p:number,now:number)=>h*(1.12-p*1.28)+Math.sin(x*.011+now*.001)*18+Math.sin(x*.027-1.4)*7;
  const drawDissolve=(p:number,now:number,image:HTMLImageElement)=>{
   const enter=smooth(0,.16,p),out=1-smooth(.88,1,p),alpha=Math.min(enter,out),reveal=smooth(.2,.86,p);
   ctx.globalAlpha=alpha;const night=ctx.createLinearGradient(0,0,0,h);night.addColorStop(0,'#06151f');night.addColorStop(1,'#0c211d');ctx.fillStyle=night;ctx.fillRect(0,0,w,h);
   ctx.save();ctx.globalCompositeOperation='lighter';for(const s of stars){const x=s.x*w,y=s.y*h,tw=Math.pow(Math.sin(now*.002+s.phase),8);drawSpark(x,y,s.size*(2+tw*8),alpha*(.18+tw*.65),s.size>1.4&&tw>.75);}ctx.restore();
   ctx.save();ctx.beginPath();ctx.moveTo(0,h);for(let x=0;x<=w;x+=10)ctx.lineTo(x,tearY(x,reveal,now));ctx.lineTo(w,h);ctx.closePath();ctx.clip();ctx.globalAlpha=alpha;drawCover(image,1.025);ctx.restore();
   ctx.save();ctx.globalCompositeOperation='lighter';for(let band=0;band<4;band++){ctx.beginPath();for(let x=0;x<=w;x+=8){const y=tearY(x,reveal,now)+band*5-7;x?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=band<2?'#fff9df':'#e7bd62';ctx.globalAlpha=alpha*(.78-band*.13);ctx.lineWidth=band===0?2.4:1;ctx.stroke();}
   for(let i=0;i<420;i++){const s=sparks[i],x=s.seed*w,edge=tearY(x,reveal,now),fall=((s.phase*37+now*.025)%76)-25,y=edge+fall,tw=Math.pow(Math.sin(now*.003+s.phase),6);drawSpark(x,y,s.size*(1+tw*4),alpha*(.12+tw*.7),s.size>1.3&&tw>.9);}ctx.restore();ctx.globalAlpha=1;
  };
  const wake=()=>{if(!frame&&active)frame=requestAnimationFrame(tick);};
  const onScroll=()=>{target=scrollY;wake();},onVisibility=()=>{active=!document.hidden;if(!active){cancelAnimationFrame(frame);frame=0;}else{last=0;wake();}};
  const tick=(now:number)=>{frame=0;const dt=Math.min(40,now-last||16);last=now;position+=(target-position)*(1-Math.exp(-dt/55));ctx.clearRect(0,0,w,h);let current=-1;for(let i=0;i<stops.length;i++)if(position>stops[i]-h*.9&&position<stops[i]+h*.08){current=i;break;}if(active&&current>=0){const p=clamp((position-stops[current]+h*.9)/(h*.98));current===0?drawPortal(p,now,scenes[current]):drawDissolve(p,now,scenes[current]);}if(active&&(Math.abs(target-position)>.1||current>=0))frame=requestAnimationFrame(tick);};
  measure();const observer=new ResizeObserver(measure);observer.observe(document.body);addEventListener('resize',measure);addEventListener('scroll',onScroll,{passive:true});document.addEventListener('visibilitychange',onVisibility);frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();removeEventListener('resize',measure);removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',onVisibility);};
 },[]);
 return <><HoverMotion/><div className="portal-effect" aria-hidden="true"><canvas ref={ref}/></div></>;
}

export function HoverMotion(){
 useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches)return;const cards=Array.from(document.querySelectorAll<HTMLElement>('.feature-stage,.board button'));const cleanups=cards.map(card=>{let frame=0,x=0,y=0;const move=(e:PointerEvent)=>{const r=card.getBoundingClientRect();x=(e.clientX-r.left)/r.width;y=(e.clientY-r.top)/r.height;if(!frame)frame=requestAnimationFrame(()=>{frame=0;card.style.setProperty('--mx',`${x*100}%`);card.style.setProperty('--my',`${y*100}%`);card.style.setProperty('--rx',`${(y-.5)*-5}deg`);card.style.setProperty('--ry',`${(x-.5)*7}deg`);});};const leave=()=>{cancelAnimationFrame(frame);frame=0;card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');};card.addEventListener('pointermove',move);card.addEventListener('pointerleave',leave);return()=>{cancelAnimationFrame(frame);card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave);};});return()=>cleanups.forEach(fn=>fn());},[]);return null;
}
