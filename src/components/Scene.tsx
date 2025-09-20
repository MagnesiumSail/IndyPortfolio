"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three-stdlib";
import { useLoader } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";


//Almost anything in the Three.js docs can be used in R3F just by writing <ambientLight /> or <meshStandardMaterial /> instead of new THREE.AmbientLight()

  function CursorLogger() {
    const { pointer } = useThree();
    useFrame((state, delta) => {
      state.pointer.x = pointer.x;
      state.pointer.y = pointer.y;
    })
    return null;
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
  dir.z = Math.abs(dir.z);
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
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[-10, 5, -10]} intensity={1} />
        <DaMoon />
        {Array.from({ length: 100 }).map((_, i) => (
          <SpinningModel key={i} />
        ))}
        <OrbitControls />
        <CursorLogger />
        {/**/}
      </Canvas>
    </div>
  );
}
