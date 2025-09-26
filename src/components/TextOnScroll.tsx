"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

export default function StickyScrollParagraphs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 80 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <div className="relative min-h-[80vh] md:min-h-screen bg-[#ececec] flex items-center justify-center px-6 overflow-hidden">
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="max-w-5xl px-0 flex flex-col items-start text-left justify-start gap-8 text-[#1c1a17]"
      >
        <motion.p
          variants={item}
          className="flex-1 text-xl sm:text-xl lg:text-2xl xl:text-3xl md:text-2xl px-4"
        >
          Hi, I&apos;m Jonas — a 28-year-old designer and developer passionate
          about creating seamless, user-friendly digital experiences.
        </motion.p>

        <motion.div variants={item}>
          <Link
            href="/about"
            className="px-6 py-2 hover:scale-105 transition-transform ease-in-out ml-4 whitespace-nowrap text-lg border-stone-700/80 border-2 font-semibold rounded-[2px] text-[#1c1a17]"
          >
            About Me
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
