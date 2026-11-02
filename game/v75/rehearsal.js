'use strict';
(()=>{
 const D=window.FULL_STORY,M=window.FullGame,$=s=>document.querySelector(s),langs=['zh-Hans','en','ar','hi','ja'];
 const words={
 choice:["选择场景","Choose a scene","اختر مشهدًا","दृश्य चुनें","場面を選ぶ"],
 title:['答案之后 · 场景排练','After the Answer · Scene rehearsal','بعد الإجابة · تجربة المشاهد','उत्तर के बाद · दृश्य अभ्यास','答えのあとで · 場面の練習'],
 tag:['先动手，再决定是否走进故事','Try the actions, then enter the story','جرّب الأفعال ثم ادخل القصة','पहले खेलकर देखें, फिर कहानी में आएँ','まず触れてから、物語へ'],
 notice:['直接试玩十一段与人物有关的操作，包含后续地点和剧情片段。这里不会改动主线进度；动作完成后，可以展开这段故事接着发生的事。','Try eleven character-led interactions, including later locations and story excerpts. This page never changes story progress. After completing an action, you can read what follows in that scene.','جرّب أحد عشر تفاعلًا مرتبطًا بالشخصيات، تشمل أماكن لاحقة ومقاطع من القصة. لا تغيّر هذه الصفحة تقدم القصة. بعد إتمام الفعل يمكنك قراءة ما يحدث بعده.','पात्रों से जुड़ी ग्यारह गतिविधियाँ सीधे आज़माएँ; आगे के स्थान और कथा-अंश शामिल हैं। यह पृष्ठ कहानी की प्रगति नहीं बदलता। गतिविधि पूरी होने पर आगे का दृश्य पढ़ सकते हैं।','人物に結びついた11の操作を試せます。後半の場所や物語の一部を含みます。本編の進行状況は変わりません。操作を終えると、この場面の続きも読めます。'],
 back:['返回标题页','Back to title','العودة إلى العنوان','शीर्षक पृष्ठ पर लौटें','タイトルへ'],language:['语言','Language','اللغة','भाषा','言語'],
 check:['看看做到哪一步了','Check this attempt','تحقق من هذه المحاولة','यह कोशिश जाँचें','ここまでを確かめる'],
 retry:['重新排练这一段','Rehearse this scene again','جرّب هذا المشهد مجددًا','यह दृश्य फिर आज़माएँ','この場面をやり直す'],
 story:['回到主线入口','Return to the story menu','العودة إلى قائمة القصة','कहानी के मुख्य मेनू पर लौटें','本編の入口へ'],
 after:['接着发生的事','What happens next in this scene','ما يحدث بعد ذلك في المشهد','इस दृश्य में आगे क्या हुआ','この場面の続き'],
 complete:['这一段操作已完成','This action is complete','اكتمل هذا الفعل','यह गतिविधि पूरी हुई','この操作を終えました'],
 save:['排练只保留在当前页面。切换场景可接着做；刷新页面后重新开始。主线、旅程备份和已读笔记均不改变。','Rehearsals stay only on this page. Switching scenes keeps your work; reloading starts fresh. Story saves, journey backups and recorded journal entries remain unchanged.','تبقى التجارب في هذه الصفحة فقط. تبديل المشهد يحتفظ بعملك؛ إعادة التحميل تبدأ من جديد. لا يتغير حفظ القصة أو نسخ الرحلة أو المفكرة.','अभ्यास केवल इस पृष्ठ पर रहता है। दृश्य बदलने से काम बना रहता है; पृष्ठ फिर लोड करने पर नया अभ्यास शुरू होता है। कहानी की सेव, बैकअप और नोटबुक नहीं बदलते।','練習の途中経過はこのページ内だけに保持します。場面を切り替えても続けられますが、再読み込みで初めに戻ります。本編のセーブ、旅のバックアップ、手帳は変わりません。'],
 height:['水杯高度','Cup height','ارتفاع الكوب','कप की ऊँचाई','カップの高さ'],valve:['打开阀门','Open the valve','افتح الصمام','वाल्व खोलें','弁を開く'],flowing:['正在流动','Flowing','يتدفق','पानी बह रहा है','流れている'],stopped:['已经停流','Stopped','متوقف','पानी रुका है','止まっている'],
 vika:['维卡的视角','Vika’s viewpoint','وجهة نظر فيكا','वीका का दृष्टिकोण','ヴィカの視点'],noyi:['诺伊的视角','Noyi’s viewpoint','وجهة نظر نوي','नोई का दृष्टिकोण','ノイの視点'],both:['两个人在场','Both are present','كلاهما حاضر','दोनों मौजूद हैं','二人のいる場面']
 };
 const specs=[['cl_gravity','flow',FlowLab,'classroom','daily'],['cl_paperplane','plane',PaperFlightTable,'classroom','daily'],['ac_stop','evac',EvacuationBoard,'accident','grief'],['hi_audit','audit',ArchiveAuditTable,'hidden','inquiry'],['hi_onion','kitchen',KitchenTable,'hidden','daily'],['re_maps','atlas',AtlasTable,'return','inquiry'],['em_map','route',RouteMap,'empty','grief'],['he_medicine','handover',HandoverTable,'hearing','inquiry'],['rs_local','council',CouncilTable,'rescue','inquiry'],['ty_student','leak',LeakBench,'tenyears','daily'],['ty_xing','watch',WatchBench,'tenyears','finale']];
 const scenes=specs.map(([id,kind,controller,chapter,theme])=>{const c=D.chapters.find(c=>c.id===chapter),n=c.nodes.find(n=>n.id===id);return{id,kind,controller,c,n,theme};});
 const q=new URLSearchParams(location.search);let locale=langs.includes(q.get('lang'))?q.get('lang'):'zh-Hans',current=scenes.find(x=>x.id===q.get('scene'))||scenes[0];const completed=new Set();
 const tr=k=>words[k][langs.indexOf(locale)],t=value=>value?.[locale]||value?.['zh-Hans']||'',el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
 function render(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=tr('title');document.body.dataset.audioTheme=current.theme;$('#language').value=locale;
  for(const[id,key]of [['scene-choice-label','choice'],['rehearsal-back','back'],['language-label','language'],['rehearsal-title','title'],['rehearsal-tag','tag'],['rehearsal-notice','notice'],['retry-scene','retry'],['return-story','story'],['scene-after-label','after'],['practice-save-note','save']])$('#'+id).textContent=tr(key);
  $('#return-story').href=$('#rehearsal-back').href='start.html?lang='+locale;
  const picker=$('#scene-select');picker.replaceChildren();for(const scene of scenes){const option=el('option',t(scene.n.label));option.value=scene.id;picker.append(option);}picker.value=current.id;
  const nav=$('#rehearsal-scenes');nav.setAttribute('aria-label',tr('title'));nav.replaceChildren();for(const scene of scenes){const b=el('button',t(scene.n.label));b.dataset.rehearsalScene=scene.id;b.setAttribute('aria-current',String(scene===current));b.onclick=()=>{current=scene;render();$('#scene-title').focus({preventScroll:true});};nav.append(b);}
  const{n,c,controller,kind}=current,p=n.puzzle;$('#scene-title').textContent=t(n.label);$('#scene-person').textContent=tr(['vika','noyi'].includes(n.actor)?n.actor:'both');$('#background').src=n.image||c.image||c.bg||'assets/london.webp';$('#scene-context').textContent=t(p.opening||c.intro);$('#scene-text').textContent=t(n.text);$('#scene-after').hidden=!completed.has(n.id);$('#scene-after').open=false;
  RehearsalNotes.mount({element:$('#rehearsal-notes'),id:n.id,title:t(n.label),language:locale,completed:completed.has(n.id)});
  const host=$('#rehearsal-work');host.replaceChildren();const box=el('section',undefined,'puzzle'),rows=el('div',undefined,'puzzle-rows'),feedback=el('p','','notice'),check=el('button',tr('check'),'primary'),answer={};box.dataset.puzzle=kind;feedback.id='practice-feedback';feedback.setAttribute('role','status');check.dataset.action='check';box.append(el('p',t(p.prompt),'puzzle-prompt'),rows,feedback,check);host.append(box);
  controller.mount({rows,answer,locale,p,key:n.id,ui:tr,onChange:()=>{feedback.textContent='';}});
  function finish(){feedback.textContent=t(p.success);check.textContent=tr('complete');box.querySelectorAll('button,input,select').forEach(e=>e.disabled=true);box.querySelectorAll('[role=slider],[data-game-board]').forEach(e=>{e.tabIndex=-1;e.setAttribute('aria-disabled','true');});$('#scene-after').hidden=false;}
  check.onclick=()=>{const attempt=kind==='council'?answer.order:answer;if(!M.solve(p,attempt)){feedback.textContent=t(p.failure);return;}completed.add(n.id);RehearsalNotes.completion(true);finish();};if(completed.has(n.id))finish();
 }
 $('#scene-select').onchange=e=>{current=scenes.find(s=>s.id===e.target.value)||scenes[0];render();};
 $('#retry-scene').onclick=()=>{current.controller.reset();completed.delete(current.id);render();};$('#language').onchange=e=>{locale=e.target.value;render();};render();
})();
