"use client";
import { Canvas } from "@react-three/fiber";
import { Moon } from "./moonObjects";
import { Lander } from "./lander";
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
        <Lander scale={0.3} 
                position={[3, 4.1, -4.9]} 
                rotation={[-0.26, Math.PI * 2.16, -0.6]} 
                />
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
