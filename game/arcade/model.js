/* Pure, deterministic grip rules. No random win/loss rolls. */
(function(root){
const toys=[{name:'小太阳',r:24,color:'#dcac6a',kind:0},{name:'月兔',r:34,color:'#85b6ae',kind:1},{name:'探路机器人',r:24,color:'#cc8576',kind:2},{name:'土星',r:35,color:'#9e9cb9',kind:3},{name:'小森林',r:26,color:'#a0b885',kind:4},{name:'云鲸',r:37,color:'#86afc3',kind:5}];
const gears={fine:{name:'精密夹',width:27,tolerance:16,speed:280},wide:{name:'托举夹',width:43,tolerance:25,speed:190}};
function judge(x,item,gear){const g=gears[gear];if(Math.abs(x-item.x)>g.tolerance)return 'offset';if((item.r>27)!==(gear==='wide'))return 'size';return 'caught'}
const api={toys,gears,judge};root.Arcade=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
