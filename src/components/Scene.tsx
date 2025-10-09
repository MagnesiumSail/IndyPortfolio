"use client";
import { Canvas } from "@react-three/fiber";
import { Moon } from "./moonObjects";
import { LanderClick } from "./landerClick";
import Stars from "./Stars";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import CameraSwapper from "./cameraSwapper";

export default function Scene() {
  return (
    <div className="App">
      <Canvas style={{ width: "99vw", height: "99vh" }}>t
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 5, -10]} intensity={4} />
        <Moon />
        <LanderClick />
        <Stars count={1200} radius={300} />
        <EffectComposer>
          <Bloom
            intensity={0.6} // The bloom intensity.
            luminanceThreshold={0.5} // The luminance threshold. Raise this value to mask out darker elements in the scene.
            luminanceSmoothing={0.1} // Smoothness of the luminance threshold. Range is [0, 1].
            height={1000} // Render height, lower is faster.
            radius={0.6} // Bloom radius.
          />
        </EffectComposer>
        <CameraSwapper enabled={false} />
      </Canvas>
    </div>
  );
}
