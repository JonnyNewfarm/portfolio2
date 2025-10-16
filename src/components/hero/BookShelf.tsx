"use client";

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import { useLoader } from "@react-three/fiber";

const bookColors = [
  "#591616",
  "#b6b897",
  "#d6ccba",
  "#5d6957",
  "#8d99ae",
  "#a65f3d",
];

export default function Bookshelf() {
  const letterTexture = useLoader(THREE.TextureLoader, "/letter.webp");
  letterTexture.colorSpace = THREE.SRGBColorSpace;

  const imgTexture = useLoader(THREE.TextureLoader, "/wall-img4.webp");
  imgTexture.colorSpace = THREE.SRGBColorSpace;
  return (
    <group position={[3, 0.33, 0.6]}>
      {/* Shelves */}
      {[0, 0.8, 1.6].map((y, i) => (
        <RoundedBox
          key={i}
          args={[0.7, 0.05, 0.3]}
          radius={0.02}
          smoothness={1}
          position={[0, y + 0.05, 0]}
        >
          <meshStandardMaterial
            color={"#616057"}
            roughness={0.6}
            metalness={0.1}
          />
        </RoundedBox>
      ))}

      {/* Books */}
      {Array.from({ length: 17 }).map((_, i) => {
        const shelfLevel = Math.floor(i / 6);
        const y = 0.05 + shelfLevel * 0.8;

        const height = 0.18 + Math.random() * 0.05;
        const width = 0.035 + Math.random() * 0.01;
        const depth = 0.133 + Math.random() * 0.01;

        const tiltY = Math.random() < 0.2 ? (Math.random() - 0.5) * 0.2 : 0;
        const tiltX = (Math.random() - 0.5) * 0.01;

        const x = -0.28 + Math.random() * 0.6;
        const z = -0.015 + Math.random() * 0.09;

        const color = bookColors[i % bookColors.length];

        return (
          <mesh
            key={i}
            position={[x, y + height / 2, z]}
            rotation={[tiltX, tiltY, 0]}
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={color}
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
        );
      })}
      {/* Letter and img on wall */}

      <mesh
        position={[-1.9, 3.1, -0.55]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <planeGeometry args={[0.3, 0.45]} />
        <meshStandardMaterial map={letterTexture} />
      </mesh>

      <mesh
        position={[-1.5, 3.08, -0.55]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <planeGeometry args={[0.3, 0.44]} />
        <meshStandardMaterial map={imgTexture} />
      </mesh>
    </group>
  );
}
