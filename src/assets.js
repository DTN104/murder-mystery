// CA ĐÊM — tải ảnh. Thiếu file nào thì phần vẽ tương ứng tự rơi về procedural.
window.CD = window.CD || {};
CD.assets = (() => {
  const DIR = 'assets/opt/';
  const LIST = {
    room: 'room.jpg',
    cam01: 'cam01.jpg', cam02: 'cam02.jpg', cam03: 'cam03.jpg', cam04: 'cam04.jpg', cam05: 'cam05.jpg', cam06: 'cam06.jpg', cam07: 'cam07.jpg',
    no_face: 'no_face.jpg', no_back: 'no_back.png', no_front: 'no_front.png', no_window: 'no_window.jpg',
    alley: 'alley.jpg', hoodie_door: 'hoodie_door.png', hoodie_walk: 'hoodie_walk.png', khoa: 'khoa.png',
    scene_safe: 'scene_safe.jpg', scene_notebook: 'scene_notebook.jpg',
  };
  const IMG = {};
  let loaded = 0; const total = Object.keys(LIST).length; const listeners = [];
  function onLoad(fn) { listeners.push(fn); }
  function load() {
    Object.entries(LIST).forEach(([k, f]) => {
      const im = new Image();
      im.onload = () => { IMG[k] = im; loaded++; listeners.forEach(fn => fn(k, loaded, total)); };
      im.onerror = () => { loaded++; listeners.forEach(fn => fn(null, loaded, total)); };
      im.src = DIR + f;
    });
  }
  // Nó đứng ở đâu trong từng ảnh cam (tỉ lệ khung): x, chân y, chiều cao; mirror = vùng gương để clip
  const NO_POS = {
    cam01: { x: 0.5, y: 0.78, h: 0.5, img: 'no_front' },
    cam02: { x: 0.66, y: 0.68, h: 0.38, img: 'no_front' },
    cam03: { x: 0.62, y: 0.88, h: 0.64, img: 'no_front' },
    cam04: { x: 0.5, y: 0.96, h: 0.78, img: 'no_front' },
    cam05: { x: 0.5, y: 0.64, h: 0.46, img: 'no_front' },
    cam06: { x: 0.74, y: 0.5, h: 0.34, img: 'no_front', mirror: [0.56, 0.22, 0.37, 0.28], alpha: 0.7 },
    cam07: { x: 0.5, y: 1.0, h: 0.92, img: 'no_back' },
  };
  return { IMG, LIST, NO_POS, load, onLoad, get loaded() { return loaded; }, total };
})();
