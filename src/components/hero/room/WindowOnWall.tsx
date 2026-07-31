"use client";

import { useLoader } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

export default function WindowOnWall() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

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
    const setupTexture = (texture: THREE.Texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.x = -1;
      texture.offset.x = 1;
      texture.needsUpdate = true;
    };

    setupTexture(lightView);
    setupTexture(darkView);
  }, [lightView, darkView]);

  const bgTexture = isDark ? darkView : lightView;

  const openAngle = Math.PI / 2.7;
  const paneWidth = 0.5;
  const paneHeight = 1;

  const frameThickness = 0.03;
  const frameDepth = 0.055;

  const leftPaneFrame = [
    {
      position: [0, 0, 0.015] as [number, number, number],
      size: [frameThickness, paneHeight, frameDepth] as [
        number,
        number,
        number,
      ],
    },
    {
      position: [paneWidth, 0, 0.015] as [number, number, number],
      size: [frameThickness, paneHeight, frameDepth] as [
        number,
        number,
        number,
      ],
    },
    {
      position: [paneWidth / 2, paneHeight / 2, 0.015] as [
        number,
        number,
        number,
      ],
      size: [paneWidth, frameThickness, frameDepth] as [number, number, number],
    },
    {
      position: [paneWidth / 2, -paneHeight / 2, 0.015] as [
        number,
        number,
        number,
      ],
      size: [paneWidth, frameThickness, frameDepth] as [number, number, number],
    },
  ];

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

      {/* Left pane */}
      <group position={[-paneWidth / 2, 0, 0]}>
        <group position={[-paneWidth / 2, 0, 0]} rotation={[0, openAngle, 0]}>
          {/* Glass */}
          <mesh position={[paneWidth / 2, 0, 0]}>
            <boxGeometry args={[paneWidth, paneHeight, 0.02]} />

            <meshStandardMaterial
              color="#a0d8ff"
              transparent
              opacity={0.5}
              roughness={0.12}
              metalness={0.12}
              side={THREE.DoubleSide}
              depthWrite={true}
            />
          </mesh>

          {/* Frame */}
          {leftPaneFrame.map(({ position, size }, index) => (
            <mesh key={`left-frame-${index}`} position={position}>
              <boxGeometry args={size} />

              <meshStandardMaterial
                color="#656b66"
                roughness={0.6}
                metalness={0.2}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Right pane */}
      <group position={[paneWidth / 2, 0, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[paneWidth, paneHeight, 0.02]} />
          <meshStandardMaterial
            color="#a0c4ff"
            transparent
            opacity={0.3}
            roughness={0.7}
            metalness={0.1}
            side={THREE.DoubleSide}
            depthWrite={true}
          />
        </mesh>

        {[
          {
            position: [-paneWidth / 2, 0, 0] as [number, number, number],
            size: [frameThickness, paneHeight, frameDepth] as [
              number,
              number,
              number,
            ],
          },
          {
            position: [paneWidth / 2, 0, 0] as [number, number, number],
            size: [frameThickness, paneHeight, frameDepth] as [
              number,
              number,
              number,
            ],
          },
          {
            position: [0, paneHeight / 2, 0] as [number, number, number],
            size: [paneWidth, frameThickness, frameDepth] as [
              number,
              number,
              number,
            ],
          },
          {
            position: [0, -paneHeight / 2, 0] as [number, number, number],
            size: [paneWidth, frameThickness, frameDepth] as [
              number,
              number,
              number,
            ],
          },
        ].map(({ position, size }, index) => (
          <mesh key={`right-frame-${index}`} position={position}>
            <boxGeometry args={size} />

            <meshStandardMaterial
              color="#656b66"
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Outer frame */}
      {[
        {
          position: [-0.5, 0, 0] as [number, number, number],
          size: [0.05, 1.05, 0.05] as [number, number, number],
        },
        {
          position: [0.5, 0, 0] as [number, number, number],
          size: [0.05, 1.05, 0.05] as [number, number, number],
        },
        {
          position: [0, 0.5, 0] as [number, number, number],
          size: [1.05, 0.05, 0.05] as [number, number, number],
        },
        {
          position: [0, -0.5, 0] as [number, number, number],
          size: [1.05, 0.05, 0.05] as [number, number, number],
        },
      ].map(({ position, size }, index) => (
        <mesh key={`outer-frame-${index}`} position={position}>
          <boxGeometry args={size} />

          <meshStandardMaterial
            color="#656b66"
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Bottom sill */}
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
