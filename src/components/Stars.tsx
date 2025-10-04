"use client";
import { use, useMemo, useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type StarData = {
  position: [number, number, number];
  scale: number;
  brightness: number;
  color: THREE.Color;
};

function createStarData(radius: number): StarData {
  const dir = new THREE.Vector3().randomDirection();
  const pos = dir.multiplyScalar(radius);
  const size = 0.01 + Math.random() * 1.5;
  // Pick a random color from the list
  const starColors = [
  "#ffe5b4", "#ffe5b4", "#ffe5b4", "#ffe5b4", "#ffe5b4", "#ffe5b4", "#ffe5b4", "#ffe5b4",
  "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff",
  "#ffd27f", "#ffd27f","#ffd27f","#ffd27f","#ffd27f","#ffd27f","#ffd27f","#ffd27f",
  "#ff8c5a",
  "#a8c5ff",
  "#cfa7ff"
];
  const colorIndex = Math.floor(Math.random() * starColors.length);
  const color = new THREE.Color(starColors[colorIndex]);
  const brightness = 0. + Math.random() * 0.5 * size;
  return { position: [pos.x, pos.y, pos.z], scale: size, brightness, color };
}

function Star({ data }: { data: StarData }) {
  const ref = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshStandardMaterial>(null!);
  const geoRef = useRef<THREE.IcosahedronGeometry>(null!);
  // spin state
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
    const N = 8; // try 16..48
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) arr.push(new THREE.Vector3().randomDirection());
    return arr;
  }, []);

  useLayoutEffect(() => {
    const g = geoRef.current;
    if (!g) return;
  }, []);

  // patch material once
  const uniforms = useRef<{} | null>(null);
  const handleBeforeCompile = (shader: any) => {
    shader.defines.NUM_SPIKES = spikeDirs.length; // e.g. 24
    shader.uniforms.uAmp = { value: 1 }; // tweak 0.05..0.25
    shader.uniforms.uSharpness = { value: 12.0 }; // higher = tighter peaks
    shader.uniforms.uDirs = { value: spikeDirs }; // vec3[NUM_SPIKES]

    // add uniforms
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `
      #include <common>
      uniform float uAmp;
      uniform float uSharpness;
      uniform vec3 uDirs[NUM_SPIKES];
      `
    );

    // deform along normals after positions are set
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

  useFrame((state, delta) => {
    // spin
    ref.current.quaternion.multiply(q.setFromAxisAngle(axis, speed * delta));
    // advance time uniform
    if (uniforms.current) {
      //uniforms.current.uTime.value = state.clock.getElapsedTime();
    }
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

export default function Stars({
  count = 200,
  radius = 300,
}: {
  count?: number;
  radius?: number;
}) {
  // Generate all star positions and sizes once
  const stars = useMemo(
    () => Array.from({ length: count }, () => createStarData(radius)),
    [count, radius]
  );

  return (
    <>
      {stars.map((d, i) => (
        <Star key={i} data={d} />
      ))}
    </>
  );
}
