"use client";

import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export default function Bird() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/white-anim-bird2.glb");
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
      scale={0.012}
      position={[-2.45, 1.4, 2.65]}
      rotation={[0, 0.6, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}
