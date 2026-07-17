"use client";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Chair() {
  const { scene } = useGLTF("/chair_1.glb");
  const group = useRef<THREE.Group>(null);

  return (
    <mesh scale={2} position={[0.17, -0.15, 2]} rotation={[0, 0, 0]}>
      <primitive ref={group} object={scene} />
    </mesh>
  );
}
