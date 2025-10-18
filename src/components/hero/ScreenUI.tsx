"use client";

import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { MotionValue, AnimatePresence } from "framer-motion";
import { motion } from "framer-motion-3d";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export default function ScreenUI({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const router = useRouter();
  const groupRef = useRef<THREE.Group>(null);
  const [nextPage, setNextPage] = useState(false);

  useFrame(() => {
    const progress = scrollYProgress.get();
    if (!groupRef.current) return;

    groupRef.current.position.z = -0.55 + (1 - progress) * 0.2;
    groupRef.current.rotation.y = Math.sin(progress * Math.PI) * 0.02;
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 6]}>
      <AnimatePresence mode="wait">
        {nextPage ? (
          <motion.group
            initial={{ opacity: 0, y: 0.04 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Text position={[-0.23, 0.65, 1.3]} fontSize={0.151} color="black">
              Navigation
            </Text>
            <Text
              position={[0.6, 0.65, 1.3]}
              fontSize={0.132}
              color="black"
              onClick={() => setNextPage(false)}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "default")}
            >
              Back
            </Text>
            <Text
              position={[-0.4, 0.37, 1.3]}
              fontSize={0.21}
              color="black"
              onClick={() => router.push("/")}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "default")}
            >
              Home
            </Text>
            <Text
              position={[0.53, 0.37, 1.3]}
              fontSize={0.21}
              color="black"
              onClick={() => router.push("/projects")}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "default")}
            >
              My Work
            </Text>
            <Text
              position={[-0.41, 0.033, 1.3]}
              fontSize={0.21}
              color="black"
              onClick={() => router.push("/about")}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "default")}
            >
              About
            </Text>
            <Text
              position={[0.48, 0.035, 1.3]}
              fontSize={0.21}
              color="black"
              onClick={() => router.push("/contact")}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "default")}
            >
              Contact
            </Text>
          </motion.group>
        ) : (
          <motion.group
            key="intro"
            initial={{ opacity: 0, y: -0.04 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0.2 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Text position={[-0.15, 0.6, 1.3]} fontSize={0.163} color="black">
              Hey — I’m Jonas,
            </Text>
            <Text position={[0.12, 0.4, 1.3]} fontSize={0.163} color="black">
              Designer and developer
            </Text>
            <Text position={[-0.12, 0.2, 1.3]} fontSize={0.163} color="black">
              Based in Norway.
            </Text>
            <Text
              position={[-0.46, -0.04, 1.31]}
              fontSize={0.269}
              fontweight={900}
              color="black"
              onClick={() => setNextPage(true)}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "default")}
            >
              Next
            </Text>
          </motion.group>
        )}
      </AnimatePresence>
    </group>
  );
}
