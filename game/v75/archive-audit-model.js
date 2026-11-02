/* Provenance model for Han Ning's independent archive audit. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ArchiveAuditModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const ids=['school','housing','transit','index','interface','observer','photo'];
 const primary=['school','housing','transit'],anomalies=['interface','observer'];
 const fresh=()=>({read:[],chain:[],flagged:[]});
 const add=(list,id)=>[...new Set([...list,id])];
 function read(a,id){return a&&ids.includes(id)?{...a,read:add(a.read,id)}:a;}
 function toggle(a,field,id){if(!a||!a.read.includes(id)||!ids.includes(id))return a;const list=a[field],next=list.includes(id)?list.filter(x=>x!==id):add(list,id);return{...a,[field]:next};}
 const chain=(a,id)=>toggle(a,'chain',id),flag=(a,id)=>toggle(a,'flagged',id);
 function complete(a){return !!(a&&ids.every(id=>a.read.includes(id))&&a.chain.length===3&&primary.every(id=>a.chain.includes(id))&&a.flagged.length===2&&anomalies.every(id=>a.flagged.includes(id)));}
 return{ids,primary,anomalies,fresh,read,chain,flag,complete};
});
