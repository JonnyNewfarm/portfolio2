"use client";

import { useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { memo, Suspense, useEffect, useRef, useState } from "react";

import DarkModeBtn from "../DarkModeBtn";
import Bird from "../hero/Bird";
import Bookshelf from "../hero/BookShelf";
import { CameraController } from "../hero/CameraController";
import Chair from "../hero/Chair";
import Chest from "../hero/Chest";
import Clock from "../hero/Clock";
import ComputerTower from "../hero/ComputerTower";
import Curtain from "../hero/Curtain";
import Desk from "../hero/Desk";
import Floor from "../hero/Floor";
import FloorLamp from "../hero/FloorLamp";
import Plant from "../hero/Plant";
import RecordPlayer from "../hero/RecordPlayer";
import ScreenUI from "../hero/ScreenUI";
import Skateboard from "../hero/Skateboard";
import Wall from "../hero/Wall";
import Wall2 from "../hero/Wall2";
import WallShelfWithCandle from "../hero/WallShelfWithCandle";
import WindowOnWall from "../hero/WindowOnWall";

const CAMERA_STOP_PROGRESS = 0.53;

type Fullscreen3DRoomProps = {
  onClose: () => void;
};

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
      dpr={[1.2, 1.5]}
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

function RoomLoader() {
  const { active, loaded, total } = useProgress();

  const sceneIsReady = !active && total > 0 && loaded >= total;

  return (
    <AnimatePresence>
      {!sceneIsReady && (
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 8,
          }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            pointer-events-none
            absolute
            bottom-6
            right-6
            z-[140]
            flex
            items-center
            gap-3
            text-black
            dark:text-stone-300
            md:bottom-10
            md:right-10
          "
        >
          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
            "
          >
            Loading 3D room
          </span>

          <span
            aria-hidden="true"
            className="
              block
              h-5
              w-5
              animate-spin
              rounded-full
              border
              border-current
              border-t-transparent
            "
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Fullscreen3DRoom({ onClose }: Fullscreen3DRoomProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const isAtEndRef = useRef(false);

  const [isAtEnd, setIsAtEnd] = useState(false);
  const [monitorFocused, setMonitorFocused] = useState(false);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
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

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const container = scrollContainerRef.current;

    if (container) {
      container.scrollTop = 0;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const showFocusButton = isAtEnd || monitorFocused;

  const toggleMonitorFocus = () => {
    setMonitorFocused((current) => !current);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="3D room"
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
        duration: 0.45,
        ease: [0.76, 0, 0.24, 1],
      }}
      className="
        fixed
        inset-0
        z-[9999]
        overflow-hidden
        bg-[#c6c0c0]
        text-black
        dark:bg-[#757474]
        dark:text-stone-300
      "
    >
      <div
        ref={scrollContainerRef}
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        className="
          absolute
          inset-0
          z-0
          overflow-x-hidden
          overflow-y-auto
          overscroll-contain
          touch-pan-y
        "
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
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
          <div
            className="
              sticky
              top-0
              flex
              h-screen
              items-center
              justify-center
            "
          >
            <SceneCanvas
              scrollYProgress={scrollYProgress}
              monitorFocused={monitorFocused}
            />

            {/* Desktop full screen */}
            <button
              type="button"
              onClick={toggleMonitorFocus}
              className={`
                absolute
                left-[67%]
                top-[47%]
                z-50
                hidden
                items-center
                gap-3
                whitespace-nowrap
                rounded-full
                border
                border-black/20
                bg-white/90
                px-5
                py-3
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-black
                shadow-lg
                backdrop-blur-md
                transition-all
                duration-500
                ease-out
                hover:scale-105
                hover:bg-black
                hover:text-white
                dark:border-white/20
                dark:bg-black/85
                dark:text-white
                dark:hover:bg-white
                dark:hover:text-black
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

            {/* Mobile full screen */}
            <button
              type="button"
              onClick={toggleMonitorFocus}
              className={`
                absolute
                bottom-24
                left-1/2
                z-50
                flex
                -translate-x-1/2
                items-center
                gap-3
                whitespace-nowrap
                rounded-full
                border
                border-black/20
                bg-white/90
                px-5
                py-3
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-black
                shadow-lg
                backdrop-blur-md
                transition-all
                duration-500
                ease-out
                dark:border-white/20
                dark:bg-black/85
                dark:text-white
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
          </div>
        </section>
      </div>

      {/* Dark mode må ligge utenfor scroll-containeren */}
      <div
        className="
          absolute
          right-5
          top-1/2
          z-[120]
          hidden
          -translate-y-1/2
          md:block
        "
      >
        <DarkModeBtn />
      </div>

      <div
        className="
          absolute
          bottom-12
          right-5
          z-[120]
          md:hidden
        "
      >
        <DarkModeBtn />
      </div>

      {/* Close */}
      {/* Close */}
      <motion.button
        type="button"
        onClick={onClose}
        aria-label="Close 3D room"
        initial={{
          opacity: 0,
          y: -16,
          filter: "blur(5px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          y: -10,
        }}
        transition={{
          duration: 0.5,
          delay: 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
    group
    absolute
    right-5
    top-5
    z-[200]
    block
    h-12
    w-12
    cursor-pointer
    overflow-visible
    text-black
    dark:text-stone-300
    sm:right-8
    sm:top-8
  "
      >
        <span
          className="
      pointer-events-none
      absolute
      right-full
      top-1/2
      mr-3
      -translate-y-1/2
      whitespace-nowrap
      text-[12px]
      font-semibold
      uppercase
      tracking-[0.12em]
      text-current
      opacity-100
    "
        >
          Close
        </span>

        <span
          className="
      absolute
      left-1/2
      top-1/2
      h-px
      w-8
      -translate-x-1/2
      -translate-y-1/2
      rotate-45
      bg-current
      transition-transform
      duration-300
      ease-out
      group-hover:rotate-[38deg]
    "
        />

        <span
          className="
      absolute
      left-1/2
      top-1/2
      h-px
      w-8
      -translate-x-1/2
      -translate-y-1/2
      -rotate-45
      bg-current
      transition-transform
      duration-300
      ease-out
      group-hover:-rotate-[38deg]
    "
        />
      </motion.button>

      <RoomLoader />
    </motion.div>
  );
}
