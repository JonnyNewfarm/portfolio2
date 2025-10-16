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
  const { scene } = useGLTF("/me-cartoon-draco.glb");
  const group = useRef<THREE.Group>(null);

  const bones = useRef<{
    hip?: THREE.Object3D;
    leftLeg?: THREE.Object3D;
    rightLeg?: THREE.Object3D;
    spine?: THREE.Object3D;
    spine1?: THREE.Object3D;
    spine2?: THREE.Object3D;
    rightArm?: THREE.Object3D;
  }>({});

  useEffect(() => {
    if (!group.current) return;
    bones.current.hip = group.current.getObjectByName("Hips");
    bones.current.leftLeg = group.current.getObjectByName("LeftLeg");
    bones.current.rightLeg = group.current.getObjectByName("RightLeg");
    bones.current.spine = group.current.getObjectByName("Spine");
    bones.current.rightArm = group.current.getObjectByName("RightArm");
    bones.current.spine2 = group.current.getObjectByName("Spine2");
    bones.current.spine1 = group.current.getObjectByName("Spine1");

    if (bones.current.hip) {
      bones.current.hip.rotation.x = -Math.PI / 2.7;
      // Move hips slightly backward toward the seatback
      bones.current.hip.position.z -= 0.015; // try between 0.03–0.1 for fine-tuning
    }

    if (bones.current.leftLeg) bones.current.leftLeg.rotation.x = -Math.PI / 2;
    if (bones.current.rightLeg)
      bones.current.rightLeg.rotation.x = -Math.PI / 2.5;
    if (bones.current.spine) bones.current.spine.rotation.x = Math.PI / 1.9;
    if (bones.current.spine2) bones.current.spine2.rotation.x = -0.2;
    if (bones.current.spine1) bones.current.spine1.rotation.x = -0.4;

    if (bones.current.rightArm) {
      bones.current.rightArm.rotation.x = Math.PI / 2.3;
      bones.current.rightArm.rotation.z = -Math.PI / 13;
    }
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.getElapsedTime();

    group.current.position.y = -0.45 + Math.sin(t * 1.2) * 0.008;
    group.current.rotation.y = Math.PI + Math.sin(t * 0.3) * 0.009;

    // Scroll-based arm lift
    const progress = scrollYProgress.get();
    if (bones.current.rightArm) {
      bones.current.rightArm.rotation.y = (Math.PI / 1.9) * progress;
    }
  });

  return (
    <mesh position={[0.14, 0.011, 2.86]}>
      <primitive ref={group} object={scene} scale={1.46} />
    </mesh>
  );
}
