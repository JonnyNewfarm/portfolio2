"use client";

import { useLoader } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import useDarkMode from "@/hooks/useDarkMode";

export default function Desk() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const isDark = useDarkMode();
  const texture = useLoader(THREE.TextureLoader, "/fabrics/wood-1.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  useEffect(() => {
    const updateLight = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (lightRef.current) {
        lightRef.current.intensity = isDark ? 3.1 : 0;
      }
    };

    updateLight();

    const observer = new MutationObserver(updateLight);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
  return (
    <group position={[0, 0, 1.2]}>
      {/* Keyboard */}
      <group position={[-0.1, 1, 0]}>
        {/* Keyboard Base */}
        <RoundedBox
          args={[0.8, 0.04, 0.3]}
          radius={0.02}
          smoothness={2}
          castShadow={false}
          receiveShadow
        >
          <meshStandardMaterial
            color="#C0C9B8"
            roughness={0.6}
            metalness={0.1}
          />
        </RoundedBox>
      </group>

      {/* Desk Lamp with Light */}
      <group position={[1.1, 1.05, -0.5]}>
        {/* Warm Lamp Light */}
        <spotLight
          ref={lightRef}
          position={[1.12, 1.8, -0.46]}
          angle={Math.PI / 5.56}
          penumbra={0.3}
          color="#fff1c1"
          intensity={
            document.documentElement.classList.contains("dark") ? 1.8 : 0
          } // boost
          castShadow={false}
        />
      </group>

      {/* Mouse */}
      <group position={[0.5, 1, 0]}>
        {/* Body */}
        <mesh castShadow={false} receiveShadow scale={[0.7, 0.5, 2]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#C0C9B8"
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Scroll Wheel */}
        <mesh position={[0.01, 0.063, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.08, 6]} />
          <meshStandardMaterial color="black" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* Desk Top */}
      <RoundedBox
        args={[3, 0.06, 1.5]}
        radius={0.01}
        smoothness={2.5}
        position={[0, 0.95, 0]}
        castShadow={false}
        receiveShadow
      >
        <meshStandardMaterial map={texture} roughness={0.6} metalness={0.1} />
      </RoundedBox>

      {/* Legs */}
      {[-1.39, 1.39].map((x) =>
        [-0.68, 0.62].map((z, i) => (
          <mesh
            key={`${x}-${z}-${i}`}
            position={[x, 0.43, z]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.05, 0.022, 0.99, 10]}></cylinderGeometry>
            <meshStandardMaterial
              map={texture}
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>
        ))
      )}

      {[-1.36, 1.39].map((x) => (
        <mesh
          key={`bar-${x}`}
          position={[x, 0.73, 0]}
          rotation={[36, 36, -0.06]}
          castShadow={false}
          receiveShadow
        >
          <cylinderGeometry args={[0.026, 0.02, 1.4, 13]} />
          <meshStandardMaterial map={texture} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0, 0.96, -0.6]}>
        <mesh position={[0, 0.4, 0]} castShadow={false} receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.8]} />
          <meshStandardMaterial
            color="#333333"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>

        <mesh position={[0, 0, 0]} castShadow={false} receiveShadow={false}>
          <cylinderGeometry args={[0.15, 0.15, 0.03]} />
          <meshStandardMaterial color="black" roughness={0.5} metalness={0.3} />
        </mesh>

        <RoundedBox
          args={[2.29, 1.353, 0.099]}
          radius={0.02}
          smoothness={2}
          position={[0, 0.8, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="black" roughness={0.4} metalness={0.3} />
        </RoundedBox>

        <RoundedBox
          args={[2.17, 1.24, 0.141]}
          radius={0.02}
          smoothness={2}
          position={[0.015, 0.8, 0]}
        ></RoundedBox>

        <mesh position={[0, 0.8, 0.07]}>
          <planeGeometry args={[1.9, 1.19]} />
          <meshStandardMaterial
            color={isDark ? "#f5f5f5" : "#fafafa"}
            emissive={isDark ? "#fff6d0" : "#ffffff"}
            emissiveIntensity={isDark ? 2 : 0.2}
            transparent
            opacity={0.95}
          />
        </mesh>
      </group>
      <group position={[1.0, 1.03, 0.3]} rotation={[0, Math.PI / 9, 0]}>
        {/* Cup body */}
        <mesh castShadow={false} receiveShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 24, 1, true]} />
          <meshStandardMaterial
            color="#e0e0e0"
            metalness={0.1}
            roughness={0.5}
          />
        </mesh>

        {/* Cup inner surface */}
        <mesh position={[0, 0.001, 0]} scale={[0.95, 1, 0.95]}>
          <cylinderGeometry args={[0.065, 0.065, 0.12, 24, 1, true]} />
          <meshStandardMaterial
            color="#fafafa"
            metalness={0.05}
            roughness={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </group>
  );
}
