// cameraAuthority.ts
import * as THREE from "three";

type Deg = number;
export type Vec3Like = THREE.Vector3 | [number, number, number];

//set up the types
export type CameraConfig = {
  target: THREE.Vector3;
  initialRadius: number;
  minRadius: number;
  maxRadius: number;
  azimuthRange: [Deg, Deg];
  elevationRange: [Deg, Deg];
  azimuthOffset: Deg;
  elevationOffset: Deg;
  invertScroll: boolean;
  smooth: { mouse: number; radius: number };
};

export type CameraPartial = Partial<Omit<CameraConfig, "target">> & {
  target?: Vec3Like;
};

type Listener = (cfg: CameraConfig) => void;

//default camera for moon
const DEFAULTS: CameraConfig = {
  target: new THREE.Vector3(0, 0, 0),
  initialRadius: 40,
  minRadius: 10,
  maxRadius: 100,
  azimuthRange: [-10, 10],
  elevationRange: [-10, 15],
  azimuthOffset: 130,
  elevationOffset: 40,
  invertScroll: false,
  smooth: { mouse: 4, radius: 6 }
};

let state: CameraConfig = clone(DEFAULTS);
const listeners = new Set<Listener>();

// singleton camera state manager
export const camera = {
  get(): CameraConfig {
    return clone(state);
  },
  set(update: CameraPartial): CameraConfig {
    // merge
    const next = clone(state);

    if (update.target) next.target = toVec3(update.target);
    if (update.initialRadius !== undefined) next.initialRadius = update.initialRadius;
    if (update.minRadius !== undefined) next.minRadius = update.minRadius;
    if (update.maxRadius !== undefined) next.maxRadius = update.maxRadius;
    if (update.azimuthRange) next.azimuthRange = [...update.azimuthRange] as [Deg, Deg];
    if (update.elevationRange) next.elevationRange = [...update.elevationRange] as [Deg, Deg];
    if (update.azimuthOffset !== undefined) next.azimuthOffset = update.azimuthOffset;
    if (update.elevationOffset !== undefined) next.elevationOffset = update.elevationOffset;
    if (update.invertScroll !== undefined) next.invertScroll = update.invertScroll;
    if (update.smooth) next.smooth = { ...next.smooth, ...update.smooth };

    // simple sanity
    if (next.azimuthRange[0] > next.azimuthRange[1]) next.azimuthRange.reverse();
    if (next.elevationRange[0] > next.elevationRange[1]) next.elevationRange.reverse();
    if (next.maxRadius < next.minRadius) next.maxRadius = next.minRadius;
    next.initialRadius = THREE.MathUtils.clamp(next.initialRadius, next.minRadius, next.maxRadius);

    state = next;
    for (const l of listeners) l(state);
    return clone(state);
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
};

// helpers
function toVec3(v: Vec3Like): THREE.Vector3 {
  return v instanceof THREE.Vector3 ? v.clone() : new THREE.Vector3(v[0], v[1], v[2]);
}

function clone(c: CameraConfig): CameraConfig {
  return {
    target: c.target.clone(),
    initialRadius: c.initialRadius,
    minRadius: c.minRadius,
    maxRadius: c.maxRadius,
    azimuthRange: [c.azimuthRange[0], c.azimuthRange[1]],
    elevationRange: [c.elevationRange[0], c.elevationRange[1]],
    azimuthOffset: c.azimuthOffset,
    elevationOffset: c.elevationOffset,
    invertScroll: c.invertScroll,
    smooth: { ...c.smooth }
  };
}
