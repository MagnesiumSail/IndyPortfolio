// constellationFactory.ts
import * as THREE from "three";
import type { StarData } from "./starFactory";

export type Edge = { a: number; b: number };

/*/explain
kSeedBuckets: Splits a set of 3D points into 
k
k spatially separated groups ("buckets") using a farthest-point seeding algorithm. This helps create multiple, well-separated constellations.

mst: For a group of points, finds a set of edges that connect all points with the minimum total distance (using Prim’s Minimum Spanning Tree algorithm). This ensures each constellation is a single connected structure with no cycles.

buildConstellations: Selects the top fraction of stars by size, splits them into groups using kSeedBuckets, and then connects each group into a constellation using mst. The result is a set of edges representing the lines between stars in each constellation.

In summary: these functions take a list of stars, pick the most prominent ones, group them, and connect them in a visually meaningful way to form constellations.*/

type ConstellationOpts = {
  topFraction?: number; // take the largest X% of stars (default 0.07 = 7%)
  groups?: number; // split top stars into this many groups (default 3)
  rng?: () => number; // optional seeded RNG
};

const defaultRng = Math.random;

/** Simple farthest-point seeding into `k` buckets */
function kSeedBuckets(points: THREE.Vector3[], k: number, rng = defaultRng) {
  const n = points.length;
  const seeds: number[] = [];
  seeds.push((rng() * n) | 0);
  while (seeds.length < k && seeds.length < n) {
    let best = -1;
    let bestDist = -1;
    for (let i = 0; i < n; i++) {
      let dmin = Infinity;
      for (const s of seeds)
        dmin = Math.min(dmin, points[i].distanceTo(points[s]));
      if (dmin > bestDist) {
        bestDist = dmin;
        best = i;
      }
    }
    if (best >= 0) seeds.push(best);
    else break;
  }
  // assign to nearest seed
  const buckets: number[][] = Array.from({ length: seeds.length }, () => []);
  for (let i = 0; i < n; i++) {
    let bestJ = 0,
      bestD = Infinity;
    for (let j = 0; j < seeds.length; j++) {
      const d = points[i].distanceTo(points[seeds[j]]);
      if (d < bestD) {
        bestD = d;
        bestJ = j;
      }
    }
    buckets[bestJ].push(i);
  }
  return buckets;
}

/** Prim’s MST over a set of indices; returns edges as pairs of local indices */
function mst(localIndices: number[], pts: THREE.Vector3[]): Edge[] {
  if (localIndices.length <= 1) return [];
  const inTree = new Set<number>();
  inTree.add(localIndices[0]);
  const edges: Edge[] = [];

  const dist = (i: number, j: number) => pts[i].distanceTo(pts[j]);

  while (inTree.size < localIndices.length) {
    let bestA = -1,
      bestB = -1,
      best = Infinity;
    for (const a of inTree) {
      for (const b of localIndices) {
        if (inTree.has(b)) continue;
        const d = dist(a, b);
        if (d < best) {
          best = d;
          bestA = a;
          bestB = b;
        }
      }
    }
    if (bestA >= 0 && bestB >= 0) {
      edges.push({ a: bestA, b: bestB });
      inTree.add(bestB);
    } else break;
  }
  return edges;
}

/** Build constellation edges among the largest stars */
export function buildConstellations(
  stars: StarData[],
  opts: ConstellationOpts = {},
  exclude: Set<number> = new Set()
): Edge[] {
  const { topFraction = 0.07, groups = 3, rng = defaultRng } = opts;
  const pool = [...stars.keys()].filter(i => !exclude.has(i));
  if (pool.length === 0) return [];

  // pick top by scale
  const k = Math.max(3, Math.floor(pool.length * topFraction));
  const sorted = pool.sort((a, b) => stars[b].scale - stars[a].scale);
  const topIdx = sorted.slice(0, k);

  // points
  const pts = stars.map((s) => new THREE.Vector3(...s.position));
  const topPts = topIdx.map((i) => pts[i]);

  // bucket the top indices so you get multiple constellations
  const bucketsLocal = kSeedBuckets(
    topPts,
    Math.min(groups, topIdx.length),
    rng
  );

  // run MST per bucket, but translate local indices back to global star indices
  const allEdges: Edge[] = [];
  for (const bucket of bucketsLocal) {
    if (bucket.length < 2) continue;
    // map local->global
    const globalIdx = bucket.map((i) => topIdx[i]);
    // MST needs global coordinates; pass those indices
    const edgesLocal = mst(globalIdx, pts);
    allEdges.push(...edgesLocal);
  }

  return allEdges;
}
