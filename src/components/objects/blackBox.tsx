// objects/blackBox.ts
import * as THREE from "three";

export default function createBlackBox(): THREE.Group {
  const width1 = 105, height1 = 33;
  const width2 = 115, height2 = 38;

  const planeGeo1 = new THREE.PlaneGeometry(width1, height1);
  const planeGeo2 = new THREE.PlaneGeometry(width2, height2);

  const planeMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    depthWrite: true,   // occludes things behind it
    depthTest: true,
  });

  const plane1 = new THREE.Mesh(planeGeo1, planeMat);
  const plane2 = new THREE.Mesh(planeGeo2, planeMat);

  plane1.position.set(-90, -18, 165);
  plane2.position.set(-195, -18, 113);
  plane2.rotation.y = Math.PI / 2;

  const group = new THREE.Group();
  group.add(plane1, plane2);

  // Optional: ensure they draw late so they cover background sparkles even if depth equal
  group.renderOrder = 10;

  return group;
}
