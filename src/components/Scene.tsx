"use client";
import { Canvas } from "@react-three/fiber";
import { Model } from "./moonObjects";
import CameraOrbit from "./CameraOrbit";
import Stars from "./Stars";

export default function Scene() {
  return (
    <div className="App">
      <Canvas style={{ width: "99vw", height: "99vh" }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 5, -10]} intensity={1} />
        <Model />
        <Stars count={200} radius={30} />
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
      </Canvas>
    </div>
  );
}
