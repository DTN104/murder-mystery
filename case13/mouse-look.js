// Pointer lock on desktop, with hover look when the host does not support it.
// Touch keeps its drag gesture. UI callbacks deliberately release the pointer.
export function createMouseLook({canvas, canLook, rotate, onChange, onEscape, onFallback}) {
  let intentionalRelease = false;
  let freeLook = false;
  let requesting = false;
  let drag = null;
  let hover = null;
  let fallbackReported = false;
  const locked = () => document.pointerLockElement === canvas;
  const active = () => locked() || freeLook;
  const changed = () => onChange(active(), locked());

  function fallback() {
    if (!canLook()) return;
    freeLook = true;
    hover = null;
    changed();
    if (!fallbackReported) { fallbackReported = true; onFallback(); }
  }
  async function request() {
    if (!canLook() || locked() || requesting || matchMedia('(pointer:coarse)').matches) return;
    if (!canvas.requestPointerLock) { fallback(); return; }
    requesting = true;
    try { await canvas.requestPointerLock(); }
    catch { fallback(); }
    finally { requesting = false; }
  }
  function release() {
    freeLook = false;
    drag = hover = null;
    if (locked()) { intentionalRelease = true; document.exitPointerLock(); }
    changed();
  }
  document.addEventListener('pointerlockchange', () => {
    const isLocked = locked();
    if (isLocked && !canLook()) { intentionalRelease = true; document.exitPointerLock(); return; }
    freeLook = false;
    drag = hover = null;
    changed();
    if (!isLocked && !intentionalRelease && canLook()) onEscape();
    intentionalRelease = false;
  });
  document.addEventListener('pointerlockerror', fallback);
  document.addEventListener('mousemove', e => {
    if (locked() && canLook()) rotate(e.movementX, e.movementY, false);
  });
  canvas.addEventListener('pointerdown', e => {
    if (!canLook() || e.button !== 0) return;
    if (e.pointerType === 'mouse') request();
    drag = {id:e.pointerId, x:e.clientX, y:e.clientY};
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!canLook() || locked()) return;
    if (e.pointerType === 'mouse' && freeLook) {
      if (hover) rotate(e.clientX-hover.x, e.clientY-hover.y, false);
      hover = {x:e.clientX, y:e.clientY};
    } else if (drag?.id === e.pointerId) {
      rotate(e.clientX-drag.x, e.clientY-drag.y, e.pointerType !== 'mouse');
      drag.x=e.clientX; drag.y=e.clientY;
    }
  });
  canvas.addEventListener('pointerleave', () => { hover=null; });
  const stopDrag = () => { drag=null; };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);
  return {request, release, get active(){return active();}};
}
