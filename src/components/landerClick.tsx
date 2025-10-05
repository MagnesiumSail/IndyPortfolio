import { Lander } from "./lander";
import { useState, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";


function OutlineShell({ children, scaleFactor = 1.03 }: { children: React.ReactNode; scaleFactor?: number }) {
  const ref = useRef<THREE.Group>(null!);
  useLayoutEffect(() => {
    const mat = new THREE.MeshBasicMaterial({
      color: "white",
      side: THREE.BackSide,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    ref.current.traverse((o: any) => {
      if (o.isMesh) {
        o.material = mat;
        o.raycast = () => null; // shell doesn't catch events
      }
    });
  }, []);
  return <group ref={ref} scale={scaleFactor}>{children}</group>;
}

export function LanderClick() {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // One world-space anchor for both things
  const basePos: [number, number, number] = [3, 4.2, -5];
  const baseRot: [number, number, number] = [Math.PI, -0.6, 0.78];

  // Independent local offsets
  const landerOffset: [number, number, number] = [0.0, 0.0, 0.0];  // move the lander relative to base
  const bubbleOffset: [number, number, number] = [0.0, -0.4, 0.0];  // move the bubble relative to base
  const landerScale = 0.3;
  const bubbleRadius = 0.9;

  const animRef = useRef<THREE.Group>(null!);

  const intensity = useRef(0);

  useFrame((state, delta) => {
    const target = hovered ? 1 : 0;
    intensity.current += THREE.MathUtils.damp(intensity.current, target, 4, delta);

    const t = state.clock.getElapsedTime();
    const s = intensity.current;

    if (animRef.current) {
        animRef.current.position.y = landerOffset[1] + 0.03 * s * Math.sin(t * 6.0);

        animRef.current.position.x = landerOffset[0] + 0.02 * s * Math.sin(t * 5.0);
        animRef.current.position.z = landerOffset[2] + 0.02 * s * Math.cos(t * 4.0);

        animRef.current.rotation.x = 0.06 * s * Math.sin(5.3 * t);
        animRef.current.rotation.z = 0.05 * s * Math.cos(4.9 * t);

        animRef.current.rotation.y = 0.03 * s * Math.sin(9.2 * t);
    }
  });

  return (
    <group position={basePos} rotation={baseRot}>
      {/* Invisible, offset hit bubble (handles all events) */}
      <mesh
        position={bubbleOffset}
        visible={false}
        onPointerOver={(e) => { e.stopPropagation(); if (!hovered) setHovered(true); }}
        onPointerOut={() => { if (hovered) setHovered(false); }}
        onClick={(e) => { e.stopPropagation(); console.log("Lander clicked!"); }}
      >
        <sphereGeometry args={[bubbleRadius, 16, 16]} />
        <meshBasicMaterial />
      </mesh>

      {/* Visual lander, independently positioned */}
      <group ref={animRef} position={landerOffset}>
        <Lander scale={hovered ? landerScale * 1.1 : landerScale} />
        {hovered && (
          <OutlineShell scaleFactor={1.03}>
            <Lander scale={hovered ? landerScale * 1.1 : landerScale} />
          </OutlineShell>
        )}
      </group>
    </group>
  );
}


