"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import TextReveal from "@/components/TextReveal";

import LatestProjectPreview from "./LatestProjectPreview";

const ease = [0.22, 1, 0.36, 1] as const;

export default function MobileHeroContinuation() {
  return (
    <section
      className="
        bg-[#ececec]
        px-5
        pb-24
        pt-6
        text-[#211f1e]

        dark:bg-[#1e1c1a]
        dark:text-[#e7e3dd]

        sm:hidden
      "
    >
      {/* LATEST PROJECT */}
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 1,
          ease,
        }}
      >
        <LatestProjectPreview variant="mobile" />
      </motion.div>

      {/* ABOUT */}
      <div className="mt-32">
        <p
          className="
            mb-10
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.05em]
            opacity-45
          "
        >
          About
        </p>

        <TextReveal
          as="p"
          mode="lines"
          className="
            max-w-[92%]
            text-[28px]
            font-semibold
            uppercase
            leading-[0.98]
            tracking-[-0.01em]
          "
        >
          {
            "I like working across design and development, turning ideas into polished, expressive digital work."
          }
        </TextReveal>
      </div>

      {/* AVAILABILITY */}
      <motion.div
        initial={{
          opacity: 0,
          y: 24,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.9,
          ease,
        }}
        className="mt-32"
      >
        <p
          className="
            mb-10
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.05em]
            opacity-45
          "
        >
          Availability
        </p>

        <p
          className="
            max-w-[300px]
            text-[22px]
            font-semibold
            uppercase
            leading-[1]
            tracking-[-0.015em]
          "
        >
          Open for selected collaborations and creative projects.
        </p>
      </motion.div>
    </section>
  );
}
