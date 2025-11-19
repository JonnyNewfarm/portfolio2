"use client";

import { useLoader } from "@react-three/fiber";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import useDarkMode from "@/hooks/useDarkMode";

export default function Wall2() {
  const texture = useLoader(THREE.TextureLoader, "/concrete.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;

  const meshRef = useRef<THREE.Mesh>(null);
  const isDark = useDarkMode();

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, 3.6);
  shape.lineTo(4, 3.6);
  shape.lineTo(4, 0);
  shape.lineTo(0, 0);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const applyColorToMaterial = (mat: any, colorHex: string) => {
      try {
        if (!mat) return;
        if (mat.color) mat.color.set(colorHex);

        mat.needsUpdate = true;
      } catch (e) {
        console.warn("Failed to set material color", e);
      }
    };

    const color = isDark ? "#7d7c7c" : "#ffffff";

    const mat = mesh.material as any;
    if (Array.isArray(mat)) {
      mat.forEach((m) => applyColorToMaterial(m, color));
    } else {
      applyColorToMaterial(mat, color);
    }
  }, [isDark]);

  return (
    <mesh
      ref={meshRef}
      rotation={[0, Math.PI, 0]}
      scale={[2.1, 1.32, 1]}
      position={[5.8, 0, 0]}
    >
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.7}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
