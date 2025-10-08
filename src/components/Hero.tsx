"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Text, RoundedBox, useGLTF, Line, Sphere } from "@react-three/drei";
import { useScroll, MotionValue, AnimatePresence } from "framer-motion";
import { motion } from "framer-motion-3d";
import { useTransform, motion as regMotion } from "framer-motion";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import DarkModeBtn from "./DarkModeBtn";

// ---------------- Cartoon Model ----------------
function CartoonModel({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const { scene } = useGLTF("/me-cartoon.glb");
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;

    const hip = group.current.getObjectByName("Hips");
    const leftLeg = group.current.getObjectByName("LeftLeg");
    const rightLeg = group.current.getObjectByName("RightLeg");
    const spine = group.current.getObjectByName("Spine");
    const rightArm = group.current.getObjectByName("RightArm"); // find your arm bone

    if (hip) hip.rotation.x = -Math.PI / 3.8;
    if (leftLeg) leftLeg.rotation.x = -Math.PI / 2;
    if (rightLeg) rightLeg.rotation.x = -Math.PI / 3;
    if (spine) spine.rotation.x = Math.PI / 4;
    if (rightArm) rightArm.rotation.x = Math.PI / 1.9;
    if (rightArm) rightArm.rotation.z = -Math.PI / 6.9;
    if (rightArm) rightArm.rotation.y = -Math.PI / 3.9;

    // Gentle breathing motion
    const t = state.clock.getElapsedTime();
    group.current.position.y = -0.45 + Math.sin(t * 1.2) * 0.008;
    group.current.rotation.y = Math.PI + Math.sin(t * 0.3) * 0.009;

    // ---- Arm lift based on scroll ----
    const progress = scrollYProgress.get(); // 0 -> 1
    const targetRotation = (-Math.PI / -2) * progress; // lift up to 90°
    if (rightArm) rightArm.rotation.y = targetRotation;
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
  const wood = useLoader(THREE.TextureLoader, "/fabrics/fabric-3.jpeg");
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  wood.repeat.set(1, 1);
  wood.colorSpace = THREE.SRGBColorSpace;

  const seat = useLoader(THREE.TextureLoader, "/fabrics/chair-seat.jpeg");
  seat.wrapS = seat.wrapT = THREE.RepeatWrapping;
  seat.repeat.set(1, 1);
  seat.colorSpace = THREE.SRGBColorSpace;

  return (
    <group position={[0, 0, 0]}>
      {/* Seat */}
      <RoundedBox
        args={[0.89, 0.11, 0.56]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.7, 2.73]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={seat} roughness={0.8} metalness={0.1} />
      </RoundedBox>
      {/* Bars under seat (front to back support) */}
      {[-0.38, 0.4].map((x, i) => (
        <mesh
          key={`under-bar-${i}`}
          position={[x, 0.61, 2.8]} // slightly below the seat
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          {/* connects front and back legs */}
          <boxGeometry args={[0.08, 0.05, 0.55]} />
          <meshStandardMaterial map={wood} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

      {[-0.38, 0.416].map((x, i) => (
        <mesh
          key={`under-bar-${i}`}
          position={[x, 0.36, 2.8]} // slightly below the seat
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          {/* connects front and back legs */}
          <boxGeometry args={[0.04, 0.03, 0.47]} />
          <meshStandardMaterial map={wood} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
      {/* Backrest (wood) */}
      <RoundedBox
        args={[1.015, 0.4, 0.08]}
        radius={0.05}
        smoothness={4}
        position={[-0.04, 1.39, 3.039]}
        rotation={[0.1, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={wood} roughness={0.6} metalness={0.1} />
      </RoundedBox>

      {/* Back support bars */}
      {[-0.412, 0.388].map((x, i) => (
        <mesh
          key={i}
          position={[x, 1.086, 3.055]}
          rotation={[0, 0, 0.07]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.025, 0.9, 0.07]} />
          <meshStandardMaterial map={wood} roughness={0.6} metalness={0.1} />
        </mesh>
      ))}

      {/* Legs (planky instead of round) */}
      {[-0.4, 0.4].map((x, i) =>
        [-0.25, 0.25].map((z, j) => (
          <mesh
            key={`${x}-${z}-${i}-${j}`}
            position={[x, 0.35, z + 2.8]}
            rotation={[-0.13, 0, 0]}
            castShadow
            receiveShadow
          >
            {/* rectangular beams instead of cylinders */}
            <boxGeometry args={[0.032, 0.78, 0.08]} />
            <meshStandardMaterial map={wood} roughness={0.5} metalness={0.2} />
          </mesh>
        ))
      )}

      {/* Side bars */}
      {[-0.28, 0.257].map((y, i) => (
        <mesh key={i} position={[0, 0.57, y + 2.8]} castShadow receiveShadow>
          <boxGeometry args={[0.86, 0.03, 0.05]} />
          <meshStandardMaterial map={wood} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------- Computer Tower ----------------
function ComputerTower() {
  const CompTower = useLoader(THREE.TextureLoader, "/fabrics/plastic.webp");
  CompTower.wrapS = CompTower.wrapT = THREE.RepeatWrapping;
  CompTower.repeat.set(1, 1);
  CompTower.colorSpace = THREE.SRGBColorSpace;
  return (
    <group rotation={[0, Math.PI / -2, 0]} position={[1.65, 0.3, 0.9]}>
      {/* Tower Body */}
      <RoundedBox
        args={[0.5, 0.9, 0.25]}
        radius={0.03}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={CompTower} roughness={0.6} metalness={0.3} />
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
        fontSize={0.146}
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
  const cup = useLoader(THREE.TextureLoader, "/fabrics/chair-seat.jpeg");
  cup.wrapS = cup.wrapT = THREE.RepeatWrapping;
  cup.repeat.set(1, 1);
  cup.colorSpace = THREE.SRGBColorSpace;
  return (
    <group position={[-0.79, 1.13, 1.25]} rotation={[0, Math.PI / 5, 0]}>
      {/* Mug Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 32]} />
        <meshStandardMaterial map={cup} roughness={0.4} metalness={0.1} />
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

function WindowOnWall() {
  const frameTexture = useLoader(THREE.TextureLoader, "/fabrics/wood-1.webp");
  frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping;
  frameTexture.repeat.set(1, 1);

  const [isDark, setIsDark] = useState(false);

  // Detect if dark mode class is active
  useEffect(() => {
    const checkDarkMode = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const bgTexture = useLoader(
    THREE.TextureLoader,
    isDark ? "/views-dark.jpeg" : "/views-light.jpeg"
  );
  bgTexture.colorSpace = THREE.SRGBColorSpace;
  bgTexture.repeat.x = -1;

  // ✅ Set wrapping *and* update texture
  bgTexture.wrapS = THREE.RepeatWrapping;
  bgTexture.wrapT = THREE.RepeatWrapping;
  bgTexture.needsUpdate = true;
  const openAngle = Math.PI / 2.7; // ~22.5° inward
  const paneWidth = 0.5;

  return (
    <group
      position={[-2.54, 1.9, 2.9]}
      rotation={[0.03, -Math.PI / 2.01, 0.05]}
    >
      <mesh position={[0, 0, -0.0051]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={bgTexture}
          side={THREE.DoubleSide}
          transparent
          opacity={1}
        />
      </mesh>

      <group position={[-paneWidth / 2, 0, 0]}>
        <group position={[-paneWidth / 2, 0, 0]} rotation={[0, openAngle, 0]}>
          <mesh position={[paneWidth / 2, 0, 0]}>
            <boxGeometry args={[0.5, 1, 0.05]} />
            <meshPhysicalMaterial
              color="#a0d8ff"
              transparent
              opacity={0.6}
              roughness={0.1}
              metalness={0.1}
              transmission={0.9}
              clearcoat={0.1}
            />
          </mesh>

          {(
            [
              [paneWidth / 1, 0, 0],
              [paneWidth / 1, 0, 0],
              [0, 0.5, 0],
              [0, -0.5, 0],
            ] as [number, number, number][]
          ).map((pos, i) => (
            <mesh key={`L${i}`} position={pos}>
              <boxGeometry
                args={i < 2 ? [0.03, 1, 0.05] : [paneWidth, 0.04, 0.05]}
              />
              <meshStandardMaterial
                map={frameTexture}
                roughness={0.6}
                metalness={0.2}
              />
            </mesh>
          ))}
        </group>
      </group>

      <group position={[paneWidth / 2, 0, 0]}>
        <mesh position={[0 / 2, 0, -0.01]}>
          <boxGeometry args={[paneWidth, 1, 0.02]} />
          <meshPhysicalMaterial
            color="#a0c4ff"
            transparent={true}
            opacity={0.32} // adjust for how frosted you want it
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {(
          [
            [-paneWidth / 2, 0, 0],
            [paneWidth / 2, 0, 0],
            [0, 0.5, 0],
            [0, -0.5, 0],
          ] as [number, number, number][]
        ).map((pos, i) => (
          <mesh key={`R${i}`} position={pos}>
            <boxGeometry
              args={i < 2 ? [0.03, 1, 0.05] : [paneWidth, 0.03, 0.05]}
            />
            <meshStandardMaterial
              map={frameTexture}
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* === OUTER FRAME === */}
      {(
        [
          [-0.5, 0, 0],
          [0.5, 0, 0],
          [0, 0.5, 0],
          [0, -0.5, 0],
        ] as [number, number, number][]
      ).map((pos, i) => (
        <mesh key={`O${i}`} position={pos}>
          <boxGeometry args={i < 2 ? [0.05, 1.05, 0.05] : [1.05, 0.05, 0.05]} />
          <meshStandardMaterial
            map={frameTexture}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      ))}

      <group position={[paneWidth / 2 + 0.03, 0, 0]}>
        {/* Handle Base */}
        <mesh position={[0.0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.06, 16]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        <mesh position={[-0.318, -0.548, 0]}>
          <boxGeometry args={[1.1, 0.04, 0.15]} />
          <meshStandardMaterial
            map={frameTexture}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        {/* Grip Ring */}
        <mesh position={[0, 0, 0.07]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.025, 0.006, 16, 32]} />
          <meshStandardMaterial
            color="#aaaaaa"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}
function FloorLamp() {
  const bulbRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.SpotLight>(null);
  const texture = useLoader(THREE.TextureLoader, "/fabrics/fabric-1.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

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
          map={texture}
          color="#bec4be"
          roughness={1.0}
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
        intensity={10}
        position={[3, 2.4, 0.21]}
        angle={Math.PI / 5}
        penumbra={0.3}
        color="#fff1c1"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        target-position={[0, 0.8, 0]}
      />
    </group>
  );
}

interface GLBPlantProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  url: string; // path to your glb
}

export function GLBPlant({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  url,
}: GLBPlantProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  return (
    <primitive
      ref={group}
      object={scene}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
}
const bookColors = [
  "#ff6b6b", // red
  "#4ecdc4", // teal
  "#ffe66d", // yellow
  "#1a535c", // dark teal
  "#ff9f1c", // orange
  "#2a9d8f", // green
  "#e63946", // pinkish
  "#8d99ae", // gray
  "#f4a261", // tan
  "#264653", // navy
];

function Bookshelf() {
  const textures = useLoader(THREE.TextureLoader, [
    "/fabrics/fabric-1.webp",
    "/fabrics/wood-1.webp",
  ]);

  const bookTexture = textures[0];
  const shelfTexture = textures[1];

  return (
    <group position={[3, 0.33, 0.6]}>
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
            map={shelfTexture}
            roughness={0.6}
            metalness={0.1}
          />
        </RoundedBox>
      ))}

      {/* Books */}
      {Array.from({ length: 18 }).map((_, i) => {
        const shelfLevel = Math.floor(i / 6);
        const y = 0.05 + shelfLevel * 0.8;

        const height = 0.15 + Math.random() * 0.15; // shorter books
        const width = 0.03 + Math.random() * 0.02;
        const depth = 0.08 + Math.random() * 0.03;

        const tiltY = Math.random() < 0.3 ? (Math.random() - 0.5) * 0.3 : 0;
        const tiltX = (Math.random() - 0.5) * 0.02;

        const x = -0.35 + Math.random() * 0.7;
        const z = -0.1 + Math.random() * 0.22;

        // Pick a color from the array (loop around if more books than colors)
        const color = bookColors[i % bookColors.length];

        return (
          <mesh
            key={i}
            position={[x, y + height / 2, z]}
            rotation={[tiltX, tiltY, 0]}
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              map={bookTexture}
              color={color}
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Desk() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const isDark = document.documentElement.classList.contains("dark");
  const texture = useLoader(THREE.TextureLoader, "/fabrics/wood-1.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  useFrame(() => {
    const isDark = document.documentElement.classList.contains("dark");
    if (lightRef.current) {
      lightRef.current.intensity = isDark ? 3.1 : 0;
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
          position={[1.12, 1.8, -0.46]}
          angle={Math.PI / 5.56}
          penumbra={0.3}
          color="#fff1c1"
          intensity={
            document.documentElement.classList.contains("dark") ? 16 : 1
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
        args={[3, 0.1, 1.5]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.95, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={texture} roughness={0.6} metalness={0.1} />
      </RoundedBox>

      {/* Legs */}
      {[-1.39, 1.39].map((x) =>
        [-0.68, 0.62].map((z, i) => (
          <mesh
            key={`${x}-${z}-${i}`}
            position={[x, 0.43, z]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry
              args={[0.056, 0.032, 0.99, 32]}
            ></cylinderGeometry>
            <meshStandardMaterial
              map={texture}
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>
        ))
      )}

      {[-1.36, 1.39].map((x) => (
        <mesh
          key={`bar-${x}`}
          position={[x, 0.73, 0]} // middle height
          rotation={[36, 36, -0.06]} // rotate along Z-axis
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.026, 0.02, 1.4, 13]} />
          <meshStandardMaterial map={texture} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

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
          args={[2.29, 1.353, 0.099]}
          radius={0.02}
          smoothness={3}
          position={[0, 0.8, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="black" roughness={0.4} metalness={0.3} />
        </RoundedBox>

        <RoundedBox
          args={[2.17, 1.24, 0.141]}
          radius={0.02}
          smoothness={3}
          position={[0.015, 0.8, 0]}
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
              position={[-0.4, 0.3, 1.3]}
              fontSize={0.195}
              color="black"
              onClick={() => router.push("/")}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "default")}
            >
              Home
            </Text>
            <Text
              position={[0.45, 0.3, 1.3]}
              fontSize={0.195}
              color="black"
              onClick={() => router.push("/projects")}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "default")}
            >
              My Work
            </Text>
            <Text
              position={[-0.4, 0, 1.3]}
              fontSize={0.195}
              color="black"
              onClick={() => router.push("/about")}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "default")}
            >
              About
            </Text>
            <Text
              position={[0.42, 0, 1.3]}
              fontSize={0.195}
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
            initial={{ opacity: 0, y: -0.2 }}
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

interface WallShadeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  intensity?: number; // 0 to 1
}

export function WallShade({
  position,
  rotation = [0, 0, 0],
  intensity = 0.08,
}: WallShadeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const isDark = document.documentElement.classList.contains("dark");
    const color = new THREE.Color(isDark ? "#000000" : "#111111");
    (meshRef.current.material as THREE.MeshStandardMaterial).color.copy(color);
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity =
      intensity;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        transparent
        opacity={intensity}
        roughness={1}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function RoomCorner() {
  const lineRefs = useRef<any[]>([]);

  useFrame(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const color = new THREE.Color(isDark ? "#4d4c4c" : "#d6d2d2");

    lineRefs.current.forEach((line) => {
      if (line?.material?.color) line.material.color.copy(color);
    });
  });

  return (
    <group position={[-2.6, 0, 0]}>
      {/* Lines */}
      {[
        // all line points
        [
          [0, 0, 0],
          [0, 3.6, 0],
        ],
        [
          [0, 0, 0],
          [16, 0, 0],
        ],
        [
          [0, 0, 0],
          [0, 0, 5],
        ],
        [
          [0, 3.6, 0],
          [16, 3.6, 0],
        ],
        [
          [0, 3.6, 0],
          [0, 3.9, 3],
        ],
      ].map((points, i) => (
        <Line
          key={i}
          ref={(el) => (lineRefs.current[i] = el)}
          points={points}
          lineWidth={1}
        />
      ))}
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
    camera.position.lerp(new THREE.Vector3(2.1, 1.6, 5.3 - progress * 3), 0.2);
    camera.lookAt(new THREE.Vector3(0.2, 0.8, 0));
  });

  return null;
}

function Floor() {
  const texture = useLoader(THREE.TextureLoader, "/fabrics/floor-2.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2); // repeat for larger floor area
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[2.42, -0, 4]}
      receiveShadow
    >
      <planeGeometry args={[10, 8]} />
      <meshStandardMaterial map={texture} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

function Wall() {
  const texture = useLoader(THREE.TextureLoader, "/fabrics/wall-4.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;

  const meshRef = useRef<THREE.Mesh>(null);

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, 3.32);
  shape.lineTo(0.6, 3.39);
  shape.lineTo(3.1, 3.7);
  shape.lineTo(3, 0);
  shape.lineTo(0, 0);

  const geometry = new THREE.ShapeGeometry(shape);

  useFrame(() => {
    if (!meshRef.current) return;
    const isDark = document.documentElement.classList.contains("dark");
    const color = new THREE.Color(isDark ? "#7d7c7c" : "white");
    (meshRef.current.material as THREE.MeshStandardMaterial).color.copy(color);
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[0, -Math.PI / 2, 0]}
      scale={[2, 1.43, 1]}
      position={[-2.6, 0, 0]}
    >
      <primitive object={geometry} />
      <meshStandardMaterial
        map={texture}
        roughness={0.7}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CoffeeSteam() {
  const particles = Array.from({ length: 10 });
  return (
    <group position={[-0.79, 1.2, 1.25]}>
      {particles.map((_, i) => (
        <Sphere key={i} args={[0.0026, 8, 8]} position={[0, i * 0.05, 0]}>
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.1 + i * 0.05}
          />
        </Sphere>
      ))}
    </group>
  );
}

function Wall2() {
  const texture = useLoader(THREE.TextureLoader, "/fabrics/wall-4.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;

  const meshRef = useRef<THREE.Mesh>(null);

  // Define a simple rectangular wall
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, 3.6);
  shape.lineTo(4, 3.6);
  shape.lineTo(4, 0);
  shape.lineTo(0, 0);

  const geometry = new THREE.ShapeGeometry(shape);

  useFrame(() => {
    if (!meshRef.current) return;
    const isDark = document.documentElement.classList.contains("dark");
    const color = new THREE.Color(isDark ? "#757474" : "#f7f7f5");
    (meshRef.current.material as THREE.MeshStandardMaterial).color.copy(color);
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[0, Math.PI, 0]}
      scale={[2.56, 1.32, 1]}
      position={[7.5, 0, 0]}
    >
      <primitive object={geometry} />
      <meshStandardMaterial
        map={texture}
        roughness={0.7}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0.25, 0.35], [1, 0]); // fades later and slower

  return (
    <section
      ref={ref}
      className="h-[167vh] md:h-[170vh] bg-[#c6c0c0] dark:bg-[#757474] text-black dark:text-stone-300"
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
          <fog attach="fog" args={["#e0e0e0", 4, 14]} />

          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <FloorLamp />
          <Desk />
          <Bookshelf />
          <GLBPlant
            url="/fabrics/glb-plant.glb"
            position={[2.22, 0.2, 2.1]} // adjust to match bookshelf
            scale={[1.22, 1.22, 1.22]}
          />
          <WindowOnWall />
          <Wall />
          <Wall2 />

          <Floor />
          <CoffeeSteam />
          <CoffeeMug />
          <Tablet />
          <CartoonModel scrollYProgress={scrollYProgress} />
          <Chair />
          <ComputerTower />
          <ScreenUI scrollYProgress={scrollYProgress} />
          <ScreenHint scrollYProgress={scrollYProgress} />
          <CameraController scrollYProgress={scrollYProgress} />
        </Canvas>

        <div className="absolute  z-50 text-2xl text-stone-100  md:text-3xl font-semibold  left-5 bottom-14  md:left-20">
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
