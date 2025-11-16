"use client";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Skateboard() {
  const { scene } = useGLTF("/skate2-small.glb");
  const group = useRef<THREE.Group>(null);

  return (
    <>
      {/* Skateboard */}
      <mesh position={[4.12, 0.5, 1]}>
        <primitive
          ref={group}
          object={scene}
          scale={0.1}
          rotation={[Math.PI / 0.1, 2, -2]}
        />
      </mesh>

      {/* Stool  */}
      <group rotation={[0, Math.PI / 6, 0]} position={[4.1, 0, 0.6]}>
        {/* Top platform */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.3]} />
          <meshStandardMaterial color="#e6ede9" />
        </mesh>

        {/* Four legs */}
        <mesh position={[-0.19, 0.09, -0.14]}>
          <boxGeometry args={[0.045, 0.25, 0.05]} />
          <meshStandardMaterial color="#e6ede9" />
        </mesh>
        <mesh position={[0.2, 0.08, -0.11]}>
          <boxGeometry args={[0.045, 0.25, 0.05]} />
          <meshStandardMaterial color="#e6ede9" />
        </mesh>
        <mesh position={[-0.19, 0.12, 0.11]}>
          <boxGeometry args={[0.045, 0.25, 0.05]} />
          <meshStandardMaterial color="#e6ede9" />
        </mesh>
        <mesh position={[0.2, 0.13, 0.15]}>
          <boxGeometry args={[0.05, 0.25, 0.05]} />
          <meshStandardMaterial color="#e6ede9" />
        </mesh>
      </group>
    </>
  );
}
