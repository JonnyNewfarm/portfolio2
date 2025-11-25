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

  const initialRotation = useRef<THREE.Euler>(new THREE.Euler(0.1, 2, -2));

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
        position={[4.12, 0.5, 1]}
        rotation={initialRotation.current}
        onClick={() => setSpin(true)}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <primitive object={scene} scale={0.1} />
      </group>

      {/* Stool */}
      <group rotation={[0, Math.PI / 6, 0]} position={[4.1, 0, 0.6]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.3]} />
          <meshStandardMaterial color="#e6ede9" />
        </mesh>

        <mesh position={[-0.19, 0.09, -0.14]}>
          <boxGeometry args={[0.045, 0.25, 0.05]} />
          <meshStandardMaterial color="#e6ede9" />
        </mesh>
        <mesh position={[0.2, 0.08, -0.11]}>
          <boxGeometry args={[0.045, 0.25, 0.05]} />
          <meshStandardMaterial color="#e6ede9" />
        </mesh>
        <mesh position={[-0.19, 0.12, 0.11]}>
          <boxGeometry args={[0.045, 0.25, 0.05]} />
          <meshStandardMaterial color="#e6ede9" />
        </mesh>
        <mesh position={[0.2, 0.13, 0.15]}>
          <boxGeometry args={[0.05, 0.25, 0.05]} />
          <meshStandardMaterial color="#e6ede9" />
        </mesh>
      </group>
    </>
  );
}
