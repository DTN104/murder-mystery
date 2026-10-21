// CA ĐÊM — vẽ cảnh: cam live, frame hẻm, ảnh hiện trường, thumbnail, mặt jumpscare.
// Mỗi hàm ưu tiên ảnh trong assets/opt; thiếu ảnh thì vẽ procedural bằng canvas.
window.CD = window.CD || {};
CD.scenes = (() => {
  const { $, h1, lerp, HUDF, noise, fineNoise, vignette, tint, cover, sprite } = CD.util;
  const IMG = CD.assets.IMG, NO_POS = CD.assets.NO_POS;

  // ---- nhân vật silhouette (fallback khi không có sprite) ----
  function figure(c, x, y, h, o) {
    o = o || {}; const w = h * 0.21; c.save(); try { c.filter = 'blur(0.7px)'; } catch (e) {} c.fillStyle = o.color || '#030505';
    c.fillRect(x - w * 0.36, y - h * 0.5, w * 0.3, h * 0.5); c.fillRect(x + w * 0.06, y - h * 0.5, w * 0.3, h * 0.5);
    c.beginPath(); c.moveTo(x - w * 0.5, y - h * 0.5); c.lineTo(x - w * 0.58, y - h * 0.86); c.lineTo(x + w * 0.58, y - h * 0.86); c.lineTo(x + w * 0.5, y - h * 0.5); c.closePath(); c.fill();
    c.fillRect(x - w * 0.8, y - h * 0.85, w * 0.22, h * 0.44); c.fillRect(x + w * 0.58, y - h * 0.85, w * 0.22, h * 0.44);
    c.beginPath(); c.ellipse(x, y - h * 0.93, w * 0.3, h * 0.08, 0, 0, Math.PI * 2); c.fill();
    if (o.hood) { c.beginPath(); c.ellipse(x, y - h * 0.915, w * 0.46, h * 0.105, 0, 0, Math.PI * 2); c.fill(); }
    if (o.bareHead) { c.fillStyle = '#5a5248'; c.beginPath(); c.ellipse(x, y - h * 0.93, w * 0.26, h * 0.07, 0, 0, Math.PI * 2); c.fill(); }
    c.restore();
  }

  // ---- cảnh procedural từng phòng ----
  function corridor(c, w, h, tm, o) {
    o = o || {}; const vx = w * 0.5, vy = h * 0.44, warm = o.warm;
    c.fillStyle = warm ? '#3a2c20' : '#1a2422'; c.fillRect(0, 0, w, h);
    c.fillStyle = warm ? '#5a4a3a' : '#3a4a45'; c.beginPath(); c.moveTo(0, h); c.lineTo(w, h); c.lineTo(vx + w * 0.085, vy + h * 0.13); c.lineTo(vx - w * 0.085, vy + h * 0.13); c.closePath(); c.fill();
    c.fillStyle = warm ? '#2e241b' : '#202c2a'; c.beginPath(); c.moveTo(0, 0); c.lineTo(w, 0); c.lineTo(vx + w * 0.085, vy - h * 0.15); c.lineTo(vx - w * 0.085, vy - h * 0.15); c.closePath(); c.fill();
    c.fillStyle = warm ? '#4e3d2d' : '#2c3b38'; c.beginPath(); c.moveTo(0, 0); c.lineTo(vx - w * 0.085, vy - h * 0.15); c.lineTo(vx - w * 0.085, vy + h * 0.13); c.lineTo(0, h); c.closePath(); c.fill();
    c.fillStyle = warm ? '#443528' : '#263431'; c.beginPath(); c.moveTo(w, 0); c.lineTo(vx + w * 0.085, vy - h * 0.15); c.lineTo(vx + w * 0.085, vy + h * 0.13); c.lineTo(w, h); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 1;
    for (let i = 1; i < 6; i++) { const k = i / 6, xL = lerp(0, vx - w * 0.085, k), yT = lerp(0, vy - h * 0.15, k), yB = lerp(h, vy + h * 0.13, k); c.beginPath(); c.moveTo(xL, yT); c.lineTo(xL, yB); c.stroke(); const xR = lerp(w, vx + w * 0.085, k); c.beginPath(); c.moveTo(xR, yT); c.lineTo(xR, yB); c.stroke(); }
    c.fillStyle = warm ? '#2a2018' : '#19231f'; c.fillRect(vx - w * 0.085, vy - h * 0.15, w * 0.17, h * 0.28);
    c.fillStyle = warm ? '#5c4b3a' : '#3d4d49'; c.fillRect(vx - w * 0.036, vy - h * 0.09, w * 0.072, h * 0.22);
    for (let i = 0; i < 3; i++) {
      const k = [0.22, 0.52, 0.78][i], ly = lerp(0, vy - h * 0.15, k), lw = lerp(w * 0.22, w * 0.035, k), lh = lerp(8, 2, k);
      let a = 0.75 + 0.25 * Math.sin(tm * 17 + i * 5) * Math.sin(tm * 3.1 + i);
      if (!warm && o.flicker && i === 1 && (Math.sin(tm * 2.3) > 0.985 || Math.sin(tm * 7.7 + 1) > 0.995)) a = 0.05;
      c.fillStyle = warm ? `rgba(230,180,110,${a})` : `rgba(200,230,210,${a})`; c.fillRect(vx - lw / 2, ly, lw, lh);
      const fy = lerp(h, vy + h * 0.13, k), g = c.createRadialGradient(vx, fy, 2, vx, fy, lw * 1.6);
      g.addColorStop(0, warm ? `rgba(240,190,120,${a * 0.35})` : `rgba(190,230,210,${a * 0.3})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    }
    if (o.figure) figure(c, vx + (o.near ? 0 : w * 0.012), vy + h * 0.125, o.near ? h * 0.74 : h * 0.31, { color: warm ? '#0a0806' : '#030505' });
    if (o.atDoor) figure(c, w * 0.3, h * 1.08, h * 1.05, { color: '#020404' });
  }
  function storage(c, w, h, tm, o) {
    c.fillStyle = '#0e1514'; c.fillRect(0, 0, w, h); c.fillStyle = '#121a19'; c.fillRect(0, h * 0.72, w, h * 0.28);
    const bay = w / 3.2;
    for (let s = 0; s < 3; s++) { const x0 = w * 0.05 + s * bay; c.fillStyle = '#1b2422'; c.fillRect(x0, h * 0.12, bay * 0.86, h * 0.66); c.fillStyle = '#263330'; for (let r = 0; r < 4; r++) c.fillRect(x0, h * (0.12 + r * 0.165), bay * 0.86, 4);
      for (let r = 0; r < 4; r++) { let bx = x0 + 6; while (bx < x0 + bay * 0.86 - 18) { const bw = 18 + h1(s * 31 + r * 7 + bx) * 22, bh = h * 0.09 + h1(bx * 3 + r) * h * 0.04, k = h1(bx + r * 13 + s); c.fillStyle = k > 0.7 ? '#3d3a2e' : (k > 0.4 ? '#2d3431' : '#33302a'); c.fillRect(bx, h * (0.12 + r * 0.165) - bh, bw, bh); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(bx + 3, h * (0.12 + r * 0.165) - bh + 3, bw * 0.5, 3); bx += bw + 5; } } }
    const a = 0.6 + 0.3 * Math.sin(tm * 9); c.fillStyle = `rgba(190,225,205,${a})`; c.fillRect(w * 0.46, 4, w * 0.08, 4);
    const g = c.createRadialGradient(w * 0.5, 0, 10, w * 0.5, 0, w * 0.55); g.addColorStop(0, 'rgba(180,220,200,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    if (o.figure) figure(c, w * 0.5 + bay * 0.5, h * 0.84, h * 0.62, {});
  }
  function server(c, w, h, tm, o) {
    c.fillStyle = '#070a0b'; c.fillRect(0, 0, w, h); c.fillStyle = '#0b1213'; c.fillRect(0, h * 0.78, w, h * 0.22);
    for (let r = 0; r < 4; r++) { const x0 = w * 0.08 + r * w * 0.22, rw = w * 0.17; c.fillStyle = '#10171a'; c.fillRect(x0, h * 0.1, rw, h * 0.7); c.fillStyle = '#0a0f12'; c.fillRect(x0 + 4, h * 0.12, rw - 8, h * 0.66);
      for (let j = 0; j < 14; j++) for (let k = 0; k < 3; k++) { const on = ((r * 7 + j * 13 + k * 5 + Math.floor(tm * (2 + k))) % 7) < 4; c.fillStyle = on ? (k === 2 ? '#e3a63c' : '#7fd39a') : '#162022'; c.fillRect(x0 + 8 + k * 7, h * 0.14 + j * h * 0.045, 4, 3); } }
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(60,120,90,0.08)'); g.addColorStop(1, 'rgba(0,0,0,0.3)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    if (o.figure) figure(c, w * 0.52, h * 0.9, h * 0.7, {});
  }
  function stairs(c, w, h, tm, o) {
    c.fillStyle = '#0a0f0e'; c.fillRect(0, 0, w, h); c.fillStyle = '#141c1b'; c.fillRect(0, 0, w * 0.5, h);
    for (let i = 0; i < 8; i++) { const x = w * 0.15 + i * w * 0.085, y = h * 0.9 - i * h * 0.09; c.fillStyle = i % 2 ? '#1c2624' : '#1a2321'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * 0.085, y - h * 0.09); c.lineTo(w, y - h * 0.09); c.lineTo(w, y); c.closePath(); c.fill(); c.fillStyle = '#243130'; c.fillRect(x, y - 2, w * 0.085, 3); }
    c.strokeStyle = '#2d3b39'; c.lineWidth = 3; c.beginPath(); c.moveTo(w * 0.12, h * 0.62); c.lineTo(w * 0.82, 0); c.stroke();
    const a = 0.5 + 0.4 * Math.abs(Math.sin(tm * 1.3)), g = c.createRadialGradient(w * 0.85, h * 0.1, 4, w * 0.85, h * 0.1, w * 0.5); g.addColorStop(0, `rgba(190,225,205,${0.25 * a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    if (o.figure) figure(c, w * 0.5, h * 0.56, h * 0.5, {});
  }
  function restroom(c, w, h, tm, o) {
    c.fillStyle = '#121a1a'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(0,0,0,0.45)'; c.lineWidth = 1;
    for (let x = 0; x < w; x += w / 16) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y < h; y += h / 9) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    c.fillStyle = '#0d1414'; c.fillRect(0, h * 0.78, w, h * 0.22); c.fillStyle = '#1e2a2b'; c.fillRect(w * 0.2, h * 0.12, w * 0.6, h * 0.36); c.fillStyle = 'rgba(150,190,180,0.08)'; c.fillRect(w * 0.2, h * 0.12, w * 0.6, h * 0.36);
    for (let i = 0; i < 2; i++) { const x = w * (0.3 + i * 0.3); c.fillStyle = '#2a3637'; c.fillRect(x - w * 0.07, h * 0.55, w * 0.14, h * 0.08); c.fillStyle = '#3b4a4b'; c.fillRect(x - 2, h * 0.47, 4, h * 0.08); }
    const a = 0.7 + 0.3 * Math.sin(tm * 23) * Math.sin(tm * 5); c.fillStyle = `rgba(200,230,215,${a})`; c.fillRect(w * 0.35, 3, w * 0.3, 4);
    if (o.figure) { c.save(); c.globalAlpha = 0.55; c.beginPath(); c.rect(w * 0.2, h * 0.12, w * 0.6, h * 0.36); c.clip(); figure(c, w * 0.5, h * 0.62, h * 0.62, { color: '#070b0b' }); c.restore(); }
  }
  function lobby(c, w, h, tm) {
    c.fillStyle = '#0c1211'; c.fillRect(0, 0, w, h); c.fillStyle = '#151e1c'; c.fillRect(0, h * 0.74, w, h * 0.26);
    c.fillStyle = '#1d2a28'; c.fillRect(w * 0.3, h * 0.12, w * 0.4, h * 0.62); c.fillStyle = '#263433'; c.fillRect(w * 0.33, h * 0.15, w * 0.165, h * 0.59); c.fillRect(w * 0.505, h * 0.15, w * 0.165, h * 0.59); c.fillStyle = '#060909'; c.fillRect(w * 0.495, h * 0.15, w * 0.01, h * 0.59);
    c.fillStyle = '#e3a63c'; c.font = `bold ${h * 0.05}px ${HUDF}`; c.textAlign = 'center'; c.fillText('B1', w * 0.5, h * 0.1);
    c.fillStyle = '#2a3330'; c.fillRect(w * 0.06, h * 0.62, w * 0.17, h * 0.05); c.fillRect(w * 0.07, h * 0.67, 4, h * 0.08); c.fillRect(w * 0.215, h * 0.67, 4, h * 0.08);
    const a = 0.8 + 0.2 * Math.sin(tm * 11); c.fillStyle = `rgba(200,230,215,${a})`; c.fillRect(w * 0.1, 4, w * 0.2, 4); c.fillRect(w * 0.7, 4, w * 0.2, 4);
  }
  const PROC = { cam01: lobby, cam02: corridor, cam03: storage, cam04: server, cam05: stairs, cam06: restroom };

  // ---- feed cam đang chọn (vẽ vào canvas cv 640x360) ----
  function drawFeed(ctx, w, h, tm, st) {
    // st: { view, entAt, ups }
    const id = st.view, here = st.entAt === id;
    if (IMG[id]) {
      cover(ctx, IMG[id], 0, 0, w, h); const P = NO_POS[id];
      if (id === 'cam07') {
        if (IMG.no_back) sprite(ctx, IMG.no_back, w * P.x, h * P.y, h * P.h, { alpha: 0.96 }); else figure(ctx, w * 0.5, h, h * 0.9, { color: '#0a0806' });
        vignette(ctx, w, h, 0.55); noise(ctx, w, h, 0.22); ctx.fillStyle = 'rgba(0,0,0,0.5)'; for (let i = 0; i < 4; i++) { const y = ((tm * 140 + i * 90) % h) | 0; ctx.fillRect(0, y, w, 2); }
        return;
      }
      if (here && P) { const im = IMG[P.img]; ctx.save(); if (P.mirror) { ctx.beginPath(); ctx.rect(w * P.mirror[0], h * P.mirror[1], w * P.mirror[2], h * P.mirror[3]); ctx.clip(); }
        if (im) sprite(ctx, im, w * P.x, h * P.y, h * P.h, { alpha: P.alpha || 0.95 }); else figure(ctx, w * P.x, h * P.y, h * P.h, {}); ctx.restore(); }
      if (id === 'cam02' && st.entAt === 'door') { if (IMG.no_front) sprite(ctx, IMG.no_front, w * 0.25, h * 1.12, h * 1.3, { alpha: 0.98 }); else figure(ctx, w * 0.3, h * 1.08, h * 1.05, { color: '#020404' }); }
      tint(ctx, w, h, 'rgb(220,242,228)'); vignette(ctx, w, h, 0.45);
      noise(ctx, w, h, st.ups < 15 ? 0.3 : 0.11 + 0.04 * Math.sin(tm * 1.7));
      if (st.ups <= 0) { ctx.fillStyle = 'rgba(0,0,0,0.92)'; ctx.fillRect(0, 0, w, h); }
      return;
    }
    if (id === 'cam07') {
      corridor(ctx, w, h, tm, { warm: true, figure: true, near: true }); tint(ctx, w, h, 'rgb(235,210,185)'); vignette(ctx, w, h, 0.7); noise(ctx, w, h, 0.22);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; for (let i = 0; i < 4; i++) { const y = ((tm * 140 + i * 90) % h) | 0; ctx.fillRect(0, y, w, 2); }
    } else {
      PROC[id](ctx, w, h, tm, { figure: here, flicker: true, atDoor: id === 'cam02' && st.entAt === 'door' });
      if (id !== 'cam02') { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgb(70,95,88)'; ctx.fillRect(0, 0, w, h); ctx.restore(); }
      tint(ctx, w, h, 'rgb(205,240,220)'); vignette(ctx, w, h, 0.6);
      noise(ctx, w, h, st.ups < 15 ? 0.3 : 0.12 + 0.04 * Math.sin(tm * 1.7));
      if (st.ups <= 0) { ctx.fillStyle = 'rgba(0,0,0,0.92)'; ctx.fillRect(0, 0, w, h); }
    }
  }

  // ---- frame cam hẻm (E5). scene: hoodie_door | hoodie_in | empty_watch | nosignal | hoodie_out | khoa ----
  function alley(c, w, h, scene) {
    const dawn = scene === 'khoa';
    if (scene === 'nosignal') { c.fillStyle = '#1a2230'; c.fillRect(0, 0, w, h); noise(c, w, h, 0.55); c.fillStyle = '#dfe6ee'; c.font = `bold ${h * 0.11}px ${HUDF}`; c.textAlign = 'center'; c.fillText('NO SIGNAL', w / 2, h * 0.52); c.font = `${h * 0.05}px IBM Plex Mono, monospace`; c.fillText('CH01  reconnecting…', w / 2, h * 0.62); return; }
    if (IMG.alley) {
      cover(c, IMG.alley, 0, 0, w, h);
      if (dawn) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = 'rgb(38,52,66)'; c.fillRect(0, 0, w, h); c.restore(); tint(c, w, h, 'rgb(205,218,235)'); }
      const dx = w * 0.29, dy = h * 0.93, fh = h * 0.66;
      if (scene === 'hoodie_door' && IMG.hoodie_door) sprite(c, IMG.hoodie_door, dx, dy, fh, { flip: true });
      if (scene === 'hoodie_in') { c.fillStyle = 'rgba(235,205,150,0.6)'; c.fillRect(w * 0.265, h * 0.16, w * 0.018, h * 0.7); if (IMG.hoodie_door) { c.save(); c.beginPath(); c.rect(w * 0.2, 0, w, h); c.clip(); sprite(c, IMG.hoodie_door, w * 0.2, dy, fh, { flip: true, alpha: 0.9 }); c.restore(); } }
      if (scene === 'hoodie_out' && IMG.hoodie_walk) sprite(c, IMG.hoodie_walk, w * 0.5, h * 0.99, h * 0.64);
      if (scene === 'khoa' && IMG.khoa) sprite(c, IMG.khoa, dx, dy, fh, { flip: true });
      if (scene === 'empty_watch' && IMG.no_back) sprite(c, IMG.no_back, w * 0.76, h * 0.5, h * 0.15, { alpha: 0.85 });
      if (!dawn) tint(c, w, h, 'rgb(210,225,240)');
      vignette(c, w, h, 0.45); noise(c, w, h, scene === 'empty_watch' ? 0.18 : 0.13); return;
    }
    // procedural
    c.fillStyle = dawn ? '#3a4448' : '#1c2328'; c.fillRect(0, 0, w, h);
    c.fillStyle = dawn ? '#4a5254' : '#333c40'; c.beginPath(); c.moveTo(0, h); c.lineTo(w, h); c.lineTo(w * 0.72, h * 0.42); c.lineTo(w * 0.42, h * 0.42); c.closePath(); c.fill();
    c.fillStyle = dawn ? '#555a56' : '#3a4342'; c.beginPath(); c.moveTo(0, 0); c.lineTo(w * 0.42, h * 0.1); c.lineTo(w * 0.42, h * 0.42); c.lineTo(0, h); c.closePath(); c.fill();
    c.fillStyle = dawn ? '#4a5050' : '#2e3837'; c.beginPath(); c.moveTo(w, 0); c.lineTo(w * 0.72, h * 0.1); c.lineTo(w * 0.72, h * 0.42); c.lineTo(w, h); c.closePath(); c.fill();
    c.fillStyle = dawn ? '#5a6468' : '#222c30'; c.fillRect(w * 0.42, h * 0.1, w * 0.3, h * 0.32);
    const dx = w * 0.17, dy = h * 0.33, dw = w * 0.1, dh = h * 0.42;
    c.fillStyle = scene === 'hoodie_in' ? '#6a5a40' : (dawn ? '#6a6a62' : '#4a524e');
    c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx + dw, dy + h * 0.03); c.lineTo(dx + dw, dy + dh - h * 0.05); c.lineTo(dx, dy + dh); c.closePath(); c.fill();
    if (scene === 'hoodie_in') { c.fillStyle = 'rgba(230,200,140,0.75)'; c.fillRect(dx + dw - 6, dy + h * 0.03, 6, dh - h * 0.08); }
    c.fillStyle = dawn ? '#6a6f68' : '#3c4642'; c.fillRect(w * 0.74, h * 0.6, w * 0.14, h * 0.14); c.fillRect(w * 0.8, h * 0.5, w * 0.1, h * 0.1);
    c.fillStyle = dawn ? '#141718' : '#0a0d0f'; c.beginPath(); c.ellipse(w * 0.09, h * 0.88, w * 0.05, h * 0.06, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(w * 0.3, h * 0.9, w * 0.05, h * 0.06, 0, 0, Math.PI * 2); c.fill(); c.fillRect(w * 0.1, h * 0.7, w * 0.2, h * 0.14);
    const g = c.createRadialGradient(w * 0.86, h * 0.06, 2, w * 0.86, h * 0.06, w * 0.5); g.addColorStop(0, dawn ? 'rgba(255,230,190,0.25)' : 'rgba(255,220,160,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    if (scene === 'hoodie_door') { figure(c, dx + dw * 0.9, dy + dh - h * 0.02, h * 0.5, { hood: true }); c.fillStyle = '#030505'; c.fillRect(dx + dw * 0.55, dy + dh * 0.5, dw * 0.5, 4); }
    if (scene === 'hoodie_in') { c.save(); c.beginPath(); c.rect(dx + dw * 0.4, 0, w, h); c.clip(); figure(c, dx + dw * 0.7, dy + dh - h * 0.02, h * 0.5, { hood: true }); c.restore(); }
    if (scene === 'hoodie_out') figure(c, w * 0.4, h * 0.86, h * 0.56, { hood: true });
    if (scene === 'khoa') { figure(c, dx + dw * 0.95, dy + dh - h * 0.02, h * 0.5, { bareHead: true }); c.fillStyle = '#2b2b2b'; c.fillRect(dx + dw * 1.3, dy + dh * 0.55, w * 0.04, h * 0.08); }
    if (scene === 'empty_watch') figure(c, w * 0.66, h * 0.43, h * 0.17, { color: '#05070a' });
    tint(c, w, h, dawn ? 'rgb(215,225,235)' : 'rgb(205,225,240)'); vignette(c, w, h, 0.55); noise(c, w, h, scene === 'empty_watch' ? 0.18 : 0.14);
  }

  // ---- ảnh hiện trường (E7). which: 'safe' | 'notebook'; ph = dữ liệu ảnh (lines cho sổ tay) ----
  function photo(c, w, h, which, ph) {
    ph = ph || {};
    if (which === 'safe' && IMG.scene_safe) { cover(c, IMG.scene_safe, 0, 0, w, h); vignette(c, w, h, 0.35); noise(c, w, h, 0.06); return; }
    if (which === 'notebook' && IMG.scene_notebook) {
      cover(c, IMG.scene_notebook, 0, 0, w, h);
      c.save(); c.translate(w * 0.535, h * 0.37); c.rotate(-0.06); c.textAlign = 'left'; c.font = `500 ${h * 0.058}px Caveat, 'Segoe Script', 'Bradley Hand', cursive`;
      const lines = ph.lines || [], hot = ph.hotLine;
      lines.forEach((s, i) => { c.fillStyle = i === hot ? '#8a2418' : '#2b2f4a'; c.fillText(s, 0, i * h * 0.078); });
      if (hot != null) { c.strokeStyle = '#8a2418'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, hot * h * 0.078 + 4); c.lineTo(w * 0.22, hot * h * 0.078 + 6); c.stroke(); }
      c.restore(); vignette(c, w, h, 0.35); noise(c, w, h, 0.06); return;
    }
    if (which === 'safe') {
      c.fillStyle = '#2a2622'; c.fillRect(0, 0, w, h); c.fillStyle = '#3a342c'; c.fillRect(0, h * 0.7, w, h * 0.3);
      c.fillStyle = '#4a4a46'; c.fillRect(w * 0.25, h * 0.2, w * 0.5, h * 0.55); c.fillStyle = '#1b1b1a'; c.fillRect(w * 0.29, h * 0.25, w * 0.42, h * 0.45);
      c.fillStyle = '#5c5c58'; c.beginPath(); c.moveTo(w * 0.71, h * 0.2); c.lineTo(w * 0.92, h * 0.14); c.lineTo(w * 0.92, h * 0.8); c.lineTo(w * 0.71, h * 0.75); c.closePath(); c.fill();
      for (let i = 0; i < 3; i++) { c.fillStyle = i === 1 ? '#7a8a6a' : '#8a7a5a'; c.fillRect(w * 0.32, h * (0.58 - i * 0.1), w * 0.3, h * 0.07); c.fillStyle = 'rgba(255,255,255,0.15)'; c.fillRect(w * 0.32, h * (0.58 - i * 0.1), w * 0.3, 2); }
      c.fillStyle = 'rgba(255,240,200,0.12)'; c.fillRect(0, 0, w, h);
    } else {
      c.fillStyle = '#3b3630'; c.fillRect(0, 0, w, h);
      c.save(); c.translate(w * 0.5, h * 0.5); c.rotate(-0.04); c.fillStyle = '#ece4cf'; c.fillRect(-w * 0.42, -h * 0.42, w * 0.84, h * 0.84); c.strokeStyle = '#c9bfa6'; c.lineWidth = 1; for (let i = 1; i < 9; i++) { c.beginPath(); c.moveTo(-w * 0.4, -h * 0.42 + i * h * 0.095); c.lineTo(w * 0.42, -h * 0.42 + i * h * 0.095); c.stroke(); }
      c.font = `italic ${h * 0.07}px ${HUDF}`; c.textAlign = 'left';
      (ph.lines || []).forEach((s, i) => { c.fillStyle = i === ph.hotLine ? '#8a2418' : '#2b2a26'; c.fillText(s, -w * 0.38, -h * 0.3 + i * h * 0.095); });
      c.restore(); c.fillStyle = 'rgba(255,230,180,0.08)'; c.fillRect(0, 0, w, h);
    }
    vignette(c, w, h, 0.5); noise(c, w, h, 0.08);
  }

  // ---- thumbnail trong danh sách hồ sơ ----
  function thumb(c, w, h, ev) {
    c.fillStyle = '#0a0e0f'; c.fillRect(0, 0, w, h);
    if (ev.type === 'paper') { c.fillStyle = '#efe6c9'; c.fillRect(w * 0.2, h * 0.08, w * 0.6, h * 0.9); c.fillStyle = '#8a8577'; for (let i = 0; i < 5; i++) c.fillRect(w * 0.27, h * 0.25 + i * h * 0.12, w * 0.46, 2); c.strokeStyle = '#9a2d1f'; c.lineWidth = 2; c.strokeRect(w * 0.5, h * 0.12, w * 0.24, h * 0.14); }
    else if (ev.type === 'bank' || ev.type === 'chat') { c.fillStyle = '#111'; c.beginPath(); c.roundRect(w * 0.3, h * 0.04, w * 0.4, h * 0.92, 6); c.fill(); c.fillStyle = ev.type === 'bank' ? '#133a5e' : '#1d2628'; c.fillRect(w * 0.33, h * 0.1, w * 0.34, h * 0.2); c.fillStyle = ev.type === 'bank' ? '#f3f5f7' : '#0f1416'; c.fillRect(w * 0.33, h * 0.3, w * 0.34, h * 0.6);
      if (ev.type === 'chat') { c.fillStyle = '#1c4a3a'; c.fillRect(w * 0.45, h * 0.36, w * 0.2, h * 0.1); c.fillStyle = '#2a3638'; c.fillRect(w * 0.35, h * 0.5, w * 0.2, h * 0.1); c.fillStyle = '#e3a63c'; c.fillRect(w * 0.45, h * 0.64, w * 0.2, h * 0.1); } else { c.fillStyle = '#b42318'; c.fillRect(w * 0.36, h * 0.36, w * 0.28, h * 0.06); c.fillStyle = '#8a8a8a'; c.fillRect(w * 0.36, h * 0.5, w * 0.28, h * 0.04); c.fillRect(w * 0.36, h * 0.6, w * 0.28, h * 0.04); } }
    else if (ev.type === 'frames') alley(c, w, h, (ev.frames[0] || {}).scene || 'hoodie_door');
    else if (ev.type === 'log') { c.fillStyle = '#05080a'; c.fillRect(0, 0, w, h); c.fillStyle = '#7fa392'; for (let i = 0; i < 6; i++) c.fillRect(w * 0.08, h * 0.12 + i * h * 0.14, w * (0.3 + h1(i * 3) * 0.55), 2); c.fillStyle = '#e3a63c'; c.fillRect(w * 0.08, h * 0.12 + 3 * h * 0.14, w * 0.6, 2); }
    else if (ev.type === 'photos') photo(c, w, h, (ev.photos[0] || {}).scene || 'safe', ev.photos[0]);
    else { c.fillStyle = '#2a2f2e'; c.fillRect(w * 0.3, h * 0.25, w * 0.4, h * 0.65); c.fillStyle = '#111'; c.fillRect(w * 0.34, h * 0.32, w * 0.32, h * 0.22); c.fillStyle = '#e3a63c'; c.fillRect(w * 0.48, h * 0.05, 3, h * 0.2); c.fillStyle = '#7fd39a'; c.fillRect(w * 0.4, h * 0.6, 4, 4); }
  }

  // ---- jumpscare ----
  const impactFrame = document.createElement('canvas');
  function resetScare() { impactFrame.width = 0; }
  function drawImpact(elapsed, reduce) {
    const canvas = $('#sc-face');
    if (!impactFrame.width || impactFrame.width !== innerWidth || impactFrame.height !== innerHeight) {
      drawFace(reduce);
      impactFrame.width = canvas.width; impactFrame.height = canvas.height;
      impactFrame.getContext('2d').drawImage(canvas, 0, 0);
    }
    const c = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
    c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
    // A single 100 ms thrust and short recoil, using the original face throughout.
    const thrust = Math.min(1, Math.max(0, elapsed / .1));
    const recoil = Math.max(0, 1 - Math.max(0, elapsed - .1) / .18);
    const zoom = reduce ? 1 : (thrust < 1 ? .88 + .3 * thrust : 1.1 + .08 * recoil);
    const kick = reduce ? 0 : Math.sin(elapsed * 65) * recoil;
    c.save(); c.translate(w / 2 + kick * w * .012, h / 2 - kick * h * .008);
    c.rotate(reduce ? 0 : -.018 * recoil); c.scale(zoom, zoom);
    c.drawImage(impactFrame, -w / 2, -h / 2); c.restore();
  }
  function drawFace(reduce) {
    const c2 = $('#sc-face'); c2.width = innerWidth; c2.height = innerHeight; const c = c2.getContext('2d'), w = c2.width, h = c2.height;
    c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
    if (IMG.no_face) {
      cover(c, IMG.no_face, 0, 0, w, h);
      if (!reduce) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.16; cover(c, IMG.no_face, -12, 5, w, h); c.globalAlpha = 0.1; cover(c, IMG.no_face, 14, -6, w, h); c.restore(); }
      else { c.fillStyle = 'rgba(0,0,0,0.5)'; c.fillRect(0, 0, w, h); }
      fineNoise(c, w, h, reduce ? 0.15 : 0.22, Math.round(w / 2), Math.round(h / 2)); return;
    }
    const cx = w * 0.52, cy = h * 0.58, fw = Math.max(w, h) * 0.26, fh = Math.max(w, h) * 0.5, passes = reduce ? 1 : 3;
    for (let p = 0; p < passes; p++) {
      const ox = p === 0 ? 0 : (p === 1 ? -9 : 10), oy = p === 0 ? 0 : (p === 1 ? 4 : -5);
      c.save(); c.globalAlpha = p === 0 ? 1 : 0.3; c.translate(ox, oy);
      const g = c.createRadialGradient(cx, cy + fh * 0.3, fw * 0.1, cx, cy, fh * 0.9); g.addColorStop(0, '#cfc6b8'); g.addColorStop(0.5, '#8f877c'); g.addColorStop(1, '#0e0d0c');
      c.fillStyle = g; c.beginPath(); c.ellipse(cx, cy, fw, fh, 0.03, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#030303'; c.beginPath(); c.ellipse(cx - fw * 0.45, cy - fh * 0.22, fw * 0.3, fh * 0.17, -0.25, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(cx + fw * 0.38, cy - fh * 0.3, fw * 0.36, fh * 0.21, 0.3, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#020202'; c.beginPath(); c.ellipse(cx + fw * 0.08, cy + fh * 0.5, fw * 0.3, fh * 0.3, 0.18, 0, Math.PI * 2); c.fill();
      c.restore();
    }
    if (reduce) { c.fillStyle = 'rgba(0,0,0,0.55)'; c.fillRect(0, 0, w, h); }
    fineNoise(c, w, h, reduce ? 0.18 : 0.26, Math.round(w / 2), Math.round(h / 2));
  }
  function drawStatic(reduce = false) {
    const canvas = $('#sc-static'), w = Math.min(innerWidth, 640), h = Math.round(w * innerHeight / innerWidth);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const c = canvas.getContext('2d'); c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
    // Opaque interference: no live feed or silhouette can reveal the scare in advance.
    fineNoise(c, w, h, reduce ? .12 : .75, 320, Math.round(320 * h / w));
    vignette(c, w, h, .4);
  }

  return { figure, corridor, drawFeed, alley, photo, thumb, drawFace, drawStatic, resetScare, drawImpact };
})();
