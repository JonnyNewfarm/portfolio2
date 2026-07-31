import type { RefObject } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useState } from "react";

import TextReveal from "@/components/TextReveal";

import { heroEase, heroHeadings, type HeroCopyStep } from "./heroConstants";

type HeroCopyProps = {
  heroSectionRef: RefObject<HTMLElement>;
};

export default function HeroCopy({ heroSectionRef }: HeroCopyProps) {
  const [copyStep, setCopyStep] = useState<HeroCopyStep>(0);

  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextStep: HeroCopyStep = latest < 0.33 ? 0 : latest < 0.66 ? 1 : 2;

    setCopyStep((currentStep) => {
      return currentStep === nextStep ? currentStep : nextStep;
    });
  });

  return (
    <div
      className="
        absolute
        left-0
        top-[16%]
        z-20
        max-w-[260px]
        sm:max-w-[320px]
        lg:top-[24%]
        lg:max-w-[340px]
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
              font-semibold
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
  );
}
