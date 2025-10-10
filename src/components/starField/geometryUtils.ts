// geometryUtils.ts
import * as THREE from "three";

export type SphericalCap = {
  /** Unit vector from sphere center pointing to the cap center */
  dir: THREE.Vector3;
  /** Cap half-angle in radians, e.g. THREE.MathUtils.degToRad(8) */
  angle: number;
};

export function inCap(p: THREE.Vector3, cap: SphericalCap): boolean {
  // p can be any radius; we only care about direction
  const v = p.clone().normalize();
  // Inside if angle(v, dir) <= angle  <=>  v·dir >= cos(angle)
  return v.dot(cap.dir) >= Math.cos(cap.angle);
}
