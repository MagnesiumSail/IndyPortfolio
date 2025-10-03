"use client";
//TODO: make cursor tracking event based. Right now it updates every frame which is inefficient.
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader, MTLLoader } from "three-stdlib";
import { useLoader } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { Model } from "./moonObjects";


//Almost anything in the Three.js docs can be used in R3F just by writing <ambientLight /> or <meshStandardMaterial /> instead of new THREE.AmbientLight()

function CameraWithCursor() {
  const cam = useRef<THREE.PerspectiveCamera>(null!);
  const { pointer, gl } = useThree();

  // Angle window
  const azMin = THREE.MathUtils.degToRad(-10);
  const azMax = THREE.MathUtils.degToRad(10);
  const azOffset = THREE.MathUtils.degToRad(130);
  const elMin = THREE.MathUtils.degToRad(-10);
  const elMax = THREE.MathUtils.degToRad(15);
  const elOffset = THREE.MathUtils.degToRad(40);

  // Smoothed mouse fractions (0..1), kept across renders
  const tX = useRef(0.5);
  const tY = useRef(0.5);

  // Radius: smooth current and a target the wheel modifies
  const radius = useRef(14);
  const radiusTarget = useRef(14);

  // Reusable lookAt target to avoid allocations
  const lookTarget = useRef(new THREE.Vector3(0, 4, -3));

  // Wheel adjusts the target only; no React state here
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const next = radiusTarget.current + e.deltaY * 0.05;
      radiusTarget.current = THREE.MathUtils.clamp(next, 10, 27);
    };
    gl.domElement.addEventListener("wheel", onWheel, { passive: false });
    return () => gl.domElement.removeEventListener("wheel", onWheel);
  }, [gl]);

  useFrame((_, delta) => {
    if (!cam.current) return;

    // Targets from pointer in [-1,1] to [0,1]
    const tXTarget = (1 - pointer.x) * 0.5;
    const tYTarget = (1 - pointer.y) * 0.5;

    // Critically: use refs and real delta time
    tX.current = damp(tX.current, tXTarget, 4, delta);
    tY.current = damp(tY.current, tYTarget, 4, delta);
    radius.current = damp(radius.current, radiusTarget.current, 6, delta);

    const az = THREE.MathUtils.lerp(azMin, azMax, tX.current) + azOffset;
    const el = THREE.MathUtils.lerp(elMin, elMax, tY.current) + elOffset;

    const r = radius.current;
    const x = (r * Math.cos(el) * Math.sin(az));
    const y = (r * Math.sin(el));
    const z = (r * Math.cos(el) * Math.cos(az));

    cam.current.position.set(x, y, z);
    cam.current.lookAt(lookTarget.current);
  });

  return <PerspectiveCamera ref={cam} makeDefault position={[0, 0, 40]} />;
}

function damp(current: number, target: number, lambda: number, dt: number) {
  return target + (current - target) * Math.exp(-lambda * dt);
}

function SpinningModel() {
  const ref = useRef<THREE.Group>(null!);

  const { axis, speed, q } = useMemo(() => {
    return {
      axis: new THREE.Vector3(
        THREE.MathUtils.randFloat(-1, 1),
        THREE.MathUtils.randFloat(-1, 1),
        THREE.MathUtils.randFloat(-1, 1)
      ).normalize(),
      speed: THREE.MathUtils.randFloat(0.5, 2.0),
      q: new THREE.Quaternion(),
    };
  }, []);

  useFrame((_, delta) => {
    q.setFromAxisAngle(axis, speed * delta);
    ref.current.quaternion.multiply(q);
  });

  // random position on a sphere of radius 30
  let dir = new THREE.Vector3().randomDirection(); //this gives a random direction vector. randomDirection accepts no arguments and returns a unit vector (length of 1)
  //dir.z = Math.abs(dir.z);
  const r = 30; // radius of sphere
  const pos = dir.multiplyScalar(r); // scale the direction vector to the radius which in less math terms means multiply each component of the vector by r
  const size = 1 + Math.random() * 2; // random size between 1 and 3

  return (
    <mesh ref={ref} position={[pos.x, pos.y, pos.z]} scale={0.5}>
      <icosahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}



export default function Scene() {
  return (
    <div className="App">
      <Canvas style={{ width: "99vw", height: "99vh" }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 5, -10]} intensity={1} />
        <Model />
        {Array.from({ length: 300 }).map((_, i) => (
          <SpinningModel key={i} />
        ))}
        <CameraWithCursor />
        {/**/}
      </Canvas>
    </div>
  );
}
