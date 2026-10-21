// Seated look input; form and overlay events never move the camera.
window.CD = window.CD || {};
CD.createRoomControls = surface => {
  let yaw=0,target=0,edge=0,drag=null,moved=false;const keys=new Set();
  const limit=1.12, clamp=v=>Math.max(-limit,Math.min(limit,v));
  const active=()=>CD.G?.started&&!CD.G.dead&&!CD.G.over&&!CD.G.lean&&!CD.room.failed&&document.querySelector('#radio').hidden&&document.querySelector('#demo').hidden;
  const isRoom=e=>e.target===surface||e.target.closest?.('#world');
  const editable=e=>e.target.closest?.('button,input,select,textarea,[contenteditable="true"]');
  surface.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||!active())return;drag={id:e.pointerId,x:e.clientX,start:e.clientX};moved=false;surface.setPointerCapture(e.pointerId);});
  surface.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;target=clamp(target-(e.clientX-drag.x)*.004);moved ||= Math.abs(e.clientX-drag.start)>8;drag.x=e.clientX;});
  const end=()=>{drag=null;};surface.addEventListener('pointerup',end);surface.addEventListener('pointercancel',end);
  addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;if(!active()||!isRoom(e)||editable(e)){edge=0;return;}const p=e.clientX/innerWidth;edge=p<.12?(p-.12)/.12:p>.88?(p-.88)/.12:0;});
  document.addEventListener('pointerleave',()=>{edge=0;});
  addEventListener('keydown',e=>{if(!active()||editable(e))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();keys.add(e.key);}});
  addEventListener('keyup',e=>keys.delete(e.key));
  addEventListener('blur',()=>{keys.clear();edge=0;drag=null;});
  function update(dt,reduce){if(active()){target=clamp(target+(edge+(keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0))*dt*.85);}else{edge=0;keys.clear();}yaw=reduce?target:yaw+(target-yaw)*(1-Math.exp(-dt*12));return yaw;}
  function look(v){if(active())target=clamp(v);edge=0;keys.clear();}
  function reset(){yaw=target=edge=0;drag=null;keys.clear();}
  return {update,look,reset,get yaw(){return yaw;},get target(){return target;},consumeDrag(){const value=moved;moved=false;return value;}};
};
