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
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
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
        className="max-w-5xl px-0 flex flex-col items-start text-left justify-start gap-6 text-[#1c1a17]"
      >
        <motion.p
          variants={item}
          className="flex-1 text-xl sm:text-xl lg:text-2xl xl:text-3xl md:text-2xl px-4"
        >
          Hi, I&apos;m Jonas — a 28-year-old designer and developer passionate
          about creating seamless, user-friendly digital experiences.
        </motion.p>

        <motion.div variants={item}>
          <div className="px-6 py-2 hover:scale-105 hover:transition-transform hover:ease-in-out ml-4 whitespace-nowrap text-md border-stone-700 border rounded-[2px] text-[#1c1a17]">
            <Link href="/about">About Me</Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
