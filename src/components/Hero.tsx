"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Text, RoundedBox, useGLTF } from "@react-three/drei";
import { useScroll, MotionValue, AnimatePresence } from "framer-motion";
import { motion } from "framer-motion-3d";
import { useTransform, motion as regMotion } from "framer-motion";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import DarkModeBtn from "./DarkModeBtn";
import useDarkMode from "@/hooks/useDarkMode";

function CartoonModel({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const { scene } = useGLTF("/me-cartoon.glb");
  const group = useRef<THREE.Group>(null);

  const bones = useRef<{
    hip?: THREE.Object3D;
    leftLeg?: THREE.Object3D;
    rightLeg?: THREE.Object3D;
    spine?: THREE.Object3D;
    rightArm?: THREE.Object3D;
  }>({});

  useEffect(() => {
    if (!group.current) return;
    bones.current.hip = group.current.getObjectByName("Hips");
    bones.current.leftLeg = group.current.getObjectByName("LeftLeg");
    bones.current.rightLeg = group.current.getObjectByName("RightLeg");
    bones.current.spine = group.current.getObjectByName("Spine");
    bones.current.rightArm = group.current.getObjectByName("RightArm");

    // Set static rotations once
    if (bones.current.hip) bones.current.hip.rotation.x = -Math.PI / 3.8;
    if (bones.current.leftLeg) bones.current.leftLeg.rotation.x = -Math.PI / 2;
    if (bones.current.rightLeg)
      bones.current.rightLeg.rotation.x = -Math.PI / 3;
    if (bones.current.spine) bones.current.spine.rotation.x = Math.PI / 4;
    if (bones.current.rightArm) {
      bones.current.rightArm.rotation.x = Math.PI / 2.3;
      bones.current.rightArm.rotation.z = -Math.PI / 13;
    }
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.getElapsedTime();

    // Smooth floating animation
    group.current.position.y = -0.45 + Math.sin(t * 1.2) * 0.008;
    group.current.rotation.y = Math.PI + Math.sin(t * 0.3) * 0.009;

    // Scroll-based arm lift (cheap, per frame)
    const progress = scrollYProgress.get();
    if (bones.current.rightArm) {
      bones.current.rightArm.rotation.y = (Math.PI / 1.9) * progress;
    }
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

function WallShelfWithCandle() {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  return (
    <group position={[-0.79, 2.73, 0.15]} rotation={[0, 0, 0]}>
      {/* Shelf board */}
      <RoundedBox args={[1.2, 0.06, 0.3]} radius={0.02} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={"#3d3936"}
          roughness={0.6}
          metalness={0.2}
        />
      </RoundedBox>

      {/* Candle base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.4, 4]} />{" "}
        <meshStandardMaterial color="#fffaf0" roughness={0.7} />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 0.43, 0]}>
        {" "}
        <cylinderGeometry args={[0.005, 0.005, 0.03, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.5, 0]}>
        {" "}
        <sphereGeometry args={[0.02, 2, 1]} />
        <meshStandardMaterial
          color="#ffcc33"
          emissive="#ff8800"
          emissiveIntensity={1}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Light emitted by candle */}
      <pointLight
        ref={lightRef}
        position={[0, 0.6, 0]}
        color="#ffb347"
        intensity={0.4}
        distance={1.4}
        decay={0.6}
      />
    </group>
  );
}

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
        smoothness={2.5}
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
          position={[x, 0.61, 2.8]}
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
          position={[x, 0.36, 2.8]}
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
        args={[1.015, 0.36, 0.08]}
        radius={0.05}
        smoothness={1}
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

      {/* Legs  */}
      {[-0.4, 0.4].map((x, i) =>
        [-0.25, 0.25].map((z, j) => (
          <mesh
            key={`${x}-${z}-${i}-${j}`}
            position={[x, 0.35, z + 2.8]}
            rotation={[-0.13, 0, 0]}
            castShadow
            receiveShadow
          >
            {/* rectangular bea */}
            <boxGeometry args={[0.032, 0.72, 0.08]} />
            <meshStandardMaterial map={wood} roughness={0.5} metalness={0.2} />
          </mesh>
        ))
      )}

      {/* Side bars */}
      {[-0.26, 0.256].map((y, i) => (
        <mesh key={i} position={[0.0, 0.57, y + 2.78]} castShadow receiveShadow>
          <boxGeometry args={[0.86, 0.03, 0.05]} />
          <meshStandardMaterial map={wood} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function ComputerTower() {
  return (
    <group rotation={[0, Math.PI / -2, 0]} position={[1.47, 0.3, 0.9]}>
      {/* Tower Body */}
      <RoundedBox
        args={[0.4, 0.6, 0.175]}
        radius={0.03}
        smoothness={2}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={"#706360"}
          roughness={0.6}
          metalness={0.3}
        />
      </RoundedBox>

      {/* Power Button */}
      <mesh position={[0.29, 0.3, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 2]} />
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
    </group>
  );
}

export function Tablet() {
  const images = ["/desk1-01.webp", "/desk1-03.webp"];
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
      <RoundedBox args={[0.42, 0.3, 0]} radius={0.02} castShadow receiveShadow>
        <meshStandardMaterial color="#21261f" roughness={0.6} metalness={0.2} />
      </RoundedBox>

      {/* Next Image */}
      <mesh position={[0, 0.002, 0.03]}>
        <planeGeometry args={[0.366, 0.235]} />
        <meshStandardMaterial
          map={textures[nextImageIndex]}
          transparent
          opacity={fade}
        />
      </mesh>
    </group>
  );
}

interface ScreenHintProps {
  scrollYProgress: MotionValue<number>;
}

function ScreenHint({ scrollYProgress }: ScreenHintProps) {
  const textRef = useRef<THREE.Mesh>(null);
  const cylinderRef = useRef<THREE.Mesh>(null);
  const arrowRef = useRef<THREE.Mesh>(null);

  const isDark = useDarkMode();

  const opacity = useTransform(
    scrollYProgress,
    [0.05, 0.15, 0.8, 0.95],
    [0, 1, 1, 0]
  );

  useFrame(() => {
    const o = opacity.get();
    const color = new THREE.Color(isDark ? "#ffffff" : "#000000");

    [textRef, arrowRef, cylinderRef].forEach((ref) => {
      if (ref.current) {
        const mat = ref.current.material as THREE.MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = o;
        mat.color.copy(color);
      }
    });
  });

  return (
    <group position={[0.39, 2.9, 0.43]}>
      {/* Cylinder */}
      <mesh
        ref={cylinderRef}
        position={[0.08, -0.19, 0]}
        rotation={[-Math.PI / 5 - 6, 2.4, 4.2]}
      >
        <cylinderGeometry args={[0.023, 0.023, 0.23, 2]} />
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

function WindowOnWall() {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const checkDarkMode = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const [lightView, darkView] = useLoader(THREE.TextureLoader, [
    "/light-window.webp",
    "/dark-win.webp",
  ]);

  useEffect(() => {
    if (!lightView || !darkView) return;

    const setupTexture = (tex: THREE.Texture) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.x = -1;
      tex.offset.x = 1;
      tex.needsUpdate = true;
    };

    setupTexture(lightView);
    setupTexture(darkView);
  }, [lightView, darkView]);

  const bgTexture = isDark ? darkView : lightView;

  const openAngle = Math.PI / 2.7;
  const paneWidth = 0.5;

  return (
    <group
      position={[-2.54, 1.9, 2.9]}
      rotation={[0.03, -Math.PI / 2.01, 0.05]}
    >
      {/* Background image */}
      {bgTexture && (
        <mesh position={[0, 0, -0.0051]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={bgTexture}
            side={THREE.DoubleSide}
            transparent
            opacity={1}
          />
        </mesh>
      )}

      {/* Left Pane */}
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

          {[
            [paneWidth / 1, 0, 0],
            [paneWidth / 1, 0, 0],
            [0, 0.5, 0],
            [0, -0.5, 0],
          ].map((pos, i) => (
            <mesh key={`L${i}`} position={pos as [number, number, number]}>
              <boxGeometry
                args={i < 2 ? [0.03, 1, 0.05] : [paneWidth, 0.04, 0.05]}
              />
              <meshStandardMaterial
                color="#656b66"
                roughness={0.6}
                metalness={0.2}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Right Pane */}
      <group position={[paneWidth / 2, 0, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[paneWidth, 1, 0.02]} />
          <meshPhysicalMaterial
            color="#a0c4ff"
            transparent
            opacity={0.32}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {[
          [-paneWidth / 2, 0, 0],
          [paneWidth / 2, 0, 0],
          [0, 0.5, 0],
          [0, -0.5, 0],
        ].map((pos, i) => (
          <mesh key={`R${i}`} position={pos as [number, number, number]}>
            <boxGeometry
              args={i < 2 ? [0.03, 1, 0.05] : [paneWidth, 0.03, 0.05]}
            />
            <meshStandardMaterial
              color="#656b66"
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Outer Frame */}
      {[
        [-0.5, 0, 0],
        [0.5, 0, 0],
        [0, 0.5, 0],
        [0, -0.5, 0],
      ].map((pos, i) => (
        <mesh key={`O${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={i < 2 ? [0.05, 1.05, 0.05] : [1.05, 0.05, 0.05]} />
          <meshStandardMaterial
            color="#656b66"
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Handle */}
      <group position={[paneWidth / 2 + 0.03, 0, 0]}>
        <mesh position={[-0.3, -0.55, 0]}>
          <boxGeometry args={[1.07, 0.04, 0.15]} />
          <meshStandardMaterial
            color="#656b66"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        <mesh position={[0, 0, 0.07]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.025, 0.006, 16, 32]} />
          <meshStandardMaterial
            color="#656b66"
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

  let last = 0;
  useFrame(({ clock }) => {
    if (clock.getElapsedTime() - last < 0.05) return; // skip most frames
    last = clock.getElapsedTime();
    const t = clock.getElapsedTime();
    const isDark = document.documentElement.classList.contains("dark");

    if (bulbRef.current) {
      const material = bulbRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = isDark ? 2 + Math.sin(t * 3) * 0.3 : 0.05;
    }

    if (lightRef.current) {
      lightRef.current.intensity = isDark ? 15 + Math.sin(t * 3) * 0.6 : 0;
    }
  });

  return (
    <group position={[1.6, 0, 0.66]}>
      {/* Base */}
      <mesh receiveShadow position={[0.7, 0, -0.4]}>
        <cylinderGeometry args={[0.18, 0.26, 0.07, 14]} />
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
        <cylinderGeometry args={[0.35, 0.4, 0.3, 17, 1, true]} />
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
        <sphereGeometry args={[0.07, 10, 10]} />
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
        intensity={0.6}
        position={[3, 2.4, 0.6]}
        angle={Math.PI / 5}
        penumbra={0.3}
        color="#fff1c1"
        castShadow={false}
        target-position={[0, 0.6, 0]}
      />
    </group>
  );
}

const bookColors = [
  "#ff6b6b", // red
  "#4ecdc4", // teal
  "#ffe66d", // yellow
  "#1a535c", // dark teal
  "#ff9f1c", // orange
  "#2a9d8f", // green
  "#8d99ae", // gray
  "#f4a261", // tan
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
          smoothness={1}
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

        const height = 0.15 + Math.random() * 0.15;
        const width = 0.03 + Math.random() * 0.02;
        const depth = 0.08 + Math.random() * 0.03;

        const tiltY = Math.random() < 0.3 ? (Math.random() - 0.5) * 0.3 : 0;
        const tiltX = (Math.random() - 0.5) * 0.02;

        const x = -0.35 + Math.random() * 0.7;
        const z = -0.1 + Math.random() * 0.22;

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
  const isDark = useDarkMode();
  const texture = useLoader(THREE.TextureLoader, "/fabrics/wood-1.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  useEffect(() => {
    const updateLight = () => {
      const isDark = document.documentElement.classList.contains("dark");
      if (lightRef.current) {
        lightRef.current.intensity = isDark ? 3.1 : 0;
      }
    };

    updateLight();

    const observer = new MutationObserver(updateLight);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
  return (
    <group position={[0, 0, 1.2]}>
      {/* Keyboard */}
      <group position={[-0.1, 1, 0]}>
        {/* Keyboard Base */}
        <RoundedBox
          args={[0.8, 0.04, 0.3]}
          radius={0.02}
          smoothness={2}
          castShadow={false}
          receiveShadow
        >
          <meshStandardMaterial
            color="#C0C9B8"
            roughness={0.6}
            metalness={0.1}
          />
        </RoundedBox>
      </group>

      {/* Desk Lamp with Light */}
      <group position={[1.1, 1.05, -0.5]}>
        {/* Warm Lamp Light */}
        <spotLight
          ref={lightRef}
          position={[1.12, 1.8, -0.46]}
          angle={Math.PI / 5.56}
          penumbra={0.3}
          color="#fff1c1"
          intensity={
            document.documentElement.classList.contains("dark") ? 1.8 : 0
          } // boost
          castShadow={false}
        />
      </group>

      {/* Mouse */}
      <group position={[0.5, 1, 0]}>
        {/* Body */}
        <mesh castShadow={false} receiveShadow scale={[0.7, 0.5, 2]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#C0C9B8"
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Scroll Wheel */}
        <mesh position={[0.01, 0.063, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.08, 6]} />
          <meshStandardMaterial color="black" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* Desk Top */}
      <RoundedBox
        args={[3, 0.06, 1.5]}
        radius={0.01}
        smoothness={2.5}
        position={[0, 0.95, 0]}
        castShadow={false}
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
              args={[0.056, 0.022, 0.99, 10]}
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
          position={[x, 0.73, 0]}
          rotation={[36, 36, -0.06]}
          castShadow={false}
          receiveShadow
        >
          <cylinderGeometry args={[0.026, 0.02, 1.4, 13]} />
          <meshStandardMaterial map={texture} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0, 0.96, -0.6]}>
        <mesh position={[0, 0.4, 0]} castShadow={false} receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.8]} />
          <meshStandardMaterial
            color="#333333"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>

        <mesh position={[0, 0, 0]} castShadow={false} receiveShadow={false}>
          <cylinderGeometry args={[0.15, 0.15, 0.03]} />
          <meshStandardMaterial color="black" roughness={0.5} metalness={0.3} />
        </mesh>

        <RoundedBox
          args={[2.29, 1.353, 0.099]}
          radius={0.02}
          smoothness={2}
          position={[0, 0.8, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="black" roughness={0.4} metalness={0.3} />
        </RoundedBox>

        <RoundedBox
          args={[2.17, 1.24, 0.141]}
          radius={0.02}
          smoothness={2}
          position={[0.015, 0.8, 0]}
        ></RoundedBox>

        <mesh position={[0, 0.8, 0.07]}>
          <planeGeometry args={[1.9, 1.19]} />
          <meshStandardMaterial
            color={isDark ? "#f5f5f5" : "#fafafa"}
            emissive={isDark ? "#fff6d0" : "#ffffff"}
            emissiveIntensity={isDark ? 2 : 0.2}
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
              position={[0.45, 0.37, 1.3]}
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
              position={[0.42, 0.035, 1.3]}
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
  const isDark = useDarkMode();

  useEffect(() => {
    if (!meshRef.current) return;

    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    const color = new THREE.Color(isDark ? "#000000" : "#111111");
    material.color.copy(color);
    material.opacity = intensity;
    material.transparent = true;
  }, [isDark, intensity]);

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

function CameraController({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const progress = scrollYProgress.get();
    camera.position.lerp(new THREE.Vector3(2.1, 1.6, 4.9 - progress * 3), 0.2);
    camera.lookAt(new THREE.Vector3(0.2, 0.8, 0));
  });

  return null;
}

function Floor() {
  const texture = useLoader(THREE.TextureLoader, "/fabrics/floor-2.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[1.62, -0, 2.08]}
      receiveShadow
    >
      <planeGeometry args={[8.43, 4.8]} />
      <meshStandardMaterial map={texture} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

function Wall() {
  const texture = useLoader(THREE.TextureLoader, "/fabrics/stone-wall2.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;

  const meshRef = useRef<THREE.Mesh | null>(null);
  const isDark = useDarkMode();

  // create shape geometry once (no need to recreate on every render)
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, 3.32);
  shape.lineTo(0.6, 3.39);
  shape.lineTo(3.1, 3.7);
  shape.lineTo(3, 0);
  shape.lineTo(0, 0);

  // Update color when isDark changes — this uses react state so it's reliable
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const applyColorToMaterial = (mat: any, colorHex: string) => {
      try {
        if (!mat) return;
        if (mat.color) mat.color.set(colorHex);
        if (mat.emissive) {
          // if you want emissive changes too, adjust here
          // mat.emissive.set(isDark ? "#111111" : "#000000")
        }
        // rarely needed but safe to set
        mat.needsUpdate = true;
      } catch (e) {
        // defensive: some users put weird material types
        console.warn("Failed to set material color", e);
      }
    };

    const color = isDark ? "#7d7c7c" : "#ffffff";

    const mat = mesh.material as any;
    if (Array.isArray(mat)) {
      mat.forEach((m) => applyColorToMaterial(m, color));
    } else {
      applyColorToMaterial(mat, color);
    }
  }, [isDark]);

  return (
    <mesh
      ref={meshRef}
      rotation={[0, -Math.PI / 2, 0]}
      scale={[1.5, 1.43, 1]}
      position={[-2.6, 0, 0]}
    >
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.7}
        metalness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Wall2() {
  const texture = useLoader(THREE.TextureLoader, "/fabrics/stone-wall2.webp");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;

  const meshRef = useRef<THREE.Mesh>(null);
  const isDark = useDarkMode();

  // Define a simple rectangular wall
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, 3.6);
  shape.lineTo(4, 3.6);
  shape.lineTo(4, 0);
  shape.lineTo(0, 0);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const applyColorToMaterial = (mat: any, colorHex: string) => {
      try {
        if (!mat) return;
        if (mat.color) mat.color.set(colorHex);
        if (mat.emissive) {
          // if you want emissive changes too, adjust here
          // mat.emissive.set(isDark ? "#111111" : "#000000")
        }
        // rarely needed but safe to set
        mat.needsUpdate = true;
      } catch (e) {
        // defensive: some users put weird material types
        console.warn("Failed to set material color", e);
      }
    };

    const color = isDark ? "#7d7c7c" : "#ffffff";

    const mat = mesh.material as any;
    if (Array.isArray(mat)) {
      mat.forEach((m) => applyColorToMaterial(m, color));
    } else {
      applyColorToMaterial(mat, color);
    }
  }, [isDark]);

  return (
    <mesh
      ref={meshRef}
      rotation={[0, Math.PI, 0]}
      scale={[2.1, 1.32, 1]}
      position={[5.8, 0, 0]}
    >
      <shapeGeometry args={[shape]} />
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

  const opacity = useTransform(scrollYProgress, [0.2, 0.26], [1, 0]); // fades later and slower

  return (
    <section
      ref={ref}
      className="h-[155vh] md:h-[140vh]  bg-[#c6c0c0] dark:bg-[#757474] text-black dark:text-stone-300"
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
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <FloorLamp />
          <Desk />
          <Suspense fallback={null}>
            <Bookshelf />
          </Suspense>
          <Suspense fallback={null}>
            <WindowOnWall />
          </Suspense>
          <Wall />
          <Wall2 />
          <WallShelfWithCandle />
          <Floor />
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
