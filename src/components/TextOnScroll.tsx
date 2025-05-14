"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

export default function StickyScrollParagraphs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="relative min-h-[60vh] bg-[#ececec] flex items-center justify-center px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 150 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="max-w-5xl flex flex-col md:pt-30 md:flex-row items-center text-center md:text-left justify-center gap-12 md:gap-30 text-[#1c1a17]"
      >
        <p className="flex-1 text-2xl sm:text-3xl lg:text-2xl xl:text-3 md:text-2xl px-4">
          Hi, I&apos;m Jonas, a 28-year-old designer and developer with a
          passion for creating seamless, user-friendly digital experiences. I
          like to work in JavaScript and TypeScript.
        </p>

        <div>
          <Link
            href={"/about"}
            className="px-6  py-2 border text-lg border-[#1c1a17] text-[#1c1a17] hover:bg-[#1c1a17] hover:text-white transition"
          >
            About Me
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
