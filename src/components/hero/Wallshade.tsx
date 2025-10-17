"use client";
import useDarkMode from "@/hooks/useDarkMode";
import { useEffect, useRef } from "react";
import * as THREE from "three";
interface WallShadeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  intensity?: number;
}

export default function WallShade({
  position,
  rotation = [0, 0, 0],
  intensity = 0.08,
}: WallShadeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isDark = useDarkMode();

  useEffect(() => {
    if (!meshRef.current) return;

    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    const color = new THREE.Color(isDark ? "#000000" : "#111111");
    material.color.copy(color);
    material.opacity = intensity;
    material.transparent = true;
  }, [isDark, intensity]);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        transparent
        opacity={intensity}
        roughness={1}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
