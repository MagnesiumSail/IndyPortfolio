import * as THREE from "three";

export type StarData = {
  position: [number, number, number];
  scale: number;
  brightness: number;
  color: THREE.Color;
};

export type StarFactoryConfig = {
  minSize?: number;   // default 0.01
  maxSize?: number;   // default 1.5 (added to minSize)
  colors?: string[];  // default palette below
};

const defaultStarColors = [
  "#ffe5b4","#ffe5b4","#ffe5b4","#ffe5b4","#ffe5b4","#ffe5b4","#ffe5b4","#ffe5b4",
  "#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff",
  "#ffd27f","#ffd27f","#ffd27f","#ffd27f","#ffd27f","#ffd27f","#ffd27f","#ffd27f",
  "#ff8c5a",
  "#a8c5ff",
  "#cfa7ff"
];

export function createStarFactory(config: StarFactoryConfig = {}) {
  const minSize = config.minSize ?? 0.01;
  const maxSize = config.maxSize ?? 1.5;
  const palette = config.colors ?? defaultStarColors;

  const randSize = () => minSize + Math.random() * maxSize;
  const randColor = () => new THREE.Color(palette[(Math.random() * palette.length) | 0]);

  const make = (position: [number, number, number], baseSize?: number): StarData => {
    const size = baseSize ?? randSize();
    const brightness = 0.0 + Math.random() * 0.5 * size;
    return { position, scale: size, brightness, color: randColor() };
  };

  return {
    /** One random star on the surface of a sphere with radius */
    randomOnSphere(radius: number): StarData {
      const dir = new THREE.Vector3().randomDirection();
      const pos = dir.multiplyScalar(radius);
      return make([pos.x, pos.y, pos.z]);
    },

    /** Several random stars on a sphere */
    listOnSphere(count: number, radius: number): StarData[] {
      return Array.from({ length: count }, () => this.randomOnSphere(radius));
    },

    /** Exact placement with optional weighted size multiplier */
    at(position: [number, number, number], weight = 0): StarData {
      const base = randSize();
      const sized = base * (1 + Math.max(-1, weight));
      return make(position, sized);
    }
  };
}
