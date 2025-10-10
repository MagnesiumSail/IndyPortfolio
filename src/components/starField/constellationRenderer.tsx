// ConstellationsRenderer.tsx
"use client";
import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import type { StarData } from "./starFactory";
import type { Edge } from "./constellationFactory";

type Props = {
  stars: StarData[];
  edges: Edge[];
  opacity?: number;      // 0..1
};

export function ConstellationsRenderer({ stars, edges, opacity = 0.6 }: Props) {
  const line = useRef<THREE.LineSegments>(null!);

    // build line geometry from star positions and edges
  const { positions } = useMemo(() => {
    const arr: number[] = [];
    const getPos = (i: number) => stars[i].position;
    // each edge is two points
    for (const e of edges) {
      const a = getPos(e.a);
      const b = getPos(e.b);
      arr.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    }
    return { positions: new Float32Array(arr) };
  }, [stars, edges]);

  // this geometry is static after first render
  // so we can memoize it and not worry about updates
  // (if stars or edges change, a new geometry will be created)
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  // create materials for lines
  const material = useMemo(() => {
    const m = new THREE.LineBasicMaterial({
      color: new THREE.Color("#7fc6ff"), // soft blue
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    return m;
  }, [opacity]);

  // small glow by duplicating with thicker, fainter line
  const glowMaterial = useMemo(() => {
    const m = new THREE.LineBasicMaterial({
      color: new THREE.Color("#b7e2ff"),
      transparent: true,
      opacity: opacity * 1.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    // emulate thickness by rendering slightly offset in clip space (simple hack not perfect)
    return m;
  }, [opacity]);

  // dispose on unmount
  useEffect(() => {
    return () => {
      geom.dispose();
      material.dispose();
      glowMaterial.dispose();
    };
  }, [geom, material, glowMaterial]);

  return (
    <>
      <lineSegments ref={line} geometry={geom} material={glowMaterial} />
      <lineSegments geometry={geom} material={material} />
    </>
  );
}
