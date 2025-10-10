// components/ProjectsWall.tsx
"use client";
import * as THREE from "three";
import { useMemo } from "react";
import { projects } from "./projects";
import ProjectCard from "./projectCard";

type Props = {
  anchor?: [number, number, number];     // world position of the board center
  lookAt?: [number, number, number];     // which point the board faces (e.g., sphere center)
  rows?: number;
  cols?: number;
  gap?: [number, number];                // horizontal, vertical spacing between cards
  cardSize?: [number, number];           // width, height
  boardPadding?: [number, number];       // x,y padding around grid
  showBoard?: boolean;
};

export default function ProjectsWall({
  anchor = [0, 12, -30],
  lookAt = [0, 0, 0],
  rows = 2,
  cols = 3,
  gap = [1, 1],
  cardSize = [6, 3.6],
  boardPadding = [1, 1],
  showBoard = true
}: Props) {
  const [cw, ch] = cardSize;
  const [gx, gy] = gap;

  // compute board size
  const boardWidth = cols * cw + (cols - 1) * gx + boardPadding[0] * 2;
  const boardHeight = rows * ch + (rows - 1) * gy + boardPadding[1] * 2;

  // parent transform: position + orientation to face lookAt
  const group = useMemo(() => {
    const g = new THREE.Group();
    g.position.set(...anchor);
    g.lookAt(new THREE.Vector3(...lookAt));
    return g;
  }, [anchor, lookAt]);

  // background board
  const boardMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x050505,
        transparent: true,
        opacity: 0.95,
        depthWrite: true
      }),
    []
  );

  return (
    <primitive object={group}>
      {showBoard && (
        <mesh position={[0, 0, -0.01]} renderOrder={1}>
          <planeGeometry args={[boardWidth, boardHeight]} />
          <meshBasicMaterial color={0x050505} opacity={0.95} transparent />
        </mesh>
      )}

      {/* cards in a grid */}
      {projects.slice(0, rows * cols).map((p, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;

        // top-left origin
        const x0 = -boardWidth / 2 + boardPadding[0] + cw / 2;
        const y0 = boardHeight / 2 - boardPadding[1] - ch / 2;

        const x = x0 + c * (cw + gx);
        const y = y0 - r * (ch + gy);

        return (
          <group key={p.id} position={[x, y, 0]}>
            <ProjectCard project={p} size={cardSize} />
          </group>
        );
      })}
    </primitive>
  );
}
