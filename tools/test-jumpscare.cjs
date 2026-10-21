// Run with Playwright installed, or point PLAYWRIGHT_MODULE to playwright-core.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { startServer } = require('./test-server.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '_preview', 'jumpscare-impact');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const server = await startServer();
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.addInitScript(() => { Element.prototype.requestFullscreen = async () => {}; });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    const open = async (file = 'desk.html') => {
      await page.goto(server.url + '/' + file);
      await page.waitForFunction(() => window.CD?.room && !document.querySelector('#start').disabled);
      await page.waitForFunction(() => CD.assets.loaded === CD.assets.total);
      await page.clock.install(); await page.clock.pauseAt(new Date());
      await page.locator('#start').click(); await page.clock.runFor(32);
    };
    const trigger = () => page.evaluate(() => document.querySelector('#d-scare').click());
    const phase = () => page.locator('#scare').getAttribute('class');
    await open();
    await page.evaluate(() => { CD.monitor.addNote('Test retained note'); CD.G.speed = 10; });
    await trigger();
    const timeAtDeath = await page.evaluate(() => CD.G.t);
    await page.evaluate(() => {
      window.originalFaceDraws = 0;
      const draw = CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
        if (image === CD.assets.IMG.no_face) window.originalFaceDraws++;
        return draw.call(this, image, ...args);
      };
    });
    await page.clock.runFor(2400);
    assert.equal(await phase(), 'ov p-static', 'Interference must last at least 2.4 seconds');
    assert.equal(await page.evaluate(() => window.originalFaceDraws), 0);
    await page.screenshot({ path: path.join(output, '00-long-interference.png') });
    await page.clock.runFor(200);
    assert.equal(await phase(), 'ov p-black', 'Black gap must precede the face');
    assert.equal(await page.evaluate(() => window.originalFaceDraws), 0);
    await page.screenshot({ path: path.join(output, '01-black-gap.png') });
    await page.clock.runFor(120); assert.equal(await phase(), 'ov p-face');
    assert.ok(await page.evaluate(() => window.originalFaceDraws > 0), 'Impact must use the original no_face image');
    await page.screenshot({ path: path.join(output, '02-impact.png') });
    await page.clock.runFor(80); assert.equal(await phase(), 'ov p-face');
    await page.screenshot({ path: path.join(output, '03-recoil.png') });
    assert.equal(await page.evaluate(() => CD.G.t), timeAtDeath, 'Game time must freeze during death, even at ×10');
    await page.clock.runFor(200); assert.equal(await phase(), 'ov p-black');
    await page.clock.runFor(400); assert.equal(await phase(), 'ov p-end');
    await page.locator('#retry').click();
    assert.deepEqual(await page.evaluate(() => ({ dead: CD.G.dead, ups: CD.G.ups, t: CD.G.t, notes: CD.G.notes })),
      { dead: false, ups: 100, t: 0, notes: ['Test retained note'] });
    await page.clock.runFor(1000); assert.equal(await page.locator('#scare').isVisible(), false);
    console.log('PASS 2.5-second interference, black gap and original face impact, frozen time at ×10, silence phase, retry and retained notes');

    // Mid-animation reset must cancel the old sequence instead of reopening its overlay.
    await trigger(); await page.clock.runFor(2570);
    await page.evaluate(() => document.querySelector('#retry').click());
    await page.clock.runFor(5000); assert.equal(await page.locator('#scare').isVisible(), false);
    console.log('PASS cancellation during the pre-impact gap');

    for (const speed of [1, 3]) {
      await page.evaluate(s => { CD.G.speed = s; }, speed); await trigger();
      await page.clock.runFor(2400); assert.equal(await phase(), 'ov p-static');
      await page.clock.runFor(320); assert.equal(await phase(), 'ov p-face');
      await page.clock.runFor(700); assert.equal(await phase(), 'ov p-end'); await page.locator('#retry').click();
    }
    console.log('PASS real-time timing at ×1 and ×3');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => { CD.G.reduce = true; CD.audio.setReduce(true); });
    await trigger(); await page.clock.runFor(2800);
    await page.screenshot({ path: path.join(output, '05-reduced-mobile.png') });
    assert.equal(await phase(), 'ov p-face');
    await page.clock.runFor(700); await page.locator('#retry').click();
    console.log('PASS reduced horror and portrait layout');

    await page.evaluate(() => { CD.G.reduce = false; CD.audio.setReduce(false); });
    await trigger(); await page.clock.runFor(2800);
    await page.screenshot({ path: path.join(output, '06-close-mobile.png') });
    await page.clock.runFor(700); await page.locator('#retry').click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await trigger(); await page.clock.runFor(2800);
    await page.screenshot({ path: path.join(output, '07-system-reduced-motion.png') });
    await page.clock.runFor(700); await page.locator('#retry').click();
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.evaluate(() => { delete CD.assets.IMG.no_front; delete CD.assets.IMG.cam02; delete CD.assets.IMG.no_face; });
    await trigger(); await page.clock.runFor(2800);
    await page.screenshot({ path: path.join(output, '08-fallback.png') });
    await page.clock.runFor(700); assert.equal(await phase(), 'ov p-end');
    console.log('PASS portrait approach, OS reduced-motion preference, missing-image fallback');
    await page.close();

    const built = await browser.newPage(); built.on('pageerror', e => errors.push(e.message));
    await built.route('https://fonts.googleapis.com/**', route => route.abort());
    await built.goto(server.url + '/dist/desk.html');
    await built.waitForFunction(() => window.CD?.room && !document.querySelector('#start').disabled);
    await built.waitForFunction(() => CD.assets.loaded === CD.assets.total);
    await built.locator('#start').click();
    await built.evaluate(() => document.querySelector('#d-scare').click());
    await built.waitForFunction(() => document.querySelector('#scare').className === 'ov p-end', null, { timeout: 10000 });
    await built.locator('#retry').click();
    assert.equal(await built.locator('#scare').isVisible(), false);
    assert.deepEqual(errors, []);
    console.log('PASS built game in real time; no JavaScript errors');
  } finally { await browser.close(); await server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
