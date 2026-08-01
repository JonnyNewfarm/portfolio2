"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

import TextReveal from "@/components/TextReveal";

import HeroBottomInfo from "./HeroBottomInfo";
import HeroPortrait from "./HeroPortrait";
import { heroEase } from "./heroConstants";
import Fullscreen3DRoom from "./room/Fullscreen3DRoom";

export default function Hero() {
  const heroSectionRef = useRef<HTMLElement | null>(null);

  const [show3DRoom, setShow3DRoom] = useState(false);

  const open3DRoom = useCallback(() => {
    setShow3DRoom(true);
  }, []);

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
            <HeroPortrait />

            <motion.div
              initial={{
                opacity: 0,
                x: -12,
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
                ease: heroEase,
              }}
              className="
                absolute
                left-0
                top-[64%]
                z-20
                text-[28px]
                
                font-black
                uppercase
                leading-[0.95]
    tracking-[0.04em]
                sm:top-[60%]

                sm:block
                sm:text-[40px]
                lg:top-[20vh]
                lg:text-[50px]
                
                xl:text-[70px]
              "
            >
              <TextReveal as="p" mode="lines">
                Designer & developer
              </TextReveal>
              <TextReveal>crafting interactive digital</TextReveal>
              <TextReveal>experiences.</TextReveal>
            </motion.div>

            <HeroBottomInfo onOpenRoomAction={open3DRoom} />
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {show3DRoom ? (
          <Fullscreen3DRoom
            key="fullscreen-3d-room"
            onCloseAction={close3DRoom}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
