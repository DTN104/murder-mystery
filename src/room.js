// Three.js renderer / legacy game bridge. One scene, one game-owned animation loop.
window.CD = window.CD || {};
CD.room = (() => {
  const T=THREE,$=s=>document.querySelector(s);
  let renderer,model,controls,canvas,W=0,H=0,last=0,lean=0,lastFeed=0,failed=false,feedChecked=false;
  const seat=new T.Vector3(-.42,1.48,.82),close=new T.Vector3(-.57,1.34,-.36),screenAim=new T.Vector3(-.57,1.32,-1.12),aim=new T.Vector3();
  const projected=new T.Vector3(),origin=new T.Vector3(),direction=new T.Vector3(),ndc=new T.Vector2(),ray=new T.Raycaster();
  const reduced=()=>CD.G?.reduce||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const active=()=>CD.G?.started&&!CD.G.dead&&!CD.G.over&&!CD.G.lean&&!failed;
  function fail(message){if(failed)return;failed=true;CD.G.started=false;$('#room-error').hidden=false;$('#room-error-text').textContent=message;$('#start').disabled=true;$('#monitor').hidden=true;}
  function init(roomCanvas,feed){
    canvas=roomCanvas;
    try{renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});}
    catch(e){fail('Trình duyệt chưa mở được đồ họa 3D. Bật tăng tốc đồ họa hoặc thử Chrome/Safari mới rồi tải lại.');throw e;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
    renderer.shadowMap.enabled=!matchMedia('(pointer: coarse)').matches;renderer.shadowMap.type=T.PCFSoftShadowMap;
    model=CD.createRoomScene(feed);controls=CD.createRoomControls(canvas);
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail('Đồ họa 3D vừa bị ngắt. Tải lại để bắt đầu ca mới.');});
    $('#room-reload').onclick=()=>location.reload();
    for(const [name,label] of [['mon','Màn hình'],['door','Khóa cửa'],['radio','Bộ đàm']]){
      const button=$('#hot-'+name);button.dataset.anchor=name;button.title=label;
      button.addEventListener('click',e=>{if(!active()|| (e.detail>0&&!hit(name,e.clientX,e.clientY))){e.preventDefault();e.stopImmediatePropagation();}},true);
    }
    canvas.addEventListener('click',e=>{if(!active()||controls.consumeDrag())return;for(const name of Object.keys(model.anchors))if(hit(name,e.clientX,e.clientY)){$('#hot-'+name).click();break;}});
    $('#look-left').onclick=()=>controls.look(-.38);$('#look-desk').onclick=()=>controls.look(0);$('#look-door').onclick=()=>controls.look(.57);
    $('#quick-lock').onclick=()=>{if(active())$('#hot-door').click();};
    resize();
  }
  function hit(name,x,y){ndc.set(x/W*2-1,1-y/H*2);ray.setFromCamera(ndc,model.camera);const intersections=ray.intersectObjects(model.scene.children,true).filter(h=>h.object.visible&&visibleAncestors(h.object)&&!h.object.material?.transparent);const first=intersections[0];if(!first)return false;let o=first.object;while(o){if(o===model.anchors[name].mesh)return true;o=o.parent;}return false;}
  function visibleAncestors(o){while(o){if(!o.visible)return false;o=o.parent;}return true;}
  function layoutHotspots(){if(!model)return;for(const [name,a] of Object.entries(model.anchors)){
    const el=$('#hot-'+name);projected.copy(a.point).project(model.camera);const x=(projected.x+1)*W/2,y=(1-projected.y)*H/2;
    origin.copy(model.camera.position);direction.copy(a.point).sub(origin);const distance=direction.length();ray.set(origin,direction.normalize());ray.far=distance+.06;
    const obstruction=ray.intersectObjects(model.scene.children,true).find(h=>visibleAncestors(h.object)&&!h.object.material?.transparent&&h.distance<distance-.09);ray.far=Infinity;
    const show=active()&&lean<.03&&projected.z>-1&&projected.z<1&&x>20&&x<W-20&&y>70&&y<H-100&&!obstruction;
    el.hidden=!show;el.style.left=(x-30)+'px';el.style.top=(y-24)+'px';el.style.width='60px';el.style.height='48px';
  }}
  function placeToast(){const t=$('#toast');t.style.left='20px';t.style.top='auto';t.style.bottom='132px';}
  function resize(){W=innerWidth;H=innerHeight;if(!renderer||failed)return;renderer.setSize(W,H,false);model.camera.aspect=W/H;model.camera.fov=W<H?72:58;model.camera.updateProjectionMatrix();last=0;}
  function draw(tm){if(!model||failed)return;const g=CD.G,dt=last?Math.min(.1,Math.max(0,tm-last)):1/60;last=tm;
    const reduce=reduced(),yaw=controls.update(dt,reduce),target=g.lean?1:0;
    lean=reduce?target:Math.max(0,Math.min(1,lean+(target>lean?1:target<lean?-1:0)*dt/.3));
    const p=lean*lean*(3-2*lean);model.camera.position.copy(seat).lerp(close,p);
    aim.set(seat.x+Math.sin(yaw)*3,seat.y-.22,seat.z-Math.cos(yaw)*3).lerp(screenAim,p);model.camera.lookAt(aim);model.camera.updateMatrixWorld();
    $('#monitor').hidden=!(g.lean&&lean>=.999&&!g.dead&&!g.over);$('#stage').classList.toggle('lean',g.lean||lean>.01);
    $('#view-controls').hidden=g.lean;$('#quick-lock').disabled=!active()||g.ups<=0;$('#quick-lock').textContent=g.door?'Mở khóa cửa':'Khóa cửa';$('#quick-lock').setAttribute('aria-pressed',String(g.door));
    $('#look-door').setAttribute('aria-pressed',String(yaw>.35));$('#look-desk').setAttribute('aria-pressed',String(Math.abs(yaw)<.25));$('#look-left').setAttribute('aria-pressed',String(yaw<-.28));
    model.update(g,tm);
    if(!feedChecked&&CD.assets.loaded===CD.assets.total){feedChecked=true;try{document.querySelector('#cv').getContext('2d').getImageData(0,0,1,1);}catch(e){const c=CD.roomMaterials.canvas(256,128),ctx=c.getContext('2d');ctx.fillStyle='#111b18';ctx.fillRect(0,0,256,128);ctx.fillStyle='#a8c6ac';ctx.font='16px monospace';ctx.fillText('MẤT TÍN HIỆU',55,67);model.screenMat.map=CD.roomMaterials.texture(c);$('#room-status').textContent='CRT không đọc được ảnh camera. Hãy mở game qua địa chỉ HTTP cục bộ.';}}
    if(tm-lastFeed>=1/24){model.feedTexture.needsUpdate=true;lastFeed=tm;}
    if(!$('#monitor').hidden)return;
    renderer.render(model.scene,model.camera);layoutHotspots();
  }
  function reset(){controls?.reset();lean=0;last=0;$('#monitor').hidden=true;$('#stage').classList.remove('lean');}
  function cancelLean(){lean=0;$('#monitor').hidden=true;$('#stage').classList.remove('lean');}
  function bindInput(){addEventListener('resize',resize);}
  function dispose(){model?.dispose();renderer?.dispose();}
  return {init,draw,resize,layoutHotspots,placeToast,worldTransform:()=>'',bindInput,reset,cancelLean,dispose,get W(){return W;},get H(){return H;},get RV(){return null;},get failed(){return failed;},
    get diagnostics(){return model?{yaw:controls.yaw,lean,camera:model.camera.position.toArray(),meshes:model.scene.children.length,ghost:model.ghost.visible,ghostDepth:model.ghost.position.z,locked:model.bolt.visible,memory:{...renderer.info.memory},calls:renderer.info.render.calls,webgl:renderer.capabilities.isWebGL2}:null;}};
})();
