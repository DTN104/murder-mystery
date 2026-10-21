const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {startServer}=require('./test-server.cjs');
const output=path.resolve(__dirname,'../_preview/room-3d');fs.mkdirSync(output,{recursive:true});
(async()=>{
 const server=await startServer(),browser=await chromium.launch({channel:'chrome',headless:true});
 const errors=[],missing=[],report=[];
 const attach=async(p)=>{p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&r.url().startsWith(server.url))missing.push(r.url());});await p.route('https://**',r=>r.fulfill({body:'',contentType:'text/css'}));await p.addInitScript(()=>{Element.prototype.requestFullscreen=async()=>{};});};
 const open=async(p,url='desk.html')=>{await p.goto(server.url+'/'+url);await p.waitForFunction(()=>window.CD?.assets.loaded===CD.assets.total&&!document.querySelector('#start').disabled);await p.locator('#start').click();await p.evaluate(()=>{CD.G.speed=0;CD.G.ent.next=1e9;});await p.waitForTimeout(400);};
 const state=p=>p.evaluate(()=>CD.room.diagnostics);
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});await attach(page);await open(page);
  assert.equal((await state(page)).webgl,true);await page.screenshot({path:path.join(output,'01-desk.png')});
  assert.equal(await page.locator('#hot-mon').isVisible(),true,'CRT hotspot visible at desk');
  await page.locator('#hot-mon').click();await page.waitForFunction(()=>!document.querySelector('#monitor').hidden);assert.ok((await state(page)).camera[2]<0);
  await page.locator('[data-tab="files"]').click();await page.locator('#evlist button').first().click();assert.ok(await page.evaluate(()=>CD.G.notes.length>0));
  await page.locator('#radiobtn').click();await page.evaluate(()=>{CD.G.speed=10;});await page.locator('#chips button').first().click();await page.evaluate(()=>{CD.G.speed=0;});assert.ok(await page.locator('#msgs .m').count()>0);await page.locator('#radio-close').click();
  await page.screenshot({path:path.join(output,'04-investigation.png')});
  const yaw=(await state(page)).yaw;await page.keyboard.press('ArrowRight');assert.equal((await state(page)).yaw,yaw,'No room movement while reading');
  await page.keyboard.press('Escape');await page.waitForTimeout(400);
  await page.locator('#look-door').click();await page.waitForTimeout(500);assert.ok((await state(page)).yaw>.5);
  await page.evaluate(()=>document.querySelector('#d-door').click());await page.waitForTimeout(40);assert.equal((await state(page)).ghost,true);assert.equal((await state(page)).ghostDepth,-4.19);
  await page.screenshot({path:path.join(output,'02-door.png')});
  assert.equal(await page.locator('#hot-door').isVisible(),true);await page.locator('#hot-door').click();await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>CD.G.door),true);assert.equal(await page.evaluate(()=>CD.G.ent.at),'cam03');assert.equal((await state(page)).ghost,false);
  await page.locator('#look-left').click();await page.waitForTimeout(500);await page.screenshot({path:path.join(output,'03-board.png')});
  await page.locator('#look-desk').click();await page.waitForTimeout(500);await page.locator('#look-desk').blur();
  await page.keyboard.press('Space');await page.waitForFunction(()=>!document.querySelector('#monitor').hidden);await page.keyboard.press('Escape');await page.waitForTimeout(350);
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(300);await page.keyboard.up('ArrowRight');assert.ok((await state(page)).yaw>.1);
  await page.locator('#look-desk').click();await page.waitForTimeout(400);await page.mouse.move(1437,400);await page.waitForTimeout(300);await page.mouse.move(720,800);assert.ok((await state(page)).yaw>.1,'Edge look rotates the camera');
  // Actual geometry must stay allocated once across resets.
  const baseline=(await state(page)).memory;
  for(let i=0;i<4;i++){await page.evaluate(()=>{CD.monitor.setLean(true);document.querySelector('#retry').click();CD.G.speed=0;});await page.waitForTimeout(350);assert.equal(await page.locator('#monitor').isVisible(),false);assert.equal((await state(page)).lean,0);}
  assert.deepEqual((await state(page)).memory,baseline,'Restart must not allocate more GPU resources');
  // A pending lean must not reopen the monitor after death or retry.
  await page.evaluate(()=>CD.monitor.setLean(true));await page.waitForTimeout(90);await page.evaluate(()=>document.querySelector('#d-scare').click());await page.waitForTimeout(400);assert.equal(await page.locator('#monitor').isVisible(),false);
  await page.evaluate(()=>{document.querySelector('#retry').click();CD.G.speed=0;});await page.waitForTimeout(500);assert.equal(await page.locator('#monitor').isVisible(),false);
  // Reduced motion skips camera travel, notes survive, and victory still submits.
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>CD.monitor.setLean(true));await page.waitForTimeout(70);assert.equal((await state(page)).lean,1);
  await page.evaluate(()=>{CD.monitor.fillBoard();CD.monitor.setTab('board');});await page.locator('#submit').click();assert.equal(await page.locator('#over').isVisible(),true);await page.locator('#over-btn').click();await page.evaluate(()=>{CD.G.speed=0;});
  await page.evaluate(()=>{CD.G.ups=.001;CD.G.speed=10;});await page.waitForFunction(()=>CD.G.ups===0);assert.equal(await page.evaluate(()=>CD.G.door),false);assert.equal(await page.locator('#quick-lock').isDisabled(),true);await page.screenshot({path:path.join(output,'05-power-out.png')});
  await page.evaluate(()=>{document.querySelector('#retry').click();CD.G.speed=0;});await page.emulateMedia({reducedMotion:'no-preference'});
  const perf=await page.evaluate(()=>new Promise(resolve=>{const times=[];let prev=performance.now();function sample(t){times.push(t-prev);prev=t;if(times.length<120)requestAnimationFrame(sample);else{times.shift();times.sort((a,b)=>a-b);resolve({medianFrameMs:times[Math.floor(times.length/2)],p95FrameMs:times[Math.floor(times.length*.95)],room:CD.room.diagnostics,gpu:document.querySelector('#room').getContext('webgl2').getParameter(7937)});}}requestAnimationFrame(sample);}));report.push({desktop:perf});
  // A power-loss event from the previous shift must not spawn an entity after retry.
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.evaluate(()=>{CD.G.ups=.001;CD.G.speed=10;});await page.clock.runFor(32);
  await page.evaluate(()=>{document.querySelector('#retry').click();CD.G.speed=0;});await page.clock.runFor(15000);
  assert.equal(await page.evaluate(()=>CD.G.ent.at),'cam03');assert.equal(await page.evaluate(()=>CD.G.dead),false);await page.clock.resume();
  console.log('PASS desktop: 3D, projected clicks, controls, investigation, victory, power, lean cancellation, GPU resources');
  // Real touch pointer events over the canvas, followed by a resize.
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await attach(mobile);await open(mobile);
  const touch=await mobile.context().newCDPSession(mobile);
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:300,y:350}]});
  await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:150,y:350}]});
  await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await mobile.waitForTimeout(400);assert.ok((await state(mobile)).yaw>.4);
  await mobile.locator('#look-door').click();await mobile.waitForTimeout(400);await mobile.evaluate(()=>document.querySelector('#d-door').click());await mobile.screenshot({path:path.join(output,'06-mobile-door.png')});
  await mobile.locator('#quick-lock').click();assert.equal(await mobile.evaluate(()=>CD.G.door),true);
  await mobile.locator('#flip').click();await mobile.waitForFunction(()=>!document.querySelector('#monitor').hidden);await mobile.locator('[data-tab="files"]').click();await mobile.locator('#evlist button').first().click();await mobile.screenshot({path:path.join(output,'07-mobile-files.png')});
  await mobile.setViewportSize({width:844,height:390});await mobile.keyboard.press('Escape');await mobile.waitForTimeout(400);assert.equal(await mobile.evaluate(()=>CD.room.W),844);console.log('PASS touch, mobile evidence, lock and landscape resize');
  await mobile.close();
  // Built distribution, without any external network dependency.
  const built=await browser.newPage();await attach(built);await open(built,'dist/desk.html');assert.equal((await state(built)).webgl,true);await built.locator('#flip').click();await built.waitForFunction(()=>!document.querySelector('#monitor').hidden);await built.close();console.log('PASS dist with external network blocked');
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  // Context-loss and no-WebGL are intentional errors, checked on separate pages.
  await page.evaluate(()=>document.querySelector('#room').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());await page.waitForFunction(()=>!document.querySelector('#room-error').hidden);assert.equal(await page.evaluate(()=>CD.G.started),false);await page.close();
  const noGL=await browser.newPage();await noGL.addInitScript(()=>{const orig=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:orig.call(this,type,...args);};});await noGL.goto(server.url);await noGL.locator('#room-error').waitFor({state:'visible'});assert.equal(await noGL.locator('#start').isDisabled(),true);await noGL.close();console.log('PASS context loss and missing WebGL recovery');
  fs.writeFileSync(path.join(output,'test-results.json'),JSON.stringify({passed:true,report,errors,missing},null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
