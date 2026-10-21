// Render the real audio graph offline: check the quiet gap, impact and cancellation.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const mode of ['normal', 'reduced', 'cancelled']) {
      const page = await browser.newPage();
      await page.evaluate(() => {
        window.AudioContext = function () {
          window.testAudio = new OfflineAudioContext(1, 48000 * 3.5, 48000);
          return window.testAudio;
        };
      });
      await page.addScriptTag({ content: fs.readFileSync(path.resolve(__dirname, '../src/audio.js'), 'utf8') });
      const result = await page.evaluate(async mode => {
        CD.audio.init(); const stop = CD.audio.startApproach(mode === 'reduced', 2.5);
        if (mode === 'cancelled') { stop(); stop(); }
        const audio = (await testAudio.startRendering()).getChannelData(0);
        const rms = (a, b) => {
          let sum = 0; const start = Math.floor(a * 48000), end = Math.floor(b * 48000);
          for (let i = start; i < end; i++) sum += audio[i] * audio[i];
          return Math.sqrt(sum / (end - start));
        };
        return { gap: rms(2.52, 2.63), impact: rms(2.67, 2.8), tail: rms(3, 3.3) };
      }, mode);
      assert.ok(result.gap < 1e-6); assert.ok(result.tail < 1e-6);
      if (mode === 'cancelled') assert.ok(result.impact < 1e-6);
      else assert.ok(result.impact > .001);
      if (mode === 'reduced') assert.ok(result.impact < .03);
      console.log('PASS', mode, result); await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
