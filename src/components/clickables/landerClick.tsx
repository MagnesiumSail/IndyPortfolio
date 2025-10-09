import { Lander } from "../objects/landerObject";
import { useState, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { camera } from "../cameraState";

export function SimpleSmoke({ count = 10, origin = [0, 0, 0] }) {
  const groupRef = useRef<THREE.Group>(null!);

  // Store per-sphere data
  const puffs = useRef(
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        origin[0] + THREE.MathUtils.randFloatSpread(1),
        origin[1],
        origin[2] + THREE.MathUtils.randFloatSpread(1)
      ),
      vel: new THREE.Vector3(
        // Small random horizontal velocity, larger upward velocity
        THREE.MathUtils.randFloatSpread(2),
        // Upward velocity
        THREE.MathUtils.randFloat(0.2, 0.5),
        // Small random horizontal velocity
        THREE.MathUtils.randFloatSpread(2)
      ),
      // 0.1 to 0.5 seconds
      life: Math.random() * 1.3 + 0.1,
      age: 0,
      scale: THREE.MathUtils.randFloat(0.05, 0.1),
    }))
  );

  useFrame((_, delta) => {
    puffs.current.forEach((p, i) => {
      p.age += delta;
      if (p.age > p.life) {
        // Reset puff
        p.pos.set(
          origin[0] + THREE.MathUtils.randFloatSpread(0.3),
          origin[1],
          origin[2] + THREE.MathUtils.randFloatSpread(0.3)
        );
        // Give it a new upward velocity
        p.vel.set(
          THREE.MathUtils.randFloatSpread(2),
          THREE.MathUtils.randFloat(0.2, 0.5),
          THREE.MathUtils.randFloatSpread(2)
        );
        p.life = Math.random() * 1.3 + 0.1;
        p.age = 0;
      }

        // Move puff according to its velocity
      p.pos.addScaledVector(p.vel, delta);
      const obj = groupRef.current.children[i] as THREE.Mesh;
      obj.position.copy(p.pos);
      obj.scale.setScalar(
        p.scale * THREE.MathUtils.lerp(1, 1.5, p.age / p.life)
      );
        // Fade out over lifetime
      if (Array.isArray(obj.material)) {
        obj.material.forEach((mat) => {
          if ("opacity" in mat) {
            (mat as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(
              0.3,
              0,
              p.age / p.life
            );
          }
        });
        // Handle case where material is an array (multi-material)
      } else if ("opacity" in obj.material) {
        (obj.material as THREE.MeshBasicMaterial).opacity =
          THREE.MathUtils.lerp(0.9, 0, p.age / p.life);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {puffs.current.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color="white"
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function OutlineShell({
  children,
  scaleFactor = 1.03,
}: {
  children: React.ReactNode;
  scaleFactor?: number;
}) {
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
  return (
    <group ref={ref} scale={scaleFactor}>
      {children}
    </group>
  );
}

export function LanderClick() {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // One world-space anchor for both things
  const basePos: [number, number, number] = [3, 4.2, -5];
  const baseRot: [number, number, number] = [Math.PI, -0.6, 0.82];

  // Independent local offsets
  const landerOffset: [number, number, number] = [0.0, 0.0, 0.0]; // move the lander relative to base
  const bubbleOffset: [number, number, number] = [0.0, -0.4, 0.0]; // move the bubble relative to base
  const landerScale = 0.3;
  const bubbleRadius = 0.9;

  const animRef = useRef<THREE.Group>(null!);

  const intensity = useRef(0);

  useFrame((state, delta) => {
    const target = hovered ? 1 : 0;
    intensity.current = THREE.MathUtils.damp(
      intensity.current,
      target,
      4,
      delta
    );

    const t = state.clock.getElapsedTime();
    const s = intensity.current;

    if (animRef.current) {
      // subtle vertical bob
      animRef.current.position.y =
        landerOffset[1] + 0.06 * s * Math.sin(60.0 * t);

      // tiny lateral shimmy
      animRef.current.position.x =
        landerOffset[0] + 0.02 * s * Math.sin(4.1 * t);
      animRef.current.position.z =
        landerOffset[2] + 0.02 * s * Math.cos(3.7 * t);

      // wobble (tilt) around X/Z
      animRef.current.rotation.x = 0.03 * s * Math.sin(5.3 * t);
      animRef.current.rotation.z = 0.02 * s * Math.cos(4.9 * t);

      // slight yaw jitter
      animRef.current.rotation.y = 0.02 * s * Math.sin(9.2 * t);
    }
  });

  return (
    <group position={basePos} rotation={baseRot}>
      {/* Invisible, offset hit bubble (handles all events) */}
      <mesh
        position={bubbleOffset}
        visible={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!hovered) setHovered(true);
        }}
        onPointerOut={() => {
          if (hovered) setHovered(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          camera.set({
            target: [0, 10, -3],
            azimuthRange: [-10, 10],
            initialRadius: 28,
            minRadius: 10,
            maxRadius: 28,
            azimuthOffset: 130,
            elevationOffset: 40,
            elevationRange: [-10, 15],
            invertScroll: false,
            smooth: { mouse: 4, radius: 6 }
          });
        }}
      >
        <sphereGeometry args={[bubbleRadius, 16, 16]} />
        <meshBasicMaterial />
      </mesh>

      {/* Visual lander, independently positioned */}
      <group ref={animRef} position={landerOffset}>
        <Lander scale={hovered ? landerScale * 1.1 : landerScale} />
        {hovered && (
          <>
            <OutlineShell scaleFactor={1.03}>
              <Lander scale={hovered ? landerScale * 1.1 : landerScale} />
            </OutlineShell>

            {/* Separate smoke so it doesn't interfere with additive glow */}
            <SimpleSmoke origin={[0, -0.4, 0]} count={100} />
          </>
        )}
      </group>
    </group>
  );
}
