import { Lander } from "./lander";
import { useState, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { useCursor } from "@react-three/drei";

function OutlineShell({ children, scaleFactor = 1.06 }: { children: React.ReactNode; scaleFactor?: number }) {
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
  const bubbleRadius = 0.9; // how forgiving the hover is

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
      <group position={landerOffset}>
        <Lander scale={landerScale} />
        {hovered && (
          <OutlineShell scaleFactor={1.06}>
            <Lander scale={landerScale} />
          </OutlineShell>
        )}
      </group>
    </group>
  );
}
