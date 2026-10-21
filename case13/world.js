import * as T from '../vendor/three/three.module.js';
import {createPursuer} from './pursuer.js';
export function createWorld(canvas){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;renderer.shadowMap.enabled=!matchMedia('(pointer:coarse)').matches;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const scene=new T.Scene();scene.background=new T.Color('#080f0f');scene.fog=new T.FogExp2('#0b1514',.045);
 const camera=new T.PerspectiveCamera(68,1,.06,65);camera.rotation.order='YXZ';camera.position.set(0,1.64,4.8);
 const colliders=[],items=[],walls=[],lights=[],doors={};let seed=713;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const canvasTexture=(w,h,draw)=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;};
 const mat=(color,roughness=.86,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
 function material(base,kind){const map=canvasTexture(512,512,c=>{c.fillStyle=base;c.fillRect(0,0,512,512);for(let i=0;i<14000;i++){const v=random()>.5?'210,216,184':'3,12,10';c.fillStyle=`rgba(${v},${random()*.16})`;c.fillRect(random()*512,random()*512,kind==='wood'?random()*130:random()*7,random()*3+1);}if(kind==='tile'){c.strokeStyle='#162a24';c.lineWidth=5;c.strokeRect(0,0,512,512);}if(kind==='plaster'){for(let j=0;j<28;j++){const x=random()*512,y=random()*512,r=30+random()*85,g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#0f211a2b');g.addColorStop(1,'#0f211a00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}c.strokeStyle='#1c342130';c.lineWidth=1;for(let j=0;j<9;j++){c.beginPath();c.moveTo(random()*512,0);c.lineTo(random()*512,512);c.stroke();}}});map.wrapS=map.wrapT=T.RepeatWrapping;return new T.MeshStandardMaterial({map,roughness:.96});}
 const plaster=material('#687b6c','plaster'),lower=material('#294c44','plaster'),floorMat=material('#58665a','tile'),wood=material('#5d4830','wood'),metal=mat('#3d524b',.6,.4),dark=mat('#101b17'),trim=mat('#aaa48b'),paper=mat('#c7bc9f'),red=mat('#6b392f'),glass=new T.MeshStandardMaterial({color:'#7caa9e',transparent:true,opacity:.13,roughness:.4});
 function box(w,h,d,x,y,z,m=metal,parent=scene,collision=false){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);if(collision){colliders.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2});walls.push(o);}return o;}
 function cyl(r1,r2,h,x,y,z,m=metal,parent=scene){const o=new T.Mesh(new T.CylinderGeometry(r1,r2,h,12),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function plane(w,h,x,y,z,m,parent=scene){const o=new T.Mesh(new T.PlaneGeometry(w,h),m);o.position.set(x,y,z);parent.add(o);return o;}
 function text(lines,w=512,h=256,bg='#c5b99b',fg='#203a2c'){return new T.MeshStandardMaterial({map:canvasTexture(w,h,c=>{c.fillStyle=bg;c.fillRect(0,0,w,h);c.strokeStyle=fg;c.lineWidth=3;c.strokeRect(9,9,w-18,h-18);c.fillStyle=fg;c.textAlign='center';c.textBaseline='middle';lines.forEach((s,i)=>{c.font=`${i?400:700} ${Math.min(h/(lines.length+1)*.65,w/Math.max(8,s.length)*1.45)}px monospace`;c.fillText(s,w/2,h*(i+1)/(lines.length+1),w-30);});}),roughness:.9});}
 function wall(x0,z0,x1,z1){const w=Math.max(.15,Math.abs(x1-x0)),d=Math.max(.15,Math.abs(z1-z0)),x=(x0+x1)/2,z=(z0+z1)/2;box(w,3.15,d,x,1.575,z,plaster,scene,true);const base=box(w+.015,1.12,d+.015,x,.56,z,lower);base.castShadow=false;box(w+.025,.045,d+.025,x,1.13,z,metal);box(w+.035,.12,d+.035,x,.06,z,dark);}
 const regions=[[-4,4,0,6],[-1.8,1.8,-22.1,.2],[-8.6,-1.7,-10.6,-3],[1.7,8.4,-17.1,-9],[-3.9,3.9,-30.1,-21.9]];
 for(const [x0,x1,z0,z1]of regions){const fm=floorMat.clone();fm.map=floorMat.map.clone();fm.map.repeat.set((x1-x0)*1.4,(z1-z0)*1.4);box(x1-x0,.1,z1-z0,(x0+x1)/2,-.06,(z0+z1)/2,fm);box(x1-x0,.1,z1-z0,(x0+x1)/2,3.2,(z0+z1)/2,lower);}
 for(const a of [[-4,0,-4,6],[4,0,4,6],[-4,6,4,6],[-4,0,-1.8,0],[1.8,0,4,0],[-1.8,0,-1.8,-5.7],[-1.8,-7.5,-1.8,-22],[1.8,0,1.8,-11.6],[1.8,-13.5,1.8,-22],[-8.6,-3,-1.8,-3],[-8.6,-10.6,-1.8,-10.6],[-8.6,-3,-8.6,-10.6],[1.8,-9,8.4,-9],[1.8,-17.1,8.4,-17.1],[8.4,-9,8.4,-17.1],[-3.9,-22,-.95,-22],[.95,-22,3.9,-22],[-3.9,-22,-3.9,-30.1],[3.9,-22,3.9,-30.1],[-3.9,-30.1,3.9,-30.1]])wall(...a);
 function light(x,z,color='#d6d8b7',intensity=7){const l=new T.PointLight(color,intensity,7,2);l.position.set(x,2.8,z);scene.add(l);lights.push(l);box(.7,.07,.16,x,3.01,z,metal);const b=new T.MeshBasicMaterial({color});box(.56,.02,.08,x,2.96,z,b);return l;}
 light(0,3,'#e7ba78',10);light(0,-2);light(0,-9);light(0,-17);light(-5,-6,'#e7ba78',8);light(5,-13,'#8aa9a9',10);light(0,-26,'#c9a776',8);
 scene.add(new T.HemisphereLight('#b1ccc3','#1c241a',.32));
 const torch=new T.SpotLight('#f1dfb0',34,20,.48,.62,1.5);torch.castShadow=true;torch.shadow.mapSize.set(1024,1024);torch.shadow.bias=-.001;scene.add(torch,torch.target);
 const playerLamp=new T.PointLight('#c2cab0',.7,2.7);scene.add(playerLamp);
 // A visible flashlight follows the camera, giving the first-person view a physical anchor.
 const hand=new T.Group();camera.add(hand);hand.position.set(.25,-.3,-.47);hand.rotation.x=Math.PI/2;
 cyl(.038,.042,.24,0,0,0,dark,hand);cyl(.055,.04,.065,0,.145,0,metal,hand);cyl(.048,.048,.005,0,.18,0,new T.MeshBasicMaterial({color:'#e6d6ad'}),hand);scene.add(camera);
 // Lobby and lift, the clear visual starting point.
 box(2.1,2.65,.12,0,1.325,5.86,metal);for(const x of [-.51,.51])box(1,2.48,.08,x,1.27,5.76,dark);box(.018,2.4,.04,0,1.27,5.7,metal);
 const liftSign=plane(1.1,.35,0,2.9,5.68,text(['13 / SẢNH'],512,128,'#191e17','#c5905c'));liftSign.rotation.y=Math.PI;
 plane(1.25,.26,0,2.5,-.09,text(['CĂN HỘ 1304  ←','BẢO VỆ / KHO  ↑'],512,160,'#1a3027','#a3b69d'));
 const notice=plane(1.4,1.1,-3.88,1.55,2.5,text(['PHONG TỎA','MẤT TÍCH: TRẦN MAI','LẦN CUỐI: CĂN 1304','KHÔNG ĐƯỢC ĐI MỘT MÌNH'],512,512));notice.rotation.y=Math.PI/2;
 box(1.7,.05,.5,2.7,.45,3.6,wood);for(const x of [2.05,3.35])box(.08,.45,.4,x,.22,3.6,metal);
 // Utility conduits, damaged lamps, doors that do not all look alike.
 for(const x of [-1.55,1.55]){const p=cyl(.024,.024,21,x,2.85,-10.5,metal);p.rotation.x=Math.PI/2;}
 for(const z of [-3,-10,-18]){plane(.4,.22,-1.70,2.3,z,text(['13'],128,80,'#293c31','#c5c8ac')).rotation.y=Math.PI/2;}
 function door(id,x,z,side){const root=new T.Group();root.position.set(x,0,z);if(side)root.rotation.y=Math.PI/2;scene.add(root);box(1.72,2.55,.11,0,1.275,0,dark,root);box(1.52,2.35,.035,0,1.25,.075,wood,root);box(.13,.035,.07,.57,1.08,.12,trim,root);plane(.65,.2,0,1.9,.104,text([id==='apartment'?'1304':id==='office'?'BẢO VỆ':'KHO HỒ SƠ'],384,128),root);doors[id]=root;return root;}
 door('apartment',-1.8,-6.6,true);door('office',1.8,-12.55,true);doors.office.rotation.y=-Math.PI/2;door('archive',0,-22,false);
 const targets={};
 function item(id,label,x,y,z,make,range=2.25){const group=new T.Group();group.position.set(x,y,z);group.name=id;scene.add(group);if(make)make(group);const glow=new T.PointLight('#cba56d',.25,1.4,2);glow.position.set(0,.12,.08);group.add(glow);const obj={id,label,group,point:new T.Vector3(x,y,z),range,glow};items.push(obj);targets[id]=obj;return obj;}
 item('power','Rà lại cầu dao',1.52,1.35,-1.5,g=>{box(.36,.6,.2,0,0,0,metal,g);plane(.27,.12,0,.18,.11,text(['NGUỒN TẦNG 13'],384,128),g);box(.08,.21,.07,0,-.05,.15,red,g);});
 // Apartment: disturbed domestic space, physical clues spread across the room.
 box(1.55,.24,2.15,-6.85,.35,-8.4,wood,scene,true);box(1.46,.19,2.05,-6.85,.56,-8.4,mat('#999b7e'));box(1.4,.15,.7,-6.85,.72,-9,mat('#b1b29b'));box(1.45,.035,1,-6.85,.68,-7.8,lower);
 box(1.8,.07,.68,-4,.82,-9.8,wood,scene,true);for(const x of [-4.7,-3.3])box(.06,.8,.06,x,.4,-9.8,metal);
 box(.65,.05,.65,-4,.47,-8.85,dark);box(.05,.65,.06,-4.29,.4,-8.6,metal);box(.05,.65,.06,-3.71,.4,-8.6,metal);
 const clock=plane(.62,.62,-5,2.13,-10.49,text(['02 : 17','HORLOGE / DỪNG'],256,256,'#151c17','#b8bea4'));
 const windowFrame=box(.08,1.55,2,-8.49,1.95,-5.2,metal);const windowPane=plane(1.8,1.3,-8.43,1.95,-5.2,new T.MeshBasicMaterial({color:'#192d31'}));windowPane.rotation.y=Math.PI/2;
 const rain=new T.Group();scene.add(rain);for(let i=0;i<24;i++){const streak=box(.008,.2+random()*.4,.007,-8.39,1.35+random()*1.2,-6+random()*1.6,new T.MeshBasicMaterial({color:'#627978'}));rain.add(streak);}
 item('phone','Xem điện thoại của Mai',-6.13,.84,-8.05,g=>{box(.11,.02,.22,0,0,0,black(),g);const s=plane(.09,.18,0,.014,0,new T.MeshBasicMaterial({color:'#99c9ac'}),g);s.rotation.x=-Math.PI/2;});
 item('photo','Khám dấu vết hiện trường',-4,.91,-9.7,g=>{const p=plane(.44,.3,0,0,0,text(['02:17 / CAMERA','MỘT NGƯỜI MẶC ÁO BẢO VỆ'],512,256),g);p.rotation.x=-Math.PI/2;});
 item('key','Lấy chìa phòng bảo vệ',-4.56,.88,-9.7,g=>{const ring=new T.Mesh(new T.TorusGeometry(.035,.009,7,14),mat('#bca16a',.3,.7));ring.rotation.x=Math.PI/2;g.add(ring);box(.014,.018,.10,0,0,.07,trim,g);box(.04,.018,.014,.012,0,.1,trim,g);});
 const stainMat=new T.MeshStandardMaterial({color:'#492b20',roughness:1});for(let i=0;i<12;i++){const p=plane(.10+random()*.14,.2,-3.5-random()*2,.005,-5-random()*3,stainMat);p.rotation.x=-Math.PI/2;p.rotation.z=random();}
 function closet(id,x,z){box(1.12,2.35,.62,x,1.17,z,wood,scene,true);for(const dx of [-.27,.27])box(.53,2.2,.035,x+dx,1.18,z-.34,lower);for(let i=0;i<7;i++)box(.4,.018,.025,x-.27,1.6+i*.055,z-.365,dark);item(id,'Trốn vào tủ',x,1.3,z-.43,g=>box(.03,.14,.035,.1,0,.015,trim,g),1.75);}
 closet('hide-apartment',-7.7,-3.55);
 // Security office: readable log book, caretaker's statement and a humming CCTV unit.
 box(2.1,.1,.85,5.5,.82,-15.8,wood,scene,true);for(const x of [4.65,6.35])box(.07,.8,.07,x,.4,-15.8,metal);
 box(.7,.5,.38,5.7,1.13,-16,metal);plane(.57,.34,5.7,1.16,-15.79,new T.MeshBasicMaterial({color:'#476953'}));box(.25,.12,.2,5.7,.93,-16,dark);
 item('log','Đọc nhật ký điện & thẻ ra vào',4.85,.91,-15.5,g=>{const p=plane(.55,.4,0,0,0,text(['02:12  TUẤN / THẺ BV-01','02:13  NGẮT ĐIỆN TẦNG','02:19  KHÔI PHỤC NGUỒN'],512,320),g);p.rotation.x=-Math.PI/2;});
 item('statement','Xem lời khai của bảo vệ',6.26,.91,-15.55,g=>{const p=plane(.45,.3,0,0,0,text(['LỜI KHAI / TUẤN','TÔI KHÔNG RỜI PHÒNG TRỰC'],512,256),g);p.rotation.x=-Math.PI/2;});
 for(let r=0;r<4;r++){box(1.5,.04,.4,7.9,.35+r*.55,-14.2,metal);for(let i=0;i<8;i++){box(.13,.36,.28,7.3+i*.17,.55+r*.55,-14.2,i%2?wood:lower);}}
 closet('hide-office',6.8,-9.4);
 plane(1,.65,4.2,1.9,-17,text(['MÃ KHO = GIỜ MẤT ĐIỆN','4 CHỮ SỐ / HHMM','KHÔNG PHẢI GIỜ PHÁT HIỆN'],512,320,'#c0b391','#4c3826'));
 item('keypad','Mở khóa kho hồ sơ',1.38,1.35,-21.82,g=>{box(.24,.38,.07,0,0,0,metal,g);for(let i=0;i<9;i++)box(.04,.04,.01,(i%3-1)*.06,.03-Math.floor(i/3)*.065,.043,trim,g);},2.35);
 // Archive: shelves narrow the approach, the hostage and an optional confession tape.
 for(const x of [-2.8,2.8])for(const z of [-23.8,-26.2]){for(let r=0;r<4;r++){box(.65,.035,1.6,x,.24+r*.62,z,metal,scene,r===0);for(let i=0;i<5;i++)box(.48,.33,.22,x,.43+r*.62,z-.62+i*.29,i%2?wood:lower);}}
 box(1,.08,.45,-2,.78,-29.2,wood,scene,true);
 item('tape','Thu băng ghi âm',-2,.87,-29.2,g=>{box(.28,.09,.18,0,0,0,dark,g);for(const x of [-.07,.07]){const t=cyl(.035,.035,.01,x,.055,0,trim,g);}box(.025,.02,.04,.1,.06,.06,red,g);});
 // Hostage is a seated silhouette with a cloth over the shoulders, no graphic injury.
 const hostage=new T.Group();hostage.position.set(.1,0,-28.3);scene.add(hostage);box(.55,.05,.55,0,.5,0,wood,hostage);box(.55,.7,.05,0,.85,-.2,wood,hostage);
 const skin=mat('#8f9276');const body=cyl(.2,.25,.55,0,.86,0,lower,hostage);body.scale.z=.65;
 const head=new T.Mesh(new T.SphereGeometry(.13,16,12),skin);head.position.set(0,1.28,.04);head.scale.y=1.3;head.rotation.z=.2;hostage.add(head);
 for(const x of [-.16,.16]){cyl(.075,.06,.45,x,.28,.21,dark,hostage);box(.13,.08,.26,x,.08,.28,dark,hostage);cyl(.055,.045,.5,x*1.45,.8,.02,lower,hostage);}box(.5,.045,.32,0,.74,.04,trim,hostage);
 item('rescue','Cởi trói & gọi cứu viện',.1,1.05,-28.0,null,2.1);
 // Detailed front/back artwork follows the hunter without changing its AI root.
 const pursuer=createPursuer(),ghost=pursuer.root;scene.add(ghost);
 const dynamic={apartment:{x0:-1.93,x1:-1.67,z0:-7.5,z1:-5.7,closed:s=>!s.power},office:{x0:1.67,x1:1.93,z0:-13.5,z1:-11.6,closed:s=>!s.officeOpen},archive:{x0:-.95,x1:.95,z0:-22.15,z1:-21.85,closed:s=>!s.archiveOpen}};
 function solidAt(x,z,state,r=.23){if(!regions.some(a=>x>a[0]+r&&x<a[1]-r&&z>a[2]+r&&z<a[3]-r)){
   // Adjacent rectangles share doorways: test the circle at its four edges in the union.
   for(const [px,pz] of [[x-r,z],[x+r,z],[x,z-r],[x,z+r]])if(!regions.some(a=>px>a[0]&&px<a[1]&&pz>a[2]&&pz<a[3]))return true;
  }
  for(const b of colliders)if(x+r>b.x0&&x-r<b.x1&&z+r>b.z0&&z-r<b.z1)return true;
  for(const b of Object.values(dynamic))if(b.closed(state)&&x+r>b.x0&&x-r<b.x1&&z+r>b.z0&&z-r<b.z1)return true;
  return false;
 }
 const direction=new T.Vector3(),target=new T.Vector3();let doorProgress={apartment:0,office:0,archive:0};
 function update(state,time,dt){
  camera.getWorldDirection(direction);torch.position.copy(camera.position);torch.position.y-=.08;target.copy(camera.position).addScaledVector(direction,8);torch.target.position.copy(target);torch.intensity=state.flashlight?(state.battery>20?34:16):0;hand.visible=state.flashlight;
  playerLamp.position.copy(camera.position);playerLamp.intensity=state.hidden?.25:.65;
  lights.forEach((l,i)=>{const powered=state.power||i===0;l.intensity=(powered?i===0?10:7:.35)*(state.reduce?1:.97+.03*Math.sin(time*13+i));});
  for(const [id,b]of Object.entries(dynamic)){const t=b.closed(state)?0:1;doorProgress[id]+=Math.sign(t-doorProgress[id])*Math.min(Math.abs(t-doorProgress[id]),dt*2.3);doors[id].position.y=doorProgress[id]*2.8;}
  for(const item of items){item.glow.intensity=state.collected.has(item.id)?0:.22+Math.sin(time*2)*.05;if(item.id==='key')item.group.visible=!state.key;}
  pursuer.update(camera,time,state.reduce);hostage.rotation.z=state.reduce?0:Math.sin(time*.8)*.004;
 }
 function location(x,z){return z<-22?'Kho hồ sơ / khu cách ly':x<-2?'Căn hộ 1304':x>2?'Phòng bảo vệ':z>0?'Sảnh thang máy':'Hành lang tầng 13';}
 function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<innerHeight?76:68;camera.updateProjectionMatrix();}
 resize();
 return {ready:pursuer.ready,get scarePortrait(){return pursuer.portrait;},renderer,scene,camera,colliders,walls,items,targets,ghost,hostage,doors,solidAt,update,resize,location,torch,regions};
 function black(){return mat('#020906',.5);}
}
