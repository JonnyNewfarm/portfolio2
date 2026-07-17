"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsSmall(window.innerWidth < 640);
    };

    check();

    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("resize", check);
    };
  }, []);

  return isSmall;
}

type CameraControllerProps = {
  scrollYProgress: MotionValue<number>;
  monitorFocused: boolean;
};

const CAMERA_STOP_PROGRESS = 0.68;

export function CameraController({
  scrollYProgress,
  monitorFocused,
}: CameraControllerProps) {
  const { camera } = useThree();
  const isSmall = useIsSmallScreen();

  const cameraPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0.2, 0.8, 0));
  const wantedLookAt = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const rawProgress = scrollYProgress.get();

    // Kameraet får ikke bevege seg lenger enn dette punktet.
    const cameraProgress = Math.min(rawProgress, CAMERA_STOP_PROGRESS);

    if (monitorFocused) {
      if (isSmall) {
        cameraPosition.current.set(0.8, 1.92, 3.3);
        wantedLookAt.current.set(0.015, 1.78, 0.6);
      } else {
        cameraPosition.current.set(0.32, 1.9, 2.65);
        wantedLookAt.current.set(0.015, 1.76, 0.6);
      }
    } else {
      const baseZ = isSmall ? 5.3 : 4.7;

      cameraPosition.current.set(2.1, 1.6, baseZ - cameraProgress * 2.25);

      wantedLookAt.current.set(0.2, 0.8, 0);
    }

    const cameraSpeed = monitorFocused ? 3.2 : 5;

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      cameraPosition.current.x,
      cameraSpeed,
      delta,
    );

    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      cameraPosition.current.y,
      cameraSpeed,
      delta,
    );

    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      cameraPosition.current.z,
      cameraSpeed,
      delta,
    );

    currentLookAt.current.x = THREE.MathUtils.damp(
      currentLookAt.current.x,
      wantedLookAt.current.x,
      4,
      delta,
    );

    currentLookAt.current.y = THREE.MathUtils.damp(
      currentLookAt.current.y,
      wantedLookAt.current.y,
      4,
      delta,
    );

    currentLookAt.current.z = THREE.MathUtils.damp(
      currentLookAt.current.z,
      wantedLookAt.current.z,
      4,
      delta,
    );

    camera.lookAt(currentLookAt.current);
  });

  return null;
}
