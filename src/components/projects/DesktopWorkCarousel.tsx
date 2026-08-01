import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { motion } from "framer-motion";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type TouchEvent,
} from "react";
import * as THREE from "three";

import {
  CARD_STRIDE,
  CAROUSEL_EASE,
  TEXT_EASE,
  carouselMotion,
} from "./projectsConstants";

import { projects } from "./projectData";

import type { CarouselRuntime } from "./projectsTypes";

import ProjectsTextReveal from "./ProjectsTextReveal";
import DesktopImageSkeleton from "./DesktopImageSkeleton";

import CanvasBackground from "./carousel/CanvasBackground";
import ImageBendScene from "./carousel/ImageBendScene";

import {
  buildCarouselItems,
  createCarouselRuntime,
} from "./carousel/carouselUtils";
import WaveLinkText from "../WaveLinkText";

type DesktopWorkCarouselProps = {
  activeProjectIndex: number;

  setActiveProjectIndex: Dispatch<SetStateAction<number>>;

  isDark: boolean;
};

export default function DesktopWorkCarousel({
  activeProjectIndex,
  setActiveProjectIndex,
  isDark,
}: DesktopWorkCarouselProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const touchStartXRef = useRef(0);

  const touchLastXRef = useRef(0);

  const momentumTimerRef = useRef<number | null>(null);

  const items = useMemo(() => buildCarouselItems(), []);

  const activeProject = projects[activeProjectIndex];

  const [isSceneReady, setIsSceneReady] = useState(false);

  const runtimeRef = useRef<CarouselRuntime>(createCarouselRuntime());

  const handleSceneReady = useCallback(() => {
    setIsSceneReady(true);
  }, []);

  const addBend = useCallback((amount: number) => {
    runtimeRef.current.desiredBend = Math.min(
      1,
      runtimeRef.current.desiredBend + amount,
    );
  }, []);

  const releaseMomentumSoon = useCallback((delay = 160) => {
    if (momentumTimerRef.current !== null) {
      window.clearTimeout(momentumTimerRef.current);
    }

    momentumTimerRef.current = window.setTimeout(() => {
      runtimeRef.current.hasMomentum = false;
    }, delay);
  }, []);

  const nudgeCarousel = useCallback(
    (delta: number) => {
      runtimeRef.current.desiredOffset += delta;

      runtimeRef.current.hasMomentum = true;

      addBend(Math.min(1, Math.abs(delta) * 0.065));

      releaseMomentumSoon(220);
    },
    [addBend, releaseMomentumSoon],
  );

  const handlePrev = useCallback(() => {
    nudgeCarousel(-CARD_STRIDE);
  }, [nudgeCarousel]);

  const handleNext = useCallback(() => {
    nudgeCarousel(CARD_STRIDE);
  }, [nudgeCarousel]);

  const jumpToProject = useCallback(
    (projectIndex: number) => {
      const firstItemIndex = items.findIndex(
        (item) => item.projectIndex === projectIndex,
      );

      if (firstItemIndex === -1) {
        return;
      }

      runtimeRef.current.desiredOffset = firstItemIndex * CARD_STRIDE;

      runtimeRef.current.hasMomentum = true;

      runtimeRef.current.desiredBend = Math.min(
        1,
        runtimeRef.current.desiredBend + 0.55,
      );

      setActiveProjectIndex(projectIndex);

      releaseMomentumSoon(420);
    },
    [items, releaseMomentumSoon, setActiveProjectIndex],
  );

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      if (window.innerWidth < 768) {
        return;
      }

      const rect = section.getBoundingClientRect();

      const isInside =
        rect.top <= window.innerHeight * 0.35 &&
        rect.bottom >= window.innerHeight * 0.65;

      if (!isInside) {
        return;
      }

      event.preventDefault();

      const wheelBend = Math.abs(event.deltaY) * 0.001;

      addBend(wheelBend);

      runtimeRef.current.desiredOffset +=
        event.deltaY * carouselMotion.wheelForce;

      runtimeRef.current.hasMomentum = true;

      runtimeRef.current.glideSpeed =
        Math.min(Math.abs(event.deltaY) * 0.00045, 0.045) *
        Math.sign(event.deltaY);

      releaseMomentumSoon(150);
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);

      if (momentumTimerRef.current !== null) {
        window.clearTimeout(momentumTimerRef.current);
      }
    };
  }, [addBend, releaseMomentumSoon]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (window.innerWidth < 768) {
        return;
      }

      if (event.key === "ArrowLeft") {
        handlePrev();
      }

      if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, handlePrev]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    touchStartXRef.current = touch.clientX;

    touchLastXRef.current = touch.clientX;

    runtimeRef.current.hasMomentum = false;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    const touchX = touch.clientX;

    const deltaX = touchX - touchLastXRef.current;

    touchLastXRef.current = touchX;

    const touchBend = Math.abs(deltaX) * 0.018;

    addBend(touchBend);

    runtimeRef.current.desiredOffset -= deltaX * carouselMotion.dragForce;

    runtimeRef.current.hasMomentum = true;
  };

  const handleTouchEnd = () => {
    const velocity = (touchLastXRef.current - touchStartXRef.current) * 0.005;

    if (Math.abs(velocity) <= 0.5) {
      return;
    }

    runtimeRef.current.glideSpeed =
      -velocity * carouselMotion.inertiaBoost * 0.05;

    runtimeRef.current.desiredBend = Math.min(
      1,
      Math.abs(velocity) * 3 * carouselMotion.bendInputScale,
    );

    runtimeRef.current.hasMomentum = true;

    window.setTimeout(() => {
      runtimeRef.current.hasMomentum = false;
    }, 800);
  };

  const canvasBackground = isDark ? "#1e1c1c" : "#fbfafa";

  return (
    <div
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="
        relative
        hidden
        h-screen
        w-full
        overflow-hidden
        bg-[#fbfafa]
        text-[#161310]
        transition-colors
        duration-500
        dark:bg-[#1e1c1c]
        dark:text-stone-300
        md:block
      "
    >
      <div
        className="
          absolute
          left-8
          top-[112px]
          z-40
        "
      >
        <div className="mt-5 flex items-center gap-7">
          <button
            type="button"
            onClick={handlePrev}
            className="
              cursor-pointer
              text-[35px]
              font-semibold
              uppercase
              leading-none
              tracking-[0.01em]
              transition-opacity
              hover:opacity-55
            "
          >
            <ProjectsTextReveal active delay={0.12} as="span">
              Prev
            </ProjectsTextReveal>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="
              cursor-pointer
              text-[35px]
              font-semibold
              uppercase
              leading-none
              tracking-[0.01em]
              transition-opacity
              hover:opacity-55
            "
          >
            <ProjectsTextReveal active delay={0.16} as="span">
              Next
            </ProjectsTextReveal>
          </button>
        </div>
      </div>

      <div
        className="
          pointer-events-none
          absolute
          right-8
          top-[112px]
          z-40
          max-w-[430px]
          text-right
        "
      >
        <ProjectsTextReveal
          key={`meta-${activeProjectIndex}`}
          active
          delay={0.08}
          as="p"
          className="
            mb-4
            text-[16px]
            font-black
            uppercase
            tracking-[0.28em]
          "
        >
          {`${activeProject.category} / ${activeProject.year}`}
        </ProjectsTextReveal>

        <ProjectsTextReveal
          key={`about-${activeProjectIndex}`}
          active
          delay={0.13}
          as="p"
          className="
            text-[clamp(18px,1.3vw,24px)]
            leading-[1.02]
            tracking-[0.01em]
            font-normal
          "
        >
          {activeProject.about}
        </ProjectsTextReveal>
      </div>

      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{
          opacity: isSceneReady ? 0 : 1,

          visibility: isSceneReady ? "hidden" : "visible",
        }}
        transition={{
          opacity: {
            duration: 0.8,
            ease: TEXT_EASE,
          },

          visibility: {
            delay: isSceneReady ? 0.8 : 0,
          },
        }}
        className="
          pointer-events-none
          absolute
          inset-0
          z-20
        "
      >
        <DesktopImageSkeleton isDark={isDark} />
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          scale: 1.008,
        }}
        animate={{
          opacity: isSceneReady ? 1 : 0,

          scale: isSceneReady ? 1 : 1.008,
        }}
        transition={{
          duration: 1.15,

          delay: isSceneReady ? 0.08 : 0,

          ease: CAROUSEL_EASE,
        }}
        className="
          absolute
          inset-0
          z-10
          will-change-[opacity,transform]
        "
        style={{
          backgroundColor: canvasBackground,
        }}
      >
        <Canvas
          dpr={[1, 1.65]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          style={{
            backgroundColor: canvasBackground,
          }}
          camera={{
            fov: 43,
            near: 0.1,
            far: 100,
            position: [0, 0, 4.75],
          }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <CanvasBackground color={canvasBackground} />

          <Suspense fallback={null}>
            <ImageBendScene
              items={items}
              runtimeRef={runtimeRef}
              onActiveProjectChangeAction={setActiveProjectIndex}
              onReadyAction={handleSceneReady}
            />

            <Preload all />
          </Suspense>
        </Canvas>
      </motion.div>

      <div
        className="
          absolute
          bottom-8
          left-8
          z-40
          flex
          items-center
          justify-start
          gap-9
        "
      >
        {projects.map((project, index) => (
          <button
            key={project.title}
            type="button"
            onClick={() => {
              jumpToProject(index);
            }}
            className={`
                cursor-pointer
                whitespace-nowrap
                text-[clamp(26px,2vw,40px)]
                font-semibold
                uppercase
                leading-none
                tracking-[0.01em]
                transition-transform
                duration-500

                ${
                  index === activeProjectIndex
                    ? "scale-110 opacity-100"
                    : "opacity-60 hover:opacity-90"
                }
              `}
          >
            {project.title}
          </button>
        ))}
      </div>

      <div
        className="
          absolute
          bottom-8
          right-8
          z-40
          flex
          flex-col
          items-end
          gap-4
          text-right
        "
      >
        <a
          href={activeProject.link}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-[38px]
            font-semibold
            uppercase
            leading-none
            tracking-[0.02em]
            transition-opacity
            hover:opacity-55
          "
        >
          <ProjectsTextReveal active delay={0.22} as="span">
            <WaveLinkText text="Live Link" />
          </ProjectsTextReveal>
        </a>
      </div>
    </div>
  );
}
