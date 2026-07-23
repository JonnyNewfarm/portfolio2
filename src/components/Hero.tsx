"use client";

import { Canvas } from "@react-three/fiber";
import type { AnimationPlaybackControls, MotionValue } from "framer-motion";
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

const informationItems = ["location", "occupation"] as const;

const capabilityItems = [
  "Creative development, ",
  "Interactive experiences, 3D & motion",
  "UI / UX design",
] as const;

type InformationPanel = "information" | "selected-work" | "capabilities";

const navigationItems = [
  {
    category: "Portfolio",
    title: "Kerimov Designs",
    href: "https://www.kerimovdesigns.com/",
  },
  {
    category: "E-commerce",
    title: "Calero",
    href: "https://calero.studio/",
  },
];

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

  const { scrollYProgress: roomScrollProgress } = useScroll({
    container: scrollContainerRef,
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(roomScrollProgress, "change", (latest) => {
    const nextIsAtEnd = latest >= CAMERA_STOP_PROGRESS;

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
      scrollContainer.focus({ preventScroll: true });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (monitorFocused) {
        setMonitorFocused(false);
        return;
      }

      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [monitorFocused, onClose]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const container = scrollContainerRef.current;

      if (!container || monitorFocused) return;

      event.preventDefault();
      event.stopPropagation();

      container.scrollTop += event.deltaY;
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
            className="sticky
top-0
h-[100svh]
overflow-hidden"
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
                dpr={[1, 1.25]}
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

            {!isAtEnd && !monitorFocused && (
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-10
                  left-7
                  z-[70]
                  text-[14px]
                  md:text-[26px]
                  text-white
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  opacity-70
                "
              >
                Scroll
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Dark mode – mobile */}
      <div
        className="
          pointer-events-auto
          absolute
          bottom-10
          right-5
          z-[120]
        "
      >
        <DarkModeBtn />
      </div>

      <div
        className="
                  pointer-events-none
                  absolute
                  top-7
                  left-10
                  z-[70]
                  text-[10px]
                  md:text-[16px]
                  font-black
                  uppercase
                  tracking-[0.12em]
                "
      >
        NEWFARM STUDIO / 3D EXPERIENCE
      </div>

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
    right-7
    top-5
    z-[200]
    flex
    cursor-pointer
    items-center
    gap-x-1
    
    text-black
    dark:text-stone-300
    sm:right-7
    sm:top-7
  "
      >
        <span
          className="
          text-[10px]

      md:text-[16px]
      font-semibold
      uppercase
      tracking-[0.12em]
    "
        >
          Close
        </span>

        <span className="relative block h-8 w-8">
          <span
            className="
        absolute
        left-1/2
        top-1/2
        h-[2px]
        w-3
        md:w-4
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
        h-[2px]
        w-3
        md:w-4
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
        </span>
      </motion.button>

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
                text-[10px]
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
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [lineVisible, setLineVisible] = useState(false);
  const [localTime, setLocalTime] = useState("--:--");
  const [activePanel, setActivePanel] =
    useState<InformationPanel>("information");
  const [show3DRoom, setShow3DRoom] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
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

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActivePanel((currentPanel) => {
      if (currentPanel === "information") {
        return latest > 0.3 ? "selected-work" : currentPanel;
      }

      if (currentPanel === "selected-work") {
        if (latest < 0.22) return "information";
        if (latest > 0.68) return "capabilities";

        return currentPanel;
      }

      return latest < 0.58 ? "selected-work" : currentPanel;
    });
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
        ref={sectionRef}
        className="
          relative
min-h-[220svh]          bg-[#fbfafa]
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
            {/* Main heading */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 24,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease,
              }}
              className="
                max-w-[360px]
                 text-[clamp(1.4rem,2.6vw,1.8rem)]
                sm:text-[clamp(1.65rem,3vw,2.2rem)]
                font-black
                uppercase
                leading-[0.96]
                tracking-[-0.045em]
                sm:max-w-[430px]
                lg:absolute
                lg:left-0
                lg:top-[12%]
              "
            >
              Designer &amp; developer
              <br />
              crafting interactive
              <br />
              digital experiences.
            </motion.h1>

            {/* Image and contact text */}
            <div
              className="
                mx-0
                mt-7
                flex
                w-full
                max-w-[520px]
                items-end
                justify-start
                gap-3
                pr-1
                sm:mt-16
                sm:gap-0
                sm:pr-0
                lg:absolute
                lg:left-[55%]
                lg:top-[7%]
                lg:mt-0
                lg:w-auto
                lg:max-w-none
                lg:-translate-x-1/2
              "
            >
              <motion.div
                initial={{
                  opacity: 0,
                  x: 18,
                  filter: "blur(7px)",
                }}
                animate={{
                  opacity: imageLoaded ? 1 : 0,
                  x: imageLoaded ? 0 : 18,
                  filter: imageLoaded ? "blur(0px)" : "blur(7px)",
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.65,
                  ease,
                }}
                className="
                  mr-3
                  hidden
                  w-[125px]
                  pb-1
                  text-right
                  text-[12px]
                  leading-[1.08]
                  lg:block
                "
              >
                <p>
                  Available for
                  <br />
                  selected freelance
                  <br />
                  projects.
                </p>

                <Link
                  href="/contact"
                  className="
                    mt-1
                    inline-block
                    text-base
                    font-black
                    lowercase
                    leading-none
                  "
                >
                  <WaveLinkText text="contact" />
                </Link>
              </motion.div>

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

                {/* Mobile panel counter */}
                <div
                  aria-hidden
                  className="
                    absolute
                    bottom-2
                    right-2
                    z-[10]
                    text-[10px]
                    font-medium
                    tracking-[0.08em]
                    text-white
                    lg:hidden
                  "
                >
                  {activePanel === "information"
                    ? "01 / 03"
                    : activePanel === "selected-work"
                      ? "02 / 03"
                      : "03 / 03"}
                </div>
              </motion.div>
            </div>

            {/* Information transforms into navigation */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.8,
                delay: 0.8,
                ease,
              }}
              className="
  relative
  mt-1
  min-h-[116px]
  w-full
  max-w-[330px]
  shrink-0
  text-[11px]
  font-black
  uppercase
  leading-[1.2]
  tracking-[-0.015em]
  lg:absolute
  lg:bottom-0
  lg:left-0
  lg:mt-0
  lg:h-[105px]
  lg:min-h-0
  lg:w-[330px]
  lg:max-w-none
  lg:text-sm
"
            >
              <AnimatePresence initial={false} mode="wait">
                {activePanel === "information" && (
                  <motion.div
                    key="information"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.07,
                        },
                      },
                      exit: {
                        transition: {
                          staggerChildren: 0.07,
                        },
                      },
                    }}
                    className="absolute top-4 left-0"
                  >
                    <motion.p
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 16,
                          filter: "blur(4px)",
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                        },
                        exit: {
                          opacity: 0,
                          y: -20,
                          filter: "blur(5px)",
                        },
                      }}
                      transition={{
                        duration: 0.42,
                        ease,
                      }}
                    >
                      Local time / {localTime}
                    </motion.p>

                    {informationItems.map((item) => (
                      <motion.p
                        key={item}
                        variants={{
                          hidden: {
                            opacity: 0,
                            y: 16,
                            filter: "blur(4px)",
                          },
                          visible: {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                          },
                          exit: {
                            opacity: 0,
                            y: -20,
                            filter: "blur(5px)",
                          },
                        }}
                        transition={{
                          duration: 0.42,
                          ease,
                        }}
                        className="mt-3"
                      >
                        {item === "location"
                          ? "Location / Oslo, Norway"
                          : "Occupation / Web designer & developer"}
                      </motion.p>
                    ))}
                  </motion.div>
                )}

                {activePanel === "selected-work" && (
                  <motion.nav
                    key="selected-work"
                    aria-label="Selected work"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.08,
                        },
                      },
                      exit: {
                        transition: {
                          staggerChildren: 0.05,
                          staggerDirection: -1,
                        },
                      },
                    }}
                    className="
                      absolute
                      top-4
                      left-0
                      flex
                      w-full
                      flex-col
                      items-start
                      lg:min-w-[310px]
                    "
                  >
                    <motion.p
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 12,
                          filter: "blur(4px)",
                        },
                        visible: {
                          opacity: 0.8,
                          y: 0,
                          filter: "blur(0px)",
                        },
                        exit: {
                          opacity: 0,
                          y: -10,
                          filter: "blur(4px)",
                        },
                      }}
                      transition={{
                        duration: 0.4,
                        ease,
                      }}
                      className="
                        mb-3
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.04em]
                        opacity-80
                        lg:text-[11px]
                      "
                    >
                      Selected Work / 2026
                    </motion.p>

                    <div className="flex w-full flex-col gap-y-3">
                      {navigationItems.map((item) => (
                        <motion.div
                          key={item.href}
                          variants={{
                            hidden: {
                              opacity: 0,
                              y: 18,
                              filter: "blur(5px)",
                            },
                            visible: {
                              opacity: 1,
                              y: 0,
                              filter: "blur(0px)",
                            },
                            exit: {
                              opacity: 0,
                              y: -14,
                              filter: "blur(4px)",
                            },
                          }}
                          transition={{
                            duration: 0.44,
                            ease,
                          }}
                          className="w-full"
                        >
                          <Link
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              group
                              inline-flex
                              items-center
                              gap-2
                              text-[11px]
                              font-black
                              uppercase
                              leading-none
                              tracking-[-0.015em]
                              lg:text-sm
                            "
                          >
                            <span>
                              <WaveLinkText
                                text={`${item.category} / ${item.title}`}
                              />
                            </span>

                            <motion.span
                              aria-hidden
                              className="inline-block font-normal"
                              initial={false}
                              whileHover={{
                                x: 4,
                              }}
                              transition={{
                                duration: 0.22,
                                ease,
                              }}
                            >
                              →
                            </motion.span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.nav>
                )}

                {activePanel === "capabilities" && (
                  <motion.div
                    key="capabilities"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.07,
                        },
                      },
                      exit: {
                        transition: {
                          staggerChildren: 0.05,
                          staggerDirection: -1,
                        },
                      },
                    }}
                    className="absolute top-4 left-0 flex w-full flex-col items-start"
                  >
                    <motion.p
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 12,
                          filter: "blur(4px)",
                        },
                        visible: {
                          opacity: 0.8,
                          y: 0,
                          filter: "blur(0px)",
                        },
                        exit: {
                          opacity: 0,
                          y: -10,
                          filter: "blur(4px)",
                        },
                      }}
                      transition={{
                        duration: 0.4,
                        ease,
                      }}
                      className="
                        mb-3
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.04em]
                        opacity-80
                        lg:text-sm
                      "
                    >
                      Capabilities / 2026
                    </motion.p>

                    <div className="flex w-full flex-col gap-y-2">
                      {capabilityItems.map((item) => (
                        <motion.p
                          className="text-[11px] lg:text-sm"
                          key={item}
                          variants={{
                            hidden: {
                              opacity: 0,
                              y: 18,
                              filter: "blur(5px)",
                            },
                            visible: {
                              opacity: 1,
                              y: 0,
                              filter: "blur(0px)",
                            },
                            exit: {
                              opacity: 0,
                              y: -14,
                              filter: "blur(4px)",
                            },
                          }}
                          transition={{
                            duration: 0.44,
                            ease,
                          }}
                        >
                          {item}
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                aria-hidden
                className="absolute right-0 top-0 hidden text-[13px] font-semibold tracking-[0.08em]  lg:block"
              >
                {activePanel === "information"
                  ? "01 / 03"
                  : activePanel === "selected-work"
                    ? "02 / 03"
                    : "03 / 03"}
              </div>
            </motion.div>

            {/* Mobile contact – bottom right */}
            <motion.div
              initial={{
                opacity: 0,
                x: 18,
                filter: "blur(7px)",
              }}
              animate={{
                opacity: imageLoaded ? 1 : 0,
                x: imageLoaded ? 0 : 18,
                filter: imageLoaded ? "blur(0px)" : "blur(7px)",
              }}
              transition={{
                duration: 0.8,
                delay: 0.65,
                ease,
              }}
              className="
              
                absolute
                bottom-0
                right-0
                w-[125px]
                text-right
                text-[10px]
                sm:text-[14px]
                leading-[1.08]
                lg:hidden
              "
            >
              <p className="">
                Available for
                <br />
                selected freelance
                <br />
                projects.
              </p>

              <Link
                href="/contact"
                className="
                  mt-0.5
                  inline-block
                  text-base
                  sm:text-2xl
                  font-black
                  lowercase
                  leading-none
                "
              >
                <WaveLinkText text="contact" />
              </Link>
            </motion.div>

            {/* 3D version button */}
            <motion.div
              initial={{
                opacity: 0,
                x: 24,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: 1,
                x: 0,
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
                hidden
                justify-end
                lg:flex
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
                  gap-4
                  text-[clamp(1.8rem,3vw,2.8rem)]
                  font-black
                  uppercase
                  leading-none
                  tracking-[-0.045em]
                "
              >
                <motion.span
                  aria-hidden
                  className="
                    inline-block
                    text-xl
                    font-normal
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
