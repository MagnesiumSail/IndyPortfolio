import { Lander } from "./lander";
import { useState } from "react";

export function LanderClick() {
  const [hovered, setHovered] = useState(false);
  return (
    <group
    position={[3, 4.2, -5]}
    rotation={[Math.PI, -0.6, 0.78]}
    onPointerOver={(e) => {
      e.stopPropagation(); // prevents hover leaks to background
      setHovered(true);
      document.body.style.cursor = "pointer";
    }}
    onPointerOut={(e) => {
      setHovered(false);
      document.body.style.cursor = "auto";
    }}
    onClick={(e) => {
      e.stopPropagation();
      console.log("Lander clicked!");
    }}
  >
    <Lander scale={hovered ? 0.33 : 0.3} />
  </group>
  );
}


/* <Lander scale={0.3} 
                position={[3.1, 4.0, -4.9]} 
                rotation={[Math.PI, -0.6, 0.78]} 
                /> */