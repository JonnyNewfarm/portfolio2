"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { Suspense, useRef, useState } from "react";

import DarkModeBtn from "./DarkModeBtn";
import FloorLamp from "./hero/FloorLamp";
import Desk from "./hero/Desk";
import Curtain from "./hero/Curtain";
import Bookshelf from "./hero/BookShelf";
import WindowOnWall from "./hero/WindowOnWall";
import Wall from "./hero/Wall";
import Wall2 from "./hero/Wall2";
import WallShelfWithCandle from "./hero/WallShelfWithCandle";
import Floor from "./hero/Floor";
import ScreenUI from "./hero/ScreenUI";
import ScreenHint from "./hero/ScreenHint";
import { CameraController } from "./hero/CameraController";
import Skateboard from "./hero/Skateboard";
import RecordPlayer from "./hero/RecordPlayer";
import ComputerTower from "./hero/ComputerTower";
import Plant from "./hero/Plant";
import Clock from "./hero/Clock";
import Bird from "./hero/Bird";
import Chest from "./hero/Chest";
import Cloud from "./hero/Cloud";
import Chair from "./hero/Chair";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [monitorFocused, setMonitorFocused] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const CAMERA_STOP_PROGRESS = 0.68;
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsAtEnd(latest >= CAMERA_STOP_PROGRESS);
  });
  const showFocusButton = isAtEnd || monitorFocused;

  return (
    <section
      ref={ref}
      className="h-[178vh] bg-[#c6c0c0] text-black dark:bg-[#757474] dark:text-stone-300 md:h-[158vh]"
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
        <Canvas dpr={[1, 1.5]}>
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

          <Suspense fallback={null}>
            <Plant />
          </Suspense>

          <Suspense fallback={null}>
            <Bird />
          </Suspense>

          <Suspense fallback={null}>
            <Chest />
          </Suspense>

          <Wall2 />

          <Suspense fallback={null}>
            <Curtain />
          </Suspense>

          <WallShelfWithCandle />
          <Floor />
          <Clock />
          <Cloud />

          <Chair />

          <Suspense fallback={null}>
            <Skateboard />
          </Suspense>

          <RecordPlayer />
          <ComputerTower />

          <ScreenUI scrollYProgress={scrollYProgress} />

          {!monitorFocused && <ScreenHint scrollYProgress={scrollYProgress} />}

          <CameraController
            scrollYProgress={scrollYProgress}
            monitorFocused={monitorFocused}
          />

          <Preload all />
        </Canvas>

        {/* Full screen-knapp ved siden av monitoren */}
        <button
          type="button"
          onClick={() => {
            setMonitorFocused((current) => !current);
          }}
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

          <span className="text-base leading-none">
            {monitorFocused ? "↙" : "↗"}
          </span>
        </button>

        {/* Mobil */}
        <button
          type="button"
          onClick={() => {
            setMonitorFocused((current) => !current);
          }}
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
  );
}
