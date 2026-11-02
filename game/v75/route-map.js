/* A hand-drawn map is a person's record of care, not proof of why the city emptied. */
(function(root){'use strict';
const langs=['zh-Hans','en','ar','hi','ja'];let draft=null;
const words={
 traceHelp:['按住当前路口，沿街道描线；沿原路退回可擦掉一段。也可逐个点击路口。拍照后，把右下翘角拖回纸面。','Hold the current junction and trace along the streets; retrace a section to erase it. You can also click junctions. After the photo, drag the lower-right curl onto the paper.','اضغط التقاطع الحالي وتتبّع الشوارع؛ عُد على الخط لمحو جزء منه. يمكنك أيضًا نقر التقاطعات. بعد التصوير، اسحب الركن السفلي الأيمن إلى الورقة.','मौजूदा मोड़ दबाकर सड़क पर रेखा खींचें; वापस उसी रास्ते पर जाएँ तो हिस्सा मिटेगा। मोड़ों पर क्लिक भी कर सकते हैं। तस्वीर के बाद नीचे-दायाँ कोना कागज़ पर खींचें।','現在の角を押さえ、道に沿ってなぞる。戻れば一つ前まで消せる。角のクリックも使える。撮影後、右下の丸まった端を紙の上へ引こう。'],
 offroad:['笔尖离开了图上的街道。已描的路线还在，从最后一个路口接着画。','The pencil left the mapped street. Your trace remains; continue from its last junction.','خرج القلم عن الشارع المرسوم. بقي المسار؛ تابع من آخر تقاطع.','पेंसिल नक्शे की सड़क से हट गई। बनी रेखा बची है; आख़िरी मोड़ से जारी रखें।','鉛筆が地図の道から外れた。描いた線は残っている。最後の角から続けよう。'],
 curl:['把纸角拖回纸面；按 Enter 也可压平','Drag the curl onto the paper; Enter also smooths it','اسحب الركن إلى الورقة؛ ويمكن تسويته بـEnter','कोना कागज़ पर खींचें; Enter से भी सीधा होगा','端を紙の上へ引く。Enterでも押さえられる'],
 legend:['实线：平路 / 斜纹：台阶 / 双线：缓坡。数字对应下方地名。','Solid: level street / hatching: steps / double: ramp. Numbers match the place names below.','خط متصل: طريق مستوٍ / تهشير: درجات / مزدوج: منحدر. الأرقام لأسماء الأماكن أدناه.','ठोस: समतल गली / धारियाँ: सीढ़ियाँ / दोहरी: ढलान। नीचे अंकों के स्थान-नाम हैं।','実線：平らな道／斜線：階段／二重線：スロープ。番号は下の地名と対応する。'],
 undo:['退回一个路口','Back one junction','ارجع تقاطعًا واحدًا','एक मोड़ पीछे','一つ前の角へ'],
 reset:['从理发店重描','Trace again from the shop','ابدأ مجددًا من الحلاق','दुकान से फिर बनाएँ','理髪店から描き直す'],
 photo:['拍下完整路线','Photograph the route','صوّر المسار','रास्ते की तस्वीर लें','道を撮影する'],
 preserve:['把翘起的边角压回原处','Smooth the curled corner back','أعد الطرف الملتف إلى مكانه','मुड़ा कोना वापस दबाएँ','丸まった端を元に戻す'],
 start:['你把手指放在理发店的位置。先选相连的下一个路口。','Your finger rests on the barber shop. Choose a connected junction.','تضع إصبعك على الحلاق. اختر التقاطع المتصل التالي.','आपकी उँगली दुकान पर है। अगला जुड़ा मोड़ चुनें।','理髪店に指を置いた。つながっている次の角を選ぼう。'],
 jump:['这两个地方没有直接相连。顺着图上的街道描过去。','These places are not directly connected. Follow the streets on the map.','لا اتصال مباشر بين المكانين. اتبع شوارع الخريطة.','ये स्थान सीधे नहीं जुड़े हैं। नक्शे की गलियों पर चलें।','この二か所は直接つながっていない。地図の道をたどろう。'],
 stairs:['这里画了台阶。短路对有些人不是一条路，试试沿海边绕行。','Steps are marked here. A shortcut is not a route for everyone. Try the way by the sea.','هنا درجات. ليس الاختصار طريقًا للجميع. جرّب طريق البحر.','यहाँ सीढ़ियाँ हैं। छोटा रास्ता सबके लिए रास्ता नहीं होता। समुद्र की ओर से देखें।','ここには階段がある。近道が誰にとっても通れる道とは限らない。海沿いを試そう。'],
 loop:['你已经描过这个路口。可以退回一步，再换一个方向。','You have traced this junction already. Go back a step to change direction.','مررت بهذا التقاطع. ارجع خطوة لتغيير الاتجاه.','यह मोड़ पहले चुना है। दिशा बदलने के लिए एक कदम लौटें।','この角はすでに通った。一歩戻って方向を変えよう。'],
 arrived:['绕远了一些，但整条路没有台阶。店主连侧门都标了出来。','It is farther, but there are no steps. The barber even marked the side door.','أطول، لكنه بلا درجات. حتى الباب الجانبي حدّده الحلاق.','रास्ता लंबा है, पर सीढ़ियाँ नहीं। नाई ने पार्श्व द्वार भी बनाया था।','遠回りだが、階段はない。理髪師は脇口まで描いていた。'],
 copied:['照片已经留下。原件仍贴着，边角被风吹得轻轻翘起。','The photo is saved. The original stays attached, its corner curling in the breeze.','حُفظت الصورة. الأصل معلّق وطرفه يلتف مع النسيم.','तस्वीर बच गई। असली नक्शा चिपका है, कोना हवा में मुड़ रहा है।','写真を残した。原図は貼られたまま、端だけが風で丸まっている。'],
 kept:['你把边角压平。留下的是一个人的字迹，不是一件通关战利品。','You smooth the corner. What remains is someone’s handwriting, not a prize to take away.','تسوّي الطرف. ما يبقى خطّ إنسان، لا غنيمة تُحمل بعيدًا.','आप कोना दबाते हैं। यहाँ किसी की लिखावट बची है—ले जाने का इनाम नहीं।','端を押さえた。残るのは誰かの筆跡で、持ち帰る賞品ではない。'],
 hint:['看看地图上的旧铅笔印','Look at the old pencil marks','انظر إلى آثار القلم القديمة','पुराने पेंसिल के निशान देखें','古い鉛筆の跡を見る'],
 hintText:['图上的长线沿着花园、海堤和缓坡通往侧门。它没有替顾客抬轮椅，只让他少求人一次。','The long line follows the garden, seawall and ramp to the side door. It did not lift a wheelchair; it spared someone having to ask.','الخط الطويل يمر بالحديقة والسور والمنحدر إلى الباب الجانبي. لم يرفع كرسيًا؛ أعفى شخصًا من طلب المساعدة.','लंबी रेखा बगीचे, तटबंध और ढलान से पार्श्व द्वार जाती है। उसने व्हीलचेयर नहीं उठाई; किसी को मदद माँगने से बचाया।','長い線は庭園、防潮堤、スロープを通って脇口へ。車椅子を持ち上げたのではなく、助けを頼まずに済む道だった。'],
 sketch:['店主手绘的三条街 · 路口位置为游戏示意','Three streets drawn by the barber · junction positions are a game schematic','ثلاثة شوارع رسمها الحلاق · مواضع التقاطعات تخطيط للعبة','नाई की तीन गलियाँ · मोड़ों की जगह खेल का संकेत-चित्र है','理髪師が描いた三本の通り · 交差点の位置はゲーム用の模式図'],
 route:['你描下的路线','Your traced route','المسار الذي رسمته','आपका बनाया रास्ता','たどった道']};
function mount({rows,answer,p,locale,onChange=()=>{}}){
 const ix=Math.max(0,langs.indexOf(locale)),t=k=>words[k][ix],label=id=>p.nodes.find(n=>n.id===id).label[locale],el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 Object.assign(answer,draft?{...draft,path:[...draft.path]}:{path:[p.start],photographed:false,preserved:false});
 const shell=el('section',undefined,'route-lab'),map=el('div',undefined,'route-map'),svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 600 400');svg.setAttribute('aria-hidden','true');svg.setAttribute('preserveAspectRatio','none');svg.classList.add('route-lines');
 map.dir='ltr';const legend=el('p',t('legend'),'route-legend'),status=el('p',t('start'),'notice');status.id='route-status';status.setAttribute('role','status');const trail=el('p','','route-trail');trail.id='route-trail';
 const nodes=new Map(p.nodes.map(n=>[n.id,n])),buttons=new Map();
 for(const n of p.nodes){const b=el('button',String(p.nodes.indexOf(n)+1),'route-point');b.type='button';b.dataset.place=n.id;b.style.left=n.x+'%';b.style.top=n.y+'%';b.setAttribute('aria-label',(p.nodes.indexOf(n)+1)+'. '+label(n.id));b.title=label(n.id);b.onclick=()=>visit(n.id);buttons.set(n.id,b);}
 const photo=el('button',t('photo')),preserve=el('button',t('preserve')),undo=el('button',t('undo')),reset=el('button',t('reset')),hint=el('button',t('hint'));photo.id='route-photo';preserve.id='route-preserve';undo.id='route-undo';reset.id='route-reset';hint.id='route-hint';for(const b of [photo,preserve,undo,reset,hint])b.type='button';
 const index=el('ol',undefined,'route-index');for(const n of p.nodes)index.append(el('li',label(n.id)));
 const curl=el('button','','route-curl');curl.id='route-curl';curl.type='button';curl.setAttribute('aria-label',t('curl'));curl.title=t('curl');const actions=el('div',undefined,'route-actions');actions.append(undo,reset,photo,preserve,hint);map.append(svg,...buttons.values(),curl);shell.append(el('p',t('sketch'),'route-caption'),el('p',t('traceHelp'),'route-legend'),map,legend,index,trail,status,actions);rows.append(shell);
 function line(a,b,cls){const edge=document.createElementNS(svg.namespaceURI,'line');edge.setAttribute('x1',a.x*6);edge.setAttribute('y1',a.y*4);edge.setAttribute('x2',b.x*6);edge.setAttribute('y2',b.y*4);edge.setAttribute('class',cls);svg.append(edge);}
 let soundPath=null,soundPreserved=false;const foley=kind=>window.dispatchEvent(new CustomEvent('v75:foley',{detail:{kind}}));
 function draw(){const now=answer.path.join(',');if(soundPath!==null){if(now!==soundPath)foley('write');else if(answer.preserved&&!soundPreserved)foley('paper');}soundPath=now;soundPreserved=answer.preserved;svg.replaceChildren();for(const [a,b,type]of p.edges){line(nodes.get(a),nodes.get(b),'street '+type);if(type==='ramp')line(nodes.get(a),nodes.get(b),'ramp-middle');if(type==='stairs'){const A=nodes.get(a),B=nodes.get(b);for(let i=1;i<6;i++){const x=(A.x+(B.x-A.x)*i/6)*6,y=(A.y+(B.y-A.y)*i/6)*4;const mark=document.createElementNS(svg.namespaceURI,'path');mark.setAttribute('d',`M${x-4} ${y-12}l8 24`);mark.setAttribute('class','stair-mark');svg.append(mark);}}}
  for(let i=1;i<answer.path.length;i++)line(nodes.get(answer.path[i-1]),nodes.get(answer.path[i]),'pencil-trace');
  for(const [id,b]of buttons){b.classList.toggle('traced',answer.path.includes(id));b.setAttribute('aria-pressed',String(answer.path.at(-1)===id));b.disabled=answer.photographed;}
  curl.disabled=!answer.photographed||answer.preserved;curl.hidden=answer.preserved;photo.disabled=answer.path.at(-1)!==p.end||answer.photographed;preserve.disabled=!answer.photographed||answer.preserved;undo.disabled=answer.path.length<2||answer.photographed;reset.disabled=answer.photographed;map.classList.toggle('photographed',answer.photographed);map.classList.toggle('preserved',answer.preserved);trail.textContent=t('route')+': '+answer.path.map(label).join(' → ');draft={...answer,path:[...answer.path]};onChange();
 }
 function visit(id){if(answer.photographed)return;const last=answer.path.at(-1),edge=p.edges.find(([a,b])=>(a===last&&b===id)||(b===last&&a===id));if(!edge){status.textContent=t('jump');return;}if(edge[2]==='stairs'){status.textContent=t('stairs');return;}if(answer.path.includes(id)){status.textContent=t('loop');return;}answer.path.push(id);status.textContent=id===p.end?t('arrived'):label(id);draw();}
 undo.onclick=()=>{if(answer.path.length>1&&!answer.photographed){answer.path.pop();status.textContent=label(answer.path.at(-1));draw();}};reset.onclick=()=>{if(!answer.photographed){answer.path=[p.start];status.textContent=t('start');draw();}};
 photo.onclick=()=>{if(answer.path.at(-1)===p.end){answer.photographed=true;status.textContent=t('copied');draw();}};
 const keep=()=>{if(answer.photographed&&!locked()){answer.preserved=true;status.textContent=t('kept');draw();}};preserve.onclick=keep;curl.onclick=e=>{if(e.detail===0)keep();};
 const locked=()=>rows.closest('.puzzle')?.querySelector('[data-action=check]')?.disabled===true;
 const xy=e=>{const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());return{x:q.x,y:q.y};},pos=id=>({x:nodes.get(id).x*6,y:nodes.get(id).y*4}),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 function edgeDistance(q,a,b){const dx=b.x-a.x,dy=b.y-a.y,v=Math.max(0,Math.min(1,((q.x-a.x)*dx+(q.y-a.y)*dy)/(dx*dx+dy*dy)));return dist(q,{x:a.x+v*dx,y:a.y+v*dy});}
 let gesture=null,swallowUntil=0;
 function pencil(q){svg.querySelectorAll('.route-live-pencil').forEach(e=>e.remove());if(!q)return;const a=pos(answer.path.at(-1)),line=document.createElementNS(svg.namespaceURI,'path');line.setAttribute('d',`M${a.x} ${a.y}L${q.x} ${q.y}`);line.setAttribute('class','route-live-pencil');svg.append(line);const dot=document.createElementNS(svg.namespaceURI,'circle');dot.setAttribute('cx',q.x);dot.setAttribute('cy',q.y);dot.setAttribute('r','5');dot.setAttribute('class','route-live-pencil');svg.append(dot);}
 const stop=()=>{gesture=null;map.classList.remove('tracing');pencil(null);};
 map.addEventListener('click',e=>{if(e.detail&&performance.now()<swallowUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
 map.onpointerdown=e=>{if(e.button!==0||answer.photographed||locked()||e.target===curl)return;const q=xy(e),last=answer.path.at(-1);if(dist(q,pos(last))>32)return;gesture={id:e.pointerId,last:q};map.setPointerCapture(e.pointerId);buttons.get(last).focus({preventScroll:true});map.classList.add('tracing');pencil(q);e.preventDefault();};
 function sample(q){const last=answer.path.at(-1),adj=p.edges.filter(([a,b])=>a===last||b===last);if(!adj.some(([a,b])=>edgeDistance(q,pos(a),pos(b))<=26)){status.textContent=t('offroad');stop();return;}
  const next=p.nodes.find(n=>n.id!==last&&dist(q,pos(n.id))<=22);if(!next)return;const edge=adj.find(([a,b])=>a===next.id||b===next.id);if(!edge)return;
  if(edge[2]==='stairs'){status.textContent=t('stairs');stop();return;}
  if(next.id===answer.path.at(-2)){answer.path.pop();status.textContent=label(next.id);draw();}else visit(next.id);
 }
 map.onpointermove=e=>{if(gesture?.id!==e.pointerId||locked())return;const q=xy(e),from=gesture.last,steps=Math.max(1,Math.ceil(dist(q,from)/6));swallowUntil=performance.now()+450;
  for(let i=1;i<=steps&&gesture;i++)sample({x:from.x+(q.x-from.x)*i/steps,y:from.y+(q.y-from.y)*i/steps});if(gesture){gesture.last=q;pencil(q);}
 };
 map.onpointerup=map.onpointercancel=map.onlostpointercapture=()=>{if(gesture)swallowUntil=performance.now()+450;stop();};
 let fold=null;
 curl.onpointerdown=e=>{if(e.button!==0||curl.disabled||locked())return;fold={id:e.pointerId,x:e.clientX,y:e.clientY};curl.setPointerCapture(e.pointerId);curl.focus({preventScroll:true});e.preventDefault();e.stopPropagation();};
 curl.onpointermove=e=>{if(fold?.id!==e.pointerId)return;const dx=e.clientX-fold.x,dy=e.clientY-fold.y;curl.style.setProperty('--fold',Math.min(1,Math.max(0,Math.min(-dx,-dy)/24)));};
 curl.onpointerup=e=>{if(fold?.id!==e.pointerId)return;const dx=e.clientX-fold.x,dy=e.clientY-fold.y;fold=null;curl.style.removeProperty('--fold');if(dx<=-18&&dy<=-18)keep();e.stopPropagation();};curl.onpointercancel=curl.onlostpointercapture=()=>{fold=null;curl.style.removeProperty('--fold');};
 hint.onclick=()=>{status.textContent=t('hintText');};draw();
}
root.RouteMap={mount,reset(){draft=null;}};
})(window);
