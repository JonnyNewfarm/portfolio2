"use client";
import Image from "next/image";
import wnb from "../../public/wnb.jpg";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, useEffect } from "react";
import FlowerRotate from "./FlowerRotate";

export default function Section() {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"]);

  // Ensuring SVG animation renders on mobile
  useEffect(() => {
    const svg = document.querySelector("svg");
    if (svg) {
      svg.style.visibility = "hidden";
      setTimeout(() => {
        svg.style.visibility = "visible";
      }, 100); // Delay to ensure proper rendering on mobile
    }
  }, []);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center min-h-[150vh] overflow-hidden text-[#1c1a17]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div
        id="contact"
        className="relative scroll-mt-28 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] px-4 py-14 sm:px-10 sm:py-16 flex flex-col h-[75vh] bg-[#ececec] z-50"
      >
        <h1 className="text-center text-xl sm:text-3xl">
          I’m always open to discuss new projects and collaboration
          opportunities. Let’s work together to create something exceptional.
        </h1>
        <FlowerRotate />

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-sm sm:text-base">
          <h1>jonasnygaard96@gmail.com</h1>
          <h1>github.com/JonnyNewfarm</h1>
        </div>
      </div>

      <div className="fixed top-[-10vh] left-0 w-full h-full">
        <motion.div style={{ y }} className="relative w-full min-h-[150vh]">
          <Image
            src={wnb}
            priority
            quality={100}
            fill
            alt="image"
            style={{
              objectFit: "cover",
              zIndex: -1,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
