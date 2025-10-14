"use client";

import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import { useTransform } from "framer-motion";

import { useRef } from "react";
import * as THREE from "three";
import useDarkMode from "@/hooks/useDarkMode";

interface ScreenHintProps {
  scrollYProgress: MotionValue<number>;
}

export default function ScreenHint({ scrollYProgress }: ScreenHintProps) {
  const textRef = useRef<THREE.Mesh>(null);
  const cylinderRef = useRef<THREE.Mesh>(null);
  const arrowRef = useRef<THREE.Mesh>(null);

  const isDark = useDarkMode();

  const opacity = useTransform(
    scrollYProgress,
    [0.05, 0.15, 0.8, 0.95],
    [0, 1, 1, 0]
  );

  useFrame(() => {
    const o = opacity.get();
    const color = new THREE.Color(isDark ? "#ffffff" : "#000000");

    [textRef, arrowRef, cylinderRef].forEach((ref) => {
      if (ref.current) {
        const mat = ref.current.material as THREE.MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = o;
        mat.color.copy(color);
      }
    });
  });

  return (
    <group position={[0.39, 2.9, 0.43]}>
      {/* Cylinder */}
      <mesh
        ref={cylinderRef}
        position={[0.08, -0.19, 0]}
        rotation={[-Math.PI / 5 - 6, 2.4, 4.2]}
      >
        <cylinderGeometry args={[0.023, 0.023, 0.23, 2]} />
        <meshStandardMaterial color="#4B3621" />
      </mesh>

      {/* Text */}
      <Text
        ref={textRef}
        fontSize={0.146}
        anchorX="center"
        anchorY="middle"
        position={[0, 0.017, 0]}
      >
        Navigate on the screen
      </Text>

      {/* Arrow */}
      <mesh
        ref={arrowRef}
        rotation={[-Math.PI / 5 - 6, 2.3, 4.2]}
        position={[0, -0.33, 0]}
      >
        <coneGeometry args={[0.05, 0.15, 16]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
}
