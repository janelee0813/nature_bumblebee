import * as THREE from './vendor/three.module.js';
import { createBee } from './bee.js';
import { createMeadow } from './meadow.js';
const $=s=>document.querySelector(s), clamp=THREE.MathUtils.clamp;
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const mobile=innerWidth<=600,motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
let reduced=motionQuery.matches,lenis,renderer,rafId,frozenProgress=0;
const state={progress:0},journey=$('#journey'),intro=$('.intro-copy'),end=$('.end-copy'),caption=$('.flight-caption');
const stops=[...document.querySelectorAll('[data-stop]')],chapters=['PROLOGUE / A LITTLE FLIGHT','01 / ABOVE THE GRASS','02 / BETWEEN THE FLOWERS','EPILOGUE / NATURE BUMBLEBEE'];
let active=-1,lastCaption=-1,focusAtEnd=false;
function moveTo(p){const top=p*(journey.offsetHeight-innerHeight);if(lenis)lenis.scrollTo(top,{duration:1.7});else window.scrollTo({top,behavior:reduced?'instant':'smooth'});}
$('.brand').addEventListener('click',e=>{e.preventDefault();moveTo(0);});
$('.start-flight').addEventListener('click',()=>moveTo(.24));$('.skip-flight').addEventListener('click',()=>moveTo(1));$('.replay').addEventListener('click',()=>moveTo(0));
$('.skip-link').addEventListener('click',e=>{e.preventDefault();focusAtEnd=true;moveTo(1);});
$('.scroll-cue').addEventListener('click',()=>moveTo(state.progress>.92?0:Math.min(state.progress+.2,1)));
stops.forEach(b=>b.addEventListener('click',()=>moveTo(Number(b.dataset.stop))));$('.reload').addEventListener('click',()=>location.reload());
function setMotion(value){if(value)frozenProgress=state.progress;reduced=value;lenis?.destroy();lenis=undefined;if(window.Lenis&&!reduced){lenis=new Lenis({duration:1.15,smoothWheel:true,wheelMultiplier:.86,syncTouch:false});lenis.on('scroll',()=>window.ScrollTrigger?.update());}document.body.classList.toggle('motion-reduced',reduced);$('.motion-toggle').setAttribute('aria-pressed',String(reduced));$('.motion-toggle').setAttribute('aria-label',reduced?'전체 움직임 켜기':'움직임 줄이기');$('#motion-text').textContent=reduced?'MOTION OFF':'MOTION ON';$('.motion-icon').textContent=reduced?'▷':'Ⅱ';}
$('.motion-toggle').addEventListener('click',()=>setMotion(!reduced));motionQuery.addEventListener('change',e=>setMotion(e.matches));
function visibility(el,a){el.style.opacity=a.toFixed(3);el.style.visibility=a>.015?'visible':'hidden';}
function updateInterface(p){
 const a=1-smooth(.025,.145,p);visibility(intro,a);intro.inert=a<.05;intro.setAttribute('aria-hidden',String(a<.05));intro.style.transform=`translateY(${-18*(1-a)}px)`;$('.bee-label').style.opacity=(a*.8).toFixed(3);
 const finish=smooth(.91,.98,p);visibility(end,finish);end.inert=finish<.6;end.setAttribute('aria-hidden',String(finish<.6));if(focusAtEnd&&finish>=.6){focusAtEnd=false;$('.replay').focus({preventScroll:true});}end.style.transform=`translateY(${18*(1-finish)}px)`;
 const chapter=p<.17?0:p<.53?1:p<.91?2:3;
 if(chapter!==active){active=chapter;$('#chapter-label').textContent=chapters[chapter];stops.forEach((b,i)=>{if(i===chapter)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});$('#scroll-text').textContent=chapter===3?'다시, 작은 날갯짓으로':'스크롤로 함께 날아보세요';$('.scroll-circle').textContent=chapter===3?'↑':'↓';document.body.classList.toggle('is-flying',chapter>0);document.body.classList.toggle('is-ending',chapter===3);}
 $('#progress-text').textContent=String(Math.round(p*100)).padStart(2,'0');$('#progress-bar').style.transform=`scaleX(${p})`;
 const windows=[{a:.26,b:.38,text:'작은 날갯짓으로.',en:'FOLLOW THE LITTLE WINGS'},{a:.55,b:.67,text:'꽃과 꽃 사이를\n이어갑니다.',en:'ONE FLOWER TO THE NEXT'},{a:.78,b:.88,text:'하나의 꽃에서,\n다음 생명으로.',en:'EVERY LITTLE THING IS CONNECTED'}];let amount=0;
 windows.forEach((v,i)=>{if(p>=v.a&&p<=v.b){amount=smooth(v.a,v.a+.025,p)*(1-smooth(v.b-.025,v.b,p));if(lastCaption!==i){lastCaption=i;$('#caption-text').textContent=v.text;$('#caption-en').textContent=v.en;$('.caption-index').textContent=`0${i+1} —`;}}});visibility(caption,amount*.94);caption.style.transform=`translateY(${(1-amount)*10}px)`;
}
try{
 renderer=new THREE.WebGLRenderer({canvas:$('#world'),antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.35:1.6));renderer.setSize(innerWidth,innerHeight,false);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#cbd4b3');scene.fog=new THREE.Fog('#b5c39e',11,47);
 const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.08,65);scene.add(new THREE.HemisphereLight('#fff5dc','#34472a',1.7));
 const sun=new THREE.DirectionalLight('#fff1ca',2.5);sun.position.set(-6,11,-9);scene.add(sun);const fill=new THREE.DirectionalLight('#dbe7d0',1.15);fill.position.set(5,5,5);scene.add(fill);const rim=new THREE.DirectionalLight('#ffe8ab',1.3);rim.position.set(2,5,-14);scene.add(rim);
 const path=new THREE.CatmullRomCurve3([new THREE.Vector3(0,2.35,0),new THREE.Vector3(1.5,2.25,-10),new THREE.Vector3(-4,2.5,-24),new THREE.Vector3(-5,2.3,-37),new THREE.Vector3(4,2.7,-51),new THREE.Vector3(6,2.2,-66),new THREE.Vector3(-2,2.35,-83),new THREE.Vector3(-5,2.45,-100),new THREE.Vector3(3,2.7,-117),new THREE.Vector3(5,2.25,-133),new THREE.Vector3(0,2.6,-150)],false,'centripetal');path.arcLengthDivisions=1200;path.updateArcLengths();
 const bee=createBee({mobile});bee.group.scale.setScalar(.72);scene.add(bee.group);const meadow=createMeadow({mobile,path});scene.add(meadow.group);
 const orbit=new THREE.CatmullRomCurve3([new THREE.Vector3(3.8,1,-4.2),new THREE.Vector3(4.8,.6,-2.5),new THREE.Vector3(5,1,1.8),new THREE.Vector3(2.8,1.1,4.7),new THREE.Vector3(.85,1.15,5.9)]);
 const count=mobile?230:500,positions=new Float32Array(count*3);let seed=812;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<count;i++){positions[i*3]=(random()-.5)*35;positions[i*3+1]=.5+random()*5;positions[i*3+2]=8-random()*171;}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const dot=document.createElement('canvas');dot.width=dot.height=32;const ctx=dot.getContext('2d'),gradient=ctx.createRadialGradient(16,16,0,16,16,16);gradient.addColorStop(0,'rgba(255,249,207,1)');gradient.addColorStop(.28,'rgba(255,249,207,.8)');gradient.addColorStop(1,'rgba(255,249,207,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,32,32);const dotTexture=new THREE.CanvasTexture(dot);
 const pollen=new THREE.Points(geometry,new THREE.PointsMaterial({color:'#fff1bd',map:dotTexture,size:.06,transparent:true,opacity:.45,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(pollen);
 const wakeCount=32,wakePositions=new Float32Array(wakeCount*3),wakeGeometry=new THREE.BufferGeometry();wakeGeometry.setAttribute('position',new THREE.BufferAttribute(wakePositions,3));const wake=new THREE.Points(wakeGeometry,new THREE.PointsMaterial({color:'#e4d79a',map:dotTexture,size:.035,opacity:.45,transparent:true,depthWrite:false}));wake.frustumCulled=false;scene.add(wake);
 if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);gsap.ticker.add(t=>lenis?.raf(t*1000));gsap.ticker.lagSmoothing(0);const tween=gsap.to(state,{progress:1,ease:'none',paused:true});ScrollTrigger.create({trigger:journey,start:'top top',end:'bottom bottom',animation:tween,scrub:.8,invalidateOnRefresh:true});document.fonts.ready.then(()=>ScrollTrigger.refresh());}else{window.addEventListener('scroll',()=>{state.progress=clamp(scrollY/(journey.offsetHeight-innerHeight),0,1);},{passive:true});}setMotion(reduced);
 const ratio=renderer.getPixelRatio();
 const targetRT=new THREE.WebGLRenderTarget(innerWidth*ratio,innerHeight*ratio,{depthBuffer:true});targetRT.depthTexture=new THREE.DepthTexture(innerWidth*ratio,innerHeight*ratio);targetRT.depthTexture.type=THREE.UnsignedShortType;
 const lensScene=new THREE.Scene(),lensCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
 const lens=new THREE.ShaderMaterial({uniforms:{image:{value:targetRT.texture},depthMap:{value:targetRT.depthTexture},resolution:{value:new THREE.Vector2(innerWidth*ratio,innerHeight*ratio)},nearPlane:{value:camera.near},farPlane:{value:camera.far},focus:{value:6},blur:{value:mobile?1.6:2.9}},vertexShader:'varying vec2 uvLens; void main(){uvLens=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`
 uniform sampler2D image;uniform sampler2D depthMap;uniform vec2 resolution;uniform float nearPlane;uniform float farPlane;uniform float focus;uniform float blur;varying vec2 uvLens;
 void main(){float z=texture2D(depthMap,uvLens).x;float d=(2.*nearPlane*farPlane)/(farPlane+nearPlane-(2.*z-1.)*(farPlane-nearPlane));float circle=clamp(abs(d-focus)/max(d,1.)*.7,0.,1.);vec2 r=vec2(blur*circle)/resolution;
 vec3 color=texture2D(image,uvLens).rgb*.24;
 color+=texture2D(image,uvLens+vec2(1.,0.)*r).rgb*.075;color+=texture2D(image,uvLens-vec2(1.,0.)*r).rgb*.075;color+=texture2D(image,uvLens+vec2(0.,1.)*r).rgb*.075;color+=texture2D(image,uvLens-vec2(0.,1.)*r).rgb*.075;
 color+=texture2D(image,uvLens+vec2(.707,.707)*r).rgb*.07;color+=texture2D(image,uvLens+vec2(-.707,.707)*r).rgb*.07;color+=texture2D(image,uvLens+vec2(.707,-.707)*r).rgb*.07;color+=texture2D(image,uvLens-vec2(.707,.707)*r).rgb*.07;
 color+=texture2D(image,uvLens+vec2(1.5,.3)*r).rgb*.045;color+=texture2D(image,uvLens-vec2(1.5,.3)*r).rgb*.045;color+=texture2D(image,uvLens+vec2(.3,1.5)*r).rgb*.045;color+=texture2D(image,uvLens-vec2(.3,1.5)*r).rgb*.045;
 float vignette=1.-smoothstep(.28,.84,length((uvLens-.5)*vec2(.8,1.)))*.13;color*=vignette;gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`,depthTest:false,depthWrite:false});lensScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),lens));
 const pos=new THREE.Vector3(),tangent=new THREE.Vector3(),nextTangent=new THREE.Vector3(),offset=new THREE.Vector3(),target=new THREE.Vector3(),camPosition=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),directionPoint=new THREE.Vector3(),wakePoint=new THREE.Vector3(),heroShift=new THREE.Vector3(),endShift=new THREE.Vector3(-1,0,0);
 const matrix=new THREE.Matrix4(),baseQuaternion=new THREE.Quaternion(),bankQuaternion=new THREE.Quaternion(),zAxis=new THREE.Vector3(0,0,1);let last=performance.now(),time=0,first=true;
 function render(ms){
 rafId=requestAnimationFrame(render);if(document.hidden){last=ms;return;}const dt=Math.min((ms-last)/1000,.06);last=ms;if(!reduced)time+=dt;
 const p=clamp(state.progress,0,1),viewP=reduced?frozenProgress:p,flight=smooth(.155,.225,viewP),viewU=clamp((viewP-.19)/.745,0,1);
 path.getPointAt(viewU,pos);path.getTangentAt(viewU,tangent);path.getTangentAt(Math.min(viewU+.02,1),nextTangent);directionPoint.copy(pos).add(tangent);matrix.lookAt(pos,directionPoint,up);baseQuaternion.setFromRotationMatrix(matrix);const turn=Math.atan2(tangent.x*nextTangent.z-tangent.z*nextTangent.x,tangent.dot(nextTangent)),bank=clamp(-turn*3.1,-.5,.5)*flight;
 bee.group.position.copy(pos);bee.group.position.y+=Math.sin(time*2.5)*.045;bankQuaternion.setFromAxisAngle(zAxis,bank);bee.group.quaternion.copy(baseQuaternion).multiply(bankQuaternion);bee.update(time,{reduced,speed:flight});
 const o=smooth(.025,.19,viewP);orbit.getPoint(o,offset);if(innerWidth<=600){offset.multiplyScalar(1.05);offset.y+=.45;}offset.applyQuaternion(baseQuaternion);camPosition.copy(pos).add(offset);heroShift.set((innerWidth<=600?0:1.75)*(1-o),innerWidth<=600?.9*(1-o):0,0).applyQuaternion(baseQuaternion);target.copy(pos).add(heroShift).addScaledVector(tangent,o*1.2);target.y+=o*.2;
 if(viewP>.91){camPosition.addScaledVector(tangent,-smooth(.91,1,viewP)*1.3);camPosition.y+=smooth(.91,1,viewP)*.7;target.addScaledVector(endShift,smooth(.91,1,viewP)*1.6);}
 camera.position.copy(camPosition);camera.up.set(bank*.22,1,0).normalize();camera.lookAt(target);camera.fov=(innerWidth<=600?49:43)+o*4;camera.updateProjectionMatrix();meadow.update(time,{reduced});pollen.position.x=reduced?0:Math.sin(time*.1)*.25;
 wake.visible=!reduced&&p>.2&&p<.95;for(let i=0;i<wakeCount;i++){path.getPointAt(clamp(viewU-i*.00065,0,1),wakePoint);wakePositions[i*3]=wakePoint.x+Math.sin(i*2.32+time)*.09;wakePositions[i*3+1]=wakePoint.y+Math.cos(i*.83+time)*.06;wakePositions[i*3+2]=wakePoint.z;}wakeGeometry.attributes.position.needsUpdate=true;
 lens.uniforms.focus.value=camera.position.distanceTo(bee.group.position);renderer.setRenderTarget(targetRT);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(lensScene,lensCamera);updateInterface(p);if(first){first=false;document.body.classList.add('world-ready');}}
 rafId=requestAnimationFrame(render);let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{renderer.setSize(innerWidth,innerHeight,false);targetRT.setSize(innerWidth*ratio,innerHeight*ratio);lens.uniforms.resolution.value.set(innerWidth*ratio,innerHeight*ratio);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();window.ScrollTrigger?.refresh();},120);});
 $('#world').addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(rafId);document.body.classList.remove('world-ready');document.body.classList.add('world-failed');$('.fallback-message').hidden=false;});
 window.addEventListener('pagehide',()=>cancelAnimationFrame(rafId));window.addEventListener('pageshow',e=>{if(e.persisted){last=performance.now();rafId=requestAnimationFrame(render);window.ScrollTrigger?.refresh();}});
}catch(error){console.error('Unable to initialize meadow flight',error);document.body.classList.add('world-failed');$('.fallback-message').hidden=false;}
