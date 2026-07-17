"use client";

import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function RecordPlayer() {
  const { scene: recordPlayerScene } = useGLTF("/record_player3.glb");
  const { scene: stoolScene } = useGLTF("/stool_2.glb");

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
        scale={0.009}
        position={[1.89, 0.68, 2]}
        rotation={[Math.PI / 0.667, 0, 0]}
      />

      {/* GLB stool */}
      <primitive
        ref={stoolGroup}
        object={stoolScene}
        scale={0.24}
        position={[1.9, 0, 2]}
        rotation={[0, Math.PI / 1.035, 0]}
      />

      <Html position={[1.7, 0.85, 1.3]} center>
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? "Stop music" : "Play music"}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full text-white transition-transform duration-300 ease-out hover:scale-110"
        >
          {isPlaying ? (
            // Stop-ikon
            <svg
              viewBox="0 0 24 24"
              width="19"
              height="19"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          ) : (
            // Music-ikon
            <svg
              viewBox="0 0 24 24"
              width="23"
              height="23"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18V5l10-2v13" />
              <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
              <circle cx="16" cy="16" r="3" fill="currentColor" stroke="none" />
            </svg>
          )}
        </button>
      </Html>
    </>
  );
}

useGLTF.preload("/record_player3.glb");
useGLTF.preload("/stool_2.glb");
