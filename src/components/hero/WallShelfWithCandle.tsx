"use client";

import { RoundedBox } from "@react-three/drei";

import { useRef } from "react";
import * as THREE from "three";

export default function WallShelfWithCandle() {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  return (
    <group position={[-0.79, 2.73, 0.15]} rotation={[0, 0, 0]}>
      {/* Shelf board */}
      <RoundedBox args={[1.2, 0.06, 0.3]} radius={0.02} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={"#3d3936"}
          roughness={0.6}
          metalness={0.2}
        />
      </RoundedBox>

      {/* Candle base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.4, 4]} />{" "}
        <meshStandardMaterial color="#fffaf0" roughness={0.7} />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 0.43, 0]}>
        {" "}
        <cylinderGeometry args={[0.005, 0.005, 0.03, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.5, 0]}>
        {" "}
        <sphereGeometry args={[0.02, 2, 1]} />
        <meshStandardMaterial
          color="#ffcc33"
          emissive="#ff8800"
          emissiveIntensity={1}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Light emitted by candle */}
      <pointLight
        ref={lightRef}
        position={[0, 0.6, 0]}
        color="#ffb347"
        intensity={0.4}
        distance={1.4}
        decay={0.6}
      />
    </group>
  );
}
