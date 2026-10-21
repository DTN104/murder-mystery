// CA ĐÊM — tiện ích chung (DOM, số, vẽ canvas cơ bản)
window.CD = window.CD || {};
CD.util = (() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const pad = n => String(n).padStart(2, '0');
  const fmt = t => { t = Math.max(0, Math.floor(t)); return `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}`; };
  const fmtHM = t => fmt(t).slice(0, 5);
  // "HH:MM" -> giây in-game
  const hms = s => { const [h, m] = s.split(':').map(Number); return h * 3600 + (m || 0) * 60; };
  const h1 = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const HUDF = 'Barlow Condensed, Arial Narrow, Arial, sans-serif';
  const realNow = () => performance.now() / 1000;

  // nhiễu analog: một canvas nhỏ 160x90 phóng to, vẽ lại mỗi frame
  const nz = document.createElement('canvas'); nz.width = 160; nz.height = 90;
  const nctx = nz.getContext('2d'); const nimg = nctx.createImageData(160, 90);
  function noise(c, w, h, amount) {
    const d = nimg.data;
    for (let i = 0; i < d.length; i += 4) { const v = (Math.random() * 255) | 0; d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255; }
    nctx.putImageData(nimg, 0, 0);
    c.save(); c.globalAlpha = amount; c.imageSmoothingEnabled = false; c.drawImage(nz, 0, 0, w, h); c.restore();
  }
  // nhiễu mịn hơn (jumpscare, màn nhiễu) — tạo mới mỗi lần gọi
  function fineNoise(c, w, h, amount, nw, nh) {
    const t = document.createElement('canvas'); t.width = nw; t.height = nh;
    const tc = t.getContext('2d'), im = tc.createImageData(nw, nh), d = im.data;
    for (let i = 0; i < d.length; i += 4) { const v = (Math.random() * 255) | 0; d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255; }
    tc.putImageData(im, 0, 0); c.save(); c.globalAlpha = amount; c.drawImage(t, 0, 0, w, h); c.restore();
  }
  function vignette(c, w, h, k) {
    const g = c.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.95);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${k || 0.78})`);
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  }
  function tint(c, w, h, col) { c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = col; c.fillRect(0, 0, w, h); c.restore(); }
  // vẽ ảnh kiểu "cover" vào khung
  function cover(c, im, x, y, w, h) {
    const s = Math.max(w / im.width, h / im.height), dw = im.width * s, dh = im.height * s;
    c.drawImage(im, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  }
  // sprite nhân vật: x = tâm chân, footY = đường chân, h = chiều cao
  function sprite(c, im, x, footY, h, o) {
    o = o || {}; const w = h * im.width / im.height; c.save();
    if (o.alpha != null) c.globalAlpha = o.alpha;
    if (o.flip) { c.translate(x, 0); c.scale(-1, 1); x = 0; }
    c.drawImage(im, x - w / 2, footY - h, w, h); c.restore();
  }
  return { $, $$, rnd, clamp, lerp, pad, fmt, fmtHM, hms, h1, HUDF, realNow, noise, fineNoise, vignette, tint, cover, sprite };
})();
