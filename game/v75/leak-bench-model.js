/* Finite, relative two-second volumes for a fictional bench; not a pipe simulator. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LeakBenchModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const sites=['joint0','joint1','joint2','outlet'];
 const fresh=()=>({site:'outlet',valve:false,repaired:false,samples:[],before:null,leak:null,after:null,stopped:false});
 function reading(site,repaired){if(!sites.includes(site)||typeof repaired!=='boolean')return null;return site==='outlet'?(repaired?39:31):site==='joint1'&&!repaired?8:0;}
 function valid(s){return !!(s&&sites.includes(s.site)&&typeof s.repaired==='boolean'&&s.seconds===2&&s.volume===reading(s.site,s.repaired));}
 function record(a){if(!a||!a.valve||!sites.includes(a.site))return a;const s={site:a.site,repaired:a.repaired,seconds:2,volume:reading(a.site,a.repaired)},next={...a,samples:[...a.samples,s].slice(-12),stopped:false};if(s.site==='outlet'){if(!s.repaired&&!next.before)next.before=s;if(s.repaired)next.after=s;}if(s.site==='joint1'&&!s.repaired&&!next.leak)next.leak=s;return next;}
 function seal(a){if(!a||a.valve||a.site!=='joint1'||!valid(a.before)||a.before.site!=='outlet'||a.before.repaired||!valid(a.leak)||a.leak.site!=='joint1'||a.leak.repaired)return a;return{...a,repaired:true,stopped:false};}
 function complete(a){return !!(a&&a.repaired===true&&a.valve===false&&a.stopped===true&&valid(a.before)&&a.before.site==='outlet'&&a.before.repaired===false&&valid(a.leak)&&a.leak.site==='joint1'&&a.leak.repaired===false&&valid(a.after)&&a.after.site==='outlet'&&a.after.repaired===true&&a.after.volume>a.before.volume&&a.after.volume<40);}
 return{sites,fresh,reading,valid,record,seal,complete};
});
