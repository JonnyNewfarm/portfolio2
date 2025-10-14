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
  const { scene } = useGLTF("/me-cartoon.glb");
  const group = useRef<THREE.Group>(null);

  const bones = useRef<{
    hip?: THREE.Object3D;
    leftLeg?: THREE.Object3D;
    rightLeg?: THREE.Object3D;
    spine?: THREE.Object3D;
    rightArm?: THREE.Object3D;
  }>({});

  useEffect(() => {
    if (!group.current) return;
    bones.current.hip = group.current.getObjectByName("Hips");
    bones.current.leftLeg = group.current.getObjectByName("LeftLeg");
    bones.current.rightLeg = group.current.getObjectByName("RightLeg");
    bones.current.spine = group.current.getObjectByName("Spine");
    bones.current.rightArm = group.current.getObjectByName("RightArm");

    // Set static rotations once
    if (bones.current.hip) bones.current.hip.rotation.x = -Math.PI / 3.8;
    if (bones.current.leftLeg) bones.current.leftLeg.rotation.x = -Math.PI / 2;
    if (bones.current.rightLeg)
      bones.current.rightLeg.rotation.x = -Math.PI / 3;
    if (bones.current.spine) bones.current.spine.rotation.x = Math.PI / 4;
    if (bones.current.rightArm) {
      bones.current.rightArm.rotation.x = Math.PI / 2.3;
      bones.current.rightArm.rotation.z = -Math.PI / 13;
    }
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.getElapsedTime();

    // Smooth floating animation
    group.current.position.y = -0.45 + Math.sin(t * 1.2) * 0.008;
    group.current.rotation.y = Math.PI + Math.sin(t * 0.3) * 0.009;

    // Scroll-based arm lift (cheap, per frame)
    const progress = scrollYProgress.get();
    if (bones.current.rightArm) {
      bones.current.rightArm.rotation.y = (Math.PI / 1.9) * progress;
    }
  });

  return (
    <primitive
      ref={group}
      object={scene}
      position={[0, -0.45, 2.7]}
      scale={1.49}
    />
  );
}
