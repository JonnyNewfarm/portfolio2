"use client";
import { useLoader } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import useDarkMode from "@/hooks/useDarkMode";

export default function Wall() {
  const wallTexture = useLoader(
    THREE.TextureLoader,
    "/fabrics/stone-wall2.webp"
  );
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(4, 4);
  wallTexture.colorSpace = THREE.SRGBColorSpace;

  const meshRef = useRef<THREE.Mesh | null>(null);
  const isDark = useDarkMode();

  // Wall shape
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, 3.32);
  shape.lineTo(0.6, 3.39);
  shape.lineTo(3.1, 3.7);
  shape.lineTo(3, 0);
  shape.lineTo(0, 0);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const applyColor = (mat: any, colorHex: string) => {
      if (mat.color) mat.color.set(colorHex);
      mat.needsUpdate = true;
    };

    const color = isDark ? "#7d7c7c" : "#ffffff";
    const mat = mesh.material as any;
    Array.isArray(mat)
      ? mat.forEach((m) => applyColor(m, color))
      : applyColor(mat, color);
  }, [isDark]);

  // 🛹 Skateboard deck geometry
  const deckShape = new THREE.Shape();
  const length = 0.8;
  const width = 0.2;
  const radius = 0.1;

  // rounded ends
  deckShape.absarc(0, 0, radius, Math.PI / 2, -Math.PI / 2, true);
  deckShape.lineTo(length - radius, -width / 2);
  deckShape.absarc(length - radius, 0, radius, -Math.PI / 2, Math.PI / 2, true);
  deckShape.lineTo(radius, width / 2);

  const extrudeSettings = {
    steps: 2,
    depth: 0.02,
    bevelEnabled: false,
  };
  const deckGeometry = new THREE.ExtrudeGeometry(deckShape, extrudeSettings);

  // Add slight upward curve on both ends
  deckGeometry.translate(-length / 2, 0, 0);
  const pos = deckGeometry.attributes.position;
  const curveAmount = 0.1;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getX(i);
    if (z < -0.3 || z > 0.3) {
      const bend = curveAmount * Math.abs(z) * Math.sign(z);
      pos.setY(i, pos.getY(i) + bend);
    }
  }
  pos.needsUpdate = true;
  deckGeometry.computeVertexNormals();

  return (
    <>
      {/* Wall */}
      <mesh
        ref={meshRef}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[1.5, 1.43, 1]}
        position={[-2.6, 0, 0]}
      >
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          map={wallTexture}
          roughness={0.7}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
