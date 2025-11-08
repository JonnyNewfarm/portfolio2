"use client";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function RecordPlayer() {
  const { scene } = useGLTF("/record-player.glb");
  const group = useRef<THREE.Group>(null);

  return (
    <>
      {/* Record player */}
      <mesh position={[4.1, 0.35, 0.4]}>
        <primitive
          ref={group}
          object={scene}
          scale={0.007}
          rotation={[Math.PI / 0.67, 0, 0]}
        />
      </mesh>

      {/* Stool  */}
      <group rotation={[0, Math.PI / 1, 0]} position={[4.1, 0, 0.4]}>
        {/* Top platform */}
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[0.7, 0.03, 0.36]} />
          <meshStandardMaterial color="#adb5a8" />
        </mesh>

        {/* Four legs */}
        <mesh position={[-0.16, 0.15, -0.1]}>
          <boxGeometry args={[0.04, 0.34, 0.05]} />
          <meshStandardMaterial color="#adb5a8" />
        </mesh>
        <mesh position={[0.2, 0.15, -0.11]}>
          <boxGeometry args={[0.04, 0.34, 0.05]} />
          <meshStandardMaterial color="#adb5a8" />
        </mesh>
        <mesh position={[-0.2, 0.12, 0.11]}>
          <boxGeometry args={[0.04, 0.29, 0.05]} />
          <meshStandardMaterial color="#adb5a8" />
        </mesh>
        <mesh position={[0.16, 0.13, 0.11]}>
          <boxGeometry args={[0.04, 0.34, 0.05]} />
          <meshStandardMaterial color="#adb5a8" />
        </mesh>
      </group>
    </>
  );
}
