import * as T from '../vendor/three/three.module.js';

// A lit character card keeps the authored silhouette and cloth detail readable
// under the flashlight. It faces the viewer, while the AI heading selects the
// front or back artwork; pursuit position and collision stay on the root.
export function createPursuer() {
  const root = new T.Group();
  root.name = 'pursuer';
  root.visible = false;
  const visual = new T.Group();
  visual.name = 'pursuer-visual';
  root.add(visual);

  const geometry = new T.PlaneGeometry(1.16, 2.32, 16, 24);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    // A shallow surface gives the cloth a soft lighting gradient without
    // distorting the face or moving the silhouette outside its alpha mask.
    positions.setZ(i, .045 * Math.max(0, 1 - (x / .58) ** 2));
  }
  geometry.computeVertexNormals();
  const material = new T.MeshStandardMaterial({
    color: '#c5ccc1', roughness: .94, metalness: 0,
    alphaTest: .35, side: T.FrontSide,
    emissive: '#d1dfd6', emissiveIntensity: .09,
  });
  const figure = new T.Mesh(geometry, material);
  figure.name = 'pursuer-character';
  figure.position.y = 1.16;
  figure.receiveShadow = true;
  visual.add(figure);

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 64;
  const context = shadowCanvas.getContext('2d');
  const falloff = context.createRadialGradient(32, 32, 2, 32, 32, 32);
  falloff.addColorStop(0, '#000a');
  falloff.addColorStop(.35, '#0006');
  falloff.addColorStop(1, '#0000');
  context.fillStyle = falloff;
  context.fillRect(0, 0, 64, 64);
  const shadowMap = new T.CanvasTexture(shadowCanvas);
  const shadow = new T.Mesh(
    new T.CircleGeometry(.34, 24),
    new T.MeshBasicMaterial({map: shadowMap, transparent: true, opacity: .7, depthWrite: false}),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.y = .62;
  shadow.position.y = .008;
  root.add(shadow);

  const loadImage = name => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Không tải được tạo hình nhân vật: ' + name));
    image.src = new URL('../assets/opt/' + name, import.meta.url).href;
  });
  const texture = image => {
    const map = new T.Texture(image);
    map.colorSpace = T.SRGBColorSpace;
    map.anisotropy = 4;
    map.needsUpdate = true;
    return map;
  };
  let front, back, portrait, facingBack = false;
  const ready = Promise.all([
    loadImage('no_front.png'), loadImage('no_back.png'), loadImage('no_face.jpg'),
  ]).then(([frontImage, backImage, closeup]) => {
    front = texture(frontImage);
    back = texture(backImage);
    portrait = closeup;
    material.map = material.emissiveMap = front;
    material.needsUpdate = true;
  });

  function update(camera, time, reduce) {
    if (!root.visible || !front) return;
    const dx = camera.position.x - root.position.x;
    const dz = camera.position.z - root.position.z;
    const viewAngle = Math.atan2(dx, dz);
    const facing = Math.cos(viewAngle - root.rotation.y);
    // Hysteresis avoids flickering between artworks when seen side-on.
    if (facingBack ? facing > .18 : facing < -.18) {
      facingBack = !facingBack;
      material.map = material.emissiveMap = facingBack ? back : front;
    }
    visual.rotation.y = viewAngle - root.rotation.y;
    visual.rotation.z = reduce ? 0 : Math.sin(time * .9) * .008;
    figure.scale.y = reduce ? 1 : 1 + Math.sin(time * 1.7) * .003;
  }
  return {root, ready, update, get portrait() { return portrait; }};
}
