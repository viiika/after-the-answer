/* A fictional handover dossier: identifying a gap does not fund it. */
(function(root){'use strict';
let draft=null;const langs=['zh-Hans','en','ar','hi','ja'];
const words={
 title:['把承诺放回它能证明的地方','Put each promise beside what it proves','ضع كل تعهّد بجانب ما يثبته','हर वादे को उसके प्रमाण के पास रखें','約束を、それが証明できる場所へ'],
 hands:['翻看四张纸，拖到对应栏；也可以先选纸，再点栏目。检查三年经费，在没有落实的年份留记号。','Read the four papers and drag them into the relevant slots, or select a paper and then a slot. Check the three funding years and mark the unsecured ones.','اقرأ الأوراق الأربع واسحبها إلى الخانات المناسبة، أو اختر ورقة ثم خانة. افحص سنوات التمويل الثلاث وعلّم السنوات غير المضمونة.','चारों कागज़ पढ़कर सही खाने में खींचें, या पहले कागज़ और फिर खाना चुनें। तीन वर्षों की निधि जाँचें और अपुष्ट वर्षों पर निशान लगाएँ।','四枚を読んで該当欄へドラッグ。紙を選んで欄を押しても置けます。三年分の資金を調べ、未確保の年に印を。'],
 receipt:['药房接收回执','Pharmacy receipt of acceptance','إقرار قبول الصيدلية','फ़ार्मेसी की स्वीकृति रसीद','薬局の受入確認書'],
 receiptBody:['药房已签收接管清单，确认可以接收这批药品。末行注明：接收不含替患者支付药费的承诺。','The pharmacy has signed the transfer list and can receive this medicine. The last line excludes any commitment to pay patients’ costs.','وقّعت الصيدلية قائمة التسليم وأكدت قدرتها على استلام الدواء. يستثني السطر الأخير أي تعهّد بدفع تكاليف المرضى.','फ़ार्मेसी ने हस्तांतरण सूची स्वीकार की है और दवा ले सकती है। अंतिम पंक्ति में स्पष्ट है: रोगियों का खर्च चुकाने का वादा शामिल नहीं।','薬局は引継書に署名し、薬の受入を確認した。末尾に、患者の薬代を負担する約束は含まないとある。'],
 charter:['信托责任书','Trust responsibility agreement','وثيقة مسؤولية الصندوق','न्यास की ज़िम्मेदारी का समझौता','基金の責任分担書'],
 charterBody:['信托接受管理供药衔接的责任，有具名联系人。它是负责办事的机构；责任书本身不是到账凭证。','The trust accepts responsibility for coordinating supply and names a contact. This establishes who must act; it is not a receipt for money.','يقبل الصندوق مسؤولية تنسيق الإمداد ويسمّي جهة اتصال. تحدد الوثيقة المسؤول عن العمل؛ وليست إيصالًا بوصول المال.','न्यास आपूर्ति के समन्वय की ज़िम्मेदारी लेता है और संपर्क व्यक्ति का नाम देता है। इससे ज़िम्मेदार संस्था तय होती है; यह पैसे आने की रसीद नहीं।','基金は供給の引継ぎを担当し、連絡先を明記している。誰が動くかを定める書類であり、入金証明ではない。'],
 grant:['第 1 年拨款凭据','Year 1 funding confirmation','إثبات تمويل السنة الأولى','वर्ष 1 की निधि की पुष्टि','1年目の資金確保書'],
 grantBody:['经办方已确认第一年的供药拨款。日期只覆盖交接后的第 1 年，没有第二年或第三年的续拨条款。','Funding for the first year is confirmed. The dates cover only year 1 after handover; no renewal for years 2 or 3 is included.','تأكد تمويل السنة الأولى. تغطي التواريخ السنة الأولى بعد التسليم فقط، ولا تتضمن تجديدًا للسنتين الثانية والثالثة.','पहले वर्ष की निधि की पुष्टि है। तारीख़ें हस्तांतरण के बाद केवल वर्ष 1 तक हैं; वर्ष 2 या 3 के नवीनीकरण का प्रावधान नहीं।','1年目の供給資金は確保済み。記載期間は引継ぎ後の1年目だけで、2・3年目の継続給付は含まれない。'],
 application:['第 2—3 年续拨申请','Years 2–3 renewal application','طلب تجديد للسنتين الثانية والثالثة','वर्ष 2–3 के नवीनीकरण का आवेदन','2〜3年目の継続給付申請'],
 applicationBody:['申请已经递交，收件日期齐全；审批栏和拨款承诺仍空着。文件存在，不等于钱已经有了。','The application was submitted and dated. Approval and funding commitments remain blank. Having a document does not mean having the money.','قُدّم الطلب وسُجّل تاريخ استلامه. خانتا الموافقة والالتزام المالي فارغتان. وجود وثيقة لا يعني وجود المال.','आवेदन जमा हो गया है और प्राप्ति की तारीख़ है। मंज़ूरी और निधि का वादा अभी खाली हैं। कागज़ होने का अर्थ पैसे होना नहीं।','申請は提出され、受付日もある。承認と給付の確約欄は空白。書類があることと、資金があることは違う。'],
 receiver:['送到哪里','Where it will go','إلى أين سيذهب','कहाँ पहुँचेगा','どこへ届けるか'],
 steward:['谁负责接续','Who coordinates supply','من ينسّق الإمداد','आपूर्ति कौन सँभालेगा','誰が引継ぎを担うか'],
 funding:['已落实的经费','Secured funding','التمويل المضمون','पुष्ट निधि','確保済みの資金'],
 pending:['尚待落实的申请','Pending applications','طلبات لم تُعتمد بعد','अभी अपुष्ट आवेदन','未承認の申請'],
 vacant:['把一张纸放在这里','Place a paper here','ضع ورقة هنا','यहाँ एक कागज़ रखें','ここに紙を置く'],
 choose:['先翻看一张纸。','Read a paper first.','اقرأ ورقة أولًا.','पहले एक कागज़ पढ़ें।','まず一枚を読もう。'],
 viewed:['正在查看','Reading','قيد القراءة','पढ़ रहे हैं','閲覧中'],
 signed:['已有确认','Confirmed','مؤكد','पुष्ट','確認済み'],
 requested:['仅为申请','Application only','طلب فقط','केवल आवेदन','申請のみ'],
 time:['交接后的三年','Three years after handover','السنوات الثلاث بعد التسليم','हस्तांतरण के बाद के तीन वर्ष','引継ぎ後の三年間'],
 year1:['第 1 年','Year 1','السنة الأولى','वर्ष 1','1年目'],year2:['第 2 年','Year 2','السنة الثانية','वर्ष 2','2年目'],year3:['第 3 年','Year 3','السنة الثالثة','वर्ष 3','3年目'],
 covered:['拨款有确认','Funding confirmed','التمويل مؤكد','निधि पुष्ट','資金の確認あり'],
 unsecured:['没有拨款承诺','No funding commitment','لا تعهّد بالتمويل','निधि का वादा नहीं','給付の確約なし'],
 inspect:['先核对拨款凭据','Check the funding document','تحقق من وثيقة التمويل','निधि का कागज़ जाँचें','資金の書類を確認'],
 marked:['已标记缺口','Gap marked','عُلّمت الفجوة','कमी चिह्नित','不足に印あり'],
 markHelp:['点年份可标记或撤回。记号是在提醒缺口，不会为它筹到钱。','Select a year to mark or unmark it. A mark identifies a gap; it does not raise money.','اختر سنة لإضافة علامة أو إزالتها. العلامة تكشف فجوة ولا تجمع المال.','वर्ष चुनकर निशान लगाएँ या हटाएँ। निशान कमी दिखाता है; उसके लिए पैसे नहीं जुटाता।','年を押すと印を付けたり外したりできます。印は不足を示すだけで、資金は増えません。'],
 file:['把缺口写进移交单','Record the gap in the handover','سجّل الفجوة في وثيقة التسليم','हस्तांतरण में कमी दर्ज करें','不足を引継書に記す'],
 need:['再核对四张纸能证明的事项，以及哪些年份没有经费承诺。','Check what each paper establishes, and which years lack committed funding.','راجع ما تثبته كل ورقة وأي السنوات بلا تمويل ملتزم به.','जाँचें कि हर कागज़ क्या सिद्ध करता है और किन वर्षों की निधि का वादा नहीं है।','各書類が証明することと、資金の確約がない年を確かめよう。'],
 filed:['此项仍未完成','This item remains open','هذا البند لا يزال مفتوحًا','यह मद अभी अधूरी है','この項目は未完了のまま'],
 ticket:['接收药房已确认，负责机构有具名联系人。第 1 年有拨款，第 2—3 年仍为申请。暂不签“全部落实”；把缺口带回会议，继续谈经费。','The receiving pharmacy and responsible contact are confirmed. Year 1 is funded; years 2–3 remain an application. Do not sign “all secured.” Return the gap to the meeting for funding discussions.','تأكدت الصيدلية المستلمة وجهة الاتصال المسؤولة. السنة الأولى ممولة؛ والسنتان الثانية والثالثة ما زالتا طلبًا. لا توقّع «اكتمل التمويل». أعد الفجوة إلى الاجتماع لمناقشة المال.','दवा लेने वाली फ़ार्मेसी और ज़िम्मेदार संपर्क तय हैं। वर्ष 1 की निधि है; वर्ष 2–3 अभी आवेदन हैं। “सब तय है” पर हस्ताक्षर न करें। कमी बैठक में वापस ले जाएँ और निधि पर बात जारी रखें।','受入薬局と担当連絡先は確認済み。1年目には資金があるが、2〜3年目は申請の段階。「すべて確保済み」とは署名せず、会議に持ち帰って資金を話し合う。'],
 note:['尚未落实的事项可以带回会议继续谈。操作草稿仅保留在本页；确认记入故事后保存节点进度。','Outstanding items can return to the meeting. This draft lasts only on this page; confirm it in the story to save progress.','يمكن إعادة البنود المعلّقة إلى الاجتماع. تبقى المسودة في هذه الصفحة فقط؛ أكّدها في القصة لحفظ التقدم.','अधूरी मदें बैठक में वापस जा सकती हैं। मसौदा इसी पृष्ठ पर रहता है; कहानी में पुष्टि से प्रगति सेव होगी।','未完了の項目は会議に持ち帰れます。途中経過はこのページ内だけに残り、物語への記録で進行状況を保存します。']
};
const docs=[['receipt','receiver'],['charter','steward'],['grant','funding'],['application','pending']],slots=docs.map(d=>d[1]);
function mount({rows,answer,locale,onChange=()=>{}}){
 const t=k=>words[k][Math.max(0,langs.indexOf(locale))],el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
 Object.assign(answer,draft?JSON.parse(JSON.stringify(draft)):{read:[],placed:{},gaps:[],filed:false});let selected=null,drag=null,swallowUntil=0;
 const shell=el('section',undefined,'handover-table'),papers=el('div',undefined,'handover-papers'),viewer=el('section',undefined,'handover-viewer'),heading=el('h4',t('choose')),body=el('p'),mark=el('span','','handover-mark'),board=el('div',undefined,'handover-board'),timeline=el('div',undefined,'handover-timeline'),status=el('p','','notice'),ticket=el('section',undefined,'handover-ticket'),file=el('button',t('file'));
 viewer.append(mark,heading,body);viewer.id='handover-viewer';viewer.setAttribute('aria-live','polite');status.id='handover-status';status.setAttribute('role','status');file.id='handover-file';file.type='button';ticket.id='handover-ticket';
 const paperButtons={},slotButtons={},yearButtons={};
 const foley=kind=>window.dispatchEvent(new CustomEvent('v75:foley',{detail:{kind}}));
 function locked(){return answer.filed||rows.closest('.puzzle')?.querySelector('[data-action=check]')?.disabled===true;}
 function select(id){if(locked())return;selected=id;if(!answer.read.includes(id))answer.read.push(id);heading.textContent=t(id);body.textContent=t(id+'Body');mark.textContent=t(id==='application'?'requested':'signed');mark.dataset.pending=String(id==='application');draw();foley('paper');}
 function place(slot){if(locked())return;if(!selected){status.textContent=t('choose');return;}for(const key of slots)if(answer.placed[key]===selected)delete answer.placed[key];answer.placed[slot]=selected;answer.gaps=[];status.textContent='';draw();foley('paper');}
 for(const [id]of docs){const b=el('button');b.type='button';b.dataset.handoverDoc=id;b.append(el('span',id==='application'?'○':'—','handover-paper-symbol'),el('strong',t(id)),el('small',t(id==='application'?'requested':'signed')));b.onclick=e=>{if(e.detail&&performance.now()<swallowUntil)return;select(id);};
  b.onpointerdown=e=>{if(e.button!==0||locked())return;select(id);drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,ghost:null};b.setPointerCapture(e.pointerId);};
  b.onpointermove=e=>{if(drag?.id!==e.pointerId)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8)drag.moved=true;if(!drag.moved)return;if(!drag.ghost){drag.ghost=el('div',t(id),'handover-drag');shell.append(drag.ghost);}drag.ghost.style.left=(e.clientX+12)+'px';drag.ghost.style.top=(e.clientY+12)+'px';};
  b.onpointerup=e=>{if(drag?.id!==e.pointerId)return;const moved=drag.moved;drag.ghost?.remove();drag=null;if(moved){swallowUntil=performance.now()+400;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-handover-slot]');if(target&&shell.contains(target))place(target.dataset.handoverSlot);}};
  b.onpointercancel=b.onlostpointercapture=()=>{drag?.ghost?.remove();drag=null;};paperButtons[id]=b;papers.append(b);
 }
 for(const id of slots){const b=el('button');b.type='button';b.dataset.handoverSlot=id;b.onclick=()=>place(id);slotButtons[id]=b;board.append(b);}
 for(let year=1;year<=3;year++){const b=el('button');b.type='button';b.dataset.handoverYear=year;b.onclick=()=>{if(locked())return;answer.gaps=answer.gaps.includes(year)?answer.gaps.filter(x=>x!==year):[...answer.gaps,year];status.textContent='';draw();foley('write');};yearButtons[year]=b;timeline.append(b);}
 file.onclick=()=>{if(locked())return;if(!FullGame.solve({type:'handover'},{...answer,filed:true})){const claim=answer.placed.funding;status.textContent=claim&&claim!=='grant'?t(claim+'Body'):t('need');return;}answer.filed=true;status.textContent=t('filed');draw();foley('write');};
 const workspace=el('div',undefined,'handover-workspace'),source=el('div',undefined,'handover-source');const inspection=el('div',undefined,'handover-inspection');source.append(papers);inspection.append(viewer,board);workspace.append(source,inspection);
 shell.append(el('h3',t('title')),el('p',t('hands')),workspace,el('h3',t('time')),el('p',t('markHelp'),'handover-caption'),timeline,status,file,ticket,el('p',t('note'),'handover-caption'));rows.append(shell);
 function draw(){viewer.hidden=answer.filed;for(const [id,b]of Object.entries(paperButtons)){b.setAttribute('aria-pressed',String(id===selected));b.dataset.read=String(answer.read.includes(id));b.disabled=locked();}for(const [id,b]of Object.entries(slotButtons)){b.replaceChildren(el('small',t(id)),el('strong',t(answer.placed[id]||'vacant')));b.dataset.filled=String(!!answer.placed[id]);b.disabled=locked();}for(const [year,b]of Object.entries(yearButtons)){const covered=Number(year)===1&&answer.placed.funding==='grant';b.replaceChildren(el('strong',t('year'+year)),el('span',t(covered?'covered':answer.placed.funding==='grant'?'unsecured':'inspect')),el('small',answer.gaps.includes(Number(year))?'✎ '+t('marked'):'—'));b.dataset.covered=String(covered);b.setAttribute('aria-pressed',String(answer.gaps.includes(Number(year))));b.disabled=locked();}file.disabled=locked();ticket.hidden=!answer.filed;ticket.replaceChildren();if(answer.filed)ticket.append(el('h4',t('filed')),el('p',t('ticket')));draft=JSON.parse(JSON.stringify(answer));onChange();}draw();
}
root.HandoverTable={mount,reset(){draft=null;}};
})(window);
