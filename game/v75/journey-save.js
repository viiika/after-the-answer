/* Portable saved-story snapshots. Does not include transient experiments or other browser data. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.JourneySave=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const keys=Object.freeze({opening:'answers-afterward.v75.opening.1',jaipur:'answers-afterward.v75.jaipur-play.1',london:'answers-afterward.v75.london-play.1',full:'answers-afterward.v75.full.1'}),ids=Object.keys(keys),format='answers-afterward/journey';
 function capture(storage){return Object.fromEntries(ids.map(id=>[id,storage.getItem(keys[id])]));}
 function encode(saves){return JSON.stringify({format,version:1,createdAt:new Date().toISOString(),saves},null,2);}
 function inspect(saves,validators){return Object.fromEntries(ids.map(id=>{if(saves[id]===null)return [id,{status:'empty'}];try{return [id,{status:'valid',state:validators[id](saves[id])}];}catch{return [id,{status:'invalid'}];}}));}
 function parse(text,validators){
  if(typeof text!=='string'||new TextEncoder().encode(text).length>1024*1024)throw Error('size');const d=JSON.parse(text);
  if(!d||d.format!==format||d.version!==1||!d.saves||Array.isArray(d.saves)||Object.keys(d.saves).length!==4||ids.some(id=>!Object.hasOwn(d.saves,id)||(d.saves[id]!==null&&typeof d.saves[id]!=='string')))throw Error('format');
  const saves=Object.fromEntries(ids.map(id=>[id,d.saves[id]]));if(Object.values(inspect(saves,validators)).some(v=>v.status==='invalid'))throw Error('invalid');return saves;
 }
 const equal=(a,b)=>ids.every(id=>a[id]===b[id]);
 function apply(storage,saves,expected){
  // Do not silently overwrite progress that changed after the preview opened.
  let before;try{before=capture(storage);}catch{return {ok:false,reason:'access',rolledBack:true};}if(!equal(before,expected))return {ok:false,reason:'changed',rolledBack:true};
  const write=(id,raw)=>raw===null?storage.removeItem(keys[id]):storage.setItem(keys[id],raw);
  try{for(const id of ids)write(id,saves[id]);if(!equal(capture(storage),saves))throw Error('verify');return {ok:true};}
  catch{
   // Browser storage is not transactional. Keep trying every key if a rollback write fails.
   for(const id of ids)try{write(id,before[id]);}catch{}
   let rolledBack=false;try{rolledBack=equal(capture(storage),before);}catch{}return {ok:false,reason:'write',rolledBack};
  }
 }
 return {keys,ids,capture,encode,inspect,parse,equal,apply};
});
