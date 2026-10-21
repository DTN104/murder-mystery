// Physical room and props. Game rules stay in game.js.
window.CD = window.CD || {};
CD.createRoomScene = feed => {
  const T = THREE, M = CD.roomMaterials;
  const scene = new T.Scene(); scene.background = new T.Color('#080e0e'); scene.fog = new T.FogExp2('#080e0e', .035);
  const camera = new T.PerspectiveCamera(58, 1, .05, 35);
  const solid = (color, roughness = .8, metalness = 0) => new T.MeshStandardMaterial({ color, roughness, metalness });
  const wall = M.surface('wall', '#737f70'), lower = M.surface('wall', '#354f48'), wood = M.surface('wood', '#6a5136'), floor = M.surface('tile', '#586459');
  floor.map.repeat.set(8, 9); wall.map.repeat.set(3, 2);
  const metal = solid('#3b4a45', .58, .48), dark = solid('#141e1b'), black = solid('#060b09'), trim = solid('#8a8c75', .65), rust = solid('#49362b');
  function box(w, h, d, x, y, z, mat = metal, parent = scene) { const m = new T.Mesh(new T.BoxGeometry(w,h,d),mat); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m; }
  function plane(w,h,x,y,z,mat,parent=scene) { const m = new T.Mesh(new T.PlaneGeometry(w,h),mat); m.position.set(x,y,z); m.receiveShadow=true; parent.add(m); return m; }
  function cyl(r1,r2,h,x,y,z,mat=metal,parent=scene) { const m = new T.Mesh(new T.CylinderGeometry(r1,r2,h,16),mat); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m; }
  function ellipsoid(x,y,z,sx,sy,sz,mat,parent) { const m=new T.Mesh(new T.SphereGeometry(1,20,16),mat); m.position.set(x,y,z); m.scale.set(sx,sy,sz); m.castShadow=true; parent.add(m); return m; }
  // Front wall is split around the actual door opening, with a short corridor behind it.
  box(9,.12,10,0,-.08,-1,floor); box(9,.14,10,0,3.15,-1,wall);
  box(.18,3.2,10,-4.5,1.55,-1,wall); box(.18,3.2,10,4.5,1.55,-1,wall);
  box(5.7,3.2,.18,-1.65,1.55,-4,wall); box(1.6,3.2,.18,3.7,1.55,-4,wall); box(1.7,.8,.18,2.05,2.75,-4,wall);
  box(5.7,1.05,.035,-1.65,.52,-3.89,lower); box(1.6,1.05,.035,3.7,.52,-3.89,lower);
  box(5.7,.035,.045,-1.65,1.06,-3.86,trim); box(1.6,.035,.045,3.7,1.06,-3.86,trim);
  box(.035,1.05,9.8,-4.39,.52,-1,lower); box(.035,1.05,9.8,4.39,.52,-1,lower);
  box(9,.15,.12,0,.07,-3.8,dark);
  box(2.1,3,.15,2.1,1.5,-6.6,lower); box(.15,3,2.6,1.07,1.5,-5.3,lower); box(.15,3,2.6,3.13,1.5,-5.3,lower);
  // Conduit, ventilation and fluorescent fixture.
  for (const y of [2.84,2.94]) { const pipe=cyl(.022,.022,8.6,0,y,-3.65,metal); pipe.rotation.z=Math.PI/2; }
  box(1.2,.32,.07,-2.9,2.53,-3.83,dark);
  for(let i=0;i<9;i++) box(1.12,.012,.09,-2.9,2.4+i*.03,-3.77,metal);
  box(1.65,.08,.26,-.6,3,-1.9,metal);
  const tubeMat = new T.MeshStandardMaterial({color:'#c1dacb',emissive:'#a9dfcd',emissiveIntensity:2});
  box(1.45,.025,.11,-.6,2.95,-1.9,tubeMat);
  // Desk. Thick top, visible legs and drawers.
  box(2.85,.11,1.4,-.55,.77,-1.2,wood);
  box(2.85,.08,.07,-.55,.71,-.48,rust);
  for(const x of [-1.83,.73]) for(const z of [-1.75,-.62]) box(.07,.7,.07,x,.35,z,metal);
  box(.56,.63,1.1,-1.48,.38,-1.25,lower);
  for(let i=0;i<3;i++) { box(.53,.18,.04,-1.48,.23+i*.19,-.67,metal); box(.16,.018,.035,-1.48,.24+i*.19,-.64,trim); }
  // CRT, inset glass and live surveillance texture.
  box(.88,.68,.56,-.57,1.26,-1.54,dark);
  box(.95,.73,.12,-.57,1.26,-1.23,metal);
  box(.78,.55,.045,-.57,1.3,-1.15,black);
  const feedTexture = M.texture(feed); feedTexture.minFilter=T.LinearFilter; feedTexture.generateMipmaps=false;
  const screenMat = new T.MeshBasicMaterial({map:feedTexture,color:'#a4cdb4',toneMapped:false});
  const screen=plane(.70,.435,-.57,1.32,-1.121,screenMat); screen.name='crt-screen';
  box(.26,.10,.25,-.57,.88,-1.48,dark); box(.58,.035,.42,-.57,.835,-1.42,metal);
  plane(.34,.045,-.69,.98,-1.162,M.label(['KTS / CCTV'], '#283731','#9cae9e',256,32));
  const green = new T.MeshBasicMaterial({color:'#b8eaae'}), red=new T.MeshBasicMaterial({color:'#b83b28'});
  box(.025,.018,.01,-.24,1.01,-1.16,green);
  for(let i=0;i<6;i++) box(.006,.19,.012,-.97+i*.018,1.31,-1.184,black);
  // Keyboard and curled cord.
  const keys=new T.Group(); keys.position.set(-.58,.85,-.7); keys.rotation.x=-.07; scene.add(keys);
  box(.79,.035,.24,0,0,0,dark,keys);
  for(let r=0;r<4;r++) for(let k=0;k<13;k++) box(.047,.014,.035,-.36+k*.057,.023,-.085+r*.049,k===12?trim:metal,keys);
  box(.24,.014,.032,0,.027,.08,trim,keys);
  // Desk lamp with a lit underside.
  cyl(.15,.18,.035,-1.66,.85,-1.52,metal); cyl(.018,.018,.48,-1.66,1.08,-1.52,metal);
  const lamp=cyl(.1,.23,.19,-1.66,1.39,-1.52,lower); lamp.rotation.z=-.13;
  const bulbMat=new T.MeshBasicMaterial({color:'#f6d7a0'}); cyl(.18,.18,.012,-1.66,1.288,-1.52,bulbMat);
  // Radio and a few everyday props.
  const radio = new T.Group(); radio.position.set(.25,1,-1.16); radio.rotation.y=-.12; scene.add(radio);
  box(.26,.33,.16,0,0,0,dark,radio);
  box(.19,.07,.01,0,.075,.087,new T.MeshBasicMaterial({color:'#344f38'}),radio);
  for(let i=0;i<6;i++) box(.19,.008,.012,0,-.025-i*.018,.085,metal,radio);
  cyl(.009,.009,.38,.08,.35,0,black,radio); cyl(.03,.03,.045,-.065,.18,0,metal,radio);
  const radioLED=box(.015,.015,.012,.085,.08,.095,green,radio);
  for(let i=0;i<3;i++) { const paper=box(.35,.006,.24,-1.08,.837+i*.008,-.83,solid(i===2?'#b4b196':'#6b7161')); paper.rotation.y=-.2+i*.13; }
  cyl(.07,.06,.15,.59,.91,-.85,trim);
  const handle=new T.Mesh(new T.TorusGeometry(.052,.012,8,20),trim); handle.position.set(.66,.93,-.85); scene.add(handle);
  // Board on the front wall. Notes get painted only when the note list changes.
  box(1.65,1.12,.1,-2.35,1.85,-3.79,wood);
  const boardCanvas=M.canvas(1024,640),boardTexture=M.texture(boardCanvas);
  plane(1.53,1,-2.35,1.85,-3.727,new T.MeshStandardMaterial({map:boardTexture,roughness:1}));
  let noteKey=null;
  function updateNotes(notes) {
    const key=JSON.stringify(notes); if(key===noteKey)return;noteKey=key;
    const c=boardCanvas.getContext('2d'); c.fillStyle='#635a3b';c.fillRect(0,0,1024,640);
    c.fillStyle='#c0b9a0';c.font='bold 30px monospace';c.fillText('CA ĐÊM / HỒ SƠ B1',40,52);
    const entries=notes.length?notes.slice(-9):['18 / 10 · CA TRỰC 00:00–06:00','Mở hồ sơ trên CRT để ghi nhận bằng chứng.','KIỂM TRA CỬA. ĐỪNG CHỈ NHÌN MÀN HÌNH.'];
    entries.forEach((s,i)=>{const x=36+(i%3)*328,y=84+Math.floor(i/3)*180;c.save();c.translate(x,y);c.rotate((i%3-1)*.025);c.fillStyle=i===2?'#b9bca7':'#d2cbb2';c.fillRect(0,0,300,154);c.fillStyle='#872c24';c.beginPath();c.arc(150,10,6,0,Math.PI*2);c.fill();c.fillStyle='#272d24';c.font='20px monospace';let row='',line=0;for(const word of s.split(' ')){if(c.measureText(row+word).width>266){c.fillText(row,15,42+line*25);row='';line++;if(line>3)break;}row+=word+' ';}if(line<=3)c.fillText(row,15,42+line*25);c.restore();});boardTexture.needsUpdate=true;
  }
  updateNotes([]);
  // Filing shelves to the left, with folders and storage boxes.
  for(const x of [-4.02,-3.22]) box(.045,2.15,.045,x,1.08,-2.6,metal);
  for(let row=0;row<4;row++) { const y=.22+row*.52;box(.88,.035,.5,-3.62,y,-2.6,metal);
    for(let i=0;i<6;i++){const h=.3+(i%3)*.025;box(.10,h,.29,-3.94+i*.128,y+h/2+.02,-2.59,solid(['#605e46','#474f41','#69644e'][i%3]));box(.055,.045,.008,-3.94+i*.128,y+h*.65,-2.438,trim);}}
  plane(.48,.7,-.92,2.05,-3.885,M.label(['QUY ĐỊNH','BÀN GIAO','TRƯỚC 06:00'], '#b5b099','#593c32'));
  // Door: four opaque sections around a window, metal bars and a view into the corridor.
  const dx=2.05,dz=-3.84;
  for(const x of [dx-.69,dx+.69])box(.11,2.48,.23,x,1.24,dz,metal);
  box(1.48,.1,.23,dx,2.5,dz,metal);
  box(1.26,1.28,.09,dx,.65,dz,lower);box(1.26,.38,.09,dx,2.23,dz,lower);
  box(.36,.76,.09,dx-.45,1.66,dz,lower);box(.36,.76,.09,dx+.45,1.66,dz,lower);
  for(const x of [dx-.285,dx+.285])box(.035,.78,.13,x,1.66,dz+.02,metal);
  for(const y of [1.27,2.05])box(.6,.035,.13,dx,y,dz+.02,metal);
  for(let i=-1;i<=1;i++)box(.009,.75,.012,dx+i*.16,1.66,dz+.075,metal);
  const glass=new T.MeshPhysicalMaterial({color:'#78968a',transparent:true,opacity:.09,roughness:.5,depthWrite:false});
  plane(.55,.73,dx,1.66,dz+.08,glass);
  plane(.64,.20,dx,1.04,dz+.052,M.label(['B1—07'], '#859184','#243830'));
  box(.19,.028,.08,dx-.42,.92,dz+.12,trim);
  const bolt=box(1.48,.045,.065,dx,.77,dz+.13,trim);bolt.visible=false;
  // Lock panel next to the door.
  box(.37,.55,.12,3.03,1.31,-3.78,metal);
  plane(.31,.16,3.03,1.47,-3.71,M.label(['UPS / KHÓA'],'#1b2722','#b9c9ad',384,160));
  const lockLED=box(.12,.045,.015,3.03,1.33,-3.71,green);
  const lockButton=box(.25,.12,.04,3.03,1.17,-3.69,dark);lockButton.name='lock-button';
  plane(.21,.07,0,0,.027,M.label(['KHÓA'],'#273a32','#b6c4ab',256,64),lockButton);
  plane(.8,.16,dx,2.73,-3.87,M.label(['KHU VỰC HẠN CHẾ'],'#78382b','#c8b99b',512,96));
  // An actual articulated silhouette behind the window.
  const ghost=new T.Group();ghost.name='door-entity';ghost.position.set(dx,0,-4.19);scene.add(ghost);
  const coat=solid('#070c0b',1),skin=solid('#b8b6a4',.93),socket=solid('#030504',1);
  const torso=cyl(.22,.31,.85,0,1.12,0,coat,ghost);torso.scale.z=.65;
  ellipsoid(0,1.45,0,.3,.17,.15,coat,ghost);
  for(const x of [-.13,.13]) {cyl(.09,.065,.7,x,.4,0,coat,ghost);ellipsoid(x,.08,.07,.09,.07,.19,black,ghost);}
  for(const sign of [-1,1]){const arm=cyl(.085,.045,.83,sign*.29,1.02,.01,coat,ghost);arm.rotation.z=sign*.12;ellipsoid(sign*.34,.57,.03,.044,.12,.04,skin,ghost);}
  const head=new T.Group();head.position.set(.025,1.8,.015);head.rotation.z=.23;ghost.add(head);
  ellipsoid(0,0,0,.125,.195,.115,skin,head);
  ellipsoid(-.048,.035,.102,.037,.024,.018,socket,head);ellipsoid(.048,.035,.102,.039,.027,.018,socket,head);
  ellipsoid(.006,-.084,.108,.026,.045,.013,socket,head);ellipsoid(0,-.006,.115,.019,.035,.025,skin,head);
  ghost.visible=false;
  const ambient=new T.HemisphereLight('#a8c9bd','#1f2721',.7);scene.add(ambient);
  const ceiling=new T.PointLight('#bbdccb',18,9,2);ceiling.position.set(-.6,2.75,-1.9);scene.add(ceiling);
  const deskLight=new T.SpotLight('#ffd19a',12,5,Math.PI/3,.65,1.5);deskLight.position.set(-1.66,1.27,-1.52);deskLight.target.position.set(-1.3,.7,-1.1);deskLight.castShadow=true;deskLight.shadow.mapSize.set(1024,1024);deskLight.shadow.bias=-.001;scene.add(deskLight,deskLight.target);
  const crtLight=new T.PointLight('#83c7a3',1.3,2.4,2);crtLight.position.set(-.57,1.3,-.98);scene.add(crtLight);
  const hallLight=new T.PointLight('#88b8ad',5,4,2);hallLight.position.set(2.1,2.35,-4.6);scene.add(hallLight);
  const anchors={mon:{point:new T.Vector3(-.57,1.3,-1.1),mesh:screen},door:{point:new T.Vector3(3.03,1.17,-3.65),mesh:lockButton},radio:{point:new T.Vector3(.25,1,-1.06),mesh:radio}};
  function update(g,tm) {
    const power=g.ups>0,level=g.reduce?1:g.light;
    ceiling.intensity=power?18*level:0;deskLight.intensity=power?12*level:0;crtLight.intensity=power?1.3:0;
    ambient.intensity=power?.7:.11;tubeMat.emissiveIntensity=power?2*level:0;bulbMat.color.set(power?'#f6d7a0':'#22271d');
    screenMat.color.set(power?'#b1d4be':'#000000');bolt.visible=g.door;
    lockLED.material=power?(g.door?red:green):black;radioLED.visible=power&&!!g.unread&&(g.reduce||Math.sin(tm*6)>0);
    ghost.visible=g.ent.at==='door'||g.ent.at==='cam02';ghost.position.z=g.ent.at==='door'?-4.19:-5.8;
    ghost.position.x=dx+(g.reduce?0:Math.sin(tm*.8)*.015);head.rotation.z=.23+(g.reduce?0:Math.sin(tm*.5)*.025);
    updateNotes(g.notes);
  }
  function dispose(){const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const value of Object.values(m))if(value?.isTexture)textures.add(value);}});textures.forEach(t=>t.dispose());materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());}
  return {scene,camera,anchors,feedTexture,screenMat,ghost,head,bolt,deskLight,update,dispose};
};
