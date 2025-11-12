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
  const { scene } = useGLTF("/cartoon-3-ultra.glb");
  const group = useRef<THREE.Group>(null);

  const bones = useRef<{
    hip?: THREE.Object3D;
    leftLeg?: THREE.Object3D;
    rightLeg?: THREE.Object3D;
    spine?: THREE.Object3D;
    rightArm?: THREE.Object3D;
    chest?: THREE.Object3D;
  }>({});

  useEffect(() => {
    if (!group.current) return;
    bones.current.hip = group.current.getObjectByName("Hips");
    bones.current.leftLeg = group.current.getObjectByName("LeftLeg");
    bones.current.rightLeg = group.current.getObjectByName("RightLeg");
    bones.current.spine = group.current.getObjectByName("Spine");
    bones.current.rightArm = group.current.getObjectByName("RightArm");
    bones.current.chest = group.current.getObjectByName("Chest"); // sometimes named differently

    if (bones.current.hip) {
      bones.current.hip.rotation.x = -Math.PI / 2.7;
    }

    if (bones.current.leftLeg) bones.current.leftLeg.rotation.x = -Math.PI / 2;
    if (bones.current.rightLeg)
      bones.current.rightLeg.rotation.x = -Math.PI / 2.5;
    if (bones.current.spine) bones.current.spine.rotation.x = Math.PI / 2.9;

    if (bones.current.rightArm) {
      bones.current.rightArm.rotation.x = Math.PI / 2.3;
      bones.current.rightArm.rotation.z = -Math.PI / 13;
    }
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.getElapsedTime();

    group.current.position.y = -0.45 + Math.sin(t * 0.3) * 0.0015;
    group.current.rotation.y = Math.PI + Math.sin(t * 0.3) * 0.0015;

    const breathing = Math.sin(t * 0.7) * 0.022;

    if (bones.current.spine) {
      bones.current.spine.scale.y = 1 + breathing * 0.22;
      bones.current.spine.position.z = breathing * 0.22;
    }

    if (bones.current.chest) {
      bones.current.chest.scale.y = 1 + breathing * 0.3;
      bones.current.chest.position.z = breathing * 0.3;
    }

    const progress = scrollYProgress.get();
    if (bones.current.rightArm) {
      bones.current.rightArm.rotation.y = (Math.PI / 1.9) * progress;
    }
  });

  return (
    <mesh position={[0.14, 0.011, 2.889]}>
      <primitive ref={group} object={scene} scale={1.41} />
    </mesh>
  );
}
