"use client";
import { useMemo, useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { StarData } from "./starFactory";

function Star({ data }: { data: StarData }) {
  const ref = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  const geoRef = useRef<THREE.IcosahedronGeometry>(null!);

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

  const spikeDirs = useMemo(() => {
    const N = 8;
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) arr.push(new THREE.Vector3().randomDirection());
    return arr;
  }, []);

  useLayoutEffect(() => {
    const g = geoRef.current;
    if (!g) return;
  }, []);

  const handleBeforeCompile = (shader: any) => {
    shader.defines.NUM_SPIKES = spikeDirs.length;
    shader.uniforms.uAmp = { value: 1 };
    shader.uniforms.uSharpness = { value: 12.0 };
    shader.uniforms.uDirs = { value: spikeDirs };

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `
      #include <common>
      uniform float uAmp;
      uniform float uSharpness;
      uniform vec3 uDirs[NUM_SPIKES];
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
      #include <begin_vertex>
      vec3 nrm = normalize(normal);
      float s = 0.0;
      for (int i = 0; i < NUM_SPIKES; ++i) {
        float c = max(0.0, dot(nrm, uDirs[i]));
        s = max(s, pow(c, uSharpness));
      }
      transformed += nrm * (uAmp * s);
      `
    );
  };

  useFrame((_, delta) => {
    ref.current.quaternion.multiply(
      new THREE.Quaternion().setFromAxisAngle(axis, speed * delta)
    );
  });

  return (
    <mesh ref={ref} position={data.position} scale={0.5}>
      <icosahedronGeometry ref={geoRef} args={[data.scale, 1]} />
      <meshStandardMaterial
        ref={matRef}
        color={data.color}
        emissive={data.color}
        emissiveIntensity={5 * data.brightness}
        roughness={0.3}
        metalness={0.0}
        onBeforeCompile={handleBeforeCompile}
      />
    </mesh>
  );
}

/** Pure renderer that takes prebuilt data */
export function StarsRenderer({ stars }: { stars: StarData[] }) {
  return (
    <>
      {stars.map((d, i) => (
        <Star key={i} data={d} />
      ))}
    </>
  );
}
