/* Shared read-only validation for the scene and journey menu. */
(function(root){'use strict';
 const KEY='answers-afterward.v75.jaipur-play.1',targets=[8,12];
 function restore(raw){
  const d=JSON.parse(raw),v=d?.state;
  if(d?.version!==1||!v||!['vika','noyi'].includes(v.actor)||![0,1].includes(v.time)||!Number.isFinite(v.zero)||Math.abs(v.zero)>2||!Number.isInteger(v.wedge)||v.wedge<0||v.wedge>6||['inspected','clear','finished'].some(k=>typeof v[k]!=='boolean')||!Array.isArray(d.samples)||d.samples.length>500||!Array.isArray(d.notes)||d.notes.length>510||d.notes.some(t=>typeof t!=='string'||t.length>500))throw Error('invalid');
  for(const p of d.samples)if(!p||![0,1].includes(p.time)||!Number.isFinite(p.zero)||Math.abs(p.zero)>2||!Number.isInteger(p.wedge)||p.wedge<0||p.wedge>6||p.clear!==true||!Number.isFinite(p.value)||Math.abs(p.value-(targets[p.time]*(1+(3-p.wedge)*.05)+p.zero))>.001)throw Error('invalid');
  const ready=v.inspected&&[0,1].every(time=>d.samples.some(p=>p.time===time&&p.zero===v.zero&&p.wedge===v.wedge&&p.clear&&Math.abs(p.value-targets[time])<.051));
  if(v.finished&&(!ready||!['clean','both'].includes(v.send)))throw Error('invalid');
  return d;
 }
 const api={KEY,restore};root.Jaipur=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
