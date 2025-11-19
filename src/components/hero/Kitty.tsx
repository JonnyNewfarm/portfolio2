"use client";

import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export default function Kitty() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/cat-anim2.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (!action) return;

      action.play();
    });
  }, [actions]);

  return (
    <group
      ref={group}
      scale={0.03}
      position={[0.4, 0.1, 1.3]}
      rotation={[0, -1.9, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}
