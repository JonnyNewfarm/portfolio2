"use client";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Bird() {
  const { scene } = useGLTF("/bird.glb");
  const group = useRef<THREE.Group>(null);

  return (
    <>
      <mesh rotation={[Math.PI / 0.1, 0.2, -0.15]} position={[-2.5, 1.4, 2.6]}>
        <primitive ref={group} object={scene} scale={6.5} />
      </mesh>
    </>
  );
}
