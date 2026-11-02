/* An inspection and parts-comparison scene. It does not repair a real movement. */
(function(root){'use strict';
let draft=null,disposePerformer=()=>{};
const langs=['zh-Hans','en','ar','hi','ja'];
const words={
 fine:['精细调整 · 也可用方向键与 Q/E','Fine adjustments · or use arrows and Q/E','ضبط دقيق · أو الأسهم وQ/E','बारीक समायोजन · तीर या Q/E भी','微調整 · 矢印キーとQ/Eでも操作'],
 left:['向左转一点','Rotate left a little','أدر قليلًا لليسار','थोड़ा बाएँ घुमाएँ','少し左へ回す'],
 right:['向右转一点','Rotate right a little','أدر قليلًا لليمين','थोड़ा दाएँ घुमाएँ','少し右へ回す'],
 inspect:['先看看它现在的样子','Look at it as it is today','انظر إليها كما هي اليوم','पहले देखें, आज यह कैसी है','まず、今の姿を見る'],
 oil:['放大轴承处','Examine the bearing','افحص المحمل','बेयरिंग पास से देखें','軸受を拡大する'],
 tooth:['放大旧齿轮','Examine the old wheel','افحص الترس القديم','पुराना गियर पास से देखें','古い歯車を拡大する'],
 oilFound:['轴承边缘留着干结的旧油。清理后仍要重新润滑、检查。','Dried oil remains around the bearing. Cleaning must be followed by lubrication and inspection.','بقايا زيت جاف حول المحمل. بعد التنظيف يلزم التزييت والفحص.','बेयरिंग के पास पुराना तेल सूख गया है। सफ़ाई के बाद चिकनाई और जाँच भी चाहिए।','軸受の縁に古い油が固まっている。洗浄後も注油と点検が必要だ。'],
 toothFound:['旧轮有一处齿缘缺损。先比轮廓与齿距；看起来合适，也不等于已经装好。','An edge of one tooth is damaged. Compare outline and spacing; a visual match is not a completed installation.','حافة أحد الأسنان تالفة. قارن الشكل والتباعد؛ التطابق البصري لا يعني اكتمال التركيب.','एक दाँत का किनारा क्षतिग्रस्त है। आकार और दाँतों का अंतर मिलाएँ; दिखने में मेल होना, लग जाना नहीं है।','歯の縁が一か所欠けている。輪郭と歯の間隔を比べよう。見た目が合っても、組み込みはまだだ。'],
 compare:['描图纸上的零件比对','Compare parts on tracing paper','قارن القطع على ورق التتبع','ट्रेसिंग पेपर पर पुर्ज़े मिलाएँ','トレーシングペーパーで部品を比べる'],
 instructions:['选一只候选轮，拖到虚线轮廓上，转到齿缘重合。虚线是旧轮的描图，红点是缺损处。','Choose a wheel, drag it onto the dashed outline and rotate it to match the teeth. The tracing is the old wheel; red marks the damage.','اختر ترسًا واسحبه إلى المحيط المتقطع وأدره لتطابق الأسنان. الرسم للترس القديم، والأحمر موضع التلف.','गियर चुनें, बिंदीदार रेखा पर खींचें और दाँत मिलने तक घुमाएँ। रेखा पुराने गियर की है; लाल निशान क्षति है।','候補を選び、破線の輪郭に重ねて歯が合うように回す。破線は古い歯車の写し、赤い印は欠損箇所。'],
 schematic:['放大的比对示意；实际适配还需检查轴径、厚度与装配。','Enlarged comparison diagram. Shaft size, thickness and assembly still need checking.','رسم مقارنة مكبّر. يبقى فحص قطر المحور والسماكة والتركيب.','यह बड़ा किया हुआ तुलना-चित्र है। शाफ़्ट का आकार, मोटाई और फ़िटिंग भी जाँचनी है।','拡大した比較用の模式図。軸径、厚み、組み込みの確認は別途必要。'],
 part:['候选轮','Candidate','الترس المرشح','विकल्प','候補'],
 x:['左右移动','Horizontal position','الموضع الأفقي','दाएँ-बाएँ स्थिति','左右の位置'],
 y:['上下移动','Vertical position','الموضع العمودي','ऊपर-नीचे स्थिति','上下の位置'],
 angle:['转动描图','Rotation','الدوران','घुमाव','回転'],
 board:['零件比对台。拖动移动；方向键微调位置；Q、E转动。也可使用下方滑块。','Parts comparison. Drag to move; arrow keys adjust position; Q and E rotate. Sliders are also available below.','مقارنة القطع. اسحب للتحريك، والأسهم لضبط الموضع، وQ وE للدوران. تتوفر منزلقات أسفلها.','पुर्ज़े मिलाएँ। खींचकर चलाएँ; तीर कुंजियों से स्थिति, Q और E से घुमाव बदलें। नीचे स्लाइडर भी हैं।','部品の比較。ドラッグで移動、矢印キーで微調整、Q・Eで回転。下のスライダーでも操作できます。'],
 test:['核对这次重合','Check this fit','تحقق من التطابق','यह मेल जाँचें','重なりを確かめる'],
 empty:['先从纸袋里选一只候选轮。','Choose a candidate wheel first.','اختر ترسًا مرشحًا أولًا.','पहले एक गियर चुनें।','まず候補の歯車を選ぼう。'],
 centre:['两个中心还没重合，暂时比不出齿距。','The centres are apart. Align them before comparing the teeth.','المركزان متباعدان. طابقهما قبل مقارنة الأسنان.','दोनों केंद्र नहीं मिले। दाँत मिलाने से पहले केंद्र मिलाएँ।','中心がずれている。歯の間隔を比べる前に中心を合わせよう。'],
 teeth:['外圈差不多大，齿距却不同。不是转一转就能补上的差别。','The outer size is similar, but the teeth are spaced differently. Turning it cannot fix that.','الحجم الخارجي متقارب لكن تباعد الأسنان مختلف. لن يصلحه الدوران.','बाहरी आकार लगभग बराबर है, पर दाँतों का अंतर अलग है। घुमाने से यह नहीं बदलेगा।','外径は近いが、歯の間隔が違う。回すだけでは合わない。'],
 size:['中心重合了，外缘仍然小一圈。','The centres match, but the outer edge is too small.','تطابق المركزان لكن المحيط أصغر.','केंद्र मिल गए, लेकिन बाहरी घेरा छोटा है।','中心は合ったが、外周が一回り小さい。'],
 turn:['轮廓大小吻合。再转一点，让齿尖与虚线重合。','The outline is the right size. Rotate a little to align the teeth.','حجم المحيط مناسب. أدر قليلًا لتطابق الأسنان مع الخطوط.','आकार सही है। दाँतों को रेखा से मिलाने के लिए थोड़ा घुमाएँ।','輪郭の大きさは合う。歯先が破線と重なるまで、もう少し回そう。'],
 match:['轮廓与齿距吻合。记作待检查的候选件；尚未装回，也没有检验走时。','Outline and tooth spacing match. Keep it as a candidate for inspection; it is not installed or tested for timekeeping.','تطابق الشكل وتباعد الأسنان. احتفظ به مرشحًا للفحص؛ لم يُركّب ولم تُختبر دقة الساعة.','आकार और दाँतों का अंतर मिले। इसे आगे जाँचने का विकल्प रखें; अभी लगाया नहीं, समय की जाँच भी नहीं हुई।','輪郭と歯の間隔が合った。候補として検査へ。まだ組み込みも歩度の確認もしていない。'],
 bag:['把旧轮装回杏的纸袋','Return the old wheel to Xing’s bag','أعد الترس القديم إلى كيس شينغ','पुराना गियर शिंग की थैली में रखें','古い歯車をシンの紙袋に戻す'],
 bagged:['旧件收好，和候选件分开放着。','The old part is kept separately from the candidate.','حُفظت القطعة القديمة منفصلة عن المرشحة.','पुराना पुर्ज़ा विकल्प से अलग रखा है।','古い部品は候補と分けて保管した。'],
 order:['写下检查结果与待办','Write findings and remaining work','اكتب النتائج والعمل المتبقي','नतीजे और बाकी काम लिखें','点検結果と残る作業を書く'],
 need:['先检查轴承和旧轮，再核对候选件，并收好旧件。','Inspect the bearing and old wheel, compare a candidate and put the old part away first.','افحص المحمل والترس القديم وقارن المرشح واحفظ القطعة القديمة أولًا.','पहले बेयरिंग और पुराना गियर जाँचें, विकल्प मिलाएँ और पुराना पुर्ज़ा रखें।','軸受と古い歯車を点検し、候補を比べ、旧部品を保管してから。'],
 ticket:['维修单：清理旧油；复核候选件尺寸与装配；重新润滑；校时与复测。费用和交期，与杏另行确认。','Repair order: clean old oil; verify candidate dimensions and assembly; lubricate; regulate and retest. Agree the price and collection date with Xing.','أمر الإصلاح: تنظيف الزيت القديم، وفحص أبعاد القطعة وتركيبها، والتزييت، وضبط الوقت وإعادة الاختبار. يُتفق على الكلفة والموعد مع شينغ.','मरम्मत पर्ची: पुराना तेल साफ़ करना; विकल्प के माप और फ़िटिंग जाँचना; चिकनाई; समय मिलाना और दोबारा जाँचना। कीमत और तारीख़ शिंग से तय करनी हैं।','修理票：古い油の洗浄、候補部品の寸法と組み込みの検査、注油、歩度調整と再検査。料金と受取日はシンと相談する。'],
 untouched:['指针仍停在 9:17。这里只完成了检查。','The hands still read 9:17. Only the inspection is complete.','ما زالت العقارب عند 9:17. اكتمل الفحص فقط.','सुइयाँ अब भी 9:17 पर हैं। केवल जाँच पूरी हुई है।','針はまだ9:17のまま。終わったのは点検だけだ。'],
 trial:['比对记录','Comparison record','سجل المقارنة','तुलना रिकॉर्ड','比較の記録'],
 draft:['检查过程保留到本页关闭；确认记入故事后，章节进度会自动保存。','This inspection draft lasts until the page closes. Confirming it in the story saves chapter progress.','تبقى مسودة الفحص حتى إغلاق الصفحة. تأكيدها في القصة يحفظ تقدم الفصل.','यह जाँच मसौदा पृष्ठ बंद होने तक रहेगा। कहानी में पुष्टि करने पर अध्याय की प्रगति सेव होगी।','点検の途中経過はページを閉じるまで保持。物語に記録すると章の進行状況が保存されます。']
};
function gear(teeth,r){const points=[];for(let i=0;i<teeth*4;i++){const a=i*Math.PI*2/(teeth*4),radius=i%4<2?r:r*.84;points.push((Math.cos(a)*radius).toFixed(2)+','+(Math.sin(a)*radius).toFixed(2));}return points.join(' ');}
function mount({rows,answer,locale,onChange=()=>{}}){
 disposePerformer();
 const t=k=>words[k][Math.max(0,langs.indexOf(locale))],el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;},sv=(tag,attrs={})=>{const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;};
 Object.assign(answer,draft?JSON.parse(JSON.stringify(draft)):{observed:[],part:'',x:28,y:18,angle:13,tested:null,trials:[],bagged:false,estimate:false,view:'whole'});
 const shell=el('section',undefined,'watch-bench'),inspect=el('div',undefined,'watch-inspection'),pic=sv('svg',{viewBox:'-80 -80 160 160','aria-hidden':'true'});pic.classList.add('watch-loupe');const visual=el('div',undefined,'watch-visual'),performer=el('div',undefined,'watch-performer'),still=el('img'),drawing=el('div',undefined,'watch-drawing');performer.setAttribute('aria-hidden','true');still.src='assets/vika.webp';still.alt='';drawing.hidden=true;drawing.dataset.frame='0';performer.append(still,drawing);visual.append(performer,pic);const controller=root.ActorSprite?.mount({element:drawing,fallback:still,src:'assets/vika-watch-v1.webp'});const stop=()=>controller?.stop();document.addEventListener('close',stop,true);disposePerformer=()=>{document.removeEventListener('close',stop,true);controller?.destroy();};const details=el('div');details.append(el('h3',t('inspect')));const looks=el('div',undefined,'watch-tools'),notes=el('ul',undefined,'watch-observations'),seenButtons={};
 for(const id of ['oil','tooth']){const b=el('button',t(id));b.type='button';b.dataset.watchInspect=id;b.onclick=()=>{if(answer.estimate)return;const first=!answer.observed.includes(id);if(first)answer.observed.push(id);answer.view=id;status.textContent=t(id+'Found');draw();if(first&&!document.documentElement.classList.contains('scene-motion-off'))controller?.play();};seenButtons[id]=b;looks.append(b);}details.append(looks,notes);inspect.append(visual,details);
 const section=el('section'),parts=el('div',undefined,'watch-parts'),partButtons={};section.append(el('h3',t('compare')),el('p',t('instructions')));
 const specs={A:[18,64],B:[12,64],C:[12,49]};for(const [id,[teeth,r]]of Object.entries(specs)){const b=el('button');b.type='button';b.dataset.watchPart=id;const icon=sv('svg',{viewBox:'-76 -76 152 152','aria-hidden':'true'});icon.append(sv('polygon',{points:gear(teeth,r)}),sv('circle',{r:9,fill:'#27231f'}));b.append(icon,el('b',id),el('span',t('part')));b.onclick=()=>{if(answer.estimate)return;answer.part=id;answer.tested=null;answer.x=28;answer.y=18;answer.angle=13;status.textContent=t('instructions');draw();};parts.append(b);partButtons[id]=b;}
 const paper=el('div',undefined,'watch-paper'),svg=sv('svg',{viewBox:'0 0 400 260',tabindex:0,role:'img','aria-label':t('board')}),guide=sv('g',{transform:'translate(200 130)'}),moving=sv('g');svg.id='watch-fit';for(const [x1,y1,x2,y2]of [[30,130,370,130],[200,20,200,240]])svg.append(sv('line',{x1,y1,x2,y2}));guide.append(sv('polygon',{points:gear(12,64),class:'ghost'}),sv('circle',{r:9,class:'ghost'}),sv('circle',{cx:61,cy:0,r:4,class:'chip'}));const polygon=sv('polygon',{class:'replacement'});moving.append(polygon,sv('circle',{r:9,class:'hub'}));svg.append(guide,moving);paper.append(svg,el('p',t('schematic'),'watch-caption'));
 const controls=el('div',undefined,'watch-adjust'),inputs={},outputs={};for(const [id,min,max]of [['x',-70,70],['y',-50,50],['angle',0,90]]){const label=el('label',t(id)),input=el('input'),out=el('output');input.id='watch-'+id;input.type='range';input.min=min;input.max=max;input.step=1;label.htmlFor=input.id;input.oninput=()=>{if(answer.estimate)return;answer[id]=Number(input.value);answer.tested=null;draw();};label.append(out,input);controls.append(label);inputs[id]=input;outputs[id]=out;}
 const fine=el('details');fine.id='watch-fine';fine.append(el('summary',t('fine')),controls);
 const turners=el('div',undefined,'watch-tools');const turnButtons=[];for(const [step,key]of [[-1,'left'],[1,'right']]){const b=el('button',t(key));b.type='button';b.dataset.watchTurn=String(step);b.onclick=()=>{if(!answer.part||answer.estimate)return;answer.angle=(answer.angle+step+90)%90;answer.tested=null;draw();};turnButtons.push(b);turners.append(b);}
 const status=el('p',t('empty'),'notice');status.id='watch-status';status.setAttribute('role','status');const log=el('ol');log.id='watch-trials';const test=el('button',t('test')),bag=el('button',t('bag')),order=el('button',t('order'));test.id='watch-test';bag.id='watch-bag';order.id='watch-order';for(const b of [test,bag,order])b.type='button';
 const actions=el('div',undefined,'watch-tools'),card=el('div',undefined,'watch-card');card.id='watch-card';actions.append(test,bag,order);const history=el('details'),historyLabel=el('summary',t('trial'));history.append(historyLabel,log);section.append(parts,paper,turners,fine,status,actions,history,card,el('p',t('draft'),'watch-note'));shell.append(inspect,section);rows.append(shell);
 let soundPose=null;const foley=kind=>window.dispatchEvent(new CustomEvent('v75:foley',{detail:{kind}}));
 function keep(){draft=JSON.parse(JSON.stringify(answer));onChange();}
 function draw(){
  const pose=[answer.part,answer.x,answer.y,answer.angle].join(',');if(soundPose!==null&&pose!==soundPose&&answer.part)foley('metal');soundPose=pose;
  pic.replaceChildren();pic.append(sv('circle',{r:76,fill:'#d3b77f',stroke:'#6d4b2a','stroke-width':5}));
  if(answer.view==='tooth'){
   pic.append(sv('polygon',{points:gear(12,62),fill:'#a17d3f',stroke:'#674a2d','stroke-width':2}),sv('circle',{r:12,fill:'#252522',stroke:'#dccb9d','stroke-width':3}),sv('path',{d:'M54 -3L68 -6L66 10L54 7Z',fill:'#d3b77f'}),sv('path',{d:'M54 -3L54 7',stroke:'#72422b','stroke-width':3}));
  }else if(answer.view==='oil'){
   pic.append(sv('circle',{r:40,fill:'#b08b50',stroke:'#684324','stroke-width':2}),sv('path',{d:'M-35 -18Q-20 -45 17 -33L33 -12L26 16L7 38L-23 28L-39 7Z',fill:'#59402d',opacity:.8}),sv('circle',{r:19,fill:'#252522',stroke:'#bca27a','stroke-width':4}),sv('path',{d:'M-29 -20l7 6m36 -12l-3 9m17 27l-8 -4m-32 22l5 -8',stroke:'#d3b77f','stroke-width':2}));
  }
  if(answer.view==='whole'){
   for(const [x,y,r,teeth]of [[-23,-20,31,12],[30,10,27,12],[-16,35,20,10]]){const g=sv('g',{transform:`translate(${x} ${y})`});g.append(sv('polygon',{points:gear(teeth,r),fill:'#a58448',stroke:'#6d4d2e','stroke-width':2}),sv('circle',{r:5,fill:'#40352b'}));pic.append(g);}
   pic.append(sv('path',{d:'M-58 -43L-48 -54L48 32L40 46Z',fill:'#b39b69',stroke:'#665238','stroke-width':2}));
  }
  notes.replaceChildren();for(const id of answer.observed)notes.append(el('li',t(id+'Found')));for(const [id,b]of Object.entries(seenButtons)){b.dataset.seen=String(answer.observed.includes(id));b.disabled=answer.estimate;}
  for(const [id,b]of Object.entries(partButtons)){b.setAttribute('aria-pressed',String(answer.part===id));b.disabled=answer.estimate;}
  moving.style.display=answer.part?'':'none';if(answer.part){polygon.setAttribute('points',gear(...specs[answer.part]));moving.setAttribute('transform',`translate(${200+answer.x} ${130+answer.y}) rotate(${answer.angle})`);}
  for(const id of Object.keys(inputs)){inputs[id].value=answer[id];inputs[id].disabled=!answer.part||answer.estimate;outputs[id].textContent=String(answer[id])+(id==='angle'?'°':'');}
  for(const b of turnButtons)b.disabled=!answer.part||answer.estimate;historyLabel.textContent=t('trial')+' · '+answer.trials.length;
  test.disabled=!answer.part||answer.estimate;bag.disabled=!answer.observed.includes('tooth')||answer.bagged||answer.estimate;bag.textContent=t(answer.bagged?'bagged':'bag');order.disabled=answer.estimate;
  paper.classList.toggle('match',!!answer.tested&&FullGame.watchFit(answer.tested)==='match');log.replaceChildren();for(const tr of answer.trials)log.append(el('li',tr.part+' · '+t(tr.result)));card.classList.toggle('complete',answer.estimate);card.replaceChildren();if(answer.estimate)card.append(el('p',t('ticket')),el('p',t('untouched')));svg.setAttribute('tabindex',answer.estimate?'-1':'0');keep();
 }
 test.onclick=()=>{if(answer.estimate)return;const result=FullGame.watchFit(answer);answer.tested={part:answer.part,x:answer.x,y:answer.y,angle:answer.angle};answer.trials.push({...answer.tested,result});answer.trials=answer.trials.slice(-12);status.textContent=t(result);draw();};
 bag.onclick=()=>{if(!answer.observed.includes('tooth')||answer.estimate)return;answer.bagged=true;foley('paper');status.textContent=t('bagged');draw();};
 order.onclick=()=>{if(!FullGame.solve({type:'watch'},{...answer,estimate:true})){status.textContent=t('need');return;}answer.estimate=true;stop();status.textContent=t('untouched');draw();window.dispatchEvent(new CustomEvent('v75:foley',{detail:{kind:'write'}}));};
 let drag=null;
 const point=e=>new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());
 svg.onpointerdown=e=>{if(!answer.part||answer.estimate||e.button!==0)return;const p=point(e);drag={id:e.pointerId,px:p.x,py:p.y,x:answer.x,y:answer.y};svg.setPointerCapture(e.pointerId);svg.focus({preventScroll:true});e.preventDefault();};
 svg.onpointermove=e=>{if(!drag||e.pointerId!==drag.id||answer.estimate)return;const p=point(e);answer.x=Math.max(-70,Math.min(70,Math.round(drag.x+p.x-drag.px)));answer.y=Math.max(-50,Math.min(50,Math.round(drag.y+p.y-drag.py)));answer.tested=null;draw();};
 const end=()=>{drag=null;};svg.onpointerup=end;svg.onpointercancel=end;svg.onlostpointercapture=end;
 svg.onkeydown=e=>{if(!answer.part||answer.estimate)return;const changes={ArrowLeft:['x',-1],ArrowRight:['x',1],ArrowUp:['y',-1],ArrowDown:['y',1],q:['angle',-1],e:['angle',1]};const c=changes[e.key];if(!c)return;e.preventDefault();answer[c[0]]=Math.max(Number(inputs[c[0]].min),Math.min(Number(inputs[c[0]].max),answer[c[0]]+c[1]));answer.tested=null;draw();};draw();
}
root.WatchBench={mount,reset(){disposePerformer();disposePerformer=()=>{};draft=null;}};
})(window);
