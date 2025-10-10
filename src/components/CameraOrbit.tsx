"use client";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { camera, type CameraConfig } from "./cameraState";

type Deg = number;

export type CameraOrbitProps = {
  makeDefault?: boolean;
  target?: THREE.Vector3 | [number, number, number];
  initialRadius?: number; // starting distance
  minRadius?: number; // clamp min
  maxRadius?: number; // clamp max
  azimuthRange?: [Deg, Deg]; // degrees, relative to offset
  elevationRange?: [Deg, Deg]; // degrees, relative to offset
  azimuthOffset?: Deg; // degrees
  elevationOffset?: Deg; // degrees
  smooth?: {
    // damping coefficients
    mouse: number;
    radius: number;
  };
  invertScroll?: boolean; // flip wheel direction
};

function damp(current: number, target: number, lambda: number, dt: number) {
  return target + (current - target) * Math.exp(-lambda * dt);
}

export default function CameraOrbit({
  makeDefault = true,
  target = new THREE.Vector3(0, 0, 0),
  initialRadius = 40,
  minRadius = 10,
  maxRadius = 100,
  azimuthRange = [-10, 10],
  elevationRange = [-10, 15],
  azimuthOffset = 130,
  elevationOffset = 40,
  smooth = { mouse: 4, radius: 6 },
  invertScroll = false,
}: CameraOrbitProps) {
  const cam = useRef<THREE.PerspectiveCamera>(null!);
  const { pointer, gl } = useThree();

  const cfgRef = useRef<CameraConfig | null>(null);

  const azMin = useRef(THREE.MathUtils.degToRad(azimuthRange[0]));
  const azMax = useRef(THREE.MathUtils.degToRad(azimuthRange[1]));
  const elMin = useRef(THREE.MathUtils.degToRad(elevationRange[0]));
  const elMax = useRef(THREE.MathUtils.degToRad(elevationRange[1]));
  const azOffset = useRef(THREE.MathUtils.degToRad(azimuthOffset));
  const elOffset = useRef(THREE.MathUtils.degToRad(elevationOffset));

  const minR = useRef(minRadius);
  const maxR = useRef(maxRadius);
  const invert = useRef(invertScroll);
  const smoothRef = useRef(smooth);

  // normalize target to a vector ref
  const lookTarget = useRef(
    new THREE.Vector3(
      target instanceof THREE.Vector3 ? target.x : target[0],
      target instanceof THREE.Vector3 ? target.y : target[1],
      target instanceof THREE.Vector3 ? target.z : target[2]
    )
  );
  const targetGoal = useRef(lookTarget.current.clone());

  // smoothed fractions (0..1)
  const tX = useRef(0.5);
  const tY = useRef(0.5);

  // radius state
  const radius = useRef(initialRadius);
  const radiusTarget = useRef(initialRadius);

  // on mount, subscribe to camera state changes
  useEffect(() => {
    // seed from authority if someone set before mount
    const init = camera.get();
    applyCfg(init);

    const unsub = camera.subscribe((next) => {
      applyCfg(next);
    });
    return unsub;

    function applyCfg(next: CameraConfig) {
      cfgRef.current = next;

      // positional/zoom goals
      targetGoal.current.copy(next.target);
      radiusTarget.current = THREE.MathUtils.clamp(
        next.initialRadius,
        next.minRadius,
        next.maxRadius
      );

      // ranges/offsets
      azMin.current = THREE.MathUtils.degToRad(next.azimuthRange[0]);
      azMax.current = THREE.MathUtils.degToRad(next.azimuthRange[1]);
      elMin.current = THREE.MathUtils.degToRad(next.elevationRange[0]);
      elMax.current = THREE.MathUtils.degToRad(next.elevationRange[1]);
      azOffset.current = THREE.MathUtils.degToRad(next.azimuthOffset);
      elOffset.current = THREE.MathUtils.degToRad(next.elevationOffset);

      // limits and smoothing
      minR.current = next.minRadius;
      maxR.current = next.maxRadius;
      invert.current = next.invertScroll;
      smoothRef.current = next.smooth;
    }
  }, []);

  // precompute radian ranges
  const ranges = useMemo(() => {
    return {
      azMin: THREE.MathUtils.degToRad(azimuthRange[0]),
      azMax: THREE.MathUtils.degToRad(azimuthRange[1]),
      elMin: THREE.MathUtils.degToRad(elevationRange[0]),
      elMax: THREE.MathUtils.degToRad(elevationRange[1]),
      azOffset: THREE.MathUtils.degToRad(azimuthOffset),
      elOffset: THREE.MathUtils.degToRad(elevationOffset),
    };
  }, [azimuthRange, elevationRange, azimuthOffset, elevationOffset]);

  // wheel: adjust target radius only
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const sign = invert.current ? 1 : -1;
      const next = radiusTarget.current - sign * e.deltaY * 0.05;
      radiusTarget.current = THREE.MathUtils.clamp(
        next,
        minR.current,
        maxR.current
      );
    };
    gl.domElement.addEventListener("wheel", onWheel, { passive: false });
    return () => gl.domElement.removeEventListener("wheel", onWheel);
  }, [gl]);

  useFrame((_, delta) => {
    if (!cam.current) return;

    // pointer.x/y are in [-1, 1]; map to [0, 1]
    const tXTarget = (1 + pointer.x) * 0.5;
    const tYTarget = (1 + pointer.y) * 0.5;

    lookTarget.current.lerp(targetGoal.current, 1 - Math.exp(-6 * delta));

    tX.current = damp(tX.current, tXTarget, smoothRef.current.mouse, delta);
    tY.current = damp(tY.current, tYTarget, smoothRef.current.mouse, delta);
    radius.current = damp(
      radius.current,
      radiusTarget.current,
      smoothRef.current.radius,
      delta
    );

    const az =
      THREE.MathUtils.lerp(azMin.current, azMax.current, tX.current) +
      azOffset.current;
    const el =
      THREE.MathUtils.lerp(elMin.current, elMax.current, tY.current) +
      elOffset.current;

    const r = radius.current;
    const x = r * Math.cos(el) * Math.sin(az);
    const y = r * Math.sin(el);
    const z = r * Math.cos(el) * Math.cos(az);

    cam.current.position.set(x, y, z);
    console.log(cam.current.position);
    cam.current.lookAt(lookTarget.current);
  });

  return (
    <PerspectiveCamera
      ref={cam}
      makeDefault={makeDefault}
      position={[0, 0, initialRadius]}
    />
  );
}
