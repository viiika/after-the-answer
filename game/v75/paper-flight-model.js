/* Deliberately simple, deterministic arcade trajectories; not an aerodynamic model. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaperFlight=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const valid=s=>!!(s&&Number.isInteger(s.angle)&&s.angle>=15&&s.angle<=65&&Number.isInteger(s.power)&&s.power>=25&&s.power<=100&&[-1,0,1].includes(s.wind));
 function simulate(shot){if(!valid(shot))return null;const radians=shot.angle*Math.PI/180,speed=180+shot.power*2,dt=1/60,path=[{x:80,y:235,t:0}];let x=80,y=235,vx=speed*Math.cos(radians),vy=-speed*Math.sin(radians),t=0;
  for(let i=0;i<360;i++){const old={x,y,t};vx+=(shot.wind*32-vx*.2)*dt;vy+=(240-vy*.08)*dt;x+=vx*dt;y+=vy*dt;t+=dt;if(y>=270){const ratio=(270-old.y)/(y-old.y);x=old.x+(x-old.x)*ratio;y=270;t=old.t+dt*ratio;path.push({x,y,t});break;}path.push({x,y,t});}
  return{path,x,y,seconds:t,landed:y===270&&x>=420&&x<=540};
 }
 function compared(pair){return !!(Array.isArray(pair)&&pair.length===2&&pair.every(valid)&&pair[0].wind!==pair[1].wind&&pair[0].angle===pair[1].angle&&pair[0].power===pair[1].power);}
 function complete(answer){return compared(answer?.comparison)&&valid(answer?.landing)&&simulate(answer.landing).landed;}

 function relation(reference,trial){if(!valid(reference)||!valid(trial))return null;const sameSettings=reference.angle===trial.angle&&reference.power===trial.power;return{kind:sameSettings?(reference.wind===trial.wind?'same':'controlled'):'mixed',direction:Math.sign(simulate(trial).x-simulate(reference).x)};}
 return{valid,simulate,compared,complete,relation};
});
