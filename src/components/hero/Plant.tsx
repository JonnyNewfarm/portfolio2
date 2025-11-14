"use client";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Plant() {
  const { scene } = useGLTF("/flower5-small.glb");
  const group = useRef<THREE.Group>(null);

  return (
    <>
      <mesh position={[2.8, 0.65, 0.7]}>
        <primitive ref={group} object={scene} scale={0.25} />
      </mesh>
    </>
  );
}
