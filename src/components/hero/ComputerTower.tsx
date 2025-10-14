"use client";

import { RoundedBox } from "@react-three/drei";

export default function ComputerTower() {
  return (
    <group rotation={[0, Math.PI / -2, 0]} position={[1.47, 0.3, 0.9]}>
      {/* Tower Body */}
      <RoundedBox
        args={[0.4, 0.6, 0.175]}
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

      {/* Power Button */}
      <mesh position={[0.29, 0.3, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 2]} />
        <meshStandardMaterial
          color="#00ff99"
          emissive="#00ff99"
          emissiveIntensity={
            document.documentElement.classList.contains("dark") ? 2 : 0.4
          } // boost glow
        />
      </mesh>

      {/* USB Ports */}
      {[0.05, -0.05].map((y, i) => (
        <mesh key={i} position={[0.29, -0.15, 0]}>
          <boxGeometry args={[0.05, 0.015, 0.01]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      ))}
    </group>
  );
}
