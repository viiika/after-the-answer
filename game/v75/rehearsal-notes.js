'use strict';
window.RehearsalNotes=(()=>{
 const langs=['zh-Hans','en','ar','hi','ja'],entries=new Map();let locale='zh-Hans',active=null,host=null;
 const words={
 title:['试玩后记（可选）','Play notes (optional)','ملاحظات التجربة (اختياري)','अभ्यास के नोट (वैकल्पिक)','遊んだメモ（任意）'],
 intro:['可以只写一句。文字只留在当前页面，刷新会清除；下载可带走，不会发送给任何人。','One sentence is enough. Notes stay on this page and disappear on reload. Download a copy to keep; nothing is sent to anyone.','تكفي جملة واحدة. تبقى الملاحظات في هذه الصفحة وتُمسح عند إعادة التحميل. نزّل نسخة للاحتفاظ بها؛ لا يُرسل شيء إلى أحد.','एक वाक्य भी काफ़ी है। नोट इसी पृष्ठ पर रहते हैं और फिर लोड करने पर मिटते हैं। रखने के लिए डाउनलोड करें; किसी को नहीं भेजे जाते।','一言だけでも構いません。メモはこのページ内だけに残り、再読み込みで消えます。残すにはダウンロードしてください。誰にも送信されません。'],
 purpose:['这一段里，你觉得自己在帮谁做什么？','Who were you helping, and what were you doing for them?','من كنت تساعد، وماذا كنت تفعل له؟','आप किसकी मदद कर रहे थे, और क्या कर रहे थे?','誰のために、何をしていたと感じましたか？'],
 feel:['哪里好玩，或哪里不顺手？','What was engaging, or awkward to use?','ما الممتع، أو الصعب في الاستخدام؟','क्या मज़ेदार लगा, या कहाँ चलाना असहज था?','楽しかったところ、操作しづらかったところは？'],
 change:['如果改一件事，你会改什么？','If you changed one thing, what would it be?','إذا غيّرت شيئًا واحدًا، فماذا سيكون؟','एक चीज़ बदल सकते तो क्या बदलते?','一つ変えるなら、何を変えたいですか？'],
 download:['下载本页全部试玩笔记','Download all notes from this page','نزّل كل ملاحظات هذه الصفحة','इस पृष्ठ के सभी नोट डाउनलोड करें','このページのメモをまとめて保存'],
 empty:['还没有填写试玩笔记。','No play notes yet.','لا توجد ملاحظات بعد.','अभी कोई नोट नहीं है।','まだメモはありません。'],
 kept:['文字已留在本页，可下载保存。','Your notes are on this page, ready to download.','ملاحظاتك في هذه الصفحة وجاهزة للتنزيل.','नोट इस पृष्ठ पर हैं; डाउनलोड करके रख सकते हैं।','メモをこのページに保持しています。ダウンロードできます。'],
 downloaded:['已交给浏览器下载；本页文字仍保留。','The download has been handed to your browser. Notes remain on this page.','أُرسل التنزيل إلى المتصفح. تبقى الملاحظات في الصفحة.','डाउनलोड ब्राउज़र को सौंप दिया गया है। नोट पृष्ठ पर बने हैं।','ブラウザーでダウンロードを開始しました。このページのメモは残っています。'],
 report:['答案之后 · 玩家自填试玩笔记','After the Answer · Player-written play notes','بعد الإجابة · ملاحظات كتبها اللاعب','उत्तर के बाद · खिलाड़ी के अपने नोट','答えのあとで · プレイヤーが書いたメモ'],
 language:['填写时的界面语言','Interface language while writing','لغة الواجهة عند الكتابة','लिखते समय इंटरफ़ेस की भाषा','記入時の表示言語'],
 completed:['本页已完成这一段操作','This action was completed on this page','اكتمل هذا الفعل في هذه الصفحة','इस पृष्ठ पर गतिविधि पूरी हुई','このページで操作を完了'],
 unfinished:['本页尚未完成这一段操作','This action was not completed on this page','لم يكتمل هذا الفعل في هذه الصفحة','इस पृष्ठ पर गतिविधि अभी पूरी नहीं हुई','このページではまだ操作を完了していない']
 };
 // Feedback is authored by the player, never inferred from completion or clicks.
 const t=k=>words[k][Math.max(0,langs.indexOf(locale))],fields=['purpose','feel','change'];
 function written(){return [...entries.values()].filter(e=>fields.some(k=>e.answers[k].trim()));}
 function refresh(){if(!host)return;host.querySelector('#notes-download').disabled=!written().length;host.querySelector('#notes-status').textContent=t(written().length?'kept':'empty');}
 function mount({element,id,title,language,completed}){
  host=element;locale=language;active=id;
  if(!entries.has(id))entries.set(id,{id,title,language,completed,answers:Object.fromEntries(fields.map(k=>[k,'']))});
  const entry=entries.get(id);entry.completed=completed;
  const details=document.createElement('details');details.className='rehearsal-notes';const summary=document.createElement('summary');summary.textContent=t('title');details.append(summary);
  const intro=document.createElement('p');intro.textContent=t('intro');details.append(intro);
  for(const field of fields){const label=document.createElement('label'),input=document.createElement('textarea');label.textContent=t(field);input.id='notes-'+field;input.rows=3;input.dir='auto';input.maxLength=1500;input.value=entry.answers[field];label.htmlFor=input.id;input.oninput=()=>{entry.answers[field]=input.value;entry.title=title;entry.language=language;refresh();};details.append(label,input);}
  const button=document.createElement('button');button.id='notes-download';button.textContent=t('download');button.onclick=()=>{
   const notes=written();if(!notes.length)return;
   const text=[t('report'),''].concat(notes.flatMap(e=>[e.title,`${t('language')}: ${e.language}`,t(e.completed?'completed':'unfinished'),...fields.flatMap(k=>[t(k),e.answers[k]||'—']),''])).join('\n\n');
   const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='after-the-answer-play-notes.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);host.querySelector('#notes-status').textContent=t('downloaded');
  };
  const status=document.createElement('p');status.id='notes-status';status.setAttribute('role','status');details.append(button,status);host.replaceChildren(details);refresh();
 }
 return{mount,completion(value){if(active&&entries.has(active))entries.get(active).completed=value;}};
})();
