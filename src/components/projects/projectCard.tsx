// components/ProjectCard.tsx
"use client";
import * as THREE from "three";
import { Text, Image } from "@react-three/drei";
import { useMemo } from "react";
import type { Project } from "./projects";

type Props = {
  project: Project;
  size?: [number, number]; // width, height in world units
};

export default function ProjectCard({ project, size = [6, 3.6] }: Props) {
  const [w, h] = size;

  const bgMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x111111, // card background
        transparent: true,
        opacity: 0.9,
        depthWrite: true
      }),
    []
  );

  return (
    <group>
      {/* Background */}
      <mesh material={bgMat}>
        <planeGeometry args={[w, h]} />
      </mesh>

      {/* Optional image at left */}
      {project.image && (
        <group position={[-w * 0.5 + 0.9, 0, 0.01]}>
          <mesh>
            <planeGeometry args={[1.6, 1.2]} />
            <meshBasicMaterial color={0x222222} />
          </mesh>
          <Image
            url={project.image}
            scale={[1.54, 1.04]}
            position={[0, 0, 0.02]}
            toneMapped={false}
          />
        </group>
      )}

      {/* Title */}
      <Text
        position={[project.image ? -w * 0.1 : -w * 0.45, h * 0.3, 0.02]}
        fontSize={0.32}
        anchorX="left"
        anchorY="top"
        maxWidth={project.image ? w * 0.7 : w * 0.85}
      >
        {project.title}
      </Text>

      {/* Blurb */}
      <Text
        position={[project.image ? -w * 0.1 : -w * 0.45, h * 0.05, 0.02]}
        fontSize={0.22}
        anchorX="left"
        anchorY="top"
        maxWidth={project.image ? w * 0.7 : w * 0.85}
        color="#cccccc"
      >
        {project.blurb}
      </Text>

      {/* Tags */}
      {project.tech && project.tech.length > 0 && (
        <Text
          position={[project.image ? -w * 0.1 : -w * 0.45, -h * 0.35, 0.02]}
          fontSize={0.18}
          anchorX="left"
          anchorY="bottom"
          maxWidth={project.image ? w * 0.7 : w * 0.85}
          color="#86c5a6"
        >
          {project.tech.join(" • ")}
        </Text>
      )}

      {/* Click hit-area; swap to onPointerDown if you want */}
      <mesh
        position={[0, 0, 0.03]}
        onClick={() => {
          if (project.href) window.open(project.href, "_blank");
        }}
        visible={false}
      >
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
