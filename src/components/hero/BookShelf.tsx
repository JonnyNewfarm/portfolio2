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
  const imgTexture = useLoader(THREE.TextureLoader, "/wall-img3.jpg");
  const paintingTexture = useLoader(THREE.TextureLoader, "/oil-painting.webp");
  const carpetTexture = useLoader(THREE.TextureLoader, "/fabrics/carpet.webp");
  carpetTexture.colorSpace = THREE.SRGBColorSpace;
  letterTexture.colorSpace = THREE.SRGBColorSpace;
  imgTexture.colorSpace = THREE.SRGBColorSpace;
  paintingTexture.colorSpace = THREE.SRGBColorSpace;

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
          <RoundedBox
            key={i}
            args={[width, height, depth]}
            radius={0.008}
            smoothness={2}
            position={[x, y + height / 2, z]}
            rotation={[tiltX, tiltY, 0]}
          >
            <meshStandardMaterial
              color={color}
              roughness={0.6}
              metalness={0.2}
            />
          </RoundedBox>
        );
      })}

      {/* Letter */}
      <mesh position={[-1.9, 3.1, -0.55]}>
        <planeGeometry args={[0.3, 0.45]} />
        <meshStandardMaterial map={letterTexture} />
      </mesh>

      {/* Wall image */}
      <mesh position={[-1.5, 3.08, -0.55]}>
        <planeGeometry args={[0.3, 0.44]} />
        <meshStandardMaterial map={imgTexture} />
      </mesh>

      <group position={[1.2, 1.4, 0]}>
        {/* Threads */}
        <mesh rotation={[1, 0, Math.PI / 1.1]} position={[-0.37, 0.95, -0.015]}>
          <cylinderGeometry args={[0.005, 0.005, 0.47]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
        </mesh>
        <mesh rotation={[0.3, 0, Math.PI / 4]} position={[-0.09, 0.95, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.47]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
        </mesh>

        {/* Carpet */}
        <mesh position={[0, 0.25, -0.5]}>
          <planeGeometry args={[0.7, 1.3]} />
          <meshStandardMaterial map={carpetTexture} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Oil painting with frame */}
      <group position={[-4, 3.35, -0.55]}>
        {/* Painting */}
        <mesh>
          <planeGeometry args={[0.9, 0.5]} />
          <meshStandardMaterial map={paintingTexture} />
        </mesh>

        {/* Frame */}
        <group position={[0, 0, 0.01]}>
          {/* Top frame */}
          <mesh position={[0, 0.25 + 0.02 / 2, 0]}>
            <boxGeometry args={[0.94, 0.04, 0.02]} />
            <meshStandardMaterial
              color={"#3e2f1c"}
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
          {/* Bottom frame */}
          <mesh position={[0, -0.25 - 0.02 / 2, 0]}>
            <boxGeometry args={[0.94, 0.04, 0.02]} />
            <meshStandardMaterial
              color={"#3e2f1c"}
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
          {/* Left frame */}
          <mesh position={[-0.45 - 0.02 / 2, 0, 0]}>
            <boxGeometry args={[0.04, 0.54, 0.02]} />
            <meshStandardMaterial
              color={"#3e2f1c"}
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
          {/* Right frame */}
          <mesh position={[0.45 + 0.02 / 2, 0, 0]}>
            <boxGeometry args={[0.04, 0.54, 0.02]} />
            <meshStandardMaterial
              color={"#3e2f1c"}
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
