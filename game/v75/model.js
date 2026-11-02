(function(root){
'use strict';
const KEY='answers-afterward.v75.opening.1';
const actions=['share','store','task','application','route','dispatch','verify','permission','collect','order','tape','pack','meet','jaipur','jbaseline','jwood','jrepair','jshade','jread','jrepeat','jcopy','jreport'];
const fresh=()=>({version:1,actor:'vika',events:[]});
const has=(s,e)=>s.events.includes(e);
const ready=s=>has(s,'verify')&&has(s,'pack');
function allowed(s,a){
 if(has(s,'jreport')||has(s,a))return false;
 if(has(s,'meet')&&!['jaipur','jbaseline','jwood','jrepair','jshade','jread','jrepeat','jcopy','jreport'].includes(a))return false;
 const h=e=>has(s,e),v=s.actor==='vika';
 const conditions={share:v,store:v&&h('share'),task:v&&h('store'),application:v&&h('task'),route:v&&h('application'),dispatch:v&&h('route'),verify:v&&h('dispatch'),permission:!v,collect:!v&&h('permission'),order:!v&&h('collect'),tape:!v&&h('order'),pack:!v&&h('tape'),meet:ready(s),jaipur:h('meet'),jbaseline:v&&h('jaipur'),jwood:!v&&h('jaipur'),jshade:!v&&h('jaipur'),jrepair:!v&&h('jwood')&&h('jbaseline'),jread:v&&h('jrepair')&&h('jshade'),jrepeat:v&&h('jread'),jcopy:!v&&h('jrepeat'),jreport:v&&h('jcopy')};
 return conditions[a]===true;
}
function apply(s,a){if(!allowed(s,a))return s;return {...s,events:[...s.events,a]};}
function restore(raw){
 const d=JSON.parse(raw); if(!d||d.version!==1||!['vika','noyi'].includes(d.actor)||!Array.isArray(d.events)||d.events.length>actions.length)throw Error('invalid');
 let s=fresh();for(const e of d.events){if(!actions.includes(e))throw Error('invalid');s.actor=['permission','collect','order','tape','pack','jwood','jrepair','jshade','jcopy'].includes(e)?'noyi':'vika';if(!allowed(s,e))throw Error('invalid');s=apply(s,e);}s.actor=d.actor;return s;
}
function next(s){if(has(s,'jreport'))return 'done';if(has(s,'jaipur')){const h=e=>has(s,e);if(s.actor==='noyi'){if(!h('jwood'))return 'jwood';if(!h('jshade'))return 'jshade';if(!h('jbaseline'))return 'switch';if(!h('jrepair'))return 'jrepair';if(!h('jrepeat'))return 'switch';if(!h('jcopy'))return 'jcopy';return 'switch';}if(!h('jbaseline'))return 'jbaseline';if(!h('jrepair')||!h('jshade'))return 'switch';if(!h('jread'))return 'jread';if(!h('jrepeat'))return 'jrepeat';return h('jcopy')?'jreport':'switch';}if(has(s,'meet'))return 'jaipur';if(ready(s))return 'meet';const chain=s.actor==='vika'?['share','store','task','application','route','dispatch','verify']:['permission','collect','order','tape','pack'];return chain.find(e=>!has(s,e))||'switch';}
const api={KEY,fresh,has,ready,allowed,apply,restore,next};if(typeof module!=='undefined')module.exports=api;root.Opening=api;
})(typeof globalThis!=='undefined'?globalThis:this);
