"use client";

import { Canvas } from "@react-three/fiber";
import type { AnimationPlaybackControls, MotionValue } from "framer-motion";
import { IoMdClose } from "react-icons/io";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as THREE from "three";
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
import DarkModeBtn from "./DarkModeBtn";
import WaveLinkText from "./WaveLinkText";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const overlayEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

type TextRevealProps = {
  children: string;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "label";
  className?: string;
  delay?: number;
  once?: boolean;
  mode?: "words" | "lines";
  htmlFor?: string;
};

function TextReveal({
  children,
  as = "p",
  className = "",
  delay = 0,
  once = true,
  mode = "words",
  htmlFor,
}: TextRevealProps) {
  const MotionTag = motion[as] as any;

  const items =
    mode === "lines"
      ? children.split("\n").filter((line) => line.trim().length > 0)
      : children.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: mode === "lines" ? 0.11 : 0.028,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: "115%",
      opacity: 0,
      rotate: 0,
      filter: "blur(10px)",
    },
    visible: {
      y: "0%",
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: mode === "lines" ? 1 : 0.75,
        ease,
      },
    },
  };

  return (
    <MotionTag
      htmlFor={htmlFor}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.35 }}
      className={className}
    >
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={
            mode === "lines"
              ? "block overflow-hidden py-[0.08em] -my-[0.08em]"
              : "inline-block overflow-hidden py-[0.04em] -my-[0.04em] align-top"
          }
        >
          <motion.span
            variants={itemVariants}
            className="inline-block will-change-transform"
          >
            {item}
            {mode === "words" && index !== items.length - 1 ? "\u00A0" : null}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

type RoomSceneProps = {
  scrollYProgress: MotionValue<number>;
  monitorFocused: boolean;
  onReady: () => void;
};

const RoomScene = memo(function RoomScene({
  scrollYProgress,
  monitorFocused,
  onReady,
}: RoomSceneProps) {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <>
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
    </>
  );
});

type Fullscreen3DRoomProps = {
  onClose: () => void;
};

const CAMERA_STOP_PROGRESS = 0.53;

function Fullscreen3DRoom({ onClose }: Fullscreen3DRoomProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const isAtEndRef = useRef(false);

  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [monitorFocused, setMonitorFocused] = useState(false);

  const [roomProgress, setRoomProgressState] = useState(0);

  const { scrollYProgress: roomScrollProgress } = useScroll({
    container: scrollContainerRef,
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const moveToProgress = useCallback((nextProgress: number) => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const clampedProgress = THREE.MathUtils.clamp(nextProgress, 0, 1);

    const maxScroll = container.scrollHeight - container.clientHeight;

    if (maxScroll <= 0) {
      return;
    }

    container.scrollTop = maxScroll * clampedProgress;
  }, []);

  const moveProgressBy = useCallback(
    (amount: number) => {
      const container = scrollContainerRef.current;

      if (!container) {
        return;
      }

      const maxScroll = container.scrollHeight - container.clientHeight;

      if (maxScroll <= 0) {
        return;
      }

      const currentProgress = container.scrollTop / maxScroll;

      moveToProgress(currentProgress + amount);
    },
    [moveToProgress],
  );

  useMotionValueEvent(roomScrollProgress, "change", (latest) => {
    const safeProgress = THREE.MathUtils.clamp(latest, 0, 1);

    setRoomProgressState(safeProgress);

    const nextIsAtEnd = safeProgress >= CAMERA_STOP_PROGRESS;

    if (nextIsAtEnd === isAtEndRef.current) {
      return;
    }

    isAtEndRef.current = nextIsAtEnd;
    setIsAtEnd(nextIsAtEnd);
  });

  const handleSceneReady = useCallback(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setSceneLoaded(true);
      });
    });
  }, []);

  const toggleMonitorFocus = () => {
    setMonitorFocused((current) => !current);
  };

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;

    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.scrollTop = 0;

      scrollContainer.focus({
        preventScroll: true,
      });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;

      const isRangeInput =
        activeElement instanceof HTMLInputElement &&
        activeElement.type === "range";

      if (event.key === "Escape") {
        if (monitorFocused) {
          setMonitorFocused(false);
          return;
        }

        onClose();
        return;
      }

      if (isRangeInput) {
        return;
      }

      if (monitorFocused) {
        return;
      }

      const keyboardStep = 0.035;

      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        moveProgressBy(keyboardStep);
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        moveProgressBy(-keyboardStep);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();

        moveToProgress(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();

        moveToProgress(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;

      document.documentElement.style.overflow = previousHtmlOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [monitorFocused, moveProgressBy, moveToProgress, onClose]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const container = scrollContainerRef.current;

      if (!container || monitorFocused) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      container.scrollTop -= event.deltaY;
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel, {
        capture: true,
      });
    };
  }, [monitorFocused]);

  const showFocusButton = isAtEnd || monitorFocused;

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
        duration: 0.5,
        ease: overlayEase,
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
        tabIndex={-1}
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        className="
          room-scroll
          absolute
          inset-0
          z-0
          overflow-x-hidden
          overflow-y-auto
          overscroll-contain
          touch-pan-y
          outline-none
        "
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        <section
          ref={sectionRef}
          className="
            relative
            h-[178svh]
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
              h-[100svh]
              overflow-hidden
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 1.02,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: sceneLoaded ? 1 : 0,
                scale: sceneLoaded ? 1 : 1.02,
                filter: sceneLoaded ? "blur(0px)" : "blur(10px)",
              }}
              transition={{
                duration: 0.8,
                ease,
              }}
              className="absolute inset-0"
            >
              <Canvas
                dpr={[1, 1.05]}
                shadows={false}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: "high-performance",
                  stencil: false,
                }}
                camera={{
                  near: 0.1,
                  far: 50,
                }}
                resize={{
                  scroll: false,
                  debounce: {
                    scroll: 0,
                    resize: 100,
                  },
                }}
              >
                <ambientLight intensity={0.45} />

                <directionalLight
                  position={[5, 5, 5]}
                  intensity={1}
                  castShadow={false}
                />

                <Suspense fallback={null}>
                  <RoomScene
                    scrollYProgress={roomScrollProgress}
                    monitorFocused={monitorFocused}
                    onReady={handleSceneReady}
                  />
                </Suspense>
              </Canvas>
            </motion.div>

            {/* Progressbar */}
            {sceneLoaded && !monitorFocused && (
              <div
                className="
                  absolute
                  bottom-8
                  left-4
                  z-[150]
                  flex
                  w-[calc(100%-40px)]
                  max-w-[440px]
                  items-center
                  gap-3
                  rounded-[2px]
                  bg-[#161310]
                  px-3
                  py-2
                  text-stone-300
                  dark:bg-stone-300
                  dark:text-[#161310]
                  md:bottom-10
                  md:px-4
                  md:py-3
                "
              >
                <h1 className="uppercase text-xl hidden xl:block">Scroll</h1>
                <h1 className="uppercase text-md ml-4 mr-4 hidden xl:block">
                  Or
                </h1>

                <button
                  type="button"
                  aria-label="Move camera backwards"
                  onClick={() => {
                    moveProgressBy(-0.035);
                  }}
                  className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    cursor-pointer
                    items-center
                    justify-center
                    text-base
                    font-semibold
                    leading-none
                  "
                >
                  ←
                </button>

                <span
                  className="
                    hidden
                    shrink-0
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    sm:block
                  "
                >
                  00
                </span>

                <input
                  type="range"
                  aria-label="3D room progress"
                  min={0}
                  max={1}
                  step={0.001}
                  value={roomProgress}
                  onChange={(event) => {
                    moveToProgress(Number(event.target.value));
                  }}
                  className="
                    h-[2px]
                    min-w-0
                    flex-1
                    cursor-pointer
                    accent-current
                  "
                />

                <span
                  className="
                    min-w-[28px]
                    shrink-0
                    text-right
                    text-[9px]
                    font-semibold
                    tabular-nums
                    tracking-[0.08em]
                  "
                >
                  {Math.round(roomProgress * 100)
                    .toString()
                    .padStart(2, "0")}
                </span>

                <button
                  type="button"
                  aria-label="Move camera forwards"
                  onClick={() => {
                    moveProgressBy(0.035);
                  }}
                  className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    cursor-pointer
                    items-center
                    justify-center
                    text-base
                    font-semibold
                    leading-none
                  "
                >
                  →
                </button>
              </div>
            )}

            {/* Monitor focus – desktop */}
            <button
              type="button"
              onClick={toggleMonitorFocus}
              className={`
                absolute
                left-[67%]
                top-[47%]
                z-[80]
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

              <span aria-hidden="true" className="text-base leading-none">
                {monitorFocused ? "↙" : "↗"}
              </span>
            </button>

            {/* Monitor focus – mobile */}
            <button
              type="button"
              onClick={toggleMonitorFocus}
              className={`
                absolute
                bottom-24
                left-1/2
                z-[80]
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

      {/* Dark mode */}
      {sceneLoaded && (
        <div
          className="
  pointer-events-auto
  absolute
  bottom-8
  left-4
  z-[120]
  md:bottom-10
  lg:left-auto
  lg:right-5
"
        >
          <DarkModeBtn />
        </div>
      )}

      {sceneLoaded && (
        <div
          className="
            pointer-events-none
            absolute
            left-10
            top-7
            z-[200]
            flex
            items-center
            justify-center
            rounded-[2px]
            bg-[#161310]
            px-3
            py-1
            text-[10px]
            font-black
            uppercase
            tracking-[0.12em]
            text-stone-300
            dark:bg-stone-300
            dark:text-[#161310]
            md:text-[16px]
          "
        >
          NEWFARM STUDIO / 3D EXPERIENCE
        </div>
      )}

      {/* Close */}
      {sceneLoaded && (
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
            absolute
            right-10
            top-7
            z-[200]
            flex
            items-center
            justify-center
            rounded-[2px]
            bg-[#161310]
            px-3
            py-1
            text-[10px]
            font-black
            uppercase
            gap-x-1
            cursor-pointer
            tracking-[0.12em]
            text-stone-300
            dark:bg-stone-300
            dark:text-[#161310]
            md:text-[16px]
          "
        >
          <IoMdClose size={25} />
        </motion.button>
      )}

      <AnimatePresence>
        {!sceneLoaded && (
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
              ease,
            }}
            className="
              pointer-events-none
              absolute
              bottom-6
              left-6
              z-[120]
              flex
              items-center
              gap-3
              sm:bottom-8
              sm:left-8
            "
          >
            <span
              className="
                text-[27px]
                font-black
                uppercase
                tracking-[0.1em]
              "
            >
              Loading 3D room
            </span>

            <span
              aria-hidden="true"
              className="
                block
                h-8
                w-8
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
    </motion.div>
  );
}

export default function Hero() {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [lineVisible, setLineVisible] = useState(false);
  const [localTime, setLocalTime] = useState("--:--");
  const [show3DRoom, setShow3DRoom] = useState(false);
  const [copyStep, setCopyStep] = useState<0 | 1 | 2>(0);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end end"],
  });

  const revealProgress = useMotionValue(0);

  const revealRight = useTransform(
    revealProgress,
    (value) => `${100 - value}%`,
  );

  const revealClipPath = useMotionTemplate`inset(0% ${revealRight} 0% 0%)`;

  const revealLineLeft = useTransform(revealProgress, (value) => `${value}%`);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });

  const smoothMouseY = useSpring(mouseY, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });

  useMotionValueEvent(heroScrollProgress, "change", (latest) => {
    const nextStep: 0 | 1 | 2 = latest < 0.16 ? 0 : latest < 0.42 ? 1 : 2;

    setCopyStep((current) => (current === nextStep ? current : nextStep));
  });

  useEffect(() => {
    const updateTime = () => {
      const formattedTime = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Oslo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());

      setLocalTime(formattedTime);
    };

    updateTime();

    const interval = window.setInterval(updateTime, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;

    let controls: AnimationPlaybackControls | null = null;

    const startTimer = window.setTimeout(() => {
      setLineVisible(true);

      controls = animate(revealProgress, 100, {
        duration: 2.2,
        ease,
        onComplete: () => {
          setLineVisible(false);
        },
      });
    }, 500);

    return () => {
      window.clearTimeout(startTimer);
      controls?.stop();
    };
  }, [imageLoaded, revealProgress]);

  const handleImageMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = ((x - centerX) / centerX) * 7;
    const moveY = ((y - centerY) / centerY) * 7;

    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  const handleImageLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const open3DRoom = () => {
    setShow3DRoom(true);
  };

  const close3DRoom = useCallback(() => {
    setShow3DRoom(false);
  }, []);

  return (
    <>
      <section
        ref={heroSectionRef}
        className="
          relative
min-h-[300svh]
          bg-[#fbfafa]
          text-[#161310]
          dark:bg-[#1e1c1c]
          dark:text-stone-300
        "
      >
        <div
          className="
            sticky
            top-0
            h-[100dvh]
            overflow-hidden
            px-5
            pb-[calc(1.5rem+env(safe-area-inset-bottom))]
            pt-28
            sm:px-8
            sm:pb-8
            lg:h-[100svh]
            lg:px-14
            lg:pb-10
            lg:pt-32
          "
        >
          <div className="relative h-full">
            {/* Scroll-changing copy */}
            <div
              className="
                max-w-[360px]
                sm:max-w-[430px]
                lg:absolute
                lg:left-0
                lg:top-[12%]
              "
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`heading-${copyStep}`}
                  initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                  transition={{ duration: 0.45, ease }}
                >
                  <motion.p
                    initial={{ opacity: 0, y: 8, filter: "blur(5px)" }}
                    animate={{ opacity: 0.6, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(5px)" }}
                    transition={{ duration: 0.35, ease }}
                    className="mb-3 text-[10px] font-black uppercase tracking-[0.1em] sm:text-[11px]"
                  >
                    {`${String(copyStep + 1).padStart(2, "0")} / 03`}
                  </motion.p>

                  <TextReveal
                    as="h1"
                    mode="lines"
                    once={false}
                    className="
                      text-[clamp(1.4rem,2.6vw,1.8rem)]
                      font-black
                      uppercase
                      leading-[0.96]
                      tracking-[-0.045em]
                      sm:text-[clamp(1.65rem,3vw,2.2rem)]
                    "
                  >
                    {copyStep === 0
                      ? "Designer & developer\ncrafting interactive\ndigital experiences."
                      : copyStep === 1
                        ? "Building thoughtful\ninterfaces through\nmotion and code."
                        : "Turning ideas into\nclear and memorable\ndigital products."}
                  </TextReveal>
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              className="
                absolute
                bottom-20
                right-0
                text-right
                font-semibold
                md:bottom-20
                md:left-0
                md:right-auto
                md:text-left
                lg:bottom-auto
                lg:left-0
                lg:top-[56%]
                lg:text-left
              "
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`availability-${copyStep}`}
                  initial={{ opacity: 0, y: 14, filter: "blur(7px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(7px)" }}
                  transition={{ duration: 0.4, ease }}
                >
                  <TextReveal
                    mode="lines"
                    once={false}
                    className="
                      mb-1
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.025em]
                      md:text-[13px]
                    "
                  >
                    {copyStep === 0
                      ? "Available for\nselected freelance\nprojects."
                      : copyStep === 1
                        ? "Currently creating\nfocused digital\nexperiences."
                        : "Designed with care\nbuilt with purpose\nand attention."}
                  </TextReveal>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Image */}
            <div
              className="
                mx-auto
                mt-12
                flex
                w-full
                max-w-[520px]
                items-center
                gap-5
                sm:mt-12
                sm:gap-7
md:-mr-20              
lg:mr-0  
                lg:absolute
                lg:left-[66%]
                lg:top-[7%]
                lg:mt-0
                lg:w-auto
                lg:max-w-none
                lg:-translate-x-1/2
                lg:items-end
                lg:gap-0
                xl:left-[60%]
              "
            >
              <div className="flex flex-col items-start">
                <motion.div
                  ref={imageRef}
                  onMouseMove={handleImageMove}
                  onMouseLeave={handleImageLeave}
                  style={{
                    x: smoothMouseX,
                    y: smoothMouseY,
                  }}
                  initial={{
                    clipPath: "inset(100% 0% 0% 0%)",
                    filter: "blur(12px)",
                  }}
                  animate={{
                    clipPath: imageLoaded
                      ? "inset(0% 0% 0% 0%)"
                      : "inset(100% 0% 0% 0%)",
                    filter: imageLoaded ? "blur(0px)" : "blur(12px)",
                  }}
                  transition={{
                    duration: 1.1,
                    ease,
                  }}
                  className="
                  relative
                  aspect-[4/5]
                  
                  w-[42vw]
                  max-w-[260px]
                  overflow-hidden
                  bg-stone-400/10
                  dark:bg-stone-200/5
                  sm:w-[220px]
                  lg:w-[240px]
                "
                >
                  <Image
                    src="/jonas-0003.jpg"
                    alt="Jonas Nygaard"
                    fill
                    priority
                    onLoad={() => setImageLoaded(true)}
                    className="object-cover object-top"
                  />

                  {/* Grayscale reveal layer */}
                  <motion.div
                    style={{
                      clipPath: revealClipPath,
                    }}
                    className="absolute inset-0 z-[2]"
                  >
                    <Image
                      src="/jonas-0003.jpg"
                      alt=""
                      fill
                      priority
                      aria-hidden
                      className="object-cover object-top grayscale"
                    />
                  </motion.div>

                  {/* Sharp reveal line */}
                  <motion.div
                    style={{
                      left: revealLineLeft,
                    }}
                    animate={{
                      opacity: lineVisible ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.18,
                      ease,
                    }}
                    className="
                    pointer-events-none
                    absolute
                    top-0
                    z-[4]
                    h-full
                    w-px
                    -translate-x-1/2
                    bg-white
                    mix-blend-difference
                  "
                  />

                  {/* Reveal glow */}
                  <motion.div
                    style={{
                      left: revealLineLeft,
                    }}
                    animate={{
                      opacity: lineVisible ? 0.45 : 0,
                    }}
                    transition={{
                      duration: 0.18,
                      ease,
                    }}
                    className="
                    pointer-events-none
                    absolute
                    top-0
                    z-[3]
                    h-full
                    w-8
                    -translate-x-1/2
                    bg-white/10
                    blur-md
                  "
                  />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease }}
                  className="
                  mt-2
                  text-[10px]
                  font-semibold
                  uppercase
                  leading-none
                  tracking-[0.08em]
                  opacity-80
                "
                >
                  Portrait / 2026
                </motion.p>
              </div>
            </div>

            {/* Local information / selected work / disciplines */}
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
                filter: "blur(7px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.8,
                delay: 0.9,
                ease,
              }}
              className="
                absolute
                bottom-0
                left-0
                z-[25]
                pb-[calc(0.15rem+env(safe-area-inset-bottom))]
                text-[11px]
                font-black
                uppercase
                leading-none
                tracking-[-0.015em]
                sm:text-[13px]
                lg:text-[15px]
              "
            >
              <AnimatePresence mode="wait">
                {copyStep === 0 ? (
                  <motion.div
                    key="local-information"
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                    transition={{ duration: 0.4, ease }}
                    className="flex flex-wrap gap-x-8 gap-y-2"
                  >
                    <TextReveal as="span" once={false}>
                      {`Local time / ${localTime}`}
                    </TextReveal>

                    <TextReveal as="span" once={false}>
                      Location / Oslo, Norway
                    </TextReveal>
                  </motion.div>
                ) : copyStep === 1 ? (
                  <motion.div
                    key="selected-work"
                    initial={{
                      opacity: 0,
                      y: 12,
                      filter: "blur(6px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      filter: "blur(6px)",
                    }}
                    transition={{
                      duration: 0.4,
                      ease,
                    }}
                    className="
    pointer-events-auto
    relative
    z-[100]
    flex
    flex-wrap
    gap-x-8
    gap-y-2
  "
                  >
                    <p className="flex items-center">
                      <TextReveal as="span" once={false}>
                        Portfolio /
                      </TextReveal>

                      <a
                        href="https://kerimovdesigns.com"
                        target="_blank"
                        rel="noreferrer"
                        className="
        group
        pointer-events-auto
        relative
        z-[101]
        ml-1
        inline-block
        cursor-pointer
        pb-[3px]
      "
                      >
                        <TextReveal as="span" once={false}>
                          Kerimov
                        </TextReveal>

                        <span
                          className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-px
          w-full
          overflow-hidden
        "
                        >
                          {/* Synlig strek som forsvinner mot høyre */}
                          <span
                            className="
            absolute
            inset-0
            origin-right
            scale-x-100
            bg-current
            transition-transform
            duration-300
            ease-[cubic-bezier(0.76,0,0.24,1)]
            group-hover:scale-x-0
          "
                          />

                          {/* Ny strek som kommer inn fra venstre */}
                          <span
                            className="
            absolute
            inset-0
            origin-left
            scale-x-0
            bg-current
            transition-transform
            duration-300
            delay-0
            ease-[cubic-bezier(0.76,0,0.24,1)]
            group-hover:scale-x-100
            group-hover:delay-[180ms]
          "
                          />
                        </span>
                      </a>
                    </p>

                    <p className="flex items-center">
                      <TextReveal as="span" once={false}>
                        E-commerce /
                      </TextReveal>

                      <a
                        href="https://calero.studio"
                        target="_blank"
                        rel="noreferrer"
                        className="
        group
        pointer-events-auto
        relative
        z-[101]
        ml-1
        inline-block
        cursor-pointer
        pb-[3px]
      "
                      >
                        <TextReveal as="span" once={false}>
                          Calero
                        </TextReveal>

                        <span
                          className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-px
          w-full
          overflow-hidden
        "
                        >
                          {/* Synlig strek som forsvinner mot høyre */}
                          <span
                            className="
            absolute
            inset-0
            origin-right
            scale-x-100
            bg-current
            transition-transform
            duration-500
            ease-[cubic-bezier(0.76,0,0.24,1)]
            group-hover:scale-x-0
          "
                          />

                          {/* Ny strek som kommer inn fra venstre */}
                          <span
                            className="
            absolute
            inset-0
            origin-left
            scale-x-0
            bg-current
            transition-transform
            duration-500
            delay-0
            ease-[cubic-bezier(0.76,0,0.24,1)]
            group-hover:scale-x-100
            group-hover:delay-[180ms]
          "
                          />
                        </span>
                      </a>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="disciplines"
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                    transition={{ duration: 0.4, ease }}
                    className="flex flex-wrap gap-x-8 gap-y-2"
                  >
                    <TextReveal as="span" once={false}>
                      Code / Frontend
                    </TextReveal>

                    <TextReveal as="span" once={false}>
                      UI / UX DESIGN
                    </TextReveal>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 3D version button – separate from the marquee */}
            {/* 3D version button */}
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
                filter: "blur(7px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.8,
                delay: 0.95,
                ease,
              }}
              className="
    absolute
    bottom-0
    right-0
    z-[30]
    hidden
    pb-[calc(0.15rem+env(safe-area-inset-bottom))]
    lg:block
  "
            >
              <button
                type="button"
                onClick={open3DRoom}
                className="
    group
    flex
    cursor-pointer
    items-center
    gap-3
    text-[11px]
    font-black
    uppercase
    leading-none
    tracking-[-0.015em]
    sm:text-[14px]
    lg:text-[15px]
  "
              >
                <motion.span
                  aria-hidden
                  className="
  inline-flex
  items-center
  justify-center
  -translate-y-[1px]
  font-normal
  leading-none
"
                  initial={false}
                  whileHover={{
                    x: -5,
                  }}
                  transition={{
                    duration: 0.25,
                    ease,
                  }}
                >
                  ←
                </motion.span>

                <WaveLinkText text="3D Version" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {show3DRoom && (
          <Fullscreen3DRoom key="fullscreen-3d-room" onClose={close3DRoom} />
        )}
      </AnimatePresence>
    </>
  );
}
