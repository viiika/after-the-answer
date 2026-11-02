'use strict';
const languages=['zh-Hans','en','ar','hi','ja'], $=s=>document.querySelector(s);
const words={
back:['返回游戏','Back to game','العودة إلى اللعبة','खेल पर लौटें','ゲームへ戻る'],
title:['答案之后 · 场景画集','Answers Afterward · Scene Gallery','بعد الإجابة · معرض المشاهد','उत्तर के बाद · दृश्य संग्रह','答えのあとで · 背景画集'],
eyebrow:['V7.5 · 场景与道具','V7.5 · SCENES & OBJECTS','V7.5 · مشاهد وأشياء','V7.5 · दृश्य और वस्तुएँ','V7.5 · 場面と道具'],
notice:['包含后期地点；可查看背景、试放角色与预览轻微镜头运动。这是制作中的美术，不代表这些场景已全部完成动画。','Includes later locations. View backgrounds, place a character and preview gentle camera motion. These are production assets, not completed character animations.','يتضمن أماكن لاحقة. اعرض الخلفيات وضع شخصية وعاين حركة كاميرا خفيفة. هذه أصول قيد الإنتاج وليست رسوماً متحركة مكتملة للشخصيات.','आगे के स्थान भी शामिल हैं। पृष्ठभूमि देखें, पात्र रखें और हल्की कैमरा गति देखें। ये निर्माणाधीन चित्र हैं, पूर्ण पात्र-एनिमेशन नहीं।','後半の場所も含みます。背景、人物の配置、緩やかなカメラ移動を確認できます。制作途中の素材で、人物の完成アニメーションではありません。'],
'language-label':['语言','Language','اللغة','भाषा','言語'],
prev:['上一场','Previous','السابق','पिछला','前の場面'],
next:['下一场','Next','التالي','अगला','次の場面'],
motion:['开启轻微动态','Enable gentle motion','تشغيل حركة خفيفة','हल्की गति चालू करें','緩やかな動きを開始'],
pause:['停止动态','Stop motion','إيقاف الحركة','गति रोकें','動きを停止'],
actor:['角色试放：无／维卡／诺伊','Place: none / Vika / Noyi','الشخصية: لا أحد / فيكا / نوي','पात्र: कोई नहीं / विका / नोई','人物配置：なし／ヴィカ／ノイ'],
original:['打开原图','Open image','افتح الصورة','चित्र खोलें','画像を開く'],
'motion-note':['动态为可关闭的镜头呼吸和光影试验；系统启用减少动态时保持静止。角色轮廓与场景比例仍在校正。','Motion is an optional camera and light study. Reduced-motion preference keeps it still. Character edges and scene scale are still being refined.','الحركة تجربة اختيارية للكاميرا والإضاءة. يظل العرض ساكناً عند تفعيل تقليل الحركة. حدود الشخصيات وأحجامها لا تزال قيد التحسين.','गति वैकल्पिक कैमरा और रोशनी का प्रयोग है। कम गति की सेटिंग में चित्र स्थिर रहेगा। पात्रों के किनारे और पैमाने अभी सुधारे जा रहे हैं।','動きは任意のカメラと光の試作です。動きを減らす設定では静止します。人物の輪郭と縮尺は調整中です。'],
'props-title':['会被记住的小东西','Small things that remain','أشياء صغيرة تبقى','याद रह जाने वाली छोटी चीज़ें','心に残る小さなもの'],
watch:['萨米的机械表','Sami’s watch','ساعة سامي','सामी की घड़ी','サミの時計'],
notebook:['留下失败过程的旧本子','A notebook that keeps failed attempts','دفتر يحتفظ بالمحاولات الفاشلة','असफल कोशिशों वाली पुरानी कॉपी','失敗した過程を残すノート'],
socks:['母亲织的两只袜子','Mother’s uneven socks','جوربا الأم غير المتساويين','माँ के अलग लंबाई वाले मोज़े','母が編んだ長さの違う靴下'],
error:['图片未能载入，请刷新。','Image could not load. Please reload.','تعذر تحميل الصورة. أعد التحميل.','चित्र लोड नहीं हुआ। फिर लोड करें।','画像を読み込めません。再読み込みしてください。']
};
const scenes=[
['jaipur-observatory-v1',['斋浦尔 · 太阳不会等人','Jaipur · The sun will not wait','جايبور · الشمس لن تنتظر','जयपुर · सूरज इंतज़ार नहीं करता','ジャイプル · 太陽は待たない']],
['barber-interior-v1',['末城 · 理发店里的地图','Last city · The barber’s map','المدينة الأخيرة · خريطة الحلاق','अंतिम नगर · नाई का नक्शा','最後の街 · 理髪師の地図']],
['london',['伦敦 · 印刷间','London · Print shop','لندن · المطبعة','लंदन · छापेखाना','ロンドン · 印刷所']],
['classroom',['时序局 · 第三根管子','The Agency · The third pipe','الهيئة · الأنبوب الثالث','ब्यूरो · तीसरा पाइप','時序局 · 三本目の管']],
['aftermath-matched',['教室 · 事故之后','Classroom · Afterward','الصف · بعد الحادث','कक्षा · दुर्घटना के बाद','教室 · 事故のあと']],
['hidden-home',['隐藏纪元 · 母亲的家','Hidden era · Mother’s home','العصر الخفي · بيت الأم','छिपा युग · माँ का घर','隠された時代 · 母の家']],
['return-museum',['返航博物馆','Return museum','متحف العودة','वापसी संग्रहालय','帰還博物館']],
['talo-workshop',['塔洛旧工坊','Talo workshop','ورشة تالو','तालो कार्यशाला','タロの工房']],
['empty-city',['末城 · 仍然亮着的灯','Last city · Lights still on','المدينة الأخيرة · أضواء باقية','आख़िरी शहर · अब भी जलती रोशनी','最後の街 · 灯りはまだついている']],
['hearing',['时序局 · 听证室','The Agency · Hearing room','الهيئة · قاعة الجلسات','ब्यूरो · सुनवाई कक्ष','時序局 · 公聴室']],
['departure',['最后一班 · 撤离大厅','Last departure · Concourse','الرحيل الأخير · الردهة','आख़िरी प्रस्थान · हॉल','最終便 · 出発ロビー']],
['rio-corrected',['2018 · 里约','2018 · Rio','2018 · ريو','2018 · रियो','2018 · リオ']],
['sydney',['2018 · 悉尼达令港','2018 · Darling Harbour','2018 · دارلينغ هاربور','2018 · डार्लिंग हार्बर','2018 · ダーリングハーバー']],
['mars-home',['2018 · 火星的家','2018 · Home on Mars','2018 · البيت على المريخ','2018 · मंगल का घर','2018 · 火星の家']]
];
let language='zh-Hans',index=0,actor=0,moving=false;
const t=k=>words[k][languages.indexOf(language)], title=()=>scenes[index][1][languages.indexOf(language)];
const query=new URLSearchParams(location.search);if(languages.includes(query.get('lang')))language=query.get('lang');
const requested=scenes.findIndex(s=>s[0]===location.hash.slice(1));if(requested>=0)index=requested;
function render(){
 document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr';document.title=t('title');$('#language').value=language;
 for(const k of ['back','title','eyebrow','notice','language-label','prev','next','actor','original','motion-note','props-title'])$('#'+k).textContent=t(k);
 $('#scene-title').textContent=title();$('#caption').textContent=title();$('#count').textContent=(index+1)+' / '+scenes.length;
 $('#background').src='assets/'+scenes[index][0]+'.webp';$('#background').alt=title();$('#original').href=$('#background').getAttribute('src');
 $('#motion').textContent=t(moving?'pause':'motion');$('#motion').setAttribute('aria-pressed',String(moving));$('#stage').classList.toggle('moving',moving);
 $('#character').hidden=actor===0;if(actor)$('#character').src='assets/'+(actor===1?'vika':'noyi')+'.webp';$('#actor').setAttribute('aria-pressed',String(actor>0));
 $('#prev').disabled=index===0;$('#next').disabled=index===scenes.length-1;$('#scenes').replaceChildren();
 scenes.forEach((s,i)=>{const b=document.createElement('button');b.textContent=s[1][languages.indexOf(language)];b.setAttribute('aria-current',String(i===index));b.onclick=()=>{index=i;render();$('#scene-title').scrollIntoView({block:'nearest'});};$('#scenes').append(b);});
 $('#props').replaceChildren();for(const name of ['watch','notebook','socks']){const f=document.createElement('figure'),a=document.createElement('a'),im=document.createElement('img'),c=document.createElement('figcaption');a.href='assets/'+name+'.webp';a.target='_blank';a.rel='noopener';im.src=a.href;im.alt=t(name);im.loading='lazy';c.textContent=t(name);a.append(im);f.append(a,c);$('#props').append(f);}
 $('#back').href='index.html?lang='+language;
 ActionGallery.language(language);
 $('#load-error').textContent='';
}
$('#background').onerror=()=>$('#load-error').textContent=t('error');
$('#language').onchange=e=>{language=e.target.value;render();};$('#prev').onclick=()=>{index--;render();};$('#next').onclick=()=>{index++;render();};
$('#motion').onclick=()=>{moving=!moving;render();};$('#actor').onclick=()=>{actor=(actor+1)%3;render();};render();

