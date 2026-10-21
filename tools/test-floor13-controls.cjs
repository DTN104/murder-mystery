const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {startServer}=require('./test-server.cjs');
(async()=>{
 const server=await startServer(),browser=await chromium.launch({channel:'chrome',headless:true});
 const output=path.resolve(__dirname,'../_preview/floor13-controls');fs.mkdirSync(output,{recursive:true});
 const context=await browser.newContext({viewport:{width:1280,height:800},recordVideo:{dir:output,size:{width:960,height:600}}});
 const errors=[],checks=[];
 const open=async(p)=>{p.on('pageerror',e=>errors.push(e.message));await p.goto(server.url);await p.waitForFunction(()=>window.case13&&!document.querySelector('#start').disabled);await p.locator('#start').click();await p.locator('#help-play').click();};
 try{
  const page=await context.newPage();await open(page);
  await page.locator('#look-button').click();await page.waitForFunction(()=>document.pointerLockElement===document.querySelector('#world'));
  const before=await page.evaluate(()=>case13.world.camera.rotation.y);
  await page.mouse.move(740,380);await page.mouse.move(930,390,{steps:8});await page.waitForTimeout(100);
  assert.notEqual(await page.evaluate(()=>case13.world.camera.rotation.y),before,'Look without holding a mouse button');
  const pos=await page.evaluate(()=>case13.world.camera.position.toArray());
  await page.keyboard.down('KeyW');await page.mouse.move(1010,410,{steps:6});await page.waitForTimeout(400);await page.keyboard.up('KeyW');
  assert.ok(await page.evaluate(p=>case13.world.camera.position.distanceTo({x:p[0],y:p[1],z:p[2]})>.3,pos));
  checks.push('Pointer lock and simultaneous mouse look + keyboard movement');
  await page.keyboard.press('KeyJ');await page.waitForFunction(()=>!document.pointerLockElement);assert.equal(await page.locator('#modal').isVisible(),true);
  await page.locator('#modal-close').click();await page.waitForFunction(()=>!!document.pointerLockElement);checks.push('Journal releases pointer and restores mouse look when closed');
  await page.keyboard.press('Escape');await page.locator('#resume').waitFor();await page.waitForTimeout(300);assert.equal(await page.locator('#modal').isVisible(),true);assert.equal(await page.evaluate(()=>!!document.pointerLockElement),false);
  const elapsed=await page.evaluate(()=>case13.state.elapsed);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>case13.state.elapsed),elapsed);checks.push('Native pointer release pauses game');
  // Do not resume pointer capture from this deliberate pause, to exercise keyboard-only controls.
  await page.locator('#pause-help').click();await page.locator('#mouse-sensitivity').focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#sensitivity-value').innerText(),'60%');
  await page.screenshot({path:path.join(output,'controls.png')});await page.locator('#help-play').click();
  const yaw=await page.evaluate(()=>case13.world.camera.rotation.y);
  await page.keyboard.down('KeyQ');await page.waitForTimeout(250);await page.keyboard.up('KeyQ');assert.ok(await page.evaluate(()=>case13.world.camera.rotation.y)>yaw+.15);
  await page.keyboard.down('KeyR');await page.waitForTimeout(250);await page.keyboard.up('KeyR');
  await page.evaluate(()=>case13.world.camera.rotation.x=.8);await page.keyboard.press('KeyC');assert.equal(await page.evaluate(()=>case13.world.camera.rotation.x),0);
  checks.push('Q/R keyboard turns, C recenters, sensitivity persists');
  // Space uses the same interaction path as E.
  await page.evaluate(()=>{case13.world.camera.position.set(0,1.64,-1.5);const p=case13.world.targets.power.point;case13.world.camera.lookAt(p.x,p.y,p.z);});
  await page.waitForFunction(()=>case13.active?.id==='power');await page.keyboard.press('Space');assert.equal(await page.evaluate(()=>case13.state.power),true);checks.push('Space interaction');
  await page.reload();await page.waitForFunction(()=>window.case13);assert.equal(await page.evaluate(()=>localStorage.getItem('tang13-mouse-sensitivity')),'0.6');
  // Hosts without pointer-lock support still allow button-free hover look.
  const fallback=await context.newPage();await fallback.addInitScript(()=>{Element.prototype.requestPointerLock=undefined;localStorage.removeItem('tang13-checkpoint-v1');});await open(fallback);
  await fallback.locator('#look-button').click();await fallback.mouse.move(600,400);await fallback.mouse.move(800,420,{steps:5});const fallbackYaw=await fallback.evaluate(()=>case13.world.camera.rotation.y);assert.ok(Math.abs(fallbackYaw)>.1);
  await fallback.keyboard.press('Escape');await fallback.locator('#resume').waitFor();const paused=await fallback.evaluate(()=>case13.world.camera.rotation.y);await fallback.mouse.move(300,300);assert.equal(await fallback.evaluate(()=>case13.world.camera.rotation.y),paused);checks.push('No pointer-lock API fallback, Esc pauses and stops hover look');
  await fallback.close();
  const race=await context.newPage();await race.addInitScript(()=>localStorage.removeItem('tang13-checkpoint-v1'));await open(race);await race.locator('#look-button').evaluate(el=>el.addEventListener('click',()=>document.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyJ',bubbles:true}))));await race.locator('#look-button').click();await race.waitForTimeout(400);assert.equal(await race.locator('#modal').isVisible(),true);assert.equal(await race.evaluate(()=>!!document.pointerLockElement),false);await race.keyboard.press('Escape');assert.equal(await race.evaluate(()=>!!document.pointerLockElement),false);await race.close();checks.push('Opening journal during capture request cancels capture; Esc closes journal without recapture');
  assert.deepEqual(errors,[]);
  const video=page.video();await context.close();await video.saveAs(path.join(output,'controls.webm'));
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({passed:true,checks,errors},null,2));console.log('PASS '+checks.length+' controls checks\n'+checks.join('\n'));
 }finally{await browser.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
