"use client";
import { useGLTF } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function Curtains() {
  const { scene } = useGLTF("/curtain.glb");

  const firstScene = useMemo(() => scene.clone(true), [scene]);
  const secondScene = useMemo(() => scene.clone(true), [scene]);

  const groupFirst = useRef<THREE.Group>(null);
  const groupSecond = useRef<THREE.Group>(null);

  return (
    <>
      {/* First Curtain */}
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        scale={[0.0035, 0.0113, 0.01]}
        position={[-2.6, 0.02, 2.19]}
      >
        <primitive ref={groupFirst} object={firstScene} />
      </mesh>

      {/* Second Curtain */}
      <mesh
        rotation={[-0.06, Math.PI / 2, 0]}
        scale={[0.0038, 0.0111, 0.01]}
        position={[-2.61, 0.08, 3.62]}
      >
        <primitive ref={groupSecond} object={secondScene} />
      </mesh>

      {/* Curtain Rod / Bar */}
      <mesh position={[-2.6, 2.57, (2 + 3.7) / 2]} rotation={[1.56, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.2, 32]} />
        <meshStandardMaterial color="#838783" />
      </mesh>
    </>
  );
}
