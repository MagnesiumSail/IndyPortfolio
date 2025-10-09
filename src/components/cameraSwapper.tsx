import { OrbitControls } from "@react-three/drei";
import CameraOrbit from "./CameraOrbit";
import { camera } from "./cameraState";
import { useState, useEffect } from "react";

export default function CameraSwapper({ enabled }: { enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  useEffect(() => {
  // start at 0, 13, -3
  camera.set({ target: [0, 13, -3] });

  // switch to 0, 4, -3 after 15 seconds
  const timeout = setTimeout(() => {
    camera.set({ target: [0, 4, -3] });
  }, 2500);

  return () => clearTimeout(timeout);
}, []);


  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      console.log("Key pressed:", e.key);
    });
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "t") {
        setIsEnabled((prev) => !prev);
      }
      if (e.key === "Escape") {
        camera.set({
          target: [0, 4, -3],
          azimuthRange: [-10, 10],
          initialRadius: 28,
          minRadius: 10,
          maxRadius: 28,
          azimuthOffset: 130,
          elevationOffset: 40,
          elevationRange: [-10, 15],
          invertScroll: false,
          smooth: { mouse: 4, radius: 6 },
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return isEnabled ? (
    <OrbitControls />
  ) : (
    camera.set({
      target: [0, 4, -3],
      azimuthRange: [-10, 10],
      initialRadius: 28,
      minRadius: 10,
      maxRadius: 28,
      azimuthOffset: 130,
      elevationOffset: 40,
      elevationRange: [-10, 15],
      invertScroll: false,
      smooth: { mouse: 4, radius: 6 },
    }) && <CameraOrbit makeDefault />
  );
}
