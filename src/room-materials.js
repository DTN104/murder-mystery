// Local, deterministic materials: no image downloads or per-frame allocations.
window.CD = window.CD || {};
CD.roomMaterials = (() => {
  const T = THREE;
  function canvas(w = 512, h = 512) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function texture(c) { const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; }
  function surface(kind, base) {
    const c = canvas(), x = c.getContext('2d'); let seed = 743;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    x.fillStyle = base; x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 11000; i++) { x.fillStyle = `rgba(${rnd() > .5 ? '225,230,210' : '10,18,16'},${rnd() * .12})`; x.fillRect(rnd() * 512, rnd() * 512, kind === 'wood' ? rnd() * 180 : rnd() * 6, 1 + rnd() * 3); }
    if (kind === 'wall') {
      for (let i = 0; i < 35; i++) { const px = rnd() * 512, py = rnd() * 512, r = 15 + rnd() * 100; const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, 'rgba(15,22,18,.14)'); g.addColorStop(1, 'rgba(15,22,18,0)'); x.fillStyle = g; x.fillRect(px-r, py-r, r*2, r*2); }
    }
    if (kind === 'tile') { x.strokeStyle = '#172421'; x.lineWidth = 5; x.strokeRect(2, 2, 508, 508); x.lineWidth = 1; x.strokeStyle = '#64746b'; x.strokeRect(6, 6, 500, 500); }
    const map = texture(c); map.wrapS = map.wrapT = T.RepeatWrapping;
    return new T.MeshStandardMaterial({ map, roughness: .94, color: '#b9c0af' });
  }
  function label(lines, bg = '#b6b49a', fg = '#18201b', w = 512, h = 256) {
    const c = canvas(w, h), x = c.getContext('2d'); x.fillStyle = bg; x.fillRect(0, 0, w, h);
    x.strokeStyle = fg; x.lineWidth = 3; x.strokeRect(10, 10, w-20, h-20);
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
    lines.forEach((s, i) => { x.font = `${i ? 400 : 700} ${Math.min(w / 13, h / (lines.length + 1))}px monospace`; x.fillText(s, w/2, h*(i+1)/(lines.length+1), w-30); });
    return new T.MeshStandardMaterial({ map: texture(c), roughness: .85 });
  }
  return { canvas, texture, surface, label };
})();
