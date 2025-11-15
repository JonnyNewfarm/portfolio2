"use client";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Group, Object3D } from "three";

export default function Clock() {
  const { scene } = useGLTF("/clock-small.glb");
  const group = useRef<Group>(null);
  const hourHand = useRef<Object3D | null>(null);

  const TWO_OCLOCK = -Math.PI / 3;
  const TWELVE_OCLOCK = TWO_OCLOCK - Math.PI * 1.4;

  const targetRotation = useRef(TWO_OCLOCK);

  useEffect(() => {
    if (!group.current) return;

    hourHand.current =
      group.current.getObjectByName("clock_small_hand_clock_pointer_0") || null;

    if (hourHand.current) {
      hourHand.current.rotation.z = TWO_OCLOCK;
      targetRotation.current = TWO_OCLOCK;
    }

    const animate = () => {
      if (hourHand.current) {
        const diff = targetRotation.current - hourHand.current.rotation.z;
        hourHand.current.rotation.z += diff * 0.05;
      }
      requestAnimationFrame(animate);
    };
    animate();

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      targetRotation.current = isDark ? TWELVE_OCLOCK : TWO_OCLOCK;
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <mesh position={[0.01, 3.67, 0.05]}>
      <primitive ref={group} object={scene} scale={0.72} />
    </mesh>
  );
}
