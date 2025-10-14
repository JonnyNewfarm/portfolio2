"use client";

import { useLoader } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

import * as THREE from "three";

const bookColors = [
  "#ff6b6b", // red
  "#4ecdc4", // teal
  "#ffe66d", // yellow
  "#1a535c", // dark teal
  "#ff9f1c", // orange
  "#2a9d8f", // green
  "#8d99ae", // gray
  "#f4a261", // tan
];

export default function Bookshelf() {
  const textures = useLoader(THREE.TextureLoader, [
    "/fabrics/fabric-1.webp",
    "/fabrics/wood-1.webp",
  ]);

  const bookTexture = textures[0];
  const shelfTexture = textures[1];

  return (
    <group position={[3, 0.33, 0.6]}>
      {/* Shelves */}
      {[0, 0.8, 1.6].map((y, i) => (
        <RoundedBox
          key={i}
          args={[0.8, 0.05, 0.3]}
          radius={0.02}
          smoothness={1}
          position={[0, y + 0.05, 0]}
        >
          <meshStandardMaterial
            map={shelfTexture}
            roughness={0.6}
            metalness={0.1}
          />
        </RoundedBox>
      ))}

      {/* Books */}
      {Array.from({ length: 18 }).map((_, i) => {
        const shelfLevel = Math.floor(i / 6);
        const y = 0.05 + shelfLevel * 0.8;

        const height = 0.15 + Math.random() * 0.15;
        const width = 0.03 + Math.random() * 0.02;
        const depth = 0.08 + Math.random() * 0.03;

        const tiltY = Math.random() < 0.3 ? (Math.random() - 0.5) * 0.3 : 0;
        const tiltX = (Math.random() - 0.5) * 0.02;

        const x = -0.35 + Math.random() * 0.7;
        const z = -0.1 + Math.random() * 0.22;

        const color = bookColors[i % bookColors.length];

        return (
          <mesh
            key={i}
            position={[x, y + height / 2, z]}
            rotation={[tiltX, tiltY, 0]}
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              map={bookTexture}
              color={color}
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}
