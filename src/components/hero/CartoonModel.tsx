"use client";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CartoonModel({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const { scene } = useGLTF("/chair-cartoon.glb");
  const group = useRef<THREE.Group>(null);

  const bones = useRef<{
    spine?: THREE.Object3D;
    chest?: THREE.Object3D;
    rightArm?: THREE.Object3D;
  }>({});

  // smoothed scroll value for arm rotation
  const smoothed = useRef(0);

  useEffect(() => {
    if (!group.current) return;

    bones.current.rightArm = group.current.getObjectByName("RightArm");
    bones.current.spine = group.current.getObjectByName("Spine") || undefined;
    bones.current.chest = group.current.getObjectByName("Chest") || undefined;

    if (bones.current.rightArm) {
      bones.current.rightArm.rotation.x = Math.PI / 2.3;
      bones.current.rightArm.rotation.z = -Math.PI / 10;
    }
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.getElapsedTime();

    const breathing = Math.sin(t * 0.7) * 0.022;
    if (bones.current.spine) {
      bones.current.spine.scale.y = 1 + breathing * 0.45;
      bones.current.spine.position.z = breathing * 0.35;
    }

    // ----- FIXED ARM MOVEMENT (smooth scroll → rotation) -----
    const target = scrollYProgress.get();
    smoothed.current = THREE.MathUtils.lerp(smoothed.current, target, 0.08);

    if (bones.current.rightArm) {
      bones.current.rightArm.rotation.y = (Math.PI / 2.8) * smoothed.current;
    }
    // ----------------------------------------------------------
  });

  return (
    <mesh
      scale={0.335}
      position={[0.17, -0.15, 2.889]}
      rotation={[0, Math.PI, 0]}
    >
      <primitive ref={group} object={scene} />
    </mesh>
  );
}
