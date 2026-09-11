'use client';
import { useEffect, useRef } from 'react';
import * as T from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

export default function Scene({ onReady }: { onReady: () => void }) {
 const host = useRef<HTMLDivElement>(null);
 useEffect(() => {
  if (!host.current) return;
  let renderer: T.WebGLRenderer;
  try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference:'high-performance' }); } catch { onReady(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.NoToneMapping;
  host.current.appendChild(renderer.domElement);
  const draco = new DRACOLoader().setDecoderPath('/decoders/');
  const ktx = new KTX2Loader().setTranscoderPath('/decoders/').detectSupport(renderer);
  const loader = new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx);
  const scenes = [new T.Scene(),new T.Scene(),new T.Scene()];
  const cameras = scenes.map(()=> new T.PerspectiveCamera(25,1,.01,150));
  const models: (T.Group | null)[] = [null,null,null];
  const mixers: (T.AnimationMixer | null)[] = [null,null,null];
  const durations = [0,0,0];
  const targets = [new T.WebGLRenderTarget(1,1),new T.WebGLRenderTarget(1,1)];
  const screenScene = new T.Scene();
  const screenCamera = new T.OrthographicCamera(-1,1,1,-1,0,1);
  const shader = new T.ShaderMaterial({ uniforms:{a:{value:targets[0].texture},b:{value:targets[1].texture},mixValue:{value:0},aspect:{value:1}}, vertexShader:'varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position,1.0);}',fragmentShader:`uniform sampler2D a; uniform sampler2D b; uniform float mixValue; uniform float aspect; varying vec2 vUv; void main(){vec2 p=vUv-.5;p.x*=aspect;float noise=sin(vUv.x*135.0)*sin(vUv.y*89.0)*.023;float radius=mixValue*(aspect+.9);float mask=1.-smoothstep(radius-.14,radius+.14,length(p)+noise);mask=mixValue<.001?0.:mixValue>.999?1.:mask;vec4 c=mix(texture2D(a,vUv),texture2D(b,vUv),mask);float edge=(1.-abs(mask*2.-1.))*sin(mixValue*3.14159);c.rgb+=vec3(.9,.72,.43)*edge*.28;gl_FragColor=c;}` });
  shader.fragmentShader=shader.fragmentShader.replace('gl_FragColor=c;}', 'gl_FragColor=c;\n#include <colorspace_fragment>\n}');
  screenScene.add(new T.Mesh(new T.PlaneGeometry(2,2),shader));
  scenes.forEach((s,i)=> {s.background=new T.Color(i===0?'#34463f':i===1?'#101f2e':'#66583e');s.add(new T.AmbientLight(0xffffff,2.3)); const sun=new T.DirectionalLight(0xfff1d6,2);sun.position.set(2,4,6);s.add(sun);});
  let gone=false;
  ['hero','cue','content'].forEach((name,i)=> {
   ktx.load('/scenes/'+name+'-bg.ktx2',texture=>{if(gone){texture.dispose();return;}texture.colorSpace=T.SRGBColorSpace;texture.repeat.y=-1;texture.offset.y=1;scenes[i].background=texture;});
   loader.load('/scenes/'+name+'.glb',g=>{
    if(gone)return;
    const m=g.scene; models[i]=m;scenes[i].add(m);
    m.traverse(o=>{if(o instanceof T.Mesh){o.frustumCulled=false;const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(mat=>{if('metalness' in mat)mat.metalness=0;if('roughness' in mat)mat.roughness=1;});}});
    if(i===0){m.scale.set(2,2,3);m.position.set(-.233,.141,-7.09);m.rotation.y=.07;}
    else {const box=new T.Box3().setFromObject(m); const size=box.getSize(new T.Vector3());const center=box.getCenter(new T.Vector3());const scale=5.5/Math.max(size.x,size.y);m.scale.setScalar(scale);m.position.copy(center.multiplyScalar(-scale));m.position.z-=5;}
    if(g.animations.length){const mixer=new T.AnimationMixer(m);mixers[i]=mixer;g.animations.forEach(clip=>mixer.clipAction(clip).play());durations[i]=g.animations[0].duration;mixer.setTime(i===0?0:durations[i]*.55);}
    if(i===0)onReady();
   },undefined,()=>{if(i===0)onReady();});
  });
  const particles = new T.BufferGeometry();const positions=new Float32Array(210*3);for(let i=0;i<positions.length;i++)positions[i]=(Math.random()-.5)*22;particles.setAttribute('position',new T.BufferAttribute(positions,3));
  const dust = scenes.map(s=>{const p=new T.Points(particles,new T.PointsMaterial({color:0xffe1a2,size:.021,transparent:true,opacity:.65,depthWrite:false}));s.add(p);return p;});
  let px=0,py=0,scroll=window.scrollY/innerHeight,raf=0;
  const pointer=(e:PointerEvent)=>{px=(e.clientX/innerWidth-.5)*2;py=(e.clientY/innerHeight-.5)*2;};
  const resize=()=>{renderer.setSize(innerWidth,innerHeight);targets.forEach(t=>t.setSize(innerWidth*renderer.getPixelRatio(),innerHeight*renderer.getPixelRatio()));cameras.forEach(c=>{c.aspect=innerWidth/innerHeight;c.updateProjectionMatrix();});shader.uniforms.aspect.value=innerWidth/innerHeight;};
  resize();window.addEventListener('resize',resize);window.addEventListener('pointermove',pointer);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const render=(time:number)=>{
   scroll+=(window.scrollY/innerHeight-scroll)*.09;
   const thresholds=[1.25,3.4];let first=0,second=0,blend=0;
   if(scroll>thresholds[1]){first=1;second=2;blend=Math.min(1,(scroll-thresholds[1])/.55);}else if(scroll>thresholds[0]){first=0;second=1;blend=Math.min(1,(scroll-thresholds[0])/.55);}
   cameras[0].position.set(px*.12,py*-.09,6.45+Math.min(scroll,1.4)*3.4);cameras[0].rotation.set(py*.007,px*-.009,Math.min(scroll,1.4)*-.022);
   cameras[1].position.set(px*.1,py*-.08,9-Math.max(0,Math.min(1.8,scroll-1.8))*.5);cameras[1].lookAt(0,0,-5);
   cameras[2].position.set(px*.15,py*-.08,9-Math.max(0,Math.min(2,scroll-3.8))*.5);cameras[2].lookAt(0,0,-5);
   models.forEach((m,i)=>{if(!m)return;if(i===0){mixers[0]?.setTime(Math.min(1,scroll*.52)*durations[0]);}else{m.rotation.y=Math.sin(time*.00012)*.07+px*.025;mixers[i]?.update(reduced?0:.004);}});
   dust.forEach((p,i)=>{p.rotation.y=reduced?0:time*.00001;p.rotation.z=i*.3;});
   renderer.setRenderTarget(targets[0]);renderer.render(scenes[first],cameras[first]);renderer.setRenderTarget(targets[1]);renderer.render(scenes[second],cameras[second]);renderer.setRenderTarget(null);shader.uniforms.mixValue.value=blend;renderer.render(screenScene,screenCamera);raf=requestAnimationFrame(render);
  };
  raf=requestAnimationFrame(render);
  return()=>{gone=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',pointer);renderer.dispose();targets.forEach(t=>t.dispose());draco.dispose();ktx.dispose();renderer.domElement.remove();};
 },[onReady]);
 return <div className="scene" ref={host} aria-hidden="true"/>;
}
