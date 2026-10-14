(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const journey = $('#journey');
  const scenes = [$('.intro-copy'), $('.detail-copy'), $('.flight-copy')];
  const nav = [...document.querySelectorAll('[data-scene]')];
  const motionButton = $('.motion-toggle');
  const mediaReduced = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = mediaReduced.matches;
  let current = 0, progress = 0, lenis, timeline, trigger;
  let w = innerWidth, h = innerHeight;
  const state = { p: 0 };
  const stops = [0, .42, .91];
  const labels = ['PROLOGUE — THE FIRST FLIGHT', 'CHAPTER 01 — A CLOSER LOOK', 'CHAPTER 02 — INTO THE LIVING WORLD'];
  const cueLabels = ['스크롤로 비행을 시작하세요', '계속해서 날갯짓을 따라가세요', '다시, 첫 날갯짓으로'];
  function activateScene(index) {
    if (index === current && nav[index].getAttribute('aria-current')) return;
    current = index;
    scenes.forEach((s, i) => { s.setAttribute('aria-hidden', String(i !== index)); s.inert = i !== index; });
    nav.forEach((b, i) => { b.classList.toggle('active', i === index); if (i === index) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    $('#scene-label').textContent = labels[index];
    $('.scroll-text').textContent = cueLabels[index];
    $('.scroll-circle').textContent = index === 2 ? '↑' : '↓';
  }
  function scrollToScene(index) {
    const top = (journey.offsetHeight - innerHeight) * stops[index];
    if (lenis && !reduced) lenis.scrollTo(top, { duration: 1.8 });
    else window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' });
  }
  nav.forEach(b => b.addEventListener('click', () => scrollToScene(Number(b.dataset.scene))));
  $('.brand').addEventListener('click', e => { e.preventDefault(); scrollToScene(0); });
  $('.scroll-cue').addEventListener('click', () => scrollToScene(current === 2 ? 0 : current + 1));
  $('.replay').addEventListener('click', () => scrollToScene(0));

  const dialog = $('.about-dialog');
  $('.about-trigger').addEventListener('click', () => { lenis?.stop(); document.documentElement.classList.add('dialog-open'); dialog.showModal(); });
  const closeDialog = () => { dialog.close(); lenis?.start(); };
  $('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('close', () => { document.documentElement.classList.remove('dialog-open'); lenis?.start(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) closeDialog(); } });
  $('.dialog-start').addEventListener('click', () => { closeDialog(); scrollToScene(1); });

  function makeTimeline() {
    timeline?.kill(); trigger?.kill();
    const mobile = innerWidth <= 600;
    gsap.set(['.intro-copy','.detail-copy','.flight-copy','.specimen','.detail-label','.flight-whisper'],{clearProps:'transform,opacity,visibility'});
    gsap.set('.bee-flight',{xPercent:-50,yPercent:-50,x:0,y:0,rotation:mobile?-13:-11});
    gsap.set('.bee-depth',{scale:1,rotation:0});
    gsap.set('.landscape',{scale:1.04,x:0,y:0});
    timeline = gsap.timeline({paused:true,defaults:{ease:'none'}});
    if (reduced) {
      // Reduced motion preserves the narrative with short crossfades and a stationary bee.
      timeline.to('.intro-copy',{autoAlpha:0,duration:.05},.25)
        .to('.specimen',{autoAlpha:0,duration:.05},.25)
        .fromTo('.detail-copy',{autoAlpha:0},{autoAlpha:1,duration:.05},.30)
        .to('.detail-copy',{autoAlpha:0,duration:.05},.65)
        .fromTo('.flight-copy',{autoAlpha:0},{autoAlpha:1,duration:.05},.70)
        .to(state,{p:1,duration:1},0);
    } else {
      timeline.to('.intro-copy',{autoAlpha:0,y:-48,duration:.19},.05)
        .to('.specimen',{autoAlpha:0,y:12,duration:.13},.05)
        .to('.bee-flight',{x:mobile?-w*.10:-w*.035,y:mobile?h*.02:h*.06,rotation:mobile?-5:2,duration:.35,ease:'power1.inOut'},.04)
        .to('.bee-depth',{scale:mobile?1.38:1.72,rotation:3,duration:.35,ease:'power1.inOut'},.04)
        .to('.landscape',{scale:1.20,x:-w*.04,y:h*.035,duration:.49},0)
        .fromTo('.detail-copy',{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.12},.26)
        .fromTo('.detail-label',{autoAlpha:0},{autoAlpha:.8,duration:.10},.32)
        .to('.detail-copy',{autoAlpha:0,y:-25,duration:.12},.53)
        .to('.detail-label',{autoAlpha:0,duration:.10},.52)
        .to('.bee-flight',{x:mobile?w*.05:w*.12,y:mobile?-h*.04:-h*.02,rotation:-24,duration:.28,ease:'power1.inOut'},.50)
        .to('.bee-depth',{scale:mobile?.52:.52,rotation:-7,duration:.31,ease:'power2.inOut'},.50)
        .to('.bee-flight',{x:mobile?w*.02:w*.09,y:mobile?-h*.03:-h*.04,rotation:-17,duration:.18,ease:'sine.inOut'},.81)
        .to('.landscape',{scale:1.43,x:-w*.09,y:h*.06,duration:.50},.50)
        .fromTo('.flight-copy',{autoAlpha:0,y:35},{autoAlpha:1,y:0,duration:.16},.72)
        .fromTo('.flight-whisper',{autoAlpha:0},{autoAlpha:.75,duration:.12},.83)
        .to('.sun-glow',{opacity:1.8,duration:.5},.5)
        .to(state,{p:1,duration:1},0);
    }
    trigger = ScrollTrigger.create({trigger:journey,start:'top top',end:'bottom bottom',scrub:reduced?false:.85,animation:timeline,invalidateOnRefresh:true,onUpdate:self=>{
      progress=self.progress;
      $('.progress-bar').style.transform=`scaleX(${progress})`;
      activateScene(progress<.26?0:progress<.70?1:2);
    }});
    timeline.progress(progress);
  }
  function setMotion(value) {
    reduced=value;
    if(window.Lenis){
      lenis?.destroy(); lenis=undefined;
      if(!reduced){lenis=new Lenis({duration:1.25,smoothWheel:true,syncTouch:false,wheelMultiplier:.85});lenis.on('scroll',ScrollTrigger.update);}
    }
    document.body.classList.toggle('motion-reduced',reduced);
    motionButton.setAttribute('aria-pressed',String(reduced));
    motionButton.setAttribute('aria-label',reduced?'전체 움직임 켜기':'움직임 줄이기');
    $('.motion-text').textContent=reduced?'MOTION OFF':'MOTION ON';
    if (window.gsap && window.ScrollTrigger) makeTimeline();
  }
  motionButton.addEventListener('click',()=>setMotion(!reduced));
  mediaReduced.addEventListener('change',e=>setMotion(e.matches));

  const canvas=$('#pollen'), ctx=canvas.getContext('2d');
  const motes=Array.from({length:innerWidth<600?24:43},(_,i)=>({x:((i*0.61803398875)%1),y:((i*0.41421356237)%1),depth:.2+((i*.732)%1)*.8,r:.5+(i%4)*.33}));
  function sizeCanvas(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx?.setTransform(d,0,0,d,0,0);}
  sizeCanvas();
  let last=0, clock=0;
  function drawMotes(ms){
    requestAnimationFrame(drawMotes);
    if(!ctx||document.hidden||ms-last<33)return;
    const dt=Math.min((ms-last)/1000,.1);last=ms;if(!reduced)clock+=dt;
    ctx.clearRect(0,0,w,h);
    const travel = reduced?0:state.p*180;
    motes.forEach((m,i)=>{
      const x=((m.x*w+Math.sin(clock*.16+i)*14-travel*m.depth)%w+w)%w;
      const y=((m.y*h-clock*(3+m.depth*5)+travel*.4*m.depth)%h+h)%h;
      const a=(.12+Math.sin(clock*.5+i)*.06)*m.depth;
      ctx.beginPath();ctx.fillStyle=`rgba(247,229,163,${a})`;ctx.arc(x,y,m.r,0,Math.PI*2);ctx.fill();
    });
  }
  requestAnimationFrame(drawMotes);
  if(window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.add(t=>lenis?.raf(t*1000)); gsap.ticker.lagSmoothing(0);
    setMotion(reduced);
    let resizeTimer;
    window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{sizeCanvas();makeTimeline();ScrollTrigger.refresh();},150);});
    window.addEventListener('load',()=>ScrollTrigger.refresh());
    document.fonts?.ready.then(()=>ScrollTrigger.refresh());
  }else{
    // Local library failure still leaves an accessible, native-scroll introduction.
    document.body.classList.add('motion-reduced');
    journey.style.height='100svh';
    $('.scroll-cue').hidden=true;$('.chapter-nav').hidden=true;motionButton.hidden=true;
  }
})();
