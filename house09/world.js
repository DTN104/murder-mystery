import * as T from '../vendor/three/three.module.js';
import {createPursuer} from './pursuer.js';
import {doorClosed} from './state.mjs';
export function createWorld(canvas){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=!matchMedia('(pointer:coarse)').matches;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const scene=new T.Scene();scene.background=new T.Color('#080e11');scene.fog=new T.FogExp2('#0a1112',.038);
 const camera=new T.PerspectiveCamera(67,1,.055,65);camera.rotation.order='YXZ';
 const walls=[],colliders=[],items=[],targets={},doors={},gates={},regions=[[-3,3,0,5],[-1.5,1.5,-18,0],[-8,-1.5,-8,0],[-8,-1.5,-16,-8],[1.5,8,-8,0],[1.5,8,-16,-8],[-3,3,-26,-18]];
 let seed=1909;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const mat=(color,metalness=0)=>new T.MeshStandardMaterial({color,roughness:.95,metalness});
 const metal=mat('#40493f',.23),black=mat('#111811'),rust=mat('#634638'),bone=mat('#a39f86'),red=mat('#57342e');
 const atlas=new T.Texture();atlas.colorSpace=T.SRGBColorSpace;atlas.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 const maps=[];function surface(x,y,tint='#c7cabf'){const map=atlas.clone();map.repeat.set(.496,.496);map.offset.set(x*.5+.002,y*.5+.002);maps.push(map);return new T.MeshStandardMaterial({map,color:tint,roughness:1});}
 const plaster=surface(0,1),wood=surface(1,1,'#a2aaa1'),concrete=surface(0,0,'#a6afa4'),cloth=surface(1,0,'#aaa990');
 const atlasReady=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{for(const t of maps){t.image=image;t.needsUpdate=true;}resolve();};image.onerror=()=>reject(new Error('Không tải được vật liệu căn nhà.'));image.src=new URL('./assets/decay-atlas.png',import.meta.url).href;});
 function box(w,h,d,x,y,z,m=wood,parent=scene,solid=false){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);if(solid){colliders.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2});walls.push(o);}return o;}
 function rod(r,h,x,y,z,m=metal,parent=scene){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,8),m);o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o;}
 function plane(w,h,x,y,z,m,parent=scene){const o=new T.Mesh(new T.PlaneGeometry(w,h),m);o.position.set(x,y,z);o.receiveShadow=true;parent.add(o);return o;}
 function label(lines,w=512,h=256,bg='#aaa58c',fg='#242c22'){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,w,h);g.strokeStyle='#524f3c';g.strokeRect(8,8,w-16,h-16);g.fillStyle=fg;g.textAlign='center';lines.forEach((line,i)=>{g.font=`${i?400:700} ${Math.min(h/(lines.length+1)*.7,w/Math.max(10,line.length)*1.5)}px monospace`;g.fillText(line,w/2,h*(i+1)/(lines.length+1),w-24);});const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;return new T.MeshStandardMaterial({map,roughness:1});}
 const floorY=(x,z)=>z<-18?Math.max(-1.3,(z+18)*.433333):0;
 function floor(x0,x1,z0,z1){for(let x=x0;x<x1-.01;x+=2)for(let z=z0;z<z1-.01;z+=2){const w=Math.min(2,x1-x),d=Math.min(2,z1-z),cx=x+w/2,cz=z+d/2;const g=new T.PlaneGeometry(w,d);g.rotateX(-Math.PI/2);const a=g.attributes.position;for(let i=0;i<a.count;i++)a.setY(i,floorY(cx+a.getX(i),cz+a.getZ(i)));g.computeVertexNormals();const o=new T.Mesh(g,concrete);o.position.set(cx,-.015,cz);o.receiveShadow=true;scene.add(o);}}
 function wall(x0,z0,x1,z1){const len=Math.hypot(x1-x0,z1-z0),n=Math.ceil(len/2.2);for(let i=0;i<n;i++){const t=(i+.5)/n,x=x0+(x1-x0)*t,z=z0+(z1-z0)*t,y=floorY(x,z);const panel=box(Math.max(.16,Math.abs(x1-x0)/n),3.1-y,Math.max(.16,Math.abs(z1-z0)/n),x,(3.1+y)/2,z,plaster,scene,true);const uv=panel.geometry.attributes.uv,flip=rnd()>.5,crop=.65+rnd()*.35,offset=rnd()*(1-crop);for(let k=0;k<uv.count;k++)uv.setX(k,offset+(flip?1-uv.getX(k):uv.getX(k))*crop);}}
 for(const r of regions)floor(...r);
 const segments=[[-3,0,-3,5],[3,0,3,5],[-3,5,3,5],[-3,0,-1.5,0],[1.5,0,3,0],[-1.5,0,-1.5,-2.1],[-1.5,-3.9,-1.5,-10.6],[-1.5,-12.4,-1.5,-18],[1.5,0,1.5,-2.1],[1.5,-3.9,1.5,-10.6],[1.5,-12.4,1.5,-18],[-8,0,-1.5,0],[-8,0,-8,-16],[-8,-16,-1.5,-16],[-8,-8,-6.9,-8],[-5.1,-8,-1.5,-8],[1.5,0,8,0],[8,0,8,-16],[1.5,-16,8,-16],[1.5,-8,4.6,-8],[6.4,-8,8,-8],[-3,-18,-.9,-18],[.9,-18,3,-18],[-3,-18,-3,-26],[3,-18,3,-26],[-3,-26,3,-26]];
 segments.forEach(a=>wall(...a));
 // An uneven roof with holes, exposed rafters and short hanging splinters.
 for(const [x0,x1,z0,z1]of regions){for(let z=z0+.5;z<z1;z+=1.7){const beam=box(x1-x0,.16,.14,(x0+x1)/2,2.98,z,wood);beam.rotation.z=(rnd()-.5)*.045;}for(let x=x0+.4;x<x1;x+=1.05){const o=box(.1,.15,z1-z0,x,3.08,(z0+z1)/2,wood);o.rotation.x=(rnd()-.5)*.025;}for(let i=0;i<7;i++){const x=x0+.3+rnd()*(x1-x0-.6),z=z0+.3+rnd()*(z1-z0-.6);const o=box(.55+rnd()*.7,.04,.8+rnd(),x,3.18,z,wood);o.rotation.z=(rnd()-.5)*.22;}}
 const ambient=new T.HemisphereLight('#a8bdc4','#25281e',.46);scene.add(ambient);
 function lamp(x,z,color='#bac4b2',power=4,y=2.7){const l=new T.PointLight(color,power,7,2);l.position.set(x,y,z);scene.add(l);rod(.012,.35,x,y+.25,z,black);const bulb=new T.Mesh(new T.SphereGeometry(.045,10,8),new T.MeshBasicMaterial({color}));bulb.position.set(x,y,z);scene.add(bulb);return l;}
 lamp(0,2,'#aab7a4',3);lamp(-5,-4,'#859ca8',5);lamp(5,-4,'#a0aa90',3);lamp(-5,-12,'#8199a5',3);lamp(5,-12,'#c15546',4,1.9);lamp(0,-23,'#708d8c',3,1.2);
 const torch=new T.SpotLight('#dcd6ba',40,16,.53,.68,1.6);torch.castShadow=true;torch.shadow.mapSize.set(1024,1024);torch.shadow.bias=-.001;scene.add(torch,torch.target);
 const fill=new T.PointLight('#9cae9c',.8,3);scene.add(fill);
 const flash=new T.PointLight('#dce9df',0,12);scene.add(flash);
 const hand=new T.Group();camera.add(hand);hand.position.set(.24,-.28,-.43);hand.rotation.x=Math.PI/2;rod(.035,.25,0,0,0,black,hand);rod(.055,.065,0,.14,0,metal,hand);scene.add(camera);
 function doorway(id,x,z,side){const group=new T.Group();group.position.set(x,0,z);group.rotation.y=side?Math.PI/2:0;scene.add(group);const leaf=box(1.72,2.55,.08,0,1.275,0,wood,group);leaf.rotation.z=.012;box(.12,.035,.1,.55,1.04,.07,metal,group);const mark=plane(.66,.18,0,1.9,.064,label([({bedroom:'PHÒNG NGỦ',shortcut:'CỬA THÔNG',darkroom:'PHÒNG TỐI','kitchen-link':'BẾP',basement:'HẦM'})[id]],384,96),group);mark.material.side=T.DoubleSide;doors[id]=group;gates[id]=side?{x0:x-.1,x1:x+.1,z0:z-.9,z1:z+.9}:{x0:x-.9,x1:x+.9,z0:z-.1,z1:z+.1};group.userData.baseY=0;return group;}
 doorway('bedroom',-1.5,-11.5,true);doorway('shortcut',-6,-8,false);doorway('darkroom',1.5,-11.5,true);doorway('kitchen-link',5.5,-8,false);doorway('basement',0,-18,false);
 const boards=new T.Group();scene.add(boards);for(let i=0;i<3;i++){const o=box(1.7,.16,.1,-6,1+i*.43,-7.9,wood,boards);o.rotation.z=(i-1)*.08;}
 // Front exit and tactile props.
 box(1.85,2.65,.09,0,1.3,4.85,wood);const exitSign=plane(.7,.22,0,2.2,4.78,label(['CỬA CHÍNH'],384,128));exitSign.rotation.y=Math.PI;
 function table(x,z,w=1.5,d=.7){box(w,.09,d,x,.78,z,wood,scene,true);for(const dx of [-w*.4,w*.4])for(const dz of [-d*.35,d*.35])box(.07,.75,.07,x+dx,.35,z+dz,wood);}
 table(1.65,2.5,1.7,.7);table(-6.3,-4.5,1.6,.8);table(5.8,-5.7,1.7,.8);table(5.7,-14.5,1.8,.75);
 function item(id,name,x,y,z,make,range=2.5){const group=new T.Group();group.position.set(x,y,z);scene.add(group);if(make)make(group);const glow=new T.PointLight('#c0b28d',.12,1.3);glow.position.set(0,.15,0);group.add(glow);const entry={id,label:name,point:new T.Vector3(x,y,z),group,range,glow};items.push(entry);targets[id]=entry;return entry;}
 function documentProp(lines,w=.4,h=.28){return g=>{const p=plane(w,h,0,.025,0,label(lines,512,256),g);p.rotation.x=-Math.PI/2;};}
 item('badge','Khám túi máy ảnh của Lan',1.65,.85,2.4,g=>{box(.48,.17,.32,0,0,0,black,g);rod(.065,.10,0,.12,0,metal,g);const p=plane(.3,.18,.2,.12,.05,label(['TRẦN LAN','NHIẾP ẢNH / NHÀ 09']),g);p.rotation.x=-Math.PI/2;});
 item('photo','Xem ảnh căn nhà trước khi bỏ hoang',-6.3,.86,-4.5,documentProp(['CỬA THÔNG PHÒNG NGỦ','DƯỚI Ô THOÁNG / CUỐI PHÒNG']));
 item('route','Dọn ván mở cửa thông',-6,1.3,-7.72,null,2.4);
 item('key','Lấy chìa khóa phòng ngủ',5.5,.86,-5.65,g=>{const ring=new T.Mesh(new T.TorusGeometry(.05,.012,7,14),metal);ring.rotation.x=Math.PI/2;g.add(ring);box(.02,.02,.18,0,0,.1,bone,g);box(.07,.02,.025,.02,0,.17,bone,g);});
 item('receipt','Đọc lời khai và biên nhận',6.3,.86,-5.65,documentProp(['ÔNG BẢY / BIÊN NHẬN','21:35 — 22:10'],.36,.25));
 item('bedroom-door','Mở phòng ngủ',-1.3,1.3,-11.5,null);
 item('darkroom-door','Cửa phòng tối',1.3,1.3,-11.5,null);
 // Bed: corroded rails, uneven dirty mattress, torn mosquito net.
 box(1.5,.13,2.3,-6.7,.35,-13.3,wood,scene,true);box(1.44,.18,2.2,-6.7,.49,-13.3,cloth);
 for(const x of [-7.45,-5.95])for(const z of [-14.45,-12.15])rod(.027,.95,x,.48,z,rust);
 for(const z of [-14.45,-12.15]){const rail=rod(.022,1.5,-6.7,.89,z,rust);rail.rotation.z=Math.PI/2;for(let i=0;i<6;i++)rod(.014,.45,-7.3+i*.24,.63,z,rust);}
 box(.65,.12,.35,-6.7,.64,-14.05,cloth).rotation.y=.06;
 const netGeo=new T.PlaneGeometry(1.7,1.9,12,16),v=netGeo.attributes.position;for(let i=0;i<v.count;i++){v.setZ(i,Math.sin(v.getX(i)*5+v.getY(i)*3)*.09);v.setY(i,v.getY(i)-.15*Math.sin(v.getX(i)*3));}netGeo.computeVertexNormals();const netMat=cloth.clone();netMat.transparent=true;netMat.opacity=.28;netMat.side=T.DoubleSide;netMat.depthWrite=false;const net=new T.Mesh(netGeo,netMat);net.position.set(-7.4,1.65,-12.8);net.rotation.y=.8;scene.add(net);
 function closet(id,x,z){box(1.2,2.2,.62,x,1.1,z,wood,scene,true);box(1.06,1.98,.035,x,1.12,z+.335,black);const panel=box(.53,2.07,.045,x-.33,1.1,z+.40,wood);panel.rotation.z=.05;const other=box(.53,2.07,.045,x+.42,1.06,z+.56,wood);other.rotation.y=-.55;other.rotation.z=-.035;item(id,'Se cacher',x,1.15,z+.9,null,2.1);targets[id].label='Trốn trong tủ';}
 closet('hide-living',-7.1,-6.8);closet('hide-darkroom',7,-14);
 box(1.28,2.25,.65,-3.3,1.125,-15.4,wood,scene,true);box(1.14,2.07,.04,-3.3,1.12,-15.03,black);const crooked=box(.6,2.1,.06,-2.76,1.03,-14.84,wood);crooked.rotation.y=-.5;crooked.rotation.z=-.08;
 for(const y of [.45,1.45,2.05])box(1.1,.035,.25,-3.3,y,-14.98,wood);const hanging=box(.13,1.7,.035,-3.82,1.1,-14.92,wood);hanging.rotation.z=-.055;
 item('phone','Khám điện thoại trong chiếc tủ',-3.5,.93,-14.94,g=>{box(.15,.025,.27,0,0,0,black,g);const screen=plane(.12,.2,0,.017,0,new T.MeshBasicMaterial({color:'#6c8b78'}),g);screen.rotation.x=-Math.PI/2;});
 item('echo','Chụp dấu hình người cạnh tủ',-4.5,1.4,-15,null,4.4);
 item('negative','Xem âm bản dưới đèn đỏ',5.7,.87,-14.35,g=>{box(.6,.04,.42,0,0,0,metal,g);const p=plane(.48,.32,0,.026,0,label(['HOA → CHIM → MẮT','CỬA HẦM / THỨ TỰ NGUỒN'],512,256,'#9e9b83','#252d26'),g);p.rotation.x=-Math.PI/2;});
 item('fuse','Kiểm tra bảng cầu chì',1.25,1.35,-17,g=>{box(.35,.55,.12,0,0,0,metal,g);for(let i=0;i<3;i++)box(.055,.15,.04,(i-1)*.095,-.05,.085,red,g);plane(.3,.13,0,.16,.071,label(['NGUỒN HẦM'],256,96),g);});
 const base=-1.3;
 // Hiding place for the victim: cloth-covered outline, no graphic injury.
 const remains=new T.Group();remains.position.set(-1.45,base,-24.5);scene.add(remains);box(1.15,.18,1.9,0,.1,0,black,remains);const sheet=new T.Mesh(new T.SphereGeometry(.55,16,10),cloth);sheet.scale.set(.65,.5,1.65);sheet.position.set(0,.25,0);remains.add(sheet);box(.3,.04,.2,.42,.08,.8,bone,remains);const ring=new T.Mesh(new T.TorusGeometry(.05,.012,7,12),metal);ring.position.set(.42,.13,.7);ring.rotation.x=Math.PI/2;remains.add(ring);
 item('body','Chụp hốc tường và thẻ tên',-1.45,base+.5,-24.5,null,4.3);
 item('tape','Lấy băng ghi âm',1.65,base+.6,-25,g=>{box(.34,.12,.23,0,0,0,black,g);for(const x of [-.08,.08]){const r=new T.Mesh(new T.TorusGeometry(.045,.008,6,12),bone);r.position.set(x,.07,0);r.rotation.x=-Math.PI/2;g.add(r);}});
 box(.75,.5,.5,1.65,base+.25,-25,wood,scene,true);
 item('exit','Rời nhà và bàn giao chứng cứ',0,1.2,4.7,null,2.4);
 // Broken shutters admit weak blue light and give each room a recognizable landmark.
 for(const [x,z,side]of [[-7.89,-3,1],[-7.89,-11,1],[7.89,-4,-1]]){const g=new T.Group();g.position.set(x,1.8,z);g.rotation.y=side*Math.PI/2;scene.add(g);plane(1.6,1.5,0,0,0,new T.MeshBasicMaterial({color:'#283b46'}),g);for(let i=0;i<7;i++){const o=box(1.65,.13,.045,0,-.68+i*.22,.03,wood,g);o.rotation.z=(i%3-1)*.035;}for(const dx of [-.85,.85])box(.08,1.6,.08,dx,0,.06,wood,g);const light=new T.PointLight('#8aa4b6',5,5);light.position.set(x-side*.5,1.8,z);scene.add(light);}
 // Ordinary household remnants: a torn calendar, mismatched slippers and chipped enamel basin.
 const calendar=plane(.45,.7,4.2,1.65,-7.89,label(['LỊCH CŨ','THÁNG 7','09'],256,384,'#9d9b81','#3e4335'));calendar.rotation.z=-.08;
 for(const [x,z]of [[-5.8,-11.6],[-5.45,-11.8]]){const sole=new T.Mesh(new T.SphereGeometry(.14,10,6),black);sole.scale.set(.52,.12,1.4);sole.position.set(x,.025,z);sole.rotation.y=rnd();scene.add(sole);box(.11,.04,.05,x,.055,z,metal);}
 const basin=new T.Mesh(new T.CylinderGeometry(.3,.23,.16,14,1,true),new T.MeshStandardMaterial({color:'#657b70',roughness:.9,side:T.DoubleSide}));basin.position.set(7.4,.1,-6.9);scene.add(basin);const rim=new T.Mesh(new T.TorusGeometry(.3,.018,6,18),rust);rim.rotation.x=Math.PI/2;rim.position.set(7.4,.18,-6.9);scene.add(rim);
 const chair=new T.Group();chair.position.set(-4,0,-6);scene.add(chair);box(.53,.07,.55,0,.44,0,wood,chair);for(const x of [-.22,.22])for(const z of [-.22,.22])box(.04,.46,.04,x,.21,z,wood,chair);box(.52,.48,.04,0,.7,-.24,wood,chair);
 // Rubble stays at wall edges so clues and walkable routes remain clear.
 for(const [x0,x1,z0,z1]of regions)for(let i=0;i<18;i++){const x=i%2?x0+.22+rnd()*.3:x1-.22-rnd()*.3,z=z0+.25+rnd()*(z1-z0-.5),o=box(.06+rnd()*.22,.025+rnd()*.05,.08+rnd()*.21,x,floorY(x,z)+.04,z,i%3?plaster:wood);o.rotation.y=rnd()*6;o.rotation.z=(rnd()-.5)*.2;}
 const rubble=new T.Group();rubble.visible=false;scene.add(rubble);for(let i=0;i<4;i++){const o=box(2.8,.18,.2,0,.35+i*.2,-7.2+(i%2)*.2,wood,rubble);o.rotation.z=(i%2?1:-1)*.17;}
 const pursuer=createPursuer(),ghost=pursuer.root;scene.add(ghost);
 const echo=new T.Group();scene.add(echo);const spiritMap=new T.TextureLoader().load(new URL('./assets/apparition-front.png',import.meta.url).href);spiritMap.colorSpace=T.SRGBColorSpace;const silhouette=new T.Mesh(new T.PlaneGeometry(1.2,1.8),new T.MeshBasicMaterial({map:spiritMap,color:'#a3c2b5',transparent:true,opacity:.48,alphaTest:.04,side:T.DoubleSide,depthWrite:false}));echo.add(silhouette);echo.position.set(-4.5,1.2,-15);echo.visible=false;
 // Chalk trace is only visible through the camera, aligned with the photograph target.
 const trace=plane(.7,.35,-1.45,base+.02,-24.5,label(['LAN','H'],256,128,'#7a8d78','#15261a'));trace.rotation.x=-Math.PI/2;trace.visible=false;
 function solidAt(x,z,s,r=.23){for(const [px,pz]of [[x-r,z],[x+r,z],[x,z-r],[x,z+r]])if(!regions.some(a=>px>=a[0]&&px<=a[1]&&pz>=a[2]&&pz<=a[3]))return true;for(const b of colliders)if(x+r>b.x0&&x-r<b.x1&&z+r>b.z0&&z-r<b.z1)return true;for(const [id,b]of Object.entries(gates))if(doorClosed(id,s)&&x+r>b.x0&&x-r<b.x1&&z+r>b.z0&&z-r<b.z1)return true;if(s.rubble&&x+r>-1.5&&x-r<1.5&&z+r>-7.55&&z-r<-6.85)return true;return false;}
 function blockers(s){return [...walls,...Object.entries(doors).filter(([id])=>doorClosed(id,s)).map(([,o])=>o),...(s.rubble?[rubble]:[])];}
 const direction=new T.Vector3();
 function update(s,time,dt,cameraUp=false,flashTime=0){camera.getWorldDirection(direction);torch.position.copy(camera.position);torch.position.y-=.08;torch.target.position.copy(camera.position).addScaledVector(direction,8);torch.intensity=s.flashlight&&!s.hidden?40:0;fill.position.copy(camera.position);hand.visible=s.flashlight&&!cameraUp;flash.position.copy(camera.position);flash.intensity=s.reduce?0:Math.max(0,flashTime)*110;
  for(const [id,g]of Object.entries(doors)){const shut=doorClosed(id,s);g.visible=shut;g.position.y=0;}boards.visible=!s.routeOpen;rubble.visible=s.rubble;chair.rotation.y=s.chairMoved?.35:0;chair.position.z=s.chairMoved?-5.4:-6;
  for(const item of items){item.glow.intensity=s.collected.has(item.id)?0:.14;item.group.visible=item.id==='key'?!s.collected.has('key'):true;}
  echo.visible=cameraUp&&s.collected.has('phone')&&!s.haunted;echo.lookAt(camera.position.x,echo.position.y,camera.position.z);trace.visible=cameraUp&&s.basementOpen;remains.visible=s.basementOpen;pursuer.update(camera,time,s.reduce);
 }
 function location(x,z){return z<-18?'Hầm / hốc tường':z>0?'Sảnh / cửa chính':x<-1.5?(z<-8?'Phòng ngủ':'Phòng khách'):x>1.5?(z<-8?'Phòng tối':'Bếp'):'Hành lang';}
 function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<innerHeight?76:67;camera.updateProjectionMatrix();}resize();
 return {ready:Promise.all([atlasReady,pursuer.ready]),get scarePortrait(){return pursuer.portrait;},scene,renderer,camera,items,targets,walls,doors,gates,regions,ghost,torch,echo,solidAt,blockers,floorY,location,update,resize};
}
