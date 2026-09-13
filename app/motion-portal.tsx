'use client';
import {useEffect,useRef} from 'react';

// Draw bloom once into a sprite; the animation loop only composites it.
export function MotionPortal(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const canvas=ref.current,ctx=canvas?.getContext('2d');if(!canvas||!ctx)return;
  const sprite=document.createElement('canvas');sprite.width=sprite.height=64;
  const s=sprite.getContext('2d')!;const glow=s.createRadialGradient(32,32,0,32,32,32);
  glow.addColorStop(0,'#fff');glow.addColorStop(.12,'#ffffe8');glow.addColorStop(.3,'#dcffc5a0');glow.addColorStop(1,'#b2eec000');s.fillStyle=glow;s.fillRect(0,0,64,64);
  const sections=['northstar','plateforge','architecture'].map(id=>document.getElementById(id)).filter((e):e is HTMLElement=>!!e);
  let stops:number[]=[],w=0,h=0,frame=0,last=0,position=scrollY,target=scrollY,active=true;
  const measure=()=>{w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio,1.5);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);stops=sections.map(el=>el.getBoundingClientRect().top+scrollY);};
  const wake=()=>{if(!frame&&active)frame=requestAnimationFrame(tick);};
  const onScroll=()=>{target=scrollY;wake();};const onVisibility=()=>{active=!document.hidden;if(!active){cancelAnimationFrame(frame);frame=0;}else{last=0;wake();}};
  const particles=Array.from({length:720},(_,i)=>({angle:i*2.399963,spread:Math.sin(i*37.1),phase:i*.719,size:1+(i%5)*.4}));
  const scenes=['forest-office.jpg','food-background.jpg','building-background.jpg'].map(src=>{const img=new Image();img.src='/portfolio/'+src;return img;});
  const tick=(now:number)=>{
   frame=0;const dt=Math.min(40,now-last||16);last=now;position+=(target-position)*(1-Math.exp(-dt/48));
   ctx.clearRect(0,0,w,h);
   if(active){const stop=stops.find(y=>position>y-h*.9&&position<y+h*.08);
    if(stop!==undefined){const p=Math.max(0,Math.min(1,(position-stop+h*.9)/(h*.98)));const alpha=Math.min(1,p/.14)*Math.min(1,(1-p)/.16);
     const ease=p*p*(3-2*p),r=24+ease*Math.hypot(w,h)*.64,cx=w*.5,cy=h*.5;
     const edge=(offset:number)=>{ctx.beginPath();for(let i=0;i<=192;i++){const a=i/192*Math.PI*2;const ripple=(Math.sin(a*7+now*.0017)*7+Math.sin(a*13-now*.002)*3)*(1-p*.6);const radius=Math.max(0,r+offset+ripple);const x=cx+Math.cos(a)*radius,y=cy+Math.sin(a)*radius;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();};
     // A glimpse of the destination is revealed through the aperture, not a flat ring over the page.
     const scene=scenes[stops.indexOf(stop)];
     if(scene?.complete&&scene.naturalWidth){ctx.save();edge(-4);ctx.clip();ctx.globalAlpha=alpha*.92;const scale=Math.max(w/scene.naturalWidth,h/scene.naturalHeight)*(1.08-.08*ease);const sw=scene.naturalWidth*scale,sh=scene.naturalHeight*scale;ctx.drawImage(scene,(w-sw)/2,(h-sh)/2,sw,sh);ctx.fillStyle='#09211955';ctx.fillRect(0,0,w,h);ctx.restore();}
     // Raised inner lip and a soft outer shadow make the opening read as a folded edge.
     const lip=ctx.createRadialGradient(cx,cy,Math.max(0,r-28),cx,cy,r+48);
     lip.addColorStop(0,'#10271e00');lip.addColorStop(.25,'#173a2a38');lip.addColorStop(.38,'#fbffecc0');lip.addColorStop(.52,'#d3e6b870');lip.addColorStop(.72,'#132e2435');lip.addColorStop(1,'#132e2400');
     ctx.globalAlpha=alpha;ctx.fillStyle=lip;ctx.beginPath();ctx.arc(cx,cy,r+48,0,Math.PI*2);ctx.fill();
     // Contoured bands give the edge a rolled profile, with a dark underside and bright crest.
     for(const [offset,width,color] of [[14,15,'#10271e30'],[7,9,'#dcecd666'],[1,3,'#ffffffcc'],[-3,2,'#acd9ec99']] as const){edge(offset);ctx.lineWidth=width;ctx.strokeStyle=color;ctx.stroke();}
     ctx.globalCompositeOperation='lighter';
     for(const pt of particles){const a=pt.angle+now*.00008;const wave=Math.sin(a*7+now*.0017)*7+Math.sin(a*13-now*.002)*3;const radius=r+pt.spread*(15+22*p)+wave;const x=cx+Math.cos(a)*radius,y=cy+Math.sin(a)*radius;
      const shimmer=.25+.75*Math.pow(Math.sin(now*.002+pt.phase),2);const cluster=.55+.65*Math.pow(Math.sin(a*3+now*.0006),6);const size=pt.size*(2+shimmer*5)*cluster;ctx.globalAlpha=alpha*shimmer;ctx.drawImage(sprite,x-size/2,y-size/2,size,size);
      if(pt.size>2.4&&shimmer>.94){ctx.fillStyle='#fffef2';ctx.fillRect(x-.5,y-4,.8,8);ctx.fillRect(x-4,y-.5,8,.8);}
     }
     ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    }
   }if(active&&(Math.abs(target-position)>.1||stops.some(y=>position>y-h*.9&&position<y+h*.08)))frame=requestAnimationFrame(tick);
  };
  measure();const observer=new ResizeObserver(measure);observer.observe(document.body);
  addEventListener('resize',measure);addEventListener('scroll',onScroll,{passive:true});document.addEventListener('visibilitychange',onVisibility);frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();removeEventListener('resize',measure);removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',onVisibility);};
 },[]);
 return <><HoverMotion/><div className="portal-effect" aria-hidden="true"><canvas ref={ref}/></div></>;
}

export function HoverMotion(){
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches)return;
  const cards=Array.from(document.querySelectorAll<HTMLElement>('.feature-stage,.board button'));
  const cleanups=cards.map(card=>{
   let frame=0,x=0,y=0;
   const move=(e:PointerEvent)=>{const r=card.getBoundingClientRect();x=(e.clientX-r.left)/r.width;y=(e.clientY-r.top)/r.height;if(!frame)frame=requestAnimationFrame(()=>{frame=0;card.style.setProperty('--mx',`${x*100}%`);card.style.setProperty('--my',`${y*100}%`);card.style.setProperty('--rx',`${(y-.5)*-5}deg`);card.style.setProperty('--ry',`${(x-.5)*7}deg`);});};
   const leave=()=>{cancelAnimationFrame(frame);frame=0;card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');};
   card.addEventListener('pointermove',move);card.addEventListener('pointerleave',leave);
   return()=>{cancelAnimationFrame(frame);card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave);};
  });return()=>cleanups.forEach(fn=>fn());
 },[]);return null;
}
