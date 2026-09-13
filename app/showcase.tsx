'use client';
import {useEffect,useRef,useState} from 'react';
const B='/portfolio/';
export function Portal(){
 const canvas=useRef<HTMLCanvasElement>(null),reveal=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const el=canvas.current,layer=reveal.current;if(!el||!layer)return;const ctx=el.getContext('2d');if(!ctx)return;let raf=0,w=0,h=0;const seeds=Array.from({length:620},(_,i)=>({a:i/620*Math.PI*2,r:Math.random(),speed:.5+Math.random(),size:.5+Math.random()*2}));const targets=[['northstar','forest-office.jpg'],['plateforge','food-background.jpg'],['architecture','building-background.jpg'],['about','green-gallery.jpg'],['nivea','portal-background.jpg']];const resize=()=>{w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio,1.5);el.width=w*d;el.height=h*d;ctx.setTransform(d,0,0,d,0,0);};resize();addEventListener('resize',resize);
 const render=(time:number)=>{ctx.clearRect(0,0,w,h);let p=-1;let bg='';for(const [id,img] of targets){const top=document.getElementById(id)?.getBoundingClientRect().top;if(top!==undefined&&top<h*.82&&top>h*-.12){p=1-(top+h*.12)/(h*.94);bg=img;break;}}
 if(p>=0){const envelope=Math.sin(Math.PI*p);const radius=Math.min(w,h)*(.11+p*p*1.15),cx=w*.5,cy=h*.51;layer.style.backgroundImage=`url('${B+bg}')`;layer.style.clipPath=`circle(${radius}px at 50% 51%)`;layer.style.opacity=String(envelope*.82);ctx.globalCompositeOperation='lighter';for(const s of seeds){const a=s.a+time*.00012*s.speed;const jitter=Math.sin(time*.003+s.a*15)*8;const r=radius+(s.r-.5)*Math.min(75,radius*.23)+jitter;const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;ctx.globalAlpha=envelope*(.35+s.r*.65);ctx.fillStyle=s.r>.75?'#ffffff':s.r>.35?'#e6ffd1':'#bfecd9';ctx.shadowColor='#efffd8';ctx.shadowBlur=s.size*5;ctx.beginPath();ctx.arc(x,y,s.size*(1+envelope),0,Math.PI*2);ctx.fill();if(s.r>.93){ctx.strokeStyle='#fffde5';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x-6,y);ctx.lineTo(x+6,y);ctx.moveTo(x,y-6);ctx.lineTo(x,y+6);ctx.stroke();}}ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.globalCompositeOperation='source-over';}else layer.style.opacity='0';raf=requestAnimationFrame(render);};raf=requestAnimationFrame(render);return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize);};},[]);
 return <div className="portal-effect" aria-hidden="true"><div ref={reveal} className="portal-reveal"/><canvas ref={canvas}/></div>
}
type DemoCard={title:string;desc:string;prompt:string;result:string;image?:string;video?:string;bg:string;mode:string};
const data:Record<'northstar'|'plateforge',DemoCard[]>={
 northstar:[
  {title:'知识库，让经验成为创作资产',desc:'收集内容、笔记与案例，在同一个空间持续整理、检索和复用。',prompt:'知识库如何沉淀内容？',result:'录屏展示：新建资料、整理知识并在创作时调用。',video:'northstar-knowledge.mp4',bg:'forest-office.jpg',mode:'knowledge'},
  {title:'甘特图，把创作计划排进时间',desc:'把选题、脚本、拍摄和发布放进清晰时间线，随进度调整节奏。',prompt:'看看内容排期怎么推进',result:'录屏展示：拖动任务、查看阶段与调整创作排期。',video:'northstar-schedule.mp4',bg:'green-gallery.jpg',mode:'schedule'}
 ],
 plateforge:[
  {title:'记录今天吃了多少',desc:'计划热量与已摄入热量并排呈现，每餐选择一目了然。',prompt:'记录早餐 · 420 kcal',result:'早餐已记录，今日摄入与剩余预算同步更新。',image:'plate-calories.png',bg:'food-background.jpg',mode:'calories'},
  {title:'每餐只给两个选择',desc:'根据目标和时间为每餐精选两道菜，减少反复比较带来的纠结。',prompt:'酸奶碗，还是味噌吐司？',result:'只保留两个合适选项：快速比较，然后直接选定。',image:'plate-plan.png',bg:'vegetable-still.jpg',mode:'choice'},
  {title:'拍冰箱，补齐购物清单',desc:'识别已有食材，并告诉你为了计划中的菜还需要购买什么。',prompt:'识别冰箱，还缺什么？',result:'识别 6 种现有食材，并生成 3 项待购清单。',image:'plate-fridge.png',bg:'forest-office.jpg',mode:'fridge'},
  {title:'选好菜，跟着步骤做',desc:'进入专注烹饪模式，一次只展示当前步骤，让行动更轻松。',prompt:'开始制作酸奶坚果碗',result:'进入分步烹饪：当前步骤完成后，再显示下一步。',image:'plate-cook.png',bg:'food-background.jpg',mode:'cooking'}
 ]
};
export function FeatureShowcase({product}:{product:'northstar'|'plateforge'}){
 const [playing,setPlaying]=useState<number|null>(null),[done,setDone]=useState(false);
 useEffect(()=>{if(playing===null)return;setDone(false);const t=setTimeout(()=>setDone(true),2200);return()=>clearTimeout(t);},[playing]);
 const play=(i:number)=>{setPlaying(i);setDone(false);};
 return <section className={'feature-showcase '+product+'-features'} aria-label={product+'功能展示'}><div className="feature-heading"><span className="eyebrow">IN ACTION / 功能演示</span><h2>{product==='northstar'?'让工作流真正动起来。':'从计划、选择，到买菜和动手。'}</h2><p>{product==='northstar'?'直接播放真实录屏，查看知识库与内容排期的交互。':'四个不同页面，对应一条完整的饮食决策链路。'}</p></div><div className="feature-grid">{data[product].map((card,i)=><article className={'feature-card '+card.mode} key={card.title}><div className={'feature-stage '+(playing===i?'playing':'')} style={{backgroundImage:`url('${B+card.bg}')`}}><div className="feature-tint"/><div className="feature-device"><div className="device-label">{product==='northstar'?'NorthStar / Workspace':'PlateForge / Daily companion'}<span>✦</span></div>{card.video?<video src={B+card.video} muted loop playsInline preload="metadata" autoPlay aria-label={card.title+' · 真实产品录屏'}/>:<img src={B+card.image} alt={card.title+' · 产品真实界面'} loading="lazy"/>}<div className="scan-line"/></div><button className="demo-prompt" onClick={()=>play(i)} aria-label={'演示：'+card.title}><span className="demo-star">✦</span><span className="prompt-text">{card.prompt}</span><span className="demo-send">↑</span></button>{playing===i&&<div className="demo-result" aria-live="polite">{done?card.result:'正在演示使用流程…'}</div>}<span className="stage-note">真实 UI · {card.video?'产品录屏':'交互流程演示'}</span></div><h3>{card.title}</h3><p>{card.desc}</p><button className="demo-link" onClick={()=>play(i)}>{card.video?'播放真实录屏':playing===i?'再次查看演示':'播放功能演示'} ↗</button></article>)}</div><small className="feature-disclaimer">展示内容来自真实产品界面；交互说明为作品集演示，完整功能请通过上方链接打开产品。</small></section>
}
