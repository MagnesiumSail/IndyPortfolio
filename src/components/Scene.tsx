"use client";
//TODO: make cursor tracking event based. Right now it updates every frame which is inefficient.
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three-stdlib";
import { useLoader } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";


//Almost anything in the Three.js docs can be used in R3F just by writing <ambientLight /> or <meshStandardMaterial /> instead of new THREE.AmbientLight()

function CameraWithCursor() {
  const cam = useRef<THREE.PerspectiveCamera>(null!);
  const { pointer, gl } = useThree();

  // Sphere radius and angle limits
  const [radius, setRadius] = useState(20);

   useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Scroll up: e.deltaY < 0, Scroll down: e.deltaY > 0
      setRadius(r => THREE.MathUtils.clamp(r + e.deltaY * 0.01, 5, 30));
    };
    gl.domElement.addEventListener("wheel", onWheel, { passive: false });
    return () => gl.domElement.removeEventListener("wheel", onWheel);
  }, [gl]);

  // Azimuth = spin around Y, Elevation = up/down from equator
  const azMin = THREE.MathUtils.degToRad(-10);
  const azMax = THREE.MathUtils.degToRad( 10);
  const azOffset = THREE.MathUtils.degToRad(120);
  const elMin = THREE.MathUtils.degToRad(-10);
  const elMax = THREE.MathUtils.degToRad( 15);
  const elOffset = THREE.MathUtils.degToRad(40);


  let tXCurrent = 0.5;
  let tYCurrent = 0.5;
  useFrame(() => {
    if (!cam.current) return;

    // pointer.x, pointer.y are in [-1, 1]. Map to your angle ranges.


    const tXTarget = (1 - pointer.x) * 0.5;      // 0..1
    const tYTarget = (1 - pointer.y) * 0.5;      // invert Y so up moves up

    tXCurrent = damp(tXCurrent, tXTarget, 4, 0.016);
    tYCurrent = damp(tYCurrent, tYTarget, 4, 0.016);

    //const tXCurrent = THREE.MathUtils.lerp(tXTarget, 0.5, 0.1);
    //const tYCurrent = THREE.MathUtils.lerp(tYTarget, 0.5, 0.1);

    const az = THREE.MathUtils.lerp(azMin, azMax, tXCurrent) + azOffset; // theta
    const el = THREE.MathUtils.lerp(elMin, elMax, tYCurrent) + elOffset; // elevation

    // Spherical to Cartesian
    const x = radius * Math.cos(el) * Math.sin(az);
    const y = radius * Math.sin(el);
    const z = radius * Math.cos(el) * Math.cos(az);

    cam.current.position.set(x, y, z);
    cam.current.lookAt(0, 0, 0);
  });

  return <PerspectiveCamera ref={cam} makeDefault position={[0, 0, radius]} />;
}

function damp(current: number, target: number, lambda: number, dt: number): number {
  return target + (current - target) * Math.exp(-lambda * dt);
}

function DaMoon() {
  const ref = useRef<THREE.Mesh>(null!);
  const obj = useLoader(OBJLoader, '/moonzeld/source/zeldmoon/moon.obj');
  return <primitive object={obj} />
  /*useFrame((_, delta) => {
    /*q.setFromAxisAngle(axis, speed * delta)
    ref.current.quaternion.multiply(q)/*
    ref.current.rotation.x += 0.005;
    ref.current.rotation.y += 0.002;
    ref.current.rotation.z += 0.001;
    console.log (ref.current.rotation);
  })*/

  
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
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 5, -10]} intensity={1} />
        <DaMoon />
        {Array.from({ length: 100 }).map((_, i) => (
          <SpinningModel key={i} />
        ))}
        <CameraWithCursor />
        {/**/}
      </Canvas>
    </div>
  );
}
