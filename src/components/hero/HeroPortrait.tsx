"use client";

import { Canvas } from "@react-three/fiber";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import type { RefObject } from "react";
import { Suspense, useState } from "react";

import TextReveal from "@/components/TextReveal";

import AnimatedPortraitPlane from "./AnimatedPortraitPlane";
import { heroEase, heroHeadings, type HeroCopyStep } from "./heroConstants";

type HeroPortraitProps = {
  heroSectionRef: RefObject<HTMLElement>;
};

export default function HeroPortrait({ heroSectionRef }: HeroPortraitProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copyStep, setCopyStep] = useState<HeroCopyStep>(0);

  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextStep: HeroCopyStep = latest < 0.33 ? 0 : latest < 0.66 ? 1 : 2;

    setCopyStep((currentStep) =>
      currentStep === nextStep ? currentStep : nextStep,
    );
  });

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
        filter: "blur(8px)",
      }}
      animate={{
        opacity: imageLoaded ? 1 : 0,
        y: imageLoaded ? 0 : 18,
        filter: imageLoaded ? "blur(0px)" : "blur(8px)",
      }}
      transition={{
        duration: 0.8,
        ease: heroEase,
      }}
      className="
        absolute
        left-0
        top-[31%]
        z-20

        sm:left-auto
        sm:right-0
        sm:top-[20%]

        lg:top-[19%]
      "
    >
      <div
        className="
          flex
          flex-col
          items-start

          sm:items-end
        "
      >
        <div
          className="
            mb-4
            w-[260px]
            text-left

            sm:mb-5
            sm:w-[250px]
            sm:text-right

            lg:mb-6
            lg:w-[300px]
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`heading-${copyStep}`}
              initial={{
                opacity: 0,
                y: 16,
                filter: "blur(7px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -14,
                filter: "blur(7px)",
              }}
              transition={{
                duration: 0.45,
                ease: heroEase,
              }}
            >
              <motion.p
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 0.55,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -6,
                }}
                transition={{
                  duration: 0.35,
                  ease: heroEase,
                }}
                className="
                  mb-2
                  text-[10px]
                  font-black
                  uppercase
                  leading-none
                  tracking-[0.08em]

                  sm:text-[10px]
                  lg:text-[11px]
                "
              >
                {`${String(copyStep + 1).padStart(2, "0")} / 03`}
              </motion.p>

              <TextReveal
                as="h1"
                mode="lines"
                once={false}
                className="
                  text-[18px]
                  font-black
                  uppercase
                  leading-[0.95]
                  tracking-[-0.025em]

                  sm:text-[15px]

                  md:text-[17px]

                  lg:text-[20px]
                  
                "
              >
                {heroHeadings[copyStep]}
              </TextReveal>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="
            relative
            aspect-[4/5]
            w-[44vw]
            max-w-[205px]
            overflow-visible

            sm:w-[17vw]
            sm:min-w-[185px]
            sm:max-w-[235px]

            lg:w-[17vw]
            lg:max-w-[260px]
          "
        >
          <Canvas
            dpr={[2, 3]}
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
                onLoadedAction={() => {
                  setImageLoaded(true);
                }}
              />
            </Suspense>
          </Canvas>

          <p
            className="
              absolute
              left-0
              top-full
              mt-2
              text-[10px]
              uppercase
              tracking-[0.045em]
              sm:hidden
            "
          >
            portrait / 2026
          </p>
        </div>
      </div>
    </motion.div>
  );
}
