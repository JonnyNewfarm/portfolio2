"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

import { useState } from "react";
import * as THREE from "three";

export default function Tablet() {
  const images = ["/desk1-01.webp", "/desk1-03.webp"];
  const textures = useLoader(THREE.TextureLoader, images);

  const [imageIndex, setImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [fade, setFade] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);

  const fadeSpeed = 0.6;
  const pauseDuration = 5;

  useFrame((state, delta) => {
    if (fade < 1) {
      setFade((prev) => Math.min(prev + delta * fadeSpeed, 1));
    } else {
      setPauseTime((prev) => prev + delta);

      if (pauseTime >= pauseDuration) {
        setImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % textures.length);
        setFade(0);
        setPauseTime(0);
      }
    }
  });

  return (
    <group position={[1.2, 1.16, 1.35]} rotation={[-0.2, 0.1, 0]}>
      {/* Photo Frame Body */}
      <RoundedBox args={[0.42, 0.3, 0]} radius={0.02} castShadow receiveShadow>
        <meshStandardMaterial color="#21261f" roughness={0.6} metalness={0.2} />
      </RoundedBox>

      {/* Next Image */}
      <mesh position={[0, 0.002, 0.03]}>
        <planeGeometry args={[0.366, 0.235]} />
        <meshStandardMaterial
          map={textures[nextImageIndex]}
          transparent
          opacity={fade}
        />
      </mesh>
    </group>
  );
}
