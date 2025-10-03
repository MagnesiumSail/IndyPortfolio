"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Model } from "./moonObjects";
import CameraOrbit from "./CameraOrbit";


//Almost anything in the Three.js docs can be used in R3F just by writing <ambientLight /> or <meshStandardMaterial /> instead of new THREE.AmbientLight()

function SpinningModel() {
  const ref = useRef<THREE.Group>(null!);

  const { axis, speed, q } = useMemo(() => {
    return {
      axis: new THREE.Vector3(
        THREE.MathUtils.randFloat(-1, 1),
        THREE.MathUtils.randFloat(-1, 1),
        THREE.MathUtils.randFloat(-1, 1)
      ).normalize(),
      speed: THREE.MathUtils.randFloat(0.5, 2.0),
      q: new THREE.Quaternion(),
    };
  }, []);

  useFrame((_, delta) => {
    q.setFromAxisAngle(axis, speed * delta);
    ref.current.quaternion.multiply(q);
  });

  // random position on a sphere of radius 30
  let dir = new THREE.Vector3().randomDirection(); //this gives a random direction vector. randomDirection accepts no arguments and returns a unit vector (length of 1)
  //dir.z = Math.abs(dir.z);
  const r = 30; // radius of sphere
  const pos = dir.multiplyScalar(r); // scale the direction vector to the radius which in less math terms means multiply each component of the vector by r
  const size = 1 + Math.random() * 2; // random size between 1 and 3

  return (
    <mesh ref={ref} position={[pos.x, pos.y, pos.z]} scale={0.5}>
      <icosahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}



export default function Scene() {
  return (
    <div className="App">
      <Canvas style={{ width: "99vw", height: "99vh" }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 5, -10]} intensity={1} />
        <Model />
        {Array.from({ length: 300 }).map((_, i) => (
          <SpinningModel key={i} />
        ))}
        <CameraOrbit
          target={[0, 4, -3]}
          initialRadius={28}
          minRadius={10}
          maxRadius={28}
          azimuthRange={[-10, 10]}
          elevationRange={[-10, 15]}
          azimuthOffset={130}
          elevationOffset={40}
          invertScroll={false}      // set true to flip scroll
          smooth={{ mouse: 4, radius: 6 }}
        />
        {/**/}
      </Canvas>
    </div>
  );
}
