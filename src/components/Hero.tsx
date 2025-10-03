"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, RoundedBox, useGLTF } from "@react-three/drei";
import { useScroll, MotionValue, AnimatePresence } from "framer-motion";
import { motion } from "framer-motion-3d";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

// ---------------- Cartoon Model ----------------
function CartoonModel() {
  const { scene } = useGLTF("/me-cartoon.glb");
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;

    const hip = group.current.getObjectByName("Hips");
    if (hip) hip.rotation.x = -Math.PI / 3.8;

    const leftLeg = group.current.getObjectByName("LeftLeg");
    const rightLeg = group.current.getObjectByName("RightLeg");
    const spine = group.current.getObjectByName("Spine");

    if (leftLeg) leftLeg.rotation.x = -Math.PI / 2;
    if (rightLeg) rightLeg.rotation.x = -Math.PI / 3;
    if (spine) spine.rotation.x = Math.PI / 4;

    group.current.rotation.y = Math.PI;
  });

  return (
    <primitive
      ref={group}
      object={scene}
      position={[0, -0.45, 2.7]}
      scale={1.49}
    />
  );
}

// ---------------- Chair ----------------
function Chair() {
  return (
    <group>
      {/* Seat */}
      <RoundedBox
        args={[1, 0.12, 0.6]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.7, 2.8]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#555555" roughness={0.6} metalness={0.2} />
      </RoundedBox>

      {/* Backrest */}
      <RoundedBox
        args={[1, 1, 0.12]}
        radius={0.05}
        smoothness={4}
        position={[0, 1.2, 3.05]}
        rotation={[-0.01, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#555555" roughness={1.3} metalness={0.2} />
      </RoundedBox>

      {/* Legs */}
      {[-0.45, 0.45].map((x) =>
        [-0.25, 0.25].map((z, i) => (
          <mesh
            key={`${x}-${z}-${i}`}
            position={[x, 0.29, z + 2.8]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.05, 0.05, 0.8]} />
            <meshStandardMaterial
              color="#444444"
              roughness={0.5}
              metalness={0.3}
            />
          </mesh>
        ))
      )}

      {/* Cushion */}
      <RoundedBox
        args={[0.9, 0.02, 0.55]}
        radius={0.02}
        smoothness={4}
        position={[0, 0.76, 2.8]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#666666" roughness={0.7} metalness={0.1} />
      </RoundedBox>
    </group>
  );
}

// ---------------- Desk ----------------
function Desk() {
  return (
    <group position={[0, 0, 1.2]}>
      {/* Keyboard */}
      <RoundedBox
        args={[0.8, 0.06, 0.3]}
        radius={0.02}
        smoothness={4}
        position={[0, 1, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#e6e6e6" roughness={0.6} metalness={0.1} />
      </RoundedBox>

      {/* Desk Lamp with Light */}
      <group position={[1.1, 1.05, -0.5]}>
        {/* Lamp Base */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.03, 32]} />
          <meshStandardMaterial
            color="#222222"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>

        {/* Lamp Stand */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 32]} />
          <meshStandardMaterial
            color="#222222"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>

        {/* Rounded Lamp Shade */}
        <mesh
          position={[0, 0.75, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <sphereGeometry
            args={[0.12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#ffeb3b"
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>

        {/* Warm Lamp Light */}
        <spotLight
          position={[0, 0.75, 0]} // same as lamp shade
          angle={Math.PI / 6}
          penumbra={0.3}
          intensity={1.2}
          color={"#fff1c1"}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          target-position={[0, 0.5, 0]} // point slightly down to desk
        />
      </group>

      {/* Mouse */}

      <RoundedBox
        args={[0.18, 0.05, 0.1]}
        radius={0.03}
        smoothness={4}
        position={[0.5, 1, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#f5f5f5" roughness={0.6} metalness={0.1} />
      </RoundedBox>

      {/* Desk Top */}
      <RoundedBox
        args={[3, 0.12, 1.5]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.95, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#8B4513" roughness={0.6} metalness={0.1} />
      </RoundedBox>

      {/* Legs */}
      {[-1.4, 1.4].map((x) =>
        [-0.7, 0.7].map((z, i) => (
          <mesh
            key={`${x}-${z}-${i}`}
            position={[x, 0.53, z]} // half of height
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.08, 0.08, 0.75, 32]} />
            <meshStandardMaterial
              color="#4B3621"
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>
        ))
      )}

      {/* Monitor */}
      <group position={[0, 0.96, -0.6]}>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.8]} />
          <meshStandardMaterial
            color="#333333"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>

        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.03]} />
          <meshStandardMaterial
            color="#222222"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>

        <RoundedBox
          args={[1.82, 1.2, 0.1]}
          radius={0.02}
          smoothness={3}
          position={[0, 0.8, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="black" roughness={0.4} metalness={0.3} />
        </RoundedBox>

        <RoundedBox
          args={[1.7, 1.09, 0.13]}
          radius={0.02}
          smoothness={3}
          position={[0, 0.8, 0]}
        >
          <meshStandardMaterial color="white" roughness={0.4} metalness={0.3} />
        </RoundedBox>
      </group>
    </group>
  );
}

// ---------------- Screen UI ----------------
function ScreenUI({
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
            initial={{ opacity: 0, y: 0.1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Text position={[-0.23, 0.65, 1.3]} fontSize={0.14} color="black">
              Navigation
            </Text>
            <Text
              position={[0.6, 0.65, 1.3]}
              fontSize={0.1}
              color="black"
              onClick={() => setNextPage(false)}
            >
              Back
            </Text>
            <Text
              position={[-0.4, 0.3, 1.3]}
              fontSize={0.14}
              color="black"
              onClick={() => router.push("/")}
            >
              Home
            </Text>
            <Text
              position={[0.45, 0.3, 1.3]}
              fontSize={0.14}
              color="black"
              onClick={() => router.push("/projects")}
            >
              My Work
            </Text>
            <Text
              position={[-0.4, 0, 1.3]}
              fontSize={0.14}
              color="black"
              onClick={() => router.push("/about")}
            >
              About
            </Text>
            <Text
              position={[0.42, 0, 1.3]}
              fontSize={0.14}
              color="black"
              onClick={() => router.push("/contact")}
            >
              Contact
            </Text>
          </motion.group>
        ) : (
          <motion.group
            key="intro"
            initial={{ opacity: 0, y: -0.2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0.2 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Text position={[-0.13, 0.6, 1.3]} fontSize={0.13} color="black">
              Hey — I’m Jonas,
            </Text>
            <Text position={[0.1, 0.4, 1.3]} fontSize={0.13} color="black">
              Designer and developer
            </Text>
            <Text position={[-0.12, 0.2, 1.3]} fontSize={0.13} color="black">
              Based in Norway.
            </Text>
            <Text
              position={[-0.48, -0.03, 1.3]}
              fontSize={0.14}
              color="black"
              onClick={() => setNextPage(true)}
            >
              Next
            </Text>
          </motion.group>
        )}
      </AnimatePresence>
    </group>
  );
}

// ---------------- Camera Controller ----------------
function CameraController({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const progress = scrollYProgress.get();
    camera.position.lerp(new THREE.Vector3(2.1, 1.6, 5.6 - progress * 3), 0.2);
    camera.lookAt(new THREE.Vector3(0.2, 0.8, 0));
  });

  return null;
}

// ---------------- Hero Section ----------------
export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <section
      ref={ref}
      className="h-[180vh] md:h-[200vh] bg-[#ececec] dark:bg-[#3c3a3a] text-black dark:text-white"
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Canvas shadows>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Desk />
          <CartoonModel />
          <Chair />
          <ScreenUI scrollYProgress={scrollYProgress} />
          <CameraController scrollYProgress={scrollYProgress} />
        </Canvas>

        <div className="absolute left-5 bottom-12 md:bottom-20 md:left-20">
          <h1>Scroll to zoom,</h1>
          <h1>Navigate on the screen.</h1>
        </div>
      </div>
    </section>
  );
}
