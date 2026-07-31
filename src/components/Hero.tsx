"use client";

import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { IoMdClose } from "react-icons/io";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import * as THREE from "three";
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
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
    h-[178dvh]
    bg-[#c6c0c0]
    text-black
    dark:bg-[#757474]
    dark:text-stone-300
    md:h-[158dvh]
  "
        >
          <div
            className="
      sticky
      top-0
      h-dvh
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

const portraitVertexShader = `
  varying vec2 vUv;

  uniform vec2 uDelta;
  uniform float uAmplitude;

  const float PI = 3.141592653589793238;

  void main() {
    vUv = uv;

    vec3 newPosition = position;

    // Samme prinsipp som eksempelet:
    // horisontal musehastighet bøyer de vertikale sidene,
    // vertikal musehastighet bøyer topp og bunn.
    newPosition.x +=
      sin(uv.y * PI) *
      uDelta.x *
      uAmplitude;

    newPosition.y +=
      sin(uv.x * PI) *
      uDelta.y *
      uAmplitude;

    // Litt dybde gjør at deformasjonen kjennes mykere,
    // uten å endre selve prinsippet fra referansen.
    float speed = length(uDelta);
    newPosition.z +=
      sin(uv.x * PI) *
      sin(uv.y * PI) *
      speed *
      uAmplitude *
      0.16;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(newPosition, 1.0);
  }
`;

const portraitFragmentShader = `
  varying vec2 vUv;

  uniform sampler2D uTexture;
  uniform float uAlpha;

  void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    gl_FragColor = vec4(textureColor.rgb, textureColor.a * uAlpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

type AnimatedPortraitPlaneProps = {
  onLoaded: () => void;
};

function AnimatedPortraitPlane({ onLoaded }: AnimatedPortraitPlaneProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const texture = useLoader(THREE.TextureLoader, "/newfarm-4.jpg");
  const { viewport } = useThree();

  // Canvaset er større enn bildeområdet, slik at bølgene ikke klippes.
  const canvasScale = 1.6;
  const portraitWidth = viewport.width / canvasScale;
  const portraitHeight = viewport.height / canvasScale;

  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothPointer = useRef(new THREE.Vector2(0.5, 0.5));

  // Fjær for selve bildeposisjonen.
  const positionTarget = useRef(new THREE.Vector2(0, 0));
  const positionCurrent = useRef(
    new THREE.Vector2(-portraitWidth * 0.16, portraitHeight * 0.025),
  );
  const positionVelocity = useRef(new THREE.Vector2(0, 0));

  // Starter bøyd og slipper tilbake med spring på load.
  const bendCurrent = useRef(new THREE.Vector2(-155, 28));
  const bendVelocity = useRef(new THREE.Vector2(0, 0));

  // Shader-opacity gir fade inn uten å fade hele Canvas-elementet.
  const alphaCurrent = useRef(0);
  const alphaVelocity = useRef(0);
  const hasStartedLoadAnimation = useRef(false);

  const hovered = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uDelta: { value: new THREE.Vector2(-155, 28) },
      uAmplitude: { value: 0.00155 },
      uAlpha: { value: 0 },
    }),
    [texture],
  );

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;

    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    texture.generateMipmaps = true;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    onLoaded();
  }, [onLoaded, texture]);

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;

    if (!mesh || !material) {
      return;
    }

    // Unngår store hopp dersom fanen har vært inaktiv.
    const delta = Math.min(rawDelta, 1 / 30);

    if (!hasStartedLoadAnimation.current) {
      hasStartedLoadAnimation.current = true;

      // Gir fjæren et lite ekstra dytt, så returen overskyter svakt.
      bendVelocity.current.set(310, -54);
      positionVelocity.current.set(
        portraitWidth * 0.95,
        -portraitHeight * 0.12,
      );
    }

    // Fade inn med en lett underdempet spring.
    const alphaTarget = 1;
    const alphaStiffness = 72;
    const alphaDamping = 14;

    alphaVelocity.current +=
      (alphaTarget - alphaCurrent.current) * alphaStiffness * delta;

    alphaVelocity.current *= Math.exp(-alphaDamping * delta);
    alphaCurrent.current += alphaVelocity.current * delta;
    alphaCurrent.current = THREE.MathUtils.clamp(alphaCurrent.current, 0, 1);

    // Samme etterslep som lerp-oppsettet i koden du sendte.
    const pointerFollow = 1 - Math.exp(-delta * 8.5);
    smoothPointer.current.lerp(pointerTarget.current, pointerFollow);

    const rawDifferenceX = pointerTarget.current.x - smoothPointer.current.x;
    const rawDifferenceY = pointerTarget.current.y - smoothPointer.current.y;

    // Gjør UV-forskjellen om til omtrentlige pikselverdier,
    // slik at uAmplitude kan oppføre seg som i referanseshaderen.
    const targetBendX = hovered.current ? rawDifferenceX * 520 : 0;
    const targetBendY = hovered.current ? rawDifferenceY * 520 : 0;

    // Under-dempet spring: følger bevegelsen og gir et lite tilbakeslag.
    const bendStiffness = hovered.current ? 115 : 88;
    const bendDamping = hovered.current ? 15 : 10.5;

    bendVelocity.current.x +=
      (targetBendX - bendCurrent.current.x) * bendStiffness * delta;
    bendVelocity.current.y +=
      (targetBendY - bendCurrent.current.y) * bendStiffness * delta;

    bendVelocity.current.multiplyScalar(Math.exp(-bendDamping * delta));

    bendCurrent.current.addScaledVector(bendVelocity.current, delta);

    // Bildet følger musa litt, men forlater aldri sin egen plass.
    const maxFollowX = portraitWidth * 0.42;
    const maxFollowY = portraitHeight * 0.22;

    positionTarget.current.set(
      hovered.current ? (pointerTarget.current.x - 0.5) * maxFollowX : 0,
      hovered.current ? (pointerTarget.current.y - 0.5) * maxFollowY : 0,
    );

    const positionStiffness = hovered.current ? 34 : 78;
    const positionDamping = hovered.current ? 7.5 : 8.5;

    positionVelocity.current.x +=
      (positionTarget.current.x - positionCurrent.current.x) *
      positionStiffness *
      delta;

    positionVelocity.current.y +=
      (positionTarget.current.y - positionCurrent.current.y) *
      positionStiffness *
      delta;

    positionVelocity.current.multiplyScalar(Math.exp(-positionDamping * delta));

    positionCurrent.current.addScaledVector(positionVelocity.current, delta);

    mesh.position.x = positionCurrent.current.x;
    mesh.position.y = positionCurrent.current.y;

    material.uniforms.uDelta.value.set(
      bendCurrent.current.x,
      bendCurrent.current.y,
    );

    material.uniforms.uAlpha.value = alphaCurrent.current;
  });

  const handlePointerEnter = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    hovered.current = true;

    if (event.uv) {
      pointerTarget.current.copy(event.uv);
      smoothPointer.current.copy(event.uv);
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    if (!event.uv) {
      return;
    }

    pointerTarget.current.copy(event.uv);
  };

  const handlePointerLeave = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    hovered.current = false;

    // Musens mål går tilbake til midten. Spring-fysikken sørger for
    // at både posisjonen og bøyen slipper og overskyter svakt tilbake.
    pointerTarget.current.set(0.5, 0.5);
  };

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[portraitWidth, portraitHeight, 24, 30]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={portraitVertexShader}
        fragmentShader={portraitFragmentShader}
        toneMapped={false}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const heroHeadings = [
  "Designer & developer\ncrafting interactive\ndigital experiences.",
  "Building thoughtful\ninterfaces through\nmotion and code.",
  "Turning ideas into\nclear and memorable\ndigital products.",
] as const;

function AnimatedUnderline() {
  return (
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
  );
}

export default function Hero() {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [localTime, setLocalTime] = useState("--:--");
  const [show3DRoom, setShow3DRoom] = useState(false);
  const [copyStep, setCopyStep] = useState<0 | 1 | 2>(0);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(heroScrollProgress, "change", (latest) => {
    const nextStep: 0 | 1 | 2 = latest < 0.33 ? 0 : latest < 0.66 ? 1 : 2;

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
    h-[300dvh]
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
      h-dvh
      overflow-hidden
      px-5
      sm:px-8
      lg:px-[3vw]
    "
        >
          <div className="relative h-full w-full">
            {/* Only this heading changes on scroll */}
            <div
              className="
                absolute
                left-0
                top-[16%]
                z-20
                max-w-[260px]
                sm:max-w-[320px]
                
                lg:top-[30%]
                lg:max-w-[340px]
              "
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`heading-${copyStep}`}
                  initial={{ opacity: 0, y: 16, filter: "blur(7px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(7px)" }}
                  transition={{ duration: 0.45, ease }}
                >
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 0.55, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease }}
                    className="
                      mb-3
                      text-[10px]
                      font-black
                      uppercase
                      leading-none
                      tracking-[0.08em]
                      sm:text-[11px]
                      lg:mb-4
                      lg:text-[12px]
                    "
                  >
                    {`${String(copyStep + 1).padStart(2, "0")} / 03`}
                  </motion.p>

                  <TextReveal
                    as="h1"
                    mode="lines"
                    once={false}
                    className="
                      text-[17px]
                      font-black
                      uppercase
                      leading-[0.98]
                      tracking-[-0.045em]
                      sm:text-[19px]
                      lg:text-[21px]
                      xl:text-[22px]
                    "
                  >
                    {heroHeadings[copyStep]}
                  </TextReveal>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Portrait stays fixed */}
            <motion.div
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{
                opacity: imageLoaded ? 1 : 0,
                y: imageLoaded ? 0 : 18,
                filter: imageLoaded ? "blur(0px)" : "blur(8px)",
              }}
              transition={{ duration: 0.8, ease }}
              className="
  absolute
  left-1/2
  top-[56%]
  w-[44vw]
  max-w-[205px]
  -translate-x-1/2
  -translate-y-1/2
  sm:top-1/2
  sm:w-[220px]
  lg:w-[17vw]
  lg:max-w-[260px]
"
            >
              <div
                ref={imageRef}
                className="relative aspect-[4/5] w-full overflow-visible"
              >
                <Canvas
                  dpr={[1.5, 2]}
                  gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance",
                    stencil: false,
                  }}
                  camera={{
                    position: [0, 0, 2.2],
                    fov: 34,
                    near: 0.1,
                    far: 10,
                  }}
                  style={{
                    position: "absolute",
                    left: "-30%",
                    top: "-30%",
                    width: "157%",
                    height: "157%",
                  }}
                >
                  <Suspense fallback={null}>
                    <AnimatedPortraitPlane
                      onLoaded={() => {
                        setImageLoaded(true);
                      }}
                    />
                  </Suspense>
                </Canvas>
              </div>
              <p className="absolute tracking-[0.045] uppercase text-[10px] lg:hidden">
                portrait / 2026
              </p>
            </motion.div>

            {/* Bottom information */}
            <motion.div
              initial={{ opacity: 0, y: 14, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.85, ease }}
              className="
                absolute
                bottom-[3.5%]
                left-0
                right-0
                z-30
               flex flex-col
                items-end
                gap-x-5
                gap-y-4
                text-[9px]
                font-black
                uppercase
                leading-none
                tracking-[-0.015em]
                sm:text-sm
                lg:flex-row
                lg:justify-between
                lg:text-sm
              "
            >
              <div className="lg:text-left">
                <TextReveal as="span">{`Local time / ${localTime} (CEST)`}</TextReveal>
              </div>

              <div className="text-right lg:text-center">
                <TextReveal as="span">Location / Oslo, Norway</TextReveal>
              </div>

              <div className="col-span-2 hidden lg:block text-right lg:col-span-1 lg:text-center">
                <a
                  href="https://kerimovdesigns.com"
                  target="_blank"
                  rel="noreferrer"
                  className="
                    group
                    relative
                    inline-block
                    cursor-pointer
                    pb-[3px]
                  "
                >
                  <TextReveal as="span">Latest project / Kerimov</TextReveal>
                  <AnimatedUnderline />
                </a>
              </div>

              {/* Hidden below lg */}
              <div className="hidden text-right lg:block">
                <button
                  type="button"
                  onClick={open3DRoom}
                  className="
                    group
                    relative
                    inline-block
                    cursor-pointer
                    pb-[3px]
                    text-sm
                    font-black
                    uppercase
                    leading-none
                    tracking-[-0.015em]
                  "
                >
                  <TextReveal as="span">3D version / Open room</TextReveal>
                  <AnimatedUnderline />
                </button>
              </div>
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
