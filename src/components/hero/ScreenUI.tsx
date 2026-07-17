"use client";

import { Text } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { AnimatePresence, MotionValue } from "framer-motion";
import { motion } from "framer-motion-3d";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import * as THREE from "three";

import MiniGame from "./MiniGame";

type ScreenPage = "intro" | "clickAround" | "nav" | "game";

type ScreenButtonProps = {
  children: string;
  position: [number, number, number];
  onClick: () => void;
  fontSize?: number;
  align?: "left" | "center" | "right";
};

const SCREEN_CENTER: [number, number, number] = [0.015, 1.76, 0.69];

const ORIGINAL_GAME_POSITION: [number, number, number] = [0, 1.5, 6];

const CONTENT_Z = 0;

function setPointerCursor(active: boolean) {
  document.body.style.cursor = active ? "pointer" : "default";
}

function ScreenButton({
  children,
  position,
  onClick,
  fontSize = 0.14,
  align = "left",
}: ScreenButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.group
      position={position}
      animate={{
        scale: hovered ? 1.06 : 1,
      }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Text
        fontSize={fontSize}
        color={hovered ? "#111111" : "#202020"}
        anchorX={align}
        anchorY="middle"
        letterSpacing={-0.025}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          onClick();
        }}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          setHovered(true);
          setPointerCursor(true);
        }}
        onPointerOut={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          setHovered(false);
          setPointerCursor(false);
        }}
      >
        {children}
      </Text>
    </motion.group>
  );
}

function ScreenHeader({
  label,
  pageNumber,
}: {
  label: string;
  pageNumber: string;
}) {
  return (
    <group>
      <Text
        position={[-0.88, 0.45, CONTENT_Z]}
        fontSize={0.082}
        color="#181818"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {label.toUpperCase()}
      </Text>

      <Text
        position={[0.88, 0.45, CONTENT_Z]}
        fontSize={0.082}
        color="#181818"
        anchorX="right"
        anchorY="middle"
        letterSpacing={0.04}
      >
        {pageNumber}
      </Text>

      <mesh position={[0, 0.355, -0.002]}>
        <planeGeometry args={[1.76, 0.006]} />
        <meshBasicMaterial color="#181818" transparent opacity={0.38} />
      </mesh>
    </group>
  );
}

function IntroPage({ onNext }: { onNext: () => void }) {
  return (
    <motion.group
      key="intro"
      initial={{
        opacity: 0,
        y: -0.025,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 0.025,
      }}
      transition={{
        duration: 0.45,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <ScreenHeader label="Introduction" pageNumber="01 / 03" />

      <Text
        position={[-0.88, 0.23, CONTENT_Z]}
        fontSize={0.16}
        color="#151515"
        anchorX="left"
        anchorY="top"
        maxWidth={1.65}
        lineHeight={0.88}
        letterSpacing={-0.045}
      >
        {"Hey — I’m Jonas.\nDesigner and developer\nbased in Norway."}
      </Text>

      <Text
        position={[-0.88, -0.44, CONTENT_Z]}
        fontSize={0.068}
        color="#303030"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.015}
      >
        INTERACTIVE PORTFOLIO / 2026
      </Text>

      <ScreenButton
        position={[0.95, -0.43, CONTENT_Z]}
        align="right"
        fontSize={0.14}
        onClick={onNext}
      >
        NEXT →
      </ScreenButton>
    </motion.group>
  );
}

function ClickAroundPage({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <motion.group
      key="click-around"
      initial={{
        opacity: 0,
        y: 0.025,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -0.025,
      }}
      transition={{
        duration: 0.45,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <ScreenHeader label="How it works" pageNumber="02 / 03" />

      <Text
        position={[-0.88, 0.23, CONTENT_Z]}
        fontSize={0.151}
        color="#151515"
        anchorX="left"
        anchorY="top"
        maxWidth={1.67}
        lineHeight={0.9}
        letterSpacing={-0.04}
      >
        {"Explore the room.\nClick objects and discover\nsmall interactions."}
      </Text>

      <ScreenButton
        position={[-0.88, -0.4, CONTENT_Z]}
        align="left"
        fontSize={0.12}
        onClick={onBack}
      >
        ← BACK
      </ScreenButton>

      <ScreenButton
        position={[0.88, -0.4, CONTENT_Z]}
        align="right"
        fontSize={0.12}
        onClick={onNext}
      >
        CONTINUE →
      </ScreenButton>
    </motion.group>
  );
}

function NavigationPage({
  onBack,
  onGame,
  onNavigate,
}: {
  onBack: () => void;
  onGame: () => void;
  onNavigate: (route: string) => void;
}) {
  return (
    <motion.group
      key="navigation"
      initial={{
        opacity: 0,
        y: 0.025,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -0.025,
      }}
      transition={{
        duration: 0.45,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <ScreenHeader label="Navigation" pageNumber="03 / 03" />

      <Text
        position={[-0.88, 0.22, CONTENT_Z]}
        fontSize={0.08}
        color="#303030"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.015}
      >
        SELECT A DESTINATION
      </Text>

      <ScreenButton
        position={[-0.88, 0.03, CONTENT_Z]}
        fontSize={0.17}
        align="left"
        onClick={() => onNavigate("/projects")}
      >
        MY WORK
      </ScreenButton>

      <ScreenButton
        position={[-0.88, -0.18, CONTENT_Z]}
        fontSize={0.17}
        align="left"
        onClick={() => onNavigate("/about")}
      >
        ABOUT
      </ScreenButton>

      <ScreenButton
        position={[0.13, 0.03, CONTENT_Z]}
        fontSize={0.17}
        align="left"
        onClick={() => onNavigate("/contact")}
      >
        CONTACT
      </ScreenButton>

      <ScreenButton
        position={[0.13, -0.18, CONTENT_Z]}
        fontSize={0.17}
        align="left"
        onClick={onGame}
      >
        GAME
      </ScreenButton>

      <ScreenButton
        position={[-0.88, -0.42, CONTENT_Z]}
        fontSize={0.11}
        align="left"
        onClick={onBack}
      >
        ← PREVIOUS
      </ScreenButton>

      <Text
        position={[0.88, -0.42, CONTENT_Z]}
        fontSize={0.065}
        color="#303030"
        anchorX="right"
        anchorY="middle"
        letterSpacing={0.025}
      >
        JONASNYGAARD.COM
      </Text>
    </motion.group>
  );
}

export default function ScreenUI({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const router = useRouter();

  const screenGroupRef = useRef<THREE.Group>(null);
  const gameGroupRef = useRef<THREE.Group>(null);

  const [page, setPage] = useState<ScreenPage>("intro");

  useFrame(() => {
    const progress = scrollYProgress.get();

    if (screenGroupRef.current) {
      screenGroupRef.current.position.z =
        SCREEN_CENTER[2] + (1 - progress) * 0.012;

      screenGroupRef.current.rotation.y = Math.sin(progress * Math.PI) * 0.003;
    }

    if (gameGroupRef.current) {
      gameGroupRef.current.position.z = -0.55 + (1 - progress) * 0.2;

      gameGroupRef.current.rotation.y = Math.sin(progress * Math.PI) * 0.02;
    }
  });

  const navigateTo = (route: string) => {
    setPointerCursor(false);
    router.push(route);
  };

  const openGame = () => {
    setPointerCursor(false);
    setPage("game");
  };

  const closeGame = () => {
    setPointerCursor(false);
    setPage("nav");
  };

  return (
    <>
      {page !== "game" && (
        <group ref={screenGroupRef} position={SCREEN_CENTER}>
          <AnimatePresence mode="wait">
            {page === "clickAround" ? (
              <ClickAroundPage
                key="click-around"
                onBack={() => setPage("intro")}
                onNext={() => setPage("nav")}
              />
            ) : page === "nav" ? (
              <NavigationPage
                key="navigation"
                onBack={() => setPage("clickAround")}
                onGame={openGame}
                onNavigate={navigateTo}
              />
            ) : (
              <IntroPage key="intro" onNext={() => setPage("clickAround")} />
            )}
          </AnimatePresence>
        </group>
      )}

      <AnimatePresence>
        {page === "game" && (
          <group ref={gameGroupRef} position={ORIGINAL_GAME_POSITION}>
            <motion.group
              key="game"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
            >
              <MiniGame onExit={closeGame} />
            </motion.group>
          </group>
        )}
      </AnimatePresence>
    </>
  );
}
