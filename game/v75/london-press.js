'use strict';
window.LondonPress=(()=>{
 const phrases=['港口情况危急。','请留意通行消息，','安排离港与家人联络。','延迟一天，','仍可能为谈判','留出机会。'];
 function mount({host,get,set,onAccept,say}){
  host.innerHTML=`<h3>先印一张，看纸上真正留下了什么。</h3><p>艾达：“铅版放进去了，不等于每个字都能印出来。我的警报和他的反对意见，两栏都要看。”</p>
  <div class="press-work-grid"><div><div class="press-bed" role="group" aria-label="两栏铅版与试印纸的位置"><div class="press-beam"></div><div class="ink-plates"></div><div class="paper-guide"></div><div class="press-paper" hidden><span>拖动纸张 · 对齐金色边线</span></div><div class="ink-roller" aria-hidden="true"></div><div class="press-wheel" aria-hidden="true"><i></i><i></i></div></div><p class="help">可以直接拖滚筒、推纸；放纸后绕着手轮顺时针转一圈，再逆时针退回。下方控件能完成相同操作。</p>
  <div class="press-tools"><button id="dip-ink">蘸取油墨</button><button data-ink-row="0">滚主栏</button><button data-ink-row="1">滚短栏</button></div>
  <label class="press-control">沿选中的一栏滚墨 <input id="ink-roll" type="range" min="0" max="100" value="0"><output id="ink-status"></output></label>
  <div class="press-tools"><button id="place-paper">放上试印纸</button><button id="lift-paper">取回纸张，继续匀墨</button></div>
  <label class="press-control">对齐纸张边线 <input id="paper-align" type="range" min="-3" max="3" step="1" value="2"><output id="paper-position"></output></label>
  <label class="press-control">旋紧，再退回手轮 <input id="press-pull" type="range" min="0" max="100" value="0"><output id="press-position"></output></label><p class="help">可以拖动滑块，也可用方向键；Home / End 可到两端。没有倒计时，试印不合适就回收纸张再试。</p></div>
  <div><h3>刚取下的校样</h3><div id="printed-proof" class="printed-proof"><p class="proof-empty">尚未试印。两栏都匀墨，放纸对齐，把手轮旋到底再退回，才能取下校样。</p></div><p id="press-feedback" role="status"></p><button id="accept-proof" class="primary" disabled>核对两栏，把这张交给艾达</button></div></div>`;
  const $=s=>host.querySelector(s);
  let feedback='';
  function commit(p,message=''){
   const old=get();let sound=null;
   if(p.attempts>old.attempts||p.paper!==old.paper)sound='paper';
   else if(p.pressure===100&&old.pressure!==100)sound='press';
   else if(p.pressure!==old.pressure)sound='wheel';
   else if(p.roller!==old.roller)sound='roll';
   if(sound)window.dispatchEvent(new CustomEvent('v75:foley',{detail:{kind:sound}}));
   set(p);feedback=message;render();
  }
  function render(){
   const p=get();host.hidden=!p.open;if(!p.open)return;
   $('.ink-plates').replaceChildren();for(let row=0;row<2;row++){const strip=document.createElement('div');strip.className='ink-strip';strip.dataset.row=row;for(let c=0;c<3;c++){const i=row*3+c,cell=document.createElement('span');cell.className='ink-zone'+(p.ink[i]?' coated':'');cell.textContent=phrases[i];strip.append(cell);}$('.ink-plates').append(strip);}
   const covered=p.ink.filter(Boolean).length;$('#ink-status').textContent=`已匀墨 ${covered} / 6 处${p.loaded?'':' · 滚筒尚未蘸墨'}`;
   for(const b of host.querySelectorAll('[data-ink-row]')){b.setAttribute('aria-pressed',String(Number(b.dataset.inkRow)===p.row));b.disabled=p.paper;}
   $('#ink-roll').value=p.roller;$('#ink-roll').disabled=p.paper;$('#dip-ink').disabled=p.paper;
   $('.ink-roller').hidden=p.paper;$('.ink-roller').style.left=(8+p.roller*.76)+'%';$('.ink-roller').style.top=(p.row?62:32)+'%';$('.ink-roller').classList.toggle('loaded',p.loaded);
   $('.press-paper').hidden=!p.paper;$('.press-paper').style.transform=`translateX(${p.offset*5}%)`;
   $('.press-beam').style.transform=`translateY(${p.pressure*.65}px)`;
   $('.press-wheel').style.transform=`rotate(${p.pressure*3.6}deg)`;$('.press-wheel').classList.toggle('available',p.paper);
   $('#place-paper').disabled=p.paper;$('#lift-paper').disabled=!p.paper||p.pressure>0;
   $('#paper-align').value=p.offset;$('#paper-align').disabled=!p.paper||p.pressure>0;
   $('#paper-position').textContent=p.offset===0?'对齐边线':`偏${p.offset<0?'左':'右'} ${Math.abs(p.offset)} 格`;
   $('#press-pull').value=p.pressure;$('#press-pull').disabled=!p.paper;
   $('#press-position').textContent=p.pressure===100?'已压紧，退回手轮取纸':p.paper?'手轮位置 '+p.pressure+'%':'先放纸';
   $('#accept-proof').disabled=!p.proof;$('#press-feedback').textContent=feedback;
   const proof=$('#printed-proof');proof.replaceChildren();
   if(!p.proof){const e=document.createElement('p');e.className='proof-empty';e.textContent='尚未试印。两栏都匀墨，放纸对齐，把手轮旋到底再退回，才能取下校样。';proof.append(e);}
   else{const sheet=document.createElement('div');sheet.className='proof-impression';sheet.style.transform=`translateX(${p.proof.offset*28}px)`;const title=document.createElement('h4');title.textContent='THE HARBOUR SHEET · 第三版';sheet.append(title);for(let row=0;row<2;row++){const line=document.createElement('p');line.className='printed-line';for(let c=0;c<3;c++){const span=document.createElement('span'),i=row*3+c;span.textContent=p.proof.ink[i]?phrases[i]:'　';span.className=p.proof.ink[i]?'readable':'unprinted';if(!p.proof.ink[i]){span.setAttribute('role','img');span.setAttribute('aria-label','此处未印出文字');}line.append(span,document.createTextNode(' '));}sheet.append(line);}proof.append(sheet);const caption=document.createElement('p');caption.className='proof-caption';caption.textContent=`第 ${p.attempts} 张试印 · ${p.proof.offset?'纸张偏位，右侧或左侧文字可能落出纸边':'纸张对齐'} · ${p.proof.ink.every(Boolean)?'两栏均有印迹':'仍有未印出的字'}`;proof.append(caption);}
   window.LondonText?.apply();
  }
  $('#dip-ink').onclick=()=>commit({...get(),loaded:true},'滚筒上有墨了。沿主栏和短栏分别滚过，不只照顾较大的那一栏。');
  for(const b of host.querySelectorAll('[data-ink-row]'))b.onclick=()=>commit({...get(),row:Number(b.dataset.inkRow),roller:0});
  $('#ink-roll').oninput=e=>{const p=get();commit(London.roll(p,Number(e.target.value)),p.loaded?'看铅版的深色印迹：漏下的地方，纸上就不会有字。':'滚筒还是干的。先蘸墨，再滚过铅版。');};
  $('#place-paper').onclick=()=>commit({...get(),paper:true,pressure:0,pressed:false},'纸张放好了。让纸边与金色边线重合，再旋紧手轮。');
  $('#lift-paper').onclick=()=>commit({...get(),paper:false,pressed:false},'还没压印，可以把这张纸收回。铅版上的墨还在。');
  $('#paper-align').oninput=e=>commit({...get(),offset:Number(e.target.value)});
  $('#press-pull').oninput=e=>{const old=get(),p=London.pull(old,Number(e.target.value));commit(p,p.attempts>old.attempts?'校样取下来了。把纸举到灯下，看看边线与两栏。':p.pressure===100?'压紧了。把手轮退回起点，取下这张。':'还在压印过程中。旋到尽头，再退回起点。');};
  // Pointer gestures and keyboard ranges call the same state transitions.
  function drag(element,begin,move){let active=null;element.addEventListener('pointerdown',e=>{if(e.button!==0)return;active=begin(e);if(!active)return;element.setPointerCapture(e.pointerId);e.preventDefault();});element.addEventListener('pointermove',e=>{if(active&&element.hasPointerCapture(e.pointerId)){move(e,active);e.preventDefault();}});for(const name of ['pointerup','pointercancel','lostpointercapture'])element.addEventListener(name,()=>{active=null;});}
  drag($('.ink-roller'),e=>get().paper?null:{box:$('.press-bed').getBoundingClientRect()},(e,d)=>{const pos=(e.clientX-d.box.left-d.box.width*.08)/(d.box.width*.76)*100;commit(London.roll(get(),pos),get().loaded?'两栏都要匀墨；看看还没有变深的地方。':'滚筒还是干的，先蘸墨。');});
  drag($('.press-paper'),e=>get().pressure?null:{x:e.clientX,offset:get().offset,width:$('.press-paper').getBoundingClientRect().width},(e,d)=>{commit({...get(),offset:Math.max(-3,Math.min(3,Math.round(d.offset+(e.clientX-d.x)/(d.width*.05))))});});
  drag($('.press-wheel'),e=>{if(!get().paper)return null;const box=$('.press-wheel').getBoundingClientRect(),x=box.x+box.width/2,y=box.y+box.height/2;return {x,y,angle:Math.atan2(e.clientY-y,e.clientX-x),value:get().pressure};},(e,d)=>{if(!get().paper)return;const angle=Math.atan2(e.clientY-d.y,e.clientX-d.x);let delta=angle-d.angle;while(delta>Math.PI)delta-=Math.PI*2;while(delta<-Math.PI)delta+=Math.PI*2;d.angle=angle;d.value=Math.max(0,Math.min(100,d.value+delta/(Math.PI*2)*100));const old=get(),p=London.pull(old,d.value);commit(p,p.attempts>old.attempts?'校样取下来了。检查纸边与两栏的字。':p.pressure===100?'已经压紧，逆时针退回取纸。':'顺时针压紧，再逆时针退回。');});
  $('#accept-proof').onclick=()=>{const p=get();if(!London.proofReady(p)){feedback=p.proof?.offset?'艾达把纸举向灯：“有字落出纸边了。边线对齐，再印一张。”':p.proof?.ink.slice(3).some(x=>!x)?'艾达：“他的短栏还有字没出来。再看一眼铅版。”':'艾达：“警报有几处看不清。那里也得匀墨，读者才知道发生了什么。”';say('艾达',feedback);render();return;}onAccept();};
  return {render,clearFeedback(){feedback='';}};
 }
 return {mount};
})();
