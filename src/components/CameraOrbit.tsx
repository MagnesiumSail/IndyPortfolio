"use client";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

type Deg = number;

export type CameraOrbitProps = {
  makeDefault?: boolean;
  target?: THREE.Vector3 | [number, number, number];
  initialRadius?: number;          // starting distance
  minRadius?: number;              // clamp min
  maxRadius?: number;              // clamp max
  azimuthRange?: [Deg, Deg];       // degrees, relative to offset
  elevationRange?: [Deg, Deg];     // degrees, relative to offset
  azimuthOffset?: Deg;             // degrees
  elevationOffset?: Deg;           // degrees
  smooth?: {                        // damping coefficients
    mouse: number;
    radius: number;
  };
  invertScroll?: boolean;          // flip wheel direction
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

  // normalize target to a vector ref
  const lookTarget = useRef<THREE.Vector3>(
    target instanceof THREE.Vector3
      ? target.clone()
      : new THREE.Vector3(...(target as [number, number, number]))
  );

  // smoothed fractions (0..1)
  const tX = useRef(0.5);
  const tY = useRef(0.5);

  // radius state
  const radius = useRef(initialRadius);
  const radiusTarget = useRef(initialRadius);

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
      const sign = invertScroll ? 1 : -1;
      const next = radiusTarget.current - sign * e.deltaY * 0.05;
      radiusTarget.current = THREE.MathUtils.clamp(next, minRadius, maxRadius);
    };
    gl.domElement.addEventListener("wheel", onWheel, { passive: false });
    return () => gl.domElement.removeEventListener("wheel", onWheel);
  }, [gl, invertScroll, minRadius, maxRadius]);

  useFrame((_, delta) => {
    if (!cam.current) return;

    // pointer.x/y are in [-1, 1]; map to [0, 1]
    const tXTarget = (1 - pointer.x) * 0.5;
    const tYTarget = (1 - pointer.y) * 0.5;

    tX.current = damp(tX.current, tXTarget, smooth.mouse, delta);
    tY.current = damp(tY.current, tYTarget, smooth.mouse, delta);
    radius.current = damp(radius.current, radiusTarget.current, smooth.radius, delta);

    const az = THREE.MathUtils.lerp(ranges.azMin, ranges.azMax, tX.current) + ranges.azOffset;
    const el = THREE.MathUtils.lerp(ranges.elMin, ranges.elMax, tY.current) + ranges.elOffset;

    const r = radius.current;
    const x = r * Math.cos(el) * Math.sin(az);
    const y = r * Math.sin(el);
    const z = r * Math.cos(el) * Math.cos(az);

    cam.current.position.set(x, y, z);
    cam.current.lookAt(lookTarget.current);
  });

  return <PerspectiveCamera ref={cam} makeDefault={makeDefault} position={[0, 0, initialRadius]} />;
}
