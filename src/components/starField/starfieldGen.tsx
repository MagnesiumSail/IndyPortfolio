import { useMemo } from "react";
import { createStarFactory } from "./starFactory";
import { StarsRenderer } from "./starRenderer";

export default function StarsScene() {
  const stars = useMemo(() => {
    const factory = createStarFactory();
    const list = factory.listOnSphere(1200, 300);

    // Example: add a weighted constellation point
    list.push(factory.at([10, 20, 30], 1.5));

    // You can inspect or connect stars into constellations here before rendering
    return list;
  }, []);

  return <StarsRenderer stars={stars} />;
}
