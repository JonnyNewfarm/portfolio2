"use client";
import { useGLTF, Html } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RecordPlayer() {
  const { scene } = useGLTF("/vin-player7.glb");
  const group = useRef<THREE.Group>(null);
  const recordRef = useRef<THREE.Object3D>(null);
  const armRef = useRef<THREE.Object3D>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audio.current = new Audio("/sounds/record.mp3");
    audio.current.volume = 0.8;
    audio.current.onended = () => setIsPlaying(false);
  }, []);

  useEffect(() => {
    let recordObj: THREE.Object3D | null = null;
    let armObj: THREE.Object3D | null = null;

    scene.traverse((child) => {
      if (child.name === "table_sm_turn_plade_mat_0") recordObj = child;
      if (child.name === "arm_grp") armObj = child;
    });

    (recordRef as React.MutableRefObject<THREE.Object3D | null>).current =
      recordObj;
    (armRef as React.MutableRefObject<THREE.Object3D | null>).current = armObj;
  }, [scene]);

  useFrame(() => {
    if (armRef.current) {
      const targetRotation = isPlaying ? -0.62 : 0.0;
      armRef.current.rotation.z = THREE.MathUtils.lerp(
        armRef.current.rotation.z,
        targetRotation,
        0.05
      );
    }

    if (recordRef.current && isPlaying) {
      recordRef.current.rotation.z += 0.05;
    }
  });

  const handleTogglePlay = () => {
    setIsPlaying((prev) => {
      const newState = !prev;
      if (audio.current) {
        if (newState) audio.current.play();
        else audio.current.pause();
      }
      return newState;
    });
  };

  return (
    <>
      {/* Record player model */}
      <primitive
        ref={group}
        object={scene}
        scale={0.011}
        position={[1.82, 0.6, 1.7]}
        rotation={[Math.PI / 0.67, 0, 0]}
      />

      {/* Stool */}
      <group rotation={[0, Math.PI / 1.035, 0]} position={[1.8, 0, 1.7]}>
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[0.8, 0.03, 0.6]} />
          <meshStandardMaterial color="#d4d2cf" />
        </mesh>
        {/* Legs */}

        <mesh position={[-0.28, 0.3, -0.1]}>
          <boxGeometry args={[0.04, 0.5, 0.05]} />
          <meshStandardMaterial color="#d4d2cf" />
        </mesh>
        <mesh position={[0.28, 0.3, -0.11]}>
          <boxGeometry args={[0.04, 0.5, 0.05]} />
          <meshStandardMaterial color="#d4d2cf" />
        </mesh>
        <mesh position={[-0.28, 0.3, 0.11]}>
          <boxGeometry args={[0.04, 0.5, 0.05]} />
          <meshStandardMaterial color="#d4d2cf" />
        </mesh>
        <mesh position={[0.28, 0.3, 0.11]}>
          <boxGeometry args={[0.04, 0.5, 0.05]} />
          <meshStandardMaterial color="#d4d2cf" />
        </mesh>
      </group>

      <Html position={[1.7, 0.9, 0.4]} center>
        <button
          onClick={handleTogglePlay}
          className="rounded text-white text-lg cursor-pointer hover:scale-108 transition-transform ease-in-out"
          style={{
            fontFamily: "monospace",
          }}
        >
          {isPlaying ? "Stop" : "Play"}
        </button>
      </Html>
    </>
  );
}
