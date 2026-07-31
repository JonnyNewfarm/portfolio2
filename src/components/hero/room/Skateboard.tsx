"use client";
import { useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Skateboard() {
  const { scene } = useGLTF("/newfarm-board.glb");
  const groupRef = useRef<THREE.Group>(null);
  const [spin, setSpin] = useState(false);
  const [progress, setProgress] = useState(0);

  const initialRotation = useRef<THREE.Euler>(new THREE.Euler(0.1, 1.8, -1.9));

  useFrame((_, delta) => {
    if (spin && groupRef.current) {
      const speed = 8;
      const nextProgress = progress + delta * speed;
      setProgress(nextProgress);

      groupRef.current.rotation.x = initialRotation.current.x;
      groupRef.current.rotation.y = initialRotation.current.y + nextProgress;
      groupRef.current.rotation.z = initialRotation.current.z;

      if (nextProgress >= 2 * Math.PI) {
        setSpin(false);
        setProgress(0);
        groupRef.current.rotation.copy(initialRotation.current);
      }
    }
  });

  return (
    <>
      {/* Skateboard */}
      <group
        ref={groupRef}
        position={[4, 0.3, 0.19]}
        rotation={initialRotation.current}
        onClick={() => setSpin(true)}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <primitive object={scene} scale={0.1} />
      </group>
    </>
  );
}
