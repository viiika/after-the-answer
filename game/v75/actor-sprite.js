'use strict';
// Visual feedback only: the story transaction never waits for image loading or motion.
window.ActorSprite=(()=>{
 function mount({element,fallback,src}){
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),image=new Image();
  let ready=false,timer=null,destroyed=false,index=0;
  const sequence=[0,1,2,3,1,0],holds=[180,240,400,400,180];
  function frame(n){element.dataset.frame=String(n);}
  function stop(){clearTimeout(timer);timer=null;index=0;frame(0);element.dataset.playing='false';}
  function next(){
   if(destroyed||document.hidden||motion.matches){stop();return;}
   frame(sequence[index]);
   if(index===sequence.length-1){stop();return;}
   timer=setTimeout(()=>{index++;next();},holds[index]);
  }
  function play(){stop();if(!ready||destroyed||document.hidden||motion.matches)return; element.dataset.playing='true';next();}
  function visibility(){if(document.hidden)stop();}
  image.onload=()=>{if(destroyed)return;ready=true;element.style.backgroundImage=`url("${src}")`;element.hidden=false;fallback.hidden=true;stop();};
  image.onerror=()=>{ready=false;stop();element.hidden=true;fallback.hidden=false;};
  image.src=src;
  document.addEventListener('visibilitychange',visibility);
  window.addEventListener('pagehide',stop);
  motion.addEventListener('change',stop);
  return {play,stop,get ready(){return ready&&!destroyed;},showFrame(n){stop();if(!ready||destroyed||!Number.isInteger(n)||n<0||n>3)return false;frame(n);return true;},destroy(){destroyed=true;stop();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',stop);motion.removeEventListener('change',stop);element.hidden=true;fallback.hidden=false;}};
 }
 return {mount};
})();
