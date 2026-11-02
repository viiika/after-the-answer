'use strict';
const M=window.Opening,$=s=>document.querySelector(s),T=window.TEXT;
let state=M.fresh(),locale='zh-Hans',selected=null,speech='introV',saveStatus='saved',pickedPage=null,pages=['result','setup','failed'],focusReturn=null,saveBlocked=false,unreadableRaw=null;
const messages={share:'shareText',store:'storeText',task:'taskText',application:'applicationText',route:'routeText',dispatch:'dispatchText',verify:'verifyText',permission:'permissionText',collect:'collectText',order:'orderText',tape:'tapeText',pack:'packText',meet:'meetText',jaipur:'jaipurText',jbaseline:'jbaselineText',jwood:'jwoodText',jrepair:'jrepairText',jshade:'jshadeText',jread:'jreadText',jrepeat:'jrepeatText',jcopy:'jcopyText',jreport:'jreportText'};
try{const raw=localStorage.getItem(M.KEY);if(raw!==null){unreadableRaw=raw;state=M.restore(raw);unreadableRaw=null;}const pref=localStorage.getItem(M.KEY+'.language');if(T[pref])locale=pref;}catch(e){saveStatus=e.message==='invalid'||e instanceof SyntaxError?'badSave':'nosave';saveBlocked=saveStatus==='badSave';}
const requestedLanguage=new URLSearchParams(location.search).get('lang');if(Object.prototype.hasOwnProperty.call(T,requestedLanguage))locale=requestedLanguage;
speech=state.events.length?messages[state.events.at(-1)]:(state.actor==='vika'?'introV':'introN');
const txt=k=>T[locale][k]||k,h=e=>M.has(state,e);
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function button(key,fn,cls){const b=el('button',cls,txt(key));b.type='button';b.dataset.key=key;b.addEventListener('click',fn);return b;}
function save(){if(saveBlocked){saveStatus='badSave';return;}try{localStorage.setItem(M.KEY,JSON.stringify(state));localStorage.setItem(M.KEY+'.language',locale);saveStatus='saved';}catch{saveStatus='nosave';}}
function say(k){speech=k;$('#speech').textContent=txt(k);}
function commit(a){const previousKey=document.activeElement?.dataset.key;const n=M.apply(state,a);if(n===state){say('already');return;}state=n;selected=null;save();say(messages[a]);render();if(a==='jaipur'&&!new URLSearchParams(location.search).has('classic')){location.href='jaipur.html?from=opening&lang='+encodeURIComponent(locale);return;}const target=(previousKey&&document.querySelector('[data-key="'+previousKey+'"]'))||$('#actions button')||$('#inventory button')||$('#scene-title');target.focus();}
function scene(){if(h('jaipur'))return 'jaipur';return state.actor==='noyi'?'hospital':h('task')?'office':'room';}
function switchActor(actor){state={...state,actor};selected=null;const last=state.events.filter(e=>actor==='noyi'?['permission','collect','order','tape','pack'].includes(e):['share','store','task','application','route','dispatch','verify'].includes(e)).at(-1);speech=h('jreport')?'jreportText':h('jaipur')?'jaipurText':h('meet')?'meetText':last?messages[last]:actor==='vika'?'introV':'introN';save();render();}
function use(item,action){if(selected===item)commit(action);else say(selected?'notHere':'needItem');}
function modal(title,content){focusReturn=document.activeElement;$('#modal-title').textContent=txt(title);$('#modal-body').replaceChildren(content);$('#modal').showModal();}
function close(){if($('#modal').open)$('#modal').close();if(focusReturn?.isConnected)focusReturn.focus();}
$('#close').onclick=close;
$('#modal').addEventListener('cancel',e=>{e.preventDefault();close();});
function showFiles(){if(!h('application')){say('readFirst');return;}const b=el('div','choices');b.append(button('travel',()=>{$('#file-feedback').textContent=txt('wrongRoute');}),button('care',()=>{close();commit('route');}),el('p','notice'));b.lastChild.id='file-feedback';b.lastChild.setAttribute('role','status');modal('files',b);}
function showPages(){if(!h('collect')){say(h('permission')?'collectText':'introN');return;}if(h('order')){say('orderText');return;}
 const body=el('div'),help=el('p','',txt('orderHelp')),rack=el('div','pages'),feedback=el('p','notice');feedback.setAttribute('role','status');
 function draw(){rack.replaceChildren();pages.forEach((key,i)=>{const b=button(key,()=>{if(pickedPage===null)pickedPage=i;else{[pages[pickedPage],pages[i]]=[pages[i],pages[pickedPage]];pickedPage=null;}draw();rack.children[i]?.focus();},'page');b.dataset.page=key;b.setAttribute('aria-pressed',pickedPage===i);rack.append(b);});}
 draw();body.append(help,rack,feedback,button('checkOrder',()=>{if(pages.join(',')==='setup,failed,result'){close();commit('order');}else feedback.textContent=txt('wrongOrder');}));modal('desk',body);
}

function showMeasure(){
 const body=el('div'),nf=new Intl.NumberFormat(locale,{minimumFractionDigits:1,maximumFractionDigits:1});
 const corrected=h('jrepair'),second=h('jread');let expected=second?12:8,reading=corrected?expected:8.7;
 const plot=el('div','measuring-frame');plot.setAttribute('aria-hidden','true');
 const beam=el('div','beam');beam.style.transform=corrected?'rotate(0deg)':'rotate(-5deg)';
 const marks=el('div','marks');for(let i=0;i<15;i++)marks.append(el('i'));
 const needle=el('div','needle');needle.style.left=(reading/15*100)+'%';plot.append(beam,marks,needle);body.append(plot);
 body.append(el('p','',txt('expected')+': '+nf.format(expected)+' · '+txt('observed')+': '+nf.format(reading)));
 if(!h('jbaseline'))body.append(button('jread',()=>{close();commit('jbaseline');}));
 else if(!corrected||!h('jshade'))body.append(el('p','',txt('needConditions')));
 else if(!h('jread'))body.append(button('jread',()=>{close();commit('jread');}));
 else if(!h('jrepeat'))body.append(button('jrepeat',()=>{close();commit('jrepeat');}));
 else body.append(el('p','',txt('jrepeatText')));
 body.append(el('p','notice',txt('measureNote')));modal('measureTitle',body);
}

function showJournal(){const body=el('div');if(!state.events.length)body.append(el('p','',txt('journalEmpty')));for(const e of state.events)body.append(el('p','journal-entry',txt(messages[e])));modal('journal',body);}
function spot(key,x,y,fn,done=false){const b=button(key,fn,'spot'+(done?' done':''));b.style.left=x+'%';b.style.top=y+'%';b.dataset.spot=key;$('#spots').append(b);}
function render(){
 $('#backup-raw').hidden=!saveBlocked;
 document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=txt('title')+' · V7.5';
 document.querySelectorAll('[data-i18n]').forEach(n=>n.textContent=txt(n.dataset.i18n));$('#actors').setAttribute('aria-label',txt('switch'));$('#language').value=locale;
 const sc=scene(),isDone=h('jreport');document.body.classList.toggle('end',isDone);
 $('#scene-title').textContent=txt(isDone?'jaipurTitle':h('meet')&&!h('jaipur')?'endTitle':sc+'Title');$('#place').textContent=txt(sc+'Place');
 $('#goal').textContent=txt(isDone?'jreportText':h('jaipur')?'goalJaipur':h('meet')?'doneText':M.ready(state)?'goalMeet':M.next(state)==='switch'?'goalWait':sc==='room'?'goalShare':sc==='office'?'goalTask':'goalNoyi');
 $('#background').src='../prototype/assets/'+({room:'art-v3/morning-room.webp',office:'art-v2/archive.webp',hospital:'art-v4/classroom.webp',jaipur:'art-v3/river-lab.webp'})[sc];
 $('#speaker').textContent=txt(state.actor);$('#speech').textContent=txt(speech);$('#save').textContent=txt(saveStatus);
 document.querySelectorAll('[data-actor]').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.actor===state.actor);b.querySelector('.complete').textContent=h(b.dataset.actor==='vika'?'verify':'pack')?'✓':'';});
 $('#spots').replaceChildren();$('#inventory').replaceChildren();$('#actions').replaceChildren();
 function item(k){const b=button(k,()=>{selected=selected===k?null:k;render();$('#inventory').querySelector('[data-key="'+k+'"]')?.focus();});b.setAttribute('aria-pressed',selected===k);b.dataset.item=k;$('#inventory').append(b);}
 if(isDone){const link=el('a','continue-link',txt('fullStory'));link.href='full.html?from=opening&lang='+locale;$('#actions').append(link);}
 if(!isDone){
 if(sc==='jaipur'){
 const play=el('a','continue-link',({'zh-Hans':'亲手复测 · 进入太阳不会等人',en:'Measure again · Play Jaipur',ar:'قِس مجددًا · العب جايبور',hi:'फिर मापें · जयपुर खेलें',ja:'測り直す · ジャイプルへ'})[locale]);play.href='jaipur.html?from=opening&lang='+encodeURIComponent(locale);$('#actions').append(play);
 if(state.actor==='vika'){spot('measure',46,56,showMeasure,h('jrepeat'));if(h('jcopy'))$('#actions').append(button('jreport',()=>commit('jreport')));}
 else{spot('frame',43,56,()=>h('jwood')?say('jwoodText'):commit('jwood'),h('jwood'));spot('shadow',73,67,()=>h('jshade')?say('jshadeText'):commit('jshade'),h('jshade'));if(h('jwood')&&h('jbaseline')&&!h('jrepair'))$('#actions').append(button('jrepair',()=>commit('jrepair')));if(h('jrepeat')&&!h('jcopy'))$('#actions').append(button('askCopy',()=>commit('jcopy')));}
 }else if(h('meet')){}else if(sc==='room'){
 spot('table',47,51,()=>h('share')?say('shareText'):use('cake','share'),h('share'));
 spot('drawer',75,70,()=>h('store')?say('storeText'):h('share')?use('watch','store'):say('introV'),h('store'));
 spot('clock',18,28,()=>say('clockText'));
 if(!h('share'))item('cake');else if(!h('store'))item('watch');
 if(h('store'))$('#actions').append(button('door',()=>commit('task')));
 }else if(sc==='office'){
 spot('application',47,58,()=>h('application')?say('applicationText'):commit('application'),h('application'));
 spot('files',81,38,()=>h('route')?say('routeText'):showFiles(),h('route'));
 if(h('route')&&!h('dispatch'))$('#actions').append(button('dispatch',()=>commit('dispatch')));
 if(h('dispatch')&&!h('verify'))$('#actions').append(button('verify',()=>commit('verify')));
 }else{
 spot('permission',24,30,()=>h('permission')?say('permissionText'):commit('permission'),h('permission'));
 spot('shelf',23,67,()=>h('collect')?say('collectText'):h('permission')?commit('collect'):say('introN'),h('collect'));
 spot('desk',51,51,showPages,h('order'));
 spot('box',79,73,()=>h('pack')?say('packText'):h('tape')?use('tape','pack'):say(h('order')?'orderText':'collectText'),h('pack'));
 spot('photo',84,27,()=>say('photoText'));
 if(h('order')&&!h('tape'))$('#actions').append(button('getTape',()=>commit('tape')));
 if(h('tape')&&!h('pack'))item('tape');
 }
 if(h('meet')&&!h('jaipur'))$('#actions').append(button('jaipur',()=>commit('jaipur')));else if(!h('meet')&&M.ready(state))$('#actions').append(button('meet',()=>commit('meet')));
 else if(M.next(state)==='switch')$('#actions').append(button('switch',()=>switchActor(state.actor==='vika'?'noyi':'vika')));
 }
 if(!$('#inventory').children.length)$('#inventory').append(el('p','',txt('empty')));
}
$('#language').onchange=e=>{locale=e.target.value;save();close();render();};
document.querySelectorAll('[data-actor]').forEach(b=>b.onclick=()=>switchActor(b.dataset.actor));
$('#journal').onclick=showJournal;
$('#hint').onclick=()=>{const a=M.next(state);if(a==='done'){say('jreportText');return;}if(a==='switch'){say('goalWait');return;}if(a==='meet'){say('goalMeet');return;}
 const key={share:selected==='cake'?'table':'cake',store:selected==='watch'?'drawer':'watch',task:'door',application:'application',route:'files',dispatch:'dispatch',verify:'verify',permission:'permission',collect:'shelf',order:'desk',tape:'getTape',pack:selected==='tape'?'box':'tape',jaipur:'jaipur',jbaseline:'measure',jwood:'frame',jshade:'shadow',jrepair:'jrepair',jread:'measure',jrepeat:'measure',jcopy:'askCopy',jreport:'jreport'}[a];say(a==='share'||a==='store'||a==='pack'?'selectHelp':'nextHint');document.querySelectorAll('.hinted').forEach(n=>n.classList.remove('hinted'));const n=document.querySelector('[data-key="'+key+'"]');if(n){n.classList.add('hinted');n.focus();}};
$('#backup-raw').onclick=()=>{if(!saveBlocked||typeof unreadableRaw!=='string')return;const url=URL.createObjectURL(new Blob([unreadableRaw],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='answers-afterward-opening-unreadable.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('#restart').onclick=()=>{const body=el('div','choices');body.append(button('yes',()=>{close();saveBlocked=false;unreadableRaw=null;state=M.fresh();selected=null;pages=['result','setup','failed'];pickedPage=null;speech='introV';save();render();}),button('cancel',close));modal('confirm',body);};
render();
