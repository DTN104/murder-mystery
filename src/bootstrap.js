// Local module loader: keep the existing CD modules in their dependency order.
const startButton=document.querySelector('#start');startButton.disabled=true;
try {
  window.THREE=await import('../vendor/three/three.module.js');
  for(const file of ['../nights/night1.js','./util.js','./audio.js','./assets.js','./scenes.js','./room-materials.js','./room-scene.js','./room-controls.js','./room.js','./monitor.js','./chat.js','./game.js']) await import(file);
  if(!CD.room.failed)startButton.disabled=false;
} catch(error) {
  console.error(error);
  document.querySelector('#loadst').textContent='Không mở được game 3D. Hãy chạy bằng máy chủ HTTP cục bộ và kiểm tra trình duyệt hỗ trợ WebGL.';
  startButton.disabled=true;
}
