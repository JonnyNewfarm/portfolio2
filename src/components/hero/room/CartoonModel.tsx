"use client";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Chair({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const { scene } = useGLTF("/chair_1.glb");
  const group = useRef<THREE.Group>(null);

  return (
    <mesh scale={2} position={[0.17, -0.15, 2]} rotation={[0, 0, 0]}>
      <primitive ref={group} object={scene} />
    </mesh>
  );
}
