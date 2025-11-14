"use client";

import { RoundedBox } from "@react-three/drei";

export default function ComputerTower() {
  return (
    <group rotation={[0, Math.PI / -2, 0]} position={[1, 0.1, 1.3]}>
      {/* Tower Body */}
      <mesh position={[0, 0, 0.015]}>
        <RoundedBox
          args={[0.35, 0.55, 0.16]}
          radius={0.03}
          smoothness={2}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={"#706360"}
            roughness={0.6}
            metalness={0.3}
          />
        </RoundedBox>
      </mesh>

      {/* Power Button */}
      <mesh position={[0.25, 0.25, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 2]} />
        <meshStandardMaterial
          color="#00ff99"
          emissive="#00ff99"
          emissiveIntensity={
            document.documentElement.classList.contains("dark") ? 2 : 0.4
          }
        />
      </mesh>
    </group>
  );
}
