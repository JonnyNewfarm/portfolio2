"use client";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Clock() {
  const { scene } = useGLTF("/clock.glb");
  const group = useRef<THREE.Group>(null);

  return (
    <mesh position={[-2.577, 3.39, 1.5]}>
      <primitive
        ref={group}
        object={scene}
        scale={0.85}
        rotation={[0, 1.62, 0.05]}
      />
    </mesh>
  );
}
