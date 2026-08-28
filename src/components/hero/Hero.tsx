"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import TextReveal from "@/components/TextReveal";

import HeroBottomInfo from "./HeroBottomInfo";
import HeroPortrait from "./HeroPortrait";

export default function Hero() {
  const [isHeroReady, setIsHeroReady] = useState(false);

  return (
    <>
      <section
        className="
          relative
          h-[120dvh]
          bg-[#ececec]
          text-[#211f1e]
          dark:bg-[#1e1c1a]
          dark:text-[#e7e3dd]
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
            <HeroPortrait onReady={() => setIsHeroReady(true)} />

            <AnimatePresence>
              {!isHeroReady && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    pointer-events-none
                    absolute
                    bottom-5
                    right-0
                    z-50
                    sm:bottom-8
                  "
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="
                      h-5
                      w-5
                      rounded-full
                      border-[1.5px]
                      border-current/20
                      border-t-current
                    "
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="
                absolute
                left-0
                top-[64%]
                z-20
                sm:top-[60%]
                lg:top-[20vh]
              "
            >
              <TextReveal
                as="h1"
                mode="lines"
                delay={0.95}
                className="
                  text-[28px]
                  font-bold
                  uppercase
                  leading-[0.95]
                  tracking-[0em]
                  sm:text-[40px]
                  lg:text-[50px]
                  xl:text-[60px]
                "
              >
                {
                  "Designer & developer\ncrafting interactive digital\nexperiences."
                }
              </TextReveal>
            </div>

            <HeroBottomInfo />
          </div>
        </div>
      </section>
    </>
  );
}
