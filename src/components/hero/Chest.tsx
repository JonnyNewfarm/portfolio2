import { useGLTF, Text } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function Chest() {
  const { scene } = useGLTF("/stack-chest.glb");

  const lidRef = useRef<THREE.Object3D | null>(null);
  const wordsRef = useRef<any[]>([]);
  const [trigger, setTrigger] = useState(false);
  const [textColor, setTextColor] = useState("#383b38");

  const techWords = ["Next.js", "TW CSS", "R3F", "Motion", "GSAP"];

  useEffect(() => {
    const updateColor = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTextColor(isDark ? "#c7d6c7" : "#383b38");
    };

    updateColor();

    const observer = new MutationObserver(updateColor);
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
        word.position,
        { y: word.position.y + 0.8, duration: 1, ease: "power2.out" },
        ">0"
      );
      tl.to(
        word.material,
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        "<"
      );
      tl.to(
        word.material,
        { opacity: 0, duration: 0.5, ease: "power2.out" },
        "+=0.3"
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
        position={[-2.5, 0.77, 2.84]}
        fontSize={0.18}
        color={textColor}
        rotation={[0, 1.6, 0]}
      >
        Stack
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
          color={textColor}
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
