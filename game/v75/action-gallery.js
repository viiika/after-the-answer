'use strict';
// A visual rehearsal, isolated from every story model and save key.
window.ActionGallery=(()=>{
 const languages=['zh-Hans','en','ar','hi','ja'],motion=matchMedia('(prefers-reduced-motion: reduce)');
 const words={
 title:['人物动作工作台','Character action studies','دراسات حركة الشخصيات','पात्रों की गति का अध्ययन','人物の動作試作'],
 note:['四组四帧动作小样：记录读数、检查木架、检查杏的表，以及把验证用的灯交到另一人手中。播放或逐帧查看均不推进剧情；动作与表情仍需精修。','Four four-drawing studies: recording a reading, checking the frame, inspecting Xing’s watch, and handing over the lamp used to verify evidence. Play or inspect each drawing without advancing the story. Motion and facial acting still need refinement.','أربع دراسات من أربع رسومات: تسجيل قراءة، وفحص الإطار، وفحص ساعة شينغ، وتسليم مصباح التحقق من الأدلة. شغّل أو افحص كل رسمة دون تقدم القصة. الحركة وتعابير الوجه ما زالت بحاجة إلى تحسين.','चार-चार चित्रों वाले चार अभ्यास: माप लिखना, ढाँचे की जाँच, शिंग की घड़ी देखना और प्रमाण जाँचने वाला दीपक दूसरे को देना। कहानी आगे बढ़ाए बिना चलाएँ या हर चित्र देखें। गति और चेहरे अभी सुधरने हैं।','各4枚の動作試作が4組あります。測定値の記録、木枠の確認、シンの時計の点検、そして証拠を確かめる灯りの手渡しです。物語を進めず再生・確認できます。動きと表情は引き続き調整中です。'],
 watch:['维卡 · 检查杏的表','Vika · Inspecting Xing’s watch','فيكا · فحص ساعة شينغ','वीका · शिंग की घड़ी की जाँच','ヴィカ · シンの時計を点検'],
 vika:['维卡 · 记录读数','Vika · Recording a reading','فيكا · تسجيل قراءة','वीका · माप लिखना','ヴィカ · 測定値の記録'],
 noyi:['诺伊 · 检查木架','Noyi · Inspecting the frame','نوي · فحص الإطار','नोई · ढाँचे की जाँच','ノイ · 木枠の確認'],
 lantern:['维卡与诺伊 · 交灯','Vika and Noyi · Passing the lamp','فيكا ونوي · تسليم المصباح','विका और नोई · दीपक सौंपना','ヴィカとノイ · 灯りを渡す'],
 play:['播放一次','Play once','تشغيل مرة واحدة','एक बार चलाएँ','一度再生'],
 stop:['停止并回到站姿','Stop and return to standing','إيقاف والعودة إلى الوقوف','रोकें और खड़ी मुद्रा पर लौटें','停止して立ち姿に戻す'],
 frame:['查看姿态','Inspect drawing','عرض الرسمة','मुद्रा देखें','姿勢を確認'],
 source:['打开四帧原画','Open the four-drawing sheet','افتح لوحة الرسومات الأربع','चार चित्रों वाली मूल शीट खोलें','4枚の原画を開く'],
 reduced:['已启用减少动态；可用下方四个按钮逐帧查看。','Reduced motion is enabled. Use the four buttons to inspect individual drawings.','تقليل الحركة مفعّل. استخدم الأزرار الأربعة لفحص كل رسمة.','कम गति चालू है। चार बटनों से हर मुद्रा अलग देखें।','動きを減らす設定です。下の4つのボタンで一枚ずつ確認できます。'],
 ready:['动作就绪','Action ready','الحركة جاهزة','गति तैयार है','再生できます'],
 playing:['正在播放','Playing','قيد التشغيل','चल रहा है','再生中'],
 loading:['正在载入动作原画…','Loading the action sheet…','جارٍ تحميل لوحة الحركة…','गति के चित्र लोड हो रहे हैं…','動作の原画を読み込み中…'],
 failed:['动作原画未载入，显示原立绘。','Action sheet unavailable; showing the original portrait.','لوحة الحركة غير متاحة؛ تظهر صورة الشخصية الأصلية.','गति के चित्र नहीं खुले; मूल पात्र-चित्र दिख रहा है।','動作の原画を読み込めないため、元の立ち絵を表示しています。']
 };
 let language='zh-Hans';const t=k=>words[k][languages.indexOf(language)],cards=[];
 for(const [name,sheet,portrait]of [['vika','vika-observe-v1','vika'],['noyi','noyi-inspect-v1','noyi'],['watch','vika-watch-v1','vika'],['lantern','vika-noyi-lantern-v1',null]]){
  const card=document.createElement('article');card.className='action-card';card.dataset.actor=name;
  const fallback=portrait?`<img class="action-fallback" src="assets/${portrait}.webp" alt="">`:`<div class="action-fallback lantern-fallback"><img src="assets/vika.webp" alt=""><img src="assets/noyi.webp" alt=""></div>`;
  card.innerHTML=`<h3></h3><div class="action-stage">${fallback}<div class="action-drawing ${name}-drawing" data-frame="0" hidden aria-hidden="true"></div></div><p class="action-status" role="status"></p><div class="action-controls"><button class="action-play"></button><button class="action-stop"></button></div><div class="action-frames" role="group"></div><a class="action-source" href="assets/${sheet}.webp" target="_blank" rel="noopener"></a>`;
  document.querySelector('#action-cards').append(card);
  const element=card.querySelector('.action-drawing'),fallbackElement=card.querySelector('.action-fallback'),controller=ActorSprite.mount({element,fallback:fallbackElement,src:`assets/${sheet}.webp`});
  const entry={name,card,element,controller,fallback:fallbackElement};cards.push(entry);
  for(let n=0;n<4;n++){const button=document.createElement('button');button.dataset.frame=String(n);button.textContent=String(n+1);button.onclick=()=>{cards.forEach(c=>c.controller.stop());controller.showFrame(n);update();};card.querySelector('.action-frames').append(button);}
  card.querySelector('.action-play').onclick=()=>{cards.forEach(c=>c.controller.stop());controller.play();update();};
  card.querySelector('.action-stop').onclick=()=>{controller.stop();update();};
  new MutationObserver(update).observe(element,{attributes:true,attributeFilter:['hidden','data-playing','data-frame']});
 }
 function update(){
  document.querySelector('#actions-title').textContent=t('title');document.querySelector('#actions-note').textContent=t('note');
  for(const{card,name,element,controller,fallback}of cards){
   card.querySelector('h3').textContent=t(name);if(fallback.tagName==='IMG')fallback.alt=t(name);else for(const image of fallback.querySelectorAll('img'))image.alt=t(name);
   const active=element.dataset.playing==='true';
   const status=card.querySelector('.action-status'),message=t(controller.ready?(motion.matches?'reduced':active?'playing':'ready'):element.dataset.playing==='false'?'failed':'loading');
   if(status.textContent!==message)status.textContent=message;
   const play=card.querySelector('.action-play');play.textContent=t('play');play.disabled=!controller.ready||motion.matches;
   const stop=card.querySelector('.action-stop');stop.textContent=t('stop');stop.disabled=!controller.ready;
   card.querySelector('.action-frames').setAttribute('aria-label',t('frame'));
   for(const button of card.querySelectorAll('[data-frame]:not(.action-drawing)')){button.disabled=!controller.ready;button.setAttribute('aria-label',t('frame')+' '+(Number(button.dataset.frame)+1));button.setAttribute('aria-pressed',String(button.dataset.frame===element.dataset.frame));}
   card.querySelector('.action-source').textContent=t('source');
  }
 }
 motion.addEventListener('change',update);
 return{language(value){if(languages.includes(value))language=value;update();}};
})();
