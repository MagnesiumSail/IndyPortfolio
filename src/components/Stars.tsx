"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type StarData = {
  position: [number, number, number];
  scale: number;
};

function createStarData(radius: number): StarData {
  const dir = new THREE.Vector3().randomDirection();
  const pos = dir.multiplyScalar(radius);
  const size = 1 + Math.random() * 2;
  return { position: [pos.x, pos.y, pos.z], scale: size };
}

function Star({ data }: { data: StarData }) {
  const ref = useRef<THREE.Mesh>(null!);

  // Each star gets its own spin axis and speed, memoized once
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

  return (
    <mesh ref={ref} position={data.position} scale={0.5}>
      <icosahedronGeometry args={[data.scale, 0]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}

export default function Stars({
  count = 200,
  radius = 30,
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
