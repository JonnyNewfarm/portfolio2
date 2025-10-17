"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { motion } from "framer-motion-3d";

import { useRef } from "react";
import * as THREE from "three";

export default function FloorLamp() {
  const bulbRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.SpotLight>(null);
  const texture = useLoader(THREE.TextureLoader, "/fabrics/fabric-1.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  let last = 0;
  useFrame(({ clock }) => {
    if (clock.getElapsedTime() - last < 0.05) return;
    last = clock.getElapsedTime();
    const t = clock.getElapsedTime();
    const isDark = document.documentElement.classList.contains("dark");

    if (bulbRef.current) {
      const material = bulbRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = isDark ? 2 + Math.sin(t * 3) * 0.3 : 0.05;
    }

    if (lightRef.current) {
      lightRef.current.intensity = isDark ? 15 + Math.sin(t * 3) * 0.6 : 0;
    }
  });

  return (
    <group position={[1.5, 0, 0.66]}>
      {/* Base */}
      <mesh receiveShadow position={[0.7, 0, -0.4]}>
        <cylinderGeometry args={[0.18, 0.26, 0.07, 14]} />
        <meshStandardMaterial color="#444" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Curved Stand */}
      <motion.mesh
        rotation={[0, Math.PI / -2.2, 0]}
        castShadow
        receiveShadow
        position={[0.6, 0.46, 0]}
      >
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, -0.3, -0.09),
              new THREE.Vector3(-0.3, 2.5, -0.021),
              new THREE.Vector3(0.06, 2.46, 0.24),
              new THREE.Vector3(0.24, 2.06, 0.33),
            ]),
            80,
            0.016,
            13,
            false,
          ]}
        />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.7} />
      </motion.mesh>

      {/* Lampshade */}
      <mesh
        position={[0.25, 2.42, 0.25]}
        rotation={[Math.PI / 36, 0, -0.06]}
        castShadow
      >
        <cylinderGeometry args={[0.35, 0.4, 0.3, 17, 1, true]} />
        <meshStandardMaterial
          map={texture}
          color="#bec4be"
          roughness={1.0}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bulb */}
      <mesh ref={bulbRef} position={[0.25, 2.35, 0.25]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial
          color="#fffbe0"
          emissive="#fff3c0"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* SpotLight */}
      <spotLight
        ref={lightRef}
        intensity={0.6}
        position={[3, 2.4, 0.6]}
        angle={Math.PI / 5}
        penumbra={0.3}
        color="#fff1c1"
        castShadow={false}
        target-position={[0, 0.6, 0]}
      />
    </group>
  );
}
