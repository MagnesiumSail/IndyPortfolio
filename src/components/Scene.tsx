"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { starVertex, starFragment, makeStarUniforms } from "./starShader";

function SpinningModel() {
  const ref = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { phase, intensity } = useMemo(
    () => ({
      phase: Math.random() * Math.PI * 2,
      intensity: 0.8 + Math.random() * 0.6
    }),
    []
  );

  const { axis, speed, q } = useMemo(() => {
    return {
      axis: new THREE.Vector3(
        THREE.MathUtils.randFloat(-1, 1),
        THREE.MathUtils.randFloat(-1, 1),
        THREE.MathUtils.randFloat(-1, 1)
      ).normalize(),
      speed: THREE.MathUtils.randFloat(0.5, 2.0),
      q: new THREE.Quaternion()
    };
  }, []);

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
    q.setFromAxisAngle(axis, speed * delta);
    if (ref.current) ref.current.quaternion.multiply(q);
  });

  const dir = new THREE.Vector3().randomDirection();
  const r = 30;
  const pos = dir.multiplyScalar(r);
  const size = 1 + Math.random() * 2;

  return (
    <mesh ref={ref} position={[pos.x, pos.y, pos.z]} scale={0.5}>
      <icosahedronGeometry args={[size, 0]} />
      <shaderMaterial
        ref={matRef}
        // blending={THREE.AdditiveBlending}
        // transparent
        uniforms={makeStarUniforms({ phase, intensity, color: "white" })}
        vertexShader={starVertex}
        fragmentShader={starFragment}
      />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div className="App">
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {Array.from({ length: 100 }).map((_, i) => (
          <SpinningModel key={i} />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
