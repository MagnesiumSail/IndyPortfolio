"use client";
import { Canvas } from "@react-three/fiber";
import { Moon } from "./objects/moonObjects";
import { LanderClick } from "./clickables/landerClick";
import starsScene from "./starField/starfieldGen";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import CameraSwapper from "./cameraSwapper";
import StarsScene from "./starField/starfieldGen";
import blackBox from "./objects/blackBox";
import ProjectWall from "./projects/projectWall";

export default function Scene() {
  return (
    <div className="App">
      <Canvas style={{ width: "99.8vw", height: "99.7vh" }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 5, -10]} intensity={4} />
        <Moon />
        <LanderClick />
      <StarsScene />
        <primitive object={blackBox()} />

        <ProjectWall
          anchor={[23, 32, -35]}    // align with your camera target if you like
          lookAt={[30, 31, -23]}      // face the sphere center
          rows={2}
          cols={1}
          gap={[1, 1]}
          cardSize={[16, 3.6]}
          showBoard
        />

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
