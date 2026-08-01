"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";

import TextReveal from "@/components/TextReveal";

import HeroBottomInfo from "./HeroBottomInfo";
import HeroPortrait from "./HeroPortrait";
import Fullscreen3DRoom from "./room/Fullscreen3DRoom";

export default function Hero() {
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
            <HeroPortrait />

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
