"use client";

import { useLoader } from "@react-three/fiber";

import { useEffect, useState } from "react";

import * as THREE from "three";

export default function WindowOnWall() {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const checkDarkMode = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const [lightView, darkView] = useLoader(THREE.TextureLoader, [
    "/light-window.webp",
    "/dark-win.webp",
  ]);

  useEffect(() => {
    if (!lightView || !darkView) return;

    const setupTexture = (tex: THREE.Texture) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.x = -1;
      tex.offset.x = 1;
      tex.needsUpdate = true;
    };

    setupTexture(lightView);
    setupTexture(darkView);
  }, [lightView, darkView]);

  const bgTexture = isDark ? darkView : lightView;

  const openAngle = Math.PI / 2.7;
  const paneWidth = 0.5;

  return (
    <group
      position={[-2.54, 1.9, 2.9]}
      rotation={[0.03, -Math.PI / 2.01, 0.05]}
    >
      {/* Background image */}
      {bgTexture && (
        <mesh position={[0, 0, -0.0051]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={bgTexture}
            side={THREE.DoubleSide}
            transparent
            opacity={1}
          />
        </mesh>
      )}

      {/* Left Pane */}
      <group position={[-paneWidth / 2, 0, 0]}>
        <group position={[-paneWidth / 2, 0, 0]} rotation={[0, openAngle, 0]}>
          <mesh position={[paneWidth / 2, 0, 0]}>
            <boxGeometry args={[0.5, 1, 0.05]} />
            <meshPhysicalMaterial
              color="#a0d8ff"
              transparent
              opacity={0.6}
              roughness={0.1}
              metalness={0.1}
              transmission={0.9}
              clearcoat={0.1}
            />
          </mesh>

          {[
            [paneWidth / 1, 0, 0],
            [paneWidth / 1, 0, 0],
            [0, 0.5, 0],
            [0, -0.5, 0],
          ].map((pos, i) => (
            <mesh key={`L${i}`} position={pos as [number, number, number]}>
              <boxGeometry
                args={i < 2 ? [0.03, 1, 0.05] : [paneWidth, 0.04, 0.05]}
              />
              <meshStandardMaterial
                color="#656b66"
                roughness={0.6}
                metalness={0.2}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Right Pane */}
      <group position={[paneWidth / 2, 0, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[paneWidth, 1, 0.02]} />
          <meshPhysicalMaterial
            color="#a0c4ff"
            transparent
            opacity={0.32}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {[
          [-paneWidth / 2, 0, 0],
          [paneWidth / 2, 0, 0],
          [0, 0.5, 0],
          [0, -0.5, 0],
        ].map((pos, i) => (
          <mesh key={`R${i}`} position={pos as [number, number, number]}>
            <boxGeometry
              args={i < 2 ? [0.03, 1, 0.05] : [paneWidth, 0.03, 0.05]}
            />
            <meshStandardMaterial
              color="#656b66"
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Outer Frame */}
      {[
        [-0.5, 0, 0],
        [0.5, 0, 0],
        [0, 0.5, 0],
        [0, -0.5, 0],
      ].map((pos, i) => (
        <mesh key={`O${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={i < 2 ? [0.05, 1.05, 0.05] : [1.05, 0.05, 0.05]} />
          <meshStandardMaterial
            color="#656b66"
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Handle */}
      <group position={[paneWidth / 2 + 0.03, 0, 0]}>
        <mesh position={[-0.3, -0.55, 0]}>
          <boxGeometry args={[1.07, 0.04, 0.15]} />
          <meshStandardMaterial
            color="#656b66"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}
