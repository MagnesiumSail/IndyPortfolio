"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Model } from "./starShape";
//Almost anything in the Three.js docs can be used in R3F just by writing <ambientLight /> or <meshStandardMaterial /> instead of new THREE.AmbientLight()

export default function SpinningBox() {

  return (
    <div className="App">
      <Canvas style={{ width: "100vw", height: "100vh" }}>
      <Model>
        <meshBasicMaterial attach="material" color="yellow" />
      </Model>
      <ambientLight intensity={0.1} />
      {/* Removed directionalLight for flat look */}
      <OrbitControls />
      </Canvas>
    </div>
  );
}
