import { OrbitControls } from "@react-three/drei";
import CameraOrbit from "./CameraOrbit";
import { useState, useEffect } from "react";

export default function CameraSwapper({ enabled }: { enabled: boolean }) {
    const [isEnabled, setIsEnabled] = useState(enabled);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "t") {
                setIsEnabled((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    return isEnabled ? <OrbitControls /> : <CameraOrbit
              target={[0, 4, -3]}
              initialRadius={28}
              minRadius={10}
              maxRadius={28}
              azimuthRange={[-10, 10]}
              elevationRange={[-10, 15]}
              azimuthOffset={130}
              elevationOffset={40}
              invertScroll={false}
              smooth={{ mouse: 4, radius: 6 }}
            />;
}