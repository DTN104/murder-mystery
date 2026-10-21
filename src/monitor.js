// CA ĐÊM — màn hình (lean-in): tab CAM / HỒ SƠ / BẢNG KẾT LUẬN, bảng ghim (sổ tay).
// Cách hiển thị từng loại bằng chứng (paper, bank, chat, frames, log, photos, ask) nằm ở đây; nội dung nằm trong nights/*.js.
window.CD = window.CD || {};
CD.monitor = (() => {
  const { $, $$, h1, realNow } = CD.util;
  const G = () => CD.G, N = () => CD.night;
  // tòa nhà: 6 cam cố định + CAM 07
  const CAMS = [
    { id: 'cam01', n: '01', name: 'Sảnh thang máy' }, { id: 'cam02', n: '02', name: 'Hành lang B1' }, { id: 'cam03', n: '03', name: 'Kho vật chứng' },
    { id: 'cam04', n: '04', name: 'Phòng server' }, { id: 'cam05', n: '05', name: 'Cầu thang' }, { id: 'cam06', n: '06', name: 'Nhà vệ sinh' },
  ];
  const CAM07 = { id: 'cam07', n: '07', name: '· · ·' };
  const camNumber = id => id === 'cam07' ? '07' : (CAMS.find(c => c.id === id) || {}).n;

  // ---- cam ----
  function buildCamList() {
    const g0 = G(), el = $('#camlist'); el.innerHTML = '';
    CAMS.concat(realNow() < g0.cam07Until ? [CAM07] : []).forEach(cam => { const b = document.createElement('button'); b.role = 'option'; b.dataset.cam = cam.id; b.setAttribute('aria-selected', String(g0.view === cam.id)); if (cam.id === 'cam07') b.className = 'ghost';
      b.innerHTML = `<b>CAM ${cam.n}</b><span>${cam.name}</span>`; b.onclick = () => selectCam(cam.id); el.appendChild(b); });
    $$('.map rect.room').forEach(r => r.classList.toggle('sel', r.dataset.cam === g0.view));
  }
  function selectCam(id) {
    const g0 = G(); g0.view = id; buildCamList(); const cam = id === 'cam07' ? CAM07 : CAMS.find(c => c.id === id);
    $('#osd-cam').textContent = `CAM ${cam.n} · ${cam.name}`; $('#feed').classList.toggle('ghost', id === 'cam07');
    if (id === 'cam07') addNote('CAM 07 · kênh không có trên sơ đồ. Có người đứng quay lưng.');
  }

  // ---- bảng ghim / sổ tay ----
  function renderPins() {
    const g0 = G(), el = $('#pins'); el.innerHTML = '';
    g0.notes.forEach((n, i) => { const d = document.createElement('div'); d.className = 'pin' + (n.startsWith('CAM 07') ? ' odd' : ''); const col = i % 3, row = Math.floor(i / 3) % 3, extra = Math.floor(i / 9);
      d.style.left = (3 + col * 32 + extra * 2) + '%'; d.style.top = (12 + row * 29 + extra * 3) + '%'; d.style.transform = `rotate(${(h1(i * 7) - 0.5) * 7}deg)`; d.title = n;
      const parts = n.split(' · '); const head = parts.length > 1 && parts[0].length <= 3 ? parts.shift() : ''; d.innerHTML = (head ? `<b>${head}</b>` : '<b>&nbsp;</b>') + parts.join(' · '); el.appendChild(d); });
    const ul = $('#notelist'); ul.innerHTML = g0.notes.map(n => `<li>${n}</li>`).join(''); $('#noteempty').hidden = g0.notes.length > 0;
  }
  function addNote(t) { const g0 = G(); if (g0.notes.includes(t)) return; g0.notes.push(t); renderPins(); }

  // ---- hồ sơ ----
  function buildEvList() {
    const g0 = G(), el = $('#evlist'); el.innerHTML = '';
    N().evidence.forEach(ev => { const b = document.createElement('button'); b.role = 'option'; b.dataset.ev = ev.id; b.setAttribute('aria-selected', String(g0.openEv === ev.id)); if (g0.seen.has(ev.id)) b.classList.add('seen');
      const c = document.createElement('canvas'); c.width = 112; c.height = 84; CD.scenes.thumb(c.getContext('2d'), 112, 84, ev); b.appendChild(c);
      const bb = document.createElement('b'); bb.textContent = ev.id; b.appendChild(bb); const t = document.createElement('span'); t.className = 't'; t.textContent = ev.title; b.appendChild(t);
      b.onclick = () => openEv(ev.id); el.appendChild(b); });
  }
  const phoneWrap = (inner, dark) => `<div class="phone${dark ? ' dark' : ''}"><div class="sb"><span>06:42</span><span>▂▄▆ 41%</span></div><div class="scr">${inner}</div></div>`;
  function openEv(id) {
    const g0 = G(), ev = N().evidence.find(e => e.id === id); g0.playing = false; g0.openEv = id;
    if (!g0.seen.has(id)) { g0.seen.add(id); addNote(`${id} · ${ev.note}`); }
    $$('#evlist button').forEach(b => { b.setAttribute('aria-selected', String(b.dataset.ev === id)); if (g0.seen.has(b.dataset.ev)) b.classList.add('seen'); });
    const d = $('#doc'); let html = `<h3>${ev.id} <small>${ev.title}</small></h3>`;
    if (ev.type === 'paper') html += `<div class="paper"><span class="stamp">${ev.stamp || ''}</span><h4>${ev.heading}</h4><div class="meta">${ev.meta || ''}</div>` + ev.paragraphs.map(p => `<p>${p}</p>`).join('') + `</div>`;
    if (ev.type === 'bank') html += phoneWrap(`<div class="bank"><div class="hd">Tài khoản thanh toán<small>${ev.account}</small></div><div class="bal">Số dư khả dụng<b>${ev.balance}</b></div>` + ev.rows.map(r => `<div class="row${r.hot ? ' hot2' : ''}"><span class="to">${r.to}</span><span class="amt ${r.amt[0] === '-' ? 'neg' : 'pos'}">${r.amt}</span><span class="meta">${r.t} · ${r.memo}</span></div>`).join('') + `</div>`) + (ev.cap ? `<p class="cap">${ev.cap}</p>` : '');
    if (ev.type === 'chat') html += phoneWrap(`<div class="chat"><div class="hd"><b>${ev.who}</b>${ev.sub || ''}</div>` + ev.msgs.map(m => m.sys ? `<div class="sys">${m.sys}</div>` : `<div class="b ${m.from}${m.hot ? ' hot2' : ''}">${m.text}<small>${m.t}</small></div>`).join('') + `</div>`, true);
    if (ev.type === 'frames') html += `<div class="frames" id="frames"></div><div class="bigframe"><canvas id="bigcv" width="560" height="420"></canvas><div class="osd"><b>${ev.osd || ''}</b><span id="bigt"></span></div></div><div class="cap" id="bigcap"></div>`;
    if (ev.type === 'log') html += `<div class="log">${ev.lines.join('\n')}</div>` + (ev.cap ? `<p class="cap">${ev.cap}</p>` : '');
    if (ev.type === 'photos') html += `<div class="photos">` + ev.photos.map((p, i) => `<div class="ph"><canvas id="ph${i}" width="480" height="360"></canvas><div class="cap">${p.cap || ''}</div></div>`).join('') + `</div>`;
    if (ev.type === 'ask') html += ev.html || '';
    d.innerHTML = html;
    if (ev.type === 'frames') { const fr = $('#frames'); ev.frames.forEach((f, i) => { const b = document.createElement('button'); b.setAttribute('aria-selected', 'false'); const c = document.createElement('canvas'); c.width = 160; c.height = 120; CD.scenes.alley(c.getContext('2d'), 160, 120, f.scene); b.appendChild(c); const l = document.createElement('div'); l.className = 'lab num'; l.textContent = f.t; b.appendChild(l); b.onclick = () => showFrame(ev, i); fr.appendChild(b); }); showFrame(ev, 0); }
    if (ev.type === 'photos') ev.photos.forEach((p, i) => CD.scenes.photo($('#ph' + i).getContext('2d'), 480, 360, p.scene, p));
  }
  function showFrame(ev, i) {
    const f = ev.frames[i]; $$('#frames button').forEach((b, j) => b.setAttribute('aria-selected', String(i === j)));
    const c = $('#bigcv'); CD.scenes.alley(c.getContext('2d'), c.width, c.height, f.scene); $('#bigt').textContent = (ev.date || '') + '  ' + f.t; $('#bigcap').textContent = f.cap || ''; G().playing = true;
    if (f.note) addNote(f.note);
  }

  // ---- bảng kết luận ----
  function buildBoard() { const el = $('#board'); el.innerHTML = ''; N().board.forEach(s => { const d = document.createElement('div'); d.className = 'slot'; d.innerHTML = `<label for="sel-${s.id}">${s.label}</label><select id="sel-${s.id}"><option value="">chưa chọn</option>${s.opts.map(o => `<option>${o}</option>`).join('')}</select>`; el.appendChild(d); }); }
  function boardResult() { const picks = N().board.map(s => $('#sel-' + s.id).value); if (picks.some(p => !p)) return null; return N().board.filter((s, i) => picks[i] === s.ans).length; }
  function fillBoard() { N().board.forEach(s => { $('#sel-' + s.id).value = s.ans; }); }

  // ---- tab / lean ----
  function setTab(id) { const g0 = G(); g0.tab = id; $$('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === id))); $('#pane-cam').hidden = id !== 'cam'; $('#pane-files').hidden = id !== 'files'; $('#pane-board').hidden = id !== 'board'; if (id !== 'files') g0.playing = false; }
  function setLean(on) { const g0 = G(); if(on&&(!g0.started||g0.dead||g0.over||CD.room.failed))return; g0.lean = on; if(!on)$('#monitor').hidden = true; $('#stage').classList.toggle('lean', on); $('#flip').textContent = on ? '▼ Ngẩng lên' : '▲ Cúi xuống màn hình'; $('#flip').setAttribute('aria-pressed', String(on)); if (!on) g0.playing = false; }
  function bind() {
    $$('.tabs button').forEach(b => b.onclick = () => setTab(b.dataset.tab));
    $$('.map rect.room').forEach(r => r.addEventListener('click', () => selectCam(r.dataset.cam)));
    $('#flip').onclick = () => setLean(!G().lean); $('#hot-mon').onclick = () => setLean(true);
    addEventListener('keydown', e => { const g0 = G(); if (e.key === ' ' && g0.started && !g0.dead && !g0.over && e.target.tagName !== 'SELECT' && e.target.tagName !== 'BUTTON') { e.preventDefault(); setLean(!g0.lean); } if (e.key === 'Escape') setLean(false); });
  }
  return { CAMS, CAM07, camNumber, buildCamList, selectCam, renderPins, addNote, buildEvList, openEv, buildBoard, boardResult, fillBoard, setTab, setLean, bind };
})();
