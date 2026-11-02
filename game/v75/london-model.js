(function(root){'use strict';
const walk=new Set(['4,0','5,0','6,0','4,1','5,1','6,1','4,2',...Array.from({length:5},(_,x)=>`${x},3`),...Array.from({length:5},(_,x)=>`${x},4`)]);
const docs=[
{id:'load',actor:'vika',title:'码头装货单',type:'运输记录',body:'6月14日。搬运工 M. Reed，车次 17，货签 B41。密封木箱四只，送往北仓。单据未写箱内物品。',tags:['6月14日','B41','北仓']},
{id:'stock',actor:'vika',title:'北仓入库页',type:'入库记录',body:'6月14日。货签 B41，枪机组件八十件。收货人签名可核。注意：这页证明的是这批货，不是搬运工的一切活动。',tags:['6月14日','B41','枪机组件']},
{id:'beds',actor:'noyi',title:'艾达的借宿册',type:'救济原件',body:'6月14日。借宿编号 R08，M. Reed 提供床位。临时住所：柳巷6号后屋。借宿家庭次日仍需在那里过夜。',tags:['6月14日','R08','借床']},
{id:'receipt',actor:'noyi',title:'借宿家庭的回条',type:'收讫记录',body:'6月14日。R08：已经住下，孩子的袜子也烘干了。感谢搬运工借出床铺。回条没有涉及货物运输。',tags:['6月14日','R08','已入住']},
{id:'coin',actor:'vika',title:'没有署全名的账条',type:'待核线索',body:'6月15日。“付 M.R. 银币两枚。”没有货签，没有收货地址，也没有用途。不能确认 M.R. 就是 M. Reed。',tags:['6月15日','M.R.','用途空白']},
{id:'hearsay',actor:'noyi',title:'巷口访谈笔记',type:'转述',body:'“有人说他替商人做事。”说话人没有见过交易，无法给出日期、货签或物品。这是需要继续追查的线索，不是已核实的交付。',tags:['无日期','无货签','未亲见']}
];
function freshPress(){return {open:false,ink:Array(6).fill(false),row:0,roller:0,loaded:false,paper:false,offset:2,pressure:0,pressed:false,proof:null,attempts:0};}
function restorePress(p){
 if(p===undefined)return freshPress(); // Old chapter saves remain playable.
 const ink=a=>Array.isArray(a)&&a.length===6&&a.every(x=>typeof x==='boolean');
 const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
 if(!p||!ink(p.ink)||!['open','loaded','paper','pressed'].every(k=>typeof p[k]==='boolean')||!integer(p.row,0,1)||!integer(p.roller,0,100)||!integer(p.offset,-3,3)||!integer(p.pressure,0,100)||!integer(p.attempts,0,100000))throw Error('invalid press');
 if((p.pressure>0&&!p.paper)||(p.pressed&&(!p.paper||p.pressure===0)))throw Error('invalid press position');
 if(p.proof!==null&&(!p.proof||!ink(p.proof.ink)||!integer(p.proof.offset,-3,3)||p.attempts<1))throw Error('invalid proof');
 return {...freshPress(),...p,ink:[...p.ink],proof:p.proof?{ink:[...p.proof.ink],offset:p.proof.offset}:null};
}
function roll(p,position){
 if(p.paper||p.pressure||!Number.isFinite(position))return p;
 const to=Math.max(0,Math.min(100,Math.round(position))),next={...p,roller:to,ink:[...p.ink]};
 if(p.loaded&&to!==p.roller){const lo=Math.min(to,p.roller),hi=Math.max(to,p.roller);for(let col=0;col<3;col++){const center=(col+.5)*100/3;if(lo<=center&&hi>=center)next.ink[p.row*3+col]=true;}}
 return next;
}
function pull(p,position){
 if(!p.paper||!Number.isFinite(position))return p;
 const pressure=Math.max(0,Math.min(100,Math.round(position))),next={...p,pressure,pressed:p.pressed||pressure===100};
 if(pressure===0&&next.pressed){next.proof={ink:[...p.ink],offset:p.offset};next.attempts=Math.min(100000,p.attempts+1);next.pressed=false;next.paper=false;}
 return next;
}
function proofReady(p){return Boolean(p.proof&&p.proof.offset===0&&p.proof.ink.every(Boolean));}
function fresh(){return {version:1,phase:0,actor:'vika',x:1,y:3,vertical:false,handle:true,door:false,moves:0,pairs:[],seen:[],selected:[],privateSafe:false,layout:[null,null],piece:null,printed:false,letters:[],ending:false,press:freshPress()};}
function cells(s){let w=s.vertical?1:s.handle?3:2,h=s.vertical?(s.handle?3:2):1;return Array.from({length:w*h},(_,i)=>[s.x+i%w,s.y+Math.floor(i/w)]);}
function obstacles(s){return cells(s).flatMap(([x,y])=>{const reason=x<0||x>6||y<0||y>4?'edge':!walk.has(`${x},${y}`)?'wall':!s.door&&x===4&&y===2?'door':null;return reason?[{x,y,reason}]:[];});}
function fits(s){return obstacles(s).length===0;}
function move(s,dx,dy,rotate=false){if(s.phase!==0||s.actor!=='vika')return s;const n={...s,x:s.x+dx,y:s.y+dy,vertical:rotate?!s.vertical:s.vertical};return fits(n)?{...n,moves:s.moves+1}:s;}
function docked(s){return !s.handle&&!s.vertical&&s.x===5&&s.y===0;}
function relation(ids){const key=[...ids].sort().join('|');return {'load|stock':'arms','beds|receipt':'shelter','coin|hearsay':'unknown'}[key]||null;}
function restoreChapter(raw){const s=JSON.parse(raw),base=fresh();if(!s||s.version!==1||![0,1,2,3].includes(s.phase)||!['vika','noyi'].includes(s.actor)||!Number.isInteger(s.x)||!Number.isInteger(s.y))throw Error('invalid');for(const key of ['vertical','handle','door','privateSafe','printed','ending'])if(typeof s[key]!=='boolean')throw Error('invalid');if(!Number.isInteger(s.moves)||s.moves<0||s.moves>100000)throw Error('invalid');for(const [key,allowed]of [['pairs',['arms','shelter','unknown']],['seen',docs.map(d=>d.id)],['letters',['thanks','loss']]])if(!Array.isArray(s[key])||new Set(s[key]).size!==s[key].length||s[key].some(v=>!allowed.includes(v)))throw Error('invalid');if(!Array.isArray(s.layout)||s.layout.length!==2||s.layout.some(v=>v!==null&&!['warning','dissent'].includes(v)))throw Error('invalid');if(!fits(s)||s.phase>0&&!docked(s)||s.phase>1&&s.pairs.length!==3||s.printed&&(!s.privateSafe||s.layout.join()!=='warning,dissent')||s.phase>2&&!s.printed||s.ending&&(s.letters.length!==2||s.phase!==3))throw Error('invalid');const selected=s.phase===1&&Array.isArray(s.selected)&&s.selected.length<=2&&new Set(s.selected).size===s.selected.length&&s.selected.every(id=>s.seen.includes(id))?[...s.selected]:[];return {...base,...s,selected,piece:null};}
function restore(raw){const s=restoreChapter(raw);s.press=restorePress(s.press);if(s.press.open&&(s.phase<2||!s.privateSafe||s.layout.join()!=='warning,dissent'))throw Error('invalid press context');return s;}
const api={walk,docs,fresh,cells,obstacles,fits,move,docked,relation,restore,freshPress,restorePress,roll,pull,proofReady};root.London=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
