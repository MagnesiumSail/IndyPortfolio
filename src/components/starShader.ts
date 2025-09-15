import * as THREE from "three";

export const starVertex = /* gl_Position pass-through */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const starFragment = /* always red */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uIntensity;
  uniform vec3  uColor;

  void main() {
    // float tw = 0.5 + 0.5 * sin(uTime * 8.0 + uPhase);
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

export function makeStarUniforms(opts?: {
  phase?: number;
  intensity?: number;
  color?: THREE.ColorRepresentation;
}) {
  return {
    uTime: { value: 0 },
    uPhase: { value: opts?.phase ?? 0 },
    uIntensity: { value: opts?.intensity ?? 1 },
    uColor: { value: new THREE.Color(opts?.color ?? "white") }
  };
}
