/* Deterministic story-state model for the accident evacuation board. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EvacuationModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const signals=['flow','heater','decay'],places=['classroom','hall','east'];
 const fresh=()=>({inspected:[],abnormal:null,stopped:false,barrier:false,position:'classroom',path:['classroom'],counted:false,handed:false});
 function inspect(a,id){if(!a||!signals.includes(id))return a;return{...a,inspected:[...new Set([...a.inspected,id])],abnormal:id==='decay'?'decay':a.abnormal};}
 function stop(a){return a?.inspected?.includes('decay')?{...a,stopped:true}:a;}
 function tag(a){return a?.stopped?{...a,barrier:true}:a;}
 function move(a,to){if(!a||!places.includes(to)||!a.stopped||!a.barrier)return a;const edge=a.position==='classroom'&&to==='hall'||a.position==='hall'&&to==='east';return edge?{...a,position:to,path:[...a.path,to]}:a;}
 function count(a){return a?.position==='east'?{...a,counted:true}:a;}
 function hand(a){return a?.counted?{...a,handed:true}:a;}
 function complete(a){return !!(a&&a.abnormal==='decay'&&a.stopped&&a.barrier&&a.position==='east'&&Array.isArray(a.path)&&a.path.join(',')==='classroom,hall,east'&&a.counted&&a.handed);}
 return{signals,places,fresh,inspect,stop,tag,move,count,hand,complete};
});
