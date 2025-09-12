"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three"
import { Model } from "./starObject";
//Almost anything in the Three.js docs can be used in R3F just by writing <ambientLight /> or <meshStandardMaterial /> instead of new THREE.AmbientLight()

function SpinningModel() {
  const ref = useRef<THREE.Mesh>(null!);

  /*const { axis, speed, q } = useMemo(() => {
    return {
      axis: new THREE.Vector3(
        THREE.MathUtils.randFloat(-1,1),
        THREE.MathUtils.randFloat(-1,1),
        THREE.MathUtils.randFloat(-1,1),
      ).normalize(),
      speed: THREE.MathUtils.randFloat(0.5,2.0),
      q: new THREE.Quaternion()
    }
  }, []) */

  useFrame((_, delta) => {
    /*q.setFromAxisAngle(axis, speed * delta)
    ref.current.quaternion.multiply(q)*/
    ref.current.rotation.x += 0.005;
    ref.current.rotation.y += 0.002;
    ref.current.rotation.z += 0.001;
    console.log (ref.current.rotation);
  })

  return (
    <group ref={ref}>
      <Model />
    </group>
  )

}


export default function Scene() {

  return (
    <div className="App">
      <Canvas style={{ width: "100vw", height: "100vh" }}>
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <SpinningModel />
      {/* Removed directionalLight for flat look */}
      <OrbitControls />
      </Canvas>
    </div>
  );
}
