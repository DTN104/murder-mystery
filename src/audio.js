// CA ĐÊM — âm thanh procedural (WebAudio). Chỉ khởi tạo sau một cú bấm của người chơi.
window.CD = window.CD || {};
CD.audio = (() => {
  const A = { ctx: null, master: null };
  let reduce = false;
  function init() {
    if (A.ctx) return;
    try {
      A.ctx = new (window.AudioContext || window.webkitAudioContext)();
      A.master = A.ctx.createGain(); A.master.gain.value = 0.6; A.master.connect(A.ctx.destination);
      // hum UPS
      const o = A.ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 50;
      const f = A.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 160;
      const g = A.ctx.createGain(); g.gain.value = 0.045; o.connect(f).connect(g).connect(A.master); o.start();
      A.hum = g;
    } catch (e) { A.ctx = null; }
  }
  function setReduce(v) { reduce = v; }
  function noiseBurst(dur, vol, hp) {
    if (!A.ctx) return;
    const sr = A.ctx.sampleRate, n = Math.floor(sr * dur), b = A.ctx.createBuffer(1, n, sr), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = A.ctx.createBufferSource(); s.buffer = b;
    const f = A.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp || 400;
    const g = A.ctx.createGain(), t = A.ctx.currentTime; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    s.connect(f).connect(g).connect(A.master); s.start();
  }
  // ba tiếng gõ tay lên cửa sắt
  function knock() {
    if (!A.ctx) return;
    for (let i = 0; i < 3; i++) {
      const t = A.ctx.currentTime + i * 0.33, o = A.ctx.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
      const g = A.ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(reduce ? 0.35 : 0.8, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
      o.connect(g).connect(A.master); o.start(t); o.stop(t + 0.3);
    }
  }
  function lockClick() { noiseBurst(0.07, 0.35, 1800); }
  function scrape() { noiseBurst(0.6, 0.18, 900); }
  function screech() {
    if (!A.ctx) return;
    if (reduce) { noiseBurst(0.5, 0.12, 200); return; }
    const t = A.ctx.currentTime, o = A.ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(210, t); o.frequency.exponentialRampToValueAtTime(1500, t + 0.55);
    const g = A.ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.9, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    o.connect(g).connect(A.master); o.start(t); o.stop(t + 1); noiseBurst(0.9, 0.8, 250);
  }
  function resumeRoom() {
    if (A.hum) { A.hum.gain.cancelScheduledValues(A.ctx.currentTime); A.hum.gain.setTargetAtTime(0.045, A.ctx.currentTime, 0.1); }
  }
  // Interference, a genuinely silent 150 ms gap, then a short synchronized impact.
  function startApproach(soft, noiseSeconds = 2.5) {
    if (!A.ctx) return () => {};
    const ctx = A.ctx, t = ctx.currentTime, nodes = [], sources = [];
    const silence = t + noiseSeconds, hit = silence + .15, end = hit + .28;
    if (A.hum) { A.hum.gain.setTargetAtTime(0, t, .08); A.hum.gain.setValueAtTime(0, silence); }
    const bus = ctx.createGain(); bus.gain.value = soft ? .18 : .65; bus.connect(A.master); nodes.push(bus);
    const connect = (source, filter, gain) => { source.connect(filter).connect(gain).connect(bus); sources.push(source); nodes.push(source, filter, gain); };
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const hiss = ctx.createBufferSource(); hiss.buffer = buffer; hiss.loop = true;
    const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.Q.value = .7; filter.frequency.value = 1800;
    const noiseGain = ctx.createGain(); noiseGain.gain.setValueAtTime(.12, t);
    noiseGain.gain.linearRampToValueAtTime(.07, t + .4); noiseGain.gain.linearRampToValueAtTime(.1, silence - .01);
    noiseGain.gain.linearRampToValueAtTime(0, silence); noiseGain.gain.setValueAtTime(0, hit);
    noiseGain.gain.linearRampToValueAtTime(.45, hit + .01); noiseGain.gain.linearRampToValueAtTime(0, end);
    connect(hiss, filter, noiseGain); hiss.start(t); hiss.stop(end);
    const thud = ctx.createOscillator(); thud.type = 'sine'; thud.frequency.setValueAtTime(90, hit); thud.frequency.exponentialRampToValueAtTime(30, end);
    const low = ctx.createBiquadFilter(); low.type = 'lowpass'; low.frequency.value = 180;
    const bass = ctx.createGain(); bass.gain.setValueAtTime(0, hit); bass.gain.linearRampToValueAtTime(.22, hit + .012); bass.gain.linearRampToValueAtTime(0, end);
    connect(thud, low, bass); thud.start(hit); thud.stop(end);
    if (!soft) {
      const shriek = ctx.createOscillator(); shriek.type = 'sawtooth';
      shriek.frequency.setValueAtTime(210, hit); shriek.frequency.exponentialRampToValueAtTime(1500, hit + .18);
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2600;
      const g = ctx.createGain(); g.gain.setValueAtTime(.0001, hit); g.gain.exponentialRampToValueAtTime(.5, hit + .01); g.gain.exponentialRampToValueAtTime(.0001, end);
      connect(shriek, f, g); shriek.start(hit); shriek.stop(end);
    }
    let stopped = false;
    return () => { if (stopped) return; stopped = true; bus.gain.cancelScheduledValues(ctx.currentTime); bus.gain.setValueAtTime(0, ctx.currentTime); sources.forEach(s => { try { s.stop(); } catch (_) {} }); nodes.forEach(n => n.disconnect()); };
  }
  return { init, setReduce, noiseBurst, knock, lockClick, scrape, screech, startApproach, resumeRoom };
})();
