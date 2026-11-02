/* Normal journey links only read progress. A separate backup dialog replaces saves only after an explicit reviewed restore. */
(() => {
 'use strict';
 const languages=['zh-Hans','en','ar','hi','ja'], O=window.Opening,F=window.FullGame;
 const words={
  title:['答案之后','After the Answer','بعد الإجابة','उत्तर के बाद','答えのあとで'],
  edition:['V7.5 · 完整故事开发版','V7.5 · Complete story development edition','V7.5 · نسخة تطوير القصة الكاملة','V7.5 · संपूर्ण कहानी का विकास संस्करण','V7.5 · 全編ストーリー開発版'],
  language:['语言','Language','اللغة','भाषा','言語'],
  tagline:['答案改变世界。寻找答案的人呢？','Answers change the world. What about the people who seek them?','تغيّر الإجابات العالم. فماذا عن الذين يبحثون عنها؟','उत्तर दुनिया बदल देते हैं। उन्हें खोजने वालों का क्या?','答えは世界を変える。答えを探す人は、どうだろう。'],
  synopsis:['一位修正历史的执行员，一位从隐藏纪元归来的女人。\n当更好的答案不再需要我们，谁来保存理解的过程？','An agent who corrects history. A woman returning from a hidden era.\nWhen better answers no longer need us, who keeps the work of understanding alive?','عميل يصحح التاريخ، وامرأة عائدة من عصر خفي.\nحين لا تعود الإجابات الأفضل بحاجة إلينا، من يحفظ رحلة الفهم؟','इतिहास सुधारने वाला एक अधिकारी। छिपे युग से लौटी एक स्त्री।\nजब बेहतर उत्तरों को हमारी ज़रूरत नहीं होगी, समझने का प्रयास कौन बचाएगा?','歴史を修正する執行官と、隠された時代から戻った女性。\nよりよい答えが私たちを必要としなくなったとき、理解する過程は誰が守るのか。'],
  begin:['开始旅程','Begin the journey','ابدأ الرحلة','यात्रा शुरू करें','旅を始める'],
  continue:['继续上次旅程','Continue your journey','تابع رحلتك','अपनी यात्रा जारी रखें','前回の続きから'],
  opening:['从第一章进入','Enter from chapter one','ادخل من الفصل الأول','पहले अध्याय से प्रवेश करें','第一章へ'],
  openingSaved:['回到开场 · 保留进度','Return to the opening · keep progress','عد إلى البداية · مع حفظ التقدم','शुरुआत पर लौटें · प्रगति सुरक्षित','序章へ戻る · 進行状況はそのまま'],
  london:['直接进入伦敦 · 第四章起','Enter London directly · chapter four onward','ادخل لندن مباشرة · من الفصل الرابع','सीधे लंदन जाएँ · चौथे अध्याय से','ロンドンへ · 第四章から'],
  storyplay:['第三章可玩重构 · 太阳不会等人','Play chapter 3 · Jaipur','العب الفصل الثالث · جايبور','अध्याय 3 खेलें · जयपुर','第三章を遊ぶ · ジャイプル'],
  rehearsal:['场景排练 · 十一段剧情玩法','Scene rehearsal · eleven story interactions','تجربة المشاهد · أحد عشر تفاعلًا قصصيًا','दृश्य अभ्यास · ग्यारह कथा गतिविधियाँ','場面の練習 · 11の物語の操作'],
  arcade:['附加小游戏 · 星际打捞机','Little Orbit · standalone arcade','مدار صغير · لعبة مستقلة','नन्ही कक्षा · स्वतंत्र खेल','ちいさな軌道 · ミニゲーム'],
  workshop:['实验工坊 · 管路谜题（中文）','Workshop · pipe puzzles (Chinese)','ورشة · ألغاز الأنابيب (بالصينية)','कार्यशाला · पाइप पहेलियाँ (चीनी)','実験工房 · パイプパズル（中国語）'],
  gallery:['场景画集 · 含后期地点','Scene gallery · includes later locations','معرض المشاهد · يتضمن أماكن لاحقة','दृश्य संग्रह · आगे के स्थान भी हैं','背景画集 · 後半の場所を含む'],
  ending:['回看片尾','Revisit the ending','راجع النهاية','अंत फिर देखें','エンディングを見る'],
  newProgress:['从一块迟到的生日蛋糕开始。可随时切换两位主角的视角。','Start with a late birthday cake. Switch between the two protagonists at any time.','ابدأ بكعكة عيد ميلاد متأخرة. يمكنك التبديل بين وجهتي نظر الشخصيتين.','देर से आए जन्मदिन के केक से शुरू करें। दोनों पात्रों के दृष्टिकोण बदल सकते हैं।','遅れて届いた誕生日のケーキから。二人の視点はいつでも切り替えられます。'],
  openingProgress:['开场与斋浦尔 · 已记录 {n} / 22 件事','Opening and Jaipur · {n} / 22 moments recorded','البداية وجايبور · سُجلت {n} / 22 لحظة','शुरुआत और जयपुर · {n} / 22 घटनाएँ दर्ज','序章とジャイプル · {n} / 22 の出来事を記録'],
  nextProgress:['斋浦尔已经结束。下一站是伦敦的印刷间。','Jaipur is complete. The London print shop is next.','انتهت جايبور. المحطة التالية مطبعة لندن.','जयपुर पूरा हो गया। अगला पड़ाव लंदन का छापेखाना है।','ジャイプルの記録は完了。次はロンドンの印刷所へ。'],
  fullProgress:['第四章起的故事 · 已走到第 {n} / {total} 段','Story from chapter four · section {n} / {total}','القصة من الفصل الرابع · الجزء {n} / {total}','चौथे अध्याय से कहानी · भाग {n} / {total}','第四章からの物語 · 第 {n} / {total} 節'],
  completeProgress:['旅程已经完成。可以回看已解锁的章节与片尾。','Your journey is complete. Revisit unlocked chapters and the ending.','اكتملت الرحلة. يمكنك مراجعة الفصول المفتوحة والنهاية.','यात्रा पूरी है। खुले अध्याय और अंत फिर देख सकते हैं।','旅は完了しました。解放済みの章やエンディングを振り返れます。'],
  badSave:['发现无法读取的存档，尚未改动。仍可进入游戏查看恢复选项，或在游戏中确认重新开始；请先保留备份。','A save could not be read; it has not been changed. Enter the game for recovery options or explicitly restart there. Keep a backup first.','تعذرت قراءة حفظ ولم يُغيّر. ادخل اللعبة لخيارات الاستعادة أو أعد البدء بتأكيد صريح فيها. احتفظ بنسخة أولًا.','एक सेव नहीं पढ़ी जा सकी; उसे बदला नहीं गया। पुनर्प्राप्ति विकल्पों के लिए खेल खोलें या वहाँ पुष्टि करके फिर शुरू करें। पहले बैकअप रखें।','読めないセーブがありますが、変更していません。ゲーム内で復旧方法を確認するか、再開始を明示的に選べます。先にバックアップを保管してください。'],
  noSave:['浏览器暂时不允许读取本地存档。游戏仍可运行；进入续篇后可手动导出存档。','The browser does not allow access to local saves. You can still play; the continuation offers manual save export.','لا يسمح المتصفح بقراءة الحفظ المحلي. يمكنك اللعب، ويتيح الجزء التالي تصدير الحفظ يدويًا.','ब्राउज़र स्थानीय सेव पढ़ने नहीं दे रहा। खेल चल सकता है; आगे की कहानी में सेव हाथ से निर्यात कर सकते हैं।','ブラウザーがローカルセーブへのアクセスを許可していません。ゲームは遊べ、続編では手動でセーブを書き出せます。'],
  saveNote:['开始或继续不会重置存档。换设备、浏览器或打开方式前，请下载旅程备份；恢复备份会在确认后替换四段进度。','Starting or continuing never resets saves. Download a journey backup before changing device, browser or launch method. A confirmed restore replaces all four saved sections.','البدء والمتابعة لا يمسحان الحفظ. نزّل نسخة الرحلة قبل تغيير الجهاز أو المتصفح أو طريقة الفتح. الاستعادة المؤكدة تستبدل الأقسام الأربعة.','शुरू करने या जारी रखने से सेव नहीं मिटती। उपकरण, ब्राउज़र या खोलने का तरीका बदलने से पहले यात्रा बैकअप लें। पुष्टि की गई बहाली चारों हिस्से बदलती है।','開始・続行ではセーブを初期化しません。端末・ブラウザー・起動方法を変える前に旅を書き出してください。復元を確認すると四つの記録を置き換えます。'],
  clearJourney:['清空全部进度','Clear all progress','امسح كل التقدم','सारी प्रगति मिटाएँ','すべての進行を消去'],
  clearConfirm:['确定清空开场、斋浦尔、伦敦和完整篇的全部进度吗？语言与音量设置会保留。此操作无法撤销。','Clear all progress from the opening, Jaipur, London and the complete story? Language and audio settings will remain. This cannot be undone.','هل تريد مسح كل تقدم البداية وجايبور ولندن والقصة الكاملة؟ ستبقى إعدادات اللغة والصوت. لا يمكن التراجع عن ذلك.','क्या शुरुआत, जयपुर, लंदन और पूरी कहानी की सारी प्रगति मिटानी है? भाषा और आवाज़ की सेटिंग बनी रहेगी। इसे वापस नहीं किया जा सकता।','序章、ジャイプル、ロンドン、全編の進行をすべて消去しますか？言語と音量の設定は残ります。この操作は取り消せません。'],
  memento:['有些东西，值得亲手修好。','Some things are worth learning to mend.','بعض الأشياء تستحق أن نتعلم إصلاحها.','कुछ चीज़ों को ठीक करना सीखना सार्थक है।','自分の手で直したいものがある。'],
  credit:['《答案之后》· 原创科幻叙事游戏项目 · 剧本、玩法与美术由创作者和 AI 协作制作','After the Answer · An original science-fiction narrative game · Story, design and artwork developed by the creator with AI assistance','بعد الإجابة · مشروع لعبة سرد خيال علمي أصلية · القصة والتصميم والرسوم بتعاون المبدع والذكاء الاصطناعي','उत्तर के बाद · मौलिक विज्ञान-कथा खेल परियोजना · कहानी, डिज़ाइन और चित्र रचनाकार तथा AI के सहयोग से','答えのあとで · オリジナル SF ナラティブゲーム · 脚本・設計・美術は制作者と AI の協働'],
  scope:['全篇可通关的开发版本。美术与声音仍在打磨，非中文文本尚未经母语审校。','A development build playable from beginning to end. Art and sound are still being refined; non-Chinese text has not been reviewed by native speakers.','نسخة تطوير قابلة للعب حتى النهاية. الرسوم والصوت قيد التحسين، ولم تُراجع النصوص غير الصينية من ناطقين أصليين.','शुरू से अंत तक खेलने योग्य विकास संस्करण। चित्र और ध्वनि अभी सुधर रहे हैं; गैर-चीनी पाठ का मातृभाषियों ने परीक्षण नहीं किया है।','最後まで遊べる開発版です。美術・音は調整中で、中国語以外は母語話者による確認前の草稿です。'],
  offline:['离线运行：本地文件的存档由浏览器管理，不会自动带入网页版本。建议使用同一文件夹和浏览器，并定期导出备份。','Offline mode: local-file saves are managed by your browser and do not automatically transfer to the web version. Keep the same folder and browser, and export backups regularly.','وضع بلا اتصال: يدير المتصفح حفظ الملفات المحلية، ولا ينتقل تلقائيًا لنسخة الويب. استخدم المجلد والمتصفح نفسيهما وصدّر نسخًا احتياطية.','ऑफ़लाइन: स्थानीय फ़ाइलों की सेव ब्राउज़र सँभालता है; वे वेब संस्करण में अपने आप नहीं आतीं। वही फ़ोल्डर और ब्राउज़र रखें, और बैकअप निर्यात करें।','オフライン：ローカルファイルのセーブはブラウザーが管理し、Web 版へ自動で移りません。同じフォルダーとブラウザーを使い、定期的に書き出してください。']
 };
 Object.assign(words,{"jaipurProgress": ["第三章 · 太阳不会等人。回到刻尺、木架和已经写下的观察。", "Chapter 3 · The sun will not wait. Return to the scale, frame and recorded observations.", "الفصل 3 · الشمس لن تنتظر. عد إلى المقياس والإطار والملاحظات المسجلة.", "अध्याय 3 · सूरज इंतज़ार नहीं करता। पैमाने, ढाँचे और दर्ज अवलोकनों पर लौटें।", "第三章 · 太陽は待たない。目盛と木枠、残した観察へ戻る。"], "londonProgress": ["第四章 · 那句还没印出来的话。继续搬机、核对与印刷的记录。", "Chapter 4 · The words not yet printed. Resume moving, checking and printing.", "الفصل 4 · الكلمات التي لم تُطبع بعد. تابع النقل والمطابقة والطباعة.", "अध्याय 4 · वे शब्द जो अभी छपे नहीं। ढुलाई, जाँच और छपाई जारी रखें।", "第四章 · まだ印刷されていない言葉。運搬、照合、印刷を続ける。"], "londonNext": ["第三章的记录已经留下。下一站是伦敦的印刷间。", "Chapter three is recorded. The London print shop is next.", "حُفظ سجل الفصل الثالث. المحطة التالية مطبعة لندن.", "तीसरे अध्याय का रिकॉर्ड सुरक्षित है। अगला पड़ाव लंदन का छापेखाना है।", "第三章の記録は残っている。次はロンドンの印刷所へ。"], "jaipurCompleted": ["回看第三章 · 斋浦尔现场本", "Revisit chapter 3 · Jaipur notebook", "راجع الفصل 3 · دفتر جايبور", "अध्याय 3 फिर देखें · जयपुर की कॉपी", "第三章を振り返る · ジャイプルの現場ノート"], "jaipurContinue": ["继续第三章 · 斋浦尔现场本", "Continue chapter 3 · Jaipur notebook", "تابع الفصل 3 · دفتر جايبور", "अध्याय 3 जारी रखें · जयपुर की कॉपी", "第三章の続き · ジャイプルの現場ノート"], "londonCompleted": ["回看第四章 · 伦敦印刷间", "Revisit chapter 4 · London print shop", "راجع الفصل 4 · مطبعة لندن", "अध्याय 4 फिर देखें · लंदन का छापेखाना", "第四章を振り返る · ロンドンの印刷所"], "londonContinue": ["继续第四章 · 伦敦印刷间", "Continue chapter 4 · London print shop", "تابع الفصل 4 · مطبعة لندن", "अध्याय 4 जारी रखें · लंदन का छापेखाना", "第四章の続き · ロンドンの印刷所"], "londonPlayable": ["第四章可玩重构 · 伦敦印刷间", "Play chapter 4 · London print shop", "العب الفصل 4 · مطبعة لندن", "अध्याय 4 खेलें · लंदन का छापेखाना", "第四章を遊ぶ · ロンドンの印刷所"]});
 let opening=null,full=null,jaipur=null,london=null,warning='',locale='zh-Hans';
 try{
  const savedLanguage=localStorage.getItem('answers-afterward.v75.start.language')||localStorage.getItem(F.KEY+'.language')||localStorage.getItem(O.KEY+'.language');
  if(languages.includes(savedLanguage))locale=savedLanguage;
  const openRaw=localStorage.getItem(O.KEY),fullRaw=localStorage.getItem(F.KEY);
  if(openRaw!==null){try{opening=O.restore(openRaw);}catch{warning='badSave';}}
  if(fullRaw!==null){try{full=F.restore(fullRaw,window.FULL_STORY);}catch{warning='badSave';}}
  const jaipurRaw=localStorage.getItem(Jaipur.KEY),londonRaw=localStorage.getItem('answers-afterward.v75.london-play.1');
  if(jaipurRaw!==null){try{jaipur=Jaipur.restore(jaipurRaw);}catch{warning='badSave';}}
  if(londonRaw!==null){try{london=London.restore(londonRaw);}catch{warning='badSave';}}
 }catch{warning='noSave';}
 const requested=new URLSearchParams(location.search).get('lang');if(languages.includes(requested))locale=requested;
 const text=k=>words[k][languages.indexOf(locale)];
 function link(id,path,extra=''){document.getElementById(id).href=path+'?lang='+encodeURIComponent(locale)+(extra?'&'+extra:'');}
 function render(){
  document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=text('title')+' · V7.5';document.getElementById('language').value=locale;
  document.querySelectorAll('[data-word]').forEach(n=>n.textContent=text(n.dataset.word));
  const continued=full?.started,openingDone=opening?.events.includes('jreport'),hasProgress=continued||Boolean(opening?.events.length);
  let destination=continued||openingDone?'full.html':'index.html',extra='';
  if(!continued){
   if(openingDone||(opening?.events.includes('jaipur')&&jaipur?.state.finished))destination='london.html';
   else if(opening?.events.includes('jaipur')){destination='jaipur.html';extra='from=opening';}
  }
  link('continue',destination,extra);link('opening','index.html');link('london','london.html');link('gallery','art.html');link('ending','full.html','credits=1');link('storyplay','jaipur.html');link('arcade','../arcade/index.html');link('workshop','../workshop/index.html');link('rehearsal','rehearsal.html');
  document.getElementById('continue').textContent=text(hasProgress?'continue':'begin');
  document.getElementById('opening').textContent=text(opening?.events.length?'openingSaved':'opening');
  let progress=full?.finished?text('completeProgress'):continued?text('fullProgress').replace('{n}',full.chapter+1).replace('{total}',window.FULL_STORY.chapters.length):openingDone?text('nextProgress'):opening?.events.length?text('openingProgress').replace('{n}',opening.events.length):text('newProgress');
  if(destination==='jaipur.html')progress=text('jaipurProgress');
  if(destination==='london.html')progress=text(london?'londonProgress':'londonNext');
  document.getElementById('storyplay').textContent=jaipur?text(jaipur.state.finished?'jaipurCompleted':'jaipurContinue'):text('storyplay');
  document.getElementById('london').textContent=text(london?(london.ending?'londonCompleted':'londonContinue'):'londonPlayable');
  document.getElementById('progress').textContent=progress;document.getElementById('ending').hidden=!full?.finished;
  const message=document.getElementById('save-warning');message.hidden=!warning;message.textContent=warning?text(warning):'';
  document.getElementById('offline').hidden=location.protocol!=='file:';
  document.getElementById('menu').ariaLabel=text('title');
 }
 document.getElementById('language').onchange=e=>{locale=e.target.value;try{localStorage.setItem('answers-afterward.v75.start.language',locale);}catch{}render();};
 document.getElementById('clear-journey').onclick=()=>{if(!confirm(text('clearConfirm')))return;try{Object.values(window.JourneySave.keys).forEach(key=>localStorage.removeItem(key));location.reload();}catch{warning='noSave';render();}};
 render();
})();
