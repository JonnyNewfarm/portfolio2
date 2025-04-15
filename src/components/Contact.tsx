"use client";
import Image from "next/image";

import wnb from "../../public/wnb.jpg";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import FlowerRotate from "./FlowerRotate";

export default function Section() {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center min-h-[150vh] overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div
        id="contact"
        className="absolute  scroll-mt-28 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] font-serif px-4 py-14 sm:px-10 sm:py-16 flex flex-col h-[75vh] bg-[#ecebeb] z-50"
      >
        <h1 className="text-center text-2xl sm:text-3xl">
          I’m always open to discussing new projects and collaboration
          opportunities. Let’s work together to create something exceptional.
        </h1>
        <FlowerRotate scrollYProgress={scrollYProgress} />

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 font-sans text-sm sm:text-base">
          <h1>jonasnygaard96@gmail.com</h1>
          <h1>github.com/JonnyNewfarm</h1>
        </div>
      </div>

      {/* Mobile Fix: Adjust height and ensure proper positioning */}
      <div className="fixed top-[-10vh] left-0 w-full h-full">
        {/* Applying motion.div for mobile might cause issues, so let's simplify */}
        <motion.div
          style={{ y }}
          className="relative w-full [@media(max-width:500px)]:h-full min-h-[150vh]"
        >
          <Image
            src={wnb}
            priority
            quality={100}
            fill
            alt="image"
            style={{
              objectFit: "cover",
              zIndex: -1, // Make sure image stays behind content
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
