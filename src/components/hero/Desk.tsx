"use client";

import { useLoader } from "@react-three/fiber";
import { RoundedBox, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useDarkMode from "@/hooks/useDarkMode";

export default function Desk() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const isDark = useDarkMode();
  const texture = useLoader(THREE.TextureLoader, "/fabrics/wood-1.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  const { scene: cupScene } = useGLTF("/cup-draco.glb");
  const { scene: vaseScene } = useGLTF("/vase-optimized.glb");
  const setVaseColor = (scene: THREE.Object3D, colorHex: string) => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if ((mat as THREE.MeshStandardMaterial).color) {
              (mat as THREE.MeshStandardMaterial).color = new THREE.Color(
                colorHex
              );
            }
          });
        } else if ((mesh.material as THREE.MeshStandardMaterial).color) {
          (mesh.material as THREE.MeshStandardMaterial).color = new THREE.Color(
            colorHex
          );
        }
      }
    });
  };

  setVaseColor(vaseScene, "#bcd1d6");

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

      {/* Desk Lamp */}
      <group position={[1.1, 1.05, -0.5]}>
        <spotLight
          ref={lightRef}
          position={[1.12, 1.8, -0.46]}
          angle={Math.PI / 5.56}
          penumbra={0.3}
          color="#fff1c1"
          intensity={
            document.documentElement.classList.contains("dark") ? 1.8 : 0
          }
          castShadow={false}
        />
      </group>

      {/* Mouse */}
      <group position={[0.5, 1, 0]}>
        <mesh castShadow={false} receiveShadow scale={[0.7, 0.5, 2]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#C0C9B8"
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
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
            <cylinderGeometry args={[0.05, 0.022, 0.99, 10]} />
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
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.3} />
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
        />
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

      <group
        position={[1.25, 1.03, 0.7]}
        rotation={[0, Math.PI / 9, 0]}
        scale={1.8}
      >
        <primitive object={cupScene} />
      </group>

      <group
        position={[1.36, 1.0, 0.08]}
        rotation={[0, -Math.PI / 6, 0]}
        scale={0.7}
      >
        <primitive object={vaseScene} />
      </group>
    </group>
  );
}

useGLTF.preload("/cup-draco.glb");
