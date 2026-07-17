"use client";

import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function RecordPlayer() {
  const { scene: recordPlayerScene } = useGLTF("/record_player2.glb");
  const { scene: stoolScene } = useGLTF("/stool_1.glb");

  const recordPlayerGroup = useRef<THREE.Group | null>(null);
  const stoolGroup = useRef<THREE.Group | null>(null);

  const recordRef = useRef<THREE.Object3D | null>(null);
  const armRef = useRef<THREE.Object3D | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioElement = new Audio("/sounds/record.mp3");

    audioElement.volume = 0.8;
    audioElement.onended = () => setIsPlaying(false);

    audio.current = audioElement;

    return () => {
      audioElement.pause();
      audioElement.src = "";
      audio.current = null;
    };
  }, []);

  useEffect(() => {
    let recordObj: THREE.Object3D | null = null;
    let armObj: THREE.Object3D | null = null;

    recordPlayerScene.traverse((child: THREE.Object3D) => {
      if (child.name === "table_sm_turn_plade_mat_0") {
        recordObj = child;
      }

      if (child.name === "arm_grp") {
        armObj = child;
      }
    });

    recordRef.current = recordObj;
    armRef.current = armObj;

    return () => {
      recordRef.current = null;
      armRef.current = null;
    };
  }, [recordPlayerScene]);

  useFrame(() => {
    if (armRef.current) {
      const targetRotation = isPlaying ? -0.62 : 0;

      armRef.current.rotation.z = THREE.MathUtils.lerp(
        armRef.current.rotation.z,
        targetRotation,
        0.05,
      );
    }

    if (recordRef.current && isPlaying) {
      recordRef.current.rotation.z += 0.05;
    }
  });

  const handleTogglePlay = () => {
    const audioElement = audio.current;

    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
      return;
    }

    audioElement
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error: unknown) => {
        console.error("Kunne ikke spille av lyd:", error);
        setIsPlaying(false);
      });
  };

  return (
    <>
      {/* Record player */}
      <primitive
        ref={recordPlayerGroup}
        object={recordPlayerScene}
        scale={0.011}
        position={[1.89, 0.76, 2]}
        rotation={[Math.PI / 0.667, 0, 0]}
      />

      {/* GLB stool */}
      <primitive
        ref={stoolGroup}
        object={stoolScene}
        scale={0.27}
        position={[1.9, 0, 2]}
        rotation={[0, Math.PI / 1.035, 0]}
      />

      <Html position={[1.7, 0.9, 0.4]} center>
        <button
          type="button"
          onClick={handleTogglePlay}
          className="cursor-pointer rounded text-lg text-white transition-transform ease-in-out hover:scale-108"
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

useGLTF.preload("/record_player2.glb");
useGLTF.preload("/stool_1.glb");
