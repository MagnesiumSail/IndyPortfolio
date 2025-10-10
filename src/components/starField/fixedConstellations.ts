// fixedConstellations.ts
import type { StarData } from "./starFactory";

/** Connects a sequence of indices like a polyline: i0-i1, i1-i2, ... */
export function edgesFromPolyline(indices: number[], extras: Array<[number, number]> = []) {
  const E: { a: number; b: number }[] = [];
  for (let i = 1; i < indices.length; i++) E.push({ a: indices[i - 1], b: indices[i] });
  for (const [a, b] of extras) E.push({ a, b });
  return E;
}

/** Pushes stars at given positions, returns the global indices that were added. */
export function addStaticStars(
  stars: StarData[],
  makeAt: (pos: [number, number, number], weight?: number) => StarData,
  positions: Array<[number, number, number]>,
  weight = 1.5
) {
  const added: number[] = [];
  for (const p of positions) {
    stars.push(makeAt(p, weight));
    added.push(stars.length - 1); // global index of the just-pushed star
  }
  return added;
}
