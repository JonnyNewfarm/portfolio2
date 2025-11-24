"use client";

import { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Butterfly() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/butterfly.glb");
  const { actions } = useAnimations(animations, group);

  // Start very high + very close to the camera/screen
  const [target, setTarget] = useState(new THREE.Vector3(0.5, 1.25, 1.3));

  useEffect(() => {
    Object.values(actions).forEach((action) => action?.play());
  }, [actions]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();

    // --- NEW random high + close targets ---
    if (Math.random() < 0.01) {
      const randomX = 0.45 + (Math.random() - 0.5) * 0.4; // narrow, near monitor
      const randomY = 1.0 + Math.random() * 0.6; // HIGH! 1.0 → 1.6
      const randomZ = 0.2 + Math.random() * 0.5; // SUPER CLOSE (0.2–0.7)

      setTarget(new THREE.Vector3(randomX, randomY, randomZ));
    }

    // Smooth movement
    const currentPos = group.current.position;
    const direction = new THREE.Vector3().subVectors(target, currentPos);
    direction.multiplyScalar(0.03); // slightly faster so it flies gracefully
    currentPos.add(direction);

    // Flutter motion
    currentPos.y += Math.sin(t * 8) * 0.004;

    // Rotate toward path
    if (direction.length() > 0.0001) {
      const targetRotationY = Math.atan2(direction.x, direction.z);
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotationY,
        0.05
      );
    }

    // Tilt
    group.current.rotation.z = Math.sin(t * 6) * 0.15;
  });

  return (
    <group ref={group} scale={0.005} position={[0.5, 1.25, 0.45]}>
      <primitive object={scene} />
    </group>
  );
}
