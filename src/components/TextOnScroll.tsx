"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

export default function StickyScrollParagraphs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="relative min-h-[80vh] md:min-h-screen bg-[#ececec] flex items-center justify-center px-6 overflow-hidden">
      <div className="max-w-5xl  px-0 flex flex-col  items-start text-left  justify-start gap-8 text-[#1c1a17]">
        <div className="w-full h-full">
          <motion.p
            ref={ref}
            initial={false}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 150 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="flex-1 text-xl sm:text-xl lg:text-2xl xl:text-3xl md:text-2xl px-4"
          >
            Hi, I&apos;m Jonas, a 28-year-old designer and developer with a
            passion for creating seamless, user-friendly digital experiences. I
            like to work in JavaScript and TypeScript.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          initial={false}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 150 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className=""
        >
          <Link
            href={"/about"}
            className="px-6 py-2 hover:scale-105 transition-transform ease-in-out ml-4 whitespace-nowrap  text-lg border-[#1c1a17] border-2 font-semibold rounded-[2px] text-[#1c1a17]  "
          >
            About Me
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
