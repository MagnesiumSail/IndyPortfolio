import { useMemo } from "react";
import { createStarFactory } from "./starFactory";
import { StarsRenderer } from "./starRenderer";
import { buildConstellations } from "./constellationFactory";
import { ConstellationsRenderer } from "./constellationRenderer";

export default function StarsScene() {
  const { stars, edges } = useMemo(() => {
    const factory = createStarFactory();
    const stars = factory.listOnSphere(1200, 300);

    // Example: add a weighted constellation point
    stars.push(factory.at([10, 20, 30], 1.5));
    const edges = buildConstellations(stars, { topFraction: 0.08, groups: 12 });

    // You can inspect or connect stars into constellations here before rendering
    return { stars, edges };
  }, []);

  return(
    <>
    <StarsRenderer stars={stars} />;
    <ConstellationsRenderer stars={stars} edges={edges} opacity={0.6} />;
    </>
  ) 
}
