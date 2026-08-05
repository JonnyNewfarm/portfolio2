"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import TextReveal from "@/components/TextReveal";

import { heroEase } from "./heroConstants";
import LatestProjectPreview from "./LatestProjectPreview";

export default function HeroBottomInfo() {
  const [localTime, setLocalTime] = useState("--:--");

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

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 14,
        filter: "blur(7px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.8,
        delay: 0.85,
        ease: heroEase,
      }}
      className="
        absolute
        bottom-[3.5%]
        left-0
        right-0
        z-30
      "
    >
      <div
        className="
          relative
          flex
          flex-col
          items-end
          gap-y-4
          text-[9px]
          font-semibold
          uppercase
          leading-none
          tracking-[0.04em]

          sm:text-[11px]

          lg:grid
          lg:grid-cols-[1fr_auto_auto_auto]
          lg:items-end
          lg:gap-x-[clamp(55px,7vw,120px)]
          lg:text-xl
        "
      >
        <div
          className="
            hidden

            sm:absolute
            sm:bottom-0
            sm:left-0
            sm:block

            lg:static
            lg:mr-auto
          "
        >
          <LatestProjectPreview />
        </div>

        <div className="hidden whitespace-nowrap lg:block">
          <TextReveal as="span">Location / Oslo, Norway</TextReveal>
        </div>

        <div className="hidden whitespace-nowrap lg:block">
          <TextReveal as="span">Local time /</TextReveal>{" "}
          <span className="inline-block tabular-nums">{localTime} (CEST)</span>
        </div>

        <div
          className="
          hidden whitespace-nowrap lg:block
          "
        >
          <TextReveal as="span">Portfolio / 2026</TextReveal>
        </div>

        <div
          className="
            flex
            flex-col
            items-end
            gap-y-2
            text-right
            text-[16px]

            lg:hidden
          "
        >
          <TextReveal as="span">Location / Oslo, Norway</TextReveal>

          <div className="whitespace-nowrap">
            <TextReveal as="span">Local time /</TextReveal>{" "}
            <span className="inline-block tabular-nums">
              {localTime} (CEST)
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
