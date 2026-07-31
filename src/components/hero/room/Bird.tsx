"use client";

import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export default function Bird() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/white-anim-bird2.glb");
  const { actions } = useAnimations(animations, group);

  const chirp = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chirp.current = new Audio("/chirp.mp3");

    Object.values(actions).forEach((action) => {
      if (!action) return;
      action.play();
    });
  }, [actions]);

  const handleClick = () => {
    if (chirp.current) {
      chirp.current.currentTime = 0;
      chirp.current.play();
    }
  };

  return (
    <group
      ref={group}
      scale={0.012}
      position={[-2.45, 1.4, 2.65]}
      rotation={[0, 0.6, 0]}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <primitive object={scene} />
    </group>
  );
}
