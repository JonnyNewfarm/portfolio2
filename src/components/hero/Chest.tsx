"use client";
import { useGLTF, Text } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function Chest() {
  const { scene } = useGLTF("/stack-chest.glb");

  const lidRef = useRef<THREE.Object3D | null>(null);
  const wordsRef = useRef<any[]>([]);
  const [trigger, setTrigger] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const techWords = ["Next.js", "TW CSS", "R3F", "Motion", "GSAP"];

  const wordColorsLight = [
    "#383b38",
    "#694d41",
    "#73603f",
    "#4a3d44",
    "#4a615a",
  ];
  const wordColorsDark = [
    "#c7d6c7",
    "#b4c8cf",
    "#ccac9d",
    "#9fcca5",
    "#a1b5c9",
  ];

  const wordColors = isDark ? wordColorsDark : wordColorsLight;

  useEffect(() => {
    const updateMode = () => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    };

    updateMode();

    const observer = new MutationObserver(updateMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if (child.name === "old_Chest_top_Old_Chest_0") {
        lidRef.current = child;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!trigger || !lidRef.current || wordsRef.current.length === 0) return;

    const tl = gsap.timeline();

    tl.to(lidRef.current.rotation, {
      x: -1.2,
      duration: 1,
      ease: "power3.out",
    });

    const chestPos = lidRef.current.getWorldPosition(new THREE.Vector3());

    wordsRef.current.forEach((word) => {
      word.position.set(chestPos.x, chestPos.y, chestPos.z);
      word.scale.set(1, 1, 1);
      word.material.transparent = true;
      word.material.opacity = 0;
      word.rotation.set(0, 1.6, 0);
    });

    techWords.forEach((_, i) => {
      const word = wordsRef.current[i];

      tl.to(
        word.material,
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        `word${i}`
      );
      tl.to(
        word.position,
        { y: word.position.y + 0.8, duration: 1, ease: "power2.out" },
        `word${i}`
      );
      tl.to(
        word.material,
        { opacity: 0, duration: 0.5, ease: "power2.out" },
        `word${i}+0.8`
      );
    });

    tl.to(
      lidRef.current.rotation,
      { x: 0, duration: 1, ease: "power2.out" },
      "+=0.2"
    );

    tl.call(() => setTrigger(false));
  }, [trigger]);

  return (
    <group>
      <Text
        onClick={() => setTrigger(true)}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
        position={[-2.55, 0.77, 2.84]}
        fontSize={0.14}
        color={isDark ? "#c7d6c7" : "#383b38"}
        rotation={[0, 1.6, 0]}
      >
        Stack Used
      </Text>

      <group
        onClick={() => setTrigger(true)}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
        position={[-2.2, 0, 2.9]}
        rotation={[0, 1.6, 0]}
      >
        <primitive object={scene} scale={0.6} />
      </group>

      {techWords.map((word, i) => (
        <Text
          key={i}
          fontSize={0.16}
          color={wordColors[i]}
          rotation={[0, 2, 0]}
          ref={(el: any) => (wordsRef.current[i] = el)}
          renderOrder={999}
        >
          {word}
        </Text>
      ))}
    </group>
  );
}
