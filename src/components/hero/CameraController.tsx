"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.innerWidth < 640;
  });

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

const DEFAULT_LOOK_AT = new THREE.Vector3(0.2, 0.8, 0);

export function CameraController({
  scrollYProgress,
  monitorFocused,
}: CameraControllerProps) {
  const { camera } = useThree();
  const isSmall = useIsSmallScreen();

  const initialized = useRef(false);

  const cameraPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(DEFAULT_LOOK_AT.clone());
  const wantedLookAt = useRef(DEFAULT_LOOK_AT.clone());

  useLayoutEffect(() => {
    if (initialized.current) {
      return;
    }

    const rawProgress = scrollYProgress.get();
    const cameraProgress = Math.min(rawProgress, CAMERA_STOP_PROGRESS);
    const baseZ = isSmall ? 5.3 : 4.7;

    const initialPosition = new THREE.Vector3(
      2.1,
      1.6,
      baseZ - cameraProgress * 2.25,
    );

    camera.position.copy(initialPosition);
    camera.lookAt(DEFAULT_LOOK_AT);
    camera.updateMatrixWorld(true);

    cameraPosition.current.copy(initialPosition);
    currentLookAt.current.copy(DEFAULT_LOOK_AT);
    wantedLookAt.current.copy(DEFAULT_LOOK_AT);

    initialized.current = true;
  }, [camera, isSmall, scrollYProgress]);

  useFrame((_, delta) => {
    if (!initialized.current) {
      return;
    }

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
