// CA ĐÊM — vòng lặp game: trạng thái, Nó, pin UPS, cửa, sự kiện kịch bản, thắng/thua, bảng demo, boot.
window.CD = window.CD || {};
(() => {
  const { $, $$, rnd, clamp, lerp, fmt, fmtHM, hms, realNow } = CD.util;
  const audio = CD.audio, mon = CD.monitor, chat = CD.chat, room = CD.room, scenes = CD.scenes;

  // ---------- trạng thái ----------
  const G = CD.G = {
    started: false, t: 0, speed: 3, ups: 100, door: false, view: 'cam02', tab: 'cam', lean: false, playing: false,
    ent: { at: 'cam03', level: 1, next: 0, doorSince: null, lastKnock: 0 },
    cam07Until: 0, notes: [], seen: new Set(), asked: new Set(), boardLockUntil: 0,
    fired: {}, dead: false, over: false, reduce: false, light: 1, par: 0, parT: 0, pan: 0, panT: 0, unread: 0, openEv: null,
  };
  const NIGHT_ID = (location.hash || '').replace('#', '') || 'night1';
  const night = CD.night = CD.NIGHTS[NIGHT_ID] || CD.NIGHTS.night1;
  const cv = $('#cv'), ctx = cv.getContext('2d');

  const shiftTimers = new Set();
  function later(fn, delay) {
    const id = setTimeout(() => { shiftTimers.delete(id); fn(); }, delay);
    shiftTimers.add(id); return id;
  }
  function clearShiftTimers() { shiftTimers.forEach(clearTimeout); shiftTimers.clear(); }

  // ---------- cửa ----------
  function setDoor(locked) { G.door = locked; $('#hot-door').setAttribute('aria-label', locked ? 'Mở khóa cửa' : 'Khóa cửa'); $('#hot-door .lbl').textContent = locked ? 'Mở khóa' : 'Khóa cửa'; $('#mapdoor').setAttribute('fill', locked ? '#d8493a' : '#e3a63c'); if (locked) audio.lockClick(); }
  $('#hot-door').onclick = () => { if(!G.started||G.dead||G.over||room.failed)return; if (G.ups <= 0) { chat.say('HỆ THỐNG', 'Khóa điện không có nguồn.', 'sys'); return; } setDoor(!G.door); };

  // ---------- Nó ----------
  const NEXT = { cam03: () => Math.random() < 0.7 ? 'cam02' : 'cam04', cam04: () => 'cam05', cam05: () => 'cam02', cam02: () => 'door', cam06: () => 'cam02', cam01: () => 'cam02' };
  function entMoveTo(where) { G.ent.at = where; if (where === 'door') { G.ent.doorSince = G.t; G.ent.lastKnock = -1e9; } }
  function entRoll() {
    const e = G.ent; if (e.at === 'door') return; let p = e.level / 20; if (G.lean && G.tab === 'cam' && G.view === e.at) p *= 0.3;
    if (Math.random() < p) entMoveTo(NEXT[e.at]());
    e.next = G.t + rnd(45, 90) * 36;
  }
  function levelForHour() { const lv = night.threat.levelByHour || [1, 1, 1, 2, 2, 2]; return lv[Math.min(5, Math.floor(G.t / 3600))] || 1; }

  // sự kiện kịch bản (nights/*.js → threat.scripted)
  function runScripted(s) {
    if (s.event === 'cam07') { G.cam07Until = realNow() + (s.seconds || 12); mon.buildCamList(); }
    if (s.event === 'moveTo') { if (!s.ifAt || G.ent.at === s.ifAt) { entMoveTo(s.to); if (s.say) chat.say('HỆ THỐNG', s.say, 'sys'); } }
    if (s.event === 'say') { chat.say(s.from || 'ĐTV', s.text, s.cls); if (s.then) later(() => { if (!G.dead && !G.over) chat.say(s.then.from || s.from || 'ĐTV', s.then.text, s.then.cls); }, s.then.after || 5000); }
  }

  // ---------- vòng lặp ----------
  function step(dt) {
    const gdt = dt * 36 * G.speed; G.t += gdt; if (G.t >= 6 * 3600) { endShift(false); return; }
    night.threat.scripted.forEach((s, i) => { if (!G.fired[i] && G.t >= hms(s.at)) { G.fired[i] = true; runScripted(s); } });
    G.ent.level = Math.max(G.ent.level, levelForHour() + (G.ent.bonus || 0));
    if (G.ups > 0) {
      const rate = 0.04 + (G.lean && G.tab === 'cam' ? 0.04 : 0) + (G.playing ? 0.06 : 0) + (G.door ? 0.25 : 0);
      G.ups = clamp(G.ups - rate * dt * G.speed, 0, 100);
      if (G.ups <= 0) { G.ups = 0; setDoor(false); chat.say('HỆ THỐNG', 'UPS cạn rồi. Đèn tắt, khóa cửa mất nguồn.', 'sys'); if (G.ent.at !== 'door') later(() => { if (!G.dead && !G.over) entMoveTo('door'); }, rnd(6000, 14000)); }
    }
    const e = G.ent;
    if (e.at === 'door') {
      if (G.door) { e.at = 'cam03'; e.doorSince = null; e.next = G.t + rnd(60, 90) * 36; audio.scrape(); chat.say('HỆ THỐNG', 'Tiếng bước chân xa dần, về phía kho.', 'sys'); }
      else { if (realNow() - e.lastKnock > 2.6) { e.lastKnock = realNow(); audio.knock(); if (G.lean) { const m = $('#monitor'); m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake'); } } if (G.t - e.doorSince >= 8 * 36) jumpscare(); }
    } else if (G.t >= e.next) entRoll();
    if (G.cam07Until && realNow() > G.cam07Until) { G.cam07Until = 0; if (G.view === 'cam07') mon.selectCam('cam02'); else mon.buildCamList(); }
    let target = G.ups > 0 ? 1 : 0.12; if (G.ups > 0 && (Math.sin(realNow() * 2.9) > 0.992 || Math.sin(realNow() * 7.3 + 2) > 0.996)) target = 0.45; if (G.ent.at === 'door' && G.ups > 0) target = 0.8 + 0.15 * Math.sin(realNow() * 9);
    G.light = lerp(G.light, target, 0.35); G.par = lerp(G.par, G.parT, 0.08); G.pan = lerp(G.pan, G.panT, 0.08);
  }
  function render(tm) {
    $('#clock').textContent = fmtHM(G.t); $('#mon-clock').textContent = fmtHM(G.t); $('#osd-time').textContent = '18/10  ' + fmt(G.t);
    $('#upsbar').style.width = G.ups + '%'; $('#upspct').textContent = Math.round(G.ups) + '%';
    const u = $('#power'); u.classList.toggle('warn', G.ups < 40 && G.ups >= 15); u.classList.toggle('crit', G.ups < 15);
    if (!G.dead) scenes.drawFeed(ctx, cv.width, cv.height, tm, { view: G.view, entAt: G.ent.at, ups: G.ups });
    $('#world').style.transform = room.worldTransform(); room.placeToast();
    if (!G.dead && !G.over) room.draw(tm);
    const lockT = G.boardLockUntil - realNow(); $('#submit').disabled = lockT > 0; if (lockT > 0) $('#verdict').textContent = `Nộp lại sau ${Math.ceil(lockT)}s`;
  }
  let last = performance.now();
  function loop(now) { const dt = Math.min(0.1, (now - last) / 1000); last = now; if (G.started && !G.dead && !G.over) step(dt); if (G.started) render(now / 1000); if(scare)renderScare(now/1000); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);

  // ---------- kết thúc ----------
  let scare = null;
  function stopScare(){if(scare)scare.stopAudio();scare=null;}
  function renderScare(now){
    const elapsed=Math.max(0,now-scare.start),ov=$('#scare');
    if(elapsed<2.5){ov.className='ov p-static';scenes.drawStatic(scare.reduce);}
    else if(elapsed<2.65)ov.className='ov p-black';
    else if(elapsed<2.93){ov.className='ov p-face';scenes.drawImpact(elapsed-2.65,scare.reduce);}
    else if(elapsed<3.35){ov.className='ov p-black';scare.stopAudio();}
    else{ov.className='ov p-end';$('#scare-time').textContent='Cửa không khóa, '+fmt(G.t);stopScare();}
  }
  function jumpscare() {
    if(G.dead||G.over)return;G.dead=true;G.playing=false;mon.setLean(false);room.cancelLean();chat.openRadio(false);
    scenes.resetScare();const reduce=G.reduce||matchMedia('(prefers-reduced-motion: reduce)').matches;
    $('#scare').hidden=false;scare={start:realNow(),reduce,stopAudio:audio.startApproach(reduce,2.5)};renderScare(scare.start);
  }
  function endShift(ok) {
    G.over = true; mon.setLean(false); room.cancelLean(); const ov = $('#over'); ov.hidden = false;
    if (ok) { $('#over-h').textContent = 'BÀN GIAO'; $('#over-p').textContent = `${fmt(G.t)}. ${night.end.win}`; $('#over-btn').textContent = `Chơi lại đêm ${night.num}`; }
    else { $('#over-h').textContent = 'HẾT CA'; $('#over-p').textContent = night.end.lose; $('#over-btn').textContent = `Chơi lại đêm ${night.num}, giữ bảng ghim`; }
  }
  function restart() {
    clearShiftTimers(); stopScare(); audio.resumeRoom(); room.reset();
    G.t = 0; G.ups = 100; G.dead = false; G.over = false; G.fired = {}; G.asked.clear(); G.cam07Until = 0; G.boardLockUntil = 0; G.playing = false; G.light = 1; G.unread = 0;
    G.ent = { at: night.threat.start || 'cam03', level: levelForHour(), bonus: 0, next: rnd(45, 90) * 36, doorSince: null, lastKnock: 0 };
    setDoor(false); $('#scare').hidden = true; $('#over').hidden = true; $('#verdict').textContent = ''; $('#radiobtn').classList.remove('new');
    mon.selectCam('cam02'); mon.setTab('cam'); mon.setLean(false); chat.clear(); brief(); chat.buildChips();
  }
  function brief() { (night.brief || []).forEach((text, i) => { if (i === 0) chat.say('ĐTV', text); else later(() => { if (!G.dead && !G.over) chat.say('ĐTV', text); }, 6000 * i); }); }
  $('#retry').onclick = restart; $('#over-btn').onclick = restart;
  $('#submit').onclick = () => {
    const n = mon.boardResult(); if (n == null) { $('#verdict').textContent = 'Điền đủ 4 ô.'; return; }
    if (n === night.board.length) { endShift(true); return; }
    $('#verdict').textContent = `Không khớp, ${n}/${night.board.length} ô đúng.`; G.ent.level++; G.ent.bonus = (G.ent.bonus || 0) + 1; G.boardLockUntil = realNow() + 10; chat.say('HỆ THỐNG', `Kết luận không khớp, ${n}/${night.board.length} ô đúng. Nó biết bạn đang đoán.`, 'sys');
  };

  // ---------- bảng demo ----------
  $('#demo-toggle').onclick = () => { const d = $('#demo'); d.hidden = !d.hidden; $('#demo-toggle').setAttribute('aria-expanded', String(!d.hidden)); };
  $$('#demo [data-speed]').forEach(b => b.onclick = () => { G.speed = +b.dataset.speed; $$('#demo [data-speed]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); });
  $('#d-door').onclick = () => { if (G.dead || G.over) return; entMoveTo('door'); mon.setLean(false); };
  $('#d-hall').onclick = () => { if (G.dead || G.over) return; entMoveTo('cam02'); G.ent.next = G.t + 60 * 36; mon.setLean(false); };
  $('#d-cam07').onclick = () => { G.cam07Until = realNow() + 12; mon.setLean(true); mon.setTab('cam'); mon.buildCamList(); };
  $('#d-scare').onclick = () => { if (G.started) jumpscare(); };
  $('#d-fill').onclick = () => { mon.fillBoard(); mon.setLean(true); mon.setTab('board'); };
  $('#d-reduce').onchange = e => { G.reduce = e.target.checked; audio.setReduce(G.reduce); };

  // ---------- boot ----------
  function start(data) {
    $('#boot-text').textContent = night.bootText || ''; $('#night-label').textContent = `Đêm ${night.num} · B1 · Phòng KTS`; document.title = `CA ĐÊM, đêm ${night.num}`;
    room.init($('#room'), cv); room.bindInput(); mon.bind(); chat.bind();
    CD.assets.onLoad((k, loaded, total) => { const el = $('#loadst'); if (el) el.textContent = loaded >= total ? 'Hình đã tải xong.' : `Đang tải hình… ${loaded}/${total}`; if (k === 'room') room.resize(); if ((k === 'alley' || k === 'scene_safe') && G.started) mon.buildEvList(); });
    CD.assets.load();
    room.resize(); mon.buildCamList(); mon.buildEvList(); mon.buildBoard(); mon.renderPins();
    if (data && data.notes) { G.notes = data.notes; mon.renderPins(); }
    $('#start').onclick = async () => {
      audio.init(); $('#boot').hidden = true; G.started = true; last = performance.now();
      try { if (document.documentElement.requestFullscreen && innerWidth > 900) await document.documentElement.requestFullscreen(); } catch (e) {}
      restart();
    };
    window.claude?.hot?.snapshot?.(() => ({ notes: G.notes }));
  }
  if (window.claude?.hot?.ready) window.claude.hot.ready(start); else start(window.claude?.hot?.data ?? {});
})();
