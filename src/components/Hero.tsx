"use client";

import { useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { memo, Suspense, useEffect, useRef, useState } from "react";

import DarkModeBtn from "./DarkModeBtn";
import Bird from "./hero/Bird";
import Bookshelf from "./hero/BookShelf";
import { CameraController } from "./hero/CameraController";
import Chair from "./hero/Chair";
import Chest from "./hero/Chest";
import Clock from "./hero/Clock";
import ComputerTower from "./hero/ComputerTower";
import Curtain from "./hero/Curtain";
import Desk from "./hero/Desk";
import Floor from "./hero/Floor";
import FloorLamp from "./hero/FloorLamp";
import Plant from "./hero/Plant";
import RecordPlayer from "./hero/RecordPlayer";
import ScreenUI from "./hero/ScreenUI";
import Skateboard from "./hero/Skateboard";
import Wall from "./hero/Wall";
import Wall2 from "./hero/Wall2";
import WallShelfWithCandle from "./hero/WallShelfWithCandle";
import WindowOnWall from "./hero/WindowOnWall";

const CAMERA_STOP_PROGRESS = 0.53;

type SceneCanvasProps = {
  scrollYProgress: MotionValue<number>;
  monitorFocused: boolean;
};

const SceneCanvas = memo(function SceneCanvas({
  scrollYProgress,
  monitorFocused,
}: SceneCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      shadows={false}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{
        near: 0.1,
        far: 50,
      }}
      resize={{
        debounce: {
          scroll: 100,
          resize: 100,
        },
      }}
    >
      <ambientLight intensity={0.45} />

      <directionalLight position={[5, 5, 5]} intensity={1} castShadow={false} />

      <Suspense fallback={null}>
        <FloorLamp />
        <Desk />
        <Bookshelf />
        <WindowOnWall />

        <Wall />
        <Wall2 />

        <Plant />
        <Bird />
        <Chest />
        <Curtain />

        <WallShelfWithCandle />
        <Floor />
        <Clock />
        <Chair />
        <Skateboard />
        <RecordPlayer />
        <ComputerTower />

        <ScreenUI scrollYProgress={scrollYProgress} />

        <CameraController
          scrollYProgress={scrollYProgress}
          monitorFocused={monitorFocused}
        />
      </Suspense>
    </Canvas>
  );
});

const HOME_SCENE_READY_EVENT = "home-scene-ready";
const HOME_SCENE_READY_ATTRIBUTE = "data-home-scene-ready";

function HomeSceneReadyBridge() {
  const { active, loaded, total } = useProgress();
  const hasReportedReady = useRef(false);

  useEffect(() => {
    const sceneIsReady = !active && total > 0 && loaded >= total;

    if (!sceneIsReady || hasReportedReady.current) {
      return;
    }

    hasReportedReady.current = true;

    document.documentElement.setAttribute(HOME_SCENE_READY_ATTRIBUTE, "true");

    window.dispatchEvent(new Event(HOME_SCENE_READY_EVENT));
  }, [active, loaded, total]);

  return null;
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isAtEndRef = useRef(false);

  const [isAtEnd, setIsAtEnd] = useState(false);
  const [monitorFocused, setMonitorFocused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIsAtEnd = latest >= CAMERA_STOP_PROGRESS;

    if (nextIsAtEnd === isAtEndRef.current) {
      return;
    }

    isAtEndRef.current = nextIsAtEnd;
    setIsAtEnd(nextIsAtEnd);
  });

  const showFocusButton = isAtEnd || monitorFocused;

  const toggleMonitorFocus = () => {
    setMonitorFocused((current) => !current);
  };

  return (
    <>
      <HomeSceneReadyBridge />

      <section
        ref={sectionRef}
        className="
          h-[178vh]
          bg-[#c6c0c0]
          text-black
          dark:bg-[#757474]
          dark:text-stone-300
          md:h-[158vh]
        "
      >
        <div className="sticky top-0 flex h-screen items-center justify-center">
          <SceneCanvas
            scrollYProgress={scrollYProgress}
            monitorFocused={monitorFocused}
          />

          {/* Desktop */}
          <button
            type="button"
            onClick={toggleMonitorFocus}
            className={`
              absolute left-[67%] top-[47%] z-50
              hidden items-center gap-3 whitespace-nowrap
              rounded-full border border-black/20
              bg-white/90 px-5 py-3
              text-[11px] font-semibold uppercase
              tracking-[0.12em] text-black
              shadow-lg backdrop-blur-md
              transition-all duration-500 ease-out
              hover:scale-105 hover:bg-black hover:text-white
              dark:border-white/20 dark:bg-black/85 dark:text-white
              dark:hover:bg-white dark:hover:text-black
              md:flex
              ${
                showFocusButton
                  ? "pointer-events-auto translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-4 opacity-0"
              }
            `}
          >
            {monitorFocused ? "Exit full screen" : "Full screen"}

            <span className="text-base leading-none" aria-hidden="true">
              {monitorFocused ? "↙" : "↗"}
            </span>
          </button>

          {/* Mobil */}
          <button
            type="button"
            onClick={toggleMonitorFocus}
            className={`
              absolute bottom-24 left-1/2 z-50
              flex -translate-x-1/2 items-center gap-3
              whitespace-nowrap rounded-full
              border border-black/20 bg-white/90
              px-5 py-3 text-[11px] font-semibold
              uppercase tracking-[0.12em] text-black
              shadow-lg backdrop-blur-md
              transition-all duration-500 ease-out
              md:hidden
              ${
                showFocusButton
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-4 opacity-0"
              }
            `}
          >
            {monitorFocused ? "Exit full screen" : "Full screen"}
          </button>

          <div className="absolute right-5 z-50 hidden md:top-1/2 md:block md:-translate-y-1/2">
            <DarkModeBtn />
          </div>

          <div className="absolute bottom-12 right-5 z-50 md:hidden">
            <DarkModeBtn />
          </div>
        </div>
      </section>
    </>
  );
}
