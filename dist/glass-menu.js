(()=> {
 const sidebar=document.getElementById('workspace-sidebar');
 if(!sidebar)return;
 const pill=document.createElement('div');
 pill.className='nav-glass-pill';
 pill.setAttribute('aria-hidden','true');
 sidebar.appendChild(pill);
 let last=null,scheduled=false;
 function position(){
  scheduled=false;
  const active=sidebar.querySelector('.nav.active');
  if(!active||!active.getClientRects().length){pill.hidden=true;last=null;return}
  pill.hidden=false;
  const a=active.getBoundingClientRect(),b=sidebar.getBoundingClientRect();
  const next={left:a.left-b.left+sidebar.scrollLeft,top:a.top-b.top+sidebar.scrollTop,width:a.width,height:a.height};
  pill.getAnimations().forEach(x=>x.cancel());
  Object.assign(pill.style,{left:next.left+'px',top:next.top+'px',width:next.width+'px',height:next.height+'px'});
  if(last&&matchMedia('(prefers-reduced-motion: no-preference)').matches){
   const dy=last.top-next.top,dx=last.left-next.left;
   if(Math.abs(dy)+Math.abs(dx)>1){
    const stretch=Math.min(1.19,1.07+Math.abs(dy)/500);
    pill.animate([
     {transform:`translate(${dx}px,${dy}px) scale(1,1)`,offset:0},
     {transform:`translate(${dx*.35}px,${dy*.35}px) scale(.96,${stretch})`,offset:.58},
     {transform:'translate(0,0) scale(1.025,.94)',offset:.82},
     {transform:'translate(0,0) scale(1,1)',offset:1}
    ],{duration:510,easing:'cubic-bezier(.2,.75,.25,1)'});
   }
  }
  last=next;
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(position)}}
 new MutationObserver(records=>{if(records.some(r=>r.target!==pill))schedule()}).observe(sidebar,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
 window.addEventListener('resize',schedule);
 sidebar.addEventListener('click',()=>requestAnimationFrame(schedule));
 schedule();
})();
