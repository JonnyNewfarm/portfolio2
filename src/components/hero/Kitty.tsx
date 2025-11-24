"use client";

import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export default function Kitty() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/kitty-anim3.glb");
  const { actions } = useAnimations(animations, group);

  const meow = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    meow.current = new Audio("/meow.mp3");

    Object.values(actions).forEach((action) => {
      if (!action) return;

      action.play();
    });
  }, [actions]);

  const handleClick = () => {
    if (meow.current) {
      meow.current.currentTime = 0;
      meow.current.play();
    }
  };

  return (
    <group
      ref={group}
      scale={0.03}
      position={[0.4, 0.1, 1.3]}
      rotation={[0, -1.9, 0]}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <primitive object={scene} />
    </group>
  );
}
