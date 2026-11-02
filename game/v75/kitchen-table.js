'use strict';
window.KitchenTable=(()=>{
 const langs=['zh-Hans','en','ar','hi','ja'];let draft=null;
 const words={
 board:['母亲家的案板','Mother’s chopping board','لوح التقطيع في بيت الأم','माँ का काटने वाला तख्ता','母の家のまな板'],
 help:['在洋葱上方按住，向下划过它切一片；也可移动刻度，再按“切一片”。切下几片后装碗，把最后一块交回母亲。没有限时或整齐度评分。','Press above the onion and draw downward through it, or move the marker and press “Cut a slice.” Put a few slices in the bowl, then pass the last piece back to Mother. There is no timer or neatness score.','اضغط فوق البصلة واسحب إلى أسفل عبرها، أو حرّك المؤشر واضغط «اقطع شريحة». ضع بضع شرائح في الوعاء ثم أعد القطعة الأخيرة إلى الأم. لا مؤقت ولا تقييم لتساوي الشرائح.','प्याज़ के ऊपर दबाकर नीचे तक खींचें, या निशान खिसकाकर “एक टुकड़ा काटें” दबाएँ। कुछ टुकड़े कटोरे में रखें, फिर आख़िरी हिस्सा माँ को दें। समय सीमा या बराबर टुकड़ों के अंक नहीं हैं।','玉ねぎの上から下へなぞるか、目印を動かして「一切れ切る」を押します。何枚かを器に入れ、残りを母に返しましょう。制限時間や均一さの採点はありません。'],
 marker:['切口位置','Cut position','موضع القطع','काटने की जगह','切る位置'],
 cut:['切一片','Cut a slice','اقطع شريحة','एक टुकड़ा काटें','一切れ切る'],
 assist:['系统参考线','System guide lines','خطوط إرشاد النظام','सिस्टम की सहायक रेखाएँ','システムの補助線'],
 assistNote:['参考线只提供等距位置，不替你切；开关它都不改变故事。','The guides suggest even spacing; they do not cut for you. Using them does not change the story.','تقترح الخطوط مسافات متساوية ولا تقطع بدلًا منك. استخدامها لا يغير القصة.','रेखाएँ बराबर दूरी सुझाती हैं, आपके लिए काटती नहीं। इन्हें इस्तेमाल करने से कहानी नहीं बदलती।','補助線は等間隔の目安です。代わりに切ることはなく、使っても物語は変わりません。'],
 bowl:['把切好的放进碗里','Put the slices in the bowl','ضع الشرائح في الوعاء','कटे टुकड़े कटोरे में रखें','切った分を器に入れる'],
 mother:['把最后一块交给母亲','Pass the last piece to Mother','أعطِ القطعة الأخيرة للأم','आख़िरी हिस्सा माँ को दें','最後の一片を母に渡す'],
 start:['案板推到维卡面前。母亲看了一眼他的手，往旁边让了让。','The board slides in front of Vika. Mother looks at his hands and makes room.','يصل اللوح أمام فيكا. تنظر الأم إلى يديه وتفسح له مكانًا.','तख्ता वीका के सामने आता है। माँ उसके हाथ देखकर थोड़ी जगह बनाती है।','まな板がヴィカの前に来る。母は彼の手を見て、少し場所を空けた。'],
 sliced:['切痕留在了洋葱上。可以另选一个位置，也可以把切好的先装碗。','The cut remains. Choose another position, or put the slices in the bowl.','بقي أثر القطع. اختر موضعًا آخر أو ضع الشرائح في الوعاء.','कट का निशान रह गया। दूसरी जगह चुनें या कटे टुकड़े कटोरे में रखें।','切れ目が残った。別の位置でもう一度切るか、切った分を器に入れられる。'],
 duplicate:['这里已经切过了。把刻度移远一点。','That spot is already cut. Move the marker a little further.','هذا الموضع مقطوع بالفعل. حرّك المؤشر قليلًا.','यह जगह पहले ही कट चुकी है। निशान थोड़ा दूर करें।','そこはもう切ってある。目印を少し離そう。'],
 few:['先切下几片。剩下的留给母亲。','Cut a few slices first. Leave the rest for Mother.','اقطع بضع شرائح أولًا واترك الباقي للأم.','पहले कुछ टुकड़े काटें। बाकी माँ के लिए छोड़ें।','まず何枚か切ろう。残りは母に任せる。'],
 enough:['碗里用不了更多了。把切好的放进去吧。','That is enough for the bowl. Put the slices in.','هذا يكفي للوعاء. ضع الشرائح فيه.','कटोरे के लिए इतने काफ़ी हैं। अब इन्हें उसमें रखें।','器にはこれで十分だ。切った分を入れよう。'],
 gathered:['碗里留下你切好的几片。案板上的最后一块还没动。','Your slices are in the bowl. The last piece is still on the board.','شرائحك في الوعاء. القطعة الأخيرة ما زالت على اللوح.','आपके कटे टुकड़े कटोरे में हैं। आख़िरी हिस्सा अभी तख्ते पर है।','切った分は器に入った。最後の一片はまだまな板の上にある。'],
 done:['母亲把最后一块拉近了一点。午饭还没做完，案板已经在两个人之间传过一圈。','Mother draws the last piece closer. Lunch is not ready yet; the board has already passed between two people.','تقرّب الأم القطعة الأخيرة. الغداء لم يجهز بعد، لكن اللوح تنقّل بين شخصين.','माँ आख़िरी हिस्सा पास खींचती है। खाना अभी तैयार नहीं, लेकिन तख्ता दो लोगों के बीच घूम चुका है।','母は最後の一片を引き寄せた。昼食はまだできていない。まな板はもう二人の間をひと回りした。']
 };
 function mount({rows,answer,locale,onChange}){
  const t=k=>words[k][Math.max(0,langs.indexOf(locale))];Object.assign(answer,draft?{...draft,cuts:[...draft.cuts]}:{cuts:[],cursor:150,guides:true,bowled:false,returned:false});
  const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  const box=el('section',undefined,'kitchen-table'),help=el('p',t('help'),'small'),stage=el('div',undefined,'kitchen-stage');
  stage.innerHTML='<svg id="kitchen-board" viewBox="0 0 600 350" role="img"><defs><pattern id="kitchen-wood" patternUnits="userSpaceOnUse" width="600" height="600"><image href="assets/london-materials-v1.webp" width="1200" height="1200"/></pattern><clipPath id="onion-cut-face"><ellipse cx="215" cy="170" rx="135" ry="90"/></clipPath><clipPath id="onion-remainder"><rect id="kitchen-remainder" x="70" y="70" width="300" height="200"/></clipPath></defs><rect x="15" y="20" width="390" height="300" rx="25" fill="#8c5f3b" stroke="#d2b17a" stroke-width="4"/><rect x="18" y="23" width="384" height="294" rx="22" fill="url(#kitchen-wood)" opacity=".65"/><path d="M40 50h335M40 295h335M40 310h335" stroke="#d8b17b" opacity=".3"/><g clip-path="url(#onion-remainder)"><g id="kitchen-onion" clip-path="url(#onion-cut-face)"><ellipse cx="215" cy="170" rx="135" ry="90" fill="#e8dbc2"/><ellipse cx="215" cy="170" rx="115" ry="76"/><ellipse cx="215" cy="170" rx="90" ry="60"/><ellipse cx="215" cy="170" rx="66" ry="44"/><ellipse cx="215" cy="170" rx="35" ry="23"/><g id="kitchen-cuts"></g></g></g><g id="kitchen-guides" stroke="#72c5cf" stroke-dasharray="5 7" stroke-width="2"><path d="M125 80v180M170 80v180M215 80v180M260 80v180"/></g><path id="kitchen-marker" d="M150 60v220" stroke="#ffe9a6" stroke-width="3"/><path d="M420 170q80 140 160 0" fill="#345d63" stroke="#a9b9ac" stroke-width="4"/><ellipse cx="500" cy="170" rx="80" ry="23" fill="#122f36" stroke="#a9b9ac" stroke-width="3"/><g id="kitchen-slices"></g></svg>';
  const svg=stage.querySelector('svg');svg.setAttribute('aria-label',t('board'));
  const label=el('label',t('marker')),slider=el('input');slider.type='range';slider.id='kitchen-position';slider.min='105';slider.max='280';slider.step='1';label.htmlFor=slider.id;
  const controls=el('div',undefined,'kitchen-controls'),cut=el('button',t('cut')),assist=el('button',t('assist')),bowl=el('button',t('bowl')),mother=el('button',t('mother')),status=el('p','','notice');
  cut.id='kitchen-cut';assist.id='kitchen-assist';bowl.id='kitchen-bowl';mother.id='kitchen-mother';status.id='kitchen-status';status.setAttribute('role','status');controls.append(cut,assist,bowl,mother);box.append(help,stage,label,slider,controls,el('p',t('assistNote'),'small'),status);rows.append(box);
  const locked=()=>rows.closest('.puzzle')?.querySelector('[data-action=check]')?.disabled===true;
  const NS='http://www.w3.org/2000/svg';let gesture=null;const foley=kind=>window.dispatchEvent(new CustomEvent('v75:foley',{detail:{kind}}));
  function draw(message){
   slider.value=answer.cursor;slider.disabled=answer.bowled||locked();cut.disabled=answer.bowled||locked();assist.disabled=answer.bowled||locked();bowl.disabled=answer.bowled||locked();mother.disabled=!answer.bowled||answer.returned||locked();assist.setAttribute('aria-pressed',String(answer.guides));
   svg.querySelector('#kitchen-guides').style.display=answer.guides&&!answer.bowled?'':'none';svg.querySelector('#kitchen-marker').style.display=answer.bowled?'none':'';svg.querySelector('#kitchen-marker').setAttribute('d',`M${answer.cursor} 60v220`);
   const cuts=svg.querySelector('#kitchen-cuts');cuts.replaceChildren();for(const x of answer.cuts){const l=document.createElementNS(NS,'path');l.setAttribute('d',`M${x} 70v200`);l.setAttribute('stroke','#725e58');l.setAttribute('stroke-width','3');cuts.append(l);}
   svg.querySelector('#kitchen-onion').style.display=answer.returned?'none':'';stage.classList.toggle('bowled',answer.bowled);
   svg.querySelector('#kitchen-remainder').setAttribute('x',answer.bowled?Math.max(...answer.cuts):70);
   const slices=svg.querySelector('#kitchen-slices');slices.replaceChildren();if(answer.bowled){let last=80;for(const[x,i]of answer.cuts.map((x,i)=>[x,i])){const w=x-last;last=x;const piece=document.createElementNS(NS,'path');piece.setAttribute('d',`M${442+i*9} ${166-i%3*7}q${w/2} 35 ${Math.min(w,62)} 0`);piece.setAttribute('fill','none');piece.setAttribute('stroke','#ddd0b9');piece.setAttribute('stroke-width',String(Math.min(10,3+w/8)));slices.append(piece);}}
   if(answer.returned){for(let i=0;i<3;i++){const piece=document.createElementNS(NS,'path');piece.setAttribute('d',`M${470+i*12} ${155+i*3}q19 26 38 0`);piece.setAttribute('fill','none');piece.setAttribute('stroke','#ebdfc6');piece.setAttribute('stroke-width','6');piece.dataset.mother='true';slices.append(piece);}}
   if(message)status.textContent=t(message);draft={...answer,cuts:[...answer.cuts]};onChange();
  }
  function slice(){if(answer.bowled||locked())return;if(answer.cuts.length>=8){draw('enough');return;}if(answer.cuts.some(x=>Math.abs(x-answer.cursor)<12)){draw('duplicate');return;}answer.cuts.push(answer.cursor);answer.cuts.sort((a,b)=>a-b);draw('sliced');foley('chop');}
  slider.oninput=()=>{answer.cursor=Number(slider.value);draw();};cut.onclick=slice;assist.onclick=()=>{answer.guides=!answer.guides;draw();};
  bowl.onclick=()=>{if(answer.cuts.length<2){draw('few');return;}answer.bowled=true;draw('gathered');foley('ceramic');};mother.onclick=()=>{if(!answer.bowled||locked())return;answer.returned=true;draw('done');foley('wood');};
  const point=e=>{const m=svg.getScreenCTM();return m?new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse()):null;};
  svg.onpointerdown=e=>{if(e.button!==0||answer.bowled||locked())return;const p=point(e);if(!p||p.x<105||p.x>280||p.y<45||p.y>115)return;answer.cursor=Math.round(p.x);gesture={id:e.pointerId};svg.setPointerCapture(e.pointerId);draw();e.preventDefault();};
  svg.onpointermove=e=>{if(gesture?.id!==e.pointerId||answer.bowled||locked())return;const p=point(e);if(p&&p.y>=255){gesture=null;slice();}};
  for(const name of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(name,()=>{gesture=null;});
  draw(answer.returned?'done':answer.bowled?'gathered':answer.cuts.length?'sliced':'start');
 }
 return{mount,reset(){draft=null;}};
})();
