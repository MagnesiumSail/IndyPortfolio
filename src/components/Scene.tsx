"use client";
import { Canvas } from "@react-three/fiber";
import { Model } from "./moonObjects";
import CameraOrbit from "./CameraOrbit";
import Stars from "./Stars";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";

export default function Scene() {
  return (
    <div className="App">
      <Canvas style={{ width: "99vw", height: "99vh" }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 5, -10]} intensity={1} />
        <Model />
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
        <CameraOrbit
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
        />
        {/*<OrbitControls />*/}
      </Canvas>
    </div>
  );
}
