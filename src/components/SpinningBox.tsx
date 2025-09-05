"use client";

import { Canvas } from "@react-three/fiber";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";

export default function SpinningBox() {
  return (
    <Canvas style={{ height: 400 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <mesh rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshWobbleMaterial color="hotpink" speed={1} factor={1} />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}
