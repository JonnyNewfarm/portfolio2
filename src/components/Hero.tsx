"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Text, RoundedBox, useGLTF } from "@react-three/drei";
import { useScroll, MotionValue, AnimatePresence } from "framer-motion";
import { motion } from "framer-motion-3d";
import { useTransform, motion as regMotion } from "framer-motion";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import DarkModeBtn from "./DarkModeBtn";

// ---------------- Cartoon Model ----------------
function CartoonModel() {
  const { scene } = useGLTF("/me-cartoon.glb");
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;

    const hip = group.current.getObjectByName("Hips");
    const leftLeg = group.current.getObjectByName("LeftLeg");
    const rightLeg = group.current.getObjectByName("RightLeg");
    const spine = group.current.getObjectByName("Spine");

    if (hip) hip.rotation.x = -Math.PI / 3.8;
    if (leftLeg) leftLeg.rotation.x = -Math.PI / 2;
    if (rightLeg) rightLeg.rotation.x = -Math.PI / 3;
    if (spine) spine.rotation.x = Math.PI / 4;

    // Gentle breathing motion
    const t = state.clock.getElapsedTime();
    group.current.position.y = -0.45 + Math.sin(t * 1.2) * 0.008; // very small bob
    group.current.rotation.y = Math.PI + Math.sin(t * 0.3) * 0.009; // tiny sway
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

// ---------------- Computer Tower ----------------
function ComputerTower() {
  return (
    <group rotation={[0, Math.PI / -2, 0]} position={[1.5, -0.12, 0.7]}>
      {/* Tower Body */}
      <RoundedBox
        args={[0.5, 0.9, 0.25]}
        radius={0.03}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#222222" roughness={0.6} metalness={0.3} />
      </RoundedBox>

      {/* Power Button */}
      <mesh position={[0.29, 0.3, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 32]} />
        <meshStandardMaterial
          color="#00ff99"
          emissive="#00ff99"
          emissiveIntensity={
            document.documentElement.classList.contains("dark") ? 2 : 0.4
          } // boost glow
        />
      </mesh>

      {/* USB Ports */}
      {[0.05, -0.05].map((y, i) => (
        <mesh key={i} position={[0.29, -0.15, 0]}>
          <boxGeometry args={[0.05, 0.015, 0.01]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      ))}

      {/* Cable going to the monitor */}
      <mesh>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(0.21, 0.35, 0.05), // back of tower (high)
              new THREE.Vector3(0.25, -0.1, 0.05), // drop to floor
              new THREE.Vector3(0.0, -0.1, 0.05), // run along floor under desk
              new THREE.Vector3(0.0, 0.9, -0.2), // rise up back of desk
              new THREE.Vector3(-0.51, 1.5, 0.63), // into monitor
            ]),
            80, // segments (more = smoother)
            0.015, // radius
            8, // radial segments
            false,
          ]}
        />
        <meshStandardMaterial color="#000000" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------- Tablet ----------------

export function Tablet() {
  const images = ["/desk1-01.webp", "/desk1-02.webp", "/desk1-03.webp"];
  const textures = useLoader(THREE.TextureLoader, images);

  const [imageIndex, setImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [fade, setFade] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);

  const fadeSpeed = 0.6;
  const pauseDuration = 5;

  useFrame((state, delta) => {
    if (fade < 1) {
      setFade((prev) => Math.min(prev + delta * fadeSpeed, 1));
    } else {
      setPauseTime((prev) => prev + delta);

      if (pauseTime >= pauseDuration) {
        setImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % textures.length);
        setFade(0);
        setPauseTime(0);
      }
    }
  });

  return (
    <group position={[1.2, 1.16, 1.35]} rotation={[-0.2, 0.1, 0]}>
      {/* Photo Frame Body */}
      <RoundedBox
        args={[0.42, 0.3, 0]}
        radius={0.02}
        smoothness={8}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#21261f" roughness={0.6} metalness={0.2} />
      </RoundedBox>

      {/* Next Image */}
      <mesh position={[0, 0.015, 0.03]}>
        <planeGeometry args={[0.36, 0.21]} />
        <meshStandardMaterial
          map={textures[nextImageIndex]}
          transparent
          opacity={fade}
        />
      </mesh>
    </group>
  );
}

function ScreenHint({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const textRef = useRef<any>(null);
  const cylinderRef = useRef<any>(null);
  const arrowRef = useRef<any>(null);

  const opacity = useTransform(
    scrollYProgress,
    [0.05, 0.15, 0.8, 0.95],
    [0, 1, 1, 0]
  );

  useFrame(() => {
    const o = opacity.get();
    const isDark = document.documentElement.classList.contains("dark");
    const color = new THREE.Color(isDark ? "#ffffff" : "#000000");

    if (textRef.current) {
      textRef.current.material.transparent = true;
      textRef.current.material.opacity = o;
      textRef.current.material.color.copy(color);
    }

    if (arrowRef.current) {
      arrowRef.current.material.transparent = true;
      arrowRef.current.material.opacity = o;
      arrowRef.current.material.color.copy(color);
    }

    if (cylinderRef.current) {
      cylinderRef.current.material.transparent = true;
      cylinderRef.current.material.opacity = o;
      cylinderRef.current.material.color.copy(color);
    }
  });

  return (
    <group position={[0.39, 2.9, 0.43]}>
      {/* Cylinder */}
      <mesh
        ref={cylinderRef}
        position={[0.08, -0.19, 0]}
        rotation={[-Math.PI / 5 - 6, 2.4, 4.2]}
      >
        <cylinderGeometry args={[0.023, 0.023, 0.23, 50]} />
        <meshStandardMaterial color="#4B3621" />
      </mesh>

      {/* Text */}
      <Text
        ref={textRef}
        fontSize={0.138}
        anchorX="center"
        anchorY="middle"
        position={[0, 0.017, 0]}
      >
        Navigate on the screen
      </Text>

      {/* Arrow */}
      <mesh
        ref={arrowRef}
        rotation={[-Math.PI / 5 - 6, 2.3, 4.2]}
        position={[0, -0.33, 0]}
      >
        <coneGeometry args={[0.05, 0.15, 16]} />
        <meshStandardMaterial />
      </mesh>
    </group>
  );
}

function CoffeeMug() {
  return (
    <group position={[-0.78, 1.09, 1.1]} rotation={[0, Math.PI / 5, 0]}>
      {/* Mug Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Hollow interior */}
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.12, 32]} />
        <meshStandardMaterial color="#c4c4c4" roughness={0.6} />
      </mesh>

      {/* Coffee liquid */}
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.083, 0.083, 0.01, 32]} />
        <meshStandardMaterial color="#4b2e05" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Handle */}
      <mesh position={[0.11, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.045, 0.012, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  );
}

function FloorLamp() {
  const bulbRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const isDark = document.documentElement.classList.contains("dark");

    if (bulbRef.current) {
      const material = bulbRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = isDark ? 5 + Math.sin(t * 3) * 0.3 : 0.05;
    }

    if (lightRef.current) {
      lightRef.current.intensity = isDark ? 20 + Math.sin(t * 3) * 0.6 : 0;
    }
  });

  return (
    <group position={[1.6, 0, 0.66]}>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0.7, 0, -0.4]}>
        <cylinderGeometry args={[0.18, 0.26, 0.07, 32]} />
        <meshStandardMaterial color="#444" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Curved Stand */}
      <motion.mesh
        rotation={[0, Math.PI / -2.2, 0]}
        castShadow
        receiveShadow
        position={[0.6, 0.46, 0]}
      >
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, -0.3, -0.09),
              new THREE.Vector3(-0.3, 2.5, -0.021),
              new THREE.Vector3(0.06, 2.46, 0.24),
              new THREE.Vector3(0.24, 2.06, 0.33),
            ]),
            80,
            0.016,
            13,
            false,
          ]}
        />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.7} />
      </motion.mesh>

      {/* Lampshade */}
      <mesh
        position={[0.25, 2.42, 0.25]}
        rotation={[Math.PI / 36, 0, -0.06]}
        castShadow
      >
        <cylinderGeometry args={[0.35, 0.4, 0.3, 48, 1, true]} />
        <meshStandardMaterial
          color="#bec4be"
          roughness={0.7}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bulb */}
      <mesh ref={bulbRef} position={[0.25, 2.35, 0.25]}>
        <sphereGeometry args={[0.07, 32, 32]} />
        <meshStandardMaterial
          color="#fffbe0"
          emissive="#fff3c0"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* SpotLight */}
      <spotLight
        ref={lightRef}
        intensity={60}
        position={[0.25, 2.35, 0.25]}
        angle={Math.PI / 5}
        penumbra={0.8}
        color="#fff1c1"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        target-position={[0, 0.8, 0]}
      />
    </group>
  );
}

function Bookshelf() {
  const bookColors = ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#1d3557"];

  return (
    <group position={[2.1, 0.33, -0.3]}>
      {/* Shelves */}
      {[0, 0.8, 1.6].map((y, i) => (
        <RoundedBox
          key={i}
          args={[0.8, 0.05, 0.3]}
          radius={0.02}
          smoothness={3}
          position={[0, y + 0.05, 0]}
        >
          <meshStandardMaterial
            color="#8B4513"
            roughness={0.6}
            metalness={0.1}
          />
        </RoundedBox>
      ))}

      {/* Many Books */}
      {Array.from({ length: 18 }).map((_, i) => {
        const color = bookColors[i % bookColors.length];
        const shelfLevel = Math.floor(i / 6); // 6 books per shelf
        const y = 0.05 + shelfLevel * 0.8;
        const x = -0.35 + Math.random() * 0.7;
        const z = -0.1 + Math.random() * 0.22;
        const height = 0.15 + Math.random() * 0.25;
        const width = 0.04 + Math.random() * 0.025;
        const depth = 0.1 + Math.random() * 0.04;
        const tilt = (Math.random() - 0.5) * 0.12;

        return (
          <mesh
            key={i}
            position={[x, y + height / 2, z]}
            rotation={[0, tilt, 0]}
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={color}
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
        );
      })}

      {/* Horizontal stacks */}
      {Array.from({ length: 3 }).map((_, i) => {
        const y = 0.05 + i * 0.8;
        return (
          <mesh
            key={`stack-${i}`}
            position={[0.25, y + 0.07, -0.05]}
            rotation={[0, 0.05, 0]}
          >
            <boxGeometry args={[0.12, 0.03, 0.2]} />
            <meshStandardMaterial
              color="#d4a373"
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Decorative items */}
      {/* Plant */}
      <mesh position={[-0.25, 0.05 + 0.05, 0.08]}>
        <cylinderGeometry args={[0.04, 0.04, 0.05, 16]} />
        <meshStandardMaterial color="#2a7b3a" roughness={0.7} />
      </mesh>

      {/* Photo frame */}
      <mesh position={[0.3, 0.05 + 0.07, 0.1]} rotation={[0, -0.05, 0]}>
        <boxGeometry args={[0.08, 0.06, 0.01]} />
        <meshStandardMaterial color="#f0e6d2" roughness={0.6} />
      </mesh>

      {/* Candle */}
      <mesh position={[0, 0.05 + 0.04, -0.08]}>
        <cylinderGeometry args={[0.025, 0.025, 0.06, 16]} />
        <meshStandardMaterial color="#f4d35e" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Figurine */}
      <mesh position={[-0.15, 0.05 + 0.08, -0.05]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#555555" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}

function Desk() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const isDark = document.documentElement.classList.contains("dark");

  useFrame(() => {
    const isDark = document.documentElement.classList.contains("dark");
    if (lightRef.current) {
      lightRef.current.intensity = isDark ? 3.4 : 0;
    }
  });
  return (
    <group position={[0, 0, 1.2]}>
      {/* Keyboard */}
      <group position={[0, 1, 0]}>
        {/* Keyboard Base */}
        <RoundedBox
          args={[0.8, 0.06, 0.3]}
          radius={0.02}
          smoothness={4}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#e6e6e6"
            roughness={0.6}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Keys */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 14 }).map((_, col) => (
            <RoundedBox
              key={`${row}-${col}`}
              args={[0.05, 0.03, 0.05]}
              radius={0.005}
              smoothness={2}
              position={[-0.34 + col * 0.05, 0.035, -0.13 + row * 0.06]}
            >
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.5}
                metalness={0.1}
              />
            </RoundedBox>
          ))
        )}
      </group>

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

        {/* Warm Lamp Light */}
        <spotLight
          ref={lightRef}
          position={[1.1, 1.8, -0.5]}
          angle={Math.PI / 6}
          penumbra={0.3}
          color="#fff1c1"
          intensity={
            document.documentElement.classList.contains("dark") ? 10 : 1
          } // boost
          castShadow
        />
      </group>

      {/* Mouse */}
      <group position={[0.5, 1, 0]}>
        {/* Body */}
        <mesh castShadow receiveShadow scale={[0.7, 0.5, 2]}>
          <sphereGeometry args={[0.12, 36, 32]} />
          <meshStandardMaterial color="gray" roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Scroll Wheel */}
        <mesh position={[0, 0.03, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.04, 16]} />
          <meshStandardMaterial color="black" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Left/Right Button Divider */}
        <mesh position={[0, 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.001, 0.001, 0.18, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>

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
            position={[x, 0.53, z]}
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
          args={[2.03, 1.32, 0.1]}
          radius={0.02}
          smoothness={3}
          position={[0, 0.8, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="black" roughness={0.4} metalness={0.3} />
        </RoundedBox>

        <RoundedBox
          args={[1.9, 1.19, 0.13]}
          radius={0.02}
          smoothness={3}
          position={[0, 0.8, 0]}
        >
          <meshStandardMaterial color="white" roughness={0.4} metalness={0.3} />
        </RoundedBox>

        <mesh position={[0, 0.8, 0.07]}>
          <planeGeometry args={[1.9, 1.19]} />
          <meshStandardMaterial
            color={isDark ? "#f5f5f5" : "#fafafa"}
            emissive={isDark ? "#fff6d0" : "#ffffff"}
            emissiveIntensity={isDark ? 3 : 0.2}
            transparent
            opacity={0.95}
          />
        </mesh>
      </group>
    </group>
  );
}

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
              fontSize={0.126}
              color="black"
              onClick={() => setNextPage(false)}
            >
              Back
            </Text>
            <Text
              position={[-0.4, 0.3, 1.3]}
              fontSize={0.168}
              color="black"
              onClick={() => router.push("/")}
            >
              Home
            </Text>
            <Text
              position={[0.45, 0.3, 1.3]}
              fontSize={0.168}
              color="black"
              onClick={() => router.push("/projects")}
            >
              My Work
            </Text>
            <Text
              position={[-0.4, 0, 1.3]}
              fontSize={0.168}
              color="black"
              onClick={() => router.push("/about")}
            >
              About
            </Text>
            <Text
              position={[0.42, 0, 1.3]}
              fontSize={0.168}
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
            <Text position={[-0.13, 0.6, 1.3]} fontSize={0.151} color="black">
              Hey — I’m Jonas,
            </Text>
            <Text position={[0.1, 0.4, 1.3]} fontSize={0.151} color="black">
              Designer and developer
            </Text>
            <Text position={[-0.12, 0.2, 1.3]} fontSize={0.151} color="black">
              Based in Norway.
            </Text>
            <Text
              position={[-0.46, -0.04, 1.31]}
              fontSize={0.223}
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

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(false); // toggle dark mode

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0.25, 0.35], [1, 0]); // fades later and slower

  return (
    <section
      ref={ref}
      className="h-[185vh] md:h-[200vh] bg-[#ececec] dark:bg-[#2e2b2b] text-black dark:text-stone-300"
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

          <FloorLamp />
          <Desk />
          <CoffeeMug />
          <Bookshelf />
          <Tablet />
          <CartoonModel />
          <Chair />
          <ComputerTower />
          <ScreenUI scrollYProgress={scrollYProgress} />
          <ScreenHint scrollYProgress={scrollYProgress} />
          <CameraController scrollYProgress={scrollYProgress} />
        </Canvas>

        <div className="absolute z-50 text-2xl  md:text-3xl font-semibold  left-5 bottom-14 md:bottom-20 md:left-20">
          <regMotion.h1 style={{ opacity }}>Scroll to zoom</regMotion.h1>
        </div>
        <div className="absolute hidden md:block  md:-translate-y-1/2 md:top-1/2 right-5 z-50">
          <DarkModeBtn />
        </div>
        <div className="absolute  md:hidden  bottom-12 right-5 z-50">
          <DarkModeBtn />
        </div>
      </div>
    </section>
  );
}
