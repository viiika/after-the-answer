'use strict';
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d');
const $=s=>document.querySelector(s),W=900,H=520,STORAGE='answers-afterward.arcade.1';
let state,keys=new Set(),last=0,target=null,mode='practice',gear='fine',paused=false,quiet=matchMedia('(prefers-reduced-motion: reduce)').matches;
let report={key:'start',args:{}},particles=[],audio=null,storageOkay=true,collection=[],bests={practice:0,mission:0,drift:0};
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}');collection=Array.isArray(saved.collection)?[...new Set(saved.collection.filter(n=>Number.isInteger(n)&&n>=0&&n<6))]:[];for(const k of Object.keys(bests)){const n=saved.bests?.[k];if(Number.isInteger(n)&&n>=0&&n<=10000)bests[k]=n;}}catch{storageOkay=false;}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify({collection,bests}));storageOkay=true;}catch{storageOkay=false;}$('#storage-warning').textContent=storageOkay?'':tr('noStore');}
function fresh(){state={phase:'ready',x:450,y:120,v:0,swing:0,sv:0,clock:0,attempts:7,score:0,points:0,streak:0,held:null,result:'',releaseV:0,items:Arcade.toys.map((p,i)=>({...p,base:215+i*108,x:215+i*108,y:412,got:false}))};target=null;keys.clear();particles=[];paused=false;feedback('start');ui();shelf();}
function feedback(key,args={}){report={key,args};$('#feedback').textContent=tr(key,args);}
function ended(){return state.score===6||(mode!=='practice'&&!state.attempts&&state.phase==='ready');}
function ui(){
 $('#score').textContent=`${state.score} / 6`;
 $('#status').textContent=mode==='practice'?tr('unlimited'):tr('tries',{n:state.attempts});
 $('#points').textContent=tr('points',{n:state.points,best:bests[mode]});
 $('#drop').disabled=state.phase!=='ready'||ended()||paused;
 for(const b of document.querySelectorAll('[data-gear]')){b.disabled=state.phase!=='ready'||paused;b.setAttribute('aria-pressed',String(b.dataset.gear===gear));}
 for(const b of document.querySelectorAll('[data-mode]'))b.setAttribute('aria-pressed',String(b.dataset.mode===mode));
 $('#objective').textContent=tr(mode+'Goal');$('#pause').textContent=tr(paused?'resume':'pause');$('#pause').setAttribute('aria-pressed',String(paused));
}
function localize(){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.title=tr('title');for(const e of document.querySelectorAll('[data-word]'))e.textContent=tr(e.dataset.word);$('#language').value=lang;canvas.setAttribute('aria-label',tr('title'));$('#left').setAttribute('aria-label',tr('left'));$('#right').setAttribute('aria-label',tr('right'));$('#steady').setAttribute('aria-label',tr('steady'));feedback(report.key,report.args);$('#storage-warning').textContent=storageOkay?'':tr('noStore');ui();shelf();}
function shelf(){const holder=$('#shelf');holder.replaceChildren();for(const p of Arcade.toys){const collected=collection.includes(p.kind),b=document.createElement('button');b.className='collectible'+(collected?' owned':'');b.dataset.kind=p.kind;b.style.setProperty('--toy',p.color);b.innerHTML='<span class="toy-icon" aria-hidden="true"><i></i></span><strong></strong><small></small><span class="stamp"></span>';b.querySelector('strong').textContent=toyName(p.kind);b.querySelector('small').textContent=tr(p.r>27?'large':'small');b.querySelector('.stamp').textContent=tr(collected?'saved':'unknown');b.setAttribute('aria-label',toyName(p.kind)+' · '+tr(p.r>27?'large':'small')+' · '+tr('target'));b.onclick=()=>{if(state.phase==='ready'&&!paused&&!ended()){const item=state.items[p.kind];if(!item.got){target=item.x;canvas.focus({preventScroll:true});canvas.scrollIntoView({block:'center',behavior:quiet?'instant':'smooth'});}}};holder.append(b);}$('#collection-count').textContent=`${collection.length} / 6`;}
function tone(success){if(!$('#sound').checked)return;try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const notes=success?[523.25,659.25,783.99]:[220,174.61];notes.forEach((freq,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.09;o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.07,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.26);});}catch{/* Muted play remains available. */}}
function clawX(){return state.x+state.swing;}
function drop(){if(state.phase!=='ready'||ended()||paused)return;state.attempts=Math.max(0,state.attempts-1);state.phase='down';state.v=0;target=null;keys.clear();feedback('down');ui();}
function step(dt){
 state.clock+=dt;const g=Arcade.gears[gear];
 if(mode==='drift')for(const p of state.items)if(!p.got&&p!==state.held)p.x=p.base+Math.sin(state.clock*1.35+p.kind*.8)*30;
 if(state.phase==='ready'&&!ended()){
  let d=(keys.has('right')?1:0)-(keys.has('left')?1:0);
  if(target!==null){d=Math.max(-1,Math.min(1,(target-state.x)/35));if(Math.abs(target-state.x)<.6&&Math.abs(state.v)<4){state.x=target;target=null;d=0;}}
  const old=state.v;state.v+=(d*g.speed-state.v)*Math.min(1,dt*12);state.x=Math.max(155,Math.min(800,state.x+state.v*dt));state.sv-=(state.v-old)*.10;
 }
 state.sv+=(-state.swing*20-state.sv*4)*dt;state.swing+=state.sv*dt;
 $('#steady').value=Math.max(0,1-(Math.abs(state.swing)+Math.abs(state.sv)*.15)/20);
 if(state.phase==='down'){
  state.y+=300*dt;
  if(state.y>=375){state.y=375;const nearest=state.items.filter(p=>!p.got).sort((a,b)=>Math.abs(a.x-clawX())-Math.abs(b.x-clawX()))[0];state.result=nearest?Arcade.judge(clawX(),nearest,gear):'offset';state.held=state.result==='caught'?nearest:null;state.phase='up';
   if(state.held){state.streak++;state.reward=Math.round(100+100*(1-Math.abs(nearest.x-clawX())/g.tolerance))+Math.min(3,state.streak-1)*25;feedback('caught',{name:toyName(nearest.kind)});}else{state.streak=0;feedback(state.result);tone(false);}
  }
 }else if(state.phase==='up'){
  state.y-=state.held?330*dt:650*dt;if(state.held){state.held.x=clawX();state.held.y=state.y+37;}
  if(state.y<=120){state.y=120;if(state.held)state.phase='carry';else finish();}
 }else if(state.phase==='carry'){
  state.x=Math.max(118,state.x-420*dt);state.held.x=clawX();state.held.y=state.y+37;
  if(state.x<=118){state.phase='release';state.releaseV=0;}
 }else if(state.phase==='release'){
  state.releaseV+=950*dt;state.held.y+=state.releaseV*dt;
  if(state.held.y>=432){const p=state.held;p.got=true;state.score++;state.points+=state.reward;if(!collection.includes(p.kind))collection.push(p.kind);bests[mode]=Math.max(bests[mode],state.points);save();tone(true);if(!quiet)particles=Array.from({length:18},(_,i)=>({x:118,y:430,vx:Math.cos(i*2.4)*90,vy:-80-i*4,life:1,color:p.color}));state.held=null;shelf();finish();}
 }
 particles=particles.filter(p=>p.life>0);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=200*dt;p.life-=dt;}
}
function finish(){state.phase='ready';state.v=0;if(state.score===6)feedback('all');else if(mode!=='practice'&&!state.attempts)feedback(state.score>=4?'won':'lost',{count:state.score});else if(state.result==='caught')feedback('stored',{points:state.reward});ui();}
function togglePause(){paused=!paused;keys.clear();target=null;ui();}
function round(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}}
function line(x,y,x2,y2,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke()}
function ellipse(x,y,rx,ry,c){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=c;ctx.fill()}
function toy(p){ctx.save();ctx.translate(p.x,p.y);ellipse(0,32,p.r*.9,7,'#0003');if(p.kind===1){ellipse(-20,-23,13,26,p.color);ellipse(20,-23,13,26,p.color)}if(p.kind===5){ctx.save();ctx.rotate(-.3);ellipse(32,8,18,9,p.color);ellipse(43,0,9,15,p.color);ctx.restore()}if(p.kind===0){for(let i=0;i<8;i++){const a=i*Math.PI/4;line(Math.cos(a)*29,Math.sin(a)*29,Math.cos(a)*35,Math.sin(a)*35,p.color,3)}}if(p.kind===3){ctx.save();ctx.rotate(-.35);ellipse(0,0,47,12,'#d7bd8b');ctx.restore()}ellipse(0,0,p.r,p.r,p.color);ellipse(-10,-10,p.r*.5,p.r*.38,'#ffffff16');if(p.kind===2){round(-21,-16,42,33,10,p.color);line(-10,-28,-10,-40,p.color,4);ellipse(-10,-40,5,5,'#e4cd91')}ellipse(-10,-2,2.5,4,'#253c40');ellipse(10,-2,2.5,4,'#253c40');ctx.strokeStyle='#35494a';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,5,6,.1,Math.PI-.1);ctx.stroke();line(-p.r+8,17,p.r-8,17,'#263c3d33',1);ctx.restore()}
function render(){
 ctx.clearRect(0,0,W,H);let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#203a40');g.addColorStop(1,'#7f9990');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 for(let i=0;i<38;i++){const x=(i*167+83)%840+30,y=(i*73)%310+60;ellipse(x,y,i%3===0?2:1,i%3===0?2:1,'#ebdcb333');}
 ctx.save();ctx.strokeStyle='#dfcd9b26';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(480,265,260,100,-.25,0,Math.PI*2);ctx.stroke();ctx.restore();ellipse(740,190,67,67,'#dbc99e18');ellipse(758,174,59,59,'#466164');
 // An original paper-cut landscape behind the machine, not borrowed game art.
 ctx.fillStyle='#69867e';ctx.beginPath();ctx.moveTo(45,437);ctx.bezierCurveTo(200,260,260,385,440,330);ctx.bezierCurveTo(580,280,740,360,855,300);ctx.lineTo(855,470);ctx.lineTo(45,470);ctx.fill();ctx.fillStyle='#54746f';ctx.beginPath();ctx.moveTo(45,465);ctx.bezierCurveTo(280,325,360,450,540,375);ctx.bezierCurveTo(660,340,750,390,855,355);ctx.lineTo(855,475);ctx.lineTo(45,475);ctx.fill();
 round(45,40,810,435,24,null,'#d2c09277');round(65,66,770,22,8,'#172f34','#9e9b77');line(80,76,820,76,'#d9c38a',3);round(65,450,770,25,8,'#314d4c');round(77,423,80,41,8,'#172e34','#b6a674');ctx.font='12px sans-serif';ctx.fillStyle='#d4c594';ctx.textAlign='center';ctx.direction=lang==='ar'?'rtl':'ltr';ctx.fillText(tr('return'),117,449);
 for(const p of state.items)if(!p.got){toy(p);if(p!==state.held){ctx.font='12px sans-serif';ctx.fillStyle='#f0e6c6';ctx.fillText(p.r>27?'Ⅱ':'Ⅰ',p.x,464);if(mode==='drift'){const velocity=Math.cos(state.clock*1.35+p.kind*.8);line(p.x,371,p.x+velocity*20,371,'#f0e6c666',2);}}}
 if(state.phase==='ready'&&!ended()){ctx.setLineDash([5,7]);line(clawX(),156,clawX(),436,'#eee4b377',1);ctx.setLineDash([]);ellipse(clawX(),446,Arcade.gears[gear].tolerance,5,'#efe1a655');}
 line(state.x,88,clawX(),state.y,'#d8c69a',4);round(state.x-22,67,44,27,7,'#c7a774','#f0d9a5');ellipse(clawX(),state.y,13,11,'#d1b783');const open=['down','ready','release'].includes(state.phase)?Arcade.gears[gear].width:Math.max(17,state.held?.r||17);
 line(clawX(),state.y,clawX()-open,state.y+23,'#e9d5a1',7);line(clawX()-open,state.y+23,clawX()-open+5,state.y+48,'#e9d5a1',6);line(clawX(),state.y,clawX()+open,state.y+23,'#e9d5a1',7);line(clawX()+open,state.y+23,clawX()+open-5,state.y+48,'#e9d5a1',6);
 for(const p of particles){ctx.globalAlpha=Math.max(0,p.life);ellipse(p.x,p.y,3,3,p.color);}ctx.globalAlpha=1;
 ctx.fillStyle='#e8dcc515';ctx.beginPath();ctx.moveTo(50,45);ctx.lineTo(170,45);ctx.lineTo(60,470);ctx.lineTo(50,470);ctx.fill();ctx.font='11px sans-serif';ctx.fillStyle='#e2d5af';ctx.fillText('EST. 2018  /  LITTLE ORBIT',450,503);
 if(paused){ctx.fillStyle='#102429c9';ctx.fillRect(45,40,810,435);ctx.font='32px sans-serif';ctx.fillStyle='#f2dfb2';ctx.fillText(tr('paused'),450,260);}
}
function frame(t){const dt=Math.min((t-last)/1000||0,.035);last=t;if(!document.hidden&&!paused)step(dt);render();requestAnimationFrame(frame);}
for(const [id,key] of [['left','left'],['right','right']]){const b=$('#'+id);b.addEventListener('pointerdown',e=>{e.preventDefault();target=null;keys.add(key);b.setPointerCapture(e.pointerId);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(key));}
window.addEventListener('keydown',e=>{if(['SELECT','INPUT'].includes(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;if(['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();target=null;keys.add(e.code==='ArrowLeft'?'left':'right');}if(e.code==='Space'&&e.target===canvas){e.preventDefault();if(!e.repeat)drop();}if(e.code==='KeyP'&&!e.repeat){togglePause();}if(['Digit1','Digit2'].includes(e.code)&&state.phase==='ready'&&!paused){gear=e.code==='Digit1'?'fine':'wide';ui();}});
window.addEventListener('keyup',e=>keys.delete(e.code==='ArrowLeft'?'left':e.code==='ArrowRight'?'right':''));window.addEventListener('blur',()=>{keys.clear();target=null;});document.addEventListener('visibilitychange',()=>{keys.clear();target=null;last=performance.now();if(document.hidden){paused=true;if(audio)audio.suspend().catch(()=>{});ui();}else if(audio&&$('#sound').checked)audio.resume().catch(()=>{});});
canvas.addEventListener('pointerdown',e=>{if(state.phase==='ready'&&!paused&&!ended()){const r=canvas.getBoundingClientRect();target=Math.max(155,Math.min(800,(e.clientX-r.left)*W/r.width));canvas.focus({preventScroll:true});}});
for(const b of document.querySelectorAll('[data-gear]'))b.onclick=()=>{if(state.phase==='ready'&&!paused){gear=b.dataset.gear;ui();}};
for(const b of document.querySelectorAll('[data-mode]'))b.onclick=()=>{if(mode!==b.dataset.mode){mode=b.dataset.mode;fresh();}};
$('#drop').onclick=drop;$('#restart').onclick=fresh;$('#pause').onclick=togglePause;$('#language').onchange=e=>{lang=e.target.value;localize();};$('#motion').checked=quiet;$('#motion').onchange=e=>{quiet=e.target.checked;particles=[];};$('#sound').onchange=()=>{if($('#sound').checked)tone(true);else if(audio)audio.suspend().catch(()=>{});};
// High-density backing store keeps small screens crisp without changing world coordinates.
const ratio=Math.min(2,window.devicePixelRatio||1);canvas.width=W*ratio;canvas.height=H*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);
fresh();localize();requestAnimationFrame(frame);
