"use client";

import { Image, Text } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { AnimatePresence, MotionValue } from "framer-motion";
import { motion } from "framer-motion-3d";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

const MONTSERRAT_REGULAR =
  "https://cdn.jsdelivr.net/gh/JulietaUla/Montserrat@master/fonts/ttf/Montserrat-Regular.ttf";

const MONTSERRAT_SEMIBOLD =
  "https://cdn.jsdelivr.net/gh/JulietaUla/Montserrat@master/fonts/ttf/Montserrat-SemiBold.ttf";

const MONTSERRAT_BOLD =
  "https://cdn.jsdelivr.net/gh/JulietaUla/Montserrat@master/fonts/ttf/Montserrat-Bold.ttf";

function setPointerCursor(active: boolean) {
  if (typeof document === "undefined") return;

  const cursor = active ? "pointer" : "";

  document.body.style.cursor = cursor;
  document.documentElement.style.cursor = cursor;
}

function ScreenButton({
  children,
  position,
  onClick,
  fontSize,
  align = "left",
}: ScreenButtonProps) {
  const [hovered, setHovered] = useState(false);

  const resetPointer = () => {
    setHovered(false);
    setPointerCursor(false);
  };

  useEffect(() => {
    return () => {
      setPointerCursor(false);
    };
  }, []);

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
        font={MONTSERRAT_SEMIBOLD}
        color={hovered ? "#111111" : "#202020"}
        anchorX={align}
        anchorY="middle"
        letterSpacing={-0.025}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();

          resetPointer();
          onClick();
        }}
        onPointerEnter={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();

          setHovered(true);
          setPointerCursor(true);
        }}
        onPointerLeave={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          resetPointer();
        }}
        onPointerOut={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          resetPointer();
        }}
        onPointerCancel={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          resetPointer();
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
        position={[-0.88, 0.5, CONTENT_Z]}
        font={MONTSERRAT_SEMIBOLD}
        fontSize={0.065}
        color="#181818"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {label.toUpperCase()}
      </Text>

      <Text
        position={[0.88, 0.5, CONTENT_Z]}
        font={MONTSERRAT_SEMIBOLD}
        fontSize={0.065}
        color="#181818"
        anchorX="right"
        anchorY="middle"
        letterSpacing={0.04}
      >
        {pageNumber}
      </Text>

      <mesh position={[0, 0.44, -0.002]}>
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
      <ScreenHeader label="Profile" pageNumber="01 / 03" />

      <group position={[-0.88, 0.27, CONTENT_Z]}>
        <Text
          position={[0, -0.05, 0]}
          font={MONTSERRAT_BOLD}
          fontSize={0.18}
          color="#151515"
          anchorX="left"
          anchorY="top"
          maxWidth={0.95}
          lineHeight={0.9}
          letterSpacing={-0.025}
        >
          {"JONAS\nNYGAARD"}
        </Text>

        <Text
          position={[0, -0.41, 0]}
          font={MONTSERRAT_SEMIBOLD}
          fontSize={0.066}
          color="#292929"
          anchorX="left"
          anchorY="top"
          lineHeight={1.35}
          letterSpacing={0.015}
        >
          {"DESIGNER / DEVELOPER\nBASED IN OSLO, NORWAY"}
        </Text>
      </group>

      <Image
        url="/jonas-0003.jpg"
        position={[0.7, 0.1, CONTENT_Z - 0.002]}
        scale={[0.5, 0.6, 1]}
        transparent
      />

      <Text
        position={[0.45, -0.25, CONTENT_Z]}
        font={MONTSERRAT_REGULAR}
        fontSize={0.038}
        color="#424242"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.05}
      >
        PORTRAIT / 2026
      </Text>

      <Text
        position={[-0.88, -0.435, CONTENT_Z]}
        font={MONTSERRAT_REGULAR}
        fontSize={0.055}
        color="#303030"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.025}
      >
        JONASNYGAARD.COM
      </Text>

      <ScreenButton
        position={[0.88, -0.435, CONTENT_Z]}
        align="right"
        fontSize={0.125}
        onClick={onNext}
      >
        EXPLORE →
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
        font={MONTSERRAT_REGULAR}
        fontSize={0.151}
        color="#151515"
        anchorX="left"
        anchorY="top"
        maxWidth={1.8}
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
        font={MONTSERRAT_REGULAR}
        fontSize={0.08}
        color="#303030"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.015}
      >
        SELECT A DESTINATION
      </Text>

      <ScreenButton
        position={[-0.8, 0.03, CONTENT_Z]}
        fontSize={0.13}
        align="left"
        onClick={() => onNavigate("/projects")}
      >
        MY WORK
      </ScreenButton>

      <ScreenButton
        position={[-0.8, -0.18, CONTENT_Z]}
        fontSize={0.13}
        align="left"
        onClick={() => onNavigate("/about")}
      >
        ABOUT
      </ScreenButton>

      <ScreenButton
        position={[0.25, 0.03, CONTENT_Z]}
        fontSize={0.13}
        align="left"
        onClick={() => onNavigate("/contact")}
      >
        CONTACT
      </ScreenButton>

      <ScreenButton
        position={[0.25, -0.18, CONTENT_Z]}
        fontSize={0.13}
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
        font={MONTSERRAT_REGULAR}
        fontSize={0.065}
        color="#303030"
        anchorX="right"
        anchorY="middle"
        letterSpacing={0.025}
      >
        LET&apos;S COLLABORATE
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

  useEffect(() => {
    const resetCursor = () => {
      setPointerCursor(false);
    };

    resetCursor();

    window.addEventListener("pageshow", resetCursor);
    window.addEventListener("popstate", resetCursor);

    return () => {
      resetCursor();

      window.removeEventListener("pageshow", resetCursor);
      window.removeEventListener("popstate", resetCursor);
    };
  }, []);

  useEffect(() => {
    setPointerCursor(false);
  }, [page]);

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

  const changePage = (nextPage: ScreenPage) => {
    setPointerCursor(false);
    setPage(nextPage);
  };

  const navigateTo = (route: string) => {
    setPointerCursor(false);
    router.push(route);
  };

  const openGame = () => {
    changePage("game");
  };

  const closeGame = () => {
    changePage("nav");
  };

  return (
    <>
      {page !== "game" && (
        <group ref={screenGroupRef} position={SCREEN_CENTER}>
          <AnimatePresence mode="wait">
            {page === "clickAround" ? (
              <ClickAroundPage
                key="click-around"
                onBack={() => changePage("intro")}
                onNext={() => changePage("nav")}
              />
            ) : page === "nav" ? (
              <NavigationPage
                key="navigation"
                onBack={() => changePage("clickAround")}
                onGame={openGame}
                onNavigate={navigateTo}
              />
            ) : (
              <IntroPage key="intro" onNext={() => changePage("clickAround")} />
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
