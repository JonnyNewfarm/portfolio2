"use client";

import { RoundedBox } from "@react-three/drei";

const bookColors = [
  "#591616", // red
  "#b6b897", // yellow
  "#d6ccba", // orange
  "#5d6957", // green
  "#8d99ae", // gray
  "#a65f3d", // tan
];

export default function Bookshelf() {
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

        // Make books more uniform in size
        const height = 0.18 + Math.random() * 0.05; // 0.18–0.23
        const width = 0.035 + Math.random() * 0.01; // 0.035–0.045
        const depth = 0.133 + Math.random() * 0.01; // 0.09–0.105

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
            <boxGeometry sm args={[width, height, depth]} />
            <meshStandardMaterial
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
