import { useMemo } from "react";
import { createStarFactory } from "./starFactory";
import { StarsRenderer } from "./starRenderer";
import { buildConstellations } from "./constellationFactory";
import { ConstellationsRenderer } from "./constellationRenderer";
import { addStaticStars, edgesFromPolyline } from "./fixedConstellations";

const LETTERS: Record<string, [number, number, number][]> = {
  Ibot: [
    [-40, -30, 160],
    [-50, -30, 160],
    [-60, -30, 160],
  ],
  Imid: [
    [-50, -30, 160],
    [-50, -10, 160],
  ],
  Itop: [
    [-40, -10, 160],
    [-50, -10, 160],
    [-60, -10, 160],
  ],
  N: [
    [-70, -30, 160],
    [-70, -10, 160],
    [-90, -30, 160],
    [-90, -10, 160],
  ],
  D: [
    [-100, -30, 160],
    [-100, -10, 160],
    [-110, -15, 160],
    [-110, -25, 160],
  ],
  Y: [
    [-125, -30, 160],
    [-125, -15, 160],
    [-135, -5, 160],
    [-115, -5, 160],
  ],
  B: [
    [-190, -30, 160],
    [-190, -5, 160],
    [-190, -12, 150],
    [-190, -17, 160],
    [-190, -22, 150],
  ],
  R: [
    [-190, -30, 135],
    [-190, -5, 135],
    [-190, -10, 125],
    [-190, -15, 135],
    [-190, -30, 125],
  ],
  O: [
    [-190, -20, 115],
    [-190, -30, 110],
    [-190, -30, 105],
    [-190, -20, 100],
    [-190, -10, 105],
    [-190, -10, 110],
  ],
  W: [
    [-190, -5, 95],
    [-190, -30, 90],
    [-190, -10, 85],
    [-190, -30, 80],
    [-190, -5, 75],
  ],
  Nlast: [
    [-190, -30, 70],
    [-190, -10, 70],
    [-190, -30, 60],
    [-190, -10, 60],
  ],
};

export default function StarsScene() {
  const { stars, edgesRandom, edgesFixed } = useMemo(() => {
    const factory = createStarFactory();
    const stars = factory.listOnSphere(1200, 300);

    // add fixed stars for letters
    const fixedIndexMap: Record<string, number[]> = {};
    for (const [letter, positions] of Object.entries(LETTERS)) {
      fixedIndexMap[letter] = addStaticStars(stars, factory.at, positions, 0.1);
    }
    let edgesFixed: { a: number; b: number }[] = [];

    const iIbot = fixedIndexMap.Ibot;
    const iImid = fixedIndexMap.Imid;
    const iItop = fixedIndexMap.Itop;

    if (iIbot?.length >= 3) {
      edgesFixed.push(
        { a: iIbot[0], b: iIbot[1] },
        { a: iIbot[1], b: iIbot[2] }
      );
    }
    if (iImid?.length >= 2) {
      edgesFixed.push({ a: iImid[0], b: iImid[1] });
    }
    if (iItop?.length >= 3) {
      edgesFixed.push(
        { a: iItop[0], b: iItop[1] },
        { a: iItop[1], b: iItop[2] }
      );
    }

    const iN = fixedIndexMap.N;
    if (iN?.length > 1) {
      edgesFixed.push(...edgesFromPolyline(iN));
    }

    const iD = fixedIndexMap.D;
    if (iD?.length > 1) {
      edgesFixed.push(...edgesFromPolyline(iD));
      edgesFixed.push({ a: iD[iD.length - 1], b: iD[0] });
    }
    const iY = fixedIndexMap.Y;
    if (iY?.length > 1) {
      edgesFixed.push({ a: iY[0], b: iY[1] });
      edgesFixed.push({ a: iY[1], b: iY[2] });
      edgesFixed.push({ a: iY[1], b: iY[3] });
    }
    const iB = fixedIndexMap.B;
    if (iB?.length > 1) {
      edgesFixed.push(...edgesFromPolyline(iB));
      edgesFixed.push({ a: iB[iB.length - 1], b: iB[0] });
    }
    const iR = fixedIndexMap.R;
    if (iR?.length > 1) {
      edgesFixed.push(...edgesFromPolyline(iR));
    }
    const iO = fixedIndexMap.O;
    if (iO?.length > 1) {
      edgesFixed.push(...edgesFromPolyline(iO));
      edgesFixed.push({ a: iO[iO.length - 1], b: iO[0] });
    }
    const iW = fixedIndexMap.W;
    if (iW?.length > 1) {
      edgesFixed.push(...edgesFromPolyline(iW));
    }
    const iNlast = fixedIndexMap.Nlast;
    if (iNlast?.length > 1) {
      edgesFixed.push(...edgesFromPolyline(iNlast));
    }

    const exclude = new Set<number>(Object.values(fixedIndexMap).flat());
    const edgesRandom = buildConstellations(
      stars,
      { topFraction: 0.08, groups: 12 },
      exclude
    );

    return { stars, edgesRandom, edgesFixed };
  }, []);

  return (
    <>
      <StarsRenderer stars={stars} />;
      <ConstellationsRenderer stars={stars} edges={edgesRandom} opacity={0.7} />
      <ConstellationsRenderer stars={stars} edges={edgesFixed} opacity={0.9} />
    </>
  );
}
