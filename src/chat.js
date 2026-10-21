// CA ĐÊM — bộ đàm: tin từ ĐTV / hệ thống, bong bóng cạnh bộ đàm, hỏi nghi phạm.
window.CD = window.CD || {};
CD.chat = (() => {
  const { $, rnd } = CD.util;
  const G = () => CD.G, N = () => CD.night;
  const msgs = [], pending = new Set(); let toastT = 0;
  function say(from, text, cls) {
    const g0 = G(); msgs.push({ from, text, cls }); const el = $('#msgs'); el.innerHTML = msgs.slice(-40).map(m => `<div class="m ${m.cls || ''}"><b>${m.from}</b> ${m.text}</div>`).join(''); el.scrollTop = el.scrollHeight;
    if ($('#radio').hidden && from !== 'Bạn') { g0.unread++; $('#radiobtn').classList.add('new'); const t = $('#toast'); t.className = cls === 'odd' ? 'odd show' : 'show'; t.innerHTML = `<b>${from}:</b> ${text}`; clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 7000); }
  }
  function clear() { pending.forEach(clearTimeout); pending.clear(); clearTimeout(toastT); $('#toast').classList.remove('show'); msgs.length = 0; $('#msgs').innerHTML = ''; }
  function buildChips() { const g0 = G(), el = $('#chips'); el.innerHTML = ''; N().suspects.forEach(s => { const who = document.createElement('span'); who.className = 'who'; who.textContent = s.name + ':'; el.appendChild(who); s.qs.forEach((q, i) => { const key = s.id + i, b = document.createElement('button'); b.textContent = q.q; b.disabled = g0.asked.has(key); b.onclick = () => ask(s, q, key); el.appendChild(b); }); }); }
  function ask(s, q, key) { const g0 = G(); g0.asked.add(key); say('Bạn', `→ ${s.name}: ${q.q}`, 'me'); buildChips(); const reply = setTimeout(() => { pending.delete(reply); const g1 = G(); if (g1.dead || g1.over) return; say('ĐTV', q.a); if (q.note) CD.monitor.addNote(q.note); }, rnd(4000, 8000) / Math.sqrt(Math.max(.1, g0.speed))); pending.add(reply); }
  function openRadio(on) { const g0 = G(); $('#radio').hidden = !on; $('#radiobtn').setAttribute('aria-expanded', String(on)); if (on) { g0.unread = 0; $('#radiobtn').classList.remove('new'); $('#toast').classList.remove('show'); buildChips(); } }
  function bind() { $('#radiobtn').onclick = () => openRadio($('#radio').hidden); $('#hot-radio').onclick = () => openRadio(true); $('#radio-close').onclick = () => openRadio(false); }
  return { say, clear, buildChips, openRadio, bind };
})();
