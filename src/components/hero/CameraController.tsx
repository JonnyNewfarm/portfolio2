"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

import { useEffect, useState } from "react";

export default function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 640); // sm: < 640px
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isSmall;
}

export function CameraController({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const { camera } = useThree();
  const isSmall = useIsSmallScreen();

  useFrame(() => {
    const progress = scrollYProgress.get();
    const baseZ = isSmall ? 5.3 : 4.9;
    camera.position.lerp(
      new THREE.Vector3(2.1, 1.6, baseZ - progress * 3),
      0.2
    );
    camera.lookAt(new THREE.Vector3(0.2, 0.8, 0));
  });

  return null;
}
